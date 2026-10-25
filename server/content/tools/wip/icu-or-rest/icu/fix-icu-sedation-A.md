# fix-icu-sedation-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번·swap ko)

대상: `icu-sedation.yaml` (단어 217 · 상황 21 · 문장 118 · 뉘앙스 43 — slider 21 · context 20 · pair 1 · swap 2).
비교: `base-icu-sedation.yaml`, `changes-icu-sedation.yaml`, `in-icu-sedation.json`, `notes-icu-sedation-A.md`·`-B.md`.
기계 확인(스크립트): 단어 전부 표, 문장 chunks 전부 `/` 연결, pair 전 결합(1문항 12결합), swap 전 선택지 연결(2문항 6줄),
distractorsEn 품사 전수, decoyChips·distractorsEn 비속어·불쾌한 조각 전수, 은행 안 같은 `ko` 검색, 고친 뒤 상황별 서로 다른 단어 수(V3) 재계산.

번호: 상황은 0부터(`S13` = 금단·알코올 병력 진정 조정), 문장은 `상황.문장`(0부터). 저작자 메모의 "상황 14 문장 3"은 이 파일의 13.3입니다(메모는 상황만 1부터).

## 항목별 점수
| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 품사가 다른 오답 35단어(아래 표). 정답과 뜻이 겹치는 오답 1개(adjust↔adapt). 그 밖에는 철자·소리가 닮은 좋은 오답이 대부분 |
| 2 | dKo·dEn 겹침·길이 | 4 | 길이는 전부 통과. 은행 안 같은 ko 1쌍(order·command "지시"). dKo가 정답의 다른 뜻인 것은 없음 |
| 3 | cue | 3 | 정답 노출 없음. 그러나 사전 풀이형 cue가 많고 ko를 되풀이하는 것 7개, 뜻을 잘못 짚은 것 2개(close "거리가 짧다", hold "고수") |
| 4 | chips/decoyChips | 3 | 자르기는 대체로 형태소 단위. 불쾌한 조각 1개(`dix`)와 약한 것 6개(bra·lush·cur/dye·nerd·nut) |
| 5 | 뉘앙스 사실 | 4 | slider why는 RASS·CPOT·CAM-ICU·PRIS·덱스 부작용 모두 맞음. 진정된 환자에게 CIWA 점수를 쓴 차트 장면 1개 |
| 6 | 뉘앙스 설계 | 2 | 유일한 pair에서 정답 둘(`call for him now`, decoy `the Foley`가 open·call for에 붙음). context 20개 중 9개가 핸드오프 모양이 아님(대상 단어는 가족에게도 쓰는 말이고, 어색한 이유가 다른 전문어) |
| 7 | 결정 11 | 3 | 저작자 ko 가름 18건은 타당(hold만 틀림). 놓친 것: 문장 사실·약속 문제 5개(13.3·13.6·10.4·16.3·17.4), 쉬운 단어 7개, 뜻을 잘못 짚은 태그 4개, 구를 끊은 chunks 4개, ko에 섞인 영어·"그" 대명사 |

## 사실 오류·심각한 문제
1. **[환자 안전] 17.4** "Let's use a sedation scale made for paralyzed patients, since RASS won't show much." — 마비된 환자용으로 검증된 진정 척도는 없습니다. 신경근차단 중에는 차단 전에 깊은 진정을 확인하고, 처리 뇌파(BIS 등)를 프로토콜에 따라 씁니다(SCCM 신경근차단 지침·PADIS). 있지도 않은 척도를 믿게 하면 마비 중 각성(이 상황이 막으려는 것)을 놓칩니다. order 4번 줄도 같은 말입니다. → S13
2. **[환자 안전·잘못된 안심] 13.6** "…it's often just a sensor slipping, not an emergency." — 가족에게 알람을 미리 별일 아니라고 단정합니다(저작자 메모 타당). → S11
3. **[환자 안전·지킬 수 없는 약속] 13.3** "…he'll wake up as we lighten it." — 금단 위험이 있는 환자 가족에게 깨어남을 단정합니다(저작자 메모 타당). order 4번 줄도 같음. → S9
4. **[환자 안전] 10.4** "…we'll restart his comfort settings right away." — 자발각성시험(SAT)을 통과하면 진정을 끈 채 자발호흡시험으로 넘어가고, 실패했을 때만(보통 이전 용량의 절반으로) 다시 시작합니다. 끝나자마자 원래 설정으로 되돌린다는 말은 프로토콜과 반대이고, 지킬 수 없는 약속입니다. order 4번 줄도 같음. → S7
5. **[환자 안전] 16.3** "Turn off the drip completely until we're sure he's stable." — 혈압이 무너지는 장면(16.1 수액 시작)에서 어느 drip인지 말하지 않습니다. 수액·승압제 주입을 끄는 것으로 들릴 수 있습니다(저작자 메모 반쯤 타당 — 진정제 중단은 간호사가 할 수 있는 조치이고, 문제는 대상이 빠진 것). → S12
6. **[환자 안전] `w-hold` ko "고수하다"** — 이 주제에서 hold는 0.4·3.2(속도·목표를 지키다)뿐 아니라 **19.2 "while I hold the infusion"(주입을 보류하다 = 멈추다)**에 쓰입니다. "고수하다"로 외우면 서맥 위기 문장을 "주입을 유지하는 동안"으로 거꾸로 읽습니다. 18.0 "hold his hands"(잡다)에도 붙어 있음. → W2
7. **[설계] N16.0 pair 정답 둘** — `call for` + `him now` = "call for him now"(그를 부르다)가 성립하고, decoy `the Foley`가 "open the Foley"(키트를 열다)·"call for the Foley"로 붙습니다. → N1
8. **[설계] context 9개가 핸드오프 모양이 아님** — 대상 단어(pump·pain·sedation·oxygen·line·dose·propofol·pressure·dexmedetomidine)는 가족에게도 그대로 쓰는 말인데, 어색한 장면의 이유가 다른 전문어(nociceptive·hypoventilation·CVC·internal jugular·resuscitation 등)입니다. 화면 제목 "`pain`이 어색한 장면은?"과 맞지 않습니다. → N2
9. **[사실] 7.3 ko "가까이서 지켜봐요" · `w-close` ko "가까운"** — "keep a close eye on"의 close는 "면밀한"입니다. 저작자는 메모에 "'close eye on' 구는 이 주제에 없다"고 했지만 7.3에 있습니다. → S5·W3

---

## 고칠 것

### A. 문장 (keyPhrase 아님 · 결정 11) — `en`·`ko`·`chunks`를 바꾸면 그 문장의 v46 필드(`tag`·`icon`·`why`·`decoy`·`distractorsKo` 2개·`blank`)를 새로 쓰고 `changes-icu-sedation.yaml`에 적습니다. `ko`만 바꿔도 `distractorsKo` 둘은 새 ko에 맞춰 다시 씁니다.

- **S1** 통증 우선 평가 · 2.5 — (1) ko에 영어 `analgesia-first`(저작자 메모) → ko `이 진통 우선 지시를 나머지 팀에게도 전달할게요.` (2) chunks `I'll pass this / analgesia-first order`가 지시어 this를 명사에서 떼어 냄 → `["I'll pass", "this analgesia-first order", "along", "to the rest of the team", "."]`. distractorsKo 2개를 새 ko로 다시 씀(지금 둘 다 `analgesia-first`를 그대로 품음), why가 청크를 전제하지 않는지 봄
- **S2** 진정 목표 설정 이해 · 3.5 "…he can still wake toward us." — "wake toward us"는 성립하지 않는 영어(ko "우리 쪽으로 깰 수 있어요"도 직역) → en `Light sedation isn't the same as a coma, and he can still wake up when we talk to him.` / ko `가벼운 진정은 혼수와 달라요, 말을 걸면 여전히 깨어날 수 있어요.` / chunks `["Light sedation isn't", "the same as a coma", ", and he can still wake up", "when we talk to him", "."]` / words `[w-light, w-sedation, w-coma, w-wake]`. v46 필드 새로 씀(blank `wake`의 오답 walk·run·jump도 다시)
- **S3** 진정제 라인·호환성 확인 · 5.4 — chunks `through a separate / access`가 형용사와 명사를 끊음 → `["If it's not compatible", ", we'll run it", "through", "a separate access", "."]` (decoy·blank 다시 봄)
- **S4** RASS 목표 맞춤 적정 · 6.4 — (1) ko에 영어 `titrate` → `한 번에 크게 바꾸지 말고 조금씩 적정해요.` (2) chunks `instead of one / big jump`가 명사구를 끊음 → `["Let's titrate", "in small steps", "instead of", "one big jump", "."]`. distractorsKo 2개 다시 씀(지금은 "titrate 할까요/할게요" 화법만 바꾼 것이라 정답과 뜻이 거의 같음)
- **S5** 덱스메데토미딘 적용 · 7.3 — ko "가까이서 지켜봐요"는 close를 거리로 옮긴 오역 → ko `첫 한 시간 동안 심박수를 면밀히 지켜봐요.` distractorsKo 2개 다시 씀(W3와 짝)
- **S6** 아편유사제 진통 적정 · 8.3 — chunks `his pain / score`가 복합명사를 끊음 → `["Let's reassess", "his pain score", "after this next dose", "."]` (decoy·blank 다시 봄)
- **S7** 진정 중단 이탈 연계 · 10.4 — **환자 안전**(위 4) → en `Once we finish the trial, we'll restart his medicine if he needs it.` / ko `시험이 끝나면 필요할 때 약을 다시 시작해 드릴게요.` / chunks `["Once we finish", "the trial", ", we'll restart his medicine", "if he needs it", "."]` / words `[w-finish, w-trial, w-restart, w-medicine, w-need]`. v46 필드 새로 씀(why가 "곧 돌아간다는 약속"이라고 설명함). **order 4번 줄**도 같은 문장으로(B 범위와 맞출 것)
- **S8** 진정 중단 이탈 연계 · 10.5 — ko "그에게"는 번역투 대명사 → `잠깐 스스로 깰 수 있는지 확인하는 거라고 환자분께 말씀드릴게요.` distractorsKo 2개 다시 씀
- **S9** 금단·알코올 병력 진정 조정 · 13.3 — **환자 안전**(위 3, 저작자 메모 반영) → en `Being sedated isn't the same as a coma, and he can wake up as we lighten it.` / ko `진정 상태는 혼수와 달라요, 약을 줄여 가면 깨어나실 수 있어요.` / chunks `["Being sedated isn't", "the same as a coma", ", and he can wake up", "as we lighten it", "."]` / words 그대로. v46 필드 새로 씀. **order 4번 줄**도 같이
- **S10** 금단·알코올 병력 진정 조정 · 13.4 — ko "그를 … 그 자체의 약으로"는 번역투 → `진정은 차분하게 해 주지만, 통증은 진통제로 따로 다뤄요.` distractorsKo 2개 다시 씀(지금 하나는 "그 자체의 의사가 다뤄요"로 어색함)
- **S11** 금단·알코올 병력 진정 조정 · 13.6 — **환자 안전**(위 2, 저작자 메모 반영) → en `If you hear his monitor alarm, it may just be a sensor slipping, but we'll come and check.` / ko `모니터 알람이 울리면 센서가 살짝 빠진 것일 수도 있지만, 저희가 와서 확인할게요.` / chunks `["If you hear", "his monitor alarm", ", it may just be", "a sensor slipping", ", but we'll come and check", "."]` / words `[w-monitor, w-alarm, w-sensor]`. `w-emergency`는 어느 문장도 태그하지 않게 되니 word-remove. v46 필드 새로 씀(why가 "often just…not an emergency로 놀라지 않게"를 설명함)
- **S12** 과진정 호흡정지·저혈압 위기 · 16.3 — **환자 안전**(위 5) → en `Turn off the sedation drip until we're sure he's stable.` / ko `안정된 게 확실할 때까지 진정제 주입을 꺼 두세요.` / chunks `["Turn off", "the sedation drip", "until we're sure", "he's stable", "."]` / words `[w-sedation, w-drip, w-stable]`. v46 필드 새로 씀(blank 오답 door·dryer·dishwasher는 B 메모대로 동떨어짐 — 같이 바꿀 것)
- **S13** 신경근차단 병용 심부진정 관리 · 17.4 — **환자 안전**(위 1) → en `Since RASS won't show much while he's paralyzed, let's add BIS monitoring.` / ko `마비된 동안에는 RASS로 잘 드러나지 않으니 BIS 감시를 더해요.` / chunks `["Since RASS", "won't show much", "while he's paralyzed", ", let's add", "BIS monitoring", "."]` / words `[w-rass, w-show, w-paralyze, w-monitor]`. `w-scale`·`w-use`는 태그가 없어지니 word-remove(w-use는 W1과 겹침). why에 "BIS 같은 처리 뇌파는 병원 프로토콜에 따라"를 넣어 새로 씀. **order 4번 줄** "…so use a scale made for paralyzed patients."도 같이(예: `For that, RASS won't show much, so let's add BIS monitoring.`)
- **S14** 진정 부족 자가발관 위험 급변 · 18.3 — ko "그가"는 번역투 → `환자가 안정될 때까지 두 명이 침상 옆에 있어야 해요.` distractorsKo 2개 다시 씀
- **S15** 프로포폴 주입 관리 · 1.3 "that number checks out" — 여기 check out은 "맞다"인데 `w-check`(점검하다)가 붙어 있음 → `words`에서 `w-check` 빼기
- **S16** 진정 중단 이탈 연계 · 10.1(keyPhrase — `words`만) "pair it with" — 동사 "함께 하다"인데 `w-pair`(짝, 명사)가 붙어 있음 → `words`에서 `w-pair` 빼기
- **S17** 프로포폴 주입 증후군 인지 · 15.3 "trending the wrong way" — 자동사 "추세를 보이다"인데 `w-trend`(추세를 살피다)가 붙어 있음 → `words`에서 `w-trend` 빼기
- **S18** 진정 부족 자가발관 위험 급변 · 18.0(keyPhrase — `words`만) "hold his hands" — 잡다 → `words`에서 `w-hold` 빼기(W2와 짝)

**keyPhrase 문장의 `ko`만 고치기(결정 11 범위 — en 무변경, distractorsKo 2개는 새 ko에 맞춰 다시 씀)**
- **K1** 1.2 ko `혈압은 제가 볼 테니 용량은 titrate 해주세요.` → `혈압은 제가 볼 테니 용량을 적정해 주세요.`
- **K2** 7.1 ko `titrate 하면서 서맥과 저혈압을 지켜봐요.` → `적정하면서 서맥과 저혈압을 지켜봐요.`
- **K3** 3.0 ko `오늘 목표는 light sedation, …` → `오늘 목표는 가벼운 진정, 대략 0에서 마이너스 1이에요.`
- **K4** 4.1 ko "이산화탄소 분압" — en은 분압(PaCO2)이 아니라 날숨 끝 값 → `산소포화도랑 호기말 이산화탄소를 지켜봐요.` (why는 이미 "호기말"이라 맞음)
- **K5** 16.0 ko "백밸브마스크를 해줘요"는 어색함(저작자 메모) → `무호흡이에요 — 진정제를 멈추고 지금 백마스크로 환기해 주세요.`
- **K6** 20.1 ko "다약제 진정 계획" — w-multimodal ko를 "다중 방식의"로 가른 것과 어긋남 → `손이 더 필요하고 다중 방식 진정 계획이 필요해요.`
- **K7** 20.2 ko "그와 라인들을" 번역투 → `지시를 받는 동안 환자와 라인들을 안전하게 지켜주세요.`
- **K8** 14.1 ko "목표를 향해 가볍게 하고"는 목적어가 빠짐 → `목표 쪽으로 진정을 가볍게 하고 다시 평가해봐요.`

(위 A를 모두 반영하고 W1·W5까지 뺀 뒤 상황별 서로 다른 단어 수를 다시 셌습니다. 가장 적은 상황이 15개(S6·S17)라 V3 통과.)

### B. 단어 (결정 11)

- **W1** 쉬운 단어 태그 빼기·은행에서 지우기(간호사가 이미 아는 말, 구로 가르칠 값도 없음): `w-tell`(0.5·4.5·8.4·10.5·13.0·18.4·18.5), `w-give`(2.3·5.1·7.0·18.1·19.1), `w-use`(17.4), `w-put`(0.2), `w-number`(1.3), `w-long`(9.5), `w-second`(12.1). 문장은 그대로 `words`에서만 빼고 word-remove로 적음. **N8.2 swap의 `words`에서 `w-tell`도 뺌**. 저작자가 지운 17개와 합쳐 원래 은행의 약 1할
- **W2** `w-hold` ko "고수하다" — **환자 안전**(위 6). 18.0 태그는 S18에서 뺌 → ko `지키다/보류하다`, dKo `[바꾸다, 포기하다]` → `[바꾸다/재개하다, 높이다/추가하다]`, cue `속도나 목표는 그대로 지키고, 약은 주지 않고 잠시 미뤄 둘 때 쓰는 동사` (w-keep "유지하다"·w-pause "잠시 멈추다"·w-stop "중단하다"와 글자가 겹치지 않음)
- **W3** `w-close` ko "가까운"·cue "거리가 짧다는 뜻의 형용사" — 7.3 "keep a close eye on"의 close는 "면밀한" → ko `면밀한`, cue `첫 한 시간 동안 심박수에서 눈을 떼지 말자고 할 때 'eye' 앞에 붙는 형용사`, dKo `[먼, 느린]` → `[느슨한, 대략적인]`, dEn `[clean, clever]`는 그대로. example 그대로
- **W4** `w-order`와 `w-command` ko가 둘 다 "지시"를 품음 → `w-order` ko `처방`(2.5 "analgesia-first order"·20.2 "get orders" 모두 의사 처방), dKo `[보고/기록, 승인/거부]` → `[보고, 기록]`
- **W5** `w-scale`·`w-emergency`·`w-use` word-remove(S11·S13 결과)
- **W6** tag `일반 동사`가 동사가 아닌 단어에 붙음: `w-small`·`w-close`·`w-common`·`w-multiple`·`w-extra`·`w-single`·`w-enough`(형용사), `w-step`(명사), `w-closely`(부사) → 주제 태그 집합에 `정도·수량` 하나를 더해 이 9개에 씀(태그 수는 10개 안팎 유지)

저작자 변경 목록(changes) 판정: ko 가름 18건 중 `w-hold`(위 W2)만 틀렸고 나머지는 타당. word-remove 17건 타당(w-eye는 "close eye"를 W3에서 close로 살리므로 지워도 됨). `w-bag`(수액 백)과 `w-bagvent`(백마스크로 환기하다)는 뜻·품사가 달라 두 카드로 두는 것이 맞음(저작자 메모의 판단 거리 — 합치지 않음).

### C. 단어 v45 필드

**distractorsEn 품사가 다른 것 — 전부(같은 품사로 바꿈; 제안은 철자·소리가 닮은 같은 품사)**

| id | 정답(품사) | 지금 오답 | 다른 품사 | 바꿀 오답 |
|---|---|---|---|---|
| w-minus | minus(명) | minor, minute | minor(형) | `[minute, mucus]` |
| w-light | light(형) | night, slight | night(명) | `[tight, slight]` |
| w-pump | pump(명) | plump, pulse | plump(형) | `[pulp, pulse]` |
| w-titrate | titrate(동) | nitrate, tolerate | nitrate(명) | `[tolerate, iterate]` |
| w-stable | stable(형) | stale, staple | staple(명) | `[stale, feeble]` |
| w-medicine | medicine(명) | medical, medal | medical(형) | `[medal, machine]` |
| w-calm | calm(형) | clam, palm | 둘 다 명사 | `[clammy, balmy]` |
| w-command | command(명) | comment, commend | commend(동) | `[comment, comma]` |
| w-safe | safe(형) | save, sale | save(동)·sale(명) | `[sane, same]` |
| w-breathe | breathe(동) | breath, bathe | breath(명) — 저작자 의도(W13), 브리프는 이런 짝을 decoyChips로 | `[bathe, breed]`, `breath`는 decoyChips로 옮김 |
| w-shallow | shallow(형) | shadow, swallow | shadow(명)·swallow(동) | `[sallow, hollow]` |
| w-bedside | bedside(명) | beside, bedsore | beside(전) | `[bedsore, bedrail]` |
| w-access | access(명) | excess, assess | assess(동) | `[excess, abscess]` |
| w-awake | awake(형) | await, aside | await(동)·aside(부) | `[asleep, aloof]` |
| w-step | step(명) | stem, steep | steep(형) | `[stem, stew]` |
| w-rouse | rouse(동) | rose, ruse | 둘 다 명사 | `[douse, roam]` |
| w-balance | balance(동) | ballast, balloon | ballast(명) | `[ballot, bounce]` |
| w-comfort | comfort(명) | effort, comport | comport(동) | `[effort, compost]` |
| w-dose | dose(명) | dove, doze | doze(동) | `[dove, dome]` |
| w-lactate | lactate(명) | lactose, lacerate | lacerate(동) | `[lactose, latex]` |
| w-monitor | monitor(동) | mentor, motor | motor(명) | `[mentor, minister]` |
| w-finish | finish(동) | finch, furnish | finch(명) | `[furnish, finesse]` |
| w-lower | lower(동) | loser, power | 둘 다 명사 | `[loosen, layer]` (lessen은 뜻이 같아 안 됨) |
| w-high | high(형) | night, sigh | 둘 다 명사 | `[shy, nigh]` |
| w-fluid | fluid(명) | fluent, fluoride | fluent(형) | `[flute, fluoride]` |
| w-fast | fast(부, "move fast") | fist, vast | fist(명)·vast(형) | `[first, far]` |
| w-aware | aware(형) | beware, aloof | beware(동) | `[aloof, awash]` |
| w-adequate | adequate(형) | educate, advocate | 둘 다 동사 | `[accurate, adjacent]` |
| w-paralytic | paralytic(명, 마비제) | analytic, parasitic | 둘 다 형용사 | `[parasite, paraffin]` |
| w-physician | physician(명) | physicist, physical | physical(형) | `[physicist, musician]` |
| w-multiple | multiple(형) | multiply, multitude | multiply(동)·multitude(명) | `[minimal, mutual]` |
| w-extra | extra(형) | extract, extend | 둘 다 동사 | `[external, exact]` |
| w-multimodal | multimodal(형) | multivitamin, multicolored | multivitamin(명) | `[multicolored, multilingual]` |
| w-refractory | refractory(형) | respiratory, repository | repository(명) | `[respiratory, reflective]` |
| w-single | single(형) | signal, simple | signal(명) | `[simple, sizable]` |

(w-long·w-second도 품사가 다르지만 W1로 지우므로 뺐습니다.)

**정답과 뜻이 겹치는 오답**
- **D1** `w-adjust` dEn `adapt` — "맞게 고치다"로 adjust와 뜻이 겹침 → `[adjourn, adjoin]`

**decoyChips — 비속어·불쾌한 조각(전수 확인)**
- **D2** `w-dexmedetomidine` decoy `dix` — 남성 성기 비속어(dicks)로 읽힘 → `dax`
- **D3**(약함) `w-breathe` `bra`(속옷) → `bri` / `w-bolus` `lush`(술꾼 — 알코올 병력 주제와 같은 단원이라 더 불편) → `loss` / `w-cardiac` `cur`(잡종 개, 욕)·`dye`(die와 같은 소리) → `cor`, `dee` / `w-need` `nerd` → `neat` / `w-minus` `nut` → `nos`. (`w-put`의 `pot`는 W1로 사라짐)
- 그 밖의 decoyChips·distractorsEn(witch·cull·hurl·trash·sin·ice 등)은 일상어로 읽혀 두어도 됨

**cue — ko를 되풀이하거나 사전 풀이만 한 것(장면이 떠오르게)**
- **C1** `w-high` "수치나 위치가 보통보다 위쪽에 있다는 뜻의 형용사" → `프로포폴을 더 올리지 말자고 할 때, 또는 용량 앞에 붙여 '고용량'을 만들 때 쓰는 말`
- **C2** `w-common` "자주 있어서 드물지 않은 일" → `한 약을 여러 날 쓰면 내성이 생기는 게 이상한 일이 아니라고 동료를 안심시킬 때`
- **C3** `w-single` "오직 하나뿐인" → `약 하나로는 초조가 안 잡혀 다른 약을 더해야 한다고 할 때 'agent' 앞에 붙는 말`
- **C4** `w-enough` "더 필요하지 않을 만큼 모자람이 없는 양" → `세 번째 약까지 써도 가라앉지 않자 '이걸로는 모자라다'고 할 때`
- **C5** `w-multiple` "하나가 아니라 둘 이상이 함께 있는" → `약을 몇 가지째 쓰는데도 진정되지 않는다고 의사에게 보고할 때 'agents' 앞에 붙는 말`
- **C6** `w-extra` "이미 있는 것에 더해서 따로 더 있는" → `난동이 심해 사람을 더 불러 달라고 할 때 'hands' 앞에 붙는 말`
- **C7** `w-early` "때가 아직 일러서…" → `프로포폴을 오래 쓰는 환자에게서 PRIS가 막 시작될 때 놓치기 쉽다고 할 때`
- (W2 `w-hold`·W3 `w-close` cue는 위에 적음)

### D. 뉘앙스 (v45 6번 · v46 7번 · swap ko)

**pair — 전 결합 판정(3 왼쪽 × 3 오른쪽 + decoy 1)**

| 왼쪽 \ 오른쪽 | him now | help | the airway | the Foley(decoy) |
|---|---|---|---|---|
| bag | ✓ 정답 | ✕ | ✕ | ✕ |
| call for | **✓ "call for him now"(그를 부르다)** | ✓ 정답 | ✕ | **△ "call for the Foley"** |
| open | △ "open him now"(수술 은어) | ✕ | ✓ 정답 | **✓ "open the Foley"(키트를 열다)** |

- **N1** N16.0 pair — 위처럼 정답 둘 → pairs `[[bag-mask, ventilation], [call a, rapid response], [open the, airway]]`, decoys `[the Foley]`로 바꿈(재판정: "bag-mask rapid response"·"bag-mask airway"·"call a ventilation"·"call a airway"·"open the ventilation"·"open the rapid response"·"open the the Foley"·"call a the Foley"·"bag-mask the Foley" 모두 ✕). words 그대로. why를 새 짝에 맞춰 다시 씀(`call a rapid response`는 미국 병원의 신속대응팀 호출).

**context — 핸드오프 모양이 아닌 것(대상 단어가 그 듣는 사람에게 맞지 않아서 어색해야 함). 대상 단어를 그 상황 문장이 쓰는 전문어로 옮기고, 세 장면 en 모두에 그 말이 들어가게**
- **N2** N1.1 `pump` → word `microgram` / ko `마이크로그램` / words `[w-microgram]`. 장면: 동료 `The pump says twenty-five micrograms — does that match the bag?` · 차트 `Propofol 25 micrograms/kg/min per pump; bag concentration verified.` · 보호자(ok:false) 지금 문장 그대로, fix 그대로
- **N3** N2.1 `pain` → word `analgesia` / ko `진통` / words `[w-analgesia]`. 동료 `Let's get analgesia on board before we touch the sedation.` · 차트 `Pain with suctioning, CPOT 4; analgesia given per order.` · 보호자 `He needs more analgesia for nociceptive pain.`(ok:false), fix 그대로
- **N4** N3.1 `sedation` → word `RASS` / ko `RASS 진정 척도` / words `[w-rass]`. 동료 `Let's keep his RASS at zero to minus one.` · 차트 `RASS goal 0 to -1; current -3, rate decreased.` · 보호자 `His RASS is minus three, so we're lightening him.`(ok:false), fix 그대로
- **N5** N4.1 `oxygen` → word `saturation` / ko `포화도` / words `[w-saturation]`. 동료 `His saturation is eighty-eight — grab the bag-mask.` · 차트 `Saturation 94% on 2 L; EtCO2 52.` · 보호자 지금 문장(saturation 있음), fix 그대로
- **N6** N5.1 `line` → word `lumen` / ko `루멘(관 내경)` / words `[w-lumen]`. 동료 `This lumen already has three drips — let's check each pair.` · 차트 `Sedative infusing via dedicated lumen; compatibility chart checked.` · 보호자 `The sedative runs through its own lumen of the central line.`(ok:false) · fix `The sleep medicine goes through its own small channel in the IV in his neck.`
- **N7** N7.1 `dexmedetomidine` → word `bradycardia` / ko `서맥` / words `[w-bradycardia]`. 동료 `No bradycardia so far — dex is at 0.6 and his heart rate is 62.` · 차트 `Dexmedetomidine 0.6 mcg/kg/h; no bradycardia, MAP 70.` · 보호자 지금 문장(bradycardia 있음), fix 그대로
- **N8** N8.1 `dose` → word `opioid` / ko `아편유사제` / words `[w-opioid]`. 동료 `Let's reassess his pain after this opioid dose.` · 차트 `Opioid given per order; pain reassessed after the dose.` · 보호자 지금 문장(opioid 있음), fix 그대로
- **N9** N15.1 `propofol` → word `PRIS` / ko `프로포폴 주입 증후군` / words `[w-pris]`. 동료 `Stop the propofol now — this could be PRIS.` · 차트 `Propofol stopped at 0310 for suspected PRIS; MD notified.` · 보호자 `Propofol is causing PRIS with lactic acidosis.`(ok:false), fix 그대로
- **N10** N16.1 `pressure` → word `crash` / ko `급락하다` / words `[w-crash]`. 동료 `Pressure's crashing — start the fluids and call for help.` · 신속대응팀 호출(icon siren) `He's crashing — pressure 68 over 40.` · 보호자 `His pressure is crashing.`(ok:false) · fix 그대로. why를 "crashing은 팀이 급박함을 나누는 말이라 가족에게는 겁만 준다"로 다시 씀
- 위 N2~N10은 why도 새 단어에 맞춰 다시 씀
- 참고(고치지 않아도 됨, 경계): N10.1 trial · N12.1 tolerance · N13.1 withdrawal · N14.1 delirium · N18.1 airway · N19.1 infusion도 어색함이 주로 옆의 전문어에서 옵니다. 다만 대상 단어 자체도 가족에게 낯설 수 있어 남겨 둡니다. 나머지 context(target·titrate·lactate·analgesia·paralytic·agent)는 모양이 맞습니다

**사실**
- **N11** N13.1 차트 장면 `CIWA 12` — CIWA-Ar는 환자 면담이 필요해 진정·삽관 환자에게 쓰지 못합니다(이 상황 환자는 진정 중). → `Hx alcohol use; tremor and diaphoresis noted, sedation adjusted.`

**swap — 선택지 연결(전수)·ko**
| 문항 | 연결 | 판정 |
|---|---|---|
| N2.2 | We're giving him **pain medicine** so he isn't hurting. | ✓ 정답 |
| | We're giving him **an opioid** so he isn't hurting. | 문법 ✓, 가족에게는 계열 이름 |
| | We're giving him **a sedative** so he isn't hurting. | 문법 ✓, 사실과 다름(진정제는 진통 아님) — 오답으로 맞음 |
| N8.2 | I'll tell you before I **turn you**, so you're not surprised. | ✓ 정답 |
| | I'll tell you before I **flip you over**, so you're not surprised. | 문법 ✓ |
| | I'll tell you before I **tip you over**, so you're not surprised. | 문법 ✓ |

swap `ko` 둘 다 바꾼 문장의 뜻과 맞음. notes·why 사실 맞음. (N8.2 `words`에서 `w-tell`만 뺌 — W1)

**slider** 21개 모두 순서·정답 칸·why 사실이 맞습니다(RASS -2/-1/-3/-4 정의, CPOT, RASS +1 restless·+2 agitated·+4 combative, PRIS 검사, 덱스 서맥 중단 기준은 프로토콜).

---

## 사용자 결정 필요 — keyPhrase 문장(en은 고치지 않음)

1. **18.1** "Give a bolus now and reassess the drip rate." — 진정제 볼루스는 처방(PRN 볼루스)이나 프로토콜이 있어야 줄 수 있는데 그 조건이 없습니다(저작자 메모). 제안: `Give a PRN bolus per order now and reassess the drip rate.`
2. **19.1** "Let's give atropine and fluids and recheck the pressure." — 바로 다음 문장(19.2)이 "Call the physician"이라 의사가 아직 없는 장면인데 아트로핀·수액을 처방 없이 주자는 말이 됩니다(저작자 메모). 제안: `Let's get orders for atropine and fluids and recheck the pressure.` 또는 장면을 "의사가 지시한 뒤"로 바꿈
3. **구 경계를 끊은 chunks**(keyPhrase라 보고만): 4.0 `His respiratory / rate` · 5.1 `a dedicated / lumen` · 10.0 `for a spontaneous / awakening trial` · 10.1 `with a breathing / trial` · 13.0 `about his drinking / history` · 16.1 `and call / for help` · 19.0 `His heart / rate is / in the thirties —`
   (chunks는 en이 아니니 고쳐도 V4는 통과합니다. 고칠지 결정해 주세요: `His respiratory rate / dropped to eight / after the last bolus` 식)

## 종합
안전 6건(17.4·13.6·13.3·10.4·16.3 문장, w-hold ko)과 pair 정답 둘, context 9개 재설계를 고친 뒤 내보낼 수 있습니다. 나머지는 품사 표·쉬운 단어·ko 번역투 정리로 기계적으로 반영 가능합니다.
고칠 것: 문장 18(S1~S18) + keyPhrase ko 8(K1~K8) + 단어 6(W1~W6) + v45 필드 45(품사 35 + D1·D2·D3 + C1~C7 — D3은 1건으로 셈) + 뉘앙스 11(N1~N11) → **88건**, 그중 **안전 6건**.
