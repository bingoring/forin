# v22 발음·스피킹 피드백 루프 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 녹음 → 채점 → 음절·음소 단위 교정 → 재시도 루프를 만들고, 그 결과를 영속화해 이후 드릴·목록이 설 이력을 쌓기 시작한다.

**Architecture:** 기존 무상태 `domain/pronunciation`(로케일 해석 + Azure 위임)은 그대로 두고, 그 위에 이력·집계를 담당하는 `domain/speech`를 얹는다. Azure 어댑터는 요청 granularity를 `Word`→`Phoneme`으로 올려 음절·음소·억양을 받아온다. 모바일은 3상태를 가진 라우트 하나로 SoT의 3화면을 구현한다.

**Tech Stack:** Go stdlib `net/http` · pgx/pgxpool · **sqlc**(`db/queries/*.sql` → `internal/adapters/postgres/sqlc`) · golang-migrate(embed) · Azure Speech REST · React Native / Expo SDK 56 · expo-router · expo-audio

## Global Constraints

이 계획의 **요구사항 정본은 Build Spec**이다: `docs/dlc/projects/forin/02-construction/pronunciation/`
(index + domain-entities + business-rules + business-logic-model + frontend-components).
아래 제약은 모든 태스크에 암묵적으로 포함된다.

- **SoT는 재해석하지 않는다.** 화면은 `inputs/design-handoff_v22/reference/screen-pronunciation.jsx`에서 1:1 유도한다. 라인 번호 대응은 frontend-components §6.
- **값·규칙을 계획서에서 재발명하지 않는다.** 밴드 경계·시도 번호·엣지케이스 문구는 business-rules에 있다. 충돌하면 **Build Spec이 이긴다.**
- **오디오 원본을 저장하지 않는다.** 채점 후 폐기. 파형은 진폭 배열만.
- **없는 값을 지어내지 않는다.** 참조 IPA를 못 구하면 그 줄을 숨긴다. 억양이 없으면 억양 행을 숨긴다. 0으로 렌더하지 않는다.
- **Azure 호출은 시도당 1회.** 참조는 문장당 평생 1회(TTS 1 + assess 1). 유료 API다.
- **커밋 트레일러 금지**(`Co-Authored-By` 등), 커밋 메시지 본문은 한국어.
- 서버 테스트는 `go test ./...`, 모바일은 `npx tsc --noEmit` + `npm test`. 둘 다 그린이어야 태스크 완료.
- `speech_attempts`는 **append-only** — `UPDATE`/`DELETE` 경로를 만들지 않는다.

## File Structure

**서버 (신규)**
| 파일 | 책임 |
|---|---|
| `db/migrations/000021_speech_attempts.{up,down}.sql` | 3테이블 + 인덱스 |
| `db/queries/speech.sql` | sqlc 쿼리 소스 |
| `internal/adapters/postgres/speech_repo.go` | `ports.SpeechRepo` 구현 |
| `internal/domain/speech/speech.go` | `Record` · `History` |
| `internal/domain/speech/reference.go` | 참조(IPA) 유도 + 캐시 |
| `internal/domain/speech/key.go` | `SentenceKey` |
| `internal/adapters/http/speech_handler.go` | 이력·참조 엔드포인트 |
| `internal/content/phonemetips/tips.go` | 음소 → 한국어 교정 문구 |

**서버 (변경)**
| 파일 | 변경 |
|---|---|
| `internal/ports/ports.go` | `WordScore`에 음절·음소, `PronunciationResult`에 억양·길이, `SpeechRepo` 포트 추가 |
| `internal/adapters/azurespeech/azurespeech.go` | granularity `Phoneme`, 억양 활성화, 파싱 확장 |
| `internal/adapters/http/pronunciation_handler.go` | 채점 후 저장 연결 |
| `internal/adapters/http/router.go` | 신규 라우트 2개 |
| `cmd/api/main.go` | `domain/speech` 조립 |

**모바일 (신규)**
| 파일 | 책임 |
|---|---|
| `src/app/pronunciation/[sentenceKey].tsx` | 3상태 루프 라우트 |
| `src/components/pron/TargetCard.tsx` 등 6개 | SoT 1:1 조각 |
| `src/lib/pronTokens.ts` | 문장 → 하이라이트 토큰 분절 |

**모바일 (제거)**: `src/components/PronunciationPractice.tsx` · `src/components/PronunciationScore.tsx`

---

### Task 1: 포트 타입 확장 + Azure 어댑터 음소 granularity

**Files:**
- Modify: `server/internal/ports/ports.go:103-124`
- Modify: `server/internal/adapters/azurespeech/azurespeech.go`
- Test: `server/internal/adapters/azurespeech/azurespeech_test.go` (신규)

**Interfaces:**
- Produces: `ports.WordScore{Word, Accuracy, ErrorType, Syllables, Phonemes}` · `ports.SyllableResult` · `ports.PhonemeResult` · `ports.PronunciationResult{..., Prosody, ProsodyOK, DurationMS}` — Task 2·3·5가 그대로 쓴다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

`azurespeech_test.go`. Azure 응답 3종(음소 있음 / 음소 없음 / `NBest` 빈 배열)을 고정 JSON으로 두고 파서만 검증한다. HTTP는 타지 않는다.

```go
package azurespeech

import "testing"

const respWithPhonemes = `{"RecognitionStatus":"Success","DisplayText":"I'm giving you acetaminophen",
"NBest":[{"Display":"I'm giving you acetaminophen","AccuracyScore":84,"FluencyScore":79,
"CompletenessScore":100,"PronScore":81,"ProsodyScore":80,
"Words":[{"Word":"acetaminophen","AccuracyScore":62,"ErrorType":"None",
"Syllables":[{"Syllable":"cet","Grapheme":"cet","AccuracyScore":70},{"Syllable":"min","AccuracyScore":41}],
"Phonemes":[{"Phoneme":"s","AccuracyScore":88},{"Phoneme":"ɪ","AccuracyScore":41}]}]}]}`

const respWordOnly = `{"RecognitionStatus":"Success","DisplayText":"hello",
"NBest":[{"Display":"hello","AccuracyScore":90,"FluencyScore":88,"CompletenessScore":100,"PronScore":89,
"Words":[{"Word":"hello","AccuracyScore":90,"ErrorType":"None"}]}]}`

const respNoSpeech = `{"RecognitionStatus":"NoMatch","DisplayText":"","NBest":[]}`

func TestParsePhonemeGranularity(t *testing.T) {
	got, err := parseAssessment([]byte(respWithPhonemes))
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if got.Overall != 81 || got.Accuracy != 84 {
		t.Fatalf("scores: %+v", got)
	}
	if !got.ProsodyOK || got.Prosody != 80 {
		t.Fatalf("prosody should be present: %+v", got)
	}
	if len(got.Words) != 1 || len(got.Words[0].Syllables) != 2 || len(got.Words[0].Phonemes) != 2 {
		t.Fatalf("syllables/phonemes not parsed: %+v", got.Words)
	}
	if got.Words[0].Syllables[1].Syllable != "min" || got.Words[0].Syllables[1].Accuracy != 41 {
		t.Fatalf("syllable detail: %+v", got.Words[0].Syllables)
	}
	if got.Words[0].Phonemes[1].Phoneme != "ɪ" {
		t.Fatalf("phoneme detail: %+v", got.Words[0].Phonemes)
	}
}

// A response without Syllables/Phonemes must still parse — business-rules R10.
// Prosody must report unavailable rather than a fabricated 0.
func TestParseWordOnlyStillWorks(t *testing.T) {
	got, err := parseAssessment([]byte(respWordOnly))
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if len(got.Words) != 1 || len(got.Words[0].Syllables) != 0 {
		t.Fatalf("expected word-only: %+v", got.Words)
	}
	if got.ProsodyOK {
		t.Fatalf("prosody must be unavailable when Azure omits it, got %v", got.Prosody)
	}
}

func TestParseNoSpeechIsAnError(t *testing.T) {
	if _, err := parseAssessment([]byte(respNoSpeech)); err == nil {
		t.Fatal("empty NBest must be an error so the caller can return no_speech_detected")
	}
}
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd server && go test ./internal/adapters/azurespeech/`
Expected: FAIL — `parseAssessment` 미정의, `ProsodyOK` 필드 없음.

- [ ] **Step 3: 포트 타입을 넓힌다**

`ports.go`의 `WordScore`/`PronunciationResult`를 교체한다.

```go
// SyllableResult is one syllable of a word, as segmented by the scorer.
type SyllableResult struct {
	Syllable string  `json:"syllable"`
	Grapheme string  `json:"grapheme,omitempty"`
	Accuracy float64 `json:"accuracy"`
}

// PhonemeResult is one phoneme (IPA) and how well it was produced.
type PhonemeResult struct {
	Phoneme  string  `json:"phoneme"`
	Accuracy float64 `json:"accuracy"`
}

type WordScore struct {
	Word      string           `json:"word"`
	Accuracy  float64          `json:"accuracy"`
	ErrorType string           `json:"errorType,omitempty"`
	Syllables []SyllableResult `json:"syllables,omitempty"`
	Phonemes  []PhonemeResult  `json:"phonemes,omitempty"`
}

// PronunciationResult is the assessment of a spoken utterance vs a reference text.
type PronunciationResult struct {
	Recognized   string      `json:"recognized"`
	Accuracy     float64     `json:"accuracy"`
	Fluency      float64     `json:"fluency"`
	Completeness float64     `json:"completeness"`
	Overall      float64     `json:"overall"`
	// Prosody (억양) only arrives when EnableProsodyAssessment is on AND the
	// locale supports it. ProsodyOK distinguishes "scored 0" from "not scored" —
	// rendering an absent score as 0 would tell the learner a falsehood.
	Prosody   float64 `json:"prosody"`
	ProsodyOK bool    `json:"prosodyAvailable"`
	Words     []WordScore `json:"words,omitempty"`
}
```

- [ ] **Step 4: Azure 요청·파싱을 바꾼다**

`azurespeech.go`의 응답 구조체에 음절·음소·억양을 추가하고, 파싱을 `parseAssessment`로 분리한다(테스트가 HTTP 없이 부를 수 있어야 한다).

```go
type assessResp struct {
	RecognitionStatus string `json:"RecognitionStatus"`
	DisplayText       string `json:"DisplayText"`
	NBest             []struct {
		Display           string   `json:"Display"`
		AccuracyScore     float64  `json:"AccuracyScore"`
		FluencyScore      float64  `json:"FluencyScore"`
		CompletenessScore float64  `json:"CompletenessScore"`
		PronScore         float64  `json:"PronScore"`
		ProsodyScore      *float64 `json:"ProsodyScore"` // pointer: absent ≠ zero
		Words             []struct {
			Word          string  `json:"Word"`
			AccuracyScore float64 `json:"AccuracyScore"`
			ErrorType     string  `json:"ErrorType"`
			Syllables     []struct {
				Syllable      string  `json:"Syllable"`
				Grapheme      string  `json:"Grapheme"`
				AccuracyScore float64 `json:"AccuracyScore"`
			} `json:"Syllables"`
			Phonemes []struct {
				Phoneme       string  `json:"Phoneme"`
				AccuracyScore float64 `json:"AccuracyScore"`
			} `json:"Phonemes"`
		} `json:"Words"`
	} `json:"NBest"`
}

// ErrNoSpeech means the recognizer heard nothing usable. The caller maps this to
// 422 no_speech_detected rather than storing a meaningless attempt.
var ErrNoSpeech = errors.New("azurespeech: no speech detected")

func parseAssessment(body []byte) (*ports.PronunciationResult, error) {
	var ar assessResp
	if err := json.Unmarshal(body, &ar); err != nil {
		return nil, err
	}
	if len(ar.NBest) == 0 {
		return nil, ErrNoSpeech
	}
	b := ar.NBest[0]
	out := &ports.PronunciationResult{
		Recognized:   b.Display,
		Accuracy:     b.AccuracyScore,
		Fluency:      b.FluencyScore,
		Completeness: b.CompletenessScore,
		Overall:      b.PronScore,
	}
	if b.ProsodyScore != nil {
		out.Prosody, out.ProsodyOK = *b.ProsodyScore, true
	}
	for _, w := range b.Words {
		ws := ports.WordScore{Word: w.Word, Accuracy: w.AccuracyScore, ErrorType: w.ErrorType}
		for _, s := range w.Syllables {
			ws.Syllables = append(ws.Syllables, ports.SyllableResult{
				Syllable: s.Syllable, Grapheme: s.Grapheme, Accuracy: s.AccuracyScore})
		}
		for _, p := range w.Phonemes {
			ws.Phonemes = append(ws.Phonemes, ports.PhonemeResult{
				Phoneme: p.Phoneme, Accuracy: p.AccuracyScore})
		}
		out.Words = append(out.Words, ws)
	}
	return out, nil
}
```

요청 설정(기존 `"Granularity": "Word", "Dimension": "Comprehensive"` 자리):

```go
		// Phoneme granularity is what makes the syllable grid and the correction
		// points possible; Word granularity returns neither. Prosody must be
		// asked for explicitly and is silently absent on unsupported locales —
		// that is why PronunciationResult carries ProsodyOK.
		"Granularity": "Phoneme", "Dimension": "Comprehensive",
		"EnableProsodyAssessment": true,
```

`Assess`의 기존 파싱 블록은 `return parseAssessment(body)`로 대체한다.

- [ ] **Step 5: 테스트 통과 확인**

Run: `cd server && go test ./internal/adapters/azurespeech/ -v`
Expected: 3 PASS.

- [ ] **Step 6: 전체 회귀 확인**

Run: `cd server && go build ./... && go test ./...`
Expected: 컴파일 통과 + 전체 그린. `WordScore` 필드 추가는 기존 사용처를 깨지 않아야 한다(추가만 했으므로).

- [ ] **Step 7: 커밋**

```bash
git add server/internal/ports/ports.go server/internal/adapters/azurespeech/
git commit -m "feat(speech): Azure 음소 granularity + 억양 점수 파싱

음절 그리드와 교정 포인트는 음소 단위가 있어야 만들 수 있는데 기존 요청은
Granularity: Word였다. 억양은 EnableProsodyAssessment를 켜야 오고 로케일에
따라 아예 없으므로, 없음과 0점을 구분하려고 ProsodyOK를 둔다."
```

---

### Task 2: 마이그레이션 + sqlc 쿼리 + 저장소

> **정정됨 (2026-08-16, 착수 전 컨트롤러 확인)** — 아래 본문보다 이 블록이 우선한다.
>
> 1. **Step 4의 "`progress_repo_test.go` 참조"는 틀렸다. 그런 파일은 없다.** 이 리포에는 postgres 저장소
>    테스트가 **하나도 없고**, 저장소는 `scripts/e2e_smoke.sh`가 실 DB로 검증하는 것이 관례다.
>    → DB가 필요한 테스트는 `TEST_DATABASE_URL`이 없으면 `t.Skip`하는 파일로 새로 만든다(그래야 `go test ./...`가
>    DB 없이도 그린으로 남는다). **스킵된 테스트는 테스트가 아니므로**, 같은 불변식을 Task 10의 스모크 assert로도
>    반드시 남긴다. 둘 중 하나만 하면 안 된다.
> 2. **`INSERT ... SELECT MAX(attempt_no)+1`은 경합을 해결하지 못한다.** 동시 요청 둘이 같은 `MAX`를 읽으면 둘 다
>    같은 번호를 계산하고, `UNIQUE (user_id, sentence_key, attempt_no)`가 **하나를 에러로 떨군다.** 즉 제약은
>    데이터 오염을 막을 뿐 요청을 성사시키지 않는다.
>    → 저장소는 **unique violation(`23505`)을 한 번 재시도**해야 한다. 재시도해도 실패하면 에러를 올린다.
>    재시도 없이 두면 사용자가 "다시 녹음"을 빨리 두 번 눌렀을 때 두 번째가 이유 없이 실패한다.

**Files:**
- Create: `server/db/migrations/000021_speech_attempts.up.sql` · `.down.sql`
- Create: `server/db/queries/speech.sql`
- Create: `server/internal/adapters/postgres/speech_repo.go`
- Modify: `server/internal/ports/ports.go` (SpeechRepo 포트)
- Test: `server/internal/adapters/postgres/speech_repo_test.go`

**Interfaces:**
- Consumes: Task 1의 `ports.WordScore` 등.
- Produces: `ports.SpeechRepo` — Task 3·4가 쓴다.

```go
type SpeechRepo interface {
	InsertAttempt(ctx context.Context, a SpeechAttemptInput) (id string, attemptNo int, err error)
	ListAttempts(ctx context.Context, userID, sentenceKey string, limit int) ([]SpeechAttemptRow, error)
	GetReference(ctx context.Context, sentenceKey string) (*SentenceReferenceRow, error)
	PutReference(ctx context.Context, r SentenceReferenceRow) error
}
```

- [ ] **Step 1: 마이그레이션을 쓴다**

`000021_speech_attempts.up.sql`:

```sql
-- Speech attempts are append-only history: the 1st/2nd/3rd try at one sentence
-- each get a row so the practice screen can show progress. They live apart from
-- review_cards because drill utterances (minimal pairs, field sentences) have no
-- card, and a card is a single mutable SM-2 row while this is a time series.
CREATE TABLE speech_attempts (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    sentence_key   text NOT NULL,
    reference_text text NOT NULL,
    locale         text NOT NULL,
    attempt_no     int  NOT NULL,
    recognized     text NOT NULL DEFAULT '',
    overall        real NOT NULL,
    accuracy       real NOT NULL,
    fluency        real NOT NULL,
    completeness   real NOT NULL,
    -- NULL means the scorer did not assess prosody for this locale, which is
    -- different from scoring zero. The UI hides the row rather than showing 0.
    prosody        real,
    duration_ms    int  NOT NULL DEFAULT 0,
    words          jsonb NOT NULL DEFAULT '[]'::jsonb,
    scenario_id    text NOT NULL DEFAULT '',
    -- Kept when the card is deleted: the attempt happened regardless.
    review_card_id uuid REFERENCES review_cards (id) ON DELETE SET NULL,
    origin         text NOT NULL DEFAULT 'freeform',
    created_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, sentence_key, attempt_no)
);
CREATE INDEX idx_speech_attempts_user_sentence ON speech_attempts (user_id, sentence_key, attempt_no DESC);

-- One row per phoneme observation so the (future) drill screen can aggregate a
-- 2-week window without scanning the words JSONB.
CREATE TABLE speech_phoneme_scores (
    attempt_id uuid NOT NULL REFERENCES speech_attempts (id) ON DELETE CASCADE,
    user_id    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    phoneme    text NOT NULL,
    accuracy   real NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_speech_phonemes_user_time ON speech_phoneme_scores (user_id, created_at DESC);

-- Canonical breakdown of a sentence, derived once (TTS -> assess) and shared by
-- every user: the practice screen needs IPA before any recording exists.
CREATE TABLE speech_references (
    sentence_key   text PRIMARY KEY,
    reference_text text NOT NULL,
    locale         text NOT NULL,
    ipa            text NOT NULL DEFAULT '',
    words          jsonb NOT NULL DEFAULT '[]'::jsonb,
    duration_ms    int  NOT NULL DEFAULT 0,
    created_at     timestamptz NOT NULL DEFAULT now()
);
```

`.down.sql`:

```sql
DROP TABLE IF EXISTS speech_phoneme_scores;
DROP TABLE IF EXISTS speech_references;
DROP TABLE IF EXISTS speech_attempts;
```

- [ ] **Step 2: sqlc 쿼리를 쓴다**

`db/queries/speech.sql`:

```sql
-- name: InsertSpeechAttempt :one
-- attempt_no is numbered inside the same statement so two concurrent requests
-- cannot claim the same number (an application-side counter would race).
INSERT INTO speech_attempts (
    user_id, sentence_key, reference_text, locale, attempt_no,
    recognized, overall, accuracy, fluency, completeness, prosody,
    duration_ms, words, scenario_id, review_card_id, origin
)
SELECT $1, $2, $3, $4,
       COALESCE(MAX(attempt_no), 0) + 1,
       $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
  FROM speech_attempts
 WHERE user_id = $1 AND sentence_key = $2
RETURNING id, attempt_no;

-- name: InsertPhonemeScore :exec
INSERT INTO speech_phoneme_scores (attempt_id, user_id, phoneme, accuracy)
VALUES ($1, $2, $3, $4);

-- name: ListSpeechAttempts :many
SELECT id, attempt_no, overall, accuracy, fluency, completeness, prosody,
       duration_ms, recognized, words, created_at
  FROM speech_attempts
 WHERE user_id = $1 AND sentence_key = $2
 ORDER BY attempt_no DESC
 LIMIT $3;

-- name: GetSpeechReference :one
SELECT sentence_key, reference_text, locale, ipa, words, duration_ms
  FROM speech_references WHERE sentence_key = $1;

-- name: PutSpeechReference :exec
INSERT INTO speech_references (sentence_key, reference_text, locale, ipa, words, duration_ms)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (sentence_key) DO NOTHING;
```

- [ ] **Step 3: 코드 생성**

Run: `cd server && sqlc generate`
Expected: `internal/adapters/postgres/sqlc/speech.sql.go` 생성, 컴파일 통과.

- [ ] **Step 4: 실패하는 저장소 테스트를 쓴다**

`speech_repo_test.go`. 기존 저장소 테스트가 실 DB를 쓰는지 확인하고 **같은 방식**을 따른다(`progress_repo_test.go` 참조). 검증할 것:

```go
// 같은 문장에 두 번 시도하면 번호가 1,2로 매겨진다 (business-rules R2/I5).
func TestAttemptNumbering(t *testing.T) { /* insert ×2 → 1, 2 */ }

// 시도와 음소 행은 같은 트랜잭션에 쓰인다 (I2): 음소 삽입이 실패하면 시도도 남지 않는다.
func TestAttemptAndPhonemesAreAtomic(t *testing.T) { /* 강제 실패 주입 → 행 0 */ }

// prosody NULL 이 ProsodyOK=false 로 왕복한다 (0점과 구분).
func TestProsodyNullRoundTrip(t *testing.T) { /* nil 저장 → 조회 시 ProsodyOK=false */ }

// review_cards 삭제 후에도 시도는 남고 링크만 끊긴다.
func TestAttemptSurvivesCardDeletion(t *testing.T) { /* 카드 삭제 → row 존재, review_card_id IS NULL */ }
```

- [ ] **Step 5: 실패 확인 → 저장소 구현 → 통과 확인**

Run: `cd server && go test ./internal/adapters/postgres/ -run Speech -v`
`speech_repo.go`는 `progress_repo.go`의 패턴(`pool` + `sqlc.Queries`, JSONB는 `json.Marshal`)을 그대로 따른다.
`InsertAttempt`는 `pool.Begin` → `q.WithTx(tx)` → 시도 삽입 → 음소 루프 → `Commit`.

- [ ] **Step 6: 마이그레이션 왕복 확인**

Run: `cd server && go test ./db/... && go run ./cmd/migrate up && go run ./cmd/migrate version`
Expected: 버전 21, dirty=false. down 파일이 up의 역순으로 지우는지 눈으로 확인(FK 때문에 순서가 중요하다).

- [ ] **Step 7: 커밋**

```bash
git add server/db server/internal/adapters/postgres server/internal/ports/ports.go
git commit -m "feat(speech): 시도·음소·참조 3테이블 + 저장소

시도 번호는 INSERT ... SELECT MAX+1 로 같은 문장 안에서 채번한다.
애플리케이션 카운터를 쓰면 동시 요청 둘이 같은 번호를 받는다.
prosody는 nullable — 억양을 채점하지 않은 로케일과 0점을 구분해야 한다."
```

---

### Task 3: `domain/speech` — 문장 키 · 기록 · 이력

**Files:**
- Create: `server/internal/domain/speech/key.go` · `speech.go`
- Test: `server/internal/domain/speech/key_test.go` · `speech_test.go`

**Interfaces:**
- Consumes: `ports.SpeechRepo`(Task 2) · `ports.PronunciationPort` · 기존 `pronunciation.Service`(로케일 해석).
- Produces: `speech.Service{Record, History}` — Task 5가 쓴다.

- [ ] **Step 1: 실패하는 키 테스트를 쓴다**

```go
package speech

import "testing"

func TestSentenceKeyNormalizes(t *testing.T) {
	a := SentenceKey("  I'm  Giving you 650 mg. ", "en-US")
	b := SentenceKey("i'm giving you 650 mg.", "en-US")
	if a != b {
		t.Fatalf("case/whitespace must not split history: %s vs %s", a, b)
	}
	if len(a) != 32 {
		t.Fatalf("key length %d, want 32", len(a))
	}
}

func TestSentenceKeySeparatesLocales(t *testing.T) {
	if SentenceKey("hello", "en-US") == SentenceKey("hello", "en-GB") {
		t.Fatal("different locales are different sentences to score against")
	}
}
```

- [ ] **Step 2: 실패 확인**

Run: `cd server && go test ./internal/domain/speech/`
Expected: FAIL — 패키지 없음.

- [ ] **Step 3: 키를 구현한다**

```go
// Package speech records spoken attempts and the history they accumulate.
// Scoring itself stays in domain/pronunciation; this package owns persistence.
package speech

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"
)

// SentenceKey identifies "the same sentence" across attempts without a sentence
// table, so utterances that have no review card (drills, minimal pairs) still
// group. Normalizing case and whitespace keeps one sentence from splitting into
// several histories over a stray capital.
func SentenceKey(text, locale string) string {
	n := strings.ToLower(strings.Join(strings.Fields(text), " "))
	sum := sha256.Sum256([]byte(n + "|" + locale))
	return hex.EncodeToString(sum[:])[:32]
}
```

- [ ] **Step 4: 통과 확인**

Run: `cd server && go test ./internal/domain/speech/ -v`
Expected: 2 PASS.

- [ ] **Step 5: `Record`/`History` 테스트를 쓴다**

`ports.SpeechRepo`와 `ports.PronunciationPort`를 페이크로 두고 검증한다:

```go
// 채점 결과의 모든 음소가 phoneme 행으로 넘어간다 (I2의 재료).
func TestRecordFansOutPhonemes(t *testing.T)

// 채점이 ErrNoSpeech 면 아무것도 저장하지 않는다 (엣지케이스: 시도 번호도 소비 안 함).
func TestRecordDoesNotPersistNoSpeech(t *testing.T)

// Azure 호출은 정확히 1회 (I4).
func TestRecordCallsScorerOnce(t *testing.T)

// History 는 최근 N개를 오래된 순으로 준다 (화면이 1차→3차로 그린다).
func TestHistoryIsOldestFirst(t *testing.T)
```

- [ ] **Step 6: 실패 확인 → `speech.go` 구현 → 통과 확인**

`Record(ctx, userID, audio, refText, opts)`:
1. `pronunciation.Service`로 로케일 해석 + `Assess`
2. `ErrNoSpeech`면 그대로 반환(저장 없음)
3. `SentenceKey` 계산
4. `repo.InsertAttempt` (음소 팬아웃 포함, 한 트랜잭션)
5. 결과 + `attemptNo` 반환

Run: `cd server && go test ./internal/domain/speech/ -v`

- [ ] **Step 7: 커밋**

```bash
git add server/internal/domain/speech
git commit -m "feat(speech): 문장 키·시도 기록·이력

키는 대소문자와 연속 공백을 정규화한다. 같은 문장이 대문자 하나로 다른
이력이 되면 1차/2차/3차 표시가 무의미해진다. 채점이 무음이면 저장도
시도 번호 소비도 하지 않는다."
```

---

### Task 4: 참조(IPA) 유도 + 캐시

**Files:**
- Create: `server/internal/domain/speech/reference.go`
- Test: `server/internal/domain/speech/reference_test.go`

**Interfaces:**
- Consumes: `ports.SpeechSynthesizer`(기존, `quiz_audio_handler.go`가 쓰는 것) · `ports.PronunciationPort` · `ports.SpeechRepo`.
- Produces: `Service.Reference(ctx, userID, text) (*ports.SentenceReference, error)`.

> **왜 이런 방식인가:** 연습 대기 화면은 **녹음 전에** IPA를 보여주는데(SoT L78) Azure는 오디오가 있어야 음소를 준다. 3,200 시나리오에 IPA를 손저작하는 건 비현실적이고, 지어내는 건 금지다. 그래서 **참조 음성을 TTS로 합성해 그 음성을 같은 참조 텍스트에 대해 채점**하면 정준 음절·음소가 나온다. 점수는 버리고 **분절과 길이만** 쓴다.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

```go
// 캐시가 있으면 TTS도 채점도 부르지 않는다 (문장당 평생 1회 — NFR).
func TestReferenceUsesCache(t *testing.T)

// 미스면 TTS 1회 + 채점 1회, 그리고 저장된다.
func TestReferenceDerivesAndCaches(t *testing.T)

// 정준 결과에서 점수는 버리고 음절·음소·길이만 남는다.
func TestReferenceDropsScores(t *testing.T)

// TTS가 실패하면 에러를 반환하되, 이는 채점 경로를 막지 않는다(호출자가 무시 가능).
func TestReferenceFailureIsNotFatal(t *testing.T)
```

- [ ] **Step 2: 실패 확인 → 구현 → 통과 확인**

```go
// Reference returns the canonical syllable/phoneme breakdown of a sentence,
// deriving it once by scoring our own TTS rendition against the same text.
// The scores from that pass are meaningless (a machine grading itself) — we
// keep only the segmentation and the duration.
func (s *Service) Reference(ctx context.Context, userID, text string) (*ports.SentenceReference, error) {
	locale := s.pron.LocaleFor(ctx, userID)
	key := SentenceKey(text, locale)
	if got, err := s.repo.GetReference(ctx, key); err == nil && got != nil {
		return got, nil
	}
	wav, err := s.tts.Synthesize(ctx, text, "", locale)
	if err != nil {
		return nil, err
	}
	scored, err := s.scorer.Assess(ctx, wav, text, locale)
	if err != nil {
		return nil, err
	}
	ref := ports.SentenceReference{
		SentenceKey: key, ReferenceText: text, Locale: locale,
		IPA:        ipaLine(scored.Words),
		Words:      stripScores(scored.Words),
		DurationMS: wavDurationMS(wav),
	}
	_ = s.repo.PutReference(ctx, ref) // best-effort: a cache miss next time is cheap
	return &ref, nil
}
```

`ipaLine`은 단어별 음소를 이어 `/…/` 한 줄로 만든다. `wavDurationMS`는 RIFF 헤더의 바이트 수 / (샘플레이트 × 채널 × 2)로 계산한다.

- [ ] **Step 3: 커밋**

```bash
git add server/internal/domain/speech
git commit -m "feat(speech): 참조 IPA를 TTS+채점으로 유도하고 캐시

연습 화면은 녹음 전에 IPA를 보여줘야 하는데 Azure는 오디오가 있어야
음소를 준다. 우리 TTS로 참조 음성을 만들어 같은 텍스트에 대해 채점하면
정준 분절이 나온다. 점수는 기계가 자기를 채점한 것이라 버리고 음절·음소·
길이만 쓴다. 합성물은 '원어민 듣기' 재생에도 재사용한다."
```

---

### Task 5: HTTP 엔드포인트 + 계약

**Files:**
- Create: `server/internal/adapters/http/speech_handler.go`
- Modify: `server/internal/adapters/http/pronunciation_handler.go` · `router.go` · `cmd/api/main.go`
- Test: `server/internal/adapters/http/speech_handler_test.go`

**Interfaces:**
- Produces (모바일이 소비):
  - `POST /pronunciation` → 기존 응답 + `attemptId` · `attemptNo`
  - `GET /speech/reference?text=…` → `SentenceReference`
  - `GET /speech/attempts?text=…&limit=3` → `[]SpeechAttempt` (오래된 순)

- [ ] **Step 1: 실패하는 핸들러 테스트를 쓴다**

검증할 것 — business-rules §2·§3·§5:
```go
func TestAttemptsRequireAuth(t *testing.T)                  // 401
func TestAttemptsOnlyReturnsOwn(t *testing.T)               // 다른 사용자 것 안 나옴
func TestReferenceTextTooLongIs400(t *testing.T)            // 300자 초과
func TestNoSpeechIs422(t *testing.T)                        // ErrNoSpeech → 422 no_speech_detected
func TestReviewCardOwnershipEnforced(t *testing.T)          // 남의 카드 id → 403
func TestPronunciationDisabledWhenAzureUnset(t *testing.T)  // 503이 아니라 비활성 신호
```

- [ ] **Step 2: 실패 확인 → 구현 → 통과 확인**

`router.go`에 추가(기존 `auth()` 래퍼 사용, `mux.Handle("POST /pronunciation", ...)` 옆):

```go
	sh := &speechHandler{svc: d.Speech}
	mux.Handle("GET /speech/reference", auth(http.HandlerFunc(sh.reference)))
	mux.Handle("GET /speech/attempts", auth(http.HandlerFunc(sh.attempts)))
```

Azure 미구성 신호는 **기존 설정 응답에 실어 보낸다**(새 엔드포인트를 만들지 않는다): `GET /config/economy`가 이미 있는 것처럼, 앱이 이미 부르는 응답에 `pronunciationEnabled` 불리언을 더한다. 어디에 실을지는 구현자가 기존 응답 중 **앱이 부팅 시 반드시 부르는 것**을 골라 결정하고, 그 선택 이유를 커밋 메시지에 남긴다.

- [ ] **Step 3: 계약 재생성**

Run: `cd packages/contract && <프로젝트의 코드젠 명령>` → `git diff`로 드리프트 확인
Expected: 새 타입 3종이 생성물에 나타난다. `deploy.yml`의 `verify` job이 같은 검사를 CI에서 돌린다.

- [ ] **Step 4: 커밋** (메시지에 `pronunciationEnabled` 위치 선택 이유 포함)

---

### Task 6: 음소 → 한국어 교정 문구

**Files:**
- Create: `server/internal/content/phonemetips/tips.go`
- Test: `server/internal/content/phonemetips/tips_test.go`

- [ ] **Step 1: 실패하는 테스트를 쓴다**

```go
// 한국어 화자가 실제로 틀리는 음소는 반드시 있어야 한다.
func TestCoversKoreanSpeakerPainPoints(t *testing.T) {
	must := []string{"ɪ", "iː", "r", "l", "θ", "ð", "f", "v", "z", "æ", "ʌ", "ə"}
	for _, p := range must {
		if _, ok := Tip(p); !ok {
			t.Errorf("no tip for /%s/ — a correction point for it would render blank", p)
		}
	}
}

// 문구는 입 모양·혀 위치 같은 실행 가능한 지시를 담아야 한다(단순 명칭 나열 금지).
func TestTipsAreActionable(t *testing.T) {
	for p, tip := range All() {
		if len([]rune(tip.Message)) < 10 {
			t.Errorf("/%s/ tip too short to act on: %q", p, tip.Message)
		}
	}
}
```

- [ ] **Step 2: 실패 확인 → 매핑 저작 → 통과 확인**

영어 음소 ~44개. 어조는 SoT L256을 따른다 — **현장 위험을 곁들인다**:
`"/ɪ/는 짧고 느슨하게, /iː/는 길고 입꼬리를 당겨서. 병원에서 \"sit\"과 \"seat\"을 헷갈리면 체위 지시가 틀려요."`

```go
// Package phonemetips maps a phoneme to Korean coaching a nurse can act on.
// Without a tip a correction point would render an empty card, so
// business-rules R5 skips phonemes that are missing here.
package phonemetips

type Tip struct {
	IPA     string
	Message string
	Example string // minimal pair or field word
}
```

- [ ] **Step 3: 커밋**

---

### Task 7: 모바일 — SoT 1:1 조각들

**Files:**
- Create: `mobile/src/components/pron/{TargetCard,Wave,SyllableGrid,ScoreBars,CorrectionCard,AttemptHistory}.tsx`
- Create: `mobile/src/lib/pronTokens.ts`
- Test: `mobile/src/lib/pronTokens.test.ts`

**Interfaces:** props는 frontend-components §2에 그대로 있다. **재발명하지 말고 그대로 옮긴다.**

- [ ] **Step 1: 토큰 분절 테스트를 쓴다**

```ts
import { splitTargetTokens } from './pronTokens';

test('숫자+단위를 하나의 num 토큰으로 묶는다', () => {
  const t = splitTargetTokens("I'm giving you 650 milligrams now.", ['acetaminophen']);
  expect(t.find(x => x.hi === 'num')?.w).toBe('650 milligrams');
});

test('약물명은 drug 로 표시된다', () => {
  const t = splitTargetTokens('Give acetaminophen now.', ['acetaminophen']);
  expect(t.find(x => x.hi === 'drug')?.w).toBe('acetaminophen');
});

// 하이라이트가 하나도 없는 평문도 정상 — 빈 배열이 아니라 통짜 토큰 하나.
test('매칭이 없으면 평문 한 덩어리', () => {
  const t = splitTargetTokens('Please sit up.', []);
  expect(t).toHaveLength(1);
  expect(t[0].hi).toBeUndefined();
});
```

- [ ] **Step 2: 실패 확인 → 구현 → 통과 확인**

Run: `cd mobile && npm test -- pronTokens`

- [ ] **Step 3: 조각 컴포넌트를 만든다**

SoT 라인 대응은 frontend-components §6 표. 색·치수·그림자는 **SoT 숫자를 그대로** 쓴다(막대 폭 5·간격 3, 녹음 버튼 92×92, 라벨 폭 42 등). 토큰은 `src/theme/tokens.ts`의 이름을 쓴다(`mint`·`mintShadow`·`peach`·`peachShadow`·`lilac`·`cream`·`ink`·`paper`·`blue`·`red`·`yellow`·`text`·`textSoft`·`textFaint` 전부 존재함을 확인함).

- [ ] **Step 4: `tsc` + 테스트 통과 확인** → **Step 5: 커밋**

---

### Task 8: 모바일 — 루프 라우트(상태 머신)

**Files:**
- Create: `mobile/src/app/pronunciation/[sentenceKey].tsx`
- Test: `mobile/src/app/pronunciation/pronState.test.ts` (상태 머신만 순수 함수로 분리해 테스트)

- [ ] **Step 1: 상태 전이 테스트를 쓴다**

business-logic-model §3의 전이를 그대로:
```ts
test('scoring 에서는 취소가 없다', () => {
  expect(next('scoring', { type: 'CANCEL' })).toBe('scoring');
});
test('무음 응답은 idle 로 돌아가되 안내를 남긴다', () => {
  expect(next('scoring', { type: 'NO_SPEECH' })).toBe('noSpeech');
});
test('10초가 차면 스스로 채점으로 넘어간다', () => {
  expect(next('recording', { type: 'TIMEOUT' })).toBe('scoring');
});
```

- [ ] **Step 2: 실패 확인 → 구현 → 통과 확인**

- [ ] **Step 3: 화면을 조립한다**

6상태(frontend-components §4)를 렌더한다. 주의:
- `scoring`은 **다크 셸 유지** — 녹음 정지와 결과 사이에 화면이 밝아졌다 어두워지면 깜빡인다.
- 🎯 드릴 버튼은 **렌더하되 비활성**(범위 밖). 지우지 않는다.
- `referenceText`를 라우트 파라미터로 넘길 때 **인코딩한다**(`#`가 들어가면 파라미터가 그 지점에서 잘린다).

- [ ] **Step 4: 시뮬레이터 시각 검증**

Expo Go `exp://` 딥링크로 3상태에 각각 진입해 SoT와 대조한다(`forin://`는 SpringBoard 프롬프트로 자동화가 막힌다). 대조 항목: 셸 배경, 헤더 배지, 카드 그림자 방향/크기, 음절 칩 3색, 버튼 치수.

- [ ] **Step 5: 커밋**

---

### Task 9: 진입점 배선 + 구 컴포넌트 제거

**Files:**
- Modify: `mobile/src/app/dialogue/[id].tsx:315` · 리뷰랩 PhraseCard
- Delete: `mobile/src/components/PronunciationPractice.tsx` · `PronunciationScore.tsx`

- [ ] **Step 1: 진입점 2곳을 새 라우트로 바꾼다**

`dialogue/[id].tsx`는 지금 `<PronunciationPractice referenceText={scenario.keyPhrases[0]} />`를 인라인으로 그린다. 이걸 **04_SCREENS.md:324의 바텀 레일 🎤 직접 말하기**로 바꾸고, 누르면 새 라우트로 push한다(`origin='dialogue'`, `scenarioId`).
리뷰랩 PhraseCard의 `🎤 따라 말하기`는 같은 라우트에 `origin='review'` + `reviewCardId`.

- [ ] **Step 2: 구 컴포넌트를 지우고 참조가 남지 않았는지 확인**

Run: `cd mobile && grep -rn "PronunciationPractice\|PronunciationScore" src ; npx tsc --noEmit`
Expected: grep 0건, tsc 0.

- [ ] **Step 3: 마이크 권한 거부 경로를 확인**

시뮬레이터에서 권한을 거부한 상태로 진입 → `permissionDenied` 상태가 뜨고 녹음 버튼이 비활성인지.

- [ ] **Step 4: 커밋**

---

### Task 10: 검증 — 스모크 + 실 Azure 왕복

**Files:**
- Modify: `server/scripts/e2e_smoke.sh`

- [ ] **Step 1: 스모크에 발음 경로 assert를 더한다**

기존 스모크(57 assert)의 스타일을 그대로 따른다. 추가할 것:
- `GET /speech/reference`가 200 + `ipa` 비어있지 않음
- `GET /speech/attempts`가 빈 배열로 시작
- 무음 WAV로 `POST /pronunciation` → 422 `no_speech_detected`, 그리고 **시도가 저장되지 않았는지**(attempts 여전히 0)

- [ ] **Step 2: 실 Azure 1회 왕복을 사람이 확인한다**

**이것은 픽스처가 아니라 실측이다.** staging에 배포한 뒤 실제 발화 오디오 1건으로 `POST /pronunciation`을 호출해:
- 응답에 `words[].syllables`와 `words[].phonemes`가 **실제로 들어 있는지**
- `prosodyAvailable`이 `en-US`에서 `true`로 오는지
- 같은 문장 2회 시도 시 `attemptNo`가 1, 2로 오는지

이 프로젝트에서 반복된 교훈이다: **"배선이 맞다"와 "실제로 돈다"는 다른 사건이다.** 픽스처 테스트는 우리가 상상한 Azure 응답을 검증할 뿐이다.

- [ ] **Step 3: 결과를 Build Spec에 반영**

`build-spec-index.md`의 §4 체크리스트를 채우고, SoT 대비 의도적 편차(`scoring` 상태 추가, 드릴 버튼 비활성)를 **§7 편차 로그**에 기록한 뒤 `status: IMPLEMENTED`로 올린다.

- [ ] **Step 4: 커밋 + STATUS/DECISIONS 갱신**

---

## Self-Review

- **스펙 커버리지:** Build Spec §4 체크리스트 전 항목이 Task 1–10에 매핑된다. 서버 9항목 → T1–T6, 모바일 5항목 → T7–T9, 콘텐츠 1항목 → T6, 검증 → T10.
- **플레이스홀더:** 없음. 단 Task 5 Step 3의 계약 코드젠 명령과 Task 2 Step 4의 실 DB 테스트 방식은 **기존 파일의 관례를 따르라**고 지시했다 — 값을 지어내는 것보다 현물을 보게 하는 편이 맞다.
- **타입 일관성:** `ports.WordScore`(T1) → `SpeechRepo`(T2) → `speech.Service`(T3·T4) → 핸들러(T5) → 모바일 props(T7)까지 이름이 이어진다. `ProsodyOK`는 T1에서 도입해 T2에서 nullable 컬럼으로, T7에서 "행 숨김"으로 일관되게 흐른다.
