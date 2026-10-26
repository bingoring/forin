# fix-icu-resp-support-B — 한 번에 저작 B 검토 (v46 1~6·8 + distractorsKo ①~⑥·되풀이 상한)

대상: `icu-resp-support.yaml` (21상황 · 126문장 · order 21장). 문장 전수: `en|ko|오답1|오답2`, 빈칸 4줄, order 인접 교환을 스크립트로 뽑아 한 줄씩 판정.

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 대부분 말투·어순 이유를 짚음. S12.1(완곡 주장 틀림)·S16.2(위기 중 "더 일찍 했어야" 발언을 탓 아님으로 포장) 2건 |
| 2 빈칸 | 2 | 정답 둘 6건, 관사·수일치·구동사로 걸러지는 것 5건, 장면 이탈 오답 약 26문장, 위험 선택지 1건(S11.2 sleeps) |
| 3 decoy | 4 | 대부분 장소 구. "right away/now" 자리를 대신해 보고를 늦추는 조립 2건 |
| 4 distractorsKo | 3 | 응급 6문장에 과거형/의문형 같은 틀 되풀이(잘못된 안심·지시 망설임), 정답 처치를 다른 검사·처치로 바꾼 것 4건, 정답 둘 4건. 되풀이 상한 통과(최대 5: 체중·약·의사) |
| 5 order | 4 | 인접 교환은 모두 지시어로 잘 묶임. 임상 순서 3장 문제(S2 패드, S16 코드 호출, S19 의사 알림) |
| 6 tag·icon | 5 | 10자 이하, 상황 안에서 일관, 아이콘 적절 |
| 8 파일럿 갈래 | 2 | 장면과 동떨어진 빈칸 오답·같은 오답 묶음 돌려쓰기(thanked/greeted ×3, sweetly ×2, fingers/knees/ankles ×2, lunch/laundry ×3) |

## 심각한 문제 (안전)
1. **응급 지시문 오답 6문장이 같은 틀** — S15.1·S16.1·S18.2·S19.0·S19.2·S19.5의 오답 12개가 전부 "…했어요(과거)" + "…할까요?(의문)". 과거형은 "이미 했다"는 잘못된 안심, 의문형은 지시를 망설이는 말이 됩니다. 틀이 같아 듣지 않고도 걸러집니다.
2. **정답 처치를 다른 일로 바꿈** — S12.1 "삽관→검사/회진을 지연하면 안 돼요", S12.4 "삽관→채혈을 지연하고 싶지 않아요", S3.1 "단계를 올려요→장치 설명을 드려요/위치를 바꿔요", S15.0 "산소→순환/의식을 재평가"(산소 확인이 빠짐).
3. **시점 바꾸기** — S15.3 "교대하기 전에 기도와 호흡을 재평가", S7.4 "회진/교대하기 전에 선별".
4. **S10.2 오답 "물을 조금 마시면 마스크를 더 잘 견뎌요"** — NIV 중 경구 섭취는 흡인 위험입니다(S11 주제와 정면으로 어긋남).
5. **S11.2 빈칸 `sleeps`** — "If he sleeps, we remove the mask…" — 자는 고탄산 환자의 NIV를 벗기라는 말로 읽힙니다.
6. **order 임상 순서** — S16: "With him bagged, call the code"는 환기가 자리 잡을 때까지 코드 호출을 미룬다는 말입니다(코드 호출은 즉시·동시에). S19: "Even with that suction and oxygen, … notifying the physician now"는 처치가 실패한 뒤에야 알린다는 말입니다.

## 고칠 것 (총 67건 — 안전 18 · 정답 둘 10)

### A. 안전 (18)
1. S3.1 distractorsKo · 두 오답이 "단계를 올리는 일"을 대신함 · 들리는 자리(oxygen needs)를 바꿈: "호흡수가 늘어나면 장치 단계를 올려요" / 앞 단계로 바꿈: "산소 요구량이 늘어나면 의사에게 장치를 물어봐요"(의사 낱말이 상한 5회이므로 "팀에"로).
2. S10.2 distractorsKo "물을 조금 마시면…" · 흡인 위험 · 처치가 하나뿐인 문장이므로 참인 다른 효과로: "약을 조금 쓰면 마스크를 쓰고 더 잘 자는 데 도움이 돼요".
3. S12.1 distractorsKo "회진/검사를 지연하면 안 돼요" · 삽관을 다른 일로 바꿈 · 앞 단계로: "…보고를 지연하면 안 돼요" / "…팀 호출을 지연하면 안 돼요".
4. S12.4 distractorsKo "채혈을 지연하고 싶지 않아요" · 처치를 바꿈 · "…호출을 지연하고 싶지 않아요"(면회 쪽은 그대로 둬도 됨).
5. S15.0 distractorsKo "순환/의식을 재평가해요" · 산소 확인이 빠짐(ABC로 읽혀 정답 둘이기도 함) · 앞 단계로: "지금 바로 기도, 호흡, 산소를 볼 장비를 가져와요" 같은 틀로.
6. S15.3 distractorsKo "교대하기 전에" · 시점을 늦춤 · "다른 무엇보다 먼저 기도와 모니터 연결을 확인하고 있어요"처럼 바로 옆 단계로.
7. S7.4 distractorsKo "회진/교대하기 전에" · 선별 시점을 늦춤, 두 오답이 같은 틀 · 시점 말고 대상을 바꿈: "시작하기 전에 마스크 크기가 안 맞는 환자를 식별하고 있어요" 등.
8~13. S15.1 · S16.1 · S18.2 · S19.0 · S19.2 · S19.5 distractorsKo · 과거형/의문형 틀 되풀이(잘못된 안심·지시 망설임) · 브리프의 "같은 틀·같은 길이의 안전한 옆 단계"로 문장마다 다르게 다시 씀. 예:
   - S15.1 "FiO2를 올리고 즉시 흡인을 준비해요" / "FiO2를 올리고 즉시 산소포화도를 다시 봐요"
   - S16.1 "코드를 부르고 흡인기를 침상 옆으로 가져와요" / "코드를 부르고 산소통을 침상 옆으로 가져와요"
   - S18.2 "진정을 준비하고 지금 산소를 충분히 미리 줘요"(전산소화) / "진정을 준비하고 지금 흡인기를 켜 둬요"
   - S19.0 (ko를 고친 뒤) "좋은 쪽 폐를 보호하도록 출혈하는 쪽에 흡인기를 준비해요" 등
   - S19.2 "응급 기도 확보를 요청하고 지금 흡인기를 더 가져와요"
   - S19.5 "이건 응급 기도 상황이라 지금 흡인을 계속하고 있어요" / "…지금 기도 카트를 부르고 있어요"
14. S11.2 blank `sleeps` · 넣어 읽으면 위험 · `hiccups` 등으로 교체(xk "재채기/딸꾹질"은 위해 낮아 유지 가능).
15. S6.4 decoy "on a note" · `right away` 자리를 대신하면 "I'll flag it to the team on a note"(알림이 늦어짐) · "with the chart"처럼 시간 자리에 맞지 않는 장소 구로.
16. S12.2 decoy "with the form" · `now` 자리를 대신하면 보고를 미루는 문장이 됨 · 시간 자리에 맞지 않는 장소 구로("on the clipboard" 등; S0.2 "at the desk"와 겹치지 않게).
17. S16 order · 1↔2 임상 순서(코드 호출을 환기 확보 뒤로 미룸) · 2줄을 "While I start bagging, call the code and get the intubation cart."처럼 동시 지시로, 1줄 "He's about to arrest — start bag-mask ventilation now."와 묶어 순서가 정해지게.
18. S19 order · 3줄 "Even with that suction and oxygen…"이 처치 실패 뒤에야 알린다는 뜻 · 알림을 1·2줄 옆으로 앞당기거나 "While we suction, I'm notifying the physician now."로.

### B. 정답 둘 (10)
19. S16.2 distractorsKo "더 일찍 알렸어야 했어요" · escalate ≈ 알리다 · "더 일찍 기록했어야 했어요"류로(뒤집기 아님).
20. S15.5 distractorsKo "삽관 카트를 준비/삽관 장비를 점검" · 정답 행동(삽관 준비)의 일부이고 카트·장비는 en에서 안 들림 · 들리는 자리(called the physician)를 바꿈: "이미 호흡치료사에게 연락했고…"는 호출 대상 바꾸기라 ✕ → "이미 의사에게 연락했고 즉시 흡인을 준비하고 있어요" 정도로.
21. S6.3 distractorsKo "맥박은 내려가고" · en "His rate"가 호흡수/맥박을 가르지 않음(③) · "saturation" 쪽을 바꾼 오답 하나로 대체하거나 en을 "His respiratory rate"로(A와 협의).
22. S6.0 blank `divides` · ROX는 비율(SpO2/FiO2 ÷ RR)이라 정답으로 읽힘 · `ignores` 등으로.
23. S13.4 blank `after`(정답 둘), `during`(문법으로 걸러짐) · `the night` 등 명사구가 안 되니 빈칸을 `comparing`이나 `numbers`로 옮기길 권장.
24. S2.3 blank `move`·`lift` · 끈을 옮기거나 들어도 압박이 줄어 정답 · `tighten`, `twist` 등으로.
25. S0.3 blank `heart` · 사정 중 심음 청진도 맞는 말 · `belly`·`throat` 외 하나를 `stomach` 등 장면상 틀린 쪽으로.
26. S11.3 distractorsKo "위가 단단해 보여서" · 팽만 ≈ 단단함 · "위가 팽만해 보여서 낙상 위험을…"처럼 다른 자리를 바꿈(감염 위험 쪽은 유지).
27. S10.0 blank `chases` · follows와 거의 같은 뜻 · `pushes` 등으로.
28. S17.5 blank `quickly` · CO2 혼수의 느린 반응과 겹침 · `politely` 류(장면 이탈 피하려면 `loudly`)로.

### C. 빈칸 — 문법으로 걸러짐 (5)
29. S4.4 `an late/rare/final` · 관사 `an` 때문에 early만 맞음 · 모음 시작 형용사(`an old`, `an odd`, `an exact`)로.
30. S7.0 `an tall/young/quiet` · 같은 관사 문제 · `an older`, `an anxious`, `an obese` 등.
31. S5.1 `your heart/belly/brain are` · 수일치 · 복수명사(`kidneys`, `arteries`, `muscles`)로.
32. S1.4 `heating/filling/cooling out` · 구동사가 안 됨 · 빈칸을 `airway`로 옮기고 선택지 `skin`/`eyes`/`ears`.
33. S1.5 `sleeps/moves/leans to the flow` · 비문 · `returns`/`listens`/`belongs`처럼 `to`가 붙는 동사로.

### D. 빈칸 — 장면 이탈·돌려쓰기 (26) — 같은 분야에서 틀린 말로 교체
34. S0.5 sleep/eat/dress · 35. S3.5 wake/eat/work · 36. S4.2 food/water/ice · 37. S7.5 garments/utensils/belongings · 38. S9.0 dust/food/ice · 39. S9.1 noise/itch/smell · 40. S10.1 sing/smile/wave · 41. S10.5 color/mood/name · 42. S11.5 warm/wash/paint · 43. S13.3 smell/speed/color · 44. S14.1 color/price/label · 45. S14.5 light/sound/heat · 46. S15.2 eat/smile/sneeze · 47. S16.0 sleep/cry/shout · 48. S16.1 dressing/laundry/linen · 49. S17.1 wallet/schedule/privacy · 50. S17.3 gently/softly/sweetly · 51. S18.2 paperwork/lunch/laundry · 52. S19.0 wash/weigh/polish · 53. S19.1 politely/cheerfully/sweetly · 54. S19.4 dust/paper/hair · 55. S20.0 diet/shift/bill · 56. S20.5 noise/light/smell
57~59. 돌려쓴 묶음: S12.5 thanked/greeted/waved · S15.5 visited/thanked/greeted · S19.2 thank/greet/invite — 셋 다 "의사에게 인사" 묶음. (fingers/knees/ankles S4.3·S10.4, dialysis/biopsy S7.2·S13.1도 겹치나 장면 안이라 참고)

### E. distractorsKo 기타 (4)
60. S3.5 · 두 오답 "더 작은 방/병실로 옮길 수 있어요"가 서로 거의 같고 정답에서 두 곳 이상 바뀜 · 하나는 "smaller device" 자리를 바꿈("더 큰 장치로…"는 뒤집기라 ✕ → "더 조용한 장치로").
61. S14.2 · "체온 36에서 37", "맥박 60에서 90" — 세 곳(항목+숫자 둘)을 바꿈, 숫자는 en에서 안 들림 · 한 곳만 바꿈: 대상("이 환자에게는" → "이 병동에서는 산소포화도 92에서 96이 목표예요") 또는 사람("For him" 자리) 쪽으로.
62. S7.2 · "보호자 협조가 안 되면" — en "he"라 안 들림(③), "삽관을 설명해야"는 고려를 설명으로 바꿔 판단을 미룸 · "협조가 안 되면 대신 삽관을 의사와 상의해야 해요" 등.
63. "사진으로 보고" 틀 4회(S6.4·S6.5·S12.2·S12.5) · 상한 안이나 같은 틀이라 S6.5·S12.5 둘은 다른 세부로.

### F. why (2)
64. S12.1 · "shouldn't delay는 '하자'보다 완곡" — 부정 명령은 완곡이 아니라 시급함을 강조함 · "미루지 말자고 말해 지체의 위험을 짚어요"로.
65. S16.2 · "탓하기보다 지금 서두르자는 말" — 위기 중 침상에서 "더 일찍 했어야"는 실제로 탓으로 들리고 디브리핑에서 할 말 · why를 고치거나(A와) 문장 자체를 재검토.

### G. order 기타 (2)
66. S2 · 패드(콧등 보호)를 마지막에 붙임 — 압박손상 예방 드레싱은 마스크를 씌우기 전·맞출 때 붙이는 것이 권장 · 순서를 "패드 → 착용·끈 → 요청 → 조정"으로.
67. S13 · 4줄 "If those numbers start to fail" — 수치가 fail하지 않음 · "If he starts to fail, we still have a window for escalation."

## 참고 (A 몫·사실 — 개수에 넣지 않음)
- S1.3 "oxygen percentage is set to match it(유량)" — FiO2는 유량이 아니라 SpO2 목표에 맞춰 조정.
- S3.2·S3.4·S3 order "non-rebreather … the highest step" — 기계 없는 장치 중 최고일 뿐, ICU 사다리는 HFNC·NIV로 이어짐("without a machine" 한정을 유지할 것).
- S9.0 "pushes the fluid out of your air sacs", S8.4 "helps you breathe out" — 환자용 단순화로 허용 범위이나 기전과는 다름.
- S16.3 "breathing is barely there … treat this as an arrest" — 의료인은 맥박 확인 후 심정지 판단; S16 en "about to arrest"의 ko "심정지"는 상황 제목(호흡정지 임박)과 어긋남.

## 저작자 메모(notes-icu-resp-support-B.md) 판정
- S16.5 "get him to the bedside kit" — **동의, 고칠 것.** 환자를 키트로 옮기는 말이 됨. 예: "Let's secure his airway immediately with the bedside airway kit." / ko "침상 옆 기도 키트로 즉시 기도를 확보해요". 빈칸(hallway/entrance/lobby — 장면 이탈)과 distractorsKo도 새 문장에 맞춰 다시 씀. S16.2와 "let's secure the airway immediately"가 겹치는 것도 함께 정리.
- S19.0 ko 조사 호응 — **동의.** "출혈하는 폐가 아래로 가게 눕혀요"로; distractorsKo 둘은 새 ko 틀로 다시(위 8~13의 옆 단계 원칙).
- S12.2·S13.4 — 참고 메모 확인, ko 문제 없음.
- "응급 문장은 시제·의문형으로만 바꿈" — **동의하지 않음.** 지시 동사를 남기는 원칙은 맞지만 6문장이 같은 틀이라 듣지 않고 걸러지고, 과거형은 잘못된 안심, 의문형은 지시 망설임이 됩니다. 위 8~13처럼 옆 단계로.

## 되풀이 상한 (스크립트, 조사 뗀 낱말)
최다 5회: 체중·약·의사(S9.2·S15.3·S16.0·S16.4·S17.2) — 상한 안이나 **의사는 더 쓰지 말 것**. 4회: 혈압·체온·소리·물·맥박·사진·기침. 교대 3회(S7.4·S15.3·S16.0)는 위 고칠 것에서 함께 정리됩니다.

## 종합
안전 18건(특히 응급 6문장 오답 틀, 처치 대체 오답, S10.2 물 마시기, S11.2 sleeps)과 정답 둘 10건을 고치면 내보낼 수 있습니다. 빈칸 장면 이탈 26문장은 수가 많으니 한 번에 같은 분야 오답으로 바꾸길 권합니다.
