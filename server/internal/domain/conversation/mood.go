package conversation

import (
	"strings"
)

// The NPC's mood, per turn.
//
// The vocabulary is exactly the set the app can DRAW (mobile RoleFace's Expression
// union). A mood the portrait cannot render is worse than none: the face would fall
// back to neutral while the border said something else, and the two halves of the
// same signal would disagree.
var moodRank = map[string]int{
	// Distress — the situation is not under control.
	"panic":     0,
	"pain":      1,
	"angry":     1,
	"sad":       2,
	"worried":   2,
	"shy":       3,
	"sleepy":    3,
	"surprised": 3,
	// Settled — engaged, not distressed. `focused` and `thinking` sit ABOVE neutral
	// on purpose: a patient who was panicking and is now focused has been calmed,
	// which is the whole point of the exchange, and calling that "no change" would
	// throw away the clearest win the learner can produce.
	"neutral":  4,
	"derp":     4,
	"thinking": 5,
	"focused":  5,
	// Relieved.
	"happy": 6,
}

// Aliases for mood words the authored content already uses that are not in the
// drawable set. Without these, 463 scenarios' `anxious` and 41 scenarios' `scared`
// silently rendered as neutral — a worried patient with a blank face.
var moodAlias = map[string]string{
	"anxious":    "worried",
	"scared":     "panic",
	"afraid":     "panic",
	"frustrated": "angry",
	"upset":      "sad",
	"calm":       "neutral",
	"relieved":   "happy",
	"grateful":   "happy",
}

// NormalizeMood maps a raw mood word onto the drawable vocabulary, or "" when it is
// not a mood we know. Case- and space-insensitive because it arrives from two
// untrusted-ish places: authored YAML and an LLM.
func NormalizeMood(raw string) string {
	m := strings.ToLower(strings.TrimSpace(raw))
	m = strings.Trim(m, ".!?,;:'\"")
	if m == "" {
		return ""
	}
	if a, ok := moodAlias[m]; ok {
		return a
	}
	if _, ok := moodRank[m]; ok {
		return m
	}
	return ""
}

// MoodImproved reports whether `next` is a better place to be than `prev`.
//
// Only ever asked in the positive direction: the app celebrates a turn that made
// things better and stays quiet otherwise. Praising a learner for a patient who got
// WORSE would be worse than silence, and narrating every downward step turns a
// role-play into a scolding.
//
// An unknown or missing prev is not an improvement. The first NPC line has nothing
// to improve on, and a session resumed from storage that never recorded a mood must
// not fire a celebration on its next turn.
func MoodImproved(prev, next string) bool {
	p, okP := moodRank[NormalizeMood(prev)]
	n, okN := moodRank[NormalizeMood(next)]
	if !okP || !okN {
		return false
	}
	return n > p
}

// MoodPrefix is what the NPC is asked to put at the head of its reply. A prefix, not
// a suffix, because the reply is STREAMED: a trailing tag would arrive after the
// learner had already read the line, and the border would change colour late.
const MoodPrefix = "[mood:"

// maxMoodPrefix caps how far in we look for the closing bracket. Long enough for
// "[mood: surprised]" plus slack, short enough that a reply which merely opens with
// a bracket does not get held back while we wait.
const maxMoodPrefix = 32

// resolvedMark is the optional second half of the tag: "[mood: happy | resolved]".
//
// It rides in the SAME bracket rather than a second tag so the stream stripper stays
// one thing with one set of bounds — a second tag would double every edge case it
// already handles (split across chunks, unterminated, not-a-tag-at-all).
const resolvedMark = "resolved"

// SplitMood pulls a leading "[mood: x]" or "[mood: x | resolved]" off a reply,
// returning the mood (normalized, "" when absent or unknown), whether the character
// considers their concern fully handled, and the reply without the tag.
//
// Tolerant by design: the tag is a request to a language model, not a protocol it
// can be held to. A missing tag, a misspelled mood, a stray space — all degrade to
// "no mood", which renders exactly as the app did before this existed.
func SplitMood(reply string) (mood string, resolved bool, text string) {
	s := strings.TrimLeft(reply, " \t\n")
	if !strings.HasPrefix(strings.ToLower(s), MoodPrefix) {
		return "", false, reply
	}
	end := strings.IndexByte(s, ']')
	if end < 0 || end > maxMoodPrefix {
		return "", false, reply
	}
	body := s[len(MoodPrefix):end]
	text = strings.TrimLeft(s[end+1:], " \t\n")
	// The mood is the part before the separator; anything after it is flags.
	moodPart, flagPart := body, ""
	if i := strings.IndexByte(body, '|'); i >= 0 {
		moodPart, flagPart = body[:i], body[i+1:]
	}
	resolved = strings.Contains(strings.ToLower(flagPart), resolvedMark)
	mood = NormalizeMood(moodPart)
	if mood == "" {
		// A tag we could not read is still a tag: strip it rather than showing the
		// learner "[mood: bemused]" in a speech bubble. The flag survives — it was
		// readable even if the mood was not.
		return "", resolved, text
	}
	return mood, resolved, text
}

// moodInstruction is appended to the system prompt.
var moodInstruction = func() string {
	var b strings.Builder
	b.WriteString("Begin every reply with a mood tag on the same line: [mood: X] where X is exactly one of ")
	// Sorted for a stable prompt: an unstable prompt defeats provider-side caching
	// and makes two identical turns two different requests.
	names := make([]string, 0, len(moodRank))
	for m := range moodRank {
		names = append(names, m)
	}
	sortStrings(names)
	b.WriteString(strings.Join(names, ", "))
	b.WriteString(". Pick the mood you feel AFTER hearing what was just said, so it changes as the conversation does.")
	// The resolution flag is what lets the app tell the learner they are done. Without
	// it they cannot know, and the reported behaviour was carrying on well past the
	// point where the situation had been handled.
	b.WriteString(" If — and only if — everything you needed from this conversation has now been handled and you have nothing further to raise, write the tag as [mood: X | resolved] instead.")
	b.WriteString(" Do not use `resolved` merely because the exchange was pleasant, and never on your first reply.")
	b.WriteString(" Then write your reply. Never mention the tag, your mood, or the word resolved in what you say.")
	return b.String()
}()

// sortStrings: a three-line insertion sort beats importing sort for one call at init.
func sortStrings(s []string) {
	for i := 1; i < len(s); i++ {
		for j := i; j > 0 && s[j] < s[j-1]; j-- {
			s[j], s[j-1] = s[j-1], s[j]
		}
	}
}

// moodStripper pulls the mood tag off a STREAMED reply.
//
// The tag arrives in the first chunk or two, and the learner must never see it — a
// bubble that flashes "[mood: worried]" before the sentence is worse than having no
// mood at all. So the head of the stream is held back until the tag is resolved, and
// everything after it passes straight through.
//
// The hold-back is bounded three ways, because a language model is not a protocol:
// text that cannot be the start of a tag flushes immediately, an unterminated tag
// flushes once it passes maxMoodPrefix, and a resolved stream never buffers again.
// Each bound is a case where a naive implementation would swallow the whole reply.
type moodStripper struct {
	onMood  func(string, bool) // called once, if a tag is found: (mood, resolved)
	onText  func(string) error // downstream
	buf     strings.Builder
	settled bool
}

func newMoodStripper(onMood func(string, bool), onText func(string) error) *moodStripper {
	return &moodStripper{onMood: onMood, onText: onText}
}

// couldBeMoodTag reports whether s might still grow into "[mood:".
func couldBeMoodTag(s string) bool {
	t := strings.ToLower(strings.TrimLeft(s, " \t\n"))
	if t == "" {
		return true // nothing but whitespace so far — undecided
	}
	n := len(t)
	if n > len(MoodPrefix) {
		n = len(MoodPrefix)
	}
	return t[:n] == MoodPrefix[:n]
}

func (m *moodStripper) Write(chunk string) error {
	if m.settled {
		return m.onText(chunk)
	}
	m.buf.WriteString(chunk)
	s := m.buf.String()

	// Not a tag at all: release everything and stop buffering.
	if !couldBeMoodTag(s) {
		m.settled = true
		return m.onText(s)
	}
	// Tag closed: hand over the mood, then the text after it.
	if strings.IndexByte(s, ']') >= 0 {
		m.settled = true
		mood, resolved, text := SplitMood(s)
		if (mood != "" || resolved) && m.onMood != nil {
			m.onMood(mood, resolved)
		}
		if text == "" {
			return nil // the whole chunk was the tag; the sentence follows
		}
		return m.onText(text)
	}
	// Still plausibly a tag but too long to be one: give up and release.
	if len(s) > maxMoodPrefix {
		m.settled = true
		return m.onText(s)
	}
	return nil // keep waiting
}

// Flush releases anything still held. Called when the stream ends, so a reply that
// was ONLY a tag-shaped fragment is not silently dropped.
func (m *moodStripper) Flush() error {
	if m.settled {
		return nil
	}
	m.settled = true
	if s := m.buf.String(); s != "" {
		return m.onText(s)
	}
	return nil
}
