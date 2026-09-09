package main

import "testing"

// Every topic must declare a theme key (R-P2-3): an untagged topic makes its
// whole generated bank orphaned. Skipped while P2 tagging is in progress; the
// gate (P2 Task 5) removes the Skip once every dept is assigned.
//
// Scope note (UGC seam): this is about AUTHORED topics only. User-generated
// scenarios have no topic and belong to user bundles, not system themes.
func TestEveryTopicHasTheme(t *testing.T) {
	t.Skip("P2 진행 중: 부서별 Theme 배정이 끝나면 skip 제거 (Task 5)")

	var missing []string
	for _, d := range Depts {
		for _, tp := range d.Topics {
			if tp.Theme == "" {
				missing = append(missing, d.Code+" / "+tp.Title)
			}
		}
	}
	if len(missing) != 0 {
		n := len(missing)
		if n > 5 {
			missing = missing[:5]
		}
		t.Fatalf("Theme 미배정 Topic %d개 (예): %v", n, missing)
	}
}
