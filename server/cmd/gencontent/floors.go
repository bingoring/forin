package main

// The building/floor directory the curriculum is built from.
//
// Every floor a learner can ride the elevator to gets a chapter — the previous
// catalog covered four floors of one building and left twenty floors (and ~2,700
// scenarios) reachable only by wandering. `tier` is the learning order: it rises
// from everyday communication to high-acuity and emotionally heavy work, so the
// path is difficulty-led rather than a walk up the stairwell (a newcomer should
// not meet dermatology lasers in chapter two, nor the mortuary in chapter four).
//
// This mirrors ELEVATOR_BUILDINGS in the mobile client. The duplication is
// deliberate for now: the client copy carries art, coordinates and entry tiles
// the server has no use for. If they drift, this file is the curriculum's truth.
type Floor struct {
	Building string   // display name of the building
	Label    string   // floor label as shown in the lift ("8F", "P1", "B1")
	Depts    []string // scenario bank codes this floor draws from
	Chapter  string   // chapter title
	Where    string   // the "오늘 배치" string — must match the lift exactly
	Tier     int      // learning order (lower = earlier)
}

// Floors excludes the four already covered by the hand-authored chapters 1–5
// (본관 1F/3F/4F/P1); those keep their carefully written steps.
var Floors = []Floor{
	// ── 일상 병동 업무 — 기본기를 쌓는 구간 ──────────────────────────────
	{Building: "본관", Label: "8F", Depts: []string{"WARD"}, Chapter: "내과 병동 · 만성질환 돌봄", Where: "본관 8F 일반 내과 병동", Tier: 10},
	{Building: "본관", Label: "7F", Depts: []string{"SURGWARD"}, Chapter: "외과 병동 · 수술 후 회복", Where: "본관 7F 일반 외과 병동", Tier: 20},
	{Building: "본관", Label: "6F", Depts: []string{"ORTHOWARD"}, Chapter: "정형외과 병동 · 골절과 보행", Where: "본관 6F 정형외과 병동", Tier: 30},

	// ── 외래·검사 — 짧은 만남에서 신뢰를 얻는 법 ────────────────────────
	{Building: "별관 3", Label: "1F", Depts: []string{"RAD"}, Chapter: "영상의학과 · 검사 전 불안 다루기", Where: "별관 3 1F 영상의학과", Tier: 40},
	{Building: "별관 3", Label: "2F", Depts: []string{"SPECIALTY"}, Chapter: "특수 외래 · 안·이비인후·비뇨·신경", Where: "별관 3 2F 특수 외래", Tier: 50},
	{Building: "본관", Label: "2F", Depts: []string{"DERM"}, Chapter: "피부과 센터 · 광선과 레이저", Where: "본관 2F 피부과 센터", Tier: 60},
	{Building: "별관 1", Label: "1F", Depts: []string{"WOMENKIDS"}, Chapter: "여성소아 외래 · 보호자와 함께", Where: "별관 1 1F 소아청소년·산부인과 외래", Tier: 70},

	// ── 반복 치료 — 오래 만나는 환자와의 관계 ───────────────────────────
	{Building: "별관 3", Label: "3F", Depts: []string{"INFUSION", "DIAL"}, Chapter: "주사센터·인공신장실 · 반복 치료의 동행", Where: "별관 3 3F 외래 주사센터 · 인공신장실", Tier: 80},
	{Building: "별관 3", Label: "4F", Depts: []string{"ENDO"}, Chapter: "내시경·중재 시술 · 진정 관리", Where: "별관 3 4F 내시경실 · 심혈관 조영실", Tier: 90},
	{Building: "별관 2", Label: "1F", Depts: []string{"REHAB"}, Chapter: "재활치료실 · 다시 걷기까지", Where: "별관 2 1F 재활치료실", Tier: 100},

	// ── 소아·모성 — 두 사람에게 동시에 말하기 ──────────────────────────
	{Building: "별관 1", Label: "2F", Depts: []string{"PEDS"}, Chapter: "소아 병동 · 아이와 보호자 사이", Where: "별관 1 2F 소아 일반 병동", Tier: 110},
	{Building: "별관 1", Label: "3F", Depts: []string{"LD", "NURSERY"}, Chapter: "분만실·신생아실 · 새 생명의 첫 시간", Where: "별관 1 3F 가족 분만실 · 신생아실", Tier: 120},

	// ── 고중증 — 판단이 곧 안전인 구간 ──────────────────────────────────
	{Building: "별관 2", Label: "3F", Depts: []string{"ONCO"}, Chapter: "종양 병동 · 치료와 부작용 사이", Where: "별관 2 3F 종양학 병동 · 이식실", Tier: 130},
	{Building: "별관 1", Label: "4F", Depts: []string{"NICU", "PICU"}, Chapter: "신생아·소아 중환자실 · 가장 작은 환자", Where: "별관 1 4F 신생아·소아 중환자실", Tier: 140},

	// ── 정서 난이도 — 말보다 태도가 시험받는 구간 ───────────────────────
	{Building: "별관 2", Label: "2F", Depts: []string{"PSYCH"}, Chapter: "정신과 병동 · 위기와 신뢰", Where: "별관 2 2F 정신과 병동", Tier: 150},
	{Building: "별관 2", Label: "4F", Depts: []string{"HOSPICE", "GERI"}, Chapter: "호스피스·노인 병동 · 마지막을 돌보다", Where: "별관 2 4F 완화의료 · 노인성 질환 병동", Tier: 160},
	{Building: "지원동", Label: "B1", Depts: []string{"MORGUE"}, Chapter: "영안실 · 존엄과 애도", Where: "지원동 B1 영안실", Tier: 170},

	// ── 백스테이지 — 병원을 굴리는 사람들 ───────────────────────────────
	{Building: "지원동", Label: "1F", Depts: []string{"SPD"}, Chapter: "중앙공급실 · 무균과 공급망", Where: "지원동 1F 중앙공급실", Tier: 180},
	{Building: "지원동", Label: "2F", Depts: []string{"LOUNGE"}, Chapter: "의료진 휴게실 · 동료와의 대화", Where: "지원동 2F 의료진 휴게실", Tier: 190},
	{Building: "지원동", Label: "3F", Depts: []string{"SIM"}, Chapter: "시뮬레이션 랩 · 배운 것을 되짚다", Where: "지원동 3F 시뮬레이션 랩", Tier: 200},
}
