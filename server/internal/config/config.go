package config

import (
	"log"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	ServerPort string
	Env        string

	DatabaseDSN string

	RedisAddr     string
	RedisPassword string

	JWTSecret          string
	JWTRefreshSecret   string
	JWTAccessExpiry    time.Duration
	JWTRefreshExpiry   time.Duration

	GoogleClientID     string
	GoogleClientSecret string

	AnthropicAPIKey string

	AWSS3Bucket       string
	AWSRegion         string
	CloudfrontDomain  string

	ExpoPushToken string
}

func Load() *Config {
	viper.SetConfigFile(".env")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("No .env file found, reading from environment: %v", err)
	}

	accessExpiry, err := time.ParseDuration(viper.GetString("JWT_ACCESS_EXPIRY"))
	if err != nil {
		accessExpiry = 15 * time.Minute
	}
	refreshExpiry, err := time.ParseDuration(viper.GetString("JWT_REFRESH_EXPIRY"))
	if err != nil {
		refreshExpiry = 168 * time.Hour
	}

	return &Config{
		ServerPort: viper.GetString("SERVER_PORT"),
		Env:        viper.GetString("ENV"),

		DatabaseDSN: viper.GetString("DATABASE_DSN"),

		RedisAddr:     viper.GetString("REDIS_ADDR"),
		RedisPassword: viper.GetString("REDIS_PASSWORD"),

		JWTSecret:        viper.GetString("JWT_SECRET"),
		JWTRefreshSecret: viper.GetString("JWT_REFRESH_SECRET"),
		JWTAccessExpiry:  accessExpiry,
		JWTRefreshExpiry: refreshExpiry,

		GoogleClientID:     viper.GetString("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: viper.GetString("GOOGLE_CLIENT_SECRET"),

		AnthropicAPIKey: viper.GetString("ANTHROPIC_API_KEY"),

		AWSS3Bucket:      viper.GetString("AWS_S3_BUCKET"),
		AWSRegion:        viper.GetString("AWS_REGION"),
		CloudfrontDomain: viper.GetString("CLOUDFRONT_DOMAIN"),

		ExpoPushToken: viper.GetString("EXPO_PUSH_ACCESS_TOKEN"),
	}
}
