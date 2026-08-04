package http

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"errors"
	"math"
	"net/http"
	"sync"
	"time"

	"github.com/bingoring/forin/server/internal/platform/httpx"
	"github.com/bingoring/forin/server/internal/ports"
)

// quizAudioHandler voices a listen-quiz's dictation line via TTS and exposes both
// the audio clip and a real amplitude waveform (so the client can play it and
// color the bars in sync with playback). Synthesis is cached per audio text, so
// repeat plays cost nothing.
type quizAudioHandler struct {
	content ports.ContentReader
	synth   ports.SpeechSynthesizer
	cache   sync.Map // audioKey → *audioEntry
}

type audioEntry struct {
	wav      []byte
	waveform []int
	durMs    int
}

const (
	audioVoice  = "en-US-JennyNeural"
	audioLocale = "en-US"
	audioBars   = 48 // waveform resolution (bars)
)

var errNoAudioText = errors.New("quiz has no audio text")

// entry returns the (cached) synthesized clip + waveform for a quiz, synthesizing
// on first request. The second return is an HTTP status to use on error.
func (h *quizAudioHandler) entry(ctx context.Context, quizID string) (*audioEntry, int, error) {
	q, err := h.content.GetQuiz(ctx, quizID)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	if q == nil || q.Content == nil || q.Content.AudioText == "" {
		return nil, http.StatusNotFound, errNoAudioText
	}
	key := audioKey(q.Content.AudioText)
	if v, ok := h.cache.Load(key); ok {
		return v.(*audioEntry), http.StatusOK, nil
	}
	if h.synth == nil || !h.synth.Configured() {
		return nil, http.StatusServiceUnavailable, errors.New("tts not configured")
	}
	wav, err := h.synth.Synthesize(ctx, q.Content.AudioText, audioVoice, audioLocale)
	if err != nil {
		return nil, http.StatusBadGateway, err
	}
	samples, sr, err := parseWavPCM16(wav)
	if err != nil {
		return nil, http.StatusBadGateway, err
	}
	e := &audioEntry{wav: wav, waveform: waveformPeaks(samples, audioBars)}
	if sr > 0 {
		e.durMs = len(samples) * 1000 / sr
	}
	h.cache.Store(key, e)
	return e, http.StatusOK, nil
}

// @Summary Synthesized dictation audio for a listen quiz (WAV)
// @Tags content
// @Router /quizzes/{id}/audio.wav [get]
func (h *quizAudioHandler) audio(w http.ResponseWriter, r *http.Request) {
	e, status, err := h.entry(r.Context(), r.PathValue("id"))
	if err != nil {
		httpx.Error(w, status, "audio unavailable")
		return
	}
	w.Header().Set("Content-Type", "audio/wav")
	w.Header().Set("Cache-Control", "public, max-age=86400")
	// ServeContent adds Accept-Ranges + honors Range with 206 — iOS AVPlayer needs
	// HTTP range support to load a streamed clip (a plain 200 fails to load).
	http.ServeContent(w, r, "audio.wav", time.Time{}, bytes.NewReader(e.wav))
}

// @Summary Waveform + duration for a listen quiz's dictation audio
// @Tags content
// @Router /quizzes/{id}/audio-meta [get]
func (h *quizAudioHandler) meta(w http.ResponseWriter, r *http.Request) {
	e, status, err := h.entry(r.Context(), r.PathValue("id"))
	if err != nil {
		httpx.Error(w, status, "audio unavailable")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"waveform":   e.waveform,
		"durationMs": e.durMs,
		"url":        "/quizzes/" + r.PathValue("id") + "/audio.wav",
	})
}

func audioKey(text string) string {
	sum := sha256.Sum256([]byte(audioVoice + "|" + text))
	return hex.EncodeToString(sum[:8])
}

// parseWavPCM16 extracts 16-bit PCM samples + sample rate from a RIFF/WAVE clip,
// scanning chunks so it tolerates non-canonical headers (extra chunks, padding).
func parseWavPCM16(b []byte) ([]int16, int, error) {
	if len(b) < 12 || string(b[0:4]) != "RIFF" || string(b[8:12]) != "WAVE" {
		return nil, 0, errors.New("not a WAV")
	}
	sampleRate := 0
	var data []byte
	pos := 12
	for pos+8 <= len(b) {
		id := string(b[pos : pos+4])
		size := int(binary.LittleEndian.Uint32(b[pos+4 : pos+8]))
		pos += 8
		if size < 0 || pos+size > len(b) {
			size = len(b) - pos // tolerate a truncated final chunk
		}
		chunk := b[pos : pos+size]
		switch id {
		case "fmt ":
			if len(chunk) >= 8 {
				sampleRate = int(binary.LittleEndian.Uint32(chunk[4:8]))
			}
		case "data":
			data = chunk
		}
		pos += size
		if size%2 == 1 { // chunks are word-aligned
			pos++
		}
	}
	if data == nil {
		return nil, sampleRate, errors.New("no data chunk")
	}
	n := len(data) / 2
	samples := make([]int16, n)
	for i := 0; i < n; i++ {
		samples[i] = int16(binary.LittleEndian.Uint16(data[i*2:]))
	}
	return samples, sampleRate, nil
}

// waveformPeaks reduces PCM samples to `bars` RMS amplitudes normalized 0..100 —
// the real loudness envelope of the clip, so the drawn bars match the audio.
func waveformPeaks(samples []int16, bars int) []int {
	peaks := make([]int, bars)
	if len(samples) == 0 || bars <= 0 {
		return peaks
	}
	raw := make([]float64, bars)
	max := 0.0
	for i := 0; i < bars; i++ {
		start := i * len(samples) / bars
		end := (i + 1) * len(samples) / bars
		if end > len(samples) {
			end = len(samples)
		}
		var sum float64
		for j := start; j < end; j++ {
			v := float64(samples[j])
			sum += v * v
		}
		if end > start {
			raw[i] = math.Sqrt(sum / float64(end-start))
		}
		if raw[i] > max {
			max = raw[i]
		}
	}
	for i := 0; i < bars; i++ {
		if max > 0 {
			peaks[i] = int(math.Round(raw[i] / max * 100))
		}
		if peaks[i] < 4 { // floor so silent gaps still show a sliver
			peaks[i] = 4
		}
	}
	return peaks
}
