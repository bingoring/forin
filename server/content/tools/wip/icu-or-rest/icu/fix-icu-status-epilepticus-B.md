# icu-status-epilepticus — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-status-epilepticus.yaml`(A·B 합친 파일), 21상황 · 105문장 · order 21장. 스크립트 `rv_icu-status-epilepticus_B.py`로 문장 전수를 뽑았습니다(`en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy를 청크 자리마다 넣은 조립, order 인접 교환 63건). 출력은 `rvdump_icu-status-epilepticus_B.txt`에 있습니다. 되풀이 상한은 `repeat_icu-status-epilepticus_B.py`로 조사를 뗀 낱말과 어간 두 방식으로 셌습니다. 새 값의 길이와 상한은 `chk_icu-status-epilepticus_B.py`로, 새 빈칸 선택지는 `blank_icu-status-epilepticus_B.py`로 다시 확인했습니다.

안전 판정 기준(부르는 쪽 지시): 오답이 정답 행동의 **앞·뒤 단계면 통과**하고, 그 순간 정답 행동 **대신** 하는 일이면 실패입니다. 확인·감시 대상만 다른 지표로 바꾼 것, 판단 기준·호출 대상·시점을 바꾼 것, 처치를 확인·설명·질문·기록으로 바꾼 것, 입에 무언가 넣는 것, 정답에 말을 덧붙인 것은 실패로 봤습니다.
가르는 기준: 문장이 **지금 하는 처치나 지시**(팀에게 하는 말, 간호사가 하겠다는 말)면 위 기준을 그대로 적용했습니다. 가족에게 하는 **설명**과 **소견 보고**에서 지표 이름만 바뀐 것은 통과로 두고 아래 "경계"에 적었습니다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 105개 모두 사실 오류는 없습니다. 대부분 어순·틀의 이유를 말합니다. 9문장은 둘째 문장이 `ko`를 되풀이하는 뜻풀이입니다(아래 E). |
| 2 빈칸 | **2** | **60문장의 오답이 장면과 동떨어진 말이거나 문법으로 걸러집니다.** 동떨어진 말의 예는 `wallet/passport/keys`, `paint/sell/wrap`, `visiting/billing/parking`, `loud/tall/early`, `pregnancy/hunger/laughter`입니다. 문법으로 걸러지는 곳은 6곳입니다(0.4 `how long it starts`, 4.0 `a annual`, 8.1 `is cheap to stopping`, 8.3 `A walking`, 15.2 `I'll refill to`, 20.3 `this is cold to hear`). 정답이 둘인 곳은 3곳입니다(1.1 `mattress`, 12.3 `recent`, 19.4 `hourly`). 같은 오답 묶음도 여러 문장에 되풀이됩니다(hunger·laughter 3회, parking 3회, billing 3회, printed·framed 2회, label·store 3회, spare 3회, loud 3회). |
| 3 decoy | 3 | 대부분 장소·물건 꼬리라서 모양만 보고도 걸러집니다. 고칠 곳은 6곳입니다. 처치를 기록으로 바꾸는 조립이 1곳(2.1), 빠뜨린 확인이 1곳(6.1), `ko`와 거의 같은 문장이 되는 곳이 2곳(6.2·10.1), 호출 대상을 바꾸는 곳이 1곳(12.2), 장면에 맞아 정답처럼 읽히는 곳이 1곳(17.2)입니다. |
| 4 distractorsKo | **2** | 설명 문장(S0·S5·S7·S8·S12·S14·S20)은 대체로 좋습니다. **처치·감시 문장 50곳(79값)을 고칩니다.** 그중 안전(⑥) 실패가 35문장입니다. 감시·확인 대상을 다른 지표로 바꾸거나(6.4·11.1·13.1·18.1·15.1·16.1), 처치를 확인·의논·설명으로 바꾼 것(1.0·1.4·9.3·12.2·15.2·15.4·16.0·16.4·18.4)입니다. 정답이 둘인 곳은 13문장입니다(`가까이서` = closely가 3곳). 되풀이 상한은 통과합니다(최대 5회). |
| 5 order | 3 | 인접한 두 줄을 바꿔도 자연스러운 카드가 8장입니다(S0 3↔4, S1 2↔3, S3 3↔4, S4 2↔3, S6 1↔2, S9 3↔4, S13 2↔3, S14 3↔4). 논리나 영어가 어색한 줄은 2장에 있습니다(S7 L2 `That's why continuous EEG lets us catch it`, S17 L3 `That bagging is why you call for help`). S20 L4는 15단어로 상한에 닿습니다. 임상 순서는 모두 맞습니다(기도 확보 → 마취약 주입, 투여 전 용량 확인, ICP: 머리 올리기 → 재검 → 보고). |
| 6 tag·icon | 4 | 10자 이하이고 상황 안에서 일관됩니다. 13.0 `흡인 처치`의 아이콘이 `scalpel`(메스)이라 뜻과 맞지 않습니다. |
| 8 파일럿 갈래 | **2** | 갈래 2(동떨어진 빈칸 오답)가 60문장에 있습니다. "오답으로 위험한 처치를 보이기"는 응급 상황(S15~S19)에 몰려 있습니다(17.0 입 안 석션·닦기, 15.0 기도를 주입 뒤에 봄). 관사로 걸러지는 오답이 2곳(4.0, 8.3)입니다. order 임상 순서는 맞습니다. |

## 사실 오류·심각한 문제
1. **빈칸 60문장의 오답이 시험 구실을 못 합니다.** 읽기만 해도 걸러지는 엉뚱한 말이고, 같은 묶음을 돌려쓰거나 문법으로 걸러집니다. 아래 B 표에 문장마다 같은 분야에서 틀린 새 선택지를 적었습니다.
2. **17.0 응급 지시 오답 둘이 모두 "입에 넣는" 행동입니다.** 정답은 심한 저산소·서맥에서 기도를 열고 백으로 환기하라는 지시입니다. 그런데 X1 `입 안을 지금 석션하세요`와 X2 `입 안 분비물을 지금 닦으세요`는 환기 대신 하는 일이고, 발작 중에 입에 무언가를 넣습니다. → 백 환기의 앞·뒤 단계로 바꿉니다(마스크 밀착, 가슴 올라옴).
3. **15.0 X2 `지속주입을 시작한 뒤 기도를 봐요`는 순서가 거꾸로입니다.** 마취약 주입 전에 기도를 확보해야 합니다(같은 상황 15.3·order L2). 그대로 따르면 기도를 확보하지 않은 채 주입하게 됩니다.
4. **감시·부작용 목록 문장(저자가 물은 6.4·11.1·18.1)은 모두 실패입니다.** 6.4는 로딩 중 저혈압을 어지러움으로 바꿨고(X2는 두 항목 다 바꿈), 11.1은 리듬 변화를 의식·통증으로, 18.1은 ICP 위기에서 신경학적 재검을 호흡·피부 검진으로 바꿨습니다. 인접 항목이라도 핵심 감시 항목이 빠지므로 ⑥ 실패입니다. → 감시 대상은 두고, 이상이 보이면 알리는 뒤 단계, 알람 설정, 주어 바꾸기로 새로 씁니다.
5. **저자가 물은 "처치를 확인·설명·질문으로 바꾼 오답" 17문장의 판정은 다음과 같습니다.**
   - 실패(⑥): 4.2, 4.3, 6.0(①③ 실패), 9.1, 9.3, 12.2, 15.0, 15.2, 15.4, 16.0, 16.4, 17.0, 17.2 X2, 18.4, 19.0, 19.4
   - 통과: 17.1 X1·X2(흡인·산소 장비 준비는 삽관 준비 SOAP-ME의 앞 단계). 단 X1의 `흡인`은 중의어라 `석션`으로 바꿉니다.
   - 17.2 X1 `소생술 장비를 옮길 준비`는 크래시 카트를 가져오는 앞 단계라서 통과입니다.
   - 4.3(혈당 결과를 나트륨·칼슘으로 바꿈)은 소견 보고지만, 바로 뒤에 `so we're treating it now`가 붙어 있습니다. 바뀐 지표가 처치로 이어지므로 실패로 봤습니다.
6. **`가까이서`가 정답 둘입니다(2.2·3.0·5.2 X1).** `closely`의 흔한 번역이고, 이 파일의 S0 order L2 ko도 `closely`를 `가까이서`로 옮겼습니다.
7. **decoy 2.1 `and sign`:** 조립하면 `Let's confirm the dose and sign now.`가 됩니다. 투여 대신 서명하는 문장이 되고 맞는 영어입니다.

## 고칠 것

### A. distractorsKo — 50문장 79값 (안전 ⑥ 35문장 · 정답 둘 ④ 13문장 · 틀·들림·반대말 ①③⑤ 등)
새 값은 모두 길이(1.25배 또는 3자 이내)와 되풀이 상한(5회 이하)을 스크립트로 다시 확인했습니다. "앞 단계"(`~하기 전에`)는 5회로 묶었습니다. 그보다 많으면 `전에`가 오답 표시가 됩니다.
- **1.0** `I'm turning him on his side and protecting his head.` — 정답 `옆으로 돌려서 머리를 보호하고 있어요.`
  - X1 `옆으로 돌려서 침구를 정리하고 있어요.` · ⑥ 머리 보호 대신 침구 정리 → **`옆으로 돌려서 침이 흘러나오게 하고 있어요`**
  - X2 `옆으로 돌려서 숨소리를 듣고 있어요.` · ⑥ 머리 보호를 숨소리 듣기(확인)로 바꿈 → **`옆으로 돌려서 시계로 시간을 재고 있어요`**
- **1.1** `We keep the area clear and never put anything in his mouth.` — 정답 `주변을 치우고, 입 안에는 절대 아무것도 넣지 않아요.`
  - X1 `주변을 조용히 하고, 입 안에는 절대 아무것도 넣지 않아요.` · ⑥ 위험물 치우기를 '조용히'로 바꿈 — 치우기가 빠짐 → **`머리 밑에 베개를 대고, 입 안에는 절대 아무것도 넣지 않아요`**
  - X2 `주변을 살피고, 입 안에는 절대 아무것도 넣지 않아요.` · ⑥ 치우기를 살피기(확인)로 바꿈 → **`난간에 패드를 대고, 입 안에는 절대 아무것도 넣지 않아요`**
- **1.4** `I'll keep the airway open and never force anything between his teeth.` — 정답 `기도를 열어두고, 이 사이에 절대 억지로 아무것도 넣지 않을게요.`
  - X1 `기도를 살펴보고, 이 사이에 절대 억지로 아무것도 넣지 않을게요.` · ⑥ 기도 열어두기를 살펴보기(확인)로 바꿈 → **`옆으로 눕혀 두고, 이 사이에 절대 억지로 아무것도 넣지 않을게요`**
- **2.1** `Let's confirm the dose and give it now.` — 정답 `용량을 확인하고 지금 투여하죠.`
  - X1 `라벨을 확인하고 지금 투여하죠.` · ⑥ 확인 대상 용량→라벨 → **`용량을 확인하기 전에 환자 밴드를 보죠`**
- **2.2** `I'll watch his breathing closely after we give it.` — 정답 `투여 후에 호흡을 자세히 지켜볼게요.`
  - X1 `투여 후에 호흡을 가까이서 지켜볼게요.` · ④ 가까이서 = closely의 다른 번역(S0 order 줄 ko도 '가까이서') → **`투여 후에 호흡을 밤새 지켜볼게요`**
- **2.3** `Confirming weight and dose before we push it.` — 정답 `주입하기 전에 체중과 용량을 확인 중이에요.`
  - X1 `주입하기 전에 체중과 라벨을 확인 중이에요.` · ⑥ 확인 대상 용량→라벨 → **`희석하기 전에 체중과 용량을 확인 중이에요`**
  - X2 `주입하기 전에 키와 용량을 확인 중이에요.` · ⑥ 확인 대상 체중→키 → **`주입하기 전에 체중과 용량을 같이 확인해 주세요`**
- **3.0** `I'm applying oxygen and watching his saturation closely.` — 정답 `산소를 적용하고 포화도를 자세히 지켜보고 있어요.`
  - X1 `산소를 적용하고 포화도를 가까이서 지켜보고 있어요.` · ④ 가까이서 = closely → **`산소를 적용하고 포화도를 모니터로 지켜보고 있어요`**
- **4.2** `If we find a cause, we correct it immediately.` — 정답 `원인을 찾으면 바로 교정할게요.`
  - X1 `원인을 찾으면 바로 팀에 알릴게요.` · ⑥ 교정 대신 팀에 알림(처치→보고) → **`원인을 찾으면 바로 처방을 받을게요`**
  - X2 `원인을 찾으면 바로 약사께 알릴게요.` · ⑥ 교정 대신 약사께 알림 → **`원인을 찾으면 바로 교정 약을 꺼낼게요`**
- **4.3** `His glucose came back low, so we're treating it now.` — 정답 `혈당 결과가 낮게 나와서 지금 치료하고 있어요.`
  - X1 `나트륨 결과가 낮게 나와서 지금 치료하고 있어요.` · ⑥ 판단 기준 혈당→나트륨(다른 교정으로 이어짐) → **`혈당 결과가 낮게 나와서 지금 포도당을 준비하고 있어요`**
  - X2 `칼슘 결과가 낮게 나와서 지금 치료하고 있어요.` · ⑥ 판단 기준 혈당→칼슘 → **`혈당 결과가 낮게 나와서 치료 뒤 다시 확인할 거예요`**
- **5.2** `I'll watch closely for any sign of another seizure.` — 정답 `또 다른 발작의 징후가 있는지 자세히 지켜볼게요.`
  - X1 `또 다른 발작의 징후가 있는지 가까이서 지켜볼게요.` · ④ 가까이서 = closely → **`또 다른 발작의 징후가 있는지 밤새 지켜볼게요`**
- **5.4** `You didn't do anything wrong; watching for another seizure is my job now.` — 정답 `잘못하신 거 하나도 없어요. 다음 발작을 지켜보는 건 이제 제 역할이에요.`
  - X1 `놀라신 거 당연해요. 다음 발작을 지켜보는 건 이제 제 역할이에요.` · ① 앞 절 전체를 바꿈(놀라신 거 당연해요) → **`잘못하신 거 하나도 없어요. 다음 발작을 지켜보는 건 이제 저희 팀 역할이에요`**
- **6.0** `Yes, we're loading a second anti-seizure drug like levetiracetam.` — 정답 `네, 레비티라세탐 같은 2차 항경련제를 로딩하고 있어요.`
  - X1 `네, 레비티라세탐 같은 2차 항경련제를 로딩한 뒤 보고 있어요.` · ①③ 시제만 바꿈(로딩한 뒤 보고) — 영어에 'watching' 없음 → **`네, 레비티라세탐 같은 2차 항경련제를 준비하고 있어요`**
- **6.1** `Let's confirm the weight-based dose and infusion rate.` — 정답 `체중에 따른 용량과 주입 속도를 확인하죠.`
  - X1 `체중에 따른 용량과 주입 속도를 확인하고 시작하죠.` · ④ 정답+'시작하죠'(정답에 덧붙임) → **`체중에 따른 용량과 주입 펌프를 확인하죠`**
- **6.2** `I'll monitor his rhythm and pressure during the load.` — 정답 `로딩하는 동안 심장리듬과 혈압을 감시할게요.`
  - X2 `로딩한 뒤에 심장리듬과 혈압을 재 둘게요.` · ⑥ 감시 시점 during→after(로딩 중 감시 공백) → **`로딩하는 동안 심장리듬과 혈압을 같이 봐 주세요`**
- **6.4** `I'm watching for sedation or low pressure as we give the load.` — 정답 `로딩하는 동안 진정이나 저혈압이 있는지 지켜보고 있어요.`
  - X1 `로딩하는 동안 진정이나 어지러움이 있는지 지켜보고 있어요.` · ⑥ 감시 대상 저혈압→어지러움 → **`로딩하는 동안 진정이나 저혈압이 오면 바로 알릴게요`**
  - X2 `로딩하는 동안 두통이나 구역이 있는지 지켜보고 있어요.` · ⑥ 감시 대상 둘 다 바꿈(두통·구역) → **`로딩하는 동안 진정이나 저혈압에 맞춰 알람을 켜 둘게요`**
- **7.3** `We put EEG leads on his scalp to watch his brain waves.` — 정답 `뇌파를 지켜보려고 두피에 EEG 선을 붙이는 거예요.`
  - X1 `심장을 지켜보려고 가슴에 심전도 선을 붙이는 거예요.` · ① 세 군데(심장·가슴·심전도)를 바꿈 → **`발작 약을 조절하려고 두피에 EEG 선을 붙이는 거예요`**
- **7.4** `Even if his body looks still, the monitor tells us if his brain is still seizing.` — 정답 `몸이 가만히 있어 보여도, 모니터가 뇌에서 아직 발작 중인지 알려줘요.`
  - X1 `몸이 힘들어 보여도, 모니터가 뇌에서 아직 쉬는 중인지 알려줘요.` · ①⑤ seizing↔쉬는(반대말) → **`몸이 떨려 보여도, 모니터가 뇌에서 아직 발작 중인지 알려줘요`**
  - X2 `몸이 가만히 있어 보여도, 모니터가 뇌에서 아직 잠든 중인지 알려줘요.` · 문법 '잠든 중인지' + ⑤ 반대말 → **`몸이 가만히 있어 보여도, 모니터가 뇌에서 아직 발작 중인지 기록해요`**
- **8.2** `I'll send cultures and labs and treat what we find.` — 정답 `배양검사와 검사를 보내고, 나온 결과를 치료할게요.`
  - X2 `배양검사와 영상을 보내고, 나온 결과를 치료할게요.` · ⑥ 검사를 영상으로 바꿈 → **`배양검사와 검사를 보내기 전에, 라벨을 한 번 더 볼게요`**
- **9.1** `After benzos and the second agent, we consider infusions.` — 정답 `벤조와 2차 약제 다음에는 지속주입을 고려해요.`
  - X1 `벤조와 2차 약제 다음에는 지속주입을 안내해요.` · ⑥ 고려(처치 판단)→안내(설명) → **`벤조와 2차 약제 다음에는 지속주입 펌프를 챙겨요`**
  - X2 `벤조와 2차 약제 다음에는 이송을 고려해요.` · ⑥ 처치 단계를 이송으로 바꿈 → **`벤조와 2차 약제 다음에는 지속주입 용량을 계산해요`**
- **9.3** `If he seizes again, we move to the next step right away.` — 정답 `또 발작하면 바로 다음 단계로 넘어가요.`
  - X1 `또 발작하면 바로 다음 단계를 보여 드려요.` · ⑥ 다음 단계로 넘어가기→보여 드리기(설명) → **`또 발작하면 바로 옆으로 돌리고 기도를 지켜요`**
  - X2 `또 발작하면 바로 팀과 다음 단계를 의논해요.` · ⑥ 바로 넘어가기→팀과 의논(지연) → **`또 발작하면 바로 담당의를 불러요`**
- **10.2** `If he deteriorates further, we'll secure the airway.` — 정답 `더 악화되면 기도를 확보할게요.`
  - X1 `더 악화되면 병상을 확보할게요.` · ⑥ 기도 확보 대신 병상 확보 → **`더 악화되면 마취과를 바로 부를게요`**
  - X2 `더 악화되면 연락처를 확보할게요.` · ⑥ 기도 확보 대신 연락처 확보 → **`더 악화되면 삽관 장비부터 열게요`**
- **11.0** `Let's check his drug levels to confirm they're therapeutic.` — 정답 `약물 혈중농도를 확인해서 치료 범위인지 봐요.`
  - X1 `약물 혈중농도를 채혈해서 치료 범위인지 봐요.` · ④ 채혈해서 ≈ 확인해서(같은 행동) → **`약물 혈중농도를 확인해서 다음 투여 시각을 정해요`**
- **11.1** `I'm watching for sedation, low pressure, and rhythm changes.` — 정답 `진정, 저혈압, 리듬 변화를 지켜보고 있어요.`
  - X1 `진정, 저혈압, 의식 변화를 지켜보고 있어요.` · ⑥ 감시 대상 리듬→의식 → **`진정, 저혈압, 리듬 변화가 오면 담당의를 부를게요`**
  - X2 `진정, 저혈압, 통증 변화를 지켜보고 있어요.` · ⑥ 감시 대상 리듬→통증 → **`진정, 저혈압, 리듬 변화를 같이 지켜봐 주세요`**
- **11.2** `We'll adjust the dose based on levels and his response.` — 정답 `수치와 반응에 따라 용량을 조정할게요.`
  - X1 `수치와 반응에 따라 식사를 조정할게요.` · ⑥ 용량 조정 대신 식사 조정 → **`수치와 반응에 따라 다음 채혈 시각을 정할게요`**
  - X2 `수치와 반응에 따라 침대를 조정할게요.` · ⑥ 용량 조정 대신 침대 조정 → **`수치와 반응에 따라 감시 간격을 조정할게요`**
- **11.3** `His level came back within the therapeutic range.` — 정답 `수치가 치료 범위 안으로 나왔어요.`
  - X2 `체중이 치료 범위 안으로 나왔어요.` · ④③ '체중이 치료 범위'는 듣지 않고도 걸러짐 → **`수치가 치료 범위 안으로 곧 나올 거예요`**
- **12.2** `I'll flag this to the neuro team right away.` — 정답 `바로 신경과 팀에 알릴게요.`
  - X1 `바로 신경과 팀에 물어볼게요.` · ⑥ 보고→질문 → **`바로 신경과 팀에 EEG를 보내요`**
  - X2 `바로 신경과 팀에 상의할게요.` · ④ 상의 ≈ 알림(flag) → **`바로 신경과 팀 번호부터 찾을게요`**
- **12.4** `I'm getting the EEG ordered right now.` — 정답 `지금 바로 EEG를 처방받고 있어요.`
  - X1 `지금 바로 EEG 장비를 처방받고 있어요.` · ④ EEG 장비를 처방받기 ≈ EEG 처방 → **`지금 바로 EEG를 예약하고 있어요`**
- **13.0** `Let's suction gently and check his airway and mouth.` — 정답 `살살 석션하고 기도와 입 안을 확인하죠.`
  - X1 `살살 석션하고 코와 입 안을 확인하죠.` · ⑥ 확인 부위 기도→코 → **`살살 석션하고 고개를 옆으로 돌려 두죠`**
  - X2 `살살 석션하고 기도와 입술을 확인하죠.` · ⑥ 확인 부위 입 안→입술 → **`살살 석션하고 산소 마스크를 씌워 두죠`**
- **13.1** `I'm watching for signs of aspiration like low oxygen or fever.` — 정답 `저산소나 발열 같은 흡인 징후를 지켜보고 있어요.`
  - X1 `저혈압이나 발열 같은 흡인 징후를 지켜보고 있어요.` · ⑥ 감시 지표 저산소→저혈압 → **`저산소나 발열 같은 흡인 징후가 보이면 바로 알릴게요`**
  - X2 `저산소나 발진 같은 흡인 징후를 지켜보고 있어요.` · ⑥ 감시 지표 발열→발진 → **`저산소나 발열 같은 흡인을 막으려고 머리를 올려 두죠`**
- **13.2** `We'll assess for any injuries from the seizure.` — 정답 `발작으로 인한 손상이 있는지 평가할게요.`
  - X1 `발작으로 인한 통증이 있는지 평가할게요.` · ⑥ 평가 대상 손상→통증 → **`발작으로 인한 손상이 보이면 의사에게 알릴게요`**
  - X2 `발작으로 인한 두통이 있는지 평가할게요.` · ⑥ 평가 대상 손상→두통 → **`발작으로 인한 손상을 막으려고 베개를 대 둘게요`**
- **13.3** `Let's check his tongue for any bite marks.` — 정답 `혀에 물린 자국이 있는지 확인하죠.`
  - X1 `혀에 하얀 반점이 있는지 확인하죠.` · ⑥ 확인 대상 물린 자국→하얀 반점 → **`혀에 물린 자국이 있으면 의사께 보이죠`**
  - X2 `입술에 물린 자국이 있는지 확인하죠.` · ⑥ 확인 부위 혀→입술 → **`혀에 물린 자국이 있으면 차트에 적죠`**
- **14.0** `We're identifying the cause, whether it's a stroke or a mass.` — 정답 `원인을 파악하고 있어요, 뇌졸중이든 종양이든요.`
  - X2 `원인을 파악하고 있어요, 뇌출혈이든 종양이든요.` · ④ 뇌출혈은 뇌졸중의 한 종류 → **`원인을 파악하고 있어요, 외상이든 종양이든요`**
- **14.2** `The neuro team will guide the next steps with us.` — 정답 `신경과 팀이 저희와 함께 다음 단계를 이끌어줄 거예요.`
  - X2 `신경과 팀이 저희와 함께 다음 단계를 안내해줄 거예요.` · ④ 안내해줄 ≈ guide(이끌어줄) → **`신경과 팀이 가족분과 함께 다음 단계를 이끌어줄 거예요`**
- **14.4** `Once we know the cause, we'll explain the treatment plan together.` — 정답 `원인을 알게 되면 치료 계획을 함께 설명해드릴게요.`
  - X2 `원인을 알게 되면 치료 계획을 따로 설명해드릴게요.` · ⑤ together↔따로(반대말) → **`원인을 알게 되면 검사 계획을 함께 설명해드릴게요`**
- **15.0** `Yes, we're starting a continuous midazolam or propofol infusion.` — 정답 `네, 미다졸람이나 프로포폴 지속주입을 시작하고 있어요.`
  - X1 `네, 미다졸람이나 프로포폴 지속주입을 시작한 뒤 지켜봐요.` · ④① 정답+'지켜봐요', 시제만 바꿈 → **`네, 미다졸람이나 프로포폴 지속주입 펌프를 연결하고 있어요`**
  - X2 `네, 미다졸람이나 프로포폴 지속주입을 시작한 뒤 기도를 봐요.` · ⑥ 기도를 주입 '뒤에' 봄 — 15.3과 반대 순서 → **`네, 미다졸람이나 프로포폴 지속주입 라인을 따로 잡고 있어요`**
- **15.1** `This requires the airway secured and close hemodynamic monitoring.` — 정답 `이건 기도확보와 밀착 혈역학 감시가 필요해요.`
  - X1 `이건 기도확보와 밀착 호흡 감시가 필요해요.` · ⑥ 필요한 감시 혈역학→호흡(저혈압 감시 빠짐) → **`이건 기도확보와 밀착 혈역학 감시를 보호자께 먼저 알려요`**
  - X2 `이건 기도확보와 밀착 신경 감시가 필요해요.` · ⑥ 혈역학→신경 감시 → **`이건 기도확보를 위해 마취과 팀이 먼저 와야 해요`**
- **15.2** `I'll titrate to seizure control on EEG.` — 정답 `EEG상 발작 조절이 될 때까지 적정할게요.`
  - X1 `EEG상 발작 조절이 될 때까지 지켜볼게요.` · ⑥ 적정→지켜보기(감시) → **`EEG상 발작이 조절되면 그 용량을 유지할게요`**
  - X2 `EEG상 발작 조절이 될 때까지 의논할게요.` · ⑥ 적정→의논 → **`EEG상 발작 조절이 되면 그때 혈압을 다시 볼게요`**
- **15.4** `I'm titrating the dose until the EEG shows seizure control.` — 정답 `EEG에서 발작이 조절될 때까지 용량을 적정하고 있어요.`
  - X1 `EEG에서 발작이 조절될 때까지 용량을 지켜보고 있어요.` · ⑥ 적정→용량 지켜보기 → **`EEG에서 발작이 조절되면 그 용량을 그대로 둘 거예요`**
  - X2 `EEG에서 발작이 조절될 때까지 용량을 보여 드리고 있어요.` · ⑥ 적정→보여 드리기(설명) → **`EEG에서 발작이 조절되면 신경과에 용량을 알려요`**
- **16.0** `We add another agent and target burst suppression on EEG.` — 정답 `약제를 하나 더 추가하고 EEG상 burst suppression을 목표로 해요.`
  - X1 `약제를 하나 더 추가하고 EEG상 burst suppression을 지켜봐요.` · ⑥ 목표(target)→지켜보기 → **`약제 라인을 하나 더 잡고 EEG상 burst suppression을 목표로 해요`**
  - X2 `약제를 하나 더 추가하고 신경과와 burst suppression을 목표로 해요.` · ④③ 정답+'신경과와'(덧붙임, 영어에 없음) → **`약제를 하나 더 추가하고 EEG 전극이 두피에 잘 붙었는지 봐요`**
- **16.1** `Let's keep his pressure supported as we deepen the infusion.` — 정답 `주입을 깊게 하는 동안 혈압을 지지해 둡시다.`
  - X1 `주입을 깊게 하는 동안 호흡을 지지해 둡시다.` · ⑥ 혈압 지지→호흡 지지(저혈압 대응 빠짐) → **`주입을 깊게 하는 동안 혈압 알람을 좁혀 둡시다`**
  - X2 `주입을 깊게 하는 동안 온도를 지지해 둡시다.` · ⑥ 혈압 지지→온도 지지 → **`주입을 깊게 하는 동안 승압제를 바로 쓸 수 있게 둡시다`**
- **16.4** `We'll add a third agent if burst suppression isn't reached.` — 정답 `burst suppression에 도달하지 못하면 3번째 약제를 추가할게요.`
  - X1 `burst suppression에 도달하지 못하면 3번째 약제를 의논할게요.` · ⑥ 추가→의논(지연) → **`burst suppression에 도달하지 못하면 3번째 약제 처방을 받을게요`**
- **17.0** `Open the airway and bag him with high-flow oxygen now.` — 정답 `기도를 열고 고유량 산소로 지금 백을 짜세요.`
  - X1 `기도를 열고 입 안을 지금 석션하세요.` · ⑥ 저산소·서맥에 백 환기 대신 입 안 석션(입에 넣음) → **`백을 짜기 전에 마스크가 얼굴에 꼭 맞는지 보세요`**
  - X2 `기도를 열고 입 안 분비물을 지금 닦으세요.` · ⑥ 발작 중 입 안 닦기(입에 넣음) → **`백을 짜는 동안 가슴이 올라오는지 지켜보세요`**
- **17.1** `Call for help and prepare for intubation.` — 정답 `도움을 요청하고 삽관을 준비하세요.`
  - X1 `도움을 요청하고 흡인을 준비하세요.` · ③ '흡인'은 aspiration과 suction 둘 다 — 석션으로 → **`도움을 요청하고 석션을 준비하세요`**
- **17.2** `Watch the heart rate and be ready to escalate resuscitation.` — 정답 `심박수를 지켜보고 소생술을 확대할 준비를 하세요.`
  - X2 `심박수를 지켜보고 소생술을 확대할 방을 준비하세요.` · ⑥ 소생술 대비 대신 '방' 준비(곁을 떠남) → **`심박수를 지켜보고 제세동기 패드를 붙일 준비를 하세요`**
- **18.1** `I'm elevating his head and rechecking his neuro exam.` — 정답 `머리를 올리고 신경학적 검진을 다시 확인하고 있어요.`
  - X1 `머리를 올리고 호흡 검진을 다시 확인하고 있어요.` · ⑥ 재검 대상 신경학적→호흡 검진 → **`머리를 올리고 신경학적 검진 변화를 바로 알리고 있어요`**
  - X2 `머리를 올리고 피부 검진을 다시 확인하고 있어요.` · ⑥ 재검 대상 신경학적→피부 검진 → **`머리를 올리면서 목이 꺾이지 않게 받치고 있어요`**
- **18.2** `Let's get imaging and consider osmotic therapy.` — 정답 `영상 검사를 받고 삼투 치료를 고려하죠.`
  - X1 `영상 검사를 받고 삼투 치료를 의논하죠.` · ④ 의논 ≈ 고려(consider) → **`영상 검사를 받고 삼투 치료 약을 준비하죠`**
  - X2 `영상 검사를 받고 삼투 치료를 안내하죠.` · ⑥ 고려→안내(설명) → **`영상 검사를 받으러 갈 때 모니터를 챙기죠`**
- **18.4** `I'm reporting this to the neuro team right away.` — 정답 `바로 신경과 팀에 보고하고 있어요.`
  - X1 `바로 신경과 팀에 메시지를 남기고 있어요.` · ⑥ 즉시 보고→메시지 남기기(비동기, 지연) → **`바로 신경과 팀 번호를 찾고 있어요`**
  - X2 `바로 신경과 팀에 질문하고 있어요.` · ⑥ 보고→질문 → **`신경과 팀에 보고한 뒤 다시 검진할게요`**
- **19.0** `Start a pressor and give fluid to support his pressure.` — 정답 `승압제를 시작하고 수액을 줘서 혈압을 지지하세요.`
  - X1 `승압제를 시작하고 수액을 줘서 호흡을 지지하세요.` · ⑥ 지지 목표 혈압→호흡(승압제 적정 기준이 바뀜) → **`승압제를 시작하기 전에 라인이 잘 들어가는지 보세요`**
  - X2 `승압제를 시작하고 수액을 줘서 온도를 지지하세요.` · ⑥ 지지 목표 혈압→온도 → **`수액이 들어가는 동안 승압제 펌프와 라인을 챙기세요`**
- **19.2** `Let's reassess the infusion rate with the team.` — 정답 `팀과 함께 주입 속도를 다시 평가하죠.`
  - X1 `보호자와 함께 주입 속도를 다시 평가하죠.` · ⑥ 결정 상대 팀→보호자(팀 빠짐) → **`팀과 함께 주입 펌프 설정을 다시 보죠`**
- **19.4** `We're giving fluid now to support him while we keep treating the seizure.` — 정답 `발작 치료를 계속하는 동안 지금 수액을 줘서 지지하고 있어요.`
  - X1 `발작 치료를 계속하는 동안 지금 산소를 줘서 지지하고 있어요.` · ⑥ 수액→산소(처치 바꿈) → **`발작 치료를 계속하는 동안 지금 수액이 잘 들어가는지 보고 있어요`**
  - X2 `발작 치료를 계속하는 동안 지금 자세를 바꿔서 지지하고 있어요.` · ⑥ 수액→자세 바꾸기(처치 바꿈) → **`발작 치료를 계속하는 동안 지금 수액 라인을 하나 더 잡고 있어요`**

### B. 빈칸 선택지 — 60문장 (정답 뒤 오답 셋)
판정 기준: 넣어 읽었을 때 문법은 맞고, 같은 분야이며, 이 장면에서는 틀려야 합니다. 위험한 지시로 읽히는 말은 넣지 않았습니다(`airway stays closed`, `start a sedative`, `lower his head` 같은 말은 피함). 넷이 서로 다르고 정답이 `en`에 한 번 나오는지, 관사가 맞는지는 `blank_icu-status-epilepticus_B.py`로 확인했습니다.
- 문법으로 걸러지는 곳: 0.4(`how long it starts/ends/stops`)는 빈칸을 `write down`으로 옮깁니다. 15.2(`I'll refill to…`)는 빈칸을 `EEG`로 옮깁니다. 4.0 `a annual`, 8.3 `A walking`, 8.1 `is cheap to stopping`, 20.3 `is cold to hear`는 선택지를 바꿉니다.
- 정답이 둘인 곳: 1.1 `mattress`(침대 위를 치우는 것도 주변을 치우는 일), 12.3 `recent`(차분해 보여도 최근 발작을 배제할 수 없다는 말도 참), 19.4 `hourly`(수액을 시간마다 줘서 지지하는 것도 그럴듯함).

| 문장 | 지금 (정답: 오답들) | 새 오답 셋 |
|---|---|---|
| 0.1 | `duration`: insurance / visitor / dressing | room / diet / cost |
| 0.4 | `lasts`: starts / ends / stops | 빈칸을 `write down`으로 옮김: guess / predict / wonder |
| 1.0 | `head`: chart / name / shift | feet / knees / belly |
| 1.1 | `area`: ceiling / mattress / window | hallway / doorway / counter |
| 1.3 | `pillow`: pencil / basin / folder | tray / clipboard / basin |
| 2.0 | `first-line`: last-minute / over-the-counter / second-hand | second-line / third-line / over-the-counter |
| 2.2 | `closely`: loudly / happily / politely | remotely / weekly / nightly |
| 3.0 | `saturation`: invoice / paperwork / weekend | weight / diet / bowels |
| 3.2 | `suction`: pillow / blanket / curtain | dialysis / feeding / traction |
| 4.0 | `stat`: fasting / dental / annual | fasting / routine / weekly |
| 4.3 | `low`: odd / lost / blue | normal / clotted / pending |
| 5.0 | `drowsy`: thirsty / cheerful / jealous | thirsty / feverish / itchy |
| 5.1 | `checking`: adjusting / ordering / printing | adjusting / ordering / scheduling |
| 5.2 | `sign`: name / copy / cost | cure / dose / label |
| 5.3 | `pain`: school / line / charge | surgery / isolation / charge |
| 6.1 | `weight-based`: room-based / color-based / ward-based | age-based / height-based / time-based |
| 6.2 | `rhythm`: diet / visitors / laundry | diet / visitors / incision |
| 6.3 | `second`: spare / short / loose | first / same / third |
| 6.4 | `sedation`: pregnancy / hunger / laughter | bleeding / constipation / hunger |
| 7.2 | `guide`: paint / sell / wrap | schedule / record / bill |
| 8.0 | `together`: alone / blindly / loudly | alone / separately / weekly |
| 8.1 | `key`: cheap / brief / rare | unrelated / secondary / optional |
| 8.2 | `cultures`: photos / menus / forms | photos / prescriptions / forms |
| 8.3 | `fever`: hunger / laughter / walking | cough / rash / bruise |
| 8.4 | `stop`: bounce / sing / whisper | worsen / recur / spread |
| 9.1 | `infusions`: visits / reports / meals | transfusions / dialysis / antibiotics |
| 9.3 | `again`: early / alone / blind | early / alone / briefly |
| 10.0 | `airway`: wallet / passport / keys | tongue / skin / eyes |
| 10.1 | `intubation`: dialysis / feeding / laundry | dialysis / feeding / biopsy |
| 10.3 | `coughs`: smiles / blinks / laughs | blinks / speaks / sits up |
| 11.1 | `sedation`: hunger / boredom / laughter | bleeding / coughing / sneezing |
| 12.0 | `unresponsiveness`: dissatisfaction / hospitalization / appetite | itching / sneezing / hiccups |
| 12.1 | `activity`: insurance / budget / mood | swelling / blood flow / size |
| 12.3 | `hidden`: daily / recent / final | daily / childhood / final |
| 12.4 | `ordered`: printed / framed / washed | printed / billed / copied |
| 13.0 | `gently`: loudly / noisily / rudely | hourly / blindly / routinely |
| 14.0 | `stroke`: fever / rash / sprain | bruise / rash / sprain |
| 14.1 | `imaging`: visiting / billing / parking | billing / labeling / dressing |
| 14.2 | `guide`: trade / rent / wrap | schedule / bill / copy |
| 14.3 | `tumor`: fever / sprain / rash | blister / cataract / sunburn |
| 15.0 | `continuous`: convenient / spare / signed | one-time / weekly / brief |
| 15.1 | `hemodynamic`: dietary / financial / visiting | dietary / wound / skin |
| 15.2 | `titrate`: refill / label / store | 빈칸을 `EEG`로 옮김: ECG / CT / MRI |
| 16.1 | `supported`: printed / framed / photographed | recorded / displayed / posted |
| 16.2 | `duration`: location / price / color | location / diet / scheduling |
| 16.4 | `third`: spare / central / quiet | first / second / fourth |
| 17.0 | `airway`: chart / folder / window | line / valve / chart |
| 17.1 | `intubation`: discharge / visitation / lunch | discharge / dialysis / surgery |
| 17.2 | `resuscitation`: registration / admission / orientation | dialysis / feeding / rehabilitation |
| 18.0 | `swelling`: smell / taste / memory | tumors / infection / clots |
| 18.2 | `consider`: sign / rename / print | schedule / bill / print |
| 18.3 | `uneven`: dry / red / loud | dry / red / cloudy |
| 19.0 | `pressor`: diet / chart / tour | timer / report / transfer |
| 19.1 | `balance`: count / bill / paint | count / bill / chart |
| 19.4 | `now`: daily / hourly / quietly | daily / weekly / yearly |
| 20.0 | `honest`: loud / tall / early | brief / vague / formal |
| 20.1 | `recovery`: visiting / billing / parking | discharge / surgery / billing |
| 20.2 | `wishes`: bills / meals / parking | medications / labs / diet |
| 20.3 | `hard`: late / cold / loud | easy / nice / great |
| 20.4 | `support`: count / copy / pay | question / judge / record |

남은 45문장은 통과입니다. 예: 3.1 `supply/source/cost`, 4.1 `cure/heal/ease`, 10.2 `stabilizes/recovers/improves`, 11.3 `above/below/beyond`, 17.3 `climbing/jumping`, 19.3 `rose/held/jumped`, 18.4 `billing/dietary/housekeeping`(같은 분야의 틀린 팀). 2.1 `price/brand/shape`는 약을 두고 확인할 만한 말이 모두 정답이 되는 자리라서 그대로 둡니다(경계).

### C. decoy — 6곳
- 2.1 `and sign` · `Let's confirm the dose and sign now.`가 됩니다(투여 대신 서명) → `the visitors`(명사구라 `and give it` 자리에 넣으면 문법이 깨짐)
- 6.1 `the order` · `Let's confirm the order and infusion rate.`가 됩니다. 맞는 문장이지만 체중 기준 용량 확인이 빠집니다 → `with the family`
- 6.2 `on the screen` · `I'll monitor his rhythm and pressure on the screen.`가 됩니다. `ko`와 거의 같습니다 → `in the hallway`
- 10.1 `the cart` · `Let's have the cart and the team ready.`가 됩니다. 삽관 카트로 읽혀 `ko`와 같아집니다 → `the paperwork`
- 12.2 `to the nurse` · `I'll flag this to the nurse right away.`가 됩니다. 호출 대상이 바뀐 맞는 문장입니다 → `in the drawer`
- 17.2 `at the bedside` · `Watch the heart rate at the bedside to escalate resuscitation.`가 됩니다. 장면에 맞아 정답처럼 읽힙니다 → `on the menu`

경계(그대로 둬도 됨): 1.1 `the bed low`, 8.0 `at the bedside`, 14.1 `in the lab`, 14.4 `on paper`, 20.3 `in the chart`. 맞는 영어로 조립되지만 `ko`와 뜻이 분명히 다르고 해가 없습니다.

### D. order — 10장
- **S0** 3↔4가 자연스럽습니다(적어 두겠다 → 그게 팀에 도움). → L4 `That's why I'll write it all down when it ends.`
- **S1** 2↔3이 자연스럽습니다(`Then` 탓). L4 `Because of that`도 논리가 어긋납니다(기도가 열려 있어서 입에 안 넣는 것이 아님). → L2 `While he's on his side, a pillow protects his head.` · L3 `With his head safe, I keep checking that his airway stays open.` · L4 `To keep it open, nothing goes in his mouth.`
- **S3** L3 `So I'm keeping suction ready`는 앞 줄(산소 요구량)과 인과가 없습니다. 3↔4도 읽힙니다. → L3 `With the oxygen on, his saturation is holding steady.` · L4 `Still, I'm keeping suction ready in case he needs it.` (note: 수치 → 장비 순. why도 "…수치를 보고하고, 그래도 석션을 준비해요"로)
- **S4** 2↔3이 자연스럽습니다(검사 → 결과 → 이유 → 치료로도 읽힘). → L3 `Sure enough, one was off — his glucose came back low.`
- **S6** 1↔2가 자연스럽습니다(`First,`가 있는 줄이 1번 자리로 감). → L2 `For that drug, let's first confirm the weight-based dose and rate.`
- **S7** L2 `That's why continuous EEG lets us catch it`은 인과가 어긋납니다. L3 `to do that`과 L4 `what comes of it`은 가리키는 말이 약해서 3↔4가 읽힙니다. → L2 `That's why we use continuous EEG to catch it.` · L3 `For that, we put leads on his scalp to read his brain waves.` · L4 `The neuro team reads those waves to guide his treatment.`
- **S9** 3↔4가 자연스럽습니다. → L2 `He's already had the second agent.` · L3 `So let's have the next medication ready now.` · L4 `If he seizes again, it goes in right away.`
- **S13** 2↔3이 자연스럽습니다(`Next,`·`Along with that`는 어디든 붙음). → L2 `After suctioning, I'm watching for signs of aspiration.` · L3 `While I watch for that, let's check his tongue for bite marks.`
- **S14** 3↔4가 읽힙니다(`Once we know`가 L2 뒤에 바로 붙음). → L4 `Once they've decided, we'll explain the plan together.`
- **S17** L3 `That bagging is why you call for help…`는 영어도 임상 논리도 어색합니다. 도움을 부르는 이유는 백 환기가 아니라 서맥·저산소입니다. → L3 `While you bag, I'll call for help and prepare for intubation.`(ko `백을 짜는 동안 제가 도움을 요청하고 삽관을 준비할게요`)

경계: S20 L4는 15단어로 상한에 닿습니다(→ `With his wishes in mind, the team will explain what recovery might look like.` 14단어). S2 2↔3, S8 2↔3, S11 3↔4, S16 1↔2는 바꾸면 어색해서 통과로 둡니다.

### E. why — 둘째 문장이 `ko`를 되풀이하는 9문장 (말하는 방식의 이유로 바꿈)
- 11.3 → `'came back'으로 결과가 막 나왔음을 알리고, 'within … range'로 판단까지 한 번에 전해 듣는 쪽이 다시 묻지 않게 해요.`
- 14.2 → `'with us'를 끝에 붙여, 다른 팀에 넘기는 게 아니라 함께 간다는 인상을 줘요.`
- 15.1 둘째 문장 → `'requires'로 선택이 아니라 조건임을 분명히 해, 왜 삽관이 먼저인지 받아들이게 해요.`
- 16.2 → `'will guide'로 깊이와 기간은 신경과가 정한다고 말해, 간호사가 답할 수 없는 질문을 정중히 넘겨요.`
- 16.3 둘째 문장 → `'stayed stable'을 앞에 두어 듣는 쪽이 결과부터 듣고 안심하게 해요.`
- 16.4 둘째 문장 → `조건을 'if' 절로 뒤에 두어, 지금 당장 추가하는 게 아니라는 점이 먼저 들려요.`
- 17.3 둘째 문장 → `'while he's still seizing'을 끝에 붙여, 서맥과 발작이 동시에 진행 중이라 둘 다 지금 대응해야 함을 강조해요.`
- 19.3 둘째 문장 → `'right after we deepened'로 의심되는 처치와 시점을 함께 보고해, 팀이 바로 주입을 다시 보게 해요.`
- 20.4 → `'whatever'로 조건을 달지 않고 지지한다고 말해, 가족이 판단받는다는 느낌 없이 말을 꺼내게 해요.`

### F. tag·icon — 1곳
- 13.0 `흡인 처치` icon `scalpel` → `stetho`(석션·기도 확인에 메스는 맞지 않음)

## 경계 (판정만 적고 고치지 않음)
- **소견 보고·가족 설명에서 지표 이름만 바꾼 것(통과):** 2.4, 3.3, 7.2 X1, 12.0, 13.4, 14.2 X1·16.2 X1(마취과 팀), 16.3, 17.3, 18.3, 19.3, 9.0(사다리를 보여·안내해 드려요 — 가족 설명이라 해가 없지만 X1·X2가 같은 종류임), 0.4(기록 대상 몸→눈·소리 — 기록이라 해가 없음), 11.0 X2(`정상 수치`).
- **준비 물건 목록(통과):** 3.2(산소·모니터 장비), 3.4(산소·장갑), 10.1(약물·침대), 17.4(산소·석션). 모두 같은 준비의 일부이고 해가 없습니다.
- **감시를 "이상이 보이면 알림"으로 바꾼 새 값(6.4 X1, 11.1 X1, 13.1 X1, 13.2 X1, 18.1 X1, 9.3 X2 `담당의를 불러요`):** 감시를 멈추는 것이 아니라 감시의 뒤 단계로 봤습니다. 부르는 쪽 기준에서 "보고로 바꾼 것"으로 본다면 이 6값을 다시 써야 합니다.
- 1.2 X1 `몸을 받치고`: 발작 중 붙잡는 것(억제)으로 읽힐 여지가 있어 약한 경계입니다. 바꾼다면 `턱을 들어 주고`로.
- 7.1 빈칸 `mild`: 숨은 발작이 "가벼운" 발작은 아니라서 통과로 봤습니다.

## 되풀이 상한 (스크립트, 오답에만 있고 그 문장 정답 ko에는 없는 낱말)
- **지금 파일:** 조사를 뗀 낱말 기준 최대 5회(침대·산소·보여·호흡)라서 통과합니다. 4회는 가까이서·조용히·재·열·뒤·통증입니다. 어간 기준으로는 의논 4회입니다.
- **고친 뒤(위 A 값을 넣고 다시 셈):** 최대 5회라서 통과합니다(전·산소·펌프·바로·라인·재·열). 어간 표의 `주`(주세요·주러·주는)와 `보`(보세요·보죠·보고)가 5회로 나오는데, 이것은 서로 다른 동사가 어간 자르기에서 겹친 것입니다. 실제 되풀이는 `주세요` 3회, `보세요` 2회입니다.

## 종합
고칠 것은 136건입니다. distractorsKo 50문장(79값), 빈칸 60, decoy 6, order 10, why 9, icon 1입니다. 그중 **안전(⑥)이 37건**입니다(distractorsKo 35문장, decoy 2.1·6.1). **정답 둘은 14건**입니다(안전과 겹치지 않는 distractorsKo 9문장, 빈칸 3, decoy 6.2·10.1). 사실 오류는 없습니다. 빈칸 60문장과 응급 상황(S15~S19) 오답을 고치면 내보내도 됩니다. 고친 뒤 V18·V19를 다시 돌리고 되풀이 상한을 다시 세 주세요.
