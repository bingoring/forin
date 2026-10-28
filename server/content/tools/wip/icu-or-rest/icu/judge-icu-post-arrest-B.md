# judge — icu-post-arrest (B 범위, Fable 독립 전수 판정)

대상: `icu-post-arrest.yaml` 127문장 · 21상황(order 21장). 기준: `lesson_author_brief.md` "v46" 절, `REVIEW.md` v46 1~6·8 + distractorsKo ①~⑥·되풀이 상한.
판정 기준(빈칸 정답 둘): 선택지를 넣어 읽었을 때 **이 장면에서도 맞는 말**이면 정답 둘로 봄(ko 힌트로 갈린다는 이유로 봐주지 않음 — REVIEW v46 2번·브리프 sleepy/phone number 예).
방법: 스크립트로 `en | ko | 오답1 | 오답2`, 빈칸 네 줄, decoy, order 인접 교환(63건)을 전부 뽑아 한 줄씩 판정. 되풀이는 조사·어미(합니다/합시다/할게요…)를 떼고 어간으로 셈. fix-*.md·check·fixB 파일은 열지 않음.

## 항목별 점수

| 항목 | 점수 | 근거 |
|---|---|---|
| 1. why | 4 | 127개 모두 "말하는 방식의 이유"를 말하고 사실 오류 없음. #15 하나가 ko 내용을 되풀이. |
| 2. 빈칸 | 2 | 장면에서도 맞는 선택지가 있는 정답 둘 9문장(#5·#50·#54·#71·#91·#98·#106·#114·#125). 관사·문법으로 걸러지는 오답 3문장(#9·#16·#48). 장면과 동떨어진 오답이 약 30문장(갈래 8, 아래 표). |
| 3. decoy | 4 | 어떤 자리에 넣어도 `ko` 뜻의 다른 문장이 되는 것 2건(#17 per policy·#43 and slows). 확인 전 고지가 되는 #120은 참고. |
| 4. distractorsKo | 4 | 틀·길이·들리는 자리 거의 전부 준수. 안전 시험 실패 1건(#92), 처치 지연 1건(#98), ④ 뜻 겹침 1건(#17), 읽기만으로 걸러지는 말 수 건. 되풀이 상한 통과(최대 5). |
| 5. order | 3 | 21장 중 4장이 3↔4줄을 바꿔도 자연스러움(S4·S6·S9·S20). ko 머리말은 전부 카드와 맞음. |
| 6. tag·icon | 5 | 태그 10자 이하·역할 일치, 아이콘 뜻과 어울림. 문제 없음. |
| 8. 파일럿 갈래 | 3 | 빈칸 오답 동떨어짐이 되풀이됨. order 임상 순서는 전부 맞음(압박→코드·제세동기→물러남→쇼크 후 재개, 손 위생류 없음). |

**되풀이 상한(어간 기준, 주제당 ≤5):** 안내 5(#9·25·86·118·120) · 맥박 5(#35·42·46·58·59) — 상한 선에 걸침, 위반 없음. 다음 체온·수술·일정·점검·기록·팀·구토·확인·혈당 각 4.

## 사실 오류·심각한 문제

1. **[안전] #92 (S15.1) distractorsKo D1** `제세동기를 충전하고 쇼크를 위해 패드를 붙이세요` — 정답의 지시 동사 "물러나세요(clear)"를 지워 버림. 충전 뒤 물러남 없이 패드를 만지는 말이라 학습자가 그대로 하면 다침. 지시 동사 보존 규칙 위반. → `제세동기를 충전하고 쇼크 전에 모두 물러나세요`처럼 물러남을 남기고 다른 세부(시점·대상)를 바꾸거나, `제세동기를 켜고 쇼크를 위해 물러나세요`(D2)와 짝이 되게 `제세동기를 충전하고 쇼크 뒤에 맥박을 확인하세요`(안전한 옆 단계)로.
2. **[안전·처치 지연] #98 (S16.1) distractorsKo D1·D2** `지금 승압제를 준비합시다` · `지금 승압제 용량을 계산합시다` — 혈압이 무너지는 장면에서 "시작"을 "준비/계산"으로 바꿔 처치 시점을 늦춤(처치 시점은 바꾸면 안 됨). → 시점·동사는 두고 알릴 사람·장소를 바꾸기: `수액을 빠르게 주입하고 지금 의사를 호출합시다` · `수액을 빠르게 주입하고 지금 승압제를 올립시다`.

그 외 사실 오류 없음(TTM 32–36℃·반 도/시간 재가온·냉각 시 K 세포 내 이동·OPO가 가족 접근·두 의사 독립 판정 "per policy" 모두 미국 관행과 맞음).

## 고칠 것

### A. 안전 (2건)
- #92 (S15.1) · distractorsKo D1 · "물러나세요" 삭제 · 위 1번.
- #98 (S16.1) · distractorsKo D1·D2 · 승압제 "시작"→"준비/계산"으로 처치 지연 · 위 2번.

### B. 정답 둘 (12건)
- #98 (S16.1) · blank `hang` · "Let's hang fluids and start a vasopressor now"는 이 장면에서도 맞는 영어(수액 걸기) → `chart`/`count`로 바꿈.
- #5 (S0.4) · blank `carotid/brachial/pedal` · 어느 맥박 부위든 "strong and equal bilaterally"로 보고하면 장면에 맞음 → 빈칸을 `intact`로 옮김(options: intact/absent/delayed/poor).
- #50 (S8.1) · blank `pump` · "Secure all lines and the pump for transport"는 이송 준비로 맞는 말 → `chart`로.
- #54 (S8.5) · blank `pump` · "manage the pump during transport"도 이송 역할로 맞음 → `paperwork`로.
- #91 (S15.0) · blank `PEA/VTach/asystole` · 셋 다 무맥성 리듬이라 "…and lost his pulse — start compressions now"가 전부 맞음 → 빈칸을 `compressions`로 옮김(options: compressions/feeding/rounds/discharge).
- #114 (S18.5) · blank `hiding/guessing` · "We're not hiding/guessing, and we're not promising more than we know"는 가족 상담에서 그대로 맞는 말 → 빈칸을 `promising`으로 옮김(options: promising/ordering/charging/planning).
- #125 (S20.3) · blank `trust/miss` · "you both trust/miss him and want what's best"도 맞는 말 → 빈칸을 `best`로 옮김(options: best/next/left/new).
- #71 (S11.4) · blank `rhythm` · "His rhythm is holding, so the rewarming rate looks safe"는 재가온 판단으로 맞음 → `urine/color`처럼 `weight`로.
- #106 (S17.3) · blank `temperature` · 냉각 장면에서 "VT with a dropping temperature"는 맞는 보고 → `appetite`로.
- #17 (S2.4) · decoy `per policy` · "I'll place the probe rectally per policy and confirm the reading" = ko "프로토콜대로…" 그대로 → `per the family`/`in the hallway`처럼 뜻이 갈리는 조각으로.
- #43 (S7.0) · decoy `and slows` · "Shivering raises metabolism and slows the cooling" = ko "냉각에 저항해요"와 같은 뜻 → `and helps`/`and the shivering`으로.
- #17 (S2.4) · distractorsKo D1 `측정값을 읽을게요` · "confirm the reading"과 "읽는다"는 뜻이 사실상 같음(④) → `측정값을 기록할게요`는 되풀이 상한(기록 4)에 닿으니 `측정값을 알릴게요`로.

### C. 빈칸 — 관사·문법으로 걸러짐 (3건)
- #9 (S1.2) · blank `a infection` · 관사 오류로 걸러짐 → `a blockage`/`a tamponade`처럼 a로 시작하는 명사로.
- #48 (S7.5) · blank `If hiccups continues` · 수 일치 오류 → `hiccuping`/`coughing`.
- #16 (S2.3) · blank `covered in / folded in / labeled in` · `in`은 `plugged in`의 일부라 셋 다 비문 → 빈칸을 가르치는 말 `pads`로 옮기고(`Grab the cooling [pads]`: blankets/sheets/towels) 또는 `plugged`를 `turned/switched/powered`(…in/on 꼴)로.

### D. 빈칸 — 장면과 동떨어진 오답 (갈래 8, 같은 분야에서 틀린 말로)
| # | 문장 | 동떨어진 선택지 | 제안 |
|---|---|---|---|
| #3 (S0.2) | We stabilize [ABCs] | scans/labs/charts (stabilize 목적어로 비문) | vitals/rhythm/lines |
| #27 (S4.2) | [Comfort] during TTM is part of good care | Paperwork/Noise/Delay | Warmth/Silence/Speed |
| #33 (S5.2) | Have the [crash cart] close | meal cart/linen cart | med cart/code sheet/suction cart |
| #43 (S7.0) | Shivering raises [metabolism] | appetite/weight | glucose/pressure/volume |
| #44 (S7.1) | the shivering [protocol] | video | checklist/order set |
| #45 (S7.2) | counterwarming and [sedation] | coffee/fasting | fluids/suction/exercise |
| #52 (S8.3) | drips are on the [pump] | floor/wall/ceiling | pole/rack/chart |
| #55 (S9.0) | keep his [MAP] at or above | age/weight/height (CVP/HR 같은 지표를 넣으면 장면에서 맞아 정답 둘) | 빈칸을 `above`로 옮김(above/below/beside/behind) |
| #56 (S9.1) | to maintain [perfusion] | visitation | glucose/sedation |
| #57 (S9.2) | protects his [brain] | ears/bones | heart/kidneys/liver |
| #66 (S10.5) | blood [gas] | scan | sugar/count/culture |
| #67 (S11.0) | rebound [complications] | complaints/delays | fever/edema/errors |
| #69 (S11.2) | protects his [recovery] | budget/privacy/schedule | rhythm/skin/kidneys |
| #73 (S12.0) | Post-arrest [seizures] | rashes/vomiting/headaches ("like eye twitching"과 안 맞음) | tremors/spasms/jerks |
| #75 (S12.2) | abnormal [movements] | visitors | rhythms/sounds/readings |
| #78 (S12.5) | report to the [team] | kitchen/laundry | family/pharmacy/charge nurse |
| #80 (S13.1) | [rebound] hyperkalemia | genetic/allergic | mild/delayed/transient |
| #83 (S13.4) | We're [correcting] it slowly | explaining/documenting | dropping/raising/repeating |
| #87 (S14.2) | predicting [outcome] | weather(브리프가 꼽은 예) | timing/costs/discharge |
| #88 (S14.3) | how he'll do [neurologically] | socially/legally/financially | physically/socially/financially 중 physically만 바꿔 넣기 |
| #90 (S14.5) | talk with the [family] | auditor | chaplain/surgeon/neurologist |
| #102 (S16.5) | until his [pressure] stabilizes | sleep/mood | rhythm/temperature/potassium |
| #105 (S17.2) | Cold hearts resist [drugs] | light/touch/noise | shocks/pacing/fluids |
| #110 (S18.1) | meaningful [recovery] | dialysis/surgery | movement/speech/awareness |
| #111 (S18.2) | wanted for his [care] | travel/hobbies | body/family/funeral |
| #117 (S19.1) | testing per [protocol] | receipt/memo | order/schedule/request |
| #118 (S19.2) | [organ] procurement organization | insurance/billing | blood/equipment/supply |
| #119 (S19.3) | Two [physicians] | volunteers/lawyers | nurses/residents/specialists |
| #126 (S20.4) | This [decision] belongs | meal/room | timing/schedule/visit |

### E. distractorsKo — 읽기만으로 걸러지는 말·뒤집기 (낮음)
- #4 (S0.3) D2 `호흡이 얕아 보이지만` · adequate의 반대말 뒤집기(⑤)에 가깝고 "얕은데 곧 연결"은 but 논리가 어긋남 → `백 마스크로는 호흡이 충분해 보이지만, 곧 흉부 X선을 찍읍시다`(처치 계획 틀 유지).
- #43 (S7.0) D2 `가온에 저항해요` · 냉각↔가온 반대말 뒤집기 → `떨림은 혈당을 올려서 냉각에 저항해요`(metabolism 자리, 틀린 말).
- #45 (S7.2) D2 `운동이 억제에` · 아무도 하지 않을 말 → `표면 대응가온과 진통제가`.
- #57 (S9.2) D2 `뼈를 보호` · 아무도 하지 않을 말 → `콩팥을 보호`.
- #63 (S10.2) D1·D2 `뼈를/피부를 해칠` · 같은 문제 → `심장을/콩팥을`.
- #70 (S11.3) D1·D2 `반 도 정도씩 측정/알리고` · 뜻이 안 되는 문장 → `두 시간에 반 도 정도씩 재가온`(더 느림, 안전)·`한 시간에 반 도 정도씩 재가온할 예정이에요`.
- #73 (S12.0) D1·D2 `두통/구토는 눈 씰룩거림처럼` · 뜻이 안 됨 → `발작은 손 씰룩거림처럼`·`발작은 입맛 다심처럼`.
- #80 (S13.1) D2 `반동성 근육통` · 뜻이 안 됨 → `반동성 고혈당`.
- #105 (S17.2) D1 `소리에 저항` · 뜻이 안 됨 → `쇼크에 저항`.
- #110 (S18.1) D2 `의미 있는 이동 가능성` · 뜻이 안 됨 → `뇌파 결과는 의미 있는 회복 가능성이 낮음을 가리켜요`(tests 자리).
- #114 (S18.5) D2 `걱정하지도 않을게요` · 뜻이 안 됨 → `포기하지도 않고, 아는 것보다 더 많이 말하지도 않을게요`.
- #35 (S5.4) D2·#58 (S9.3) D2 `맥박이 떨어져서 승압제를 올렸어요/올리고 있어요` · 서맥에 승압제는 처치 근거가 틀림(보고문이라 낮음) → 처치는 두고 정도를 바꿈: #35 `혈압이 많이 떨어져서 승압제를 올렸어요`(a bit 자리), #58 `MAP가 60 밑으로 떨어져서 지금 올렸어요`(now 자리).

### F. order — 순서가 하나로 못 박히지 않음 (4건)
- S4 (TTM 중 편안함) · 3↔4 · "So we sedate him adequately → I'll check his pain score after that → Once he's comfortable, we can reposition him"이 더 자연스러움(점수 확인 뒤 체위 변경) → 4줄을 `After the turn, I'll check his pain score`로 3줄에 묶기.
- S6 (TTM 냉각·유지) · 3↔4 · "switch to maintenance mode → That means no overshooting → From there, we hold tightly stable" 성립 → 4줄을 `Holding it that tightly means no overshooting below the range`로.
- S9 (혈압 목표 유지) · 3↔4 · "titrating up → That protects his brain → Once it's back at target, we hold there" 성립 → 4줄을 `Holding it there protects his brain after arrest`로.
- S20 (연명과 중단 갈등) · 3↔4 · "decision belongs to your family → To help with that, we can bring in the ethics team" 성립 → 4줄을 `Whatever you decide with their help, we'll support it`로.

### G. 기타 (낮음)
- #15 (S2.2) why · "시작 시각과 초기 체온을 함께 적으면…" ko 내용 되풀이 → `We'll + 동사로 팀의 약속처럼 말하고, and로 두 항목을 한 기록으로 묶어요`.
- #120 (S19.4) decoy `Once brain death is suspected` · 조립하면 "의심되면 가족에게 알린다"는 확인 전 고지 문장 → `Once the exam is finished`처럼 시점은 유지.
- #20 (S3.1) decoy `, so order` · "so order electrolytes often"이 ko "자주 재확인"과 가까움(경계) → `, so hold`는 위험 → `, so chart`.
- #40 (S6.3) decoy `, so let's hurry` · 정답의 반대말 decoy(브리프가 피하라 함) → `, so let's regroup`.
- S7 order 3줄 "Its first steps are surface counterwarming and sedation" vs #47 "start with acetaminophen and buspirone" · 같은 상황 안에서 1단계가 어긋남 → 3줄을 `Its first steps are acetaminophen, buspirone, and counterwarming`로.
- #115 (S18.6) D1 `가족에게 무엇이 가장 중요한지` · 환자 중심을 가족 중심으로 옮김(결정권 미묘) → `그분에게 무엇이 가장 힘든지`.
- #122 (S20.0) D2 `의료진께 몹시 힘든 결정` · 결정이 의료진 몫처럼 들림 → `형제분들께 몹시 힘든 결정`.
- (A 몫, 참고) #38 ko `팽팽하게 안정적으로`는 tightly의 직역 오역(→ `좁은 범위로`), S6 order 3줄 ko도 같음; #74 ko `비경련성 활동을 위해`는 "감지하려고"가 맞음.

## 종합
안전 2건(#92 물러남 삭제, #98 처치 지연)과 정답 둘 12건만 고치면 내보낼 수 있음. 빈칸의 동떨어진 오답(약 30문장)과 order 3↔4 모호 4장은 품질 항목이라 같이 고치는 것을 권함. 고칠 것 합계 70건(안전 2 · 정답 둘 12 · 문법 3 · 동떨어짐 29 · distractorsKo 저품질 13 · order 4 · 기타 7; A 몫 참고 1건은 제외).
