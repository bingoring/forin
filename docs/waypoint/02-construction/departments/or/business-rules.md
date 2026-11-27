---
artifact: business-rules
build-spec: departments/or
status: IMPLEMENTED
updated: 2026-07-01
---

# Business Rules — 5g-b OR (통행·차단)

> 공통 규칙(R1-R6)은 [er/business-rules.md](../er/business-rules.md). 여기선 OR 고유(3단계 존·sterile).

## 1. OR 고유 규칙
| ID | 규칙 | 대상 |
|---|---|---|
| OR-1 | 제한(OR) 진입 통로는 `tone:'sterile'`(파란) threshold | y31 통로·or1/scrub·scrub/or2 |
| OR-2 | OR1/OR2 바닥 초록 tint = 양압·수술 조도(비차단) | t-or1·t-or2 |

## 2. collision (벽)
- 외벽: 상단 `{0,0,17,1}{21,0,19,1}`(캠퍼스 문 x17-20 gap) · 좌우 `{0,1,1,50}{39,1,1,50}` · 하단 `{0,51,40,1}`.
- divider y14(비제한/준제한)·y31(준제한/제한): 각 `{1,_,4,1}{8,_,9,1}{20,_,9,1}{32,_,7,1}` — 통로 x5-7/x17-19/x29-31.
- 세로: preop|util x13(gap y18-20) · util|pacu x20(gap y19-21) · clean|dirty y22(gap x16-17) · family|locker x19(gap y6-8) · or1|scrub x15·scrub|or2 x23(gap y36-38).

## 3. threshold·door·tint (통행/오버레이)
- **threshold**(통행): y14 `x5w3→Pre-Op`·`x17w3→복도`·`x29w3→PACU` / y31 **sterile** `x5w3 STERILE→OR1`·`x17w3→스크럽`·`x29w3 STERILE→OR2` / 세로 x13 y18·x20 y19·clean/dirty x16 y22·family/locker x19 y6 / or1·scrub x15 y36·scrub·or2 x23 y36(sterile).
- **door**(auto): 캠퍼스 `x17 y0 w4`.
- **tint**(비차단): t-or1 `1,32,14,19 #CDE3D6 .28` · t-or2 `24,32,15,19 #CDE3D6 .28`. glass 없음.

## 4. footprint (솔리드 차단)
anesthesia/roboticconsole/carm/sinkor{2,2} · bairhugger/bovie/laptower/co2insufflator/soiledcart{1,2} · kickbucket{1,1} · ibed 등. skip: door·threshold·tint·icurtain·nursestation.
