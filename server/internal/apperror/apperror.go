package apperror

import (
	"errors"
	"net/http"
)

// AppError is the unified error type used across all layers.
type AppError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	HTTPStatus int    `json:"-"`
	Err        error  `json:"-"`
}

func (e *AppError) Error() string {
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// --- constructors ---

func NewBadRequest(message string) *AppError {
	return &AppError{Code: "VALIDATION_ERROR", Message: message, HTTPStatus: http.StatusUnprocessableEntity}
}

func NewUnauthorized(message string) *AppError {
	return &AppError{Code: "UNAUTHORIZED", Message: message, HTTPStatus: http.StatusUnauthorized}
}

func NewForbidden(message string) *AppError {
	return &AppError{Code: "FORBIDDEN", Message: message, HTTPStatus: http.StatusForbidden}
}

func NewNotFound(message string) *AppError {
	return &AppError{Code: "NOT_FOUND", Message: message, HTTPStatus: http.StatusNotFound}
}

func NewRateLimited(message string) *AppError {
	return &AppError{Code: "RATE_LIMITED", Message: message, HTTPStatus: http.StatusTooManyRequests}
}

func NewInternal(message string) *AppError {
	return &AppError{Code: "INTERNAL_ERROR", Message: message, HTTPStatus: http.StatusInternalServerError}
}

// Wrap attaches an underlying error to an AppError.
func Wrap(err error, appErr *AppError) *AppError {
	return &AppError{
		Code:       appErr.Code,
		Message:    appErr.Message,
		HTTPStatus: appErr.HTTPStatus,
		Err:        err,
	}
}

// sentinel error messages from the service layer — matched by string to avoid import cycles.
var errorMapping = map[string]*AppError{
	// Auth
	"email already registered":                    NewBadRequest("Email is already registered"),
	"invalid email or password":                   NewUnauthorized("Invalid email or password"),
	"invalid or expired token":                    NewUnauthorized("Invalid or expired token"),
	// User
	"user not found":                              NewNotFound("User not found"),
	"unsupported native_language":                 NewBadRequest("Unsupported native language"),
	// Curriculum
	"stage not found":                             NewNotFound("Stage not found"),
	// Learning
	"no lives remaining":                          {Code: "NO_LIVES", Message: "No lives remaining. Wait for refill or use gems.", HTTPStatus: http.StatusForbidden},
	"attempt not found":                           NewNotFound("Attempt not found"),
	"attempt does not belong to user":             NewForbidden("Attempt does not belong to you"),
	"attempt already completed":                   NewBadRequest("Attempt already completed"),
	"exercise not found":                          NewNotFound("Exercise not found"),
	"exercise does not belong to this stage":      NewBadRequest("Exercise does not belong to this stage"),
	"exercise already submitted for this attempt": NewBadRequest("Exercise already submitted"),
	// Onboarding
	"profession not found":                        NewNotFound("Profession not found"),
	// Gamification
	"gift box not found":                          NewNotFound("Gift box not found"),
	"gift box does not belong to user":            NewForbidden("Gift box does not belong to you"),
	"gift box already opened":                     NewBadRequest("Gift box already opened"),
	"item not found":                              NewNotFound("Item not found"),
	"item not available in shop":                  NewBadRequest("Item is not available in the shop"),
	"insufficient catnip":                         {Code: "INSUFFICIENT_CATNIP", Message: "Not enough Catnip", HTTPStatus: http.StatusUnprocessableEntity},
	"item already owned":                          NewBadRequest("Item already owned"),
	"item not owned":                              NewBadRequest("Item not owned"),
}

// FromServiceError converts known service-layer sentinel errors to AppError.
func FromServiceError(err error) *AppError {
	if err == nil {
		return nil
	}

	if mapped, ok := errorMapping[err.Error()]; ok {
		return Wrap(err, mapped)
	}

	switch {
	default:
		// check if it's already an AppError
		var appErr *AppError
		if errors.As(err, &appErr) {
			return appErr
		}
		return Wrap(err, NewInternal("An unexpected error occurred"))
	}
}
