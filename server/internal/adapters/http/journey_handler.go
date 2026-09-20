package http

import (
	"net/http"

	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/i18n"
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
	// The engine's Name is authored Korean, keyed by ThemeKey — the same lookup
	// legacyOne used to do for the retired campus screen (L4.4). Translated in
	// place, before Name is read by anything below: nothing else here compares
	// against it, so there is no ordering hazard.
	for ti := range tracks {
		for ci := range tracks[ti].Curricula {
			cs := &tracks[ti].Curricula[ci]
			cs.Name = i18n.Tr(p.Locale, cs.ThemeKey, cs.Name)
		}
		// The milestone's Name is authored Korean too (themed.milestoneFor hardcodes
		// "구간 시험" — the engine has no locale to translate with, task-19-brief.md).
		// One key for all tracks: unlike a curriculum's Name, milestoneFor never varies
		// the string by department, so there is no per-dept key to keep in step with.
		if m := tracks[ti].Milestone; m != nil {
			m.Name = i18n.Tr(p.Locale, "milestone.name", m.Name)
		}
	}

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
	station := *found
	station.Name = i18n.Tr(p.Locale, station.ThemeKey, station.Name)
	steps := j.Steps(learning.ThemeKey(key), p)
	for i := range steps {
		// Step names are keyed by content id (ScenarioID), not by theme: the id is
		// what the row already carries, so there is no second key space to keep in
		// step with a rewording.
		steps[i].Name = i18n.Tr(p.Locale, steps[i].ScenarioID, steps[i].Name)
	}
	if steps == nil {
		steps = []learning.StepState{}
	}
	httpx.JSON(w, http.StatusOK, learning.StationDetail{Station: station, Steps: steps})
}

type goalDeptReq struct {
	Dept string `json:"dept"`
}

// @Summary 목표 부서 선택 — 여정이 그릴 트랙
// @Tags user
// @Security Bearer
// @Param body body goalDeptReq true "department code"
// @Success 200 {object} map[string]any
// @Router /me/goal-dept [patch]
//
// The allowed set is code-side (a department with an authored track — J9, revised
// 2026-09-20), not a DB CHECK: departments grow with content, and a constraint would
// make adding one a migration. The set comes from this profession's live journey
// (the same `h.journeys` /me/journey reads), not from the campus directory — a
// department needs no floor to be a valid goal any more, only a topic. This is the
// only path that persists a goal department — /me/journey only ever reads one, so an
// inferred goal is never written (J4).
func (h *journeyHandler) setGoalDept(w http.ResponseWriter, r *http.Request) {
	var req goalDeptReq
	if err := httpx.DecodeJSON(r, &req); err != nil {
		httpx.Error(w, http.StatusBadRequest, "dept is required")
		return
	}
	ctx := r.Context()
	j := journeyFor(ctx, h.journeys)
	// Zero-value progress: which departments have a track never depends on WHO is
	// asking — cleared/attempted/latest only shade a track's per-station state, not
	// which tracks the catalog emits — so this membership check needs no progress
	// read.
	tracks := j.Tracks(learning.Progress{})
	if !hasTopic(tracks, req.Dept) {
		httpx.Error(w, http.StatusBadRequest, "unknown department")
		return
	}
	uid, _ := UserID(ctx)
	if err := h.users.SetGoalDept(ctx, uid, req.Dept); err != nil {
		httpx.Error(w, http.StatusInternalServerError, "could not save goal department")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"goalDept": req.Dept, "inferred": false})
}
