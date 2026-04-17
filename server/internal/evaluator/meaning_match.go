package evaluator

import "encoding/json"

type meaningMatchResponse struct {
	TotalTimeSeconds int `json:"total_time_seconds"`
	MismatchCount    int `json:"mismatch_count"`
}

type MeaningMatchEvaluator struct{}

func (e *MeaningMatchEvaluator) Evaluate(_ json.RawMessage, response json.RawMessage, _ int, _ *int) (*Result, error) {
	var r meaningMatchResponse
	if err := json.Unmarshal(response, &r); err != nil {
		return nil, err
	}

	baseXP := 20
	speedBonus := 0
	perfectBonus := 0

	if r.TotalTimeSeconds <= 60 {
		speedBonus = 20
	}
	if r.MismatchCount == 0 {
		perfectBonus = 15
	}

	totalXP := baseXP + speedBonus + perfectBonus
	correct := true

	details, _ := json.Marshal(map[string]int{
		"base":          baseXP,
		"speed_bonus":   speedBonus,
		"perfect_bonus": perfectBonus,
	})

	return &Result{
		IsCorrect: &correct,
		XPEarned:  totalXP,
		LivesLost: 0,
		Details:   details,
	}, nil
}
