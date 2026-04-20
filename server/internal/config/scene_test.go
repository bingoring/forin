package config

import "testing"

func TestIsSupportedTension(t *testing.T) {
	cases := []struct {
		in   string
		want bool
	}{
		{"calm", true},
		{"tense", true},
		{"crisis", true},
		{"chaos", false},
		{"", false},
	}
	for _, tc := range cases {
		t.Run(tc.in, func(t *testing.T) {
			if got := IsSupportedTension(tc.in); got != tc.want {
				t.Fatalf("IsSupportedTension(%q) = %v, want %v", tc.in, got, tc.want)
			}
		})
	}
}

func TestIsSupportedMood(t *testing.T) {
	cases := []struct {
		in   string
		want bool
	}{
		{"calm", true},
		{"angry", true},
		{"chill", false},
		{"", false},
	}
	for _, tc := range cases {
		t.Run(tc.in, func(t *testing.T) {
			if got := IsSupportedMood(tc.in); got != tc.want {
				t.Fatalf("IsSupportedMood(%q) = %v, want %v", tc.in, got, tc.want)
			}
		})
	}
}

func TestAreSupportedMoods(t *testing.T) {
	if !AreSupportedMoods([]string{"calm", "grateful"}) {
		t.Fatalf("expected all supported")
	}
	if AreSupportedMoods([]string{"calm", "nonsense"}) {
		t.Fatalf("should reject unknown mood")
	}
	if !AreSupportedMoods([]string{}) {
		t.Fatalf("empty slice should be considered supported")
	}
}
