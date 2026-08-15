---
build-spec: pronunciation
artifact: frontend-components
updated: 2026-08-15
---

# Frontend Components — 발음·스피킹 피드백

인덱스: [`./build-spec-index.md`](./build-spec-index.md) · 로직: [`./business-logic-model.md`](./business-logic-model.md)

SoT: `inputs/design-handoff_v22/reference/screen-pronunciation.jsx`. 아래 라인 번호는 전부 그 파일 기준이다.

## 1. 컴포넌트 트리 (Hierarchy)

```
app/pronunciation/[sentenceKey].tsx        ← 라우트 1개, 상태 3개 (SoT의 3화면)
└── PronShell            (dark?: boolean)  ← SoT L11 Shell. 하단 62 여백 + BottomNav
    ├── PronHead         (ctx, step, dark) ← SoT L21
    ├── [idle]
    │   ├── TargetCard       ← SoT L36
    │   ├── RiskNote         ← SoT L80 (peach ⚠ 박스)
    │   ├── RecordButton     ← SoT L86 (92×92 red)
    │   └── AttemptHistory   ← SoT L93 (1차/2차/3차)
    ├── [recording]
    │   ├── TargetLine       ← SoT L115 (cream 박스, 하이라이트만)
    │   ├── WavePanel        ← SoT L121 (#0F1A24 + Wave + REC 타이머)
    │   ├── SyllableProgress ← SoT L130 (5칸 진행)
    │   └── StopButton       ← SoT L135 (84×84 cream ⏹)
    └── [result]
        ├── ScoreCard        ← SoT L153 (총점 + 4지표 바)
        ├── SyllableGrid     ← SoT L171 (3색 칩 + 범례)
        ├── WaveCompare      ← SoT L185 (원어민/내 발음 2단)
        ├── CorrectionCard×N ← SoT L197
        └── ResultActions    ← SoT L211 (다시 녹음 / 다음 문장 / 드릴)
```

공용 프리미티브는 기존 것을 쓴다: `PixelBox` · `PixelButton` · `PixelChip` · `PixelIcon`.
**신규 조각은 `src/components/pron/` 아래**에 둔다(기존 `PronunciationPractice.tsx`·`PronunciationScore.tsx`는
이 화면들로 흡수 후 제거 — 인덱스 §4).

## 2. 컴포넌트 상세

### `TargetCard`
```ts
type TargetToken = { w: string; hi?: 'drug' | 'num' };
type Props = {
  tokens: TargetToken[];
  ipa?: string;            // 없으면 그 줄을 렌더하지 않는다 (business-rules §5)
  hint: string;            // "3회 중 1회차"
  onPlayNative(): void;
  onPlaySlow(): void;      // 0.5×
  nativeAvailable: boolean;
};
```
- `hi='drug'` → `t.lilac`, `hi='num'` → `t.yellow` 배경 + `2px solid t.ink` (SoT L43).
- **토큰 분절은 서버 타입이 아니라 프론트 파생이다**([domain-entities §5](./domain-entities.md)). 규칙:
  약물명은 시나리오의 약물 어휘 목록과 매칭, 숫자+단위(`650 milligrams`, `5 mg`, `2 mL`)는 정규식.
  둘 다 아니면 `hi` 없음. **매칭이 하나도 없어도 정상**이다(하이라이트 없는 평문 문장).
- `nativeAvailable=false`면 🔊 원어민·0.5× 버튼을 비활성(참조 생성 실패 시).

### `Wave`
```ts
type Props = { bars: number[]; color: string; height?: number; live?: boolean };
```
SoT L57과 동일: 막대 폭 5, 간격 3, `Math.max(3, v*h)`, `1.5px solid t.ink`.
`live`는 녹음 중 실시간 갱신 여부. **웹의 CSS 애니메이션이 아니라 상태 갱신으로** 그린다.

### `SyllableGrid`
```ts
type Syl = { label: string; band: 'ok' | 'weak' | 'bad' };
type Props = { syllables: Syl[]; };
```
`band` → 색은 [business-logic-model §2 `SyllableBand`](./business-logic-model.md). 범례 3종은 항상 표시(SoT L177).
`syllables`가 비면(Azure가 음절을 안 준 경우, R10) **이 블록 전체를 렌더하지 않는다.**

### `CorrectionCard`
```ts
type Props = { syllable: string; ipa: string; message: string; severe: boolean; onPlay(): void };
```
`severe` → 좌측 라벨 배경 `t.red`, 아니면 `t.yellow` (SoT L202). 라벨 폭 42 고정.

### `AttemptHistory`
```ts
type Props = { attempts: { no: number; score: number | null }[] }; // 항상 길이 3
```
SoT L95: 3행 고정, 아직 없는 회차는 `—` + 빈 바. 점수 색은 `SyllableBand`와 같은 밴드.

## 3. 전역 · 공유 상태 (Shared State)

- **새 전역 스토어를 만들지 않는다.** 이 루프는 라우트 지역 상태로 끝난다.
- 라우트 파라미터: `sentenceKey`(경로) + `referenceText` · `scenarioId?` · `reviewCardId?` · `origin` · `ctx` · `step`.
  `referenceText`는 길어서 쿼리에 실린다 — **`#`가 포함되면 딥링크 파라미터가 그 지점에서 잘린다**(엘리베이터
  전환에서 이미 겪은 문제)는 점을 여기서도 적용해 인코딩한다.
- 발음 기능 비활성 플래그(business-rules §5)는 기존 프로필/설정 스토어에서 읽는다. 진입점 버튼이 이 값으로 숨는다.

## 4. 화면 상태 (Screen States)

| 상태 | 셸 | 헤더 `step` | 렌더 |
|---|---|---|---|
| `idle` | 밝음(`t.paper`) | "약물명 · 숫자 발음" | TargetCard · RiskNote · RecordButton · AttemptHistory |
| `recording` | **어두움**(`t.ink`) | "듣고 있어요…" | TargetLine · WavePanel · SyllableProgress · StopButton |
| `scoring` | 어두움 유지 | "채점 중…" | WavePanel(정지된 파형) + 진행 표시. **취소 불가**(로직 §3) |
| `result` | 밝음 | "발음 채점" | ScoreCard · SyllableGrid · WaveCompare · CorrectionCard×N · ResultActions |
| `permissionDenied` | 밝음 | "마이크 권한이 필요해요" | 안내 + 설정 열기. RecordButton 비활성 |
| `noSpeech` | 밝음 | idle과 동일 | idle + 상단에 안내 배너(엣지케이스 표의 문구) |

`scoring`은 SoT에 없는 상태다 — **의도적 추가**이며 §7 편차 로그에 기록한다. SoT는 정적 목업이라 네트워크
대기 상태가 없지만, 실제로는 녹음 정지와 결과 사이에 왕복이 있고 그동안 화면이 비면 안 된다.

## 5. 상호작용 · 네비게이션

| 트리거 | 동작 |
|---|---|
| `dialogue/[id]`의 🎤 직접 말하기 (04_SCREENS.md:324) | `push('/pronunciation/[key]')`, `origin='dialogue'` + `scenarioId` |
| 리뷰랩 PhraseCard의 🎤 따라 말하기 | 같은 라우트, `origin='review'` + `reviewCardId` |
| ‹ 뒤로 (SoT L26) | `router.back()`. `recording` 중이면 녹음을 먼저 정지·폐기 |
| 🎙 다시 녹음 | `result` → `recording`. 이력은 다음 시도 번호로 쌓인다 |
| 다음 문장 › | 호출자가 넘긴 목록의 다음 문장으로 `replace` (스택을 쌓지 않는다) |
| 🎯 약한 음소만 드릴하기 | **비활성**(범위 밖). 렌더는 하되 눌리지 않는다 — 로직 §1 참조 |

## 6. 디자인 SoT 매핑 (디자인 요소 → 컴포넌트)

| SoT 라인 | 요소 | 컴포넌트 | 비고 |
|---|---|---|---|
| L14–18 | Shell (bottom 62, BottomNav active="campus") | `PronShell` | 하단 탭 유지 |
| L26 | ‹ 뒤로 칩 | `PronHead` | dark일 때 배경 `t.cream` |
| L28 | 🎙 발음 배지 (mint + mintShadow) | `PronHead` | |
| L40 | "따라 말해보세요" 라벨 (top: -9) | `TargetCard` | 박스 밖으로 튀어나온 라벨 |
| L46 | IPA 줄 (letterSpacing .3) | `TargetCard` | 없으면 숨김 |
| L68 | `W1` 진폭 상수 20개 | — | **목업 데이터. 실제 진폭으로 대체** |
| L88 | 녹음 버튼 92×92 red, shadow 5 | `RecordButton` | |
| L124–127 | REC 점 + 타이머 + 남은 초 | `WavePanel` | 10초 기준 |
| L155 | 총점 34px | `ScoreCard` | |
| L160 | 정확도·유창성·**억양** 3행 | `ScoreBars` | 억양은 신규 서버 필드 |
| L174 | 음절 칩 flexWrap | `SyllableGrid` | |
| L187–195 | 원어민/내 발음 2단 + 길이 문구 | `WaveCompare` | "조금 느려요"는 길이 비교에서 파생 |
| L215 | 🎯 약한 음소만 드릴하기 (lilac) | `ResultActions` | 비활성 |
