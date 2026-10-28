# icu-endocrine-crisis — A 검토 (v45 1~7 + 기계적 전수 확인 + context 핸드오프 모양·swap ko)

대상: `icu-endocrine-crisis.yaml`(A·B 합친 파일). 비교: base, changes(115건 = 단어 56·문장 36·삭제 23), in-…json, notes-A.
단어 206개·문장 106개·뉘앙스 63문항(slider 21·context 21·swap 21)을 스크립트(`rev_icu-endocrine-crisis_A.py`,
출력 `_revA_icu-endocrine-crisis_{words,nuance,chunks,kp}.txt`)로 전부 뽑아 판정했습니다.
- **pair 0건**이라 pair 전 조합 검사는 해당 없음.
- chunks 106문장 전부, swap 21문항 이어 읽기 전부, distractorsEn 품사 412개 전부, decoyChips 전부, context 21문항의 `word` 포함 여부, 길이 규칙(1.25배·3자)을 확인했습니다. 길이 위반은 0건입니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 철자·소리가 닮은 말은 잘 골랐습니다. 그러나 품사가 다른 오답이 36개입니다(아래 표, ★ 29). 장례 연상 `urn`, 술 연상 `brew`가 있습니다. 정답으로도 맞는 오답은 없습니다 |
| 2 | distractorsKo·길이 | 4 | 길이 위반 0건. 정답으로도 맞는 오답 2건(w-bring `가라앉히다`, w-run `걸려 있는 중이다`). 실제로 쓰지 않는 말 1건(w-gap `동맥혈 차이`) |
| 3 | cue | 4 | 정답 노출 없음. 헤드워드 쓰임이 갈리는 단어(clear·keep·take·escalate)는 cue가 한 쓰임만 말합니다 |
| 4 | chips/decoyChips | 4 | 형태소 분절은 좋습니다. 비속어 `sod`, 성병 은어 `clap`이 있습니다. 판단이 필요한 것: `pot`·`dam`·`bar`·`rye`·`moan` |
| 5 | 뉘앙스 사실 정확성 | 4 | 대체로 정확합니다(칼륨 3.3 기준, 시간당 50~75 하락, 점액수종은 천천히 데우기, 갑상선폭풍에는 아세트아미노펜). S10 slider는 포도당을 넣는 중인데도 '계속 시간당 60씩 하락'을 안전하다고 합니다(안전). swap 노트 2건이 부정확합니다 |
| 6 | 뉘앙스 설계 | 4 | slider 21문항 모두 정답이 하나입니다. 다만 S1은 약함→강함 척도가 아니고, S2는 cue가 정답의 동의어(fast)를 드러냅니다. context 2문항은 `word`가 장면에 그 꼴로 나오지 않습니다(lose·escalate) |
| 7 | 결정 11(v44 단어·문장) | 3 | 변경량은 다른 주제와 비슷하고 대부분 옳습니다. 헤드워드 쓰임 갈림(clear 5가지 뜻, keep down, take, escalate, update)이 남았습니다. 고칠 문장이 5개입니다: 지어낸 단정 1, 업무 범위 1, 틀린 용어 1, 문법 1, 부자연 1 |

## 저작자 A의 변경 판정 (단어 56개 수정·23개 삭제·문장 36건은 태그만)

**결정 11 범위를 넘을 만큼 과하지 않습니다. 통째로 되돌릴 것은 없습니다.** 문장 en·ko는 한 글자도 바꾸지 않았고,
문장 36건은 전부 쉬운 단어 태그를 뺀 것입니다.
- 원형으로 바꾼 38건은 기계적 정리로 옳습니다. 예외가 둘입니다. **w-look**(looking→look, ko 찾다)과
  **w-weigh**(weighs→weigh, ko 의견을 내다)는 문장에서 `look for`·`weigh in` 구동사로만 쓰입니다. `based on`처럼
  구째 헤드워드로 해야 ko와 맞습니다(W7·W8).
- ko를 가른 21건도 대부분 근거가 있습니다(pressure 압력→혈압, work 듣다·작동하다→효과가 있다, way 방향→길·방법).
  다만 react `반응을 보이다`/respond `반응하다`, confirm `맞는지 확인하다`/check `확인하다`,
  risky `위험이 따르는`/dangerous `위험한`, pace `진행 속도`/rate `속도`는 가름이 얇습니다. 서로의 distractorsKo에
  들어 있지 않으니 정답이 둘이 되지는 않습니다. 기록만 하고 고치지는 않습니다.
- **w-pressor `승압제(약칭)` / w-vasopressor `혈관수축 승압제`**: 어색합니다. `혈관수축 승압제`는 쓰지 않는 말이고,
  icu-shock은 `승압제(줄임말)`을 씁니다. pressor는 `승압제(줄임말)`, vasopressor는 `혈관수축제`로 고칩니다(W17).
  혈관수축제로 하면 오답 `혈관확장제`와도 깔끔하게 맞섭니다.
- **w-steady `꾸준한`**: "blood pressure… looks steadier"(5.3)에 어색합니다. `일정한·꾸준한`으로 고칩니다(W10).
- **w-bring `이끌다`**: 쓰임 셋(bring back up·bring down·bring under control)을 덮기에 약하지만 허용합니다.
  오답 `가라앉히다`는 "bring it down"의 정답이 되므로 바꿉니다(W14).
- 쉬운 말 23개 삭제는 타당합니다. **선택 사항**: `home insulin`(8.4)과 `head of the bed`(15.1)은 `take the edge off`
  규칙처럼 구째로 가르칠 만한 임상 표현입니다. 구 단어로 새로 만들어도 됩니다(필수 아님).

## 저작자가 짚은 문장·단어 판정

| 대상 | 판정 |
|---|---|
| 18 [3] "must be critically low"(KP 아님) | **타당, 안전. 고칩니다(S1).** 확인 전에 원인을 단정하는 문장입니다. 같은 문장의 v46 `why`도 must be를 감쌉니다("강한 추정이라 확진이 아님") |
| 18 [0] D50(KP) | **사용자 결정(바꾸는 쪽 권고).** 혈당 결과가 나오기 전에 D50을 주는 순서로 읽히고, 프로토콜을 거친다는 말이 없습니다 |
| 17 [0] 스테로이드·승압제(KP) | **사용자 결정(유지 권고).** 동료 사이의 제안형이고 장면 brief가 둘을 같이 쓰라고 합니다. "per the order"는 붙이면 좋지만 필수는 아닙니다 |
| 2 [3] 생리식염수 시작(KP 아님) | **고치지 않음.** 간호사가 처방된 수액을 거는 말이고, "we"는 팀입니다. 저작자의 우려는 과합니다 |
| 8 [4] "switch him to his home insulin"(KP 아님) | **타당, 업무 범위. 고칩니다(S2).** 전환할지와 어떤 용량으로 할지는 처방자가 정합니다. 신규 진단이면 home insulin이 없을 수도 있습니다 |
| 9 [3] HHS 나트륨 급교정(KP 아님) | **틀리지는 않지만 단순합니다. 권고로 고칩니다(S4).** 가족에게 하는 설명이라 큰 해는 없습니다. 같은 상황 slider cue·9.0이 "sugar and sodium"이라 그에 맞춥니다 |
| 19 [4] 점액수종에 스테로이드 언급 없음 | **고치지 않음.** 문장은 틀리지 않았고, S19 context 인계 장면이 "the steroid is already in"으로 스테로이드를 먼저 줬다고 보여 줍니다 |
| 6 [1] ko "적정하고 있어요"(KP) | **타당. ko만 고칩니다(K2).** en의 titrate는 사용자 결정(아래)입니다 |
| clear | 맑은(5.0)·괜찮은/허가된(7.3 "clear to")·없애다(10.1·10.4)·분명한(20.1)·맑아지다(9.4). **뜻이 다른 4곳은 태그를 뺍니다(W1)** |
| keep | "keep … down"(0.1)은 구동사(토하지 않고 넘기다)입니다. **0.1에서 태그만 뺍니다(W2). ko `유지하다`는 둡니다** |
| slow | 형용사·동사·부사(slowly 3번)가 섞였습니다. w-fast `빠른`과 같이 **ko `느린`을 그대로 둡니다(기록만, W3)** |
| cause | 명사 2·동사 3입니다. **ko를 `원인(이 되다)`로 고칩니다(W4)** |
| monitor | "on the monitor"(13.3)만 명사입니다. **13.3에서 태그를 뺍니다(W5)** |
| pressor·vasopressor | 위와 같이 고칩니다(W17) |

## 사실 오류·심각한 문제

1. **18 [3] 원인 단정(안전).** 의식이 없는 환자의 원인을 혈당으로 단정합니다. 저혈당 상황이라도 확인 전에는 다른 원인(뇌졸중·과진정 등)을 열어 두어야 합니다. v46 why가 이 단정을 정당화합니다.
2. **S10 slider why(안전).** 포도당을 같이 넣으며 혈당 190까지 내려온 장면입니다. 그런데 "시간당 60 하락은 목표(50~75) 안이라 안전한 속도"라고 가르칩니다. 포도당을 더한 뒤 목표는 혈당을 약 150~200에 **유지**하는 것입니다(ADA). 계속 시간당 60씩 내려가면 곧 저혈당 쪽으로 갑니다.
3. **6 [3] "sliding scale"(사실).** DKA 인슐린 점적을 피하 교정 인슐린 용어로 부릅니다. v46 why도 같은 설명을 되풀이합니다. 점적 프로토콜과 sliding scale을 혼동하게 가르칩니다.
4. **8 [4] 간호사가 인슐린 전환을 약속(업무 범위).**
5. **KP 7 [1] "slow the insulin if potassium keeps falling"(사용자 결정).** 칼륨이 내려가면 보충하고, 기준(보통 3.3 미만) 아래로 떨어지면 인슐린을 **보류**합니다. 속도를 줄이는 것은 표준이 아닙니다.
6. decoyChips 비속어 `sod`(w-sodium), 성병 은어 `clap`(w-clear). distractorsEn에 장례 연상 `urn`(w-urine)이 있습니다.

## 고칠 것

문장 en을 고치면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 둘·`blank`)를 **새 문장에 맞춰 다시 씁니다**.
그 문장을 example로 쓰는 단어의 `example`·`exKo`도 바꿉니다.

### 문장 (KP 아님, en·ko·chunks 고침)

- **S1 [안전] 심한 저혈당 의식소실 위기 #3** · 확인 전 단정 →
  en `He was drowsy and now he's completely unresponsive, so his sugar may be critically low.`
  ko `졸려하시더니 지금은 아예 반응이 없으셔서, 혈당이 위험할 정도로 낮을 수 있어요.`
  chunks `["He was drowsy", "and now he's completely unresponsive,", "so his sugar may be", "critically low", "."]`
  words 그대로. v46 새로 씁니다. why는 "'may be'는 확인 전의 추정이라 바로 혈당을 재서 확인한다"는 뜻으로 쓰고, must 설명은 지웁니다. distractorsKo 둘도 새 ko에 맞춥니다. w-drowsy·w-critically의 exKo도 바꿉니다.
- **S2 [업무 범위] anion gap 종결 판단 #4** · 전환 결정은 처방자 →
  en `Once he's tolerating food, I'll ask the team about switching him to his home insulin.`
  ko `식사를 잘 견디시면, 평소 쓰시던 인슐린으로 바꿀지 팀에 물어볼게요.`
  chunks `["Once he's tolerating food,", "I'll ask the team", "about switching him", "to his home insulin", "."]`
  (지금 chunk `to his home / insulin`이 명사구를 끊은 것도 같이 바로잡힙니다.)
  words `[w-tolerate, w-ask, w-switch, w-insulin]`(w-ask는 은행에 이미 있습니다. 넣지 않아도 됩니다). v46 새로 씁니다. 지금 distractorsKo의 "사수가/선임이 바꿔 드려요"는 새 문장과 맞지 않습니다. w-tolerate의 example·exKo도 바꿉니다.
- **S3 [사실] DKA 인슐린 주입 적정 #3** · 점적을 sliding scale이라 부름 →
  en `We're following the insulin protocol exactly as ordered.`
  ko `처방된 대로 인슐린 프로토콜을 정확히 따르고 있어요.`
  chunks `["We're following", "the insulin protocol", "exactly as ordered", "."]`
  words `[w-follow, w-insulin, w-protocol, w-order]`. w-scale은 이 문장에서만 쓰이고 뉘앙스도 가리키지 않으므로 word-remove합니다(S6은 그래도 서로 다른 단어 19개). v46 새로 씁니다. why의 sliding scale 설명은 지우고 blank `sliding`도 바꿉니다. w-follow의 example·exKo도 바꿉니다.
- **S4 [사실·권고] HHS 고삼투 관리 #3** · 나트륨만 말함 →
  en `Correcting her sugar and sodium too quickly could cause brain swelling, so we go slowly.`
  ko `혈당이랑 나트륨을 너무 빨리 교정하면 뇌부종이 생길 수 있어서, 천천히 하고 있어요.`
  chunks `["Correcting her sugar and sodium", "too quickly", "could cause brain swelling,", "so we go slowly", "."]`
  words에 w-sugar를 더합니다. v46: distractorsKo 둘을 새 ko 틀로 바꿉니다(폐부종/탈수 자리는 그대로 둬도 됩니다). 이 문장을 example로 쓰는 w-sodium·w-swell·w-cause의 example·exKo도 바꿉니다.
- **S5 교정속도 뇌부종 위험 인지 #3** · "correct him"이 부자연스럽습니다(교정하는 것은 수치) →
  en `If we correct his numbers too fast, the swelling risk goes up.`
  ko `수치를 너무 빠르게 교정하면 부종 위험이 올라가요.`
  chunks `["If we correct his numbers", "too fast,", "the swelling risk", "goes up", "."]`
  words에 w-number를 더해도 됩니다. v46은 distractorsKo 둘을 새 ko 틀로 바꿉니다.
- **S6 부신위기 순환붕괴 #3** · 관사 빠짐 →
  en `His pressure crashed suddenly, so this looks like a true adrenal crisis.`
  chunks `["His pressure crashed suddenly,", "so this looks like", "a true adrenal crisis", "."]`
  (지금 `like true adrenal / crisis`가 명사구를 끊었습니다.) ko는 그대로입니다. v46 decoy·blank가 새 chunk와 맞는지 확인합니다. w-crash의 example도 새 en으로 바꿉니다.
- **S7 (선택) 부신위기 순환붕괴 #4** · "The pressor is titrating up"은 차트 말투입니다. 말로 하면 →
  en `We're titrating the pressor up, and his pressure is starting to respond.`
  chunks `["We're titrating the pressor up,", "and his pressure", "is starting", "to respond", "."]`. ko는 그대로입니다. 고치면 v46도 확인합니다.

### chunks만 (KP 아님, en·ko 그대로, 구 경계)

- **C1** DKA 초기 사정 #3: `["I'll ask you", "a few questions", "to check", "how alert you are", "."]`
- **C2** 인슐린 주입 준비 #3: `["Pump's set", "to the protocol rate,", "ready to go", "."]`
- **C3** 인슐린 전 K 확인 #4: `["If potassium comes back low,", "I'll get the replacement ordered", "right away", "."]`
- **C4** 활력·의식 재평가 #4: `["I'm charting", "these improvements", "and letting the team know", "."]`
- **C5** 점액수종 관리 #4: `["As the hormone takes effect,", "her energy and temperature", "should slowly improve", "."]`
- **C6** DKA 뇌부종 급변 위기 #4: `["The doctor is on the way,", "and I'm staying", "right at his side", "."]`
- **C7 (선택)** 점액수종 혼수 위기 #3: `["She won't respond", "and she feels ice cold,", "so this is critical", "."]`

chunk를 바꾼 문장은 v46 `decoy`가 새 청크 자리를 대신하지 않는지 확인합니다.

### keyPhrase 문장 — ko만 고침 (결정 11, en은 아래 '사용자 결정')

ko를 고친 문장은 distractorsKo 둘을 새 ko 틀에 맞춰 다시 씁니다. 그 문장을 example로 쓰는 단어의 exKo도 바꿉니다.
- **K1 DKA 초기 사정 #1** · "삼킬 수 있었어요"는 keep down(토하지 않고 넘기다)과 다름 →
  ko `오늘 물이나 음료를 토하지 않고 넘기실 수 있었어요?` (distractorsKo는 지금처럼 시간 자리만 바꿉니다: 어젯밤/이틀 동안)
- **K2 DKA 인슐린 주입 적정 #1** · 환자에게 '적정' →
  ko `너무 빨리 내리면 위험할 수 있어서, 조심스럽게 조금씩 맞추고 있어요.`
- **K3 anion gap 종결 판단 #0** · '간극이 닫혀서'는 직역 →
  ko `음이온차가 정상으로 돌아와서, 이제 피하 인슐린으로 전환할 계획을 세울 수 있어요.`
  w-gap·w-close·w-plan·w-switch·w-subcutaneous의 exKo도 바꿉니다. (B 몫 참고: why의 '간극이 닫힘'도 같이 고칩니다.)
- **K4 부신위기 스테로이드 투여 #2** · "스트레스 수준이 필요로 하면"이 어색하고 심리 스트레스로 들림 →
  ko `계속 지켜보다가 몸이 받는 스트레스가 커지면 더 드릴 거예요.`
- **K5 내분비 위기 다장기 악화 #2** · "치료를 상급으로 올리면서"가 어색함 →
  ko `치료 단계를 올리면서 침상 곁에 계속 있을게요.`
- **K6 (선택) 교정속도 뇌부종 위험 인지 #1** · ko `천천히, 꾸준히 가는 것이 사실 가장 안전하게 도와드리는 방법이에요.`

### 뉘앙스

- **N1 [안전] 저혈당 예방·포도당 병용 · slider(w-fast·w-drop)** · 포도당을 넣는 중에 '계속 60씩 하락'을 안전하다고 함 →
  cue `Glucose went from 310 to 250 in an hour on the insulin drip.`
  why `시간당 60 정도 하락은 많은 프로토콜의 목표(시간당 50~75 mg/dL) 안이라 at a safe pace예요. 혈당이 기준치(보통 250)에 이르면 프로토콜대로 포도당을 더해 150~200 정도로 유지하고, 인슐린은 케톤이 없어질 때까지 계속해요.`
- **N2 혈당·케톤·ABG 모니터 · slider(w-level)** · `rising`은 약함→강함 척도에 들지 않습니다. 480→360은 시간당 120이라 S6 why 기준으로 목표보다 빠릅니다 →
  cue `Glucose read 300, then 240, then 185 on three hourly checks.`
  scale `[drifting down, falling steadily, dropping suddenly]`, answerAt 1
  why `시간당 55~60씩 고르게 내려가면 falling steadily예요. drifting down은 아주 조금씩, dropping suddenly는 한 번에 크게 떨어질 때예요. 시간 순서로 이어 보면 치료 반응이 보여요.`
- **N3 수액 소생 시작 · slider(w-quickly)** · cue의 `fast`가 정답의 동의어이고, `steadily`는 빠르기의 중간이 아님 →
  cue `Order: bolus the first liter in the first hour, then slow the rate.`
  scale `[slowly, moderately, quickly]`, answerAt 2. why는 그대로 둬도 됩니다.
- **N4 교정속도 뇌부종 위험 인지 · slider(w-risk)** · cue `Her sodium…`인데 상황의 환자는 남자 → `His sodium and sugar are coming down as planned, and his alertness hasn't changed.`
- **N5 (선택) K 보정·인슐린 균형 · slider(w-fall)** · 가운데 `falling fast`와 끝 `dropping sharply`가 거의 같은 말 → scale `[drifting down, falling steadily, dropping sharply]`(answerAt 0 그대로).
- **N6 [핸드오프 모양] 수액 소생 시작 · context(lose)** · 세 장면 모두 `lost`라 `word: lose`가 장면에 없음 → `word: lost`, ko `잃었다`.
  또는 세 장면 en을 `lose`/`losing`으로 다시 씁니다.
- **N7 [핸드오프 모양] DKA 뇌부종 급변 위기 · context(escalate)** · 2·3번 장면이 `escalating` →
  장면 2 en `I'm calling to escalate: he went from talking to barely responding.`
  장면 3 en `We need to escalate his level of care per rapid response criteria.`(fix는 그대로)
- **N8 유발원인 동반 치료 · swap(w-infection)** · ko "시작의 원인이 됐을 수 있는"이 어색함 → `이번 일을 일으켰을 수 있는 감염이 있는지 검사하고 있어요`.
  상황이 가족 장면이라 who를 `가족에게 · 검사 이유`로 바꿉니다.
- **N9 (선택) 교정속도 뇌부종 위험 인지 · swap(w-swell)** · 가족 장면인데 who가 `환자에게`이고 정답이 `in your brain` →
  who `가족에게 · 천천히 하는 이유`, 정답 `swelling in his brain`(options·answer·notes 키 함께).
- **N10 [사실] 수액 소생 시작 · swap(w-saline)** · notes의 `a volume expander`가 "다른 종류의 약(혈장 증량제)처럼"이라 했는데, 생리식염수도 volume expander입니다 →
  `수액을 가리키는 전문 용어라 환자는 무엇을 넣는지 알기 어려워요.`
- **N11 [사실] 부신위기 스테로이드 투여 · swap(w-hormone)** · notes의 glucocorticoid는 '약물 계열'이 아니라 코르티솔이 속한 호르몬 계열 →
  `호르몬 계열을 가리키는 전문 용어라 가족은 알아듣기 어려워요.`
- **N12 내분비 위기 다장기 악화 · context(update)** · 세 장면 모두 명사 update인데 ko가 `알려주다` → ko `경과 알림`.

### 단어 (결정 11 — ko·cue·태그·오답)

- **W1 w-clear** · 뜻이 다섯 갈래 → 7.3("clear to")·10.1·10.4("clearing the ketones")·20.1("clear update")에서 태그를 뺍니다
  (S7·S10·S20은 서로 다른 단어 20개 안팎이 남고, w-clear를 가리키는 뉘앙스는 S5뿐입니다). ko는 `맑은` 그대로 둡니다
  (남는 5.0·9.4가 '맑은/맑아지다' 한 뜻이고, 늘리면 오답 `축축한`·`어두운`과 길이 규칙이 깨집니다).
  오답 `clerk`(명사)는 `clever`로, decoy `clap`(성병 은어)은 `clan`으로 바꿉니다.
- **W2 w-keep** · 0.1 "keep … down"에서 태그만 뺍니다. ko `유지하다`는 그대로 둡니다(keep watching·keep you safe를 덮고, 늘리면 길이 규칙이 깨집니다).
  example은 `I'll keep watching your blood pressure and urine as the fluids go in.`(2.1)로 바꾸고 exKo도 함께 바꿉니다.
- **W3 (기록만) w-slow** · 형용사·동사·부사가 섞였지만 w-fast `빠른`과 같은 처리로 ko `느린`을 그대로 둡니다. 고칠 것에 세지 않습니다.
- **W4 w-cause** · ko `원인(이 되다)`, distractorsKo `[결과(가 되다), 증상(이 나타나다)]`.
- **W5 w-monitor** · 13.3 "on the monitor"에서 태그를 뺍니다. 오답 `motor`(명사)는 `muster`로 바꿉니다.
- **W6 w-escalate** · 20.2 "escalating his care"는 보고가 아니라 치료 단계를 올리는 뜻 → ko `(상급에) 올리다`,
  cue `혼자 해결하지 않고 윗선에 알리거나 치료 단계를 한 칸 올릴 때`, distractorsKo `[(뒤로) 미루다, (혼자) 처리하다]`.
  15.3 문장 ko와 S15 context ko(`상급 보고하다`)는 그대로 둡니다.
- **W7 w-look** · 구동사 → en `look for`, ipa `/lʊk fɔːr/`, chips `[[look], [for]]`, distractorsEn `[look after, look over]`, decoyChips `[lock, fur]`.
- **W8 w-weigh** · 구동사 → en `weigh in`, ipa `/weɪ ɪn/`, chips `[[weigh], [in]]`, distractorsEn `[weigh on, wait in]`, decoyChips `[weight]`.
- **W9 w-fluid** · 0.1(마실 것)·2.0(체액)·2.1(수액)에 다 쓰이는데 ko가 `수액` → ko `수분·수액`.
- **W10 w-steady** · ko `일정한·꾸준한`.
- **W11 w-first** · "at first"·"the first … dose"까지 덮도록 → ko `먼저·처음`.
- **W12 w-take** · ko `걸리다`는 "take our time"·"takes effect" 어느 쪽과도 맞지 않음 → ko `(시간을) 들이다`. 13.4 "takes effect"에서 태그를 뺍니다.
  distractorsKo `[(시간을) 줄이다, (시간을) 재다]`.
- **W13 w-sign** · 0.4 징후·5.2 "a good sign" 신호 → ko `징후·신호`.
- **W14 w-bring** · distractorsKo `가라앉히다`는 "bring it down / under control"과 겹쳐 정답이 됨 → `[붙잡다, 흘려보내다]`.
  distractorsEn `brew`(술 연상)는 `brim`으로 바꿉니다.
- **W15 w-run** · distractorsKo `걸려 있는 중이다`는 수액이 "걸려 있다"(= 들어가고 있다)와 같은 뜻 → `새고 있는 중이다`.
  오답 `rug`(명사)는 `ruin`으로 바꿉니다.
- **W16 w-update** · 명사 1·동사 1인데 ko가 동사 → ko `경과를 알리다`.
- **W17 w-pressor / w-vasopressor** · pressor ko `승압제(줄임말)`, distractorsKo `[이뇨제(줄임말), 진정제(줄임말)]`; vasopressor ko `혈관수축제`.
- **W18 w-concentrate** · en이 형용사 `concentrated`인데 ko가 동사 → ko `농축된`, distractorsKo `[오염된, 수축된]`.
- **W19 w-work** · distractorsKo `[주사를 놓다, 값을 매기다]`는 장면과 동떨어짐 → `[내성이 생기다, 부작용이 나다]`.
- **W20 w-gap** · distractorsKo `[동맥혈 차이, 혈압 차이 수치]`는 쓰지 않는 말 → `[삼투압 간극, 폐포-동맥 산소차]`.
- **W21 w-sodium** · decoyChips `sod`(비속어) → `sol`.
- **W22 w-urine** · distractorsEn `urn`(유골함, 장례 연상) → `urea`.
- **W23 (선택) w-stat** · "a stat glucose"는 형용사 쓰임인데 ko `당장 시행`은 명사 → `즉시 시행의`, distractorsKo `[정기 시행의, 보류 지시의]`.
- **W24 (선택) w-sudden** · 17.3 "crashed suddenly"(부사)까지 덮게 → ko `갑작스러운(갑자기)`, distractorsKo `[서서히 오는(서서히), 변함없는(그대로)]`.

### distractorsEn — 품사가 다른 오답 (★ 꼭 바꿀 것)

| id | 정답(품사) | 문제 오답(품사) | 바꿀 말 |
|---|---|---|---|
| ★ w-check | check(동) | cheek(명) | chuck |
| ★ w-alert | alert(형) | alarm(명), alter(동) | inert, alike |
| ★ w-fluid | fluid(명) | fluent(형) | flux |
| ★ w-safe | safe(형) | save(동) | same |
| ★ w-tell | tell(동) | tall(형) | yell |
| ★ w-work | work(동) | word(명) | worry |
| ★ w-move | move(동) | mode(명) | mold |
| ★ w-mean | mean(동) | meal(명) | lean |
| ★ w-pressure | pressure(명) | preserve(동) | posture |
| ★ w-trouble | trouble(명) | tremble(동) | rubble |
| ★ w-pump | pump(명) | plump(형) | plume |
| ★ w-hold | hold(동) | hole(명) | hone |
| ★ w-pull | pull(동) | pill(명), pool(명) | poll, peel |
| ★ w-clear | clear(형) | clerk(명) | clever (W1) |
| ★ w-heart | heart(명) | heard(동) | heat |
| ★ w-pace | pace(명) | pale(형) | pact |
| ★ w-monitor | monitor(동) | motor(명) | muster (W5) |
| ★ w-run | run(동) | rug(명) | ruin (W15) |
| ★ w-stable | stable(형) | table(명) | able |
| ★ w-affect | affect(동) | effect(명) | infect (effect는 decoyChips 쪽 재료) |
| ★ w-effect | effect(명) | affect(동) | defect |
| ★ w-mental | mental(형) | metal(명) | menial |
| ★ w-treat | treat(동) | trait(명) | cheat |
| ★ w-give | give(동) | gift(명) | live |
| ★ w-temperature | temperature(명) | temporary(형) | temperance |
| ★ w-warm | warm(동) | worm(명) | swarm |
| ★ w-fever | fever(명) | fewer(형) | fervor |
| ★ w-adrenal | adrenal(형) | adenoid(명) | atrial |
| ★ w-blood | blood(명) | blond(형) | brood |
| w-ask | ask(동) | task(명, 동사 드묾) | (선택) bask |
| w-catch | catch(동) | cache(명 주로) | (선택) latch |
| w-pause | pause(동) | pulse(명 주로) | (선택) poise |
| w-dose | dose(명) | doze(동 주로) | (선택) dome |
| w-stat | stat(형) | slat(명) | (선택) flat |
| w-result | result(명) | resume(악센트 없이 쓰면 동사로 읽힘) | (선택) recall |
| w-switch | switch(명·동) | swatch(명) | (선택) twitch |

정답으로도 맞는 distractorsEn은 찾지 못했습니다(urgently/cautiously, quickly/quietly, help/heal은 영어로는 되지만 뜻이 달라 정답이 되지 않습니다).

### decoyChips — 비속어·불쾌·술·장례

| id | 조각 | 판정 | 바꿀 말 |
|---|---|---|---|
| ★ w-sodium | sod | 영국 비속어 | sol (W21) |
| ★ w-clear | clap | 성병 은어(the clap) | clan (W1) |
| w-protocol·w-potassium | pot | 대마 은어. 판단 | pod / pat |
| w-dangerous | dam | damn과 소리가 같음. 판단 | dan |
| w-number | bar | 술집. 판단 | bur |
| w-recheck | rye | 위스키. 판단 | rue |
| w-mean·w-hormone | moan | 가벼운 성적 연상. 판단 | mean→mown, hormone→mode |
| (distractorsEn) w-urine | urn | 유골함 | urea (W22) |
| (distractorsEn) w-bring | brew | 술 빚기 | brim (W14) |

`lie`(6번)·`cry`(3번)·`mad`는 흔한 말이라 그대로 둬도 됩니다.

### swap 이어 읽기 · context 핸드오프 모양 (확인 결과)

- swap 21문항은 before+선택지+after의 문법이 모두 맞습니다. 정답을 넣어 같은 말이 되풀이되는 문항은 없습니다. swap ko는 N8(어색)·N9(who) 말고는 정확합니다.
- context 21문항은 모두 "같은 뜻 · 듣는 사람이 안 맞는 자리"(의료진 말을 환자·가족에게) 모양입니다. 고칠 것은 `word`가 장면에 없는 2문항(N6·N7)과 ko 1문항(N12)입니다.

## keyPhrase 문장 — 사용자 결정 필요 (en은 고치지 않음)

| 문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 18 [0] | Check a stat glucose and push D50 now — he's unresponsive. | 혈당 결과 전에 D50을 주는 순서로 읽힘. 프로토콜 경유가 드러나지 않음 | Check a stat glucose, and if he's low, push D50 per protocol — he's unresponsive. | **바꿈** |
| 7 [1] | We may need to slow the insulin if potassium keeps falling. | 칼륨이 내려가면 보충하고, 기준 아래면 인슐린을 '보류'함. 속도를 줄이는 것은 표준이 아님 | We may need to hold the insulin if potassium falls below the protocol limit. (w-slow 대신 w-hold 태그. 7.1을 example로 쓰는 w-slow·w-need의 example도 바꿈) | **바꿈** |
| 12 [2] | We'll keep monitoring and give more if his stress level demands it. | 추가 투여는 처방 판단. 가족에게 'stress level'이 감정으로 들림 | We'll keep monitoring and give more as ordered if his body needs it. | 바꿈(낮은 우선). 유지하면 ko만 고침(K4) |
| 17 [0] | Let's push the stress-dose steroid and start a pressor together now. | 처방 경유가 드러나지 않음 | Let's push the ordered stress-dose steroid and start the pressor together now. | **유지**(동료 사이 제안형, 장면 brief와 맞음) |
| 6 [1] | Bringing it down too fast can be risky, so we titrate carefully. | 환자에게 titrate. 이 주제의 swap·context가 하지 말라고 가르치는 말 | Bringing it down too fast can be risky, so we adjust it carefully. | **유지**. S6 context(w-titrate)가 이 문장 하나에만 걸려 있어, 바꾸면 그 문항의 words도 다시 매야 함. ko만 고침(K2) |
| 1 [0] | We check your sugar, your ketones, and your blood acid every hour to keep you safe. | 혈당은 매시간이지만 케톤·산도는 보통 2~4시간마다 | We check your sugar every hour, and your ketones and blood acid often, to keep you safe. | 유지(프로토콜마다 다르고 해가 적음) |
| 18 [2] | Recheck the sugar in a few minutes and stay ready to repeat. | 대부분 프로토콜은 D50 15분 뒤 재측정 | Recheck the sugar in 15 minutes and stay ready to repeat. | 유지(일찍 재는 쪽이라 해가 없음) |
| 17 [2] | Call the intensivist — this is a true adrenal crisis. | 간호사가 진단을 단정 | Call the intensivist — this looks like a true adrenal crisis. | 유지 |

**keyPhrase chunks 구 경계(보고만)**: 2.0 `You lost a lot / of fluid,` · 3.2 `once potassium is confirmed / safe` ·
7.0 `with the insulin / running` · 8.1 `with the first / long-acting dose` · 11.1 `from coming / back` ·
14.0 `can cause dangerous / brain swelling` · 16.0 `and racing / heart` · 20.2 `and staying right / at his bedside`.

## 종합

안전 문제 2건(18.3 단정·S10 slider 목표)과 사실·업무 범위 문장 3건(6.3·8.4·9.3), 비속어 조각 2개를 고치면 내보내도 됩니다.
KP 18.0·7.1은 사용자 결정을 권합니다. 고칠 것은 필수 74건(그중 안전 2)입니다: 문장 6·chunks 6·KP ko 5·뉘앙스 10·단어 21·품사 ★ 26(W와 겹치는 3개 뺌). 선택 항목 7건은 따로 표시했습니다(W3은 기록만).
