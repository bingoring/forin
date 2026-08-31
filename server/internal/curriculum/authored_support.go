package curriculum

// 지원동 (support wing) — 영안실 · 중앙공급실 · 의료진 휴게실 · 시뮬레이션 랩.
//
// The only building with no patients. Every one of these forty topics is a
// conversation with a colleague, which is exactly why a mechanical band rule
// collapsed here: "who are you talking to" carries no signal when the answer is
// always the same. The curricula are named for what the conversation is FOR —
// 요청, 보고, 위기, 되짚기 — since that is the axis that actually varies.
var support = []Curriculum{
	// ── B1 영안실 ───────────────────────────────────────────────────────
	{
		Key: "지원동|B1|procedure", Name: "존엄을 지키는 절차",
		Building: "지원동", Floor: "B1", Where: "지원동 B1 영안실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 영안실", ScenarioID: "SCN-MORGUE-00900"},
			{Kind: "dlg", Name: "장례식장 인계 소통", ScenarioID: "SCN-MORGUE-00104"},
			{Kind: "quiz", Name: "유족 응대 원칙", ScenarioID: "QZ-MORGUE-00001"},
			{Kind: "dlg", Name: "고인 신원 확인 절차", ScenarioID: "SCN-MORGUE-00103"},
			{Kind: "dlg", Name: "기록·서류 정확성", ScenarioID: "SCN-MORGUE-00109"},
			{Kind: "boss", Name: "사후 처치 존엄 케어", ScenarioID: "SCN-MORGUE-00101"},
		},
	},
	{
		Key: "지원동|B1|bereaved", Name: "유가족 앞에서",
		Building: "지원동", Floor: "B1", Where: "지원동 B1 영안실",
		Steps: []Step{
			{Kind: "dlg", Name: "소지품 반환", ScenarioID: "SCN-MORGUE-00108"},
			{Kind: "dlg", Name: "문화적 임종 관습 존중", ScenarioID: "SCN-MORGUE-00106"},
			{Kind: "boss", Name: "유가족 대면 안내", ScenarioID: "SCN-MORGUE-00102"},
		},
	},
	{
		Key: "지원동|B1|staff", Name: "남은 사람들",
		Building: "지원동", Floor: "B1", Where: "지원동 B1 영안실",
		Steps: []Step{
			{Kind: "dlg", Name: "영안실 인계", ScenarioID: "SCN-MORGUE-00110"},
			{Kind: "dlg", Name: "직원 정서 디브리핑", ScenarioID: "SCN-MORGUE-00107"},
			{Kind: "boss", Name: "부검 동의 설명", ScenarioID: "SCN-MORGUE-00105"},
		},
	},

	// ── 1F 중앙공급실 ───────────────────────────────────────────────────
	{
		Key: "지원동|1F|requests", Name: "요청을 받는 자리",
		Building: "지원동", Floor: "1F", Where: "지원동 1F 중앙공급실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 중앙공급실", ScenarioID: "SCN-SPD-00900"},
			{Kind: "dlg", Name: "멸균 물품 요청", ScenarioID: "SCN-SPD-00101"},
			{Kind: "quiz", Name: "오염 · 멸균 분류", ScenarioID: "QZ-SPD-00001"},
			{Kind: "dlg", Name: "물품 추적 문의 응대", ScenarioID: "SCN-SPD-00105"},
			{Kind: "dlg", Name: "수술 케이스 카트 확인", ScenarioID: "SCN-SPD-00109"},
			{Kind: "boss", Name: "재고 부족 알림", ScenarioID: "SCN-SPD-00104"},
		},
	},
	{
		Key: "지원동|1F|sterile", Name: "무균을 지키는 손",
		Building: "지원동", Floor: "1F", Where: "지원동 1F 중앙공급실",
		Steps: []Step{
			{Kind: "dlg", Name: "신규 직원 무균 교육", ScenarioID: "SCN-SPD-00106"},
			{Kind: "dlg", Name: "오염 기구 처리 소통", ScenarioID: "SCN-SPD-00107"},
			{Kind: "boss", Name: "긴급 기구 재처리", ScenarioID: "SCN-SPD-00103"},
		},
	},
	{
		Key: "지원동|1F|escalate", Name: "문제를 올리는 법",
		Building: "지원동", Floor: "1F", Where: "지원동 1F 중앙공급실",
		Steps: []Step{
			{Kind: "dlg", Name: "공급실 인계", ScenarioID: "SCN-SPD-00110"},
			{Kind: "event", Name: "장비 고장 에스컬레이션", ScenarioID: "SCN-SPD-00108"},
			{Kind: "boss", Name: "멸균 실패 보고 대응", ScenarioID: "SCN-SPD-00102"},
		},
	},

	// ── 2F 의료진 휴게실 ────────────────────────────────────────────────
	{
		Key: "지원동|2F|smalltalk", Name: "동료와 말 트기",
		Building: "지원동", Floor: "2F", Where: "지원동 2F 의료진 휴게실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 휴게실", ScenarioID: "SCN-LOUNGE-00900"},
			{Kind: "dlg", Name: "교대 조율 협의", ScenarioID: "SCN-LOUNGE-00103"},
			{Kind: "dlg", Name: "감사 표현", ScenarioID: "SCN-LOUNGE-00109"},
			{Kind: "dlg", Name: "근무 인계 잡담", ScenarioID: "SCN-LOUNGE-00110"},
			{Kind: "boss", Name: "긍정 피드백 문화", ScenarioID: "SCN-LOUNGE-00106"},
		},
	},
	{
		Key: "지원동|2F|burnout", Name: "지친 사람 옆에서",
		Building: "지원동", Floor: "2F", Where: "지원동 2F 의료진 휴게실",
		Steps: []Step{
			{Kind: "dlg", Name: "휴식·자기돌봄 권유", ScenarioID: "SCN-LOUNGE-00107"},
			{Kind: "quiz", Name: "동료가 소진을 호소할 때", ScenarioID: "QZ-LOUNGE-00003"},
			{Kind: "dlg", Name: "동료 정서 지지", ScenarioID: "SCN-LOUNGE-00101"},
			{Kind: "boss", Name: "번아웃 대화", ScenarioID: "SCN-LOUNGE-00102"},
		},
	},
	{
		Key: "지원동|2F|hardtosay", Name: "말하기 어려운 것",
		Building: "지원동", Floor: "2F", Where: "지원동 2F 의료진 휴게실",
		Steps: []Step{
			{Kind: "dlg", Name: "신입 멘토링", ScenarioID: "SCN-LOUNGE-00105"},
			{Kind: "dlg", Name: "어려운 지시 전달", ScenarioID: "SCN-LOUNGE-00108"},
			{Kind: "boss", Name: "갈등 중재", ScenarioID: "SCN-LOUNGE-00104"},
		},
	},

	// ── 3F 시뮬레이션 랩 ────────────────────────────────────────────────
	{
		Key: "지원동|3F|prepare", Name: "배울 준비",
		Building: "지원동", Floor: "3F", Where: "지원동 3F 시뮬레이션 랩",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 시뮬레이션랩", ScenarioID: "SCN-SIM-00900"},
			{Kind: "dlg", Name: "학습 목표 브리핑", ScenarioID: "SCN-SIM-00106"},
			{Kind: "dlg", Name: "신입 오리엔테이션", ScenarioID: "SCN-SIM-00107"},
			{Kind: "boss", Name: "술기 피드백", ScenarioID: "SCN-SIM-00102"},
		},
	},
	{
		Key: "지원동|3F|debrief", Name: "되짚어 보기",
		Building: "지원동", Floor: "3F", Where: "지원동 3F 시뮬레이션 랩",
		Steps: []Step{
			{Kind: "dlg", Name: "팀 커뮤니케이션 훈련", ScenarioID: "SCN-SIM-00103"},
			{Kind: "dlg", Name: "SBAR 연습", ScenarioID: "SCN-SIM-00104"},
			{Kind: "dlg", Name: "시뮬레이션 디브리핑", ScenarioID: "SCN-SIM-00101"},
			{Kind: "boss", Name: "실수 보고 문화 교육", ScenarioID: "SCN-SIM-00108"},
		},
	},
	{
		Key: "지원동|3F|rehearse", Name: "실전처럼",
		Building: "지원동", Floor: "3F", Where: "지원동 3F 시뮬레이션 랩",
		Steps: []Step{
			{Kind: "dlg", Name: "시뮬랩 세션 인계", ScenarioID: "SCN-SIM-00110"},
			{Kind: "quiz", Name: "성인 BLS 순서", ScenarioID: "QZ-SIM-00001"},
			{Kind: "dlg", Name: "의사소통 시나리오 코칭", ScenarioID: "SCN-SIM-00109"},
			{Kind: "boss", Name: "위기 상황 역할극", ScenarioID: "SCN-SIM-00105"},
		},
	},
}
