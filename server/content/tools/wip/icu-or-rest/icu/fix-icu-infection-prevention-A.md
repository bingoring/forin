# fix-icu-infection-prevention-A — A 검토 (v45 1~7 + 기계적 전수 + v46 7번 + swap ko)

대상: `icu-infection-prevention.yaml` (A·B 합친 파일; `.pre-fix.yaml`과 같은 내용 확인). 단어 204개, 상황 21개, 문장 106개, 뉘앙스 42개.
비교: base, changes(110건 — 문장 `en` 변경은 0건, 단어 정리·태그 제거만), in-json, notes-A.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 혼동성은 대체로 좋지만, 품사가 다른 오답이 약 60개(아래 표). 뜻이 거의 같은 오답 2건(restore↔restart, consistent↔constant) |
| 2 | distractorsKo·길이 | 4 | 길이는 전부 통과. 정답에 가까운 오답 3건(site↔피부, dressing↔붕대 감기, mean↔보여 주다). 두 오답이 서로 같은 뜻인 것 5건 |
| 3 | cue | 4 | 정답 영어를 드러낸 단서는 없음. `ko`를 되풀이만 한 단서 8건 |
| 4 | chips·decoyChips | 4 | 자른 자리는 좋음. 비속어·불쾌한 조각 2건은 꼭 바꿔야 하고(hell, tramp) 6건은 바꾸기를 권함 |
| 5 | 뉘앙스·문장 사실 | 3 | 뉘앙스 `why`는 대체로 CDC·SHEA와 맞음. 다만 문장에 CDC 관행과 어긋나는 것이 있음(이송 중 가운·장갑, PEP 시작을 간호사가 '오늘' 함, 아무 N95나 건네기, 방문객 N95 밀착검사) |
| 6 | 뉘앙스 설계 | 4 | pair는 정답이 하나뿐이고 swap 문법도 맞음. slider 순서가 한 방향으로 가지 않는 것 3건. context는 19개 모두 '3번째 장면·가족에게·전문용어'로 모양이 같음(앱이 섞지 않으면 읽지 않고도 맞힘). S14 장면 대상이 어긋남 |
| 7 | 결정 11 | 4 | changes 110건은 타당함. 남은 것: w-blame `ko`의 품사, w-sign 뜻 섞임, w-line `ko`가 너무 좁음, w-brush/w-wipe `ko` 겹침 |

## 저작자 메모 판정

| 메모 | 판정 |
|---|---|
| S18 문장 3 "for a full minute" | **타당.** CDC·NIOSH 지침은 "비누와 물로 씻는다"까지만 말하고 시간을 정하지 않는다. 지침에 없는 숫자를 약속하는 셈이고, chunks도 `for a full / minute`으로 구를 끊는다. → 고칠 것 F3 |
| S18 문장 4 "start the PEP protocol today" | **타당하고 안전 문제.** PEP는 직업보건 담당(Employee/Occupational Health)이나 응급실 의사가 평가해 처방한다. 게다가 HIV PEP는 노출 뒤 몇 시간 안(가능하면 2시간 안)에 시작하는 것이라 'today'는 너무 느슨하다. → F4 |
| S19 "gowned staff"(문장 1은 KP, 문장 4는 비KP) | **타당.** CDC 2007 격리 지침의 보호환경 항목은 감염 의심이 없으면 HSCT 환자에게 가운·마스크·장갑 같은 차단 조치를 일률로 요구하지 않는다(핵심은 손위생, 건강한 직원, 생화·화분 금지, HEPA·양압). 문장 1은 KP라 사용자 결정 K1, 문장 4는 고칠 것 F5 |
| S4 문장 1 표지 색 | **부분적으로 타당.** 색 체계는 병원마다 다르지만 한 병원 안에서는 맞는 말이다. pair `why`가 이미 "병원마다 표지 색은 달라도"라고 짚었다. 유지해도 됨 — 사용자 결정 K2(낮음) |
| S3 문장 4 구강 관리 빈도 | **타당.** SHEA 2022는 클로르헥시딘 없이 매일 하는 칫솔질을 기본 조치로 둔다. AACN 실무는 칫솔질을 하루 2회 정도, 보습·면봉 관리를 2~4시간마다로 한다. "몇 시간마다 이를 닦는다"는 실제보다 잦다. → F6 |
| S10 문장 0 코호팅 조건 | **문장은 맞음, 바꿀 필요 없음.** CDC 2006 MDRO 지침대로 같은 균일 때 코호팅한다. slider(MRSA와 VRE는 따로)도 맞다 |
| 활용형으로 남긴 헤드워드(breathing, sealed, shared, exposed, gowned, limited, dedicated, fit-tested) | 형용사로 쓰인 것이라 유지가 타당함. 다만 `CAUTIs`는 약어의 복수형일 뿐이라 `CAUTI`로 바꾸기를 권함(D11-9, 선택) |
| w-negative·w-pressure를 함께 태그 | 유지해도 됨 |
| w-count 두 뜻 | 쓰이는 뜻은 '인정되다' 하나라서 유지해도 됨 |

## 사실 오류·심각한 문제

1. **S9 문장 4 "Everyone on transport should wear a gown and gloves."**(비KP) — CDC 2007 격리 지침(III.B.3)과 반대다. 접촉주의 환자를 옮길 때는 오염된 보호구를 벗고 손위생을 한 뒤 출발하고, 도착지에서 환자를 다룰 때 새 보호구를 입는다. 가운·장갑을 입은 채 복도를 다니면 오염을 퍼뜨린다. 같은 내용이 order 3번째 줄에도 있다. [안전]
2. **S18 문장 4 "start the PEP protocol today"**(비KP) — 업무범위 밖이고 시작 시점도 늦다. order 4번째 줄의 "get you evaluated today"도 같은 문제다. [안전]
3. **S16 문장 3 "Let me grab you a fitted N95"**(비KP) — 틀렸다기보다 부정확하다. N95는 본인이 밀착검사를 받은 그 모델·크기를 써야 하는데, 아무 N95나 가져다주면 된다고 읽힌다. order 3번째 줄 "a fitted one"도 같다. [안전 — 호흡보호]
4. S16 slider `why`: "방문객에게 밀착검사를 거친 N95가 필요" — OSHA 밀착검사는 직원 대상이다. 방문객은 병원 지침에 따라 N95를 받고 착용법을 안내받는다(밀착검사는 하지 않음). 사실 오류.
5. S2 slider `cue`: "passing urine without help, and the catheter is still in" — 도뇨관이 꽂혀 있으면 스스로 소변을 볼 수 없다. 장면 자체가 말이 안 된다.
6. S15 context 3번째 장면 "multiple index cases" — index case는 정의상 첫 사례다. 틀린 전문용어이고, `why`가 이를 "정확히 전해요"라고 한다.
7. S17 swap `ko` "치료가 어려워서 빨리 퍼질 수 있으니" — `en`에 없는 인과(치료가 어렵다 → 빨리 퍼진다)를 만들었다.

## 고칠 것 — 필수 31건(그중 안전 3건: F1·F4·F7) + 조건부 1건(F5, K1에 따름) + 선택 6건(F2·F14·F23·D11-6·D11-7·D11-9)

셈: F1·F3·F4·F6~F13·F15~F22·F24~F29 = 25건, D11-1~5·D11-10 = 6건. D11-8은 판정이라 세지 않음.

### 문장 (비KP) — 고칠 en·ko·chunks. 고친 문장은 **v46 필드 전부(tag·icon·why·decoy·distractorsKo 2개·blank)를 새 문장에 맞춰 새로 쓰고**, 그 문장을 example로 쓰는 단어의 `example`·`exKo`도 바꿀 것

- **F1 [안전] S9 "격리 환자 이송 감염관리" 문장 4**
  en `Everyone who handles him at CT should wear a gown and gloves.` / chunks `["Everyone", "who handles him at CT", "should wear", "a gown and gloves", "."]` / ko `CT에서 환자를 다루는 사람은 모두 가운과 장갑을 착용해야 해요.` / words는 그대로 [w-wear, w-gown, w-glove]. **연동(B 몫):** order 3번째 줄 `During the move, everyone on transport should wear a gown and gloves.`도 같은 오류다 → 예: `At CT, everyone who handles him should put on a clean gown and gloves.`
- **F2 (선택·문구) S0 "손위생·PPE 착탈" 문장 5** — CDC 손위생 지침은 C. diff·노로·눈에 보이는 오염을 빼면 알코올 젤이 비누·물보다 세균을 더 줄인다고 하므로, 주장 방향은 맞다(S11의 C. diff 예외와도 모순 아님). 다만 'soap can't reach'는 실제와 다른 작용 방식처럼 읽힌다. 바꾼다면:
  en `This gel kills most germs if you rub it in until it's dry.` / chunks `["This gel kills", "most germs", "if you rub it in", "until it's dry", "."]` / ko `마를 때까지 문질러 바르면 이 젤이 대부분의 균을 없애 줘요.` / words [w-gel, w-kill, w-germ] (w-soap·w-reach 태그는 뺌 — 두 단어는 11.1·6.3 등 다른 문장에 남음). **단어 example 교체:** w-kill·w-germ → 새 문장, w-soap → `We need soap and water, not just gel, for hand hygiene here.`(exKo는 11.1 ko), w-reach → `A loose dressing lets germs reach the line.`(exKo는 6.3 ko)
- **F3 S18 "주삿바늘 노출사고 대응" 문장 3**
  en `Keep washing it with soap and water while I call Employee Health.` / chunks `["Keep washing it", "with soap and water", "while I call", "Employee Health", "."]` / ko `제가 직원 건강관리실에 전화하는 동안 비누와 물로 계속 씻으세요.` / words [w-wash, w-soap]. (B: Employee Health는 고유명사라 blank를 두지 말 것) **연동(B):** order 1번째 줄의 `for a full minute`을 뺄 것
- **F4 [안전] S18 문장 4**
  en `I'll report the exposure so you can be seen for PEP right away.` / chunks `["I'll report", "the exposure", "so you can be seen", "for PEP", "right away", "."]` / ko `바로 PEP 진료를 받으실 수 있게 노출을 보고할게요.` / words [w-report, w-exposure, w-pep] (w-start·w-protocol은 18.2에 남음). **w-exposure example·exKo**를 새 문장으로 바꿀 것. **연동(B):** order 4번째 줄 `we'll start the PEP protocol and get you evaluated today` → 예: `With that report in, Employee Health can evaluate you for PEP right away.`
- **F5 (조건부 — K1을 바꿀 때만) S19 "면역저하 보호격리 붕괴 위기" 문장 4** — K1을 유지하면(병원 정책으로 가운을 요구) 19.4는 틀린 문장이 아니므로 고치지 않는다. K1을 바꾸면 아래처럼 고치고 order 2~4번째 줄도 함께 고친다.
  en `Let's get everyone back to strict hand hygiene and restore precautions now.` / chunks `["Let's get everyone", "back to strict hand hygiene", "and restore", "precautions now", "."]` / ko `모두 다시 철저히 손위생을 하게 하고 지금 주의조치를 복구하죠.` / words [w-strict, w-hygiene, w-restore, w-precaution]. **연동(B):** order 3·4번째 줄의 gowns·gowned(K1 결정에 따름)
- **F6 S3 "VAP 번들 수행" 문장 4**
  en `We brush his teeth and clean his mouth on a regular schedule.` / chunks `["We brush", "his teeth", "and clean his mouth", "on a regular schedule", "."]` / ko `정해진 일정에 따라 이를 닦고 입안을 깨끗이 해 드려요.` / words [w-brush, w-clean] (+ 선택: w-schedule). **연동(B):** order 3번째 줄의 `every few hours`
- **F7 [안전] S16 "공기매개 병원체 노출 위기" 문장 3**
  en `Grab the N95 you were fit-tested for before you go in — this is airborne isolation.` / chunks `["Grab the N95", "you were fit-tested for", "before you go in —", "this is airborne isolation", "."]` / ko `들어가기 전에 밀착검사 받은 N95를 챙기세요 — 여기는 공기매개 격리실이에요.` / words [w-grab, w-n95, w-fit, w-airborne, w-isolation]. **w-grab·w-airborne example**도 새 문장으로 바꾸고, w-grab ko를 '챙기다/집어 오다'로 바꿀 것. **연동(B):** order 3번째 줄 `let me grab you a fitted one`
- **F8 S12 "항생제 관련 이차감염 감시" 문장 3** — 내용은 맞고 chunks만 고침. `["He's been", "on antibiotics", "for over a week", "now", "."]` (지금은 `for over / a week`으로 구를 끊음). 청크가 바뀌므로 v46 `decoy`를 다시 볼 것
- **F9 S3 문장 3** — chunks만 고침. `["Keeping", "the head of the bed", "up", "helps prevent pneumonia", "."]` (지금은 `the head / of the bed`로 명사구를 끊음). `decoy`를 다시 볼 것
- **F10 S15 "원내감염 클러스터 대응" 문장 4**(업무범위, 낮음) — 병동 전체 선별검사는 감염관리팀이 정한다. en `Let's ask infection control about screening the other patients on the unit.` / chunks `["Let's ask infection control", "about screening", "the other patients", "on the unit", "."]` / ko `병동의 다른 환자들 선별검사를 감염관리팀에 문의하죠.` / words [w-infection, w-control, w-screening, w-unit] (w-screen은 17.2에 남음)
- **F11 S10 문장 4 ko** — `이 사람들 장비는` → `이 환자들의 장비는 병동의 나머지 장비와 분리해서 관리하죠.` (환자를 '이 사람들'이라 부르면 낮춰 들림). 그 문장의 `distractorsKo` 2개도 새 ko 틀에 맞춰 다시 쓸 것

### KP 문장의 ko만 고침 (결정 11 범위) — 고친 문장의 `distractorsKo` 2개도 새 ko에 맞춰 다시 쓸 것
- **F12 S12 문장 2** `새로운 징후는 조기에 팀에 표시해 알릴게요.` → `새로운 징후가 보이면 일찍 팀에 알릴게요.` (flag ~ to the team은 '알리다'라는 뜻. '표시해 알린다'는 어색함)
- **F13 S19 문장 1** `…생화분이나 꽃도 안 돼요.` → `…화분이나 생화도 안 돼요.` ('생화분'은 없는 말)
- **F14 S8 문장 2**(선택) `요로감염` → `도뇨관 관련 요로감염` (CAUTI의 뜻)

### 뉘앙스
- **F15 S16 slider `why`** → `공기매개격리실에는 수술용 마스크가 아니라 N95가 필요해요. 방문객에게는 병원 지침에 따라 N95를 드리고 쓰는 법을 알려 드려요. 잠깐 들어가거나 문 가까이 있어도 수술용 마스크로는 공기 중 입자를 막지 못해요.`
- **F16 S2 slider `cue`** → `Nurse: "She's awake, can walk to the bathroom, and the catheter is still in."` / `why` 둘째 문장의 "스스로 소변을 볼 수 있다면"을 "스스로 화장실에 갈 수 있다면"으로
- **F17 S15 context 3번째 장면** en → `We are managing a nosocomial outbreak involving multiple MDRO cases.` / `why`의 "nosocomial·index case 같은 말로"를 "nosocomial 같은 말로"로
- **F18 S14 context 3번째 장면**(가족에게) `Your culture is positive…` → `His culture is positive for methicillin-resistant Staphylococcus aureus colonization.` (가족에게 'Your'라고 하면 가족 본인의 검사 결과가 됨)
- **F19 S17 swap `ko`** → `치료가 어려운 이 균은 빨리 퍼질 수 있어서 특히 조심하고 있어요`
- **F20 S3 swap `ko`** `입 간호를 해요` → `구강 간호를 해요`
- **F21 S5 slider 순서** — `[use it right away, hang it back as it is, disinfect it first]`는 한 방향으로 가지 않는다. 위험 순서로 `[disinfect it first, hang it back as it is, use it right away]`, answerAt 0
- **F22 S0 slider 순서** — `[use the hand gel, wait until you leave, skip it this time]` (미루기가 건너뛰기보다 약함), answerAt 0
- **F23 S11 slider 순서**(선택) — `[wash with soap and water, use gel twice instead, gel is enough this time]`

### 단어 (v45 필드)
- **F24 decoyChips — 비속어·불쾌한 조각** (전수 329개)
  - 꼭 바꿀 것: w-help `hell` → `heap` / w-transmission `tramp` → `trap` (tramp는 사람을 낮잡는 속어)
  - 바꾸기를 권함: w-daily `die` → `day` / w-diarrhea `die` → `dye` / w-fit `fat-` → `fix-` / w-different `deaf` → `def` / w-cohort `cow` → `core` / w-precaution `cow` → `call` / w-watch `witch` → `patch`
  - 유지해도 됨: troll, flog, cull, quack, moan, stiff, bleed
- **F25 distractorsEn — 뜻이 정답과 같아 정답이 둘**: w-restore `restart` → `restock` / w-consistent `constant` → `confident` (+ 아래 표의 `consistency`)
- **F26 distractorsKo — 정답에 가까움**: w-site `피부` → `혈관` / w-dressing `붕대 감기` → `부목` / w-mean `보여 주다` → `요청하다`
- **F27 distractorsKo — 두 오답이 서로 같은 뜻이라 남은 하나가 정답으로 보임**: w-wear `벗어 두다` → `세탁하다` / w-tighten `느슨하게 하다` → `유지하다` / w-fair `편파적인` → `신속한` / w-consistent `변덕스러운` → `엄격한` / w-essential `임의적인` → `부수적인`
- **F28 cue가 ko를 되풀이함**:
  - w-check → `매 근무·매일 드레싱이나 적응증을 하나씩 살필 때 쓰는 동사`
  - w-measure → `감염관리팀이 더 하라고 권하는 구체적인 대책 하나하나`
  - w-environmental → `병실 공기·표면·물을 대상으로 하는(점검·검토 앞에 붙는)`
  - w-stool → `C. diff가 의심될 때 검사실로 보내는, 환자가 본 변`
  - w-severely → `면역 수치가 아주 크게 떨어졌을 때처럼 정도가 지나친`
  - w-low → `면역이나 수치가 기준보다 밑에 있는`
  - w-weak → `면역이 균을 막아 낼 힘이 모자란`
  - w-quickly → `내성균이 하루 만에 옆 환자에게 번질 만큼 지체 없이`
- **F29 distractorsEn 품사** — 아래 표대로 교체

### 결정 11 (기존 단어·태그)
- **D11-1 w-blame** — 문장은 `It's not about blame`, 곧 명사인데 ko가 `탓하다`(동사)다. ko → `탓·비난` / cue → `잘못을 누구 책임으로 돌리는 일, '누구 ___도 아니에요'처럼 쓰는 명사` / distractorsKo → `칭찬`, `용서` (distractorsEn `flame`·`blast`는 명사라 그대로 둠)
- **D11-2 w-sign** — 12.2 `any new signs`와 13.0 `an early sign of infection`의 sign은 '징후'인데, 카드 ko는 `표지`다. 12.2·13.0의 words에서 **w-sign을 뺄 것**(두 상황 모두 서로 다른 단어 13개 이상이 남음). sentence changes 2건을 적을 것
- **D11-3 w-line** — ko `중심라인`이 너무 좁다(9.0 `cover any lines`는 말초 라인도 포함). ko → `라인(혈관 카테터)`
- **D11-4 w-brush** — ko `닦다`가 w-wipe `닦아내다`와 겹친다. ko → `칫솔질하다`
- **D11-5 w-grab** — F7에 맞춰 ko `가져다주다` → `챙기다`
- **D11-10 w-step·w-measure** — 둘 다 ko가 `조치`로 글자까지 같고, w-precaution `주의(조치)`와도 겹친다(changes가 check/confirm 등을 가른 기준과 같은 문제). w-step → `단계`, w-measure → `대책`. 같은 기준으로 w-germ `세균`·w-bug `균(비격식)`·w-organism `균/유기체`도 봤는데, 수식어로 갈려 있어 그대로 둬도 된다
- **D11-6**(선택) 쉬운 말 태그 빼기: w-hospital(20.1), w-different(4.1), w-tell(4.1). 빼도 S4는 서로 다른 단어 11개, S20은 17개가 남는다. 어느 문장도 태그하지 않게 되면 은행에서 지울 것
- **D11-7**(선택) w-cauti 헤드워드 `CAUTIs` → `CAUTI` (chips `[[CAU, TI]]`, distractorsEn `CLABSI`·`CABG`). 문장의 `CAUTIs`는 복수형이라 허용됨
- **D11-8** changes 110건: 모두 타당함(과하거나 틀린 것 없음)
- **D11-9** w-without의 tag `형용·부사` — 전치사다. 고칠 필요는 낮음(선택)

## 품사가 다른 distractorsEn 전부 (F29)

| id | 정답(품사) | 품사가 다른 오답 | 교체안 |
|---|---|---|---|
| w-gown | gown(명) | grown(형/과거분사) | crown |
| w-leave | leave(동) | leaf(명) | heave |
| w-remove | remove(동) | remote(형/명) | revoke |
| w-enter | enter(동) | anger(명), center(주로 명) | render, (center 유지 가능) |
| w-help | help(동) | held(과거형) | heal |
| w-tie | tie(동) | toe(명) | tow |
| w-kill | kill(동) | kilo(명) | chill |
| w-vein | vein(명) | vain(형) | rein |
| w-dry | dry(형) | draw(동), dye(명/동) | drab, wry |
| w-check | check(동) | chick(명) | cheer |
| w-change | change(동) | chance(명) | chant |
| w-early | early(부) | earn(동) | yearly |
| w-lower | lower(동) | power(명), tower(명) | raise, loosen |
| w-lung | lung(명) | long(형) | rung |
| w-regular | regular(형) | regulate(동) | regal |
| w-sign | sign(명) | sing(동), sigh(동/명) | scene, (sigh 유지 가능) |
| w-mean | mean(동) | meal(명), mine(명) | moan, lean |
| w-tell | tell(동) | tall(형), till(전/명) | sell, yell |
| w-safe | safe(형) | sage(명) | same |
| w-device | device(명) | divide(동) | novice |
| w-bedside | bedside(명) | beside(전) | bedtime |
| w-move | move(동) | mood(명), mode(명) | prove, mow |
| w-notice | notice(동) | novice(명), notion(명) | nourish, notate |
| w-loose | loose(형) | loss(명), lose(동) | close, loud (lose는 decoyChips로) |
| w-key | key(형) | kit(명), keg(명) | keen, coy |
| w-break | break(명) | bleak(형) | brick |
| w-element | element(명) | elegant(형) | ailment |
| w-meet | meet(동) | meat(명) | greet |
| w-count | count(동) | court(명) | mount |
| w-document | document(동) | doctrine(명), dormant(형) | dominate, augment |
| w-log | log(동) | leg(명) | lob |
| w-review | review(명) | renew(동), revise(동) | preview, revenue |
| w-resistant | resistant(형) | resistance(명) | reluctant |
| w-organism | organism(명) | organize(동) | organist |
| w-cohort | cohort(동) | cobalt(명) | cohere |
| w-limit | limit(동) | lint(명) | lift |
| w-sample | sample(명) | simple(형) | staple |
| w-start | start(동) | stark(형) | stall |
| w-alcohol | alcohol(명) | alkaline(형) | alkali |
| w-course | course(명) | coarse(형) | source |
| w-secondary | secondary(형) | secretary(명), secondly(부) | sedentary, sanitary |
| w-yeast | yeast(명) | yearn(동) | east |
| w-watch | watch(동) | watt(명) | catch |
| w-give | give(동) | gift(명) | live |
| w-identify | identify(동) | identity(명) | intensify |
| w-without | without(전) | wither(동) | throughout |
| w-grab | grab(동) | grub(명), crab(명) | grade, brag |
| w-airborne | airborne(형) | airport(명) | airsick |
| w-strict | strict(형) | stick(동/명), strike(동/명) | strident, stark |
| w-essential | essential(형) | essence(명) | eventual |
| w-low | low(형) | law(명), lot(명) | slow, raw |
| w-weak | weak(형) | week(명), wake(동) | meek, bleak |
| w-restore | restore(동) | resource(명) | restock (restart는 F25) |
| w-escalate | escalate(동) | escalator(명) | excavate |
| w-fair | fair(형) | fare(명), fail(동) | faint, frail |
| w-consistent | consistent(형) | consistency(명) (+constant는 뜻 겹침) | confident, convenient |
| w-priority | priority(명) | prior(형) | parity |
| w-pressure | pressure(명) | pressing(형/동) | treasure |
| w-must | must(조동) | mist(명), most(형) | might, may |
| w-source | source(명) | soured(형) | course |
| w-immune | immune(형) | immerse(동) | immobile |
| w-sheet | sheet(명) | sheer(형) | sheath |
| w-cover | cover(동) | color(명) | hover |
| w-bring | bring(동) | brink(명), broom(명) | fling, wring |
| w-site | site(명) | cite(동) | suite |
| w-spore | spore(명) | spare(형/동) | spire |

## 기계적 전수 확인 결과
- **pair**(S4 하나): 왼쪽 3 × (오른쪽 3 + decoy 1)를 모두 결합해 봤다. 정답 짝 말고는 성립하는 결합이 없다(비말격리에 가운·장갑은 기본이 아니고, 접촉격리에 수술용 마스크도 아니다). decoy `bare hands only`는 어디에도 붙지 않는다. 문제 없음.
- **swap**(S3·S17, 선택지 6개): 이어 붙인 문장이 모두 문법에 맞다. `ko`는 F19·F20을 고칠 것.
- **context**(19개): `word`가 세 장면 `en`에 모두 들어 있고, `word`와 `ko`도 함께 쓰여 있다(핸드오프 모양에 맞음). 어색한 장면은 모두 '같은 뜻·듣는 사람이 다름'이다. 고칠 것은 F17·F18. 설계에 대한 참고: 19개 모두 어색한 장면이 3번째이고 대상이 '가족에게(환자에게)'다. 앱이 장면 순서를 섞지 않으면 읽지 않고도 맞힌다 — 앱 쪽에서 섞는지 확인할 것.
- **chunks**(106문장): 비KP에서 구를 끊은 것은 F3·F8·F9(F3은 문장 교체로 해결). **KP에서 구를 끊은 것(보고만):** 1.0 `safely into / a large vein`, 3.2 `while he's on / the breathing machine`, 4.2 `keeps you / , him, and other patients / safe`, 14.0 `the new / positive culture`, 14.2 `on any / additional measures`, 19.1 `Only healthy / , gowned staff`.
- **distractorsEn 품사**: 위 표.
- **decoyChips**: 329개 전부 F24로 판정함.

## keyPhrase — 사용자 결정 필요 (en은 고치지 않음)

| # | 문장(현재 en) | 문제 | 대안 en |
|---|---|---|---|
| K1 | S19-1 `Only healthy, gowned staff should enter, and no live plants or flowers.` | CDC 보호환경 지침은 감염 의심이 없으면 가운을 일률로 요구하지 않는다(병원 정책에 따라 다름). 고르면 w-gowned 단어도 빼고, order 2~4번째 줄도 함께 고칠 것 | `Only healthy staff should enter, and no live plants or flowers.` |
| K2 | S4-1 `Different colors tell us what protection each germ needs.` | 표지 색은 병원마다 다르다(한 병원 안에서는 맞는 말). 우선순위 낮음 — 유지해도 됨 | `Each sign tells us what protection the germ needs.` |
| K3 | S11-2 `Bleach-based cleaning is required to kill the spores.` | 아포를 죽이는 소독제(EPA List K)에는 표백제 말고 과산화수소·과초산 계열도 있다. '표백제가 꼭 필요하다'는 과장 — 낮음 | `A sporicidal cleaner like bleach is needed to kill the spores.` |
| K4 | S19-0 `…so we must protect him from all germs.` | '모든 균으로부터'는 지킬 수 없는 절대 표현 — 낮음, 유지해도 됨 | `…so we must protect him from germs as much as we can.` |
| (판정만) | S10-0 코호팅 · S18-1 PEP 평가 · S18-2 프로토콜 시작 | 맞음. 바꿀 필요 없음 | — |

## 종합
안전 3건(F1·F4·F7 — F1·F4는 확실, F7은 '부정확'에 가까움)과 order의 연동 줄(B 몫)을 고치고, decoyChips `hell`·`tramp`를 바꾸면 내보내도 된다. 뉘앙스 `why`는 CDC·SHEA 관행에 대체로 맞고, 고칠 것은 S16 방문객 밀착검사(F15) 하나다. K1은 order 줄과 함께 결정해야 하므로 먼저 사용자에게 물을 것.
