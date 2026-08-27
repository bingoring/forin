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
// They live here rather than in the generator because two things need the same answer:
// the generator composing 2782 scenarios and the migration that backfilled the 303
// hand-authored ones. Two copies would have drifted the moment a role was added.
//
// THE AXIS. Not "who are they" but: can this person confirm their own identity and
// consent, and what do I owe them at the end? A first pass used three groups —
// patient / guardian / professional — and the content showed two of them to be wrong:
//
//   - 127 "child" scenarios include 신생아 활력 사정. A newborn cannot confirm their own
//     identity, so "환자 본인 확인" was an unachievable goal; against the 0.75 coverage
//     floor an impossible goal makes a scenario HARDER than intended, which is a
//     harm rather than a rounding error.
//   - 17 "visitor" scenarios are 부검 동의 설명, 사별 후 자원 연계, 보호자 소진 지지 —
//     bereavement and consent, not visiting. Closing them with "연락 방법을 설명하고"
//     is tonally wrong in a way a learner would feel.
//
// So there are seven, and each is a real difference in what the opening and closing
// competence IS — not seven ways of saying hello.

// goalRole groups persona roles by what opening and closing mean for them.
func goalRole(role string) string {
	switch strings.ToLower(strings.TrimSpace(role)) {
	case "child", "infant", "neonate", "baby":
		// Identity is confirmed with the guardian, never with the patient, and the
		// approach has to reach a frightened child. Covers a newborn and a school-age
		// child both: what they share is that the confirmation happens elsewhere.
		return "pediatric"
	case "parent", "family", "guardian":
		return "guardian"
	case "visitor":
		// This content's "visitor" is bereavement, autopsy consent, family conflict and
		// caregiver burnout. What is owed at the end is presence and support, not a
		// phone number.
		return "bereaved"
	case "doctor":
		// Escalation. The competence is SBAR's R — a clear recommendation — and
		// closed-loop confirmation of what was ordered.
		return "escalation"
	case "police", "officer", "investigator":
		// An outside authority. The competence is verifying who they are and what may
		// and may not be disclosed — the one conversation where saying less is correct.
		return "external"
	case "colleague", "nurse", "pharmacist", "paramedic", "tech", "therapist":
		return "professional"
	default: // patient, and anything unrecognised
		return "patient"
	}
}

// OpenGoal is what the learner must do at the start of the conversation.
func OpenGoal(role string) string { return openFor(goalRole(role)) }

func openFor(group string) string {
	switch group {
	case "pediatric":
		return "보호자와 함께 환자 확인하고 아이에게 눈높이로 자기소개"
	case "guardian":
		return "보호자에게 자기소개하고 환자와의 관계 확인"
	case "bereaved":
		return "자기소개하고 지금 상황을 확인하며 이야기 시작"
	case "escalation":
		return "환자·상황과 보고 이유를 먼저 밝히고 시작"
	case "external":
		return "상대의 신분과 요청 내용을 확인하고 시작"
	case "professional":
		return "용건과 상황을 먼저 밝히고 대화 시작"
	default:
		return "자기소개하고 환자 본인 확인"
	}
}

// CloseGoal is what the learner must do before leaving.
func CloseGoal(role string) string { return closeFor(goalRole(role)) }

func closeFor(group string) string {
	switch group {
	case "pediatric":
		return "보호자에게 결과를 전달하고 아이를 안심시키며 마무리"
	case "guardian":
		return "앞으로의 계획과 연락 방법을 설명하고 마무리"
	case "bereaved":
		return "이용 가능한 지원과 곁에 있을 사람을 안내하고 마무리"
	case "escalation":
		return "필요한 조치를 권고하고 지시를 복창해 확인"
	case "external":
		return "제공 가능한 정보의 범위를 밝히고 마무리"
	case "professional":
		return "합의된 조치와 후속 확인 후 마무리"
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

// goalGroups is every group name, so the structural goals can be enumerated.
var goalGroups = []string{"patient", "pediatric", "guardian", "bereaved", "escalation", "external", "professional"}

// structuralGoals is every opening and closing this file can produce, from any group.
//
// Needed because the groups CHANGE: a first pass had three and the content proved two
// wrong. A migration that only knew how to ADD would then leave 303 files carrying the
// superseded wording, and a scenario would open with the answer for a group it is not
// in. So the migration removes anything in this set and re-adds the correct pair,
// which makes it re-runnable across a regrouping rather than one-shot.
func structuralGoals() map[string]bool {
	out := make(map[string]bool, len(goalGroups)*2)
	for _, g := range goalGroups {
		// Reached through a representative role per group rather than by exporting the
		// group names, so there is one mapping and not two.
		out[openFor(g)] = true
		out[closeFor(g)] = true
	}
	return out
}

// IsStructuralGoal reports whether a goal string is one this file generates — an
// opening or closing from any group, current or superseded.
func IsStructuralGoal(goal string) bool {
	return structuralGoals()[strings.TrimSpace(goal)]
}
