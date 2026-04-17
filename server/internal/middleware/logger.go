package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// Logger logs structured information about each HTTP request.
func Logger(log *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()

		fields := []zap.Field{
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", status),
			zap.Duration("latency", latency),
			zap.String("client_ip", c.ClientIP()),
			zap.String("user_agent", c.Request.UserAgent()),
		}

		if id, exists := c.Get(RequestIDKey); exists {
			fields = append(fields, zap.Any("request_id", id))
		}

		switch {
		case status >= 500:
			log.Error("request completed", fields...)
		case status >= 400:
			log.Warn("request completed", fields...)
		default:
			log.Info("request completed", fields...)
		}
	}
}
