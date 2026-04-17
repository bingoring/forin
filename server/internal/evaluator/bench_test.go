package evaluator

import (
	"encoding/json"
	"testing"
)

func BenchmarkSentenceArrangement(b *testing.B) {
	content, _ := json.Marshal(sentenceArrangementContent{
		TargetSentence: "I completely understand that you're feeling better, Mr. Johnson.",
		WordTiles:      []string{"I", "completely", "understand", "that", "you're", "feeling", "better,", "Mr.", "Johnson.", "totally", "great"},
	})
	response, _ := json.Marshal(sentenceArrangementResponse{
		Answer: []string{"I", "completely", "understand", "that", "you're", "feeling", "better,", "Mr.", "Johnson."},
	})

	e := &SentenceArrangementEvaluator{}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		e.Evaluate(content, response, 10, nil)
	}
}

func BenchmarkWordPuzzle(b *testing.B) {
	content, _ := json.Marshal(wordPuzzleContent{
		Blanks: []wordPuzzleBlank{
			{Index: 0, CorrectAnswer: "troponin"},
			{Index: 1, CorrectAnswer: "damage"},
			{Index: 2, CorrectAnswer: "results"},
		},
	})
	response, _ := json.Marshal(wordPuzzleResponse{
		Answers: []wordPuzzleAnswer{
			{BlankIndex: 0, SelectedOption: "troponin"},
			{BlankIndex: 1, SelectedOption: "damage"},
			{BlankIndex: 2, SelectedOption: "results"},
		},
	})

	e := &WordPuzzleEvaluator{}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		e.Evaluate(content, response, 30, nil)
	}
}

func BenchmarkMeaningMatch(b *testing.B) {
	response, _ := json.Marshal(meaningMatchResponse{TotalTimeSeconds: 45, MismatchCount: 2})

	e := &MeaningMatchEvaluator{}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		e.Evaluate(nil, response, 0, nil)
	}
}

func BenchmarkConversationFallback(b *testing.B) {
	content, _ := json.Marshal(conversationContent{
		EvaluationRubric: evaluationRubric{
			VocabularyKeywords:    []string{"troponin", "pending", "heart", "risk", "damage"},
			ToneKeywords:          []string{"understand", "concern", "appreciate", "right"},
			RequiredContentPoints: []string{"acknowledge", "explain", "risk", "timeline"},
		},
		IdealResponses: []string{"I understand your concern..."},
	})
	response, _ := json.Marshal(conversationResponse{
		UserResponseText: "I understand your concern about the pending troponin test results. There is a risk of heart damage.",
	})

	e := &ConversationEvaluator{aiClient: nil} // fallback mode
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		e.Evaluate(content, response, 0, nil)
	}
}
