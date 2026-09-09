package themed

import (
	"sort"
	"strings"
)

// ScenarioTag is the assembly input for one scenario, projected from the DB.
type ScenarioTag struct {
	ID, Title, Theme, CollabWith, Dept string
	Difficulty                         int // briefing.difficulty (1..3); clamped to [1,3]
}

// Step is one situation (or the 주제 시험 boss) inside a tier.
type Step struct {
	Kind       string // dlg | quiz | event | boss(주제 시험)
	Name       string
	ScenarioID string
}

// Tier is one difficulty rung inside a theme's curriculum.
type Tier struct {
	Difficulty int
	Steps      []Step
}

// Curriculum is one theme, assembled from the scenarios tagged with its key,
// ordered into difficulty tiers.
type Curriculum struct {
	Theme Theme
	Tiers []Tier
}

// stepName derives the step label from the scenario title, dropping a persona
// suffix after " · " or " — " (business-rules R19).
func stepName(title string) string {
	for _, sep := range []string{" · ", " — "} {
		if i := strings.Index(title, sep); i >= 0 {
			return title[:i]
		}
	}
	return title
}

// Assemble groups tags into one Curriculum per registry theme, ordered into
// difficulty tiers. It reads ONLY the explicit `Theme` tag (R7 — no proxy
// inference from acuity/difficulty). A tag whose Theme is empty or names a key
// absent from the registry is returned in orphans (the R3 "orphans == 0" gate
// lives in the caller/test, so P1 stays safe under empty tags).
func Assemble(themes []Theme, tags []ScenarioTag) (curricula []Curriculum, orphans []string) {
	known := make(map[string]Theme, len(themes))
	for _, th := range themes {
		known[th.Key] = th
	}
	byTheme := make(map[string][]ScenarioTag)
	for _, tg := range tags {
		if tg.Theme == "" {
			orphans = append(orphans, tg.ID)
			continue
		}
		if _, ok := known[tg.Theme]; !ok {
			orphans = append(orphans, tg.ID)
			continue
		}
		byTheme[tg.Theme] = append(byTheme[tg.Theme], tg)
	}
	// Themes in registry order (R22): sort a copy by Order then Key.
	ordered := append([]Theme(nil), themes...)
	sort.SliceStable(ordered, func(i, j int) bool {
		if ordered[i].Order != ordered[j].Order {
			return ordered[i].Order < ordered[j].Order
		}
		return ordered[i].Key < ordered[j].Key
	})
	for _, th := range ordered {
		group := byTheme[th.Key]
		if len(group) == 0 {
			continue // no tagged scenarios yet (safe under empty tags, P1 constraint)
		}
		curricula = append(curricula, Curriculum{Theme: th, Tiers: buildTiers(group, th.ExamOn())})
	}
	sort.Strings(orphans)
	return curricula, orphans
}

func buildTiers(group []ScenarioTag, exam bool) []Tier {
	byDiff := map[int][]ScenarioTag{}
	for _, tg := range group {
		d := tg.Difficulty
		if d < 1 {
			d = 1
		}
		if d > 3 {
			d = 3
		}
		byDiff[d] = append(byDiff[d], tg)
	}
	var tiers []Tier
	for d := 1; d <= 3; d++ {
		g := byDiff[d]
		if len(g) == 0 {
			continue
		}
		sort.Slice(g, func(i, j int) bool { return g[i].ID < g[j].ID })
		steps := make([]Step, 0, len(g))
		for _, tg := range g {
			steps = append(steps, Step{Kind: "dlg", Name: stepName(tg.Title), ScenarioID: tg.ID})
		}
		tiers = append(tiers, Tier{Difficulty: d, Steps: steps})
	}
	if exam && len(tiers) > 0 {
		li := len(tiers) - 1
		tiers[li].Steps = append(tiers[li].Steps, Step{Kind: "boss", Name: "주제 시험"})
	}
	return tiers
}
