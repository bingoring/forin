package http

import (
	"errors"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/auth"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/platform/httpx"
)

type authHandler struct{ svc *auth.Service }

// @Summary Social login (Apple/Google/Kakao)
// @Tags auth
// @Accept json
// @Produce json
// @Param body body socialLoginReq true "provider + ID token"
// @Success 200 {object} loginResp
// @Router /auth/social [post]
func (h *authHandler) social(w http.ResponseWriter, r *http.Request) {
	var req socialLoginReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	if req.Provider == "" || req.IDToken == "" {
		httpx.Error(w, http.StatusBadRequest, "provider and idToken are required")
		return
	}
	pair, u, err := h.svc.SocialLogin(r.Context(), user.Provider(req.Provider), req.IDToken)
	if err != nil {
		httpx.Error(w, http.StatusUnauthorized, "authentication failed")
		return
	}
	httpx.JSON(w, http.StatusOK, loginResp{Tokens: pair, User: u})
}

// @Summary Dev login (local only — no provider). Registered only when ENV=dev.
// @Tags auth
// @Produce json
// @Success 200 {object} loginResp
// @Router /auth/dev [post]
func (h *authHandler) dev(w http.ResponseWriter, r *http.Request) {
	pair, u, err := h.svc.DevLogin(r.Context())
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "dev login failed")
		return
	}
	httpx.JSON(w, http.StatusOK, loginResp{Tokens: pair, User: u})
}

// @Summary Rotate refresh token
// @Tags auth
// @Param body body refreshReq true "refresh token"
// @Success 200 {object} auth.TokenPair
// @Router /auth/refresh [post]
func (h *authHandler) refresh(w http.ResponseWriter, r *http.Request) {
	var req refreshReq
	if err := httpx.DecodeJSON(r, &req); err != nil || req.RefreshToken == "" {
		httpx.Error(w, http.StatusBadRequest, "refreshToken is required")
		return
	}
	pair, err := h.svc.Refresh(r.Context(), req.RefreshToken)
	if err != nil {
		if errors.Is(err, auth.ErrInvalidToken) || errors.Is(err, auth.ErrMalformed) {
			httpx.Error(w, http.StatusUnauthorized, "invalid refresh token")
			return
		}
		httpx.Error(w, http.StatusInternalServerError, "could not refresh")
		return
	}
	httpx.JSON(w, http.StatusOK, pair)
}

// @Summary Logout (revoke refresh tokens)
// @Tags auth
// @Security Bearer
// @Router /auth/logout [post]
func (h *authHandler) logout(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	if err := h.svc.Logout(r.Context(), uid); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not logout")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

type socialLoginReq struct {
	Provider string `json:"provider"`
	IDToken  string `json:"idToken"`
}

type refreshReq struct {
	RefreshToken string `json:"refreshToken"`
}

type loginResp struct {
	Tokens *auth.TokenPair `json:"tokens"`
	User   *user.User      `json:"user"`
}
