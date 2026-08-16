package speech

import (
	"encoding/binary"
	"testing"
)

// buildWav assembles a minimal canonical RIFF/WAVE PCM16 clip: numSamples
// samples per channel, at sampleRate, with the given channel count. Sample
// values themselves don't matter for duration math, so they're all zero.
func buildWav(sampleRate, channels, numSamples int) []byte {
	dataLen := numSamples * channels * 2
	buf := make([]byte, 44+dataLen)
	copy(buf[0:4], "RIFF")
	binary.LittleEndian.PutUint32(buf[4:8], uint32(36+dataLen))
	copy(buf[8:12], "WAVE")
	copy(buf[12:16], "fmt ")
	binary.LittleEndian.PutUint32(buf[16:20], 16) // fmt chunk size
	binary.LittleEndian.PutUint16(buf[20:22], 1)  // PCM
	binary.LittleEndian.PutUint16(buf[22:24], uint16(channels))
	binary.LittleEndian.PutUint32(buf[24:28], uint32(sampleRate))
	byteRate := sampleRate * channels * 2
	binary.LittleEndian.PutUint32(buf[28:32], uint32(byteRate))
	binary.LittleEndian.PutUint16(buf[32:34], uint16(channels*2)) // block align
	binary.LittleEndian.PutUint16(buf[34:36], 16)                 // bits per sample
	copy(buf[36:40], "data")
	binary.LittleEndian.PutUint32(buf[40:44], uint32(dataLen))
	return buf
}

func TestDurationMSComputesFromDataChunk(t *testing.T) {
	// 16kHz mono, 1.5s of audio -> 24000 samples.
	wav := buildWav(16000, 1, 24000)
	if got := DurationMS(wav); got != 1500 {
		t.Fatalf("DurationMS = %d, want 1500", got)
	}
}

func TestDurationMSAccountsForChannels(t *testing.T) {
	// Same per-channel sample count (1.5s worth) as the mono case, but stereo:
	// twice the data bytes. If channels were ignored, this would read as 3s.
	wav := buildWav(16000, 2, 24000)
	if got := DurationMS(wav); got != 1500 {
		t.Fatalf("DurationMS = %d, want 1500 (stereo)", got)
	}
}

func TestDurationMSZeroOnGarbage(t *testing.T) {
	cases := map[string][]byte{
		"empty":       {},
		"too short":   []byte("RIFF"),
		"not riff":    []byte("this is not a wav file at all, just text"),
		"no fmt/data": append([]byte("RIFF"), append(make([]byte, 4), []byte("WAVE")...)...),
	}
	for name, b := range cases {
		if got := DurationMS(b); got != 0 {
			t.Errorf("%s: DurationMS = %d, want 0 (display-only, must not error)", name, got)
		}
	}
}

func TestDurationMSZeroWhenDataChunkMissing(t *testing.T) {
	wav := buildWav(16000, 1, 100)
	// Truncate right after the fmt chunk so there is no data chunk.
	truncated := wav[:36]
	if got := DurationMS(truncated); got != 0 {
		t.Fatalf("DurationMS = %d, want 0 when data chunk is missing", got)
	}
}
