package http

import (
	"encoding/base64"
	"errors"
	"net/http"

	"github.com/bingoring/forin/server/internal/adapters/azurespeech"
	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/speech"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// maxReferenceTextLen is business-rules §2's validation cap on referenceText.
const maxReferenceTextLen = 300

type pronunciationHandler struct {
	svc *pronunciation.Service
	// speech records the attempt (Task 5): scoring stays behind svc.Assess
	// (used by /stt below and internally by speech.Record), persistence is
	// new here.
	speech *speech.Service
	// review is used only to check reviewCardId ownership (business-rules §2)
	// — this handler does not otherwise read/write review cards.
	review ports.ReviewRepo
}

// @Summary Assess pronunciation of recorded audio vs a reference phrase (Azure), and persist the attempt
// @Tags pronunciation
// @Security Bearer
// @Param body body pronounceReq true "base64 WAV (16kHz mono PCM) + reference text + optional origin/scenarioId/reviewCardId"
// @Success 200 {object} pronounceResp
// @Router /pronunciation [post]
func (h *pronunciationHandler) assess(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req pronounceReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.ReferenceText == "" || req.AudioBase64 == "" {
		httpx.Error(w, http.StatusBadRequest, "referenceText and audioBase64 are required")
		return
	}
	if len(req.ReferenceText) > maxReferenceTextLen {
		httpx.Error(w, http.StatusBadRequest, "invalid_reference_text")
		return
	}
	audio, err := base64.StdEncoding.DecodeString(req.AudioBase64)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "audioBase64 is not valid base64")
		return
	}

	// business-rules §2: reviewCardId, if given, must belong to the caller.
	// GetCardForUser already filters by (userID, cardID), so "someone else's
	// card" and "no such card" both come back nil — either way, this caller
	// may not attach an attempt to it.
	if req.ReviewCardID != nil && *req.ReviewCardID != "" {
		card, err := h.review.GetCardForUser(r.Context(), uid, *req.ReviewCardID)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "could not verify review card")
			return
		}
		if card == nil {
			httpx.Error(w, http.StatusForbidden, "reviewCardId does not belong to you")
			return
		}
	}

	// Existing mobile clients never send origin at all; defaulting it here
	// (rather than leaving it to domain/speech's unknown-origin fallback)
	// avoids a "downgraded to freeform" warning log on every single legacy
	// call — the fallback in domain/speech.Record still guards truly unknown
	// values from any client.
	origin := req.Origin
	if origin == "" {
		origin = "freeform"
	}

	rec, err := h.speech.Record(r.Context(), uid, audio, req.ReferenceText, speech.RecordOptions{
		ScenarioID:   req.ScenarioID,
		ReviewCardID: req.ReviewCardID,
		Origin:       origin,
	})
	if err != nil {
		if errors.Is(err, azurespeech.ErrNoSpeech) {
			httpx.Error(w, http.StatusUnprocessableEntity, "no_speech_detected")
			return
		}
		httpx.Error(w, http.StatusBadGateway, "pronunciation assessment unavailable")
		return
	}

	httpx.JSON(w, http.StatusOK, pronounceResp{
		PronunciationResult: rec.Result,
		AttemptID:           rec.ID,
		AttemptNo:           rec.AttemptNo,
	})
}

type pronounceReq struct {
	ReferenceText string `json:"referenceText"`
	AudioBase64   string `json:"audioBase64"`
	// Origin/ScenarioID/ReviewCardID are all optional and new in Task 5 —
	// existing clients that omit them get origin="freeform", no scenario,
	// no linked card (business-rules §2, domain-entities §4).
	Origin       string  `json:"origin,omitempty"`
	ScenarioID   string  `json:"scenarioId,omitempty"`
	ReviewCardID *string `json:"reviewCardId,omitempty"`
}

// pronounceResp embeds every field POST /pronunciation returned before Task 5
// (via the embedded *ports.PronunciationResult, whose fields promote to the
// top level in JSON) and adds the two new bookkeeping fields. Existing mobile
// clients that only read the old fields are unaffected.
type pronounceResp struct {
	*ports.PronunciationResult
	AttemptID string `json:"attemptId"`
	AttemptNo int    `json:"attemptNo"`
}

// @Summary Transcribe recorded audio to text (dictation, Azure STT)
// @Tags pronunciation
// @Security Bearer
// @Param body body sttReq true "base64 WAV (16kHz mono PCM)"
// @Router /stt [post]
func (h *pronunciationHandler) transcribe(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req sttReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.AudioBase64 == "" {
		httpx.Error(w, http.StatusBadRequest, "audioBase64 is required")
		return
	}
	audio, err := base64.StdEncoding.DecodeString(req.AudioBase64)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "audioBase64 is not valid base64")
		return
	}
	text, err := h.svc.Transcribe(r.Context(), uid, audio)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "speech-to-text unavailable")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"text": text})
}

type sttReq struct {
	AudioBase64 string `json:"audioBase64"`
}
