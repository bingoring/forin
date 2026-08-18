package curriculum

// 별관 2 (특수 치료 센터) — 재활 → 정신과 → 종양·이식 → 완화·노인.
var annex2 = []Curriculum{
	// ── 1F 재활치료실 ───────────────────────────────────────────────────
	{
		Key: "별관 2|1F|goals", Name: "다시 걷기 위한 목표",
		Building: "별관 2", Floor: "1F", Where: "별관 2 1F 재활치료실",
		Steps: []Step{
			{Kind: "dlg", Name: "보조기구 사용 교육", ScenarioID: "SCN-REHAB-00104"},
			{Kind: "quiz", Name: "체중부하 상태 분류", ScenarioID: "QZ-REHAB-00001"},
			{Kind: "dlg", Name: "재활 목표 설정", ScenarioID: "SCN-REHAB-00101"},
			{Kind: "boss", Name: "보행 훈련 지원", ScenarioID: "SCN-REHAB-00102"},
		},
	},
	{
		Key: "별관 2|1F|daily", Name: "일상으로 돌아가기",
		Building: "별관 2", Floor: "1F", Where: "별관 2 1F 재활치료실",
		Steps: []Step{
			{Kind: "dlg", Name: "가정 운동 프로그램 교육", ScenarioID: "SCN-REHAB-00108"},
			{Kind: "dlg", Name: "일상생활동작 훈련", ScenarioID: "SCN-REHAB-00107"},
			{Kind: "dlg", Name: "통증·피로 조절 상담", ScenarioID: "SCN-REHAB-00105"},
			{Kind: "boss", Name: "뇌졸중 후 재활 교육", ScenarioID: "SCN-REHAB-00103"},
		},
	},
	{
		Key: "별관 2|1F|confidence", Name: "무너진 자신감",
		Building: "별관 2", Floor: "1F", Where: "별관 2 1F 재활치료실",
		Steps: []Step{
			{Kind: "dlg", Name: "재활팀 인계", ScenarioID: "SCN-REHAB-00110"},
			{Kind: "dlg", Name: "낙상 후 자신감 회복", ScenarioID: "SCN-REHAB-00106"},
			{Kind: "boss", Name: "가족 돌봄 훈련", ScenarioID: "SCN-REHAB-00109"},
		},
	},

	// ── 2F 정신과 병동 ──────────────────────────────────────────────────
	{
		Key: "별관 2|2F|rapport", Name: "신뢰를 만드는 대화",
		Building: "별관 2", Floor: "2F", Where: "별관 2 2F 정신과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "집단 프로그램 참여 격려", ScenarioID: "SCN-PSYCH-00108"},
			{Kind: "quiz", Name: "치료적 의사소통", ScenarioID: "QZ-PSYCH-00001"},
			{Kind: "dlg", Name: "치료적 관계 형성", ScenarioID: "SCN-PSYCH-00103"},
			{Kind: "boss", Name: "복약 거부 상담", ScenarioID: "SCN-PSYCH-00104"},
		},
	},
	{
		Key: "별관 2|2F|crisis", Name: "위기의 순간",
		Building: "별관 2", Floor: "2F", Where: "별관 2 2F 정신과 병동",
		Steps: []Step{
			{Kind: "event", Name: "불안 발작 진정", ScenarioID: "SCN-PSYCH-00106"},
			{Kind: "event", Name: "환청 대응", ScenarioID: "SCN-PSYCH-00105"},
			{Kind: "boss", Name: "위기 환자 디에스컬레이션", ScenarioID: "SCN-PSYCH-00101"},
		},
	},
	{
		Key: "별관 2|2F|safety", Name: "안전 계획과 연계",
		Building: "별관 2", Floor: "2F", Where: "별관 2 2F 정신과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "안전 계획 수립", ScenarioID: "SCN-PSYCH-00107"},
			{Kind: "dlg", Name: "퇴원 후 연계 계획", ScenarioID: "SCN-PSYCH-00109"},
			{Kind: "dlg", Name: "정신과 병동 인계", ScenarioID: "SCN-PSYCH-00110"},
			{Kind: "boss", Name: "자살 위험 사정", ScenarioID: "SCN-PSYCH-00102"},
		},
	},

	// ── 3F 종양학 병동 · 이식실 ─────────────────────────────────────────
	{
		Key: "별관 2|3F|sideeffects", Name: "치료의 부작용",
		Building: "별관 2", Floor: "3F", Where: "별관 2 3F 종양학 병동 · 이식실",
		Steps: []Step{
			{Kind: "dlg", Name: "영양·식욕부진 상담", ScenarioID: "SCN-ONCO-00106"},
			{Kind: "quiz", Name: "호중구감소 격리 수칙", ScenarioID: "QZ-ONCO-00002"},
			{Kind: "dlg", Name: "항암 부작용 상담", ScenarioID: "SCN-ONCO-00101"},
			{Kind: "boss", Name: "통증 관리 상담", ScenarioID: "SCN-ONCO-00105"},
		},
	},
	{
		Key: "별관 2|3F|treatment", Name: "치료를 이어가는 몸",
		Building: "별관 2", Floor: "3F", Where: "별관 2 3F 종양학 병동 · 이식실",
		Steps: []Step{
			{Kind: "dlg", Name: "중심정맥관 관리 교육", ScenarioID: "SCN-ONCO-00102"},
			{Kind: "dlg", Name: "방사선치료 안내", ScenarioID: "SCN-ONCO-00104"},
			{Kind: "dlg", Name: "임상시험 정보 안내", ScenarioID: "SCN-ONCO-00108"},
			{Kind: "boss", Name: "골수이식 격리 안내", ScenarioID: "SCN-ONCO-00103"},
		},
	},
	{
		Key: "별관 2|3F|goalstalk", Name: "어디까지 갈 것인가",
		Building: "별관 2", Floor: "3F", Where: "별관 2 3F 종양학 병동 · 이식실",
		Steps: []Step{
			{Kind: "dlg", Name: "종양내과 인계", ScenarioID: "SCN-ONCO-00110"},
			{Kind: "dlg", Name: "가족 돌봄자 지지", ScenarioID: "SCN-ONCO-00109"},
			{Kind: "boss", Name: "치료 목표 상담", ScenarioID: "SCN-ONCO-00107"},
		},
	},

	// ── 4F 완화의료 · 노인성 질환 병동 ──────────────────────────────────
	{
		Key: "별관 2|4F|hospicecomfort", Name: "호스피스 · 편안하게 하는 일",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "편안한 환경 조성", ScenarioID: "SCN-HOSPICE-00107"},
			{Kind: "quiz", Name: "완화 케어 원칙", ScenarioID: "QZ-HOSPICE-00001"},
			{Kind: "dlg", Name: "영적·정서 돌봄 연계", ScenarioID: "SCN-HOSPICE-00105"},
			{Kind: "boss", Name: "통증·증상 완화 설명", ScenarioID: "SCN-HOSPICE-00102"},
		},
	},
	{
		Key: "별관 2|4F|hospicetalk", Name: "호스피스 · 어려운 대화",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "임종 징후 교육", ScenarioID: "SCN-HOSPICE-00104"},
			{Kind: "dlg", Name: "사전연명의료 대화", ScenarioID: "SCN-HOSPICE-00103"},
			{Kind: "boss", Name: "가족 예기 슬픔 지지", ScenarioID: "SCN-HOSPICE-00106"},
		},
	},
	{
		Key: "별관 2|4F|hospiceend", Name: "호스피스 · 마지막과 그 후",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "event", Name: "증상 급변 대응", ScenarioID: "SCN-HOSPICE-00108"},
			{Kind: "dlg", Name: "사별 후 안내", ScenarioID: "SCN-HOSPICE-00109"},
			{Kind: "dlg", Name: "완화의료팀 인계", ScenarioID: "SCN-HOSPICE-00110"},
			{Kind: "boss", Name: "임종 돌봄 가족 지지", ScenarioID: "SCN-HOSPICE-00101"},
		},
	},
	{
		Key: "별관 2|4F|gerisafety", Name: "노인병동 · 넘어지지 않게",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "피부·욕창 예방", ScenarioID: "SCN-GERI-00106"},
			{Kind: "quiz", Name: "낙상 예방 중재", ScenarioID: "QZ-GERI-00001"},
			{Kind: "dlg", Name: "낙상 예방 교육", ScenarioID: "SCN-GERI-00101"},
			{Kind: "boss", Name: "연하곤란 식이 교육", ScenarioID: "SCN-GERI-00105"},
		},
	},
	{
		Key: "별관 2|4F|gerimind", Name: "노인병동 · 흐려지는 기억",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "치매 환자 재지남", ScenarioID: "SCN-GERI-00102"},
			{Kind: "dlg", Name: "고립·우울 선별", ScenarioID: "SCN-GERI-00109"},
			{Kind: "boss", Name: "섬망 예방 케어", ScenarioID: "SCN-GERI-00104"},
		},
	},
	{
		Key: "별관 2|4F|geridignity", Name: "노인병동 · 존엄을 지키는 손",
		Building: "별관 2", Floor: "4F", Where: "별관 2 4F 완화의료 · 노인성 질환 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "요실금 존엄 케어", ScenarioID: "SCN-GERI-00108"},
			{Kind: "dlg", Name: "노인병동 인계", ScenarioID: "SCN-GERI-00110"},
			{Kind: "dlg", Name: "다약제 검토 상담", ScenarioID: "SCN-GERI-00103"},
			{Kind: "boss", Name: "가족 돌봄 계획 상담", ScenarioID: "SCN-GERI-00107"},
		},
	},
}
