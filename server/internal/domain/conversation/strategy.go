// Package conversation holds the dialogue engine + response-generation strategies.
// The Strategy interface is the cost/quality lever: swap SingleModel for a cheap
// ensemble or a router without touching the engine or the LLM adapter.
package conversation

import (
	"context"

	"github.com/bingoring/forin/server/internal/ports"
)

// Strategy turns a system prompt + message history into a reply (full or streamed).
type Strategy interface {
	Generate(ctx context.Context, system string, msgs []ports.LLMMessage) (string, error)
	GenerateStream(ctx context.Context, system string, msgs []ports.LLMMessage, onDelta func(string) error) (string, error)
}

// SingleModel makes one LLM call with the configured model (default dialogue strategy).
type SingleModel struct {
	LLM       ports.LLMPort
	Model     string
	MaxTokens int
}

func (s SingleModel) req(system string, msgs []ports.LLMMessage) ports.LLMRequest {
	return ports.LLMRequest{Model: s.Model, System: system, Messages: msgs, MaxTokens: s.MaxTokens}
}

func (s SingleModel) Generate(ctx context.Context, system string, msgs []ports.LLMMessage) (string, error) {
	return s.LLM.Complete(ctx, s.req(system, msgs))
}

func (s SingleModel) GenerateStream(ctx context.Context, system string, msgs []ports.LLMMessage, onDelta func(string) error) (string, error) {
	return s.LLM.CompleteStream(ctx, s.req(system, msgs), onDelta)
}
