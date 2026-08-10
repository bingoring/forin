package reputation

import "testing"

const (
	pass    = 60
	gainMax = 6
	lossMax = 4
)

func nurse() Catalog { return CatalogFor("nurse") }

func TestResolveUsesAcuityNotDepartment(t *testing.T) {
	c := nurse()
	// The whole point: a ward, a theatre and a pharmacy all produce emergencies.
	// Nothing here mentions a department, so nothing can be ER-only.
	cases := []struct {
		name   string
		role   string
		acuity Acuity
		want   Dimension
	}{
		{"routine patient", "patient", AcuityRoutine, DimPatientSatisfaction},
		{"routine family", "parent", AcuityRoutine, DimPatientSatisfaction},
		{"routine colleague", "attending physician", AcuityRoutine, DimPeerTrust},
		{"routine pharmacist", "pharmacist", AcuityRoutine, DimPeerTrust},
		{"urgent patient", "patient", AcuityUrgent, DimEmergencyResponse},
		{"critical patient", "patient", AcuityCritical, DimEmergencyResponse},
		{"urgent colleague — response outranks rapport", "charge nurse", AcuityUrgent, DimEmergencyResponse},
		{"no role authored", "", AcuityRoutine, DimPatientSatisfaction},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := c.Resolve(tc.role, tc.acuity); got != tc.want {
				t.Fatalf("Resolve(%q, %q) = %q, want %q", tc.role, tc.acuity, got, tc.want)
			}
		})
	}
}

func TestUnknownProfessionIsSkippedNotGuessed(t *testing.T) {
	// Moving the wrong axis for a profession we haven't modelled is worse than
	// moving none, so there is deliberately no fallback to nurse.
	if c := CatalogFor("programmer"); c.Valid() {
		t.Fatalf("an unmodelled profession must yield an invalid catalog, got %+v", c)
	}
	if c := CatalogFor(""); c.Valid() {
		t.Fatal("empty profession must yield an invalid catalog")
	}
	if c := CatalogFor("NURSE"); !c.Valid() {
		t.Fatal("profession lookup should be case-insensitive")
	}
}

func TestNormalizeAcuityFallsBackToRoutine(t *testing.T) {
	// Existing content has no acuity field; it must keep working untouched.
	for _, in := range []string{"", "  ", "nonsense", "ROUTINE", "Routine"} {
		if got := NormalizeAcuity(in); got != AcuityRoutine {
			t.Errorf("NormalizeAcuity(%q) = %q, want routine", in, got)
		}
	}
	if got := NormalizeAcuity("URGENT"); got != AcuityUrgent {
		t.Errorf("NormalizeAcuity(URGENT) = %q", got)
	}
	if got := NormalizeAcuity(" critical "); got != AcuityCritical {
		t.Errorf("NormalizeAcuity(' critical ') = %q", got)
	}
}

func TestDeltaPivotsOnPassScore(t *testing.T) {
	if d := Delta(pass, pass, gainMax, lossMax); d != 0 {
		t.Fatalf("a bare pass must move nothing, got %+d", d)
	}
	if d := Delta(100, pass, gainMax, lossMax); d != gainMax {
		t.Fatalf("a perfect grade must give the full gain, got %+d", d)
	}
	if d := Delta(0, pass, gainMax, lossMax); d != -lossMax {
		t.Fatalf("a zero grade must give the full loss, got %+d", d)
	}
	if d := Delta(pass-1, pass, gainMax, lossMax); d >= 0 {
		t.Fatalf("just below the pass must be negative, got %+d", d)
	}
	if d := Delta(pass+1, pass, gainMax, lossMax); d <= 0 {
		t.Fatalf("just above the pass must be positive (no truncation to 0), got %+d", d)
	}
}

func TestDeltaIsMonotonic(t *testing.T) {
	prev := Delta(0, pass, gainMax, lossMax)
	for g := 1; g <= 100; g++ {
		d := Delta(g, pass, gainMax, lossMax)
		if d < prev {
			t.Fatalf("grade %d gave %+d after %+d — a better clear must never gain less", g, d, prev)
		}
		prev = d
	}
}

func TestDeltaIgnoresUngraded(t *testing.T) {
	// grade < 0 is the "direct/legacy clear, never scored" marker.
	if d := Delta(-1, pass, gainMax, lossMax); d != 0 {
		t.Fatalf("ungraded clears must not move reputation, got %+d", d)
	}
}

func TestDeltaRefusesNonsenseConfig(t *testing.T) {
	for _, p := range []int{0, 100, -5, 140} {
		if d := Delta(80, p, gainMax, lossMax); d != 0 {
			t.Fatalf("pass=%d should yield 0, got %+d", p, d)
		}
	}
}

func TestClamp(t *testing.T) {
	for in, want := range map[int]int{-10: 0, 0: 0, 50: 50, 100: 100, 130: 100} {
		if got := Clamp(in); got != want {
			t.Errorf("Clamp(%d) = %d, want %d", in, got, want)
		}
	}
}
