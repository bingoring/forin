package httpapi

import (
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type meHandler struct{ users ports.UserRepo }

type meResp struct {
	User    *user.User    `json:"user"`
	Profile *user.Profile `json:"profile"`
}

// @Summary Current user + profile
// @Tags user
// @Security Bearer
// @Success 200 {object} meResp
// @Router /me [get]
func (h *meHandler) me(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	u, err := h.users.GetByID(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	if u == nil {
		httpx.Error(w, http.StatusNotFound, "user not found")
		return
	}
	p, err := h.users.GetProfile(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	httpx.JSON(w, http.StatusOK, meResp{User: u, Profile: p})
}
