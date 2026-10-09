# er-poisoning v44 수정 재검토

목록 행 5개(18.5, 1.3, 17.4, 15.0/20.2 ko, chunks 3.0·14.1·17.3)를 모두 대조했습니다. 빠진 행 없음. changes 항목(문장 8건,
단어 예문/exKo 12건, w-acid 추가, w-kidney 삭제)이 실제 변경과 맞습니다. 검사 통과, W14 0건.

## 판정
- **18.5** `…because your vision and your blood's acid level are both at risk.` 처방("~류")을 그대로 써서 사실 오류(신장)는
  바로잡혔고 why·ko·w-acid가 맞습니다. w-kidney는 어디에도 안 쓰여 삭제가 맞습니다(선택지·decoy 쪽 `kidneys`는 다른 문장의
  v46 필드라 그대로 둬도 됨).
- **1.3 새 문장(처방 없음)** `I know this tastes bad, but it will help soak up the poison.` 12단어. "soak up"은 활성탄 흡착을
  설명하는 미국 병원의 일상적인 표현이고 간호사가 실제로 하는 말입니다. 수용.
- **17.4** 처방 그대로. ko·w-calm 예문 맞춤.
- **15.0·20.2 ko**와 이를 인용하는 단어 exKo, order L2(S15)·L3(S20) ko, 20.2 distractorsKo를 함께 맞췄습니다.
- **chunks 3.0·14.1·17.3**: 구가 끊기지 않습니다. 14.1의 단독 `"."` 청크는 두 문장 사이 구두점이라 수용합니다.

## 고칠 것

1. **S17 세로토닌 증후군 17.4 `blank` 오답 `moving`** (뜻·정답 둘)
   - 문제: "We're moving you and giving medication to calm your body down."은 이 장면(중환자실로 옮기며 약을 주는)에서도
     자연스러운 문장이라 정답이 둘로 읽힙니다.
   - 처방: `options: [{en: cooling}, {en: weighing}, {en: scanning}, {en: feeding}]` (`moving` → `feeding`). 데우기(warming)처럼
     고체온 환자에게 위험한 처치는 오답으로도 쓰지 않습니다.

2. **S1 활성탄 투여 설명 1.3 `ko`** (문체, 낮음)
   - 문제: "독을 빨아들여 붙잡는 데"는 설명이 과합니다.
   - 처방: `ko: 맛이 안 좋다는 거 알아요, 하지만 독을 빨아들이는 데 도움이 될 거예요.` — 같은 값으로 w-taste·w-poison
     `exKo`도 바꿉니다(changes의 두 word 항목은 이미 exKo 포함).

참고(고칠 것 아님): 18.5의 `your blood's acid level … at risk`는 조금 딱딱합니다. 더 부드럽게 하려면
`…because your vision and the acid in your blood are both at risk.`도 가능하지만 처방대로 고친 것이라 필수는 아닙니다.

고칠 것 2건(사실·안전 0건).
