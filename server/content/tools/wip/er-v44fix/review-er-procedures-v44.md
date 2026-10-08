# er-procedures v44 수정 재검토

목록 행 9개(9.4, 5.5, 18.2, 20.1, 11.2, 6.3·17.4, 0.0·9.0 ko, 청크 0.4·6.2·8.0)를 모두 대조했습니다. 빠진 행은 없습니다.
changes 항목(문장 12건, 단어 예문 4건, w-promise 삭제)은 실제로 바뀐 키와 맞습니다(0.0의 `words`는 적었지만 바뀌지 않았습니다.
더 적은 것이라 해는 없습니다). keyPhrases를 tsv 값으로 바꾼 스크래치 시드로 검사하면 위반 0건, 통과, W14 0건입니다.

## 판정 (처방 없이 새로 쓴 문장)
- **9.4** `Press your call button if anything feels wrong.`(9단어): 첫 항생제를 투여할 때 실제로 하는 말이고, 9.1(가려움·숨참을
  말로 알리기)이나 9.5(다시 오기)와 겹치지 않습니다. ko·tag·icon(bell)·why가 맞습니다. 시험 용량은 다른 필드(nuance·order)에
  인용된 곳이 없습니다. 수용합니다.
- **5.5** `I'll try once more, and then we'll get help.`(9단어): 시도 횟수를 정해 두고 숙련자나 초음파로 넘기는 INS 기준에
  맞고, 5.2(능숙한 동료)와도 어긋나지 않습니다. 수용합니다. 빈칸과 decoy는 고쳐야 합니다(아래 1·2).
- **18.2** `Please calculate the units on your own, then we'll compare.`(10단어, keyPhrase): 독립 이중 확인(ISMP)의 핵심인
  "내 값을 먼저 말하지 않는다"를 그대로 말하는 문장입니다. 쉼표로 이어 쓴 것은 구어로 자연스럽습니다. tsv 행이 en과 글자까지
  같습니다. order L0~L3 고쳐 쓴 것('both numbers'·'one of our numbers')은 앞 줄에 기대어 순서가 하나이고, 18.3(`that number`)이나
  nuance pair `independent double check`와도 맞습니다. 수용합니다. decoy는 고쳐야 합니다(아래 3).
- **6.3** `It should be over before he even notices.`·**17.4** `This should work fast, and we're right here with you.`:
  should로 장담을 예상으로 낮췄습니다. 17.4는 10단어이고 S17 order L3에서 `I promise`도 뺐습니다. w-promise는 다른 곳에서 쓰지
  않아 삭제가 맞습니다. 수용합니다.
- **w-stop 예문** `Stop the transfusion right away if you see a reaction.`: 이 주제에서는 예문을 짧게 줄여 쓰는 경우가 많고,
  내용(수혈 반응이 보이면 곧바로 중단)도 맞습니다. 수용합니다.

## 고칠 것

1. **S5 어려운 정맥 확보 5.5 `blank`** (뜻·안전, 낮음)
   - 문제: 선택지 `never`·`always`는 문법만 봐도 걸러집니다(`try never more`). 남은 `twice`는 맞는 영어이고 시도 한도를
     넘기는 말이라, 결국 오답 하나만 남고 그마저 기준을 어기는 행동을 보여 줍니다.
   - 처방: 빈칸을 `help`로 옮깁니다.
     `blank: {answer: help, options: [{en: help}, {en: a snack}, {en: a new gown}, {en: a new bag}]}`

2. **5.5 `decoy: at home`** (뜻)
   - 문제: `once more` 자리에 넣으면 `I'll try at home, and then we'll get help.`가 맞는 영어가 됩니다.
   - 처방: `decoy: until we find` (고치기 전의 "찾을 때까지"라서 어느 자리에도 맞지 않음)

3. **S18 응급 약물 오류 방지 18.2 `decoy: for a week`** (뜻)
   - 문제: `on your own` 자리에 넣으면 `Please calculate the units for a week, then we'll compare.`가 맞는 영어가 됩니다.
   - 처방: `decoy: mine is fifteen` (내 값을 먼저 말하는 실수를 보여 주는 말이고, 어느 자리에도 맞지 않음)

4. **S17 골내주사 17.4 `decoy: , I doubt it`** (문체)
   - 문제: 지운 `, I promise` 청크에 맞춰 둔 decoy가 그대로 남았습니다. 문장 끝에 붙이면 `…with you, I doubt it.`처럼
     안심의 말을 뒤집는 문장이 됩니다.
   - 처방: `decoy: was placed`

참고(고칠 것 아님): 0.4 `decoy: with the pharmacy`는 `I'll compare this with the pharmacy just to be safe.`로 조립됩니다. 고치기
전부터 같았고 위험한 뜻이 아니라 둡니다. 9.4의 빈칸 오답(door·curtain·blanket)은 병실 물건이라 장면과 아주 동떨어지지 않아 둡니다.

고칠 것 4건(사실·안전 0건).

처방한 빈칸·decoy를 스크래치 사본에 넣고(keyPhrase는 tsv 값으로 바꾼 시드) 검사하면 위반 0건, 통과입니다.
