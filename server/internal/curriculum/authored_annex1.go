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
			{Kind: "dlg", Name: "첫 인사 · 여성소아외래", ScenarioID: "SCN-WOMENKIDS-00900"},
			{Kind: "dlg", Name: "산모 이름과 생년월일로 본인 확인하기 · Maria Lopez", ScenarioID: "SCN-WOMENKIDS-00101"},
			{Kind: "quiz", Name: "산전 관리 점검", ScenarioID: "QZ-WOMENKIDS-00004"},
			{Kind: "dlg", Name: "체중 기반 소아 약 용량 재확인하기 · Megan Foster", ScenarioID: "SCN-WOMENKIDS-00107"},
			{Kind: "dlg", Name: "임신 중 복용 가능 약물 확인하기 · Hannah Wright", ScenarioID: "SCN-WOMENKIDS-00108"},
			{Kind: "boss", Name: "소아 환자 팔찌 정보 확인하기 · Ashley Brooks", ScenarioID: "SCN-WOMENKIDS-00102"},
		},
	},
	{
		Key: "별관 1|1F|womenhealth", Name: "여성 건강 상담",
		Building: "별관 1", Floor: "1F", Where: "별관 1 1F 소아청소년·산부인과 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "약 이름과 용량을 소리 내어 확인하기 · Nicole Adams", ScenarioID: "SCN-WOMENKIDS-00103"},
			{Kind: "dlg", Name: "알레르기 여부 묻기 · Sofia Reyes", ScenarioID: "SCN-WOMENKIDS-00104"},
			{Kind: "boss", Name: "두 아이가 같은 이름일 때 구분해 확인하기 · Laura Bennett", ScenarioID: "SCN-WOMENKIDS-00109"},
		},
	},
	{
		Key: "별관 1|1F|withparent", Name: "아이를 데려온 보호자",
		Building: "별관 1", Floor: "1F", Where: "별관 1 1F 소아청소년·산부인과 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "채혈 전 검사 항목 설명하기 · Emily Carter", ScenarioID: "SCN-WOMENKIDS-00105"},
			{Kind: "dlg", Name: "예방접종 전 아이 이름 확인하기 · Rachel Kim", ScenarioID: "SCN-WOMENKIDS-00106"},
			{Kind: "boss", Name: "수유 중 복용 약물 안전성 확인하기 · Olivia Turner", ScenarioID: "SCN-WOMENKIDS-00110"},
		},
	},

	// ── 2F 소아 일반 병동 ───────────────────────────────────────────────
	{
		Key: "별관 1|2F|meetchild", Name: "아이를 처음 만나면",
		Building: "별관 1", Floor: "2F", Where: "별관 1 2F 소아 일반 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 소아병동", ScenarioID: "SCN-PEDS-00900"},
			{Kind: "dlg", Name: "우는 아이 달래기", ScenarioID: "SCN-PEDS-00001"},
			{Kind: "quiz", Name: "소아 탈수 사정", ScenarioID: "QZ-PEDS-00003"},
			{Kind: "dlg", Name: "학령기 소아 통증 사정", ScenarioID: "SCN-PEDS-00014"},
			{Kind: "boss", Name: "발열 아동 진단", ScenarioID: "SCN-PEDS-00003"},
		},
	},
	{
		Key: "별관 1|2F|teachparent", Name: "보호자 교육",
		Building: "별관 1", Floor: "2F", Where: "별관 1 2F 소아 일반 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "예방접종 이상반응", ScenarioID: "SCN-PEDS-00013"},
			{Kind: "dlg", Name: "중이염 상담", ScenarioID: "SCN-PEDS-00009"},
			{Kind: "dlg", Name: "소아 탈수 사정", ScenarioID: "SCN-PEDS-00006"},
			{Kind: "boss", Name: "퇴원 회복 교육", ScenarioID: "SCN-PEDS-00640"},
		},
	},
	{
		Key: "별관 1|2F|urgentchild", Name: "급한 아이와 겁먹은 보호자",
		Building: "별관 1", Floor: "2F", Where: "별관 1 2F 소아 일반 병동",
		Steps: []Step{
			{Kind: "event", Name: "열성경련 대응", ScenarioID: "SCN-PEDS-00007"},
			{Kind: "dlg", Name: "불안한 부모 안심", ScenarioID: "SCN-PEDS-00004"},
			{Kind: "boss", Name: "소아 천식 발작", ScenarioID: "SCN-PEDS-00012"},
		},
	},

	// ── 3F 가족 분만실 · 신생아실 ───────────────────────────────────────
	{
		Key: "별관 1|3F|labor", Name: "분만실 · 진통과 함께",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 분만실", ScenarioID: "SCN-LD-00900"},
			{Kind: "dlg", Name: "진통 초기 사정", ScenarioID: "SCN-LD-00007"},
			{Kind: "quiz", Name: "태아심박 감시 판독", ScenarioID: "QZ-LD-00001"},
			{Kind: "dlg", Name: "무통분만(경막외) 안내", ScenarioID: "SCN-LD-00002"},
			{Kind: "dlg", Name: "분만 호흡·이완 코칭", ScenarioID: "SCN-LD-00009"},
			{Kind: "boss", Name: "분만 진행 코칭", ScenarioID: "SCN-LD-00001"},
		},
	},
	{
		Key: "별관 1|3F|firsttouch", Name: "분만실 · 첫 접촉",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "신생아 첫 대면(황금시간)", ScenarioID: "SCN-LD-00006"},
			{Kind: "dlg", Name: "초기 수유 개시 지원", ScenarioID: "SCN-LD-00801"},
			{Kind: "boss", Name: "분만실 회복실 인계", ScenarioID: "SCN-LD-00822"},
		},
	},
	{
		Key: "별관 1|3F|highrisk", Name: "분만실 · 고위험 분만",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "임신성 고혈압 관찰", ScenarioID: "SCN-LD-00012"},
			{Kind: "dlg", Name: "제왕절개 전 준비", ScenarioID: "SCN-LD-00005"},
			{Kind: "boss", Name: "산후 출혈 대응", ScenarioID: "SCN-LD-00003"},
		},
	},
	{
		Key: "별관 1|3F|newbornassess", Name: "신생아실 · 첫 사정",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 신생아실", ScenarioID: "SCN-NURSERY-00900"},
			{Kind: "dlg", Name: "신생아 팔찌와 산모 팔찌 번호를 대조하며 확인하기 · Jessica Anderson", ScenarioID: "SCN-NURSERY-00101"},
			{Kind: "quiz", Name: "신생아 목욕 순서", ScenarioID: "QZ-NURSERY-00001"},
			{Kind: "dlg", Name: "형제가 아기를 안으려 할 때 앉은 자세에서만 안도록 지도하기 · Nicole Carter", ScenarioID: "SCN-NURSERY-00108"},
			{Kind: "boss", Name: "손 위생을 마친 뒤 아기를 안아 올리기 · Sarah Ballard", ScenarioID: "SCN-NURSERY-00104"},
		},
	},
	{
		Key: "별관 1|3F|newbornteach", Name: "신생아실 · 부모 교육",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "아기를 바구니 침대에 눕힐 때 난간을 올려 고정하기 · Megan Cole", ScenarioID: "SCN-NURSERY-00103"},
			{Kind: "dlg", Name: "아기를 산모에게 건네기 전 이름과 생년월일 확인하기 · Amanda Baker", ScenarioID: "SCN-NURSERY-00102"},
			{Kind: "dlg", Name: "아기 침대 옆에서 두 명 확인 투약 원칙 안내하기 · Christina Brooks", ScenarioID: "SCN-NURSERY-00106"},
			{Kind: "boss", Name: "산모가 잠든 사이 아기가 침대에서 미끄러지지 않도록 자세 조정하기 · Heather Chapman", ScenarioID: "SCN-NURSERY-00107"},
		},
	},
	{
		Key: "별관 1|3F|newborndischarge", Name: "신생아실 · 퇴원까지",
		Building: "별관 1", Floor: "3F", Where: "별관 1 3F 가족 분만실 · 신생아실",
		Steps: []Step{
			{Kind: "dlg", Name: "신생아실 출입 시 방문객의 신분 확인 요청하기 · Robert Archer", ScenarioID: "SCN-NURSERY-00105"},
			{Kind: "dlg", Name: "보안 팔찌 경보가 울렸을 때 출입문 봉쇄 절차 설명하기 · Amy Christensen", ScenarioID: "SCN-NURSERY-00109"},
			{Kind: "boss", Name: "산모가 아기를 안고 졸 때 낙상 위험을 부드럽게 알리기 · Rachel Cross", ScenarioID: "SCN-NURSERY-00110"},
		},
	},

	// ── 4F 신생아·소아 중환자실 ─────────────────────────────────────────
	{
		Key: "별관 1|4F|nicufamily", Name: "신생아중환자실 · 부모의 첫 시간",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 신생아중환자실", ScenarioID: "SCN-NICU-00900"},
			{Kind: "dlg", Name: "캥거루 케어 첫 시도", ScenarioID: "SCN-NICU-00003"},
			{Kind: "quiz", Name: "미숙아 위험 징후", ScenarioID: "QZ-NICU-00001"},
			{Kind: "dlg", Name: "미숙아 부모 상담", ScenarioID: "SCN-NICU-00001"},
			{Kind: "boss", Name: "부모 정서 위기 지원", ScenarioID: "SCN-NICU-00582"},
		},
	},
	{
		Key: "별관 1|4F|nicugrow", Name: "신생아중환자실 · 자라는 아기",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "광선치료 소개", ScenarioID: "SCN-NICU-00145"},
			{Kind: "dlg", Name: "미숙아 위관 영양 안내", ScenarioID: "SCN-NICU-00002"},
			{Kind: "dlg", Name: "수유 진전 상담", ScenarioID: "SCN-NICU-00005"},
			{Kind: "boss", Name: "NICU 퇴원 준비 교육", ScenarioID: "SCN-NICU-00006"},
		},
	},
	{
		Key: "별관 1|4F|nicucritical", Name: "신생아중환자실 · 위태로운 순간",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "미숙아 산소 관리 안내", ScenarioID: "SCN-NICU-00004"},
			{Kind: "event", Name: "미숙아 감염 관찰", ScenarioID: "SCN-NICU-00007"},
			{Kind: "boss", Name: "급변 상황 인계", ScenarioID: "SCN-NICU-00833"},
		},
	},
	{
		Key: "별관 1|4F|picufamily", Name: "소아중환자실 · 겁먹은 가족",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 소아중환자실", ScenarioID: "SCN-PICU-00900"},
			{Kind: "dlg", Name: "형제 지지 대화", ScenarioID: "SCN-PICU-00012"},
			{Kind: "quiz", Name: "소아 활력 판독", ScenarioID: "QZ-PICU-00001"},
			{Kind: "dlg", Name: "소아 재활 첫 시작", ScenarioID: "SCN-PICU-00006"},
			{Kind: "boss", Name: "중환 소아 부모 설명", ScenarioID: "SCN-PICU-00001"},
		},
	},
	{
		Key: "별관 1|4F|picusedation", Name: "소아중환자실 · 진정과 통증",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "소아 통증 사정", ScenarioID: "SCN-PICU-00003"},
			{Kind: "dlg", Name: "소아 진정 관찰 설명", ScenarioID: "SCN-PICU-00007"},
			{Kind: "dlg", Name: "소아 진통제 안내", ScenarioID: "SCN-PICU-00010"},
			{Kind: "boss", Name: "소아 인공호흡기 관리 설명", ScenarioID: "SCN-PICU-00008"},
		},
	},
	{
		Key: "별관 1|4F|picucode", Name: "소아중환자실 · 코드와 인계",
		Building: "별관 1", Floor: "4F", Where: "별관 1 4F 신생아·소아 중환자실",
		Steps: []Step{
			{Kind: "dlg", Name: "가족 중심 회진 참여 안내", ScenarioID: "SCN-PICU-00009"},
			{Kind: "dlg", Name: "밤샘 부모 지지", ScenarioID: "SCN-PICU-00005"},
			{Kind: "boss", Name: "소아 인공호흡기 이탈", ScenarioID: "SCN-PICU-00002"},
		},
	},
}
