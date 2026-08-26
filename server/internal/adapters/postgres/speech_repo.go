package postgres

import (
	"context"
	"encoding/json"
	"errors"
	"time"

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

// Not yet wired into any constructor call (Task 3 does that), so nothing else
// forces the compiler to check this interface is actually satisfied.
var _ ports.SpeechRepo = (*SpeechRepo)(nil)

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
		SessionID:     a.SessionID,
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
// ref.ReferenceAudio (Task 11) is stored in the same row/statement so the
// segmentation and the audio bytes it was derived from can never drift apart.
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
		AudioWav:      ref.ReferenceAudio,
	})
}

// GetReferenceAudio fetches the cached reference WAV, or nil if none is
// stored (no reference derived yet, or a row that predates the audio_wav
// column — its default is an empty string, which decodes to a zero-length,
// non-nil slice; normalized to nil here so callers have one "absent" value
// to check).
func (r *SpeechRepo) GetReferenceAudio(ctx context.Context, sentenceKey string) ([]byte, error) {
	wav, err := r.q.GetSpeechReferenceAudio(ctx, sentenceKey)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if len(wav) == 0 {
		return nil, nil
	}
	return wav, nil
}

// UpdateReferenceAudio backfills audio_wav for a row that has none yet
// (review round 2, Important 1) — a no-op (not an error) if the row was
// already backfilled by a concurrent caller, or if the row doesn't exist at
// all (the WHERE clause simply matches zero rows either way; pgx does not
// treat "0 rows affected" as an error for :exec).
func (r *SpeechRepo) UpdateReferenceAudio(ctx context.Context, sentenceKey string, wav []byte) error {
	return r.q.UpdateSpeechReferenceAudio(ctx, sqlc.UpdateSpeechReferenceAudioParams{
		SentenceKey: sentenceKey,
		AudioWav:    wav,
	})
}

// ListSessionSpeech returns the sentences spoken during one dialogue run, in the
// order they were said.
func (r *SpeechRepo) ListSessionSpeech(ctx context.Context, userID, sessionID string) ([]ports.SpokenSentenceRow, error) {
	rows, err := r.q.ListSessionSpeech(ctx, sqlc.ListSessionSpeechParams{UserID: userID, SessionID: sessionID})
	if err != nil {
		return nil, err
	}
	out := make([]ports.SpokenSentenceRow, 0, len(rows))
	for _, d := range rows {
		out = append(out, ports.SpokenSentenceRow{
			SentenceKey:   d.SentenceKey,
			ReferenceText: d.ReferenceText,
			Recognized:    d.Recognized,
			Overall:       d.Overall,
			Accuracy:      d.Accuracy,
			Fluency:       d.Fluency,
			Completeness:  d.Completeness,
			Attempts:      d.AttemptNo,
			CreatedAt:     d.CreatedAt.Time,
		})
	}
	return out, nil
}

// SpeakBands returns the player's score-band distribution over every sentence
// they have spoken.
func (r *SpeechRepo) SpeakBands(ctx context.Context, userID string) (ports.SpeakBandCounts, error) {
	d, err := r.q.SpeakBands(ctx, userID)
	if err != nil {
		return ports.SpeakBandCounts{}, err
	}
	return ports.SpeakBandCounts{Total: d.Total, Low: d.Low, Mid: d.Mid, High: d.High}, nil
}

// ListSpokenSentences returns one page of the player's spoken sentences, plus the
// unpaged total so the caller can render "N문장 중 M개 표시" without a second query.
//
// weakestFirst picks between the two sorts the list screen offers (약한 순 /
// 최신). They are separate SQL statements rather than one with a computed ORDER
// BY: an ORDER BY built from a parameter cannot use an index, and sqlc would not
// type-check it.
func (r *SpeechRepo) ListSpokenSentences(ctx context.Context, userID string, weakestFirst bool, dept string, limit, offset int) ([]ports.SpokenSentenceRow, int, error) {
	type row struct {
		sentenceKey, referenceText, recognized, scenarioID, origin string
		overall, accuracy, fluency, completeness                   float64
		attemptNo, total                                           int
		createdAt                                                  time.Time
	}
	var raw []row
	if weakestFirst {
		rows, err := r.q.ListSpeakSentencesWeak(ctx, sqlc.ListSpeakSentencesWeakParams{
			UserID: userID, Dept: dept, Lim: int32(limit), Off: int32(offset),
		})
		if err != nil {
			return nil, 0, err
		}
		for _, d := range rows {
			raw = append(raw, row{d.SentenceKey, d.ReferenceText, d.Recognized, d.ScenarioID, d.Origin,
				d.Overall, d.Accuracy, d.Fluency, d.Completeness, d.AttemptNo, int(d.Total), d.CreatedAt.Time})
		}
	} else {
		rows, err := r.q.ListSpeakSentencesRecent(ctx, sqlc.ListSpeakSentencesRecentParams{
			UserID: userID, Dept: dept, Lim: int32(limit), Off: int32(offset),
		})
		if err != nil {
			return nil, 0, err
		}
		for _, d := range rows {
			raw = append(raw, row{d.SentenceKey, d.ReferenceText, d.Recognized, d.ScenarioID, d.Origin,
				d.Overall, d.Accuracy, d.Fluency, d.Completeness, d.AttemptNo, int(d.Total), d.CreatedAt.Time})
		}
	}

	// total rides on every row, so an empty page (offset past the end) reports 0.
	// The caller already holds the real total from page 1 in that case.
	total := 0
	out := make([]ports.SpokenSentenceRow, 0, len(raw))
	for _, d := range raw {
		total = d.total
		out = append(out, ports.SpokenSentenceRow{
			SentenceKey:   d.sentenceKey,
			ReferenceText: d.referenceText,
			Recognized:    d.recognized,
			Overall:       d.overall,
			Accuracy:      d.accuracy,
			Fluency:       d.fluency,
			Completeness:  d.completeness,
			Attempts:      d.attemptNo,
			ScenarioID:    d.scenarioID,
			Origin:        d.origin,
			CreatedAt:     d.createdAt,
		})
	}
	return out, total, nil
}

// SpokenDepartments lists every department the learner has spoken in.
func (r *SpeechRepo) SpokenDepartments(ctx context.Context, userID string) ([]string, error) {
	rows, err := r.q.SpokenDepartments(ctx, userID)
	if err != nil {
		return nil, err
	}
	out := make([]string, 0, len(rows))
	for _, d := range rows {
		if d != "" {
			out = append(out, d)
		}
	}
	return out, nil
}
