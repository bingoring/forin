package http

import (
	"net/http"
	"net/http/httptest"
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

// A legacy reference row (segmentation exists, no audio_wav — predates Task
// 11) must also 404, not synthesize a mismatched clip out of band — the same
// "does not retroactively backfill" contract as domain/speech.ReferenceAudio.
func TestSpeechAudioLegacyRowWithNoAudioIs404(t *testing.T) {
	repo := newFakeSpeechRepo()
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:   speech.SentenceKey("hello there", "en-US"),
		ReferenceText: "hello there",
		Locale:        "en-US",
		IPA:           "/heˈloʊ ðɛr/",
	}
	synth := &fakeSynth{configured: true}
	svc, _ := newTestSpeechService(&fakePronPort{}, repo, synth)
	sa := &speechAudioHandler{speech: svc}

	req := httptest.NewRequest(http.MethodGet, "/speech/reference/audio.wav?text=hello+there", nil)
	req = withUser(req, "user-a")
	w := httptest.NewRecorder()
	sa.audio(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for a legacy row with no stored audio, got %d: %s", w.Code, w.Body.String())
	}
}
