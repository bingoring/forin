package handler

import (
	"errors"
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
)

type OnboardingHandler struct {
	onboardingService OnboardingService
}

func NewOnboardingHandler(svc OnboardingService) *OnboardingHandler {
	return &OnboardingHandler{onboardingService: svc}
}

func (h *OnboardingHandler) GetProfessions(c *gin.Context) {
	resp, err := h.onboardingService.GetProfessions(c.Request.Context())
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *OnboardingHandler) GetCountries(c *gin.Context) {
	slug := c.Query("profession_slug")
	if slug == "" {
		HandleBindError(c, errors.New("profession_slug is required"))
		return
	}

	resp, err := h.onboardingService.GetCountries(c.Request.Context(), slug)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *OnboardingHandler) SubmitAssessment(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var req dto.AssessmentSubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.onboardingService.SubmitAssessment(c.Request.Context(), userID, req)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}
