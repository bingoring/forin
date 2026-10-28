# icu-sepsis — A 검토 (v45 1~7 + 기계적 전수 확인 + context 핸드오프 모양·swap ko)

대상: `icu-sepsis.yaml`(A·B 합친 파일, `icu-sepsis.pre-fix.yaml`과 동일). 비교: base, changes(129건), in-…json, notes-A·B.
단어 265개·문장 105개·뉘앙스 63문항을 스크립트로 전부 뽑아 표로 놓고 판정했습니다(pair 전 조합, chunks 전부, swap 이어 읽기 전부,
distractorsEn 품사 전부, decoyChips 전부, context 세 장면 `word` 포함 여부, 길이 규칙 1.25배·3자).

## 항목별 점수

| # | 항목 | 점수 | 근거 |
|---|---|---|---|
| 1 | distractorsEn | 4 | 대부분 철자·소리가 닮은 같은 품사. 정답으로도 맞는 오답 6건(cooperate·tailored·dip·hoard·numeral·protection), 품사가 다른 오답 7건 |
| 2 | distractorsKo·길이 | 4 | 길이 규칙 위반 0건. 동의어 오답 없음. 바뀐 ko에 맞춰 오답을 다시 써야 할 곳 몇 군데 |
| 3 | cue | 4 | 정답 노출 없음. ko와 cue가 어긋난 곳(hold·escalate·plan) |
| 4 | chips/decoyChips | 4 | 형태소 분절은 대체로 좋음. 비속어 `sod`, ICU 장면에서 꺼림직한 `die`, 가벼운 모욕 `fool`·`troll` |
| 5 | 뉘앙스 사실 정확성 | 3 | 지어낸 용어 `trace dose`, edema 정의 오류, 호중구감소 환자 방문객 가운·장갑(근거 없음), 괴사성 감염 경계 표시만으로 안심 |
| 6 | 뉘앙스 설계 | 4 | pair 2문항 정답은 하나뿐. slider 1문항 정답 둘(promptly/aggressively), swap 1문항 같은 말 되풀이(covers…cover) |
| 7 | 결정 11(v44 단어·문장) | 4 | 변경량은 과하지 않음(아래 판정). 원형으로 바꾸면서 생긴 ko 오류 몇 개, 지킬 수 없는 약속·업무 범위 문장 5개 |

## 저작자 A의 변경 판정 (단어 74개 수정·20개 삭제)

**결정 11 범위를 넘을 만큼 과하지 않습니다. 통째로 되돌릴 것은 없습니다.**
- 74개 중 약 48개는 헤드워드를 원형으로 바꾸면서 en·ipa만 고친 것입니다. 결정 11이 허용하는 기계적 정리이고,
  같은 묶음의 airway(69개)·electrolytes(61개)도 비슷한 양으로 통과했습니다.
- ko를 가른 26개도 대부분 근거가 있습니다(check↔confirm, chart↔document, pressure '압력'은 틀린 ko, fast는 태그된 6문장이 모두 부사).
- 뜻이 다른 쓰임에서 태그를 뺀 8건(is called, at once, won't hold, next line of support, clotting labs, alert the OR,
  get him to the OR, clearly)은 옳습니다.
- 쉬운 말 20개 삭제도 타당합니다. 다만 `talk through`(20.4)와 `put … at risk`(14.3)는 구째로 가르칠 만한 말입니다. 선택 사항이고 되돌릴 필요는 없습니다.
- **원형으로 바꾸면서 생긴 흠(고칠 것 W1~W4)**: w-hold '붙들다'(문장 뜻과 다름), w-die '죽어가다'(원형인데 진행형 뜻),
  w-number를 '숫자'로 바꾸면서 오답 `numeral`이 정답으로도 맞게 됨, w-steady '꾸준한'(혈압에 어색함). w-therapy '요법'은
  "call respiratory therapy"(부서)와 맞지 않습니다. 원래 ko도 틀렸지만 이번에 고친 김에 바로잡아야 합니다.

## 저작자가 짚은 문장 판정

| 문장 | 판정 |
|---|---|
| 1.3 "this won't delay your treatment" (KP 아님) | **타당 — 고침(S1)**. 같은 주제 S2 context의 why가 "'절대 안 늦는다'고 약속하지 마세요"라고 가르치는데 문장이 그 약속을 합니다. SSC 2021은 배양이 항생제를 크게 늦추지 않을 때만 먼저 합니다 |
| 2.3 "won't delay anything" (KP 아님) | **타당 — 고침(S2)**. 약속이라기보다 뜻이 흐립니다(무엇이 지연되지 않는다는지 불분명) |
| 6.2 "through a central line" (KP) | **틀린 말은 아님 — 사용자 결정(유지 권고)**. SSC 2021은 중심정맥관이 생길 때까지 기다리지 말고 말초로 시작하라고 제안하지만, 중심정맥관을 쓰지 말라는 뜻은 아닙니다. why도 "쓰는 경우가 많아요"라고 단서를 달았습니다 |
| 9.4 "until the new one is fully in effect" (KP 아님) | **타당 — 고침(S3)**. 항생제를 좁힐 때는 두 약을 겹쳐 '효과가 날 때까지' 유지하지 않습니다. 다음 투여 시각에 새 처방으로 넘어갑니다 |
| 13.4 방문객 가운·장갑 (KP 아님) | **타당, 안전 — 고침(S5)**. ① 호중구감소 보호 환경에서 가운·장갑은 표준 요구가 아닙니다(CDC; 손 위생·아픈 사람 방문 금지가 핵심) ② 문장이 "가운·장갑 착용 → 손 씻기" 순서로 읽혀 손 위생 → 보호구 순서와 반대입니다 |
| 16.2 MTP 준비 (KP) | **허용 — 사용자 결정(유지 가능)**. "ready"(준비)라서 바로 가동하는 것은 아니고, why도 "대량 출혈 때"라고 정확합니다. DIC면 곧 MTP라고 오해할 여지만 있습니다 |
| 15.1 ko "에스컬레이션" (KP, ko만) | **타당 — 고침(K2)**. ko는 결정 11 범위 |
| 4.0 "where you've had … a fever" (KP) | **타당 — en은 사용자 결정, ko는 고침(K1)**. 열에는 '어디'가 없습니다 |
| 10.4 "in an hour" (KP 아님) | **타당 — 고침(S4)**. 승압제 추가와 스테로이드 판단은 처방된 MAP 목표·용량 기준이지 '한 시간'이 아닙니다. "we escalate"도 간호사가 정하는 것처럼 읽힙니다 |
| support·plan·round·fast | fast는 태그된 6문장이 모두 부사라 '빠르게'가 맞습니다. support(동사 3·명사 4), plan(명사 7.4·동사 8.1), round(동사 10.3·명사 11.3)는 ko를 둘 다 덮게 고칩니다(W5~W7) |

## 사실 오류·심각한 문제

1. **13.4 방문객 안내**: 손 위생과 보호구의 순서가 반대이고, 호중구감소 환자에게 가운·장갑을 일률적으로 요구합니다(안전·감염관리). S13 context의 fix·why도 같은 내용입니다(N4).
2. **S19 slider why**: "펜으로 경계를 표시해 두고 변화를 봐요"로 끝나서, 괴사성 감염에서 피부 경계가 그대로면 안심해도 된다고 읽힙니다. 괴사성 근막염은 피부보다 깊은 곳에서 퍼지고 수술 지연이 치명적입니다(잘못된 안심, 안전, N5).
3. **9.4·10.4**: 두 항생제를 겹쳐 유지하고 '한 시간'을 기준으로 승압제를 올리는 것은 임상 관행이 아닙니다. 10.4는 간호사가 시간 기준으로 정하는 것처럼 읽힙니다(10.4 안전·업무 범위, 9.4 관행).
4. **1.3·2.3**: 이 주제 뉘앙스가 하지 말라고 가르치는 약속을 문장이 합니다(지킬 수 없는 약속).
5. **S6 slider `trace dose`**: 실제로 쓰지 않는 지어낸 용어이고 why의 "trace 수준에 머물지 않는다"도 근거가 없습니다(N1).
6. **S12 slider why**: "edema는 누르면 자국이 남는 부종" — 틀렸습니다. 자국이 남는 것은 pitting edema이고 edema가 전부 그렇지는 않습니다(N2).

## 고칠 것

문장 en을 고치면 그 문장의 v46 필드(`why`·`decoy`·`distractorsKo` 둘·`blank`·`tag`·`icon`)를 새 문장에 맞춰 **새로 쓰고**,
그 문장을 `example`로 쓰는 단어들의 `example`·`exKo`도 새 문장으로 바꿉니다. 바꾼 것은 전부 `changes-icu-sepsis.yaml`에 적습니다.

### 문장 (KP 아님 — en·ko·chunks 고침)

- **S1 [사실·약속] 젖산·혈액배양 채취 #3** · 지킬 수 없는 약속(미래 보장) → 지금 하는 행동으로:
  en `We're drawing your cultures now, and the antibiotic starts right after — we're not delaying your treatment for this.`
  ko `지금 배양검사를 채취하고 바로 이어서 항생제를 시작해요, 이것 때문에 치료를 미루지 않고 있어요.`
  chunks `["We're drawing your cultures", "now", ", and the antibiotic starts", "right after", "— we're not delaying", "your treatment", "for this", "."]`
  words 그대로. v46 새로(why는 현재진행형으로 지금의 행동을 말해 약속이 아닌 사실이 된다는 점; distractorsKo 둘 새 ko에 맞춰). w-delay·w-treatment example 갱신.
- **S2 [사실·명료] 광범위 항생제 신속 투여 #3** · 약속·뜻이 흐림 →
  en `We already sent his blood cultures, so there's no reason to delay the antibiotic.`
  ko `혈액배양은 이미 보냈으니, 항생제를 미룰 이유가 없어요.`
  chunks `["We already sent", "his blood cultures", ", so there's no reason", "to delay the antibiotic", "."]`
  words 그대로(w-send·w-culture·w-antibiotic·w-delay). v46 새로(blank `cultures` 유지 가능). w-send example 갱신.
- **S3 [관행] 항생제 스튜어드십·조정 #4** · 두 약을 겹쳐 '효과가 날 때까지' 유지하는 것은 관행이 아님 →
  en `We'll keep the current antibiotic until the first dose of the new one.`
  ko `새 항생제의 첫 투여 전까지 지금 항생제를 유지할게요.`
  chunks `["We'll keep", "the current antibiotic", "until the first dose", "of the new one", "."]`
  words `[w-keep, w-current, w-antibiotic]` — w-fully·w-effect는 이 문장에서만 쓰이므로 word-remove(S9는 그래도 서로 다른 단어 20개 이상).
  v46 새로(blank `current` 유지 가능). w-current example 갱신.
- **S4 [안전·업무 범위] 스테로이드 보조 판단 #4** · 근거 없는 '한 시간' 기준, 간호사가 정하는 것처럼 읽힘 →
  en `If his pressure still doesn't respond, the team will escalate to the next agent.`
  ko `그래도 혈압이 반응하지 않으면 팀이 다음 약제로 올릴 거예요.`
  chunks `["If his pressure", "still doesn't respond", ", the team will escalate", "to the next agent", "."]`
  words 그대로. v46 새로(why의 "in an hour는 기한" 설명 삭제; distractorsKo 둘의 "한 시간 안에"도 삭제). w-escalate·w-agent example 갱신.
- **S5 [안전] 면역저하 패혈증 특수 관리 #4** · 손 위생 → 보호구 순서, 가운·장갑은 병원 표지에 따를 때만 →
  en `Please wash your hands well before entering, and wear a gown and gloves if the sign on his door says to.`
  ko `들어오시기 전에 손을 잘 씻어 주시고, 병실 문 안내문에 쓰여 있으면 가운과 장갑도 착용해 주세요.`
  chunks `["Please wash your hands well", "before entering", ", and wear a gown and gloves", "if the sign on his door", "says to", "."]`
  words 그대로(w-wear·w-gown·w-glove·w-enter·w-wash). v46 새로(blank `gloves` 유지 가능; B 메모의 "방문 기록부" 오답도 이때 다시). w-wear·w-gown·w-glove·w-enter·w-wash example 갱신.
  참고(B 몫): S13 order 4줄 "wash your hands well and wear a gown and gloves before entering"에도 같은 단서를 다는 것이 좋습니다.
- **S6 다장기부전 목표 재설정 #4** · chunk가 "what he would have / wanted"로 동사구를 끊음 →
  chunks `["There's no wrong answer", "here", "— let's talk through", "what he would have wanted", "."]` (en·ko 그대로).

### keyPhrase 문장 — ko만 고침 (en은 아래 '사용자 결정')

- **K1 감염원 병력·부위 사정 #0** · ko "어디에 … 열이 있었는지"가 어색함 →
  ko `어디가 아프거나 빨갛게 됐는지, 열이 난 적은 있는지 말씀해 주시겠어요?`
  distractorsKo 다시: `어디가 아프거나 가렵게 됐는지, 열이 난 적은 있는지 말씀해 주시겠어요?` / `어디가 아프거나 빨갛게 됐는지, 기침이 난 적은 있는지 말씀해 주시겠어요?`
  이 문장을 example로 쓰는 w-tell·w-pain·w-redness·w-fever의 exKo도 새 ko로.
- **K2 불응성 패혈성 쇼크 다중승압 #1** · ko 외래어 '에스컬레이션' →
  ko `다장기 기능장애가 보여서 지금 치료 단계를 올려야 해요.`
  distractorsKo 다시: `혈압 저하가 보여서 지금 치료 단계를 올려야 해요` / `단일 장기 기능장애가 보여서 지금 치료 단계를 올려야 해요`.
  w-multiorgan·w-dysfunction의 exKo도 같은 문장으로. (B 몫 참고: S15 order `ko`·`why`·2줄 ko의 '에스컬레이션'도 '치료 단계 올리기'로.)

### 뉘앙스

- **N1 [사실] 패혈성 쇼크 승압 시작 · slider(w-dose)** · `trace dose`는 지어낸 용어 → scale `[low dose, moderate dose, high dose]`, answerAt `0`;
  why `승압제는 낮은 용량으로 시작해 처방된 목표 혈압(보통 평균동맥압 65 이상)에 맞춰 조금씩 올려요. 처음부터 high dose로 시작하지 않아요.`
- **N2 [사실] 수액 과부하 균형 · slider(w-swelling)** · why를
  `puffiness는 가벼운 부은 느낌, swelling은 일반적인 부기, edema는 조직에 수분이 고인 부종을 가리키는 의료 용어예요. 누르면 자국이 남으면 차트에 pitting edema로 적어요.`
- **N3 면역저하 패혈증 특수 관리 · slider(w-aggressively)** · cue가 "all within the hour"라 `promptly`도 정답 → scale `[conservatively, moderately, aggressively]`, answerAt 2, why의 cautiously를 conservatively로.
- **N4 [안전] 면역저하 패혈증 특수 관리 · context(precautions)** · fix·why가 가운·장갑을 표준처럼 가르침 →
  fix `Please wash your hands well before you come in, and please don't visit if you feel sick.`
  why 끝 문장 `손 씻기, 아플 때 방문하지 않기처럼 해야 할 행동으로 말해 주세요.`
- **N5 [안전] 괴사성 감염 응급 수술 조율 · slider(w-spread)** · 잘못된 안심 → why 둘째 문장을
  `펜으로 경계를 표시해 변화를 보지만, 괴사성 감염은 피부 경계가 그대로여도 속에서 퍼질 수 있어 이것만으로 안심하지 않아요.`
- **N6 감염원 병력·부위 사정 · slider(w-pain)** · why의 "일상이 어려운 정도는 pain"은 지어낸 기준 →
  `한국어로는 다 '아프다'지만 영어는 결이 달라요. 둔하게 계속되는 아픔은 ache, 아픔을 두루 가리키는 말은 pain, 견디기 힘든 극심한 고통은 agony예요.`
- **N7 (선택) 광범위 항생제 신속 투여 · context(delay)** · 장면 둘이 명사(No delay·hour of delay) → ko `지연(시키다)`.
- **N8 (선택) 젖산 클리어런스 재평가 · context(improve)** · 세 장면 모두 자동사 → ko `좋아지다`.
- **N9 (선택) 수액 과부하 균형 · context(balance)** · 장면 둘이 명사(fluid balance) → ko `균형(을 맞추다)`.
- **N10 광범위 항생제 신속 투여 · swap(w-broad)** · 정답을 넣으면 "covers many germs to cover"로 되풀이 →
  정답 `an antibiotic that works on many germs`(options·answer·notes 키 함께), ko `의심되는 감염을 잡으려고 여러 균에 듣는 항생제를 드리고 있어요`.
- **N11 장기부전 진행 모니터 · swap(w-intensivist)** · ko의 '환자를'은 가족에게 하는 말에 어색함 → `지금 중환자실 의사를 불러서 그분을 보게 할게요`.

### 단어 (결정 11 — ko·cue·오답)

- **W1 w-hold** · ko '붙들다'는 12.1 문장 ko("물을 … 붙들고 있다")와 같으니 둡니다. cue("손이나 몸으로 붙잡고")만 문장 뜻과 다름 →
  cue `몸이 물 같은 것을 밖으로 내보내지 못하고 안에 잡아 두다`, distractorsKo `[내보내다, 흘려보내다]`,
  distractorsEn의 `hoard`는 "body is hoarding water"로 정답이 되므로 → `halt`.
- **W2 w-die** · 원형인데 ko가 '죽어가다' → `죽다`.
- **W3 w-therapy** · 유일한 쓰임 17.2 "call respiratory therapy"는 부서(호흡치료팀)인데 ko가 '요법'. '치료'로 바꾸면 w-treatment와 다시 겹침 →
  17.2 words에서 w-therapy를 빼고 word-remove(S17은 그래도 서로 다른 단어 20개 이상, 이 단어를 가리키는 nuance `words` 없음).
- **W4 w-steady** · '꾸준한'은 "BP stays steady"에 어색 → `일정한`.
- **W5 w-support** · 명사 4·동사 3 → ko `지지(하다)`, distractorsKo `[억제(하다), 반대(하다)]`.
- **W6 w-plan** · 7.4 명사·8.1 동사, cue는 명사 → ko `계획(하다)`, distractorsKo `[취소(하다), 연기(하다)]`.
- **W7 w-round** · 10.3 동사·11.3 명사 → ko `회진(을 돌다)`, distractorsKo `[퇴원(하다), 인계(하다)]`.
- **W8 w-escalate** · cue "윗선에 올려 알리다"는 보고라는 뜻이고 어느 문장도 그렇게 쓰지 않음 → cue `반응이 없을 때 다음 약제나 더 강한 호흡 보조로 치료를 한 칸 올리다`.

### distractorsEn — 정답으로도 맞는 오답

| id | 정답 | 문제 오답 | 이유 | 바꿀 말 |
|---|---|---|---|---|
| w-coordinate | coordinate | cooperate | cue "손발이 맞도록"에 그대로 맞음 | corroborate |
| w-targeted | targeted | tailored | "a more tailored drug"는 같은 뜻(맞춤) | tangled |
| w-drop | drop | dip | "a dip in BP" — 떨어지다와 겹침 | drip |
| w-hold | hold | hoard | "body hoards water"로 성립 | halt |
| w-number | number | numeral | ko를 '숫자'로 바꾸면서 동의어가 됨 | lumber |
| w-precaution | precaution | protection | "extra protection"으로 성립 | perception |

### distractorsEn — 품사가 다른 것 (전수)

| id | 정답(품사) | 오답(품사) | 바꿀 말 |
|---|---|---|---|
| w-cause | cause (동사) | clause (명사) | cease |
| w-work | work (동사) | word (명사) | worry |
| w-better | better (형용사 비교급) | butter (명사) | bolder |
| w-within | within (전치사) | whether (접속사) | beyond |
| w-faster | faster (부사 비교급, "much faster") | flatter·fatter (형용사) | farther, harder |
| w-less | less (부사, "less swollen") | lean·lost (형용사) | last, lately |
| w-plan | plan (W6 이전: 동사 '계획하다') | plank (명사) | W6을 반영하면 그대로 둠, 아니면 place |
| w-rightway | right way (명사구) | right away (부사) | 일부러 헷갈리게 한 짝이라 둬도 됨(선택: right side) |

나머지 오답 약 520개는 같은 품사입니다(명사로도 쓰이는 attributive 정답 `emergency`는 문제 없음으로 봄).

### decoyChips (비속어·불쾌한 조각 전수 확인)

- **D1** w-sideeffect `sod`(영국 비속어) → `sad`.
- **D2** w-direction `die`·w-dialysis `die` — 중환자 장면에 '죽다'를 띄움 → `dim`, `dial`.
- **D3** w-carefully `fool`·w-foot `fool`(모욕), w-control `troll` → `full`, `fort`, `toll`.
- **D4 (선택)** w-quickly `quack`(돌팔이 의사) → `quake`.
- 그 밖에 431개는 문제 없음(war·gin·gut·pot 등은 일상어로 둠).

## chunks (전수) — keyPhrase는 보고만

- 10.0 KP `high vasopressor / support` — 복합명사 "high vasopressor support"를 끊음.
- 15.2 KP `the next line / of support` — "line of support"를 끊음.
- 비 KP는 S6(20.4)뿐입니다.

## pair·swap·context 전수

- pair 2문항(젖산·혈액배양 draw/clean/tell, 다중승압 page/document/prepare): 왼쪽 × (오른쪽 전부 + decoy) 모든 결합 중 정답 말고 성립하는 것 없음.
- swap 21문항: 이어 읽으면 문법이 다 맞음. 고칠 것은 N10(되풀이)뿐. swap ko는 N10·N11 말고는 정확합니다.
- context 21문항: `word`가 세 장면 en 모두에 있고(units는 "unit one" 어형), 어색한 장면은 모두 같은 뜻을 맞지 않는 사람(가족·환자)에게 차트·팀 용어로 말한 곳입니다. 핸드오프 모양에 맞습니다. ko는 N7~N9만 고칩니다.

## 사용자 결정 필요 — keyPhrase en (고치지 않음)

| 상황 #문장 | 현재 en | 문제 | 대안 en |
|---|---|---|---|
| 감염원 병력·부위 사정 #0 | Can you tell me where you've had pain, redness, or a fever? | 열에는 '어디'가 없음(where가 fever까지 걸림) | Can you tell me where you've had pain or redness, and whether you've had a fever? |
| 패혈성 쇼크 승압 시작 #2 | We'll give it through a central line and watch him very closely. | SSC 2021은 중심정맥관을 기다리지 말고 말초로 시작하라고 제안. 틀린 말은 아님 → **유지 권고** | We'll give it through his IV now, switch to a central line once it's placed, and watch him very closely. |
| 패혈증 유발 DIC·출혈 위기 #2 | Let's send a DIC panel and get the massive transfusion protocol ready. | DIC 출혈은 성분 맞춤 수혈이 먼저. "ready"라 허용 → **유지 가능** | Let's send a DIC panel and have the massive transfusion protocol ready in case the bleeding gets worse. |
| 스테로이드 보조 판단 #0 (chunks) | His pressure still needs / high vasopressor / support / despite fluids | chunk가 복합명사를 끊음 | en 그대로, chunks `["His pressure", "still needs", "high vasopressor support", "despite fluids", "."]` |
| 불응성 패혈성 쇼크 다중승압 #2 (chunks) | Let's call the intensivist / and prepare / the next line / of support | chunk가 "line of support"를 끊음 | en 그대로, chunks `["Let's call", "the intensivist", "and prepare", "the next line of support", "."]` |

## 종합

고칠 것 **38개**(선택 N7~N9·D4 빼고) — 문장 6(S1~S6) · KP ko 2(K1·K2) · 뉘앙스 8(N1~N6·N10·N11) · 단어 8(W1~W8) · 정답으로도 맞는 오답 5(표 6행 중 hoard는 W1과 같음) · 품사 6(표의 plan·rightway는 조건부·선택) · decoyChips 3(D1~D3).
그중 **안전 4개**: S5(손 위생 → 보호구 순서, 가운·장갑), N5(괴사성 감염 잘못된 안심), N4(같은 가운·장갑 내용), S4(간호사가 '한 시간' 기준으로 승압제 단계를 올리는 것처럼 읽힘).
S1·S2(약속·명료), S3(관행), N1·N2·N6(사실)은 사실·관행 오류로 따로 셉니다.
위 목록을 반영하면 내보내도 됩니다. keyPhrase 결정 중 바꾸기를 권하는 것은 감염원 #0(fever) 하나이고, 중심정맥관·MTP는 유지를 권합니다.
