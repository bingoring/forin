package speech

import (
	"context"
	"errors"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// fakePronPort is a fake ports.PronunciationPort that counts Assess calls
// (business-rules I4: Azure is called at most once per attempt) and returns a
// scripted result or error.
type fakePronPort struct {
	result      *ports.PronunciationResult
	err         error
	assessCalls int
}

func (f *fakePronPort) Assess(ctx context.Context, audioWav []byte, referenceText, locale string) (*ports.PronunciationResult, error) {
	f.assessCalls++
	if f.err != nil {
		return nil, f.err
	}
	return f.result, nil
}

func (f *fakePronPort) Transcribe(ctx context.Context, audioWav []byte, locale string) (string, error) {
	return "", errors.New("not used in these tests")
}

// fakeProfiles always resolves to en-US (empty TargetLang -> Service default).
type fakeProfiles struct{}

func (fakeProfiles) GetProfile(ctx context.Context, userID string) (*user.Profile, error) {
	return &user.Profile{TargetLang: "en"}, nil
}

// fakeSpeechRepo is an in-memory ports.SpeechRepo that records exactly what it
// was asked to insert, so tests can assert on both "was InsertAttempt called"
// and "with what".
type fakeSpeechRepo struct {
	inserted     []ports.SpeechAttemptInput
	nextID       int
	attemptNo    map[string]int // userID|sentenceKey -> next attempt_no
	historyRows  []ports.SpeechAttemptRow
	historyErr   error
	getRefErr    error
	refRow       *ports.SentenceReferenceRow // pre-seeded cache row, for cache-hit tests
	putReference []ports.SentenceReferenceRow
}

func newFakeSpeechRepo() *fakeSpeechRepo {
	return &fakeSpeechRepo{attemptNo: map[string]int{}}
}

func (f *fakeSpeechRepo) InsertAttempt(ctx context.Context, a ports.SpeechAttemptInput) (string, int, error) {
	f.inserted = append(f.inserted, a)
	key := a.UserID + "|" + a.SentenceKey
	f.attemptNo[key]++
	f.nextID++
	id := "attempt-" + string(rune('0'+f.nextID))
	return id, f.attemptNo[key], nil
}

func (f *fakeSpeechRepo) ListAttempts(ctx context.Context, userID, sentenceKey string, limit int) ([]ports.SpeechAttemptRow, error) {
	if f.historyErr != nil {
		return nil, f.historyErr
	}
	return f.historyRows, nil
}

func (f *fakeSpeechRepo) GetReference(ctx context.Context, sentenceKey string) (*ports.SentenceReferenceRow, error) {
	if f.getRefErr != nil {
		return nil, f.getRefErr
	}
	return f.refRow, nil
}

func (f *fakeSpeechRepo) PutReference(ctx context.Context, r ports.SentenceReferenceRow) error {
	f.putReference = append(f.putReference, r)
	return nil
}

func newTestService(pron *fakePronPort, repo *fakeSpeechRepo) *Service {
	pronSvc := pronunciation.NewService(pron, fakeProfiles{})
	return NewService(repo, pronSvc, nil) // these tests never touch Reference/tts
}

func sampleResult() *ports.PronunciationResult {
	return &ports.PronunciationResult{
		Recognized:   "I'm giving you acetaminophen",
		Accuracy:     84,
		Fluency:      79,
		Completeness: 100,
		Overall:      81,
		Prosody:      80,
		ProsodyOK:    true,
		Words: []ports.WordScore{
			{
				Word:     "acetaminophen",
				Accuracy: 62,
				Phonemes: []ports.PhonemeResult{
					{Phoneme: "s", Accuracy: 88},
					{Phoneme: "ɪ", Accuracy: 41},
				},
			},
			{
				Word:     "you",
				Accuracy: 90,
				Phonemes: []ports.PhonemeResult{
					{Phoneme: "j", Accuracy: 95},
				},
			},
		},
	}
}

// All of a scored result's phonemes must reach the repo via Words — the repo
// fans them out into speech_phoneme_scores rows (I2's raw material). This
// guards against Record silently dropping the field on the way to the store.
func TestRecordFansOutPhonemes(t *testing.T) {
	pron := &fakePronPort{result: sampleResult()}
	repo := newFakeSpeechRepo()
	svc := newTestService(pron, repo)

	_, err := svc.Record(context.Background(), "u1", []byte("wav"), "I'm giving you acetaminophen", RecordOptions{Origin: "dialogue"})
	if err != nil {
		t.Fatalf("Record: %v", err)
	}
	if len(repo.inserted) != 1 {
		t.Fatalf("expected exactly one InsertAttempt call, got %d", len(repo.inserted))
	}
	got := repo.inserted[0].Words
	if len(got) != 2 || len(got[0].Phonemes) != 2 || len(got[1].Phonemes) != 1 {
		t.Fatalf("phonemes not carried through to the repo input: %+v", got)
	}
	if got[0].Phonemes[1].Phoneme != "ɪ" {
		t.Fatalf("phoneme detail lost: %+v", got[0].Phonemes)
	}
}

// A no-speech assessment must not be persisted at all — not the attempt, and
// per business-rules "엣지케이스" table, not an attempt_no either. Record
// returns the error untouched (Task 5 maps ErrNoSpeech -> 422).
func TestRecordDoesNotPersistNoSpeech(t *testing.T) {
	sentinel := errors.New("azurespeech: no speech detected")
	pron := &fakePronPort{err: sentinel}
	repo := newFakeSpeechRepo()
	svc := newTestService(pron, repo)

	_, err := svc.Record(context.Background(), "u1", []byte("wav"), "hello", RecordOptions{Origin: "dialogue"})
	if !errors.Is(err, sentinel) {
		t.Fatalf("expected the scorer's error to propagate untouched, got %v", err)
	}
	if len(repo.inserted) != 0 {
		t.Fatalf("no-speech must not persist an attempt, got %d inserts", len(repo.inserted))
	}
}

// Azure is a paid, per-attempt call (invariant I4) — Record must call the
// scorer exactly once even though it also needs the resolved locale (via
// pronunciation.Service.LocaleFor, which does not touch Azure).
func TestRecordCallsScorerOnce(t *testing.T) {
	pron := &fakePronPort{result: sampleResult()}
	repo := newFakeSpeechRepo()
	svc := newTestService(pron, repo)

	if _, err := svc.Record(context.Background(), "u1", []byte("wav"), "hello", RecordOptions{Origin: "dialogue"}); err != nil {
		t.Fatalf("Record: %v", err)
	}
	if pron.assessCalls != 1 {
		t.Fatalf("Assess called %d times, want exactly 1 (I4)", pron.assessCalls)
	}
}

// The practice screen renders 1st -> 2nd -> 3rd try (business-rules R3), but
// ListAttempts hands rows back newest-first (attempt_no DESC per Task 2's
// doc). History must reverse that so the screen never has to.
func TestHistoryIsOldestFirst(t *testing.T) {
	pron := &fakePronPort{result: sampleResult()}
	repo := newFakeSpeechRepo()
	repo.historyRows = []ports.SpeechAttemptRow{
		{ID: "a3", AttemptNo: 3, Overall: 74},
		{ID: "a2", AttemptNo: 2, Overall: 68},
		{ID: "a1", AttemptNo: 1, Overall: 55},
	}
	svc := newTestService(pron, repo)

	got, err := svc.History(context.Background(), "u1", "key123", 3)
	if err != nil {
		t.Fatalf("History: %v", err)
	}
	if len(got) != 3 {
		t.Fatalf("expected 3 rows, got %d", len(got))
	}
	if got[0].AttemptNo != 1 || got[1].AttemptNo != 2 || got[2].AttemptNo != 3 {
		t.Fatalf("History must return oldest-first, got attempt_no order %d,%d,%d", got[0].AttemptNo, got[1].AttemptNo, got[2].AttemptNo)
	}
}

// business-rules §2: an unknown Origin must be downgraded to "freeform" rather
// than stored verbatim or rejected — Record is the last chance to enforce the
// allowed-set before the row lands in Postgres.
func TestRecordDowngradesUnknownOrigin(t *testing.T) {
	pron := &fakePronPort{result: sampleResult()}
	repo := newFakeSpeechRepo()
	svc := newTestService(pron, repo)

	if _, err := svc.Record(context.Background(), "u1", []byte("wav"), "hello", RecordOptions{Origin: "bogus"}); err != nil {
		t.Fatalf("Record: %v", err)
	}
	if len(repo.inserted) != 1 || repo.inserted[0].Origin != "freeform" {
		t.Fatalf("unknown origin must be downgraded to freeform, got %+v", repo.inserted)
	}
}

// invariant I3: origin='drill' must never carry a review_card_id, even if the
// caller passed one (e.g. stale/incorrect option state upstream).
func TestRecordClearsReviewCardForDrillOrigin(t *testing.T) {
	pron := &fakePronPort{result: sampleResult()}
	repo := newFakeSpeechRepo()
	svc := newTestService(pron, repo)
	cardID := "card-1"

	if _, err := svc.Record(context.Background(), "u1", []byte("wav"), "hello", RecordOptions{Origin: "drill", ReviewCardID: &cardID}); err != nil {
		t.Fatalf("Record: %v", err)
	}
	if len(repo.inserted) != 1 || repo.inserted[0].ReviewCardID != nil {
		t.Fatalf("drill attempts must never carry a review_card_id (I3), got %+v", repo.inserted)
	}
}
