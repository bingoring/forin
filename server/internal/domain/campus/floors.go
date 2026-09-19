// Package campus is the hospital's building/floor directory: which departments sit
// on which floor, what the lift calls that floor, and the learning order of floors.
//
// It is presentation metadata, not learning domain — the journey is organised by
// theme and department, and a building only matters because the campus screen draws
// one. Two consumers need the same table, which is why it lives here rather than in
// either of them: cmd/gencontent (which floors get a generated chapter) and the HTTP
// presenter that groups the journey into buildings for the legacy campus view.
//
// This mirrors ELEVATOR_BUILDINGS in the mobile client. The duplication is
// deliberate: the client copy carries art, coordinates and entry tiles the server
// has no use for. If they drift, this file is the server's truth.
package campus

// Floor is one stop the lift can reach.
type Floor struct {
	Building string   // display name of the building
	Label    string   // floor label as shown in the lift ("8F", "P1", "B1")
	Depts    []string // scenario bank codes this floor draws from
	Chapter  string   // chapter title (drives generation only)
	Where    string   // the "오늘 배치" string — must match the lift exactly
	Tier     int      // learning order (lower = earlier)
	// Authored marks a floor whose curriculum was hand-written before the generator
	// existed. Generation skips these so carefully written steps are not overwritten.
	Authored bool
}

// Floors is the whole directory, in CAMPUS DISPLAY order: buildings in the order the
// screen lists them, floors within a building in the order that screen shows them.
// Learning order is Tier, which is a different question and deliberately not this
// slice's order — a learner rides the lift by building, and progresses by tier.
var Floors = []Floor{
	// ── 본관 ────────────────────────────────────────────────────────────
	{Building: "본관", Label: "1F", Depts: []string{"ER"}, Chapter: "응급의료센터 · 첫 관문", Where: "본관 1F 응급의료센터", Tier: 1, Authored: true},
	{Building: "본관", Label: "P1", Depts: []string{"PHARMA"}, Chapter: "중앙 약제부 · 약이 나가는 길", Where: "본관 P1 중앙 약제부", Tier: 2, Authored: true},
	{Building: "본관", Label: "3F", Depts: []string{"OR"}, Chapter: "수술실·PACU · 팀으로 말하기", Where: "본관 3F 수술실 · PACU", Tier: 3, Authored: true},
	{Building: "본관", Label: "4F", Depts: []string{"ICU"}, Chapter: "중환자실 · 분 단위의 판단", Where: "본관 4F ICU", Tier: 4, Authored: true},
	{Building: "본관", Label: "8F", Depts: []string{"WARD"}, Chapter: "내과 병동 · 만성질환 돌봄", Where: "본관 8F 일반 내과 병동", Tier: 10},
	{Building: "본관", Label: "7F", Depts: []string{"SURGWARD"}, Chapter: "외과 병동 · 수술 후 회복", Where: "본관 7F 일반 외과 병동", Tier: 20},
	{Building: "본관", Label: "6F", Depts: []string{"ORTHOWARD"}, Chapter: "정형외과 병동 · 골절과 보행", Where: "본관 6F 정형외과 병동", Tier: 30},
	{Building: "본관", Label: "2F", Depts: []string{"DERM"}, Chapter: "피부과 센터 · 광선과 레이저", Where: "본관 2F 피부과 센터", Tier: 60},

	// ── 별관 1 ──────────────────────────────────────────────────────────
	{Building: "별관 1", Label: "1F", Depts: []string{"WOMENKIDS"}, Chapter: "여성소아 외래 · 보호자와 함께", Where: "별관 1 1F 소아청소년·산부인과 외래", Tier: 70},
	{Building: "별관 1", Label: "2F", Depts: []string{"PEDS"}, Chapter: "소아 병동 · 아이와 보호자 사이", Where: "별관 1 2F 소아 일반 병동", Tier: 110},
	{Building: "별관 1", Label: "3F", Depts: []string{"LD", "NURSERY"}, Chapter: "분만실·신생아실 · 새 생명의 첫 시간", Where: "별관 1 3F 가족 분만실 · 신생아실", Tier: 120},
	{Building: "별관 1", Label: "4F", Depts: []string{"NICU", "PICU"}, Chapter: "신생아·소아 중환자실 · 가장 작은 환자", Where: "별관 1 4F 신생아·소아 중환자실", Tier: 140},

	// ── 별관 2 ──────────────────────────────────────────────────────────
	{Building: "별관 2", Label: "1F", Depts: []string{"REHAB"}, Chapter: "재활치료실 · 다시 걷기까지", Where: "별관 2 1F 재활치료실", Tier: 100},
	{Building: "별관 2", Label: "2F", Depts: []string{"PSYCH"}, Chapter: "정신과 병동 · 위기와 신뢰", Where: "별관 2 2F 정신과 병동", Tier: 150},
	{Building: "별관 2", Label: "3F", Depts: []string{"ONCO"}, Chapter: "종양 병동 · 치료와 부작용 사이", Where: "별관 2 3F 종양학 병동 · 이식실", Tier: 130},
	{Building: "별관 2", Label: "4F", Depts: []string{"HOSPICE", "GERI"}, Chapter: "호스피스·노인 병동 · 마지막을 돌보다", Where: "별관 2 4F 완화의료 · 노인성 질환 병동", Tier: 160},

	// ── 별관 3 ──────────────────────────────────────────────────────────
	{Building: "별관 3", Label: "1F", Depts: []string{"RAD"}, Chapter: "영상의학과 · 검사 전 불안 다루기", Where: "별관 3 1F 영상의학과", Tier: 40},
	{Building: "별관 3", Label: "2F", Depts: []string{"SPECIALTY"}, Chapter: "특수 외래 · 안·이비인후·비뇨·신경", Where: "별관 3 2F 특수 외래", Tier: 50},
	{Building: "별관 3", Label: "3F", Depts: []string{"INFUSION", "DIAL"}, Chapter: "주사센터·인공신장실 · 반복 치료의 동행", Where: "별관 3 3F 외래 주사센터 · 인공신장실", Tier: 80},
	{Building: "별관 3", Label: "4F", Depts: []string{"ENDO"}, Chapter: "내시경·중재 시술 · 진정 관리", Where: "별관 3 4F 내시경실 · 심혈관 조영실", Tier: 90},

	// ── 지원동 ──────────────────────────────────────────────────────────
	{Building: "지원동", Label: "B1", Depts: []string{"MORGUE"}, Chapter: "영안실 · 존엄과 애도", Where: "지원동 B1 영안실", Tier: 170},
	{Building: "지원동", Label: "1F", Depts: []string{"SPD"}, Chapter: "중앙공급실 · 무균과 공급망", Where: "지원동 1F 중앙공급실", Tier: 180},
	{Building: "지원동", Label: "2F", Depts: []string{"LOUNGE"}, Chapter: "의료진 휴게실 · 동료와의 대화", Where: "지원동 2F 의료진 휴게실", Tier: 190},
	{Building: "지원동", Label: "3F", Depts: []string{"SIM"}, Chapter: "시뮬레이션 랩 · 배운 것을 되짚다", Where: "지원동 3F 시뮬레이션 랩", Tier: 200},
}

// Generated returns the floors a chapter is generated for — everything except the
// hand-authored ones, whose steps are written rather than assembled.
func Generated() []Floor {
	out := make([]Floor, 0, len(Floors))
	for _, f := range Floors {
		if !f.Authored {
			out = append(out, f)
		}
	}
	return out
}

// Of returns the floor a department sits on.
//
// ok=false for a bank that reaches no floor — GEN is the standing example: a generic
// ward bank the lift cannot stop at, reachable from the department sheet instead. A
// caller that groups by building must drop those rather than invent a building.
func Of(deptCode string) (Floor, bool) {
	for _, f := range Floors {
		for _, d := range f.Depts {
			if d == deptCode {
				return f, true
			}
		}
	}
	return Floor{}, false
}
