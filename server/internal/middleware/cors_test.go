package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/forin/server/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestCORS_DevMode_AllowsAll(t *testing.T) {
	cfg := &config.Config{Env: "development"}
	r := gin.New()
	r.Use(CORS(cfg))
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, "*", w.Header().Get("Access-Control-Allow-Origin"))
	assert.Contains(t, w.Header().Get("Access-Control-Allow-Methods"), "GET")
	assert.Contains(t, w.Header().Get("Access-Control-Allow-Headers"), "Authorization")
}

func TestCORS_PreflightOptions(t *testing.T) {
	cfg := &config.Config{Env: "development"}
	r := gin.New()
	r.Use(CORS(cfg))
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest("OPTIONS", "/", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNoContent, w.Code)
	assert.NotEmpty(t, w.Header().Get("Access-Control-Max-Age"))
}

func TestCORS_ProductionMode_ReflectsOrigin(t *testing.T) {
	cfg := &config.Config{Env: "production"}
	r := gin.New()
	r.Use(CORS(cfg))
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Origin", "https://app.forin.app")
	r.ServeHTTP(w, req)

	assert.Equal(t, "https://app.forin.app", w.Header().Get("Access-Control-Allow-Origin"))
}
