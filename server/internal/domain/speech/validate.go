package speech

import "errors"

// ErrInvalidAudio means the uploaded clip fails business-rules §2's audio
// validation row: "WAV(RIFF PCM16) 16kHz mono, 최대 10초 · 최대 1MB" -> 400
// invalid_audio. Exported, like ErrNoSpeech/ErrUnsupportedLocale/
// ErrTTSNotConfigured, so a caller (the HTTP layer) can map it with
// errors.Is instead of string-matching.
var ErrInvalidAudio = errors.New("speech: invalid audio")

const (
	// maxAudioBytes is business-rules §2's "최대 1MB" on the whole clip.
	maxAudioBytes = 1 << 20
	// maxAudioMS mirrors R6's 10-second recording cap. A clip longer than
	// this on the wire means either the client's own auto-stop didn't fire,
	// or the request isn't a genuine recording — reject rather than trust it
	// (and rather than pay for an Azure call on it).
	maxAudioMS = 10_000
)

// ValidateWAV is a hard gate — unlike DurationMS (display-only, never
// errors), an invalid clip here must not reach Assess (a paid Azure call) or
// storage. It checks every clause of business-rules §2's audio row: RIFF/WAVE
// PCM16, mono, 16kHz, at most 1MB, at most 10s.
func ValidateWAV(wav []byte) error {
	if len(wav) == 0 || len(wav) > maxAudioBytes {
		return ErrInvalidAudio
	}
	f, ok := parseWAV(wav)
	if !ok {
		return ErrInvalidAudio
	}
	if f.audioFormat != 1 || f.channels != 1 || f.sampleRate != 16000 || f.bitsPerSample != 16 || f.dataLen == 0 {
		return ErrInvalidAudio
	}
	bytesPerSec := f.sampleRate * f.channels * 2
	if f.dataLen*1000/bytesPerSec > maxAudioMS {
		return ErrInvalidAudio
	}
	return nil
}
