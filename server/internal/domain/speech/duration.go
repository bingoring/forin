package speech

import "encoding/binary"

// DurationMS estimates a RIFF/WAVE PCM16 clip's length in milliseconds from its
// data-chunk byte count and format (sample rate x channels x 2 bytes/sample),
// without decoding samples. The azurespeech adapter never fills
// PronunciationResult.DurationMS (see ports.PronunciationResult), so this
// package computes it from the WAV the caller captured, ahead of storing an
// attempt (business-rules R6 / domain-entities SpeechAttempt.DurationMS).
//
// Malformed or unexpected-format input returns 0 rather than an error: the
// duration is display-only ("2.9초" on the result screen), never a gate on
// whether an attempt gets scored or stored.
func DurationMS(wav []byte) int {
	if len(wav) < 12 || string(wav[0:4]) != "RIFF" || string(wav[8:12]) != "WAVE" {
		return 0
	}
	var sampleRate, channels, dataLen int
	pos := 12
	for pos+8 <= len(wav) {
		id := string(wav[pos : pos+4])
		size := int(binary.LittleEndian.Uint32(wav[pos+4 : pos+8]))
		pos += 8
		if size < 0 {
			return 0
		}
		if pos+size > len(wav) {
			size = len(wav) - pos // tolerate a truncated final chunk
		}
		chunk := wav[pos : pos+size]
		switch id {
		case "fmt ":
			if len(chunk) >= 16 {
				channels = int(binary.LittleEndian.Uint16(chunk[2:4]))
				sampleRate = int(binary.LittleEndian.Uint32(chunk[4:8]))
			}
		case "data":
			dataLen = len(chunk)
		}
		pos += size
		if size%2 == 1 { // chunks are word-aligned
			pos++
		}
	}
	if sampleRate <= 0 || channels <= 0 || dataLen <= 0 {
		return 0
	}
	bytesPerSec := sampleRate * channels * 2
	return dataLen * 1000 / bytesPerSec
}
