# er-geriatric — v44 수정 재검토 (Opus)

비교: 정본에서 새로 뽑은 파일(고치기 전)과 `wip/er-v44fix/base-er-geriatric.yaml`을 필드 단위로 대조했다.
상황 번호는 1부터 센다. 목록은 이 주제에서 상황을 0부터 셌다.
- 목록 10.1 = S11 「학대·방임 의심」 문장 1
- 목록 19.4·19.5 = S20 「고관절 골절 통증·수술 대기」 문장 4·5
- 목록 8.4 = S9 문장 4

## 판정 요약
- **목록 대조:** 4행이 모두 처방대로 반영됐다. 빠진 행은 없다.
- **10.1 `You're safe to talk with me — I'll be honest about who else needs to know.`:** 맞다.
  - 15단어다.
  - 노인 학대 의심 시 APS 신고 의무가 있으므로 비밀을 약속하지 않고 정직하게 알리는 말이 맞다.
  - `ko`가 같은 뜻이다.
  - `why`도 새 문장에 맞게 고쳤다.
  - `words`는 `[w-safe, w-need]`다. 둘 다 은행에 있다.
  - `w-leave`·`w-say` 삭제는 맞다. 다른 곳에서 쓰지 않는다.
  - S11의 뉘앙스·order에는 옛 문장을 인용한 곳이 없다.
- **19.4 `Let me check if you can drink water to stay hydrated before surgery.`:** 맞다.
  금식은 마취팀이 정하므로 확인하겠다는 말로 바꾼 것이 맞고, `why`도 맞다. 다만 v46 필드에 고칠 것이 있다(아래).
- **19.5 `Let's keep you oriented and engaged while you wait.`:** 맞다.
  섬망 예방(지남력·대화)이고, 움직임을 권하는 말이 사라졌다. S20 context `fix`와 order L3도 어긋나지 않는다.
- **8.4 ko:** 맞다. `w-unsteady`의 `exKo`도 같이 고쳤다.
- **changes 파일:** 실제로 바뀐 v44 키와 일치한다.
  - S11.1 `[en,ko,chunks,words]`
  - S20.4·S20.5 `[en,ko,chunks]`
  - S9.4 `[ko]`
  - `w-leave`·`w-say` remove
- **keyPhrase:** 10.1은 keyPhrase이고 `keyphrases.tsv`의 줄이 새 `en`과 같다.
- **검사:** keyPhrase를 바꾼 스크래치 시드로 돌렸다. 위반 0, W14 0이고 `==> 통과`가 나왔다. W13 경고 2건은 이번 수정과 무관하다.

## 고칠 것 (모두 새 청크에 딸린 v46 필드)

### 1. S11 문장 1 decoy `on the phone`이 맞는 문장을 만든다 [decoy]
- **문제:** 새 청크 셋째 자리에 넣으면 `You're safe to talk with me on the phone about who else needs to know.`가 된다.
  맞는 영어인데 뜻이 바뀐다.
- **바꿀 값:** `decoy: who you are`
  - `about who else`와 헷갈리게 하는 오답이다. 어느 자리에서도 조립되지 않는다.

### 2. S11 문장 1 빈칸 `ready`가 정답이 될 수 있다 [빈칸]
- **문제:** `You're ready to talk with me — …`는 이 장면에서 자연스럽게 성립한다.
- **바꿀 값:** 선택지 `ready` → `wrong`
  - 바꾼 뒤의 선택지는 `wrong / early / late / safe`이고, 정답 `safe`는 그대로다.

### 3. S20 문장 4 decoy `for a week`가 맞는 문장을 만든다 [decoy]
- **문제:** 셋째·넷째 자리에서 `ko`와 다른 문장이 맞는 영어로 조립된다.
  - `Let me check if you can drink water for a week before surgery.`
  - `…to stay hydrated for a week.`
- **바꿀 값:** `decoy: of the surgery`
  - 어느 자리에서도 조립되지 않는다.
  - `drink it all`처럼 금식을 어기는 행동을 보이는 decoy는 쓰지 않는다.

### 4. S20 문장 4 빈칸 오답이 문법으로 걸러진다 [빈칸]
- **문제:** `cancel`·`refuse`는 `Let me ___ if…` 틀에 문법상 들어가지 않고, `forget`은 뜻이 어긋난다. 그래서 뜻을 몰라도 정답을 고를 수 있다(파일럿 갈래).
- **바꿀 값:** 선택지를 `check / decide / guess / forget`으로 바꾼다. 정답 `check`는 그대로다.
  - `decide`는 문법에 맞지만 금식 여부는 간호사가 정하지 않으므로 틀린다. 이 문장이 가르치려는 바로 그 점이다.
  - `guess`도 같은 분야에서 틀린 말이다.

### 5. S20 문장 4 `tag`가 새 문장의 역할과 어긋난다 [tag]
- **문제:** 지금 `tag`는 `수분 안내`다. 그런데 새 문장은 물을 권하는 말이 아니라 금식 여부를 확인하는 말이다.
- **바꿀 값:** `tag: 금식 확인`

### 6. S20 문장 5 decoy `at the window`가 맞는 문장을 만든다 [decoy]
- **문제:** 둘째·넷째 자리에서 맞는 영어로 조립된다.
  - `Let's keep you at the window and engaged while you wait.`
  - `Let's keep you oriented and engaged at the window.`
- **바꿀 값:** `decoy: was waiting`
  - 어느 자리에서도 조립되지 않는다.
  - `and walking`·`out of bed`처럼 골절 환자에게 위험한 동작을 보이는 decoy는 쓰지 않는다.

### 7. S20 문장 5 빈칸 `entertained`가 정답에 가깝다 [빈칸]
- **문제:** 새 문장에 `engaged`가 들어오면서 `Let's keep you entertained and engaged while you wait.`가 자연스러운 문장이 됐다.
- **바꿀 값:** 선택지 `entertained` → `disoriented`
  - 바꾼 뒤의 선택지는 `oriented / disoriented / dressed / shaved`이고, 정답 `oriented`는 그대로다.
  - `disoriented`는 같은 분야에서 정반대인 말이다.
