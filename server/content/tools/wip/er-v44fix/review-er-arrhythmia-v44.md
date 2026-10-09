# er-arrhythmia v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-arrhythmia.yaml`, `git diff changes/er/changes-er-arrhythmia.yaml`.
목록 행 9개(15.2, 20.0 en, 20.0 ko, 16.1, 14.5, 6.1, 21.1, 17.0, 11.2/11.4·17.0/17.4 겹침)를 대조했습니다. 빠진 행은 없습니다.

changes 항목은 실제로 바뀐 v44 키와 모두 맞습니다.
- 문장: 6.1·14.5는 en/chunks, 15.2·11.4는 en/ko/chunks/words, 20.0·21.1·17.0·17.4는 en/ko/chunks, 16.1은 ko입니다.
- 단어: w-sedate·w-situation·w-convert·w-tachycardia·w-work·w-fast·w-iv·w-calm·w-flag의 example입니다.
- `w-stay`는 exKo만 바뀌었으므로 적지 않은 것이 맞습니다. 은행의 단어는 모두 쓰이고 있습니다(`w-feel`·`w-dose`는 다른 문장에 남음).

keyPhrase 5건(6.1·15.2·17.0·20.0·21.1)은 `keyphrases.tsv`의 새 en과 글자 그대로 일치합니다.
검사: changes 파일을 함께 두고 돌리면 V16은 통과입니다. 실패는 이 5건의 `[V4]`뿐이고, 합칠 때 tsv를 반영하면 풀립니다.

## 수정자 판단에 대한 판정
- **20.0 `Mrs. Lopez`를 지어 넣은 것: 수용합니다.** 구두 SBAR은 "이름 + 침상"으로 환자를 밝히는 것이 표준이고, 20.1·order L2의 `her`와도 맞습니다. 12단어입니다.
  `ko`(`2번 침상 로페즈 환자분이`)와 why, distractorsKo, 세 단어의 example/exKo, order L1도 모두 함께 맞췄습니다.
  (Lopez라는 이름은 er-arrest의 목격 간호사 persona와 core-safety의 "Two Lopezes" 문장에도 나오지만 주제가 달라 충돌은 없습니다.)
- **17.0 `I'm flagging your WPW right away so the whole team knows.`: 수용합니다.** context 카드의 `word: flag`가 세 장면에 모두 있어야 하므로(W14) `flag`는 남겨야 합니다.
  `flag that … to the team`의 어색한 구조는 풀렸고, 환자에게 이유를 붙여 말하는 문장이 됐습니다. 이 en은 원래 context 2번 장면 문장과 같습니다.
- **17.4 `Please tell every new member of the team that you have WPW.`(새로 씀): 수용합니다.** 교대·호출로 사람이 바뀔 때 환자가 스스로 알리게 하는 것은 실제 환자 교육입니다.
  11단어이고 `ko`(`새로 오는 팀원마다 WPW가 있다고 꼭 말씀해 주세요`)와 뜻이 같습니다. 17.0과도 더 이상 겹치지 않습니다.
- **11.4 `Please call us right away if the irregular rhythm comes back.`(새로 씀): 뜻은 수용합니다.** 11.2(거르면 리듬이 돌아옴)와 이어지는 다음 행동이어서 겹침이 풀렸습니다. 빈칸도 `doses`와 `irregular`로 서로 다릅니다.
  다만 decoy는 고쳐야 하고(아래 2번), 응급실 실무로는 "call us"보다 "다시 오세요"가 맞습니다(아래 5번, 선택).
- **6.1 빈칸(fast-acting / slow-acting·daily·weekly): 수용합니다.** 정답이 하나뿐이고 위험한 처치를 보이는 선택지가 없습니다.
- 15.2·16.1·14.5·21.1·20.0 ko는 처방대로입니다.

## 고칠 것

1. **15.2 `blank`: `feel`→`get`으로 바뀌어 `strong`도 정답이 됨** (뜻)
   - 문제: `You'll get a strong shock while you're sedated`는 사실입니다(심율동전환은 센 충격). 예전에는 `feel`과 함께라서 틀린 말이었지만, 이제는 정답이 둘입니다.
   - 처방: `strong`을 `constant`로 바꿉니다 → `options: [{en: constant}, {en: quick}, {en: long}, {en: painful}]`

2. **11.4 `decoy: at the clinic`: 맞는 문장으로 조립되고, 11.0과 같은 decoy** (뜻, 낮음)
   - 문제: `right away` 자리에 넣으면 `Please call us at the clinic if the irregular rhythm comes back.`이 됩니다. 자연스러운 영어이고 뜻도 `ko`에 가깝습니다.
     같은 상황 11.0의 decoy도 `at the clinic`입니다.
   - 처방: `decoy: came back` (`comes back` 자리에 넣으면 시제가 깨지고, 다른 자리에는 들어가지 않음).
     5번을 반영해 문장을 바꾸면 `decoy: returned`로 합니다.

3. **17.0 `decoy: tomorrow morning`: `right away` 자리에서 위험한 지연을 보이는 문장이 됨** (뜻, 낮음)
   - 문제: `I'm flagging your WPW tomorrow morning so the whole team knows.`는 맞는 영어입니다. 그런데 금기 정보를 늦게 알리는 그림이 됩니다.
     기존 decoy이지만 문장이 바뀌었으므로 이번 범위에 들어갑니다.
   - 처방: `decoy: knows about` (어느 자리에 넣어도 문장이 되지 않음).

4. **17.4 `blank` 오답이 다른 분야의 말** (문체, 낮음)
   - 문제: `busy`·`tired`·`young`은 팀원의 상태나 나이를 말해서, 같은 분야에서 틀린 말이라는 파일럿 기준과 맞지 않습니다.
   - 처방: `options: [{en: new}, {en: former}, {en: absent}, {en: retired}]`

5. **11.4 실무: 응급실 간호사의 "call us"** (사실·실무, 낮음, 선택)
   - 문제: 응급실은 환자가 전화로 연락하는 곳이 아닙니다. 증상이 있는 부정맥이 재발하면 미국 ED 퇴원 교육은 "바로 다시 오세요(또는 911)"라고 합니다.
   - 처방(선택):
     - en `Come back to the ER right away if the irregular rhythm returns.` (11단어)
     - ko `불규칙한 리듬이 다시 돌아오면 바로 응급실로 오세요.`
     - chunks `["Come back to the ER", "right away", "if the irregular rhythm", "returns", "."]`, words `[w-rhythm, w-irregular]` 그대로
     - tag `재방문 안내`
     - why `if로 어떤 경우에 다시 와야 하는지 조건을 분명히 말해요. 리듬이 다시 흐트러지면 미루지 말고 와야 해서 right away를 붙여요.`
     - decoy `returned`, 빈칸 `irregular`는 그대로
     - changes 11.4 항목은 이미 en/ko/chunks/words를 담고 있어 따로 더하지 않음
