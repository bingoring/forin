# fix-icu-eol-goals-B — 한 번에 저작 검토 B (v46 1~6·8, distractorsKo ①~⑥, 되풀이 상한)

대상: `icu-eol-goals.yaml`, 21상황 147문장, order 21장. 범위는 전수이고, 대상 파일은 수정하지 않았다.
전부 스크립트로 뽑아 한 줄씩 판정했다. 뽑은 것은 `en|ko|오답1|오답2`, 빈칸 4줄 이어 읽기, order 인접 교환 3개, decoy와 빈칸 오답의 빈도, 길이다.
위치는 `[상황.문장]`(0부터)으로 적는다. S는 상황 번호다.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 `why` | 4 | 대부분 ko를 되풀이하지 않고 말하는 방식을 설명한다. 다만 사실 오류 1건([14.2] 기증 결정권), 과장 3건, 단정 안심을 합리화하는 why 3건이 있다. order why 3장은 지시어를 잘못 짚는다. |
| 2 빈칸 | 2 | 장면과 동떨어진 오답(plumbers, weather, passwords, glowing 등)이 약 22문장이다. 문법·관사로 걸러지는 세트가 6개, 정답이 둘 될 만한 오답이 약 12개다. 같은 오답 묶음(briefly·early·busy 각 5회)도 돌려쓴다. |
| 3 `decoy` | 2 | `for the family`가 47회, `for the X` 꼴이 76/147이다. 보기만 해도 걸러진다. 조립하면 ko에 그대로 맞는 decoy가 5개, 처치 시점을 빼거나 미루는 조립이 되는 decoy가 3개다. |
| 4 `distractorsKo` | 3 | 대부분 한 군데만, 들리는 자리를 바꿨다. 그러나 정답이 둘인 것 12개, 뒤집기 6개, 틀이 깨진 것 3개, 안전 시험에 걸리는 것 7개가 있다. 되풀이 상한도 3낱말이 넘는다. |
| 5 `order` | 3 | 21장 가운데 10장은 인접 교환 하나가 자연스럽다. why가 지시어를 틀리게 짚은 카드가 3장이다(S1·S11·S18). 임상 순서는 모두 맞다. |
| 6 `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다. 아이콘은 대체로 맞다. [5.0] 작별 시간에 쓴 `home`은 약하지만 고칠 정도는 아니다. |
| 8 파일럿 갈래 | 2 | 갈래 2(동떨어진 빈칸 오답, 관사로 걸러짐)와 갈래 5(decoy·오답 뜻이 정답과 겹침)가 브리프 경고 그대로 되풀이된다. |

## 심각한 문제

1. **[14.2] why와 S14 order 3줄은 사실 오류다(정답 둘 아님, 사실).** 문장은 "we'll follow whatever you decide"이고, why는 "결정권이 가족에게 있고 병원은 그것을 따른다"고 한다. 미국 Revised UAGA에서는 환자 본인의 기증 등록(first-person authorization)이 법적 효력을 가지고 가족이 뒤집을 수 없다. why는 "본인이 미리 정해 두지 않았다면 가족의 결정을 따른다"로 고친다. 문장 en은 A 몫이라 이관한다. 참고로 [14.0]처럼 간호사가 먼저 기증을 꺼내는 것은 CMS 42 CFR 482.45(OPO, designated requestor) 관행과 어긋난다. 이것도 A가 함께 볼 것.
2. **결정권과 시점 — [7.3] KX1 "다음으로, 조용해지면 호흡관을 제거할게요".** 발관 시점을 가족의 준비에서 떼어 환자 상태로 옮겼다. 처치 시점과 결정권을 동시에 바꾼 것이다.
3. **결정권 — [0.3] KX2 "차트에 그분 가족이 원하신 것과…".** DNR·사전의향의 근거를 환자에서 가족으로 옮겼다.
4. **판정 주체 — [19.6] KX1 "간호사 2인이 의사결정 능력 없음을 확인함".** 차트 문장이다. 간호사는 의사결정 능력을 판정하지 않는다. 그대로 따라 적으면 실제 기록 오류가 된다.
5. **탓·비용 프레임 — [17.1] KX1 "치료들이 이제는 오히려 비싸지고 있어요"와 같은 문장 빈칸 오답 `debt`.** 무의미한 치료 중단의 이유가 비용으로 들린다. 가족 갈등 장면에서 가장 피해야 할 말이다.
6. **잘못된 안심(A 이관)** — 이 문장들의 en·ko는 A 몫이다. B 쪽 why는 단정을 근거로 합리화하는 모양이라 함께 고친다.
   - [8.3] "She won't suffer": 보장이다. 예: "We'll make sure she's comfortable — we give medication before we start."
   - [8.4] "she won't feel that": "she isn't likely to feel that" 같은 완곡형으로.
   - [18.1] "he's not in pain": "he doesn't appear to be in pain"으로.
   - [15.2] "she'll settle"과 ko "곧 안정되실 거예요": 결과를 약속한다. ko의 "곧"은 en에 없다.
   - [18.2] "he can hear you": order 4번 줄처럼 "hearing is often…"으로.
7. **되풀이 상한 초과** — 설명 8회, 따뜻 7회, 환자 6회(아래 표).
8. **decoy 47개가 `for the family`** — 조립 연습이 성립하지 않는다(고칠 것 D1).

## 되풀이 상한 (오답에는 있고 그 문장 정답 ko에는 없는 낱말, 주제 전체)

집계법: 한글 어절 앞 두 글자(어간)가 정답 ko 안에 없으면 셌다. 활용형(설명해드릴, 설명드릴, 설명받으셨어요)은 한 낱말로 친다.
조사만 떼고 센 첫 집계는 활용형을 따로 세어 낮게 나온다(식사 5가 최대).

| 낱말 | 횟수 | 위치 | 판정 |
|---|---|---|---|
| 설명 | **8** | 0.0, 0.6, 2.1, 3.4, 7.0, 7.5, 15.2, 16.2 | 초과. 3곳 이상을 다른 말로 |
| 따뜻 | **7** | 2.2, 3.1, 4.6, 7.0, 8.0, 10.1, 10.2 | 초과. 2곳 이상을 다른 말로 |
| 환자 | **6** | 3.0, 10.5, 11.4, 12.3, 12.6, 14.0 | 초과. 아래 [3.0]·[10.5]를 고치면 4 |
| 간호(사·팀) | 6 | 1.2, 6.1, 6.2, 14.1, 15.1, 19.6 | 간호사만 5. [15.1]·[19.6]을 고치면 4 |
| 식사·원목 | 각 5 | 식사 5.2, 6.3, 11.1, 12.5, 14.5 / 원목 9.6, 11.5, 13.6, 16.2, 17.6 | 상한선. 새 오답에 더 쓰지 말 것 |

## 고칠 것

표시: **[안전]**은 ⑥이나 결정권·탓·잘못된 안심·위험한 조립, **[정답둘]**은 ④, 빈칸·decoy가 정답과 겹치는 것이다.

### 안전 (8건)
- S-1 **[안전]** [7.3] KX1 "조용해지면 호흡관을 제거": 발관 시점과 결정권을 바꿨다 → "다음으로, 준비되시면 가족분들을 병실로 모실게요"(the breathing tube 자리가 들림).
- S-2 **[안전]** [0.3] KX2 "그분 가족이 원하신 것": 결정권을 옮겼다 → "차트에 그분이 드신 것과 드시지 않은 것이 정확히 나와 있어요". KX1 "대략"은 ⑤ 뒤집기다 → "보험 서류에 그분이 원하신 것과 원치 않으신 것이 정확히 나와 있어요"(chart가 들림).
- S-3 **[안전]** [19.6] KX1 "간호사 2인이": 판정 주체 오류 → "의사 2인이 삼킴 능력 없음을 확인함"(decision-making이 들림).
- S-4 **[안전]** [17.1] KX1 "비싸지고 있어요"와 빈칸 `debt`: 비용 프레임 → KX1 "한때 도움이 됐던 치료들이 이제는 오히려 오래 걸리고 있어요". 빈칸 `debt`는 `sleep`으로.
- S-5 **[안전]** [8.3] KX2 "무서워하시지 않으실 거예요": 같은 종류의 잘못된 안심을 새로 만든다 → "가족분들도 함께 계실 거예요 — 시작 전에 약을 미리 준비해요". 빈칸 오답 `music`("we prepare music" → 고통이 없다는 근거처럼 읽힘)은 `chairs`로.
- S-6 **[안전]** [9.0] KX1 "맥박이 안정될 때까지"와 KX2 "열이 내려 보이실 때까지": 진정·진통 적정의 종점을 활력징후·체온으로 바꿨다 → KX1 "안정되어 보이실 때까지 곁에서 지켜봐 드릴게요"(titrate가 들림), KX2 "안정되어 보이실 때까지 담요를 덮어 드릴게요"(medication이 들림).
- S-7 **[안전]** [15.3] KX2 "약을 이제 준비하기 시작": 급변 중 투약이 늦어진다(처치 시점) → "가족분들이 적응하고 있어요 — 약이 이제 듣기 시작하고 있어요"(her body가 들림).
- S-8 **[안전]** 위험한 조립이 되는 decoy 3개:
  - [8.0] `after lunch`: "Before we remove the tube" 자리에 넣으면 "After lunch, I'll give medication…"가 되어 사전 투약 시점이 빠진다 → `at the bedside`.
  - [7.4] `after the shift`: "and treat after the shift"로 조립되어 처치가 미뤄진다 → `from the doorway`.
  - [0.1] `for now`: "keep him comfortable for now"가 되어 편안함이 한시적으로 들린다 → `in this room`.

  참고(경미, 고치지 않아도 됨): [2.5] KX2 "피곤해 보이시면 약을 조절"은 투약 계기를 바꿨다. [9.2] KX1 야간 근무자, [9.6] KX2 원목님은 불편 보고를 간호사 밖으로 돌린다(알릴 사람이라 규칙상 허용). [2.5]·[10.6] KX1 "조명을 조절"은 약을 물건으로 바꾼 것이다.

### 정답 둘 (28건)
distractorsKo ④:
- T-1 **[정답둘]** [3.0] KX2 "환자분의 편안함" = 그분 → "가족분의 편안함과 존엄이에요"(her가 들림).
- T-2 **[정답둘]** [1.0] KX1 "이야기하고 싶어" ≈ 만나고 → "팀에서 다음 주 일정을 함께 계획하려고 만나고 싶어 해요".
- T-3 **[정답둘]** [1.3] KX2 "직접 결정하실 수 있다면 어떻게" ≈ 정답 → "어머님이 직접 말씀하실 수 있다면 누구를 부르셨을까요?".
- T-4 **[정답둘]** [0.6] KX1 "가족분들 기억" ≈ 이해 → "지시서 내용이 병원 규정과 맞는지 함께 확인해볼게요".
- T-5 **[정답둘]** [16.1] KX2 "말씀하셨을지" ≈ 원하셨을지 → "그분이 무엇을 기억하셨을지에 집중해봐요".
- T-6 **[정답둘]** [6.6] KX2 "잠시 쉬고" ≈ 멈추고 → "잠시 멈추고 처음부터 이해가 되시는지 확인해볼까요"(so far가 들림).
- T-7 **[정답둘]** [15.1] KX1 "이런 소리는"(this ⊃ 소리)과 KX2 "간호사가"(말하는 사람이 간호사) → KX1 "이런 일은 밤에 있을 수 있고, 제가 바로 조절하고 있어요", KX2 "이런 일은 있을 수 있고, 의사 선생님이 바로 조절하고 있어요".
- T-8 **[정답둘]** [13.3] KX2 "아픈 게 아니에요" ≈ nothing is wrong with you → "잘못된 게 아니에요 — 애도는 밤이 오기를 기다리지 않아요".
- T-9 **[정답둘]** [11.6] KX2 "병원과 함께" ≈ us → "가족과 함께 일하는 거예요".
- T-10 **[정답둘]** [9.4] KX2 "빨리 정리하거나" ≈ speed up → "빨리 진행시키거나 숨기려는 게 아니에요".
- T-11 **[정답둘]** [17.1] KX2 "얼마 전" ≈ 한때 → "한때 도움이 됐던 검사들이 이제는 오히려 해가 되고 있어요".
- T-12 **[정답둘]** [0.4] KX1 "통증 치료를 늦춘다는 뜻은 아니에요"는 참이고 정답과 같은 메시지다 → "DNR이라고 해서 목욕을 멈춘다는 뜻은 아니에요". 같은 문장 빈칸 `delay`·`refuse`도 부정문에서 참이 된다 → `start`·`enjoy`.

빈칸 선택지:
- T-13 **[정답둘]** [0.1] `stable`: DNR이라도 안정 유지는 맞는 말이다 → `waiting`.
- T-14 **[정답둘]** [6.1] `feared`: "aren't recovering, as we'd feared"로 성립한다 → `planned`.
- T-15 **[정답둘]** [15.2] `outside`: 같은 주제 [4.2]의 정답이고 장면에도 맞다 → `away`(right away로 문법은 되나 뜻이 틀림).
- T-16 **[정답둘]** [20.4] `imagine`: 아이들이 더 많이 상상한다는 말도 참이다 → `spend`.
- T-17 **[정답둘]** [20.3] `fast`: "Losing someone this fast"도 자연스럽다 → `quiet`.
- T-18 **[정답둘]** [14.2] `problem`·`trouble`: "There's no problem — we'll follow…"로 성립한다 → `deposit`·`menu`.
- T-19 **[정답둘]** [14.6] `sign`: 기증 장면에서 "no need to sign today"는 맞는 말이다 → `shop`.
- T-20 **[정답둘]** [13.6] `hurt`: "Would it hurt to talk…?"는 권유 관용구다 → 빈칸을 counselor로 옮기고 `counselor/surgeon/pharmacist/cashier`.
- T-21 **[정답둘]** [5.0] `sorry`: 작별 장면에서 say sorry가 성립한다 → `yes`.
- T-22 **[정답둘]** [11.5] `Friday`: today or Friday가 성립한다 → 빈칸을 visit으로 옮기고 `visit/bill/park/vote`.
- T-23 **[정답둘]** [12.2] `review`: "so we can review your wishes"가 성립한다 → `delay`.
- T-24 **[정답둘]** [14.4] `briefly`(따로 짧게 이야기도 성립) → `loudly`. [4.5] `slowly`·`rarely`(조용히·드물게 말 거는 것도 위안) → `formally`·`angrily`.

decoy를 넣어 조립하면 ko에 그대로 맞는 것:
- T-25 **[정답둘]** [5.5] `for you`("whatever feels right for you" = 편하신 대로요) → `at the desk`.
- T-26 **[정답둘]** [7.2] `for him`("comfort is our priority for him") → `at every meal`(At every step 자리, ko와 어긋남).
- T-27 **[정답둘]** [9.1] `for him`("The goal is comfort for him") → `for the chart`.
- T-28 **[정답둘]** [15.2] `for now`("Stay with her for now")는 `in the hallway`로, [18.2] `for a minute`("Take a breath for a minute")는 `to the doctor`로.

### distractorsKo ⑤ 뒤집기·① 틀·길이·되풀이 (12건)
- K-1 [2.1] KX1 "드물게"(common의 반대) → "그 소리는 밤에 흔히 나는 것이고 저희가 완화해드릴 수 있어요"(at this stage가 들림).
- K-2 [1.4] KX2 "가치관을 나중에"(반대이고 en에서 들리지 않음) → "의학적 선택지보다 가족의 가치관을 먼저 생각해보세요"(her가 들림).
- K-3 [13.1] KX1 "작별 후에 슬퍼하는"(before↔after에 "미리"까지 지워 두 군데) → "작별 전에 미리 정리하는 것은 아주 인간적인 거예요".
- K-4 [7.5] KX1 "더 오래 진행되는"(faster의 반대 방향) → "의료진이 준비된 것보다 더 빨리 진행되는 일은 없어요"(your family가 들림).
- K-5 [8.5] KX1 "빠르고 다정하게"(slowly의 반대, 철회 속도) → "이 과정을 terminal weaning이라고 하는데, 천천히 가족과 진행해요". KX2 "조용하게" ≈ gently도 약하니 함께 보기.
- K-6 [4.2] KX1 "바로 안에"(outside의 반대) → "필요하신 게 있으면 언제든 복도 끝에 있을게요".
- K-7 ① [10.5] 오답 둘이 "저는 척도를 써서…매시간 점수화해요"로 틀을 바꿨다 → "매시간 척도로 통증을 점수화해서 확인해요" / "매시간 그림으로 편안함을 점수화해서 확인해요". 환자 1회도 줄어든다.
- K-8 ① [14.5] KX2 "내일 아침에도"가 절 전체를 바꿨다 → "무엇을 결정하시든 아드님이 받는 돌봄은 달라지지 않아요".
- K-9 ①·길이 [6.0] 오답 둘이 "그걸"을 더하고 두 낱말을 바꿨으며 둘 다 정답보다 길다 → "더 짧은 말로 설명해드릴게요" / "더 자세한 말로 설명해드릴게요".
- K-10 길이 [4.3] 오답 둘 다 정답보다 길다(27·27 vs 26) → KX1을 "밤이든 낮이든 원하시는 만큼 전화하셔도 돼요"로.
- K-11 되풀이 "설명" → [2.1] KX2 "…저희가 확인해드릴 수 있어요", [3.4] KX2 "다른 방식으로 씻겨드리는 거예요", [7.0] KX2 "…그동안 계속 기록해드릴게요". 그러면 5회.
- K-12 되풀이 "따뜻" → [8.0] KX1 "…약을 드려서 조용하게 계시도록 할게요", [10.2] KX1 "계속 조절해서 조용한 상태를 유지시켜드려요". 그러면 5회.

### 빈칸 — 문법으로 걸러짐 (6건)
- B-1 [1.3] herself/himself/yourself/ourselves는 대명사 일치로 답이 보인다 → 빈칸을 speak로 옮기고 `speak/pay/shop/cook`.
- B-2 [6.4] `week/month/day`는 관사가 없어 모두 걸러진다 → 빈칸을 same으로 옮기고 `same/first/last/wrong`.
- B-3 [13.0] `early`는 "a early"가 된다 → `minor`.
- B-4 [0.5] `asking/moving him comfortable`은 비문이다 → `finding/calling`.
- B-5 [11.3] `price/season/speed of life`는 관사가 없다 → 빈칸을 end로 옮기고 `end/rich/young/brave`.
- B-6 [3.3] `how she says`는 비문이다 → `walks`.

### 빈칸 — 장면과 동떨어진 오답 (갈래 2, 22건)
같은 분야에서 틀린 말로 바꾼다. 화살표 오른쪽은 권하는 대체어다.

| 위치 | 지금 | 대체 |
|---|---|---|
| [2.0] | pride/laughter/boredom | recovery/improvement/hunger |
| [10.0] | humor/hunger/pride | recovery/hunger/healing |
| [4.3] | pay/shop/drive | park/eat/wait |
| [4.2] | overseas | nearby 금지, `away` |
| [6.2] | landlord/driver | surgeon/dietitian |
| [7.1] | gloves/bandages/slippers | 빈칸을 First로: `First/Later/Tomorrow/Yesterday` |
| [9.0] | dry/hungry/angry | awake/alert/active |
| [10.1] | swollen/bandaged/painted | tense/stiff/curled |
| [10.5] | menu/brush/key | timer/thermometer/stethoscope |
| [12.0] | receipts/passwords/deadlines | medications/visitors/schedules |
| [12.4] | lawyer/banker/tailor | surgeon/dietitian/pharmacist |
| [13.2] | lawyers/auditors/plumbers | surgeons/dietitians/pharmacists |
| [15.0] | thinking/walking/reading | swallowing/sleeping/hearing |
| [15.4] | month/season/decade | 빈칸을 helps로: `helps/hurts/fails/costs` |
| [16.4] | recipe/vacation/weather | surgery/diagnosis/treatment |
| [16.6] | bills/lunches/jokes | questions 금지(정답 둘), `schedules/tests/visits` |
| [17.6] | billing/parking/laundry | nutrition/pharmacy/radiology |
| [18.3] | drive/pay | wait/work |
| [18.5] | echoing/freezing/glowing | racing/deepening/warming (improving은 잘못된 안심이라 금지) |
| [19.0] | password/passport | insurance 유지, `pharmacy/address` |
| [20.1] | guards/electricians/cooks | teachers/drivers/coaches |
| [8.4]·[18.2] | copy | hear·feel 금지, `count`·`reach` |

돌려쓰는 묶음: briefly·early·busy 각 5회, quickly·hungry·pay·rarely·hide 각 4회, here/outside/upstairs/downstairs 세트 3문장([4.2]·[15.2]·[18.0]).
위 대체어를 쓸 때 같은 말이 4회를 넘지 않게 한다. 그 밖의 경미한 것: [1.2] `cross down` → `turn`, [1.4] `rooms` → `vitals`, [7.0] `angrily/rarely` → `suddenly/quickly`(gradually의 반대 방향, 같은 분야).

### decoy (1건 묶음)
- D-1 `for the family` 47개, `for the team/staff/nurse/doctor` 29개는 S9~S20의 거의 모든 문장에 있다. 조각 하나만 봐도 걸러진다.
  S0~S8처럼 같은 자리의 다른 대상·장소·시각 조각으로 다시 쓴다(`to your sister`, `in the hallway`, `last week`).
  예: [13.0] `of illness`(of loss 자리), [16.3] `to the doctor`(to both of you 자리), [19.3] `after one call`(after multiple attempts 자리).
  처치 시점을 미루는 조각(after/tomorrow)과 결정권을 가져가는 조각(for the team decides 같은 것)은 쓰지 않는다.

### order — 인접 교환이 자연스러운 카드와 why 오류 (13건)
- O-1 S2 3↔4: 확인을 말하기 전에 결과를 알려도 자연스럽다 → 4줄을 "I'll tell you what I saw and whether the change helped."로.
- O-2 S3 3↔4: "So please stay…"가 2줄 뒤에도 붙는다 → 4줄을 "In fact, I'd like you to stay as long as you want — I'll bring you a chair."로(3줄의 부정을 받는다).
- O-3 S4 1↔2: "keep talking"은 1줄이 없어도 선다 → 2줄을 "While you're with her, hearing is often the last sense to go, so please keep talking to her."로.
- O-4 S4 2↔3: "Even quiet words…"가 1줄 뒤에도 선다 → 3줄을 "Even quiet words like that can comfort her."로.
- O-5 S5 1↔2: "When you're ready, I'll clean…" 뒤에 작별 시간을 줘도 자연스럽다 → 2줄을 "When you've said your goodbyes, I'll clean and dress him carefully."로.
- O-6 S6 3↔4: 다시 짚자는 제안 뒤에 "Does that make sense so far?"도 자연스럽다 → 4줄을 "If it doesn't yet, we can go over it again as many times as you like."로.
- O-7 S13 2↔3: "as it goes on"의 it이 1줄의 감정도 받는다 → 3줄을 "Because it starts early, some days will feel heavier than others along the way."로.
- O-8 S14 2↔3: "Whatever you decide"가 1줄 뒤에도 선다 → 3줄을 "Whatever you decide after hearing from them, we'll respect it, and it won't change his care."로. 사실 오류(심각 1) 때문에 follow를 respect로 바꾸는 것은 A와 맞출 것.
- O-9 S14 3↔4: "Take your time with it"의 it이 1줄의 option도 받는다 → 4줄을 "Take your time with that decision; there's no need to answer today."로.
- O-10 S16 1↔2: 걱정을 듣겠다고 한 뒤 공감해도 자연스럽다 → 2줄을 "Because of that love, I'd like to hear each of your concerns, one at a time."로.
- O-11 S18 2↔3: "Through all of that"이 1줄(임종)도 받는다 → 3줄을 "As his breathing changes, you can talk to him; hearing is often the last sense to go."로. why의 "2줄의 that은 1줄의 임종을 가리켜"는 틀렸다(2줄의 that은 같은 줄의 호흡 변화). 함께 고친다.
- O-12 S1 why: "3줄의 them과 4줄의 them"이라 했으나 3줄에는 them이 없다 → "3줄의 as you do that은 2줄의 생각하기를, 4줄의 them은 3줄의 질문을 가리켜요."
- O-13 S11 why: "2줄의 do that이 아니라 3줄의 To do that이…"는 문장이 꼬였다 → "3줄의 To do that은 2줄의 편안함과 지지를 가리키고, 4줄의 that conversation은 3줄의 대화를 가리켜요."

(경계, 고치지 않아도 됨: S8 2↔3 "through all of it"은 1줄 뒤에서 약하게 선다.)

### why (4건, 사실·과장)
- W-1 [14.2] 사실 오류(심각 1) → "no pressure로 강요하지 않는다고 먼저 말해요. 본인이 미리 정해 두지 않았다면 가족의 결정을 따른다는 뜻이라, 선택이 가족의 몫임을 분명히 해요."
- W-2 [0.0] "아버님이 미리 직접 작성해 둔 문서": DNR order는 의사가 내는 지시다(환자 본인은 사전의향서·POLST 쪽) → "사전의향서는 아버님이 직접 작성하셨고 DNR은 그 뜻에 따른 지시라서…"로. 문장 "completed … a DNR order"도 A가 볼 것.
- W-3 [5.2] "가족의 관습이 병원 절차에 밀리지 않는다": 과장이다(검시·감염 관리 같은 절차가 우선할 수 있음) → "가능한 한 따르겠다는 뜻"으로.
- W-4 [11.1] "decisions ahead라고 하면 … 팀이 대신 내리는 게 아님이 드러나요": ahead는 앞으로라는 뜻뿐이다 → "help with decisions로 결정을 돕는다고 말해, 대신 내린다고 하지 않아요"로.
- (함께) [8.3]·[8.4]·[18.1] why는 단정을 합리화한다 → A가 문장을 완곡하게 바꾸면 why도 거기에 맞춘다(심각 6).

## 개수

- **고칠 것 합계 94건**: 안전 8, 정답 둘 28, ⑤·①·길이·되풀이 12, 빈칸 문법 6, 빈칸 동떨어짐 22, decoy 묶음 1(문장 76개), order·order why 13, why 4. 표 아래 경미 항목은 세지 않았다.
- 그중 **안전 8건, 정답 둘 28건**.
- A 이관(B 범위 밖): [8.3]·[8.4]·[18.1]·[15.2]·[18.2]의 단정 안심 문장, [14.0]·[14.2]의 기증 관행과 결정권 문장, [0.0]의 "completed a DNR order", [20.2] ko "가족분과 함께 지지"(en은 you and her family를 지지).

## 종합

distractorsKo는 한 군데만, 들리는 자리를 바꾸는 규칙을 대체로 지켰다. 사망·임종 고지 문장의 오답이 누구를 탓하거나 감싸는 사례도 없다.
다만 결정권·시점·판정 주체·비용 프레임을 건드린 오답 5개([7.3]·[0.3]·[19.6]·[17.1]·[8.3])와 위험한 decoy 3개가 있다.
빈칸과 decoy는 파일럿 갈래 2·5를 그대로 되풀이한다(동떨어진 오답 22문장, `for the family` 47개). 기증 why의 사실 오류도 있다.
위 목록을 반영하고 A가 단정 안심 문장을 고친 뒤에 내보낼 수 있다. 지금 상태로는 내보내지 않는다.
