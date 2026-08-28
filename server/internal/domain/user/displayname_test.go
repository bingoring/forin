package user

import (
	"strings"
	"testing"
)

func TestNormalizeDisplayName(t *testing.T) {
	cases := []struct {
		name string
		in   string
		want string
		ok   bool
	}{
		{"a plain name is kept", "김민아", "김민아", true},
		{"surrounding whitespace goes", "  Emma Watson  ", "Emma Watson", true},
		{"internal runs collapse", "Emma    Watson", "Emma Watson", true},
		// A Korean IME produces U+3000 IDEOGRAPHIC SPACE, which is not an ASCII space
		// and would otherwise survive trimming and sit in the middle of the name.
		{"ideographic space is whitespace", "김민아　RN", "김민아 RN", true},
		{"a tab is whitespace, not a control character", "Emma\tWatson", "Emma Watson", true},
		// "" means cleared, and a name of only spaces means the same thing. Both are
		// accepted so the learner can take their name back off.
		{"empty clears", "", "", true},
		{"only spaces clears", "   ", "", true},
		{"twenty runes fit", strings.Repeat("가", 20), strings.Repeat("가", 20), true},
		{"twenty-one runes do not", strings.Repeat("가", 21), "", false},
		// The limit is runes, not bytes: 20 Hangul syllables are 60 bytes, and a byte
		// limit would let a Latin name run three times longer for no visible reason.
		{"the limit is not in bytes", strings.Repeat("a", 20), strings.Repeat("a", 20), true},
		// A newline is whitespace, so it collapses like a tab rather than being
		// refused — the row it would have broken never sees it.
		{"a newline collapses", "Emma\nWatson", "Emma Watson", true},
		{"a zero-width joiner is refused", "Em‍ma", "", false},
		{"a right-to-left override is refused", "Em‮ma", "", false},
		{"a NUL is refused", "Emma\x00", "", false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got, ok := NormalizeDisplayName(c.in)
			if ok != c.ok || got != c.want {
				t.Fatalf("NormalizeDisplayName(%q) = (%q, %v), want (%q, %v)", c.in, got, ok, c.want, c.ok)
			}
		})
	}
}

func TestShortIDAndNameOr(t *testing.T) {
	const id = "a3f2b1c0-1111-2222-3333-444455556666"
	// Uppercased so it reads as an identifier rather than as a word someone chose.
	if got := ShortID(id); got != "A3F2B1" {
		t.Fatalf("ShortID = %q, want A3F2B1", got)
	}
	// Shorter than six characters must not panic — ids come from the database, and a
	// slice of a short one is how this function would take a screen down.
	if got := ShortID("ab"); got != "AB" {
		t.Fatalf("ShortID(short) = %q, want AB", got)
	}
	if got := NameOr("", id); got != "A3F2B1" {
		t.Fatalf("NameOr with no name = %q, want the short id", got)
	}
	if got := NameOr("김민아", id); got != "김민아" {
		t.Fatalf("NameOr with a name = %q, want the name", got)
	}
}
