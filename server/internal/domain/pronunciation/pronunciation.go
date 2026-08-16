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
	return s.pron.Assess(ctx, audioWav, referenceText, s.LocaleFor(ctx, userID))
}

// Transcribe converts spoken audio to text (dictation) in the user's target locale.
func (s *Service) Transcribe(ctx context.Context, userID string, audioWav []byte) (string, error) {
	return s.pron.Transcribe(ctx, audioWav, s.LocaleFor(ctx, userID))
}

// LocaleFor resolves a user's BCP-47 target-language locale without performing
// an assessment. It exists because SentenceKey (domain/speech) needs the same
// locale Assess would use, and reference derivation (Task 4) needs it before
// any audio exists at all — neither can go through Assess to get it. Keeping
// this as a pure lookup, rather than having Assess return the locale it used,
// keeps PronunciationResult a faithful mirror of Azure's response shape (see
// ports.PronunciationResult) instead of mixing in a locale the adapter never
// produced.
func (s *Service) LocaleFor(ctx context.Context, userID string) string {
	locale := "en-US"
	if p, err := s.profiles.GetProfile(ctx, userID); err == nil && p != nil && p.TargetLang != "" {
		locale = localeFor(p.TargetLang)
	}
	return locale
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
