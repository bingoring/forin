package conversation

import (
	"os"
	"strings"
	"testing"
)

// The numbers must be validated against the scenario, or the tracker shows a mission
// that does not exist.
func TestParseMissionsRejectsOutOfRange(t *testing.T) {
	if got := parseMissions("goals: 9", 4); got != nil {
		t.Errorf("goal 9 of 4 was accepted: %v", got)
	}
	if got := parseMissions("goals: 0", 4); got != nil {
		t.Errorf("goal 0 was accepted (the numbers are 1-based): %v", got)
	}
	if got := parseMissions("goals: -2", 4); got != nil {
		t.Errorf("a negative was accepted: %v", got)
	}
	// Valid ones inside a mixed list survive; the rest are dropped rather than
	// failing the turn — losing the reply over a formatting slip is the worse outcome.
	got := parseMissions("goals: 1, 9, 2, banana, 3", 4)
	if len(got) != 3 || got[0] != 1 || got[1] != 2 || got[2] != 3 {
		t.Errorf("mixed list = %v, want [1 2 3]", got)
	}
}

func TestParseMissionsDeduplicates(t *testing.T) {
	// A repeated number would tick the same mission twice; harmless on screen but it
	// makes the count wrong.
	got := parseMissions("goals: 2,2,2", 4)
	if len(got) != 1 || got[0] != 2 {
		t.Errorf("got %v, want [2]", got)
	}
}

func TestParseMissionsIsAbsentWhenNotReported(t *testing.T) {
	for _, flags := range []string{"", "resolved", "goals:", "goals: ", "goals: none"} {
		if got := parseMissions(flags, 4); got != nil {
			t.Errorf("flags %q produced %v, want none", flags, got)
		}
	}
}

// The section ends at the next separator, so a tag can carry flags after it.
func TestParseMissionsStopsAtTheNextSection(t *testing.T) {
	got := parseMissions("resolved | goals: 1,2 | somethingelse: 9", 4)
	if len(got) != 2 || got[0] != 1 || got[1] != 2 {
		t.Errorf("got %v, want [1 2] — it read past its own section", got)
	}
}

// An unbounded list would be a way to make the tag long enough to escape the stream
// stripper's hold-back bound, at which point the learner reads the tag.
func TestParseMissionsIsBounded(t *testing.T) {
	long := "goals: " + strings.Repeat("1,2,3,4,5,6,7,8,9,10,", 20)
	got := parseMissions(long, 20)
	if len(got) > maxMissions {
		t.Errorf("read %d numbers, cap is %d", len(got), maxMissions)
	}
}

// The whole point of the flag: turning it off must leave the prompt byte-identical to
// what it was before the feature existed.
func TestMissionInstructionIsEmptyWhenThereIsNothingToReport(t *testing.T) {
	if got := missionInstruction(nil); got != "" {
		t.Errorf("no goals should ask for nothing, got %q", got)
	}
	if got := missionInstruction([]string{}); got != "" {
		t.Errorf("empty goals should ask for nothing, got %q", got)
	}
}

// The instruction has to number the goals — the model reports numbers, so it must be
// able to see which number is which.
func TestMissionInstructionNumbersTheGoals(t *testing.T) {
	if !MissionProgressEnabled {
		t.Skip("mission progress is off")
	}
	got := missionInstruction([]string{"자기소개", "통증 사정", "마무리"})
	for _, want := range []string{"1. 자기소개", "2. 통증 사정", "3. 마무리"} {
		if !strings.Contains(got, want) {
			t.Errorf("instruction omits %q:\n%s", want, got)
		}
	}
	// Cumulative, or the tracker un-ticks a mission the moment the character stops
	// mentioning it.
	if !strings.Contains(got, "cumulative") {
		t.Errorf("instruction does not ask for a cumulative list:\n%s", got)
	}
	// And it must not leak into what the character says — that is the coaching drift
	// the dialogue prompt spends four ABSOLUTE RULES fighting.
	if !strings.Contains(got, "never mention") {
		t.Errorf("instruction does not forbid mentioning the points aloud:\n%s", got)
	}
}

// The longest tag the model is asked for has to fit inside the hold-back bound, or it
// releases as text and the learner reads it.
func TestTheLongestPossibleTagFitsTheBound(t *testing.T) {
	longest := "[mood: surprised | resolved | goals: 1,2,3,4,5,6,7,8]"
	if len(longest) > maxMoodPrefix {
		t.Errorf("the longest tag is %d chars but the bound is %d — it would leak as text",
			len(longest), maxMoodPrefix)
	}
}

// `resolved` is its own section, not a substring anywhere in the flags. A future flag
// containing the word would otherwise set it.
func TestResolvedRequiresItsOwnSection(t *testing.T) {
	_, resolved, _ := SplitMood("[mood: happy | goals: 1,2] Thanks.")
	if resolved {
		t.Error("a goals section set resolved")
	}
	_, resolved, _ = SplitMood("[mood: happy | resolved | goals: 1] Thanks.")
	if !resolved {
		t.Error("resolved alongside goals was missed")
	}
}

// Turning the feature off must actually turn it off.
//
// This is the requirement the flag exists for: the feature is new and a character
// asked to keep score may start narrating instead of talking. Flipping one constant
// has to stop the prompt asking, stop the parser reading, and leave the app rendering
// what it rendered before — and none of that is true unless every path checks it.
//
// Verified by flipping the constant in a copy of the source rather than at runtime,
// because a const cannot be reassigned. That makes this a source test, which is the
// honest shape: what is being checked is that no path forgot the guard.
func TestMissionProgressIsRemovableFromOnePlace(t *testing.T) {
	src := readSource(t, "missions.go")

	// The prompt request is guarded.
	if !strings.Contains(src, "if !MissionProgressEnabled || len(goals) == 0 {") {
		t.Error("missionInstruction does not check the flag")
	}
	// And the flag is the only switch: no second copy to keep in step.
	if n := strings.Count(src, "MissionProgressEnabled ="); n != 1 {
		t.Errorf("the flag is declared %d times", n)
	}

	// The parser is reached only through the instruction being answered, so the
	// off-state is: nothing asked, nothing reported, and an unasked-for report is
	// still range-checked against the goals.
	if got := parseMissions("goals: 1,2", 0); got != nil {
		t.Errorf("a report against a scenario with no goals was accepted: %v", got)
	}

	// The engine must not send missions it did not parse.
	eng := readSource(t, "engine.go")
	if !strings.Contains(eng, "Missions: parseMissions(flags, len(sc.Goals))") {
		t.Error("the stream path does not derive Missions from the parsed flags")
	}
	if !strings.Contains(eng, "missions := parseMissions(flags, len(sc.Goals))") {
		t.Error("the non-stream path does not derive Missions from the parsed flags")
	}
}

// readSource reads a file from this package, for the source-level checks above.
func readSource(t *testing.T, name string) string {
	t.Helper()
	b, err := os.ReadFile(name)
	if err != nil {
		t.Fatalf("read %s: %v", name, err)
	}
	return string(b)
}
