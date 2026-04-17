package apperror

import (
	"errors"
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAppError_Error(t *testing.T) {
	err := NewBadRequest("test message")
	assert.Equal(t, "test message", err.Error())
}

func TestAppError_Unwrap(t *testing.T) {
	cause := errors.New("root cause")
	err := Wrap(cause, NewInternal("wrapped"))
	assert.ErrorIs(t, err, cause)
}

func TestConstructors(t *testing.T) {
	tests := []struct {
		name       string
		err        *AppError
		wantCode   string
		wantStatus int
	}{
		{"BadRequest", NewBadRequest("bad"), "VALIDATION_ERROR", http.StatusUnprocessableEntity},
		{"Unauthorized", NewUnauthorized("unauth"), "UNAUTHORIZED", http.StatusUnauthorized},
		{"Forbidden", NewForbidden("forbidden"), "FORBIDDEN", http.StatusForbidden},
		{"NotFound", NewNotFound("not found"), "NOT_FOUND", http.StatusNotFound},
		{"RateLimited", NewRateLimited("slow down"), "RATE_LIMITED", http.StatusTooManyRequests},
		{"Internal", NewInternal("oops"), "INTERNAL_ERROR", http.StatusInternalServerError},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.wantCode, tt.err.Code)
			assert.Equal(t, tt.wantStatus, tt.err.HTTPStatus)
		})
	}
}

func TestFromServiceError_Nil(t *testing.T) {
	assert.Nil(t, FromServiceError(nil))
}

func TestFromServiceError_KnownErrors(t *testing.T) {
	tests := []struct {
		name       string
		err        error
		wantCode   string
		wantStatus int
	}{
		{
			"email already exists",
			errors.New("email already registered"),
			"VALIDATION_ERROR",
			http.StatusUnprocessableEntity,
		},
		{
			"invalid credentials",
			errors.New("invalid email or password"),
			"UNAUTHORIZED",
			http.StatusUnauthorized,
		},
		{
			"invalid token",
			errors.New("invalid or expired token"),
			"UNAUTHORIZED",
			http.StatusUnauthorized,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			appErr := FromServiceError(tt.err)
			assert.Equal(t, tt.wantCode, appErr.Code)
			assert.Equal(t, tt.wantStatus, appErr.HTTPStatus)
			assert.ErrorIs(t, appErr, tt.err)
		})
	}
}

func TestFromServiceError_UnknownError(t *testing.T) {
	err := errors.New("something unexpected")
	appErr := FromServiceError(err)
	assert.Equal(t, "INTERNAL_ERROR", appErr.Code)
	assert.Equal(t, http.StatusInternalServerError, appErr.HTTPStatus)
}

func TestFromServiceError_AlreadyAppError(t *testing.T) {
	original := NewForbidden("no access")
	result := FromServiceError(original)
	assert.Equal(t, "FORBIDDEN", result.Code)
	assert.Equal(t, http.StatusForbidden, result.HTTPStatus)
}
