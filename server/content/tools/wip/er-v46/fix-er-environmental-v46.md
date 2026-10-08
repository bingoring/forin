# er-environmental — v46 보강 검토 (er)

대상: `er-environmental.yaml`(상황 21 · 문장 126 · order 21장 · 뉘앙스 context 10 · swap 10). 문장 126개와 order 21장을 **전부** 봤다.
번호는 **1부터** 센다. 상황은 파일 순서대로 S1(노출 환경·시간 문진) … S21(환경 위기 이송 인계), 문장은 `상황.문장`(예: 7.5), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before + 선택지 + after` 504줄
- decoy를 청크 자리마다 **대신 넣은** 조립 약 470줄과 청크 사이에 **끼워 넣은** 조립 약 480줄
- order 인접 교환 63가지(21장 × 3)와 줄 단어 수
- context `word`가 세 장면 `en`에 있는지(W14와 같은 어간 비교), base 장면과의 차이
- swap 10건(선택지마다 `before[0]+선택지+before[2]`)
- decoy·빈칸 오답·distractorsKo가 주제 안에서 몇 번 되풀이되는지
- base와 v44 필드 비교: **단어·문장은 바뀐 것 없음.** 뉘앙스도 context 8문항의 장면 `en`·`fix`·`why` 말고는 그대로다.

`verify_one_theme.py er …/er-environmental.yaml` → `==> 통과`(W13 경고 1건 `cloths`는 v44 단어 쪽이라 이번 범위 밖).

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 '정답이 둘'은 **`ko`에도 맞는가**로 판정했다. 같은 분야의 다른 맞는 말이라도 `ko`로 걸러지면 정답이 둘이 아니다. context는 `review-ctx-A/B/C.md`와 같은 기준이다.
- 같은 `word`가 세 장면에 같은 뜻으로 나와야 한다.
- 어색함은 듣는 사람 때문이어야 한다. 장면 안 다른 낱말에서 오는 어색함은 받아들인다.
- base가 이미 세 장면에 공유한 말은 그대로 둔다(TASK 9번). 공유하지 않았을 때 고친 것은, 영어가 자연스럽고 차트·의료진 말투가 살아 있으면 받아들인다.
- W14를 맞추려고 낱말을 억지로 끼워 넣어 영어가 틀리거나 장면의 말투가 무너진 것은 받아들이지 않는다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식의 이유(Try not to·Let's·can help·I'm going to·warm and dead)를 짚는다. 임상 사실도 맞다: 운동성 열사병은 심부(직장) 체온·얼음물 침수, 동상은 따뜻한 물 재가온과 문지르지 않기, 저체온 심장은 거친 조작에 VF, 횡문근융해 수액·CK, 일광화상이 수분을 피부로 끌어간다. 고칠 것은 3건이다. 14.4·14.1은 통역사에게 3인칭으로 부탁하는 것을 권하는데, 미국 병원 원칙(환자·보호자에게 직접 말함)과 어긋난다. 16.2는 `ko`를 되풀이한다. |
| 2 | 빈칸 | 2 | `ko`로 걸러지지 않는 '정답 둘'은 7.6 `squeeze`(주무르다와 겹침) 하나다. 그러나 문제가 많다. **위험한 오해를 오답으로 보인 것이 7문장**이다(2.3 위험 징후가 `normal/common`, 7.1 떨림 소실이 `fine/minor` — 그 문장 `why`가 경고하는 바로 그 오해, 저체온·익수 감시를 `rarely/briefly/loosely`로 4문장, 17.2 재가온을 `rarely`로). **장면과 동떨어진 우스운 오답이 20문장**이다(`cholesterol/voice`, `owner/smell/price`, `tooth/hair`, `chair/form/desk`, `texting`, `paperwork/homework/framework`, `year/season/week`…). **돌려쓴 묶음**도 있다: `rarely` 9문장, `briefly/loosely` 4~5문장, `weight/hearing` 4문장, `minor/mild/slight` 3문장, `barely/hardly` 6문장, 시간 단위 2문장. **기능어 자리**(`since`·`because`·`When`·`Where`) 5문장은 아무것도 가르치지 않는다. 비판단 상황 S11에 낙인 오답 2개(`bathe`·`dirty`)가 있다. |
| 3 | `decoy` | 2 | 서로 다른 decoy가 109개라 돌려쓰기는 적다. 그러나 대부분 시간·장소 부사구라 청크 자리와 대비가 없다. 문제는 둘이다. **조립하면 위험한 지연·감시 간격이 되는 decoy가 10개**다(15.3 `in an hour` 냉각 지연, 18.2·18.5 구획증후군 외과 평가를 `this evening`·`next week`, 17.6 ECMO 준비를 `this evening`, 20.6 `after lunch`, 16.6 `this afternoon`, 7.5·15.6 `once a day`, 20.2 `every hour`, 19.3 CK `every week`). **끼워 넣으면 `ko`에 맞는 문장이 되는 것이 6개**다(2.3 5.2 14.3 16.3 21.1 21.5). 경계선이 약 13개다. |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이다. 정답 뒤집기와 위험한 처치는 없다. 고칠 것은 5건이다. 정답과 겹치는 것 2(20.1, 20.5), 듣는 사람이 맞지 않는 말 1(7.5 가족에게 "가족분께 설명해 드릴게요"), 추세가 정답과 거의 같은 말 1(21.2), 존대 누락 2(3.1, 15.4). '체온을 (다시) 재 볼게요/잴게요'가 10번 돈다(권장). |
| 5 | `order` | 2 | 조건절 줄은 S5 L4 하나이고 맞는 조건이다. 그러나 문제가 여럿이다. **억지 연결어가 12장**이다(`With whatever helped in mind`, `Alongside all that`, `With those packs on`, `To help with that`, `Together with what you tell me`, `With that intake in mind`, `On top of aloe or a compress`, `For that`, `So it's…`, `With both answers`…). **논리가 거꾸로인 줄이 3장**이다(S17 L2 격언에서 진단이 나옴, S16 L3 고열에서 횡문근을 걱정함 — 단서는 어두운 소변, S7 L3 문지르지 않기가 재가온을 도움). **임상·대화가 틀린 카드가 4장**이다(S14 L4 흉통·혼돈 확인을 앞 답에 매어 둠 — TASK 10번, S14 통역사에게 3인칭, S12 "우리가 꺼냈다" 뒤에 얼마나 있었는지 물음, S19 L4 결과와 상관없이 수액). **인접 교환이 열린 카드가 4장**이다(S1 2↔3, S10 1↔2, S20 2↔3, S21 1↔2). **15단어를 넘는 줄이 4줄**이다(S4 L4 17, S6 L3 18, S11 L4 16, S16 L4 16). S13·S18은 좋다. |
| 6 | `tag`·`icon` | 4 | 태그는 모두 한국어, 10자 이하이고 상황 안에서 일관된다. 아이콘은 대체로 맞다. 10.6 `chartup`이 **내려가는** 체온에 붙은 것은 방향이 틀렸다. 정맥 수액에 `pill`(5.2 10.5 13.2 19.2), 그늘에 `home`(1.3), 음주 문진에 `lab`(11.5), 알로에에 `pill`(4.6)은 경미하다. order 21장은 모두 `대화 흐름`·`compass`. |
| 7 | context `word`·`ko`, swap `ko` | 3 | `word`는 10/10 모두 세 장면에 있다(W14 0). 정비 8건 중 2건은 받아들이지 않는다: S12 `duration under`는 틀린 영어이고, S14 차트 `Rapid climb`·`rate of climb`는 차트·임상 말투를 무너뜨렸다. S4는 `blistering, bullae`가 겹친다(고칠 것). 나머지 5건과 그대로 둔 2건은 받아들인다. swap `ko` 10건은 모두 정답을 넣은 문장의 뜻이고, swap 문법도 10건 모두 맞다. |
| 8 | 파일럿 갈래 | 2 | (1) 선택지 아이콘: 없음(T8) 확인. (2) 동떨어진 빈칸 오답 20문장. 관사는 잘 지켰다. 문법으로 걸러지는 오답은 4문장이다(9.5 `hardly`, 17.4 `barely`, 1.4 `why you were`, 5.1 `wait with drinking`). (3) order 못 박기: `And/Also/Then`은 없다. 대신 억지 연결어 12장, 열린 교환 4장이다. (4) 임상 순서: S14 L4, S12 L1↔L2, S17 L2, S10(냉각을 먼저 해야 함). (5) 오답 뜻·decoy 겹침: 위 3·4. 이어진 검토에서 더한 갈래(위험한 처치를 오답으로)가 **빈칸 7 + decoy 10**으로 되풀이됐다. |

## 사실 오류·심각한 문제

1. **위험한 오해를 빈칸 오답으로 보인 것(브리프 "이어진 검토" 갈래).** 학습자는 오답도 문장으로 읽는다.
   - 2.3 `confused or stop sweating — that's more normal/common/helpful` — 열사병으로 넘어가는 경고 징후를 정상·도움이 되는 것으로 보인다.
   - 7.1 `When shivering stops … this is fine/minor/normal` — 그 문장의 `why`("좋아진 신호가 아니라 더 위험한 신호")가 경고하는 바로 그 오해다. 보호자 장면이라 더 나쁘다.
   - 7.5·12.1·15.6·20.2 `checking his heart rhythm rarely/briefly/loosely`, `watching his breathing rarely` — 재가온 중 VF 위험 환자, 지연성 폐 악화가 있는 익수 환자의 감시를 드물게 한다는 말.
   - 17.2 `while we rarely/briefly rewarm the core` — 저체온 심정지에서 재가온을 드물게·잠깐 한다는 말.
2. **조립하면 위험한 지연·감시 간격이 되는 decoy 10개(genitourinary D7, diabetic `tomorrow morning`과 같은 갈래).**
   - 15.3 `We'll cool you down in an hour while we figure out…` — 그 문장의 `why`("원인을 찾느라 처치를 미루지 않는다")와 정면으로 어긋난다.
   - 18.5 `We need surgery to look at the pressure next week`, 18.2 `calling surgery this evening` — 구획증후군은 시간 응급이다.
   - 17.6 `prepping the room for ECMO this evening` — 저체온 심정지에서.
   - 20.6 `page cardiology after lunch`, 16.6 `we'll need a bed this afternoon`.
   - 7.5 `checking his heart rhythm once a day`, 15.6 `checking your temperature … once a day`, 20.2 `watch this rhythm closely every hour`, 19.3 `check a muscle enzyme called CK every week`.
3. **S14 order L4 `Based on both answers, ask if he's still having chest pain or feeling confused` — TASK 10번 위반.** 고산 환자의 흉통·숨참·혼돈(HAPE·HACE 경고 징후)은 앞 답과 상관없이 바로 묻는다. 게다가 카드 전체가 통역사에게 `ask him`으로 3인칭 부탁을 한다. 미국 병원의 의료통역 원칙(NCIHC 등)은 통역사가 아니라 **환자·보호자를 보고 1인칭으로 직접** 말하는 것이다. 14.4 `why`("Please ask him으로 통역사에게 부탁해요 … 바꾸지 않고 옮기게 해요")와 14.1 `why`도 이 관행을 권하는 말이라 고친다. 문장 14.1·14.4 자체는 v44라 고치지 않고 보고만 한다(결정 11).
4. **S17 order L2 `So it's a deep hypothermic arrest` — 논리가 거꾸로다.** "따뜻해질 때까지는 죽은 게 아니다"라는 격언에서 진단이 나오지 않는다. 진단이 전제이고 격언은 결론이다. `ko`("그러니 심부저체온 심정지예요")도 같이 틀렸다.
5. **S16 order L3 `With temp that high, I'm worried about rhabdo — urine is dark`** — 걱정의 단서는 어두운 소변인데, 고열을 근거로 세웠다. 같은 주제 16.5의 `why`("dark urine은 … rhabdo를 의심하는 이유")와 순서가 거꾸로다.
6. **S12 order L1 `We pulled him out of the ice water a few minutes ago` → L2 `How long was he in it?`** — 꺼낸 쪽이 우리라면서 보호자에게 얼마나 물속에 있었는지 묻는다. 대화가 서로 어긋난다. L1은 base 12.5에서 가져온 말이다(12.5 자체는 보고만 한다).
7. **S10 order — 냉각보다 체온 측정이 먼저다.** 운동성 열사병은 "먼저 식히고 나중에 옮긴다(cool first)"가 원칙이다. 직장 체온은 침수와 **동시에** 잰다. 지금 카드는 1↔2를 바꿔도 읽히고, 정답 순서는 측정을 냉각보다 앞에 둔다.

## 저작자 자기 보고 4건 판정

### 1. 같은 분야의 틀린 말이 곧 다른 맞는 말이 되는 빈칸, 기능어 자리

**받아들이지 않음 — 빈칸을 가르치는 말로 옮긴다.** 낱장 머리에 `ko`가 보이므로, 같은 분야의 다른 맞는 말은 `ko`로 걸러져 정답이 둘이 되지 않는다. 그래서 "문법만 맞는 말"로 피할 이유가 없다. 기능어 자리는 그 문장이 가르치는 낱말(`words`)이 아니라서, 맞혀도 남는 것이 없다.

| 문장 | 지금 | 판정 · 고칠 안 |
|---|---|---|
| 12.6 "폐 소리와 산소 수치" | `oxygen` / `noise/light/volume levels` | 받아들이지 않음. `listen`에 말장난을 맞춘 동떨어진 오답이다. → `oxygen / sugar / sodium / iron`(모두 실제로 재는 "levels", `ko` "산소"로 걸러짐) |
| 1.3 · 1.5 "그늘/물" | `ice/food/sun`, `food/ice/medicine` | **받아들임.** 지금도 같은 분야 오답이고 `ko` "그늘"·"물"로 걸러진다. 고칠 것 없음 |
| 4.1 "통증" | `cough/nausea/cold` | 부분. `nausea`는 좋다. `cough/cold`는 장면 밖이다 → `pain / itching / nausea / swelling` |
| 4.3 "열" | `stomachache/cough/cold` | 부분 → `fever / headache / rash / tan`(관사 `a`와 모두 맞음. 일광화상의 실제 증상·흔적이고 `ko` "열"로 걸러짐) |
| 4.2 `since` | `although/unless/until` | 기능어 → 빈칸을 `sunburn`으로. `sunburn / frostbite / a bruise / a rash` |
| 13.4 `because` | `although/unless/whereas` | 기능어 → 빈칸을 `cramping`으로. `cramping / swelling / shaking / bruising` |
| 1.2 `When` | `How/Where/Why` | 기능어. `Where did you start feeling dizzy`는 노출 문진에서 맞는 질문이기도 하다(`ko`로만 걸러짐) → 빈칸을 `dizzy`로. `dizzy / itchy / sore / thirsty` |
| 14.2 `When` | `Where/How/Why` | 기능어 → 빈칸을 `headache`로. `headache / cough / rash / nosebleed`(`cough`는 HAPE 증상이지만 `ko` "두통"으로 걸러짐) |
| 6.3 `where` | `why/when/how` | 기능어. `Can you tell me your name and how you are right now?`는 문법도 맞고 실제로 할 법한 질문이다. `ko`("여기가 어딘지")로만 걸러지고, 이 문장은 `words: []`라 가르칠 낱말도 없다 → 빈칸을 `name`으로. `name / age / weight / job` |

### 2. S16·S17 order가 `For that`, `Because of all of that`, `Through all of that`에 기댄 것

- `Because of all of that`·`Through all of that`은 브리프가 권한 `with all of that` 계열이라 **그 자체는 괜찮다.** 인접 교환을 해 보면 두 카드 모두 앞 줄을 가리키는 말 때문에 순서가 하나로 묶인다(S16 3↔4만 약하게 열림).
- 문제는 연결어가 아니라 **논리가 거꾸로인 줄**이다.
  - S16 L2 `For that, we're cooling aggressively` — `that`이 L1의 "검사·혈액제제 준비 요청"을 가리켜 말이 되지 않는다. L3 `With temp that high, I'm worried about rhabdo`는 단서(어두운 소변)를 뒤로 보냈다(심각 5). L4는 16단어이고, L1과 요청이 둘로 나뉘었다.
  - S17 L2 `So it's a deep hypothermic arrest`는 격언에서 진단을 끌어낸다(심각 4). L3 `For that`은 ECMO 활성화 → 방 준비라 받아들일 만하다.
- 고칠 안은 O15·O16. 카드 `why`도 새 줄에 맞게 다시 쓴다.

### 3. context 정비 8건과 그대로 둔 2건

| 상황 | word | 판정 | 근거 |
|---|---|---|---|
| S2 | `diaphoresis` | **받아들임(권장 다듬기)** | base 차트 `Pt diaphoretic`는 W14 어간 비교(`diaphoresi`)에 걸린다. 어형을 맞춘 것이라 ctx-C `notify → notified`와 같은 판정이다. 동료 장면 `Some diaphoresis and lightheadedness, but he's alert`는 말로 하기엔 딱딱하다. 원하면 `word: diaphoretic`, `ko: 땀을 많이 흘리는`으로 하고 차트를 base로 되돌린다. 그 경우 동료 장면은 `He's diaphoretic and lightheaded, but alert — looks like heat exhaustion.`, XX는 `You're diaphoretic from heat exhaustion.`로 한다(C4, 선택). |
| S4 | `blister` | **고쳐서 받아들임** | 어색함은 `bullae`·`pyrexia`·`rupturing`에서 온다. '다른 낱말에서 오는 어색함'이라 받아들인다. 그러나 새 XX `Monitor for blistering, bullae or pyrexia`는 같은 것(물집·큰 물집)을 둘 늘어놓아 영어가 겹친다(C3). fix가 장면 0과 글자 하나 다르지 않은 것은 base부터 그랬다(경미). |
| S9 | `confused` | **받아들임** | XX `acutely confused secondary to hypovolemia`는 자연스러운 의료진 말이고, 어색함은 `secondary to`·`hypovolemia`에서 온다. why도 맞게 고쳤다. |
| S12 | `under` | **받아들이지 않음** | `What was his total duration under, from submersion to rescue?`의 `duration under`는 틀린 영어다. TASK 9번이 금지한 "영어가 틀린 장면" 갈래다(C1). |
| S13 | `sweat` | **받아들임(경계)** | XX 끝에 `from sweating`을 끼워 넣었지만 영어는 자연스럽다. 어색함은 `exertional electrolyte depletion`에 그대로 남는다. |
| S14 | `climb` | **받아들이지 않음** | 차트 `Rapid climb to high altitude`는 차트 말이 아니고(차트는 `ascent`), XX `rate of climb`는 항공 용어다. 어색한 장면의 임상 말투(`rate of ascent`)를 지우고 쉬운 말을 넣어 대비가 흐려졌다. genitourinary S14 `Fetal heartbeat`와 같은 판정이다(C2). |
| S19 | `urine` | **받아들임(경계)** | `Your urine shows myoglobinuria from rhabdomyolysis.`는 자연스러운 영어이고, 어색함은 진단명 두 개에서 온다. base가 공유한 의료진 말이 없어 쉬운 말 `word`를 받아들인다. |
| S20 | `rhythm` | **받아들임** | `heart → rhythm`만 바꿨고, 어색함(`Um, … something weird`)은 막연한 콜 말투에서 그대로 온다. |
| S7 | `shivering`(그대로) | **받아들임** | base가 이미 세 장면에 공유한다(TASK 9번). 어색함은 `cessation … indicates progression`에서 온다. |
| S17 | `warm`(그대로) | **받아들임** | 핸드오프 `deteriorate`와 같은 모양이다. 같은 격언을 동료에게는 맞게, 보호자에게는 거칠게 쓴다. |

### 4. 유지한 `If` 줄과 `Whatever` 줄

- **S5 L4 `If those sips aren't enough, we'll give you fluids through an IV.` — 받아들임.** 정맥 수액은 모든 탈수 환자에게 하는 것이 아니라 경구가 부족할 때 하는 것이다. TASK 10번은 모든 환자에게 하는 행동에만 조건을 빼라고 한다. 다만 바로 앞 L3 `Based on that exam`은 아직 모르는 진찰 결과를 전제한다. genitourinary S8 `Based on that scan`과 같은 판정이라 고친다(O5).
- `Whatever` 줄은 셋은 받아들이고 셋은 고친다.
  - **S11 L4 받아들임.** `Whatever you tell me, it's okay`는 비판단 응대의 핵심이라 뜻이 있다. 다만 16단어라 줄인다(O11).
  - **S18 L4 받아들임.** `Whatever you feel, we're … calling surgery`는 임상적으로 맞다. 감각 저하는 늦은 징후라, 조임과 심한 통증만으로도 외과 평가를 부른다.
  - **S3 L4 억지.** `Whatever you tell me, we'll keep checking`은 바로 앞에서 물은 상태(3.4 `why`: 말투·의식도 살핌)를 쓸모없는 것으로 만든다.
  - **S12 L3 억지.** `Whatever the answer`는 방금 물은 잠수 여부·시간이 상관없다는 말이 된다. 실제로는 흡인·예후 판단에 쓰인다.
  - **S19 L4 억지·임상 어긋남.** `Whatever it shows, we're giving lots of fluids`는 감시의 뜻을 지운다. 수액은 소변량·CK에 맞춰 조절한다.
  - **S1 L4 `With whatever helped in mind`도 억지다.**

---

## 고칠 것

### 빈칸 — 위험한 오해 (B1~B7, 반드시)
- B1 · 2.3 `common/normal/helpful` — 경고 징후를 정상으로 보인다. → 빈칸을 `confused`로 옮긴다. 선택지 `confused / hungry / thirsty / bored`.
- B2 · 7.1 `minor/fine/normal` — `why`가 경고하는 오해 그대로다. → 빈칸을 `shivering`으로 옮긴다. 선택지 `shivering / sweating / coughing / talking`(`ko` "떨림"으로 걸러짐).
- B3 · 7.5 `rarely/briefly/loosely` — 재가온 중 리듬 감시를 드물게. → 빈칸을 `rhythm`으로 옮긴다. 선택지 `rhythm / valves / size / muscle`.
- B4 · 12.1 `rarely/briefly/loosely` — 익수 환자 호흡 감시. → 빈칸을 `lungs`로 옮긴다. 선택지 `lungs / kidneys / liver / skin`.
- B5 · 15.6 `rarely/briefly/loosely`. → 빈칸을 `drug`로 옮긴다. 선택지 `drug / infection / food / stress`(`infection`은 실제 감별 대상이지만 `ko` "약"으로 걸러짐).
- B6 · 20.2 `rarely/briefly/loosely` — 예민한 차가운 심장의 리듬 감시. → 빈칸을 `rhythm`으로 옮긴다. 선택지 `rhythm / temp / IV / chart`.
- B7 · 17.2 `quietly/rarely/briefly` — 심정지 재가온을 드물게. → `actively / passively / externally / partially`(같은 분야에서 틀린 말. `passively`는 7.2처럼 좋은 대비다).

### 빈칸 — 자기 보고 1: 가르치는 말로 옮기기 (B8~B15)
- B8 · 1.2 `When` → `dizzy`: `dizzy / itchy / sore / thirsty`.
- B9 · 14.2 `When` → `headache`: `headache / cough / rash / nosebleed`.
- B10 · 6.3 `where` → `name`: `name / age / weight / job`.
- B11 · 4.2 `since` → `sunburn`: `sunburn / frostbite / a bruise / a rash`.
- B12 · 13.4 `because` → `cramping`: `cramping / swelling / shaking / bruising`.
- B13 · 12.6 `noise/light/volume` → `oxygen / sugar / sodium / iron`.
- B14 · 4.1 `cough/cold` → `pain / itching / nausea / swelling`.
- B15 · 4.3 `stomachache/cough/cold` → `fever / headache / rash / tan`.

### 빈칸 — 돌려쓴 묶음·문법으로 걸러지는 것 (B16~B22)
- B16 · 13.1 `rarely/never/hardly`(`hardly come from`은 문법으로도 걸러짐). → 빈칸을 `salt`로 옮긴다. 선택지 `salt / sugar / iron / weight`.
- B17 · 9.5 `slowly/rarely/hardly`(`get confused hardly`는 문법으로 걸러짐). → 빈칸을 `dehydrated`로 옮긴다. 선택지 `dehydrated / hungry / tired / sunburned`.
- B18 · 17.4 `soon/rarely/barely`(`barely shows no pulse`는 말이 안 됨). → `still / now / again / finally`. 빈칸을 `continue`로 옮기면 `stop/pause CPR`이 오답이 되어 위험하니 옮기지 않는다.
- B19 · 16.1 `slightly/mildly/barely` — `minor/mild/slight` 묶음(18.1 21.5)과 같다. → 빈칸을 `clotting`으로 옮긴다. 선택지 `clotting / breathing / feeding / sleep`.
- B20 · 21.5 `minor/mild/small` — 같은 묶음. → `critical / routine / stable / resolved`. 18.1은 `severe ↔ mild`가 "통증이 비례하지 않게 심함"을 가르치니 그대로 둔다.
- B21 · 13.6 `year/week/month` — 시간 단위 묶음이고, 1년마다 쉬라는 말은 읽기만 해도 걸러진다. → 빈칸을 `heat`로 옮긴다. 선택지 `heat / cold / rain / dark`.
- B22 · 20.4 `year/season/week` — 같은 묶음. → 빈칸을 `position`으로 옮긴다. 선택지 `position / IV / monitor / blanket`.

### 빈칸 — 장면과 동떨어진 오답 (B23~B42)
- B23 · 1.6 `hearing/height` → `temperature / oxygen / weight / blood sugar`.
- B24 · 3.6 `weight/hearing/vision` → `temperature / blood pressure / oxygen / blood sugar`.
- B25 · 6.5 `cholesterol/voice` → `temperature / heart rate / pain / weight`. `blood pressure`는 열사병에서 "빨리 낮춘다"가 위험한 말이 되니 쓰지 않는다.
- B26 · 9.2 `hearing` → `electrolytes / weight / allergies / medications`.
- B27 · 9.6 `hair/ear/hand`(관용구 말장난). → 빈칸을 `close`로 옮긴다. 선택지 `close / loose / quick / light`.
- B28 · 10.1 `brush/scale/mask` → `probe / patch / strip / cuff`(이마 패치·띠 체온계는 부정확한 측정이라 같은 분야에서 틀린 말).
- B29 · 10.5 `hiccups/coughing/itching` → `cramping / nausea / headache / dizziness`.
- B30 · 15.3 `price/color/number` → `cause / dose / time / drug`.
- B31 · 15.5 `owner/smell/price` → `name / dose / color / shape`.
- B32 · 16.2 `tooth/hair` → `muscle / skin / bone / fat`(`skin breakdown`은 실제 간호 용어이고 `ko`로 걸러짐).
- B33 · 16.6 `chair/form/desk` → `bed / consult / form / transfer`.
- B34 · 17.1 `texting` → `resuscitating / charting / talking / waiting`.
- B35 · 17.5 `shift/meeting/lunch` → `resuscitation / transfer / scan / handoff`.
- B36 · 18.2 `dress/thank/weigh` → `assess / admit / discharge / sedate`.
- B37 · 18.3 `coughing/sneezing` → `numbness / itching / bruising / warmth`.
- B38 · 19.6 `paperwork/homework/framework`(`-work` 말장난) → `bloodwork / X-ray / EKG / ultrasound`.
- B39 · 11.4 `loud/late/busy` → `safe / quiet / awake / dressed`.
- B40 · 3.1 `itching/coughing`(`itching/coughing`은 주제 안 각 4번) → `shivering / sweating / sneezing / yawning`.
- B41 · 8.5 `hunger/thirst/nausea` → `tingling / numbness / itching / stiffness`(`numbness`는 녹기 전 상태라 좋은 대비).
- B42 · 9.3 `snoring/blinking/coughing` → `urinating / sweating / eating / sleeping`.
- (경미, 선택) 1.4 `who/why`(문법으로 걸러짐) → `where / when / how / who`. 6.6 `Walk with me`(소생실 열사병 환자) → `Wait`. 10.2 `injection` → `spray`. 14.3 `food/juice/ice` → `fluids / painkillers / food`. 17.3 `thank/meet`, 20.3 `name/cure/hear`, 20.5 `explain/repeat`, 2.4 `coffee/soda`도 같은 분야 말로 바꾸면 낫다.

### 빈칸 — 낙인·정답 둘 (B43~B45)
- B43 · 11.3 `bathe` — 비판단 응대 상황(노숙 환자)에서 "마지막으로 언제 씻었냐"는 낙인 오답이다. → `rest`.
- B44 · 11.6 `dirty` — `those cold, dirty clothes`는 같은 상황에서 낙인이다. 3.2와 같은 묶음이기도 하다. → `heavy`.
- B45 · 7.6 `squeeze` — `ko` "주무르지"와 겹쳐 정답이 둘에 가깝다. → `wash`.

### decoy — 위험한 지연·감시 간격 (D1~D10, 반드시)
- D1 · 15.3 `in an hour` → `the exact dose`.
- D2 · 18.2 `this evening` → `calling dermatology`.
- D3 · 18.5 `next week` → `in your hand`.
- D4 · 17.6 `this evening` → `the ICU bed`.
- D5 · 20.6 `after lunch` → `page radiology`.
- D6 · 16.6 `this afternoon` → `a stretcher`.
- D7 · 7.5 `once a day` → `his breathing`.
- D8 · 15.6 `once a day` → `your blood sugar`.
- D9 · 20.2 `every hour` → `his blood pressure`.
- D10 · 19.3 `every week` → `a liver enzyme`.

### decoy — 끼워 넣으면 `ko`에 맞는 것 (D11~D16)
- D11 · 2.3 `right away` — `Tell me right away if you get confused…`가 `ko`에 그대로 맞는다. → `or get thirsty`.
- D12 · 5.2 `by mouth` — `If you can't drink enough by mouth, we'll give you fluids through an IV.`는 더 정확한 문장이고 `ko`에도 맞는다. → `with a meal`.
- D13 · 14.3 `by phone` — 전화 통역은 미국 병원에서 흔하다. `through the interpreter by phone`이 `ko`에 맞는다. → `through the family`(가족을 통역으로 쓰는 것은 피하는 관행이라 좋은 대비).
- D14 · 21.1 `by a coworker` — `Found down by a coworker in a hot warehouse`가 `ko` "쓰러진 채 발견됐고"에 맞는다. → `in a cold car`.
- D15 · 21.5 `to the ward` — `handing off a critical heat emergency to the ward`가 `ko`에 맞고, 위중한 열사병을 병동으로 보내는 틀린 말이기도 하다. → `a stable patient`.
- D16 · 16.3 `right now` — `blood products ready right now`가 `ko` "준비해 주세요"에 맞는다. → `a discharge form`.
- (경계, 선택) 끼워 넣으면 `ko`에 거의 맞거나 정보만 더해진다: 2.2 `with ice`, 3.3 `in the snow`(대신 넣어도), 4.2 `every day`, 7.3 `the whole time`, 8.2 `for now`(나중엔 문질러도 된다는 뜻까지), 12.1 `for a day`, 13.2 `in a drink`, 16.5 `this morning`, 17.2 `for two minutes`, 17.4 `after two shocks`, 19.5 `all night`, 1.5 `in your car`, 10.2 `in a minute`(냉각을 1분 미룸).

### distractorsKo (K1~K5)
- K1 · 20.1 `불필요한 움직임은 피하세요.` — 정답 "최대한 부드럽게 다루세요"와 반만 다르다. → `심장 리듬이 바뀌었어요.`
- K2 · 20.5 `움직임을 피하세요.` — 정답 "최대한 적게 만지도록 할게요"와 겹친다. → `체온을 다시 재 주세요.`
- K3 · 7.5 `가족분께 설명해 드릴게요.` — 이 상황은 가족에게 하는 말이다. → `손발이 아직 차가워요.`
- K4 · 21.2 `이송 중 체온이 계속 올랐어요.` — 정답 "아직 별로 안 내려갔습니다"와 추세가 거의 같다. → `쓰러진 채 발견됐어요.`
- K5 · 3.1 `언제부터 젖어 있었어요?` → `언제부터 젖어 계셨어요?`, 15.4 `언제부터 뻣뻣했어요?` → `언제부터 뻣뻣하셨어요?`(환자에게 존대).
- (경계) 20.6 `리듬을 계속 지켜보세요.`는 정답의 일부(리듬)와 겹친다. (권장) '체온을 (다시) 재 볼게요/잴게요' 10번을 상황에 맞는 말로 절반쯤 바꾼다.

### order (O1~O19)
- O1 · S1 — 2↔3 교환이 열렸다(`it`이 더위를 가리켜도 읽힘). L4 `With whatever helped in mind`는 억지다.
  - L3 → `Once you felt sick, did anything help, like shade, rest or water?`(L2의 증상을 가리킴)
  - L4 → `Thanks — now let me check your temperature and pulse.`
- O2 · S2 L4 `Alongside all that` — 억지. → `Even with that, tell me right away if you get confused or stop sweating.`(13단어)
- O3 · S3 L4 `Whatever you tell me` — 억지(자기 보고 4). → `Thanks for telling me — we'll keep checking your temperature as you warm up.`(13단어)
- O4 · S4 — L3 `the same pain`은 억지다. L4는 17단어이고 L3의 `aloe or a compress`를 그대로 되풀이한다.
  - L3 → `At home, aloe or a cool compress can keep easing it.`
  - L4 → `If blisters or a fever show up despite that, don't pop the blisters — come back.`(15단어)
- O5 · S5 L3 `Based on that exam` — 아직 모르는 결과를 전제한다(자기 보고 4). → `If the exam shows it's mild, let's start with small sips of fluid.` L4 `If`는 그대로 둔다.
- O6 · S6 L3 — 18단어. `With those packs on, stay with me`는 억지다. → `While we cool you, can you tell me your name and where you are?`(13단어). L4 `I'm asking because`가 L3을 묶는다.
- O7 · S7 L3 `To help with that` — 문지르지 않기가 재가온을 돕는다는 말이라 논리가 틀렸다. L4 `Along with leaving his limbs alone`은 억지다.
  - L3 → `Because his heart is sensitive now, please don't rub his arms and legs.`
  - L4 → `For the same reason, we're watching his heart rhythm closely.`
- O8 · S8 L3 — 15단어. `pain from the warm water`는 통증이 물 때문이라는 오해를 준다(실제로는 녹는 과정에서 옴). L4 `Together with what you tell me`는 억지다.
  - L3 → `As your fingers thaw, tell me if you feel tingling or pain.`
  - L4 → `After rewarming, we'll watch for blisters and check how the color returns.`
- O9 · S9 L3 `With that intake in mind`(15단어), L4 `With all of those answers` — 억지다. 검사·수액을 답에 매어 둔다.
  - L3 → `Besides what she's drunk, has she been urinating less or dizzy when standing?`
  - L4 → `Either way, we'll check her electrolytes and rehydrate her carefully.`
- O10 · S10 — 1↔2 교환이 열렸고, 측정이 냉각보다 앞이다(심각 7).
  - L1 → `We're cooling you in an ice-water bath to bring your temperature down fast.`
  - L2 → `While you're in it, we're checking your core temperature with a special probe.`
  - L3·L4는 그대로 둔다.
- O11 · S11 L4 — 16단어. → `Whatever you tell me is okay — we just want you safe tonight.`(11단어)
- O12 · S12 — L1↔L2가 어긋나고(심각 6), L3 `Whatever the answer`는 억지다.
  - L1 → `He's out of the water now, and we're taking care of him.`
  - L3 → `That helps — we're warming him and watching his breathing closely.`
  - L4는 그대로 둔다.
- O13 · S14 — 통역사에게 3인칭으로 말하고, L4가 조건부다(심각 3). L3·L4는 억지 연결어다. 보호자에게 직접 말하는 카드로 다시 쓴다.
  - L1 → `I'll speak with you through the interpreter, one short question at a time.`
  - L2 → `First, how high did he climb, and how fast?`
  - L3 → `After that climb, when did his headache and shortness of breath start?`
  - L4 → `Does he still have them now, or any chest pain or confusion?`
  - `ko`·`why`도 다시 쓴다.
- O14 · S15 L4 `With both answers` — 억지(체온 감시는 답과 관계없음). → `Thank you — that helps us narrow the cause while we keep cooling you.`(13단어)
- O15 · S16 — 논리가 거꾸로이고(심각 5), `For that`이 억지이며, L4는 16단어다(자기 보고 2).
  - L1 → `Heat stroke with multi-organ failure — we're cooling aggressively.`
  - L2 → `Despite that, his temp's forty-one and still climbing.`
  - L3 → `That heat is breaking down his muscles — urine is dark, likely rhabdo.`
  - L4 → `With all of that, I need labs, blood products, and an ICU bed.`(12단어)
  - `why`를 다시 쓴다.
- O16 · S17 L2 `So it's a deep hypothermic arrest` — 논리가 거꾸로다(심각 4).
  - L2 → `To get him warm, let's activate the ECMO team now.`
  - L3 → `For that team, we're prepping the room right now.`
  - L1·L4는 그대로 둔다. `ko`·`why`를 다시 쓴다.
- O17 · S19 L4 `Whatever it shows` — 억지이고 임상적으로도 어긋난다(자기 보고 4). → `Those numbers will guide how much fluid we give to protect your kidneys.`(13단어). 2↔3은 약하게 열려 있다(선택).
- O18 · S20 — 2↔3 교환이 열렸다. L1과 L2가 같은 말("부드럽게 = 움직임 피하기")이라 `Even so`가 어느 쪽 뒤에도 붙는다.
  - L2 → `That's why we're turning him only for essential care.`
  - L3 → `Even for that essential care, his rhythm changed the moment we shifted him.`
- O19 · S21 — 1↔2 교환이 열렸다(인계에서 `On scene, …`이 첫 줄이어도 자연스러움). → L2 `There, his core temp was forty-one.`(`There`가 창고를 가리킴)
- (경미, 선택) S13 L4 `Last of all`은 서수로 4번을 못 박는다. 브리프는 서수를 1·2줄에만 허용한다. 그대로 두어도 틀린 말은 아니다.
- 고친 카드는 모두 `why`의 "'…'가 앞 줄을 가리켜" 문구를 새 줄에 맞게 다시 쓰고, 줄 `ko`·`note`를 맞추고, 인접 교환 세 가지와 15단어를 다시 확인할 것.

### context (C1~C3)
- C1 · S12 XX → `What was his total time underwater, from submersion to extrication?` `underwater`가 W14 어간 `under`를 통과한다. why → `submersion·extrication은 의료진이 인계·기록에 쓰는 말이에요. 놀란 보호자에게는 how long · under처럼 쉬운 말로 물어요.`
- C2 · S14 차트 → `Pt climbed rapidly to high altitude per family via interpreter.` XX → `What was his rate of ascent and the maximum altitude he climbed to?` why → `rate of ascent·maximum altitude` 기준으로 base 문구로 되돌린다.
- C3 · S4 XX → `Monitor for blister formation or pyrexia, and avoid rupturing them.`(겹친 `blistering, bullae`를 정리). why → `pyrexia(발열)·formation·rupture는 기록에 쓰는 말이에요. 집에 가서 스스로 지켜볼 환자에게는 blisters·fever처럼 매일 쓰는 말로 알려 줘야 실제로 지켜요.`
- (선택) C4 · S2 → 위 자기 보고 3의 `diaphoretic` 안.

### why·tag·icon (W1~W4)
- W1 · 14.4 why — 통역 관행 사실 오류(심각 3). → `묻는 내용(how high·how quickly)을 그대로 넣어 통역사가 바꾸지 않고 옮기게 해요. 다만 원칙은 통역사가 아니라 보호자를 보고 직접 묻는 거예요.`
- W2 · 14.1 why — `Through the interpreter로 통역을 거친다는 것을 먼저 밝혀`는 같은 오해를 권한다. → `how high·how fast처럼 짧은 질문 두 개로 나누면 통역에서 뜻이 덜 흐려져요. 질문은 통역사가 아니라 보호자를 보고 해요.`
- W3 · 16.2 why — `aggressively cooling은 … 처치를 가리켜요`는 `ko`를 되풀이한다. → `aggressively는 냉각을 미루지도 천천히 하지도 않는다는 뜻이라, 받는 사람이 처치의 강도를 바로 알아요.`
- W4 · 10.6 icon `chartup` — 내려가는 체온이다. → `check` 또는 `monitor`.
- (경미, 선택) 정맥 수액 문장의 `pill`(5.2 10.5 13.2 19.2) → `bandage`나 `hospital`. 1.3 `home` → `shield`. 11.5 `lab` → `speech`. 4.6 `pill` → `bandage`.

### 결정 11 (v44 단어·문장)
- 바뀐 것 없음(단어 전부·문장의 v44 필드가 base와 같음). 보고만 한다.
- 14.1·14.4 — 통역사에게 3인칭으로 묻는다(`Through the interpreter — how high did he climb`, `Please ask him …`). 미국 병원 원칙은 환자·보호자에게 직접 1인칭으로 말하는 것이다. 다음 정비 때 `How high did he climb, and how fast?`처럼 바꾸면 맞다.
- 12.5 — `We pulled him out of the ice water`를 간호사가 보호자에게 하는 말로 두면, 구조한 사람이 누구인지 어긋난다.
- 5.3·5.6 — 거의 같은 문장이다(조금씩 자주 ↔ 벌컥).
- 6.2 — `We're putting cool packs and misting you`에 `on you`가 빠져 있다.
- W13 `w-clothes`의 오답 `cloths`는 같은 말의 다른 꼴로 읽힐 수 있다.

**고칠 것 합계**: 빈칸 45(위험 7 · 가르치는 말로 옮기기 8 · 묶음·문법 7 · 동떨어짐 20 · 낙인·정답 둘 3), decoy 16(위험 10 · `ko`에 맞음 6), distractorsKo 5, order 19, context 3, why·icon 4 → **92건**. 경미·선택·권장 항목은 따로.

## 종합

위험한 오해·지연을 오답으로 보인 17건(빈칸 7 · decoy 10)과 order의 임상·대화 오류(S14 조건부 확인과 3인칭 통역, S17·S16 거꾸로인 논리, S12 어긋남, S10 냉각 순서)는 반드시 고쳐야 한다. 이것과 동떨어진 빈칸 오답, 억지 연결어, context S12·S14를 고친 뒤 다시 검토하면 내보낼 수 있다. 지금 상태로는 내보내지 않는다.
