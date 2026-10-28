# icu-raised-icp — A 검토 (v45 1~7 + 기계적 전수 확인 + context 핸드오프 모양·swap ko)

대상: `icu-raised-icp.yaml`(A·B 합친 파일, `icu-raised-icp.pre-fix.yaml`과 같음). 비교: base, changes(150건), in-…json, notes-A·B.
단어 299개·문장 105개(21상황)·뉘앙스 43문항(pair 7·slider 14·swap 15·context 7)을 스크립트(`rev_icu-raised-icp_A.py`, `rev_icu-raised-icp_A_len.py`)로 전부 뽑아 표로 놓고 판정했습니다
(pair 7문항 전 조합, chunks 전부, swap 이어 읽기 전부, distractorsEn 품사 전부, decoyChips 474개 전부, context 세 장면 `word` 포함 여부, 길이 규칙 1.25배·3자, cue에 ko가 되풀이되는지).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 3 | 철자·소리는 대체로 닮았지만 품사가 다른 오답이 많음(둘 다 품사가 다른 것 23개). 정답으로도 맞는 오답 2개(probability·insure), 없는 말 1개(cuckle) |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 위반 0건. 정답의 다른 뜻이 오답이 된 것 3개(기부금·경련·처방받다) |
| 3 | cue | 3 | 정답 노출은 없음. 그러나 cue 53개가 ko를 그대로 되풀이(w-best "가장 좋은" = ko, w-otherwise "그렇지 않다면, 달리") — 장면이 떠오르지 않음 |
| 4 | chips/decoyChips | 4 | 형태소 분절은 대체로 좋음. 술 `gin`, 무기 `gun`, 영아 사망 `SIDS`, 정답 조각 `cock`(stopcock) |
| 5 | 뉘앙스·문장 사실 정확성 | 3 | 과호흡이 "몇 분만 듣는다", 뇌사 판정 "두 번의 검사"를 일반 원칙처럼, 신경 ICU가 AVPU로 적는다는 why, 장기기증을 간호사가 꺼내는 문장, 승압제 → 수액 순서 |
| 6 | 뉘앙스 설계 | 3 | pair 7문항 중 4문항에 다른 정답 조합. slider 6문항 순서 오류(강→약이거나 같은 뜻 두 개). swap 4문항 문법·되풀이. context 2문항은 말투가 아니라 내용(과장)이 어색함 |
| 7 | 결정 11(v44 단어·문장) | 4 | 삭제 36개는 과하지 않음(아래 판정). 바꾼 ko 중 enough '넉넉한'·order 품사는 흠, 숫자 thirty·twenty가 남음 |

## 저작자 A의 변경 판정 (단어 54개 수정·36개 삭제, 문장 60건은 태그만)

**결정 11 수정 폭은 과하지 않습니다. 되돌릴 것은 없습니다.**
- 삭제 36개(hand·head·neck·ear·eye·help·time·minute·now·more·very·…)는 모두 간호사가 이미 아는 말이고, 335개 중 약 1할입니다.
  삭제 뒤에도 모든 상황에서 서로 다른 단어 16개 이상(V3 8개 이상)입니다. `neck`·`ear`는 신경 ICU에서 중요한 부위지만 낱말 자체는
  쉬운 말이라 빼는 것이 맞습니다(문장에서 그대로 들림).
- 수정 54개 중 약 30개는 활용형·복수형을 원형으로 바꾼 것으로 결정 11 범위입니다. ko를 가른 것(check↔confirm, update↔notify, soft↔gentle,
  med↔medicine, stat↔immediately, ongoing↔continuous)도 근거가 있습니다. `얕추다` → `얕게 하다`(w-lighten)는 옳습니다.
- **흠(고칠 것 W):** w-enough '넉넉한'은 enough 뜻이 아님(W3), w-order '처방하다'는 16.2 "without an order"(명사)와 cue(명사)에 안 맞음(W5),
  w-level '수평'은 cue가 동사(W9). w-medical '의학적인'은 원래 ko 그대로인데 "medical therapy"(수술이 아닌 내과적 치료)와 맞지 않습니다(W1).
- 남은 쉬운 말: 숫자 `thirty`·`twenty`는 공통 목록의 `zero`·`ten`과 같은 부류라 빼야 합니다(W4). `out`·`well`·`back`·`next`·`stop`·`try`·`once`는 선택.

## 저작자가 짚은 문장 판정

| 문장 | 판정 |
|---|---|
| 14.0 KP ko "얕춰서" | **타당 — ko 고침(K1)**. "낮춰서"보다 단어 ko(얕게 하다)와 맞춰 "얕게 해서" |
| 15.0 KP 고장액·과호흡을 바로 (동료에게) | **타당 — en은 사용자 결정(바꿈 권고)**. 'means herniation'은 단정이고(15.1은 "until proven otherwise"), 처방·프로토콜 단서 없이 동료에게 지시합니다. 과호흡은 일시적 구제 수단 |
| 15.3 KP EVD를 바로 배액 | **부분 타당 — 사용자 결정(가볍게 바꿈 권고)**. 뇌탈출 때 EVD를 열어 배액하는 것은 프로토콜이 허용하는 간호 행동이지만, 6.4 KP처럼 "per parameters"를 붙이는 것이 일관됩니다 |
| 18.3 KP 항응고 역전을 간호사가 | **허용 — 유지 권고**. "per protocol"이 이미 있고, 역전제(PCC 등)는 처방·프로토콜에 따라 간호사가 투여합니다. 원하면 I'm → We're |
| 6.3 만니톨 요청 (KP 아님) | **타당 — 고침(S2)**. en "so call for mannitol"은 명령문인데 ko는 "요청할게요"(1인칭)로 어긋나고, 누구에게 요청하는지 없습니다. 담당 의사에게 연락한다고 분명히 |
| 17.3 KP ko "신경외과를 침상 곁으로 데려올게요" | **타당 — ko 고침(K2)**. 과(科)를 데려오는 말이 어색함 → "신경외과 의사를 … 불러올게요". w-get ko도 함께(W7) |
| 2.1 KP 영점을 "귀"로만 | **유지 권고 — 사용자 결정 목록에 기록**. 가족에게 하는 설명이라 "귀" 정도가 맞고, S2 slider why가 이미 "기준점은 병원 프로토콜에 따라, 보통 귀 부근"이라고 단서를 답니다(이주·외이도 ≈ 몬로공) |
| 17.4 가족 합류 (KP 아님) | **en 허용, ko 고침(S9)**. 동료에게 "가족에게도 알리자"는 말은 간호 범위 안. 수술 설명·동의는 외과의 몫이라는 점은 새 v46 why에 쓰세요. ko "합류시키세요"는 어색 |
| 20.4 장기기증 대화 (KP 아님) | **타당, 안전·규정 — 고침(S12)**. 미국은 CMS 규정(42 CFR 482.45)상 기증 요청을 장기구득기관(OPO) 담당자나 지정 요청자가 합니다. 병상 간호사가 "우리가 기증 이야기를 할 수 있다"고 꺼내면 안 됨 |
| B 메모 6.1·8.4·16.2·9.4·15.0·14.4·13.2·10.1·19.4 | v46 판단은 B 몫. A 범위에서 8.4(S3)·10.1(S5)·14.4(S7)·19.4(S10)는 문장 자체를 고칩니다 |

## 사실 오류·심각한 문제

1. **8.4 "If it's blocked, don't flush, reposition and reassess first."** — 쉼표 나열이라 "플러시·재위치·재평가를 하지 말라"로도 읽히고, reposition이 무엇(카테터? 환자?)인지 없으며, 신경외과 보고가 빠졌습니다(안전, S3).
2. **20.4 장기기증** — 간호사가 기증 대화를 시작하겠다는 말(미국 규정 위반 소지, 안전·윤리, S12).
3. **10.1 "This only works for a few minutes"** — 틀림. 과호흡의 뇌압 저하 효과는 몇 시간 가다가 6~24시간에 걸쳐 약해집니다. 짧게만 쓰는 이유는 효과가 몇 분이라서가 아니라 오래 쓰면 뇌허혈 위험 때문(S5, S10 slider cue N12·swap N13도 같은 말).
4. **20.1·S20 slider "two separate exams"** — 미국 성인 뇌사 판정은 2023 AAN/AAP/CNS/SCCM 지침에서 한 번의 검사가 기본(소아는 두 번, 병원 규정에 따라 두 번인 곳도 있음). 일반 원칙처럼 가르치면 틀림(S11, N11).
5. **9.1 "If pressor alone isn't enough, we add fluid too."** — 순서가 반대. CPP 유지는 정상 혈량을 먼저 맞추고 그래도 낮으면 승압제(9.2 KP "ensure he's adequately filled before increasing the drip"와도 모순, S4).
6. **S0 slider why "신경 ICU에서는 의식 수준을 흔히 AVPU로 적어요"** — 신경 ICU는 GCS(또는 FOUR)로 적습니다. AVPU는 빠른 선별용(N1).
7. **KP 16.4 과배액 대응** — "reposition and reassess"만 있고 잠그기(clamp)·신경외과 보고가 빠짐(사용자 결정, 바꿈 권고).
8. **KP 15.0** — 처방·프로토콜 없이 동료에게 고장액·과호흡 지시, 'means herniation' 단정(사용자 결정, 바꿈 권고).

## 고칠 것

문장 en을 고치면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 둘·`blank`·`tag`·`icon`)를 새 문장에 맞춰 **새로 쓰고**,
그 문장을 `example`로 쓰는 단어의 `example`·`exKo`도 새 문장으로 바꿉니다. 문장 ko만 고친 경우도 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓰고
그 문장을 example로 쓰는 단어의 `exKo`를 바꿉니다. 바꾼 것은 전부 `changes-icu-raised-icp.yaml`에 적습니다.

### 문장 (KP 아님 — en·ko·chunks 고침)

- **S1 [자연스러움] 진정·통증 관리 협조 #1** · "A quiet cough"는 어색함(기침 소리 크기와 뇌압은 상관없음) →
  en `Even a small cough or a startle can spike his pressure.`
  ko `작은 기침이나 깜짝 놀라는 것만으로도 압력이 급상승할 수 있어요.`
  chunks `["Even a small cough", "or a startle", "can spike", "his pressure", "."]`
  words `[w-cough, w-startle, w-spike, w-pressure]` — w-quiet 태그 뺌(5.0이 계속 씀; w-quiet `example`·`exKo`를 5.0 문장으로). v46 새로(현재 blank `cough` 유지 가능). w-cough·w-startle example 갱신.
- **S2 [업무 범위] ICP 상승 단계별 중재 #3** · 명령문 en ↔ 1인칭 ko, 누구에게 요청하는지 없음 →
  en `No change after position and sedation, so I'll call the provider about mannitol.`
  ko `체위와 진정 후에도 변화가 없어서 만니톨에 대해 담당 의사에게 연락할게요.`
  chunks `["No change", "after position and sedation", ", so I'll call", "the provider", "about mannitol", "."]`
  words 그대로. v46 새로. w-call·w-mannitol example 갱신.
- **S3 [안전] EVD 배액량·파형 관리 #4** · 위 심각 1 →
  en `If it's blocked, don't flush it — reposition him and reassess first, then call neurosurgery.`
  ko `막혔다면 플러싱하지 말고, 먼저 환자 자세를 다시 잡아 재평가한 뒤 신경외과에 연락하세요.`
  chunks `["If it's blocked", ", don't flush it", "— reposition him", "and reassess first", ", then call neurosurgery", "."]`
  words `[w-block, w-flush, w-reposition, w-reassess, w-first, w-call, w-neurosurgery]`. v46 새로(현재 distractorsKo 둘 다 다시). w-flush·w-reposition·w-reassess example 갱신.
- **S4 [관행] CPP 목표 승압·수액 유지 #1** · 위 심각 5 →
  en `If fluid alone isn't enough, the team may add a pressor.`
  ko `수액만으로 충분하지 않으면 팀이 승압제를 추가할 수 있어요.`
  chunks `["If fluid alone", "isn't enough", ", the team may add", "a pressor", "."]`
  words `[w-fluid, w-alone, w-may, w-add, w-pressor]` — w-enough 태그 뺌(W3). v46 새로(blank `enough`는 태그가 빠지므로 `alone` 등으로). w-alone·w-add example 갱신.
- **S5 [사실] 과호흡 일시 사용 이해 #1** · 위 심각 3, chunk ", not as ongoing / therapy"가 형용사+명사를 끊음 →
  en `This only works as a short-term fix, not as ongoing therapy.`
  ko `잠깐 쓰는 응급 조치일 뿐, 지속적인 요법은 아니에요.`
  chunks `["This only works", "as a short-term fix", ", not as", "ongoing therapy", "."]`
  words 그대로(w-work·w-ongoing·w-therapy). v46 새로(현재 distractorsKo '몇 분 동안만'도 삭제). w-ongoing example 갱신.
- **S6 [ko] 이송·검사 중 ICP 관리 #1** · en은 명령문("Sedate him")인데 ko는 "진정시킬게요" →
  ko `CT로 가기 전에 조금 더 깊게 진정시켜 주세요.` (en·chunks 그대로). distractorsKo 둘 새 ko에 맞춰, w-sedate·w-deeper·w-ct exKo 갱신.
- **S7 [관행] 진정 중단과 신경검사 균형 #4** · 깨우는 동안 잠깐 치솟는 것은 흔함. 중단 기준은 지속 상승·프로토콜 →
  en `If ICP climbs past twenty and stays there, stop and re-sedate per protocol.`
  ko `ICP가 이십을 넘어 그대로 머무르면 멈추고 프로토콜에 따라 다시 진정시키세요.`
  chunks `["If ICP climbs past twenty", "and stays there", ", stop", "and re-sedate", "per protocol", "."]`
  words `[w-icp, w-climb, w-past, w-stay, w-stop, w-sedate, w-per, w-protocol]` — w-twenty 태그 뺌(W4). v46 새로(blank `twenty`는 숫자 오답 묶음이라 다른 말로). w-past·w-stop example 갱신.
- **S8 [안전·명료] EVD 막힘·과배액 위기 #3** · "repositioning"이 카테터를 옮기라는 말로도 읽힘 →
  en `Try repositioning his head once before you call it truly blocked.`
  ko `정말 막혔다고 판단하기 전에 환자 머리 위치를 한 번 바꿔 보세요.`
  chunks `["Try repositioning", "his head", "once", "before you call it", "truly blocked", "."]`
  words 그대로. v46 새로. w-try·w-once·w-truly example 갱신.
- **S9 [ko] ICP 급상승 불응 위기 #4** · en 허용(위 판정), ko "합류시키세요" 어색 →
  ko `수술 가능성이 현실이 됐으니 가족에게도 상황을 알려 주세요.` (en·chunks 그대로). distractorsKo 둘('약사도 합류시키세요' 등) 새 ko에 맞춰,
  v46 why에 "수술 설명과 동의는 외과의 몫, 간호사는 가족이 그 대화에 함께하도록 연락"을 담기. w-loop·w-real·w-possibility exKo 갱신. W8과 함께.
- **S10 [업무 범위] 요붕증·SIADH 급변 관리 #4** · 수분 제한·보충은 처방 사항인데 동료에게 단독 지시 →
  en `Per orders, we restrict free water if it's SIADH, or replace losses if it's DI.`
  ko `처방에 따라 SIADH면 수분을 제한하고, 요붕증이면 손실량을 보충해요.`
  chunks `["Per orders", ", we restrict free water", "if it's SIADH", ", or replace losses", "if it's DI", "."]`
  words `[w-per, w-order, w-restrict, w-siadh, w-replace, w-loss, w-di]` — w-free 태그 뺌(W2). v46 새로. w-restrict·w-replace·w-loss example 갱신.
- **S11 [사실] 뇌사 진행 인지·검사 연계 #1** · 위 심각 4 →
  en `This isn't a final diagnosis yet — we're still waiting for the formal exams.`
  ko `아직 최종 진단은 아니고, 공식적인 검사를 아직 기다리고 있어요.`
  chunks `["This isn't a final diagnosis", "yet", "— we're still waiting", "for the formal exams", "."]`
  words `[w-final, w-diagnosis, w-wait, w-formal, w-exam]` — w-separate는 이 문장에서만 쓰여 word-remove(S20은 서로 다른 단어 21개). v46 새로(blank `separate` 바꿈). w-final·w-diagnosis·w-wait example 갱신.
- **S12 [안전·규정] 뇌사 진행 인지·검사 연계 #4** · 위 심각 2 →
  en `When you're ready, a specialist can talk with you about organ donation, but there's no rush.`
  ko `준비되시면 전문 담당자가 장기기증에 대해 말씀드릴 수 있어요, 서두르실 필요는 없어요.`
  chunks `["When you're ready", ", a specialist can talk with you", "about organ donation", ", but there's no rush", "."]`
  words 그대로. v46 새로(why: 미국은 기증 이야기를 OPO 담당자·지정 요청자가 꺼내도록 정해 두었고, 간호사는 연결만 한다). w-organ·w-donation·w-rush example 갱신.
- **S13 (선택) ICP 급상승 불응 위기 #1** · chunk "surgery may be / next" → `["We've optimized", "everything medical;", "surgery may be next", "."]` (en·ko 그대로).

### keyPhrase 문장 — ko만 고침 (en은 아래 '사용자 결정')

- **K1 진정 중단과 신경검사 균형 #0** · 오타 "얕춰서" → ko `잠깐 진정을 얕게 해서 신경학적 상태를 사정할게요.`
  distractorsKo 다시(현재 둘 다 '얕추려고/얕춘'): 예) `잠깐 진정을 얕게 해서 신경학적 상태를 기록해 둘게요` / `잠깐 진정을 얕게 해서 호흡 상태를 사정할게요`.
  w-briefly·w-lighten·w-neuro·w-status exKo 갱신.
- **K2 ICP 급상승 불응 위기 #3** · ko `지금 신경외과 의사를 침상으로 바로 불러올게요.`
  distractorsKo 다시: 예) `지금 신경외과 의사를 대기실로 바로 불러올게요` / `지금 신경외과 자료를 침상으로 바로 가져올게요`. w-get·w-bedside exKo 갱신.
- **K3 삼투요법 투여 #3** · "너무 건조해지지"는 피부가 마른다는 말로 읽힘(too dry = 이뇨로 혈관 속 수분 부족) →
  ko `혈관 속 수분이 너무 줄지 않게 혈압도 확인할게요.` distractorsKo 둘 새 ko에 맞춰, w-dry exKo 갱신.
- **K4 이송·검사 중 ICP 관리 #0** · "sedation ready"는 진정제를 바로 쓸 수 있게 준비한다는 뜻인데 ko는 "진정 상태를 유지" →
  ko `이송하는 동안 머리를 올려 두고 진정제도 바로 쓸 수 있게 준비해 둘게요.` distractorsKo 둘 새 ko에 맞춰, w-ready·w-during·w-transport exKo 갱신.
- **K5 진정 중단과 신경검사 균형 #2** · "각성 창을 맞춰요"는 번역투 → ko `가장 안정적일 때 깨우는 시간을 잡아요.`
  distractorsKo 다시: 예) `가장 안정적일 때 식사 시간을 잡아요` / `가장 안정적일 때 면회 시간을 잡아요`. w-wake·w-window·w-stable exKo 갱신.
- **K6 두부 거상·중립 체위 #0** · "머리를 세우고"는 앉힌 자세로 읽힘(침상 머리 약 30도) → ko `머리를 올리고 정중선을 유지하면 뇌에서 혈액이 잘 빠져나가요.`
  distractorsKo 둘의 '세우고'도 '올리고'로. w-keep·w-midline·w-blood·w-brain exKo 갱신.
- **K7 (KP 16.4 결정에 따름)** · en을 유지하면 ko `과배액됐다면 즉시 배액관 높이를 다시 맞추고 재평가할게요.`, 바꾸면 새 en에 맞춰 ko·chunks·v46 전부.

### 뉘앙스

- **N1 [사실] 신경학적 사정 · slider(w-alert)** · why 첫 문장 → `AVPU는 의식 수준을 빠르게 네 단계로 나누는 척도예요(신경 ICU 기록은 보통 GCS로 자세히 해요).`;
  scale 마지막 `none` → `unresponsive`(AVPU의 U). answerAt 1 그대로.
- **N2 [설계] 두부 거상·중립 체위 · pair** · `keep his alignment after each turn`이 성립, decoy `a dinner tray`가 keep·check에 붙음 →
  check의 오른쪽 `that he's still midline after each turn`, decoys `[very loudly]`.
- **N3 [설계] ICP 상승 단계별 중재 · pair** · `sedation ordered if ICP stays high`도 성립 → mannitol의 오른쪽 `given to pull fluid off the brain`.
- **N4 [설계] 삼투요법 투여 · pair** · decoy `the visitor list`가 hang·confirm에 붙음(`hang the visitor list`), `confirm the ordered bag`도 성립 →
  confirm `that the dose is weight-based`, hang `it on the pole after checks`, decoys `[very softly]`.
- **N5 [설계] 이송·검사 중 ICP 관리 · pair** · `keep him a little deeper before CT`가 ICU 구어로 성립 → sedate의 오른쪽 `him a bit more before CT`.
- **N6 [설계] EVD 배액량·파형 관리 · slider(w-dampen)** · 강→약 순서 → scale `[flat, dampened, strong]`, answerAt 1, why도 그 순서로.
- **N7 [설계] EVD 막힘·과배액 위기 · slider(w-usually)** · `[rarely, always, usually]` → `[rarely, usually, always]`, answerAt 1.
- **N8 [설계] ICP 급상승 불응 위기 · slider(w-possibility)** · `[possibility, certainty, impossibility]` → `[impossibility, possibility, certainty]`, answerAt 1.
- **N9 [설계] 급성 뇌출혈 확대 악화 · slider(w-rapid)** · `[rapid, steady, slow]` → `[slow, steady, rapid]`, answerAt 2.
- **N10 [설계] 진정 중단과 신경검사 균형 · slider(w-briefly)** · `forever`·`always`가 같은 쪽이고 강→약 → scale `[briefly, for hours, indefinitely]`, answerAt 0;
  why `신경 검사를 위해 진정을 잠깐만 줄이므로 briefly가 맞아요. for hours는 몇 시간, indefinitely는 기한 없이예요. 이때 ICP를 자세히 보고 오르면 다시 진정시켜요.`
- **N11 [사실] 뇌사 진행 인지·검사 연계 · slider(w-final)** · cue의 "two separate exams"(심각 4), `final`·`certain`이 같은 뜻 →
  cue `Not yet confirmed; the formal brain death exams are still pending.`, scale `[tentative, probable, final]`, answerAt 0, why 순서에 맞춰.
- **N12 [사실] 과호흡 일시 사용 이해 · slider(w-brief)** · cue → `Hyperventilation is used only for a short time as a bridge until other treatments work.`;
  why 끝에 `처방·지시에 따라 짧게 쓰고, 오래 쓰면 뇌로 가는 혈류가 줄어 위험해요.`
- **N13 [사실] 과호흡 일시 사용 이해 · swap(w-hyperventilation)** · before[2] ` for a few minutes.` → ` for a short time.`, ko `잠시 동안 숨을 더 빠르게 쉬게 하고 있어요`.
- **N14 [문법] ICP·CPP 모니터 판독 · swap(w-icp)** · "is his pressure inside his head"(his 되풀이) → before[0] `That number on the screen is the `
  (options 그대로: "the ICP"·"the intracranial pressure"도 맞음).
- **N15 [되풀이] CPP 목표 승압·수액 유지 · swap(w-pressor)** · 정답을 넣으면 "raises his blood pressure to support his blood pressure" →
  before[2] ` to protect blood flow to his brain.`, ko `뇌로 가는 혈류를 지키려고 혈압을 올려 주는 약을 쓰고 있어요`.
- **N16 [되풀이] 이송·검사 중 ICP 관리 · swap(w-transport)** · 정답을 넣으면 "the trip to the scanner to CT" → before[2] `.`,
  options `[the trip to the scanner, transport to CT, patient transfer to CT]`(answer·notes 키도 같이).
- **N17 [문법] 뇌탈출 임박 위기 · swap(w-herniation)** · "a uncal herniation" → 옵션 `transtentorial herniation`(notes 키도).
- **N18 [설계] 진정·통증 관리 협조 · context(spike)** · 가족 장면이 어색한 이유가 말투가 아니라 내용 과장("he's in serious trouble") →
  가족 장면 en `His ICP spiked to 28 with suctioning.`, fix `His pressure went up for a moment when we suctioned him, and it came right back down.`,
  why `의료진끼리는 ICP spike가 짧은 급상승을 뜻하는 정확한 말이지만, 가족에게 약어와 숫자만 말하면 무슨 일인지 모르고 불안해져요. 무슨 일이 있었고 지금 어떤지 쉬운 말로 전해 주세요.`
- **N19 [설계] 뇌사 진행 인지·검사 연계 · context(concerning)** · 같은 문제("there's nothing more we can do"는 내용 단정) →
  가족 장면 en `Your husband's exam is concerning for loss of brainstem reflexes.`, fix `His exam worries us, and we're doing more tests before we can say more.`,
  why `의료진끼리는 concerning for … 가 간결한 보고지만, 가족에게는 전문 용어로 들려 무슨 뜻인지 알 수 없어요. 걱정된다는 사실과 지금 하는 일을 쉬운 말로 정직하게 말해 주세요.`
- **N20 뇌탈출 임박 위기 · slider(w-immediately)** · why "한 시간도 기다릴 수 없어요"는 너무 느슨 → `뇌탈출이 의심되면 잠시도 미룰 수 없어요.`
- **N21 (선택) 요붕증·SIADH · pair why** · 끝을 `그래서 처방에 따라 DI는 손실을 보충하고 SIADH는 수분을 제한해요. 다만 뇌손상 환자는 저나트륨이 뇌부종을 키울 수 있어 고장성 식염수를 쓰기도 해요.`
- **N22 (선택) 신경학적 사정 · swap ko** · "그분에게"는 가족에게 어색 → `눈에 띄는 변화가 있으면 바로 알려 드릴게요`.
- **N23 (선택) EVD 막힘·과배액 위기 · context(blocked)** · 가족 장면의 "has failed and may need revision"도 내용이 섞임 → `The EVD is blocked, and the ventriculostomy may need revision.`처럼 용어 문제로만.

### 단어 (결정 11 — ko·cue·오답)

- **W1 w-medical** · "medical therapy / everything medical"은 수술이 아닌 치료(cue도 그렇게 씀) → ko `내과적인`(distractorsKo `[수술적인, 심리적인]` 그대로).
- **W2 w-free** · 19.4 "free water"(자유수)는 ko '없는'과 다름 → 19.4 words에서 뺌(S10). 4.0 pain-free만 남음.
- **W3 w-enough** · 쉬운 말이고 ko '넉넉한'은 enough 뜻이 아님 → 9.1 words에서 빼고 word-remove(S9 상황은 서로 다른 단어 23개).
- **W4 w-thirty·w-twenty** · 숫자(공통 목록 zero·ten과 같은 부류) → 14.1·14.4 words에서 빼고 word-remove(S14는 21개).
- **W5 w-order** · 쓰임이 동사(7.0·11.1·14.1·S10)와 명사(16.2), cue는 명사 → ko `처방(하다)`; distractorsKo의 `처방받다`는 "if ordered"(처방되면)와 겹침 → `[취소(하다), 거절(하다)]`.
- **W6 w-reposition** · '재위치시키다'는 어색한 말 → ko `자세를 다시 잡다`(distractorsKo `[소독하다, 가르치다]` 길이 규칙 통과).
- **W7 w-get** · K2에 맞춰 ko `불러오다`.
- **W8 w-loop** · '합류시키다' → ko `상황을 공유하다`, distractorsKo `[상황을 숨기다, 연락을 끊다]`.
- **W9 w-level** · 쓰임이 동사(2.2)·형용사(8.0)·명사(16.0) → ko `수평(을 맞추다)`, cue `배액관 높이를 기준점과 나란히 맞춘 상태`.
- **W10 cue가 ko를 되풀이(장면으로 다시 쓰기)** — 꼭 고칠 것:
  w-best `지금 그에게 무엇보다 도움이 되는 방법을 가족에게 권할 때` · w-top `모니터에서 두 수치 중 위에 뜬 쪽을 가리킬 때` ·
  w-bottom `모니터에서 두 수치 중 아래에 뜬 쪽을 가리킬 때` · w-otherwise `다른 원인이 확인되기 전까지는 최악을 전제로 대응한다고 할 때` ·
  w-status `진정을 잠시 얕게 해 신경학적으로 지금 어떤지 볼 때` · w-once `막혔다고 판단하기 전에 자세 바꾸기를 딱 한 차례만 해 보라고 할 때` ·
  w-free `통증이 하나도 느껴지지 않게 지켜 주겠다고 가족에게 말할 때` · w-fast `시끄러운 알람이 뇌압을 순식간에 올릴 수 있다고 설명할 때` ·
  w-stop `깨우는 도중 ICP가 치솟으면 진정 중단을 그만두라고 할 때` · w-brief `과호흡은 오래 쓰지 않는다고 동료에게 말할 때` ·
  w-briefly `신경 검사 때 진정을 오래가 아니라 짧게만 줄인다고 할 때` · w-slowly `고장성 요법을 끊을 때 나트륨이 급히 내려가지 않게 하라고 할 때` ·
  w-light `펜라이트를 비춰 동공 반응을 볼 때` · w-respiration `숨 쉴 때마다 EVD 파형이 오르내리는지 볼 때` ·
  w-normal `과호흡을 끝내고 CO2를 평소 수치로 되돌린다고 할 때` · w-truly `자세를 한 번 바꿔 본 뒤에야 막힘이 확실하다고 말할 때` ·
  w-subtle `눈꺼풀이 살짝 떨리는 정도라 놓치기 쉬운 발작 징후를 말할 때` · w-cause `나트륨이 급히 떨어지면 반동 부종이 생길 수 있다고 할 때` ·
  w-hold `신경 검사 전에 처방에 따라 진정제를 잠시 끊어 둘 때`.
  나머지(update·flow·aim·give·rest·raise·notify·response·dry·confirm·reassess·ensure·fill·increase·reduce·medication·pull·frequently·correct·manage·case·lighten·prep·surgery·fall·imaging·match·pattern·recheck·testing·step·result·wait)는 정의 + ko 낱말이 섞인 정도라 선택.
- **W11 (선택)** w-osmolality '삼투압' → `삼투질 농도`, w-exam '진찰'(의사 진찰로 읽힘) → `검진`, w-out·w-well 쉬운 말 word-remove.

### distractorsEn — 정답으로도 맞는 오답·없는 말·불편한 말

| id | 정답 | 문제 오답 | 이유 | 바꿀 말 |
|---|---|---|---|---|
| w-possibility | possibility | probability, possibly | '가능성'은 probability로도 맞음 / possibly는 부사 | positivity, possession |
| w-ensure | ensure | insure | 미국 영어에서 insure를 ensure 뜻으로 씀 | endorse |
| w-crackle | crackle | cuckle, crackers | cuckle은 없는 말, crackers는 복수 과자 | cackle, crinkle |
| w-window | window | widow | 뇌사·사망을 다루는 주제에 '과부' | willow |
| w-siadh | SIADH | SIDS | 영아 돌연사 — 같은 분야의 SIRS가 나음 | SIRS |
| (선택) w-need | need | nerd | 가벼운 비하어 | knead |
| (선택) w-eeg | EEG | EKG·ECG | 두 오답이 같은 검사 | EKG, EMG |

### distractorsKo

- **w-donation** `기부금`은 donation의 뜻 그대로(정답 둘) → `[동의, 장기 이식]`.
- **w-twitch** `경련`은 근육 경련(twitch)으로도 맞음 → `[저림, 마비]`.
- **w-order** W5.
- (선택) w-before `[~후에, ~뒤에]`는 서로 같은 뜻 → `[~후에, ~동안]`; w-cause `[막다, 막아내다]` → `[막다, 줄이다]`.

### distractorsEn — 품사가 다른 것 (전수, ★ = 두 오답 모두 품사가 달라 읽기만 해도 걸러짐, 꼭 바꿀 것)

| id | 정답(품사) | 품사가 다른 오답 | 바꿀 말(길이 규칙 확인함) |
|---|---|---|---|
| ★ w-calm | calm(형) | clam·calf(명) | clammy, balmy |
| ★ w-free | free(형) | tree·fee(명) | frail, fresh |
| ★ w-quiet | quiet(형) | quite(부)·quit(동) | quick, quaint (quite·quit은 decoyChips로) |
| ★ w-soft | soft(형) | sort·loft(명) | short, swift |
| ★ w-best | best(형) | beset(동)·rest(명) | bent, bleak |
| ★ w-loud | loud(형) | cloud·lord(명) | loose, proud |
| ★ w-bright | bright(형) | bring(동)·blight(명) | brisk, blind |
| ★ w-first | first(부, '먼저') | fist·thirst(명) | forth, fully |
| ★ w-urine | urine(명) | urgent·urban(형) | urea, saline |
| ★ w-dry | dry(형) | dye(명)·cry(동) | dewy, dire |
| ★ w-high | high(형) | sigh(동)·hip(명) | shy, hot |
| ★ w-block | block(동) | black(형)·clock(명) | blot, bloat |
| ★ w-climb | climb(동) | climax·limb(명) | cling, clip |
| ★ w-imaging | imaging(명) | imagine(동)·damaging(형) | staging, paging |
| ★ w-deeper | deep(형) | deer·deed(명) | deaf, damp |
| ★ w-real | real(형) | read(동)·rail(명) | rare, regal |
| ★ w-speak | speak(동) | speck·spark(명) | sneak, squeak |
| ★ w-cut | cut(동) | cup·cat(명) | cure, coat |
| ★ w-well | well(부) | will·wall(명) | ill, still (또는 W11로 삭제) |
| ★ w-may | may(조) | mad(형)·map(명) | must, shall |
| ★ w-out | out(부) | our(한정사)·oat(명) | 같은 품사 오답이 어려워 W11처럼 삭제 권고 |
| ★ w-reposition | reposition(동) | reputation·repetition(명) | repossess, recondition |
| ★ w-wait | wait(동) | weight(명)·white(형) | wade, waive |
| w-adequate | adequate(형) | advocate(명·동) | adjacent |
| w-closely | closely(부) | closet(명) | coldly |
| w-cough | cough(명) | tough(형) | cuff |
| w-startle | startle(명, "or startle") | settle(동) | starter |
| w-regularly | regularly(부) | regularity(명) | readily |
| w-fast | fast(부) | fist(명) | fairly |
| w-visit | visit(명) | visual(형) | visa |
| w-activity | activity(명) | actively(부) | captivity |
| w-between | between(전) | betray(동) | beyond |
| w-trend | trend(동) | tender(형) | tend, tread (trial도 명사) |
| w-response | response(명) | respond(동) | residue |
| w-fluctuation | fluctuation(명) | fluctuate(동) | flotation |
| w-frequently | frequently(부) | frequency(명) | fervently |
| w-continuous | continuous(형) | continuity(명) | conspicuous |
| w-subtle | subtle(형) | subtract(동) | sublime |
| w-restrict | restrict(동) | district(명) | constrict |
| w-show | show(동) | shoe(명) | shoo |
| w-organ | organ(명) | organic(형) | orbit |
| w-try | try(동) | dry(형) | pry |
| w-could | could(조) | cold(형) | must |
| w-call | call(동) | tall(형) | cull |
| w-med | med(명) | mad(형) | mud(decoyChip `mad`도 함께) |
| w-osmotic | osmotic(형) | osmosis(명) | hypnotic |
| w-mean | mean(동) | meal(명) | moan |
| w-deficit | deficit(명) | definite(형) | decibel |
| w-target | target(명) | forget(동) | tablet |
| w-bottom | bottom(형) | bother(동) | bottle |
| w-touch | touch(명) | tough(형) | torch |
| w-cluster | cluster(동) | custard(명) | muster |
| w-add | add(동) | odd(형) | adopt |
| w-slowly | slowly(부) | lowly(형) | solely |
| w-weight | weight(명) | wait(동) | freight |
| w-bedside | bedside(명) | beside(전) | bedtime |

나머지 경미한 것(명사로도 쓰이는 동사 오답, 전치사·접속사처럼 같은 품사 짝이 드문 것 — dim·down·per·during·monitor·kink·dampen·overload·manage·sedate·lighten·neuro·bleed·repeat·swing·purpose·medication·rise·once·hang·flush·trust·top·instead)는 선택입니다.

### decoyChips (비속어·불쾌한·술·장례 조각 전수 확인, 474개)

- **D1** w-gentle `gin`(술) → `gan`.
- **D2** w-organ `gun`(무기) → `gum`.
- **D3** w-siadh `SIDS`(영아 돌연사) → `SIRS`(distractorsEn과 함께).
- **D4** w-stopcock 정답 조각 `cock`이 따로 보임(비속어) → chips `[[stopcock]]` 한 조각(앱이 조각 맞추기를 건너뜀).
- **D5 (선택)** w-quickly `quack`(돌팔이), w-dim `dam`(damn과 소리가 같음) → `quake`, `dum`.
- 장례 관련 조각(die·dead·grave·coffin·tomb·mourn·bury)은 없음. 그 밖은 일상어로 둠(lie·shot·bar·joint·trash·wreck 등).

## chunks (전수) — keyPhrase는 보고만

- 비 KP: 10.1(S5에서 고침), 17.1(S13 선택).
- KP: 11.0 `given his brain / injury`(복합명사 brain injury를 끊음), 14.2 `when he's most / stable`(most stable을 끊음),
  20.3 `We'll support / you and discuss`(목적어와 다음 동사를 한 조각에), (선택) 6.2 `If it stays / high`. → 아래 사용자 결정.

## pair·slider·swap·context 전수

- **pair 7문항**(두부 거상·ICP/CPP·자극 최소화·단계별 중재·삼투요법·이송·DI/SIADH): 왼쪽 × (오른쪽 전부 + decoy) 모든 결합을 출력해 판정.
  ICP/CPP·자극 최소화·DI/SIADH 3문항은 정답 말고 성립하는 결합 없음. 나머지 4문항은 N2~N5.
- **slider 14문항**: 정답이 cue로 하나만 맞음(AVPU·precisely·spike·dampened·adequate·brief·subtle·slowly·immediately·usually·possibility·rapid·final·briefly).
  순서가 약→강이 아닌 것 N6~N9, 같은 뜻 두 개 N10·N11. spike 문항 `drift→spike→plateau`는 심해지는 순서로 볼 수 있어 둠.
- **swap 15문항**: 이어 읽기 문법 N14(his 되풀이)·N17(a uncal), 되풀이 N15·N16. 나머지는 맞음. swap ko는 N13·N15에서 바뀌는 것 말고 정확(N22 선택).
- **context 7문항**: `word`가 세 장면 en 모두에 있음(blocked·spiked 어형 포함). 핸드오프 모양(의료진 둘 ok + 가족 하나 not ok + fix)에 맞음.
  어색한 장면이 말투·용어가 아니라 내용 과장인 것 N18·N19(N23 선택). ko는 모두 정확.

## 뉘앙스 why·notes — 미국 신경 ICU 관행 대조

- 침상 머리 약 30도·목 중립(S1 pair why) — 맞음. 다만 문장 ko "머리를 세우고"는 K6.
- CPP = MAP − ICP(S3 pair why) — 맞음. 목표 범위는 의사가 정함 — 맞음.
- 삼투 요법은 처방대로(S6 pair·S7 pair why) — 맞음. 문장 6.3·15.0은 S2·사용자 결정.
- EVD 수위·잠금은 프로토콜대로(S2 slider·S13 pair why) — 맞음. 문장 15.3·16.4는 사용자 결정.
- 동공 변화 즉시 보고(S15 slider) — 맞음(N20은 표현만).
- 과호흡은 일시적 구제 수단(S10 slider why) — 원리는 맞으나 cue·swap·문장의 "몇 분"이 틀림(N12·N13·S5).
- 쿠싱 3징후는 이 주제 뉘앙스에 나오지 않음(틀린 서술 없음).

## 사용자 결정 필요 — keyPhrase en (고치지 않음)

| 상황 #문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 뇌탈출 임박 위기 #0 | A blown pupil means herniation — give hypertonic and hyperventilate now. | 단정(15.1은 until proven otherwise), 처방·프로토콜 없이 동료에게 고장액·과호흡 지시 | A blown pupil can mean herniation — give hypertonic and hyperventilate per protocol now. | **바꿈** |
| EVD 막힘·과배액 위기 #4 | If it over-drained, we reposition and reassess immediately. | 과배액 대응의 핵심(잠그기·신경외과 보고)이 빠지고 reposition이 모호(안전) | If it over-drained, we clamp it, recheck the level, and notify neurosurgery immediately. | **바꿈** |
| 뇌탈출 임박 위기 #3 | I'm draining the EVD and elevating his head immediately. | EVD 배액은 처방된 기준·프로토콜 안에서(6.4 KP와 단서 불일치) | I'm draining the EVD per parameters and elevating his head immediately. | 바꿈(가벼움) |
| 급성 뇌출혈 확대 악화 #3 | I'm reversing any anticoagulation per protocol now. | 역전 결정은 처방이지만 "per protocol"이 있고 투여는 간호사 몫 | We're reversing any anticoagulation per protocol now. | **유지**(바꾸려면 We're) |
| EVD 시스템·영점 이해 #1 | Its height is set to a reference point at his ear to drain correctly. | 기준점은 프로토콜마다(이주·외이도). 가족 설명이라 "귀"면 충분 | Its height is set to a reference point near his ear, per protocol, so it drains correctly. | **유지** |
| ICP·CPP 모니터 판독 #0 | One number is the pressure in his brain, the other is his brain's blood flow. | CPP는 혈류가 아니라 관류압. 가족 설명으로는 허용 | …, the other is the pressure pushing blood into his brain. | 유지(바꿔도 됨) |
| 발작 예방·감시 #0 (chunks) | He's on / a seizure-prevention medication / given his brain / injury | brain injury를 끊음 | en 그대로, chunks `["He's on", "a seizure-prevention medication", "given", "his brain injury", "."]` | 바꿈 |
| 진정 중단과 신경검사 균형 #2 (chunks) | We time / the wake-up window / when he's most / stable | most stable을 끊음 | en 그대로, chunks `["We time", "the wake-up window", "when he's", "most stable", "."]` | 바꿈 |
| 뇌사 진행 인지·검사 연계 #3 (chunks) | We'll support / you and discuss / his wishes / when you're ready | 목적어 you가 다음 동사구에 붙음 | en 그대로, chunks `["We'll support you", "and discuss", "his wishes", "when you're ready", "."]` | 바꿈 |

(삼투요법 #3 "too dry", ICP 급상승 불응 #3 "get neurosurgery to the bedside"는 en이 맞고 ko만 K3·K2로 고칩니다.)

## 종합

고칠 것 **100개**(선택 제외) — 문장 12(S1~S12) · KP ko 6(K1~K6) · 뉘앙스 20(N1~N20) · 단어 결정 11 9(W1~W9) · cue 19(W10) ·
오답 뜻·불편한 오답 7(distractorsEn 5 + distractorsKo 2) · 품사 ★ 23 · decoyChips 4(D1~D4). 그밖에 품사 비★ 34개는 바꾸기 권고.
그중 **안전 5개**: S3(8.4 EVD 막힘 — 플러시 금지가 흐려지고 보고 누락), S12(20.4 장기기증을 간호사가 꺼냄), S8(16.3 카테터 재위치로 읽힘),
S2(6.3 만니톨을 단독 결정처럼), S10(19.4 수분 제한·보충을 처방 없이). 사실·관행 오류는 S4·S5·S7·S11·N1·N11·N12·N13.
keyPhrase는 뇌탈출 #0·과배액 #4를 바꾸기를 권하고(안전), EVD 배액 #3은 가볍게 바꿈, 항응고 역전·영점 귀·CPP 설명은 유지를 권합니다.
위 목록을 반영하면 내보내도 됩니다.
