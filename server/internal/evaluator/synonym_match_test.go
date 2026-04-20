package evaluator

import (
	"encoding/json"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSynonymMatchEvaluator_AllCorrect(t *testing.T) {
	a, b, c, d := uuid.New(), uuid.New(), uuid.New(), uuid.New()
	content := mustJSON(t, map[string]any{
		"type":      "synonym_match",
		"mode":      "pair",
		"direction": "native_to_target",
		"pairs":     []uuid.UUID{a, b, c, d},
	})
	response := mustJSON(t, map[string]any{
		"pair_results": []map[string]any{
			{"vocab_id": a.String(), "correct": true},
			{"vocab_id": b.String(), "correct": true},
			{"vocab_id": c.String(), "correct": true},
			{"vocab_id": d.String(), "correct": true},
		},
	})

	ev := &SynonymMatchEvaluator{}
	result, err := ev.Evaluate(content, response, 20, nil)

	require.NoError(t, err)
	require.NotNil(t, result.IsCorrect)
	assert.True(t, *result.IsCorrect)
	assert.Equal(t, 0, result.LivesLost)
	// 4 * 20 base + 15 perfect = 95
	assert.Equal(t, 95, result.XPEarned)
}

func TestSynonymMatchEvaluator_PartialLosesLives(t *testing.T) {
	a, b := uuid.New(), uuid.New()
	content := mustJSON(t, map[string]any{
		"type":  "synonym_match",
		"pairs": []uuid.UUID{a, b},
	})
	response := mustJSON(t, map[string]any{
		"pair_results": []map[string]any{
			{"vocab_id": a.String(), "correct": true},
			{"vocab_id": b.String(), "correct": false},
		},
	})

	ev := &SynonymMatchEvaluator{}
	result, err := ev.Evaluate(content, response, 20, nil)

	require.NoError(t, err)
	require.NotNil(t, result.IsCorrect)
	assert.False(t, *result.IsCorrect)
	assert.Equal(t, 1, result.LivesLost)

	var details map[string]any
	require.NoError(t, json.Unmarshal(result.Details, &details))
	assert.Equal(t, float64(1), details["correct_count"])
	assert.Equal(t, float64(2), details["total_pairs"])
}

func mustJSON(t *testing.T, v any) json.RawMessage {
	t.Helper()
	b, err := json.Marshal(v)
	require.NoError(t, err)
	return b
}
