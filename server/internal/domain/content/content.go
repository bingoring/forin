// Package content holds the authored-content domain model — the schema that
// content files conform to and the runtime serves. Pure types + allowed sets.
//
// Variable/extensible parts (step payloads, effect directives, branches) are kept
// as raw JSON so new step/effect types need only a client handler + an allowed-set
// entry here — never a schema migration.
package content

import "github.com/bingoring/forin/server/internal/domain/access"

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
	ID    string `yaml:"id" json:"id"`
	Name  string `yaml:"name" json:"name"`
	Sub   string `yaml:"sub" json:"sub"`
	Icon  string `yaml:"icon" json:"icon"`
	Color string `yaml:"color" json:"color"`
	X     int    `yaml:"x" json:"x"`
	Y     int    `yaml:"y" json:"y"`
	// Locked is a permanent "never enterable" flag (scenery). For a door that
	// EARNED progress should open, use Requires instead — that's what turns a
	// reward into a key rather than a scoreboard entry.
	Locked   bool                 `yaml:"locked" json:"locked"`
	Requires []access.Requirement `yaml:"requires" json:"requires,omitempty"`
}

type MapObject struct {
	ID    string         `yaml:"id" json:"id"`
	Type  string         `yaml:"type" json:"type"`
	X     int            `yaml:"x" json:"x"`
	Y     int            `yaml:"y" json:"y"`
	Props map[string]any `yaml:"props" json:"props,omitempty"`
}

type Hotspot struct {
	ID         string               `yaml:"id" json:"id"`
	Kind       string               `yaml:"kind" json:"kind"` // quest|urgent|info
	X          int                  `yaml:"x" json:"x"`
	Y          int                  `yaml:"y" json:"y"`
	Label      string               `yaml:"label" json:"label"`
	ScenarioID string               `yaml:"scenarioId" json:"scenarioId"`
	Requires   []access.Requirement `yaml:"requires" json:"requires,omitempty"`
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
	Persona    Persona  `yaml:"persona" json:"persona"`
	Goals      []string `yaml:"goals" json:"goals"`
	Guardrails []string `yaml:"guardrails" json:"guardrails"`
	KeyPhrases []string `yaml:"keyPhrases" json:"keyPhrases"`
	// Acuity drives which reputation dimension a clear moves. Declared by the
	// scenario, NOT inferred from a department: wards, theatres and pharmacies all
	// produce emergencies, and department vocabulary doesn't survive a new
	// profession. Empty = routine (see domain/reputation.NormalizeAcuity).
	Acuity   string    `yaml:"acuity,omitempty" json:"acuity,omitempty"`
	Steps    []Step    `yaml:"steps" json:"steps"`
	Briefing *Briefing `yaml:"briefing" json:"briefing,omitempty"` // pre-dialogue card (optional)
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
	Mood          string `yaml:"mood" json:"mood,omitempty"` // matches expression: pain, worried, panic...
	Sub           string `yaml:"sub" json:"sub,omitempty"`   // display, e.g. "67y / Female"
	// Gender is optional and exists for VOICE selection, not display: "male" |
	// "female". Most authored personas leave it empty (30 of 300 hint at it only
	// inside the display `sub` string), so speech falls back to role — filling
	// this in is what makes an individual character sound right.
	Gender    string `yaml:"gender" json:"gender,omitempty"`
	Hair      string `yaml:"hair" json:"hair,omitempty"`           // portrait hair color, e.g. "#9A6B3F"
	HairStyle string `yaml:"hairStyle" json:"hairStyle,omitempty"` // portrait hair style, e.g. "bob"
}

// Briefing is the pre-dialogue scenario card (situation, difficulty, skills,
// rewards, entry requirements, dept chrome). Rendered by the briefing screen;
// optional so pre-briefing scenarios still load. Authored as content.
type Briefing struct {
	Dept       string   `yaml:"dept" json:"dept,omitempty"`             // "ER · TRAUMA BAY #4"
	DeptColor  string   `yaml:"deptColor" json:"deptColor,omitempty"`   // "#DC2626"
	Brief      string   `yaml:"brief" json:"brief,omitempty"`           // SITUATION paragraph
	Difficulty int      `yaml:"difficulty" json:"difficulty,omitempty"` // 1..3
	TimeLabel  string   `yaml:"timeLabel" json:"timeLabel,omitempty"`   // "약 5분"
	Skills     []string `yaml:"skills" json:"skills,omitempty"`
	Rewards    []Reward `yaml:"rewards" json:"rewards,omitempty"`
	Reqs       []Req    `yaml:"reqs" json:"reqs,omitempty"` // met computed client-side vs /me
	Tone       string   `yaml:"tone" json:"tone,omitempty"`
	Accent     string   `yaml:"accent" json:"accent,omitempty"`

	// Dialogue quick-reference (QUICK INFO dock: 차트/약물/활력) and risky-choice
	// tagging (hint mode marks these key phrases as reputation-risky).
	Chart        *ScenarioChart `yaml:"chart" json:"chart,omitempty"`
	RiskyPhrases []string       `yaml:"riskyPhrases" json:"riskyPhrases,omitempty"`
}

// ScenarioChart — bedside quick-reference shown in the dialogue QUICK INFO dock.
type ScenarioChart struct {
	Vitals    []QuizVital `yaml:"vitals" json:"vitals,omitempty"`
	Meds      []string    `yaml:"meds" json:"meds,omitempty"`
	Allergies string      `yaml:"allergies" json:"allergies,omitempty"`
	Notes     string      `yaml:"notes" json:"notes,omitempty"`
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

// DeptSituation is one department-scoped scenario card (v19 campus dept sheet):
// a scenario in a department with its learner-facing labels + cleared state.
type DeptSituation struct {
	ScenarioID string `json:"scenarioId"`
	Name       string `json:"name"`
	Room       string `json:"room,omitempty"`
	Lv         string `json:"lv"`
	Min        int    `json:"min"`
	Tag        string `json:"tag"`    // 완료 | 긴급 | 신규
	Urgent     bool   `json:"urgent"` // high difficulty
}

// RouteNode is one step of the main-route curriculum graph for a user: an event
// with its unlock state derived from prerequisites + what the user has cleared.
type RouteNode struct {
	EventID       string   `json:"eventId"`
	Title         string   `json:"title"`
	Tier          int      `json:"tier"`
	State         string   `json:"state"`                // locked | available | completed
	ScenarioID    string   `json:"scenarioId,omitempty"` // entry scenario to launch
	Prerequisites []string `json:"prerequisites,omitempty"`
}

// BoardCard is a compact scenario entry for the daily situation board — enough
// to render a card and fast-travel to the scenario briefing.
type BoardCard struct {
	ID         string   `json:"id"`
	Dept       string   `json:"dept"` // dept code from the id (ER, LD, ONCO...)
	Title      string   `json:"title"`
	Tagline    string   `json:"tagline"`
	Urgency    string   `json:"urgency"` // urgent | quest | info (from difficulty)
	DeptColor  string   `json:"deptColor"`
	Difficulty int      `json:"difficulty,omitempty"` // 1..3
	Room       string   `json:"room,omitempty"`       // briefing dept label (e.g. "ER · TRAUMA BAY #4")
	NpcName    string   `json:"npcName,omitempty"`
	NpcSub     string   `json:"npcSub,omitempty"`
	Skills     []string `json:"skills,omitempty"`
	TimeLabel  string   `json:"timeLabel,omitempty"`
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

	Scene    string        `yaml:"scene" json:"scene,omitempty"`       // mcq: scenario prompt
	Note     string        `yaml:"note" json:"note,omitempty"`         // mcq/check/spot_error: explanation
	Items    []QuizItem    `yaml:"items" json:"items,omitempty"`       // check: select-all-that-apply
	Device   string        `yaml:"device" json:"device,omitempty"`     // monitor/gauge: device name
	Readings []QuizReading `yaml:"readings" json:"readings,omitempty"` // monitor
	Bank     []string      `yaml:"bank" json:"bank,omitempty"`         // monitor: label bank

	Given      []QuizGiven `yaml:"given" json:"given,omitempty"`           // calc: given facts
	Eq         string      `yaml:"eq" json:"eq,omitempty"`                 // calc: shown equation
	Answer     string      `yaml:"answer" json:"answer,omitempty"`         // calc: correct numeric answer
	AnswerUnit string      `yaml:"answerUnit" json:"answerUnit,omitempty"` // calc: unit label

	Pool    []string     `yaml:"pool" json:"pool,omitempty"`       // sort: chips to categorize
	Buckets []QuizBucket `yaml:"buckets" json:"buckets,omitempty"` // sort: target buckets

	Gauge *QuizGauge `yaml:"gauge" json:"gauge,omitempty"` // gauge: stepper to a target

	Rows []QuizErrorRow `yaml:"rows" json:"rows,omitempty"` // spot_error: find the wrong row

	Deck []QuizDeckCard `yaml:"deck" json:"deck,omitempty"` // abbr: flashcard deck (one MCQ per card)
	// dialogue_order reuses Cards (Track = speaker, Order = turn number).

	// triage (ESI decision): a patient case + the correct ESI level (1-5) + reasoning.
	Patient      *QuizPatient `yaml:"patient" json:"patient,omitempty"`
	CorrectLevel int          `yaml:"correctLevel" json:"correctLevel,omitempty"`
	Reasoning    []QuizReason `yaml:"reasoning" json:"reasoning,omitempty"`

	// calc (dosage): a full order card, the on-hand vial, and the D/H×Q worksheet.
	Order       *QuizOrder `yaml:"order" json:"order,omitempty"`
	Vial        *QuizVial  `yaml:"vial" json:"vial,omitempty"`
	Desired     string     `yaml:"desired" json:"desired,omitempty"`         // D (numerator)
	OnHand      string     `yaml:"onHand" json:"onHand,omitempty"`           // H (denominator)
	PerQty      string     `yaml:"perQty" json:"perQty,omitempty"`           // Q (e.g. "1 mL")
	DhqUnit     string     `yaml:"dhqUnit" json:"dhqUnit,omitempty"`         // shared D/H unit (e.g. "units")
	SyringeMax  float64    `yaml:"syringeMax" json:"syringeMax,omitempty"`   // syringe scale max (default 1.0 mL)
	SecondCheck string     `yaml:"secondCheck" json:"secondCheck,omitempty"` // "2nd check by" name

	// listen (waveform): clip duration + an abbreviation glossary.
	Duration string      `yaml:"duration" json:"duration,omitempty"` // e.g. "0:08"
	Glossary []QuizGloss `yaml:"glossary" json:"glossary,omitempty"`

	// anatomy (body labeling): dots placed on the patient body diagram, each with
	// its correct body-part label. `bank` (above) supplies the draggable labels
	// (the dot labels + distractors).
	BodyDots []QuizBodyDot `yaml:"bodyDots" json:"bodyDots,omitempty"`
}

// QuizBodyDot — a labelable point on the patient body diagram (anatomy quiz).
// X/Y are percentages (0..100) of the body card; Label is the correct body part.
type QuizBodyDot struct {
	X     float64 `yaml:"x" json:"x"`
	Y     float64 `yaml:"y" json:"y"`
	Label string  `yaml:"label" json:"label"`
}

// QuizPatient — a triage patient case: demographics, chief complaint, vitals, observations.
type QuizPatient struct {
	Age     string      `yaml:"age" json:"age,omitempty"`
	Sex     string      `yaml:"sex" json:"sex,omitempty"`
	Arrival string      `yaml:"arrival" json:"arrival,omitempty"`
	CC      string      `yaml:"cc" json:"cc,omitempty"`
	Vitals  []QuizVital `yaml:"vitals" json:"vitals,omitempty"`
	Obs     []QuizObs   `yaml:"obs" json:"obs,omitempty"`
}

// QuizVital — one vital sign; Warn marks an abnormal (red) value.
type QuizVital struct {
	Label string `yaml:"label" json:"label"`
	Value string `yaml:"value" json:"value"`
	Unit  string `yaml:"unit" json:"unit,omitempty"`
	Warn  bool   `yaml:"warn" json:"warn,omitempty"`
}

// QuizObs — an observation tag; Warn marks a red (concerning) tag.
type QuizObs struct {
	Text string `yaml:"text" json:"text"`
	Warn bool   `yaml:"warn" json:"warn,omitempty"`
}

// QuizReason — a line in the triage reasoning panel. Kind: ok|bad|note.
type QuizReason struct {
	Kind string `yaml:"kind" json:"kind"`
	Text string `yaml:"text" json:"text"`
}

// QuizOrder — a prescription order card (calc quiz).
type QuizOrder struct {
	ID         string `yaml:"id" json:"id,omitempty"`
	Prescriber string `yaml:"prescriber" json:"prescriber,omitempty"`
	Time       string `yaml:"time" json:"time,omitempty"`
	Patient    string `yaml:"patient" json:"patient,omitempty"`
	Drug       string `yaml:"drug" json:"drug,omitempty"` // highlighted order line
}

// QuizVial — the on-hand medication vial (calc quiz).
type QuizVial struct {
	Drug          string `yaml:"drug" json:"drug,omitempty"`
	Concentration string `yaml:"concentration" json:"concentration,omitempty"`
	Size          string `yaml:"size" json:"size,omitempty"`
}

// QuizGloss — one abbreviation → meaning entry (listen glossary).
type QuizGloss struct {
	Abbr    string `yaml:"abbr" json:"abbr"`
	Meaning string `yaml:"meaning" json:"meaning"`
}

// QuizDeckCard — one abbreviation flashcard: expand Term, pick Answer from Options.
type QuizDeckCard struct {
	Term    string   `yaml:"term" json:"term"`
	Options []string `yaml:"options" json:"options"`
	Answer  string   `yaml:"answer" json:"answer"`
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
	Left      string `yaml:"left" json:"left"`
	LeftSub   string `yaml:"leftSub" json:"leftSub,omitempty"` // e.g. IPA
	Right     string `yaml:"right" json:"right"`
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
