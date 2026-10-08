# er-polytrauma v44 수정 재검토

목록 행 7개(15.4, 2.1, 14.3, 19.2, 대시 청크 10건, 8.4, 4.4·16.4 words)를 대조했습니다. 15.4·2.1·14.3·19.2·8.4·16.4와
대시 10건은 반영됐고, 4.4만 빠졌습니다. changes 항목(문장 16건, 단어 예문 21건, w-lift 삭제, w-respond 추가)은 실제로 바뀐
v44 키와 맞습니다. keyPhrases를 `keyphrases.tsv` 값으로 바꾼 스크래치 시드로 검사하면 위반 0건, 통과, W14 0건입니다.

참고: 목록은 15.4를 keyPhrase라고 적었지만 정본 keyPhrases에 이 문장은 없습니다. tsv 행이 필요 없고 V4도 통과합니다.

## 판정
- **대시 10건**: `A — B` 띄어쓰기를 하고 대시에서 청크를 나눈 방식은 head-trauma와 같습니다. 이어 붙이면 en과 같고, 구도
  끊기지 않습니다. 수용합니다. 다만 새 청크 경계 때문에 decoy가 다른 자리에 들어가 맞는 문장이 되는 곳이 생겼습니다(아래 3~5).
- **2.1** `Do you feel dizzy or lightheaded right now?`는 처방 그대로입니다. w-lift는 다른 곳에서 쓰지 않아 삭제가 맞습니다.
  nuance[1]·order L3·w-feel·w-dizzy 예문과 exKo, cue도 함께 맞췄습니다.
- **8.4** `…even the ones in small doses.`(처방 없음): 자연스러운 영어이고 why도 맞췄습니다. 수용합니다.
- **16.4 w-respond 추가**: 낱말, 발음기호, 칩, 오답 칩이 모두 맞습니다. 수용합니다.
- **14.3·15.4·19.2**: 처방대로 고쳤습니다. 15.4의 why(압력이 차올라 정맥 환류를 막음)는 사실입니다. 19.2의 ko에 쓴
  "보호자분"은 S19 role이 family(아내)여서 맞습니다.
- **4.4 `words: []`를 반영하지 않은 것**: 이유가 적혀 있지 않습니다. 16.4는 단어를 더해 고쳤으니 4.4도 같은 방식으로
  고쳐야 합니다. 은행에 이 문장에 들어 있는 낱말(seatbelt·crash·side·driver)은 하나도 없습니다(아래 1).

## 고칠 것

1. **S4 수상기전(MOI) 청취 4.4 `words: []`** (문체)
   - 처방: 단어를 하나 더하고 4.4 `words: [w-sit]`로 태그합니다. changes에 `kind: word-add, id: w-sit`, 문장 4.4 `fields: [words]`를 적습니다.
     ```yaml
     - id: w-sit
       en: sit
       ipa: /sɪt/
       ko: 앉다
       icon: me
       example: Which part of the car were you sitting in?
       exKo: 차 안에서 어느 자리에 앉아 계셨나요?
       cue: "사고 때 차 안 어디에 앉아 있었는지 물을 때 — 'were you ___ting in'"
       tag: 수상기전
       distractorsEn: [stand, lie]
       distractorsKo: [서다, 눕다]
       chips: [[sit]]
       decoyChips: [set]
     ```

2. **S2 활력·쇼크지수 사정 2.1 `blank`** (뜻, 정답 둘)
   - 문제: `Do you feel nauseous or lightheaded right now?`와 `Do you feel sleepy or lightheaded right now?`도 쇼크 사정에서
     물을 만한 질문이라 정답이 여럿입니다. 선택지는 고치기 전과 같지만 문장이 바뀌었으니 다시 봐야 합니다.
   - 처방: 빈칸을 동사로 옮깁니다. `blank: {answer: feel, options: [{en: feel}, {en: look}, {en: sound}, {en: smell}]}`

3. **2.1 `decoy: in the car`** (뜻)
   - 문제: `Do you feel dizzy or lightheaded in the car?`, `Do you feel dizzy in the car right now?`처럼 맞는 영어가 됩니다.
   - 처방: `decoy: is normal` (어느 자리에 넣어도 문장이 되지 않음)

4. **S1 경추 보호 설명 1.0 `decoy: to the side`** (뜻, 청크를 나눠서 생김)
   - 문제: `— hold still` 자리에 넣으면 `Please don't move your neck to the side for me.`가 맞는 영어이고 뜻도 통합니다.
   - 처방: `decoy: is fine`

5. **S8 항응고제 복용 외상 8.4 `decoy: from home`** (뜻, 청크를 나눠서 생김)
   - 문제: `in small doses` 자리에 넣으면 `…even the ones from home.`이 자연스러운 문장이 됩니다.
   - 처방: `decoy: small dose ones` (고치기 전의 어색한 말이라 어느 자리에도 맞지 않음)

6. **S0 1차평가 0.1 `decoy: all at once`** (문체, 낮음, 청크를 나눠서 생김)
   - 문제: `for me` 자리에 넣으면 `Take a deep breath all at once — does it hurt to breathe?`가 됩니다.
   - 처방: `decoy: breathe deep`

7. **S17 외상성 심정지 17.3 `decoy: Rhythm check`** (뜻, 고치기 전부터 있던 것)
   - 문제: `Rhythm check now — hold compressions.`도 ACLS에서 맞는 지시라 정답이 둘입니다.
   - 처방: `decoy: Pulse is`

8. **S18 다발외상 핸드오프 order L3 대시 띄어쓰기** (문체, 낮음)
   - 문제: 18.4는 `bleeding — next scan`으로 띄웠고 S17 order L0도 맞췄는데, 이 줄만 `bleeding—next scan`입니다.
   - 처방: `en: Even with the BP stabilizing, watching for internal bleeding — next scan in an hour.`

참고(고칠 것 아님): 2.2 `decoy: this morning`(`…we're watching you this morning.`), 16.2 `decoy: right now`(`…open your eyes right now.`),
18.4 `decoy: in the morning`(`…next scan in the morning.`)도 맞는 영어가 됩니다. 셋 다 고치기 전부터 같은 조립이 가능했고
위험한 뜻이 아니어서 이번 범위에서는 둡니다. 다른 v46 장면·order에 남은 붙인 대시(`—`)도 문장 청크와 상관없어 둡니다.

고칠 것 8건(사실·안전 0건).

처방한 새 문장·빈칸·단어 추가·삭제를 스크래치 사본에 넣고(keyPhrase는 tsv 값으로 바꾼 시드) 검사하면 위반 0건, 통과입니다.
