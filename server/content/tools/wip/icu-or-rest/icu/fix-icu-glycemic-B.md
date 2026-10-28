# icu-glycemic — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-glycemic.yaml`(A·B 합친 파일), 21상황 · **108문장**(S1 6문장, S2 7문장. 지시의 106은 틀림) · order 21장. 문장 전수를 스크립트로 뽑았습니다(`dump-icu-glycemic-B.txt`: `en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy를 청크 자리마다 넣은 조립, order 4줄과 인접 교환 63건). 되풀이 상한은 두 방식으로 셌습니다: 조사를 뗀 어간(`repeat_/recount_icu-glycemic_B.py`)과 앞 두 글자 묶음(`recount2_icu-glycemic_B.py`, 동사 활용형을 묶으려고). 아래 새 값을 모두 넣고 다시 세면 두 방식 모두 최대 5회이고, 새 값은 1.25배·3자 이내이며 둘 중 하나는 정답 길이 이하입니다(`newko_icu-glycemic_B.py`).

안전 판정 기준(부르는 쪽 지시): 오답이 정답 행동의 **앞·뒤 단계면 통과**, 그 순간 정답 행동 **대신** 하는 일이면 실패. "앞·뒤 단계"는 한국어 틀에 표시가 있을 때만 인정했습니다(`~하기 전에`·`~한 다음`·`~하고 나서`·`~풀리면`). 같은 자리에서 행동을 기록·설명·준비·확인·다른 물건으로 바꾼 오답은 실패로 봤습니다. 다만 브리프가 허용하는 "중요하지 않은 물건으로 바꾼 오답"은 **안내 문장**(0.4·4.0·4.2·7.0·7.2·7.4·9.2 등, 지금 처치하는 순간이 아님)이면 통과로 두고, **그 순간 처치하는 문장**(S6 적정, 9.0 급식 중단)만 실패로 봤습니다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 108개 모두 어순·표현에 이유를 붙였고 사실 오류는 없음. en에 없는 말을 인용한 것 1개(19.2), 과장 2개(0.1, 15.4), 뜻풀이만 한 것 1개(10.4), 장면과 안 맞는 말 1개(1.0). |
| 2 빈칸 | **2** | **108문장 중 81문장의 오답이 장면과 동떨어진 말**입니다(`window/elevator/doorway`, `wall/floor/ceiling`, `cost/fee/bill`, `party/concert/lecture`). 읽기만 해도 걸러집니다. 정답이 둘인 것 3개(1.5 `burn`, 3.0 `cold`, 14.2 `lotion`). 관사·수 일치로 걸러지는 것 2개(18.2 `an table`, 4.1 `visitors changes`). 다른 처치나 준비로 읽혀 위험한 것 3개(15.0 `mix/fill`, 18.1 `oxygen/antacid`, 9.1 `saline`). |
| 3 decoy | **2** | **108개 모두 장소 전치사구**입니다(`at the sink`, `in the lobby`, `near the exit` …). 어느 청크 자리에 넣어도 말이 안 되어 모양만 보고 걸러지므로 시험 구실을 못 합니다. 처치를 늦추는 조립은 없습니다(장소가 우스워서 지연 지시로 읽히지 않음). 하지만 시간 청크(now·right away·immediately) 자리에 들어가는 조립이 10개 있습니다(3.1, 5.4, 15.0, 16.1, 17.0, 17.1, 18.1, 18.4, 20.1, 20.4). |
| 4 distractorsKo | 3 | 설명 문장(S0~S5, S11~S14 대부분)은 한 군데만 바꿨고, 들리는 자리를 바꿨고, 길이도 맞습니다. **처치 문장 9개는 안전 실패**(S6 적정 3문장, 9.0, 3.2, 3.4, 8.2, 8.4, 16.3). **정답 둘 4개**(5.4, 10.0, 15.2, 18.1). 되풀이 상한은 `팀` 9회로 넘었습니다. 위기·처치 문장 22개는 **오답 둘이 모두 조건절(`~하면`·`~한 뒤`)로 시작하고 정답은 그렇지 않아서** 모양만 보고 걸러집니다(아래 6번). "오답 하나는 정답 길이 이하" 규칙도 11문장이 어깁니다. |
| 5 order | 3 | 인접한 두 줄을 바꿔도 읽히는 카드가 8장(S2 2↔3, S4 3↔4, S7 2↔3, S9 3↔4, S10 3↔4, S13 3↔4, S17 1↔2, S20 3↔4는 약함). 15단어가 넘는 줄은 없음. 임상 순서는 맞고, S14 3줄은 표현이 부정확함. |
| 6 tag·icon | 5 | 10자 이하이고 상황 안에서 일관됨. 4.3 `검사 때문에`는 문장이 하는 일(금식 대비 감량)을 말하지 않아서 바꾸기를 권함. 아이콘은 모두 뜻에 맞음. |
| 8 파일럿 갈래 | **2** | 갈래 2(동떨어진 빈칸 오답)가 81문장에 있음. 같은 오답 묶음을 돌려쓴 것도 있음(`vitamins/blankets/gloves` 7.0·7.1, `window/elevator/doorway` 2.1·6.1, `wash/weigh/wrap` 3.2·5.4·8.1). 갈래 3(order가 순서를 못 박음)이 8장. 갈래 5는 decoy가 장소 꼴 하나로만 되어 있어 생기는 문제. 관사로 걸러지는 오답 1개(18.2). order 임상 순서는 맞음. |

## 사실 오류·심각한 문제
1. **S6 적정 문장의 오답이 그 순간 해야 할 처치를 엉뚱한 일로 바꿉니다.** 6.3 `빨리 떨어지고 있으면 지금 조명을/소음을 줄여요`는 혈당이 빨리 떨어질 때 인슐린 속도를 줄이는 대신 조명이나 소음을 줄이라는 말입니다. 6.0 `알람을/자세를 조정해요`, 6.4 `창문을/커튼을 올려요`, 9.0 `발판을/의자를 조정해요`(급식이 멈춘 순간 인슐린 조정 대신, 그리고 세 군데를 바꿈 ①)도 같습니다.
2. **3.2 `의사가/약사가 빨리 조치할게요`(저작자가 물은 것) → 실패.** 이유는 세 가지입니다.
   - ⑥ 저혈당 처치는 간호사가 프로토콜대로 바로 하는 일인데, 조치하는 사람을 의사로 바꾸면 "의사를 기다린다"로 읽혀서 처치가 늦어집니다.
   - "의사가 … 할게요"는 1인칭 약속 어미에 3인칭 주어를 붙인 비문이라서 모양만 보고 걸러집니다.
   - 길이가 1.24배로 한계에 닿았습니다.
3. **빈칸이 다른 처치를 지시하는 말로 읽히는 것 3개.**
   - 15.0 `mix/fill D50 now`: 준비 동작이라 투여를 늦춥니다.
   - 18.1 `Start oxygen/antacid and recheck his sugar`: 저혈당에 다른 처치를 시작하라는 말이 됩니다.
   - 9.1 `start some saline to keep your sugar steady`: 포도당 대신 생리식염수를 다는 실제 오류 유형입니다.
4. **빈칸 정답이 둘인 것 3개.**
   - 14.2 `lotion`: 손에 묻은 로션 같은 오염 물질은 실제로 손끝 혈당을 왜곡합니다.
   - 3.0 `cold, sweaty`: 차고 축축한 피부는 저혈당 징후입니다.
   - 1.5 `burn`: `sting`과 거의 같은 뜻입니다.
5. **distractorsKo가 정답과 같은 뜻인 것 4개.**
   - 10.0 X1 `주사를 놓은 뒤에도 주입은 그대로 두고 상태를 지켜봐요`: 겹치는 시간을 두는 것 자체라서 정답과 같습니다.
   - 15.2 X1 `여전히 낮으면 반복한 뒤 결과를 팀에 남겨요`: 정답 행동에 말을 덧붙였습니다.
   - 18.1 X1 `포도당을 시작한 뒤 혈당이 오르는 추이를 지켜봐요`: 시작하고 재확인한다는 정답과 거의 같습니다.
   - 5.4 X1 `지금 알려둘게요`: flag에는 "알리다"라는 뜻도 있습니다.
6. **"뒤 단계" 문장으로 쓴 distractorsKo(저작자가 물은 것) → ⑥은 통과, 모양이 문제.** 표시가 있는 뒤 단계(`풀리면`·`나면`·`오면`·`끝나면`·`시작하면`)는 그 순간의 처치를 대신하지 않으므로 안전 시험은 통과합니다.
   - **문제는 모양입니다.** 22문장(8.0, 9.1, 12.2, 15.0, 15.1, 15.2, 15.4, 16.0, 16.1, 16.2, 16.4, 17.1, 17.2, 18.0, 18.1, 18.2, 19.4, 20.2, 20.4 등)에서 오답 둘이 모두 조건절이나 "~한 뒤"로 시작하고 정답은 행동으로 시작합니다. 듣지 않고 "조건절로 시작하는 쪽이 오답"으로 걸러지는데, sepsis의 `하셨어요/래요` 어미와 같은 문제입니다.
   - `팀이 오면`이 15.4 X1·X2와 20.4 X1에 되풀이되고, `오면`·`뒤`·`결과`·`차트`는 5회로 상한에 닿았습니다.
   - **판정:** 안전 때문에 지시 부분을 건드릴 수 없는 위기 문장(15.0·15.1·15.4·16.0·16.1·16.2·17.1·17.2·18.0·18.1·20.2·20.4)은 그대로 둡니다. 정답의 앞머리를 지키면서 안전하게 한 군데를 바꿀 수 있는 5문장(8.0, 16.4, 18.2, 19.4, 20.0)은 오답 하나를 정답 틀로 바꿉니다(아래 C).
7. **decoy 108개가 모두 장소 구(저작자가 물은 것) → 실패(구조적).** 브리프는 "같은 자리에 올 수 있는 구"나 "이 문장의 다른 청크를 살짝 바꾼 것"을 요구합니다. 장소 구는 어느 청크도 대신하지 못하고, 넣어도 말이 안 되므로 모양만 보고 걸러집니다(shock-B 검토가 92/126을 같은 이유로 지적함). 아래 G에 문장마다 새 decoy를 적었습니다. 섞은 비율: 같은 자리에 들어가지만 뜻이 다른 해 없는 구(◆, `for your comfort`)가 38개, 그 문장 청크의 문법을 살짝 틀린 꼴(◇, `we aims for`)이 70개입니다. 위기·처치 문장은 같은 자리 구가 시간·약·방향을 바꾸기 쉬워서 ◇로 몰았습니다. 설명 상황(S0~S5, S11~S14, S19~S20)은 ◆를 늘렸습니다. 시간·용량·약·처치 방향을 바꾸는 decoy는 쓰지 않았습니다.
8. **위기 지시문 빈칸 4문장(저작자가 물은 것)**: 자리마다 같은 분야 후보를 넣어 보고 판정했습니다.
   - **15.0** `Stop the insulin and push D50 now — check a stat glucose.` 어느 자리를 비워도 위험하거나 정답이 둘입니다.
     - insulin 자리: heparin/feeding을 넣으면 다른 주입을 멈추는 위험한 말이 됩니다.
     - push 자리: give/administer는 정답이 둘이고, hold는 위험하고, mix/fill/draw up은 투여를 늦춥니다.
     - D50 자리: glucagon은 정답이 둘이고, insulin은 치명적이고, D10은 정답이 둘에 가깝습니다.
     - now/stat 자리: later/routine은 투여를 늦춥니다. glucose 자리: potassium은 확인 대상이 바뀝니다.
     - **판정:** push 자리를 유지하고, 투여로 읽히지 않는 간호 동작어로 채우는 저작자 방침이 맞습니다. 하지만 `mix/fill`은 준비 동작이라 실패이고, `tape`는 통과입니다. → `splint / suction / tape`
   - **15.2** `Recheck in five minutes and repeat if he's still low.`
     - Recheck 자리: chart는 확인을 기록으로 바꿉니다.
     - five 자리: fifteen은 정답이 둘이고, thirty는 늦춥니다.
     - repeat 자리: give는 정답이 둘이고, stop은 위험합니다.
     - still 자리: no longer는 반대 지시가 됩니다. low 자리: high는 위험합니다.
     - **판정:** `rename/relabel/rewrap`은 해가 없는 간호 동작어(relabel/rewrap)이므로 **통과(유지)**합니다.
   - **16.1** `Check his sugar now and start dextrose if he's dropping.`
     - sugar 자리는 확인 대상이 바뀌고, now 자리는 늦추고, start 자리(stop)는 위험하고, dextrose 자리(insulin)는 치명적입니다.
     - 현재 오답 `bleeding/vomiting/coughing`은 같은 분야의 임상 징후입니다. 포도당을 시작하는 조건을 바꾸지만 해로운 처치를 지시하지는 않습니다(포도당 투여는 위험이 낮음). **통과(유지)**. 저작자가 걱정한 "엉뚱한 말"이 아닙니다.
   - **18.1** `Start dextrose and recheck his sugar immediately.`
     - Start 자리(stop)는 위험합니다.
     - dextrose 자리: insulin은 치명적이고, oxygen/antacid는 다른 처치를 지시하는 말로 읽힙니다.
     - recheck 자리: chart는 확인을 기록으로 바꿉니다. immediately 자리: hourly/later는 늦춥니다.
     - **판정:** dextrose 자리를 유지하고, `oxygen/antacid`는 실패, `ice`는 통과입니다. → `splints / slings / ice`

## 고칠 것

### A. distractorsKo — 안전(⑥) 실패 9문장
- 3.2 X1·X2 `의사가/약사가` · 위 2번 → X1 `혈당이 낮은지 빨리 재 볼게요` (앞 단계) · X2 `조치 후 혈당을 또 잴게요` (뒤 단계)
- 3.4 X1 `닦아볼게요`, X2 `만져볼게요` · 같은 자리에서 손끝 채혈을 닦기와 만지기로 바꿔 확인이 빠짐 → X1 `찌르기 전에 손끝을 알코올로 한 번 닦을게요` · X2 `찌르고 나서 거즈로 손끝을 잠깐 눌러 드릴게요`
- 6.0 X1 `알람을`, X2 `자세를` · 적정 대상이 바뀜 → X1 `속도를 조정하기 전에 표에서 맞는 칸을 찾아요` · X2 `조정하고 나서 바꾼 속도를 동료와 같이 봐요`
- 6.3 X1 `조명을`, X2 `소음을` · 위 1번 → X1 `속도를 줄인 뒤에는 15분 후 혈당을 다시 재요` · X2 `빨리 떨어지는지 지난 수치와 비교해요`
- 6.4 X1 `창문을`, X2 `커튼을` · 올리는 적정이 바뀜 → X1 `오르고 있으면 표에 따라 올리기 전에 펌프를 봐요` · X2 `올린 다음 한 시간 후에 다시 재요`
- 8.2 X2 `다음번엔 기다릴게요` · 예방 대신 "다음에는 기다린다"로 처치를 늦춤 → `그다음엔 왜 떨어졌는지 봐서 담당의와 상의할게요`
- 8.4 X2 `물을 권해서 속이 편한지` · 치료 뒤 재확인 대신 물을 권함(확인이 빠짐) → `재확인 값이 정상이면 간식을 권해 또 오지 않게 해요` (교정 뒤 간식은 참인 다음 단계)
- 9.0 X1 `발판을`, X2 `의자를` · 위 1번. 세 군데를 바꿈(①) → X1 `인슐린을 조정하고 나면 급식 재개 시각을 물어봐요` · X2 `급식을 멈추기 전에 인슐린 처방부터 살펴봐요`
- 16.3 X1 `손을 다시 씻어요`, X2 `의자 높이를` · 용량사고 장면에서 투여 전 용량 재확인이 빠짐 → X1 `투여한 다음엔 항상 투여 시각을 적어 둬요` · X2 `투여하고 나서 항상 혈당을 또 재요`

### B. distractorsKo — 정답 둘(④) 4문장
- 5.4 X1 `지금 알려둘게요` · flag ≈ 알리다 → `표시한 다음 주치의에게도 알려 둘게요` (order 4줄과 같은 뒤 단계)
- 10.0 X1 `주입은 그대로 두고 상태를 지켜봐요` · 겹치는 시간을 두는 것 자체라 정답과 같음 → `지속형 주사를 놓은 시각을 기록지에 꼭 적어 둬요`. 주의: `주입을 멈추기 전에 [주사 말고 다른 일]` 꼴은 쓰지 마세요. 기저 인슐린 없이 주입을 멈추는 말이 됩니다.
- 15.2 X1 `여전히 낮으면 반복한 뒤 결과를 팀에 남겨요` · 정답 행동을 그대로 담고 말을 덧붙임 → `5분 후 재확인하고 오르면 담당의에게 알려요` (다른 갈래)
- 18.1 X1 `포도당을 시작한 뒤 혈당이 오르는 추이를 지켜봐요` · 시작하고 재확인한다는 정답과 거의 같음 → `포도당을 시작한 뒤 급식 펌프를 점검해요`

### C. distractorsKo — 모양 단서(조건절로 시작) 5문장
- 8.0 X1 → `빠르게 흡수되는 당을 드리기 전에 손끝 혈당을 먼저 재 볼게요` (앞 단계, 정답과 앞머리가 같음)
- 16.4 X1 → `탓하는 게 아니라 원인만 정확히 보고할게요` (facts → 원인, 들리는 자리)
- 18.2 X1 → `다시 이런 일이 없도록 담당자를 정해요` (팀·뒤 되풀이도 줄임. 길이 규칙도 맞춤)
- 19.4 X1 → `오늘 오후 가족 면담에 이걸 가져갈게요` (team meeting → 가족 면담)
- 20.0 X2 → `먼저 혈당을 확인할게요, 저혈당이나 고혈당 모두 발작을 일으킬 수 있으니까요` (참인 다른 이유. 처치가 하나뿐인 문장)

### D. distractorsKo — 되풀이 상한·길이
- 되풀이: `팀` 9회(8.4X1, 12.2X1, 15.2X1, 15.4X1·X2, 17.2X2, 18.1X2, 18.2X1, 20.0X2). 위 B·C의 15.2·18.2·20.0과 아래 15.4를 바꾸면 5회가 됩니다.
- 15.4 X1 `팀이 오면 바로 보고해 주세요` · 팀·오면 되풀이, 둘 다 정답보다 김 → `도착하면 바로 보고해 주세요`
- "오답 하나는 정답 길이 이하" 규칙을 어긴 원본(1~4자 초과). 정답 길이 이하로 줄였습니다.
  - 2.0 X2 → `이 주입은 혈당 수치에 따라 속도를 정하는 표를 매일 봐요`
  - 5.0 X2 → `혈당이 오르는 추세라 담당의에게 물을게요`
  - 6.2 X1 → `한 시간 뒤 다시 보고 필요하면 따로 적정할게요`
  - 9.1 X1 → `포도당을 시작하면 혈당이 안정되는지 자주 볼 수도 있어요`
  - 14.1 X2 → `정맥혈 검체는 관 색대로 나눠 보내요`
  - 17.2 X1 → `DKA 치료를 시작하면 수액 상태를 자주 살필게요`
  - 17.3 X1 → `속이 메스껍고 목이 쉰 것도 경고 신호일 수 있어요`
  - 19.1 X1 → `급식과 신장 기능, 기록지를 같이 살펴봐요`
  - 20.4 X2 → `알리고 나서 바로 기록을 봐요`
- 다시 센 결과(새 값 반영): 두 방식 모두 최대 5회입니다(팀·확인·차트·기분·병실·다시·다음·볼게요 각 5). 표시가 있는 단계 표현은 `뒤에` 3·`다음` 5·`나서` 3·`나면` 5·`전에` 5로 흩었습니다.

참고(고치지 않음):
- 0.4 `창문/조명`, 4.0 `베개/자세`, 4.2 X2 `알람`, 7.0·7.2·7.4 `병실/일정/베개/모니터/알람`, 9.2 X2 `린넨`: 안내 문장에서 중요하지 않은 물건으로 바꾼 것이라 브리프상 통과입니다. 다만 넷 중 셋은 듣지 않고도 걸러질 만큼 엉뚱합니다. 고칠 여력이 있으면 같은 분야 물건(급식 펌프·혈당계·주입 펌프)으로 바꾸세요.
- 경계(통과로 판정): 3.0(`가려운/뻣뻣한 느낌은 저혈당일 수`), 3.1(`피곤하면`/`답답하거나`), 17.3 X2(`허리가 뻐근한`)는 증상을 설명하는 문장에서 징후 이름만 바꾼 것이라 통과로 뒀습니다(sepsis 0.0·3.1과 같은 기준). 부르는 쪽이 엄격하게 보면 앞·뒤 단계로 바꾸세요.
- 2.6 X1·X2(`침대를 … 쓰는/옮길`)는 낱말 셋을 바꿨지만 명사 하나를 바꾸면서 따라 바뀐 동사들이라 ①은 통과로 봤습니다.

### E. 빈칸 — 정답 둘·문법 단서·위험한 오답 8문장 (표 F에 새 값 포함)
- 1.5 `burn` · sting과 같은 뜻 → 바꿈
- 3.0 `cold` · 저혈당 징후 → 바꿈
- 14.2 `lotion` · 실제로 측정값을 왜곡함 → 바꿈
- 18.2 `an table/an bed/an stage` · 관사로 셋 다 걸러짐 → 모음으로 시작하는 말로
- 4.1 `visitors changes` · 수 일치로 걸러짐 → 단수 명사로
- 15.0 `mix/fill`, 18.1 `oxygen/antacid`, 9.1 `saline` · 위 3·8번(안전)

### F. 빈칸 — 문장별 새 오답 (정답은 그대로, 오답 셋만 바꿈)
넣어 읽어서 정답이 둘이 되지 않는지, 위험한 지시로 읽히지 않는지 확인했습니다(`later/quickly/high/insulin/stop` 같은 말은 피함). **옮김**은 빈칸을 다른 가르치는 말로 옮긴 곳입니다. 옮긴 5곳(3.3 → shaky, 5.0 → provider, 5.4 → climb, 15.3 → unresponsive, 20.4 → team)의 새 답은 모두 그 문장 `words`에 있습니다. 원래 답(heartbeat·update·flag·clammy·notify)도 `words`의 가르치는 말이므로, 옮기면 빈칸으로 시험하는 말이 바뀝니다. 그래도 원래 자리는 같은 분야 오답이 모두 정답이 되어 빈칸 구실을 못 해서 옮겼습니다.
**유지 27문장**(같은 분야 오답이라 통과): 0.0, 0.1, 1.0, 1.1, 1.2, 1.3, 1.4, 2.5, 4.4, 5.3, 7.3, 8.0, 10.0, 10.1, 10.2, 11.0, 13.0, 13.2, 15.2, 16.0, 16.1, 16.3, 16.4, 17.1, 17.3(관용구라 `short of`의 짝이 한정됨. `money/cash`가 겹치지만 둠), 17.4, 20.3.

| 문장 | 정답 | 새 오답 3 (뺀 후보와 이유) |
|---|---|---|
| 0.2 | risk | pain / fever / pressure |
| 0.3 | safer | easier / rarer / quicker (`riskier`는 "낮은 게 더 안전"이라는 위험한 오해로 읽혀서 뺌) |
| 0.4 | adjust | wait / rest / refill (`stop`은 위험, `chart`는 정답이 둘이 되어 뺌) |
| 1.5 | sting | scratch / freeze / itch (`burn`을 뺌) |
| 2.0 | rate | alarm / diet / bag (`dose`·`schedule`은 정답이 둘이 되어 뺌) |
| 2.1 | protocol | dietitian / pump / label (`provider`는 정답이 둘이 되어 뺌) |
| 2.2 | consistent | fixed / random / strong (`steady`·`unchanged`는 정답이 둘이 되어 뺌) |
| 2.3 | rules | guesses / tests / alarms (`doses`는 노모그램 자체라 정답이 둘이 되어 뺌) |
| 2.4 | changes | stays / beeps / ends (`matters`·`pauses`는 정답이 둘이 되어 뺌) |
| 2.6 | improve | sleep / rest / move |
| 3.0 | shaky | itchy / swollen / stiff (`cold`·`hungry`·`sleepy`는 저혈당 징후라 뺌) |
| 3.1 | confused | thirsty / full / sore (`sleepy`·`hungry`는 저혈당 징후라 뺌) |
| 3.2 | treat | label / flush / tape (`chart/report`는 처치 대신 기록이라 뺌) |
| 3.3 | **옮김** → Shaky | Steady / Clean / Strong (`fast pulse/breathing`은 정답이 둘. `Dry`는 DKA 탈수 징후라 뺌) |
| 3.4 | finger | elbow / nose / knee (`toe`·`heel`은 실제 채혈 부위라 뺌) |
| 4.0 | feeding | heparin / suction / oxygen (`steroids`·`dextrose`·`dialysis`는 혈당을 올려서 뺌) |
| 4.1 | nutrition | position / bedding / lighting (`medication`은 정답이 둘. 단수로 맞춤) |
| 4.2 | steady | warm / sterile / sealed (`low/high`는 위험, `normal`은 정답이 둘이 되어 뺌) |
| 4.3 | meal | turn / dressing / bath (`feeding`은 정답이 둘, `dose`는 오해를 불러서 뺌) |
| 5.0 | **옮김** → provider | chaplain / cashier / registrar (update 자리는 page/call/notify가 모두 정답이라 옮김) |
| 5.1 | pattern | label / wristband / bill (`chart`·`average`는 정답이 둘이 되어 뺌) |
| 5.2 | trend | label / alarm / room (`average`·`peak`는 정답이 둘이 되어 뺌) |
| 5.4 | **옮김** → climbs | drops / settles / clears (flag 자리는 chart/report/recheck가 모두 정답이라 옮김) |
| 6.0 | rate | volume / angle / alarm (`dose`는 정답이 둘이 되어 뺌) |
| 6.1 | protocol | monitor / wristband / scale (`provider`·`order`는 정답이 둘이 되어 뺌) |
| 6.2 | recheck | reorder / relabel / restock |
| 6.3 | rate | tape / gauze / sutures (`dose`는 정답이 둘. `feeding`·`alarm`은 위험해서 뺌) |
| 6.4 | chart | menu / clock / calendar (`protocol`·`order`는 정답이 둘이 되어 뺌) |
| 7.0 | Steroids | Vitamins / Antacids / Eyedrops (`Feedings`·`Pressors`는 실제로 혈당을 올려서 뺌) |
| 7.1 | steroids | laxatives / lotions / vaccines (7.0과 같은 묶음을 돌려쓰지 않음) |
| 7.2 | dose | brand / color / bottle (`schedule`은 정답이 둘이 되어 뺌) |
| 7.4 | insulin | pillows / gauze / towels (`checks`는 정답이 둘, `feeding`·`steroids`는 위험해서 뺌) |
| 8.1 | treat | bathe / shave / weigh (`recheck`는 처치를 빠뜨려서 뺌. 3.2·5.4와 같은 묶음을 돌려쓰지 않음) |
| 8.2 | dropped | rose / spiked / leveled |
| 8.3 | Juice | Water / Ice / Broth (`Tea`·`Milk`는 당이 있을 수 있어 정답이 둘이 되어 뺌) |
| 8.4 | treating | bathing / turning / charting |
| 9.0 | adjust | label / restock / scan (`stop`·`hold`는 정답이 둘, `increase`는 위험해서 뺌) |
| 9.1 | dextrose | lotion / tape / gauze (`saline`은 위 3번. 처치로 읽히는 말은 뺌) |
| 9.2 | paused | running / flowing / warm (`stopped`·`held`는 정답이 둘이 되어 뺌) |
| 9.3 | feeding | oxygen / sedation / heparin (`dextrose`·`TPN`·`steroids`는 정답이 둘이 되어 뺌) |
| 9.4 | feeding | shower / dialysis / therapy |
| 10.3 | time | food / ice / light |
| 10.4 | stable | unstable / sedated / septic |
| 11.1 | lows | highs / rashes / clots (`falls`는 저혈당의 결과라 정답이 둘에 가까워 뺌) |
| 11.2 | monitor | bandage / sterilize / refrigerate (`chart`는 정답이 둘, `lower`는 위험해서 뺌) |
| 11.3 | weak | strong / healthy / normal (`failing`은 정답이 둘이 되어 뺌) |
| 11.4 | adjustment | shift / visit / bath (`dose`는 정답이 둘, `explanation`은 "천천히 설명"으로도 맞아서 뺌) |
| 12.0 | feeding | visitors / lighting / noise (`steroids`·`dialysis`는 정답이 둘이 되어 뺌) |
| 12.1 | insulin | bed / ventilator / suction (`feeding`은 정답이 둘이 되어 뺌) |
| 12.2 | stable | variable / erratic / elevated (`steady`·`normal`은 정답이 둘이 되어 뺌) |
| 12.3 | meals | baths / turns / dressings (`feedings`·`checks`는 정답이 둘이 되어 뺌) |
| 12.4 | changes | rooms / alarms / beds (`doses`는 정답이 둘이 되어 뺌) |
| 13.1 | closely | loosely / rarely / briefly (`quickly`는 위험해서 뺌) |
| 13.3 | illness | bedrest / heparin / noise (`stress`·`steroids`·`feeding`은 정답이 둘이 되어 뺌) |
| 13.4 | infection | rash / cough / swelling (`fever`는 정답이 둘에 가까워 뺌) |
| 14.0 | lab | home / bedside / pharmacy (`venous`·`arterial`은 정답이 둘이 되어 뺌) |
| 14.1 | sample | tourniquet / dressing / flush (`draw`·`gas`는 정답이 둘이 되어 뺌) |
| 14.2 | anemia | asthma / acne / insomnia (`lotion`은 위 4번. `gout`은 요산이 일부 측정기를 방해해서 뺌) |
| 14.3 | value | schedule / phone / courier (`result`·`report`는 정답이 둘이 되어 뺌) |
| 14.4 | chart | whiteboard / wristband / label (`flowsheet`는 정답이 둘이 되어 뺌) |
| 15.0 | push | splint / suction / tape (위 8번) |
| 15.1 | airway | eyes / skin / hands (`privacy`·`head`·`IV`는 장면상 맞아서 뺌) |
| 15.3 | **옮김** → unresponsive | awake / alert / oriented (`clammy` 자리는 unresponsive만으로 응급이라 어떤 형용사든 정답이 됨) |
| 15.4 | rapid | remote / regular / renal (`code`는 정답이 둘, `stroke/trauma`는 호출 대상이 바뀌어서 뺌) |
| 16.2 | event | diet / visit / menu (`error`·`incident`·`dose`는 정답이 둘이 되어 뺌) |
| 17.0 | acid | fluid / pressure / mucus (`ketones`·`sugar`·`potassium`은 정답이 둘이 되어 뺌) |
| 17.2 | treatment | diet / visits / mobility (`care`·`insulin`·`fluids`는 정답이 둘, `sedation`은 위험해서 뺌) |
| 18.0 | feeding | suction / sedation / lighting (`pump`·`dextrose`는 정답이 둘이 되어 뺌) |
| 18.1 | dextrose | splints / slings / ice (위 8번) |
| 18.2 | alert | example / appointment / agenda (`alarm`·`reminder`는 정답이 둘. 모음으로 시작하는 말로 맞춤) |
| 18.3 | pump | monitor / ventilator / bed (`tube`·`bag`은 정답이 둘에 가까워 뺌) |
| 18.4 | alert | dressing / wristband / diet (`alarm`·`reminder`·`order`는 정답이 둘이 되어 뺌) |
| 19.0 | regimen | roster / unit / shift (`plan`·`chart`는 정답이 둘이 되어 뺌) |
| 19.1 | dosing | staffing / billing / bathing (`timing`·`nutrition`·`mobility`는 정답이 둘이 되어 뺌) |
| 19.2 | safer | riskier / costlier / longer (`stricter`·`tighter`는 "더 엄격한 안전장치"로도 읽혀 정답이 둘, `new`·`simpler`도 정답이 둘이 되어 뺌) |
| 19.3 | low | high / spike / fever (`drop`은 정답이 둘이 되어 뺌) |
| 19.4 | meeting | lunch / photo / picnic (`huddle`·`rounds`는 정답이 둘이 되어 뺌) |
| 20.0 | confusion | rashes / hiccups / fever (`seizures`·`sweating`은 정답이 둘이 되어 뺌) |
| 20.1 | causes | visitors / meals / beds (`signs`·`tests`는 정답이 둘에 가까워 뺌) |
| 20.2 | change | bill / menu / schedule (`concern`은 정답이 둘이 되어 뺌) |
| 20.4 | **옮김** → team | chaplain / kitchen / volunteers (notify 자리는 page/call/alert가 모두 정답이라 옮김) |

### G. decoy — 108개 전부 교체 (위 7번)
문법을 살짝 틀린 청크(◇)와 같은 자리에 들어가지만 뜻이 다른 해 없는 구(◆)를 섞었습니다. 위기·처치 문장(S6·S8·S9·S15~S18)은 시간·약·방향을 건드리지 않으려고 모두 ◇로 했습니다. 새 decoy는 모두 en 안에 없고(부분 문자열로도 확인) 청크와도 다릅니다. ◆는 넣어 읽어도 `ko`에 맞지 않습니다.

| 문장 | 새 decoy | 문장 | 새 decoy | 문장 | 새 decoy |
|---|---|---|---|---|---|
| 0.0 | ◆ for your comfort | 0.1 | ◇ can causes | 0.2 | ◆ lowers your cost |
| 0.3 | ◇ is safest than | 0.4 | ◆ and explain | 1.0 | ◆ adjust your diet |
| 1.1 | ◆ for a quick reading | 1.2 | ◆ so the doctor | 1.3 | ◆ the bed |
| 1.4 | ◆ in your arm | 1.5 | ◆ a lot | 2.0 | ◆ that sets the time |
| 2.1 | ◆ , the pharmacist | 2.2 | ◆ your insulin pump | 2.3 | ◇ based in |
| 2.4 | ◆ each morning | 2.5 | ◆ , being this tired | 2.6 | ◇ as you improves |
| 3.0 | ◇ can means a low sugar | 3.1 | ◇ if you feels | 3.2 | ◇ are low |
| 3.3 | ◆ are the monitor's | 3.4 | ◆ toe stick | 4.0 | ◇ , so we adjusts |
| 4.1 | ◆ When your mood changes | 4.2 | ◆ to your schedule | 4.3 | ◇ , we lowers |
| 4.4 | ◆ and oral nutrition | 5.0 | ◇ is trending up | 5.1 | ◆ at the menu |
| 5.2 | ◇ I'll reports | 5.3 | ◆ Three meals | 5.4 | ◇ before it climb further |
| 6.0 | ◇ his currently sugar | 6.1 | ◇ how many | 6.2 | ◇ in a hour |
| 6.3 | ◇ the rates now | 6.4 | ◇ , I bumps | 7.0 | ◇ , so we increases |
| 7.1 | ◇ often peaking | 7.2 | ◇ , we'll adjusts | 7.3 | ◇ you gets |
| 7.4 | ◇ to covers | 8.0 | ◇ and rechecked | 8.1 | ◇ until you is |
| 8.2 | ◇ to prevents | 8.3 | ◇ works fast | 8.4 | ◇ after treated |
| 9.0 | ◇ so you doesn't go low | 9.1 | ◇ to keeps | 9.2 | ◇ are paused |
| 9.3 | ◇ can drops | 9.4 | ◆ until your shower | 10.0 | ◇ before stopped |
| 10.1 | ◇ keep your sugar | 10.2 | ◆ for a few days | 10.3 | ◇ to starts working |
| 10.4 | ◇ Once you stable | 11.0 | ◆ in your bones | 11.1 | ◇ fewer insulin |
| 11.2 | ◇ and adjusts gently | 11.3 | ◆ when lungs | 11.4 | ◇ and goes slow |
| 12.0 | ◆ , like music | 12.1 | ◇ helps level out | 12.2 | ◆ more relaxed |
| 12.3 | ◆ from missed visits | 12.4 | ◇ works better | 13.0 | ◆ stress headaches |
| 13.1 | ◇ and titrates | 13.2 | ◆ , the fevers | 13.3 | ◇ drive it |
| 13.4 | ◇ cleared | 14.0 | ◆ from a home draw | 14.1 | ◇ , we confirms |
| 14.2 | ◆ can speed | 14.3 | ◇ When they doesn't match | 14.4 | ◇ I always notes |
| 15.0 | ◇ and pushes D50 | 15.1 | ◇ while we treats | 15.2 | ◇ and repeats |
| 15.3 | ◇ a emergency | 15.4 | ◇ Called the rapid response | 16.0 | ◇ were given |
| 16.1 | ◇ and starts dextrose | 16.2 | ◇ and documents | 16.3 | ◇ before we gives |
| 16.4 | ◇ what happening | 17.0 | ◇ acid are building up | 17.1 | ◇ I'm draw labs |
| 17.2 | ◇ if it progressing | 17.3 | ◆ and short of sleep | 17.4 | ◇ from gets |
| 18.0 | ◇ so we must stopped | 18.1 | ◇ and rechecks | 18.2 | ◇ so this don't |
| 18.3 | ◇ an hours ago | 18.4 | ◇ I'm builds | 19.0 | ◆ the whole menu |
| 19.1 | ◆ , and sleep together | 19.2 | ◇ to prevents | 19.3 | ◆ his third meal today |
| 19.4 | ◆ to the family meeting | 20.0 | ◇ can causes confusion | 20.1 | ◇ , we looks |
| 20.2 | ◇ , I'm escalate | 20.3 | ◆ from a fever | 20.4 | ◇ , I'll notifies |

뺀 후보와 이유:
- `too loose here`(0.1)와 `a high sugar`(3.0)는 잘못된 임상 정보가 됩니다.
- `an old drop`(1.1)은 잘못된 기법입니다.
- `we raise`(4.3), `after stopping`(10.0), `the morning rise`(7.4), `his current weight`(6.0)는 방향·시점·기준이 바뀝니다.
- `update the family`(5.0)는 호출 대상이 바뀝니다.
- `sees your trends`(1.2), `the next ones`(8.2), `driving them`(13.3), `the reasons`(14.4), `teams`(15.4), `the IV lines`(10.4), `a single value`(5.2), `as the fever`(13.4), `no names`(16.4)는 `ko`에 그대로 맞아 정답이 둘이 됩니다.
- 같은 꼴만 되풀이되지 않게, 고칠 때 ◇의 틀린 곳(-s 붙이기·관사·시제)도 문장마다 고르게 섞으세요.

### H. order 9장
- S2 2↔3 · `With that, the dose stays safe…`가 1줄 바로 뒤에도 읽힘(`that` = 표) → 3줄 `Those small changes keep the dose safe and consistent.`(2줄의 조정에 묶음) / ko `그 작은 조정들이 용량을 안전하고 일정하게 지켜줘요`
- S4 3↔4 · 4줄 `That includes a skipped meal…`가 2줄 바로 뒤에도 자연스러움 → 4줄 `Doing that for a skipped meal means lowering the rate first.`(3줄의 match에 묶음) / ko `거른 식사에 맞출 때는 먼저 속도를 낮춰요`
- S7 2↔3 · 3줄 `to cover that rise`가 1줄의 raise를 받아 2·3줄을 바꿔도 읽힘 → 3줄 `So we may add extra insulin to cover that afternoon peak.`(2줄에 묶음)
- S9 3↔4 · 4줄을 3줄 앞에 둬도 읽힘 → 4줄 `While we do that, I'll check your sugar more often until feeding restarts.`(12단어. 3줄의 조정에 묶음)
- S10 3↔4 · `after that`이 라인 제거 뒤로 가도 읽힘 → 4줄 `Once those hours look stable, we'll remove the IV line.`(3줄의 몇 시간에 묶음)
- S13 3↔4 · `For now…`가 4줄 뒤에 와도 자연스러움 → 4줄 `With that close titration, his sugars should settle as the infection improves.`(13단어). 2↔3도 약하게 읽힘. 같이 고치려면 2줄 `This` → `That high sugar`.
- S17 1↔2 · 검사부터 말하고 이유를 뒤에 붙여도 자연스러움 → 2줄 `That's why I'm drawing labs for ketones and blood acid right away.`(12단어)
- S20 3↔4 (약함) · `Either way…`가 2줄 바로 뒤에도 읽힘 → 4줄 `Whatever those checks show, I'm escalating this change to the team.`(2·3줄을 모두 받는 말)
- S14 3줄 `To rule those out` · 정맥혈 검체는 관류·빈혈을 가려내는 것이 아니라 그것을 피해 실제 값을 확인하는 것 → `Because of those, we confirm with a venous sample.`
- 통과로 본 것: S15는 "신속대응팀 호출 → D50" 순서입니다. 호출은 몇 초면 끝나고 실제로는 동시에 하므로 임상적으로 맞습니다. 2줄의 `Next,`가 D50을 미루는 말로 읽히지는 않습니다.

### I. why 5문장
- 0.1 `'lows'는 저혈당이 반복될 수 있다는 복수형` · 과장. lows는 저혈당 수치를 가리키는 구어 명사 → `'can cause'는 항상이 아니라 가능성을 말해 겁주지 않고 위험을 알려 줘요. 'lows'는 저혈당을 짧게 부르는 구어예요.`
- 1.0 `주사처럼 불편한 일` · 장면은 손끝 채혈 → `주사처럼` → `손끝을 찌르는 것처럼`
- 10.4 `'remove'는 제거예요` · 뜻풀이만 함 → `'Once'로 조건이 먼저 충족돼야 한다고 말해, 라인을 언제 빼는지 기준을 분명히 해요.`
- 15.4 `정식 이름이라 줄이지 않고 불러요` · 과장(미국 병원에서는 흔히 "call a rapid"·RRT로 줄여 부름) → `'rapid response team'을 다 말하면 누구를 부르는지 오해가 없어요. 'now'가 즉시 부르라는 뜻이에요.`
- 19.2 `'the next one'은 같은 일의 재발` · en에는 the next low라고 되어 있고 the next one이 없음 → `'the next low'로 막으려는 대상을 분명히 해요.`

### J. tag 1문장
- 4.3 `검사 때문에` → `금식 대비` (문장이 하는 일은 검사 때문에 굶을 때 미리 인슐린을 낮추는 것)

### A 몫 참고(B는 고치지 않음)
- 15.2 en `Recheck in five minutes`: IV D50 뒤 재확인은 흔히 15분입니다(S8은 15분). 병원 프로토콜에 따라 다르므로 A가 판단할 일입니다. order S15 3줄도 같습니다.
- 20.2와 20.4는 en이 거의 같습니다(`Either way, I'm escalating this change to the team` / `Either way, I'll notify the team right away`). 주제 안에서 같은 말이 겹칩니다.
- 10.4·S10 order `remove the IV line`: 인슐린 주입을 끊는다는 뜻이면 `stop the insulin line`이 더 정확합니다. 중환자실 환자는 대개 정맥로를 유지합니다.

## 종합
고칠 것은 **문장 거리 51건**입니다.
- distractorsKo 28문장: 안전 9 + 정답 둘 4 + 모양 5 + 되풀이·길이 10, A~D. 15.4는 되풀이와 길이를 함께 셈.
- 빈칸 특수 8문장(E): 안전 3 + 정답 둘 3 + 문법 단서 2.
- order 9장, why 5, tag 1.
- 이와 별도로 **빈칸 오답 다시 쓰기 81문장**(표 F, E의 8문장 포함)과 **decoy 108개 전부 교체**(표 G)가 있습니다.

**안전 12건**(distractorsKo 9 + 빈칸 3)과 **정답 둘 7건**(distractorsKo 4 + 빈칸 3)을 고치기 전에는 내보내면 안 됩니다. 빈칸과 decoy는 이 주제에서 모양만 보고 걸러지므로, 같은 분야 오답과 청크 변형으로 다시 써야 시험 구실을 합니다.
