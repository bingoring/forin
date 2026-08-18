package http

import (
	"bytes"
	"net/http"
	"time"

	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/platform/httpx"
)

// speechAudioHandler serves the synthesized reference audio for a sentence —
// the exact TTS render domain/speech.Reference already produces (and, since
// Task 11, persists) when it derives that sentence's canonical IPA/syllable
// breakdown. Task 4 built and cached that clip and said outright that it
// "gets reused in native playback"; nothing before this task ever served its
// bytes (task-11-brief.md item ②), so the SoT's "🔊 원어민" / "0.5× 느리게"
// buttons had nothing to play.
//
// Shape follows quiz_audio_handler.go's precedent: same Content-Type, same
// Cache-Control, same http.ServeContent range-support rationale (iOS
// AVPlayer needs Range/206 to load a streamed clip). The one structural
// difference is the cache key: quiz audio is keyed by a fixed quizID
// (bounded, content-authored set, and public — no per-user variation), while
// reference audio is keyed by (sentenceText, the CALLER's locale) exactly
// like GET /speech/reference — so this route requires auth and resolves
// locale the same way (business-rules §2: "locale는 서버가 프로필에서 파생한다").
//
// "0.5× 느리게" is deliberately NOT a second synthesis (SSML prosody rate):
// that would double the TTS calls this route exists to avoid paying twice
// for. The mobile client already has a precedent for slowed playback without
// re-synthesizing — ListenQuiz.tsx's 0.7×/1.0× buttons via expo-audio's
// player.setPlaybackRate — and the pronunciation route reuses that exact
// mechanism against this one clip (task-11-report.md judgment call 3).
type speechAudioHandler struct {
	speech *speech.Service
}

// @Summary Synthesized reference audio for a sentence (WAV) — the same TTS render GET /speech/reference derives its IPA from
// @Tags pronunciation
// @Security Bearer
// @Param text query string true "sentence text — same text passed to GET /speech/reference"
// @Router /speech/reference/audio.wav [get]
func (h *speechAudioHandler) audio(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	text := r.URL.Query().Get("text")
	if text == "" {
		httpx.Error(w, http.StatusBadRequest, "text is required")
		return
	}

	wav, err := h.speech.ReferenceAudio(r.Context(), uid, text)
	if err != nil || len(wav) == 0 {
		// Every failure mode collapses to one honest "nothing to serve" —
		// TTS unconfigured, unsupported locale, a Synthesize/Assess error, or
		// a legacy speech_references row that predates audio_wav (see
		// domain/speech.ReferenceAudio's doc: it does not retroactively
		// backfill those). GET /speech/reference answers 200+{} for the same
		// set of causes because it always has a JSON body to omit fields
		// from; this route has no body to degrade, so 404 is the equivalent
		// "not available" signal — the mobile client already treats a
		// missing/failed reference as "leave the playback button disabled"
		// (business-rules §5).
		httpx.Error(w, http.StatusNotFound, "reference audio unavailable")
		return
	}
	w.Header().Set("Content-Type", "audio/wav")
	// Permanent, sentence-key-global cache (business-rules R9) — identical
	// rationale to quiz_audio_handler.go's own header: this exact byte
	// sequence never changes for this sentence+locale.
	w.Header().Set("Cache-Control", "public, max-age=86400")
	http.ServeContent(w, r, "reference.wav", time.Time{}, bytes.NewReader(wav))
}
