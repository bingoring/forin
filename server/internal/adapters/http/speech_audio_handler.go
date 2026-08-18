package http

import (
	"bytes"
	"log/slog"
	"net/http"
	"time"
	"unicode/utf8"

	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/platform/httpx"
)

// speechAudioHandler serves the synthesized reference audio for a sentence —
// the exact TTS render domain/speech.Reference already produces (and, since
// Task 11, persists) when it derives that sentence's canonical IPA/syllable
// breakdown, backfilling it for any row that predates that storage (see
// domain/speech.ReferenceAudio's doc — review round 2, Important 1). Task 4
// built and cached that clip and said outright that it "gets reused in
// native playback"; nothing before this task ever served its bytes
// (task-11-brief.md item ②), so the SoT's "🔊 원어민" / "0.5× 느리게" buttons
// had nothing to play.
//
// Shape follows quiz_audio_handler.go's precedent (Content-Type,
// http.ServeContent range-support for iOS AVPlayer), with two deliberate
// differences (review round 2):
//   - Cache-Control is `private`, not `public` — this response depends on
//     the CALLER's locale (business-rules §2: "locale는 서버가 프로필에서
//     파생한다"), and the URL carries no locale/Vary, so a shared cache/proxy
//     serving `public` could hand user A's clip to user B on a locale
//     mismatch. Quiz audio is `public` correctly because it is public and
//     locale-fixed (en-US only); this route is neither.
//   - `text` is capped at maxReferenceTextLen runes (same cap POST
//     /pronunciation already enforces) — otherwise an authenticated caller
//     could trigger an unbounded number of paid Synthesize+Assess calls
//     against arbitrarily large text, each landing a new, never-invalidated
//     speech_references row (R9).
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
	// business-rules §2's cap (same as POST /pronunciation's referenceText) —
	// review round 2, Important 4: without it, this route's Synthesize+Assess
	// cost is unbounded.
	if utf8.RuneCountInString(text) > maxReferenceTextLen {
		httpx.Error(w, http.StatusBadRequest, "invalid_reference_text")
		return
	}

	wav, err := h.speech.ReferenceAudio(r.Context(), uid, text)
	if err != nil {
		// Logged (review round 2, minor): a DB error or Azure failure here
		// otherwise looks identical to "no reference exists" on the wire —
		// GET /speech/reference's own handler (speech_handler.go) already
		// logs this class of failure; this route was silently swallowing it.
		slog.Warn("speech: reference audio unavailable, serving 404", "err", err)
	}
	if err != nil || len(wav) == 0 {
		// Every failure mode collapses to one honest "nothing to serve" —
		// TTS unconfigured, unsupported locale, a Synthesize/Assess error, an
		// oversized clip rejected before storage, or (now backfillable, but
		// the backfill attempt itself can still fail the same ways) a legacy
		// row. GET /speech/reference answers 200+{} for the same set of
		// causes because it always has a JSON body to omit fields from; this
		// route has no body to degrade, so 404 is the equivalent "not
		// available" signal — the mobile client already treats a
		// missing/failed reference as "leave the playback button disabled"
		// (business-rules §5).
		httpx.Error(w, http.StatusNotFound, "reference audio unavailable")
		return
	}
	w.Header().Set("Content-Type", "audio/wav")
	// `private`, not `public` (review round 2, Important 3) — see the type
	// doc above for why: this response is locale-dependent per caller and
	// the URL/response carry no Vary to make a shared cache safe.
	w.Header().Set("Cache-Control", "private, max-age=86400")
	http.ServeContent(w, r, "reference.wav", time.Time{}, bytes.NewReader(wav))
}
