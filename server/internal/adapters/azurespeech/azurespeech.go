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
type azureResp struct {
	RecognitionStatus string `json:"RecognitionStatus"`
	DisplayText       string `json:"DisplayText"`
	NBest             []struct {
		Display           string  `json:"Display"`
		AccuracyScore     float64 `json:"AccuracyScore"`
		FluencyScore      float64 `json:"FluencyScore"`
		CompletenessScore float64 `json:"CompletenessScore"`
		PronScore         float64 `json:"PronScore"`
		Words             []struct {
			Word          string  `json:"Word"`
			AccuracyScore float64 `json:"AccuracyScore"`
			ErrorType     string  `json:"ErrorType"`
		} `json:"Words"`
	} `json:"NBest"`
}

// Assess scores audioWav (16kHz mono PCM WAV) against referenceText in the given locale (e.g. en-US).
func (c *Client) Assess(ctx context.Context, audioWav []byte, referenceText, locale string) (*ports.PronunciationResult, error) {
	if !c.Configured() {
		return nil, errors.New("azurespeech: key/region not configured")
	}
	cfg, _ := json.Marshal(map[string]string{
		"ReferenceText": referenceText, "GradingSystem": "HundredMark",
		"Granularity": "Word", "Dimension": "Comprehensive",
	})
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

	var ar azureResp
	if err := json.Unmarshal(raw, &ar); err != nil {
		return nil, fmt.Errorf("azurespeech: bad response: %s", truncate(raw))
	}
	res := &ports.PronunciationResult{Recognized: ar.DisplayText}
	if len(ar.NBest) == 0 {
		// No speech recognized (status e.g. InitialSilenceTimeout) — return zeros.
		return res, nil
	}
	b := ar.NBest[0]
	res.Accuracy, res.Fluency = b.AccuracyScore, b.FluencyScore
	res.Completeness, res.Overall = b.CompletenessScore, b.PronScore
	if res.Recognized == "" {
		res.Recognized = b.Display
	}
	for _, w := range b.Words {
		res.Words = append(res.Words, ports.WordScore{
			Word: w.Word, Accuracy: w.AccuracyScore, ErrorType: w.ErrorType})
	}
	return res, nil
}

func truncate(b []byte) string {
	if len(b) > 300 {
		return string(b[:300])
	}
	return string(b)
}
