package handler

import (
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
)

type NotificationHandler struct {
	notifService NotificationService
}

func NewNotificationHandler(svc NotificationService) *NotificationHandler {
	return &NotificationHandler{notifService: svc}
}

func (h *NotificationHandler) GetPreferences(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.notifService.GetPreferences(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *NotificationHandler) UpdatePreferences(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var req dto.UpdateNotificationPrefsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.notifService.UpdatePreferences(c.Request.Context(), userID, req)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *NotificationHandler) GetWeeklyStats(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.notifService.GetWeeklyStats(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}
