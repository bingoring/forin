package azurespeech

import "testing"

const respWithPhonemes = `{"RecognitionStatus":"Success","DisplayText":"I'm giving you acetaminophen",
"NBest":[{"Display":"I'm giving you acetaminophen","AccuracyScore":84,"FluencyScore":79,
"CompletenessScore":100,"PronScore":81,"ProsodyScore":80,
"Words":[{"Word":"acetaminophen","AccuracyScore":62,"ErrorType":"None",
"Syllables":[{"Syllable":"cet","Grapheme":"cet","AccuracyScore":70},{"Syllable":"min","AccuracyScore":41}],
"Phonemes":[{"Phoneme":"s","AccuracyScore":88},{"Phoneme":"ɪ","AccuracyScore":41}]}]}]}`

const respWordOnly = `{"RecognitionStatus":"Success","DisplayText":"hello",
"NBest":[{"Display":"hello","AccuracyScore":90,"FluencyScore":88,"CompletenessScore":100,"PronScore":89,
"Words":[{"Word":"hello","AccuracyScore":90,"ErrorType":"None"}]}]}`

const respNoSpeech = `{"RecognitionStatus":"NoMatch","DisplayText":"","NBest":[]}`

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
	if got.ProsodyOK {
		t.Fatalf("prosody must be unavailable when Azure omits it, got %v", got.Prosody)
	}
}

func TestParseNoSpeechIsAnError(t *testing.T) {
	if _, err := parseAssessment([]byte(respNoSpeech)); err == nil {
		t.Fatal("empty NBest must be an error so the caller can return no_speech_detected")
	}
}
