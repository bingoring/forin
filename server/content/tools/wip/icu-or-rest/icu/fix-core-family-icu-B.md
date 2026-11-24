# core-family-icu — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥·되풀이 상한)

대상: `core-family-icu.yaml` (21상황 · 문장 129 · order 21). 검사기 `verify_one_theme.py icu` 통과 상태에서 내용만 봄.
스크립트: `_revB_core-family-icu.py` (`sent` = en|ko|오답 둘|why|빈칸 넷|decoy 자리마다 넣어 읽기, `order` = 인접 교환 전부, `stats`).
출력: `_revB_core-family-icu_sent.txt`, `_revB_core-family-icu_order.txt`. 상황·문장 번호는 0부터(`15.5` = 상황 15 문장 5).

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 사실 오류 없음. ko 되풀이 4곳, 16.3 "한정된 허락"은 잘못된 풀이 |
| 2 빈칸 | 2 | 장면과 동떨어진 오답 묶음을 돌려 씀(tall/rich/famous, thirsty/hungry/sleepy, pay/sell/sleep — 각 3회로 W18 바로 아래). 정답 둘 6건(3.3 silly·foolish, 12.4 angry, 9.5 votes, 20.0 trouble, 6.2 privately, 3.1 repeat), 해로운 그림 2건(11.0 cutting, 15.2 awake), 철자만 닮은 묶음(0.0 bed-) |
| 3 decoy | 3 | 장소 구는 11/129로 몰리지 않음. 그러나 ko에 맞는 다른 문장이 되는 것 5건(3.0·5.1·12.3·15.2·16.0), 반대말 1(8.0), 끊긴 조각 1(9.4), `room` 6회 |
| 4 distractorsKo | 3 | 조건·목적 표지 몰림 0. 그러나 임종 상황 15.0·15.1·15.5에서 가족 방문을 끌어들이거나 처치를 바꿔치기, 16.4 위기 호출을 준비 동작으로 바꿈, 18.2 판단 기준을 가족 이익으로 옮김. 정답 둘 3.0·2.2 |
| 5 order | 3 | 21장 중 4장 인접 교환이 자연스러움(0·7·11·19) |
| 6 tag·icon | 4 | 태그 일관. 15.5 `siren`이 임종 사실 전달에 안 맞음 |
| 8 파일럿 갈래 | 2 | 빈칸 오답이 장면 밖(swim·bath·cooking·coffee·vacation)이거나 문법으로 걸러짐(ask/guess out, Pay/Call you, what annoyed most to him) |

## 숫자로 본 것
- **오답 둘에만 조건·목적 표지(~려고·~도록·~기 전에·~면·~후에·~뒤에)가 붙은 문장: 0건.** 한쪽에만 붙은 문장 1건(8.1 "대화한 뒤에").
- **오답 둘 다 정답 ko보다 긴 문장: 3건** — 3.0(29: 30·31), 8.2(28: 32·29), 16.4(25: 28·26). 아래 새 값이 모두 하나를 정답 길이 이하로 만든다.
- 길이 차 6자·1.29배: 16.2 x2(27→21).
- **decoy 모양:** 절·기타 57 · 전치사구 30 · 명사구 30 · to부정사 12. 한 낱말 decoy 14개. 장소 구 11개(0.1·1.5·2.2·5.2·8.6·10.4·11.0·14.2·14.3·20.5·20.6) — 몰림 아님.
- **decoy 낱말 몰림:** `room` 6(0.1·1.1·6.2·8.6·11.0·20.6, `in the room` 두 번), `home` 4(0.5·4.1·5.2·20.5, `at home` 두 번), `doctor` 4(6.1·7.1·8.1·9.0), `he moved`/`if he moved` 이웃 문장(7.3·7.4).
- **decoy가 그 문장 빈칸 오답과 같은 낱말: 13건**(1.0·7.5·8.5·9.1·11.2·12.0·13.1·16.5·18.5·19.3·19.5·20.0·20.2) — 규칙 위반은 아니나 같은 오답 낱말이 두 문항을 훈련함. 고칠 때 줄이면 좋음.
- **되풀이(오답에만 있는 어간, 주제 상한 5):** 상위 5 — 물을 5 · 시간 5 · 드릴 4 · 서류 4 · 설명 4 (그 밖 4회: 일정·질문·보험·정리). 상한 넘김 0. 단 `물을` 5회는 전부 "시간을 가지세요 → 물을 드세요/마시세요" 같은 틀(0.5·8.5·16.1·20.1·20.3)이라 낱말만 보고 걸러짐 → 둘을 바꿈(아래 36).
- 빈칸 오답 3회 쓴 낱말 15개(unusual·noise·sleepy·bored·hungry·tall·lost·print·form·cheap·early·angry·thirsty·pay·thank) — 전부 W18(4회) 바로 아래.

## 심각한 문제
1. **15.5 오답 둘** — "방문으로 이걸 되돌릴 방법은 더 이상 없어요"는 임종 고지에서 가족의 방문을 실패한 치료처럼 놓는다(방문 탓으로 읽힘). "수술로 …"는 처치를 다른 처치로 바꿔치기했고, 간호사가 특정 치료가 무익하다고 단정하는 말이며, 치료의 일부라 참에 가깝다.
2. **15.0 x2 "방문에 반응하지"** — 같은 틀. 가족 방문이 소용없다는 말로 들림.
3. **16.4 오답 둘** — 급성 비탄 위기에 "지금 부르기"를 "연락처를 드릴 수"(준비 동작)·"편지를 쓸 수"(대체 행동)로 바꿈. 그 순간 정답 행동 대신 하는 일.
4. **18.2 x1 "당신에게 가장 이로운 방향으로"** — 대리결정 기준(환자 최선 이익)을 가족 이익으로 옮김.
5. **11.0 빈칸 `cutting his lips`**, **15.2 빈칸 `keep him awake`**(임종 환자) — 오답이라도 가족에게 해로운 돌봄을 보임.
6. **15.1 x1 "밤의 마지막에"** — 엉뚱해서 듣지 않고 걸러지고, "오늘 밤을 넘기기 어렵다"는 사망 시각 예측으로도 읽힘.

## 고칠 것

### 안전 (8건)
1. **15.5 distractorsKo 둘** · 방문 탓 / 처치 바꿔치기·무익 단정 · 이 문장은 안전한 한 칸 바꾸기가 거의 없음. 비임상 수단·비임상 동사로:
   `["말로 이걸 되돌릴 방법은 더 이상 없어요.", "치료로 이걸 설명할 방법은 더 이상 없어요."]`(24·24). 이것도 어색하다고 보면 수정 담당은 고치지 말고 부르는 쪽에 돌려 주세요.
2. **15.0 x2** "…방문에 반응하지…" → `"정말 뜻밖이지만 — 그의 몸이 더는 치료에 반응하지 않고 있어요."`(36, sorry가 들리는 자리. x1 37이라 하나를 36 이하로)
3. **15.1 x1** "그가 밤의 마지막에…" → `"그가 삶의 마지막을 생각하고 있다고 저희는 보고 있어요."`(32, nearing이 들리는 자리. x2 33이라 하나를 32 이하로)
4. **16.4 distractorsKo 둘** · 호출을 준비 동작·대체 행동으로 바꿈 · 정답 동사를 종속절에 남긴 앞 단계와 참인 이유로:
   `["지금 가족분이나 원목님을 부르기 전에 여쭤볼게요.", "지금 가족분이나 원목님이 곁에 있으면 좋아요."]`(26·24 — 하나가 정답 25 이하). 부를 사람은 바꾸지 않음.
5. **18.2 x1** → `"그에게 가장 이로운 방향으로 결정하도록 윤리위원회를 기다릴게요."`(involve가 들리는 자리, 기준 유지)
6. **11.0 빈칸** `cutting` → `covering`
7. **15.2 빈칸** `awake` → `waiting`
8. **12.1 x1** "상태가 복잡하고" · serious를 낮춰 잘못된 안심 · → `"결과가 심각하고, 앞으로 며칠이 고비예요."`(23, condition이 들리는 자리)

### 정답 둘 (13건)
9. **3.0 x1** "뭐든 알려 주세요" · ask↔tell은 둘 다 가족에게 말을 청하는 맞는 말 · → `"뭐든 물어보세요 — 그러려고 제가 전화한 거예요."`(26, here가 들리는 자리. 오답 둘 다 길던 것도 해결)
10. **3.0 decoy** `I'm paid for` · "that's what I'm paid for" = ko에 가까운 뜻 + 돈 받는 일이라는 차가운 말투 · → `the chart is for`
11. **3.3 빈칸** `silly`·`foolish` · "No question is too silly/foolish to ask"는 그대로 맞는 관용구 · → `costly`·`formal` (`hard`는 둠)
12. **12.4 빈칸** `angry` · "hope and be angry at the same time"도 이 장면에서 맞는 허락 · 셋을 `rude`·`loud`·`late`로(sleepy·thirsty도 장면 밖)
13. **9.5 빈칸** `votes` · "family votes on one point of contact" ≈ agrees · → `waits`
14. **20.0 빈칸** `trouble` · "sorry for your trouble"은 실제 조의 표현 · → `bill`
15. **15.2 decoy** `her` · "you can be with her"가 성별 없는 ko "곁에 계실 수 있어요"에 그대로 맞고, 대명사 한 낱말 조각이라 모양으로도 걸러짐 · → `the chaplain`
16. **16.0 decoy** `for him` · "I'm here for him"이 ko "제가 곁에 있어요"에 맞음 · → `for the night`
17. **12.3 decoy** `easily` · "No one can predict easily how this will go" ≈ ko · → `publicly`
18. **12.3 x1** "언제 될지는" · how/when은 약하게 들리고 "언제인지 아무도 모른다"도 참 · → `"이게 정확히 어떻게 될지는 아무도 보여 드릴 수 없어요."`(predict가 들리는 자리. x2가 정답 길이라 길이 규칙 유지)
19. **6.2 빈칸** `privately` · 가족 회의에서 "go over his condition privately"도 성립 · → `later`
20. **3.1 빈칸** `repeat` · "Let me repeat that in a way that makes sense"도 자연스러운 말 · → `copy`
21. **2.2 x1** "오른쪽 방향" · 영어는 같은 right — 들어서 못 가르는 말장난(③) · → `"첫 걸음이지만, 옳은 방향으로 가고 있어요."`(small이 들리는 자리)

### distractorsKo 그 밖 (①~⑤) (14건)
22. **0.4 x2** "…방식의 전부예요" · 일부↔전부 반대말(⑤) · → `"소리와 불빛은 저희가 서로 연락하는 방식의 일부예요."`(30)
23. **1.2 x2** "이 중 몇 가지를" · all↔some은 뒤집기에 가깝고 덜 지켜본다는 말 · → `"제가 이 모든 걸 밤새 꼼꼼히 지켜보고 있어요."`(for her가 들리는 자리)
24. **3.1 x1** "연습해 드릴게요" · 어색한 한국어라 걸러짐 · → `"이해되실 만한 방식으로 적어 드릴게요."`
25. **3.3 x2** "못 들어볼 질문" · 비문 · → `"너무 사소해서 못 답할 질문은 없어요."`
26. **3.5 둘** · x1 "외우셔도" 어색, x2 "필요한 만큼 한 번만" 모순·뒤집기 · → `["같은 질문을 필요한 만큼 몇 번이든 적어 오셔도 돼요.", "같은 질문을 오늘 안에 몇 번이든 물어보셔도 돼요."]`(31·28)
27. **5.0 x1** "말씀하시는 건 조금 이해할 만해요" · 두 군데를 바꿨고 "조금"이 공감을 깎음 · → `"이렇게 말씀하시는 건 정말 이해할 만해요."`
28. **8.2 x2** "필요하면 한 번만 멈출 수" · 제한·뒤집기 + 오답 둘 다 긴 문장 · → `"천천히 하세요 — 필요하면 언제든 나갈 수 있어요."`(28)
29. **8.6 x2** "조금만 괜찮아요" · 비문·축소 · → `"오늘 밤 어떤 감정이든 다 괜찮아요."`(right now가 들리는 자리)
30. **9.1 x1** "법적 순서를 확인해요" · follow의 바로 앞 단계라 뜻이 겹침 · → `"그렇지 않다면, 저희는 대리결정자에 관한 병원 순서를 따라요."`(legal이 들리는 자리)
31. **9.4 x1** "그다음이 서류예요" · 엉뚱해서 걸러짐 · → `"보통 배우자가 먼저고, 그다음이 부모님이에요."`(25)
32. **17.1 x1** "…정리해 봐요" · 바꾼 "생각해"는 영어에 없는 말(③) · → `"그가 걱정했을 것을 중심에 두고 생각해 봐요."`(wanted가 들리는 자리)
33. **19.4 x1** "슬프시는 거" · 비문 · → `"슬퍼하시는 거 당연해요 — 저라도 똑같이 느꼈을 거예요."`
34. **16.2 x2** "조용한 공간과 담요를" · 6자 짧아 길이로 걸러짐 · → `"조용한 공간과 연락할 전화를 마련해 드릴게요."`(25)
35. **10.4 x2** "같은 노래를" · 엉뚱 · → `"같은 규칙을 듣도록 모두 함께 모여요."`

### 되풀이 틀 (1건)
36. **`물을` 틀 5회** · 16.1 x1 → `"잠시 눈을 감으세요; 억지로 견딜 필요 없어요."`(26), 20.3 x1 → `"잠시 앉아 계세요 — 아무 말 안 하셔도 괜찮아요."`(28). 0.5·8.5·20.1은 둠(3회).

### 빈칸 (장면 밖·문법으로 걸러짐·철자만 닮음) (29건)
37. 0.0 `bedroom/bedrail/bedframe`(철자만 닮음, "at her bedroom" 전치사로 걸러짐) → `doorway`·`window`·`desk`
38. 3.2 `ask/guess/read` + out(구동사 문법으로 걸러짐) → answer를 `find out`으로, 오답 `sign out`·`log out`·`step out`
39. 4.0 `hunger`·`sunlight` → `pressure`·`falls` (`noise` 둠)
40. 4.1 `wave`·`clap` → `warm`·`check` (`dry` 둠)
41. 4.2 `tired/sleepy/bored` → `apart`·`waiting`·`busy`
42. 5.3 `hungry/proud/bored` → `rude`·`done`·`polite` (`ready`·`quiet`는 이 장면에서 맞는 말이 되니 피함)
43. 5.5 `eating/wearing/cooking` → `deciding`·`signing`·`planning`
44. 6.1 `seen` → `filmed` (paid·fed 둠)
45. 6.3 `hurts/waits/fails`(2.4와 같은 묶음, "It waits to write" 비문) → answer를 `before`로, 오답 `after`·`during`·`without`
46. 7.0 `hurt/annoyed/bored`("what annoyed most to him" 비문) → answer를 `life`로, 오답 `work`·`school`·`sports`
47. 7.2 `photos/clothes/keys` → `labs`·`scans`·`bills`
48. 7.3 `tall/rich/lost` → `married`·`older`·`promoted`
49. 7.4 `rich/tall/famous` → `old`·`tired`·`lonely`
50. 9.3 `beds/meals/coffee` → `calls`·`copies`·`payments`
51. 9.4 `pays/sleeps/drives`(9.0·9.5와 같은 pay/sleep 묶음) → `arrives`·`leaves`·`visits`
52. 10.3 `vacation`·`promotion` → `report`·`review` (`refund` 둠)
53. 10.4 `song/joke/lesson` → `rumor`·`question`·`complaint`
54. 10.5 `tall/famous/early`(감정·비난 형용사는 무엇이든 정답이 됨) → answer를 `hopes`로, 오답 `doses`·`rooms`·`shifts`
55. 12.2 `cooking` → `billing`
56. 12.5 `rarely/never/seldom`(셋 다 정답 부정 — 모양으로 걸러짐) → answer를 `know`로, 오답 `hide`·`owe`·`bill`
57. 13.3 `proud/hungry/thirsty`(감정어는 무엇이든 정답) → answer를 `normal`로, 오답 `rare`·`unusual`·`dangerous`
58. 14.0 `game/lesson/rental` → `monitor`·`recording`·`tour`
59. 16.5 `weather`·`food` → `pain`·`medication` (`noise` 둠)
60. 18.0 `Pay/Call/Phone`(문장 첫머리, "Call you for…" 비문) → answer를 `here`로, 오답 `late`·`quiet`·`away`
61. 18.1 `rumor`·`song` → `schedule`·`budget` (`habit` 둠)
62. 19.0 `thirsty/hungry/sleepy` → `leaving`·`done`·`early`
63. 19.5 `menu/map/game` → `bill`·`schedule`·`map`
64. 20.3 `form/bath/photo`(take a bath — 사별 장면에서 우스움) → `number`·`form`·`ticket`
65. 20.5 `run/sing/swim`(사별 장면에서 swim) → `leave`·`travel`·`drive`
- 위 바꿈 뒤 W18(같은 빈칸 오답 4회 이상)을 다시 돌려 주세요 — `late`·`busy`·`bill`·`done`이 몰릴 수 있음.

### decoy (9건)
66. 5.1 `in silence` · "go through this in silence" ≈ ko(혼자 겪지 않으셔도) · → `by tonight`
67. 8.0 `alone` · together의 반대말 · → `in the hallway`
68. 9.4 `, while` · "comes first, while adult children." 끊긴 조각 · → `, unlike`
69. 14.1 `his boss` · 어느 청크 자리(`so his son can`)에도 안 맞아 모양으로 걸러짐 · → `so the chaplain can`
70. 20.1 `they need` · "Take all the time they need"가 주어 없는 ko에 맞을 수 있음 · → `you missed`
71. 19.5 `the menu`(빈칸을 바꾸면) → `the TV`
72. `room` 6회 → 11.0 `with room service` → `with the paperwork`, 6.2 `his room` → `his bill`, 20.6 `in the room` → `for the team`
73. `home` 4회 → 20.5 `at home` → `on the phone`
74. 7.4 `if he moved`(7.3 `he moved`와 이웃) → `if he retired`

### order (4건)
75. **상황 0** · 3 "Once you're inside…" ↔ 4 "Before you go in…"을 바꾸면 시간 순서가 오히려 자연스러움 · 줄 순서를 `walk through → monitors normal → Before you go in, take all the time you need → Once you're inside, you can talk to her and hold her hand`로 바꾸고 why를 "…정상임을 말한 뒤, 들어가기 전에 시간을 주고, 들어가서 할 수 있는 일을 알려 주며 마무리해요"로.
76. **상황 7** · 1 "There's no wrong answer — tell me about him…"과 2 "What kind of person…"을 바꿔도 자연스러움 · 1줄을 `First, there's no wrong answer — I just want to understand him better.`로.
77. **상황 11** · 2 "For example…"과 3 "In the same way…"는 둘 다 예시라 바뀜 · 3줄을 `While you do that, talking and reading to him really does help.`로.
78. **상황 19** · 3 "Nothing is being hidden…"과 4 "To start, let me pull up the chart…"가 바뀜 · 4줄을 `To show you, let me pull up the chart so we can look at it together.`로.

### why·tag·icon (4건)
79. 16.3 why "right now가 지금 이 순간에 한정된 허락임을" · 허락이 시간 한정이라는 잘못된 풀이 · → "right now로 지금 이 순간의 반응을 있는 그대로 받아 준다는 뜻이에요."
80. why가 ko를 되풀이 · 3.5("…같은 질문을 반복해도 된다고 허락해요"), 10.5, 11.4("작은 일은 없다는 뜻이에요"), 17.4 · 말하는 방식의 이유로(예 3.5: "You can으로 허락을 먼저 주고 as many times as you need로 횟수를 가족에게 맡겨요. 같은 질문을 미안해하지 않게 해요.").
81. 15.5 icon `siren` · 임종 사실 전달에 경보 아이콘 · → `faceWorried`
82. 20.5 icon `home` · "집에 가라"로 읽힘 · → `handshake2`

## 판단을 부탁받은 곳 (저작자 메모)
- **15·16·20 비임상 낱말·대명사만 바꾼 오답:** 대명사 바꾸기(15.0 x1 his→그녀의, 1.2 x1, 2.0 x2)는 **통과(한계)** — his/her·him/her는 영어에서 들리고(강세가 약해 어렵긴 함) 상황 안 환자 성별이 정해져 있어 정답 둘이 아님. 다만 안전한 내용 자리가 없을 때만 쓰고 한 문장에 하나까지. "치료→방문"(15.0 x2·15.5 x1)은 **실패**(가족 방문을 치료처럼 놓아 탓으로 읽힘, 위 1·2). "삶→밤"(15.1 x1)은 **실패**(엉뚱 + 사망 시각 예측으로 읽힘, 위 3). 16.0·16.1·16.2·16.3·16.5, 20.1·20.2·20.4·20.5·20.6 오답은 통과(물 틀만 36).
- **15.5 "방문으로 이걸 되돌릴 방법은…":** 방문 탓으로 읽힘 — 실패, 위 1.
- **14 대명사 혼재:** B 필드는 문제없음(order 2줄은 "in the room"으로 피했고, 14.4 오답 "그가 얼굴을"은 en의 he=아들과 맞음). base 문장(14.1 "talk to him" ↔ 14.3 "in her room"·14.4 "see her face")은 A 몫. A가 환자를 한 성별로 맞추면 14.4 distractorsKo의 "그가"도 "아드님이"로 함께 바꿔야 함.
- **3.0 x1 "알려 주세요":** 정답 둘 — 실패, 위 9. x2 "보여 드릴게요"는 통과.

## 통과로 본 판단 거리
- 15.1 x2 "의사들은 보고 있어요"(We→의사들, 사람 바꾸기 허용), 15.2 x2 "말을 걸 수", 20.4 x1 "마음을 정리", 16.0 x2 "돌아왔어요", 1.4 x2 "이상한 일이면", 8.4 x1 "크게 말해달라거나"(decoy `to speak up`과 같은 뜻이지만 정답 ko와는 다름), 20.0 오답 "감사/존경을 표합니다"(부적절하지만 sorry가 들리는 자리, 사과로 바꾸면 탓이 되므로 이게 낫다) — 들어서 갈리고 해가 없어 통과.

## A 몫으로 넘김
- 14 base 대명사 혼재(위).
- 6.4 "I'll help translate if needed" — 미국 병원은 가족 회의 같은 중요한 대화에 자격 있는 의료 통역(또는 인증된 이중언어 직원)을 쓰게 함(Section 1557). 간호사가 그 자격이 없으면 즉석 통역은 권장되지 않음 — 문장·nuance에서 다룰지 A가 판단.

## 종합
고칠 것 82건(안전 8 · 정답 둘 13 포함). 안전 8건(특히 15.5·15.0·16.4·18.2)을 고치고 빈칸 장면 밖 오답을 바꾼 뒤 W18을 다시 돌리면 내보내도 됨.
