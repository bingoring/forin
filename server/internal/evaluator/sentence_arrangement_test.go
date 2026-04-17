package evaluator

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSentenceArrangement_Correct(t *testing.T) {
	content, _ := json.Marshal(sentenceArrangementContent{
		TargetSentence: "I understand you Mr. Johnson.",
		WordTiles:      []string{"I", "understand", "you", "Mr.", "Johnson.", "totally", "great"},
	})
	response, _ := json.Marshal(sentenceArrangementResponse{
		Answer: []string{"I", "understand", "you", "Mr.", "Johnson."},
	})

	e := &SentenceArrangementEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
	assert.Equal(t, 10, result.XPEarned)
	assert.Equal(t, 0, result.LivesLost)
}

func TestSentenceArrangement_Incorrect(t *testing.T) {
	content, _ := json.Marshal(sentenceArrangementContent{
		TargetSentence: "I understand you.",
	})
	response, _ := json.Marshal(sentenceArrangementResponse{
		Answer: []string{"you", "understand", "I."},
	})

	e := &SentenceArrangementEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.False(t, *result.IsCorrect)
	assert.Equal(t, 0, result.XPEarned)
	assert.Equal(t, 1, result.LivesLost)
}

func TestSentenceArrangement_CaseInsensitive(t *testing.T) {
	content, _ := json.Marshal(sentenceArrangementContent{
		TargetSentence: "Hello World",
	})
	response, _ := json.Marshal(sentenceArrangementResponse{
		Answer: []string{"hello", "world"},
	})

	e := &SentenceArrangementEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
}
