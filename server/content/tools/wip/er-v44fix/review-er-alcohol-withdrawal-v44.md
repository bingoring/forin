# er-alcohol-withdrawal v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-alcohol-withdrawal.yaml`, `git diff changes/er/changes-er-alcohol-withdrawal.yaml`.
목록 행 3개(4.0 회복 자세, 2.3 ko, 16.0·16.3 투약 지시)를 모두 대조했습니다. 빠진 행 없음.
changes 항목(2.3 ko, 4.0 en/ko/chunks/words, 16.0·16.3 en/ko/chunks, w-breathe·w-keep·w-bed·w-status·w-another example)이 실제 변경과
맞습니다. tsv 2행이 새 en과 글자 그대로 일치합니다. 검사(스크래치 시드) `==> 통과`, W14 0건.

## 수정자 판단에 대한 판정
- **4.0 `I'm going to keep you on your side to protect your breathing.`(처방 없음, keyPhrase):** 수용. 졸리고 토할 수 있는 만취 환자의
  흡인 예방은 옆으로 눕히는 회복 자세가 표준이고, 이 상황(slider drowsy, 15분마다 재확인)과 맞습니다. 12단어, ko 일치.
  why가 회복 자세를 설명하고, order L1·L2(`With you on your side like that…`), w-keep·w-bed·w-breathe 예문까지 함께 맞췄습니다.
  침대 머리 올리기를 가리키는 말은 파일에 남아 있지 않습니다. decoy `for your privacy`는 네 자리 모두 비문, 빈칸 `breathing` 정답 하나.
- **16.0 `per protocol`, 16.3 `as ordered`(처방 없음):** 수용. 경련 지속 상태에서 벤조디아제핀 재투여는 의사 오더나 응급실 경련 프로토콜
  (예: 5분 뒤 로라제팜 재투여)에 따르는 것이고, 소생실에서 간호사가 다른 간호사에게 프로토콜·오더를 근거로 투약을 부르는 것은 실제 말투입니다.
  context 장면(팀에게)·order L1도 같은 en으로 맞췄고 context `word: status`는 세 장면 모두에 있습니다. 시드 brief "고용량 벤조를 시행하고…
  팀을 지휘하세요"와도 어긋나지 않습니다.
- **4.1·4.4·4.5 distractorsKo 3건:** 수용. "옆으로 눕혀 드릴게요"는 같은 상황의 다른 문장(4.0) 뜻이라 오답으로 자연스럽고, 각 정답 뜻과 겹치지 않습니다.
- **2.3 ko:** 처방대로.

## 고칠 것

1. **S2 CIWA 척도 설명 2.5 `distractorsKo`** (문체, 낮음)
   - 문제: 오답 `괜찮아 보여도 자주 와요`는 2.3의 옛 ko를 옮긴 것이라, 2.3 ko를 "괜찮다고 느끼셔도"로 고친 뒤에는 표현이 어긋납니다.
   - 처방: `distractorsKo: [괜찮다고 느끼셔도 자주 와요, 솔직하게 답해 주세요]`

고칠 것 1건(사실·안전 0건).
