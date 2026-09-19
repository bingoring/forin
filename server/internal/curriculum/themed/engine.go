package themed

import "github.com/bingoring/forin/server/internal/domain/learning"

// Engine implements learning.Journey for ONE profession, over a boot-time Catalog.
// It adds the runtime concerns the tracks view alone did not cover — next step,
// resume, guidance, locate — as pure functions over the assembled curricula plus a
// scenario→step reverse index built once at construction (P3-A domain-entities §5).
type Engine struct {
	cat   *Catalog
	guide learning.GuidancePolicy
	index map[learning.ScenarioID]learning.StepRef // scenario → its step (Found=true)
}

// Option configures an Engine (e.g. a non-default guidance policy — seam S5).
type Option func(*Engine)

// WithGuidance overrides the guidance policy.
func WithGuidance(g learning.GuidancePolicy) Option { return func(e *Engine) { e.guide = g } }

// NewEngine builds an engine over an assembled catalog. Default policies apply
// unless overridden.
func NewEngine(cat *Catalog, opts ...Option) *Engine {
	e := &Engine{cat: cat, guide: learning.DefaultGuidance{}, index: map[learning.ScenarioID]learning.StepRef{}}
	for _, c := range cat.curricula {
		for _, ti := range c.Tiers {
			for _, s := range ti.Steps {
				if s.ScenarioID == "" {
					continue
				}
				e.index[learning.ScenarioID(s.ScenarioID)] = learning.StepRef{
					Scenario: learning.ScenarioID(s.ScenarioID),
					Theme:    learning.ThemeKey(c.Theme.Key),
					Kind:     s.Kind,
					Found:    true,
				}
			}
		}
	}
	for _, o := range opts {
		o(e)
	}
	return e
}

// Tracks is the journey/list view.
func (e *Engine) Tracks(p learning.Progress) []learning.TrackGroup {
	return e.cat.Resolve(strKeys(p.Cleared), strKeys(p.Attempted), string(p.Latest))
}

// Locate maps a scenario to its theme/step; ok=false when it belongs to no course.
func (e *Engine) Locate(s learning.ScenarioID) (learning.StepRef, bool) {
	ref, ok := e.index[s]
	return ref, ok
}

// Guidance is the help level for a scenario's next run (v2 GuideForScenario ported):
// a scenario outside any course is free; a boss/quiz is free; a dialogue is guided
// the first time and free once its guided (or free) pass is cleared.
func (e *Engine) Guidance(s learning.ScenarioID, p learning.Progress) learning.GuideLevel {
	ref, ok := e.index[s]
	if !ok {
		return learning.GuideFree
	}
	clearedGuided := p.Passes.GuidedCleared[s] || p.Passes.FreeCleared[s]
	if e.guide.Passes(ref.Kind) == 1 || clearedGuided {
		return learning.GuideFree
	}
	return learning.GuideChoices
}

// Next is what to do after finishing a scenario. Not cleared → that scenario again
// (its successors are locked). Else the next required step of the same theme; when
// that theme is done, the resume target's first step. Found=false when nothing remains.
func (e *Engine) Next(p learning.Progress, justFinished learning.ScenarioID) learning.StepRef {
	cleared := strKeys(p.Cleared)
	if justFinished != "" && !p.Cleared[justFinished] {
		if ref, ok := e.index[justFinished]; ok && ref.Kind != "quiz" {
			return ref // retry the same scenario
		}
	}
	if ref, ok := e.index[justFinished]; ok {
		if nxt, ok2 := e.firstOpen(string(ref.Theme), cleared, string(justFinished)); ok2 {
			return nxt
		}
		// this theme is complete; fall through to the resume target
	}
	if t := e.resumeTheme(p, cleared); t != "" {
		if nxt, ok := e.firstOpen(t, cleared, string(justFinished)); ok {
			return nxt
		}
	}
	return learning.StepRef{}
}

// Resume is the single "continue" target; Found=false when everything is passed.
func (e *Engine) Resume(p learning.Progress) learning.StepRef {
	cleared := strKeys(p.Cleared)
	t := e.resumeTheme(p, cleared)
	if t == "" {
		return learning.StepRef{}
	}
	if ref, ok := e.firstOpen(t, cleared, ""); ok {
		return ref
	}
	return learning.StepRef{}
}

// Steps is ONE theme's rows with progress overlaid (v2 resolveOne ported).
//
// One row per RUN: a dialogue is played twice (guided, then alone), so it yields two
// rows and the learner picks which. Exactly one row is `now` — the first that is
// neither done nor optional — and everything after it is `lock`, which is what makes
// the sequence inside a theme visible without a padlock on the theme itself.
func (e *Engine) Steps(theme learning.ThemeKey, p learning.Progress) []learning.StepState {
	c, ok := e.curriculum(string(theme))
	if !ok {
		return nil
	}
	out := []learning.StepState{}
	nowUsed := false
	for _, ti := range c.Tiers {
		for _, st := range ti.Steps {
			id := learning.ScenarioID(st.ScenarioID)
			n := e.guide.Passes(st.Kind)
			for pass := 1; pass <= n; pass++ {
				row := learning.StepState{
					Kind: st.Kind, Name: st.Name, ScenarioID: st.ScenarioID,
					Optional: st.Kind == "quiz",
				}
				if n > 1 {
					row.Guide, row.Pass, row.Passes = e.guide.GuideForPass(st.Kind, pass), pass, n
				}
				row.Attempted = id != "" && p.Attempted[id]
				// Which RUNG is finished is not "is this scenario cleared": the guided run
				// is done once cleared WITH help, the free run needs a clear without. Doing
				// it alone supersedes doing it with help — and a clear recorded before the
				// guide column existed reads as unaided, so finished work never reopens.
				done := id != "" && p.Cleared[id]
				if n > 1 {
					if pass == 1 {
						done = id != "" && (p.Passes.GuidedCleared[id] || p.Passes.FreeCleared[id])
					} else {
						done = id != "" && p.Passes.FreeCleared[id]
					}
				}
				switch {
				case done:
					row.State = "done"
				case row.Optional:
					row.State = "optional"
				case !nowUsed:
					row.State, nowUsed = "now", true
				default:
					row.State = "lock"
				}
				// Only where it says something: a done row was obviously attempted, and a
				// lock row marked tried reads as a contradiction — you cannot have played
				// what has not opened.
				if row.State != "now" && row.State != "optional" {
					row.Attempted = false
				}
				out = append(out, row)
			}
		}
	}
	return out
}

// curriculum finds an assembled curriculum by theme key.
func (e *Engine) curriculum(themeKey string) (Curriculum, bool) {
	for _, c := range e.cat.curricula {
		if c.Theme.Key == themeKey {
			return c, true
		}
	}
	return Curriculum{}, false
}

// firstOpen returns the first required (non-quiz) not-cleared step of a theme in
// learning order (tier 1→3, step order within), skipping `exclude`.
func (e *Engine) firstOpen(themeKey string, cleared map[string]bool, exclude string) (learning.StepRef, bool) {
	for _, c := range e.cat.curricula {
		if c.Theme.Key != themeKey {
			continue
		}
		for _, ti := range c.Tiers {
			for _, s := range ti.Steps {
				if s.Kind == "quiz" || s.ScenarioID == "" || s.ScenarioID == exclude {
					continue
				}
				if !cleared[s.ScenarioID] {
					return learning.StepRef{
						Scenario: learning.ScenarioID(s.ScenarioID),
						Theme:    learning.ThemeKey(c.Theme.Key),
						Kind:     s.Kind,
						Found:    true,
					}, true
				}
			}
		}
		return learning.StepRef{}, false // theme found but fully done
	}
	return learning.StepRef{}, false
}

// resumeTheme is the theme to continue: the latest attempt's theme if it still has
// an open step, else the first theme in learning order that does (mirrors setResume).
func (e *Engine) resumeTheme(p learning.Progress, cleared map[string]bool) string {
	if p.Latest != "" {
		if ref, ok := e.index[p.Latest]; ok {
			if _, open := e.firstOpen(string(ref.Theme), cleared, ""); open {
				return string(ref.Theme)
			}
		}
	}
	for _, c := range e.cat.curricula {
		if _, open := e.firstOpen(c.Theme.Key, cleared, ""); open {
			return c.Theme.Key
		}
	}
	return ""
}

func strKeys(m map[learning.ScenarioID]bool) map[string]bool {
	if m == nil {
		return nil
	}
	out := make(map[string]bool, len(m))
	for k, v := range m {
		out[string(k)] = v
	}
	return out
}

// ── Registry: learning.Journeys (S7 profession lookup) ──

// Registry maps a profession to its engine. Built once at boot from content/<prof>/.
type Registry struct {
	byProf map[learning.Profession]*Engine
}

// NewRegistry returns an empty registry.
func NewRegistry() *Registry { return &Registry{byProf: map[learning.Profession]*Engine{}} }

// Add registers a profession's engine.
func (r *Registry) Add(p learning.Profession, e *Engine) { r.byProf[p] = e }

// For returns the Journey for a profession, or an empty Journey when none is
// registered (the same safe, browsable-but-empty posture the tracks endpoint has today).
func (r *Registry) For(p learning.Profession) learning.Journey {
	if e, ok := r.byProf[p]; ok && e != nil {
		return e
	}
	return emptyJourney{}
}

// emptyJourney is the no-content fallback for an unregistered profession.
type emptyJourney struct{}

func (emptyJourney) Tracks(learning.Progress) []learning.TrackGroup { return []learning.TrackGroup{} }
func (emptyJourney) Next(learning.Progress, learning.ScenarioID) learning.StepRef {
	return learning.StepRef{}
}
func (emptyJourney) Resume(learning.Progress) learning.StepRef { return learning.StepRef{} }
func (emptyJourney) Guidance(learning.ScenarioID, learning.Progress) learning.GuideLevel {
	return learning.GuideFree
}
func (emptyJourney) Locate(learning.ScenarioID) (learning.StepRef, bool) {
	return learning.StepRef{}, false
}
func (emptyJourney) Steps(learning.ThemeKey, learning.Progress) []learning.StepState { return nil }

// compile-time interface checks.
var (
	_ learning.Journey  = (*Engine)(nil)
	_ learning.Journey  = emptyJourney{}
	_ learning.Journeys = (*Registry)(nil)
)
