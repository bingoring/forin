package testutil

import (
	"context"

	"github.com/forin/server/internal/dto"
	"github.com/google/uuid"
)

// MockAuthService is a hand-written mock implementing handler.AuthService.
type MockAuthService struct {
	RegisterFn           func(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error)
	LoginFn              func(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error)
	RefreshTokenFn       func(ctx context.Context, refreshToken string) (*dto.AuthResponse, error)
	ValidateAccessTokenFn func(tokenStr string) (uuid.UUID, error)
}

func (m *MockAuthService) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	if m.RegisterFn != nil {
		return m.RegisterFn(ctx, req)
	}
	return nil, nil
}

func (m *MockAuthService) Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
	if m.LoginFn != nil {
		return m.LoginFn(ctx, req)
	}
	return nil, nil
}

func (m *MockAuthService) RefreshToken(ctx context.Context, refreshToken string) (*dto.AuthResponse, error) {
	if m.RefreshTokenFn != nil {
		return m.RefreshTokenFn(ctx, refreshToken)
	}
	return nil, nil
}

func (m *MockAuthService) ValidateAccessToken(tokenStr string) (uuid.UUID, error) {
	if m.ValidateAccessTokenFn != nil {
		return m.ValidateAccessTokenFn(tokenStr)
	}
	return uuid.Nil, nil
}
