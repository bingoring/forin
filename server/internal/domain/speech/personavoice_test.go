package speech

import "testing"

// role=child is the case this exists for: 71 authored scenarios have it and none
// of them carry an age, so an age-only rule would have missed every one.
func TestChildRoleGetsTheChildVoiceWithoutAnyAge(t *testing.T) {
	got, ok := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "child"})
	if !ok || got != enUSCast.child {
		t.Fatalf("child role must use the child voice, got %q (ok=%v)", got, ok)
	}
}

func TestAgeRangeIsReadWhenPresent(t *testing.T) {
	cases := map[string]string{
		"8y":      enUSCast.child,
		"60s":     enUSCast.adultFemale, // 60 < 65 → adult
		"70s":     enUSCast.seniorFemale,
		"toddler": enUSCast.child,
	}
	for age, want := range cases {
		got, ok := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "patient", AgeRange: age})
		if !ok || got != want {
			t.Errorf("ageRange %q → %q, want %q", age, got, want)
		}
	}
}

func TestGenderRefinesWhenAuthored(t *testing.T) {
	m, _ := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "patient", Gender: "male"})
	f, _ := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "patient", Gender: "female"})
	if m == f {
		t.Fatal("an authored gender must change the voice")
	}
	if m != enUSCast.adultMale || f != enUSCast.adultFemale {
		t.Fatalf("got male=%q female=%q", m, f)
	}
}

// Gender beats role: an authored fact must not be overridden by the role
// heuristic that exists only to cover its absence.
func TestAuthoredGenderBeatsTheRoleHeuristic(t *testing.T) {
	got, _ := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "doctor", Gender: "female"})
	if got != enUSCast.adultFemale {
		t.Fatalf("authored female doctor must use the female voice, got %q", got)
	}
}

// And a child stays a child even if an author writes a gender: a gendered adult
// voice on a 6-year-old is more wrong than an ungendered child voice.
func TestChildBeatsGender(t *testing.T) {
	got, _ := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "child", Gender: "male"})
	if got != enUSCast.child {
		t.Fatalf("child must stay the child voice, got %q", got)
	}
}

func TestRoleVariesTheCastWhenGenderIsUnknown(t *testing.T) {
	doc, _ := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "doctor"})
	pat, _ := VoiceForPersona(PersonaVoice{Locale: "en-US", Role: "patient"})
	if doc == pat {
		t.Fatal("with no gender authored the role should still vary the voice")
	}
}

// Non-en-US falls back to that locale's single paired voice — never an en-US one,
// which is the mismatch reference.go exists to prevent.
func TestOtherLocalesUseTheirOwnVoice(t *testing.T) {
	got, ok := VoiceForPersona(PersonaVoice{Locale: "ja-JP", Role: "child"})
	if !ok {
		t.Fatal("ja-JP must resolve")
	}
	if got != voicesByLocale["ja-JP"] {
		t.Fatalf("ja-JP got %q, want its paired voice %q", got, voicesByLocale["ja-JP"])
	}
}

func TestUnknownLocaleStaysSilent(t *testing.T) {
	if _, ok := VoiceForPersona(PersonaVoice{Locale: "xx-XX", Role: "patient"}); ok {
		t.Fatal("an unknown locale must not resolve to a guess")
	}
	if _, ok := VoiceForPersona(PersonaVoice{Role: "patient"}); ok {
		t.Fatal("an empty locale must not resolve")
	}
}
