// Package conversation holds the dialogue engine + response-generation strategies.
// The Strategy interface is the cost/quality lever: swap SingleModel for a cheap
// ensemble or a router without touching the engine or the LLM adapter.
package conversation

import (
	"context"

	"github.com/bingoring/forin/server/internal/ports"
)

// Strategy turns a system prompt + message history into a reply.
type Strategy interface {
	Generate(ctx context.Context, system string, msgs []ports.LLMMessage) (string, error)
}

// SingleModel makes one LLM call with the configured model (default dialogue strategy).
type SingleModel struct {
	LLM       ports.LLMPort
	Model     string
	MaxTokens int
}

func (s SingleModel) Generate(ctx context.Context, system string, msgs []ports.LLMMessage) (string, error) {
	return s.LLM.Complete(ctx, ports.LLMRequest{
		Model: s.Model, System: system, Messages: msgs, MaxTokens: s.MaxTokens,
	})
}
