# er-peds v44 수정 재검토

목록 행 3개(10.5 `nothing more` 삭제, 17.3 `could have prevented` → `This is not your fault.`, 3.4 her → his)를 모두
대조했습니다. 빠진 행 없음. changes 항목(10.5·17.3·3.4 문장, 17.1 words, w-job·w-chart 예문, w-fault 추가, w-prevent 삭제)이
실제 변경과 맞습니다. 검사 통과, W14 0건.

- 10.5: 처방 그대로. why가 의무 신고를 분명히 해 학대 상황(S18)과 어긋나지 않습니다. w-job 예문·exKo 맞춤.
- 17.3: 처방 그대로. why가 "원인 단정 금지"로 고쳐졌고, nuance pair(`this isn't` / `your fault`)와 order L2도 함께 맞췄습니다.
  w-prevent는 어디에도 안 쓰여 삭제가 맞습니다. w-cause는 14.5에 남아 있습니다. 빈칸 `fault`(choice·turn·plan) 정답 하나.
- 3.4: his로 통일, w-chart 예문 맞춤.

## 고칠 것

1. **S17 영아 SIDS 소생 실패 17.1 `words`의 `w-take` — 뜻이 다른 단어 태그** (뜻)
   - 문제: V3(상황 단어 8개)를 맞추려고 17.1 "Take all the time you need…"에 `w-take`를 붙였는데, w-take는 `ko: 재다`,
     cue "'___ her temperature'", 예문 0.5(체온 재기)인 단어입니다. 사별 장면에서 "take = 재다"를 가르치게 됩니다.
     은행에 S17 문장에 맞는 다른 기존 단어가 없습니다(w-need 없음).
   - 처방:
     - 17.1 `words: [w-alltime]`로 되돌리고, changes의 `영아 SIDS 소생 실패 index 1 words` 항목을 지웁니다.
     - 새 단어를 추가해 17.0에 붙입니다(“we did everything we could”는 사망 고지의 핵심 표현).
       ```yaml
       - id: w-everything
         en: everything
         ipa: /ˈɛvriθɪŋ/
         ko: 모든 것
         icon: handshake2
         example: I'm so sorry — we did everything we could, and she didn't survive.
         exKo: 정말 유감입니다 — 저희가 할 수 있는 모든 걸 다 했지만, 아이는 살아나지 못했어요.
         cue: 소생에 실패한 뒤 가족에게 최선을 다했다고 전할 때 — 'we did ___ we could'
         tag: 정서 지지
         distractorsEn: [everyone, evening]
         distractorsKo: [모든 사람, 저녁]
         chips: [[ev, ery, thing]]
         decoyChips: [eve, ry]
       ```
     - 17.0 `words: [w-sorry, w-survive, w-everything]`
     - changes에 `kind: sentence, situation: 영아 SIDS 소생 실패, index: 0, fields: [words]`와 `kind: word-add, id: w-everything`을 적습니다.
       (icon·chips 모양은 은행의 다른 단어와 같은 형식이니 검사기로 확인하세요.)

2. **S10 학대 의심 정황 10.5 `decoy`** (문체·조립)
   - 문제: 청크가 `["My job", "right now", "is to", "keep him safe", "."]`로 나뉘면서 decoy `at the desk`가 `right now` 자리에
     들어가 "My job at the desk is to keep him safe."라는 맞는 영어가 됩니다(바꾸기 전 청크에서는 불가능했음).
   - 처방: `decoy: keeps him safe` (`keep him safe` 자리에 넣으면 "is to keeps"로 비문, 다른 자리에도 맞지 않음).

고칠 것 2건(사실·안전 0건).
