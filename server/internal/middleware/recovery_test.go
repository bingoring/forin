package middleware

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
)

func TestRecovery_NoPanic(t *testing.T) {
	log := zap.NewNop()
	r := gin.New()
	r.Use(Recovery(log))
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest("GET", "/", nil))

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestRecovery_CatchesPanic(t *testing.T) {
	log := zap.NewNop()
	r := gin.New()
	r.Use(Recovery(log))
	r.GET("/", func(c *gin.Context) {
		panic("something went wrong")
	})

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest("GET", "/", nil))

	assert.Equal(t, http.StatusInternalServerError, w.Code)

	var resp map[string]interface{}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	assert.False(t, resp["success"].(bool))
	errDetail := resp["error"].(map[string]interface{})
	assert.Equal(t, "INTERNAL_ERROR", errDetail["code"])
}
