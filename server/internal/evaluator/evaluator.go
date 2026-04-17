package evaluator

import "encoding/json"

// Result holds the outcome of evaluating an exercise response.
type Result struct {
	IsCorrect *bool           `json:"is_correct"`
	Score     *int            `json:"score,omitempty"`
	XPEarned  int             `json:"xp_earned"`
	LivesLost int             `json:"lives_lost"`
	Details   json.RawMessage `json:"details,omitempty"`
}

// Evaluator evaluates a user's response to an exercise.
type Evaluator interface {
	Evaluate(content json.RawMessage, response json.RawMessage, xpReward int, responseTime *int) (*Result, error)
}
