package curriculum

// 별관 3 (진단·검사 센터) — 영상 → 특수 외래 → 주사·투석 → 내시경·조영.
//
// The floors here share one shape the wards do not: the encounter is short. A
// patient meets you once, is frightened of a machine, and leaves. The curricula
// are named for that — 불안, 준비, 반복 — rather than for a disease course.
var annex3 = []Curriculum{
	// ── 1F 영상의학과 ───────────────────────────────────────────────────
	{
		Key: "별관 3|1F|scanfear", Name: "기계 앞에서 겁먹은 사람",
		Building: "별관 3", Floor: "1F", Where: "별관 3 1F 영상의학과",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 영상의학과", ScenarioID: "SCN-RAD-00900"},
			{Kind: "dlg", Name: "장비 소음 예고 · Kevin Doyle", ScenarioID: "SCN-RAD-00104"},
			{Kind: "quiz", Name: "MRI 반입 금지 확인", ScenarioID: "QZ-RAD-00002"},
			{Kind: "dlg", Name: "막연한 공포 경청 · Rachel Nolan", ScenarioID: "SCN-RAD-00107"},
			{Kind: "boss", Name: "검사 소요 시간 · Donna Pearce", ScenarioID: "SCN-RAD-00102"},
		},
	},
	{
		Key: "별관 3|1F|scanprep", Name: "검사 전에 확인할 것",
		Building: "별관 3", Floor: "1F", Where: "별관 3 1F 영상의학과",
		Steps: []Step{
			{Kind: "dlg", Name: "정지 지시 이유 · Frank Mercer", ScenarioID: "SCN-RAD-00105"},
			{Kind: "dlg", Name: "첫 CT 안내 · Gary Whitfield", ScenarioID: "SCN-RAD-00101"},
			{Kind: "dlg", Name: "과거 검사 트라우마 · Dale Foster", ScenarioID: "SCN-RAD-00108"},
			{Kind: "boss", Name: "검사복 환복 · Sylvia Grant", ScenarioID: "SCN-RAD-00103"},
		},
	},
	{
		Key: "별관 3|1F|scanafter", Name: "검사가 끝난 뒤",
		Building: "별관 3", Floor: "1F", Where: "별관 3 1F 영상의학과",
		Steps: []Step{
			{Kind: "dlg", Name: "호출벨 사용법 · Eleanor Briggs", ScenarioID: "SCN-RAD-00106"},
			{Kind: "dlg", Name: "대기 지연 설명 · Ronald Pike", ScenarioID: "SCN-RAD-00110"},
			{Kind: "boss", Name: "통증 여부 질문 · Amber Wells", ScenarioID: "SCN-RAD-00109"},
		},
	},

	// ── 2F 특수 외래 ────────────────────────────────────────────────────
	{
		Key: "별관 3|2F|firstvisit", Name: "처음 온 환자",
		Building: "별관 3", Floor: "2F", Where: "별관 3 2F 특수 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 특수외래", ScenarioID: "SCN-SPECIALTY-00900"},
			{Kind: "dlg", Name: "검사 준비 안내", ScenarioID: "SCN-SPECIALTY-00107"},
			{Kind: "quiz", Name: "안과·이비인후과 용어", ScenarioID: "QZ-SPECIALTY-00001"},
			{Kind: "dlg", Name: "전문 클리닉 연계 안내", ScenarioID: "SCN-SPECIALTY-00104"},
			{Kind: "boss", Name: "신규 진단 설명", ScenarioID: "SCN-SPECIALTY-00102"},
		},
	},
	{
		Key: "별관 3|2F|keepgoing", Name: "계속 오게 만드는 일",
		Building: "별관 3", Floor: "2F", Where: "별관 3 2F 특수 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "복약 순응 코칭", ScenarioID: "SCN-SPECIALTY-00103"},
			{Kind: "dlg", Name: "환자 자기관리 성취 격려", ScenarioID: "SCN-SPECIALTY-00109"},
			{Kind: "dlg", Name: "생활습관 변화 상담", ScenarioID: "SCN-SPECIALTY-00106"},
			{Kind: "boss", Name: "만성질환 관리 상담", ScenarioID: "SCN-SPECIALTY-00101"},
		},
	},
	{
		Key: "별관 3|2F|worsening", Name: "나빠지는 신호",
		Building: "별관 3", Floor: "2F", Where: "별관 3 2F 특수 외래",
		Steps: []Step{
			{Kind: "dlg", Name: "외래 인계", ScenarioID: "SCN-SPECIALTY-00110"},
			{Kind: "dlg", Name: "통증 클리닉 상담", ScenarioID: "SCN-SPECIALTY-00108"},
			{Kind: "boss", Name: "증상 악화 조기 대응 교육", ScenarioID: "SCN-SPECIALTY-00105"},
		},
	},

	// ── 3F 외래 주사센터 · 인공신장실 ───────────────────────────────────
	{
		Key: "별관 3|3F|infusionstart", Name: "주사센터 · 주입을 시작하며",
		Building: "별관 3", Floor: "3F", Where: "별관 3 3F 외래 주사센터 · 인공신장실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 주사센터", ScenarioID: "SCN-INFUSION-00900"},
			{Kind: "dlg", Name: "주입 일정 조율", ScenarioID: "SCN-INFUSION-00108"},
			{Kind: "quiz", Name: "수액 펌프 세팅 점검", ScenarioID: "QZ-INFUSION-00001"},
			{Kind: "dlg", Name: "철분 주사 교육", ScenarioID: "SCN-INFUSION-00104"},
			{Kind: "boss", Name: "IV 접근 확보 설명", ScenarioID: "SCN-INFUSION-00102"},
		},
	},
	{
		Key: "별관 3|3F|infusionlong", Name: "주사센터 · 오래 다니는 사람",
		Building: "별관 3", Floor: "3F", Where: "별관 3 3F 외래 주사센터 · 인공신장실",
		Steps: []Step{
			{Kind: "dlg", Name: "포트 관리 교육", ScenarioID: "SCN-INFUSION-00106"},
			{Kind: "dlg", Name: "구역·피로 대처 상담", ScenarioID: "SCN-INFUSION-00107"},
			{Kind: "dlg", Name: "면역글로불린 주입 안내", ScenarioID: "SCN-INFUSION-00105"},
			{Kind: "boss", Name: "항암 주입 전 설명", ScenarioID: "SCN-INFUSION-00101"},
		},
	},
	{
		Key: "별관 3|3F|infusionsafety", Name: "주사센터 · 주입 중 안전",
		Building: "별관 3", Floor: "3F", Where: "별관 3 3F 외래 주사센터 · 인공신장실",
		Steps: []Step{
			{Kind: "dlg", Name: "수액 주입 반응 모니터링", ScenarioID: "SCN-INFUSION-00103"},
			{Kind: "dlg", Name: "주사센터 인계", ScenarioID: "SCN-INFUSION-00110"},
			{Kind: "boss", Name: "외래 항암 안전 확인", ScenarioID: "SCN-INFUSION-00109"},
		},
	},
	{
		Key: "별관 3|3F|dialstart", Name: "인공신장실 · 투석을 시작하며",
		Building: "별관 3", Floor: "3F", Where: "별관 3 3F 외래 주사센터 · 인공신장실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 인공신장실", ScenarioID: "SCN-DIAL-00900"},
			{Kind: "dlg", Name: "신규 환자 오리엔테이션", ScenarioID: "SCN-DIAL-00108"},
			{Kind: "quiz", Name: "투석 전 확인 사항", ScenarioID: "QZ-DIAL-00004"},
			{Kind: "dlg", Name: "투석 시작 전 사정", ScenarioID: "SCN-DIAL-00101"},
			{Kind: "boss", Name: "투석 종료·지혈 안내", ScenarioID: "SCN-DIAL-00107"},
		},
	},
	{
		Key: "별관 3|3F|dialteach", Name: "인공신장실 · 집에서 지키는 것",
		Building: "별관 3", Floor: "3F", Where: "별관 3 3F 외래 주사센터 · 인공신장실",
		Steps: []Step{
			{Kind: "dlg", Name: "수분·염분 제한 교육", ScenarioID: "SCN-DIAL-00103"},
			{Kind: "dlg", Name: "접근로 자가관리 교육", ScenarioID: "SCN-DIAL-00104"},
			{Kind: "dlg", Name: "투석 스케줄 상담", ScenarioID: "SCN-DIAL-00105"},
			{Kind: "boss", Name: "고칼륨혈증 교육", ScenarioID: "SCN-DIAL-00106"},
		},
	},
	{
		Key: "별관 3|3F|dialalarm", Name: "인공신장실 · 투석 중 이상",
		Building: "별관 3", Floor: "3F", Where: "별관 3 3F 외래 주사센터 · 인공신장실",
		Steps: []Step{
			{Kind: "dlg", Name: "투석실 인계", ScenarioID: "SCN-DIAL-00110"},
			{Kind: "event", Name: "장비 알람 대응", ScenarioID: "SCN-DIAL-00109"},
			{Kind: "boss", Name: "저혈압 에피소드 대응", ScenarioID: "SCN-DIAL-00102"},
		},
	},

	// ── 4F 내시경실 · 심혈관 조영실 ─────────────────────────────────────
	{
		Key: "별관 3|4F|endoprep", Name: "시술 전 준비",
		Building: "별관 3", Floor: "4F", Where: "별관 3 4F 내시경실 · 심혈관 조영실",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 내시경실", ScenarioID: "SCN-ENDO-00900"},
			{Kind: "dlg", Name: "시술 전 금식 시간 안내 · Grace Miller", ScenarioID: "SCN-ENDO-00101"},
			{Kind: "quiz", Name: "내시경 준비 순서", ScenarioID: "QZ-ENDO-00001"},
			{Kind: "dlg", Name: "시술 전날 저잔사 식이 안내 · Carl Weber", ScenarioID: "SCN-ENDO-00106"},
			{Kind: "boss", Name: "장정결 불충분 시 추가 지침 · Donna Ellis", ScenarioID: "SCN-ENDO-00107"},
		},
	},
	{
		Key: "별관 3|4F|sedation", Name: "진정 관리",
		Building: "별관 3", Floor: "4F", Where: "별관 3 4F 내시경실 · 심혈관 조영실",
		Steps: []Step{
			{Kind: "dlg", Name: "물·투명 음료 허용 안내 · Tom Harris", ScenarioID: "SCN-ENDO-00102"},
			{Kind: "dlg", Name: "장정결제 복용법 설명 · Linda Foster", ScenarioID: "SCN-ENDO-00103"},
			{Kind: "dlg", Name: "구역으로 하제 복용 중단 · Steven Park", ScenarioID: "SCN-ENDO-00108"},
			{Kind: "boss", Name: "금식 위반 환자 재평가 · Marie Sullivan", ScenarioID: "SCN-ENDO-00109"},
		},
	},
	{
		Key: "별관 3|4F|endoafter", Name: "깨어난 뒤",
		Building: "별관 3", Floor: "4F", Where: "별관 3 4F 내시경실 · 심혈관 조영실",
		Steps: []Step{
			{Kind: "dlg", Name: "장정결 진행 상태 확인 · Robert King", ScenarioID: "SCN-ENDO-00104"},
			{Kind: "dlg", Name: "당뇨 환자 금식 중 저혈당 · Harold Bennett", ScenarioID: "SCN-ENDO-00110"},
			{Kind: "boss", Name: "복용 약 지참 여부 확인 · Paula Nguyen", ScenarioID: "SCN-ENDO-00105"},
		},
	},
}
