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
- **결정:** `design-handoff_v7/` 채택(v6 대비 05_MAP + screens-explore-v2.jsx). 링크 v6→v7 재지정. v7은 캠퍼스 **4종 플래그십
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
