// Package content holds the authored-content domain model — the schema that
// content files conform to and the runtime serves. Pure types + allowed sets.
//
// Variable/extensible parts (step payloads, effect directives, branches) are kept
// as raw JSON so new step/effect types need only a client handler + an allowed-set
// entry here — never a schema migration.
package content

// ---- enum-ish fields: code-side allowed sets (no DB CHECK), extensible. ----

type Profession string // "nurse", "doctor", ... ; "common" = cross-profession

type EventCategory string

const (
	CatEmergencyCode  EventCategory = "emergency_code"
	CatClinical       EventCategory = "clinical"
	CatInterpersonal  EventCategory = "interpersonal"
	CatFacilitySafety EventCategory = "facility_safety"
	CatProcedure      EventCategory = "procedure"
)

var AllowedCategories = set(CatEmergencyCode, CatClinical, CatInterpersonal, CatFacilitySafety, CatProcedure)

type StepType string

const (
	StepDialogue StepType = "dialogue"
	StepQuiz     StepType = "quiz"
	StepEffect   StepType = "effect"
	StepBranch   StepType = "branch"
)

var AllowedStepTypes = set(StepDialogue, StepQuiz, StepEffect, StepBranch)

// EffectType is interpreted by the client's effect registry (extensible).
type EffectType string

const (
	EffectScreen EffectType = "screen_effect" // e.g. fire, smoke, flash
	EffectSound  EffectType = "sound"
	EffectHaptic EffectType = "haptic"
	EffectCamera EffectType = "camera" // shake, zoom
)

var AllowedEffectTypes = set(EffectScreen, EffectSound, EffectHaptic, EffectCamera)

type Delivery string

const (
	DeliveryMainRoute Delivery = "main_route"
	DeliveryDailyPool Delivery = "daily_pool"
	DeliveryBoth      Delivery = "both"
)

var AllowedDeliveries = set(DeliveryMainRoute, DeliveryDailyPool, DeliveryBoth)

// ---- entities ----

type Manifest struct {
	ContentVersion string   `yaml:"contentVersion" json:"contentVersion"`
	SchemaVersion  int      `yaml:"schemaVersion" json:"schemaVersion"`
	Professions    []string `yaml:"professions" json:"professions"`
}

type Department struct {
	ID         string `yaml:"id" json:"id"`
	Profession string `yaml:"profession" json:"profession"`
	Ward       string `yaml:"ward" json:"ward"`
	NameKo     string `yaml:"nameKo" json:"nameKo"`
	NameEn     string `yaml:"nameEn" json:"nameEn"`
	Color      string `yaml:"color" json:"color"`
}

// Interior is one explorable department map (tile-based). Nested parts are
// embedded (read as a whole by the client map engine).
type Interior struct {
	ID          string      `yaml:"id" json:"id"`
	Profession  string      `yaml:"profession" json:"profession"`
	DeptID      string      `yaml:"deptId" json:"deptId"`
	Cols        int         `yaml:"cols" json:"cols"`
	Rows        int         `yaml:"rows" json:"rows"`
	PlayerStart Coord       `yaml:"playerStart" json:"playerStart"`
	FloorTheme  string      `yaml:"floorTheme" json:"floorTheme"`
	Regions     []Region    `yaml:"regions" json:"regions"`
	Rooms       []Room      `yaml:"rooms" json:"rooms"`
	Objects     []MapObject `yaml:"objects" json:"objects"`
	Hotspots    []Hotspot   `yaml:"hotspots" json:"hotspots"`
}

type Coord struct {
	X int `yaml:"x" json:"x"`
	Y int `yaml:"y" json:"y"`
}

type Bounds struct {
	X int `yaml:"x" json:"x"`
	Y int `yaml:"y" json:"y"`
	W int `yaml:"w" json:"w"`
	H int `yaml:"h" json:"h"`
}

type Region struct {
	ID     string `yaml:"id" json:"id"`
	Name   string `yaml:"name" json:"name"`
	Icon   string `yaml:"icon" json:"icon"`
	Bounds Bounds `yaml:"bounds" json:"bounds"`
}

type Room struct {
	ID     string `yaml:"id" json:"id"`
	Name   string `yaml:"name" json:"name"`
	Sub    string `yaml:"sub" json:"sub"`
	Icon   string `yaml:"icon" json:"icon"`
	Color  string `yaml:"color" json:"color"`
	X      int    `yaml:"x" json:"x"`
	Y      int    `yaml:"y" json:"y"`
	Locked bool   `yaml:"locked" json:"locked"`
}

type MapObject struct {
	ID    string         `yaml:"id" json:"id"`
	Type  string         `yaml:"type" json:"type"`
	X     int            `yaml:"x" json:"x"`
	Y     int            `yaml:"y" json:"y"`
	Props map[string]any `yaml:"props" json:"props,omitempty"`
}

type Hotspot struct {
	ID         string `yaml:"id" json:"id"`
	Kind       string `yaml:"kind" json:"kind"` // quest|urgent|info
	X          int    `yaml:"x" json:"x"`
	Y          int    `yaml:"y" json:"y"`
	Label      string `yaml:"label" json:"label"`
	ScenarioID string `yaml:"scenarioId" json:"scenarioId"`
}

type Event struct {
	ID            string        `yaml:"id" json:"id"`
	Profession    string        `yaml:"profession" json:"profession"`
	Title         string        `yaml:"title" json:"title"`
	Ward          string        `yaml:"ward" json:"ward"`
	Category      EventCategory `yaml:"category" json:"category"`
	Tier          int           `yaml:"tier" json:"tier"`
	Tags          []string      `yaml:"tags" json:"tags"`
	Delivery      Delivery      `yaml:"delivery" json:"delivery"`
	Prerequisites []string      `yaml:"prerequisites" json:"prerequisites"`
	FollowUps     []string      `yaml:"followUps" json:"followUps"`
	Related       []string      `yaml:"related" json:"related"`
	Scenarios     []string      `yaml:"scenarios" json:"scenarios"` // scenario IDs
}

// Step is one node in a scenario: dialogue / quiz / effect / branch.
// Payload shape depends on Type (validated by client + seeder); Effects are
// declarative directives the client effect-registry interprets.
type Step struct {
	ID      string         `yaml:"id" json:"id"`
	Type    StepType       `yaml:"type" json:"type"`
	Payload map[string]any `yaml:"payload" json:"payload,omitempty"`
	Effects []Directive    `yaml:"effects" json:"effects,omitempty"`
	Next    string         `yaml:"next" json:"next,omitempty"`
}

type Directive struct {
	Type    EffectType     `yaml:"type" json:"type"`
	Payload map[string]any `yaml:"payload" json:"payload,omitempty"`
}

type Scenario struct {
	ID         string   `yaml:"id" json:"id"`
	Profession string   `yaml:"profession" json:"profession"`
	EventID    string   `yaml:"eventId" json:"eventId"`
	Title      string   `yaml:"title" json:"title"`
	Tagline    string   `yaml:"tagline" json:"tagline"`
	Goals      []string `yaml:"goals" json:"goals"`
	Guardrails []string `yaml:"guardrails" json:"guardrails"`
	KeyPhrases []string `yaml:"keyPhrases" json:"keyPhrases"`
	Steps      []Step   `yaml:"steps" json:"steps"`
}

type Quiz struct {
	ID         string `yaml:"id" json:"id"`
	Profession string `yaml:"profession" json:"profession"`
	Type       string `yaml:"type" json:"type"`
	Title      string `yaml:"title" json:"title"`
}

type Phrase struct {
	ID         string `yaml:"id" json:"id"`
	Profession string `yaml:"profession" json:"profession"`
	Ko         string `yaml:"ko" json:"ko"`
	En         string `yaml:"en" json:"en"`
	Note       string `yaml:"note" json:"note"`
	Tag        string `yaml:"tag" json:"tag"`
}

// Bundle is the full parsed content set (one per seed run).
type Bundle struct {
	Manifest    Manifest
	Departments []Department
	Interiors   []Interior
	Events      []Event
	Scenarios   []Scenario
	Quizzes     []Quiz
	Phrases     []Phrase
}

func set[T comparable](xs ...T) map[T]bool {
	m := make(map[T]bool, len(xs))
	for _, x := range xs {
		m[x] = true
	}
	return m
}
