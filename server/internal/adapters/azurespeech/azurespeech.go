// Package azurespeech implements ports.PronunciationPort via the Azure Speech
// REST pronunciation-assessment endpoint. One adapter behind the port (swappable).
package azurespeech

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/bingoring/forin/server/internal/ports"
)

// Client calls Azure Speech-to-Text with a Pronunciation-Assessment header.
type Client struct {
	key    string
	region string
	http   *http.Client
}

func New(key, region string) *Client {
	return &Client{key: key, region: region, http: &http.Client{Timeout: 30 * time.Second}}
}

func (c *Client) Configured() bool { return c.key != "" && c.region != "" }

// Azure returns assessment scores flat on each NBest item and each Word.
type assessResp struct {
	RecognitionStatus string `json:"RecognitionStatus"`
	DisplayText       string `json:"DisplayText"`
	NBest             []struct {
		Display           string   `json:"Display"`
		AccuracyScore     float64  `json:"AccuracyScore"`
		FluencyScore      float64  `json:"FluencyScore"`
		CompletenessScore float64  `json:"CompletenessScore"`
		PronScore         float64  `json:"PronScore"`
		ProsodyScore      *float64 `json:"ProsodyScore"` // pointer: absent ≠ zero
		Words             []struct {
			Word          string  `json:"Word"`
			AccuracyScore float64 `json:"AccuracyScore"`
			ErrorType     string  `json:"ErrorType"`
			Syllables     []struct {
				Syllable      string  `json:"Syllable"`
				Grapheme      string  `json:"Grapheme"`
				AccuracyScore float64 `json:"AccuracyScore"`
			} `json:"Syllables"`
			Phonemes []struct {
				Phoneme       string  `json:"Phoneme"`
				AccuracyScore float64 `json:"AccuracyScore"`
			} `json:"Phonemes"`
		} `json:"Words"`
	} `json:"NBest"`
}

// ErrNoSpeech means the recognizer heard nothing usable. The caller maps this to
// 422 no_speech_detected rather than storing a meaningless attempt.
var ErrNoSpeech = errors.New("azurespeech: no speech detected")

// parseAssessment turns a raw pronunciation-assessment response body into a
// PronunciationResult. Split out from Assess so tests can exercise parsing
// against fixed JSON without going over HTTP.
func parseAssessment(body []byte) (*ports.PronunciationResult, error) {
	var ar assessResp
	if err := json.Unmarshal(body, &ar); err != nil {
		return nil, fmt.Errorf("azurespeech: bad response: %s", truncate(body))
	}
	if len(ar.NBest) == 0 {
		return nil, ErrNoSpeech
	}
	b := ar.NBest[0]
	// Recognized prefers the top-level DisplayText, falling back to
	// NBest[0].Display when DisplayText is empty — some responses carry the
	// text only on one of the two. Transcribe (below) uses the same priority
	// for the same response shape; keep them in sync.
	recognized := ar.DisplayText
	if recognized == "" {
		recognized = b.Display
	}
	out := &ports.PronunciationResult{
		Recognized:   recognized,
		Accuracy:     b.AccuracyScore,
		Fluency:      b.FluencyScore,
		Completeness: b.CompletenessScore,
		Overall:      b.PronScore,
	}
	if b.ProsodyScore != nil {
		out.Prosody, out.ProsodyOK = *b.ProsodyScore, true
	}
	for _, w := range b.Words {
		ws := ports.WordScore{Word: w.Word, Accuracy: w.AccuracyScore, ErrorType: w.ErrorType}
		for _, s := range w.Syllables {
			ws.Syllables = append(ws.Syllables, ports.SyllableResult{
				Syllable: s.Syllable, Grapheme: s.Grapheme, Accuracy: s.AccuracyScore})
		}
		for _, p := range w.Phonemes {
			ws.Phonemes = append(ws.Phonemes, ports.PhonemeResult{
				Phoneme: p.Phoneme, Accuracy: p.AccuracyScore})
		}
		out.Words = append(out.Words, ws)
	}
	return out, nil
}

// assessConfig builds the JSON that goes into the Pronunciation-Assessment
// header. Split out from Assess so a test can pin the parameters without
// going over HTTP — several of them fail silently when wrong.
func assessConfig(referenceText string) ([]byte, error) {
	return json.Marshal(map[string]interface{}{
		"ReferenceText": referenceText, "GradingSystem": "HundredMark",
		// Phoneme granularity is what makes the syllable grid and the correction
		// points possible; Word granularity returns neither. Prosody must be
		// asked for explicitly and is silently absent on unsupported locales —
		// that is why PronunciationResult carries ProsodyOK.
		"Granularity": "Phoneme", "Dimension": "Comprehensive",
		"EnableProsodyAssessment": true,
		// Without this Azure returns SAPI phonemes ("ih", "iy", "th"), not IPA
		// — SAPI is the documented default. ports.PhonemeResult, the fixtures
		// in azurespeech_test.go and content/phonemetips are all written
		// against IPA, and a mismatch produces no error at all: the phoneme
		// tips simply never match and the correction points stay empty.
		// IPA phoneme names are documented for en-US only; other locales fall
		// back to SAPI or to no phoneme name, which phonemetips.Lookup absorbs
		// by normalizing both alphabets.
		"PhonemeAlphabet": "IPA",
	})
}

// Assess scores audioWav (16kHz mono PCM WAV) against referenceText in the given locale (e.g. en-US).
func (c *Client) Assess(ctx context.Context, audioWav []byte, referenceText, locale string) (*ports.PronunciationResult, error) {
	if !c.Configured() {
		return nil, errors.New("azurespeech: key/region not configured")
	}
	cfg, err := assessConfig(referenceText)
	if err != nil {
		return nil, fmt.Errorf("azurespeech: build assessment config: %w", err)
	}
	url := fmt.Sprintf("https://%s.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=%s&format=detailed",
		c.region, locale)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(audioWav))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Ocp-Apim-Subscription-Key", c.key)
	req.Header.Set("Pronunciation-Assessment", base64.StdEncoding.EncodeToString(cfg))
	req.Header.Set("Content-Type", "audio/wav; codecs=audio/pcm; samplerate=16000")
	req.Header.Set("Accept", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("azurespeech: status %d: %s", resp.StatusCode, truncate(raw))
	}

	return parseAssessment(raw)
}

// Transcribe returns the recognized text for audioWav (16kHz mono PCM WAV) in the
// given locale — plain speech-to-text (no pronunciation-assessment header).
func (c *Client) Transcribe(ctx context.Context, audioWav []byte, locale string) (string, error) {
	if !c.Configured() {
		return "", errors.New("azurespeech: key/region not configured")
	}
	url := fmt.Sprintf("https://%s.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=%s&format=detailed",
		c.region, locale)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(audioWav))
	if err != nil {
		return "", err
	}
	req.Header.Set("Ocp-Apim-Subscription-Key", c.key)
	req.Header.Set("Content-Type", "audio/wav; codecs=audio/pcm; samplerate=16000")
	req.Header.Set("Accept", "application/json")

	resp, err := c.http.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("azurespeech: status %d: %s", resp.StatusCode, truncate(raw))
	}
	var ar assessResp
	if err := json.Unmarshal(raw, &ar); err != nil {
		return "", fmt.Errorf("azurespeech: bad response: %s", truncate(raw))
	}
	if ar.DisplayText != "" {
		return ar.DisplayText, nil
	}
	if len(ar.NBest) > 0 {
		return ar.NBest[0].Display, nil
	}
	return "", nil // no speech recognized
}

// Synthesize speaks `text` via Azure Text-to-Speech (same key/region as STT) and
// returns a WAV (RIFF 24kHz 16-bit mono PCM) — a format we can both play and
// analyze for a real waveform. voice/locale default to a clear US-English neural voice.
func (c *Client) Synthesize(ctx context.Context, text, voice, locale string) ([]byte, error) {
	if !c.Configured() {
		return nil, errors.New("azurespeech: key/region not configured")
	}
	if voice == "" {
		voice = "en-US-JennyNeural"
	}
	if locale == "" {
		locale = "en-US"
	}
	ssml := fmt.Sprintf(`<speak version="1.0" xml:lang="%s"><voice name="%s">%s</voice></speak>`, locale, voice, xmlEscape(text))
	url := fmt.Sprintf("https://%s.tts.speech.microsoft.com/cognitiveservices/v1", c.region)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader([]byte(ssml)))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Ocp-Apim-Subscription-Key", c.key)
	req.Header.Set("Content-Type", "application/ssml+xml")
	req.Header.Set("X-Microsoft-OutputFormat", "riff-24khz-16bit-mono-pcm")
	req.Header.Set("User-Agent", "forin")

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("azurespeech tts: status %d: %s", resp.StatusCode, truncate(body))
	}
	return body, nil
}

// xmlEscape escapes the five XML entities so arbitrary order text is SSML-safe.
func xmlEscape(s string) string {
	r := strings.NewReplacer("&", "&amp;", "<", "&lt;", ">", "&gt;", `"`, "&quot;", "'", "&apos;")
	return r.Replace(s)
}

func truncate(b []byte) string {
	if len(b) > 300 {
		return string(b[:300])
	}
	return string(b)
}
