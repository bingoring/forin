package http

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/ports"
)

// ── GET /speech/reference/audio.wav (Task 11) ───────────────────────────────
// Closes task-11-brief.md item ②: T4 synthesized+cached the reference WAV but
// no route ever served it, so the SoT's "🔊 원어민" / "0.5× 느리게" buttons had
// nothing to play. Shape follows quiz_audio_handler.go's own precedent
// (200/audio.wav content-type; here 404, not quiz audio's 503/500 split,
// since every failure mode collapses to one honest "nothing to serve" per
// GET /speech/reference's own established policy — business-rules §5).

// 401: same requireAuth wrapper as every other /speech/* route (locale is
// derived from the caller's profile, business-rules §2 — unlike quiz audio,
// which is public, there is no locale-free version of this call).
func TestSpeechAudioRequiresAuth(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, nil)
	sa := &speechAudioHandler{speech: svc}

	tokens := auth.NewTokenService([]byte("test-signing-key-0123456789"), "forin-test", time.Hour)
	handler := requireAuth(tokens)(http.HandlerFunc(sa.audio))

	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav?text=hello", nil)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 with no bearer token, got %d: %s", w.Code, w.Body.String())
	}
}

func TestSpeechAudioMissingTextIs400(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, nil)
	sa := &speechAudioHandler{speech: svc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sa.audio(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 with no text param, got %d: %s", w.Code, w.Body.String())
	}
}

// A cached reference (with audio already stored) must serve the WAV bytes
// verbatim, as audio/wav, without calling the synthesizer.
func TestSpeechAudioServesCachedWav(t *testing.T) {
	repo := newFakeSpeechRepo()
	wav := []byte("RIFF-fake-wav-bytes")
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:    speech.SentenceKey("hello there", "en-US"),
		ReferenceText:  "hello there",
		Locale:         "en-US",
		ReferenceAudio: wav,
	}
	synth := &fakeSynth{configured: true}
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, synth)
	sa := &speechAudioHandler{speech: svc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sa.audio(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	if ct := w.Header().Get("Content-Type"); ct != "audio/wav" {
		t.Fatalf("expected Content-Type audio/wav, got %q", ct)
	}
	if w.Body.String() != string(wav) {
		t.Fatalf("expected the exact cached bytes, got %q", w.Body.String())
	}
	if synth.synthCalls != 0 {
		t.Fatalf("a cache hit must not call Synthesize, got %d calls", synth.synthCalls)
	}
}

// No reference can be derived at all (TTS unconfigured) — the route must
// 404, never fabricate a clip.
func TestSpeechAudioUnavailableIs404(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, &fakeSynth{configured: false})
	sa := &speechAudioHandler{speech: svc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sa.audio(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404 when no reference audio can be produced, got %d: %s", w.Code, w.Body.String())
	}
}

// Review round 2, Important 1: a legacy reference row (segmentation exists,
// no audio_wav — predates Task 11) must be backfilled and served as 200, not
// 404 forever — domain/speech.ReferenceAudio now re-synthesizes just the
// audio against the row's own stored locale and persists it.
func TestSpeechAudioBackfillsLegacyRowAndServes200(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:   speech.SentenceKey("hello there", "en-US"),
		ReferenceText: "hello there",
		Locale:        "en-US",
		IPA:           "/heˈloʊ ðɛr/",
	}
	wav := []byte("backfilled-wav-bytes")
	synth := &fakeSynth{configured: true, wav: wav}
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, synth)
	sa := &speechAudioHandler{speech: svc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sa.audio(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200 for a legacy row that gets backfilled, got %d: %s", w.Code, w.Body.String())
	}
	if w.Body.String() != string(wav) {
		t.Fatalf("expected the freshly backfilled bytes, got %q", w.Body.String())
	}
	if len(repo.updatedAudio) != 1 {
		t.Fatalf("expected exactly one UpdateReferenceAudio call, got %d", len(repo.updatedAudio))
	}
}

// Review round 2, Important 4: this route had no length cap on `text` either
// — same rationale as GET /speech/reference's own new guard.
func TestSpeechAudioTextTooLongIs400(t *testing.T) {
	repo := newFakeSpeechRepo()
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, nil)
	sa := &speechAudioHandler{speech: svc}

	longText := strings.Repeat("a", 301)
	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav?text="+longText, nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sa.audio(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for a 301-char text, got %d: %s", w.Code, w.Body.String())
	}
}

// Review round 2, Important 3: this response depends on the CALLER's locale
// (no locale in the URL, no Vary header), so it must never be cached as
// `public` — a shared cache/proxy could serve user A's clip to user B on a
// locale mismatch. Quiz audio is `public` correctly (public + en-US-fixed);
// this route is neither.
func TestSpeechAudioCacheControlIsPrivate(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:    speech.SentenceKey("hello there", "en-US"),
		ReferenceText:  "hello there",
		Locale:         "en-US",
		ReferenceAudio: []byte("wav-bytes"),
	}
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, &fakeSynth{configured: true})
	sa := &speechAudioHandler{speech: svc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sa.audio(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", w.Code, w.Body.String())
	}
	cc := w.Header().Get("Cache-Control")
	if !strings.Contains(cc, "private") {
		t.Fatalf("expected a `private` Cache-Control for this locale-dependent response, got %q", cc)
	}
	if strings.Contains(cc, "public") {
		t.Fatalf("must not be `public` — a shared cache could serve one user's locale clip to another, got %q", cc)
	}
}
