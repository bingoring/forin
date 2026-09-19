package http

import (
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// journeyHandler serves the journey map: one goal-department track plus the rest of
// the campus as free-roam chips, in a single round trip.
type journeyHandler struct {
	progress ports.ProgressRepo
	users    ports.UserRepo
	journeys learning.Journeys
}

// @Summary 여정 지도 — 목표 부서 트랙 + 자유 탐방
// @Tags progress
// @Security Bearer
// @Success 200 {object} learning.JourneyView
// @Router /me/journey [get]
//
// One round trip draws the screen. The home tab set this precedent: a screen that
// needs three reads to render is a screen whose parts can disagree mid-render.
func (h *journeyHandler) journey(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	p := learningProgress(ctx, h.progress, uid)
	j := journeyFor(ctx, h.journeys)
	tracks := j.Tracks(p)

	stored := ""
	if h.users != nil {
		if prof, err := h.users.GetProfile(ctx, uid); err == nil && prof != nil {
			stored = prof.GoalDept
		}
		// A failed profile read degrades to inference, not to an error: the learner
		// asked to see their journey, and we can still draw one.
	}
	goal, inferred := resolveGoalDept(stored, j, p, tracks)

	view := learning.JourneyView{
		GoalDept: goal,
		Inferred: inferred,
		FreeRoam: summariseFreeRoam(tracks, goal),
	}
	for _, tg := range tracks {
		if tg.Dept == goal {
			view.Track = rescopeCurrent(tg)
			break
		}
	}
	if view.Track.Dept == "" {
		view.Track.Dept = goal // no track to draw yet, but say whose empty path this is
	}
	if view.Track.Curricula == nil {
		view.Track.Curricula = []learning.CurriculumState{}
	}
	httpx.JSON(w, http.StatusOK, view)
}

// @Summary 정거장 상세 — 그 주제의 스텝 목록 (지연 로드)
// @Tags progress
// @Security Bearer
// @Success 200 {object} learning.StationDetail
// @Router /me/journey/stations/{themeKey} [get]
func (h *journeyHandler) station(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	uid, _ := UserID(ctx)
	key := r.PathValue("themeKey")
	p := learningProgress(ctx, h.progress, uid)
	j := journeyFor(ctx, h.journeys)

	var found *learning.CurriculumState
	for _, tg := range j.Tracks(p) {
		for i := range tg.Curricula {
			if tg.Curricula[i].ThemeKey == key {
				found = &tg.Curricula[i]
				break
			}
		}
	}
	if found == nil {
		httpx.Error(w, http.StatusNotFound, "unknown theme")
		return
	}
	steps := j.Steps(learning.ThemeKey(key), p)
	if steps == nil {
		steps = []learning.StepState{}
	}
	httpx.JSON(w, http.StatusOK, learning.StationDetail{Station: *found, Steps: steps})
}
