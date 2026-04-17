package handler

import (
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService UserService
}

func NewUserHandler(svc UserService) *UserHandler {
	return &UserHandler{userService: svc}
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.userService.GetProfile(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var req dto.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.userService.UpdateProfile(c.Request.Context(), userID, req)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}
