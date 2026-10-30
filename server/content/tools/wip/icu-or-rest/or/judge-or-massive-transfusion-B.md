# Fable 표본 판정 — or-massive-transfusion · B 범위 (v46 1~6·8 + distractorsKo ①~⑥·되풀이 상한)

독립 전수 검토. 126문장 전부를 스크립트로 뽑아(`en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy를 청크 자리마다 넣은 조립,
order 인접 교환) 한 줄씩 판정했다. fix-*.md는 열지 않았다. 기계 검사 `verify_one_theme.py or` 는 통과 상태.
문장 번호 [n]은 파일 순서(1~126), S는 상황 번호.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1. why | 4 | 말하는 방식(어순·조동사·관용구)의 이유를 말하고 ko 되풀이 없음. 사실 오류 못 찾음. |
| 2. 빈칸 | 2 | 장면과 동떨어진 오답이 약 45문장(아래 목록). 위험 처치를 보이는 오답 2건([20][60]). 관사·문법으로 걸러지는 것 3건. |
| 3. decoy | 3 | 대부분 조립해도 ko와 다른 문장. 그러나 위기 문장에서 인슐린만 남기는 조립([98]), 판단 기준 바꾸기([19]), 처치→준비([22]) 등 4~6건. 빈칸 보기와 같은 decoy 10문장. |
| 4. distractorsKo | 2 | **57문장에서 오답 둘 다 "~하려고/~하러/~하도록 + 준비 동작" 틀** — 정답에 없는 틀이라 모양으로 걸러짐(① 틀 유지·③ 들리는 자리 실패). 정답 둘 11문장, 잘못된 안심 1건, 되풀이 상한 초과 낱말 7개. |
| 5. order | 4 | 임상 순서는 전부 맞음(S16 용혈·S17 고칼륨·S19 TRALI·S21 TACO 포함). 바꿔도 자연스러운 교환 3장, 15단어 초과 1줄, 말 거는 상대가 어긋난 카드 1장. |
| 6. tag·icon | 4.5 | 태그가 문장 역할을 말하고 10자 이하. [93] "라인 유지"에 pager 아이콘만 어긋남. |
| 8. 파일럿 갈래 | 2 | 동떨어진 빈칸 오답(파일럿 2번)이 그대로 되풀이. 되풀이 상한(10-10)도 넘음. order 임상 순서는 양호. |

## 과제에서 특별히 보라고 한 것 — 결과

- **제제·비율·속도·가온·칼슘을 다른 것으로 바꾼 오답**: 없음(오답 ko는 처치를 바꾸지 않고 준비 동작으로 미룸 — 그게 다른 문제).
- **호출·보고 대상 바꾸기**: 없음. 약사·팀장·의사로 올린 오답 없음. [76] decoy "The scrub says"는 보고자(전하는 사람) 변경이라 허용.
- **처치 시점·처치 지연**: 오답 ko 자체는 정답 동사를 종속절(`~하려고`)에 남겨 10-29 규칙의 글자는 지켰다. 지연은 decoy·빈칸 쪽에서 남 — [22] decoy, [77] decoy, [45][105] decoy(재확인 탈락), [36] decoy(조건부 보고).
- **준비 동작으로 바꾸기**: 글자는 지켰으나 57문장이 같은 틀이라 모양으로 걸러짐(아래 심각 1).
- **두 사람 확인(S2)**: 순서·문장 모두 맞음. "셋 다 서명"([9][6] DK1)은 both가 들리는 자리라 적절.
- **오답 둘이 같은 표지 틀**: 57문장(둘 다 `~려고/~러/~도록`). 둘이 거의 같은 말인 쌍 10문장(아래).
- **동떨어진 빈칸 오답**: 약 45문장(아래 목록).

## 심각한 문제

1. **오답 ko 틀 — 57문장에서 오답 둘 다 "정답 동사+려고/러/도록, 준비 동작"** (한쪽만 그런 문장 9 더해 66문장).
   정답은 평서·청유·명령인데 오답 둘만 목적절 틀이라 듣지 않고 모양으로 걸러진다(TASK 10-28 실패 2·5번과 같은 꼴).
   또 바뀐 자리(준비 동작)는 영어에 없어 ③ 실패. 10-29 "정답 동사를 종속절에 남기기"는 지켰으므로 처치 바꿔치기는 아니다 — 틀의 문제.
   해당: [2][3][7][8][10][11][13][16][17][19][21][22]¹[23][24][26][27][29][31][32][33][35][36][37][39][41][45][46][48][50][51][52][53][55][57][59][60][65][66][67][69][71][75][77][79][81][82][84][85][86][87][89][90][95][98][101][105][108][113][114][119][120][123][125][126]¹ (¹는 한쪽만).
   고치는 방향: 같은 틀·같은 길이로 세부 하나만 바꾸기(물건·횟수·시각·장소), 또는 처치가 하나뿐인 문장은 참인 다른 이유·바로 앞/뒤 단계를 정답과 같은 어미로.
2. **안전 — 빈칸·decoy·오답 ko가 해로운 말을 보임 (7건)**: 아래 "고칠 것 A".
3. **정답 둘 (11문장)**: 참인 사실·정답 행위를 품은 오답. "고칠 것 B".
4. **되풀이 상한 초과**: 오답 전용 낱말을 어간으로 정규화해 세면 7낱말이 5회를 넘는다(W19는 통과 — 검사기 어간 처리가 이보다 느슨함). "고칠 것 C".
5. **동떨어진 빈칸 오답 약 45문장** — 파일럿 2번 그대로. "고칠 것 D".

## 고칠 것

### A. 안전 (7)
- [20] S4 빈칸 · `We can slow it if the numbers [worsen]/[drop]` — 수치가 나빠지면 늦춘다는 위험 지시가 보임 · 빈칸을 `slow`로 옮기고 보기 slow/warm/label/count.
- [60] S10 빈칸 · `Platelets go in as soon as they [expire]` — 유효기한 지난 혈소판 투여 · expire → `thaw`(혈소판은 해동 안 함, 같은 분야 오답)·`spin`·`settle`.
- [98] S17 decoy `and a blanket` · 조립 "Let's give calcium, insulin, and a blanket" — 포도당 없이 인슐린만 남는 지시 · decoy를 `and a warmer`처럼 칼슘 자리 대체가 아닌 것으로 바꾸거나 `in that order`.
- [91] S16 DK2 "반응이 곧 줄어요" · 즉시 중단 대신 잘못된 안심, 틀도 다름 · "즉시 수혈을 기록하세요"처럼 같은 틀·같은 길이로.
- [19] S4 decoy `to the room temperature` · 조립 "Let's adjust the rate to the room temperature" — 판단 기준을 바꾼 완성 문장 · `to the next unit`처럼 기준이 아닌 조각으로.
- [22] S4 decoy `let's set it up` · 조립 "The pressure is dropping, so let's set it up" — 혈압 떨어지는데 준비로 미룸. DK2 "출혈이 심하다는 뜻이에요"도 처치를 해석으로 바꿈 · decoy `let's log it`(아님, 지연)보다 `so the surgeon says` 같은 보고 조각; DK2는 "혈압이 떨어지고 있어요. 수액을 올립시다" 식 같은 틀 옆 처치는 정답 둘이므로 "혈압이 떨어지고 있어요. 속도를 적읍시다"처럼 임상 무관 동사로.
- [58] S10 decoy `and some` · 조립 "We don't want all red cells and some plasma" — 비율 원칙을 뒤집는 완성 문장 · `and no coolers` 같은 명사 조각으로.

(참고, 경미) [96] 빈칸 `watch [idly]/[vaguely]` — 용혈 장면에서 방치 어감(W21 취지). [36] decoy "if anyone asks" — 조건부 보고. [45][105] decoy `and restock` — 재확인 탈락. [77] decoy `after this meeting` — 응고검사 지연.

### B. 정답 둘 (11문장)
- [14] DK2 "차가운 혈액은 환자의 응고를 방해할 수 있어요" — 참(저체온 응고장애). [18] DK1·2도 참에 가까움.
- [44] DK1 "시트르산염이 응고를 막고 있어요"·DK2 "보존에 쓰이고 있어요" — 둘 다 참(항응고 보존제).
- [46] DK1 "다시 확인하려고 채혈할게요" — 재확인의 실제 방법(정답 행위를 품음).
- [47] DK1 "근육을 떨리게"·DK2 "손발 저림" — 저칼슘의 참인 증상.
- [58] DK1 "피가 묽어질 수 있어요"·DK2 "응고가 떨어져요" — 그 문장을 말하는 이유 그대로.
- [76] DK1 "축축해서 걱정한다고 해요" — 정답 + 하나 더.
- [78] DK1 "혈장을 더 주면 응고인자가 보충돼요" — 참인 이유.
- [91] DK1 "수혈을 멈추면 반응이 줄어요" — 정답 행위 + 참인 효과.
- [93] DK1·2 — 생리식염수의 참인 이유 둘, 둘 다 "혈액은행 전화"를 뺌.
- [100] DK2 "칼륨이 높을 때 흔히 나타나요"(DK1도 참) — 긴급 판단을 뺀 참 사실.
- [104] DK1 "보관한 피가 굳지 않게 하는 성분"·DK2 "빠르게 쌓일 때 생겨요" — 둘 다 참.

(낮은 심각도 — 틀을 버리고 교과서 설명으로 바꾼 오답, ① 위반이나 어미로 걸러짐) [56][62][64][74][83][92][97][99][103][106][109][110][111][112][116][117][118][121][122][126]DK1.
(경미) [25] DK1 "쿨러에 담겨 왔어요"는 정답과 양립. [63] 빈칸 `closed`·[95] `right here`는 말이 되는 문장. [47] decoy `the pump`는 심장 속어.

### C. 되풀이 상한 (오답 전용 낱말, 어간 정규화·수작업 분리)
| 낱말 | 회수 | 문장 |
|---|---|---|
| 보다(보이다 제외) | 16 | 8×2·10·11·19×2·21·22·23·24·27×2·81·99·101·109 |
| 팩 | 8 | 6·8·11·26·27·29·40·60 |
| 닦다 | 8 | 6·15·35×2·46·60·79·101 |
| 켜다 | 8 | 11·13·17·31·33·50·67·71 |
| 꺼내다 | 7 | 2·9·32·75·77·84·85 |
| 쓰다(쓰이다·착용 포함, 소리 같음) | 7 | 7·10·44·89·98·115·118 |
| 펴다 | 6 | 13·37·57·86·119×2 |
상한(5)에 걸친 것: 들다 5(8·65·95·113·120), 두다 5, 표 5, 번호 5, 챙기다 5, 약 5. 1번을 고치면 대부분 함께 풀린다.

### D. 빈칸 오답이 장면과 동떨어짐 (약 45문장) — 같은 분야의 틀린 말로
[2] clock/map/scale · [11] billing/invoice/holiday(→ collection/issue/order date) · [13] sink/scale · [14] height/weight/language · [16] chair · [17] brightness/language · [18] leg/hand/knee · [19] light/chair/sheet · [24] ticket/schedule · [32] height/mood · [35] height/age/language · [39] painted · [42] clock/wall/crowd · [47] skin/hair/nail · [48] shift/visit/form · [51] dust/paint · [53] ticket/menu/schedule · [59] lid/wheel/handle · [67] yawning/humming/laughing(rash/chills/hives는 실제 반응 징후라 정답 둘 — 징후가 아닌 몸 증상 hiccups/thirst/snoring으로) · [69] visitors/lights/doors · [70] poster/badge/wall · [73] loud/cold · [75] scales/wheels · [77] hide/paint/fold · [78] noise/smell/glare · [79] file/trim/stamp · [80] leaking/melting · [81] blame/rename/frame · [82] paint/bury/weigh · [85] labels/bags/slips · [87] trim/tear/trade(소리만 닮음) · [90] crate/slot/shelf · [91] conversation/music/session(→ warmer/suction/timer) · [99] label/door/window · [101] rewrap/retire/reboot · [105] restock/rename/retype · [106] crate/badge/plate · [108] restate/resize/rewrite · [110] round/break/conference · [111] recycle/reheat/refund · [113] stand/pole/badge · [114] schedule/bill/menu · [117] archive/audit/annotate · [119] rename/rewind/retire · [122] elevator/meeting/break · [123] reorder/refresh/reboot · [125] reroute/rewire/repaint.
re- 접두사 돌려쓰기([101][105][108][119][123][125])는 소리만 닮은 오답(10-28 6번).
- 관사·문법으로 걸러짐: [65] `for an refund`/`an receipt`, [62] `need any plasma`·`need no plasma`, [84] `round the numbers to the team`.
- 잘 된 것: [7][8] bed/room(식별자 아님), [97] flat T-waves, [104] kidney/lung/liver, [109] facial/ankle/scalp, [37] albumin.

### E. order (5)
- S11 2줄 "At that count, we may need more plasma soon, so please keep the next cooler ready." — 16단어(상한 15) · 둘로 줄이기.
- S11 · 1줄은 혈액은행에 직접 묻는데 3줄 "Let's call the blood bank" — 말 거는 상대가 어긋남 · 1줄을 동료에게 묻는 말로("How many units of O-neg do we have left?").
- S4 3↔4 · "I'll recheck the pressure five minutes after that." → "Once the numbers settle, we can slow it down." 바꿔도 자연스러움 · 4줄을 "After slowing it, I'll recheck…"로 3줄 전제.
- S12 3↔4 · "Tell me right away if vitals shift." → "With those signs in mind, let's watch the urine color…" 바꿔도 자연스러움 · 4줄에 "while we watch it"처럼 3줄 가리키는 말.
- S18 2↔3 · "We need calcium in the line right now." → "That's from the citrate load…" 바꿔도 자연스러움 · 3줄을 "So we need calcium…"으로 2줄 전제.
(확인함, 문제 없음) S9 3↔4는 "it helps"가 고정, S10 2↔3은 "They"가 고정, S16·S17·S19·S21 임상 순서 맞음.

### F. decoy·기타 (경미)
- decoy가 빈칸 보기와 같음(같은 오답을 두 문항에서 봄): [2] clock · [5] tray · [75] tubes · [78] noise · [95] right here · [104] kidney function · [105] restock · [111] recycle it · [120] blood drive · [123] reboot.
- decoy 낱말 돌려쓰기: pole [23][29][70], lab [44][46][103].
- 동떨어진 decoy(소리·엉뚱): [92] dark roast · [115] two stools · [118] bedsheets · [122] lunch · [91] the transfer · [85] invoices · [57] budget.
- 오답 둘이 서로 거의 같은 말(둘 중 하나만 보고 걸러짐): [24] 커프×2 · [35] 체온계 닦읍시다×2 · [52] 살핍시다×2 · [57] 표×2 · [69] 쥐세요×2 · [106] 라인/정맥 약 · [108] 솜×2 · [113]·[65]·[95]·[120] 수화기/번호 · [119] 폅시다×2.
- 부자연스러운 한국어: [1] DK2 "농축적혈구 차죠?" · [16] DK2 "거치려고 나와요" · [73] DK1 · [81] DK1 "교정하려고 봅시다" · [112] DK2 "폐는 가슴 안에 자리해요" · [124] DK2 · [5] DK2.
- [93] icon pager → 라인 아이콘(IV 계열)으로.

## 종합
why·tag·order의 임상 흐름은 내보낼 수준. 그러나 **오답 ko는 57문장이 같은 목적절 틀이라 사실상 전면 재저작**이 필요하고(되풀이 상한도 그 틀 때문에 넘음),
빈칸 오답 약 45문장은 같은 분야의 틀린 말로 바꿔야 한다. 안전 7건·정답 둘 11건은 반드시 고친 뒤 내보낼 것.
고칠 것 합계(문장 단위, 중복 제외) 약 110문장 — 그중 **안전 7 + 정답 둘 11 = 18건**.
