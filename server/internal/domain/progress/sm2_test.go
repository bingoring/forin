package progress

import (
	"testing"
	"time"
)

var day0 = time.Date(2026, 6, 8, 0, 0, 0, 0, time.UTC)

func TestSM2GoodProgression(t *testing.T) {
	s := Schedule{Ease: 2.5}
	s, pips := Review(s, GradeGood, day0) // reps 0 -> interval 1
	if s.IntervalDays != 1 || s.Reps != 1 || pips != 1 {
		t.Fatalf("after 1st good: %+v pips=%d", s, pips)
	}
	s, _ = Review(s, GradeGood, day0) // reps 1 -> interval 6
	if s.IntervalDays != 6 || s.Reps != 2 {
		t.Fatalf("after 2nd good: %+v", s)
	}
	s, pips = Review(s, GradeGood, day0) // reps 2 -> interval ~ 6*ease
	if s.IntervalDays < 14 || s.Reps != 3 || pips != 3 {
		t.Fatalf("after 3rd good: interval=%d reps=%d pips=%d", s.IntervalDays, s.Reps, pips)
	}
	if !s.DueDate.After(day0) {
		t.Fatal("due date should advance")
	}
}

func TestSM2AgainResets(t *testing.T) {
	s := Schedule{Ease: 2.5, IntervalDays: 30, Reps: 5}
	s, pips := Review(s, GradeAgain, day0)
	if s.IntervalDays != 1 || s.Reps != 0 || pips != 0 {
		t.Fatalf("again should reset: %+v pips=%d", s, pips)
	}
	if s.Ease >= 2.5 {
		t.Fatal("ease should drop after again")
	}
}

func TestSM2EaseFloor(t *testing.T) {
	s := Schedule{Ease: 1.3}
	for i := 0; i < 5; i++ {
		s, _ = Review(s, GradeAgain, day0)
	}
	if s.Ease < 1.3 {
		t.Fatalf("ease must not fall below 1.3, got %v", s.Ease)
	}
}

func TestGradeValidation(t *testing.T) {
	if GradeGood.Valid() != true || Grade("nope").Valid() != false {
		t.Fatal("grade validation wrong")
	}
}
