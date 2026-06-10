// Package openai implements ports.LLMPort against the OpenAI Chat Completions API.
// Same port as the anthropic adapter — selected by config, no domain changes.
package openai

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

const endpoint = "https://api.openai.com/v1/chat/completions"

// Client calls the OpenAI Chat Completions API. Configured = a non-empty API key.
type Client struct {
	key  string
	http *http.Client
}

func New(apiKey string) *Client {
	return &Client{key: apiKey, http: &http.Client{Timeout: 60 * time.Second}}
}

func (c *Client) Configured() bool { return c.key != "" }

type chatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type reqBody struct {
	Model     string        `json:"model"`
	MaxTokens int           `json:"max_tokens,omitempty"`
	Stream    bool          `json:"stream,omitempty"`
	Messages  []chatMessage `json:"messages"`
}

type respBody struct {
	Choices []struct {
		Message chatMessage `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error"`
}

// Complete maps the request to OpenAI's chat format: the system prompt is the
// first "system" message, followed by the conversation history.
func (c *Client) Complete(ctx context.Context, r ports.LLMRequest) (string, error) {
	if c.key == "" {
		return "", errors.New("openai: API key not configured")
	}
	body, err := json.Marshal(reqBody{Model: r.Model, MaxTokens: r.MaxTokens, Messages: toChat(r)})
	if err != nil {
		return "", err
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	httpReq.Header.Set("content-type", "application/json")
	httpReq.Header.Set("authorization", "Bearer "+c.key)

	resp, err := c.http.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)

	var parsed respBody
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return "", fmt.Errorf("openai: bad response (%d): %s", resp.StatusCode, truncate(raw))
	}
	if resp.StatusCode != http.StatusOK {
		if parsed.Error != nil {
			return "", fmt.Errorf("openai: %s", parsed.Error.Message)
		}
		return "", fmt.Errorf("openai: status %d: %s", resp.StatusCode, truncate(raw))
	}
	if len(parsed.Choices) == 0 {
		return "", errors.New("openai: empty response")
	}
	return parsed.Choices[0].Message.Content, nil
}

// CompleteStream streams the chat completion, invoking onDelta per token chunk.
func (c *Client) CompleteStream(ctx context.Context, r ports.LLMRequest, onDelta func(string) error) (string, error) {
	if c.key == "" {
		return "", errors.New("openai: API key not configured")
	}
	body, err := json.Marshal(reqBody{Model: r.Model, MaxTokens: r.MaxTokens, Stream: true, Messages: toChat(r)})
	if err != nil {
		return "", err
	}
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	httpReq.Header.Set("content-type", "application/json")
	httpReq.Header.Set("authorization", "Bearer "+c.key)

	resp, err := c.http.Do(httpReq)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		raw, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("openai: status %d: %s", resp.StatusCode, truncate(raw))
	}

	var full strings.Builder
	sc := bufio.NewScanner(resp.Body)
	sc.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	for sc.Scan() {
		line := sc.Text()
		if !strings.HasPrefix(line, "data: ") {
			continue
		}
		data := strings.TrimPrefix(line, "data: ")
		if data == "[DONE]" {
			break
		}
		var ev struct {
			Choices []struct {
				Delta struct {
					Content string `json:"content"`
				} `json:"delta"`
			} `json:"choices"`
		}
		if json.Unmarshal([]byte(data), &ev) != nil {
			continue
		}
		for _, ch := range ev.Choices {
			if ch.Delta.Content == "" {
				continue
			}
			if err := onDelta(ch.Delta.Content); err != nil {
				return full.String(), err
			}
			full.WriteString(ch.Delta.Content)
		}
	}
	return full.String(), sc.Err()
}

func toChat(r ports.LLMRequest) []chatMessage {
	msgs := make([]chatMessage, 0, len(r.Messages)+1)
	if r.System != "" {
		msgs = append(msgs, chatMessage{Role: "system", Content: r.System})
	}
	for _, m := range r.Messages {
		msgs = append(msgs, chatMessage{Role: m.Role, Content: m.Content})
	}
	return msgs
}

func truncate(b []byte) string {
	if len(b) > 300 {
		return string(b[:300])
	}
	return string(b)
}
