package evaluator

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestMeaningMatch_PerfectFast(t *testing.T) {
	response, _ := json.Marshal(meaningMatchResponse{
		TotalTimeSeconds: 45,
		MismatchCount:    0,
	})

	e := &MeaningMatchEvaluator{}
	result, err := e.Evaluate(nil, response, 0, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
	assert.Equal(t, 55, result.XPEarned) // 20 + 20 + 15
	assert.Equal(t, 0, result.LivesLost)
}

func TestMeaningMatch_PerfectSlow(t *testing.T) {
	response, _ := json.Marshal(meaningMatchResponse{
		TotalTimeSeconds: 90,
		MismatchCount:    0,
	})

	e := &MeaningMatchEvaluator{}
	result, err := e.Evaluate(nil, response, 0, nil)

	require.NoError(t, err)
	assert.Equal(t, 35, result.XPEarned) // 20 + 0 + 15
}

func TestMeaningMatch_ImperfectFast(t *testing.T) {
	response, _ := json.Marshal(meaningMatchResponse{
		TotalTimeSeconds: 50,
		MismatchCount:    3,
	})

	e := &MeaningMatchEvaluator{}
	result, err := e.Evaluate(nil, response, 0, nil)

	require.NoError(t, err)
	assert.Equal(t, 40, result.XPEarned) // 20 + 20 + 0
}

func TestMeaningMatch_BaseOnly(t *testing.T) {
	response, _ := json.Marshal(meaningMatchResponse{
		TotalTimeSeconds: 120,
		MismatchCount:    5,
	})

	e := &MeaningMatchEvaluator{}
	result, err := e.Evaluate(nil, response, 0, nil)

	require.NoError(t, err)
	assert.Equal(t, 20, result.XPEarned) // base only
}
