---
build-spec: pronunciation
artifact: cross-review
updated: 2026-10-10
---

# 태스크 횡단 최종 리뷰 — 발음 루프 (v22 T1~T11)

인덱스: [`./build-spec-index.md`](./build-spec-index.md) · 규칙: [`./business-rules.md`](./business-rules.md)

태스크별 리뷰는 끝났지만 **태스크 사이의 이음매**를 보는 패스는 빠져 있었다. 이 문서는 그 이음매만 본다.
한 태스크가 만든 것을 다른 태스크가 다르게 가정한 곳, 문서와 코드가 갈라진 곳, 나중 기능(대화 채점·말하기 목록 등)이
v22의 불변식을 우회하는 곳이다.

## 0. 검증한 것

| 항목 | 결과 |
|---|---|
| `TEST_DATABASE_URL=… go test ./...` (실 DB) | 전 패키지 통과. `-count=1 -v`로 speech 관련 실 DB 테스트 16건(`speech_repo_test.go` 8 + 세션·말하기 목록 8)이 **스킵 없이** 실행·통과함을 확인 (`TestAttemptAndPhonemesAreAtomic`·`TestProsodyNullRoundTrip`·`TestConcurrentAttemptsGetDistinctNumbers`·`TestUpdateReferenceAudioBackfillsLegacyRow` 포함) |
| CI | `fb8988a` 이후 `.github/workflows/server.yml:27`이 `TEST_DATABASE_URL`을 주입한다 → build-spec §5의 미해결 항목("CI에는 그 변수가 없다")은 **이제 닫혔다**. 문서 갱신 필요(아래 사소 S12) |
| 모바일 `npx jest src/lib/pronState.test.ts src/lib/pronTokens.test.ts src/components/pron` | 4 스위트 / 60 테스트 통과 |
| 코드 수정·커밋 | 하지 않음 |

## 1. 요약

| 심각도 | 개수 |
|---|---|
| 차단 | 1 |
| 중요 | 5 |
| 사소 | 14 |

---

## 2. 차단

### B1. `POST /pronunciation` 응답의 `durationMs`가 항상 0 → 결과 화면이 매번 "0.0초 · 조금 빨라요"라고 거짓말한다

- **위치:** `server/internal/domain/speech/speech.go:92-136`(Record) · `server/internal/adapters/http/pronunciation_handler.go:141-146` ·
  `server/internal/ports/ports.go:203-207` · `mobile/src/app/pronunciation/[sentenceKey].tsx:119-125, 304-321, 843`
- **원인(태스크 경계):** T3가 포트 주석에 "어댑터는 `DurationMS`를 채우지 않는다, **호출자가** WAV에서 계산한다"고 못 박았다.
  T4의 `Record`는 `DurationMS(audioWav)`를 계산해 **`InsertAttempt` 입력에만** 넣고(`speech.go:124`), 응답으로 돌려주는
  `res`(`*ports.PronunciationResult`)에는 대입하지 않는다. T5 핸들러는 `rec.Result`를 그대로 직렬화한다. T8 화면은
  `result.durationMs`를 믿는다. 세 태스크 누구도 틀리지 않았지만 이음매에서 값이 사라진다. DB 행은 맞으므로
  `GET /speech/attempts`의 이력은 정상이다 — **라이브 결과 응답만** 틀리다.
- **실패 시나리오:** iOS에서 3초짜리 녹음 → 서버 응답 `durationMs: 0` (태그에 `omitempty` 없음) → `WaveCompare`는
  `myDurationMs != null`이 참이라 "내 발음 0.0초"를 그리고, 참조가 있으면 `paceLabel(0 / 2100)` = 비율 0 < 0.85 →
  **"원어민 2.1초 대비 조금 빨라요"가 모든 시도에 뜬다.** 실제로 느리게 말한 사용자에게도 같다.
- **왜 테스트가 못 잡았나:** `speech_handler_test.go:147`의 가짜 저장소는 `DurationMS`를 **입력에서** 복사하고, `speech_test.go`에는
  `rec.Result.DurationMS`를 확인하는 단언이 없다. 스모크(`e2e_smoke.sh`)도 POST 응답의 `durationMs`를 보지 않는다.
- **고칠 방향:** `Record`에서 `res.DurationMS = DurationMS(audioWav)`를 한 번 계산해 응답·저장 양쪽에 같은 값을 쓴다.
  `speech_test.go`에 "응답의 DurationMS가 WAV 길이와 같다" 단언 추가. 모바일은 방어적으로 `durationMs > 0`일 때만 비교 문구를 그린다.
- **확신:** 높음 (코드 경로 전부 읽음; `DurationMS =` 대입은 저장소 쪽에만 있다).

---

## 3. 중요

### I1. Android에서는 서버가 받는 WAV를 만들 수 없다 → 모든 시도가 400 `invalid_audio`

- **위치:** `mobile/src/app/pronunciation/[sentenceKey].tsx:64-79`(특히 `:77`) · `mobile/src/app/dialogue/[id].tsx:52` ·
  `server/internal/domain/speech/validate.go:26-42`
- **원인:** T8이 "dialogue의 expo-audio 설정을 그대로" 가져왔다(`:17-20` 주석). iOS는 `LINEARPCM`이지만 Android는
  `{ outputFormat: 'default', audioEncoder: 'default' }`다. expo-audio ~56의 Android 녹음기는 `MediaRecorder`이고
  (`node_modules/expo-audio/android/.../AudioRecorder.kt:8,45`), `AndroidOutputFormat`에는 PCM/WAV 값이 없다
  (`Audio.types.d.ts:300`). 확장자만 `.wav`이고 내용은 3GPP/AMR이다.
- **실패 시나리오:** Android에서 녹음 → base64 → `ValidateWAV`의 `RIFF/WAVE` 매직 검사 실패 → 400 → 화면은
  "요청을 처리할 수 없어요. 같은 문제가 반복되면 문장을 바꿔서…" 배너. 문장을 바꿔도 영원히 같다.
  대화의 `/stt`는 검증이 없어(I3) Azure에 3GP를 `audio/wav` 헤더로 보내 502가 날 가능성이 높다(이쪽은 추정).
- **고칠 방향:** Android는 `AudioStream`(PCM16 스트림, `AudioStream.kt:102`)으로 받아 클라이언트에서 RIFF 헤더를 씌우거나,
  서버가 AAC/3GP를 받아 디코드(ffmpeg 등)한 뒤 16kHz PCM으로 바꾼다. 어느 쪽이든 **Android 출시 전 차단** 항목이다.
  지금 Android 빌드가 0개라 실사용 영향이 없어서 중요로 분류했다.
- **확신:** 높음 (MediaRecorder 사용은 원본 확인. 실기기 재현은 하지 않음).

### I2. `pronunciationEnabled` 플래그를 서버만 내보내고 모바일은 읽지 않는다 → business-rules §5가 금지한 "죽은 버튼"

- **위치:** `server/internal/adapters/http/content_handler.go:254, 283` · `server/cmd/api/main.go:176, 189` ·
  `mobile/src/api/client.ts:640-648` (언급은 주석뿐) · 진입점 9곳(`review.tsx:106`, `(tabs)/lab.tsx:160, 465`, `result/[id].tsx:197`,
  `slang/index.tsx:40`, `(tabs)/index.tsx:237`, `night/index.tsx:103`, `scenario/[id]/sentences.tsx:62`, `SpeakList.tsx:138`,
  `ModelAnswerList.tsx:108`)
- **원인:** build-spec §4 체크리스트의 "Azure 미구성 시 기능 비활성 신호"는 서버 절반(T5/T6)만 구현됐다.
  frontend-components §3("진입점 버튼이 이 값으로 숨는다")의 모바일 절반은 어느 태스크에도 없다. `git log -S pronunciationEnabled -- mobile/src`는
  주석을 넣은 커밋 하나뿐이다.
- **실패 시나리오:** `AZURE_SPEECH_KEY`가 빈 환경(로컬·신규 스테이징·키 회전 실수) → 🎤 버튼이 그대로 보임 → 녹음 10초 →
  `Record`→`Assess`가 "not configured" 오류 → 502 → "채점 서버가 응답하지 않아요. 잠시 후 다시." 잠시 후에도 같다.
  §5 표는 "503을 던지고 화면에서 실패시키지 않는다 — 죽은 버튼이 더 나쁘다"라고 명시한다.
- **고칠 방향:** `economyConfig()`에서 `pronunciationEnabled`를 별도 스토어로 떼어(현재 `readyDestinations`를 다루는 방식과 같게)
  진입점 컴포넌트들이 읽게 한다. 진입점이 9곳으로 늘었으니 `usePronunciationEnabled()` 훅 하나로 모은다.
- **확신:** 높음.

### I3. `POST /stt`의 대화 채점이 v22의 입력 검증(§2)을 전부 우회해 같은 `speech_attempts`에 쓴다

- **위치:** `server/internal/adapters/http/pronunciation_handler.go:241-297` (대비: 같은 파일 `:57-79`)
- **원인:** v22(T5)가 `POST /pronunciation`에 `MaxBytesReader`(4MiB)·`ValidateWAV`(PCM16/16kHz/mono/≤1MB/≤10초)·300자 상한을 걸었다.
  나중 기능(Scenario Clear 리뷰)이 `/stt`에 `scoreDictation`을 붙이면서 같은 `speech.Record`를 부르지만 이 게이트는 하나도 거치지 않는다.
  `http.Server`에는 본문 상한이 없다(`cmd/api/main.go:193-197`, `ReadHeaderTimeout`만).
- **실패 시나리오:**
  1. 인증된 사용자가 `sessionId`를 붙여 30MB짜리 base64를 `/stt`에 보낸다 → 서버가 전부 메모리에 디코드 → Azure STT 1회 +
     Azure 평가 1회(같은 오디오) → `speech_attempts`에 저장. NFR "Azure 호출은 시도당 1회", business-rules §2 "최대 10초·1MB"가 이 경로에서는 거짓이다.
  2. 24kHz·스테레오 WAV도 그대로 Azure에 `samplerate=16000` 헤더로 넘어가 엉뚱한 점수가 이력으로 남는다.
  3. 참조 텍스트가 인식 결과라 300자 상한도 없다(60초 오디오면 넘길 수 있다).
- **고칠 방향:** `transcribe`에도 `MaxBytesReader` + `speech.ValidateWAV`를 건다(대화 녹음도 같은 16kHz 설정이라 정상 입력은 영향 없음).
  `scoreDictation` 진입 전에 `utf8.RuneCountInString(text) > maxReferenceTextLen`이면 채점을 건너뛴다. 근본적으로는
  "검증된 오디오" 타입을 domain에 두고 `Record`가 그것만 받게 하면 다음 진입점도 우회하지 못한다.
- **확신:** 높음 (코드 경로). 대용량 본문의 실제 메모리 영향은 측정하지 않음.

### I4. 참조 생성에 사용자별 상한이 없다 → 유료 TTS+평가 호출과 영구 2MiB 행을 무제한으로 만들 수 있다

- **위치:** `server/internal/adapters/http/speech_handler.go:46-81` · `speech_audio_handler.go:56-103` ·
  `server/internal/domain/speech/reference.go:67, 110-161` · `router.go:241, 252, 263` · `middleware.go:92-112`
- **원인:** T5/T11 리뷰 2라운드가 **글자 수**(300자)와 **오디오 크기**(2MiB)는 막았지만 **개수**는 막지 않았다.
  `speech_references`는 무효화 경로가 없는 전역 캐시(R9)라 한 번 쓰면 영구다. 남은 방어는 전역 미들웨어의 IP당 20rps/버스트 40뿐이다.
- **실패 시나리오:** 인증된 사용자 한 명이 `GET /speech/reference?text=<매번 다른 299자>`를 초당 20회 보낸다 →
  매 요청이 캐시 미스 → Azure TTS 1 + 평가 1 → 행 1개(오디오 최대 2MiB) 영구 저장. 1시간이면 72,000쌍의 유료 호출과
  수십 GB의 bytea가 남는다. `/speech/reference/audio.wav`도 미스 시 같은 경로(`reference.go:209`)를 탄다.
- **고칠 방향:** (a) 사용자별 일일 참조 생성 상한(Redis 카운터) — 캐시 히트는 세지 않는다. (b) 장기적으로는 참조 텍스트를
  커리큘럼 문장으로 제한(서버가 아는 문장 키 집합)하고, 자유 문장(대화 인식 결과)은 참조를 생성하지 않는다.
  (c) `speech_references`에 `last_used_at`을 두고 오래된 자유 문장 행을 정리할 수 있게 한다.
- **보조 관찰(확신 낮음):** `rateLimit`은 `r.RemoteAddr`로 키를 잡는다. Cloud Run 뒤에서는 이 값이 실제 클라이언트가 아니라
  프런트 프록시 주소일 수 있다 — 그렇다면 IP당 제한이 사실상 **전역 20rps**가 되어 정상 사용자끼리 429를 나눠 갖는다.
  `limiters` 맵도 비우지 않아 계속 자란다. 발음 고유 문제는 아니라 여기 기록만 한다. 실측 필요.
- **확신:** 높음(상한 부재). 비용 추정은 계산값.

### I5. 교정 카드의 음절 라벨이 여전히 IPA다 — 음절 칩에서 고친 문제가 교정 카드에는 남아 있다

- **위치:** `mobile/src/lib/pronTokens.ts:268-273`(`syllable: syllable.syllable`) ·
  `mobile/src/app/pronunciation/[sentenceKey].tsx:722-740`(칩은 grapheme) · `:860-873`(카드) · `:708-712`(녹음 중 진행 칸도 `s.syllable`)
- **원인:** T10이 `PhonemeAlphabet: "IPA"`를 켜자(`azurespeech.go:141`) Azure의 `Syllable` 필드도 IPA가 됐다. `417a672`가 음절 칩만
  `grapheme`으로 바꿨고(`syllableLabel.test.ts`가 그 화면 한 줄만 고정한다), 같은 필드를 쓰는 `buildCorrectionPoints`와 녹음 중
  `SyllableProgress`는 그대로다.
- **실패 시나리오:** "acetaminophen"의 `min` 음절이 약함 → 카드 왼쪽 라벨에 철자 `min` 대신 IPA `mɪn`, 그 옆 IPA 줄에 `/mɪn/` →
  같은 IPA가 두 번 찍히고, 사용자는 문장 어디를 다시 말해야 하는지 철자로 찾을 수 없다(커밋 `417a672`가 지적한 바로 그 문제).
  SoT L199의 라벨은 `min`·`li` 같은 철자다.
- **고칠 방향:** `CorrectionSyllable`에 `grapheme?`를 추가하고 라벨을 `grapheme?.trim() || syllable`로 칩과 같은 규칙에 맞춘다.
  녹음 중 진행 칸도 같은 규칙. 규칙을 한 함수(`syllableLabel(s)`)로 빼서 세 곳이 공유하게 한다.
- **확신:** 중간 — en-US에서 `Syllable`이 IPA로 온다는 근거는 `417a672`의 커밋 설명과 화면 주석(`:724-726`)이다. 원문 응답을 직접 보지는 않았다.

---

## 4. 사소

| # | 위치 | 실패 시나리오 | 고칠 방향 | 확신 |
|---|---|---|---|---|
| S1 | `mobile/src/app/slang/index.tsx:40` · `(tabs)/index.tsx:237` · `night/index.tsx:103` ↔ `server/internal/domain/speech/speech.go:17-24` | 진입점이 `origin: 'slang' / 'home' / 'night'`을 보내지만 서버 허용집합에 없다 → 매 호출 `freeform`으로 강등 + `slog.Warn` 1줄. 말하기 목록의 `origin`으로 출처를 가를 수 없게 된다. domain-entities §4는 "진입점이 늘면 추가"라고 했지만 문서 표도 4개, 코드는 `lesson` 포함 5개다 | 허용집합에 세 값을 추가하고 domain-entities §4 표를 코드와 맞춘다. 모바일에 `PronOrigin` 유니온 타입을 두어 컴파일 시 어긋남을 잡는다 | 높음 |
| S2 | `server/internal/adapters/postgres/speech_repo.go:40-49` | 같은 사용자·같은 문장 요청이 **3건 이상** 동시에 오면, 1차에서 둘이 23505로 지고 재시도에서 다시 같은 MAX를 읽어 하나가 또 23505 → 재시도는 1회뿐이라 실패 → `PersistErr` → 200 + `attemptId:""`(점수는 보이지만 저장 안 됨). `TestConcurrentAttemptsGetDistinctNumbers`는 n=2만 본다 | 23505 재시도를 소수 회(예: 3회) 루프로, 또는 `pg_advisory_xact_lock(hashtext(user_id||sentence_key))`로 직렬화. 테스트 n을 3~4로 | 중간(추론, 미재현). 실사용에선 연타·중복 전송 정도로 드묾 |
| S3 | `pronunciation_handler.go:132-139` · `speech.go:41-60` | 저장 실패 시 200 + `attemptId:""`/`attemptNo:0`로 답하는 정책이 코드 주석에만 있고 business-rules §5·build-spec §7 편차 로그·계약에 없다. 모바일은 "이번 시도는 저장되지 않았어요"를 알리지 않고 다음 이력에서 조용히 빠진다 | §5 표에 행 추가 + 편차 로그 기록. 모바일은 `attemptId === ''`이면 작은 안내를 띄운다 | 높음 |
| S4 | `mobile/src/api/client.ts:17`(axios 30초) ↔ `azurespeech.go:28`(Azure 30초) | Azure가 느려 28초 걸리고 DB 쓰기까지 30초를 넘으면 앱은 타임아웃으로 "채점 서버가 응답하지 않아요"를 띄우지만 서버는 시도를 저장한다 → 사용자가 다시 녹음 → 체감 1회에 행 2개 | 서버 쪽 Azure 타임아웃을 앱 타임아웃보다 확실히 짧게(예: 15초), 또는 발음 POST만 앱 타임아웃을 늘린다 | 중간 |
| S5 | `[sentenceKey].tsx:415-421, 695` · ko `pron.attemptOf` = "3회 중 {n}회차" | (a) 이력은 문장 진입 시 한 번만 불러온다 → 성공 후 오류로 idle(noSpeech)로 돌아오면 방금 시도가 이력에 없다. (b) 힌트가 `Math.min(3, …)`이라 4회차부터 영원히 "3회 중 3회차". **재시도 3회 제한은 어디에서도 강제되지 않는다** — business-rules R3는 "표시만 최근 3회", §5는 "4회차 이상 정상 저장"이라 제한이 규칙도 아니다. 문구만 제한이 있는 것처럼 읽힌다 | SUCCESS 후 `speechAttempts`를 다시 부른다. 문구를 "{n}번째 시도"처럼 제한을 암시하지 않게 바꾸거나, 정말 3회 제한이 의도라면 규칙으로 올리고 서버에서 강제 | 높음 |
| S6 | `[sentenceKey].tsx:374, 602-613, 879` | `nextText`를 넘기는 호출자가 **0곳** → "다음 문장 ›"이 모든 진입점에서 영구 비활성. business-logic-model §1·frontend-components §5는 "호출자가 준 다음 문장으로 replace"라 했지만 편차 로그에 없다 | 문장 목록이 있는 진입점(scenario sentences, SpeakList)부터 `nextText`를 넘기거나, 편차 로그에 "보류"로 기록 | 높음 |
| S7 | `[sentenceKey].tsx:687` | `splitTargetTokens(referenceText, [])` — 약물명 목록이 항상 빈 배열이라 SoT L77의 약물명 하이라이트(lilac)가 한 번도 켜지지 않는다. 숫자+단위만 동작 | 시나리오의 약물 어휘를 라우트 파라미터나 API로 전달, 또는 편차 로그에 기록 | 높음 |
| S8 | `[sentenceKey].tsx:868-872` | 교정 카드의 재생 버튼이 눌리지만 개발 모드 경고만 찍고 아무것도 안 한다. 드릴 버튼처럼 비활성 표시도 없다 | 음절 구간 재생을 만들기 전까지 버튼을 숨기거나 비활성으로 그린다 | 높음 |
| S9 | `server/internal/adapters/http/pronunciation_handler.go:62` | `referenceText: "   "`는 `== ""` 검사를 통과 → Azure 평가 1회 과금 + 정규화 결과가 빈 문자열인 키로 행 저장. 또 `referenceText` 누락은 business-rules §2의 `invalid_reference_text`가 아니라 "referenceText and audioBase64 are required"로 답한다 | `strings.TrimSpace` 후 빈 값이면 400 `invalid_reference_text`. `/speech/reference`·`/speech/attempts`도 같은 검사 | 높음 |
| S10 | `server/internal/domain/speech/reference.go:131-141` ↔ `azurespeech.go:163, 238` | 참조 도출이 24kHz TTS WAV를 `samplerate=16000` 헤더를 단 `Assess`에 그대로 넣는다. Azure가 RIFF 헤더 대신 Content-Type을 믿으면 음절 Offset/Duration이 1.5배로 늘어난 채 영구 캐시된다(IPA 분절 자체는 T10 실측에서 정상) | 참조 도출 전에 16kHz로 리샘플(스모크가 이미 stdlib로 하는 일)하거나, Content-Type을 WAV 헤더의 실제 샘플레이트로 만든다 | 낮음 — Azure 동작 미확인 |
| S11 | `reference.go:159, 209-212` | `PutReference` 오류를 `_ =`로 버린다. DB 쓰기가 계속 실패하면 `/speech/reference`는 매번 미스 → 매 화면 진입마다 TTS+평가 과금, `/audio.wav`는 방금 합성한 오디오를 두고 404 | 최소한 경고 로그. 쓰기 실패 시 합성 결과를 응답에는 쓰되 과금 카운터에 남긴다 | 중간 |
| S12 | build-spec-index §4·§5·§7, domain-entities §2·§4, business-rules §5 | 문서가 코드보다 뒤처졌다: (a) §5의 "CI에 `TEST_DATABASE_URL` 없음" 미해결 항목은 `fb8988a`로 해소됨 (b) §4 "진입점 2곳: dialogue 🎤"는 `bace12c`에서 dialogue 레일이 빠지고 `/stt` 자동 채점으로 대체됨 — 진입점은 지금 9곳 (c) `session_id`(000025)가 `SpeechAttempt` 엔티티에 없음 (d) origin 허용집합 4개 vs 코드 5개(모바일이 보내는 값은 `review`·`lesson`·`slang`·`home`·`night` 5종 + 서버 `/stt`의 `dialogue`) (e) S3의 저장 실패 정책 미기록 | 해당 절을 갱신하고 편차 로그에 (b)(e)를 추가 | 높음 |
| S13 | 서버·모바일 주석 | 죽은/틀린 주석: `speech_repo.go:24-26`("아직 생성자에 연결 안 됨, Task 3이 한다") · `speech.go:139-142`(History의 문서 주석이 `SpeakLine` 위에 붙어 있음) · `pronTokens.ts:157-162`("팁 매핑이 아직 어떤 응답에도 연결 안 됨" — T11이 연결함) | 주석 정리 | 높음 |
| S14 | 중복 | (a) `voicesByLocale`(`reference.go:25-33`)와 `localeFor`(`pronunciation.go:47-66`)가 다른 패키지의 손 관리 7항목 맵 두 개 — 주석 스스로 "lockstep"을 요구한다 (b) `Record`(`speech.go:90`) + `pron.Assess`(`pronunciation.go:22`)가 프로필을 두 번 읽고, 참조 미스는 세 번 읽는다 — 그 사이 언어를 바꾸면 키의 로케일과 채점 로케일이 갈릴 수 있다 (c) `ListSpeakSentences*` SQL 세 벌이 ORDER BY만 다르다 (d) `Assess`/`Transcribe`의 요청 조립 중복 | (a) 로케일·목소리를 한 표로 (b) `Record`가 로케일을 한 번 구해 포트에 직접 넘기는 `AssessIn(locale)` 추가 (c)(d)는 여유 있을 때 | 높음 |

### 참고 — 개인정보 (판단 필요, 확신 낮음)

- R7(오디오 원본 미저장)은 지켜진다: 서버는 WAV를 어디에도 쓰지 않고(`speech_repo.go`), 요청 로그는 경로만 남기며(`middleware.go:72`),
  모바일은 성공·실패·뒤로 가기·언마운트·하드웨어 미시작 모든 경로에서 파일을 지운다(`[sentenceKey].tsx:477, 491, 558, 569`).
  남는 틈은 앱이 녹음 도중 강제 종료될 때 캐시 디렉터리의 고아 파일뿐이다.
- 다만 `/stt` 대화 채점이 들어오면서 `speech_attempts.recognized`·`reference_text`에 **사용자가 자유롭게 말한 문장**이 무기한 남는다.
  계정 삭제·이력 삭제 경로가 없다(`DELETE FROM users`는 테스트에만 있음; CASCADE는 준비돼 있음). App Store의 계정 삭제 요건과도 닿는다.
- `GET /speech/attempts?text=…`·`/speech/reference?text=…`는 문장을 쿼리스트링에 싣는다. 앱 로그는 경로만 찍지만 Cloud Run의
  요청 로그는 전체 URL을 남길 수 있다 — 자유 발화 문장이 플랫폼 로그에 남는다.
- 다른 사용자 데이터 접근: 이력·세션 리뷰·목록 쿼리는 모두 토큰의 `user_id`로 범위가 걸려 있고, `reviewCardId`는 소유 확인 후 붙는다.
  **스코프 누수는 찾지 못했다.** 참조 캐시는 설계상 전역(R9)이며 사용자 데이터가 아니다.

## 5. 이음매별로 확인했고 문제없던 것

- **원자성(I2):** 시도 행과 음소 행은 한 트랜잭션, 실 DB 강제 실패 트리거 테스트로 롤백 확인.
- **prosody NULL(I-ProsodyOK):** 어댑터 포인터(`azurespeech.go:43`) → 저장 NULL(`speech_repo.go:67-70`) → 조회 `Valid`(`:155`) →
  응답 `prosodyAvailable` → `ScoreBars`가 행을 숨김. 끝까지 이어진다.
- **시도 번호(I5):** 같은 문장 안 `INSERT … SELECT MAX+1` + UNIQUE + 23505 재시도. 2건 경합은 실 DB에서 통과(3건 이상은 S2).
- **Azure 실패 → 저장 안 함:** `Assess` 오류는 `Record`가 저장 전에 반환 → 번호 소비 없음. 무음은 `NBest` 빈 배열 → 422 → 모바일 `noSpeech`.
  4xx·5xx·네트워크는 모바일에서 문구가 나뉜다(`[sentenceKey].tsx:541-555`).
- **참조 캐시 일관성:** 쓰기 경로는 `PutReference`(ON CONFLICT DO NOTHING)와 `UpdateReferenceAudio`(빈 오디오일 때만) 둘뿐이고 둘 다
  선착순이다. 오디오 크기 검사가 두 경로 모두 저장 **전**에 있다. 한 곳에서 지키고 다른 곳에서 깨는 경로는 찾지 못했다.
- **응답 필드 이름:** `SpeechAttemptRow`·`SentenceReferenceRow`의 camelCase 태그와 모바일 타입이 일치한다(B1의 값 문제와 별개).
