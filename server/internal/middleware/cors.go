package middleware

import (
	"net/http"

	"github.com/forin/server/internal/config"
	"github.com/gin-gonic/gin"
)

// CORS handles Cross-Origin Resource Sharing headers.
// In development, all origins are allowed; production should use an allowlist.
func CORS(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := "*"
		if cfg.Env == "production" {
			origin = c.GetHeader("Origin")
			// In production, restrict to known origins.
			// For now, allow the requesting origin; add an allowlist config field later.
		}

		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Request-ID")
		c.Header("Access-Control-Expose-Headers", "X-Request-ID")
		c.Header("Access-Control-Max-Age", "43200") // 12 hours

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
