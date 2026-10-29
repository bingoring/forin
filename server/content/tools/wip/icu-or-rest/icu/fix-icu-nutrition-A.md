# icu-nutrition — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `icu-nutrition.yaml`(A·B 합본). 단어 256, 상황 21(문장 150), 뉘앙스 42(slider 18 · pair 3 · context 21 · swap 0 · reel 0).
임시 스크립트: `rv_icu-nutrition_dump.py` (words / sents / nuance / checks).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 3 | 철자 닮음은 대체로 좋으나 품사가 다른 오답이 약 25개(표 참고, ★ 15개) |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과. w-lay `눕다`만 정답 둘 위험(lay = lie의 과거형) |
| 3 cue | 3 | 정답 노출 없음. 다만 대부분 사전식 정의라 "언제·누구에게"가 약함(고칠 것은 아님). w-residual cue 사실 흠 1 |
| 4 chips/decoyChips | 4 | 자르기는 좋음. 술·속어·장례 조각 몇 개(표) |
| 5 뉘앙스·문장 사실 | 3 | resuscitation=CPR 오역(안전), ACS에서 수액 추가, ICU 안 RRT, IR 침상 삽입, 간호사 진단 단언 |
| 6 뉘앙스 설계 | 3 | pair 유문후 정답 둘, slider 2개 정답 모호(sting·fast), slider 배변 축 섞임 |
| 7 결정 11 | 4 | 삭제 23/279(8%), 문장 66건은 words만 — 과하지 않음. ko 가름 뒤 문장 ko가 안 따라온 곳 3 |

## 사실 오류·심각한 문제
1. **장허혈·괴사 응급 0 (KP) "Hold all feeds and start resuscitation now."** — 여기 resuscitation은 쇼크에 대한 수액·혈압 소생인데 문장 ko `소생술`, 단어 w-resuscitation ko `소생술`·cue "숨이나 심장이 멎은 사람을 되살리려고 하는 응급 처치"는 **CPR**로 가르친다. 학습자가 맥박 있는 환자에게 CPR 지시로 오해. en은 KP라 그대로, ko·단어만 고침(아래 S1, 결정 11 K1).
2. **복부구획증후군 급변 위기 6 "I'll give more fluid while we wait for the surgeon."** — 지시 없는 단독 수액 투여 약속이고, 복부구획증후군에서 수액 과다는 복압을 더 올리는 원인(같은 상황 2번 "optimize volume"과도 어긋남). 안전(S2).
3. **장허혈·괴사 응급 4 "This looks like dead bowel, and we need surgery now."** — 간호사가 괴사 진단·수술 필요를 단언(S3).
4. **장허혈·괴사 응급 6 "Get the rapid response team here now."** — RRT는 보통 일반 병동용. ICU 안에서는 중환자 전담의/담당의를 부른다. 슬라이더 crash `why`의 "신속대응팀"도 같은 문제(S4).
5. **유문후 급식 전환 4 "Interventional radiology will place the tube at the bedside."** — IR은 투시실(fluoroscopy)에서 넣는다. 침상 삽입은 훈련된 간호사·의사가 전자기 유도 등으로 하는 것(S5).
6. **영양 요구·경로 사정 6 "Once his gut is working well, we'll try the first spoonful by mouth."** — 입으로 먹기 시작의 조건은 장 기능이 아니라 삼킴 평가(같은 상황 slider cue도 "swallow hasn't been checked"). 가족에게 잘못된 기준을 줌(S6).

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면: `chunks`·`ko`·`words` 함께, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank) 새로 쓰기**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`도 맞추고, order 줄에 같은 문장이 있으면 맞추고, `changes-icu-nutrition.yaml`에 적기.

- **S1 [안전] 장허혈·괴사 응급 0 (KP, ko만)** · ko `급식을 모두 중단하고 지금 소생술을 시작해요.` → `급식을 모두 중단하고 지금 바로 소생 처치(수액·혈압 유지)를 시작해요.` distractorsKo 둘 새 ko에 맞춰 다시. 단어 쪽은 K1.
- **S2 [안전] 복부구획증후군 급변 위기 6** · en `I'll stay with him while we wait for the surgeon.` · chunks `I'll stay / with him / while we wait / for the surgeon / .` · ko `외과의사를 기다리는 동안 제가 곁에 있을게요.` · words `[w-stay, w-wait, w-surgeon]` (w-give·w-fluid 태그 뺌 — 다른 문장에 남음, V3 19개 유지). w-surgeon·w-wait의 example/exKo, order 줄(파일 9361행 근처) 맞추기. v46 필드 새로.
- **S3 [사실·범위] 장허혈·괴사 응급 4** · en `I'm worried this could be dead bowel, and surgery needs to see her now.` · chunks `I'm worried / this could be / dead bowel / , and surgery needs / to see her now / .` · ko `장이 괴사된 것일까 봐 걱정돼서, 수술팀이 지금 바로 봐야 해요.` · words `[w-worry, w-dead, w-bowel, w-need, w-surgery]`. w-dead example/exKo 맞추기. v46 필드 새로.
- **S4 [사실] 장허혈·괴사 응급 6** · en `Get the intensivist to the bedside now.` · chunks `Get / the intensivist / to the bedside / now / .` · ko `중환자 전담의를 지금 침상으로 불러 주세요.` · words `[w-bedside]` → w-rapid·w-response는 어느 문장도 태그하지 않게 되므로 은행에서 삭제(word-remove). 상황 단어 22개로 V3 유지. 같은 상황 slider(crash) `why`의 "바로 신속대응팀과 의사를 부르고" → "바로 중환자 전담의와 담당의를 부르고". v46 필드 새로.
- **S5 [사실] 유문후 급식 전환 4** · en `Interventional radiology will place the tube under fluoroscopy.` · chunks `Interventional radiology / will place / the tube / under fluoroscopy / .` · ko `영상의학과에서 투시 영상을 보며 관을 넣어 줄 거예요.` · words `[w-radiology, w-place, w-tube]` (w-bedside는 6번에 남음). w-radiology·w-place·w-bedside example/exKo, order 줄(8860행 근처) 맞추기. 같은 상황 context(suction) 의사 장면 "…at the bedside when the new tube goes in" → "…at the bedside when he comes back from IR"로. v46 필드 새로.
- **S6 [사실] 영양 요구·경로 사정 6** · en `Once he passes a swallow test, we'll try the first spoonful by mouth.` · chunks `Once he passes / a swallow test / , we'll try / the first spoonful / by mouth / .` · ko `삼킴 검사를 통과하면 입으로 첫 숟가락을 시도해 볼 거예요.` · words `[w-swallow, w-try, w-first, w-spoonful, w-mouth]` → w-work는 미사용이 되어 은행 삭제(쉬운 말이기도 함). w-gut·w-well은 다른 문장에 남음. 해당 단어 example(369~426행) 맞추기. v46 필드 새로.
- **S7 [범위·권장] 장허혈·괴사 응급 5** "I'm giving fluids and calling the physician right away." — 지시 없는 수액 투여로 읽힘 · en `I'm getting fluids ready and calling the physician right away.` · chunks `I'm getting / fluids ready / and calling the physician / right away / .` · ko `수액을 준비하면서 바로 의사에게 연락하고 있어요.` · words `[w-fluid, w-call, w-physician, w-rightaway]`. v46 필드 새로.
- **S8 [사실·권장] 장관영양 시작·내성 관찰 3** "I'll check residuals every four hours per protocol." — 간격은 병원마다 다르고, 미국 ICU는 위잔여량을 일상적으로 재지 않는 추세(ASPEN/SCCM). per protocol이 완충하므로 en 유지도 가능. 바꾼다면 · en `I'll check residuals as often as our protocol says.` · chunks `I'll check residuals / as often as / our protocol says / .` · ko `위잔여량은 저희 프로토콜에 정한 대로 확인할게요.` · words `[w-check, w-residual, w-protocol]`. 유지하면 최소한 그 문장 `why`에 "병원마다 간격이 다르고 일상적으로 재지 않는 곳도 있다"를 넣기.
- **S9 [부자연] 위잔여량·촉진제 사용 5** "I told her family, and that's a great sign." — that이 '가족에게 말한 일'을 가리켜 뜻이 꼬임 · en `That's a great sign, and I told her family.` · chunks `That's / a great sign / , and I told / her family / .` · ko `아주 좋은 징후라서 가족분께도 알려드렸어요.` · words 그대로. 같은 상황 slider(great sign) `example`·`exKo`, w-great·w-sign·w-tell example 맞추기. v46 필드 새로.
- **S10 [chunks] 장관영양 시작·내성 관찰 5** `lowers his / aspiration risk` → `Keeping / the head of the bed up / lowers / his aspiration risk / .`
- **S11 [chunks] 복강내압 측정 4** `to his / reading` → `Let's compare it / to his reading / from this morning / .`
- **S12 [chunks] 심한 재영양증후군 위기 6** `for any new / changes` → `I'll watch / his heart monitor / for any new changes / .` (S10~S12는 en 그대로, blank·decoy가 바뀐 청크에 걸리면 함께 확인)
- **S13 [ko] 배변·복부 팽만 관찰 3** "Your belly does feel a bit tight…" ko `…보이네요` → `오늘 배가 만져 보니 좀 팽팽하고 부풀어 있네요.` (feel은 촉진). distractorsKo 둘 다시.

기준: 단어 ko와 문장 ko는 글자가 같을 필요 없음 — 문장 ko는 틀렸거나 어색할 때만 고친다. 그래서 장허혈 감별 0·3 `배가 팽팽`, 장허혈·괴사 응급 3 `배가 단단`은 표준 어법이라 **고치지 않음**(선택: w-tense·w-rigid ko와 글자를 맞추고 싶으면 `단단하게 긴장돼`·`딱딱하게 굳어`).

판정만(고치지 않음): 영양관 위치 3 "I told him it might sting going in…" — 동료에게 한 설명을 전하는 보고라 자연스러움, 유지. 장관영양 불내성 4 "Let's hold the feed for now" — 팀 제안 어투, 유지.

## 고칠 것 — keyPhrase ko (결정 11 범위, en은 그대로)
- **tolerance `견디는 정도` vs 문장 ko `내성` — 사용자 결정(두 안)**: 경관영양 (불)내성은 한국 간호 표준 용어이고 상황 제목 둘("…내성 관찰", "…불내성 관리")도 그렇게 씀. 문장 `내성`은 틀린 말이 아니다.
  - 안 1(권장): w-tolerance ko를 `내성`으로 되돌리기(changes 항목 삭제, distractorsKo `[반응속도, 흡수정도]`는 길이 맞춰 그대로 가능). 한 줄로 끝남.
  - 안 2: 단어 ko 유지하고 장관영양 불내성 관리 0(KP) ko를 `속도를 줄이고 급식을 견디는 정도를 다시 평가해요.`로 — distractorsKo 둘, exKo 2곳(2180·2201행), order 줄 ko(7096행, B 영역)까지 연쇄 수정.
- **장허혈·괴사 응급 2** ko `혈압을 지지하고` → `혈압을 유지하도록 돕고 광범위 항생제를 투여해요.` (w-support `보조하다`와 맞춤). distractorsKo 둘 다시.
- **복강내압 측정 0** ko `지금 방광압을 설치해서 측정할게요.`(압력을 '설치') → `지금 방광압 측정 장치를 설치하고 잴게요.` distractorsKo 둘 다시.
- **영양 목표 열량·단백 조정 2** ko `그의 상태에 맞춰` → `환자 상태에 맞춰 영양액을 조절할게요.` distractorsKo(8194·8195행) 다시, exKo 3곳 맞추기. (권장) 장기 영양불량 6 `지금 그에게` → `지금 이분께`.

## 고칠 것 — 뉘앙스
- **pair 유문후 급식 전환 [정답 둘]** — `keep a post-pyloric tube`가 영어로 성립하고 decoy `a clean sock`이 `keep`·`place`에 붙음. → pairs `[[place, a post-pyloric tube], [resume, the feeds], [aspiration, risk]]`, decoys `[the pylorus]`, words `[w-place, w-resume, w-aspiration]`. 전 조합 확인함(place/resume/aspiration × a post-pyloric tube/the feeds/risk/the pylorus — 정답 짝 외 성립 없음). why를 aspiration risk 설명으로 고쳐 쓰기.
- **pair 흡인 예방 체위** — 전 조합 정답 하나(`lay the head of the bed`는 flat 없이 불완전). 유지.
- **pair 복부구획증후군 조기 인지** — 전 조합 정답 하나(`urine function`·`organ output` 불성립). 유지. decoy `pillow case`는 분야 밖이지만 붙지 않음.
- **slider 영양관 위치 확인 [정답 둘]** — cue "It stung as it went in, but it passed quickly."로는 `a slight sting`(0)도 맞고 why도 "순간적인 따끔함"이라 0을 설명함. → cue `Patient: "It stung sharply going in, but it passed quickly."`, why 첫 문장 "날카롭게 따끔했지만 곧 지나갔다면 a sharp sting이에요. 견디기 힘든 통증(unbearable pain)은 아니에요."로.
- **slider 재영양증후군 예방 [모호·예문 모순]** — `too fast`/`far too fast` 구분이 주관적이고 example은 "too fast"를 씀. → scale `[slow enough, a little fast, too fast]`, answerAt 2. why의 "far too fast"를 "too fast"로.
- **slider 배변·복부 팽만 [축 섞임]** — `[a bit tight, very tight, painful]`은 팽팽함과 통증이 섞임. → scale `[a little sore, painful, very painful]`, answerAt 2 (cue "hard as a rock and it really hurts now"), words `[w-painful]`, why 첫 문장 맞추기. 또는 `[a bit tight, tight, hard]`로 팽팽함 축만.
- **slider 위잔여량·촉진제 (great sign)** — good/great 구분이 약하지만 cue 두 호전으로 great 쪽. 유지, example만 S9에 맞춤.
- **slider 영양 요구 (not safe yet)** — `quite risky`도 그럴듯함. 경계, 유지 가능.
- **context 영양 요구 (nutrition)** 동료 장면 `Can you check his nutrition rate before you chart it?` — "nutrition rate"는 안 쓰는 말 → `Can you chart his nutrition intake for this shift?`
- **context 영양관 위치 (x-ray)** 의사 장면 `I'm sending him for an x-ray…` — ICU는 침상 이동식 촬영 → `The x-ray is done, so can you confirm the tube tip before we feed?`
- **context 흡인 예방 (airway)** 동료 장면 `Can you suction his airway if he coughs during the feed?` — 급식 중 기침이면 먼저 급식을 멈춰야 함 → `If he starts coughing during the feed, stop it and suction his airway.`
- **context 복부구획 급변 (surgery)** 의사 장면 `…so I'm calling surgery for decompression.` — 의사에게 감압을 정해 통보하는 모양 → `His pressure is over twenty-five — should I call surgery?`
- **context 장관영양 시작 (residual)** why 끝에 "요즘 미국 ICU는 위잔여량을 일상적으로 재지 않는 곳도 있어, 잴지와 간격은 병원 프로토콜을 따라요." 추가 권장.
- **context 장허혈 감별 (lactate)** fix 영어가 어색 → `One of her blood tests is higher than we'd like, so we're checking her belly carefully.`
- context 21개 판정: 세 장면 모두 `word` 있음(W14 0), 듣는 사람이 의사/동료/가족·환자로 모두 다름, 어색한 장면은 모두 가족·환자에게 전문어로 말한 곳이고 fix는 같은 뜻. nutrition·belly·dietitian·spoonful·suction·insulin·comfort는 fix에도 `word`가 남아 "그 말"보다 주변 전문어가 어색함의 원인이지만 TASK 9(끼워 넣기 금지)에 따라 `word` 재설계는 권하지 않음. swap 문항은 없음(swap `ko` 확인 대상 없음).
- **뉘앙스 why·notes 사실 판정**: 조기 경관영양(장 우선)·튜브 위치 엑스레이 확인·침상 머리 올림(각도는 프로토콜)·재급식 인·칼륨·마그네슘·영양 계획은 영양사와 의료진·인슐린 조정은 의료진과 상의/지시 — 모두 미국 관행에 맞음. 걸린 것은 위 crash why(RRT)뿐.

## 고칠 것 — 단어
단어의 `en·ko·ipa·icon·example`을 바꾸거나(K1·coverage·bottom/waste 헤드워드·example 맞춤) 단어를 지우면(get·work·rapid·response) 전부 `changes-icu-nutrition.yaml`에 적기(V16).

**distractorsEn 품사가 다른 것 (전부)** — ★는 꼭 바꿀 것.
| 단어(품사) | 오답 | 문제 | 대안 |
|---|---|---|---|
| ★ work (동) | word | 명사 | wake |
| ★ well (부) | wall, will | 명사·조동사 | ill, wildly |
| ★ every (한정사) | even, very | 부사 | any, several |
| ★ hold (동) | hood | 명사 | howl |
| ★ down (부) | gown, dawn | 명사 | out, over |
| ★ flat (형/부) | flap, float | 명사·동사 | flush, slack |
| ★ slide (동) | slime | 명사 | stride |
| ★ sit (동) | sir | 명사 | set |
| ★ full (형) | fuel, fill | 명사·동사 | foul, dull |
| ★ slow (동) | slot | 명사 | stow |
| ★ monitor (동) | motor | 명사 | motivate |
| ★ measure (동) | pleasure | 명사 | reassure |
| ★ refeeding (명) | refreshing, redeeming | 형용사 | refilling, rebleeding |
| ★ check (동) | cheek | 명사 | cheat |
| ★ safe (형) | save | 동사 | same |
| rule (명) | rude | 형용사 | role 유지 + rail |
| vein (명) | vain | 형용사 | vane |
| change (동) | chance | 명사 | chase |
| blood (명) | blond | 형용사 | brood |
| hear (동) | near | 형용사 | heal |
| bottom (동, bottom out) | button | 명사 우세 | bother 유지 + bottle |
| lay (동) | lap | 명사 우세 | lie는 의도된 오답이라 유지, lap → pay |
| respiratory (명, 팀) | respective, repository | 형·명 섞임 | 경계, 유지 가능 |
| along (부) | among | 전치사 | 경계, 유지 가능 |
| dressing (명) | pressing | 형용사 | 경계, 유지 가능 |

- **W13 w-lay 오답 `lie`** — 유지(lay/lie 혼동이 가르칠 값). 다만 **distractorsKo `눕다`는 바꿀 것**: "lay"는 lie의 과거형(누웠다)이기도 해 듣고 뜻 고르기에서 `눕다`가 정답처럼 들림 → `앉히다`.
- **K1 [안전] w-resuscitation** ko `소생술` → `소생 처치`, cue → "쇼크로 무너지는 환자에게 수액과 약으로 순환을 되살리는 응급 처치". distractorsKo `[소독법, 진정술]` 길이 맞춰 재확인.
- **w-residual cue** "급식이 끝난 뒤" — 지속 급식 중에도 잰다 → "관으로 빨아내 보면 위 속에 아직 남아 있는 영양액의 양".
- (선택) **w-coverage** ko `보충 요법` → `보정 인슐린`(혈당에 맞춰 추가로 주는 인슐린)이 더 정확. distractorsKo 길이 맞춰(`기저 인슐린`, `지속 인슐린`). 문장 ko `인슐린 보충`은 틀리지 않아 그대로.
- **decoyChips 비속어·술·장례·성적 조각** (전 256단어 정답 조각·decoy·오답 대조):
| 단어 | 조각 | 판정 | 대안 |
|---|---|---|---|
| w-rhythm | rye | 술(라이 위스키) — 음식·음료 주제라 바꿈 | ray |
| w-worry | rye | 술 | wry |
| w-calorie | rye | 술 | ray |
| w-worry (dEn) | bury | 장례(매장) | carry |
| w-worry | war | 폭력 연상, 경계 | were |
| w-check | chick | 여성 비하 속어, 경계 | chuck과 겹치니 chock |
| w-syndrome | sin | 종교, 경계 | sun |
| w-position · w-potassium | pot | 대마 속어지만 '냄비'가 우세 — 경계, 유지 가능 | pit |
| w-dietitian | dye | die와 같은 소리, 경계 | dia |
| w-target | tart | 영국 속어(헤픈 여자), 경계 | tar |
| w-crash (dEn) | crack | 마약 속어지만 '금 가다'가 우세 — 유지 |
| w-point | joint | '관절'이 우세 — 유지 |
| w-bed·w-bedside·w-dead·w-report·w-support | bed·dead·port | 정답 조각 — 제외 |
- 술 관련은 rye 3곳 외에 없음(beer·wine·gin·rum·ale·bar·shot 등 없음). 성적 조각 없음.

## 결정 11 판정
- 삭제 23개(공통 목록 13 + eat·here·job·love·much·same·small·think·together·too) — 모두 간호사가 아는 말, 23/279 ≈ 8%로 1할 안쪽. 태그 변경 66문장은 전부 `words`만, en·ko·chunks 손대지 않음. 상황별 V3(8개 이상) 유지. **과하지 않음.** ko 가름 29건도 타당(check/verify/confirm, placement/position, alert/flag/notify, document/chart, tense/tight, rigid/hard 등).
- 남은 흠:
  - **w-get** ko `마련하다`가 남은 4문장(get an x-ray / get a CT scan / get broad antibiotics / Get … here)에 하나도 맞지 않음 → 4문장 태그를 빼고 word-remove(쉬운 말). 상황별 V3 유지(유문후 20, 장허혈 감별 23, 장허혈 응급 22).
  - 위 S6·S4로 미사용이 되는 w-work·w-rapid·w-response word-remove.
  - **헤드워드**: w-bottom → `bottom out`(문장 bottomed out), w-waste → `waste away`(문장 wasting away). ipa·example·chips·오답도 맞추기.
  - w-tolerance ko 가름(`내성`→`견디는 정도`)은 과했을 수 있음 — 위 두 안. tense `팽팽`·rigid `단단` 문장 ko는 표준 어법이라 그대로.
  - 뜻 겹침(서로의 오답은 아니라 문제 작음, 기록만): w-stomach `위/배` ↔ w-belly `배`, w-gut `장` ↔ w-bowel `창자`.
  - 상황 제목 "장관영양 시작·내성 관찰"의 `내성`은 in-json 제목이라 이번 범위 밖 — 사용자 판단.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)
| 상황·index | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 혈당·전해질 연계 감시 2 | We'll adjust insulin coverage as needed. | 인슐린 조정을 간호사가 알아서 하는 약속처럼 읽힘(척도 변경은 처방) | We'll give insulin coverage as ordered. | 바꾸기(약) |
| TPN 관련 대사 위기 0 | Let's adjust the insulin and recheck the glucose. | 같은 문제 | Let's get the insulin adjusted and recheck the glucose. | 바꾸기(약) — 위와 같이 결정 |
| 복부구획증후군 급변 위기 1 | I'm calling surgery for urgent decompression. | 수술팀 호출은 흔하나 "감압을 위해"가 치료 결정을 전제 | I'm calling surgery about urgent decompression. | 유지 가능(SICU는 수술팀이 주치 팀), 바꾼다면 대안 |
| 장허혈·괴사 응급 1 | I'm calling surgery for an emergent evaluation. | 평가 요청이라 범위 안 | — | 유지 |
| 장허혈·괴사 응급 2 | Let's support her pressure and get broad antibiotics. | 항생제 시작은 처방이지만 Let's(팀) 어투 | Let's support her pressure and get broad antibiotics ordered. | 유지, 문장 why에 "처방에 따라" 보강 |
| 장허혈 감별 징후 0 | Rising lactate with a tense belly makes me hold feeds. | 급식 보류는 프로토콜상 간호 판단 범위이고 다음 문장이 의사 통보 | — | 유지 |
| 장허혈·괴사 응급 0 | Hold all feeds and start resuscitation now. | en은 맞음, ko가 CPR | — | en 유지, ko만 고침(위) |
| chunks 보고 | `for a rising / number`(복강내압 1), `We may / need`(TPN 대사 2), `his body isn't keeping / up`(영양불량 0), `what would / give him`(영양불량 2), `his illness is / very advanced`(영양불량 1) | 구 경계를 끊음 | 청크만 다시 자르기(en 그대로) | chunks는 V4 비교 대상인지 확인 후 결정 |

## 종합
고칠 것 57건(문장 13 · keyPhrase ko 3 · 뉘앙스 10 · 단어 오답 품사 ★15 · decoy 조각 9 · 단어 ko/cue 4 · 결정 11 3), 그중 안전 3(S1+K1 resuscitation=CPR 오역, S2 복부구획에서 수액 추가, context airway 기침 시 급식 중단). 사용자 결정: keyPhrase 표 + tolerance 두 안.
안전 3건과 사실 4건(괴사 단언, ICU 안 RRT, IR 침상 삽입, 삼킴 대신 장 기능)을 고치고, pair 유문후·slider 2개·품사 ★ 15개·술 조각을 바꾸면 내보내도 됩니다. keyPhrase 인슐린 2문장은 사용자 결정.
