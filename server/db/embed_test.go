package db

import (
	"fmt"
	"strings"
	"testing"
)

// The binary must carry every migration. If embedding silently misses files, a
// Cloud Run Job would report "nothing to apply" on a schema it never applied.
//
// Deliberately no hardcoded file count: contiguous numbering plus an up/down
// pair per version already catches a glob that drops files, and it keeps
// working when migration 21 lands.
func TestEmbedCarriesEveryMigration(t *testing.T) {
	entries, err := Migrations.ReadDir("migrations")
	if err != nil {
		t.Fatalf("read embedded migrations: %v", err)
	}
	if len(entries) == 0 {
		t.Fatal("no migrations embedded")
	}

	// version prefix -> {up, down} seen
	ups := map[string]bool{}
	downs := map[string]bool{}
	for _, e := range entries {
		name := e.Name()
		version, _, ok := strings.Cut(name, "_")
		if !ok || len(version) != 6 {
			t.Fatalf("%q does not start with a 6-digit version prefix", name)
		}
		switch {
		case strings.HasSuffix(name, ".up.sql"):
			ups[version] = true
		case strings.HasSuffix(name, ".down.sql"):
			downs[version] = true
		default:
			t.Fatalf("%q is neither .up.sql nor .down.sql", name)
		}
	}

	for v := range ups {
		if !downs[v] {
			t.Errorf("version %s has an up but no down", v)
		}
	}
	for v := range downs {
		if !ups[v] {
			t.Errorf("version %s has a down but no up", v)
		}
	}

	// Contiguous from 000001: a gap means a file was dropped from the embed.
	for i := 1; i <= len(ups); i++ {
		want := fmt.Sprintf("%06d", i)
		if !ups[want] {
			t.Errorf("version %s is missing — numbering must be contiguous from 000001", want)
		}
	}
}
