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
			KeyPhrases: jsonb(s.KeyPhrases), Steps: jsonb(s.Steps), Briefing: jsonb(s.Briefing),
			Acuity: s.Acuity}); err != nil {
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
	out := &content.Scenario{ID: s.ID, Profession: s.Profession, EventID: s.EventID, Title: s.Title, Tagline: s.Tagline, Acuity: s.Acuity}
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

// MainRoute computes the user's curriculum path (domain MainRoute): main-route
// events ordered by tier, each tagged completed / available / locked. Completion
// is derived from cleared attempts (no separate progress table); an event is
// available once all its prerequisites are completed. Scales as content grows.
func (r *ContentRepo) MainRoute(ctx context.Context, userID, profession string) ([]content.RouteNode, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, title, tier, prerequisites FROM events
		 WHERE delivery IN ('main_route','both') AND ($1 = '' OR profession = $1 OR profession = 'common')
		 ORDER BY tier, id`, profession)
	if err != nil {
		return nil, err
	}
	type ev struct {
		id, title string
		tier      int
		prereqs   []string
	}
	var evs []ev
	for rows.Next() {
		var e ev
		var raw []byte
		if err := rows.Scan(&e.id, &e.title, &e.tier, &raw); err != nil {
			rows.Close()
			return nil, err
		}
		if len(raw) > 0 {
			_ = json.Unmarshal(raw, &e.prereqs)
		}
		evs = append(evs, e)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Representative entry scenario per event (lowest id).
	scenByEvent := map[string]string{}
	if srows, err := r.pool.Query(ctx,
		`SELECT DISTINCT ON (event_id) event_id, id FROM scenarios ORDER BY event_id, id`); err == nil {
		defer srows.Close()
		for srows.Next() {
			var eid, sid string
			if srows.Scan(&eid, &sid) == nil {
				scenByEvent[eid] = sid
			}
		}
	}

	// Events the user has completed (cleared any of their scenarios), and events they
	// have merely played. `tried` does NOT unlock anything — prerequisites are checked
	// against `done` — it only lets the list say "you have been here".
	done := map[string]bool{}
	tried := map[string]bool{}
	if crows, err := r.pool.Query(ctx,
		`SELECT DISTINCT s.event_id, a.state FROM scenario_attempts a JOIN scenarios s ON s.id = a.scenario_id
		 WHERE a.user_id = $1 AND a.state IN ('cleared', 'attempted')`, userID); err == nil {
		defer crows.Close()
		for crows.Next() {
			var eid, st string
			if crows.Scan(&eid, &st) != nil {
				continue
			}
			if st == "cleared" {
				done[eid] = true
			} else {
				tried[eid] = true
			}
		}
	}

	out := make([]content.RouteNode, 0, len(evs))
	for _, e := range evs {
		state := "available"
		if done[e.id] {
			state = "completed"
		} else {
			for _, p := range e.prereqs {
				if !done[p] {
					state = "locked"
					break
				}
			}
		}
		out = append(out, content.RouteNode{
			EventID: e.id, Title: e.title, Tier: e.tier, State: state,
			ScenarioID: scenByEvent[e.id], Prerequisites: e.prereqs,
			// Only meaningful where it adds something: a completed node was obviously
			// attempted, and a locked one cannot have been.
			Attempted: state == "available" && tried[e.id],
		})
	}
	return out, nil
}

// DeptSituations lists a department's scenarios as situation cards (v19 dept
// sheet), tagged cleared/urgent/new from difficulty + the user's cleared attempts.
// Department = the id prefix (SCN-<DEPT>-*), so a new dept needs no new query.
// Paginated by offset/limit (stable ORDER BY id) so a single-department learner
// can scroll the full bank; hasMore is true when more rows follow this page.
// clearedSet is the learner's cleared scenario ids, for tagging cards.
//
// Absence is not an error here: a failed read means "nothing known to be cleared", which
// renders every card as new rather than failing a list the learner asked for.
// attemptStates maps a scenario to how far the learner has got with it: "cleared"
// (passed) or "attempted" (played, graded below the bar). Absent = never opened.
//
// It used to read only the cleared rows, which made "tried it and did not pass"
// indistinguishable from "never seen it" — a situation you failed yesterday came back
// tagged NEW. The learner cannot decide what to do next from that.
//
// cleared outranks attempted per scenario: replaying a passed situation and doing worse
// does not un-pass it. MAX() over the two literals happens to order them correctly
// ('cleared' > 'attempted' alphabetically), but relying on that is a trap for the next
// state name, so the precedence is explicit.
func (r *ContentRepo) attemptStates(ctx context.Context, userID string) map[string]string {
	states := map[string]string{}
	rows, err := r.pool.Query(ctx,
		`SELECT scenario_id, state FROM scenario_attempts
		  WHERE user_id = $1 AND state IN ('cleared', 'attempted')`, userID)
	if err != nil {
		return states
	}
	defer rows.Close()
	for rows.Next() {
		var id, st string
		if rows.Scan(&id, &st) != nil {
			continue
		}
		if states[id] == "cleared" {
			continue // already the strongest state for this scenario
		}
		states[id] = st
	}
	return states
}

// situationCard turns one scenario row into the card both the per-department list and
// the search share.
//
// Extracted rather than copied: the level, the minutes, the urgency and the tag are four
// derivations, and a second inline copy of them is a second place for the same card to
// come out differently depending on which list you found it in.
func situationCard(id, title string, briefing []byte, states map[string]string) content.DeptSituation {
	s := content.DeptSituation{ScenarioID: id, Name: title, Lv: "B1", Min: 6}
	diff := 2
	if len(briefing) > 0 && string(briefing) != "{}" {
		var b content.Briefing
		unjson(briefing, &b)
		if b.Difficulty > 0 {
			diff = b.Difficulty
		}
		if b.Dept != "" {
			s.Room = b.Dept
		}
		if m := minutesOf(b.TimeLabel); m > 0 {
			s.Min = m
		}
	}
	s.Lv = cefrForDifficulty(diff)
	if s.Min == 6 {
		s.Min = 4 + diff // fall back to a difficulty-based estimate
	}
	s.Urgent = diff >= 3
	// Code only — the repo has no request locale, and inventing one here is how a
	// display string ends up baked into storage. The handler renders the label.
	// Progress outranks urgency, because urgency is already carried separately on
	// s.Urgent (the client keeps its own accent for that). What the single tag is FOR is
	// telling the learner whether they have been here — which is the thing they cannot
	// get from anywhere else on the card.
	switch {
	case states[id] == "cleared":
		s.TagCode = "cleared"
	case states[id] == "attempted":
		s.TagCode = "attempted"
	case s.Urgent:
		s.TagCode = "urgent"
	default:
		s.TagCode = "new"
	}
	return s
}

func (r *ContentRepo) DeptSituations(ctx context.Context, userID, dept string, offset, limit int) ([]content.DeptSituation, bool, error) {
	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	states := r.attemptStates(ctx, userID)

	// Fetch limit+1 to detect whether another page follows, then trim.
	rows, err := r.pool.Query(ctx,
		`SELECT id, title, briefing FROM scenarios WHERE id LIKE $1 ORDER BY id LIMIT $2 OFFSET $3`,
		"SCN-"+dept+"-%", limit+1, offset)
	if err != nil {
		return nil, false, err
	}
	defer rows.Close()
	out := []content.DeptSituation{}
	for rows.Next() {
		var id, title string
		var briefing []byte
		if err := rows.Scan(&id, &title, &briefing); err != nil {
			return nil, false, err
		}
		out = append(out, situationCard(id, title, briefing, states))
	}
	if err := rows.Err(); err != nil {
		return nil, false, err
	}
	hasMore := len(out) > limit
	if hasMore {
		out = out[:limit] // drop the probe row
	}
	return out, hasMore, nil
}

// SearchSituations finds situations by title, across every department.
//
// One search box instead of "which ward would you like to look in first" — the client
// cannot answer that on the learner's behalf, and asking is the whole cost search was
// meant to remove.
func (r *ContentRepo) SearchSituations(ctx context.Context, userID, q string, limit int) ([]content.DeptSituation, error) {
	q = strings.TrimSpace(q)
	if q == "" {
		return []content.DeptSituation{}, nil
	}
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	states := r.attemptStates(ctx, userID)
	// ILIKE with the pattern built by the driver, never by string concatenation. Percent
	// and underscore in the query are escaped so a learner typing "50%" searches for
	// "50%" instead of matching everything.
	pattern := "%" + strings.NewReplacer("\\", "\\\\", "%", "\\%", "_", "\\_").Replace(q) + "%"
	rows, err := r.pool.Query(ctx,
		`SELECT id, title, briefing FROM scenarios
		  WHERE id LIKE 'SCN-%' AND title ILIKE $1
		  ORDER BY id LIMIT $2`,
		pattern, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []content.DeptSituation{}
	for rows.Next() {
		var id, title string
		var briefing []byte
		if err := rows.Scan(&id, &title, &briefing); err != nil {
			return nil, err
		}
		out = append(out, situationCard(id, title, briefing, states))
	}
	return out, rows.Err()
}

// cefrForDifficulty maps an authored difficulty (1..3) to a CEFR band for display.
func cefrForDifficulty(diff int) string {
	switch {
	case diff <= 1:
		return "A2"
	case diff == 2:
		return "B1"
	default:
		return "B2"
	}
}

// minutesOf pulls a minute count out of a time label like "약 6분" / "6 min".
func minutesOf(label string) int {
	n, cur := 0, 0
	found := false
	for _, ch := range label {
		if ch >= '0' && ch <= '9' {
			cur = cur*10 + int(ch-'0')
			found = true
		} else if found {
			n = cur
			break
		}
	}
	if found && n == 0 {
		n = cur
	}
	return n
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
	if set, err := r.q.GetDailyEventSet(ctx, sqlc.GetDailyEventSetParams{UserID: userID, LocalDate: localDate}); err == nil && len(set.ScenarioIds) > 0 {
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
	ids := sampleDailyPool(rows, level, cleared, localDate+userID, limit, nil)

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
	// Ensure a base set exists so the row lock below has a target (idempotent).
	if _, err := r.q.GetDailyEventSet(ctx, sqlc.GetDailyEventSetParams{UserID: userID, LocalDate: localDate}); errors.Is(err, pgx.ErrNoRows) {
		if _, e := r.DailyPool(ctx, userID, profession, localDate, economy.Active.DailyPoolSize); e != nil {
			return nil, 0, e
		}
	} else if err != nil {
		return nil, 0, err
	}

	// Serialize the read-check-write on today's row: concurrent double-taps can't
	// each pass the cap check and then clobber each other (race / lost update).
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, 0, err
	}
	defer tx.Rollback(ctx)

	var raw []byte
	var grants int
	if err := tx.QueryRow(ctx,
		`SELECT scenario_ids, ad_grants FROM daily_event_sets WHERE user_id = $1 AND local_date = $2 FOR UPDATE`,
		userID, localDate).Scan(&raw, &grants); err != nil {
		return nil, 0, err
	}
	if grants >= cap {
		return nil, grants, ports.ErrDailyCapReached
	}

	var ids []string
	_ = json.Unmarshal(raw, &ids)
	have := map[string]bool{}
	deptSeed := map[string]int{} // depts already in the set → enforce the cap cumulatively
	for _, id := range ids {
		have[id] = true
		deptSeed[deptFromID(id)]++
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
	_ = tx.QueryRow(ctx, `SELECT level FROM user_progress WHERE user_id = $1`, userID).Scan(&level)
	cleared := map[string]bool{}
	if crows, err := tx.Query(ctx, `SELECT scenario_id FROM scenario_attempts WHERE user_id = $1 AND state = 'cleared'`, userID); err == nil {
		for crows.Next() {
			var id string
			if crows.Scan(&id) == nil {
				cleared[id] = true
			}
		}
		crows.Close()
	}

	grant := grants + 1
	// Vary the seed per grant so repeated top-ups don't resample the same ids.
	picked := sampleDailyPool(fresh, level, cleared, localDate+userID+"topup"+strconv.Itoa(grant), add, deptSeed)
	ids = append(ids, picked...)

	payload, _ := json.Marshal(ids)
	if _, err := tx.Exec(ctx,
		`UPDATE daily_event_sets SET scenario_ids = $3, ad_grants = $4 WHERE user_id = $1 AND local_date = $2`,
		userID, localDate, payload, grant); err != nil {
		return nil, 0, err
	}
	if err := tx.Commit(ctx); err != nil {
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
// stable. Weight = unclearedBoost × levelFit; the per-dept cap is enforced
// cumulatively — deptSeed carries counts already in the day's set so a top-up
// can't push a dept past the cap across base + grants.
func sampleDailyPool(rows []sqlc.ListBoardScenariosRow, level int, cleared map[string]bool, seed string, limit int, deptSeed map[string]int) []string {
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
	for d, n := range deptSeed { // seed with depts already in the day's set
		deptCount[d] = n
	}
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
