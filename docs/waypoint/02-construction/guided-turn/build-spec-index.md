---
build-spec: guided-turn
stage: 02-construction / 06-screens-flows (커리큘럼 다이얼로그 · 가이드 턴 재설계)
status: IN_PROGRESS
depth: comprehensive
updated: 2026-09-04
---

# Build Spec — 커리큘럼 다이얼로그 가이드 턴 재설계 (모국어 의도 → 마이크 발화 → 즉시 교정)

가이드 패스(커리큘럼 시나리오의 첫 관통)의 한 턴을, **타겟 언어 보기 중 고르기**에서
**모국어 의도 보기 중 고르기 → 마이크로 타겟 언어 발화 → 전송 직후 즉시 교정**으로 바꾼다.
학습자가 이 턴에서 실제로 하는 일을 "보기 읽고 고르기"에서 "상황에 맞는 문장을 스스로
만들어 말하기"로 옮기는 게 목적이다. 프리셋(미리 작성된 보기·응답)은 걷어내고 모든 턴이
학습자의 실제 발화에 LLM으로 반응한다.

| | |
|---|---|
| 대상 화면 | `mobile/src/app/dialogue/[id].tsx` (guided 패스) |
| 서버 | `conversation/{choices,engine,script}.go` · `conversation_handler.go` |
| 결정 근거 | 사용자 브레인스토밍(2026-09-04): 평가 시점·입력 방식·NPC 출처·전송 게이트 4결정 확정 |

## §0. 현재 상태 지도 (착수 시점)
```
✅ 가이드 보기        conversation/choices.go SuggestReplies — 타겟 언어 3지선다 {tier, text(타겟), why(모국어)}
✅ 스크립트 우선경로   choices.go:72 ScriptedChoices / engine.go scriptedReply — authored 시나리오(≈28개)만
✅ STT+채점           /stt(pronunciation_handler.go) — sessionId 있으면 scoreDictation, 응답에 Overall/Accuracy/Fluency
✅ 배경 교정          engine.go:364/430 fileCorrection — 매 턴 학습자 발화 AI 교정 → 복습 카드(교정노트/모범답안). 지금은 백그라운드.
✅ 스트리밍 SSE        sendMessageStream(client.ts) ↔ parseSseLines(delta/mood/improved/resolved/missions/error/done)
✅ 온보딩 타자기       (onboarding)/passport.tsx useTypewriter — 문자열 .slice(0,n) 한 글자씩
⚠️ 보기 언어          text=타겟(영어). 학습자는 이걸 "읽고 고름" — 작문을 안 함
⚠️ 프리셋 즉시전송     scripted 보기는 탭 즉시 send, LLM 보기는 탭 후 별도 send (불일치)
⚠️ transcribe()       client.ts:882 — /stt 응답에서 text만 읽고 점수 버림(현재 어차피 발음은 인라인 안 씀)
⚠️ NPC 대사           스트리밍은 토큰 청크 단위, 오프닝 대사는 한 번에 등장 — 글자 단위 아님
```

## §1. 핵심 결정 (브레인스토밍 확정)
- **D1 · 다국어 불변식 (최우선 가드레일).** 의도 보기는 사용자의 **모국어**(`langContext.Native`, 프로필 `nativeLang` 파생), 발화·모범문은 **타겟 언어**(`langContext.Target`, `targetLang` 파생)로 생성한다. 두 축 모두 설정에서 변경 가능하므로 **어느 쪽도 한국어/영어로 하드코딩하지 않는다.** 프롬프트·UI 문구·테스트 모두 이 축을 따른다. (i18n Build Spec의 "locale는 서버가 프로필에서 파생, 클라가 보내지 않는다"와 일관.)
- **D2 · 입력 방식.** 모국어 의도 보기 2~3개 → **택1** → 그 의도를 **타겟 언어로 마이크 발화**해야 전송 활성. 보기의 타겟 언어 `text`는 숨긴 모범문으로 유지(교정 근거 + 완료 화면 모범답안 + "막히면 보기" 힌트).
- **D3 · 즉시 평가 = 발음 아님, "고른 의도와의 부합 + 문법/어휘".** 상황 전반 적절성 판단이 아니라 **학습자가 고른 의도 보기와 문맥상 통하는가 + 타겟 언어 문법/어휘가 맞는가**로 좁힌다. 근거가 확실(고른 의도 + 숨은 모범문)하고 값이 싸다. 인프라는 기존 `fileCorrection`을 **의도 근거를 받아** 확장.
- **D4 · 평가 시점 = (A) 전송 후 즉시 표시.** 발화→즉시 전송하고, 서버가 이미 계산하는 교정을 **응답 스트림에 `correction` SSE 프레임으로 실어** 내 말풍선 아래에 즉시 표시(왕복 1회, 추가 LLM 호출 없음). NPC 대사가 이어서 등장. **전송은 교정·부합 여부와 무관하게 항상 가능**(게이트 없음). "발화 전 고쳐 다시 말하기"(B안)는 수익화 이후 옵션.
- **D5 · 프리셋 전면 제거 (전부 LLM).** `SuggestReplies`의 `ScriptedChoices` 우선경로와 `engine.scriptedReply` 경로를 제거 → 모든 턴이 실제 발화에 LLM으로 반응. `script.go`와 authored `choices` 콘텐츠(scn-orient-00001, greet-wards 등)는 사용 중단·정리 대상.
- **D6 · NPC 대사 타자기.** 오프닝·스트리밍 대사 모두 **글자 단위**로 노출(온보딩 `useTypewriter` 패턴 재사용). 스트리밍 중엔 수신 버퍼를 앞지르지 않게 따라간다.
- **D7 · 발음 연습 분리.** 다이얼로그 턴에서 인라인 발음 점수는 두지 않는다. 발음은 검증된 문장 대상 반복 드릴(리뷰랩 말하기 + 모범답안 "따라 말하기")로 분리 유지. 선택적 "이 표현 발음 연습"은 모범문 대상으로만(후속, 이 스펙 범위 밖).
- **D8 · 없어지는 것.** #1 인위적 로딩(마이크·STT·교정이 자연스러운 기다림을 만듦), 프리셋 즉시전송 경로.

## §2. 데이터 흐름 (한 턴)
```
[모국어 의도 보기 N개]  ← GET /conversation/{sid}/choices (choices.go, promptNative 추가)
      │ 택1
      ▼
[마이크] → 녹음 → POST /stt → 타겟 언어 인식 텍스트 → 입력 칸 채움
      │ (발화/타이핑 있으면 전송 활성)
      ▼
POST /conversation/{sid}/stream  { text, intent }   ← intent = 고른 보기(모범문 또는 choiceId)
      │
      ├─ SSE correction  { corrected, note, matches }  ← fileCorrection을 intent 근거로, 스트림에 실어 즉시
      │        → 내 말풍선 아래 인라인 표시 + (기존처럼) 복습 카드 저장
      └─ SSE delta…      NPC 대사 스트리밍 → 타자기로 글자 단위 노출
```

## §3. 분해
| # | 단위 | 파일 |
|---|---|---|
| S1 | 보기 프롬프트에 **모국어 의도(`promptNative`)** 추가 + `ReplyChoice`/계약 확장. 타겟 `text`는 유지(숨김) | `server/internal/domain/conversation/choices.go` · `internal/adapters/http/conversation_handler.go` · `mobile/src/api/client.ts` |
| S2 | 프리셋 제거: `SuggestReplies` 스크립트 우선경로 + `engine.scriptedReply` 경로 제거(전부 LLM) | `conversation/choices.go` · `conversation/engine.go` · (`script.go` 정리) |
| S3 | 전송에 `intent` 수신 → 교정을 **의도 근거**로 평가 → **`correction` SSE 프레임 방출**(백그라운드→스트림) | `conversation/engine.go`(SendMessageStream 경로) · `internal/adapters/http/conversation_handler.go` |
| S4 | 클라 SSE 파서에 `correction` kind 추가 | `mobile/src/api/sseFrames.ts` · `client.ts` sendMessageStream |
| S5 | 클라 가이드 UI 재작성: 모국어 의도 택1 → 마이크 발화 → 전송 → 인라인 교정 | `mobile/src/app/dialogue/[id].tsx` · `components/dialogue/ReplyChoices.tsx` |
| S6 | NPC 대사 타자기(공용 훅 추출) | `mobile/src/components/dialogue/Typewriter.tsx`(신규, passport 패턴 이관) · `dialogue/[id].tsx` |
| S7 | 정리: #1 로딩 흔적·scripted 콘텐츠·미사용 코드 제거, 문서/STATUS 갱신 | — |

## §4. 체크리스트
- [ ] S1: `promptNative`가 **`lc.Native`로** 생성(한국어 하드코딩 아님)·타겟 `text` 유지·계약(openapi/types) 재생성·서버·클라 tsc 0
- [ ] S2: scripted 경로 제거 후 **모든 시나리오가 LLM 보기/응답**·기존 테스트(scriptedPass 등) 정리·회귀 없음
- [ ] S3: 전송이 `intent` 전달·교정이 의도 근거로 평가·`correction` 프레임이 delta보다 먼저 방출·복습 카드 저장 유지
- [ ] S4: 파서가 `correction` 프레임 파싱(기존 kind 회귀 없음)·framing 테스트
- [ ] S5: **의도 선택 전 마이크 없음 · 발화/타이핑 전 전송 불가 · 모킹 STT로 칸 채움 · `correction` 이벤트로 인라인 교정 표시** (스크린 테스트)
- [ ] S6: 타자기 점진 노출(수신 버퍼 앞지르지 않음)·오프닝/스트리밍 모두
- [ ] S7: go test·jest·tsc 0 · 다국어 회귀(모국어=일본어 등에서 의도가 일본어로) 확인 · STATUS 갱신
- [ ] V: 시뮬레이터 happy-path(의도 택1→발화→즉시 교정→NPC 타자기)·promote·ota

> **검증 관점(through-line):** 각 신규 가드는 관측 가능한 것을 검증하고 변이로 실패를 확인한다. 특히 **다국어 불변식**은 모국어를 영어 아닌 값으로 바꾼 케이스로 의도 언어가 따라오는지 테스트한다(한국어/영어 하드코딩 회귀 방지).
