# er-sepsis v44 수정 재검토

목록 행 4개(5.3, 14.3, 14.0·14.2, 9.0)를 대조했습니다. 5.3·14.3·9.0·14.2는 반영됐고, 14.0은 "가족에게 하는 말"이라며 그대로
뒀습니다. changes 항목(문장 4건, 단어 예문 3건, w-spread 삭제)은 실제로 바뀐 키와 맞습니다. keyPhrases를 tsv 값으로 바꾼 스크래치
시드로 검사하면 위반 0건, 통과, W14 0건입니다.

## 판정
- **5.3** `…all four of these started.`: 처방 그대로입니다. why·words(w-start)도 맞습니다. 수용합니다.
- **9.0** `Your pneumonia is affecting your whole body…`: 쉬운 말이면서 사실이고, order L0와 tsv 행이 맞습니다. w-spread는 다른
  곳에서 쓰지 않아 삭제가 맞습니다. 수용합니다.
- **14.3** `Through the interpreter, I'll ask her about any allergies.`: 처방 그대로입니다. 수용합니다.
- **S14 장면 확인**: 정본 시드의 role은 `family`이고 페르소나는 딸(Mei Lin Zhou, 42세)입니다. 롤플레이 상대는 딸이고, 14.0·14.3·14.5도
  어머니를 `she/her`로 부르며 딸에게 말합니다.
- **14.2 판정: 바꿔야 함.** `Please ask her…`를 버린 것은 맞습니다. 하지만 `Where do you feel pain…?`는 어머니에게 하는 말이라,
  롤플레이에서 딸에게 하면 맞지 않습니다. 미국 관행은 통역사가 아니라 **눈앞의 대화 상대**를 보고 1인칭으로 말하는 것이고,
  이 장면의 대화 상대는 딸입니다(아래 2).
- **14.0 판정: 3인칭은 맞지만 머리말은 지워야 함.** 딸에게 어머니 이야기를 하는 것이라 `she`는 맞습니다. 하지만
  `Through the interpreter —`는 소리 내어 하는 말이 아니라 무대 지시문입니다. 통역사가 이 머리말까지 옮기게 됩니다.
  er-environmental에서 같은 머리말을 지운 선례(`Through the interpreter — how high did he climb…` → `How high did he climb, and how fast?`)와도
  맞춥니다(아래 1).
- **20.0** `…bundle completed within the hour.`(keyPhrase) 판정: **둡니다.** 1시간 번들의 각 항목은 "배양 채취, 항생제 투여,
  젖산 측정, 수액 **시작**"이라 모두 마치면 bundle completed라고 인계하는 것이 표준 용어입니다. 다만 5.3 why(끝내는 게 아니라
  시작)와 어긋나 보이니 why만 보강합니다(아래 5).
- **20.3** `Cultures, antibiotics, and fluids are all done within the hour.` 판정: **5.3과 같은 오류라 고칩니다.** `fluids … done`은
  30 mL/kg 수액이 한 시간 안에 다 들어갔다는 말이 됩니다(아래 4).

## 고칠 것

1. **S14 패혈증 언어장벽 위중 14.0** (keyPhrase, 문체·뜻)
   - 처방:
     ```yaml
     en: We believe she has a serious infection.
     ko: 심각한 감염이 있다고 생각해요.
     chunks: [We believe, she has, a serious infection, .]
     words: [w-believe, w-serious, w-infection]
     tag: 가족에게 설명
     why: believe로 확진 전의 판단임을 정직하게 말하면서 serious로 긴급성은 분명히 해요. 통역을 쓸 때도 통역사가 아니라 가족을 보며 직접 말하고, 'Through the interpreter' 같은 머리말은 붙이지 않아요. 통역사는 들은 말을 그대로 옮기니까요.
     ```
     blank·decoy(`by phone`)·distractorsKo는 그대로 둡니다(조립해도 문장이 되지 않음). w-believe 예문이 이미 이 en·ko와 같아서
     단어는 바꿀 것이 없습니다. w-interpreter는 14.3·14.4에서 계속 쓰입니다.
   - keyphrases.tsv에 행 추가:
     `er-sepsis	Through the interpreter — we believe she has a serious infection.	We believe she has a serious infection.`
   - changes: 문장 14.0 `fields: [en, ko, chunks, words]`

2. **S14 14.2** (keyPhrase, 뜻)
   - 처방:
     ```yaml
     en: Where does she feel pain, and when did this start?
     ko: 어머니는 어디가 아프시고, 언제부터 시작됐나요?
     chunks: [Where does she, feel pain, ', and when', did this start, '?']
     why: where와 when 두 질문을 짧게 나눠 통역에서 뜻이 덜 흐려져요. 통역사에게 ask her로 넘기지 않고 눈앞의 딸을 보며 직접 묻고, 통역사가 그 말을 옮겨요.
     distractorsKo: [보호자분 연락처를 알려 주시겠어요?, 어머니가 병원에 오시기 전에 무엇을 드셨나요?]
     ```
     words·tag·icon·blank(feel)·decoy(`for me`)는 그대로 둡니다.
   - keyphrases.tsv의 기존 행에서 새 값을 바꿉니다:
     `er-sepsis	Please ask her where she feels pain and when this started.	Where does she feel pain, and when did this start?`

3. **S14 order** (뜻, 1·2에 따라)
   - 문제: 네 줄이 환자에게 하는 말(`you`)이라 role family 장면과 맞지 않고, L3가 14.2를 인용합니다.
   - 처방:
     - L0 `en: We believe she has a serious infection.` / `ko: 심각한 감염이 있다고 생각해요`
     - L2 `en: Before she gets the antibiotic, does she have any allergies?` / `ko: 항생제를 드리기 전에요, 어머니께 알레르기가 있나요?`
     - L3 `en: Thank you. Now, where does she feel pain, and when did this start?` / `ko: 고마워요. 이제 어머니가 어디가 아프시고 언제 시작됐는지 말씀해 주세요`
     - L1과 `why`는 그대로 둡니다.

4. **S20 중증 패혈증 ICU 이송 20.3** (사실, 목록 밖이지만 5.3과 같은 오류)
   - 처방:
     ```yaml
     en: Cultures drawn, antibiotics given, fluids started — all within the hour.
     ko: 배양 채취, 항생제 투여, 수액 시작까지 모두 한 시간 안에 했습니다.
     chunks: ['Cultures drawn,', 'antibiotics given,', fluids started, — all, within the hour, .]
     words: [w-culture, w-draw, w-antibiotic, w-give, w-fluid, w-start]
     tag: 번들 이행
     why: 항목마다 한 일을 붙여(drawn·given·started) 나열해요. 수액은 한 시간 안에 다 들어가는 것이 아니라 시작하는 것이라 started로 말해요. within the hour로 번들 시간 기준을 지켰다는 점을 받는 쪽에 알려요.
     blank: {answer: drawn, options: [{en: drawn}, {en: read}, {en: grown}, {en: signed}]}
     decoy: to the hour
     ```
     icon(check)·distractorsKo는 그대로 둡니다. 기존 빈칸 오답 `Labs`는 `Labs drawn, …`이 자연스러운 인계라 정답이 둘이 되므로
     빈칸을 옮겼습니다. decoy는 `are all done`을 쓰지 마세요. `fluids started are all done within the hour`로 조립됩니다.
   - w-done은 20.3에서만 쓰였습니다(예문도 `All four steps are done.`으로 같은 오류). `kind: word-remove, id: w-done`
   - changes: 문장 20.3 `fields: [en, ko, chunks, words]`, word-remove w-done.

5. **S20 20.0 `why` 보강** (사실, 낮음, v46 필드)
   - 처방: `why: 환자 상태, 원인, 처치 완료 순으로 쉼표로 끊어 한 줄에 요약해요. bundle completed는 배양 채취·항생제 투여·젖산 측정·수액 시작 같은 1시간 번들 항목을 모두 마쳤다는 뜻이에요(수액이 다 들어갔다는 뜻은 아니에요). 인계에서는 진단·감염원·번들 완료 여부를 받는 쪽이 가장 먼저 알아야 해요.`

6. **정본 시드 필드(S5)** (사실, 낮음) — 5.3과 같은 오해("1시간 안에 다 끝낸다")를 막습니다.
   - `er-sepsis / 패혈증 1시간 번들 / brief / 배양·항생제·수액·젖산을 1시간 내 시행하며 각 단계를 설명하세요. / 배양·항생제·수액·젖산을 1시간 안에 시작하며 각 단계를 설명하세요.`
   - `er-sepsis / 패혈증 1시간 번들 / goals[0] / 1시간 번들 요소를 신속히 시행한다 / 1시간 번들 요소를 신속히 시작한다`

고칠 것 6건(사실·안전 3건: 4, 5, 6).

처방한 새 문장·빈칸·단어 추가·삭제를 스크래치 사본에 넣고(keyPhrase는 tsv 값으로 바꾼 시드) 검사하면 위반 0건, 통과입니다.
