# er-genitourinary — v46 보강 검토 (er)

대상: `er-genitourinary.yaml`(상황 21 · 문장 126 · order 21장 · 뉘앙스 context 12 · swap 9). 문장 126개와 order 21장을 **전부** 봤다.
번호는 **1부터** 센다. 상황은 파일 순서대로 S1(배뇨통·빈뇨 문진) … S21(신성 위기 급변 인계), 문장은 `상황.문장`(예: 11.6), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before + 선택지 + after` 504줄
- decoy를 청크 자리마다 **대신 넣은** 조립 약 460줄과 청크 사이에 **끼워 넣은** 조립 약 480줄
- order 인접 교환 63가지(21장 × 3)와 줄 단어 수
- context `word`가 세 장면 `en`에 있는지(W14와 같은 어간 비교), base 장면과의 차이
- swap 9건(선택지마다 `before[0]+선택지+before[2]`)
- decoy·빈칸 오답·distractorsKo가 주제 안에서 몇 번 되풀이되는지
- base와 v44 필드 비교: **단어·문장은 바뀐 것 없음.** 뉘앙스도 context 10문항의 장면 `en`·`fix`·`why` 말고는 그대로다.

`verify_one_theme.py er …/er-genitourinary.yaml` → `==> 통과`(W13 경고 4건은 v44 단어 쪽이라 이번 범위 밖).

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 '정답이 둘'은 **`ko`에도 맞는가**로 판정했다. context는 `review-ctx-A/B/C.md`와 같은 기준이다.
- 같은 `word`가 세 장면에 같은 뜻으로 나와야 한다.
- 어색함은 듣는 사람 때문이어야 한다. 장면 안 다른 낱말에서 오는 어색함은 받아들인다.
- 핸드오프 `deteriorate`처럼 의료진 말을 `word`로 쓰는 것을 우선한다. 쉬운 말을 `word`로 고르면 XX 장면에도 그 쉬운 말이 들어가 어색함이 흐려진다(ortho S18 판정).
- W14를 맞추려고 낱말을 억지로 끼워 넣는 것은 받아들이지 않는다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 거의 다 사실이고, 말하는 방식의 이유(may need·Let me·Try not to·as soon as)를 짚는다. 임상 사실도 맞다: 배양 먼저, 요도구 피는 RUG 먼저, 포트 채취, 염분→요중 칼슘, AUA 2.5 L, 복강 내 방광파열은 수술. 고칠 것은 경미한 4건: 18.1 기전, 2.1 조사, 6.5 might 해석, 1.5. |
| 2 | 빈칸 | 2 | `ko`로 걸러지지 않는 '정답 둘'은 없다. 그러나 문제가 많다. **장면과 동떨어진 우스운 오답이 33문장**(`barber`·`pillow/blanket`·`holiday/wedding`·`gender/name/birthday`·`eczema/acne`·`kitchen`·`receptionist`…). **위험한 처치를 오답으로 보인 것이 8문장**(11.6 `double`, 12.2·12.5 투석 팔 사용, 18.1 폐부종에 `fluids`, 20.5 `after/while we place any tube`, 12.6, 15.5, 7.3). 브리프가 이름 붙인 **돌려쓰기 묶음**도 있다(`barely/never/hardly` 6문장, 시간 단위 4문장, `first/next` 4문장, `avoiding/forgetting/ignoring` 3문장, `hide` 5문장, `cough` 9·`rash` 6·`itching` 6). 문법으로 걸러지는 것이 6문장이다. |
| 3 | `decoy` | 3 | 청크 자리를 **대신**해 `ko`에 맞는 다른 문장이 되는 것은 거의 없다(19.2만 근접). **끼워 넣으면 `ko`에 맞는** 것이 4건(2.2 18.3 19.2 21.3)이고 경계선이 약 10건이다. 그리고 **같은 decoy 12개를 S4부터 4~5번씩 돌려쓴다**(54문장, 서로 다른 decoy는 84개). 대부분 어떤 청크 자리에도 맞지 않는 시간·장소 부사구라 대비가 없다. |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이고, 정답 뒤집기는 없다. 고칠 것은 8건이다: 위험한 처치 2(18.5 눕히기, 18.6 다리 올리기 — 폐부종), 미국 병원에 없는 것 1(14.3 산모수첩), 장면과 동떨어진 말 3(18.6 양말, 19.5 조직 검사, 21.3 퇴원 서류), 반만 다른 말 1(19.6 외과 의사), 잘못된 관행 1(21.3 기록만). |
| 5 | `order` | 2 | 조건절로 시작하는 줄은 없다. 그러나 문제가 여럿이다. **앞 질문의 답을 '예'로 전제한 줄이 7장**(S3 S6 S7 S9 S10 S12 S20). **임상 순서·사실이 틀린 카드가 3장**: S20 요도구 피 → 방광 조영(정답은 RUG), S12 혈관통로 팔을 맨 끝에 확인, S3 방광 스캔 없이 촉진만으로 도뇨. **15단어를 넘는 줄이 10줄**이다. **억지 연결어**가 7장(`Knowing those steps`, `With that many pills a day`, `handled the slow pace`, `whatever you can keep down` …). **인접 교환이 열린 카드**는 S17 2↔3, S19 1↔2·2↔3, 약하게 S14 1↔2·S18 3↔4다. S15·S16·S21은 좋다. |
| 6 | `tag`·`icon` | 4 | 태그는 모두 한국어, 10자 이하이고 상황 안에서 일관된다. 18.3 `안심 말`은 `안심`으로 바꾸면 낫다. 아이콘은 대체로 맞다. `calendar`가 소변량 문장(17.4 20.1)에, `bell`이 복용 보류(11.6)에 붙은 것은 경미하다. order 21장은 모두 `대화 흐름`·`compass`. |
| 7 | context `word`·`ko`, swap `ko` | 3 | `word`는 12/12 모두 세 장면에 있다(W14 0). 그러나 정비 10건 중 **5건은 base가 이미 세 장면에 의료진 말을 공유하고 있었는데** 쉬운 말로 바꾸며 끼워 넣었다(S2 S9 S14 S19 S17). S17·S21은 같은 `potassium/칼륨` 제목이 두 번 나온다. swap `ko` 9건은 모두 정답을 넣은 문장의 뜻이고, swap 문법도 9건 모두 맞다. |
| 8 | 파일럿 갈래 | 2 | (1) 선택지 아이콘: 없음(T8) 확인. (2) 동떨어진 빈칸 오답 33문장. 관사는 잘 지켰지만 문법으로 걸러지는 오답이 6문장. (3) order 못 박기: `And/Also/Then`은 거의 없다. 대신 앞 줄 말을 억지로 되풀이하는 연결어가 많고, 답을 전제한 줄이 7장이다. (4) 임상 순서: S20 S12 S3. (5) 오답 뜻·decoy 겹침: 위 3·4. 이어진 검토에서 새로 더한 갈래(위험한 처치를 오답으로)가 **빈칸 8 + 오답 뜻 2**로 그대로 되풀이됐다. |

## 사실 오류·심각한 문제

1. **위험한 처치를 빈칸 오답으로 보인 것(브리프 "이어진 검토" 갈래).** 학습자는 오답도 문장으로 읽는다.
   - 11.6 `We may need to double your next dose` — 혈뇨가 있는 항응고제 환자에게 용량을 두 배로 한다는 말.
   - 12.2 `so we use/choose it for blood pressure` — 투석 혈관통로 팔에서 혈압을 잰다는 말.
   - 12.5 `We'll prefer using that arm for IVs or blood draws` — 같은 팔에 주사·채혈을 한다는 말. `choose/need using`은 문법으로도 걸러진다.
   - 18.1 `We're giving you fluids … to help you breathe` — 폐부종(체액 과부하) 환자에게 수액을 준다는 말.
   - 20.5 `watching for blood at the tip after/while we place any tube` — 요도 손상 의심 환자에게 관부터 넣는다는 말. 바로 그 문장의 `why`가 경고하는 오류다.
   - 12.6 `need extra fluid added/given` — 과부하 환자에게 체액을 더한다는 말.
   - 15.5 `Cutting back on water can also lower your risk` — 결석 환자에게 물을 줄이라는 말. 15.1과 정면으로 어긋난다.
   - 7.3 `without/instead of starting antibiotics` — 신우신염에서 항생제를 주지 않는다는 말.
2. **위험한 처치를 distractorsKo로 보인 것** — 18.5 `몸을 눕혀서 쉬게 해 드릴게요`, 18.6 `다리를 높이 올려 두세요`. 둘 다 급성 폐부종 환자에게 하지 않는 자세다. 이때는 앉히고 다리를 내린다.
3. **S20 order L3 `A special X-ray of your bladder with contrast will show what that blood means` — 사실 오류.** 요도구에 피가 보이면 먼저 **역행성 요도조영(RUG)**으로 요도를 확인하고, 방광 조영은 요도가 괜찮은 뒤에 한다. 같은 주제의 context S20과 20.5 `why`도 RUG라고 바르게 쓰고 있다. 게다가 `that blood`는 L2가 "피가 있는지 살핀다"고만 했는데도 피가 있다고 전제한다.
4. **S12 order — 혈관통로 팔을 맨 마지막(L4 `Before we do`)에 묻는다.** 투석 환자는 혈관통로 팔을 첫 혈압·IV 전에 확인하는 것이 순서다. 체액을 빼기 직전에 묻는 것은 임상 순서가 틀렸고, 혈압 측정과 투석을 엉뚱하게 묶는다. L3 `need that extra fluid removed`는 L2의 답(체액이 쌓임)을 '예'로 전제한다.
5. **S3 order L3·L4 — 답을 전제하고 방광 스캔을 건너뛴다.** L3 `where it feels full`은 L2에 '예'라고 답했다고 전제한다. L4 `A small catheter will relieve the fullness I felt there`는 촉진만으로 도뇨를 확정한다. 같은 주제 S8(`quick bladder scan` → 도뇨)이 가르치는 순서와도 어긋난다.
6. **context 정비 5건이 끼워 넣기다(TASK 9번 금지 갈래).** base는 이미 의료진 말을 세 장면에 공유하고 있었다: S2 `midstream`, S9 `torsion`, S14 `fetal heart tones`, S19 `priapism`, S17 `peaked T waves`. 그런데 이것을 쉬운 말로 바꾸며 장면을 고쳤다.
   - S9: 콜 장면 끝에 `— we're getting a stat ultrasound`를 덧붙였다.
   - S14: 차트 `Fetal heartbeat 150s`는 차트에서 쓰는 말이 아니다.
   - S19: `Urology, I've got a man…`은 ortho 검토가 받아들이지 않은 `Interpreter, …`와 같은 호격이다.

## 저작자 자기 보고 4건 판정

### 1. 짧은 문장의 빈칸 오답과 `ko`로만 걸러지는 오답

| 문장 | 판정 | 근거 |
|---|---|---|
| 5.6 `Great, almost done` (`barely/hardly/never`) | **받아들이지 않음** | 브리프가 이름 붙인 `almost ↔ barely/never` 묶음 그대로다. 같은 묶음이 8.5 17.2 17.6 9.2 13.5에도 돈다. 고칠 안: 같은 분야 정도어 `almost / halfway / all / just`. `nearly`·`mostly`는 정답이 둘이 되니 쓰지 않는다. |
| 5.4 `a couple of minutes` (`hours/days/weeks`) | **받아들이지 않음** | 시간 단위 묶음이다(12.4 14.1 19.1에도). 시술이 며칠 걸린다는 말은 읽기만 해도 걸러진다. 또 answer `minutes`가 가르치는 말(`w-couple`)이 아니다. 고칠 안: 선택지 `minutes / seconds / tries / hours`(장면 안에서 틀린 말), 또는 빈칸을 `only`로 옮겨 `only / still / easily / always`. |
| 1.6 `wound/blood/stool sample` | **받아들임** | `ko` "소변 검체"로 걸러진다. 다만 `blood sample`은 이 문진에서 실제로도 받을 수 있는 검체다. 정답이 둘에 가까우니, 할 수 있으면 `blood`를 `sputum`으로 바꾼다. |
| 10.4 `dressing/bandage/sheet` | **받아들임** | `ko` "카테터"로 걸러진다. `dressing`과 `bandage`가 같은 뜻이라 오답끼리 겹치는 것은 경미하다. 원하면 `bandage`를 `bag`(소변 주머니)으로 바꾼다. |

### 2. 도뇨관 줄에서 `If`를 빼고 `that fullness`, `Based on that scan`으로 묶은 것

**억지 연결어다 — 되돌린다.** TASK 10번은 그 줄의 행동이 *모든 환자에게 하는 것*일 때만 조건을 빼라고 한다. 도뇨는 모든 환자에게 하지 않으므로 `If`는 맞는 조건이었고, 규칙을 지나치게 적용했다.
- S3 L4 `relieve the fullness I felt there`는 L3에 이어 답을 한 번 더 전제하고, 스캔 없이 도뇨로 간다(심각 5).
- S8 L4 `Based on that scan, we'll pass a catheter…`는 아직 하지 않은 스캔의 결과로 결정한 것처럼 읽히고, 16단어로 길이도 넘는다.
- 고칠 안: S8 L4 `If it shows a full bladder, we'll pass a catheter to drain it.`(13단어). S3은 아래 고칠 것 O3.

### 3. context 정비 10건

| 상황 | word | 판정 | 근거 |
|---|---|---|---|
| S2 | `sample` | **받아들이지 않음** | base가 세 장면 모두에 `midstream`을 공유하고 있었다(`Clean-catch midstream specimen…`, `I went over midstream with her`, `Please provide a clean-catch midstream specimen.`). `sample`은 환자에게도 맞는 쉬운 말이다. XX에 `for UA`, fix에 `— that's your sample`을 끼워 넣었다. → `word: midstream`, `ko: 중간뇨`로 하고 base 장면·fix로 되돌린다(why는 지금 것 그대로 둬도 된다). |
| S7 | `culture` | **받아들임** | base XX `UC sent`만 바꿨다. `Culture sent, OK to hang abx.`의 어색함은 `hang abx`에서 오며, 묶음 B 기준으로 받아들인다. |
| S9 | `ultrasound` | **받아들이지 않음** | base가 세 장면 모두에 `torsion`을 공유하고 있었다. `ultrasound`를 넣으려고 콜 장면 끝에 `— we're getting a stat ultrasound`를 덧붙였고, `Doppler`를 지웠다(혈류를 보는 것이 Doppler라 정보도 줄었다). → `word: torsion`, `ko: 염전`으로 하고 base 장면·why로 되돌린다. |
| S12 | `fistula` | **받아들임(fix는 되돌려도 됨)** | 장면은 base 그대로다. fix `the arm with your fistula`는 투석 환자가 실제로 쓰는 말이라 틀리지 않았다. 다만 바꿀 필요는 없었다. |
| S14 | `heartbeat` | **받아들이지 않음** | base가 세 장면 모두에 `fetal heart tones`를 공유하고 있었다. 새 차트 `Fetal heartbeat 150s by Doppler.`는 차트 말이 아니고(차트는 `FHT 150s`), XX `assessing fetal heartbeat via Doppler`는 관사가 빠졌다. 쉬운 말이 `word`가 되어 fix(`the baby's heartbeat`)와 어색한 장면의 대비도 흐려졌다. → `word: fetal heart tones`, `ko: 태아 심음`으로 하고 base 장면으로 되돌린다. W14 어간 비교로 base 세 장면 모두 통과하는 것을 확인했다. |
| S15 | `fluid` | **받아들임(fix 되돌림)** | 장면은 base 그대로다. fix의 `water → fluids`는 W14와 관계없는 fix 칸에 끼워 넣은 것이다. 결석 예방은 '물'로 말하는 것이 더 정확하다(AUA도 물을 권함). → fix를 base `Try to drink enough water every day that your pee stays pale yellow.`로 되돌린다. |
| S17 | `potassium` | **받아들이지 않음** | 차트·콜의 `K`를 `Potassium`으로 다 바꿔, 약어 교훈(why "K·T파 대신")이 사라졌다. base는 세 장면 모두 `peaked T waves`를 공유한다 → `word: peaked T waves`, `ko: 뾰족한 T파`로 하고 base 장면·why로 되돌린다. W14를 통과하는 것을 확인했다. |
| S21 | `potassium` | **받아들임(조건부)** | 장면은 자연스럽다. 그러나 S17과 같은 제목 "`potassium`이 어색한 장면은? — 칼륨"이 한 주제에 두 번 나온다. S17을 위처럼 바꾸면 그대로 둬도 된다. 아니면 S21을 base 장면 + `word: K`, `ko: 칼륨(약어)`로 되돌린다(W14 통과). |
| S19 | `urology` | **받아들이지 않음** | base가 세 장면 모두에 `priapism`을 공유하고 있었다. 콜 장면 첫머리 `Urology, I've got a man…`은 직함 호격이다. ortho S14 `Interpreter, …`를 받아들이지 않은 근거와 같다. fix의 `specialist → urology`도 끼워 넣었다. → `word: priapism`, `ko: 지속발기증`으로 하고 base 장면·fix로 되돌린다. 환자에게 병명을 던지는 것이 어색한 장면이 되어 핸드오프 모양과도 맞는다. |
| S20 | `Foley` | **받아들임(fix 되돌림 권장)** | 장면은 base 그대로다. fix `before we put in a Foley, the tube that drains your bladder`는 환자에게 하는 말에 의료진 말을 다시 넣은 것이다. base fix `before we put in any tube`가 낫다. |

### 4. 여러 문장에 돌려쓴 decoy 12개

**받아들이지 않음(권장 수정).** `by morning`·`for the nurse`·`in the hallway`·`this week`·`next visit`·`at triage`는 각 5번, `over the phone`·`on the monitor`·`during rounds`·`at the bedside`·`after the scan`·`for now`는 각 4번이다. S4 이후 **54문장**이 이 12개를 차례로 돌린다. 규칙 위반은 아니다. 그러나 대부분 어떤 청크 자리에도 맞지 않아 대비가 없다(예: 4.1 `Is there by morning …`). 브리프의 `for the doctor ↔ for your safety`처럼 **같은 자리에 올 수 있는 구**나 **청크를 살짝 바꾼 것**이 좋다.
- 반드시 고칠 것: 끼워 넣으면 `ko`에 맞는 4건(아래 D1~D4).
- 권장: 나머지 50문장은 상황마다 청크 변형으로 바꾼다(예: 4.1 `when you walk`, 8.2 `a slow bladder scan`, 14.5 `your blood pressure`).

---

## 고칠 것

### 빈칸 — 위험한 처치 (B1~B8, 반드시)
- B1 · 11.6 `double` 오답 — 출혈 중 항응고제 증량. → 빈칸을 `until`로 옮긴다. 선택지 `until / unless / because / since`.
- B2 · 12.2 `use`·`choose` 오답 — 혈관통로 팔에서 혈압 측정. → 빈칸을 `access`로 옮긴다. 선택지 `access / IV / cast / splint`(`ko` "혈관통로"로 걸러짐).
- B3 · 12.5 `prefer` 오답(위험), `choose/need using` 오답(문법으로 걸러짐). → 빈칸을 `arm`으로 옮긴다. 선택지 `arm / leg / foot / neck`(`hand`는 같은 팔이라 쓰지 않음).
- B4 · 18.1 `fluids` 오답 — 폐부종에 수액. → `fluids`를 `antacids`로 바꾼다. 선택지 `oxygen / antibiotics / insulin / antacids`.
- B5 · 20.5 `after`·`while` 오답 — 피를 확인하기 전에 관 삽입. → 빈칸을 `blood`로 옮긴다. 선택지 `blood / urine / pus / dye`.
- B6 · 12.6 `added`·`given` 오답 — 과부하 환자에게 체액 추가. → 빈칸을 `lungs`로 옮긴다. 선택지 `lungs / liver / bones / brain`.
- B7 · 15.5 `water` 오답 — 결석 환자에게 물 줄이기. → 선택지 `salt / caffeine / sleep / naps`. `sugar`(정답이 둘)와 `calcium`(칼슘 제한은 오히려 위험을 높이는 잘못된 통념)은 쓰지 않는다.
- B8 · 7.3 `without`·`instead of` 오답 — 항생제를 주지 않는다는 말. → 선택지 `before / after / while / upon`.

### 빈칸 — 장면과 동떨어진 오답 (B9~B36)
- B9 · 2.3 `shake/squeeze/crush the inside` — 우스운 말. → 빈칸을 `inside`로 옮긴다. 선택지 `inside / outside / label / bottom`.
- B10 · 2.4 `hide/cancel the steps`. → 빈칸을 `before`로 옮긴다. 선택지 `before / after / once / while`.
- B11 · 4.6 `kitchen`. → `kitchen`을 `radiology`로, `ward`를 `blood bank`로 바꾼다.
- B12 · 6.3 `remove/refuse a CT scan`. → `cancel / skip / delay`로 바꾼다. `delay`는 경미하니, 원하면 빈칸을 `CT`로 옮겨 `CT / MRI / EEG / EKG`.
- B13 · 6.6 `apply/push/pay for the scan`. → 빈칸을 `comfortable`로 옮긴다. 선택지 `comfortable / discharged / dressed / weighed`.
- B14 · 7.5 `printed/approved/cancelled`. → `collected / labeled / resulted / reviewed`. `resulted`(결과가 나온 뒤)는 이 문장에서 틀린 말이다.
- B15 · 9.5 `avoiding/forgetting/ignoring the specialist` — 정답 뒤집기. 19.2·21.2에도 같은 묶음이 돈다. → 빈칸을 `ultrasound`로 옮긴다. 선택지 `ultrasound / X-ray / EKG / echo`(모두 `an`과 맞음). 16.3과 겹치지 않게 `urgent`는 피하고, 17.1의 `MRI/EEG`와도 겹치지 않게 했다.
- B16 · 10.3 `ignore/hide/borrow the catheter`. → `change / flush / clamp / secure`.
- B17 · 10.6 `crowded/strict/expensive`. → `comfortable / uncomfortable / painful / irritating`.
- B18 · 13.3 `saliva/sweat`. → 빈칸을 `strain`으로 옮긴다. 선택지 `strain / hold / measure / flush`.
- B19 · 14.2 `new/fast/cheap`. → 빈칸을 `during`으로 옮긴다. 선택지 `during / after / before / outside`.
- B20 · 14.3 `gender/name/birthday`. → `wellbeing / position / size / weight`.
- B21 · 14.5 `forget/ignore/skip` — 정답 뒤집기. → 빈칸을 `fever`로 옮긴다. 선택지 `fever / weight / diet / sleep`.
- B22 · 14.6 `sicker/weaker/worse` — 정답 뒤집기. → 빈칸을 `hydrated`로 옮긴다. 선택지 `hydrated / warm / active / seated`.
- B23 · 15.3 `barber`(브리프의 `haircut`과 같은 갈래), `dentist`. → `urologist / cardiologist / dermatologist / pharmacist`. 결석 대사 평가를 하는 `nephrologist`는 정답이 둘이 되니 쓰지 않는다.
- B24 · 15.6 `pillow/blanket/thermometer`. → 빈칸을 `future`로 옮긴다. 선택지 `future / past / old / previous`.
- B25 · 16.5 `eczema/acne/arthritis`. → 빈칸을 `dangerous`로 옮긴다. 선택지 `dangerous / chronic / contagious / harmless`.
- B26 · 16.6 `pharmacist/dietitian/receptionist` — 19.6과 같은 묶음. → `specialist / pharmacist / technician / chaplain`. 신루를 넣는 영상의학과(`radiologist`)는 정답이 둘이 되니 쓰지 않는다.
- B27 · 18.2 `massage/radiation`. → `dialysis / surgery / suction / therapy`.
- B28 · 18.5 `count/hide`(`hide`는 주제 안 5번). → `ease / raise / measure / double`.
- B29 · 19.2 `avoiding/forgetting/cancelling` — 정답 뒤집기 묶음. → 빈칸을 `time-sensitive`로 옮긴다. 선택지 `time-sensitive / routine / minor / common`(스크래치 사본으로 V18 통과 확인).
- B30 · 19.3 `cancel/refuse/forget treatment` — 정답 뒤집기. → 빈칸을 `while`로 옮긴다. 선택지 `while / after / before / unless`.
- B31 · 19.6 `pharmacist/dietitian/receptionist`. → `urologist / pediatrician / anesthesiologist / radiologist`(B23과 겹치지 않게; `ko` "비뇨기과"로 걸러짐).
- B32 · 20.1 `holiday/wedding`. → `accident / surgery / X-ray / transfusion`. `injury`·`fall`은 정답이 둘이 된다.
- B33 · 20.6 `borrow`(10.3과 같음). → `repair / remove / replace / drain`.
- B34 · 21.2 `forgetting/avoiding/ignoring the doctor`. → 빈칸을 `doctor`로 옮긴다. 선택지 `doctor / chart / family / pharmacy`(`ko` "의사"로 걸러짐).
- B35 · 21.3 `ignore/delay/hide`. → 빈칸을 `trend`로 옮긴다. 선택지 `trend / intake / dose / diet`. `delay`는 보고를 미룬다는 위험한 말이기도 하다.
- B36 · 21.5 `names/pictures/stories`. → `numbers / questions / forms / photos`.
- (경미, 선택) 3.3 `weigh/stretch`, 8.1 `loud`, 8.2 `big`, 10.1 `in trouble/charge/control`, 20.3 `hearing/dental/eye team`은 같은 분야의 말로 바꾸면 낫다. 예: 20.3 `trauma / dialysis / palliative / wound care`.

### 빈칸 — 돌려쓴 묶음·문법으로 걸러지는 것 (B37~B47)
- B37 · 5.6 `barely/hardly/never done`. → `almost / halfway / all / just`(자기 보고 1).
- B38 · 5.4 `hours/days/weeks`. → `minutes / seconds / tries / hours`(자기 보고 1).
- B39 · 8.5 `barely/rarely/never empty`. → 빈칸을 `after`로 옮긴다. 선택지 `after / before / while / when`. 단 `before you go`가 decoy와 겹치니 decoy를 `like your stomach`으로 바꾼다.
- B40 · 17.2 `barely/slightly/mildly high, so we're acting fast` — `barely` 묶음. → 빈칸을 `fast`로 옮긴다. 선택지 `fast / slowly / later / calmly`.
- B41 · 17.6 `never/rarely/hardly` — 어순으로도 걸러진다. → `closely / briefly / loosely / casually`.
- B42 · 13.5 `first/next/never kept fluids down` — `never`는 문법으로 걸러지고 `first/next`는 돌려쓴 묶음이다. → 빈칸을 `fluids`로 옮긴다. 선택지 `fluids / food / pills / solids`(`ko` "수분"으로 걸러짐).
- B43 · 3.1·12.1 `first/next/same/only` — 같은 묶음. → 3.1은 빈칸을 `able`로 옮겨 `able / asked / told / ready`. 12.1은 빈칸을 `dialysis`로 옮겨 `dialysis / chemo / therapy / counseling`.
- B44 · 시간 단위 묶음 — 12.4 `weeks/months/hours`, 14.1 `pounds/days/years`, 19.1 `months/weeks/years`. 19.1은 지속발기가 몇 주 갔냐는 말이라 읽기만 해도 걸러진다.
  - 19.1·12.4는 시간 단위 자리밖에 없으니 단위는 두되 두 묶음이 같지 않게 한다(경미): 19.1 `hours / minutes / days / weeks`, 12.4 `days / hours / weeks / months`.
  - 14.1 → 그대로 두되 `pounds`를 `months`로 바꾼다(`How many months pregnant`는 맞는 영어이고 `ko` "주"로 걸러진다).
- B45 · 3.4 `eaten` — `since you last eaten`은 문법으로 걸러진다. → `drank`.
- B46 · 5.1 `chill` — `some chill`은 문법으로 걸러진다. → `tingling`.
- B47 · 5.3 `cough` — `feel any cough`는 문법으로 걸러진다. → 선택지 `discomfort / itching / nausea / burning`. `burning`은 `ko` "불편감"으로 걸러진다. B46의 `tingling`과 겹치지 않는다.
- (권장) 증상 묶음 `cough`(9문장)·`rash`(6)·`itching`(6)·`dizziness`(5)는 각 장면에 맞는 증상으로 절반쯤 바꾼다. 예: 9.1 `fever/cough/rash` → `swelling / nausea / vomiting`은 `ko` "통증"으로 걸러짐. 16.1 `rash/cough/headache` → `cough / confusion / pain`. 정답이 둘이 되지 않게 `ko`로 걸러지는지 확인한다.

### decoy (D1~D7)
- D1 · 2.2 `into the toilet` — `Start urinating into the toilet, then catch…`는 오히려 정확한 지시이고 `ko`에도 맞는다. → `the first part`.
- D2 · 19.2 `over the phone` — 끼워 넣어도(`contacting the specialist over the phone now`), 대신 넣어도 `ko` "지금 전문의에게 연락하고 있어요"에 맞는다. → `the pharmacist`.
- D3 · 21.3 `to your family` — `ko`에 받는 사람이 없어 `report … clearly to your family`가 그대로 맞는다. → `and blood sugar trend`.
- D4 · 18.3 `in the hallway` — `we're right here in the hallway`가 `ko` "저희가 여기 있어요"에 맞는다(응급실 복도 침대는 실제로 있다). → `a seat`.
- D5 · 7.3 `to be safe` — `before starting antibiotics to be safe`가 `ko`에 거의 맞는다. → `after antibiotics`.
- D6 · 9.5 `at the bedside` — `an urgent ultrasound at the bedside`(침상 초음파는 실제로 있다)가 `ko`에 맞는다. → `a routine ultrasound`.
- D7 · 17.6 `twice a day` — `watching your heart monitor twice a day for any changes`는 고칼륨혈증 환자에게 위험한 감시 간격을 조립하게 한다. → `your blood sugar`.
- (경계, 선택) 5.1 `at first`, 7.2 `this week`, 11.4 `with water`, 13.4 `for now`, 15.5 `for good`, 21.6 `to the front desk`, 6.6 `in the hallway`, 4.6 `for the doctor`, 16.2 `in an hour`(대신 넣으면 항생제 지연 문장). 끼워 넣으면 `ko`에 거의 맞거나 정보만 더해진다.
- (권장) 위 자기 보고 4 — 돌려쓴 12개(54문장)를 청크 변형으로 바꾼다.

### distractorsKo (K1~K8)
- K1 · 18.5 `몸을 눕혀서 쉬게 해 드릴게요` — 폐부종에 위험한 자세. → `소변량을 계속 잴게요`.
- K2 · 18.6 `다리를 높이 올려 두세요` — 급성 폐부종에서는 다리를 내린다. → `체중을 매일 재 보세요`.
- K3 · 18.6 `양말을 신으셔도 돼요` — 장면과 동떨어졌다. → `투석은 몇 시간 걸려요`.
- K4 · 14.3 `산모수첩을 가져오셨나요?` — 미국 병원에 없는 것(한국 산모수첩). → `다니시는 산부인과가 어디세요?`
- K5 · 19.5 `조직 검사를 할 거예요` — 지속발기 장면에서 하지 않는다. → `소변은 보실 수 있나요?`
- K6 · 19.6 `외과 의사를 부르고 있어요` — 정답과 반만 다르다(부르는 의사만 바뀜). → `혈압을 한 번 재 볼게요`.
- K7 · 21.3 `퇴원 서류를 준비할게요` — 신성 위기에 동떨어진 말. → `칼륨을 낮추는 약이 나올 수 있어요`.
- K8 · 21.3 `차트에 기록만 해 둘게요` — 오르는 칼륨을 보고하지 않는 잘못된 관행. → `활력징후를 다시 잴게요`.
- (경미) 9.6 `수술은 몇 시간 걸릴 거예요` — 고환고정술은 대개 1시간 안쪽이다. → `수술 동의서를 받아야 해요`.

### order (O1~O18)
- O1 · S1 L4 — 17단어. `소변 검체가 열·통증에 대해 알려 준다`는 말도 어색하다. → `Thanks. A urine sample will help us find what's causing all that.`(12단어)
- O2 · S2 L2 `Knowing those steps,` — 억지 연결어. → `First, clean the area with the wipe we give you.` `First,`가 1·2줄을 고정한다.
- O3 · S3 L3·L4 — 답을 전제하고 스캔을 건너뛴다(심각 5).
  - L3 → `Let me press gently on your lower belly to check for that.`(`that`이 L2의 팽만·압통을 가리키되 '예'를 전제하지 않음)
  - L4 → `We'll confirm what I felt with a quick bladder scan.`(9단어, `what I felt`가 L3을 가리킴)
  - why를 다시 쓴다.
- O4 · S4 L3 `Has any of that blood been passed as clots?` — 어색한 영어. → `Have you passed any clots with that blood?` L4는 17단어 → `Thank you. We'll send your urine to the lab to look at all of that.`(15단어)
- O5 · S5 L3 `the pressure becomes discomfort`, L4 `handled the slow pace` — 억지 되풀이.
  - L3 → `If it ever feels sharp, tell me and I'll go slowly.`(조건은 일부 환자에게만 해당하니 맞음)
  - L4 → `That's it — it's in. You did great.`
- O6 · S6 L3 `along that path` — 방사가 '예'라고 전제하고, 영어도 어색하다. L4 `Whatever the number` — 점수를 물은 뜻(6.4 why: 투약 뒤 비교)을 스스로 지운다.
  - L3 → `Wherever it goes, how bad is it right now, one to ten?`
  - L4 → `We'll give you pain medicine and recheck that number after.`
- O7 · S7 L2 `That pain …` — 타진 통증이 '예'라고 전제한다. L3 `To confirm it` — 배양은 균을 찾아 항생제를 맞추려고 받는 것이고, 결과는 1~2일 걸린다.
  - L2 → `Pain there is common with a kidney infection.`
  - L3 → `To find the germ causing it, we'll get a urine culture before antibiotics.`(13단어)
- O8 · S8 L4 — 16단어. `Based on that scan`(자기 보고 2). → `If it shows a full bladder, we'll pass a catheter to drain it.`
- O9 · S9 L2 `Since it started,` — 억지. L3 `on that side` — 한쪽이라고 전제한다. L4는 19단어.
  - L2 → `Is the pain only on one side, or on both sides?`
  - L3 → `On whichever side hurts, any swelling or redness?`
  - L4 → `With all of that, this can be an emergency — we're moving fast.`
- O10 · S10 L3 `Since the last change` — 교체가 '예'라고 전제한다. L4는 18단어.
  - L3 → `Either way, has your urine become cloudy or foul-smelling?`
  - L4 → `We'll send a sample of it from the catheter port for culture.`
- O11 · S11 L3 `With that many pills a day` — 억지(복용량과 외상·도뇨는 관계가 없다). L4는 22단어.
  - L2 → `Since that dose, have you had any injury or a catheter?`
  - L3 → `We'll check your blood levels to see how thin your blood is now.`
  - L4 → `Until those results are back, we may need to hold your next dose.`
  - 인접 교환을 다시 볼 것.
- O12 · S12 — 혈관통로 팔을 맨 끝에 묻는다(심각 4). L2는 16단어, L3는 답을 전제한다.
  - L1 → `First, which arm has your access, so we avoid it for blood pressure?`
  - L2 → `How many days has it been since your last treatment?`
  - L3 → `Over those days, any trouble breathing or swelling in your legs?`
  - L4 → `If fluid has built up, dialysis can remove it safely.`
- O13 · S13 L3 `…, whatever you can keep down` — 영어로는 "넘길 수 있는 것은 뭐든 주겠다"로 읽혀, `ko` "얼마나 넘기시든"과 뜻이 다르다. → `Either way, we'll give you fluids and medicine to settle your stomach.`
- O14 · S14 L2 `at this stage` — 1↔2를 바꿔도 읽힌다(약함). L3의 `also`. → L2 `That far along, have you had any bleeding or contractions?` L3 `With that in mind, we'll check on the baby's wellbeing.`
- O15 · S17 — 2↔3 교환이 자연스럽다(`It`이 두 줄 모두 칼륨을 가리킴). 심전도가 소변 질문 뒤에 온다. L2 `to get rid of it`은 어색하고, L3는 17단어다.
  - L2 → `It can affect your heart rhythm, so we're getting an ECG now.`
  - L3 → `While it runs, have you been able to urinate at all today?`
  - L4 → `Either way, we'll keep watching your heart monitor closely.`
- O16 · S19 — 1↔2·2↔3 교환이 모두 자연스럽다.
  - L2 → `Every hour of that raises the risk to the tissue.`
  - L3 → `Because of that risk, we're calling the on-call urologist right away.`
- O17 · S20 — L3 사실 오류(심각 3). L2는 16단어·`to help with that`, L4는 18단어.
  - L2 → `Before a tube helps with that, I'll check the tip for blood.`
  - L3 → `If there's blood, a special X-ray of the urethra comes first.`
  - L4 → `Once the urethra is clear, a bladder X-ray will show any tear.`(12단어, 수술 줄은 빼고 방광 조영 단계로)
  - why를 다시 쓴다.
- O18 · S18 L2 `The fluid overload behind it` — 어색하다. → `It's from extra fluid, which may need urgent dialysis to remove.` 3↔4는 약하게 열려 있다(선택).
- 고친 카드는 모두 `why`의 "'…'가 앞 줄을 가리켜" 문구를 새 줄에 맞게 다시 쓰고, 인접 교환 세 가지와 15단어를 다시 확인할 것.

### context (C1~C7)
- C1 · S2 → `word: midstream`, `ko: 중간뇨`, base 장면 세 개와 fix로 되돌림.
- C2 · S9 → `word: torsion`, `ko: 염전`, base 장면·why로 되돌림.
- C3 · S14 → `word: fetal heart tones`, `ko: 태아 심음`, base 장면으로 되돌림. why는 `fetal·Doppler 대신`이라 그대로 맞는다.
- C4 · S17 → `word: peaked T waves`, `ko: 뾰족한 T파`, base 장면(`K`)·why로 되돌림.
- C5 · S19 → `word: priapism`, `ko: 지속발기증`, base 장면·fix로 되돌림.
- C6 · S15 fix → base(`water`)로 되돌림.
- C7 · S20 fix → base(`before we put in any tube`)로 되돌림(권장). S12 fix도 되돌려도 된다(선택).

### why·tag·icon (W1~W5, 경미)
- W1 · 18.1 why `폐에 찬 체액이 아래로 가라앉아` — 앉히는 주된 이유는 정맥 환류(전부하)가 줄고 횡격막이 내려가는 것이다. → `몸을 세우면 심장으로 돌아오는 피가 줄고 횡격막이 내려가 숨쉬기가 한결 편해져요.`
- W2 · 2.1 why `with the wipe we give you으로` — 조사가 틀렸다(→ `…we give you로`). `환자가 준비할 것이 없다고 안심`은 지나친 해석이니 뺀다.
- W3 · 6.5 why `might는 확신이 없을 때 쓰는 말이라 환자가 선택지를 편하게 고를 수 있어요` — 이 문장은 간호사가 가능한 양상을 예로 드는 말이다. → `might로 두 양상을 모두 가능하다고 열어 두어, 환자가 자기 통증에 맞는 쪽을 말하기 쉬워요.`
- W4 · 1.5 why — 아랫배 통증은 방광염에서도 흔하다. `감염이 번졌는지`의 단서는 열·옆구리 통증이다. → `열이 있으면 감염이 방광을 넘어 번졌을 수 있고, 아랫배 통증은 방광 자체의 염증 단서예요.`
- W5 · 18.3 tag `안심 말` → `안심`. (선택) 17.4·20.1 아이콘 `calendar`는 `lab` 또는 `magnify`로, 11.6 `bell`은 `pill`로.

### 결정 11 (v44 단어·문장)
- 바뀐 것 없음(단어 전부·문장의 v44 필드가 base와 같음). 이번 범위에서 고칠 것 없음. 참고: 8.3·swap S8 `PVR/잔뇨량`은 요폐(배뇨 전) 장면에는 엄밀히 '방광 용적'이지만 base 내용이라 손대지 않는다.

**고칠 것 합계**: 빈칸 47(위험 8 · 동떨어짐 28 · 묶음·문법 11, 그중 B44는 경미), decoy 7, distractorsKo 8, order 18, context 7, why·tag 5 → **92건**. 경미·선택·권장 항목은 따로.

## 종합

위험한 처치를 오답으로 보인 10건(빈칸 8 · 오답 뜻 2)과 order의 임상 오류 3장(S20 RUG, S12 혈관통로 순서, S3 스캔 생략)은 반드시 고쳐야 한다. 이것과 동떨어진 빈칸 오답·답을 전제한 order 줄·context 끼워 넣기 5건을 고친 뒤 다시 검토하면 내보낼 수 있다. 지금 상태로는 내보내지 않는다.
