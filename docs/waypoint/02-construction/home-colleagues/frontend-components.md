---
build-spec: home-colleagues
artifact: frontend-components
updated: 2026-08-10
---

# Frontend Components — 홈 탭 · 동료 시스템

SoT: `design-handoff_v21/reference/screen-home.jsx`, `screen-colleagues.jsx`.
디자인 토큰은 기존 `theme/tokens.ts`가 이미 1:1이므로 **새 토큰을 만들지 않는다**.

## 1. 컴포넌트 트리 (Hierarchy)

```
app/(tabs)/_layout.tsx           ← 탭 5개로 확장, 홈이 최좌측 + 기본 진입
└── app/(tabs)/index.tsx         ← 홈 (신규, 기존 진입 게이트는 아래 §5 참조)
    ├── Greeting                 날짜 · 인사말 · 내 SmoothSprite
    ├── ShiftBadge               DAY/EVENING · 배치 부서 · 날씨
    ├── StreakStrip              🔥 연속 + 주간 7블록
    ├── TodayOne | RestCard      다음 스텝 히어로 ↔ 🌙 완료 카드
    ├── MentorNote               NPC 스프라이트 + 한 줄
    ├── PhraseOfDay              뒤집기 카드
    ├── Doors                    둘러보기 / 오늘의 상황
    ├── NextBadge                마일스톤 진행바
    ├── OneReview                어제 틀린 표현 1개
    └── ColleagueStrip           동료 활동 + 👏 (구 PeerTicker)

app/colleagues/index.tsx         동료 목록
app/colleagues/add.tsx           코드로 추가
app/colleagues/[id].tsx          동료 프로필
components/CheerSheet.tsx        응원 보내기 바텀시트
app/(tabs)/me.tsx                ← 🤝 내 동료 카드 추가 (관리 소유권)
```

## 2. 컴포넌트 상세

### `ShiftBadge`
```ts
props: { shift: 'DAY' | 'EVENING'; deptLabel: string; weather?: string }
```
잉크 배경(`colors.ink`) + 민트 칩 + 크림 텍스트. 핸드오프에서 **유일하게 어두운 카드**라
시선이 여기서 한 번 끊긴다 — 그 대비를 유지한다. `weather` 없으면 그 자리를 비운다.

### `StreakStrip`
```ts
props: { streak: number; week: (0 | 1 | 2)[] }   // 길이 7, 월요일 시작
```
블록 색: `2`→`yellow`, `1`→`mint`, `0`→흰색 + 흐린 테두리(`ink44`).

### `TodayOne`
```ts
props: { chapter: string; title: string; meta: string; icon: string; onStart: () => void }
```
민트 배경 + `mintShadow` 하드 그림자 + 상단에 잉크 라벨 탭("오늘의 한 가지").
**화면에서 가장 큰 요소** — 이 우위가 홈의 존재 이유다. 다른 카드가 커지면 안 된다.

### `RestCard` (완료 상태)
```ts
props: { streakNext: number; onMore: () => void }
```
"여기서 멈춰도 괜찮아요" — **재촉하지 않는다**. `+ 한 판 더 하기`는 부차적 스타일(흰 배경).

### `PhraseOfDay`
```ts
props: { en: string; ko: string; note?: string }
state: flipped: boolean          // 탭하면 뜻 공개
```
기본은 영어만. 탭 → 한국어+용례. 핸드오프의 "탭하면 뜻 보기" 힌트 유지.

### `ColleagueStrip` (구 PeerTicker)
```ts
props: {
  colleagues: { id, name, flag, activity, activeToday, relation }[];  // 최대 3행
  total: number;
  onOpenProfile: () => void;      // '프로필 ›'
  onAdd: () => void;              // '+ 추가'
  onCheer: (id) => void;          // 👏
}
```
동료 0명이면 행 대신 **빈 상태**("코드로 동료를 추가해보세요") + `+ 추가`.

### `RelTag`
```ts
props: { relation: 'peer' | 'mentor' | 'mentee' }
```
`REL` 맵을 그대로 이식: peer 🤝 민트 · mentor ⭐ 옐로우 · mentee 🌱 블루.
**멘토/멘티도 지금 구현**한다 — 화면을 나중에 고치지 않기 위해서(핸드오프 확장성 의도).
멘토 행은 `Lv.` 접두사를 붙이지 않는다(`p.rel === 'mentor' ? p.lv : 'Lv.'+p.lv`).

### `CheerSheet`
```ts
props: { colleague; onSend: (preset?, message?) => Promise<void>; onClose: () => void }
state: { preset?: CheerPreset; message: string }   // 60자 카운터
```

## 3. 전역 · 공유 상태 (Shared State)

새 전역 스토어를 만들지 않는다. 홈은 `useFocusEffect` + 로컬 상태로 `GET /me/home` 1회 —
기존 `campus.tsx`/`me.tsx`와 같은 패턴.

동료 목록만 `colleagues` 화면 간(목록↔상세↔추가) 공유가 필요한데, **화면 진입마다 재조회**로
해결한다(목록이 50건 상한이라 비용이 작고, 응원 후 즉시 반영이 자연스럽다).

## 4. 화면 상태 (Screen States)

| 화면 | 상태 |
|---|---|
| 홈 | `loading` / `ok(pending)` / `ok(done)` / `error` |
| 동료 목록 | `loading` / `empty(0명)` / `ok` / `error` |
| 코드 추가 | `idle` / `looking-up` / `found` / `not-found` / `sent` |
| 동료 상세 | `loading` / `ok` / `ok(비공개)` / `error` |
| 응원 시트 | `idle` / `sending` / `sent` |

## 5. 상호작용 · 네비게이션

**탭 구성 변경** — 현재 4탭(커리어/상황판/리뷰랩/프로필) → **5탭, 홈이 최좌측**.
핸드오프: "The app's **first screen after launch** and the left-most tab."

```
app/(tabs)/index.tsx   홈      🏠   ← 기본 진입
app/(tabs)/campus.tsx  커리어
app/(tabs)/board.tsx   상황판
app/(tabs)/lab.tsx     리뷰랩
app/(tabs)/me.tsx      프로필
```

> ⚠️ **주의**: 현재 `app/index.tsx`가 **인증 진입 게이트**다(미인증 → 온보딩). 탭의
> `index`와 이름이 겹치지 않게, 게이트는 그대로 두고 탭 홈만 `(tabs)/index.tsx`로 추가한다.

| 인터랙션 | 목적지 |
|---|---|
| `TodayOne` ▶ 시작하기 | 기존 커리큘럼 스텝 라우팅 재사용 (브리핑/퀴즈) |
| `Doors` 둘러보기 | 커리어 탭 (건물·층) |
| `Doors` 오늘의 상황 | 상황판 탭 |
| `OneReview` › | 리뷰랩 탭 (해당 카드) |
| `ColleagueStrip` 프로필 › | 프로필 탭 동료 카드 |
| `ColleagueStrip` + 추가 | `/colleagues/add` |
| `ColleagueStrip` 👏 | 프리셋 즉시 전송 (시트 없이) |
| 동료 행 탭 | `/colleagues/[id]` |
| 동료 상세 👏 응원 보내기 | `CheerSheet` |
| 동료 상세 ⚔ 대결 | §build-spec-index §3 Q4 (미해결) |

## 6. 디자인 SoT 매핑

| 핸드오프 | 구현 |
|---|---|
| 하드 그림자 `3px 3px 0 0` | 기존 `Shadowed` 헬퍼 (blur 0) |
| 3px 잉크 테두리 · radius 0 | 기존 픽셀 박스 관용구 |
| `DungGeunMo` / `Galmuri11` | `fonts.heading` / `fonts.body` |
| `SmoothSprite` | 기존 `FacePlayer`/스프라이트 엔진 재사용 |
| 이모지 아이콘 (🏠🤝👏🌙) | **라인 아이콘으로 대체**(Q3 확정). `PixelIcon`에 `home`·`handshake`·`clap`·`moon`·`bulb`·`map`·`clipboard`·`shift` 추가. 국기는 이모지 유지(라인화 불가) |
