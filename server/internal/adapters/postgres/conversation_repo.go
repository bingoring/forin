package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/ports"
)

// ConversationRepo persists dialogue sessions/turns + corrections (sqlc).
type ConversationRepo struct {
	pool *pgxpool.Pool
	q    *sqlc.Queries
}

func NewConversationRepo(pool *pgxpool.Pool) *ConversationRepo {
	return &ConversationRepo{pool: pool, q: sqlc.New(pool)}
}

func (r *ConversationRepo) CreateSession(ctx context.Context, userID, scenarioID string) (string, error) {
	return r.q.CreateSession(ctx, sqlc.CreateSessionParams{UserID: userID, ScenarioID: scenarioID})
}

func (r *ConversationRepo) GetSession(ctx context.Context, sessionID string) (*ports.ConversationSession, error) {
	s, err := r.q.GetSession(ctx, sessionID)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &ports.ConversationSession{ID: s.ID, UserID: s.UserID, ScenarioID: s.ScenarioID}, nil
}

func (r *ConversationRepo) AppendTurn(ctx context.Context, sessionID, role, content string) error {
	return r.q.AppendTurn(ctx, sqlc.AppendTurnParams{SessionID: sessionID, Role: role, Content: content})
}

func (r *ConversationRepo) History(ctx context.Context, sessionID string, limit int) ([]ports.ConversationTurn, error) {
	rows, err := r.q.SessionHistory(ctx, sqlc.SessionHistoryParams{SessionID: sessionID, Limit: int32(limit)})
	if err != nil {
		return nil, err
	}
	out := make([]ports.ConversationTurn, 0, len(rows))
	for _, t := range rows {
		out = append(out, ports.ConversationTurn{Role: t.Role, Content: t.Content})
	}
	return out, nil
}

// LatestSessionWithTurns treats "no rows" as "nothing to resume" rather than an
// error: a learner opening a scenario for the first time is the normal case, and
// the caller should not have to distinguish that from a real failure.
func (r *ConversationRepo) DiscardSession(ctx context.Context, userID, sessionID string) (bool, error) {
	n, err := r.q.DiscardSession(ctx, sqlc.DiscardSessionParams{ID: sessionID, UserID: userID})
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

func (r *ConversationRepo) LatestSessionWithTurns(ctx context.Context, userID, scenarioID string) (string, int, error) {
	row, err := r.q.LatestSessionWithTurns(ctx, sqlc.LatestSessionWithTurnsParams{UserID: userID, ScenarioID: scenarioID})
	if errors.Is(err, pgx.ErrNoRows) {
		return "", 0, nil
	}
	if err != nil {
		return "", 0, err
	}
	return row.ID, int(row.TurnCount), nil
}

func (r *ConversationRepo) SaveCorrection(ctx context.Context, userID, original, corrected, note, topicTag string) error {
	return r.q.InsertCorrection(ctx, sqlc.InsertCorrectionParams{
		UserID: userID, Original: original, Corrected: corrected, Note: note, TopicTag: topicTag})
}
