# icu-eol-goals A 메모

## 합치기 전에 알려야 할 것 (중요)
- 결정 11 정리로 **문장 `words`(태그)를 39문장에서 바꿨다**(changes-icu-eol-goals.yaml의 sentence 항목). `combine_halves.py`는 문장 `words`가
  A·B에서 같지 않으면 멈추므로, 합칠 때 `words`는 **A의 것**을 쓰도록 비교에서 빼야 한다. B는 base의 words 그대로다.
  (B가 쓰는 `blank`·`decoy`는 words와 무관하다.)
- 단어 20개 삭제(쉬운 단어 16 + 판단분 4: thing·other·over·again), 새 단어 2개(speak·meeting), ko 12개 수정.

## 문장 판단 거리 (고치지 않음 — 검토가 판단)
- "She won't suffer — we prepare medication before we start." / "Some breaths may look irregular, but she won't feel that." — 단정적 약속. 약을 미리 준비해도 괴로움이 없다고 장담할 수는 없다.
- "I won't leave this room until she's comfortable again." / "I'm right here with you and I won't leave." — 간호사가 다른 환자 때문에 못 지킬 수 있는 약속.
- "Nothing will happen faster than your family is ready for." — 환자 상태가 가족의 준비를 기다려 주지 않을 수 있다.
- "Take a breath — you can talk to him, he can hear you." — 청각이 마지막까지 남을 수 있다는 것이지 확정은 아니다("he may still hear you"가 안전).
- "His passing looks peaceful and he's not in pain." — 사실 서술이므로 평가 근거가 있어야 한다.
- "We give just enough medication to ease his restlessness." — ko가 '불안정한 느낌'인데 restlessness는 초조·안절부절못함. 단어 ko는 '초조함'으로 고쳤다.
- "We call this process terminal weaning..." ko에 영어가 그대로 있다(의도로 보임).
- w-meet/w-meeting: 명사 meeting이 3문장이라 단어를 새로 만들어 태그를 옮겼다.
