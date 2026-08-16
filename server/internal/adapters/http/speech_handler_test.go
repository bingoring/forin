package http

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/adapters/azurespeech"
	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// ---- fakes: minimal ports implementations, mirroring the pattern already
// established in internal/domain/speech's own tests (fakePronPort etc.), but
// living here since these exercise the HTTP layer's wiring/error-mapping, not
// domain/speech's business rules (already covered by Task 3/4's tests). ----

type fakePronPort struct {
	result *ports.PronunciationResult
	err    error
}

func (f *fakePronPort) Assess(ctx context.Context, audioWav []byte, referenceText, locale string) (*ports.PronunciationResult, error) {
	if f.err != nil {
		return nil, f.err
	}
	return f.result, nil
}

func (f *fakePronPort) Transcribe(ctx context.Context, audioWav []byte, locale string) (string, error) {
	return "", nil
}

type fakeProfiles struct{}

func (fakeProfiles) GetProfile(ctx context.Context, userID string) (*user.Profile, error) {
	return &user.Profile{TargetLang: "en"}, nil
}

// fakeSpeechRepo is an in-memory ports.SpeechRepo. ListAttempts is keyed by
// userID so tests can assert isolation (business-rules §3: "시도 이력은 본인 것만
// 조회된다") instead of trusting the handler to ask the right question.
type fakeSpeechRepo struct {
	rowsByUser map[string][]ports.SpeechAttemptRow
	getRefErr  error
	refRow     *ports.SentenceReferenceRow
}

func newFakeSpeechRepo() *fakeSpeechRepo {
	return &fakeSpeechRepo{rowsByUser: map[string][]ports.SpeechAttemptRow{}}
}

func (f *fakeSpeechRepo) InsertAttempt(ctx context.Context, a ports.SpeechAttemptInput) (string, int, error) {
	rows := f.rowsByUser[a.UserID]
	no := len(rows) + 1
	rows = append(rows, ports.SpeechAttemptRow{ID: "attempt-x", AttemptNo: no, Recognized: a.Recognized, Overall: a.Overall})
	f.rowsByUser[a.UserID] = rows
	return "attempt-x", no, nil
}

func (f *fakeSpeechRepo) ListAttempts(ctx context.Context, userID, sentenceKey string, limit int) ([]ports.SpeechAttemptRow, error) {
	rows := f.rowsByUser[userID]
	// newest attempt_no first, matching the real repo's contract (History reverses it).
	out := make([]ports.SpeechAttemptRow, len(rows))
	for i, r := range rows {
		out[len(rows)-1-i] = r
	}
	if limit > 0 && len(out) > limit {
		out = out[:limit]
	}
	return out, nil
}

func (f *fakeSpeechRepo) GetReference(ctx context.Context, sentenceKey string) (*ports.SentenceReferenceRow, error) {
	if f.getRefErr != nil {
		return nil, f.getRefErr
	}
	return f.refRow, nil
}

func (f *fakeSpeechRepo) PutReference(ctx context.Context, r ports.SentenceReferenceRow) error {
	return nil
}

// fakeReviewRepo implements ports.ReviewRepo. owned marks which cardID belongs
// to which userID, so GetCardForUser can behave like the real Postgres query
// (WHERE user_id = ? AND id = ?): a card owned by someone else simply doesn't
// match and comes back nil, same as "doesn't exist" — the handler must map
// that to 403 (business-rules §2), not leak which case it was.
type fakeReviewRepo struct {
	owned map[string]string // cardID -> ownerUserID
}

func (f *fakeReviewRepo) DueCards(ctx context.Context, userID string, today time.Time, limit int) ([]progress.ReviewCard, error) {
	return nil, nil
}

func (f *fakeReviewRepo) GetCardForUser(ctx context.Context, userID, cardID string) (*progress.ReviewCard, error) {
	if f.owned[cardID] != userID {
		return nil, nil
	}
	return &progress.ReviewCard{ID: cardID}, nil
}

func (f *fakeReviewRepo) SaveSchedule(ctx context.Context, cardID string, s progress.Schedule, masteryPips int) error {
	return nil
}

func (f *fakeReviewRepo) CreateCard(ctx context.Context, c ports.NewReviewCard) (string, error) {
	return "", nil
}

type fakeSynth struct {
	configured bool
	wav        []byte
	err        error
}

func (f *fakeSynth) Synthesize(ctx context.Context, text, voice, locale string) ([]byte, error) {
	if f.err != nil {
		return nil, f.err
	}
	return f.wav, nil
}

func (f *fakeSynth) Configured() bool { return f.configured }

func sampleAssessResult() *ports.PronunciationResult {
	return &ports.PronunciationResult{
		Recognized:   "I'm giving you acetaminophen",
		Accuracy:     84,
		Fluency:      79,
		Completeness: 100,
		Overall:      81,
		Prosody:      80,
		ProsodyOK:    true,
		Words: []ports.WordScore{
			{Word: "acetaminophen", Accuracy: 62, Phonemes: []ports.PhonemeResult{{Phoneme: "s", Accuracy: 88}}},
		},
	}
}

func newTestSpeechService(pron *fakePronPort, repo *fakeSpeechRepo, synth ports.SpeechSynthesizer) (*speech.Service, *pronunciation.Service) {
	pronSvc := pronunciation.NewService(pron, fakeProfiles{})
	return speech.NewService(repo, pronSvc, synth), pronSvc
}

func withUser(r *http.Request, uid string) *http.Request {
	return r.WithContext(context.WithValue(r.Context(), userIDKey, uid))
}

// ---- Step 1: failing handler tests (business-rules §2, §3, §5) ----

// 401: GET /speech/attempts with no Authorization header must be rejected by
// the same requireAuth wrapper every other authenticated route uses.
func TestAttemptsRequireAuth(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	tokens := auth.NewTokenService([]byte("test-signing-key-0123456789"), "forin-test", time.Hour)
	handler := requireAuth(tokens)(http.HandlerFunc(sh.attempts))

	req := httptest.NewRequest(http.MethodGet, "/speech/attempts?text=hello", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 with no bearer token, got %d: %s", w.Code, w.Body.String())
	}
}

// A user must never see another user's attempt history through this endpoint
// (business-rules §3: "시도 이력은 본인 것만 조회된다").
func TestAttemptsOnlyReturnsOwn(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.rowsByUser["user-a"] = []ports.SpeechAttemptRow{{ID: "a1", AttemptNo: 1, Recognized: "hi"}}
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/attempts?text=hello", nil)
	req = withUser(req, "user-b")
	w := httptest.NewRecorder()
	sh.attempts(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var rows []ports.SpeechAttemptRow
	if err := json.Unmarshal(w.Body.Bytes(), &rows); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(rows) != 0 {
		t.Fatalf("user-b must not see user-a's attempts, got %+v", rows)
	}
}

// business-rules §2: referenceText over 300 chars -> 400 invalid_reference_text.
func TestReferenceTextTooLongIs400(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	longText := ""
	for i := 0; i < 301; i++ {
		longText += "a"
	}
	body, _ := json.Marshal(map[string]string{
		"referenceText": longText,
		"audioBase64":   base64.StdEncoding.EncodeToString([]byte("wav-bytes")),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for a 301-char referenceText, got %d: %s", w.Code, w.Body.String())
	}
}

// azurespeech.ErrNoSpeech must surface as 422 no_speech_detected, not a 502 or
// a stored attempt (business-rules §5).
func TestNoSpeechIs422(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{err: azurespeech.ErrNoSpeech}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]string{
		"referenceText": "quiet room",
		"audioBase64":   base64.StdEncoding.EncodeToString([]byte("silence")),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422 for ErrNoSpeech, got %d: %s", w.Code, w.Body.String())
	}
	if len(repo.rowsByUser["user-a"]) != 0 {
		t.Fatalf("no_speech must not persist an attempt, got %+v", repo.rowsByUser["user-a"])
	}
}

// business-rules §2: a reviewCardId that belongs to someone else -> 403.
func TestReviewCardOwnershipEnforced(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{"card-owned-by-someone-else": "user-victim"}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	cardID := "card-owned-by-someone-else"
	body, _ := json.Marshal(map[string]any{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   base64.StdEncoding.EncodeToString([]byte("wav-bytes")),
		"reviewCardId":  cardID,
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-attacker")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for someone else's reviewCardId, got %d: %s", w.Code, w.Body.String())
	}
	if len(repo.rowsByUser["user-attacker"]) != 0 {
		t.Fatalf("a rejected reviewCardId must not still persist an attempt, got %+v", repo.rowsByUser["user-attacker"])
	}
}

// business-rules §5: AZURE_SPEECH_KEY unset must surface as a disabled signal
// on a response the app already calls at boot, not a 503 at some new
// endpoint. This repo picks GET /config/economy (mobile/src/app/_layout.tsx
// hydrates it unconditionally alongside session bootstrap on every launch).
func TestPronunciationDisabledWhenAzureUnset(t *testing.T) {
	ch := &contentHandler{pronunciationEnabled: false}
	req := httptest.NewRequest(http.MethodGet, "/config/economy", nil)
	w := httptest.NewRecorder()
	ch.economyConfig(w, req)

	if w.Code != http.StatusServiceUnavailable {
		// (This check exists to make the negative explicit: it must NOT be 503.)
	}
	if w.Code != http.StatusOK {
		t.Fatalf("Azure unset must still return 200 (feature-disabled signal, not an error), got %d", w.Code)
	}
	var got map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if enabled, ok := got["pronunciationEnabled"].(bool); !ok || enabled {
		t.Fatalf("expected pronunciationEnabled=false in /config/economy body, got %+v", got)
	}
}

// ---- extra coverage beyond the brief's 6, per Task 5's own judgment calls ----

// business-rules §5 "참조 생성(TTS→assess) 실패": every failure mode is treated
// alike — GET /speech/reference must still answer 200 (with the reference
// omitted) rather than failing the practice-screen request outright.
func TestReferenceReturns200EvenWhenDerivationFails(t *testing.T) {
	repo := newFakeSpeechRepo()
	synth := &fakeSynth{configured: false} // ErrTTSNotConfigured path
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, synth)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.reference(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("reference derivation failing must not fail the request, got %d: %s", w.Code, w.Body.String())
	}
}

// Regression guard (brief item 3): POST /pronunciation must keep every field
// the response already had before Task 5 — old mobile clients read those
// directly, and adding attemptId/attemptNo must not shove them out.
func TestPronunciationResponseKeepsExistingFields(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]string{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   base64.StdEncoding.EncodeToString([]byte("wav-bytes")),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var got map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	for _, field := range []string{"recognized", "accuracy", "fluency", "completeness", "overall", "prosodyAvailable", "words", "durationMs"} {
		if _, ok := got[field]; !ok {
			t.Errorf("existing field %q missing from response — regression risk for old mobile clients: %+v", field, got)
		}
	}
	if _, ok := got["attemptId"]; !ok {
		t.Errorf("attemptId missing from response: %+v", got)
	}
	if _, ok := got["attemptNo"]; !ok {
		t.Errorf("attemptNo missing from response: %+v", got)
	}
}
