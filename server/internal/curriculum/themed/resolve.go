package themed

import "github.com/bingoring/forin/server/internal/domain/learning"

// The wire/response shapes (TrackGroup·CurriculumState·TierCount·Milestone) live in
// the learning domain (P3-A §2 — the domain owns the shape); this file fills them.
// tierUnlock is the tier-open rule as a swappable part (seam S5); the default
// reproduces P1 behaviour (a tier opens once the previous is complete).
var tierUnlock learning.TierUnlockPolicy = learning.DefaultTierUnlock{}

// Resolve overlays progress onto assembled curricula and groups them into tracks:
// CORE first, then dept tracks in deptOrder, then any remaining depts in first-seen
// order. Pure; no I/O. `attempted` is accepted for parity/future use; state today
// derives from cleared+latest.
func Resolve(curricula []Curriculum, deptOrder []string, cleared, attempted map[string]bool, latest string) []learning.TrackGroup {
	_ = attempted
	// theme key of the latest attempt → drives `here`/resume.
	latestTheme := ""
	for _, c := range curricula {
		for _, ti := range c.Tiers {
			for _, s := range ti.Steps {
				if s.ScenarioID == latest {
					latestTheme = c.Theme.Key
				}
			}
		}
	}
	// Build states in curricula (learning) order as a flat slice, decide resume on it,
	// THEN group — grouping appends copies, so a Resume flag set before grouping is
	// carried into the emitted slices without pointer aliasing.
	states := make([]learning.CurriculumState, len(curricula))
	deptOf := make([]string, len(curricula))
	for i := range curricula {
		states[i] = resolveOne(curricula[i], cleared, latestTheme)
		// Group every theme by its Dept. A core theme scoped to a department
		// (track=core, dept=ICU — 부서별 코어) joins that department's track and,
		// by its low Order, leads it. Only a truly universal theme (dept="") falls
		// into the global CORE track (P2 D-P2-D 부서별 코어 결정).
		dept := curricula[i].Theme.Dept
		if dept == "" {
			dept = "CORE"
		}
		deptOf[i] = dept
	}
	order := make([]*learning.CurriculumState, len(states))
	for i := range states {
		order[i] = &states[i]
	}
	setResume(order, latestTheme)

	byDept := map[string][]learning.CurriculumState{}
	deptSeen := []string{}
	for i := range states {
		dept := deptOf[i]
		if _, ok := byDept[dept]; !ok {
			deptSeen = append(deptSeen, dept)
		}
		byDept[dept] = append(byDept[dept], states[i])
	}

	tracks := make([]learning.TrackGroup, 0, len(byDept))
	emit := func(dept string) {
		cs, ok := byDept[dept]
		if !ok {
			return
		}
		delete(byDept, dept)
		tracks = append(tracks, learning.TrackGroup{Dept: dept, Curricula: cs, Milestone: milestoneFor(cs)})
	}
	emit("CORE")
	for _, d := range deptOrder {
		emit(d)
	}
	for _, d := range deptSeen { // stable remainder (also covers CORE already emitted → no-op)
		emit(d)
	}
	return tracks
}

func resolveOne(c Curriculum, cleared map[string]bool, latestTheme string) learning.CurriculumState {
	st := learning.CurriculumState{
		ThemeKey: c.Theme.Key, Name: c.Theme.Name, Track: c.Theme.Track, Dept: c.Theme.Dept,
		CollabWith: c.CollabWith,
	}
	prevTierDone := true
	for _, ti := range c.Tiers {
		tc := learning.TierCount{Difficulty: ti.Difficulty, Unlocked: tierUnlock.Unlocked(prevTierDone)}
		tierDone := true
		for _, s := range ti.Steps {
			if s.Kind == "quiz" { // optional, not counted
				continue
			}
			tc.Total++
			st.Total++
			if cleared[s.ScenarioID] {
				tc.Done++
				st.Done++
			} else {
				tierDone = false
			}
		}
		st.Tiers = append(st.Tiers, tc)
		prevTierDone = prevTierDone && tierDone
	}
	switch {
	case st.Total > 0 && st.Done == st.Total:
		st.State = "passed"
	case c.Theme.Key == latestTheme:
		st.State = "here"
	default:
		st.State = "open"
	}
	return st
}

func milestoneFor(cs []learning.CurriculumState) *learning.Milestone {
	all := true
	for _, c := range cs {
		if c.State != "passed" {
			all = false
			break
		}
	}
	state := "closed"
	if all {
		state = "open"
	}
	return &learning.Milestone{Name: "구간 시험", State: state}
}

func setResume(order []*learning.CurriculumState, latestTheme string) {
	// R15: latest attempt's theme, if not fully done.
	if latestTheme != "" {
		for _, s := range order {
			if s.ThemeKey == latestTheme && s.State != "passed" {
				s.Resume = true
				return
			}
		}
	}
	// R16/R17: first not-passed in learning order (CORE first by construction).
	for _, s := range order {
		if s.State != "passed" {
			s.Resume = true
			return
		}
	}
	// R18: all passed → none.
}
