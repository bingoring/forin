# or-preop-checklist — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `or-preop-checklist.yaml`(A·B 합본). 단어 153, 상황 21(문장 106), 뉘앙스 42(slider 21 · swap 12 · context 9 · **pair 0**).
비교: base · changes(69건: word-remove 17 · word ko/en 25 · sentence words 27) · in-json · notes-A · notes-B · 정본 seeds `nurse/topics/or.yaml`의 `persona`(대화 상대).
검사기: `verify_one_theme.py or or-preop-checklist.yaml` → `==> 통과`.
임시 스크립트: `_reviewA_or-preop-checklist_dump.py`(words/sents/combos), 출력 `_reviewA_or-preop-checklist_words.txt`·`_sents.txt`·`_combos.txt`, 청크 대안 검사 `_reviewA_or-preop-checklist_chunkcheck.py`(이어 붙이기·V8·V9 전부 통과 확인).
번호는 "상황.문장"(둘 다 0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

**대화 상대(persona)** — in-json에는 role만 있어 seeds에서 확인: 5·7·9·15·18 = **마취과의사**, 16 = **소독간호사**, 17·19 = **외과의**, 1·6·14·20 = 순회간호사, 나머지 = 환자. KP 대안은 이 상대에게 3인칭이 되지 않게 썼습니다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 철자·소리 닮음은 대체로 좋음(conform·meditation/mediation·peacemaker·type-and-cross). 그러나 품사가 다르거나 정답과 뜻이 겹치는 것 ★7(surgeon·surgical 서로, safe, device, together, emergency `emergent`, massive `missile`), 낮음 23 |
| 2 distractorsKo·길이 | 4 | 길이 위반 0(스크립트). 정답 단어의 다른 뜻을 오답으로 쓴 것 ★2(case `환자·상황`, time-out `휴식 시간`). 낮음: essential(ko는 명사, 오답은 형용사), uncomfortable `불쾌한`, comfortable `안정된`, level `위치` |
| 3 cue | 4 | 정답 영어 노출 0. w-procedure cue "수술보다 작게"는 사실과 다름(이 주제에서 procedure는 수술 자체를 묻는 말). ko를 되풀이만 하는 것 5(start·stop·treat·feel·prevention) |
| 4 chips/decoyChips | 4 | 대체 조립 경로 없음. **술 조각 ★1: w-metal `ale`**. 2~3조각 이어 붙이기 부분 문자열 검사로 낮음: `as`+`sen`(essential), `bee`+`re`(repeat → beer), `ie`(ready → die), `chick`·`dye`·`pea`·`nut`·`bar`·`lie`·`threat`(verification-A와 같은 기준으로 낮음), 이어 붙였을 때만 보이는 `in`+`ig`(ignore → '…inig…')·`com`+`ex`(explain → '…mex…')도 낮음. 성적 조각 없음 |
| 5 뉘앙스·문장 사실 | 2 | slider·swap 해설 대부분은 미국 관행에 맞음(침윤 시 주입 중단, 위급 수치 즉시 보고, 투약 시각은 실제대로, 인슐린은 지시대로, MTP는 혈액은행 연락). 그러나 **12.4(항응고제를 "예정대로" 먹었는지 — 계속 먹어야 하는 것처럼 들림)·16.4(소독간호사에게 "push it now")** 안전 2, 업무범위·약속 5(13.4·17.4·6.3·5.4·11.4), 사실 과장 1(16.3 "fully in"), KP 쪽 업무범위·상대 3인칭 4(17.2·16.2·15.2·7.2) |
| 6 뉘앙스 설계 | 3 | context 9개 중 5개가 '그 말을 듣는 사람에게 안 맞아서'가 아니라 내용 때문에 어색(1·3·8·14·16; 1·3·8은 같은 일반인 상대가 장면마다 다른 판정). swap 15 "I'm calling you now"(지금 말하는 상대에게 전화). slider 정답 둘 2(10·20), 순서 불분명 1(15). **slider 정답이 세 보기 중 가운데 길이인 것이 18/21** — 길이만 보고 맞힘 |
| 7 결정 11 | 4 | 쉬운 말 17 삭제·ko 가르기 24건 타당. 남은 흠: w-case가 18.4 "just in case"에 붙음, w-give가 10.4 "give you a better flow"에 붙음, w-thinner 헤드워드(`thinner`만으로는 시너), 11.3 ko `깨끗하게`가 w-clear `트인`·오답 `clean`과 엇갈림 |

## 사실 오류·심각한 문제
1. **[안전] 12.4 "Did you take your blood thinner as scheduled this morning?"**(비KP) — 수술 전 항응고제는 집도의 지시로 며칠 전부터 끊는 경우가 많아, 수술 전 확인은 "마지막으로 언제 먹었나"입니다. "예정대로 먹었나"는 수술 당일에도 평소대로 먹는 것이 맞다는 전제를 가르칩니다(같은 상황 slider 12와 w-thinner cue "마지막 복용 시각을 묻는다"와도 어긋남) → S1.
2. **[안전·역할] 16.4 "Please push it now so we're not delayed any further."**(비KP) — 상대가 **소독간호사**라 정맥 약을 줄 사람이 아니고, 반코마이신처럼 급속 정주하면 안 되는 예방 항생제가 있습니다(급속 주입 시 저혈압·홍조). 서두르는 이유를 '지연'으로 대는 것도 핵심(감염 예방)과 어긋남 → S2.
3. **[역할] KP 17.2 "I'm activating the massive transfusion protocol."** — or-bleeding에서 사용자가 바꾸기로 한 바로 그 문장. 같은 상황의 swap 17은 "activating … myself"를 틀렸다고 가르치고, 비KP 17.4 "Let's get the MTP started immediately"와 order 17 4줄 "Either way, I'm activating the MTP"(O형 불출이 안 돼도 혼자 발동)도 같은 문제 → KP 결정 표 + S5.
4. **[역할·사실] 16.3 "We can't cut until the antibiotic is fully in."** — 기준은 절개 전 60분 안에 투여 **시작**(반코마이신·플루오로퀴놀론은 120분)이고 반코마이신은 절개 때 아직 들어가는 중일 수 있음. 절개 여부도 간호사가 단정할 일이 아님 → S3. 같은 상황 KP 16.2 "I'm giving it now"(소독간호사에게; 수술실에서 절개 직전 정맥 투여는 보통 마취과)와 16.4 "push it now"가 누가 주는지 서로 어긋남.
5. **[업무범위] 13.4 "We can give a small dose of insulin if it's needed before surgery."** — 인슐린 투여·용량은 지시·프로토콜. 환자에게 '소량 줄 수 있다'고 미리 약속함(slider 13·swap 13이 틀렸다고 가르치는 바로 그 행동) → S4. **6.3 "We can't start this case without blood ready."** — 교차적합이 필요한지는 수술 종류·정책에 따르고(type-and-screen만으로 시작하는 건도 많음) 시작 결정은 집도의·마취과 → S6.
6. **[상대 3인칭] KP 7.2 "I'll let the surgeon and anesthesia know." / KP 15.2 "I'm calling the surgeon and anesthesia right now."** — 두 상황의 상대가 **마취과의사**. 지금 말하는 상대에게 "마취과에 알릴게요". swap 15의 "I'm calling you now"도 같은 혼선 → KP 결정 표 + N8.
7. **[설계] context 1(pending)** — 걱정하는 보호자에게는 ok:false, 환자에게는 ok:true로 같은 일반인 상대가 정반대 판정. why도 "pending은 평범한 말"이라 하고 어색함은 "nobody knows"(내용)에서 옴 → N1.

## 고칠 것 — 문장 (keyPhrase 아님 + KP의 ko·words·chunks)
문장 en을 바꾸면 `chunks`·`ko`·`words`를 함께 바꾸고, **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 전부 새로** 쓰고, 그 문장을 example로 쓰는 단어의 `example`/`exKo`(V17)와 그 문장을 example로 쓰는 slider의 `example`/`exKo`도 맞추고, `changes-or-preop-checklist.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 **distractorsKo 둘을 새 ko에 맞춰 다시** 쓰세요. 아래 청크는 모두 스크립트로 이어 붙이기·V8·V9를, 새 `words` 태그는 `word_appears`(V2)를 확인했습니다.

- **S1 ★[안전] 12.4** · en `When was your last dose of blood thinner?` · chunks `When was / your last dose / of blood thinner / ?` · ko `혈액희석제를 마지막으로 드신 게 언제예요?` · words `[w-dose, w-thinner]`(W5를 안 하면 `w-blood`도). v46 전부 새로(지금 why "처방된 일정대로 했는지"는 같은 오류). 상황 12 서로 다른 단어 11 → 충분.
- **S2 ★[안전·역할] 16.4** · en `A short delay is better than cutting without the antibiotic.` · chunks `A short delay / is better / than cutting / without the antibiotic / .` · ko `항생제 없이 절개하는 것보다 잠깐 늦어지는 게 나아요.` · words `[w-delay, w-better, w-cut, w-antibiotic]`. v46 전부 새로. **w-push는 쓰는 문장이 없어지므로 word-remove**(changes에). order 16 3줄 "Either way, please push it now." → 예: `Until then, a short delay is better than cutting without it.`(B와 맞출 것).
- **S3 [역할·사실] 16.3** · en `The antibiotic should be started before we cut.` · chunks `The antibiotic / should be started / before we cut / .` · ko `절개하기 전에 항생제 투여가 시작돼야 해요.` · words `[w-antibiotic, w-start, w-cut]`. v46 전부 새로(지금 why "fully in이 완전히 들어가야 한다"는 틀림). **w-cut example/exKo를 새 문장으로.** order 16 4줄 "Once it's fully in" → `Once it's in, I'll document the time.` 상황 16 서로 다른 단어: S2·S3 뒤 antibiotic·give·hold·incision·infuse·document·cut·start·delay·better = 10.
- **S4 [업무범위] 13.4** · en `Your doctor may order a dose of insulin before surgery if it's needed.` · chunks `Your doctor may order / a dose of insulin / before surgery / if it's needed / .` · ko `필요하면 수술 전에 의사가 인슐린 투여를 처방할 수 있어요.` · words `[w-dose, w-insulin, w-surgery]`(동사 order는 w-order '지시'와 품사가 달라 태그하지 않음). v46 전부 새로. **w-dose example/exKo를 새 문장으로.** order 13 4줄 "we can give a small dose before surgery" → `Depending on that, your doctor may order insulin before surgery.`
- **S5 [역할] 17.4** · en `Should we activate the massive transfusion protocol now?` · chunks `Should we activate / the massive transfusion protocol / now / ?` · ko `지금 대량수혈 프로토콜을 가동할까요?` · words `[w-activate, w-massive, w-transfusion, w-protocol]`(w-start는 다른 문장에 남음). 상대가 외과의라 결정권자에게 묻는 꼴. v46 전부 새로. **order 17 4줄 "Either way, I'm activating the massive transfusion protocol."은 KP 결정과 상관없이 고칠 것** → `Should we also activate the massive transfusion protocol?`(KP를 바꾸면 `Once you say so, I'll call the blood bank to activate the MTP.`도 가능).
- **S6 [사실·역할] 6.3** · en `Blood was ordered for this case, so I'll check with anesthesia before we start.` · chunks `Blood was ordered / for this case / , so I'll check with anesthesia / before we start / .` · ko `이 건은 혈액이 오더돼 있어서 시작 전에 마취과에 확인할게요.` · words `[w-blood, w-case, w-anesthesia, w-start]`(상대는 순회간호사라 마취과 3인칭 문제 없음). v46 전부 새로. **w-case example/exKo, slider 6 example/exKo를 새 문장으로.** order 6 2줄 "That means we can't start this case without blood ready." → `That means I'll check with anesthesia before we start.` 상황 6 서로 다른 단어 12.
- **S7 [역할·시점] 5.4** — 상대가 마취과의사인데 "I'll give it as soon as the surgeon is ready"(간호사가 주고, 기준을 절개 시각이 아니라 집도의 준비로 잡음). swap 5의 notes("누가 시킬 때까지 기다리면…")와도 엇갈림. B 메모의 "60분 창을 넘길 수 있다"는 방향이 반대(집도의 준비 직후면 절개에 가까움)이고 문제는 역할·기준. en `Let's time it so it goes in within the hour before incision.` · chunks `Let's time it / so it goes in / within the hour / before incision / .` · ko `절개 전 한 시간 안에 들어가도록 시점을 맞춥시다.` · words `[w-incision]`('Let's'라 누가 주는지 열어 둠, KP 5.0과 내용이 겹치지 않게 시점을 말함). v46 전부 새로. **w-surgeon example/exKo → 14.2 KP `I'll get the surgeon to confirm the correct side.` / `집도의에게 맞는 쪽을 확인받을게요.`** order 5 3줄 "So I'll give it as soon as the surgeon is ready." → `So let's time it to go in within the hour.` 상황 5 서로 다른 단어 8(antibiotic·ready·give·need·incision·document·exact·draw) — 딱 8.
- **S8 [약속·B 메모] 11.4** · en `You'll get them back in recovery after you wake up.` · chunks `You'll get them back / in recovery / after you / wake up / .` · ko `깨어나신 뒤 회복실에서 돌려드릴게요.` · words `[w-recovery, w-wake]`. 틀니는 의식·보호 반사가 돌아온 뒤 지침대로 돌려줌 — "깨자마자 바로"는 지킬 수 없는 약속이고 KP 11.1 "in recovery"와도 맞춤. v46 전부 새로. **w-wake exKo 맞춤.** order 11 4줄 "right back as soon as you wake up in recovery" → `You'll get them back in recovery after you wake up.`
- **S9 [ko] 11.3** ko `불편하신 거 알지만, 이렇게 해야 기도가 막히지 않아요.` — 지금 `깨끗하게`는 'clear airway'(막히지 않은 기도)의 뜻이 아니고, w-clear exKo에 그대로 실려 오답 `clean`이 맞아 보임. distractorsKo 둘 다시, **w-understand·w-uncomfortable·w-clear exKo** 맞춤.
- **S10 [ko·B 메모] 19.3** ko `지금 같은 때에도 타임아웃을 건너뛰는 건 그 위험을 감수할 가치가 없어요.`(B 제안 "생략할 만큼의 가치는 없어요"는 'risk'가 빠짐). distractorsKo 둘 다시, **w-skip·w-risk exKo** 맞춤.
- **S11 [ko·B 메모] KP 18.0** ko `이 환자는 심박동기가 있어서 소작이 기기에 간섭할 수 있어요.`(지금은 '소작이 방해된다'로 주어가 뒤바뀜). distractorsKo 둘 다시, **slider 18 exKo** 맞춤.
- **S12 [ko·저자 메모] KP 17.1** ko `지금 응급용 O형 Rh음성 혈액을 불출받을 수 있을까요?`(방출 → 불출; 불출은 혈액은행이 하므로 '받을'). distractorsKo 둘 다시, **w-release·w-emergency·w-onegative exKo** 맞춤.
- **S13 [ko] KP 20.2** ko `가족에게 연락하거나 이전 기록을 찾아볼게요.`(지금 `이전 기록에 연락`은 어색). distractorsKo 둘 다시, **w-reach·w-prior·w-record exKo** 맞춤.
- **S9~S13 ko가 남아 있는 다른 곳(grep 결과)** — 17.1 v46 tag `방출 요청` → `불출 요청`; order 17 why `응급 혈액 방출` → `불출`·3줄 ko `…방출할 수 있을까요?` → `불출받을 수 있을까요?`; order 18 1줄 ko `소작이 방해될 수 있어요` → S11 ko; order 20 4줄 ko `가족이나 이전 기록에 연락해 볼게요` → `가족에게 연락하거나 이전 기록을 찾아볼게요`; 18.0·11.3 distractorsKo(`자석이/영상이 방해될`, `기도가 깨끗하게`)는 새 ko 틀로 다시.
- **S14 (낮음) [ko] KP 12.0** ko `이 슬리브가 다리를 부드럽게 조여서 혈전을 예방해요.`(gently 빠짐). distractorsKo 둘, w-sleeve·w-squeeze·w-leg·w-prevent·w-clot exKo.
- **S15 [청크] 비KP** — 6.4 `Let me / follow up / with the lab / on the crossmatch / .`(지금 `on`이 홀로). 10.3 `Let me / try / a new IV site / on your other arm / .`(지금 `on your other / arm`). (낮음) 10.4 `This new line / should / give you / a much better flow / .` 12.3·14.3·0.5의 `before we / …`는 V8 조각 수 때문에 피하기 어려워 그대로 둬도 됨.
- **S16 [태그]** — **18.4에서 w-case 뺌**("just in case"는 '(수술) 건'이 아님; 상황 18은 12개). **10.4에서 w-give 뺌**("give you a better flow"는 '투여하다'가 아님; 상황 10은 13개). (낮음) 7.1 "until it results"(동사)의 w-result(명사 '결과') — 7.4에 남으니 빼도 됨. 20.0 "in place"의 w-place도 같은 이유로 빼도 됨(상황 20은 13개).
- **S17 (낮음) [내용] 20.4** — 정체 모를 이식물 장면에서 "pacemaker … records"는 이미 심박동기라고 아는 꼴. en `Let's keep any prior device and MRI records close by, just in case.` · chunks `Let's keep / any prior device and MRI records / close by / , just in case / .` · ko `만약을 위해 이전 기기 기록과 MRI 기록을 가까이 둡시다.` · words `[w-prior, w-device, w-record]`. v46 새로.
- **S18 (낮음) [모호] 7.3** "This lab is critical before we can proceed." — 같은 주제 15.0의 'critically high'(위급 수치)와 섞여 '위급 수치'로도 읽힘. 고친다면 en `This lab is required before we can proceed.` · chunks `This lab / is required / before we can proceed / .` · words `[w-lab, w-required, w-proceed]` → w-critical은 쓰는 문장이 없어져 word-remove, slider 7 `words`에서도 빼야 함. 그대로 두는 경우 chunks만 `This lab / is critical / before we can proceed / .`로(지금 `before we / can proceed`).

## 고칠 것 — 단어
**distractorsEn 품사·뜻 표**(★ = 꼭 바꿀 것)
| id | 정답(품사) | 문제 오답 | 문제 | 바꿀 말 |
|---|---|---|---|---|
| ★ w-surgeon | surgeon(명) | surgical | 형용사(그리고 은행의 다른 카드) | `sturgeon` |
| ★ w-surgical | surgical(형) | surgeon | 명사 | `cervical` |
| ★ w-safe | safe(형) | save · sale | 동사·명사 | `sane` · `same` |
| ★ w-device | device(명) | devise · divide | 둘 다 동사 | `advice` · `decade` |
| ★ w-together | together(부) | tougher · toward | 형용사·전치사 | `altogether` · `thereafter` |
| ★ w-emergency | emergency(명) | emergent | 의료에서 '응급의' 뜻(정답과 뜻이 같음) | `emergence` |
| ★ w-massive | massive(형) | missile | 명사 + 무기 | `abrasive` |
| w-step | step(명) | steep | 형용사 | `stamp` |
| w-pending | pending(형) | ending | 명사 | `impending` |
| w-feel | feel(동) | fee | 명사 | `feed` |
| w-site | site(명) | cite | 동사(동음이라 decoyChips감) | `side` |
| w-fluid | fluid(명) | fluent | 형용사 | `fluke` |
| w-flow | flow(동, ko 흐르다) | flaw | 명사 | `float` |
| w-remove | remove(동) | remote | 형용사 | `resolve` |
| w-metal | metal(명) | mental | 형용사 | `mantle` |
| w-belongings | belongings(명) | believing | 동사 | `beginnings` |
| w-better | better(형) | butter | 명사 | `bigger` |
| w-keep | keep(동) | keen | 형용사 | `heap` |
| w-place | place(동) | plate | 명사 | `plan` |
| w-pass | pass(동) | past | 형용사·명사 | `pace` |
| w-thinner | thinner(명) | thicker | 형용사 | `thriller`(W5를 하면 함께 다시) |
| w-insulin | insulin(명) | insulate | 동사 | `inulin` |
| w-value | value(명) | vague | 형용사 | `venue` |
| w-push | push(동) | plush | 형용사 | (S2로 단어 삭제) |
| w-release | release(동) | relief | 명사 | `relieve` |
| w-activate | activate(동) | activity | 명사 | `motivate` |
| w-bipolar | bipolar(형) | bicycle | 명사 | `binocular` |
| w-cardiology | cardiology(명) | cardiac | 형용사 | `radiology` |
| w-magnet | magnet(명) | magnify | 동사 | `magenta` |
| w-prior | prior(형) | priest | 명사 | `proper` |
| ★ w-case (dKo) | (수술) 건 | 환자 · 상황 | case의 다른 뜻('환자 사례'·'경우')이라 정답 둘 | `수술실` · `일정` |
| ★ w-timeout (dKo) | 타임아웃 | 휴식 시간 | time-out의 일상 뜻 | `인계 시간` |

정답 단어의 다른 뜻을 쓴 오답(정답 둘): 영어 `emergent`, ko `환자·상황`(case)·`휴식 시간`(time-out) — 모두 위 표 ★.

- **W1 ★** 위 표의 ★ 7줄. **W2** 위 표의 나머지(낮음).
- **W3 ★ distractorsKo 다른 뜻** — **w-case** `[환자, 상황]` → `[수술실, 일정]`(case는 '환자 사례'·'경우'라는 뜻도 있어 둘 다 정답이 됨). **w-timeout** `휴식 시간` → `인계 시간`(time-out의 일상 뜻이 '휴식 시간'). 낮음: w-uncomfortable `불쾌한` → `어지러운`, w-comfortable `안정된` → `조용한`, w-level `위치` → `종류`.
- **W4 decoyChips** — **★ w-metal `ale`(술) → `all`**. 낮음: w-ignore `in` → `on`, w-explain `com` → `cam`, w-essential `as`(as+sen) → `is`, w-repeat `bee`(bee+re) → `pet`, w-ready `ie`(read+ie) → `ey`, w-check `chick` → `cheek`, w-diabetes `dye` → `day`, w-expedite `pea` → `pa`, w-magnet `nut` → `nat`, w-number `bar` → `bur`, w-heavy `lie` → `lee`, w-treat `threat` → `trait`.
- **W5 (중간) w-thinner 헤드워드** — `thinner`만으로는 '시너(희석제)'이고 ko `혈액희석제`와 어긋남. 결정 11로 구 헤드워드: en `blood thinner` · ipa `/ˈblʌd ˌθɪnər/` · chips `[[blood], [thin, ner]]` · decoyChips `[flood, tin]` · dEn `[blood donor, blood sugar]` · ko 그대로 · id 그대로. 12.1 KP·12.4에서 w-blood 태그는 뺌(구 안의 낱말) — **slider 12 `words`에서도 w-blood를 빼야 V15를 지킴**(상황 12에서 w-blood를 쓰는 문장이 없어짐). example 그대로. changes에 en·ipa.
- **W6 w-essential** dKo `[부수적인, 임의의]`(형용사) → `[부수 요소, 선택 항목]`(ko `필수 요소`가 명사).
- **W7 cue**
  - w-procedure `수술보다 작게, 몸에 도구를 넣거나 대어 하는 처치 — …` → `오늘 무엇을 받는지 환자 입으로 말하게 할 때 묻는 말 — 수술과 시술을 두루 이른다`(사실 고침)
  - w-start `어떤 일을 처음으로 시작해…` → `잘 안 흐르는 IV를 빼고 새 라인을 잡을 때 쓰는 동사`
  - w-stop `하던 일을 그 자리에서 곧바로 멈추는 일` → `동의서와 차트가 어긋난 걸 보면 팀 모두가 손을 놓게 하는 말`
  - w-treat `어떤 것을 일정한 방식으로 대하고 다루는 일` → `정체 모를 기기를 '모르는 것'으로 여기고 대할 때의 동사`
  - w-feel `몸에서 느껴지는 감각을…` → `주사 자리에 화끈거림이 오면 알려 달라고 할 때, 환자가 몸으로 ~하는 일`
- **W8 (낮음) w-repeat** ko `반복하다` — 문장은 `a repeat level`(재검). ko `다시 하는(재검)`도 가능, 그대로 둬도 오류는 아님.
- **W9 (낮음) w-activate** ko `발동시키다` — swap 17 ko·KP 대안이 '가동'이면 `가동하다`로 맞추기.

## 고칠 것 — 뉘앙스
- **N1 ★ context 1** — word `flag`, ko `표시해 두다`, words `[w-flag, w-pending]`. 어색 장면은 지금처럼 0번: [0] 걱정하는 보호자에게(speaker) `I've flagged his potassium as pending.` ok:false, fix `We're still waiting on one blood test, and I'm checking on it right now.` [1] 마취과 동료에게(monitor) `Potassium is still pending — I've flagged it.` ok [2] 차트 기록(board) `K+ pending; flagged for OR team, lab notified.` ok. why: "flag는 의료진끼리 '눈에 띄게 표시해 뒀다'는 업무 말이에요. 보호자에게는 무엇을 했는지 와닿지 않으니 기다리는 중이고 확인하고 있다고 풀어 말해요."
- **N2 context 3 (`interfere`)** — 환자 장면이 둘이고 어색함은 'burn'(겁주는 내용)에서 옴. 어색 장면은 지금처럼 0번: [0] 불안한 환자에게 `Metallic jewelry may interfere with electrosurgical grounding, so it must be removed.` ok:false, fix 그대로 [1] → 차트 기록(board) `Navel ring removed; metal may interfere with cautery.` ok [2] 그대로. why: "동료·기록에는 짧은 임상어가 맞지만, 불안한 환자에게 규정 문구를 그대로 읽으면 딱딱하고 겁나요."
- **N3 context 8 (`implant`)** — 환자(ok)와 보호자(false)가 같은 일반인인데 판정이 다르고, 어색함은 'intracorporeal prosthetic devices'에서 옴. 어색 장면은 지금처럼 2번. [1] → 차트 기록(board) `Implants: R hip 2019, dual-chamber pacemaker 2021.` ok [2] 보호자에게 `Please list all implants with device type and implant date.` ok:false, fix 그대로.
- **N4 context 14 (`mismatch`)** — 어색함이 '누가 틀렸다'는 탓(내용). [2](지금처럼) 수술 전 환자에게 `There's a laterality mismatch on your consent form.` ok:false, fix `Can you tell me which side we're operating on today? I want to make sure your paperwork matches.`(환자가 자기 입으로 부위를 말하게 하는 것이 Universal Protocol). why도 새로.
- **N5 context 16 (`hold`)** — 셋 다 의료진이고 어색함은 말투('실수한다'). [1](지금처럼) → 보호자에게(speaker) `We're holding incision until the antibiotic is infused.` ok:false, fix `The surgery will start in a few minutes — he's getting a medicine to prevent infection first.` why: "hold incision은 수술팀 사이의 말이에요. 보호자에게는 무엇을 왜 기다리는지 쉬운 말로 해요."
- **N6 (낮음) context 11 (`airway`)** — KP 11.0·11.3이 환자에게 airway를 쓰므로 어색함은 'aspirate'와 겁주는 내용에서 옴. word `aspirate`, ko `흡인하다`, 어색 장면은 지금처럼 1번: [0] 마취과 `Dentures are out, so there's less risk she'll aspirate.` ok [1] 겁먹은 환자 `Dentures can slip, and you could aspirate.` ok:false, fix `Taking them out helps us keep your breathing safe while you're asleep.` [2] 회복실 `No signs she aspirated; dentures bagged and labeled.` ok. words `[w-denture, w-airway]`.
- **N7 (낮음) context 18** ko `양극 소작의` → 카드와 같게 `양극성의`. 장면은 핸드오프 모양으로 좋음(보호자에게 bipolar = 정신과 말로 들림). context 6(`expedite`)·12(`compression`)도 모양 좋음.
- **N8 ★ swap 15** — 상대가 마취과인데 before[2] `. I'm calling you now.`(지금 말하는 상대에게 전화) → `. I wanted you to hear it right away.` ko 그대로.
- **N9 swap 5** — 상대 persona가 마취과의사이고 수술실 예방 항생제는 보통 마취과가 투여(묶음 4·5 결정과 일관). who `간호사 → 마취과 · 항생제 준비`(icon monitor), before `["The antibiotic is ready — ", "it can wait until after the first cut", "."]`, options `[it can wait until after the first cut, let's get it in now so it's in before incision, give it whenever it's convenient for you]`, answer `let's get it in now so it's in before incision`, ko `지금 넣어서 절개 전에 들어가게 합시다`, notes·why 새로(세 줄 이어 읽기 문법 확인).
- **N10 (낮음) swap 9** — 상대가 마취과. before[0] `I'll give it now and ` → `Let's give it now, and I'll `(세 보기 모두 이어 읽기 문법 확인함). 나머지 swap ko 11개 정확, 이어 읽기 36줄 문법 맞음.
- **N11 slider 10** — [1] `It will sting, but it's quick.`도 솔직하고 흔한 정답 → `It's going to sting quite a lot.`
- **N12 slider 11** — 정답 `…return them right away`는 S8과 같은 약속 → `I understand — we'll label them and give them back in recovery.`
- **N13 slider 20** — 가운데 `Check the records and call the family when you can.`이 KP 20.2의 행동이라 정답 둘. scale → `[Assume it's fine and carry on., Note it and look into it after the case., Treat it as MRI-unsafe until it's proven safe.]`, answerAt 2.
- **N14 slider 15** — [0] `Recheck it at the next scheduled draw tomorrow.`와 [1] `Mention it at handoff.`의 강약이 불분명 → `[Note it and recheck tomorrow., Ask for a repeat level and wait for it., Call the surgeon and anesthesia now.]`. (slider 15 example은 KP 15.2 — KP를 바꾸면 함께)
- **N15 slider 길이 단서** — 정답이 가운데 길이 18/21. 짧은 약한 끝(9~23자)을 정답 길이 가까이로: s12 `Chart it.` → `Chart it and move on to the next task.` · s11 `It's your choice.` → `That's fine — keep them in if you'd like.` · s17 `Make a note of it.` → `Make a note of it and keep watching the field.` · s19 `OK, we'll skip it.` → `OK, we'll skip it this time since it's urgent.` · s5 `Give it after the case.` → `Give it after the case is finished, in recovery.` · s7 `Mention it at handoff.` → `Mention it at handoff to the next nurse later.` · s9 `Do nothing — it's fine.` → `Leave it — the original timing is still fine.` · 강한 끝을 짧게: s1 [2] → `Call the surgeon at home now.` · s3 [2] → `Any metal is deadly — cut it off.` · s6 [2] → `Cancel the whole case.` · s13 [2] → `Give insulin on your own now.` · s17 [2] → `Start giving blood on your own.` · s18 [2] → `Refuse to start without cardiology.` · s19 [2] → `Do nothing until the full checklist is done.` (N11~N16과 함께 적용하면 정답 길이 순위가 가운데 7 · 가장 긺 9 · 가장 짧음 5로 흩어짐 — 스크립트로 셈)
- **N16 (낮음) slider 0** — [1] `It's an important safety step.`도 불안한 환자에게 흔히 하는 참말. `It's a strict rule, so please answer carefully.`로 하면 갈림.
- **N17 slider·swap example 동기화** — slider 6 example(6.3)은 S6, slider 18 exKo(18.0)는 S11, slider 15 example(15.2)·slider 9 example(9.2)은 KP 결정에 따라.

## order 동기화 (B 몫이지만 문장 고침과 함께 바꿀 줄)
5줄3(S7) · 6줄2(S6) · 11줄4(S8) · 13줄4(S4) · 15줄2 "calling the surgeon and anesthesia"(KP 15.2) · 15줄3 "Until they weigh in and this is corrected, we hold the case."(간호사가 보류를 정함 → `Until they weigh in, I'd suggest we hold the case.`) · 16줄3·4(S2·S3) · 17줄4(S5, KP와 무관하게) · 7줄3 "let the surgeon and anesthesia know"(KP 7.2).

## 기계적 전수 확인 결과
- **pair: 0건**(이 주제에 pair 없음).
- **chunks**: 105문장 전부 `/`로 이어 출력해 확인(`_sents.txt`). 비KP 끊김은 S15·S18, KP 끊김은 아래 KP 표.
- **distractorsEn 품사**: 위 표(★7 · 낮음 23).
- **swap 이어 읽기** 36줄: 문법 전부 맞음. 문제는 swap 15의 뒷말(N8).
- **분포** — slider answerAt 0:4 · 1:10 · 2:7(가운데 48%, 몰림은 아님). slider 정답 길이 순위: 가운데 18 · 가장 짧음 2(s4·s10) · 가장 긺 1(s9) → N15. swap 정답 칸 0:4 · 1:4 · 2:4. context 어색 장면 0:3 · 1:3 · 2:3.
- **오답 조각 불쾌 검사**: 정답 조각+decoyChips 1~3개를 이어 붙인 부분 문자열까지 검사 → W4.

## 결정 11 판정
- changes 69건: 공통 목록 9 + 목록 밖 8 삭제 타당(17/170 ≈ 1할). ko 가르기 타당(check/confirm/verify, flag/label, run/flow, level/number/value, push/give/infuse, cut/incision, record/document, prevent/prevention, risk/dangerous, critical/critically). w-heavy → heavily 타당. 15.1의 w-correct 태그 빼기 타당.
- 더 뺄 후보로만 적어 둠(한도를 이미 씀): bag·arm·leg·call·need·wait·try·feel·ready·team.
- **저자 메모 판정**
  - MTP KP(17.2) → 맞음, **바꿈 권고**(KP 표). swap 17을 새 문장 정답으로 쓴 것도 타당.
  - 인슐린 13.4 → 맞음, S4. 13.2 KP "We'll adjust…" → '우리 팀이 지시대로'로 읽혀 **유지**(KP 표).
  - 16.4 "push it now" → 맞음(상대가 소독간호사라 더 심각), S2. 16.3 "fully in" → 맞음, S3.
  - 5.1 60분 → 문장은 일반론이라 **유지**. 단 5.1의 v46 why "투여가 끝나야 하는 시간 틀"은 틀림 → "절개 전 60분 안에 투여를 시작해야 한다(반코마이신·플루오로퀴놀론은 120분)"로(B·수정 담당). slider 5 why의 '항생제에 따라 달라요'는 맞음.
  - 9.2 "adjust the timing" → 상대가 마취과라 KP 표에서 낮은 바꿈 권고(유지해도 위험은 없음).
  - 15.1 hold·15.4 repeat → 15.1은 위급 수치에 대한 말하기(advocacy)라 **유지**, 15.4 "Let's get a repeat level"은 제안이고 용혈 등으로 재검은 흔해 **유지**. 다만 order 15줄3은 고칠 것.
  - 교차적합 6.1·6.3 → 6.1(질문) 유지, 6.3은 S6.
  - 소작·자석 18.1·18.2 → 18.2(질문)는 맞음. 18.1 "We should use bipolar…"는 상대(마취과)에게 하는 제안이고 패드 위치는 순회간호사 일이라 **유지**(청크만 KP 표).
  - 17.1 O형 불출 질문 → 외과의에게 응급 불출 요청을 묻는 꼴이라 **유지**, ko만 S12.
  - '방출 → 불출' → 맞음. w-release ko는 이미 고침, 문장 ko·exKo는 S12.
  - 제목 '보청기'인데 문장은 틀니만 → **문장 추가하지 않음**. 미국 병원은 의사소통을 위해 보청기를 수술실·마취 유도 직전까지 끼게 하는 경우가 많아 '빼야 한다' 문장은 오히려 틀릴 수 있음. 제목·brief는 정본(in-json) 사항이라 보고만.
  - w-critical ko `중대한` → 타당. 단 7.3 문장의 모호함은 S18(낮음).
- **B 메모 7건 판정**
  1. 18.0 ko 주어 빠짐 → 맞음, S11.
  2. 19.3 ko 어색 → 맞음, S10(B 제안문은 'risk'가 빠져 다르게 씀).
  3. 5.4 vs 60분 → 문제는 맞으나 이유가 반대(창을 넘기는 게 아니라 역할·기준) → S7.
  4. 11.4 "깨어나자마자" → 맞음, S8.
  5. 13.4 인슐린 → 맞음, S4(order 13줄4도).
  6. 16.4 push → 맞음, S2.
  7. 9.0/16.0 같은 문장 → 둘 다 KP이고 상황이 달라 **문제 없음**.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)
| KP | 현재 en | 대화 상대 | 문제 | 대안 en | 권고 |
|---|---|---|---|---|---|
| 17.2 | I'm activating the massive transfusion protocol. | 외과의 | MTP 발동은 집도의·마취과 판단(or-bleeding과 같은 결정). swap 17이 "activating … myself"를 틀렸다고 가르쳐 같은 상황에서 충돌 | I'm calling the blood bank to activate the massive transfusion protocol. · chunks `I'm calling / the blood bank / to activate / the massive transfusion protocol / .` · ko `혈액은행에 전화해서 대량수혈 프로토콜을 가동할게요.` · words `[w-call, w-bloodbank, w-activate, w-massive, w-transfusion, w-protocol]` | **바꿈**. 유지한다면 swap 17 3번 보기를 `I'm deciding on the massive transfusion protocol myself`로 바꿔 KP와 정면으로 부딪히지 않게 하고, chunks는 `I'm / activating / the massive transfusion protocol / .`로 바꾸면 명사구를 지킴(V8 통과) |
| 16.2 | I'm giving it now and documenting the time. | 소독간호사 | 절개 직전 수술실 정맥 투여는 보통 마취과(묶음 4·5 결정과 같은 결). 같은 상황 16.4와 누가 주는지 엇갈림 | Anesthesia is giving it now, and I'll document the time. · chunks `Anesthesia is giving it / now / , and I'll document / the time / .` · ko `마취과에서 지금 투여하고 있고, 시각은 제가 기록할게요.` · words `[w-anesthesia, w-give, w-document]`(상대가 소독간호사라 마취과 3인칭 문제 없음) | **바꿈**(순회간호사가 투여하는 병원도 있어 유지해도 틀린 말은 아님) |
| 15.2 | I'm calling the surgeon and anesthesia right now. | 마취과의사 | 지금 말하는 상대에게 "마취과에 전화할게요" | I'm calling the surgeon right now. · chunks `I'm calling / the surgeon / right now / .` · ko `지금 바로 집도의에게 전화할게요.` · words `[w-call, w-surgeon]` | **바꿈**. slider 15 example·order 15줄2도 함께 |
| 7.2 | I'll let the surgeon and anesthesia know. | 마취과의사 | 위와 같음 | I'll let the surgeon know. · chunks `I'll let / the surgeon / know / .` · ko `집도의에게 알릴게요.` · words `[w-surgeon]` | **바꿈**. w-anesthesia example → S6 새 6.3(또는 16.2 대안). order 7줄3도 |
| 9.2 | I'll adjust the timing and document it. | 마취과의사 | 투여 시점을 간호사 혼자 조정하는 말로 들림(brief는 '시각을 조정하세요'라 틀린 말은 아님) | Let's adjust the timing, and I'll document it. · chunks `Let's adjust / the timing / , and I'll / document it / .` · ko `시각을 함께 맞추고, 기록은 제가 할게요.` | 낮음 — **유지 가능**(바꾸면 slider 9 example도) |
| 13.2 | We'll adjust if the number is too high or low. | 환자 | 조절은 지시대로 | If the number is too high or low, we'll follow your doctor's orders. | **유지**('we'=팀). ko만 `수치가 너무 높거나 낮으면 저희가 조절해 드릴 거예요`로 다듬어도 됨 |
| 15.1 | We should hold the case until this is corrected. | 마취과의사 | 보류 결정은 집도의·마취과 | Should we hold the case until this is corrected? | **유지**(결정권자에게 하는 정당한 말하기) |
| 18.1 | We should use bipolar and place the pad away from the device. | 마취과의사 | 소작 방식은 집도의 결정. chunks `away from / the device`가 전치사구를 끊음 | (en 유지) chunks `We should / use bipolar / and place the pad / away from the device / .` | **유지**, chunks만 바꿈 권고 |
| 5.1 | We need it in within 60 minutes before incision. | 마취과의사 | 60분은 세파졸린 등 기준, 반코마이신·플루오로퀴놀론은 120분. chunks `We need / it in` | — | **유지**, v46 why만 고침(위 저자 메모 판정) |
| 10.0 | This line isn't flowing well, so I'll start a new one. | 환자 | chunks `This line isn't / flowing well`이 동사구를 끊음 | (en 유지) `This line / isn't flowing well / , so I'll start / a new one / .` | chunks **바꿈** 권고 |
| 12.2 | I'll confirm the VTE prevention orders. | 환자 | chunks `the VTE / prevention orders`가 명사구를 끊음 | `I'll / confirm / the VTE prevention orders / .` | chunks **바꿈** 권고 |
| 10.1 | You'll feel a small pinch. | 환자 | chunks `a small / pinch`가 명사구를 끊음 | `You'll / feel / a small pinch / .` | 낮음 — 유지 가능 |
| 19.0 | We still need the time-out even in an emergency. | 외과의 | chunks `even in / an emergency` | `We still need / the time-out / even / in an emergency / .` | 낮음 — 유지 가능 |
| 16.0 · 18.0 · 19.2 | Stop—the… / a pacemaker—cautery… / procedure—let's… | — | 대시 앞뒤에 공백이 없어 대시에서 나누면 이어 붙이기가 깨짐(assembles_to로 셋 다 확인) | — | **피할 수 없음**, 보고만 |
| 8.0 | Do you have a pacemaker or any metal implants? | 환자 | `or any / metal implants`가 한정사를 떼어 냄 | `Do you have / a pacemaker / or / any metal implants / ?`(V8 통과) | 낮음 — 유지 가능 |
| 11.2 · 5.1 · 15.1 | `during / the procedure` · `We need / it in` · `until this / is corrected` | — | 구를 끊지만 4조각(V8)을 지키는 더 나은 자리가 없음(스크립트로 확인) | — | 유지 |
| 6.1 · 7.1 · 16.1 · 18.2 · 17.1 | 질문 꼴 | — | 결정권자에게 묻는 말이라 업무범위 안 | — | **유지** |

KP의 ko만 고치는 것(결정 11 범위)은 S11(18.0)·S12(17.1)·S13(20.2)·S14(12.0)에 넣었습니다.

## 종합
고칠 것 **44건**(문장 18 · 단어 9묶음(distractorsEn 30줄 포함) · 뉘앙스 17) + order 동기화 9줄, 그중 **안전 2**(S1·S2). 핵심은 S1·S2·S3·S4·S5·S6·S7, context N1~N5, swap 15(N8), slider 정답 둘·길이 단서(N11·N13·N15), distractorsEn ★7, `ale`, w-case·w-timeout 오답 뜻입니다. 고친 뒤 내보내도 됩니다. KP 결정은 **바꿈 4**(17.2·16.2·15.2·7.2), 낮은 바꿈 1(9.2), 나머지 유지(chunks 바꿈 권고 3: 10.0·12.2·18.1).
