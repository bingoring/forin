package evaluator

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// --- Sentence Arrangement Edge Cases ---

func TestSentenceArrangement_EmptyAnswer(t *testing.T) {
	content, _ := json.Marshal(sentenceArrangementContent{TargetSentence: "Hello"})
	response, _ := json.Marshal(sentenceArrangementResponse{Answer: []string{}})

	e := &SentenceArrangementEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.False(t, *result.IsCorrect)
	assert.Equal(t, 1, result.LivesLost)
}

func TestSentenceArrangement_ExtraWhitespace(t *testing.T) {
	content, _ := json.Marshal(sentenceArrangementContent{TargetSentence: "  Hello   world  "})
	response, _ := json.Marshal(sentenceArrangementResponse{Answer: []string{"Hello", "world"}})

	e := &SentenceArrangementEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
}

func TestSentenceArrangement_SingleWord(t *testing.T) {
	content, _ := json.Marshal(sentenceArrangementContent{TargetSentence: "NPO"})
	response, _ := json.Marshal(sentenceArrangementResponse{Answer: []string{"NPO"}})

	e := &SentenceArrangementEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
}

func TestSentenceArrangement_InvalidContentJSON(t *testing.T) {
	e := &SentenceArrangementEvaluator{}
	_, err := e.Evaluate(json.RawMessage(`{invalid`), json.RawMessage(`{}`), 10, nil)
	assert.Error(t, err)
}

func TestSentenceArrangement_InvalidResponseJSON(t *testing.T) {
	content, _ := json.Marshal(sentenceArrangementContent{TargetSentence: "test"})
	e := &SentenceArrangementEvaluator{}
	_, err := e.Evaluate(content, json.RawMessage(`{invalid`), 10, nil)
	assert.Error(t, err)
}

// --- Word Puzzle Edge Cases ---

func TestWordPuzzle_NoBlanks(t *testing.T) {
	content, _ := json.Marshal(wordPuzzleContent{Blanks: []wordPuzzleBlank{}})
	response, _ := json.Marshal(wordPuzzleResponse{Answers: []wordPuzzleAnswer{}})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
	assert.Equal(t, 0, result.XPEarned)
	assert.Equal(t, 0, result.LivesLost)
}

func TestWordPuzzle_MissingAnswer(t *testing.T) {
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{{Index: 0, CorrectAnswer: "troponin"}},
	})
	// User submits no answers
	response, _ := json.Marshal(wordPuzzleResponse{Answers: []wordPuzzleAnswer{}})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.False(t, *result.IsCorrect)
	assert.Equal(t, 1, result.LivesLost) // 1/1 = 100% wrong
}

func TestWordPuzzle_WhitespaceInAnswer(t *testing.T) {
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{{Index: 0, CorrectAnswer: "troponin"}},
	})
	response, _ := json.Marshal(wordPuzzleResponse{
		Answers: []wordPuzzleAnswer{{BlankIndex: 0, SelectedOption: "  Troponin  "}},
	})

	e := &WordPuzzleEvaluator{}
	result, err := e.Evaluate(content, response, 10, nil)

	require.NoError(t, err)
	assert.True(t, *result.IsCorrect)
}

// --- Meaning Match Edge Cases ---

func TestMeaningMatch_ExactBoundary60Seconds(t *testing.T) {
	response, _ := json.Marshal(meaningMatchResponse{TotalTimeSeconds: 60, MismatchCount: 0})

	e := &MeaningMatchEvaluator{}
	result, err := e.Evaluate(nil, response, 0, nil)

	require.NoError(t, err)
	assert.Equal(t, 55, result.XPEarned) // 60s is <= 60, so speed bonus applies
}

func TestMeaningMatch_JustOverBoundary(t *testing.T) {
	response, _ := json.Marshal(meaningMatchResponse{TotalTimeSeconds: 61, MismatchCount: 0})

	e := &MeaningMatchEvaluator{}
	result, err := e.Evaluate(nil, response, 0, nil)

	require.NoError(t, err)
	assert.Equal(t, 35, result.XPEarned) // no speed bonus
}

func TestMeaningMatch_ZeroTime(t *testing.T) {
	response, _ := json.Marshal(meaningMatchResponse{TotalTimeSeconds: 0, MismatchCount: 0})

	e := &MeaningMatchEvaluator{}
	result, err := e.Evaluate(nil, response, 0, nil)

	require.NoError(t, err)
	assert.Equal(t, 55, result.XPEarned) // 0 <= 60, full bonus
}

// --- Conversation Edge Cases ---

func TestConversation_EmptyUserResponse(t *testing.T) {
	content, _ := json.Marshal(conversationContent{
		EvaluationRubric: evaluationRubric{
			VocabularyKeywords: []string{"test"},
		},
	})
	response, _ := json.Marshal(conversationResponse{UserResponseText: ""})

	e := &ConversationEvaluator{aiClient: nil}
	result, err := e.Evaluate(content, response, 0, nil)

	require.NoError(t, err)
	assert.NotNil(t, result.Score)
	assert.Equal(t, 0, result.LivesLost) // never lose lives
}

func TestConversation_VeryLongResponse(t *testing.T) {
	longText := ""
	for i := 0; i < 100; i++ {
		longText += "troponin pending heart damage understand concern "
	}

	content, _ := json.Marshal(conversationContent{
		EvaluationRubric: evaluationRubric{
			VocabularyKeywords: []string{"troponin", "pending"},
			ToneKeywords:       []string{"understand", "concern"},
		},
		IdealResponses: []string{"ideal"},
	})
	response, _ := json.Marshal(conversationResponse{UserResponseText: longText})

	e := &ConversationEvaluator{aiClient: nil}
	result, err := e.Evaluate(content, response, 0, nil)

	require.NoError(t, err)
	assert.True(t, result.XPEarned > 0) // all keywords should match
}

func TestConversation_NoKeywordsInRubric(t *testing.T) {
	content, _ := json.Marshal(conversationContent{
		EvaluationRubric: evaluationRubric{},
	})
	response, _ := json.Marshal(conversationResponse{UserResponseText: "some text"})

	e := &ConversationEvaluator{aiClient: nil}
	result, err := e.Evaluate(content, response, 0, nil)

	require.NoError(t, err)
	assert.NotNil(t, result.Score)
}

// --- Registry Edge Cases ---

func TestRegistry_UnknownType(t *testing.T) {
	reg := NewRegistry(nil)
	_, err := reg.Get("unknown_type")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "unknown exercise type")
}

func TestRegistry_AllTypesRegistered(t *testing.T) {
	reg := NewRegistry(nil)
	for _, typ := range []string{"sentence_arrangement", "word_puzzle", "meaning_match", "conversation"} {
		e, err := reg.Get(typ)
		assert.NoError(t, err, "type %s should be registered", typ)
		assert.NotNil(t, e)
	}
}
