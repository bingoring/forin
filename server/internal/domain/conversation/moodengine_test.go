package conversation

import (
	"context"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// A strategy that replies with a fixed string, optionally chunked.
type moodStrategy struct {
	reply  string
	chunks []string
	system string // captured, so a test can assert the prompt carries the instruction
}

func (m *moodStrategy) Generate(_ context.Context, system string, _ []ports.LLMMessage) (string, error) {
	m.system = system
	return m.reply, nil
}

func (m *moodStrategy) GenerateStream(_ context.Context, system string, _ []ports.LLMMessage, onDelta func(string) error) (string, error) {
	m.system = system
	cs := m.chunks
	if cs == nil {
		cs = []string{m.reply}
	}
	for _, c := range cs {
		if err := onDelta(c); err != nil {
			return "", err
		}
	}
	return strings.Join(cs, ""), nil
}

// Content that answers GetScenario and nothing else.
//
// ports.ContentReader is ~14 methods and prepare() calls one of them. Embedding the
// interface satisfies the compiler without 13 stub bodies; any OTHER method would
// panic on a nil interface, which is the correct outcome — a test that starts
// depending on one should say so rather than get a zero value.
type moodContent struct{ ports.ContentReader }

func (moodContent) GetScenario(context.Context, string) (*content.Scenario, error) {
	return &content.Scenario{ID: "SCN-1", Title: "t", Persona: content.Persona{Role: "patient", Mood: "worried"}}, nil
}

// langFor() reads the profile to frame the prompt, so it needs a real one — a nil
// ProfileReader panics there rather than falling back.
type moodProfiles struct{}

func (moodProfiles) GetProfile(context.Context, string) (*user.Profile, error) {
	return &user.Profile{NativeLang: "ko", TargetLang: "en", Job: "nurse"}, nil
}

func moodEngine(repo *fakeConvoRepo, st Strategy) *Engine {
	repo.sessions = map[string]*ports.ConversationSession{"s1": {ID: "s1", UserID: "u1", ScenarioID: "SCN-1"}}
	return NewEngine(moodContent{}, repo, nil, moodProfiles{}, nil, nil, nil, st, "", "")
}

// The stored turn is what the learner READ — the tag is not part of the conversation
// and must not come back as history on the next turn (the model would then see its
// own tag as an example and the prompt would drift).
func TestSendMessagePersistsTheReadersTextAndTheMood(t *testing.T) {
	repo := &fakeConvoRepo{}
	e := moodEngine(repo, &moodStrategy{reply: "[mood: happy] Thank you, nurse."})

	reply, err := e.SendMessage(context.Background(), "u1", "s1", "How are you feeling?")
	if err != nil {
		t.Fatalf("SendMessage: %v", err)
	}
	if reply.Text != "Thank you, nurse." {
		t.Errorf("reply text = %q", reply.Text)
	}
	if reply.Mood != "happy" {
		t.Errorf("mood = %q", reply.Mood)
	}
	var stored *ports.ConversationTurn
	for i := range repo.appended {
		if repo.appended[i].Role == "assistant" {
			stored = &repo.appended[i]
		}
	}
	if stored == nil {
		t.Fatal("no assistant turn stored")
	}
	if strings.Contains(stored.Content, "mood") {
		t.Errorf("stored turn kept the tag: %q", stored.Content)
	}
	if stored.Mood != "happy" {
		t.Errorf("stored mood = %q", stored.Mood)
	}
}

// The user's own turn carries no mood: it is the learner speaking, and a mood on it
// would be read back as the NPC's on the next comparison.
func TestUserTurnStoresNoMood(t *testing.T) {
	repo := &fakeConvoRepo{}
	e := moodEngine(repo, &moodStrategy{reply: "[mood: sad] I see."})
	if _, err := e.SendMessage(context.Background(), "u1", "s1", "Hello."); err != nil {
		t.Fatal(err)
	}
	for _, turn := range repo.appended {
		if turn.Role == "user" && turn.Mood != "" {
			t.Errorf("user turn stored mood %q", turn.Mood)
		}
	}
}

// Improvement is measured against the PREVIOUS assistant turn, which lives in
// storage — a resumed conversation must compare against what was actually said, not
// against nothing.
func TestImprovementIsMeasuredAgainstTheStoredPriorMood(t *testing.T) {
	for _, tc := range []struct {
		prior, now string
		want       bool
		why        string
	}{
		{"panic", "[mood: focused] Okay. I'm listening.", true, "calmed down"},
		{"worried", "[mood: happy] Thank you!", true, "relieved"},
		{"happy", "[mood: worried] But what about the pain?", false, "got worse"},
		{"worried", "[mood: worried] I still don't know.", false, "unchanged"},
		{"", "[mood: happy] Hello!", false, "first turn has nothing to improve on"},
		{"worried", "No tag at all.", false, "unreadable reply"},
	} {
		repo := &fakeConvoRepo{priorMood: tc.prior}
		e := moodEngine(repo, &moodStrategy{reply: tc.now})
		reply, err := e.SendMessage(context.Background(), "u1", "s1", "...")
		if err != nil {
			t.Fatalf("%s: %v", tc.why, err)
		}
		if reply.Improved != tc.want {
			t.Errorf("%s: prior %q + %q -> improved=%v, want %v", tc.why, tc.prior, tc.now, reply.Improved, tc.want)
		}
	}
}

// The streaming path must reach the same three answers as the non-streaming one, and
// announce the mood BEFORE any text — the portrait has to be right when the first
// words appear, not after.
func TestStreamAnnouncesMoodBeforeAnyText(t *testing.T) {
	repo := &fakeConvoRepo{priorMood: "panic"}
	st := &moodStrategy{chunks: []string{"[mood: ", "focused] ", "Okay. ", "I'm listening."}}
	e := moodEngine(repo, st)

	var order []string
	reply, err := e.SendMessageStream(context.Background(), "u1", "s1", "Breathe with me.",
		func(m string) { order = append(order, "mood:"+m) },
		func(chunk string) error { order = append(order, "text"); return nil },
	)
	if err != nil {
		t.Fatalf("stream: %v", err)
	}
	if len(order) == 0 || order[0] != "mood:focused" {
		t.Errorf("event order = %v; the mood must land first", order)
	}
	if reply.Mood != "focused" || !reply.Improved {
		t.Errorf("reply = %+v, want focused and improved", reply)
	}
	if reply.Text != "Okay. I'm listening." {
		t.Errorf("reply text = %q", reply.Text)
	}
}

// The whole reply in ONE chunk — a provider that does not really stream. The stored
// turn must still be the reader's sentence with the mood attached, and the caller may
// pass a nil onMood.
func TestStreamInOneChunkStillResolvesTheMood(t *testing.T) {
	repo := &fakeConvoRepo{priorMood: "worried"}
	e := moodEngine(repo, &moodStrategy{reply: "[mood: happy] All better."})

	reply, err := e.SendMessageStream(context.Background(), "u1", "s1", "...", nil, func(string) error { return nil })
	if err != nil {
		t.Fatalf("stream: %v", err)
	}
	if reply.Mood != "happy" || !reply.Improved || reply.Text != "All better." {
		t.Errorf("reply = %+v", reply)
	}
}

// The instruction has to reach the model, or every reply is untagged and the whole
// feature is silently off.
func TestSystemPromptCarriesTheMoodInstruction(t *testing.T) {
	repo := &fakeConvoRepo{}
	st := &moodStrategy{reply: "[mood: neutral] Hm."}
	e := moodEngine(repo, st)
	if _, err := e.SendMessage(context.Background(), "u1", "s1", "..."); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(st.system, MoodPrefix) {
		t.Errorf("system prompt never asks for the tag:\n%s", st.system)
	}
}
