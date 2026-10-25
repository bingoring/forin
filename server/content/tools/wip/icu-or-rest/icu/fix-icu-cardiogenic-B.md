# fix-icu-cardiogenic-B — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-cardiogenic.yaml` (상황 21, 문장 112, order 21장). 전수 덤프: 문장마다 `en | ko | 오답1 | 오답2`, 빈칸 4줄, decoy, order 4줄 인접 교환.
저작자 메모 `notes-icu-cardiogenic-B.md` 없음(판정할 질문 없음).
표기: S상황.문장(0부터), D1/D2 = distractorsKo 첫째/둘째.

## 항목별 점수
1. why — 4/5. 대부분 말투·어순의 이유를 말하고 사실도 맞음. 틀린 설명 2건(S0.5, S4.0), 부정확 1건(S10.3), 오타 1건.
2. 빈칸 — 2/5. 장면과 동떨어진 오답이 약 30문장. 넣어 읽으면 위험한 지시가 되는 선택지 6문장(S9.4·S10.0·S11.0·S12.1·S17.0·S17.2). 정답이 둘인 선택지 6문장.
3. decoy — 2/5. 조립하면 호출 대상·확인 주체·확인 기준·부위가 바뀌거나 처치가 늦어지는 decoy 약 17개. ko에 그대로 맞는 decoy 2개.
4. distractorsKo — 3/5. 되풀이 상한은 통과(최대 5회: 혈당·열). 평상시 문장은 대체로 좋음. 그러나 응급·고위험 문장(12유도, 헤파린, IABP 파열, VT 코드, 출혈)에서 주체·부위·검사·기준을 바꾼 오답이 몰려 있음. 뒤집기(⑤) 5건.
5. order — 3/5. 21장 중 4장은 인접한 두 줄을 바꿔도 자연스러움(S3·S11·S12·S15). 1장은 줄이 15단어를 넘음(S20). 임상 순서는 모두 맞음.
6. tag·icon — 5/5. 모두 10자 이하이고 역할을 말함. 아이콘도 뜻에 맞음.
8. 파일럿 갈래 — 2/5. 갈래 2(장면과 동떨어진 빈칸)가 되풀이되고, "위험한 처치를 오답으로 보이기"(diabetic·deescalation 교훈)도 되풀이됨.

## 심각한 문제 (안전)
- **VT 코드 묶음(S17)**: 빈칸 `sweaty/thirsty/sleepy`와 decoy `and cold`가 들어가면 맥박이 있을 수 있는 환자에게 압박을 시작하라는 문장이 됨. 오답 `방에서/복도에서 물러나세요`는 침대를 비우지 않거나 CPR 재개를 늦춤. `교대 직후 재개`는 충격 직후 압박을 늦춤. decoy `the call`도 같음. `제가/모두 코드를 부르고`는 압박하던 사람을 빼냄.
- **IABP 파열(S15.2)**: D1 "펌프가 멈췄고 지금 의사가 오고 있어요"와 D2 "…지금 의사가 올 거예요"는 의사를 부르는 행동을 지움(잘못된 안심). decoy `the visitors`는 호출 대상을 바꿈.
- **헤파린(S14.0)**: D1 `요청에 따라`, D2 `차트에 따라`, decoy `per request`가 고위험약의 조정 기준인 프로토콜을 바꿈.
- **12유도(S2.0)**: D1 5유도, D2 3유도로 검사를 바꿈(흉통 STEMI 확인 실패).
- **출혈(S18.2·S18.3)**: `그분이/가족이 압박하면서`, `제가 헤파린을 보류하고`는 주체를 바꿈. decoy `her husband`는 호출 대상을, `the room`은 수혈 준비를 대신함.
- **IABP 다리 감시(S9.4·S11.0·S11.1·S11.3)**: decoy `and his arm`·`in that arm`·`your fingers`·`the monitor`, D1 `손가락`이 삽입한 다리 대신 다른 곳을 보게 함. 빈칸 `rarely/sparsely`는 관찰을 줄이는 지시가 됨.

## 고칠 것 — 안전 (24)
1. S0.6 decoy `to the supervisor`: 조립하면 악화 보고를 의사 대신 수간호사에게 하게 됨(호출 대상) → `to the printer`처럼 문법상 들어가지만 보고처가 아닌 조각으로 바꿀 것.
2. S1.0 decoy `against the chart`: 처방 대신 차트와 대조하게 됨(확인 기준) → `for the next bag`.
3. S1.1 decoy `by the pharmacy`: 독립 이중 확인의 주체가 약국으로 바뀜 → `in the med room`.
4. S1.4 D1 "체중을 보며 조절"과 decoy `to his weight`: 강심제 적정 기준이 반응에서 체중으로 바뀜(용량) → D1 "낮은 용량부터 시작해서 반응을 차트에 적을게요", decoy `to his chart`.
5. S2.0 D1 5유도, D2 3유도: 검사를 바꿈 → 앞·뒤 단계로. D1 "지금 바로 12유도 심전도 기계를 가져올게요", D2 "지금 바로 12유도 심전도 전극을 붙일게요".
6. S2.1 D2 "등 통증": 보고하는 부위를 바꿈 → "가슴 통증 기록을 약 10분 전에 시작했어요"(들리는 started·ten minutes를 유지하고 뜻만 바꿈). D1 20분은 보고 세부라 통과.
7. S5.4 decoy `in my notes`: "보고" 대신 기록만 하게 됨 → `to the family`도 호출 대상이 되니 `on the board`처럼 문법상 어긋나는 조각으로.
8. S9.4 빈칸 `briefly/lightly/rarely`와 decoy `and his arm`: 시술 뒤 다리 관찰을 줄이거나 다른 팔다리로 옮김 → 빈칸을 `insertion`으로 옮기고 선택지는 `insertion/injection/incision/infusion`. decoy는 `and the monitor`.
9. S10.0 빈칸 `before`(이른 팽창)와 decoy `the systolic peak`: 위험한 타이밍을 기준처럼 읽게 됨 → 빈칸을 `dicrotic`으로 옮기고 선택지는 `dicrotic/anacrotic/systolic/carotid`. decoy는 `the next breath`.
10. S11.0 빈칸 `randomly/sparsely`와 decoy `in that arm`: 관찰을 줄이거나 다른 팔다리를 봄 → 빈칸을 `color`로 옮기고 선택지는 `color/hair/size/weight`. decoy는 `on the monitor`.
11. S11.1 D1 "손가락"과 decoy `your fingers`: 운동 확인 부위가 삽입한 다리를 벗어남 → D1 "발목을 좀 움직여 볼 수 있으세요?", decoy `your ankle`.
12. S11.3 decoy `the monitor`: 삽입 부위 대신 모니터로 출혈을 보게 됨 → `the dressing tape`처럼 부위를 대신하지 않는 조각으로.
13. S12.0 D1 "좌심실", S12.2 D1 "좌심장", S12.0 decoy `His left ventricle`: 좌우를 뒤집음(⑤이고 부위를 바꿈) → S12.0 D1 "우심실 기능이 저하돼서 전부하 기록이 예민해요"처럼 다른 세부로. S12.2 D1 "수분이 너무 많으면 우심장이 더 늦게 회복될 수 있어요". decoy는 `His blood sugar`.
14. S12.1 빈칸 `allow/order`: "폐동맥압을 올리는 것은 뭐든 허용/처방한다"는 위험한 지시가 됨 → 빈칸을 `pulmonary`로 옮기고 선택지는 `pulmonary/ocular/bladder/dental`.
15. S14.0 D1 "요청에 따라", D2 "차트에 따라", decoy `per request`: 헤파린 조정 기준을 바꿈 → D1 "프로토콜에 따라 ACT를 채혈하고 결과를 기록할게요", D2 "프로토콜에 따라 ACT를 채혈하고 결과를 보고할게요", decoy `the next sample`.
16. S15.2 D1 "펌프가 멈췄고 지금 의사가 오고 있어요", D2 "…지금 의사가 올 거예요": 의사를 부르는 행동이 빠짐 → 참인 이유로 바꿈. D1 "펌프를 멈추는 건 가스가 더 새지 않게 하려는 거예요", D2 "펌프를 멈추고 의사를 부르는 건 풍선이 터져서예요". decoy `the visitors`(호출 대상) → `and charting`(문법상 걸러짐).
17. S15.4 D1 "가족이 올 때까지": 위기 환자를 가족이 오면 두고 떠나는 뜻 → "의사가 올 때까지 바로 여기서 기록할게요".
18. S16.2 decoy `the transport team`: 호출 대상을 바꿈 → `the order set`.
19. S17.0 빈칸 `sweaty/thirsty/sleepy`와 decoy `and cold`: 맥박이 있을 수 있는 환자에게 압박하라는 지시가 됨 → 빈칸을 `VT`로 옮기고 선택지는 `VT/SVT/AF/flutter`(어느 리듬이든 무맥이면 압박이 맞음). decoy는 `He's in bed`.
20. S17.1 D1 "모두 코드를 부르고", D2 "제가 코드를 부르고 카트를 가져올게요": 압박하던 사람이 빠짐(주체) → D1 "누가 코드를 불러야 카트가 빨리 와요"(참인 이유). D2 "누가 코드를 부르고 카트 서랍을 열어 주세요"(다음 단계).
21. S17.2 D1 "방에서 물러나세요", D2 "복도에서 물러나세요", 빈칸 `clean/cover/wipe`(충전 중 침대를 만지게 됨), decoy `the hallway`: 모두 침대를 비우는 일을 빼거나 늦춤 → D1 "200으로 충전하는 동안 압박을 계속하세요", D2 "200으로 충전하고 산소를 침대에서 치우세요". 빈칸은 `Charge`로 옮기고 선택지는 `Charge/Count/Read/Scroll`. decoy는 `Place the pads`.
22. S17.3 D1 "교대 직후 바로 재개"와 decoy `the call`, 빈칸 `page`: 충격 직후 압박을 늦춤 → D1 "충격을 준 직후 기록원은 시간을 적어 주세요", decoy `Note the time`, 빈칸 `page`는 위험하지 않은 말로 바꿀 것. D2 "CPR을 교대하세요"도 주체가 바뀜 → "충격을 준 직후 다음 압박자는 옆에서 대기하세요".
23. S18.2 D1 "제가 헤파린을 보류하고…"(주체, 압박 중인 간호사가 빠짐)와 decoy `the room`(수혈 준비를 대신함) → D1 "헤파린을 보류하면 출혈이 줄어들 수 있어요"(참인 효과), decoy `and draw`(문법상 걸러짐). D2 `수혈 동의서`는 ③이 약함(동의서는 en에서 들리지 않음) → "수혈을 준비하는 건 출혈량이 많아서예요".
24. S18.3 D1 "그분이 압박하면서", D2 "가족이 압박하면서"(주체)와 decoy `her husband`(호출 대상) → D1 "압박하는 건 출혈을 멈추기 위해서예요", D2 "의사를 부르는 건 출혈이 많아서예요", decoy `and charting`.

## 고칠 것 — 정답 둘 (18)
25. S2.2 D1 "T파 변화": T파 변화도 허혈을 시사함(참인 사실) → "허혈을 시사하는 ST 변화가 있는지 출력하고 있어요".
26. S2.4 D1 "이 기록을", D2 "이 보고서를": 바꾼 자리(this)가 들리지 않고, ECG가 곧 기록이라 정답과 같은 뜻 → D1 "이걸 즉시 의사에게 전화로 읽어 줄게요", D2 "이걸 즉시 의사 화면에 띄워 줄게요"(show 자리를 바꿈. 의사에게 바로 가는 것은 그대로).
27. S3.5 빈칸 `long`: slow, long breaths도 맞는 코칭 → `noisy`. decoy `for a while`은 ko(for me 없음)에 그대로 맞음 → `Try to count`.
28. S4.1 decoy `you ate`: "드셨는지"는 먹다·마시다 둘 다라 ko에 맞음 → `you slept`.
29. S5.2 빈칸 `down`: "how far down your legs"도 자연스럽고 임상적으로 성립함 → 빈칸을 `mottling`으로 옮기고 선택지는 `mottling/bruising/rash/redness`. D1 "아래로…내려갔는지"는 방향을 뒤집음(⑤) → "모틀링이 다리 위로 어디까지 올라왔는지 사진을 찍고 있어요".
30. S5.5 빈칸 `wanted`: "not something you wanted"도 이 장면에 맞음 → `measured`.
31. S8.1 빈칸 `comfort`: "We want comfort without overworking…"도 성립함 → `fever`.
32. S9.2 빈칸 `rest`·`break`: IABP는 실제로 심장 부담을 덜어 줌(쉬게 함) → `load`·`strain`(반대 방향). `gift`는 장면과 동떨어짐 → `fluid`.
33. S9.4 D1 "자주 지켜볼": closely와 거의 같은 뜻 → "삽입 부위와 다리를 이후에 사진으로 남길 거예요".
34. S13.0 빈칸 `gently`: slowly와 같은 뜻 → `already`.
35. S13.1 빈칸 `most`: 이탈 중에는 "most of the work"도 맞음 → `none`. D2 "더 많이 쉬고"는 뒤집기(⑤) → "이제 심장이 스스로 더 많은 일을 하는지 볼게요".
36. S20.1 D1 "이삼 일이면": "하루 이틀"과 겹침 → "한 달이면".
37. order S3: 1↔2(앉혀 드림 ↔ 침대 머리 올림)를 바꿔도 자연스러움 → 2줄을 "Now that you're sitting up, I'll raise the head of your bed a little more."로.
38. order S11: 2↔3("Along with that"은 어느 줄 뒤에나 붙음) → 3줄을 "While you do, tell me right away if it feels more numb or painful."로.
39. order S12: 2 "That's why"와 3 "For that reason"이 둘 다 1줄을 가리켜 바꿀 수 있음 → 3줄을 "On top of the fluid, we avoid anything that raises his pulmonary pressures."로.
40. order S15: 3↔4("I'm staying right here until he arrives"가 3줄 앞에 와도 자연스러움) → 4줄을 "While we prepare, I'm staying right here until he arrives."로.
41. order S4: 3줄의 `too`가 어느 줄 뒤에나 붙음 → "Along with your weight, what you drink counts, so can you tell me exactly how much today?"(위 브리프 갈래 3).
42. S14.0 빈칸: 지금 `MRI/UTI/EEG`는 `draw`와 어울리지 않아 걸러짐 → `BMP/ABG/lactate`. **`PTT`·`aPTT`·`anti-Xa`는 쓰지 말 것**(헤파린 조정에 쓰여 정답이 둘이 됨).

## 고칠 것 — 기타
### why
43. S0.5 why: "팀 소식을 계속 전하겠다는 말"은 틀림. `keep the team updated`는 간호사가 팀에 환자 상태를 알린다는 뜻 → "팀에 계속 알리겠다는 말이 더해져, 혼자가 아니라 팀이 함께 보고 있다는 안심을 줘요".
44. S4.0 why: "'to protect your heart'로 이유를 먼저 밝히면"은 틀림. 문장에서 이유는 끝에 옴 → "'to protect your heart'로 이유를 붙이면".
45. S10.3 why: "트리거는 풍선이 부풀 타이밍을 정하는 신호"는 부정확. 트리거는 콘솔이 심장 주기를 알아보는 신호(ECG·압력)이고, 팽창 시점은 따로 맞춤 → 그렇게 고칠 것(문장 en 자체는 A 몫 — 아래 참고).
46. S3.1 why 오타: "a little more은" → "a little more는".

### distractorsKo
47. 뒤집기(⑤): S9.3 D1 "큰 구멍"(small↔큰) → "서혜부의 작은 구멍은 거즈로 덮어 둘 거예요"(다음 단계. 다른 시술로 바꾸지 말 것). S10.0 D2 "사라져야"(come↔사라짐) → "증강은 절흔 직후에 기록돼야 해요". S19.4 D2 "한 명씩 옮길게요"(together↔한 명씩, 이송 안전에도 어긋남) → "제 신호에 맞춰 모두 함께 멈출게요". (S5.2·S13.1은 위 29·35에서 다룸)
48. S9.3 D2 "삽입할 수도 있어요": will↔might만 다르고 뜻이 거의 같음(④) → "서혜부를 먼저 소독하고 삽입할 거예요"(앞 단계).
49. S20.3 D2 "가족에게 가장 중요한 것": 환자의 결정 기준을 가족으로 옮김(25주제 규칙: 결정권을 가져가지 않음) → "이 분에게 가장 중요한 것에 맞는 날을 함께 찾아봐요".
50. S17.4 D2 "모두 맥박을 확인하세요": 코드 중에 주체를 '모두'로 바꿈 → "다시 충전하기 전에 패드를 확인하세요".
51. ③ 약함: S18.4 D1 "교차검사 용지"(용지는 en에서 들리지 않음) → "혈액형과 교차검사를 바로 기록해야 해요".
52. 짧은 오답 없음(25주제 규칙 — 둘 중 하나는 정답 길이 이하): S0.5, S6.1, S16.2, S18.4 → 한쪽을 정답 길이 이하로 줄일 것(S18.2·S18.3·S2.4는 위에서 다시 씀).

### 빈칸 — 장면과 동떨어졌거나 문법·연어로 걸러짐(갈래 2)
53. 아래 선택지를 같은 분야에서 틀린 말로 바꿀 것(위험한 지시가 되지 않게):
   - 걸러짐: S2.0 `ultrasound/X-ray/CT scan`(12-lead와 어울리지 않음 → `ECG/EEG/EMG/echo`). S4.2 `draining/leaking/flowing up`(up과 어울리지 않음 → `drying/clearing/mixing`). S4.1 `daily`(문법). S11.4 `shift/weekend/month`(문법 → `day/week/hour`). S2.3 `barely/randomly`(→ `almost/about`). S11.2 `sleepy/hungry`(주어가 다리 → `warm/ticklish`).
   - 동떨어짐: S0.6 `sheets/curtains/lights`(→ `orders/supplies/visitors`). S1.4 `weekend`(→ `comfort`). S2.1 `head`(→ `stomach`). S2.5 `receipt/ticket`(→ `label/sticker`. `strip`은 정답이 둘이 되니 쓰지 말 것). S3.3 `louder`. S3.4 `time/money/patience`(→ 빈칸을 `Tell`로 옮기고 `Tell/Remind/Ask/Show`). S5.4 `snacks`. S6.2 `appetite/mood/balance`(→ `temperature/sugar/potassium`). S12.2 `noise/light/travel`(→ `potassium/sugar/protein`). S12.3 `vaccination/registration/education`(→ `sedation/nutrition/medication`). S13.3 `secretly/publicly/yearly`(→ `partly/first/nightly`. `quickly`는 위험). S15.0 `cooled/expired/vanished`(→ `kinked/migrated/inflated`). S15.4 `sleeps/eats/resigns`(→ `leaves/calls/decides`). S20.2 `celebration/graduation/invitation`(→ `donation/rejection/registry`).
   - 그 밖에 생활용품 오답: S10.3, S14.3, S14.4, S16.1, S17.1(`lunch/food` → `supply/linen`), S18.2, S18.4, S19.0, S19.1, S19.2, S19.4, S20.3.
54. S19.3 빈칸 answer `cath`는 가르치는 단어가 아님(words: call·ahead·lab·ready) → `ahead`로 옮기고 선택지는 `ahead/back/twice/later`.

### order
55. S20 2줄은 18단어로 15단어를 넘음 → "Even so, we're doing everything we can for him."(1줄과 묶임)으로 줄이고, "next day or two"는 문장 카드에만 둘 것.

## 되풀이 상한 (스크립트)
오답에 있고 정답 ko에 없는 낱말을 조사를 떼고 셈. 5회는 `혈당`(S7.0·S8.0·S12.1·S12.3·S12.4)과 `열`(S7.4·S11.3·S13.0·S14.3·S18.0)로 상한에 걸려 있음. 4회는 의식·체중·맥박·폐. `경보`(3)와 `알람`(2)은 같은 뜻이라 합치면 5. **통과**지만, 위 항목을 고치면서 이 낱말을 더 쓰지 말 것.

## A 몫 / 참고(고칠 것에 넣지 않음 — v44 en·chunks)
- S4.1 en "how much you drink today" → 시제가 맞지 않음("you've had to drink today").
- S10.3 en "adjust the trigger": 이른 팽창은 트리거가 아니라 팽창 타이밍을 조정함(임상 부정확). order S10 3줄도 같음.
- S17.4 en "Check for a pulse before we charge again": AHA는 2분마다 리듬을 확인하고, 맥박은 조직화된 리듬일 때만 확인함 → "Check the rhythm…"이 맞음. why도 같이 고칠 것.
- chunks가 구를 끊음: S0.1 `right / now`, S7.2 `within / the hour`, S10.1 `on / this cycle`.
- S18.1 ko "흠뻑 젖었고 … 흠뻑 젖었어요"가 되풀이됨.

## 종합
고칠 것 55개(그중 안전 24, 정답 둘 18). 평상시 설명 문장은 좋지만, 응급 상황 묶음(S14·S15·S17·S18)과 IABP 다리 감시 묶음에서 오답·decoy·빈칸이 주체·부위·기준을 바꾸거나 처치를 늦춥니다. 안전 24개를 고치기 전에는 내보내면 안 됩니다. 고친 뒤에는 S17·S18만 다시 전수로 볼 것을 권합니다.
