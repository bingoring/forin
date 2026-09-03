package postgres

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/lounge"
)

// LoungeRepo implements ports.LoungeRepo over the sqlc-generated queries.
type LoungeRepo struct {
	pool *pgxpool.Pool
	q    *sqlc.Queries
}

func NewLoungeRepo(pool *pgxpool.Pool) *LoungeRepo {
	return &LoungeRepo{pool: pool, q: sqlc.New(pool)}
}

// Create stores a cleaned draft and returns the new post's id.
//
// Nothing else is read back: the caller already knows who is posting and what it
// wrote, and the id is the one thing only the database can say.
func (r *LoungeRepo) Create(ctx context.Context, authorID string, d lounge.Draft) (id string, err error) {
	var snippet []byte
	if d.Snippet != nil {
		if snippet, err = json.Marshal(d.Snippet); err != nil {
			return "", err
		}
	}
	// tags is NOT NULL in the table and a nil slice binds as NULL, so a tagless
	// post from any caller that skipped Draft.Clean would fail the insert.
	tags := d.Tags
	if tags == nil {
		tags = []string{}
	}
	row, err := r.q.CreateLoungePost(ctx, sqlc.CreateLoungePostParams{
		AuthorID:   authorID,
		Kind:       string(d.Kind),
		Body:       d.Body,
		Tags:       tags,
		ScenarioID: d.ScenarioID,
		Snippet:    snippet,
	})
	if err != nil {
		return "", err
	}
	return row.ID, nil
}

// Feed returns one page, newest first. `before` pages backwards in time rather
// than by offset: a new post arriving between two reads shifts every offset by
// one, which shows the reader a row they have already seen.
func (r *LoungeRepo) Feed(ctx context.Context, readerID string, before *time.Time, limit int) ([]lounge.Post, error) {
	arg := sqlc.LoungeFeedParams{UserID: readerID, Limit: int32(limit)}
	if before != nil {
		// Valid:true is what makes the NULL check in the query fall through to the
		// comparison; a zero Timestamptz with Valid:false reads as "no cursor".
		arg.Before = pgtype.Timestamptz{Time: *before, Valid: true}
	}
	rows, err := r.q.LoungeFeed(ctx, arg)
	if err != nil {
		return nil, err
	}
	out := make([]lounge.Post, 0, len(rows))
	for _, row := range rows {
		p := lounge.Post{
			ID:          row.ID,
			AuthorID:    row.AuthorID,
			AuthorName:  row.AuthorName,
			AuthorJob:   row.AuthorJob,
			AuthorDest:  row.AuthorDestination,
			AuthorLevel: row.AuthorLevel,
			Kind:        lounge.Kind(row.Kind),
			Body:        row.Body,
			Tags:        row.Tags,
			ScenarioID:  row.ScenarioID,
			Cheers:      row.Cheers,
			Cheered:     row.Cheered,
			Mine:        row.AuthorID == readerID,
			CreatedAt:   row.CreatedAt.Time,
		}
		// A snippet that will not parse is dropped rather than failing the page: one
		// bad row must not blank the whole lounge for everyone.
		if len(row.Snippet) > 0 {
			var s lounge.Snippet
			if json.Unmarshal(row.Snippet, &s) == nil && len(s.Turns) > 0 {
				p.Snippet = &s
			}
		}
		out = append(out, p)
	}
	return out, nil
}

func (r *LoungeRepo) PostsToday(ctx context.Context, authorID string) (int, error) {
	return r.q.LoungePostsToday(ctx, authorID)
}

// Delete soft-deletes the author's own post. Returns ErrNotAuthor when the post
// exists but belongs to somebody else, so the handler can answer 403 rather than
// reporting a success that did nothing.
func (r *LoungeRepo) Delete(ctx context.Context, postID, byUserID string) error {
	owner, err := r.q.LoungePostAuthor(ctx, postID)
	if errors.Is(err, pgx.ErrNoRows) {
		return pgx.ErrNoRows
	}
	if err != nil {
		return err
	}
	if owner != byUserID {
		return lounge.ErrNotAuthor
	}
	return r.q.SoftDeleteLoungePost(ctx, sqlc.SoftDeleteLoungePostParams{ID: postID, AuthorID: byUserID})
}

// SetCheer adds or removes one cheer and keeps the cached counter in step.
//
// Both statements run in ONE transaction, and the counter moves only when the
// cheer row actually changed: a double tap inserts nothing (ON CONFLICT DO
// NOTHING), so bumping unconditionally would let one reader run the number up.
func (r *LoungeRepo) SetCheer(ctx context.Context, postID, userID string, on bool) (int, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return 0, err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	var changed int64
	if on {
		changed, err = q.CheerLoungePost(ctx, sqlc.CheerLoungePostParams{PostID: postID, UserID: userID})
	} else {
		changed, err = q.UncheerLoungePost(ctx, sqlc.UncheerLoungePostParams{PostID: postID, UserID: userID})
	}
	if err != nil {
		return 0, err
	}
	if changed > 0 {
		delta := 1
		if !on {
			delta = -1
		}
		if err := q.BumpLoungeCheers(ctx, sqlc.BumpLoungeCheersParams{ID: postID, Delta: delta}); err != nil {
			return 0, err
		}
	}
	var total int
	if err := tx.QueryRow(ctx, `SELECT cheers FROM lounge_posts WHERE id = $1`, postID).Scan(&total); err != nil {
		return 0, err
	}
	return total, tx.Commit(ctx)
}

func (r *LoungeRepo) Report(ctx context.Context, postID, userID, reason string) error {
	return r.q.ReportLoungePost(ctx, sqlc.ReportLoungePostParams{PostID: postID, UserID: userID, Reason: reason})
}
