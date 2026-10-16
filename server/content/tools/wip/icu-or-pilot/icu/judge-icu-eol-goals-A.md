# judge — icu-eol-goals A (Fable 표본 판정, 독립 전수)

대상 `icu-eol-goals.yaml` (단어 254 · 상황 21 · 문장 147 · 뉘앙스 51). 비교 `base-`·`changes-`·`in-`·`notes-A/B`. `fix-*.md`는 열지 않음.
기계 재확인(스크립트): 은행에 안 쓰인 단어 0 · 상황당 서로 다른 단어 8개 이상 전부 통과 · nuance.words가 상황 문장 단어 밖인 것 0 · 오답 길이(1.25배/3자) 위반 0 · 태그 집합 10개로 일관.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 2 | 소리·철자는 잘 닮았으나 **품사가 다른 오답이 약 110단어**(아래 표). 비단어 `foc`·`incomfortable`, 동의어 `medicine`(medication) 포함. |
| 2 | distractorsKo·En 정답 둘 | 3 | 길이 위반 0. 정답 둘 후보 5건: chart→기록지, meeting→면담, confirm→확정하다, want→바라다(=hope ko), medication→medicine. welcome(형용사)에 동사 오답 2개. |
| 3 | cue | 3 | 정답 영어·파생형 노출 0. 그러나 `ko`를 거의 그대로 넣은 cue가 30건 안팎(order·think·care·chair·long·light·first·next·slowly·speed·slow·tomorrow·important·space·donation·follow·separately·clear·kind·concern·try·document·review·easy·child·kid·faster·alone·rush·carefully·stay). |
| 4 | chips/decoyChips | 3 | 형태소 분할은 대체로 좋음. **decoyChips에 `ass`(grimace)·`cum`(welcome)·`butt`(better)** — 화면에 그대로 뜨는 조각이라 바꿔야 함. |
| 5 | 뉘앙스 사실성 | 4 | DNR/ACLS·CPOT·OPO 분리·hospice vs palliative·actively dying·unbefriended 모두 미국 관행과 맞음. 과장 1건([2] swap why "약으로 줄일 수 있어요" — 항콜린제 근거는 약함·"줄일 수도 있다" 정도). |
| 6 | 뉘앙스 설계 | 3 | pair 2건은 유일(저위험 후보 `advance paperwork`·`next consult`). swap 9건 문법 전부 OK. slider 중 [3]·[6]·[16]·[17]·[20]은 '강도 저울'이 아니라 '맞는 응답 고르기'이고 [5]는 carefully도 맞아 정답 둘 위험. context [17] harm은 ok:false 장면에 `harm`이 없고 `harmful`. swap ko [0] 오역. |
| 7 | v44 정리(결정 11) | 4 | 삭제 20·추가 2·ko 12 수정은 전부 타당(특히 dnr·weaning·put·restlessness). 남은 것: work·through·look·clean·choose·page·entire ko가 태그 문장과 어긋남, 어색한 문장 1([16]5), 단정 약속 문장 2([8]3·[8]4), KP ko 오역 2. |

## 사실 오류·심각한 문제
1. **decoyChips 욕설/비속어** — w-grimace `ass`, w-welcome `cum`, w-better `butt`. 조각 맞추기 화면에 그대로 보임. (`ace`→`ice`, `come`→`comb`, `butt`→`bet`로.)
2. **[0] swap `ko` 오역** — "소생술은 안 한다는 뜻이에요 — 심장이 멈추더라도요". 정답 문장은 "won't do CPR **if** his heart stops"(멈추**면**)인데 ko는 양보("멈추더라도")로 읽혀 뜻이 뒤집힘. → "통증 치료는 계속해요 — 다만 심장이 멈추면 소생술은 하지 않는다는 뜻이에요".
3. **[20] KP 문장 ko 오역** — "We'll support you and her family through every step." ko "매 단계마다 가족분과 **함께** 지지해드릴게요"는 '가족과 함께(동반)'로 읽힘. → "매 단계마다 당신과 그분 가족을 지지해드릴게요" (ko를 고치면 그 문장 distractorsKo 둘도 새 ko에 맞춰 다시 쓸 것).
4. **[4] KP 문장 ko가 en보다 단정** — "Hearing is **often** the last sense to go" → ko "청각은 마지막까지 남는 감각이라". → "청각은 흔히 마지막까지 남는 감각이라" (distractorsKo 둘도 다시).
5. 환자 안전 오해를 부를 사실 오류: **없음**. 단정 약속 문장은 아래 결정 11에.

## 고칠 것 — 단어 (v45 필드)

### A. 정답 둘·동의어·비단어 (먼저 고칠 것)
| 어디 | 문제 | 어떻게 |
|---|---|---|
| w-chart dKo | `기록지`·`기록표`는 차트의 번역어 → 정답 둘 | `처방전`·`동의서` |
| w-meeting dKo | `면담` — family meeting = 가족 면담, 정답 둘 | `회진`·`강의` |
| w-confirm dKo | `확정하다`는 confirm의 사전 뜻 | `거절하다`·`추측하다` |
| w-want dKo | `바라다` = w-hope의 ko, 원하다와 거의 동의 | `거절하다`·`망설이다` |
| w-medication dEn | `medicine`은 은행 단어이자 "give medicine"도 맞음 | `medical`·`mediation` |
| w-alongside dEn | `beside`("work beside us")가 ko '곁에서 함께'로도 맞음 | `inside`·`aside` |
| w-deeply dEn | `dearly`("love her dearly") 장면 안에서 맞는 영어 | `deadly`·`deftly` |
| w-focus dEn | `foc` 비단어 | `locus` |
| w-uncomfortable dEn | `incomfortable` 비단어 | `unforgettable` |
| w-welcome dKo | 정답 `괜찮은`(형용사)에 `막다`·`금지하다`(동사) | `귀찮은`·`난처한` |
| w-watch dKo | `돌보다`(watch over)로도 읽힘, w-care ko와 같음 | `닦다`·`옮기다` |

### B. distractorsEn 품사 불일치 (약 110단어 — 전부 나열, 표의 ✗만 해당)
규칙(지시서): 오답은 같은 품사. 품사가 달라 헷갈리는 짝은 `decoyChips`로. 아래는 "정답 품사 → ✗오답". 같은 품사 오답은 생략.

keep→keen(adj) · want→won't(조동사) · list→lost · meet→meat(n) · plan→plain · step→steep(adj) · together→toward(prep) · think→thing(n) · matter→mater(비단어)·mother(n) · write→right·wright · sign→sing(v) · discomfort→disconnect(v) · common→comment·commune(n) · labored→laboratory(n) · grimace→grim(adj) · comfort→comport(v) · help→held · like→lake(n) · care→core(n) · differently→difficulty(n) · bed→bad(adj) · leave→leaf(n) · hold→hole(n) · talk→tall(adj) · sense→since · outside→outsize(adj) · need→knee·nerd(n) · long→lung·song(n) · laugh→laughter(n) · remember→member(n) · quietly→quite · calm→clam·call(n) · goodbye→good(adj) · honor→honest(adj)·horror(n) · dress→dresser(n) · welcome→welfare·wellness(n) · respect→respond(v) · death→deaf(adj) · organ→organic(adj) · simple→sample(n) · better→butter(n) · once→ounce·one · pause→paws(n) · check→chick(n) · withdraw→withdrawal(n) · throughout→thorough(adj) · first→fist(n) · priority→prior(adj) · next→text·nest(n) · remove→remote(adj) · happen→happy(adj) · faster→fastener(n)·foster(v) · expect→except · manage→manager·message(n) · whole→hole·wheel(n) · entire→empire(n)·enter(v) · until→unit(n)·untie(v) · notice→novice(n) · enough→tough·rough(adj) · slow→slot(n) · guide→guild(n) · best→beat·vest · distress→destroy(v) · tell→tall(adj) · work→word(n) · quiet→quite(adv)·quiz(n) · look→luck(n) · loose→lose(v)·lease · tense→tent(n) · specialize→specialist·specialty(n) · support→suppose(v) · symptom→simple(adj) · ahead→head(n)·ahem · coordinate→coordinator(n) · page→pave(v) · quality→quarterly · life→live(v) · visit→vision·visa(n) · ritual→virtual(adj) · important→import · medicine→medical(adj) · around→ground(n) · bring→brink·bride(n) · grieve→grave·grief(n) · wrong→ring(n) · wait→weight(n) · alone→along·lone · meaningful→meaning(n) · pressure→pressed · follow→fellow(n)·hollow(adj) · settle→subtle(adj) · start→stat·smart · call→cell(n) · clear→cleat(n) · both→bath·booth(n) · love→glove(n) · ethics→ethnic(adj) · through→though·thorough · listen→listing·lesson(n) · kind→find(v) · situation→situate(v) · disagree→disarray(n) · hear→heart(n) · fight→flight·fright(n) · harm→warm(adj) · shift→shaft·shirt(n) · try→tray(n) · less→loss·lease(n) · hard→harm·heart(n) · respond→spoon(n) · passing→pausing · dying→dyeing·dining · strong→string·stroll · document→doctor·documentary(n) · prior→pride·priority(n) · interest→interact(v) · locate→locket(n) · attempt→attend(v) · consult→consume·construct(v) · review→renew(v) · physician→physical(adj) · easy→east·eagle(n) · way→weigh(v)·away(adv) · specialist→specialize(v) · young→youth·yawn · real→reel(n) · own→owe(v)·town(n) · carry→carrot(n) · speak→speck(n) · meeting→melting

→ 권장: 품사가 다른 쪽을 `decoyChips`로 옮기고(이미 chips와 겹치는 것은 생략), 자리에는 같은 품사의 근접형을 넣는다(예 need→`feed`·`heed`, long→`lone`·`late`, loose→`lax`·`limp`, both→`each`·`either`, strong→`sturdy`·`stern`).

### C. decoyChips
| 어디 | 문제 | 어떻게 |
|---|---|---|
| w-grimace | `ass` | `ice` |
| w-welcome | `cum` | `comb` |
| w-better | `butt` | `bet` |

### D. cue가 ko를 되풀이 (30건 안팎, 위 항목 3 목록) — 장면(누구에게·언제)으로 바꾸기
예) w-first "여러 순서 중 가장 먼저 하는 것을 말할 때" → "철회 순서를 설명하며 '도움 안 되는 약부터'라고 운을 뗄 때"; w-chair "가족이 침대 곁에 앉을 의자를 가리킬 때" → "오래 서 있는 보호자에게 침대 옆 자리를 권할 때"; w-tomorrow → "완화의료팀 방문 일정을 잡으며 오늘이 아니면 그 다음 날이라고 할 때".

## 고칠 것 — 뉘앙스
| 어디 | 문제 | 어떻게 |
|---|---|---|
| [0] 사전연명의향·DNR 확인 · swap `ko` | 조건(멈추면)을 양보(멈추더라도)로 오역 | 위 심각 2번 |
| [0] · pair | `advance paperwork`는 장면 밖에서 성립하는 명사구(저위험) | decoy를 `the chart`·`the family`처럼 어느 왼쪽과도 안 붙는 것으로 |
| [19] 대리결정 부재 · pair | `next consult`가 "the next consult"로 성립(저위험) | 왼쪽을 `next of`로 두고 오른쪽 `kin`으로 하거나 decoy 교체 |
| [5] 사후 처치 · slider | quickly/carefully/gently는 강도 눈금이 아니고, 시신을 돌리는 장면에 carefully도 맞음 → 정답 둘 | scale을 `roughly → carefully → gently`처럼 한 축으로, 또는 cue를 "힘을 빼고 부드럽게"가 유일해지게 |
| [3]·[6]·[16]·[17]·[20] slider | 유의어 강도 저울이 아니라 '맞는 응답 고르기'(설계 어긋남) | 유지하려면 사용자 결정; 바꾸면 [3] `uncomfortable→in pain→in agony`, [6] `in jargon→in plain words→in writing`(X) 대신 `technical→plain→simple` 식 한 축 |
| [17] 무의미한 치료 · context harm | ok:false 장면 en에 `harm`이 없고 `harmful`(v46 7번: 세 장면 모두에 word) | "Aggressive interventions now cause iatrogenic harm." |
| [4] 가족 면회 · context stay | ok:false가 말투가 아니라 **내용**(면회 규정 낭독)이라 어색 — '같은 뜻·안 맞는 자리' 기준에 약함(저위험) | "Per policy, visitors may stay until 8 p.m." 식으로 '자리'가 문제인 문장으로 |
| [2] 임종기 증상 사정 · swap why | "약으로 줄일 수 있어요"는 과장 가능(항콜린제 근거 제한적) | "자세를 바꾸고 약을 써서 줄여 볼 수 있어요" |
| [10] 죽음의 질 · context 인계 장면 | "Resting comfortable" — 인계 구어로는 쓰이나 문법상 comfortably | 그대로 둬도 됨(보고만) |

## 고칠 것 — 결정 11 (v44 단어·문장)
| 어디 | 문제 | 어떻게 |
|---|---|---|
| w-work ko `효과가 있다` | 태그 3문장 중 2개가 "work alongside"·"work around"(일하다) | ko `일하다; (약이) 듣다` 또는 [11]6·[12]5에서 태그 해제 |
| w-through ko `헤쳐서` | 3문장 중 2개는 "with you through it"·"through every step"(내내) | ko `~을 거쳐·내내` |
| w-look ko `보이다` | [10]3 "I look closely"는 '보다' | ko `보다(보이다)` 또는 [10]3 태그를 w-watch로 |
| w-clean ko `청결한` | [5]4 "I'll clean and dress him"은 동사 | ko `씻기다·청결한` |
| w-choose ko `편들다` | choose ≠ 편들다(구 choose sides) | 헤드워드를 `choose sides`로 두고 ko `편을 들다`, chips·오답 맞춤 |
| w-page ko `같은 내용` | page ≠ 같은 내용(구 on the same page) | 헤드워드 `on the same page` / ko `같은 생각인` |
| w-entire ko `온전한` | "the entire time" = 전체의·내내 | `전체의(내내)` (w-whole과 가르려면 whole을 `온전한`이 아니라 `전부의`로) |
| w-rush ko `서두르다` | 문장은 명사 "no rush" | ko `서두름` |
| [9]3 문장 ko | "불안정한 느낌을" — restlessness(초조함)과 어긋남(저작자 메모) | "초조함을 덜어드릴 만큼만 약을 드려요" + distractorsKo 둘 다시 |
| [8]3 "She won't suffer — we prepare medication before we start." | 비KP · 보장 약속 | "We'll do everything to keep her from suffering — we prepare medication before we start." (chunks·ko·distractorsKo 둘·B의 blank/decoy 함께; 태그 w-suffer·w-prepare·w-medication·w-start 유지) |
| [8]4 "Some breaths may look irregular, but she won't feel that." | 비KP · 단정 | "…, but she's unlikely to be aware of it." — chunks·ko·distractorsKo 둘·B의 blank/decoy 함께; `feel`이 빠지므로 w-feel 태그 해제(다른 문장이 쓰니 은행엔 남음) |
| [16]5 "It's okay to disagree and still both be right to love her." | 부자연스러운 영어 | "It's okay to disagree — you both love her, and that's what matters." — chunks·ko·distractorsKo 둘·B의 blank/decoy 함께(w-disagree·w-both·w-love 태그 유지) |
| [15]5 "I won't leave this room until she's comfortable again." | 비KP · 지킬 수 없는 약속(저작자 메모) | "I'm staying right here until she's comfortable again." — chunks·ko·distractorsKo 둘·B의 blank/decoy 함께; `leave`가 빠지므로 w-leave 태그 해제(다른 문장이 쓰니 은행엔 남음) |
| [7]5 "Nothing will happen faster than your family is ready for." | 저작자 메모 — 철회 '단계'의 속도라면 성립 | 유지 가능(보고만) |
| [2]0 KP ko | "…살펴보고 있어요, 불편한 기색이 있는지요." 어색 | "불편한 기색이 있는지 표정과 호흡을 유심히 살펴보고 있어요" + distractorsKo 둘 다시 |
| [4]1 KP ko | often 누락(위 심각 4) | 위 |
| [20]2 KP ko | 오역(위 심각 3) | 위 |

### chunks 구 경계 (비KP = 고칠 것 / KP = 보고만)
비KP: [0]6 `matches what / your family understands` → `matches / what your family understands`; [2]3 `but that doesn't / always mean` → `but that / doesn't always mean`; [7]3 `when you're / ready` → `Next / we'll remove / the breathing tube / when you're ready / .`(9낱말이라 4조각 유지); [14]4 `if you're open / to it` → `if you're open to it`; [16]5 `and still both / be right`(문장 고치면 함께); [16]6 `each / of your concerns` → `Let's / slow down / and hear / each of your concerns / .`(4조각 유지); [20]5 `We can help / you find` → `We can help you / find`; [20]6 `You won't have / to carry this` → `You won't have to / carry this`.
KP(보고만): [6]0 `that in /`; [11]0 `comfort and / support`; [11]2 `is on / the same page`; [13]1 `is very / human`; [13]2 `here to support / you`; [14]1 `what it / would involve`; [16]1 `what she / would have wanted`; [18]0 `and I won't / leave`; [18]1 `His passing looks / peaceful`; [20]0 `and you don't / have to face it`; [20]1 `talk with her / children`.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)
1. [18] "His passing looks peaceful and **he's not in pain**." — 단정(통증 없음)을 사정 근거 없이 보장. 대안 "…and he doesn't look like he's in pain."
2. [18] "Take a breath — you can talk to him, **he can hear you**." — 청각 유지를 단정. 대안 "he may still hear you."
3. [18] "I'm right here with you and **I won't leave**." / [15] "…**she'll settle**." — 지킬 수 없을 수 있는 약속(저작자 메모). 임상 교육 관점에선 흔히 쓰는 말이라 유지해도 됨.
4. [6] "Let me put that in plainer terms for you." — chunks `that in`(구 경계); en 고정이면 chunks만 `put that / in plainer terms`로 재분할 가능(en은 그대로).
5. KP chunks 보고 목록(위) — en은 그대로 두고 chunks만 재분할할지.

## 종합
사실 오류·환자 안전 문제는 없고 뉘앙스 해설은 믿을 만하다. 그러나 **단어 오답의 품사 불일치가 은행의 4할**이라 STEP 1 '영어 고르기'가 읽지 않고 걸러지는 문제고, decoyChips 비속어 3건·swap/KP ko 오역 3건은 내보내기 전에 반드시 고쳐야 한다. A·C·심각 1~4와 결정 11 표를 반영하면 내보내도 된다(B 품사 표는 일괄 치환 작업으로 분리해도 됨).

고칠 것 개수: 심각 4 · 단어 A 11 · 단어 B(품사) 약 110 · decoyChips 3 · cue 약 30 · 뉘앙스 8 · 결정 11 문장/단어 17 · chunks 비KP 8 · keyPhrase 결정 5.
