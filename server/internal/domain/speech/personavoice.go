package speech

import "strings"

// Picking a voice for an NPC line.
//
// The design axis is `role`, not gender/age, because that is what the content
// actually carries: of 300 authored scenarios, 38 have `ageRange` and 30 hint at
// gender in the display `sub` string, while EVERY persona has a role (patient
// 1690, colleague 710, parent 385, family 253, child 71, nurse 44, doctor 18).
// Keying on gender first would mean one fallback voice for ~90% of scenarios;
// keying on role varies the cast today — a child patient stops sounding like a
// 30-year-old woman — and gender/age refine it wherever an author fills them in.
//
// Non-en-US locales fall back to their single locale voice (voicesByLocale).
// That is honest rather than lazy: Azure's per-locale voice inventories differ,
// and inventing a mapping we have not checked would reintroduce exactly the
// voice/locale mismatch reference.go documents at length.

// PersonaVoice is what a caller knows about the speaker. Every field is optional
// except Locale — content fills in what it has.
type PersonaVoice struct {
	Locale   string // BCP-47, from the learner's target language
	Role     string // persona.role: patient, child, parent, colleague, doctor…
	Gender   string // "male" | "female" | "" (unknown)
	AgeRange string // persona.ageRange, e.g. "60s", "8y", "child"
}

// en-US is the only locale with a persona cast today, because it is the only one
// whose voice inventory we have verified. Each entry is a real Azure neural voice.
var enUSCast = struct {
	child        string
	adultFemale  string
	adultMale    string
	seniorFemale string
	seniorMale   string
}{
	child:       "en-US-AnaNeural", // Azure's child voice
	adultFemale: "en-US-JennyNeural",
	adultMale:   "en-US-GuyNeural",
	// Azure has no dedicated senior voices; these are the calmest adult voices,
	// picked so an older patient at least does not sound like a newsreader.
	seniorFemale: "en-US-NancyNeural",
	seniorMale:   "en-US-DavisNeural",
}

// ageBand collapses whatever the author wrote into child | senior | adult.
// Returns "" when there is nothing to go on, so the caller can fall back on role
// instead of guessing an age.
func ageBand(role, ageRange string) string {
	if strings.EqualFold(role, "child") {
		return "child"
	}
	a := strings.ToLower(strings.TrimSpace(ageRange))
	if a == "" {
		return ""
	}
	if strings.Contains(a, "child") || strings.Contains(a, "infant") || strings.Contains(a, "toddler") {
		return "child"
	}
	// Authored as "8y", "60s", "70대" … take the leading number.
	n := 0
	for _, r := range a {
		if r < '0' || r > '9' {
			break
		}
		n = n*10 + int(r-'0')
	}
	switch {
	case n == 0:
		return ""
	case n < 15:
		return "child"
	case n >= 65:
		return "senior"
	default:
		return "adult"
	}
}

// VoiceForPersona returns the voice to speak this NPC's line with, and false when
// we have nothing appropriate — the caller should then stay silent rather than
// speak in a voice that contradicts the character.
func VoiceForPersona(p PersonaVoice) (string, bool) {
	locale := strings.TrimSpace(p.Locale)
	if locale == "" {
		return "", false
	}
	if locale != "en-US" {
		// No verified cast for this locale: use its single paired voice.
		return voiceForLocale(locale)
	}

	band := ageBand(p.Role, p.AgeRange)
	female := strings.EqualFold(p.Gender, "female")
	male := strings.EqualFold(p.Gender, "male")

	if band == "child" {
		return enUSCast.child, true
	}
	if band == "senior" {
		if male {
			return enUSCast.seniorMale, true
		}
		return enUSCast.seniorFemale, true
	}
	if male {
		return enUSCast.adultMale, true
	}
	if female {
		return enUSCast.adultFemale, true
	}
	// Gender unknown — the common case. Vary by role so the cast is not one
	// voice: clinicians read as the male adult, everyone else as the female
	// adult. Arbitrary but deterministic, and replaced the moment an author
	// fills in gender.
	switch strings.ToLower(strings.TrimSpace(p.Role)) {
	case "doctor", "surgeon", "pharmacist", "paramedic":
		return enUSCast.adultMale, true
	default:
		return enUSCast.adultFemale, true
	}
}
