package speech

import "encoding/binary"

// wavFormat is the subset of a RIFF/WAVE clip's fmt+data chunks that this
// package's two WAV consumers need: DurationMS (display-only estimate) and
// ValidateWAV (a hard format/size/duration gate, validate.go). Shared here so
// both walk the chunk list exactly once, the same way.
type wavFormat struct {
	audioFormat   int // 1 = PCM; anything else (e.g. IEEE float) is not what Assess expects
	channels      int
	sampleRate    int
	bitsPerSample int
	dataLen       int
}

// parseWAV walks a RIFF/WAVE container's chunks and pulls out the "fmt " and
// "data" chunks' fields. ok=false means the header or chunk list could not be
// parsed at all (missing RIFF/WAVE magic, a chunk claiming a negative size, or
// never finding both a fmt and a data chunk) — callers decide what
// "unparseable" means for their own purpose (DurationMS: report 0 duration;
// ValidateWAV: reject the clip).
//
// A chunk that overruns the buffer is tolerated by truncating it to what's
// actually there, rather than failing outright — DurationMS's original
// behavior for a clip truncated mid-final-chunk, kept as-is by this
// refactor so its existing tests (duration_test.go) still hold.
func parseWAV(wav []byte) (wavFormat, bool) {
	var f wavFormat
	if len(wav) < 12 || string(wav[0:4]) != "RIFF" || string(wav[8:12]) != "WAVE" {
		return f, false
	}
	haveFmt, haveData := false, false
	pos := 12
	for pos+8 <= len(wav) {
		id := string(wav[pos : pos+4])
		size := int(binary.LittleEndian.Uint32(wav[pos+4 : pos+8]))
		pos += 8
		if size < 0 {
			return f, false
		}
		if pos+size > len(wav) {
			size = len(wav) - pos // tolerate a truncated final chunk
		}
		chunk := wav[pos : pos+size]
		switch id {
		case "fmt ":
			if len(chunk) >= 16 {
				f.audioFormat = int(binary.LittleEndian.Uint16(chunk[0:2]))
				f.channels = int(binary.LittleEndian.Uint16(chunk[2:4]))
				f.sampleRate = int(binary.LittleEndian.Uint32(chunk[4:8]))
				f.bitsPerSample = int(binary.LittleEndian.Uint16(chunk[14:16]))
				haveFmt = true
			}
		case "data":
			f.dataLen = len(chunk)
			haveData = true
		}
		pos += size
		if size%2 == 1 { // chunks are word-aligned
			pos++
		}
	}
	return f, haveFmt && haveData
}

// DurationMS estimates a RIFF/WAVE PCM16 clip's length in milliseconds from its
// data-chunk byte count and format (sample rate x channels x 2 bytes/sample),
// without decoding samples. The azurespeech adapter never fills
// PronunciationResult.DurationMS (see ports.PronunciationResult), so this
// package computes it from the WAV the caller captured, ahead of storing an
// attempt (business-rules R6 / domain-entities SpeechAttempt.DurationMS).
//
// Malformed or unexpected-format input returns 0 rather than an error: the
// duration is display-only ("2.9초" on the result screen), never a gate on
// whether an attempt gets scored or stored — format/size gating is
// ValidateWAV's job, not this function's (see validate.go).
func DurationMS(wav []byte) int {
	f, ok := parseWAV(wav)
	if !ok || f.sampleRate <= 0 || f.channels <= 0 || f.dataLen <= 0 {
		return 0
	}
	bytesPerSec := f.sampleRate * f.channels * 2
	return f.dataLen * 1000 / bytesPerSec
}
