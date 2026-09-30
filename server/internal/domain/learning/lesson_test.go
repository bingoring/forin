package learning

import (
	"reflect"
	"testing"
)

func states(steps []LessonStep) []LessonStepState {
	out := make([]LessonStepState, len(steps))
	for i, s := range steps {
		out[i] = s.State
	}
	return out
}

func fullLesson() LessonInput {
	return LessonInput{Level: "A2", Words: 12, Sentences: 6, Goals: 3}
}

func TestLessonSteps_levelASkipsNothing(t *testing.T) {
	got := states(LessonSteps(fullLesson()))
	want := []LessonStepState{StepNow, StepLock, StepLock, StepLock}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

func TestLessonSteps_levelBSkipsWords(t *testing.T) {
	in := fullLesson()
	in.Level = "B1"
	got := states(LessonSteps(in))
	want := []LessonStepState{StepSkip, StepNow, StepLock, StepLock}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

func TestLessonSteps_levelCSkipsWordsAndSentences(t *testing.T) {
	for _, lv := range []string{"B2", "C1", "C2"} {
		in := fullLesson()
		in.Level = lv
		got := states(LessonSteps(in))
		want := []LessonStepState{StepSkip, StepSkip, StepNow, StepLock}
		if !reflect.DeepEqual(got, want) {
			t.Fatalf("%s: got %v, want %v", lv, got, want)
		}
	}
}

// The counts are whatever the content holds — 8 words and 5 sentences are minimums,
// not the size of an array (build-spec §2-2).
func TestLessonSteps_countsFollowContent(t *testing.T) {
	in := LessonInput{Level: "A2", Words: 13, Sentences: 7, Goals: 4}
	var got []int
	for _, s := range LessonSteps(in) {
		got = append(got, s.Count)
	}
	if want := []int{13, 7, 4, 4}; !reflect.DeepEqual(got, want) {
		t.Fatalf("counts %v, want %v", got, want)
	}
}

func TestLessonSteps_kindsInOrder(t *testing.T) {
	var got []LessonStepKind
	for _, s := range LessonSteps(fullLesson()) {
		got = append(got, s.Kind)
	}
	if want := []LessonStepKind{StepWords, StepSentences, StepGuided, StepFree}; !reflect.DeepEqual(got, want) {
		t.Fatalf("kinds %v, want %v", got, want)
	}
}

func TestLessonSteps_doneAdvancesNow(t *testing.T) {
	in := fullLesson()
	in.Done = map[LessonStepKind]bool{StepWords: true}
	got := states(LessonSteps(in))
	want := []LessonStepState{StepDone, StepNow, StepLock, StepLock}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

// A skipped step the learner did anyway (`그래도 할래요`) reads as done, not skipped.
func TestLessonSteps_optedInSkippedStepReadsDone(t *testing.T) {
	in := fullLesson()
	in.Level = "B1"
	in.Done = map[LessonStepKind]bool{StepWords: true}
	got := states(LessonSteps(in))
	want := []LessonStepState{StepDone, StepNow, StepLock, StepLock}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

// A situation whose department has no words/sentences yet is `empty`, never `skip`:
// the hub offers `그래도 할래요` on a skipped step, and that would open an empty screen.
func TestLessonSteps_noContentIsEmptyNotSkip(t *testing.T) {
	for _, lv := range []string{"A2", "B1", "B2"} {
		in := LessonInput{Level: lv, Goals: 3}
		got := states(LessonSteps(in))
		want := []LessonStepState{StepEmpty, StepEmpty, StepNow, StepLock}
		if !reflect.DeepEqual(got, want) {
			t.Fatalf("%s: got %v, want %v", lv, got, want)
		}
	}
}

func TestLessonSteps_allDone(t *testing.T) {
	in := fullLesson()
	in.Done = map[LessonStepKind]bool{StepWords: true, StepSentences: true, StepGuided: true, StepFree: true}
	got := states(LessonSteps(in))
	want := []LessonStepState{StepDone, StepDone, StepDone, StepDone}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %v, want %v", got, want)
	}
}

// Clearing alone supersedes clearing with help — the same rule as the engine's Steps
// and Guidance — so a free clear marks the guided rung done as well.
func TestDialogueDone_freeSupersedesGuided(t *testing.T) {
	id := ScenarioID("s1")
	p := ClearedPasses{FreeCleared: map[ScenarioID]bool{id: true}}
	done := DialogueDone(id, p)
	if !done[StepGuided] || !done[StepFree] {
		t.Fatalf("free clear: %v, want guided+free done", done)
	}
	p = ClearedPasses{GuidedCleared: map[ScenarioID]bool{id: true}}
	done = DialogueDone(id, p)
	if !done[StepGuided] || done[StepFree] {
		t.Fatalf("guided clear: %v, want only guided done", done)
	}
}

func TestIsRecordedStep(t *testing.T) {
	for k, want := range map[string]bool{"words": true, "sentences": true, "guided": false, "free": false, "": false, "x": false} {
		if got := IsRecordedStep(k); got != want {
			t.Errorf("IsRecordedStep(%q) = %v, want %v", k, got, want)
		}
	}
}
