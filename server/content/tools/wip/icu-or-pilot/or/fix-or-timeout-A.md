# fix — or-timeout (A 검토)

범위: v45 절 1~7, 기계적 전수 확인(pair 전 조합·chunks 전수·distractorsEn 품사·swap 이어 읽기), v46 7번(context 핸드오프 모양·swap `ko`), 저작자 메모 A·B의 문장 지적.
대상: 단어 142개, 뉘앙스 43문항(slider 14·pair 8·context 19·swap 2), 문장 105개. base와 v44 필드 차이는 changes의 단어 ko 5건뿐(일치 확인).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 철자·소리가 닮은 오답이 대부분이지만, 품사가 다른 오답이 약 25건(W-POS 표). `special`의 `specific`은 정답으로도 읽힘 |
| 2 | distractorsKo·길이 | 4 | 길이 규칙은 142개 전부 통과. `confirm`의 `확정하다`는 confirm의 실제 뜻이라 정답이 둘. `chart`의 `기록지 양식`, `sponge`의 `솜뭉치`는 경계에 있음 |
| 3 | cue | 4 | 정답 영어·약어를 드러낸 것은 없음. ko를 되풀이한 cue 3건(stabilize·type·sponge) |
| 4 | chips/decoyChips | 4 | 대체로 형태소 단위. `timer`의 `time/r`만 어색함 |
| 5 | 뉘앙스 사실 정확성 | 4 | 저작자 지식 4건 모두 맞음(아래). 틀린 것 1건: S7 pair why "드레이프 뒤에는 표시를 다시 보기 어렵다"는 Joint Commission 기준(표시는 소독·드레이프 뒤에도 보여야 함)과 어긋남. 검체 라벨은 환자 이름 하나로 적혀 식별자 두 개 원칙과 어긋남. 계수를 "two nurses"로 적은 것은 부정확 |
| 6 | 뉘앙스 설계 | 3 | context 19개 중 10개가 핸드오프 모양이 아님. 어색함이 `word`가 아니라 덧붙인 전문어(verification elements·medicolegal·concordance·hemodynamics 등)에서 나옴. pair에 두 번째 정답 조합 2건(state the surgical site, send the specimen). S18 swap은 이어 읽으면 대문자가 문장 중간에 옴 |
| 7 | v44 단어·문장(결정 11) | 3 | changes 5건은 타당함. 다만 공통 쉬운 단어 7개와 목록 밖 쉬운 말 9개가 태그로 남아 있음. 같은 단어를 다른 뜻으로 태그한 것 2건(S8 `hold`=확보, S11 `set`=맞추다). S8 문장 ko "보류 중"은 뜻이 반대. `circulating`·`type`·`double`·`vital`의 ko·헤드워드가 문장과 어긋남 |

### 저작자가 자기 지식으로 쓴 사실 판정
- **cefazolin 재투여 약 4시간 간격** — 맞음. ASHP/IDSA/SIS/SHEA 2013 지침은 cefazolin 재투여 간격을 4시간으로 두고, 첫 투여를 시작한 시각부터 셉니다. S11 slider(07:32 → 11:32, 11:15 = due soon)도 맞습니다. 참고로 같은 지침은 출혈량이 1,500 mL를 넘어도 재투여하라고 합니다. 지금 문항에 넣을 필요는 없습니다.
- **시술이 바뀌면 타임아웃 재실시** — 맞음(단서 있음). Universal Protocol(UP.01.03.01)이 명시하는 것은 "한 환자에게 시술이 둘 이상이고 집도자가 바뀌면 시술마다 타임아웃"입니다. 시술 변경·추가 때 다시 하는 것은 AORN 권고와 대부분 병원 정책입니다. why가 "보통 병원 정책에 따라"로 적어 정확합니다. 덧붙일 것은 F-17에 있습니다.
- **항생제 절개 전 60분 이내(vancomycin·fluoroquinolone은 120분)** — 맞음(같은 2013 지침, SCIP Inf-1).
- **TeamSTEPPS CUS** — 맞음. 단계는 I'm Concerned → I'm Uncomfortable → This is a Safety issue이고, "stop the line"도 TeamSTEPPS·AHRQ에서 쓰는 표현입니다.
- 저작자 메모의 "ten seconds·thirty seconds"는 말하는 예시이고, 뉘앙스 why가 병원 정책인 것처럼 말하지 않습니다(S16 why는 "몇 초면 되고"). 고치지 않습니다(keyPhrase 결정 목록 K-4 참고).

## 사실 오류·심각한 문제

1. **S8 예상 출혈·수혈 논의, 문장 1(keyPhrase)의 ko**: "팩은 보류 중입니다". 영어 "units are on hold"는 혈액은행이 이 환자를 위해 혈액을 **확보해 잡아 둔** 상태입니다. 한국어 "보류 중"은 거꾸로 '내주지 않고 미뤄 둔' 것으로 읽혀, 수혈 준비가 안 된 것처럼 배웁니다. 같은 상황의 pair why와 그 문장의 why는 "따로 잡아 둔 상태"로 맞게 설명해서, 문장 ko와 서로 어긋납니다. 같은 ko가 w-type·w-cross·w-unit·w-hold의 exKo 4곳에도 있습니다. 게다가 w-hold(ko 보류하다)가 이 문장에 태그돼 있어 '보류'라는 잘못된 뜻을 굳힙니다. → D-2
2. **S7 영상 좌우 대조 pair의 why**: "드레이프를 덮은 뒤에는 표시를 다시 보기 어려워요". Joint Commission UP.01.02.01은 부위 표시가 **소독·드레이프 뒤에도 보이게** 하라고 요구합니다. '덮으면 표시가 안 보이는 게 정상'으로 배울 수 있습니다. → F-3
3. **S14 검체 처리 pair**: `label — with the patient's name`과 why "환자 이름 같은 식별 정보". 검체 라벨은 **식별자 두 개**가 원칙입니다(NPSG.01.01.01, 이름 + 생년월일 또는 등록번호, 환자 앞에서 붙임). 이름 하나면 된다고 배울 수 있습니다. → F-4
4. **context 10문항이 핸드오프 모양이 아님**(v46 7번 / TASK 9): 어색한 장면을 덧붙인 제도어·전문어로 어색하게 만들었고, `word` 자체는 그 사람에게 써도 문제없습니다. why도 그 덧붙인 말을 설명합니다. → F-7~F-16

## 고칠 것

### 결정 11 (단어·문장, changes에 적을 것)

- **D-1 · 쉬운 단어 태그 빼기(16개) · 문장 `words`에서 태그를 빼고 은행에서 지우기(word-remove).**
  - 공통 목록 7개: `w-patient · w-name · w-nurse · w-know · w-time · w-hour · w-go`.
  - 목록 밖이지만 간호사가 이미 아는 말 9개: `w-give · w-use · w-take · w-new · w-long · w-stay · w-other · w-put · w-down`.
  - **`w-need`는 남깁니다.** 빼면 S1 "절개 전 팀 정지"가 서로 다른 단어 7개로 V3에 걸리고, 그 상황 문장에 새로 태그할 만한 말이 없습니다.
  - 스크립트로 확인했습니다. 16개를 빼고 D-2·D-3까지 반영해도 상황마다 서로 다른 단어는 최소 8개입니다(S1 8, S10 8, S19 8, 나머지 9~14). 비는 문장은 없습니다.
  - 지운 id를 가리키는 **뉘앙스 `words`도 고칩니다**(V15). S0 pair `w-name`, S3 pair `w-nurse`, S4 slider `w-give`·`w-time`, S11 slider `w-hour`, S18 slider `w-put`·`w-down`, S18 swap `w-other`, S19 slider `w-give`를 지웁니다. 지워도 각 문항에 단어가 남습니다.
  - changes: 문장마다 `{kind: sentence, situation, index, fields: [words]}`, 단어마다 `{kind: word-remove}`.
- **D-2 · S8 문장 1(keyPhrase, en은 그대로) · ko가 뜻을 뒤집고 다른 뜻의 hold를 태그함.**
  - 고칠 것: ko를 "혈액형·교차 검사는 끝났고, 혈액 팩은 확보돼 있습니다."로 바꾸고 `words`에서 `w-hold`를 뺍니다. S8 pair `words`에서도 `w-hold`를 뺍니다.
  - distractorsKo 둘을 새 ko에 맞춰 다시 씁니다. 예: "…끝났고, 혈액 팩은 주문 중입니다." / "혈액형·교차 검사는 접수됐고, 혈액 팩은 확보돼 있습니다."
  - w-type·w-cross·w-unit의 exKo도 같은 문장으로 고칩니다.
  - w-hold의 example·exKo는 S19 문장으로 바꿉니다: "Can we hold the incision until they're given?" / "투여될 때까지 절개를 보류할 수 있을까요?" (example은 v44 필드라 changes에 적습니다.)
- **D-3 · S11 문장 1 "I'll set a timer" · `w-set`(ko 준비를 마친)이 '맞추다'라는 다른 뜻으로 태그됨** · `words`에서 `w-set`을 뺍니다(S3 "all set?"에는 남김).
- **D-4 · w-circulating ko · 단어는 "순회하는", 문장 ko·w-nurse cue·뉘앙스 why는 "순환 간호사"** · 한국 수술실에서 더 흔한 **순환**으로 통일합니다.
  - ko를 "순환하는"으로 바꿉니다.
  - distractorsKo의 `순환기의`는 새 ko와 너무 닮아 헷갈리므로 `소독하는`으로 바꿉니다(소독간호사 = scrub). 결과는 `[소독하는, 멸균된]`.
- **D-5 · w-type ko "혈액형" · "type and cross"의 type은 혈액형을 정하는 검사**(cue도 "혈액형을 검사하는 일") · ko를 "혈액형 검사"로, distractorsKo를 `[혈액량 검사, 혈당 검사]`로 바꿉니다. cue는 ko를 되풀이하지 않게 "수혈 전 ABO·Rh를 정하는 일 — 'and cross'와 한 쌍"으로 고칩니다.
- **D-6 · w-double ko "재확인의" · 태그된 말은 double-check의 double이고, double 자체의 뜻은 '두 번·이중'** · ko를 "이중의(두 번)"로 바꿉니다. distractorsKo `[단순한, 마지막의]`는 그대로 둡니다.
- **D-7 · w-vital 헤드워드 · 문장 두 곳 모두 명사 `vitals`인데, 헤드워드는 형용사 vital이고 ko는 명사 "활력징후", cue는 "(형용사)"라 서로 어긋남**(부사가 묶인 형용사와 같은 갈래).
  - en을 `vitals`, ipa를 `/ˈvaɪtəlz/`로 바꿉니다. cue의 "(형용사)"는 "(명사, 늘 복수)"로 고칩니다.
  - chips `[[vi, tals]]`, distractorsEn `[vials, visuals]`, distractorsKo는 그대로 둡니다. id는 바꾸지 않습니다.
- **D-8 · S13 문장 2(keyPhrase)·4 ko · w-align ko를 "(생각을) 맞추다"로 바꿨는데 문장 ko는 사람에게 "일치했으면"을 써서 어색함.**
  - 문장 2 → "계속하기 전에 다 같이 생각을 맞췄으면 합니다." distractorsKo → "마치기 전에 다 같이 생각을 맞췄으면 합니다." / "계속하기 전에 다 같이 자리에 모였으면 합니다."
  - 문장 4 → "새 계획에 대해 모두 생각이 맞춰져 있는지 확인합시다." distractorsKo → "새 지침에 대해 모두 생각이 맞춰져 있는지 확인합시다." / "새 계획을 모두 읽었는지 확인합시다."
- D-9 · (선택) S5 문장 2(keyPhrase) ko "회복실을 위해 다뤄야 할 장비 우려가 있나요?" · "for recovery"는 회복 관리를 위한 것(WHO sign-out의 "key concerns for recovery") · "회복 관리를 위해 짚어야 할 장비 문제나 우려가 있나요?"로 바꾸고 distractorsKo 둘도 다시 씁니다.
- changes 5건(check·start·note·run·align) 판정: 모두 타당합니다. `run`의 "(수술이) 이어지다"는 "runs longer"(길어지다)와 조금 어긋나지만 틀리지 않아 그대로 둡니다.

### 단어 (v45 필드)

- F-19 · w-confirm · distractorsKo `확정하다`는 confirm의 실제 뜻(confirm a booking)이라 정답이 둘 · `생략하다`로 바꿉니다(타임아웃 장면에서 같은 분야, 4자).
- F-20 · w-special · distractorsEn `specific` · cue "이 수술에만 필요한"이 procedure-specific에 그대로 맞아 정답으로도 읽힘 · `spacious`로 바꿉니다.
- F-21 · w-chart · distractorsKo `기록지 양식` · 차트와 뜻이 겹침 · `처방전`으로 바꿉니다.
- F-22 · w-sponge · distractorsKo `(수술용) 솜뭉치` · peanut·cottonoid 같은 작은 sponge가 솜뭉치처럼 보여 겹침. cue도 ko "거즈"를 되풀이함 · 오답을 `(수술용) 봉합사`로, cue를 "피를 닦고 누르는 흰 천 — 봉합 전에 개수를 센다"로 바꿉니다.
- F-23 · **distractorsEn 품사 불일치**(스크립트로 전수, 정답 품사 → 바꿀 오답):

  | id | 정답(품사) | 품사가 다른 오답 | 바꿀 말 |
  |---|---|---|---|
  | w-procedure | 명사 | proceed(동) | process |
  | w-proceed | 동사 | procedure(명) | progress |
  | w-right | 형용사 | write(동) | tight (write는 decoyChips로) |
  | w-knee | 명사 | need(동) | knot |
  | w-agree | 동사 | agent(명) | disagree |
  | w-correct | 형용사 | collect(동) | corrupt |
  | w-imaging | 명사 | imagine(동) | imagery (imagine은 decoyChips로) |
  | w-anticipate | 동사 | anticipation(명) | articulate |
  | w-significant | 형용사 | signature(명) | magnificent |
  | w-open | 형용사 | oven(명)·often(부) | opaque·even |
  | w-due | 형용사 | dew(명)·duty(명) | dual·dull |
  | w-miss | 동사 | mass·mist(명) | mix·mess |
  | w-second | 명사 | sacred·secure(형) | section·segment |
  | w-aware | 형용사 | ware(명)·away(부) | awake·wary |
  | w-continue | 동사 | continuous(형) | contribute |
  | w-stabilize | 동사 | stabilizer(명) | sterilize |
  | w-voice | 동사 | vice·choice(명) | void·vouch |
  | w-quick | 형용사 | quite(부) | slick |
  | w-quiet | 형용사 | quit(동) | quaint |
  | w-fully | 부사 | fuel(명) | freely |
  | w-size | 명사 | seize(동) | side |
  | w-close | 동사 | clause(명) | cause |
  | w-loss | 명사 | loose(형) | lapse |
  | w-blood | 명사 | bleed(동) | blot |
  | w-participate | 동사 | partition(명) | precipitate |
  | w-hold | 동사 | hole(명) | hoard |

  distractorsKo는 바뀐 영어 오답과 따로 놀므로 그대로 두어도 됩니다. 길이 규칙만 다시 돌리세요.
- F-24 · w-timer · chips `[[time, r]]`의 `r`이 형태소가 아님 · `[[tim, er]]`, decoyChips `[tam, or]`.
- F-25 · w-stabilize cue "붙잡아 안정시키는 것"이 ko를 되풀이함 · "혈압이 갑자기 떨어진 환자를 수액·승압제로 더 나빠지지 않게 붙잡아 두는 일 (동사)".

### 뉘앙스

- F-1 · S0 마취 전 sign-in · pair · `state + the surgical site`도 자연스러운 영어(환자가 부위를 말함)라 정답이 둘 · 짝을 `["mark", "the site with a skin marker"]`로 바꿉니다. why의 표현도 이에 맞춥니다.
- F-2 · S5 종료 sign-out · pair · `send + the specimen`이 자연스러워 정답이 둘 · 짝을 `[count, the sponges] · [label, with two identifiers] · [send, to pathology]`로 바꿉니다. 결합을 다시 확인했습니다: count/label + to pathology ✕, send/count + with two identifiers ✕, 오답 the incision은 셋 모두 ✕.
- F-3 · S7 영상 좌우 대조 · pair why · 사실 오류(심각 2) · 뒷문장을 "드레이프를 덮으면 몸 전체의 좌우를 한눈에 보기 어려워서 그 전에 맞춰 봐요. 부위 표시는 덮은 뒤에도 보여야 해요."로 바꿉니다.
- F-4 · S14 검체 처리 · pair · 사실(심각 3) · 짝 오른쪽을 `with two patient identifiers`로 바꾸고, why를 "라벨에는 이름과 생년월일처럼 식별자 두 개를 적고, 검체 부위도 함께 적어요"로 고칩니다.
- F-5 · S5 종료 sign-out · context 기록 장면 "Final counts correct, verified by two nurses." · 계수는 스크럽(테크일 수 있음)과 순환 간호사가 함께 합니다 · "Final counts correct, verified by scrub and circulator."로 바꿉니다.
- F-6 · S18 wrong-site 임박 차단 · swap · 이어 읽으면 "Doctor, Stop right now —", "Doctor, You always do this —"로 대문자가 문장 중간에 옴 · options와 answer·notes 키를 `stop right now —`, `you always do this —`로 소문자 처리합니다(`I might be wrong, but`은 그대로). swap ko는 정확함.
- **context 핸드오프 모양 정비**(장면 `en`·`fix`·`why`만 고침, `who`·`icon`·`ok`는 그대로):
  - F-7 · S1 `time-out` · 어색함이 "Universal Protocol verification elements"에서 나옴 · 어색한 장면을 "Hang on — we're calling a time-out."으로 바꿉니다. why: "time-out은 팀과 기록에서는 정식 절차 이름이지만, 환자에게는 '경기 중단'처럼 들려 무슨 문제가 생긴 줄 알 수 있어요. 무엇을 확인하는지 풀어 말해요." fix는 그대로 둡니다.
  - F-8 · S2 `agree` · "pre-incision verification elements" 덧붙임 · 어색한 장면을 "Do you agree it's your right knee?"로 바꿉니다. why: "팀끼리는 agree로 각자의 동의를 받지만, 긴장한 환자에게 예/아니요로 물으면 그냥 '네' 하기 쉬워요. 환자 확인은 직접 말하게 하는 열린 질문으로 해요." fix는 "Can you tell me which knee we're operating on today?"로 바꿉니다(Joint Commission·WHO의 '환자가 직접 말하게' 원칙).
  - F-9 · S4 `document` · "medicolegal purposes" 덧붙임 · 어색한 장면을 "Your antibiotic administration has been documented."로 바꿉니다. why는 "기록에 남겼다는 보고는 팀 안의 말이에요. 환자에게는 무엇을 왜 했는지가 필요해요."로 고칩니다. fix는 그대로 둡니다.
  - F-10 · S7 `verify` · "imaging concordance" 덧붙임. verify는 환자에게도 무리 없는 말 · `word`를 `imaging`(ko 영상)으로 바꿉니다. 장면: 팀 "Let's verify the imaging matches the marked side." / 기록 "Imaging reviewed: left knee, matches site marking." / 환자 ✕ "We're checking your imaging against the mark." fix는 그대로(X-ray). why: "imaging은 X선·MRI를 통틀어 부르는 의료진 말이라, 환자에게는 엑스레이처럼 구체적으로 말해요." `words`는 `[w-imaging]`.
  - F-11 · S9 `implant` · 어색함이 "cobalt-chrome tibial component"에서 나옴. implant는 환자에게도 통함 · 어색한 장면을 팀 내부 상태 보고를 그대로 전하는 "Your implant is open on the back table."로 바꿉니다. why: "implant가 개봉됐는지는 팀의 확인 사항이에요. 환자에게는 '열려 있다'가 무슨 뜻인지 모르고 걱정만 줘요." fix는 그대로 둡니다.
  - F-12 · S12 `participate` · 어색함이 실습생에게 쏘아붙이는 말투이고, fix에는 participate가 없어 다른 뜻 · 어색한 장면을 "You will participate in this time-out — no exceptions."로, fix를 "We'd like you to participate too — if anything looks off, please speak up."로 바꿉니다. why는 지금 것을 유지합니다.
  - F-13 · S13 `change` · "operative plan… re-verifying elements" 덧붙임 · 어색한 장면을 팀 약어를 그대로 던지는 "Change of plan — we're adding a meniscus repair."로 바꿉니다. why: "팀끼리는 짧게 '변경'만 말해도 되지만, 깨어 있는 환자에게 설명 없이 던지면 놀라요. 왜 멈추고 다시 확인하는지 함께 말해요." fix는 그대로 둡니다.
  - F-14 · S15 `discrepancy` · "regarding laterality"가 어색함의 절반 · 어색한 장면을 "There's a discrepancy in your paperwork."로 줄이고, why에서 laterality 언급을 빼고 "discrepancy는 환자에게 서류 문제처럼 불안하게 들려요"로 고칩니다.
  - F-15 · S16 `quick` · 어색함이 "No time… hold still"에서 나옴. quick은 환자에게 써도 됨 · `word`를 `critical`(ko 중대한, `words` [w-critical])로 바꿉니다. 장면: 팀 "Give me ten seconds for the critical checks." / 기록 "Abbreviated time-out: critical items confirmed." / 환자 ✕ "We're only doing the critical checks on you." fix는 그대로 둡니다. why: "critical은 팀끼리는 '핵심'이지만 환자에게는 '위독하다'로 들려요."
  - F-16 · S20 `stabilize` · "hemodynamics" 덧붙임. "We're working to stabilize him"은 가족에게 흔히 하는 말이라 어색하지 않음 · `word`를 `vitals`(ko 활력징후, D-7 뒤)로 바꿉니다. 장면: 마취과 "His vitals just changed — let's hold the incision." / 기록 "Vitals unstable after time-out; incision held." / 가족 ✕ "His vitals changed, so we're holding." fix는 그대로 둡니다. why: "vitals는 팀끼리의 줄임말이라, 가족에게는 무엇이 어떻게 바뀌었고 무엇을 하는지 말해요." `words`는 `[w-vital]`.
  - S0 induce·S3 case·S5 count·S8 access·S10 aware·S11 redose·S14 handle·S17 concern·S19 hold는 핸드오프 모양이 맞아 그대로 둡니다.
- F-17 · (경미) S13 시술 변경 slider why · 시술을 추가할 때 동의서 범위 확인이 빠짐 · 끝에 "추가하는 시술이 동의서에 들어 있는지도 함께 확인해요."를 붙입니다.
- F-18 · (경미) S15 slider scale 마지막 "Everyone leave the room."이 같은 저울(정지 강도) 위에 있지 않음 · "Nobody touches anything — I'm calling the charge nurse."로 바꿉니다.
- F-26 · (경미, keyPhrase 아님) chunks.
  - S17 문장 3 `", but I" / "need"`가 주어와 동사를 갈라 `need`만 남음 · `["No one else", "spoke up", ", but I need", "to voice this", "."]`로 바꾸고, decoy `, while I`는 `, while I need`로 바꿉니다.
  - S10 문장 3 `"should be" / "aware"` · `["Everyone", "on the team", "should be aware", "of the latex allergy", "."]`로 바꾸고, decoy `afraid`는 `should be afraid`로 바꿉니다.

## keyPhrase 결정 필요 목록 (보고만, en은 바꾸지 않음)

- K-1 · S8 문장 1 · ko만 고침(D-2) — 뜻이 뒤집혀 있어 고치기를 권합니다.
- K-2 · S13 문장 2 · ko만 고침(D-8).
- K-3 · S5 문장 2 · ko만 고침(D-9, 선택).
- K-4 · S16 문장 1 "Give me ten seconds…", S12 문장 2 "Let's take thirty seconds…" · 저작자 지적(숫자를 못 박음). 말하는 예시이고 정책 주장이 아니어서 **그대로 두기를 권합니다.**
- K-5 · chunks가 구 경계를 끊음: S16 문장 0 `"Even in" / "an emergency"`, S18 문장 2 `"is on" / "the other side"`, S19 문장 2 `"I'm drawing" / "it up"`(구동사가 갈림).

## 참고 (고치지 않음)

- S12 문장 4 "It only takes thirty seconds to be present."는 조금 어색하지만 틀리지 않아 두었습니다.
- w-set(준비를 마친)과 w-ready(준비된)는 ko가 가깝지만 서로의 오답으로 쓰지 않았으므로 정답이 둘이 되지는 않습니다.
- 저작자 B 메모에 따르면 문장 ko 오류는 없었다고 했는데, D-2(S8 "보류 중")를 놓쳤습니다.

## 종합

고칠 것은 결정 11 쪽 9건(D-1은 단어 16개를 묶은 한 건, D-9는 선택)과 v45 쪽 26건(품사 표 F-23은 한 건)입니다. 사실 오류 3건(S8 ko, S7 드레이프, S14 라벨)과 context 10문항 정비를 반영하면 내보내도 됩니다. 저작자가 자기 지식으로 쓴 4가지 사실은 모두 맞습니다.
