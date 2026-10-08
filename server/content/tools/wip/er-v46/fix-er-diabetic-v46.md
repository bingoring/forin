# er-diabetic — v46 보강 검토 (er)

대상: `er-diabetic.yaml` (상황 21 · 문장 127 · order 21장 · 뉘앙스 context 12 · swap 9). 문장 127개와 order 카드 21장(84줄)을 전부 봤다.
상황 번호는 파일 순서대로 0부터 센다(S0 = 혈당 측정·병력 문진 … S20 = DKA 급변 야간 인계). 문장은 `상황.문장`(0부터), order 줄은 L1~L4.

스크립트로 전부 뽑아 본 것:
- 빈칸 `before + 선택지 + after` 508줄
- decoy를 청크 자리마다 **대신 넣은** 조립(약 420줄)과 청크 사이에 **끼워 넣은** 조립(582줄)
- order 인접 교환 63가지(21장 × 3)와 줄 단어 수
- context `word`가 세 장면 `en`에 있는지와 base 대비 바뀐 장면·`fix`·`why`
- swap 9건(정답을 넣은 문장과 `ko`)
- 빈칸 오답·decoy·`distractorsKo`의 주제 안 중복

`verify_one_theme.py er …/er-diabetic.yaml` → `==> 통과`(W13 경고 3 — v45 단어 오답 `shaken`·`confusing`·`scarred`, 이번 범위 밖. W14 0).
아래 새 빈칸 answer(`back`·`potassium`·`controlled`)는 모두 `en`에 낱말 경계로 정확히 한 번 나오는지 확인했다. 새 decoy는 청크와 같지 않고 `en` 안에 없다. 새 order 줄은 모두 15단어 이하로 다시 셌고, 인접 교환 세 가지를 다시 읽었다.

판정 기준: 낱장 머리에 그 문장의 `ko`가 보인다. 그래서 "정답이 둘"은 **`ko`에도 맞는가**로 판정했다. decoy를 끼워 넣은 조립은 덧붙은 말이 `ko`에 이미 담긴 뜻일 때만 "ko에 맞는 다른 문장"으로 셌다(앞 주제 검토와 같은 기준).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | `why` | 4 | 대부분 사실이고 말하는 방식(Let me…·might·can·현재완료)의 이유를 짚는다. DKA 칼륨(15.2·15.4 — K < 3.3이면 인슐린 보류, ADA), 저칼륨 심전도(15.5), Kussmaul(5.1), 아세톤 날숨(5.2), 펌프는 속효성만 써서 몇 시간 만에 DKA(9.2·9.4), 신장 질환에서 인슐린이 오래 남음(6.5), 고령자 혈당 목표 완화(12.4), 소아 뇌부종 신호(16.0·16.3), 통역 의무(14.0)는 모두 맞다. 고칠 것 6: 15-15 규칙이 부정확(1.3), 어지러움을 아드레날린 증상으로 묶음(1.0), HHS 수액을 "한 번에 많이 넣지 않는다"로 말함(8.4), teach-back 정의(14.3), "가장 빠른 신호" 과장(16.2), 14.2·14.3의 같은 근거 되풀이. |
| 2 | 빈칸 | 3 | `ko`로 걸러지지 않아 **정답이 둘**인 것은 없다. 그러나 **오답으로 위험한 처치를 보이는 것이 4문장**이다(1.2 저혈당에 `insulin`, 6.2 의식 저하 환자에게 `mouth`, 18.3 깨지 않는 저혈당 환자에게 `insulin`·`morphine`, 15.4 저칼륨에 `give/add/start` 인슐린). 자기 보고 14.3 `agree/forget/refuse`는 억지 선택지가 맞다. 그 밖에 문법·연어로 걸러지거나 장면 밖인 것이 약 9문장 있다(4.5 `harder/later`, 9.1 `heavy/cold`, 16.5 `hiding/waiting`, 7.3 `warn`, 10.5 `little`, 20.1 `appetite`, 14.5 `barely`, 13.0 `early`, 5.5 `ordered` — 마지막은 거의 정답). 브리프 2(a)·(b)처럼 같은 분야에서 틀린 말을 고른 문장이 대부분이라, 앞 주제들보다는 훨씬 좋다. |
| 3 | `decoy` | 4 | 대신 넣어 `ko`에 맞는 다른 문장이 되는 것은 1개(3.5 `keeps you from`)다. 끼워 넣어 맞는 것은 없다. 다만 조립하면 **위험한 지시가 되는 decoy가 3개**다(11.5 `Please delay your insulin`, 15.2 `correct it after more insulin`, 19.4 패혈증에 `antibiotics … tomorrow morning`). `how often`을 5문장에 돌려쓴 것은 선택 사항이다. |
| 4 | `distractorsKo` | 3 | "안/못/절대" 뒤집기는 없고, 대부분 같은 상황에서 실제로 할 말이다. 그러나 **정답과 반만 다른 말이 10문장**이다. 특히 S20 보고 장면 셋(20.3·20.4·20.5 — 셋 다 "의사에게 알린다·인계한다"가 겹침), 11.0(오답 둘이 모두 감염 증상 질문), 14.0(통역사 연결), 19.1(발이 언제부터 검게 — 정답과 거의 같은 질문)이 그렇다. 잘못된 관행으로 읽히는 말이 1개 있다(11.2 아플 때 "약은 평소대로"). 같은 상황 안에서 글자까지 같은 오답이 2쌍 있다(0.0·0.2, 7.0·7.2). |
| 5 | `order` | 2 | `If so`류 줄은 없다. 그러나 **18장에 고칠 것이 있다.** ① 앞 줄 답을 '예'로 전제하거나 모든 환자에게 하는 처치를 답에 묶은 줄이 11장이다(S0·S1·S5·S6·S8·S12·S15·S16·S17·S19·S20 — 자기 점검 10번 갈래, 그중 S6 정맥 포도당·S5 수액·S16 신경 감시·S19 항생제는 **처치를 답에 묶음**). ② 15단어를 넘는 줄이 8장이다(S5 16·S8 17·S9 17·S10 17·S11 17·S14 16·S15 19·S19 17). ③ 인접 교환이 열린 카드가 3장(S3 3↔4, S12 1↔2, S13 3↔4)이고 약하게 열린 카드가 2장(S9 2↔3, S18 2↔3)이다. ④ 임상 기준이 어긋난 줄이 1장이다(S18 L4 — 포도당 추가는 깨어남이 아니라 혈당 재측정으로 정함). |
| 6 | `tag`·`icon` | 5 | 태그는 모두 한국어 10자 이하이고 상황 안에서 일관된다. order 21장은 모두 `대화 흐름`·`compass`다. NbIcon 목록에 주사기가 없어 주사에 `pill`을 쓴 것은 허용한다. |
| 7 | context `word`·`ko`, swap `ko` | 4 | `word`는 12문항 모두 세 장면에 있다(W14 0). 어색한 장면은 모두 환자·가족에게 차트·의료진 말을 쓴 곳이다. 고칠 것 3: S8 `dehydrated`는 두 장면에 `dehydration`만 있다. S11 `sick`은 차트 장면에 억지로 끼워 넣었다(base에 이미 `sick-day`가 있었음). S19 `sepsis`는 fix·why가 sepsis라는 말 자체를 환자에게 쓰면 안 되는 것처럼 가르친다. swap `ko` 9건은 모두 정답을 넣은 문장의 뜻이다. |
| 8 | 파일럿 갈래 | 3 | (1) 선택지 아이콘: 없다(T8). 확인했다. (2) 빈칸 오답은 대체로 같은 분야에서 골랐지만, **위험한 처치를 오답으로 보이는 갈래**(이어진 검토 마지막 항)가 빈칸 4·decoy 3·오답 뜻 1에서 되풀이됐다. (3) order: `And/Also/Then`은 없다. 그러나 `Going by both answers`·`Given those answers`·`Together with that`·`That change is why`처럼 **답에 묶는 연결어**가 새로 나왔다. (4) 임상 순서: S6에서 처치보다 문진이 먼저이고, S5에서 수액이 검사 결과 뒤에 온다. (5) decoy·오답 뜻 겹침은 위 3·4와 같다. |

## 사실 오류·심각한 문제

1. **오답으로 위험한 처치를 보인다 — 빈칸(4문장).**
   - 1.2 `Let's have you take some insulin or glucose tablets now.` — 저혈당 환자에게 인슐린을 권하는 꼴이다.
   - 6.2 `giving sugar directly into his mouth` — 의식이 흐린 환자에게 입으로 당을 주는 것은 바로 그 문장의 why가 "흡인 위험"이라며 금하는 일이다.
   - 18.3 `giving more insulin / morphine` — 깨지 않는 저혈당 환자에게 인슐린·진정제를 주는 꼴이다.
   - 15.4 `We'll give / add / start extra insulin until your potassium improves` — 선택지 넷 중 셋이 저칼륨 DKA에서 하면 안 되는 처치다(K < 3.3이면 인슐린 보류, ADA).
   - → B1~B4.
2. **조립하면 위험한 지시가 되는 decoy(3개).**
   - 11.5 `Please delay` → `Please delay your insulin, even if you can't eat much.`(아플 때 인슐린을 미루라는 지시)
   - 15.2 `after more` → `…correct it after more insulin.`
   - 19.4 `tomorrow morning` → `We're starting antibiotics and fluids tomorrow morning.`(패혈증 항생제 지연)
   - → D2~D4.
3. **1.3 why — 15-15 규칙이 부정확하다.** "15분 뒤 혈당이 올랐는지 다시 재고, 안 올랐으면 다시 먹이는 것"이라고 했지만, 규칙은 **빠른 당 15 g → 15분 뒤 재측정 → 아직 70 mg/dL 미만이면 반복**이다(ADA). 지금 문구는 15 g이 빠졌고, 조금만 올라도 끝내도 되는 것처럼 읽힌다. → W1.
4. **order가 처치를 앞 줄 답에 묶는다(자기 점검 10번).**
   - S6 L3 `That could drop his sugar, so we're giving sugar directly into his vein` — 의식 저하 저혈당에는 원인과 관계없이 정맥 포도당을 **먼저** 준다. 지금 카드는 문진 둘을 마친 뒤에야 처치한다.
   - S5 L4 `Based on those tests, we'll start IV fluids and insulin` — DKA 수액은 결과를 기다리지 않는다. 결과(칼륨)를 기다리는 것은 인슐린이다.
   - S16 L3 `That change is why we're checking his neurological status` — 소아 DKA 신경 감시는 모든 환자에게 한다.
   - S19 L3 `That spread is serious, so we're starting antibiotics` — 발열을 동반한 괴사성 발 감염이면 번졌는지와 관계없이 항생제를 바로 쓴다.
   - → O4·O5·O14·O17.
5. **인접 교환이 열린 order 3장.** S3 3↔4(`why rotating matters`가 뒤 줄을 미리 가리켜 바꿔도 자연스러움), S12 1↔2(`these low sugars`가 장면만으로 성립해 첫 줄이 될 수 있음), S13 3↔4(`that way` 뒤에 `Keeping your sugar in range protects you both`를 마무리로 두어도 됨). 학습자가 맞히고도 틀린다. → O3·O10·O11.
6. **15단어를 넘는 order 줄이 8장이다**(브리프 "한 줄은 15단어 안쪽"). → O4·O6·O7·O8·O9·O12·O13·O17.

## 저작자 자기 보고 3건 판정

### 1. 임신 주수 빈칸(`overdue/early/late`), 14.2(`diet/procedure/discharge`), 14.3(`agree/forget/refuse`)

- **13.0 — 정답이 둘은 아니다. 하나만 바꾼다.** `ko` "임신 몇 주 되셨어요?"는 `pregnant`만 받는다.
  - `overdue`(예정일이 몇 주 지났나)와 `late`(생리가 몇 주 늦었나)는 같은 분야에서 뜻이 다른 말이라 브리프 2(a)에 맞는 좋은 오답이다.
  - `How many weeks early are you?`는 임신부에게 쓰지 않는 영어라 읽기만 해도 걸러진다. → `early` → `postpartum`(산후 몇 주, 같은 분야). → B6.
  - `along`(How many weeks along)은 동의어라 정답이 둘이 되니 쓰지 않는다.
- **14.2 — 억지가 아니다. 그대로 둔다.** `about the diet / discharge`는 당뇨 교육 장면에서 실제로 하는 질문이고 `ko` "인슐린"이 가른다. 브리프가 바라는 "문법은 맞고 이 장면에선 틀린 같은 분야 말"이다. (선택: `procedure`는 이 장면에 시술이 없어 조금 멀다 → `meter`.)
- **14.3 — 억지가 맞다. 고친다.** `so I know you refuse / forget`은 뜻이 통하지 않아 읽기만 해도 걸러지고, `agree`도 어색하다. 빈칸을 `back`으로 옮긴다. → B5.
  - 선택지: `back / up / out / around`
  - 같은 동사의 구동사(show me up 망신 주다·show me out 배웅하다·show me around 안내하다)라 모두 문법에 맞는다.
  - `ko` "다시 보여주시겠어요"가 `back`만 받는다.

### 2. context `dehydrated`·`sepsis`·`sick` — 어색함이 낱말이 아니라 주변 차트 문구에서 온다

**판정: 모양은 핸드오프와 같다.** 같은 쉬운 말을 세 장면이 쓰고, 어색한 장면은 그 말을 둘러싼 차트어(`hyperosmolar hyperglycemic state`·`glycemic lability`·`necrotizing soft tissue infection`)를 환자·가족에게 쓴 곳이다. TASK 9의 `drowsy` 예(XX "Pt is drowsy, GCS 14, …")와 같고, 묶음 검토 A·B·C의 기준과도 맞는다. 다만 세 문항 모두 고칠 곳이 하나씩 있다.

- **S8 `dehydrated`** — 장면 1(차트)·2(XX)에는 `dehydration`만 있다. 검사기는 어간으로 받지만, 화면 제목 "`dehydrated`가 어색한 장면은?"과 맞지 않는다(gi-bleed C2 `endoscopy`와 같은 유형). → C1.
- **S11 `sick`** — 차트 `Pt sick with influenza x3 days`는 차트에 쓰지 않는 말이다. W14를 맞추려고 끼워 넣었다. 그런데 base 차트 `Intercurrent influenza with labile BG; sick-day plan reviewed.`에 이미 `sick-day`가 있어 W14를 통과한다(`_has`가 `sick`·`day`로 나눔). **base로 되돌리면 된다.** → C2.
- **S19 `sepsis`** — XX의 어색함은 `necrotizing soft tissue infection`에 있으니 모양은 맞다. 그런데 fix가 sepsis를 아예 빼고, why가 `signs of sepsis`를 "의료진의 말"로 묶는다. 미국에서는 환자·가족에게 sepsis라는 말을 쓰고 뜻을 풀어 주기를 권한다(CDC Get Ahead of Sepsis). 그래서 "sepsis라는 말은 환자에게 쓰지 말라"는 잘못된 교훈이 된다. → C3.
- 함께 본 S1 `juice`(XX `Administer 4 oz of juice PO now`), S9 `pump`, S12 `fall`, S15 `potassium`, S16 `cerebral edema`, S18 `AMS`, S20 `gap`, S4 `ulcer`는 받아들인다. 임상어를 `word`로 고른 S16·S18·S20은 ok 장면 둘에서 자연스럽게 쓰여, 묶음 B·C의 `norepi`·`hypotensive` 판정과 같다.
- S5 `breathing`은 경계다. 차트 `Kussmaul-type breathing`은 틀린 말은 아니지만, 차트는 보통 `Kussmaul respirations`라 쓴다. (선택) → `Deep, rapid (Kussmaul) breathing; fruity breath odor.`

### 3. `why` 임상 사실 — 15-15 규칙, DKA 칼륨 보충, 소아 DKA 뇌부종 신호

- **15-15 규칙(1.3) — 고친다**(심각 3). S1 context why "당 15 g을 먹이고 15분 뒤 다시 재는 '15-15 규칙'"은 맞고, 차트 장면의 `4 oz juice`도 약 15 g이라 맞다. 문장 1.3의 why만 15 g과 "70 미만이면 반복"이 빠졌다. → W1.
- **DKA 칼륨 — 맞다.** 15.2(인슐린이 칼륨을 세포 안으로 옮김), 15.4(K < 3.3 mEq/L이면 인슐린을 미루고 칼륨부터 — ADA 고혈당 위기 합의문), 15.5(T파 납작·U파), S15 context why 모두 정확하다. 문제는 why가 아니라 그 옆의 오답이다(빈칸 15.4, decoy 15.2 — 심각 1·2).
- **소아 DKA 뇌부종 신호 — 대체로 맞다. 하나만 다듬는다.** 16.0(치료 중 새로 생긴 두통·처짐), 16.1(점점 처지는 방향), 16.3(동공 부등·반응 저하 = 뇌압 상승)은 ISPAD 진료지침과 맞다. 16.2 "의식 수준의 변화가 뇌부종의 **가장 빠른** 신호"는 과장이다. 두통이 먼저 오는 경우가 많다. → W5.
- 함께 확인해 맞는 것: 0.2 속효성·지속형 작용 시간, 3.5 같은 자리 반복 주사 → 지방 비대·흡수 저하, 4.3 고혈당과 상처 치유, 5.4 DKA 수액 우선, 6.2 흡인 위험, 9.2 펌프는 속효성만, 10.4 스테로이드 고혈당은 오후·식후에 두드러짐, 12.4 고령자 혈당 목표 완화, 13.2 임신 고혈당과 거대아, 14.0 통역 의무, 17.2 쇼크 동반 HHS 수액 소생, 19.4 패혈증 항생제 즉시.

## 고칠 것

### why (6)
- **W1 · 1.3 why** · 15-15 규칙이 부정확하다(심각 3) · → "recheck의 re-가 '다시'를, in fifteen minutes가 시점을 알려요. 빠른 당 15 g을 먹고 15분 뒤 다시 재서 아직 70 mg/dL 아래면 한 번 더 먹는 것이 '15-15 규칙'이에요."
- **W2 · 1.0 why** · "떨림·식은땀·어지러움은 아드레날린이 올라 나타나는 증상" — 어지러움은 아드레날린 반응이 아니라 뇌에 당이 모자라서 생긴다 · → "…떨림·식은땀은 아드레날린 반응이고, 어지러움은 뇌에 당이 모자라 생기는 저혈당의 대표 증상이에요."
- **W3 · 8.4 why** · "carefully로 한 번에 많이 넣지 않는다" — HHS는 수액이 아주 많이 필요하다. 조심하는 것은 속도와 심장 부담이다 · → "carefully로 양과 속도를 살피며 넣는다고 알려요. HHS는 수액이 많이 필요하지만, 고령자는 심장·신장이 약할 수 있어 너무 빨리 넣으면 폐에 물이 찰 수 있어요."
- **W4 · 14.3 why** · "show me back은 teach-back" — teach-back은 자기 말로 다시 설명하게 하는 방법이고, 직접 해 보이게 하는 것은 그 시연형(show-back, return demonstration)이다 · → "show me back은 teach-back의 시연형으로, 환자가 직접 해 보이게 하는 방법이에요. 해 보이는 손놀림을 보면 이해했는지가 바로 드러나요."
- **W5 · 16.2 why** · "가장 빠른 신호"는 과장이다 · → "…소아 DKA에서는 두통과 의식 수준의 변화가 뇌부종의 중요한 초기 신호라 반복해서 살펴요."
- **W6 · 14.2 why** · 둘째 문장이 14.3 why와 같다("'Do you understand?'는 예 하고 넘어가기 쉬워서") · → 둘째 문장을 "질문이 없다고 하면 다음 단계로 시연을 부탁해 이해를 확인해요."로.

### 빈칸 (14) — 정답이 둘인 것은 없다. 위험한 처치·억지·걸러지는 오답을 바꾼다
- **B1 · 1.2** · `insulin` — 저혈당에 인슐린(심각 1) · → `juice / diet soda / black coffee / antacid` (`diet soda`는 당이 없어 저혈당 처치로 틀린 같은 분야 말).
- **B2 · 6.2** · `mouth` — 의식 저하 환자에게 입으로(심각 1) · → `vein / muscle / stomach / bladder`.
- **B3 · 18.3** · `insulin`·`morphine`·`steroids` — 깨지 않는 저혈당 환자에게 인슐린·진정제(심각 1) · → `glucose / saline / potassium / calcium`.
- **B4 · 15.4** · `give/add/start` 인슐린 — 저칼륨에 인슐린 투여(심각 1) · → 빈칸을 `potassium`으로 옮기고 `potassium / sodium / calcium / oxygen` (ko "칼륨"이 가름).
- **B5 · 14.3** · `refuse/forget/agree` 억지(자기 보고 1) · → 빈칸을 `back`으로 옮기고 `back / up / out / around`.
- **B6 · 13.0** · `early`는 임신부에게 쓰지 않는 영어(자기 보고 1) · → `pregnant / overdue / late / postpartum`.
- **B7 · 4.5** · `heal harder / heal later`는 연어로 걸러진다 · → 빈칸을 `controlled`로 옮기고 `controlled / high / unchecked / untreated`.
- **B8 · 9.1** · `the site is heavy / cold`는 펌프 부위 문제로 쓰지 않는 말 · → `red / dry / clean / healed`.
- **B9 · 16.5** · `waiting right away`는 비문, `hiding`은 장면 밖(gi-bleed에서 지적한 `hide` 묶음) · → `responding / leaving / resting / charting`.
- **B10 · 7.3** · `which we'll warn you to use`는 어색한 비문 · → `teach / ask / forbid / force`.
- **B11 · 10.5** · `need little insulin`은 문법으로 걸러진다 · → `extra / less / no / oral` (`oral insulin`은 없는 약 — 같은 분야에서 틀린 말).
- **B12 · 14.5** · `barely right` — 브리프가 이름을 든 `almost↔barely` 묶음 · → `exactly / almost / partly / half`.
- **B13 · 20.1** · `short of appetite`는 영어가 아니다 · → `breath / sleep / energy / time`.
- **B14 · 5.5** · `getting everything ordered for your treatment`는 자연스럽고 "준비"와 뜻이 겹친다(거의 정답) · → `ready / labeled / cleaned / billed`.
- 선택(더 바꾸면 좋은 것):
  - 15.2 `after / during / along with more insulin`은 바로 이 장면이 가르치는 순서의 반대지만, 오답으로 "인슐린 뒤에 교정"을 보인다. 빈칸을 `low`로 옮기면 `low / high / normal / rising`(ko "낮아서"가 가름).
  - 13.5 `gender` → `movements`.
  - 15.5 `next week / in a month / eventually`(시간 단위 묶음) → `right away / at discharge / by tomorrow / after rounds`.
  - `rarely`를 세 문장에 돌려썼다(3.0·8.4·17.4). 한두 개를 같은 분야 말로(8.4 → `orally`, 17.4 → `hourly`).
  - 12.1 `spread` → `worsened`.
  - 14.2 `procedure` → `meter`.

### decoy (4)
- **D1 · 3.5** · `keeps you from`을 `helps prevent` 자리에 넣은 `Rotating your sites keeps you from skin problems.`가 ko "피부 문제를 예방할 수 있어요"에 그대로 맞는다 · → `makes up for`.
- **D2 · 11.5** · `Please delay` → `Please delay your insulin, even if you can't eat much.` — 아플 때 인슐린을 미루라는 위험한 지시(심각 2) · → `Never freeze` (조립하면 맞는 보관 수칙이지만 ko "거르지 마세요"가 가른다).
- **D3 · 15.2** · `after more` → `…correct it after more insulin.`(심각 2) · → `so we'll recheck it` (ko "교정할게요"가 가른다).
- **D4 · 19.4** · `tomorrow morning` → 패혈증 항생제를 내일 아침에(심각 2) · → `for the pain`.
- (선택) `how often`을 0.0·0.2·1.1·3.0·11.1 다섯 문장에 돌려썼다. 10.4 `and stop your treatment`, 8.4 `and leave her alone`도 조립하면 하지 않을 처치가 된다(문법으로 걸러지니 경계).

### distractorsKo (11)
- **K1 · 4.2** `열이 나거나 오한이 있으세요?` — 정답 "열감"과 "열"이 겹친다 · → `상처에 뭘 바르셨어요?`
- **K2 · 5.4** `팔에 정맥주사를 놓을게요` — "start IV"와 "start IV fluids"가 겹친다 · → `소변 검사도 같이 할게요`
- **K3 · 8.5** `신장 기능은 혈액검사로 봐요` — 정답 "신장도 살펴볼게요"와 반만 다르다 · → `어머님 드시는 약 목록이 있으세요?`
- **K4 · 11.0** `열이 나거나 오한이 있으세요?` / `기침이나 가래가 있으세요?` — 둘 다 정답 "어떤 감염 증상"의 한 갈래 · → `집에서 혈당은 얼마였어요?` / `인슐린은 평소대로 맞으셨어요?`
- **K5 · 11.2** `약은 평소대로 드세요` — 아플 때는 메트포르민·SGLT2 억제제처럼 쉬어야 하는 약이 있어 잘못된 관행으로 읽힌다 · → `물을 자주 조금씩 드세요`
- **K6 · 14.0** `통역사가 곧 전화로 연결돼요` — 정답 "통역사를 모셔올게요"와 반만 다르다 · → `인슐린 펜을 꺼내 볼게요`
- **K7 · 15.2** `칼륨은 정맥으로 천천히 들어가요` — 정답 "칼륨을 먼저 교정"과 겹친다 · → `근육 경련은 좀 어떠세요?`
- **K8 · 19.1** `발이 언제부터 검게 변했어요?` — 정답 "발이 이렇게 된 지 얼마나"와 거의 같은 질문(정답 둘) · → `혈당은 집에서 얼마였어요?`
- **K9 · 20.3** `의사 선생님께 먼저 말씀드릴게요` — 정답 "보고할게요"와 겹친다 · → `지금 혈당을 다시 잴게요`
- **K10 · 20.4** `지금 당직 의사에게 전화해요` — 정답 "당직 의사에게 업데이트"와 반만 다르다 · → `모니터 알람을 확인할게요`
- **K11 · 20.5** `다음 근무자에게 구두로 전할게요` — 정답 "인계할게요"와 겹친다 · → `수액 속도를 확인할게요`
- (선택) 같은 상황 안에서 글자까지 같은 오답: 0.0·0.2 `인슐린을 하루에 몇 번 맞으세요?`, 7.0·7.2 `천천히 하나씩 설명해 드릴게요` → 하나씩 다른 말로. 8.4 `수액은 팔 정맥으로 넣어요`·15.1 `걸을 때 힘이 드세요?`는 경계다(정답의 "수액"·"약하다"를 나눠 가짐).

### order (18장) — 새 줄은 모두 15단어 이하로 다시 셌다
- **O1 · S0 L3** · `Going by both answers, I'm going to check your blood sugar` — 손끝 혈당은 답과 관계없이 잰다(자기 점검 10) · → L3 `Thanks — now I'm going to check your blood sugar.` (L2를 L3 뒤로 보내면 `after that`이 측정을 가리켜 깨짐) / why에서 'both answers' 대신 'Thanks — now'.
- **O2 · S1 L2** · `drink some juice for that`이 L1 증상 질문에 "예"를 전제한다. 처치 근거도 증상이 아니라 혈당 수치다 · → L1 `Your sugar is low, at 58.` / L2 `Let's have you drink this juice to bring it up.` / L3 `We'll recheck it fifteen minutes after you finish.` / L4 `If it's still under 70 then, we'll repeat the juice.` (15-15 반복은 진짜 조건이라 조건절이 맞음) / why "수치를 알리고, 주스로 올리고, 15분 뒤 다시 재고, 아직 70 미만이면 반복한다고 알려요."
- **O3 · S3 3↔4** · L4 `including why rotating matters`가 뒤 줄을 미리 가리켜 L3·L4를 바꿔도 자연스럽다 · → L4 `Let's practice that rotation together on a new spot.` (`that rotation`이 L3만 가리킴).
- **O4 · S5 L2·L3·L4** · `since then`(L2)이 L1에 "예"를 전제하고, `Those changes`(L3)가 L2 "예"를 전제한다. L3은 16단어다. L4는 수액까지 검사 결과 뒤로 미룬다(심각 4) · → L2 `Whether or not you have, is your breathing faster or deeper?` / L3 `Those answers help, and we're checking your sugar, ketones, and blood gas now.` / L4 `We'll start IV fluids now and add insulin once those results are back.` / why "누락 여부와 관계없이 호흡을 묻고, 검사를 알린 뒤, 수액은 바로·인슐린은 칼륨 결과를 보고 시작한다고 알려요."
- **O5 · S6 전체** · 문진 둘을 마친 뒤에야 정맥 포도당을 주고, 그것도 L2 답(`That could drop his sugar`)에 묶는다(심각 4) · → L1 `His sugar is very low, so we're giving sugar into his vein now.` / L2 `That should bring it back up in a few minutes.` / L3 `While it works, when did you notice he became confused?` / L4 `Before that, did he take his insulin without eating?` (`While it works`는 처치를 미루지 않는 시간 묶음) / why도 "처치부터 알리고 안심시킨 뒤, 그동안 시작 시점과 원인을 물어요."로.
- **O6 · S8 L3·L4** · `That could explain…`이 L2(덜 먹었다)에 "예"를 전제한다. L4는 17단어다 · → L3 `Either way, her sugar is extremely high and she's very dehydrated.` / L4 `For that, we'll give fluids carefully and watch her heart and kidneys.`
- **O7 · S9 L2·L3** · L2가 17단어다. L3 `whatever we find`는 L2 없이 L1 뒤에 와도 읽힌다(2↔3 약하게 열림) · → L2 `Let's check the tubing and site, since either can cause that.` / L3 `While we sort out what we find there, we'll give insulin by injection.` (`there`가 L2만 가리킴).
- **O8 · S10 L4** · 17단어 · → `We'll monitor that rise and may add extra insulin while you're on it.`
- **O9 · S11 L3** · 17단어(되짚기와 지시를 한 줄에 둘) · → `Skipping any of those can make your sugars harder to control.`
- **O10 · S12 1↔2 + L3** · `Have these low sugars…`가 첫 줄이 될 수 있어 1↔2가 열렸다. L3 `before you fell`은 L2에 "예"를 전제한다 · → L1 `How many low sugars have you had this month?` / L2 `Have any of those lows made you fall or nearly fall?` / L3 `Whether or not you fell, did you feel dizzy or faint first?` / L4 `We may need to adjust your medications to prevent those spells and falls.` (`any more falls`도 낙상을 전제하므로 뺌).
- **O11 · S13 3↔4** · `that way` 뒤에 `Keeping your sugar in range protects you both`를 마무리로 두어도 자연스럽다. 또 L2 `At that stage`가 주수와 상관없는 혈당 목표에 붙어 있다(엄격한 목표는 임신 내내 같음) · → L2 `At that stage, we can check the baby's heartbeat on a monitor.` (태아 심박 감시는 주수에 따라 달라 조건이 맞음) / L3 `While we do that, we'll bring your sugar back into range.` / L4 `Keeping it in range protects you both.` / why도 맞게 고친다.
- **O12 · S14 L2** · 16단어 · → `With the interpreter here, let me show you each step.` (선택: L4 `That's exactly right`는 시연이 맞았다고 전제한다 — 대화의 끝이라 허용).
- **O13 · S15 L2·L4** · `Low potassium can cause that`이 L1 증상에 "예"를 전제한다. L4는 19단어다 · → L1 `Your potassium is low, so we'll correct it before more insulin.` / L2 `That can cause muscle weakness or cramping — have you noticed any?` / L3 `That same low potassium can upset your heart rhythm, so we're watching the monitor.` / L4 `Any change on that monitor will tell us right away.`
- **O14 · S16 L3·L4** · `That change is why we're checking…`이 L2 "예"를 전제하고, 신경 감시를 답에 묶는다(심각 4). L4 `keep him safe from it`은 어색한 영어다 · → L3 `Either way, we're checking his neurological status closely right now.` / L4 `While we check, the team is getting medicine ready in case he needs it.` (ISPAD: 뇌부종 치료제를 침상 곁에 준비).
- **O15 · S17 L3** · `Given those answers, her pressure is low` — 혈압은 가족의 답으로 아는 것이 아니고, 수액 소생을 답에 묶는다 · → L1 `Her pressure is low, so we're giving fluids quickly.` / L2 `While those run, how responsive has she been over the last hour?` / L3 `During that hour, did she open her eyes or respond to your voice?` / L4 `Her eyes and voice will tell us if the fluids are working.`
- **O16 · S18 L3·L4** · L3에 가리키는 말이 없어 2↔3이 약하게 열렸다(`It`이 L3의 glucose를 가리켜도 읽힘). L4 `if he still isn't waking`은 포도당 추가 기준을 깨어남에 둔다 — 추가 포도당은 혈당 재측정으로 정한다(18.4 why와도 어긋남) · → L3 `Because of that, we're checking for other causes like infection or stroke.` / L4 `We'll recheck his sugar often and give more if it drops again.`
- **O17 · S19 L3·L4** · `That spread is serious, so we're starting antibiotics`가 L2 "예"를 전제하고, 항생제를 답에 묶는다(심각 4). L4는 17단어다 · → L3 `Either way, this is serious, so we're starting antibiotics and fluids now.` / L4 `I'll give the surgical team an SBAR report on that right away.`
- **O18 · S20 L3** · `Together with that`은 `On top of that`과 같은 `Also`류이고, L2 "예"를 전제한다. 환자에게 `wide gap`도 S20 context가 가르치는 바로 그 실수다 · → L3 `I'm updating the doctor about that and your latest blood tests.` (`that` = L2의 답이 무엇이든).
- (선택)
  - S2 L4 `Given all of that, we'll check…` — 다뇨·다갈 주소 환자의 혈당·케톤 검사는 답과 관계없이 한다 → `To sort that out, we'll check your blood sugar and look for ketones.`
  - S7 2↔3 약하게 열림 — L3 뒤의 `That's normal`이 "질문이 있는 건 당연"으로도 읽힌다 → L4 `those answers`를 `those questions`로 바꾸면 영어도 자연스러워진다.

### context·swap (3)
- **C1 · S8 `dehydrated` 장면 1·2** · 두 장면에 `dehydration`만 있다(자기 보고 2) · → 장면 1 `Severe hyperglycemia; pt dehydrated, AMS. HHS suspected.` / 장면 2(XX) `She's in a hyperosmolar hyperglycemic state and profoundly dehydrated.` (fix·why 그대로).
- **C2 · S11 `sick` 장면 0(차트)** · `Pt sick with influenza x3 days`는 끼워 넣은 차트 문구다(자기 보고 2) · → base로 되돌림 `Intercurrent influenza with labile BG; sick-day plan reviewed.` (`sick-day`로 W14 통과). why에 `intercurrent illness`를 되살릴 필요는 없다(XX에 없음).
- **C3 · S19 `sepsis` fix·why** · fix가 sepsis를 빼서 "환자에게 sepsis라는 말을 쓰지 말라"로 읽힌다(자기 보고 2) · → fix `Your foot infection is spreading through your body — that's called sepsis — so surgery is coming now.` / why "necrotizing soft tissue infection은 의료진의 말이에요. sepsis는 환자에게도 쓰는 말이지만, 무슨 뜻인지 함께 풀어서 얼마나 심각한지와 누가 오는지를 알려요."
- (선택) S5 `breathing` 차트 → `Deep, rapid (Kussmaul) breathing; fruity breath odor.`

### tag·icon (0)
- 고칠 것 없음.

## 결정 11 — base 문장·단어 (v46에서는 고치지 않음, 따로 보고)
- **G1 · 15.5 ko** `모니터에 변화가 있으면 바로 알려드릴게요` — en `Any changes on the monitor will tell us right away`는 "모니터가 **우리에게** 바로 알려 준다"는 뜻이다(→ `모니터에 변화가 생기면 저희가 바로 알 수 있어요`).
- **G2 · 20.2 en** `Your labs still show a wide gap` — 환자에게 하는 말인데, S20 context가 바로 이 실수("Your anion gap is widening…")를 어색한 장면으로 가르친다. ko에도 `anion gap`이 영어로 남았다.
- **G3 · 14.3 en** `Can you show me back so I know you understand?` — `show me back`은 원어민이 잘 쓰지 않는다(→ `Can you show me how you'd do it, so I know it's clear?`). 청크 `back so I`도 구 경계를 끊었다.
- **G4 · 19.2 en** `Is the swelling and blackness spreading…` — 주어가 둘이라 `Are`가 맞다(구어에서는 들리지만 학습 문장으로는 고칠 것).
- **G5 · 청크** 4.5 `controlled helps`가 `your sugar controlled`를 끊었다(keyPhrase가 아니면 보고만).
- **G6 · 거의 같은 문장 쌍** 15.0·15.1(근육 약화·쥐), 17.2·17.3(혈압 낮아 수액 빠르게) — 한 상황 안에서 같은 말을 두 번 배운다.
- W13 3건(`shaken`·`confusing`·`scarred`)은 v45 단어 오답이라 이번 범위 밖이다.

## 종합
고칠 것 **56건**이다(why 6 · 빈칸 14 · decoy 4 · distractorsKo 11 · order 18 · context 3; 선택 항목과 결정 11은 따로).
정답이 둘인 빈칸은 없고, 빈칸 오답도 대부분 같은 분야에서 골라 앞 주제들보다 좋다. context 정비도 모양은 핸드오프와 맞는다. 다만 **오답으로 위험한 처치를 보이는 것 8곳**(빈칸 4·decoy 3·오답 뜻 1)과 **처치를 답에 묶거나 답을 전제한 order**(11장), 15단어를 넘는 줄 8장은 꼭 고쳐야 한다. 위를 반영하면 내보내도 된다.
