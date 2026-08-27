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
	// The curriculum is derived from the same banks, so a new department extends
	// the learning path without anyone remembering to edit a catalog.
	const curriculumOut = "internal/curriculum/catalog_gen.go"
	uncovered, err := generateCurriculum(curriculumOut)
	if err != nil {
		fmt.Fprintf(os.Stderr, "curriculum: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("  %-10s %3d departments need the fallback → %s\n", "CURRICULUM", uncovered, curriculumOut)
	fmt.Printf("done: %d scenarios · %d events · %d quizzes across %d departments\n", totalScn, totalEvt, totalQz, len(Depts))
}

// generateDept expands a department's topic bank into `target` scenarios (topic ×
// patient variant × difficulty spread) grouped into ~13-scenario events.
func generateDept(deptIdx int, d Dept, target int) ([]content.Scenario, []content.Event) {
	scns := make([]content.Scenario, 0, target)
	nt := len(d.Topics)
	// k is read as a MIXED-RADIX number — topic, then persona, then difficulty — so the
	// three axes actually multiply.
	//
	// They used to be three functions of k directly: topic k%nt, persona k, difficulty
	// k%3. Whenever nt was a multiple of the persona pool and of 3 — NICU has 30 topics
	// and 6 parent personas — all three returned to their starting value together every
	// nt scenarios. The result was the same topic, the same patient and the same
	// difficulty over again, differing only in the persona's mood word: 387 titles
	// duplicated across 1,050 of 3,203 scenarios, a third of the bank. Axes driven by one
	// counter do not multiply, they move in lockstep.
	// How many distinct scenarios this department's banks can actually express: each topic
	// can be put to each patient its role can draw from, once.
	//
	// Generating past that is where the duplicates came from. Asking for 100 when the banks
	// hold 60 does not produce 100 scenarios; it produces 60 and then says 40 of them
	// twice. Difficulty was supposed to be the third axis but clampDiff collapses it at the
	// ends, so "the same thing, harder" was frequently the same thing. A bank is as deep as
	// its content, and the honest answer to "how many" is however many there are.
	pairs := 0
	deepestPool := 0
	for _, t := range d.Topics {
		l := personaPoolLen(t.Role)
		pairs += l
		if l > deepestPool {
			deepestPool = l
		}
	}
	limit := target
	if pairs < limit {
		limit = pairs
	}

	// k reads as a mixed-radix number: topic first, then which patient. They used to be two
	// functions of k directly — topic k%nt, persona k — so whenever nt was a multiple of the
	// pool size (NICU: 10 topics, 6 parent personas) both returned to their starting values
	// together and the same topic met the same patient again, differing only in a mood word.
	// 387 titles were duplicated across 1,050 of 3,203 scenarios, a third of the bank. Axes
	// driven by one counter do not multiply; they move in lockstep.
	for k := 0; len(scns) < limit && k < nt*deepestPool; k++ {
		t := d.Topics[k%nt]
		pass := k / nt // how many times the topic list has been walked
		variant := pass
		if pass >= personaPoolLen(t.Role) {
			continue // this topic has met everyone its role can draw from
		}
		p := personaFor(t.Role, deptIdx, pass)
		// Spread around the topic's own difficulty. Safe to vary freely now: the pair above
		// is already unique, so this is texture rather than the thing keeping them apart.
		diff := clampDiff(t.Diff + (pass%3 - 1))
		mins := 4 + diff + (k % 3)
		// Numbered by POSITION, not by k.
		//
		// k now skips topics whose patients are used up, so k and the position in scns
		// diverge. Both the id and the event id were derived from k, and the events below
		// are grouped by position — so a skipped k pointed a scenario at an event that was
		// never created. Validate caught it as an unknown eventId; the invariant is simply
		// that the Nth scenario belongs to the (N/eventSize)th event, so N is what to use.
		idx := len(scns)
		id := fmt.Sprintf("SCN-%s-%05d", d.Code, idStart+idx)
		scns = append(scns, content.Scenario{
			ID:      id,
			EventID: fmt.Sprintf("EVT-%s-%05d", d.Code, idStart+(idx/eventSize)),
			Title:   t.Title + " · " + p.Name,
			Tagline: t.Tagline,
			Persona: content.Persona{
				Name: p.Name, Role: t.Role, AgeRange: p.Age, Sub: p.Sub, Hair: p.Hair, HairStyle: p.HairStyle,
				Personality:   moodPersonality[t.Mood()],
				SpeakingStyle: moodSpeaking[t.Mood()],
				Mood:          moodForVariant(t, variant),
			},
			Goals:      content.ComposeGoals(t.Role, t.Goals),
			Guardrails: orDefault(t.Guard, defaultGuard),
			KeyPhrases: t.Phrases,
			Acuity:     t.acuityOf(),
			Briefing: &content.Briefing{
				Dept: d.Label + " · " + t.Room, DeptColor: d.Color, Brief: t.Brief, Difficulty: diff,
				TimeLabel: fmt.Sprintf("약 %d분", mins), Skills: t.Skills,
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
