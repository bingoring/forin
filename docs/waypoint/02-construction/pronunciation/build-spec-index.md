---
build-spec: pronunciation
stage: 02-construction/06-screens-flows
status: DRAFT
depth: comprehensive
updated: 2026-08-15
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
| domain-entities | ☐ | [`./domain-entities.md`](./domain-entities.md) |
| business-rules | ☐ | [`./business-rules.md`](./business-rules.md) |
| business-logic-model | ☐ | [`./business-logic-model.md`](./business-logic-model.md) |
| frontend-components | ☐ | [`./frontend-components.md`](./frontend-components.md) |

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
- [ ] `ports.PronunciationResult`에 `Prosody`, `Words[].Syllables[]`, `Words[].Phonemes[]` 추가
- [ ] `azurespeech`: 요청 `Granularity: "Phoneme"`, 응답의 `Syllables`/`Phonemes`/`ProsodyScore` 파싱
- [ ] `azurespeech`: 기존 Word 전용 응답에도 깨지지 않는지 (음절·음소 부재 시 빈 슬라이스)
- [ ] 마이그레이션 `000021_speech_attempts` up/down
- [ ] `speech_repo`: `InsertAttempt` · `ListAttemptsBySentence` · `UpsertPhonemeScores` · `GetReference`/`PutReference`
- [ ] `domain/speech`: `Record`(채점→저장→시도번호) · `History` · `Reference`(TTS→assess→캐시)
- [ ] `POST /pronunciation` 저장 연결(응답에 `attemptId`·`attemptNo` 추가)
- [ ] `GET /speech/reference` · `GET /speech/attempts`
- [ ] Azure 미구성 시 503이 아니라 **기능 비활성 신호**를 명시적으로 반환([business-rules §5](./business-rules.md))
- [ ] 계약 재생성(`packages/contract`)

**모바일**
- [ ] `app/pronunciation/[sentenceKey].tsx` — 3상태 머신
- [ ] `components/pron/`: `TargetCard` · `Wave` · `SyllableGrid` · `ScoreBars` · `CorrectionCard` · `AttemptHistory`
- [ ] 진입점 2곳 배선: `dialogue/[id].tsx`(🎤 직접 말하기) · 리뷰랩 PhraseCard(🎤 따라 말하기)
- [ ] `PronunciationPractice.tsx` 제거 + 참조 정리
- [ ] 마이크 권한 거부 경로 화면 처리

**콘텐츠**
- [ ] 영어 음소 → 한국어 교정 문구 매핑(~44개), 현장 위험 맥락 포함(SoT L256 어조)

## §5. 검증 계획

- [ ] `go test ./...` = 0 · `tsc --noEmit` = 0 · `npm test` 그린
- [ ] 단위: `azurespeech` 파싱(음소 있는 응답 / 없는 응답 / `NBest` 빈 응답) — 고정 JSON 픽스처
- [ ] 단위: `sentence_key` 정규화(대소문자·양끝 공백·로케일 차이가 키를 가르는지)
- [ ] 단위: 시도 번호 채번이 같은 문장에서 1,2,3으로 증가하는지
- [ ] 통합: 실 DB에 시도 2건 넣고 `GET /speech/attempts`가 순서·번호를 맞게 주는지
- [ ] **실 Azure 1회 왕복**: 음소 granularity 응답이 실제로 음절·음소를 담는지 — 픽스처가 아니라 실측. 이 프로젝트의
      반복 교훈("배선이 맞다"와 "실제로 돈다"는 다른 사건)
- [ ] 시뮬레이터 시각 검증: 3상태 각각을 SoT와 대조. 검증은 Expo Go `exp://` 딥링크로 진입한다
      (`forin://`는 SpringBoard 프롬프트가 떠서 자동화가 막힌다 — 기존 인테리어 검증에서 확립된 절차)
- [ ] 스모크 스크립트에 발음 경로 assert 추가

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
|  |  |  |
