package speech

import (
	"errors"
	"testing"
)

// business-rules §2: "오디오 | WAV(RIFF PCM16) 16kHz mono, 최대 10초 · 최대 1MB |
// 400 invalid_audio". These tests are written before ValidateWAV exists (Task
// 5 review round 2, Important 3) to confirm they fail first.

func TestValidateWAVAcceptsCanonicalClip(t *testing.T) {
	wav := buildWav(16000, 1, 16000) // 1s, 16kHz mono
	if err := ValidateWAV(wav); err != nil {
		t.Fatalf("a canonical 16kHz mono PCM16 1s clip must validate, got %v", err)
	}
}

func TestValidateWAVRejectsStereo(t *testing.T) {
	wav := buildWav(16000, 2, 16000)
	if err := ValidateWAV(wav); !errors.Is(err, ErrInvalidAudio) {
		t.Fatalf("stereo must be rejected (mono required), got %v", err)
	}
}

func TestValidateWAVRejectsWrongSampleRate(t *testing.T) {
	wav := buildWav(44100, 1, 44100)
	if err := ValidateWAV(wav); !errors.Is(err, ErrInvalidAudio) {
		t.Fatalf("44.1kHz must be rejected (16kHz required), got %v", err)
	}
}

func TestValidateWAVRejectsOver10Seconds(t *testing.T) {
	wav := buildWav(16000, 1, 16000*11) // 11s
	if err := ValidateWAV(wav); !errors.Is(err, ErrInvalidAudio) {
		t.Fatalf("an 11s clip must be rejected (R6: max 10s), got %v", err)
	}
}

func TestValidateWAVRejectsOver1MB(t *testing.T) {
	// 16kHz mono PCM16 for 35s = 16000*2*35 = 1,120,000 bytes of data alone,
	// already over the 1MB (1,048,576-byte) cap on the whole clip.
	wav := buildWav(16000, 1, 16000*35)
	if err := ValidateWAV(wav); !errors.Is(err, ErrInvalidAudio) {
		t.Fatalf("a clip over 1MB must be rejected, got %v", err)
	}
}

func TestValidateWAVRejectsGarbage(t *testing.T) {
	if err := ValidateWAV([]byte("not a wav file")); !errors.Is(err, ErrInvalidAudio) {
		t.Fatalf("non-WAV bytes must be rejected, got %v", err)
	}
}

func TestValidateWAVRejectsEmpty(t *testing.T) {
	if err := ValidateWAV(nil); !errors.Is(err, ErrInvalidAudio) {
		t.Fatalf("empty audio must be rejected, got %v", err)
	}
}
