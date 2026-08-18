---
build-spec: pronunciation
stage: 02-construction/06-screens-flows
status: IMPLEMENTED
depth: comprehensive
updated: 2026-08-18
---

# Build Spec — 발음·스피킹 피드백 (핸드오프 v22 ⑤b)

> **구현 스펙(Build Spec)** = 코딩 전에 SoT를 라인 단위로 유도해 "다시 유도하지 않고 바로 구현 가능한" 수준으로
> 구체화한 것. (FRAMEWORK "구현 스펙")

## §0. 개요 & 범위

- **목표(한 줄):** 녹음 → 채점 → 음절·음소 단위 교정 → 재시도 루프를 만들고, **그 결과를 영속화**해 이후 드릴·목록이
  설 수 있는 이력을 쌓기 시작한다.
- **SoT(진실 공급원):**
  - `inputs/design-handoff_v22/reference/screen-pronunciation.jsx` — `ScreenPronPractice`(L71–107) ·
    `ScreenPronRecording`(L110–143) · `ScreenPronResult`(L146–218). **이 세 개가 이번 범위.**
    `ScreenPronDrill`(L221–274)은 범위 밖(§0 범위 밖 참조)
  - `inputs/design-handoff_v22/04_SCREENS.md:13` — ⑤b의 4상태 정의
  - 공용 토큰·프리미티브는 `01_DESIGN_TOKENS.md` / `02_COMPONENTS.md`(v21에서 변경 없음)
- **규모/제약:**
  - 화면 3상태(한 라우트), 서버 도메인 1개 신설, 마이그레이션 1개, Azure 어댑터 1개 변경
  - Azure Speech는 **prod에 이미 구성됨**(`AZURE_SPEECH_KEY`는 Secret Manager, `AZURE_SPEECH_REGION=eastus`,
    Terraform `runtime.tf:141`). 키가 비면 발음 기능 전체가 비활성 — 그 경로도 설계에 포함한다
  - 녹음 최대 10초(SoT L90). 오디오 원본은 **저장하지 않는다**(§NFR)
- **깊이 티어 & 사유:** `comprehensive` — 신규 영속화 + 외부 유료 API 호출 경로 변경 + 화면 3상태가 동시에 걸린다.
  특히 Azure 요청 granularity 변경은 **기존에 동작하던 채점 경로를 건드리므로** 회귀 위험이 있다.

### 범위 밖 (다음 단계)

| 항목 | 왜 지금이 아닌가 |
|---|---|
| `ScreenPronDrill`(취약 음소 드릴) | SoT L227이 **"지난 2주간 자주 틀린 음소"**를 전제한다. 이력이 없으면 빈 화면이다. **단 이번 범위가 그 이력을 쌓기 시작한다**(§1의 `speech_phoneme_scores`) |
| `ScreenSpeakList`(11b) | 위와 동일 — 목록에 담을 발화가 아직 없다 |
| 리뷰랩 요약 블록 2종 · 칩 2개 | 말하기 블록은 위 이력에 의존. 모범답안 블록은 기존 `review_cards`만으로 가능하나 리뷰랩 개편과 함께 묶는 편이 낫다 |
| `ScreenModelAnswerList`(11c) | 위와 동일 |

## §1. 분해 (Decomposition)

| 단위 | 책임 | 의존 | 신규/기존 |
|---|---|---|---|
| `adapters/azurespeech` | 요청 granularity `Word`→`Phoneme`, 음절·음소·`ProsodyScore` 파싱 | Azure REST | **기존 변경** |
| `ports.PronunciationResult` | 음절·음소·억양을 담도록 확장 | — | **기존 변경** |
| `db/migrations/000021_speech_attempts` | `speech_attempts` · `speech_phoneme_scores` | `users`, `review_cards` | **신규** |
| `adapters/postgres/speech_repo.go` | 시도 저장·조회, 음소 집계 | pgx | **신규** |
| `domain/speech` | 시도 기록·이력·정준 참조(IPA) 조율 | `ports.PronunciationPort`, `ports.SpeechSynthesizer`, repo | **신규** |
| `domain/pronunciation` | 로케일 해석 + 채점 위임 (그대로) | — | **기존 유지** |
| `adapters/http/speech_handler.go` | `POST /pronunciation` 저장 연결, 이력·참조 조회 | `domain/speech` | 일부 신규 |
| `mobile: app/pronunciation/[sentenceKey].tsx` | 3상태 루프 한 라우트 | expo-audio, api client | **신규** |
| `mobile: components/pron/*` | SoT 1:1 조각(TargetCard·Wave·SyllableGrid·CorrectionCard·ScoreBars) | tokens | **신규** |
| `mobile: components/PronunciationPractice.tsx` | 새 라우트로 흡수 후 제거 | — | **기존 제거** |
| `content: 음소 팁 매핑` | 영어 음소(~44) → 한국어 교정 문구 | — | **신규 저작** |

## §2. 아티팩트 인덱스 (Manifest)

| 아티팩트 | 상태 | 링크 / N/A 사유 |
|---|---|---|
| domain-entities | ✅ | [`./domain-entities.md`](./domain-entities.md) |
| business-rules | ✅ | [`./business-rules.md`](./business-rules.md) |
| business-logic-model | ✅ | [`./business-logic-model.md`](./business-logic-model.md) |
| frontend-components | ✅ | [`./frontend-components.md`](./frontend-components.md) |

## §3. 미해결 질문 (Open Questions)

없음 — 착수 전 확정된 결정은 아래와 같고, 근거는 각 아티팩트에 있다.

| 결정 | 선택 | 근거 |
|---|---|---|
| 점수 이력 저장 위치 | **독립 테이블** `speech_attempts` (+ `review_card_id` nullable FK) | 드릴 발화는 리뷰 카드가 없다 · `ReviewCard`는 SM-2 가변 단일 행인데 시도는 append-only 시계열이다 · 음소 결과는 별도 shape. [domain-entities §3](./domain-entities.md) |
| 참조 IPA 출처 | **TTS로 참조 음성 합성 → 그 음성을 같은 참조 텍스트에 대해 assess → 정준 음소열**, 문장별 캐시 | 연습 대기 화면은 녹음 **전에** IPA를 보여주는데 Azure는 오디오가 있어야 음소를 준다. 3,200 시나리오 손저작은 비현실적이고 **지어내면 안 된다**. 이미 있는 부품(`SpeechSynthesizer` + assess)만 쓴다. [business-logic-model §2](./business-logic-model.md) |
| 문장 식별자 | `sentence_key = sha256(normalize(text) \|\| '\|' \|\| locale)` 앞 32자 | 별도 문장 테이블 없이 카드 없는 발화(드릴·최소대립쌍)도 식별된다 |
| 범위 분할 | 루프 3상태 먼저, 드릴·목록 다음 | 드릴이 전제하는 2주 이력이 아직 없다(§0 범위 밖) |

## §4. 구현 체크리스트

**서버**
- [x] `ports.PronunciationResult`에 `Prosody`, `Words[].Syllables[]`, `Words[].Phonemes[]` 추가
- [x] `azurespeech`: 요청 `Granularity: "Phoneme"`, 응답의 `Syllables`/`Phonemes`/`ProsodyScore` 파싱 — **T10 실측**: 실 Azure
      왕복(로컬 + staging)에서 원문 응답이 진짜 IPA 음소(`ð`·`ə`·`eɪ`…, SAPI `ih`/`iy` 아님)와 0이 아닌 실제
      `Offset`/`Duration`(100ns 단위)을 싣고 온다는 것을 육안 확인 — 문서만으로는(REST 파라미터 표에 `PhonemeAlphabet` 항목
      부재, 예시 JSON이 SDK 형태) 확인 불가했던 두 항목
- [x] `azurespeech`: 기존 Word 전용 응답에도 깨지지 않는지 (`TestParseWordOnlyStillWorks`)
- [x] 마이그레이션 `000021_speech_attempts` up/down (+ `000022_speech_reference_audio`)
- [x] `speech_repo`: `InsertAttempt` · `ListAttempts` · `GetReference`/`PutReference`/`GetReferenceAudio`/`UpdateReferenceAudio`
      (`InsertAttempt`가 같은 트랜잭션에서 `speech_phoneme_scores`도 채운다 — 별도 Upsert 메서드는 아님)
- [x] `domain/speech`: `Record`(채점→저장→시도번호) · `History` · `Reference`(TTS→assess→캐시)
- [x] `POST /pronunciation` 저장 연결(응답에 `attemptId`·`attemptNo` 추가)
- [x] `GET /speech/reference` · `GET /speech/attempts` (+ `GET /speech/reference/audio.wav`, Task 11)
- [x] Azure 미구성 시 503이 아니라 **기능 비활성 신호**를 명시적으로 반환([business-rules §5](./business-rules.md))
- [x] 계약 재생성(`packages/contract`) — `contract.yml`/`deploy.yml`의 drift 게이트가 매 배포마다 재확인

**모바일**
- [x] `app/pronunciation/[sentenceKey].tsx` — 3상태 머신(+ `permissionDenied`/`noSpeech` 포함 실질 5상태). **T10
      시뮬레이터 실측**: `idle`·`permissionDenied` 렌더 확인(강제 상태 주입 — 탭 입력 불가 환경, 아래 §5 참고)
- [x] `components/pron/`: `TargetCard` · `Wave` · `SyllableGrid` · `ScoreBars` · `CorrectionCard` · `AttemptHistory`
- [x] 진입점 2곳 배선: `dialogue/[id].tsx`(🎤 직접 말하기) · 리뷰랩 PhraseCard(🎤 따라 말하기) — **T10에서 결함 발견 후
      수정**: T9가 마이크 액션을 붙인 곳은 `review.tsx`(SM-2 세션 화면)였는데, SoT `04_SCREENS.md:397`이 말하는
      "PhraseCard"는 실제로는 `(tabs)/lab.tsx:204`의 동명 컴포넌트(리뷰랩 탭 목록)였다 — 이름이 같은 두 컴포넌트를
      혼동한 것으로 보인다. T10에서 `(tabs)/lab.tsx`에도 동일 패턴(`practicePronunciation`)으로 🎤를 추가해 닫음.
      시뮬레이터에서 아이콘 렌더 확인(`106cdd2`)
- [x] `PronunciationPractice.tsx` 제거 + 참조 정리 (grep 0건 확인, Task 9)
- [x] 마이크 권한 거부 경로 화면 처리 — **T10 시뮬레이터 실측**: "마이크 권한이 필요해요" + 설정 열기/권한 다시 확인
      버튼 렌더 확인

**콘텐츠**
- [x] 영어 음소 → 한국어 교정 문구 매핑(en-US IPA 49개 전 항목), 현장 위험 맥락 포함(SoT L256 어조)

## §5. 검증 계획

- [x] `go test ./...` = 0 · `tsc --noEmit` = 0 · `npm test` 그린(서버 41 패키지, 모바일 41 스위트/273 테스트) ·
      `gofmt -l` 빈 출력 · `go vet ./...` 클린
- [x] 단위: `azurespeech` 파싱(음소 있는 응답 / 없는 응답 / `NBest` 빈 응답) — 고정 JSON 픽스처
- [x] 단위: `sentence_key` 정규화(`TestSentenceKeyNormalizes`/`TestSentenceKeySeparatesLocales`)
- [x] 단위: 시도 번호 채번이 같은 문장에서 증가하는지 (+ **실 DB**: `TestAttemptNumbering`, `TestRetryResolvesGenuineRace`
      — 동시 요청 경합을 실제로 재현해 재시도가 해소하는지까지 확인)
- [x] 통합: 실 DB에 시도 2건 넣고 `GET /speech/attempts`가 순서·번호를 맞게 주는지 — **T10에서 실제로 `TEST_DATABASE_URL`을
      설정해 돌려봄**(그동안 늘 스킵 상태였다). 그 과정에서 `TestReferenceRoundTrip`이 마이그레이션 000022(`audio_wav
      NOT NULL`) 이후 한 번도 실행되지 않아 깨져 있던 것을 발견·수정(§7 이전 편차 아님, 테스트 자체의 결함)
- [x] **실 Azure 1회 왕복** — 로컬 dev 환경의 실 Azure 키로 1차 실측(원문 JSON에서 IPA 음소·0이 아닌 Offset 확인),
      이어서 **staging에 실제로 배포해 CI가 주입하는 실 `DEV_AUTH_SECRET`으로 재확인**
      (`staging-verified-fdd53c1…`/`-d7cce2a…` 태그, 76/0 통과). 참조 오디오(24kHz)를 그대로 되먹이면 `POST
      /pronunciation`의 16kHz 검증에 걸려 400이 난다는 것도 실측 중 발견 — 스모크가 순수 stdlib로 리샘플링 후 재시도
- [x] 시뮬레이터 시각 검증 — **`forin://` 딥링크가 이 세션에서는 SpringBoard 프롬프트 없이 그대로 동작함을 재확인**
      (기존 문서의 "프롬프트가 뜬다"는 관찰과 다름 · 환경/iOS 버전 차이로 추정, Expo Go는 이 프로젝트의 SDK와
      호환되는 실 빌드가 없어 시도 후 포기). `idle`/`permissionDenied` 두 상태와 두 진입점(dialogue 레일·
      리뷰랩 PhraseCard) 렌더 확인. **탭/터치 주입 자체는 이 환경에 수단이 없어(idb 없음, `simctl`엔 탭 API가 없고
      osascript 좌표 클릭은 신뢰할 수 없었다) 녹음→채점→결과로 이어지는 실제 제스처 주도 전이는 확인하지 못했다**
      — `permissionDenied`는 코드 레벨에서 초기 상태를 일시적으로 주입해(hot-reload, 커밋 안 함) 렌더만 확인
- [x] 스모크 스크립트에 발음 경로 assert 추가 — 22건, 로컬 79/0·staging 76/0(review-card 삭제 검사는 로컬 전용 DB
      직결이라 staging에서는 구조상 스킵)

## §6. NFR · 성능

| 항목 | 목표 | 측정 |
|---|---|---|
| 채점 왕복 | p95 < 3.5s (녹음 종료 → 결과 렌더) | 서버 로그 + 화면 타이머 |
| 참조(IPA) 조회 | 캐시 히트 시 < 150ms | 캐시 미스는 1회만 발생해야 한다 |
| Azure 호출 수 | 시도당 **1회**. 참조는 문장당 평생 1회(TTS 1 + assess 1) | 호출 카운터 |
| 저장 크기 | 시도 행 + 음소 행. **오디오 원본은 저장하지 않는다** | 개인정보 최소 수집 — 음성은 채점 후 폐기 |
| Azure 미구성 | 앱이 죽지 않고 발음 기능만 숨는다 | `AZURE_SPEECH_KEY` 빈 환경에서 기동·화면 진입 확인 |

## §7. 편차 로그 (Deviations) — 구현 후

| SoT | 실제 구현 | 사유 |
|---|---|---|
| 화면 3상태(`ScreenPronPractice`/`Recording`/`Result`) | **`scoring` 상태 추가** — `PronState`는 `idle · recording · scoring · result · permissionDenied · noSpeech`의 실질 6상태 | 정적 목업엔 네트워크 대기가 없다. `POST /pronunciation`은 Azure 왕복(실측 p95 수 초)이 끼는 실호출이라, 녹음 종료와 결과 렌더 사이에 "채점 중" 화면이 없으면 사용자가 멈춘 걸로 오인한다 |
| `ScreenPronDrill`(SoT L221–274, "약한 음소만 드릴하기") | 버튼을 **렌더는 하되 비활성**으로 둠(`disabled`, "드릴 기능은 곧 제공돼요") | §0 범위 밖 결정 그대로 — 드릴은 "지난 2주 이력"을 전제하는데 이번 범위가 그 이력(`speech_phoneme_scores`)을 쌓기 "시작"할 뿐이라 아직 없다. 버튼 자체를 숨기지 않은 것은 SoT 레이아웃을 유지하고 다음 단계가 이미 예정돼 있음을 알리기 위함 |
| SoT는 완성도(`completeness`)·인식 텍스트(`recognized`)를 화면에 노출 | 결과 화면은 accuracy·fluency·prosody 3축만 그린다(`ScoreBars.tsx`, SoT L160–168 그대로) | SoT의 결과 카드 자체가 3축만 그리도록 설계돼 있음 — 필드는 API 응답에 여전히 존재하고 버려지지 않았다(구 위젯 제거 시 T9가 확인). 표시하지 않는 것으로 결정된 상태 |

## §8. 닫지 못한 확인 (T10, 2026-08-18)

전 항목이 통과해 `IMPLEMENTED`로 올리지만, 아래 한 가지는 **증명하지 못한 채로 남긴다** — 확인했다고 적지 않는다.

- **staging에 실제로 존재했을 "레거시" `speech_references` 행(마이그레이션 000022 이전, `audio_wav`가 진짜 비어
  있던 행)에 백필이 적용됐는지는 확인하지 못했다.** Cloud SQL 직접 접근·`gcloud secrets versions access`가 이
  세션의 권한 분류기에 의해 차단됐다(민감한 자격증명/DB 접근이라는 판단으로 보인다 — 시도하되 우회하지 않음).
  대신 (1) 백필 SQL 자체가 실 Postgres에서 올바르게 동작함은 새로 추가한 통합 테스트로 증명했고(레거시 모양
  행을 SQL로 직접 심어 검증, `TestUpdateReferenceAudioBackfillsLegacyRow`), (2) staging은 이번 태스크 이전에는
  스모크가 `/speech/reference`를 아예 건드리지 않았다는 사실(기존 57-assert 스크립트에 이 경로가 없었음)로 미루어
  **staging에 애초에 "레거시" 행이 존재했을 가능성 자체가 낮다**고 판단한다 — 즉 이 항목은 "백필이 실패했다"가
  아니라 "백필할 대상이 staging에 있었는지조차 불확실하다"는 뜻이다. 확실히 하려면 Cloud SQL에 대한 사람의
  직접 확인이 필요하다.
