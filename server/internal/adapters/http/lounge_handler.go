package http

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/bingoring/forin/server/internal/domain/lounge"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

type loungeHandler struct{ repo ports.LoungeRepo }

// Named response types rather than map[string]any: the contract is generated from
// these annotations, so an inline map would reach the client as `unknown`.
type loungeFeedResp struct {
	Posts []lounge.Post `json:"posts"`
	// True when the page came back full — the client asks for the next one with
	// `before` set to the oldest createdAt it holds.
	HasMore bool `json:"hasMore"`
}

type loungePostIDResp struct {
	ID string `json:"id"`
}

type loungeCheerResp struct {
	Cheers  int  `json:"cheers"`
	Cheered bool `json:"cheered"`
}

// @Summary The staff lounge feed, newest first
// @Description Pages backwards in time: pass the oldest `createdAt` you have as `before`.
// @Tags lounge
// @Security Bearer
// @Param before query string false "RFC3339 timestamp; returns posts older than this"
// @Param limit query int false "1..50, default 20"
// @Success 200 {object} loungeFeedResp
// @Router /lounge [get]
func (h *loungeHandler) feed(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())

	var before *time.Time
	if raw := r.URL.Query().Get("before"); raw != "" {
		t, err := time.Parse(time.RFC3339, raw)
		if err != nil {
			// A cursor we cannot parse is not "start from the top": silently serving
			// page 1 would make an infinite scroll repeat itself forever.
			httpx.Error(w, http.StatusBadRequest, "before must be an RFC3339 timestamp")
			return
		}
		before = &t
	}
	limit := lounge.PageSize(atoiDefault(r.URL.Query().Get("limit"), 0))

	posts, err := h.repo.Feed(r.Context(), uid, before, limit)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not read the lounge")
		return
	}
	if posts == nil {
		posts = []lounge.Post{} // an empty feed is `[]`, never `null`
	}
	httpx.JSON(w, http.StatusOK, loungeFeedResp{Posts: posts, HasMore: len(posts) == limit})
}

type postDraft struct {
	Kind       string          `json:"kind"`
	Body       string          `json:"body"`
	Tags       []string        `json:"tags"`
	ScenarioID string          `json:"scenarioId"`
	Snippet    *lounge.Snippet `json:"snippet"`
}

// @Summary Write a lounge post
// @Tags lounge
// @Security Bearer
// @Param body body postDraft true "the post"
// @Success 201 {object} loungePostIDResp
// @Router /lounge [post]
func (h *loungeHandler) create(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())

	var in postDraft
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid body")
		return
	}
	draft, err := lounge.Draft{
		Kind:       lounge.Kind(in.Kind),
		Body:       in.Body,
		Tags:       in.Tags,
		ScenarioID: in.ScenarioID,
		Snippet:    in.Snippet,
	}.Clean()
	if err != nil {
		// The domain's message names what is wrong with the draft, which is exactly
		// what the writer needs to see — these are all fixable by editing.
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	// Counted per author, server-side. A client-side limit is a suggestion.
	n, err := h.repo.PostsToday(r.Context(), uid)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not write the post")
		return
	}
	if n >= lounge.PostsPerDay {
		httpx.Error(w, http.StatusTooManyRequests, lounge.ErrRateLimited.Error())
		return
	}

	id, err := h.repo.Create(r.Context(), uid, draft)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not write the post")
		return
	}
	httpx.JSON(w, http.StatusCreated, loungePostIDResp{ID: id})
}

// @Summary Delete your own lounge post
// @Tags lounge
// @Security Bearer
// @Router /lounge/{id} [delete]
func (h *loungeHandler) remove(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	err := h.repo.Delete(r.Context(), r.PathValue("id"), uid)
	switch {
	case errors.Is(err, pgx.ErrNoRows):
		httpx.Error(w, http.StatusNotFound, "post not found")
	case errors.Is(err, lounge.ErrNotAuthor):
		httpx.Error(w, http.StatusForbidden, "not your post")
	case err != nil:
		httpx.Error(w, http.StatusInternalServerError, "could not delete the post")
	default:
		w.WriteHeader(http.StatusNoContent)
	}
}

// @Summary Cheer a post (idempotent), or take the cheer back
// @Tags lounge
// @Security Bearer
// @Param on query bool false "false to remove your cheer"
// @Success 200 {object} loungeCheerResp
// @Router /lounge/{id}/cheer [post]
func (h *loungeHandler) cheer(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	on := r.URL.Query().Get("on") != "false"
	total, err := h.repo.SetCheer(r.Context(), r.PathValue("id"), uid, on)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not record the cheer")
		return
	}
	httpx.JSON(w, http.StatusOK, loungeCheerResp{Cheers: total, Cheered: on})
}

type reportBody struct {
	Reason string `json:"reason"`
}

// @Summary Report a post
// @Description Records the report for review. Idempotent per reader — reporting twice
// @Description is one report, and the response is the same either way so the reader
// @Description cannot probe what has already been flagged.
// @Tags lounge
// @Security Bearer
// @Param body body reportBody false "why it was reported"
// @Router /lounge/{id}/report [post]
func (h *loungeHandler) report(w http.ResponseWriter, r *http.Request) {
	uid, _ := UserID(r.Context())
	var in reportBody
	_ = json.NewDecoder(r.Body).Decode(&in) // a reason is optional; the report is not
	if err := h.repo.Report(r.Context(), r.PathValue("id"), uid, in.Reason); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not file the report")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
