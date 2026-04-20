package config

// SupportedTensionLevels lists every tension bucket valid in this build.
// Adding a value is a code-only change; no DB CHECK constraint.
var SupportedTensionLevels = []string{"calm", "tense", "crisis"}

// SupportedNPCMoods lists the per-scene mood tags writers may attach.
// Tags are additive on a stage (an NPC can be both 'demanding' and 'confused').
var SupportedNPCMoods = []string{
	"calm",
	"anxious",
	"demanding",
	"dismissive",
	"confused",
	"angry",
	"distracted",
	"grateful",
	"apologetic",
}

func IsSupportedTension(v string) bool {
	for _, l := range SupportedTensionLevels {
		if l == v {
			return true
		}
	}
	return false
}

func IsSupportedMood(v string) bool {
	for _, m := range SupportedNPCMoods {
		if m == v {
			return true
		}
	}
	return false
}

// AreSupportedMoods returns true when every entry is a known mood tag.
// An empty slice is considered supported (the DB default is an empty array).
func AreSupportedMoods(tags []string) bool {
	for _, t := range tags {
		if !IsSupportedMood(t) {
			return false
		}
	}
	return true
}
