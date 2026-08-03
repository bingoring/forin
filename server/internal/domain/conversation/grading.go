package conversation

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/economy"
	"github.com/bingoring/forin/server/internal/ports"
)

// gradeHistoryLimit caps how many turns the grader reads. Comfortably above a
// realistic single-scenario dialogue; grading is one call regardless of length.
const gradeHistoryLimit = 100

// ErrNoTurns means the learner ended the situation without speaking — there is
// nothing to grade, so no attempt is recorded and no reward is given.
var ErrNoTurns = errors.New("no user turns to grade")

// GoalResult marks whether a scenario learning-goal was addressed.
type GoalResult struct {
	Goal string `json:"goal"`
	Met  bool   `json:"met"`
}

// GradeTip is one concrete "you could have said…" suggestion → becomes a review card.
type GradeTip struct {
	En string `json:"en"` // the better English phrasing
	Ko string `json:"ko"` // short native-language explanation
}

// Grade is the AI assessment of a learner's performance in a scenario dialogue.
type Grade struct {
	ScenarioID string       `json:"scenarioId"`
	Score      int          `json:"score"` // 0..100
	Passed     bool         `json:"passed"`
	XPAwarded  int          `json:"xpAwarded"`
	Goals      []GoalResult `json:"goals"`
	Headline   string       `json:"headline"`
	Feedback   string       `json:"feedback"`
	Tips       []GradeTip   `json:"tips"`
	Turns      int          `json:"turns"` // user turns considered
}

// GradeSession judges the learner's performance across the whole conversation and
// returns a Grade (score, per-goal results, feedback, improvement tips). It also
// files the tips as review cards. It does NOT record the attempt — the caller
// scales the reward and records it (keeping the conversation domain free of the
// progress write). Returns ErrNoTurns when the learner never spoke.
func (e *Engine) GradeSession(ctx context.Context, userID, sessionID string) (*Grade, error) {
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
	if sc == nil {
		return nil, ErrScenarioNotFound
	}
	hist, err := e.convo.History(ctx, sessionID, gradeHistoryLimit)
	if err != nil {
		return nil, err
	}
	userTurns := 0
	for _, t := range hist {
		if t.Role == "user" {
			userTurns++
		}
	}
	if userTurns == 0 {
		return nil, ErrNoTurns
	}

	g := e.gradeTranscript(ctx, userID, sc, hist)
	g.ScenarioID = sc.ID
	g.Turns = userTurns
	g.Passed = g.Score >= economy.Active.ScenarioPassScore
	g.XPAwarded = scaledXP(baseXPOf(sc), g.Score)

	e.fileGradeTips(ctx, userID, sc, g.Tips)
	return g, nil
}

// gradeTranscript makes the single grading LLM call and parses its JSON. On any
// LLM/parse failure it falls back to a neutral just-passing grade so an honest
// attempt is never punished by an infrastructure hiccup (usability > strictness).
func (e *Engine) gradeTranscript(ctx context.Context, userID string, sc *content.Scenario, hist []ports.ConversationTurn) *Grade {
	lc := e.langFor(ctx, userID)
	sys := buildGradingPrompt(sc, lc)

	var b strings.Builder
	for _, t := range hist {
		who := lc.Job // the learner
		if t.Role == "assistant" {
			who = orDefault(sc.Persona.Name, "Patient")
		} else {
			who = "Nurse (learner)"
		}
		b.WriteString(who + ": " + t.Content + "\n")
	}

	raw, err := e.llm.Complete(ctx, ports.LLMRequest{
		Model: e.gradingModel, System: sys,
		Messages: []ports.LLMMessage{{Role: "user", Content: b.String()}}, MaxTokens: 700,
	})
	if err != nil {
		return neutralGrade()
	}
	var parsed struct {
		Score    int          `json:"score"`
		Goals    []GoalResult `json:"goals"`
		Headline string       `json:"headline"`
		Feedback string       `json:"feedback"`
		Tips     []GradeTip   `json:"tips"`
	}
	if i, j := strings.IndexByte(raw, '{'), strings.LastIndexByte(raw, '}'); i >= 0 && j > i {
		_ = json.Unmarshal([]byte(raw[i:j+1]), &parsed)
	}
	if parsed.Headline == "" && parsed.Feedback == "" && parsed.Score == 0 {
		return neutralGrade() // model returned nothing usable
	}
	g := &Grade{
		Score:    clampScore(parsed.Score),
		Goals:    parsed.Goals,
		Headline: strings.TrimSpace(parsed.Headline),
		Feedback: strings.TrimSpace(parsed.Feedback),
	}
	for _, t := range parsed.Tips { // keep at most 3 non-empty tips
		if strings.TrimSpace(t.En) == "" {
			continue
		}
		g.Tips = append(g.Tips, t)
		if len(g.Tips) >= 3 {
			break
		}
	}
	return g
}

// buildGradingPrompt composes the examiner instruction from the scenario's goals,
// guardrails, and key phrases. Output is JSON; headline/feedback/tips.ko are in the
// learner's native language, judged text in the target language.
func buildGradingPrompt(sc *content.Scenario, lc langContext) string {
	var b strings.Builder
	b.WriteString(fmt.Sprintf("You are a fair but honest examiner of a clinical %[1]s role-play for %[2]s-speaking %[3]ss preparing to work abroad. ", lc.Target, lc.Native, lc.Job))
	b.WriteString("Grade ONLY the LEARNER — the lines marked \"Nurse (learner)\". Ignore the other character's lines except as context.\n")
	b.WriteString(fmt.Sprintf("Scenario: %s — %s\n", sc.Title, sc.Tagline))
	if len(sc.Goals) > 0 {
		b.WriteString("Learning goals the learner should have addressed: " + strings.Join(sc.Goals, "; ") + "\n")
	}
	if len(sc.Guardrails) > 0 {
		b.WriteString("Tone guardrails they should respect: " + strings.Join(sc.Guardrails, "; ") + "\n")
	}
	if len(sc.KeyPhrases) > 0 {
		b.WriteString("Useful reference phrases (not required verbatim): " + strings.Join(sc.KeyPhrases, "; ") + "\n")
	}
	b.WriteString(fmt.Sprintf("Judge whether they addressed the goals and communicated in clear, natural, clinically appropriate, empathetic %s. ", lc.Target))
	b.WriteString("If they barely engaged, were off-topic, or unclear, score low honestly. If they handled it well, score high.\n")
	b.WriteString("Respond ONLY with JSON, no prose:\n")
	b.WriteString("{\"score\": <0-100 integer>, ")
	b.WriteString("\"goals\": [{\"goal\": <string>, \"met\": <bool>}], ")
	b.WriteString(fmt.Sprintf("\"headline\": <%s, at most 18 characters, a short verdict>, ", lc.Native))
	b.WriteString(fmt.Sprintf("\"feedback\": <%s, 2-3 specific, encouraging sentences>, ", lc.Native))
	b.WriteString(fmt.Sprintf("\"tips\": [{\"en\": <a better %[1]s phrasing they could have used>, \"ko\": <%[2]s reason>}]}", lc.Target, lc.Native))
	b.WriteString(" — up to 3 tips, each a concrete phrase from THIS situation. If they did great, tips may be empty.")
	return b.String()
}

// fileGradeTips turns improvement tips into review cards (Source "grade") so the
// learner's weak points surface in the review lab (리뷰랩) via spaced repetition.
func (e *Engine) fileGradeTips(ctx context.Context, userID string, sc *content.Scenario, tips []GradeTip) {
	if len(tips) == 0 || e.review == nil {
		return
	}
	rc := progress.ReviewContext{Title: sc.Title, Situation: sc.Tagline}
	if sc.Briefing != nil {
		rc.Dept = sc.Briefing.Dept
		if sc.Briefing.Brief != "" {
			rc.Situation = sc.Briefing.Brief
		}
	}
	for _, t := range tips {
		front := strings.TrimSpace(t.Ko)
		if front == "" {
			front = rc.Situation // fall back to the situation as the recall cue
		}
		_, _ = e.review.CreateCard(ctx, ports.NewReviewCard{
			UserID: userID, Source: "grade", Front: front, Back: t.En, Note: t.Ko,
			ScenarioID: sc.ID, Context: rc,
		})
	}
}

// baseXPOf reads the scenario's authored XP reward ("+ 120 XP" → 120), else the
// economy default. This is the FULL reward, scaled down by the grade.
func baseXPOf(sc *content.Scenario) int {
	if sc.Briefing != nil {
		for _, r := range sc.Briefing.Rewards {
			if strings.Contains(r.Label, "경험치") || strings.Contains(strings.ToUpper(r.Value), "XP") {
				if n := firstInt(r.Value); n > 0 {
					return n
				}
			}
		}
	}
	return economy.Active.ScenarioBaseXP
}

// scaledXP scales the base reward by the grade, with a small floor so a genuine
// attempt is never worth zero, and never above the full base.
func scaledXP(base, score int) int {
	xp := base * clampScore(score) / 100
	if score > 0 && xp < economy.Active.ScenarioMinXP {
		xp = economy.Active.ScenarioMinXP
	}
	if xp > base {
		xp = base
	}
	return xp
}

func clampScore(s int) int {
	if s < 0 {
		return 0
	}
	if s > 100 {
		return 100
	}
	return s
}

// neutralGrade is the fallback when the grader is unavailable: a just-passing
// score with encouraging copy and no tips, so an honest attempt still clears.
func neutralGrade() *Grade {
	return &Grade{
		Score:    economy.Active.ScenarioPassScore,
		Headline: "수고했어요!",
		Feedback: "이번 대화를 잘 마쳤어요. 다음엔 핵심 표현을 조금 더 활용해봐요.",
	}
}

func orDefault(v, def string) string {
	if strings.TrimSpace(v) == "" {
		return def
	}
	return v
}

// firstInt extracts the first run of digits from a string ("+ 120 XP" → 120).
func firstInt(s string) int {
	start := -1
	for i := 0; i < len(s); i++ {
		if s[i] >= '0' && s[i] <= '9' {
			if start < 0 {
				start = i
			}
		} else if start >= 0 {
			n, _ := strconv.Atoi(s[start:i])
			return n
		}
	}
	if start >= 0 {
		n, _ := strconv.Atoi(s[start:])
		return n
	}
	return 0
}
