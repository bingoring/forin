package http

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

type updateProfileReq struct {
	Job         string `json:"job"`
	NativeLang  string `json:"nativeLang"`
	TargetLang  string `json:"targetLang"`
	Destination string `json:"destination"`
	TargetLevel string `json:"targetLevel"`
}

// @Summary Save onboarding profile (marks the user onboarded)
// @Tags user
// @Security Bearer
// @Param body body updateProfileReq true "onboarding selections"
// @Success 200 {object} user.Profile
// @Router /me/profile [patch]
func (h *meHandler) updateProfile(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req updateProfileReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	// Fill sensible MVP defaults for anything the client omits.
	p := user.Profile{
		UserID: uid, Job: orDefault(req.Job, "nurse"), NativeLang: orDefault(req.NativeLang, "ko"),
		TargetLang: orDefault(req.TargetLang, "en"), Destination: orDefault(req.Destination, "us"),
		TargetLevel: orDefault(req.TargetLevel, "B1"),
	}
	if err := h.users.UpdateProfile(r.Context(), p); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not save profile")
		return
	}
	saved, err := h.users.GetProfile(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	httpx.JSON(w, http.StatusOK, saved)
}

func orDefault(v, def string) string {
	if v == "" {
		return def
	}
	return v
}

// allowedTitles is the code-side set of equippable career title ids (extensible,
// no DB constraint). "" un-equips. Kept in sync with the mobile title catalog.
var allowedTitles = map[string]bool{
	"": true, "learner": true, "ward_friend": true, "diligent": true,
	"er_ace": true, "polyglot": true, "hidden_hero": true,
}

type titleReq struct {
	TitleID string `json:"titleId"`
}

// @Summary Equip a career title
// @Tags user
// @Security Bearer
// @Param body body titleReq true "title id (” to un-equip)"
// @Success 200 {object} user.Profile
// @Router /me/title [patch]
func (h *meHandler) equipTitle(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req titleReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	if !allowedTitles[req.TitleID] {
		httpx.Error(w, http.StatusBadRequest, "unknown title")
		return
	}
	if err := h.users.SetEquippedTitle(r.Context(), uid, req.TitleID); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not equip title")
		return
	}
	saved, err := h.users.GetProfile(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	httpx.JSON(w, http.StatusOK, saved)
}
