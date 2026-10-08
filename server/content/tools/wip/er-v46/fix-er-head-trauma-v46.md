# er-head-trauma — v46 보강 검토 (er)

대상: `er-head-trauma.yaml` (상황 20 · 문장 121 · order 20장 · 뉘앙스 context 12 · swap 10). 문장 121개와 order 20장을 전부 봤다.
상황 번호는 파일 순서 0부터(S0 = 두부외상 초기 사정 … S19 = 외상성 발작 동반), 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 484줄, decoy를 청크 자리마다 바꿔 넣은 조립(약 420줄), order 인접 교환 60가지와
줄 단어 수, context 12건의 세 장면 `en`에 `word`가 글자 그대로 있는지, swap `ko` 10건(정답을 넣은 문장과 대조), base와 v44 필드 비교
(단어·문장 바뀐 것 없음, 뉘앙스는 context `word`·`ko`와 swap `ko`만 더해짐 — context 장면은 손대지 않음), 검사기 결과(`==> 통과`, W14 6건).

판정 기준: 빈칸·조립 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. 문법도 맞고 임상적으로도
맞는 말이지만 `ko`가 걸러 주는 오답은 괜찮은 것으로 봤다 — 2.3 `shape`, 2.5 `vision`·`balance`, 6.5 `pain`, 8.2 `scan`, 15.4 `measure`,
16.3 `surgery`, 16.5 `drops`(뇌손상에서는 저혈압도 피하지만 `ko` "튀지 않도록"이 거름), 19.1 `medicine`, 13.1 `need`.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 첫 문장은 거의 다 말하는 방식의 이유(at all·the whole time·could mean·현재완료)를 짚고 `ko`를 되풀이하지 않는다. 임상 사실도 대부분 맞다(자기 보고 (2)·(3) 모두 맞음). 틀린 것 1건: 2.5 "동공 변화는 뇌압 상승의 빠른 신호"(stroke 22.4와 같은 오류). 다듬을 것 5건: 5.4(깨우기는 지시가 있을 때), 8.4(가장 먼저), 10.0(지연 시간), 14.0(전형은 의식 저하), 19.4·19.5. |
| 2 | 빈칸 | 3 | `ko`까지 보면 정답이 둘인 것은 12.5 `before` 하나. 그러나 이어진 검토에서 되풀이된 갈래가 그대로 있다: 시간 단위 돌려쓰기(2.2·4.0·4.4·5.4), 장면과 동떨어진 말(5.0·5.3·5.5 `fever/rash/cough` 묶음, 5.1 `boredom`, 8.1 `laughter`, 11.3 `hungry/thirsty`, 19.0 `ice/food`), 비용·사람 묶음(9.2 `bill`, 12.4 `dietitian`, 14.2 `dermatology`), 문법으로 걸러지는 것(4.0 `hours`, 5.2 `yesterday`, 7.3 `seldom`, 19.3 `ended/paused/stopped`). 고칠 것 26문장. |
| 3 | `decoy` | 4 | `ko`에 맞는 다른 문장이 되는 것은 6.5 `right now` 하나(`now,` 자리에 넣으면 쉼표만 빠진 정답). 빈칸 오답과 같은 말을 decoy로 다시 쓴 것(1.3·7.0·12.0·13.4·14.4·17.1·19.3·19.4)과 시간·`How often`·`than usual` 돌려쓰기는 `ko`가 걸러 주므로 보고만 한다. |
| 4 | `distractorsKo` | 4 | 같은 상황에서 할 법한 말이 대부분이다(2.3·10.2·15.1·18.5 등 좋음). 고칠 것 13문장: 정답과 반만 다른 말 9(4.4·6.3·8.4·9.2·10.5·14.1·16.0·17.0·18.4), 뒤집기·어색한 말 3(1.2·1.5·7.5), 틀린 임상 사실 1(16.4 "혈압 관리는 기도 확보 뒤"). |
| 5 | `order` | 3 | 앞 줄을 가리키는 말로 묶은 설계는 대체로 잘 됐다(`If so` 류 조건부 줄은 0장). 문제는 시간으로 묶은 줄과 열린 교환이다: **S19**(기도·산소를 "약이 듣는 동안"만, 뇌압 감시를 "약이 들은 뒤"로 미룸, 2분에 약), **S17** `Until they arrive`(물체를 건드리지 말라는 말이 신경외과 도착으로 끝남), **S15**(동공이 터졌는데 비교·해석을 마친 뒤에 신경외과를 부름), S7 `While we wait`, S14 `As you talk`(억지 연결)·CT 없이 수술. 열린 교환: S9 3↔4, S5 3↔4, S10 3↔4(약함), S2 1↔2(약함), S17 2↔3. 15단어 넘는 줄 없음. `ko` 머리말은 모두 카드와 맞다(S18 "SBAR"은 순서가 S→A→B라 참고). |
| 6 | `tag`·`icon` | 4 | 태그는 역할을 말하고 상황 안에서 일관된다. 아이콘은 사소하다: 소아 상황 S8에 `baby`가 있는데 안 씀, 9.0 음주 문진에 `coffee`(목록상 대안 없음, 그대로 둬도 됨), 16.3·19.5 `gear`. |
| 7 | context `word`·`ko`, swap `ko` | 3 | swap `ko` 10건은 모두 정답을 넣은 문장의 뜻이다. context `ko`는 정확하다(7 `경막하`는 `경막하 혈종`이 더 낫다). 그러나 **W14 6건**(LOC·PERRL·emesis·subdural·ecchymosis·somnolent) — 저작자가 바뀌기 전 규칙으로 써서 ok=true 장면 하나가 `word`를 풀어 썼다. 줄기만 같아 W14를 통과한 3건(anticoagulated/anticoagulation, intubating/Intubated, benzo/benzodiazepine)은 글자 그대로 맞추길 권한다. S15는 `word`가 `nonreactive`인데 `why`는 `blown`을 설명한다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음, 확인했다. (2) 동떨어진 빈칸 오답·돌려쓰기 약 20문장, 관사·문법으로 걸러지는 것 4(4.0·5.2·7.3·19.3). (3) order 못 박기: 열린 카드 5장(S2·S5·S9·S10·S17). (4) 임상 순서·사실: order 4장(S15·S17·S19·S14), why 1건(2.5). (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **S19 order — 기도·산소와 뇌압 감시를 시간으로 묶었다(TASK 10).** L3 `While it takes effect, we're protecting the airway and giving oxygen.`은 기도·산소를
   "약이 듣는 동안"만 하는 일로, L4 `Once the medication has worked, we'll recheck his GCS and watch for rising brain pressure.`는 신경학적 재평가·뇌압
   감시를 발작이 멎은 뒤로 미룬다. 발작 환자의 기도·산소는 처음부터 끝까지 하고(같은 상황 19.5 "동시에 관리"), 뇌압 감시도 지금 하는 일이다(19.2
   `Watching closely for rising brain pressure` — 현재). 또 L2 `Because of that`이 "거의 2분"을 약을 주는 이유로 만든다 — 벤조디아제핀은 대개 발작이
   5분 넘게 이어질 때(지속 발작 기준) 또는 처방·프로토콜에 따라 준다. 2분은 저절로 멎는 발작이 흔한 길이다. why도 같은 흐름이다.
2. **S17 order L4 `Until they arrive, try not to touch or move near it.`** — 박힌 물체를 건드리지 말라는 말은 신경외과가 도착해도 끝나지 않는다. 수술실에서
   제거할 때까지다(stroke S22와 같은 시간 한정 갈래). why "도착 전까지 건드리지 말라고"도 같다.
3. **S15 order — 부르는 것이 마지막.** L1에서 이미 한쪽 동공이 산대(blown)됐다고 선언했는데 L2 다른 쪽 비교 → L3 의미 해석 → L4 그제서야 신경외과에
   전화한다. 뇌탈출 임박은 TASK 10의 "기다리지 않고 바로 부르는" 갈래다. 부르기를 L2로 올리고 비교는 그동안 한다.
4. **2.5 why "동공 변화는 뇌압 상승·뇌 손상의 빠른 신호"** — 뇌압 상승에서 먼저 오는 것은 의식 수준 저하이고, 한쪽 동공 산대는 늦은 신호다(뇌탈출 임박).
   stroke 검토 22.4와 같은 오류. 학습자가 동공만 보고 의식 저하를 늦게 보고할 수 있다.
5. **context 6건이 새 규칙(TASK 9)에 맞지 않는다(W14)** — 화면 제목 "`LOC`가 어색한 장면은?"인데 의사에게 보고 장면에 `LOC`가 없다. 아래 C 표.
6. **18.3 `Left pupil remains reactive and equal.`(v44 문장, 결정 11)** — 같은 상황 18.1이 "우측 동공 산대"인데 좌측이 "equal"이라고 한다. `ko`도
   "양쪽이 동일합니다". 한쪽이 산대됐으면 양쪽은 같지 않다. 아래 결정 11.

## 저작자 자기 보고 판정

1. **귀가교육 5.4 "몇 시간마다 깨우기"** — **문장은 그대로 둬도 되고, why를 한정한다.** 지금의 미국 지침(CDC HEADS UP 등)은 경증 뇌진탕 뒤 자는 것을
   막거나 정해진 간격으로 깨우는 것을 모든 환자에게 권하지 않는다. 그러나 의사가 위험도를 보고 첫날 밤 깨워 확인하라고 지시하는 귀가 안내는 아직
   흔하므로 문장 자체가 틀린 것은 아니다. 문제는 why가 이것을 일반 원칙처럼 말하는 것이다 → W2. (참고: 5.4는 `him`이라 보호자에게 하는 말인데 상황
   역할은 `patient`다. 귀가교육에 보호자가 같이 있는 장면이라 괜찮다.)
2. **base 문장의 삽관·뇌탈출** — **둘 다 맞다, 결정 11 아님.**
   - 16.0 `GCS is 6—we need to secure the airway.`와 why "GCS 8 이하면 … 기도 확보를 고려": 맞다(ATLS·BTF — 중증 두부외상 GCS ≤ 8은 기도 확보 대상).
     "고려"로 한정한 것도 정확하다.
   - 15.1 `We're hyperventilating and giving medication to reduce pressure.`와 why "일시적으로 과호흡 … 압력을 낮추는 약도": 맞다. 뇌탈출 징후가 있을 때
     짧게 과호흡(PaCO2를 잠깐 낮춤)과 고장성 약물(만니톨·고장성 식염수)은 수술 전 임시 조치다. why가 "일시적으로"를 넣어 예방적 과호흡과 구분한 것도 좋다.
     16.2 "정상 CO2 목표"와도 어긋나지 않는다(평소엔 정상 CO2, 탈출 징후 때만 잠깐 과호흡).
   - 대신 결정 11로 올릴 것은 위 6번 18.3 하나다.
3. **why 임상 사실** — **모두 맞다. 하나만 다듬는다.**
   - 10.0 눈 주위 멍의 지연: 맞다. 두개저 골절의 너구리눈은 외상 직후가 아니라 늦게(대개 몇 시간에서 하루 이틀 사이) 나타나고, 눈을 직접 맞아 생긴 멍은
     바로 생긴다. "몇 시간 뒤"만 쓰면 범위가 좁으니 W4처럼 넓힌다.
   - 10.5 Battle 징후(귀 뒤 꼭지돌기 부위 멍): 맞다. 이것도 하루 이틀 늦게 나타나는 일이 많다.
   - 10.2 코 풀기 금지: 맞다(공기·세균이 골절 틈으로 들어가 기뇌증·수막염 위험). "알려져 있어"로 한정한 것도 적절하다.
   - 17.0·17.3·17.5 박힌 물체: 맞다(빼지 않고 고정, 물체가 출혈을 막고 있음, 수술실에서 신경외과가 제거).
   - 16.2 CO2 목표: 맞다(높으면 뇌혈관 확장 → 뇌압 상승, 너무 낮으면 혈관 수축 → 허혈).
   - 6.1·6.5 항응고제 지연 출혈: 맞다. 항응고제 복용자는 첫 CT가 깨끗해도 늦게 출혈이 생길 수 있어 관찰·재촬영을 하기도 한다. S6 order L4도 맞다.
   - 8.1·8.4·8.5 소아 두부외상 신호(구토·평소와 다른 졸림·보챔·잘 안 깸): 맞다(CDC·PECARN의 "평소처럼 행동하지 않음"). 8.4의 "가장 먼저"만 과장 → W3.

## 고칠 것

### order (9)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| O1 | S19 전체 | 시간으로 묶어 기도·산소·뇌압 감시를 미룸, 2분에 약(심각 1) | L1 `The seizure has lasted almost five minutes now.` / L2 `Because it's lasted that long, we're giving medication to stop it.` / L3 `Along with the medication, we keep protecting his airway and giving oxygen.` / L4 `Through all of that, we're watching his pupils and GCS for rising pressure.` why → "발작이 5분 가까이 이어져 멈추는 약을 쓰고, 그 내내 기도·산소를 지키며, 뇌압 신호를 함께 봐요. 'that long'·'the medication'·'all of that'이 앞 줄을 가리켜요." (5분 대신 "처방대로"를 쓰려면 L2 `Per protocol, we're giving medication to stop it.`) |
| O2 | S17 L4 (+ L2·L3) | `Until they arrive` 시간 한정(심각 2). 또 L2·L3 교환이 열림(L4 `they`가 두 줄 위의 neurosurgery를 가리켜도 읽힘) | L3 `That's also why we won't remove it here; neurosurgery will, in the OR.` (L2의 "움직이지 않게"를 받음), L4 `Until it's removed in the operating room, try not to touch it.` why "도착 전까지" → "수술실에서 뺄 때까지" |
| O3 | S15 전체 | 비교·해석을 마친 뒤 부름(심각 3) | L1 그대로 / L2 `Because of that, get neurosurgery on the phone right now.` / L3 `While you call, I'll check the other pupil and compare both sides.` / L4 `That difference tells neurosurgery how fast the pressure is rising.` why → "응급을 선언하면 바로 신경외과를 부르고, 그동안 다른 쪽 동공과 비교해 그 차이를 전해요." |
| O4 | S14 L3·L4 | L3 `As you talk,`은 억지 연결(말하는 것과 출혈 판단이 상관없음). L4는 CT 없이 "빨리 수술" | L3 `From what you're telling me, this looks like bleeding building up fast.` (L2 "계속 말해 달라"를 받음), L4 `Because of that, we're getting an urgent scan and calling neurosurgery now.` why의 "말을 이어 가게 하며 상태를 설명" → "환자의 말에서 출혈이 빠르게 쌓이는 양상을 읽고, 응급 CT와 신경외과 호출로 이어 가요" |
| O5 | S9 L4 | L3 `Because of that`과 L4 `That's why`가 둘 다 L2를 가리켜 3↔4가 열림 | L4 `We'll do those rechecks until you're clearly sober and steady.` (L3의 recheck를 받음). why의 'That's why' → 'those rechecks' |
| O6 | S5 L4 | L4 `those warning signs`가 L2를 가리켜 L3 앞에도 놓임(3↔4 열림) | L4 `So you don't forget when to come back, I'll write it all down.` (L3 "돌아올 기준"을 받음) |
| O7 | S10 L4 | `Because of that`이 L2(맑은 액체) 뒤에도 붙어 3↔4가 약하게 열림 | L4 `With a possible fracture, please don't blow your nose.` (L3 "골절"을 받음) |
| O8 | S7 L4 | `While we wait for the scan, tell us …` — 평소와 다른 점은 스캔을 기다리는 동안만 묻는 것이 아님(시간 한정, 약함) | `Whatever the scan shows, tell us right away if he seems different than usual.` why "기다리는 동안" → "결과와 상관없이" |
| O9 | S2 L1·L4 | 1↔2가 약하게 열림(`This checks…`가 펜라이트를 가리키며 첫 줄로도 읽힘). L4 `Any difference in that comparison, I'll tell …`은 문법이 어색 | L1 `First, I'm shining a light in your eyes, so please look straight ahead.`, L4 `If that comparison shows any difference, I'll tell the doctor right away.` |

참고(고치지 않아도 됨): S8 L2 `to see if that story matches what we see`를 부모에게 그대로 말하면 8.3 why가 피하라는 의심하는 말투가 된다 —
`We'll examine him carefully, and your story helps us understand what we see.`로 바꾸면 더 낫다. S6 L4 `With a clear scan,` → `Even with a clear scan,`.
S3 L2 `I can feel … bleeding`(출혈은 만지는 것이 아니라 보는 것) → `As I do that, I can feel a bump and some swelling, and it's bleeding.`
S18은 머리말이 "SBAR"인데 줄 순서가 상황(GCS) → 사정(동공) → 배경(아픽사반)이고 권고가 없다. 순서는 하나로 맞으니 그대로 둬도 된다.
`While`·`Once`·`Until then`으로 묶었지만 괜찮은 줄: S11 L4 `Until then`(회복 기간의 안내라 맞음), S13 L2 `Until then`(통역 오기 전 임시 몸짓),
S16 L3 `Once he's intubated`(삽관 뒤 인공호흡기 목표), S4 L4 `Between those hourly checks`(언제든 알리라는 뜻).

### why (6)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| W1 | 2.5 | "빠른 신호" — 사실 오류(심각 4) | "could mean으로 가능성만 말해 겁주지 않으면서 중요성을 전해요. 동공 변화는 뇌압이 이미 많이 올랐다는 늦은 신호라, 의식 수준과 함께 보고 바로 알려요." |
| W2 | 5.4 | 깨우기를 일반 원칙처럼 말함(자기 보고 1) | 둘째 문장 → "모든 환자에게 하는 것은 아니고, 의사가 첫날 밤 확인하라고 할 때 깨워서 평소처럼 반응하는지를 봐요." |
| W3 | 8.4 | "부모가 가장 먼저 알아챌 수 있는 변화" — 과장 | "…평소보다 더 졸린 것은 소아 두부외상에서 부모가 알아채기 쉬운 경고 신호예요." |
| W4 | 10.0 | "몇 시간 뒤"만 — 범위가 좁음 | "눈 주위 멍이 외상 직후가 아니라 몇 시간에서 하루 이틀 뒤에 양쪽으로 생기면 두개저 골절을 시사해요." |
| W5 | 14.0 | "갑자기 심해지는 두통은 경막외혈종의 전형적인 악화" — 전형은 명료기 뒤 의식 저하 | 둘째 문장 → "명료기 뒤 두통이 갑자기 심해지고 의식이 떨어지는 것이 경막외혈종의 전형적인 악화 양상이에요." |
| W6 | 19.4 · 19.5 | 19.4 둘째 문장은 발작 뒤 정상적인 의식 저하(발작 후 상태)와 구분이 없음. 19.5 "우선순위가 같아서"는 기도 우선 원칙과 어긋나 보임 | 19.4 → "…발작이 멈춘 뒤에도 의식이 예상보다 오래 돌아오지 않으면 출혈 같은 다른 원인을 의심해요." 19.5 → "…발작을 멈추는 약과 기도 관리는 팀이 역할을 나눠 동시에 진행해요." |

### 빈칸 (26)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| B1 | 12.5 | `an hour before`도 문법에 맞고 `ko` "한 시간 전"에 맞음 — 정답 둘 | 빈칸을 `wake`로: 선택지 `wake / feed / move / lift` |
| B2 | 2.2 | `a day/week/month` — 시간 단위 돌려쓰기, 우스움 | 빈칸을 `still`로: `still / up / out / back` (`hold up`은 "기다려"라 `ko` "가만히"가 거름) |
| B3 | 4.0 | `How many hours/days/weeks have you vomited?` — 문법으로 걸러짐 | 빈칸을 `vomited`로: `vomited / coughed / fainted / choked` |
| B4 | 4.4 | `each day/week/month` — 시간 돌려쓰기 | `day → shift`, `week → meal`, `month → dose` |
| B5 | 5.4 | `every few days/weeks` — 시간 돌려쓰기 | 빈칸을 `responds`로: `responds / sleeps / eats / walks` |
| B6 | 5.0 | `fever/rash/cough` — 두부외상 귀가교육과 동떨어짐(5.3·5.5와 같은 묶음) | `fever → bruising`, `rash → swelling`, `cough → soreness` |
| B7 | 5.3 | 같은 `cough/rash/fever` 묶음 | `cough → bump`, `rash → bruise`, `fever → swelling` |
| B8 | 5.5 | `cough/rash` 묶음 | `cough → bruise`, `rash → ache` (`cramp`는 그대로) |
| B9 | 5.1 | `thirst/boredom/hunger` — 동떨어짐 | `thirst → soreness`, `boredom → stiffness`, `hunger → bruising` |
| B10 | 5.2 | `yesterday` — 문법·논리로 걸러짐 | `yesterday → all week` |
| B11 | 6.3 | `lighter/easier` — 뜻이 안 이어짐 | `lighter → milder`, `easier → slower` (`safer`는 그대로) |
| B12 | 6.4 | `fever/allergy` — CT가 찾는 것과 동떨어짐 | `fever → fractures`, `allergy → swelling` (`ko` "출혈"이 거름) |
| B13 | 7.3 | `than he seldom/rarely does` — 문법으로 걸러짐 | 빈칸을 `differently`로: `differently / better / calmer / quieter` |
| B14 | 8.1 | `laughter/hunger/thirst` — 동떨어짐 | `laughter → teething`, `hunger → drooling`, `thirst → sneezing` |
| B15 | 8.4 | `hungry/thirsty` — 5.1·11.3과 같은 묶음 돌려쓰기 | `hungry → playful`, `thirsty → active` (`chatty`는 그대로) |
| B16 | 9.1 | `fever/hunger` — 동떨어짐 | `fever → low sugar`, `hunger → a seizure` (`medicine`은 그대로) |
| B17 | 9.2 | `bill/weigh` — 청구서 묶음·동떨어짐 | `bill → transfer`, `weigh → admit` |
| B18 | 10.0 | `I see itching` — 가려움은 볼 수 없어 논리로 걸러짐 | `itching → scratches` |
| B19 | 11.0 | `hiccups/coughs` — 동떨어짐, `hiccups` 돌려쓰기(8.5) | `hiccups → neck pains`, `coughs → earaches` |
| B20 | 11.3 | `thirsty/hot/hungry` — 동떨어짐 | `thirsty → sleepy`, `hot → numb`, `hungry → nauseous` |
| B21 | 12.4 | `dietitian` — 보고 장면과 동떨어짐(stroke B7과 같음) | `dietitian → charge nurse` (`neurologist`는 `ko` "의사"에 맞아 쓰지 않는다) |
| B22 | 14.2 | `dermatology` — 동떨어짐 | `dermatology → orthopedics` |
| B23 | 17.3 | `itching/cramping` — 동떨어짐 | `itching → swelling`, `cramping → bruising` (`damage`는 정답과 겹쳐 쓰지 않는다) |
| B24 | 17.4 | `nutrition/dialysis` — 동떨어짐 | `nutrition → stroke`, `dialysis → burn` |
| B25 | 19.0 · 19.1 | 19.0 `ice/food`, 19.1 `food` — 동떨어짐 | 19.0 `ice → oxygen`, `food → sugar`. 19.1 `food → blood` |
| B26 | 19.3 | `has ended/paused/stopped almost two minutes` — 셋 다 문법으로 걸러짐 | 빈칸을 `seizure`로: `seizure / tremor / headache / shivering` |

(13.5 `chaplain`은 통역과 같은 "돕는 사람" 자리라 그대로 둬도 된다. 9.5 `start/quit/stop`, 14.1 `stop/quit/avoid`, 18.0 `improved/recovered/rose`는
방향 대비(파일럿 2(a))라 괜찮다.)

### decoy (1)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| D1 | 6.5 | `right now`를 `now,` 자리에 넣으면 `Even without symptoms right now bleeding can show up hours later` — `ko`에 맞는 문장 | `yesterday` |

(보고만: 빈칸 오답과 같은 말을 decoy로 다시 씀 — 1.3 `as gently as`, 7.0 `Where exactly`, 12.0 `has he slept`, 13.4 `or wave`, 14.4 `This small change`,
17.1 `as high as`, 19.3 `has stopped`, 19.4 `is rising`. 돌려쓰기 — `How often`(9.0·11.0), `than usual`(2.4·12.5), `to clean`(3.1·16.0), `quickly`(6.1·8.2),
시간 표현(`in a few days`·`next week`·`last week`·`in the last week`·`later today`·`each morning`·`in the morning`·`until morning`·`within a day`). 모두 `ko`가 거른다.)

### distractorsKo (13)

| # | 어디 | 지금 | 바꿀 말 |
|---|---|---|---|
| K1 | 4.4 | `활력징후를 한 시간마다 잴게요` (정답 "매시간 … 기록"과 반만 다름) | `토할 것 같으면 이 봉투를 쓰세요` |
| K2 | 6.3 | `약 때문에 멍이 더 쉽게 들 수 있어요` (항응고제 → 다치면 더 나쁨, 반만 다름) | `약은 오늘 아침에도 드셨어요?` |
| K3 | 8.4 | `아이가 잠들면 저희에게 알려 주세요` ("잠·알려 주세요"가 겹침) | `아이가 좋아하는 장난감이 있으면 주세요` |
| K4 | 9.2 | `술이 깰 때까지 침대에서 쉬세요` ("계셔 주세요"와 겹침) | `물 한 잔 가져다 드릴게요` |
| K5 | 10.5 | `귀 안도 불빛으로 살펴볼게요` ("귀 … 확인"이 겹침) | `목을 움직이면 아프세요?` |
| K6 | 14.1 | `눈을 감지 말고 저를 봐 주세요` ("정신 차리세요"와 겹침) | `제 손을 꽉 쥐어 보세요` |
| K7 | 16.0 | `의사 선생님이 기도 확보를 하러 오세요` ("기도 확보"가 겹침) | `흡인기를 켜 두세요` |
| K8 | 17.0 | `물체 주위를 거즈로 감싸고 있어요` (거즈로 감싸는 것이 곧 고정) | `진통제를 곧 드릴게요` |
| K9 | 18.4 | `심방세동 때문에 심박 조절약도 복용합니다` ("심방세동 … 복용"이 겹침) | `알려진 약물 알레르기는 없습니다` |
| K10 | 1.2 | `이건 지금 바로 끝낼게요` (같은 상황에서 할 말이 아님) | `잠깐 혈압을 잴게요` |
| K11 | 1.5 | `질문은 이게 마지막이에요` (정답 "곧 다시"를 뒤집은 말) | `이제 양팔을 들어 보세요` |
| K12 | 7.5 | `CT 결과는 가족분께 먼저 알려 드릴게요` (간호사가 하지 않을 약속) | `CT실로 갈 때 같이 가셔도 돼요` |
| K13 | 16.4 | `혈압 관리는 기도 확보 뒤에 해요` (두부외상에서 저혈압은 기도와 함께 막아야 해 틀린 말) | `흡인 준비를 해 주세요` |

### context 장면 정비 (12건 모두 — `who`·`icon`·`ok`·`tone`은 그대로)

W14 6건은 어색한 장면(ok=false)이 이미 "그 말을 듣는 사람에게 맞지 않게" 쓴 모양이라, **ok=true 장면 중 `word`를 풀어 쓴 한 곳만** 고친다.

| # | 상황 · word | 고칠 장면 | 지금 `en` | 바꿀 `en` (그 밖은 그대로) |
|---|---|---|---|---|
| C1 | S0 `LOC` | [1] 의사에게 보고 | `He says he lost consciousness for a few seconds after the fall.` | `He had a brief LOC after the fall—just a few seconds.` |
| C2 | S2 `PERRL` | [1] 동료 간호사에게 | `Pupils are equal, round, and reactive, 3 millimeters.` | `Pupils are PERRL, 3 millimeters on both sides.` |
| C3 | S4 `emesis` | [1] 의사에게 보고 | `He's vomited twice in the last hour.` | `He's had two episodes of emesis in the last hour.` |
| C4 | S7 `subdural` | [0] 차트 기록 | `Increased confusion since fall 1 wk ago; r/o SDH.` | `Increased confusion since fall 1 wk ago; r/o subdural.` · `ko` `경막하` → `경막하 혈종` |
| C5 | S10 `ecchymosis` | [1] 의사에게 보고 | `She has raccoon eyes—bruising around both eyes.` | `She has periorbital ecchymosis on both sides—raccoon eyes.` |
| C6 | S12 `somnolent` | [1] 의사에게 보고 | `He's much harder to arouse than he was an hour ago.` | `He's more somnolent and much harder to arouse than an hour ago.` |
| C7 | S6 `anticoagulated` | [0] 차트 기록 (줄기만 같음 — 글자 그대로 맞추기 권함) | `Pt on anticoagulation (apixaban).` | `Pt anticoagulated on apixaban.` |
| C8 | S16 `intubating` | [0] 차트 기록 (줄기만 같음 — 권함) | `Intubated for airway protection, GCS 6.` | `Intubating for airway protection, GCS 6.` (차트는 과거형이 자연스러우니, 대신 `word: intubated`·`ko: 삽관된`으로 바꾸고 [1]·[2]를 `We've intubated …`로 맞춰도 된다) |
| C9 | S19 `benzo` | [0] 차트 기록 (`benzodiazepine` 안에 글자로만 있음) | `Generalized seizure; IV benzodiazepine given.` | 그대로 둔다 — 차트에 줄임말 `benzo`를 쓰지 않는 것이 맞다. 화면 제목과 맞추려면 `word: benzo`는 유지하고 `why`에 "차트에는 benzodiazepine(또는 약 이름)으로 적어요"를 더한다 |
| C10 | S15 `nonreactive` | [2] 보호자에게 + `why` | `His right pupil is blown and nonreactive.` | `His right pupil is fixed, dilated, and nonreactive.` (`fix` 그대로). `why` → "nonreactive·fixed and dilated는 차트와 의료진끼리의 정확한 말이에요. 가족에게는 동공이 커지고 빛에 반응하지 않는다고 풀어서, 응급 상황이며 조치 중이라는 것을 함께 말해요." — 지금 why는 `blown`을 설명해 화면 제목 "nonreactive가 어색한 장면은?"과 어긋난다 |
| C11 | S14 `STAT` | 없음 | — | 그대로(세 장면 모두 `STAT`, 어색한 장면은 환자에게 쓴 곳) |
| C12 | S18 `GCS` | 없음 | — | 그대로(세 장면 모두 `GCS`, 어색한 장면은 보호자에게 숫자로 말한 곳) |

swap `ko` 10건(S1·S3·S5·S8·S9·S10·S11·S13·S17 + S10 두 번째)은 모두 정답을 넣은 문장의 뜻이다 — 고칠 것 없음.

### tag·icon (선택, 2)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| I1 | 8.1 · 8.4 | 소아 상황인데 `bell` | `baby` (하나만 바꿔도 됨) |
| I2 | 16.3 · 19.5 | `gear`가 삽관 준비·동시 관리와 안 어울림 | 16.3 `siren` 또는 `lab`, 19.5 `shield` |

## 결정 11 (기존 v44 문장)

| # | 어디 | 문제 | 고칠 방법 |
|---|---|---|---|
| X1 | 18.3 `Left pupil remains reactive and equal.` / `좌측 동공은 반응이 있고 양쪽이 동일합니다.` | 같은 상황 18.1에서 우측이 산대됐는데 "equal(양쪽 같음)" — 임상적으로 모순. keyPhrase 아님 | `en: Left pupil remains brisk and reactive.` · `ko: 좌측 동공은 여전히 반응이 빠르고 정상입니다.` · `chunks: ["Left pupil", "remains brisk", "and reactive", "."]` · 빈칸 `answer: reactive`는 그대로, 선택지 `dilated / sluggish / fixed`도 그대로 쓸 수 있다(`ko` "반응이 빠르고"가 거름). decoy `became fixed` 그대로. why의 "remains로 … 비교의 기준" 그대로. `changes-er-head-trauma.yaml`에 적는다 |

(보고만, 고치지 않음: 1.1·7.3은 `words: []`(V3는 통과), 2.0 `in your eyes—look`·9.1 `or your injury—so`·12.2 `rising pressure—we're`·14.0 `much worse—we're`·
16.0 `GCS is 6—we`·16.4 `priority—GCS`는 대시를 넘는 청크(2.0·12.2·14.0·16.0은 keyPhrase). S14·S15의 팀에게 하는 문장이 상황 역할 `patient` 아래에 있다.)

## 고칠 것 개수

order 9 · why 6 · 빈칸 26 · decoy 1 · distractorsKo 13 · context 장면 정비 8(필수 6 + 권장 2, S19 why 보강 1 포함 시 9) · tag·icon 2(선택) · 결정 11 1
= **약 66건**(선택 제외).

## 종합

사실 오류는 order 세 장(S19 시간 묶기·2분 투약, S17 도착까지만 금지, S15 늦은 호출)과 why 하나(2.5 동공이 빠른 신호), 결정 11 문장 하나(18.3 equal)다.
이것들과 context 6건(W14)·빈칸 돌려쓰기를 고치면 내보내도 된다. 저작자 자기 보고 (1)은 why만 한정하면 되고, (2)·(3)은 맞다.
