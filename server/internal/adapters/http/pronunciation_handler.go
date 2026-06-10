package http

import (
	"encoding/base64"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/platform/httpx"
)

type pronunciationHandler struct{ svc *pronunciation.Service }

// @Summary Assess pronunciation of recorded audio vs a reference phrase (Azure)
// @Tags pronunciation
// @Security Bearer
// @Param body body pronounceReq true "base64 WAV (16kHz mono PCM) + reference text"
// @Router /pronunciation [post]
func (h *pronunciationHandler) assess(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req pronounceReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.ReferenceText == "" || req.AudioBase64 == "" {
		httpx.Error(w, http.StatusBadRequest, "referenceText and audioBase64 are required")
		return
	}
	audio, err := base64.StdEncoding.DecodeString(req.AudioBase64)
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, "audioBase64 is not valid base64")
		return
	}
	res, err := h.svc.Assess(r.Context(), uid, audio, req.ReferenceText)
	if err != nil {
		httpx.Error(w, http.StatusBadGateway, "pronunciation assessment unavailable")
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

type pronounceReq struct {
	ReferenceText string `json:"referenceText"`
	AudioBase64   string `json:"audioBase64"`
}
