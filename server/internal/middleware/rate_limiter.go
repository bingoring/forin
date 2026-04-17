package middleware

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/forin/server/internal/cache"
	"github.com/gin-gonic/gin"
)

// KeyFunc extracts the rate-limit key from the request context.
type KeyFunc func(*gin.Context) string

// KeyByIP returns the client IP as the rate-limit key.
func KeyByIP(c *gin.Context) string {
	return c.ClientIP()
}

// KeyByUserID returns the authenticated user ID as the rate-limit key.
func KeyByUserID(c *gin.Context) string {
	if uid, exists := c.Get("user_id"); exists {
		return fmt.Sprintf("%v", uid)
	}
	return c.ClientIP()
}

// RateLimiter returns middleware that enforces a sliding-window rate limit using Redis.
// limit is the max number of requests allowed within the window duration.
func RateLimiter(redis *cache.Client, limit int, window time.Duration, keyFunc KeyFunc) gin.HandlerFunc {
	return func(c *gin.Context) {
		key := fmt.Sprintf("rate:%s:%s", keyFunc(c), c.FullPath())

		count, err := redis.Incr(c.Request.Context(), key)
		if err != nil {
			// If Redis is down, allow the request through rather than blocking.
			c.Next()
			return
		}

		// Set expiry only on the first increment (new window).
		if count == 1 {
			_ = redis.Expire(c.Request.Context(), key, window)
		}

		if count > int64(limit) {
			c.Header("Retry-After", strconv.Itoa(int(window.Seconds())))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "RATE_LIMITED",
					"message": "Too many requests. Please try again later.",
				},
			})
			return
		}

		c.Next()
	}
}
