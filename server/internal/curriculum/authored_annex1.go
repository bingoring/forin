package curriculum

// 별관 1 (여성소아 센터) — 외래 → 소아 병동 → 분만·신생아 → 소아 중환자.
//
// Two of these floors hold two departments each. Their curricula carry the
// department as a prefix ("분만실 · …", "신생아실 · …") because the floor is
// genuinely two places, and because both banks contain a step literally titled
// 다학제 회진 인계 — without the prefix the floor would show the same row twice
// with nothing to tell them apart.
var annex1 = []Curriculum{
	// ── 1F 소아청소년·산부인과 외래 ─────────────────────────────────────
	{
		Key: "별관 1|1F|prenatal", Name: "산전과 산후",
		Building: "별관 1", Floor: "1F", Where: "별관 1 1F 소아청소년·산부인과 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "산전 진료 상담", ScenarioID: "SCN-WOMENKIDS-00101"},
			{Kind: "quiz", Name: "산전 관리 점검", ScenarioID: "QZ-WOMENKIDS-00004"},
			{Kind: "dlg", Name: "임신성 당뇨 교육", ScenarioID: "SCN-WOMENKIDS-00107"},
			{Kind: "dlg", Name: "모유수유 외래 상담", ScenarioID: "SCN-WOMENKIDS-00108"},
			{Kind: "boss", Name: "산후 우울 선별", ScenarioID: "SCN-WOMENKIDS-00102"},
		},
	},
	{
		Key: "별관 1|1F|womenhealth", Name: "여성 건강 상담",
		Building: "별관 1", Floor: "1F", Where: "별관 1 1F 소아청소년·산부인과 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "여성 건강 검진 안내", ScenarioID: "SCN-WOMENKIDS-00103"},
			{Kind: "dlg", Name: "피임 상담", ScenarioID: "SCN-WOMENKIDS-00104"},
			{Kind: "boss", Name: "청소년 건강 상담", ScenarioID: "SCN-WOMENKIDS-00109"},
		},
	},
	{
		Key: "별관 1|1F|withparent", Name: "아이를 데려온 보호자",
		Building: "별관 1", Floor: "1F", Where: "별관 1 1F 소아청소년·산부인과 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "소아 성장발달 상담", ScenarioID: "SCN-WOMENKIDS-00105"},
			{Kind: "dlg", Name: "소아 접종 일정 안내", ScenarioID: "SCN-WOMENKIDS-00106"},
			{Kind: "boss", Name: "외래 진료 인계", ScenarioID: "SCN-WOMENKIDS-00110"},
		},
	},

	// ── 2F 소아 일반 병동 ───────────────────────────────────────────────
	{
		Key: "별관 1|2F|meetchild", Name: "아이를 처음 만나면",
		Building: "별관 1", Floor: "2F", Where: "별관 1 2F 소아 일반 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "소아 통증 사정", ScenarioID: "SCN-PEDS-00108"},
			{Kind: "quiz", Name: "소아 탈수 사정", ScenarioID: "QZ-PEDS-00003"},
			{Kind: "dlg", Name: "아동 발열 부모 상담", ScenarioID: "SCN-PEDS-00101"},
			{Kind: "boss", Name: "채혈 전 아동 안심", ScenarioID: "SCN-PEDS-00105"},
		},
	},
	{
		Key: "별관 1|2F|teachparent", Name: "보호자 교육",
		Building: "별관 1", Floor: "2F", Where: "별관 1 2F 소아 일반 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "예방접종 이상반응 안내", ScenarioID: "SCN-PEDS-00102"},
			{Kind: "dlg", Name: "중이염 항생제 교육", ScenarioID: "SCN-PEDS-00106"},
			{Kind: "dlg", Name: "탈수 아동 수분 교육", ScenarioID: "SCN-PEDS-00104"},
			{Kind: "boss", Name: "퇴원 가정간호 교육", ScenarioID: "SCN-PEDS-00110"},
		},
	},
	{
		Key: "별관 1|2F|urgentchild", Name: "급한 아이와 겁먹은 보호자",
		Building: "별관 1", Floor: "2F", Where: "별관 1 2F 소아 일반 병동",
		Steps: []Step{
			{Kind: "event", Name: "낙상·머리 손상 관찰", ScenarioID: "SCN-PEDS-00107"},
			{Kind: "dlg", Name: "보호자 불안 공감", ScenarioID: "SCN-PEDS-00109"},
			{Kind: "boss", Name: "천식 발작 아동 진정", ScenarioID: "SCN-PEDS-00103"},
		},
	},

	// ── 3F 가족 분만실 · 신생아실 ───────────────────────────────────────
	{
		Key: "별관 1|3F|labor", Name: "분만실 · 진통과 함께",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "분만 계획 확인", ScenarioID: "SCN-LD-00108"},
			{Kind: "quiz", Name: "태아심박 감시 판독", ScenarioID: "QZ-LD-00001"},
			{Kind: "dlg", Name: "태아 심음 모니터 안내", ScenarioID: "SCN-LD-00103"},
			{Kind: "dlg", Name: "분만 진통 코칭", ScenarioID: "SCN-LD-00101"},
			{Kind: "boss", Name: "무통분만 설명", ScenarioID: "SCN-LD-00102"},
		},
	},
	{
		Key: "별관 1|3F|firsttouch", Name: "분만실 · 첫 접촉",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "신생아 첫 접촉 안내", ScenarioID: "SCN-LD-00107"},
			{Kind: "dlg", Name: "초기 모유수유 지원", ScenarioID: "SCN-LD-00106"},
			{Kind: "boss", Name: "분만 후 SBAR 인계", ScenarioID: "SCN-LD-00110"},
		},
	},
	{
		Key: "별관 1|3F|highrisk", Name: "분만실 · 고위험 분만",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "고위험 임신 모니터링", ScenarioID: "SCN-LD-00109"},
			{Kind: "dlg", Name: "제왕절개 준비 설명", ScenarioID: "SCN-LD-00104"},
			{Kind: "boss", Name: "산후 출혈 대응", ScenarioID: "SCN-LD-00105"},
		},
	},
	{
		Key: "별관 1|3F|newbornassess", Name: "신생아실 · 첫 사정",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "신생아 활력 사정", ScenarioID: "SCN-NURSERY-00101"},
			{Kind: "quiz", Name: "신생아 목욕 순서", ScenarioID: "QZ-NURSERY-00001"},
			{Kind: "dlg", Name: "신생아 체온 유지 안내", ScenarioID: "SCN-NURSERY-00108"},
			{Kind: "boss", Name: "신생아 황달 관찰 안내", ScenarioID: "SCN-NURSERY-00104"},
		},
	},
	{
		Key: "별관 1|3F|newbornteach", Name: "신생아실 · 부모 교육",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "제대 관리 교육", ScenarioID: "SCN-NURSERY-00103"},
			{Kind: "dlg", Name: "신생아 목욕 시연 교육", ScenarioID: "SCN-NURSERY-00102"},
			{Kind: "dlg", Name: "수유 방법 상담", ScenarioID: "SCN-NURSERY-00106"},
			{Kind: "boss", Name: "안전 수면 교육", ScenarioID: "SCN-NURSERY-00107"},
		},
	},
	{
		Key: "별관 1|3F|newborndischarge", Name: "신생아실 · 퇴원까지",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "신생아 대사 선별검사 설명", ScenarioID: "SCN-NURSERY-00105"},
			{Kind: "dlg", Name: "퇴원 신생아 확인", ScenarioID: "SCN-NURSERY-00109"},
			{Kind: "boss", Name: "신생아 인계", ScenarioID: "SCN-NURSERY-00110"},
		},
	},

	// ── 4F 신생아·소아 중환자실 ─────────────────────────────────────────
	{
		Key: "별관 1|4F|nicufamily", Name: "신생아중환자실 · 부모의 첫 시간",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "캥거루 케어 교육", ScenarioID: "SCN-NICU-00102"},
			{Kind: "quiz", Name: "미숙아 위험 징후", ScenarioID: "QZ-NICU-00001"},
			{Kind: "dlg", Name: "미숙아 부모 첫 안내", ScenarioID: "SCN-NICU-00101"},
			{Kind: "boss", Name: "부모 정서 지지", ScenarioID: "SCN-NICU-00109"},
		},
	},
	{
		Key: "별관 1|4F|nicugrow", Name: "신생아중환자실 · 자라는 아기",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "광선치료 안내", ScenarioID: "SCN-NICU-00105"},
			{Kind: "dlg", Name: "감염 예방 손위생 교육", ScenarioID: "SCN-NICU-00106"},
			{Kind: "dlg", Name: "수유량·성장 설명", ScenarioID: "SCN-NICU-00103"},
			{Kind: "boss", Name: "퇴원 전 부모 준비", ScenarioID: "SCN-NICU-00107"},
		},
	},
	{
		Key: "별관 1|4F|nicucritical", Name: "신생아중환자실 · 위태로운 순간",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "다학제 회진 인계", ScenarioID: "SCN-NICU-00110"},
			{Kind: "event", Name: "무호흡·서맥 알람 설명", ScenarioID: "SCN-NICU-00104"},
			{Kind: "boss", Name: "인공호흡 신생아 소통", ScenarioID: "SCN-NICU-00108"},
		},
	},
	{
		Key: "별관 1|4F|picufamily", Name: "소아중환자실 · 겁먹은 가족",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "형제자매 방문 지원", ScenarioID: "SCN-PICU-00106"},
			{Kind: "quiz", Name: "소아 활력 판독", ScenarioID: "QZ-PICU-00001"},
			{Kind: "dlg", Name: "회복 단계 격려", ScenarioID: "SCN-PICU-00108"},
			{Kind: "boss", Name: "중증 아동 부모 설명", ScenarioID: "SCN-PICU-00101"},
		},
	},
	{
		Key: "별관 1|4F|picusedation", Name: "소아중환자실 · 진정과 통증",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "소아 통증·진정 사정", ScenarioID: "SCN-PICU-00104"},
			{Kind: "dlg", Name: "소아 진정 관리", ScenarioID: "SCN-PICU-00102"},
			{Kind: "dlg", Name: "소아 수액·전해질 설명", ScenarioID: "SCN-PICU-00107"},
			{Kind: "boss", Name: "소아 호흡 보조 설명", ScenarioID: "SCN-PICU-00103"},
		},
	},
	{
		Key: "별관 1|4F|picucode", Name: "소아중환자실 · 코드와 인계",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "퇴실 전 가정 케어 교육", ScenarioID: "SCN-PICU-00109"},
			{Kind: "dlg", Name: "다학제 회진 인계", ScenarioID: "SCN-PICU-00110"},
			{Kind: "boss", Name: "소아 Code 대응", ScenarioID: "SCN-PICU-00105"},
		},
	},
}
