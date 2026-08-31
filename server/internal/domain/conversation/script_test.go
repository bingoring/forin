package conversation

import (
	"context"
	"errors"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/ports"
)

// A beat, as the seeded content hands it over: payloads arrive as map[string]any with
// []any inside, because they round-trip through a JSONB column.
func beat(id, line string, withChoices bool, missions ...int) content.Step {
	p := map[string]any{"lineEn": line, "lineKo": line + " (ko)", "mood": "warm"}
	if withChoices {
		p["choices"] = []any{
			map[string]any{"tier": "best", "text": line + " → best", "why": "왜"},
			map[string]any{"tier": "strong", "text": line + " → strong", "why": ""},
			map[string]any{"tier": "fair", "text": line + " → fair", "why": ""},
		}
	}
	if len(missions) > 0 {
		raw := make([]any, 0, len(missions))
		for _, m := range missions {
			raw = append(raw, float64(m)) // what a JSON round-trip actually produces
		}
		p["missions"] = raw
	}
	return content.Step{ID: id, Type: content.StepDialogue, Payload: p}
}

func script(beats int) *content.Scenario {
	sc := &content.Scenario{ID: "SCN-TEST-00900"}
	for i := 0; i < beats; i++ {
		last := i == beats-1
		sc.Steps = append(sc.Steps, beat("t"+string(rune('a'+i)), "line", !last, i+1))
	}
	return sc
}

func TestScriptOfReadsAnAuthoredConversation(t *testing.T) {
	got := ScriptOf(script(8))
	if len(got) != 8 {
		t.Fatalf("beats = %d, want 8", len(got))
	}
	if len(got[0].Choices) != ChoiceCount {
		t.Errorf("first beat offers %d replies, want %d", len(got[0].Choices), ChoiceCount)
	}
	if got[0].Last() {
		t.Error("first beat reports itself as the close")
	}
	if !got[7].Last() {
		t.Error("last beat is not the close — the screen would wait for a pick forever")
	}
	// Numbers survive the JSONB round-trip as float64. Read as float and truncated
	// wrongly, the mission tracker silently stops moving.
	if len(got[3].Missions) != 1 || got[3].Missions[0] != 4 {
		t.Errorf("missions = %v, want [4]", got[3].Missions)
	}
	if got[0].LineKO == "" {
		t.Error("the learner's own language was dropped")
	}
}

// The v16 content puts two dialogue steps on most scenarios — an NPC line and a player
// line — and neither is a script. Reading those as one would have handed 3000 scenarios
// a two-turn "conversation" that ends before it starts.
func TestScriptOfIgnoresTheOpeningLine(t *testing.T) {
	legacy := &content.Scenario{ID: "SCN-DIAL-00001", Steps: []content.Step{
		{ID: "s1", Type: content.StepDialogue, Payload: map[string]any{"lineEn": "I gained weight.", "speaker": "patient"}},
		{ID: "s2", Type: content.StepDialogue, Payload: map[string]any{"lineEn": "Let's check.", "speaker": "player"}},
		{ID: "s3", Type: content.StepQuiz, Payload: map[string]any{"quizId": "QZ-DIAL-00001"}},
	}}
	if got := ScriptOf(legacy); got != nil {
		t.Fatalf("read a script out of legacy content: %d beats", len(got))
	}
	// …and it is not the step COUNT that decides. Eight dialogue steps with no choices
	// is still not a script.
	long := &content.Scenario{ID: "SCN-X-00001"}
	for i := 0; i < 8; i++ {
		long.Steps = append(long.Steps, content.Step{
			ID: "s", Type: content.StepDialogue, Payload: map[string]any{"lineEn": "hello"},
		})
	}
	if got := ScriptOf(long); got != nil {
		t.Fatalf("eight choiceless lines read as a script: %d beats", len(got))
	}
}

// Half a script is worse than none: the learner would be dropped into a guided screen
// that has no text box, mid-conversation, with nothing to pick.
func TestScriptOfRefusesAHalfWrittenScript(t *testing.T) {
	t.Run("too short", func(t *testing.T) {
		if got := ScriptOf(script(MinScriptTurns - 1)); got != nil {
			t.Errorf("%d beats accepted, want at least %d", MinScriptTurns-1, MinScriptTurns)
		}
	})
	t.Run("a middle beat with nothing to pick", func(t *testing.T) {
		sc := script(8)
		delete(sc.Steps[4].Payload, "choices")
		if got := ScriptOf(sc); got != nil {
			t.Error("accepted a script that strands the learner at beat 4")
		}
	})
	t.Run("a closing beat that still asks", func(t *testing.T) {
		sc := script(8)
		sc.Steps[7].Payload["choices"] = sc.Steps[0].Payload["choices"]
		if got := ScriptOf(sc); got != nil {
			t.Error("accepted a script with no ending")
		}
	})
	t.Run("a beat with no line", func(t *testing.T) {
		sc := script(8)
		sc.Steps[2].Payload["lineEn"] = ""
		if got := ScriptOf(sc); got != nil {
			t.Error("accepted a beat where the character says nothing")
		}
	})
	t.Run("an unknown tier", func(t *testing.T) {
		sc := script(8)
		raw := sc.Steps[1].Payload["choices"].([]any)
		raw[0].(map[string]any)["tier"] = "excellent"
		// Dropped, which leaves two replies on that beat — and two is a coin toss with
		// no middle, so the whole script is refused rather than quietly shrunk.
		if got := ScriptOf(sc); got != nil {
			t.Error("accepted a beat with an unreadable tier")
		}
	})
}

// The count that matters is 6 REPLIES, which is 7 beats. Stated as its own test because
// the number came from the product decision ("대화를 최소 6번은 해야지") and an
// off-by-one here is a scaffold that ends one turn early.
func TestSixRepliesIsTheFloor(t *testing.T) {
	if MinScriptTurns != 7 {
		t.Fatalf("MinScriptTurns = %d; 6 replies plus a close is 7", MinScriptTurns)
	}
	replies := 0
	for _, b := range ScriptOf(script(MinScriptTurns)) {
		if !b.Last() {
			replies++
		}
	}
	if replies != 6 {
		t.Errorf("a minimal script asks for %d replies, want 6", replies)
	}
}

// ── the engine path ────────────────────────────────────────────────────────

// A content reader that knows one scenario, and a strategy that fails if called. The
// second half is the actual assertion of the next test: on a scripted turn the model
// must not be reached at all. A model call here would not just cost money — it would
// write the character's next line, and the conversation would walk off the script the
// learner is being taught from.
type oneScenario struct {
	ports.ContentReader
	sc *content.Scenario
}

func (o oneScenario) GetScenario(_ context.Context, id string) (*content.Scenario, error) {
	if o.sc != nil && o.sc.ID == id {
		return o.sc, nil
	}
	return nil, nil
}

type explodingStrategy struct{ called bool }

func (s *explodingStrategy) Generate(context.Context, string, []ports.LLMMessage) (string, error) {
	s.called = true
	return "", errors.New("the model must not be called on a scripted turn")
}

func (s *explodingStrategy) GenerateStream(context.Context, string, []ports.LLMMessage, func(string) error) (string, error) {
	s.called = true
	return "", errors.New("the model must not be called on a scripted turn")
}

func scriptedEngine(t *testing.T, guide string, history []ports.ConversationTurn) (*Engine, *fakeConvoRepo, *explodingStrategy) {
	t.Helper()
	sc := script(8)
	repo := &fakeConvoRepo{
		sessions: map[string]*ports.ConversationSession{
			"s1": {ID: "s1", UserID: "u1", ScenarioID: sc.ID, Guide: guide},
		},
		history: history,
	}
	strat := &explodingStrategy{}
	e := NewEngine(oneScenario{sc: sc}, repo, nil, nil, nil, nil, nil, strat, "", "")
	return e, repo, strat
}

func TestScriptedTurnAnswersWithoutTheModel(t *testing.T) {
	// One reply already taken, so the learner is answering beat 1 and the character's
	// next line is beat 2.
	e, repo, strat := scriptedEngine(t, GuideChoices, []ports.ConversationTurn{
		{Role: "user", Content: "Hi, I'm the new nurse."},
		{Role: "assistant", Content: "line", Mood: "warm"},
	})

	got, err := e.SendMessage(context.Background(), "u1", "s1", "Where should I stand?")
	if err != nil {
		t.Fatalf("send: %v", err)
	}
	if strat.called {
		t.Fatal("the model was called on a scripted turn")
	}
	if got.Text != "line" {
		t.Errorf("reply = %q, want the authored line", got.Text)
	}
	// Both turns are recorded, in order: the learner's pick, then the authored reply. A
	// transcript missing the pick would make the beat index wrong on the next turn.
	if len(repo.appended) != 2 || repo.appended[0].Role != "user" || repo.appended[1].Role != "assistant" {
		t.Fatalf("appended = %+v, want a user turn then an assistant turn", repo.appended)
	}
	// The tracker moves because the beat says which goals it covers. There is no model
	// reading the transcript on this path, so an unauthored mission list means the
	// mission panel never fills — which is what the learner reads as "nothing counted".
	if len(got.Missions) != 1 || got.Missions[0] != 3 {
		t.Errorf("missions = %v, want beat 2's authored [3]", got.Missions)
	}
	if got.Resolved {
		t.Error("resolved mid-conversation")
	}
}

func TestScriptedConversationEndsOnItsClosingLine(t *testing.T) {
	// Six replies taken: the next line is the eighth beat, which is the close.
	var history []ports.ConversationTurn
	for i := 0; i < 6; i++ {
		history = append(history,
			ports.ConversationTurn{Role: "user", Content: "pick"},
			ports.ConversationTurn{Role: "assistant", Content: "line"})
	}
	e, _, strat := scriptedEngine(t, GuideChoices, history)
	got, err := e.SendMessage(context.Background(), "u1", "s1", "Thank you.")
	if err != nil {
		t.Fatalf("send: %v", err)
	}
	if strat.called {
		t.Fatal("the model was called on a scripted turn")
	}
	// Resolved is what tells the screen the situation is finished. Without it the
	// learner is left holding a conversation with nothing to pick and no way to end.
	if !got.Resolved {
		t.Error("the closing line did not report the conversation resolved")
	}

	st, scripted, err := e.ScriptedChoices(context.Background(), "u1", "s1")
	if err != nil || !scripted {
		t.Fatalf("scripted = %v, err = %v", scripted, err)
	}
	if !st.Done || len(st.Choices) != 0 {
		t.Errorf("beat %d/%d offers %d replies, want the close", st.Turn, st.Total, len(st.Choices))
	}
}

// The free pass is the learner doing it alone. Handing them the same authored three
// would delete the ladder's second rung — they would pass the "do it yourself" run by
// picking from a list.
func TestTheFreePassIsNotScripted(t *testing.T) {
	e, _, _ := scriptedEngine(t, "free", nil)
	if _, scripted, err := e.ScriptedChoices(context.Background(), "u1", "s1"); scripted || err != nil {
		t.Fatalf("the free pass got the authored script (err %v)", err)
	}
	// …and a session from before the column existed reads as free, for the same reason.
	e2, _, _ := scriptedEngine(t, "", nil)
	if _, scripted, err := e2.ScriptedChoices(context.Background(), "u1", "s1"); scripted || err != nil {
		t.Fatalf("a pre-column session got the authored script (err %v)", err)
	}
}

// A transcript longer than the script happens when a script is shortened after someone
// started a conversation on it. Reporting finished is the recoverable answer: the
// learner closes the situation, which is what they were about to do.
func TestATranscriptPastTheEndOfTheScriptDoesNotPanic(t *testing.T) {
	var history []ports.ConversationTurn
	for i := 0; i < 40; i++ {
		history = append(history, ports.ConversationTurn{Role: "user", Content: "pick"})
	}
	e, _, _ := scriptedEngine(t, GuideChoices, history)
	st, scripted, err := e.ScriptedChoices(context.Background(), "u1", "s1")
	if err != nil || !scripted {
		t.Fatalf("scripted = %v, err = %v", scripted, err)
	}
	if !st.Done {
		t.Error("want the conversation reported finished")
	}
}
