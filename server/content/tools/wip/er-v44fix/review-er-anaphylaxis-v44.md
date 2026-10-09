# er-anaphylaxis v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-anaphylaxis.yaml`, `git diff changes/er/changes-er-anaphylaxis.yaml`.
목록 행 3개(20.3, 13.3, 7.2)를 대조했습니다. 20.3·13.3은 처방대로 반영됐고, 빠진 행은 없습니다.
- 20.3: en·ko·chunks가 처방과 글자 그대로 같습니다. order L2(`…until about zero-two-hundred`)도 함께 고쳤습니다.
- 13.3: en·ko는 처방대로입니다. chunks는 처방(`Nothing with latex` 한 조각)보다 한 번 더 나눴습니다(`Nothing` / `with latex`). 구를 끊지 않으므로 수용합니다. why와 order L2도 새 뜻에 맞췄습니다.
  빈칸(latex / nickel·iodine·perfume)은 정답이 하나뿐입니다. decoy `after dinner`는 어느 자리에 넣어도 `ko`에 맞는 문장이 되지 않습니다.

changes 항목(13.3 en/ko/chunks, 20.3 en/ko/chunks)은 실제로 바뀐 v44 키와 맞습니다. 두 문장 모두 keyPhrase가 아니어서 tsv 행이 없는 것도 맞습니다.
검사: changes 파일을 함께 두고 `verify_one_theme.py`를 돌리면 `==> 통과`입니다(V16 포함, W14 0건).

## 수정자 판단에 대한 판정
- **7.2 "반영하지 않음": 맞습니다.** 처방이 바꾸라는 것은 상황 `tagline`·`brief`입니다. 이 둘과 `persona`는 정본 시드에만 있고 base 파일에는 없습니다.
  다만 base 안에도 같은 그림(이미 가슴이 조이는데 에피네프린을 "필요할 때를 대비해" 둔다)을 받치는 v46 필드가 있습니다. 아래 1번과 함께 고쳐야 합니다.
- **20.3:** 처방대로 하고 나니 20.0(`stable until zero-two-hundred`)과 뜻이 거의 겹칩니다. 처방이 고른 결과라서 고칠 것으로 올리지 않습니다.

## 고칠 것

1. **S7 항생제 IV 중 반응: tagline·persona와 order·why가 에피네프린 지연으로 읽힘** (사실·안전)
   - 문제: tagline이 "now my chest feels tight"이고, persona는 `가슴을 짚으며 낮게 말함`입니다. 그래서 장면이 처음부터 가슴 조임(호흡기 침범)으로 시작합니다.
     그런데 keyPhrase 7.2는 `I have epinephrine ready in case we need it.`이고, order L3·L4는 `is your chest getting tighter?` / `if that tightness grows, it goes in right away`입니다.
     이대로면 "조임이 더 심해질 때까지 에피를 기다린다"로 읽힙니다.
     brief를 "즉시 근주"로 바꾸면 keyPhrase 7.2와 7.4(`I'll draw it up now…`)와 어긋나 keyPhrase를 두 개 더 고쳐야 합니다. 그래서 **장면(tagline)을 피부 증상만 있는 단계로** 바꿉니다.
     이렇게 하면 7.1·7.3이 맞는 선별 질문이 되고, "ready in case"도 미국 실무에 맞는 말이 됩니다.
   - 처방 (정본 `server/content/nurse/topics/er.yaml` 93888행 근처의 시드 필드는 합칠 때 반영):
     - `tagline`: `"You just started that IV antibiotic and now I'm itchy and my face feels hot."`
     - `brief`: `주입을 즉시 멈추고 얼굴·목·호흡 증상을 확인하며, 에피네프린을 바로 쓸 수 있게 준비하세요.`
     - `persona.speakingStyle`: `가슴을 짚으며 낮게 말함` → `팔과 목을 긁으며 낮게 말함`
     - `skills`·`goals`는 그대로 둡니다(이미 "에피네프린 준비"라서 새 장면과 맞습니다).
   - 처방 (base 파일의 v46 필드는 지금 고침):
     - order L3 `en`: `Besides that, is your throat closing up, or does your chest feel tight?` / `ko`: `그 밖에 목이 막히거나 가슴이 조이세요?`
     - order L4 `en`: `Thanks. Epinephrine is drawn up — if any of that starts, it goes in right away.` / `ko`: `고마워요. 에피네프린은 준비돼 있어요 — 그런 증상이 하나라도 생기면 바로 놓을게요`
     - order `why`의 `'that tightness'가 가슴 조임을 가리켜 심해지면 바로 에피네프린을 놓겠다고 닫아요`를
       `'any of that'이 앞 두 줄의 증상을 가리켜, 하나라도 생기면 바로 에피네프린을 놓겠다고 닫아요`로 바꿉니다.
     - 7.2 `why`의 `목이 막히거나 가슴 조임이 심해지거나 혈압이 떨어지면`을
       `목이 조이거나 숨이 차거나 혈압이 떨어지면`으로 바꿉니다(뒤의 `기다리지 않고 바로 근육주사해요`는 그대로).
     - context 3번 장면 `fix`: `…the medicine is ready if your breathing gets worse.` → `…the medicine is ready if you start having trouble breathing.`
       (`gets worse`는 숨쉬기가 이미 나쁘다는 전제를 깝니다.)

2. **단어 `w-latex`·`w-touch`의 `example`이 13.3에서 바로잡은 오류를 그대로 가짐** (뜻, 낮음)
   - 문제: 둘 다 예문이 `Nothing here should touch latex.` / `여기 있는 어떤 것도 라텍스에 닿으면 안 돼요.`입니다.
     13.3에서 고친 "사물이 라텍스에 닿으면 안 된다"는 뜻이 남아 있습니다.
   - 처방: 두 단어 모두 `example: Nothing with latex should touch you.`, `exKo: 라텍스가 든 어떤 것도 몸에 닿으면 안 돼요.`로 바꿉니다.
     changes에는 `kind: word` 항목을 두 개(`w-latex`, `w-touch`, `fields: [example]`) 더합니다.
