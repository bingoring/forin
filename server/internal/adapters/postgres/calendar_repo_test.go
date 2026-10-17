package postgres

import (
	"context"
	"testing"
	"time"
)

// A day's stamps on the home calendar (v47) show which department each cleared
// scenario came from. The department is the scenario's event ward, upper-cased to the
// code the client keys icons by; a scenario with no row (removed content) still lists,
// with no department, rather than dropping out of the day.
func TestCalendarEntriesCarryTheScenarioDept(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewProgressRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	if _, err := pool.Exec(ctx,
		`INSERT INTO events (id, profession, title, ward, category, tier, delivery)
		 VALUES ('EVT-T-CAL-ICU', 'nurse', 't', 'icu', 'clinical', 1, 'daily')
		 ON CONFLICT (id) DO NOTHING`); err != nil {
		t.Fatalf("insert event: %v", err)
	}
	if _, err := pool.Exec(ctx,
		`INSERT INTO scenarios (id, profession, event_id, title)
		 VALUES ('SCN-T-CAL-ICU', 'nurse', 'EVT-T-CAL-ICU', 'cal icu')
		 ON CONFLICT (id) DO NOTHING`); err != nil {
		t.Fatalf("insert scenario: %v", err)
	}
	for _, sc := range []string{"SCN-T-CAL-ICU", "SCN-T-CAL-GONE"} {
		if _, err := pool.Exec(ctx,
			`INSERT INTO scenario_attempts (user_id, scenario_id, state, score) VALUES ($1, $2, 'cleared', 0)`,
			uid, sc); err != nil {
			t.Fatalf("insert attempt %s: %v", sc, err)
		}
	}

	now := time.Now()
	entries, _, err := repo.CalendarEntries(ctx, uid, now.Add(-time.Hour), now.Add(time.Hour), "UTC")
	if err != nil {
		t.Fatalf("calendar entries: %v", err)
	}
	got := map[string]string{}
	for _, e := range entries {
		got[e.ScenarioID] = e.Dept
	}
	if d, ok := got["SCN-T-CAL-ICU"]; !ok || d != "ICU" {
		t.Errorf("seeded scenario dept = %q (listed %v), want ICU", d, ok)
	}
	if d, ok := got["SCN-T-CAL-GONE"]; !ok || d != "" {
		t.Errorf("unknown scenario must still list with no dept: dept %q, listed %v", d, ok)
	}
}
