package postgres

import (
	"context"
	"testing"
)

// A situation you played and did not pass must not come back looking untouched.
//
// The list used to read only the cleared rows, so "tried it yesterday and failed" and
// "never opened it" were the same card — tagged NEW. That is the one thing the learner
// cannot work out from anywhere else, and it decides whether they replay it or skip it.
func TestAttemptStatesDistinguishesTriedFromNeverPlayed(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewContentRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	ins := func(scenario, state string) {
		t.Helper()
		if _, err := pool.Exec(ctx,
			`INSERT INTO scenario_attempts (user_id, scenario_id, state, score) VALUES ($1, $2, $3, 0)`,
			uid, scenario, state); err != nil {
			t.Fatalf("insert %s/%s: %v", scenario, state, err)
		}
	}
	ins("SCN-T-PASS", "cleared")
	ins("SCN-T-FAIL", "attempted")

	got := repo.attemptStates(ctx, uid)
	if got["SCN-T-PASS"] != "cleared" {
		t.Errorf("passed scenario = %q", got["SCN-T-PASS"])
	}
	if got["SCN-T-FAIL"] != "attempted" {
		t.Errorf("failed scenario = %q, want attempted", got["SCN-T-FAIL"])
	}
	if _, ok := got["SCN-T-NEVER"]; ok {
		t.Error("a scenario never played got a state")
	}
}

// Replaying something you passed and doing worse does not un-pass it. Row order is not
// guaranteed, so both orderings are exercised.
func TestAttemptStatesClearedOutranksAttempted(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewContentRepo(pool)
	ctx := context.Background()

	for _, order := range [][]string{{"cleared", "attempted"}, {"attempted", "cleared"}} {
		uid := speechTestUser(t, pool)
		for _, st := range order {
			if _, err := pool.Exec(ctx,
				`INSERT INTO scenario_attempts (user_id, scenario_id, state, score) VALUES ($1, 'SCN-T-BOTH', $2, 0)`,
				uid, st); err != nil {
				t.Fatalf("insert: %v", err)
			}
		}
		if got := repo.attemptStates(ctx, uid)["SCN-T-BOTH"]; got != "cleared" {
			t.Errorf("order %v -> %q, want cleared", order, got)
		}
	}
}

// The tag precedence: progress before urgency. Urgency is still on s.Urgent, so nothing
// is lost by letting the single tag carry the thing only it can say.
func TestSituationCardTagPrecedence(t *testing.T) {
	// difficulty 4 => Urgent
	hard := []byte(`{"difficulty":4}`)
	easy := []byte(`{"difficulty":1}`)

	for _, tc := range []struct {
		name      string
		briefing  []byte
		states    map[string]string
		wantTag   string
		wantUrgnt bool
	}{
		{"cleared beats urgent", hard, map[string]string{"X": "cleared"}, "cleared", true},
		{"attempted beats urgent", hard, map[string]string{"X": "attempted"}, "attempted", true},
		{"urgent when untouched", hard, nil, "urgent", true},
		{"new when untouched and easy", easy, nil, "new", false},
		{"attempted on an easy one", easy, map[string]string{"X": "attempted"}, "attempted", false},
	} {
		got := situationCard("X", "title", tc.briefing, tc.states)
		if got.TagCode != tc.wantTag {
			t.Errorf("%s: tag = %q, want %q", tc.name, got.TagCode, tc.wantTag)
		}
		// Urgency survives the tag being used for progress — the client keeps its accent.
		if got.Urgent != tc.wantUrgnt {
			t.Errorf("%s: urgent = %v, want %v", tc.name, got.Urgent, tc.wantUrgnt)
		}
	}
}
