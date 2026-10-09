# er-fever-infection — v44 수정 재검토 (Opus)

비교: 정본에서 새로 뽑은 파일(고치기 전)과 `wip/er-v44fix/base-er-fever-infection.yaml`을 필드 단위로 대조했다.
상황 번호는 1부터 센다. 목록(`v44fix-items.md`)은 이 주제에서 상황을 0부터 셌다(목록 20.0 = S21 문장 0).

## 판정 요약
- **목록 대조:** 6행이 모두 반영됐다. 빠진 행은 없다.
  - 20.0 droplet
  - 10.3 `a few minutes`
  - 3.3 `an hour`
  - 15.2/18.4 ko
  - 8.3 ko
  - 12.0/17.0 `makes me worried about`
- **20.0 (droplet 격리):** 맞다. 수막구균은 CDC 기준 비말 격리(유효 항생제 24시간까지)다.
  - `ko`·`chunks`·`why`도 바르게 고쳤다.
  - S21 pair 뉘앙스(`droplet / precautions`)도 바르게 고쳤다.
  - `w-contact`를 은행에 남긴 것은 맞다. 이 단어는 `close contacts`(접촉자)라는 뜻이고 다른 문장이 쓴다.
  - `w-airborne`을 지운 것도 맞다. 다른 문장 태그와 뉘앙스 words에 없다.
    TB 장면의 airborne은 context 장면 글이라 단어 태그와 상관없다.
  - `w-droplet` 새 항목의 필드는 모두 정상이다. 오답 `dropper`·`triplet`, `공기매개`·`혈액매개`, 칩 `drop+let`도 문제없다.
- **3.3 빈칸을 thirty에서 medicine으로 옮긴 것:** `thirty`가 문장에서 사라졌으니 옮긴 것 자체는 맞다.
  그러나 새 선택지가 문제다(아래 2번).
- **12.0·17.0 decoy를 `reassures me`에서 `since morning`으로 바꾼 것:** `reassures me`를 버린 것은 맞다.
  새 청크 `makes me worried` 자리에 넣으면 `…reassures me about meningitis.`가 되어 잘못된 안심을 보이는 문장이 된다.
  그러나 `since morning`은 다른 자리에서 맞는 문장을 만든다(아래 3번).
- **후속 거리:**
  - **예문:** 판정은 아래 4번이다.
    - 정본 대조 결과, `w-stiff`·`w-neck`·`w-headache`·`w-meningitis`·`w-severe`의 예문은 `nurse/topics/er.yaml`의 어느 문장과도 같지 않다.
      `nurse/lexicon/er.yaml`에만 있다(42026·42039·42052·42065·42078·42819행).
    - 그래서 V17 연동으로 꼭 고쳐야 하는 것은 아니다.
    - 그래도 `X concerns me about Y`가 자연스러운 영어가 아니라는 이 행의 이유가 그대로 적용된다.
      따라서 `about`이 붙은 셋만 고친다.
  - **w-precaution cue:** 고친다(아래 5번).
- **10.3:** 16단어로 15단어를 넘는다. 그러나 검토자가 처방한 문장이고 15단어 제한은 처방 없는 새 문장과 order 줄에 걸리는 기준이라 그대로 둔다.
- **changes 파일:** 실제로 바뀐 v44 키와 일치한다.
  - S21.0 `[en,ko,chunks,words]`
  - `w-suspect`·`w-meningococcemia`·`w-precaution`·`w-within`·`w-worry` `[example]`
  - `w-airborne` remove, `w-droplet` add
  - S11.3·S4.3 `[en,ko,chunks]`
  - S16.2·S19.4·S9.3 `[ko]`
  - S13.0 `[en,chunks,words]`, S18.0 `[en,chunks]`
  - `w-concern` remove
- **keyPhrase:** S13.0·S18.0·S21.0의 `keyphrases.tsv` 세 줄이 새 `en`과 같다.
- **검사:** keyPhrase를 바꾼 스크래치 시드로 돌렸다. 위반 0, W14 0이고 `==> 통과`가 나왔다. W13 경고 5건은 이번 수정과 무관하다.

## 고칠 것

### 1. S21 문장 0 decoy: 홍역을 비말 격리로 조립한다 [사실·안전]
- **문제:**
  - decoy `Probable measles`를 첫 자리에 넣으면 `Probable measles — he's on droplet precautions.`가 된다.
    맞는 영어인데, 홍역(공기 격리 대상)을 비말 격리로 보이는 틀린 처치다.
  - 고치기 전에는 `airborne and contact`라서 이 조립이 우연히 맞았는데, 이번 수정으로 위험한 조립이 됐다.
- **바꿀 값:** `decoy: is cleared`
  - 어느 자리에 넣어도 문장이 되지 않는다.
  - `In bed four`처럼 명사구로 된 decoy는 첫 자리에서 인계 문장이 되므로 쓰지 않는다.

### 2. S4 문장 3 (목록 3.3) 빈칸 선택지가 동떨어지고 하나는 정답이 될 수 있다 [빈칸]
- **문제:**
  - 선택지 `pillow / window / towel`은 장면과 동떨어진 말이다(파일럿 갈래).
  - 게다가 `This towel will bring your fever down…`은 미온수 찜질로 읽혀 정답이 둘이 된다.
- **바꿀 값:** `blank.options`를 `medicine / thermometer / bandage / inhaler`로 바꾼다. 정답 `medicine`은 그대로다.

### 3. S13 문장 0 · S18 문장 0 (목록 12.0·17.0) decoy `since morning`이 맞는 문장을 만든다 [decoy]
- **문제:** 둘째 자리에 넣으면 `ko`와 다른 문장이 맞는 영어로 조립된다.
  - S13.0: `The stiff neck since morning makes me worried about meningitis.`
  - S18.0: `Pain this severe since morning makes me worried about a deep infection.`
- **바꿀 값:** 두 문장 모두 `decoy: keeps me`
  - `makes me worried`와 꼴이 비슷한 오답이다. 어느 자리에서도 조립되지 않는다.
  - `en` 안에 없으므로 V18에도 걸리지 않는다.

### 4. 단어 예문에 `concerns me about`이 남아 있다 [문법·뜻, 목록 12.0의 뜻]
- **바꿀 값:** `exKo`는 셋 다 지금 값 그대로 뜻이 맞는다.
  - `w-stiff`·`w-neck` `example`: `The stiff neck with fever makes me worried about meningitis.`
  - `w-meningitis` `example`: `A stiff neck makes me worried about meningitis.`
- **그대로 둘 것:** `about`이 없는 `X concerns/worries me.`는 자연스러운 영어다.
  - `w-headache`(`The stiff neck with fever and headache concerns me.`)
  - `w-severe`(`Pain this severe with a fever worries me.`)
- **changes:** `kind: word`, `fields: [example]` 세 건(`w-stiff`, `w-neck`, `w-meningitis`).
  `why: 'v46 검토 결정 11 예외: 예문의 concerns me about은 자연스러운 영어가 아니라 makes me worried about로(12.0과 같은 이유)'`

### 5. `w-precaution` cue 'contact ___s' [단어 cue]
- **문제:**
  - 예문은 비말 격리로 바뀌었는데 cue는 접촉 격리를 가리킨다.
  - `en`이 이미 복수(`precautions`)라서 `___s`에 넣으면 `precautionss`가 된다.
- **바꿀 값:** `cue: 전파 경로에 따라 정한 보호 조치 — 'droplet ___'` (v45 필드, changes 항목 없음)

### 6. `w-worry` cue가 틀린 철자를 유도한다 [단어 cue]
- **문제:** `'It makes me ___ed.'`에 정답 `worry`를 넣으면 `worryed`가 된다.
- **바꿀 값:** `cue: 의료진이 소견을 보고 불안한 마음을 솔직히 말할 때 — 'I ___ about a deep infection.'`
  - 원형이 그대로 들어가는 틀이고, 답을 드러내지 않는다(W13).
  - v45 필드라 changes 항목은 없다.
