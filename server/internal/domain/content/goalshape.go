package content

import "strings"

// The structural goals every clinical conversation has: it OPENS (who am I, who am I
// speaking to, why am I here) and it CLOSES (what happens next).
//
// Authored scenarios carry the BODY of the exchange — assess the pain, screen for
// infection — and that is what made a scenario clearable in one sentence. The opening
// and closing are not padding: they are the two things a nurse working abroad most
// often gets wrong, they are on every OSCE checklist, and they cannot be satisfied in
// the same breath as a body goal.
//
// They live here, not in the generator, because two things need the same answer: the
// generator composing 2782 scenarios and the migration that backfilled the 303
// hand-authored ones. Two copies of this mapping would have drifted the moment a role
// was added.

// goalRole groups the many persona roles by what opening and closing MEAN for them.
// The competence differs by who you are addressing, not by department.
func goalRole(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "colleague", "doctor", "nurse", "pharmacist", "paramedic", "police", "tech", "therapist":
		// A professional exchange. You have less of their time than they have of
		// yours, so it opens with the point (SBAR's S) and closes on agreed actions.
		return "professional"
	case "parent", "family", "guardian", "visitor":
		// Someone who is not the patient. The relationship has to be established
		// before anything else means anything.
		return "guardian"
	default: // patient, child, and anything unrecognised
		return "patient"
	}
}

// OpenGoal is what the learner must do at the start of the conversation.
func OpenGoal(role string) string {
	switch goalRole(role) {
	case "professional":
		return "용건과 상황을 먼저 밝히고 대화 시작"
	case "guardian":
		return "보호자에게 자기소개하고 환자와의 관계 확인"
	default:
		return "자기소개하고 환자 본인 확인"
	}
}

// CloseGoal is what the learner must do before leaving.
func CloseGoal(role string) string {
	switch goalRole(role) {
	case "professional":
		return "합의된 조치와 후속 확인 후 마무리"
	case "guardian":
		return "앞으로의 계획과 연락 방법을 설명하고 마무리"
	default:
		return "다음에 무엇이 일어날지 설명하고 마무리"
	}
}

// ComposeGoals wraps a scenario's authored goals in the opening and closing ones.
//
// Order is conversation order, which is also the order the dialogue screen's mission
// tracker lists them in: a learner reading it top to bottom sees the shape of the
// exchange they are about to have.
//
// Duplicates and blanks are dropped. A goal listed twice counts twice toward coverage,
// so a learner could clear a four-goal scenario by doing three things — one credited
// twice. A blank is worse: the grader's evidence check skips it, which shrinks the
// denominator and silently makes every other goal worth more.
func ComposeGoals(role string, authored []string) []string {
	out := make([]string, 0, len(authored)+2)
	seen := map[string]bool{}
	add := func(g string) {
		g = strings.TrimSpace(g)
		if g == "" || seen[g] {
			return
		}
		seen[g] = true
		out = append(out, g)
	}
	add(OpenGoal(role))
	for _, g := range authored {
		add(g)
	}
	add(CloseGoal(role))
	return out
}
