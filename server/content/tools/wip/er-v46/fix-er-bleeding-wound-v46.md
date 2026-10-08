# er-bleeding-wound — v46 보강 검토 (er)

대상: `er-bleeding-wound.yaml` (상황 21 · 문장 126 · order 21장 · 뉘앙스 context 14 · swap 20). 문장 126개와 order 카드 21장(84줄)을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 출혈 초기 사정 … S20 = 출혈 SBAR 인계). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것: 빈칸 `before+선택지+after` 504줄, decoy를 청크 자리마다 **대신 넣은** 조립과 청크 사이에 **끼워 넣은** 조립(약 1,300줄),
order 인접 교환 63가지(21장 × 3)와 줄 단어 수, context `word`가 세 장면 `en`에 있는지와 base 대비 바뀐 장면·`fix`·`why`, swap 20건(정답을 넣은 문장과 `ko`),
decoy·빈칸 오답·`distractorsKo`의 주제 안 중복, base와 v44 필드 비교(**단어 232개·문장 126개 모두 바뀐 것 없음**).
`verify_one_theme.py er …/er-bleeding-wound.yaml` → `==> 통과`(W13 경고 1, W14 0).
아래에서 빈칸을 옮기자고 한 새 answer(`depth`·`bad`)는 `en`에 낱말 경계로 정확히 한 번 나온다. 새 decoy는 청크와 같지 않고 `en` 안에 없다. 새 order 줄은 단어 수(15 이하)와 인접 교환 세 가지를 다시 읽었다.

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고, 말하는 방식(어순·완곡·목적절)의 이유를 짚는다. 고칠 것 8: 15.4는 지혈대를 "압박이 실패한 뒤"의 도구로만 말한다(**안전**). 16.2는 출혈 치료를 "약과 수액으로 안 되면 수술"이라고 말한다. 1.1·10.2는 거상의 효과를 단정한다. 그 밖에 7.1 과장, 3.4 조사, 11.4 중복, 8.4 근거가 약함. |
| 2 | 빈칸 | 3 | `ko`로 걸러지지 않아 **정답이 둘**인 것은 없다(경계선: 10.3 `dripping`). 그러나 **장면과 동떨어진 오답이 약 20문장**이다(`sell/sold/selling` 5문장, `loud/wide/wet/menu/map/fire/lunch/blanket/badge`). 연어·문법으로 걸러지는 것도 있다(0.4 `clean the size`, 2.1 `is beside.`, 11.0 `bleed a trickle`). `hide/hiding/hid/hidden` 묶음은 10문장에 돌려썼다. |
| 3 | `decoy` | 4 | 대신 넣어서 `ko`에 맞는 다른 문장이 되는 것은 없다. 끼워 넣으면 `ko`에 그대로 맞는 것 2개(0.0 `from your hand`, 3.3 `very well`), 경계선 1개(2.3 `Why did you fall` — ko "어쩌다"가 why도 받는다). |
| 4 | `distractorsKo` | 4 | 대부분 같은 상황에서 실제로 할 말이고, 뒤집기는 거의 없다. 고칠 것 10: 반만 다른 말 5(9.3 11.3 13.5 + 경계 13.0 18.4), 잘못된 관행을 본보기로 보이는 말 3(7.0 광견병 주사 "내일", 15.2 지혈대 전에 진통제 "먼저", 17.5 목에 붕대를 "감은"), 상황 안 모순 1(20.0 "남자" ↔ She), 바로 옆 문장과 겹침 1(5.1). |
| 5 | `order` | 3 | 조건절(`If so`)로 시작하는 줄은 0개다. 압박·지혈대는 S0·S10·S11·S15·S18 모두 L1에 있다. 그러나 **인접 교환이 열린 카드가 5장**(S6 3↔4, S9 2↔3, S11 3↔4, S14 2↔3, S17 2↔3)이고, 약하게 열린 카드가 4장이다(S10·S16 3↔4, S18·S19 2↔3). 억지로 묶은 영어가 4장(S0 `Going by that time`, S4 `From that`/`Whatever it was`, S6 `Going by that`, S13 `From that`/`Through the interpreter,`)이다. 조건·전제가 남은 카드가 2장(S12 L2 `Based on what I see`, L4 `keep it up`; S2 L3), 임상 흐름이 어긋난 카드가 2장(S17 처치가 3번째, S8 L4 인과)이다. |
| 6 | `tag`·`icon` | 4 | 태그는 한국어이고 10자 이하이며 상황 안에서 일관된다. order 21장 모두 `대화 흐름`·`compass`. 사소: 19.5 수혈에 `hospital`, 3.2 백신에 `pill`. |
| 7 | context `word`·`ko`, swap `ko` | 4 | `word`가 세 장면 모두에 있다(14/14, W14 0). `ko`도 모두 맞다. 어색한 장면은 모두 환자·보호자·아이에게 임상 말투를 쓴 곳이다. 고칠 것: S15 why가 장면에서 사라진 `TQ`를 아직 설명한다. S11 why가 ✓ 환자 장면에 있는 말(loss of consciousness)을 "의료진의 말"이라 한다. S14 ✓·XX 장면이 `report`를 억지로 끼워 넣었다. S19 XX 영어가 어색하다. swap `ko` 20건은 모두 정답을 넣은 문장의 뜻이다(S0만 "맥박에 맞춰"를 덧붙였는데, 사소하다). |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없음(T8), 확인했다. (2) 동떨어진 빈칸 오답이 약 20문장이고, 같은 오답 묶음(sell·hide)을 돌려썼다. (3) order 못 박기: `And/Also/Then`은 없다. 다만 `Going by that`·`From that`·`Whatever …` 같은 억지 연결어가 새 갈래로 나왔다. (4) 임상 순서·사실: 15.4 why, S17 순서, 16.2 why. (5) 오답 뜻·decoy 겹침: 위 3·4. |

## 사실 오류·심각한 문제

1. **15.4 why — 지혈대를 "압박이 실패한 출혈"에만 쓰는 도구로 말함(대량 출혈 지연).** 지금 why: "지혈대는 눌러서 멎지 않는 사지의 큰 출혈을 막는 도구예요." base 문장 `when pressure alone fails`(v46에서 바꿀 수 없음)와 함께 읽으면 "먼저 눌러 보고, 안 되면 지혈대"라는 순서만 남는다. ACS Stop the Bleed와 군·외상 지침(TCCC, Hartford Consensus)은 **뿜어 나오는 출혈이나 절단처럼 생명을 위협하는 사지 출혈이면 압박이 실패하기를 기다리지 않고 바로** 지혈대를 감으라고 한다. 같은 주제의 15.0 why("바로 써요")·18.0 why("지체 없이")와도 어긋난다. → 아래 W1.
2. **(결정 11, base 문장) 12.2 `How is your blood sugar been controlled lately?`는 비문이다**(→ `How has your blood sugar been controlled lately?`). 빈칸·decoy·청크(`How is` / `been controlled`)가 모두 이 비문 위에 서 있어서, 학습자가 틀린 영어를 조립하고 외운다. 같은 상황의 order L3은 `has been`으로 맞게 썼다. v46이 고칠 수 없는 base 문장이라 따로 올린다(결정 11 G1).
3. **S17 order — 2↔3이 열리고, 처치가 3번째에 온다.** `Tell me … harder` → `Because swelling can build fast, we're controlling…` → `That's because a neck wound can swell…`로 바꿔도 자연스럽다(L2 `That's because`가 L3도 설명함). 그리고 커지는 경부 혈종에서는 지혈·기도 보호가 먼저다. 지금 카드는 환자에게 알려 달라는 부탁 → 이유 → 처치 순이다. → O11.
4. **17.5 distractorsKo `목에 감은 붕대는 풀지 마세요`** — 목에 **둘러 감는** 압박 붕대는 기도·정맥을 조일 수 있어 하지 않는 처치다. 오답이라도 "같은 상황에서 실제로 할 말"로 보이게 해서 잘못된 처치를 본보기로 보여 준다. → D7.
5. **16.2 why `약과 수액으로 잡히지 않는 출혈은 수술로 멈춰야 해서`** — 실혈성 쇼크에서 약·수액은 출혈을 멈추는 치료가 아니다. 수혈은 잃은 피를 채울 뿐이고, 출혈은 원인 부위를 막아야(수술·색전술) 멈춘다. 지금 문구는 "약·수액을 먼저 해 보고 안 되면 수술"이라는 순서로 읽힌다. 같은 상황 order L3 `blood alone may not stop the bleeding`은 맞게 썼다. → W2.
6. **인접 교환이 열린 order 5장** — S6 3↔4, S9 2↔3, S11 3↔4, S14 2↔3, S17 2↔3(위 3). 학습자가 맞히고도 틀린다. → O4·O6·O7·O10·O11.
7. **S12 order L2 `Based on what I see, do you have a fever…?`** — 열·전신 증상은 당뇨족 감염 환자 모두에게 묻는다(자기 점검 10번 조건부 갈래). 그리고 L4 `so please keep it up`은 혈당이 잘 조절된다는 답을 전제한다. 이 장면은 조절이 나쁜 환자일 가능성이 크다. → O8.

## 저작자 자기 보고 3건 판정

### 1. context `word`를 약어·전문어 대신 바꾼 경우(EBL→blood loss, LOC→consciousness, systemic→fever, hypotensive→blood pressure, escalate→report, TQ→tourniquet time)

**판정: 방식은 받아들인다. 고칠 것은 why 2개와 장면 2개다.**
- 이 여섯 문항은 ✓ 장면 하나가 **환자**에게 하는 말이다. 그래서 약어·전문어(EBL·LOC·systemic·hypotensive)는 세 장면 모두에 들어갈 수 없다(환자 ✓ 장면에 넣으면 그 장면이 어색해진다). 묶음 검토 기준과 같다. 세 장면이 자연스럽게 함께 쓰는 쉬운 말을 `word`로 고르고, 전문어는 어색한 장면에만 남기는 것이 TASK 9번 예시(`drowsy` — XX "Pt is drowsy, GCS 14, monitoring for resp depression")와 같은 모양이다. `who`가 고정이라 다른 방법이 없다. 묶음 C의 `hypotensive`는 ✓ 장면이 의료진뿐이어서 전문어가 `word`가 될 수 있었고, 여기와 경우가 다르다.
- **원래 학습 의도(가족·환자에게 약어·전문어를 쓰지 않기)는 지켜졌다.** XX에 남은 전문어는 `estimated blood loss`·`secondary to`·`systemic symptoms`·`hypotensive and tachycardic`·`attending … escalation`·`radiopaque foreign body`·`definitive surgical control`이다. 모두 환자·보호자가 들으면 차갑거나 못 알아듣는 말이라, 어색함이 **듣는 사람 때문**인 것이 분명하다. 다만 **약어 자체**(EBL·LOC·TQ·BP)는 의사·차트 장면에서도 풀어 쓰는 바람에 장면에서 사라졌다. 의사 콜에서는 `no LOC`·`BP`가 더 실제 말투지만, `word`를 지키려면 피할 수 없는 손실이라 받아들인다.
- 고칠 것:
  - **S15 `tourniquet time`** — why "TQ time은 의료진끼리의 줄임말이에요"가 지금 어느 장면에도 없는 `TQ`를 설명한다(TASK 9 "장면을 바꿨으면 why 다시 읽기"). → C1.
  - **S11 `consciousness`** — ✓ 환자 장면이 `lose consciousness`를 쓰는데, why가 "loss of consciousness … 같은 말은 의료진의 말"이라 한다. 학습자에게는 ✓ 장면이 틀렸다는 말로 읽힌다. 어색함은 `documented`·`secondary to`에 있다. → C2.
  - **S14 `report`** — ✓ 의사 장면 `Reporting on bed 6:`은 낱말을 넣으려고 만든 첫머리라 실제 전화 말투가 아니다. XX `report this to the attending for escalation`은 base `I'll escalate this to the attending.`보다 부자연스럽다. → C3.
  - **S19 `turn`** — XX `turn you to lateral decubitus`는 `position`이 빠져 의료진끼리도 하지 않는 말이다. → C4.
  - 경미: S16 fix가 ✓ 장면 1과 거의 같은 문장이다 → C5. order L1 `lower than we'd like`(혈압 78/40)는 축소된 말이다. 같은 주제 S15 swap이 "축소하면 믿음을 잃는다"고 가르친다 → O13.
- 그대로 둘 것: S0 `blood loss`, S5 `suture removal`(성인은 알아듣고 아이에게만 어색함 — 장면 who와 맞음), S6 `INR`, S8 `leave open`, S9 `X-ray`, S12 `fever`, S13 `interpreter`(세션 전 브리핑 ↔ 통역사에게 3인칭 지시 — 대비가 바르다. 호격 `Interpreter,`는 조금 딱딱하지만 둔다), S18 `tourniquet`, S20 `stable`.

### 2. 장소·부위·약 종류 빈칸 오답을 `ko`가 가르는 것으로 보고 남긴 곳

**판정: 받아들인다.** 0.3 `burn/bite/bruise`(ko 베였는지), 3.0 `flu/measles/hepatitis`(파상풍), 6.3 `Tylenol/insulin/metformin`(와파린), 7.3 `gym/office/pool`(공원), 8.4 `elbow/ankle/shoulder`(손가락 관절), 9.0 `gravel/metal/wood`(유리), 9.3 `plastic/paper/rubber`(유리), 11.3 `arm/hand/leg`(머리), 12.3 `hand/knee/back`(발), 14.3 `omeprazole/insulin/metformin`(아스피린), 17.0·17.3 `hand/knee/foot/ankle`(목), 18.3 `arm/foot/finger`(손).
낱장 머리의 `ko`에 그 낱말이 그대로 있어 정답이 하나로 갈린다. 오답도 모두 같은 분야(부위·약·이물)라 동떨어지지 않았다. 이 문항들은 영어 추론이 아니라 `ko`를 영어로 옮기는 문항이 되지만, 가르치는 말(knuckle·tetanus·warfarin)을 정확히 묻는 것이라 둔다. 7.4 `measles/shingles/mumps`도 같다.

### 3. 지혈대 why에서 순서를 단정하지 않은 것, order를 `it`·`that`로 묶은 것

- **why — 절반만 받아들인다.** 15.0 why("압박만으로 잡기 어려운 사지의 동맥 출혈은 지혈대를 바로 써요")와 18.0 why("지체 없이 지혈대로")는 좋다. 그러나 **15.4 why는 순서를 단정하지 않은 것이 아니라 "압박 → 실패 → 지혈대"를 정의로 말한다**(심각 1). base 문장이 `when pressure alone fails`라서 why가 균형을 잡아 줘야 한다. 18.4 why "수술에서 출혈 부위를 직접 잡을 때까지 두는 것이 원칙"은 맞다.
- **order — 지혈대 카드 둘은 좋다.** S15(`It`·`Despite the pain`·`that time`)와 S20(`For that bleeding`·`Since then`·`With that response`)은 교환 세 가지가 모두 깨지고, 임상 순서(지혈대 먼저 → 설명 → 시각 기록 → 인계)도 맞다. S18은 L2 `That tourniquet`이 L1에서 두 줄 떨어져도 읽혀서 2↔3이 약하게 열린다. → O12.
- **대량 출혈에서 직접 압박·지혈대를 미루는 줄**: 문장·order 줄에는 **없다.** 압박·지혈대가 S0·S10·S11·S15·S18 모두 L1이고, S6 L3 `Whatever the numbers are, I'll keep pressing`처럼 검사와 상관없이 압박을 잇는다고 말한다. 다만 **오답 뜻**에는 미루는 말이 셋 있다. 15.2 `지금 진통제를 먼저 놓을게요`는 고친다(D6). 0.2 `혈압부터 재 볼게요`, 16.0 `혈액형부터 다시 확인할게요`는 오답이라 학습자가 고르지 않지만, 바꾸면 더 좋다(선택).
- 억지 연결어는 따로 고친다. `Going by that time`(S0), `From that`·`Whatever it was`(S4), `Going by that`(S6), `From that`(S13), `With no digging`(S9)은 원어민이 하지 않는 연결이거나 뜻이 맞지 않는 인과다(S0: 출혈 시간으로 박동성을 가리지 않음).

---

## 고칠 것

### why (8)
- **W1 · 15.4 why** · 지혈대를 압박 실패 뒤의 도구로만 정의함(심각 1) · → "alone은 '그것만으로는'이라는 뜻이에요. 눌러서 안 멎는 사지 출혈에 지혈대를 쓰지만, 뿜어 나오는 출혈처럼 목숨이 걸린 출혈이면 압박이 실패하기를 기다리지 않고 바로 감아요."
- **W2 · 16.2 why** · 약·수액을 먼저 해 보고 안 되면 수술이라는 순서로 읽힘(심각 5) · → "preparing you for…로 환자가 대상임을 분명히 말해요. 수혈은 잃은 피를 채울 뿐이라, 계속되는 출혈은 수술로 원인 부위를 막아야 멈춰요."
- **W3 · 1.1 why** · "상처를 심장보다 높이 두면 그 부위로 가는 혈압이 낮아져요"라고 효과를 단정함. 거상은 2010년 이후 AHA·미국 적십자 응급처치 지침에서 근거 부족으로 지혈법으로 권하지 않는다(상황 brief가 거상을 넣었으니 문장은 둠) · → "above your heart처럼 기준점을 말해 주면 환자가 높이를 스스로 맞춰요. 거상은 돕는 정도이고, 지혈의 핵심은 계속 누르는 거예요."
- **W4 · 10.2 why** · 같은 단정("출혈이 줄어요") · → "to slow the flow로 거상의 목적을 알려 줘요. 거상은 보조일 뿐이라 압박 드레싱을 풀지 않고 함께 해요."
- **W5 · 7.1 why** · "개의 광견병 접종 여부가 예방 치료의 필요를 정해요"는 과장이다. 미국에서는 개를 10일 관찰할 수 있는지와 지역 보건당국 판단을 함께 본다 · → "…개의 광견병 접종 여부와 그 개를 10일 동안 지켜볼 수 있는지가 예방 치료를 가르는 단서예요."
- **W6 · 3.4 why** · `even more으로` 조사 오류 · → `even more로`.
- **W7 · 11.4 why** · "뼈나 두개골 골절까지"는 같은 말을 두 번 한 것이다 · → "두피 열상은 상처가 두개골까지 닿았는지, 그 아래 골절이 있는지 보는 것이 중요해요."
- **W8 · 8.4 why 첫 문장** · "병원 영어에서도 자연스러워요"는 근거가 없고 방식의 이유도 아니다 · → "right here를 덧붙이면 말과 함께 손으로 짚어 위치를 정확히 알려 줘요."

### 빈칸 (20) — 정답이 둘인 것은 없음. 동떨어진 오답·연어로 걸러지는 오답 바꾸기
- **B1 · 0.4** · `cover/clean/close the size` — 연어로 걸러짐 · → 빈칸을 `depth`로 옮기고 선택지 `depth / color / shape / smell` (ko "깊이"가 가름).
- **B2 · 2.1** · `above`·`beside`는 목적어가 없어 비문 · → `inside / loose / showing / broken`.
- **B3 · 3.5** · `loud/wide pinch` 동떨어짐 · → `quick / long / deep / slow`.
- **B4 · 4.1** · `map/list/menu of zero to ten` 동떨어짐 · → 빈칸을 `bad`로 옮기고 `bad / long / deep / new` (ko "얼마나 심한가요").
- **B5 · 4.5** · `loud/cold/wet` 동떨어짐 · → `sharp / mild / itchy / numb`.
- **B6 · 5.2** · `sold` · → `tightened / counted / checked / removed`.
- **B7 · 5.3** · `freeze/bury/paint this up` 동떨어짐·비문 · → `stitch / glue / tape / staple` (같은 분야, ko "꿰매시는"이 가름).
- **B8 · 6.1** · `vision/hearing labs`는 없는 검사 · → `clotting / kidney / liver / thyroid`.
- **B9 · 6.4** · `sell/spill your last dose` · → `take / miss / skip / change`.
- **B10 · 6.5** · `bandages` · → `labs / x-rays / scans / vitals`.
- **B11 · 7.2** · `crutches/glasses` 동떨어짐 · → `antibiotics / steroids / antacids / stitches`.
- **B12 · 10.3** · `dripping steadily`는 ko "꾸준히 흐르고"와 경계선 · → `dripping` 대신 `spurting`(동맥과의 대비, ko가 가름).
- **B13 · 11.0** · `bleed a trickle`은 비문 · → `trickle` 대신 `while` (`bleed a while`, ko "많이"가 가름).
- **B14 · 12.4** · `noise/taste/sound` 동떨어짐 · → `odor / drainage / color / swelling`.
- **B15 · 13.3** · `fire/hire/pay` 동떨어짐 · → `call / thank / pay / tell`.
- **B16 · 14.5** · `sell/lend this to the doctor` · → `report / show / send / hand`.
- **B17 · 15.1** · `selling` · → `noting / guessing / hiding / losing`.
- **B18 · 16.2** · `lunch` · → `surgery / dialysis / discharge / rehab`.
- **B19 · 19.3** · `selling/donating blood` · → `vomiting / coughing / passing / losing`.
- **B20 · 20.3** · `blanket/uniform/badge` 동떨어짐 · → `handoff / consult / bed / callback`.
- (돌려쓰기 참고: 위를 반영하면 `sell` 묶음이 사라진다. `hide/hiding/hid/hidden`이 남는 1.1 1.3 2.0 4.0 9.4 12.0 16.0 17.1에서도 두세 개는 같은 분야 오답으로 바꾸면 좋다 — 선택.)

### decoy (3)
- **D1 · 0.0** · `from your hand`를 끼우면 `…bleeding from your hand and how much have you lost?`가 ko에 그대로 맞음 · → `have you found` (`have you lost` 자리, ko "흘렸나요"가 가름).
- **D2 · 3.3** · `very well`을 끼우면 `I honestly don't remember my last shot very well.`이 ko "기억이 안 나요"에 맞음 · → `my first shot`.
- **D3 · 2.3** · `Why did you fall`은 ko "어쩌다"가 why도 받음(경계) · → `When did you fall`.

### distractorsKo (10)
- **K1 · 5.1** `오늘은 무거운 것은 들지 마세요` — 바로 앞 5.0 오답과 글자까지 거의 같음 · → `샤워는 내일부터 하셔도 돼요`.
- **K2 · 7.0** `광견병 주사는 내일 맞을 거예요` — 노출 후 예방은 미루지 않음, 할 법하지 않은 말 · → `물린 지 얼마나 됐나요?`
- **K3 · 9.3** `유리 조각이 손가락에 박힌 것 같아요` — 정답과 반만 다름 · → `상처 주변이 계속 따끔거려요`.
- **K4 · 11.3** `머리카락 속에서 피가 계속 흘러요` — 정답과 반만 다름 · → `부딪힌 곳에 혹이 났어요`.
- **K5 · 13.5** `통역사에게 천천히 말씀해 주세요` — 정답과 같은 틀 · → `드시는 약이 있으면 알려 주세요`.
- **K6 · 15.2** `지금 진통제를 먼저 놓을게요` — 지혈대보다 진통제를 앞세우는 말 · → `지혈대를 감은 뒤에 진통제를 드릴게요`.
- **K7 · 17.5** `목에 감은 붕대는 풀지 마세요` — 목에 둘러 감는 붕대는 하지 않는 처치(심각 4) · → `침을 삼키기 힘들면 말씀해 주세요`.
- **K8 · 13.0** `통역 전화를 연결하는 데 잠깐 걸려요` — 정답과 같은 일을 말함(경계) · → `어느 나라 말을 쓰세요?`
- **K9 · 18.4** `붕대는 풀지 마세요` — 지혈대/붕대만 다르고 뜻이 겹침(경계) · → `수술팀이 곧 내려올 거예요`.
- **K10 · 20.0** `이 환자는 36세 남자입니다` — 같은 인계의 20.5·order L4가 `She`라 상황 안에서 모순, 정답과 반만 다름 · → `왼쪽 허벅지 열상 환자입니다`.
- (선택) 0.2 `혈압부터 재 볼게요`, 16.0 `혈액형부터 다시 확인할게요`는 활동성 대량 출혈에서 압박·수혈을 미루는 말투다. `혈압도 같이 잴게요`·`혈액형 검사도 같이 보낼게요`로 바꾸면 좋다.

### order (13장) — 줄은 모두 15단어 이하로 다시 셌다
- **O1 · S0 L3** · `Going by that time, …`은 원어민이 하지 않는 연결이고, 출혈 시간으로 박동성을 가린다는 인과도 틀림 · → `Over that time, has it flowed steadily or spurted with your pulse?` (ko "그동안 피가 꾸준히 흘렀나요, 맥박에 맞춰 뿜어졌나요?"; why의 'that time' 설명을 "그동안"으로).
- **O2 · S2 L3** · `Based on what you tell me, I'll check how deep it is` — 깊이 확인을 환자 말에 달린 일로 만듦(깊이는 모두 눈으로 봄) · → `Along with what you feel, I'll look at how deep it is.`
- **O3 · S4 L2·L3** · `From that,`·`Whatever it was,` 억지 연결, 2↔3 약하게 열림 · → L2 `So what cut you, and was it dirty or rusty?` / L3 `Where it cut you, how bad is the pain from zero to ten?` (L1·L4 그대로; `it`이 L2의 물건을 받아 2↔3이 깨짐).
- **O4 · S6** · 3↔4 열림(`Depending on those numbers…` ↔ `Whatever the numbers are…`), L2 `Going by that` 어색 · → L2 `With that information, we'll check your clotting labs to guide treatment.` / L3 그대로(`Whatever the numbers are, I'll keep pressing firmly on the wound.` — 압박은 3번째 자리에 둔다) / L4 `On top of that pressure, those numbers decide if you need clotting medicine.` (13단어. `that pressure`가 L3을 받아 3↔4가 깨지고, L3 `the numbers`가 L2를 받아 2↔3도 깨짐; why 갱신).
- **O5 · S8 L4** · `With it left open, you'll need antibiotics` — 항생제가 열어 둔 탓인 것처럼 읽힘(실제 이유는 사람 교상의 감염 위험) · → `Open or not, you'll need antibiotics and close follow-up.`
- **O6 · S9** · 2↔3 열림(`Because of that`이 L1의 X-ray도 받음), L4 `With no digging` 어색 · → L3 `Knowing exactly where it is, we won't have to dig around blindly.` / L4 `Since we're not digging, tell me right away if it hurts more or feels numb.`
- **O7 · S11** · 3↔4 열림(뼈 확인 ↔ 머리 부딪힘), `Knowing that` 억지 · → L2 `Even with this pressure, scalp wounds bleed a lot, so it looks worse than it is.` (15단어) / L3 `Did you hit your head hard when this happened?` / L4 `Either way, let's check if the cut goes down to the bone.` (머리 외상 문진이 상처 탐색보다 먼저; ko·note·why 갱신).
- **O8 · S12** · L2 조건부(모든 환자에게 묻는 전신 증상), L3 "물어보겠다"는 예고만 하는 말, L4 `keep it up`이 답을 전제함(심각 7) · → L2 `Besides the foot itself, have you had a fever or felt unwell?` / L3 `How has your blood sugar been running with all this?` / L4 `Keeping it under control will help this heal.`
- **O9 · S13** · L2 `Through the interpreter,`는 환자에게 하는 말 첫머리로 부자연스러움, L3 `From that,`은 알레르기·접종 질문을 경위에 달린 일로 만듦 · → L2 `With the interpreter here, how did the wound happen, and with what?` / L3 `Before we treat it, are you allergic to any medicines, and is your tetanus current?` (15단어).
- **O10 · S14 L3** · 2↔3 열림(`Because of that, we'll hold…` → `Taking those together…`도 자연스러움) · → `That's why we'll hold firm pressure longer and monitor closely.` (L1 질문 뒤에는 `That's why`가 설 수 없음).
- **O11 · S17** · 2↔3 열림, 처치가 3번째(심각 3) · → L1 `We're controlling the bleeding and protecting your airway right now.` / L2 `That's because a neck wound can swell and press on your airway.` / L3 `Since that can happen fast, tell me right away if breathing gets harder.` / L4 `Whether or not you tell me, I'll keep checking that your airway is open.` (14단어. `tell me`가 L3을 받음. 교환 셋 모두 깨짐을 확인; note·icon·why 순서 갱신).
- **O12 · S18 L3·L4** · 2↔3 약하게 열림 · → L3 `Until that surgery, we're keeping the amputated part cool and moist.` / L4 `To give it the best chance, the surgical team is being called for possible reattachment.` (15단어).
- **O13 · S16** · 3↔4 약하게 열림, L1 `lower than we'd like`는 축소된 말 · → L1 `Your blood pressure is very low, so we're moving fast.` / L3 `The surgical team is getting ready, because blood alone may not stop the bleeding.` / L4 `With surgery on standby, tell me right away if you feel colder or faint.`
- 그대로: S1 S3 S5 S7 S15 S19 S20(S19 2↔3은 약하지만 `Lying like that`이 L1을 받으니 둔다). S10 3↔4도 약하게 열리지만 둔다(`Both together`가 압박+거상).

### context·swap (5)
- **C1 · S15 context `tourniquet time` why** · 사라진 `TQ`를 설명함 · → "'Tourniquet time 1420, documented.'처럼 차트 칸을 읽듯 끊어 말하는 건 의료진끼리의 말투예요. 환자에게는 무엇을 왜 적는지 쉬운 말로 알려요."
- **C2 · S11 context `consciousness` why** · ✓ 환자 장면의 말(lose consciousness)을 의료진의 말이라 함 · → "documented·secondary to 같은 말은 차트와 의료진의 말이에요. 환자에게는 'pass out·black out'처럼 쉬운 말로 물어요."
- **C3 · S14 context `report`** · 낱말을 억지로 끼워 넣음 · → 장면 0 `Calling to report bed 6 — aspirin and clopidogrel, still oozing after 20 minutes of pressure.` / XX `I'll report this to the attending and escalate per protocol.` (why 그대로).
- **C4 · S19 context `turn` XX** · `turn you to lateral decubitus`는 비문 · → `We're going to turn you to the lateral decubitus position for aspiration precautions.`
- **C5 · S16 context `blood pressure` fix** · fix `Your blood pressure is low and your heart is racing, so we're acting fast.`가 base 장면 1(`…is low, so we're moving fast.`)과 거의 같은 문장이다(묶음 A family #4·#7·#8과 같은 기준). 장면 1은 저작자 문장 그대로 두고, fix가 why가 말하는 '지금 무엇을 하는지'를 담게 한다 · → fix `Your blood pressure is low and your heart is beating fast — we're giving you blood right now.` (축소된 `lower than we'd like`는 order L1만 O13으로 고친다; 경미).

---

## 결정 11 — base 문장·단어 (v46에서는 고치지 않음, 따로 보고)
- **G1 · 12.2 `How is your blood sugar been controlled lately?`** — 비문(심각 2). → `How has your blood sugar been controlled lately?` 청크 `How is`→`How has`. 빈칸·decoy는 그대로 쓸 수 있다.
- **G2 · 11.2 ko `출혈이 심해 보이지만 보통 실제보다 더 심해 보여요`** — 같은 말을 되풀이했다 → `피가 많이 나 보여도 보통은 보기보다 심하지 않아요`. 경미.
- **G3 · 20.4 `Vitals are stable and the limb is warm.`** — 같은 인계에서 지혈대가 감겨 있고 출혈이 조절됐다. 그렇다면 지혈대 아래쪽 팔다리는 차갑고 맥박이 없어야 정상이다. 따뜻하다는 보고는 지혈대가 덜 조였다는 신호로 읽힐 수 있다. `the limb`이 어느 쪽인지 정본에서 확인하기를 권한다(확신 낮음).

## 종합
고칠 것 **59건**(why 8 · 빈칸 20 · decoy 3 · distractorsKo 10 · order 13장 · context 5)과 결정 11 보고 3건이다. 심각한 것은 15.4 지혈대 why, 12.2 base 비문, S17 순서, 17.5 오답 뜻, 16.2 why다. 대량 출혈에서 압박·지혈대를 미루는 **문장·order 줄은 없다.**
W1·W2·K7·O4·O6·O7·O10·O11을 고친 뒤 내보내도 된다. 12.2는 정본 수정(결정 11)으로 따로 처리해야 한다.
