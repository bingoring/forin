# icu-sepsis — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-sepsis.yaml`(A·B 합친 파일), 21상황 · 105문장 · order 21장. 문장 전수를 스크립트로 뽑았습니다(`en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy, order 4줄). order 인접 교환(1↔2, 2↔3, 3↔4, 63건)은 카드마다 하나씩 판정했습니다. 되풀이 상한은 조사를 떼고 어간으로 세었고, 어미 묶음(하셨어요·래요·대요·했어요)은 따로 셌습니다.

안전 판정 기준(부르는 쪽 지시): 오답이 정답 행동의 **앞·뒤 단계면 통과**, 그 순간 정답 행동 **대신** 하는 일이면 실패. 호출 대상·확인 대상·확인 부위·용량·약·시점을 바꾸는 오답, 처치를 늦추는 decoy, 위험한 지시로 읽히는 빈칸 오답은 실패.
가르는 기준: 그 문장에서 바뀐 대상이 **행동이나 지시를 일으키는 자리**(확인·감시·호출·투여·조정의 대상이나 조건)면 실패로 봤습니다. 가족에게 **소견이나 설명을 전하는 문장**에서 수치 이름만 바뀐 것(0.0, 3.1, 5.0, 12.4, 15.0, 15.3, 17.0, 18.0, 18.3)은 통과로 두되 아래 "경계"에 적었습니다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 105개 모두 어순·문법 모양에 이유를 붙였고 `ko`를 되풀이하지 않음. 사실 오류는 없음. 다만 1.3·2.3 why는 "won't delay가 기다림이 없다고 못 박아요"라고 해서 A 메모가 지적한 절대 약속을 오히려 굳힘(문장 en은 A 몫). |
| 2 빈칸 | **1** | **105문장 중 100문장의 오답이 철자·소리만 닮은 엉뚱한 말**입니다(`lettuce/latte/ladder`, `garage/kitchen/laundry`, `sauce/soccer/sofa`, `cuddly/curious/cloudy`). 파일럿 갈래 2를 주제 전체에서 되풀이했습니다. 읽기만 해도 걸러져서 빈칸이 시험 구실을 못 합니다. 정답이 둘인 곳 1개(10.0 `beyond`), 정답과 소리가 같은 함정 1개(16.0 `sights`). |
| 3 decoy | 3 | 105개 모두 물건이나 장소 꼬리라서 모양만 보고도 걸러짐. **처치를 늦추는 조립 1개**(10.3 `at the staff meeting`). `ko`에 그대로 맞게 조립되는 것 2개(11.4·15.4). 그대로 읽으면 투약 공백으로 들리는 것 1개(9.4). |
| 4 distractorsKo | **2** | 평이한 설명 문장(S0~S9 대부분, S12·S13·S20)은 좋음. **처치·호출 문장은 행동을 다른 일로 바꾸거나 조건·대상을 바꾼 오답이 17문장**입니다. 저작자가 메모한 대로 바꿀 세부가 없어 **말투만 바꾼 오답**이 많습니다. 전해 들은 말투(하셨어요·래요·대요·바라요)가 11개, 과거형이 7개라서 ③에 실패하고 어미만 보고도 걸러집니다. 되풀이 상한은 `열` 6회로 초과. 체온·혈당·하셨어요는 5회로 경계에 닿았습니다. |
| 5 order | 4 | 인접한 두 줄을 바꿔도 읽히는 카드가 2장(S1 2↔3, S18 2↔3)이고, 약한 것이 1장(S19 3↔4). 15단어가 넘는 줄은 6줄(S8 L4 17, S13 L1 21, S13 L4 18, S15 L4 17, S18 L2 16, S20 L4 16). 임상 순서는 모두 맞음(S13 카드는 손 위생 → 가운·장갑). |
| 6 tag·icon | 5 | 10자 이하이고 상황 안에서 일관됨. 아이콘도 뜻과 맞음. |
| 8 파일럿 갈래 | **2** | 갈래 2(동떨어진 빈칸 오답)가 거의 전 문장에 있음. 갈래 5와 "오답으로 위험한 처치를 보이기"는 응급 상황(S10·S14~S17)에 몰려 있음. 관사로 걸러지는 오답은 없음. order 임상 순서는 맞음. |

## 사실 오류·심각한 문제
1. **빈칸 오답이 주제 전체에서 소리만 닮은 말입니다.** 저작자가 v45 단어 오답 규칙(철자·소리가 닮은 오답)을 문장 빈칸에 그대로 쓴 것으로 보입니다. 하지만 문장 빈칸의 규칙은 **같은 분야에서 틀린 말**입니다(브리프 파일럿 갈래 2, "이어진 검토" 첫 항목). 아래 표에 새 선택지를 문장마다 적었습니다.
2. **응급 상황의 오답이 그 순간 해야 할 처치를 다른 일로 바꿉니다.**
   - 15.2 `면담 자리를 준비`: 다음 단계 지지 대신 면담을 준비함.
   - 17.2 `동의서를 확인`·`삽관 기록을 준비`: 삽관 준비 대신 서류를 챙김.
   - 16.2 `전해질 검사 패널`: 검사를 다른 것으로 바꿈.
   - 15.4 `알람을 기록`·`수액량을 기록`: 승압제 용량 기록이 빠짐.
   - 10.4 `맥박/체온이 반응하지 않으면 다음 약제로`: 승압제를 올리는 기준이 바뀜.
   - 11.3 `세 장기가`: 호출 기준을 높여서 부르는 것을 늦춤.
   - 3.2 `쉰 소리`·`목에서`: 수액 속도를 조정하는 신호와 청진 부위가 바뀜.
   - 14.2 `가족이 동의해 주면`·`혈압이 안정되면 좁힐게요`: 항생제를 좁히는 근거가 배양 결과가 아닌 것으로 바뀜.
3. **19.3 X2 `몇 시간 안에 회복이 늦어질 수 있어요`는 잘못된 안심입니다.** 괴사성 감염에서 "패혈증으로 번진다"는 경고를 "회복이 늦어진다"로 낮춥니다.
4. **20.4 X1 `가족이 무엇을 원하실지`는 결정권을 옮깁니다.** 목표 재설정 대화의 핵심인 "환자 본인이 원했을 것"을 가족의 뜻으로 바꿉니다(브리프: 결정권을 가져가지 않음).
5. **13.4 X1 `방문 기록부에 이름을 적으시고`**(저작자가 물은 것): 가운·장갑 대신 행정 절차를 하라는 말이 됩니다. 그대로 따르면 보호구 없이 들어갑니다 → 실패.
6. **7.1 X1 `혈당을 다시 검사해요`**(저작자가 물은 것): 두 가지로 실패합니다. ⑥ 재평가 대상을 젖산에서 혈당으로 바꿉니다. ③ en이 `recheck it`이라 lactate가 들리지 않아서, 바꾼 자리가 영어에서 들리지 않습니다.
7. **말투·주어만 바꾼 오답**(저작자가 물은 것): 세 갈래로 판정했습니다.
   - (a) **전해 들은 말투**(하셨어요·래요·대요·바라요): 10.2 X2, 16.3 X2, 16.4 X2, 17.1 X2, 17.4 X1, 18.1 X2, 18.2 X1·X2, 18.4 X2, 19.1 X2, 19.2 X2. 영어에는 "누가 그러라고 했다"가 없으니 **③ 실패**입니다. 한국어 어미만 보고 걸러지므로 듣기 문제가 아닙니다. 뜻은 정답과 같은 행동이라 사실상 **정답 둘(④)**입니다.
   - (b) **과거형**: 0.2 X1, 0.4 X2, 6.2 X2, 9.4 X2, 11.1 X2, 15.2 X2, 16.2 X2. 시제는 내용 낱말이 아니므로 ① 실패이고, (a)와 같은 장치를 주제 안에서 18번 썼습니다.
   - (c) **`제가 ~할게요`로 주어만 바꾼 것**: 16.3 X1, 17.4 X2, 18.4 X1, 19.2 X1. `Please`·`Let's`와 `I'll`이 영어에서 들리고 해도 없어서 **통과**입니다. 4회라 상한 안입니다.
   - 결론: (a)·(b)는 모두 바꿉니다(아래 새 값). (c)는 둡니다.
8. **decoy 10.3 `at the staff meeting`**: `steroids only start after the order's confirmed at the staff meeting`으로 조립됩니다. 스테로이드 시작을 회의 때까지 미루는 지시가 되어 처치를 늦추는 decoy입니다.

## 고칠 것

### A. distractorsKo — 안전(⑥) 실패 17문장
각 항목은 "문장 · 몇 번째 오답 · 문제 → 새 값"입니다. 새 값의 길이는 스크립트로 확인했습니다(1.25배 또는 3자 이내).
- 2.4 X1 `이 첫 하루는` · 1시간 번들을 "첫 하루"로 늦춤(처치 시점) → `이 첫 한 시간은 분 단위가 중요해서, 안전한 한도 안에서 팀 전체가 빠르게 움직이고 있어요` (주어 I'm → 팀 전체)
- 3.2 X1 `쉰 소리` · 수액 속도를 조정하는 신호가 바뀜 → `폐에서 젖은 소리가 나면 바로 침대 머리를 올려 드릴게요` (함께 하는 일. 보고로 바꾸면 15.2·17.2처럼 행동을 대신하게 되어 피함)
- 3.2 X2 `목에서` · 청진 부위가 바뀜 → `폐에서 젖은 소리가 나면 바로 산소포화도도 확인할게요` (곁 단계)
- 4.4 X1 `입안` · 확인 부위를 라인에서 입안으로 바꿈 → `피부, 라인, 그리고 최근 상처를 의사와 함께 확인해 볼게요` (one by one → 의사와 함께)
- 7.1 X1 `혈당을 다시 검사해요` · 위 6번 → `항생제가 효과가 있는지 확인하려고 다시 검사해요` (resuscitation → 항생제, 들리는 자리. 재검은 그대로이고 해가 없음)
- 10.2 X1 `소변을 세심하게 감시` · 감시 대상이 바뀜 → `처방을 확인하고 첫 투여 시각을 기록해 둡시다` (뒤 단계)
- 10.3 X2 `승압제 라벨을 확인` · 확인 대상이 용량에서 라벨로 바뀜 → `회진 전에 승압제 용량을 확인하세요, 스테로이드 처방은 회진 때 같이 볼 거예요` (X1 `교대 전에`는 확인하는 때만 바뀐 것이라 통과)
- 10.4 X1 `맥박이`, X2 `체온이` · 승압제를 올리는 기준이 바뀜 → X1 `한 시간 안에 혈압이 반응하지 않으면 중환자전담의에게 바로 알릴게요` · X2 `한 시간 뒤 혈압을 다시 보고 팀과 다음 약제를 정할게요`
- 11.3 X1 `세 장기가` · 호출 기준을 높여서 부르는 것을 늦춤 → `두 장기가 차례로 멈추면 회진 때가 아니라 지금 중환자전담의를 불러야 해요` (at once → 차례로. 그래도 지금 부름)
- 13.4 X1 `방문 기록부에 이름을` · 위 5번 → `나가실 때 가운과 장갑은 문 옆 통에 버리시고, 손을 잘 씻어 주세요` (같은 틀로 벗는 쪽의 뒤 단계. X2 `두 번 씻어`는 통과)
- 14.2 X1 `가족이 동의해 주면`, X2 `혈압이 충분히 안정되면` · 항생제를 좁히는 근거가 바뀜 → X1 `배양 결과가 안내해 주면 그때 차트에 남길게요` · X2 `배양 결과가 나오면 그때 팀과 정할게요`
- 15.2 X1 `다음 면담 자리를` · 지지 단계 대신 면담을 준비함 → `중환자전담의를 부르는 동안 지금 용량을 기록해 둡시다` (X2 과거형도 아래 B에서 바꿈)
- 15.4 X1 `알람을`, X2 `수액량을` · 용량 기록이 빠짐 → X1 `다음 승압제를 추가하기 전에 라인 연결을 한 번 더 봐 주세요` (앞 단계) · X2 `다음 승압제를 추가한 뒤에도 용량을 계속 기록해 두세요` (뒤 단계)
- 16.2 X1 `전해질 검사 패널` · 검사가 바뀜 → `DIC 검사 패널을 보내기 전에 검체 라벨을 같이 봅시다` (앞 단계. X2는 B에서 바꿈)
- 17.2 X1 `삽관 동의서를 확인`, X2 `삽관 기록을 준비` · 삽관 준비 대신 서류를 챙김 → X1 `흡인기를 켜고 호흡치료팀을 부릅시다` · X2 `산소를 올리고 호흡치료팀을 부릅시다` (둘 다 앞 단계이고 RT 호출은 그대로)
- 19.3 X2 `회복이 늦어질` · 위 3번(잘못된 안심) → `지금 수술실로 보내지 않으면 몇 시간 안에 혈압이 떨어질 수 있어요`
- 19.4 X1 `혈압과 맥박을` · 감시 대상이 바뀜(젖산이 빠짐) → `수술팀이 도착할 때까지 혈압과 젖산을 표에 계속 적을게요` (X2 `마취팀이`는 끝나는 때만 비슷하게 바뀐 것이라 통과)
- 20.4 X1 `가족이 무엇을 원하실지` · 위 4번 → `여기엔 틀린 답이 없어요, 그분이 무엇을 원하셨을지 천천히 적어 봐요`

### B. distractorsKo — 말투만 바꾼 오답(③·④, 어미 되풀이) 14문장
10.2·15.2·16.2는 A에서 함께 바꿉니다.
- 0.2 X1 `변화가 있다고 바로 의사에게 알렸어요` → `무엇이든 의사가 정하면 바로 가족분께 알려 드릴게요` (order 4줄과 같은 뒤 단계)
- 0.4 X2 `뭘 했는지` → `지금 혼란스러워 보이셔도 의사가 뭘 하는지 계속 설명해 드릴게요` (I'm → 의사)
- 6.2 X2 `지켜보고 있었어요` → `중심정맥관으로 줄 거고, 주입 부위도 매시간 살펴볼게요`
- 9.4 X2 `유지하고 있었어요` → `새 항생제가 완전히 효과를 낼 때까지 반응을 매일 지켜볼게요`
- 10.2 X2 `감시하래요` → `처방을 확인하기 전에 알레르기 기록부터 봅시다` (앞 단계)
- 11.1 X2 `표시해 두었어요` → `오르는 크레아티닌과 빌리루빈을 약사에게도 알려 둡시다` (팀에 더해 약사. 신기능에 따라 용량을 조정하는 데 참인 일이고 해가 없음)
- 15.2 X2 `준비했어요` → `중환자전담의를 부르고 도착하면 지금 용량을 보고합시다`
- 16.2 X2 `준비했어요` → `DIC 검사 패널을 보내고 결과가 나오면 바로 다시 봅시다`
- 16.3 X2 `연락하라고 하셨어요` → `지금 혈액은행에 연락해 주세요, 검체는 바로 내려보낼게요`
- 16.4 X2 `지켜보라고 하셨어요` → `혈소판을 기다리는 동안 모든 라인 부위의 출혈을 표에 적어 두세요`
- 17.1 X2 `올리라고 하셨어요` → `패혈성 쇼크가 와서 환기를 올려야 해요` (이유만 바꿈. 처치가 하나뿐인 문장)
- 17.4 X1 `호출하라고 하셨어요` → `삽관 카트를 복도에서 가져오고 지금 마취과를 호출하세요` (장소 하나를 더함)
- 18.1 X2 `필요하대요` → `수액과 전해질을 조절하려면 투석 카테터가 먼저 필요해요` (앞 단계)
- 18.2 X1 `시작하래요`, X2 `시작하길 바라요` → X1 `투석팀과 조율해서 투석 카테터 위치를 정합시다` · X2 `투석팀과 조율해서 시작 시각을 알립시다`
- 18.4 X2 `부르라고 하셨어요` → `소변이 더 줄기 전에 지금 신장내과팀을 불러 주세요` (before 뒤의 이유만 바꿈)
- 19.1 X2 `필요하대요` → `조직을 살리려면 지금 바로 응급 수술이 필요해요` (참인 다른 이유)
- 19.2 X2 `준비시키래요` → `수술실 팀에 알리고 가족분께 바로 설명합시다`

### C. distractorsKo — 그 밖 3문장
- 19.0 X1 `열이 오르고` · 되풀이 상한 초과(`열` 6회: 1.1·3.0·3.3·6.0·12.1·19.0) → `감염이 빠르게 퍼지고 상처가 붓고 있어요`
- 3.3 X2 `적은 양의` · 반대말로 뒤집음(⑤) → `맥박이 너무 빨라서 처음엔 많은 양의 수액으로 시작했어요`
- 4.2 X1 `어디서 끝났는지` · 시작↔끝을 뒤집음(⑤) → `감염이 언제 시작됐는지 알면 정확하게 치료하는 데 도움이 돼요`

되풀이 확인: 위 A~C의 새 값을 넣고 다시 세면 어간 기준 최대 5회입니다(열·전·가족·알리-·줄이-·호흡·소변·설명 각 5, 제가 4, 확인 3). 하셨어요·래요·대요 묶음은 0회가 됩니다.

참고(고치지 않음): 15.1 X2 `단일 장기`는 반대말에 가깝지만, 그대로 해도 해가 없어서 둡니다. 14.0 X1 `가족 요청`과 15.1 X1 `혈압 저하`는 거짓 근거이지만(저작자 메모), 행동을 바꾸지 않아서 통과입니다.
경계(통과로 판정): 0.0(체온·맥박수), 3.1(체중·맥박), 5.0(건조한지·호흡수), 12.4(체온·호흡)는 가족에게 무엇을 보는지 설명하는 문장이라 통과로 뒀습니다. 부르는 쪽이 "확인 대상 바꾸기"를 더 엄격하게 본다면 이 4문장도 A처럼 앞·뒤 단계로 바꾸세요.

### D. 빈칸 — 정답 둘·함정 2문장
- 10.0 `beyond` · `still needs high vasopressor support beyond fluids`도 맞는 말이라 정답이 둘 → 선택지 `despite / because of / instead of / for`
- 16.0 `sights` · 정답 `sites`와 소리가 같은 철자 함정 → 선택지 `sites / rooms / doses / pumps`

### E. 빈칸 — 동떨어진 오답(갈래 2), 문장별 새 선택지
정답은 그대로 두고 오답 셋만 바꿉니다. 새 오답은 넣어 읽어서 정답이 둘이 아닌지, 위험한 지시로 읽히지 않는지 확인했습니다(`high dose`·`delay`·`tomorrow` 같은 말은 피함). 빈칸을 옮기는 곳은 **옮김**으로 표시했습니다. 0.2(`changes`), 0.3(`slow/quiet/steady`), 13.4(`sandals/perfume/jewelry`)는 이미 같은 분야 오답이라 그대로 둡니다.

| 문장 | 정답 | 새 오답 3 |
|---|---|---|
| 0.0 | alert | thirsty / hungry / tall (`heavy`는 30mL/kg 계산 때문에 장면상 맞을 수 있어서 뺌) |
| 0.1 | closely | briefly / rarely / loosely |
| 0.4 | **옮김** → confused | cheerful / talkative / hungry |
| 1.0 | exact | same / wrong / old |
| 1.1 | handling | causing / spreading / hiding |
| 1.2 | treat | discharge / bill / transfer |
| 1.3 | antibiotic | surgery / dialysis / discharge |
| 1.4 | lab | pharmacy / radiology / registration |
| 2.0 | likely | healed / old / cleared |
| 2.1 | recovery | relapse / bleeding / resistance |
| 2.2 | carefully | roughly / loosely / rarely |
| 2.3 | cultures | type / count / gas |
| 2.4 | counts | passes / waits / ends |
| 3.0 | fluids | antibiotics / oxygen / blankets |
| 3.1 | **옮김** → urine (`urine output`) | stool / sputum / saliva (`cardiac`·`drain`은 정답이 둘이 되어 뺌) |
| 3.2 | wet | clear / quiet / strong |
| 3.3 | large | small / tiny / fixed |
| 3.4 | working | leaking / pooling / clotting |
| 4.0 | redness | itching / numbness / hunger |
| 4.1 | catheters | vaccines / allergies / X-rays |
| 4.2 | precisely | slowly / briefly / gently |
| 4.3 | urinate | sit / sleep / talk (`cough`·`eat`는 다른 감염원을 가리켜 정답이 둘이 되어 뺌) |
| 4.4 | wounds | meals / visitors / bills |
| 5.0 | warm | thick / soft / tan (`cool`·`dry`는 정답이 둘이 되어 뺌) |
| 5.1 | clearer | slower / foggier / sleepier |
| 5.2 | direction | room / unit / bed |
| 5.3 | warmer | cooler / paler / bluer |
| 5.4 | stable | tired / sleepy / swollen |
| 6.0 | alone | twice / later / once (`today`는 장면상 맞아서 뺌) |
| 6.1 | tighten | widen / relax / open |
| 6.2 | central | arterial / feeding / suction (`peripheral`은 넣지 않음 — A 메모, SSC 2021) |
| 6.3 | common | rare / new / costly |
| 6.4 | low | fixed / final / weekly (`high`는 위험한 지시로 읽혀서 뺌) |
| 7.0 | falling | rising / stable / missing |
| 7.1 | recheck | skip / hold / cancel |
| 7.2 | high | low / normal / flat |
| 7.3 | dropped | rose / climbed / jumped |
| 7.4 | team | chaplain / cashier / registrar |
| 8.0 | remove | monitor / culture / photograph |
| 8.1 | drain | culture / freeze / warm |
| 8.2 | coordinate | argue / compete / bargain |
| 8.3 | reach | cause / form / feed |
| 8.4 | faster | slower / later / worse |
| 9.0 | shows | hides / misses / blocks |
| 9.1 | targeted | costly / potent / familiar (`broad`는 `more broad` 비교급으로 걸러져서 뺌) |
| 9.2 | adjusting | billing / filing / printing (`stopping`은 치료 중단으로 읽혀서 뺌) |
| 9.3 | resistant | viral / genetic / childhood (`fungal`은 정답이 둘이 되어 뺌) |
| 9.4 | current | oral / topical / weekly |
| 10.1 | stabilize | sedate / wake / feed |
| 10.2 | order | discharge / transfer / diet |
| 10.3 | confirmed | cancelled / expired / paused |
| 10.4 | agent | room / chapter / topic (`shift`는 넘기는 지시로 읽혀서 뺌) |
| 11.0 | trending | holding / backing / lining |
| 11.1 | rising | falling / stable / normal |
| 11.2 | recognition | discharge / sedation / feeding |
| 11.3 | organs | lines / pumps / alarms |
| 11.4 | trend | diet / visit / bill |
| 12.0 | extra | needed / normal / missing |
| 12.1 | swelling | bleeding / fever / cough |
| 12.2 | balance | avoid / stop / pause |
| 12.3 | legs | eyes / ears / lungs |
| 12.4 | slowly | rarely / unevenly / blindly (`quickly`는 위험한 지시로 읽혀서 뺌) |
| 13.0 | immune | nervous / digestive / skeletal |
| 13.1 | germs | noises / lights / bills |
| 13.2 | special | weaker / fewer / cheaper |
| 13.3 | small | healed / past / minor |
| 14.0 | coverage | dose / schedule / allergy |
| 14.1 | bacteria | viruses / fungi / allergies |
| 14.2 | guide | delay / fail / confuse |
| 14.3 | recent | future / planned / next |
| 14.4 | **옮김** → focused | expensive / familiar / powerful |
| 15.0 | multiple | no / oral / home |
| 15.1 | dysfunction | recovery / improvement / support |
| 15.2 | prepare | describe / print / bill |
| 15.3 | page | thank / bill / quote |
| 15.4 | doses | colors / prices / brands |
| 16.1 | products | sugar / pressure / donors (`thinners`는 위험한 지시로, `type`은 수혈 전이라 정답이 둘이 되어 뺌) |
| 16.2 | send | copy / print / file |
| 16.3 | units | forms / pumps / charts (`bags`는 정답이 둘이 되어 뺌) |
| 16.4 | platelets | dietitian / chaplain / transport |
| 17.0 | dropping | rising / steady / normal |
| 17.1 | **옮김** → ventilation | nutrition / visitation / mobility |
| 17.2 | intubation | discharge / surgery / dialysis |
| 17.3 | labored | relaxed / quiet / easy |
| 17.4 | cart | bill / report / schedule (`tray`는 정답이 둘이 되어 뺌) |
| 18.0 | climbing | falling / dropping / steady |
| 18.1 | electrolytes | pain / fever / sleep |
| 18.2 | dialysis | nutrition / transport / chaplain (`pharmacy`는 CRRT 용액을 준비해서 정답이 둘이 되어 뺌) |
| 18.3 | doubled | halved / dropped / settled |
| 18.4 | renal | dental / dietary / transport |
| 19.0 | tissue | pain / fever / swelling (`wound`는 정답이 둘이 되어 뺌) |
| 19.1 | source | dressing / stitches / cast |
| 19.2 | immediately | politely / quietly / twice (`later`·`tomorrow`는 늦추는 지시라서 뺌) |
| 19.3 | septic | stable / better / chronic |
| 19.4 | lactate | weight / height / appetite |
| 20.0 | struggling | recovering / improving / resting |
| 20.1 | matters | hurts / costs / tires |
| 20.2 | weigh | rush / skip / hide |
| 20.3 | hardest | shortest / easiest / cheapest |
| 20.4 | wrong | long / quick / paper (`right`는 정답이 둘이 되어 뺌) |

### F. decoy 4문장
- 10.3 `at the staff meeting` · 조립하면 스테로이드 시작을 회의 때까지 미룸(**안전**) → `a paper cup`
- 9.4 `on the cart` · `keep the current antibiotic on the cart`로 조립되어 투약을 멈추는 말로 읽힘 → `a spare pillow`
- 11.4 `in the folder` · `I'll chart the trend in the folder now …`가 `ko`에 그대로 맞음(정답 둘) → `a warm blanket`
- 15.4 `for the archive` · `Document the pressor doses for the archive now …`가 `ko`에 그대로 맞음(정답 둘) → `the vending machine`
- 참고: 13.4 `on the way`는 `before entering` 자리에 들어가 조립되지만, 뜻이 달라 해는 없어서 둡니다.

### G. order 8장
- S1 2↔3 · `As soon as that's done`이 1줄의 채취를 받을 수 있어서 2·3줄을 바꿔도 읽힘 → 3줄 `As soon as that moment is over, the antibiotic starts.`(2줄의 a moment에 묶음)
- S18 2↔3 · `He needs continuous dialysis` 뒤에 `That's because his kidneys are failing fast`가 와도 자연스러움. 2줄도 16단어임 → 2줄 `That's because his kidneys are failing fast — creatinine doubled in a day.`(12단어), 3줄 `With kidneys failing that fast, he needs continuous dialysis to control fluid and electrolytes.`
- S19 3↔4 (약함) · `the whole time`이 가리키는 때가 흐림 → 4줄 `Until they arrive, I'll keep monitoring his pressure and lactate.`(3줄의 OR team에 묶음)
- S13 L1 21단어 → `His white count is very low, so even a small infection can become serious fast.`(15단어) / ko `백혈구 수치가 아주 낮아서 작은 감염도 빠르게 심각해질 수 있어요`
- S13 L4 18단어 → `As part of those precautions, please clean your hands and wear a gown and gloves.`(15단어. 손 위생 → 보호구 순서 유지)
- S8 L4 17단어 → `That matters because once the fluid is drained, the infection often gets better faster.`(14단어)
- S15 L4 17단어 → `While we wait for him, please document the pressor doses before we add more.`(14단어)
- S20 L4 16단어 → `Once we know that, the team can help you weigh the options honestly.`(13단어)

### A 몫 참고(B는 고치지 않음)
- 13.4 en은 "가운·장갑 → 손 씻기" 순서로 읽힙니다(CDC 착용 순서는 손 위생이 먼저). order 카드 S13은 맞는 순서입니다. A 메모의 정책 의존 지적과 함께 A가 판단할 일입니다.
- 1.3·2.3 why가 A 메모의 절대 약속(`won't delay`)을 굳힙니다. en을 바꾸면 why도 함께 바꿔야 합니다.
- S9 order 3줄 `until the new one is fully in effect`는 A 메모(9.4 en)와 같은 문제입니다.

## 종합
고칠 것은 **문장 거리 48건**(안전 18: distractorsKo 17 + decoy 1 · 정답 둘 4: 빈칸 1 + decoy 2 + 소리 같은 함정 1 · 말투 14 · 그 밖 distractorsKo 3 · decoy 1 · order 8, A·B 겹침 없이 셈)과 **빈칸 선택지 다시 쓰기 100문장**(표 E)입니다. 안전 18건과 정답 둘 4건, 말투 14건을 고치고 빈칸을 같은 분야 오답으로 바꾸기 전에는 내보내면 안 됩니다. 빈칸은 이 주제에서 시험 구실을 못 하고 있습니다.
