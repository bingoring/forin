package middleware

import (
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

// Recovery catches panics, logs the stack trace, and returns a 500 error.
func Recovery(log *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				requestID, _ := c.Get(RequestIDKey)
				log.Error("panic recovered",
					zap.Any("error", r),
					zap.Any("request_id", requestID),
					zap.String("path", c.Request.URL.Path),
					zap.ByteString("stack", debug.Stack()),
				)

				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"error": gin.H{
						"code":    "INTERNAL_ERROR",
						"message": "An unexpected error occurred",
					},
				})
			}
		}()
		c.Next()
	}
}
