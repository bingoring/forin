package main

import (
	"context"
	"sort"

	"github.com/jackc/pgx/v5/pgxpool"
)

// missingIDs returns the referenced ids the bundle does not carry, sorted.
// Content is supposed to grow; a bundle that shrinks is more likely an accident
// than an intentional retirement.
func missingIDs(bundle, referenced map[string]bool) []string {
	var missing []string
	for id := range referenced {
		if !bundle[id] {
			missing = append(missing, id)
		}
	}
	sort.Strings(missing)
	return missing
}

// referencedInDB collects content ids that durable learner state points at.
//
// Only durable state counts. user_presence.scenario_id (where someone is right
// now) and user_daily_event_sets.scenario_ids (regenerated at 00:00) are
// transient — blocking a retirement because someone walked past a scenario
// yesterday would make content impossible to retire.
func referencedInDB(ctx context.Context, pool *pgxpool.Pool) (map[string]bool, error) {
	const q = `
		SELECT DISTINCT scenario_id FROM scenario_attempts      WHERE scenario_id <> ''
		UNION
		SELECT DISTINCT scenario_id FROM review_cards           WHERE scenario_id <> ''
		UNION
		SELECT DISTINCT scenario_id FROM conversation_sessions  WHERE scenario_id <> ''`
	rows, err := pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	ids := map[string]bool{}
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids[id] = true
	}
	return ids, rows.Err()
}
