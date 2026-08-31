package conversation

import (
	"context"
	"strings"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/ports"
)

// The authored guided pass: a whole conversation written down in advance.
//
// The guided pass used to ask a model for three replies each turn, and the model also
// wrote the character's next line. That worked, and it was wrong for this particular
// job for three reasons:
//
//  1. LENGTH. A learner froze on the first turn, so the scaffolding has to last longer
//     than the first turn. What the situation needs is six to twelve exchanges — an
//     arrival, an assignment, a rule, a question, an escalation path, a close — and a
//     model asked "what could they say next" has no reason to build that arc, or to
//     end.
//  2. THE SAME CONVERSATION TWICE. The ladder teaches one situation twice: once with
//     choices, once alone. If the guided run is improvised, the second run is a
//     different conversation and the ladder's second rung teaches nothing it prepared
//     for.
//  3. IT IS A PHRASEBOOK, NOT AN IMPROVISATION. The three options are the lesson. Which
//     three appear should be a decision somebody made, reviewable in a file, not a
//     sample from a model that varies per run and per learner.
//
// So a scenario may carry its guided conversation in its own `steps` — already a JSON
// column, already seeded, already read by the screen for the opening line. No new table,
// no new endpoint: the choices call returns the authored three, and the message call
// returns the authored next line.
//
// Scenarios WITHOUT a script keep the model-driven guided pass. 3000 scenarios cannot
// all be written by hand, and a scaffold that only exists where someone authored it is
// still better than none.

// ScriptTurn is one beat: what the character says, and the three ways to answer.
//
// The character's line comes FIRST. A turn is "they speak, you choose" — so the last
// turn is the one with no choices, which is also how the screen knows the conversation
// is finished rather than waiting for input.
type ScriptTurn struct {
	// LineEN is the character's line, word for word.
	LineEN string
	// LineKO is the same line in the learner's own language, for the keyword help.
	// Optional.
	LineKO string
	// Mood the line is said in — same vocabulary as the model's tag (moodTone).
	Mood string
	// Choices are the three replies. Empty on the closing turn.
	Choices []Choice
	// Missions are the 1-based scenario goal numbers covered once this turn is reached,
	// cumulative. Authored rather than inferred: on a scripted turn there is no model
	// reading the transcript, and the tracker would otherwise never move.
	Missions []int
}

// Last reports the closing turn: the character has said their piece and there is
// nothing to pick.
func (t ScriptTurn) Last() bool { return len(t.Choices) == 0 }

// MinScriptTurns is the shortest authored conversation worth calling one.
//
// Six exchanges. Below that the guided pass ends before the learner has done anything
// but say their name — which is the complaint that started this — and a two-turn script
// would be worse than the model, which at least keeps going.
const MinScriptTurns = 7 // 6 replies + the closing line

// ScriptOf reads the authored conversation out of a scenario's steps.
//
// Returns nil when there is no script, INCLUDING when there is exactly one dialogue step
// with no choices — that is the opening line every scenario has had since v16, not a
// conversation. Being strict here is what keeps the model-driven path working for the
// 3000 scenarios nobody has authored.
func ScriptOf(sc *content.Scenario) []ScriptTurn {
	if sc == nil {
		return nil
	}
	// The marker is `choices`, not the step count: v16 content already puts two dialogue
	// steps on most scenarios (an NPC line and a player line), and neither is a script.
	scripted := false
	for _, st := range sc.Steps {
		if st.Type == content.StepDialogue && len(choicesOf(st.Payload)) > 0 {
			scripted = true
			break
		}
	}
	if !scripted {
		return nil
	}
	var out []ScriptTurn
	for _, st := range sc.Steps {
		if st.Type != content.StepDialogue {
			continue
		}
		t := ScriptTurn{
			LineEN:   str(st.Payload, "lineEn"),
			LineKO:   str(st.Payload, "lineKo"),
			Mood:     str(st.Payload, "mood"),
			Choices:  choicesOf(st.Payload),
			Missions: intsOf(st.Payload, "missions"),
		}
		if t.LineEN == "" {
			// A beat with no line is not recoverable: the character would say nothing
			// and the learner would be picking a reply to silence.
			return nil
		}
		out = append(out, t)
	}
	// A script has to be a conversation. Anything shorter is the opening line, or an
	// authoring mistake — and half a script is worse than none, because the learner
	// would be dropped into free text mid-conversation with no warning.
	if len(out) < MinScriptTurns {
		return nil
	}
	// Every turn but the last offers three replies; the last offers none. A turn in the
	// middle with no choices would strand the run: the screen has no input in the
	// guided pass, so there would be nothing to do.
	for i, t := range out {
		if i < len(out)-1 && len(t.Choices) != ChoiceCount {
			return nil
		}
	}
	if !out[len(out)-1].Last() {
		return nil
	}
	return out
}

func str(p map[string]any, k string) string {
	if p == nil {
		return ""
	}
	s, _ := p[k].(string)
	return s
}

func intsOf(p map[string]any, k string) []int {
	if p == nil {
		return nil
	}
	raw, ok := p[k].([]any)
	if !ok {
		return nil
	}
	var out []int
	for _, v := range raw {
		switch n := v.(type) {
		case int:
			out = append(out, n)
		case int64:
			out = append(out, int(n))
		case float64: // JSON round-trip: everything numeric arrives as float64
			out = append(out, int(n))
		}
	}
	return out
}

func choicesOf(p map[string]any) []Choice {
	if p == nil {
		return nil
	}
	raw, ok := p["choices"].([]any)
	if !ok {
		return nil
	}
	var out []Choice
	for _, v := range raw {
		m, ok := v.(map[string]any)
		if !ok {
			continue
		}
		c := Choice{Tier: ChoiceTier(str(m, "tier")), Text: str(m, "text"), Why: str(m, "why")}
		if c.Text == "" || !AllowedTiers[c.Tier] {
			continue
		}
		out = append(out, c)
	}
	return out
}

// scriptFor returns the authored conversation driving a session, or nil.
//
// Two conditions, and both matter. The session has to be a GUIDED one — the free pass is
// the learner doing it alone, and handing them the same three cards would delete the
// ladder's second rung. And the scenario has to actually carry a script.
func (e *Engine) scriptFor(ctx context.Context, sess *ports.ConversationSession) ([]ScriptTurn, *content.Scenario, error) {
	if sess == nil || sess.Guide != GuideChoices {
		return nil, nil, nil
	}
	sc, err := e.content.GetScenario(ctx, sess.ScenarioID)
	if err != nil {
		return nil, nil, err
	}
	return ScriptOf(sc), sc, nil
}

// GuideChoices is the guided rung's value as persisted on a session.
//
// Duplicated from curriculum.GuideLevel rather than imported: the conversation domain
// does not otherwise know the curriculum exists, and a dependency in that direction
// would make the engine unbuildable without the catalog.
const GuideChoices = "choices"

// ScriptedTurn is where a scripted session currently stands.
type ScriptedTurn struct {
	// Turn is the 0-based beat the learner is answering.
	Turn int
	// Total is how many beats the conversation has.
	Total int
	// Choices are the three replies for this beat. Empty on the closing beat.
	Choices []Choice
	// Done is true once the closing beat is reached: nothing left to pick.
	Done bool
}

// NameToken is replaced with the learner's own display name in an authored reply.
//
// It has to be a token. The greeting scenarios teach saying your own name, and a name
// written into the content file would have every learner in the world introducing
// themselves as the same person — in the one conversation whose point is that they are
// not. When the learner has not set a name, the clause is dropped rather than filled with
// an id: "Hi, 7F3A2B — I'm the new nurse" is worse than no name at all.
const NameToken = "{name}"

func fillName(text, name string) string {
	if !strings.Contains(text, NameToken) {
		return text
	}
	if name == "" {
		// "Hi, {name} — I'm the new nurse…" becomes "Hi — I'm the new nurse…", and the
		// double space that would leave is collapsed.
		text = strings.ReplaceAll(text, NameToken+" — ", "")
		text = strings.ReplaceAll(text, NameToken, "")
		return strings.Join(strings.Fields(text), " ")
	}
	return strings.ReplaceAll(text, NameToken, name)
}

// learnerName is the display name, or "" when there is none (or no profile reader —
// several tests build the engine without one).
func (e *Engine) learnerName(ctx context.Context, userID string) string {
	if e.profiles == nil {
		return ""
	}
	p, err := e.profiles.GetProfile(ctx, userID)
	if err != nil || p == nil {
		return ""
	}
	return p.DisplayName
}

// ScriptedChoices returns the authored replies for where the session stands, or
// (nil, false) when this session is not driven by a script.
//
// The beat is derived from how many turns the LEARNER has taken, not from a counter on
// the session: a resumed conversation then lands on the right beat without anything
// having been stored, and a transcript is the one record that cannot drift from itself.
func (e *Engine) ScriptedChoices(ctx context.Context, userID, sessionID string) (ScriptedTurn, bool, error) {
	sess, err := e.convo.GetSession(ctx, sessionID)
	if err != nil {
		return ScriptedTurn{}, false, err
	}
	if sess == nil || sess.UserID != userID {
		return ScriptedTurn{}, false, ErrSessionNotFound
	}
	script, _, err := e.scriptFor(ctx, sess)
	if err != nil || script == nil {
		return ScriptedTurn{}, false, err
	}
	turns, err := e.convo.History(ctx, sessionID, TranscriptLimit)
	if err != nil {
		return ScriptedTurn{}, false, err
	}
	at := userTurns(turns)
	if at >= len(script) {
		// Past the end: a transcript longer than the script (the script was shortened
		// after this conversation started). Report finished rather than crash — the
		// learner can close the situation, which is what they were about to do anyway.
		return ScriptedTurn{Turn: len(script) - 1, Total: len(script), Done: true}, true, nil
	}
	t := script[at]
	name := e.learnerName(ctx, userID)
	out := make([]Choice, 0, len(t.Choices))
	for _, c := range t.Choices {
		c.Text = fillName(c.Text, name)
		out = append(out, c)
	}
	return ScriptedTurn{Turn: at, Total: len(script), Choices: out, Done: t.Last()}, true, nil
}

// scriptedReply answers a scripted turn without a model.
//
// Returns handled=false when the session is not scripted, and the caller falls through
// to the model — which is the path every unauthored scenario takes.
func (e *Engine) scriptedReply(ctx context.Context, userID, sessionID, text string) (Reply, bool, error) {
	sess, err := e.convo.GetSession(ctx, sessionID)
	if err != nil {
		return Reply{}, false, err
	}
	if sess == nil || sess.UserID != userID {
		return Reply{}, false, ErrSessionNotFound
	}
	script, _, err := e.scriptFor(ctx, sess)
	if err != nil || script == nil {
		return Reply{}, false, err
	}
	turns, err := e.convo.History(ctx, sessionID, TranscriptLimit)
	if err != nil {
		return Reply{}, false, err
	}
	at := userTurns(turns)
	next := at + 1 // they answered beat `at`; the character's next line is the one after
	if next >= len(script) {
		next = len(script) - 1
	}
	prevMood, _ := e.convo.LatestAssistantMood(ctx, sessionID)

	if err := e.convo.AppendTurn(ctx, sessionID, "user", text, ""); err != nil {
		return Reply{}, false, err
	}
	t := script[next]
	if err := e.convo.AppendTurn(ctx, sessionID, "assistant", t.LineEN, t.Mood); err != nil {
		return Reply{}, false, err
	}
	// No correction card is filed. The learner picked a sentence WE wrote — correcting
	// it would put "you could have phrased this better" in the review lab against our
	// own model answer. The free pass, where they write it themselves, is where
	// corrections belong.
	return Reply{
		Text:     t.LineEN,
		Mood:     t.Mood,
		Improved: MoodImproved(prevMood, t.Mood),
		Resolved: t.Last(),
		Missions: t.Missions,
	}, true, nil
}

func userTurns(turns []ports.ConversationTurn) int {
	n := 0
	for _, t := range turns {
		if t.Role == "user" {
			n++
		}
	}
	return n
}
