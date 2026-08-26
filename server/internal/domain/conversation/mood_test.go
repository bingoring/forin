package conversation

import (
	"strings"
	"testing"
)

// The vocabulary must stay the set the app can draw. A mood the portrait cannot
// render leaves the face on neutral while the bubble's border says otherwise — the
// two halves of one signal disagreeing.
func TestMoodVocabularyMatchesDrawableExpressions(t *testing.T) {
	// mobile/src/engine/Sprite.tsx's Expression union, verbatim.
	drawable := []string{
		"neutral", "derp", "happy", "sad", "worried", "pain",
		"surprised", "angry", "thinking", "sleepy", "panic", "focused", "shy",
	}
	if len(moodRank) != len(drawable) {
		t.Errorf("vocabulary has %d moods, the app draws %d", len(moodRank), len(drawable))
	}
	for _, m := range drawable {
		if _, ok := moodRank[m]; !ok {
			t.Errorf("app can draw %q but the server never sends it", m)
		}
	}
}

// The authored content already uses words outside the drawable set. Before the alias
// map, 463 scenarios' `anxious` and 41 scenarios' `scared` rendered as neutral.
func TestAuthoredMoodsOutsideTheSetAreAliased(t *testing.T) {
	for raw, want := range map[string]string{
		"anxious": "worried",
		"scared":  "panic",
		"calm":    "neutral",
	} {
		if got := NormalizeMood(raw); got != want {
			t.Errorf("NormalizeMood(%q) = %q, want %q", raw, got, want)
		}
	}
}

func TestNormalizeMoodTolerance(t *testing.T) {
	for _, in := range []string{"Worried", "  worried ", "WORRIED", "worried."} {
		if got := NormalizeMood(in); got != "worried" {
			t.Errorf("NormalizeMood(%q) = %q", in, got)
		}
	}
	// Unknown is empty, not a guess: a wrong face is worse than no change.
	for _, in := range []string{"", "bemused", "???", "mood"} {
		if got := NormalizeMood(in); got != "" {
			t.Errorf("NormalizeMood(%q) = %q, want empty", in, got)
		}
	}
}

// Calming someone down IS the win the learner is working for, so `focused` and
// `thinking` rank above neutral — otherwise panic → focused would report as no change.
func TestMoodImprovedCountsCalmingDown(t *testing.T) {
	for _, tc := range []struct{ prev, next string }{
		{"panic", "focused"},
		{"panic", "neutral"},
		{"pain", "worried"},
		{"worried", "happy"},
		{"angry", "thinking"},
		{"anxious", "calm"}, // through the alias map
	} {
		if !MoodImproved(tc.prev, tc.next) {
			t.Errorf("%s → %s should be an improvement", tc.prev, tc.next)
		}
	}
}

// The app celebrates only improvement. Getting worse, or staying put, is silence —
// praising a learner whose patient deteriorated is worse than saying nothing, and
// narrating every downward step turns a role-play into a scolding.
func TestMoodImprovedIsSilentOtherwise(t *testing.T) {
	for _, tc := range []struct{ prev, next string }{
		{"happy", "worried"},   // worse
		{"neutral", "panic"},   // much worse
		{"worried", "worried"}, // unchanged
		{"worried", "sad"},     // same rank, different word
		{"", "happy"},          // no prior turn to improve on
		{"worried", ""},        // unreadable reply
		{"bemused", "happy"},   // unknown prior
		{"happy", "bemused"},   // unknown next
	} {
		if MoodImproved(tc.prev, tc.next) {
			t.Errorf("%q → %q should NOT report as improvement", tc.prev, tc.next)
		}
	}
}

func TestSplitMood(t *testing.T) {
	for _, tc := range []struct {
		in, wantMood, wantText string
	}{
		{"[mood: worried] Where is the doctor?", "worried", "Where is the doctor?"},
		{"[mood:happy]Thank you.", "happy", "Thank you."},
		{"[MOOD: Panic] It hurts!", "panic", "It hurts!"},
		{"  [mood: anxious] I see.", "worried", "I see."},
		// No tag: the reply is untouched, which is exactly how the app behaved before.
		{"Where is the doctor?", "", "Where is the doctor?"},
		// A bracket that is not a tag must not be eaten.
		{"[Nurse walks in] Hello.", "", "[Nurse walks in] Hello."},
		// An unreadable mood is still stripped — "[mood: bemused]" in a speech
		// bubble is worse than no mood at all.
		{"[mood: bemused] Hello.", "", "Hello."},
		// An unterminated tag is left alone rather than swallowing the whole reply.
		{"[mood: worried the patient is upset and keeps talking without closing", "", "[mood: worried the patient is upset and keeps talking without closing"},
	} {
		mood, _, text := SplitMood(tc.in)
		if mood != tc.wantMood || text != tc.wantText {
			t.Errorf("SplitMood(%q) = (%q, %q), want (%q, %q)", tc.in, mood, text, tc.wantMood, tc.wantText)
		}
	}
}

// The prompt is built once at init and must be stable: an unstable system prompt
// defeats provider-side caching and makes two identical turns two different requests.
func TestMoodInstructionIsStableAndComplete(t *testing.T) {
	for m := range moodRank {
		if !strings.Contains(moodInstruction, m) {
			t.Errorf("instruction omits %q, so the model can never send it", m)
		}
	}
	// Sorted, hence stable across process restarts (map iteration is not).
	if !strings.Contains(moodInstruction, "angry, derp, focused, happy") {
		t.Errorf("mood list is not sorted: %s", moodInstruction)
	}
}

// The resolution flag: the character saying "everything I needed is handled". It is
// what lets the app tell the learner they are done — without it they cannot know, and
// the reported behaviour was carrying on well past the point of resolution.
func TestSplitMoodReadsTheResolvedFlag(t *testing.T) {
	for _, tc := range []struct {
		in       string
		wantMood string
		wantDone bool
		wantText string
	}{
		{"[mood: happy | resolved] Thank you, that's everything.", "happy", true, "Thank you, that's everything."},
		{"[mood:happy|resolved]Thanks.", "happy", true, "Thanks."},
		{"[MOOD: Happy | RESOLVED] Thanks.", "happy", true, "Thanks."},
		// Absent means not resolved — the common case, and the safe default.
		{"[mood: worried] Where is the doctor?", "worried", false, "Where is the doctor?"},
		// A mood we cannot draw still leaves a readable flag: the two halves are
		// independent, and dropping the flag because of the mood would lose the more
		// important of the two.
		{"[mood: bemused | resolved] Done.", "", true, "Done."},
		// No tag at all: nothing claimed.
		{"Where is the doctor?", "", false, "Where is the doctor?"},
		// A reply that merely says the word must not be read as the flag.
		{"[mood: happy] The problem is resolved now.", "happy", false, "The problem is resolved now."},
	} {
		mood, done, text := SplitMood(tc.in)
		if mood != tc.wantMood || done != tc.wantDone || text != tc.wantText {
			t.Errorf("SplitMood(%q) = (%q, %v, %q), want (%q, %v, %q)",
				tc.in, mood, done, text, tc.wantMood, tc.wantDone, tc.wantText)
		}
	}
}

// The instruction has to ask for it, and has to say when NOT to use it — a flag on
// every pleasant exchange would end conversations that had not been handled.
func TestMoodInstructionAsksForResolutionCarefully(t *testing.T) {
	if !strings.Contains(moodInstruction, "resolved") {
		t.Error("the instruction never asks for the resolution flag")
	}
	for _, guard := range []string{"only if", "never on your first reply"} {
		if !strings.Contains(strings.ToLower(moodInstruction), guard) {
			t.Errorf("the instruction omits the %q guard: %s", guard, moodInstruction)
		}
	}
}
