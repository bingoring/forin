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
	inserted       []ports.SpeechAttemptInput
	nextID         int
	attemptNo      map[string]int // userID|sentenceKey -> next attempt_no
	insertErr      error          // when set, InsertAttempt fails (persist-after-scoring failure tests)
	historyRows    []ports.SpeechAttemptRow
	historyErr     error
	getRefErr      error
	refRow         *ports.SentenceReferenceRow // pre-seeded cache row, for cache-hit tests
	putReference   []ports.SentenceReferenceRow
	getRefAudioErr error
	updatedAudio   []updatedAudioCall // every UpdateReferenceAudio call, in order
	updateAudioErr error
	// The review aggregates (Scenario Clear read-back, Review Lab 직접 말하기
	// 연습) read these back instead of deriving them from `inserted`: the real
	// queries collapse re-tries and sort in SQL, so a fake that re-implemented
	// that logic would be testing itself.
	sessionRows []ports.SpokenSentenceRow
	sessionErr  error
	bands       ports.SpeakBandCounts
	bandsErr    error
	spokenRows  []ports.SpokenSentenceRow
	spokenTotal int
	spokenErr   error
	// spokenCalls records (weakestFirst, limit, offset) per call so a test can
	// assert the summary asks for the weakest two through the same paged query
	// the full list uses.
	spokenCalls []spokenCall
	depts       []string
}

type spokenCall struct {
	Sort          string
	Dept          string
	Q             string
	Limit, Offset int
}

func (f *fakeSpeechRepo) ListSessionSpeech(ctx context.Context, userID, sessionID string) ([]ports.SpokenSentenceRow, error) {
	return f.sessionRows, f.sessionErr
}

func (f *fakeSpeechRepo) SpeakBands(ctx context.Context, userID, dept string) (ports.SpeakBandCounts, error) {
	return f.bands, f.bandsErr
}

func (f *fakeSpeechRepo) SpokenDepartments(context.Context, string) ([]string, error) {
	return f.depts, nil
}

func (f *fakeSpeechRepo) ListSpokenSentences(ctx context.Context, userID, sort, dept, q string, limit, offset int) ([]ports.SpokenSentenceRow, int, error) {
	f.spokenCalls = append(f.spokenCalls, spokenCall{sort, dept, q, limit, offset})
	if f.spokenErr != nil {
		return nil, 0, f.spokenErr
	}
	rows := f.spokenRows
	if offset >= len(rows) {
		return nil, 0, nil
	}
	rows = rows[offset:]
	if len(rows) > limit {
		rows = rows[:limit]
	}
	return rows, f.spokenTotal, nil
}

// updatedAudioCall records one UpdateReferenceAudio invocation, for tests
// asserting a legacy row was backfilled exactly once (review round 2,
// Important 1).
type updatedAudioCall struct {
	SentenceKey string
	Wav         []byte
}

func newFakeSpeechRepo() *fakeSpeechRepo {
	return &fakeSpeechRepo{attemptNo: map[string]int{}}
}

func (f *fakeSpeechRepo) InsertAttempt(ctx context.Context, a ports.SpeechAttemptInput) (string, int, error) {
	if f.insertErr != nil {
		return "", 0, f.insertErr
	}
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

// GetReferenceAudio mirrors the real repo's "check the pre-seeded row, then
// anything PutReference stored" — cache-hit tests pre-seed refRow.ReferenceAudio
// directly; derive-and-cache tests find it in putReference after Reference runs.
func (f *fakeSpeechRepo) GetReferenceAudio(ctx context.Context, sentenceKey string) ([]byte, error) {
	if f.getRefAudioErr != nil {
		return nil, f.getRefAudioErr
	}
	if f.refRow != nil && f.refRow.SentenceKey == sentenceKey && len(f.refRow.ReferenceAudio) > 0 {
		return f.refRow.ReferenceAudio, nil
	}
	for _, r := range f.putReference {
		if r.SentenceKey == sentenceKey {
			return r.ReferenceAudio, nil
		}
	}
	return nil, nil
}

// UpdateReferenceAudio mirrors the real repo's guard (only writes if the row
// still has no audio) by mutating refRow in place — so a subsequent
// GetReferenceAudio call in the SAME test sees the backfilled bytes, exactly
// as a real second query against Postgres would after the UPDATE commits.
func (f *fakeSpeechRepo) UpdateReferenceAudio(ctx context.Context, sentenceKey string, wav []byte) error {
	if f.updateAudioErr != nil {
		return f.updateAudioErr
	}
	f.updatedAudio = append(f.updatedAudio, updatedAudioCall{SentenceKey: sentenceKey, Wav: wav})
	if f.refRow != nil && f.refRow.SentenceKey == sentenceKey && len(f.refRow.ReferenceAudio) == 0 {
		f.refRow.ReferenceAudio = wav
	}
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

// Review round 2, Important 1: by the time InsertAttempt runs, Assess has
// already happened — Azure was already paid for (I4) and produced a real
// score. A storage failure after that must not throw the result away: Record
// must still return it (with PersistErr set), not an error, so the caller
// (Task 5's HTTP handler) can show the learner their score instead of a
// generic "try again" that implies scoring itself failed.
func TestRecordReturnsScoredResultWhenPersistFails(t *testing.T) {
	pron := &fakePronPort{result: sampleResult()}
	repo := newFakeSpeechRepo()
	repo.insertErr = errors.New("db: connection reset")
	svc := newTestService(pron, repo)

	rec, err := svc.Record(context.Background(), "u1", []byte("wav"), "I'm giving you acetaminophen", RecordOptions{Origin: "dialogue"})
	if err != nil {
		t.Fatalf("Record must not error when only persistence fails (scoring already succeeded), got %v", err)
	}
	if rec == nil || rec.Result == nil {
		t.Fatalf("the scored result must still come back, got %+v", rec)
	}
	if rec.Result.Recognized != "I'm giving you acetaminophen" {
		t.Fatalf("scored result must be the real Assess output, got %+v", rec.Result)
	}
	if rec.PersistErr == nil {
		t.Fatalf("PersistErr must carry the storage failure so the caller can log/warn about it")
	}
	if rec.ID != "" || rec.AttemptNo != 0 {
		t.Fatalf("no row was written, so ID/AttemptNo must stay zero-value, got ID=%q AttemptNo=%d", rec.ID, rec.AttemptNo)
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
