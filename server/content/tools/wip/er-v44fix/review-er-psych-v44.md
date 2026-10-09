# er-psych v44 수정 재검토

목록 행 5개(1.1, 18.6, 8.4, 13.5, 10.4)를 모두 대조했습니다. 빠진 행은 없습니다. 주의할 점이 하나 있습니다. 이 주제의 원래
검토(fix-er-psych-v46)는 상황과 문장 번호를 **1부터** 셌습니다. 목록의 1.1은 실제로 `situations[0].sentences[0]`이고, 18.6은
`[17][5]`, 8.4는 `[7][3]`, 13.5는 `[12][4]`, 10.4는 `[9][3]`입니다. 수정자는 다섯 개 모두 맞는 문장을 고쳤습니다.
changes 항목(문장 5건, 단어 예문 4건, w-watch 삭제)은 실제로 바뀐 키와 맞습니다. keyPhrases를 tsv 값으로 바꾼 스크래치 시드로
검사하면 위반 0건, 통과, W14 0건입니다.

## 판정
- **1.1(→0.0)** `Have you had any thoughts of ending your life?`: ASQ가 쓰는 말이고 tsv 행이 맞습니다. w-hurt 예문을 0.4로 옮긴 것과
  exKo, w-thought cue, why("직접 묻는다고 생각을 심어 주지 않는다")가 모두 사실입니다. 수용합니다.
- **8.4(→7.3)** `The doctor will assess you first, and then we'll talk about next steps.`(13단어): 보호 중인 환자에게 나간다는
  약속을 하지 않습니다. 7.0(임시 보호)과 겹치지 않습니다. 수용합니다. decoy는 고쳐야 합니다(아래 1).
- **13.5(→12.4)** `They'll stay with you to keep you safe, not as a punishment.`: 시터가 곁에 있다는 사실을 부정하지 않고
  목적을 말합니다. w-watch는 다른 곳에서 쓰지 않아 삭제가 맞습니다. 수용합니다. 빈칸 오답은 고쳐야 합니다(아래 3).
- **18.6(→17.5)** `…to get a bed as soon as possible.`: 처방대로입니다. w-both는 17.0에서 계속 쓰입니다. 수용합니다.
- **10.4(→9.3)**: 귀가를 전제하지 않게 고쳤고 빈칸을 옮겼습니다. 하지만 9.0 keyPhrase(`I just want to double-check a few things.`)와
  거의 같은 문장이 되었습니다(아래 2).

## 고칠 것

1. **S7 홀딩(비자의 억류) 고지 7.3 `decoy: at the clinic`** (뜻)
   - 문제: `first` 자리에 넣으면 `The doctor will assess you at the clinic, and then…`, `about next steps` 자리에 넣으면
     `…we'll talk at the clinic.`으로 맞는 영어가 됩니다.
   - 처방: `decoy: let you go` (고치기 전의 문제였던 말이고, 어느 자리에도 맞지 않음)

2. **S9 자살 위험 부정 환자 9.3: 9.0과 겹침** (문체·뜻)
   - 문제: `I want to double-check a few things with you first.`가 같은 상황의 9.0 `I hear you say you're fine — I just want to
     double-check a few things.`과 거의 같은 말입니다. 빈칸 오답(minutes·people·rooms)도 장면과 동떨어져 있고,
     `decoy: your medications`는 `a few things` 자리에 넣으면 `I want to double-check your medications with you first.`로 맞는 문장이 됩니다.
   - 처방: 문장을 새로 씁니다(keyPhrase 아님).
     ```yaml
     en: Can I ask you a few more questions about how you've been feeling?
     ko: 요즘 기분이 어떠셨는지 몇 가지 더 여쭤봐도 될까요?
     chunks: [Can I ask you, a few more questions, about how, you've been feeling, '?']   # V8: 13단어라 청크 4개 이상
     words: [w-ask, w-question, w-feel]
     tag: 추가 질문
     icon: speech
     why: Can I ask …?로 허락을 구하며 질문을 이어 가요. 괜찮다고 말하는 환자에게도 요즘 어떻게 지냈는지 열린 질문을 더 하면 숨은 위험을 찾을 수 있어요. 퇴원 결정은 평가 뒤에 의사가 해요.
     blank: {answer: ask, options: [{en: ask}, {en: give}, {en: show}, {en: hand}]}
     decoy: is fine
     distractorsKo: 그대로 (오늘 밤 같이 계실 분이 있으세요? / 집에는 몇 분이나 같이 사세요?)
     ```
     changes: 문장 9.3 `fields: [en, ko, chunks, words]`(이미 있는 항목의 fields에 words가 있으니 en·ko·chunks·words로 그대로 둠).
     w-want·w-check·w-thing은 9.0 등에서 계속 쓰여 지울 단어가 없습니다. w-ask·w-question은 은행에 있습니다.

3. **S12 1:1 관찰 배정 설명 12.4 `blank` 오답 `quiet`·`busy`** (안전: 낙인, 낮음)
   - 문제: `They'll stay with you to keep you quiet`는 정신과 환자에게 통제하려고 붙여 둔다는 말로 읽힙니다. 오답이라도
     이 장면에서 보이면 안 됩니다. `keep you busy`도 시터가 실제로 말을 걸어 주기도 해서 반쯤 맞는 말입니다.
   - 처방: `blank.options: [{en: safe}, {en: sorry}, {en: warm}, {en: fed}]`

4. **S17 정신과 병상 대기 17.5 `decoy: in the lobby`** (뜻, 낮음)
   - 문제: `as soon as possible` 자리에 넣으면 `…to get a bed in the lobby.`가 맞는 영어가 됩니다(고치기 전에도 `for both of you`
     자리에서 같았음).
   - 처방: `decoy: is ready now`

참고(고칠 것 아님): 12.4는 12.3 `Someone will stay close by to keep you safe tonight.`과 `stay … to keep you safe`가 겹칩니다.
12.4의 핵심인 `not as a punishment`가 따로 있고, 안전이라는 목적을 되풀이하는 것이 이 상황의 요지라 둡니다.

고칠 것 4건(사실·안전 1건).

처방한 새 문장·빈칸·단어 추가·삭제를 스크래치 사본에 넣고(keyPhrase는 tsv 값으로 바꾼 시드) 검사하면 위반 0건, 통과입니다.
