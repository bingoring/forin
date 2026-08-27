package conversation

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/domain/reputation"
	"github.com/bingoring/forin/server/internal/economy"
	"github.com/bingoring/forin/server/internal/ports"
)

const historyLimit = 20

var (
	ErrScenarioNotFound = errors.New("scenario not found")
	ErrSessionNotFound  = errors.New("session not found")
)

// Engine orchestrates persona-driven dialogue and AI correction over the ports.
type Engine struct {
	content         ports.ContentReader
	convo           ports.ConversationRepo
	review          ports.ReviewRepo
	profiles        ports.ProfileReader
	reputation      ports.ProgressReader
	repWriter       ports.ReputationWriter
	llm             ports.LLMPort
	strategy        Strategy
	correctionModel string
	gradingModel    string
}

func NewEngine(c ports.ContentReader, convo ports.ConversationRepo, review ports.ReviewRepo,
	profiles ports.ProfileReader, reputation ports.ProgressReader, repWriter ports.ReputationWriter,
	llm ports.LLMPort, strategy Strategy, correctionModel, gradingModel string) *Engine {
	return &Engine{content: c, convo: convo, review: review, profiles: profiles,
		reputation: reputation, repWriter: repWriter, llm: llm, strategy: strategy, correctionModel: correctionModel, gradingModel: gradingModel}
}

// langContext is the user's language framing for prompts (never hardcoded).
type langContext struct {
	Native string // human name, e.g. "Korean"
	Target string // human name, e.g. "English"
	Job    string
}

// langName maps an ISO-ish code to a human language name for the prompt.
func langName(code string) string {
	switch code {
	case "ko":
		return "Korean"
	case "en":
		return "English"
	case "de":
		return "German"
	case "ja":
		return "Japanese"
	case "zh":
		return "Chinese"
	case "es":
		return "Spanish"
	case "fr":
		return "French"
	case "":
		return ""
	default:
		return code
	}
}

// langFor loads the user's profile and derives native/target languages + job.
// Falls back to the launch market (Korean→English nurse) only when the profile is absent.
func (e *Engine) langFor(ctx context.Context, userID string) langContext {
	lc := langContext{Native: "Korean", Target: "English", Job: "healthcare worker"}
	p, err := e.profiles.GetProfile(ctx, userID)
	if err != nil || p == nil {
		return lc
	}
	if n := langName(p.NativeLang); n != "" {
		lc.Native = n
	}
	if t := langName(p.TargetLang); t != "" {
		lc.Target = t
	}
	if p.Job != "" {
		lc.Job = p.Job
	}
	return lc
}

// StartSession validates the scenario and opens a conversation session.
func (e *Engine) StartSession(ctx context.Context, userID, scenarioID string) (string, error) {
	sc, err := e.content.GetScenario(ctx, scenarioID)
	if err != nil {
		return "", err
	}
	if sc == nil {
		return "", ErrScenarioNotFound
	}
	return e.convo.CreateSession(ctx, userID, scenarioID)
}

// TranscriptLimit is how many turns a resumed conversation hands back. Generous
// on purpose: this is for the learner reading their own history, not for the LLM
// context window (prepare() uses its own, smaller limit).
const TranscriptLimit = 200

// Resumable reports the conversation this learner can pick up for a scenario:
// the newest session that has turns, plus those turns. Returns ("", nil, nil)
// when there is nothing to resume.
// Discard throws a conversation away: it stops being offered for resuming, and the
// learner's next visit to the scenario starts clean.
//
// The turns are left in place. Study time is derived from them, and the learner did spend
// those minutes — discarding is a statement about what should come back, not a licence to
// unmake what happened.
func (e *Engine) Discard(ctx context.Context, userID, sessionID string) (bool, error) {
	return e.convo.DiscardSession(ctx, userID, sessionID)
}

func (e *Engine) Resumable(ctx context.Context, userID, scenarioID string) (string, []ports.ConversationTurn, error) {
	sessionID, n, err := e.convo.LatestSessionWithTurns(ctx, userID, scenarioID)
	if err != nil || sessionID == "" || n == 0 {
		return "", nil, err
	}
	turns, err := e.convo.History(ctx, sessionID, TranscriptLimit)
	if err != nil {
		return "", nil, err
	}
	return sessionID, turns, nil
}

// ResumeSession re-enters an existing session instead of starting a new one.
// The ownership + scenario check is the point: a session id is a bearer token
// for someone's conversation, so resuming one that is not yours (or belongs to a
// different scenario) must fail rather than silently continue the wrong thread.
func (e *Engine) ResumeSession(ctx context.Context, userID, scenarioID, sessionID string) error {
	sess, err := e.convo.GetSession(ctx, sessionID)
	if err != nil {
		return err
	}
	if sess == nil || sess.UserID != userID || sess.ScenarioID != scenarioID {
		return ErrSessionNotFound
	}
	return nil
}

// NPCLine is the latest thing the character said, plus the persona facts a voice
// picker needs. Returned as raw fields rather than a speech.PersonaVoice so this
// package does not have to import domain/speech — the HTTP layer assembles it.
type NPCLine struct {
	Text     string
	Role     string
	Gender   string
	AgeRange string
}

// LatestNPCLine returns the most recent assistant turn of a session the caller
// owns. Ownership is checked for the same reason ResumeSession checks it: a
// session id would otherwise read out someone else's conversation.
func (e *Engine) LatestNPCLine(ctx context.Context, userID, sessionID string) (NPCLine, error) {
	sess, err := e.convo.GetSession(ctx, sessionID)
	if err != nil {
		return NPCLine{}, err
	}
	if sess == nil || sess.UserID != userID {
		return NPCLine{}, ErrSessionNotFound
	}
	turns, err := e.convo.History(ctx, sessionID, TranscriptLimit)
	if err != nil {
		return NPCLine{}, err
	}
	text := ""
	for i := len(turns) - 1; i >= 0; i-- {
		if turns[i].Role != "user" {
			text = turns[i].Content
			break
		}
	}
	if text == "" {
		return NPCLine{}, nil // no NPC turn yet — silence, not an error
	}
	sc, err := e.content.GetScenario(ctx, sess.ScenarioID)
	if err != nil || sc == nil {
		// The line is worth speaking even if we cannot read the persona; the voice
		// picker falls back on locale.
		return NPCLine{Text: text}, nil
	}
	return NPCLine{Text: text, Role: sc.Persona.Role, Gender: sc.Persona.Gender, AgeRange: sc.Persona.AgeRange}, nil
}

// prepare validates the session/scenario, records the user's line, and builds the
// system prompt + message history for the LLM. Shared by SendMessage(+Stream).
func (e *Engine) prepare(ctx context.Context, userID, sessionID, text string) (string, []ports.LLMMessage, *content.Scenario, string, error) {
	sess, err := e.convo.GetSession(ctx, sessionID)
	if err != nil {
		return "", nil, nil, "", err
	}
	if sess == nil || sess.UserID != userID {
		return "", nil, nil, "", ErrSessionNotFound
	}
	sc, err := e.content.GetScenario(ctx, sess.ScenarioID)
	if err != nil {
		return "", nil, nil, "", err
	}
	if sc == nil {
		return "", nil, nil, "", ErrScenarioNotFound
	}
	// The last NPC line before this user turn — the line the learner is replying to.
	priorNpc := ""
	if hist, e2 := e.convo.History(ctx, sessionID, historyLimit); e2 == nil {
		for i := len(hist) - 1; i >= 0; i-- {
			if hist[i].Role == "assistant" {
				priorNpc = hist[i].Content
				break
			}
		}
	}
	if err := e.convo.AppendTurn(ctx, sessionID, "user", text, ""); err != nil {
		return "", nil, nil, "", err
	}
	hist, err := e.convo.History(ctx, sessionID, historyLimit)
	if err != nil {
		return "", nil, nil, "", err
	}
	msgs := make([]ports.LLMMessage, 0, len(hist))
	for _, t := range hist {
		msgs = append(msgs, ports.LLMMessage{Role: t.Role, Content: t.Content})
	}
	return buildSystemPrompt(sc, e.langFor(ctx, userID), e.reputationDisposition(ctx, userID, sc)), msgs, sc, priorNpc, nil
}

// warmTitles are equipped career titles that grant a first-impression warmth
// nudge (칭호 효과). Kept in sync with the mobile title catalog's `warm` flag.
var warmTitles = map[string]bool{"ward_friend": true, "hidden_hero": true}

// reputationDisposition turns the learner's standing into a one-line baseline
// attitude for the NPC — so a well-regarded nurse meets warmer, more cooperative
// characters, and a poorly-regarded one meets warier ones. Tone only; it never
// changes clinical facts or the "stay in character / never coach" rules.
func (e *Engine) reputationDisposition(ctx context.Context, userID string, sc *content.Scenario) string {
	if e.reputation == nil {
		return ""
	}
	p, err := e.reputation.GetProgress(ctx, userID)
	if err != nil || p == nil {
		return ""
	}
	// Which standing this NPC reads comes from the SAME resolver that decides
	// which one a clear moves — so what the learner earns is what they are judged
	// on. Acuity outranks role: in an emergency it is the response that matters.
	cat := reputation.CatalogFor(sc.Profession)
	if !cat.Valid() {
		return ""
	}
	key := cat.Resolve(sc.Persona.Role, reputation.NormalizeAcuity(sc.Acuity))
	dim, score := string(key), economy.Active.ReputationDefault
	for _, st := range p.Reputation {
		if st.Key == string(key) {
			// The NPC-facing wording is the dimension key with underscores opened
			// out; the Korean label is for the player's screen, not the prompt.
			dim, score = strings.ReplaceAll(st.Key, "_", " "), st.Value
			break
		}
	}
	// Equipped "warm" title (칭호 효과): a small first-impression nudge so the NPC
	// starts a touch warmer. Applied AFTER the dimension is chosen so the bonus
	// lands on the score actually used (patient satisfaction OR peer trust).
	if e.profiles != nil {
		if pr, err := e.profiles.GetProfile(ctx, userID); err == nil && pr != nil && warmTitles[pr.EquippedTitle] {
			score += economy.Active.TitleWarmthBonus
		}
	}
	who := "This character"
	var tone string
	switch {
	case score >= economy.Active.RepBandWarm:
		tone = fmt.Sprintf("%s already regards this learner highly (%s is high). Be noticeably warm, cooperative, and quick to trust — while staying fully in character.", who, dim)
	case score >= economy.Active.RepBandCordial:
		tone = fmt.Sprintf("%s feels neutral-to-cordial toward this learner (%s is moderate). React normally and fairly.", who, dim)
	case score >= economy.Active.RepBandWary:
		tone = fmt.Sprintf("%s is a little wary of this learner (%s is low). Be slightly guarded and need some reassurance before opening up — while staying in character.", who, dim)
	default:
		tone = fmt.Sprintf("%s does not yet trust this learner (%s is very low). Be reserved, terse, and slow to cooperate until reassured — while staying in character. Never explain why.", who, dim)
	}
	return tone
}

// SendMessage records the user's line, generates the NPC reply in persona, persists both.
// Reply is one NPC turn: what was said, how the character feels having heard the
// learner, and whether that is better than a moment ago.
//
// Improved is computed on the server rather than left to the client because it needs
// the PREVIOUS turn's mood, which lives in storage — a client would have to remember
// it across an app restart, and a resumed conversation would celebrate its first turn.
type Reply struct {
	Text string
	// Mood is "" when the model did not tag its reply (or tagged it unreadably). The
	// screen then leaves the portrait as it was, which is how it behaved before moods
	// existed.
	Mood string
	// Improved is true only when this turn moved the character to a better place.
	// Never true on a first turn, a decline, or no change — the app celebrates
	// improvement and stays silent otherwise.
	Improved bool
	// Resolved: the character considers everything they needed handled. This is what
	// lets the app tell the learner they are done — without it they cannot know, and
	// the reported behaviour was carrying on well past the point of resolution.
	//
	// It is the CHARACTER's view, not a grade. Whether the run actually clears is
	// still decided at the end by goal coverage (score.go), and the two can disagree:
	// a patient can be satisfied by a conversation that skipped a goal. So the app
	// asks rather than ends.
	Resolved bool
	// Missions are the 1-based scenario goal numbers the character says have been
	// covered so far, cumulative. Empty when none, and always empty while
	// MissionProgressEnabled is false — see missions.go for how to remove the feature.
	//
	// Also the character's view, and for the same reason: it drives a live tracker,
	// not the grade. The score is still computed at the end from the transcript, with
	// evidence required per goal.
	Missions []int
}

func (e *Engine) SendMessage(ctx context.Context, userID, sessionID, text string) (Reply, error) {
	// Read BEFORE prepare appends the user turn — prepare does not touch assistant
	// turns, but reading first makes the ordering independent of that detail.
	prevMood, _ := e.convo.LatestAssistantMood(ctx, sessionID)
	system, msgs, sc, priorNpc, err := e.prepare(ctx, userID, sessionID, text)
	if err != nil {
		return Reply{}, err
	}
	raw, err := e.strategy.Generate(ctx, system, msgs)
	if err != nil {
		return Reply{}, err
	}
	mood, resolved, flags, reply := splitTag(strings.TrimSpace(raw))
	reply = strings.TrimSpace(reply)
	missions := parseMissions(flags, len(sc.Goals))
	if err := e.convo.AppendTurn(ctx, sessionID, "assistant", reply, mood); err != nil {
		return Reply{}, err
	}
	e.fileCorrection(userID, text, sc, priorNpc) // background: AI-correct the learner's line → review card
	return Reply{Text: reply, Mood: mood, Improved: MoodImproved(prevMood, mood), Resolved: resolved, Missions: missions}, nil
}

// SendMessageStream streams the NPC reply and persists the full turn.
//
// `onMood` fires at most once, as soon as the tag at the head of the reply is read —
// before any text reaches the learner, so the portrait and the bubble's border are
// already right when the first words appear. It may not fire at all (an untagged
// reply), and the screen then keeps what it was showing.
//
// `onDelta` never sees the tag: the stripper holds the head of the stream back until
// it is resolved. What the model produced and what the learner reads differ by
// exactly that tag, and the persisted turn stores the reader's version.
func (e *Engine) SendMessageStream(ctx context.Context, userID, sessionID, text string, onMood func(string), onDelta func(string) error) (Reply, error) {
	prevMood, _ := e.convo.LatestAssistantMood(ctx, sessionID)
	system, msgs, sc, priorNpc, err := e.prepare(ctx, userID, sessionID, text)
	if err != nil {
		return Reply{}, err
	}
	mood, resolved, flags := "", false, ""
	strip := newMoodStripper(func(m string, done bool, f string) {
		mood, resolved, flags = m, done, f
		if onMood != nil {
			onMood(m)
		}
	}, onDelta)
	raw, err := e.strategy.GenerateStream(ctx, system, msgs, strip.Write)
	if err != nil {
		return Reply{}, err
	}
	if err := strip.Flush(); err != nil {
		return Reply{}, err
	}
	// The persisted text comes from the full raw reply, not from the streamed pieces:
	// a provider that returns the whole reply and calls onDelta zero times is allowed,
	// and the stored turn must be the same sentence either way.
	tagged, taggedResolved, taggedFlags, reply := splitTag(strings.TrimSpace(raw))
	if mood == "" {
		mood = tagged
	}
	// A provider that streamed nothing still tagged its reply.
	resolved = resolved || taggedResolved
	if flags == "" {
		flags = taggedFlags
	}
	reply = strings.TrimSpace(reply)
	if err := e.convo.AppendTurn(ctx, sessionID, "assistant", reply, mood); err != nil {
		return Reply{}, err
	}
	e.fileCorrection(userID, text, sc, priorNpc) // background: AI-correct the learner's line → review card
	return Reply{Text: reply, Mood: mood, Improved: MoodImproved(prevMood, mood), Resolved: resolved,
		Missions: parseMissions(flags, len(sc.Goals))}, nil
}

// fileCorrection runs an AI correction on the learner's utterance in the background
// and files a review card (with the scenario/dialogue context) only when the
// corrected phrasing meaningfully differs. Fire-and-forget so it never blocks (or
// fails) the dialogue reply. Skips trivial utterances (< 3 words) to avoid noise/cost.
func (e *Engine) fileCorrection(userID, text string, sc *content.Scenario, priorNpc string) {
	if len(strings.Fields(text)) < 3 {
		return
	}
	rc := progress.ReviewContext{Npc: priorNpc}
	if sc != nil {
		rc.Title = sc.Title
		rc.Situation = sc.Tagline
		if sc.Briefing != nil {
			rc.Dept = sc.Briefing.Dept
			if sc.Briefing.Brief != "" {
				rc.Situation = sc.Briefing.Brief
			}
		}
	}
	scenarioID := ""
	if sc != nil {
		scenarioID = sc.ID
	}
	go func() {
		defer func() { _ = recover() }()
		_, _ = e.Correct(context.Background(), userID, text, rc.Situation, scenarioID, rc)
	}()
}

// Correction is the result of correcting a user's English utterance.
type Correction struct {
	Original  string `json:"original"`
	Corrected string `json:"corrected"`
	Note      string `json:"note"`
	CardID    string `json:"cardId,omitempty"`
}

// Correct fixes the utterance (cheaper model), stores it, and creates a review card.
func (e *Engine) Correct(ctx context.Context, userID, utterance, contextText, scenarioID string, rc progress.ReviewContext) (*Correction, error) {
	lc := e.langFor(ctx, userID)
	sys := fmt.Sprintf("You are a %[1]s coach for %[2]s-speaking %[3]ss. Correct the user's %[1]s to natural, "+
		"clinically appropriate phrasing. Respond ONLY with JSON: {\"corrected\": string, \"note\": string}. "+
		"\"note\" briefly explains in %[2]s why it is more natural. If already correct, return it unchanged with an encouraging note.",
		lc.Target, lc.Native, lc.Job)
	user := utterance
	if contextText != "" {
		user = "Context: " + contextText + "\nUtterance: " + utterance
	}
	raw, err := e.llm.Complete(ctx, ports.LLMRequest{
		Model: e.correctionModel, System: sys,
		Messages: []ports.LLMMessage{{Role: "user", Content: user}}, MaxTokens: 512,
	})
	if err != nil {
		return nil, err
	}

	c := &Correction{Original: utterance, Corrected: strings.TrimSpace(raw)}
	if i, j := strings.IndexByte(raw, '{'), strings.LastIndexByte(raw, '}'); i >= 0 && j > i {
		var p struct {
			Corrected string `json:"corrected"`
			Note      string `json:"note"`
		}
		if json.Unmarshal([]byte(raw[i:j+1]), &p) == nil && p.Corrected != "" {
			c.Corrected, c.Note = p.Corrected, p.Note
		}
	}

	// Only persist a review card when the correction is a real change — otherwise
	// "already correct" utterances would spam the review lab.
	if changed(c.Original, c.Corrected) {
		_ = e.convo.SaveCorrection(ctx, userID, c.Original, c.Corrected, c.Note, "")
		if id, err := e.review.CreateCard(ctx, ports.NewReviewCard{
			UserID: userID, Source: "correction", Front: c.Original, Back: c.Corrected, Note: c.Note,
			ScenarioID: scenarioID, Context: rc}); err == nil {
			c.CardID = id
		}
	}
	return c, nil
}

// changed reports whether the correction differs from the original after
// normalizing case, surrounding whitespace, and trailing punctuation.
func changed(original, corrected string) bool {
	norm := func(s string) string {
		s = strings.ToLower(strings.TrimSpace(s))
		s = strings.TrimRight(s, ".!?,;: ")
		return strings.Join(strings.Fields(s), " ")
	}
	return corrected != "" && norm(original) != norm(corrected)
}

// buildSystemPrompt composes the persona + scenario goals/guardrails into a role-play instruction,
// framed by the user's native/target language (never hardcoded). `disposition` is an
// optional reputation-driven baseline attitude line for the NPC (may be empty).
func buildSystemPrompt(sc *content.Scenario, lc langContext, disposition string) string {
	var b strings.Builder
	b.WriteString(fmt.Sprintf("You are role-playing a character in a clinical %s-language practice scenario "+
		"for a %s-speaking %s preparing to work abroad.\n", lc.Target, lc.Native, lc.Job))
	b.WriteString(fmt.Sprintf("Scenario: %s — %s\n", sc.Title, sc.Tagline))
	p := sc.Persona
	b.WriteString("Your character:\n")
	writeIf(&b, "Name", p.Name)
	writeIf(&b, "Role", p.Role)
	writeIf(&b, "Age", p.AgeRange)
	writeIf(&b, "Personality", p.Personality)
	writeIf(&b, "Speaking style", p.SpeakingStyle)
	writeIf(&b, "Current mood", p.Mood)
	// Who the user is + strict turn-taking. Without this the model can drift into
	// "coaching" — rephrasing/elaborating the learner's line instead of replying
	// in character (the reported "my answer, elaborated" bug).
	b.WriteString(fmt.Sprintf("\nThe person messaging you is the LEARNER, playing the %[1]s. Every message they send is what the %[1]s says to you out loud. React to it strictly IN CHARACTER as the person described above.\n", lc.Job))
	b.WriteString("ABSOLUTE RULES:\n")
	b.WriteString("- NEVER correct, rephrase, translate, repeat, or 'improve' the learner's words.\n")
	b.WriteString("- NEVER coach, explain, give feedback, or demonstrate better phrasing.\n")
	b.WriteString(fmt.Sprintf("- NEVER speak for the %s or answer on their behalf; only your own character speaks.\n", lc.Job))
	b.WriteString("- NEVER break character, narrate, or add meta commentary.\n")
	if len(sc.Goals) > 0 {
		b.WriteString("The learner is trying to practice: " + strings.Join(sc.Goals, "; ") + ". Respond naturally so they get that practice — but do NOT teach.\n")
	}
	if len(sc.Guardrails) > 0 {
		b.WriteString("Tone guardrails: " + strings.Join(sc.Guardrails, "; ") + "\n")
	}
	if disposition != "" {
		b.WriteString("Baseline disposition (reputation): " + disposition + "\n")
	}
	b.WriteString(fmt.Sprintf("Reply in %s only, as 1-3 short spoken sentences your character would actually say in a real hospital.\n", lc.Target))
	// Last, so it is the instruction closest to the reply the model is about to write —
	// the tag is a formatting rule and the ones above are character rules.
	b.WriteString(moodInstruction)
	// Numbered goals + the bookkeeping request. Empty string while the feature is off
	// (missions.go), so the prompt is byte-identical to before it existed.
	b.WriteString(missionInstruction(sc.Goals))
	return b.String()
}

func writeIf(b *strings.Builder, label, val string) {
	if val != "" {
		b.WriteString("- " + label + ": " + val + "\n")
	}
}
