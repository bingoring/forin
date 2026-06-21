---
phase: 0R-review
stage: 01-independent-review
status: AI_PROPOSED
updated: 2026-06-21
scope: 2-5 맵/탐험 엔진 (mobile)
---

# [Stage R-1] Independent Code Review 🔍 — 2-5 맵 엔진

## 목적

작성자(구현 주체)와 **컨텍스트가 분리된** 독립·적대적 리뷰어가 2-5 맵 엔진 산출물(코드+테스트)을 검토하여
설계 게이트가 놓치는 코드 레벨 결함을 잡고, 진짜 결함을 수정한다.

**왜 2-5만 지금:** 5d-v/5d-iv/5e + idle 모드를 AI가 자율로 작성하며 "테스트 통과"를 **자기보고**만 했다.
이 게이트가 겨냥하는 자기확증 편향이 가장 큰 영역이라 우선 스코프드 리뷰. (전체 Construction→Operations
게이트는 2-6~2-8 완료 후 별도로 수행.)

## 입력 (Inputs)

- Construction 2-5 산출물: `mobile/src/engine/**`, `mobile/src/map/**`, `mobile/tsconfig.json`, `mobile/package.json`(jest)
- 설계/결정: `../02-construction/05-map-engine.md`, `../DECISIONS.md`
- 리뷰어 지시: `../../_templates/reviewer-brief-template.md` (채워서 사용)

## 체크리스트

- [x] 독립 리뷰어(작성자와 분리된 별도 에이전트)로 적대적 리뷰 실행 — 컨텍스트 분리된 3개 서브에이전트
- [x] findings 를 severity 별로 정리하고 **각 항목 검증**(맹목 수용 금지)
- [x] 진짜 결함 수정 + 회귀 테스트 추가
- [x] 반박 항목은 근거 기록
- [x] 수정 후 test/build/coverage 재확인 — tsc 0 · jest 36/36(+6) · expo export 번들 · doctor 21/21

## AI 제안 (AI Proposal)

> ⚠️ 이 섹션은 AI가 작성합니다. 사람이 직접 수정하지 마세요.

### 방식

세 명의 **컨텍스트 분리된** 독립 리뷰어 서브에이전트(작성 세션과 분리, refute 기본값)에게
다관점 적대 리뷰를 의뢰:
- **R-A 엔진 로직·정확성** — coords/collision/regions/gridmover/footprint + useMovement/useGridMover (경계·엣지·종료·idle) + 테스트 적정성.
- **R-B RN 렌더·런타임** — InteriorScreen 카메라/스케일(transformOrigin·클램프·탭좌표) + landmarks/AmbientNpc/Sprite(reanimated)/TileFloor.
- **R-C 5e 추출 무결성** — @engine 경계 누수·배럴·import 재작성·tsconfig/jest 매퍼·src/engine vs packages 결정·이동 잔여물.

받은 findings 는 그대로 구현하지 않고 각각 검증 후 채택/반박.

총 17건 보고(R-A 8 · R-B 8 · R-C 2 중복 제외). CRITICAL 0, HIGH 1. 9건 채택(수정), 8건 반박/보류.
세 리뷰어 모두 핵심 신규 기능(`idle` 정지·정면 고정, 5e 추출 무결성)은 **정상**으로 확인 — R-C는 자체적으로 tsc/jest를 돌려 모든 `@engine` import 해소·forin 디커플(엔진 내 `@/`·상위상대 0)을 검증.

### 채택한 결함 (수정함)

| # | 심각도 | 결함(리뷰어) | 수정 | 테스트/검증 |
|---|--------|------|------|--------|
| 1 | **HIGH** | (R-B) `scale≠1`에서 탭→타일 매핑이 어긋날 위험 — `locationX/TILE`가 스케일드 좌표계면 1/scale 오차. 변환 Pressable의 locationX 좌표계가 플랫폼 의존이라 단정 불가 | InteriorScreen 구조 변경: **Pressable=스케일드 크기+translate만**(locationX∈[0,worldW·scale] 확정) · **내부 wrapper가 `scale`+`transformOrigin:'top left'`** 담당 → `⌊loc/(TILE·scale)⌋`로 결정론화. scale=1은 기존과 동일(인테리어 무회귀) | expo export 번들 OK; 시각 정합은 디바이스 확인(아래 게이트) |
| 2 | MEDIUM | (R-A) useGridMover: emote/pause 분기가 진행 중 `walkClear` 타임아웃을 안 지워 `walking:false`가 스텝 중간에 쓰일 레이스 | 두 분기 진입 시 `clearWalk()` | jest 36/36 |
| 3 | MEDIUM | (R-A) idle이 매 틱 불필요한 `walkClear` 타이머를 arm | 스텝이 실제 walking을 set했을 때만 arm(idle은 never) | — |
| 4 | MEDIUM | (R-A) patrol: 스펙(path/start) 변경 시 `patrolRef`·위치 미리셋 → 첫 틱에 다중 타일 점프(1타일/틱 불변식 위반) | mode/path/bound/start 변경 시 재시드 effect 추가 | moverStep 단위 테스트(fresh state→start부터 1타일) |
| 5 | LOW | (R-A) `patrolStep` post-advance 웨이포인트 읽기 미클램프(잠재 `undefined`→throw) | 양쪽 읽기에 `clampIdx` | `patrolStep` out-of-range target 비throw 테스트 |
| 6 | LOW | (R-B) `landmarks.tsx` `win()` 중첩 map이 key 없음 | `win`에 key 파라미터 | tsc/expo OK |
| 7 | LOW | (R-B) landmark `w/h`가 `as number` 무가드 → 음수/0 레이아웃 | `Math.max(1, typeof==='number'?…)` | — |
| 8 | NIT | (R-C) 배럴/README "Metro watchFolders" 오기(실제는 tsconfig paths) | 문구 정정(watchFolders 불필요 명시) | — |
| 9 | NIT | (R-C) README가 `packages/` 판단에서 `@contract`(types-only) 예외를 누락 | 캐비엇 문장 추가 | — |

부수 개선: per-tick 결정을 순수 함수 **`moverStep(mode,pos,opts,state,rng)`**로 추출(useGridMover가 사용) → idle/patrol/wander가 결정론적 단위 테스트 가능해짐(R-A "훅·idle 테스트 0" 공백 해소). **+6 테스트**.

### 반박/보류한 findings (근거)

- **[MEDIUM] (R-B) 카메라가 스프라이트 시각 중심이 아닌 타일 중심을 따라감(~0.6타일)** — 반박: 의도된 동작(타일 중심 추적). 결함 아님, 주석으로 명확화.
- **[MEDIUM] (R-B) 모든 스프라이트의 idle/호흡 애니가 오프스크린 포함 영구 구동·컬링 없음** — 보류(백로그): 2-5 증분이 도입한 게 아닌 기존 구조이고, 현 맵 규모(캠퍼스 28×20, NPC ≤6)에선 비용 미미. 컬링은 알려진 후속 최적화.
- **[LOW] (R-B) 중단된 스텝에서 walk-gate vs clock 스냅** — 보류(백로그): 1프레임 시각 글리치, 리뷰어 자체 하향. 
- **[LOW] (R-A) useMovement `blocked` memo가 `interior` 전체에 의존** — 반박: 픽스처는 모듈 상수(안정 identity), 코어스 의존 허용 범위. 계약(불변 스펙)으로 문서화.
- **[LOW] (R-A) `moveDir`가 막힌 범프에도 facing 설정** — 반박: 의도된 제자리 회전. `moveTo`→`findPath`→`canEnter`로 무해 확인.
- **[LOW] (R-B) `locationX` 미클램프 edge 탭** — 반박: `moveTo`가 `findPath`/`canEnter`로 경계 검사(off-map 타깃→빈 경로). 무해.
- **[NIT] (R-A) useGridMover가 `Math.random()` 직접 사용(테스트 불가)** — 부분 수용: per-tick *결정*은 이제 rng 주입 순수 `moverStep`(테스트됨). 훅의 emote 난수는 앰비언트로 유지(스레딩 불필요).
- **[NIT] (R-B) AmbientNpc `walkClock`이 dir/emote 변경 시 재발화** — 반박: effect deps는 `[x,y,…]`라 dir/emote-only 변경(x,y 동일)엔 재발화 안 함. 미발생.

### 수정 후 재검증

- **tsc 0 · jest 36/36(+6 moverStep) · `expo export` Metro 번들 성공 · expo-doctor 21/21.**

## 검토 게이트 (Human Gate)

- [ ] 채택/반박 판정에 동의하는가?
- [ ] 수정된 결함(특히 HIGH #1 탭 매핑)이 적절히 해결되었는가?
- [ ] **디바이스 확인 1건**: 캠퍼스(scale 0.7)에서 특정 타일을 탭→그 타일로 이동하는지(구조적으론 결정론화했으나 시각 정합은 기기 확인 권장).
- [ ] (2-5 한정) 리뷰 결과 수용 — 후속 스테이지 진행을 승인하는가?

## 다음 단계

승인 후 → `STATUS.md` 의 R-1 을 `HUMAN_APPROVED` 로. (Operations 진입 전 전체 Construction 대상 풀 게이트 별도.)
