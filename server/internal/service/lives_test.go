package service

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestComputeLives_FullLives(t *testing.T) {
	lives, stn := ComputeLives(5, nil)
	assert.Equal(t, 5, lives)
	assert.Nil(t, stn)
}

func TestComputeLives_NilRefill(t *testing.T) {
	lives, stn := ComputeLives(3, nil)
	assert.Equal(t, 3, lives)
	assert.Nil(t, stn) // no refill timestamp means no timer
}

func TestComputeLives_RefillOne(t *testing.T) {
	refill := time.Now().Add(-35 * time.Minute)
	lives, stn := ComputeLives(3, &refill)
	assert.Equal(t, 4, lives) // 35min / 30min = 1 refill
	assert.NotNil(t, stn)     // still not full, so timer present
}

func TestComputeLives_RefillToMax(t *testing.T) {
	refill := time.Now().Add(-3 * time.Hour)
	lives, stn := ComputeLives(1, &refill)
	assert.Equal(t, 5, lives) // 180min / 30 = 6 refills, but capped at 5
	assert.Nil(t, stn)        // full, no timer
}

func TestComputeLives_ZeroLives(t *testing.T) {
	refill := time.Now().Add(-15 * time.Minute)
	lives, stn := ComputeLives(0, &refill)
	assert.Equal(t, 0, lives) // 15min < 30min, no refill yet
	assert.NotNil(t, stn)     // timer to next refill
}
