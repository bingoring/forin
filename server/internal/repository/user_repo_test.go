package repository

import (
	"context"
	"testing"

	"github.com/forin/server/internal/model"
	"github.com/forin/server/internal/testutil"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// Integration tests — require a running PostgreSQL instance.
// Skipped automatically if DATABASE_DSN is not set.
// Each test runs in a transaction that is rolled back after completion.

func setupRepo(t *testing.T) (*UserRepository, *gorm.DB) {
	t.Helper()
	db := testutil.NewTestDB(t)
	tx := testutil.TxDB(t, db)
	return NewUserRepository(tx), tx
}

func TestCreate_Success(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	hash := "hashed-password"
	user := &model.User{
		Email:        "create-test@example.com",
		PasswordHash: &hash,
		DisplayName:  "Create Test",
	}

	err := repo.Create(ctx, user)
	require.NoError(t, err)
	assert.NotEqual(t, uuid.Nil, user.ID)
}

func TestCreate_DuplicateEmail(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	hash := "hashed-password"
	user1 := &model.User{
		Email:        "dup@example.com",
		PasswordHash: &hash,
		DisplayName:  "User 1",
	}
	require.NoError(t, repo.Create(ctx, user1))

	user2 := &model.User{
		Email:        "dup@example.com",
		PasswordHash: &hash,
		DisplayName:  "User 2",
	}
	err := repo.Create(ctx, user2)
	assert.Error(t, err)
}

func TestFindByEmail_Found(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	hash := "hashed-password"
	user := &model.User{
		Email:        "findbyemail@example.com",
		PasswordHash: &hash,
		DisplayName:  "Find Me",
	}
	require.NoError(t, repo.Create(ctx, user))

	found, err := repo.FindByEmail(ctx, "findbyemail@example.com")
	require.NoError(t, err)
	assert.Equal(t, "Find Me", found.DisplayName)
	assert.Equal(t, user.ID, found.ID)
}

func TestFindByEmail_NotFound(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	_, err := repo.FindByEmail(ctx, "nonexistent@example.com")
	assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
}

func TestFindByID_Found(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	hash := "hashed-password"
	user := &model.User{
		Email:        "findbyid@example.com",
		PasswordHash: &hash,
		DisplayName:  "Find By ID",
	}
	require.NoError(t, repo.Create(ctx, user))

	found, err := repo.FindByID(ctx, user.ID)
	require.NoError(t, err)
	assert.Equal(t, "Find By ID", found.DisplayName)
}

func TestFindByID_NotFound(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	_, err := repo.FindByID(ctx, uuid.New())
	assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
}

func TestUpdate_Success(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	hash := "hashed-password"
	user := &model.User{
		Email:        "update-test@example.com",
		PasswordHash: &hash,
		DisplayName:  "Before Update",
	}
	require.NoError(t, repo.Create(ctx, user))

	user.DisplayName = "After Update"
	require.NoError(t, repo.Update(ctx, user))

	found, err := repo.FindByID(ctx, user.ID)
	require.NoError(t, err)
	assert.Equal(t, "After Update", found.DisplayName)
}

func TestCreateOAuthProvider_Success(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	hash := "hashed-password"
	user := &model.User{
		Email:        "oauth-test@example.com",
		PasswordHash: &hash,
		DisplayName:  "OAuth User",
	}
	require.NoError(t, repo.Create(ctx, user))

	provider := &model.UserOAuthProvider{
		UserID:      user.ID,
		Provider:    "google",
		ProviderUID: "google-uid-123",
	}
	err := repo.CreateOAuthProvider(ctx, provider)
	require.NoError(t, err)
	assert.NotEqual(t, uuid.Nil, provider.ID)
}

func TestFindOAuthProvider_Found(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	hash := "hashed-password"
	user := &model.User{
		Email:        "oauth-find@example.com",
		PasswordHash: &hash,
		DisplayName:  "OAuth Find",
	}
	require.NoError(t, repo.Create(ctx, user))

	provider := &model.UserOAuthProvider{
		UserID:      user.ID,
		Provider:    "google",
		ProviderUID: "google-uid-456",
	}
	require.NoError(t, repo.CreateOAuthProvider(ctx, provider))

	found, err := repo.FindOAuthProvider(ctx, "google", "google-uid-456")
	require.NoError(t, err)
	assert.Equal(t, user.ID, found.UserID)
}

func TestFindOAuthProvider_NotFound(t *testing.T) {
	repo, _ := setupRepo(t)
	ctx := context.Background()

	_, err := repo.FindOAuthProvider(ctx, "google", "nonexistent-uid")
	assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
}
