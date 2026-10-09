# er-poisoning — v46 보강 검토 (er)

대상: `er-poisoning.yaml` (상황 21 · 문장 126 · order 21장 · 뉘앙스 context 13 · swap 8). 문장 126개와 order 카드 21장(84줄)을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 복용 약물·시간 문진 … S20 = 중독 이송 중 급변 인계). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 504줄, decoy를 청크 자리마다 대신 넣은 조립(약 560줄, 끼워 넣은 경우는 그 표를 보며 읽음),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context `word`가 세 장면 `en`에 있는지와 base 대비 바뀐 장면·`fix`·`why`, swap 8건(선택지를 넣은 문장과 `ko`),
빈칸 정답·오답·decoy·`distractorsKo`의 주제 안 중복.
`verify_one_theme.py er …/er-poisoning.yaml` → `==> 통과`(W13 경고 3 — v45 단어 오답 `lately`·`cloths`·`lunge`, 이번 범위 밖. W14 0).
아래에서 빈칸을 옮기자고 한 새 answer는 모두 `en`에 낱말 경계로 정확히 한 번 나오는지 스크립트로 확인했다. 새 order 줄은 모두 15단어 이하이고, 인접 교환 세 가지를 다시 읽었다.

판정 기준:
- 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. decoy를 끼워 넣은 조립은 덧붙은 말이 `ko`에 이미 담긴 뜻일 때만 "ko에 맞는 다른 문장"으로 셌다(앞 주제 검토와 같은 기준).
- 빈칸 오답의 "반대 방향"(브리프 2(a))은 상태·방향을 대비할 때(`stable/unstable`, `high/low`)는 좋다. 그러나 오답을 넣으면 **간호사가 환자에게 하는 해로운 처치 지시**가 되는 것(`rub your eyes`, 고열 환자에게 `heat`·`blankets`, 유발 약을 `double`)은 브리프 "위험한 처치를 오답으로도 보이지 않기"에 걸리는 것으로 셌다.
- `distractorsKo`의 **틀린 의학 설명**("아트로핀으로 열을 내릴게요", "중탄산염은 위산을 더 늘려요")은 그 상황의 간호사가 할 말이 아니고(TASK 8 ②), 학습자가 틀린 사실을 듣게 되므로 고칠 것으로 셌다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 거의 다 사실이고 말하는 방식의 이유를 짚는다. 활성탄 흡수(1.0)·흡인 위험(1.2), 노모그램(5.1), 날록손 작용 시간(6.1·6.5), 플루마제닐 발작(7.1), 요 알칼리화(8.1), 살리실산 호흡 자극(8.3), QRS 넓어질 때 중탄산나트륨(9.1), COHb·맥박산소측정기(13.0), 아트로핀 적정(16.5), 세인트존스워트(17.2), 포메피졸·투석(18.1), take report(15.2) — 모두 맞다. 고칠 것 5: 5.4(문장이 주어 없이 끊김), 10.3(`by mistake` 전제가 정직한 답을 끌어낸다는 근거 없는 주장 — 의도성 확인을 막음), 4.1(발견 시각만으로 위험 시점을 추정 — 마지막으로 괜찮았던 시각이 필요), 18.3(시력 변화가 "가장 중요한" 단서 — 과장), 19.1(환자 증상이 모니터보다 먼저 온다 — 근거 약함). |
| 2 | 빈칸 | 2 | `ko`로 걸러지지 않아 **정답이 둘**인 것은 없다(2.2 `symptoms`, 4.1 `feed`, 13.2 `first`, 20.2 `held`는 영어로 성립하지만 `ko`가 가른다). 그러나 고칠 것이 40문장이다: **오답이 해로운 처치 지시가 되는 것 7**(3.4 `rub` your eyes, 7.4 `quickly/rapidly` — 역전제 급속 투여, 8.4 `morphine` — 살리실산에 호흡 억제제, 9.5 `unplug` the monitor, 17.1·17.5 유발 약 `double/add/start`, 17.4 고열에 `heat/blankets/warm fluids`), **시제·문법으로 걸러지는 것 약 12**(0.1, 2.4, 3.5, 4.0, 6.5, 14.2, 17.2, 19.1 시간 묶음 등), **브리프가 이름을 든 묶음 돌려쓰기**(2.5 `never/barely/hardly`, `rarely` 1.5·6.1·9.3 + `seldom`, `skip` 5.5·8.5·20.5, 공감 문장의 `doubt/ignore/forget/deny/blame/judge` 11.0·11.3·11.4·14.5, `ready` 정답에 `unwilling/unable/absent/missing` 9.4·10.5·19.5), **동떨어진 말**(7.3 `paperwork/billing`, 15.0 `rash/fracture/sprain`, 16.0 `fracture/migraine`, 16.4 `knees/wrists/shoulders`, 4.5 `pictures/photos` 동의어 둘). 같은 정답 `closely`가 세 문장(1.5·6.1·9.0)에 같은 모양 오답으로 나온다. |
| 3 | `decoy` | 4 | 대신 넣어 `ko`에 맞는 다른 문장이 되는 것 1개(9.5 `in bed`). 경계 3개(11.3 `for you`, 6.5 `for a while`, 20.4 `with a mask`). 2.1 `or tell anyone`은 자살 위험 사정에서 비밀 유지를 약속하는 말이라 조각으로도 보이지 않는 편이 낫다. `tomorrow` 5·`after dinner` 4·`after lunch` 4처럼 아무 문장 끝에나 붙는 시간 부사가 많다(선택). |
| 4 | `distractorsKo` | 2 | **하면 안 되는 처치·잘못된 안심을 보이는 것 6**(2.1·6.5 "지금 퇴원 서류를 가져올게요" — 자살 시도 직후·날록손 직후, 두 문장에 글자까지 같음; 13.0 "산소 수치가 정상이니 안심하셔도 돼요" — 바로 이 상황이 가르치는 오류; 18.0 "시력은 곧 돌아올 거예요" — 메탄올 시력 손상은 영구적일 수 있음; 18.1 "투석은 퇴원한 뒤에"; 12.3 "술이 깨면 약 효과도 바로 끝나요"), **틀린 의학 설명 10문장**(1.0·5.2·8.1·8.3·8.4·9.1·13.4·16.0·16.1·16.4), **반만 다르거나 뒤집은 것 12**(0.3, 2.2, 14.2, 14.4, 17.4, 18.5, 19.0, 20.4, 20.5, 15.0·19.2·20.2 숫자 뒤집기), S0 "토하셨어요" 세 번(0.0·0.1·0.2). |
| 5 | `order` | 2 | `If so`류로 시작하는 줄은 없고, 기도·호흡 지지가 해독제보다 앞서는 카드(S6·S7·S13·S15)는 순서가 맞다. 그러나 **인접 교환이 열린 카드 8장**(S0 3↔4, S4 2↔3·3↔4, S11 2↔3, S14 3↔4, S18 3↔4, S20 1↔2·2↔3, S6 2↔3 약하게, S19 3↔4 약하게), **답·결과를 전제한 줄 4장**(S2 L3 `Thank you for telling me`, S8 L2 `With that many`, S10 L2 `With your blood that thin` — 아직 INR 결과 없음, S10 L3 `what you're seeing`), **임상 흐름이 어긋난 카드 4장**(S3 L4 눈·피부 세척을 독극물센터 답까지 미룸, S4 L2 `at that time` — 발견 시각의 알약 수는 곧 남은 수라 질문이 성립 안 함, S7 L3 플루마제닐을 기본 단계로, S18 L4 메탄올에 `kidneys`), **억지 연결어 4장**(S3 L2 `With that answer`, S12 L3 `With that amount in mind`, S14 L4 `Beyond that`, S15 L4 `With naloxone requested`). |
| 6 | `tag`·`icon` | 4 | 태그는 한국어 10자 이하이고 상황 안에서 일관된다. order 21장 모두 `대화 흐름`·`compass`. 고칠 것: S13 L3 고유량 산소에 `pill`(같은 문장 13.1은 `monitor`). 사소: S17 L4 냉각에 `pill`. |
| 7 | context `word`·`ko`, swap `ko` | 4 | `word`가 13문항 세 장면 모두에 있다(W14 0). 어색한 장면은 모두 환자·가족에게 차트·의료진 말투를 쓴 곳이다. 고칠 것 2: S1 XX `vomiting or emesis`, S18 XX `emergent HD — … dialysis access` — 둘 다 W14를 맞추려 같은 뜻을 겹친 말(gi-bleed `DES stent`와 같은 갈래). swap `ko` 8건은 모두 정답을 넣은 문장의 뜻이다. |
| 8 | 파일럿 갈래 | 2 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진·문법으로 걸러지는 빈칸 오답, `rarely/barely/hardly`·`skip`·시간 단위 묶음 돌려쓰기가 앞 주제와 같은 갈래로 되풀이됐고, 이번 주제에서는 **해로운 처치가 오답으로 들어간 것**이 빈칸 7·오답 뜻 6으로 가장 많다. (3) order: `And/Also/Then`은 없지만 `With that answer`·`With that amount in mind`·`Beyond that`·`With naloxone requested`가 새 억지 연결어로 나왔고, 답을 전제한 줄 4. (4) 임상: S3 L4, S4 L2, S7 L3, S18 L4. (5) decoy·오답 뜻 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **오답 뜻으로 하면 안 되는 처치·잘못된 안심을 보임(브리프 "위험한 처치를 오답으로도 보이지 않기")**
   - 2.1·6.5 `지금 퇴원 서류를 가져올게요` — 자살 시도 직후(2.1)와 날록손 투여 직후(6.5)에 퇴원을 말한다. 날록손 뒤에는 재진정 관찰이, 자살 위험 사정 중에는 1:1 관찰이 기본이다. 두 문장에 글자까지 같다. → K1·K2.
   - 13.0 `산소 수치가 정상이니 안심하셔도 돼요` — 일산화탄소 중독에서 맥박산소측정기 수치를 믿으면 안 된다는 것이 이 상황의 핵심이다. 그 오류를 그대로 "할 법한 말"로 보인다. → K3.
   - 18.0 `시력은 곧 돌아올 거예요` — 메탄올 시신경 손상은 영구적일 수 있다. 근거 없는 약속이다. → K4.
   - 18.1 `투석은 퇴원한 뒤에 할 수 있어요` — 긴급 투석을 미루는 말. → K5.
   - 12.3 `술이 깨면 약 효과도 바로 끝나요` — 진정제 효과는 술과 따로 남는다. 위험을 줄여 말하는 틀린 안심. → K6.
2. **빈칸 오답이 해로운 처치 지시가 됨**
   - 3.4 `We'll rub your eyes …` — 화학물질이 들어간 눈을 비비는 것은 대표적인 금기다(`dry`·`cover`도 세척 대신). → B8.
   - 7.4 `give the reversal drug quickly/rapidly/suddenly` — 플루마제닐 급속 투여는 발작·급성 금단을 부른다. 게다가 `quickly`·`rapidly`는 동의어라 둘 다 오답임이 드러난다. → B16.
   - 8.4 `The morphine helps …` — 살리실산 중독에서 호흡을 억제하면 산증이 급격히 나빠진다. → B17.
   - 9.5 `while we unplug the monitor` — 삼환계 과다 환자의 모니터를 뽑는 장면. → B20.
   - 17.1 `doubling/starting/adding the trigger`, 17.5 `add/double/start every medication` — 세로토닌 증후군에 유발 약을 늘리는 말. → B33·B36.
   - 17.4 `heat`·`blankets`·`warm fluids` — 고체온 환자를 데우는 말. → B35.
3. **S3 order L4 `They'll tell us how long your eyes and skin need rinsing.`** — 독극물센터 답을 기다린 뒤 세척하는 것처럼 읽힌다. 화학물질 눈·피부 노출은 바로 물로 씻기 시작하고 기간만 자문받는다(같은 상황 3.4 `right away`와도 어긋남). 또 카드가 눈·피부에 묻었는지 묻지 않고 세척을 전제한다(TASK 10 시간 묶음 갈래). → O3.
4. **S7 order L3 `With her airway protected, we use the reversal drug slowly.`** — 플루마제닐을 기도 확보 뒤의 기본 단계로 가르친다. 미국 응급실에서 의도적·혼합 과다복용과 벤조디아제핀 장기 복용자에게는 대개 쓰지 않고 지지 치료가 기본이며, 쓰더라도 의사가 위험을 따진 뒤다. 여기서는 조건부 줄이 맞다(모든 환자에게 하는 일이 아님). → O7.
5. **S18 order L4 `your vision and kidneys are both at risk`** — 신장 손상은 에틸렌글리콜의 특징이고, 메탄올은 시신경과 대사성 산증이 핵심이다. base 문장 18.5도 같은 말이고, 18.5 `why`는 "시신경 손상과 산증"이라 해 문장과 어긋난다. order는 v46 필드라 고치고, 18.5는 결정 11로 따로 보고한다. → O15·G1.
6. **S4 order L2 `How many pills were in the bottle at that time, and how many are left?`** — `at that time`이 L1의 발견 시각을 가리키는데, 발견 시점의 알약 수는 곧 남은 수라 질문이 성립하지 않는다(원 문장 4.0은 "이전에 몇 개"를 묻는다). → O4.
7. **답·결과를 전제한 order 줄** — S10 L2 `With your blood that thin`(L1은 INR을 "확인할게요" — 결과가 아직 없음), S10 L3 `If what you're seeing gets worse`(L2에 '예'를 전제), S8 L2 `With that many`(몇 개라고 답할지 모름; 귀 울림은 개수가 아니라 혈중 농도를 따름), S2 L3 `Thank you for telling me`(환자가 답하지 않을 수도 있음). → O9·O8·O2.
8. **인접 교환이 열린 order 8장** — S0 3↔4, S4 2↔3·3↔4, S11 2↔3, S14 3↔4, S18 3↔4, S20 1↔2·2↔3, 약하게 S6 2↔3·S19 3↔4. 학습자가 맞히고도 틀린다. → O1·O4·O10·O12·O15·O17·O6·O16.

## 저작자 자기 보고 4건 판정

### 1. 기능어 자리에서 옮긴 빈칸(Right now, between, stay with, high, bicarbonate), `hurt`·`ready`·`take over` 자리의 인위적 오답, `rarely`·`skip` 재사용

**판정: 다섯 중 셋은 그대로 둬도 되고 둘은 다시 옮긴다. 인위적 오답과 재사용은 고칠 것으로 올린다.**
- 그대로: 8.0 `high`(`low/normal/gone` — 같은 분야 반대, 좋다), 15.5 `stay with`(`step away from/walk away from/let go of` — 반대 방향이지만 문법은 맞고 장면 안 말; `step away`·`walk away`가 동의어인 것은 사소).
- 8.4 `bicarbonate`는 자리는 좋으나 오답 `morphine`이 위험(심각 2) → B17.
- 다시 옮김: 2.4 `Right now` ↔ `Next week/Every night/Last year` — `is`와 시제가 맞지 않아 읽기만 해도 걸러지는 시간 묶음 → `only`로(B6). 14.2 `between` ↔ `outside/beyond/against us` — 셋 다 비문 → `care team`으로(B25).
- 인위적 오답:
  - 2.0 `hurt` ↔ `wake/check/feed yourself` — 장면 밖 말이다. 이 장면에서 실제로 나올 법한 의도(`treat/calm/numb yourself` — 통증·불안을 다스리려고 먹었다)로 바꾸면 `ko` "다치게"가 가른다 → B5.
  - `ready` 세 문장(9.4 `unwilling/unable/afraid`, 10.5 `reluctant/unable/unwilling`, 19.5 `late/absent/missing`) — 아무도 하지 않을 말이고 묶음을 돌려썼다. 9.4는 `trained/allowed/unable`로 남기고, 10.5는 `reversal`, 19.5는 `team`으로 옮긴다 → B19·B22·B38.
  - 20.5 `take over` ↔ `cancel/skip/delay airway` — 셋 다 걸러진다. `take over/watch` 같은 동사는 정답이 둘이 되니 `report`로 옮긴다 → B40.
- 재사용: `rarely` 1.5·6.1·9.3(+ 9.3 `seldom`, 2.5 `never/barely/hardly`), `skip` 5.5·8.5·20.5 → B2·B11·B12·B18·B7. 8.5는 `skip/stop/finish`가 셋 다 같은 뜻 갈래지만 문법은 맞아 선택으로 둔다.

### 2. 인접 교환이 아직 그럴듯할 수 있는 카드(자살 시도 다약제, 약물 은폐, 미상 물질)와 유지한 `If` 줄(항응고제 역전)

**판정: S11·S14는 열려 있다. S15는 닫혀 있다. S10의 `If`는 진짜 조건부라 유지하되, 줄이 답을 전제한 것은 고친다.**
- **S11 2↔3 열림** — L3 `I'll share all of that with a counselor`의 `all of that`이 L1의 고통을 가리켜도 읽혀, L1 → L3 → L2도 자연스럽다. 게다가 L2 `To help with that pain, can you tell me each thing you took?`는 먹은 약을 말하면 마음의 고통이 나아지는 것처럼 잇고, L3는 약 목록을 상담사에게 넘긴다고 해 임상 흐름(약 목록은 의사·독극물센터, 정신과 평가는 의학적 안정 뒤)과 어긋난다 → O10.
- **S14 3↔4 열림** — L4 `Beyond that`은 `Also`류라 L2 뒤에도 붙고, L3 `about it`은 L4의 `what happened`를 가리켜도 읽힌다 → O12.
- **S15 닫힘** — L3 `With the airway protected`가 L2를, L4 `With naloxone requested`가 L3을 가리켜 순서는 하나다. 다만 L4 `With naloxone requested`는 억지 연결어라 선택으로 바꾼다 → O13.
- **S10 L3 `If what you're seeing gets worse, there's a reversal medicine we can give.`** — 역전 여부는 INR과 출혈 정도로 정하므로 모든 환자에게 하는 일이 아니다. 조건부가 맞다. 그러나 `what you're seeing`이 L2 질문의 답을 '예'로 전제하고, L2 `With your blood that thin`도 아직 나오지 않은 INR 결과를 전제한다. L4 `That's why`(역전제가 있어서 지켜본다)는 인과가 맞지 않는다 → O9.

### 3. context 정비 13건

**판정: 방식은 받아들인다. 고칠 것은 2개(S1, S18)다.**
- 받아들임 — 묶음 검토 A·B·C와 같은 모양(세 장면이 함께 쓰는 말을 `word`로, 어색함은 그 말 주변의 전문어·약어를 환자·가족에게 쓴 데):
  - **S5 `level`** — XX `We're sending an APAP level now.`는 약어 APAP를 환자에게 쓴 곳이다. 차트 장면 `APAP level drawn at four hours post-ingestion`도 실제 기록 말투(노모그램 4시간)다. why가 지금 장면(약어·혈액 검사)을 설명한다. ✓
  - **S8 `aspirin`** — XX `Any tinnitus or tachypnea since the aspirin ingestion?`의 어색함은 tinnitus·tachypnea에 있다. TASK 9 `drowsy` 예시와 같은 모양. 독극물센터 장면을 `Salicylate`에서 `Aspirin`으로 바꾼 것도 자연스럽다. ✓
  - **S12 `alcohol`** — XX `Alcohol and those pills depress your respiratory drive.` 영어가 바르고 어색함이 `respiratory drive`에 있다. ✓
  - **S13 `carboxyhemoglobin`** — 의료진에게는 맞는 임상어이고 환자에게만 어색하다(핸드오프 `deteriorate`, 검토 A의 `expired`와 같은 모양). owie류(어디서도 틀린 말)가 아니다. 차트에는 보통 `COHb`를 쓰지만 `carboxyhemoglobin pending`도 틀리지 않다. ✓ (사소: `ko` `카복시헤모글로빈`은 음차라 `일산화탄소헤모글로빈`이 더 흔하다 — 선택.)
  - **S15 `respirations`**, **S17 `tramadol`**(XX `serotonergic toxidrome`이 어색함을 맡음, fix가 약 이름을 쓰게 바뀐 것도 좋다), **S20 `hypotensive`**(보호자에게 `became hypotensive en route` — 바른 영어, TASK가 든 `Your BP is hypotensive`류 아님) — 모두 자연스럽다.
  - 정비하지 않은 S3 `exposure`, S6 `naloxone`, S10 `INR`, S16 `atropine`도 기준에 맞다.
- 고칠 것:
  - **S1 `vomiting`** — XX `Report any vomiting or emesis — aspiration risk with the charcoal.`의 `vomiting or emesis`는 같은 뜻을 겹친 말로, W14를 맞추려 끼워 넣은 모양(TASK 9 경고, gi-bleed `DES stent`)이다. `vomiting`은 환자도 쓰는 말이라 어색함은 `emesis`·`aspiration risk`에 실려야 한다 → C1.
  - **S18 `dialysis`** — XX `Nephrology is consulted for emergent HD — we'll need dialysis access.`는 HD(혈액투석)와 dialysis를 겹쳤고 `is consulted` 수동태도 어색하다 → C2.

### 4. `why` 임상 사실

**판정: 대체로 맞다. 고칠 것 5(W1~W5)와 결정 11 한 건(18.5).**
- 확인해 맞는 것: 1.0 활성탄은 흡수 전 약물에 붙음, 1.2 활성탄 구토 시 흡인, 5.0 아세트아미노펜 초기 무증상, 5.1 섭취 후 시간에 맞춘 농도 판단, 5.2 NAC 조기 시작, 6.0 날록손이 기도·호흡 지지를 대신하지 않음, 6.1 날록손 작용 시간이 짧음, 7.1 플루마제닐 발작(장기 복용·혼합 섭취), 7.3·15.1·15.3 기도·호흡·순환이 해독제보다 먼저, 8.1·8.4 요 알칼리화, 8.3 살리실산의 호흡 중추 자극, 8.5 흡수 지연으로 반복 측정, 9.1 QRS 넓어질 때 중탄산나트륨, 9.2 삼환계 소량도 위험, 10.0 INR, 10.5 두개내 출혈 등에서 지체 없는 역전, 11.2 자살 시도 후 곁에 사람, 13.0·13.4 맥박산소측정기가 COHb를 산소로 읽음, 13.1 고농도 산소가 COHb 반감기를 줄임, 14.2·14.4 치료팀 안에서만 공유(모든 비밀 약속 아님), 16.2 제독자 보호구, 16.5 아트로핀은 분비물이 마를 때까지 적정, 17.2 세인트존스워트, 18.1 포메피졸·투석, 15.2 take report.
- 고칠 것: 아래 W1~W5.

## 고칠 것

### why (5)
- **W1 · 5.4 why** · 둘째 문장 "의사 처방에 따라 정해지고, 정맥으로 주는 경우가 많아요"에 주어가 없어 무엇이 정해지는지 알 수 없다 · → "now로 지금 시작한다고 말하고 so로 목적을 이어요. NAC는 보통 정맥으로 몇 시간에 걸쳐 주고, 시작과 기간은 수치와 먹은 시각을 보고 의사가 정해요."
- **W2 · 10.3 why** · "실수라고 말해 주면 환자가 부담 없이 사실대로 말할 수 있어요" — `by mistake`를 질문에 넣으면 의도적 과다복용을 말하기 어려워진다. 근거 없는 주장이고 의도성 확인을 막는다 · → "by mistake로 환자가 말한 실수 복용을 그대로 받아, 부담 없이 양을 말하게 해요. 의도적이었을 가능성은 따로 물어 확인해요."
- **W3 · 4.1 why** · 발견 시각만으로 "위험 시점을 추정"한다고 함 — 섭취 시각의 범위는 마지막으로 괜찮았던 시각과 발견 시각 사이이고, 위험 판단은 더 이른 쪽을 기준으로 한다 · → "find her로 발견한 순간을 기준점으로 삼아요. 먹은 시각은 모르니 마지막으로 괜찮았던 시각과 발견 시각을 함께 알아야 먹은 시각의 범위를 좁힐 수 있어요."
- **W4 · 18.3 why** · "시력 변화가 메탄올 독성의 가장 중요한 단서" — 과장(검사의 대사성 산증·삼투압 차이도 핵심 단서) · → "시력 변화는 메탄올 독성의 중요한 단서라 지금 상태를 기록해 두고 변화와 비교해요."
- **W5 · 19.1 why** · "환자가 느끼는 변화는 모니터에 나타나기 전에 올 수 있어서" — 근거가 약하다(부정맥은 대개 모니터가 먼저 보인다) · → "가슴 두근거림이나 어지럼 같은 느낌은 모니터와 함께 악화를 알리는 단서라서 환자가 바로 말하게 해요."
- (선택) 12.2 why "곁을 떠나지 않는다고 약속해요" — 문장은 몇 분마다 확인한다는 말이라 "자주 와서 확인한다고 약속해요"로. 8.4 why는 8.1 why와 거의 같은 문장 — 8.4는 "helps로 중탄산염이 몸을 도와서 하는 일이라고 말해요. 치료 중에는 소변 산도와 칼륨을 함께 확인해요."처럼 다른 사실로.

### 빈칸 (40) — 정답이 둘인 것은 없음. 해로운 오답·문법으로 걸러지는 오답·동떨어진 오답·묶음 바꾸기
- **B1 · 0.1** · `away/later/left` — `how long away/later`는 비문, 문법으로 걸러짐 · → 빈칸을 `About`으로 옮기고 `About / Exactly / Precisely / Just` (ko "대략"이 가름).
- **B2 · 1.5** · `rarely` 돌려쓰기, `casually`는 장면 밖 · → `closely / briefly / remotely / occasionally`.
- **B3 · 2.5** · `never/barely/hardly` — 브리프가 이름을 든 묶음, `might hardly be`는 비문 · → 빈칸을 `home`으로 옮기고 `home / work / church / daycare` (ko "집에"가 가름. decoy `at school`과 겹치지 않게 school은 뺌).
- **B4 · 0.4** · (자기 보고 아님, 동떨어짐) `lonely/stuck/angry` — `keep you angry`는 장면 밖 · → `safe / calm / awake / comfortable` (ko "안전하게"가 가름).
- **B5 · 2.0** · `wake/check/feed yourself` 인위적(자기 보고 1) · → `hurt / treat / calm / numb` (먹은 이유로 실제 나오는 말, ko "다치게"가 가름).
- **B6 · 2.4** · `Next week/Every night/Last year` — `is`와 시제가 맞지 않음(자기 보고 1) · → 빈칸을 `only`로 옮기고 `only / first / next / usual`.
- **B7 · 5.5** · `skip` 돌려쓰기, `delay/rush each step`은 동떨어짐 · → `explain / record / check / time`.
- **B8 · 3.4** · `rub your eyes`는 화학물질 눈 노출의 금기(심각 2), `dry/cover`도 세척 대신 · → `flush / numb / check / test` (마취 점안·pH 확인은 실제 하는 일, ko "씻어내고"가 가름).
- **B9 · 3.5** · `last night/next week/yesterday` — 현재진행형과 시제가 맞지 않음 · → 빈칸을 `breathing`으로 옮기고 `breathing / swallowing / seeing / sleeping` (가스·부식성 노출에서 실제 묻는 말, ko "숨쉬기"가 가름).
- **B10 · 4.0** · `yesterday/tomorrow/last week` — `are left`와 시제가 맞지 않음 · → 빈칸을 `left`로 옮기고 `left / missing / spilled / crushed` (ko "남았나요"가 가름).
- **B11 · 4.5** · `pictures/photos`가 동의어 둘이라 오답임이 드러남 · → `care / notes / pictures / measurements`.
- **B12 · 6.1** · `rarely` 돌려쓰기, `closely` 정답이 세 번째 · → 빈칸을 `wake`로 옮기고 `wake / sit / stand / cheer` (`fall back`·`perk up`은 정답이 둘이 되니 피함).
- **B13 · 6.5** · `leaving right here`는 비문, `sleeping`은 장면 밖 · → 빈칸을 `again`으로 옮기고 `again / first / later / sooner`.
- **B14 · 7.3** · `paperwork/billing/discharge` — 장면 밖 행정 말 · → `airway / pain / comfort / sleep` (같은 분야에서 지금은 아닌 우선순위).
- **B15 · 9.3** · `rarely/seldom` 묶음 · → 빈칸을 `change`로 옮기고 `change / settle / improve / recover`.
- **B16 · 7.4** · `quickly/rapidly/suddenly` — 역전제 급속 투여 지시가 되고(심각 2) `quickly`·`rapidly`가 동의어 · → 빈칸을 `seizures`로 옮기고 `seizures / bleeding / rashes / fever`.
- **B17 · 8.4** · `morphine` — 살리실산 중독에 호흡 억제제(심각 2, 자기 보고 1) · → `bicarbonate / oxygen / insulin / calcium` (`potassium`은 실제로 알칼리화에 필요해 정답이 둘로 읽히니 피함).
- **B18 · 9.0** · `lazily/carelessly/casually` — 아무도 하지 않을 말, `closely` 정답 세 번째 · → 빈칸을 `rhythm`으로 옮기고 `rhythm / valves / sounds / muscle`.
- **B19 · 9.4** · `unwilling/afraid` 인위적(자기 보고 1) · → `ready / trained / allowed / unable`.
- **B20 · 9.5** · `unplug the monitor` — 삼환계 과다 환자에게 해로운 장면(심각 2) · → `watch / move / clean / adjust`.
- **B21 · 10.2** · `hiding/wanting any blood` — `hide` 묶음·장면 밖(`passing`은 정답이 둘이 되니 피함) · → 빈칸을 `bruising`으로 옮기고 `bruising / swelling / itching / sweating`.
- **B22 · 10.5** · `reluctant/unable/unwilling` — 9.4와 같은 인위적 묶음 · → 빈칸을 `reversal`로 옮기고 `reversal / pain / sleeping / nausea` (ko "역전제"가 가름).
- **B23 · 11.0** · `doubt/ignore/forget` — 공감 문장에 아무도 하지 않을 말, 11.3·11.4·14.5와 같은 묶음(`feel`은 ko "느껴져요"와 맞아 정답이 둘이 되니 피함) · → 빈칸을 `pain`으로 옮기고 `pain / danger / shock / denial`.
- **B24 · 11.3** · `deny/forget/doubt` 같은 묶음 · → `know / think / guess / bet` (모두 바른 영어, ko "알아요"가 가름).
- **B25 · 14.2** · `outside/beyond/against us`는 셋 다 비문(자기 보고 1) · → 빈칸을 `care team`으로 옮기고 `care team / family / employer / insurance`.
- **B26 · 11.4** · `blame/ignore/judge` 같은 묶음 · → 빈칸을 `alone`으로 옮기고 `alone / wrong / weak / broken`.
- **B27 · 13.2** · `twice/soon/first` — 기능어 자리, `feeling sick soon`은 비문 · → 빈칸을 `sick`로 옮기고 `sick / cold / hungry / sleepy` (같은 집 노출 장면에서 나올 말, ko "아프셨나요"가 가름).
- **B28 · 14.5** · `blame/judge/punish` 같은 묶음 · → 빈칸을 `happened`로 옮기고 `happened / changed / hurt / helped`.
- **B29 · 15.0** · `rash/fracture/sprain` 장면 밖 · → `toxidrome / seizure / stroke / head injury` (ko "톡시드롬"이 가름).
- **B30 · 15.2** · `abandoning/ignoring/delaying the airway` — 아무도 하지 않을 말 · → 빈칸을 `Unknown`으로 옮기고 `Unknown / Intentional / Accidental / Chronic` (ko "미상"이 가름).
- **B31 · 16.0** · `allergy/migraine/fracture` 장면 밖(`exposure`는 정답이 둘이 되니 피함) · → 빈칸을 `drooling`으로 옮기고 `drooling / bleeding / itching / shivering`.
- **B32 · 16.4** · `knees/wrists/shoulders` 장면 밖 · → `lungs / legs / ankles / belly` (같은 분야 "체액이 차는 곳").
- **B33 · 17.1** · `doubling/starting/adding the trigger` — 유발 약을 늘리는 말(심각 2) · → 빈칸을 `trigger`로 옮기고 `trigger / fluids / feeding / shivering` (ko "유발 원인"이 가름; `oxygen`은 끊으면 해로운 말이라 피함).
- **B34 · 17.2** · `next week/tomorrow/tonight` — `did you start`와 시제가 맞지 않음 · → 빈칸을 `supplement`로 옮기고 `supplement / diet / exercise / routine`.
- **B35 · 17.4** · `warm fluids/heat/blankets` — 고체온 환자를 데우는 말(심각 2) · → `cooling / oxygen / nutrition / counseling`.
- **B36 · 17.5** · `add/double/start every medication` — 같은 이유(심각 2) · → `stop / list / review / check` (ko "중단"이 가름).
- **B37 · 19.1** · `tomorrow/next week/sometime` 시간 묶음 · → 빈칸을 `worse`로 옮기고 `worse / better / easier / quieter`.
- **B38 · 19.5** · `late/absent/missing` 인위적, `ready` 정답 세 번째 · → 빈칸을 `team`으로 옮기고 `team / pharmacy / family / lab`.
- **B39 · 20.3** · `rose/held/doubled from fifteen to nine` — 숫자로 다 걸러짐 · → 빈칸을 `transport`로 옮기고 `transport / triage / handoff / intake`. **20.0** `despite/without/against the family`도 기능어로 걸러짐 → 빈칸을 `ninety`로 옮기고 `ninety / nineteen / thirty / nine` (듣기에 실제로 헷갈리는 숫자). (둘을 한 항목으로 셈.)
- **B40 · 20.5** · `cancel/skip/delay airway` 인위적(자기 보고 1) · → 빈칸을 `report`로 옮기고 `report / meds / fluids / blood` (ko "인계"가 가름). **20.4** `blocking/closing/covering his airway`도 아무도 하지 않을 말 → 빈칸을 `pressure`로 옮기고 `pressure / sugar / temperature / pupils`. (둘을 한 항목으로 셈.)
- 선택(더 바꾸면 좋은 것): 0.2 `in front of/away from it` → `along with / instead of / before / after`; 0.5 `throw` → `lose`; 0.3 `forget`(주제 안 4회) → `remember / forget / noticed`류로 하나만 남기기; 1.4 `fork` → `cup`; 11.5 `Nobody/Few/Most` → `Someone / Everyone / Security / Family`; 12.2 `quit/forget/stop`(8.5와 같은 묶음); 14.4 `tomorrow` → `at work`; 16.1 `thicken`(아트로핀은 실제로 분비물을 끈끈하게 함 — 경계) → `suction`; 17.0 `replace/deny` → `suggest / prove / confirm / guarantee`; 18.0 `treat/cure/prevent` → `mean / follow / mimic / cause`; 18.3 `teeth/knees` → `eyes / skin / breathing / kidneys`; 12.1·18.2 `spill/waste` 묶음 돌려쓰기.

### decoy (2)
- **D1 · 9.5** · `in bed`를 `for me` 자리에 넣은 `Stay still in bed while we watch the monitor.`가 ko "제가 모니터를 보는 동안 가만히 계세요"에 그대로 맞음(ko에 for me도 bed도 없음) · → `after the test` (어느 자리에 넣어도 문장이 안 됨).
- **D2 · 2.1** · `or tell anyone` — 자살 위험 사정에서 "아무에게도 말하지 않겠다"는 비밀 약속은 하면 안 되는 말이다(같은 주제 14.2·14.4 why도 "모든 비밀을 약속하는 말은 아니에요"라고 가르침) · → `for being here`.
- (경계, 고치지 않아도 됨: 11.3 `for you` — ko "지금"이 `right now` 자리를 가름; 6.5 `for a while` — ko "바로 여기"가 가름; 20.4 `with a mask` — 덧붙은 방식이 ko에 없음.)

### distractorsKo (29)
위험한 처치·잘못된 안심(심각 1):
- **K1 · 2.1** `지금 퇴원 서류를 가져올게요` · → `지금 활력징후를 잴게요`.
- **K2 · 6.5** `지금 퇴원 서류를 가져올게요`(2.1과 글자까지 같음) · → `보호자분 연락처를 적어 주시겠어요?`
- **K3 · 13.0** `산소 수치가 정상이니 안심하셔도 돼요` · → `두통은 언제부터 있었어요?`
- **K4 · 18.0** `시력은 곧 돌아올 거예요` · → `다른 분도 같이 드셨나요?`
- **K5 · 18.1** `투석은 퇴원한 뒤에 할 수 있어요` · → `소변 검사를 한 번 더 할게요`.
- **K6 · 12.3** `술이 깨면 약 효과도 바로 끝나요` / `술과 약을 같이 먹으면 간이 쉬어요`(틀린 설명) · → `술은 언제 마지막으로 드셨어요?` / `드신 수면제 이름을 아세요?`

틀린 의학 설명(간호사가 할 말이 아니고 학습자가 틀린 사실을 들음):
- **K7 · 1.0** `이 약은 위를 직접 씻어 내요`(위세척을 활성탄 설명처럼) · → `천천히 다 드시면 돼요`.
- **K8 · 5.2** `이 약은 통증을 바로 가라앉혀요` / `이 약은 위 속 약을 씻어 내요` · → `이 약은 정맥으로 몇 시간에 걸쳐 들어가요` / `간 수치는 내일 아침에 다시 볼게요`.
- **K9 · 8.1** `수액은 팔 대신 입으로 드릴게요` · → `소변 검사를 몇 번 할게요`.
- **K10 · 8.3** `빠른 호흡은 아스피린이 위에서 녹아서 생겨요` · → `숨이 더 차면 바로 말씀해 주세요`.
- **K11 · 8.4** `중탄산염은 위산을 더 늘려요` / `중탄산염은 열을 내려 줘요` · → `중탄산염은 정맥으로 천천히 들어가요` / `칼륨 수치도 함께 볼게요`.
- **K12 · 9.1** `이 약은 심장 박동을 더 빠르게 해요` / `이 약은 혈압을 바로 올려 줘요` · → `이 약은 정맥으로 들어가요` / `심전도를 한 번 더 찍을게요`.
- **K13 · 13.4** `산소 수치가 낮으면 일산화탄소가 높아요` · → `피 검사 결과는 곧 나와요`.
- **K14 · 16.0** `이 증상은 탈수 때문일 수 있어요` / `이 증상은 감기에서 흔해요` · → `그 살충제 통을 가져오셨나요?` / `보호복을 입고 씻겨 드릴게요`.
- **K15 · 16.1** `아트로핀으로 열을 내릴게요` / `아트로핀으로 통증을 줄일게요`(아트로핀은 오히려 체온을 올림) · → `숨소리를 계속 들어 볼게요` / `맥박이 빨라지는지 볼게요`.
- **K16 · 16.4** `아트로핀은 폐를 직접 씻어 내요` / `아트로핀은 맥박을 느리게 만들어요`(반대) · → `가래를 자주 뽑아 드릴게요` / `동공 크기도 같이 볼게요`.

반만 다르거나 뒤집은 것(TASK 8 ①):
- **K17 · 0.3** `확실하시면 약병을 보여 주세요` — 정답 "확실하지 않으셔도"를 뒤집음 · → `약은 집에서 드셨어요?`
- **K18 · 2.2** `지금도 그런 생각이 드세요?` — 정답 "오늘 전에도 이런 생각"과 시점만 다름 · → `오늘 술도 드셨어요?`
- **K19 · 14.2** `말씀하신 내용은 가족분께 먼저 알릴게요` / `… 다른 병원에도 보낼게요` — 정답(의료팀 사이에만)을 뒤집은 비밀 누설 · → `원하시면 상담 선생님도 불러 드릴게요` / `검사 결과는 의사 선생님이 설명하실 거예요`.
- **K20 · 14.4** `여기서는 누구도 비난하지 않아요` — 정답 "여기서 곤란해지지 않아요"와 거의 같은 뜻 → 정답이 둘 · → `약을 어디서 구하셨는지 여쭤봐도 될까요?`
- **K21 · 17.4** `진정시키는 약을 정맥으로 드릴게요` / `팔에 얼음 팩을 대 드릴게요` — 둘 다 정답("냉각과 약물")의 반쪽 · → `체온을 30분마다 잴게요` / `드신 약 목록을 보여 주세요`.
- **K22 · 18.5** `서두르는 이유는 시력 때문이에요` — 정답("시력과 신장 둘 다")의 반쪽 · → `투석실에 연락해 둘게요`.
- **K23 · 19.0** `리듬이 불안정한 건 약 때문일 수 있어요` — 정답의 "리듬이 불안정"을 되풀이 · → `심전도를 한 번 더 찍을게요`.
- **K24 · 20.4** `기도는 보호하고 있고 혈압은 안정적입니다` — 정답과 앞 절이 같음 · → `동공은 양쪽 다 커져 있습니다`.
- **K25 · 20.5** `기도와 혈압은 제가 계속 맡을게요`(뒤집기) / `혈압만 먼저 맡아 주실 수 있나요?`(반쪽) · → `의사 선생님은 지금 오고 계십니다` / `심전도를 바로 다시 찍어 주세요`.
- **K26 · 15.0** `동공이 크고 호흡수는 서른이에요` / `동공은 정상이고 호흡수는 열여섯이에요` — 숫자 뒤집기 둘 · → `날록손 0.4 mg 들어갔습니다` / `보호자가 약병을 가져왔습니다`.
- **K27 · 19.2** `QRS가 좁고 맥박이 빨라요` / `과다복용인데 활력징후는 안정적이에요` — 뒤집기 둘 · → `제세동기 패드를 붙였습니다` / `중탄산염을 한 번 더 준비해 주세요`.
- **K28 · 20.2** `마지막 혈압은 120에 80이었습니다` — 숫자 뒤집기 · → `이송 중 수액이 1 L 들어갔습니다`.

중복:
- **K29 · 0.0·0.2** — S0 여섯 문장 중 셋(0.0 `토하신 적은 있으세요?`, 0.1 `병원에 오기 전에 토하셨어요?`, 0.2 `약을 드신 뒤에 토하셨나요?`)이 같은 질문 · → 0.0 `평소 드시는 약이 있으세요?`, 0.2 `그 약은 누구 약이었어요?`.
- (선택) 1.4 `잘게 부숴서 드리면 더 쉬워요`(활성탄은 액체) → `조금씩 나눠 드셔도 돼요`; 1.5 `토하면 바로 활성탄을 다시 드릴게요` → `토하면 몸을 옆으로 돌려 드릴게요`; 3.2 `지금 구급차를 부를게요`(이미 응급실) → `의사 선생님께 먼저 알릴게요`; 10.1 `출혈 부위를 사진으로 남길게요` → `잇몸을 한 번 볼게요`; 13.1 `산소는 코로만 조금씩 드릴게요`·`몇 분만 쓰실 거예요`(과소 치료); 15.4 `활력징후를 한 번만 재요`; 17.1 `해열제를 먼저 드릴게요`(세로토닌 증후군의 고체온에는 해열제가 듣지 않음); 5.3·5.4 "간 수치를 다시 확인" 둘이 거의 같음; 6.2·16.3·19.3의 `그가`·`그의`(번역투) → `환자분이`·`혈압도`; 2.3 `이런 생각은 곧 사라질 거예요`·8.0 `귀 울림은 곧 가라앉을 거예요`·13.3·17.0의 "곧 괜찮아질" 류 근거 없는 안심.

### order (17장) — 새 줄은 모두 15단어 이하로 다시 셌다
- **O1 · S0 3↔4 열림** · L4 `the bottle for everything you've told me about`이 L2 뒤에도 붙음 · → L4 `Whatever else it was, do you have its bottle or package?` (L3의 anything else를 가리킴, 11단어). why의 가리키는 말 목록도 `Whatever else`로.
- **O2 · S2 L3·L4** · L3 `Thank you for telling me`는 환자가 답했다고 전제, L4 `anyone else`는 L3에 묶이지 않아 3↔4가 약하게 열림 · → L3 `Whatever your answer, I won't judge you, and I'm keeping you safe.` (12) / L4 `Along with your safety, is anyone else at home in danger?` (11).
- **O3 · S3 L2~L4** · L2 `With that answer`는 억지 연결어, L3 `calling … with those products`는 어색한 영어, L4는 세척을 독극물센터 답까지 미룸(심각 3) · → L2 `While I watch your breathing, which products did you mix?` (10) / L3 `I'm calling Poison Control about those products so we treat this right.` (12) / L4 `While they advise us, we'll rinse anything that touched your eyes or skin.` (13, 세척은 지금 시작). why도 "호흡을 지켜보며 제품을 묻고, 독극물센터에 그 제품으로 자문하는 동안 묻은 곳을 바로 씻어요."
- **O4 · S4 L2~L4** · L2 `at that time` 질문이 성립하지 않음(심각 6), L3를 L1 바로 뒤에 둬도 읽혀 2↔3, L4 `From here`는 L3 앞에도 붙어 3↔4가 열림 · → L2 `How many pills were in the bottle before that, and how many are left?` (14) / L3 `Bringing that bottle in with her was the right thing to do.` (12) / L4 `Thanks to that, we know exactly what to watch for.` (10).
- **O5 · S5 L2·L4 (3↔4 약하게 열림)** · L2 `check … the exact time you took it`은 어색, L4 `each step of it`이 L2의 검사를 가리켜도 읽힘 · → L2 `That's why we'll check your acetaminophen level against the exact time you took it.` (14) / L4 `I'll explain each step of that treatment so you know what's happening.` (12).
- **O6 · S6 L3 (2↔3 약하게 열림)** · L3 `His breathing should look better …`이 L1(호흡 지지) 바로 뒤에도 읽힘 · → L3 `That should make his breathing better within a few minutes.` (10, `That`이 L2의 날록손).
- **O7 · S7 L3** · 플루마제닐을 기본 단계로(심각 4) · → L3 `If the doctor decides it's safe, the reversal drug goes in slowly.` (12, 진짜 조건부). why에 "섞어 먹었거나 오래 먹은 사람에게는 쓰지 않는 경우가 많아요"를 더함.
- **O8 · S8 L2** · `With that many`가 답을 전제하고 귀 울림을 개수에 묶음 · → `Whatever the number, that ringing in your ears means the level may be high.` (14).
- **O9 · S10 L2~L4** · L2·L3 전제(심각 7), L4 `That's why` 인과 불일치(자기 보고 2) · → L2 `While we wait on that, any bruising or blood in your urine?` (11) / L3 `If so, or if the INR is high, we have a reversal medicine.` (12, 진짜 조건부 — TASK 10 예외) / L4 `With or without that medicine, we're watching closely for any new bleeding.` (12).
- **O10 · S11 L2~L4 (2↔3 열림, 자기 보고 2)** · → L2 `While I'm here, can you tell me each thing you took?` (11, L1 `staying right here`를 가리킴) / L3 `Knowing each of those helps the doctor treat every one safely.` (11) / L4 `Once you're medically safe, a counselor will come talk with you.` (11, 정신과 평가는 의학적 안정 뒤 — 실제 순서). why도 "공감하고, 곁에 있는 동안 먹은 것을 묻고, 그 정보가 치료에 쓰인다고 알린 뒤, 안정되면 상담사가 온다고 닫아요."
- **O11 · S12 L3** · `With that amount in mind`는 억지 연결어이고, 몇 분마다 확인은 양과 관계없이 함(TASK 10 갈래) · → `Whatever the amount, I'll check your oxygen and alertness every few minutes.` (12).
- **O12 · S14 L4 (3↔4 열림, 자기 보고 2)** · `Beyond that`은 `Also`류 · → `With that promise, can you tell me what you took?` (10, L3의 비밀 범위를 가리킴; 문진 요청으로 닫음). note `요청`.
- **O13 · S15 L4** · `With naloxone requested`는 억지 연결어(순서는 닫혀 있음) · → `While that's coming, can you take report? I'll stay with the airway.` (12, `that`이 L3의 날록손, 인계를 미루지 않음).
- **O14 · S17 L4** · `calm your body from what the trigger caused`는 어색한 영어 · → `Cooling you down eases the reaction that trigger caused.` (9, `that trigger`가 L3을 가리켜 3↔4도 닫힘).
- **O15 · S18 L4 (3↔4 열림 + 사실)** · `That's why we're moving fast`가 L2 바로 뒤에도 읽히고, `kidneys`는 메탄올의 표적이 아님(심각 5) · → `Both of those work best early, so we're moving fast.` (10, L3의 해독제·투석을 가리킴).
- **O16 · S19 L3·L4 (3↔4 약하게 열림)** · L3 `widening or slowing`은 환자에게 쓰는 의료진 말(19.3은 동료에게 한 말), L4 `That's why`가 L3과 인과로 이어지지 않음 · → L3 `Whatever you feel, I'm also watching your heart on this monitor.` (11) / L4 `For any change on that screen, the team is ready with everything.` (11).
- **O17 · S20 L2·L3 (1↔2·2↔3 열림)** · L2 `He`는 L1에 사람 명사가 없어 가리키지 못하고, L3 혈압 보고가 L1 바로 뒤에도 읽힘 · → L2 `Since then, he went from talking at pickup to hypotensive and drowsy.` (12, L1의 섭취 시각을 가리킴) / L3 `For that low pressure, eighty over forty, I gave a bicarb bolus.` (12).
- (선택) **S16 L3** `With his breathing protected`는 아트로핀이 한 일을 과장 · → `While atropine works, we need to remove his clothes and wash his skin.` (13). 제독을 아트로핀 뒤에 둔 순서 자체는 받아들인다 — 아트로핀이 호흡을 살리는 처치이고, 제독은 보호구를 입고 동시에 한다. **S9 L2** `its electrical signal`의 `its` → `your heart's`.

### context·swap (2)
- **C1 · S1 `vomiting` 장면 2(XX)** · `vomiting or emesis` 겹침 · → en `Report any vomiting — aspiration risk with the charcoal.` (어색함은 `Report`·`aspiration risk`가 맡음; fix·why 그대로, why의 `emesis`는 장면 1에 남아 있음).
- **C2 · S18 `dialysis` 장면 3(XX)** · HD와 dialysis 겹침, `is consulted` 수동태 · → en `We're consulting nephrology for emergent dialysis — you'll need access.` (어색함은 `nephrology`·`emergent`·`access`; fix 그대로, why의 `HD`는 장면을 따라 "nephrology·emergent·access는 의료진끼리의 말이라"로).

### tag·icon (1)
- **I1 · S13 order L3 icon** `pill` — 고유량 산소 줄인데 약 아이콘, 같은 내용의 13.1은 `monitor` · → `monitor`. (사소: S17 L4 냉각 `pill` → `shield`.)

## 결정 11 — base 문장·단어 (v46에서는 고치지 않음, 따로 보고)
- **G1 · 18.5 en** `your vision and kidneys are both at risk` — 메탄올의 표적은 시신경과 대사성 산증이고, 신장은 에틸렌글리콜의 특징이다. 같은 문장 why("시신경 손상과 산증")와도 어긋난다. → `because your vision and your blood's acid level are both at risk`류.
- **G2 · 1.3 en** `it will help clean out the poison` — 활성탄은 위장 안 약물에 붙어 흡수를 막는 것이지 "씻어 내는" 것이 아니다(1.0 why가 정확함). 경미.
- **G3 · 17.4 en** `We're giving cooling and medication` — `giving cooling`은 부자연스러운 영어(→ `We're cooling you and giving medication to calm your body down.`).
- **G4 · S18 제목** `청산/메탄올 중독` — 문장·뉘앙스 어디에도 청산(시안화물)이 없다. in-json S16 brief의 PAM(프랄리독심)도 내용에 없다. 의도된 범위인지 확인만.
- **G5 · 15.0 ko** `톡시드롬` — 음차라 한국 간호사에게 낯설 수 있다(→ `중독 증후군(톡시드롬)`). 20.2 ko `드렸습니다`는 인계 말이라 `투여했습니다`가 맞다.
- 청크 경계(보고만): 3.0 `and did you breathe / in the fumes`(구동사 breathe in을 끊음), 17.3 `and your body / temperature is`(복합명사를 끊음), 14.1 `. Can we talk`(마침표가 다음 문장 조각에 붙음).
- W13 3건(`lately`·`cloths`·`lunge`)은 v45 단어 오답이라 이번 범위 밖.

## 종합
고칠 것 **96건**(why 5 · 빈칸 40 · decoy 2 · distractorsKo 29 · order 17 · context 2 · icon 1; 선택·결정 11은 따로).
정답이 둘인 빈칸은 없고, 기도·호흡 지지가 해독제보다 앞서는 원칙은 why와 order에서 일관되며, 구토 유도는 정답·오답 어디에도 없다. context 정비도 대체로 좋다. 그러나 이 주제에서는 **해로운 처치가 오답으로 들어간 곳**(빈칸 7: 눈 비비기·모르핀·모니터 뽑기·유발 약 늘리기·고열에 데우기·역전제 급속 투여, 오답 뜻 6: 퇴원 서류 두 번·"산소 수치 정상이니 안심"·"시력은 곧 돌아옴"·투석 연기·"술 깨면 약 효과도 끝")과 틀린 의학 설명을 오답 뜻으로 쓴 10문장이 가장 큰 문제이고, 앞 주제와 같은 빈칸 묶음 돌려쓰기·열린 order 8장·답을 전제한 줄이 남았다. 심각 1~7은 꼭 고쳐야 하며, 위를 반영하면 내보내도 된다.
