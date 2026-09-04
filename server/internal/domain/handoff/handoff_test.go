package handoff

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/ports"
)

// ── minimal fakes (embed the port so only the used methods need bodies) ──────

type fakeStore struct {
	notes  []Note
	nextID int
}

func (f *fakeStore) List(_ context.Context, _ string) ([]Note, error) { return f.notes, nil }
func (f *fakeStore) Get(_ context.Context, _, id string) (*Note, error) {
	for i := range f.notes {
		if f.notes[i].ID == id {
			n := f.notes[i]
			return &n, nil
		}
	}
	return nil, nil
}
func (f *fakeStore) Insert(_ context.Context, _ string, n Note) (Note, error) {
	f.nextID++
	n.ID = fmt.Sprintf("n%d", f.nextID)
	n.CreatedAt = time.Now()
	f.notes = append([]Note{n}, f.notes...)
	return n, nil
}
func (f *fakeStore) MarkRead(_ context.Context, _, _ string) error       { return nil }
func (f *fakeStore) SetReply(_ context.Context, _, _, _, _ string) error { return nil }

type fakeProgress struct {
	ports.ProgressRepo
	cleared []progress.ClearedScenario
}

func (f fakeProgress) ClearedScenariosDetail(_ context.Context, _ string) ([]progress.ClearedScenario, error) {
	return f.cleared, nil
}
func (f fakeProgress) ClearedScenarioIDs(_ context.Context, _ string) (map[string]bool, error) {
	return map[string]bool{}, nil
}
func (f fakeProgress) AttemptedScenarioIDs(_ context.Context, _ string) (map[string]bool, error) {
	return map[string]bool{}, nil
}

type fakeContent struct {
	ports.ContentReader
	scen map[string]*content.Scenario
}

func (f fakeContent) GetScenario(_ context.Context, id string) (*content.Scenario, error) {
	return f.scen[id], nil
}

type fakeReview struct{ ports.ReviewRepo }

func (f fakeReview) ListModelAnswerCards(_ context.Context, _ string, _ []string) (map[string][]progress.ModelAnswerCard, error) {
	return map[string][]progress.ModelAnswerCard{}, nil
}

func patientScenario(id, name string) *content.Scenario {
	return &content.Scenario{ID: id, Tagline: "흉통 호소", Persona: content.Persona{Name: name, Role: "patient", Sub: "60s / M"}}
}

// passingID finds a scenario id that clears the eligibility gate for grade 100 (threshold
// 0.85), so the generation test is deterministic.
func passingID(userID string) string {
	for i := 0; i < 1000; i++ {
		id := fmt.Sprintf("SCN-%03d", i)
		if hashUnit(userID+"|"+id) < gateThreshold(100) {
			return id
		}
	}
	return "SCN-000"
}

func newSvc(store Store, prog ports.ProgressRepo, cont ports.ContentReader) *Service {
	return NewService(store, prog, cont, fakeReview{}, nil, "") // nil LLM → template fallback
}

func TestGateThresholdRisesWithGrade(t *testing.T) {
	if gateThreshold(90) <= gateThreshold(70) || gateThreshold(70) <= gateThreshold(40) {
		t.Fatal("a better encounter must be likelier to bring a note")
	}
	if gateThreshold(-1) != gateThreshold(30) {
		t.Fatal("ungraded uses the low threshold")
	}
}

func TestEligibleIsStable(t *testing.T) {
	a := hashUnit("u1|SCN-1") < gateThreshold(80)
	b := hashUnit("u1|SCN-1") < gateThreshold(80)
	if a != b {
		t.Fatal("the same encounter must resolve the same way every time")
	}
}

func TestIsPatient(t *testing.T) {
	for _, r := range []string{"patient", "parent", "family", ""} {
		if !isPatient(r) {
			t.Fatalf("%q should count as a patient", r)
		}
	}
	for _, r := range []string{"doctor", "surgeon", "nurse"} {
		if isPatient(r) {
			t.Fatalf("%q is a colleague, not a patient", r)
		}
	}
}

func TestInboxGeneratesOneNoteThenStops(t *testing.T) {
	uid := "u1"
	id := passingID(uid)
	store := &fakeStore{}
	prog := fakeProgress{cleared: []progress.ClearedScenario{{ScenarioID: id, Grade: 100, ClearedAt: time.Now()}}}
	cont := fakeContent{scen: map[string]*content.Scenario{id: patientScenario(id, "Mr. Park")}}
	svc := newSvc(store, prog, cont)

	notes, unread, err := svc.Inbox(context.Background(), uid, "ko")
	if err != nil {
		t.Fatal(err)
	}
	if len(notes) != 1 || unread != 1 {
		t.Fatalf("one unread note expected, got %d notes / %d unread", len(notes), unread)
	}
	got := notes[0]
	validKind := got.Kind == KindGratitude || got.Kind == KindFollowup || got.Kind == KindReview
	if got.PatientName != "Mr. Park" || got.Body == "" || !validKind {
		t.Fatalf("note wrong: %+v", got)
	}
	// A second open does not regenerate (already noted).
	notes2, _, _ := svc.Inbox(context.Background(), uid, "ko")
	if len(notes2) != 1 {
		t.Fatalf("no new note should be generated: got %d", len(notes2))
	}
}

func TestInboxSkipsNonPatient(t *testing.T) {
	uid := "u2"
	id := passingID(uid)
	doc := &content.Scenario{ID: id, Persona: content.Persona{Name: "Dr. Kim", Role: "doctor"}}
	store := &fakeStore{}
	prog := fakeProgress{cleared: []progress.ClearedScenario{{ScenarioID: id, Grade: 100, ClearedAt: time.Now()}}}
	svc := newSvc(store, prog, fakeContent{scen: map[string]*content.Scenario{id: doc}})
	notes, _, _ := svc.Inbox(context.Background(), uid, "ko")
	if len(notes) != 0 {
		t.Fatalf("a doctor encounter yields no patient note, got %d", len(notes))
	}
}

func TestJSONField(t *testing.T) {
	if jsonField(`sure! {"body": "hi there"} ok`, "body") != "hi there" {
		t.Fatal("should extract the body from a wrapped JSON reply")
	}
	if jsonField("no json here", "body") != "" {
		t.Fatal("no json → empty")
	}
}
