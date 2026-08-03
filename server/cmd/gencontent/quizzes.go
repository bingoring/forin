package main

import (
	"fmt"
	"strings"

	"github.com/bingoring/forin/server/internal/domain/content"
)

// buildPhrasePool flattens every topic's key phrases into one global pool used to
// draw MCQ distractors (a phrase from another situation is a plausible wrong pick).
func buildPhrasePool() []string {
	var pool []string
	for _, d := range Depts {
		for _, t := range d.Topics {
			pool = append(pool, t.Phrases...)
		}
	}
	return pool
}

// generateQuizzes turns a department's topic bank into a "pick the right English
// phrase for this clinical situation" MCQ bank. Each key phrase becomes one MCQ:
// the phrase is the correct choice; three distractors are drawn deterministically
// from the global pool, skipping any phrase that belongs to the same topic.
func generateQuizzes(deptIdx int, d Dept, pool []string) []content.Quiz {
	quizzes := make([]content.Quiz, 0, len(d.Topics)*3)
	n := idStart
	for ti, t := range d.Topics {
		own := make(map[string]bool, len(t.Phrases))
		for _, p := range t.Phrases {
			own[p] = true
		}
		for pi, correct := range t.Phrases {
			distractors := pickDistractors(pool, own, deptIdx*131+ti*17+pi*7, 3)
			// Rotate the correct answer's slot by the counter so it isn't always first.
			choices := make([]content.QuizChoice, 0, 4)
			opts := append([]string{correct}, distractors...)
			slot := n % len(opts)
			for i := 0; i < len(opts); i++ {
				src := opts[(i+len(opts)-slot)%len(opts)] // place `correct` at index `slot`
				choices = append(choices, content.QuizChoice{Text: src, Correct: src == correct})
			}
			quizzes = append(quizzes, content.Quiz{
				ID:    fmt.Sprintf("QZ-%s-%05d", d.Code, n),
				Type:  "mcq",
				Title: t.Title,
				Content: &content.QuizContent{
					Sub:     "상황에 맞는 표현을 고르세요",
					Zone:    d.Name,
					Context: t.Brief,
					Note:    strings.Join(t.Skills, " · "),
					Choices: choices,
				},
			})
			n++
		}
	}
	return quizzes
}

// pickDistractors walks the pool from a seeded offset, collecting unique phrases
// that are not in the same topic (`own`) and not already chosen.
func pickDistractors(pool []string, own map[string]bool, seed, count int) []string {
	if len(pool) == 0 {
		return nil
	}
	out := make([]string, 0, count)
	chosen := make(map[string]bool, count)
	for step := 0; step < len(pool) && len(out) < count; step++ {
		cand := pool[(seed+step*37)%len(pool)]
		if own[cand] || chosen[cand] {
			continue
		}
		chosen[cand] = true
		out = append(out, cand)
	}
	return out
}
