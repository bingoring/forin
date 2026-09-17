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
			{Kind: "dlg", Name: "결핵 병력이 표시된 시신을 옮길 때 동료에게 마스크 등급을 미리 알려주기 · Patricia Armstrong", ScenarioID: "SCN-MORGUE-00104"},
			{Kind: "quiz", Name: "유족 응대 원칙", ScenarioID: "QZ-MORGUE-00001"},
			{Kind: "dlg", Name: "부검 전 기구를 세척하며 혈액 노출을 막는 순서대로 방수 앞치마를 갖추기 · Robert Anderson", ScenarioID: "SCN-MORGUE-00103"},
			{Kind: "dlg", Name: "방부 처리 전 사망진단서에 감염성 질환이 누락된 것을 발견하고 담당의에게 확인을 요청하기 · William Ashford", ScenarioID: "SCN-MORGUE-00109"},
			{Kind: "boss", Name: "격리 표식이 붙은 시신 백을 받을 때 규정대로 이중 장갑과 안면 보호구를 착용하기 · James Adams", ScenarioID: "SCN-MORGUE-00101"},
		},
	},
	{
		Key: "지원동|B1|bereaved", Name: "유가족 앞에서",
		Building: "지원동", Floor: "B1", Where: "지원동 B1 영안실",
		Steps: []Step{
			{Kind: "dlg", Name: "C.difficile 표식과 일반 표식이 뒤섞인 냉장고 칸 배치를 다시 정리해 교차 오염을 막기 · Linda Austin", ScenarioID: "SCN-MORGUE-00108"},
			{Kind: "dlg", Name: "참관을 앞둔 유족에게 감염 주의 표식이 있는 경우 장갑 착용을 안내하기 · Jennifer Alvarez", ScenarioID: "SCN-MORGUE-00106"},
			{Kind: "boss", Name: "생물학적 위험 표식이 붙은 냉장 칸에 시신을 넣기 전 별도 구역으로 동선을 분리하기 · Mary Allen", ScenarioID: "SCN-MORGUE-00102"},
		},
	},
	{
		Key: "지원동|B1|staff", Name: "남은 사람들",
		Building: "지원동", Floor: "B1", Where: "지원동 B1 영안실",
		Steps: []Step{
			{Kind: "dlg", Name: "부검 중 기구에 찔린 동료를 대신해 노출 후 보고 절차를 안내하며 함께 움직이기 · Elizabeth Ayers", ScenarioID: "SCN-MORGUE-00110"},
			{Kind: "dlg", Name: "표식이 누락된 채 도착한 시신을 감염 여부 확인 없이는 냉장고에 넣지 않고 병동에 재확인 전화하기 · David Arnold", ScenarioID: "SCN-MORGUE-00107"},
			{Kind: "boss", Name: "시신 백 지퍼를 열기 전 표식지의 감염 경고 문구를 먼저 확인하기 · Michael Andrews", ScenarioID: "SCN-MORGUE-00105"},
		},
	},

	// ── 1F 중앙공급실 ───────────────────────────────────────────────────
	{
		Key: "지원동|1F|requests", Name: "요청을 받는 자리",
		Building: "지원동", Floor: "1F", Where: "지원동 1F 중앙공급실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 중앙공급실", ScenarioID: "SCN-SPD-00900"},
			{Kind: "dlg", Name: "오염 구역에서 청결 구역으로 넘어가기 전 손 위생과 개인보호구를 순서대로 갖추기 · John Bennett", ScenarioID: "SCN-SPD-00101"},
			{Kind: "quiz", Name: "오염 · 멸균 분류", ScenarioID: "QZ-SPD-00001"},
			{Kind: "dlg", Name: "오염 구역에서 쓴 기구를 반입 전용 문으로만 들이고 청결 구역 문은 쓰지 않기 · Henry Cooper", ScenarioID: "SCN-SPD-00105"},
			{Kind: "dlg", Name: "오염 구역에서 온 카트가 청결 구역 동선을 거슬러 들어오려는 것을 막고 되돌리기 · Kevin Cruz", ScenarioID: "SCN-SPD-00109"},
			{Kind: "boss", Name: "사이클 종료 후 기록지에 온도와 시간이 규정대로 찍혔는지 확인하기 · Grace Cole", ScenarioID: "SCN-SPD-00104"},
		},
	},
	{
		Key: "지원동|1F|sterile", Name: "무균을 지키는 손",
		Building: "지원동", Floor: "1F", Where: "지원동 1F 중앙공급실",
		Steps: []Step{
			{Kind: "dlg", Name: "근무 시작 전 개인보호구 재고와 손 소독제 위치를 점검하기 · Susan Chase", ScenarioID: "SCN-SPD-00106"},
			{Kind: "dlg", Name: "생물학적 지표 결과가 아직 안 나온 사이클 물품을 급하다는 요청에도 내보내지 않고 보류하기 · Nancy Bishop", ScenarioID: "SCN-SPD-00107"},
			{Kind: "boss", Name: "멸균기에 넣기 전 화학적 지표 테이프가 색이 바뀌었는지 포장마다 점검하기 · Carlos Carter", ScenarioID: "SCN-SPD-00103"},
		},
	},
	{
		Key: "지원동|1F|escalate", Name: "문제를 올리는 법",
		Building: "지원동", Floor: "1F", Where: "지원동 1F 중앙공급실",
		Steps: []Step{
			{Kind: "dlg", Name: "습도계 수치가 기준을 벗어난 것을 보고 그날 사이클 전체를 다시 점검할지 판단하기 · Betty Chandler", ScenarioID: "SCN-SPD-00110"},
			{Kind: "event", Name: "포장이 눌린 자국을 발견하고 멸균이 실제로 됐는지 판단하기 애매한 세트를 다시 검토하기 · Daniel Coleman", ScenarioID: "SCN-SPD-00108"},
			{Kind: "boss", Name: "세척을 마친 기구가 물기 없이 완전히 말랐는지 하나씩 확인하기 · Maria Baxter", ScenarioID: "SCN-SPD-00102"},
		},
	},

	// ── 2F 의료진 휴게실 ────────────────────────────────────────────────
	{
		Key: "지원동|2F|smalltalk", Name: "동료와 말 트기",
		Building: "지원동", Floor: "2F", Where: "지원동 2F 의료진 휴게실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 휴게실", ScenarioID: "SCN-LOUNGE-00900"},
			{Kind: "dlg", Name: "락커룸에 붙은 안전 공지문을 읽고 궁금한 절차를 동료에게 확인하기 · Curtis Cole", ScenarioID: "SCN-LOUNGE-00103"},
			{Kind: "dlg", Name: "감염 노출 후 검사를 받으라는 안내를 듣고 소요 시간과 절차를 되묻기 · Nathan Avery", ScenarioID: "SCN-LOUNGE-00109"},
			{Kind: "dlg", Name: "보호구 없이 처치를 도와달라는 동료의 급한 부탁에 안전 규정을 들어 잠시 멈추기 · Wanda Cross", ScenarioID: "SCN-LOUNGE-00110"},
			{Kind: "boss", Name: "손소독제 디스펜서 고장을 시설팀에 짧게 신고하기 · Denise Abbott", ScenarioID: "SCN-LOUNGE-00106"},
		},
	},
	{
		Key: "지원동|2F|burnout", Name: "지친 사람 옆에서",
		Building: "지원동", Floor: "2F", Where: "지원동 2F 의료진 휴게실",
		Steps: []Step{
			{Kind: "dlg", Name: "주사침에 찔린 직후 당황하지 않고 직속 선임에게 즉시 알리기 · Gregory Bishop", ScenarioID: "SCN-LOUNGE-00107"},
			{Kind: "quiz", Name: "동료가 소진을 호소할 때", ScenarioID: "QZ-LOUNGE-00003"},
			{Kind: "dlg", Name: "새로 배치된 날카로운 기구함 사용법을 동료에게 짧게 확인하기 · Marcus Adler", ScenarioID: "SCN-LOUNGE-00101"},
			{Kind: "boss", Name: "환자 이동용 리프트 장비 위치를 동료에게 물어 미리 익혀두기 · Rachel Boyd", ScenarioID: "SCN-LOUNGE-00102"},
		},
	},
	{
		Key: "지원동|2F|hardtosay", Name: "말하기 어려운 것",
		Building: "지원동", Floor: "2F", Where: "지원동 2F 의료진 휴게실",
		Steps: []Step{
			{Kind: "dlg", Name: "근무 시작 전 동료와 함께 무거운 환자 이동 계획을 미리 맞춰보기 · Walter Cortez", ScenarioID: "SCN-LOUNGE-00105"},
			{Kind: "dlg", Name: "인력이 부족한 시간대에 혼자 환자를 옮기라는 요청에 리프트 지원을 요청하기 · Teresa Cobb", ScenarioID: "SCN-LOUNGE-00108"},
			{Kind: "boss", Name: "개인보호구 재고가 부족한 것을 발견하고 담당 부서에 알리기 · Angela Brooks", ScenarioID: "SCN-LOUNGE-00104"},
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
