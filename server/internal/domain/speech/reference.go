package speech

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/bingoring/forin/server/internal/ports"
)

// voicesByLocale maps a BCP-47 locale — exactly the set pronunciation.go's
// localeFor can produce — to a concrete Azure neural voice for reference
// synthesis. quiz_audio_handler.go's audioVoice/audioLocale can never drift
// apart because both are fixed constants (that handler only ever speaks
// en-US); Reference has no such luxury — locale comes from LocaleFor and
// varies with the user's target language. A single hardcoded voice constant
// paired with a variable locale would silently mismatch (e.g. locale=ja-JP,
// voice=en-US-JennyNeural): Azure's SSML honors the named voice regardless of
// the declared xml:lang (azurespeech.Client.Synthesize), so it does not
// reject the mismatch — it quietly synthesizes the wrong-sounding audio, that
// gets self-scored, and R9 caches the resulting garbage in speech_references
// globally, forever, with no invalidation path in this codebase. Keeping
// voice and locale as one hardcoded pair per entry closes that off entirely.
var voicesByLocale = map[string]string{
	"en-US": "en-US-JennyNeural",
	"de-DE": "de-DE-KatjaNeural",
	"ja-JP": "ja-JP-NanamiNeural",
	"ko-KR": "ko-KR-SunHiNeural",
	"zh-CN": "zh-CN-XiaoxiaoNeural",
	"es-ES": "es-ES-ElviraNeural",
	"fr-FR": "fr-FR-DeniseNeural",
}

// voiceForLocale looks up the voice paired with locale. ok=false means "we
// have no voice for this locale — do not guess." Reference treats that as a
// reason to skip derivation (see ErrUnsupportedLocale), not to fall back to
// en-US: TargetLang has no allow-list validation (me_handler.go's
// orDefault(req.TargetLang, "en") stores whatever the client sends), and a
// permanent, sentence_key-global, invalidation-free cache (R9) is the wrong
// place to paper over that with a guess. In today's codebase LocaleFor's own
// switch (pronunciation.go's localeFor) always defaults unrecognized
// TargetLang values to "en-US" — so this branch is not reachable through
// Reference yet — but it stays as the guard against the day localeFor grows
// an 8th language before this map is updated in lockstep.
func voiceForLocale(locale string) (string, bool) {
	v, ok := voicesByLocale[locale]
	return v, ok
}

// ErrUnsupportedLocale is returned by Reference when it has no voice paired
// with the resolved locale (see voiceForLocale). Exported, like
// azurespeech.ErrNoSpeech, so a caller (Task 5's HTTP layer) can distinguish
// it from other failures with errors.Is instead of string-matching.
var ErrUnsupportedLocale = errors.New("speech: no reference voice for locale")

// maxReferenceAudioBytes bounds a synthesized reference clip before it is
// EVER persisted (review round 2, Important 4). Text length alone (the HTTP
// layer's maxReferenceTextLen, 300 runes) does not bound synthesized AUDIO
// size directly — Azure's spoken rate and sample rate vary by voice/locale —
// and speech_references has no invalidation path (R9): an oversized clip
// written once sits there forever. 2MiB is a generous multiple of the
// ~320KB a full 10s/16kHz mono clip costs (business-rules R6's own cap on
// USER-recorded audio), leaving headroom for Azure TTS's own higher sample
// rate (24kHz in this package's own tests) while still refusing anything
// pathological.
const maxReferenceAudioBytes = 2 << 20 // 2MiB

// ErrReferenceAudioTooLarge is returned when a synthesized reference clip
// exceeds maxReferenceAudioBytes — checked BEFORE the clip is written
// anywhere (PutReference or UpdateReferenceAudio), so an oversized clip
// never becomes a permanent, unrecoverable row.
var ErrReferenceAudioTooLarge = errors.New("speech: synthesized reference audio exceeds the size cap")

func checkReferenceAudioSize(wav []byte) error {
	if len(wav) > maxReferenceAudioBytes {
		return fmt.Errorf("%w: %d bytes (cap %d)", ErrReferenceAudioTooLarge, len(wav), maxReferenceAudioBytes)
	}
	return nil
}

// ErrTTSNotConfigured is returned by Reference when the synthesizer cannot run
// at all. This is distinct from a Synthesize *call* failing (network/5xx) —
// checking Configured() upfront mirrors quizAudioHandler.entry's own guard and
// gives a clearer error than letting a nil/unconfigured client fail deep
// inside an HTTP call. Exported (like azurespeech.ErrNoSpeech) so a caller in
// another package can distinguish it with errors.Is.
var ErrTTSNotConfigured = errors.New("speech: tts not configured, cannot derive reference")

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

	voice, ok := voiceForLocale(locale)
	if !ok {
		return nil, fmt.Errorf("%w: %s", ErrUnsupportedLocale, locale)
	}

	if s.tts == nil || !s.tts.Configured() {
		return nil, ErrTTSNotConfigured
	}

	wav, err := s.tts.Synthesize(ctx, text, voice, locale)
	if err != nil {
		return nil, err
	}
	// Checked before Assess: no reason to pay for scoring a clip that will
	// never be persisted anyway (review round 2, Important 4).
	if err := checkReferenceAudioSize(wav); err != nil {
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
		// Task 11: the same WAV this derivation just synthesized is persisted
		// alongside the segmentation, so native playback (ReferenceAudio,
		// below) never pays for a second Synthesize call — "reused in native
		// playback" was this package's own doc promise from the start.
		ReferenceAudio: wav,
	}
	_ = s.repo.PutReference(ctx, ref) // best-effort: first-writer-wins (R9), a race just wastes one Azure call
	return &ref, nil
}

// ReferenceAudio returns the synthesized WAV backing a sentence's canonical
// reference — the exact clip Reference (above) produced when it derived the
// segmentation, never a fresh Synthesize call on a cache hit (Task 11 closes
// task-11-brief.md item ②: T4 synthesized this audio and then discarded it).
//
// Review round 2 (Important 1): a row that predates the audio_wav column (or
// one left behind by an audio-cap rejection, or by running migration 000022's
// down and back up) is BACKFILLED here, not left permanently empty — Reference
// itself cannot do this because it hits its own cache (GetReference) and
// returns before ever calling Synthesize again; PutReference's ON CONFLICT DO
// NOTHING would not touch an existing row's audio_wav either way. Backfilling
// re-synthesizes ONLY the audio, against the row's own already-stored
// Locale/ReferenceText (never re-derives segmentation, never calls Assess
// again — that work is done and permanent, R9) and writes it back with
// UpdateReferenceAudio, which is itself conditioned on audio_wav still being
// empty (first-writer-wins, matching R9's spirit for the row as a whole).
//
// A nil/empty return (with a nil error) means "no audio to serve" — only when
// backfilling itself fails (TTS unconfigured, unsupported locale, an
// oversized clip, or a Synthesize/repo error). The caller
// (speech_audio_handler.go) treats that identically to any other derivation
// failure: leave the playback button/route inert, never fabricate a clip.
func (s *Service) ReferenceAudio(ctx context.Context, userID, text string) ([]byte, error) {
	locale := s.pron.LocaleFor(ctx, userID)
	key := SentenceKey(text, locale)

	wav, err := s.repo.GetReferenceAudio(ctx, key)
	if err != nil {
		return nil, err
	}
	if len(wav) > 0 {
		return wav, nil
	}

	existing, err := s.repo.GetReference(ctx, key)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		// No reference derived at all yet. Reference() is the single code
		// path that produces a row + its audio together (see its own
		// PutReference call above) — reusing it here, rather than calling
		// Synthesize directly, means this can never end up with audio
		// recorded in a different voice/locale pairing than the
		// segmentation it plays back alongside (voiceForLocale's own doc
		// explains why that pairing matters).
		if _, err := s.Reference(ctx, userID, text); err != nil {
			return nil, err
		}
		return s.repo.GetReferenceAudio(ctx, key)
	}

	// Backfill path: the row exists (segmentation already derived and
	// permanent) but audio_wav is empty. Re-synthesize against the SAME
	// voice/locale pairing the row itself already committed to.
	voice, ok := voiceForLocale(existing.Locale)
	if !ok {
		return nil, fmt.Errorf("%w: %s", ErrUnsupportedLocale, existing.Locale)
	}
	if s.tts == nil || !s.tts.Configured() {
		return nil, ErrTTSNotConfigured
	}
	newWav, err := s.tts.Synthesize(ctx, existing.ReferenceText, voice, existing.Locale)
	if err != nil {
		return nil, err
	}
	if err := checkReferenceAudioSize(newWav); err != nil {
		return nil, err
	}
	if err := s.repo.UpdateReferenceAudio(ctx, key, newWav); err != nil {
		return nil, err
	}
	return newWav, nil
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
