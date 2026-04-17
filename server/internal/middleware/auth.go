package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// TokenValidator validates a JWT access token and returns the user ID.
type TokenValidator interface {
	ValidateAccessToken(tokenStr string) (uuid.UUID, error)
}

// Auth extracts and validates the Bearer token from the Authorization header.
func Auth(validator TokenValidator) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			abortUnauthorized(c, "Authorization header is required")
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			abortUnauthorized(c, "Authorization header must be Bearer {token}")
			return
		}

		userID, err := validator.ValidateAccessToken(parts[1])
		if err != nil {
			abortUnauthorized(c, "Invalid or expired token")
			return
		}

		c.Set("user_id", userID)
		c.Next()
	}
}

// GetUserID extracts the authenticated user ID from the Gin context.
func GetUserID(c *gin.Context) (uuid.UUID, bool) {
	val, exists := c.Get("user_id")
	if !exists {
		return uuid.Nil, false
	}
	uid, ok := val.(uuid.UUID)
	return uid, ok
}

func abortUnauthorized(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
		"success": false,
		"error": gin.H{
			"code":    "UNAUTHORIZED",
			"message": message,
		},
	})
}
