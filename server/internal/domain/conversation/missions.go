package conversation

import (
	"strconv"
	"strings"
)

// Live mission progress: which of the scenario's goals the learner has addressed so
// far, reported by the character as part of the tag it already emits.
//
// REMOVAL. This is new and may turn out to be the wrong idea — a character asked to
// keep score can start narrating instead of talking, which is the "coaching drift" the
// dialogue prompt spends four ABSOLUTE RULES fighting. So it is behind one constant.
// Setting MissionProgressEnabled to false:
//
//   - stops the prompt asking for it, so the model has nothing to report
//   - stops the parser reading it, so a model that reports anyway is ignored
//   - stops the field being sent, and the client falls back to the tracker it had
//     before this existed (a goal list with no progress claimed)
//
// No client flag is needed: absence of the field IS off. Deleting the feature later is
// this file, the tag branch in SplitMood, and the two client call sites.
const MissionProgressEnabled = true

// missionsMark is the tag's third section: "[mood: happy | resolved | goals: 1,3]".
const missionsMark = "goals:"

// maxMissions caps how many indices are read from one tag. Scenarios carry four or
// five goals; anything beyond that is a model filling space, and an unbounded list
// would be a way to make the tag long enough to escape the stream stripper's bound.
const maxMissions = 8

// parseMissions reads "1,3" (1-based goal numbers) out of the tag's flag section.
//
// Tolerant: unreadable entries are dropped rather than failing the turn, because the
// alternative is losing the reply over a formatting slip. Out-of-range numbers are
// dropped too — a model that invents goal 9 for a four-goal scenario must not make the
// tracker show a mission that does not exist.
func parseMissions(flags string, goalCount int) []int {
	i := strings.Index(strings.ToLower(flags), missionsMark)
	if i < 0 {
		return nil
	}
	rest := flags[i+len(missionsMark):]
	// The section ends at the next separator, so a tag can carry flags after it.
	if j := strings.IndexByte(rest, '|'); j >= 0 {
		rest = rest[:j]
	}
	seen := map[int]bool{}
	out := make([]int, 0, maxMissions)
	for _, part := range strings.Split(rest, ",") {
		n, err := strconv.Atoi(strings.TrimSpace(part))
		if err != nil || n < 1 || n > goalCount || seen[n] {
			continue
		}
		seen[n] = true
		out = append(out, n)
		if len(out) >= maxMissions {
			break
		}
	}
	if len(out) == 0 {
		return nil
	}
	return out
}

// missionInstruction asks the character to report progress, appended to the dialogue
// prompt only when the feature is on.
//
// Phrased to keep the character IN character. It is framed as "which of these has the
// nurse covered with you", a thing the person in the room genuinely knows, and it is
// bolted onto the tag they already write rather than added to what they say — the
// dialogue prompt's rules against narrating and coaching are unchanged and still
// apply to the reply itself.
func missionInstruction(goals []string) string {
	if !MissionProgressEnabled || len(goals) == 0 {
		return ""
	}
	var b strings.Builder
	b.WriteString("\nThe nurse is working through these points with you:\n")
	for i, g := range goals {
		b.WriteString(strconv.Itoa(i+1) + ". " + g + "\n")
	}
	b.WriteString("In the tag, add | goals: N,N listing the numbers they have ALREADY covered with you across the whole conversation so far — cumulative, not just this turn. ")
	b.WriteString("Only list a number if they actually did it. Include the section on EVERY reply where at least one is covered — including the reply where you write resolved — and omit it only when none are. ")
	// Said explicitly because it happened: the model dropped the section on the turn
	// it set `resolved`, so the last mission never ticked even though the grader later
	// marked it met. The client unions rather than replaces (a tracker that flickers
	// backwards is worse than one slightly generous), which means a dropped section is
	// a tick lost for good.
	b.WriteString("This is bookkeeping in the tag only: never mention these points, their numbers, or your progress through them in what you say.")
	return b.String()
}
