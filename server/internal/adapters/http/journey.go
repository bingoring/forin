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
