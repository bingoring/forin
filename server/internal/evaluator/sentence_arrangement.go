package evaluator

import (
	"encoding/json"
	"strings"
)

type sentenceArrangementContent struct {
	TargetSentence string   `json:"target_sentence"`
	WordTiles      []string `json:"word_tiles"`
}

type sentenceArrangementResponse struct {
	Answer []string `json:"answer"`
}

type SentenceArrangementEvaluator struct{}

func (e *SentenceArrangementEvaluator) Evaluate(content json.RawMessage, response json.RawMessage, xpReward int, _ *int) (*Result, error) {
	var c sentenceArrangementContent
	if err := json.Unmarshal(content, &c); err != nil {
		return nil, err
	}

	var r sentenceArrangementResponse
	if err := json.Unmarshal(response, &r); err != nil {
		return nil, err
	}

	userSentence := normalizeSentence(strings.Join(r.Answer, " "))
	targetSentence := normalizeSentence(c.TargetSentence)

	correct := userSentence == targetSentence
	boolVal := correct

	xp := 0
	livesLost := 0
	if correct {
		xp = xpReward
	} else {
		livesLost = 1
	}

	details, _ := json.Marshal(map[string]string{
		"correct_answer": c.TargetSentence,
	})

	return &Result{
		IsCorrect: &boolVal,
		XPEarned:  xp,
		LivesLost: livesLost,
		Details:   details,
	}, nil
}

func normalizeSentence(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	// Normalize multiple spaces to single
	fields := strings.Fields(s)
	return strings.Join(fields, " ")
}
