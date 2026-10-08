# er-asthma-copd — v46 보강 검토 (er)

대상: `er-asthma-copd.yaml` (상황 22 · 문장 132 · order 22장 · context 11 · swap 10). 문장 132개·order 22장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = 천식 악화 초기 문진 … S21 = 인공호흡 이력 중증 재발), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 528줄, decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립(약 1,250줄),
order 인접 교환 66가지, context `word`가 세 장면(특히 어색한 장면)의 `en`에 실제로 나오는지, swap `ko` 10건(정답을 넣은 문장과 대조),
빈칸 정답이 `ko`에 글자 그대로 있는지, decoy·빈칸 오답·`distractorsKo`의 주제 안 중복, base와 v44 필드 비교(바뀐 것 없음, words 동일).

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법도 맞고 장면상 그럴듯해도
`ko`가 걸러 주는 오답은 괜찮은 것으로 봤다(예: 0.4 `pollen/mold/dust`, 5.0 `oxygen level`, 14.5 `blood test`, 10.5 `national quit line`).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 말하는 방식의 이유(어순·완곡·비교 표현·안전)를 짚고 임상 사실도 맞다(PEF 최고값, MDI·스페이서 순서, 살부타몰=albuterol, 5일 스테로이드, 베타차단제, 감압 후 정맥 환류, 인공호흡 이력=치명적 천식 위험인자). 고칠 것: 9.1 저산소 호흡 자극 설명(낡은 설명), 16.2 "더 나빠지면 삽관 준비"(조용한 흉부 자체가 즉시 준비 신호), 19.3 산소포화도를 "한쪽"의 일로 칭찬, 9.5 "이른 신호". 문법 이름만 대는 why(`현재완료예요`)가 많지만 뒤 문장이 이유를 보태 사소하다. |
| 2 | 빈칸 | 3 | `ko`까지 보면 정답이 둘인 문장은 없다. 문제는 넷이다. ① 정답이 `ko`에 글자 그대로 있어 옮겨 적기만 하는 것 5문장(4.3·9.0 `COPD`, 13.5 `911`, 17.1 `BiPAP`, 20.1 `82`). ② 뒤집기 오답(논리만으로 걸러짐)·같은 방향 동의어 세 개 묶음 13문장(7.1 `skip/avoid/refuse`, 13.2 `share/lock/hide`, 5.2 `dropping/falling/slipping`, 7.3 `drop/cut/lower` 등). ③ 동떨어지거나 관사·문법으로 걸러지는 오답 9문장(2.2 `hand me`, 21.3 `the rehab`, 16.5 `at the waiting room`, 13.0 `naps/vitamins`). ④ 약물 빈칸 네 곳에 `insulin`을 돌려씀(3.4·15.0·17.1·18.1), `slowly`도 5문장. |
| 3 | `decoy` | 4 | 대신 넣기로는 `ko`에 맞는 다른 문장이 없다. 끼워 넣으면 맞는 것이 하나 있다: 12.2 `for you`(→ `What makes it hard for you to take the daily one?`가 `ko`와 같음). 뜻이 거의 같은 것 2개: 15.1 `Hold on`(↔ `Stay with me`), 17.5 `right away`(↔ `at first` "초반엔"). decoy 대부분이 시간 부사(`last week`·`last year`·`right away`·`in an hour`…)라 "시간 말 = decoy"로 외워질 수 있다(사소). |
| 4 | `distractorsKo` | 4 | 앞 주제들보다 훨씬 좋다. 뒤집기가 거의 없고 대부분 같은 상황에서 할 법한 말이다. 고칠 것: 위급 장면에서 동떨어진 말 8개(15.0 `수혈`·`수술실`, 15.2 `바로 퇴원`, 15.5 `의사가 퇴근`, 17.2 `바로 퇴원`·`내일로 미뤄요`, 18.5 `케타민 폐기`, 16.5 `산소 마스크를 벗겨`), 뜻이 겹치는 것 2개(9.2 `산소 수치를 계속 지켜볼게요`, 11.3 `숨 쉴 때 통증`), 어색하거나 동떨어진 것 2개(0.2, 1.5). |
| 5 | `order` | 2 | 앞 줄을 가리키는 말로 묶는 설계는 대체로 지켰다. 그러나 **임상 흐름이 틀린 카드가 많다**: S13(입술이 파래도 흡입기 주고 "안 들으면 다시 오라" — 안전), S20(Situation은 COPD, Background는 천식지속상태 — 다른 환자), 모두에게 하는 확인을 조건부로 묻는 카드 6장(S0·S4·S6·S11·S14, S3 `In that case`), S19(의사 호출이 셋째 줄). 인접 교환이 자연스러운 카드 4장(S7 3↔4, S9 2↔3, S15 3↔4, S12 2↔3 약하게), 약하게 열린 카드 3장(S1 3↔4, S16 2↔3, S19 2↔3). `ko` 머리말은 모두 카드 내용과 맞다. |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다. 사소: 20.1 `객관 수치`만 SBAR 글자 태그 패턴에서 벗어남, 4.0 가정 산소에 `hospital`, S0 L3 조절제 줄에 `calendar`. |
| 7 | context `word`·`ko`, swap `ko` | 3 | swap `ko` 10건은 모두 정답을 넣은 문장의 뜻이다. context `ko`도 정확하다. 그러나 11개 중 **4개는 `word`가 어색한 장면에 나오지 않는다**: S3 `albuterol`, S5 `peak flow`, S7 `steroids`(어색한 장면은 `corticosteroids`), S21 `history`. S12 `controller`는 어색한 장면에 있지만 어색함의 원인이 `noncompliant`라 제목 "`controller`가 어색한 장면은?"이 맞지 않는다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진·뒤집기 오답 약 22문장, `ko` 옮겨 적기 5문장. 관사는 대체로 지켰다(`an ABG/an X-ray/an EKG/an MRI`), 예외 21.3 `the rehab`. (3) order 못 박기: 위 5. (4) 임상 순서·사실: order S13·S20·S19와 조건부 카드 6장, why 9.1·16.2. (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S13 order — 입술이 파래지는 아이에게 흡입기를 주고 "안 들으면 다시 오라"고 가르친다.** L2가 `fast breathing, ribs pulling in, or blue lips`를 살피라 하고
   L3 `If you see that, give the rescue inhaler and come back if it doesn't help`가 그것을 받는다. 입술이 파래지는 것(청색증)은 집에서 기다릴 일이 아니라
   바로 911이다 — 같은 상황 13.5 문장과 13.5 why가 그렇게 말한다. L4 `If it gets worse after that and his lips turn blue`도 L2와 겹쳐 모순이다.
2. **S20 order — 한 SBAR 안에서 환자 진단이 다르다.** L1 `Situation: severe COPD flare`, L2 `Background: known severe asthma, now in status asthmaticus`.
   COPD 악화 환자를 천식지속상태로 보고하는 셈이라 보고 틀 자체를 잘못 보여 준다. (원인은 v44 문장 20.0과 20.3이 서로 다른 환자를 가리키는 데 있다 — 결정 11 참고.)
3. **9.1 why — "산소를 너무 많이 받으면 호흡 자극이 줄어 이산화탄소가 쌓인다"** 는 예전 "저산소 호흡 자극(hypoxic drive)" 설명이다. 지금은 고농도 산소가
   폐의 환기·혈류 균형(저산소성 폐혈관 수축)을 흐트러뜨리고 Haldane 효과로 CO2가 오르는 것이 주된 기전으로 가르친다. 학습자가 "산소를 주면 숨을 안 쉰다"로
   외우면 저산소 환자에게 산소를 아끼는 위험한 오해로 이어진다.
4. **16.2 why "조용한 흉부에서 더 나빠지면 … 삽관을 준비"** — 조용한 흉부 자체가 임박 호흡정지 신호라 지금 준비한다(문장도 `prepare for intubation now`). "더 나빠지면"은 대응을 늦추게 읽힌다.
5. **모두에게 하는 확인을 조건부로 묻는 order 6장** — S0 L3(구조 흡입기를 많이 썼으면 조절제를 묻는다), S4 L2·L3(가정 산소를 쓰면 사용 방식을, 그 산소 곁에서 흡연을),
   S6 L2(가래가 변했으면 열을 묻는다), S11 L3(많이 썼으면 가슴 통증을 묻는다), S14 L2·L3(누우면 심해지면 부종을, 그 답으로 청진), S3 L2(`In that case` — 처음이든 아니든 약 설명은 한다).
   이어진 검토에서 되풀이된 갈래 그대로다.
6. **S19 order — 의사 호출이 셋째 줄이다.** 긴장성 기흉 의심이면 호출이 첫 조치다. L2 `His oxygen is dropping fast on that side`는 산소포화도를 한쪽 폐의 값처럼 말한다(아래 결정 11).

## 저작자 자기 보고 판정

1. **SBAR order가 줄 머리 `Situation:`·`Background:`…에 순서를 기댐 — 허용.** SBAR는 순서 자체가 가르칠 내용인 고정 틀이고, 미국 병원 보고의 표준이다.
   머리말을 알아보고 S→B→A→R로 놓는 것이 이 카드의 학습 목표라 "못 박기"의 실패가 아니다. 다만 L2 Background가 L1과 다른 환자라 **내용은 고쳐야 한다**(심각 2).
   20.0 빈칸 `Situation`(오답 `Background/Assessment/Recommendation`)도 같은 이유로 둬도 된다(각 줄 내용이 어느 칸인지도 함께 거른다).
2. **숫자·약물명 정답 빈칸 — 갈린다.**
   - 20.1 `82`: **옮겨 적기.** `ko`에 82가 있고 오답 `100/98/95`는 `on max therapy` 문맥만으로도 걸러진다. → 빈칸을 `one-word`로 옮김(아래).
   - 4.3·9.0 `COPD`, 13.5 `911`, 17.1 `BiPAP`: **옮겨 적기.** `ko`에 글자 그대로 있다. → 옮김.
   - 3.4 `albuterol`: **학습 가치 있음, 그대로.** `ko`는 "살부타몰"이라 한국 이름 → 미국 이름(albuterol)을 고르게 하고, why도 그 차이를 짚는다. 다만 오답 `ibuprofen/insulin`은
     `it helps you breathe easier`와 맞지 않아 논리로 걸러진다 → 호흡기 약으로 바꿈.
   - 18.1 `ketamine`, 15.0 `magnesium`: **음차라 거의 옮겨 적기**(케타민·마그네슘). 오답 `insulin/heparin/digoxin`, `calcium/insulin/aspirin`은 RSI·천식과 동떨어져 논리로 걸러진다.
     18.1은 빈칸을 `paralytic`(근이완제)으로 옮기고, 15.0은 남기되 `insulin`을 바꾼다.
3. **9.5 `Do you feel more drowsy or confused than usual?`(정답 `confused`) — 모호하지 않음, 그대로.** `anxious/nauseated/dizzy`는 모두 이 장면에서 물을 법한 증상이라
   좋은 같은 분야 오답이고, `ko` "혼란스러우세요"가 하나로 정한다. (why의 "이른 신호"만 고친다.)
4. **세 장면 공통 낱말이 없어 대표 용어를 `word`로 고른 context — 둘로 갈린다.**
   - S14 `orthopnea`: **괜찮다.** 어색한 장면 `Do you have orthopnea?`에 그 낱말이 있고 어색함의 원인이 바로 그 낱말이다. (원하면 OK 환자 장면을 `[의사에게] He has orthopnea and new ankle swelling.`로 바꿔 세 장면에 다 나오게 할 수 있다 — 선택.)
   - S3 `albuterol`: **고칠 것.** 어색한 장면 `This is a short-acting beta-2 agonist bronchodilator.`에 `albuterol`이 없고, OK 장면이 환자에게 `albuterol`이라 말해도 괜찮다는 것을 보여 준다.
     어색함의 원인은 `bronchodilator`(계열 이름)다 → `word`를 바꿈(아래). 같은 문제가 S5·S7·S21에도 있다.

## 고칠 것 (v46 필드)

### why (4)
- 9.1 · 둘째 문장 → "COPD 환자 일부는 산소를 너무 많이 주면 폐의 공기·혈류 균형이 흐트러져 이산화탄소가 쌓여요. 그래서 산소를 끊는 게 아니라 목표 범위로 맞춰요."
- 16.2 · 둘째 문장 → "조용한 흉부는 곧 호흡이 멈출 수 있다는 신호라 기다리지 않고 바로 팀을 부르고 삽관을 준비해요."
- 19.3 · "on that side로 어느 쪽인지 짚어" 부분 삭제 → "'dropping fast'로 속도를 함께 말하면 팀이 위급함을 바로 알아요. 긴장성 기흉은 한쪽 폐가 눌려 산소포화도가 빠르게 떨어져요." (문장 자체는 결정 11)
- 9.5 · "이른 신호라" → "중요한 신호라" (두통·졸림이 먼저, 혼돈은 더 진행된 뒤에 온다).

### 빈칸 (blank)
`ko` 옮겨 적기 → 다른 가르치는 말로 옮김(새 answer는 `en`에 낱말 경계로 한 번만 나옴):
- 4.3 · `COPD` → answer `had`: `had*/caught/taken/felt` (`caught COPD`는 틀린 연어 — 같은 분야 오답).
- 9.0 · `COPD` → answer `higher`: `higher*/lower/longer/sooner` (`ko` "그 이상은"이 거름).
- 13.5 · `911` → answer `talk`: `talk*/sleep/eat/walk` (말을 못 하는 것이 응급 기준이라는 것을 가르침).
- 17.1 · `BiPAP` → answer `mental status`: `mental status*/blood sugar/urine output/heart rhythm`.
- 20.1 · `82` → answer `one-word`: `one-word*/full-sentence/clear/normal` (한 단어로만 대답 = 중증 기준).
- 18.1 · `ketamine` → answer `paralytic`: `paralytic*/antibiotic/antidote/steroid` (`sedative`는 케타민이 진정제라 정답처럼 읽히니 쓰지 말 것).
- 3.4 · 오답 `ibuprofen/insulin` → `ipratropium/budesonide` (`prednisone` 유지) — 셋 다 숨쉬기를 돕는 약이라 `ko` "살부타몰"만 거름.
- 15.0 · 오답 `insulin` → `potassium` (네 문장 돌려쓰기 해소).

뒤집기·같은 방향 동의어 세 개 → 같은 분야에서 틀린 말로:
- 7.1 · `skip/avoid/refuse`("5일 동안 거르세요") → answer `long term`: `long term*/as needed/at night/twice a day`.
- 13.2 · `share/lock/hide` → answer `rescue`: `rescue*/controller/steroid/nasal`.
- 5.2 · `dropping/falling/slipping`(셋 다 같은 뜻, "좋은 신호"와 모순) → `improving*/dropping/leveling off/swinging`.
- 7.3 · `drop/cut/lower`(셋 다 같은 뜻) → `raise*/lower/stabilize/normalize`.
- 17.0 · `lower/falling/dropping`(셋 다 같은 뜻) → `rising*/falling/normal/stable`.
- 18.2 · `easy/smooth/normal`(셋 다 같은 뜻) → `difficult*/easy/manual/prolonged`.
- 16.3 · `rising/climbing/holding` → `dropping*/rising/recovering/fluctuating`.
- 9.4 · `easier/better`(같은 뜻) → `worse*/easier/deeper/slower`.
- 20.4 · `improving/recovering/stabilizing`(`can't protect his airway`와 모순) → `tiring*/agitated/sedated/wheezing`.
- 21.5 · `lightly/slowly/softly` → answer `wait`: `wait*/stop/rush/guess`.
- 21.2 · `late/slowly/tomorrow`(`to stay ahead`와 모순) → `early*/later/gradually/briefly`.
- 12.5 · `skip/cancel`(뒤집기) → `set*/change/check/share`.
- 7.5 · `long`(`long-term use`와 모순) → `short*/standard/daily/first`.

동떨어지거나 관사·문법으로 걸러지는 오답:
- 2.2 · `hand`(`hand me`는 목적어가 없어 비문) → `remind` : `show*/tell/teach/remind`.
- 21.3 · `the rehab`(관사 비문), `the nursing home` → `ICU*/ER/hospital/floor`.
- 16.5 · `at the waiting room/front desk/supply room`(전치사 어색·동떨어짐) → `bedside*/nurses' station/doorway/sink`.
- 18.4 · `waiting room/lobby` 동떨어짐(16.5와 같은 묶음) → `bedside*/nurses' station/supply room/hallway`.
- 13.0 · `naps/vitamins`(동떨어짐), `vaccines`(백신이 천식을 유발한다는 오해를 부를 수 있음) → `colds*/pollen/mold/exercise` (넷 다 유발요인, `ko` "감기"가 거름).
- 4.1 · `run/gamble` 동떨어짐 → `smoke*/drink/work/drive` (사회력에서 실제로 묻는 말).
- 10.0 · `for fun` → `for a while` : `for good*/for a week/for a while/for now`.
- 8.4 · `page` → `breath` : `word*/sentence/question/breath`.
- 11.4 · 빈칸이 상황 전체에 되풀이되는 `Yes or no`(오답 `Right or left/Day or night/Now or later`) → answer `stomach`: `stomach*/head/heart/chest` (관용구 `sick to your stomach`를 가르침).

### decoy (4)
- 12.2 · `for you` → 끼워 넣으면 `What makes it hard for you to take the daily one?`가 `ko`와 같음 → `at night`.
- 15.1 · `Hold on` → `Hold on — we're doing everything…`·`Stay with me, hold on —`이 `ko`와 거의 같음 → `Leave me`.
- 17.5 · `right away` → `make him feel anxious right away`가 `ko` "초반엔"과 거의 같음 → `for days`.
- 5.4 · `out loud` → `count out loud to five`가 `ko`에 어긋나지 않음 → `to ten`.

경계선(보고만, 고쳐도 됨): 8.0 `if you can`(끼우면 자연스럽고 `ko`와 충돌 없음 → `and talk` 권장), 13.2 `and wait`(→ `twice a week` 권장), 7.3 `slightly`(→ `your heart rate` 권장).

### distractorsKo
- 0.2 [0] · "흡입기를 쓸 때 숨이 차지 않나요?"(어색) → "흡입기는 누가 처방해 줬나요?"
- 1.5 [0] · "오늘 수치는 저희만 알고 있을게요"(동떨어짐) → "오늘 수치는 평소보다 낮아요"
- 9.2 [1] · "산소 수치를 계속 지켜볼게요"(정답 "신중하게 조절할게요"와 겹침) → "산소통을 새것으로 바꿀게요"
- 11.3 [1] · "숨 쉴 때 통증이 있나요?"(가슴 통증과 겹침) → "목이 아프세요?"
- 13.2 [0] · "흡입기는 학교에도 두세요"(13.0 [0] "이 약은 학교에도 두세요"와 중복) → "흡입기 쓰는 법을 아이에게 가르쳐 주세요"
- 15.0 · 둘 다 동떨어짐(수혈·수술실) → "지금 스테로이드 주사를 드렸어요" / "지금 산소를 더 올릴게요"
- 15.2 [0] · "이게 끝나면 바로 퇴원해요" → "이 치료가 끝나면 숨소리를 다시 들어 볼게요"
- 15.5 [0] · "지금 의사가 퇴근했어요"(아무도 하지 않을 말) → "산소 마스크를 바꿔 드릴게요"
- 16.5 [0] · "산소 마스크를 벗겨 주세요"(조용한 흉부 장면에서 위험) → "흡인기를 켜 두세요"
- 17.2 · 둘 다 동떨어짐 → "호전되면 BiPAP 압력을 낮춰 볼게요" / "BiPAP 마스크가 새는지 확인해요"
- 18.5 [0] · "케타민은 제가 폐기할게요" → "케타민 용량을 다시 확인할게요"

### order
- **S13 (안전)** · L2 → `When one of those hits, watch for fast breathing or ribs pulling in.` (blue lips 뺌) · L4 → `If his lips turn blue or he can't talk, call 911 right away — don't wait.`
  · why → "유발요인을 알리고, 그것이 닥칠 때 볼 징후와 흡입기 대처를 말한 뒤, 입술이 파래지거나 말을 못 하면 기다리지 말고 911이라고 닫아요."
- **S20 (사실)** · L2 → `Background: known COPD on home oxygen, admitted twice this year.` (ko: 배경: 가정 산소를 쓰는 COPD, 올해 두 번 입원).
- **S19** · L2 → `Page the doctor now — we need immediate needle decompression.` · L3 → `While you do that, I'll grab the decompression kit.` · L4 그대로. why를 그에 맞게.
- **S0** · L3 → `Along with that rescue inhaler, do you take a daily controller?` (ko: 그 구조 흡입기 말고 매일 쓰는 조절제도 있으세요?) — 조건부 해소, `that rescue inhaler`가 L2를 가리킴. L3 아이콘 `calendar` → `pill`.
- **S3** · L2 `In that case,` → `Either way,` (처음이든 아니든 설명함). L3 두 일(호흡·부작용)을 `and`로 묶은 것은 그대로 둬도 됨.
- **S4** · 산소 여부에 흡연력이 매달림 → L1 `How long have you had COPD?` / L2 `Over those years, have you kept smoking, or when did you quit?` / L3 `Are you on home oxygen now, and do you use it all day or just sometimes?` / L4 그대로. (L2↔L3가 약하게 열리면 L3를 `Along with that, are you on home oxygen…`처럼 L2를 받게.)
- **S6** · 열을 가래 변화에 매달았고, L3 `Is that why…`는 환자에게 인과를 떠넘김 → L1 `Has your phlegm changed color or amount, and any fever or chills?` / L2 `Besides infection, heart problems can do this — any swelling in your legs?` / L3 `Along with that swelling, do you have trouble lying flat?` / L4 `Thanks — I'll pass all of that to the doctor.` (감염 → 심부전 배제, brief와 같은 순서)
- **S11** · L3 가슴 통증을 "많이 썼으니"에 매달았고, 답을 미리 정함 → L2 `Did it help? Yes or no?` / L3 `Before we give you more, allergy to medicine? Yes or no?` / L4 그대로. (brief의 흡입기·알레르기 확인과도 맞음)
- **S14** · L2 `If it is,` → `Either way,` · L3 `With those answers,` → `To sort out those answers,` (청진은 누구에게나 함).
- **S7** · 3↔4가 자연스러움(L4 `all of that`이 L2만 받아도 됨), L4 `won't cause long-term problems`는 과장 → L4 `That rise settles once you stop, and a short course rarely causes long-term problems.` (ko: 그 혈당은 끊으면 가라앉고, 짧은 기간은 장기적인 문제를 거의 일으키지 않아요) — `That rise`가 L3를 가리켜 잠김.
- **S9** · 2↔3이 자연스러움(`So I'll titrate…` 뒤에 `That's because…`가 붙음) → L3 `To prevent that, I'll titrate it carefully to keep you in that range.` (`that` = L2의 CO2 축적).
- **S15** · 3↔4가 자연스러움(`That's why`가 L2의 파란 입술을 받음) → L4 `To be ready for that, we're calling for backup and getting the airway team here.` (`that` = L3의 대신 숨 쉬기).
- **S12** · L4 `For that reason, let's set a daily time`은 비용·부작용이 이유여도 같은 해결책 → L4 `If it's forgetting, let's set a daily time so it's easier to remember.` · L3 → `Is that hard part the cost, the side effects, or just forgetting?` (2↔3 약한 열림 해소).
- **S16** · 2↔3이 약하게 열림, 팀 호출이 설명 뒤 → L3 `With that warning, call the team — prepare for intubation now.`

약하게 열림(보고만): S1 3↔4(`compare with that reading` 뒤에 `That best number shows…`가 붙을 수 있음 — `right now`가 걸러 주는 편).

### context (5)
- S3 · `word: albuterol` → `word: bronchodilator`, `ko: 기관지확장제`. 장면: `[차트 기록] Bronchodilator neb given for wheezing.` / `[의사에게] Starting a bronchodilator neb now.` / BAD `[환자에게] I'm giving you a short-acting bronchodilator.` fix 그대로.
- S5 · `word: peak flow`가 어색한 장면에 없음(`PEF`) → 의사 장면 `Peak flow improved from 180 to 300 after three nebs.`, BAD `Your peak flow went from 45 to 75 percent of predicted.` (어색함 = 예측치 퍼센트를 환자에게).
- S7 · `word: steroids`가 어색한 장면에 낱말로 없음(`corticosteroids`), 어색함의 원인은 `burst` → `word: burst`, `ko: 단기 집중 투여`. 차트 `Prednisone 40 mg burst x 5 days.` / 의사 `Let's start a five-day steroid burst.` / BAD 그대로. why 그대로.
- S21 · `word: history`가 어색한 장면에 없음 → `word: prior intubation`, `ko: 이전 삽관`. OK 환자 장면을 `[차트 기록] Hx of prior intubation for asthma.`로, 의사·BAD 장면은 그대로.
- S12 · 어색함의 원인이 `controller`가 아니라 `noncompliant` → `word: adherence`, `ko: 복약 순응`. `[차트 기록] Poor adherence to controller, ~2x/week.` / `[의사에게] His adherence to the controller is poor.` / BAD `[환자에게] Your adherence has been poor.` fix `What makes it hard to use your controller every day?` why "adherence는 의료진끼리 쓰는 평가 말이에요. 환자에게는 무엇이 어려운지를 비난 없이 물어요."

### tag·icon (사소, 3)
- 20.1 · tag `객관 수치` → `A 사정` (SBAR 글자 태그와 맞춤).
- 4.0 · icon `hospital` → `home` (가정 산소).
- S0 L3 · icon `calendar` → `pill` (위 order 수정과 함께).

## 결정 11 (v44 문장 — 보고만, 확실한 것)
- 19.3 `His oxygen is dropping fast on that side.` — 산소포화도는 한쪽 폐의 값이 아니다. `His oxygen is dropping fast.`(ko: 산소포화도가 빠르게 떨어지고 있어요)로.
- 20.0 `severe COPD flare`와 20.3 `known severe asthma, now in status asthmaticus` — 같은 SBAR 상황 안에서 다른 환자를 가리킨다. 20.3을 `Background: known severe COPD on home oxygen.` 같은 COPD 배경으로 맞추는 편이 맞다(order는 위에서 따로 고침).

## 개수
why 4 · 빈칸 30 · decoy 4(+경계선 3) · distractorsKo 11 · order 14(+약하게 열림 1) · context 5 · tag·icon 3 = **고칠 것 71건**, 결정 11 보고 2건.

## 종합
사실·안전 문제는 order S13(청색증에 흡입기 후 귀가)·S20(다른 환자의 SBAR)과 why 9.1·16.2로 좁고 고치기 쉽다. distractorsKo는 앞 주제보다 훨씬 좋다.
빈칸(옮겨 적기·뒤집기 묶음)과 조건부 order, context `word` 4건만 고치면 내보내도 된다.
