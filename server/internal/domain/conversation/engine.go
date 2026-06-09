package conversation

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/bingoring/forin/server/internal/domain/content"
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
	llm             ports.LLMPort
	strategy        Strategy
	correctionModel string
}

func NewEngine(c ports.ContentReader, convo ports.ConversationRepo, review ports.ReviewRepo,
	profiles ports.ProfileReader, llm ports.LLMPort, strategy Strategy, correctionModel string) *Engine {
	return &Engine{content: c, convo: convo, review: review, profiles: profiles,
		llm: llm, strategy: strategy, correctionModel: correctionModel}
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

// SendMessage records the user's line, generates the NPC reply in persona, persists both.
func (e *Engine) SendMessage(ctx context.Context, userID, sessionID, text string) (string, error) {
	sess, err := e.convo.GetSession(ctx, sessionID)
	if err != nil {
		return "", err
	}
	if sess == nil || sess.UserID != userID {
		return "", ErrSessionNotFound
	}
	sc, err := e.content.GetScenario(ctx, sess.ScenarioID)
	if err != nil {
		return "", err
	}
	if sc == nil {
		return "", ErrScenarioNotFound
	}

	if err := e.convo.AppendTurn(ctx, sessionID, "user", text); err != nil {
		return "", err
	}
	hist, err := e.convo.History(ctx, sessionID, historyLimit)
	if err != nil {
		return "", err
	}
	msgs := make([]ports.LLMMessage, 0, len(hist))
	for _, t := range hist {
		msgs = append(msgs, ports.LLMMessage{Role: t.Role, Content: t.Content})
	}
	reply, err := e.strategy.Generate(ctx, buildSystemPrompt(sc, e.langFor(ctx, userID)), msgs)
	if err != nil {
		return "", err
	}
	reply = strings.TrimSpace(reply)
	if err := e.convo.AppendTurn(ctx, sessionID, "assistant", reply); err != nil {
		return "", err
	}
	return reply, nil
}

// Correction is the result of correcting a user's English utterance.
type Correction struct {
	Original  string `json:"original"`
	Corrected string `json:"corrected"`
	Note      string `json:"note"`
	CardID    string `json:"cardId,omitempty"`
}

// Correct fixes the utterance (cheaper model), stores it, and creates a review card.
func (e *Engine) Correct(ctx context.Context, userID, utterance, contextText string) (*Correction, error) {
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

	_ = e.convo.SaveCorrection(ctx, userID, c.Original, c.Corrected, c.Note, "")
	if id, err := e.review.CreateCard(ctx, ports.NewReviewCard{
		UserID: userID, Source: "correction", Front: c.Original, Back: c.Corrected, Note: c.Note}); err == nil {
		c.CardID = id
	}
	return c, nil
}

// buildSystemPrompt composes the persona + scenario goals/guardrails into a role-play instruction,
// framed by the user's native/target language (never hardcoded).
func buildSystemPrompt(sc *content.Scenario, lc langContext) string {
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
	if len(sc.Goals) > 0 {
		b.WriteString("Learner's goals (help them practice these): " + strings.Join(sc.Goals, "; ") + "\n")
	}
	if len(sc.Guardrails) > 0 {
		b.WriteString("Guardrails: " + strings.Join(sc.Guardrails, "; ") + "\n")
	}
	b.WriteString(fmt.Sprintf("Stay fully in character. Speak natural %s a %s would hear in a real hospital. "+
		"Keep replies short (1-3 sentences). Never break character or add meta commentary.", lc.Target, lc.Job))
	return b.String()
}

func writeIf(b *strings.Builder, label, val string) {
	if val != "" {
		b.WriteString("- " + label + ": " + val + "\n")
	}
}
