---
build-spec: pronunciation
artifact: business-logic-model
updated: 2026-08-15
---

# Business Logic Model — 발음·스피킹 피드백

인덱스: [`./build-spec-index.md`](./build-spec-index.md) · 규칙: [`./business-rules.md`](./business-rules.md)

## 1. 주요 워크플로 (Workflows)

### `PracticeLoop` — 연습 대기 → 녹음 → 채점 결과

```
[진입]  dialogue의 🎤 직접 말하기  또는  리뷰랩 PhraseCard의 🎤 따라 말하기
   │      params: referenceText, scenarioId?, reviewCardId?, origin
   ▼
① 연습 대기   GET /speech/reference?text=…   → IPA·음절·원어민 길이 (없으면 그 줄만 숨김, R-엣지)
              GET /speech/attempts?key=…     → 1차/2차/3차 (최근 3, R3)
   │  [녹음 버튼]
   ▼
② 녹음 중     로컬만. 10초 카운트다운(R6), 진폭 배열 수집, 음절 진행 칩
   │  [정지] 또는 [10초 자동 종료]
   ▼
   POST /pronunciation  (audio, referenceText, scenarioId?, reviewCardId?, origin)
   │        서버: Assess → 저장(시도+음소, 한 트랜잭션 I2) → attemptNo 채번(I5)
   ▼
③ 채점 결과   총점·4지표 · 음절 그리드 · 파형 2단(원어민/내 발음) · 교정 포인트 2(R4·R5)
   │
   ├─[🎙 다시 녹음] → ②  (attemptNo 는 다음 번호로)
   ├─[다음 문장 ›]  → 호출자가 준 다음 문장으로 ①
   └─[🎯 약한 음소만 드릴하기] → **이번 범위 밖**. 버튼은 렌더하되 비활성 + 사유 툴팁
```

> 마지막 분기: SoT L215의 버튼을 **지우지 않는다.** 화면을 SoT와 1:1로 유지하되 드릴이 없는 동안은 비활성이다.
> 지웠다가 나중에 되살리면 그 사이 레이아웃이 SoT와 어긋난다.

### `ReferenceDerivation` — 정준 IPA를 얻는 법 (이 스펙의 핵심 트릭)

Azure는 **오디오가 있어야** 음소를 준다. 그런데 연습 대기 화면은 **녹음 전에** IPA를 보여준다(SoT L78).
손저작(3,200 시나리오)은 비현실적이고 지어내는 것은 금지다. 그래서:

```
GET /speech/reference?text=T
   │
   ├─ 캐시 히트(speech_references, R9) → 반환
   │
   └─ 미스:
        1. SpeechSynthesizer.Synthesize(T, locale)        → 참조 WAV        (Azure TTS)
        2. PronunciationPort.Assess(참조WAV, T, locale)    → 정준 음절·음소  (Azure 평가)
        3. 음소열 → IPA 한 줄 조립, WAV 길이 → DurationMS
        4. speech_references에 저장 → 반환
```

- 2단계는 **기계가 자기 발음을 자기 기준으로 채점**하는 것이라 점수는 의미가 없다. 우리가 쓰는 건 **분절**
  (어떤 음절/음소로 쪼개지는가)과 **길이**뿐이다. 점수 필드는 버린다.
- 문장당 평생 1회(TTS 1 + assess 1). 실패해도 채점 경로는 독립적으로 동작한다(엣지케이스 표).
- 1단계 산출물은 **원어민 오디오로도 재사용**된다 — SoT L48의 `🔊 원어민`, `0.5× 느리게`. 즉 이 워크플로는
  IPA와 재생음을 한 번에 만든다.

## 2. 알고리즘 (Algorithms)

### `SyllableBand(accuracy) → ok | weak | bad`

```
accuracy >= 80 → ok    (t.mint)
accuracy >= 60 → weak  (t.yellow)
else           → bad   (t.red)
```
R1의 수치화. SoT L149 `col()`과 1:1.

### `CorrectionPoints(words) → [2]Correction`

```
1. 모든 word의 phonemes 를 (word, phoneme, accuracy, 문장 내 순서)로 평탄화
2. accuracy 오름차순 정렬, 동점은 순서 오름차순 (R4)
3. 위에서부터 훑으며 음소 팁 매핑에 있는 것만 채택 (R5), 2개 채우면 중단
4. 각 Correction = { 음절 라벨, IPA, 한국어 팁, 밴드색 }
```
- 음절 라벨은 그 음소가 속한 **음절**을 쓴다(SoT L199의 `min`, `li`는 음소가 아니라 음절 표기다).
- 2개를 못 채우면 채운 만큼만 렌더한다(빈 카드를 만들지 않는다).

### `SentenceKey(text, locale)`

```
normalize = 양끝 공백 제거 → 연속 공백을 1칸으로 → 소문자화
key = hex(sha256(normalize(text) + "|" + locale))[:32]
```
R8. **테스트 필수**: `" I'm  Giving "` 와 `"i'm giving"` 이 같은 키, `en-US`/`en-GB`가 다른 키.

### `AttemptNo` 채번

```sql
INSERT INTO speech_attempts (..., attempt_no)
SELECT ..., COALESCE(MAX(attempt_no), 0) + 1
  FROM speech_attempts WHERE user_id = $1 AND sentence_key = $2
```
같은 트랜잭션 내 계산 — 애플리케이션 카운터를 쓰면 동시 요청이 같은 번호를 받는다(I5).

## 3. 상태 전이 (State Transitions)

화면 상태 머신(한 라우트, [frontend-components §4](./frontend-components.md)에 렌더 매핑):

```
idle ──(권한 없음)──> permissionDenied ──(허용)──> idle
  │
  └─(녹음 시작)─> recording ──(정지|10초)─> scoring ──(성공)─> result
                     │                        │
                     │                        └─(no_speech_detected|5xx)─> idle + 안내
                     └─(취소)─> idle
result ──(다시 녹음)─> recording
result ──(다음 문장)─> idle (새 sentenceKey)
```

- `scoring`은 되돌릴 수 없다(요청이 이미 나갔다). 취소 버튼을 두지 않는다.
- `recording → scoring` 전환에서 **녹음 정지와 업로드 사이에 화면이 비지 않도록** scoring도 다크 셸을 유지한다.

## 4. 시퀀스 / 상호작용 (Sequence)

```
App            API                  Azure                DB
 │  GET /speech/reference ─────────────────────────────────>│ 캐시 조회
 │                        │  (미스) Synthesize ──> TTS       │
 │                        │          Assess ─────> 평가      │
 │                        │                                 │ INSERT reference
 │  <── IPA·음절·길이 ────│                                  │
 │  GET /speech/attempts ─────────────────────────────────> │ 최근 3
 │  ── 녹음(로컬 10초) ──                                     │
 │  POST /pronunciation ─>│  Assess ────────────> 평가        │
 │                        │                          BEGIN   │
 │                        │                          INSERT attempt (attempt_no 채번)
 │                        │                          INSERT phoneme_scores ×N
 │                        │                          COMMIT   │
 │  <── result+attemptNo ─│                                  │
```

## 5. 통합 지점 (Integration Points)

| 지점 | 기존/신규 | 주의 |
|---|---|---|
| `ports.PronunciationPort.Assess` | 기존 | **granularity를 Phoneme으로 올리면 기존 호출자(있다면) 응답도 커진다.** 현재 호출자는 `domain/pronunciation` 하나뿐임을 확인하고 변경 |
| `ports.SpeechSynthesizer` | 기존 (`quiz_audio_handler.go`가 사용) | 참조 합성이 퀴즈 오디오와 같은 Azure 쿼터를 쓴다. NFR의 호출 카운터에 함께 잡힌다 |
| `domain/pronunciation` | 기존 유지 | 로케일 해석 책임은 여기 그대로. `domain/speech`가 이걸 **호출**하지 재구현하지 않는다 |
| `review_cards` | 기존 | nullable FK만 추가. 기존 스키마·쿼리 불변 |
| `packages/contract` | 기존 | 새 응답 타입 3종 → 코드젠 재실행. `deploy.yml`의 `verify` job이 드리프트를 잡는다 |
| Terraform | 기존 | 신규 시크릿·환경변수 **없음** (Azure는 이미 구성됨). 인프라 변경 0 |
