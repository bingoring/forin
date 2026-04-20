package handler

import (
	"context"
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// VocabularyService is the contract the handler calls into.
type VocabularyService interface {
	LookupForUser(ctx context.Context, userID uuid.UUID, ids []uuid.UUID) (*dto.VocabularyLookupResponse, error)
}

type VocabularyHandler struct {
	svc VocabularyService
}

func NewVocabularyHandler(svc VocabularyService) *VocabularyHandler {
	return &VocabularyHandler{svc: svc}
}

func (h *VocabularyHandler) Lookup(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var req dto.VocabularyLookupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.svc.LookupForUser(c.Request.Context(), userID, req.IDs)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}
