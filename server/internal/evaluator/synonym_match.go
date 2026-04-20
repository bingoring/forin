package evaluator

import (
	"encoding/json"

	"github.com/google/uuid"
)

type synonymMatchContent struct {
	Pairs []uuid.UUID `json:"pairs"`
}

type pairResult struct {
	VocabID uuid.UUID `json:"vocab_id"`
	Correct bool      `json:"correct"`
}

type synonymMatchResponse struct {
	PairResults []pairResult `json:"pair_results"`
}

type SynonymMatchEvaluator struct{}

// Evaluate a synonym_match submission. Learners score XP proportional to
// the number of pairs resolved on the first try. The entire set must be
// correct for IsCorrect=true.
//
// XP formula:
//
//	base        = 20 per correct pair
//	penalty     = 5 per wrong pair (first-attempt miss)
//	perfectBonus = +15 when every pair was resolved without any miss
//
// LivesLost = 1 when not every pair was correct, else 0.
func (e *SynonymMatchEvaluator) Evaluate(content json.RawMessage, response json.RawMessage, _ int, _ *int) (*Result, error) {
	var c synonymMatchContent
	if err := json.Unmarshal(content, &c); err != nil {
		return nil, err
	}
	var r synonymMatchResponse
	if err := json.Unmarshal(response, &r); err != nil {
		return nil, err
	}

	correctCount := 0
	for _, pr := range r.PairResults {
		if pr.Correct {
			correctCount++
		}
	}
	total := len(c.Pairs)
	wrongCount := len(r.PairResults) - correctCount
	if wrongCount < 0 {
		wrongCount = 0
	}

	baseXP := correctCount * 20
	penalty := wrongCount * 5
	perfectBonus := 0
	if wrongCount == 0 && correctCount == total && total > 0 {
		perfectBonus = 15
	}
	xp := baseXP - penalty + perfectBonus
	if xp < 0 {
		xp = 0
	}

	livesLost := 0
	isCorrect := correctCount == total && total > 0
	if !isCorrect {
		livesLost = 1
	}

	details, _ := json.Marshal(map[string]any{
		"correct_count": correctCount,
		"total_pairs":   total,
		"wrong_count":   wrongCount,
		"base":          baseXP,
		"penalty":       penalty,
		"perfect_bonus": perfectBonus,
	})

	return &Result{
		IsCorrect: &isCorrect,
		XPEarned:  xp,
		LivesLost: livesLost,
		Details:   details,
	}, nil
}
