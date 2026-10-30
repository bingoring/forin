# core-language-icu — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `core-language-icu.yaml`(A·B 합본, `verify_one_theme.py` 통과). 단어 200(base 224, 24 삭제), 상황 21(문장 146), 뉘앙스 42(pair 13 · context 11 · swap 10 · slider 8).
비교: base·changes(118건: sentence 71(전부 `words` 태그만) · word 23 · word-remove 24)·in-json·notes-A·notes-B.
임시 스크립트 `rv_core-language-icu_A_dump.py`(words/sents/nuance/pairs/swap/stats), `rv_core-language-icu_A_checks.py`(길이·cue·대체 조각 경로·청크 끝·헤드워드). 출력 `_rv_core-language-icu_*.txt`.
번호는 "상황.문장"(둘 다 0부터). KP = in-json `keyPhrases`와 글자 그대로 같은 문장.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 철자·소리 닮음 좋음(meditation/mediation, confess/conform, respectable/resentful). 품사가 어긋난 것 4개(★2) |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). w-much `많은`은 정답과 같은 뜻, w-clear `깨끗한`은 clear의 다른 뜻 |
| 3 cue | 3 | 정답 영어 노출 0. 그러나 ko를 그대로 되풀이한 cue 9개 |
| 4 chips/decoyChips | 4 | 대체 조각 경로 0(스크립트). 술(bar×2, lit×2)·속어(nut, lay)·모욕(ape) 조각 7개 |
| 5 뉘앙스·문장 사실 | 3 | why는 미국 관행에 대체로 정확(자격 있는 통역사, died 한 번, substituted judgment, capacity≠언어). 문장: 통역사가 시술을 '설명'(KP), 지킬 수 없는 약속 2(17.6, 19.6), swap 6 해설 과장 |
| 6 뉘앙스 설계 | 2 | **context 11개 중 10개가 핸드오프 모양이 아님**(어색함이 word가 아니라 덧붙인 다른 용어에서 옴, word가 누구나 아는 말), pair 19 정답 둘, swap 16 문법 틀림, context 12 아이콘 뒤바뀜 |
| 7 결정 11 | 4 | 쉬운 말 24개 삭제(공통 14 + 판단 10, 상한 지킴)와 ko 가르기 22건은 타당. 남은 흠: basic(명사 문장)·concern(동사 문장) 헤드워드, take·fair·stay 태그 |

## 사실 오류·심각한 문제
1. **[역할·KP] 7.0 "The interpreter will explain the procedure fully."** 동의를 위한 시술 설명은 의사가 하고 통역사는 그 말을 옮길 뿐입니다. 같은 상황 context의 why("동의 설명은 의사가 하고 통역사는 그 말을 그대로 옮겨요")와도 어긋남 → 아래 K1(사용자 결정).
2. **[약속] 17.6 "The interpreter will stay for as long as you need."** 통역은 예약·호출 단위 서비스라 간호사가 지킬 수 없음 → S2.
3. **[약속] 19.6 "I won't leave your side."** 통역 없이 겁에 질린 환자 응급 — 간호사는 도움을 부르고 장비를 가지러 자리를 떠야 함. 절대 약속 → S1.
4. **[KP 모순] 1.2 "Blink twice for yes, once for no"와 6.0·6.1 "one blink for yes, two for no / Blink once if yes"** — 같은 주제에서 정반대. 6.3·6.5(비KP)·1.5(손 한 번=이해)도 '한 번=예' 쪽 → K2.
5. **[문법] swap 16** "I'm so sorry to share that he **is no longer with us** a few minutes ago." — 현재형+a few minutes ago 비문 → N2.
6. **[설계] pair 19 정답 둘** — `ask` + `if you understand me` = "ask if you understand me"(이해했는지 묻다) 성립 → N1.
7. **[ko 오역·KP] 15.1 "stay with me" → "저와 함께 있어 주세요"** — 듣는 사람은 공황 상태 가족, 용법은 "저한테 집중해 주세요" → S3.

## 고칠 것 — 문장 (keyPhrase 아님 + KP의 ko·words)
문장 en을 바꾸면 `chunks`·`ko`·`words`도 함께 바꾸고, **그 문장의 v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 쓰는 order 줄·단어 example/exKo도 맞추고, `changes-core-language-icu.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 그 문장의 **distractorsKo 둘을 새 ko에 맞춰 다시** 쓰세요.

- **S1 [약속] 19.6** · en `I'm right here, and I'll keep checking on you.` · chunks `I'm right here / , and I'll keep / checking on you / .` · ko `제가 여기 있어요, 계속 살펴볼게요.` · words `[w-keep, w-check]`(w-leave 태그 뺌 — w-leave는 15.3·16.5에 남음). v46 전부 새로(지금 blank `leave`, decoy `your things`, 오답 "이야기를 놓치지/말을 끊지"는 새 문장에 안 맞음).
- **S2 [약속] 17.6** · en `We can call an interpreter again whenever you need one.` · chunks `We can call / an interpreter again / whenever / you need one / .` · ko `필요하실 때마다 통역사를 다시 부를 수 있어요.` · words `[w-call, w-interpreter, w-need]` → **w-long은 어느 문장도 태그하지 않게 되어 은행에서 삭제**(word-remove; 상황 17은 서로 다른 단어 15개로 V3 충족, 뉘앙스 words에 w-long 없음). v46 전부 새로(지금 blank `stay`, 오답 "아침까지/한 시간 동안").
- **S3 [ko·KP] 15.1** · ko만 `통역 전화가 곧 연결돼요, 저한테 집중해 주세요.`(en·chunks 그대로, 결정 11) + distractorsKo 둘 다시. words에서 **w-stay 태그 뺌**(이 stay는 '머무르다'가 아님; w-stay는 9.6·15.3·19.2에 남음).
- **S4 [ko·KP] 0.0** · ko `제가 바로 전문 통역사를 불러드릴게요.`("공식"→"전문", professional) + distractorsKo 둘 다시. w-interpreter·w-professional의 exKo를 같은 문장으로, order(상황 0) 1줄 ko `바로 공식 통역사를…` → `바로 전문 통역사를 불러드릴게요`.
- **S5 [ko] 5.5** · ko `혼자서 전부 통역하실 걱정은 안 하셔도 돼요.`(notes-A 7번 타당, worry는 살림) + distractorsKo 둘 다시(지금 "기억하려고/적으려고 걱정하지" 틀). w-worry·w-translate exKo 같은 문장으로.
- **S6 [청크] 15.3** "Stay right here, I'm not leaving." — en은 유지(위기 순간 간호사가 침상을 지키는 것은 지킬 수 있는 약속, notes-A 5번 중 15.3은 유지 판정). chunks만 `Stay / right here / , I'm not leaving / .`(`I'm not / leaving` 끊김).
- **S7 [청크] 구 경계 끊김(비KP)** — en 그대로 chunks만:
  - 2.6 `I'll check on you / again / in a few minutes / .`(`in a few / minutes`)
  - 6.6 `We'll keep checking in / every few minutes / .` → 낱말 6개라 3조각 필요: `We'll keep / checking in / every few minutes / .`(`checking / in every` — 구동사 check in이 끊김)
  - 4.4 `I'll write it down / so you can / see it / .`(`write / it down`)
  - 5.6 `You've already helped / a lot / just by being here / .`
  - 12.3 `This sheet has / pictures / for each medicine / .`(`pictures for`)
  - 16.3 `I'll speak slowly / so you have time / to take this in / .`(`take this / in`)
  - 17.3 `There's / no single right answer / in this situation / .`
  - 20.3 `Tell me more / about what / concerns you / .`(`concerns / you`)
  - 청크를 바꾼 문장은 decoy가 새 청크 자리에 맞는지 B 필드도 확인.
- **T1 [태그] 9.2(KP)** words에서 **w-take 뺌** — 카드 ko "(시간을) 갖다"인데 문장은 "takes the burden off".
- **T2 [태그] 18.0(KP)** words에서 **w-fair 뺌** — 형용사 카드가 부사 `fairly`에 붙음(w-fair는 9.3·18.6에 남음).

## 고칠 것 — 단어
- **W1 ★ w-much** distractorsKo `많은`은 much의 뜻 그대로(정답 둘). distractorsEn `many`도 "so many"=그렇게 많이로 겹치고 `such`는 품사가 달라 걸러짐 → dEn `[little, most]`, dKo `[그렇게 조금, 가장 많이]`.
- **W2 w-clear** distractorsKo `깨끗한`은 clear의 다른 뜻(clear skin/fluid) → `복잡한`.
- **W3 ★ w-lot** distractorsEn `less` — "helped a less" 품사로 걸러짐 → `[plot, slot]`(dKo는 `[줄거리, 틈]`).
- **W4 w-basic 헤드워드** — 카드는 형용사 `basic`(기본적인), 유일한 문장 5.3은 명사 `the basics`. 결정 11대로 en `basics` · ipa `/ˈbeɪsɪks/` · ko `기본 사항` · chips `[[ba, sics]]` · decoyChips `[bay, sick]` · dEn `[details, bases]` · dKo `[세부 사항, 기초 공사]`(id 그대로; changes에 word en·ipa·ko).
- **W5 w-concern** — 카드 ko `우려`(명사), 유일한 문장 20.3은 동사 "what concerns you". ko `걱정되게 하다`, dEn `[conceal, concede]`, dKo `[숨기다, 인정하다]`, cue 끝을 "…이유를 물을 때 쓰는 동사"로.
- **W6 cue가 ko를 되풀이(9개)** — ko 낱말을 빼고 장면으로:
  - w-response "…환자가 보이는 반응" → `말을 걸거나 손을 잡았을 때 환자가 보이는 눈 뜨기·손 쥐기 — 진정 환자에게서 기다리는 것`
  - w-news "새로 알게 된 소식" → `새로 알게 된 일 — 좋든 나쁘든 가족에게 전하는 내용, 앞에 '힘든'이 붙기도`
  - w-alone "오직 혼자" → `곁에 아무도 없이 — 슬픈 소식 뒤 가족을 홀로 두지 않겠다고 할 때`
  - w-fully "빠짐없이 충분히 — 충분히 이해할 때까지" → `일부만이 아니라 빠짐없이 — 이해할 때까지 시간을 줄 때`
  - w-way "방법이나 방식" → `어떤 일을 해 나가는 방법 — 상대가 편한 말투로 맞추겠다고 할 때`
  - w-rather "하느니 차라리…" → `'would ○○'로 써서 어느 쪽을 더 바라는지 물을 때 — 피했으면 하는 말을 물을 때`
  - w-own "그 사람 자신의" → `남의 것이 아니라 그 사람 것 — 들은 내용을 자기 말로 되풀이하게 할 때(teach-back)`
  - w-moment "아주 잠깐 동안" → `아주 짧은 시간 — 반응을 기다려 주겠다고 할 때`
  - w-small "크기나 중요도가 작은" → `크기나 중요도가 하찮은 — 사소해 보여도 물어보라고 용기를 줄 때`
- **W7 decoyChips(조각 맞추기에 실제로 나오는 여러 조각 단어만)** — 술·속어·모욕 조각:
  - ★ w-member `bar`(술집) → `bur` · ★ w-basic `bar` → `bay`(W4와 같이)
  - ★ w-letter `lit`(취한 — 속어)·`tar`(담배) → `[lat, tor]` · ★ w-gently `lit` → `tle`(→ gentle, 좋은 헷갈림; 대체 경로 아님)
  - ★ w-appropriate `ape`(사람을 낮추는 말로 쓰임) → `app`
  - w-clearly `lay`(성적 속어) → `lee` · w-naturally `nut`(속어) → `net`
  - (참고, 화면에 안 나옴: 조각 하나짜리 단어의 decoy `dye`(die 소리, w-eye)·`ash`(화장, w-ask)·`harm`·`crush`는 건너뛰는 단어라 두어도 됨. 선택: w-great dEn `grave`, w-fair dEn `fatal`은 임종 주제에서 무덤·죽음이 떠오름 — `grand/grain`, `faint/fade`로 바꾸면 더 좋음)
- **W8(낮음) w-help** ko `돕다` — 문장 9.0·15.5·19.5는 명사(a great help, More help, Help is on the way) → `돕다·도움`(w-call `부르다·전화하다`와 같은 방식).
- **W9(낮음) w-print** ko `인쇄체`는 손글씨의 '정자체(print your name)' 뜻 → `large print`에 맞게 `활자`.

### 품사가 다른 distractorsEn (전부)
| 단어 | 정답 품사(문장) | 오답 | 판정 |
|---|---|---|---|
| ★ w-lot | 명사(a lot) | less(한정사·부사) | "a less" 문법으로 걸러짐 → W3 |
| ★ w-much | 대명사·부사(so much) | such(한정사) / many(뜻 겹침) | "so such" 걸러짐 → W1 |
| w-everything | 대명사 | everywhere(부사) | 약함 — `everywhere` → `nothing`(은행 단어, 뜻 다름; dKo `모든 곳` → `아무것도`) |
| w-anything | 대명사 | anywhere(부사) | 약함 — `anywhere` → `something`(dKo `어디든` → `무언가`) |
| w-alone / w-long | 형용사·부사 | along(전치사·부사) | 허용(부사로도 쓰임) |

## 고칠 것 — 뉘앙스
- **N1 ★ pair 19(통역 부재 응급)** 정답 둘 — `ask` + `if you understand me`("ask if you understand me" 성립). 오른쪽 `if you understand me` → `once for yes`(squeeze my hand once for yes ✓ / ask once for yes ✕ / point to once for yes ✕). why의 "손 쥐기로 이해했는지 보고" → "손 쥐기로 예를 표시하게 하고".
- **N2 ★ swap 16(나쁜 소식)** 선택지 `is no longer with us` → `left us`("…that he left us a few minutes ago." 문법 맞음), notes 키도 바꾸고 해설 "더 돌려 말해서 뜻이 흐려진다" 유지.
- **N3 ★ context 12 아이콘 뒤바뀜** — `보호자에게` icon `me`, `환자에게` icon `home`(주제 전체는 환자=me, 가족=home). N4에서 새로 쓰면서 맞추세요.
- **N4 context 10개가 핸드오프 모양이 아님(v46 7번)** — 세 장면 모두에 word가 있긴 하나(W14 통과), 어색한 장면의 문제가 **word가 아니라 덧붙인 다른 임상어**(LEP·certified·CPOT·medication reconciliation·attending·multi-organ dysfunction·PRN·VRI bandwidth·protocol·palliative consult·adherence)이고, word 자체(interpreter·comfortable·confirm·explain·condition·medication·help·situation·belief)는 가족·환자에게도 쓰는 말입니다. 이 주제의 뉘앙스는 A가 새로 쓴 것이라(base에 nuance 없음) who·icon·ok도 바꿀 수 있습니다. **word를 그 어색한 임상어로 옮기고, 그 말이 의료진끼리는 자연스러운 장면 둘 + 가족·환자에게 그 말을 그대로 쓴 장면 하나**로 다시 쓰세요(`words`는 이 상황 문장이 쓰는 기존 id 그대로 두면 됨, `ko`·`why`도 새 word에 맞춰):
  | 상황 | 지금 word | 새 word·ko | ok 장면 2 | 어색한 장면(→ fix) |
  |---|---|---|---|---|
  | 0 통역 요청 | interpreter | `LEP` · 영어 사용 제한 | 동료 "Pt is LEP — can you book a Korean interpreter for rounds?" / 차트 "LEP, Korean; interpreter used for admission history." | 가족 "Your mother is LEP, so we have to use an interpreter." → "We'll bring in an interpreter so your mother can follow everything in Korean." |
  | 2 진정 환자 | comfortable | `RASS` · 진정 점수 | 차트 "RASS −1, comfortable on current sedation." / 인계 "Her RASS is minus one on propofol." | 보호자 "Her RASS is minus one right now." → "She's resting and opens her eyes when we talk to her." |
  | 5 가족 정보 | confirm | `reconcile` · (약 목록을) 맞춰 보다 | 약사 "Can you help me reconcile his home meds tonight?" / 차트 "Home meds reconciled with pharmacy list." | 깨어난 환자 "We need to reconcile your medications." → "We'll go over your medicines with you and the interpreter to make sure our list is right." |
  | 7 동의 설명 | explain | `attending` · 담당 전문의 | 동료 "The attending will explain the procedure at three; I've booked the interpreter." / 차트 "Attending at bedside for consent, Korean interpreter present." | 가족 "The attending will explain the procedure." → "Dr. Kim, the doctor in charge of his care, will explain it, and the interpreter will tell you every word." |
  | 8 문화·금기 | condition | `MODS` · 다발성 장기부전 | 의사 보고 "He's in MODS — kidneys and liver both failing." / 차트 "MODS, CRRT started." | 가족 "He's in MODS." → "Several of his organs, like his kidneys and liver, are very weak right now." |
  | 12 약물 교육 | medication | `PRN` · 필요할 때 | 약사 "Can you add the PRN doses to the Korean med list?" / 차트 "Oxycodone PRN given for pain 6/10." | 보호자(home) "Give this one PRN." → "Give this one only when he needs it for pain." |
  | 13 원격 통역 | interpreter | `VRI` · 영상 원격 통역 | 직원 "Is the Korean VRI free in the next five minutes?" / 차트 "Korean VRI used, interpreter ID noted." | 가족 "I'll set up the VRI now." → "I'll set up the video interpreter on this screen now." |
  | 15 위기 | help | `respiratory distress` · 호흡곤란 | 동료 "Bed four is in respiratory distress — I need help now." / 차트 "Acute respiratory distress, RT at bedside." | 보호자 "She's in acute respiratory distress." → "She's having a hard time breathing, and we're helping her right now." |
  | 17 임종 결정 | situation | `surrogate` · 대리 결정자 | 동료 "The daughter is the surrogate — family meeting at four." / 통역사에게 "Please interpret for the surrogate, his daughter, word for word." | 가족 "As the surrogate, you have to make this decision." → "You know him best, so we'll think together about what he would have wanted." |
  | 20 문화 갈등 | belief | `ethics consult` · 윤리 자문 | 동료 "Can we get an ethics consult for bed seven?" / 차트 "Ethics consult placed re: treatment refusal." | 가족 "I've placed an ethics consult." → "I've asked our ethics team, who help families and doctors with hard choices, to talk with us." |
  - context 10(`oriented`)만 지금 모양이 맞음 — 그대로.
  - 17의 why에 "결정은 대리 결정자가 '환자가 원했을 것'을 기준으로(substituted judgment)"를 넣으면 pair 17과 이어짐. 20의 지금 장면 "Your belief is a barrier to adherence."는 같은 뜻이 아니라 비난이라 어차피 실패.
- **N5 swap 6 해설 과장** — notes `wish for`: "환자가 원하지 않아도 흡인이 필요한 경우를 놓치고 처치가 늦어질 수 있다"는 근거 없음(흡인은 환자 신호와 함께 간호사가 호흡음·분비물·SpO2로도 사정). → "바람을 말하는 딱딱한 표현이라 짧은 신호 질문에 어울리지 않는다." why 끝에 "흡인 여부는 신호와 함께 간호사가 직접 사정해요" 덧붙임.
- **N6(낮음) pair 10** `lip` + `print` = "lip print"(실제 쓰이는 명사구) → 오른쪽 `print` 대신 `letters`(large letters, 10.4; words에 w-letter 추가, w-print 빼기). 오답 `touch sheets`는 없는 물건이라 `a call bell`로.
- **N7(낮음) pair 8** 오답 `your insurance card` — "correct your insurance card"가 문법상 됨 → `a warm blanket`.
- **N8(낮음) pair 12** 오른쪽 `a dose if you forget`이 "miss a dose if you forget"(잊으면 거르세요)로 읽힘 → `a dose by mistake`. pair 13 오답 `to be sunny`는 장면 밖 말이라 쉽게 걸러짐 → `the call bell`(speak in/wait for/pause so 어디에도 안 붙음).

나머지 판정: pair 2·3·5·7·9·11·17·18은 전 조합에서 정답 하나. slider 8개 모두 약함→강함 순서가 맞고 cue로 정답이 하나(16 `difficult`는 dialysis 소식에 devastating도 가능하나 "먼저 예고하는 말"이라는 why로 갈림 — 유지). swap 1·3·4·9·11·14·18·19는 이어 붙인 문법 맞음, swap `ko` 10개 모두 바꾼 문장의 뜻과 맞음.

## 저작자 메모 판정
| 메모 | 판정 |
|---|---|
| A1 0.0 "공식"→"전문" | 타당 → S4 |
| A2 7.0 통역사가 설명 | 타당. KP라 en은 K1(사용자 결정) |
| A3 17.6 "필요한 만큼 있겠다" | 타당 → S2 |
| A4 15.1 stay with me ko | 타당(듣는 사람은 가족 → "저한테 집중해 주세요") → S3 |
| A5 15.3·19.6 곁을 떠나지 않겠다 | 19.6은 고침(S1). 15.3은 위기 중 침상을 지키는 말이라 유지(청크만 S6). KP 19.2는 K4 |
| A6 깜빡임 정반대 | 타당, 둘 다 KP → K2 |
| A7 5.5 ko 어색 | 타당 → S5 |
| A8 20.2 윤리팀+통역사를 중재자로 | 타당, KP → K3 |
| A9 w-page → on the same page | 타당(page 단독은 너무 쉽고 뜻도 안 맞음). 헤드워드는 문장 en에 이어서 나옴. 다만 KP 14.0 청크가 `on the same / page`로 구를 끊음 → K6 |
| 17.1 '환자가 원했을 것' 기준 | 맞음. 미국 대리 결정의 기본은 substituted judgment(환자가 원했을 것), 모를 때만 best interest. 유지 |
| B 메모(오답 수위) | B 검토 몫 — 여기서 판정하지 않음 |

## 결정 11 — 저작자 변경 판정
- word-remove 24: 공통 목록 14 + 판단 10(right·away·yes·no·one·two·here·again·down·same) — 상한 10 지킴, 과하지 않음. 
- word ko 22건: talk/speak/say, check/confirm, stop/pause, fully/completely, much/lot, honor/respect 가르기 모두 타당. w-print만 W9.
- sentence 71건: 전부 words 태그만, en·ko·chunks 변경 없음(스크립트 확인).
- 추가로 필요한 것: W4(basic)·W5(concern)·T1·T2·S3 태그.

## keyPhrase — 사용자 결정 필요 (en·chunks는 고치지 않음)
| # | 문장(현재 en) | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 7.0 The interpreter will explain the procedure fully. | 동의 설명은 의사의 일, 통역사는 옮길 뿐. 같은 상황 context why와 모순 | `The doctor will explain the procedure fully, through the interpreter.` (단어 explain·procedure·fully·interpreter 그대로) | **바꿈(강)** |
| K2 | 1.2 Blink twice for yes, once for no — is that okay? | 6.0·6.1(KP)·6.3·6.5의 "한 번=예"와 정반대 — 같은 주제에서 학습자가 헷갈림. 미국 병상에서 흔한 약속도 한 번=예 | `Blink once for yes, twice for no — is that okay?` (w-blink exKo도 맞춤) | **바꿈** |
| K3 | 20.2 The interpreter and ethics team can help us find common ground. | 통역사를 공통점을 찾는 중재자로 묶음(통역사는 말과 뜻을 옮길 뿐, 중재·옹호는 윤리팀·의료진) | `With the interpreter, the ethics team can help us find common ground.` | 바꿈(중) |
| K4 | 19.2 You're safe — I'm staying right here with you. | 응급 중 "safe" 단정·곁 약속 소지 | — | 유지(위기 순간 간호사가 침상에 있는 것은 사실). swap 19 notes `safe`를 "상태가 아니라 지금 지켜지고 있다는 뜻"으로 그대로 둠 |
| K5 | 16.0 The interpreter will convey this gently and completely. | 통역사는 어조를 바꾸지 않고 그대로 옮김 — gently가 '순화'로 읽힐 수 있음 | — | 유지. 이 문장 v46 why에 "부드러움은 말하는 의료진의 말에서, 통역사는 그 어조까지 그대로 옮긴다"를 넣기 |
| K6 | 청크 구 끊김 | ★10.0 `his hearing / aids and` · ★14.0 `on the same / page` · 15.1 `— stay / with me` · 17.1 `what he would / have wanted` · 19.0 `the phone interpreter / line` · 19.1 `Point to this / picture board` · 10.1 `on his better / side` · (약) 8.2 `appropriate for / your family` | 10.0 `We can use / his hearing aids / and / a large-print board / .` · 14.0 `Let's make sure / we're both / on the same page / .` · 15.1 `The interpreter phone / is coming / — stay with me / .` · 17.1 `Let's decide / based on / what he would have wanted / .` · 19.0 `I'm using / the phone interpreter line / right now / .` · 19.1 `Point to / this picture board / to tell me / what you feel / .` · 10.1 `I'll face him / and speak clearly / on his better side / .` | chunks만 바꾸기 권고(★ 둘은 꼭) |

## 종합
고칠 것 57건 = 문장 16(S1~S6 6 · 청크 8 · 태그 2) + 단어 23(W1~W5 5 · cue 9 · decoy 7 · 낮음 2) + 뉘앙스 18(N1~N3 3 · context 재작성 10 · N5~N8 5). 그중 ★(꼭) 10. 환자 안전으로 분류할 것은 0건이고, 지킬 수 없는 약속 2(S1·S2)와 KP 결정 K1~K3가 내용상 가장 무겁습니다. context 10개 재작성과 N1·N2·S1·S2를 반영하고 K1·K2를 결정하면 내보내도 됩니다.
