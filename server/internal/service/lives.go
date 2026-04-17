package service

import "time"

const (
	MaxLives         = 5
	LivesRefillMinutes = 30
)

// ComputeLives calculates the current lives based on stored state and elapsed time.
// Returns current lives count and seconds until the next life refill (nil if full).
func ComputeLives(storedLives int, lastRefill *time.Time) (current int, secondsToNext *int) {
	if lastRefill == nil || storedLives >= MaxLives {
		capped := storedLives
		if capped > MaxLives {
			capped = MaxLives
		}
		return capped, nil
	}

	elapsed := time.Since(*lastRefill)
	refilled := int(elapsed.Minutes()) / LivesRefillMinutes
	current = storedLives + refilled
	if current > MaxLives {
		current = MaxLives
	}

	if current < MaxLives {
		// Time until next refill
		elapsedMinutes := int(elapsed.Minutes())
		minutesIntoCurrentWindow := elapsedMinutes % LivesRefillMinutes
		remainingSeconds := (LivesRefillMinutes - minutesIntoCurrentWindow) * 60
		secondsToNext = &remainingSeconds
	}

	return current, secondsToNext
}
