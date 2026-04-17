package service

import (
	"testing"
	"time"
)

func BenchmarkComputeLives(b *testing.B) {
	refill := time.Now().Add(-45 * time.Minute)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		ComputeLives(3, &refill)
	}
}

func BenchmarkComputeLevel(b *testing.B) {
	for i := 0; i < b.N; i++ {
		ComputeLevel(42000)
	}
}

func BenchmarkLevelTitle(b *testing.B) {
	for i := 0; i < b.N; i++ {
		LevelTitle(7)
	}
}
