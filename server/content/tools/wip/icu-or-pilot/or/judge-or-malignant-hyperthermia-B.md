# Fable 표본 판정 — or-malignant-hyperthermia (B 범위: v46 1~6·8 + distractorsKo ①~⑥·되풀이 상한)

대상 `or-malignant-hyperthermia.yaml` 105문장·21 order 전수. 스크립트로 `en|ko|오답1|오답2`, 빈칸 4줄, 청크+decoy, order 인접 교환, 오답 낱말 되풀이(조사·어간 정규화)를 전부 뽑아 한 줄씩 봤다. fix-*.md는 열지 않았다.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1. why | 4 | 105개 모두 "말하는 방식의 이유"를 말하고 ko 되풀이 없음. 사실 오류 없음. 다만 4.3은 ko가 틀려 why와 ko가 서로 반대 뜻(아래 심각). 1.2 첫 문장은 한국어가 꼬여 뜻이 안 잡힘. 16.5는 why가 "이렇게 말하면 안 좋다"고 가르치는 문장을 깎는다. |
| 2. 빈칸 | 3 | 넷 다 넣어 읽음. 장면에서 맞는 선택지 3건(14.4 repeat, 7.4 alarm, 2.3 off the table). 경계 6건. 장면과 동떨어진 우스운 오답(decorate·paint·sell·parking·billing·hungry 등) 12문장. `label/relabel` 계열이 17문장, `rarely` 5, `sign` 5, `empty` 5 — 같은 오답 묶음 돌려쓰기. |
| 3. decoy | 4 | 어떤 청크 자리에 넣어도 ko와 같은 뜻이 되는 것은 없음. `lunch` 8회·`hall` 5회·`after …` 6회로 되풀이가 심하고, 21.1 `extra snacks`·15.3 `send flowers`는 장면 밖 우스개. |
| 4. distractorsKo ①~⑥ | 2 | ①~③·⑤는 대체로 지킴(길이 위반 1건: 14.1). ④ 정답 둘 1건(16.2). **⑥ 안전 시험이 약함**: 처치 지시문 8문장에서 지시 동사·약·처치를 통째로 다른 것으로 바꿨다(16.3·17.2·17.5·18.2·18.3·18.4·19.2·20.2). 당장 환자가 다치는 오답은 아니지만 "처치 동사 보존·약을 다른 것으로 바꾸지 않음" 원칙에 반하고, 학습자가 그 말을 하면 재투여·냉각·유발약 중단이 빠진다. 4.3은 ko가 틀려 오답 둘 다 다시 써야 함. |
| 4'. 되풀이 상한 | 4 | `약국` 6회(상한 5 초과, 7.3·14.1·15.5×2·16.5·21.2). 정확히 5회로 상한에 닿은 낱말 6개(알레르기·병동·청소·맥박·호흡·체온) — 한 건만 옮겨도 넘침. `외과팀`4+`외과 팀`1=5. 그 외는 4 이하. |
| 5. order | 3 | 21장 중 18장은 지시어(That·it·those·all of that·So)로 잘 묶임. 3장이 느슨: S18 2↔3 자연스러움, S3 3↔4 자연스러움, S16 2↔3은 느슨하고 MHAUS 순서와도 어긋남. S4는 `First,`가 2줄에 있어 1줄을 고정하지 못함. ko 머리말은 전부 카드 내용과 맞음. |
| 6. tag·icon | 5 | 태그 10자 이하, 상황 안에서 역할 일관(소견 보고→의미 설명→보고 약속…). 아이콘 어울림. 지적 없음. |
| 8. 파일럿 갈래 | 3 | 관사·문법으로 걸러지는 오답은 없음(`an`/`a` 충돌 없음). 장면과 동떨어진 오답 묶음·되풀이가 파일럿 2번 그대로 되풀이됨. order 임상 순서는 S16만 문제. 냉각 부위·중단 시점·칼슘 우선·bicarb/과호흡은 MHAUS와 맞음. |

## 사실 오류·심각한 문제

1. **[정답·안전] 4.3 `Everything's stocked and in date.` ko "전부 구비되어 있고 유효기한도 지났어요"** — in date = 유효기한 **안**. ko는 "만료됐다"로 읽혀 정답이 반대 뜻이고, 학습 화면에서 "유효기한 지난 재고로 괜찮다"로 외우게 된다. why는 "in date는 expired와 반대"라고 바르게 말해 ko와 충돌. exKo(w-stock·w-date)도 같은 오류. → ko "전부 구비되어 있고 유효기한도 안 지났어요"(또는 "…유효기한도 남아 있어요"). 오답 둘(라벨도 붙였어요 / 청소되어 있고 유효기한도 지났어요)은 새 ko 틀로 다시: "전부 구비되어 있고 라벨도 붙어 있어요" · "전부 구비되어 있고 서명도 끝났어요". (v44 ko 자체는 A 영역이지만 B의 why·오답이 이 위에 있어 여기 적음.)
2. **[임상 순서] S16 order** — 내 기억으로 MHAUS 급성기 카드는 "Get help · Get dantrolene · 유발약 중단 · 과호흡 · dantrolene" 순으로 도움 요청/카트가 먼저이고 둘을 사실상 동시로 둔다(이 세션에서 카드 원문은 확인 못 함 — 카드로 확인 요망). 현재 2줄(유발약 중단)→3줄(카트·도움)은 순서가 거꾸로이거나 적어도 하나로 못 박히지 않고, `Right after that`은 어느 자리에 가도 붙는다. → 2↔3 바꾸고 묶는 말 수정: 2 "First, get the MH cart and call for help now." 3 "While that's coming, stop all triggering agents immediately." 4 "We start the protocol with everything on that cart."(4의 that cart가 2를 가리키게 됨).
3. **[정답 둘] 14.4 빈칸 `If the potassium comes back high, we'll [treat/record/repeat/relabel] it right away.`** — 고칼륨 결과에 "repeat it right away"(용혈 확인 재검)는 실제 흔한 행동이라 정답 둘. "record it right away"도 자연스럽고 처치를 미루는 모양. → 빈칸을 `high`로 옮기기(options: high / low / late / clear) 또는 오답을 `ignore / chart / hide`처럼 명백히 틀린 방향으로.

## 고칠 것 (문장 id · 문제 · 고칠 방법) — [안전]·[정답] 표시

### distractorsKo
1. 4.3 · [정답][안전] 위 심각 1 · ko 정정 후 오답 둘 재작성.
2. 16.3 `Stop all triggering agents immediately.` · [안전] 오답 "모든 휴대폰 알림을 즉시 끄세요"/"모든 방송 안내를 즉시 멈추세요" — 약(유발 약제)을 장면 밖 물건으로 바꿨고 한쪽은 동사도 바꿈. 읽기만 해도 걸러짐 · "모든 유발 약제를 즉시 치우세요"(옆 단계, 뜻 다름) · "모든 유발 약제를 즉시 보고하세요".
3. 17.2 `We dose by weight and repeat as needed.` · [안전] 오답 둘이 "반복합니다"→"공유/보고합니다"로 재투여 처치를 지움 · "체중에 따라 투여하고 매번 기록합니다" · "체중에 따라 투여하고 결과를 보고합니다"(반복 자리는 들리는 자리이고, 둘 다 처치를 빼지만 해가 없는 옆 행동. 앞 세부 `by weight`는 바꾸면 용량이라 금지).
4. 17.5 `We'll keep dosing and repeating until he responds.` · [안전] "반복"→"알릴/보관"으로 반복 투여 빠짐 · "반응할 때까지 계속 투여하고 기록할게요" · "회복할 때까지 계속 투여하고 반복할게요"(기준 하나 바꿈, until he responds 들림).
5. 18.2 `Ice packs to the groin and axillae.` · [안전] 오답 둘 다 지시 동사 "대세요"→"정리하세요/세어 주세요"로 냉각 처치가 사라짐 · "서혜부와 겨드랑이에 얼음팩을 더 가져오세요" · "서혜부와 겨드랑이의 얼음팩을 갈아 주세요"(옆 단계).
6. 18.4 `Let's pack ice to the groin and axillae right now.` · [안전] 18.2와 같은 오답 틀 되풀이(세어/정리) · "지금 바로 서혜부와 겨드랑이의 얼음을 갈아 봅시다" · "지금 바로 서혜부와 겨드랑이에 수건을 대 봅시다"(물건 하나).
7. 18.3 `Stop cooling before we overshoot.` · [안전] "멈추세요"→"체온을 재 보세요/시간을 재세요"로 중단 지시가 빠짐 · "과냉각되기 전에 알려 주세요" · "과냉각되기 전에 체온을 불러 주세요"(담요 빼기는 곧 냉각 중단이라 정답 둘 — 쓰지 말 것).
8. 19.2 `Calcium, insulin with glucose, and bicarb per protocol.` · [안전] 둘째 오답이 약(bicarb)을 혈액가스로 바꿈 · "칼슘, 포도당을 곁들인 인슐린, 그리고 프로토콜에 따른 재검이요"도 같은 문제이니, "칼슘, 포도당을 곁들인 인슐린, 그리고 프로토콜 카드 확인이요"(물건·행동).
9. 20.2 `Hyperventilate and give bicarbonate per protocol.` · [안전] 오답 둘 다 두 처치를 전부 다른 행동(점검·서명·보관)으로 바꿈(①도 두 군데) · "과호흡시키고 프로토콜 카드를 소리 내 읽어 주세요" · "과호흡시키고 프로토콜 카드를 벽에 걸어 주세요"(둘 다 중탄산염 자리를 약이 아닌 카드 행동으로 — 19.2처럼 다른 약·검사로 바꾸지 않음).
10. 16.2 `Get the MH cart and call for help now.` · [정답] "크게 도움을 요청하세요"는 정답 행위에 참을 더한 말 · "MH 카트를 가져오고 지금 데스크에 요청하세요"(알릴 곳).
11. 14.1 `Let's send a potassium level now.` · 길이 19/15(1.27배·+4) · "지금 혈당 수치를 보냅시다".
12. 되풀이 상한 · `약국` 6회 → 15.5 둘 중 하나("약국에 기록되게")를 "간호 기록에 기록되게"로. 상한에 닿은 6낱말(알레르기·병동·청소·맥박·호흡·체온)은 수정 때 더 늘리지 말 것.
13. 12.2 `The machine is flushed and the vaporizers are off.` · [안전 소] 오답 "모니터는 꺼져 있어요" — 수술 중 모니터 꺼짐을 보고하는 말 · "기계는 세척되어 있고 기화기는 빠져 있어요"는 정답 둘이니 "…기화기는 라벨돼 있어요".
14. 3.1 · 오답 "언제 보관되어 있나요"는 한국어가 안 됨 · "이 방에는 단트롤렌이 어디에 진열되어 있나요"(동사 하나).

### 빈칸
15. 14.4 · [정답] 위 심각 3.
16. 7.4 `so this [rise] isn't from hypoventilation` · [정답] `alarm`은 EtCO2 알람 장면에서 그대로 맞음 · `alarm`→`drop`.
17. 2.3 `the triggers are off the [machine]` · [정답] `table`은 "off the table"(선택지에서 제외) 관용구로 장면에 맞음 · `table`→`cart`.
18. 3.3 `I want it [accessible] before we induce` · 경계 `visible`·`labeled`도 장면상 바랄 만한 말 · `visible`→`frozen`, `labeled`→`locked`.
19. 6.5 `the [moment] the trend looks abnormal` · 경계 `reason`은 문법·뜻 다 성립("이상해 보이는 이유를 알릴게요") · `reason`→`room`(`minute`는 정답 둘이라 안 됨).
20. 21.5 `He's more [stable] now` · 경계 `awake`는 위기 후 장면에 맞음 · `awake`→`febrile`(반대 방향).
21. 21.1 `He's [stabilizing]` · 경계 `waking`도 맞음 · `waking`→`worsening`.
22. 11.1 `we avoid [triggering] agents` · 경계 `expired`는 늘 참 · `expired`→`reversal`.
23. 장면과 동떨어진 오답(읽기만 해도 걸러짐) — 같은 분야에서 틀린 말로 · 1.2 cost/fee→`score/stage`(`chance`는 정답 둘); 3.1 sold→`ordered`; 4.1 decorate→`restock`; 4.2 parking/visitor→`consent/allergy`; 4.5 billing/dietary/registration→`central supply/the lab/the unit`; 6.1 loudly→`loosely`; 8.3 paint→`stock`; 10.3 paste/pour/ship→`fold/push/pull`; 11.5 hungry→`rushed`; 15.3 paint/sell→`skip/dump`; 15.5 freezer/basket→`drawer/binder`; 12.5 loudly/lazily→`slowly/briefly`.
24. 오답 묶음 되풀이 · `label/relabel/labeled/labeling` 17문장, `rarely` 5, `sign/signed` 5, `empty` 5 — 같은 묶음만 보고도 오답을 걸러낼 수 있음 · 문장마다 그 분야의 다른 말로 분산(예: 2.4 labeling→`stocking`, 13.1 labels→`chips`, 17.5 labeling→`flushing`).

### decoy
25. `lunch` 8회·`after …` 6회·`hall` 5회·`door` 4회 → 같은 자리 다른 분야 조각으로 분산(예: 3.2 at lunch→`in the fridge`, 11.3 for lunch→`for the surgeon`, 14.1 with lunch→`to pharmacy`).
26. 21.1 `extra snacks`·15.3 `send flowers` · 장면 밖 우스개 · `extra fluids`·`send a strip`.

### why
27. 1.2 · 첫 문장 "helps us + 동사원형은 이 질문이 누구를 위한 것인지 우리를 도와준다는 모양으로 풀어 줘요"가 꼬임 · "helps us + 동사원형은 '이 질문이 우리가 ~하는 데 도움이 된다'는 모양이라, 묻는 까닭을 환자에게 설명하는 말이 돼요."
28. 16.5 `Someone call the OR desk…` · why가 "사람을 지정하는 편이 좋다"며 가르치는 문장을 부정 · "Someone call…은 손이 비는 사람 누구든 움직이게 하는 위기 구어체예요. 가능하면 바로 이름을 붙여 'Maria, call the OR desk'로 좁히면 더 확실해요"처럼 문장을 세운 뒤 보완으로.

### order
29. S16 · [안전] 위 심각 2.
30. S18 · 2↔3 교환("Start… With all of that going, watch the temp closely. Pack ice… to speed that up.")도 자연스러움 · 3줄을 "Once the ice is on, watch the temp closely."로 2줄을 가리키게.
31. S3 · 3↔4 교환("Count… I want all of those accessible before we induce. If we're short, I'll ask pharmacy…")도 자연스러움 · 4줄을 "Either way, I want all of those accessible before we induce."(3줄의 조건에 답을 전제하지 않고 뒤에 붙음).
32. S4 · `First,`가 2줄에 있어 1·2줄이 둘 다 시작 줄로 읽힘 · 2줄 "Start by counting every vial against the list on the card."로 하고 1줄 뒤를 받는 말(`Let's begin with`)은 피함.

## 종합
why·tag·icon·order 묶음은 잘 돼 있고 임상 사실도 대체로 MHAUS와 맞다. 그러나 (1) 4.3 정답 ko가 반대 뜻, (2) S16 위기 발동 order가 MHAUS 순서와 어긋남, (3) 처치 지시문 8문장의 distractorsKo가 지시 동사·약을 통째로 바꿔 "처치 보존" 원칙을 어긴 점, (4) 빈칸·decoy 오답 묶음 되풀이(label 17·lunch 8)가 파일럿 2번 그대로라 **고친 뒤 내보내야 한다.** 고칠 것 32건(묶음 포함), 그중 [안전] 11건·[정답] 5건(4.3이 양쪽에 겹침 → 합 15건). 경계 5건(18~22)은 셈에서 뺐다.
