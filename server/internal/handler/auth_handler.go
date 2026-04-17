package handler

import (
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService AuthService
}

func NewAuthHandler(authService AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.authService.Register(c.Request.Context(), req)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusCreated, resp)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.authService.Login(c.Request.Context(), req)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req dto.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.authService.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		Error(c, err)
		return
	}

	JSON(c, http.StatusOK, resp)
}

func (h *AuthHandler) Logout(c *gin.Context) {
	JSON(c, http.StatusOK, gin.H{"message": "Successfully logged out"})
}
