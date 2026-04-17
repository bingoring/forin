package evaluator

import (
	"context"
	"encoding/json"
	"strings"
	"time"
)

// AIClient evaluates conversation responses using an LLM.
type AIClient interface {
	EvaluateConversation(ctx context.Context, rubric, userResponse string) (*AIEvalResult, error)
}

// AIEvalResult is the structured output from the AI evaluation.
type AIEvalResult struct {
	VocabularyScore   int    `json:"vocabulary_score"`
	ToneScore         int    `json:"tone_score"`
	CompletenessScore int    `json:"completeness_score"`
	FeedbackText      string `json:"feedback_text"`
	IdealResponse     string `json:"ideal_response"`
}

type conversationContent struct {
	AICharacterName  string            `json:"ai_character_name"`
	AICharacterRole  string            `json:"ai_character_role"`
	OpeningLine      string            `json:"opening_line"`
	IdealResponses   []string          `json:"ideal_responses"`
	EvaluationRubric evaluationRubric  `json:"evaluation_rubric"`
	MinPassingScore  int               `json:"min_passing_score"`
}

type evaluationRubric struct {
	VocabularyKeywords    []string `json:"vocabulary_keywords"`
	ToneKeywords          []string `json:"tone_keywords"`
	RequiredContentPoints []string `json:"required_content_points"`
}

type conversationResponse struct {
	UserResponseText string `json:"user_response_text"`
}

type ConversationEvaluator struct {
	aiClient AIClient
}

func (e *ConversationEvaluator) Evaluate(content json.RawMessage, response json.RawMessage, _ int, _ *int) (*Result, error) {
	var c conversationContent
	if err := json.Unmarshal(content, &c); err != nil {
		return nil, err
	}

	var r conversationResponse
	if err := json.Unmarshal(response, &r); err != nil {
		return nil, err
	}

	rubricJSON, _ := json.Marshal(c.EvaluationRubric)
	rubricStr := string(rubricJSON)
	if len(c.IdealResponses) > 0 {
		rubricStr += "\nIdeal responses: " + strings.Join(c.IdealResponses, " | ")
	}

	var evalResult *AIEvalResult

	if e.aiClient != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
		defer cancel()

		var err error
		evalResult, err = e.aiClient.EvaluateConversation(ctx, rubricStr, r.UserResponseText)
		if err != nil {
			// Fallback to keyword matching
			evalResult = keywordFallback(c, r.UserResponseText)
		}
	} else {
		evalResult = keywordFallback(c, r.UserResponseText)
	}

	// Weighted score: vocabulary 30%, tone 30%, completeness 40%
	score := int(float64(evalResult.VocabularyScore)*0.3 +
		float64(evalResult.ToneScore)*0.3 +
		float64(evalResult.CompletenessScore)*0.4)

	xp := scoreToXP(score)

	details, _ := json.Marshal(map[string]interface{}{
		"vocabulary_score":   evalResult.VocabularyScore,
		"tone_score":         evalResult.ToneScore,
		"completeness_score": evalResult.CompletenessScore,
		"feedback_text":      evalResult.FeedbackText,
		"ideal_response":     evalResult.IdealResponse,
	})

	return &Result{
		IsCorrect: nil, // conversation doesn't have binary correct/incorrect
		Score:     &score,
		XPEarned:  xp,
		LivesLost: 0, // never lose lives for conversation
		Details:   details,
	}, nil
}

func scoreToXP(score int) int {
	switch {
	case score >= 80:
		return 25
	case score >= 60:
		return 15
	case score >= 40:
		return 8
	default:
		return 0
	}
}

func keywordFallback(c conversationContent, userText string) *AIEvalResult {
	lower := strings.ToLower(userText)

	// Count keyword matches
	vocabMatches := countMatches(lower, c.EvaluationRubric.VocabularyKeywords)
	toneMatches := countMatches(lower, c.EvaluationRubric.ToneKeywords)

	totalKeywords := len(c.EvaluationRubric.VocabularyKeywords) + len(c.EvaluationRubric.ToneKeywords)
	totalMatches := vocabMatches + toneMatches

	var vocabScore, toneScore, completenessScore int

	if totalKeywords > 0 {
		coverage := float64(totalMatches) / float64(totalKeywords)
		switch {
		case coverage >= 0.7:
			vocabScore = 70
			toneScore = 70
			completenessScore = 70
		case coverage >= 0.4:
			vocabScore = 50
			toneScore = 50
			completenessScore = 50
		default:
			vocabScore = 20
			toneScore = 20
			completenessScore = 20
		}
	}

	ideal := ""
	if len(c.IdealResponses) > 0 {
		ideal = c.IdealResponses[0]
	}

	return &AIEvalResult{
		VocabularyScore:   vocabScore,
		ToneScore:         toneScore,
		CompletenessScore: completenessScore,
		FeedbackText:      "Evaluated using keyword matching (AI unavailable).",
		IdealResponse:     ideal,
	}
}

func countMatches(text string, keywords []string) int {
	count := 0
	for _, kw := range keywords {
		if strings.Contains(text, strings.ToLower(kw)) {
			count++
		}
	}
	return count
}
