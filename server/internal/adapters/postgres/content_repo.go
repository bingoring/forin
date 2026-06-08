package postgres

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// ContentRepo serves authored content and ingests bundles. Implements
// ports.ContentReader and ports.ContentSeeder.
//
// NOTE: hand-written pgx for this increment; Stage 2-2 (next increment) moves
// these queries to sqlc-generated code.
type ContentRepo struct{ pool *pgxpool.Pool }

func NewContentRepo(pool *pgxpool.Pool) *ContentRepo { return &ContentRepo{pool: pool} }

// Seed replaces all content in one transaction (file-sourced full replace).
func (r *ContentRepo) Seed(ctx context.Context, b *content.Bundle) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	for _, t := range []string{"phrases", "quizzes", "scenarios", "events", "departments"} {
		if _, err := tx.Exec(ctx, "DELETE FROM "+t); err != nil {
			return err
		}
	}
	for _, d := range b.Departments {
		if _, err := tx.Exec(ctx,
			`INSERT INTO departments (id, profession, ward, name_ko, name_en, color) VALUES ($1,$2,$3,$4,$5,$6)`,
			d.ID, d.Profession, d.Ward, d.NameKo, d.NameEn, d.Color); err != nil {
			return err
		}
	}
	for _, e := range b.Events {
		if _, err := tx.Exec(ctx,
			`INSERT INTO events (id, profession, title, ward, category, tier, tags, delivery, prerequisites, follow_ups, related, scenarios)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
			e.ID, e.Profession, e.Title, e.Ward, string(e.Category), e.Tier,
			jsonb(e.Tags), string(e.Delivery), jsonb(e.Prerequisites), jsonb(e.FollowUps), jsonb(e.Related), jsonb(e.Scenarios)); err != nil {
			return err
		}
	}
	for _, s := range b.Scenarios {
		if _, err := tx.Exec(ctx,
			`INSERT INTO scenarios (id, profession, event_id, title, tagline, goals, guardrails, key_phrases, steps)
			 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
			s.ID, s.Profession, s.EventID, s.Title, s.Tagline,
			jsonb(s.Goals), jsonb(s.Guardrails), jsonb(s.KeyPhrases), jsonb(s.Steps)); err != nil {
			return err
		}
	}
	for _, q := range b.Quizzes {
		if _, err := tx.Exec(ctx,
			`INSERT INTO quizzes (id, profession, type, title) VALUES ($1,$2,$3,$4)`,
			q.ID, q.Profession, q.Type, q.Title); err != nil {
			return err
		}
	}
	for _, p := range b.Phrases {
		if _, err := tx.Exec(ctx,
			`INSERT INTO phrases (id, profession, ko, en, note, tag) VALUES ($1,$2,$3,$4,$5,$6)`,
			p.ID, p.Profession, p.Ko, p.En, p.Note, p.Tag); err != nil {
			return err
		}
	}
	if _, err := tx.Exec(ctx,
		`INSERT INTO content_meta (k, v) VALUES ('contentVersion', $1)
		 ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v`, b.Manifest.ContentVersion); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (r *ContentRepo) Manifest(ctx context.Context) (*content.Manifest, error) {
	m := &content.Manifest{}
	err := r.pool.QueryRow(ctx, `SELECT v FROM content_meta WHERE k = 'contentVersion'`).Scan(&m.ContentVersion)
	if errors.Is(err, pgx.ErrNoRows) {
		return m, nil
	}
	return m, err
}

func (r *ContentRepo) ListEvents(ctx context.Context, profession string) ([]content.Event, error) {
	return r.queryEvents(ctx,
		`SELECT id,profession,title,ward,category,tier,tags,delivery,prerequisites,follow_ups,related,scenarios
		 FROM events WHERE ($1 = '' OR profession = $1 OR profession = 'common') ORDER BY tier, id`, profession)
}

func (r *ContentRepo) TodaysBoard(ctx context.Context, profession string, limit int) ([]content.Event, error) {
	return r.queryEvents(ctx,
		`SELECT id,profession,title,ward,category,tier,tags,delivery,prerequisites,follow_ups,related,scenarios
		 FROM events WHERE delivery IN ('daily_pool','both') AND ($1 = '' OR profession = $1 OR profession = 'common')
		 ORDER BY tier, id LIMIT $2`, profession, limit)
}

func (r *ContentRepo) queryEvents(ctx context.Context, sql string, args ...any) ([]content.Event, error) {
	rows, err := r.pool.Query(ctx, sql, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []content.Event
	for rows.Next() {
		var e content.Event
		var cat, del string
		var tags, pre, fol, rel, scn []byte
		if err := rows.Scan(&e.ID, &e.Profession, &e.Title, &e.Ward, &cat, &e.Tier,
			&tags, &del, &pre, &fol, &rel, &scn); err != nil {
			return nil, err
		}
		e.Category, e.Delivery = content.EventCategory(cat), content.Delivery(del)
		unjson(tags, &e.Tags)
		unjson(pre, &e.Prerequisites)
		unjson(fol, &e.FollowUps)
		unjson(rel, &e.Related)
		unjson(scn, &e.Scenarios)
		out = append(out, e)
	}
	return out, rows.Err()
}

func (r *ContentRepo) GetScenario(ctx context.Context, id string) (*content.Scenario, error) {
	var s content.Scenario
	var goals, guards, phrases, steps []byte
	err := r.pool.QueryRow(ctx,
		`SELECT id,profession,event_id,title,tagline,goals,guardrails,key_phrases,steps FROM scenarios WHERE id = $1`, id).
		Scan(&s.ID, &s.Profession, &s.EventID, &s.Title, &s.Tagline, &goals, &guards, &phrases, &steps)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	unjson(goals, &s.Goals)
	unjson(guards, &s.Guardrails)
	unjson(phrases, &s.KeyPhrases)
	unjson(steps, &s.Steps)
	return &s, nil
}

func jsonb(v any) []byte {
	b, _ := json.Marshal(v)
	return b
}

func unjson(b []byte, dst any) {
	if len(b) > 0 {
		_ = json.Unmarshal(b, dst)
	}
}
