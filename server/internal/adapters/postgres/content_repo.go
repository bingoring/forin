package postgres

import (
	"context"
	"encoding/json"
	"errors"
	mathrand "math/rand"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/content"
)

// ContentRepo serves authored content and ingests bundles via sqlc.
type ContentRepo struct {
	pool *pgxpool.Pool
	q    *sqlc.Queries
}

func NewContentRepo(pool *pgxpool.Pool) *ContentRepo {
	return &ContentRepo{pool: pool, q: sqlc.New(pool)}
}

// Seed replaces all content in one transaction (file-sourced full replace).
func (r *ContentRepo) Seed(ctx context.Context, b *content.Bundle) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	q := r.q.WithTx(tx)

	for _, del := range []func(context.Context) error{
		q.DeletePhrases, q.DeleteQuizzes, q.DeleteScenarios, q.DeleteEvents, q.DeleteInteriors, q.DeleteDepartments,
	} {
		if err := del(ctx); err != nil {
			return err
		}
	}
	for _, d := range b.Departments {
		if err := q.InsertDepartment(ctx, sqlc.InsertDepartmentParams{
			ID: d.ID, Profession: d.Profession, Ward: d.Ward, NameKo: d.NameKo, NameEn: d.NameEn, Color: d.Color}); err != nil {
			return err
		}
	}
	for _, in := range b.Interiors {
		if err := q.InsertInterior(ctx, sqlc.InsertInteriorParams{
			ID: in.ID, Profession: in.Profession, DeptID: in.DeptID, Cols: in.Cols, Rows: in.Rows,
			PlayerStart: jsonb(in.PlayerStart), FloorTheme: in.FloorTheme,
			Regions: jsonb(in.Regions), Rooms: jsonb(in.Rooms), Objects: jsonb(in.Objects), Hotspots: jsonb(in.Hotspots),
			Collision: jsonb(in.Collision)}); err != nil {
			return err
		}
	}
	for _, e := range b.Events {
		if err := q.InsertEvent(ctx, sqlc.InsertEventParams{
			ID: e.ID, Profession: e.Profession, Title: e.Title, Ward: e.Ward, Category: string(e.Category), Tier: e.Tier,
			Tags: jsonb(e.Tags), Delivery: string(e.Delivery), Prerequisites: jsonb(e.Prerequisites),
			FollowUps: jsonb(e.FollowUps), Related: jsonb(e.Related), Scenarios: jsonb(e.Scenarios)}); err != nil {
			return err
		}
	}
	for _, s := range b.Scenarios {
		if err := q.InsertScenario(ctx, sqlc.InsertScenarioParams{
			ID: s.ID, Profession: s.Profession, EventID: s.EventID, Title: s.Title, Tagline: s.Tagline,
			Persona: jsonb(s.Persona), Goals: jsonb(s.Goals), Guardrails: jsonb(s.Guardrails),
			KeyPhrases: jsonb(s.KeyPhrases), Steps: jsonb(s.Steps), Briefing: jsonb(s.Briefing)}); err != nil {
			return err
		}
	}
	for _, qz := range b.Quizzes {
		if err := q.InsertQuiz(ctx, sqlc.InsertQuizParams{ID: qz.ID, Profession: qz.Profession, Type: qz.Type, Title: qz.Title, Content: jsonb(qz.Content)}); err != nil {
			return err
		}
	}
	for _, p := range b.Phrases {
		if err := q.InsertPhrase(ctx, sqlc.InsertPhraseParams{
			ID: p.ID, Profession: p.Profession, Ko: p.Ko, En: p.En, Note: p.Note, Tag: p.Tag}); err != nil {
			return err
		}
	}
	if err := q.UpsertContentMeta(ctx, sqlc.UpsertContentMetaParams{K: "manifest", V: string(jsonb(b.Manifest))}); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (r *ContentRepo) Manifest(ctx context.Context) (*content.Manifest, error) {
	raw, err := r.q.GetContentMeta(ctx, "manifest")
	if errors.Is(err, pgx.ErrNoRows) {
		return &content.Manifest{}, nil
	}
	if err != nil {
		return nil, err
	}
	m := &content.Manifest{}
	unjson([]byte(raw), m)
	return m, nil
}

func (r *ContentRepo) ListDepartments(ctx context.Context, profession string) ([]content.Department, error) {
	rows, err := r.q.ListDepartments(ctx, profession)
	if err != nil {
		return nil, err
	}
	out := make([]content.Department, 0, len(rows))
	for _, d := range rows {
		out = append(out, content.Department{
			ID: d.ID, Profession: d.Profession, Ward: d.Ward, NameKo: d.NameKo, NameEn: d.NameEn, Color: d.Color})
	}
	return out, nil
}

func (r *ContentRepo) GetInterior(ctx context.Context, id string) (*content.Interior, error) {
	in, err := r.q.GetInterior(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	out := &content.Interior{ID: in.ID, Profession: in.Profession, DeptID: in.DeptID,
		Cols: in.Cols, Rows: in.Rows, FloorTheme: in.FloorTheme}
	unjson(in.PlayerStart, &out.PlayerStart)
	unjson(in.Regions, &out.Regions)
	unjson(in.Rooms, &out.Rooms)
	unjson(in.Objects, &out.Objects)
	unjson(in.Hotspots, &out.Hotspots)
	unjson(in.Collision, &out.Collision)
	return out, nil
}

func (r *ContentRepo) ListEvents(ctx context.Context, profession string) ([]content.Event, error) {
	rows, err := r.q.ListEvents(ctx, profession)
	if err != nil {
		return nil, err
	}
	return eventsFromModels(rows), nil
}

func (r *ContentRepo) TodaysBoard(ctx context.Context, profession string, limit int) ([]content.Event, error) {
	rows, err := r.q.TodaysBoard(ctx, sqlc.TodaysBoardParams{Column1: profession, Limit: int32(limit)})
	if err != nil {
		return nil, err
	}
	return eventsFromModels(rows), nil
}

func (r *ContentRepo) GetScenario(ctx context.Context, id string) (*content.Scenario, error) {
	s, err := r.q.GetScenario(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	out := &content.Scenario{ID: s.ID, Profession: s.Profession, EventID: s.EventID, Title: s.Title, Tagline: s.Tagline}
	unjson(s.Persona, &out.Persona)
	unjson(s.Goals, &out.Goals)
	unjson(s.Guardrails, &out.Guardrails)
	unjson(s.KeyPhrases, &out.KeyPhrases)
	unjson(s.Steps, &out.Steps)
	if len(s.Briefing) > 0 && string(s.Briefing) != "{}" {
		var b content.Briefing
		unjson(s.Briefing, &b)
		out.Briefing = &b
	}
	return out, nil
}

// TodaysScenarios returns a deterministic daily-rotated set of scenario cards
// for the board — stable within a calendar day, fresh each morning. Groups all
// eligible (daily_pool/both) scenarios, seeds a shuffle by the date, takes limit.
func (r *ContentRepo) TodaysScenarios(ctx context.Context, profession string, limit int) ([]content.BoardCard, error) {
	rows, err := r.q.ListBoardScenarios(ctx, profession)
	if err != nil {
		return nil, err
	}
	cards := make([]content.BoardCard, 0, len(rows))
	for _, s := range rows {
		c := content.BoardCard{ID: s.ID, Title: s.Title, Tagline: s.Tagline, Dept: deptFromID(s.ID), Urgency: "quest"}
		if len(s.Briefing) > 0 && string(s.Briefing) != "{}" {
			var b content.Briefing
			unjson(s.Briefing, &b)
			c.DeptColor = b.DeptColor
			switch {
			case b.Difficulty >= 3:
				c.Urgency = "urgent"
			case b.Difficulty <= 1:
				c.Urgency = "info"
			}
		}
		cards = append(cards, c)
	}
	// Deterministic daily rotation: seed by YYYYMMDD so the set is stable per day.
	now := time.Now()
	seed := int64(now.Year()*10000 + int(now.Month())*100 + now.Day())
	rnd := mathrand.New(mathrand.NewSource(seed))
	rnd.Shuffle(len(cards), func(i, j int) { cards[i], cards[j] = cards[j], cards[i] })
	if limit > 0 && len(cards) > limit {
		cards = cards[:limit]
	}
	return cards, nil
}

// deptFromID pulls the dept code out of an id like "SCN-ONCO-00002" → "ONCO".
func deptFromID(id string) string {
	parts := strings.Split(id, "-")
	if len(parts) >= 2 {
		return parts[1]
	}
	return ""
}

func (r *ContentRepo) GetQuiz(ctx context.Context, id string) (*content.Quiz, error) {
	qz, err := r.q.GetQuiz(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	out := &content.Quiz{ID: qz.ID, Profession: qz.Profession, Type: qz.Type, Title: qz.Title}
	if len(qz.Content) > 0 && string(qz.Content) != "{}" {
		var c content.QuizContent
		unjson(qz.Content, &c)
		out.Content = &c
	}
	return out, nil
}

func eventsFromModels(rows []sqlc.Event) []content.Event {
	out := make([]content.Event, 0, len(rows))
	for _, e := range rows {
		c := content.Event{ID: e.ID, Profession: e.Profession, Title: e.Title, Ward: e.Ward,
			Category: content.EventCategory(e.Category), Tier: e.Tier, Delivery: content.Delivery(e.Delivery)}
		unjson(e.Tags, &c.Tags)
		unjson(e.Prerequisites, &c.Prerequisites)
		unjson(e.FollowUps, &c.FollowUps)
		unjson(e.Related, &c.Related)
		unjson(e.Scenarios, &c.Scenarios)
		out = append(out, c)
	}
	return out
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
