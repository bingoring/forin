package middleware

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

type mockValidator struct {
	fn func(token string) (uuid.UUID, error)
}

func (m *mockValidator) ValidateAccessToken(token string) (uuid.UUID, error) {
	return m.fn(token)
}

func TestAuth_ValidToken(t *testing.T) {
	expectedID := uuid.New()
	validator := &mockValidator{
		fn: func(token string) (uuid.UUID, error) {
			return expectedID, nil
		},
	}

	r := gin.New()
	r.Use(Auth(validator))

	var capturedID uuid.UUID
	r.GET("/", func(c *gin.Context) {
		capturedID, _ = GetUserID(c)
		c.Status(http.StatusOK)
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", "Bearer valid-token")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, expectedID, capturedID)
}

func TestAuth_MissingHeader(t *testing.T) {
	validator := &mockValidator{}
	r := gin.New()
	r.Use(Auth(validator))
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAuth_InvalidFormat(t *testing.T) {
	validator := &mockValidator{}
	r := gin.New()
	r.Use(Auth(validator))
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", "Basic abc123")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestAuth_InvalidToken(t *testing.T) {
	validator := &mockValidator{
		fn: func(token string) (uuid.UUID, error) {
			return uuid.Nil, errors.New("invalid")
		},
	}

	r := gin.New()
	r.Use(Auth(validator))
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", "Bearer bad-token")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestGetUserID_NotSet(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	id, ok := GetUserID(c)
	assert.False(t, ok)
	assert.Equal(t, uuid.Nil, id)
}
