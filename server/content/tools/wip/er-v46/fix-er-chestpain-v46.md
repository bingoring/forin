# er-chestpain — v46 보강 검토 (er)

대상: `er-chestpain.yaml` (상황 22 · 문장 111 · order 22장 · 뉘앙스 swap 10 · context 13). 문장 111개·order 22장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = 흉통 초기 문진 … S21 = 불안정 협심증 야간 재발), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 444줄, decoy를 청크 자리마다(+끝 앞) 넣은 조립 약 560줄, order 인접 교환 66가지,
context `word`가 세 장면의 `en`에 실제로 나오는지, swap `ko` 10건(정답을 넣은 문장과 대조), decoy·`distractorsKo` 중복, base와 v44 필드 비교(바뀐 것 없음).

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다.
문법도 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 오답·decoy는 괜찮은 것으로 봤다(예: 2.2 `flat`, 12.4 `asleep`, 15.1 `legs`, 18.1 `informed`).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유(어순·완곡·공감·안전)를 짚고, 임상 사실도 맞다. 저작자가 꼽은 6건은 모두 맞다(아래 자기 보고 3). 고칠 것: 10.3 "조사"(영어에는 조사가 없다), 15.1(혈압 차이가 없어도 박리를 배제하지 못한다는 말이 빠짐), order 카드 why 2건(S19 "반응이 있으면 도움을 부른다", S17 "순서가 하나예요"가 사실이 아님). `ko`를 되풀이하거나 뜻만 푸는 것(13.2·20.4)은 사소하다. |
| 2 | 빈칸 | 3 | `ko`까지 보면 정답이 둘인 문장은 없다. 문제는 세 가지다. ① 뒤집기 오답이라 논리만으로 걸러지는 것 5문장(7.2 `forget/ignore/skip`, 12.1 `blame/ignore/avoid`, 18.3 `hide/ignore/increase`, 8.2 `less/nothing/only one thing`, 4.4 `guesses/rumors/words`). ② 시간 단위 묶음 7문장(2.4 8.3 9.3 13.1 20.0 21.1 21.4). ③ 동떨어지거나 문법으로 걸러지는 오답 몇 개(0.3 `rate/locate what…`, 10.2 `electrician`, 11.3 `losing`, 2.3 `at discharge/after you leave`). 13.0 `hidden`은 `ko` "비밀"과 뜻이 가깝다. |
| 3 | `decoy` | 4 | 대부분 비문이 되거나 `ko`와 어긋난다. `ko`에도 맞는 다른 문장이 되는 것이 2개다: 11.3 `about taking`(→ `Are you okay about taking this medicine now?`), 14.1 `it hurts`(→ `Can you point to where it hurts?`). 경계선: 18.3 `will cure`(과장된 약속이 `ko` "나아질 거예요"에 맞음), 12.2 `for him`, 13.3 `to blame you`. 중복(`how long` 0.3·4.3, `your weight` 1.0·16.2, `later today` 2.3·20.2)은 사소하다. |
| 4 | `distractorsKo` | 2 | 이어진 검토에서 되풀이된 갈래가 이 주제에도 그대로 있다. 오답 뜻을 "정답 뒤집기"로 만든 것이 약 45문장이다. 아무도 하지 않을 말(`두통은 전혀 생기지 않아요`, `도움은 부르지 않을 거예요`, `더 시끄러운 곳으로 가면 잘 들리실 거예요`)은 듣지 않고도 걸러진다. 반만 다른 말(19.4 `제 이름을 말씀해 보세요`, 21.1 `덜 자주`, 6.4 `심전도만 하고 피 검사는 안 해요`)은 들을 때 정답이 둘이 된다. 9.1 `스텐트를 언제 뺐는지`는 임상적으로 틀렸다(스텐트는 빼지 않는다). S0~S4는 대체로 좋다. |
| 5 | `order` | 3 | 앞 줄을 가리키는 말로 묶은 설계는 잘 됐다. 인접 교환이 자연스러운 카드는 S17(3↔4)이고, S4·S13(3↔4)은 약하게 열려 있다(자기 보고 2). 더 큰 문제는 임상 흐름이 틀린 카드 6장이다: S11(부작용을 동의 **뒤에** 설명), S15(의사 호출이 양팔 혈압 수치에 달림), S16(산소포화도를 맨 끝에 잼), S9·S21(모두에게 묻는 병력·보고를 조건부로), S19(why가 호출을 조건부로 설명). `ko` 머리말은 모두 카드 내용과 맞다. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다. 아이콘이 어긋나는 것은 사소하다: 18.3 `trophy`(기대 안내), 3.0 `bulb`(악화 요인), 9.0 `compass`(이전과 비교). |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko` 10건은 모두 정답을 넣은 문장의 뜻이다. context `ko`도 정확하다. 다만 S1 `priority`와 S20 `update`는 세 장면의 `en` **어디에도** 그 낱말이 없다(S1은 `ESI 2`, S20은 `notified/escalating`). 화면 제목 "`priority`가 어색한 장면은?"이 성립하지 않는다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진·뒤집기 오답 약 9문장, 시간 단위 묶음 7문장. 관사는 잘 지켰다(`an MRI/an ultrasound/an X-ray`, `an unusual/an obvious/an extra`). (3) order 못 박기: 위 5. (4) 임상 순서·사실: order 6장, dKo 1건(9.1). (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S11 order — 동의를 받은 뒤에 부작용을 설명한다.** L2 `Are you okay with taking it now?` → L3 `If you say yes, it may cause a headache…`.
   동의는 부작용을 들은 **뒤에** 받아야 한다(설명 후 동의). 상황 brief도 "목적·투여법·부작용을 설명하고 투여 동의를 얻으세요"로 동의가 마지막이다.
   why("동의를 구하고, 동의하면 생길 수 있는 불편을 알리고")도 같은 순서를 가르친다.
2. **S15 order L3 `With those numbers, I'm getting the doctor immediately.`** — 의사 호출이 양팔 혈압 수치에 달린 것처럼 읽힌다. 찢어지듯 등으로 뻗는 흉통이면
   혈압 차이와 상관없이 바로 알린다. 양팔 혈압 차이는 박리 환자의 일부에서만 보이므로, **차이가 없다고 안심하면 안 된다**. 15.1 why에도 이 말이 없다.
3. **S16 order — 산소포화도를 맨 끝에 잰다.** L4 `Since it may be a warning sign, I'll check your oxygen level…`가 병력 두 줄 뒤에 온다. 같은 주제 16.2 why가
   "숨이 차거나 갑자기 아프면 산소 수치를 일찍 확인해요"라고 하니 서로 어긋난다. L3 `sudden shortness of breath`는 L1·L2에서 환자가 말한 적이 없는 증상이고,
   L4가 L3의 `warning sign`을 그대로 되풀이한다(파일럿 3에서 금한 것).
4. **S19 order why "반응이 있으면 도움을 부른다고 알리고"** — 급속 악화 환자는 반응이 있든 없든 바로 도움을 부른다(반응이 없으면 더 급하다). 영어 줄
   `Good. I'm calling for help right now`는 반응을 받아 주는 말로 읽히니 그대로 둬도 되지만, why는 조건부 호출을 가르친다.
5. **9.1 `distractorsKo` `스텐트를 언제 뺐는지 말씀해 주세요`** — 관상동맥 스텐트는 빼지 않는다. 오답이어도 학습자에게 틀린 임상 그림을 준다.
6. **S9·S21 order — 모두에게 하는 확인을 조건부로 묻는다.** S9 L2 `If it is [the same], which medications and stents…`: 약·스텐트 이력은 통증이 같든 다르든 묻는다.
   S21 L2 `If it did [come on at rest], is it happening more often…`와 L3 `Since it's changing like that, I'm going to reassess you and let the team know`: 안정 시 흉통만으로도
   재평가하고 보고할 일인데, 빈도가 늘었을 때만 보고하는 흐름으로 읽힌다.

## 저작자 자기 보고 판정

1. **`ko`로만 걸러지는 선택지** — 둘로 갈린다.
   - 7.1 `Have you ever had heart attacks like this before?`: **그대로 둬도 된다.** 낱장 머리의 `ko`가 "공황발작"이라 정답이 하나로 정해지고, `heart`는
     같은 분야(공황 vs 심장)에서 틀린 말이라 파일럿 2(a)·(b)에 맞는 좋은 오답이다. 같은 이유로 괜찮은 것: 2.2 `flat`, 5.4 `awake`, 12.4 `asleep`, 15.1 `legs`, 18.1 `informed/calm`, 0.4 `zero to five`.
   - 7.2 `We'll still skip/ignore/forget your heart to make sure everything is okay.`: **고칠 것.** `ko` 이전에 문장 자체가 모순("확인하려고 건너뛰어요")이라
     논리만으로 걸러지는 뒤집기 오답이다. 같은 분야에서 틀린 동사로 바꾼다(아래). 같은 문제가 있는 것: 12.1, 18.3, 8.2, 4.4.
2. **order 4번째 줄을 `Based on…`·`From your answers`·`For that reason`에 기댐** — 실제로 쓰인 것은 S4 `From your answers`, S13 `For that reason`이고, `Based on…`은 없다.
   - S4: L2 → L4 → L3로 바꾸면 "결론을 말한 뒤 다시 병력을 묻는" 흐름이라 어색하지만 말이 안 되지는 않는다. `From your answers`는 L2의 답만으로도 받을 수 있다. **약하게 열림** → L4가 L3의 답을 가리키게 고친다.
   - S13: L2 → L4(`For that reason, I'll tell the doctor…`) → L3도 L2의 답을 "이유"로 받을 수 있다. **약하게 열림** → L4가 L3의 `unsafe`를 받게 고친다.
   - 저작자가 꼽지 않은 **S17은 3↔4가 실제로 열려 있다**: L2 → `If so, this sharp, positional pain can point to inflammation…` → `With that pattern, have you had a recent fever…?`도
     자연스럽다(`If so`가 L2에도 붙고 `With that pattern`이 L4 뒤에도 붙는다).
   - S8 `That's why`, S1 `Because of that`, S6 `To do that`, S12 `there`, S18·S20 시간 표지는 교환하면 앞뒤가 깨진다. 잠겨 있다.
3. **`why`의 임상 사실 6건** — **모두 맞다.**
   - 5.1 도착 10분 안 12유도 심전도: ACC/AHA 지침이 맞다. 다만 "미국 심장학회"는 보통 ACC를 가리킨다. AHA까지 담으려면 "미국심장협회·미국심장학회(AHA/ACC)"로 쓰는 편이 정확하다(사소).
   - 15.1 양팔 혈압 차이와 대동맥 박리: 맞다. 다만 차이가 없어도 박리를 배제하지 못한다는 말을 덧붙여야 안전하다(위 심각 2와 함께 고칠 것).
   - 11.0·11.1·11.4 니트로글리세린 설하정: 혀 밑에서 녹임, 혈관 확장, 두통·어지러움(저혈압), 투여 후 혈압 재측정. 모두 맞다.
   - 6.1·6.2·6.3 당뇨·여성의 비전형 증상, 신경병증으로 통증이 무뎌짐: 맞다. 6.2와 6.3 why의 둘째 문장은 거의 같아서 하나는 다른 이유로 바꾸면 좋다(사소).
   - 10.2 훈련된 의료 통역사(가족 통역 대신): 맞다(Title VI·ACA §1557, Joint Commission).
   - 13.1·13.4 코카인 관련 약 선택 주의: 맞다(급성 코카인 중독에서 베타차단제는 신중하게, 벤조디아제핀 우선). 표현은 "주의가 필요"로 단정을 피해 적절하다.

## 고칠 것 (v46 필드)

### why (5)
- 10.3 · "조사와 시제를 줄인"은 영어에 맞지 않음 → "관사·be동사·조동사를 뺀 짧은 문장이 영어가 서툰 환자에게 더 잘 전달돼요."
- 15.1 · 둘째 문장 뒤에 덧붙임 → "…볼 수 있는 소견이에요. 다만 차이가 없다고 박리가 배제되지는 않아요."
- S19 order why · "반응이 있으면 도움을 부른다고 알리고" → "의식을 먼저 확인하고, 바로 도움을 부른다고 알리고, 기다리는 동안 이름을 말하게 해 의식을 이어 가고, 팀이 도착했음을 알려요."
- S17 order why · "순서가 하나예요"가 사실이 아님 → 아래 order 수정에 맞춰 다시 씀.
- 5.1 (사소) · "미국 심장학회 지침" → "미국심장협회·미국심장학회(AHA/ACC) 지침".

### 빈칸 (blank)
뒤집기 오답(논리만으로 걸러짐) → 같은 분야에서 틀린 말로:
- 7.2 · `forget/ignore/skip` → `check*/treat/fix/calm`.
- 12.1 · `blame/ignore/avoid` → `update*/test/admit/discharge`.
- 18.3 · `hide/ignore/increase` → `relieve*/mask/worsen/trigger`.
- 8.2 · `less/nothing/only one thing` → `everything*/your name/the time/the date` (`ko` "다 말씀해"가 거름).
- 4.4 · `guesses/rumors/words` → `tests*/questions/medicine/your doctor`.

시간 단위 묶음(7문장) → 빈칸을 다른 가르치는 말로 옮기거나 오답을 바꿈(새 answer는 `en`에 낱말 경계로 한 번만 나옴):
- 2.4 · `days/weeks/hours` → answer `results`: `results*/forms/bills/pads`.
- 8.3 · `minute/hour/day` → `detail*/test/visit/medicine` (decoy `every minute`도 `every visit`으로).
- 9.3 · `last week/month/night` → answer `stronger`: `stronger*/lighter/colder/slower`.
- 13.1 · `week/year/day` → answer `use`: `use*/eat/drink/buy` (`take`는 `ko` "사용"에도 맞으니 넣지 말 것).
- 20.0 · `yesterday/last year/before lunch` → answer `compare`: `compare*/react/belong/return` (`before lunch`는 "아까"로도 읽혀 경계선이었음).
- 21.1 · `last week/last year/yesterday` → answer `often`: `often*/slowly/quietly/gently`.
- 21.4 · `last week's/yesterday's/Monday's` → answer `episode`: `episode*/dose/test/visit`.

동떨어지거나 문법·뜻으로 걸러지는 오답:
- 0.3 · `rate/locate what the pain feels like`는 동사와 목적절이 안 맞음 → `describe*/remember/imagine/record` (`explain`은 `ko` "설명해"에 맞으니 쓰지 말 것).
- 13.0 · `hidden`은 `ko` "비밀이 지켜지고"와 뜻이 가까움 → `confidential*/public/shared/unchanged`.
- 10.2 · `electrician`은 장면과 동떨어짐 → `An EMT` (관사 `An` 유지): `interpreter*/orderly/intern/EMT`.
- 11.3 · `losing` 동떨어짐 → `taking*/refusing/giving/stopping`.
- 2.3 · `at discharge/after you leave`는 심전도 장면과 동떨어짐 → `right away*/after the test/at the end/next time`.

### decoy
`ko`에도 맞는 다른 문장이 되는 것:
- 11.3 · `about taking` → `Are you okay about taking this medicine now?`가 `ko`와 같음 → `before taking`.
- 14.1 · `it hurts` → `Can you point to where it hurts?`가 `ko`와 같음 → `it itches`.
- 18.3 · `will cure` → `This procedure will cure your chest pain quickly`는 과장된 약속인데 `ko` "나아질 거예요"에 맞음 → `will cause`.

경계선(보고만, 고쳐도 됨): 12.2 `for him`(`ko` "필요하신"이 듣는 사람을 가리켜 거의 걸러짐), 13.3 `to blame you`("판단" ↔ "탓"이 가까움 → `to report you` 권장).

### distractorsKo
정답 뒤집기·아무도 하지 않을 말·반만 다른 말을 같은 상황에서 실제로 할 법한 다른 말로 바꾼다. 아래에서 [0]·[1]은 몇 번째 오답인지다.
- 0.5 [0] · "지금 약을 드신 적 있나요?" 한국어가 어색함 → "평소에 드시는 약이 있나요?"
- 2.3 [0] · "불편한 건 참아 주셔도 돼요" → "검사 중에는 말씀을 잠시 멈춰 주세요"
- 5.1 [1] · "의사 선생님이 곧 퇴원시켜 주실 거예요"(STEMI 장면과 동떨어짐) → "먼저 피검사를 하고 기다려 볼게요"
- 5.3 · 둘 다 뒤집기 → "통증이 언제 시작됐는지 다시 여쭤볼게요" / "심전도 결과가 나오면 설명해 드릴게요"
- 5.4 · 둘 다 → "숨을 천천히 깊게 쉬어 보세요" / "가족분께 연락해 드릴까요?"
- 6.1 [0] · "가슴이 아프지 않으면 심장은 괜찮아요" → "이 증상은 혈당 때문일 수도 있어요"
- 6.2 [0] · "당뇨가 없으시니…" → "당뇨약을 오늘 드셨는지 확인하고 싶어요"
- 6.3 · 둘 다(동떨어짐·반만 다름) → "당뇨가 있으면 상처가 잘 안 나을 수 있어요" / "여성분들은 심장병이 늦게 오는 편이에요"
- 6.4 · 둘 다(반만 다름·뒤집기) → "결과가 나오면 의사 선생님이 설명해 주실 거예요" / "검사 전에 혈당부터 재 볼게요"
- 7.0 [1] · "숨을 최대한 빨리 쉬세요" → "잠깐 앉아서 기다려 주세요" (종이봉투 호흡은 권장되지 않으니 쓰지 말 것)
- 7.2 [0] · "불안 때문이니 심장은 확인하지 않아요" → "불안할 때 드시는 약이 있으세요?"
- 7.4 · 둘 다 → "공황 증상은 보통 몇 분 안에 가라앉아요" / "심장 검사 결과는 의사 선생님이 설명해 주실 거예요"
- 8.0 [0] · "가벼운 조임은 신경 쓰지 않으셔도 돼요" → "통증이 몇 점인지 말씀해 주시겠어요?"
- 8.2 · 둘 다 → "언제부터 그러셨는지 말씀해 주세요" / "보호자분도 같이 들어오셔도 돼요"
- 8.3 · 둘 다 → "천천히 하나씩 말씀하셔도 돼요" / "지금 드시는 약을 모두 알려 주세요"
- 8.4 · 둘 다 → "작은 증상이 언제부터였는지 여쭤볼게요" / "증상을 적어 두시면 도움이 돼요"
- 9.1 [1] · "스텐트를 언제 뺐는지"(임상적으로 틀림) → "스텐트 시술을 어느 병원에서 받으셨나요?"
- 9.4 [1] · "병력은 퇴원하실 때 말씀해 주세요" → "예전 진료 기록을 받아 볼게요"
- 10.3 [0] · "의사예요. 지금 수술할게요" → "간호사예요. 이름을 말해 주세요"
- 11.1 [0] · "두통은 전혀 생기지 않아요" → "혀 밑이 조금 따끔할 수 있어요"
- 11.2 [0] · "통증이 달라져도 말씀 안 하셔도 돼요" → "5분 뒤에 통증을 다시 여쭤볼게요"
- 11.4 · 둘 다(뒤집기·틀린 처치) → "약을 드신 뒤에는 잠시 누워 계세요" / "5분 뒤에 통증 점수를 다시 여쭤볼게요"
- 12.0 [0] · "남편분은 지금 집에 가셨어요" → "남편분은 지금 검사실에 가 계세요"
- 12.2 [0] · "이런 일은 무서울 것 하나 없어요" → "남편분 드시는 약을 알려 주시겠어요?"
- 12.3 · 둘 다 → "연락처를 남겨 주시면 전화드릴게요" / "대기실은 복도 끝에 있어요"
- 13.4 · 둘 다 → "다른 약이나 술도 함께 드셨나요?" / "소변 검사로 확인할 수도 있어요"
- 14.0 · 둘 다 → "보청기를 가져오셨나요?" / "가족분이 대신 답해 주셔도 돼요"
- 14.3 [0] · "더 시끄러운 곳으로 가면…" → "보청기를 끼워 드릴까요?"
- 14.4 · 둘 다 → "답을 종이에 적어 주시겠어요?" / "가족분께도 설명해 드릴게요"
- 15.2 · 둘 다 → "통증이 몇 점인지 말씀해 주세요" / "가족분께 연락해 드릴게요"
- 15.4 · 둘 다 → "검사 전까지는 아무것도 드시지 마세요" / "옆으로 누워 계셔도 돼요"
- 16.3 · 둘 다 → "최근에 다리가 붓거나 아프셨나요?" / "숨이 차면 바로 말씀해 주세요"
- 17.4 [0]·[1] · "심장 소리를 녹음해 둘게요", "숨소리를 크게 내 보세요" → "숨을 잠깐 참아 주세요" / "폐 소리도 같이 들어볼게요"
- 18.2 [0] · "새로운 통증은 말하지 않아도 돼요" → "시술 중에는 깨어 계실 수 있어요"
- 18.4 · 둘 다 → "가족분께는 제가 알려 드릴게요" / "시술은 한 시간쯤 걸려요"
- 19.0 [0] · "제 목소리를 따라 하지 마세요" → "제 손을 꽉 잡아 보세요"
- 19.1 [1] · "도움은 부르지 않을 거예요" → "산소를 조금 더 올릴게요"
- 19.2 · 둘 다 → "산소 마스크를 씌워 드릴게요" / "가슴이 지금 얼마나 아프세요?"
- 19.3 [0] · "안색이 좋아져서 천천히 움직일게요" → "혈압이 떨어지고 있어서 산소를 올릴게요"
- 19.4 [1] · "제 이름을 말씀해 보세요"(your/my만 다른 반만 다른 말) → "오늘이 무슨 요일인지 말씀해 보세요"
- 20.2 [0] · "의사에게는 알리지 않을게요" → "통증 약을 지금 더 드릴게요"
- 20.3 · 둘 다 → "통증이 몇 점인지 다시 말씀해 주세요" / "다음에도 아프면 이 버튼을 눌러 주세요"
- 21.1 [0] · "이게 예전보다 덜 자주 일어나나요?"(반만 다름) → "이럴 때 니트로를 드셔 보셨나요?"
- 21.2 · 둘 다 → "지금 바로 심전도를 다시 찍을게요" / "통증 약을 먼저 드릴게요"
- 21.3 [0] · "자다가 깨는 건 대개 걱정할 필요가 없어요" → "잠은 평소에 잘 주무시나요?"
- 21.4 · 둘 다 → "오늘 밤 통증이 몇 시에 시작됐나요?" / "예전 통증 때 드신 약을 알려 주세요"

같은 방식이라 바꾸면 좋지만 급하지 않은 것: 1.3 [0], 2.1 [1], 3.0 [1], 10.4 [1], 12.1 [1], 13.0 [1], 13.2 [1], 13.3 [1], 15.1 [0], 15.3 [0], 16.2 [1], 18.1 [0]·[1], 18.3 [0], 20.1 [0].
중복(사소): "제가 잠깐 자리를 비울게요"(7.0·19.0), "통증이 어디로 퍼지나요?"(0.0·0.2) 외 4쌍.

### order (8장)
- S11 · 동의를 부작용 설명 뒤로(심각 1) → L1 `This tablet goes under your tongue to relax your heart's vessels.` / L2 `It may cause a headache or make you feel lightheaded.` / L3 `Knowing that, are you okay with taking it now?` / L4 `If so, I'll keep checking your blood pressure after you take it.`; why "약과 쓰는 법을 알리고, 생길 수 있는 불편을 미리 말한 뒤, 그걸 알고도 괜찮은지 동의를 받고, 동의하면 투여 후 혈압을 계속 잰다고 맺어요."
- S15 · L3 → `Whatever those numbers show, I'm getting the doctor immediately.` (호출이 수치에 달리지 않게, L2는 계속 가리킴); why "그 수치와 상관없이 바로 의사를 부르고"로.
- S16 · 산소를 앞으로(심각 3) → L1 `Does the pain get worse when you breathe in deeply?` / L2 `While we talk, I'll check your oxygen level right away.` / L3 `Have you had any long flights, surgery, or leg swelling recently?` / L4 `If so, that can be a warning sign, so we'll get a scan of your lungs.`; why를 맞춰 고침. (L2↔L3 교환을 막는 데는 `While we talk`가 약하니, 고친 뒤 인접 교환을 다시 볼 것.)
- S17 · 3↔4가 열림 → L4 `If you've been sick recently, this sharp, positional pain can point to inflammation around the heart.` (L3의 답을 가리킴); why에서 "순서가 하나예요"는 고친 뒤에만 쓴다.
- S4 · 3↔4가 약하게 열림 → L4 `If you did, this pain usually isn't dangerous, but we'll still run tests.` (L3의 lift/strain을 가리킴).
- S13 · 3↔4가 약하게 열림 → L4 `To keep those treatments safe, I'll tell the doctor right away.` (L3의 `some treatments … unsafe`를 가리킴).
- S9 · 약·스텐트 이력을 조건부로 물음 → L2 `Either way, which medications and stents have you had before?` (`Either way`가 L1의 예/아니오를 받음).
- S21 · 빈도·보고를 조건부로 → L2 `Either way, has it been happening more often or lasting longer than before?` / L3 `With pain at rest, I'm going to reassess you and let the team know right now.`; why에서 "그런 변화를 근거로 보고"를 "안정 시 흉통이니 바로 재평가·보고"로.

### context
- S1 · `word: priority`가 세 장면 어디에도 없음(`ESI 2`만 나옴) → 어색한 장면을 `You're a high priority, so you'll be roomed immediately — you're an ESI 2.`처럼 `priority`가 들어가게 고치거나, `word`를 `ESI`로(그러면 `ko`도 "중증도 등급").
- S20 · `word: update`가 세 장면 어디에도 없음 → 동료 장면 끝을 `…repeat ECG is done. Just updating you — can you come see her?`로, 어색한 장면을 `Updating the MD — recurrent CP, repeat ECG done.`처럼 `update`가 들어가게 고침.

### tag·icon (사소)
- 18.3 `trophy` → `star` 또는 `chartup`(기대 안내). 3.0 `bulb` → `chartup`(같은 상황 악화 요인과 맞춤). 9.0 `compass`는 그대로 둬도 된다.

## 결정 11 (v44 문장·청크 — 보고만, 이번 범위 밖)
- 10.0~10.4 · 청크가 문장 경계를 넘음(`? Point for me`, `? Show me`, `. You are safe`, `. I check you`, `. Good`). 일부러 짧게 끊은 문장이라 keyPhrase 여부에 따라 둘 것.
- 9.1 `ko` "약과 스텐트를 이전에 하셨었나요?"가 어색함 → "이전에 어떤 약을 드셨고 어떤 스텐트를 넣으셨나요?"
- 1.4 `placing you in a higher priority`는 다소 어색함(`giving you a higher priority`/`moving you up`이 자연스러움). S1 order L4는 이미 `moving you up`을 쓴다.
- 5.2 `ko` "저와 함께 있어요"는 `stay with me`(정신 놓지 마세요, 제게 집중하세요)의 뜻과 다르다. 19.0은 "정신 놓지 마세요"로 바르게 옮겼다.
- 13.0 `Everything you tell me stays confidential` — 실제 비밀 보장은 "치료팀 밖으로 나가지 않는다"는 뜻이다(S13 order L4에서 의사에게 알림). why에 "치료팀 안에서만 쓰여요"를 덧붙이면 정확하다(선택).

## 고칠 것 개수
- why 5 · 빈칸 17 · decoy 3(+경계선 2) · distractorsKo 46문장(+급하지 않은 것 15) · order 8장 · context 2 · tag·icon 2 — **합계 83건**(경계선·사소·결정 11 제외).

## 종합
v44 필드는 base와 한 글자도 다르지 않고, why·빈칸·decoy의 바탕은 단단하다. 고칠 것은 distractorsKo의 뒤집기 패턴(약 45문장)과
임상 흐름이 틀린 order 6장(특히 S11 동의 순서, S15 혈압 수치에 달린 호출, S16 늦은 산소 측정)이다. 이 둘과 decoy 2건을 고친 뒤
order 인접 교환을 다시 돌려 보면 내보내도 된다.
