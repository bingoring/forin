package handler

import (
	"errors"
	"fmt"

	"github.com/forin/server/internal/apperror"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type successBody struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
}

type errorBody struct {
	Success bool            `json:"success"`
	Error   errorDetailBody `json:"error"`
}

type errorDetailBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

var errUnauthorized = apperror.NewUnauthorized("Authentication required")

// JSON writes a success response in the standard format.
func JSON(c *gin.Context, status int, data interface{}) {
	c.JSON(status, successBody{Success: true, Data: data})
}

// Error writes an error response in the standard format.
// If err is an *apperror.AppError, its code and status are used; otherwise 500.
func Error(c *gin.Context, err error) {
	appErr := apperror.FromServiceError(err)
	c.AbortWithStatusJSON(appErr.HTTPStatus, errorBody{
		Success: false,
		Error: errorDetailBody{
			Code:    appErr.Code,
			Message: appErr.Message,
		},
	})
}

// HandleBindError converts Gin validator errors into the standard error format.
func HandleBindError(c *gin.Context, err error) {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		messages := make([]string, 0, len(ve))
		for _, fe := range ve {
			messages = append(messages, fieldErrorMessage(fe))
		}
		appErr := apperror.NewBadRequest(fmt.Sprintf("Validation failed: %v", messages))
		c.AbortWithStatusJSON(appErr.HTTPStatus, errorBody{
			Success: false,
			Error: errorDetailBody{
				Code:    appErr.Code,
				Message: appErr.Message,
			},
		})
		return
	}

	appErr := apperror.NewBadRequest("Invalid request body")
	c.AbortWithStatusJSON(appErr.HTTPStatus, errorBody{
		Success: false,
		Error: errorDetailBody{
			Code:    appErr.Code,
			Message: appErr.Message,
		},
	})
}

func fieldErrorMessage(fe validator.FieldError) string {
	field := fe.Field()
	switch fe.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "email":
		return fmt.Sprintf("%s must be a valid email address", field)
	case "min":
		return fmt.Sprintf("%s must be at least %s characters", field, fe.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s characters", field, fe.Param())
	default:
		return fmt.Sprintf("%s is invalid", field)
	}
}
