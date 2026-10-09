# C5 context 장면 정비 검토 B — ER 다섯 주제 (54문항)

기준: TASK.md v46 9번, 핸드오프 `CTX`(같은 `deteriorate`가 세 장면 모두에, 보호자에게 쓴 장면이 어색, `fix`는 그 사람에게 맞게). 판정 기준은 묶음 A(`review-ctx-A.md`)와 같습니다.
`who`·`ok`는 바꿀 수 없으므로 아래 제안은 모두 `word`·`ko`·`en`·`fix`·`why` 안에서만 고칩니다. 제안한 `word`와 장면 문장은 모두 W14 어간 비교(`_has`)를 통과하는지 스크립트로 확인했습니다.

| 주제 | 문항 | OK | 고칠 것 |
|---|---|---|---|
| er-arrhythmia | 7 | 4 | 3 |
| er-asthma-copd | 11 | 9 | 2 |
| er-chestpain | 13 | 2 | 11 |
| er-dyspnea | 11 | 9 | 2 |
| er-pain-sedation | 12 | 6 | 6 |
| 합계 | 54 | 30 | 24 |

**심각한 것**
- chestpain #1 `start`: XX `symptom start relative to presentation`은 영어가 아닙니다. 지금 XX에는 why가 말하는 `onset`·`PTA`도 없습니다.
- chestpain #12 `call`: `calling an escalation of care`는 쓰지 않는 말입니다.
- pain-sedation #12 `BP`: `Your BP is hypotensive`는 영어로 틀렸습니다.
- arrhythmia #4 `syncopal`, asthma-copd #8 `orthopnea`: ✓ 환자 장면(본보기)이 실제 간호사가 하지 않는 말을 가르칩니다(아래 "풀어 쓰기 방식" 참고).

**fix가 다른 장면과 똑같은 것**: chestpain `rhythm`·`detail`·`point`·`inflammation`·`call`은 fix가 ✓ 장면 0과 한 글자도 다르지 않습니다. `ECG`·`press`·`tear`·arrhythmia `mag`·asthma `CO2`·pain `slow`·`procedure`는 거의 같습니다. 대부분 정본(base)에서 물려받은 것이지만 이번 정비에서 함께 고칩니다. 학습자는 "고친 문장 따라 말하기"에서 이미 본 문장을 다시 말하게 됩니다.

사실 오류: arrhythmia #2의 why "OTC는 의료진 말"은 틀렸습니다(OTC는 미국 소비자가 쓰는 말입니다). epi 두 문항은 why가 사라진 `epi`를 아직 말하고 있습니다.

---

## 저작자가 짚은 곳 — 총평

### 1. 임상어 `word` + ✓ 환자 장면에서 바로 풀어 쓰기
- **방식 자체는 허용합니다.** `who`가 고정이라 환자 ✓ 장면을 없앨 수 없고, 임상어를 환자에게 쓰되 풀어 주는 일은 실제 간호에서 하는 일입니다. 환자가 표지판·서류에서 보는 말이면 더 그렇습니다. 교훈("설명 없이 쓰지 말라")도 핸드오프 교훈(듣는 사람에 맞춰 온도를 바꾼다)과 결이 맞습니다.
- **조건은 둘입니다.**
  - ① 풀어 쓴 ✓ 문장이 **원어민 간호사가 실제로 하는 말**이어야 합니다.
  - ② fix가 ✓ 문장의 풀이 부분을 그대로 베끼지 않아야 합니다.
- **한계도 있습니다.** 이런 문항은 ✓와 XX가 둘 다 환자에게 하는 말이라 메모의 "듣는 사람이 달라요"가 문자 그대로는 맞지 않습니다. 묶음 A의 `understand`·`question`처럼, 같은 사람에게 하는 방법의 대비로 받아들입니다.
- 문항별 판정:
  - **유지**: `electrode`("These electrodes are just stickers…"), `OTC`, `interrogation`(장치를 가진 환자는 이 말을 실제로 듣습니다), `productive`("Is your cough productive — are you bringing anything up?"는 흔한 말), `NPO`(환자가 표지판으로 봅니다).
  - **유지(경미)**: `anticoagulated`. 조금 딱딱하지만 실제로 하는 말이고, 명사형으로 바꾸면 W14를 통과하지 못합니다.
  - **word 교체 권장**: `syncopal`, `orthopnea`, `sputum`. "Any syncopal episodes — did you…" / "Any orthopnea — is it…" / "Sputum is just the phlegm…"는 용어를 가르치는 교사 말투입니다. 환자에게 하는 실제 영어가 아니고, ✓ 본보기로 두면 그 어색한 말투를 가르칩니다. 이 셋은 임상어가 XX에만 남도록, 세 장면에 자연스럽게 들어가는 다른 낱말(`episode`, `lie flat`, `cough up`)을 `word`로 고릅니다. 묶음 A `turn`→`closely`와 같은 수법입니다.

### 2. `epi` → `epinephrine` 풀어 쓰기
- 팀 콜아웃의 `epinephrine`은 틀리지 않습니다(약어를 피하는 안전 관행도 있습니다). 다만 미국 응급실 구두 콜아웃은 `epi`가 압도적으로 많고, 원래 교훈(팀 줄임말 ↔ 환자 설명)도 약해졌습니다.
- **W14는 `epi`로도 통과합니다.** 어간 비교가 `tk.startswith(st)`라서 `epi`는 `Epinephrine`에 걸립니다. 그래서 바꿀 이유가 없었습니다.
- 권장: 두 문항 모두 `word: epi`로 되돌리고, 콜아웃·XX는 정본의 `epi` 문장, 차트는 `Epinephrine`으로 둡니다. epinephrine을 유지하려면 적어도 why에서 `epi`를 뺍니다(dyspnea #10, pain-sedation #10).

### 3. 어색함이 약한 XX
- chestpain `start` — 약한 것을 넘어 영어가 틀렸습니다(심각). 아래 안대로 고칩니다.
- chestpain `call` — `calling an escalation of care`가 비문입니다. 실제 말인 `calling a rapid response`로 바꿉니다.
- pain-sedation `BP` — 영어로 틀렸습니다(심각). 의료진 은어 `soft`로 고칩니다.
- pain-sedation `drowsy` — `drowsy through CNS depression`이 부자연스럽습니다. 임상 설명 말투로 다시 씁니다(경미).

### 4. 환자 ✓ 장면이 없는 asthma-copd 문항(PEF, bronchodilator, peak flow, burst, accessory muscle)
- 그대로 두는 것이 맞습니다. 의료진 장면 ✓ 둘에 환자 장면 XX 하나라서 핸드오프 `CTX`(차트·의사 콜 ✓, 보호자 XX)와 **가장 같은 모양**입니다. 다섯 문항 모두 OK입니다.
- `peak flow`는 장면 0이 환자 ✓ 장면이지만("Your peak flow is improving") 천식 환자가 실제로 쓰는 말이라 문제없습니다.

---

## er-arrhythmia

1. **electrode** — OK. 장면 1 `Electrodes are on`은 동료끼리라면 `Leads are on`이 더 흔하지만 맞는 말입니다.
2. **OTC** — 고칠 것(why).
   - 장면 구성은 좋습니다. XX의 어색함은 `sympathomimetics`에서 나옵니다.
   - why의 "OTC는 의료진 말"은 사실이 아닙니다.
   - why 안: "sympathomimetic(교감신경 흥분제)은 의료진 말이에요. OTC는 환자도 아는 말이지만, 감기약·다이어트 약처럼 구체적인 예를 들어야 빠짐없이 답해요."
3. **anticoagulated** — OK(경미). 장면 0 `Are you anticoagulated —`는 형용사로 환자에게 묻는 꼴이라 조금 딱딱하지만, 바로 blood thinner로 풀어 주는 실제 말투입니다. 명사 `anticoagulants`로 바꾸면 자연스럽지만 W14 어간(`anticoagulat`)에 걸리지 않으므로(`anticoagulan-`), 지금 문장을 유지합니다.
4. **syncopal** — 고칠 것(심각). 위 총평 1을 따릅니다.
   - 안: `word: episode`, `ko: (증상이 있었던) 한 번` — 세 장면 모두 '증상이 한 번 있었던 일'이라는 같은 뜻입니다.
   - 장면 0: `Have you had any episodes where you actually passed out, or just felt close to it?`
   - 장면 1: 그대로(`Pt reports one syncopal episode at home today.`)
   - XX: 그대로(`Have you had any syncopal episodes?`)
   - fix: 그대로
   - why: "syncopal은 의료진 말이에요. 환자에게는 pass out·black out처럼 일상어로 물어야 무엇을 묻는지 알아들어요."
5. **interrogation** — OK. 장치를 가진 환자는 `interrogation`을 실제로 듣고, "just a quick check"라는 풀이가 자연스럽습니다.
6. **flag** — OK.
7. **mag** — 고칠 것. fix `I'm drawing up some magnesium to protect your heart rhythm.`이 장면 1과 `some` 한 낱말만 다릅니다(정본에서 물려받음).
   - fix 안: `This is magnesium — it helps keep your heartbeat steady.`

## er-asthma-copd

1. **PEF** — OK. XX는 `percent of predicted`, fix는 "평소의 절반"이라 기준이 서로 다르지만, 장면 0·1(180 vs 개인 최고 400)과 맞는 쪽이 fix라 괜찮습니다.
2. **bronchodilator** — OK.
3. **peak flow** — OK.
4. **burst** — OK.
5. **accessory muscle** — OK.
6. **CO2** — 고칠 것. fix가 장면 0과 거의 같은 문장입니다(`CO2`→`carbon dioxide`만 다름).
   - fix 안: `Your body tends to hold on to carbon dioxide, so we keep your oxygen a little lower on purpose.`
   - fix가 '왜 산소를 낮게 두는지'까지 말해 장면 0과 겹치지 않습니다.
7. **adherence** — OK.
8. **orthopnea** — 고칠 것(심각). 위 총평 1을 따릅니다. 장면 0 `Any orthopnea — is it harder…`는 환자에게 하지 않는 말이고, fix와 내용도 겹칩니다.
   - 안: `word: lie flat`, `ko: 똑바로 눕다`
   - 장면 0: `Can you lie flat to sleep, or do you need extra pillows?`
   - 장면 1: `Orthopnea — unable to lie flat, sleeps on three pillows.`
   - XX: `Do you have orthopnea, or can you lie flat?`
   - fix: 그대로(`Do you get more short of breath when you lie flat?`)
   - why: 그대로(정본 why로 되돌려도 됩니다)
9. **silent chest** — OK. 보호자 장면이 어색한, 핸드오프와 같은 모양입니다.
10. **RSI** — OK.
11. **prior intubation** — OK.

## er-chestpain

1. **start** — 고칠 것(심각).
   - XX `What was the time of symptom start relative to presentation?`는 원어민이 쓰지 않는 말입니다(`symptom onset`이라면 말이 됩니다).
   - why가 말하는 `onset`·`PTA`가 XX에 없습니다.
   - fix `What time did the pain first start?`는 장면 0과 거의 같습니다.
   - 안:
     - XX: `Did symptoms start at rest or on exertion, and how long PTA?`
     - fix: `Were you resting or active when it started, and how long ago was that?`
     - why: "PTA(병원 도착 전)·on exertion 같은 말은 차트와 의료진끼리의 말이에요. 환자에게는 '쉬고 있었는지, 움직이고 있었는지, 얼마나 전인지'를 쉬운 말로 물어요."
2. **priority** — 고칠 것. fix `I'm placing you in a higher priority`는 어색한 영어입니다.
   - fix 안: `I'm moving you up the list so the doctor can see you sooner.`
   - XX는 `roomed`·`ESI 2` 때문에 분명하게 어색하니 그대로 둡니다.
3. **burning** — OK.
4. **press** — 고칠 것.
   - 장면 0과 fix가 둘 다 21단어 안팎이고, 내용이 거의 같습니다(chest wall, 그래도 검사).
   - 장면 1도 18단어로 깁니다.
   - 안:
     - 장면 0: `Does it hurt more when I press here?`
     - 장면 1: `Pain reproduces when I press on the sternum — maybe costochondritis, but ECG's still pending.`
     - fix·XX·why는 그대로 둡니다. 심장 배제를 경고하는 말이 fix에 남습니다.
5. **ECG** — 고칠 것. fix가 장면 0과 거의 같습니다(`an ECG`→`a quick heart test`).
   - fix 안: `We're checking your heart right now, and the doctor is on the way.`
6. **rhythm** — 고칠 것. fix가 장면 0과 글자 하나 다르지 않게 같습니다(정본에서 물려받음).
   - fix 안: `Your heartbeat looks steady so far — that's good, but we're still checking.`
   - why의 "so far를 붙여" 교훈과도 맞습니다.
7. **detail** — 고칠 것. fix가 장면 0과 똑같습니다.
   - fix 안: `Please tell me everything you're feeling — even the small stuff matters.`
8. **medicine** — OK.
9. **point** — 고칠 것. fix가 장면 0과 똑같습니다.
   - XX는 `indicate`가 `point`로 바뀌어 어색함이 약해졌지만, 영어가 서툰 환자에게 쓴 긴 격식 문장이라 여전히 분명합니다.
   - fix 안: `Show me — where does it hurt?`
10. **tear** — 고칠 것(경미).
    - fix가 장면 0에 `between your shoulder blades`만 더한 문장입니다.
    - XX에 `tearing`을 미리 넣어 유도 질문이 됐는데, 이건 word 때문에 피할 수 없으니 허용합니다.
    - fix 안: 정본 fix로 되돌립니다 — `Does the pain go into your back, between your shoulder blades?`
11. **inflammation** — 고칠 것. fix가 장면 0과 똑같습니다.
    - fix 안: `The lining around your heart may be irritated — that can cause this kind of sharp pain.`
12. **call** — 고칠 것(심각).
    - XX `calling an escalation of care`는 쓰지 않는 말입니다(`escalate care`는 동사로 씁니다).
    - fix가 장면 0과 똑같습니다.
    - 안:
      - XX: `You're decompensating, so I'm calling a rapid response.` (`decompensating`·`rapid response`는 의식이 흐려지는 환자가 못 알아듣는 말입니다)
      - fix: `I'm right here with you — more help is coming right now.`
      - why: "decompensating·rapid response는 의료진끼리의 말이에요. …"(뒤는 그대로)
13. **update** — 고칠 것(길이). 장면 0이 22단어입니다.
    - 장면 0 안: `Quick update on bed 3 — chest pain's back at 7/10, repeat ECG done.`
    - XX·fix는 그대로 둡니다.

## er-dyspnea

1. **SpO2** — OK. 의사에게 하는 말로는 `Sats are 91`이 더 흔하지만 `SpO2 is 91`도 실제로 씁니다.
2. **dry** — OK.
3. **productive** — OK. 총평 1의 유지 사례입니다. fix `Are you coughing anything up?`이 장면 0의 풀이와 비슷하지만 문장이 다르니 허용합니다.
4. **sputum** — 고칠 것.
   - 장면 0 `Sputum is just the phlegm you cough up —`는 용어를 가르치는 말투입니다.
   - 정본의 교훈은 "환자에게는 phlegm"이었는데, `word: sputum`이 그 교훈을 거꾸로 만듭니다.
   - fix `What color is it — …`는 `it`이 무엇인지 가리키지 않습니다.
   - 안:
     - `word: cough up`, `ko: 기침해서 뱉다`
     - 장면 0: 정본으로 되돌립니다(`What color is the phlegm you're coughing up?`)
     - 장면 1: `Coughing up purulent green sputum.`
     - XX: `Are you coughing up purulent sputum?`
     - fix: `Is the phlegm clear, yellow, or green?`
     - why: 정본 why로 되돌립니다.
5. **push** — OK.
6. **breath sounds** — OK.
7. **muscle** — OK.
8. **reassuring** — OK.
9. **sats** — OK. 같은 팀에게 하는 말을 두고, 짧아야 할 곳을 길게 말한 반대 방향의 대비입니다(묶음 A arrest `push`와 같은 사유). `sats`를 격식 문장에 끼운 것이 조금 어색하지만 XX라서 괜찮습니다.
10. **epinephrine** — 고칠 것(why). 위 총평 2를 따릅니다.
    - 권장: `word: epi`로 되돌리고, 장면 0과 XX도 정본(`epi`)으로 되돌립니다. W14를 통과합니다.
    - epinephrine을 유지할 경우 why를 "IM·angioedema는 의료진끼리의 줄임말과 진단명이에요. …"로 고쳐 `epi`를 뺍니다.
11. **trach** — OK.

## er-pain-sedation

1. **rate** — 고칠 것(경미). XX `rate your pain by quantifying it on the NRS`는 rate와 quantify가 겹치는 억지 문장입니다.
   - XX 안: `Please rate your pain on the NRS.`
   - fix·why는 그대로 둡니다.
2. **drowsy** — 고칠 것(경미). XX `make you drowsy through CNS depression`이 부자연스럽습니다.
   - XX 안: `This causes CNS depression, so you may get drowsy.`
   - 의료진이 환자에게 그대로 말해 버리는 꼴이라 어색함이 분명합니다.
   - fix·why는 그대로 둡니다.
3. **raise** — OK. 차트에서는 `elevated`가 더 표준이지만 `raised`도 맞는 말입니다.
4. **ask for more** — OK. 차트가 듣는 쪽인 반대 방향의 대비입니다.
   - 원하면 장면 0을 `I hear that you need more, so I'm going to talk to the doctor.`처럼 다듬을 수 있지만, 그러면 word가 빠지므로 지금 문장을 유지합니다.
5. **NPO** — OK. 총평 1의 유지 사례입니다(환자가 표지판으로 보는 말이라 풀어 주는 것이 실제 관행입니다).
6. **minimize** — OK.
7. **slow** — 고칠 것.
   - fix가 장면 0과 거의 같습니다(`sleeping pill`→`anxiety pill`, `Mixing`→`Taking`).
   - 약 이름도 장면끼리 서로 다릅니다.
   - fix 안: `Your anxiety pill plus this pain medicine can slow your breathing, so I'll check on you often.`
   - 장면 0의 `sleeping pill`을 `anxiety pill`로 맞추는 것은 선택입니다.
8. **procedure** — 고칠 것(경미). fix가 장면 0의 `You did great — … all done`을 그대로 씁니다.
   - fix 안: `Everything went well — you're waking up now, and I'm right here.`
9. **sats** — OK.
10. **epinephrine** — 고칠 것(why). 위 총평 2를 따릅니다.
    - 권장: `word: epi`로 되돌리고, 장면 0과 XX를 정본(`epi 0.5 IM`)으로 되돌립니다.
    - 유지할 경우 why의 "'epi 0.5 IM'"을 "'epinephrine 0.5 IM, now!' 같은 짧은 명령형"으로 고칩니다.
11. **confusion** — OK.
12. **BP** — 고칠 것(심각). `Your BP is hypotensive`는 영어로 틀렸습니다. 혈압이 아니라 사람이 hypotensive입니다.
    - XX 안: `Your BP's soft, so I'm titrating the fentanyl.` (`soft`는 혈압이 낮다는 의료진 은어라, 환자에게 풀이 없이 쓰면 어색함이 분명합니다)
    - fix: 그대로
    - why: "soft(혈압이 낮다는 의료진 은어)·titrate는 의료진 말이에요. 환자에게는 'blood pressure is low', 'small amounts'로 풀어서 말해요."
