package themed

import "testing"

func TestCatalog_emptyTagsSafe(t *testing.T) {
	// P1 제약: 태그가 비어도 패닉 없이 빈 트랙.
	cat := NewCatalog([]Theme{{Key: "er-triage", Track: "depth", Dept: "ER", Order: 20}}, nil)
	tracks := cat.Resolve(nil, nil, "")
	if len(tracks) != 0 {
		t.Fatalf("empty tags → no tracks, got %d", len(tracks))
	}
	if len(cat.Orphans()) != 0 {
		t.Fatalf("no tags → no orphans, got %v", cat.Orphans())
	}
}

func TestCatalog_deptOrderFromThemeOrder(t *testing.T) {
	themes := []Theme{
		{Key: "icu-x", Name: "x", Track: "depth", Dept: "ICU", Order: 40},
		{Key: "er-t", Name: "t", Track: "depth", Dept: "ER", Order: 20},
	}
	tags := []ScenarioTag{
		{ID: "SCN-ICU-1", Title: "x", Theme: "icu-x", Dept: "ICU", Difficulty: 1},
		{ID: "SCN-ER-1", Title: "t", Theme: "er-t", Dept: "ER", Difficulty: 1},
	}
	cat := NewCatalog(themes, tags)
	tracks := cat.Resolve(nil, nil, "")
	// ER(order 20) before ICU(order 40)
	if len(tracks) != 2 || tracks[0].Dept != "ER" || tracks[1].Dept != "ICU" {
		t.Fatalf("dept order should follow theme order (ER<ICU): %+v", tracks)
	}
}

func TestCatalog_coreFirst(t *testing.T) {
	themes := []Theme{
		{Key: "er-t", Track: "depth", Dept: "ER", Order: 5},
		{Key: "core-s", Track: "core", Order: 99},
	}
	tags := []ScenarioTag{
		{ID: "SCN-ER-1", Title: "t", Theme: "er-t", Dept: "ER", Difficulty: 1},
		{ID: "SCN-CORE-1", Title: "s", Theme: "core-s", Dept: "CORE", Difficulty: 1},
	}
	cat := NewCatalog(themes, tags)
	tracks := cat.Resolve(nil, nil, "")
	if tracks[0].Dept != "CORE" {
		t.Fatalf("CORE track must be first even with high order, got %s", tracks[0].Dept)
	}
}
