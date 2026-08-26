package curriculum

import "testing"

// The pipeline has to actually change the payload. Asserting only that it "returns
// something" is the failure this project keeps hitting: a check that passes because
// it never examined the thing it claims to guard.
func TestResolveLocalizedChangesNames(t *testing.T) {
	ko := ResolveLocalized(map[string]bool{}, nil, "", "ko")
	en := ResolveLocalized(map[string]bool{}, nil, "", "en")
	if len(ko) != len(en) || len(ko) == 0 {
		t.Fatalf("length mismatch: ko=%d en=%d", len(ko), len(en))
	}

	changed, same := 0, 0
	for i := range ko {
		if ko[i].Key != en[i].Key {
			t.Fatalf("order differs at %d: %q vs %q", i, ko[i].Key, en[i].Key)
		}
		if ko[i].Name == en[i].Name {
			same++
		} else {
			changed++
		}
	}
	// Every curriculum name is translated today; if that stops being true the number
	// drops, and this test says by how much rather than merely failing.
	if changed == 0 {
		t.Fatalf("no name changed between ko and en — the locale never reached the names")
	}
	t.Logf("curriculum names: %d translated, %d still Korean", changed, same)

	// Floor headings travel on the same lookup and must move too.
	if ko[0].Where == en[0].Where {
		t.Errorf("floor heading did not translate: %q", ko[0].Where)
	}
}

// An unknown locale must render exactly what Korean renders — not empty names.
func TestUnknownLocaleRendersAuthored(t *testing.T) {
	ko := ResolveLocalized(map[string]bool{}, nil, "", "ko")
	xx := ResolveLocalized(map[string]bool{}, nil, "", "pt")
	for i := range ko {
		if ko[i].Name != xx[i].Name || ko[i].Where != xx[i].Where {
			t.Fatalf("%s: %q/%q vs %q/%q", ko[i].Key, ko[i].Name, ko[i].Where, xx[i].Name, xx[i].Where)
		}
	}
}
