---
phase: 02-construction
stage: 05-map-engine / 5g-departments
status: PLAN
updated: 2026-07-18
handoff: design-handoff_v16
---

# v16 신규 부서 20종 반영 계획

v16 핸드오프에 **신규 인테리어 20종**이 추가됐다(기존 구현 9종 5g 부서 외). 기존 9종은
동일 v16 압축(rows 46/46/44/50)·그림자 튜닝을 이미 반영 완료. 이 문서는 **신규 20종을
엘리베이터 4개 건물의 빈 층에 배치·순차 구현**하기 위한 계획이다. 규약은 [README](README.md)와
`er/` 기준 인스턴스를 그대로 따른다(임의 단순화·창작 금지, "full blueprint not subset").

## 엘리베이터 건물 현황
`ElevatorScreen.tsx` `ELEVATOR_BUILDINGS` 5개 건물 중 **TOWER는 9층 완비**(내과/외과/정형 병동·ICU·OR·피부과·ER·약제부).
나머지 4개 건물의 층 대부분이 `준비 중`(interior 미배선). 20종이 이 빈 층을 채운다.

## 건물별 매핑 (핸드오프 `buildings-v2.jsx` + `05_MAP_AND_INTERIORS.md` 기준)

### WOMEN 여성소아 센터 (#C2487E) — 신규 5 (+1F 재검토)
| 층 | 부서 | interior id | 소스(interior / objects2) | 비고 |
|---|---|---|---|---|
| 6F | 신생아 중환자실 NICU | `INT-NICU-00001` | nicu / nicu2 | 유리벽 isolette pod |
| 5F | 소아 중환자실 PICU | `INT-PICU-00001` | picu / picu2 | 유리벽 소아 ICU |
| 4F | 신생아실 Nursery | `INT-NURSERY-00001` | nursery / **objects2 없음** | ld 오브젝트 재사용 |
| 3F | 가족 분만실 L&D | `INT-LD-00001` | ld / ld2 | **최대 규모**(28×50, OB 3실) |
| 3F(sub) | 산후 병동 Postpartum | `INT-POSTPARTUM-00001` | postpartum / postpartum2 | mother-baby couplet |
| 1F | 소아·산부인과 외래 + 키즈광장 | (기존 `INT-PEDS-00001`) | womenkids-opd / **objects2 없음** | peds/clinic 재사용 — 신규 인테리어로 교체할지 재검토 |

### DX 외래·진단 지원동 (#0E7490) — 신규 5
| 층 | 부서 | interior id | 소스 | 비고 |
|---|---|---|---|---|
| 4F | 내시경실 Endoscopy | `INT-ENDO-00001` | endo / endo2 | 시술 2실 + 재처리실 |
| 3F | 인공신장실 Dialysis | `INT-DIAL-00001` | dial / dial2 | 투석 체어 + RO 정수실 |
| 3F(sub) | 외래 주사센터 Infusion | `INT-INFUSION-00001` | infusion / **objects2 없음** | onco + ER 오브젝트 재사용 |
| 2F | 전문 외래(안·이비인후·비뇨·신경) | `INT-SPECIALTY-00001` | specialty / **eye2** | 오브젝트 = `interior-objects-eye2.jsx` |
| 1F | 영상의학과 Radiology | `INT-RAD-00001` | rad / rad2 | 영상 suite + 판독 다크룸 |

### ONCO 암센터·특수 재활관 (#1E8A5B) — 신규 5
| 층 | 부서 | interior id | 소스 | 비고 |
|---|---|---|---|---|
| 4F | 완화의료·호스피스 | `INT-HOSPICE-00001` | hospice / hospice2 | warm/home 미감 |
| 4F(sub) | 치매·노인성 질환 병동 | `INT-GERI-00001` | geri / geri2 | dementia loop 동선 |
| 3F | 종양학 병동 + BMT | `INT-ONCO-00001` | onco / onco2 | chemo bay + 양압 BMT |
| 2F | 정신과 폐쇄병동 | `INT-PSYCH-00001` | psych / psych2 | 이중문·관찰창·격리실 |
| 1F | 대형 재활치료실 PT/OT | `INT-REHAB-00001` | rehab / rehab2 | 개방형 gym 단일공간 |

### ADMIN 행정·백스테이지 윙 (#6E6354) — 신규 4
| 층 | 부서 | interior id | 소스 | 비고 |
|---|---|---|---|---|
| 3F | 간호부·감염관리·시뮬랩 | `INT-SIM-00001` | sim / sim2 | sim manikin + 관제부스 |
| 2F | 직원 락커·휴게실·식당 | `INT-LOUNGE-00001` | lounge / lounge2 | staff-only amenities |
| 1F | 중앙공급실 SPD·영양팀·하역장 | `INT-SPD-00001` | spd / spd2 | 산업형 back-of-house |
| B1 | 영안실·부검실 | `INT-MORGUE-00001` | morgue / morgue2 | cold storage + autopsy |

## 복잡도 (interior+objects2 LOC)
- **HIGH**: ld(368) · specialty(305) · onco(304) · rad(299) · spd(273)
- **MED**: geri·hospice·endo·sim·rehab·nicu·postpartum·dial·morgue·psych·picu·lounge (210–260)
- **LOW(재사용)**: infusion(130) · nursery(128) · womenkids-opd(127) — 전용 objects2 없음, 기존 카탈로그 재사용

## Phase 0 — 공용 카탈로그 선반영 (모든 부서 공유, 1회)
1. `interior-shared.jsx` v16 신규 **바닥 테마 8종**(floorInternal/Surgery/Ortho/Derm + Alt) → `themes.ts`에 추가.
2. shared 프리미티브 diff 확인(IBed/IReception/NurseDeskI 그림자·사이징은 v15→v16 변화 미미 — 확인만).
3. 신규 부서가 공유할 오브젝트(NICU isolette·투석체어·PACS·주방/산업 설비 등) 중 재사용 후보 식별 → `sharedEquipment.tsx` 승격 대상 목록화.

## Phase 순서 (건물 단위 완결 — 엘리베이터로 건물 하나씩 "완성" 체감)
> 각 부서 = README 프로세스(Build Spec 5파일 → 구현 → 검증 프로토콜 → 편차 기록 → 커밋).
> 부서당 fixture + `<dept>Equipment.tsx` + `<dept>-fixture.test.ts` + `objects/index.tsx` 디스패치 + `ElevatorScreen` 배선 + `FIXTURES` 등록.

- **Phase 1 · 재사용 검증(quick win)**: infusion → nursery → womenkids-opd(재검토 결론 반영). 재사용 파이프라인 먼저 굳힘.
- **Phase 2 · WOMEN 완결**: ld(대형) → postpartum → nicu → picu. 여성소아 건물 6·5·4·3F 채움.
- **Phase 3 · DX 완결**: rad → endo → dial → specialty(eye2). 진단동 완성.
- **Phase 4 · ONCO 완결**: onco → hospice → geri → psych → rehab.
- **Phase 5 · ADMIN 완결**: spd → sim → lounge → morgue(B1).

## 미해결 결정
- **Q1 건물/Phase 착수 순서** — 위는 quick-win(Phase1) 후 WOMEN 우선안. 사용자 우선순위로 조정 가능.
- **Q2 WOMEN 1F** — 기존 `INT-PEDS-00001` 유지 vs `interior-womenkids-opd.jsx` 정식 인테리어로 교체(피부과 2F 사례처럼).
- **Q3 한 층 복수 부서**(3F L&D+Postpartum+Nursery, 4F Hospice+Geri, 3F Dial+Infusion) — 단일 인테리어 내 구획 vs 별도 interior id. 핸드오프 소스가 파일 분리이므로 **별도 id + 엘리베이터 sub-선택** 기본.

## 검증·SoT
- 검증은 README §검증 프로토콜(tsc 0 · jest 부서 fixture · 시뮬레이터 구역 대조) 그대로.
- 핸드오프 SoT는 **v16**로 상향(README 인덱스의 v13 표기 갱신 필요).
