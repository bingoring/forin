// Package curriculum is the server-authoritative learning path. A floor of the
// hospital holds 3~4 themed curricula; each curriculum is a short run of steps
// and each step maps to a scenario or quiz. Per-user state (done/now/lock) is
// derived from cleared attempts — there is no progress table. Mirrored to the
// client via GET /me/curriculum.
//
// v2 (2026-08-18) replaced the v19 chapter model. Three things changed and each
// fixed a defect the old shape made possible:
//
//   - A floor was ONE chapter of 6 steps, so 4 of every floor's 10 topics were
//     reachable only from the department sheet. Now the curricula of a floor
//     cover its topics exactly once between them.
//   - Chapters unlocked in a single global chain of 25. With ~72 curricula that
//     chain would be punishing, so floors and curricula are all open and the
//     sequence lives only inside a curriculum.
//   - Chapters carried a global number (CH.1…25) that the client drew next to a
//     floor list built from its own stale fixture. The number is gone; the
//     building → floor → curriculum hierarchy IS the roadmap.
package curriculum

import "github.com/bingoring/forin/server/internal/i18n"

// Step is one authored step. Kind ∈ dlg | quiz | event | boss.
//
// Name must MEAN the same thing as the title of the scenario ScenarioID points
// at. That sounds too obvious to state, but the v19 catalog shipped eleven steps
// whose names described a newcomer's ideal first week ("출근 · 인사와 자기소개")
// while their ids pointed at acute emergencies (SCN-ER-00001 = 흉통 환자 트리아지).
// Every id existed, so the seed guard passed; nothing compared the two strings.
// catalog_content_test.go now does.
type Step struct {
	Kind       string `json:"kind"`
	Name       string `json:"name"`
	ScenarioID string `json:"scenarioId,omitempty"`
}

// Curriculum is one authored themed run of steps on one floor.
//
// Building/Floor/Where are three fields rather than the v19 single Dept string
// because the client has to group by floor to draw the merged career tab, and
// "본관 1F 응급의료센터" cannot be split back apart reliably.
type Curriculum struct {
	// Key is a stable identifier: "<building>|<floor>|<slug>". The slug is
	// authored, never derived from Name — renaming a curriculum must not move the
	// home screen's resume target off it.
	Key      string
	Name     string
	Building string // matches cmd/gencontent/floors.go Building exactly
	Floor    string // matches its Label exactly ("1F", "P1", "B1")
	Where    string // matches the lift's "오늘 배치" string exactly
	Steps    []Step
}

// isOptional reports whether a step is supplementary. Quizzes are secondary
// content: the dialogue/event/boss steps are the required spine, and a quiz can
// be played anytime the curriculum is reached but never gates it.
func isOptional(kind string) bool { return kind == "quiz" }

// StepState is a step with its resolved per-user state. Steps are the only place
// `lock` still appears — the sequence lives inside a curriculum (business-rules R8).
type StepState struct {
	Kind       string `json:"kind"`
	Name       string `json:"name"`
	ScenarioID string `json:"scenarioId,omitempty"`
	State      string `json:"state"`              // done | now | lock | optional
	Optional   bool   `json:"optional,omitempty"` // bonus practice; doesn't gate
	// Attempted: played, graded below the bar. Orthogonal to State — a step you
	// failed is still "now" (it is what you should do next) and its successors are
	// still "lock" (clearing is what unlocks). Without this, a step you tried and a
	// step you have never opened look identical, which is the one thing the learner
	// cannot infer from anywhere else on the screen.
	Attempted bool `json:"attempted,omitempty"`
	// Guide is how much help this ENTRY gives: "choices" or "free". A dialogue appears
	// twice in the list — once guided, once not — and these are the two entries. Without
	// it the learner would see the same title twice with no way to tell which is which.
	Guide string `json:"guide,omitempty"`
	// Pass / Passes name the rung: "1/2" and "2/2". The client draws them, so the same
	// arithmetic is not done in two places.
	Pass   int `json:"pass,omitempty"`
	Passes int `json:"passes,omitempty"`
}

// CurriculumState is a curriculum with resolved progress.
//
// State has no `lock`: every floor and every curriculum is open (R9). Drawing a
// padlock here would make that decision a lie on screen.
type CurriculumState struct {
	Key      string      `json:"key"`
	Name     string      `json:"name"`
	Building string      `json:"building"`
	Floor    string      `json:"floor"`
	Where    string      `json:"where"`
	Done     int         `json:"done"`
	Total    int         `json:"total"`
	State    string      `json:"state"`          // done | doing | todo
	Next     string      `json:"next,omitempty"` // name of the current (now) step
	Resume   bool        `json:"resume,omitempty"`
	Steps    []StepState `json:"steps,omitempty"`
}

// FloorGroup and BuildingGroup are the wire shape. The server groups rather than
// sending a flat list because the ordering IS the learning order, and a client
// that regroups would have to know the tier table to reproduce it.
type FloorGroup struct {
	Floor     string            `json:"floor"`
	Where     string            `json:"where"`
	Curricula []CurriculumState `json:"curricula"`
}

type BuildingGroup struct {
	Building string       `json:"building"`
	Floors   []FloorGroup `json:"floors"`
}

// catalog is the whole learning path: the authored curricula followed by the
// difficulty fallback for any department nobody has authored yet (R7).
var catalog = func() []Curriculum {
	return append(append([]Curriculum(nil), authored...), fallback...)
}()

// Resolve computes per-user state for every curriculum, in catalog order.
//
// Only required steps (dlg/event/boss) gate progression: total/done count them
// and the "now" pointer walks them. Optional steps (quizzes) are playable at any
// time and are `done` once cleared.
func Resolve(cleared map[string]bool) []CurriculumState {
	return ResolveLocalized(cleared, nil, "", i18n.BaseLocale)
}

// ClearedPasses is how the two rungs of a step are resolved: which scenarios the learner has
// cleared WITH help, and which alone. Both are needed — reading two entries off one
// "cleared" flag ticks them together, and the free run would be born complete.
//
// Zero value means "no split known", and then a clear reads as UNAIDED. That is the
// honest reading of every attempt recorded before the guide column existed, and it is
// what keeps existing learners from being sent back through a guided pass they already
// did the hard way.
type ClearedPasses struct {
	GuidedCleared map[string]bool
	FreeCleared   map[string]bool
}

func (p ClearedPasses) freeOr(cleared map[string]bool) map[string]bool {
	if p.FreeCleared == nil && p.GuidedCleared == nil {
		return cleared
	}
	return p.FreeCleared
}

// ResolveWithResume is Resolve with an explicit resume target — the key of the
// curriculum holding the user's most recent attempt (resume.go). Passing "" or a
// key that is already complete falls back to the first unfinished curriculum.
func ResolveWithResume(cleared map[string]bool, preferKey string) []CurriculumState {
	return ResolveLocalized(cleared, nil, preferKey, i18n.BaseLocale)
}

// ResolveLocalized is ResolveWithResume with the names rendered in `locale`.
//
// Names are translated at the edge rather than stored per language: the authored
// Korean stays in authored_*.go as the single source, and a locale with no entry
// renders exactly what it renders today (i18n.Tr's fallback). That keeps adding a
// language additive — it touches no content file — and keeps the invariant tests,
// which read the authored names, meaningful.
// `attempted` may be nil, which simply means no step reports as tried.
func ResolveLocalized(cleared, attempted map[string]bool, preferKey, locale string) []CurriculumState {
	return ResolvePasses(cleared, attempted, ClearedPasses{}, preferKey, locale)
}

// ResolvePasses is ResolveLocalized with the two rungs of each dialogue resolved
// separately. This is the form the app uses; the others exist for callers that do not
// care which rung is which (invariant tests, the seed tool).
func ResolvePasses(cleared, attempted map[string]bool, p ClearedPasses, preferKey, locale string) []CurriculumState {
	out := make([]CurriculumState, 0, len(catalog))
	for _, c := range catalog {
		out = append(out, resolveOne(c, cleared, attempted, p.GuidedCleared, p.freeOr(cleared), locale))
	}
	markResume(out, preferKey)
	return out
}

func resolveOne(c Curriculum, cleared, attempted, guidedCleared, freeCleared map[string]bool, locale string) CurriculumState {
	cs := CurriculumState{
		Key: c.Key, Name: i18n.Tr(locale, c.Key, c.Name),
		Building: c.Building, Floor: c.Floor,
		// The floor heading is keyed by building|floor so the two curricula of a
		// shared floor cannot disagree about where they are.
		Where: i18n.Tr(locale, c.Building+"|"+c.Floor, c.Where),
	}
	nowUsed := false
	// One ENTRY per run, not per authored step. A dialogue is played twice — guided,
	// then alone — and the learner picks which from this list, so the list has to
	// contain both. That is also what doubles the visible length of every curriculum
	// without a line of new content.
	for _, r := range c.Runs() {
		s := Step{Kind: r.Kind, Name: r.Name, ScenarioID: r.ScenarioID}
		// Step names are keyed by content id: the id is what the step already carries,
		// so there is no second key space to keep in step with a rewording.
		st := StepState{Kind: s.Kind, Name: i18n.Tr(locale, s.ScenarioID, s.Name), ScenarioID: s.ScenarioID, Optional: isOptional(s.Kind)}
		if r.Passes > 1 {
			st.Guide, st.Pass, st.Passes = string(r.Guide), int(r.Pass), r.Passes
		}
		st.Attempted = s.ScenarioID != "" && attempted[s.ScenarioID]
		// Which rung is finished is not the same question as "is this scenario cleared".
		// The guided run is done once they have cleared it WITH help; the free run needs
		// a clear without. Reading both off one flag would tick them together and the
		// second entry would be born complete.
		done := s.ScenarioID != "" && cleared[s.ScenarioID]
		if r.Passes > 1 {
			// Doing it ALONE supersedes doing it with help: someone who cleared the
			// scenario unaided has no business being sent back through the guided rung.
			// This is also the honest reading of every attempt recorded before the guide
			// column existed — we do not know how they did it, and re-demanding it would
			// reopen finished work for every existing learner.
			switch r.Pass {
			case PassGuided:
				done = s.ScenarioID != "" && (guidedCleared[s.ScenarioID] || freeCleared[s.ScenarioID])
			default:
				done = s.ScenarioID != "" && freeCleared[s.ScenarioID]
			}
		}
		switch {
		case done:
			st.State = "done"
			if !st.Optional {
				cs.Done++
			}
		case st.Optional:
			st.State = "optional"
		case !nowUsed:
			st.State = "now"
			nowUsed = true
			cs.Next = s.Name
		default:
			st.State = "lock"
		}
		// Only where it says something. A "done" step was obviously attempted, and a
		// "lock" step marked tried reads as a contradiction — you cannot have played
		// what has not opened (it happens: an id can be reached directly, or the
		// catalog order can change under an old attempt). Either way the badge would
		// confuse rather than inform.
		if st.State != "now" && st.State != "optional" {
			st.Attempted = false
		}
		if !st.Optional {
			cs.Total++
		}
		cs.Steps = append(cs.Steps, st)
	}
	switch {
	case cs.Total > 0 && cs.Done >= cs.Total:
		cs.State = "done"
	case cs.Done > 0:
		cs.State = "doing"
	default:
		cs.State = "todo"
	}
	return cs
}

// markResume flags exactly one curriculum as the thing to continue (R11-R14).
// Zero only when everything is done, which is what makes the home screen show
// its rest card instead of inventing a next task.
func markResume(out []CurriculumState, preferKey string) {
	if preferKey != "" {
		for i := range out {
			if out[i].Key == preferKey && out[i].State != "done" {
				out[i].Resume = true
				return
			}
		}
	}
	for i := range out {
		if out[i].State != "done" {
			out[i].Resume = true
			return
		}
	}
}

// Group folds resolved curricula into building → floor order for the wire.
// Order comes from the catalog, never from map iteration: the same authored
// input must produce the same payload (build-spec §3 NFR).
func Group(states []CurriculumState) []BuildingGroup {
	var out []BuildingGroup
	for _, cs := range states {
		bi := -1
		for i := range out {
			if out[i].Building == cs.Building {
				bi = i
				break
			}
		}
		if bi < 0 {
			out = append(out, BuildingGroup{Building: cs.Building})
			bi = len(out) - 1
		}
		fi := -1
		for i := range out[bi].Floors {
			if out[bi].Floors[i].Floor == cs.Floor {
				fi = i
				break
			}
		}
		if fi < 0 {
			out[bi].Floors = append(out[bi].Floors, FloorGroup{Floor: cs.Floor, Where: cs.Where})
			fi = len(out[bi].Floors) - 1
		}
		out[bi].Floors[fi].Curricula = append(out[bi].Floors[fi].Curricula, cs)
	}
	return out
}

// NextScenarioAfter answers "what should the learner do next", for the button on the
// result screen.
//
// Defined as: the next required step of the curriculum the finished scenario belongs
// to; and when that curriculum is complete, the first required step of the next
// unfinished one — which is the SAME target the home tab's "오늘의 한 가지" and the
// career tab's 이어하기 point at, because all three read this resolution rather than
// each walking the catalog. Two screens computing "what's next" separately is how
// they end up disagreeing.
//
// On a run that did NOT pass, the answer is that scenario again. The step after it is
// locked precisely because this one was not cleared, so offering the next step would
// contradict the lock, and offering nothing would leave the button dead. Retrying is
// the honest next move — the caller sees the returned id equals what just finished and
// labels the button accordingly.
//
// Returns "" only when there is genuinely nothing left, and the caller then sends the
// learner somewhere they can choose for themselves rather than to a dead route.
func NextScenarioAfter(cleared, attempted map[string]bool, justFinished string) string {
	states := ResolveLocalized(cleared, attempted, KeyForScenario(justFinished), i18n.BaseLocale)

	// Not cleared: this scenario is still the curriculum's "now" step and the way
	// forward is through it.
	if justFinished != "" && !cleared[justFinished] {
		if key := KeyForScenario(justFinished); key != "" {
			for _, cs := range states {
				if cs.Key != key {
					continue
				}
				for _, st := range cs.Steps {
					if st.ScenarioID == justFinished && st.State == "now" {
						return justFinished
					}
				}
			}
		}
	}

	// Prefer the curriculum the learner is already in: finishing step 2 of 5 should
	// offer step 3, not jump them to another ward.
	if key := KeyForScenario(justFinished); key != "" {
		for _, cs := range states {
			if cs.Key != key {
				continue
			}
			if id := firstActionable(cs, justFinished); id != "" {
				return id
			}
			break // this curriculum is done; fall through to the next one
		}
	}
	// Otherwise the resume target — the one flag the whole app already agrees on.
	for _, cs := range states {
		if !cs.Resume {
			continue
		}
		if id := firstActionable(cs, justFinished); id != "" {
			return id
		}
	}
	return ""
}

// firstActionable is the step the learner can start now, skipping the one they just
// finished (which the caller has already handled).
func firstActionable(cs CurriculumState, exclude string) string {
	for _, st := range cs.Steps {
		if st.ScenarioID == "" || st.ScenarioID == exclude {
			continue
		}
		if st.State == "now" {
			return st.ScenarioID
		}
	}
	return ""
}
