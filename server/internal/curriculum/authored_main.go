package curriculum

// 본관 (main building) — the eight floors a learner meets first.
//
// Authored by hand rather than generated. The v19 generator picked 6 of a floor's
// 10 topics by difficulty and named the chapter after the floor, which worked
// until it didn't: a mechanical pass over the same fields breaks on 14 of 29
// department banks (SIM/LOUNGE/SPD have no patients so every topic reads as a
// handover; ER has seven urgent topics because that is what an emergency room
// IS). Curriculum names have to come from the floor's actual topics, and once you
// are reading all ten to name them, assigning them costs nothing more.
//
// Step Name must be the scenario's own title (persona suffix dropped) — see the
// Step doc comment for the eleven fabricated names this replaces.
var mainBuilding = []Curriculum{
	// ── 1F 응급의료센터 ─────────────────────────────────────────────────
	// Five curricula, not the usual three: this floor has 15 hand-authored
	// scenarios plus the three that had to be written for the opening (below).
	{
		Key: "본관|1F|orientation", Name: "첫 출근 · 인계받기",
		Building: "본관", Floor: "1F", Where: "본관 1F 응급의료센터",
		// The app's first three steps, and until now they did not exist. The v19
		// catalog promised them ("출근 · 인사와 자기소개") on top of ids that were
		// acute emergencies, so a newcomer's first tap opened chest-pain triage.
		Steps: []Step{
			{Kind: "dlg", Name: "첫 출근 · 자기소개", ScenarioID: "SCN-ORIENT-00001"},
			{Kind: "dlg", Name: "인계 받기 · 오늘 배정", ScenarioID: "SCN-ORIENT-00002"},
			{Kind: "boss", Name: "첫 환자 인사 · 신원 확인", ScenarioID: "SCN-ORIENT-00003"},
		},
	},
	{
		Key: "본관|1F|triage", Name: "접수와 트리아지",
		Building: "본관", Floor: "1F", Where: "본관 1F 응급의료센터",
		Steps: []Step{
			{Kind: "dlg", Name: "통증 사정", ScenarioID: "SCN-ER-00002"},
			{Kind: "quiz", Name: "통증 표현 짝맞추기", ScenarioID: "QZ-ER-00002"},
			{Kind: "dlg", Name: "두부 외상 사정", ScenarioID: "SCN-ER-00010"},
			{Kind: "dlg", Name: "화상 응급 처치", ScenarioID: "SCN-ER-00013"},
			{Kind: "boss", Name: "흉통 환자 트리아지", ScenarioID: "SCN-ER-00001"},
		},
	},
	{
		Key: "본관|1F|trauma", Name: "외상 · 실려 온 환자",
		Building: "본관", Floor: "1F", Where: "본관 1F 응급의료센터",
		Steps: []Step{
			{Kind: "dlg", Name: "교통사고 환자 핸드오프", ScenarioID: "SCN-ER-00006"},
			{Kind: "dlg", Name: "경찰 동행 환자 인계", ScenarioID: "SCN-ER-00005"},
			{Kind: "boss", Name: "흉부 외상 사정", ScenarioID: "SCN-ER-00014"},
		},
	},
	{
		Key: "본관|1F|children", Name: "아이와 보호자",
		Building: "본관", Floor: "1F", Where: "본관 1F 응급의료센터",
		Steps: []Step{
			{Kind: "dlg", Name: "고열 아동", ScenarioID: "SCN-ER-00008"},
			{Kind: "dlg", Name: "소아 이물 흡인", ScenarioID: "SCN-ER-00015"},
			{Kind: "boss", Name: "아나필락시스", ScenarioID: "SCN-ER-00003"},
		},
	},
	{
		Key: "본관|1F|crisis", Name: "위기 환자",
		Building: "본관", Floor: "1F", Where: "본관 1F 응급의료센터",
		Steps: []Step{
			{Kind: "dlg", Name: "언어 장벽 환자", ScenarioID: "SCN-ER-00007"},
			{Kind: "dlg", Name: "알콜 금단 사정", ScenarioID: "SCN-ER-00012"},
			{Kind: "dlg", Name: "약물 과다복용 응급", ScenarioID: "SCN-ER-00011"},
			{Kind: "boss", Name: "자해 위험 환자 사정", ScenarioID: "SCN-ER-00004"},
		},
	},

	// ── P1 중앙 약제부 ──────────────────────────────────────────────────
	{
		Key: "본관|P1|dispense", Name: "내주기 전 확인",
		Building: "본관", Floor: "P1", Where: "본관 P1 중앙 약제부",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 약제부", ScenarioID: "SCN-PHARMA-00900"},
			{Kind: "dlg", Name: "헤파린 더블 체크", ScenarioID: "SCN-PHARMA-00001"},
			{Kind: "quiz", Name: "구두 처방 받아쓰기", ScenarioID: "QZ-PHARMA-00001"},
			{Kind: "dlg", Name: "구두 처방 받아쓰기", ScenarioID: "SCN-PHARMA-00002"},
			{Kind: "dlg", Name: "약물 상호작용 확인", ScenarioID: "SCN-PHARMA-00010"},
			{Kind: "boss", Name: "마약류 픽업 (2인 인증)", ScenarioID: "SCN-PHARMA-00004"},
		},
	},
	{
		Key: "본관|P1|compound", Name: "조제와 용량",
		Building: "본관", Floor: "P1", Where: "본관 P1 중앙 약제부",
		Steps: []Step{
			{Kind: "dlg", Name: "소아 용량 확인", ScenarioID: "SCN-PHARMA-00011"},
			{Kind: "dlg", Name: "소아 용량 환산 (체중 기반)", ScenarioID: "SCN-PHARMA-00003"},
			{Kind: "boss", Name: "IV 혼합", ScenarioID: "SCN-PHARMA-00005"},
		},
	},
	{
		Key: "본관|P1|teaching", Name: "복약 교육",
		Building: "본관", Floor: "P1", Where: "본관 P1 중앙 약제부",
		Steps: []Step{
			{Kind: "dlg", Name: "흡입기 사용법 교육", ScenarioID: "SCN-PHARMA-00014"},
			{Kind: "dlg", Name: "인슐린 자가주사 교육", ScenarioID: "SCN-PHARMA-00006"},
			{Kind: "dlg", Name: "와파린 복약 상담", ScenarioID: "SCN-PHARMA-00007"},
			{Kind: "boss", Name: "오피오이드 안전 상담", ScenarioID: "SCN-PHARMA-00012"},
		},
	},
	{
		Key: "본관|P1|withward", Name: "병동과의 확인",
		Building: "본관", Floor: "P1", Where: "본관 P1 중앙 약제부",
		Steps: []Step{
			{Kind: "dlg", Name: "약물 조정(reconciliation)", ScenarioID: "SCN-PHARMA-00013"},
			{Kind: "dlg", Name: "퇴원 약물 상담", ScenarioID: "SCN-PHARMA-00009"},
			{Kind: "boss", Name: "고위험 약물 이중확인", ScenarioID: "SCN-PHARMA-00008"},
		},
	},

	// ── 3F 수술실 · PACU ────────────────────────────────────────────────
	{
		Key: "본관|3F|preop", Name: "수술 전 확인",
		Building: "본관", Floor: "3F", Where: "본관 3F 수술실 · PACU",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 수술실", ScenarioID: "SCN-OR-00900"},
			{Kind: "dlg", Name: "마취 전 문진", ScenarioID: "SCN-OR-00006"},
			{Kind: "quiz", Name: "수술 전 Time-out 체크", ScenarioID: "QZ-OR-00001"},
			{Kind: "dlg", Name: "수술 부위 표시 확인", ScenarioID: "SCN-OR-00007"},
			{Kind: "dlg", Name: "수술 전 Time-out 진행", ScenarioID: "SCN-OR-00002"},
			{Kind: "boss", Name: "수술 동의 확인", ScenarioID: "SCN-OR-00001"},
		},
	},
	{
		Key: "본관|3F|intraop", Name: "수술방 안에서",
		Building: "본관", Floor: "3F", Where: "본관 3F 수술실 · PACU",
		Steps: []Step{
			{Kind: "dlg", Name: "무균술 유지", ScenarioID: "SCN-OR-00008"},
			{Kind: "dlg", Name: "기구·거즈 카운트", ScenarioID: "SCN-OR-00013"},
			{Kind: "dlg", Name: "검체 처리 확인", ScenarioID: "SCN-OR-00009"},
			{Kind: "boss", Name: "기구 패스", ScenarioID: "SCN-OR-00003"},
		},
	},
	{
		Key: "본관|3F|pacu", Name: "회복실",
		Building: "본관", Floor: "3F", Where: "본관 3F 수술실 · PACU",
		Steps: []Step{
			{Kind: "dlg", Name: "저체온 관리", ScenarioID: "SCN-OR-00011"},
			{Kind: "dlg", Name: "수술 후 오심 관리", ScenarioID: "SCN-OR-00010"},
			{Kind: "boss", Name: "회복실 통증 조절", ScenarioID: "SCN-OR-00014"},
		},
	},
	{
		Key: "본관|3F|team", Name: "가족과 팀에게",
		Building: "본관", Floor: "3F", Where: "본관 3F 수술실 · PACU",
		Steps: []Step{
			{Kind: "dlg", Name: "수술 중 가족 업데이트", ScenarioID: "SCN-OR-00005"},
			{Kind: "dlg", Name: "PACU 인계", ScenarioID: "SCN-OR-00004"},
			{Kind: "boss", Name: "수술 중 출혈 대응", ScenarioID: "SCN-OR-00012"},
		},
	},

	// ── 4F ICU ──────────────────────────────────────────────────────────
	{
		Key: "본관|4F|monitor", Name: "모니터와 알람",
		Building: "본관", Floor: "4F", Where: "본관 4F ICU",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 중환자실", ScenarioID: "SCN-ICU-00900"},
			{Kind: "dlg", Name: "욕창 예방 체위변경", ScenarioID: "SCN-ICU-00010"},
			{Kind: "quiz", Name: "인공호흡기 알람 대응", ScenarioID: "QZ-ICU-00004"},
			{Kind: "dlg", Name: "모니터 알람 해석", ScenarioID: "SCN-ICU-00005"},
			{Kind: "boss", Name: "중심정맥관 삽입 보조", ScenarioID: "SCN-ICU-00011"},
		},
	},
	{
		Key: "본관|4F|vent", Name: "인공호흡기 환자",
		Building: "본관", Floor: "4F", Where: "본관 4F ICU",
		Steps: []Step{
			{Kind: "dlg", Name: "인공호흡기 이탈 설명", ScenarioID: "SCN-ICU-00014"},
			{Kind: "dlg", Name: "진정 관리 설명", ScenarioID: "SCN-ICU-00007"},
			{Kind: "dlg", Name: "인공호흡기 환자 소통", ScenarioID: "SCN-ICU-00006"},
			{Kind: "boss", Name: "ARDS 환자 인공호흡기 설정 보고", ScenarioID: "SCN-ICU-00001"},
		},
	},
	{
		Key: "본관|4F|delirium", Name: "섬망과 악화",
		Building: "본관", Floor: "4F", Where: "본관 4F ICU",
		Steps: []Step{
			{Kind: "dlg", Name: "ICU Delirium 환자 진정", ScenarioID: "SCN-ICU-00004"},
			{Kind: "dlg", Name: "ICU 섬망 대응", ScenarioID: "SCN-ICU-00009"},
			{Kind: "boss", Name: "패혈증 상태 설명", ScenarioID: "SCN-ICU-00008"},
		},
	},
	{
		Key: "본관|4F|endoflife", Name: "코드블루와 임종",
		Building: "본관", Floor: "4F", Where: "본관 4F ICU",
		Steps: []Step{
			{Kind: "dlg", Name: "Code Blue 콜 응대", ScenarioID: "SCN-ICU-00003"},
			{Kind: "dlg", Name: "코드블루 대응", ScenarioID: "SCN-ICU-00012"},
			{Kind: "dlg", Name: "임종 임박 소통", ScenarioID: "SCN-ICU-00013"},
			{Kind: "boss", Name: "임종 가족과의 면담", ScenarioID: "SCN-ICU-00002"},
		},
	},

	// ── 8F 일반 내과 병동 ───────────────────────────────────────────────
	{
		Key: "본관|8F|admission", Name: "입원 첫날",
		Building: "본관", Floor: "8F", Where: "본관 8F 일반 내과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 내과병동", ScenarioID: "SCN-WARD-00900"},
			{Kind: "dlg", Name: "만성질환 입원 사정", ScenarioID: "SCN-WARD-00101"},
			// This floor's bank has no hand-authored quiz, so the quiz comes from a
			// topic that lives in another curriculum on the same floor — a quiz
			// echoing the dialogue right above it teaches nothing.
			{Kind: "quiz", Name: "혈당 변동 설명", ScenarioID: "QZ-WARD-00104"},
			{Kind: "dlg", Name: "야간 불면 대응", ScenarioID: "SCN-WARD-00109"},
			{Kind: "boss", Name: "혈액검사 결과 설명", ScenarioID: "SCN-WARD-00107"},
		},
	},
	{
		Key: "본관|8F|chronic", Name: "만성질환 교육",
		Building: "본관", Floor: "8F", Where: "본관 8F 일반 내과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "혈당 변동 설명", ScenarioID: "SCN-WARD-00102"},
			{Kind: "dlg", Name: "이뇨제 복용 상담", ScenarioID: "SCN-WARD-00105"},
			{Kind: "dlg", Name: "감염 격리 안내", ScenarioID: "SCN-WARD-00108"},
			{Kind: "boss", Name: "심부전 체중·부종 교육", ScenarioID: "SCN-WARD-00103"},
		},
	},
	{
		Key: "본관|8F|deterioration", Name: "악화와 인계",
		Building: "본관", Floor: "8F", Where: "본관 8F 일반 내과 병동",
		Steps: []Step{
			{Kind: "event", Name: "산소 요구 증가 사정", ScenarioID: "SCN-WARD-00104"},
			{Kind: "dlg", Name: "다학제 회진 참여", ScenarioID: "SCN-WARD-00106"},
			{Kind: "boss", Name: "내과 병동 인계", ScenarioID: "SCN-WARD-00110"},
		},
	},

	// ── 7F 일반 외과 병동 ───────────────────────────────────────────────
	{
		Key: "본관|7F|postop", Name: "수술 후 첫 만남",
		Building: "본관", Floor: "7F", Where: "본관 7F 일반 외과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 외과병동", ScenarioID: "SCN-SURGWARD-00900"},
			{Kind: "dlg", Name: "장운동 회복 안내", ScenarioID: "SCN-SURGWARD-00107"},
			{Kind: "quiz", Name: "조기 보행 격려", ScenarioID: "QZ-SURGWARD-00107"},
			{Kind: "dlg", Name: "수술 후 첫 사정", ScenarioID: "SCN-SURGWARD-00101"},
			{Kind: "boss", Name: "수술 부위 드레싱 관찰", ScenarioID: "SCN-SURGWARD-00104"},
		},
	},
	{
		Key: "본관|7F|recovery", Name: "회복 돕기",
		Building: "본관", Floor: "7F", Where: "본관 7F 일반 외과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "통증 자가조절 장치 교육", ScenarioID: "SCN-SURGWARD-00102"},
			{Kind: "dlg", Name: "조기 보행 격려", ScenarioID: "SCN-SURGWARD-00103"},
			{Kind: "dlg", Name: "배액관 관리 설명", ScenarioID: "SCN-SURGWARD-00105"},
			{Kind: "boss", Name: "퇴원 상처 관리 교육", ScenarioID: "SCN-SURGWARD-00109"},
		},
	},
	{
		Key: "본관|7F|warning", Name: "이상 징후",
		Building: "본관", Floor: "7F", Where: "본관 7F 일반 외과 병동",
		Steps: []Step{
			{Kind: "event", Name: "수술 후 섬망 관찰", ScenarioID: "SCN-SURGWARD-00108"},
			{Kind: "event", Name: "수술 후 출혈 의심", ScenarioID: "SCN-SURGWARD-00106"},
			{Kind: "boss", Name: "외과 병동 인계", ScenarioID: "SCN-SURGWARD-00110"},
		},
	},

	// ── 6F 정형외과 병동 ────────────────────────────────────────────────
	{
		Key: "본관|6F|fracture", Name: "골절 환자 받기",
		Building: "본관", Floor: "6F", Where: "본관 6F 정형외과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 정형외과병동", ScenarioID: "SCN-ORTHOWARD-00900"},
			{Kind: "dlg", Name: "골절 환자 입원 사정", ScenarioID: "SCN-ORTHOWARD-00101"},
			{Kind: "quiz", Name: "보행 보조기구 훈련", ScenarioID: "QZ-ORTHOWARD-00113"},
			{Kind: "dlg", Name: "석고붕대 관리 교육", ScenarioID: "SCN-ORTHOWARD-00102"},
			{Kind: "boss", Name: "견인 장치 설명", ScenarioID: "SCN-ORTHOWARD-00103"},
		},
	},
	{
		Key: "본관|6F|walking", Name: "다시 걷기까지",
		Building: "본관", Floor: "6F", Where: "본관 6F 정형외과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "보행 보조기구 훈련", ScenarioID: "SCN-ORTHOWARD-00105"},
			{Kind: "dlg", Name: "재활 목표 상담", ScenarioID: "SCN-ORTHOWARD-00108"},
			{Kind: "dlg", Name: "심부정맥혈전 예방 교육", ScenarioID: "SCN-ORTHOWARD-00106"},
			{Kind: "boss", Name: "고관절 수술 후 자세 제한", ScenarioID: "SCN-ORTHOWARD-00104"},
		},
	},
	{
		Key: "본관|6F|watch", Name: "놓치면 안 되는 것",
		Building: "본관", Floor: "6F", Where: "본관 6F 정형외과 병동",
		Steps: []Step{
			{Kind: "dlg", Name: "낙상 재발 예방 상담", ScenarioID: "SCN-ORTHOWARD-00109"},
			{Kind: "event", Name: "구획증후군 의심 사정", ScenarioID: "SCN-ORTHOWARD-00107"},
			{Kind: "boss", Name: "정형 병동 인계", ScenarioID: "SCN-ORTHOWARD-00110"},
		},
	},

	// ── 2F 피부과 센터 ──────────────────────────────────────────────────
	{
		Key: "본관|2F|lesion", Name: "피부를 보는 눈",
		Building: "본관", Floor: "2F", Where: "본관 2F 피부과 센터",
		Steps: []Step{
			{Kind: "dlg", Name: "첫 인사 · 피부과", ScenarioID: "SCN-DERM-00900"},
			{Kind: "dlg", Name: "피부 병변 문진", ScenarioID: "SCN-DERM-00101"},
			{Kind: "quiz", Name: "광선치료 전 안내", ScenarioID: "QZ-DERM-00110"},
			{Kind: "dlg", Name: "가려움 조절 상담", ScenarioID: "SCN-DERM-00102"},
			{Kind: "boss", Name: "알레르기 접촉 유발 물질 추적", ScenarioID: "SCN-DERM-00109"},
		},
	},
	{
		Key: "본관|2F|light", Name: "광선과 레이저",
		Building: "본관", Floor: "2F", Where: "본관 2F 피부과 센터",
		Steps: []Step{
			{Kind: "dlg", Name: "광선치료 전 안내", ScenarioID: "SCN-DERM-00104"},
			{Kind: "dlg", Name: "레이저 시술 전 설명", ScenarioID: "SCN-DERM-00106"},
			{Kind: "dlg", Name: "시술 후 자외선 차단 교육", ScenarioID: "SCN-DERM-00107"},
			{Kind: "boss", Name: "광선치료 중 이상반응", ScenarioID: "SCN-DERM-00105"},
		},
	},
	{
		Key: "본관|2F|chronicskin", Name: "오래 앓는 사람",
		Building: "본관", Floor: "2F", Where: "본관 2F 피부과 센터",
		Steps: []Step{
			{Kind: "dlg", Name: "국소 스테로이드 교육", ScenarioID: "SCN-DERM-00103"},
			{Kind: "dlg", Name: "만성 습진 심리 지지", ScenarioID: "SCN-DERM-00108"},
			{Kind: "boss", Name: "피부과 외래 인계", ScenarioID: "SCN-DERM-00110"},
		},
	},
}
