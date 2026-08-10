package colleague

import (
	"strings"
	"testing"
)

func TestNormalizeCode(t *testing.T) {
	cases := []struct{ in, want string }{
		{"K7-N4XQ", "K7-N4XQ"},
		{"k7n4xq", "K7-N4XQ"},      // lower-case, no hyphen
		{" K7 - N4XQ ", "K7-N4XQ"}, // spaces around the separator
		{"K7—N4XQ", "K7-N4XQ"},     // em-dash pasted from a chat app
		{"K7-N4X", ""},             // too short
		{"K7-N4XQZ", ""},           // too long
		{"K0-N4XQ", ""},            // '0' is not in the alphabet
		{"KI-N4XQ", ""},            // 'I' is not in the alphabet
		{"", ""},
	}
	for _, c := range cases {
		if got := NormalizeCode(c.in); got != c.want {
			t.Errorf("NormalizeCode(%q) = %q, want %q", c.in, got, c.want)
		}
	}
}

func TestNewCodeShape(t *testing.T) {
	for i := 0; i < 200; i++ {
		code, err := NewCode()
		if err != nil {
			t.Fatalf("NewCode: %v", err)
		}
		if NormalizeCode(code) != code {
			t.Fatalf("NewCode produced %q, which does not normalize to itself", code)
		}
		if len(code) != 7 || code[2] != '-' {
			t.Fatalf("NewCode produced %q, want XX-XXXX", code)
		}
		for _, r := range strings.ReplaceAll(code, "-", "") {
			if !strings.ContainsRune(codeAlphabet, r) {
				t.Fatalf("NewCode produced %q with out-of-alphabet rune %q", code, r)
			}
		}
	}
}

func TestMirrorIsInvolutive(t *testing.T) {
	// Mirroring twice must return the original, or the two rows of a link would
	// drift apart (INV-3).
	for rel := range AllowedRelations {
		if got := Mirror[Mirror[rel]]; got != rel {
			t.Errorf("Mirror[Mirror[%q]] = %q, want %q", rel, got, rel)
		}
	}
	if Mirror[RelationMentor] != RelationMentee {
		t.Errorf("a mentor's counterpart must be a mentee, got %q", Mirror[RelationMentor])
	}
}

func TestValidateCheer(t *testing.T) {
	sixty := strings.Repeat("가", 60)
	cases := []struct {
		name    string
		preset  Preset
		message string
		wantErr bool
	}{
		{"preset only", PresetWellDone, "", false},
		{"message only", "", "화이팅!", false},
		{"both", PresetStreak, "30일 축하해요", false},
		{"60 hangul runes is the limit, not 60 bytes", "", sixty, false},
		{"61 runes rejected", "", sixty + "가", true},
		{"unknown preset", Preset("nope"), "", true},
		{"empty", "", "   ", true},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			err := ValidateCheer(c.preset, c.message)
			if (err != nil) != c.wantErr {
				t.Fatalf("ValidateCheer(%q, %q) err = %v, wantErr %v", c.preset, c.message, err, c.wantErr)
			}
		})
	}
}
