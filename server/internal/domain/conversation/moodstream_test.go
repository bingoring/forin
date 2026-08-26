package conversation

import (
	"strings"
	"testing"
)

// drive feeds chunks through a stripper and returns what reached the learner and
// which mood was announced.
func drive(chunks []string) (text, mood string, err error) {
	t, m, _, e := driveFull(chunks)
	return t, m, e
}

// driveFull also reports the resolution flag.
func driveFull(chunks []string) (text, mood string, resolved bool, err error) {
	var out strings.Builder
	m := newMoodStripper(func(x string, done bool) { mood, resolved = x, done }, func(s string) error {
		out.WriteString(s)
		return nil
	})
	for _, c := range chunks {
		if err = m.Write(c); err != nil {
			return out.String(), mood, resolved, err
		}
	}
	err = m.Flush()
	return out.String(), mood, resolved, err
}

// The learner must never see the tag. A bubble that flashes "[mood: worried]" before
// the sentence is worse than having no mood at all.
func TestStreamedTagNeverReachesTheLearner(t *testing.T) {
	for _, chunks := range [][]string{
		{"[mood: worried] Where is the doctor?"},                                                       // one chunk
		{"[mood:", " worried]", " Where is the doctor?"},                                               // split on the tag
		{"[", "m", "o", "o", "d", ":", "w", "o", "r", "r", "i", "e", "d", "]", "Where is the doctor?"}, // per character
		{"[mood: worried]", "Where is ", "the doctor?"},                                                // tag alone in its chunk
	} {
		text, mood, err := drive(chunks)
		if err != nil {
			t.Fatalf("%v: %v", chunks, err)
		}
		if strings.Contains(text, "mood") || strings.Contains(text, "[") {
			t.Errorf("%v leaked the tag: %q", chunks, text)
		}
		if strings.TrimSpace(text) != "Where is the doctor?" {
			t.Errorf("%v -> text %q", chunks, text)
		}
		if mood != "worried" {
			t.Errorf("%v -> mood %q", chunks, mood)
		}
	}
}

// An untagged reply must stream exactly as it did before moods existed — and must not
// be held back waiting for a tag that is never coming.
func TestUntaggedReplyStreamsUnchangedAndImmediately(t *testing.T) {
	var got []string
	m := newMoodStripper(func(string, bool) { t.Error("announced a mood for an untagged reply") }, func(s string) error {
		got = append(got, s)
		return nil
	})
	if err := m.Write("Where is "); err != nil {
		t.Fatal(err)
	}
	// The first chunk cannot be a tag, so it must already be through — not buffered.
	if len(got) != 1 || got[0] != "Where is " {
		t.Fatalf("first chunk was held back: %v", got)
	}
	_ = m.Write("the doctor?")
	_ = m.Flush()
	if strings.Join(got, "") != "Where is the doctor?" {
		t.Errorf("text = %q", strings.Join(got, ""))
	}
}

// Square brackets are not ours. A model that opens with stage direction must not have
// it eaten, and must not be delayed.
func TestBracketThatIsNotATagPassesThrough(t *testing.T) {
	text, mood, err := drive([]string{"[Nurse walks in] Hello."})
	if err != nil {
		t.Fatal(err)
	}
	if text != "[Nurse walks in] Hello." || mood != "" {
		t.Errorf("text = %q, mood = %q", text, mood)
	}
}

// An unterminated tag must release rather than swallow the reply. This is the failure
// that would look like the NPC saying nothing at all.
func TestUnterminatedTagIsReleased(t *testing.T) {
	long := "[mood: worried the patient keeps talking and never closes the bracket at all"
	text, mood, err := drive([]string{long})
	if err != nil {
		t.Fatal(err)
	}
	if text != long {
		t.Errorf("text = %q, want the whole reply released", text)
	}
	if mood != "" {
		t.Errorf("mood = %q, want none", mood)
	}
}

// A stream that ends mid-tag: Flush must release what was held, or the turn is blank.
func TestFlushReleasesAHeldFragment(t *testing.T) {
	text, mood, err := drive([]string{"[mood: wor"})
	if err != nil {
		t.Fatal(err)
	}
	if text != "[mood: wor" {
		t.Errorf("text = %q, want the fragment released", text)
	}
	if mood != "" {
		t.Errorf("mood = %q", mood)
	}
}

// Once resolved the stripper is a pass-through: a bracket LATER in the reply is text.
func TestNoBufferingAfterResolution(t *testing.T) {
	text, mood, err := drive([]string{"[mood: happy]", "Thank you. ", "[she smiles]"})
	if err != nil {
		t.Fatal(err)
	}
	if text != "Thank you. [she smiles]" {
		t.Errorf("text = %q", text)
	}
	if mood != "happy" {
		t.Errorf("mood = %q", mood)
	}
}

// An unreadable mood is stripped but not announced: showing "[mood: bemused]" is
// worse than no mood, and announcing a mood the portrait cannot draw is worse still.
func TestUnknownMoodIsStrippedButNotAnnounced(t *testing.T) {
	text, mood, err := drive([]string{"[mood: bemused] Hello."})
	if err != nil {
		t.Fatal(err)
	}
	if text != "Hello." || mood != "" {
		t.Errorf("text = %q, mood = %q", text, mood)
	}
}

// Leading whitespace before the tag is undecided, not "not a tag".
func TestLeadingWhitespaceDoesNotDefeatTheTag(t *testing.T) {
	text, mood, err := drive([]string{"\n ", "[mood: happy] Thanks."})
	if err != nil {
		t.Fatal(err)
	}
	if mood != "happy" || strings.TrimSpace(text) != "Thanks." {
		t.Errorf("text = %q, mood = %q", text, mood)
	}
}

// The resolution flag has to survive being split across chunks, exactly like the
// mood: the tag arrives in whatever pieces the provider chooses.
func TestStreamedResolvedFlagSurvivesChunking(t *testing.T) {
	for _, chunks := range [][]string{
		{"[mood: happy | resolved] All done, thank you."},
		{"[mood: happy", " | resolved]", " All done, thank you."},
		{"[mood:", " happy", " |", " resolved", "]", "All done, thank you."},
	} {
		text, mood, resolved, err := driveFull(chunks)
		if err != nil {
			t.Fatalf("%v: %v", chunks, err)
		}
		if !resolved {
			t.Errorf("%v lost the resolved flag", chunks)
		}
		if mood != "happy" {
			t.Errorf("%v -> mood %q", chunks, mood)
		}
		if strings.Contains(text, "resolved") || strings.Contains(text, "[") {
			t.Errorf("%v leaked the tag: %q", chunks, text)
		}
	}
}

// The longer tag must still fit inside the hold-back bound, or it releases as text
// and the learner reads "[mood: happy | resolved]".
func TestResolvedTagFitsWithinTheHoldBackBound(t *testing.T) {
	longest := "[mood: surprised | resolved]"
	if len(longest) > maxMoodPrefix {
		t.Fatalf("the longest tag is %d chars but the bound is %d — it would leak as text",
			len(longest), maxMoodPrefix)
	}
}
