# C5 context 장면 정비 검토 A — ER 다섯 주제 (57문항)

기준: TASK.md v46 9번, 핸드오프 `CTX`(같은 `deteriorate`가 세 장면 모두에, 보호자 장면이 어색, `fix`는 그 사람에게 맞게).
`who`·`ok`는 바꿀 수 없으므로 아래 제안은 모두 `word`·`ko`·`en`·`fix`·`why` 안에서만 고칩니다.

| 주제 | 문항 | OK | 고칠 것 |
|---|---|---|---|
| core-family-er | 13 | 8 | 5 |
| core-handoff-er | 10 | 7 | 3 |
| core-language-er | 9 | 6 | 3 |
| core-safety-er | 12 | 9 | 3 |
| er-arrest | 13 | 11 | 2 |
| 합계 | 57 | 41 | 16 |

**심각(정답이 둘로 읽히거나 메모 "뜻은 셋 다 …"가 거짓)**: family #7 practice(뜻이 다름), family #10 passed away(차트 장면이 차트 말이 아니고, 교훈이 fix와 어긋남), handoff #5 turn(차트 장면이 어색하게 읽힘 → 정답 둘), language #5 stay(뜻이 셋 다 다름), language #6 grave(가족에게 쓴 ok 장면도 어색하게 읽힘 → 정답 둘).
사실 오류는 없습니다.

---

## core-family-er

1. **stable** — OK.
2. **visitor** — OK. 안내문과 같은 문구를 가족 앞에서 읽는 대비라 어색함이 약하지만 듣는 사람 기준은 맞습니다. (fix 21단어, 길지만 두 마디라 허용.)
3. **relationship** — OK.
4. **explain** — 고칠 것.
   - `To explain: labs are pending…`의 `To explain:`은 원어민이 말로 하지 않는 영어라, 듣는 사람 때문이 아니라 문장이 이상해서 어색합니다.
   - fix가 장면 0과 거의 같은 문장입니다.
   - 안:
     - XX en: `Let me explain — labs are pending, turnaround's about an hour.`
     - fix: `Let me explain it another way — her blood test results take about an hour.`
5. **danger** — OK.
6. **stay** — 고칠 것. 장면 1과 2가 둘 다 부모에게 하는 말이라, 어색한 이유가 듣는 사람이 아니라 그냥 말투(조건을 앞세움)입니다. TASK 5번의 "그냥 무례한 말"에 해당합니다.
   - 안: 장면 2 en을 동료에게 하는 말투로 부모 본인에게 하는 것으로 바꿉니다.
     - XX en: `Mom can stay at bedside for the IV start.` (엄마 본인에게 3인칭·인계 말투)
     - fix: `You can stay right here and hold her hand while we put in the IV.`
   - 장면 1과 fix가 겹치지 않게 장면 1은 `You're welcome to stay — sit right here by her head.`로 바꿉니다.
7. **practice** — 고칠 것(심각).
   - XX의 `What religion do you practice?`에서 practice는 동사 '(종교를) 믿다'라, 메모 "뜻은 셋 다 '관습'"이 거짓입니다.
   - fix가 장면 1과 글자 하나 다르지 않게 같습니다.
   - 안: 입원 사정지의 칸을 가족에게 그대로 읽는 장면으로 바꿉니다.
     - XX en: `Cultural practices or religious preferences — any?`
     - fix: `Is there anything about your faith or traditions that's important for us to know?`
     - why: "사정지 칸 이름을 그대로 읽으면 닫힌 확인 질문이 돼요. 무엇이 중요한지 열어 물어요."
8. **private** — 고칠 것.
   - `This hallway is private enough — the doctor has bad news.`는 실제로 할 사람이 없는 억지 문장입니다.
   - fix가 장면 1과 똑같은 문장입니다.
   - 안: 복도에서 소식의 내용부터 흘리는 장면으로 씁니다. `private`은 남고, 어색함은 듣는 사람(소식을 받을 가족)에 대한 배려 부족입니다.
     - XX en: `We need a private room — the doctor has bad news about your dad.`
     - fix: `Let's go somewhere quiet where we can sit down. The doctor will join us there.`
     - why: "나쁜 소식이라는 것부터 복도에서 말하면 가족은 준비 없이 충격을 받아요. 먼저 조용한 곳으로 옮기고(SPIKES Setting), 소식은 앉은 뒤에 전해요."
9. **condition** — OK.
10. **passed away** — 고칠 것(심각).
    - 차트에 `passed away`는 표준 기록어가 아닙니다(차트는 `expired`·`pronounced`).
    - XX `Pt passed away at 2:30. Sign here for his belongings.`는 'Pt'를 소리 내어 말하는 사람이 없고, 어색함이 서류에 있지 `passed away`에 있지 않습니다.
    - fix는 `died`를 쓰는데, 사망 고지 지침도 가족에게는 완곡어 대신 `died`를 권합니다. 그런데 `word`가 완곡어 `passed away`라 교훈이 서로 엇갈립니다.
    - 안(권장): base의 원래 장면으로 돌리고 `word: expired`, `ko: 사망하다`로 씁니다. `expired`는 차트·동료 사이에서는 맞는 말이고 가족에게만 차갑습니다. 이는 핸드오프의 `deteriorate`와 같은 모양이며, TASK가 금지한 owie류(어디서도 틀린 말)가 아닙니다.
      - 장면 0: `Pt expired at 14:32. Family at bedside.`
      - 장면 1: `Bed 3 expired at 2:30 — the family's in the quiet room.`
      - XX: `Your husband expired at 2:30.`
      - fix: `I'm so sorry — your husband died at 2:30. I'll stay with you.`
      - why: base의 why를 쓰고, "가족에게는 완곡어보다 died처럼 분명한 말을" 한 줄을 더합니다.
11. **CPR** — OK.
12. **comfort** — OK.
13. **keepsake** — OK. XX `make a keepsake of handprints`가 조금 어색하지만 듣는 사람 대비는 분명합니다. 원하면 `We need to do keepsake handprints before transport.`로 바꿉니다.

## core-handoff-er

1. **chief complaint** — OK.
2. **dose** — OK.
3. **correct** — 고칠 것(ko만). 장면 1(차트)의 `correct`는 형용사 '맞는'이라 메모 "뜻은 셋 다 '맞나요?(확인)'"이 차트 장면에 맞지 않습니다. ko를 `맞는(확인)`으로 바꿉니다. 장면 구성은 좋습니다.
4. **pending labs** — OK.
5. **turn** — 고칠 것(심각). `Pt may turn quickly`는 차트에 쓰지 않는 구어라 차트 장면(ok)도 어색하게 읽혀 정답이 둘이 됩니다. `who`(차트 기록)를 바꿀 수 없으니 word를 바꿉니다.
   - 안 A(권장): `word: closely`, `ko: 주의 깊게`
     - 장면 0: 그대로(`Watch her closely — she could turn quickly.`)
     - 차트: `Pt at risk for rapid deterioration; monitoring closely.`
     - XX: `She could turn quickly, so watch her closely and call us if anything changes.`
     - fix·why는 그대로입니다. 'turn' 구어는 ok 장면 0과 XX에 남습니다.
   - 안 B: `word: deteriorate`. 핸드오프 예시와 겹치므로 비권장입니다.
6. **bed** — OK.
7. **onset** — OK.
8. **drip** — OK.
9. **status** — 고칠 것. 구절 학습을 살리는 안입니다. 차트 장면은 `who` 고정이라 `Forget what I just said`를 word로 되돌릴 수 없습니다. word는 `status`로 두고, 구절은 장면 0(ok, 동료끼리 인계를 무를 때)의 본보기로 남깁니다. XX는 구절과 임상어를 같이 담아 가족에게 안 맞게 씁니다.
   - XX en: `Forget what I said — his status has changed. He's desatting.`
   - fix: `I need to update you — his oxygen level has dropped, and the team is with him now.` (지금 fix의 "things have changed"는 너무 흐립니다)
   - why: "'Forget what I just said'는 동료 사이에서 인계를 무를 때 쓰는 말이고, status·desatting은 의료진 말이에요. 가족에게는 앞서 한 말을 없던 일로 하라는 말로 들리니, 무엇이 바뀌었는지 쉬운 말로 알려요."
10. **red** — OK.

## core-language-er

1. **call** — OK.
2. **understand** — OK. 같은 환자에게 쓴 '방법' 대비라 CTX와 결은 다르지만, 통역을 거치는 LEP 환자라는 듣는 사람 때문에 생기는 문제이고 근거(teach-back)가 있습니다. 유지합니다.
3. **find** — 고칠 것(경미). 장면 1 `Still trying to find … — 40 minutes out`에서 '아직 찾는 중'과 '40분 거리(이미 오는 중)'가 서로 맞지 않습니다.
   - 안: `Still trying to find a Mam interpreter — the service says maybe 40 minutes.`
4. **arrange** — OK.
5. **stay** — 고칠 것(심각).
   - 장면 0의 `stay with me`는 환자에게 하면 '정신 놓지 마세요/저와 함께 있어요'입니다(TASK 7번).
   - 장면 1은 '곁에 있어 주다', XX는 '그 자리에 그대로 있다'라 메모 "뜻은 셋 다 '함께 있다'"가 거짓입니다.
   - 안:
     - `ko: 머물다(그대로 있다)`
     - 장면 0: `The interpreter is coming — please stay here with me.`
     - 장면 1: `Interpreter is five minutes out — can you stay in the room with him?`
     - XX·fix는 그대로입니다.
6. **grave** — 고칠 것(심각). 가족에게 쓴 ok 장면 `his condition is very grave`도 LEP 가족에게는 격식어라, why("쉬운 말로")에 비추면 어색하게 읽혀 정답이 둘입니다. `very grave`도 자연스럽지 않습니다.
   - 안(권장): base의 장면 1을 살려 `word: critical`, `ko: 위중한`으로 씁니다.
     - 장면 0: `I'm so sorry — he's in critical condition.`
     - 장면 1: `Bed 6 is critical — MAP 55 on two pressors.`
     - XX: `He's critical — hemodynamically unstable on two pressors.`
     - fix: `I'm so sorry — he is very sick, and we're doing everything we can.`
     - why에서 prognosis는 뺍니다.
7. **consent** — OK.
8. **misunderstanding** — OK. XX가 기록문 같은 단정이라 환자에게 맞지 않습니다.
9. **question** — OK. #2와 같은 사유로 유지합니다(AHRQ 근거 사실).

## core-safety-er

1. **date of birth** — OK.
2. **call** — 고칠 것. 덧붙인 `or we'll call your doctor`는 위협을 지어낸 것이고, 장면 0과 듣는 사람이 같아 말투 대비일 뿐입니다.
   - 안: 인계 말을 환자에게 그대로 하는 장면으로 씁니다.
     - XX en: `You're a high fall risk, so you need to call before ambulating.`
     - fix: 그대로
     - why: "'fall risk'·'ambulating'은 동료끼리의 말이에요. 환자에게는 혼자 일어나지 말고 부르면 도와준다고 쉬운 말로 해요."
3. **allergies** — OK.
4. **secure** — OK.
5. **remind** — OK. 섬망이라는 듣는 사람에 맞춘 교훈입니다.
6. **unknown male** — OK.
7. **restraints** — 고칠 것.
   - XX `We've got him in restraints because he wouldn't stop pulling his lines.`는 실제 간호사가 흔히 하는 말이라 어색함이 약하고, 동료에게 한 장면 1과 내용도 거의 같습니다.
   - fix `This is temporary…`는 무엇이 임시인지 가리키는 말이 없고, `lines`가 그대로 남아 있습니다.
   - 안:
     - XX en: `He's in restraints per policy for line protection.`
     - fix: `These soft straps are just for now, to keep him from pulling out his IV. We check on him often.`
8. **isolation** — OK.
9. **remove** — 고칠 것(경미). fix가 장면 0(원래 문장)과 거의 같고, 환자 본인의 벨트·신발끈을 맡아 두는 일을 다루지 않습니다.
   - 안: fix를 `For your safety, we remove belts and shoelaces for everyone here — can I hold on to yours?`로 바꿉니다.
10. **time-out** — OK. 듣는 사람이 같은 '절차' 대비지만 안전 교훈의 근거가 분명합니다.
11. **MRN** — OK.
12. **ambulatory** — OK.

## er-arrest

1. **code** — OK.
2. **push** — OK. 압박자에게 지나치게 공손한 말이 그 자리에 안 맞는다는, 반대 방향의 듣는 사람 대비입니다.
3. **rise** — OK.
4. **V-fib** — 고칠 것(경미). fix가 19단어로 깁니다.
   - 안: `His heart is quivering instead of pumping, so we're shocking it to reset the rhythm.`
5. **pneumo** — OK. 차트가 듣는 쪽인 반대 방향 대비입니다.
6. **IO** — OK.
7. **epi** — OK.
8. **field** — OK.
9. **recoil** — OK.
10. **warm** — 고칠 것(경미). fix가 23단어로 깁니다.
    - 안: `He's very cold, and cold can protect the brain, so we'll keep going while we warm him.`
11. **difficult** — OK.
12. **re-arrest** — OK.
13. **traumatic** — OK.
