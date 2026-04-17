package evaluator

import "fmt"

// Registry maps exercise types to their evaluators.
type Registry struct {
	evaluators map[string]Evaluator
}

// NewRegistry creates a registry with all built-in evaluators.
func NewRegistry(aiClient AIClient) *Registry {
	return &Registry{
		evaluators: map[string]Evaluator{
			"sentence_arrangement": &SentenceArrangementEvaluator{},
			"word_puzzle":          &WordPuzzleEvaluator{},
			"meaning_match":       &MeaningMatchEvaluator{},
			"conversation":        &ConversationEvaluator{aiClient: aiClient},
		},
	}
}

// Get returns the evaluator for the given exercise type.
func (r *Registry) Get(exerciseType string) (Evaluator, error) {
	e, ok := r.evaluators[exerciseType]
	if !ok {
		return nil, fmt.Errorf("unknown exercise type: %s", exerciseType)
	}
	return e, nil
}
