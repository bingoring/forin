package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/domain/handoff"
)

type HandoffRepo struct{ pool *pgxpool.Pool }

func NewHandoffRepo(pool *pgxpool.Pool) *HandoffRepo { return &HandoffRepo{pool: pool} }

const handoffCols = `id, scenario_id, kind, patient_name, patient_sub, coord, body, ref_scenario_id, reply_text, patient_reply, met_at, replied_at, read_at, created_at`

func scanHandoff(row pgx.Row) (handoff.Note, error) {
	var n handoff.Note
	var kind string
	var replied, read pgtype.Timestamptz
	err := row.Scan(&n.ID, &n.ScenarioID, &kind, &n.PatientName, &n.PatientSub, &n.Coord, &n.Body,
		&n.RefScenarioID, &n.ReplyText, &n.PatientReply, &n.MetAt, &replied, &read, &n.CreatedAt)
	if err != nil {
		return n, err
	}
	n.Kind = handoff.Kind(kind)
	if replied.Valid {
		t := replied.Time
		n.RepliedAt = &t
	}
	if read.Valid {
		t := read.Time
		n.ReadAt = &t
	}
	return n, nil
}

func (r *HandoffRepo) List(ctx context.Context, userID string) ([]handoff.Note, error) {
	rows, err := r.pool.Query(ctx, `SELECT `+handoffCols+` FROM handoff_notes WHERE user_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []handoff.Note{}
	for rows.Next() {
		n, err := scanHandoff(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, n)
	}
	return out, rows.Err()
}

func (r *HandoffRepo) Get(ctx context.Context, userID, id string) (*handoff.Note, error) {
	n, err := scanHandoff(r.pool.QueryRow(ctx, `SELECT `+handoffCols+` FROM handoff_notes WHERE user_id = $1 AND id = $2`, userID, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &n, nil
}

func (r *HandoffRepo) getByScenario(ctx context.Context, userID, scenarioID string) (*handoff.Note, error) {
	n, err := scanHandoff(r.pool.QueryRow(ctx, `SELECT `+handoffCols+` FROM handoff_notes WHERE user_id = $1 AND scenario_id = $2`, userID, scenarioID))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &n, nil
}

func (r *HandoffRepo) Insert(ctx context.Context, userID string, n handoff.Note) (handoff.Note, error) {
	row := r.pool.QueryRow(ctx,
		`INSERT INTO handoff_notes (user_id, scenario_id, kind, patient_name, patient_sub, coord, body, ref_scenario_id, met_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
		 ON CONFLICT (user_id, scenario_id) DO NOTHING
		 RETURNING `+handoffCols,
		userID, n.ScenarioID, string(n.Kind), n.PatientName, n.PatientSub, n.Coord, n.Body, n.RefScenarioID, n.MetAt)
	saved, err := scanHandoff(row)
	if errors.Is(err, pgx.ErrNoRows) {
		// A note for this encounter already exists (a race) — return it.
		if ex, e := r.getByScenario(ctx, userID, n.ScenarioID); e == nil && ex != nil {
			return *ex, nil
		}
		return n, nil
	}
	return saved, err
}

func (r *HandoffRepo) MarkRead(ctx context.Context, userID, id string) error {
	_, err := r.pool.Exec(ctx, `UPDATE handoff_notes SET read_at = COALESCE(read_at, now()) WHERE user_id = $1 AND id = $2`, userID, id)
	return err
}

func (r *HandoffRepo) SetReply(ctx context.Context, userID, id, reply, patientReply string) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE handoff_notes SET reply_text = $3, patient_reply = $4, replied_at = now(), read_at = COALESCE(read_at, now())
		 WHERE user_id = $1 AND id = $2`, userID, id, reply, patientReply)
	return err
}
