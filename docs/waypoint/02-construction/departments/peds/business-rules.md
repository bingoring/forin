---
artifact: business-rules
build-spec: departments/peds
status: DRAFT
updated: 2026-07-10
---

# Business Rules — 5g-d Peds+NICU (통행·차단)

> 공통 규칙(R1-R6)은 [er/business-rules.md](../er/business-rules.md). 여기선 Peds 고유(NICU 유리 전실).

## 1. Peds 고유 규칙
| ID | 규칙 | 대상 |
|---|---|---|
| P-1 | NICU 진입은 **유리벽(x9) + sterile threshold(y34-36)** 경유만 — 3분 스크럽 전실 동선 강제 | g x9, th x9 y34 |
| P-2 | NICU 존 저조도 tint(비차단) | t-nicu |
| P-3 | 놀이매트(#FED7AA 바닥 rect)는 비차단 장식 | welcome play area |

## 2. collision (벽) — 통로 = gap
- 외벽: 상단 `{0,0,15,1}{18,0,16,1}`(캠퍼스 문 x15-17 gap) · 좌우 `{0,1,1,46}{33,1,1,46}` · 하단 `{0,47,34,1}`.
- **divider y14**(welcome/exam+ward): `{1,14,4,1}{8,14,8,1}{19,14,14,1}` — 통로 gap x5-7(→진료실)·x16-18(→병동).
- **exam|ward divider x11**: `{11,15,1,5}{11,23,1,6}` — 통로 gap y20-22.
- **divider y29**(mid/NICU): `{1,29,4,1}{8,29,25,1}` — 통로 gap x5-7(→NICU 전실).
- **NICU ante|zone x9**: 정적 collision 없음 — glass 오브젝트가 objectCollision 차단(스크럽 통로 y34-36만 통행).

## 3. threshold·door·glass·tint (통행/오버레이)
- **threshold**(통행): `x5 y14 w3 →진료실` · `x16 y14 w3 →병동` · `x11 y20 w1h3`(exam↔ward) · `x5 y29 w3 →NICU 전실` · **`x9 y34 w1h3 tone:sterile "스크럽 후 입장"`**.
- **door**(auto): 캠퍼스 `x15 y0 w3`.
- **glass**(objectCollision 차단): `x9 y30 w1h4` · `x9 y37 w1h9`.
- **tint**(비차단): t-nicu `x1 y30 w32 h16 #1E2A40 op0.15`.

## 4. footprint (솔리드 차단)
차단: incubator{2,2} · metalcrib{2,3} · ibed{2,3} · babyscale{1,1}? · stadiometer{1,1} · milkfridge{1,2} · sinkor{2,2} · nursedeski(ㄷ/바) · toychest{2,1} · rockinghorse{2,1} · smallslide{2,2} · ivpump · clinicreception(props.w/h).
비차단(미등록): dosingchart·mural·stickerroll·tonguejar·ivboard·balloon(벽/탁상/장식) · phototherapy(천장 CEILING/OVERHEAD) · 놀이매트 rect · bpcuff·sanitizer(벽).

## 5. 엣지케이스
| 케이스 | 조건 | 기대 |
|---|---|---|
| NICU 우회 진입 | 유리벽 통과 시도 | glass footprint로 차단, 스크럽 통로만 |
| playerStart {18,20} | 병동 입구 | open(통로 gap y20-22 인접) — 도달성 테스트로 확인 |
| 놀이방 오브젝트 밀집 | slide/horse/chest 인접 | footprint로 겹침 차단, 통로 확보 |
