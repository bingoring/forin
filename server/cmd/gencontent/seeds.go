package main

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// Seed is one fully-authored distinct clinical situation (커리큘럼 v3 P2 model:
// D-P2-B). Unlike the legacy Topic — which the generator multiplied across
// personas and difficulties — one seed becomes exactly ONE canonical scenario.
// Persona variation is deferred to an optional-replay feature (D-P2-C), so it
// does not inflate the learning path.
//
// Seeds live in content/nurse/topics/<code>.yaml, authored (LLM-assisted, then
// clinically reviewed) rather than hand-written as Go literals — the only shape
// that scales to dozens of themes × 20~30 situations per department.
type Seed struct {
	Theme      string      `yaml:"theme"`      // themes.yaml key (required)
	CollabWith string      `yaml:"collabWith"` // partner dept, track=collab only
	Title      string      `yaml:"title"`
	Tagline    string      `yaml:"tagline"`
	Room       string      `yaml:"room"`
	Brief      string      `yaml:"brief"`
	Role       string      `yaml:"role"`
	Difficulty int         `yaml:"difficulty"` // 1..3
	Skills     []string    `yaml:"skills"`
	KeyPhrases []string    `yaml:"keyPhrases"`
	Goals      []string    `yaml:"goals"`
	Guardrails []string    `yaml:"guardrails"`
	Acuity     string      `yaml:"acuity"`
	Persona    SeedPersona `yaml:"persona"`
}

// SeedPersona is the patient/colleague character for one situation. Authored per
// seed so each distinct situation carries a distinct person.
type SeedPersona struct {
	Name          string `yaml:"name"`
	AgeRange      string `yaml:"ageRange"`
	Sub           string `yaml:"sub"`
	Mood          string `yaml:"mood"`
	Personality   string `yaml:"personality"`
	SpeakingStyle string `yaml:"speakingStyle"`
	Gender        string `yaml:"gender"`
	Hair          string `yaml:"hair"`
	HairStyle     string `yaml:"hairStyle"`
}

// loadSeeds reads content/nurse/topics/<code>.yaml. Returns (nil, nil) when the
// file is absent, so a department without seeds falls back to its Go topic bank
// during the transition.
func loadSeeds(dir, code string) ([]Seed, error) {
	path := filepath.Join(dir, "topics", lower(code)+".yaml")
	raw, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var seeds []Seed
	if err := yaml.Unmarshal(raw, &seeds); err != nil {
		return nil, fmt.Errorf("%s: %w", path, err)
	}
	return seeds, nil
}

// generateSeedScenarios emits exactly one scenario per seed (no persona/difficulty
// multiplication) plus events grouped like generateDept. IDs share the SCN-<CODE>-
// 00101+ namespace so the seed path and the legacy path never collide within a
// department (a department is one or the other, never both).
func generateSeedScenarios(deptIdx int, d Dept, seeds []Seed) ([]content.Scenario, []content.Event) {
	scns := make([]content.Scenario, 0, len(seeds))
	for i, s := range seeds {
		diff := clampDiff(s.Difficulty)
		mins := 4 + diff*2
		id := fmt.Sprintf("SCN-%s-%05d", d.Code, idStart+i)
		persona := content.Persona{
			Name: s.Persona.Name, Role: s.Role, AgeRange: s.Persona.AgeRange, Sub: s.Persona.Sub,
			Hair: s.Persona.Hair, HairStyle: s.Persona.HairStyle, Gender: s.Persona.Gender,
			Mood:          orStr(s.Persona.Mood, moodForRole(s.Role)),
			Personality:   orStr(s.Persona.Personality, moodPersonality[s.Persona.Mood]),
			SpeakingStyle: orStr(s.Persona.SpeakingStyle, moodSpeaking[s.Persona.Mood]),
		}
		scns = append(scns, content.Scenario{
			ID:         id,
			EventID:    fmt.Sprintf("EVT-%s-%05d", d.Code, idStart+(i/eventSize)),
			Title:      s.Title + " · " + s.Persona.Name,
			Tagline:    s.Tagline,
			Persona:    persona,
			Goals:      content.ComposeGoals(s.Role, s.Goals),
			Guardrails: orDefault(s.Guardrails, defaultGuard),
			KeyPhrases: s.KeyPhrases,
			Acuity:     s.Acuity,
			Theme:      s.Theme,
			CollabWith: s.CollabWith,
			Briefing: &content.Briefing{
				Dept: d.Label + " · " + s.Room, DeptColor: d.Color, Brief: s.Brief, Difficulty: diff,
				TimeLabel: fmt.Sprintf("약 %d분", mins), Skills: s.Skills,
				Rewards: []content.Reward{
					{Icon: "⭐", Label: "경험치", Value: fmt.Sprintf("+ %d XP", 100+diff*20)},
					{Icon: "❤", Label: "환자 만족도", Value: fmt.Sprintf("+ %d", diff+2)},
					{Icon: "🎖", Label: "진척", Value: "+ 1"},
				},
				Reqs: []content.Req{{Label: fmt.Sprintf("레벨 %d+", diff*2), Metric: "level", Threshold: diff * 2}},
				Tone: d.Tone, Accent: d.Accent,
			},
		})
	}
	return scns, eventsForScenarios(deptIdx, d, scns)
}

// eventsForScenarios groups scenarios into events of eventSize, identical in
// shape to generateDept's grouping (so the board/route logic is unchanged).
func eventsForScenarios(deptIdx int, d Dept, scns []content.Scenario) []content.Event {
	evts := make([]content.Event, 0, (len(scns)+eventSize-1)/eventSize)
	for j := 0; j*eventSize < len(scns); j++ {
		lo, hi := j*eventSize, j*eventSize+eventSize
		if hi > len(scns) {
			hi = len(scns)
		}
		ids := make([]string, 0, hi-lo)
		for _, s := range scns[lo:hi] {
			ids = append(ids, s.ID)
		}
		delivery := content.DeliveryDailyPool
		if j == 0 {
			delivery = content.DeliveryBoth
		}
		e := content.Event{
			ID: fmt.Sprintf("EVT-%s-%05d", d.Code, idStart+j), Title: fmt.Sprintf("%s 로테이션 %d", d.Name, j+1),
			Ward: lower(d.Code), Category: "clinical", Tier: 1 + j%4, Tags: []string{lower(d.Code)},
			Delivery: delivery, Scenarios: ids,
			Related: []string{fmt.Sprintf("EVT-%s-%05d", Depts[(deptIdx+1)%len(Depts)].Code, idStart)},
		}
		if j > 0 {
			e.Prerequisites = []string{fmt.Sprintf("EVT-%s-%05d", d.Code, idStart+j-1)}
		}
		evts = append(evts, e)
	}
	return evts
}

func orStr(v, def string) string {
	if v == "" {
		return def
	}
	return v
}

// moodForRole is the neutral default mood when a seed omits one.
func moodForRole(role string) string {
	switch role {
	case "patient":
		return "worried"
	case "family", "parent":
		return "worried"
	default:
		return "neutral"
	}
}
