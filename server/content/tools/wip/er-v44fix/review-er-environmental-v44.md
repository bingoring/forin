# er-environmental — v44 수정 재검토 (Opus)

비교: 정본에서 새로 뽑은 파일(고치기 전)과 `wip/er-v44fix/base-er-environmental.yaml`을 필드 단위로 대조했다.
상황 번호는 1부터 센다. 괄호 안은 `v44fix-items.md`의 번호다.

## 판정 요약
- **목록 대조:** 5행이 모두 반영됐다(14.1·14.4, 12.5, 5.3/5.6, 6.2, `w-clothes`). 빠진 행은 없다.
- **목록 번호가 1부터 시작한 것:** 맞다. 이 주제의 v46 검토는 문장 번호를 1부터 셌다(14.1 = S14의 첫 문장).
  수정자는 옛 `en`을 assert로 대조해 위치를 잡았으므로 엉뚱한 문장을 고친 곳은 없다.
- **14.1·14.4 (통역사에게 3인칭으로 묻던 문장):** 바르게 고쳤다. 두 문장 모두 보호자에게 1인칭으로 직접 묻는다.
  context 장면 `fix`도 이미 같은 문장(`How high did he climb, and how fast?`)이라 맞는다.
  `chunks`의 `', and how fast'`는 V5 이음 규칙(쉼표로 시작하는 조각은 붙임)에 맞다.
  `w-interpreter` 태그를 뺀 것도 맞다. S14 문장 2·문장 5가 계속 쓴다.
- **5.6 (새로 쓴 문장) `Big gulps can upset your stomach and make you throw up.`:** 10단어로 사실에 맞고 간호사가 실제로 하는 말이다.
  `ko`도 같은 뜻이다. 5.3(조금씩이 낫다)이 방법이고 5.6이 이유라 이제 겹치지 않는다.
  빈칸·decoy·tag도 문제없다.
- **12.5 (새로 쓴 문장):** 아래 1번처럼 다시 고친다.
- **6.2:** 맞다. order L2도 같이 고쳐졌다.
- **changes 파일:** 실제로 바뀐 v44 키와 일치한다.
  - 14.1 `[en,ko,chunks,words]`
  - 14.4 `[en,ko,chunks]`
  - 12.5 `[en,ko,chunks]`
  - `w-pull` `[example]`
  - 6.2 `[en,chunks]`
  - 5.6 `[en,ko,chunks,words]`
- **keyPhrase:** 14.1과 6.2가 keyPhrase이고, `keyphrases.tsv`의 두 줄이 새 `en`과 글자 그대로 같다.
- **검사:** keyPhrase를 바꾼 스크래치 시드로 `verify_one_theme.py`를 돌렸다. 위반 0, W14 0이고 `==> 통과`가 나왔다.

## 고칠 것

### 1. S12 문장 4 (목록 12.5): 구조한 사람이 시드와 어긋난다 [뜻·맥락]
- **문제:**
  - 이 상황의 정본 시드는 `role: family`이고, 보호자는 persona `Josh Palmer (friend)`다.
    tagline은 `"He fell through the ice — we pulled him out but he's freezing and coughing."`로, 보호자 자신이 꺼냈다고 말한다.
  - 그런데 새 문장 `The rescuers pulled him out…`은 간호사가 그 보호자에게 "구조대가 꺼냈다"고 알려 주는 말이 된다.
    없는 제3자를 만들고, 보호자가 더 잘 아는 사실을 간호사가 설명하는 꼴이다.
  - 보호자가 꺼냈다는 사실을 간호사가 되짚어 확인하는 말로 바꾼다.
  - 덧붙여 decoy `a long time`을 넣으면 `…of the ice water a long time ago.`가 맞는 영어로 조립된다.
- **바꿀 값:**
  - `en`: `So you pulled him out of the ice water a few minutes ago?`
  - `ko`: `몇 분 전에 얼음물에서 끌어내셨다는 거죠?`
  - `chunks`: `["So you pulled him out", "of the ice water", "a few minutes", "ago", "?"]`
  - `words`: 그대로(`w-pull`, `w-ice`, `w-water`)
  - `tag`: `경위 확인`
  - `icon`: 그대로
  - `why`: `So…?로 들은 경위를 되짚어 확인해요. 물에서 나온 시점은 저체온 정도와 치료를 정하는 단서라서, 꺼낸 사람에게 시간을 다시 확인해요.`
  - `decoy`: `did he go`
    - 자리마다 조립해도 맞는 문장이 되지 않는다. S12 문장 2의 `did he go under`와 헷갈리게 하는 오답이다.
  - `blank`: `answer: pulled`, 선택지 `pulled / poured / washed / dropped`
    - 지금 빈칸 `ago`의 선택지는 `later / away / early`다.
    - 이 가운데 `a few minutes later?`·`a few minutes early?`는 기준 시점만 있으면 성립하는 영어라 정답이 여럿이 된다.
    - 이 장면의 핵심 동사(`w-pull`)로 옮긴다.
  - `distractorsKo`: 그대로
- **단어:** `w-pull`
  - `example`: `So you pulled him out of the ice water a few minutes ago?`
  - `exKo`: `몇 분 전에 얼음물에서 끌어내셨다는 거죠?`
  - `cue`: 그대로(`'___ed him out'`)
- **changes:** 기존 12.5 항목(`[en,ko,chunks]`)과 `w-pull` `[example]` 항목은 그대로 둔다. `why` 문구만 바꾼다.
  - 12.5 항목: `구조한 사람이 보호자(시드 tagline "we pulled him out")라 간호사가 그 사실을 되짚어 확인하는 말로`
  - `w-pull` 항목: `예문이 12.5 en과 같아 새 en으로 맞춤`

### 2. S14 문장 3 (목록 14.4) 빈칸: 정답이 둘이 된다 [빈칸]
- **문제:** `Can you show me how high he climbed and how quickly?`는 지도나 휴대폰으로 보여 달라는 말로 성립한다.
- **바꿀 값:** 선택지 `show` → `teach`
  - 바꾼 뒤의 선택지는 `tell / teach / lend / hide`이고, 정답은 `tell` 그대로다.

### 3. 단어 `w-interpreter` 예문에 고친 잘못이 남아 있다 [문법·뜻, 목록 14.1의 뜻]
- **문제:** `example: Through the interpreter — how high did he climb?`는 14.1에서 지운 바로 그 모양이다.
  통역사를 거쳐 3인칭으로 부탁하는 말이다. 정본 문장과는 같지 않고 lexicon 예문에만 있다.
  - 문장을 고친 이유가 그대로 적용되므로 같이 고친다.
- **바꿀 값:**
  - `example`: `We'll explain everything slowly through the interpreter.` (S14.5 `en`과 같음)
  - `exKo`: `통역을 통해 천천히 다 설명해 드릴게요.`
  - `cue`는 그대로다.
- **changes:** `kind: word`, `id: w-interpreter`, `fields: [example]`, `why: 'v46 검토 결정 11 예외: 예문이 통역사에게 3인칭으로 부탁하는 모양(14.1에서 고친 것)이라 직접 설명하는 문장으로'`

### 4. (선택) S14 문장 0과 문장 3이 같은 질문이 됐다 [문체·선호]
- **문제:**
  - 고친 뒤 14.1(`How high did he climb, and how fast?`)과 14.4(`Can you tell me how high he climbed and how quickly?`)가 같은 것을 묻는다.
  - 5.3/5.6에서 지적한 것과 같은 중복이다. 고치기 전에도 두 문장은 같은 것을 물었으므로 이번 수정이 만든 문제는 아니다.
- **바꿀 값(하면):** 14.4를 하산 여부를 묻는 질문으로 바꾼다. 고산병은 내려오는 것이 핵심 치료다.
  - `en`: `Did he come down as soon as he started feeling sick?` (11단어)
  - `ko`: `몸이 안 좋아지기 시작하자마자 바로 내려왔나요?`
  - `chunks`: `["Did he come down", "as soon as", "he started", "feeling sick", "?"]`
  - `words`: `[w-start, w-feel, w-sick]` (셋 다 은행에 있음)
  - `tag`: `하산 확인`
  - `why`: `as soon as로 증상과 하산 사이의 시간을 물어요. 고산병은 내려오는 것이 가장 중요한 치료라서 증상이 생긴 뒤 바로 내려왔는지가 위중도를 가늠하는 단서예요.`
  - `decoy`: `to the top`
  - `blank`: `answer: sick`, 선택지 `sick / hungry / bored / rested`
  - changes 항목 `[en,ko,chunks,words]`
  - order L2는 14.1을 인용하므로 그대로다.
