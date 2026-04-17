package evaluator

import (
	"encoding/json"
	"strings"
)

type wordPuzzleContent struct {
	DialogueTemplate string              `json:"dialogue_template"`
	Blanks           []wordPuzzleBlank   `json:"blanks"`
}

type wordPuzzleBlank struct {
	Index         int      `json:"index"`
	CorrectAnswer string   `json:"correct_answer"`
	Options       []string `json:"options"`
}

type wordPuzzleResponse struct {
	Answers []wordPuzzleAnswer `json:"answers"`
}

type wordPuzzleAnswer struct {
	BlankIndex     int    `json:"blank_index"`
	SelectedOption string `json:"selected_option"`
}

type blankResult struct {
	BlankIndex    int    `json:"blank_index"`
	IsCorrect     bool   `json:"is_correct"`
	CorrectAnswer string `json:"correct_answer"`
	XPEarned      int    `json:"xp_earned"`
}

type WordPuzzleEvaluator struct{}

func (e *WordPuzzleEvaluator) Evaluate(content json.RawMessage, response json.RawMessage, xpReward int, _ *int) (*Result, error) {
	var c wordPuzzleContent
	if err := json.Unmarshal(content, &c); err != nil {
		return nil, err
	}

	var r wordPuzzleResponse
	if err := json.Unmarshal(response, &r); err != nil {
		return nil, err
	}

	// Build answer map
	answerMap := make(map[int]string)
	for _, a := range r.Answers {
		answerMap[a.BlankIndex] = a.SelectedOption
	}

	totalBlanks := len(c.Blanks)
	wrongCount := 0
	totalXP := 0
	perBlank := xpReward
	if totalBlanks > 0 {
		perBlank = xpReward / totalBlanks
	}

	results := make([]blankResult, 0, totalBlanks)
	for _, blank := range c.Blanks {
		userAnswer := strings.TrimSpace(strings.ToLower(answerMap[blank.Index]))
		correctAnswer := strings.TrimSpace(strings.ToLower(blank.CorrectAnswer))

		correct := userAnswer == correctAnswer
		earnedXP := 0
		if correct {
			earnedXP = perBlank
			totalXP += earnedXP
		} else {
			wrongCount++
		}

		results = append(results, blankResult{
			BlankIndex:    blank.Index,
			IsCorrect:     correct,
			CorrectAnswer: blank.CorrectAnswer,
			XPEarned:      earnedXP,
		})
	}

	// Life lost if >= 50% blanks wrong
	livesLost := 0
	if totalBlanks > 0 && wrongCount*2 >= totalBlanks {
		livesLost = 1
	}

	allCorrect := wrongCount == 0
	details, _ := json.Marshal(map[string]interface{}{
		"blank_results": results,
	})

	return &Result{
		IsCorrect: &allCorrect,
		XPEarned:  totalXP,
		LivesLost: livesLost,
		Details:   details,
	}, nil
}
