package http

import (
	"github.com/bingoring/forin/server/internal/domain/campus"
	"github.com/bingoring/forin/server/internal/domain/learning"
)

// resolveGoalDept decides which department's track the journey draws.
//
// A stored choice wins. Without one, the latest attempt's department is the honest
// guess — it is where the learner actually is. With no attempts either, the first
// department the lift can reach starts them somewhere rather than nowhere.
//
// An inferred answer is NOT persisted (J4): a path picked for you is not a path you
// chose, and a learner who plays one scenario out of curiosity should not find their
// goal moved.
func resolveGoalDept(stored string, j learning.Journey, p learning.Progress, tracks []learning.TrackGroup) (string, bool) {
	if stored != "" {
		if _, ok := campus.Of(stored); ok {
			return stored, false
		}
		// The stored department left the content. Fall through to inference rather
		// than drawing an empty path for a department that no longer exists.
	}
	if j != nil && p.Latest != "" {
		if ref, ok := j.Locate(p.Latest); ok {
			if dept := deptOfTheme(ref.Theme, tracks); dept != "" {
				if _, ok := campus.Of(dept); ok {
					return dept, true
				}
			}
		}
	}
	for _, tg := range tracks {
		if _, ok := campus.Of(tg.Dept); ok {
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
// would not compare. Order follows the campus directory so the chips read in the same
// sequence as the lift.
func summariseFreeRoam(tracks []learning.TrackGroup, goal string) []learning.FreeRoamEntry {
	byDept := map[string]learning.FreeRoamEntry{}
	for _, tg := range tracks {
		if tg.Dept == goal {
			continue
		}
		if _, ok := campus.Of(tg.Dept); !ok {
			continue // the lift cannot stop here (J9)
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
