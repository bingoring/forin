package dto

import (
	"encoding/json"

	"github.com/google/uuid"
)

// --- Responses ---

type ProfessionsResponse struct {
	Professions []ProfessionResponse `json:"professions"`
}

type CountryResponse struct {
	Code    string `json:"code"`
	Name    string `json:"name"`
	FlagURL string `json:"flag_url"`
	Accent  string `json:"accent"`
}

type CountriesResponse struct {
	Countries []CountryResponse `json:"countries"`
}

// --- Assessment ---

type AssessmentAnswer struct {
	QuestionID     uuid.UUID       `json:"question_id"     binding:"required"`
	SelectedOption *string         `json:"selected_option"`
	AnswerTokens   json.RawMessage `json:"answer_tokens"`
}

type AssessmentSubmitRequest struct {
	ProfessionID  uuid.UUID          `json:"profession_id"  binding:"required"`
	TargetCountry string             `json:"target_country" binding:"required"`
	Answers       []AssessmentAnswer `json:"answers"        binding:"required"`
}

type AssessmentSubmitResponse struct {
	DeterminedLevel           string                    `json:"determined_level"`
	Score                     int                       `json:"score"`
	TotalQuestions            int                       `json:"total_questions"`
	RecommendedStartingModule *RecommendedModuleResponse `json:"recommended_starting_module"`
	SkippedStagesCount        int                       `json:"skipped_stages_count"`
}

type RecommendedModuleResponse struct {
	ID    uuid.UUID `json:"id"`
	Title string    `json:"title"`
}
