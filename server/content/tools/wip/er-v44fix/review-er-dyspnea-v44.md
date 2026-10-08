# er-dyspnea v44 수정 재검토

대조: 정본 export ↔ `base-er-dyspnea.yaml`, changes 새 항목 6건.
목록 5행이 모두 반영됐다. changes는 실제 바뀐 v44 키와 맞는다. base S18 `keyPhrases`는 정본 + tsv와 같다. V4 실패 1건은 apply 뒤 사라진다.

## 판정 요청 항목
- **1.1 why만 고친 처리:** 지적을 해결한다. 검토자 처방이 "문장 유지, why에 '보통은 알리지 않고 세지만 환자가 물으면 이렇게 답해요' 추가"였고, 그대로 반영됐다.
  - 상황 brief("측정 과정을 설명")에도 문장이 맞는다.
  - 남은 어긋남은 아래 3번(선택).
- **18.0 "per protocol":** 처방의 선택지 그대로이고, 동료에게 하는 지시가 standing order에 근거한다는 것을 보여 준다. 미국 응급실의 아나필락시스 프로토콜 관행과 맞다.
  - 청크 `per protocol —`, order L1, w-epinephrine example·exKo까지 맞췄다.
- **21.1 "Let me check if air is moving through it."(새로 씀):** 맞다. 개통 확인을 간호사가 직접 한다는 지적을 문장으로 해결했다.
  - why(관 입구의 공기, 흡인 카테터 통과)가 S21 slider why와 맞는다.
  - 빈칸(air / water·heat·fluid)과 decoy(stuck inside)에 문제가 없다.
  - 청크 `if air / is moving`은 받아들일 만하다.

## 고칠 것
1. **S18 context 장면 0이 고친 문장과 어긋남(사실·안전, 경미)**
   - 문제: ok 장면 "Give IM epi now — her airway is closing."(팀에게)이 18.0에서 고친 바로 그 형태(처방 근거 없는 투약 지시)로 남아 있다.
   - 처방: scenes[0].en을 `Give IM epi now per protocol — her airway is closing.`로 바꾼다. word `epi`가 그대로 들어 있어 W14는 지켜진다.
2. **S21 order why가 옛 문장을 설명함(문체)**
   - 문제: order why가 "흡인한 뒤 공기가 통하는지 묻고"라고 하지만, L2는 이제 간호사가 확인하는 문장이다.
   - 처방: 그 부분을 `흡인한 뒤 공기가 통하는지 직접 확인하고`로 바꾼다.
3. **(선택) S1 order L3이 1.1의 새 why와 어긋남(사실, 경미)**
   - 문제: L3 "While it reads, I'll also count your breaths for that minute."는 세기 전에 먼저 알리는 문장이다. 1.1 why가 새로 말하는 "보통은 의식하지 않게 조용히 센다"와 맞지 않는다.
   - 처방:
     - L3 `en`: `While it reads, just rest and breathe normally for that minute.`
     - L3 `ko`: `재는 동안 그 1분은 편히 쉬면서 평소처럼 숨 쉬세요`
     - L4 `en`: `Once we have the number, if your oxygen is low, we'll give you some.`
     - L4 `ko`: `수치가 나오면, 산소가 낮을 때 산소를 드릴게요`
     - order why: "…재는 동안 편히 쉬게 하고(그 사이 호흡수는 조용히 세요), 수치가 나오면 필요한 조치를 알립니다. 'It'·'that minute'·'the number'가 앞 줄을 가리켜 순서가 하나예요."
   - order는 v44 필드가 아니므로 changes 항목은 필요 없다.

## 확인만
- 11.4 "until the interpreter arrives"는 처방대로 고쳤다.
  - distractorsKo를 "가족분께 통역을 부탁할게요"로 바꾼 것은 새 정답과 겹치던 오답을 치운 것이라 맞다. chestpain 10.2에도 같은 오답이 있다.
- 12.3 청크는 맞게 고쳤다.
