package handler

import (
	"context"
	"net/http"
	"time"

	"github.com/forin/server/internal/cache"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type HealthHandler struct {
	db    *gorm.DB
	redis *cache.Client
}

func NewHealthHandler(db *gorm.DB, redis *cache.Client) *HealthHandler {
	return &HealthHandler{db: db, redis: redis}
}

func (h *HealthHandler) Check(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 3*time.Second)
	defer cancel()

	pgStatus := "ok"
	sqlDB, err := h.db.DB()
	if err != nil {
		pgStatus = "error"
	} else if err := sqlDB.PingContext(ctx); err != nil {
		pgStatus = "error"
	}

	redisStatus := "ok"
	if _, err := h.redis.Exists(ctx, "__healthcheck__"); err != nil {
		redisStatus = "error"
	}

	status := http.StatusOK
	overall := "ok"
	if pgStatus == "error" && redisStatus == "error" {
		status = http.StatusServiceUnavailable
		overall = "degraded"
	} else if pgStatus == "error" || redisStatus == "error" {
		overall = "degraded"
	}

	JSON(c, status, gin.H{
		"status":   overall,
		"postgres": pgStatus,
		"redis":    redisStatus,
	})
}
