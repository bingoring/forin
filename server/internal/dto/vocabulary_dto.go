package dto

import "github.com/google/uuid"

type VocabularyLookupRequest struct {
	IDs []uuid.UUID `json:"ids" binding:"required,min=1,max=20"`
}

type VocabularyItem struct {
	ID           uuid.UUID `json:"id"`
	CanonicalEn  string    `json:"canonical_en"`
	Translation  string    `json:"translation"`
	Locale       string    `json:"locale"`
	PartOfSpeech string    `json:"part_of_speech"`
	Domain       string    `json:"domain"`
}

type VocabularyLookupResponse struct {
	Items []VocabularyItem `json:"items"`
}
