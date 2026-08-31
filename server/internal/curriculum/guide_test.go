package curriculum

import "testing"

// The ladder is on ONE situation, not across different ones.
func TestADialogueIsPlayedTwice(t *testing.T) {
	c := Curriculum{Steps: []Step{
		{Kind: "dlg", Name: "첫 출근 · 자기소개", ScenarioID: "SCN-ORIENT-00001"},
	}}
	runs := c.Runs()
	if len(runs) != 2 {
		t.Fatalf("a dialogue produced %d runs, want 2: %+v", len(runs), runs)
	}
	// Guided first, free second. The other order would be a lesson after the exam.
	if runs[0].Guide != GuideChoices || runs[1].Guide != GuideFree {
		t.Fatalf("runs = %q then %q, want choices then free", runs[0].Guide, runs[1].Guide)
	}
	// Same situation both times. Learning to introduce yourself and then being turned
	// loose on a burns case is not practice, it is a new problem.
	if runs[0].ScenarioID != runs[1].ScenarioID {
		t.Fatalf("the two passes are different scenarios: %q vs %q", runs[0].ScenarioID, runs[1].ScenarioID)
	}
	if runs[0].Pass != PassGuided || runs[1].Pass != PassFree {
		t.Fatalf("passes = %d, %d", runs[0].Pass, runs[1].Pass)
	}
}

func TestABossIsPlayedOnceAndUnaided(t *testing.T) {
	c := Curriculum{Steps: []Step{{Kind: "boss", ScenarioID: "SCN-ER-00001"}}}
	runs := c.Runs()
	if len(runs) != 1 {
		t.Fatalf("a boss produced %d runs, want 1", len(runs))
	}
	// It is the test. Three answers printed under the question is not one — and playing
	// it twice would make the run's ending drag, which is the last place to lose someone.
	if runs[0].Guide != GuideFree {
		t.Fatalf("boss guide = %q, want free", runs[0].Guide)
	}
	// A quiz is not a conversation and has nothing to scaffold.
	if got := Passes("quiz"); got != 1 {
		t.Fatalf("quiz passes = %d, want 1", got)
	}
	if got := GuideForPass("quiz", PassGuided); got != GuideFree {
		t.Fatalf("quiz guide = %q, want free", got)
	}
}

func TestThereIsNoThirdRung(t *testing.T) {
	// A middle hint-only pass was the obvious third rung and it is one too many: nobody
	// wants to do their first shift three times. The hint survives as something reached
	// for DURING the free pass, which is also what makes it worth anything.
	if got := Passes("dlg"); got != 2 {
		t.Fatalf("dialogue passes = %d, want 2", got)
	}
	for _, p := range []Pass{PassGuided, PassFree} {
		if g := GuideForPass("dlg", p); g != GuideChoices && g != GuideFree {
			t.Fatalf("pass %d = %q, which is neither rung", p, g)
		}
	}
}

func TestGuideForScenarioTurnsOnWhatTheyHaveDone(t *testing.T) {
	const opener = "SCN-ORIENT-00001" // 본관 1F, the first dialogue in the catalog

	// First time through a conversation: choices.
	if got := GuideForScenario(opener, false); got != GuideChoices {
		t.Fatalf("first run = %q, want choices", got)
	}
	// Having finished the guided pass, the same situation comes back unaided. That is
	// the whole ladder: the second time, it is theirs.
	if got := GuideForScenario(opener, true); got != GuideFree {
		t.Fatalf("second run = %q, want free", got)
	}
	// A scenario the catalog does not contain — a board situation, a paged call — is
	// always free. Help is a property of a COURSE, and outside one there is none.
	if got := GuideForScenario("SCN-NOT-IN-CATALOG", false); got != GuideFree {
		t.Fatalf("uncatalogued scenario = %q, want free", got)
	}
}

// The catalog as authored, since the claim is about the product and not the arithmetic.
func TestTheLadderRoughlyDoublesTheCatalog(t *testing.T) {
	var steps, runs, guided int
	for _, c := range authored {
		steps += len(c.Steps)
		for _, r := range c.Runs() {
			runs++
			if r.Guide == GuideChoices {
				guided++
			}
		}
	}
	if steps == 0 {
		t.Fatal("the catalog is empty")
	}
	// Not exactly double — bosses and quizzes are played once — but close to it, which
	// is the point: the second pass is the same content with the scaffolding removed,
	// and it costs no new authoring.
	if runs <= steps {
		t.Fatalf("%d steps produced %d runs; the ladder added nothing", steps, runs)
	}
	if runs*10 < steps*15 {
		t.Fatalf("%d steps produced only %d runs, well short of doubling", steps, runs)
	}
	// And a real share of the catalog is now guided, or the feature is only true on
	// paper.
	if guided*3 < runs {
		t.Fatalf("only %d of %d runs are guided", guided, runs)
	}
}

// What the learner actually sees in the floor sheet's curriculum list.
func TestTheListShowsBothRungsAsSeparateEntries(t *testing.T) {
	// A curriculum with one dialogue and one boss: 2 + 1 = 3 entries.
	c := Curriculum{
		Key: "T|1F|t", Name: "t", Building: "T", Floor: "1F", Where: "T 1F",
		Steps: []Step{
			{Kind: "dlg", Name: "X-ray 자세 협조", ScenarioID: "SCN-X-1"},
			{Kind: "boss", Name: "시험", ScenarioID: "SCN-X-2"},
		},
	}
	got := resolveOne(c, nil, nil, nil, nil, "ko")
	if len(got.Steps) != 3 {
		t.Fatalf("%d entries, want 3 (dlg×2 + boss): %+v", len(got.Steps), got.Steps)
	}

	// The two dialogue entries are the SAME situation, told apart by their rung — which
	// is the only thing that stops the list reading as a duplicate title.
	a, b := got.Steps[0], got.Steps[1]
	if a.ScenarioID != b.ScenarioID {
		t.Fatalf("the two rungs point at different scenarios: %q / %q", a.ScenarioID, b.ScenarioID)
	}
	if a.Guide != string(GuideChoices) || b.Guide != string(GuideFree) {
		t.Fatalf("rungs = %q / %q, want choices / free", a.Guide, b.Guide)
	}
	if a.Pass != 1 || b.Pass != 2 || a.Passes != 2 || b.Passes != 2 {
		t.Fatalf("labels = %d/%d and %d/%d, want 1/2 and 2/2", a.Pass, a.Passes, b.Pass, b.Passes)
	}
	// A boss has one rung and says nothing about passes — "1/1" on screen would be noise.
	if got.Steps[2].Passes != 0 {
		t.Fatalf("boss carries a pass label: %+v", got.Steps[2])
	}
}

func TestTheTwoRungsAreFinishedSeparately(t *testing.T) {
	c := Curriculum{Steps: []Step{{Kind: "dlg", ScenarioID: "SCN-X-1"}}}

	// Cleared WITH help: the guided rung is done, the free one is still waiting. Reading
	// both off one "cleared" flag would tick them together and the second entry would be
	// born complete — which is the whole ladder gone.
	guided := resolveOne(c, map[string]bool{"SCN-X-1": true}, nil,
		map[string]bool{"SCN-X-1": true}, map[string]bool{}, "ko")
	if guided.Steps[0].State != "done" {
		t.Fatalf("guided rung = %q, want done", guided.Steps[0].State)
	}
	if guided.Steps[1].State == "done" {
		t.Fatal("the free rung was completed by a helped clear")
	}

	// Cleared ALONE supersedes: someone who did it unaided has no business being sent
	// back through the guided rung.
	alone := resolveOne(c, map[string]bool{"SCN-X-1": true}, nil,
		map[string]bool{}, map[string]bool{"SCN-X-1": true}, "ko")
	if alone.Steps[0].State != "done" || alone.Steps[1].State != "done" {
		t.Fatalf("unaided clear left rungs %q / %q", alone.Steps[0].State, alone.Steps[1].State)
	}
}
