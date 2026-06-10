// Package anthropic implements ports.LLMPort against the Anthropic Messages API.
// One adapter behind the port — swap it (OpenAI, etc.) without touching the domain.
package anthropic

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/bingoring/forin/server/internal/ports"
)

const (
	endpoint   = "https://api.anthropic.com/v1/messages"
	apiVersion = "2023-06-01"
)

// Client calls the Anthropic Messages API. Configured = a non-empty API key.
type Client struct {
	key  string
	http *http.Client
}

func New(apiKey string) *Client {
	return &Client{key: apiKey, http: &http.Client{Timeout: 60 * time.Second}}
}

// Configured reports whether an API key is present.
func (c *Client) Configured() bool { return c.key != "" }

type reqBody struct {
	Model     string       `json:"model"`
	MaxTokens int          `json:"max_tokens"`
	System    string       `json:"system,omitempty"`
	Stream    bool         `json:"stream,omitempty"`
	Msgs      []apiMessage `json:"messages"`
}

type apiMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type respBody struct {
	Content []struct {
		Type string `json:"type"`
		Text string `json:"text"`
	} `json:"content"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error"`
}

// Complete sends a completion request and returns the assistant text.
func (c *Client) Complete(ctx context.Context, r ports.LLMRequest) (string, error) {
	if c.key == "" {
		return "", errors.New("anthropic: API key not configured")
	}
	maxTok := r.MaxTokens
	if maxTok == 0 {
		maxTok = 1024
	}
	body, err := json.Marshal(reqBody{Model: r.Model, MaxTokens: maxTok, System: r.System, Msgs: toMsgs(r)})
	if err != nil {
		return "", err
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	httpReq.Header.Set("content-type", "application/json")
	httpReq.Header.Set("x-api-key", c.key)
	httpReq.Header.Set("anthropic-version", apiVersion)

	resp, err := c.http.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)

	var parsed respBody
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return "", fmt.Errorf("anthropic: bad response (%d): %s", resp.StatusCode, truncate(raw))
	}
	if resp.StatusCode != http.StatusOK {
		if parsed.Error != nil {
			return "", fmt.Errorf("anthropic: %s", parsed.Error.Message)
		}
		return "", fmt.Errorf("anthropic: status %d: %s", resp.StatusCode, truncate(raw))
	}
	var out string
	for _, b := range parsed.Content {
		if b.Type == "text" {
			out += b.Text
		}
	}
	return out, nil
}

// CompleteStream streams the Messages API response, invoking onDelta per text delta.
func (c *Client) CompleteStream(ctx context.Context, r ports.LLMRequest, onDelta func(string) error) (string, error) {
	if c.key == "" {
		return "", errors.New("anthropic: API key not configured")
	}
	maxTok := r.MaxTokens
	if maxTok == 0 {
		maxTok = 1024
	}
	body, err := json.Marshal(reqBody{Model: r.Model, MaxTokens: maxTok, System: r.System, Stream: true, Msgs: toMsgs(r)})
	if err != nil {
		return "", err
	}
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	httpReq.Header.Set("content-type", "application/json")
	httpReq.Header.Set("x-api-key", c.key)
	httpReq.Header.Set("anthropic-version", apiVersion)

	resp, err := c.http.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		raw, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("anthropic: status %d: %s", resp.StatusCode, truncate(raw))
	}

	var full strings.Builder
	sc := bufio.NewScanner(resp.Body)
	sc.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	for sc.Scan() {
		line := sc.Text()
		if !strings.HasPrefix(line, "data: ") {
			continue
		}
		var ev struct {
			Type  string `json:"type"`
			Delta struct {
				Text string `json:"text"`
			} `json:"delta"`
			Error *struct {
				Message string `json:"message"`
			} `json:"error"`
		}
		if json.Unmarshal([]byte(strings.TrimPrefix(line, "data: ")), &ev) != nil {
			continue
		}
		if ev.Error != nil {
			return full.String(), fmt.Errorf("anthropic: %s", ev.Error.Message)
		}
		if ev.Type == "content_block_delta" && ev.Delta.Text != "" {
			if err := onDelta(ev.Delta.Text); err != nil {
				return full.String(), err
			}
			full.WriteString(ev.Delta.Text)
		}
	}
	return full.String(), sc.Err()
}

func toMsgs(r ports.LLMRequest) []apiMessage {
	msgs := make([]apiMessage, len(r.Messages))
	for i, m := range r.Messages {
		msgs[i] = apiMessage{Role: m.Role, Content: m.Content}
	}
	return msgs
}

func truncate(b []byte) string {
	if len(b) > 300 {
		return string(b[:300])
	}
	return string(b)
}
