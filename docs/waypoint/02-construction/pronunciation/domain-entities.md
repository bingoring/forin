---
build-spec: pronunciation
artifact: domain-entities
updated: 2026-08-15
---

# Domain & Entities — 발음·스피킹 피드백

인덱스: [`./build-spec-index.md`](./build-spec-index.md)

## 1. 엔티티 개요

| 엔티티 | 무엇 | 영속 |
|---|---|---|
| `SpeechAttempt` | 한 번의 발화 시도와 그 채점 결과 | `speech_attempts` (append-only) |
| `PhonemeScore` | 시도에서 관측된 음소별 정확도 (드릴의 재료) | `speech_phoneme_scores` |
| `SentenceReference` | 문장의 **정준** 음절·음소·IPA (녹음 전에 보여줄 것) | `speech_references` (캐시) |
| `PronunciationResult` | 채점기 반환값 (포트 타입, 비영속) | — |

## 2. 엔티티 상세

### `SpeechAttempt`

```go
// SpeechAttempt is one spoken try at one sentence, with its scores. Append-only:
// the 1st/2nd/3rd try each get a row so the practice screen can show progress.
type SpeechAttempt struct {
    ID           string    `json:"id"`
    UserID       string    `json:"-"`
    SentenceKey  string    `json:"sentenceKey"`
    ReferenceText string   `json:"referenceText"`
    Locale       string    `json:"locale"`
    AttemptNo    int       `json:"attemptNo"`    // 1-based, per (user, sentenceKey)
    Recognized   string    `json:"recognized"`   // what Azure heard
    Overall      float64   `json:"overall"`
    Accuracy     float64   `json:"accuracy"`
    Fluency      float64   `json:"fluency"`
    Completeness float64   `json:"completeness"`
    Prosody      float64   `json:"prosody"`      // 억양 — SoT L160 세 번째 지표
    ProsodyOK    bool      `json:"prosodyAvailable"` // 아래 주석 참조
    DurationMS   int       `json:"durationMs"`   // 내 발음 길이 (SoT L193 "2.9초 · 조금 느려요")
    Words        []WordResult `json:"words"`     // JSONB
    ScenarioID   string    `json:"scenarioId,omitempty"`
    ReviewCardID *string   `json:"reviewCardId,omitempty"` // nullable — 드릴 발화는 카드가 없다
    Origin       string    `json:"origin"`       // allowed-set §4
    CreatedAt    time.Time `json:"createdAt"`
}
```

- `Words`는 JSONB 한 컬럼. 음절·음소는 **표시용**이라 조회 시 통째로 읽고, 집계는 아래 `PhonemeScore`가 맡는다
  (JSONB를 집계하면 드릴 화면이 느려진다).
- **`ProsodyOK`가 따로 있는 이유**: 억양 점수는 Azure에 `EnableProsodyAssessment`를 켜야 오고, **로케일에 따라
  아예 오지 않는다**. 그때 `Prosody`는 0인데, 이걸 그대로 그리면 화면이 **"억양 0점"이라는 거짓**을 말한다.
  `ProsodyOK=false`면 UI는 억양 행 자체를 숨긴다(3지표 → 2지표). DB에서는 `prosody`를 nullable로 두고
  `NULL ↔ ProsodyOK=false`로 매핑한다.

### `WordResult` / `SyllableResult` / `PhonemeResult`

```go
// Mirrors Azure's Phoneme-granularity shape, trimmed to what the screens render.
type WordResult struct {
    Word      string            `json:"word"`
    Accuracy  float64           `json:"accuracy"`
    ErrorType string            `json:"errorType,omitempty"` // allowed-set §4
    Syllables []SyllableResult  `json:"syllables,omitempty"`
    Phonemes  []PhonemeResult   `json:"phonemes,omitempty"`
}

type SyllableResult struct {
    Syllable string  `json:"syllable"` // SoT L148 칩 라벨: "cet", "min", "li"
    Grapheme string  `json:"grapheme,omitempty"`
    Accuracy float64 `json:"accuracy"`
}

type PhonemeResult struct {
    Phoneme  string  `json:"phoneme"`  // Azure IPA 표기, 예 "ɪ"
    Accuracy float64 `json:"accuracy"`
}
```

### `PhonemeScore`

```go
// One row per (user, phoneme, attempt) so the drill can aggregate over a window
// ("지난 2주간 자주 틀린 음소" — SoT L227) without scanning JSONB.
type PhonemeScore struct {
    AttemptID string
    UserID    string
    Phoneme   string
    Accuracy  float64
    CreatedAt time.Time
}
```

### `SentenceReference`

```go
// The canonical syllable/phoneme breakdown of a sentence, derived once and cached.
// Needed because the practice screen shows IPA BEFORE any recording exists.
type SentenceReference struct {
    SentenceKey   string         `json:"sentenceKey"`
    ReferenceText string         `json:"referenceText"`
    Locale        string         `json:"locale"`
    IPA           string         `json:"ipa"`   // SoT L78 한 줄 표기
    Words         []WordResult   `json:"words"` // accuracy는 의미 없음(정준) — 음절 분절만 쓴다
    DurationMS    int            `json:"durationMs"` // 원어민 길이 (SoT L188 "2.1초")
    CreatedAt     time.Time      `json:"-"`
}
```

## 3. 관계 (Relationships)

```
users 1 ──< speech_attempts >── 0..1 review_cards
                  │
                  └──< speech_phoneme_scores

speech_references : sentence_key 로만 식별 (사용자 무관, 전역 캐시)
```

- **`review_card_id`는 nullable이다.** 이것이 `review_cards` 확장 대신 독립 테이블을 고른 이유다: 최소대립쌍
  (`sit`/`seat`)과 현장 적용 문장(SoT L261)은 교정에서 나온 카드가 없다.
- `review_cards` 삭제 시 시도는 남는다 → `ON DELETE SET NULL`. 발음 이력은 카드의 부속물이 아니다.
- `users` 삭제 시 시도·음소는 함께 삭제 → `ON DELETE CASCADE` (기존 `review_cards` 규약과 동일).

## 4. 열거형 / Allowed-set

프로젝트 규약대로 **DB CHECK가 아니라 코드측 허용집합**으로 둔다 — 값이 늘 때 마이그레이션을 강제하지 않기 위해서다.

| 필드 | 허용값 | 확장 여지 |
|---|---|---|
| `SpeechAttempt.Origin` | `dialogue` · `review` · `drill` · `freeform` | 진입점이 늘면 추가. 드릴은 이번 범위 밖이지만 값은 지금 정의해 둔다 |
| `WordResult.ErrorType` | `None` · `Omission` · `Insertion` · `Mispronunciation` · `UnexpectedBreak` · `MissingBreak` · `Monotone` | Azure가 정의. 모르는 값이 오면 **그대로 보존**하고 UI는 중립 처리 |
| 음절 밴드 (표시) | `ok` ≥ 80 · `weak` 60–79 · `bad` < 60 | SoT L149 `col()`의 3색과 1:1. 경계는 [business-rules §1](./business-rules.md) |

## 5. SoT 매핑 (SoT → 타입)

| SoT | 위치 | 타입 |
|---|---|---|
| 총점 `81` | L155 | `SpeechAttempt.Overall` |
| 정확도 / 유창성 / **억양** | L160 | `.Accuracy` / `.Fluency` / `.Prosody` |
| 음절 칩 `[["I'm",'ok'],['cet','weak'],['min','bad']…]` | L148 | `WordResult.Syllables[]` + 밴드 규칙 |
| 교정 포인트 `min` `/ˈmɪn/` + 설명 | L199–200 | `WordResult.Phonemes[]` 최저 2개 + 음소 팁 매핑 |
| 원어민 2.1초 / 내 발음 2.9초 | L188·L193 | `SentenceReference.DurationMS` / `SpeechAttempt.DurationMS` |
| 이 문장 내 점수 1차 62 · 2차 74 · 3차 — | L95 | `ListAttemptsBySentence` (최대 3행 표시) |
| IPA 한 줄 | L78 | `SentenceReference.IPA` |
| 토큰 하이라이트 `drug`/`num` | L77 | **서버 타입 아님** — 프론트 파생([frontend-components §2](./frontend-components.md)) |
