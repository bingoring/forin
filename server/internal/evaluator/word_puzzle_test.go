package evaluator

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestWordPuzzle_AllCorrect(t *testing.T) {
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{
			{Index: 0, CorrectAnswer: "troponin"},
			{Index: 1, CorrectAnswer: "damage"},
		},
	})
	response, _ := json.Marshal(wordPuzzleResponse{
		Answers: []wordPuzzleAnswer{
			{BlankIndex: 0, SelectedOption: "troponin"},
			{BlankIndex: 1, SelectedOption: "damage"},
		},
	})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 20, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
	assert.Equal(t, 20, result.XPEarned)
	assert.Equal(t, 0, result.LivesLost)
}

func TestWordPuzzle_PartialCorrect_LifeLost(t *testing.T) {
	// 1/2 wrong = 50% → life lost (>= 50% threshold)
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{
			{Index: 0, CorrectAnswer: "troponin"},
			{Index: 1, CorrectAnswer: "damage"},
		},
	})
	response, _ := json.Marshal(wordPuzzleResponse{
		Answers: []wordPuzzleAnswer{
			{BlankIndex: 0, SelectedOption: "troponin"},
			{BlankIndex: 1, SelectedOption: "pressure"},
		},
	})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 20, nil)

	require.NoError(t, err)
	assert.False(t, *result.IsCorrect)
	assert.Equal(t, 10, result.XPEarned) // only 1 of 2 correct
	assert.Equal(t, 1, result.LivesLost) // 1/2 wrong = 50%, >= 50%
}

func TestWordPuzzle_OneWrongOfThree_NoLifeLost(t *testing.T) {
	// 1/3 wrong = 33% → no life lost (< 50%)
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{
			{Index: 0, CorrectAnswer: "a"},
			{Index: 1, CorrectAnswer: "b"},
			{Index: 2, CorrectAnswer: "c"},
		},
	})
	response, _ := json.Marshal(wordPuzzleResponse{
		Answers: []wordPuzzleAnswer{
			{BlankIndex: 0, SelectedOption: "a"},
			{BlankIndex: 1, SelectedOption: "b"},
			{BlankIndex: 2, SelectedOption: "wrong"},
		},
	})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 30, nil)

	require.NoError(t, err)
	assert.Equal(t, 0, result.LivesLost) // 1/3 = 33%, < 50%
}

func TestWordPuzzle_AllWrong_LifeLost(t *testing.T) {
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{
			{Index: 0, CorrectAnswer: "troponin"},
			{Index: 1, CorrectAnswer: "damage"},
		},
	})
	response, _ := json.Marshal(wordPuzzleResponse{
		Answers: []wordPuzzleAnswer{
			{BlankIndex: 0, SelectedOption: "urine"},
			{BlankIndex: 1, SelectedOption: "pressure"},
		},
	})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 20, nil)

	require.NoError(t, err)
	assert.False(t, *result.IsCorrect)
	assert.Equal(t, 0, result.XPEarned)
	assert.Equal(t, 1, result.LivesLost) // 2/2 = 100% wrong, >= 50%
}

func TestWordPuzzle_CaseInsensitive(t *testing.T) {
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{
			{Index: 0, CorrectAnswer: "Troponin"},
		},
	})
	response, _ := json.Marshal(wordPuzzleResponse{
		Answers: []wordPuzzleAnswer{
			{BlankIndex: 0, SelectedOption: "troponin"},
		},
	})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
}
