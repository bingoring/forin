package azurespeech

import (
	"encoding/json"
	"errors"
	"testing"
)

// Azure returns SAPI phonemes ("ih", "iy", "th") unless the alphabet is asked
// for explicitly: "To request IPA phonemes, set the phoneme alphabet to IPA.
// If you don't specify the alphabet, the phonemes are in SAPI format by
// default." (learn.microsoft.com/azure/ai-services/speech-service/
// how-to-pronunciation-assessment). Everything downstream — ports.PhonemeResult's
// contract, the fixtures in this file, content/phonemetips' canonical keys —
// is written against IPA. Drop this parameter and Azure silently switches
// alphabets: nothing errors, but every phoneme tip stops matching and the
// correction-point section renders empty forever.
func TestAssessConfigRequestsIPAPhonemes(t *testing.T) {
	raw, err := assessConfig("good morning")
	if err != nil {
		t.Fatalf("assessConfig: %v", err)
	}
	var cfg map[string]any
	if err := json.Unmarshal(raw, &cfg); err != nil {
		t.Fatalf("config is not JSON: %v", err)
	}
	if cfg["PhonemeAlphabet"] != "IPA" {
		t.Fatalf("PhonemeAlphabet must be IPA or Azure falls back to SAPI and every phoneme tip misses; got %v", cfg["PhonemeAlphabet"])
	}
	// Phoneme granularity is what produces the phonemes the alphabet applies to.
	if cfg["Granularity"] != "Phoneme" {
		t.Fatalf("Granularity must be Phoneme, got %v", cfg["Granularity"])
	}
	if cfg["ReferenceText"] != "good morning" {
		t.Fatalf("ReferenceText not carried through, got %v", cfg["ReferenceText"])
	}
}

const respWithPhonemes = `{"RecognitionStatus":"Success","DisplayText":"I'm giving you acetaminophen",
"NBest":[{"Display":"I'm giving you acetaminophen","AccuracyScore":84,"FluencyScore":79,
"CompletenessScore":100,"PronScore":81,"ProsodyScore":80,
"Words":[{"Word":"acetaminophen","AccuracyScore":62,"ErrorType":"None",
"Syllables":[{"Syllable":"cet","Grapheme":"cet","AccuracyScore":70,"Offset":7500000,"Duration":4100000},
{"Syllable":"min","AccuracyScore":41,"Offset":11700000,"Duration":9600000}],
"Phonemes":[{"Phoneme":"s","AccuracyScore":88,"Offset":7500000,"Duration":4100000},
{"Phoneme":"ɪ","AccuracyScore":41,"Offset":11700000,"Duration":500000}]}]}]}`

const respWordOnly = `{"RecognitionStatus":"Success","DisplayText":"hello",
"NBest":[{"Display":"hello","AccuracyScore":90,"FluencyScore":88,"CompletenessScore":100,"PronScore":89,
"Words":[{"Word":"hello","AccuracyScore":90,"ErrorType":"None"}]}]}`

const respNoSpeech = `{"RecognitionStatus":"NoMatch","DisplayText":"","NBest":[]}`

// Some Azure responses carry the recognized text only on the top-level
// DisplayText, with NBest[0].Display empty. Recognized must fall back to
// DisplayText in that case — this is the case the pre-Task-1 code handled
// and the granularity rewrite silently dropped.
const respDisplayTextOnly = `{"RecognitionStatus":"Success","DisplayText":"the wound looks clean",
"NBest":[{"Display":"","AccuracyScore":70,"FluencyScore":70,"CompletenessScore":100,"PronScore":70,
"Words":[{"Word":"wound","AccuracyScore":70,"ErrorType":"None"}]}]}`

func TestParsePhonemeGranularity(t *testing.T) {
	got, err := parseAssessment([]byte(respWithPhonemes))
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if got.Overall != 81 || got.Accuracy != 84 {
		t.Fatalf("scores: %+v", got)
	}
	if !got.ProsodyOK || got.Prosody != 80 {
		t.Fatalf("prosody should be present: %+v", got)
	}
	if len(got.Words) != 1 || len(got.Words[0].Syllables) != 2 || len(got.Words[0].Phonemes) != 2 {
		t.Fatalf("syllables/phonemes not parsed: %+v", got.Words)
	}
	if got.Words[0].Syllables[1].Syllable != "min" || got.Words[0].Syllables[1].Accuracy != 41 {
		t.Fatalf("syllable detail: %+v", got.Words[0].Syllables)
	}
	if got.Words[0].Phonemes[1].Phoneme != "ɪ" {
		t.Fatalf("phoneme detail: %+v", got.Words[0].Phonemes)
	}
}

// A correction point is labeled with the *syllable* the bad phoneme sits in
// (business-logic-model §2: SoT's "min"/"li" are syllables, not phonemes), and
// Azure hands syllables and phonemes over as two flat sibling arrays with no
// index linking them. The link is timing: "You can use the Offset and Duration
// values to align syllables with their corresponding phonemes. For example,
// the starting offset (11700000) of the second syllable loʊ aligns with the
// third phoneme, l." (learn.microsoft.com/azure/ai-services/speech-service/
// how-to-pronunciation-assessment). Dropping these fields at the adapter
// forces the caller to guess the alignment from array order instead.
func TestParseKeepsSyllableAndPhonemeTiming(t *testing.T) {
	got, err := parseAssessment([]byte(respWithPhonemes))
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	w := got.Words[0]
	if w.Syllables[1].Offset != 11700000 || w.Syllables[1].Duration != 9600000 {
		t.Fatalf("syllable timing dropped — the syllable label for a phoneme can no longer be derived: %+v", w.Syllables[1])
	}
	if w.Phonemes[1].Offset != 11700000 || w.Phonemes[1].Duration != 500000 {
		t.Fatalf("phoneme timing dropped: %+v", w.Phonemes[1])
	}
	// The point of keeping both: this phoneme is inside that syllable.
	syl, ph := w.Syllables[1], w.Phonemes[1]
	if ph.Offset < syl.Offset || ph.Offset >= syl.Offset+syl.Duration {
		t.Fatalf("phoneme %q should fall inside syllable %q by offset", ph.Phoneme, syl.Syllable)
	}
}

// A response without Syllables/Phonemes must still parse — business-rules R10.
// Prosody must report unavailable rather than a fabricated 0.
func TestParseWordOnlyStillWorks(t *testing.T) {
	got, err := parseAssessment([]byte(respWordOnly))
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if len(got.Words) != 1 || len(got.Words[0].Syllables) != 0 {
		t.Fatalf("expected word-only: %+v", got.Words)
	}
	if got.Words[0].Syllables != nil {
		t.Fatalf("Syllables must be nil (not an empty slice) when Azure sends none: %+v", got.Words[0].Syllables)
	}
	if got.Words[0].Phonemes != nil {
		t.Fatalf("Phonemes must be nil (not an empty slice) when Azure sends none: %+v", got.Words[0].Phonemes)
	}
	if got.ProsodyOK {
		t.Fatalf("prosody must be unavailable when Azure omits it, got %v", got.Prosody)
	}
}

func TestParseNoSpeechIsAnError(t *testing.T) {
	_, err := parseAssessment([]byte(respNoSpeech))
	if !errors.Is(err, ErrNoSpeech) {
		t.Fatalf("empty NBest must be ErrNoSpeech so the caller can map it to no_speech_detected, got %v", err)
	}
}

// Recognized must prefer the top-level DisplayText, falling back to
// NBest[0].Display only when DisplayText is empty — mirrors Transcribe's
// priority for the same Azure response shape.
func TestParseRecognizedPrefersDisplayText(t *testing.T) {
	got, err := parseAssessment([]byte(respDisplayTextOnly))
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if got.Recognized != "the wound looks clean" {
		t.Fatalf("Recognized should fall back to DisplayText when Display is empty, got %q", got.Recognized)
	}
}
