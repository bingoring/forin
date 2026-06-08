# forin — 상황 · 환자 이벤트 카탈로그

> forin의 학습 단위인 **상황·환자 이벤트**의 콘텐츠·스키마·진행·관계·전달 모델을 관리한다.
> 타깃은 현업 의료인(우선 미국 취업 간호사) — **전문성**이 최우선. 상위 제품 맥락은
> [`prd.md` → 상황·환자 이벤트](prd.md) 참조.

## 상태

- **현재:** 스키마·분류·진행/관계 모델 + 시드 예시(아래) 정의 — 골격(scaffold).
- **목표:** MVP까지 **최소 300개** 이벤트 작성. 전수 작성은 도메인 모델(1-2) 확정 후
  **전용 콘텐츠 워크스트림**으로 진행(임상 레퍼런스 조사 기반, 검수 포함).

## 이벤트 스키마 (제안 — 도메인 모델 1-2에서 확정)

| 필드 | 설명 |
|---|---|
| `id` | 고유 ID. 슬러그 + **최소 5자리 제로패딩**. 예: `EVT-ER-00001` (병동-순번) |
| `title_ko` / `title_en` | 표시 제목(한/영) |
| `ward` | `er` `or` `icu` `peds` `pharma` (+ `general`) |
| `category` | `emergency_code` `clinical` `interpersonal` `facility_safety` `procedure` |
| `tier` | 1(필수·빈발) ~ 4(심화·희귀). 진행 단계 |
| `tags` | 주제 태그 — 예: `triage` `sbar` `pain` `medication` `airway` `pediatric` … |
| `learning_objectives` | 이 이벤트로 익히는 임상 영어/역량(복수) |
| `linked_scenarios` | 연결된 시나리오(브리핑→다이얼로그→퀴즈) ID들 |
| `quiz_pool_tags` | 이 이벤트에 샘플링할 퀴즈 풀 태그(다양성 위해 1:N) |
| `prerequisites` | 선행 이벤트 ID들(없으면 초반 배치) |
| `follow_ups` | 해결 후 이어 제공할 연관 이벤트 ID들 |
| `related` | 직접 선후행은 아니나 주제 연관 이벤트 |
| `delivery` | `main_route` / `daily_pool` / `both` — 전달 경로(아래) |

> enum류(`ward`/`category`/`tier`/`delivery`)는 DB CHECK가 아니라 **코드측 허용집합**으로 관리(확장성 우선).

## 분류 (category)

1. **emergency_code** — 병원 비상 코드(아래 표).
2. **clinical** — 임상 상황/질환(흉통, 패혈증, 낙상, 투약 오류, 아나필락시스 등).
3. **interpersonal** — 대인/커뮤니케이션(진상 환자·보호자 갈등, 진상 의사, 언어 장벽, 나쁜 소식 전달).
4. **facility_safety** — 시설/안전(화재, 정전, 장비 고장, 감염 격리).
5. **procedure** — 절차/워크플로(입원, 퇴원 교육, SBAR 인계, 동의서, 채혈/IV).

## 진행 티어 (tier) · 관계

- **Tier 1** 필수·빈발(누구나 초반 학습) → **Tier 2** 일상 변형 → **Tier 3** 복합/악화 →
  **Tier 4** 심화·희귀(드문 코드·복합 합병증).
- **메인 루트**는 prerequisites/follow_ups 그래프를 따라 Tier 1→4로 상승.
- `follow_ups`로 "해결 직후 연관 이벤트"를 제공해 몰입·만족도↑ (예: 흉통 사정 → STEMI 인지 → Code Blue).

## 전달 (delivery) — 하이브리드 (prd.md 권고)

- `main_route` — 항상 열린 커리큘럼 진행 경로(리셋 없음).
- `daily_pool` — 매일 00:00(로컬) 갱신 3~5개(레벨·병동·진행도 가중 샘플링).
- 보상형 광고로 일일 소진 시 +N회(일일 상한). 메인 루트는 항상 무료.

## 병원 비상 코드 (참고 — ⚠️ 표준 아님)

> 코드 색상-의미 매핑은 **병원·주(state)·국가마다 다르다**(미국도 병원별 상이; 일부 주는 병원협회가
> 표준화). forin은 아래를 **앱 내 canonical 세트**로 채택하되, 각 이벤트 카피에서 "병원마다 다를 수 있음"을
> 학습 포인트로 다룬다. (작성 시 신뢰 가능한 임상 레퍼런스로 재검증 필요.)

| 코드 | forin canonical 의미 | 비고 |
|---|---|---|
| Code Blue | 성인 심정지/호흡정지 | 가장 보편적·일관적 |
| Rapid Response (RRT) | 급성 악화(심정지 직전) | 코드블루 전 단계 |
| Code Red | 화재 | 보편적 |
| Code Pink | 영아/소아 납치 | Amber와 중복 지역 있음 |
| Code Gray | 공격적·폭력적 인물 | 보안 대응(지역차 큼) |
| Code Silver | 무기 소지/총격 위협 | active shooter |
| Code Orange | 위험물질(hazmat) 유출 | 지역차 |
| Code Yellow | 재난/대량사상(MCI) | 일부 지역=폭탄위협 ⚠️ |
| Code Black | 폭탄 위협 | 지역차 큼 ⚠️ |
| Code Brown | (외부) 재난/악천후 | 구어 ≠ 공식, 주의 ⚠️ |
| Code Stroke / STEMI / Sepsis | 임상 패스웨이 활성화 | 색상 아님(임상 트랙) |

## 시드 예시 (30) — 작성 패턴 데모

> 전수 300+는 별도 워크스트림. 아래는 스키마·티어·관계를 보여주는 표본.

### ER (응급실)
- `EVT-ER-00001` **트리아지: 흉통 내원** · clinical · T1 · tags[triage,pain,sbar] · follow_ups[EVT-ER-00002]
- `EVT-ER-00002` **STEMI 인지·코드 STEMI** · clinical · T2 · prereq[EVT-ER-00001] · follow_ups[EVT-ER-00003]
- `EVT-ER-00003` **Code Blue: 성인 심정지** · emergency_code · T3 · tags[airway,cpr,team]
- `EVT-ER-00004` **트리아지: 다수 동시 내원(MCI/Code Yellow)** · emergency_code · T4
- `EVT-ER-00005` **아나필락시스(에피네프린)** · clinical · T2 · tags[allergy,medication,airway]
- `EVT-ER-00006` **음주 외상 진상 환자** · interpersonal · T2 · tags[deescalation,safety]
- `EVT-ER-00007` **언어 장벽 환자(통역 요청)** · interpersonal · T1 · tags[interpreter,communication]

### ICU (중환자실)
- `EVT-ICU-00001` **인공호흡기 환자 SBAR 인계** · procedure · T1 · tags[sbar,handoff,vent]
- `EVT-ICU-00002` **패혈증 번들·악화 인지** · clinical · T2 · tags[sepsis,vitals] · follow_ups[EVT-ICU-00003]
- `EVT-ICU-00003` **승압제 적정·쇼크** · clinical · T3 · prereq[EVT-ICU-00002]
- `EVT-ICU-00004` **임종/가족 면담(나쁜 소식 전달)** · interpersonal · T3 · tags[end_of_life,empathy]
- `EVT-ICU-00005` **수혈 반응** · clinical · T2 · tags[transfusion,reaction]

### OR (수술실)
- `EVT-OR-00001` **수술 전 타임아웃·체크리스트** · procedure · T1 · tags[timeout,safety,checklist]
- `EVT-OR-00002` **수술 동의서 확인** · procedure · T1 · tags[consent,communication]
- `EVT-OR-00003` **마취 중 활력징후 급변** · clinical · T3 · tags[vitals,airway]
- `EVT-OR-00004` **수술 검체·표본 라벨링** · procedure · T2 · tags[specimen,labeling]
- `EVT-OR-00005` **진상 의사 갈등(지시 모호)** · interpersonal · T2 · tags[assertive,clarify]

### Peds (소아)
- `EVT-PEDS-00001` **소아 발열·보호자 안심** · clinical · T1 · tags[pediatric,fever,family]
- `EVT-PEDS-00002` **소아 체중 기반 투약 계산** · clinical · T2 · tags[medication,dosage,pediatric]
- `EVT-PEDS-00003` **Code Pink: 영아 납치 경보** · emergency_code · T4 · tags[security,protocol]
- `EVT-PEDS-00004` **보호자 갈등(불안한 부모)** · interpersonal · T2 · tags[deescalation,family]
- `EVT-PEDS-00005` **소아 호흡곤란(크룹/천식)** · clinical · T3 · tags[airway,pediatric]

### Pharmacy (약국)
- `EVT-PHARMA-00001` **투약 오류 발견·보고** · clinical · T2 · tags[medication,safety,reporting]
- `EVT-PHARMA-00002` **약물 상호작용 확인 문의** · procedure · T1 · tags[interaction,communication]
- `EVT-PHARMA-00003` **고위험 약물(헤파린 등) 이중확인** · procedure · T2 · tags[high_alert,double_check]
- `EVT-PHARMA-00004` **복약 지도(퇴원 교육)** · procedure · T1 · tags[discharge,teaching]

### General / Facility
- `EVT-GEN-00001` **입원 수속·초기 사정** · procedure · T1 · tags[admission,assessment]
- `EVT-GEN-00002` **낙상 발생·사고 보고** · clinical · T2 · tags[fall,incident,report]
- `EVT-GEN-00003` **Code Red: 화재 대피** · facility_safety · T3 · tags[fire,evacuation,RACE]
- `EVT-GEN-00004` **정전/장비 고장 대응** · facility_safety · T3 · tags[power,equipment]
