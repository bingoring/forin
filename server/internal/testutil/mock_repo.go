package testutil

import (
	"context"

	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
)

// MockUserRepository is a hand-written mock implementing service.UserRepository.
type MockUserRepository struct {
	CreateFn            func(ctx context.Context, user *model.User) error
	FindByEmailFn       func(ctx context.Context, email string) (*model.User, error)
	FindByIDFn          func(ctx context.Context, id uuid.UUID) (*model.User, error)
	UpdateFn            func(ctx context.Context, user *model.User) error
	CreateOAuthProviderFn func(ctx context.Context, provider *model.UserOAuthProvider) error
	FindOAuthProviderFn func(ctx context.Context, provider, providerUID string) (*model.UserOAuthProvider, error)
}

func (m *MockUserRepository) Create(ctx context.Context, user *model.User) error {
	if m.CreateFn != nil {
		return m.CreateFn(ctx, user)
	}
	return nil
}

func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	if m.FindByEmailFn != nil {
		return m.FindByEmailFn(ctx, email)
	}
	return nil, nil
}

func (m *MockUserRepository) FindByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
	if m.FindByIDFn != nil {
		return m.FindByIDFn(ctx, id)
	}
	return nil, nil
}

func (m *MockUserRepository) Update(ctx context.Context, user *model.User) error {
	if m.UpdateFn != nil {
		return m.UpdateFn(ctx, user)
	}
	return nil
}

func (m *MockUserRepository) CreateOAuthProvider(ctx context.Context, provider *model.UserOAuthProvider) error {
	if m.CreateOAuthProviderFn != nil {
		return m.CreateOAuthProviderFn(ctx, provider)
	}
	return nil
}

func (m *MockUserRepository) FindOAuthProvider(ctx context.Context, provider, providerUID string) (*model.UserOAuthProvider, error) {
	if m.FindOAuthProviderFn != nil {
		return m.FindOAuthProviderFn(ctx, provider, providerUID)
	}
	return nil, nil
}
