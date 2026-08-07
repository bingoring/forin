package config

import "testing"

func TestSplitList(t *testing.T) {
	cases := []struct {
		name string
		in   string
		want []string
	}{
		{"empty", "", nil},
		{"blank", "   ", nil},
		{"single", "abc.apps.googleusercontent.com", []string{"abc.apps.googleusercontent.com"}},
		{"multiple", "ios.id,android.id,web.id", []string{"ios.id", "android.id", "web.id"}},
		{"trims spaces", " ios.id , android.id ", []string{"ios.id", "android.id"}},
		{"drops empty entries", "ios.id,,android.id,", []string{"ios.id", "android.id"}},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := splitList(tc.in)
			if len(got) != len(tc.want) {
				t.Fatalf("splitList(%q) = %v, want %v", tc.in, got, tc.want)
			}
			for i := range got {
				if got[i] != tc.want[i] {
					t.Fatalf("splitList(%q) = %v, want %v", tc.in, got, tc.want)
				}
			}
		})
	}
}
