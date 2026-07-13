---
build-spec: departments/ward
stage: 02-construction / 05-map-engine (5g-f)
status: IMPLEMENTED
depth: comprehensive
updated: 2026-07-13
---

# Build Spec — 5g-f · Internal Medicine Ward 일반 내과 병동

| | |
|---|---|
| interior id | `INT-WARD-00001` (deptId `DEPT-WARD-00001`) |
| fixture | `mobile/src/map/fixtures/ward.ts` (`WARD_INTERIOR`) — **신규** |
| SoT(핸드오프) | `design-handoff_v13` `interior-ward.jsx` + `interior-objects-ward2.jsx` (**v13 2.5D + 접지 그림자**) |
| 그리드 | 28 cols × 52 rows · floorTheme `internal`(내과 sage) · scale **0.9** |
| playerStart | `{13,14}` (중앙 간호 스테이션 — 핸드오프 그대로) |

> 구조·공통 규약은 [er/](../er/build-spec-index.md)(기준선) + [README](../README.md). 세로 흐름(28폭×52장).
> **v13 2.5D 장비 규약** 적용 — 통합 실루엣+상단면+seam+viewer-facing 전면+**접지 그림자 타원**.

## §2. 아티팩트 매니페스트
| 아티팩트 | 파일 |
|---|---|
| domain-entities | [`domain-entities.md`](domain-entities.md) — regions·rooms·오브젝트 배치·NPC |
| business-rules | [`business-rules.md`](business-rules.md) — collision·통행·footprint·커튼·격리 |
| business-logic-model | [`business-logic-model.md`](business-logic-model.md) — 진입(엘리베이터 8F)·이동·마커 |
| frontend-components | [`frontend-components.md`](frontend-components.md) — ward2 카탈로그·재사용·디스패치 |

## §0. 개요 & 범위
```
┌ 린넨·배식 ┬ Clean Utility ┬ Dirty Utility ┐  서비스 스트립 (y1-9), 세로 분리벽 x9/x18
├──────── 중앙 간호 스테이션 · 복도 (y11-19) ─┤  ㄷ-데스크 + 핸드레일 + 기송관
├──── 4인용 일반 병실 A·B·C·D (y21-34) ───────┤  만성질환, 커튼 분리 (x8/x16/x23)
├ 1인실 (x0-13) ────┬ VRE 접촉 격리실 (x13-27) ┤  분리벽 x13, 하단 캠퍼스 문(x12-14)
└──────────────────┴────────────────────────┘
```
- **동선**(핸드오프): 하단 캠퍼스 문으로 진입 → 위로 병실·간호 스테이션. 4인실 = 만성질환(COPD/DM/간경변/NPO) 커튼 베이. VRE 격리실 = 접촉 격리(가운 카트·전용 혈압계·격리 사인).

## §1. 분해 (Decomposition)
| 단위 | 책임 | 파일 |
|---|---|---|
| 픽스처 | 28×52 레이아웃·엔티티·NPC | `fixtures/ward.ts` (신규) → `FIXTURES` 등록 |
| Ward 카탈로그 | ward2 오브젝트 11 + ward-local 4 + DeskPhone | `objects/wardEquipment.tsx` (신규) + `WardObjectView` |
| 공용 프리미티브 | ibed(ward)·imonitor·iiv·icurtain·icabinet(linen/supply)·ireception·ichair·iplant·nursestation(ㄷ)·vitals·walltv·sofa·wastebin·chartbinder·baylabel + **pharma의 pneumatictube·barcodescanner** | 기존 재사용 |
| 디스패치 | `WardObjectView`를 체인에 추가(Pharma 뒤, Shared 앞) | `objects/index.tsx` |
| 엘리베이터 | 타워 **8F**(일반 내과 병동) 진입, entry `{12,50}` | `map/ElevatorScreen.tsx` |
| 테스트 | 도달성·통행·커튼 차단·격리 분리벽·footprint | `map/ward-fixture.test.ts` (신규) |

## §3. 미해결 질문 — 해소됨
- **Q1 스코프** → **내과 병동만**(5g-f). 외과(surgward)·정형(orthoward)은 후속(같은 카탈로그+shared 재사용).
- **Q2 진입** → **엘리베이터 타워 8F**(이미 "일반 내과 병동" 표기). 하단 캠퍼스 문(x12-14)이 1인실|격리 분리벽 x13을 걸쳐 → entry는 1인실 쪽 `{12,50}`.
- **Q3 시나리오** → **라벨만**(scenarioId 후속). 마커 라벨만.

## §4. 구현 체크리스트
- [x] regions 7 / rooms 7 / collision(외벽·서비스 y10·세로 x9·x18·스테이션 y20·하단 y35·격리 x13)
- [x] threshold 10 · door(캠퍼스) · 커튼 3 · 격리 사인
- [x] 오브젝트 배치(린넨·클린·더티·스테이션·4인실·1인실·격리)
- [x] 신규 카탈로그 `wardEquipment.tsx`(16종) — footprint는 fixture props{w,h}로 제어(신규 타입 대부분 비충돌)
- [x] NPC 캐스트 11 + 마커(핫스팟 11)
- [x] `WardObjectView` 디스패치 + `FIXTURES` 등록 + 엘리베이터 8F
- [x] `ward-fixture.test.ts`(7)
- [x] tsc/jest + 시뮬레이터 렌더 확인

## §5. 검증 결과
- `tsc` 0 · `jest` **76/76**(ward-fixture 7: playerStart · 엘리베이터 도착 · 7 room 도달 · threshold 통행 · 4인실 커튼 차단+4 베이 도달 · 1인실\|격리 분리벽 차단+양쪽 도달 · 병상/싱크/격리카트 footprint).
- **시뮬레이터**(2026-07-13): 간호 스테이션(ㄷ-데스크·핸드레일·데스크폰·차트·기송관), 4인실(병상·커튼·모니터·낙상표지·마커), VRE 격리실(CONTACT ISOLATION 사인·격리 카트·전용 혈압계), 1인실 렌더 정상. 룸 포커스 마스크 각 방 정상.

## §7. 편차 로그 (SoT 대비)
| SoT | 실제 | 사유 |
|---|---|---|
| 뷰 무관 | scale 0.9 | 28폭 방 뷰포트 맞춤 |
| IBed `label="A · COPD"` 등 | 라벨 생략 | 공용 `ibed` 디스패치가 label 미지원(peds와 동일). 베드 식별은 후속 마커/시나리오로 |
| SVG `<text>`(NPO·금식/D5·NS·HS/ISOLATION/120) | shape 블록/생략 | 기존 카탈로그 규약(svg text 미사용). DIV 사인(IsoSign)만 RN View+Text 재현 |
| 캠퍼스 문 x12-14가 1인실\|격리 분리벽(x13) 걸침 | 유지(1:1) | entry만 1인실 쪽 `{12,50}`으로(x13=벽) |
| 시나리오 마커 | 라벨만 | ward 시나리오 콘텐츠 후속 |
나머지 좌표·오브젝트·NPC는 `interior-ward.jsx`와 1:1.
