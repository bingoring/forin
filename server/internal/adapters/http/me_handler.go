package http

import (
	"github.com/bingoring/forin/server/internal/i18n"
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
//
// Grew when the badge collection merged into titles: the eight milestone badges were
// display-only, and folding them in made them equippable, so their ids arrive here.
// A user who equipped a title that later disappears keeps a value this set rejects —
// the handler answers 400 and the profile simply shows no title, which is why the
// merge dropped only duplicate CONDITIONS and never an id that had been equippable.
var allowedTitles = map[string]bool{
	"": true, "learner": true, "ward_friend": true, "diligent": true,
	"er_ace": true, "polyglot": true, "hidden_hero": true,
	// from the merged badge collection
	"cap": true, "stethoscope": true, "syringe": true, "streak3": true, "crown": true,
	// light-hearted hidden titles
	"chatterbox": true, "marathoner": true, "collector": true, "returner": true,
}

type titleReq struct {
	TitleID string `json:"titleId"`
}

type uiLangReq struct {
	UILang string `json:"uiLang"`
}

// @Summary Set the app's display language
// @Tags user
// @Security Bearer
// @Param body body uiLangReq true "locale code, or \"\" to follow nativeLang"
// @Success 200 {object} user.Profile
// @Router /me/ui-lang [patch]
func (h *meHandler) setUILang(w http.ResponseWriter, r *http.Request) {
	uid, ok := UserID(r.Context())
	if !ok {
		httpx.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	var req uiLangReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	// Code-side allowed set, no DB constraint — adding a language must not need a
	// migration. "" is valid and means "follow nativeLang".
	if req.UILang != "" && !i18n.Supported[req.UILang] {
		httpx.Error(w, http.StatusBadRequest, "unsupported language")
		return
	}
	if err := h.users.SetUILang(r.Context(), uid, req.UILang); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not save language")
		return
	}
	saved, err := h.users.GetProfile(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	httpx.JSON(w, http.StatusOK, saved)
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
