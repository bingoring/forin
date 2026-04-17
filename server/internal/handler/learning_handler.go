package handler

import (
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type LearningHandler struct {
	learningService LearningService
}

func NewLearningHandler(svc LearningService) *LearningHandler {
	return &LearningHandler{learningService: svc}
}

func (h *LearningHandler) StartStage(c *gin.Context) {
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

	resp, err := h.learningService.StartStage(c.Request.Context(), userID, stageID)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusCreated, resp)
}

func (h *LearningHandler) SubmitExercise(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	attemptID, err := uuid.Parse(c.Param("attemptId"))
	if err != nil {
		HandleBindError(c, err)
		return
	}

	exerciseID, err := uuid.Parse(c.Param("exerciseId"))
	if err != nil {
		HandleBindError(c, err)
		return
	}

	var req dto.SubmitExerciseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.learningService.SubmitExercise(c.Request.Context(), userID, attemptID, exerciseID, req)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}

func (h *LearningHandler) CompleteAttempt(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	attemptID, err := uuid.Parse(c.Param("attemptId"))
	if err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.learningService.CompleteAttempt(c.Request.Context(), userID, attemptID)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}

func (h *LearningHandler) GetHistory(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var query dto.AttemptHistoryQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.learningService.GetAttemptHistory(c.Request.Context(), userID, query)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}
