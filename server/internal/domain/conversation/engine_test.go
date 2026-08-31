package conversation

import (
	"context"
	"github.com/bingoring/forin/server/internal/ports"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/content"
)

func TestBuildSystemPromptIsLanguageDriven(t *testing.T) {
	sc := &content.Scenario{Title: "T", Tagline: "x", Persona: content.Persona{Role: "patient"}}

	// Japanese learner of German → prompt must reflect that, with NO hardcoded ko/en leak.
	p := buildSystemPrompt(sc, langContext{Native: "Japanese", Target: "German", Job: "nurse"}, "")
	if !strings.Contains(p, "German") || !strings.Contains(p, "Japanese") {
		t.Fatalf("prompt should use the given languages:\n%s", p)
	}
	if strings.Contains(p, "English") || strings.Contains(p, "Korean") {
		t.Fatalf("prompt leaked a hardcoded language:\n%s", p)
	}

	// Korean learner of English → reflects those.
	p2 := buildSystemPrompt(sc, langContext{Native: "Korean", Target: "English", Job: "nurse"}, "")
	if !strings.Contains(p2, "English") || !strings.Contains(p2, "Korean") {
		t.Fatalf("prompt should use Korean/English when given:\n%s", p2)
	}
}

func TestBuildSystemPromptInjectsDisposition(t *testing.T) {
	sc := &content.Scenario{Title: "T", Tagline: "x", Persona: content.Persona{Role: "patient"}}
	disp := "This character does not yet trust this learner."
	p := buildSystemPrompt(sc, langContext{Native: "Korean", Target: "English", Job: "nurse"}, disp)
	if !strings.Contains(p, disp) {
		t.Fatalf("prompt should include the disposition line:\n%s", p)
	}
	// Empty disposition must not add the label.
	p2 := buildSystemPrompt(sc, langContext{Native: "Korean", Target: "English", Job: "nurse"}, "")
	if strings.Contains(p2, "Baseline disposition") {
		t.Fatalf("empty disposition should not add the label:\n%s", p2)
	}
}

func TestLangName(t *testing.T) {
	cases := map[string]string{"ko": "Korean", "en": "English", "de": "German", "ja": "Japanese", "": "", "xx": "xx"}
	for code, want := range cases {
		if got := langName(code); got != want {
			t.Errorf("langName(%q)=%q want %q", code, got, want)
		}
	}
}

// ── resume ──────────────────────────────────────────────────────────────────
// A session id is effectively a bearer token for someone's conversation, so the
// tests below are mostly about refusing to hand one over.

type fakeConvoRepo struct {
	latestID     string
	latestTurns  int
	latestErr    error
	discardedFor string
	discardHit   bool
	discardErr   error
	sessions     map[string]*ports.ConversationSession
	history      []ports.ConversationTurn
	historyFor   string // records which session History was asked for
	appended     []ports.ConversationTurn
	priorMood    string
}

func (f *fakeConvoRepo) CreateSession(context.Context, string, string, string) (string, error) {
	return "new-session", nil
}
func (f *fakeConvoRepo) GetSession(_ context.Context, id string) (*ports.ConversationSession, error) {
	return f.sessions[id], nil
}

// Records what was appended, so a mood test can assert the turn stored the mood the
// stream reported — and stored the reader's text, not the tagged raw reply.
func (f *fakeConvoRepo) AppendTurn(_ context.Context, _, role, content, mood string) error {
	f.appended = append(f.appended, ports.ConversationTurn{Role: role, Content: content, Mood: mood})
	return nil
}

// The mood of the last assistant turn, from whatever the test seeded as history.
func (f *fakeConvoRepo) LatestAssistantMood(_ context.Context, _ string) (string, error) {
	if f.priorMood != "" {
		return f.priorMood, nil
	}
	for i := len(f.history) - 1; i >= 0; i-- {
		if f.history[i].Role != "user" {
			return f.history[i].Mood, nil
		}
	}
	return "", nil
}
// Seeded history FOLLOWED BY whatever was appended during the test. A fake that forgot
// its own writes reads back a transcript that never grows, and the scripted pass derives
// which beat the learner is on from exactly that count — so a forgetful fake would report
// the same beat forever and a test could not tell a working script from a stuck one.
func (f *fakeConvoRepo) History(_ context.Context, sessionID string, _ int) ([]ports.ConversationTurn, error) {
	f.historyFor = sessionID
	out := append([]ports.ConversationTurn{}, f.history...)
	return append(out, f.appended...), nil
}
func (f *fakeConvoRepo) SaveCorrection(context.Context, string, string, string, string, string) error {
	return nil
}
func (f *fakeConvoRepo) LatestSessionWithTurns(context.Context, string, string) (string, int, error) {
	return f.latestID, f.latestTurns, f.latestErr
}
func (f *fakeConvoRepo) DiscardSession(_ context.Context, userID, sessionID string) (bool, error) {
	f.discardedFor = userID + "/" + sessionID
	return f.discardHit, f.discardErr
}

func engineWith(repo ports.ConversationRepo) *Engine {
	// Strategy is an interface and none of the resume paths touch it.
	return NewEngine(nil, repo, nil, nil, nil, nil, nil, nil, "", "")
}

func TestResumableReturnsNothingWhenThereIsNoPriorTurn(t *testing.T) {
	// A learner opening a scenario for the first time is the normal case, so an
	// empty result must not read as an error — otherwise the client shows a
	// failure on every fresh start.
	e := engineWith(&fakeConvoRepo{})
	id, turns, err := e.Resumable(context.Background(), "u1", "SCN-1")
	if err != nil || id != "" || turns != nil {
		t.Fatalf("want empty and no error, got (%q, %v, %v)", id, turns, err)
	}
}

// A session row with zero turns is not resumable — there is nothing to come
// back to, and offering "이어서 대화" on it would be a lie.
func TestResumableIgnoresSessionWithZeroTurns(t *testing.T) {
	repo := &fakeConvoRepo{latestID: "s1", latestTurns: 0}
	id, _, err := engineWith(repo).Resumable(context.Background(), "u1", "SCN-1")
	if err != nil || id != "" {
		t.Fatalf("zero-turn session must not be resumable, got %q (%v)", id, err)
	}
	if repo.historyFor != "" {
		t.Fatal("History should not be queried for a session with no turns")
	}
}

func TestResumableReturnsTheHistoryOfThatSession(t *testing.T) {
	repo := &fakeConvoRepo{
		latestID: "s7", latestTurns: 2,
		history: []ports.ConversationTurn{{Role: "user", Content: "hi"}, {Role: "assistant", Content: "hello"}},
	}
	id, turns, err := engineWith(repo).Resumable(context.Background(), "u1", "SCN-1")
	if err != nil || id != "s7" || len(turns) != 2 {
		t.Fatalf("got (%q, %d turns, %v)", id, len(turns), err)
	}
	if repo.historyFor != "s7" {
		t.Fatalf("History was asked for %q, want the resumable session s7", repo.historyFor)
	}
}

func TestResumeSessionRefusesAnotherUsersSession(t *testing.T) {
	repo := &fakeConvoRepo{sessions: map[string]*ports.ConversationSession{
		"s1": {UserID: "someone-else", ScenarioID: "SCN-1"},
	}}
	if err := engineWith(repo).ResumeSession(context.Background(), "u1", "SCN-1", "s1"); err == nil {
		t.Fatal("resuming another learner's session must fail")
	}
}

// Same id, wrong scenario: resuming would continue a completely different
// conversation under the current scenario's framing.
func TestResumeSessionRefusesWrongScenario(t *testing.T) {
	repo := &fakeConvoRepo{sessions: map[string]*ports.ConversationSession{
		"s1": {UserID: "u1", ScenarioID: "SCN-OTHER"},
	}}
	if err := engineWith(repo).ResumeSession(context.Background(), "u1", "SCN-1", "s1"); err == nil {
		t.Fatal("resuming a session from another scenario must fail")
	}
}

func TestResumeSessionAcceptsOwnSession(t *testing.T) {
	repo := &fakeConvoRepo{sessions: map[string]*ports.ConversationSession{
		"s1": {UserID: "u1", ScenarioID: "SCN-1"},
	}}
	if err := engineWith(repo).ResumeSession(context.Background(), "u1", "SCN-1", "s1"); err != nil {
		t.Fatalf("own session must resume, got %v", err)
	}
}

func TestResumeSessionRefusesUnknownSession(t *testing.T) {
	repo := &fakeConvoRepo{sessions: map[string]*ports.ConversationSession{}}
	if err := engineWith(repo).ResumeSession(context.Background(), "u1", "SCN-1", "nope"); err == nil {
		t.Fatal("unknown session must fail rather than resume nothing")
	}
}

// Discarding is scoped to the learner who asked, and "nothing to discard" is not a
// failure. Both halves matter: the first is what stops one learner clearing another's
// conversation, and the second is what keeps an error out of the way of someone leaving.
func TestDiscardPassesTheLearnerThrough(t *testing.T) {
	repo := &fakeConvoRepo{discardHit: true}
	got, err := engineWith(repo).Discard(context.Background(), "user-1", "sess-9")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !got {
		t.Fatalf("expected the discard to be reported as done")
	}
	if repo.discardedFor != "user-1/sess-9" {
		t.Fatalf("discard was not scoped to the caller: %q", repo.discardedFor)
	}
}

func TestDiscardOfSomethingAbsentIsNotAnError(t *testing.T) {
	repo := &fakeConvoRepo{discardHit: false}
	got, err := engineWith(repo).Discard(context.Background(), "user-1", "gone")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got {
		t.Fatalf("expected no row to be reported")
	}
}
