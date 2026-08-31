package curriculum

import (
	"encoding/json"
	"sort"
	"strings"
	"testing"
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
			if !isOptional(s.Kind) {
				required++
			}
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
	for fl, n := range perFloor {
		if n < 3 || n > 6 {
			t.Errorf("%s %s has %d curricula, want 3-6", fl[0], fl[1], n)
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
