package themed

// TierCount is a tier summary for the list response — counts only, no steps
// (steps are lazy-loaded per theme; business-logic-model §4).
type TierCount struct {
	Difficulty int  `json:"difficulty"`
	Done       int  `json:"done"`
	Total      int  `json:"total"`
	Unlocked   bool `json:"unlocked"`
}

// CurriculumState is one 정거장(주제) in the list response.
type CurriculumState struct {
	ThemeKey   string      `json:"themeKey"`
	Name       string      `json:"name"`
	Track      string      `json:"track"`
	Dept       string      `json:"dept"`
	CollabWith string      `json:"collabWith,omitempty"`
	Done       int         `json:"done"`
	Total      int         `json:"total"`
	State      string      `json:"state"` // passed | here | open
	Tiers      []TierCount `json:"tiers"`
	Resume     bool        `json:"resume"`
}

// Milestone is a track-level exam (부서 시험).
type Milestone struct {
	Name  string `json:"name"`
	State string `json:"state"` // passed | open | closed
}

// TrackGroup is one journey track: CORE, or a department.
type TrackGroup struct {
	Dept      string            `json:"dept"`
	Curricula []CurriculumState `json:"curricula"`
	Milestone *Milestone        `json:"milestone,omitempty"`
}

// Resolve overlays progress onto assembled curricula and groups them into
// tracks: CORE first, then dept tracks in deptOrder, then any remaining depts
// in first-seen order. Pure; no I/O. `attempted` is accepted for parity with
// the legacy resolver and future use; state today derives from cleared+latest.
func Resolve(curricula []Curriculum, deptOrder []string, cleared, attempted map[string]bool, latest string) []TrackGroup {
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
	// Build states in curricula (learning) order as a flat slice, decide resume
	// on it, THEN group — grouping appends copies, so a Resume flag set before
	// grouping is carried into the emitted slices without pointer aliasing.
	states := make([]CurriculumState, len(curricula))
	deptOf := make([]string, len(curricula))
	for i := range curricula {
		states[i] = resolveOne(curricula[i], cleared, latestTheme)
		dept := "CORE"
		if curricula[i].Theme.Track != "core" {
			dept = curricula[i].Theme.Dept
		}
		deptOf[i] = dept
	}
	order := make([]*CurriculumState, len(states))
	for i := range states {
		order[i] = &states[i]
	}
	setResume(order, latestTheme)

	byDept := map[string][]CurriculumState{}
	deptSeen := []string{}
	for i := range states {
		dept := deptOf[i]
		if _, ok := byDept[dept]; !ok {
			deptSeen = append(deptSeen, dept)
		}
		byDept[dept] = append(byDept[dept], states[i])
	}

	tracks := make([]TrackGroup, 0, len(byDept))
	emit := func(dept string) {
		cs, ok := byDept[dept]
		if !ok {
			return
		}
		delete(byDept, dept)
		tracks = append(tracks, TrackGroup{Dept: dept, Curricula: cs, Milestone: milestoneFor(cs)})
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

func resolveOne(c Curriculum, cleared map[string]bool, latestTheme string) CurriculumState {
	st := CurriculumState{
		ThemeKey: c.Theme.Key, Name: c.Theme.Name, Track: c.Theme.Track, Dept: c.Theme.Dept,
		CollabWith: c.CollabWith,
	}
	prevTierDone := true
	for _, ti := range c.Tiers {
		tc := TierCount{Difficulty: ti.Difficulty, Unlocked: prevTierDone}
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

func milestoneFor(cs []CurriculumState) *Milestone {
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
	return &Milestone{Name: "구간 시험", State: state}
}

func setResume(order []*CurriculumState, latestTheme string) {
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
