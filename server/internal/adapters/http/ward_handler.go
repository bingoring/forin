package http

import (
	"context"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/ward"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// wardHandler serves the home live ward: a polled presence roster of the people currently
// studying. Presence is best-effort — a write that fails must never break the home screen —
// and the roster degrades to empty (the learner's own figure still shows) if Redis is down.
type wardHandler struct {
	svc   *ward.Service
	prefs ports.ColleagueRepo // for the ward opt-out flag (share_ward)
}

type wardResp struct {
	Roster []ward.Member `json:"roster"`
}

// hidden reports whether the caller opted out of appearing in the ward. A read error is
// treated as visible (the default), so a prefs hiccup never silently empties the ward.
func (h *wardHandler) hidden(ctx context.Context, uid string) bool {
	if h.prefs == nil {
		return false
	}
	p, err := h.prefs.Prefs(ctx, uid)
	if err != nil {
		return false
	}
	return !p.ShareWard
}

// @Summary Live ward roster
// @Description Touches the caller's presence and returns up to 10 other learners currently studying (anonymous id + avatar, never the caller).
// @Tags ward
// @Security Bearer
// @Router /ward [get]
func (h *wardHandler) get(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	// Being on the home screen is itself a heartbeat.
	_ = h.svc.Touch(ctx, uid, h.hidden(ctx, uid))
	roster, err := h.svc.Roster(ctx, uid)
	if err != nil || roster == nil {
		roster = []ward.Member{}
	}
	httpx.JSON(w, http.StatusOK, wardResp{Roster: roster})
}

// @Summary Ward heartbeat
// @Description Keeps the caller present while the app is foregrounded on any screen. No body.
// @Tags ward
// @Security Bearer
// @Router /ward/heartbeat [post]
func (h *wardHandler) heartbeat(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	_ = h.svc.Touch(ctx, uid, h.hidden(ctx, uid))
	w.WriteHeader(http.StatusNoContent)
}

// @Summary Leave the ward
// @Description Removes the caller immediately (the app backgrounded or closed), rather than waiting for the TTL.
// @Tags ward
// @Security Bearer
// @Router /ward/leave [post]
func (h *wardHandler) leave(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	_ = h.svc.Leave(ctx, uid)
	w.WriteHeader(http.StatusNoContent)
}
