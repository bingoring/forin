package config

import "testing"

func TestIsSupported(t *testing.T) {
	cases := []struct {
		locale string
		want   bool
	}{
		{"ko", true},
		{"KO", true},
		{"ko-KR", true},
		{"ko_KR", true},
		{"en", false},
		{"", false},
		{"de", false},
	}
	for _, tc := range cases {
		t.Run(tc.locale, func(t *testing.T) {
			if got := IsSupported(tc.locale); got != tc.want {
				t.Fatalf("IsSupported(%q) = %v, want %v", tc.locale, got, tc.want)
			}
		})
	}
}

func TestDefaultLocaleIsSupported(t *testing.T) {
	if !IsSupported(DefaultLocale) {
		t.Fatalf("DefaultLocale %q must be in SupportedLocales", DefaultLocale)
	}
}

func TestNormalizeLocale(t *testing.T) {
	cases := []struct {
		in, want string
	}{
		{"ko", "ko"},
		{"KO", "ko"},
		{"ko-KR", "ko"},
		{"ko_KR", "ko"},
		{"en-US", "en"},
		{"", ""},
	}
	for _, tc := range cases {
		t.Run(tc.in, func(t *testing.T) {
			if got := NormalizeLocale(tc.in); got != tc.want {
				t.Fatalf("NormalizeLocale(%q) = %q, want %q", tc.in, got, tc.want)
			}
		})
	}
}
