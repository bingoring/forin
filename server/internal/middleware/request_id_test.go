package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestRequestID_SetsHeader(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	r.ServeHTTP(w, req)

	id := w.Header().Get("X-Request-ID")
	assert.NotEmpty(t, id)
	assert.Len(t, id, 36) // UUID format
}

func TestRequestID_SetsContext(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())

	var ctxValue interface{}
	r.GET("/", func(c *gin.Context) {
		ctxValue, _ = c.Get(RequestIDKey)
		c.Status(http.StatusOK)
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	r.ServeHTTP(w, req)

	assert.NotNil(t, ctxValue)
	assert.IsType(t, "", ctxValue)
}

func TestRequestID_UniquePerRequest(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w1 := httptest.NewRecorder()
	r.ServeHTTP(w1, httptest.NewRequest("GET", "/", nil))

	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, httptest.NewRequest("GET", "/", nil))

	assert.NotEqual(t, w1.Header().Get("X-Request-ID"), w2.Header().Get("X-Request-ID"))
}
