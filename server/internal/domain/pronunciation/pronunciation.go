// Package pronunciation orchestrates speech pronunciation assessment: it derives
// the target locale from the user's profile and delegates scoring to the port.
package pronunciation

import (
	"context"

	"github.com/bingoring/forin/server/internal/ports"
)

type Service struct {
	pron     ports.PronunciationPort
	profiles ports.ProfileReader
}

func NewService(pron ports.PronunciationPort, profiles ports.ProfileReader) *Service {
	return &Service{pron: pron, profiles: profiles}
}

// Assess scores the audio against referenceText, using the user's target language locale.
func (s *Service) Assess(ctx context.Context, userID string, audioWav []byte, referenceText string) (*ports.PronunciationResult, error) {
	locale := "en-US"
	if p, err := s.profiles.GetProfile(ctx, userID); err == nil && p != nil && p.TargetLang != "" {
		locale = localeFor(p.TargetLang)
	}
	return s.pron.Assess(ctx, audioWav, referenceText, locale)
}

// localeFor maps a target language code to a BCP-47 locale Azure expects.
func localeFor(lang string) string {
	switch lang {
	case "en":
		return "en-US"
	case "de":
		return "de-DE"
	case "ja":
		return "ja-JP"
	case "ko":
		return "ko-KR"
	case "zh":
		return "zh-CN"
	case "es":
		return "es-ES"
	case "fr":
		return "fr-FR"
	default:
		return "en-US"
	}
}
