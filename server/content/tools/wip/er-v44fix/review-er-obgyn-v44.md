# er-obgyn v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-obgyn.yaml`, `git diff changes/er/changes-er-obgyn.yaml`.
목록 행 7개(19.4 빈칸, 6.3/19.4 진단 고지, 19.5 ko, 8.3, 15.1, words 3건, chunks 6건)를 모두 대조했습니다. 빠진 행 없음.
changes 항목은 실제로 바뀐 v44 키(6.3·8.3·15.1 en/ko/chunks(+words), 19.5 ko/chunks, 4.1·6.5·10.4·17.1·18.1 chunks,
w-miscarriage·w-exam·w-evidence·w-headache·w-seizure example/exKo)와 모두 맞습니다. V16 통과.
검사: changes 파일을 함께 두고 돌리면 `[V4] 자간전증·자간증 keyPhrase` 1건만 실패합니다. keyPhrase는 정본 시드에 있어서
`keyphrases.tsv` 1행(새 en과 글자 그대로 일치)을 합칠 때 반영하면 풀립니다. 예상된 실패입니다.

## 수정자 판단에 대한 판정
- **19.4 `en` 유지(처방 없음): 맞습니다.** S19는 처음부터 간호사가 전하는 구조입니다(19.0 "we're not able to find the
  baby's heartbeat", 19.3 예고, order L2 "the ultrasound shows it has stopped"). 19.4 한 줄만 "The doctor has confirmed…"로
  바꾸면 19.0·order와 어긋납니다. why가 이미 "의사가 초음파로 확인한 뒤 고지, 간호사는 곁에서 같은 말을 이어 감"으로
  틀을 잡고 있습니다. 의사 고지 모델로 바꾸려면 상황 단위(19.0·19.3·19.4·order) 재설계라 사용자 결정 사항입니다.
- **19.4 빈칸 B6:** 처방의 (b)안(빈칸을 `sorry`로 이동)을 골랐습니다. 정답 하나, 오답(sure·tired·busy)이 위험한 말을
  보이지 않습니다. 수용합니다. 다만 이 행은 "사용자 판단"으로 넘어간 항목이라 (b)를 택했다는 사실을 사용자에게 알립니다.
- **6.0·15.4·19.2 `words: []` 유지: 수용합니다.** 은행에 맞는 단어가 없습니다(`w-spot`은 spotting이라 15.4의 spots와
  뜻이 다름). V3 통과. 새 단어 추가는 선택 사항입니다.
- **6.3 swap `before`·`ko` 변경:** 처방이 swap `before`도 함께 고치라 했으므로 맞습니다.
- **15.1 새 문장(처방 없음)** `Tell me right away if your headache gets worse or your vision changes.` — 13단어. 두통 악화·
  시야 변화는 자간전증 중증 징후로 미국 산과·응급 교육의 표준 경고 증상입니다. 간호사가 실제로 하는 말이고 `ko`도
  같은 뜻입니다. keyPhrase 교체(tsv)도 새 en과 일치합니다. w-feel·w-seizure를 15.1에서 뺐지만 w-feel은 다른 문장에 쓰이고,
  w-seizure 예문은 15.5로 옮겨 exKo까지 맞습니다. order L4·context 장면과도 어긋나지 않습니다.

## 고칠 것

1. **S15 자간전증·자간증 15.1 `blank` — 정답이 둘** (사실·안전에 가까움)
   - 문제: 빈칸은 그대로 `headache` / dizziness / nausea / swelling인데, 새 틀 "if your ___ gets worse"에서는
     `swelling gets worse`·`nausea gets worse`도 이 장면에서 실제로 알려야 하는 증상입니다(15.3이 바로 부종을 묻습니다).
     오답이 "알리지 않아도 되는 증상"처럼 보이는 것도 바람직하지 않습니다.
   - 처방: 빈칸을 `worse`로 옮깁니다.
     `blank: {answer: worse, options: [{en: worse}, {en: better}, {en: milder}, {en: shorter}]}`
     (`answer`는 en에 글자 그대로 있음. 오답은 모두 틀린 뜻이고 위험한 처치를 보이지 않음.)

2. **S6 유산 진행 중 소통 nuance swap `who`** (문체, 낮음)
   - 문제: 문장이 진단 고지에서 "걱정을 전하고 의사에게 잇기"로 바뀌었는데 `who`가 아직 `환자에게 · 진단 전달`입니다.
   - 처방: `who: 환자에게 · 유산 가능성 전달`

3. **S19 태아 사망 고지 19.5 `decoy`** (문체, 낮음)
   - 문제: 바뀐 청크에서 `to explain this`가 `to cause this` 자리에 들어가면 "There was nothing you could have done to
     explain this."라는 맞는 영어가 됩니다.
   - 처방: `decoy: caused this` (어느 자리에 넣어도 비문)

고칠 것 3건(사실·안전 1건).
