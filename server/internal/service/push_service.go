package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/model"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

const expoPushURL = "https://exp.host/--/api/v2/push/send"

type expoPushMessage struct {
	To    string `json:"to"`
	Title string `json:"title"`
	Body  string `json:"body"`
	Data  map[string]string `json:"data,omitempty"`
}

type PushService struct {
	notifRepo NotificationRepository
	cfg       *config.Config
	log       *zap.Logger
	client    *http.Client
}

func NewPushService(notifRepo NotificationRepository, cfg *config.Config, log *zap.Logger) *PushService {
	return &PushService{
		notifRepo: notifRepo,
		cfg:       cfg,
		log:       log,
		client:    &http.Client{Timeout: 10 * time.Second},
	}
}

// Send delivers a push notification to a user and logs it.
func (s *PushService) Send(ctx context.Context, userID uuid.UUID, pushToken, notifType, title, body string) error {
	if pushToken == "" || s.cfg.ExpoPushToken == "" {
		return nil // silently skip if no token configured
	}

	msg := expoPushMessage{
		To:    pushToken,
		Title: title,
		Body:  body,
		Data:  map[string]string{"type": notifType},
	}

	payload, _ := json.Marshal([]expoPushMessage{msg})
	req, err := http.NewRequestWithContext(ctx, "POST", expoPushURL, bytes.NewReader(payload))
	if err != nil {
		return fmt.Errorf("create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	if s.cfg.ExpoPushToken != "" {
		req.Header.Set("Authorization", "Bearer "+s.cfg.ExpoPushToken)
	}

	resp, err := s.client.Do(req)
	if err != nil {
		s.log.Warn("push notification failed", zap.Error(err), zap.String("user_id", userID.String()))
		return err
	}
	defer resp.Body.Close()

	// Log the notification
	log := &model.NotificationLog{
		UserID:           userID,
		NotificationType: notifType,
		Title:            &title,
		Body:             &body,
	}
	_ = s.notifRepo.CreateLog(ctx, log)

	return nil
}
