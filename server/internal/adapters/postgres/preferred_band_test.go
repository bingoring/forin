package postgres

import (
	"testing"

	"github.com/bingoring/forin/server/internal/economy"
)

// The daily sample's difficulty band comes from two axes that can disagree. This is
// the arithmetic of that disagreement.
func TestPreferredBandCombinesXPAndCEFR(t *testing.T) {
	junior := economy.Active.RankJunior
	if junior <= 1 {
		t.Fatalf("RankJunior = %d — this test needs a threshold above level 1", junior)
	}
	novice := 1

	cases := []struct {
		name    string
		xp      int
		cefr    string
		lo, hi  int
		because string
	}{
		{
			name: "beginner speaker, early game", xp: novice, cefr: "A2", lo: 1, hi: 1,
			because: "both axes agree on the easiest band",
		},
		{
			name: "beginner speaker who has ground out XP", xp: junior, cefr: "A1", lo: 1, hi: 1,
			because: "XP says 2-3 and CEFR says 1; no overlap, so CEFR wins — this is the " +
				"mismatch the feature exists to fix",
		},
		{
			name: "advanced speaker on day one", xp: novice, cefr: "C1", lo: 2, hi: 2,
			because: "XP says 1-2 and CEFR says 2-3; they overlap at 2, but the intersection " +
				"is taken only when non-empty — here it is, so 2..2",
		},
		{
			name: "intermediate speaker, early game", xp: novice, cefr: "B1", lo: 1, hi: 2,
			because: "both axes agree",
		},
		{
			name: "intermediate speaker at junior rank", xp: junior, cefr: "B2", lo: 2, hi: 2,
			because: "XP 2-3 ∩ CEFR 1-2 = 2",
		},
		{
			name: "no answer, early game", xp: novice, cefr: "", lo: 1, hi: 2,
			because: "an unanswered level is intermediate, not easiest",
		},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			lo, hi := preferredBand(c.xp, c.cefr)
			if lo != c.lo || hi != c.hi {
				t.Fatalf("preferredBand(%d, %q) = (%d,%d), want (%d,%d) — %s",
					c.xp, c.cefr, lo, hi, c.lo, c.hi, c.because)
			}
		})
	}
}

// Whatever the two axes say, the result has to be a usable range. A band outside
// 1..3, or inverted, makes every scenario off-band — the weighting then applies the
// same penalty to everything, which is indistinguishable from doing nothing.
func TestPreferredBandIsAlwaysAValidRange(t *testing.T) {
	for _, cefr := range []string{"A1", "A2", "B1", "B2", "C1", "C2", "", "garbage"} {
		for xp := 0; xp <= economy.Active.RankJunior+5; xp++ {
			lo, hi := preferredBand(xp, cefr)
			if lo < 1 || hi > 3 || lo > hi {
				t.Fatalf("preferredBand(%d, %q) = (%d,%d) is not a valid 1..3 range", xp, cefr, lo, hi)
			}
		}
	}
}

// The XP axis must still do something. Deleting it and reading CEFR alone would pass
// every case above except this one.
func TestXPStillNarrowsTheBand(t *testing.T) {
	lo1, hi1 := preferredBand(1, "B1")
	lo2, hi2 := preferredBand(economy.Active.RankJunior, "B1")
	if lo1 == lo2 && hi1 == hi2 {
		t.Fatalf("XP level no longer affects the band: both are (%d,%d)", lo1, hi1)
	}
}
