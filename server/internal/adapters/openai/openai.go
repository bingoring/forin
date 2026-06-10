// Package openai implements ports.LLMPort against the OpenAI Chat Completions API.
// Same port as the anthropic adapter — selected by config, no domain changes.
package openai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
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
	msgs := make([]chatMessage, 0, len(r.Messages)+1)
	if r.System != "" {
		msgs = append(msgs, chatMessage{Role: "system", Content: r.System})
	}
	for _, m := range r.Messages {
		msgs = append(msgs, chatMessage{Role: m.Role, Content: m.Content})
	}
	body, err := json.Marshal(reqBody{Model: r.Model, MaxTokens: r.MaxTokens, Messages: msgs})
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

func truncate(b []byte) string {
	if len(b) > 300 {
		return string(b[:300])
	}
	return string(b)
}
