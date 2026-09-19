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
