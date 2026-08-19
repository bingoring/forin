package i18n

import "context"

type ctxKey struct{}

// WithLocale stores the resolved locale on the request context.
func WithLocale(ctx context.Context, locale string) context.Context {
	return context.WithValue(ctx, ctxKey{}, locale)
}

// FromContext returns the request's locale, or BaseLocale when none was set —
// so a handler that forgets the middleware still renders authored Korean rather
// than an empty string.
func FromContext(ctx context.Context) string {
	if v, ok := ctx.Value(ctxKey{}).(string); ok && v != "" {
		return v
	}
	return BaseLocale
}
