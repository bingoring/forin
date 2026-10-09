package http

import (
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/adapters/azurespeech"
	"github.com/bingoring/forin/server/internal/ports"
)

// sttPost drives POST /stt with an optional session, returning the decoded body.
func sttPost(t *testing.T, ph *pronunciationHandler, uid, body string) map[string]any {
	t.Helper()
	req := httptest.NewRequest(http.MethodPost, "/stt", strings.NewReader(body))
	req = withUser(req, uid)
	w := httptest.NewRecorder()
	ph.transcribe(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("POST /stt = %d: %s", w.Code, w.Body.String())
	}
	var out map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &out); err != nil {
		t.Fatalf("decode /stt: %v", err)
	}
	return out
}

// wavB64 is a valid clip, base64'd for the JSON body.
func wavB64() string {
	return `"` + base64.StdEncoding.EncodeToString(testWav(16000)) + `"`
}

// A dialogue utterance must leave a scored attempt behind, filed under the run,
// or the Scenario Clear review has nothing to review. Before this, POST /stt
// only transcribed and every review list was permanently empty.
func TestDictationInADialogueIsScoredAndFiledUnderTheRun(t *testing.T) {
	repo := newFakeSpeechRepo()
	pron := &fakePronPort{result: sampleAssessResult()}
	svc, pronSvc := newTestSpeechService(pron, repo, nil)
	ph := &pronunciationHandler{svc: pronSvc, speech: svc}

	out := sttPost(t, ph, "user-a", `{"audioBase64":`+wavB64()+`,"sessionId":"sess-1","scenarioId":"SCN-ER-00002"}`)

	if out["text"] != "I'm giving you acetaminophen" {
		t.Errorf("text = %v", out["text"])
	}
	if out["scored"] != true {
		t.Errorf("scored = %v, want true", out["scored"])
	}
	if len(repo.inserted) != 1 {
		t.Fatalf("inserted %d attempts, want 1", len(repo.inserted))
	}
	a := repo.inserted[0]
	if a.SessionID != "sess-1" || a.ScenarioID != "SCN-ER-00002" || a.Origin != "dialogue" {
		t.Errorf("attempt filed as session=%q scenario=%q origin=%q", a.SessionID, a.ScenarioID, a.Origin)
	}
	// Free speech has no script: ONE unscripted Azure call (empty reference)
	// both transcribes and scores, and what Azure recognized becomes the
	// attempt's reference text. No separate STT call (cross-review I3).
	if len(pron.assessedRefs) != 1 || pron.assessedRefs[0] != "" {
		t.Errorf("assess calls = %q, want exactly one unscripted (empty reference) call", pron.assessedRefs)
	}
	if pron.transcribeCalls != 0 {
		t.Errorf("made %d separate STT calls, want 0", pron.transcribeCalls)
	}
	if a.ReferenceText != "I'm giving you acetaminophen" {
		t.Errorf("stored reference text = %q, want the recognized text", a.ReferenceText)
	}
}

// Dictation outside a dialogue has no run to file under, so it must not pay for
// a second Azure call.
func TestDictationOutsideADialogueIsNotScored(t *testing.T) {
	repo := newFakeSpeechRepo()
	pron := &fakePronPort{result: sampleAssessResult(), transcript: "hello"}
	svc, pronSvc := newTestSpeechService(pron, repo, nil)
	ph := &pronunciationHandler{svc: pronSvc, speech: svc}

	out := sttPost(t, ph, "user-a", `{"audioBase64":`+wavB64()+`}`)

	if out["text"] != "hello" {
		t.Errorf("text = %v", out["text"])
	}
	if out["scored"] == true {
		t.Error("scored an utterance that belongs to no run")
	}
	if len(repo.inserted) != 0 {
		t.Errorf("inserted %d attempts for a session-less dictation", len(repo.inserted))
	}
	if len(pron.assessedRefs) != 0 {
		t.Errorf("called the scorer %d times for a session-less dictation", len(pron.assessedRefs))
	}
}

// Scoring is a side quest: if it fails, the player still gets their transcript
// and the dialogue turn still happens.
func TestDictationSurvivesAScoringFailure(t *testing.T) {
	repo := newFakeSpeechRepo()
	pron := &fakePronPort{transcript: "still transcribed", assessErr: http.ErrBodyNotAllowed}
	svc, pronSvc := newTestSpeechService(pron, repo, nil)
	ph := &pronunciationHandler{svc: pronSvc, speech: svc}

	out := sttPost(t, ph, "user-a", `{"audioBase64":`+wavB64()+`,"sessionId":"sess-1"}`)

	if out["text"] != "still transcribed" {
		t.Errorf("a scoring failure took the transcript down: %v", out)
	}
	if out["scored"] == true {
		t.Error("reported a score after the scorer failed")
	}
	if pron.transcribeCalls != 1 {
		t.Errorf("fallback STT calls = %d, want 1", pron.transcribeCalls)
	}
}

// postStt drives POST /stt and returns the raw recorder (any status).
func postStt(ph *pronunciationHandler, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPost, "/stt", strings.NewReader(body))
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	ph.transcribe(w, req)
	return w
}

// testWavRate is testWav with the header's sample rate rewritten.
func testWavRate(rate uint32, numSamples int) []byte {
	b := testWav(numSamples)
	binary.LittleEndian.PutUint32(b[24:28], rate)
	return b
}

func wavB64Of(wav []byte) string {
	return `"` + base64.StdEncoding.EncodeToString(wav) + `"`
}

// cross-review I3: /stt took any size of body and any audio format and passed
// it to Azure and into speech_attempts. It now enforces the same gates as
// POST /pronunciation: body cap, ValidateWAV.
func TestSttRejectsInvalidAudioBeforeCallingAzure(t *testing.T) {
	huge := make([]byte, 0, 1<<20+2000)
	huge = append(huge, testWav(16000)...)
	huge = append(huge, make([]byte, 1<<20+1000)...) // > 1MB (and header lies) -> invalid
	cases := map[string]string{
		"not base64":      `{"audioBase64":"@@@@","sessionId":"s"}`,
		"not a wav":       `{"audioBase64":"` + base64.StdEncoding.EncodeToString([]byte("hello world, definitely not riff")) + `","sessionId":"s"}`,
		"too long (>10s)": `{"audioBase64":` + wavB64Of(testWav(16000*11)) + `,"sessionId":"s"}`,
		"over 1MB":        `{"audioBase64":` + wavB64Of(huge) + `,"sessionId":"s"}`,
		"body over cap":   `{"audioBase64":"` + strings.Repeat("A", maxRequestBodyBytes+10) + `","sessionId":"s"}`,
		"wrong rate":      `{"audioBase64":` + wavB64Of(testWavRate(24000, 24000)) + `}`,
	}
	for name, body := range cases {
		repo := newFakeSpeechRepo()
		pron := &fakePronPort{result: sampleAssessResult(), transcript: "x"}
		svc, pronSvc := newTestSpeechService(pron, repo, nil)
		ph := &pronunciationHandler{svc: pronSvc, speech: svc}
		w := postStt(ph, body)
		if w.Code != http.StatusBadRequest {
			t.Errorf("%s: status = %d, want 400 (%s)", name, w.Code, w.Body.String())
		}
		if len(pron.assessedRefs) != 0 || pron.transcribeCalls != 0 || len(repo.inserted) != 0 {
			t.Errorf("%s: reached Azure/storage (assess=%d stt=%d rows=%d)", name, len(pron.assessedRefs), pron.transcribeCalls, len(repo.inserted))
		}
	}
}

// A recognized text past the 300-rune cap is never filed (business-rules §2),
// but the player still gets the transcript.
func TestSttSkipsScoringWhenRecognizedTextIsTooLong(t *testing.T) {
	repo := newFakeSpeechRepo()
	res := sampleAssessResult()
	res.Recognized = strings.Repeat("가", maxReferenceTextLen+1)
	pron := &fakePronPort{result: res}
	svc, pronSvc := newTestSpeechService(pron, repo, nil)
	ph := &pronunciationHandler{svc: pronSvc, speech: svc}

	out := sttPost(t, ph, "user-a", `{"audioBase64":`+wavB64()+`,"sessionId":"sess-1"}`)
	if out["text"] != res.Recognized {
		t.Errorf("transcript lost: %v", out["text"])
	}
	if out["scored"] == true || len(repo.inserted) != 0 {
		t.Errorf("filed an over-long reference (scored=%v rows=%d)", out["scored"], len(repo.inserted))
	}
}

// Silence in a dialogue: Azure says no speech. Same outward result as before:
// 200, empty text, nothing filed, no second call.
func TestSttNoSpeechInADialogueIsEmptyTextAndNoFollowUpCall(t *testing.T) {
	repo := newFakeSpeechRepo()
	pron := &fakePronPort{assessErr: azurespeech.ErrNoSpeech, transcript: "must not be used"}
	svc, pronSvc := newTestSpeechService(pron, repo, nil)
	ph := &pronunciationHandler{svc: pronSvc, speech: svc}

	out := sttPost(t, ph, "user-a", `{"audioBase64":`+wavB64()+`,"sessionId":"sess-1"}`)
	if out["text"] != "" || out["scored"] == true {
		t.Errorf("out = %v", out)
	}
	if pron.transcribeCalls != 0 || len(repo.inserted) != 0 {
		t.Errorf("stt=%d rows=%d", pron.transcribeCalls, len(repo.inserted))
	}
}

// The review reads back only the run asked for, and only the caller's own rows.
func TestSessionReviewIsScopedToTheRunAndTheUser(t *testing.T) {
	repo := newFakeSpeechRepo()
	pron := &fakePronPort{result: sampleAssessResult(), transcript: "one line"}
	svc, pronSvc := newTestSpeechService(pron, repo, nil)
	ph := &pronunciationHandler{svc: pronSvc, speech: svc}
	sttPost(t, ph, "user-a", `{"audioBase64":`+wavB64()+`,"sessionId":"sess-1"}`)

	sh := &speechHandler{svc: svc, pron: pronSvc}
	read := func(uid, session string) []any {
		req := httptest.NewRequest(http.MethodGet, "/conversation/"+session+"/speech-review", nil)
		req.SetPathValue("sessionId", session)
		req = withUser(req, uid)
		w := httptest.NewRecorder()
		sh.sessionReview(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("speech-review = %d: %s", w.Code, w.Body.String())
		}
		var out struct {
			Sentences []any   `json:"sentences"`
			Average   float64 `json:"average"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &out); err != nil {
			t.Fatalf("decode: %v", err)
		}
		return out.Sentences
	}

	if got := read("user-a", "sess-1"); len(got) != 1 {
		t.Errorf("own run returned %d sentences, want 1", len(got))
	}
	if got := read("user-a", "sess-other"); len(got) != 0 {
		t.Errorf("a different run leaked %d sentences", len(got))
	}
	if got := read("user-b", "sess-1"); len(got) != 0 {
		t.Errorf("another user's run leaked %d sentences", len(got))
	}
}

// An empty review must serialize as [] — a client mapping over it should not
// have to guard for null as well.
func TestSessionReviewSerializesEmptyAsArray(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/conversation/sess-1/speech-review", nil)
	req.SetPathValue("sessionId", "sess-1")
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.sessionReview(w, req)

	body := w.Body.String()
	if strings.Contains(body, "null") {
		t.Errorf("empty review serialized with null: %s", body)
	}
	if !strings.Contains(body, `"sentences":[]`) || !strings.Contains(body, `"weakest":[]`) {
		t.Errorf("expected empty arrays, got %s", body)
	}
}

// ?sort= selects the sort, and anything unrecognized stays on 약한 순 — an
// unknown value must not silently reorder the screen.
func TestSpokenSentencesSortSelection(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	for _, tc := range []struct {
		query string
		sort  string
	}{
		{"", "weak"}, {"?sort=weak", "weak"}, {"?sort=high", "high"},
		{"?sort=recent", "recent"}, {"?sort=banana", "weak"},
	} {
		repo.spokenCalls = nil
		req := httptest.NewRequest(http.MethodGet, "/speech/sentences"+tc.query, nil)
		req = withUser(req, "user-a")
		w := httptest.NewRecorder()
		sh.spokenSentences(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("%q = %d", tc.query, w.Code)
		}
		if len(repo.spokenCalls) != 1 {
			t.Fatalf("%q made %d repo calls", tc.query, len(repo.spokenCalls))
		}
		if repo.spokenCalls[0].Sort != tc.sort {
			t.Errorf("%q -> sort=%q, want %q", tc.query, repo.spokenCalls[0].Sort, tc.sort)
		}
	}
}

// ?q= is the 문장 검색 line. It reaches the repo as typed (minus the whitespace an
// on-screen keyboard adds), because the match is case-insensitive in SQL — folding
// case here would only make the parameter unreadable in a log.
func TestSpokenSentencesPassesTheSearchQueryThrough(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	for _, tc := range []struct{ query, want string }{
		{"", ""},
		{"?q=pain", "pain"},
		{"?q=%20%20Acetaminophen%20%20", "Acetaminophen"},
		{"?q=" + strings.Repeat("a", 200), strings.Repeat("a", 120)}, // cut, not rejected
	} {
		repo.spokenCalls = nil
		req := httptest.NewRequest(http.MethodGet, "/speech/sentences"+tc.query, nil)
		req = withUser(req, "user-a")
		w := httptest.NewRecorder()
		sh.spokenSentences(w, req)
		if w.Code != http.StatusOK {
			t.Fatalf("%q = %d", tc.query, w.Code)
		}
		if got := repo.spokenCalls[0].Q; got != tc.want {
			t.Errorf("%q reached the repo as %q, want %q", tc.query, got, tc.want)
		}
	}
}

// The summary block reports band counts verbatim from storage.
func TestSpeakSummaryReportsBands(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.bands = ports.SpeakBandCounts{Total: 128, Low: 10, Mid: 40, High: 78}
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, repo, nil)
	sh := &speechHandler{svc: svc, pron: pronSvc}

	req := httptest.NewRequest(http.MethodGet, "/speech/summary", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sh.speakSummary(w, req)

	var out struct{ Total, Low, Mid, High int }
	if err := json.Unmarshal(w.Body.Bytes(), &out); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if out.Total != 128 || out.Low != 10 || out.Mid != 40 || out.High != 78 {
		t.Errorf("bands = %+v", out)
	}
}

// countingReader reports how many bytes the handler pulled off the wire.
type countingReader struct {
	r io.Reader
	n int
}

func (c *countingReader) Read(p []byte) (int, error) {
	n, err := c.r.Read(p)
	c.n += n
	return n, err
}

// The body cap is about MEMORY, not the verdict (an oversized clip fails
// ValidateWAV anyway): the handler must stop reading at the cap instead of
// buffering a 30MB upload first.
func TestSttStopsReadingAtTheBodyCap(t *testing.T) {
	body := `{"audioBase64":"` + strings.Repeat("A", 3*maxRequestBodyBytes) + `"}`
	cr := &countingReader{r: strings.NewReader(body)}
	req := withUser(httptest.NewRequest(http.MethodPost, "/stt", cr), "user-a")
	w := httptest.NewRecorder()
	svc, pronSvc := newTestSpeechService(&fakePronPort{}, newFakeSpeechRepo(), nil)
	(&pronunciationHandler{svc: pronSvc, speech: svc}).transcribe(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want 400", w.Code)
	}
	if cr.n > maxRequestBodyBytes+64<<10 {
		t.Errorf("read %d bytes of a %d-byte body; the cap is %d", cr.n, len(body), maxRequestBodyBytes)
	}
}
