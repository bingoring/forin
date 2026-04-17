package handler

import (
	"net/http"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type GamificationHandler struct {
	gamificationService GamificationService
}

func NewGamificationHandler(svc GamificationService) *GamificationHandler {
	return &GamificationHandler{gamificationService: svc}
}

func (h *GamificationHandler) GetInventory(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.gamificationService.GetInventory(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *GamificationHandler) GetPendingGiftBoxes(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.gamificationService.GetPendingGiftBoxes(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *GamificationHandler) OpenGiftBox(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	boxID, err := uuid.Parse(c.Param("boxId"))
	if err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.gamificationService.OpenGiftBox(c.Request.Context(), userID, boxID)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *GamificationHandler) GetShop(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.gamificationService.GetShop(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *GamificationHandler) PurchaseItem(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var req dto.PurchaseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.gamificationService.PurchaseItem(c.Request.Context(), userID, req)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *GamificationHandler) GetAchievements(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	resp, err := h.gamificationService.GetAchievements(c.Request.Context(), userID)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}

func (h *GamificationHandler) EquipCatItem(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		Error(c, errUnauthorized)
		return
	}

	var req dto.EquipCatItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		HandleBindError(c, err)
		return
	}

	resp, err := h.gamificationService.EquipCatItem(c.Request.Context(), userID, req)
	if err != nil {
		Error(c, err)
		return
	}
	JSON(c, http.StatusOK, resp)
}
