package service

// Level thresholds (cumulative XP required for each level).
var levelThresholds = []int{0, 500, 1500, 3500, 7000, 13000, 22000, 35000, 55000, 85000}

var levelTitles = []string{
	"Student Nurse",
	"Junior Nurse",
	"Staff Nurse",
	"Charge Nurse",
	"Senior Nurse",
	"Clinical Educator",
	"Unit Manager",
	"Clinical Nurse Specialist",
	"Nurse Practitioner",
	"Expert Practitioner",
}

// LevelTitle returns the title for a given level (1-10).
func LevelTitle(level int) string {
	if level < 1 || level > len(levelTitles) {
		return "Unknown"
	}
	return levelTitles[level-1]
}

// XPToNextLevel returns the XP needed to reach the next level from the current totalXP.
// Returns 0 if already at max level.
func XPToNextLevel(level, totalXP int) int {
	if level >= len(levelThresholds) {
		return 0
	}
	return levelThresholds[level] - totalXP
}

// ComputeLevel returns the level for a given total XP amount.
func ComputeLevel(totalXP int) int {
	level := 1
	for i := 1; i < len(levelThresholds); i++ {
		if totalXP >= levelThresholds[i] {
			level = i + 1
		} else {
			break
		}
	}
	return level
}

// DailyXPTarget returns the XP target for a daily goal type.
func DailyXPTarget(goalType string) int {
	switch goalType {
	case "casual":
		return 50
	case "regular":
		return 100
	case "intensive":
		return 200
	default:
		return 100
	}
}
