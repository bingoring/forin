---
build-spec: home-colleagues
artifact: business-logic-model
updated: 2026-08-10
---

# Business Logic Model — 홈 탭 · 동료 시스템

규칙은 [business-rules](business-rules.md), 타입은 [domain-entities](domain-entities.md).

## 1. 주요 워크플로 (Workflows)

### `LoadHome` — 홈 한 번에 조립

`GET /me/home` **단일 엔드포인트**로 홈 전체를 내려준다. 모듈이 10개인데 각자 호출하면
앱 진입에 10 왕복이 걸린다 — 앱의 **첫 화면**이므로 이건 그대로 체감 지연이 된다.

```
GET /me/home?tz=Asia/Seoul&date=2026-08-10
  1. 로컬 날짜 확정 (기기 tz — 기존 /me/stats와 같은 버킷팅 규칙)
  2. 병렬 조회
       progress          → streak, xp, level, 평판
       stats(activeDates)→ 주간 리듬 7블록
       curriculum        → 다음 스텝 (없으면 done=true)
       review due(1)     → OneReview
       daily board       → 남은 상황 수
       colleagues(4) + presence + 미읽음 응원 수
  3. 파생
       shift  = deriveShift(userID, 로컬날짜, 현재 스텝의 부서)
       mentor = pickDaily(mentorNotes, 부서, seed)
       phrase = pickDaily(phrases,     부서, seed)
  4. presence.last_seen_at 갱신 (홈을 열었다 = 접속했다)
  5. 값 없는 모듈은 필드를 생략 → 클라이언트는 "없으면 렌더 안 함"만 지킨다
```

응답은 **모듈별 nullable 필드**를 가진 하나의 객체. 클라이언트에 조건 분기를 밀어넣지 않기
위해, 서버가 "보여줄 것"만 담아 보낸다.

### `IssueInviteCode`

```
POST /me/invite-code            (없으면 발급, 있으면 기존 것 반환)
POST /me/invite-code?rotate=1   (재발급)
  1. 활성 코드 조회 (revoked_at IS NULL AND expires_at > now AND uses < max_uses)
  2. rotate=1 이거나 활성 코드 없음 → 새 코드 생성
       - 알파벳 30자에서 6자 추출(crypto/rand), 'XX-XXXX' 포맷
       - 충돌 시 최대 5회 재시도 (30^6 공간에서 사실상 발생 안 함)
       - 기존 활성 코드에 revoked_at = now  (INV-5)
  3. { code, expiresAt, maxUses, uses } 반환
```

### `AddColleagueByCode` — 코드 입력 → 연결

```
POST /me/colleagues  { code }
  1. 코드 정규화·검증 (R-1)               → 실패 404
  2. owner := code.user_id
  3. owner == me                          → 400 (R-3)
  4. 이미 링크 존재                        → 200 { alreadyLinked: true }
  5. 역방향 pending 요청 있음(owner→me)    → AcceptRequest 실행 후 200 { autoAccepted: true }  (R-6)
  6. 정방향 pending 요청 있음              → 200 { alreadyRequested: true }
  7. 트랜잭션:
       requests += (me → owner, relation = code.relation, code)
       codes.uses += 1
  8. 200 { requested: true }
```

**왜 즉시 연결이 아니라 요청인가.** 코드를 아는 것만으로 상대의 학습 현황이 공개되면
코드 유출이 곧 프라이버시 사고가 된다. 핸드오프도 "상대가 수락하면 서로의 학습 현황과
응원을 주고받을 수 있어요"라고 명시한다.

### `AcceptRequest`

```
POST /me/colleague-requests/{id}/accept
  1. 요청 존재 && to_user == me && status == pending   → 아니면 403/404
  2. 양쪽 동료 수 < 50                                   → 아니면 400 (R-13)
  3. 트랜잭션:
       links += (me, from, MirrorRelation[req.relation])
       links += (from, me, req.relation)                (INV-1/2/3)
       req.status = accepted, responded_at = now
  4. 200 { colleague }
```

### `SendCheer`

```
POST /me/colleagues/{id}/cheers  { preset?, message? }
  1. 링크 존재 확인                          → 아니면 404 (R-8)
  2. preset 검증 · message rune ≤ 60 · 둘 다 빈 값 금지
  3. 오늘 그 상대에게 보낸 수 < 5             → 아니면 429 (R-9)
  4. cheers += row
  5. 201 { cheer }
```

### `UpdatePresence` — 어디서 갱신되는가

| 트리거 | 갱신 필드 |
|---|---|
| `POST /scenarios/{id}/conversation` (대화 시작) | `scenario_id`, `label`, `last_seen_at` |
| `POST /attempts` | `last_seen_at` |
| `GET /me/home` | `last_seen_at` |

별도 하트비트 엔드포인트를 두지 않는다 — 배터리·트래픽 대비 얻는 게 적고, 위 세 지점이면
"오늘 활동했나 / 방금 뭘 하고 있었나"를 충분히 답한다.

## 2. 알고리즘 (Algorithms)

### `deriveShift(userID, localDate, dept) → ShiftAssignment`

```go
seed := fnv64a(userID + "|" + localDate.Format("2006-01-02"))
shift := []string{"DAY", "EVENING"}[seed % 2]
```

- **결정적**: 같은 사용자·같은 날엔 항상 같은 값. 앱을 다시 켜도 근무가 바뀌지 않는다.
- **부서는 시드로 뽑지 않는다.** 커리큘럼의 현재 스텝이 속한 부서를 그대로 쓴다 —
  "오늘 배치"가 오늘 할 학습과 어긋나면 세계관이 무너진다.

### `pickDaily(pool, dept, seed) → item`

```
후보 = pool 중 dept 일치      (없으면 dept == '' 공통 풀)
후보 비면 → nil (모듈 숨김)
index = fnv64a(userID|localDate|poolName) % len(후보)
```

같은 날 같은 사용자에게 항상 같은 항목. 날이 바뀌면 바뀐다. **최근 N일 반복 회피는 두지
않는다** — 풀이 충분히 크면 불필요하고, 상태를 저장해야 해서 비용이 크다.

### `weekRhythm(activeDates, localDate) → [7]int`

핸드오프 `week = [1,1,1,0,1,1,2]`: `0` 미학습 · `1` 학습 · `2` 오늘.
월요일 시작(기존 `/me/stats`의 `activeDates`가 이미 월요일 시작 주간).

## 3. 상태 전이 (State Transitions)

### `ColleagueRequest`

```
        ┌──────────┐  accept  ┌──────────┐
   ───▶ │ pending  │─────────▶│ accepted │ (링크 2행 생성)
        └────┬─────┘          └──────────┘
             │ decline  ┌──────────┐
             ├─────────▶│ declined │
             │          └──────────┘
             │ cancel(발신자)  ┌───────────┐
             └───────────────▶│ cancelled │
                              └───────────┘
```

`accepted`/`declined`/`cancelled`는 **종단 상태** — 되돌리려면 새 요청을 만든다.

### 홈 화면 상태

```
   커리큘럼 다음 스텝 있음 ──▶ ScreenHome     (TodayOne 히어로)
   없음(오늘 목표 달성)   ──▶ ScreenHomeDone (🌙 카드 + '+ 한 판 더 하기')
```

## 4. 시퀀스 / 상호작용 (Sequence)

```
앱 시작
  └─ RootLayout: 세션 복원
       └─ (tabs)/index = 홈  ── GET /me/home ──▶ 서버
                                                 ├ progress/stats/curriculum/review/board 병렬
                                                 ├ colleagues + presence
                                                 └ shift/mentor/phrase 파생
       ◀── HomeResponse (모듈별 nullable) ────────┘
  홈 렌더 (있는 모듈만)

동료 추가
  프로필 탭 › 동료 카드 › + 추가
    └─ POST /me/invite-code (내 코드 표시)
    └─ 코드 입력 ─ GET /invite/{code} ─▶ 미리보기(이름·국기·레벨·연속)
                 └ POST /me/colleagues ─▶ 요청 생성 (또는 자동 수락)

응원
  홈 PeerTicker 👏 ─┬─ 프리셋 즉시 전송 (탭 1회)
                    └─ 길게/상세 ─▶ ScreenCheerCompose (프리셋 + 60자)
```

## 5. 통합 지점 (Integration Points)

| 기존 시스템 | 어떻게 붙나 |
|---|---|
| `/me/curriculum` | `TodayOne` + 근무 배지의 부서. **재구현 금지**, 그대로 호출 |
| `/me/stats` | 주간 리듬. `activeDates` 규칙(월요일 시작·기기 tz) 그대로 |
| `/me/review` | `OneReview` — 첫 카드 1건만 |
| `/me/daily-board` | `Doors` 잔여 상황 수 |
| 뱃지 카탈로그 (모바일 `data/badges`) | `NextBadge` 진행률. **서버로 옮기지 않는다** — 이미 클라이언트 SoT |
| `contentfile` 어댑터 | 멘토 쪽지·표현 풀 로딩 (기존 콘텐츠 로더 재사용) |
| 대화 엔진 | 시작 시 presence 갱신 (1줄 훅) |
