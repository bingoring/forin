package http

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

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
	pron := &fakePronPort{result: sampleAssessResult(), transcript: "I'm giving you acetaminophen"}
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
	// Free speech has no script, so the transcript IS the reference.
	if len(pron.assessedRefs) != 1 || pron.assessedRefs[0] != "I'm giving you acetaminophen" {
		t.Errorf("scored against %q, want the transcript", pron.assessedRefs)
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
		weak  bool
	}{
		{"", true}, {"?sort=weak", true}, {"?sort=recent", false}, {"?sort=banana", true},
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
		if repo.spokenCalls[0].WeakestFirst != tc.weak {
			t.Errorf("%q -> weakestFirst=%v, want %v", tc.query, repo.spokenCalls[0].WeakestFirst, tc.weak)
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
