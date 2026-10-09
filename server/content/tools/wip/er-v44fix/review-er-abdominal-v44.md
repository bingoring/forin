# er-abdominal v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-abdominal.yaml`, `git diff changes/er/changes-er-abdominal.yaml`.
목록 행 4개(16.0 ko, 17.2 SBAR, 17.1 flat, 15.0 in quality)를 모두 대조했습니다(파일 기준 S16.0·S17.2·S17.1·S15.0). 빠진 행 없음.
changes 항목(문장 4건, w-tear·w-rip·w-still·w-reduce example, w-comfortable 추가, w-quality·w-flat·w-sbar·w-report 삭제)이 실제 변경과
맞습니다. 삭제한 네 단어는 파일에 남은 참조가 없습니다. tsv 3행이 새 en과 글자 그대로 일치합니다. 검사(스크래치 시드) `==> 통과`, W14 0건.

## 수정자 판단에 대한 판정
- **S17.1 `We're going to keep you still and comfortable to reduce the pain.`(처방 없음):** 수용. 천공·복막염 환자는 움직이면 복막이
  자극되어 가만히 있으려 하고 무릎을 굽힌 자세를 편해합니다. `flat`을 빼고 편한 자세로 가만히 있게 한다는 말은 사실에 맞고, why가
  "무릎을 굽히는 등 편한 자세"를 짚어 줍니다. ko 일치, 12단어. order L3(`lie as still as you can`)과도 어긋나지 않습니다.
- **S17.2 `I'm calling the surgeon right now to come see you.`(처방 없음):** 수용. 환자에게 SBAR라는 틀 이름 대신 누구를 왜 부르는지
  말하는 것이 맞습니다. 미국 응급실에서 외과 협진은 보통 응급의학과 의사가 요청하므로 팀 주어 `We're`가 더 정확하지만(S15 keyPhrase도
  `We're calling the surgeon…`), 간호사가 의사 지시로 외과를 호출(page)하는 일도 흔해 `I'm`도 틀리지 않습니다. 선택 사항으로만 적습니다(5).
- **SBAR pair 교체:** 수용. w-sbar·w-report를 빼면서 SBAR 글자 짝 pair를 남길 수 없고, 이 상황은 환자 대상이라 SBAR 학습은 handoff 주제가
  맡습니다. 다만 새 pair에 정답이 둘입니다(1).
- **S15.0 `Does the pain feel tearing or ripping?`:** 처방대로. 다만 청크가 바뀌어 decoy가 맞는 자리가 생겼습니다(3).

## 고칠 것

1. **S17 천공성 궤양 nuance pair `decoys` — 정답이 둘** (문법·뜻)
   - 문제: `come` + 디코이 `to the surgeon` = "come to the surgeon"(맞는 영어). `call to the surgeon`도 장면 밖에서는 성립합니다.
   - 처방: `decoys: [seeing you]` (`call seeing you`·`come seeing you` 모두 비문). why는 그대로.

2. **S17 17.2 `decoy` — 위험한 지연을 맞는 영어로 만듦** (사실·안전)
   - 문제: `tomorrow`가 `right now` 자리에 들어가면 "I'm calling the surgeon tomorrow to come see you."(천공에 외과 호출을 내일로 미루는 문장).
   - 처방: `decoy: tomorrow's` (네 자리 모두 비문 확인)

3. **S15 대동맥류 파열 15.0 `decoy` — 청크 수정으로 정답이 둘** (문체)
   - 문제: `in your leg`가 `or ripping` 자리에 들어가면 "Does the pain feel tearing in your leg?"(맞는 영어).
   - 처방: `decoy: is it sharp`

4. **S17 17.1 `decoy`·`blank`** (문체·뜻)
   - decoy 문제: `in the hallway`가 `to reduce the pain` 자리("…keep you still and comfortable in the hallway.")와
     `still and comfortable` 자리("…keep you in the hallway to reduce the pain.")에서 맞는 영어가 됩니다.
     처방: `decoy: to the pain`
   - blank 문제: 오답 `warm`이 "keep you still and warm"으로 이 장면에서도 맞는 말이라 정답이 둘에 가깝습니다.
     처방: `options: [{en: comfortable}, {en: awake}, {en: busy}, {en: thirsty}]`

5. **S17 17.2 주어(선택)** (사실, 낮음)
   - 처방(받아들이면): `en: We're calling the surgeon right now to come see you.`, chunks 첫 조각 `We're calling`, why 첫 구절
     `We're calling the surgeon right now로 팀이 지금 누구를 부르는지 알려요.`, order L2 `Because of that sign, we're calling the surgeon right now.`,
     tsv·keyphrase-seed의 new 값도 같은 en으로. ko는 주어가 없어 그대로 맞습니다.

6. **S17 17.4 `distractorsKo`에 지운 SBAR 문장** (문체)
   - 문제: `SBAR로 보고했어요`는 17.2에서 뺀 내용입니다.
   - 처방: `distractorsKo: [지금은 아무것도 드시지 마세요, 외과 선생님께 연락했어요]`

7. **S17 정본 시드 brief** (문체, 합칠 때 처리 — base 범위 밖)
   - 문제: brief "…SBAR로 외과에 긴급 보고하세요"가 환자 대상 장면·새 문장과 어긋납니다.
   - 처방: `판자복부와 기복증·패혈증 징후를 인지하고 외과에 긴급 연락하며 환자에게 쉬운 말로 알리세요.`

고칠 것 7건(사실·안전 1건: 2번. 5번은 선택).
