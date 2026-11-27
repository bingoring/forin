---
build-spec: home-colleagues
artifact: business-rules
updated: 2026-08-10
---

# Business Rules — 홈 탭 · 동료 시스템

엔티티 정의는 [domain-entities](domain-entities.md). 여기서는 **불변식·검증·권한·엣지케이스**만 다룬다.

## 1. 규칙 표 (Rules)

| ID | 규칙 | 근거 |
|---|---|---|
| R-1 | 초대 코드는 **7일** 유효, **최대 10명**이 사용 | 핸드오프 `ScreenColleagueAdd` "7일간 유효 · 최대 10명" |
| R-2 | 한 사용자의 **활성 코드는 1개**. 재발급하면 이전 코드는 `revoked_at` | 코드가 여러 개면 "내 코드"가 모호해짐 |
| R-3 | 자기 코드로는 자기를 추가할 수 없다 | 자기 자신과의 동료 관계는 무의미 |
| R-4 | 이미 연결된 상대에게 다시 요청할 수 없다 | 중복 링크 방지 |
| R-5 | 대기 중 요청은 (from,to) 쌍당 **1건** | 부분 유니크 인덱스로 강제 |
| R-6 | **역방향 대기 요청이 있으면 즉시 수락 처리** (A→B 대기 중 B→A 요청 = 서로 원함) | 사용자에게 "왜 안 맺어지지" 혼란 방지 |
| R-7 | 응원 메시지는 **60자 이하**, 프리셋은 서버 소유 집합 | 핸드오프 `24 / 60` 카운터 |
| R-8 | 응원은 **연결된 동료에게만** 보낼 수 있다 | 스팸 방지 |
| R-9 | 응원 전송은 상대당 **1일 5건**까지 | 알림 폭탄 방지 (신규 — SoT에 없음, §deviation) |
| R-10 | `share_status=false`면 "지금 학습 중"·온라인 점을 **응답에서 제외** | 핸드오프 "공개 범위는 언제든 설정에서" |
| R-11 | `share_weekly=false`면 주간 그래프를 응답에서 제외 | 위와 동일 |
| R-12 | 홈 모듈은 **데이터가 없으면 렌더하지 않는다** | 더미 금지 원칙 |
| R-13 | 동료 수 상한 **50명** | 목록 화면이 페이징 없이 견디는 한계 |

## 2. 검증 규칙 (Validation)

| 입력 | 규칙 | 실패 시 |
|---|---|---|
| 초대 코드 | 정규화 후 `^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{2}-[…]{4}$` | 400 `invalid code format` |
| 초대 코드 조회 | 존재 · 미폐기 · 미만료 · `uses < max_uses` | 404 `code not found or expired` |
| `relation` | `AllowedRelations`에 존재 | 400 `unknown relation` |
| 응원 `preset` | 서버 프리셋 맵에 존재하거나 빈 문자열 | 400 `unknown preset` |
| 응원 `message` | rune 길이 ≤ 60 (바이트 아님 — 한글) | 400 `message too long` |
| 응원 `preset`+`message` | 둘 다 비면 거부 | 400 `empty cheer` |
| 요청 수락/거절 | 요청의 `to_user_id` == 호출자 | 403 |

**정규화**: 코드 입력은 대소문자 무시, 하이픈·공백 제거 후 재삽입. `O→0`이 아니라
**혼동 문자를 애초에 알파벳에서 뺐으므로** 치환 매핑은 두지 않는다(잘못 친 건 잘못 친 것).

## 3. 권한 / 접근 규칙 (Authz)

| 리소스 | 규칙 |
|---|---|
| `GET /me/home` | 본인만 |
| `GET /me/colleagues` | 본인의 링크만 |
| `GET /colleagues/{id}` | **연결된 상대만** 조회 가능. 아니면 404(403이 아니라 404 — 존재 여부 노출 금지) |
| `POST /colleagues/cheers` | 연결된 상대에게만 (R-8) |
| 코드 조회 `GET /invite/{code}` | 인증 필요. 반환은 **표시 최소 정보**(이름·국기·레벨·연속)만 |

> **404 vs 403.** 남의 프로필을 403으로 답하면 "그 사용자는 존재한다"가 새어 나간다.
> 연결되지 않은 상대는 **없는 것처럼** 404로 답한다.

## 4. 불변식 (Invariants)

- **INV-1** `colleague_links`는 항상 **쌍으로 존재**한다. `(a,b)`가 있으면 `(b,a)`도 있다.
- **INV-2** 링크 생성·삭제는 **한 트랜잭션**에서 두 행을 함께. 부분 상태는 존재할 수 없다.
- **INV-3** `MirrorRelation[rel]`이 반대편 행의 relation이다. peer↔peer, mentor↔mentee.
- **INV-4** `invite_codes.uses ≤ max_uses`. 증가는 요청 생성과 같은 트랜잭션에서.
- **INV-5** 사용자당 `revoked_at IS NULL`인 코드는 최대 1개.
- **INV-6** `cheers.message`는 저장 시점에 이미 60 rune 이하 — DB는 신뢰하고 렌더한다.

## 5. 엣지케이스 · 에러 매핑

| 상황 | 처리 |
|---|---|
| 커리큘럼을 다 끝냄 → `TodayOne` 없음 | 홈은 **완료 상태(`ScreenHomeDone`) 🌙 카드**로 전환 |
| 신규 가입 첫날 → 연속 0, 활동일 0 | StreakStrip은 렌더하되 0/빈 블록. 숨기지 않음(성장의 시작점) |
| 복습 카드 없음 | `OneReview` 모듈 숨김 (R-12) |
| 동료 0명 | `PeerTicker` 자리에 **"코드로 동료를 추가해보세요" 빈 상태 + `+ 추가`** |
| 콘텐츠 풀 소진(멘토 쪽지가 부서에 없음) | 공통(`dept: ''`) 풀로 폴백. 그것도 없으면 모듈 숨김 |
| 상대가 탈퇴 | `ON DELETE CASCADE`로 링크·응원 동반 삭제 |
| 코드 만료 후 입력 | 404 + "코드가 만료됐어요. 새 코드를 받아주세요" |
| 이미 요청 보낸 상대 | 200 + `alreadyRequested: true` (에러가 아니라 상태) |
| 상대가 나에게 이미 요청함 | **즉시 연결**(R-6) + `autoAccepted: true` |
| 동료 50명 초과 | 400 `colleague limit reached` |
| 응원 1일 한도 초과 | 429 `cheer limit reached` |
| `share_status=false`인 동료 | 목록에 남되 현황 줄은 "학습 현황 비공개" |
