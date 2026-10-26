# fix-icu-cardiogenic-A — A 검토 (v45 1~7 + 기계적 전수 확인 + v46 7번·swap ko)

대상: `icu-cardiogenic.yaml` (단어 264 · 상황 21 · 문장 111 · 뉘앙스 42).
비교: `base-icu-cardiogenic.yaml`(뉘앙스 없음 — 뉘앙스는 전부 신규), `changes-icu-cardiogenic.yaml`, `in-icu-cardiogenic.json`, `notes-icu-cardiogenic-A.md`(B 메모는 없음).
기계 확인: 단어 전부 표, 문장 chunks 전부 `/` 연결, pair 전 결합, swap 전 선택지 연결, distractorsEn 품사, 비속어 부분 문자열 검색, 은행 안 같은 `ko` 검색, 고친 뒤 상황별 서로 다른 단어 수(V3) 재계산 — 모두 스크립트로.

## 항목별 점수
| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 품사가 다른 오답 29개(아래 표), 정답으로도 맞는 오답 3개(get↔grab, everything↔anything, off↔out), 동떨어진 오답 5개 |
| 2 | dKo·dEn 겹침·길이 | 3 | 길이는 전부 통과. 다른 뜻·근사 동의어 오답 5개(level 단계, sign 증상, most 대부분의, care 치료, injured 약해진) |
| 3 | cue | 3 | 정답 노출은 없음. `ko`를 되풀이하는 cue 12개 정도(small "크기가 작은", next "지금 다음에 오는" 등), alarm cue가 바뀐 헤드워드 품사와 어긋남 |
| 4 | chips/decoyChips | 4 | 자르기는 대체로 형태소 단위. 비속어·불쾌한 조각은 약하게 3개(dumb, fat, drunk) |
| 5 | 뉘앙스 사실 | 3 | 정맥 이뇨제를 "water pill"로 부르는 swap, 수혈 가능성 고지를 어색한 말로 처리한 context, 부종 등급 why가 부정확함 |
| 6 | 뉘앙스 설계 | 3 | pair 3개에서 정답 둘이 나오거나 동떨어진 decoy("a recipe"), choice context가 핸드오프 모양이 아님(뜻이 다름). 나머지 context 13개는 모양이 맞음 |
| 7 | 결정 11 | 3 | 저작자 변경은 타당. 놓친 것: 쉬운 단어(head는 공통 목록), 틀린 ko(pressure·short·grab·insertion·away), 은행 안 같은 ko 6쌍, 문장 오류 4개, 구 경계를 끊은 chunks 8개 |

## 사실 오류·심각한 문제
1. **[환자 안전] 심실빈맥·세동 동반 급변 문장 4** "Check for a pulse before we charge again." — ACLS는 쇼크 뒤 곧바로 CPR을 2분 하고 **리듬**을 확인합니다. 맥박 확인은 조직화된 리듬일 때만 합니다. 충전할 때마다 맥박부터 보라는 말은 압박 중단을 늘립니다. → S12
2. **[환자 안전·윤리] IABP 다리 허혈·출혈 감시 context(bleeding)** — 어색한 장면이 "may need a transfusion"을 환자에게 말하는 것인데, 수혈은 환자에게 알리고 동의를 받는 처치라 알리는 것 자체는 어색한 말이 아닙니다. 게다가 fix "There's a little blood…"는 같은 상황의 "dressing is soaked"(장면 1)를 줄여 말해 잘못된 안심이 됩니다. → N6
3. **[사실] 정맥 이뇨제 적정 swap(diuretic)** — 이 상황은 IV furosemide인데 정답이 "water pill"입니다. water pill은 먹는 이뇨제를 부르는 말이라 정맥 주사를 "pill"이라 하면 사실과 다릅니다. → N5
4. **[사실] 우심부전 동반 관리 문장 2** "…push his right heart further behind." — 임상 영어로 성립하지 않는 비유입니다(why도 "쉬운 비유"라고 정당화). → S10
5. **[사실·지킬 수 없는 말] 회복 불가 심부전 목표 전환 문장 1** "…the next day or two will tell us a lot." — 목표 전환 장면에서 간호사가 예후 시한을 정해 말합니다(저작자 메모 3 타당). → S15
6. **[설계] pair 정답 둘** — IABP 삽입: "work through a small opening", "watch through a small opening"이 성립합니다. 정맥 이뇨제: decoy "a heartbeat"가 "track a heartbeat"로 붙습니다. → N1·N3
7. **[문법] 수분 균형 문장 1** "…how much you drink today?" 시제 오류. → S5

---

## 고칠 것

### A. 문장 (keyPhrase 아님 · 결정 11) — `en`·`ko`·`chunks`를 바꾸면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 2개·`blank`·`tag`/`icon` 점검)도 새로 쓰고 `changes-icu-cardiogenic.yaml`에 적습니다

- **S1** 심인성 쇼크 초기 사정 · 문장 1 · chunks `right / now`가 "right now"를 끊음 → `["Your blood pressure", "is", "a little low", "right now", "."]` (v46 `decoy`·`blank`가 옛 청크를 전제하면 다시 봄)
- **S2** 12유도 심전도 신속 확보 · 문장 3 "placed exactly right" · 여기서 right는 "정확히 맞게"인데 `w-right`(ko 바로)가 붙어 있음 → `words`에서 `w-right` 빼기
- **S3** IABP 타이밍·증강 파형 확인 · 문장 4 "looks right after this change" · right는 "제대로"인데 `w-right`(바로)가 붙어 있음 → `words`에서 `w-right` 빼기
- **S4** 폐부종 체위·산소 협조 · 문장 5 · chunks `slow / , deep breaths`가 형용사 나열을 끊음 → `["Try to take", "slow, deep breaths", "for me", "."]` (v46 필드 다시 봄)
- **S5** 수분 균형·체중 모니터 · 문장 1 · 시제 오류 → en `Can you tell me exactly how much you've had to drink today?` / chunks `["Can you tell me", "exactly how much", "you've had to drink", "today", "?"]` / ko 그대로 / words 그대로. `w-drink`의 example도 이 문장으로 바꿈. 이 문장의 v46 필드를 새로 씀
- **S6** 말초 관류·모틀링 관찰 · 문장 3 · chunks `in both / your feet`가 전치사구를 끊음 → `["I'm also", "checking", "the pulses", "in both your feet", "."]` (v46 필드 다시 봄)
- **S7** 정맥 이뇨제 적정 · 문장 2 "Her urine output should pick up within the hour." — (1) chunks `within / the hour` 끊김 → `["Her urine output", "should pick up", "within the hour", "."]` (2) 저작자 메모 1은 en만 보면 타당하지 않음: 동료에게 하는 말이고, IV furosemide는 30분~1시간 안에 이뇨 반응을 보는 것이 표준 기대치라 should(기대)는 맞음. 다만 ko "늘어날 거예요"는 단정이라 should의 뜻과 다름 → ko `한 시간 안에 소변량이 늘어나야 해요`. **distractorsKo 2개를 새 ko에 맞춰 다시 쓰고** v46 필드를 다시 봄
- **S8** IABP 삽입 전 준비·설명 · 문장 3 · chunks `in / his groin` 끊김 → `["We'll", "place it", "through a small opening", "in his groin", "."]` (v46 필드 다시 봄)
- **S9** IABP 타이밍·증강 파형 확인 · 문장 1 · chunks `on / this cycle` 끊김 → `["The waveform", "looks", "a little early", "on this cycle", "."]` (v46 필드 다시 봄)
- **S10** 우심부전 동반 관리 · 문장 2 · 성립하지 않는 비유 → en `Too much fluid could push his right heart further into failure.` / ko `수분이 너무 많으면 우심부전이 더 심해질 수 있어요.` / chunks `["Too much fluid", "could push", "his right heart", "further into failure", "."]` / words `[w-fluid, w-push, w-heart, w-further]`. `w-behind`는 어느 문장도 태그하지 않게 되니 word-remove. `w-further`의 example·exKo도 이 문장으로. 이 문장의 v46 필드(why가 "further behind" 비유를 설명함, blank 정답 `further behind`)를 새로 씀. **order 2번 줄** "That's why too much fluid could push his right heart further behind."도 같이 바꿈(B 범위와 맞출 것)
- **S11** 불응성 심인성 쇼크 ECMO 고려 · 문장 1 · chunks `his pressure / up`이 구동사 held…up을 끊음 → `["Nothing we've tried", "has held", "his pressure up", "."]` (v46 필드 다시 봄)
- **S12** 심실빈맥·세동 동반 급변 · 문장 4 · **환자 안전**(위 1) → en `Check the rhythm before we charge again.` / ko `다시 충전하기 전에 리듬을 확인하세요.` / chunks `["Check the rhythm", "before we charge", "again", "."]` / words `[w-check, w-rhythm, w-charge]`(w-pulse 대신 w-rhythm — 은행에 있음). 이 문장의 v46 필드를 새로 씀
- **S13** 기계보조 중 급성 출혈 · 문장 1 · ko가 "흠뻑 젖었고 … 흠뻑 젖었어요"로 soaked와 saturated를 구별하지 못함 → ko `시트가 흠뻑 젖었고 드레싱도 포화됐어요.` **distractorsKo 2개를 새 ko에 맞춰 다시 씀**. (W9의 w-saturated ko와 짝)
- **S14** 기계보조 환자 이송 관리 · 문장 1 · chunks `All / the lines`가 명사구를 끊음 → `["All the lines", "need to be secured", "before transport", "."]` (8낱말·3조각, v46 필드 다시 봄)
- **S15** 회복 불가 심부전 목표 전환 · 문장 1 · 예후 시한을 단정함(저작자 메모 3 반영) → en `We're doing everything we can, and we'll keep you updated as we learn more.` / ko `저희가 할 수 있는 모든 걸 하고 있고, 새로 알게 되는 대로 계속 알려드릴게요.` / chunks `["We're doing everything", "we can", ", and we'll keep you updated", "as we learn more", "."]` / words `[w-everything, w-keep, w-update]`. `w-next`·`w-lot`는 태그가 없어지니 word-remove. `w-everything` example도 바꿈. 이 문장의 v46 필드(why가 "the next day or two"를 설명함)를 새로 씀. **order 2번 줄**도 같이 바꿈: `Even so, we're doing everything we can, and we'll keep you updated as we learn more.`

(고친 뒤 상황별 서로 다른 단어 수를 다시 셌습니다. 가장 적은 상황이 15개라 V3 통과합니다.)

선택(점수에 넣지 않음): 12유도 문장 1 `about ten minutes / ago`, 말초 문장 1 `from your knees / down`, 항응고 문장 1 `was a little / below target`도 구를 끊었습니다(→ `about ten minutes ago`, `from your knees down`, `a little below target` 3조각). 밀리논 문장 2 "His rhythm has been borderline"은 리듬에 borderline을 붙인 말이 어색하지만, slider와 order가 이 말을 바탕으로 짜여 있어 고치지 않았습니다.

### B. 단어 (결정 11)

- **W1** 쉬운 단어 태그 빼기·은행에서 지우기 — `w-head`(공통 쉬운 단어 목록에 있음. 폐부종 문장 1), `w-here`(심인성 5·회복 4), `w-more`(폐부종 1·밀리논 0·이탈 1), `w-large`·`w-small`(IABP 삽입 1·3), `w-eye`(우심 4. ko "주의(눈)"·dKo "무시(귀)"·"접촉(손)"도 부자연스러움). 그 문장들의 `words`에서 빼고 word-remove로 적음. S10·S15로 `w-behind`·`w-next`·`w-lot`도 word-remove. 다시 셌을 때 V3는 모든 상황에서 통과
- **W2** `w-away` — 헤드워드 away에 ko "즉시"는 틀렸고 `w-immediately`(즉시)와 ko가 같음. 쓰인 4문장이 모두 "right away"이고 그 문장들에 `w-right` 태그는 없음 → en `right away`, ipa `/ˌraɪt əˈweɪ/`, ko `곧바로`, chips `[[right], [a, way]]`, dEn `[far away, right back]`, dKo `[나중에, 멀리서]`, cue는 'right' 언급을 빼고 "보고·출력을 미루지 않고 지금 바로 하겠다고 할 때"로. example 그대로
- **W3** `w-pressure` ko "혈압" — "pulmonary pressures"(폐혈관 압력)와 "holding pressure"(압박)에도 이 태그가 붙어 있어 틀림 → ko `압력`, dKo `[맥박, 체온]` → `[유량, 온도]`
- **W4** `w-short` ko "짧은" — "short of breath"에서는 "모자란"의 뜻 → ko `모자란`, dKo `[긴, 얕은]` → `[넉넉한, 얕은]`
- **W5** `w-grab` ko "붙잡다" — "grab the crash cart" = 급히 가져오다 → ko `가져오다`, dKo `[놓다, 밀다]` → `[치우다, 돌려주다]`, cue 그대로
- **W6** `w-insertion` ko "삽입 부위" — "부위"는 `w-site`의 몫. dKo(제거·봉합)와도 품사가 맞지 않음 → ko `삽입`
- **W7** `w-confirm` ko가 `w-check`와 같은 "확인하다" → ko `대조 확인하다`(dKo 그대로)
- **W8** `w-run` ko가 `w-work`와 같은 "작동하다". "once it's running"은 드립이 들어가는 중이라는 뜻 → ko `주입되다`
- **W9** `w-saturated` ko가 `w-soaked`와 같은 "흠뻑 젖은"(같은 문장에 둘 다 있음) → ko `포화된`, dKo `[말라붙은, 건조한]`(둘이 같은 뜻) → `[마른, 깨끗한]`. S13과 짝
- **W10** `w-injured` ko가 `w-damaged`와 같은 "손상된". dKo "약해진"은 정답과 거의 같은 뜻 → ko `다친`, dKo `[건강한, 비대해진]`
- **W11** `w-further` ko "더"(`w-more`와 같음, cue도 ko 되풀이) → ko `한층 더`, cue `수분이 넘치면 우심부전이 지금보다 심해질 수 있다고 할 때`

### C. 단어 v45 필드

**정답으로도 맞는 오답·다른 뜻**
- **D1** `w-get` dEn `grab` — "grab a 12-lead"는 이 상황 tagline 그대로이고 `w-grab`이 은행에 있음 → `[gain, set]`
- **D2** `w-everything` dEn `anything` — "We're doing anything we can"도 같은 뜻으로 성립 → `[everyone, nothing]`
- **D3** `w-off` dEn `out` — "the timing is out"(어긋났다)도 영어로 성립 → `["on", up]`(on은 따옴표)
- **D4** `w-level` dKo `단계` — level의 다른 뜻 → `[방향, 부위]`
- **D5** `w-sign` dKo `증상` — "징후"와 거의 같은 뜻으로 읽힘 → `[진단, 원인]`
- **D6** `w-most` dKo `대부분의` — most의 다른 뜻 → `[가장 적은, 조금]`
- **D7** `w-care` dKo `치료` — "comfort-focused care" = 완화 치료로도 옮김 → `[검사, 수술]`

**장면과 동떨어지거나 불쾌한 오답**
- **D8** `w-circulation` dEn `circumcision` — 장면과 상관없고 생식기 시술이라 불편함 → `circumference`
- **D9** `w-inotrope` dEn `antelope`(동물) → `chronotrope` (`[isotope, chronotrope]`)
- **D10** `w-specialist` dEn `spiritualist`·`socialist`(분야 밖, 정치색) → `[specialty, spectator]`
- **D11** `w-titrate` dEn `titanic` — 품사도 다름 → `iterate` (표 6)
- **D12** `w-saturated` dEn `saturday` — 고유명사를 소문자로 씀, 품사도 다름 → `satiated` (표 22)

**distractorsEn 품사 다름 — 전부** (정답 품사 기준. 철자·소리가 닮아 버리기 아까운 말은 decoyChips로 옮기기를 권함)
| # | id | 정답(품사) | 품사 다른 오답 | 바꿀 말 |
|---|---|---|---|---|
| 1 | w-pressure | pressure (명) | pressing (동사-ing) | presence |
| 2 | w-low | low (형) | lose (동) | lone |
| 3 | w-hear | hear (동) | here (부) | bear — here는 decoyChips로 |
| 4 | w-heart | heart (명) | heard (동 과거) | hearth — decoyChips `hearth`→`heard` |
| 5 | w-bag | bag (명) | bad (형) | tag |
| 6 | w-titrate | titrate (동) | titanic (형) | iterate |
| 7 | w-response | response (명) | responsible (형) | resonance |
| 8 | w-chest | chest (명) | cheat (동) | crest |
| 9 | w-borderline | borderline (형) | baseline (명) | borderless |
| 10 | w-afterward | afterward (부) | afternoon (명) | onward |
| 11 | w-early | early (형) | easily (부) | eerie |
| 12 | w-delicate | delicate (형) | dedicate (동), delegate (명/동) | deliberate, desolate |
| 13 | w-together | together (부) | tougher (형) | however |
| 14 | w-console | console (명) | consume (동) | consort (consult는 병원 명사로 둠) |
| 15 | w-call | call (동) | coal (명), cell (명) | cull, coax |
| 16 | w-remove | remove (동) | remote (형/명) | revoke |
| 17 | w-despite | despite (전치사) | desktop (명) | beside (despise는 decoyChips로 옮길 수 있음) |
| 18 | w-activate | activate (동) | activity (명) | captivate |
| 19 | w-bedside | bedside (명) | besides (전치사/부) | bedsore |
| 20 | w-brief | brief (동) | brisk (형) | brace |
| 21 | w-clear | clear (동) | clever (형) | clamp |
| 22 | w-saturated | saturated (형) | saturday (고유명사) | satiated |
| 23 | w-move | move (동) | mood (명), mode (명) | mope, moan |
| 24 | w-way | way (명) | weigh (동) | wake |
| 25 | w-fit | fit (동) | fat (형/명) | fill (decoyChips `fat`도 `fist`로 — 아래 D16) |
| 26 | w-wrong | wrong (형) | wring (동), wrote (동) | strong, wry |
| 27 | w-choice | choice (명) | chose (동) | chore |
| 28 | w-diuretic | diuretic (명) | dietetic (형) | dietitian |
| 29 | w-alarm | alarm (동, ko 경보가 울리다) | album (명) | align |
(w-behind의 belong(동)은 W1·S10으로 단어를 지우므로 뺐습니다. 바꿀 말은 모두 길이 규칙 1.25배·3자 이내를 지킵니다.)

**cue**
- **D13** cue가 `ko`를 되풀이하거나 사전 뜻풀이만 함 → 장면 단서로 다시 씀:
  `w-right`("곁에 바로…" → "불안해하는 환자 곁을 떠나지 않겠다고 할 때"), `w-physician`("…의사를 격식 있게" → "심전도를 들고 가서 직접 보여 줄 상대"), `w-rate`("…속도 개념" → "도부타민 시작 뒤 모니터에서 1분 박동 수를 지켜볼 때"), `w-weight`("…몸의 무게" → "매일 아침 같은 저울로 재서 수분이 쌓였는지 보는 값"), `w-flow`("…양과 흐름" → "심근경색 뒤 손상된 심장과 저울질하는 혈관 속 피의 움직임"), `w-below`("…아래쪽에" → "ACT가 목표 하한에 못 미쳤다고 보고할 때"), `w-type`("…혈액형을 알아보는" → "수혈 전 cross와 짝으로 검사실에 보내는 검사"), `w-way`("…방식이나 모양" → "회복이 기대만큼 되지 않았다고 가족에게 말할 때"), `w-everything`("…모든 것을 가리킬 때" → "가족에게 최선을 다하고 있다고 말할 때"), `w-path`("…갈래의 길" → "환자에게 가장 중요한 것에 맞는 치료 방향을 가족과 찾을 때")
- **D14** `w-alarm` cue "…소리로 알리는 장치"가 명사 뜻풀이인데 헤드워드는 동사(경보가 울리다)로 바뀜 → "IABP 콘솔이 이상을 감지해 소리와 불빛을 내고 있을 때"

**decoyChips (비속어·불쾌한 조각)** — 욕설은 없습니다. 약하게 불편한 것만:
- **D15** `w-numb` decoyChips `dumb`(장애·비하어) → `numbs` 또는 `nub`
- **D16** `w-fit` decoyChips·dEn `fat`, `w-far` decoyChips `fat`(체형을 가리키는 말) → 각각 `fist`·`fan`
  (`w-drink` `drunk`·`w-inotrope` `tripe`·`w-afterward` `wart`·`w-cross` `crass`는 비속어가 아니라 그대로 두어도 됨 — 바꾸지 않음)

**dKo 분야**
- **D17** `w-balloon` dKo `[깃털, 바구니]`는 분야 밖이라 읽기만 해도 걸러짐 → `[카테터, 전극]`
- **D18** `w-upright` ko는 부사(똑바로)인데 dKo `[엎드린, 옆으로 누운]`은 관형형 → `[엎드려, 옆으로]`

### D. 뉘앙스

- **N1** IABP 삽입 전 준비·설명 · pair — `work + through a small opening`("we work through a small opening")과 `watch + through a small opening`이 성립해 정답이 둘입니다. decoy `a recipe`는 분야 밖이라 읽기만 해도 걸러집니다 → pairs `[[place it, in his groin], [work, with each heartbeat], [watch, the insertion site]]`, decoys `[a deep breath]`(전 결합을 확인함: place it with each heartbeat ✕, work in his groin ✕, watch with each heartbeat ✕, *a deep breath*는 셋 모두 ✕). why를 맞춰 고침
- **N2** 심실빈맥·세동 동반 급변 · pair — decoy `a recipe`가 분야 밖 → `a pulse`(call/resume/clear 어느 쪽에도 안 붙음). 참고: `clear + a code`(코드 해제)는 병원 말로 약하게 성립할 수 있음 — 저작자가 판단
- **N3** 정맥 이뇨제 적정 · pair — decoy `a heartbeat`가 "track a heartbeat"로 붙음 → `the hallway`(give/track 어느 쪽에도 안 붙음)
- **N4** 수분 균형·체중 모니터 · slider(swelling) — 단서 "양말 자국·발목이 부음"은 임상에서 mild로도 읽히고, why "mild는 거의 안 보이는 정도"는 틀렸습니다(경한 부종도 눈에 보임). 미국 병원은 pitting 1+~4+나 mild/moderate/severe를 씁니다 → scale `[mild swelling, moderate swelling, severe swelling]`, answerAt 1, cue `Pitting swelling up to mid-shin in both legs, but the thighs are fine.`, why를 "정강이 중간까지 눌린 자국이 남으면 moderate. mild는 발목 주변에 그칠 때, severe는 허벅지까지 퍼지거나 아주 깊게 들어갈 때"로
- **N5** 정맥 이뇨제 적정 · swap(diuretic) — **사실 오류**(위 3). → before `["This ", "diuretic", " in your IV will help you pee off the extra fluid."]`, options `[medicine, diuretic, natriuretic agent]`, answer `medicine`, notes의 medicine은 "환자가 바로 알아듣는 말. 먹는 이뇨제라면 water pill이라고도 하지만 이건 정맥 주사예요", why를 맞춰 고침, ko `수액 줄로 들어가는 이 약이 여분의 수분을 소변으로 빼 줄 거예요`
- **N6** IABP 다리 허혈·출혈 감시 · context(bleeding) — **안전·윤리**(위 2). 어색한 장면은 같은 사실을 임상어로 말한 곳이어야 함 → 장면 3 en `You're actively bleeding from the femoral access site.`, fix `There's some bleeding where the tube went in, so we're pressing on it and watching it closely.`, why `의료진끼리는 bleeding의 위치를 femoral access site처럼 정확히 말해요. 환자에게는 숨기지 않되, 어디서 피가 나는지와 지금 하는 조치를 쉬운 말로 전해요.`("a little"로 줄여 말하지 않음)
- **N7** 회복 불가 심부전 목표 전환 · context(choice) — 핸드오프 모양이 아닙니다. 장면 3 "You must make the choice … today"는 장면 1과 **뜻이 다른** 재촉이라 "같은 뜻, 안 맞는 듣는 사람"이 아님(장면 1·3이 모두 가족에게) → 장면 3 en `Your choice is between LVAD destination therapy and palliative withdrawal.`, fix `There's no wrong choice — we'll walk through each option with you.`, why `팀끼리는 선택지를 시술 이름으로 말하지만, 가족에게 LVAD·withdrawal 같은 말은 낯설고 차갑게 들려요. 재촉하지 않고 함께 살펴보겠다고 말해요.`
- **N8** 12유도 심전도 신속 확보 · context(tracing) fix — "The tracing shows your heart is under some strain"은 간호사가 환자에게 심전도를 해석해 주는 말입니다 → `The doctor is looking at your tracing now and will go over it with you.`(why의 "심장에 부담이 보인다" 문구도 맞춰 고침)
- **N9** 강심제 주입 준비 · swap ko "그가 어떻게 반응하는지 보면서 조금씩 조절할 거예요" — 번역투("그가") → `반응을 지켜보면서 약을 조금씩 조절할 거예요`

context 나머지 13개(report·short of breath·circulation·damaged·pump·timing·oxygenation·dose·circuit·pressure·line, tracing·bleeding 장면 1·2)는 `word`가 세 장면 `en`에 모두 있고, 어색한 장면은 듣는 사람(환자·가족)에게 임상어를 그대로 쓴 곳이라 TASK 9번 모양에 맞습니다. 나머지 swap ko 6개(swelling·arrhythmia·rupture·activate·shock, diuretic은 N5)는 바꾼 문장의 뜻과 맞습니다. swap 7개는 선택지마다 이어 읽어 봤는데 문법은 모두 맞습니다.

---

## keyPhrase — 사용자 결정 필요 (en을 고치지 않고 보고만 함)
- **K1** 기계보조 중 급성 출혈 · 문장 2 "Hold the heparin and get blood ready." — 저작자 메모 2. 헤파린 보류는 의사 지시나 ECMO·MCS 출혈 프로토콜이 있어야 하는 처치인데 문장만 보면 간호사가 혼자 결정하는 것처럼 읽힙니다. 문장은 팀 리더가 내리는 지시로 보면 성립합니다. 선택지: (a) 그대로 두고 v46 `why`에 "의사 지시·프로토콜에 따라"를 넣음 (b) keyPhrase를 고침. ko "헤파린을 보류하고 수혈을 준비해 주세요"는 맞습니다
- **K2** chunks가 구 경계를 끊은 keyPhrase(보고만 함):
  - IABP 다리 허혈·출혈 감시 문장 3 `for any / bleeding`
  - 회복 불가 심부전 목표 전환 문장 2 `or`(접속사 한 낱말 조각)
  - 폐부종 체위·산소 협조 문장 0 `to make breathing / easier`
  - 심실빈맥·세동 동반 급변 문장 0 `— start / compressions`
  - 기계보조 중 급성 출혈 문장 2 `and get / blood ready`
  - 기계보조 환자 이송 관리 문장 0 `the pump, drips / , and portable monitor`(나열이 조각 안팎으로 갈림)
- keyPhrase의 사실 오류나 ko 오류는 찾지 못했습니다.

## 저작자 메모 판정
- 메모 1(이뇨 "within the hour"): en은 유지하고 ko만 고침 → S7
- 메모 2(헤파린 보류): keyPhrase라 K1로 보고
- 메모 3("next day or two"): 타당 → S15
- 메모 4(context에 base에 없는 표현): base에 뉘앙스가 없어 문제 없음. short of breath·dose 모두 세 장면에 있음

## changes-icu-cardiogenic.yaml 판정
word-remove 13개(now·hand·doctor·nurse·minute·today·time·morning·hour·know·come·family·day)는 모두 공통 쉬운 단어 목록에 있어 타당합니다. 헤드워드를 원형으로 바꾼 것(overwork·fail·lower·slip·rupture·alarm·stop·call·stay·arrive·inotrope·compression·send·secure·recover·hope·fit·matter)도 타당합니다. 다만 alarm은 cue를 맞추지 않았습니다(D14). get·clear의 ko 수정도 타당합니다. 놓친 것은 W1~W11입니다.

## 종합
고칠 것 **80건**(문장 S 15 · 단어 W 11 · 단어 필드 D 18 중 품사 표와 겹치는 D11·D12를 뺀 16 · 품사 표 29 · 뉘앙스 N 9 — 품사 표는 한 줄을 1건으로 셈). 그중 **환자 안전 3건**(S12 · N6 · N5). 고치고 K1을 결정하면 내보내도 됩니다. 문장을 바꾼 S5·S7·S10·S12·S13·S15는 v46 필드(B 범위)를 새로 써야 하고, S10·S15는 order 줄도 같이 바꿔야 합니다.
