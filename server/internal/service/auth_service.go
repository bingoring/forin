package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/dto"
	"github.com/forin/server/internal/model"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrEmailAlreadyExists  = errors.New("email already registered")
	ErrInvalidCredentials  = errors.New("invalid email or password")
	ErrInvalidToken        = errors.New("invalid or expired token")
)

type AuthService struct {
	userRepo UserRepository
	cfg      *config.Config
}

func NewAuthService(userRepo UserRepository, cfg *config.Config) *AuthService {
	return &AuthService{userRepo: userRepo, cfg: cfg}
}

func (s *AuthService) Register(ctx context.Context, req dto.RegisterRequest) (*dto.AuthResponse, error) {
	existing, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fmt.Errorf("db lookup: %w", err)
	}
	if existing != nil {
		return nil, ErrEmailAlreadyExists
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), 12)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}
	hashStr := string(hash)

	user := &model.User{
		Email:        req.Email,
		PasswordHash: &hashStr,
		DisplayName:  req.DisplayName,
	}
	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}

	return s.buildAuthResponse(user)
}

func (s *AuthService) Login(ctx context.Context, req dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, fmt.Errorf("db lookup: %w", err)
	}

	if user.PasswordHash == nil {
		return nil, ErrInvalidCredentials
	}
	if err := bcrypt.CompareHashAndPassword([]byte(*user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return s.buildAuthResponse(user)
}

func (s *AuthService) RefreshToken(ctx context.Context, refreshToken string) (*dto.AuthResponse, error) {
	claims, err := s.parseToken(refreshToken, s.cfg.JWTRefreshSecret)
	if err != nil {
		return nil, ErrInvalidToken
	}

	userID, err := uuid.Parse(claims.Subject)
	if err != nil {
		return nil, ErrInvalidToken
	}

	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, ErrInvalidToken
	}

	return s.buildAuthResponse(user)
}

func (s *AuthService) ValidateAccessToken(tokenStr string) (uuid.UUID, error) {
	claims, err := s.parseToken(tokenStr, s.cfg.JWTSecret)
	if err != nil {
		return uuid.Nil, ErrInvalidToken
	}
	return uuid.Parse(claims.Subject)
}

// --- internal helpers ---

func (s *AuthService) buildAuthResponse(user *model.User) (*dto.AuthResponse, error) {
	accessToken, err := s.generateToken(user.ID.String(), s.cfg.JWTSecret, s.cfg.JWTAccessExpiry)
	if err != nil {
		return nil, fmt.Errorf("generate access token: %w", err)
	}
	refreshToken, err := s.generateToken(user.ID.String(), s.cfg.JWTRefreshSecret, s.cfg.JWTRefreshExpiry)
	if err != nil {
		return nil, fmt.Errorf("generate refresh token: %w", err)
	}

	return &dto.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int(s.cfg.JWTAccessExpiry.Seconds()),
		User: dto.UserInfo{
			ID:           user.ID,
			Email:        user.Email,
			DisplayName:  user.DisplayName,
			CurrentLevel: user.CurrentLevel,
			CurrentXP:    user.CurrentXP,
		},
	}, nil
}

func (s *AuthService) generateToken(subject, secret string, expiry time.Duration) (string, error) {
	now := time.Now()
	claims := jwt.RegisteredClaims{
		Subject:   subject,
		IssuedAt:  jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(expiry)),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(secret))
}

func (s *AuthService) parseToken(tokenStr, secret string) (*jwt.RegisteredClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &jwt.RegisteredClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}
	claims, ok := token.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return nil, ErrInvalidToken
	}
	return claims, nil
}
