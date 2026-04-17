package service

import (
	"context"
	"testing"
	"time"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/model"
	"github.com/forin/server/internal/testutil"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func testConfig() *config.Config {
	return &config.Config{
		JWTSecret:        "test-jwt-secret-that-is-at-least-32-characters-long",
		JWTRefreshSecret: "test-jwt-refresh-secret-at-least-32-characters-long",
		JWTAccessExpiry:  15 * time.Minute,
		JWTRefreshExpiry: 168 * time.Hour,
	}
}

// --- Register ---

func TestRegister_Success(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return nil, gorm.ErrRecordNotFound
		},
		CreateFn: func(ctx context.Context, user *model.User) error {
			user.ID = uuid.New()
			return nil
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Register(context.Background(), dto.RegisterRequest{
		Email:       "test@example.com",
		Password:    "password123",
		DisplayName: "Test User",
	})

	require.NoError(t, err)
	assert.NotEmpty(t, resp.AccessToken)
	assert.NotEmpty(t, resp.RefreshToken)
	assert.Equal(t, 900, resp.ExpiresIn) // 15 minutes
	assert.Equal(t, "test@example.com", resp.User.Email)
	assert.Equal(t, "Test User", resp.User.DisplayName)
}

func TestRegister_EmailAlreadyExists(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return &model.User{Email: email}, nil
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Register(context.Background(), dto.RegisterRequest{
		Email:       "existing@example.com",
		Password:    "password123",
		DisplayName: "Test",
	})

	assert.Nil(t, resp)
	assert.ErrorIs(t, err, ErrEmailAlreadyExists)
}

func TestRegister_DBError(t *testing.T) {
	dbErr := assert.AnError
	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return nil, dbErr
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Register(context.Background(), dto.RegisterRequest{
		Email:       "test@example.com",
		Password:    "password123",
		DisplayName: "Test",
	})

	assert.Nil(t, resp)
	assert.Error(t, err)
	assert.ErrorIs(t, err, dbErr)
}

// --- Login ---

func TestLogin_Success(t *testing.T) {
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), 12)
	hashStr := string(hash)

	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return &model.User{
				ID:           uuid.New(),
				Email:        email,
				PasswordHash: &hashStr,
				DisplayName:  "Test User",
				CurrentLevel: 1,
			}, nil
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Login(context.Background(), dto.LoginRequest{
		Email:    "test@example.com",
		Password: "password123",
	})

	require.NoError(t, err)
	assert.NotEmpty(t, resp.AccessToken)
	assert.NotEmpty(t, resp.RefreshToken)
	assert.Equal(t, "test@example.com", resp.User.Email)
}

func TestLogin_UserNotFound(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return nil, gorm.ErrRecordNotFound
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Login(context.Background(), dto.LoginRequest{
		Email:    "nonexistent@example.com",
		Password: "password123",
	})

	assert.Nil(t, resp)
	assert.ErrorIs(t, err, ErrInvalidCredentials)
}

func TestLogin_WrongPassword(t *testing.T) {
	hash, _ := bcrypt.GenerateFromPassword([]byte("correct-password"), 12)
	hashStr := string(hash)

	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return &model.User{
				ID:           uuid.New(),
				Email:        email,
				PasswordHash: &hashStr,
			}, nil
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Login(context.Background(), dto.LoginRequest{
		Email:    "test@example.com",
		Password: "wrong-password",
	})

	assert.Nil(t, resp)
	assert.ErrorIs(t, err, ErrInvalidCredentials)
}

func TestLogin_OAuthUserNoPassword(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{
		FindByEmailFn: func(ctx context.Context, email string) (*model.User, error) {
			return &model.User{
				ID:           uuid.New(),
				Email:        email,
				PasswordHash: nil, // OAuth user
			}, nil
		},
	}

	svc := NewAuthService(mockRepo, testConfig())
	resp, err := svc.Login(context.Background(), dto.LoginRequest{
		Email:    "oauth@example.com",
		Password: "any-password",
	})

	assert.Nil(t, resp)
	assert.ErrorIs(t, err, ErrInvalidCredentials)
}

// --- RefreshToken ---

func TestRefreshToken_Success(t *testing.T) {
	userID := uuid.New()

	mockRepo := &testutil.MockUserRepository{
		FindByIDFn: func(ctx context.Context, id uuid.UUID) (*model.User, error) {
			return &model.User{
				ID:          userID,
				Email:       "test@example.com",
				DisplayName: "Test User",
			}, nil
		},
	}

	cfg := testConfig()
	svc := NewAuthService(mockRepo, cfg)

	// Generate a valid refresh token first
	refreshToken, err := svc.generateToken(userID.String(), cfg.JWTRefreshSecret, cfg.JWTRefreshExpiry)
	require.NoError(t, err)

	resp, err := svc.RefreshToken(context.Background(), refreshToken)

	require.NoError(t, err)
	assert.NotEmpty(t, resp.AccessToken)
	assert.NotEmpty(t, resp.RefreshToken)
}

func TestRefreshToken_InvalidToken(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{}
	svc := NewAuthService(mockRepo, testConfig())

	resp, err := svc.RefreshToken(context.Background(), "invalid-token")

	assert.Nil(t, resp)
	assert.ErrorIs(t, err, ErrInvalidToken)
}

// --- ValidateAccessToken ---

func TestValidateAccessToken_Success(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{}
	cfg := testConfig()
	svc := NewAuthService(mockRepo, cfg)

	userID := uuid.New()
	token, err := svc.generateToken(userID.String(), cfg.JWTSecret, cfg.JWTAccessExpiry)
	require.NoError(t, err)

	parsedID, err := svc.ValidateAccessToken(token)
	require.NoError(t, err)
	assert.Equal(t, userID, parsedID)
}

func TestValidateAccessToken_ExpiredToken(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{}
	cfg := testConfig()
	svc := NewAuthService(mockRepo, cfg)

	// Generate token that's already expired
	token, err := svc.generateToken(uuid.New().String(), cfg.JWTSecret, -1*time.Hour)
	require.NoError(t, err)

	_, err = svc.ValidateAccessToken(token)
	assert.ErrorIs(t, err, ErrInvalidToken)
}

func TestValidateAccessToken_WrongSecret(t *testing.T) {
	mockRepo := &testutil.MockUserRepository{}
	cfg := testConfig()
	svc := NewAuthService(mockRepo, cfg)

	// Generate token with refresh secret, validate with access secret
	token, err := svc.generateToken(uuid.New().String(), cfg.JWTRefreshSecret, cfg.JWTAccessExpiry)
	require.NoError(t, err)

	_, err = svc.ValidateAccessToken(token)
	assert.ErrorIs(t, err, ErrInvalidToken)
}
