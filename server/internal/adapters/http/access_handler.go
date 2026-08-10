package http

import (
	"context"
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/access"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// accessHandler answers "what can I open in here?" for one interior.
//
// Deliberately NOT folded into GET /interiors/{id}: that payload is public and
// the client caches it by id, so per-learner lock state must not ride along or
// one learner's cache would answer for another.
type accessHandler struct {
	content  ports.ContentReader
	progress ports.ProgressRepo
	users    ports.UserRepo
}

type gate struct {
	ID     string `json:"id"`
	Locked bool   `json:"locked"`
	Reason string `json:"reason,omitempty"`
}

// @Summary What the learner may enter in one interior
// @Tags access
// @Security Bearer
// @Success 200 {object} map[string][]gate
// @Router /me/access/{interiorId} [get]
func (h *accessHandler) interior(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	ctx := r.Context()

	in, err := h.content.GetInterior(ctx, r.PathValue("interiorId"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "lookup failed")
		return
	}
	if in == nil {
		httpx.Error(w, http.StatusNotFound, "interior not found")
		return
	}

	l, err := h.learner(ctx, uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load progress")
		return
	}

	rooms := make([]gate, 0, len(in.Rooms))
	for _, rm := range in.Rooms {
		g := gate{ID: rm.ID}
		switch {
		case rm.Locked:
			// Permanent scenery — say so plainly rather than dangling a goal.
			g.Locked, g.Reason = true, "들어갈 수 없는 곳이에요"
		default:
			ok, reason := access.Evaluate(rm.Requires, l)
			g.Locked, g.Reason = !ok, reason
		}
		rooms = append(rooms, g)
	}
	spots := make([]gate, 0, len(in.Hotspots))
	for _, hs := range in.Hotspots {
		ok, reason := access.Evaluate(hs.Requires, l)
		spots = append(spots, gate{ID: hs.ID, Locked: !ok, Reason: reason})
	}

	httpx.JSON(w, http.StatusOK, map[string]any{"rooms": rooms, "hotspots": spots})
}

// learner assembles the snapshot requirements are checked against. Everything
// here already exists; access itself never queries.
func (h *accessHandler) learner(ctx context.Context, uid string) (access.Learner, error) {
	l := access.Learner{
		Cleared:    map[string]bool{},
		Reputation: map[string]int{},
		Missions:   map[string]bool{},
	}
	p, err := h.progress.GetProgress(ctx, uid)
	if err != nil {
		return l, err
	}
	l.Level = p.Level
	for _, st := range p.Reputation {
		l.Reputation[st.Key] = st.Value
	}
	if cleared, err := h.progress.ClearedScenarioIDs(ctx, uid); err == nil {
		l.Cleared = cleared
	}
	if found, err := h.progress.FoundMissions(ctx, uid); err == nil {
		for _, m := range found {
			l.Missions[m] = true
		}
	}
	if prof, err := h.users.GetProfile(ctx, uid); err == nil && prof != nil {
		l.EquippedTitle = prof.EquippedTitle
	}
	return l, nil
}
