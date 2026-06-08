---
phase: 02-construction
stage: 05-map-engine
status: PENDING
updated: 2026-06-08
---

# [Stage 2-5] 맵 / 탐험 엔진 (품질 축)

## 목적

타일 기반 캠퍼스/인테리어 엔진 — 자연스러운 이동·충돌·룸마스크·맵 간 전환, 캐릭터/Face SVG.
forin 품질 3대 축 중 하나(자연스러운 탐험).

## 입력 (Inputs)

- 맵 엔진: [`../inputs/design-handoff/05_MAP_AND_INTERIORS.md`](../inputs/design-handoff/05_MAP_AND_INTERIORS.md)
- 캐릭터: [`../inputs/design-handoff/03_CHARACTERS.md`](../inputs/design-handoff/03_CHARACTERS.md)

## 체크리스트

- [ ] 타일 렌더러(ITILE 16·ZOOM 2), 바닥 프리베이크/가시 오브젝트 렌더(성능)
- [ ] **충돌맵**(저작 레이어) + 이동(D-pad + 탭-투-패스, reanimated)
- [ ] 룸마스크("한 방만 밝게") + 리전 전환 오버레이, 카메라 팔로우
- [ ] 캐릭터 `Sprite`/`Face`(react-native-svg) + 결정적 외형 해시
- [ ] 인테리어 오브젝트 카탈로그 포팅, 핫스팟 → 브리핑 진입, fast-travel

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

*[승인 후 작성]*

## 검토 게이트 (Human Gate)

- [ ] 이동·충돌·전환이 자연스럽고 성능이 충분한가?
- [ ] 비주얼이 핸드오프와 일치하는가?

## 다음 단계

승인 후 → 구현 → `STATUS.md` 갱신 → `06-screens-flows.md`
