package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/testutil"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func setupRouter(h *AuthHandler) *gin.Engine {
	r := gin.New()
	auth := r.Group("/auth")
	auth.POST("/register", h.Register)
	auth.POST("/login", h.Login)
	auth.POST("/refresh", h.Refresh)
	auth.POST("/logout", h.Logout)
	return r
}

func doRequest(r *gin.Engine, method, path string, body interface{}) *httptest.ResponseRecorder {
	var buf bytes.Buffer
	if body != nil {
		json.NewEncoder(&buf).Encode(body)
	}
	req := httptest.NewRequest(method, path, &buf)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func parseResponse(t *testing.T, w *httptest.ResponseRecorder) map[string]interface{} {
	t.Helper()
	var resp map[string]interface{}
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
	return resp
}

// --- Register ---

func TestRegisterHandler_Success(t *testing.T) {
	mockSvc := &testutil.MockAuthService{
		RegisterFn: func(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
			return &dto.AuthResponse{
				AccessToken:  "access-token",
				RefreshToken: "refresh-token",
				ExpiresIn:    900,
				User: dto.UserInfo{
					ID:          uuid.New(),
					Email:       req.Email,
					DisplayName: req.DisplayName,
				},
			}, nil
		},
	}

	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/register", map[string]string{
		"email":        "test@example.com",
		"password":     "password123",
		"display_name": "Test User",
	})

	assert.Equal(t, http.StatusCreated, w.Code)
	resp := parseResponse(t, w)
	assert.True(t, resp["success"].(bool))

	data := resp["data"].(map[string]interface{})
	assert.Equal(t, "access-token", data["access_token"])
	assert.Equal(t, "refresh-token", data["refresh_token"])
}

func TestRegisterHandler_ValidationError_MissingEmail(t *testing.T) {
	mockSvc := &testutil.MockAuthService{}
	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/register", map[string]string{
		"password":     "password123",
		"display_name": "Test",
	})

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	resp := parseResponse(t, w)
	assert.False(t, resp["success"].(bool))
}

func TestRegisterHandler_ValidationError_ShortPassword(t *testing.T) {
	mockSvc := &testutil.MockAuthService{}
	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/register", map[string]string{
		"email":        "test@example.com",
		"password":     "short",
		"display_name": "Test",
	})

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

func TestRegisterHandler_ServiceError(t *testing.T) {
	mockSvc := &testutil.MockAuthService{
		RegisterFn: func(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
			return nil, assert.AnError
		},
	}

	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/register", map[string]string{
		"email":        "test@example.com",
		"password":     "password123",
		"display_name": "Test",
	})

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

// --- Login ---

func TestLoginHandler_Success(t *testing.T) {
	mockSvc := &testutil.MockAuthService{
		LoginFn: func(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
			return &dto.AuthResponse{
				AccessToken:  "access-token",
				RefreshToken: "refresh-token",
				ExpiresIn:    900,
				User: dto.UserInfo{
					Email: req.Email,
				},
			}, nil
		},
	}

	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/login", map[string]string{
		"email":    "test@example.com",
		"password": "password123",
	})

	assert.Equal(t, http.StatusOK, w.Code)
	resp := parseResponse(t, w)
	assert.True(t, resp["success"].(bool))
}

func TestLoginHandler_ValidationError(t *testing.T) {
	mockSvc := &testutil.MockAuthService{}
	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/login", map[string]string{
		"email": "not-an-email",
	})

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

// --- Refresh ---

func TestRefreshHandler_Success(t *testing.T) {
	mockSvc := &testutil.MockAuthService{
		RefreshTokenFn: func(ctx context.Context, refreshToken string) (*dto.AuthResponse, error) {
			return &dto.AuthResponse{
				AccessToken:  "new-access-token",
				RefreshToken: "new-refresh-token",
				ExpiresIn:    900,
			}, nil
		},
	}

	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/refresh", map[string]string{
		"refresh_token": "old-refresh-token",
	})

	assert.Equal(t, http.StatusOK, w.Code)
	resp := parseResponse(t, w)
	data := resp["data"].(map[string]interface{})
	assert.Equal(t, "new-access-token", data["access_token"])
}

func TestRefreshHandler_MissingToken(t *testing.T) {
	mockSvc := &testutil.MockAuthService{}
	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/refresh", map[string]string{})

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}

// --- Logout ---

func TestLogoutHandler_Success(t *testing.T) {
	mockSvc := &testutil.MockAuthService{}
	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)
	w := doRequest(r, "POST", "/auth/logout", nil)

	assert.Equal(t, http.StatusOK, w.Code)
	resp := parseResponse(t, w)
	assert.True(t, resp["success"].(bool))
}

// --- Invalid JSON ---

func TestRegisterHandler_InvalidJSON(t *testing.T) {
	mockSvc := &testutil.MockAuthService{}
	h := NewAuthHandler(mockSvc)
	r := setupRouter(h)

	req := httptest.NewRequest("POST", "/auth/register", bytes.NewBufferString("{invalid"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
}
