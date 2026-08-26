package curriculum

import "testing"

// The steps of the first authored curriculum, for readable assertions.
func firstCurriculum(t *testing.T) Curriculum {
	t.Helper()
	if len(catalog) == 0 {
		t.Fatal("catalog is empty")
	}
	return catalog[0]
}

// Finishing step 1 offers step 2 — not another ward, and not step 1 again.
func TestNextScenarioStaysInTheSameCurriculum(t *testing.T) {
	c := firstCurriculum(t)
	var ids []string
	for _, s := range c.Steps {
		if s.ScenarioID != "" && !isOptional(s.Kind) {
			ids = append(ids, s.ScenarioID)
		}
	}
	if len(ids) < 2 {
		t.Skip("the first curriculum has fewer than two required steps")
	}
	got := NextScenarioAfter(map[string]bool{ids[0]: true}, nil, ids[0])
	if got != ids[1] {
		t.Errorf("after clearing %s, next = %q, want %s", ids[0], got, ids[1])
	}
}

// A run that did NOT pass gets the same scenario back. The step after it is locked
// precisely because this one was not cleared, so offering the next step would
// contradict the lock — and offering nothing would leave the button dead. Retrying is
// the honest next move.
func TestNextScenarioAfterAFailedRunIsARetry(t *testing.T) {
	c := firstCurriculum(t)
	var first string
	for _, s := range c.Steps {
		if s.ScenarioID != "" && !isOptional(s.Kind) {
			first = s.ScenarioID
			break
		}
	}
	if first == "" {
		t.Fatal("no required step with a scenario")
	}
	// Failed: nothing cleared, the scenario merely attempted.
	got := NextScenarioAfter(map[string]bool{}, map[string]bool{first: true}, first)
	if got != first {
		t.Errorf("after failing %s, next = %q; want the same scenario to retry", first, got)
	}
}

// Cleared, by contrast, must advance — handing back the scenario they just passed
// would read as the button doing nothing.
func TestNextScenarioAfterAPassAdvances(t *testing.T) {
	c := firstCurriculum(t)
	var first string
	for _, s := range c.Steps {
		if s.ScenarioID != "" && !isOptional(s.Kind) {
			first = s.ScenarioID
			break
		}
	}
	got := NextScenarioAfter(map[string]bool{first: true}, nil, first)
	if got == first {
		t.Errorf("a cleared run was offered itself again (%s)", got)
	}
	if got == "" {
		t.Error("a cleared run left nothing to do next")
	}
}

// When the curriculum is finished, the next one starts — and it is the SAME target
// the rest of the app calls "resume", not a separately computed guess.
func TestNextScenarioMovesOnWhenTheCurriculumIsDone(t *testing.T) {
	c := firstCurriculum(t)
	cleared := map[string]bool{}
	var last string
	for _, s := range c.Steps {
		if s.ScenarioID == "" {
			continue
		}
		cleared[s.ScenarioID] = true
		if !isOptional(s.Kind) {
			last = s.ScenarioID
		}
	}
	got := NextScenarioAfter(cleared, nil, last)
	if got == "" {
		t.Fatal("nothing offered after finishing a curriculum")
	}
	// It belongs to a DIFFERENT curriculum, and it is the resume target.
	if KeyForScenario(got) == c.Key {
		t.Errorf("offered %s, still inside the finished curriculum %s", got, c.Key)
	}
	states := ResolveLocalized(cleared, nil, KeyForScenario(last), "ko")
	for _, cs := range states {
		if cs.Resume && KeyForScenario(got) != cs.Key {
			t.Errorf("offered %s (curriculum %s) but the app's resume target is %s",
				got, KeyForScenario(got), cs.Key)
		}
	}
}

// Everything cleared: nothing to offer, and the caller sends the learner somewhere
// they can choose rather than to a dead route.
func TestNextScenarioIsEmptyWhenEverythingIsDone(t *testing.T) {
	cleared := map[string]bool{}
	last := ""
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID != "" {
				cleared[s.ScenarioID] = true
				last = s.ScenarioID
			}
		}
	}
	if got := NextScenarioAfter(cleared, nil, last); got != "" {
		t.Errorf("everything cleared but %q was offered", got)
	}
}

// A scenario outside the authored path (a department-bank situation) has no curriculum
// to advance, so the answer is the resume target rather than nothing — the learner
// still has a path to get back to.
func TestNextScenarioForAnUnpathedScenarioFallsBackToResume(t *testing.T) {
	got := NextScenarioAfter(map[string]bool{}, nil, "SCN-NOT-IN-PATH-00001")
	if got == "" {
		t.Error("an off-path scenario left nothing to do next")
	}
}
