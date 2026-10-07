# T5 보고 — 콘텐츠 기반(스키마·검사기·지시서) (2026-10-07)

범위: 학습 화면 v46의 새 콘텐츠 필드를 Go 구조체·YAML·DB·`GET /me/lesson/{id}`·모바일 타입까지 실어 나르고,
Go·파이썬 검사기와 저작·파이프라인 지시서를 갖춘다. **ER 저작은 하지 않았다**(다음 단계, 결정 14 파이프라인).
정본 모양은 Build Spec §D(확정판).

## 확정한 필드 모양

전부 선택 필드 — 없으면 §R3 대체, 있으면 검사.

| 자리 | 필드 | 모양 | 규칙 |
|---|---|---|---|
| 문장 | `tag` | string | 비어 있지 않음, ≤10자 (V18) |
| 문장 | `icon` | string (NbIcon) | 비어 있지 않음, NbIcon 이름 (V18) |
| 문장 | `why` | string | 비어 있지 않음 (V18) |
| 문장 | `decoy` | string | 그 문장 청크가 아니고 `en` 안에 없음 (V18) |
| 문장 | `distractorsKo` | string[2] | 정확히 2, 서로 다르고 `ko`와 다름 (V18) |
| 문장 | `blank` | `{answer, options: [{en, icon}]×4}` | `answer`가 `en`에 낱말 경계로 정확히 한 번, 선택지 4·서로 다름·answer 포함·icon (V18) |
| 상황 | `order` | `{tag?, icon?, ko, why, lines: [{en, icon, ko?, note?}]×4}` | `ko`·`why` 필수, 정확히 4줄, `en`·`icon` 필수, `en` 겹침 없음, 문장 없는 상황엔 불가 (V19) |
| context | `word` + `ko` | string, string | 둘 다 있거나 둘 다 없음 (V14) |
| swap | `ko` | string | 있으면 비어 있지 않음, 꼬리 "— 라고 전해야 해요"는 화면이 붙임 (V14) |

스펙 초안과 달라진 것: `blankIcons`(아이콘만) → **`blank`(문구+아이콘 저작)**, listen 오답 뜻 **`distractorsKo` 추가**(참조 `opts`가
저작함), order 줄의 `ko`·`note`는 참조에 없어 **선택**(교정노트·"공감 → 이유 …" 요약용), 참조 `shuffled`·카드 `en`·listen 선택지 아이콘·
문장 `type`은 싣지 않음(v46이 안 그리거나 런타임이 정함).

## 실어 나르기

- Go: `content.Sentence` 6필드 + `SentenceBlank`/`BlankOption`, `Scenario.Order` → `SentenceOrder`/`OrderLine`, `Nuance.Ko`.
  `cmd/gencontent` Seed가 `order`를 받아 그대로 옮기고 같은 검증을 돈다. 재생성 결과 바이트 변화 없음(새 필드 `omitempty`).
- DB: 문장 필드는 `scenarios.sentences` jsonb 안. order는 **새 컬럼 `scenarios.lesson_order jsonb`(NULL = 저작 전)**,
  마이그레이션 **000043**, sqlc 재생성(1.31.1), `content_repo.scenarioParams`(Seed와 테스트가 같은 매핑). `forin_test` DB에 migrate up
  해 왕복 테스트를 실제로 돌렸다(NULL 저장·복원 포함). **개발 DB `forin`은 아직 42** — 시드 전에 `make migrate-embed`.
- API: `lessonResp.order`(없으면 키 없음). 문장은 `content.Sentence`를 임베드해 새 필드가 그대로 실린다. 계약 `packages/contract` 갱신.
- 모바일: `client.ts`의 `LessonSentence`(6필드)·`LessonBlank`·`LessonOrder`·`LessonNuance.ko`·`LessonDetail.order`. 화면은 손대지 않음.

## 검사기 (Go·파이썬 같은 규칙)

- Go `content/lessonv46.go`: `ValidateSentenceV46`(V18)·`ValidateOrder`(V19)·`validateNuanceV46`(V14)·`CountWordOccurrences`.
  `ValidateBundleLessons`(적재 시)와 gencontent(생성 시) 둘 다에서 돈다.
- 파이썬 `verify_lesson_content.py`: 같은 규칙(+V11 문자열 타입), `count_word_occurrences` 동일 정의. NbIcon 집합은 이제
  `mobile/src/components/nb/NbIcon.tsx`에서 직접 읽는다(저장소 밖에서는 대체 목록). `verify_one_theme.py`가 산출물의 `order`도 얹어 검사.
- 비대칭 하나: Go는 `omitempty` 문자열이라 `why: ""`와 키 없음을 구별 못 해 공백만 있는 값을 잡고, 파이썬은 빈 문자열도 잡는다.
- 모바일 `contentIcons.test.ts`: 보상 아이콘 스캔에서 `sentences:`·`order:` 블록을 떼고 NbIcon 스캔에 넣음, 분리기를 인라인 YAML로
  단위 시험, **파이썬 대체 목록 == NbIcon 유니온** 단언(작업 중 상대 에이전트가 `faceWorried`를 그리자 바로 잡혀 목록에 더함).

## 합치기·뽑기

- `merge_dept_lessons.py`: 문장 v46 필드(고정 순서)·`order:` 블록(블록 YAML — 아이콘 검사가 읽는 꼴)을 쓴다. `strip`이 `order:`도 뗀다.
  **정본과 값이 같은 블록(문장·뉘앙스·order·은행)은 원문 줄을 그대로 둔다** — 손으로 쓴 `feels: [...]`(ER 릴 17개)·따옴표 없는
  `icon: board`(ICU·OR 은행)가 다시 쓰여 diff가 생기던 것을 막았다. 보강 경로는 v46 필드가 오면 `--replace`로 다시 돌리라고 멈추고,
  `--replace`는 정본의 뉘앙스·order를 빠뜨린 산출물을 거절한다.
- 새 `export_dept_lessons.py`: 정본 → `base-<주제>.yaml`(단어·문장·뉘앙스·order). `--roundtrip <부서>`는 임시 사본에서 뽑기 →
  `--replace` 합치기 → 바이트 비교. **ER·ICU·OR 전부 바이트 동일.** v46 필드를 얹은 사본 합치기 → 다시 뽑아 합치기도 동일, diff에는 새 줄만.

## 커밋 (feat/journey-ia, 전부 push)

- `af9c086` feat(content): 학습 v46 선택 필드 — 문장 tag·icon·why·decoy·distractorsKo·blank, 상황 order, 뉘앙스 ko와 검증 V18·V19
- `eb7948f` feat(lesson): 순서 배열 카드를 DB와 응답까지 — scenarios.lesson_order 컬럼, GET /me/lesson/{id}의 order
- `8c2cbef` feat(content): 검사기에 v46 — V18·V19·V14, NbIcon 이름은 NbIcon.tsx에서 읽는다
- `d32afd4` feat(content): 합치기가 v46 필드와 order를 싣는다 — 원문 그대로, 빈 합치기 바이트 동일 검사(export --roundtrip)
- `5067568` feat(lesson): 모바일 API 타입에 v46 필드 — 아이콘 검사가 sentences·order 블록까지 본다
- `fbeed86` docs(content): 저작·파이프라인 지시서에 v46 절
- 문서: 이 보고·§D 확정·STATUS (docs/dlc 서브모듈) + 메인 포인터

## 테스트

`go build/vet/test -count=1 ./...` 그린(DB 왕복은 `TEST_DATABASE_URL=…/forin_test`로 따로 실행해 통과) · `verify_lesson_content.py --selftest`
ALL PASS(v46 사례 41건 추가) · `--dept er --baseline HEAD --changes changes/er` 위반 0 · 모바일 jest 169 스위트 1,204건 그린, `tsc` 통과 ·
빈 합치기 ER/ICU/OR 바이트 동일. 새 규칙마다 일부러 깨뜨려 실패 확인(Go 6, 파이썬 8, DB 2, 모바일 분리기 1).

## 다음 단계(ER 저작) 구현자가 알아야 할 것

1. **보강은 `--replace` 하나.** `export_dept_lessons.py er <작업 폴더> <주제>` → 저작(TASK.md "v46 보강", Sonnet) → `verify_one_theme.py` →
   검토(REVIEW.md "v46", Opus) → 수정(FIX.md) → `merge_dept_lessons.py er <디렉터리> --replace` → `go run ./cmd/gencontent` →
   `verify_lesson_content.py --dept er --baseline HEAD --changes changes/er` 0건. 산출물에서 `nuance:`를 빼면 합치기가 멈춘다.
2. **DB 마이그레이션 000043**이 먼저 돌아야 order가 앱에 간다(개발 DB `forin`은 아직 42 — 손대지 않았다).
3. 아이콘은 NbIcon 이름만(`faceWorried`는 이제 있다). 검사기가 NbIcon.tsx를 직접 읽으므로 새 아이콘을 쓰려면 먼저 그려야 한다.
4. 기계가 못 보는 것: `why`의 사실성·`ko` 되풀이, 빈칸 오답이 정답으로도 맞는지, decoy로 정답을 달리 조립할 수 있는지, order의
   인접 교환이 자연스러운지 — REVIEW.md "v46"이 스크립트로 전부 뽑아 보게 했다.
5. 블록 원문 보존 덕에 합친 뒤 `git diff`에는 새 필드만 보여야 한다. 기존 줄이 바뀌어 보이면 산출물이 v44/v45 값을 건드린 것이다.
6. 화면(T4)은 이 필드가 없어도 돌아야 한다(§R3 갱신: `distractorsKo`·`blank`·context `word/ko`·swap `ko` 없을 때의 대체 포함).
