package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/forin/server/internal/testutil"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// --- UUID Parsing Edge Cases ---

func withFakeAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("user_id", uuid.New())
		c.Next()
	}
}

func TestLearningHandler_InvalidStageID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(withFakeAuth())

	h := &LearningHandler{learningService: nil}
	r.POST("/learning/stages/:stageId/start", h.StartStage)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/learning/stages/not-a-uuid/start", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

func TestLearningHandler_InvalidAttemptID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(withFakeAuth())

	h := &LearningHandler{learningService: nil}
	r.POST("/learning/attempts/:attemptId/complete", h.CompleteAttempt)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/learning/attempts/invalid/complete", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

func TestCurriculumHandler_InvalidStageID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(withFakeAuth())

	h := &CurriculumHandler{curriculumService: nil}
	r.GET("/curriculum/stages/:stageId", h.GetStageDetail)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/curriculum/stages/bad-uuid", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

// --- Empty Body Edge Cases ---

func TestRegisterHandler_EmptyBody(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := setupRouter(NewAuthHandler(&testutil.MockAuthService{}))

	w := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/auth/register", bytes.NewBufferString(""))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

func TestLoginHandler_EmptyPassword(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := setupRouter(NewAuthHandler(&testutil.MockAuthService{}))

	body, _ := json.Marshal(map[string]string{"email": "test@example.com"})
	w := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/auth/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

// --- Auth middleware missing ---

func TestUserHandler_NoAuth(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	h := &UserHandler{userService: nil}
	r.GET("/users/me", h.GetProfile) // no auth middleware

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest("GET", "/users/me", nil))

	// GetUserID returns false → 401
	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestGamificationHandler_NoAuth(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	h := &GamificationHandler{gamificationService: nil}
	r.GET("/gamification/inventory", h.GetInventory)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest("GET", "/gamification/inventory", nil))

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

// --- Gift Box UUID parsing ---

func TestGamificationHandler_InvalidBoxID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(func(c *gin.Context) {
		c.Set("user_id", uuid.New())
		c.Next()
	})

	h := &GamificationHandler{gamificationService: nil}
	r.POST("/gamification/gift-boxes/:boxId/open", h.OpenGiftBox)

	w := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/gamification/gift-boxes/not-uuid/open", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

