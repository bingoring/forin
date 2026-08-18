package http

import (
	"log/slog"
	"net/http"
	"strconv"
	"unicode/utf8"

	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// defaultAttemptsLimit mirrors business-rules R3: the practice screen's
// history strip renders the most recent 3 attempts. maxAttemptsLimit is a
// ceiling so a client can't ask for an unbounded history dump — no rule
// specifies one, so this is a defensive default, not a spec'd number.
const (
	defaultAttemptsLimit = 3
	maxAttemptsLimit     = 50
)

// speechHandler serves the read-only pronunciation-practice endpoints:
// the canonical per-sentence reference (GET /speech/reference) and a user's
// own attempt history for a sentence (GET /speech/attempts). Recording a new
// attempt stays on POST /pronunciation (pronunciation_handler.go) — that
// route already existed in production before this task.
type speechHandler struct {
	svc *speech.Service
	// pron resolves the caller's locale so this handler can derive the same
	// sentence_key Record/Reference use (business-rules §2: "locale는 서버가
	// 프로필에서 파생한다. 클라이언트가 보내지 않는다") — domain/speech.History takes an
	// already-computed sentenceKey, so this layer computes it exactly the way
	// domain/speech.Reference does internally, from the same LocaleFor call.
	pron *pronunciation.Service
}

// @Summary Canonical syllable/phoneme reference for a sentence (TTS-derived, cached globally per business-rules R9)
// @Tags pronunciation
// @Security Bearer
// @Param text query string true "sentence text to derive the reference for"
// @Success 200 {object} ports.SentenceReferenceRow
// @Router /speech/reference [get]
func (h *speechHandler) reference(w http.ResponseWriter, r *http.Request) {
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
	// review round 2, Important 4: an unauthenticated-in-spirit text length
	// cap here bounds how much Synthesize+Assess cost one caller can trigger
	// via arbitrary `text` values, each landing a new, never-invalidated
	// speech_references row (R9).
	if utf8.RuneCountInString(text) > maxReferenceTextLen {
		httpx.Error(w, http.StatusBadRequest, "invalid_reference_text")
		return
	}

	ref, err := h.svc.Reference(r.Context(), uid, text)
	if err != nil {
		// business-rules §5 "참조 생성(TTS→assess) 실패": every failure mode here —
		// a DB read error, ErrTTSNotConfigured, ErrUnsupportedLocale, or a
		// Synthesize/Assess error — is handled identically, per the Task 4
		// reviewer's call-out. Log it and answer 200 with the reference
		// omitted rather than failing the practice-screen request outright:
		// the screen just hides the IPA line and native waveform when this
		// is absent (business-logic-model §2) — recording/scoring still work.
		slog.Warn("speech: reference unavailable, practice continues without it", "err", err)
		httpx.JSON(w, http.StatusOK, map[string]any{})
		return
	}
	httpx.JSON(w, http.StatusOK, ref)
}

// @Summary Recent attempt history for a sentence, oldest first (business-rules R3: screen renders the last 3)
// @Tags pronunciation
// @Security Bearer
// @Param text query string true "sentence text — the server derives sentenceKey from text+locale (business-rules §2); clients cannot compute or send it directly"
// @Param limit query int false "max attempts to return, default 3"
// @Success 200 {array} ports.SpeechAttemptRow
// @Router /speech/attempts [get]
func (h *speechHandler) attempts(w http.ResponseWriter, r *http.Request) {
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

	limit := defaultAttemptsLimit
	if q := r.URL.Query().Get("limit"); q != "" {
		if n, err := strconv.Atoi(q); err == nil && n > 0 {
			limit = n
		}
	}
	if limit > maxAttemptsLimit {
		limit = maxAttemptsLimit
	}

	locale := h.pron.LocaleFor(r.Context(), uid)
	key := speech.SentenceKey(text, locale)

	rows, err := h.svc.History(r.Context(), uid, key, limit)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load attempt history")
		return
	}
	if rows == nil {
		rows = []ports.SpeechAttemptRow{}
	}
	httpx.JSON(w, http.StatusOK, rows)
}
