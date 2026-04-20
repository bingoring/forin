package repository

import (
	"context"
	"testing"

	"github.com/forin/server/internal/model"
	"github.com/forin/server/internal/testutil"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetByIDsWithTranslation_FallsBackToCanonical(t *testing.T) {
	db := testutil.NewTestDB(t)
	tx := testutil.TxDB(t, db)

	repo := NewVocabularyRepository(tx)

	painID := uuid.New()
	woundID := uuid.New()
	require.NoError(t, tx.Create(&model.Vocabulary{
		ID: painID, CanonicalEn: "pain-test-" + painID.String()[:8],
		PartOfSpeech: "noun", Domain: "symptom",
	}).Error)
	require.NoError(t, tx.Create(&model.Vocabulary{
		ID: woundID, CanonicalEn: "wound-test-" + woundID.String()[:8],
		PartOfSpeech: "noun", Domain: "symptom",
	}).Error)
	require.NoError(t, tx.Create(&model.VocabularyTranslation{
		VocabID: painID, Locale: "ko", Word: "통증",
	}).Error)
	// Intentionally no ko translation for wound — fallback expected.

	got, err := repo.GetByIDsWithTranslation(context.Background(), []uuid.UUID{painID, woundID}, "ko")
	require.NoError(t, err)
	require.Len(t, got, 2)

	byID := map[uuid.UUID]VocabularyWithTranslation{}
	for _, v := range got {
		byID[v.ID] = v
	}
	assert.Equal(t, "통증", byID[painID].Translation)
	assert.Equal(t, "ko", byID[painID].Locale)
	assert.Equal(t, "wound-test-"+woundID.String()[:8], byID[woundID].Translation)
	assert.Equal(t, "en", byID[woundID].Locale)
}

func TestGetByIDsWithTranslation_EmptyInput(t *testing.T) {
	db := testutil.NewTestDB(t)
	repo := NewVocabularyRepository(db)

	got, err := repo.GetByIDsWithTranslation(context.Background(), nil, "ko")
	require.NoError(t, err)
	assert.Nil(t, got)
}
