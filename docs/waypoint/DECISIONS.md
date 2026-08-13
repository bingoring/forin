# forin — 결정 로그 (Decision Log / Audit)

> **append-only 감사 추적.** 중요한 결정 1건 = 항목 1개. *왜/대안/결정자*를 남겨, 최종 문서엔
> 증류되지 않는 "결정 provenance"를 보존한다. 스테이지 문서(*무엇을/결과*)·git 커밋과 상호보완.
> 원시 대화 트랜스크립트는 적재하지 않는다(노이즈·시크릿 위험). AI가 결정 시점마다 한 항목씩 추가한다.

형식: `날짜 · 제목` → 결정 / 근거 / 대안(탈락) / 결정자.

---

## 2026-06-04 · 레포 토폴로지 = 모노레포
- **결정:** 단일 `bingoring/forin` 모노레포(mobile/ + server/ + packages/contract/ + docs/dlc 서브모듈).
- **근거:** Go↔TS 계약 코드젠을 한 커밋으로 원자적 동기화, 솔로 개발 오버헤드 최소.
- **대안(탈락):** 분리 레포(forin-mobile/forin-server) — 계약 드리프트·교차조율 부담.
- **결정자:** 사용자.

## 2026-06-04 · 기존 자산 보관 후 새출발
- **결정:** 기존 master를 `archive/pre-waypoint`로 보관 후 깨끗한 monorepo를 force-push. forin은 public.
- **근거:** 이전 forin 기획(DB스키마·API스펙 등)을 잃지 않으면서 새 구조로 출발.
- **결정자:** 사용자.

## 2026-06-04 · 서버 = Go, 계약 = Go-first
- **결정:** 서버 Go. API 계약은 Go-first(swag → openapi.yaml → openapi-typescript).
- **대안(탈락):** Node/NestJS·Python(언어 일원화 못함), gRPC(RN 부적합), OpenAPI-first(계약을 코드보다 앞세움).
- **결정자:** 사용자.

## 2026-06-08 · 서버 프레임워크 없음(stdlib)
- **결정:** 웹 프레임워크 없이 `net/http`(stdlib) + 필요한 라이브러리만 선별.
- **근거:** 확장성·코드 구조 통제. 프레임워크 락인 회피.
- **대안(탈락):** Echo/chi/Fiber.
- **결정자:** 사용자.

## 2026-06-08 · AI(LLM 대화+교정+음성)는 MVP 핵심
- **결정:** 실시간 LLM 대화·문맥 교정·음성(STT/TTS)을 모두 MVP에 포함.
- **근거:** "AI와 대화하며 상황 해결 + AI 교정"이 forin의 핵심 가치. 이전 'Patch 1 분리'를 사용자가 번복.
- **결정자:** 사용자.

## 2026-06-08 · 아키텍처 게이트(1-3, 비가역)
- **결정:** 헥사고날(포트/어댑터); Postgres + pgx/sqlc + golang-migrate + Redis; **자체 발급 인증**(Apple/Google/Kakao
  네이티브 → 서버 검증 → 자체 JWT+refresh); LLM=Claude 티어링(대화 Sonnet / 교정 Haiku); STT 온디바이스;
  발음=Azure; TTS expo-speech; 호스팅 Fly.io+Docker; CDN 후순위.
- **근거:** Kakao 1급 지원 위해 매니지드(Clerk) 대신 자체 발급; 포트/어댑터로 제공자 교체 국소화.
- **대안(탈락):** Clerk/Supabase(Kakao 비1급), GORM/ent(제어↓), ECS(솔로 운영부담), Cloudflare Workers(Go 런타임 부적합).
- **결정자:** 사용자(게이트 승인).

## 2026-06-08 · 콘텐츠 시스템 = 스키마 주도
- **결정:** 포맷이 아닌 **스키마+검증+적재 이음새**가 본질. git 버전드 파일(직군 네임스페이스) → Postgres.
  웹 CMS는 후속 패치 이음새. 시나리오는 타입 스텝(dialogue/quiz/**effect**/branch) + 선언적 디렉티브(클라 이펙트 레지스트리).
- **근거:** 도구 교체·확장성. 화재 같은 연출을 데이터로(스키마·엔진 불변, 핸들러만 추가).
- **결정자:** 사용자.

## 2026-06-08 · 진료과 확장 범위 = A
- **결정:** MVP는 디자인된 5개 워드(ER/OR/ICU/Peds/Pharmacy) 내 300+ 집중. 신규 진료과(내과/외과/…)는 로드맵(인테리어 art 준비 시).
- **근거:** 비주얼 완성도 100%로 즉시 출시 가능. 진료과는 데이터라 스키마 변경 없이 후속 확장.
- **대안(탈락):** B(상황판 전용)·C(진료과별 art 즉시 제작).
- **결정자:** 사용자.

## 2026-06-09 · persona는 콘텐츠
- **결정:** 대화 상대 persona(역할·연령대·성격·말투·감정)를 `Scenario.persona`(콘텐츠)로 저작. 모든 시나리오에 포함.
- **근거:** 현실적 롤플레이. 콘텐츠라 신규/기존 모두 일괄 적용 + 워크스트림에서 대량 작성.
- **결정자:** 사용자(제기).

## 2026-06-09 · LLM 프롬프트 언어 비하드코딩
- **결정:** 대화·교정 프롬프트를 프로필의 `nativeLang`+`targetLang`(+직군)로 구동. "English/Korean" 하드코딩 제거.
  Profile에 `target_lang` 추가, `en_level`→`target_level`.
- **근거:** 학습 언어 변경 시 깨지지 않도록. LLM 프롬프트는 engine.go 두 곳뿐 — 모두 수정.
- **결정자:** 사용자(제기).

## 2026-06-09 · 콘텐츠 다국어화 = 필수 후속(백로그)
- **결정:** persona·goals 등 **콘텐츠 텍스트 자체의 다국어화**는 반드시 수행할 후속 과제로 등재(현재 한국어 저작).
- **상태:** 백로그(미착수). 비한국어 모국어 사용자 지원에 필요.
- **결정자:** 사용자.

## 2026-06-10 · LLM 제공자 전환 = OpenAI(설정 가능)
- **결정:** LLM 제공자를 **설정으로 선택**(`LLM_PROVIDER`: anthropic|openai|auto). Anthropic 크레딧 결제가
  막혀 **현재 OpenAI**(gpt-4o / gpt-4o-mini) 사용. Claude는 config 한 줄로 복귀 가능.
- **근거(설계 검증):** `LLMPort` 포트/어댑터 추상화 덕분에 **OpenAI 어댑터 추가 + main 분기**만으로 전환 —
  도메인·대화 엔진·Strategy·핸들러 **무수정**. 추상화 목적이 실제로 입증됨.
- **상태:** ✅ **실 호출 검증 완료**(2026-06-10, OpenAI 크레딧 충전 후) — 페르소나 대화 + AI 교정 + 리뷰카드 생성 동작.
- **결정자:** 사용자.

## 2026-06-09 · 결정 로그 도입(본 문서)
- **결정:** 큐레이션 ADR 스타일 결정 로그를 forin 프로젝트에 도입(append-only). 원시 트랜스크립트 미적재.
- **근거:** AWS AI-DLC식 감사 추적 — "왜/대안" provenance 보존. 유용성 검증 후 waypoint 프레임워크 표준 승격 검토.
- **대안(탈락):** 원시 대화 적재(시크릿·노이즈), 현행 유지(맥락 휘발).
- **결정자:** 사용자.

## 2026-06-11 · 문서화 = 린 기본 + 적응형 깊이
- **결정:** waypoint 경량 구조를 기본 유지하되, **복잡·고위험 단계만 깊게** 쓴다 — 컴포넌트 분해 + **NFR/성능 목표**
  + **테스트·검증 계획** 섹션 추가. 단순 단계는 지금처럼 짧게. ("문서가 일에 맞춘다" — AI-DLC 적응형 깊이 원칙.)
- **근거:** AI-DLC의 전체 산출물(유저스토리·페르소나·유닛분해·유닛별 NFR/인프라/빌드지시 문서)은 팀·엔터프라이즈·
  브라운필드용 — 솔로 MVP엔 *안 읽는 문서로 속도만 깎는* 의식. 단, 균일하게 얇으면 복잡 단계의 설계/근거가 부족 →
  깊이를 복잡도에 맞춰 조절.
- **적용:** 2-5 맵 엔진 문서부터 보강(품질 축·고복잡). 이후 복잡 단계 동일.
- **대안(탈락):** AI-DLC 전면 채택(오버헤드↑·속도↓), 현행 균일 린 유지(복잡 단계 설계 부족).
- **결정자:** 사용자.

## 2026-06-11 · 결정 로그·적응형 깊이를 waypoint 프레임워크 표준으로 승격
- **결정:** 두 규약(결정 로그, 적응형 깊이)을 forin 전용에서 **waypoint 프레임워크 표준**으로 올림.
  `FRAMEWORK.md`에 두 섹션 추가, `STATUS.template.md`에 DECISIONS 링크, `_templates/decisions-template.md` 신설,
  `stage-template.md`에 적응형 깊이 안내. → shadow 등 모든 프로젝트가 동일 규약 사용.
- **근거:** forin에서 유용성 검증됨 → 전 프로젝트 공통화. (앞서 "유용성 검증 후 승격" 계획대로.)
- **결정자:** 사용자(제기).

## 2026-06-11 · 맵 충돌 = 서버 저작 collision 레이어(jsonb)
- **결정:** 인테리어 walkability를 클라이언트 추론이 아니라 **콘텐츠가 저작**한다 — Interior에 `collision`
  (blocked 타일 사각형 리스트, jsonb) 필드를 추가하고 엔진은 그 집합+맵 경계로만 판정. (마이그 000008 + ER 시드.)
- **근거:** 충돌은 콘텐츠(레벨 디자인)의 일부 — 부서별 맵마다 손으로 도어웨이·벽을 배치해야 자연스러움. 코드에
  맵별 규칙을 하드코딩하면 콘텐츠 300+ 확장 시 폭발. 다국어/콘텐츠-as-data 원칙과 일관.
- **대안(탈락):** 오브젝트 타일 자동 충돌만(벽·도어웨이 표현 불가), 클라이언트 하드코딩 맵(확장 불가).
- **결정자:** AI 제안(2-5 보강 시 승인됨).

## 2026-06-11 · 맵 엔진 5a 의존성·렌더링 최소화
- **결정:** 5a는 `react-native-svg` 없이 player/오브젝트를 **단순 View+이모지**로, 카메라/스텝을 **plain React state**로
  구현. SVG는 실제 사용처인 5b(캐릭터·오브젝트 카탈로그), reanimated 워클릿 카메라는 성능 패스로 이연.
- **근거:** 5a 목표는 "walkable 파이프라인 확립 + 충돌 정확성". 순수 로직(좌표·충돌·BFS·리전)을 jest로 검증해
  CLI에서 정확성 보장(시각 의존 최소화). 의존성/최적화는 효과가 보이는 단계에서 추가(YAGNI).
- **대안(탈락):** 5a부터 SVG·reanimated 전면 — 시각 검증 불가 환경에서 리스크·복잡도만 증가.
- **결정자:** AI 제안(적응형 깊이 — 테스트 계획대로).

## 2026-06-11 · 인테리어 충돌·오브젝트·문 모델 (5b-ii)
- **결정:** `collision` 필드 = **구조 벽만**. 솔리드 오브젝트(bed/monitor/reception)는 **타입별 footprint**
  (`OBJECT_FOOTPRINT`)로 엔진이 blocked 집합에 추가 → 아트 크기와 충돌이 항상 일치. **문은 type:'door' 오브젝트**
  로 표현(충돌에 없음 = 통행 가능, 클라이언트가 `IDoor` 렌더). 벽 비주얼은 `Walls.tsx`가 collision을 IWall로 렌더.
- **근거:** (1) 아트≠충돌 불일치(보이는 침대를 통과) 방지. (2) **서버 스키마 변경 0** — 기존 objects/collision 필드만으로
  벽·오브젝트·문을 모두 표현(`doors` 필드 신설 불필요). (3) 오브젝트 타입은 화이트리스트 없는 자유 데이터([[feedback_extensibility]]).
- **대안(탈락):** 오브젝트 footprint를 collision에 직접 박기(아트와 중복·드리프트), `doors` jsonb 필드 신설(마이그·sqlc churn).
- **검증:** ER 픽스처 도달성 jest 4건(트리아지/트라우마 도달·문 통행·footprint 차단) 18/18.
- **결정자:** AI 제안(5b-ii, 계획대로).

## 2026-06-12 · 디자인 핸드오프 v2 반영 (캐릭터 모션 + Review Lab)
- **결정:** 핸드오프 추가분을 스테이지 문서에 반영하고 계획을 갱신.
  (1) **`06_CHARACTER_MOTION.md`(신규)** → 2-5에 **5c 캐릭터 모션** 증분 신설(방향 전환 dir·걷기·아이들 호흡/깜빡임·
  앰비언트 NPC 엔진 `useGridMover` patrol/wander+이모트·**이동 정체성 고정 seed**), 기존 캠퍼스는 **5d**로(모션 소비). 순서 5c→5d.
  (2) **Review Lab 설계 확정**(04_SCREENS ⑨, 하단탭 IA **Option A**: 캠퍼스/상황판/리뷰랩/나, 나=Profile 홈, 성장리포트=푸시) →
  2-6 체크리스트에 PhraseCard 명세 반영, 2-7은 SM-2 데이터/스케줄(서버 `/me/review` 기존)·화면은 2-6에서 빌드로 정리.
- **방향 전환 재도입(5a 크래시 교훈):** 좌우 미러는 **부모 View 음수 scaleX(크래시) 금지**, 레퍼런스대로 **`<Svg>` 그룹 내부
  transform**(`translate(64,0) scale(-1,1)`)으로. 5a에서 제거했던 좌우반전을 이 안전한 방식으로 복원(9536cb1 보완).
- **주의(미해결):** README/04_SCREENS는 `screens-review-lab.jsx`를 가리키나 `reference/`에 **JSX 부재** — 명세만 존재.
  구현은 04_SCREENS ⑨ 명세 기준, 필요 시 사용자에게 JSX 요청.
- **결정자:** 사용자(핸드오프 추가) + AI(문서 반영·계획).

## 2026-06-12 · 디자인 핸드오프 v2 채택 (design-handoff_v2)
- **결정:** 사용자가 기존 `design-handoff/`는 그대로 두고 **`design-handoff_v2/`**(개정판)를 추가. **v2를 권위 소스로 채택** —
  모든 스테이지/PRD/STATUS 문서의 핸드오프 링크를 `design-handoff/` → `design-handoff_v2/`로 일괄 재지정. 원본은 이력용 보존.
- **v2 실질 변경:** (1) **외래 클리닉 엔진**(`interior-clinics.jsx`) — 내과/외과/정형외과/피부과를 config 기반 `ClinicInterior`로
  생성(부서=데이터), IP에 부서별 바닥 톤 추가 → 04/05 명세 갱신, 디자인된 인테리어 5→9개(content-workstream 범위 확장).
  (2) **`screens-review-lab.jsx` 추가** — 이전 "JSX 부재" 플래그 해소. (3) **디자인 시스템 `ds-*` 모듈 재편**
  (ds-foundations/primitives/characters/faces/equipment/furniture) + HTML 분할(Screens / Design System) — 레퍼런스/내비.
  (4) 스프라이트 엔진(`forin-npcs-smooth.jsx`) 갱신(06 모션 반영분) — 5c 구현 시 v2에서 포팅.
- **불변:** 01/02/03/06 .md는 v2와 동일(내용 변경 없음). prototype 전용(design-canvas/ios-frame/tweaks-panel)은 무시.
- **결정자:** 사용자(v2 제공) + AI(채택·재지정·반영).

## 2026-06-15 · 디자인 핸드오프 v3 (측면 프로필 보강)
- **결정:** 사용자가 `design-handoff_v3/` 추가(v2 대비 **06_CHARACTER_MOTION.md + forin-npcs-smooth.jsx만** 변경 — 캐릭터
  측면 뷰 보강). **v3를 권위 소스로 채택**, 스테이지/PRD/STATUS 링크 v2→v3 재지정(DECISIONS는 이력 보존). 원본·v2 유지.
- **v3 변경:** 측면(left/right) 3/4 뷰가 제대로 된 실루엣 — `hatSide()`(측면 모자: 챙·간호 십자/경찰 배지가 앞쪽),
  좁은 측면 몸통+뒷면 음영, **가슴마크 숨김**, **팔 1개**(몸통에 붙임)·**다리 1개**(겹쳐 중앙). 정면/뒤통수는 불변.
- **구현 반영:** `Sprite.tsx`의 ARMS/BODY/LEGS/모자를 `facingSide` 분기로 갱신 + `hatSide()` 추가. 5c-i 범위 유지(정적).
  걷기 사지 스윙(측면은 단일 팔·다리 피벗)은 5c-ii(reanimated). tsc 0·jest 24/24·doctor 21/21.
- **결정자:** 사용자(v3 제공) + AI(채택·재지정·구현 반영).

## 2026-06-16 · 디자인 핸드오프 v4 + 5c 모션 피드백 R1
- **결정:** `design-handoff_v4/` 채택(v3 대비 **06 + forin-npcs-smooth.jsx만** 변경 — 측면 다리 모션 개선). 링크 v3→v4 재지정(DECISIONS 이력 보존). 사용자 디바이스 피드백 3건 반영:
  - **이동 속도 과도** → `useMovement` STEP_MS 110→330ms(한 보폭 ≈ 0.5s 스윙), WALK_MS 460ms.
  - **우측 이동 시 좌향**(이슈) → 좌우 미러를 SVG 문자열 transform(`translate/scale(-1,1)`)에서 **origin-aware `originX=32`/`scaleX`** 숫자 prop으로 교체. (기하상 기존도 우향이 맞아야 하므로 문자열 파싱 차이를 유력 원인으로 보고 견고화. 재확인 후 여전하면 `flip` 조건 반전.)
  - **측면 다리 부자연(v4)** → 단일 중앙 다리 → **2다리 ±22° 반대위상 교차**(먼 다리 어둡게=깊이) + 측면 팔 ±20°를 몸통 위로 분리. v4 `forin-npcs-smooth` 반영.
- **검증 한계:** 애니/방향/속도는 **시각 전용** → CLI(tsc/jest/doctor) 불가, 디바이스 반복 검증(사용자). tsc 0·jest 24/24·doctor 21/21.
- **결정자:** 사용자(v4 + 디바이스 피드백) + AI(반영).

## 2026-06-16 · 스텝 동기 보행 + 재사용 픽셀 엔진 추출(계획)
- **결정(보행):** 캐릭터 보행 모션을 **타일 스텝에 동기화**. 핸드오프 `forinWalkBob`(0.5s에 2번 -1.5px)처럼 한 칸 이동 =
  **2 포물선 hop + 2걸음(다리 교차)**. InteriorScreen이 `walkClock`(0→1, 스텝마다 재발화) 소유 → Sprite hop/다리 스윙이
  이동과 맞물림(기존 자유 클럭은 비동기라 한 칸에 깔끔히 2번이 안 나옴). 속도 300→240ms.
- **결정(엔진화·계획):** `src/map`+`src/characters`를 **재사용 가능한 RN 픽셀게임 엔진 패키지**(`packages/pixel-engine` 등)로
  추출하는 것을 **5e(맵 안정화 후) 계획**으로 등록(사용자 요청 — 타 프로젝트 재사용). 순수 모듈은 이미 forin 비의존, 인터페이스
  (`walkClock`/`dir`/`seed`)도 엔진 지향으로 설계. 콘텐츠 스키마·아트는 주입(의존성 역전).
- **검증 한계:** 보행 모션은 시각 전용(디바이스). reanimated 회전은 react-native-svg `transform` 배열로(=`rotation` prop no-op).
- **결정자:** 사용자(요청) + AI(반영).

## 2026-06-16 · 디자인 핸드오프 v5 (옆모습 입 위치)
- **결정:** `design-handoff_v5/` 채택(v4 대비 **forin-npcs-smooth.jsx만** 변경 — sideFace 입 위치). 링크 v4→v5 재지정(DECISIONS 이력 보존).
- **v5 변경:** 측면(3/4) 입을 얼굴 중앙(x39–45)에서 **앞쪽 가장자리·코 아래(x48–53)** 로 이동 — 기존 중앙 배치가 부자연스러웠던 것 교정. Sprite.tsx sideFace 입 경로 2줄만 반영. tsc 0·jest 24/24·doctor 21/21.
- **결정자:** 사용자(v5 제공) + AI(반영).

## 2026-06-16 · 앰비언트 NPC 엔진 화면 연결 (5d-i)
- **결정:** `useGridMover`(순수 patrol/wander+이모트 로직)를 **`AmbientNpc` 컴포넌트**로 화면에 연결 — NPC가 실제 이동
  (5c 보행 모션·글라이드 재사용)하고 `EmoteBubble`로 감정 이모지 표시. NPC는 인스턴스별 격리(자체 timer)로 틱마다 전체 맵
  리렌더 방지. Interior에 `npcs?` 필드 추가, ER+캠퍼스 fixture에 배치, 캠퍼스 탭 진입 추가.
- **임시(후속):** NPC 스펙은 **클라이언트 fixture**에 저작(서버 interior `npcs` jsonb 필드는 후속) · 캠퍼스 건물은 collision
  placeholder 블록(아트 5d-ii) · wander는 `bound`만 따르고 인테리어 collision 미참조(open bound로 회피). 이유: 5d-i는
  "움직이고 감정표현하는 NPC"를 빠르게 가시화·검증하는 게 목표(사용자 질문 대응). 서버 필드/아트/충돌연동은 증분 후속.
- **결정자:** 사용자(진행) + AI.

## 2026-06-18 · 디자인 핸드오프 v6 (캐릭터 머리 시스템 확장)
- **결정:** `design-handoff_v6/` 채택(v5 대비 forin-npcs-smooth.jsx·ds-derp.jsx·screens-explore-v2.jsx + 03/06 md). 링크 v5→v6 재지정.
- **v6 변경(머리 시스템):** hairStyle에 **`ponytail`·`balding`** 추가(8→10종 + 모자 2). 정면/측면/후면을 **각각 별도 플레이트**로 그림:
  **`hairSide()` 신규**(스타일별 측면 머리 — 귀 노출 + 뒤로 스윕), `backHead()`를 공통 돔에서 **스타일별**(short 나페·bob blunt·long
  시트·pigtails 묶음·curly 컬링·ponytail 꼬리 등)로 교체, hairBack은 정면(dir=down)에서만. 렌더: 측면 = `isHat?hatSide:hairSide`.
- **반영 판단:** Sprite.tsx에 타입+hairBack/hairFront/hairSide/backHead 포팅. **ROLES 자동배정은 v6도 불변**(patient는 bald 유지) →
  ponytail/balding은 "사용 가능한 스타일"로만 추가(명시 사용 시 노출). tsc 0·jest 25/25·doctor 21/21. 시각 = 디바이스.
- **결정자:** 사용자(v6 제공) + AI(반영).

## 2026-06-18 · 캠퍼스 아트 (5d-ii)
- **결정:** `screens-explore-v2.jsx`의 **Building**(2.5D 지붕+벽+창+문, 파라메트릭 w/h/roof/label/redCross/mainEntrance)과
  **Tree**(레이어 캐노피)를 오브젝트 타입(`building`/`tree`)으로 포팅. 캠퍼스 fixture를 placeholder 블록 → 실제 건물 3채(종합병원/
  외래클리닉/약국) + 나무로 재작성. **오브젝트 충돌 footprint를 `props.w/h`로** 확장(건물 가변크기), `collision` 필드는 외곽선만.
  나무는 trunk(1×1)만 차단(캐노피 오버행 = 통행). Building은 CSS 그라데이션 대신 View 단색+엣지로 근사.
- **후속:** 경로/플라자 바닥 타일·추가 prop(벤치·분수 등)·y기준 깊이정렬은 다음 증분.
- **결정자:** 사용자(진행) + AI.

## 2026-06-18 · 디자인 핸드오프 v7 (플래그십 랜드마크) — 경량 반영 + 베스포크 아트 계획
- **결정:** `design-handoff_v9/` 채택(v6 대비 05_MAP + screens-explore-v2.jsx). 링크 v6→v7 재지정. v7은 캠퍼스 **4종 플래그십
  랜드마크**(MedCenter 본관 / MedCenterH 외래 / MedCenterV 의과대 돔 / MedCenterC 암병원 곡면유리+접시) + `Building` `arch`
  변형(pitched/flat/tower/glass)을 추가.
- **반영 판단(경량 now + 베스포크 deferred):** 랜드마크는 **CSS 그라데이션·글로우·다중타워 합성**의 대형 정밀 아트이고, 캠퍼스
  화면은 아직 엔진/통합 placeholder(전용 캠퍼스 화면=후속)라 **충실 포팅은 크고 손실↑·시기상조**. → (1) 캠퍼스 fixture에 4종을
  **범용 `Building`으로 명명**(이름·지붕색·엠블럼 🎓🎗🩺, 본관=레드크로스+mainEntrance), `Building`에 `emblem` prop 추가.
  (2) **베스포크 MedCenter*/arch 아트는 5d-v(전용 캠퍼스 화면)로 정식 계획.** 핸드오프 SoT는 v7로 동기화.
- **결정자:** 사용자(v7 제공) + AI(경량 반영·계획 판단).

## 2026-06-18 · 외래 클리닉 엔진 (5d-iii)
- **결정:** `interior-clinics.jsx`를 **config 기반 생성기 `clinicInterior(cfg): Interior`**(src/map/clinic.ts)로 포팅 — 표준
  평면(접수+대기 → 진료실 3 → 처치실)을 데이터로 생성, **부서 추가 = config 객체 1개**(내과/외과/정형외과/피부과 4과). 장비 13종을
  `objects/clinicEquipment.tsx`로 포팅(Ultrasound/Xray/CastCart/Crutches/DermLamp/Laser/ExamStool/Shelf/BoneModel/ClinicReception/Cabinet/Chair/Plant),
  InteriorObjectView가 위임. 신규 바닥 테마 internal/surgery/ortho/derm. FIXTURES 등록 + 캠퍼스 탭 진입 버튼.
- **레이아웃 보정:** 레퍼런스의 y8 문이 분리벽 칼럼(x7/x14)에 있어 방 진입 불가 → **방마다 진입문(x3/x10/x17)** 으로 재배치(도달성 확보).
  jest 28/28(클리닉 진료실·처치실 도달·문 통행 검증). 충돌=벽만, 장비는 footprint(props.w/h) 있는 것만 차단.
- **임시:** NPC는 클라이언트 fixture·정적(1×1 wander로 제자리 호흡/이모트), 핫스팟 scenarioId는 placeholder.
- **결정자:** 사용자(진행) + AI.

## 2026-06-18 · 플래그십 랜드마크 베스포크 아트 (5d-v)
- **결정:** v7의 4종 랜드마크를 `src/map/objects/landmarks.tsx`로 포팅하고 **신규 오브젝트 타입 `landmark`** 추가. `props.landmark`로
  파사드 디스패치(default=본관 MedCenter 다중타워 / victorian=의과대학 MedCenterV / curved=암병원 MedCenterC / horizontal=외래
  MedCenterH). 캠퍼스 fixture 4동을 범용 Building→landmark로 교체(5d-v 계획대로 경량 Building 대체).
- **렌더 충실도 트레이드오프:** RN View는 **CSS 선형그라데이션·box-shadow 글로우 미지원** → MedCenter/H/C는 View 기반에 **솔리드+밝은
  코어 레이어로 그라데이션/글로우 근사**(실루엣·구성·창배치는 충실, 색 그라데이션 뉘앙스는 손실). 벽돌 `Pattern`+슬레이트 맨사드+구리
  돔이 핵심 시그니처인 **의과대학(MedCenterV)만 react-native-svg(`Pattern`/`Path`/`G`)로 직접 포팅**. 추후 `expo-linear-gradient`
  도입 시 고도화 여지.
- **배치 모델:** 파사드는 풋프린트보다 높이 솟음(facadeH > h·TILE, overflow visible) — 레퍼런스 동일. **차단은 `props.w/h` 풋프린트만**
  (솟은 파사드는 통행 무관). 레퍼런스 ~16px/타일 좌표를 S=TILE/16로 스케일.
- **검증:** jest 30/30(campus.test.ts: 랜드마크 풋프린트 비중첩 + 회랑 x7/x13/x19 도달성 2건 추가). tsc 0·doctor 21/21.
- **결정자:** 사용자(5d-v→5d-iv→5e 무허가 자율 진행 지시) + AI(렌더 충실도 판단).

## 2026-06-18 · 화면별 줌/스케일 (5d-iv)
- **결정:** `Interior.scale?`(기본 1)로 화면별 카메라 줌 지원. `InteriorScreen` 월드 컨테이너 transform에 `{scale}` 추가하고
  **`transformOrigin:'top left'`** 로 월드→스크린을 선형 매핑(`screen = translate + scale·world`)해 클램프/탭 수식을 단순화.
  카메라 중앙맞춤 클램프를 스케일드 px로 계산. 캠퍼스 `scale:0.7`(핸드오프: 캠퍼스는 멀리서·작게), 인테리어/클리닉/ER 기본 1.
- **탭 처리:** transform된 Pressable에서도 `locationX/Y`는 뷰의 **비변환 로컬 좌표** 로 보고되므로 `floor(locationX/TILE)` 변경 없음.
  ⚠️ 플랫폼별 locationX 좌표계 차이 가능성 → scale<1에서 탭 정합은 디바이스 검증 항목으로 표기.
- **검증:** tsc 0·jest 30/30·doctor 21/21.
- **결정자:** 사용자(5d-v→5d-iv→5e 자율 진행) + AI.

## 2026-06-18 · 재사용 픽셀 엔진 추출 (5e)
- **결정:** 제네릭 2.5D 타일맵/픽셀게임 커널을 **`mobile/src/engine/`** 로 추출하고 `@engine` 경로 alias(tsconfig paths + jest
  moduleNameMapper; Expo Metro가 `@/`처럼 런타임 해소) 부여. 이전: 순수(coords/collision/regions/gridmover/footprint)+types+훅
  (useMovement/useGridMover)+캐릭터(Sprite/Face)+무상태 레이어(TileFloor/Walls/RoomMask/AmbientNpc/EmoteBubble). forin 콘텐츠
  (objects 렌더러·fixtures·clinic·HUD·FastTravelModal·InteriorScreen)는 앱 잔류.
- **의존성 역전 = 합성:** 엔진은 forin을 import하지 않음(검증: src/engine 내 `@/`·상위상대 import 0). 앱 화면이 엔진 프리미티브 위에
  자기 콘텐츠를 합성. 디커플 2건: useMovement가 objects 배럴→footprint 직접 참조, EmoteBubble가 앱 토큰→로컬 INK 상수.
- **위치 결정(왜 `packages/pixel-engine`가 아닌가):** 레포에 루트 워크스페이스 부재·`node_modules`가 mobile/에 단 하나 → 런타임
  패키지를 앱 루트 밖에 두면 tsc·Metro가 react/react-native 미해소(워크스페이스 툴링 필요). `packages/contract`는 type-only라 무료지만
  엔진은 런타임. 시도했다가(packages/pixel-engine + metro watchFolders) tsc가 엔진 파일의 bare import를 해소 못 해 **`src/engine`으로
  확정**(무설정, 동일 경계). packages/로 물리 승격은 npm workspaces+루트 node_modules 필요한 인프라 후속으로 명시.
- **검증:** tsc 0·jest 30/30(순수 테스트는 deep `@engine/<mod>`로 RN 비적재)·`expo export` Metro 번들 성공(1601 modules)·doctor 21/21.
- **결정자:** 사용자(5d-v→5d-iv→5e 자율 진행 지시) + AI(위치 트레이드오프 판단).

## 2026-06-19 · NPC idle 모드 (정지·정면 고정)
- **문제(디바이스 피드백):** 클리닉의 제자리 의사/간호사 NPC가 `stand()`= **1×1 wander bound**로 만들어져, 이동은 막히지만
  `wanderStep`이 매 틱 무작위 방향을 반환 → **보는 방향(facing)만 상하좌우로 계속 바뀜**(가만히 못 서 있음).
- **결정:** 엔진에 **`NpcSpec.mode='idle'`** 추가 — 이동·방향전환 없이 정면(`dir:'down'`) 고정, 호흡/깜빡임·이따금 이모트는 유지
  (살아있는 느낌). useGridMover의 step 분기는 idle에서 no-op이라 dir이 'down'으로 고정. `clinic.ts stand()`를 1×1 wander→idle로
  전환. 캠퍼스/ER의 실제 bound wander(배회 NPC)는 그대로.
- **검증:** tsc 0·jest 30/30·doctor 21/21. ⚠️ idle 정지·정면 고정은 디바이스 확인 항목. 완전 무이모트가 필요하면 per-NPC `emoteChance:0`.
- **결정자:** 사용자(피드백) + AI.

## 2026-06-21 · 독립 코드 리뷰 게이트 R-1 (2-5 맵 엔진, 스코프드)
- **계기:** waypoint에 독립 코드 리뷰 게이트(Phase R) 신설. 2-5 맵 엔진(5d-v/iv/e+idle)은 AI가 자율 작성하며 "테스트 통과"를
  자기보고만 한 영역이라 우선 스코프드 적용.
- **실행:** 작성 세션과 **컨텍스트 분리된** 독립 서브에이전트 3개(엔진로직 / RN렌더·카메라 / 5e추출), refute 기본값 다관점 적대 리뷰.
  findings 17건(CRITICAL 0, HIGH 1) → **각 검증 후 9 채택·8 반박**.
- **채택(수정):** [HIGH] scale≠1 탭→타일 매핑 모호성 → InteriorScreen 구조 변경(Pressable=스케일드+translate만, 내부 wrapper=scale)로
  `⌊loc/(TILE·scale)⌋` 결정론화. [MED×3] useGridMover walkClear 레이스·idle 불필요타이머·patrol 스펙변경 재시드. [LOW×3] patrolStep
  post-advance 클램프·landmarks key·landmark w/h 가드. [NIT×2] 배럴/README 문구. + per-tick 결정을 순수 `moverStep`로 추출(idle/불변식
  결정론 테스트, +6).
- **반박(근거 기록):** 카메라=타일중심(의도)·오프스크린 컬링(기존·소규모라 보류)·gate 스냅(백로그)·memo 코어스의존(불변스펙)·moveDir
  facing(의도)·locationX edge(canEnter 검사)·AmbientNpc 재발화(deps상 미발생). → 스테이지 문서에 상세.
- **재검증:** tsc 0·jest 36/36·expo export 번들·doctor 21/21. 잔여: 캠퍼스 탭 시각정합 디바이스 확인 1건(게이트).
- **교훈:** 같은 컨텍스트 self-review였다면 HIGH 탭버그를 "괜찮다"고 합리화했을 것(실제로 직전 내 주석이 그랬음). 독립=구조가 값을 증명.
- **결정자:** 사용자(게이트 신설·2-5 적용 지시) + 독립 리뷰어 3 + AI(triage).

## 2026-06-27 · 디자인 핸드오프 v8 (대규모 재설계) — 채택 + 재계획 필요
- **채택:** `design-handoff_v9/` 카논. 전 문서 링크 v7→v8 재지정(10개). v8은 증분이 아니라 **맵/화면 대규모 재설계**.
- **주요 델타:**
  1. **캠퍼스 재구성:** 5개 랜드마크 파빌리온(본관 메인 메디컬 타워 `MedCenter` / 여성소아 `MedCenterWomen` / 암센터·재활 `MedCenterC`(=`MedCenterOnco`) / 외래·진단 `MedCenterH`(=`MedCenterDx`) / 행정 `Building flat`(=`MedCenterAdmin`)) + 중앙 시계탑 `ClockTower2D`. 빌딩 진입이 곧장 인테리어가 아니라 **엘리베이터**를 엶.
  2. **엘리베이터 화면 신설**(`screen-elevator.jsx` ScreenElevator): 건물 탭 5 + 픽셀 cab(층 표시·방향·도어 애니) + 층 디렉터리(층별 부서 + **실시간 상황칩 🔴/🟡/🟢** `getTodaysActiveScenarios()` 상황판과 동일 소스) + GO 바. InteriorScreen 내 **오버레이**(라우팅 없음, 🛗 버튼).
  3. **부서 인테리어 마스터 블루프린트 재구성:** ER 40×60·OR+PACU 40×52·ICU 34×44·Peds+NICU 34×48·Pharmacy 36×42 — 대형화 + 상세 존(3-stage zoning 등).
  4. **입원 병동/센터 신설(bespoke 28×52):** 내과 병동 `interior-ward` · 외과 병동 `interior-surgward` · 정형 병동 `interior-orthoward` · 피부과 센터 `interior-dermcenter`.
  5. **⚠️ 외래 클리닉 엔진(5d-iii) 폐기:** v8이 데이터구동 클리닉 화면(내·외·정형·피부 외래)을 "redundant"로 **제거**. 내가 5d-iii에서 만든 `clinicInterior`+4 config가 설계상 대체됨(병동/센터 bespoke로). → 코드 처리(삭제 vs 보존-후-은퇴)는 재계획 결정 사안.
  6. **신규 엔진 프리미티브/규약:** `IThreshold`(문짝 없는 어두운 통로, 내부 존 경계용; sterile tone) · `Tint`(반투명 바닥 오버레이, 특수실 조명) · `IGlass`(유리벽) · `NurseStationDesk`/`NurseDeskI`(허브 가구) · `IReception` 재정의(리셉션 카운터 아님 → 의사 처방 데스크; 진짜 접수는 `ClinicReception`). **2.5D 규약 명문화**(~70° 카메라, 모든 오브젝트 front+top face; 빌딩 top face는 직사각형).
  7. **신규 오브젝트 수십 종:** er2/er3·or2·icu2·peds2·ward2·pharma2·surg2·ortho2·derm2(.jsx) — 부서별 임상 장비.
- **스코프 영향(재계획):** v8 작업 대부분은 **신규 화면·콘텐츠(2-6)** + 대량 인테리어 저작 + 일부 엔진 추가(IThreshold/Tint/IGlass/엘리베이터 오버레이/빌딩 top-face/대형 맵). 2-5 엔진 자체는 유효하나 캠퍼스/랜드마크는 재작업 대상. **순서·클리닉엔진 처리·증분 분해는 사용자 결정 후 진행**(이번엔 문서 반영 + 링크 재지정까지).
- **결정자:** 사용자(v8 제공) + AI(델타 분석·재계획 제안 대기).

## 2026-06-27 · 5f-i 빌드 — 5-파빌리온 캠퍼스 + 2.5D top-face
- `buildings-v2.jsx`(MedCenter2D/H2D/V2D/C2D/ClockTower2D) RN 포팅 → `landmarks.tsx` 전면 재작성. 신규 `Block3D`(front+직사각형 top
  face)로 2.5D 규약 구현. 6 landmark kinds(main/horizontal/victorian/curved/admin/clock). 포팅: 레퍼런스 px로 그리고 부모 `scale(TILE/16)`.
  그라데이션은 솔리드+레이어 근사(무신규의존). 캠퍼스 40×28 5-파빌리온+시계탑 재작성(scale 0.6). jest 36/36·tsc 0·expo export·doctor 21/21.
- 클리닉 엔진 보존(미삭제) — 결정대로. 시각 충실도는 디바이스 확인. 다음: 5f-ii 엘리베이터.

## 2026-06-27 · 5f-ii 빌드 — 엘리베이터 진입 + 공유 시나리오 소스
- `src/content/scenarios.ts`: 공유 시나리오 소스(`getTodaysActiveScenarios` 날짜시드 결정적 회전, 쿼터 6/일, 28 메타). 상황판/엘리베이터/
  인테리어가 공유할 단일 진실원 — 현재 칩 구동, 풍부 콘텐츠는 2-6. `ElevatorScreen`(건물탭·픽셀cab·슬라이딩도어·층디렉터리+라이브칩·GO).
- **라우팅 결정:** reference는 in-screen overlay지만 RN 관용상 **route `app/elevator/[building]`** + 캠퍼스 파빌리온 핫스팟
  (kind:'elevator', Hotspot.building 추가)→push로 구현(동작 동등, 더 단순). 빌트 인테리어 층만 GO 이동, 나머지 "준비 중".
- 검증: tsc 0·jest 41/41(+5)·expo export·doctor 21/21. 칩은 실제 today 기준. 다음: 5f-iii(IThreshold/Tint/IGlass + 대형맵 컬링).

## 2026-06-27 · PixelButton 디자인시스템 정렬 (피드백)
- 사용자 지적: 엘리베이터 GO 버튼/공용 버튼이 DS와 다름. 원인 = 2-4의 단순 PixelButton을 그대로 사용(의도 아님) — DS 버튼의
  **lit-from-above 베벨**(윗변 하이라이트 mix(bg,#fff,.45) / 아랫변 음영 mix(bg,ink,.30))과 **누름 시 베벨 swap(recess)**, full-width 처리가 빠짐.
- 수정: 공용 `components/PixelButton.tsx`를 DS(forin-ui PixelButton) 스펙으로 정렬 — 베벨 스트립 + press swap + `full` prop(정확한
  전폭). border3/radius0/heading/13은 이미 일치. 콜러(elevator GO·campus·login) full prop으로 갱신. 앱 전체 버튼에 반영.
- 검증: tsc 0·jest 41/41·expo export·doctor 21/21.

## 2026-06-27 · PixelButton 최종 — 플랫 캡 + 드롭 섀도우 (피드백 반복)
- 위 "DS 정렬"(베벨+swap)은 뒤쪽 하드 섀도우와 신호가 충돌(섀도우 정지 + 베벨만 swap)해 어색. 반복 정리:
  **누름 = 캡이 오프셋만큼 섀도우 속으로 내려앉기**(유일 신호) → 안쪽 베벨(음영) 중복이라 제거, 윗변 하이라이트도 사용자 선호로 제거.
- **최종: 평평한 3px 아웃라인 캡 + 하드 오프셋 섀도우 + 누름 드롭.** forin 플랫 픽셀 톤(PixelBox/Chip)과 일관. full prop.
  (핸드오프의 베벨/swap은 섀도우 없는 평면 버튼 전제였음 — forin은 섀도우를 유지하므로 드롭으로 누름을 표현하는 게 더 forin다움+명확.)
- 검증: tsc 0·jest 41/41·expo export·doctor 21/21.

## 2026-06-27 · 5f-iii 빌드 — 대형맵 컬링 + 구조 프리미티브
- **컬링**(`src/engine/cull.ts` 순수): InteriorScreen이 플레이어+뷰포트+scale로 가시 윈도를 구해 objects/hotspots/NPC를 그 안만 렌더
  (tall 아트 rise 여유 landmark16/기타5). R-1에서 이연했던 컬링을 v8 대형맵(40×60) 대비로 회수.
- **구조 프리미티브**(`objects/structures.tsx`): threshold(IThreshold walkable)·glass(IGlass 차단)·tint(Tint non-blocking 오버레이).
  objectCollision이 door/threshold/tint skip, glass/footprint 차단.
- **가구 폴드:** NurseStationDesk/NurseDeskI/IReception 재정의는 5f-iii가 아니라 **5g-a(ER) 등 첫 사용처**에서 부서 장비와 함께 추가(적응형).
- 검증: tsc 0·jest 47/47(+6)·expo export·doctor 21/21. **5f 완료.** 다음: 5g-a ER 마스터 블루프린트.

## 2026-06-27 · 탭-투-워크 회귀 정정 (R-1 #1 되돌림)
- 디바이스: 캠퍼스(scale 0.6) 탭 이동 안 됨. 원인 = R-1 #1 수정으로 만든 작은-Pressable+내부-scale-래퍼 구조에서 내부 콘텐츠가
  Pressable을 넘쳐 터치 미수신. 리뷰어 HIGH는 **오탐**, 내 수정이 회귀 유발.
- 정정: 5d-iv 원래 **단일 transform** 구조 복원(Pressable worldW×worldH + transform[translate,scale] origin TL, 탭 ÷TILE).
  locationX는 비변환 로컬 좌표라 ÷TILE이 정답. tsc 0·jest 47/47·expo export·doctor 21/21.
- 교훈: 불확실한 런타임 동작(transform 하 locationX)은 speculative 코드 수정 대신 디바이스 검증으로 확정. 게이트의 디바이스 항목이 안전장치였음.

## 2026-06-27 · 디바이스 피드백 3건 (빠른이동·HUD·엘리베이터)
- **ER 트리아지 빠른이동 안 됨:** 룸 anchor(5,4)가 bed1 풋프린트 위라 warpTo의 canEnter가 막아 no-op. → collision에 `nearestOpen`
  (막히면 바깥 링 탐색해 가장 가까운 통행 타일) 추가, warpTo가 사용. 모든 방에 견고.
- **캠퍼스 HUD:** 방/리전 없는 캠퍼스에도 ZONE 배지·빠른이동 노출. → HUD `showZone`(regions>0)·`showFastTravel`(rooms>0)로 조건부 숨김.
- **엘리베이터 시퀀스:** GO→ **문 닫힘(탑승)→탑승 중→문 열림(도착)** 풀 사이클(reanimated withSequence, rest=open). 라이드 중
  `api.prefetchInterior`로 목적지 맵 프리로드(api에 interior 캐시 추가) → 문 열릴 때 즉시 진입. 그 외 층은 "준비 중".
- 검증: tsc 0·jest 48/48(+nearestOpen)·expo export·doctor 21/21.

## 2026-06-27 · 엘리베이터→인테리어 도어 리빌 전환 (피드백)
- 사용자 제안: 문 닫힌 채 이동→목적지 맵을 문 뒤에서 로드→문이 좌우로 열리며 맵을 드러냄.
- 구현: 엘리베이터는 **문 닫고(보딩) 닫힌 채 navigate**(router.replace `?via=elevator&c=wall`). 인테리어 라우트는 **풀스크린 닫힌
  `DoorReveal` 오버레이**를 띄우고 그 뒤에서 맵 로드(프리로드 캐시로 즉시) → 준비되면 문 좌우 슬라이드로 **맵을 리빌**. 닫힘=엘리베이터,
  열림=인테리어 → 끊김 없는 한 사이클. (라우트 간 shared-element 모핑 없이 "둘 다 닫힌 픽셀 문"으로 연속감 확보.)
- 검증: tsc 0·jest 48/48·expo export·doctor 21/21.

## 2026-06-27 · 엘리베이터 진입 라우트 슬라이드 제거 (피드백)
- 증상: 병동 진입 시 native-stack 기본 **옆 슬라이드** + DoorReveal 문 열림이 겹쳐 어색.
- 수정: 인테리어 라우트가 `via=elevator`면 `Stack.Screen animation:'none'`(그 외 진입은 기본 슬라이드 유지) → 슬라이드 없이 문 리빌만.
  부수효과로 닫힌 cab 문 → (즉시 컷) 풀스크린 닫힌 문으로 "문이 커지는" 느낌도 남(사용자가 언급한 효과). tsc 0·jest 48/48·expo export.

## 2026-06-28 · 2.5D 깊이 정렬 (z-순서) — 캠퍼스 건물 뒤 캐릭터
- 증상: 캠퍼스에서 player/NPC가 건물 뒤(북쪽)로 가도 건물 위에 보임(스프라이트를 항상 오브젝트 뒤에 그려서).
- 수정: 모든 월드 요소에 **발/풋프린트-바닥 타일 y 기반 `zIndex`** 부여(`zFor(baseY)=round(baseY*10)+10`). 오브젝트=y+footprint.h,
  스프라이트=feet y(player=pos.y+1, derived/ambient NPC=현재 y+1). 핫스팟 마커 z9000·RoomMask z99999(항상 위). 바닥/틴트/벽은 하위.
  → base-y 큰 쪽이 앞(카메라 근처). 건물보다 북쪽이면 가려지고 남쪽이면 앞에 보임. AmbientNpc는 내부 y로 자기 zIndex 설정(이동 중에도 정렬).
- 검증: tsc 0·jest 48/48·expo export·doctor 21/21. (인테리어에도 일반 적용 — 침대 등도 깊이 정렬.)

## 2026-06-28 · 건물 그림자 수정 (피드백)
- 증상: 캠퍼스 건물 우측 그림자가 건물 전체 높이만큼의 일자 스트립이라 부자연.
- 수정(광원 좌상단 기준): 그림자 = 우측 **폭 1칸(16px) 고정** + **높이 = 평지붕(top face) 깊이 td** (건물 앞뒤 길이). 바닥 앵커.
  랜드마크별 td 적용(MedCenter 26·H 32·암센터/행정 30·여성소아 sh*0.22·시계탑 22). tsc 0·jest 48/48·expo export.

## 2026-06-28 · 5g-a 빌드 — ER 마스터 블루프린트
- 40×60 ER_INTERIOR 재작성: 공공 로비(상단 전폭) + 3열×3밴드 룸 그리드(소생/스테이션+Pyxis/진료 // 음압격리/봉합/진료 // 정신격리/임종/제염).
  내부 경계=`threshold`(음압·제염 sterile tone), 외부만 auto `door`, 특수실 `tint`(정신 파랑/임종 웜/제염 wet). 컬럼당 lobby→band1→2→3 연결.
- 장비 16종 컴팩트 포팅(`objects/erEquipment.tsx` + ErObjectView, InteriorObjectView default에서 Er→Clinic 순). NurseStationDesk 포함
  (5f-iii에서 폴드했던 가구). NPC idle/배회 + 핫스팟 4(시나리오 연결). 캠퍼스/엘리베이터 진입 모두 INT-ER-00001로.
- 검증: tsc 0·jest 48/48(ER 도달성/threshold/footprint)·expo export·doctor 21/21. ⚠️ 소품 ~15종 + 음압 IGlass 분할 + 제염 외부문은 폴리시 후속.
- 다음: 5g-b OR(+PACU).

## 2026-06-28 · 5g-a ER 피드백 3건 (컬링·충돌·엘리베이터 spawn)
- **"가까이 가면 안 보임" = 컬링 버그:** 컬링 창을 플레이어 타일 기준으로 계산해, 맵 가장자리에서 카메라가 클램프되면 실제 가시 영역과
  어긋나 가장자리 오브젝트가 사라짐. → InteriorScreen이 **클램프된 카메라 tx/ty**(worldStyle와 동일 식)로 가시 윈도를 도출하도록 수정.
- **"그냥 통과" = 충돌 누락:** 솔리드 ER 장비에 footprint 부여(OBJECT_FOOTPRINT: vitals/ivpump/dressing/medfridge/scanner/chemdrum/
  ppestand/wastebin) + 소파 props.h:1. (walk-through detector·벽걸이 display·바닥 triageline/tint는 비차단 유지.)
- **엘리베이터 진입 spawn:** ElevFloor.entry 추가 → 라우트가 `?ex&ey` 전달, 인테리어가 playerStart 오버라이드(메모이즈). 타워 1F→ER (20,11) 도어 앞.
- **트리아지 바닥선(빨/노/초):** KTAS 중증도 안내선(실제 ER 요소) — 유지(필요시 제거/라벨).
- 검증: tsc 0·jest 48/48·expo export·doctor 21/21.

## 2026-06-28 · 디자인 핸드오프 v9 채택 (DS 카탈로그 갱신만)
- `design-handoff_v9/` 카논. 전 문서 링크 v8→v9 재지정(9개). v9 = v8 + **DS 카탈로그 레퍼런스 3개 갱신만**(stale 동기화):
  `ds-equipment.jsx`(+카탈로그 화면 3: ScreenDSEquipmentDerm/OrthoWard/SurgWard — 5g-g/h/i 부서 장비 쇼케이스), `ds-furniture.jsx`·
  `app-ds.jsx`(사소). **스펙(.md)·인테리어/오브젝트 소스 변경 0** — surg2/ortho2/derm2 장비는 이미 v8에 존재(해당 병동 빌드 시 포팅).
- 앱 반영 코드 없음(카탈로그는 디자인 레퍼런스 전용). 링크 재지정 + 기록만.
- 결정자: 사용자(v9 제공·동기화) + AI(델타 무시-가능 판정).

## 2026-06-28 · 5g-a ER — 전체 픽셀 1:1 재포팅 + 인테리어 블루프린트 1:1 재구성
- **계기:** 사용자가 "정말 핸드오프와 동일하게 구현됐냐"고 질의 → ER이 구조충실하나 단순화본임을 인정.
  너스스테이션 데스크 모양 지적("ㄷ자인데 너무 대충") 후 **"전체 픽셀 1:1 재포팅"** 선택.
- **방법:** 감사 에이전트로 erEquipment 전 오브젝트를 레퍼런스(interior-objects-er/er2/er3) 대비 요소 단위 대조 →
  배치 3건으로 누락/오류 채움. NurseStationDesk를 진짜 1:1(우드그레인·쿼츠엣지·모니터베이스+CT배경·키보드내부·
  라벨프린터용지·바스켓점선·펜캐디·커피컵)로 완성. 누락 4종(EKG/Sink/Whiteboard/Scale) 신규 추가.
- **Phase 2(인테리어 1:1):** `sharedEquipment.tsx` 신설 — interior-shared 프리미티브(IBed 3변형/IMonitor/IIV/
  ICurtain/IReception/IChair 4방향/IPlant/ICabinet/ExamStool) + 타부서 오브젝트(SurgicalLight/InstrumentTray
  /Ventilator/CrashCart/PyxisMachine/BankOfMonitors/XrayViewbox/CastCart) 충실 포팅. div 레퍼런스는 SVG로 재구성.
  **회귀 회피:** `i*` 접두 신규 타입 + SharedObjectView로 분리 → 기존 clinic bed/monitor/reception 불변.
- **ER_INTERIOR 재작성:** interior-er.jsx 1:1 — 40×60, y16/y33/y49 + x13/x26 그리드(밴드별 threshold 갭),
  앰뷸런스/정문/캠퍼스/제염외부 도어, IGlass 분할(약품실·음압전실), 10존 전체 오브젝트 배치, ICurtain 베이 분할,
  트리아지 바닥선, NPC ~40, 핫스팟 12, playerStart 19,28. floorTheme clinical.
- **충돌:** 신규 솔리드 타입 footprint 추가; nursestation(ㄷ 빈 공간)·triageline·icurtain은 walkable 처리.
- **근거:** 핸드오프 충실도가 제품 정체성. "안 보이던 오브젝트 다수"는 픽스처가 블루프린트의 일부만 배치한 탓 → 1:1 재구성으로 해소.
- **검증:** tsc 0 · jest 48/48 · expo export. 커밋 5건(5376b58/da411ba/c59b0a6/+컴포넌트/73c1c30).
- **결정자:** 사용자(1:1 재포팅 지시·"이대로 진행, 완료 후 보고") + AI(감사·배치 실행).

## 2026-06-28 · 5g-b OR(+PACU) — 전체 블루프린트 1:1 구현 (원칙 확립)
- **원칙 확립(사용자):** "엔진 데모는 일부 구현이 이해되지만, 이제 진짜 층별 병동을 구현하니 **블루프린트 전부** 구현. 앞으로도."
  → 5g-* 부서/병동은 핸드오프 블루프린트를 전수 구현(오브젝트·NPC·핫스팟·파티션 전부), 데모 부분구현 금지.
- **OR 오브젝트 전수 포팅:** `orEquipment.tsx` 신설 — interior-objects-or2 카탈로그 13종(BairHugger/Bovie/KickBucket/
  TimeoutBoard/RoboticConsole/LapTower/CO2Insufflator/ScrubDispenser/ScrubTimer/ConsentClipboard/SoiledCart/
  ORBoomMonitor/CArm) + OR-native AnesthesiaMachine/StatusBoard. div 레퍼런스는 SVG 재구성, text 글리프는 도형 대체.
  공용 SinkOR·NurseDeskI는 sharedEquipment로(타부서 재사용). ICabinet 7변형 타일(supply/drug/linen/chart/sterile/
  equipment/pharma) 충실화.
- **OR_INTERIOR 1:1:** interior-or.jsx 전수 — 40×52, 3단 동선존(비제한/준제한/제한·양압), OR 진입은 sterile threshold,
  9존 전체 오브젝트(보호자/락커/preop/clean/dirty/PACU/OR1/scrub/OR2), ICurtain, NPC ~24, 핫스팟 14(OR 시나리오 5종 연결),
  playerStart 7,40. 타워 3F 엘리베이터 → INT-OR-00001(entry 18,1).
- **디스패치:** Er→Or→Shared→Clinic. 신규 솔리드 footprint 추가, 벽/천장/탁상 피스는 walkable.
- **검증:** tsc 0 · jest 52/52(OR 도달성·threshold·footprint 신규 4) · expo export. 커밋 b6602a0.
- **다음:** 5g-c ICU.
- **결정자:** 사용자(전수 구현 지시·"이대로 진행, 완료 후 보고") + AI(포팅·픽스처 실행).

## 2026-07-01 · 디자인 핸드오프 v10 채택 (수술등 재디자인만)
- `design-handoff_v10/` 카논. v9 전체 복사본(스펙 6 + reference 63) + **SurgicalLight 재디자인만** 델타.
  전 문서 링크 v9→v10 재지정(prd·STATUS·01·02 스테이지 8개; DECISIONS는 이력 보존).
- **SurgicalLight v10(interior-or.jsx):** 2.5D 사선-위 뷰 — **매끈한 상단 하우징(전구 없음)** + 그 아래 **기울어진 발광
  언더사이드 밴드에 전구**(외곽 8 + 내부 4, cos/sin 배치) + **하향 원뿔형 빔(#FEF3C7) + 바닥 글로우(#FEF08A)**.
  구버전(평면 돔 + 상단 전구 링)에서 교체.
- 앱 반영: `sharedEquipment.tsx` SurgicalLight 재작성(viewBox 64×48, offY -12). ER 소생/봉합 + OR1/OR2에서 공용 사용.
  시뮬레이터(ER 소생실)에서 렌더 확인 — 상단 매끈 돔 + 언더사이드 노란 전구. tsc 0·jest 52/52. 커밋 6e2e324.
- 결정자: 사용자(v10 제공·조명 수정·reference 동기화) + AI(포팅·검증).

## 2026-07-01 · 5g-c ICU — 전체 블루프린트 1:1 구현
- **ICU 오브젝트 전수 포팅:** `icuEquipment.tsx` 신설 — interior-objects-icu2 카탈로그 9종(CRRTMachine·IVPumpTower(6단)·
  EVDStand·ICPMonitor·TTMUnit·FoleyBag·Intercom·GownBox·VisitorScreen). text 글리프는 도형 대체.
- **ICU_INTERIOR 1:1:** interior-icu.jsx 전수 — 34×44, **유리벽 4인 병실**(VENT/CRRT/EVD/TTM, 병실별 y17 유리경계 오토도어)
  + 중앙 텔레메트리 허브(모니터뱅크 + 차팅데스크 2 + 코드블루 크래시카트) + 지원동(면회/오염/약품). 유리벽은 objectCollision으로 차단.
  NPC ~11, 마커는 베드/NPC 속성(ICU 시나리오 5종 연결: park-vent/psychosis/monitor-alarm/code-blue/eol-family).
  playerStart 허브(16,26 — 16,23은 데스크 위라 이동). 타워 4F 엘리베이터 → INT-ICU-00001(entry 7,42).
- **디스패치:** Er→Or→Icu→Shared→Clinic. 신규 솔리드 footprint(crrt/ivpumptower/evdstand/icpmonitor/ttmunit).
- **검증:** tsc 0 · jest 56/56(ICU 도달성·threshold·glass·footprint 신규 4) · expo export · **시뮬레이터 전 구역 렌더 확인**. 커밋 71c435d.
- **다음:** 5g-d Peds.
- **결정자:** 사용자("다음 프로세스 진행" + 핸드오프 충실 지시) + AI(포팅·픽스처·시뮬 검증).

## 2026-07-01 · waypoint에 "구현 스펙(Build Spec)" 도입 (프레임워크 표준)
- **결정:** 실제 로직/화면/알고리즘/콘텐츠를 산출하는 스테이지는 코딩 전 **Build Spec**을 쓴다. 한 문서·**고정 정규
  섹션**(개요·분해·도메인/데이터·동작/규칙·UI/상호작용·엣지케이스·명세표·미해결질문·체크리스트·검증·편차) +
  적응형 깊이 티어(minimal/standard/comprehensive) + Plan-first 옵션형 질문 루프(AskUserQuestion→DECISIONS) +
  체크리스트 실행추적 + 편차 로그. `FRAMEWORK.md` "구현 스펙" · `_templates/build-spec-template.md` · stage-template 링크.
- **근거:** 설계(무엇을/왜)만으론 구현 시 SoT(핸드오프/PRD)를 매번 재해석 → 누락·불일치가 조용히 발생(부서 맵의
  "핸드오프엔 있는데 앱엔 없는 오브젝트"의 문서판). AI-DLC functional-design의 "구현 없이 다시 유도 안 해도 될 상세"
  + "고정 카테고리 완결성 체크" + "plan-first 객관식 질문"을 차용. `departments/`가 선행 실사례.
- **대안(탈락):** (a) 자유 섹션 1문서 — 완결성 강제 못함(누락 재발). (b) AI-DLC 4-문서 분할
  (business-logic/rules/entities/frontend) — 솔로 MVP엔 파일 오버헤드. (c) user-stories/persona/units 병렬분해/
  raw audit.md — 팀·엔터프라이즈용, 속도 저해(기존 방침 유지, 미채용).
- **결정자:** 사용자(2번=한 문서·고정 정규 섹션 선택, "상세하게 템플릿화") + AI(AI-DLC 조사·차용 설계).

## 2026-07-01 · Build Spec = 네 아티팩트 + 인덱스 (구성 정정)
- **결정:** Build Spec을 "한 문서·고정 정규 섹션"이 아니라 **네 개의 1급 아티팩트**(domain-entities · business-rules ·
  business-logic-model · frontend-components) **각각 자체 상세 템플릿** + 이를 묶는 인덱스로 재정의.
  `_templates/build-spec/`에 5파일(인덱스+4). 적응형 깊이 = 생성 아티팩트 수(minimal 인덱스만 → comprehensive 4개+NFR).
  콘텐츠 시리즈(부서 맵)는 항목당 1문서에 네 아티팩트를 도메인 섹션으로 압축.
- **근거:** 사용자 지적 — AI-DLC functional-design의 핵심은 그 네 영역을 *각각 정밀하게* 다루는 것인데, 직전
  build-spec-template(단일·정규섹션)이 넷을 generic 섹션으로 뭉개고 이름을 바꿔 정밀함을 잃었다. 관심사 분리로
  각 영역을 독립 템플릿화해 완결성을 강제.
- **대안(탈락):** (a) 단일 문서·정규 섹션(직전 안) — 영역 정밀함 상실(정정 대상). (b) 한 문서 내 4 상세 섹션 —
  사용자가 4파일 분리를 명시 선택.
- **관계:** 2026-07-01 "Build Spec 도입" 항목을 대체하는 구성이 아니라 그 구성 세부를 확정. 트리거·질문루프·
  체크리스트·편차·위치(하이브리드)·리뷰게이트는 유지.
- **결정자:** 사용자(네 아티팩트 각각 상세 템플릿화 + 4파일 분리 선택) + AI(AI-DLC 매핑·템플릿 작성).

## 2026-07-01 · 부서 Build Spec = 부서당 디렉토리 + 5파일 (인스턴스 형태 확정)
- **결정:** 부서 구현 스펙을 압축 단일 `<dept>.md`가 아니라 **부서마다 `<dept>/` 디렉토리**로 두고, 네 아티팩트
  (domain-entities·business-rules·business-logic-model·frontend-components)를 **각각 별도 파일** + build-spec-index.md
  로 인스턴스화. er/·or/·icu/ 전환 완료. `er/`가 기준 인스턴스.
- **근거:** 사용자 기대 — 템플릿을 4파일로 나눈 것과 동일하게, 실제 부서 스펙도 각 아티팩트가 자체 파일로 존재해야
  "각각을 구체적으로 정의"한다는 의도에 부합. 압축 단일 문서는 그 정밀함/분리를 다시 뭉갬.
- **대안(탈락):** 압축 단일 `<dept>.md`(직전 형태) — 아티팩트 분리 상실로 정정.
- **영향:** README 인덱스·템플릿·FRAMEWORK "위치" 예시를 폴더 형태로 갱신. 콘텐츠·좌표는 fixture와 1:1 재검증(불변).
- **결정자:** 사용자(부서당 디렉토리·아티팩트별 파일 명시) + AI(인스턴스화).

## 2026-07-01 · OR·ICU 화면 단위 핸드오프 대조 검증 (재사용 하네스 도입)
- **결정:** OR·ICU를 ER과 동일하게 화면 단위로 핸드오프와 대조 검증. **핸드오프 렌더 하네스**(`inputs/design-handoff_v10/
  reference/_hoff-harness.html` — 디자인 JSX를 Chrome headless로 flat-render, URL 해시로 부서 선택)를 도입해 ground truth
  이미지를 확보하고, iOS 시뮬레이터 구역별 캡처와 대조.
- **결과:** OR 8구역·ICU 8구역 전부 **핸드오프와 충실히 일치**(오브젝트 1:1·좌표·NPC·마커·바닥 팔레트). 재포팅이 정상 반영됨
  확인. 편차 없음 — 유일한 의도적 편차는 OR 수술등 70% 크기(사용자 재확인 유지).
- **근거:** 사용자가 OR/ICU를 ER처럼 철저히 검증 요청("전부 다시 구현하며 검증"). 소스 대조상 이미 1:1이라 재구현 대신
  화면 검증으로 충실성 실증. 하네스는 Peds 이하 전 부서 재사용.
- **결정자:** 사용자(수술등 70% 유지·더 깊은 대조 요청) + AI(하네스 구축·전 구역 검증).

## 2026-07-07 · design-handoff_v11 채택 — 장비 2.5D 재포팅
- **결정:** 핸드오프 v11(장비를 평면 2D→RPG-Maker 2.5D로 개정: 통합 둥근 실루엣 fill+재stroke, 명시적 상단면,
  seam, viewer-facing 전면 패널, 어두운 바퀴)을 현행 SoT로 채택. 구현된 부서 장비를 v11로 대대적 재포팅.
- **재포팅 범위:** `sharedEquipment`(IPlant·SinkOR·InstrumentTray·Ventilator·CrashCart·PyxisMachine),
  `icuEquipment`(CRRT·TTM), `orEquipment`(BairHugger·Bovie·RoboticConsole·LapTower·CO2Insufflator·
  ScrubDispenser·SoiledCart·AnesthesiaMachine), `erEquipment`(Defib·OxygenTank·EKG·CompCart·Sink·SuctionUnit·
  Wheelchair·VitalsCart·IVPump·DressingCart·WaterCooler·PPEStand·Otoscope·TicketDispenser·SecurityScanner·
  MetalDetector·MedFridge·CoffeeTable). **그림자-방향만 바뀐 오브젝트는 미변경**(RN 포팅은 CSS drop-shadow 생략).
- **검증:** tsc 0 · ER viewBox parity 자동 대조(전 오브젝트 v11 일치) · iOS 시뮬레이터 렌더 확인(ER resus/lobby,
  OR1/OR2, ICU CRRT). ER은 서브에이전트 포팅 후 viewBox 대조+시뮬로 검증.
- **문서:** departments README에 "v11 2.5D 장비 규약" 명문화(신규 부서는 v11 따름) + SoT 경로 v10→v11.
  렌더 하네스(_hoff-harness.html)를 v11 reference dir로 이관.
- **미구현 부서(peds/pharma/ward/surgward/orthoward/derm):** 코드 미구현 → 계획 문서(README)가 v11을 가리키도록
  갱신, 착수 시 v11 2.5D 규약으로 포팅.
- **결정자:** 사용자(v11 반영·대대적 수정 지시) + AI(재포팅·검증·문서).

## 2026-07-10 · handoff v12·v13 diff 확인 + v13 접지 그림자 반영
- **v11→v12:** 인테리어/장비 변화 없음(캠퍼스 건물 `buildings-v2.jsx`/신규 `ds-buildings.jsx` + explore 화면만). 우리 작업 무관.
- **v12→v13:** 장비 그림자 모델 교체 — 하드 CSS `drop-shadow` 제거(RN 포팅은 이미 생략) + 각 **바닥형 오브젝트** svg 첫 자식으로
  **접지 그림자 타원** `rgba(0,0,0,.16)` 추가(벽걸이/천장/얇은 것 제외). 레이아웃·픽스처·NPC 변경 0(interior-er.jsx는 아예 무변경).
- **결정:** v13을 현행 SoT로. 구현 4파일에 접지 그림자 반영 — er 38 · or 12 · icu 8 · shared 12개 바닥 오브젝트에 `<Ellipse>` 첫 자식 추가
  (핸드오프 좌표 그대로, 커스텀 viewBox는 밑면 맞춤). er/or은 서브에이전트 포팅 후 tsc+시뮬 검증, icu/shared는 직접.
- **검증:** tsc 0 · jest 56/56 · 시뮬레이터(ER resus·ICU CRRT 접지 그림자 확인). 문서 SoT v11→v13, README에 v13 접지 규약 추가, 하네스 v13로.
- **결정자:** 사용자(v13 적용 지시) + AI(diff·반영·검증).

## 2026-07-10 · 5g-d Peds+NICU 구현 (v13)
- **결정:** Peds+NICU 인테리어를 v13 핸드오프에서 1:1 구현. 34×48, floorTheme 'peds', 5구역(welcome/exam/ward/ante/nicu),
  NICU 유리 전실 + sterile 3분 스크럽 threshold + 인큐베이터 존(저조도 tint). 신규 `pedsEquipment.tsx` 16종
  (incubator·phototherapy·metalcrib·ivboard·babyscale·stadiometer·tonguejar·stickerroll·dosingchart·milkfridge + 놀이방
  smallslide·rockinghorse·toychest·blocks·mural·balloon). `ibed variant='peds'` 재사용. phototherapy = OVERHEAD z.
- **해소된 질문:** Q1 시나리오=**라벨만**(scenarioId 후속) · Q2 엘리베이터=**타워 5F 신설**(entry 16,1) · Q3 = ibed peds 변형 기존 재사용.
- **검증:** tsc 0 · jest 61/61(peds-fixture 5: 도달성·threshold·유리벽·footprint) · 시뮬레이터 welcome/ward/NICU 렌더 확인.
- **편차:** scale 0.85 · 놀이매트 tint 근사 · Mural clipPath 평면 근사 · RockingHorse/Balloon 정적(bob 후속) · 시나리오 라벨만.
- **결정자:** 사용자(5F·라벨만 선택, "Peds 진행") + AI(Build Spec·구현·검증). Peds 카탈로그는 서브에이전트 생성 후 tsc+시뮬 검증.

## 2026-07-12 · 인테리어 로딩 fixture-first (서버 구버전 시드로 오브젝트 누락 버그)
- **증상:** 엘리베이터로 층 이동 시 간헐적으로 인테리어 오브젝트 누락(방 사이 threshold 가림막·접수대 안 보임). 사용자는 문 여닫힘 애니(DoorReveal) 의심.
- **원인:** 라우트(`app/interior/[id].tsx`)가 `api.interior(id)`를 **서버 우선** 로드, throw 시에만 번들 FIXTURE 폴백. dev Go 서버가 켜져 있으면 **구버전/부분 시드**를 200으로 반환 → 폴백 없이 그대로 렌더 → 오브젝트 누락(서버 상태·캐시 따라 간헐적). 오브젝트 컬링은 이미 off라 렌더 문제 아님. DoorReveal은 결과를 드러낼 뿐 원인 아님(무서버 환경 3/3 정상 재현으로 확인).
- **결정:** 부서 인테리어는 **번들 FIXTURE가 정본**(클라이언트 저작, 서버 미시드) → `FIXTURES[id]` 있으면 **동기 로드(fixture-first)**, 서버 미조회. 비번들 id만 서버 조회. 서버 시드가 최신화되면 재검토.
- **효과:** stale-server-data로 인한 오브젝트 누락 원천 차단 + 엘리베이터 DoorReveal 뒤 async 레이스 제거. tsc 0·jest 61/61·엘리베이터 진입 재검증.
- **결정자:** 사용자(직접 확인 요청) + AI(진단·fixture-first 수정).

## 2026-07-12 · 엘리베이터 전환 재설계 + 재진입 렌더 안정화
- **결정:** 엘리베이터 층 이동 연출을 재설계 — (a) 층 선택 화면의 작은 문 미리보기 제거, "이동" 시 **화면 전체 캡 도어**가 닫힘 → 목적지 `DoorReveal`로 seamless 인계. (b) 상단 **LCD 층수 표시**(RIDING/ARRIVED·방향 화살표·부서) + 층 티커(from→to). (c) 문은 **맵이 완전 렌더된 후에만** 개방(`InteriorScreen.onReady` = onLayout+2×rAF) + 최소 이동 비트. (d) 층 선택 버튼은 네모 숫자(동그라미 제거)+하드 그림자, **선택 시 눌린 상태 유지**(그림자 속으로 latch).
- **재진입 오브젝트 소실 버그(중대):** 급속 엘리베이터 재진입 시 오브젝트가 사라지거나 배치가 어긋남. 카메라/vp/pos는 정상(온스크린 디버그로 확인)인데도 오브젝트 레이어만 통째로 페인트 실패 → **react-native-svg 동시 마운트 레이스**로 규명. 수정: ① 카메라 워클릿이 vp를 **shared value로 라이브 read**(stale JS 클로저 제거) + 진입 시 카메라 스폰 스냅 ② 정적 레이어를 `StaticWorld`(interior 메모)로 격리(NPC 이모트 재렌더와 분리) ③ 오브젝트 깊이 정렬(DOM 순서=painter) ④ **오브젝트 레이어 1프레임(rAF) 지연 마운트**(레이스 회피, 결정적 수정).
- **딥링크 함정:** 벽 색상 파라미터의 `#`(%23)이 URL fragment를 시작시켜 뒤 파라미터 전부 유실 → 색상 hash-free 전달 후 라우트에서 `#` 재부착.
- **검증:** tsc 0 · jest 62/62 · 시뮬레이터 재진입 6+회 전부 완전·일관 렌더.
- **결정자:** 사용자(연출·버튼 피드백 지시, "직접 테스트하고 수정") + AI(진단·수정·검증).

## 2026-07-12 · 5g-e Central Pharmacy 구현 (v13)
- **결정:** 중앙 약제부 인테리어를 v13 핸드오프에서 1:1 구현. 36×42, floorTheme 'pharma', 5구역(window/dispense/vault/ante/cleanroom). 수령창구(픽업 카운터+유리 배리어)·기송관 허브 → 조제실(ATC·LASA·약장 A~D·검수대) + 마약류 이중잠금 금고 alcove → 무균 전실→에어샤워→무균 조제실(BSC×2·차압계·유출키트·원심·프린터). 신규 `pharmaEquipment.tsx` 21종 + `PharmaObjectView` 디스패치.
- **해소된 질문:** Q1 진입=**둘 다**(엘리베이터 타워 **P1층 신설** entry{16,40} + ER 약품실 **portal 문** entry{9,9}) · Q2 시나리오=**라벨만**. `Hotspot`에 `target`/`entry` 추가 + 라우트 `kind:'portal'` 분기(push, 뒤로가기 ER 복귀). HotspotMarker `portal → '→'`.
- **검증:** tsc 0 · jest 69/69(pharma-fixture 7) · 시뮬레이터 5구역 렌더 + 엘리베이터 P1 + ER portal 마커 확인.
- **편차:** scale 0.8 · **x21 divider y13→y20 보정**(핸드오프대로면 무균 전실 밀봉 → 진입 불가; 오브젝트 좌표 1:1 유지, 충돌만 보정) · SVG text→shape/생략 · 미배치 helper(Kiosk/QueueRope/CountingBench/CSSafe/LaminarHood) 스킵 · Centrifuge/WallPhone 애니 정적 · 시나리오 라벨만.
- **결정자:** 사용자("약국 진행", 진입 둘 다) + AI(Build Spec·구현·검증).

## 2026-07-13 · RoomMask "잘못된 방에 고정" 버그 — regionAt 최소면적 규칙
- **증상:** 방 포커스 마스크가 현재 방이 아닌 엉뚱한(더 큰) 구역에 고정. 약국 마약류 보관고에 들어가도 조제실로 표시·마스크됨. 사용자: "현재 방이 마스크되면 안 되는데 이동해도 고정".
- **원인:** `regionAt`이 regions 배열의 **첫 매칭**을 반환. 큰 구역의 사각형이 그 안에 든 작은 방을 덮고 배열에서 먼저 나오면(예: dispense{0,12,21,30} ⊃ vault{0,28,13,14}), 작은 방에 서 있어도 큰 구역이 반환됨 → ZONE·RoomMask가 큰 구역에 고정.
- **수정(엔진 전역):** `regionAt`을 **가장 작은(가장 구체적인) 면적의 포함 구역 반환**으로 변경(`engine/regions.ts`). 배열 순서와 무관하게 항상 실제 서 있는 방으로 해석 → "겹침 그림자" 버그 클래스 원천 제거. 약국 regions 재배치는 이제 불필요하나 무해하게 유지.
- **검증:** 전 9개 인테리어 **중심-타일 감사 통과**(각 방 중심이 자기 방으로 해석) · tsc 0 · jest 69/69 · 시뮬레이터에서 약국 마약류 보관고·ER 너스스테이션·ER 제1진료실 각 방 포커스 정상(강한 dim 0.55로 밝은 영역=현재 방 확인 후 0.2 원복).
- **결정자:** 사용자(직접 테스트·수정 지시) + AI(진단·전역 수정·감사).

## 2026-07-13 · 5g-f Internal Medicine Ward 구현 (v13)
- **결정:** 일반 내과 병동을 v13 핸드오프에서 1:1 구현. 28×52, floorTheme 'internal'(sage), 7구역(린넨/클린/더티 서비스 스트립 → 중앙 간호 스테이션 복도 → 4인 만성질환 병실(커튼 분리) → 1인실 + VRE 접촉 격리실). 신규 `wardEquipment.tsx` 16종(ward2 11 + local MealCart/SharpsBin/IsoSign/DedicatedBP + DeskPhone) + `WardObjectView`. 공용(ibed ward·nursestation ㄷ-데스크·icurtain·vitals·walltv·sofa 등) + pharma의 pneumatictube/barcodescanner 재사용.
- **해소된 질문:** Q1 스코프=**내과 병동만**(외과/정형은 후속 5g-g/h, 같은 카탈로그 재사용) · Q2 진입=**엘리베이터 타워 8F**(entry {12,50}; 하단 캠퍼스 문이 1인실\|격리 분리벽 x13을 걸쳐 1인실 쪽 스폰) · Q3 시나리오=**라벨만**.
- **검증:** tsc 0 · jest 76/76(ward-fixture 7: 도달성·threshold·4인실 커튼 차단+4베이 도달·1인실\|격리 분리벽·footprint) · 시뮬레이터 전 구역 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략(공용 dispatch 미지원, peds와 동일) · SVG text→shape/생략 · 캠퍼스 문이 분리벽 걸침(1:1 유지, entry만 조정) · 시나리오 라벨만.
- **결정자:** 사용자("5g-f 입원 병동 진행") + AI(Build Spec·구현·검증).

## 2026-07-13 · 5g-f 내과 병동 v14 방 배치 정정 (사용자 피드백)
- **결정:** handoff **v14**로 SoT 갱신 후 내과 병동(INT-WARD) 방 배치 정정. v13→v14 diff = 구조 3건: ① playerStart {13,14}→{4,15} ② 캠퍼스 문 하단(↑ x12-14 y51)→**좌측(← x0 y14-16)**, 하단 벽 채움 ③ 좌측 세로 핸드레일 제거(우측만). 오브젝트 카탈로그(ward2)·각 방 오브젝트 좌표는 v13=v14 동일(80+개 전수 대조로 확인) — 제 v13 포팅이 오브젝트 좌표상 이미 handoff와 1:1이었고, 실제 diff는 위 구조 + 핸드레일뿐.
- **반영:** `fixtures/ward.ts`(playerStart·좌측 문 벽 갭·하단 벽·핸드레일 제거) · `ElevatorScreen` 8F entry {12,50}→{1,15} · `ward-fixture.test.ts`(좌측 문 도달·하단 벽 차단) · Build Spec SoT v14.
- **검증:** tsc 0 · jest 76/76(ward 7) · 시뮬레이터 좌측 문·스테이션 진입·전 구역 렌더 확인.
- **결정자:** 사용자(v14 방배치 정정·오브젝트 diff 확인 지시) + AI(v13↔v14 diff·전수 대조·수정·검증).

## 2026-07-14 · 5g-g General Surgery Ward 구현 (v15)
- **결정:** 일반 외과 병동을 v15 핸드오프에서 1:1 구현. 28×52, floorTheme 'surgery'(steel), 5구역(린넨/처치·드레싱룸 → 간호 스테이션·보행 → 4인 수술후 병실(커튼) → 1인 대수술 중증실). 내과 병동과 동형(좌측 문·세로 흐름). 신규 `surgEquipment.tsx` 8종(PCAPump·JPDrain·Hemovac·NGSuction·SCDDevice·WalkerRack·OPScheduleBoard·StapleRemover) + `SurgObjectView`. **ward2 카탈로그 + shared/OR(surgicallight·instrumenttray)/ER(dressing·suction·wastebin) 대거 재사용**.
- **해소된 질문:** Q1 진입=**엘리베이터 타워 7F 신설**(deptCode 7F; 8F=내과·7F=외과·6F=정형(예정)), entry {1,15} · Q2 시나리오=라벨만 · Q3 미배치 helper(Walker·AbdoBinder) 스킵.
- **검증:** tsc 0 · jest 82/82(surgward 6) · 시뮬레이터 전 구역(스테이션 OP보드·PCA·워커랙, 처치실 수술등·드레싱카트, 4인 수술후 JP·PCA·커튼, 중증실 NG흡인·Hemovac×2·SCD) 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략 · SVG text→shape · Walker/AbdoBinder 미구현 · NPC 소수 좌표 반올림(y17.5→18) · 시나리오 라벨만.
- **결정자:** 사용자("다음 작업 시작") + AI(Build Spec·구현·검증).

## 2026-07-14 · 5g-h Orthopedics Ward 구현 (v15) — 병동 3종 완결
- **결정:** 정형외과 병동을 v15 핸드오프에서 1:1 구현. 28×52, floorTheme 'ortho'(bone), 5구역(PT 연계 통로/석고실·소처치 → 간호 스테이션·보조기 베이 → 4인 골절/견인 병실(커튼) → 1인 고령 고관절 골절실). 신규 `orthoEquipment.tsx` 11종(TractionFrame·CPMMachine·PlasterTrapSink·CastCutter·CastRollShelf·BraceRack·AbductionPillow·ElevatedToiletGuard·BedAlarm·PACSViewer·CMSChart) + `OrthoObjectView`. surg2 `Walker`를 이번에 `surgEquipment`에 추가(외과 render 미사용이라 미구현이었음). ward2/surg2/shared/OR/ER 대거 재사용.
- **해소된 질문:** Q1 진입=엘리베이터 타워 **6F**(기존 "정형외과 병동" 라벨) → 타워 병동 3개 완비(8F 내과·7F 외과·6F 정형), entry {1,15} · Q2 시나리오=라벨만 · Q3 Walker surg2 추가.
- **검증:** tsc 0 · jest 88/88(ortho 6) · 시뮬레이터 전 구역(PT통로·석고실·스테이션·견인병실·고관절실) 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략 · SVG text→shape · BedAlarm 점멸 정적 · deptCode 8F→엘리베이터 6F(라벨 정합) · 시나리오 라벨만.
- **결정자:** 사용자("외과 병동 확인 후 일치 시 정형 바로 시작") + AI(외과 5방 전수 검증(일치)·정형 Build Spec·구현·검증).
- **비고:** 입원 병동 3종(5g-f/g/h) 동일 골격(28×52·좌측 문·서비스→스테이션→4인실→특수실)에 부서 카탈로그만 교체.

## 2026-07-15 · 5g-i Dermatology Center 구현 (v15) — 5g 부서 9종 완결
- **결정:** 피부과 센터를 v15 핸드오프에서 1:1 구현. 28×52, floorTheme 'derm'(rose), **상단 캠퍼스 문**, 5구역(로비·접수·대기 → 제1/제2 진료실 → 광선 치료실 → 소수술·레이저 처치실). 신규 `dermEquipment.tsx` 11종(Dermatoscope·WoodsLamp·UVBooth·HandUVBox·GoggleSanitizer·BiopsyKit·BiopsyBottle·CryoTank·CO2Laser·LesionChart·SkinAnatomy) + `DermObjectView`. clinicReception(pharma)/sofa/coffeetable/walltv/watercooler/surgicallight/dressing/shared 재사용.
- **해소된 질문:** Q1 진입=엘리베이터 타워 **2F를 경량 CLINIC-IM에서 INT-DERM 정식 인테리어로 교체**(외래 클리닉 엔진 v8 redundant), 상단 문 entry {14,1} · Q2 시나리오=라벨만.
- **검증:** tsc 0 · jest 94/94(dermcenter 6) · 시뮬레이터 전 구역(로비·진료실1/2·광선치료실·레이저 처치실) 렌더 확인.
- **편차:** scale 0.9 · IBed label 생략 · SVG text→shape · 2F 클리닉엔진→정식 인테리어 교체(내과/외과 외래 후속) · 시나리오 라벨만.
- **결정자:** 사용자("나머지 5g 파빌리온 진행") + AI(Build Spec·구현·검증).
- **마일스톤:** **5g 부서 마스터블루프린트 9종 전부 구현 완료**(ER·OR·ICU·Peds·Pharmacy·내과병동·외과병동·정형병동·피부과센터).

## 2026-07-18 · v16 핸드오프 반영 + 5g-j Infusion 구현 (v16, Phase 1 착수)
- **결정 A (기존 부서 v16 압축):** design-handoff_v16을 SoT로 승격. 병동 3종(내과/외과 rows 52→46, 정형 52→44)·피부과(52→50) 압축, 하단 특수실 −4 상향·room4 h16→11·커튼 h11→6, surg/ortho 소파·의자·화분·변기가드 재배치, orthoEquipment PlasterTrapSink·surgEquipment NGSuction 접지 그림자 정정. jest 94/94·tsc 0·시뮬레이터 4부서 확인.
- **결정 B (신규 20종 계획):** v16 신규 인테리어 20종을 엘리베이터 4개 건물(WOMEN·DX·ONCO·ADMIN) 빈 층에 매핑, 5-Phase 순서 수립([departments/v16-new-departments-plan.md](02-construction/departments/v16-new-departments-plan.md)). Phase 1=재사용 quick-win(infusion·nursery·womenkids-opd).
- **결정 C (5g-j Infusion 구현):** 외래 주사센터를 v16 핸드오프 1:1 구현. 28×40, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(접수·조제전달 → 오픈 주입 베이(리클라이너×8+스마트펌프×8) → 격리 주입실(과민반응) → 다과 + 간호 스테이션). **전용 objects2 부재** → onco2 3종(InfusionChair·SmartInfusionPump·PPEStation) + icu CoffeeMachine 1종만 신규 `infusionEquipment.tsx`로 포팅, 나머지(pneumatictube·medfridge·handsanitizer·crashcart·compcart·watercooler·coffeetable·nursestation·deskphone·ireception·icabinet·imonitor·ichair·iplant) 재사용.
- **해소된 질문:** Q1 진입=엘리베이터 **DX 3F**(외래 주사센터 선두 배선, entry {1,6}); 3F 인공신장실 병존 → Dialysis 구현 시 층당 sub-선택 도입 · Q2 objects2 부재=onco2/icu 재사용 · Q3 시나리오 라벨만 · 착수순서=사용자 선택 "Phase 1 재사용 quick-win".
- **검증:** tsc 0 · jest 100/100(infusion 6) · 시뮬레이터 5구역(접수·베이·격리·다과·스테이션) 렌더 확인.
- **환경:** Expo Go `exp://` 딥링크로 검증(네이티브 dev client `forin://`는 iOS26 열기확인창+osascript 차단으로 불가). 데브클라이언트 재빌드로 MessageQueue 부팅 실패 해소.
- **편차:** scale 0.9 · InfusionChair footprint 2×2(휠체어 통로) · SVG text(☕)→shape · 3F 라벨 순서 변경 · 시나리오 라벨만.
- **결정자:** 사용자("이어서 해줘" + 착수순서 Phase 1 선택) + AI(v16 diff 반영·계획·Build Spec·구현·검증).

## 2026-07-18 · 5g-k Nursery 구현 (v16, Phase 1 계속)
- **결정:** 신생아실을 v16 핸드오프 1:1 구현. 28×42, floorTheme `peds`, 좌측 엘리베이터 문, 5구역(손위생·가운 → 배시넷 존(배시넷×10) → 신생아 사정·워머 → 수유실 + 면회 관람창). NICU(중환자)와 구분. **전용 objects2 부재** → ld2 4종(Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet) + psych2 ObsWindow 1종만 신규 `nurseryEquipment.tsx`로 포팅, 나머지(sinkor·scrubdispenser·gownbox·babyscale·phototherapy·milkfridge·compcart·sofa·coffeetable·icurtain·ireception·ichair·iplant) 재사용.
- **핸드오프 버그 보정:** admit(사정 워머)·viewing(관람창)이 핸드오프에서 **개구부 없이 완전 봉인**(x18·x13 divider 전벽) → 도달 불가. 임상 동선에 맞춰 **doorway 2개 신설**(nursery↔admit th{18,17} · feeding↔viewing th{13,34}). 봉인 유지는 명백한 버그이므로 reachability 원칙 우선.
- **해소된 질문:** Q1 진입=엘리베이터 **WOMEN 3F**(신생아실 선두 배선, entry {1,6}); L&D·산후 병존 → Phase 2 구현 시 sub-선택 · Q2 objects2 부재=ld2/psych2 재사용 · Q3 봉인방=doorway 신설 · Q4 시나리오 라벨만.
- **검증:** tsc 0 · jest 106/106(nursery 6) · 시뮬레이터 5구역(입구·배시넷·워머·수유·관람창, ObsWindow 렌더) 확인.
- **편차:** scale 0.9 · doorway 2개 추가 · Bassinet/InfantWarmer/NursingRecliner footprint 2×2 · 3F 라벨 순서 변경 · 시나리오 라벨만.
- **결정자:** 사용자("이어서 해줘"·Phase 1 quick-win) + AI(Build Spec·구현·봉인방 진단/보정·검증).

## 2026-07-18 · 5g-l Women & Kids OPD 구현 (v16, Phase 1 완결)
- **결정:** 소아·산부인과 외래 + 키즈광장을 v16 핸드오프 1:1 구현. 28×40, floorTheme `peds`, 상단 캠퍼스 문, 5구역(로비·접수·계측 → 키즈 놀이광장 → 소아청소년과 외래 → 산부인과 외래 + 초음파실). 신규 오브젝트 **FetalMonitor 1종**(ld2)만 포팅, 나머지(clinicReception·ultrasound·babyscale·stadiometer·tonguejar·stickerroll·smallslide·rockinghorse·toychest·blocks·mural·playmat·watercooler·ibed·ireception·ichair·imonitor·iplant) 재사용.
- **peds 1F 교체:** 사용자 지시("핸드오프상 peds를 대체하는 게 womenkids-opd면 대체"). v16 핸드오프가 monolithic peds 센터(외래+병동+NICU)를 **층별 분리**(interior-peds.jsx 34×48 = OPD+ward+NICU → v16: OPD=1F womenkids-opd·병동=2F·NICU=4F). 엘리베이터 WOMEN 1F를 `INT-PEDS-00001`→`INT-WOMENKIDS-OPD-00001`로 교체(entry {13,1}). `INT-PEDS`는 FIXTURES 잔존 — 병동/NICU가 Phase 2에서 2F/4F로 정식화될 때까지 딥링크 접근. 피부과 2F 교체 선례.
- **해소된 질문:** Q1 peds 교체=사용자 지시로 1F 정식 교체 · Q2 신규=FetalMonitor 1종만 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 112/112(womenkids 6) · 시뮬레이터 5구역(로비·놀이·소아외래·산부인과·초음파, FetalMonitor 렌더) 확인.
- **마일스톤:** **v16 Phase 1(재사용 quick-win) 3종 전부 완료**(infusion·nursery·womenkids-opd). 재사용 파이프라인 검증 — 신규 부서당 신규 오브젝트 1~5종만 포팅, 나머지 기존 카탈로그 재사용으로 성립.
- **편차:** scale 0.9 · SVG text→shape · FetalMonitor footprint 2×2 · WOMEN 1F peds→womenkids-opd 교체(peds ward/NICU는 Phase 2 복원) · 시나리오 라벨만.
- **결정자:** 사용자(peds 교체 지시) + AI(peds↔womenkids-opd 핸드오프 관계 분석·Build Spec·구현·검증).

## 2026-07-18 · 5g-m L&D 구현 (v16, Phase 2 착수 · WOMEN 3F 통합)
- **결정:** 가족 분만실 L&D를 v16 핸드오프 1:1 구현. 28×50, floorTheme `peds`, 좌측 엘리베이터 문, **6구역 통합**(OB 분류 · 무통 준비 · 중앙 스테이션 · LDR 분만실×2 + 신생아 워머 · 산후 모아동실 · 유리 신생아실). ld2 잔여 2종(BirthingBed·DeliveryCart)만 신규 `ldEquipment.tsx`로 포팅, 나머지 ld2(Bassinet·InfantWarmer·NursingRecliner·WarmerCabinet·FetalMonitor)는 nursery/womenkids 카탈로그 재사용 + er/ward/shared 재사용.
- **3F 통합 판단:** `interior-ld.jsx`가 3F 전체 산과 층을 한 인테리어로 통합(L&D+산후+신생아) → 엘리베이터 3F 라벨과 정확히 일치. Phase 1에서 임시로 3F에 걸었던 `INT-NURSERY-00001`을 **`INT-LD-00001`로 교체**. standalone nursery(+미구현 postpartum)는 ld 존이 subsume → FIXTURES/딥링크로만 잔존.
- **해소된 질문:** Q1 3F=INT-LD 통합 배선(nursery 교체) · Q2 postpartum/nursery 중복=ld가 통합 포함 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 118/118(ld 6) · 시뮬레이터 6구역(분류·마취·스테이션·LDR·산후·신생아, BirthingBed/DeliveryCart 렌더) 확인.
- **편차:** scale 0.9 · BirthingBed footprint 3×2·DeliveryCart 2×1 · 3F INT-NURSERY→INT-LD 교체 · standalone postpartum 미배선 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 2 계속 진행") + AI(ld.jsx 통합 구조 분석·Build Spec·구현·검증).

## 2026-07-18 · 5g-n NICU + 5g-o PICU 구현 (v16, Phase 2 완결 · WOMEN 4F)
- **결정:** NICU·PICU를 v16 핸드오프 1:1 구현. 둘 다 28×44, floorTheme `peds`, 좌측 엘리베이터 문, **저조도 tint**.
  - **NICU**(INT-NICU-00001, 5구역): 전실 스크럽 게이트 → 중앙 모니터 스테이션 · 소생 베이 → A/B 포드(유리 분리). nicu2 4종(NICUIsolette·GiraffeWarmer·CPAPUnit·PhototherapyLED) 신규 `nicuEquipment.tsx`.
  - **PICU**(INT-PICU-00001, 5구역): 전실 → 중앙 허브 → 유리벽 격실 3(vent·진정/집중감시/가족상주). picu2 3종(PICUBed·PedVentilator·BroselowCart) + hospice2 ReclinerDaybed 신규 `picuEquipment.tsx`. 유리 전면 + 슬라이딩 도어.
- **층당 복수부서 미해결:** WOMEN 4F=NICU+PICU. **NICU만 4F 정식 배선**(entry {1,6}), **PICU는 FIXTURES/딥링크**(정식 배선은 층당 sub-dept 선택 UI 필요 — 사용자 결정 대기). 동일 이슈: DX 3F(infusion+dialysis), ONCO 4F(hospice+geri).
- **해소된 질문:** Q1 4F=NICU 선두 배선·PICU 딥링크 · Q2 ReclinerDaybed=hospice2 차용 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 130/130(nicu 6·picu 6) · 시뮬레이터(NICU A포드 인큐베이터·소생 베이 기린워머 / PICU 베드·vent·broselow·유리) 확인.
- **마일스톤:** **v16 Phase 2(WOMEN 건물) 완결** — ld(3F 통합)·nicu(4F)·picu. 여성소아 센터 1F(OPD)·3F(L&D)·4F(NICU) 정식 배선 + PICU 딥링크. (2F 소아 일반 병동은 기존 peds ward가 후속 정식화 대기.)
- **편차:** scale 0.9 · SVG text→shape · 저조도 tint · 신규 footprint props{w,h} · PICU 4F 미배선(딥링크) · ReclinerDaybed hospice2 차용 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 2 계속 진행") + AI(Build Spec·구현·검증·복수부서 이슈 문서화).

## 2026-07-18 · 엘리베이터 층당 복수부서 sub-선택 UI
- **결정:** `ElevatorScreen`의 `ElevFloor`에 `rooms?: {dept, interior?, entry?}[]` 추가. 층 선택 시 해당 층에 `rooms`가 있으면 부서 sub-picker(칩 행)를 노출, 선택한 방의 interior/entry로 라이드. 미구현 방은 `준비 중` 표시(라이드 시 기존 준비중 alert). GO 바 라벨에 선택 부서명 표기.
- **적용:** WOMEN 4F=[NICU(INT-NICU), PICU(INT-PICU)] → **PICU 정식 엘리베이터 접근**. DX 3F=[외래 주사센터(INT-INFUSION), 인공신장실(준비 중)]. 향후 복수부서 층(ONCO 4F hospice+geri 등)은 `rooms[]`로 추가만 하면 자동 지원.
- **근거:** 층당 인테리어 1슬롯 한계로 두 번째 부서가 딥링크로만 접근되던 문제 해소. 사용자 "지금 만들기" 선택.
- **검증:** tsc 0 · jest 130/130 · 시뮬레이터 엘리베이터(WOMEN 4F 두 부서 표기·GO 라벨) 확인. sub-picker 탭 상호작용은 osascript 접근성 차단으로 육안 탭검증 불가(조건부 렌더·상태 로직은 tsc/구조로 검증).
- **결정자:** 사용자("지금 만들기") + AI(rooms[] 모델·sub-picker·ride 해소 구현).

## 2026-07-18 · 5g-p Radiology 구현 (v16, Phase 3 착수 · DX 1F)
- **결정:** 영상의학과를 v16 핸드오프 1:1 구현. 28×48, floorTheme `clinical`, 좌측 엘리베이터 문, 6구역(접수·대기 + 저조도 PACS 판독실 → 중앙 복도 → CT·MRI 촬영실(각 유리 제어 부스) → X-ray 촬영실). rad2 5종(CTScanner·MRIScanner·XrayUnit·ControlConsole·LeadApronRack) 신규 `radEquipment.tsx`; pacsviewer(ortho)·waitingdisplay/vitals(er)·handrail(ward)·shared 재사용.
- **해소된 질문:** Q1 진입=DX 1F(lobby) 단일 배선(진단검사/혈액은행 후속 rooms[] 전환 여지) · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 136/136(rad 6) · 시뮬레이터 CT(도넛 갠트리·제어콘솔·유리부스)·MRI(대형 보어·납방호복) 화면단위 대조 확인.
- **편차:** scale 0.9 · SVG text(MAGNET ON)→shape · 스캐너 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-q Endoscopy 구현 (v16, Phase 3 · DX 4F)
- **결정:** 내시경실을 v16 핸드오프 1:1 구현. 28×44, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(접수·대기 → 전처치·회복 베이 · 세척·재처리실 AER → 시술실 1 상부·2 대장). endo2 4종(EndoTower·ScopeWasher·ScopeCabinet·ProcedureBed) 신규 `endoEquipment.tsx`; oxygen/suction(er)·sinkor·wastebin·shared 재사용.
- **해소된 질문:** Q1 진입=DX 4F 단일 배선(Cath/IR 후속) · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 142/142(endo 6) · 시뮬레이터 시술실1(EndoTower 점막모니터·ProcedureBed)·재처리실(ScopeWasher·ScopeCabinet·biohazard) 화면단위 대조 확인.
- **편차:** scale 0.9 · SVG text(CO₂)→shape · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-r Hemodialysis 구현 (v16, Phase 3 · DX 3F sub-선택)
- **결정:** 인공신장실을 v16 핸드오프 1:1 구현. 28×44, floorTheme `clinical`, 좌측 엘리베이터 문, 4구역(접수·체중 측정 → 오픈 투석 치료실(체어+투석기 6스테이션, 중앙 간호 아일랜드) → RO 수처리실 · 격리 투석 스테이션). dial2 3종(DialysisMachine·DialysisChair·ROWaterUnit) 신규 `dialEquipment.tsx`; nursestation·compcart·sinkor·stadiometer·wastebin·shared 재사용.
- **엘리베이터:** DX 3F sub-picker의 두 번째 방(인공신장실)을 준비 중 → **INT-DIAL로 정식 배선**(외래 주사센터와 3F 공유). sub-선택 UI 실사용 첫 정식 케이스.
- **해소된 질문:** Q1 진입=DX 3F sub-선택 배선 · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 148/148(dial 6) · 시뮬레이터 투석 치료실(체어+투석기)·RO 수처리실(트윈 멤브레인) 화면단위 대조 확인.
- **편차:** scale 0.9 · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-s Specialty OPD 구현 (v16, Phase 3 완결 · DX 2F)
- **결정:** 전문 외래(안과·이비인후과·비뇨·신경과)를 v16 핸드오프 1:1 구현. 28×44, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(통합 접수 → 안과·이비인후과 → 비뇨·신경과). eye2 4종(SlitLamp·PhoropterStand·ENTTowerChair·VisionChart) 신규 `specialtyEquipment.tsx`(objects2 부서명 불일치=eye2); otoscope(er)·clinicReception/ultrasound(clinic)·waitingdisplay/compcart·shared 재사용.
- **해소된 질문:** Q1 진입=DX 2F 단일 배선(4과 통합) · Q2 objects2=eye2 확인 후 포팅 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 154/154(specialty 6) · 시뮬레이터 안과(SlitLamp·PhoropterStand·VisionChart)·ENT(ENTTowerChair·Otoscope) 화면단위 대조 확인.
- **마일스톤:** **v16 Phase 3(DX 진단동) 완결** — rad(1F)·specialty(2F)·dial(3F sub)·endo(4F). 진단동 4개 층 전부 정식 엘리베이터 배선.
- **편차:** scale 0.9 · VisionChart text→shape · ultrasound footprint props 부여 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 3 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-t Oncology/BMT 구현 (v16, Phase 4 착수 · ONCO 3F)
- **결정:** 종양학·BMT를 v16 핸드오프 1:1 구현. 28×50, floorTheme `internal`, 좌측 엘리베이터 문, 6구역(약물 조제 확인·상담실 → 중앙 스테이션 → 개방형 항암 주입 베이 → BMT 전실·양압 무균 이식실 2). onco2 잔여 2종(BMTPod·ChemoHazardBin) + Fridge(peds) 신규 `oncoEquipment.tsx`; infusionchair/smartinfusionpump/ppestation(infusion)·warmercabinet(nursery)·er/ward/shared 대거 재사용.
- **봉인 방 보정(핸드오프 버그):** ① 전실 진입 Th가 x8(ante\|bmt 경계 열)에 있어 anteroom 봉인 → x4로 이동. ② BMT 이식실 2 유리 완전 봉인 → room1↔room2 sterile 도어(y43) 신설. reachability 원칙.
- **해소된 질문:** Q1 진입=ONCO 3F 단일 배선 · Q2 봉인 방=게이트 이동+도어 신설 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 160/160(onco 6) · 시뮬레이터 주입 베이·BMT 이식실(HEPA 헤더·유리 격리)·조제확인(Fridge·ChemoHazardBin) 화면단위 대조 확인.
- **편차:** scale 0.9 · SVG text(HEPA/CHEMO/VAX)→shape · 봉인 방 2건 도달성 보정 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·봉인방 진단/보정·검증).

## 2026-07-18 · 5g-u Hospice/Palliative 구현 (v16, Phase 4 · ONCO 4F sub-선택)
- **결정:** 완화의료·호스피스를 v16 핸드오프 1:1 구현. 28×44, floorTheme `peds`(가정형 따뜻한 톤), 좌측 엘리베이터 문, 5구역(가족 라운지·키친 → 완화 케어 스테이션·명상/추모실 → 가정형 1인 완화 병실 A·정원뷰 선룸 병실 B). hospice2 3종(HospiceBed·ComfortCart·SyringeDriver) + ADLKitchen(rehab2) 신규 `hospiceEquipment.tsx`; ReclinerDaybed(picu)·Fridge(onco)·er/shared 재사용.
- **엘리베이터:** ONCO 4F sub-picker 첫 번째 방을 INT-HOSPICE로 배선(노인성 질환 병동=geri는 준비 중, 다음). 임상 병동이 아닌 존엄 케어 공간(명상실·정원 선룸 저조도 tint).
- **해소된 질문:** Q1 진입=ONCO 4F sub-선택 · Q2 ADLKitchen=rehab2 공유 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 166/166(hospice 6) · 시뮬레이터 완화 병실 A(HospiceBed·SyringeDriver·ReclinerDaybed)·가족 라운지(ADLKitchen·Fridge)·명상실 화면단위 대조 확인.
- **편차:** scale 0.9 · 신규 footprint props · ONCO 4F sub-선택 배선 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-v Geriatric/Dementia 구현 (v16, Phase 4 · ONCO 4F sub-선택)
- **결정:** 치매·노인성 질환 병동을 v16 핸드오프 1:1 구현. 28×44, floorTheme `peds`, 좌측 엘리베이터 문, 5구역(데이 커먼 배회 안전존 → 노인 간호 스테이션·회상 라운지 → 치매 병실 A·B). geri2 5종(LowBed·MemoryBox·OrientationBoard·GeriReclineChair·HandrailWall) 신규 `geriEquipment.tsx`; ComfortCart(hospice)·er/shared 재사용.
- **엘리베이터:** ONCO 4F sub-picker 두 번째 방을 INT-GERI로 배선(hospice와 4F 공유) → **ONCO 건물 완비**(3F onco·4F hospice+geri·1F/2F rehab/psych 예정).
- **해소된 질문:** Q1 진입=ONCO 4F sub-선택 · Q2 시나리오 라벨만.
- **검증:** tsc 0 · jest 172/172(geri 6) · 시뮬레이터 데이 커먼(HandrailWall·OrientationBoard·GeriReclineChair)·치매 병실 A(LowBed) 화면단위 대조 확인.
- **편차:** scale 0.9 · OrientationBoard text→shape · 신규 footprint props(벽 부착 3종 비충돌) · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-w Inpatient Psych 구현 (v16, Phase 4 · ONCO 2F)
- **결정:** 정신과 폐쇄병동을 v16 핸드오프 1:1 구현. 28×44, floorTheme `internal`, 좌측 엘리베이터 문, 5구역(이중 통제문·소지품 보관 → 관찰 간호 스테이션·데이룸 → 안전 병실·패딩 안정실). psych2 3종(SafeBed·SeclusionPad·GroupTable) 신규 `psychEquipment.tsx`; ObsWindow(nursery)·MetalDetector(er 'detector')·shared 재사용.
- **관찰창 동선:** station|dayroom x13 divider에 ObsWindow(y12) + 상하 통행 gap(y11/y13). 관찰창은 장식(비충돌), 개구부가 실제 스테이션↔데이룸 동선.
- **해소된 질문:** Q1 진입=ONCO 2F 단일 배선(정신과 외래 후속) · Q2 관찰창=창+gap · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 178/178(psych 6) · 시뮬레이터 안전 병실(SafeBed×4)·안정실(SeclusionPad·ObsWindow·CCTV) 화면단위 대조 확인.
- **편차:** scale 0.9 · 신규 footprint props(seclusionpad 비충돌) · 관찰 gap · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-x Rehabilitation 구현 (v16, Phase 4 완결 · ONCO 1F)
- **결정:** 대형 재활치료실 PT/OT Gym을 v16 핸드오프 1:1 구현. 28×44, floorTheme `peds`, 좌측 엘리베이터 문, **하나의 개방형 gym** 5구역(재활 접수·평가 → 보행 훈련존·매트 치료존 → 유산소·근력 존·OT ADL 훈련). rehab2 5종(ParallelBars·TherapyMat·Treadmill·ShoulderPulley·GymBallRack) 신규 `rehabEquipment.tsx`; ADLKitchen(hospice)·WalkerRack(surg)·shared 재사용.
- **개방형 gym 보정:** gait|mat 세로벽(h8)이 y26 lower-gym threshold와 1칸 겹쳐 → h7로 트림(도달성).
- **해소된 질문:** Q1 진입=ONCO 1F 단일 배선 · Q2 개방형 gym 구획 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 184/184(rehab 6) · 시뮬레이터 보행 훈련존(ParallelBars·Treadmill·WalkerRack)·OT ADL(ADLKitchen·GymBallRack) 화면단위 대조 확인.
- **마일스톤:** **v16 Phase 4(ONCO 암센터) 완결** — onco(3F)·hospice+geri(4F sub)·psych(2F)·rehab(1F). ONCO 4개 층 전부 정식 배선. 메인 타워·여성소아·외래진단·암센터 4개 건물 완비.
- **편차:** scale 0.9 · 신규 footprint props · gait|mat 세로벽 트림 · 시나리오 라벨만.
- **결정자:** 사용자("Phase 4 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-y Sim Lab / Nursing Admin 구현 (v16, Phase 5 착수 · ADMIN 3F)
- **결정:** 간호부·감염관리·시뮬레이션 랩을 v16 핸드오프 1:1 구현. 28×42, floorTheme `clinical`, 좌측 엘리베이터 문, 5구역(간호부 총괄 사무실 → 감염관리실·디브리핑 강의실 → 시뮬레이션 랩·원웨이 미러 제어실). sim2 4종(SimManikin·ControlBooth·OfficeDesk·PPEBoard) 신규 `simEquipment.tsx`; shared/er/or/icu 재사용.
- **봉인 제어실 보정:** 제어실이 원웨이 미러 벽(x18)+y24 벽으로 완전 봉인 → x18 벽에 staff 도어(y37) 신설. reachability 원칙.
- **해소된 질문:** Q1 진입=ADMIN 3F 단일 배선 · Q2 봉인 제어실=staff 도어 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 190/190(sim 6) · 시뮬레이터 시뮬랩(SimManikin·크래시카트)·간호부(OfficeDesk×3)·감염관리(PPEBoard) 화면단위 대조 확인.
- **편차:** scale 0.9 · PPEBoard text→shape · 제어실 staff 도어 신설 · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·봉인방 보정·검증).

## 2026-07-18 · 5g-z Staff Lounge/Locker/Cafeteria 구현 (v16, Phase 5 · ADMIN 2F)
- **결정:** 직원 락커룸·의료진 휴게실·식당을 v16 핸드오프 1:1 구현. 28×40, floorTheme `clinical`, 좌측 엘리베이터 문, 4구역(락커룸 A·B → 의료진 휴게실 · 직원 식당). lounge2 4종(LockerBank·Vending·DiningTable·ServeryCounter) 신규 `loungeEquipment.tsx`; coffeemachine(infusion)·nursingrecliner(nursery)·sink·shared 재사용.
- **단절 보정(핸드오프 버그):** lockerA|B(x13)·lounge|cafe(x13) 세로벽 전벽 봉쇄로 엘리베이터 쪽(A+lounge)과 반대쪽(B+cafe)이 단절 → lounge↔cafe 도어(y27) 신설로 전체 순환.
- **해소된 질문:** Q1 진입=ADMIN 2F 단일 배선 · Q2 단절=lounge↔cafe 도어 · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 196/196(lounge 6) · 시뮬레이터 락커룸(LockerBank)·휴게실(Vending)·식당(DiningTable) 화면단위 대조 확인.
- **편차:** scale 0.9 · lounge↔cafe 도어 신설 · ServeryCounter footprint 부여 · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·단절 보정·검증).

## 2026-07-18 · 5g-aa SPD/Nutrition/Dock 구현 (v16, Phase 5 · ADMIN 1F)
- **결정:** 중앙공급실·영양팀·하역장을 v16 핸드오프 1:1 구현. **30×44 와이드**, floorTheme `pharma`, 좌측 엘리베이터 문 + 우측 하역장 롤업 게이트, 4구역(오염 세척 Decon → 세척→멸균 pass-through → 멸균·보관 → 영양팀 배식실 → 화물 하역장). spd2 6종(Autoclave·SterileRack·WasherDisinfector·FoodCartColumn·PalletStack·CargoTruck) 신규 `spdEquipment.tsx`; adlkitchen(hospice)·fridge(onco)·medcart/floortape/shelflabel(pharma)·soiledcart(or)·shared 재사용.
- **해소된 질문:** Q1 진입=ADMIN 1F 단일 배선 · Q2 30-와이드 산업 라인(세척→멸균 sterile pass-through·우측 하역 게이트) · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 202/202(spd 6) · 시뮬레이터 멸균(Autoclave×2·SterileRack)·배식(FoodCartColumn)·하역장(PalletStack·FloorTape 안전선) 화면단위 대조 확인.
- **편차:** scale 0.9 · cols 30 · icabinet kind→variant supply · 신규 footprint props · 시나리오 라벨만.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 5g-ab Morgue & Autopsy 구현 (v16, Phase 5 완결 · ADMIN B1) — 🎉 **v16 전체 완결**
- **결정:** 영안실·부검실을 v16 핸드오프 1:1 구현. 28×40, floorTheme `clinical`, 좌측 엘리베이터 문, **전면 저조도 Tint(#1E2530 op0.14)로 지하·통제 구역 무드**. 5구역(접수·인수인계 → 시신 냉장 보관실 → 부검실 → 유족 참관실 → 시설팀 기계실). morgue2 3종(CadaverFridge 다단 냉장 뱅크·AutopsyTable 천공 배수대·ViewingBier 드레이프 catafalque+백합+촛대) 신규 `morgueEquipment.tsx`; gurney(er)·autoclave(spd)·sinkor/instrumenttray(or)·shared 재사용.
- **해소된 질문:** Q1 진입=ADMIN **B1** 단일 배선(ADMIN 건물 완결: 1F spd·2F lounge·3F sim·B1 morgue) · Q2 톤=전면 저조도 Tint · Q3 시나리오 라벨만.
- **검증:** tsc 0 · jest 208/208(morgue 6) · 시뮬레이터 5개 방(접수·냉장보관 CadaverFridge×3·부검실 AutopsyTable·참관실 ViewingBier·기계실 Autoclave) 화면단위 대조 확인.
- **편차:** 전면 Tint · 신규 footprint props(cadaverfridge 4×2·autopsytable 3×2·viewingbier 2×1) · icabinet variant equipment(비충돌) · 시나리오 라벨만.
- **🎉 마일스톤:** **v16 20개 신규 부서 전체(Phase 1–5) 완결.** WOMEN·DX·ONCO·ADMIN 4개 건물 모든 층 정식 배선. morgue가 마지막 부서. 다음: 시나리오(`scenarioId`) 연결·콘텐츠.
- **결정자:** 사용자("Phase 5 계속 진행, 방·화면단위 검증") + AI(Build Spec·구현·검증).

## 2026-07-18 · 서버 스택 = Go 유지 (FastAPI/LangChain 재작성 반대)
- **질문(사용자):** AI 활용성(langchain/langgraph) 위해 서버를 파이썬 FastAPI로 바꿔야 하나?
- **결정:** **Go 유지.** 대화 엔진이 이미 Go로 완성(`conversation/{engine,strategy}.go` — 페르소나 롤플레이·스트리밍·교정 + anthropic/openai/azurespeech 어댑터). forin의 AI 요구는 단일 페르소나 롤플레이+스트리밍+교정 = Messages API 위 얇은 래퍼(API glue); 추론은 벤더에서 일어나므로 서버는 I/O·SSE 오케스트레이션 → Go가 유리. LangChain/LangGraph는 현 요구 초과(over-engineering). 재작성은 순수 손해(OIDC·pgx·redis·sqlc·헥사고날 4,800줄).
- **향후:** RAG/에이전트 그래프/파이썬 전용 ML 필요 시 **파이썬 사이드카 마이크로서비스**로 분리(Go가 호출). 재작성 아님.
- **결정자:** 사용자(질문·최종 승인) + AI(코드베이스 근거 기반 권고).

## 2026-07-18 · 시나리오 런타임 착수 — 브리핑→AI 다이얼로그 (ER 파일럿 버티컬 슬라이스)
- **결정:** 퀘스트 핫스팟 → 실제 시나리오 → AI 페르소나 대화 런타임. 착수전략 **버티컬 슬라이스**(ER `SCN-ER-00002` 1개 A→B→C 관통), 화면 **핸드오프 1:1 포팅**.
- **A 서버:** `content.Scenario`에 optional `Briefing`(dept·brief·difficulty·timeLabel·skills·rewards·reqs·tone) + `Persona` 표시필드(sub·hair·hairStyle). 마이그레이션 `000009_scenario_briefing`(briefing jsonb). sqlc 생성코드 수동 편집(CLI 부재). `SCN-ER-00002.yaml` 저작 + 로드 회귀 테스트.
- **B 모바일:** `api/client.ts` scenario/startConversation/sendMessage/sendMessageStream(XHR SSE 파서).
- **C 화면:** `scenario/[id].tsx`(브리핑, 스텁 교체) + `dialogue/[id].tsx`(신규). RoleFace·PixelButton·tokens 재사용.
- **ID 컨벤션:** 서버 검증기 `^[A-Z]+(-[A-Z]+)*-\d{5,}$` 강제 → v16 케밥 폐기, 서버 `SCN-*` 채택(인테리어 `INT-*`와 동일). ER 핫스팟 `o-tri-recep` → `SCN-ER-00002`.
- **검증(실 스택 E2E):** DB seed→`GET /scenarios/SCN-ER-00002`(briefing 왕복)→devtoken(실 user UUID)→`POST conversation`→`message`(NPC 페르소나 응답)→`stream`(SSE 형식 = 모바일 파서). 시뮬레이터: 브리핑 실데이터 렌더, 대화 세션오픈+오프닝 렌더(임시 devtoken 주입 후 원복). go test·tsc 0·jest 208/208.
- **후속:** 힌트모드·마이크 STT·발음 채점·결과화면·미니퀴즈·나머지 시나리오 저작·`scenarios.ts` Dept 20부서 확장·dev-login.
- **결정자:** 사용자("Go 유지하고 시나리오 연결 착수") + AI(Build Spec·구현·검증).

## 2026-07-19 · 힌트모드 + dev-login (인증 우회, ENV=dev 게이트)
- **힌트모드:** 대화 화면 💡 힌트 토글 → scenario.keyPhrases를 추천 답변 ChoiceRow로(1번 ★AI추천). 탭하면 입력창 채움. 핸드오프 screens-dialogue hint 1:1. 시뮬레이터 렌더 확인.
- **dev-login(문제 해결):** 임시 devtoken 원복 후 앱에 유효 세션이 없어 대화가 401. 매번 수동 토큰 주입 대신 **서버 `POST /auth/dev`**(provider 검증 없이 고정 dev 유저 upsert+토큰 발급)를 **`ENV=dev`일 때만 라우트 등록**(prod 미등록). 모바일 `api.devLogin()`+로그인 화면 "🛠 개발자 로그인" 버튼이 실 토큰 저장(setSession+secureStore). 기존 가짜 `authStore.devLogin`('dev' 문자열→401 유발) 제거.
- **보안:** dev-login은 비프로덕션 전용(라우트가 prod에 없음). 로컬 개발에서 OIDC 없이 인증 플로우(대화·퀴즈·발음) 검증 가능.
- **검증:** `POST /auth/dev`→실 토큰→conversation/message 페르소나 응답 OK. tsc 0·go build 0. 로그인 화면 dev 버튼 렌더 확인.
- **결정자:** 사용자("api 에러가 났어, 이어서") + AI(원인 진단·dev-login 구축).

## 2026-07-19 · 미니퀴즈 — sentence_build (문장완성) 버티컬 슬라이스
- **결정:** 서버에 quiz 조회 경로가 전무 → 전체 구축. `content.Quiz`에 optional `QuizContent`(sub·zone·context·hint·template(`__` 빈칸)·answers·wordBank). 마이그레이션 `000010_quiz_content`(content jsonb). sqlc 수동편집(GetQuiz 신규 + InsertQuiz). `ContentReader.GetQuiz` + `GET /quizzes/{id}`(public). `QZ-ER-00001` 문장완성 저작. scn-er-00002에 quiz step(QZ-ER-00001) 추가(기존 steps jsonb 활용, 신규 필드 없음).
- **모바일:** `api.quiz()` + `ScenarioDetail.steps`/`QuizDetail` 타입 · `useQuizData` 훅 · `quiz/[id].tsx`(핸드오프 ScreenQuizSentence 1:1: CONTEXT·슬롯 문장·단어카드 탭 채우기·제출·정오답). 대화 화면 action rail에 quiz step 있으면 "📝" 버튼→quiz.
- **범위:** 6종 중 sentence_build 1종만(가장 관련·자족적). match_pairs·vitals·listen·sbar·triage는 후속(동일 패턴 확장).
- **검증:** go test(로더: template/answers/wordBank·answer⊆wordBank)·jest 208/208·tsc 0. `GET /quizzes/QZ-ER-00001` 콘텐츠 왕복 OK. 시뮬레이터 문장완성 화면 렌더(슬롯·단어카드 shuffle·CONTEXT) 확인.
- **결정자:** 사용자("순서대로 작업, 너가 하고싶은대로") + AI(구축·검증).

## 2026-07-19 · 세션 부트스트랩(반복 401 해결) + 발음 채점(클라이언트)
- **반복 401 근본원인:** `restoreSession`이 진입 게이트(index.tsx)에서만 실행 → 대화 화면 딥링크/Fast-Refresh 리로드 시 in-memory 세션 소실, secureStore 토큰이 있어도 복원 안 됨. **루트 `_layout`으로 이동 + `bootstrapSession`**(복원 실패 시 __DEV__에서 auto devSignIn). 검증: 대화 딥링크 conversation 200(이전 401).
- **발음 채점:** expo-audio(16kHz mono PCM WAV) 녹음 → base64(expo-file-system/legacy) → `POST /pronunciation`(기존) → 점수. `PronunciationScore`(recognized·4개 바·단어칩) + `PronunciationPractice`(녹음→채점, 힌트 패널의 추천 문장 발음 연습). `api.assessPronunciation`.
- **⚠️ 외부 블로커:** (1) **서버 `AZURE_SPEECH_KEY`가 401**(무효/만료) — 라이브 채점 불가, 유효 키 필요. (2) iOS 시뮬레이터 마이크 없음 — 실제 녹음은 실기기/dev-build 필요. 코드는 계약대로 정확·graceful degrade. 검증: 앱 부팅(expo-audio 번들 OK)·발음 연습 UI 렌더·tsc 0·jest 208/208.
- **범위:** 발음 연습(레퍼런스 문장 채점)만. STT-as-input(자유발화→텍스트)은 후속.
- **결정자:** 사용자("api 에러가 났어, 이어서") + AI(진단·부트스트랩·발음 클라이언트 구축).

## 2026-07-19 · 결과/리워드 화면 + 시나리오 제작(ER 세트 완성)
- **결과 화면:** `result/[id]`(핸드오프 ScreenDialogueResult 1:1) — SCENARIO CLEAR·참잘했어요 스티커·REWARDS(서버 briefing.rewards)·따뜻한 메시지·리뷰랩/다음. 컨페티는 RN Animated 버스트. 퀴즈 클리어(✓ 완료)→result 연결.
- **시나리오 제작:** ER 인테리어 4개 핫스팟 전부 실 시나리오로 완성 — SCN-ER-00002(통증·Mrs.Hopkins, 기존), SCN-ER-00001(흉통·Mr.Robinson, briefing 보강), SCN-ER-00003(아나필락시스·Tyler's Mom, 신규), SCN-ER-00004(자해위험 안전사정, 신규·민감 임상콘텐츠→공감·비판단·안전 가드레일). 케밥 핫스팟 3개 → SCN-* 정렬. persona 표시필드·briefing(dept·brief·difficulty·skills·rewards·reqs)·keyPhrases·steps 완비.
- **검증:** go test(로더: 5 시나리오·briefing 왕복·무-briefing 회귀는 SCN-GEN-00003)·jest 208/208·tsc 0. `GET /scenarios/SCN-ER-000{1,3,4}` 200. 시뮬레이터 아나필락시스 briefing 실데이터 렌더 확인.
- **후속:** ER 나머지(police·paramedic·language·fever) + OR/PEDS/ICU/PHARMA + 신규 20부서 시나리오 저작. quiz 타입 확장(match_pairs 등). Azure 키·발음 실기기 검증.
- **결정자:** 사용자("순서대로 작업, 너가 하고싶은대로") + AI(구축·검증).

## 2026-07-19 · ER 시나리오 세트 완결 (8/8)
- SCN-ER-00005 경찰 인계(Officer Davis·SBAR)·00006 교통사고 핸드오프(Paramedic Ruiz·MVA)·00007 언어장벽 통역호출(Mrs.Patel·Hindi)·00008 고열 아동 부모 안심(Mrs.Kim). v16 소스 1:1(persona role police/paramedic/patient/parent·briefing·rewards·reqs·keyPhrases). ER 8개 시나리오 전부 저작 완료(총 9 시나리오 seed).
- 인테리어 핫스팟(4개)은 00001~00004에 배선됨; 00005~00008은 상황판/데일리 로테이션으로 도달(후속 배선 가능).
- 검증: go test(로더 전체 검증)·`GET /scenarios/SCN-ER-000{5,6,7,8}` 200·시뮬레이터 police briefing 렌더(경찰 초상·SBAR·보상).
- **결정자:** 사용자("ER 나머지 시나리오도 만들어줘") + AI(저작·검증).

## 2026-07-19 · OR/PEDS/ICU/PHARMA 시나리오 20종 저작
- v16 scenarios-data.jsx의 OR(5)·PEDS(5)·ICU(5)·PHARMA(5) 전부 저작. 부서별 이벤트 4개(EVT-{OR,PEDS,ICU,PHARMA}-00001, delivery daily_pool) 신설(scenario.eventId 참조 필수). 총 29 시나리오·7 이벤트 seed.
- 생성 방식: 소스에서 briefing(brief·difficulty·time·skills·rewards·reqs)·persona(name·sub) 추출 + 언어 핵심(role·mood·keyPhrases 3개·오프닝 대사 EN/KO·player 라인)은 시나리오별 수기 저작. dept 테마색(OR 보라·PEDS 파랑·ICU 청록·PHARMA 초록).
- 검증: 로더 전체 번들 검증(id·eventId 참조·enum·briefing 왕복) 통과 · seed 29 · `GET /scenarios` 스팟체크(role·mood·keyPhrases·rewards) · 시뮬레이터 OR 동의 briefing 렌더(보라 테마·콧수염 초상).
- 후속: 각 부서 인테리어 핫스팟 배선 · quiz 타입 확장.
- **결정자:** 사용자("OR/PEDS/ICU/PHARMA 시나리오도 만들어줘") + AI(저작·검증).

## 2026-07-19 · 신규 20부서 시나리오 저작 + 배선 (전 부서 커버)
- v16 scenarios-data.jsx엔 신규부서 시나리오 없음 → **각 부서 임상 도메인 기반 from-scratch 저작** 19종(infusion·nursery·womenkids·ld·nicu·picu / rad·endo·dial·specialty / onco·hospice·geri·psych·rehab / sim·lounge·spd·morgue).
- 건물별 이벤트 4개(EVT-{WOMEN,DX,ONCO,ADMIN}-00001, daily_pool). **총 48 시나리오·11 이벤트 seed.**
- 배선: 각 신규 인테리어의 quest 핫스팟(hs-*)에 scenarioId 추가(라벨-시나리오 매칭: rad hs-ct→조영제, ld hs-contract→분만 등). 19/19.
- 건물 테마색: WOMEN 핑크·DX 청록·ONCO 보라·ADMIN 브라운. 민감 도메인(hospice·psych·morgue)은 공감·존엄·비판단 가드레일.
- 검증: 로더 전체 번들 검증·seed 48·스팟체크(mood/difficulty)·tsc 0·jest 208/208·시뮬레이터 분만(LD) 렌더(핑크·pain·B2+).
- **마일스톤: 5개 코어(ER/OR/PEDS/ICU/PHARMA) + 신규 19부서 = 전 부서 최소 1개 플레이 가능 시나리오 배선 완료.**
- **결정자:** 사용자("신규 20부서 시나리오도 만들어줘") + AI(from-scratch 저작·배선·검증).

## 2026-07-19 · 퀴즈 타입 3종 확장 — match_pairs · listen · sbar
- 서버 `QuizContent` 확장(content jsonb, 마이그레이션 불필요): Pairs(match) · AudioText+Choices(listen) · Cards(sbar). QuizPair/QuizChoice/QuizCard 구조체.
- 퀴즈 저작: QZ-ER-00002(통증 표현 짝맞추기)·QZ-PHARMA-00001(구두 처방 듣기)·QZ-ICU-00001(SBAR 인계 정렬). 총 4 quizzes.
- 모바일: `components/quiz/QuizShell`(공유 chrome) + MatchQuiz·ListenQuiz·SbarQuiz + quiz/[id].tsx type 디스패처. **expo-speech** 설치(듣기 온디바이스 TTS, 🔊 재생).
- 배선: SCN-ER-00001→QZ-ER-00002(짝맞추기), SCN-PHARMA-00002→QZ-PHARMA-00001(듣기), SCN-ICU-00001→QZ-ICU-00001(SBAR) quiz step.
- 검증: 로더·go test·jest 208/208·tsc 0 · 서버 재시작 후 content 왕복(pairs 4/choices 3/cards 5) · 시뮬레이터 3종 렌더(shuffle·트랙 범례·TTS 카드) 확인.
- **결정자:** 사용자("퀴즈 타입 확장해줘") + AI(모델 확장·저작·컴포넌트·검증).

## 2026-07-20 · v17 퀴즈 포맷 3종 추가 — mcq · check · monitor (6 코어 완성)
- v17 핸드오프(`design-handoff_v17`)가 퀴즈 6 코어 포맷(FILL·MATCH·MONITOR·ORDER·CHECK·MCQ) + dept별 인스턴스 추가(`screens-quiz-bank.jsx`·`screens-quiz-depts.jsx`).
- 기보유(sentence/match/sbar/listen)에 더해 **신규 3종 저작·구현**: mcq(치료적 의사소통 QZ-PSYCH-00001)·check(미숙아 위험징후 QZ-NICU-00001)·monitor(EFM 태아심박 QZ-LD-00001). → 6 코어 포맷 완성.
- 서버 `QuizContent` 확장(content jsonb): Scene·Note·Items(check)·Device·Readings·Bank(monitor)·Choice.Ko(mcq). 시나리오 quiz step 배선(PSYCH/NICU/LD).
- 모바일: McqQuiz(SCENE+객관식)·CheckQuiz(클립보드 select-all)·MonitorQuiz(다크 패널 라벨 배정) + 디스패처. QuizShell 재사용.
- 검증: 로더·go test·jest 208/208·tsc 0 · **API 재시작 후** content 왕복(choices/items/readings) · 시뮬레이터 3종 렌더(SCENE 다크카드·클립보드·EFM 패널) 확인.
- **결정자:** 사용자("v17 퀴즈가 추가되었어") + AI(포맷 분석·모델 확장·저작·컴포넌트·검증).

## 2026-07-20 · 퀴즈 포맷 5종 추가 — calc·gauge·sort·spot_error + triage(원안)
- v17 calc·gauge·sort·spot_error 포맷 구현 + **원안 triage(우선순위 정렬)** 추가. 퀴즈 포맷 총 **12종**(fill·match·order·listen·mcq·check·monitor·calc·gauge·sort·spot_error·triage).
- 서버 QuizContent 확장: Given/Eq/Answer/AnswerUnit(calc)·Pool/Buckets(sort)·Gauge(gauge)·Rows(spot_error). triage는 Cards 재사용(track 생략, order=우선순위).
- 퀴즈 저작: QZ-PHARMA-00003(calc 소아용량)·QZ-DIAL-00001(gauge UF)·QZ-SPD-00001(sort 오염/멸균)·QZ-ER-00003(spot_error 헤파린 IM 오류)·QZ-ICU-00002(triage ABC 우선순위). 시나리오 quiz step 배선.
- 모바일: CalcQuiz(키패드)·SortQuiz(버킷)·GaugeQuiz(스테퍼)·SpotErrorQuiz(처방지)·TriageQuiz(색상 랭크 슬롯) + 디스패처.
- 검증: 로더·go test·jest 208/208·tsc 0 · API 재시작 후 content 왕복 · 시뮬레이터 5종 렌더 확인.
- **결정자:** 사용자("calc·gauge·sort + 다양할수록 좋고 아이디어 추가 환영") + AI(구현 + triage 원안).

## 2026-07-20 · 원안 퀴즈 포맷 2종 — abbr(약어 덱)·dialogue_order(대화 순서)
- 핸드오프에 없는 **원안 2종**: abbr(의료 약어 플래시카드 덱, 카드별 MCQ+진행/점수)·dialogue_order(대화 turn을 자연스러운 순서로 배열, 화자 색상). 퀴즈 포맷 총 **14종**.
- 서버 QuizContent: Deck[](abbr) 추가; dialogue_order는 Cards 재사용(Track=화자, Order=turn).
- 저작: QZ-GEN-00001(abbr: NPO/PRN/STAT/BID/PO)·QZ-ER-00004(dialogue_order: 환자 응대 5턴). 배선 SCN-PHARMA-00005·SCN-ER-00007.
- 모바일: AbbrQuiz(플래시카드 덱·진행 도트·점수)·DialogueOrderQuiz(화자 민트/peach 칩·순서 배열) + 디스패처.
- 검증: 로더·go test·jest 208/208·tsc 0 · API 재시작 후 왕복(deck 5·cards 5) · 시뮬레이터 2종 렌더 확인.
- **전체 퀴즈 14종:** fill·match·order·listen·mcq·check·monitor·calc·gauge·sort·spot_error·triage·abbr·dialogue_order.
- **결정자:** 사용자("약어 확장·대화 순서 조립 둘 다 만들어줘") + AI(원안 설계·구현·검증).

## 2026-07-20 · 부서별 퀴즈 대량 저작 — 16종 추가 (총 30 quizzes)
- 퀴즈 없던 시나리오가 많은 부서에 포맷을 섞어 부서별 퀴즈 16종 저작·배선(v17 quiz-bank/depts 콘텐츠 참고 + 저작): OR(check)·PEDS(match)·RAD(check MRI)·ENDO(order)·REHAB(sort)·ONCO(check)·GERI(mcq)·HOSPICE(mcq)·INFUSION(spot_error)·SPECIALTY(match)·WOMENKIDS(calc)·PICU(monitor)·NURSERY(order)·SIM(order BLS)·LOUNGE(dialogue_order)·MORGUE(mcq).
- SbarQuiz를 **일반 order 겸용**으로 확장(트랙 없으면 범례·트랙컬럼 숨김) + 디스패처 `order`→SbarQuiz. (신규 order 퀴즈가 sbar 아님)
- 검증: 로더·go test·jest 208/208·tsc 0 · seed 30 quizzes · 시뮬레이터 order/부서 퀴즈 렌더 확인.
- **결정자:** 사용자("부서별 퀴즈 더 채워줘") + AI(배치 저작·order 겸용화·검증).

## 2026-07-20 · 부서당 시나리오 다양화 — 신규 19부서 각 3개 (총 86 시나리오)
- 신규 부서(WOMEN/DX/ONCO/ADMIN, 각 1개뿐)에 임상 도메인별 2개씩 추가 저작(19×2=38). 이제 각 부서 3개 시나리오. 총 **86 시나리오·30 quizzes**.
- 예: nursery(황달 광선치료·모유수유)·ld(무통분만·산후출혈)·geri(야간섬망·다약제)·psych(우울면담·투약거부)·morgue(부검동의·사후처치) 등. mood·role·난이도 다양화.
- 건물 이벤트(EVT-{WOMEN,DX,ONCO,ADMIN}-00001) scenarios 목록 전체 갱신(WOMEN/DX/ONCO 각 15, ADMIN 12) → 상황판/데일리 로테이션 도달.
- 배선: 인테리어 핫스팟은 부서당 1개(기존); 추가 시나리오는 상황판·데일리 로테이션·딥링크로 도달. (추가 핫스팟 배선은 후속.)
- 검증: 로더 전체 검증·seed 86·시뮬레이터 신규 시나리오 렌더(ONCO 항암 부작용) 확인.
- **결정자:** 사용자("부서당 시나리오도 여러 개로 다양화해줘") + AI(배치 저작·이벤트 갱신·검증).

## 2026-07-20 · 상황판 구현 + 시나리오 300+ 로드맵 (콘텐츠 상시 최우선)
- **상황판 점검 결과:** 모바일 board는 스텁(아무 부서도 노출 X), 서버는 building 이벤트 반환+LIMIT 6 알파벳순(WOMEN/PEDS/PHARMA 누락, 로테이션 아님) → 신규 부서 노출 안 됨.
- **수정:** 서버 `/board/today`를 **시나리오 카드 데일리 로테이션**으로 재구현(`TodaysScenarios`: ListBoardScenarios 조회→id→dept·difficulty→urgency·briefing→color, 날짜 시드 shuffle, 12건). 모바일 board.tsx 실구현(요약·부서 필터칩·카드→브리핑). PixelBox alignSelf 버그 픽스(전체폭 View). **신규 부서 노출 확인**(호스피스·암센터·NICU·라운지·여성소아외래·분만실 등).
- **콘텐츠 로드맵:** 시나리오는 핵심 학습 자산 → **≥300 시나리오 목표**를 상시 최우선 작업으로 계획 고정(현 86). 단계 A(폭 ~150)·B(깊이/난이도 ~300)·C(상시운영). 상세: `02-construction/scenario-runtime/content-roadmap.md`.
- **결정자:** 사용자("상황판 점검 + 시나리오 300개 목표를 계획에") + AI(점검·board 재구현·로드맵 문서화).

## 2026-07-20 · 콘텐츠 로드맵 단계 A 완료 — 신규 19부서 3→6 (총 143 시나리오)
- 신규 부서 각 3개씩 추가(19×3=57): 입원·교육·응급·상담·처치·인계 등 상황 유형 + 역할(환자·보호자·아동·동료·유족)·난이도·mood 다양화. 이제 각 신규 부서 6개. **총 143 시나리오·30 quizzes·11 events**(300 목표 대비 진행).
- 건물 이벤트 scenarios 목록 갱신(WOMEN/DX/ONCO 각 30, ADMIN 24) → 상황판 로테이션 풀 확대.
- 민감 도메인(사별·호흡곤란·불안발작·장기기증) 공감/안전 가드레일. 생성기 저작 → 로더 전체 검증 통과 → seed 143 → 시뮬레이터 렌더(호스피스 사별 지지) 확인.
- **결정자:** 사용자("단계 A 착수 — 신규 부서 3→6") + AI(배치 저작·이벤트 갱신·검증).

## 2026-07-20 · 단계 B 배치 B1 — WOMEN 건물 6→12 (총 173 시나리오)
- WOMEN 5부서(nursery·womenkids·ld·nicu·picu) 각 6개 추가(+30): 목욕/SIDS/모유저장/카시트, 발달지연/야뇨/비만/사춘기/ADHD/알레르기, 진통사정/양막파열/호흡코칭/산후우울/전자간증, 미숙아 감염/면회/강화/청력/ROP/추적, 소아 진정/인공호흡기/회진/놀이치료/형제지지 등. 난이도 티어(B1/B2/C1) 혼합.
- EVT-WOMEN-00001 scenarios 60개로 갱신. 로더·seed 173 통과. 단계 B는 건물별 배치(B1 WOMEN·B2 DX·B3 ONCO·B4 ADMIN·B5 코어)로 진행, 배치마다 커밋.
- **결정자:** 사용자("단계 B 착수, 작업마다 커밋") + AI(배치 저작·검증).

## 2026-07-20 — 단계 B 배치 B5 (코어 부서 확충)
- ER 8→15(+7)·OR 5→14(+9)·PEDS 5→14(+9). **총 257→282 시나리오**.
- 코어 이벤트 EVT-ER/OR/PEDS-00001 scenarios[] 갱신. 로더 검증·seed 통과.
- 다음: B6(ICU/PHARMA →14)로 **≥300 목표** 달성 예정.

## 2026-07-20 — 단계 B 배치 B6 (코어 완결 · **≥300 목표 달성 🎯**)
- ICU 5→14(+9)·PHARMA 5→14(+9). **총 282→300 시나리오**.
- EVT-ICU/PHARMA-00001 scenarios[] 갱신. 로더 검증·seed 통과(300 시나리오·30 퀴즈·11 이벤트).
- 단계 B(깊이·난이도) 완료. 전 부서 ~12~15개, 난이도 B1/B2/C1 티어·상황 유형 다양화 완료.
- 다음: 단계 C(상시 운영) — 데일리 로테이션 품질 관리, 계절/이벤트성, 핫스팟 추가 배선.

## 2026-07-20 — 단계 C: 인테리어 핫스팟 추가 배선
- 24개 부서 fixture에 시나리오 직결 대량 배선: **297/299 인테리어 직결(99%)**.
- 배선 우선순위: 미배선 hotspot(라벨 보존, kind→quest) → NPC 승격(marker:'quest'+markerLabel=시나리오 제목+scenarioId) → 오브젝트 props(furniture 한정).
- 중복 marker 키 버그 1건(pharma o-d-verify) 수정. 잔여 2건(PHARMA-00014 흡입기 교육·SPD-00012 재처리 실패 보고)은 의미 맞는 앵커가 없어 상황판 데일리 로테이션 전용으로 유지(품질 우선).
- 검증: tsc 0 · jest 208/208 · 시뮬레이터 onco 인테리어 다중 ! 마커 렌더 확인.

## 2026-07-20 — 단계 C: 상황판 데일리 로테이션 품질 개선
- **문제**(30일 시뮬레이션): 전역 셔플→상위 12 방식은 300 풀에서 한 부서 최대 3건 쏠림(7/30일), 일 평균 9부서만 노출, 부서 노출 편차 7~18/30.
- **개선**: 부서 층화 라운드로빈 — (1) 부서 내 대표 시나리오 날짜 셔플 (2) 부서 순서 날짜 셔플 (3) 부서별 1건씩 라운드로빈. 24부서>12슬롯이라 **매일 12칸=12개 서로 다른 부서 보장(쏠림 0/30)**, 장기 균형(노출 10~20/30).
- `ListBoardScenarios`에 `ORDER BY s.id` 추가 → 셔플 입력이 DB row order에 의존하던 비결정성 제거.
- 검증: go build/test 0 · 라이브 `/board/today` 12부서·최대 1건 · 시뮬레이터 상황판 다양 부서 렌더 확인.

## 2026-07-20 — 단계 C: 멀티 퀴즈 UI (시나리오 내 다중 퀴즈 순차 진행)
- **문제**: 기존 📝 버튼은 시나리오 steps 중 **첫 quiz 스텝만** 실행(`find`), 나머지 quiz 스텝 미노출.
- **개선**: 시나리오의 모든 quiz 스텝을 하나의 **순차 시퀀스**로 진행.
  - `dialogue/[id].tsx`: quiz 스텝 전체 수집 → 📝 버튼에 개수 배지(`📝 3`), `/quiz/{first}?scenario=&q={id들}&i=0`로 진입.
  - `quiz/[id].tsx`: `q`(콤마 큐)·`i`(인덱스) URL 파라미터로 무상태 시퀀스. `onComplete`: 다음 퀴즈로 `router.replace`, 마지막이면 결과 화면.
  - 진행 표시: `QuizShell`에 `progress?:{cur,total}` 추가 → 상단바 `📝 N/M` 민트 배지(14개 퀴즈 컴포넌트 일괄 + SentenceQuiz 자체 상단바).
- **콘텐츠**: 파일럿 SCN-ER-00002에 quiz 스텝 3개(QZ-ER-00001 문장완성 → 00002 짝맞추기 → 00003 오류찾기)로 데모.
- 검증: tsc 0 · jest 208/208 · 로더 0 · seed 300 · 시뮬레이터 대화(📝 3)→퀴즈 1/3(SentenceQuiz)→2/3(QuizShell/match) 렌더 확인.

## 2026-07-20 — 단계 C: 콘텐츠 다중 퀴즈 확대
- **문제**: 부서당 퀴즈 자산이 대부분 1개 → 멀티 퀴즈 UI를 살릴 콘텐츠 부족.
- **작업**: ER 제외 23개 부서에 각 **신규 퀴즈 2개**(match_pairs 도메인 어휘 + mcq 임상 판단) 저작 → **46개 신규 퀴즈**(총 30→76).
- **배선**: 각 부서 플래그십 `scn-<dept>-00001`에 **3-퀴즈 시퀀스**(기존 + 신규 2) 연결. or/peds/pharma(기존 퀴즈 스텝 없던 부서 포함) 모두 배선.
- 저작 품질: 부서 도메인별 실제 임상 용어(IPA 포함)·근거기반 정답. 예) ICU 인공호흡기 알람=환자 먼저 사정, 종양 호중구감소증=감염예방, 정신과=비위협적 de-escalation.
- 버그: 재작성 시 s2 `next: s3` 중복 20건 → 정리.
- 검증: 로더 0 · seed(300 시나리오·**76 퀴즈**·11 이벤트) · 시뮬레이터 GERI 시퀀스 2/3(match_pairs) 렌더 확인.

## 2026-07-20 — 단계 C: 비플래그십 시나리오 퀴즈 확대
- **문제**: 멀티 퀴즈가 부서 플래그십(00001)에만 배선 → 300 중 267개 시나리오 퀴즈 미보유.
- **작업**:
  - 부서 퀴즈 풀 확충: 23개 부서에 각 **+2 퀴즈**(check 안전점검 + sentence_build 표현) = **46 신규**(총 76→122).
  - 비플래그십 266개 시나리오에 부서 풀에서 **회전 2퀴즈 시퀀스** 배선(index 로테이션으로 반복 최소화). GEN 시나리오도 단일 퀴즈 배선.
- **결과**: **퀴즈 커버리지 300/300**, 멀티(2+) 시퀀스 290개, 총 **122 퀴즈**.
- 저작 품질: 부서별 근거기반 정답(예: 정신과 위기=위험사정·위험물제거·차분한지지 / 논쟁·대립 오답). sentence_build는 임상 표현 빈칸.
- 검증: 로더 0 · seed(300·122·11) · 시뮬레이터 비플래그십 SCN-PSYCH-00003 check 1/2 렌더 확인.

## 2026-07-20 — 단계 C: 인테리어 핫스팟 배선 감사 + 완결
- **감사**: 24개 부서 fixture의 scenarioId 배선 점검 → **중복 0 · 무효(존재하지 않는 id) 0**. 부서별 1:1 커버리지 확인.
- **잔여 갭 완결**: pharma 13/14·spd 11/12(앞서 적합 앵커 부족으로 상황판 전용) → 전용 quest hotspot 신규 추가(hs-inhaler=SCN-PHARMA-00014·hs-qcfail=SCN-SPD-00012). **전 부서 인테리어 커버리지 100%**.
- **검증**: tsc 0 · jest green · 시뮬레이터 pharma 인테리어 신규 hotspot이 보행 가능 바닥에 렌더, A 버튼(시나리오 라벨) 상호작용으로 hotspot→시나리오 진입 확인.
- 결과: 모든 dept 시나리오가 인테리어 진입점에서 직접 도달 가능. 상황판(층화 로테이션)과 함께 이중 노출.

## 2026-07-20 — 단계 C: 결과/리워드 화면 고도화 (실 진척 시스템 연결)
- **기존**: 결과 화면이 정적 — 브리핑 고정 리워드만 표시, 적립·성장·공유 없음.
- **고도화**: 백엔드 진척 시스템(`POST /attempts`·`GET /me/progress`, 이미 구현됨: XP·레벨·스트릭, level=1+xp/100)에 연결.
  - 모바일 client: `Progress` 타입 + `progress()`·`recordAttempt(scenarioId, score)` 추가.
  - 결과 화면: 마운트 시 before 조회 → attempt 기록(score=브리핑 base XP 파싱) → after. **XP 카운트업**(before→after)·**레벨 진행바**(xp%100)·**레벨업 배너**(level↑ 시 컨페티 2배)·**스트릭 🔥**·정직한 실값 표시.
  - 공유 버튼 실동작(RN Share), 미인증/오프라인 시 브리핑 리워드 정적 폴백.
- 저작 원칙: 가짜 별점 대신 **실제 적립된 성장**만 표시(정직성). score는 시나리오 난이도 기반 base XP(120+diff*40).
- 검증: tsc 0 · jest 208/208 · 라이브 /attempts·/me/progress(xp 0→160→220, 레벨 1→2→3) · 시뮬레이터 결과 화면(레벨업 Lv.3→5·+240XP·460XP 바 60%·스트릭) 렌더 확인.

## 2026-07-20 — 단계 C: 프로필/진척 탭(나) + 결과 클릭 폭죽
- **결과 폭죽**: 핸드오프 ConfettiBurst 1:1 — 배경 탭/초기(스티커 중심)에 방사형 포물선 입자 48개 + 플래시. RN Animated로 Lagrange 샘플 포물선 재현(위→아치→낙하), 각 버스트 4.6초 후 소멸.
- **나 탭**: 스텁 → 실 진척(`GET /me/progress`·`/me`) 연동 프로필. ID카드(랭크·레벨·XP바·EN레벨칩), 평판 3종(환자만족/동료신뢰/응급대응), 나의 성장 요약, CAREER PATH 스테퍼(레벨 기반 Learner→Junior→Senior→Head), 커리어 뱃지(레벨/스트릭 마일스톤 연동, N/8), 리뷰랩 티저(→리뷰 탭). `useFocusEffect`로 복귀 시 갱신.
- 저작 원칙: 랭크/뱃지 등 서버 미갱신 값은 레벨·스트릭에서 정직하게 파생.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터 결과 폭죽 렌더 + 나 탭(Junior Nurse Lv.9·820/900·평판·뱃지 3/8) 실데이터 확인.

## 2026-07-20 — 단계 C: 리뷰랩 탭 + dev 인증 복원력
- **리뷰랩 탭(lab)**: 스텁 → SM-2 오답노트. `GET /me/review`로 오늘 due 카드, 각 카드는 AI 교정(front=원문 취소선 / back=교정 강조 / note=왜?). 자가평가 다시·어려움·알맞음·쉬움 → `POST /me/review/{id}/grade`(SM-2 스케줄 갱신, 채점 카드는 오늘 큐에서 제외). 🔊 교정문 TTS(expo-speech), 숙련 pips, 오늘의 복습 히어로 + 미니스탯(대기/숙련/즐겨찾기). `useFocusEffect` 갱신. client: `reviewDue()`·`gradeReview()`·`ReviewCard` 추가.
- **dev 인증 복원력(반복 'api 에러' 근본 해결)**: 액세스 토큰 만료 시 인터셉터 rotate가 refresh 실패/토큰 부재여도 **__DEV__에서 `/auth/dev` 자동 재로그인**으로 세션 복구(로그아웃 대신). 딥링크 네비게이션 중 세션 소실로 화면이 에러로 굳던 문제 해소.
- 검증: tsc 0 · jest 208/208 · 라이브(/me/review 4건·grade good→pips 1·due 3) · 시뮬레이터 리뷰랩 3카드·평가·TTS·미니스탯 렌더 확인.

## 2026-07-21 — 화면별 핸드오프 정합성 리뷰 & 수정 (7개 프로덕트 화면)
7개 화면(브리핑·대화·결과·상황판·프로필·리뷰랩·퀴즈)을 병렬 서브에이전트로 v17 핸드오프 대비 비판적 리뷰 → 실 정합성 갭만 선별 수정.
**공통**: `PixelButton`에 fontSize/borderWidth/padding 오버라이드 추가(핸드오프 버튼 11/12/2px 대응).
**결과**: 타이틀 32→34·스티커 112→130·풋터 라벨(리뷰랩에 저장/다음 시나리오 ▶)·위로 문구·컨페티 파랑(#60A5FA→colors.blue)·샘플 8→24·topbar 버튼 컴팩트·리뷰랩 버튼 그림자 ink33.
**상황판**: 요약 4카운터 타일(URGENT/QUEST/완료/남은)·긴급 스킴(카드 틴트+accent+전 카드 URGENT/QUEST/INFO 라벨, info=회색)·필터칩 영문 부서코드+부서색 active+카운트 배지·빈상태 2줄+아이콘+대시박스·배경 cream.
**프로필**: **XP바 라벨/게이지 수치 불일치 버그 수정**(총xp/level*100 → within-level inLevel/100)·성장리포트 라벨+▶·뱃지 /24 분모+special+NEW+earned 흰타일·Head Nurse·스테퍼(✓/숫자+● HERE)·리뷰티저 lilac+교정 예시박스+버튼 primitive.
**리뷰랩**: 히어로 lilac(핑크였음)+복습시작 CTA+📓 코너+강조칩·필터탭(topicTag 파생)·미니스탯 라벨/좌측 액센트·카드 헤더 per-topic tone+태그칩·good-line 민트 하이라이트.
**브리핑**: 지금진행 +XP 배지·버튼 폰트(닫기11/나중에12)·난이도 pip 9→11.
**대화**: SPEAK FREELY 라벨+프롬프트·힌트 헤더 문구(N가지 추천 답변)·힌트모드 입력 숨김·rail 버튼 컴팩트·힌트 ● active 배지·🎤 mintShadow.
**퀴즈**: QuizShell 카드 헤더 zone 칩·Monitor/Calc 섹션 헤더 흰색→textSoft(가독성 버그)·Match 다시 버튼+안내문·Monitor 처음부터 버튼.
**의도적 보류(수정 안 함)**: 마이크 직접말하기(Azure 키 대기)·⏸→📝 퀴즈 버튼·Triage/CalcQuiz/Listen파형 재설계·타이머(무시간제)·대화 퀵툴 독/번역글로스/위험선택지(데이터·기능 대기)·상황판 부서 섹션 그룹화(우리 로테이션은 부서당 1건이라 단일카드 섹션 난립 → flat 유지).
검증: tsc 0 · jest 208/208 · 시뮬레이터 7화면 렌더 확인.

## 2026-07-21 — TriageQuiz·CalcQuiz·Listen 핸드오프 완전 구현 (재설계 → 1:1+)
이전에 '재설계라 보류'했던 3개 퀴즈 타입을 핸드오프대로(또는 그 이상 인터랙티브로) 구현.
- **서버**: `QuizContent`에 신규 필드/구조체 추가 — triage(patient{age,sex,arrival,cc,vitals[],obs[]}·correctLevel·reasoning[kind,text]), calc(order·vial·desired·onHand·perQty·dhqUnit·syringeMax·secondCheck), listen(duration·glossary[abbr,meaning]). **struct 변경 → API 재빌드·재시작 필수.**
- **콘텐츠**: QZ-ICU-00002(ESI 흉통 STEMI, LV2)·QZ-PHARMA-00003(Heparin D/H×Q=0.5mL)·QZ-PHARMA-00001(morphine verbal order + 파형/자막/용어집) 저작.
- **TriageQuiz**: PATIENT CASE 카드(초상·CC 하이라이트·활력 4그리드 warn·관찰 태그) + ESI 5단계 컬러 행 선택 + 확정 → 정오답 + WHY LVn? 근거 패널. 레거시 우선순위정렬은 fallback 유지.
- **CalcQuiz**: ORDER 카드 + ON HAND 바이알(SVG 픽셀아트) + D/H×Q FORMULA 워크시트(제출 시 대입행 공개) + 주사기 눈금 SVG + 5R 안전점검 + 키패드. 단순 given/eq(체중기반)는 fallback.
- **ListenQuiz**: 다크 오디오 카드(SVG 스피커 + 50-bar 파형 played/unplayed+플레이헤드) + 시간 라벨 + 0.7×/1.0× 속도(TTS rate) + 📝 자막 토글 + 약어 용어집 + 복창(Read back).
- react-native-svg로 바이알/스피커/파형 픽셀아트 구현.
- 검증: tsc 0 · jest 208/208 · 로더 0 · seed(122 퀴즈) · API 새 필드 왕복 · 시뮬레이터 3화면 렌더 확인.

## 2026-07-21 — 대화 화면 보류 항목 핸드오프 구현 (+ 앱-적합 gap 채움)
이전에 '데이터/기능 대기'로 보류했던 대화 화면 항목들을 핸드오프대로 구현.
- **서버**: `Briefing`에 `chart`(ScenarioChart: vitals/meds/allergies/notes)·`riskyPhrases[]` 추가(jsonb, 마이그레이션 불필요). SCN-ER-00002에 실 차트(활력·투약·알레르기)+riskyPhrase 저작, keyPhrases에 위험 선택지 1개 추가.
- **QUICK INFO 독**: 📋 차트/💊 약물/🩺 활력 3버튼 → 스크림+모달 패널. 차트(환자·역할·호소·알레르기·메모)·약물(chart.meds)·활력(chart.vitals 그리드). chart 없는 시나리오는 '직접 사정하세요' 등 앱-적합 fallback(임상값 날조 안 함).
- **번역 칩**: NPC 말풍선에 'tap to 번역' → 스크립트 오프닝 대사의 한국어(step lineKo) 토글. AI 스트리밍 응답엔 Ko 없어 칩 미표시(정직).
- **위험 선택지 변형**: 힌트모드 ChoiceRow에 red 변형(⚠ 평판 −2 위험) 추가, briefing.riskyPhrases로 태깅.
- **MISSION 1/N 카운터**·**💧 distress cue**(mood pain/panic/worried)·**▼ next-turn cue**·**스피커탭 위쪽 그림자**·**힌트 ● active 배지**·오프닝 대사=첫 dialogue 스텝(태그라인 아님).
- 보류 유지: 마이크 STT(Azure 키 대기).
- 검증: tsc 0 · jest 208/208 · 로더 0 · seed(300·122·11) · 새 필드 왕복 · 시뮬레이터 기본뷰+QUICK INFO 활력 패널+힌트 위험선택지 렌더 확인.

## 2026-07-21 — 상황판 핸드오프 재구축 (리치 카드·부서 섹션·요약 고정)
사용자 피드백: 상황판이 핸드오프와 많이 다름 + 스크롤 시 요약 상단 고정 요청.
- **요약 고정(sticky)**: 제목+날짜(TODAY·날짜/요일)+요약카드(📋·현장 상황 N건)+4카운터(URGENT/QUEST/완료/남은)+필터탭을 ScrollView **밖** 고정 헤더로 분리 → 섹션만 스크롤.
- **부서 섹션 그룹핑**: 부서별 섹션(컬러 아이콘 박스 + '응급실 ER' 한글ENG명 + N건), 정규 부서 순서.
- **리치 EventCard**: urgency 태그(URGENT/QUEST/INFO)+틴트 · room · 난이도 미터(3칸) · 제목 · 👤 NPC·sub · 태그라인 박스 · 스킬칩 2개+N · ⏱ 시간 · 📍위치보기/▶진행하기 액션레일.
- **board API 확장**: `BoardCard`에 difficulty·room·npcName·npcSub·skills·timeLabel 추가; `ListBoardScenarios`가 s.persona도 SELECT; `TodaysScenarios`가 briefing/persona에서 리치 필드 채움. (struct/쿼리 변경 → API 재빌드·재시작)
- 필터탭: 영문 부서코드+부서색 active+카운트, 부서 섹션·빈상태·데일리 로테이션 설명 유지.
- 검증: tsc 0 · jest 208/208 · seed(300·122·11) · /board/today 리치필드 왕복 · 시뮬레이터 렌더 확인(전체 앱 재기동 후 stale 번들 해소).
- 참고: 재리뷰 서브에이전트 3개는 API 529로 실패 → 추후 재시도 예정.

## 2026-07-21 — 전체 화면 재리뷰(2차) 후 폴리시 일괄 수정
7화면 재리뷰(병렬 서브에이전트) → HIGH 없음, 남은 MED/LOW 폴리시 반영:
- **상황판**: 새로고침/⏱시간 박스·≡ 메뉴·urgency 태그+액션레일 그림자·📋28/TODAY10/현장상황16/패딩14·부서헤더아이콘16·DeptTab아이콘13.
- **프로필**: ID카드 헤더 밴드 인셋 바 → **상단 edge flush 밴드(bottom-border만)** + 펀치홀 노치.
- **결과**: 콘텐츠 상단 패딩 92→80.
- **대화**: ▼ next-cue 그림자·힌트 active 배지 원형→14×14 사각+노랑 ●·위험 선택지 톤다운(핸드오프대로 tab #FCA5A5·ink보더·offset2)·레일 버튼 border2/offset2·상태바 center 정렬·플레이어 opacity 0.85.
- **리뷰랩**: 필터 active 탭 부서색+카운트 배지 색·MiniStat 중앙정렬.
- **퀴즈**: Calc Fraction 'units' 라벨·바이알 4번째 눈금·주사기 팁/바늘 · Listen 선택칩 '?' 코너배지 · Triage 😰 → 픽셀 환자얼굴 SVG(PatientHeadPixel).
- 검증: tsc 0 · jest 208/208 · 시뮬레이터 board/me/triage 렌더 확인.

## 2026-07-21 — 발음 채점(Azure Speech) 라이브 활성화
- 외부 블로커 해소: 유효한 Azure AI Speech 리소스 키(리전 **eastus**)를 `server/.env`(gitignore, 미커밋)에 설정.
- 키 유효성: `eastus …/issueToken` 200.
- **E2E 검증(라이브)**: macOS TTS로 16kHz mono WAV 생성 → dev 토큰으로 `POST /pronunciation` → Azure 발음평가 실점수 왕복 성공(recognized + accuracy 84·fluency 93·completeness 100·overall 89·단어별 점수).
- 모바일 녹음 포맷(PronunciationPractice: 16kHz·mono·LINEARPCM WAV)이 어댑터/Azure 요구와 일치 확인 → 앱 녹음→채점 경로 준비 완료.
- 이전 koreacentral 키(401)는 비활성 구독 소속으로 폐기, eastus 신규 리소스로 대체.
- 남은 선택: 대화 자유입력의 마이크 STT(받아쓰기)는 별도 기능으로 추후.

## 2026-07-21 — 마이크 STT 받아쓰기 배선 (대화 자유입력)
- **서버**: azurespeech 어댑터에 `Transcribe(audioWav, locale)` 추가(동일 인식 엔드포인트, Pronunciation 헤더 제외 → DisplayText 반환). `PronunciationPort`에 Transcribe 추가, pronunciation 서비스에 `Transcribe(userID, audio)`(프로필 target locale), `POST /stt` 핸들러/라우트.
- **모바일**: client `transcribe(audioBase64)→text`. 대화 SPEAK FREELY 입력의 🎤 박스를 Pressable로 — 탭 녹음(16kHz mono WAV)→탭 중지→`/stt`→받아쓴 텍스트를 draft에 채움. 상태(idle/recording/transcribing) + 라벨/플레이스홀더/버튼 색 반영.
- **E2E**: `POST /stt`(dev 토큰 + 16kHz WAV) → Azure STT 텍스트 왕복 확인. 모바일 녹음 포맷 일치. (시뮬레이터는 마이크 없어 실 녹음 육안검증 불가 — 실기기 필요.)
- 검증: go build 0 · tsc 0 · jest 208/208 · 대화 화면 렌더 확인.
- 이로써 대화 화면의 마지막 보류 항목(마이크 STT)까지 완료.

## 2026-07-22 — 문장완성(sentence_build) 퀴즈 버그 수정
- **버그**: 워드 카드 탭 시 다른 단어가 채워짐. 원인 — 타일이 셔플된 `tiles` 배열 위치가 아니라 원본 wordBank 인덱스(`tile.i`)를 전달 → 슬롯 표시 `tiles[원본인덱스]`가 엇갈림. 수정: 셔플 배열 위치 `ti`로 일관되게 전달/저장/조회(탭한 카드가 정확히 채워짐).
- **카드는 버튼 아님**: WordTile/Slot은 `Pressable`+`View`(카드 스타일) 유지 — PixelButton 미사용 확인.
- **'다시 풀기' 줄바꿈**: 좁은 flex1에서 '기'가 다음 줄로 내려가 버튼이 커지던 문제 → 다시 풀기를 넓은 flex2 슬롯으로 이동. 추가로 `PixelButton` 라벨에 `numberOfLines={1}` 적용(버튼 라벨 줄바꿈 전역 방지).
- 검증: tsc 0 · jest 208/208 · 시뮬레이터 렌더 확인.

## 2026-07-22 — 대화 시스템 프롬프트 강화 (코칭/교정 드리프트 차단)
- **증상(사용자 보고)**: 답변하면 NPC 응답 대신 '내 답변을 구체화한 내용'이 대화창에 뜸.
- **조사**: 서버 /message·/stream·엔진·strategy·openai 어댑터·모바일 SSE 파서 모두 정상. 어색한 입력 포함 전부 정상 페르소나 응답 확인(재현 안 됨). 앱은 localhost:8080만 호출, 대화에서 교정 엔드포인트 미사용.
- **근본 원인 추정**: 기존 프롬프트가 'Learner's goals (help them practice these)'만 명시 → 특정 시나리오/비결정성에서 모델이 캐릭터 응답 대신 학습자 문장을 코칭/재진술하는 드리프트 가능.
- **수정(예방적·강건)**: buildSystemPrompt에 (1) 사용자=학습자({job}) 역할·턴 구조 명시, (2) 절대 규칙(학습자 말 교정/재진술/번역/반복 금지, 코칭/피드백/시범 금지, 학습자 대신 발화 금지, 캐릭터 이탈·메타 금지), (3) goals는 '학습자가 연습하려는 것 — 자연스럽게 응답하되 가르치지 말 것'으로 재구성.
- 검증: go build 0 · 어색한 입력 3종 재검증 → 모두 정상 캐릭터 응답.

## 2026-07-22 — 퀴즈=곁가지 / 상황 해결=메인, 리뷰랩 자동 등록
사용자 피드백: (1) 퀴즈만 풀어도 상황이 끝남(퀴즈는 곁가지, 메인은 대화로 상황 해결), (2) 리뷰랩 등록이 안 됨.
- **퀴즈 흐름 변경**: 퀴즈 시퀀스 완료 시 `/result`로 가던 것을 **대화로 복귀(router.back)** 로 변경. 퀴즈는 이제 상황을 끝내지 않는 보조 활동.
- **상황 종료 = 대화**: 대화 화면 상단 미션 아래 **"✓ 상황 종료"** 버튼 추가 → `/result/{id}`(XP 적립). 상황 해결(대화)이 메인 완료 경로.
- **리뷰랩 자동 등록**: 대화 턴마다(≥3단어) 서버가 백그라운드로 `Correct` 실행 → 원문과 **실제로 다를 때만** 리뷰 카드 생성(`changed()` 정규화 비교). fire-and-forget이라 응답 지연 없음. 결과의 버튼은 '📓 오답노트 보기'로 이동만(카드는 대화 중 이미 등록).
- 검증: go build 0 · tsc 0 · jest 208/208 · E2E(어색한 문장 전송 → 리뷰 카드 0→1 생성: "I want ask...since one hour" → "I want to ask...for the past hour.") · 시뮬레이터 상황 종료 버튼 렌더.

## 2026-07-22 — 리뷰랩 '오늘의 복습 시작' 세션 구현
- 기존: 버튼이 임시 no-op(첫 카드 TTS만). 미구현이었음.
- 신규 `app/review.tsx`(`/review`): due 카드를 한 장씩 넘기는 집중 플래시카드 세션.
  - 회상: '이렇게 말했어요' + 원문(취소선) + 회상 프롬프트 → 👀 정답 보기.
  - 공개: '현지인처럼 말하기'(민트 하이라이트 교정) + 🔊 TTS + 왜? 설명 → 자가평가 다시/어려움/알맞음/쉬움 → `POST /me/review/{id}/grade`(SM-2) → 다음 카드.
  - 상단 📓 N/M 진행, 완료 시 '오늘의 복습 완료! N개' 요약 → 리뷰랩 복귀. 빈/에러 상태 처리.
- 리뷰랩 '오늘의 복습 시작' 버튼 → `router.push('/review')`.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터 회상/공개 상태 렌더 확인(7카드).

## 2026-07-22 — 리뷰랩 고도화: 교정 카드에 맥락 저장·표시 + SM-2 등급 동작
사용자 요구: (1) "어떤 맥락/상황에서, 어떤 대화 중에 저 말을 했는지"를 교정 노트에서 보고 싶다, (2) 다시/어려움/쉬움 버튼이 무슨 동작인지.
- **맥락 스키마**: `progress.ReviewContext{Title,Dept,Situation,Npc}` + `ReviewCard.ScenarioID/Context`. 마이그레이션 000011 — `review_cards`에 `scenario_id text`, `context jsonb` 컬럼 추가. sqlc(InsertReviewCard·DueCards Row/Scan), progress_repo(마샬/언마샬), ports.NewReviewCard 확장.
- **캡처 지점**: 대화 엔진 `prepare`가 시나리오와 **직전 NPC 대사(priorNpc)** 를 함께 반환 → `fileCorrection`이 ReviewContext 구성(Title=시나리오 제목, Dept=Briefing.Dept, Situation=Briefing.Brief∥Tagline, Npc=직전 상대 대사) → `Correct`가 CreateCard에 전달. 수동 `/correct` 엔드포인트는 빈 맥락으로 호출.
- **모바일 표시**: `review.tsx`에 라일락 맥락 카드(🗺 이때의 상황 + Dept 뱃지 + 제목 + 상황, 그리고 "상대가 이렇게 말했고 🗣 {npc} → 여기에 답하며 한 말"), `lab.tsx` PhraseCard에 접이식 '🗺 맥락'(제목 미리보기 → 펼치면 상황+직전 대사).
- **SM-2 등급 동작(사용자 설명용)**: q값 다시=1/어려움=3/알맞음=4/쉬움=5. reps 0→1일, 1→6일, 이후 ×ease로 다음 복습 간격 결정. 어려움은 ease 감소·간격 짧게, 쉬움은 ease 증가·간격 길게, 다시는 리셋. 숙련 pip=min(reps,3).
- 검증: go build/test 0 · tsc 0 · jest 208/208 · E2E(대화 2턴 → 카드 context에 title/dept/situation + 2번째 카드에 npc="It's my chest... right in the middle. Hurts a lot." 저장 확인) · 시뮬레이터 맥락 카드 렌더 확인(ER·TRAUMA BAY #4 / 통증 사정 — Mrs. Hopkins).

## 2026-07-22 — 복습 등급 피드백 + 리뷰랩 등급 안내
사용자 피드백: 다시/어려움 등을 누르면 아무 안내 없이 카드가 사라져 "왜 이러지?" 싶다. 관련 안내 + 별도 조회처가 필요.
- **등급 확인 토스트**: 복습 세션·리뷰랩 모두 등급 탭 시 화면 하단에 `[등급] 📅 다음 복습 시점 + 한 줄 설명` 배너를 잠깐 표시 후 다음 카드로. `gradeReview`가 서버 응답의 `schedule.intervalDays`를 반환하도록 확장, `nextLabel()`로 "내일 다시/6일 후/약 N주 후/약 N개월 후"로 사람이 읽기 쉽게 변환.
- **리뷰랩 등급 안내(조회처)**: 리뷰랩 상단에 접이식 "❓ 복습 등급이 뭔가요?" 카드 — 4등급(다시/어려움/알맞음/쉬움) 각각 색 뱃지+의미, 숙련 pip(3칸=마스터) 설명. SM-2 개념(잘 외울수록 뜸하게)을 사용자 언어로.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터(가이드 펼침·토스트 렌더 확인).

## 2026-07-22 — 프로필('나') 탭 핸드오프 정합: 초상화 통일 + 음영 버그 수정
사용자 지적: (1) 프로필 사진을 대화 초상화와 일치, (2) 초상화 액자 아래 음영이 과도, (3) 핸드오프와의 정합성.
- **음영 버그 원인/수정**: ID 카드 상단은 `flexDirection:row`(기본 `alignItems:stretch`). 아바타의 `Shadowed` 래퍼가 row 높이(카드 콘텐츠 전체)만큼 세로로 늘어나 그림자 박스가 거대해짐. → 아바타 Shadowed에 `alignSelf:'flex-start'` 부여해 콘텐츠 크기(80×96)로 고정, 핸드오프의 `boxShadow: 3px`와 동일한 작은 드롭섀도로 복원.
- **초상화 통일**: 이모지 👩‍⚕️ → 대화 플레이어와 동일한 픽셀 얼굴 `FacePlayer`(=RoleFace nurse). 프레임을 대화 PortraitFrame과 같은 방식(`overflow:hidden` + `justifyContent:flex-end` + 반투명 오버레이, 얼굴 size 86으로 프레임보다 크게 넣어 클리핑)으로 렌더. 핸드오프 원본도 이 자리에 DerpPlayer 픽셀 캐릭터를 사용.
- **뱃지 정합**: 타일 `aspectRatio 0.85 → 1`(핸드오프 정사각 그리드와 일치).
- **정합성 메모(정직 고지)**: '오늘의 성장 리포트' 카드는 핸드오프 ScreenProfile엔 없는 추가 요소(성장 시스템 연동). 뱃지 라벨은 레벨/연속 기반 실동작 값(핸드오프의 테마 라벨과 다름). 나머지(ID카드·평판·CAREER PATH·리뷰랩 티저)는 1:1.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터 렌더(초상화·그림자·정사각 뱃지) 확인.

## 2026-07-22 — 성장 리포트 화면(/growth) 구현
사용자 지적: '나' 탭의 '오늘의 성장 리포트' 카드가 아무 동작을 안 함. → 핸드오프 ScreenGrowth를 상세 화면으로 연결.
- **신규 `app/growth.tsx`(`/growth`)**: 핸드오프 ScreenGrowth 1:1 레이아웃 — 상단 `TODAY · M월 D일`+요일, 히어로 성장 카드(연속/최장/누적 XP, ✨), 이번 주 출석 스트립, 2×2 스탯 그리드, 평판 스냅샷, '오늘의 근무 시작하기' CTA. '나' 탭 성장 카드 `onPress → router.push('/growth')`.
- **실데이터 배선(GET /me/progress + /me/review)**: 레벨/누적 XP/연속·최장/평판(환자·동료·응급)/복습 카드 수는 실제 값. 출석 스트립은 서버에 일별 로그가 없어 `streakCurrent`로 이번 주(월~오늘) 역산해 표시(연속 출석의 정직한 시각화).
- **핸드오프 대비 축소**: 서버 데이터 소스가 아직 없는 '시나리오 완료 수/대화 시간/칭찬 스티커 보드'는 이번 판에서 제외하고, 스탯 타일을 실측 지표(레벨·누적 XP·환자 만족·복습 카드)로 대체. 추후 시나리오 완료/대화시간 집계 엔드포인트 추가 시 확장 여지 남김.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터(7/22 수요일, 연속 2일 → 화·수 체크, 스탯 실값) 확인.

## 2026-07-22 — 성장 리포트 집계 엔드포인트 GET /me/stats
성장 리포트를 완전 실데이터로: 출석/시나리오/대화시간을 서버에서 집계.
- **신규 `GET /me/stats`** → `progress.GrowthStats{scenariosToday/Week, newCardsToday/Week, conversationSecondsToday/Week, activeDates[]}`.
- **집계 소스(read-only, pool 직접 쿼리)**:
  - 시나리오 완료: `scenario_attempts` state='cleared' COALESCE(cleared_at,started_at) ≥ 기준.
  - 새 표현: `review_cards.created_at` ≥ 기준.
  - 대화 시간: 세션별 (MAX-MIN dialogue_turns.created_at) 합(활성 대화 시간 근사).
  - 출석 activeDates: `scenario_attempts` ∪ `dialogue_turns` DISTINCT 날짜(UTC), 이번 주.
- **기간 계산**: 핸들러가 UTC 기준 dayStart(자정)·weekStart(월요일)를 계산해 repo에 전달.
- **모바일 배선**: `/growth`가 `api.growthStats()` 사용 — 출석 스트립을 streak 추정 → 실제 activeDates 매칭으로 교체(주 그리드·today 모두 UTC로 서버와 일치), 스탯 타일을 시나리오/새 표현/대화 시간/레벨 실값으로. `ScenariosToday`/`NewCardsToday`/`conversationSecondsToday`도 응답에 포함(향후 '오늘' 뷰용).
- **TZ 메모**: 버킷팅은 UTC 기준(단일 사용자 MVP). 사용자별 타임존 버킷은 후속.
- 검증: go build/test 0 · tsc 0 · jest 208/208 · E2E(/me/stats: scenariosWeek 8·newCardsWeek 14·convWeek 144s·activeDates[07-20,07-21]) · 시뮬레이터(출석 월·화 체크/수 today, 스탯 실값).

## 2026-07-22 — 성장 리포트 타임존: 기기 TZ → 서버 버킷팅
이전엔 UTC 고정 버킷팅이라 KST 자정~오전9시 구간에서 '오늘/이번 주'가 하루 어긋남. 프로필 저장 대신 **기기 타임존을 클라가 감지해 서버에 전달**하는 방식 채택(출장/이동에도 항상 정확, 집계는 서버 SQL 유지 — 순수 클라 집계는 원시 행 전송이 필요해 배제).
- **서버**: `GET /me/stats?tz=<IANA>` — 핸들러가 `time.LoadLocation(tz)`(없거나 불명 → UTC 폴백)로 dayStart(자정)·weekStart(월요일)를 해당 존에서 계산. activeDates는 `(ts AT TIME ZONE $tz)::date`로 버킷팅. `ProgressRepo.GrowthStats(..., tzName string)`로 시그니처 확장.
- **클라**: `Intl.DateTimeFormat().resolvedOptions().timeZone`로 기기 존 감지해 쿼리 전달(감지 실패 시 생략→UTC). `/growth` 주 그리드/헤더/today를 로컬 시간 기준으로 계산(getDay/getDate)해 서버 로컬-버킷 activeDates와 매칭.
- 검증: go build 0 · tsc 0 · jest 208/208 · E2E(UTC=[07-20,21] vs Asia/Seoul=[07-20,21,22] vs America/New_York=[07-20,21] vs bad→UTC 폴백) · 시뮬레이터(기기 KST → 출석 월·화·수 3/7, 수=today).

## 2026-07-29 — 성장 리포트 하단: 평판 스냅샷 → 칭찬 스티커 보드
결정(사용자): (1) 평판(환자 만족/동료 신뢰/응급 대응)은 MY CARD ID 카드에 이미 있어 중복 → 성장 리포트에서 제거. (2) 커리어 뱃지(나 탭)와 역할을 구분해 칭찬 스티커 보드 채택 — 뱃지=마일스톤/정체성, 스티커=활동 누적/온기. 핸드오프 ScreenGrowth 원안이 스티커 보드였음.
- **획득 규칙**: 시나리오 클리어 1회 = 스티커 1장(누적), 100장마다 '자격증' 해금 콘셉트.
- **서버**: `GrowthStats.ScenariosTotal`(lifetime cleared, 날짜필터 없음) 추가 → `GET /me/stats`. E2E: scenariosTotal=9.
- **모바일**: `/growth`에서 RepRow/평판 블록 삭제, `StickerBoard`(핸드오프 1:1 — 룰드 페이퍼, 회전 색스티커/점선 빈칸, "빈 칸이 채워질 때마다…" 캡션) 추가. earned=scenariosTotal. 퍼센트+aspectRatio가 wrap 행에서 빈칸을 붕괴시켜 Dimensions 기반 고정 TILE 크기로 렌더.
- 임시 비교 화면 `growth-compare.tsx` 삭제(결정 완료).
- 검증: go build 0 · tsc 0 · jest 208/208 · 시뮬레이터(9/100, 스티커 9장 렌더).

## 2026-07-29 — 뱃지·스티커 탭 상세(InfoSheet)
사용자 지적: 뱃지/칭찬 스티커가 이모지뿐이라 무엇인지 알기 어려움 → 탭하면 상세 표시.
- **공용 `InfoSheet`**(components): 하단 모달 — 큰 아이콘 + 제목 + 상태칩(획득/잠김) + "무엇인가요?/어떻게 얻나요?" + 닫기. 오버레이 탭/닫기로 해제, 내부 탭은 전파 차단.
- **커리어 뱃지(me.tsx)**: 8종에 name/what/how 부여(간호사 캡·청진기·주사기·3일/7일 연속·병동 트로피·왕관·숨겨진 뱃지). 잠긴 뱃지는 제목 '???'·조건만 노출. 타일 Pressable → 시트.
- **칭찬 스티커(growth.tsx)**: 각 스티커 탭 → "칭찬 스티커 #N"·획득·획득 방법(시나리오 클리어당 1장, 100장=자격증). 빈 칸 탭 → 잠김 안내.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터(스티커 시트·뱃지 시트 각각 렌더 확인).

## 2026-07-29 — 평판 → NPC 반응 가중 (2-7)
평판(환자 만족/동료 신뢰)이 그동안 표시만 되고 대화 경험에 미반영이었음 → 대화 시점 평판을 NPC 기본 태도로 반영.
- **포트**: 좁은 `ports.ProgressReader{GetProgress}` 추가. 대화 엔진에 주입(기존 progressRepo가 ReviewRepo+ProgressReader 겸함 → main.go에서 같은 객체 재전달).
- **로직**: `Engine.reputationDisposition(ctx,uid,sc)` — persona.Role로 차원 선택(doctor/nurse/colleague/… → 동료 신뢰, 그 외(환자·보호자) → 환자 만족), 점수 밴드(≥75 우호·≥50 중립·≥25 경계·<25 불신)로 영어 1줄 태도 지시문 생성. `buildSystemPrompt`에 `disposition` 인자 추가 → "Baseline disposition (reputation): …"로 주입. **톤만 조절**, 임상 사실·"캐릭터 유지/코칭 금지" 규칙 불변.
- **검증**: go build/test(신규 TestBuildSystemPromptInjectsDisposition 포함) 0 · E2E(동일 학습자 문장에 대해 patient_satisfaction=8 → "(sighs)…경계·최소정보" vs 95 → "Oh, nurse…따뜻·적극")로 톤 차이 확인, 50 복원.
- 모바일 변경 없음(서버 프롬프트 셰이핑).

## 2026-07-29 — 클리어 리워드 연출 보강 (2-6)
기존 result 화면(컨페티 ConfettiBurst·XP 카운트업·레벨바·레벨업 배너·연속 학습)에 최근 스티커/뱃지 시스템을 연결.
- **뱃지 카탈로그 공용화**: me.tsx 인라인 뱃지 정의를 `src/data/badges.ts`로 추출(`BADGES`·`earnedBadges`·`newlyEarned`). me.tsx는 `earnedBadges(progress)` 사용 → 두 화면 정의 분기 방지.
- **칭찬 스티커 +1 리워드 행**: XP 아래 "🎖 칭찬 스티커 (누적 N장) +1" 표시. N은 `api.growthStats().scenariosTotal`(이 클리어 반영본).
- **새 뱃지 획득 배너**: `newlyEarned(before, after)`로 이번 클리어에 임계 넘긴 뱃지 감지 → 레벨업 배너 아래 민트/옐로 배너(아이콘+이름). 없으면 미표시.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터(레벨업 Lv.16→17, 스티커 누적 10→11장 +1, 새 뱃지 '병동 트로피' 배너 렌더 확인).

## 2026-07-29 — 온보딩 전체 구현 + 저장/재진입 스킵 (2-6)
검증 결과 온보딩 프로필 단계(locale/job/level)가 스텁이었고 저장/게이트 부재 → 전체 구현 채택(사용자 결정).
- **서버**: migration 000012 `profiles.onboarded bool`. 도메인 Profile.Onboarded, sqlc GetProfile(+onboarded)·UpsertProfile(INSERT…ON CONFLICT, onboarded=true), user_repo.UpdateProfile, ports.UserRepo.UpdateProfile, `PATCH /me/profile`(job/nativeLang/targetLang/destination/targetLevel, MVP 기본값 채움) → onboarded=true. `/me` 응답에 onboarded 포함.
- **모바일 온보딩 3화면(핸드오프 1:1)**: locale(1/4 모국어+목적지→targetLang), job(2/4 간호사 MVP·나머지 곧 열림), level(3/4 CEFR 게이지+밴드, 기본 B1) → `api.updateProfile` 저장. 선택은 router params로 단계 간 전달.
- **게이트**: authStore.onboarded(null=미상) 추가. restoreSession/syncOnboarded가 `/me.profile.onboarded` 반영, bootstrap의 dev auto-login 후에도 sync. index 게이트 3분기: 미인증→login, 인증&onboarded=false→locale, else→campus. login 성공 후에도 syncOnboarded로 분기.
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · E2E(PATCH → /me onboarded=true) · 시뮬레이터(onboarded=false→locale 1/4 진입, job 2/4, level 3/4 렌더, onboarded=true→campus 스킵).

## 2026-07-29 — 칭호·히든미션 (2-7, 풀 구현 + NPC 효과)
도메인 스펙(Title 효과=NPC 반응 가중, HiddenMission=은닉 조건+힌트+보상, UserTitle 장착)을 MVP로 구현. 사용자 결정: 풀 구현 + NPC 효과.
- **칭호 6종**(코드측 카탈로그, 성장 지표로 획득 판정 — 뱃지 패턴): 새내기(기본)·병동의 벗[온기]·성실한 손길·응급실의 에이스·언어의 달인·숨은 영웅[온기]. 장착은 **하나만 서버 저장**.
- **히든미션 3종**(힌트만 노출→조건 충족 시 발견, 보상=숨은 영웅 칭호): 베테랑(25회 클리어)·철인(14일 연속)·신망(평판 3종 ≥80). '숨은 영웅' 칭호 = 히든미션 하나라도 발견 시 획득(환류).
- **NPC 효과**: 장착한 [온기] 칭호(병동의 벗·숨은 영웅)가 대화 시 NPC 초기 우호도 +15 넛지. 서버 warmTitles 셋 ↔ 모바일 카탈로그 warm 플래그 동기화. 평판→NPC 가중 위에 얹음. 톤만, 규칙 불변.
- **서버**: migration 000013 `profiles.equipped_title`. 도메인 Profile.EquippedTitle, sqlc GetProfile(+equipped_title)·SetEquippedTitle(upsert), user_repo.SetEquippedTitle, ports.UserRepo, `PATCH /me/title`(코드측 allowedTitles 검증), engine.reputationDisposition에 warm 넛지, `/me` 응답에 equippedTitle.
- **모바일**: `src/data/titles.ts`(TITLES·MISSIONS·earnedTitles·foundMissions·titleById), `api.equipTitle`, InfoSheet에 action 버튼(장착) 추가. me.tsx — ID카드 장착 칭호 칩, 칭호 리스트(보유/미보유/장착, 탭→상세+장착), 히든미션 그리드(???/발견, 탭→힌트/보상).
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · E2E(PATCH equip 저장·/me 반영·잘못된 칭호 400·warm 넛지 톤 변화) · 시뮬레이터(장착 칩·칭호 4/6 리스트·히든미션 0/3·장착 시트).

## 2026-07-29 — 히든미션 영구 기록 + 발견 축하 토스트
직전 구현은 히든미션 발견을 실시간 조건 판정만 해 조건이 떨어지면 미발견으로 되돌아갈 수 있었음 → 영구화 + 최초 발견 연출.
- **서버**: migration 000014 `hidden_mission_progress(user_id, mission_id, found_at, PK(user,mission))`. sqlc FoundMissions/RecordMission(ON CONFLICT DO NOTHING), progress_repo 메서드, ports.ProgressRepo 확장, `GET /me/missions`(→{found:[]}) · `POST /me/missions/{id}`(allowedMissions 검증, 멱등).
- **모바일**: me.tsx 로드 시 서버 found 목록 조회 → titles.ts 조건으로 새로 met인데 미기록인 미션 감지 → `api.recordMission` 영구 기록 + 발견 토스트(🎉 이름·보상, 3.2s). 표시·hidden_hero 칭호 획득·히든 카운트는 모두 **서버 found 기반(영구)**으로 전환(earnedTitles에 hiddenFound 주입).
- **영구성 E2E**: streak14+평판85로 iron_will·beloved 발견 기록 → 조건 하락(streak2·평판50)해도 `/me/missions`가 여전히 두 미션 반환. 멱등: 재진입 시 fresh 없음 → 토스트 미발생.
- 검증: go build/test 0 · tsc 0 · jest 208/208 · E2E(기록·멱등·400·영구성) · 시뮬레이터(발견 토스트 렌더).

## 2026-07-29 — 이벤트 일일 풀 (DailyEventSet, 2-7)
도메인 스펙 DailyEventSet(userId·date·eventIds·resetsAt 00:00 local, level·ward·진행도 가중) 구현. 기존 TodaysScenarios(전역·결정적·미영속)는 fallback으로 유지.
- **영속 모델**: migration 000015 `daily_event_sets(user_id, local_date, scenario_ids jsonb, PK(user,local_date))`. 하루 내 안정적·콘텐츠 풀 변경에 불변·향후 광고 top-up 기반.
- **리셋**: 클라가 기기 tz 전달(`?tz=`) → 서버가 로컬 날짜로 버킷 → 자정(로컬)마다 새 행/샘플. (평판 집계와 동일 패턴)
- **가중 샘플링**(ContentRepo.DailyPool): 미클리어 부스트(cleared×0.25) × 레벨-난이도 적합(밴드 밖×0.5), dept 최대 2개 캡으로 다양성. 시드=FNV(userID+localDate)로 미영속 재샘플도 결정적. level=user_progress, cleared=scenario_attempts(ContentRepo가 pool로 직접 조회 — 실용적 계층 절충).
- **API**: `GET /me/daily-board?tz=&profession=`(authed, 12건). 모바일 board.tsx가 `api.dailyBoard()` 사용, 실패 시 `boardToday`(전역)로 폴백.
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · E2E(12건·하루 내 동일=영속·dept≤2·삭제후 재샘플 동일=결정적·Seoul[07-29] vs Pacific[07-28] 다른 세트=로컬 리셋) · 시뮬레이터(상황판 12건 렌더).
- **남음**: 소진 시 RewardedAdGrant +N(상한) — 다음. 메인 루트 그래프도 별도.

## 2026-07-29 — 보상형 광고 top-up (RewardedAdGrant, 2-7)
DailyEventSet 소진 시 광고 시청으로 +N(일일 상한) — 도메인 스펙 RewardedAdGrant.
- **서버**: migration 000016 `daily_event_sets.ad_grants`. `POST /me/daily-board/topup?tz=` → 오늘 세트에 가중 샘플 +3(세트에 없는 것 중, top-up 시드로 매번 다르게) append, ad_grants++. 일일 상한 3회(코드측 상수 topUpAdd=3·topUpCap=3, 하드코딩 아님). 상한 초과 → `ports.ErrDailyCapReached` → HTTP 429. sqlc GetDailyEventSet(+ad_grants)·UpdateDailyEventSet.
- **모바일**: board 하단 "🎬 광고 보고 새 상황 3건 열기" 버튼 → 보상형 광고 **스텁**(Expo Go용, 실제 SDK는 dev build 후속) → `api.topUpDailyBoard()` → 카드 갱신. 상한 도달 시 "오늘의 보상을 다 받았어요"로 비활성. 429는 capReached로 처리.
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · E2E(12→15→18→21건, ad_grants 1/2/3, 4회차 429) · 시뮬레이터(top-up 버튼 렌더).
- **메모**: 실제 AdMob 연동(react-native-google-mobile-ads, dev build), board '완료' 카운터 실집계는 후속.

## 2026-07-29 — 경제 수치 설정 테이블화 (하드코딩 제거, 2-7)
흩어진 경제 상수를 단일 소스로 중앙화(스펙: "코드측 허용집합 + 설정 테이블, 하드코딩 금지").
- **서버 권위 단일 소스**: `internal/economy` 패키지 `Economy` 구조체 + `Default()` + `var Active`. XP/레벨·랭크 임계·평판(기본값·밴드·칭호 넛지)·SM-2(ease·간격·mastery cap)·일일 풀(크기·dept 캡·가중)·top-up(add·cap) 전부 필드로.
- **소비처 리팩터**: progress.Review(SM-2)·engine.reputationDisposition(밴드·warm 넛지)·content_repo.DailyPool/sampleDailyPool(크기·캡·가중·레벨밴드)·content_handler(daily size·topup)·progress_repo.defaults(평판 기본값)가 `economy.Active`에서 읽음. (레벨 공식 `1+xp/100`는 SQL 구조라 유지, XPPerLevel=100 주석 참조.)
- **클라 미러**: `GET /config/economy`로 노출. 모바일 `src/data/economy.ts`(ECON 번들 기본값 + `hydrateEconomy` 부팅 시 서버에서 덮어씀 = 서버 권위, 오프라인 폴백). me/growth/result의 XP_PER_LEVEL·careerOf/careerTitle(→`careerFor`)·baseXp 기본값을 ECON으로 교체. 뱃지/칭호/미션 임계는 디자인 카탈로그로 유지.
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · `GET /config/economy` 21필드 반환 · 시뮬레이터(레벨·랭크·XP바 회귀 없음).

## 2026-07-29 — 메인 루트 그래프 (MainRoute 커리큘럼, 2-7)
도메인 스펙 MainRoute(커리큘럼 그래프) + MainRouteProgress 구현. prerequisites/follow_ups 기반 진행 경로.
- **파생 상태(마이그레이션 불필요)**: 완료 = scenario_attempts에서 이벤트별 클리어 여부 파생(이미 영속). 별도 progress 테이블 없이 그래프+클리어로 상태 계산.
- **서버**: `ContentRepo.MainRoute(userID, profession)` → main_route/both 이벤트를 tier 순으로, 각 노드 state = completed(이벤트의 시나리오 클리어) / available(모든 prereq 완료) / locked. 대표 진입 시나리오(이벤트별 최소 id) 포함. `content.RouteNode` 도메인 타입, ports.ContentReader 확장, `GET /me/route`.
- **모바일**: `app/route.tsx`(`/route`) 세로 스텝퍼 — 노드 dot(✓/▶/🔒)+연결선, 카드(TIER 뱃지·상태 라벨·제목), available+시나리오 있으면 탭→briefing. 시나리오 미저작 available은 "준비 중"(콘텐츠 갭 정직 처리). 캠퍼스에 "🧭 메인 루트" 진입 버튼.
- **콘텐츠 메모**: 현재 main_route 그래프는 파일럿 2노드(EVT-ER-00001 tier1 → 00002 tier2)만 시드. 00002는 시나리오 미저작 → "준비 중". 메커니즘은 콘텐츠 증가 시 자동 확장.
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · E2E(fresh: 00001 available·00002 locked → 00001 클리어 시 completed·00002 available) · 시뮬레이터(지금 도전/완료/잠김/준비 중 4상태 렌더).

## 2026-07-29 — 캠퍼스 탭 정식화: 커리큘럼 중심 홈
사용자 피드백: 첫 탭(캠퍼스)이 데모(중앙 카드 + 인테리어 바로가기 버튼 나열)였음. 커리큘럼(메인 루트)을 서비스 홈에 정식으로 녹여냄.
- **campus.tsx 재구성**(데모 → 홈): 인사+랭크 칩 → **메인 루트 '이어하기' 히어로**(다음 available 노드: TIER·제목·진행 바·"이어서 도전하기"→해당 시나리오 briefing, 없으면 /route) → "전체 여정 보기"(/route) → 캠퍼스 둘러보기(타일 탐험 엔진 /interior/CAMPUS-00001) → 빠른 입장(ER+클리닉 그리드) → 상황판 티저(→board). progress+mainRoute를 useFocusEffect로 로드, careerFor로 랭크.
- 핸드오프의 ScreenExplore(타일 워크 맵)는 그대로 "캠퍼스 둘러보기"로 유지; 첫 탭은 그 위에 여정/허브 프레이밍을 얹음.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터(커리큘럼 히어로·진행바·빠른입장·상황판 티저 렌더).

## 2026-07-31 — 캠퍼스 탭 v19 개편(허브) 구현
핸드오프 v18/v19 입고. v19 `screen-campus-hub.jsx`(캠퍼스 탭 모바일 우선 개편)를 1:1 포팅. 이전(커리큘럼 중심 단일 홈, 2026-07-29)을 대체.
- **2-탭 세그먼트 허브**(커리큘럼 / 건물·층) + 고정 헤더(캠퍼스·Lv칩·🔥streak) + ExploreDock(라일락, 탐험 모드=부차) + 부서 상세 시트. 축 분리: 캠퍼스=장소·커리큘럼, 상황판=시간·피드.
- **커리큘럼 탭**: 이어하기 히어로(MAIN CURRICULUM·CHAPTER·진행바·▶이어하기) → 챕터 타임라인(💬대화/📝퀴즈/⚡돌발/🏁시험, done✓/now NOW/lock🔒, 점선 레일) → 전체 로드맵(챕터 done/now/lock).
- **건물·층 탭**: 🧭 축-분리 안내 + 5개 건물 아코디언(ELEVATOR_BUILDINGS 미러) → 층 행(층칩·부서·CH.n/상황N/🔴긴급 칩·›). 층 탭 → 인테리어 직행이 아니라 **부서 상세 시트**.
- **부서 상세 시트**(Modal 바텀시트): 헤더(아이콘/이름/위치·영문/×) + 3 스탯 타일 + 이 부서의 커리큘럼(민트+이어하기) + 이 부서의 상황(긴급/신규/완료 카드) + 스티키 푸터(다음 상황 시작 / 🎮 걸어보기).
- **데이터**: `src/data/campus.ts`(CURRICULUM·STEP_META·BLD·deptFor) 번들(프로토타입처럼 authored). CTA(이어하기/시작)는 실제 시나리오(SCN-ER-*)로 연결. 헤더 Lv/streak는 실데이터(me.targetLevel·progress.streakCurrent). ER 1F는 풀 저작(showcase), 타 층은 "준비 중" 시트. 서버 주도화 여지 남김.
- 검증: tsc 0 · jest 208/208 · 시뮬레이터(커리큘럼·건물층·부서시트 3화면 렌더).

## 2026-07-31 — 서버 커리큘럼 챕터/스텝 모델 정렬
캠퍼스 v19 커리큘럼(챕터>스텝)을 클라 번들 → **서버 주도**로 이관. economy 패턴(코드측 카탈로그 + 파생, 마이그레이션 불필요).
- **서버 `internal/curriculum`**: Chapter/Step 카탈로그(v19 데이터) + `Resolve(cleared)`. 스텝 done = 매핑 시나리오 클리어, now = 잠금 아닌 챕터의 첫 미완료 스텝, lock = 그 뒤. 챕터 done = 전 스텝 done, now = 이전 챕터 done(prereq 체인), else lock. Ch.1–2는 실제 ER 시나리오(SCN-ER-00001..00011)에 스텝 매핑, Ch.3–5는 메타데이터만(lock).
- **진행 파생**: `ProgressRepo.ClearedScenarioIDs`(scenario_attempts). `GET /me/curriculum`(progressHandler) → 사용자별 챕터/스텝 상태.
- **클라**: `api.curriculum()` + `CurriculumChapter/Step` 타입. campus.tsx 커리큘럼 탭이 서버 데이터로 렌더(히어로=now 챕터, 타임라인=그 스텝, 로드맵=전 챕터), 로딩/오프라인 시 번들 fallback. 이어하기/NOW 스텝 탭 → now 스텝의 실 시나리오 briefing.
- **부서 상세 시트**: 여전히 번들 deptFor(ER showcase) — 후속 정렬 여지.
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · E2E(fresh: CH1 now·나머지 lock → ER1~6 클리어 시 CH1 done(5/5)·CH2 now(1/6, 다음=통증 사정 표현)·CH3~5 lock) · 시뮬레이터(실 진행 반영).

## 2026-07-31 — 부서 상세 시트 서버 커리큘럼 연결
캠퍼스 v19 부서 상세 시트의 "이 부서의 커리큘럼"을 번들 → 서버 `/me/curriculum`로 연결(커리큘럼 탭과 단일 소스).
- **DeptDetail**: `chapter{...}`(번들) 제거 → `chapterCh?: number`(서버 챕터 링크). ER 1F=CH.2, 타 층은 floor.cur로 링크(잠긴 챕터면 "이전 챕터 완료 시 열려요").
- **DeptSheet**: `chapters`(서버) prop 받아 `chapters.find(ch===dept.chapterCh)`로 실 진행 렌더. 진행바 done/total·다음 스텝·이어하기(now 스텝 시나리오)·완료 상태·잠김 상태 모두 서버 파생. 스탯 타일 커리큘럼 CH도 서버.
- **검증**: tsc 0 · jest 208/208 · 시뮬레이터(ER 시트 CH.2 1/6·다음=통증 사정 표현 — 커리큘럼 탭과 일치, 실 클리어 반영).

## 2026-07-31 — 부서 상황(sits) 실데이터화
캠퍼스 부서 상세 시트의 "이 부서의 상황"을 번들 → 서버 조회로. 부서 = 시나리오 id 접두사(SCN-<DEPT>-*)이라 새 부서에 새 쿼리 불필요.
- **서버 `GET /me/situations?dept=ER`**: 해당 dept 시나리오(≤8)를 `content.DeptSituation`(scenarioId·name·room·lv·min·tag·urgent)로. tag=완료(클리어)/긴급(난이도≥3)/신규, lv=난이도→CEFR(A2/B1/B2), min=timeLabel 파싱 or 난이도 추정, room=briefing.Dept. cleared는 scenario_attempts. `ContentRepo.DeptSituations`, ports 확장.
- **클라**: `api.deptSituations(dept)` + `DeptSituation` 타입. DeptDetail에 `deptCode`(ER='ER'). DeptSheet가 시트 열릴 때 fetch(useEffect), 번들 sits는 fallback. 시작/복습·다음 상황 시작 CTA는 실 시나리오.
- **검증**: go build/test 0 · tsc 0 · jest 208/208 · E2E(/me/situations?dept=ER → 8건, 클리어분 완료·나머지 신규, room·Lv·min) · 시뮬레이터(ER 시트 실 시나리오·완료 태그 반영).

## 2026-07-31 — 건물·층/부서 매핑 확장
캠퍼스 건물·층의 각 층을 실제 부서 코드에 매핑 → 모든 매핑 층에서 실 상황 로드(이전엔 ER만).
- **DB 실측**: 25개 부서 코드(ER/OR/ICU/ONCO/REHAB/PSYCH/HOSPICE/RAD/DIAL/ENDO/WOMENKIDS/LD/NICU/MORGUE/SPD/LOUNGE/SIM …), 각 12~15 시나리오.
- **Floor.dept 부여**(campus.ts): 층 → 대표 부서 접두사. tower(ER/OR/ICU), women(WOMENKIDS/LD/NICU), onco(REHAB/PSYCH/ONCO/HOSPICE), dx(RAD/DIAL/ENDO), admin(MORGUE/SPD/LOUNGE/SIM). 콘텐츠 없는 층(피부과·일반병동)은 dept 미지정 → "준비 중". deptFor가 floor.dept→deptCode로 넘겨 부서 시트에서 `GET /me/situations?dept=`로 실 상황.
- **스탯 타일 실값화**: 매핑 부서는 로드된 상황에서 해결한 상황(완료수/표시수)·권장 레벨(최빈 Lv) 파생, 아니면 authored/—.
- **커리큘럼 링크**: 층 chapterCh는 floor.cur 유지(tower 1F=CH2, 3F=CH4, 4F=CH5, 5-8F=CH3).
- 검증: tsc 0 · jest 208/208 · 시뮬레이터(ONCO 종양·BMT 시트에 실 시나리오·긴급/신규 태그·스탯 실값 렌더).

## 2026-07-31 — 2-8 통합·E2E: 전체 여정 스모크
전체 사용자 여정을 재실행 가능한 자동 스모크로 정식화(스테이지 2-8).
- **`server/scripts/e2e_smoke.sh`**: dev 서버(ENV=dev) 대상 API E2E 24 assert. 인증→온보딩(PATCH profile)→토큰 refresh 회전(구 토큰 재사용 401)→커리큘럼 구조→대화 응답+백그라운드 교정→리뷰 카드 증가→클리어 XP 적립·성장 집계→SM-2 등급→일일풀 12+광고 top-up→미션 영구 기록→부서 상황(완료 태그)→에러 상태코드(401/400). 단언은 monotonic/구조적이라 상태 독립·재실행 안전. **결과 24/0.**
- **발견**: /auth/refresh는 TokenPair 최상위 반환(로그인은 {tokens} 래핑) — 클라 인터셉터가 두 형태 각각 파싱 확인(회귀 없음).
- **후속(Phase 3 이관)**: AI 비용·지연 모니터링·분석 이벤트·성능/부하·스토어 메타/권한/개인정보. MVP 안정성 게이트는 스모크로 충족.
- 스테이지 status AI_PROPOSED, STATUS.md·2-8 문서 갱신. 다음 진입점: Phase R 독립 리뷰.

## 2026-08-03 — Phase R-2 독립 코드 리뷰 (Construction→Operations 게이트)
컨텍스트 분리된 3 서브에이전트(code-reviewer) 병렬 적대적 리뷰. 각 finding 개별 검증(맹목 수용 금지), 오탐 후보 명시 배제.
- **채택·수정 5**:
  - F1 Critical: warm 칭호 보너스가 동료 역할 NPC에서 유실(차원 선택 前 적용) → 루프 後로 이동.
  - F2 Critical: TopUpDailyPool check-then-act 레이스/상한 우회·lost update → tx + SELECT FOR UPDATE 직렬화.
  - F3 Important: dept 캡이 base+topup 누적 아님 → sampleDailyPool deptSeed로 기존 세트 부서 카운트 시드.
  - F4 Moderate: convSeconds 자정 걸친 세션 전체 계상 → `mx-GREATEST(mn,since)` clip.
  - F5 하드닝: ProgressBar div-by-zero 가드.
- **배제(결함 아님)**: economy.Active 전역(read-only, 레이스 없음), SM-2 수식, curriculum.Resolve, minutesOf, TZ 수학, rows.Close/인젝션, 모바일 effect/alive/ECON 게이트, setTimeout no-op.
- **검증**: go build/test 0·tsc 0·jest 208/208·스모크 24/0 재통과·F2/F3 전용 E2E(429·부서당≤2).
- R-2 문서(0R-review/02) AI_PROPOSED. Operations 진입 사람 승인 대기.

## 2026-08-03 — 콘텐츠: 커리큘럼 챕터 3~5 스텝 저작
서버 curriculum 카탈로그 ch3~5를 메타데이터(Total만) → 실 스텝(대화/퀴즈/돌발/시험)으로 저작, 각 스텝을 실제 시나리오에 매핑.
- **CH3 병동 인계와 투약**(7 스텝) → PHARMA 시나리오(헤파린 더블 체크·구두 처방·마약류 2인 인증·STAT IV·인슐린 교육·와파린 상담·고위험 약물 이중확인).
- **CH4 수술 전후 케어**(6 스텝) → OR(수술 동의·마취 전 문진·부위 표시·Time-out·무균술·PACU 인계).
- **CH5 중환자실 집중 감시**(8 스텝) → ICU(모니터 알람·인공호흡기 보고/소통·진정 관리·Code Blue·섬망·패혈증·임종 면담).
- 진행 파생은 기존 Resolve 그대로 — 실 시나리오 클리어로 done/now/lock 전진. 클라 변경 불필요(서버 주도, /me/curriculum).
- 검증: go build/test 0 · E2E(ER 11 클리어→CH3 now 0/7·CH4/5 lock; PHARMA-00001 클리어→CH3 1/7, next=구두 처방 받아쓰기·스텝 순차) · 스모크 24/0.

## 2026-08-10 — 홈 탭 · 동료 시스템 Build Spec 확정 (핸드오프 v20→v21)
구현 스펙: [`02-construction/home-colleagues/`](02-construction/home-colleagues/build-spec-index.md) (comprehensive · 인덱스+4 아티팩트).
- **왜 홈인가**: 커리어 탭은 커리큘럼·건물·상황이 전부 목록이라 앱 진입 즉시 "골라야 한다"는 압박이 된다. 홈은 반대 원칙 — **오늘 할 딱 한 가지**만 크게, 성취 먼저, 나머지는 얕은 문.
- **더미 금지(전제)**: 홈 10개 모듈 전부 실데이터. 값이 없으면 **모듈을 숨긴다**. 핸드오프 문자열은 프로토타입 예시이며 옮기지 않는다. → 서버 작업 동반.
- **동료 관계는 방향성 2행**(`colleague_links`): A—B 연결 시 `(A,B)`+`(B,A)`를 한 트랜잭션에. 멘토/멘티가 비대칭 라벨이라 단일 행이면 조회마다 방향 분기가 생긴다. `relation`은 **DB CHECK 없이 코드측 allowed-set**(peer/mentor/mentee) — 멘토–멘티 정식 출시 때 마이그레이션 불필요.
- **코드 입력은 즉시 연결이 아니라 요청**: 코드를 아는 것만으로 학습 현황이 공개되면 코드 유출이 곧 프라이버시 사고. 핸드오프도 "상대가 수락하면"으로 명시.
- **미연결 상대 조회는 404**(403 아님) — 403은 "그 사용자는 존재한다"를 누설한다.
- **홈은 단일 엔드포인트** `GET /me/home`: 앱 첫 화면이라 왕복 수가 곧 체감 지연. 서버가 "보여줄 것"만 nullable 필드로 담아 보내 클라이언트 분기를 줄인다.
- **확정 4건**: ①날씨 **제거**(더미 금지 일관·위치 권한 회피) ②아이콘 **라인 아이콘 통일**(기존 이모지→라인 전환 방침과 일관, 국기만 예외) ③**⚔ 대결 제외**(규칙 미설계 — 동작 없는 버튼을 남기지 않음) ④멘토 쪽지·현장 표현 **시드 작성**(부서별 ~24/~30 → 한 달 무반복).
- **신규 편차**: 응원 1일 5건 제한(SoT에 없음, 알림 폭탄 방지).

## 2026-08-10 — 홈 탭 · 동료 시스템 구현 완료 (U1~U10)
Build Spec 전 유닛 구현. 서버(6테이블·`colleague` 도메인·`GET /me/home`·동료 API 13종·콘텐츠 시드 56건) + 모바일(탭 5개·홈 10모듈 2상태·동료 4화면·프로필 카드).
- **진입 게이트를 `/campus` → `/(tabs)`(홈)로 변경**. 앱을 켜자마자 목록을 마주하지 않게 하는 것이 홈의 존재 이유라, 첫 화면이 아니면 기능 자체가 무의미하다.
- **근무 배치는 시드로 뽑지 않는다** — 커리큘럼 현재 스텝의 부서를 그대로 쓴다. "오늘 배치"가 오늘 할 학습과 어긋나면 세계관이 깨진다. 멘토 쪽지·표현도 같은 부서 풀을 우선하고, 전용 풀이 있으면 공통과 섞지 않는다(부서 목소리 희석 방지).
- **`AddResult`의 네 결과는 전부 성공**(requested/alreadyLinked/alreadyRequested/autoAccepted). "이미 요청했다"는 실패가 아니라 상태이므로 에러로 만들지 않았다.
- **응원 한도는 수신자당 rolling 24h 5건**. 한 사람에게 몰아치면 괴롭힘이지만 여러 동료를 응원하는 건 막을 이유가 없다.
- **프리셋 문구는 서버 소유** — 클라이언트는 키만 보낸다. 임의 문자열을 프리셋으로 위장할 수 없다.
- **동료 이름은 사용자 id 앞 6자**(임시). 프로필에 닉네임 필드가 없어 실명 대신 안정적 식별자를 쓴다 — 닉네임 도입 시 교체할 후속 항목.
- 검증: go build/vet/test 0 · tsc 0 · jest 209/209 · 실 DB 2사용자 E2E(자기코드 400·수락전 404·수락후 양방향 2행·60자 400·비공개 시 필드 부재) · 시뮬레이터 홈 렌더.

## 2026-08-10 — 계약 재생성 + E2E 스모크 확장 (홈·동료 마감)
- **계약(`packages/contract`) 재생성**: swag v2 → openapi.yaml → openapi-typescript. 경로 **19 → 47**. 기존 19개는 전부 보존됐고(집합 비교로 확인), 늘어난 28개는 홈·동료 신규가 아니라 **이전부터 문서화가 누락돼 있던 기존 경로**(대화·퀴즈 오디오·데일리보드 등)다 — 계약이 그만큼 오래 밀려 있었다는 뜻.
- **스모크 24 → 48 assert**. 추가분 ⑫홈 ⑬동료 ⑭프리셋. 홈은 "모듈은 없거나 완결"(부분 채움 금지)·`done ⇔ todayOne 부재`·근무 부서=커리큘럼 부서를 검사한다. 동료는 코드 형태(혼동문자 없음)·재발급 동일성·자기 코드 400·미상 404·**미연결 404(403 아님)**·응원 404를 검사.
- **링크 플로우(요청→수락→응원)는 스모크에 넣지 못했다**: `/auth/dev`가 고정 단일 계정이라 두 번째 사용자를 스크립트 안에서 만들 수 없다. 대신 실 DB에 사용자를 만들고 서명 키로 토큰을 발급해 **수동 E2E로 검증**(양방향 2행·수락 전 404·60자 400·비공개 시 필드 부재). 후속으로 테스트 전용 사용자 생성 경로를 두면 자동화 가능.
- 프리셋 토글 테스트는 **원래 값으로 복원**한다 — 일부러 비공개로 둔 계정의 설정을 테스트가 뒤집으면 안 된다.

## 2026-08-10 — 평판 획득 (NPC 반응 가중의 나머지 절반)
"평판→NPC 반응 가중"을 착수하려다 **소비 측은 이미 구현돼 있고 생산 측이 전혀 없다**는 걸 발견. `reputationDisposition`이 NPC 톤을 4밴드로 조절하고 있었지만 `patient_satisfaction`/`peer_trust`/`emergency_response`를 **쓰는 코드가 전 코드베이스에 없어** 모두 기본값 50 고정 → 밴드 4개가 실질 1개로 동작했고 프로필 평판 바는 장식이었다. STATUS의 "착수 예정" 표기가 실제 상태와 어긋나 있었다.
- **차원 결정은 부서가 아니라 시나리오가 선언하는 `acuity`**(routine/urgent/critical). 부서로 판단하면 ER 밖의 돌발(병동 급변·수술장 위기·투약 사고)을 놓치고, 부서 어휘는 다음 직업에서 통째로 다시 써야 한다. 긴급도는 **상황의 성질**이라 직업과 무관하게 이식된다. 검증: 호스피스 병동 시나리오가 응급 대응력을 움직였다.
- **차원은 직업에 속한다**(`reputation.Catalog`). "환자 만족도"는 프로그래머에게 의미가 없다. 직업 추가 = 카탈로그 한 항목. 미등록 직업은 **폴백하지 않고 스킵** — 잘못된 축을 움직이느니 안 움직이는 게 낫다.
- **저장소 일반화는 미룸.** 3컬럼 유지하되 호출부는 차원을 **이름으로** 다루고 컬럼 매핑은 저장소 안에만 둔다. 직업 #2가 실제로 들어올 때 키-값으로 바꿔도 호출부는 그대로. 쓰지 않을 일반성을 위해 마이그레이션·API·UI를 먼저 흔들지 않는다.
- **소비·생산이 같은 `Resolve`를 쓴다** — 배운 축과 평가받는 축이 어긋나면 시스템이 거짓말을 한다.
- **델타는 합격선이 피벗**: 겨우 통과는 0(잘해야 오른다). 상승 최대 6 > 하락 최대 4 — 학습 앱에서 회복이 추락보다 쉬워야 한다. 시간 감쇠 없음(복귀 장벽). 채점 없는 직접 클리어는 미적용.
- **테스트가 잡은 결함**: 정수 스케일로 합격선 ±3점이 0으로 뭉개져 61점과 60점이 같아졌다 → 피벗을 벗어나면 최소 1 이동.
- 콘텐츠: 250 토픽 중 **14개만** 긴급 표시(140/2500 시나리오). 키워드로는 "낙상 외상 사정"과 "낙상 예방 교육"을 못 가르므로 나머지는 토픽별 검토가 필요 — 콘텐츠 워크스트림 몫.
- 검증: go build/vet/test 0 · 실 클리어 E2E(호스피스 critical → ER만 +2) · 스모크 **51/0**.

## 2026-08-10 — 평판 저장소 일반화 (같은 날 번복)
직전 항목에서 "3컬럼 유지 + 이음매만"으로 결정했다가 **같은 날 뒤집었다.** 근거였던 "쓰지 않을 일반성을 위해 마이그레이션·API·UI를 먼저 흔들지 말자"는 **배포 전에는 성립하지 않는다** — 지금 흔드는 비용은 거의 0이고, 출시 후엔 사용자 데이터 이관이 붙는다.
- 마이그레이션 020: `user_reputation(user_id, dimension, value)` 키-값 + 기존 값 이관 + `user_progress` 3컬럼 제거. down 대칭.
- **라벨도 서버로.** `환자 만족도`가 클라이언트에 하드코딩돼 있으면 비임상 직업이 나오는 날 앱을 다시 빌드해야 한다. `Catalog.Specs`가 표시 순서와 라벨을 소유하고, `/me/progress`는 `reputation: [{key,label,value}]`를 순서대로 준다.
- 모바일은 배열을 그대로 렌더(색은 팔레트 순환) — 차원 수가 바뀌어도 코드 변경 없음. `titles.ts`는 `rep: Record<string, number>`.
- 검증: 기존 값 8/50/87 무손실 이관 · tsc 0 · jest 209/209 · 스모크 **53/0** · 계약 재생성.

## 2026-08-10 — 2-7 잔여 감사 + 유기적 환류 구현
**감사 먼저.** 평판 때 STATUS 표기가 실제와 어긋난 걸 겪어 남은 항목을 코드로 전수 확인했다. 결과: "남음"으로 적힌 5개 중 4개가 **이미 구현돼 있었다** — 칭호·히든미션(서버 영속 확인: `PATCH /me/title` 200, `/me/missions` 3건), 일일 풀 00:00 리셋+가중 샘플링(`content_repo.go:461`), 메인 루트·보상형 광고(스모크 ⑧), 경제 수치 테이블(25필드, `GET /config/economy` 하이드레이션). 2-6의 "클리어 컨페티"도 `result/[id].tsx`에 이미 있었다. **문서가 코드보다 뒤처져 있었을 뿐이다.**
- 진짜 남은 하나는 **유기적 환류의 "입장 조건" 부분**이었다. `Room.Locked`는 영구 플래그라 보상으로 열 방법이 없었다 — 보상이 점수판에만 남고 세계로 돌아오지 않았다.
- `domain/access`: 요구조건 종류를 **코드측 allowed-set**(level/cleared/title/reputation/mission)으로. 방·핫스팟이 `requires`를 선언하고 서버가 학습자 스냅샷으로 평가한다. **모르는 종류는 fail-closed** — 이해 못 하는 콘텐츠가 문을 여는 것보다 안전하다.
- **잠금에는 반드시 이유가 따른다.** 이유 없는 잠금은 목표가 되지 못한다. 스모크가 이 불변식을 검사한다.
- **캐시 오염 회피**: 인테리어 응답은 공개이고 클라이언트가 id로 캐시한다. 사용자별 잠금을 거기 실으면 한 사용자의 캐시가 다른 사용자에게 답하게 된다 → 별도 `GET /me/access/{interiorId}`.
- 첫 사례: ER 트라우마 룸이 `SCN-ER-00001` 클리어를 요구. 검증: 클리어한 사용자는 열림, 이력 없는 사용자는 잠김 + "앞선 시나리오를 먼저 끝내야 해요".
- 검증: go build/vet/test 0 · tsc 0 · jest 209/209 · 스모크 53 → **57/0** · 계약 재생성.

## 2026-08-10 — 온보딩 저장/재진입 검증 (결함 2건 수정)
검증만 하려다 결함 두 개를 찾았다.
- **①중간 이탈 시 선택값 유실.** 로케일·직업 답이 **라우트 파라미터로만** 존재하고 마지막 화면에서 한 번에 저장됐다. 앱을 닫으면 4단계 중 3단계를 다시 해야 했다. → 기기 로컬 드래프트(`lib/onboardingDraft`)에 단계별 저장, 게이트가 **첫 미응답 단계부터 재개**, 저장 성공 시 드래프트 삭제. **부분 저장을 서버로 보내지 않은 이유**: `PATCH /me/profile`이 `onboarded=true`를 찍기 때문에 중간에 보내면 남은 단계를 영영 건너뛴다.
- **②완료·로그인 후 목적지가 `/campus`.** 홈 탭 도입 때 진입 게이트만 `/(tabs)`로 바꾸고 온보딩 완료(`level.tsx`)와 로그인(`login.tsx`)을 놓쳤다 — **내가 만든 회귀**. 앱을 켜자마자 목록을 마주하지 않게 하는 게 홈의 존재 이유인데, 가장 처음 들어오는 두 경로가 커리어로 보내고 있었다.
- **재진입 스킵 자체는 정상**이었다: `onboarded`가 `null`로 시작하고 게이트가 `=== false`일 때만 온보딩으로 보내, 서버 응답 전에 온보딩이 번쩍이지 않는다.
- 검증: 재개 로직 단위 테스트 4종 · 시뮬레이터에서 `onboarded=false` → 온보딩 1/4, `true` → **홈**(커리어 아님) · tsc 0 · jest 213/213.

## 2026-08-11 — 커리큘럼 층 전수 커버 (5 → 25챕터)
**감사 결과가 심각했다.** 엘리베이터로 갈 수 있는 층은 24개인데 커리큘럼은 본관 4개 층만 다뤘고, 참조 시나리오는 28개(ER·ICU·OR·PHARMA)뿐이었다. **25개 부서 ~2,800 시나리오 중 99%가 커리큘럼으로 도달 불가**였고 상황판·자유 탐험으로만 만날 수 있었다.
- **층 표기 버그**: Ch3이 "본관 5F 내과 병동 · 중앙약국"을 가리켰는데 **5F는 존재하지 않는다**(내과=8F, 약국=P1). 홈의 "오늘 배치"가 이 문자열을 그대로 쓰고 있었으므로 사용자가 없는 층을 찾아가게 된다 → `본관 P1 중앙 약제부`로 정정.
- **콘텐츠 공백 4개 층**: 8F 내과·7F 외과·6F 정형·2F 피부과는 **인테리어는 지어졌는데 시나리오 뱅크가 없었다**. GEN(공통 병동)으로 때우면 병동 세 층이 같은 내용이 되고 피부과는 아예 못 덮는다(광선·레이저는 병동 업무가 아님) → **4개 뱅크 신규 저작**(각 10토픽 → 각 100 시나리오).
- **커리큘럼을 생성물로 전환.** 층 지도(`cmd/gencontent/floors.go`)에서 층당 1챕터를 뽑아 `catalog_gen.go`로 생성한다. 손으로 24챕터를 쓰면 존재하지 않는 ID를 참조하기 쉽고, 부서가 늘 때마다 카탈로그 수정을 기억해야 한다. 챕터 번호는 병합 시점에 부여해 **층을 끼워 넣어도 재번호가 필요 없다**.
- **순서는 난이도 기반**(`Tier`): 일상 병동 → 외래·검사 → 반복 치료 → 소아·모성 → 고중증 → 정서 난이도(정신과·호스피스·영안실) → 백스테이지. 층 순서대로 하면 신입이 2번째 챕터에서 피부과 레이저를 만난다.
- 스텝 구성: 토픽 난이도 오름차순 5개 + 그 층의 최고 난이도를 **챕터 시험(boss)** 으로, 중간에 퀴즈 1개. 긴급도가 있는 토픽은 `event`로 표시.
- 검증: 커리큘럼이 참조하는 **173개 ID 전부 DB에 실재**(집합 비교) · 챕터 번호 연속·중복 없음 단위 테스트 · API에서 25챕터 확인 · 스모크 57/0 · tsc 0 · jest 213/213.

## 2026-08-11 — 픽셀 폰트 번들 + 이모지→아이콘 전면 교체 (UI 마감)
**"코드는 맞고 화면은 틀린" 상태를 두 갈래로 정리했다.** 디자인 핸드오프의 타이포·아이콘 어휘가 tokens에는 선언돼 있었지만 런타임에는 도달하지 않고 있었다.

**①폰트가 조용히 폴백되고 있었다.** `tokens`가 `DungGeunMo`/`Galmuri11`을 지정하는데 `assets/fonts`에는 README만 있었고 `useFonts` 호출도 없어, **모든 `fontFamily`가 예외 없이 시스템 폰트로 떨어졌다**(RN은 없는 패밀리에 대해 조용히 폴백한다 — 그래서 tsc·jest가 전부 그린인데도 화면만 달랐다). `expo-font`는 의존성에만 들어 있었다.
- 배포본이 WOFF인 둥근모꼴은 **fontTools로 TTF 변환** — React Native는 WOFF를 못 읽는다. Galmuri11은 OFL-1.1이므로 라이선스 원문(`Galmuri-OFL.txt`)을 동봉한다.
- **폰트 준비 전에는 렌더하지 않는다**(`_layout`). 먼저 그리고 나중에 바꾸면 전 화면이 리플로우된다. 단 **로드 실패가 앱 시작을 막지는 않는다** — 시스템 폰트는 보기 싫을 뿐이지만 시작 불가는 치명적이다.
- **서브셋하지 않는다(≈15MB).** 대화문이 런타임 LLM 생성이라 어떤 글자든 나올 수 있고, 빠진 글자는 두부(tofu)로 보인다. 15MB는 그 안전의 값이다.

**②이모지는 아이콘 세트로, 장식 이모지는 삭제로.** OS 이모지는 플랫폼마다 모양이 달라 픽셀 아트 화면에서 유일하게 톤이 깨지는 요소였다.
- 아이콘 세트 **31 → 73종**(범용 21 + 부서 21 신규 저작). `PixelButton`/`PixelChip`이 `icon` 슬롯을 받는다 — `▶`는 폰트 글리프라 아이콘 그리드가 아니라 **폰트의 베이스라인·메트릭에 얹혀** 버튼마다 위치가 달랐다.
- **`play`만 채운다(fill).** 재생 컨트롤은 어디서나 solid wedge로 읽히고, 외곽선만 있으면 빈 자리처럼 보인다.
- **문장 속 장식 이모지(💡·💬·🗣·🎯·💊…)는 아이콘으로 바꾸지 않고 제거했다.** 문장은 그 자체로 읽히고, 장식 아이콘은 오히려 잡음이다. 교체는 **의미를 지는 자리**(스피커·마이크·부서·메달)에만.
- **데이터에 남은 이모지는 `EMOJI_ICON` + `iconFor()` 브리지로 흡수.** 스티커·뱃지·칭호는 이모지 문자열이 데이터 shape이므로, 렌더 시점에 아이콘으로 사상한다 — 콘텐츠를 다시 쓰지 않고 화면만 정리된다. 그래서 소스에 남은 `⭐`/`🌸`는 **렌더되지 않는 매핑 키**다.

**의도적으로 남긴 것**
- **맵 픽스처의 방·층 아이콘(31파일)** — 맵 렌더러를 거치는 데이터라 별도 작업. 실제 렌더 지점은 `ElevatorScreen.tsx:250`(층)·`FastTravelModal.tsx:44`(방) 두 곳이고, 픽스처가 `icon: '📋'` 형태로 이모지를 들고 있다. 브리지(`iconFor`)를 여기까지 확장하려면 부서·시설 어휘 아이콘이 더 필요하다.
- **국기(🇰🇷 등)** — 라인 아이콘화 불가. 로케일 선택은 이모지 유지.
- **`✓ / ✕ / ▲▼`** — 이모지가 아니라 **픽셀 폰트가 직접 그리는 기호**라 플랫폼 편차가 없다.
- 검증: tsc 0 · jest 213/213 · 시뮬레이터 렌더 확인(헤딩=둥근모꼴, 본문·영문=Galmuri11).

## 2026-08-12 — 호스팅 타깃 확정: Cloud Run + Cloud SQL (서울) · Redis는 Upstash
`prd-tech.md`가 "Fly.io 또는 Render 권고, 최종 선택 게이트"로 남겨둔 호스팅 결정을 닫았다.
- **결정: Cloud Run + Cloud SQL, asia-northeast3(서울).** 사용자가 한국 간호사이므로 반사 지역이 최소인 리전을 택했다.
- **대안(탈락)**: **Fly.io는 도쿄(nrt)까지만**(서울 ICN 없음 — 커뮤니티 요청만 존재), **Render는 아시아가 싱가포르 단독**
  (도쿄 작업 중, 시드니 예정). 서울 기준 RTT 대략 Seoul ~10ms / Tokyo ~35ms / Singapore ~75ms.
- **리전 근거를 정직하게 좁혔다**: AI 대화는 LLM 제공자가 미국이라 어차피 태평양을 건넌다. 리전이 실제로 좌우하는 건
  **홈 집계·커리큘럼·클리어 같은 비-AI 왕복의 체감**이다. "리전으로 AI가 빨라진다"는 기대는 근거가 아니다.
- **Redis는 Memorystore가 아니라 Upstash(도쿄).** 용도가 캐시·레이트리밋·일일 리셋·refresh 토큰이라 초단위 지연에 물리지
  않는데, Memorystore는 최소 구성도 고정비가 붙고 Cloud Run이 VPC 커넥터를 거쳐야 한다. `redis.ParseURL`(go-redis v9)이
  `rediss://`를 그대로 파싱하므로 **코드 변경 0**.
- **다만 Redis를 캐시로 착각하지 않는다**: `RefreshStore`가 refresh 토큰 해시를 TTL 30일로 들고 있어 소실 = 전 사용자 재로그인.
  로그인 경로의 경성 의존이며 `config.go:85`가 없으면 부팅을 실패시킨다(의도적). 3-2 모니터링의 계측 대상.
- **결정자:** 사용자(옵션 제시 후 선택).

## 2026-08-12 — 환경 = staging + prod, Cloud SQL 인스턴스 1개에 DB 2개
- **결정:** Cloud Run 서비스 2개(staging은 scale-to-zero, prod는 `min-instances=1`) + **Cloud SQL 인스턴스 1개에
  `forin_staging`·`forin_prod` 두 데이터베이스**.
- **근거:** 고정비는 prod 단독과 거의 같은데, **Cloud Run 고유 설정(Secret Manager·IAM·Cloud SQL 커넥터·마이그레이션 Job)을
  prod를 죽여보지 않고 검증**할 자리가 생긴다. 배포 버그는 거의 전부 이 지점에 있다.
- **대안(탈락):** ①prod 단독 — 로컬 docker-compose 패리티와 스모크 57개가 리허설을 대신한다는 논리였으나, 마이그레이션이
  이미 20개이고 계속 늘어나므로 실사용자 이후엔 리허설 없는 스키마 변경이 위험해진다. ②인스턴스 2개 완전 분리 — 아직 prod
  트래픽이 없는 단계에선 이중 고정비만 남는다.
- **결정자:** 사용자.

## 2026-08-12 — 배포 파이프라인 원칙 4가지
설계를 관통하는 결정들. 상세는 [3-1 Deployment](03-operations/01-deployment.md).
- **①이미지 하나, 엔트리포인트 셋(`/api`·`/migrate`·`/seed`).** 마이그레이션과 그것을 필요로 하는 코드가 **원리적으로 어긋날
  수 없게** 같은 다이제스트로 돈다. 이를 위해 `cmd/migrate`를 신설해 `//go:embed`로 마이그레이션을 이미지에 넣고
  golang-migrate를 **라이브러리로** 쓴다 — Cloud Run Job은 CLI를 설치할 자리가 없고, 임베드하면 "런너의 로컬 파일"에
  의존하지 않는다. `make migrate-up`(CLI)은 로컬 개발용으로 남긴다.
- **②코드는 즉시 롤백, 스키마는 전진만.** down이 20개 전부 대칭으로 있지만 **자동 롤백하지 않는다** — 롤백은 장애 중에
  실행되는 절차이고 down은 데이터를 지울 수 있다. 무엇을 잃는지 판단할 여유가 없는 시점에 파괴적 작업을 자동화하지 않는다.
  대신 **마이그레이션을 하위호환으로만 쓴다**(nullable 추가 → 백필 → 다음 릴리스에서 제거). 그러면 이전 리비전 코드가 새
  스키마에서 항상 동작하므로 **트래픽 전환만으로 복구가 완결된다** — 스키마 롤백을 포기하는 대가로 얻는 불변식이다.
- **③무키 CI(Workload Identity Federation).** 서비스 계정 JSON 키를 GitHub Secrets에 두지 않는다 — 키는 유출되면 회수 시점을
  알 수 없고 만료도 없다. GitHub Secrets에는 프로젝트 ID·WIF provider 경로만.
- **④prod 승격은 수동 승인.** staging 배포와 스모크 57 assert는 자동, prod는 GitHub Environment 승인. 솔로라도 스키마가 붙은
  배포에 사람 확인 한 번은 남긴다. OTA(`eas update`)도 **같은 게이트로 취급** — 스토어 심사를 우회하는 경로이므로 더 조심해야 한다.

## 2026-08-12 — 콘텐츠 시드 가드 (교체 의미의 위험을 좁힘)
`ContentRepo.Seed`가 단일 트랜잭션 안에서 `DELETE` 6종 → `INSERT`, 즉 **교체(replace)** 라는 것을 감사에서 확인했다.
- **진행도는 안전하다**: `user_progress`·`review_cards`·`conversation_sessions`의 `scenario_id`가 **FK 없는 `text`**
  (`000003_progress.up.sql:21`)라 콘텐츠 삭제가 cascade하지 않는다. 콘텐츠와 진행도를 처음부터 분리해둔 게 여기서 값을 했다.
- **그러나 dangling 참조는 생긴다**: 시드가 ID를 없애면 진행도·복습 카드가 없는 시나리오를 가리킨다. → **시드 전 게이트**:
  새 번들의 시나리오 ID 집합이 **(커리큘럼 참조 173개 ∪ DB에 실재하는 `scenario_id`)를 포함**하는지 검사하고 아니면 실패.
  콘텐츠는 늘어나기만 하는 게 정상이고, 줄어드는 배포는 사고일 확률이 높다.
- **시드는 배포의 자동 단계가 아니다** — `workflow_dispatch` 수동 트리거. 코드 배포마다 6.8MB 콘텐츠를 전량 교체할 이유가 없다.

## 2026-08-12 — 모바일: 환경 분리 + OTA는 fingerprint 정책
- **`eas.json` 프로필별 API 주입**: `preview`→staging, `production`→prod. 근거: `client.ts:10`이
  `EXPO_PUBLIC_API_URL ?? 'http://localhost:8080'`이라 프로필에 값이 없으면 **localhost로 조용히 폴백**한다 —
  스토어 빌드에서 즉시 전면 실패다. 폰트가 조용히 폴백했던 것과 같은 종류의 함정.
- **`expo-updates` + `runtimeVersion: { policy: "fingerprint" }`.** 카카오 SDK·애플 인증·expo-audio 등 네이티브 모듈이 있어
  `appVersion` 정책은 위험하다 — **네이티브 의존이 바뀐 JS를 구버전 바이너리에 밀어넣을 수 있다.** fingerprint는 네이티브
  지문이 변하면 OTA를 자동 무효화한다. JS-only만 `eas update`, 네이티브 변경은 새 빌드.
- **3-1 범위는 내부 트랙까지**(TestFlight·Play 내부 테스트). 스토어 본심사·메타데이터·개인정보 라벨 제외 — 실제 출시 사정에
  묶이면 이 스테이지가 끝나지 않는다.

## 2026-08-12 — IaC: 콘솔 클릭을 0에 가깝게, 못 되는 경계는 명시
- **결정:** `infra/terraform/` **단일 루트 모듈**이 staging·prod를 함께 선언. 공유 Cloud SQL 인스턴스가 실제로 하나이므로
  상태를 환경별로 쪼개면 그 공유물의 소유자가 애매해진다.
- 부트스트랩 치킨-에그(원격 상태 버킷이 Terraform보다 먼저 있어야 함)는 `make infra-bootstrap`이 **GCS 버킷 하나만** gcloud로
  만들고 이후 전부 Terraform. 자격은 로컬 1회 `gcloud auth application-default login`(CLI, 콘솔 아님) → apply가 WIF까지 만들고
  이후 CI는 무키 배포.
- **자동화 불가 경계를 문서에 못박는다**(요구가 "콘솔 작업 없기"였으므로 못 되는 부분을 숨기지 않는다):
  ①Upstash 계정 가입·API 키 발급(웹) ②시크릿 **값** — Terraform은 컨테이너만, 값은 `make secrets`(gcloud CLI)로 주입
  ③Apple App Store Connect API 키·Google Play 서비스 계정 — Apple/Google 포털엔 IaC가 없다. GCP 프로젝트는 `forin-504711`로 이미 존재.
- **문서 형식**: 산출물이 로직·화면이 아니라 파이프라인 구성이고 `domain-entities`·`business-rules`가 실질 N/A이므로,
  **별도 Build Spec 디렉토리를 만들지 않고** 스테이지 문서 AI Proposal + DECISIONS로 간다(FRAMEWORK의 "구현 중심 스테이지엔
  Build Spec" 기준에서 의도적으로 벗어남, 사용자 승인).
- **결정자:** 사용자("iac가 되는거지? 그럼 그대로 진행하자. 내가 수동으로 gcp 콘솔에 들어가서 작업할일이 없으면좋겠어").

## 2026-08-12 — 9-A 구현 계획 + 스모크 인증 경로 (설계 공백 발견)
9-A 서버 배포의 태스크 단위 실행 계획을 작성했다(8 태스크, `docs/superpowers/plans/2026-08-12-9a-server-deployment.md`).
계획을 쓰는 과정에서 **스펙에 없던 공백 하나**가 드러났다.
- **공백**: staging 스모크 57 assert는 `POST /auth/dev`로 인증하는데 그 경로는 `Env == "dev"`에서만 등록된다.
  staging을 `ENV=dev`로 돌리면 **공개 URL에 인증 우회가 열리고**, `ENV=prod`로 돌리면 스모크가 인증하지 못한다.
  설계 단계에서 "staging에 스모크를 돌린다"고만 적고 인증을 어떻게 할지는 비워두고 있었다.
- **결정**: `DEV_AUTH_SECRET`이 설정된 환경에서만 경로를 등록하고, `dev`가 아니면 일치하는 `X-Dev-Auth` 헤더를 요구한다.
  prod는 시크릿을 받지 않으므로 **경로가 존재하지 않는다** — "prod에서 `/auth/dev`는 404" 불변식이 그대로 유지되고,
  배포 워크플로가 매 배포 끝에 그것을 검사한다.
- **401이 아니라 404**로 답한다: 밖에서는 없는 것처럼 보여야 한다. **빈 시크릿은 빈 헤더와도 일치하지 않게** 했다 —
  그러지 않으면 오설정된 staging이 문을 활짝 연다. 비교는 constant-time.
- **대안(탈락)**: ①staging을 `ENV=dev`로 — 공개 우회. ②CI에 `JWT_SIGNING_KEY`를 내려 토큰을 직접 발행 — 서명 키를
  CI로 끌어내리는 대가가 더 크다. ③스모크를 소셜 로그인으로 — CI에서 불가능하다.
- **계획에 담은 다른 설계 판단들**: `//go:embed`는 `..`를 참조할 수 없어 임베드 선언이 `server/db/` 안에 있어야 한다 ·
  마이그레이션 Job은 `max_retries=0`(실패는 재시도가 아니라 정지여야 한다) · Cloud Run 이미지 태그는 Terraform
  `lifecycle.ignore_changes`로 CI 소유 · 시드 가드의 참조 출처는 **영속 3곳만**(`user_presence`·일일 풀은 일시적이라 제외,
  스쳐 지난 시나리오로 콘텐츠 은퇴가 막히면 안 된다) · dirty 복구 런북을 `infra/README.md`에 둔다(2번 수동 되돌림을
  3번 force보다 먼저 — 순서를 뒤집으면 "이미 존재함"으로 또 실패한다).

## 2026-08-13 — 9-A 구현 리뷰가 잡은 인프라 결함 8건 (계획서 정정)
Task 6(Cloud Run 런타임 + WIF)의 독립 리뷰가 **Critical 1 + Important 7**을 올렸고, **전부 계획서가 지시한 코드**였다
(구현자 이탈이 아니다). 사용자 판단으로 전부 정정. `terraform validate`가 통과한다는 것이 **IAM 그래프가 의도한 보안
정책을 표현한다는 증거가 아니라는 점**이 이번 라운드의 교훈이다 — 스키마 검증과 정책 검증은 다른 일이다.

**자격 격리**
- **(Critical) JWT 서명 키가 환경 공유였다 → staging이 prod 토큰을 위조할 수 있었다.** 코드로 확인: `ParseAccess`는
  HS256 서명 + 발급자만 검증하고(`domain/auth/token.go:47-54`) audience·환경 클레임이 없다. Terraform이 `JWT_ISSUER`를
  설정하지 않아 양쪽 모두 기본값 `forin`이다. staging의 `/auth/dev`는 의도적으로 열려 있으므로 그 시크릿을 가진 쪽이
  prod 신원을 만들 수 있었다. → `jwt-signing-key-{env}` **환경별 2개**로 분리(값도 각각 생성).
  **대안(탈락)**: 토큰에 audience 클레임 추가 — 근원 차단이지만 서버 도메인 변경이라 9-A 범위를 넘는다. 키 분리가
  압도적으로 짧고 앱 변경이 없다.
- **배포 SA가 프로젝트 전역 `secretmanager.secretAccessor`** 였다(주석은 "staging 스모크 시크릿 하나"라고 적혀 있었는데
  11개 전부 읽었다) → `dev-auth-secret-staging` **하나에만** 시크릿 단위 바인딩.
- **배포 SA가 프로젝트 전역 `iam.serviceAccountUser`** 였다. `run.developer`와 결합하면 **아무 서비스 계정으로든** Cloud Run을
  띄울 수 있고, 기본 컴퓨트 SA는 흔히 `roles/editor`를 가지므로 "API 배포"가 "프로젝트 편집자로 임의 코드 실행"이 된다
  → 런타임 SA 2개에만 스코프.

**apply가 실제로 성공하게** (계획서가 틀렸던 부분)
- `:bootstrap` 태그 이미지는 존재하지 않는데 `google_cloud_run_v2_service`는 생성 시 Ready를 기다린다 → **apply가 실패한다.**
  계획서의 "리비전이 뜨지 않는다 — 정상이다"는 사실과 달랐다. → 초기 이미지를 Cloud Run 헬로 이미지로. `ignore_changes`가
  이미 이미지를 무시하므로 CI가 올린 다이제스트는 되돌아가지 않는다.
- 시크릿이 `version = "latest"`인데 `make secrets`가 apply **뒤**였다 → 버전 0개로 리비전 생성 실패. → **두 단계 apply**:
  시크릿 컨테이너만 먼저(`-target`) → `make secrets` → 전체 apply. README 순서 정정.
- `sts.googleapis.com` 미활성 → WIF 토큰 교환 실패. 활성 API 집합에 추가.

**prod가 실제로 동작하게** (기능 공백)
- **소셜 클라이언트 ID 3종을 아무도 주지 않아 prod에 로그인 경로가 0개였다.** `verifierFor`는 목록이 비면
  `provider not configured`로 거부하고(`adapters/auth/oidc_verifier.go:74-76`) `audienceAllowed`는 빈 허용목록에 아무것도
  통과시키지 않는다. `/auth/dev`가 prod에 없으므로 인증 수단이 하나도 없는 상태로 뜰 예정이었다. → 평문 env로 주입하고
  **기본값 없는 필수 tfvar**로 둔다(fail-closed: 값이 없으면 apply가 멈추는 게 로그인 불가 배포보다 낫다).
- `AZURE_SPEECH_REGION` 미설정 → 발음 평가 오류. 이건 앱이 "비면 엔드포인트 비활성"으로 우아하게 강등하므로 기본값 `""` 허용.

**DB 자격**
- `DATABASE_URL`이 비밀번호를 보간해 Cloud Run 설정에 **평문**으로 남았다(`run.viewer`면 읽힌다). 동시에 `db-password-{env}`
  시크릿과 그 IAM 바인딩은 **아무도 읽지 않는 장식**이었다 — 보안 태세가 실제보다 튼튼해 보이게 만드는 종류의 결함이다.
  → 시크릿 슬롯을 `database-url-{env}`로 바꿔 **URL 전체**를 시크릿에 넣고 서비스·Job 양쪽이 `secret_key_ref`로 받는다.
  앱은 `DATABASE_URL` 하나만 읽으므로 앱 변경이 없다. `random_password`가 state에 남는 것은 피할 수 없지만 Cloud Run
  설정에서의 노출은 없앨 수 있다.
