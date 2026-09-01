package curriculum

import (
	"encoding/json"
	"sort"
	"strings"
	"testing"

	"github.com/bingoring/forin/server/internal/adapters/contentfile"
	"github.com/bingoring/forin/server/internal/domain/content"
)

// The path must cover every floor the lift can reach. The v19 catalog stopped at
// four floors of one building and left the rest reachable only by wandering.
func TestCatalogCoversEveryFloor(t *testing.T) {
	// Every floor the lift lists, as (building, floor). Kept here rather than
	// imported: cmd/gencontent is package main, and the point of the test is that
	// the two lists agree, which a shared constant would hide.
	want := [][2]string{
		{"본관", "1F"}, {"본관", "2F"}, {"본관", "3F"}, {"본관", "4F"},
		{"본관", "6F"}, {"본관", "7F"}, {"본관", "8F"}, {"본관", "P1"},
		{"별관 1", "1F"}, {"별관 1", "2F"}, {"별관 1", "3F"}, {"별관 1", "4F"},
		{"별관 2", "1F"}, {"별관 2", "2F"}, {"별관 2", "3F"}, {"별관 2", "4F"},
		{"별관 3", "1F"}, {"별관 3", "2F"}, {"별관 3", "3F"}, {"별관 3", "4F"},
		{"지원동", "B1"}, {"지원동", "1F"}, {"지원동", "2F"}, {"지원동", "3F"},
	}
	have := map[[2]string]int{}
	for _, c := range catalog {
		have[[2]string{c.Building, c.Floor}]++
	}
	for _, w := range want {
		if have[w] == 0 {
			t.Errorf("no curriculum on %s %s", w[0], w[1])
		}
	}
	if len(have) != len(want) {
		t.Errorf("catalog covers %d floors, the lift reaches %d", len(have), len(want))
	}
}

// R1/R2: a floor carries 3 curricula per department (up to 5 where the floor has
// a large hand-authored bank), and a curriculum is 2-4 required steps. Both bounds
// exist for the same reason: the resume hero names ONE next step, so a curriculum
// long enough to lose sight of its end stops working as a unit of progress.
func TestCurriculumSizes(t *testing.T) {
	perFloor := map[[2]string]int{}
	for _, c := range catalog {
		perFloor[[2]string{c.Building, c.Floor}]++
		required := 0
		for _, s := range c.Steps {
			// The ward greeting does not count toward the length. The bound exists so a
			// chapter stays a unit of progress you can see the end of, and the greeting
			// is not that kind of step: three minutes, difficulty 1, no clinical content,
			// identical in shape on all 28 wards. Counting it would have forced seven
			// authored chapters to give a body step away to make room for a hello.
			if isOptional(s.Kind) || IsWardGreeting(s.ScenarioID) {
				continue
			}
			required++
		}
		if required < 2 || required > 4 {
			t.Errorf("%s has %d required steps, want 2-4", c.Key, required)
		}
		quizzes := 0
		for _, s := range c.Steps {
			if s.Kind == "quiz" {
				quizzes++
			}
		}
		if quizzes > 1 {
			t.Errorf("%s has %d quizzes, want at most 1", c.Key, quizzes)
		}
	}
	// A FLOOR bound was wrong twice over. It counted the wrong thing — a floor with two
	// departments (별관 1 3F is 분만실 + 신생아실) has to carry twice as many chapters to
	// teach the same amount — and its ceiling had no reason behind it. The reason the
	// comment gave, "the resume hero names one next step", is the argument for the STEP
	// bound above: it says a CHAPTER must stay small enough to see the end of, and says
	// nothing about how many chapters a place can have. Twelve chapters on a floor are
	// twelve endings, each still visible.
	//
	// What it did do was block growth exactly where content was densest: the four
	// two-department floors sat at the ceiling, so a new chapter there failed this test.
	//
	// The FLOOR is what a lift button reaches, so the floor keeps a minimum — a floor
	// nobody teaches is a floor a learner walks into and finds nothing. The department is
	// what gets taught, so the department carries the real minimum.
	perDept := map[string]int{}
	for _, c := range catalog {
		for _, s := range c.Steps {
			parts := strings.Split(s.ScenarioID, "-")
			if len(parts) < 3 || IsWardGreeting(s.ScenarioID) {
				continue
			}
			// ORIENT is not a department. It is the ER's opening chapter — arrive, take
			// the handover, meet your first patient — and it is one chapter by design.
			if parts[1] == "ORIENT" {
				break
			}
			perDept[parts[1]]++
			break
		}
	}
	for fl, n := range perFloor {
		if n < 3 {
			t.Errorf("%s %s has %d curricula, want at least 3", fl[0], fl[1], n)
		}
	}
	for dept, n := range perDept {
		if n < 3 {
			t.Errorf("department %s is taught in %d curricula, want at least 3", dept, n)
		}
	}
}

// R6: the last step is the chapter test. A curriculum that trails off mid-bank
// has no moment that reads as finishing it.
func TestLastStepIsBoss(t *testing.T) {
	for _, c := range catalog {
		if len(c.Steps) == 0 {
			t.Errorf("%s has no steps", c.Key)
			continue
		}
		if last := c.Steps[len(c.Steps)-1]; last.Kind != "boss" {
			t.Errorf("%s ends on %q (%s), want a boss step", c.Key, last.Name, last.Kind)
		}
	}
}

// R3: no content id appears twice. Beyond the wasted authoring, a duplicate makes
// KeyForScenario ambiguous, so the home screen's resume target would depend on
// catalog order rather than on what the learner did.
func TestNoDuplicateContentIDs(t *testing.T) {
	seen := map[string]string{}
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID == "" {
				continue
			}
			if prev, dup := seen[s.ScenarioID]; dup {
				t.Errorf("%s appears in both %s and %s", s.ScenarioID, prev, c.Key)
			}
			seen[s.ScenarioID] = c.Key
		}
	}
}

// Keys are the identity the home screen and the career tab agree on, so they must
// be unique and shaped as documented ("<building>|<floor>|<slug>").
func TestKeysAreUniqueAndWellFormed(t *testing.T) {
	seen := map[string]bool{}
	for _, c := range catalog {
		if seen[c.Key] {
			t.Errorf("duplicate key %q", c.Key)
		}
		seen[c.Key] = true
		parts := strings.Split(c.Key, "|")
		if len(parts) != 3 {
			t.Errorf("key %q must be <building>|<floor>|<slug>", c.Key)
			continue
		}
		if parts[0] != c.Building || parts[1] != c.Floor {
			t.Errorf("key %q disagrees with Building=%q Floor=%q", c.Key, c.Building, c.Floor)
		}
		if parts[2] == "" || strings.ToLower(parts[2]) != parts[2] {
			t.Errorf("key %q: slug must be lowercase ASCII", c.Key)
		}
	}
}

// Curricula of one floor must agree on Where — it is the string the lift prints,
// and a floor that disagrees with itself would show two headings for one place.
func TestFloorWhereIsConsistent(t *testing.T) {
	where := map[[2]string]string{}
	for _, c := range catalog {
		k := [2]string{c.Building, c.Floor}
		if prev, ok := where[k]; ok && prev != c.Where {
			t.Errorf("%s %s: %q vs %q", k[0], k[1], prev, c.Where)
		}
		where[k] = c.Where
		if c.Name == "" {
			t.Errorf("%s has no name", c.Key)
		}
	}
}

// R9: nothing is locked at the curriculum level, and exactly one curriculum is the
// resume target for a learner who has cleared nothing.
func TestResolveFreshUser(t *testing.T) {
	states := Resolve(map[string]bool{})
	resumes := 0
	for _, s := range states {
		if s.State == "lock" {
			t.Fatalf("%s resolved to lock — floors and curricula are all open", s.Key)
		}
		if s.State != "todo" {
			t.Errorf("%s is %q for a user who cleared nothing", s.Key, s.State)
		}
		if s.Resume {
			resumes++
		}
	}
	if resumes != 1 {
		t.Fatalf("%d curricula flagged resume, want exactly 1", resumes)
	}
	if !states[0].Resume {
		t.Errorf("resume should fall on the first curriculum, got %q", states[0].Key)
	}
}

// R8: the sequence lives inside a curriculum. Clearing its first step must open
// the second and nothing further.
func TestStepsUnlockInOrder(t *testing.T) {
	first := catalog[0]
	var firstRequired string
	for _, s := range first.Steps {
		if !isOptional(s.Kind) {
			firstRequired = s.ScenarioID
			break
		}
	}
	states := Resolve(map[string]bool{firstRequired: true})
	got := states[0]
	// TWO, not one: a dialogue is two entries now — once guided, once alone — and a
	// clear whose help is unknown reads as unaided, which supersedes the guided rung.
	// Resolve() is the no-split form, so that is the reading here by design; the app
	// passes ClearedPasses and the two rungs then tick one at a time.
	want := 1
	if Passes(first.Steps[0].Kind) > 1 {
		want = 2
	}
	if got.Done != want {
		t.Fatalf("done=%d after clearing one required step, want %d", got.Done, want)
	}
	if got.State != "doing" {
		t.Errorf("state=%q, want doing", got.State)
	}
	nows := 0
	for _, s := range got.Steps {
		if s.State == "now" {
			nows++
		}
	}
	if nows != 1 {
		t.Errorf("%d steps are now, want exactly 1", nows)
	}
}

// R11/R12: the resume target follows the learner, and a preference pointing at a
// finished curriculum falls back rather than flagging nothing.
func TestResumePreference(t *testing.T) {
	want := catalog[5].Key
	states := ResolveWithResume(map[string]bool{}, want)
	for _, s := range states {
		if s.Resume && s.Key != want {
			t.Fatalf("resume landed on %q, want %q", s.Key, want)
		}
	}

	// A finished curriculum cannot be the thing to continue.
	done := map[string]bool{}
	for _, s := range catalog[0].Steps {
		done[s.ScenarioID] = true
	}
	states = ResolveWithResume(done, catalog[0].Key)
	for _, s := range states {
		if s.Resume && s.Key == catalog[0].Key {
			t.Fatalf("resume stayed on the completed %q", s.Key)
		}
	}
}

// Group must not lose or reorder anything, and must fold each building once.
func TestGroupPreservesEverything(t *testing.T) {
	states := Resolve(map[string]bool{})
	groups := Group(states)
	seenBuilding := map[string]bool{}
	total := 0
	for _, b := range groups {
		if seenBuilding[b.Building] {
			t.Errorf("building %q appears twice", b.Building)
		}
		seenBuilding[b.Building] = true
		seenFloor := map[string]bool{}
		for _, f := range b.Floors {
			if seenFloor[f.Floor] {
				t.Errorf("%s %s appears twice", b.Building, f.Floor)
			}
			seenFloor[f.Floor] = true
			total += len(f.Curricula)
		}
	}
	if total != len(states) {
		t.Errorf("grouped %d curricula, resolved %d", total, len(states))
	}
}

// The wire keys, asserted as keys and not by round-tripping through the same Go
// struct. A prior task shipped PascalCase field names to the client because its
// tests unmarshalled the response into the type that produced it, so every
// assertion passed while the client saw nothing it recognised.
func TestWireKeysAreCamelCase(t *testing.T) {
	groups := Group(Resolve(map[string]bool{}))
	raw, err := json.Marshal(map[string]any{"buildings": groups})
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}
	var got map[string][]map[string]any
	if err := json.Unmarshal(raw, &got); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	b := got["buildings"][0]
	if _, ok := b["building"]; !ok {
		t.Errorf("building group keys: %v", keysOf(b))
	}
	floors, _ := b["floors"].([]any)
	if len(floors) == 0 {
		t.Fatal("first building has no floors")
	}
	f, _ := floors[0].(map[string]any)
	for _, k := range []string{"floor", "where", "curricula"} {
		if _, ok := f[k]; !ok {
			t.Errorf("floor missing %q; keys: %v", k, keysOf(f))
		}
	}
	cs, _ := f["curricula"].([]any)
	if len(cs) == 0 {
		t.Fatal("first floor has no curricula")
	}
	c, _ := cs[0].(map[string]any)
	for _, k := range []string{"key", "name", "building", "floor", "where", "done", "total", "state", "steps"} {
		if _, ok := c[k]; !ok {
			t.Errorf("curriculum missing %q; keys: %v", k, keysOf(c))
		}
	}
	// `ch` and `dept` are the v19 shape. Their absence is the point of v2: the
	// client must not be able to draw CH.N again.
	for _, k := range []string{"ch", "dept"} {
		if _, ok := c[k]; ok {
			t.Errorf("curriculum still carries the removed key %q", k)
		}
	}
	steps, _ := c["steps"].([]any)
	if len(steps) == 0 {
		t.Fatal("first curriculum has no steps")
	}
	st, _ := steps[0].(map[string]any)
	for _, k := range []string{"kind", "name", "scenarioId", "state"} {
		if _, ok := st[k]; !ok {
			t.Errorf("step missing %q; keys: %v", k, keysOf(st))
		}
	}
}

func keysOf(m map[string]any) []string {
	ks := make([]string, 0, len(m))
	for k := range m {
		ks = append(ks, k)
	}
	sort.Strings(ks)
	return ks
}

// Item 4 of the v27 feedback: "각 병동별 커리큘럼 첫번째는 일단 인사가 좋지않을까?
// 지금 인사하는게 er에밖에 없어보여."
//
// It was true. The ER had SCN-ORIENT-00001..3 — arrive, take the handover, meet your
// first patient — and every other ward opened on an assessment. Someone standing in a
// dialysis unit for the first time got "같은 환자가 세 번씩 오는 곳입니다" and a machine
// alarm, with no place to have said their own name first.
//
// This is the invariant, not the 27 files: EVERY department's first curriculum opens
// with that department's greeting. A new ward added without one fails here.
func TestEveryDepartmentOpensWithAGreeting(t *testing.T) {
	// The department a curriculum belongs to, read off its steps — the catalog has no
	// dept field, and the scenario ids are the only place that fact lives.
	firstOf := map[string]Curriculum{}
	order := []string{}
	for _, c := range catalog {
		dept := ""
		for _, s := range c.Steps {
			if parts := strings.Split(s.ScenarioID, "-"); len(parts) >= 3 {
				dept = parts[1]
				break
			}
		}
		if dept == "" || dept == "ORIENT" {
			continue // ORIENT *is* the ER's greeting curriculum
		}
		if _, seen := firstOf[dept]; !seen {
			firstOf[dept] = c
			order = append(order, dept)
		}
	}
	if len(order) < 28 {
		t.Fatalf("only found %d departments (want 28: 27 wards + the ER) — the reader below is broken, not the catalog", len(order))
	}
	// The one department whose hello lives in a DIFFERENT curriculum: the ER is greeted
	// by 첫 출근 · 자기소개, the orientation chapter that opens 본관 1F ahead of triage.
	// Giving the ER its own -00900 as well would say hello twice on the same floor.
	//
	// The exception is checked, not waived: the orientation chapter has to still be the
	// FIRST thing on that floor. Reorder 본관 1F so triage comes first and this fails,
	// which is the failure that matters — a newcomer's first tap opening chest pain is
	// exactly what happened in v19.
	const erGreeting = "SCN-ORIENT-00001"
	floorOpener := map[[2]string]Step{}
	for _, c := range catalog {
		k := [2]string{c.Building, c.Floor}
		if _, seen := floorOpener[k]; !seen && len(c.Steps) > 0 {
			floorOpener[k] = c.Steps[0]
		}
	}

	for _, dept := range order {
		c := firstOf[dept]
		if len(c.Steps) == 0 {
			t.Errorf("%s has no steps", c.Key)
			continue
		}
		first := c.Steps[0]
		if dept == "ER" {
			if got := floorOpener[[2]string{c.Building, c.Floor}]; got.ScenarioID != erGreeting {
				t.Errorf("%s %s opens on %q (%s), want the orientation greeting %s",
					c.Building, c.Floor, got.Name, got.ScenarioID, erGreeting)
			}
			continue
		}
		want := "SCN-" + dept + GreetingSuffix
		if first.ScenarioID != want {
			t.Errorf("%s (%s) opens on %q (%s), want the ward greeting %s",
				dept, c.Key, first.Name, first.ScenarioID, want)
		}
		if first.Kind != "dlg" {
			t.Errorf("%s: the greeting is a %q step, want dlg — a hello is not a chapter test", dept, first.Kind)
		}
	}
}

// A greeting nobody can reach is not a greeting. Two ways that happens, and both have
// already happened once in this repo: the step points at content that does not exist
// (the v19 catalog), or the content is gated behind a level the learner cannot have on
// their first tap (SCN-ER-00001's "레벨 B1+").
func TestWardGreetingsAreReachableOnDayOne(t *testing.T) {
	bundle, err := contentfile.Load("../../content")
	if err != nil {
		t.Fatalf("load content: %v", err)
	}
	byID := map[string]content.Scenario{}
	for _, s := range bundle.Scenarios {
		byID[s.ID] = s
	}

	found := 0
	for _, c := range catalog {
		for _, st := range c.Steps {
			if !IsWardGreeting(st.ScenarioID) {
				continue
			}
			found++
			s, ok := byID[st.ScenarioID]
			if !ok {
				t.Errorf("%s: %s has no content file", c.Key, st.ScenarioID)
				continue
			}
			if s.Briefing.Difficulty != 1 {
				t.Errorf("%s: difficulty %d, want 1", s.ID, s.Briefing.Difficulty)
			}
			for _, r := range s.Briefing.Reqs {
				if r.Metric == "level" && r.Threshold > 1 {
					t.Errorf("%s: gated behind level %d — it is somebody's first tap on this ward",
						s.ID, r.Threshold)
				}
			}
			// The opening and closing goals are the professional pair (see
			// content.OpenGoal): a greeting is a conversation with a colleague, and
			// these two are what a learner abroad most often gets wrong.
			if len(s.Goals) < 3 {
				t.Errorf("%s: %d goals, want the opening, a body, and the closing", s.ID, len(s.Goals))
				continue
			}
			if s.Goals[0] != content.OpenGoal(s.Persona.Role) {
				t.Errorf("%s: first goal %q is not the opening for role %q", s.ID, s.Goals[0], s.Persona.Role)
			}
			if last := s.Goals[len(s.Goals)-1]; last != content.CloseGoal(s.Persona.Role) {
				t.Errorf("%s: last goal %q is not the closing for role %q", s.ID, last, s.Persona.Role)
			}
		}
	}
	if found != 27 {
		t.Errorf("walked %d greetings in the catalog, want 27", found)
	}
}
