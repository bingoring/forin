---
artifact: business-rules
build-spec: departments/icu
status: IMPLEMENTED
updated: 2026-07-01
---

# Business Rules — 5g-c ICU (통행·차단)

> 공통 규칙(R1-R6)은 [er/business-rules.md](../er/business-rules.md). 여기선 ICU 고유(유리벽 1인실).

## 1. ICU 고유 규칙
| ID | 규칙 | 대상 |
|---|---|---|
| ICU-1 | 1인실 벽은 정적 collision에 없음 — glass objectCollision으로 차단(시야 투과) | g-v1/2/3 세로 + y17 경계 glass |
| ICU-2 | 각 방 y17 경계 폭1 auto door만 통행 | d-r1..4 |
| ICU-3 | 방 위 어두운 tint = ICU 저조도(비차단) | t-rooms |

## 2. collision (벽)
- 외벽: 상단 `{0,0,34,1}` · 좌우 `{0,1,1,42}{33,1,1,42}` · 하단 `{0,43,6,1}{9,43,24,1}`(캠퍼스 문 x6-8 gap).
- divider y30(허브/지원, 통로 x5-7/x13-15/x22-24): `{1,30,4,1}{8,30,5,1}{16,30,6,1}{25,30,8,1}`.
- 지원 세로 x13·x23(gap y35-37): `{13,31,1,4}{13,38,1,5}` · `{23,31,1,4}{23,38,1,5}`.

## 3. glass·door·threshold·tint
- **glass**(차단): 세로 `x8 y1 h16`·`x16`·`x24`. y17 경계 각 방 `x1w3·x5w3`(R1)/`x9w3·x13w3`(R2)/`x17w3·x21w3`(R3)/`x25w3·x29w4`(R4).
- **door**(auto, 통행): 각 방 y17 폭1 `x4`(R1)·`x12`(R2)·`x20`(R3)·`x28`(R4). 캠퍼스 `x6 y43 w3`.
- **threshold**(통행): `x5 y30 w3→면회`·`x13 y30 w3→오염`·`x22 y30 w3→MED` · 세로 x13 y35·x23 y35.
- **tint**(비차단): t-rooms `1,1,32,16 #26354D .16`.

## 4. footprint (솔리드 차단)
crrt/ttmunit{2,2} · ivpumptower/evdstand/icpmonitor{1,1} · glass는 props.w/h로 차단 · ibed 등. bankofmonitors는 CEILING(비차단 배경).
