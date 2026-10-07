package campus

import "testing"

// 서가 건물 간지(v45) R1·R2: 건물은 이 표가 정하고, 엘리베이터가 서지 않는 GEN만 규칙으로 본관이다.
func TestBuildingOf(t *testing.T) {
	cases := map[string]string{
		"ER":   "본관",
		"NICU": "별관 1",
		"ONCO": "별관 2",
		"RAD":  "별관 3",
		"DERM": "별관 3", // 피부과는 외래 진료 — 본관 2F에서 외래·진단동으로 옮겼다(2026-10-07)
		"SIM":  "지원동",
		"GEN":  "본관", // 표에 층이 없다 — 지어내지 않고 규칙으로 둔다
		"NOPE": "",
		"":     "",
	}
	for dept, want := range cases {
		if got := BuildingOf(dept); got != want {
			t.Errorf("BuildingOf(%q) = %q, want %q", dept, got, want)
		}
	}
}

// 서가 탭의 순서는 표의 건물 등장 순서다.
func TestBuildingOrder(t *testing.T) {
	want := []string{"본관", "별관 1", "별관 2", "별관 3", "지원동"}
	got := Buildings()
	if len(got) != len(want) {
		t.Fatalf("Buildings() = %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("Buildings() = %v, want %v", got, want)
		}
	}
}
