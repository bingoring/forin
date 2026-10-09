# er-gi-bleed — v46 보강 검토 (er)

대상: `er-gi-bleed.yaml` (상황 21 · 문장 126 · order 21장 · 뉘앙스 context 14 · swap 21). 문장 126개와 order 카드 21장(84줄)을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 상부 vs 하부 출혈 문진 … S20 = 재출혈 급변 야간 SBAR). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 504줄, decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립(약 1,300줄),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context `word`가 세 장면 `en`에 있는지와 base 대비 바뀐 장면·`fix`·`why`, swap 21건(정답을 넣은 문장과 `ko`),
빈칸 오답·decoy·`distractorsKo`의 주제 안 중복.
`verify_one_theme.py er …/er-gi-bleed.yaml` → `==> 통과`(W13 경고 3 — v45 단어 오답 `lay`·`ever`·`sometime`, 이번 범위 밖. W14 0).
아래에서 빈칸을 옮기자고 한 새 answer는 모두 `en`에 낱말 경계로 정확히 한 번 나오는지 스크립트로 확인했다. 새 decoy는 청크와 같지 않고 `en` 안에 없다. 새 order 줄은 15단어 이하이고 인접 교환 세 가지를 다시 읽었다.

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. decoy를 끼워 넣은 조립은 덧붙은 말이 `ko`에 이미 담긴 뜻일 때만 "ko에 맞는 다른 문장"으로 셌다(앞 주제 검토와 같은 기준).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식(열린 질문·비유·가능성 표현)의 이유를 짚는다. 8.4 비타민K 지연, 9.1 반응 시 먼저 중단, 3.5 출혈 직후 Hgb 지연, 11.2 난간은 병원 지침, 7.1 대량 상부 출혈도 선홍색 가능 — 모두 맞다. 고칠 것 7: 15.1(출혈성 쇼크 치료의 핵심을 "수액과 혈액으로 채우기"로 말함 — **안전**), 7.5(대장내시경은 환자가 할 일이 없다는 인상 — 장 정결이 있음), 19.5(다음 팀이 다 알아서 반복하지 않아도 된다 — 시술 전 재확인은 함), 9.2·20.4(closely가 "감시가 아니라 돌봄"이라는 근거 없는 주장, 두 번 돌려씀), 17.1(혈소판을 "세포"라 함), 5.1 오타. |
| 2 | 빈칸 | 3 | `ko`로 걸러지지 않아 **정답이 둘**인 것은 없다. 그러나 **장면과 동떨어진 오답이 약 15문장**(0.5 `favorite`, 2.1 `wear/hear`, 2.3 `drawing/making/wearing`, 3.4 `calm/happy`, 4.5 `ride/hide`, 8.4 `color/taste/price`, 9.5 `address`, 12.1 `charge/blame/scare`, 15.1 `food/ice`, 15.2 `empty/lost/closed`, 18.1 `ice/stitches/bandages`, 19.4 `sunny/cozy/tiny` 등), **문법·시제로 걸러지는 것이 약 12문장**(3.1 `very/so … than`, 6.1 `tomorrow/soon/later`, 10.1 `tomorrow`, 10.5 `never/hardly/seldom`, 14.1 `tomorrow/daily/rarely`, 16.4 `stop/force/teach you breathe`, 18.5 `leaving/staying/hiding into`, 7.5 `when/who … is coming from` 등)이다. 감각 동사 묶음이 두 문장(1.0·11.0)에 남았다. 돌려쓴 묶음: `hide/hides/hiding` 11문장, `rarely/barely/hardly/never` 묶음 7문장(브리프가 이름을 든 `almost↔barely/never` 그 묶음). |
| 3 | `decoy` | 4 | 대신 넣어 `ko`에 맞는 다른 문장이 되는 것은 1개(4.5 `for you`), 끼워 넣어 맞는 것 1개(3.0 `in a row` — ko "며칠째"). 경계 3개(10.1 `in a row`, 15.5 `right now`, 14.2 `for you`). 다만 `at home` 11·`at night` 9·`right now` 6처럼 아무 문장 끝에나 붙는 시간·장소 부사가 절반이라, "같은 자리에 올 수 있는 구"로서는 약하다(선택). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이고 뒤집기는 거의 없다. 고칠 것 8: 잘못된 관행을 본보기로 보이는 말 3(11.2 낙상 고위험 환자에게 "침대 알람을 꺼 둘게요", 18.0·18.4 활력이 떨어지는데 "마취를 더"), 할 리 없는 말 2(2.5 "두 배로 드셔야 해요", 3.5 "엑스레이로 빈혈"), 반만 다른 말 2(12.4 둘 다, 17.1), 중복 1(5.2·8.2 "수액부터 놓을게요"). |
| 5 | `order` | 3 | `If so`류 조건절로 시작하는 줄은 0개이고, 임상 순서가 크게 틀린 카드는 없다. 그러나 **인접 교환이 열린 카드가 3장**(S12 3↔4, S13 2↔3, S18 3↔4), 약하게 열린 카드 2장(S0 2↔3, S16 2↔3 — `On top of that`은 `Also`류), **앞 줄 질문의 답을 '예'로 전제한 줄이 3장**(S3 L3 `Besides the tiredness`, S11 L2 `That's why`, S14 L3 `Because of that`), 억지 연결어 2장(S10 L4 `With all of that in mind`, S20 L2 `Help me report it:`), 임상 근거가 어긋난 카드 2장(S8 L3 "그 용량" 때문에 비타민K — 역전 여부는 INR·출혈로 정함, S7 대량 혈변에서 감시가 대장내시경 뒤 덧붙임), 앞 줄 되풀이 1장(S12 L2). |
| 6 | `tag`·`icon` | 4 | 태그는 한국어 10자 이하이고 상황 안에서 일관된다. order 21장 모두 `대화 흐름`·`compass`. 고칠 것: 19.1 색전술에 `scalpel` — 바로 그 문장의 why가 "수술이 아니라"고 말한다. 사소: 12.1 대체 치료에 `bandage`. |
| 7 | context `word`·`ko`, swap `ko` | 4 | `word`가 세 장면 모두에 있다(W14 0). 어색한 장면은 모두 환자에게 차트·의료진 말투를 쓴 곳이다. 고칠 것: S14 XX `DES stent`(낱말을 끼워 넣으려고 만든 중복어), S13 두 장면이 `endoscopic`만 있어 `endoscopy`가 실제로는 한 장면뿐, S4 why가 지금 장면에 없는 `NS`를 설명하고 `fluid` 자체를 의료진 말처럼 읽히게 함, S7 `ko` "차례"가 episodes의 뜻이 아님. swap `ko` 21건은 모두 정답을 넣은 문장의 뜻이다(S2 "혈액 희석제"는 직역투 — 사소). |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진 빈칸 오답 약 15문장 + 문법으로 걸러지는 오답 약 12문장, `hide`·`rarely/barely` 묶음 돌려쓰기 — 앞 주제와 같은 갈래가 되풀이됐다. (3) order: `And/Also/Then`은 없지만 `On top of that`·`With all of that in mind`·`Help me report it:`가 새 억지 연결어로 나왔고, 답을 전제하는 `That's why`·`Because of that`이 3장. (4) 임상 사실: 15.1 why, S8 L3, 오답 뜻의 "알람 끄기"·"마취 더". (5) decoy·오답 뜻 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **15.1 why — 출혈성 쇼크 치료의 핵심을 "잃은 부피를 수액과 혈액으로 빨리 채우는 것"으로 말함.** ATLS 10판과 대량 출혈 지침은 정질액을 1 L 안쪽으로 줄이고 **혈액을 일찍** 주며(손상 통제 소생술), 무엇보다 **출혈 부위를 막는 것**(GI 출혈이면 내시경·색전술)을 핵심으로 본다. 지금 문구는 "수액을 많이 넣으면 된다"로 읽힌다. → W1.
2. **11.2 distractorsKo `침대 알람을 꺼 둘게요`** — 실신 뒤 낙상 고위험 환자에게 알람을 끄는 것은 하면 안 되는 일이다. 오답이라도 "같은 상황에서 할 법한 말"로 보이게 해서 잘못된 처치를 본보기로 보인다(파일럿 갈래 5와 bleeding-wound 17.5와 같은 유형). → K1.
3. **18.0·18.4 distractorsKo `마취를 조금 더 할게요` / `마취를 더 하려고`** — 활력징후가 무너지는 시술 중에 진정을 깊게 하는 것은 반대 방향의 처치다. 같은 이유로 바꾼다. → K2·K3.
4. **S8 order L3 `With that dose and your bleeding, we'll give vitamin K`** — 와파린 역전 여부와 방법은 **복용 용량이 아니라 INR과 출혈의 심한 정도**로 정한다(심한 출혈이면 IV 비타민K + 4F-PCC, ACC 2020·CHEST). L2 `At that time, how much warfarin …`(마지막 INR 검사 때의 용량)도 임상 문진으로 어색하다. why "그 용량과 출혈을 근거로 치료를"도 같다. → O5.
5. **인접 교환이 열린 order 3장** — S12 3↔4(기록 → 약속도 자연스러움), S13 2↔3(`Since then`이 L1 내시경을 가리켜도 읽힘), S18 3↔4(`they`가 L2의 extra help를 가리켜 L3 없이도 읽힘). 학습자가 맞히고도 틀린다. → O7·O8·O9.
6. **답을 '예'로 전제한 order 줄 3장(자기 점검 10번 갈래)** — S3 L3 `Besides the tiredness`(L2에 "아니요"라고 하면 성립 안 함), S11 L2 `That's why we're keeping the bed low`(실신한 환자의 낙상 예방은 L1 답과 관계없이 모든 경우에 함), S14 L3 `Because of that`(스텐트 여부와 관계없이 항혈소판제 조기 중단은 위험). → O2·O6·O10.

## 저작자 자기 보고 4건 판정

### 1. 증상어 빈칸(`dizzy`/`weak` 등)의 문법으로 걸러지거나 엉뚱한 오답(`stitches`, `ice` 등)

**판정: 고쳐지지 않았다. 고칠 것으로 올린다.**
- 1.0 `feel` ↔ `taste/look/sound`, 11.0 `feel` ↔ `sound/taste/smell` — 연어(feel dizzy)로 걸러지는 감각 동사 묶음이 그대로다(아래 2번). 빈칸을 `get/become`으로 바꾸면 정답이 둘이 되니, **증상어 자체로 옮기고 `ko`가 가르게** 한다: 1.0 → `lightheaded`(ko "머리가 띵"), 11.0 → `dizzy`(ko "어지럽거나"). → B2·B21.
- 3.4 `weak` ↔ `strong/calm/happy` — 증상 빈칸이지만 `calm/happy`는 장면 밖 말이다. 같은 분야 증상으로 → B9.
- 3.1 `more` ↔ `very/so` — `very tired … than usual`은 비문이라 문법으로 걸러진다. 빈칸을 `tired`로 옮긴다 → B8.
- `ice`·`stitches`는 15.1(`pills/food/ice`), 18.1(`ice/stitches/bandages`)에 남았다. 소생 장면에서 상처 처치·음식은 같은 분야가 아니다. → B30·B33.

### 2. 감각 동사 묶음(`look/sound/taste/smell`)이 두 문장에 남은 것

**판정: 맞다. 정확히 1.0과 11.0 두 문장이다.** 위 1번처럼 빈칸을 증상어로 옮긴다. (다른 문장에는 이 묶음이 없다 — 504줄 전수 확인.)

### 3. context 정비 (ibuprofen, tired, fluid, pressure, burning, episodes, reaction, stent, vessel)

**판정: 방식은 받아들인다. 고칠 것은 4개(S14 장면, S13 장면, S4 why, S7 ko)다.**
- 받아들임 — 묶음 검토 A·B·C와 같은 모양(세 장면이 함께 쓰는 쉬운 말을 `word`로, 전문어는 어색한 장면에만):
  - **S2 `ibuprofen`** — XX `Ibuprofen use — dose and frequency?`는 차트 칸을 환자에게 그대로 읽는 장면이다. review-ctx-A #7(`Cultural practices or religious preferences — any?`)이 제안한 모양과 같아, "듣는 사람에게 맞지 않는" 어색함이 분명하다. 새 why도 장면에 맞다. 다만 base의 교훈(NSAID라는 약 분류를 환자가 모름)은 why 둘째 문장에만 남았다 — 그대로 둬도 된다.
  - **S3 `tired`** — 어색한 장면 "You're tired because of symptomatic anemia — your Hgb is 7.2."의 어색함은 `tired`가 아니라 `symptomatic anemia`·`Hgb`를 환자에게 쓴 데 있다. TASK 9 예시(`drowsy` — XX "Pt is drowsy, GCS 14, monitoring for resp depression")와 같은 모양이고, 영어도 바르다. ✓ 장면 둘(`She's more tired than usual — …`, `pt reports feeling tired`)도 자연스럽다(차트는 보통 `fatigue`를 쓰지만 환자 말을 옮긴 `reports feeling tired`는 흔하다). why도 지금 장면의 말(symptomatic anemia·Hgb)을 설명한다. **받아들인다.**
  - **S5 `pressure`**, **S6 `burning`**, **S9 `reaction`**(`Transfusion reactions like TRALI and TACO` — 미국 혈액감시(NHSN)도 TACO를 수혈 반응으로 분류), **S19 `vessel`** — 모두 자연스럽고 why가 장면과 맞다.
  - 그대로 둔 S0 `coffee grounds`(세 장면 모두 `coffee-ground` 형태 — W14가 받고, 어색함이 `emesis`에 있어 기준과 맞음, 경계로만 적음), S11 `fall`, S15 `activate`, S16 `airway`도 좋다.
- 고칠 것:
  - **S14 `stent`** — XX `You're on DAPT for your DES stent, right?`의 `DES stent`는 DES(약물방출 **스텐트**)에 stent를 겹친 말이다. W14를 맞추려 끼워 넣은 낱말(TASK 9 경고)이다. → C1.
  - **S13 `endoscopy`** — 차트·XX 두 장면에는 `endoscopic`만 있다. 검사기가 어간으로 받았지만 화면 제목 "`endoscopy`가 어색한 장면은?"과 맞지 않는다. → C2.
  - **S4 `fluid`** — why "fluid bolus·NS는 의료진끼리의 말"은 지금 XX에 없는 `NS`를 설명하고, ✓ 장면 둘이 쓰는 `fluid`까지 의료진 말로 읽히게 한다. → C3.
  - **S7 `episodes`** — `ko: 차례`는 episodes의 뜻이 아니다("차례"는 순서·순번). → C4.

### 4. `why` 임상 사실 (비타민K 효과 지연 등)

**판정: 비타민K는 맞다. 다른 곳에 고칠 것이 있다.**
- 8.4 "비타민K는 효과가 나타나기까지 몇 시간이 걸려서 출혈이 심하면 다른 약과 함께 쓸 수 있어요" — 맞다(IV 비타민K는 INR이 내려가기 시작하는 데 수 시간, 완전한 효과까지 12~24시간; 심한 출혈이면 4F-PCC와 함께). 그대로 둔다.
- 함께 확인해 맞는 것: 2.1 NSAID의 위 점막 손상, 5.0 간경변 → 식도 정맥류, 5.4 문맥압, 6.0 위산과 섞여 커피 찌꺼기, 7.1 대량 상부 출혈도 선홍색 가능, 10.0 Mallory-Weiss, 12.3 받아들이는 혈액 성분이 사람마다 다름, 14.4 스텐트 혈전, 16.5 풍선 압박은 일시 지혈.
- 고칠 것: 15.1(심각 1), 7.5, 19.5, 9.2·20.4, 17.1, 5.1 — 아래 W1~W7.

## 고칠 것

### why (7)
- **W1 · 15.1 why** · 출혈성 쇼크 치료의 핵심을 "수액과 혈액으로 채우기"로 말함(심각 1) · → "right away로 기다리는 시간이 없다고 알려요. 출혈성 쇼크에서는 수액은 적게, 혈액은 일찍 주면서 출혈 부위를 막는 것이 치료의 핵심이에요."
- **W2 · 7.5 why** · "환자가 할 일이 없다는 인상을 줘요"는 틀린 인상이다(대장내시경은 환자가 장 정결을 해야 함) · → "help the doctor find로 검사가 무엇을 위한 것인지 의사의 목적으로 말해요. where the bleeding is coming from은 이 검사가 찾는 대상을 구체적으로 알려 줘요."
- **W3 · 19.5 why** · "같은 이야기를 반복하지 않아도 된다고 안심시켜요" — 시술실에서는 이름·생년월일·알레르기를 다시 확인하고 타임아웃을 한다. 환자가 다시 묻는 것을 오류로 여기게 만든다 · → "will know로 정보가 끊기지 않고 넘어간다고 알려 안심시켜요. 인계는 병력과 현재 상태를 함께 전하는 것이고, 시술 전에는 그 팀이 이름과 알레르기를 한 번 더 확인해요."
- **W4 · 9.2 why** · "closely로 지켜본다고 하면 감시가 아니라 돌봄으로 들려요"는 근거 없는 주장이다(closely는 빈도·가까움을 말함) · → "closely로 더 가까이, 더 자주 본다고 알려요. 심한 수혈 반응은 대개 시작 후 처음 15분 안에 나타나서 그때 곁에 머물며 자주 살펴요."
- **W5 · 20.4 why** · 같은 주장("closely는 감시보다 돌봄으로 들리는 말")을 되풀이 · → "tonight으로 지켜보는 기간을 밤으로 짚어 밤새 지켜본다고 알려요. 재출혈 뒤에는 맥박·혈압 변화가 먼저 오는 경우가 많아 자주 재요."
- **W6 · 17.1 why** · "혈소판은 피를 엉기게 하는 세포" — 혈소판은 세포가 아니라 세포 조각이다 · → "혈소판은 피를 엉기게 하는 혈액 성분이고 혈장에는 응고인자가 들어 있어요."
- **W7 · 5.1 why** · `한 번에 묻어요` 오타 · → `한 번에 물어요`.

### 빈칸 (34) — 정답이 둘인 것은 없음. 동떨어진 오답·문법으로 걸러지는 오답 바꾸기
- **B1 · 0.3** · `held/kept/carried up`은 장면 밖 구동사 · → `brought / coughed / held / kept` (`coughed up`은 객혈 — 같은 분야, ko "게워내신"이 가름).
- **B2 · 1.0** · 감각 동사 묶음 `taste/look/sound`(자기 보고 1·2) · → 빈칸을 `lightheaded`로 옮기고 `lightheaded / nauseous / sleepy / numb`.
- **B3 · 1.3** · `never/barely/hardly fall` — 묶음 돌려쓰기, `hardly fall`은 비문 · → 빈칸을 `fall`로 옮기고 `fall / faint / vomit / choke` (ko "넘어지실"이 가름).
- **B4 · 1.4** · `stored/tested` 동떨어짐 · → `lost / gained / given / received` (헌혈·수혈 — 같은 분야).
- **B5 · 2.1** · `wear/hear/drop pain relievers` 동떨어짐(`use/need`는 정답이 둘이 되니 피함) · → 빈칸을 `ibuprofen`으로 옮기고 `ibuprofen / insulin / warfarin / omeprazole` (ko "이부프로펜"이 가름).
- **B6 · 2.2** · `suddenly`, `recently`(현재형과 시제 불일치) · → `regularly / rarely / occasionally / anymore`.
- **B7 · 2.3** · `drawing/making/wearing` 동떨어짐 · → `taking / skipping / stopping / changing`.
- **B8 · 3.1** · `very/so tired … than usual`은 비문 · → 빈칸을 `tired`로 옮기고 `tired / thirsty / bloated / itchy`.
- **B9 · 3.4** · `calm/happy` 장면 밖, `strong`은 뒤집기 · → `weak / numb / itchy / sore`.
- **B10 · 3.5** · `fractures/sprains`는 혈액 검사로 찾는 것이 아님 · → `anemia / diabetes / pneumonia / kidney disease`.
- **B11 · 4.0** · `rarely`는 `in case you need … rarely`로 뜻이 안 됨 · → `quickly / slowly / gently / later`.
- **B12 · 4.1** · `bruise`(feel a bruise 비문), `burn`(IV 따끔함을 burn이라고도 함 — 경계) · → `pinch / cramp / tingle / chill`.
- **B13 · 4.5** · `ride/hide` 동떨어짐, `leave right here` 비문(`wait`는 정답이 둘) · → 빈칸을 `whole`로 옮기고 `whole / first / next / last`.
- **B14 · 5.2** · `hide/double/cause the bleeding` 장면 밖 · → `reduce / measure / monitor / increase`.
- **B15 · 6.0** · `hides/removes/prevents` (hide 묶음) · → `suggests / excludes / causes / treats`.
- **B16 · 6.1** · `tomorrow/soon/later`는 현재완료와 시제가 맞지 않아 걸러짐 · → 빈칸을 `heartburn`으로 옮기고 `heartburn / diarrhea / constipation / hiccups`.
- **B17 · 6.5** · `hide/spill the acid` · → `lower / raise / release / measure`.
- **B18 · 7.5** · `when/how/who … is coming from` — `where`만 문법에 맞음 · → 빈칸을 `colonoscopy`로 옮기고 `colonoscopy / endoscopy / transfusion / ultrasound` (관사 `The`와 모두 맞음, ko "대장내시경"이 가름).
- **B19 · 8.0** · `next/just`는 `When did you … have` 문법으로 걸러짐 · → 빈칸을 `INR`로 옮기고 `INR / A1c / cholesterol / potassium`.
- **B20 · 8.1** · `spill/refuse` 동떨어짐 · → 빈칸을 `day`로 옮기고 `day / week / month / hour` (와파린은 주간 용량도 실제로 쓰지만 ko "하루에"가 가름).
- **B21 · 11.0** · 감각 동사 묶음 `sound/taste/smell`(자기 보고 1·2) · → 빈칸을 `dizzy`로 옮기고 `dizzy / sleepy / hungry / itchy`.
- **B22 · 8.4** · `color/taste/price` 동떨어짐 · → 빈칸을 `vitamin K`로 옮기고 `vitamin K / vitamin D / iron / potassium` (낱장 오답 뜻 "비타민 C·철분제"와도 결이 맞음).
- **B23 · 9.3** · `rarely/barely/hardly very safe` — 묶음 돌려쓰기, 비문 · → 빈칸을 `safe`로 옮기고 `safe / painful / quick / simple`.
- **B24 · 9.5** · `address` 동떨어짐 · → `temperature / weight / height / blood sugar`.
- **B25 · 10.1** · `tomorrow`는 과거완료와 맞지 않음 · → `beforehand / afterwards / later / overnight`.
- **B26 · 10.5** · `never/hardly/seldom drink`는 `How much … do you never drink`로 비문 · → 빈칸을 `week`로 옮기고 `week / day / month / year`.
- **B27 · 11.5** · `Nobody/Nothing/Nowhere` — 뒤집기·비문 · → 빈칸을 `help`로 옮기고 `help / watch / let / make`.
- **B28 · 12.0** · `barely/rarely/loudly` — 묶음 돌려쓰기·장면 밖 · → 빈칸을 `respect`로 옮기고 `respect / question / doubt / ignore`.
- **B29 · 12.1** · `charge/blame/scare` 장면 밖 · → `support / transfuse / sedate / discharge` (`transfuse`는 이 장면에서 틀린 같은 분야 말).
- **B30 · 15.1** · `food/ice` 장면 밖(자기 보고 1) · → `fluids / pills / insulin / steroids` (`oxygen`은 장면상 맞아 정답이 둘이 되니 피함).
- **B31 · 15.2** · `empty/lost/closed` 장면 밖 · → 빈칸을 `team`으로 옮기고 `team / family / pharmacy / lab`.
- **B32 · 16.4** · `stop/force/teach you breathe`는 셋 다 비문(원형부정사는 help만) · → 빈칸을 `mouth`로 옮기고 `mouth / nose / stomach / lungs`.
- **B33 · 18.1** · `ice/stitches/bandages` 장면 밖(자기 보고 1) · → `fluids / sedation / insulin / antibiotics`.
- **B34 · 18.5** · `leaving/staying/hiding into`는 셋 다 비문 · → 빈칸을 `into`로 옮기고 `into / out of / past / around`.
- 선택(더 바꾸면 좋은 것): 14.1 `tomorrow/daily/rarely`(시제·비문) → 빈칸을 `stent`로 `stent / pacemaker / biopsy / transfusion`; 17.3 `never/ever/hardly`(묶음) → 빈칸을 `same`로 `same / other / new / first`; 19.4 `sunny/cozy/tiny` → `different / private / waiting / recovery`; 20.4 `rarely/barely/vaguely`(묶음) → 빈칸을 `vitals`로 `vitals / weight / diet / sleep`; 16.1 `loud/broken/empty` → `ready / off / full / clamped`; 16.2 `hide/create/cause` → `control / drain / measure / monitor`; 16.3 `keeping/holding/drinking up` → `drinking`을 `coughing`으로; 0.5 `favorite` → 빈칸을 `describe`로 `describe / remember / measure / photograph`; 17.4 법조동사 `might/could/would`(`the way it would`는 뜻이 거의 같아 경계) → 빈칸을 `clotting`으로 `clotting / flowing / thinning / draining`; 18.2 `Leave/Hide/Run` → `Stay / Breathe / Leave / Come`; 11.1 `text/email/wave` → 빈칸을 `before`로 `before / after / while / without`.
- (돌려쓰기 참고: `hide/hides/hiding`은 4.5 5.2 6.0 6.5 7.4 9.0 12.2 13.5 14.2 16.0 16.2 18.2 18.5 19.3 19.5에 퍼져 있다. 위를 반영한 뒤에도 남는 7.4 9.0 12.2 13.5 14.2 16.0 19.3 19.5 중 서너 개는 같은 분야 오답으로 바꾸면 좋다 — 선택.)

### decoy (2)
- **D1 · 3.0** · `in a row`를 끼우면 `How many days in a row have your stools looked black?`이 ko "며칠째"에 그대로 맞음 · → `this week` ("이번 주"는 ko에 없어 가름).
- **D2 · 4.5** · `for you`를 `with you` 자리에 넣은 `I'll stay right here for you the whole time.`이 ko "제가 처음부터 끝까지 바로 여기 있을게요"에 그대로 맞음(ko에 with you도 for you도 없음) · → `for a minute` (`the whole time` 자리, ko "처음부터 끝까지"가 가름).
- (경계, 고치지 않아도 됨: 10.1 `in a row`, 15.5 `right now` — `on the way right now`는 ko "오고 있어요"의 진행 뜻과 겹친다, 14.2 `for you`.)

### distractorsKo (8)
- **K1 · 11.2** `침대 알람을 꺼 둘게요` — 낙상 고위험 환자에게 하면 안 되는 일(심각 2) · → `미끄럼 방지 양말을 신겨 드릴게요`.
- **K2 · 18.0** `활력징후를 보면서 마취를 조금 더 할게요` — 활력이 떨어지는데 진정을 깊게 함(심각 3) · → `산소를 조금 올려 드릴게요`.
- **K3 · 18.4** `마취를 더 하려고 잠깐 기다려 주세요` — 같은 이유 · → `시술이 거의 다 끝났어요`.
- **K4 · 2.5** `이 약들을 두 배로 드셔야 해요` — 출혈 환자에게 아무도 하지 않을 말 · → `드시는 약 목록을 보여 주시겠어요?`
- **K5 · 3.5** `엑스레이로 빈혈을 확인할게요` — 할 리 없는 말이고 "빈혈을 확인"이 정답과 반만 다름 · → `변 검사로 피가 섞였는지 볼게요`.
- **K6 · 12.4** `혈액 제품 없이 가능한 치료를 의사 선생님과 정할게요` / `혈액 제품 대신 어떤 약이 있는지 설명할게요` — 둘 다 정답("혈액 제품을 쓰지 않고 가능한 모든 것")과 반만 다름 · → `받으실 수 있는 혈액 성분이 있는지 하나씩 여쭤볼게요` / `원하시면 병원 연락 위원회 분께 연락드릴게요` (여호와의증인 병원연락위원회 — 실제로 하는 말).
- **K7 · 17.1** `혈소판과 혈장 둘 다 검사실에 확인할게요` — "혈소판과 혈장"이 정답과 겹쳐 반만 다름 · → `피가 나는 곳을 계속 눌러 드릴게요`.
- **K8 · 8.2** `수액부터 놓을게요` — 5.2와 글자까지 같은 오답 · → `INR 결과가 나오면 다시 말씀드릴게요`.
- (선택) 3.4 `힘이 없을 때 숨이 차나요?`·`기운이 없을 때 어지러운가요?`는 둘 다 정답의 "힘이 없"을 되풀이한다(경계) → 하나를 `변 색이 언제부터 검었나요?`로. 6.5 `이 약이 통증을 바로 없애 줘요`는 과장된 약속이라 간호사가 할 말이 아니다 → `이 약은 정맥으로 들어가요`. 6.5 `이 약이 구토를 막아 줘요`는 5.4 오답과 거의 같다. 11.4 `넘어진 곳을 사진으로 남길게요`는 할 법하지 않다 → `머리를 부딪히셨는지 확인할게요`. 9.4 `불편하면 수혈 속도를 늦출 수 있어요`는 반응 의심 때 늦추는 것이 아니라 멈춘다는 9.1 why와 엇갈린다 → `수혈은 두세 시간쯤 걸려요`.

### order (12장) — 새 줄은 모두 15단어 이하로 다시 셌다
- **O1 · S0 2↔3 (약하게 열림)** · `Same question for your stools`가 L1(피를 토했나) 뒤에 와도 읽혀 L2와 자리를 바꿔도 된다 · → L3 `Now that same color question for your stools: black and tarry, or bright red?` (L2의 "color"를 가리킴, 14단어).
- **O2 · S3 L3** · `Besides the tiredness`는 L2에 "예"라고 답했다는 전제(앞 줄 말 되풀이도 겸함) · → L3 `Along with any of that, have you had belly pain?` (L2의 증상 묶음을 가리킴, 답과 무관).
- **O3 · S5 L4** · `Both of those help stop the bleeding, so we'll watch you closely`의 `so`가 인과로 이어지지 않음 · → `Both of those help stop the bleeding, and we'll watch you closely meanwhile.` (선택에 가까움).
- **O4 · S7 L3·L4** · 대량 혈변 장면인데 혈액 수치·활력 감시가 대장내시경 뒤의 덧붙임(`Along with that test`)으로 온다. 실제로는 감시·소생이 먼저고 대장내시경은 안정·장 정결 뒤다 · → L3 `Based on your answers, we'll check your blood count and watch your vital signs.` / L4 `Once you're stable, a colonoscopy can find the source of that bleeding.` (임상 순서 그대로라 시간 묶음이 오류가 아님; why도 "감시를 먼저 하고, 안정된 뒤 검사를 알려요"로).
- **O5 · S8 L2·L3** · 역전 근거를 "그 용량"으로 말함(심각 4) · → L2 `What was the result of that check?` / L3 `Since you're bleeding with that INR, we'll give vitamin K to reverse it.` / L4 그대로 / why "마지막 INR과 그 결과를 묻고, 출혈과 INR을 근거로 역전 치료를 알린 뒤 효과 확인을 알려요."
- **O6 · S11 L1·L2** · `That's why`가 L1 질문의 답을 "예"로 전제(낙상 예방은 이미 쓰러진 환자 모두에게 함) · → L1 `Because you fainted, you may feel dizzy when you sit up.` (L2 `That's why …`는 그대로 L1을 가리킴).
- **O7 · S12 3↔4 + L2 되풀이** · L4 `We'll document all of that`을 L3 앞에 둬도 자연스럽다. L2 `To understand them fully`는 L1의 `understand … fully`를 그대로 되풀이 · → L2 `Can you tell me more about the beliefs behind that decision?` (L1의 "decision"을 가리킴, 11단어), L4 `We'll document that promise clearly so the whole team keeps it.` (L3의 약속을 가리킴). why의 가리키는 말 목록도 `that decision`·`those wishes`·`that promise`로.
- **O8 · S13 2↔3** · `Since then`이 L1의 내시경을 가리켜도 읽혀 L2와 자리를 바꿔도 된다 · → L3 `Since that treatment, has bleeding like this come back?` (L2의 "treated"를 가리킴).
- **O9 · S18 3↔4** · L4 `as they come in`의 `they`가 L2의 extra help를 가리켜 L3 없이도 읽힘 · → L3 `That help is a rapid response team, coming in right now.` / L4 `Keep your eyes on me while that team works, and tell me how you feel.` (L4가 L3에만 있는 "team"을 가리킴, 13단어). why의 가리키는 말 목록도 `that`·`That help`·`that team`으로.
- **O10 · S14 L3** · `Because of that`이 L2(스텐트 시술) "예"를 전제 · → L3 `Either way, stopping them too soon could increase your clot risk.` (항혈소판제 조기 중단은 스텐트가 없어도 위험, L1이 wh-질문이라 L1 뒤로는 붙지 않음).
- **O11 · S10 L4** · `With all of that in mind, have you been drinking alcohol recently?`는 억지 연결어이고, 음주력은 앞 답과 관계없이 묻는다 · → L1 `Have you been drinking alcohol recently?` / L2 `After that drinking, how many times did you vomit?` / L3 `Was there any blood the first few of those times?` / L4 `Does that mean the blood came only after all that vomiting?` / why "음주부터 묻고, 그 뒤의 구토 횟수, 처음 몇 번의 피 여부를 묻고, 피가 구토 끝에 나왔는지 확인해요."
- **O12 · S16 L3 (+ 2↔3 약하게 열림)** · `On top of that`은 `Also`류라 어느 줄 뒤에도 붙는다 · → L3 `With your airway clear, we may need a special tube to control the bleeding.` (L2의 "clear"를 가리킴; 실제로도 풍선 튜브는 기도를 확보한 뒤 넣음).
- (선택) **S20 L2** `Help me report it:`은 환자에게 하는 말로 어색 · → `While I call, tell me: how does the bleeding compare to earlier tonight?` (호출을 미루지 않음). **S1 L3 ko** `그래서 어지럽거나`는 "if that makes you"의 뜻이 아님 → `그렇게 해서 어지럽거나 머리가 띵하면 바로 말씀해 주세요`.

### context·swap (4)
- **C1 · S14 `stent` 장면 2(XX)** · `DES stent`는 W14를 맞추려 끼운 중복어 · → en `You're on DAPT for the stent, right?` (DAPT가 어색함을 맡음; fix·why 그대로).
- **C2 · S13 `endoscopy` 장면 1·2** · 두 장면에 `endoscopic`만 있음 · → 장면 1 `Hx PUD with bleed, clipped on endoscopy (2019).` / 장면 2(XX) `So you're s/p endoscopy with clipping in 2019?` (s/p가 어색함을 맡음; fix·why 그대로).
- **C3 · S4 `fluid` why** · 지금 장면에 없는 `NS`를 설명하고 `fluid`를 의료진 말처럼 읽히게 함 · → "hanging(수액을 걸다)·bolus는 의료진끼리의 말이에요. 환자에게는 수액을 넣는다는 것과 그 이유를 쉬운 말로 알려요."
- **C4 · S7 `episodes` ko** · `차례`는 뜻이 아님 · → `ko: (증상이 나타난) 번`.
- (사소) S2 swap ko `어떤 혈액 희석제를 드세요?` → `피를 묽게 하는 약은 어떤 걸 드세요?`.

### tag·icon (1)
- **I1 · 19.1 icon** `scalpel` — 같은 문장 why가 "수술이 아니라 가는 관으로 하는 시술"이라 한다 · → `gear`(또는 `hospital`). (사소: 12.1 대체 치료 `bandage` → `bulb`.)

## 결정 11 — base 문장·단어 (v46에서는 고치지 않음, 따로 보고)
- **G1 · 15.5 ko** `혈액이 오고 있어요` — en `More blood is on the way`의 More가 빠졌다. 빈칸 정답이 `More`인데 ko가 가르지 못한다(→ `혈액이 더 오고 있어요`).
- **G2 · 4.4 ko** `단 몇 초만 갑니다` ↔ en `only a second` — 경미한 어긋남, 말투도 합쇼체로 다른 문장과 다름(→ `바늘 따끔함은 잠깐이면 지나가요`).
- **G3 · 17.1 ko·S17 swap ko** `처방할게요` — 간호사 말인데 "처방"은 간호사가 하지 않는 일로 읽힌다(en `We're ordering` = 팀이 요청). → `요청할게요` / `준비할게요`.
- **G4 · 19.4 ko** `다른 병실로` — 가는 곳은 시술실(IR suite)이다(→ `다른 방으로`, order L3 ko처럼).
- W13 3건(`lay`·`ever`·`sometime`)은 v45 단어 오답이라 이번 범위 밖.

## 종합
고칠 것 **68건**(why 7 · 빈칸 34 · decoy 2 · distractorsKo 8 · order 12 · context 4 · icon 1; 선택·결정 11은 따로).
정답이 둘인 빈칸은 없고 context 정비도 대체로 좋다. 다만 앞 주제에서 되풀이된 세 갈래(장면과 동떨어진·문법으로 걸러지는 빈칸 오답, 감각 동사·`barely` 묶음, 답을 전제하거나 억지로 묶은 order)가 그대로 남았다. 15.1 why와 위험한 오답 뜻 3개(알람 끄기·마취 더)는 꼭 고쳐야 한다. 위를 반영하면 내보내도 된다.
