# forin — Waypoint Status

**Framework:** [Waypoint](https://github.com/bingoring/waypoint)
**PRD:** [prd.md](prd.md) | [prd-tech.md](prd-tech.md)
**Design handoff:** [inputs/design-handoff_v21/](inputs/design-handoff_v21/README.md) (최신)
**Decisions (audit):** [DECISIONS.md](DECISIONS.md)
**Last updated:** 2026-08-10

> ✅ **홈 탭 + 동료 시스템(핸드오프 v20→v21) 구현 완료(2026-08-10).** Build Spec U1~U10 전부.
> 서버(마이그레이션·도메인·저장소·`GET /me/home`·동료 API 13종·콘텐츠 시드) + 모바일(탭 5개·홈 10모듈·
> 동료 4화면·프로필 카드). 실 DB 2사용자 E2E + 시뮬레이터 렌더 검증 + **스모크 48/0**(기존 24) + 계약 재생성.
> Build Spec `IMPLEMENTED`. 상세는 [`home-colleagues/`](02-construction/home-colleagues/build-spec-index.md).
>
> ✅ **2026-08 마감분**: 온보딩 화면 · 소셜 로그인(Apple/Google/**Kakao 공식 SDK**) · 로그아웃 ·
> 앱 식별자 `app.forin.mobile` 확정 · 브랜드 아이콘/스플래시 교체.
>
> 🏗 **이전 초점(2026-07): 시나리오 런타임 + 화면 플로우 마감.** 맵/부서 인테리어(2-5)는 완결. 그 위로 실제 학습 루프를
> 배선 중 — 브리핑→AI 다이얼로그(교정→리뷰랩 자동 등록)⇄퀴즈→클리어→성장 리포트/리뷰랩. 상세 진행은 아래 표 및
> [DECISIONS](DECISIONS.md) 2026-07-18~29 참조.
>
> ⚠️ **Handoff v8 채택(2026-06-27) — 맵/화면 대규모 재설계.** 5개 파빌리온 캠퍼스 + 엘리베이터 + 부서 마스터
> 블루프린트(ER/OR/ICU/Peds/Pharma 대형화) + 입원 병동(내·외·정형)·피부과 센터. **외래 클리닉 엔진(5d-iii)은 폐기**(redundant).

---

## Phase 1 — Inception (What)

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 1-1 Context Synthesis | [01-context-synthesis.md](01-inception/01-context-synthesis.md) | HUMAN_APPROVED |
| 1-2 Domain Model | [02-domain-model.md](01-inception/02-domain-model.md) | HUMAN_APPROVED |
| 1-3 Architecture Decision ⚠️ | [03-architecture-decision.md](01-inception/03-architecture-decision.md) | AI_PROPOSED |

## Phase 2 — Construction (How)

> 1-3 아키텍처 승인으로 확정(2026-06-08). + 콘텐츠 워크스트림 병행.

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 2-1 서버 기반 | [01-server-foundation.md](02-construction/01-server-foundation.md) | HUMAN_APPROVED |
| 2-2 도메인·콘텐츠 API + 계약 | [02-domain-content-api.md](02-construction/02-domain-content-api.md) | HUMAN_APPROVED |
| 2-3 AI 레이어 | [03-ai-layer.md](02-construction/03-ai-layer.md) | HUMAN_APPROVED |
| 2-4 모바일 기반 | [04-mobile-foundation.md](02-construction/04-mobile-foundation.md) | HUMAN_APPROVED |
| 2-5 맵/탐험 엔진 | [05-map-engine.md](02-construction/05-map-engine.md) | 재오픈 · v8 계획 HUMAN_APPROVED (5a~5e ✅ 엔진코어 · **5f 캠퍼스/엔진델타 + 5g 부서 마스터블루프린트 ×9** — §5v; 5f ✅ · 5g-a ER ✅ · 5g-b OR ✅ · 5g-c ICU ✅ · **5g-d Peds+NICU ✅**(외래·놀이·계측→4bed 병동→NICU 유리 전실·인큐베이터; pedsEquipment 16종) · **5g-e Pharmacy ✅**(수령창구·기송관→조제실·마약류 금고→무균 전실·에어샤워·무균조제실; pharmaEquipment 21종; 엘리베이터 타워 P1 + ER portal) · **5g-f 내과 병동 ✅**(서비스 스트립→간호 스테이션→4인 만성질환 병실(커튼)→1인실·VRE 격리; wardEquipment 16종; 엘리베이터 타워 8F) · 장비 handoff **v13**(2.5D+접지그림자) 전 부서 반영 · **5g-g 외과 병동 ✅**(처치·드레싱룸→간호 스테이션·보행→4인 수술후 병실→대수술 중증실; surgEquipment 8종·ward2 재사용; 엘리베이터 타워 7F) · **5g-h 정형외과 병동 ✅**(PT통로·석고실→간호 스테이션·보조기→4인 골절/견인 병실→고관절 골절실; orthoEquipment 11종; 엘리베이터 타워 6F) · **입원 병동 3종 완결**(내과 8F·외과 7F·정형 6F) · **5g-i 피부과 센터 ✅**(로비→진료실1/2→광선치료실→레이저 처치실; dermEquipment 11종; 엘리베이터 타워 2F) · **🎉 5g 부서 마스터블루프린트 9종 전부 완결**) |
| 2-6 화면·플로우 | [06-screens-flows.md](02-construction/06-screens-flows.md) | **완료(2026-08-10)** — 온보딩(splash/login/locale/job/level) ✅ · 캠퍼스/인테리어/상황판 ✅ · 브리핑→**AI 다이얼로그**(🎤 STT/🔊 TTS·번역·QUICK INFO)⇄**퀴즈 10종**→클리어(result) ✅ · **프로필(나) + 성장 리포트(/growth 푸시)** ✅ · **리뷰랩**(PhraseCard·필터·복습 세션·맥락·등급 안내) ✅ · 뱃지/스티커 탭 상세 ✅. **소셜 로그인 마감(2026-08)**: Apple/Google/Kakao 실동작 확인 — Google은 iOS/Android 클라이언트 등록 검증, Kakao는 **공식 SDK(@react-native-kakao)로 전환**(직접 OIDC는 KOE033으로 차단됨). 프로필 탭 **로그아웃** 추가. 앱 아이콘·네이티브 스플래시를 브랜드 픽셀 아트로 교체(Expo 기본값 제거).
**홈 탭 + 동료 시스템 ✅(2026-08-10)**: 앱 진입 첫 화면을 목록(커리어 탭)에서 **오늘의 한 가지**로 교체. 홈 10모듈 전부 실데이터(`GET /me/home` 1왕복) — 값 없으면 모듈을 숨긴다(더미 금지). 동료는 초대 코드 기반이며 관계 타입 `peer/mentor/mentee`를 처음부터 데이터에 둬 **멘토–멘티 확장 시 화면 수정 불필요**. [Build Spec](02-construction/home-colleagues/build-spec-index.md)
**온보딩 저장/재진입 ✅(2026-08-10)** — 검증 중 결함 2건 발견·수정: ①선택값이 라우트 파라미터로만 존재해 **중간 이탈 시 3단계가 유실**됐다 → 기기 로컬 드래프트에 단계별 저장 + 게이트가 **중단 지점부터 재개**(부분 저장을 서버에 보내면 `onboarded=true`가 찍혀 나머지를 영영 건너뛴다) ②온보딩 완료·로그인 후 목적지가 여전히 `/campus`였다(홈 탭 도입 시 게이트만 고친 회귀) → `/(tabs)`. 재진입 스킵 자체는 정상이었다(`onboarded: null` 초기값 덕에 깜빡임 없음).
**2-6 완료.** (클리어 컨페티는 감사 결과 `result/[id].tsx`에 **이미 구현돼 있었음**) |
| 2-7 성장·경제·복습·이벤트 전달 | [07-growth-economy-review.md](02-construction/07-growth-economy-review.md) | **체크리스트 전 항목 완료(2026-08-10)** — XP/레벨/커리어 패스 ✅ · SM-2 복습(스케줄·마스터리·세션) ✅ · 성장 집계 `GET /me/stats`(기기 TZ 버킷팅) ✅ · 칭찬 스티커(시나리오 클리어당) ✅. **평판→NPC 반응 가중 ✅(2026-08-10)** — 소비 측(NPC 톤 4밴드)은 이미 있었고 **생산 측이 통째로 없어** 전원이 기본값 50에 고정돼 있었다. 등급 기반 획득 + 차원 결정을 **부서가 아닌 시나리오 긴급도**로(모든 병동·직업 확장 대비) 구현. [Build Spec](02-construction/reputation/build-spec-index.md). **유기적 환류 ✅(2026-08-10)** — 보상이 **입장 조건**으로 재사용된다: 방·핫스팟이 `requires`를 선언하고 `GET /me/access/{interiorId}`가 학습자 스냅샷(레벨·클리어·칭호·평판·미션)으로 평가해 잠금과 **이유**를 돌려준다(`domain/access`). ER 트라우마 룸이 첫 사례.
**감사(2026-08-10):** 아래는 "남음"으로 적혀 있었으나 **실제로는 이미 구현돼 있었음** — 칭호·히든미션(서버 영속 확인) · 일일 풀 00:00 리셋+가중 샘플링(`content_repo.go:461`) · 메인 루트 그래프 · 보상형 광고 top-up · 경제 수치 테이블(25필드 `GET /config/economy`). 2-7 체크리스트 전 항목 완료. |
| 2-8 통합·E2E | [08-integration-e2e.md](02-construction/08-integration-e2e.md) | AI_PROPOSED — **전체 여정 스모크 `server/scripts/e2e_smoke.sh`(48 assert, 48/0 pass, 재실행 가능)**: 인증·온보딩·토큰 회전·커리큘럼·대화+교정·클리어(XP)·SM-2·일일풀+광고·미션·부서 상황·에러 경로. 남음(Phase 3 이관): AI 비용·지연 모니터링·분석 이벤트·성능/부하·스토어 메타·권한·개인정보 |

**병행 트랙:** [콘텐츠 워크스트림](content-workstream.md) — AI 작성(조사→초안→검수), **2-2 포맷 확정 후 본격 착수**. PENDING.

## Phase R — Independent Code Review 🔍 (Construction → Operations 게이트)

> 작성자와 **컨텍스트가 분리된** 독립·적대적 리뷰어가 코드를 검토한다. FRAMEWORK "리뷰 게이트" 참조.

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| R-1 Independent Code Review (2-5 맵 엔진 스코프) | [01-independent-review.md](0R-review/01-independent-review.md) | AI_PROPOSED (HIGH 1·MEDIUM 3·LOW 3·NIT 2 채택·수정; +6 테스트) |
| R-2 Independent Code Review (2-6~2-8: 런타임·성장·커리큘럼·캠퍼스) | [02-independent-review.md](0R-review/02-independent-review.md) | AI_PROPOSED — 3 분리 에이전트 병렬 리뷰. **채택·수정 5**(Critical 2: warm 칭호 보너스 유실·top-up 레이스; Important 1: dept 캡 누적; Moderate 1: convSeconds 자정 clip; 하드닝 1). 스모크 24/0 재통과 |

## Phase 3 — Operations (Ship)

| 스테이지 | 문서 | 상태 |
|---------|------|------|
| 3-1 Deployment | [01-deployment.md](03-operations/01-deployment.md) | PENDING |
| 3-2 Monitoring | [02-monitoring.md](03-operations/02-monitoring.md) | PENDING |

---

## AI 진입점

> Construction(2-5~2-8) 완료 + Phase R 리뷰 게이트 통과(R-1 맵 엔진·R-2 런타임/성장/커리큘럼/캠퍼스, 채택 결함 수정·스모크 24/0).
> 다음: **Phase 3 Operations**(3-1 배포 → 3-2 모니터링). 병행 **콘텐츠 워크스트림**(커리큘럼 챕터 3~5 스텝 시나리오 저작). Operations 진입은 사람 승인 대기.
> 규칙: [`FRAMEWORK.md`](../../FRAMEWORK.md) 참조
