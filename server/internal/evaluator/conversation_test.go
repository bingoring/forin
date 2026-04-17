package evaluator

import (
	"context"
	"encoding/json"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type mockAIClient struct {
	fn func(ctx context.Context, rubric, userResponse string) (*AIEvalResult, error)
}

func (m *mockAIClient) EvaluateConversation(ctx context.Context, rubric, userResponse string) (*AIEvalResult, error) {
	return m.fn(ctx, rubric, userResponse)
}

func TestConversation_HighScore(t *testing.T) {
	client := &mockAIClient{
		fn: func(ctx context.Context, rubric, userResponse string) (*AIEvalResult, error) {
			return &AIEvalResult{
				VocabularyScore:   90,
				ToneScore:         85,
				CompletenessScore: 80,
				FeedbackText:      "Excellent",
				IdealResponse:     "ideal",
			}, nil
		},
	}

	content, _ := json.Marshal(conversationContent{
		IdealResponses:   []string{"ideal response"},
		EvaluationRubric: evaluationRubric{},
	})
	response, _ := json.Marshal(conversationResponse{
		UserResponseText: "some response",
	})

	e := &ConversationEvaluator{aiClient: client}
	result, err := e.Evaluate(content, response, 0, nil)

	require.NoError(t, err)
	assert.Nil(t, result.IsCorrect) // conversation has no binary correct
	assert.NotNil(t, result.Score)
	// Score = 0.3*90 + 0.3*85 + 0.4*80 = 27 + 25.5 + 32 = 84.5 → 84
	assert.Equal(t, 25, result.XPEarned) // 80+ tier
	assert.Equal(t, 0, result.LivesLost)
}

func TestConversation_LowScore(t *testing.T) {
	client := &mockAIClient{
		fn: func(ctx context.Context, rubric, userResponse string) (*AIEvalResult, error) {
			return &AIEvalResult{
				VocabularyScore:   20,
				ToneScore:         15,
				CompletenessScore: 10,
			}, nil
		},
	}

	content, _ := json.Marshal(conversationContent{})
	response, _ := json.Marshal(conversationResponse{
		UserResponseText: "hi",
	})

	e := &ConversationEvaluator{aiClient: client}
	result, err := e.Evaluate(content, response, 0, nil)

	require.NoError(t, err)
	// Score = 0.3*20 + 0.3*15 + 0.4*10 = 6 + 4.5 + 4 = 14.5 → 14
	assert.Equal(t, 0, result.XPEarned) // <40 tier
}

func TestConversation_FallbackOnAPIError(t *testing.T) {
	client := &mockAIClient{
		fn: func(ctx context.Context, rubric, userResponse string) (*AIEvalResult, error) {
			return nil, errors.New("api timeout")
		},
	}

	content, _ := json.Marshal(conversationContent{
		EvaluationRubric: evaluationRubric{
			VocabularyKeywords: []string{"troponin", "pending"},
			ToneKeywords:       []string{"understand", "concern"},
		},
		IdealResponses: []string{"ideal"},
	})
	response, _ := json.Marshal(conversationResponse{
		UserResponseText: "I understand your concern about the pending troponin test",
	})

	e := &ConversationEvaluator{aiClient: client}
	result, err := e.Evaluate(content, response, 0, nil)

	require.NoError(t, err)
	assert.NotNil(t, result.Score)
	// All 4 keywords match → 100% coverage → scores of 70 each via fallback
	assert.True(t, result.XPEarned > 0)
}

func TestConversation_NilAIClient(t *testing.T) {
	content, _ := json.Marshal(conversationContent{
		EvaluationRubric: evaluationRubric{
			VocabularyKeywords: []string{"test"},
		},
	})
	response, _ := json.Marshal(conversationResponse{
		UserResponseText: "test response",
	})

	e := &ConversationEvaluator{aiClient: nil}
	result, err := e.Evaluate(content, response, 0, nil)

	require.NoError(t, err)
	assert.NotNil(t, result.Score)
}
