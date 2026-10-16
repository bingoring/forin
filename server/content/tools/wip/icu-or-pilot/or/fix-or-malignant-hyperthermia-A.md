# or-malignant-hyperthermia — A 검토 (v45 1~7 + 기계적 전수 + context 모양)

대상: `or-malignant-hyperthermia.yaml`(단어 182 · 상황 21 · 뉘앙스 43 = slider 14 · pair 8 · context 21, swap 0).
전수로 뽑아 본 것: 단어 182개 전 필드(길이 1.25배·3자 규칙은 전부 통과), 문장 105개 chunks, pair 8개 전 결합 72줄,
context 21개 세 장면의 `word` 포함 여부(21/21 포함), distractorsEn 품사. swap 문항은 없음.

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 소리·철자 닮은 오답은 좋으나 정답으로도 맞는 오답 2(`crises`·`rigidness`), 뜻이 겹치는 오답 3, 품사 다른 오답 약 27개 |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 전부 통과. 우스운 오답(`속삭여 전달하다`)·이름표가 이상한 오답 소수 |
| 3 | cue | 4 | 정답 노출 없음. `ko`를 되풀이한 것 1, 오해 부르는 표현 1 |
| 4 | chips | 4 | 대체로 형태소 단위. `read+y`(ready)·`col+ored` 정도만 어색(고칠 정도 아님) |
| 5 | 뉘앙스 사실 | 3 | MHAUS 핵심(유발약, EtCO2·교근 강직 조기 징후, 체온은 늦은 징후, 체중 기반 용량, 고칼륨 처치, 재발 감시)은 맞음. 단 dantrolene slider의 단서와 정답이 모순, 냉각 멈춤 시점 why가 지침과 어긋남 |
| 6 | 뉘앙스 설계 | 3 | slider 14개 중 13개 정답이 가운데(읽지 않고도 맞힘), 순서가 깨진 slider 1, pair 정답 둘 1, context `word`가 어색함의 원인이 아닌 것 1 |
| 7 | v44 정리(결정 11) | 3 | 변경 48건은 대체로 타당. 그러나 틀린 ko 1건(카트 점검 "유효기한도 지났어요"), 직역 ko 1건(`reconstitute` 재구성하다)과 부사 헤드워드 1건(`critical`)을 놓침. 사실이 아닌 수치 문장 1 |

## 사실 오류·심각한 문제

1. **`MH 카트 점검` 문장 2 `Everything's stocked and in date.` ko "유효기한도 지났어요"** — 뜻이 반대(만료)입니다. 응급 카트 점검 문장이라 안전 문제. (아래 결정 11-1)
2. **`dantrolene 위치 확인` slider — 단서와 정답이 모순.** cue가 "you haven't looked in this room today"인데 정답(answerAt 2)이 "It's on the MH cart — I checked it this morning." 확인하지 않은 응급약 위치를 "확인했다"고 말하라고 가르칩니다. why("직접 확인한 사실만 말해")와도 어긋남. (고칠 것 N-1)
3. **`dantrolene 위치 확인` 문장 3 "twelve vials"** — 판정: **사실과 맞지 않는 수치, 지울 것.** MHAUS 권장 비치량은 20 mg 제제(Dantrium·Revonto) 36 바이알 또는 250 mg 제제(Ryanodex) 3 바이알이어서 12는 어느 쪽에도 맞지 않고, 오히려 "열두 개면 충분"으로 읽힙니다. 숫자를 넣지 말고 "정량 전부"로 바꿉니다. keyPhrase 아님 → 문장 수정 가능. (결정 11-3)
4. **`급속 냉각 시행` pair why "목표 온도에 닿기 전에 멈춰야"** — MHAUS는 목표 체온(약 38°C)에 **이르면** 능동 냉각을 멈추라고 합니다. "닿기 전"은 너무 일찍 멈추라는 뜻으로 읽힘. 같은 상황 context 차트 장면("stopped at target")과도 어긋남. (고칠 것 N-3)

판정 요청 항목:
- **"체온은 늦게 오를 수 있다"(EtCO2 상승 조기 인지 slider why)** — 판정: **사실, 그대로 둠.** MHAUS도 고체온을 흔히 늦게 나타나는 징후로 설명합니다.
- **"call it" 숙어** — 판정: **태그 빼기 타당, 구 단위 새 단어는 만들지 않음.** 미국 병원에서 "I'm calling it"은 사망 선언·소생 중단 뜻으로 가장 흔히 들려서, 선언 숙어로 카드를 만들면 오해할 위험이 있습니다. 문장 15.3은 "— this is MH"가 바로 붙어 뜻이 분명하니 en은 둡니다. 다만 12.4 ko "콜하는 순간"은 뜻이 흐려서 고칩니다(결정 11-5).
- **slider "미룸 → 알맞은 대응 → 과잉" 순서** — 판정: **축으로는 브리프에 맞음(반응 세기가 약→강으로 한 방향), 그러나 설계 문제는 있음.** ① 브리프의 slider는 같은 뜻의 말을 온도로 나눈 강도 저울인데, 대부분이 서로 다른 행동 셋이라 임상 판단 문제가 됐고 ② 그 결과 14개 중 13개 정답이 가운데(answerAt 1)라 읽지 않고도 맞힙니다. ③ `냉각 물품 준비`는 셋째 칸이 과잉이 아니라 또 다른 미룸이라 축 자체가 깨졌습니다. (고칠 것 N-2·N-4)

MHAUS 대조 결과(이상 없음): 유발약 = 휘발성 마취 가스 + 석시닐콜린(유발 약물 인지 pair why), 원인 모를 EtCO2 상승·교근 강직 = 이른 징후, 단트롤렌 체중 기반·반응할 때까지 반복(수치 없음 — 좋음), 고칼륨 = 칼슘 먼저·인슐린+포도당·중탄산염, 산증 = 과호흡·중탄산염, 위기 후 단트롤렌 지속 + 재발 감시, 기화기는 "끄기"가 아니라 제거·사용 불가 처리(유발약 회피 마취 slider). MH 핫라인은 어디에도 언급이 없으나 오류는 아님.

## 고칠 것 — 뉘앙스·단어 재료 (v45)

**N-1** `dantrolene 위치 확인` · slider · 단서와 정답 모순 · cue를 "The anesthesiologist asks, \"Where's the dantrolene?\" You checked the MH cart in this room this morning."으로 바꿔 answerAt 2 유지(why 그대로 맞음). 또는 cue를 두고 정답을 "It should be on the MH cart — I'll go check right now."로 바꾸고 scale을 다시 짤 것. 앞쪽 권장.

**N-2** `냉각 물품 준비` · slider · 셋째 칸("We'll bring them after the temperature goes up.")이 첫째 칸과 같은 미룸이라 세기 순서가 깨짐 · 셋째 칸을 위험하지 않은 과잉으로: "Let's delay the case until we get a second cooling blanket." why 마지막에 "준비가 끝났는데 수술을 미룰 일도 아니에요" 한 문장 추가.

**N-3** `급속 냉각 시행` · pair why · "목표 온도에 닿기 전에 멈춰야 지나치게 식지 않아요" → "목표 체온(병원 프로토콜)에 이르면 능동 냉각을 멈춰요 — 계속하면 저체온으로 넘어가요(stop before we overshoot)."

**N-4** slider 전체 · 정답 위치 쏠림(13/14가 가운데) · 최소 4~5개를 정답이 양 끝에 오도록 바꿀 것. 같은 뜻 말의 세기로 다시 짜기 좋은 후보:
- `MH 위기 발동`: scale ["This could be MH.", "This looks like MH.", "This is malignant hyperthermia — I'm declaring it."], answerAt 2(마취과가 이미 MH로 판단했다는 cue와 맞음).
- `masseter 근강직 관찰`: scale [a little stiff, tight, rigid] + cue "jaw won't open at all after succinylcholine", answerAt 2.
- `체온 지속 감시`: cue를 "temp 0.1° 오르내림, 다른 수치 변화 없음"으로 바꾸고 answerAt 0(stable) — 지금 scale을 그대로 쓸 수 있음.
- `대사성 산증 교정`·`EtCO2 감시` 중 하나는 단서가 가벼운 쪽으로(answerAt 0).

**N-5** `masseter 근강직 관찰` · slider cue · "anesthesia says the jaw is unusually tight"인데 정답이 "Let's report it now" — 이미 안 사람에게 보고하는 셈 · cue를 "While you assist with intubation, you notice the jaw is unusually tight…"로.

**N-6** `위기 후 중환자 이송` · pair · "I'll walk the ICU team through **recrudescence**"(재발에 대해 설명하겠다)도 자연스러운 영어 → 정답 둘 · 짝을 ["I'll walk the ICU team", "through everything that happened"]로 나눠 왼쪽이 다른 오른쪽에 붙지 않게.

**N-7** `고칼륨 부정맥 대응` · context · 어색한 장면의 원인이 `protect`가 아니라 "calcium"·"potassium surge"임("protect his heart"는 보호자에게도 쉬운 말). TASK 9 모양이 아님 · `word`를 `protocol`(ko 프로토콜, words [w-protocol])로 바꾸고 장면을: 마취과→팀 "Bicarb per protocol — push calcium first." ✓ / 위기 기록 "Hyperkalemia treated per protocol: calcium, insulin with glucose, bicarbonate." ✓ / 대기실 보호자에게 "We're managing his hyperkalemia per protocol." ✕, fix "We're following a well-tested plan to bring his blood salts back to normal." why도 protocol에 맞춰 다시.

(같은 모양, 판단 요청: `위기 후 중환자 이송` context `stable`은 어색함이 "hemodynamically·post-MH·out of danger"에 있고, `급속 냉각 시행` context `overshoot`의 ✕ 장면은 보호자에게도 거의 통함 — N-7처럼 word가 어색함의 원인인지 다시 볼 것.)

**N-8** `MH 감수성 환자 준비` · context 첫 장면 "Known MH risk in this room" — 위험은 방이 아니라 환자 · "Known MH risk for this patient — please plan a trigger-free anesthetic."

**N-9** distractorsEn — 정답으로도 맞거나 뜻이 겹치는 오답:
- `w-crisis` `crises`(같은 단어의 복수형) → `critic`
- `w-rigidity` `rigidness`(동의어) → `humidity`
- `w-rigid` `rigor`(명사이고 뜻도 '경직') → `frigid`
- `w-avoid` `avert`(피하다·막다, 뜻 겹침) → `avail`
- `w-alert` `alarm`(경보하다, 뜻 겹침) → `alter`
- `w-handoff` `hand-on`(없는 말) → `standoff`

**N-10** distractorsEn 품사 불일치(정답 품사 → 바꿀 오답 → 제안): agent(명) urgent→`agency` · vial(명) vital→`dial` · low(형) loan→`lone` · inventory(동) invoice·interval→`invent`·`interview` · sterile(형) steroid→`senile` · probe(명) prove·prone→`robe`·`globe` · temperature(명) temporal→`temperament` · fever(명) fewer→`fervor` · call(동) cell→`cull` · closely(부) closet→`clearly` · sign(명) sing→`sigh` · climb(동) climate→`clamp` · tell(동) tall·tent→`toll`·`sell` · abnormal(형) anomaly→`abysmal` · think(동) thin→`sink` · heart(명) heard→`heat` · rate(명) rare·rave→`race`·`rage` · add(동) odd→`nod` · known(형) knock→`grown` · safe(형) save→`sane` · remove(동) remote→`revoke` · urine(명) urgent→`urinal` · dark(형) dart·dash→`damp`·`stark` · help(명) held·heal→`helm`·`heap` · full(형) fool→`foul` · happen(동) happy→`hamper` · fast(부) fact→`past` · wave(명) wove→`wake` · surface(명) suffice→`surplus` · flush(동) fresh→`flick` · stable(형) stage→`stale`. (despite는 전치사라 그대로 둠.)

**N-11** distractorsKo · `w-call` "조용히 기록하다"·"속삭여 전달하다"는 읽기만 해도 걸러짐 → "기록해 두다"·"문자로 보내다". `w-bicarb` "이산화탄소(약칭)"은 약칭이 아닌 말에 붙인 이름표 → "탄산가스(약칭)"·"탄산칼슘(약칭)"처럼 하나만 약칭 꼴로, 또는 "중탄산칼륨"·"탄산칼슘".

**N-12** cue · `w-hyperkalemia` "혈액 속 칼륨이 너무 높아…"는 ko 되풀이 → "MH에서 근육이 깨지며 생기는 전해질 이상 — T파가 뾰족해지는 원인". `w-calcium` "심장 막"은 심막(pericardium)으로 읽힘 → "심근 세포막".

## 고칠 것 — 결정 11 (v44 단어·문장)

**11-1** `MH 카트 점검` 문장 2 `Everything's stocked and in date.`(keyPhrase — en은 그대로, ko만) · ko "전부 구비되어 있고 유효기한도 지났어요" → **"전부 구비되어 있고 유효기한도 남아 있어요."** 함께 고칠 것:
- 그 문장의 `distractorsKo` 둘을 새 ko 틀로 다시: "전부 구비되어 있고 라벨도 붙어 있어요." / "전부 청소되어 있고 유효기한도 남아 있어요."(지금 둘째 오답 "…유효기한도 지났어요"는 만료 물품을 괜찮다고 읽히게 하므로 반드시 교체)
- 그 문장의 `why`는 이미 "in date는 유효기한 안"이라 맞음 — 새 ko와 맞는지만 확인
- 이 문장을 예문으로 쓰는 단어 `w-stock`·`w-date`의 `exKo`를 같은 새 ko로
- changes 파일에 `{kind: sentence, situation: "MH 카트 점검", index: 2, fields: [ko]}`·`{kind: word, id: w-stock/w-date, …}`(exKo는 v45 필드라 V16 대상인지 확인) 기록

**11-2** `w-reconstitute` · ko "재구성하다"는 약 설명서식 직역이라 간호사가 쓰는 말이 아님(틀린 뜻까지는 아님) → **"(가루약을) 녹여 조제하다"**; distractorsKo → "(가루약을) 나눠 담다"·"(가루약을) 계량하다"; exKo "모두 손을 보태 지금 단트롤렌을 녹여 조제합니다." 문장 `dantrolene 혼합 투여` 0(keyPhrase — ko만) ko도 같은 말로, 그 문장 distractorsKo 둘("둘이…"·"간호사만…")도 새 ko 틀로 다시 쓰기. changes에 word ko·sentence ko 기록.

**11-3** `dantrolene 위치 확인` 문장 3(keyPhrase 아님) · "twelve vials" 삭제 · en → "This room's MH cart is stocked with a full supply of dantrolene." / ko "이 방 MH 카트에 단트롤렌이 정량 전부 구비돼 있어요." / chunks `This room's MH cart / is stocked / with a full supply / of dantrolene / .` / words [w-cart, w-stock, w-dantrolene](vial 태그는 문장 1에 남아 상황 단어 수 유지 — 다시 셀 것). 이 문장을 예문으로 쓰는 `w-cart` example·exKo도 교체. B 필드(blank·decoy·distractorsKo·order 줄)도 새 문장으로 다시 써야 함 — B 검토와 맞출 것.

**11-4** `w-critical` · 헤드워드가 형용사인데 문장(고칼륨 부정맥 대응 0)은 `critically` → 헤드워드를 부사로: en `critically`, ipa /ˈkrɪtɪkli/, ko "위험할 만큼", cue "수치가 생명이 위험할 정도로 벗어났다고 강조할 때 (부사)", distractorsEn [chronically, cynically], distractorsKo [만성적으로, 가볍게], chips [[crit, i, cal, ly]]. id는 그대로.

**11-5** `냉각 물품 준비` 문장 4 · ko "콜하는 순간" → "MH로 선언하는 순간"(문장 ko: "전부 배치되어 있어서 MH로 선언하는 순간 바로 식힐 수 있어요."). distractorsKo 둘도 새 틀로.

**11-6** `고칼륨 부정맥 대응` 문장 0(keyPhrase — ko만) · "위중하게 높아요"는 어색 → "칼륨 수치가 위험할 만큼 높아요." distractorsKo 둘(혈당·나트륨)도 새 틀로.

**11-7** `MH 감수성 환자 준비` 문장 2(keyPhrase — ko만) · "안전한 손에 맡겨져 있어요"는 직역 → "믿고 맡기셔도 돼요 — 저희가 이 상황에 대비해 왔어요." distractorsKo 둘, `w-safe`·`w-prepare` exKo도 맞출 것.

**11-8** `MH 위기 발동` 문장 4 · ko "손을 더 불러 주세요" → "일손을 더 불러 주세요"(distractorsKo 둘도 같은 틀로). en은 자연스러우니 그대로. (참고: 이 문장의 why가 "누구에게 시키는지 정하지 않으면 서로 미룬다"며 문장을 나쁜 예처럼 설명함 — why는 B 몫.)

**11-9** chunks(v44 필드, keyPhrase 아닌 문장만 — changes에 `fields: [chunks]`로 기록) · 구를 끊은 조각:
- MH 가족력 선별 3 `about your family's / medical history` → `about your family's medical history`
- 체온 지속 감시 4 `, but we're staying / on top of it` → `, but / we're staying on top of it`
- EtCO2 감시 3 `for the last / few minutes` → `for the last few minutes`
- masseter 4 `it's an MH / warning sign` → `in case / it's an MH warning sign`
- 빈맥·부정맥 3 `in the last / two minutes` → `in the last two minutes`
- 빈맥·부정맥 4 `If the rhythm turns / unstable` → `If the rhythm turns unstable`
- 미오글로빈뇨 3 `over the last / hour` → `over the last hour`
(chunks를 바꾸면 그 문장의 B 필드 — decoy·blank — 가 조각에 맞는지 B 쪽도 다시 확인)

변경 목록(changes 48건) 판정: 쉬운 말 13개 제거·태그 4곳(monitor·pack·call 2)·ko 10건 모두 타당. 다만 `need`·`get`·`high`를 뺀 기준이면 `think`·`happen`·`add`·`start`·`stop`·`help`·`heart`·`blood`도 같은 수준입니다. 확실하지 않아 고칠 것에는 넣지 않습니다(상황당 8개 조건 때문에 빼려면 대체 단어가 필요).

## keyPhrase 문장 — 사용자 결정 필요 (en은 고치지 않음)

1. `유발약 회피 마취` 1 "The machine is flushed and the vaporizers are **off**." — 같은 상황 slider가 "꺼 둔 것은 제거·사용 불가와 다르다"(MHAUS와 일치)고 가르치는데 keyPhrase는 "off"로 끝남. tagline도 "vaporizers removed". → "…the vaporizers are **removed**."로 바꿀지 결정 필요.
2. chunks가 구를 끊은 keyPhrase 문장(보고만): 유발 약물 인지 2 `are off / the machine` · 체온 지속 감시 0 `is in / place` · EtCO2 감시 1 `the first / MH sign` · masseter 1 `an early / MH sign` · 대사성 산증 확인 2 `into the crisis / assessment` · MH 감수성 환자 준비 0 `Because of your / MH history`, 2 `— we've / prepared` · 유발약 회피 마취 0 `a trigger-free / anesthetic` · 고칼륨 감시 2 `for peaked / T waves` · MH 위기 발동 1 `and call / for help now`, 2 `Stop all / triggering agents` · dantrolene 혼합 투여 2 `a lot / of vials`.
3. (참고) ko만 고치는 keyPhrase 문장 4건은 결정 11 범위로 위에 넣었음: 카트 점검 2, 혼합 투여 0, 고칼륨 부정맥 대응 0, 감수성 환자 준비 2.

## 종합

고칠 것: 뉘앙스·재료 12항목(N-9·N-10은 묶음으로 오답 약 38개) + 결정 11 9건(11-9는 chunks 7문장 묶음). 사실 문제 4건(특히 "유효기한도 지났어요", dantrolene slider 모순, twelve vials)은 반드시 고친 뒤 내보낼 것. 고치고 나면 내보내도 됩니다. keyPhrase 1건(vaporizers off)은 사용자 결정.
