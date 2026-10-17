# 08 — 여정 지도(Journey) 리소스 정의

> `forin Notebook - Journey.html` / `forin-notebook-journey.jsx` (2026-09)
> 일터 탭 커리큘럼 뷰의 컴포넌트·에셋·토큰 명세. 개발 이식 시 이 문서 기준.

## 1. 화면 구성 (3종)
| 화면 | 컴포넌트 | 역할 |
|---|---|---|
| A 여정 지도 | `JourneyMap` | 일터 탭 기본 뷰 — 목표 부서 트랙 경로 + 자유 탐방 |
| B 정거장 상세 | `StationSheet` | 정거장 탭 시 바텀시트 — 스텝 목록(대화/퀴즈/시험) |
| C 면허 로드맵 | `LicenseTrack` | 국가 트랙 타임라인 — 마일스톤 깃발과 동일 데이터 소스 |

## 2. 공유 컴포넌트 (기존 NbUI 재사용 — forin-notebook-ui.jsx)
| 컴포넌트 | 이 화면에서의 용도 |
|---|---|
| `NbPaper` | 자유 탐방 칩 · 현재 정거장 바 · 정거장 스텝 행 · 로드맵 카드 (±0.3~0.8° 기울임) |
| `NbButton` | `variant="ink"` — 이어서/시작 CTA |
| `NbTag` | 트랙 태그(레드) · 도장 카운트(그린) · 진행 중(앰버) · 국가 태그(블루) |
| `NbMemo` | 통과전 안내(블루) · 면허 연동 문구(그린) — 점선 메모 박스 |
| `NbCheck` | 미션/스텝 체크 |
| `NbProgSquares` | 정거장 진행 네모칸 (total/done, size 9) |
| `NbIcon` | 부서 아이콘: siren(ER)·monitor(ICU)·pill(약국)·baby(분만)·bandage(외과)·me(정신과) / 스텝: speech·pencil·trophy·lock |

## 3. 이 화면 전용 신규 요소 (forin-notebook-journey.jsx 내부 정의)
| 요소 | 명세 |
|---|---|
| `Station` (SVG) | 정거장 노드 4상태. **done** = PASSED 이중선 도장: r24 그린 서클 + r19 내부선, -12° 회전, PASSED 모노 6.5px + 손글씨 라벨. **here** = r30 잉크 서클 + 앰버 파선(5 4) 링 + HERE 깃발(기둥 2px, 빨간 삼각 깃발, translate(12,-48)). **next** = r26 잉크 1.8px 열린 원. **locked** = r25 점선 원(4 3), opacity .45 |
| 협업 링 | 협업 정거장에만: 블루 점선 링(r32, here면 r36, 3 3) + 상단 라벨 rect 80×16 `rgba(74,111,165,.1)` + "협업 · ER→ICU" 모노 8px 블루, -2° |
| 경로 | Q-커브 지그재그 점선: 미완 `rgba(62,54,43,.28)` 2.2px, 완료 구간 그린 2.6px, dash 7 7. 중간점 x, prev.y+14 제어점 |
| 마일스톤 깃발 | rect 80×34 종이 + 모노 8px 타이틀(블루) + 손글씨 11px 상태 — 열림 전 opacity .55 |
| 자유 탐방 칩 | NbPaper 가로 스크롤, 아이콘 17 + 손글씨 14 + 도장 카운트(모노 9 그린). 잠금 없음 |
| 타임라인 축 (C) | 원 20px(완료 이중선 ✓/번호) + 점선 세로 연결선(완료 구간 그린) |

## 4. 데이터 모델 (이식용)
```
Station: { x, y, state: 'done'|'here'|'next'|'locked', label,
           meta: { sub?: '공통 필수'|'ER', collab?: 'ER → ICU' } }
Track:   { dept: 'ER', stations: Station[], milestones: [{ title, status, unlockAfter }] }
FreeRoam: [{ icon, dept, stamps }]
LicenseStep: { title, sub, state, when, progress?: {total, done} }
```

## 5. 설계 원칙 (재발 방지)
- **일렬 전 부서 통과 금지.** 경로 = 공통 필수 → 목표 부서 심화 → 협업 정거장(타 부서는 항상 "내 부서 시점의 상황"으로만 등장) → 자유 탐방(잠금 없음).
- 협업 정거장은 반드시 파란 점선 링 + "협업 · A→B" 라벨로 시각 구분 — 목표 부서 정거장과 혼동 금지.
- 정거장 통과 = 여권 PASSED 도장 세계관 유지 (온보딩 입국 도장과 동일 문법: 이중선 원 + 회전 + 모노 캡션).
- 지도 스크롤 콘텐츠 하단 패딩 ≥96px (고정 '현재 정거장' 바에 가리지 않게).
- 원 안 라벨: 손글씨 4자 기준 — here r30 / next r26 / locked r25 / done r24 미만으로 줄이지 말 것.
- 면허 로드맵과 지도 마일스톤은 같은 소스 — 한쪽만 갱신 금지.

## 6. 색 토큰 (NB 팔레트 준수 — 신규 색 없음)
ink #3E362B · soft #9A8F7C · red #C75146 · blue #4A6FA5 · green #5F8D5A · amber #C77E2E · paper #FFFdf4 · bg #F1EBDD
