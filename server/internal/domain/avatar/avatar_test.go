package avatar

import (
	"errors"
	"testing"
)

func full() Spec {
	return Spec{
		"skin": "beige", "hair": "bob", "hairColor": "black", "eyes": "dot",
		"mouth": "smile", "outfit": "scrubV", "outfitColor": "sage", "hat": "none",
		"bg": "plain", "acc": "none",
	}
}

func TestCleanAcceptsACompletePortrait(t *testing.T) {
	got, err := full().Clean()
	if err != nil {
		t.Fatalf("Clean: %v", err)
	}
	if len(got) != len(AllowedKeys) {
		t.Fatalf("Clean returned %d axes, want %d", len(got), len(AllowedKeys))
	}
	if got["hair"] != "bob" {
		t.Errorf("hair came back as %q", got["hair"])
	}
}

func TestCleanRejectsAKeyTheClientCannotDraw(t *testing.T) {
	s := full()
	s["hair"] = "sombrero"
	if _, err := s.Clean(); !errors.Is(err, ErrUnknownKey) {
		t.Fatalf("err = %v, want ErrUnknownKey", err)
	}
	// A key from the WRONG axis is just as unknown — 'bob' is a hairstyle, not a hat.
	s = full()
	s["hat"] = "bob"
	if _, err := s.Clean(); !errors.Is(err, ErrUnknownKey) {
		t.Fatalf("cross-axis key: err = %v, want ErrUnknownKey", err)
	}
}

func TestCleanRejectsAnUnknownAxis(t *testing.T) {
	s := full()
	s["moustache"] = "walrus"
	if _, err := s.Clean(); !errors.Is(err, ErrUnknownAxis) {
		t.Fatalf("err = %v, want ErrUnknownAxis", err)
	}
}

func TestCleanRejectsAHalfSpec(t *testing.T) {
	// A half-spec stored now is a half-spec read by somebody else's screen later,
	// and the client would have to invent the missing half in two places.
	for _, axis := range []string{"skin", "hair", "acc", "bg"} {
		s := full()
		delete(s, axis)
		if _, err := s.Clean(); !errors.Is(err, ErrUnknownAxis) {
			t.Errorf("missing %s: err = %v, want ErrUnknownAxis", axis, err)
		}
	}
	empty := Spec{}
	if _, err := empty.Clean(); !errors.Is(err, ErrUnknownAxis) {
		t.Errorf("empty spec: err = %v, want ErrUnknownAxis", err)
	}
}

func TestCleanRejectsAnEmptyKey(t *testing.T) {
	// "" is what an absent field decodes to, and storing it would draw the default
	// face while claiming the learner chose it.
	s := full()
	s["mouth"] = ""
	if _, err := s.Clean(); !errors.Is(err, ErrUnknownKey) {
		t.Fatalf("err = %v, want ErrUnknownKey", err)
	}
}

func TestEveryAxisOffersSomething(t *testing.T) {
	// An axis with an empty list is an axis nothing can satisfy, which makes every
	// write fail with no way to tell why from the error alone.
	for axis, keys := range AllowedKeys {
		if len(keys) == 0 {
			t.Errorf("axis %q allows nothing", axis)
		}
		seen := map[string]bool{}
		for _, k := range keys {
			if seen[k] {
				t.Errorf("axis %q lists %q twice", axis, k)
			}
			seen[k] = true
		}
	}
}
