# er-arrest v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-arrest.yaml`, `git diff changes/er/changes-er-arrest.yaml`.
목록 행 9개(16.2, 10.3, 20.3, 17.3, 17.4, 19.2, 8.2, chunks 3건(3.2·10.4·14.2), ko 번역투 4건(7.3·11.0·11.2·19.0))를 대조했습니다. 빠진 행은 없습니다.

changes 항목 14개는 실제로 바뀐 v44 키와 모두 맞습니다.
- 10.3·20.3은 `words`까지 적혀 있습니다.
- 17.4는 `words`가 바뀌지 않았으므로 en·ko·chunks만 적힌 것이 맞습니다.
- 단어 은행은 바뀐 것이 없습니다. 은행의 단어는 모두 쓰이고 있습니다(`w-round`는 10.0, `w-start`는 다른 문장에서 씁니다).

검사: changes 파일을 함께 두고 돌리면 V16은 통과입니다. 실패는 `[V4] 임산부 심정지 keyPhrase` 1건뿐인데, `keyphrases.tsv`의 1행(새 en과 글자 그대로 일치)을 합칠 때 반영하면 풀립니다. 예상된 실패입니다.

## 수정자 판단에 대한 판정
- **16.2 `lower half of the sternum`: 수용합니다.** AHA BLS가 손 위치를 말할 때 쓰는 표현입니다. 팀에게 하는 지시로는 `center of the chest`보다 정확합니다.
  임산부도 손 위치는 일반 성인과 같다는 AHA 2020 기준에 맞습니다. 11단어이고, `ko`(`흉골 아래쪽 절반에서`)도 같은 뜻입니다. 원래 why가 이미 "가슴 중앙(흉골 아래쪽 절반)"이라 서로 맞습니다.
- **20.3 `Control the bleeding first, and keep compressions going meanwhile.`: 뜻은 수용합니다.**
  출혈 조절을 우선하면서 손이 남으면 압박을 이어 간다는 내용입니다. ERC·외상 소생 원칙(가역 원인을 동시에 처치)에 맞고 order L3·L4(`Even so, anyone free keeps compressions going…`)와도 맞습니다.
  처방안(`compressions come second`)보다 압박을 멈추라는 말로 덜 읽힙니다. 다만 딸린 필드 세 곳이 새 문장에 맞지 않습니다(아래 1·2·7번).
- **ko "그의/그가" → "환자분" 4건: 수용합니다.** 7.3은 팀끼리 하는 말이지만 "환자분 칼륨 수치"는 한국 병동에서 자연스럽습니다.
  다만 **같은 상황 S11에 "그를/그의"가 두 군데 남았습니다**(아래 3·4번).
- 10.3(`in this code`)·17.3 ko·17.4·19.2·8.2·14.2 chunks는 처방대로입니다.

## 고칠 것

1. **20.3 `decoy: fluids`: `compressions` 자리에 넣으면 맞는 문장이 됨** (사실·안전)
   - 문제: `Control the bleeding first, and keep fluids going meanwhile.`은 맞는 영어입니다. 그런데 압박이 빠지고, 출혈성 심정지에서 지양하는 정질액 투여를 처치로 보여 줍니다.
   - 처방: `decoy: of fluids` (어느 자리에 넣어도 문장이 되지 않음).

2. **20.3 `blank`: 정답이 둘** (뜻)
   - 문제: `Control the bleeding quickly, and keep compressions going meanwhile.`도 이 장면에서 맞는 지시입니다.
   - 처방: `options`의 `quickly`를 `once`로 바꿉니다 → `[{en: briefly}, {en: once}, {en: first}, {en: partly}]`.
     `later`처럼 출혈 조절을 미루는 말은 위험한 처치를 보이므로 쓰지 않습니다.

3. **S11 가족 입회 소생 지원 11.0 `distractorsKo[0]`** (문체, 낮음)
   - 문제: `팀이 곧 그를 병실로 옮길 거예요`에 번역투 "그를"이 남아, 정답 ko(`환자분을 위해`)와 말투가 다릅니다. 오답이 말투만으로 걸러집니다.
   - 처방: `팀이 곧 환자분을 병실로 옮길 거예요`

4. **S11 nuance swap `ko`** (문체, 낮음)
   - 문제: `지금 팀은 그의 가슴을 눌러 뇌로 피가 계속 가게 하고 있어요`에 "그의"가 남았습니다.
   - 처방: `지금 팀은 환자분 가슴을 눌러 뇌로 피가 계속 가게 하고 있어요`

5. **3.2 `decoy: the stomach`: 바꾼 decoy가 맞는 문장으로 조립됨** (문체, 낮음)
   - 문제: `the chest` 자리에 넣으면 `Watch for the stomach to rise with each breath.`이 됩니다. 맞는 영어이고 실제로 하는 확인(위 팽창 관찰)이기도 합니다.
     `ko`와는 다르지만 학습자가 정답으로 착각할 만한 말입니다.
   - 처방: `decoy: risen` (어느 자리에 넣어도 문법이 깨짐).

6. **10.4 chunks: `Let the leader` / `know`로 `let … know` 틀을 새로 끊음** (문체, 낮음)
   - 문제: `and time / down`을 붙이다가 원래 한 조각이던 `Let the leader know`를 나눴습니다.
   - 처방: `chunks: ["Let the leader know", "the current rhythm", "and time down", "."]`

7. **17.4·20.3 chunks: 구를 끊음** (문체, 낮음)
   - 17.4 `airway` / `swelling`은 복합명사를 가릅니다(14.2에서 `core temperature`를 붙인 것과 어긋남).
     처방: `chunks: ["Run fluids wide open", "and watch for", "airway swelling", "."]` (빈칸 `swelling`은 en에 그대로 있음)
   - 20.3 `, and keep` / `compressions` / `going meanwhile`은 `keep … going`을 세 조각으로 나눕니다. 문장 끝의 `meanwhile`도 다소 어색합니다.
     처방(선택): en `Control the bleeding first, and keep compressions going in the meantime.`(11단어),
     chunks `["Control the bleeding first", ", and keep compressions going", "in the meantime", "."]`, ko는 그대로, changes 20.3 항목은 이미 en·chunks를 담고 있음.
     이렇게 고치면 1번 decoy `of fluids`도 그대로 유효합니다.
