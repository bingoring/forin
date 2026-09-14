package curriculum

// 별관 2 (특수 치료 센터) — 재활 → 정신과 → 종양·이식 → 완화·노인.
var annex2 = []Curriculum{
	// ── 1F 재활치료실 ───────────────────────────────────────────────────
	{
		Key: "별관 2|1F|goals", Name: "다시 걷기 위한 목표",
		Building: "별관 2", Floor: "1F", Where: "별관 2 1F 재활치료실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 재활치료실", ScenarioID: "SCN-REHAB-00900"},
			{Kind: "dlg", Name: "마비측 팔의 부종과 통증을 확인하며 자세를 잡아 준다 · Helen Pruitt", ScenarioID: "SCN-REHAB-00104"},
			{Kind: "quiz", Name: "체중부하 상태 분류", ScenarioID: "QZ-REHAB-00001"},
			{Kind: "dlg", Name: "입원 첫날 환자에게 재활 병동 일과와 팀 구성을 설명한다 · Robert Hayes", ScenarioID: "SCN-REHAB-00101"},
			{Kind: "boss", Name: "편마비 환자의 아침 기상과 세면을 곁에서 돕는다 · Gloria Tan", ScenarioID: "SCN-REHAB-00102"},
		},
	},
	{
		Key: "별관 2|1F|daily", Name: "일상으로 돌아가기",
		Building: "별관 2", Floor: "1F", Where: "별관 2 1F 재활치료실",
		Steps: []Step{
			{Kind: "dlg", Name: "마비측을 계속 쓰도록 격려하며 constraint 훈련 취지를 설명한다 · Leonard Foss", ScenarioID: "SCN-REHAB-00108"},
			{Kind: "dlg", Name: "회복이 더디다고 느끼는 환자의 좌절을 들어 준다 · Denise Carver", ScenarioID: "SCN-REHAB-00107"},
			{Kind: "dlg", Name: "회복 경과를 조심스레 묻는 환자에게 답한다 · Frank Delgado", ScenarioID: "SCN-REHAB-00105"},
			{Kind: "boss", Name: "오늘의 재활 치료 일정(PT/OT)을 환자에게 안내한다 · Walter Boyd", ScenarioID: "SCN-REHAB-00103"},
		},
	},
	{
		Key: "별관 2|1F|confidence", Name: "무너진 자신감",
		Building: "별관 2", Floor: "1F", Where: "별관 2 1F 재활치료실",
		Steps: []Step{
			{Kind: "dlg", Name: "재활 목표를 환자와 함께 현실적으로 조정한다 · Gerald Aoki", ScenarioID: "SCN-REHAB-00110"},
			{Kind: "dlg", Name: "삼킴 검사 전 금식(NPO) 이유를 환자에게 설명한다 · Arthur Quinn", ScenarioID: "SCN-REHAB-00106"},
			{Kind: "boss", Name: "무시증후군(neglect)으로 왼쪽을 못 챙기는 환자를 재교육한다 · Marion Selby", ScenarioID: "SCN-REHAB-00109"},
		},
	},

	// ── 2F 정신과 병동 ──────────────────────────────────────────────────
	{
		Key: "별관 2|2F|rapport", Name: "신뢰를 만드는 대화",
		Building: "별관 2", Floor: "2F", Where: "별관 2 2F 정신과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 정신과병동", ScenarioID: "SCN-PSYCH-00900"},
			{Kind: "dlg", Name: "집단치료 안내", ScenarioID: "SCN-PSYCH-00005"},
			{Kind: "quiz", Name: "치료적 의사소통", ScenarioID: "QZ-PSYCH-00001"},
			{Kind: "dlg", Name: "우울 환자 면담", ScenarioID: "SCN-PSYCH-00002"},
			{Kind: "boss", Name: "투약 거부 대응", ScenarioID: "SCN-PSYCH-00003"},
		},
	},
	{
		Key: "별관 2|2F|crisis", Name: "위기의 순간",
		Building: "별관 2", Floor: "2F", Where: "별관 2 2F 정신과 병동",
		Steps: []Step{
			{Kind: "event", Name: "불안발작 대응", ScenarioID: "SCN-PSYCH-00004"},
			{Kind: "event", Name: "환청 환자 대응", ScenarioID: "SCN-PSYCH-00008"},
			{Kind: "boss", Name: "조증 환자 대응", ScenarioID: "SCN-PSYCH-00007"},
		},
	},
	{
		Key: "별관 2|2F|safety", Name: "안전 계획과 연계",
		Building: "별관 2", Floor: "2F", Where: "별관 2 2F 정신과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "자해 상처 관리", ScenarioID: "SCN-PSYCH-00009"},
			{Kind: "dlg", Name: "퇴원 계획 상담", ScenarioID: "SCN-PSYCH-00006"},
			{Kind: "dlg", Name: "가족 심리교육", ScenarioID: "SCN-PSYCH-00012"},
			{Kind: "boss", Name: "정신과 입원 안전 사정", ScenarioID: "SCN-PSYCH-00001"},
		},
	},

	// ── 3F 종양학 병동 · 이식실 ─────────────────────────────────────────
	{
		Key: "별관 2|3F|sideeffects", Name: "치료의 부작용",
		Building: "별관 2", Floor: "3F", Where: "별관 2 3F 종양학 병동 · 이식실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 종양내과", ScenarioID: "SCN-ONCO-00900"},
			{Kind: "dlg", Name: "골수이식 격리 안내", ScenarioID: "SCN-ONCO-00001"},
			{Kind: "quiz", Name: "호중구감소 격리 수칙", ScenarioID: "QZ-ONCO-00002"},
			{Kind: "dlg", Name: "항암 부작용 상담", ScenarioID: "SCN-ONCO-00002"},
			{Kind: "boss", Name: "중심정맥관 관리 교육", ScenarioID: "SCN-ONCO-00003"},
		},
	},
	{
		Key: "별관 2|3F|treatment", Name: "치료를 이어가는 몸",
		Building: "별관 2", Floor: "3F", Where: "별관 2 3F 종양학 병동 · 이식실",
		Steps: []Step{
			{Kind: "dlg", Name: "방사선치료 안내", ScenarioID: "SCN-ONCO-00004"},
			{Kind: "dlg", Name: "탈모 상담", ScenarioID: "SCN-ONCO-00005"},
			{Kind: "dlg", Name: "면역항암 부작용 교육", ScenarioID: "SCN-ONCO-00006"},
			{Kind: "boss", Name: "오심·구토 관리", ScenarioID: "SCN-ONCO-00007"},
		},
	},
	{
		Key: "별관 2|3F|goalstalk", Name: "어디까지 갈 것인가",
		Building: "별관 2", Floor: "3F", Where: "별관 2 3F 종양학 병동 · 이식실",
		Steps: []Step{
			{Kind: "dlg", Name: "암성 통증 관리", ScenarioID: "SCN-ONCO-00008"},
			{Kind: "dlg", Name: "임상시험 설명", ScenarioID: "SCN-ONCO-00009"},
			{Kind: "boss", Name: "항암 영양 상담", ScenarioID: "SCN-ONCO-00010"},
		},
	},

	// ── 4F 완화의료 · 노인성 질환 병동 ──────────────────────────────────
	{
		Key: "별관 2|4F|hospicecomfort", Name: "호스피스 · 편안하게 하는 일",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 호스피스", ScenarioID: "SCN-HOSPICE-00900"},
			{Kind: "dlg", Name: "통증이 조절되지 않아 기저 용량 증량을 상의 · Grace Okonkwo", ScenarioID: "SCN-HOSPICE-00107"},
			{Kind: "quiz", Name: "완화 케어 원칙", ScenarioID: "QZ-HOSPICE-00001"},
			{Kind: "dlg", Name: "오피오이드 흔한 부작용인 변비와 졸음을 사전 설명 · Nadia Osei", ScenarioID: "SCN-HOSPICE-00105"},
			{Kind: "boss", Name: "0-10 통증 점수를 환자에게 묻고 기록 · Rosa Iniguez", ScenarioID: "SCN-HOSPICE-00102"},
		},
	},
	{
		Key: "별관 2|4F|hospicetalk", Name: "호스피스 · 어려운 대화",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "통증 일지 작성법을 가족에게 교육 · Diane Whitlock", ScenarioID: "SCN-HOSPICE-00104"},
			{Kind: "dlg", Name: "서방형 모르핀 복용 일정을 안내 · Harold Beckett", ScenarioID: "SCN-HOSPICE-00103"},
			{Kind: "boss", Name: "다음 진통제 투여 시간을 묻는 환자에게 응대 · Louis Tanaka", ScenarioID: "SCN-HOSPICE-00106"},
		},
	},
	{
		Key: "별관 2|4F|hospiceend", Name: "호스피스 · 마지막과 그 후",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "event", Name: "오피오이드 중독을 우려해 복용을 꺼리는 환자를 안심 · Walter Kim", ScenarioID: "SCN-HOSPICE-00108"},
			{Kind: "dlg", Name: "돌발통 구제약 사용 빈도를 검토해 용량을 적정 · Estelle Byrne", ScenarioID: "SCN-HOSPICE-00109"},
			{Kind: "dlg", Name: "신기능 저하 환자의 약물 전환 필요성을 설명 · Raymond Voss", ScenarioID: "SCN-HOSPICE-00110"},
			{Kind: "boss", Name: "통증 부위와 양상을 처음 사정하며 통증 척도를 설명 · Frank Delgado", ScenarioID: "SCN-HOSPICE-00101"},
		},
	},
	{
		Key: "별관 2|4F|gerisafety", Name: "노인병동 · 넘어지지 않게",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 노인병동", ScenarioID: "SCN-GERI-00900"},
			{Kind: "dlg", Name: "치매 환자 지남력 사정", ScenarioID: "SCN-GERI-00001"},
			{Kind: "quiz", Name: "낙상 예방 중재", ScenarioID: "QZ-GERI-00001"},
			{Kind: "dlg", Name: "야간 섬망 진정", ScenarioID: "SCN-GERI-00002"},
			{Kind: "boss", Name: "다약제 복용 검토", ScenarioID: "SCN-GERI-00003"},
		},
	},
	{
		Key: "별관 2|4F|gerimind", Name: "노인병동 · 흐려지는 기억",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "욕창 예방 교육", ScenarioID: "SCN-GERI-00004"},
			{Kind: "dlg", Name: "연하곤란 식이 안내", ScenarioID: "SCN-GERI-00005"},
			{Kind: "boss", Name: "요실금 관리 교육", ScenarioID: "SCN-GERI-00006"},
		},
	},
	{
		Key: "별관 2|4F|geridignity", Name: "노인병동 · 존엄을 지키는 손",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "낙상 후 평가", ScenarioID: "SCN-GERI-00007"},
			{Kind: "dlg", Name: "노인 우울 선별", ScenarioID: "SCN-GERI-00008"},
			{Kind: "dlg", Name: "난청 환자 소통", ScenarioID: "SCN-GERI-00009"},
			{Kind: "boss", Name: "보호자 소진 지지", ScenarioID: "SCN-GERI-00010"},
		},
	},
}
