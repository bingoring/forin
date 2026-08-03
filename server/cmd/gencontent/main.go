// Command gencontent expands curated per-department clinical topic banks into a
// large, varied, extensible scenario/event set (≥ target per department) so a
// nurse can study a single department in depth. Dialogue is AI-runtime (driven by
// persona + goals), so a "scenario" = a distinct clinical situation with a persona
// and learning goals; volume comes from topic × patient-persona × difficulty.
//
// Output: one YAML list-file per department under content/nurse/{scenarios,events}
// (gen-<dept>.yaml), loaded alongside the hand-authored single-item files. Ids are
// numbered from 00101 to never collide with hand-authored 00001–000xx.
//
//	usage: go run ./cmd/gencontent [--target 100] [--out ./content/nurse]
package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"

	"github.com/bingoring/forin/server/internal/domain/content"
)

const idStart = 101 // generated ids begin here (hand-authored use 1..~15)

func main() {
	target := flag.Int("target", 100, "generated scenarios per department")
	out := flag.String("out", "content/nurse", "content root for the nurse profession")
	flag.Parse()

	scenDir := filepath.Join(*out, "scenarios")
	evtDir := filepath.Join(*out, "events")
	quizDir := filepath.Join(*out, "quizzes")
	for _, dir := range []string{scenDir, evtDir, quizDir} {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			fail(err)
		}
	}

	pool := buildPhrasePool()
	totalScn, totalEvt, totalQz := 0, 0, 0
	for di, d := range Depts {
		scns, evts := generateDept(di, d, *target)
		qzs := generateQuizzes(di, d, pool)
		writeYAML(filepath.Join(scenDir, "gen-"+lower(d.Code)+".yaml"), scns)
		writeYAML(filepath.Join(evtDir, "gen-"+lower(d.Code)+".yaml"), evts)
		writeYAML(filepath.Join(quizDir, "gen-"+lower(d.Code)+".yaml"), qzs)
		totalScn += len(scns)
		totalEvt += len(evts)
		totalQz += len(qzs)
		fmt.Printf("  %-10s %3d scenarios · %d events · %d quizzes\n", d.Code, len(scns), len(evts), len(qzs))
	}
	fmt.Printf("done: %d scenarios · %d events · %d quizzes across %d departments\n", totalScn, totalEvt, totalQz, len(Depts))
}

// generateDept expands a department's topic bank into `target` scenarios (topic ×
// patient variant × difficulty spread) grouped into ~13-scenario events.
func generateDept(deptIdx int, d Dept, target int) ([]content.Scenario, []content.Event) {
	scns := make([]content.Scenario, 0, target)
	nt := len(d.Topics)
	for k := 0; len(scns) < target; k++ {
		t := d.Topics[k%nt]
		variant := k / nt
		p := personaFor(t.Role, deptIdx, k)
		diff := clampDiff(t.Diff + (k%3 - 1)) // spread 1..3 around the topic base
		mins := 4 + diff + (k % 3)
		n := idStart + k
		id := fmt.Sprintf("SCN-%s-%05d", d.Code, n)
		scns = append(scns, content.Scenario{
			ID:      id,
			EventID: fmt.Sprintf("EVT-%s-%05d", d.Code, idStart+(k/eventSize)),
			Title:   t.Title + " · " + p.Name,
			Tagline: t.Tagline,
			Persona: content.Persona{
				Name: p.Name, Role: t.Role, AgeRange: p.Age, Sub: p.Sub, Hair: p.Hair, HairStyle: p.HairStyle,
				Personality:   moodPersonality[t.Mood()],
				SpeakingStyle: moodSpeaking[t.Mood()],
				Mood:          moodForVariant(t, variant),
			},
			Goals:      t.Goals,
			Guardrails: orDefault(t.Guard, defaultGuard),
			KeyPhrases: t.Phrases,
			Briefing: &content.Briefing{
				Dept: d.Label + " · " + t.Room, DeptColor: d.Color, Brief: t.Brief, Difficulty: diff,
				TimeLabel: fmt.Sprintf("약 %d분", mins), Skills: t.Skills,
				Rewards: []content.Reward{
					{Icon: "⭐", Label: "경험치", Value: fmt.Sprintf("+ %d XP", 100+diff*20)},
					{Icon: "❤", Label: "환자 만족도", Value: fmt.Sprintf("+ %d", diff+2)},
					{Icon: "🎖", Label: "진척", Value: "+ 1"},
				},
				Reqs:   []content.Req{{Label: fmt.Sprintf("레벨 %d+", diff*2), Metric: "level", Threshold: diff * 2}},
				Tone:   d.Tone, Accent: d.Accent,
			},
		})
	}

	// Group into events. Tier cycles 1..4; the first event of each dept is `both`
	// (main-route candidate), the rest daily_pool. `related` links to the next
	// department's first event for cross-department extensibility.
	evts := make([]content.Event, 0, (len(scns)+eventSize-1)/eventSize)
	for j := 0; j*eventSize < len(scns); j++ {
		lo := j * eventSize
		hi := lo + eventSize
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
		if j > 0 { // chain within the department for a progression spine
			e.Prerequisites = []string{fmt.Sprintf("EVT-%s-%05d", d.Code, idStart+j-1)}
		}
		evts = append(evts, e)
	}
	return scns, evts
}

const eventSize = 13

func clampDiff(d int) int {
	if d < 1 {
		return 1
	}
	if d > 3 {
		return 3
	}
	return d
}

func orDefault(v, def []string) []string {
	if len(v) == 0 {
		return def
	}
	return v
}

var defaultGuard = []string{"환자를 배려하며 명확히 소통", "의학용어 과용 금지"}

func lower(s string) string {
	b := []byte(s)
	for i := range b {
		if b[i] >= 'A' && b[i] <= 'Z' {
			b[i] += 'a' - 'A'
		}
	}
	return string(b)
}

func writeYAML(path string, v any) {
	data, err := yaml.Marshal(v)
	if err != nil {
		fail(err)
	}
	header := "# GENERATED by cmd/gencontent — do not hand-edit; regenerate to change.\n"
	if err := os.WriteFile(path, append([]byte(header), data...), 0o644); err != nil {
		fail(err)
	}
}

func fail(err error) {
	fmt.Fprintln(os.Stderr, "gencontent:", err)
	os.Exit(1)
}
