package http

import (
	"errors"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/bingoring/forin/server/internal/domain/colleague"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type colleagueHandler struct {
	svc      *colleague.Service
	repo     ports.ColleagueRepo
	users    ports.UserRepo
	progress ports.ProgressRepo
}

// @Summary My invite code (mints one when absent; ?rotate=1 issues a fresh one)
// @Tags colleagues
// @Security Bearer
// @Router /me/invite-code [post]
func (h *colleagueHandler) inviteCode(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	c, err := h.svc.EnsureCode(r.Context(), uid, r.URL.Query().Get("rotate") == "1")
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not issue invite code")
		return
	}
	httpx.JSON(w, http.StatusOK, c)
}

// @Summary Preview the person behind an invite code
// @Tags colleagues
// @Security Bearer
// @Router /invite/{code} [get]
func (h *colleagueHandler) lookup(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	code := colleague.NormalizeCode(r.PathValue("code"))
	if code == "" {
		httpx.Error(w, http.StatusBadRequest, "invalid code format")
		return
	}
	rec, err := h.repo.CodeOwner(r.Context(), code)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not look up code")
		return
	}
	if rec == nil || !rec.Usable(time.Now()) {
		httpx.Error(w, http.StatusNotFound, "code not found or expired")
		return
	}
	if rec.UserID == uid {
		httpx.Error(w, http.StatusBadRequest, "that is your own code")
		return
	}
	// Preview carries the minimum needed to recognise a person — never their
	// activity, which is only shared once the link exists.
	out := map[string]any{"id": rec.UserID, "name": displayName(rec.UserID)}
	if prof, err := h.users.GetProfile(r.Context(), rec.UserID); err == nil && prof != nil {
		out["targetLevel"] = prof.TargetLevel
		out["destination"] = prof.Destination
	}
	if p, err := h.progress.GetProgress(r.Context(), rec.UserID); err == nil && p != nil {
		out["streak"] = p.StreakCurrent
	}
	httpx.JSON(w, http.StatusOK, out)
}

type addColleagueReq struct {
	Code string `json:"code"`
}

// @Summary Redeem an invite code (creates a request, or links when mutual)
// @Tags colleagues
// @Security Bearer
// @Router /me/colleagues [post]
func (h *colleagueHandler) add(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req addColleagueReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	res, err := h.svc.RedeemCode(r.Context(), uid, req.Code)
	switch {
	case errors.Is(err, colleague.ErrCodeInvalid):
		httpx.Error(w, http.StatusNotFound, "code not found or expired")
		return
	case errors.Is(err, colleague.ErrSelfLink):
		httpx.Error(w, http.StatusBadRequest, "that is your own code")
		return
	case errors.Is(err, colleague.ErrLimitReached):
		httpx.Error(w, http.StatusBadRequest, "colleague limit reached")
		return
	case err != nil:
		httpx.Error(w, http.StatusInternalServerError, "could not add colleague")
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

// @Summary My colleagues
// @Tags colleagues
// @Security Bearer
// @Router /me/colleagues [get]
func (h *colleagueHandler) list(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	ctx := r.Context()
	links, err := h.repo.Links(ctx, uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load colleagues")
		return
	}
	ids := make([]string, 0, len(links))
	for _, l := range links {
		ids = append(ids, l.OtherID)
	}
	presences, _ := h.repo.Presences(ctx, ids)

	out := make([]map[string]any, 0, len(links))
	for _, l := range links {
		row := map[string]any{
			"id": l.OtherID, "relation": l.Relation, "name": displayName(l.OtherID),
		}
		if prof, err := h.users.GetProfile(ctx, l.OtherID); err == nil && prof != nil {
			row["targetLevel"] = prof.TargetLevel
			row["destination"] = prof.Destination
		}
		if p, err := h.progress.GetProgress(ctx, l.OtherID); err == nil && p != nil {
			row["streak"] = p.StreakCurrent
		}
		// Activity only for colleagues who share it (R-10).
		if prefs, err := h.repo.Prefs(ctx, l.OtherID); err == nil && prefs.ShareStatus {
			if pr, ok := presences[l.OtherID]; ok {
				row["activity"] = pr.Label
				row["activeToday"] = time.Since(pr.LastSeenAt) < 24*time.Hour
			}
		} else {
			row["statusHidden"] = true
		}
		out = append(out, row)
	}
	requests, _ := h.repo.InboxRequests(ctx, uid)
	unread, _ := h.repo.UnreadCheers(ctx, uid)
	httpx.JSON(w, http.StatusOK, map[string]any{
		"colleagues": out, "pendingRequests": len(requests), "unreadCheers": unread,
	})
}

// @Summary One colleague's profile (404 unless linked)
// @Tags colleagues
// @Security Bearer
// @Router /me/colleagues/{id} [get]
func (h *colleagueHandler) detail(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	other := r.PathValue("id")
	ctx := r.Context()

	linked, err := h.repo.Linked(ctx, uid, other)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load colleague")
		return
	}
	// Not linked → 404, not 403: a 403 would confirm the account exists.
	if !linked {
		httpx.Error(w, http.StatusNotFound, "not found")
		return
	}

	out := map[string]any{"id": other, "name": displayName(other)}
	if prof, err := h.users.GetProfile(ctx, other); err == nil && prof != nil {
		out["targetLevel"] = prof.TargetLevel
		out["destination"] = prof.Destination
	}
	if p, err := h.progress.GetProgress(ctx, other); err == nil && p != nil {
		out["level"], out["streak"] = p.Level, p.StreakCurrent
	}
	prefs, _ := h.repo.Prefs(ctx, other)
	if prefs.ShareStatus {
		if m, err := h.repo.Presences(ctx, []string{other}); err == nil {
			if pr, ok := m[other]; ok {
				out["activity"] = pr.Label
				out["lastSeenAt"] = pr.LastSeenAt
			}
		}
	} else {
		out["statusHidden"] = true
	}
	if prefs.ShareWeekly {
		now := time.Now()
		dayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
		weekStart := dayStart.AddDate(0, 0, -((int(now.Weekday()) + 6) % 7))
		if s, err := h.progress.GrowthStats(ctx, other, dayStart, weekStart, now.Location().String()); err == nil {
			out["activeDates"] = s.ActiveDates
		}
	} else {
		out["weeklyHidden"] = true
	}
	cheers, _ := h.repo.Conversation(ctx, uid, other, 20)
	out["cheers"] = cheers
	httpx.JSON(w, http.StatusOK, out)
}

type cheerReq struct {
	Preset  string `json:"preset"`
	Message string `json:"message"`
}

// @Summary Send a cheer to a colleague
// @Tags colleagues
// @Security Bearer
// @Router /me/colleagues/{id}/cheers [post]
func (h *colleagueHandler) cheer(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var req cheerReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	c, err := h.svc.SendCheer(r.Context(), uid, r.PathValue("id"), colleague.Preset(req.Preset), req.Message)
	switch {
	case errors.Is(err, colleague.ErrNotLinked):
		httpx.Error(w, http.StatusNotFound, "not found")
		return
	case errors.Is(err, colleague.ErrCheerLimit):
		httpx.Error(w, http.StatusTooManyRequests, "cheer limit reached")
		return
	case err != nil:
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, c)
}

// @Summary Cheer inbox (marks them read)
// @Tags colleagues
// @Security Bearer
// @Router /me/cheers [get]
func (h *colleagueHandler) inbox(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	cheers, err := h.repo.Inbox(r.Context(), uid, 30)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load cheers")
		return
	}
	if r.URL.Query().Get("markRead") == "1" {
		_ = h.repo.MarkCheersRead(r.Context(), uid)
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"cheers": cheers})
}

// @Summary Pending colleague requests addressed to me
// @Tags colleagues
// @Security Bearer
// @Router /me/colleague-requests [get]
func (h *colleagueHandler) requests(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	reqs, err := h.repo.InboxRequests(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not load requests")
		return
	}
	out := make([]map[string]any, 0, len(reqs))
	for _, q := range reqs {
		out = append(out, map[string]any{
			"id": q.ID, "from": q.FromUserID, "name": displayName(q.FromUserID),
			"relation": q.Relation, "createdAt": q.CreatedAt,
		})
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"requests": out})
}

// @Summary Accept a colleague request
// @Tags colleagues
// @Security Bearer
// @Router /me/colleague-requests/{id}/accept [post]
func (h *colleagueHandler) accept(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	q, err := h.svc.Accept(r.Context(), r.PathValue("id"), uid)
	switch {
	case errors.Is(err, colleague.ErrLimitReached):
		httpx.Error(w, http.StatusBadRequest, "colleague limit reached")
		return
	case errors.Is(err, pgx.ErrNoRows):
		httpx.Error(w, http.StatusNotFound, "not found")
		return
	case err != nil:
		httpx.Error(w, http.StatusInternalServerError, "could not accept request")
		return
	}
	httpx.JSON(w, http.StatusOK, q)
}

// @Summary Decline a colleague request
// @Tags colleagues
// @Security Bearer
// @Router /me/colleague-requests/{id}/decline [post]
func (h *colleagueHandler) decline(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	if err := h.repo.SetRequestStatus(r.Context(), r.PathValue("id"), uid, colleague.StatusDeclined); err != nil {
		httpx.Error(w, http.StatusNotFound, "not found")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// @Summary Remove a colleague
// @Tags colleagues
// @Security Bearer
// @Router /me/colleagues/{id} [delete]
func (h *colleagueHandler) remove(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	if err := h.repo.Unlink(r.Context(), uid, r.PathValue("id")); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not remove colleague")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

type prefsReq struct {
	ShareStatus *bool `json:"shareStatus"`
	ShareWeekly *bool `json:"shareWeekly"`
}

// @Summary Read or update colleague sharing preferences
// @Tags colleagues
// @Security Bearer
// @Router /me/colleague-prefs [get]
func (h *colleagueHandler) prefs(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	if r.Method == http.MethodGet {
		p, err := h.repo.Prefs(r.Context(), uid)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, "could not load preferences")
			return
		}
		httpx.JSON(w, http.StatusOK, p)
		return
	}
	var req prefsReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	p, _ := h.repo.Prefs(r.Context(), uid) // start from current, patch what was sent
	if req.ShareStatus != nil {
		p.ShareStatus = *req.ShareStatus
	}
	if req.ShareWeekly != nil {
		p.ShareWeekly = *req.ShareWeekly
	}
	if err := h.repo.SetPrefs(r.Context(), uid, p); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not save preferences")
		return
	}
	httpx.JSON(w, http.StatusOK, p)
}
