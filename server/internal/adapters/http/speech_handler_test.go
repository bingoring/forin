package http

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/adapters/azurespeech"
	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/progress"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
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
	// transcript is what Transcribe hands back; assessedRefs records every
	// reference text Assess was scored against, so a dictation test can assert
	// free speech is scored against the transcript itself.
	transcript   string
	assessedRefs []string
	assessErr    error
}

func (f *fakePronPort) Assess(ctx context.Context, audioWav []byte, referenceText, locale string) (*ports.PronunciationResult, error) {
	f.assessedRefs = append(f.assessedRefs, referenceText)
	if f.assessErr != nil {
		return nil, f.assessErr
	}
	if f.err != nil {
		return nil, f.err
	}
	return f.result, nil
}

func (f *fakePronPort) Transcribe(ctx context.Context, audioWav []byte, locale string) (string, error) {
	if f.err != nil {
		return "", f.err
	}
	return f.transcript, nil
}

type fakeProfiles struct{}

func (fakeProfiles) GetProfile(ctx context.Context, userID string) (*user.Profile, error) {
	return &user.Profile{TargetLang: "en"}, nil
}

// fakeSpeechRepo is an in-memory ports.SpeechRepo. ListAttempts is keyed by
// userID so tests can assert isolation (business-rules §3: "시도 이력은 본인 것만
// 조회된다") instead of trusting the handler to ask the right question.
// inserted records every InsertAttempt call verbatim (review round 2: needed
// to assert what actually reached the repo — e.g. that an empty-string
// reviewCardId was normalized to nil before it got there).
type fakeSpeechRepo struct {
	rowsByUser     map[string][]ports.SpeechAttemptRow
	inserted       []ports.SpeechAttemptInput
	insertErr      error // when set, InsertAttempt fails AFTER Assess already ran (persist-failure tests)
	getRefErr      error
	refRow         *ports.SentenceReferenceRow
	putReference   []ports.SentenceReferenceRow
	getRefAudioErr error
	updatedAudio   []struct {
		SentenceKey string
		Wav         []byte
	}
	updateAudioErr error
	bands          ports.SpeakBandCounts
	// spokenCalls records the (weakestFirst, limit, offset) the handler asked
	// for, so a query-string test can assert the sort actually reached the repo.
	depts       []string
	spokenCalls []struct {
		Sort          string
		Dept          string
		Q             string
		Limit, Offset int
	}
}

// ListSessionSpeech derives the run's sentences from what was actually inserted,
// so a test can drive POST /stt and then read the review back through the same
// fake — the wiring under test is exactly that round trip.
func (f *fakeSpeechRepo) ListSessionSpeech(ctx context.Context, userID, sessionID string) ([]ports.SpokenSentenceRow, error) {
	var out []ports.SpokenSentenceRow
	for _, a := range f.inserted {
		if a.UserID != userID || a.SessionID != sessionID {
			continue
		}
		out = append(out, ports.SpokenSentenceRow{
			SentenceKey: a.SentenceKey, ReferenceText: a.ReferenceText, Recognized: a.Recognized,
			Overall: a.Overall, Accuracy: a.Accuracy, Fluency: a.Fluency,
			ScenarioID: a.ScenarioID, Origin: a.Origin, Attempts: 1,
		})
	}
	return out, nil
}

func (f *fakeSpeechRepo) SpeakBands(ctx context.Context, userID, dept string) (ports.SpeakBandCounts, error) {
	return f.bands, nil
}

func (f *fakeSpeechRepo) SpokenDepartments(context.Context, string) ([]string, error) {
	return f.depts, nil
}

func (f *fakeSpeechRepo) ListSpokenSentences(ctx context.Context, userID, sort, dept, q string, limit, offset int) ([]ports.SpokenSentenceRow, int, error) {
	f.spokenCalls = append(f.spokenCalls, struct {
		Sort          string
		Dept          string
		Q             string
		Limit, Offset int
	}{sort, dept, q, limit, offset})
	rows, err := f.ListSessionSpeech(ctx, userID, "")
	return rows, len(rows), err
}

func newFakeSpeechRepo() *fakeSpeechRepo {
	return &fakeSpeechRepo{rowsByUser: map[string][]ports.SpeechAttemptRow{}}
}

func (f *fakeSpeechRepo) InsertAttempt(ctx context.Context, a ports.SpeechAttemptInput) (string, int, error) {
	f.inserted = append(f.inserted, a)
	if f.insertErr != nil {
		return "", 0, f.insertErr
	}
	rows := f.rowsByUser[a.UserID]
	no := len(rows) + 1
	rows = append(rows, ports.SpeechAttemptRow{
		ID: "attempt-x", AttemptNo: no, Recognized: a.Recognized, Overall: a.Overall,
		Accuracy: a.Accuracy, Fluency: a.Fluency, Completeness: a.Completeness,
		Prosody: a.Prosody, ProsodyOK: a.ProsodyOK, DurationMS: a.DurationMS, Words: a.Words,
	})
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
	f.putReference = append(f.putReference, r)
	return nil
}

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

// UpdateReferenceAudio mirrors the real repo's guard by mutating refRow in
// place — a subsequent GetReferenceAudio call in the same test sees the
// backfilled bytes (review round 2, Important 1).
func (f *fakeSpeechRepo) UpdateReferenceAudio(ctx context.Context, sentenceKey string, wav []byte) error {
	if f.updateAudioErr != nil {
		return f.updateAudioErr
	}
	f.updatedAudio = append(f.updatedAudio, struct {
		SentenceKey string
		Wav         []byte
	}{SentenceKey: sentenceKey, Wav: wav})
	if f.refRow != nil && f.refRow.SentenceKey == sentenceKey && len(f.refRow.ReferenceAudio) == 0 {
		f.refRow.ReferenceAudio = wav
	}
	return nil
}

// fakeReviewRepo implements ports.ReviewRepo. owned marks which cardID belongs
// to which userID, so GetCardForUser can behave like the real Postgres query
// (WHERE user_id = ? AND id = ?): a card owned by someone else simply doesn't
// match and comes back nil, same as "doesn't exist" — the handler must map
// that to 403 (business-rules §2), not leak which case it was.
type fakeReviewRepo struct {
	owned map[string]string // cardID -> ownerUserID
	// The 시나리오 모범답안 fixtures: `groups` is the page the repo hands back and
	// `cards` its corrections, keyed by scenario id.
	groups     []progress.ModelAnswerGroup
	groupTotal int
	cards      map[string][]progress.ModelAnswerCard
	// cardCalls records the scenario ids each ListModelAnswerCards call asked
	// for, so a test can assert the summary fetches ONE group's cards.
	cardCalls [][]string
	needsWork []bool
}

func (f *fakeReviewRepo) ListModelAnswerScenarios(ctx context.Context, userID string, needsWorkFirst bool, limit, offset int) ([]progress.ModelAnswerGroup, int, error) {
	f.needsWork = append(f.needsWork, needsWorkFirst)
	g := f.groups
	if offset >= len(g) {
		return nil, 0, nil
	}
	g = g[offset:]
	if len(g) > limit {
		g = g[:limit]
	}
	// Copy: the handler writes Cards onto the rows it gets back, and a fake that
	// handed out its own slice would accumulate cards across calls.
	out := make([]progress.ModelAnswerGroup, len(g))
	copy(out, g)
	return out, f.groupTotal, nil
}

func (f *fakeReviewRepo) ListModelAnswerCards(ctx context.Context, userID string, scenarioIDs []string) (map[string][]progress.ModelAnswerCard, error) {
	f.cardCalls = append(f.cardCalls, scenarioIDs)
	out := map[string][]progress.ModelAnswerCard{}
	for _, id := range scenarioIDs {
		if c, ok := f.cards[id]; ok {
			out[id] = c
		}
	}
	return out, nil
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
	synthCalls int
}

func (f *fakeSynth) Synthesize(ctx context.Context, text, voice, locale string) ([]byte, error) {
	f.synthCalls++
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

// testWav builds a minimal canonical RIFF/WAVE PCM16 16kHz mono clip of
// numSamples all-zero samples. Format/size/duration are all speech.ValidateWAV
// checks — never sample content — so all-zero data is enough to pass it.
// testWav(16000) is exactly 1 second, comfortably under both the 10s and 1MB
// caps.
func testWav(numSamples int) []byte {
	const sampleRate, channels, bytesPerSample = 16000, 1, 2
	dataLen := numSamples * channels * bytesPerSample
	buf := make([]byte, 44+dataLen)
	copy(buf[0:4], "RIFF")
	binary.LittleEndian.PutUint32(buf[4:8], uint32(36+dataLen))
	copy(buf[8:12], "WAVE")
	copy(buf[12:16], "fmt ")
	binary.LittleEndian.PutUint32(buf[16:20], 16)
	binary.LittleEndian.PutUint16(buf[20:22], 1) // PCM
	binary.LittleEndian.PutUint16(buf[22:24], uint16(channels))
	binary.LittleEndian.PutUint32(buf[24:28], uint32(sampleRate))
	byteRate := sampleRate * channels * bytesPerSample
	binary.LittleEndian.PutUint32(buf[28:32], uint32(byteRate))
	binary.LittleEndian.PutUint16(buf[32:34], uint16(channels*bytesPerSample))
	binary.LittleEndian.PutUint16(buf[34:36], 16) // bits per sample
	copy(buf[36:40], "data")
	binary.LittleEndian.PutUint32(buf[40:44], uint32(dataLen))
	return buf
}

func testWavBase64(numSamples int) string {
	return base64.StdEncoding.EncodeToString(testWav(numSamples))
}

// keysOf is a small helper for readable failure messages when asserting on a
// decoded JSON object's key set.
func keysOf(m map[string]any) []string {
	out := make([]string, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
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

// Review round 2 (Critical): the wire format must use the same camelCase
// vocabulary PronunciationResult already uses (durationMs, prosodyAvailable),
// not the bare Go field names (DurationMS, ProsodyOK) encoding/json falls
// back to without json tags. Decoding into []map[string]any — not back into
// []ports.SpeechAttemptRow — is deliberate: Go's own json.Unmarshal matches
// field names case-insensitively, so unmarshaling into the same struct can
// never catch a tag regression (this is exactly how the bug got through
// round 1's tests).
func TestAttemptsResponseUsesCamelCaseKeys(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.rowsByUser["user-a"] = []ports.SpeechAttemptRow{
		{
			ID: "a1", AttemptNo: 1, Recognized: "hi", Overall: 81, Accuracy: 84,
			Fluency: 79, Completeness: 100, Prosody: 80, ProsodyOK: true,
			DurationMS: 1500, CreatedAt: time.Date(2026, 8, 17, 0, 0, 0, 0, time.UTC),
		},
	}
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/attempts?text=hello", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.attempts(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var rows []map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &rows); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(rows) != 1 {
		t.Fatalf("expected 1 row, got %d: %+v", len(rows), rows)
	}
	row := rows[0]
	for _, key := range []string{"id", "attemptNo", "recognized", "overall", "accuracy", "fluency", "completeness", "prosody", "prosodyAvailable", "durationMs", "createdAt"} {
		if _, ok := row[key]; !ok {
			t.Errorf("expected camelCase key %q in the attempts response, got keys %v", key, keysOf(row))
		}
	}
	for _, wrongKey := range []string{"ID", "AttemptNo", "DurationMS", "ProsodyOK", "CreatedAt"} {
		if _, ok := row[wrongKey]; ok {
			t.Errorf("PascalCase key %q leaked onto the wire (missing json tag?), got %+v", wrongKey, row)
		}
	}
}

// Same Critical fix, for GET /speech/reference: sentenceKey/referenceText/
// locale/ipa/durationMs/words must all be camelCase on the wire.
func TestReferenceResponseUsesCamelCaseKeys(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey: "key123", ReferenceText: "hello there", Locale: "en-US",
		IPA: "/heˈloʊ ðɛr/", DurationMS: 900,
		Words: []ports.WordScore{{Word: "hello"}},
	}
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.reference(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	var got map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	for _, key := range []string{"sentenceKey", "referenceText", "locale", "ipa", "durationMs", "words"} {
		if _, ok := got[key]; !ok {
			t.Errorf("expected camelCase key %q in the reference response, got keys %v", key, keysOf(got))
		}
	}
	if _, ok := got["DurationMS"]; ok {
		t.Errorf("PascalCase key DurationMS leaked onto the wire, got %+v", got)
	}
}

// business-rules §2: referenceText over 300 chars -> 400 invalid_reference_text.
func TestReferenceTextTooLongIs400(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	longText := strings.Repeat("a", 301)
	body, _ := json.Marshal(map[string]string{
		"referenceText": longText,
		"audioBase64":   testWavBase64(16000),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for a 301-char referenceText, got %d: %s", w.Code, w.Body.String())
	}
}

// Review round 2, Important 4: GET /speech/reference had no length cap on
// `text` at all — an authenticated caller could trigger unbounded
// Synthesize+Assess cost via arbitrarily large query values, each landing a
// new, never-invalidated speech_references row (R9). Same cap POST
// /pronunciation already enforces.
func TestSpeechReferenceTextTooLongIs400(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	longText := strings.Repeat("a", 301)
	req := httptest.NewRequest(http.MethodGet, "/speech/reference?text="+longText, nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.reference(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for a 301-char text, got %d: %s", w.Code, w.Body.String())
	}
}

// Important 2: the 300-char cap is counted in runes, not bytes. A Korean
// sentence well under 300 characters can be well over 300 UTF-8 bytes; len()
// on a Go string counts bytes and would wrongly reject it.
func TestReferenceTextKoreanCountedInRunesNotBytes(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	koreanText := strings.Repeat("가", 101) // 101 runes, 303 bytes in UTF-8
	if len(koreanText) <= maxReferenceTextLen {
		t.Fatalf("test fixture must exceed the cap in bytes to be a meaningful regression guard, got %d bytes", len(koreanText))
	}
	body, _ := json.Marshal(map[string]string{
		"referenceText": koreanText,
		"audioBase64":   testWavBase64(16000),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("a 101-rune Korean sentence must not be rejected as too long (bytes != runes), got %d: %s", w.Code, w.Body.String())
	}
}

// Important 3: business-rules §2's audio row (RIFF PCM16 16kHz mono) must be
// enforced — non-WAV bytes must never reach the scorer (an Azure call costs
// money) or storage.
func TestInvalidAudioIs400(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]string{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   base64.StdEncoding.EncodeToString([]byte("not actually a wav file, just text")),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("non-WAV audio must be 400 invalid_audio, got %d: %s", w.Code, w.Body.String())
	}
	if len(repo.inserted) != 0 {
		t.Fatalf("invalid audio must never reach the scorer/store, got %+v", repo.inserted)
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
		"audioBase64":   testWavBase64(16000),
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
	review := &fakeReviewRepo{owned: map[string]string{"c0ffee00-0000-4000-8000-000000000001": "user-victim"}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	cardID := "c0ffee00-0000-4000-8000-000000000001"
	body, _ := json.Marshal(map[string]any{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   testWavBase64(16000),
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

// Important 4a: reviewCardId:"" must be treated as "no card", not forwarded
// to the repo as a literal empty string.
func TestReviewCardEmptyStringIsTreatedAsNoCard(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]any{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   testWavBase64(16000),
		"reviewCardId":  "",
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("an empty-string reviewCardId must be treated as no card, got %d: %s", w.Code, w.Body.String())
	}
	if len(repo.inserted) != 1 {
		t.Fatalf("expected exactly one InsertAttempt call, got %d", len(repo.inserted))
	}
	if repo.inserted[0].ReviewCardID != nil {
		t.Fatalf("an empty-string reviewCardId must be normalized to nil before reaching the repo, got %+v", *repo.inserted[0].ReviewCardID)
	}
}

// Important 4b: a reviewCardId that isn't even UUID-shaped must be rejected
// as a 400 client error before it ever reaches GetCardForUser — not left to
// fail deep inside Postgres as a 22P02 and surface as an opaque 500 (which,
// worse, would happen AFTER Assess already ran and scored the attempt).
func TestReviewCardMalformedFormatIs400(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]any{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   testWavBase64(16000),
		"reviewCardId":  "not-a-uuid-at-all",
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("a malformed reviewCardId must be 400, not a 500 from a downstream UUID-parse failure, got %d: %s", w.Code, w.Body.String())
	}
	if len(repo.inserted) != 0 {
		t.Fatalf("a rejected malformed reviewCardId must not still persist an attempt, got %+v", repo.inserted)
	}
}

// Important 1: a storage failure that happens AFTER Assess already scored the
// attempt (Azure already paid for, I4) must not become a failure response —
// the learner already spoke; they must still see their score. attemptId/
// attemptNo come back empty/zero (nothing was actually stored).
func TestPronunciationPersistFailureStillReturnsScore(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.insertErr = errors.New("db: connection reset")
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]string{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   testWavBase64(16000),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("a storage failure after scoring must still return 200 with the score, got %d: %s", w.Code, w.Body.String())
	}
	var got map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if got["recognized"] != "I'm giving you acetaminophen" {
		t.Fatalf("the real scored result must still be returned, got %+v", got)
	}
	if got["attemptId"] != "" {
		t.Fatalf("no row was written, attemptId must be empty, got %+v", got["attemptId"])
	}
	if n, ok := got["attemptNo"].(float64); !ok || n != 0 {
		t.Fatalf("no row was written, attemptNo must be 0, got %+v", got["attemptNo"])
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

	if w.Code != http.StatusOK {
		t.Fatalf("Azure unset must still return 200 (feature-disabled signal, not an error, and NOT 503), got %d", w.Code)
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

// business-rules §5 "참조 생성(TTS→assess) 실패" path 1/3: ErrTTSNotConfigured.
// Every failure mode is treated alike — GET /speech/reference must still
// answer 200 (with the reference omitted) rather than failing the
// practice-screen request outright.
func TestReferenceReturns200WhenTTSNotConfigured(t *testing.T) {
	repo := newFakeSpeechRepo()
	synth := &fakeSynth{configured: false}
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, synth)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.reference(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("TTS not configured must not fail the request, got %d: %s", w.Code, w.Body.String())
	}
}

// business-rules §5 "참조 생성(TTS→assess) 실패" path 2/3: the cache read itself
// fails (a real DB error, not "no row yet").
func TestReferenceReturns200WhenDBReadFails(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.getRefErr = errors.New("db: connection reset")
	synth := &fakeSynth{configured: true, wav: testWav(8000)}
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, synth)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.reference(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("a DB read failure while deriving the reference must still return 200, got %d: %s", w.Code, w.Body.String())
	}
}

// business-rules §5 "참조 생성(TTS→assess) 실패" path 3/3: synthesis itself fails
// (e.g. Azure TTS 5xx) even though the synthesizer is configured.
func TestReferenceReturns200WhenSynthesizeFails(t *testing.T) {
	repo := newFakeSpeechRepo()
	synth := &fakeSynth{configured: true, err: errors.New("azure tts: 503")}
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, synth)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.reference(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("a TTS synthesis failure must still return 200, got %d: %s", w.Code, w.Body.String())
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
		"audioBase64":   testWavBase64(16000),
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

// ── phonemeTips (Task 11) ────────────────────────────────────────────────
// Closes task-11-brief.md item ①: content/phonemetips had zero importers, so
// the result screen's correction points (SoT L197-210) were permanently
// empty. These assert POST /pronunciation now carries the Korean coaching
// inline, deduplicated by phoneme (business-rules R5: skip anything with no
// tip, never fabricate one).

func resultWithPhonemes(phonemesByWord ...[]string) *ports.PronunciationResult {
	words := make([]ports.WordScore, len(phonemesByWord))
	for i, phs := range phonemesByWord {
		ps := make([]ports.PhonemeResult, len(phs))
		for j, p := range phs {
			ps[j] = ports.PhonemeResult{Phoneme: p, Accuracy: 50}
		}
		words[i] = ports.WordScore{Word: "w", Phonemes: ps}
	}
	return &ports.PronunciationResult{Recognized: "test", Words: words}
}

// The wire format must be camelCase (ipa/message), matching every other
// field this handler already emits — a PascalCase leak here would silently
// render nothing on mobile (see maxReferenceTextLen's sibling tests' own
// rationale for asserting via map[string]any, not back into a Go struct).
func TestPronunciationResponseIncludesPhonemeTips(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: sampleAssessResult()}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]string{
		"referenceText": "give the patient acetaminophen",
		"audioBase64":   testWavBase64(16000),
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
	tips, ok := got["phonemeTips"].(map[string]any)
	if !ok {
		t.Fatalf("expected a phonemeTips object in the response, got %+v", got)
	}
	// sampleAssessResult's one phoneme is "s", which has a tip in content/phonemetips.
	tip, ok := tips["s"].(map[string]any)
	if !ok {
		t.Fatalf(`expected phonemeTips["s"], got %+v`, tips)
	}
	for _, key := range []string{"ipa", "message"} {
		if _, ok := tip[key]; !ok {
			t.Errorf("expected camelCase key %q on phonemeTips[\"s\"], got %+v", key, tip)
		}
	}
	for _, wrongKey := range []string{"IPA", "Message", "Detail", "Example"} {
		if _, ok := tip[wrongKey]; ok {
			t.Errorf("unexpected key %q leaked onto the wire, got %+v", wrongKey, tip)
		}
	}
}

// A phoneme appearing multiple times across the sentence (acetaminophen alone
// has three schwas) must produce exactly ONE entry, not one per occurrence —
// the brief's own call-out ("중복을 줄이는 방법도 생각하라").
func TestPronunciationResponsePhonemeTipsDeduplicatesRepeatedPhoneme(t *testing.T) {
	repo := newFakeSpeechRepo()
	result := resultWithPhonemes([]string{"s", "s"}, []string{"s", "z"})
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: result}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]string{
		"referenceText": "test sentence",
		"audioBase64":   testWavBase64(16000),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	var got map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	tips, ok := got["phonemeTips"].(map[string]any)
	if !ok {
		t.Fatalf("expected a phonemeTips object, got %+v", got)
	}
	if len(tips) != 2 {
		t.Fatalf("expected exactly 2 deduplicated entries (s, z), got %d: %+v", len(tips), tips)
	}
	if _, ok := tips["s"]; !ok {
		t.Errorf("expected a single deduplicated \"s\" entry, got %+v", tips)
	}
	if _, ok := tips["z"]; !ok {
		t.Errorf("expected a \"z\" entry, got %+v", tips)
	}
}

// business-rules R5: a phoneme with no Korean tip must be skipped entirely,
// never rendered as an empty/fabricated entry.
func TestPronunciationResponseOmitsUnknownPhoneme(t *testing.T) {
	repo := newFakeSpeechRepo()
	result := resultWithPhonemes([]string{"not-a-real-phoneme"})
	svc, pronSvc := newTestSpeechService(&fakePronPort{result: result}, repo, nil)
	review := &fakeReviewRepo{owned: map[string]string{}}
	ph := &pronunciationHandler{svc: pronSvc, speech: svc, review: review}

	body, _ := json.Marshal(map[string]string{
		"referenceText": "test sentence",
		"audioBase64":   testWavBase64(16000),
	})
	req := httptest.NewRequest(http.MethodPost, "/pronunciation", bytes.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.assess(w, req)

	var got map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if tips, ok := got["phonemeTips"]; ok {
		if m, ok := tips.(map[string]any); ok && len(m) != 0 {
			t.Fatalf("expected no entries for an unrecognized phoneme, got %+v", m)
		}
	}
}
