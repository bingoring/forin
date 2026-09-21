package http

import (
	"github.com/bingoring/forin/server/internal/domain/campus"
	"github.com/bingoring/forin/server/internal/domain/learning"
)

// hasTopic reports whether the profession's journey has an authored track for dept
// (J9, revised 2026-09-20: the allowed set is content, not the lift). CORE is a
// track too, but it is the universal curriculum, not a department a learner can aim
// at or roam to, so it never counts.
func hasTopic(tracks []learning.TrackGroup, dept string) bool {
	if dept == "" || dept == "CORE" {
		return false
	}
	for _, tg := range tracks {
		if tg.Dept == dept {
			return true
		}
	}
	return false
}

// resolveGoalDept decides which department's track the journey draws.
//
// A stored choice wins. Without one, the latest attempt's department is the honest
// guess — it is where the learner actually is. With no attempts either, the first
// authored department starts them somewhere rather than nowhere.
//
// An inferred answer is NOT persisted (J4): a path picked for you is not a path you
// chose, and a learner who plays one scenario out of curiosity should not find their
// goal moved.
func resolveGoalDept(stored string, j learning.Journey, p learning.Progress, tracks []learning.TrackGroup) (string, bool) {
	if stored != "" && hasTopic(tracks, stored) {
		return stored, false
	}
	// The stored department (if any) has no authored topic. Fall through to
	// inference rather than drawing an empty path for a department that does not
	// exist in this catalog.
	if j != nil && p.Latest != "" {
		if ref, ok := j.Locate(p.Latest); ok {
			if dept := deptOfTheme(ref.Theme, tracks); hasTopic(tracks, dept) {
				return dept, true
			}
		}
	}
	for _, tg := range tracks {
		if hasTopic(tracks, tg.Dept) {
			return tg.Dept, true
		}
	}
	return "", true
}

// rescopeCurrent makes sure the drawn track names exactly one place to continue.
//
// The engine's here/resume are GLOBAL: they follow the latest attempt, which may sit
// in a department this screen is not drawing. Then the map would have no current
// station at all. So when this track has none, the first unfinished station becomes
// the target — but its STATE stays "open". Promoting it to "here" would claim the
// learner was just there, and they were not; the flag says "continue here", the state
// says "you have been here", and only one of those is true.
func rescopeCurrent(track learning.TrackGroup) learning.TrackGroup {
	for _, c := range track.Curricula {
		if c.State == "here" {
			return track // the global answer already points inside this track
		}
	}
	out := track
	out.Curricula = append([]learning.CurriculumState(nil), track.Curricula...)
	for i := range out.Curricula {
		out.Curricula[i].Resume = false
	}
	for i := range out.Curricula {
		if out.Curricula[i].State != "passed" {
			out.Curricula[i].Resume = true
			break
		}
	}
	return out
}

// summariseFreeRoam is the roster of departments the learner is not aiming at.
//
// Stamps count PASSED STATIONS, not cleared scenarios: passing a station is the
// passport stamp in this world, and scenario counts differ per department so they
// would not compare.
//
// Every authored department but the goal appears here (J9, revised 2026-09-20: a
// floor is no longer required — GEN has none and still belongs). Depts with a floor
// are ordered by the campus directory, same as before, so chips for the lift-served
// majority read in the same sequence as the lift; a floorless dept has nowhere in
// that directory to sort by, so it is appended afterward in `tracks`' own order —
// itself deterministic (the engine builds it from the catalog, not a map) — so the
// list never reshuffles between calls.
func summariseFreeRoam(tracks []learning.TrackGroup, goal string) []learning.FreeRoamEntry {
	byDept := map[string]learning.FreeRoamEntry{}
	for _, tg := range tracks {
		if tg.Dept == goal || tg.Dept == "CORE" {
			continue
		}
		e := learning.FreeRoamEntry{Dept: tg.Dept, Total: len(tg.Curricula)}
		for _, c := range tg.Curricula {
			if c.State == "passed" {
				e.Passed++
			}
		}
		byDept[tg.Dept] = e
	}
	out := []learning.FreeRoamEntry{}
	for _, fl := range campus.Floors {
		for _, d := range fl.Depts {
			if e, ok := byDept[d]; ok {
				out = append(out, e)
				delete(byDept, d)
			}
		}
	}
	for _, tg := range tracks {
		if e, ok := byDept[tg.Dept]; ok {
			out = append(out, e)
			delete(byDept, tg.Dept)
		}
	}
	return out
}

// 이름은 여기서 붙이지 않는다: 클라이언트가 `dept.<CODE>` 라벨을 4개 언어로 이미 갖고 있고 아이콘도
// 같은 코드로 고른다. 서버가 또 들면 두 벌이 갈라진다.

// deptOfTheme finds which track a theme belongs to.
func deptOfTheme(theme learning.ThemeKey, tracks []learning.TrackGroup) string {
	for _, tg := range tracks {
		for _, c := range tg.Curricula {
			if c.ThemeKey == string(theme) {
				return tg.Dept
			}
		}
	}
	return ""
}
