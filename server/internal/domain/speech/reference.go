package speech

import (
	"context"
	"errors"
	"strings"

	"github.com/bingoring/forin/server/internal/ports"
)

// referenceVoice is the neural voice used to synthesize a sentence's reference
// audio. Mirrors quiz_audio_handler.go's audioVoice constant: that handler is
// the existing precedent for calling ports.SpeechSynthesizer, and it names a
// concrete voice rather than passing "" and relying on Synthesize's internal
// default (see azurespeech.Client.Synthesize) — same call site, same voice,
// so the two callers don't drift into synthesizing the same text differently.
const referenceVoice = "en-US-JennyNeural"

// errTTSNotConfigured is returned by Reference when the synthesizer cannot run
// at all. This is distinct from a Synthesize *call* failing (network/5xx) —
// checking Configured() upfront mirrors quizAudioHandler.entry's own guard and
// gives a clearer error than letting a nil/unconfigured client fail deep
// inside an HTTP call.
var errTTSNotConfigured = errors.New("speech: tts not configured, cannot derive reference")

// Reference returns the canonical syllable/phoneme breakdown of a sentence,
// deriving it once by scoring our own TTS rendition against the same text
// (business-logic-model §1 ReferenceDerivation) — the practice screen needs
// IPA and a syllable grid *before* the learner has recorded anything (SoT
// screen-pronunciation.jsx:78), and Azure only segments audio it can hear.
//
// The scores from that self-graded pass are meaningless (a machine grading
// its own TTS output against the text it was told to read) — only the
// segmentation (which syllables/phonemes a word breaks into) and the clip's
// duration are kept; see stripScores.
//
// Cached globally per sentence_key (business-rules R9: one row, no per-user
// variation) so a hit costs nothing — no Synthesize, no Assess. A miss costs
// exactly one of each, and the result is written back best-effort so the next
// caller (any user) is a hit.
//
// A derivation failure (TTS unconfigured, or a Synthesize/Assess error) is
// returned as an honest error — it does NOT touch the scoring path (Record):
// business-rules §5 has the caller proceed without a reference, hiding the
// IPA line and native waveform rather than fabricating one.
func (s *Service) Reference(ctx context.Context, userID, text string) (*ports.SentenceReferenceRow, error) {
	locale := s.pron.LocaleFor(ctx, userID)
	key := SentenceKey(text, locale)

	existing, err := s.repo.GetReference(ctx, key)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return existing, nil
	}

	if s.tts == nil || !s.tts.Configured() {
		return nil, errTTSNotConfigured
	}

	wav, err := s.tts.Synthesize(ctx, text, referenceVoice, locale)
	if err != nil {
		return nil, err
	}

	scored, err := s.pron.Assess(ctx, userID, wav, text)
	if err != nil {
		return nil, err
	}

	ref := ports.SentenceReferenceRow{
		SentenceKey:   key,
		ReferenceText: text,
		Locale:        locale,
		IPA:           ipaLine(scored.Words),
		Words:         stripScores(scored.Words),
		DurationMS:    DurationMS(wav),
	}
	_ = s.repo.PutReference(ctx, ref) // best-effort: first-writer-wins (R9), a race just wastes one Azure call
	return &ref, nil
}

// ipaLine assembles one IPA line from per-word phoneme segmentation, matching
// the design's rendered form (design-handoff screen-pronunciation.jsx:78):
// words separated by a space, a word's own phonemes concatenated with no
// separator, the whole line wrapped in slashes — e.g.
// "/aɪm ˈɡɪvɪŋ juː .../".
//
// If Azure returned no phonemes at all (business-rules R10: granularity can
// come back word-only), there is nothing honest to show — an empty string
// tells the caller to hide the IPA row rather than render a lie.
func ipaLine(words []ports.WordScore) string {
	parts := make([]string, 0, len(words))
	haveAny := false
	for _, w := range words {
		if len(w.Phonemes) == 0 {
			continue
		}
		haveAny = true
		var b strings.Builder
		for _, p := range w.Phonemes {
			b.WriteString(p.Phoneme)
		}
		parts = append(parts, b.String())
	}
	if !haveAny {
		return ""
	}
	return "/" + strings.Join(parts, " ") + "/"
}

// stripScores keeps only the syllable/phoneme segmentation from a self-scored
// word list, dropping every accuracy number (word/syllable/phoneme) and the
// error-type label. Those numbers came from Azure grading our own TTS output
// against the exact text it was asked to read — not a real speaker, so
// "accuracy" there is not a fact about pronunciation, just noise the
// synthetic voice happened to produce. Keeping it around invites a future
// reader to ask "why is the canonical reference's accuracy only 62%?" when
// the honest answer is "that number was never meant to mean anything."
func stripScores(words []ports.WordScore) []ports.WordScore {
	out := make([]ports.WordScore, len(words))
	for i, w := range words {
		nw := ports.WordScore{Word: w.Word}
		if len(w.Syllables) > 0 {
			nw.Syllables = make([]ports.SyllableResult, len(w.Syllables))
			for j, sy := range w.Syllables {
				nw.Syllables[j] = ports.SyllableResult{Syllable: sy.Syllable, Grapheme: sy.Grapheme}
			}
		}
		if len(w.Phonemes) > 0 {
			nw.Phonemes = make([]ports.PhonemeResult, len(w.Phonemes))
			for j, p := range w.Phonemes {
				nw.Phonemes[j] = ports.PhonemeResult{Phoneme: p.Phoneme}
			}
		}
		out[i] = nw
	}
	return out
}
