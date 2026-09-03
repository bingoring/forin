package postgres

import (
	"context"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/user"
)

// The audit exists so learning-tracks P2 can partition existing progress by TIME: a
// review card written before a change belonged to the previous subject. So what has to
// hold is that a change is recorded with both sides, and that the axes which did NOT
// move stay empty — a destination swap inside one language and a change of subject are
// backfilled completely differently.
func TestProfileChangeRecordsOnlyTheAxesThatMoved(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	before := user.Profile{UserID: uid, Job: "nurse", TargetLang: "en", Destination: "us"}
	after := user.Profile{UserID: uid, Job: "nurse", TargetLang: "en", Destination: "au"}
	if err := repo.RecordProfileChange(ctx, uid, before, after); err != nil {
		t.Fatalf("RecordProfileChange: %v", err)
	}

	var fj, tj, fl, tl, fd, td string
	err := pool.QueryRow(ctx,
		`SELECT from_job, to_job, from_lang, to_lang, from_dest, to_dest
		   FROM profile_changes WHERE user_id = $1 ORDER BY changed_at DESC LIMIT 1`, uid,
	).Scan(&fj, &tj, &fl, &tl, &fd, &td)
	if err != nil {
		t.Fatalf("read back: %v", err)
	}
	// The destination moved and nothing else did. Filling from_job with 'nurse' here
	// would make every destination swap look like a change of subject.
	if fd != "us" || td != "au" {
		t.Errorf("destination recorded as %q → %q", fd, td)
	}
	if fj != "" || tj != "" || fl != "" || tl != "" {
		t.Errorf("an axis that did not move was filled: job %q→%q lang %q→%q", fj, tj, fl, tl)
	}
}

func TestProfileChangeRecordsASubjectSwitch(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	before := user.Profile{UserID: uid, Job: "nurse", TargetLang: "en", Destination: "us"}
	after := user.Profile{UserID: uid, Job: "hotel", TargetLang: "de", Destination: "de"}
	if err := repo.RecordProfileChange(ctx, uid, before, after); err != nil {
		t.Fatalf("RecordProfileChange: %v", err)
	}

	var fj, tj, fl, tl string
	if err := pool.QueryRow(ctx,
		`SELECT from_job, to_job, from_lang, to_lang FROM profile_changes WHERE user_id = $1`, uid,
	).Scan(&fj, &tj, &fl, &tl); err != nil {
		t.Fatalf("read back: %v", err)
	}
	if fj != "nurse" || tj != "hotel" || fl != "en" || tl != "de" {
		t.Fatalf("subject switch recorded as job %q→%q lang %q→%q", fj, tj, fl, tl)
	}
}

// Several changes over time are several rows, newest last — the ORDER is the whole
// point: P2 walks them to decide which stretch of history belonged to what.
func TestProfileChangesAccumulateInOrder(t *testing.T) {
	pool := speechTestPool(t)
	repo := NewUserRepo(pool)
	uid := speechTestUser(t, pool)
	ctx := context.Background()

	steps := []struct{ from, to string }{{"us", "au"}, {"au", "ca"}, {"ca", "gb"}}
	for _, s := range steps {
		err := repo.RecordProfileChange(ctx, uid,
			user.Profile{UserID: uid, Job: "nurse", TargetLang: "en", Destination: s.from},
			user.Profile{UserID: uid, Job: "nurse", TargetLang: "en", Destination: s.to})
		if err != nil {
			t.Fatalf("RecordProfileChange(%s→%s): %v", s.from, s.to, err)
		}
	}

	rows, err := pool.Query(ctx,
		`SELECT from_dest, to_dest FROM profile_changes WHERE user_id = $1 ORDER BY id`, uid)
	if err != nil {
		t.Fatal(err)
	}
	defer rows.Close()
	var got []string
	for rows.Next() {
		var f, to string
		if err := rows.Scan(&f, &to); err != nil {
			t.Fatal(err)
		}
		got = append(got, f+"→"+to)
	}
	if len(got) != 3 || got[0] != "us→au" || got[2] != "ca→gb" {
		t.Fatalf("history = %v", got)
	}
}
