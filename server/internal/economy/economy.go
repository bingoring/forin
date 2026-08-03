// Package economy is the single source of truth for tunable game-economy numbers
// (XP, ranks, reputation, spaced-repetition, daily pool, rewarded-ad top-up).
// Pure values, no infrastructure — the domain and adapters read `economy.Active`
// so balance can be tuned in one place (and, later, overridden at startup) rather
// than sprinkled as magic numbers. Mirrored to the client via GET /config/economy.
package economy

// Economy holds every balance knob. Grouped by concern.
type Economy struct {
	XPPerLevel     int `json:"xpPerLevel"`     // XP for one level (level = 1 + xp/XPPerLevel)
	ScenarioBaseXP int `json:"scenarioBaseXP"` // default XP for clearing a scenario

	// Scenario grading (AI-judged completion). A scenario is "cleared" (완료) only
	// when the graded score ≥ ScenarioPassScore; below that it's an engaged attempt
	// (재도전) that still earns score-scaled XP + streak but no clear/스티커.
	ScenarioPassScore int `json:"scenarioPassScore"` // 0..100 pass threshold
	ScenarioMinXP     int `json:"scenarioMinXP"`     // XP floor for a genuine attempt (score>0)

	// Rank thresholds (level → career title).
	RankJunior int `json:"rankJunior"`
	RankSenior int `json:"rankSenior"`
	RankHead   int `json:"rankHead"`

	// Reputation (0..100).
	ReputationDefault int `json:"reputationDefault"` // starting value per dimension
	RepBandWarm       int `json:"repBandWarm"`       // ≥ → NPC noticeably warm
	RepBandCordial    int `json:"repBandCordial"`    // ≥ → neutral/cordial
	RepBandWary       int `json:"repBandWary"`        // ≥ → slightly wary; below → guarded
	TitleWarmthBonus  int `json:"titleWarmthBonus"`  // equipped "warm" title nudge

	// Spaced repetition (SM-2).
	EaseDefault    float64 `json:"easeDefault"`
	EaseFloor      float64 `json:"easeFloor"`
	FirstInterval  int     `json:"firstInterval"`  // days, reps 0 → 1
	SecondInterval int     `json:"secondInterval"` // days, reps 1 → 2
	MasteryCap     int     `json:"masteryCap"`     // mastery pips ceiling

	// Daily situation pool.
	DailyPoolSize      int     `json:"dailyPoolSize"`
	DailyDeptCap       int     `json:"dailyDeptCap"`       // max scenarios per dept in a day's set
	DailyClearedWeight float64 `json:"dailyClearedWeight"` // weight multiplier for already-cleared
	DailyOffBandWeight float64 `json:"dailyOffBandWeight"` // weight multiplier for off-level difficulty

	// Rewarded-ad top-up.
	TopUpAdd int `json:"topUpAdd"` // scenarios added per rewarded-ad view
	TopUpCap int `json:"topUpCap"` // rewarded top-ups allowed per local day
}

// Default returns the launch balance. Tune here (or, later, override at startup).
func Default() Economy {
	return Economy{
		XPPerLevel:     100,
		ScenarioBaseXP: 100,

		ScenarioPassScore: 60,
		ScenarioMinXP:     10,

		RankJunior: 5,
		RankSenior: 15,
		RankHead:   30,

		ReputationDefault: 50,
		RepBandWarm:       75,
		RepBandCordial:    50,
		RepBandWary:       25,
		TitleWarmthBonus:  15,

		EaseDefault:    2.5,
		EaseFloor:      1.3,
		FirstInterval:  1,
		SecondInterval: 6,
		MasteryCap:     3,

		DailyPoolSize:      12,
		DailyDeptCap:       2,
		DailyClearedWeight: 0.25,
		DailyOffBandWeight: 0.5,

		TopUpAdd: 3,
		TopUpCap: 3,
	}
}

// Active is the economy in effect. Overridable once at startup (e.g. from env)
// before serving; read-only thereafter.
var Active = Default()
