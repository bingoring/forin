package postgres

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/domain/colleague"
)

// ColleagueRepo implements ports.ColleagueRepo. These tables sit outside the sqlc
// CRUD surface (like progress aggregates), so the queries are written directly.
type ColleagueRepo struct{ pool *pgxpool.Pool }

func NewColleagueRepo(pool *pgxpool.Pool) *ColleagueRepo { return &ColleagueRepo{pool: pool} }

// ── invite codes ───────────────────────────────────────────────────────────

func (r *ColleagueRepo) ActiveCode(ctx context.Context, userID string) (*colleague.InviteCode, error) {
	var c colleague.InviteCode
	err := r.pool.QueryRow(ctx,
		`SELECT code, user_id, relation, expires_at, max_uses, uses
		   FROM invite_codes
		  WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > now() AND uses < max_uses`,
		userID).Scan(&c.Code, &c.UserID, &c.Relation, &c.ExpiresAt, &c.MaxUses, &c.Uses)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *ColleagueRepo) SaveCode(ctx context.Context, c colleague.InviteCode) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	// Revoke first: the partial unique index allows only one active code per user.
	if _, err := tx.Exec(ctx,
		`UPDATE invite_codes SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, c.UserID); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx,
		`INSERT INTO invite_codes (code, user_id, relation, expires_at, max_uses, uses)
		 VALUES ($1,$2,$3,$4,$5,0)`,
		c.Code, c.UserID, string(c.Relation), c.ExpiresAt, c.MaxUses); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (r *ColleagueRepo) CodeOwner(ctx context.Context, code string) (*colleague.InviteCode, error) {
	var c colleague.InviteCode
	err := r.pool.QueryRow(ctx,
		`SELECT code, user_id, relation, expires_at, max_uses, uses
		   FROM invite_codes
		  WHERE code = $1 AND revoked_at IS NULL AND expires_at > now() AND uses < max_uses`,
		code).Scan(&c.Code, &c.UserID, &c.Relation, &c.ExpiresAt, &c.MaxUses, &c.Uses)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &c, nil
}

// ── links ──────────────────────────────────────────────────────────────────

func (r *ColleagueRepo) Links(ctx context.Context, userID string) ([]colleague.Link, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT other_id, relation, created_at FROM colleague_links
		  WHERE owner_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []colleague.Link{}
	for rows.Next() {
		l := colleague.Link{OwnerID: userID}
		if err := rows.Scan(&l.OtherID, &l.Relation, &l.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, l)
	}
	return out, rows.Err()
}

func (r *ColleagueRepo) Linked(ctx context.Context, userID, otherID string) (bool, error) {
	var n int
	err := r.pool.QueryRow(ctx,
		`SELECT count(*) FROM colleague_links WHERE owner_id = $1 AND other_id = $2`, userID, otherID).Scan(&n)
	return n > 0, err
}

func (r *ColleagueRepo) LinkCount(ctx context.Context, userID string) (int, error) {
	var n int
	err := r.pool.QueryRow(ctx, `SELECT count(*) FROM colleague_links WHERE owner_id = $1`, userID).Scan(&n)
	return n, err
}

func (r *ColleagueRepo) Unlink(ctx context.Context, userID, otherID string) error {
	// Both rows go together, or neither does (INV-2).
	_, err := r.pool.Exec(ctx,
		`DELETE FROM colleague_links
		  WHERE (owner_id = $1 AND other_id = $2) OR (owner_id = $2 AND other_id = $1)`,
		userID, otherID)
	return err
}

// ── requests ───────────────────────────────────────────────────────────────

func (r *ColleagueRepo) PendingRequest(ctx context.Context, fromID, toID string) (*colleague.Request, error) {
	var q colleague.Request
	err := r.pool.QueryRow(ctx,
		`SELECT id, from_user_id, to_user_id, relation, status, created_at
		   FROM colleague_requests
		  WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'pending'`,
		fromID, toID).Scan(&q.ID, &q.FromUserID, &q.ToUserID, &q.Relation, &q.Status, &q.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &q, nil
}

func (r *ColleagueRepo) CreateRequest(ctx context.Context, q colleague.Request, code string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	if _, err := tx.Exec(ctx,
		`INSERT INTO colleague_requests (from_user_id, to_user_id, relation, code, status)
		 VALUES ($1,$2,$3,$4,'pending')`,
		q.FromUserID, q.ToUserID, string(q.Relation), code); err != nil {
		return err
	}
	if code != "" {
		// Consuming a use and creating the request must be atomic (INV-4).
		if _, err := tx.Exec(ctx,
			`UPDATE invite_codes SET uses = uses + 1 WHERE code = $1 AND uses < max_uses`, code); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}

func (r *ColleagueRepo) InboxRequests(ctx context.Context, userID string) ([]colleague.Request, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, from_user_id, to_user_id, relation, status, created_at
		   FROM colleague_requests WHERE to_user_id = $1 AND status = 'pending'
		  ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []colleague.Request{}
	for rows.Next() {
		var q colleague.Request
		if err := rows.Scan(&q.ID, &q.FromUserID, &q.ToUserID, &q.Relation, &q.Status, &q.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, q)
	}
	return out, rows.Err()
}

// AcceptRequest flips the request and writes BOTH link rows in one transaction.
// The mirrored relation comes from colleague.Mirror, so a mentor request makes
// the requester a mentee on the other side.
func (r *ColleagueRepo) AcceptRequest(ctx context.Context, requestID, byUserID string) (*colleague.Request, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var q colleague.Request
	err = tx.QueryRow(ctx,
		`SELECT id, from_user_id, to_user_id, relation, status, created_at
		   FROM colleague_requests WHERE id = $1 FOR UPDATE`, requestID).
		Scan(&q.ID, &q.FromUserID, &q.ToUserID, &q.Relation, &q.Status, &q.CreatedAt)
	if err != nil {
		return nil, err
	}
	if q.ToUserID != byUserID || q.Status != colleague.StatusPending {
		return nil, pgx.ErrNoRows // caller maps this to 404/403
	}

	// requester's view: the accepter relates to them as q.Relation.
	if _, err := tx.Exec(ctx,
		`INSERT INTO colleague_links (owner_id, other_id, relation) VALUES ($1,$2,$3)
		 ON CONFLICT (owner_id, other_id) DO NOTHING`,
		q.FromUserID, q.ToUserID, string(q.Relation)); err != nil {
		return nil, err
	}
	if _, err := tx.Exec(ctx,
		`INSERT INTO colleague_links (owner_id, other_id, relation) VALUES ($1,$2,$3)
		 ON CONFLICT (owner_id, other_id) DO NOTHING`,
		q.ToUserID, q.FromUserID, string(colleague.Mirror[q.Relation])); err != nil {
		return nil, err
	}
	if _, err := tx.Exec(ctx,
		`UPDATE colleague_requests SET status = 'accepted', responded_at = now() WHERE id = $1`, q.ID); err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	q.Status = colleague.StatusAccepted
	return &q, nil
}

func (r *ColleagueRepo) SetRequestStatus(ctx context.Context, requestID, byUserID string, status colleague.RequestStatus) error {
	// decline is the recipient's call; cancel is the sender's.
	col := "to_user_id"
	if status == colleague.StatusCancelled {
		col = "from_user_id"
	}
	tag, err := r.pool.Exec(ctx,
		`UPDATE colleague_requests SET status = $1, responded_at = now()
		  WHERE id = $2 AND `+col+` = $3 AND status = 'pending'`,
		string(status), requestID, byUserID)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

// ── cheers ─────────────────────────────────────────────────────────────────

// AddCheer stores the cheer and fills in the DB-generated id/timestamp, so the
// caller can hand a complete object back to the client.
func (r *ColleagueRepo) AddCheer(ctx context.Context, c *colleague.Cheer) error {
	// ids come from the DB (gen_random_uuid), matching the rest of the schema.
	return r.pool.QueryRow(ctx,
		`INSERT INTO cheers (from_user_id, to_user_id, preset, message) VALUES ($1,$2,$3,$4)
		 RETURNING id, created_at`,
		c.FromUserID, c.ToUserID, string(c.Preset), c.Message).Scan(&c.ID, &c.CreatedAt)
}

func (r *ColleagueRepo) CheersToday(ctx context.Context, fromID, toID string, since time.Time) (int, error) {
	var n int
	err := r.pool.QueryRow(ctx,
		`SELECT count(*) FROM cheers WHERE from_user_id = $1 AND to_user_id = $2 AND created_at >= $3`,
		fromID, toID, since).Scan(&n)
	return n, err
}

func (r *ColleagueRepo) Inbox(ctx context.Context, userID string, limit int) ([]colleague.Cheer, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, from_user_id, to_user_id, preset, message, created_at, read_at IS NOT NULL
		   FROM cheers WHERE to_user_id = $1 ORDER BY created_at DESC LIMIT $2`, userID, limit)
	if err != nil {
		return nil, err
	}
	return scanCheers(rows)
}

func (r *ColleagueRepo) Conversation(ctx context.Context, userID, otherID string, limit int) ([]colleague.Cheer, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, from_user_id, to_user_id, preset, message, created_at, read_at IS NOT NULL
		   FROM cheers
		  WHERE (from_user_id = $1 AND to_user_id = $2) OR (from_user_id = $2 AND to_user_id = $1)
		  ORDER BY created_at DESC LIMIT $3`, userID, otherID, limit)
	if err != nil {
		return nil, err
	}
	return scanCheers(rows)
}

func scanCheers(rows pgx.Rows) ([]colleague.Cheer, error) {
	defer rows.Close()
	out := []colleague.Cheer{}
	for rows.Next() {
		var c colleague.Cheer
		if err := rows.Scan(&c.ID, &c.FromUserID, &c.ToUserID, &c.Preset, &c.Message, &c.CreatedAt, &c.Read); err != nil {
			return nil, err
		}
		c.PresetText = colleague.PresetText[c.Preset]
		out = append(out, c)
	}
	return out, rows.Err()
}

func (r *ColleagueRepo) UnreadCheers(ctx context.Context, userID string) (int, error) {
	var n int
	err := r.pool.QueryRow(ctx, `SELECT count(*) FROM cheers WHERE to_user_id = $1 AND read_at IS NULL`, userID).Scan(&n)
	return n, err
}

func (r *ColleagueRepo) MarkCheersRead(ctx context.Context, userID string) error {
	_, err := r.pool.Exec(ctx, `UPDATE cheers SET read_at = now() WHERE to_user_id = $1 AND read_at IS NULL`, userID)
	return err
}

// ── presence ───────────────────────────────────────────────────────────────

// TouchPresence always bumps last_seen_at. scenario/label are only overwritten
// when supplied, so a plain "user opened the app" ping doesn't erase what they
// were last doing.
func (r *ColleagueRepo) TouchPresence(ctx context.Context, userID, scenarioID, label string) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO user_presence (user_id, last_seen_at, scenario_id, label, updated_at)
		 VALUES ($1, now(), $2, $3, now())
		 ON CONFLICT (user_id) DO UPDATE SET
		   last_seen_at = now(),
		   scenario_id  = CASE WHEN $2 = '' THEN user_presence.scenario_id ELSE $2 END,
		   label        = CASE WHEN $3 = '' THEN user_presence.label       ELSE $3 END,
		   updated_at   = now()`,
		userID, scenarioID, label)
	return err
}

func (r *ColleagueRepo) Presences(ctx context.Context, userIDs []string) (map[string]colleague.Presence, error) {
	out := map[string]colleague.Presence{}
	if len(userIDs) == 0 {
		return out, nil
	}
	rows, err := r.pool.Query(ctx,
		`SELECT user_id, last_seen_at, scenario_id, label FROM user_presence WHERE user_id = ANY($1)`, userIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var id string
		var p colleague.Presence
		if err := rows.Scan(&id, &p.LastSeenAt, &p.ScenarioID, &p.Label); err != nil {
			return nil, err
		}
		out[id] = p
	}
	return out, rows.Err()
}

// ── prefs ──────────────────────────────────────────────────────────────────

func (r *ColleagueRepo) Prefs(ctx context.Context, userID string) (colleague.Prefs, error) {
	p := colleague.DefaultPrefs()
	err := r.pool.QueryRow(ctx,
		`SELECT share_status, share_weekly FROM colleague_prefs WHERE user_id = $1`, userID).
		Scan(&p.ShareStatus, &p.ShareWeekly)
	if errors.Is(err, pgx.ErrNoRows) {
		return colleague.DefaultPrefs(), nil // no row = defaults
	}
	if err != nil {
		return colleague.DefaultPrefs(), err
	}
	return p, nil
}

func (r *ColleagueRepo) SetPrefs(ctx context.Context, userID string, p colleague.Prefs) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO colleague_prefs (user_id, share_status, share_weekly, updated_at)
		 VALUES ($1,$2,$3, now())
		 ON CONFLICT (user_id) DO UPDATE SET share_status = $2, share_weekly = $3, updated_at = now()`,
		userID, p.ShareStatus, p.ShareWeekly)
	return err
}
