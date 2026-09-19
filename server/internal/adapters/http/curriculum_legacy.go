package http

import (
	"github.com/bingoring/forin/server/internal/domain/campus"
	"github.com/bingoring/forin/server/internal/domain/learning"
	"github.com/bingoring/forin/server/internal/i18n"
)

// The legacy campus wire shape (GET /me/curriculum): buildings → floors → curricula.
//
// This file is a PRESENTER, not a second engine (P3-A §4). The journey is organised
// by theme and department; the campus screen draws buildings, so one pure mapping
// regroups the journey for it. It exists for exactly one release — until the client
// consumes /me/curriculum/tracks — and then this file is deleted whole. Keeping the
// mapping in one removable file is what makes that deletion a delete rather than a
// disentangling.
type legacyStep struct {
	Kind       string `json:"kind"`
	Name       string `json:"name"`
	ScenarioID string `json:"scenarioId,omitempty"`
	State      string `json:"state"`
	Attempted  bool   `json:"attempted,omitempty"`
	Optional   bool   `json:"optional,omitempty"`
	Guide      string `json:"guide,omitempty"`
	Pass       int    `json:"pass,omitempty"`
	Passes     int    `json:"passes,omitempty"`
}

type legacyCurriculum struct {
	Key      string       `json:"key"`
	Name     string       `json:"name"`
	Building string       `json:"building"`
	Floor    string       `json:"floor"`
	Where    string       `json:"where"`
	Done     int          `json:"done"`
	Total    int          `json:"total"`
	State    string       `json:"state"`          // done | doing | todo
	Next     string       `json:"next,omitempty"` // name of the current (now) step
	Resume   bool         `json:"resume,omitempty"`
	Steps    []legacyStep `json:"steps,omitempty"`
}

type legacyFloor struct {
	Floor     string             `json:"floor"`
	Where     string             `json:"where"`
	Curricula []legacyCurriculum `json:"curricula"`
}

type legacyBuilding struct {
	Building string        `json:"building"`
	Floors   []legacyFloor `json:"floors"`
}

// legacyCurricula is the learner's journey as a flat list in CAMPUS order.
//
// Order is the campus directory's, not the journey's: a learner rides the lift by
// building and progresses by tier, and the screens that read this are the lift.
// Departments the lift cannot stop at (GEN — a generic ward bank reachable from the
// department sheet) are dropped rather than given an invented building, which is what
// the hardcoded catalog did too.
//
// Counts here are per RUN, not per situation: this view lists both rungs of every
// dialogue, so counting situations would show 4/8 against a list of eight rows. The
// home card reads the same list so the two screens cannot disagree about the number.
func legacyCurricula(j learning.Journey, p learning.Progress, locale string) []legacyCurriculum {
	if j == nil {
		return nil
	}
	byDept := map[string][]legacyCurriculum{}
	for _, tg := range j.Tracks(p) {
		fl, ok := campus.Of(tg.Dept)
		if !ok {
			continue
		}
		for _, cs := range tg.Curricula {
			byDept[tg.Dept] = append(byDept[tg.Dept], legacyOne(j, p, locale, cs, fl))
		}
	}
	var out []legacyCurriculum
	for _, fl := range campus.Floors {
		for _, dept := range fl.Depts {
			out = append(out, byDept[dept]...)
		}
	}
	// The journey's resume target can be a theme this view dropped — a learner whose
	// last attempt was a GEN scenario resumes in a department the lift cannot stop at.
	// Dropping the flag with it would leave the career tab with no hero at all, so the
	// view re-points at the first place it CAN show. The engine's answer is unchanged;
	// only this screen's pointer moves, and only when its own answer is unreachable.
	if !hasResume(out) {
		for i := range out {
			if out[i].State != "done" {
				out[i].Resume = true
				break
			}
		}
	}
	return out
}

func hasResume(cs []legacyCurriculum) bool {
	for _, c := range cs {
		if c.Resume {
			return true
		}
	}
	return false
}

// legacyBuildings groups the flat list into the campus wire shape.
func legacyBuildings(curricula []legacyCurriculum) []legacyBuilding {
	out := []legacyBuilding{}
	for _, c := range curricula {
		bi := len(out) - 1
		if bi < 0 || out[bi].Building != c.Building {
			out = append(out, legacyBuilding{Building: c.Building})
			bi = len(out) - 1
		}
		fi := len(out[bi].Floors) - 1
		if fi < 0 || out[bi].Floors[fi].Floor != c.Floor {
			out[bi].Floors = append(out[bi].Floors, legacyFloor{Floor: c.Floor, Where: c.Where})
			fi = len(out[bi].Floors) - 1
		}
		out[bi].Floors[fi].Curricula = append(out[bi].Floors[fi].Curricula, c)
	}
	return out
}

// legacyOne maps one theme to one legacy curriculum, reading its rows from the port.
func legacyOne(j learning.Journey, p learning.Progress, locale string, cs learning.CurriculumState, fl campus.Floor) legacyCurriculum {
	out := legacyCurriculum{
		Key:      cs.ThemeKey,
		Name:     i18n.Tr(locale, cs.ThemeKey, cs.Name),
		Building: fl.Building,
		Floor:    fl.Label,
		Where:    i18n.Tr(locale, fl.Building+"|"+fl.Label, fl.Where),
		Resume:   cs.Resume,
	}
	for _, r := range j.Steps(learning.ThemeKey(cs.ThemeKey), p) {
		// Step names are keyed by content id: the id is what the row already carries,
		// so there is no second key space to keep in step with a rewording.
		out.Steps = append(out.Steps, legacyStep{
			Kind: r.Kind, Name: i18n.Tr(locale, r.ScenarioID, r.Name), ScenarioID: r.ScenarioID,
			State: r.State, Attempted: r.Attempted, Optional: r.Optional,
			Guide: string(r.Guide), Pass: r.Pass, Passes: r.Passes,
		})
		if r.Optional {
			continue // a bonus quiz gates nothing and is not counted
		}
		out.Total++
		if r.State == "done" {
			out.Done++
		}
		if r.State == "now" {
			out.Next = i18n.Tr(locale, r.ScenarioID, r.Name)
		}
	}
	switch {
	case out.Total > 0 && out.Done >= out.Total:
		out.State = "done"
	case out.Done > 0:
		out.State = "doing"
	default:
		out.State = "todo"
	}
	return out
}
