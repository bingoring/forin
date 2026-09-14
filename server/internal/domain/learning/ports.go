// Package learning is the domain of the live learning experience: the journey a
// learner walks (themes → tiers → steps), what comes next, how much help a step
// gives, and where to resume. It owns the SHAPES the API returns and the PORT the
// HTTP handlers depend on, so a handler never imports a concrete engine.
//
// Direction of dependency: http → learning ← themed. Both the handler and the
// engine depend on this package; neither depends on the other (hexagonal). This is
// what lets the engine be swapped or extended without touching handlers (P3-A §2).
package learning

// Profession scopes a journey. The app ships one today ("nurse"); others (physical
// therapist, pharmacist, physician…) attach by dropping content/<prof>/ — the port
// already carries the dimension so the extension needs no signature change (S7).
type Profession string

type (
	ScenarioID string
	ThemeKey   string
)

// GuideLevel is how much help a step gives on the learner's next run of it.
type GuideLevel string

const (
	// GuideChoices offers candidate replies per NPC turn (the guided pass).
	GuideChoices GuideLevel = "choices"
	// GuideFree is an empty box with a hint within reach (the free pass, and every
	// boss/quiz, and anything outside a course).
	GuideFree GuideLevel = "free"
)

// ClearedPasses splits a clear into the two rungs of a dialogue: cleared WITH help
// vs alone. The zero value means "no split known", and a plain clear then reads as
// UNAIDED — the honest reading of attempts recorded before the guide column existed.
type ClearedPasses struct {
	GuidedCleared map[ScenarioID]bool
	FreeCleared   map[ScenarioID]bool
}

// Progress is one learner's state — a pure input, independent of storage.
type Progress struct {
	Cleared   map[ScenarioID]bool
	Attempted map[ScenarioID]bool
	Passes    ClearedPasses
	Latest    ScenarioID // most recent attempt (drives here/resume)
	Locale    string
}

// StepRef points at one place on the journey — what Next/Resume return and what
// Locate maps a scenario to.
type StepRef struct {
	Scenario ScenarioID
	Theme    ThemeKey
	Kind     string // dlg | quiz | event | boss (S4: open string)
	Found    bool
}

// ── response shapes (owned by the domain; the engine fills them, the wire mirrors them) ──

// TierCount summarises one difficulty rung for the list view (counts only; steps
// are lazy-loaded per theme).
type TierCount struct {
	Difficulty int  `json:"difficulty"`
	Done       int  `json:"done"`
	Total      int  `json:"total"`
	Unlocked   bool `json:"unlocked"`
}

// CurriculumState is one 정거장(주제) with progress overlaid.
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

// Journey is the single domain port for one profession's live learning experience.
// The concrete implementation is the themed engine.
type Journey interface {
	// Tracks is the journey/list view: CORE→dept order, dept-core leading each track.
	Tracks(p Progress) []TrackGroup
	// Next is what to do after finishing a scenario (result-screen button). Not
	// cleared → that scenario again; else the next required step; Found=false when done.
	Next(p Progress, justFinished ScenarioID) StepRef
	// Resume is the single "continue" target; Found=false when everything is passed.
	Resume(p Progress) StepRef
	// Guidance is the help level for a scenario's next run.
	Guidance(s ScenarioID, p Progress) GuideLevel
	// Locate maps a scenario to its theme/step; ok=false when it belongs to no course.
	Locate(s ScenarioID) (ref StepRef, ok bool)
}

// Journeys resolves the Journey for a profession (S7). Built once at boot from
// content/<prof>/. An unregistered profession returns an empty Journey (no content),
// the same safe posture the tracks endpoint has today.
type Journeys interface {
	For(p Profession) Journey
}
