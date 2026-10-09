# er-pain-sedation — v46 보강 검토 (er)

대상: `er-pain-sedation.yaml` (상황 21 · 문장 126 · order 21장). 문장 126개와 order 21장을 모두 읽었다.
상황 번호는 파일 순서대로 0부터 셌다(S0 = 통증 척도 초기 사정 … S20 = 중증 외상 통증 위기). 문장은 `상황.문장`(0부터)으로 적었다.
base와 비교해 보니 v44 문장 필드는 한 글자도 바뀌지 않았다.

스크립트로 모두 뽑아 본 것은 다음과 같다. 빈칸 `before+선택지+after` 504줄, decoy를 청크 자리마다 넣은 조립 약 440줄, order 인접 교환 63가지,
context `word`가 장면에 들어 있는지. 아래 빈칸 제안안 45문장도 스크립트로 다시 넣어 확인했다. 넷이 서로 다르고, 정답이 들어 있고,
정답이 `en`에 낱말 경계로 한 번만 나온다.
제안한 decoy 7개도 확인했다. 청크와 같지 않고 `en` 안에 없다. 새로 쓴 order 줄은 모두 15단어 이하이고, 아이콘은 모두 NbIcon 목록에 있다.

판정 기준: 빈칸·조립 낱장 머리에는 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다.
문법이 맞고 장면상 그럴듯해도 `ko`가 걸러 주는 오답은 괜찮은 오답으로 봤다. 예: 0.3 `better`, 5.4 `failed`, 8.2 `allergies`, 9.2 `talk/work`,
13.4 `worse`, 18.3 `wake`. 선택지 아이콘은 T8 결정에 따라 보지 않았다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이다. 말하는 방식의 이유(would, Let me know if, might, I notice, Some patients…, too … to)를 짚고, `ko` 되풀이는 거의 없다. 고칠 것은 6건이다. 환자 안전과 관련된 것은 1.5(졸림이 "정상"이라고만 함), 그 밖에 9.3·14.2·6.3·13.2·16.5. 가장 큰 사실 오류는 order S15의 `why`에 있다(아래 5). |
| 2 | 빈칸 | 2 | `ko`로 걸러지지 않아 정답이 둘인 것은 **15.4** 하나다(`because`/`while`). 그러나 **장면과 동떨어져 읽기만 해도 걸러지는 오답이 45문장**(126문장 중 약 36%)에 있다. 예: `hungry/proud/late/angry`가 여러 상황에 되풀이되고, `painted`, `traffic`, `language`, `borrow`, `sweet`, `window/door`, `jump/run/sing`, `teacher/driver` 등. 문법·연어로 걸러지는 오답은 7.5 `Anyone`, 3.4 `made/caught` 둘이다. |
| 3 | `decoy` | 4 | 대부분은 자리를 대신하면 비문이 되거나 `ko`와 어긋난다. 그러나 `ko`에도 맞는 다른 문장이 되는 것이 7건 있다(1.4·4.4·5.2·5.4·9.4·11.4·18.5). |
| 4 | `distractorsKo` | 4 | 모두 같은 상황에서 할 법한 다른 말이고, 반만 다른 말은 없다. 7.1·7.2·17.5는 핵심어(내내/잠깐, 안정/검사)가 정반대라 괜찮다. 한국어가 어색하거나 상황 밖인 것이 2건 있다(18.2, 19.2). |
| 5 | `order` | 2 | 21장 중 **6장은 인접 교환이 자연스럽다**(S9 2↔3, S10 3↔4, S13 2↔3, S16 2↔3·3↔4, S17 3↔4, S19 1↔2). 내용 문제는 3장이다. **S15 3줄은 약리가 거꾸로다**(사실 오류). S8은 질문을 먼저 받아 설명보다 앞선다. S18 4줄은 과한 약속이다. 앞 줄을 가리키는 말로 묶은 설계는 12장에서 잘 됐다(S0~S7·S11·S12·S14·S20). |
| 6 | `tag`·`icon` | 4 | 태그는 10자 이하이고, 한국어이며, 역할을 말하고, 상황 안에서 일관된다. 17.4 `play`(에피네프린이 기도를 연다)만 뜻과 동떨어진다(선택). |
| 7 | context `word`·`ko`, swap `ko` | 4 | swap `ko` 10건은 모두 정답 선택지를 넣은 문장의 뜻이다. context `ko`도 정확하다. 다만 S14 `oxygen level`, S20 `blood pressure`는 세 장면 어디에도 그 낱말이 없다(sats·SpO2·desatting / BP·hypotensive). 그래서 화면 제목 "`oxygen level`가 어색한 장면은?"과 어긋난다(낮음). |
| 8 | 파일럿 갈래 | 2 | (1) 아이콘: 해당 없음(T8). (2) 동떨어진 오답 45문장이 파일럿의 약 45문장과 같은 규모로 되풀이됐다. 관사로 걸러지는 오답은 없다. 17.0은 `an`이 넷 모두에 맞게 고른 좋은 예다. (3) order: 위 5. (4) 임상 순서·사실: S15 날록손, S8 동의 전 질문 순서. (5) decoy 겹침 7건. |

## 사실 오류·심각한 문제

1. **order S15 3줄 + order `why`: 날록손 약리가 거꾸로다.** 3줄 `It works fast, but your pain may come back as it wears off.`에서 `it`은 1줄의 역전제다.
   역전제가 풀리면 통증이 돌아오는 것이 아니다. **마약성 약의 효과가 다시 올라와 호흡이 다시 느려지는 것(재진정)**이 위험이다.
   통증은 날록손이 효과를 내는 **동안** 돌아온다(진통 효과까지 막기 때문). 이것이 같은 상황 15.3·15.5 `why`가 바르게 말하는 내용이다.
   order `why`의 "약이 풀리면(it wears off) 통증이 돌아올 수 있다고 해요"도 같은 오류다. 학습자에게 "역전제가 풀리면 통증만 문제"라는
   오해를 남겨 퇴원·관찰 판단과 어긋난다. → 아래 order S15 수정안.
2. **15.4 빈칸, 정답이 둘.** `Your pain may come back because the medicine wears off.`(약효가 사라지기 때문에)와 `… while the medicine wears off.`
   (사라지는 동안)는 둘 다 맞는 영어이고 `ko` "약효가 사라지면 …"에도 맞는다. 같은 상황 order 3줄이 `as it wears off`를 쓰고 있어 더 헷갈린다. → 아래 빈칸 목록.
3. **빈칸 오답이 장면과 동떨어졌다(45문장).** 저작자 자기 보고 2보다 범위가 훨씬 넓다. 감정 형용사 자리에 `proud/hungry/bored`, 상태 자리에 `late`,
   동사 자리에 `painted/sing/jump/borrow/sell`이 되풀이된다. 문장을 읽기만 해도 정답이 나온다. → 아래 빈칸 목록(같은 분야에서 틀린 말로 바꿈).
4. **1.5 `why`(환자 안전).** "졸림이 흔한 반응이라고 먼저 말하면 … 걱정하지 않아요"까지만 쓰여 있다. 그러나 오피오이드(이 상황의 약은 morphine)에서는
   **점점 깊어지는 졸림이 호흡억제의 앞선 신호**다(POSS 같은 진정 척도로 보는 이유). 같은 상황 1.2는 "졸리면 알려 달라"고 하는데 1.5는 "정상이니 쉬라"고 해
   서로 엇갈린다. 문장은 v44라 결정 11 보고로 두고, `why`에 경계를 더한다. → 아래 why.

## 저작자 자기 보고 4건 판정

1. **`City Hospital`·요일 정답을 `Hospital`로 옮긴 것**: 옮긴 것은 맞다. 19.4의 `words`가 `w-hospital`이라 가르치는 말이 `Hospital`이다.
   그러나 오답 `Library/Hall/School`은 병원과 동떨어진 말이다. `City Hall`은 실제 고유명사가 돼 오히려 그럴듯해진다. 같은 분야의 시설로 바꾼다:
   `Pharmacy`, `Nursing Home`, `Rehab Center`. `ko` "시티 병원"이 셋 다 걸러 준다. `Clinic`·`Urgent Care`는 "병원"과 겹치니 쓰지 말 것.
2. **엉뚱한 오답(`language`, `traffic` 등)**: 맞는 지적이고 범위가 훨씬 넓다. **45문장**이다(아래 목록 전부). 특히 `hungry` 9곳, `proud` 6곳,
   `late` 6곳, `angry` 6곳이 감정·상태 자리의 기본값처럼 쓰였다.
3. **느슨한 order**: S13 2↔3이 맞다. `Thank you.`는 어느 질문 뒤에도 붙고, 이름·장소·날짜 지남력 질문은 순서가 정해져 있지 않다.
   스크립트로 63가지 교환을 모두 돌려 보니 자연스러운 카드가 **6장**이었다. S9 2↔3, S10 3↔4, S13 2↔3, S16 2↔3·3↔4, S17 3↔4, S19 1↔2.
   임상·사실 문제가 있는 카드는 S15·S8·S18의 3장이다(위 1, 아래 order 목록).
4. **`why`의 임상 사실**:
   - **맞는 것.** 에피네프린이 아나필락시스의 1차 치료이고 허벅지 바깥쪽 근육주사가 일반적이다(17.1). 에피네프린은 기도 부종을 줄이고 혈압을 올린다(17.4).
     날록손은 작용 시간이 짧아 몇 시간 관찰한다(15.3·15.5). 날록손 뒤 금단 증상(15.2). 얼굴 척도(Wong-Baker FACES)는 아이와 언어 장벽 환자에게 쓴다(12.1).
     통증은 환자가 말하는 만큼 있다(0.4, McCaffery). NSAID 교차 반응(3.4). 내성은 중독이 아니다(6.2·S6 swap). 진정 중 시술자와 따로 지켜보는 사람을 둔다(7.5).
     진정제와 마약성 진통제를 함께 쓰면 호흡억제 위험이 커진다(11.3, FDA 경고). 의료 통역 제공 의무(12.0). narcotic보다 opioid·pain medicine이 낫다(S1 swap).
     출혈 외상에서는 조금씩 나눠 주며 적정한다(20.0·20.3·20.4).
   - **틀린 것.** order S15(위 1).
   - **보완할 것.** 1.5(위 4). 14.2: "먼저 산소를 올리고 기도를 열어"는 순서가 거꾸로 읽힌다. 진정 중 저산소에서는 자극·기도 열기(턱 들기)·산소를 함께 한다.
     9.3: "보고를 기준"은 맞지만, 이 상황은 보고와 행동이 어긋나는 장면이라 행동 단서도 함께 본다고 해야 한다.
     6.3: "날카로운 양상은 새 통증의 단서"는 과하다. 만성 통증도 날카로울 수 있다.
   - **선택.** 7.0: ACEP 지침은 응급실 절차 진정을 금식 시간만으로 미루지 않는다. 15.2: 금단 증상은 오피오이드 의존이 있는 사람에게 온다.

## 고칠 것 (v46 필드)

### why (6 + 선택 2)
- 1.5 · 오피오이드 졸림의 경계가 없다(위 4) · "졸림이 흔한 반응이라고 먼저 말하면 환자가 약이 잘못됐다고 걱정하지 않아요. 다만 깨우기 힘들 만큼 졸리면 호흡이 느려지는 신호라, 간호사가 진정 정도를 계속 확인해요."
- 9.3 · 이 상황(축소 환자)과 엇갈린다 · "사람마다 통증 표현이 다르다고 말하면 조용한 환자도 판단받지 않는다고 느껴요. 통증은 환자의 보고가 기준이지만, 표현이 적은 환자는 감싸기·찡그림 같은 행동 단서도 함께 봐요."
- 14.2 · 처치 순서 · "extra oxygen이라고 쉬운 말로 알려 주면 환자가 지금 무슨 일이 일어나는지 알아요. 진정 중 호흡이 느려지면 깨우는 자극, 기도 열기, 산소 올리기를 함께 해요."
- 6.3 · 과한 일반화 · "평소와 다른 양상이나 다른 부위는 새로 생긴 통증일 수 있다는 단서예요. 새롭거나 달라진 통증은 원인이 다를 수 있어 의사에게 알리는 근거가 돼요."
- 13.2 · 둘째 문장("3인칭 보고 말투 대신 you로")은 이유가 아니다 · 둘째 문장을 "깨어나는 환자에게는 칭찬과 '끝났다'는 사실을 함께 말해 불안을 먼저 덜어요."로.
- 16.5 · 첫 문장이 `ko` 되풀이다 · "I'm right here는 지금 이 자리에 있다는 구체적인 약속이라, 막연한 위로보다 환자가 붙잡기 쉬워요. 고통이 큰 환자에게 혼자가 아니라고 말하는 것이 신뢰를 지켜요."
- (선택) 7.0 · 끝에 "응급실에서는 금식 시간만으로 진정을 미루지 않지만, 구토 위험을 가늠하는 데 써요."를 덧붙인다.
- (선택) 15.2 · "날록손 뒤에는" → "오피오이드에 의존이 있는 사람은 날록손 뒤에"

### 빈칸 (46문장; 모두 넣어 읽고 관사·문법·`ko`를 확인함. `→`는 바꿀 오답, 정답은 그대로. 0.5·6.3은 정답 낱말을 옮김)
- 0.0 · `ignore/hide`가 질문과 동떨어짐 · `ignore`→`manage`, `hide`→`describe`(`ko` "몇 점"이 걸러 줌)
- 0.2 · `dizzy/swollen`은 통증 양상이 아님 · `dizzy`→`throbbing`, `swollen`→`stabbing`
- 0.5 · `fast/small`이 동떨어짐. 정답 `wrong`은 가르치는 말(`w-feel`)이 아님 · **정답을 `feel`로 옮김**, 선택지 `feel/want/see/know`
- 1.2 · `cheerful/rushed` · →`itchy`, `nauseous`
- 2.3 · `torn/dirty/wet` · →`cold`, `thin`, `heavy`
- 3.4 · `made/caught an allergic reaction`은 연어 오류라 영어만으로 걸러짐 · `made`→`noticed`, `caught`→`reported` (`seen`은 그대로)
- 3.2 · `room/bed` · →`medicine`, `test`
- 6.2 · `forget/hide/borrow` 셋 다 엉뚱함 · →`stop`, `skip`, `check` (`double`은 조절의 한 가지라 쓰지 말 것)
- 6.3 · `language/hospital/year` 셋 다 동떨어짐(자기 보고) · **정답을 `sharp`로 옮김**(`w-sharp`), 선택지 `sharp/dull/mild/steady`. `spot`에는 `place/area/side`가 동의어라 오답을 고르기 어렵다
- 7.1 · `crutches/pillows` · →`fluids`, `bed rest` (`oxygen`은 장면상 맞으니 쓰지 말 것)
- 7.2 · `proud/angry` · →`numb`, `dizzy`
- 7.3 · `manual/silent`은 없는 말 · →`general`, `palliative` (`conscious`는 실제 옛 용어라 쓰지 말 것)
- 7.4 · `diet/schedule/insurance` · →`temperature`, `blood sugar`, `weight`
- 7.5 · `Anyone will be with you`는 문법으로 걸러짐 · `Anyone`→`A doctor`
- 8.4 · `proud/bored/hungry` · →`guilty`, `relieved`, `angry`
- 9.4 · `rich/late` · →`polite`, `calm` (`strong/tough`는 정답과 같은 뜻이라 쓰지 말 것)
- 10.3 · `busy/proud/hungry` · →`nauseous`, `dizzy`, `itchy`
- 11.0 · `sell/hide/forget` · →`count`, `bring`, `check` (`name`은 정답과 같은 뜻이라 쓰지 말 것)
- 11.2 · `cheap/heavy` · →`strong`, `new`
- 11.4 · `hungry/angry/late` · →`dizzy`, `restless`, `weak`
- 11.5 · `cost/weight/noise` · →`list`, `stress`, `pain`
- 12.0 · `fire/hide` · →`cancel`, `skip` (`call`은 정답과 같은 뜻이라 쓰지 말 것)
- 12.4 · `Wash/Paint`(파일럿 painting과 같은 갈래) · →`Shake`, `Release` (`Hold`는 "쥐다"와 겹치니 쓰지 말 것)
- 13.2 · `dinner/meeting` · →`test`, `X-ray`
- 13.3 · `color/size/weight` · →`time`, `hospital`, `floor` (모두 지남력 분야. `ko` "며칠"이 걸러 줌. `month`·`year`는 "며칠"과 가까워 쓰지 말 것)
- 13.5 · `sorry/late` · →`awake`, `alone`
- 14.1 · `wash/hide` · →`release`, `raise`
- 15.1 · `painted/wore` · →`smoked`, `bought` (`used`는 정답과 같은 뜻, `ate`는 `ko` "드셨"에 맞으니 쓰지 말 것)
- 15.2 · `hungry/proud` · →`sleepy`, `itchy`
- 15.3 · `louder` · →`slower`
- **15.4 · 정답이 둘(위 2)** · `because`→`before`, `while`→`although`
- 16.0 · `tiny/funny/invisible` · →`mild`, `manageable`, `minor`
- 16.5 · `sorry/late` · →`weak`, `stuck`
- 17.2 · `late/hungry` · →`awake`, `warm` (`still`·`quiet`은 "차분히"와 겹치니 쓰지 말 것)
- 17.3 · `sweet/wet` · →`sore`, `dry`
- 17.4 · `window/door` · →`mouth`, `nose` (`throat/lungs`는 장면상 정답에 가까우니 쓰지 말 것)
- 17.5 · `bored/late/hungry` · →`asleep`, `discharged`, `home` (`comfortable`은 "안정"과 겹치니 쓰지 말 것)
- 18.0 · `bill/schedule` · →`cure`, `recovery`
- 18.4 · `loud/hungry/busy` · →`restless`, `awake`, `active`
- 19.0 · (낮음) `living/dining` · →`operating`, `recovery`
- 19.1 · `dirty/wet/cold` · →`busy`, `up`, `free`
- 19.2 · `teacher/neighbor/driver` · →`doctor`, `interpreter`, `technician`
- 19.3 · `traffic/noise/hunger`(자기 보고) · →`nausea`, `pain`, `drowsiness`
- 19.4 · `Library/Hall/School`(자기 보고 1) · →`Pharmacy`, `Nursing Home`, `Rehab Center`
- 19.5 · `jump/run/sing` · →`stand`, `kneel`, `move around`
- 20.4 · `grows/travels/speaks` · →`heals`, `moves`, `looks` (`reacts`는 정답과 같은 뜻이라 쓰지 말 것)
- 20.5 · `singing/writing/walking` · →`listening`, `waving`, `holding on`

### decoy (7). 자리를 대신하면 `ko`에도 맞는 문장이 된다
- 1.4 `away from` → `take the edge away from the pain`(관용구를 살짝 바꾼, 뜻이 통하는 문장) · →`onto`
- 4.4 `if it's bad` → `…, call us if it's bad`("심하면 부르세요"로 `ko`와 거의 같음) · →`tomorrow morning`
- 5.2 `to keep` → `try other ways to keep the pain down`(`ko` "통증을 줄일"에 맞음) · →`to talk about`
- 5.4 `at home` → `what's worked for you at home`(`ko` "예전에 효과가 있었던"에 가까움) · →`next time`
- 9.4 `to feel brave` → `You don't have to feel brave for me` · →`to be here`
- 11.4 `keep you` → `could keep you too drowsy to stay safe`(`ko`에 맞음) · →`wake you`
- 18.5 `What did she tell` → `What did she tell us to do for her now?`(`ko` "뭘 원하실 것 같으세요"에 가까움) · →`What would you want`
  (가족의 뜻을 묻는 틀린 질문이라 대리 결정의 대비를 가르친다. `ko` "환자분이"가 걸러 줌)

### order (9장 + S14 why). 줄을 고치면 `why`도 함께 고친다
- **S15 (사실 오류, 위 1)** · 2~4줄 교체:
  2 `It reverses the opioid all at once, so you may feel sick or shaky.` (한꺼번에 되돌려서 속이 안 좋거나 떨릴 수 있어요|증상|faceWorried)
  3 `That will pass, but the medicine can wear off before the opioid does.` (그건 지나가지만, 역전제가 마약성 약보다 먼저 풀릴 수 있어요|지속|calendar)
  4 `So we'll stay close and watch your breathing for a few hours.` (그래서 몇 시간 곁에서 호흡을 지켜볼게요|관찰|monitor)
  교환 확인: 1↔2는 `it`, 2↔3은 `That will pass`, 3↔4는 `That`의 가리킬 말이 없어진다.
  why: "숨을 못 쉬어서 역전제를 줬다고 먼저 알려요. 한꺼번에 되돌려서(it) 올 수 있는 증상을 말하고, 그건 지나가지만(That will pass) 역전제가 먼저 풀리면 마약성 약 때문에 호흡이 다시 느려질 수 있다고 해요. 그래서(So) 몇 시간 호흡을 지켜봐요."
- **S8 (순서 논리)** · 설명보다 "시작 전 질문"이 먼저 온다. 동의 전에는 설명을 다 하고 질문을 받는다. 학습자도 질문을 마지막에 놓을 것이다. 교체:
  1 `We'll give him a little medicine so he won't feel the stitches.` (봉합이 아프지 않게 약을 조금 드릴 거예요|약|pill)
  2 `That medicine will make him sleepy, calm, and still.` (그 약이 아이를 졸리고 차분하게, 가만히 있게 해요|효과|coffee)
  3 `That sleepiness wears off soon after we finish.` (그 졸음은 끝나고 곧 풀려요|회복|calendar)
  4 `Do you have any questions about any of that before we begin?` (그 모든 것에 대해 시작 전에 궁금한 점 있으세요?|질문|speech)
  why: "약 → 그 약(That medicine)이 하는 일 → 그 졸음(That sleepiness)이 풀리는 때를 설명하고, 다 들은 뒤(any of that) 시작 전에 질문을 받아요."
- **S9 (2↔3 교환이 자연스러움)** · 교체:
  1 `You said a 3, but I notice you're guarding your right side.` (3점이라고 하셨는데 오른쪽을 감싸고 계시네요|관찰|magnify)
  2 `Does that side hurt more than you said?` (그쪽이 말씀하신 것보다 더 아프세요?|확인|stetho)
  3 `It's okay to tell me if it really does.` (정말 그렇다면 말씀하셔도 괜찮아요|허용|handshake2)
  4 `That way, we won't miss anything.` (그래야 놓치는 게 없어요|확인|check)
  why: "보고(3점)와 행동이 어긋나는 것을 사실로 말하고(I notice), 그쪽(that side)이 더 아픈지 물어요. 정말 그렇다면(if it really does) 말해도 된다고 열어 주고, 그래야(That way) 놓치지 않는다고 마무리해요."
- **S10 (3↔4)** · 4줄 → `Whichever of those you choose, or none, I'll support you.` (그중 무엇을 고르시든, 안 고르셔도 지지할게요|지지|star). why의 `(Whatever you decide)` → `(Whichever of those)`.
- **S13 (2↔3. 자기 보고 3과 같은 지적)** · 2줄 → `Can you tell me where you are right now?` (지금 어디 계신지 말씀해 주시겠어요?|장소|speech),
  3줄 → `That's right, the hospital. Do you know what day it is?` (맞아요, 병원이에요. 오늘이 며칠인지 아세요?|날짜|compass).
  why: "…장소를 묻고, 답을 확인한 뒤(That's right, the hospital) 날짜를 물어요. …"
- **S16 (2↔3·3↔4)** · 3줄 → `If that doesn't work either, we'll keep going until something helps.` (그것도 안 들으면 도움이 될 걸 찾을 때까지 계속할게요|약속|shield).
  4줄 `Until then`은 3줄의 "도움이 될 때까지"를 가리키게 된다. why에 "새 방법(that)도 안 들으면"을 넣는다.
- **S17 (3↔4)** · 4줄 → `Once it's open, we'll still stay right by your side.` (기도가 열린 뒤에도 곁을 지킬게요|곁에|hospital).
  why 끝을 "기도가 열린 뒤에도(Once it's open) 곁에 있겠다고 해요. 아나필락시스는 나아진 뒤 다시 올 수 있어(이상성 반응) 계속 지켜봐요."로.
- **S18 (과한 약속)** · 4줄 `We'll make her peaceful and free of pain, whatever she chooses.`는 통증을 완전히 없애겠다는 약속이고, 임종기 환자가 "고른다"는 전제도 어색하다.
  → `Whatever she'd choose, we'll keep her as peaceful and comfortable as we can.` (어떤 선택이시든 최대한 평온하고 편안하게 해 드릴게요|약속|star). why의 "소망"을 "약속"으로.
- **S19 (1↔2. 자기소개가 먼저여도 자연스러움)** · 1줄 → `First, you're safe — you're in the emergency room.` (먼저, 안전하세요. 여기는 응급실이에요|장소|hospital).
- S14 (낮음) · 줄은 그대로 둔다. why의 "그래도 오르지 않으면(it) 기도를 연다고 알려요" 뒤에 "실제로는 자극·기도 열기·산소를 지체 없이 함께 해요"를 덧붙인다(14.2와 맞춤).

### distractorsKo (2, 낮음)
- 18.2 · 두 개 모두 "~라고 말해요"로 끝나 한국어가 어색하다 · →`비용은 원무과에서 안내해 드려요`, `가족분들은 잠시 밖에서 기다려 주세요`
- 19.2 · `저는 보호자예요, 여기 있을게요`는 간호사가 할 말이 아니다 · →`저는 다른 환자 담당이에요, 곧 올게요`

### context (2, 낮음)
- S14 `oxygen level`, S20 `blood pressure` · 세 장면 어디에도 그 낱말이 없다. 화면 제목에 맞추려면 S14 `word: sats`(`ko` 산소포화도)로 하거나,
  장면 하나를 `oxygen level` 문장으로 바꾼다(예: 환자에게 하는 어색한 장면을 `Your oxygen level is 84, so I'm calling RT.`처럼). S20도 같은 방식으로.

### 아이콘 (선택 1)
- 17.4 `play` → `siren`(에피네프린·기도). `stetho`가 이미 17.3에 쓰여 겹치지 않게.

## 결정 11: 기존 문장(보고만. 고치려면 사용자 결정)
- **15.4** `Your pain may come back once the medicine wears off.` · "the medicine"이 무엇인지 모호하다. 역전제로 읽으면 약리가 거꾸로다(위 1).
  통증은 날록손이 오피오이드를 막는 동안 돌아온다. `why`는 바르게 쓰여 있다. 제안: `Your pain may come back now that the opioid is blocked.`
- **1.2 ↔ 1.5** · 같은 상황에서 "졸리면 알려 주세요"와 "졸리면 정상이니 쉬세요"가 엇갈린다. 1.5를 `If you feel a little drowsy, that's normal, but tell me if it gets hard to stay awake.`처럼 고치는 것을 고려(v46에서는 `why`만 고침).
- 6.3 `Is this new pain sharp, or in a different spot?` · 서로 다른 축(양상/부위)을 or로 묶어 어색하다(낮음).
- 13.3 `what day it is` ↔ `ko` "며칠" · 영어는 요일에 가깝다. `ko` "오늘이 무슨 요일인지"가 더 정확하다(낮음).
- 18.3 `…anymore, our focus is…` · 쉼표로 두 절을 이은 문장(comma splice). 대화체라 허용 범위다(낮음).

## 개수
- 고칠 것 **73**건: why 6 · 빈칸 46 · decoy 7 · order 10(9장 + S14 why) · distractorsKo 2 · context 2. 그 밖에 선택 3(why 2, 아이콘 1), 결정 11 보고 5.
- 심각: S15 order 약리 오류, 15.4 정답 둘, 동떨어진 빈칸 오답 45문장, 1.5 진정 경계.

## 종합
`why`와 `distractorsKo`는 탄탄하다. 그러나 빈칸 오답의 약 3분의 1이 파일럿 갈래 2를 되풀이했고, order 21장 중 9장을 고쳐야 한다.
특히 S15는 날록손 약리를 거꾸로 가르친다. 위 목록을 반영하고 V18·V19를 다시 돌린 뒤 내보내면 된다.
