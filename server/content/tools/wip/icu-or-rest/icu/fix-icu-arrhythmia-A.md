# icu-arrhythmia — A 검토 (v45 1~7 + 기계적 전수 + context 모양·swap ko)

대상: `icu-arrhythmia.yaml`(단어 267 · 상황 21 · 문장 126 · 뉘앙스 42 = slider 15 · pair 5 · context 17 · swap 5).
비교: `base-icu-arrhythmia.yaml`, `changes-icu-arrhythmia.yaml`(변경 66건), `in-icu-arrhythmia.json`, `notes-icu-arrhythmia-A.md`·`-B.md`.
스크립트로 전부 뽑아 본 것: 단어 267개 전 필드(길이 1.25배·3자 규칙은 전부 통과), 문장 126개 chunks, pair 5개 전 결합 41줄,
swap 5개 × 선택지 15줄, context 17개 세 장면의 `word` 포함(17/17), distractorsEn 품사, cue에 `ko`가 그대로 들어간 것,
decoyChips 전부(비속어 관점 포함).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 소리·철자 닮은 오답은 대체로 좋음. 그러나 품사가 다른 오답 59개 단어, 정답으로도 맞는 오답 2(`reply`·`protein`), 철자 오류 1(`infusionpump`) |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 전부 통과. 정답의 다른 뜻을 오답으로 쓴 것 4(`그래프`·`회신하다`·`단백질`·`뇌졸중 경보 호출`), 품사가 어긋난 오답 뜻 다수(표 W-1에 같이) |
| 3 | cue | 3 | 정답 영어 노출 없음. 그러나 `ko`를 거의 그대로 되풀이한 cue 33개(`세다`→"수를 하나씩 세다", `먹다`→"음식을 입으로 먹다") |
| 4 | chips/decoyChips | 4 | 대체로 형태소 단위. 오타 decoy `ac.cept` 1, 형태소가 아닌 자르기 2(`str+aight`·`str+ange`), 뜻 없는 decoy 조각(`stra`·`ght`·`ng`·`rou`·`gh`). **비속어·불쾌한 조각 없음**(decoy 전부 확인: `beer`·`sin`·`gal`·`pals`·`mad` 정도로 문제없음. 정답 칩 `bra`+`dic`(bradycardic)은 형태소대로 자른 것이라 둠) |
| 5 | 뉘앙스·문장 사실 | 3 | ACLS 핵심(불안정 빈맥 → 동기화 심율동전환, 서맥 → 아트로핀 → 경피 페이싱, VF → 제세동·즉시 CPR 재개, epi 3~5분, 아미오다론 150 mg/10분, TdP → 마그네슘·QT 연장 약 중단)은 맞음. 틀린 것: QTc slider why(500ms를 prolonged 기준처럼 씀), ICD slider(단서가 정답 둘), 문장 "sudden drop … is never artifact", "only fires if your heart needs it", 페이싱 why("역치를 겨우 넘는 정도") |
| 6 | 뉘앙스 설계 | 3 | slider 정답 위치는 고름(0:3·1:6·2:6). pair 정답 둘 1(`deliver a midnight meal`), context에서 ok 장면과 ✕ 장면의 듣는 사람이 같은 것 2, ✕ 장면의 `fix`가 같은 `word`를 같은 듣는 사람에게 다시 쓰는 것 2, 성별이 바뀐 장면 1, context `ko`가 장면의 품사와 다른 것 1. swap 5개는 이어 읽기·`ko` 모두 맞음 |
| 7 | v44 정리(결정 11) | 3 | 쉬운 단어 19개 삭제·ko 10개 변경은 타당(`w-skip` 두근거리다→건너뛰다는 좋은 수정). 그러나 틀린 ko 5(`away` 당장, `artifact` 인공음영, `noise` 소음, `replace` 교체하다, `bowel` 배변의), 구동사를 반쪽만 헤드워드로 둔 것 3(`bear`·`rule`·`board`), `notify`와 `ko`가 같은 `update`, 남은 쉬운 말 `eat`·`drink`를 놓침. 사실이 아니거나 지킬 수 없는 문장 4, 구 경계를 끊은 chunks 26문장 |

## 사실 오류·심각한 문제

1. **`텔레메트리 경보 응답` 문장 4 "But a sudden drop in heart rate is never artifact."** — 사실이 아님(안전). 리드 이탈·접촉 불량으로 가짜 서맥·무수축 알람은 실제로 뜹니다. 문장이 가르치는 원칙은 "가짜라고 **단정하지 않고** 환자부터 본다"인데, 지금 말은 "급격한 심박 저하는 항상 진짜"라는 틀린 사실입니다. keyPhrase 아님 → 고침(D-11). 저작자 메모 A의 지적이 맞습니다.
2. **`페이스메이커·ICD 환자 모니터` 문장 3 "Your defibrillator only fires if your heart needs it."** — 지킬 수 없는 약속. ICD는 빠른 상심실성 리듬·리드 잡음을 VT/VF로 잘못 읽어 부적절 쇼크를 줄 수 있습니다(ICD 환자의 의미 있는 비율). keyPhrase 아님 → 고침(D-12).
3. **`경정맥 임시 페이싱 관리` 문장 1 `why` "a bit above는 역치를 겨우 넘는 정도라는 뜻 — 안전한 여유를 두되 과하지 않게"** — 임시 경정맥 페이싱 출력은 보통 캡처 역치의 2~3배(또는 병원 프로토콜의 여유)로 둡니다. "겨우 넘는 정도"로 설정하면 역치가 조금만 올라도 캡처를 잃습니다(안전). 문장 `en`은 keyPhrase라 사용자 결정(아래), `why`는 지금 고침(S-1).
4. **`QT 연장 약물 감시` slider why "QTc가 500ms를 넘으면 … 따로 prolonged라고 알려요"** — prolonged의 기준은 대략 남성 >450ms·여성 >460~470ms이고, **>500ms는 '심하게 연장·고위험'** 기준입니다. 지금 why는 450~500 구간을 prolonged가 아닌 것처럼 읽힙니다(N-1).
5. **`K·Mg 전해질 채혈` 문장 3 "These rhythms are often electrolyte-driven, not structural."** — 결과도 나오기 전에 구조적 원인을 배제하는 말입니다. 같은 주제의 `부정맥 유발 허혈 감별`이 바로 그 배제를 다룹니다. 문장 `why`도 "심장 구조 문제는 아니다 … 걱정을 덜어 줘요"라고 안심 문장으로 설명합니다(동료에게 하는 말인데). 고침(D-14).

저작자 메모 A 판정:
- 상황 5 문장 4 never artifact — **타당, 고침**(위 1).
- 상황 12 문장 1 "won't feel the shock" — **타당, 그러나 keyPhrase → 사용자 결정**(아래 K-1).
- 상황 13 문장 1·3 — 문장 3은 **타당, 고침**(위 2). 문장 1은 keyPhrase → 사용자 결정(K-2).
- 상황 11 문장 1 "a bit above" — **타당, keyPhrase → 사용자 결정**(K-3), why는 지금 고침.
- 상황 7 문장 0 bearing down — **오류 아님, 그대로**(Valsalva 환자 설명의 표준 표현).
- 상황 18 문장 4 "two grams of magnesium over a few minutes" — **판정: 고치지 않음.** AHA는 심정지 TdP에 1~2 g을 희석해 빠르게(수 분 안), 맥이 있으면 5~60분에 걸쳐 주라고 합니다. 이 상황은 "push magnesium, stat!"으로 시작하는 급변 장면이라 "a few minutes"가 틀렸다고 단정할 수 없습니다. 다만 B의 오답 뜻·빈칸에서 속도를 더 빠르게 바꾸는 오답은 쓰지 말 것.
- 상황 17 문장 4 "won't support his blood pressure much longer" — **그대로.** 이 상황의 상대는 동료(role=colleague)라서 단정이 맞습니다.

저작자 메모 B: 문장 오답 뜻은 B 범위라 판정하지 않음. 다만 아래에서 `ko`를 바꾸는 문장(D-11~D-18)은 그 문장의 `distractorsKo` 둘을 새 `ko`에 맞춰 다시 써야 합니다.

---

## 사용자 결정 필요 — keyPhrase 문장 (`en`은 고치지 않음)

**K-1** `예정 심율동전환 준비` 문장 1 "You'll get sedation, so you won't feel the shock." — "won't feel"은 보장입니다. 진정이 얕거나 기억이 남는 환자가 있습니다. 대안: "You'll get sedation, so you shouldn't feel the shock." (`won't`→`shouldn't`, ko "진정제를 드릴 테니 전기충격은 거의 느끼지 않으실 거예요"). 바꾸면 chunks `, so you / shouldn't feel / the shock`, v46 필드(why·decoy·distractorsKo·blank) 다시.

**K-2** `페이스메이커·ICD 환자 모니터` 문장 1 "If it fires, it's doing its job to protect you." — 부적절 쇼크가 있어 "작동하면 언제나 제 일을 한 것"은 사실이 아닙니다. 같은 상황 문장 5("we'll check on you and record what happened")가 이미 확인을 말하므로 덜 위험하지만, 대안: "If it fires, it's most likely doing its job to protect you." ko "작동하면 대개는 보호하려는 제 역할을 하는 거예요".

**K-3** `경정맥 임시 페이싱 관리` 문장 1 "Let me set the output a bit above the capture threshold." — 실무 여유는 역치의 2~3배(프로토콜). "a bit above"는 여유가 부족하게 들립니다. 대안: "Let me set the output with a safe margin above the capture threshold." ko "출력을 캡처 역치보다 안전한 여유를 두고 설정할게요". 이 경우 `w-bit`·`w-above` 중 `w-bit` 태그가 빠지고 `w-margin`은 은행에 없으니 새로 만들지 않으면 `w-above`만 남깁니다(상황 단어 수 21 → 20, V3 문제없음). **결정과 별개로 이 문장의 `why`는 지금 고칩니다**(S-1).

**K-4**(낮음) `예정 심율동전환 준비` 문장 0 "We'll confirm your blood thinner has been at the right level." — 와파린(INR)에는 맞지만 요즘 흔한 DOAC는 '수치'가 아니라 3주 이상 빠짐없이 먹었는지를 확인합니다. 틀린 말은 아니어서 그대로 둬도 됨. 대안: "We'll confirm you've been taking your blood thinner as prescribed."

**keyPhrase chunks — 구 경계를 끊은 것(보고만):**
| 상황 · 문장 | 지금 chunks | 끊긴 곳 |
|---|---|---|
| 새 부정맥 인지·기록 [1] | Let me compare it / to his baseline / tracing | `his baseline tracing` 명사구 |
| 새 심방세동 RVR 관리 [0] | She's in / a-fib with / a rate / in the 150s | `with a rate` |
| 서맥·전도차단 관리 [0] | He's bradycardic / with a heart / block / into the 40s | `heart block` |
| 부정맥 유발 허혈 감별 [1] | We need to / rule out / ischemia as / the trigger | `as the trigger` |
| 무맥성 VT·VF 제세동 [1] | Charge to / 200 and / clear | `200 and` |
| 완전방실차단 심정지 임박 [0] | He's in / complete heart block / with a dangerously / slow rate | `a dangerously slow rate` |
| 완전방실차단 심정지 임박 [2] | I'm calling / for transvenous / pacing backup | `transvenous pacing backup` |
| TdP 급변 마그네슘 응급 [0] | She's in torsades / — give IV / magnesium now | `IV magnesium` |
| 전기폭풍 반복 제세동 관리 [0] | He's had repeated shocks / — this is / an electrical / storm | `an electrical storm` |

---

## 고칠 것 — 안전·사실 (S)

**S-1** `경정맥 임시 페이싱 관리` 문장 1 · `why` · "역치를 겨우 넘는 정도 … 과하지 않게"는 실무와 반대(위 심각 3) · → "출력은 캡처 역치보다 여유를 둬야 해요 — 보통 역치의 2~3배, 수치는 오더·프로토콜대로. 역치는 시간이 지나며 올라갈 수 있어요." (keyPhrase `en`은 K-3 결정을 기다림. `en`이 바뀌면 why도 다시.)

(S-2~S-5는 아래 N-1, D-11, D-12, D-14에 있음 — 안전 항목 합계는 맨 아래 요약 참고)

## 고칠 것 — 뉘앙스 (N)

**N-1** `QT 연장 약물 감시` · slider · why 기준치 오류(안전) · → "QTc가 대략 남성 450ms·여성 460ms를 넘으면 prolonged, 500ms를 넘거나 60ms 넘게 늘면 토르사드 위험이 크게 올라 바로 보고해요. borderline은 그 경계 근처예요."

**N-2** `페이스메이커·ICD 환자 모니터` · slider · cue "a quick kick in the chest"가 정답 `jolt`와 셋째 칸 `blow` 둘 다에 맞고, why가 "제세동기가 작동하면 '가슴을 걷어차인 것 같다'"고 해 오히려 `blow`를 가리킴 · cue → `Patient: "It made me jump for a split second, but it didn't really hurt."`(answerAt 1 유지), why 끝 문장 → "ICD 쇼크는 '가슴을 세게 걷어차인 것 같다'(blow 쪽)고 말하는 환자가 많아요. 그래서 jolt 정도라도 바로 알려 달라고 해요."

**N-3** `예정 심율동전환 준비` · pair · decoy `a midnight meal`이 `deliver`에 붙음("deliver a midnight meal"은 자연스러운 영어 — 정답 둘) · decoy → `asleep`(어느 왼쪽 말에도 붙지 않음).

**N-4** `안정 SVT 미주신경·아데노신` · context `strange` · ok 장면("환자에게")과 ✕ 장면("환자에게 · 어려운 말")의 듣는 사람이 같아 "듣는 사람이 달라요"가 성립하지 않고, 어색함의 원인도 `strange`가 아니라 "asystolic pause" · `strange`가 맞지 않는 자리는 **차트**입니다(막연한 말). who·icon·ok·순서를 지키려면: 장면 3 who를 그대로 두지 말고 → 장면을 이렇게 다시: ① 환자에게 "It may feel strange for a few seconds, but it works fast." ✓ ② 가족에게 "He may feel something strange in his chest, and it passes quickly." ✓ ③ 차트 기록(icon board) "Pt felt strange after adenosine." ✕, fix "Adenosine 6 mg IV: 4-second pause, then sinus rhythm at 88; pt reported brief chest pressure." why → "환자·가족에게는 '이상한 느낌'이 쉬운 말이지만, 차트에는 무엇이 몇 초 있었는지 구체적으로 남겨요." (장면 3의 who·icon도 "차트 기록"·board로 바꿔야 함 — TASK 9 정비 범위 밖이니, who를 못 바꾸면 이 context는 지우지 말고 사용자에게 올릴 것)

**N-5** `페이스메이커·ICD 환자 모니터` · context `fire` · N-4와 같은 문제(ok 장면 2와 ✕ 장면 3이 둘 다 환자에게, 어색함은 "VT·VF·programmed rate") · word를 `jolt`(ko 찌릿함, words [w-jolt])로: ① 환자에게 "Tell me right away if you feel a shock or a jolt." ✓ ② 간호사 → 의사 "He says he felt a jolt around 0200 — I pulled the strip." ✓ ③ 차트 기록 "Device jolted patient x1 at 0200." ✕, fix "ICD shock delivered x1 at 0200; strip saved, physician notified." why → "jolt는 환자가 느낌을 말하는 구어라 환자와 대화에는 좋지만, 차트에는 'ICD shock delivered'처럼 사건으로 적어요." (장면 2·3의 who·icon 변경 — N-4와 같은 처리)

**N-6** `지속 심전도 모니터·리드 관리` · context `tracing` · ✕ 장면의 `fix`가 "…to get a clean tracing"으로 같은 말을 같은 환자에게 다시 씀(=tracing은 어색하지 않다는 뜻이 됨). 같은 상황 keyPhrase도 환자에게 tracing을 씀 · word를 `squiggle`(ko 삐뚤빼뚤한 선, words [w-squiggle])로: ① 간호사끼리 "That squiggle in lead II is just him moving his arm." ✓ ② 환자에게 "Some of that squiggle is just movement, not your heart." ✓ ③ 차트 기록 "Squiggle noted in lead II; rhythm unclear." ✕, fix "Motion artifact in lead II; underlying rhythm sinus." why → "squiggle은 환자·동료와 말할 때 쉬운 말이지만, 차트에는 motion artifact처럼 정확한 용어로 남겨요." (장면 순서·who·icon을 위에 맞출 것 — N-4와 같은 처리)

**N-7** `텔레메트리 경보 응답` · context `alarm` · N-6과 같은 문제(✕ fix "The alarm went off…"가 보호자에게 alarm을 그대로 씀) · word를 `artifact`(ko 아티팩트, words [w-artifact])로: ① 간호사끼리 "This one's real, not artifact." ✓ ② 야간 인계 "The 0300 alarm was artifact from a loose lead." ✓ ③ 보호자에게 "That alarm was just artifact." ✕, fix "That alarm went off because a wire came loose, and we checked on him right away." why → "artifact는 의료진끼리 '가짜 신호'를 짧게 말하는 용어라 보호자는 알아듣지 못해요. 왜 울렸는지와 이미 확인했다는 말로 풀어요."

**N-8** `불안정 빈맥 응급 심율동전환` · context `confused` · 장면 2(가족에게) "He's getting confused … his blood pressure"인데 이 상황 환자는 여성(She) · → "She's getting confused, which can happen when her blood pressure is low."

**N-9** `부정맥 유발 허혈 감별` · context `trigger` · `ko` "유발하다"(동사)인데 세 장면 모두 명사("as the trigger", "trigger unclear", "an ischemic trigger"). 또 ✕ 장면의 어색함은 `ischemic`에 있음 · 최소 수정: `ko` → "유발 요인". 권장: word를 `ischemia`(ko 허혈)로 — ① "We need to rule out ischemia as the trigger." ✓ ② "Ischemia workup in progress; troponin pending." ✓ ③ 환자에게 "We're checking you for ischemia." ✕, fix "We're checking whether your heart muscle is getting enough blood flow."

**N-10**(낮음) `항부정맥제 주입 준비` · context `rate` · 장면 2 "Heart rate 118; amiodarone infusing at the ordered rate."가 `rate`를 두 뜻(심박수·주입 속도)으로 씀 · → "Amiodarone infusing at the ordered rate; HR 118."

## 고칠 것 — 단어 재료 (W, v45)

**W-1 품사가 다른 distractorsEn — 전부**(정답 품사는 이 주제 문장에서 쓰인 품사). 대안은 길이 규칙 통과 확인함. 오답 뜻(`distractorsKo`)도 같은 품사로 맞춤(— 는 지금 것 유지).

| id | 정답(품사) | 문제 오답 | 바꿀 distractorsEn | 바꿀 distractorsKo |
|---|---|---|---|---|
| w-loosen | loosen(동) | loose(형) | lessen, listen | — |
| w-still | still(형/부) | steal(동) | stale, stiff | 뻣뻣하게, 느슨하게 |
| w-skin | skin(명) | skim·skip(동) | shin, scalp | 정강이, 두피 |
| w-change | change(동) | chance(명) | charge, chafe | 충전하다, 쓸리다 |
| w-grab | grab(동) | crab(명) | grip, grant | 쥐다, 승인하다 |
| w-flag | flag(동) | flat(형) | flap, flash | 펄럭이다, 비추다 |
| w-dose | dose(명) | does(동) | doze, drop | — |
| w-check | check(동) | chest·cheek(명) | chuck, chase | — |
| w-together | together(부) | tougher(형) | altogether, otherwise | — |
| w-sometimes | sometimes(부) | something·someone(명) | sometime, somewhat | — |
| w-tell | tell(동) | tall(형) | yell, call | — |
| w-short | short(형) | shock(명) | sharp, sore | — |
| w-result | result(명) | resolve·resume(동) | resort, residue | 휴양지, 잔여물 |
| w-often | often(부) | soften(동) | seldom, sooner | — |
| w-silence | silence(동) | science(명) | signal, sentence | — |
| w-signal | signal(동) | single(형)·signature(명) | sign, singe | 서명하다, 그슬리다 |
| w-alert | alert(명) | alter·avert(동) | alley, allergy | 골목, 알레르기 |
| w-start | start(동) | smart(형) | stare, starve | 중지하다, 굶다 |
| w-sign | sign(명) | sing(동) | sigh, site | 한숨, 부위 |
| w-give | give(동) | gift(명) | take, live | 받다, 살다 |
| w-ventricular | ventricular(형) | ventilator(명) | vascular, vesicular | 혈관의, 수포성의 |
| w-move | move(동) | mode(명) | remove, mount | 제거하다, 올라타다 |
| w-first | first(부) | fist(명) | fast, formerly | — |
| w-quick | quick(형) | quite(부) | quiet, quaint | — |
| w-medication | medication(명) | medical(형) | meditation, mediation | 명상, 중재 |
| w-strange | strange(형) | stranger(명) | straight, strong | 곧은, 강한 |
| w-skip | skip(동) | skin(명) | slip, skid | — |
| w-hold | hold(동) | hole(명) | fold, howl | — |
| w-pass | pass(동) | past(형/전) | parse, pace | — |
| w-place | place(동) | plate·plane(명) | plant, plead | — |
| w-pad | pad(명) | pat(동) | pod, pan | 꼬투리, 냄비 |
| w-interval | interval(명) | internal(형) | segment, interview | 분절, 면담 |
| w-treat | treat(동) | threat(명) | tread, trade | 밟다, 거래하다 |
| w-calm | calm(동) | clam(명) | claim, clamp | — |
| w-vein | vein(명) | vain(형) | artery, vine | — (`vain`은 decoyChips에 이미 있음) |
| w-secure | secure(동) | secret(명/형)·severe(형) | secrete, sever | 분비하다, 절단하다 |
| w-wire | wire(명) | wipe(동)·wide(형) | wine, tire | 포도주, 타이어 |
| w-loss | loss(명) | loose(형) | gain, moss | — |
| w-temporary | temporary(형) | temperature(명) | contemporary, temporal | 동시대의, 측두의 |
| w-permanent | permanent(형) | permit(동) | prominent, pertinent | 두드러진, 관련 있는 |
| w-lose | lose(동) | loose(형) | lure, lease | 꾀다, 빌려주다 |
| w-procedure | procedure(명) | proceed(동) | process, producer | 과정, 제작자 |
| w-job | job(명) | jog(동) | jab, mob | 찌르기, 군중 |
| w-need | need(동) | needle(명) | knead, feed | 반죽하다, 먹이다 |
| w-whole | whole(형) | hole(명) | partial, holy | 부분적인, 신성한 |
| w-happen | happen(동) | happy(형) | hasten, harden | 서두르다, 굳다 |
| w-enough | enough(부) | tough(형)·though(접) | barely, early | 겨우, 일찍 |
| w-clear | clear(동, stand clear) | clerk(명) | clean, close | — |
| w-charge | charge(동) | large(형) | change, chase | — |
| w-transvenous | transvenous(형) | transfusion(명) | transdermal, transverse | 경피의, 가로의 |
| w-barely | barely(부) | barley(명) | rarely, merely | 드물게, 단지 |
| w-perfuse | perfuse(동) | profuse(형) | diffuse, perfume | 퍼지다, 향수를 뿌리다 |
| w-drug | drug(명) | drag(동) | drum, rug | 북, 깔개 |
| w-electrical | electrical(형) | electrolyte(명) | electronic, elective | 전자의, 선택적인 |
| w-next | next(형) | text·nest(명) | last, neat | — |
| w-approach | approach(명) | approve(동) | reproach, appraisal | 비난, 평가 |
| w-right | right(부, right away) | light·tight(형) | rightly, lightly | — |
| w-back | back(부, are back) | front(명) | away, aback | — |
| w-most | most(대/한) | moist(형) | least, almost | — |

(59개 단어. `w-bear`·`w-rule`·`w-board`는 헤드워드를 바꾸며 오답도 바꾸므로 D-6~D-8에.)

**W-2 정답으로도 맞는 오답(정답 둘)**
- `w-respond` · `reply`/"회신하다"는 respond의 기본 뜻 · → distractorsEn [respire, restore], distractorsKo [호흡하다, 회복시키다]
- `w-enzyme` · `protein`/"단백질" — 심근효소(트로포닌)는 단백질이고 cue도 "단백질 성분"이라 정답 둘 · → [hormone, antibody] / [호르몬, 항체]
- `w-chart` · "그래프"는 chart의 일반 뜻(듣고 뜻 고르기에서 정답 둘) · → distractorsEn [cart, note], distractorsKo [카트, 메모]
- `w-code` · "뇌졸중 경보 호출"(code stroke)·"화재 대피 신호"(code red)도 병원에서 'code'라 부름 · → distractorsKo [교대 근무 인계, 병동 회진 일정표]

**W-3 오타**
- `w-accurately` decoyChips `ac.cept` → `cept`
- `w-defibrillator` distractorsEn `infusionpump` → `infusion pump`

**W-4 chips·decoyChips**
- `w-straight` chips [[str, aight]]·decoy [stra, ght] — 형태소가 아님 · 한 덩어리 단어라 [[straight]](앱이 조각 맞추기 건너뜀), decoy [strait]
- `w-strange` chips [[str, ange]]·decoy [stra, ng] · → [[strange]], decoy [stranger]
- `w-enough` decoy [rou, gh] 뜻 없는 조각 · → [a, rough]

**W-5 distractorsKo 품사(W-1에 없는 것)**
- `w-squiggle` "꿈틀하다"(동사) → [반듯한 직선, 뾰족한 선]
- `w-stick` "재고"(명사) → [쌓다, 저장하다] (주의: "찌르다"는 stick의 다른 뜻이라 쓰지 말 것)

**W-6 cue가 `ko`를 되풀이 — 장면이 떠오르게 바꿀 것**(정답·파생형 없음 확인)

| id | ko | 지금 cue | 바꿀 cue |
|---|---|---|---|
| w-stick | 붙다 | 패치가 피부에 달라붙는 것 | 땀을 닦아 두면 패치가 피부에서 잘 안 떨어지는 일 |
| w-confirm | 확인하다 | 의심되는 리듬이 맞는지 다시 확인하다 | 모니터에서 본 리듬이 맞는지 12유도로 굳히는 일 |
| w-flag | 표시하다 | 차트에 눈에 띄게 표시해 두다 | 의사가 놓치지 않게 차트 항목에 깃발을 달아 두는 일 |
| w-call | 부르다 | 도움이 필요할 때 전화나 호출로 부르다 | 혈압이 떨어지면 저를 호출해 달라고 할 때 |
| w-tell | 말하다 | 알아야 할 내용을 말로 알려 주다 | 어지럽거나 숨이 차면 저에게 알려 달라고 할 때 |
| w-beat | 뛰다(박동) | 심장이 한 번 뛰는 것, 또는 그렇게 뛰는 일 | 손목에서 한 번씩 톡톡 느껴지는 심장의 움직임 |
| w-draw | 뽑다 | 혈관에서 피를 뽑는 동작, … | 칼륨 검사용 혈액을 채혈하거나 주사기에 약을 채우는 동작 |
| w-send | 보내다 | 검체나 서류를 다른 곳으로 보내다 | 채혈한 튜브를 검사실로 넘길 때 |
| w-danger | 위험 | 다칠 수 있는 위험한 상황 | 알람이 우선해서 알려야 하는, 환자가 다칠 수 있는 상황 |
| w-most | 대부분 | 전부는 아니고 거의 대부분 | 알람 열 개 중 아홉 개쯤 |
| w-start | 시작하다 | 처음 시작해 첫 단계를 열다 | 속도 조절 약의 첫 투여를 개시할 때 |
| w-give | 주다 | 약을 환자에게 주다 | 베타차단제를 정맥으로 투여할 때 |
| w-strange | 이상한 | 평소와 달라 낯설고 이상한 | 아데노신 뒤 몇 초간 드는 낯선 가슴 느낌 |
| w-count | 세다 | 수를 하나씩 세다 | 힘주는 동안 1, 2, 3… 숫자를 짚어 갈 때 |
| w-place | 놓다 | 정해진 곳에 놓다 | 페이서 패드를 가슴의 정해진 자리에 붙일 때 |
| w-prolong | 길어지다 | 시간이 더 길어지게 늘이다 | 약 때문에 심전도의 QT가 늘어날 때 |
| w-long | 긴 | 시간이나 길이가 긴 | QT가 늘어난 상태를 '더 ~해졌다'고 말할 때 |
| w-turn | 바뀌다 | 상태나 방향이 다른 쪽으로 바뀌다 | 연장된 QT가 토르사드로 넘어갈 때 |
| w-irritate | 자극하다 | 피부나 혈관 안쪽을 자극해 쓰라리게 만들다 | 칼륨을 빨리 넣으면 정맥이 쓰라리고 아파지는 일 |
| w-produce | 만들어내다 | 어떤 결과를 만들어 내다 | 스파이크마다 박동 하나가 뒤따라 나와야 할 때 |
| w-lose | 잃다 | 갖고 있던 것을 잃다 | 캡처가 사라져 박동이 빠질 때 |
| w-increase | 늘리다 | 양이나 수치를 더 늘리다 | 캡처가 사라지면 출력 mA를 올릴 때 |
| w-answer | 답하다 | 묻는 말에 대해 대답하다 | 동의서를 보며 환자의 궁금한 점에 응할 때 |
| w-procedure | 시술 | 의사가 시행하는 정해진 처치나 시술 | 처치실에서 진정 후 의사가 하는 심율동전환 같은 처치 |
| w-cardiac | 심장의 | 심장에 관한 | 트로포닌 같은 '○○ 효소'·'○○ 정지' 앞에 붙는 말 |
| w-stand | 서다 | 몸을 곧게 일으켜 서다 | 충격 직전 "모두 ~ clear!"라고 외칠 때 |
| w-barely | 겨우 | 거의 없을 만큼 겨우 | 관류가 간신히 버티는, 무너지기 직전의 상태 |
| w-stop | 멈추다 | 하던 것을 멈추다 | QT를 늘리는 약을 당장 끊을 때 |
| w-dangerous | 위험한 | 다칠 위험이 큰 | 토르사드처럼 생명을 위협하는 리듬 앞에 붙는 말 |
| w-electrical | 전기의 | 전기와 관련된 | VT·VF가 몰아치는 '○○ 폭풍'의 앞말 |
| w-next | 다음의 | 지금 다음 차례의 | 순환기내과와 정할, 이번 일 뒤에 이어질 |
| w-step | 단계 | 일을 차례대로 하는 한 단계 | 순환기내과와 짜는 계획의 한 차례 |
| w-right | 바로 | '지금', '곧바로' 앞에 붙어 … (`ko` "바로"가 cue 안에) | 'away'·'now'·'after' 앞에 붙어 시점을 딱 짚는 말 |

(`w-rate`·`w-level`·`w-result`는 ko 낱말이 들어 있지만 장면 정보가 더 있어 둠. `w-away`·`w-eat`·`w-drink`는 D에서 지움.)

## 고칠 것 — 결정 11 (단어·문장)

`changes-icu-arrhythmia.yaml`에 전부 적을 것. 문장 `ko`를 바꾸면 **그 문장의 `distractorsKo` 둘도 새 ko에 맞춰 다시 쓸 것**. 문장 `en`을 바꾸면 chunks와 **v46 필드(tag·icon·why·decoy·distractorsKo·blank) 전부 새로 쓸 것**, 그 문장을 `example`로 쓰는 단어의 example·exKo도 바꿀 것.

**D-1** `w-away` · ko "당장"은 away의 뜻이 아님("right away"의 반쪽) · 4문장(항부정맥제 주입 준비 4, 서맥·전도차단 관리 5, 페이스메이커·ICD 2, 부정맥 유발 허혈 감별 5)의 words에서 빼고 word-remove(`w-right` "바로"가 이미 가르침; 네 상황 단어 수 25·25·23·20 → V3 문제없음).

**D-2** `w-artifact` · ko "인공음영"은 영상의학 용어 · → "아티팩트"(exKo·문장 ko가 이미 "아티팩트"; distractorsKo [동맥, 진짜 신호]는 길이 통과).

**D-3** `w-noise` · ko "소음" → "잡음"(파형 잡음; exKo도 "잡음").

**D-4** `w-replace` · ko "교체하다" → "보충하다"(두 문장 모두 전해질 보충; exKo "보충할 수 있어요").

**D-5** `w-bowel` · ko "배변의"(bowel은 명사 '장') → "장(창자)", distractorsKo → [방광, 소변].

**D-6** `w-bear` · 헤드워드 → `bear down`(문장 "bearing down"; bear 혼자는 '견디다·곰') · ipa /bɛr daʊn/, chips [[bear], [down]], distractorsEn [bear up, bear with], distractorsKo [견뎌 내다, 참고 기다리다], decoyChips [beer, up]. example 그대로.

**D-7** `w-rule` · 헤드워드 → `rule out`(ko "배제하다"는 rule 혼자의 뜻이 아님) · chips [[rule], [out]], distractorsEn [rule in, roll out], distractorsKo [확진하다, 출시하다], decoyChips [role, "in"].

**D-8** `w-board` · 헤드워드 → `on board`(ko "투여 중인") · chips [["on"], [board]](따옴표 — V11), distractorsEn [on hold, on call], distractorsKo [보류 중인, 대기 중인], decoyChips [bored].

**D-9** `w-update` · ko "알리다"가 `w-notify`와 같음 · → "새 소식을 알리다", distractorsKo → [새 장비로 바꾸다, 기분을 상하게 하다](upgrade·upset; 길이 통과).

**D-10** `w-eat`·`w-drink` · 너무 쉬움 · `예정 심율동전환 준비` 문장 5 words에서 빼고 word-remove(남는 태그 [w-midnight]; 상황 단어 19 → 17).

**D-11** `텔레메트리 경보 응답` 문장 4 · 사실 오류(안전, 심각 1) · en → "But we never assume a sudden drop in heart rate is artifact." / chunks ["But we never assume", "a sudden drop", "in heart rate", "is artifact", "."] / ko "하지만 심박수가 갑자기 떨어지면 절대 아티팩트라고 단정하지 않아요." / words 그대로 · v46 새로: why 예) "But으로 앞의 '대부분 잡음'과 대비하고, never assume으로 '확인 전에는 가짜로 넘기지 않는다'는 원칙을 말해요." (지금 why "예외라고 강하게"와 distractorsKo "…절대 농담이 아니에요"는 버림) · `w-sudden`·`w-never` example/exKo도 새 문장으로.

**D-12** `페이스메이커·ICD 환자 모니터` 문장 3 · 지킬 수 없는 약속(안전, 심각 2) · en → "Your defibrillator is designed to fire only when your heart needs it." / chunks ["Your defibrillator", "is designed to fire", "only when", "your heart needs it", "."] / ko "제세동기는 심장이 필요로 할 때만 작동하도록 만들어져 있어요." · v46 새로: why 예) "is designed to로 원리를 알려 주되 '절대 잘못 작동하지 않는다'고 약속하지 않아요." (지금 why "아무 때나 작동하지 않음을 알려 줘요"는 버림. 지금 빈칸 오답 sleeps/talks/sings도 장면과 멀어 새로) · `w-defibrillator`·`w-need` example/exKo도.

**D-13** `예정 심율동전환 준비` 문장 4 · "delivers **one** … shock"은 한 번으로 끝난다는 약속(전환이 안 되면 에너지를 올려 반복) · en → "This machine delivers a carefully timed shock to reset your rhythm." / chunks ["This machine delivers", "a carefully timed shock", "to reset", "your rhythm", "."] / ko "이 기계가 정교하게 맞춘 전기충격으로 리듬을 재설정해요." · v46 새로(특히 distractorsKo "…세 번으로…"는 이제 사실일 수 있어 정답 둘) · `w-machine`·`w-deliver`·`w-reset` example/exKo도.

**D-14** `K·Mg 전해질 채혈` 문장 3 · 구조적 원인을 미리 배제(안전, 심각 5) · en → "These rhythms are often electrolyte-driven, not just structural." / chunks ["These rhythms", "are often electrolyte-driven", ", not just structural", "."] / ko "이런 리듬은 구조적 문제만이 아니라 전해질 때문인 경우가 많아요." · v46 새로(why는 안심 문장이 아니라 "not just로 다른 원인도 열어 둔다"로) · `w-often`·`w-structural` example/exKo도.

**D-15** `QT 연장 약물 감시` 문장 3 · ko "복용 중인 약물"(ICU 정맥 약 포함, he's on = 투여 중) · ko → "투여 중인 약물 몇 가지 때문에 QT가 길어져요." · distractorsKo 둘 다시 · `w-long` exKo도.

**D-16** `새 심방세동 RVR 관리` 문장 1(keyPhrase — ko만) · "속도 조절"(rate control의 직역) → "심박수 조절을 시작하고 혈압을 지켜볼게요." · distractorsKo 둘 다시 · `w-start`·`w-control` exKo도.

**D-17** 같은 상황 문장 3 · "심실 속도를" → "심실 박동수를 늦추려고 베타차단제를 주고 있어요." · distractorsKo 둘 · `w-give`·`w-betablocker`·`w-slow`·`w-ventricular` exKo도.

**D-18** 같은 상황 문장 4 · "속도가 내려오면서" → "심박수가 내려가면서 혈압이 떨어지는지 지켜보세요." · distractorsKo 둘 다시.

**D-19 chunks — 구 경계를 끊은 것(keyPhrase 아님, 26문장).** en은 그대로, chunks만(V8 조각 수 확인함).

| 상황 · 문장 | 지금 | 바꿀 chunks |
|---|---|---|
| 새 부정맥 인지·기록 [3] | It looks like / new-onset atrial / fibrillation | It looks like / new-onset / atrial fibrillation / . |
| 항부정맥제 주입 준비 [3] | This runs / through a central line / or a large / peripheral IV | This runs / through a central line / or / a large peripheral IV / . |
| 심박수·혈압 동반 사정 [4] | Let's see / how your pressure responds / over the next / few minutes | Let's see / how your pressure / responds / over the next few minutes / . |
| K·Mg 전해질 채혈 [4] | I'll send / this to the lab / as a stat / draw | I'll send / this / to the lab / as a stat draw / . |
| 새 심방세동 RVR 관리 [4] | Watch for her / blood pressure dropping / … | Watch for / her blood pressure dropping / as the rate / comes down / . |
| 새 심방세동 RVR 관리 [5] | … / , we'll move / straight to / cardioversion | If she becomes unstable / , we'll move / straight / to cardioversion / . |
| 안정 SVT [5] | That strange feeling / passes in / just a few / seconds | That strange feeling / passes / in just a few seconds / . |
| 서맥·전도차단 관리 [3] | His rate is / in the low / 40s and / getting slower | His rate is / in the low 40s / and / getting slower / . |
| 서맥·전도차단 관리 [5] | … / if he becomes / unresponsive or / his pressure drops | Tell me / right away / if he becomes unresponsive / or his pressure drops / . |
| QT 연장 약물 감시 [3] | The QT gets longer / with several / medications / he's on | The QT / gets longer / with several medications / he's on / . |
| 전해질 교정 [3] | We give potassium / slowly to avoid / irritating his / veins | We give potassium / slowly / to avoid / irritating his veins / . |
| 전해질 교정 [4] | … / often settles / down | Once / we correct it / , his rhythm / often settles down / . |
| 경정맥 임시 페이싱 [3] | Every spike should / produce a beat / right after / it | Every spike / should produce / a beat / right after it / . |
| 경정맥 임시 페이싱 [4] | This is / the temporary pacer / , not his / permanent one | This is / the temporary pacer / , not / his permanent one / . |
| 예정 심율동전환 [3] | You'll be asleep / for just a few / minutes during / the procedure | You'll be asleep / for just a few minutes / during / the procedure / . |
| 페이스메이커·ICD [5] | If it does fire / , we'll check / on you and / record what happened | If it does fire / , we'll check on you / and record / what happened / . |
| 부정맥 유발 허혈 감별 [3] | His enzymes will / tell us / … | His enzymes / will tell us / if there's / heart damage / . |
| 부정맥 유발 허혈 감별 [4] | … / just an electrolyte / problem | If it's ischemia / , this isn't / just / an electrolyte problem / . |
| 불안정 빈맥 [3] | Her pressure is dropping / fast and / … | Her pressure / is dropping fast / and she's getting / confused / . |
| 무맥성 VT·VF [5] | We push / epinephrine every / few minutes / during the code | We push / epinephrine / every few minutes / during the code / . |
| 완전방실차단 [3] | He's barely perfusing / and could / arrest any minute | He's barely perfusing / and could arrest / any minute / . |
| 완전방실차단 [4] | This rhythm won't / support his blood / pressure much / longer | This rhythm / won't support / his blood pressure / much longer / . |
| 전기폭풍 [3] | … / means we need / a different / approach | Four shocks / this hour / means we need / a different approach / . |
| 전기폭풍 [4] | … / before the next / episode | I'll increase / his sedation / before the next episode / . |
| 전기폭풍 [5] | Let's call / for a second / antiarrhythmic and / update the team | Let's call for / a second antiarrhythmic / and update / the team / . |
| 페이싱 캡처 실패 [5] | … / , call for / a backup / pacer now | If this doesn't fix it / , call for / a backup pacer / now / . |

(문장 4·3·4는 D-11·D-12·D-13에서 새로 정했음. 빈칸·decoy가 바뀐 청크와 겹치면 B가 다시 볼 것.)

---

## 기계적 전수 확인 결과 요약

- **pair 41결합**: 정답 둘 1(`deliver + a midnight meal` → N-3). 나머지 40줄은 영어로 성립 안 함(경계: `infuse + dose`는 관사 없이 부자연, `confirm + the shock`·`deliver + to the bed`는 단독으로 어색 — 그대로 둠).
- **swap 15줄**: 문법 모두 맞음("Your heart rate is tachycardic"·"a defibrillation"은 틀린 선택지라 어색해도 됨). swap `ko` 5개 모두 바꾼 문장의 뜻과 맞음.
- **context 17개**: `word`가 세 장면 모두에 있음(17/17). 모양 문제 N-4~N-9.
- **chunks**: keyPhrase 9문장 보고, 그 외 26문장 D-19.
- **distractorsEn 품사**: 59개 단어 W-1.
- **decoyChips 비속어**: 없음.

## 개수 요약

- 고칠 것 **총 158건** = S 1 + N 10 + W 103(W-1 59 · W-2 4 · W-3 2 · W-4 3 · W-5 2 · W-6 33) + D 44(D-1~D-18 18 · D-19 chunks 26)
  - 이 중 **안전 관련 6건**: S-1(페이싱 출력 why), N-1(QTc 기준), D-11(never artifact), D-12(ICD only fires), D-14(not structural), D-13(한 번의 충격 약속)
- 사용자 결정(keyPhrase `en`) 4건: K-1~K-4, keyPhrase chunks 보고 9문장.

## 종합

사실 오류 3(never artifact·QTc 기준·페이싱 why)과 지킬 수 없는 약속 2를 고치고 결정 11의 틀린 ko 5건을 바로잡으면 내보낼 수 있습니다. 품사 다른 오답(59)과 ko를 되풀이한 cue(33)는 양이 많지만 기계적으로 바꿀 수 있습니다. keyPhrase 3문장(K-1~K-3)은 사용자 결정 뒤에 반영하세요.
