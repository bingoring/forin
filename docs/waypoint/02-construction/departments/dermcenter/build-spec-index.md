---
build-spec: departments/dermcenter
stage: 02-construction / 05-map-engine (5g-i)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-15
---

# Build Spec — 5g-i · Dermatology Center 피부과 센터

| | |
|---|---|
| interior id | `INT-DERM-00001` (deptId `DEPT-DERM-00001`) |
| fixture | `mobile/src/map/fixtures/dermcenter.ts` (`DERMCENTER_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v15` `interior-dermcenter.jsx` + `interior-objects-derm2.jsx` |
| 그리드 | 28 cols × 52 rows · floorTheme `derm`(rose) · scale **0.9** · **상단 캠퍼스 문**(x13-15) |
| playerStart | `{14,11}` (로비, ↓ 캠퍼스 문 앞) |

> 외래 중심(밝은 화이트/로즈 톤). 병동과 달리 **상단 캠퍼스 문**·로비 대기 라운지. clinicReception/sofa/coffeetable/walltv/watercooler/surgicallight/dressing/shared 재사용 — 신규는 derm2 + SkinAnatomy.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) |
| business-rules | [`business-rules.md`](business-rules.md) |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) |
| frontend-components | [`frontend-components.md`](frontend-components.md) |

## §0. 개요 & 범위
```
┌──────── 로비 · 접수 · 대기 (대기 소파·정수기·병변차트·벽TV) ────────┐  (y1-12)
├ 제1진료실(더마토스코프·우드등) ┬ 제2진료실(더마토스코프·피부구조도) ┤  (y14-24, x13 divider)
├──────── 광선 치료실 (전신 UV 부스 · 국소 UV · 고글 소독기) ────────┤  (y26-36)
├──────── 소수술 · 레이저 처치실 (펀치 생검 · 냉동 · CO2 레이저) ─────┤  (y38-50, sterile)
└──────────────────────────────────────────────────────────────┘
```
- **외래 피부과**: 병변 진단(점 ABCD·우드등) → 광선치료(UVB) → 소수술/레이저(생검·냉동·CO2). 프라이버시 중심.

## §1. 분해
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×52 레이아웃·엔티티·NPC | `fixtures/dermcenter.ts` (신규) → `FIXTURES` |
| Derm 카탈로그 | derm2 10 + SkinAnatomy | `objects/dermEquipment.tsx` (신규) + `DermObjectView` |
| 재사용 | clinicReception(pharma)·sofa·coffeetable·walltv·watercooler(er)·surgicallight·instrumenttray(or)·dressing(er)·ibed(ward/or)·ireception·imonitor·ichair·icabinet(sterile)·wastebin·iplant·baylabel | 기존 |
| 디스패치 | `DermObjectView` 체인 추가(Ortho 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | 타워 **2F**(피부과 센터), entry `{14,1}`(상단 문) | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·divider·footprint | `map/dermcenter-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 진입** → 엘리베이터 타워 **2F**. 기존 2F(경량 클리닉엔진 `CLINIC-IM`)를 **피부과 센터 정식 인테리어로 교체**(외래 클리닉 엔진은 v8에서 redundant 판정). 상단 캠퍼스 문(x13-15) → entry `{14,1}`.
- **Q2 시나리오** → 라벨만.

## §4. 구현 체크리스트
- [x] regions 5 / rooms 5 / collision(외벽·상단문·y13 divider·exam x13·y25·y37)
- [x] threshold 6 · door(↓ 캠퍼스, 상단)
- [x] 신규 `dermEquipment.tsx`(11종: Dermatoscope·WoodsLamp·UVBooth·HandUVBox·GoggleSanitizer·BiopsyKit·BiopsyBottle·CryoTank·CO2Laser·LesionChart·SkinAnatomy)
- [x] NPC 캐스트 11 + 마커(핫스팟 6)
- [x] `DermObjectView` 디스패치 + `FIXTURES` + 엘리베이터 2F
- [x] `dermcenter-fixture.test.ts`(6)
- [x] tsc/jest + 시뮬레이터

## §5. 검증 결과
- `tsc` 0 · `jest` **94/94**(dermcenter 6: playerStart · 상단문 도착 · 5 room 도달 · threshold · exam divider · reception/UV부스/수술의자 footprint).
- **시뮬레이터**(2026-07-15): 로비(병변차트·대기소파·정수기·벽TV·접수·환자), 진료실1/2(더마토스코프·우드등·피부구조도), 광선치료실(UV 부스·핸드UV·고글소독기), 레이저 처치실(수술등·생검키트·냉동탱크·CO2 레이저) 렌더 정상.

## §7. 편차 로그
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.9 | 28폭 뷰포트 |
| IBed label | 생략 | 공용 dispatch 미지원(전 부서 동일) |
| SVG `<text>`(LN₂) | shape/생략 | 카탈로그 규약 |
| 2F = CLINIC-IM(경량 외래) | **INT-DERM 정식 인테리어로 교체** | 외래 클리닉 엔진 redundant(v8). 내과/외과 외래는 후속 정식화 시 별도 층/포털 |
| 시나리오 마커 | 라벨만 | derm 시나리오 후속 |
나머지 좌표·오브젝트·NPC는 v15 `interior-dermcenter.jsx`와 1:1.

## §8. 5g 부서 마스터블루프린트 완결
5g-a ER · 5g-b OR · 5g-c ICU · 5g-d Peds · 5g-e Pharmacy · 5g-f 내과병동 · 5g-g 외과병동 · 5g-h 정형병동 · **5g-i 피부과센터** — **9종 전부 구현 완료**.
