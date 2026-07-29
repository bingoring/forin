package postgres

import (
	"context"
	"encoding/json"
	"errors"
	mathrand "math/rand"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/bingoring/forin/server/internal/adapters/postgres/sqlc"
	"github.com/bingoring/forin/server/internal/domain/content"
	"github.com/bingoring/forin/server/internal/economy"
	"github.com/bingoring/forin/server/internal/ports"
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
// for the board — stable within a calendar day, fresh each morning.
//
// Rotation is department-stratified round-robin, not a flat shuffle: a flat
// shuffle over a 300-scenario pool clustered up to 3 cards from one dept on a
// 12-slot board and left ~9 distinct depts/day. Instead we (1) rotate which
// scenario represents each dept, (2) rotate the dept order, then (3) pick
// round-robin across depts. With 24 depts > 12 slots this guarantees 12
// distinct depts/day (zero clustering) while giving every dept fair long-run
// exposure. All seeded by YYYYMMDD so the set is stable within the day.
func (r *ContentRepo) TodaysScenarios(ctx context.Context, profession string, limit int) ([]content.BoardCard, error) {
	rows, err := r.q.ListBoardScenarios(ctx, profession)
	if err != nil {
		return nil, err
	}
	// Group cards by dept. Rows arrive ORDER BY id (stable base for the seed).
	byDept := map[string][]content.BoardCard{}
	deptOrder := make([]string, 0, len(rows))
	for _, s := range rows {
		c := boardCardFromRow(s)
		dept := c.Dept
		if _, ok := byDept[dept]; !ok {
			deptOrder = append(deptOrder, dept)
		}
		byDept[dept] = append(byDept[dept], c)
	}
	sort.Strings(deptOrder)

	now := time.Now()
	seed := int64(now.Year()*10000 + int(now.Month())*100 + now.Day())
	rnd := mathrand.New(mathrand.NewSource(seed))
	// Rotate which scenario fronts each dept, then rotate the dept order.
	for _, d := range deptOrder {
		s := byDept[d]
		rnd.Shuffle(len(s), func(i, j int) { s[i], s[j] = s[j], s[i] })
	}
	rnd.Shuffle(len(deptOrder), func(i, j int) { deptOrder[i], deptOrder[j] = deptOrder[j], deptOrder[i] })

	// Round-robin one card per dept per pass until the board is full.
	out := make([]content.BoardCard, 0, limit)
	idx := make(map[string]int, len(deptOrder))
	for limit <= 0 || len(out) < limit {
		progressed := false
		for _, d := range deptOrder {
			if limit > 0 && len(out) >= limit {
				break
			}
			if i := idx[d]; i < len(byDept[d]) {
				out = append(out, byDept[d][i])
				idx[d] = i + 1
				progressed = true
			}
		}
		if !progressed {
			break
		}
	}
	return out, nil
}

// boardCardFromRow builds a BoardCard from a board-scenario row (shared by the
// global board and the personalized daily pool).
func boardCardFromRow(s sqlc.ListBoardScenariosRow) content.BoardCard {
	c := content.BoardCard{ID: s.ID, Title: s.Title, Tagline: s.Tagline, Dept: deptFromID(s.ID), Urgency: "quest"}
	if len(s.Briefing) > 0 && string(s.Briefing) != "{}" {
		var b content.Briefing
		unjson(s.Briefing, &b)
		c.DeptColor = b.DeptColor
		c.Difficulty = b.Difficulty
		c.Room = b.Dept
		c.Skills = b.Skills
		c.TimeLabel = b.TimeLabel
		switch {
		case b.Difficulty >= 3:
			c.Urgency = "urgent"
		case b.Difficulty <= 1:
			c.Urgency = "info"
		}
	}
	if len(s.Persona) > 0 && string(s.Persona) != "{}" {
		var pr content.Persona
		unjson(s.Persona, &pr)
		c.NpcName = pr.Name
		c.NpcSub = pr.Sub
	}
	return c
}

// DailyPool returns the user's personalized daily situation set (the domain's
// DailyEventSet): a weighted sample stable within their local day and refreshed
// at 00:00 local (localDate buckets the reset). The chosen ids are persisted so
// the set is immune to content-pool changes mid-day and can be topped up later
// (rewarded ad). Weighting favors uncleared scenarios and difficulty near the
// learner's level, with dept diversity.
func (r *ContentRepo) DailyPool(ctx context.Context, userID, profession, localDate string, limit int) ([]content.BoardCard, error) {
	rows, err := r.q.ListBoardScenarios(ctx, profession)
	if err != nil {
		return nil, err
	}
	byID := make(map[string]sqlc.ListBoardScenariosRow, len(rows))
	for _, s := range rows {
		byID[s.ID] = s
	}

	// Return the persisted set if one exists for this local day.
	if set, err := r.q.GetDailyEventSet(ctx, userID, localDate); err == nil && len(set.ScenarioIds) > 0 {
		var ids []string
		if json.Unmarshal(set.ScenarioIds, &ids) == nil {
			out := make([]content.BoardCard, 0, len(ids))
			for _, id := range ids {
				if s, ok := byID[id]; ok {
					out = append(out, boardCardFromRow(s))
				}
			}
			if len(out) > 0 {
				return out, nil
			}
		}
	}

	// Sample a fresh set. Learner level + already-cleared scenarios drive weights.
	level := 1
	_ = r.pool.QueryRow(ctx, `SELECT level FROM user_progress WHERE user_id = $1`, userID).Scan(&level)
	cleared := map[string]bool{}
	if crows, err := r.pool.Query(ctx, `SELECT scenario_id FROM scenario_attempts WHERE user_id = $1 AND state = 'cleared'`, userID); err == nil {
		defer crows.Close()
		for crows.Next() {
			var id string
			if crows.Scan(&id) == nil {
				cleared[id] = true
			}
		}
	}
	ids := sampleDailyPool(rows, level, cleared, localDate+userID, limit)

	if payload, err := json.Marshal(ids); err == nil {
		_ = r.q.InsertDailyEventSet(ctx, sqlc.InsertDailyEventSetParams{UserID: userID, LocalDate: localDate, ScenarioIds: payload})
	}
	out := make([]content.BoardCard, 0, len(ids))
	for _, id := range ids {
		if s, ok := byID[id]; ok {
			out = append(out, boardCardFromRow(s))
		}
	}
	return out, nil
}

// TopUpDailyPool appends `add` fresh weighted scenarios to today's set in exchange
// for a rewarded-ad view, up to `cap` grants/day. Returns the grown set, the new
// grant count, and ErrDailyCapReached when the cap is already spent.
func (r *ContentRepo) TopUpDailyPool(ctx context.Context, userID, profession, localDate string, add, cap int) ([]content.BoardCard, int, error) {
	set, err := r.q.GetDailyEventSet(ctx, userID, localDate)
	if errors.Is(err, pgx.ErrNoRows) {
		// No base set yet — build one first, then this call becomes the top-up.
		if _, e := r.DailyPool(ctx, userID, profession, localDate, economy.Active.DailyPoolSize); e != nil {
			return nil, 0, e
		}
		set, err = r.q.GetDailyEventSet(ctx, userID, localDate)
	}
	if err != nil {
		return nil, 0, err
	}
	if set.AdGrants >= cap {
		return nil, set.AdGrants, ports.ErrDailyCapReached
	}

	var ids []string
	_ = json.Unmarshal(set.ScenarioIds, &ids)
	have := map[string]bool{}
	for _, id := range ids {
		have[id] = true
	}

	rows, err := r.q.ListBoardScenarios(ctx, profession)
	if err != nil {
		return nil, 0, err
	}
	byID := make(map[string]sqlc.ListBoardScenariosRow, len(rows))
	fresh := make([]sqlc.ListBoardScenariosRow, 0, len(rows))
	for _, s := range rows {
		byID[s.ID] = s
		if !have[s.ID] {
			fresh = append(fresh, s)
		}
	}

	level := 1
	_ = r.pool.QueryRow(ctx, `SELECT level FROM user_progress WHERE user_id = $1`, userID).Scan(&level)
	cleared := map[string]bool{}
	if crows, err := r.pool.Query(ctx, `SELECT scenario_id FROM scenario_attempts WHERE user_id = $1 AND state = 'cleared'`, userID); err == nil {
		defer crows.Close()
		for crows.Next() {
			var id string
			if crows.Scan(&id) == nil {
				cleared[id] = true
			}
		}
	}

	grant := set.AdGrants + 1
	// Vary the seed per grant so repeated top-ups don't resample the same ids.
	picked := sampleDailyPool(fresh, level, cleared, localDate+userID+"topup"+strconv.Itoa(grant), add)
	ids = append(ids, picked...)

	payload, _ := json.Marshal(ids)
	if err := r.q.UpdateDailyEventSet(ctx, sqlc.UpdateDailyEventSetParams{
		UserID: userID, LocalDate: localDate, ScenarioIds: payload, AdGrants: grant}); err != nil {
		return nil, 0, err
	}
	out := make([]content.BoardCard, 0, len(ids))
	for _, id := range ids {
		if s, ok := byID[id]; ok {
			out = append(out, boardCardFromRow(s))
		}
	}
	return out, grant, nil
}

// sampleDailyPool picks `limit` scenario ids by weighted sampling-without-
// replacement, seeded deterministically by `seed` so an un-persisted resample is
// stable. Weight = unclearedBoost × levelFit; a max of 2 per dept keeps variety.
func sampleDailyPool(rows []sqlc.ListBoardScenariosRow, level int, cleared map[string]bool, seed string, limit int) []string {
	// preferred difficulty band by level (difficulty is 1..3 on the board)
	lo, hi := 1, 2
	if level >= economy.Active.RankJunior {
		lo, hi = 2, 3
	}
	type cand struct {
		id, dept string
		weight   float64
	}
	cands := make([]cand, 0, len(rows))
	for _, s := range rows {
		diff := 2
		if len(s.Briefing) > 0 {
			var b content.Briefing
			unjson(s.Briefing, &b)
			if b.Difficulty > 0 {
				diff = b.Difficulty
			}
		}
		w := 1.0
		if cleared[s.ID] {
			w *= economy.Active.DailyClearedWeight // prefer new content
		}
		if diff < lo || diff > hi {
			w *= economy.Active.DailyOffBandWeight // off-band but still possible
		}
		cands = append(cands, cand{id: s.ID, dept: deptFromID(s.ID), weight: w})
	}

	rnd := mathrand.New(mathrand.NewSource(seedHash(seed)))
	picked := make([]string, 0, limit)
	deptCount := map[string]int{}
	for len(picked) < limit && len(cands) > 0 {
		total := 0.0
		for _, c := range cands {
			total += c.weight
		}
		if total <= 0 {
			break
		}
		x := rnd.Float64() * total
		sel := 0
		for i, c := range cands {
			x -= c.weight
			if x <= 0 {
				sel = i
				break
			}
		}
		c := cands[sel]
		cands = append(cands[:sel], cands[sel+1:]...) // remove (no replacement)
		if deptCount[c.dept] >= economy.Active.DailyDeptCap {
			continue // cap per dept for variety
		}
		deptCount[c.dept]++
		picked = append(picked, c.id)
	}
	return picked
}

// seedHash turns a string seed into a stable int64 (FNV-1a).
func seedHash(s string) int64 {
	var h uint64 = 1469598103934665603
	for i := 0; i < len(s); i++ {
		h ^= uint64(s[i])
		h *= 1099511628211
	}
	return int64(h & 0x7fffffffffffffff)
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
