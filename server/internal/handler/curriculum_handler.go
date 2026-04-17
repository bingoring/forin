package handler

import (
	"net/http"

	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CurriculumHandler struct {
	curriculumService CurriculumService
}

func NewCurriculumHandler(svc CurriculumService) *CurriculumHandler {
	return &CurriculumHandler{curriculumService: svc}
}

func (h *CurriculumHandler) GetCurriculum(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.curriculumService.GetCurriculum(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}

func (h *CurriculumHandler) GetStageDetail(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	stageID, err := uuid.Parse(c.Param("stageId"))
	if err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.curriculumService.GetStageDetail(c.Request.Context(), userID, stageID)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}
