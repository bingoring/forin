package main

import (
	"fmt"
	"log"

	"github.com/forin/server/internal/config"
	"github.com/forin/server/internal/database"
	"github.com/forin/server/internal/logger"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()
	zapLog := logger.Init(cfg.Env)

	db, err := database.New(cfg, zapLog)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	fmt.Println("Seeding professions...")
	seedProfessions(db)

	fmt.Println("Seeding achievements...")
	seedAchievements(db)

	fmt.Println("Seeding vocabulary...")
	seedVocabulary(db)

	fmt.Println("Seed completed successfully.")
}

func seedProfessions(db *gorm.DB) {
	sql := `
		INSERT INTO professions (name, slug) VALUES
			('Registered Nurse', 'nurse'),
			('Doctor', 'doctor'),
			('Pharmacist', 'pharmacist')
		ON CONFLICT (slug) DO NOTHING;
	`
	if err := db.Exec(sql).Error; err != nil {
		log.Fatalf("failed to seed professions: %v", err)
	}
}

func seedAchievements(db *gorm.DB) {
	sql := `
		INSERT INTO achievements (slug, name, description, reward_type, reward_value, condition_type, condition_value) VALUES
			('first_steps', 'First Steps', 'Complete your first stage', 'gift_box', '{"box_type":"basic"}', 'stage_count', '{"count":1}'),
			('week_warrior', 'Week Warrior', 'Study for 7 consecutive days', 'gift_box', '{"box_type":"silver"}', 'streak', '{"days":7}'),
			('perfect_unit', 'Perfect Unit', 'Complete all stages in a unit with 3 stars', 'gift_box', '{"box_type":"rare"}', 'perfect_stages', '{"unit_complete":true}'),
			('conversation_starter', 'Conversation Starter', 'Complete 10 conversation exercises', 'item', '{"slot":"accessory","theme":"stethoscope"}', 'custom', '{"exercise_type":"conversation","count":10}'),
			('night_shift_hero', 'Night Shift Hero', 'Complete a stage between 11 PM and 5 AM', 'item', '{"slot":"outfit","theme":"nightshift"}', 'custom', '{"time_range":"23:00-05:00"}')
		ON CONFLICT (slug) DO NOTHING;
	`
	if err := db.Exec(sql).Error; err != nil {
		log.Fatalf("failed to seed achievements: %v", err)
	}
}
