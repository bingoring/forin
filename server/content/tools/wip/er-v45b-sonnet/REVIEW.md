# 검토 작업 지시 — 주제 하나 (공통)

당신은 forin(한국인 간호사가 미국 병원 영어를 배우는 앱)의 **콘텐츠 검토자**입니다. ER 부서 주제 하나(부르는 쪽이
알려 줍니다, 아래 `<주제>`)의 학습 콘텐츠를 **전수** 검토하고, 수정 담당이 그대로 반영할 수 있는 목록을 만듭니다.
**대상 파일은 수정하지 마세요.**

## 읽을 것
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v45b-sonnet/BRIEF.md` — 저작 지시서(평가 기준). v45 두 절과 "가벼운 정리 (결정 11)" 절.
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v45b-sonnet/<주제>.yaml` — 대상(단어 전부에 v45 필드, 상황마다 문장과 뉘앙스).
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v45b-sonnet/changes-<주제>.yaml` — 있으면: 저작자가 v44 단어·문장을 바꾼 목록. 바꾼 것이 타당한지도 봅니다.
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v45b-sonnet/base-<주제>.yaml` — 보강 전 원본(비교용).
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v45b-sonnet/in-<주제>.json` — 상황별 장면 설명.

파이썬으로 필요한 필드만 뽑아 표로 보며 읽으세요. **단어 전부·뉘앙스 전부**를 봅니다. 기계 검사는 이미 통과했으니
기계가 못 보는 것을 봅니다.

## 평가할 것
1. 오답(`distractorsEn`) — 헷갈릴 만한가, 품사가 같은가, **정답으로도 맞는 오답은 없는가**.
2. `distractorsKo` — 정답 단어의 다른 뜻을 넣어 정답이 둘이 된 것은 없는가.
3. `cue` — 정답(파생형·약어 포함)을 드러내지 않고 장면이 떠오르는가, `ko`를 되풀이만 하지 않는가.
4. `chips`/`decoyChips` — 의미 있게 잘랐는가.
5. **뉘앙스의 사실 정확성** — `why`·`notes`가 미국 병원의 실제 관행·용어에 맞는가. 틀렸거나 과장된 주장은 빠짐없이.
   특히 **환자 안전**에 관한 오해를 부를 수 있는 것.
6. 뉘앙스 설계 — pair 정답이 하나로만 맞는가(전 조합을 읽을 것), context의 어색한 장면이 "같은 뜻·안 맞는 자리"인가,
   swap을 이어 읽으면 문법이 맞는가, slider 순서가 말이 되는가.
7. v44 단어·문장(결정 11) — 너무 쉬운 단어, 활용형 헤드워드, 부사가 묶인 형용사 헤드워드, 틀린 `ko`, 뜻이 겹쳐 모호한
   쌍, 틀렸거나 부자연스러운 문장. 저작자의 변경 목록이 과하거나 틀린 것도. 확실한 것만.

## 돌려줄 말
- 항목 1~7마다 1~5점, 한 줄 근거
- **사실 오류·심각한 문제** 목록(없으면 "없음")
- **고칠 것** 목록 — 항목마다 "어디(id/상황 제목·문항 종류) · 무엇이 문제 · 어떻게 고칠지" 한 줄. 결정 11 항목은 따로.
- 종합 한두 줄: 고친 뒤 내보내도 되는가.

같은 목록을 `/Users/ywyeom/private/forin/server/content/tools/wip/er-v45b-sonnet/fix-<주제>.md`로도 저장합니다(이 파일은 써도 됩니다).
