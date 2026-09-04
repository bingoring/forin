package conversation

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// Three things the learner could say next.
//
// Testers said the honest thing: facing a patient and an empty text box, they did not
// know how to start. This is the answer for the guided part of a curriculum — the
// character speaks, and three real replies appear under it.
//
// The three are BEST, STRONG and FAIR, and none of them is wrong. Offering a bad option
// would make this a quiz, and nobody picks the bad one anyway — the choice would be
// theatre. What the learner is actually choosing between is three ways of being
// competent, which is the thing a textbook cannot show them: the best one asks the
// question that changes what happens next, the fair one is merely polite and safe.
//
// A separate call from the reply, deliberately. The NPC's line is streamed token by
// token (SendMessageStream), and wrapping it in a JSON envelope to carry choices
// alongside would mean holding the whole reply back until it parsed — trading the thing
// that makes the conversation feel alive for a list that can arrive a moment later.

// ChoiceTier ranks a suggestion without ever calling one of them wrong.
type ChoiceTier string

const (
	// TierBest is the reply a strong nurse would give: it moves the situation on.
	TierBest ChoiceTier = "best"
	// TierStrong is correct and useful, but leaves something on the table.
	TierStrong ChoiceTier = "strong"
	// TierFair is safe and polite — no mistake, no progress.
	TierFair ChoiceTier = "fair"
)

// Choice is one suggested reply.
type Choice struct {
	Tier ChoiceTier `json:"tier"`
	// Intent is what to convey, in the learner's OWN (native) language — the thing the
	// card shows. The learner reads this and produces the target-language line THEMSELVES
	// (guided-turn redesign): the card no longer hands them the words, it hands them the
	// goal. Native, never hardcoded to any one language — it follows the profile.
	Intent string `json:"intent"`
	// Text is the model line in the TARGET language — what a strong answer to this intent
	// sounds like, word for word. No longer shown as the pickable option; it stays as the
	// hidden model that grounds the immediate correction and the completion screen's
	// model answer, and can be revealed as a hint if the learner is stuck.
	Text string `json:"text"`
	// Why is one line in the learner's OWN language saying what this reply achieves —
	// the difference between the three is the lesson, and it is invisible otherwise.
	Why string `json:"why"`
}

// AllowedTiers is the code-side set, so an authored script naming an unknown tier is
// dropped rather than shown as an unlabelled card. Extensible on purpose: a new tier
// needs an entry here and nothing else.
var AllowedTiers = map[ChoiceTier]bool{TierBest: true, TierStrong: true, TierFair: true}

// ChoiceCount is how many are offered. Three: two is a coin toss with no middle, four
// is a menu to read rather than a decision to make.
const ChoiceCount = 3

// SuggestReplies asks for three ways to answer the character's latest line.
//
// Returns an empty slice rather than an error when the model gives nothing usable: the
// screen falls back to its text box, which is the app working as it always did. A
// scaffold that fails should leave the learner standing, not stop them.
func (e *Engine) SuggestReplies(ctx context.Context, userID, sessionID string) ([]Choice, error) {
	// Read-only: `prepare` is the other way to get here and it RECORDS a user turn,
	// which would put an empty line in the transcript every time the screen asked for
	// suggestions.
	//
	// No authored-script short-circuit any more (guided-turn redesign, D5): every turn's
	// intents are generated so they react to the learner's REAL speech rather than a
	// pre-written branch. The presets covered only a handful of scenarios and made the
	// picked option instantly sendable, which the new mic-driven turn replaces.
	sess, err := e.convo.GetSession(ctx, sessionID)
	if err != nil {
		return nil, err
	}
	if sess == nil || sess.UserID != userID {
		return nil, ErrSessionNotFound
	}
	sc, err := e.content.GetScenario(ctx, sess.ScenarioID)
	if err != nil {
		return nil, err
	}
	turns, err := e.convo.History(ctx, sessionID, historyLimit)
	if err != nil {
		return nil, err
	}
	lc := e.langFor(ctx, userID)

	raw, err := e.llm.Complete(ctx, ports.LLMRequest{
		Model:    e.correctionModel,
		System:   buildChoicesPrompt(sc, lc),
		Messages: llmMessages(turns),
		// Three short replies plus three short reasons. Room to finish, not to ramble.
		MaxTokens: 700,
	})
	if err != nil {
		return nil, err
	}
	return parseChoices(raw), nil
}

// buildChoicesPrompt writes the system prompt for the guided turn's intents.
//
// The two language axes are the point, and neither is hardcoded: the INTENT is written in
// the learner's own language (lc.Native), the model line in the TARGET (lc.Target). Both
// come from the profile, so a Japanese learner of English gets Japanese intents and a
// Korean learner of German gets Korean ones — the guided-turn redesign must not assume
// Korean/English anywhere.
func buildChoicesPrompt(sc *content.Scenario, lc langContext) string {
	var b strings.Builder
	b.WriteString(fmt.Sprintf(
		"You are coaching a %[1]s-speaking %[2]s who is practising %[3]s for work abroad. "+
			"Given the conversation so far, write %[4]d things they could say NEXT.\n",
		lc.Native, lc.Job, lc.Target, ChoiceCount))
	if sc != nil {
		b.WriteString(fmt.Sprintf("Situation: %s — %s\n", sc.Title, sc.Tagline))
		if len(sc.Goals) > 0 {
			b.WriteString("What they are trying to accomplish: " + strings.Join(sc.Goals, "; ") + "\n")
		}
		if len(sc.Guardrails) > 0 {
			b.WriteString("Tone they must keep: " + strings.Join(sc.Guardrails, "; ") + "\n")
		}
	}
	// The register the learner can actually produce. A "best" reply they could not say
	// out loud is not a choice, it is a demonstration.
	b.WriteString(user.SpeechRegister(lc.Level) + "\n")
	b.WriteString(fmt.Sprintf(
		"ALL THREE must be correct, safe and usable — none of them is a wrong answer, and none is a joke. "+
			"They differ in how much they ACHIEVE:\n"+
			"  \"best\"   — what a strong nurse says here; it moves the situation forward.\n"+
			"  \"strong\" — correct and useful, but leaves something for later.\n"+
			"  \"fair\"   — polite and safe; no mistake, and no progress either.\n"+
			"For each, give THREE fields:\n"+
			"  `intent` — in %[2]s, a short phrase naming WHAT TO CONVEY to this person (the goal of the turn, "+
			"e.g. \"ask where exactly the pain is\"). NOT the %[1]s words — the learner will say those themselves.\n"+
			"  `text`   — in %[1]s, one or two sentences that convey that intent WORD FOR WORD: a model answer, "+
			"in the register the learner can actually produce.\n"+
			"  `why`    — ONE short sentence in %[2]s saying what this reply achieves; the difference between the three is the lesson.\n"+
			"Respond ONLY with JSON: {\"choices\": [{\"tier\": \"best\"|\"strong\"|\"fair\", \"intent\": string, \"text\": string, \"why\": string}]}",
		lc.Target, lc.Native))
	return b.String()
}

// parseChoices pulls the choices out of the model's answer, keeping only the ones that
// are actually usable.
//
// Tolerant of the envelope (models like to wrap JSON in prose) and strict about the
// contents: a choice with no text is a blank button, and a tier the app cannot draw
// would fall through to an unstyled one.
func parseChoices(raw string) []Choice {
	i, j := strings.IndexByte(raw, '{'), strings.LastIndexByte(raw, '}')
	if i < 0 || j <= i {
		return nil
	}
	var p struct {
		Choices []Choice `json:"choices"`
	}
	if json.Unmarshal([]byte(raw[i:j+1]), &p) != nil {
		return nil
	}
	out := make([]Choice, 0, len(p.Choices))
	seen := map[ChoiceTier]bool{}
	for _, c := range p.Choices {
		c.Intent = strings.TrimSpace(c.Intent)
		c.Text = strings.TrimSpace(c.Text)
		c.Why = strings.TrimSpace(c.Why)
		// Intent is the card's own label now, so a choice without one is a blank card —
		// dropped for the same reason a choice with no `text` always was.
		if c.Intent == "" || c.Text == "" || !validTier(c.Tier) || seen[c.Tier] {
			continue
		}
		seen[c.Tier] = true
		out = append(out, c)
	}
	// Ordered best-first, whatever order the model answered in. The list is read top
	// down, and "these are ranked" only reads as true if they are.
	order := map[ChoiceTier]int{TierBest: 0, TierStrong: 1, TierFair: 2}
	for a := 1; a < len(out); a++ {
		for b := a; b > 0 && order[out[b].Tier] < order[out[b-1].Tier]; b-- {
			out[b], out[b-1] = out[b-1], out[b]
		}
	}
	return out
}

func validTier(t ChoiceTier) bool {
	return t == TierBest || t == TierStrong || t == TierFair
}

// llmMessages turns stored turns into the LLM's message shape.
func llmMessages(turns []ports.ConversationTurn) []ports.LLMMessage {
	out := make([]ports.LLMMessage, 0, len(turns))
	for _, t := range turns {
		out = append(out, ports.LLMMessage{Role: t.Role, Content: t.Content})
	}
	return out
}
