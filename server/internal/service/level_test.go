package service

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestComputeLevel(t *testing.T) {
	tests := []struct {
		totalXP int
		want    int
	}{
		{0, 1},
		{499, 1},
		{500, 2},
		{1499, 2},
		{1500, 3},
		{3500, 4},
		{7000, 5},
		{84999, 9},
		{85000, 10},
		{999999, 10},
	}

	for _, tt := range tests {
		assert.Equal(t, tt.want, ComputeLevel(tt.totalXP), "totalXP=%d", tt.totalXP)
	}
}

func TestLevelTitle(t *testing.T) {
	assert.Equal(t, "Student Nurse", LevelTitle(1))
	assert.Equal(t, "Expert Practitioner", LevelTitle(10))
	assert.Equal(t, "Unknown", LevelTitle(0))
	assert.Equal(t, "Unknown", LevelTitle(11))
}

func TestXPToNextLevel(t *testing.T) {
	assert.Equal(t, 500, XPToNextLevel(1, 0))
	assert.Equal(t, 300, XPToNextLevel(1, 200))
	assert.Equal(t, 0, XPToNextLevel(10, 85000)) // max level
}

func TestDailyXPTarget(t *testing.T) {
	assert.Equal(t, 50, DailyXPTarget("casual"))
	assert.Equal(t, 100, DailyXPTarget("regular"))
	assert.Equal(t, 200, DailyXPTarget("intensive"))
	assert.Equal(t, 100, DailyXPTarget("unknown"))
}
