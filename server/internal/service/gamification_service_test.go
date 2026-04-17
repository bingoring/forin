package service

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRollRarity_Basic(t *testing.T) {
	// Run many times to verify distribution is within expected bounds
	counts := map[string]int{}
	trials := 10000
	for i := 0; i < trials; i++ {
		counts[rollRarity("basic")]++
	}

	// Basic: 60% common, 30% uncommon, 9% rare, 1% epic, 0% legendary
	assert.Greater(t, counts["common"], trials/3)   // should be ~60%
	assert.Greater(t, counts["uncommon"], trials/10) // should be ~30%
	assert.Equal(t, 0, counts["legendary"])          // 0% for basic boxes
}

func TestRollRarity_Legendary(t *testing.T) {
	counts := map[string]int{}
	trials := 10000
	for i := 0; i < trials; i++ {
		counts[rollRarity("legendary")]++
	}

	// Legendary: 0% common, 5% uncommon, 20% rare, 45% epic, 30% legendary
	assert.Equal(t, 0, counts["common"])
	assert.Greater(t, counts["legendary"], trials/10) // should be ~30%
	assert.Greater(t, counts["epic"], trials/5)        // should be ~45%
}

func TestRollRarity_UnknownBoxType(t *testing.T) {
	// Unknown box type falls back to "basic" rates
	rarity := rollRarity("nonexistent")
	assert.Contains(t, rarityOrder, rarity)
}

func TestDuplicateCatnipReward(t *testing.T) {
	assert.Equal(t, 30, duplicateCatnipReward)
}

func TestDropRatesExist(t *testing.T) {
	for _, boxType := range []string{"basic", "silver", "gold", "legendary"} {
		rates, ok := dropRates[boxType]
		assert.True(t, ok, "drop rates should exist for %s", boxType)
		assert.Len(t, rates, 5, "should have 5 rarity tiers for %s", boxType)

		total := 0.0
		for _, r := range rates {
			total += r
		}
		assert.InDelta(t, 1.0, total, 0.01, "drop rates should sum to 1.0 for %s", boxType)
	}
}
