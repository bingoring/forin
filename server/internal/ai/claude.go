package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/forin/server/internal/evaluator"
)

// ClaudeClient calls the Anthropic API for conversation evaluation.
type ClaudeClient struct {
	apiKey string
}

func NewClaudeClient(apiKey string) *ClaudeClient {
	return &ClaudeClient{apiKey: apiKey}
}

func (c *ClaudeClient) EvaluateConversation(ctx context.Context, rubric, userResponse string) (*evaluator.AIEvalResult, error) {
	if c.apiKey == "" {
		return nil, fmt.Errorf("anthropic API key not configured")
	}

	// TODO: Implement actual Anthropic API call in Phase 2.
	// For now, use a simple keyword-based heuristic as a placeholder.
	return simpleEval(rubric, userResponse), nil
}

// simpleEval is a placeholder until the real API integration is built.
func simpleEval(rubric, userResponse string) *evaluator.AIEvalResult {
	lower := strings.ToLower(userResponse)

	// Extract keywords from rubric JSON
	var rubricData struct {
		VocabularyKeywords []string `json:"vocabulary_keywords"`
		ToneKeywords       []string `json:"tone_keywords"`
	}
	json.Unmarshal([]byte(rubric), &rubricData)

	vocabCount := 0
	for _, kw := range rubricData.VocabularyKeywords {
		if strings.Contains(lower, strings.ToLower(kw)) {
			vocabCount++
		}
	}

	toneCount := 0
	for _, kw := range rubricData.ToneKeywords {
		if strings.Contains(lower, strings.ToLower(kw)) {
			toneCount++
		}
	}

	vocabScore := scoreFromCoverage(vocabCount, len(rubricData.VocabularyKeywords))
	toneScore := scoreFromCoverage(toneCount, len(rubricData.ToneKeywords))

	// Completeness based on response length
	completenessScore := 30
	if len(userResponse) > 100 {
		completenessScore = 60
	}
	if len(userResponse) > 200 {
		completenessScore = 80
	}

	return &evaluator.AIEvalResult{
		VocabularyScore:   vocabScore,
		ToneScore:         toneScore,
		CompletenessScore: completenessScore,
		FeedbackText:      "Evaluated using keyword matching.",
		IdealResponse:     "",
	}
}

func scoreFromCoverage(matches, total int) int {
	if total == 0 {
		return 50
	}
	coverage := float64(matches) / float64(total)
	switch {
	case coverage >= 0.7:
		return 80
	case coverage >= 0.4:
		return 55
	default:
		return 25
	}
}
