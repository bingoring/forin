---
build-spec: live-ward
stage: 02-construction/06-screens-flows
status: IMPLEMENTED
depth: comprehensive
updated: 2026-09-04
---

# Build Spec — 홈 라이브 병동 · 실시간 프레즌스

SoT: 디자인 핸드오프 **v37** — `07_NOTEBOOK_REDESIGN.md` §홈 개선안(HomeV2 · LiveWardNb) + §NbCharacter, `04_SCREENS.md` §홈 전용 라이브 모듈.

## §0. 개요 & 범위

### 왜

홈 최상단의 라이브 병동은 앱을 열자마자 "혼자가 아니다"라는 감각을 준다. 지금까지 이 병동은
프리셋 캐릭터만 순회했다. 이번 작업은 그 순회 캐릭터를 **지금 실제로 학습 중인 사용자들**로
채워, 병동을 살아 있는 공간으로 만든다.

프레즌스 인프라의 뼈대는 이미 있다. `user_presence(last_seen_at)` 테이블과 `Presences()`
조회가 v20/v21에서 만들어졌고, 그때는 "실시간 소켓 프레즌스"를 명시적으로 범위 밖으로 미뤘다
(home-colleagues §0 범위 밖). v37이 그 미룬 조각을 가져오되, 소켓이 아니라 **폴링 + TTL**로
가볍게 구현한다.

### 범위 (In)

- **NbCharacter** — 전신 2등신 순회 캐릭터. NbAvatar 레이어를 0.8배로 재사용, 아장아장 걷기.
- **LiveWardNb** — 수첩 낙서체 라이브 병동 씬. 기기 시간 3무드, 침대 3·바이탈 모니터 펄스·무드 바.
  홈 최상단에 마운트.
- **실시간 프레즌스(폴링 + TTL)** — 서버 `ward` 도메인 + Redis 저장소 + 하트비트/로스터 엔드포인트,
  모바일 `useWardPresence` 스토어, 로스터 diff에 따른 좌측 등장·우측 이탈 애니메이션.
- **옵트아웃** — 나 탭에 병동 노출 토글. 기본 공개(익명).

### 범위 밖 (Out)

- 이름·학습 시나리오 등 아바타 외 정보 노출 (익명 아바타만 — Q1).
- 프리셋 NPC 패딩 (나 + 실제 접속자만 — Q2).
- SSE·WebSocket 실시간 푸시 (폴링 + TTL로 확정 — Q3).
- 병동 내 상호작용(탭·응원·클릭). 이번엔 순수 앰비언트 연출.
- 지역·목적지별 병동 분리(샤딩/룸). 전역 단일 병동. 동접이 커지면 후속.

### 더미 금지

로스터가 비면 병동에는 **내 캐릭터만** 순회한다. 가짜 인원으로 채우지 않는다. 아바타는 각
사용자가 서버에 저장한 실제 AvatarSpec을 쓴다.

## §1. 분해 (Decomposition)

| # | 유닛 | 산출물 |
|---|---|---|
| W1 | `NbCharacter` 컴포넌트 | `mobile/src/components/nb/NbCharacter.tsx` — viewBox 64×96, 걷기/반전 |
| W2 | `LiveWardNb` 씬 | `mobile/src/components/home/LiveWardNb.tsx` — 무드·침대·모니터·순회 호스트 |
| W3 | `ward` 도메인 | `server/internal/domain/ward/` — 로스터 선정(최근 10·자기 제외·숨김 제외) |
| W4 | Redis 프레즌스 저장소 | `server/internal/adapters/redis/ward_presence.go` — zset + 아바타 캐시, TTL |
| W5 | ward 엔드포인트 | `GET /ward`(하트비트 겸 로스터) · `POST /ward/heartbeat` · `POST /ward/leave` |
| W6 | 옵트아웃 pref | 병동 노출 플래그 + 등록 단계 강제 + 나 탭 토글 |
| W7 | `useWardPresence` 스토어 | `mobile/src/lib/wardPresence.ts` — 하트비트 루프·로스터 폴링·diff |
| W8 | 홈 마운트 | `mobile/src/app/(tabs)/index.tsx` 최상단에 `LiveWardNb` |
| W9 | 계약 갱신 | `packages/contract` openapi + TS 타입 (ward 3종) |

## §2. 아티팩트 인덱스 (Manifest)

| 아티팩트 | 상태 |
|---|---|
| [business-logic-model](business-logic-model.md) — 프레즌스 생명주기·상태기계·Redis 스키마·엔드포인트 | ✅ |
| [frontend-components](frontend-components.md) — NbCharacter·LiveWardNb·useWardPresence·애니메이션 | ✅ |

## §3. 결정 (2026-09-04 확정 — 구현 착수 가능)

| ID | 질문 | 결정 |
|---|---|---|
| Q1 | 캐릭터에 무엇까지 노출 | **익명 아바타만.** 이름·시나리오 없음. 낯선 사람에게 PII를 노출하지 않으면서 "붐비는 병동" 감각은 유지 |
| Q2 | 접속자 0~소수일 때 | **나 + 실제 접속자만.** 프리셋 패딩 없음. 병동이 비면 내 캐릭터만 순회 |
| Q3 | 실시간 방식 | **폴링 + TTL.** SSE는 Cloud Run에서 연결 지속 시간만큼 과금되고 동시성 슬롯을 점유해 구조적으로 비싸다. 폴링은 짧은 버스트라 인스턴스당 더 많은 동접을 처리 |
| Q4 | "온라인" 기준 | **포그라운드(앱 활성) 전역 하트비트.** 홈을 떠나 시나리오·퀴즈에 오래 머물러도 병동에 남는다. 백그라운드/종료 시에만 이탈. 홈 화면 한정 하트비트는 몰입한 학습자가 사라지는 역효과라 배제 |
| Q5 | 인원 상한·자기 표시 | **최대 10(최근 활동 순).** 자기 자신은 로스터에서 제외하고 클라이언트가 로컬로 항상 렌더 |
| Q6 | 옵트아웃 | **기본 공개(익명), 나 탭 토글.** 서버가 하트비트 등록 단계에서 강제(숨김이면 미등록) |

## §4. 구현 체크리스트 (2단계)

**Phase 1 — 시각(모바일 전용, OTA):** ✅ 구현·배포(OTA production 승인 후)
- [x] W1 `NbCharacter` (걷기 waddle·flip, 머리=NbAvatar 레이어 0.8배)
- [x] W2 `LiveWardNb` (3무드·침대 3·모니터 펄스·무드 바, 내 캐릭터 순회)
- [x] W8 홈 최상단 마운트
- [x] tsc 0 · jest · i18n ceiling(components=0) 통과

**Phase 2 — 실시간(서버 promote + 모바일 OTA):** ✅ 핵심 구현, 스테이징 스모크 통과
- [x] W4 Redis 저장소 (zset `ward:live`, TTL evict — 아바타 캐시 없이 읽기 시점 조회)
- [x] W3 `ward` 도메인 (자기 제외·상한 10·익명 id·숨김 스킵) + 단위 테스트
- [x] W5 엔드포인트 3종 (`GET /ward` · `POST /ward/heartbeat` · `POST /ward/leave`)
- [x] W6 옵트아웃 `share_ward`(마이그 000035) + 서버 등록 강제 + **나 탭 '공개' 토글**(i18n 4개 언어)
- [x] W9 계약 갱신 (openapi + TS)
- [x] W7 `useWardRoster`/`wardPresence` (포그라운드 하트비트·홈 폴링·구독) + 테스트
- [x] LiveWardNb를 로스터에 연결 (좌측 등장·우측 이탈, 시드 산포)
- [x] Go 단위 테스트 + 모바일 885 통과 + `e2e_smoke.sh` ⑳ WARD 스테이징 통과

Phase 1·2 전부 구현·검증 완료. 서버는 prod promote 완료, 모바일은 OTA 배포.

## §5. 검증 계획

| 대상 | 방법 |
|---|---|
| 로스터 선정 | Go 단위 테스트 — 최근순 상한 10, **자기 제외**, 숨김 사용자 제외, 만료 엔트리 evict |
| Redis 저장소 | miniredis(또는 페이크) — 하트비트 ZADD/SET, TTL 만료 후 로스터 부재, 아바타 MGET |
| 엔드포인트 | `GET /ward`가 하트비트를 겸하고 최근 10-자기 반환, 숨김이면 등록 안 됨, `POST /ward/leave`가 즉시 제거 |
| 상태 전이 | 포그라운드 진입=등록, 다른 화면 이동=유지(하트비트 지속), 백그라운드=하트비트 정지→TTL 만료 |
| 저하 | Redis 불가 시 로스터 빈 배열(내 캐릭터만), 홈은 정상 |
| 모바일 | NbCharacter 렌더(걷기·flip·머리 스펙), LiveWardNb 로스터 diff→등장/이탈(마운트·translateX 목표), useWardPresence(포그라운드 하트비트·홈 한정 폴링·leaving 세트 동안 노드 유지) |
| E2E | `server/scripts/e2e_smoke.sh`에 ward 왕복 추가 — 단일 사용자로 관측 가능한 계약만: 하트비트 후 `GET /ward`가 **자기 제외**라 빈 배열, 숨김 토글 시 미등록. 다중 사용자 로스터는 실 DB 수동 E2E |
| i18n | 새 컴포넌트 한국어 리터럴 0 (src/components 천장) |

## §6. NFR · 성능 (comprehensive)

| 항목 | 목표 · 근거 |
|---|---|
| 하트비트 주기 | 홈 포커스 시 `GET /ward` **6초**(로스터 겸용), 그 외 포그라운드 `POST /ward/heartbeat` **15초**. 홈에서만 잦게, 나머지는 저빈도 단발이라 배터리·트래픽 부담 최소 |
| TTL | **40초.** 하트비트 2~3회 누락을 허용. 백그라운드 후 이탈 반영은 최대 ~40초, 선택적 `leave` 비컨으로 대개 즉시 |
| 이탈 정확성 | 앱 백그라운드/종료 = 하트비트 정지 = TTL 만료. 크래시·강제 종료도 TTL이 정리하므로 유령이 남지 않음 |
| Redis 비용 | 쓰기 1회(ZADD+SET EX), 읽기 1회(evict ZREMRANGEBYSCORE + ZREVRANGE + MGET). O(log n + k), k≤10 |
| 페이로드 | 로스터 최대 10 × 아바타 스펙(수백 바이트) → 수 KB |
| Cloud Run | 폴링은 짧은 요청이라 min_instances=0 유지에 유리. 요청 사이 CPU 스로틀 |
| 프라이버시 | 익명(uid는 내부 식별자, 화면 미표시). 옵트아웃 시 서버가 등록 자체를 안 함 |

## §7. 편차 로그 (Deviations) — 구현 후

| SoT | 편차 | 사유 | 승인 |
|---|---|---|---|
| home-colleagues §6 "프레즌스 하트비트 없음" | 홈 병동에 포그라운드 하트비트 도입 | 병동은 "지금 누가 있나"를 실시간에 가깝게 보여야 함. 배터리 영향은 포그라운드 한정·저빈도로 제한 | 승인(Q4) |
| home-colleagues 프레즌스=동료 상호수락 전제 공개 | 병동은 낯선 사람에게 익명 공개 | 새 정책. 옵트아웃 토글 제공으로 상쇄 | 승인(Q1/Q6) |
| v37 04_SCREENS "순회 간호사 스프라이트" | NbCharacter(수첩 낙서체)로 렌더 | 홈은 노트북 라인이라 픽셀 스프라이트 금지. 07이 NbCharacter로 이미 해결 | 승인 |
| (제안 시) SSE 실시간 | 폴링 + TTL로 변경 | Cloud Run 과금 구조상 SSE가 구조적으로 비쌈. 이탈 수십 초 지연은 수용 | 승인(Q3) |
