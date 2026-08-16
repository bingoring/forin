package postgres

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/ports"
)

// SpeechRepo implements ports.SpeechRepo via sqlc.
type SpeechRepo struct {
	pool *pgxpool.Pool
	q    *sqlc.Queries
}

func NewSpeechRepo(pool *pgxpool.Pool) *SpeechRepo {
	return &SpeechRepo{pool: pool, q: sqlc.New(pool)}
}

// InsertAttempt appends one attempt + its phoneme rows in a single transaction
// (business-rules I2). attempt_no is assigned by the INSERT ... SELECT MAX+1
// statement itself (I5), which is race-safe against duplicate DATA but not
// against duplicate REQUESTS: two concurrent calls for the same
// (user_id, sentence_key) can compute the same MAX and both attempt to insert
// it, so exactly one of them trips the UNIQUE(user_id, sentence_key, attempt_no)
// constraint (23505). That is retried once — the retry re-reads MAX inside a
// fresh transaction, so it naturally picks the next free number.
func (r *SpeechRepo) InsertAttempt(ctx context.Context, a ports.SpeechAttemptInput) (string, int, error) {
	id, attemptNo, err := r.insertAttemptOnce(ctx, a)
	if isUniqueViolation(err) {
		id, attemptNo, err = r.insertAttemptOnce(ctx, a)
	}
	if err != nil {
		return "", 0, err
	}
	return id, attemptNo, nil
}

func (r *SpeechRepo) insertAttemptOnce(ctx context.Context, a ports.SpeechAttemptInput) (string, int, error) {
	wordsJSON, err := json.Marshal(a.Words)
	if err != nil {
		return "", 0, err
	}

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return "", 0, err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	// ProsodyOK=false means the scorer never assessed prosody for this attempt —
	// that must land as SQL NULL, never as 0 (domain-entities: NULL and "scored
	// zero" are different facts).
	var prosody pgtype.Float4
	if a.ProsodyOK {
		prosody = pgtype.Float4{Float32: float32(a.Prosody), Valid: true}
	}

	var reviewCard pgtype.UUID
	if a.ReviewCardID != nil {
		if err := reviewCard.Scan(*a.ReviewCardID); err != nil {
			return "", 0, err
		}
	}

	row, err := q.InsertSpeechAttempt(ctx, sqlc.InsertSpeechAttemptParams{
		UserID:        a.UserID,
		SentenceKey:   a.SentenceKey,
		ReferenceText: a.ReferenceText,
		Locale:        a.Locale,
		Recognized:    a.Recognized,
		Overall:       a.Overall,
		Accuracy:      a.Accuracy,
		Fluency:       a.Fluency,
		Completeness:  a.Completeness,
		Prosody:       prosody,
		DurationMs:    a.DurationMS,
		Words:         wordsJSON,
		ScenarioID:    a.ScenarioID,
		ReviewCardID:  reviewCard,
		Origin:        a.Origin,
	})
	if err != nil {
		return "", 0, err
	}

	// speech_phoneme_scores is derived from Words, not passed separately: one row
	// per (word, phoneme) observation, written in the SAME transaction as the
	// attempt so the drill's future aggregate never sees phonemes without their
	// attempt (I2).
	for _, w := range a.Words {
		for _, p := range w.Phonemes {
			if err := q.InsertPhonemeScore(ctx, sqlc.InsertPhonemeScoreParams{
				AttemptID: row.ID,
				UserID:    a.UserID,
				Phoneme:   p.Phoneme,
				Accuracy:  p.Accuracy,
			}); err != nil {
				return "", 0, err
			}
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return "", 0, err
	}
	return row.ID, row.AttemptNo, nil
}

// isUniqueViolation reports whether err is a Postgres unique_violation (23505).
func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}

// ListAttempts returns up to `limit` attempts, newest attempt_no first.
func (r *SpeechRepo) ListAttempts(ctx context.Context, userID, sentenceKey string, limit int) ([]ports.SpeechAttemptRow, error) {
	rows, err := r.q.ListSpeechAttempts(ctx, sqlc.ListSpeechAttemptsParams{
		UserID: userID, SentenceKey: sentenceKey, Limit: int32(limit),
	})
	if err != nil {
		return nil, err
	}
	out := make([]ports.SpeechAttemptRow, 0, len(rows))
	for _, d := range rows {
		var words []ports.WordScore
		if len(d.Words) > 0 {
			if err := json.Unmarshal(d.Words, &words); err != nil {
				return nil, err
			}
		}
		out = append(out, ports.SpeechAttemptRow{
			ID:           d.ID,
			AttemptNo:    d.AttemptNo,
			Recognized:   d.Recognized,
			Overall:      d.Overall,
			Accuracy:     d.Accuracy,
			Fluency:      d.Fluency,
			Completeness: d.Completeness,
			Prosody:      float64(d.Prosody.Float32),
			ProsodyOK:    d.Prosody.Valid,
			DurationMS:   d.DurationMs,
			Words:        words,
			CreatedAt:    d.CreatedAt.Time,
		})
	}
	return out, nil
}

// GetReference fetches the cached canonical breakdown, or nil if none exists yet.
func (r *SpeechRepo) GetReference(ctx context.Context, sentenceKey string) (*ports.SentenceReferenceRow, error) {
	d, err := r.q.GetSpeechReference(ctx, sentenceKey)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var words []ports.WordScore
	if len(d.Words) > 0 {
		if err := json.Unmarshal(d.Words, &words); err != nil {
			return nil, err
		}
	}
	return &ports.SentenceReferenceRow{
		SentenceKey:   d.SentenceKey,
		ReferenceText: d.ReferenceText,
		Locale:        d.Locale,
		IPA:           d.Ipa,
		Words:         words,
		DurationMS:    d.DurationMs,
	}, nil
}

// PutReference caches a freshly-derived breakdown. First writer wins (R9: the
// breakdown is deterministic per sentence_key, so ON CONFLICT DO NOTHING is
// safe — a race just means one caller's Azure round trip goes unused).
func (r *SpeechRepo) PutReference(ctx context.Context, ref ports.SentenceReferenceRow) error {
	wordsJSON, err := json.Marshal(ref.Words)
	if err != nil {
		return err
	}
	return r.q.PutSpeechReference(ctx, sqlc.PutSpeechReferenceParams{
		SentenceKey:   ref.SentenceKey,
		ReferenceText: ref.ReferenceText,
		Locale:        ref.Locale,
		Ipa:           ref.IPA,
		Words:         wordsJSON,
		DurationMs:    ref.DurationMS,
	})
}
