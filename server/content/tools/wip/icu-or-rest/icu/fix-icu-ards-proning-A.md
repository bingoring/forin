# fix — icu-ards-proning (A 검토)

범위: v45 절 1~7, 기계적 전수 확인(pair·chunks·distractorsEn 품사·swap), v46 7번(context 핸드오프 모양·swap `ko`), 저작자 메모 A의 지적 10건(메모 B는 없음), decoyChips·distractorsEn 비속어·불쾌 조각 점검.
대상: 단어 262개, 뉘앙스 42문항(slider 21·context 18·swap 3·pair 0), 문장 105개(이 중 keyPhrase 63). base에는 뉘앙스가 없어 뉘앙스는 전부 새로 쓴 것입니다. 상황 번호는 0부터(S0 = ARDS 산소화 지표 이해), 문장 번호도 0부터입니다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 2 | 철자·소리는 닮았지만 **품사가 다른 오답이 100단어**(형용사 정답에 명사, 부사 정답에 명사 등). 동의어라 정답이 둘인 것 3건(evade·residue·overinflation), 없는 말 1건(pervis), 불쾌한 말(death·hell) |
| 2 | distractorsKo·길이 | 4 | 길이 규칙(1.25배·3자)은 262개 전부 통과. 동의어 오답 없음. w-flag 오답("눈에 안 띄게 숨기다")처럼 어색한 뒤집기가 조금 있음(고치지 않아도 됨) |
| 3 | cue | 4 | 영어·약어를 드러낸 cue 없음. ko를 그대로 되풀이한 cue 2건(w-rate·w-moist). 대신 **ko 자체가 정답을 드러내는 단어 2개**(w-tof `TOF 수치`, w-train-of-four `…(TOF)`) — 결정 11에서 고침 |
| 4 | chips/decoyChips | 3 | 형태소 단위로 대체로 잘 잘렸음. decoyChips에 **noose(올가미)·die·death·gat(총 속어)** — 앱에 띄우기 부적절. 복사해 온 무의미 조각(w-overdistension `a, vel`) |
| 5 | 뉘앙스 사실 정확성 | 4 | Berlin 기준(P/F ≤100 중증)·복와위 기준 P/F 150·NPIAP 1단계(눌러도 안 사라지는 발적)·EOLIA(P/F <80)·마비 중 깊은 진정은 정확. 다만 S17 slider가 "끝만 남은 튜브"를 partly out으로 가볍게 가르치고(안전), S19 context가 의심 단계의 기흉을 가족에게 긴장성 기흉으로 단정 |
| 6 | 뉘앙스 설계 | 4 | pair 없음. slider 21장은 대부분 강도 저울로 답이 하나. context 18장 모두 "가족에게 임상어"라는 핸드오프 모양이고 swap 3장 문법·`ko` 정확. S2 context 세 장면이 같은 뜻이 아님(금기 있음 ↔ 금기 없음), S3 context 어색한 장면에 `secure`가 없음(W14) |
| 7 | v44 단어·문장(결정 11) | 3 | 저작자 changes 41건(ko 20·삭제 21)은 대체로 타당. 그러나 keyPhrase 아닌 문장에 **사실·업무범위 오류 6건**(마비제 증량 약속, 부종 "곧" 단정, 윤상연골 압박, 복와위 심정지 압박 지연, 폐포 동원 중단 기준, 저혈압을 앙와위로 해결), 뜻이 안 맞는 태그 5건, 남은 쉬운 단어 10개 |

## 사실 오류·심각한 문제

1. **S16 문장 4** `We don't wait — compressions start the second he's flat.`(keyPhrase 아님) + keyPhrase 0·2: 세 문장이 모두 "앙와위가 된 뒤에야 압박"을 가르칩니다. AHA 2020 지침은 바로 돌릴 수 없으면(특히 삽관된 입원 환자) **복와위 그대로 CPR을 시작하는 것이 타당**하다고 합니다(손은 T7–T10 사이). 돌리느라 압박이 늦어지면 안 됩니다. → S-4, K-2
2. **S9 문장 4** `If his twitches come back too soon, I'll increase the dose.`: 간호사가 신경근차단제 증량을 혼자 약속하는 문장입니다(오더·프로토콜 범위가 빠짐). "too soon"도 TOF 감시의 기준(목표 1–2/4보다 많이 돌아옴)을 흐립니다. → S-1 (메모 A-4 타당)
3. **S13 문장 3** `The swelling looks scary, but it will go down soon.`: 가족에게 지킬 수 없는 단정(잘못된 안심). → S-2 (메모 A-3 타당)
4. **S17 문장 3** `Someone hold cricoid pressure while I set up.`: 윤상연골 압박은 AHA가 심정지·응급 기도에서 **일상적으로 권하지 않는** 처치이고, 백마스크 환기와 삽관을 오히려 방해할 수 있습니다. 표준처럼 가르치면 안 됩니다. → S-3 (메모 A-6 타당)
5. **S10 문장 4** `If his pressures spike, we stop the maneuver right away.`: 폐포 동원 수기는 일부러 압력을 올리는 처치라 "압력이 오르면 중단"은 기준이 아닙니다. 실제 중단 기준은 저혈압(MAP 저하)·SpO2 저하·심박수 급변·부정맥입니다. → S-5
6. **S12 문장 4** `His pressure usually bounces back once we turn him flat again.`: 복와위 직후의 일시적 저혈압은 보통 엎드린 채 수 분 안에 회복되고, 앙와위로 되돌리는 것은 교정되지 않을 때의 마지막 조치입니다. "다시 눕히면 회복"이라고 가르치면 복와위를 쉽게 끝내게 됩니다. → S-6
7. **S17 slider** cue `Only the tip of the tube is still inside him, and it is slipping.` → 정답 `partly out`, why는 out만 "곧바로 기도 확보"라고 합니다. 끝만 남은 튜브는 사실상 발관이라 즉시 도움을 부르고 기도를 확보해야 합니다. 일부 빠짐을 덜 급한 것으로 가르칩니다. → N-3
8. **S19 문장 1(keyPhrase)** `Lower the tidal volume and prepare for a chest tube.`의 ko가 `일회 호흡량을 낮추고 흉관 삽입을 준비할게요.` — 영어는 명령형인데 ko는 간호사가 직접 호흡량을 낮추겠다는 1인칭입니다. 호흡기 설정 변경은 의사 오더·호흡치료사 몫입니다. ko는 고치고(D-7) en은 사용자 결정(K-1). (메모 A-5)
9. **불쾌한 조각**: decoyChips `noose`(w-venous, 올가미), `die`(w-ready), `death`(w-depth — distractorsEn에도), `gat`(w-gather, 권총 속어), distractorsEn `hell`(w-help). → 표·W-O

## 고칠 것

### 단어 (v45 필드)

#### W-표 · distractorsEn — 품사가 다른 것 100단어 + 동의어·불쾌 7단어 (전부)

바꿀 것은 표의 마지막 칸 그대로입니다. 전부 정답과 같은 품사이고, 길이 규칙(1.25배·3자)을 스크립트로 확인했습니다. distractorsKo는 정답 뜻의 오답이라 그대로 둬도 됩니다. YAML에 쓸 때 `in`·`up`은 그대로 문자열이지만, 혹시 `on`·`off`·`no`를 쓰게 되면 따옴표로 감싸세요(V11).
지울 단어(D-10·D-11)의 줄은 표에 넣지 않았습니다(w-give·get·need·look·again·first·tonight·team·strong·soon·second·cricoid·flat).

| id | 정답 | 현재 distractorsEn | 문제(정답 품사 / 오답) | 바꿀 것 |
|---|---|---|---|---|
| w-move | move | mode, mow | 동사 / mode=명사 | **mope, mow** |
| w-lower | lower | louder, tower | 형용사 / tower=명사 | **louder, slower** |
| w-number | number | numb, member | 명사 / numb=형용사 | **lumber, member** |
| w-mean | mean | meat, mend | 동사 / meat=명사 | **mend, moan** |
| w-severe | severe | serve, secure | 형용사 / serve=동사 | **several, secure** |
| w-track | track | trace, truck | 동사 / truck=명사 | **trace, trick** |
| w-keep | keep | kneel, keen | 동사 / keen=형용사 | **kneel, peek** |
| w-low | low | law, slow | 형용사 / law=명사 | **slow, loud** |
| w-check | check | chuck, chick | 동사 / chick=명사 | **chuck, cheer** |
| w-round | round | found, ground | 명사 / found=동사 | **ground, mound** |
| w-candidate | candidate | candle, cannulate | 명사 / cannulate=동사 | **candle, canister** |
| w-prone | prone | phone, prune | 형용사 / phone=명사, prune=명사·동사 | **supine, prime** |
| w-open | open | oven, often | 형용사 / oven=명사, often=부사 | **closed, opaque** |
| w-abdomen | abdomen | abduct, abnormal | 명사 / abduct=동사, abnormal=형용사 | **abscess, albumen** |
| w-turn | turn | tern, torn | 동사 / tern=명사, torn=형용사 | **churn, burn** |
| w-recent | recent | decent, resent | 형용사 / resent=동사 | **decent, remote** |
| w-spinal | spinal | spiral, spinach | 형용사 / spinach=명사 | **spiral, renal** |
| w-clear | clear | clean, clerk | 형용사 / clerk=명사 | **clean, clever** |
| w-overall | overall | overdue, overlap | 부사 / overdue=형용사, overlap=동사 | **overly, overtly** |
| w-safely | safely | safety, softly | 부사 / safety=명사 | **softly, sanely** |
| w-place | place | plate, plane | 동사 / plate·plane=명사 | **pace, plait** |
| w-chest | chest | cheat, chess | 명사 / cheat=동사 | **chess, crest** |
| w-pelvis | pelvis | pelvic, pervis | 명사 / pelvic=형용사, pervis=없는 말 | **pubis, sepsis** |
| w-face | face | fact, fade | 명사 / fade=동사 | **fact, fame** |
| w-roll | roll | rule, rail | 동사 / rail=명사 | **reel, rule** |
| w-secure | secure | sure, secret | 동사 / sure=형용사, secret=명사·형용사 | **secrete, seclude** |
| w-start | start | stair, smart | 동사 / stair=명사, smart=형용사 | **stare, starve** |
| w-grab | grab | grad, crab | 동사 / grad·crab=명사 | **grub, grate** |
| w-cheek | cheek | check, cheat | 명사 / cheat=동사 | **check, creek** |
| w-pressure | pressure | pleasure, pressing | 명사 / pressing=동명사·형용사 | **pleasure, posture** |
| w-reposition | reposition | requisition, repetition | 동사 / requisition·repetition=명사 | **repossess, recondition** |
| w-rotate | rotate | rotor, relate | 동사 / rotor=명사 | **relate, notate** |
| w-saturation | saturation | saturate, situation | 명사 / saturate=동사 | **situation, maturation** |
| w-document | document | doctrine, dormant | 동사 / doctrine=명사, dormant=형용사 | **dominate, comment** |
| w-better | better | butter, bitter | 형용사 / butter=명사 | **bitter, bolder** |
| w-hold | hold | hole, hood | 동사 / hole·hood=명사 | **fold, mold** |
| w-call | call | cell, coil | 동사 / cell=명사 | **coil, stall** |
| w-count | count | court, mount | 명사 / mount=동사 | **court, county** |
| w-guard | guard | guest, guide | 동사 / guest=명사 | **guide, goad** |
| w-together | together | tougher, tether | 부사 / tougher=형용사, tether=명사 | **tomorrow, thereafter** |
| w-smoothly | smoothly | smoothie, smartly | 부사 / smoothie=명사 | **smartly, smugly** |
| w-steady | steady | study, sturdy | 형용사 / study=명사·동사 | **sturdy, seedy** |
| w-whole | whole | hole, whale | 형용사 / hole·whale=명사 | **hollow, holy** |
| w-wait | wait | weight, wake | 동사 / weight=명사 | **wake, waive** |
| w-signal | signal | single, signet | 명사 / single=형용사 | **signet, siren** |
| w-free | free | tree, flee | 형용사 / tree=명사, flee=동사 | **fried, frail** |
| w-underneath | underneath | undertake, understand | 전치사 / undertake·understand=동사 | **underway, overhead** |
| w-mark | mark | mask, mock | 동사 / mask=명사(은행 단어 마스크) | **mock, mar** |
| w-continue | continue | contain, continual | 동사 / continual=형용사 | **contain, contrive** |
| w-feed | feed | feel, seed | 명사 / feel=동사 | **seed, fee** |
| w-rate | rate | race, raise | 명사 / raise=동사 | **race, crate** |
| w-conservative | conservative | conservation, conversation | 형용사 / conservation·conversation=명사 | **consecutive, conversant** |
| w-monitor | monitor | mentor, minister | 동사 / minister=명사(동사 용법 드묾) | **mentor, muster** |
| w-gastric | gastric | garlic, caustic | 형용사 / garlic=명사 | **caustic, cystic** |
| w-closely | closely | closet, clearly | 부사 / closet=명사 | **clearly, coolly** |
| w-run | run | rub, rug | 동사 / rug=명사 | **rub, ruin** |
| w-paralytic | paralytic | parasitic, paramedic | 형용사 / paramedic=명사 | **parasitic, analytic** |
| w-never | never | ever, nerve | 부사 / nerve=명사 | **ever, often** |
| w-aware | aware | award, beware | 형용사 / award=명사, beware=동사(awake는 정답 둘이라 피함) | **wary, awry** |
| w-increase | increase | decrease, increment | 동사 / increment=명사 | **decrease, incise** |
| w-dose | dose | dust, doze | 명사 / doze=동사 | **dust, dove** |
| w-same | same | sale, some | 형용사 / sale=명사, some=한정사 | **sane, tame** |
| w-suggest | suggest | digest, success | 동사 / success=명사 | **digest, ingest** |
| w-harm | harm | hard, farm | 동사 / hard=형용사, farm=명사 | **charm, warm** |
| w-support | support | sport, suppose | 동사 / sport=명사 | **suppose, supply** |
| w-plan | plan | plant, clan | 동사 / clan=명사 | **plant, plod** |
| w-venous | venous | various, venom | 형용사 / venom=명사 | **various, nervous** |
| w-return | return | retain, turn | 명사 / retain·turn=동사 | **retina, rerun** |
| w-fluid | fluid | fluent, flood | 명사 / fluent=형용사 | **flood, flue** |
| w-bolus | bolus | bonus, bogus | 명사 / bogus=형용사 | **bonus, bolt** |
| w-bounce | bounce | pounce, bounty | 동사 / bounty=명사 | **pounce, flounce** |
| w-common | common | comment, column | 형용사 / comment·column=명사 | **comely, comic** |
| w-ease | ease | east, ice | 동사 / east·ice=명사 | **erase, tease** |
| w-back | back | bake, black | 부사 / bake=동사, black=형용사 | **aback, away** |
| w-eye | eye | ear, aye | 명사 / aye=감탄사 | **ear, dye** |
| w-lubricate | lubricate | lubricant, fabricate | 동사 / lubricant=명사 | **fabricate, liberate** |
| w-prevent | prevent | present, perfect | 동사 / perfect=형용사 | **present, prevail** |
| w-moist | moist | most, moss | 형용사 / most=한정사, moss=명사 | **moldy, mossy** |
| w-sat | sat | seat, sad | 명사 / sad=형용사 | **seat, salt** |
| w-afterward | afterward | afterword, forward | 부사 / afterword=명사 | **forward, upward** |
| w-stable | stable | table, staple | 형용사 / table·staple=명사 | **stale, able** |
| w-help | help | held, hell | 명사 / held=동사, hell=비속어 | **helm, kelp** |
| w-supine | supine | supple, spine | 형용사 / spine=명사 | **supple, prone** |
| w-vent | vent | vet, went | 명사 / went=동사 | **vet, vest** |
| w-fast | fast | fist, fact | 부사 / fist·fact=명사 | **last, first** |
| w-instant | instant | instance, install | 명사 / install=동사 | **instance, insight** |
| w-out | out | oat, our | 부사·형용사 / oat=명사, our=한정사 | **in, up** |
| w-manage | manage | manager, manner | 동사 / manager·manner=명사 | **mangle, massage** |
| w-despite | despite | desert, depict | 전치사 / desert=명사, depict=동사 | **beside, besides** |
| w-criteria | criteria | cafeteria, critical | 명사 / critical=형용사 | **cafeteria, bacteria** |
| w-gather | gather | bather, father | 동사 / bather·father=명사 | **lather, tether** |
| w-course | course | coarse, curse | 명사 / coarse=형용사 | **source, cause** |
| w-high | high | hi, hay | 형용사 / hi=감탄사, hay=명사 | **shy, hilly** |
| w-bedside | bedside | beside, bedsore | 명사 / beside=전치사 | **bedsore, bedrock** |
| w-deep | deep | deer, dip | 형용사 / deer=명사, dip=동사 | **dear, damp** |
| w-add | add | and, ode | 동사 / and=접속사, ode=명사 | **aid, nod** |
| w-wound | wound | would, wand | 명사 / would=조동사 | **wand, mound** |
| w-stage | stage | stake, stale | 명사 / stale=형용사 | **stake, stave** |
| w-hypoxic | hypoxic | hypoxia, hypotonic | 형용사 / hypoxia=명사 | **hyperoxic, hypotonic** |
| w-avoid | avoid | void, evade | **동의어** evade(=피하다) — 정답 둘 | **void, avow** |
| w-residual | residual | resident, residue | **동의어** residue(=잔여물) — 정답 둘 | **resident, reservoir** |
| w-overdistension | overdistension | overextension, overinflation | **동의어** overinflation(=과팽창) — 정답 둘 | **overextension, overhydration** |
| w-depth | depth | death, width | **불쾌** death(튜브 깊이 문제에 "죽음") | **width, debt** |
| w-capnography | capnography | capnometry, cartography | capnometry도 호기말 CO2로 튜브 위치를 확인함 — 정답 둘에 가까움 | **cartography, cardiography** |
| w-twitch | twitch | switch, witch | witch(마녀) — 불쾌할 수 있음 | **switch, twist** |
| w-maneuver | maneuver | manure, manager | manure(거름·똥) — 저속하게 읽힘 | **manager, measure** |
| w-stay | stay | stray, stage | 동사 / stage=명사 | **stray, sway** |
#### W-O · decoyChips — 불쾌한 조각 (비속어·불쾌 관점 전수 점검 결과)

decoyChips 421개를 전부 읽었습니다. 아래 외에는 문제 없음(`lie`는 -ly 단어 5곳에 쓰인 철자 오답으로 괜찮음).
- W-O1 · w-venous · `noose`(올가미 — 자살 연상) · `[vi, noose]` → `[vi, nose]`
- W-O2 · w-ready · `die` · `[red, die]` → `[red, dye]`
- W-O3 · w-depth · `death` · `[death]` → `[debt]` (distractorsEn의 death는 표에서 바꿈)
- W-O4 · w-gather · `gat`(권총 속어) · `[gat, or]` → `[gad, or]`
- (선택) W-O5 · w-call · `cull`(도살·솎아내기) · `[cull]` → `[cell]`

#### W-C · cue가 ko를 되풀이함
- W-C1 · w-rate · cue에 ko `속도`가 그대로 · `영양액이 펌프로 한 시간에 얼마만큼씩 들어가는지 정해 둔 값`
- W-C2 · w-moist · cue `…촉촉한` · `마르지 않고 물기가 알맞게 남아 있는 상태 — 눈에 연고를 넣는 이유`

#### W-D · decoyChips가 정답과 상관없음
- W-D1 · w-overdistension · `[a, vel]`(overall에서 복사) · `[dys, tent]`

### 뉘앙스

- N-1 · S2 복와위 적응증·금기 확인 · context(`contraindication`) · 세 장면이 같은 뜻이 아님 — 장면 1은 "척추 수술이 금기", 장면 2는 "**금기 없음**", 장면 3은 "T12 골절이 절대 금기". 같은 사실을 듣는 사람만 달리해야 함(TASK 9)
  - 장면 1 en `His unstable T12 fracture is a contraindication to proning.`
  - 장면 2 en `Contraindication to proning: unstable T12 fracture.`
  - 장면 3·fix·why는 그대로
- N-2 · S3 복와위 체위 준비·물품 · context(`secure`) · 어색한 장면에 `secure`가 없음(`securing`은 `secure`를 포함하지 않음 — W14) · 장면 3 en `We will secure the endotracheal tube and central venous catheters prior to prone positioning.`
- N-3 · S17 복와위 중 우발적 발관 · slider(`w-out`) · **안전** — 위 심각 7
  - cue `The tube mark is 4 cm farther out at the lip than at the last check.`
  - why `표시가 4cm나 밖으로 나왔으면 튜브가 일부 빠진 것(partly out)이에요. loose는 고정만 느슨한 정도, out은 완전히 빠진 상태예요. 일부만 빠져도 기도가 위험하니 혼자 밀어 넣지 말고 바로 도움을 부르세요.`
  - scale·answerAt·example은 그대로
- N-4 · S19 기흉·기압손상 동반 위기 · context(`pneumothorax`) · 장면 1·2는 "의심(possible)"인데 어색한 장면 3은 "He has a **tension** pneumothorax"로 단정 — 같은 뜻이 아니고, fix도 확정처럼 말함
  - 장면 3 en `We're concerned he may have a pneumothorax and may need emergent needle decompression.`
  - fix `We think some air may have leaked outside his lung. The doctor may need to let it out right away.`
  - why `동료와 차트에서는 pneumothorax가 정확하고 짧아요. 가족에게는 needle decompression 같은 말보다 '폐 밖으로 공기가 샌 것 같아 빼내야 할 수 있다'로 풀어 말해요.`
- N-5 · S1 저 TV 폐보호 환기 유지 · context(`setting`) · 장면 1·2는 "설정 그대로", 장면 3은 설정값 나열이라 뜻이 조금 다름(경미)
  - 장면 3 en `His ventilator settings are unchanged: TV 420, RR 22, PEEP 10, FiO2 60.`
  - fix `The breathing machine settings haven't changed. It's still giving him small, gentle breaths to protect his lungs.`

swap 3장(S8·S13·S17)은 세 선택지 모두 문법이 맞고 `ko`가 바꾼 문장의 뜻과 맞습니다. 고칠 것 없음.

### 문장 (keyPhrase 아님 — 고칠 것)

en·ko를 바꾸는 문장은 **그 문장의 `distractorsKo` 둘(새 ko를 한 군데만 바꾼 말로), `why`, `blank`(answer·options), `decoy`, `tag`·`icon`도 새 문장에 맞춰 다시 쓰세요.** changes에 `{kind: sentence, situation, index, fields: [en, ko, chunks, words]}`를 적습니다. 그 문장을 `example`로 쓰던 단어는 `example`·`exKo`도 새 문장으로 바꾸고 changes의 word fields에 `example`을 적습니다.

- S-1 · S9 신경근차단제 병용 감시 · 문장 4 · **안전**(메모 A-4)
  - en `If more twitches come back, I'll increase the dose per protocol.`
  - ko `씰룩임이 더 많이 돌아오면 프로토콜에 따라 용량을 늘릴게요.`
  - chunks `["If more twitches come back,", "I'll increase", "the dose", "per protocol", "."]`
  - words `[w-twitch, w-increase, w-dose, w-protocol]` (w-soon 빠짐 → D-11)
  - example 교체: w-twitch·w-increase·w-dose
  - B의 order 4줄째(`…his twitches coming back too soon, I'll increase the dose.`)도 같은 뜻으로 맞추세요
- S-2 · S13 안면 부종·안압 관리 · 문장 3 · **안전**(잘못된 안심, 메모 A-3)
  - en `The swelling looks scary, but it usually goes down after we turn him back.`
  - ko `부종이 무서워 보여도 다시 눕히면 대개 가라앉아요.`
  - chunks `["The swelling", "looks scary,", "but it usually goes down", "after we turn him back", "."]`
  - words `[w-swelling, w-scary, w-turn, w-back]` (w-look·w-soon 빠짐)
  - example 교체: w-scary
  - B의 order 2·3줄째(`…it will go down soon.`, `Even though it will go down soon, …`)도 단정을 빼서 맞추세요
- S-3 · S17 복와위 중 우발적 발관 · 문장 3 · **안전**(메모 A-6)
  - en `Someone keep bagging him while I set up suction.`
  - ko `제가 흡인기를 준비하는 동안 누가 계속 백으로 환기해 주세요.`
  - chunks `["Someone", "keep bagging him", "while I set up", "suction", "."]`
  - words `[w-bag]` (w-hold·w-cricoid·w-pressure 빠짐. D-10까지 반영해도 S17 서로 다른 단어는 19개로 V3 여유)
  - w-cricoid는 이 문장에서만 쓰여 은행에서 지움(D-11). B가 이 문장 blank를 `cricoid`로 잡았으니 새로 정해야 함
- S-4 · S16 복와위 중 심정지 긴급 앙와위 전환 · 문장 4 · **안전**(위 심각 1)
  - en `If we can't flip him fast, we start compressions while he's still prone.`
  - ko `빨리 뒤집을 수 없으면 엎드린 채로 흉부 압박을 시작해요.`
  - chunks `["If we can't flip him", "fast,", "we start compressions", "while he's still prone", "."]`
  - words `[w-flip, w-fast, w-start, w-compression, w-prone]` (w-wait·w-second·w-flat 빠짐)
  - why에 "돌리느라 압박이 늦어지면 안 되고, 삽관된 환자는 엎드린 채로도 등(견갑골 사이)을 눌러 압박할 수 있다(AHA 2020)"는 이유를 담기
  - w-second 은행에서 지움(D-11)
- S-5 · S10 PEEP·recruitment 반응 평가 · 문장 4 · **안전**(위 심각 5)
  - en `If his blood pressure drops or his heart rate spikes, we stop the maneuver.`
  - ko `혈압이 떨어지거나 심박수가 급등하면 수기를 멈춰요.`
  - chunks `["If his blood pressure drops", "or his heart rate spikes,", "we stop", "the maneuver", "."]`
  - words `[w-blood, w-pressure, w-drop, w-spike, w-stop, w-maneuver]`
  - example 교체: w-spike·w-stop
- S-6 · S12 복와위 중 혈역학 변화 관리 · 문장 4 · **안전**(위 심각 6)
  - en `His pressure usually bounces back within a few minutes of the turn.`
  - ko `보통 돌리고 몇 분 안에 혈압이 회복돼요.`
  - chunks `["His pressure usually", "bounces back", "within a few minutes", "of the turn", "."]`
  - words `[w-pressure, w-bounce, w-turn]` (w-flat·w-again 빠짐)
  - example 교체: w-bounce. w-flat은 S-4와 함께 어느 문장도 쓰지 않게 되므로 은행에서 지움(D-11)
  - B의 order 4줄째(`Once we turn him flat again, his pressure usually bounces back.`)도 맞추세요

### chunks (keyPhrase 아님 — 고칠 것)

- C-1 · S1 문장 4 · `is our / target`이 소유격과 명사를 끊음 · `["Anything", "below 15", "for driving pressure", "is our target", "."]` (ko는 D-3)
- C-2 · S2 문장 3 · `is a clear / contraindication`이 명사구를 끊음 · `["Recent spinal surgery", "is", "a clear contraindication", "."]`
- C-3 · S7 문장 4 · `before we / turn him`이 절의 주어와 동사를 끊음 · `["Give", "every line", "enough slack", "before we turn him", "."]`
- C-4 · S11 문장 3 · `through the whole / session`이 명사구를 끊음 · `["His numbers", "stayed strong", "through the whole session", "."]`
- C-5 · S18 문장 3 · `won't / come up`이 조동사와 동사를 끊음 · `["Even", "at 100 percent FiO2,", "his numbers", "won't come up", "."]`
- C-6 · S19 문장 3 · `on both / sides`가 한정사와 명사를 끊음 · `["His chest", "isn't moving", "the same", "on both sides", "."]`

## 결정 11 (v44 단어·문장)

저작자 changes 41건 판정: ko 변경 prone·call·count·move·roll·check·keep·mark·flag·grab·vent·breath·drop·stomach·belly·care·second·depth는 타당합니다. 단어 삭제 21건(afternoon·ago·also·come·doctor·each·five·go·good·head·hour·new·now·patient·people·person·put·see·tell·time·yesterday)과 뜻이 다른 태그를 뺀 것(hold the feeds, on his back, Lower(동사), set up)도 타당합니다. 아래는 고칠 것입니다.

- D-1 · **w-tof·w-train-of-four** · ko가 정답 약어를 드러냄(`TOF 수치`, `네 번 연속 자극(TOF)` — 카드에 뜻과 함께 정답이 보임) · w-train-of-four ko `사연속 자극(검사)`, w-tof ko `사연속 반응 수`. dKo 길이 통과. changes fields `[ko]`
- D-2 · **w-sat** · 바꾼 ko `사트(수치)`는 소리만 옮겨 뜻을 알려 주지 않음 · ko `포화도 수치(약칭)`, distractorsKo `[맥박 수치(약칭), 혈압 수치(약칭)]`. S15 context의 `ko`도 같은 말로
- D-3 · **w-below + S1 문장 4 ko**(메모 A-2 타당) · below는 "미만"인데 ko가 `이하인`, 문장 ko `구동압은 15 이하가 목표예요.` · w-below ko `밑도는`(w-under `미만인`과 겹치지 않게), distractorsKo `[웃도는, 맞먹는]`. 문장 ko `구동압은 15 미만이 목표예요.` → 이 문장 distractorsKo 둘 새로, w-below·w-target exKo도 새 ko로
- D-4 · **plateau pressure 표기 통일 + S1 문장 2 ko(keyPhrase — ko만)**(메모 A-1 일부 타당) · 단어 ko는 `플래토압(고원압)`, 문장 ko·exKo 넷(w-confirm·w-plateau-pressure·w-stay·w-under)·S1 slider exKo는 `고평부압`이라 어긋남. 문장 ko `플래토압이 30 미만으로 유지되는지 확인할게요.`, S1 slider exKo `인공호흡기 설정을 바꿀 때마다 플래토압을 확인해 둘게요.` 이 문장 distractorsKo 둘 새로. (changes의 이유 "고평부압은 쓰이지 않는 표기"는 사실과 다름 — 국내 문헌에도 쓰입니다. 이유를 "학습자에게 익숙한 플래토압으로 통일"로 고치세요)
- D-5 · **S7 문장 2 ko(keyPhrase — ko만)**(메모 A-8 타당) · `…눌리지 않게 … 걸리지 않게 둬요` · `몸 아래에 깔려 눌리는 게 없도록 배액 라인을 비켜 두세요.` distractorsKo 둘과 w-drainage·w-free·w-pinch·w-underneath exKo도 새 ko로
- D-6 · **S10 문장 2 ko(keyPhrase — ko만)**(메모 A-7) · `좋은 쪽 폐` — 양측성 ARDS에 "좋은 쪽"은 없음 · `덜 손상된 폐 부위를 다치지 않게 과팽창을 지켜볼게요.` distractorsKo 둘과 w-watch·w-overdistension·w-harm exKo도. en은 K-3
- D-7 · **S19 문장 1 ko(keyPhrase — ko만)** · **안전** · 명령형 en에 1인칭 ko(간호사가 직접 호흡량을 낮춤) · `일회 호흡량을 낮추고 흉관 삽입을 준비해 주세요.` distractorsKo 둘 새로. en은 K-1
- D-8 · **w-pressure** · ko `압박`인데 blood pressure·plateau/high pressures·"recheck his pressure"(S10.4·S12.0·S12.3·S12.4·S19.0)에서는 "압력·혈압" · ko `압력(압박)`, distractorsKo `[마찰(문지름), 습기(축축함)]`(길이 통과)
- D-9 · **뜻이 다른 태그 빼기**(문장은 그대로, changes fields `[words]`)
  - S15 문장 4 `something changed` — w-change(ko 변화, 명사)인데 동사 → w-change 빼기
  - S13 문장 2 `We also position his head` — w-position(ko 체위, 명사)인데 동사 → 빼기
  - S20 문장 3 `This mark is deeper` — w-mark(ko 선을 그어 표시하다, 동사)인데 명사(자국) → 빼기
  - S11 문장 2 `set the schedule` — w-set(ko 설정하다)인데 "정하다" → 빼기
- D-10 · **남은 쉬운 단어**(간호사가 이미 아는 A1 말 — 태그를 빼고 은행에서 지움, `word-remove`)
  - 확실: w-tonight(S11.4), w-again(S1.3·S12.4), w-before(S1.3·S3.1·S3.2·S3.4·S5.0·S6.4·S7.4), w-first(S12.1·S15.0), w-give(S7.4·S12.3), w-get(S17.2·S19.4), w-need(S3.0·S20.0)
  - 권장: w-look(S2.4·S5.3·S14.4·S20.3), w-team(S5.2·S11.2·S14.2·S17.2·S18.1), w-strong(S11.3)
  - 어느 뉘앙스도 이 단어들을 가리키지 않습니다. 권장까지 다 빼도 상황마다 서로 다른 단어가 14개 이상(가장 적은 S5가 14)이라 V3(8개) 여유가 있습니다. 바꾼 뒤 V3·V15를 다시 돌리세요
- D-11 · **문장 수정으로 쓰이지 않게 되는 단어 지우기** · w-soon(S-1·S-2), w-second(S-4), w-cricoid(S-3), w-flat(S-4·S-6) → `word-remove`
- 판단만(고치지 않음): 메모 A-9 `ideal body weight` = `표준 체중`은 틀린 말이 아닙니다(국내에서 키로 계산하는 체중을 이렇게 부름). 바꾼다면 `이상 체중`이 직역이지만 필수는 아닙니다. 메모 A-10(set up 태그 빼기)은 타당합니다

## keyPhrase 문장 — 사용자 결정 필요 (en은 바꾸지 않음)

- K-1 · S19 기흉·기압손상 동반 위기 · 문장 1 `Lower the tidal volume and prepare for a chest tube.` · 간호사가 동료에게 호흡기 설정 변경을 지시하는 말입니다. 미국 ICU에서 일회 호흡량 변경은 의사 오더로 호흡치료사가 합니다. 긴장성 기흉이 의심되면 먼저 의사 호출·바늘 감압 준비가 우선이고(복와위면 앙와위 전환도), 호흡량을 낮추는 것은 그다음 조치입니다. 선택지: (a) 그대로 두고 ko만 명령형으로(D-7) (b) `Ask RT to lower the tidal volume, and let's prepare for a chest tube.`처럼 역할을 넣기. 메모 A-5와 같은 지적입니다
- K-2 · S16 복와위 중 심정지 긴급 앙와위 전환 · 문장 0 `Call the code and flip him supine so we can start compressions.`, 문장 2 `Start CPR the instant he's on his back.` · 앙와위 전환 뒤 CPR이 원칙이지만, 바로 돌릴 수 없으면 복와위 CPR이 타당하다는 것이 AHA 2020 입장입니다. 두 문장만 있으면 "돌리기 전엔 압박하지 않는다"로 읽힙니다. 선택지: (a) 그대로 두고 S-4로 균형 잡기(권장) (b) keyPhrase 0을 `…flip him supine as fast as we safely can.`처럼 바꾸기
- K-3 · S10 PEEP·recruitment 반응 평가 · 문장 2 `I'll watch for overdistension so we don't harm the good lung.` · 양측성 ARDS에서는 "좋은 쪽 폐"가 따로 없습니다(과팽창은 덜 다친 정상 통기 부위에서 생김). 선택지: (a) ko만 D-6으로 고치고 두기 (b) en을 `…so we don't harm the healthier parts of the lung.`으로. 메모 A-7과 같은 지적입니다
- 보고만 하는 chunks(keyPhrase): S1.0 `is set to / 6 milliliters per kilo`(to로 끝남), S3.1 `for his chest, / pelvis, and face`(나열 끊김), S4.0 `his forehead, cheeks, / and chest`(나열 끊김), S9.0 `he must be / deeply sedated`(조동사구 끊김), S10.0 `after the recruitment / maneuver`(복합명사 끊김), S17.1 `with 100 percent / oxygen`(명사구 끊김)

## 기계적 전수 확인 결과 요약

- **pair**: 이 주제에는 pair 문항이 없습니다(slider 21·context 18·swap 3). 조합 점검 대상 없음
- **chunks**: 105문장 전부를 `/`로 이어 출력하고, 관사·전치사·조동사·대명사로 끝나는 조각을 스크립트로 뽑아 한 줄씩 판정. keyPhrase 아닌 문장 6건(C-1~6), keyPhrase 6건은 보고만
- **distractorsEn 품사**: 262단어 전부의 정답 품사(문장에서 쓰인 품사)와 오답 둘을 비교. 품사가 다른 것 100단어(지울 단어 제외), 동의어 3, 정답에 가까운 것 1, 불쾌 3 — 위 표
- **swap**: 3문항 × 선택지 3 = 9줄을 이어 읽음. 모두 문법이 맞고 `ko` 정확
- **context**: 18문항 × 3장면에 `word`가 있는지 스크립트로 확인 — S3 장면 3만 없음(N-2). 어색한 장면은 18장 모두 "가족에게 임상어·약어"로 핸드오프 모양. 같은 뜻이 아닌 것 S2·S19(·S1 경미)
- **길이**: distractorsEn·distractorsKo 524쌍 모두 1.25배·3자 규칙 통과
- **decoyChips**: 전부를 비속어·불쾌 관점에서 읽음 — W-O

## 종합

고칠 것 142항목: 단어 114(distractorsEn 표 107, decoyChips 불쾌 4·무의미 1, cue 2), 뉘앙스 5, 문장 6, chunks 6, 결정 11 11항목. 그중 안전 8건(S-1~S-6, N-3, D-7). 사용자 결정 3건(K-1~3).
문장 6건과 S17 slider를 고치고, distractorsEn 품사를 맞추고, 불쾌한 조각을 빼면 내보내도 됩니다. 문장을 고치면 B 쪽 필드(blank·decoy·distractorsKo·why)와 order 줄(S9·S12·S13)도 함께 맞춰야 합니다.
