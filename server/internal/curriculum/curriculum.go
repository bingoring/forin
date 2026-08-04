// Package curriculum is the server-authoritative chapter/step curriculum model
// (v19 캠퍼스 허브). Chapters group steps (dialogue / quiz / event / boss); each
// step maps to a scenario. Per-user state (done/now/lock) is derived from cleared
// attempts + sequential + prerequisite rules — no progress table. Mirrored to the
// client via GET /me/curriculum, replacing the bundled client catalog.
package curriculum

// Step is one authored curriculum step. Kind ∈ dlg | quiz | event | boss.
// ScenarioID is the playable it maps to ("" = authored ahead of its content).
type Step struct {
	Kind       string `json:"kind"`
	Name       string `json:"name"`
	ScenarioID string `json:"scenarioId,omitempty"`
}

// Chapter is an authored curriculum chapter (a themed run of steps in one dept).
type Chapter struct {
	Ch    int    `json:"ch"`
	Name  string `json:"name"`
	Dept  string `json:"dept"`
	Steps []Step `json:"-"` // authored steps (may be empty for not-yet-written chapters)
	Total int    `json:"-"` // used when a chapter has no authored steps yet
}

// catalog is the authored curriculum. Ch.1–2 have real steps mapped to ER
// scenarios; Ch.3–5 are placeholders (metadata only) until their content lands.
var catalog = []Chapter{
	{Ch: 1, Name: "입사 첫 주 · 기본 소통", Dept: "본관 1F 로비 · ER", Steps: []Step{
		{Kind: "dlg", Name: "출근 · 인사와 자기소개", ScenarioID: "SCN-ER-00001"},
		{Kind: "dlg", Name: "환자 확인 · 신원 대조", ScenarioID: "SCN-ER-00002"},
		{Kind: "dlg", Name: "주호소 청취", ScenarioID: "SCN-ER-00003"},
		{Kind: "quiz", Name: "신체 부위 라벨링", ScenarioID: "QZ-GEN-00002"},
		{Kind: "dlg", Name: "활력징후 안내", ScenarioID: "SCN-ER-00004"},
		{Kind: "dlg", Name: "대기 안내와 배려", ScenarioID: "SCN-ER-00005"},
	}},
	{Ch: 2, Name: "응급실 트리아지", Dept: "본관 1F 응급의료센터", Steps: []Step{
		{Kind: "dlg", Name: "접수 · 주호소 청취", ScenarioID: "SCN-ER-00006"},
		{Kind: "quiz", Name: "통증 사정 표현", ScenarioID: "SCN-ER-00007"},
		{Kind: "dlg", Name: "KTAS 분류 설명", ScenarioID: "SCN-ER-00008"},
		{Kind: "event", Name: "돌발 · 구급차 2대 동시 도착", ScenarioID: "SCN-ER-00009"},
		{Kind: "dlg", Name: "보호자에게 대기 안내", ScenarioID: "SCN-ER-00010"},
		{Kind: "boss", Name: "SBAR 인계 (챕터 시험)", ScenarioID: "SCN-ER-00011"},
	}},
	{Ch: 3, Name: "병동 인계와 투약", Dept: "본관 5F 내과 병동 · 중앙약국", Steps: []Step{
		{Kind: "dlg", Name: "헤파린 더블 체크", ScenarioID: "SCN-PHARMA-00001"},
		{Kind: "quiz", Name: "구두 처방 받아쓰기", ScenarioID: "SCN-PHARMA-00002"},
		{Kind: "dlg", Name: "마약류 픽업 · 2인 인증", ScenarioID: "SCN-PHARMA-00004"},
		{Kind: "event", Name: "돌발 · STAT IV 혼합 콜", ScenarioID: "SCN-PHARMA-00005"},
		{Kind: "dlg", Name: "인슐린 자가주사 교육", ScenarioID: "SCN-PHARMA-00006"},
		{Kind: "dlg", Name: "와파린 복약 상담", ScenarioID: "SCN-PHARMA-00007"},
		{Kind: "boss", Name: "고위험 약물 이중확인 (챕터 시험)", ScenarioID: "SCN-PHARMA-00008"},
	}},
	{Ch: 4, Name: "수술 전후 케어", Dept: "본관 3F 수술실 · PACU", Steps: []Step{
		{Kind: "dlg", Name: "수술 동의 확인", ScenarioID: "SCN-OR-00001"},
		{Kind: "dlg", Name: "마취 전 문진", ScenarioID: "SCN-OR-00006"},
		{Kind: "quiz", Name: "수술 부위 표시 확인", ScenarioID: "SCN-OR-00007"},
		{Kind: "dlg", Name: "수술 전 Time-out 진행", ScenarioID: "SCN-OR-00002"},
		{Kind: "event", Name: "돌발 · 무균술 유지 대응", ScenarioID: "SCN-OR-00008"},
		{Kind: "boss", Name: "PACU 인계 (챕터 시험)", ScenarioID: "SCN-OR-00004"},
	}},
	{Ch: 5, Name: "중환자실 집중 감시", Dept: "본관 4F ICU", Steps: []Step{
		{Kind: "dlg", Name: "모니터 알람 해석", ScenarioID: "SCN-ICU-00005"},
		{Kind: "quiz", Name: "인공호흡기 설정 보고", ScenarioID: "SCN-ICU-00001"},
		{Kind: "dlg", Name: "인공호흡기 환자 소통", ScenarioID: "SCN-ICU-00006"},
		{Kind: "dlg", Name: "진정 관리 설명", ScenarioID: "SCN-ICU-00007"},
		{Kind: "event", Name: "돌발 · Code Blue 콜 응대", ScenarioID: "SCN-ICU-00003"},
		{Kind: "dlg", Name: "ICU 섬망 대응", ScenarioID: "SCN-ICU-00009"},
		{Kind: "dlg", Name: "패혈증 상태 설명", ScenarioID: "SCN-ICU-00008"},
		{Kind: "boss", Name: "임종 가족과의 면담 (챕터 시험)", ScenarioID: "SCN-ICU-00002"},
	}},
}

// StepState is a step with its resolved per-user state.
type StepState struct {
	Kind       string `json:"kind"`
	Name       string `json:"name"`
	ScenarioID string `json:"scenarioId,omitempty"`
	State      string `json:"state"` // done | now | lock
}

// ChapterState is a chapter with resolved progress + step states.
type ChapterState struct {
	Ch    int         `json:"ch"`
	Name  string      `json:"name"`
	Dept  string      `json:"dept"`
	Done  int         `json:"done"`
	Total int         `json:"total"`
	State string      `json:"state"`          // done | now | lock
	Next  string      `json:"next,omitempty"` // name of the current (now) step
	Steps []StepState `json:"steps,omitempty"`
}

// Resolve computes per-user chapter/step states from the set of cleared scenario
// ids. A step is done when its scenario is cleared; the first not-done step in an
// unlocked chapter is now, the rest lock. A chapter is done when all its steps are
// done, now when the previous chapter is done, else locked (prerequisite chain).
func Resolve(cleared map[string]bool) []ChapterState {
	out := make([]ChapterState, 0, len(catalog))
	prevDone := true // ch.1 has no prerequisite
	for _, c := range catalog {
		total := c.Total
		if len(c.Steps) > 0 {
			total = len(c.Steps)
		}
		cs := ChapterState{Ch: c.Ch, Name: c.Name, Dept: c.Dept, Total: total}

		done := 0
		nowUsed := false
		for _, s := range c.Steps {
			st := StepState{Kind: s.Kind, Name: s.Name, ScenarioID: s.ScenarioID}
			switch {
			case s.ScenarioID != "" && cleared[s.ScenarioID]:
				st.State = "done"
				done++
			case prevDone && !nowUsed:
				st.State = "now"
				nowUsed = true
				cs.Next = s.Name
			default:
				st.State = "lock"
			}
			cs.Steps = append(cs.Steps, st)
		}
		cs.Done = done

		switch {
		case total > 0 && done >= total:
			cs.State = "done"
		case prevDone:
			cs.State = "now"
		default:
			cs.State = "lock"
		}
		// A locked chapter shows all steps locked (no premature "now").
		if cs.State == "lock" {
			for i := range cs.Steps {
				if cs.Steps[i].State == "now" {
					cs.Steps[i].State = "lock"
				}
			}
			cs.Next = ""
		}

		out = append(out, cs)
		prevDone = cs.State == "done"
	}
	return out
}
