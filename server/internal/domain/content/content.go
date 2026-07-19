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
	Collision   []Bounds    `yaml:"collision" json:"collision"` // blocked tile rectangles
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
	ID         string    `yaml:"id" json:"id"`
	Profession string    `yaml:"profession" json:"profession"`
	EventID    string    `yaml:"eventId" json:"eventId"`
	Title      string    `yaml:"title" json:"title"`
	Tagline    string    `yaml:"tagline" json:"tagline"`
	Persona    Persona   `yaml:"persona" json:"persona"`
	Goals      []string  `yaml:"goals" json:"goals"`
	Guardrails []string  `yaml:"guardrails" json:"guardrails"`
	KeyPhrases []string  `yaml:"keyPhrases" json:"keyPhrases"`
	Steps      []Step    `yaml:"steps" json:"steps"`
	Briefing   *Briefing `yaml:"briefing" json:"briefing,omitempty"` // pre-dialogue card (optional)
}

// Persona describes the AI's conversation character for realistic role-play.
// Injected into the dialogue system prompt (2-3). Authored as content.
// Sub/Hair/HairStyle are display-only (briefing portrait); they do NOT drive
// the AI — the system prompt uses Name/Role/AgeRange/Personality/Style/Mood.
type Persona struct {
	Name          string `yaml:"name" json:"name,omitempty"`
	Role          string `yaml:"role" json:"role,omitempty"`         // patient, doctor, surgeon, parent...
	AgeRange      string `yaml:"ageRange" json:"ageRange,omitempty"` // e.g. "60s"
	Personality   string `yaml:"personality" json:"personality,omitempty"`
	SpeakingStyle string `yaml:"speakingStyle" json:"speakingStyle,omitempty"`
	Mood          string `yaml:"mood" json:"mood,omitempty"`             // matches expression: pain, worried, panic...
	Sub           string `yaml:"sub" json:"sub,omitempty"`               // display, e.g. "67y / Female"
	Hair          string `yaml:"hair" json:"hair,omitempty"`             // portrait hair color, e.g. "#9A6B3F"
	HairStyle     string `yaml:"hairStyle" json:"hairStyle,omitempty"`   // portrait hair style, e.g. "bob"
}

// Briefing is the pre-dialogue scenario card (situation, difficulty, skills,
// rewards, entry requirements, dept chrome). Rendered by the briefing screen;
// optional so pre-briefing scenarios still load. Authored as content.
type Briefing struct {
	Dept       string   `yaml:"dept" json:"dept,omitempty"`           // "ER · TRAUMA BAY #4"
	DeptColor  string   `yaml:"deptColor" json:"deptColor,omitempty"` // "#DC2626"
	Brief      string   `yaml:"brief" json:"brief,omitempty"`         // SITUATION paragraph
	Difficulty int      `yaml:"difficulty" json:"difficulty,omitempty"` // 1..3
	TimeLabel  string   `yaml:"timeLabel" json:"timeLabel,omitempty"` // "약 5분"
	Skills     []string `yaml:"skills" json:"skills,omitempty"`
	Rewards    []Reward `yaml:"rewards" json:"rewards,omitempty"`
	Reqs       []Req    `yaml:"reqs" json:"reqs,omitempty"` // met computed client-side vs /me
	Tone       string   `yaml:"tone" json:"tone,omitempty"`
	Accent     string   `yaml:"accent" json:"accent,omitempty"`
}

type Reward struct {
	Icon  string `yaml:"icon" json:"icon"`
	Label string `yaml:"label" json:"label"`
	Value string `yaml:"value" json:"value"`
}

// Req is an entry requirement. Metric/Threshold let the client compute `met`
// against the user profile; Label is the display text.
type Req struct {
	Label     string `yaml:"label" json:"label"`
	Metric    string `yaml:"metric" json:"metric,omitempty"` // e.g. "level", "emergencyResponse"
	Threshold int    `yaml:"threshold" json:"threshold,omitempty"`
}

type Quiz struct {
	ID         string       `yaml:"id" json:"id"`
	Profession string       `yaml:"profession" json:"profession"`
	Type       string       `yaml:"type" json:"type"`
	Title      string       `yaml:"title" json:"title"`
	Content    *QuizContent `yaml:"content" json:"content,omitempty"` // playable payload (optional)
}

// QuizContent is the playable quiz payload. The active quiz `type` selects which
// fields matter; all are optional so any type loads. Shipped types:
//   - sentence_build: Template (`__` blanks) + Answers (per blank) + WordBank
//   - match_pairs:    Pairs (left↔right term matching)
//   - listen:         AudioText (the spoken line) + Choices (pick the correct one)
//   - sbar:           Cards (order them into the S-B-A-R sequence)
type QuizContent struct {
	Sub      string   `yaml:"sub" json:"sub,omitempty"`
	Zone     string   `yaml:"zone" json:"zone,omitempty"`
	Context  string   `yaml:"context" json:"context,omitempty"`
	Hint     string   `yaml:"hint" json:"hint,omitempty"`
	Template string   `yaml:"template" json:"template,omitempty"` // sentence_build: blanks marked with `__`
	Answers  []string `yaml:"answers" json:"answers,omitempty"`
	WordBank []string `yaml:"wordBank" json:"wordBank,omitempty"`

	Pairs     []QuizPair   `yaml:"pairs" json:"pairs,omitempty"`         // match_pairs
	AudioText string       `yaml:"audioText" json:"audioText,omitempty"` // listen: the spoken line (TTS/reference)
	Choices   []QuizChoice `yaml:"choices" json:"choices,omitempty"`     // listen + mcq
	Cards     []QuizCard   `yaml:"cards" json:"cards,omitempty"`         // sbar (order by `order`)

	Scene    string        `yaml:"scene" json:"scene,omitempty"`   // mcq: scenario prompt
	Note     string        `yaml:"note" json:"note,omitempty"`     // mcq/check/spot_error: explanation
	Items    []QuizItem    `yaml:"items" json:"items,omitempty"`   // check: select-all-that-apply
	Device   string        `yaml:"device" json:"device,omitempty"` // monitor/gauge: device name
	Readings []QuizReading `yaml:"readings" json:"readings,omitempty"` // monitor
	Bank     []string      `yaml:"bank" json:"bank,omitempty"`     // monitor: label bank

	Given      []QuizGiven `yaml:"given" json:"given,omitempty"`           // calc: given facts
	Eq         string      `yaml:"eq" json:"eq,omitempty"`                 // calc: shown equation
	Answer     string      `yaml:"answer" json:"answer,omitempty"`         // calc: correct numeric answer
	AnswerUnit string      `yaml:"answerUnit" json:"answerUnit,omitempty"` // calc: unit label

	Pool    []string     `yaml:"pool" json:"pool,omitempty"`       // sort: chips to categorize
	Buckets []QuizBucket `yaml:"buckets" json:"buckets,omitempty"` // sort: target buckets

	Gauge *QuizGauge `yaml:"gauge" json:"gauge,omitempty"` // gauge: stepper to a target

	Rows []QuizErrorRow `yaml:"rows" json:"rows,omitempty"` // spot_error: find the wrong row
}

// QuizGiven — a labeled fact in a calc quiz (e.g. "Weight" → "20 kg").
type QuizGiven struct {
	Label string `yaml:"label" json:"label"`
	Value string `yaml:"value" json:"value"`
}

// QuizBucket — a sort target; Items lists the chips that belong here.
type QuizBucket struct {
	Name  string   `yaml:"name" json:"name"`
	Color string   `yaml:"color" json:"color,omitempty"`
	Items []string `yaml:"items" json:"items"`
}

// QuizGauge — a value the learner steps to a target (e.g. incubator temp).
type QuizGauge struct {
	Min    float64 `yaml:"min" json:"min"`
	Max    float64 `yaml:"max" json:"max"`
	Start  float64 `yaml:"start" json:"start"`
	Target float64 `yaml:"target" json:"target"`
	Step   float64 `yaml:"step" json:"step"`
	Unit   string  `yaml:"unit" json:"unit,omitempty"`
}

// QuizErrorRow — a row in a spot_error order sheet; exactly one has Error true.
type QuizErrorRow struct {
	Label string `yaml:"label" json:"label"`
	Text  string `yaml:"text" json:"text"`
	Error bool   `yaml:"error" json:"error,omitempty"`
}

// QuizItem — a checklist row (check quiz); Correct marks the ones to select.
type QuizItem struct {
	Text    string `yaml:"text" json:"text"`
	Ko      string `yaml:"ko" json:"ko,omitempty"`
	Correct bool   `yaml:"correct" json:"correct,omitempty"`
}

// QuizReading — one device reading (monitor quiz); Label is the correct name to
// assign from Bank.
type QuizReading struct {
	Num   string `yaml:"num" json:"num"`
	Unit  string `yaml:"unit" json:"unit,omitempty"`
	Color string `yaml:"color" json:"color,omitempty"`
	Label string `yaml:"label" json:"label"`
}

// QuizPair — one left↔right match (e.g. "throbbing" ↔ "욱신거리는" 💢).
type QuizPair struct {
	Left     string `yaml:"left" json:"left"`
	LeftSub  string `yaml:"leftSub" json:"leftSub,omitempty"` // e.g. IPA
	Right    string `yaml:"right" json:"right"`
	RightIcon string `yaml:"rightIcon" json:"rightIcon,omitempty"`
}

// QuizChoice — a listening-dictation or MCQ option; exactly one has Correct true.
// Tags are shown for listen; Ko is a Korean subtitle shown for mcq.
type QuizChoice struct {
	Text    string   `yaml:"text" json:"text"`
	Ko      string   `yaml:"ko" json:"ko,omitempty"`
	Tags    []string `yaml:"tags" json:"tags,omitempty"`
	Correct bool     `yaml:"correct" json:"correct,omitempty"`
}

// QuizCard — an SBAR handoff line; Track is S|B|A|R, Order is its 1-based place.
type QuizCard struct {
	Text  string `yaml:"text" json:"text"`
	Track string `yaml:"track" json:"track"`
	Order int    `yaml:"order" json:"order"`
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
