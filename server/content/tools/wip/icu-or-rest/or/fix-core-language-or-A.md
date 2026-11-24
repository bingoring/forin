# fix-core-language-or-A — 수술실 core-language-or A 검토 (Opus)

대상: `core-language-or.yaml`(A·B 합친 파일, 21상황 · 문장 105 · 단어 162). 범위: REVIEW.md v45 1~7 + 기계적 전수 확인 + v46 7번(context 모양·swap `ko`).
비교: `base-`, `changes-`(94건), `in-…json`(keyPhrase 63), 저작자 메모 A·B. 검사기는 통과한 상태(`==> 통과`).
기준 관행: 미국 병원은 자격 있는 의료 통역사를 쓰고, 통역사는 옮기기만 하며 설명·판단은 하지 않는다. 가족·아이 통역은 쓰지 않는다. 동의 설명은 시술자가 통역을 통해 하고, 간호사는 teach-back으로 이해를 확인하고 통역 이용을 기록한다. 응급 예외는 시술자가 판단하고 기록한다. 통역을 쓸 때는 환자에게 1인칭으로 직접 말하고 "Tell him…"을 쓰지 않는다.

---

## 항목별 점수 (1~5)

| 항목 | 점수 | 근거 |
|---|---|---|
| 1 오답 `distractorsEn` | 3 | 소리·철자로 잘 닮았지만, 품사가 다른 오답 10개(★)와 정답 단어의 다른 뜻인 오답 2개(just→merely, still→yet)가 있다 |
| 2 오답 뜻·길이 | 3 | 길이 위반은 0이다. 그러나 정답 단어의 다른 뜻을 오답에 넣은 것이 4개 있다(critical 비판적인, term 기간, step 계단, few 약간의) |
| 3 `cue` | 4 | 정답 영어는 하나도 드러나지 않는다. 다만 `ko`를 거의 그대로 되풀이하는 cue가 몇 개 있다(선택) |
| 4 `chips`·`decoyChips` | 4 | 형태소 경계는 좋다. `kus`가 두 번 남았다(저작자가 거른 `cus`와 소리가 같은 비속어) |
| 5 뉘앙스 사실 정확성 | 3 | `why`·`notes`는 대체로 정확하다. 그러나 context에서 ok인 장면 다섯이 통역 원칙과 어긋난다("Please tell him…" 3곳, 통역사에게 단순화를 시킴, 통역사에게 가족 지지를 시킴). slider 4의 정답은 환자가 말하지 않은 숫자를 적는다 |
| 6 뉘앙스 설계 | 3 | slider 3·5는 약함→강함 순서가 아니다. swap 2의 정답은 금식 지시를 빠뜨린다. context 21개 중 3개는 어색함이 듣는 사람 때문이 아니다 |
| 7 v44 단어·문장(결정 11) | 2 | 비 keyPhrase 문장 15개에 역할 오류, 지킬 수 없는 약속, 사실 오류가 있다. `w-scared` ko가 틀렸다(무서운). `w-keep` ko를 바꿨지만 예문 "Keep it simple"과 맞지 않는다 |

---

## 사실 오류 · 심각한 문제

1. **역할 오류가 문장 전체에 퍼져 있다.** 통역사가 동의·마취·금식을 "설명"한다(1#0·2#0·3#0, keyPhrase). 간호사가 통역 정확성을 "알아야 한다"(12#3)·동의가 "정확했는지" 환자와 확인한다(12#4). 간호사가 직접 "통역해야 한다"(18#3). 통역사에게 "간단하게 설명해 달라"고 한다(18#4). 간호사가 "진짜 응급이니 진행한다"고 선언한다(19#3). 응급 예외를 간호사가 정당화한다(15#2, keyPhrase).
2. **지킬 수 없는 약속과 잘못된 안심 [안전].**
   - 2#3 "even water" — 마취과는 맑은 물을 수술 2시간 전까지 허용하기도 하고, 약을 물 한 모금과 함께 먹으라는 처방도 있다. 절대 금지로 가르치면 이 처방과 부딪친다.
   - 3#3 "won't remember any of this" — 같은 상황의 swap이 오답으로 가르치는 단정을 문장이 정답으로 가르친다.
   - 4#4 "every hour" — 지킬 수 없는 약속이다.
   - 5#4 "catches every word so nothing gets missed" — 과장이다.
   - 16#3 "won't give medication until we confirm" — 응급 투약이 늦어질 수 있다.
3. **6#4 "I'll take off my mask" [안전]** — 감염관리 정책과 부딪친다. 영상 통역 장면이라 간호사가 마스크를 벗을 이유도 약하다.
4. **13#4 "Watch my face and hands" [안전]** — 같은 상황 13#1은 "통역사를 보라"고 한다. 수어 사용자에게 입 모양 읽기는 정확도가 낮다. 봐야 할 것은 통역사의 얼굴과 손이다.
5. **slider 4 [안전·기록]** — 환자가 숫자를 말하지 않았는데 정답이 "2/10"이다. 그런데 `why`는 "환자가 정한 숫자를 그대로 적는다"고 해서 정답과 맞지 않는다.
6. **swap 2 [안전]** — 정답 "when you plan to stop"은 금식 시각을 환자가 정하는 것처럼 들리고, 금식 지시가 빠져 있다.
7. **`w-scared` ko "무서운"** — 이 말은 scary(무섭게 하는)의 뜻이다. 맞는 뜻은 "겁먹은·무서워하는"이다.
8. **decoyChips `kus` ×2**(w-question·w-discuss) — 아랍어·히브리어 속어(페르시아어 kos)에서 여성 성기를 뜻하는 비속어로, 저작자가 거른 `cus`와 소리가 같다. 다국어 환자를 다루는 주제라 특히 피해야 한다. 조합으로도 하나가 걸린다: w-repeat의 decoy `ra`+정답 칩 `peat` = "rapeat"(rape가 보인다).
9. **[사용자 결정] context `word` 21개 중 18개가 일반어다**(interpreter·explain·point·normal·simple·trust 등. 임상어는 informed·provision·flag뿐). 그래서 어색한 장면의 어색함이 그 말 자체가 아니라 같은 문장의 다른 임상어·말투에서 온다. TASK 9는 세 장면이 같은 말을 공유하면 허용하고, 이 주제(소통·통역)에는 세 장면이 함께 쓸 임상어가 거의 없다. **권고: 유지.** 듣는 사람이 아니라 내용·행동 때문에 어색한 3개(ctx 3·4·14)만 고친다(E8·E9·E13). 일반어 `word`를 허용하지 않기로 하면 18개를 모두 다시 써야 한다.

---

## 고칠 것

표시: **[안전]** = 그대로 따라 하면 환자가 다칠 수 있음. "v46 새로" = 그 문장의 `tag·icon·why·decoy·distractorsKo·blank`를 새 문장에 맞춰 다시 쓰라는 뜻. 아래 대안 chunks는 모두 `verify_lesson_content`의 함수(이어 붙이기·V8·V9)로 확인했다. 대안 문장의 `words` 단어는 모두 새 `en`에 들어 있다. 한 번만 쓰이는 단어(w-water·w-remember·w-bring·w-check·w-screen·w-loud·w-quiet·w-corner·w-mask)도 고친 뒤 고아가 되지 않는다.

### A. 비 keyPhrase 문장 — en·ko·chunks 고침 (15건, 모두 v46 새로)

| # | 위치 | 문제 | 새 en / ko / chunks / words |
|---|---|---|---|
| A1 [안전] | 금식·준비 통역 안내 #3 "Nothing to eat or drink means nothing at all, even water." | 물 절대 금지는 마취과 지침(맑은 물 허용, 약과 물 한 모금)과 부딪친다 | en "Nothing to eat or drink means no water either, unless we say so." / ko "먹지도 마시지도 말라는 건, 따로 말씀드리지 않는 한 물도 안 된다는 뜻이에요." / chunks `["Nothing to eat","or drink","means no water either",", unless we say so","."]` / words 그대로 |
| A2 | 금식·준비 통역 안내 #4 "Tell me back what time…" | "Tell me back"은 부자연스럽다 | en "Please tell me what time you need to stop eating." / ko "몇 시부터 드시면 안 되는지 말씀해 주세요." / chunks `["Please tell me","what time","you need to","stop eating","."]` / words 그대로 |
| A3 [안전] | 마취 설명 통역 #3 "Once you're asleep, you won't remember any of this." | 단정이고(같은 상황 swap이 오답으로 가르치는 말), "any of this"는 지금 나누는 수술 전 대화까지 가리켜 사실과 다르다 | en "Most people don't remember the surgery once they're asleep." / ko "대부분은 잠드신 뒤의 수술 자체를 기억하지 못하세요." / chunks `["Most people","don't remember","the surgery","once they're asleep","."]` / words `[w-asleep, w-remember]` |
| A4 | 통증 소통 통역 #4 "…every hour to check on you." | 매시간 통역사를 데려온다는 약속은 지키기 어렵다(원격·대기) | en "I'll bring the interpreter back when I check your pain again." / ko "통증을 다시 확인하러 올 때 통역사와 함께 올게요." / chunks `["I'll bring","the interpreter back","when I check","your pain again","."]` / words `[w-bring, w-interpreter, w-check, w-pain]` |
| A5 | 가족 통역 한계 인지 #4 "A trained interpreter catches every word so nothing gets missed." | 결과를 보장하는 과장이다. (고친 문장의 "catch every word"는 빠짐없이 옮긴다는 **완전성**의 뜻이다. 통역 표준에 맞는 말이고, 아래 교차 참고에서 문제 삼은 직역 "word for word"와는 다르다) | en "A professional interpreter is trained to catch every word so nothing gets missed." / ko "전문 통역사는 한 마디도 빠뜨리지 않도록 훈련받은 사람이에요." / chunks `["A professional interpreter","is trained","to catch every word","so nothing gets missed","."]` / words `[w-professional, w-interpreter, w-catch, w-word, w-nothing, w-miss]` |
| A6 | 전화·영상 통역 활용 #3 "The screen is loud, so let's find a quiet corner." | 논리가 거꾸로다. 화면이 시끄러우면 소리를 줄인다. cue("주위 소음에 묻힐 때")의 뜻은 주위가 시끄럽다는 것이다 | en "It's loud here, so let's find a quiet corner for the screen." / ko "여기는 시끄러우니 화면을 들고 조용한 자리로 가 볼게요." / chunks `["It's loud here",", so let's find","a quiet corner","for the screen","."]` / words 그대로 |
| A7 [안전] | 전화·영상 통역 활용 #4 "I'll take off my mask for a moment…" | 감염관리와 부딪친다 | en "I'll switch to a clear mask so you can see my face." / ko "제 얼굴이 보이시게 투명 마스크로 바꿔 쓸게요." / chunks `["I'll switch","to a clear mask","so you can see","my face","."]` / words `[w-mask, w-face]` (w-moment는 17#3에 남는다). **투명 마스크가 없는 병원을 가정해 장비 없이 쓰려면:** en "Let me move the screen closer so you can see the interpreter's face." / ko "통역사 얼굴이 잘 보이시게 화면을 가까이 옮길게요." / chunks `["Let me move","the screen closer","so you can see","the interpreter's face","."]` / words `[w-screen, w-interpreter, w-face]`. 이때 w-mask는 고아가 되므로 은행에서 지우고(word-remove) changes에 적는다 |
| A8 | 동의 이해 재확인 #4 "…understood before we go over it again." | 다시 짚기 '전에' 이해를 확인한다는 순서가 거꾸로다(저작자 지적, 타당) | en "Let's go over it again and make sure everything is understood." / ko "다시 짚어 보면서 다 이해되셨는지 확인할게요." / chunks `["Let's go over it","again","and make sure","everything is understood","."]` / words 그대로 |
| A9 | 통역 정확성 확인 #3 "I need to know the interpreter caught every word correctly." | 간호사는 통역의 정확성을 직접 알 수 없다. 통역사 앞에서 하면 불신으로 들린다 | en "If the interpreter didn't catch a word, I need to know." / ko "통역사가 못 알아들은 말이 있으면 제가 알아야 해요." / chunks `["If the interpreter","didn't catch","a word",", I need to know","."]` / words `[w-interpreter, w-catch, w-word, w-need]` (w-correctly는 12#0에 남는다). **slider 12의 `example`·`exKo`도 이 문장으로 바꾼다** |
| A10 | 통역 정확성 확인 #4 "Confirm with the patient that the consent was accurate." | 동의 내용이 정확한지는 시술자 몫이다. 간호사는 환자의 이해를 확인한다. 통역사에게 하는 말이면 통역사가 혼자 확인하게 시키는 것이다 | en "Let's confirm with the patient that she understood the consent." / ko "동의 내용을 이해하셨는지 환자분과 함께 확인해 봅시다." / chunks `["Let's confirm","with the patient","that she understood","the consent","."]` / words `[w-confirm, w-consent, w-understand]` (w-accurate는 12#1에 남는다) |
| A11 [안전] | 청각장애 수어 통역 #4 "Watch my face and hands…" | 13#1("통역사를 보라")과 어긋난다. 수어 사용자는 통역사를 봐야 한다 | en "Watch the interpreter's face and hands so you don't miss anything." / ko "아무것도 놓치지 않도록 통역사의 얼굴과 손을 봐 주세요." / chunks `["Watch","the interpreter's face and hands","so you don't miss","anything","."]` / words `[w-watch, w-interpreter, w-face, w-miss, w-anything]` |
| A12 [안전] | 언어장벽 알레르기 미확인 #3 "We won't give medication until we confirm the allergy history." | 응급 투약은 예외다. 무조건 보류하겠다는 약속은 지킬 수 없다 | en "Unless it's an emergency, we'll confirm allergies before any medication." / ko "응급이 아니면 약을 드리기 전에 알레르기부터 확인할게요." / chunks `["Unless it's an emergency",", we'll confirm","allergies","before any medication","."]` / words `[w-emergency, w-confirm, w-allergy, w-medication]` |
| A13 | 위기 설명 신속 통역 #3 "We need to interpret this urgently…" | 통역은 간호사가 아니라 통역사가 한다 | en "We need this interpreted urgently before her condition changes again." / ko "환자분 상태가 또 변하기 전에 급히 통역이 필요해요." / chunks `["We need this","interpreted urgently","before her condition","changes again","."]` / words 그대로 |
| A14 | 위기 설명 신속 통역 #4 "Explain this simply so nothing gets misunderstood." | 통역사에게 '설명'을 시키는 말로 읽힌다(이 상황의 다른 문장은 통역사에게 하는 말) | en "I'll explain this simply so nothing gets misunderstood." / ko "잘못 이해되지 않게 제가 간단하게 설명할게요." / chunks `["I'll explain","this simply","so nothing","gets misunderstood","."]` / words 그대로 |
| A15 | 이해 불가 응급 진행 #3 "This is a true emergency, so we proceed under emergency consent." | 진짜 응급인지는 간호사가 선언할 일이 아니고 시술자가 판단한다. "we proceed"(현재형)도 어색하다 | en "The surgeon called it a true emergency, so we're proceeding under emergency consent." / ko "집도의가 진짜 응급이라고 판단해서 응급 동의 절차로 진행하고 있어요." / chunks `["The surgeon called it","a true emergency",", so we're proceeding","under emergency consent","."]` / words 그대로 |

같은 문장을 인용하는 단어 `example`도 새 문장으로 바꾼다. 해당 단어: w-eat·w-water(A1), w-stop(A2), w-remember(A3), w-bring·w-check(A4), w-catch·w-nothing·w-miss(A5), w-screen·w-loud·w-find·w-quiet·w-corner(A6), w-mask·w-moment·w-face(A7). w-moment는 17#3 "Stop for a moment…"로 바꾼다.

### B. 문장 ko만 고침 (6건 — keyPhrase 4건은 결정 11 범위, 모두 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓸 것)

| # | 위치 | 현재 ko | 새 ko |
|---|---|---|---|
| B1 | 동의 이해 재확인 #0 (kP) | 제 말로 이해하신 걸… | "이해하신 내용을 환자분 말로 다시 말씀해 주시겠어요?" (in your own words = 환자 자신의 말) |
| B2 | 응급 신속 통역 확보 #0 (kP) | 지금 바로 전화선으로 통역사가 필요해요. | "지금 바로 통역사를 전화로 연결해야 해요." (slider 14 `exKo`도 같이) |
| B3 | 응급 신속 통역 확보 #2 (kP) | 지금 바로 필수적인 것만 전달합시다. | "지금 바로 꼭 필요한 내용부터 전달합시다." ('only'는 en에 없다) |
| B4 | 나쁜 소식 통역 전달 #0 (kP) | 통역사가 이 소식을 전하는 걸 도와드릴 거예요. | "통역사분이 제가 이 소식을 전할 수 있게 도와주실 거예요." (통역사가 돕는 대상은 '나'다. '도와드릴'은 높임의 방향이 틀렸다) |
| B5 | 응급 신속 통역 확보 #4 | 시간을 놓치지 않게 바로 전화선을 연결해 주세요. | "시간을 허비하지 않게 바로 통역 회선을 연결해 주세요." + chunks `["Connect","the line","immediately","so we don't lose time","."]` ("so we don't / lose time"은 조동사를 끊는다) |
| B6 | 진정 후 비언어 소통 #3 | 네일 땐 한 번, 아니오일 땐 두 번 손을 쥐어 주세요. | "'네'면 한 번, '아니요'면 두 번 손을 쥐어 주세요." (표준어는 '아니요') |

#### 문장 `ko` 변경 한곳 모음 (각 문장의 `distractorsKo` 둘을 새 ko에 맞춰 다시 쓸 것)
- 필수: B1 동의 이해 재확인 #0 · B2 응급 신속 통역 확보 #0 · B3 응급 신속 통역 확보 #2 · B4 나쁜 소식 통역 전달 #0 · B5 응급 신속 통역 확보 #4 · B6 진정 후 비언어 소통 #3 · K4 오역 위험 정보 누락 #1("중대한 실수를…") · K5 전화·영상 통역 활용 #1("원격 통역 회선을 연결해 드릴게요.")
- keyPhrase 결정에 따라: 통역 정확성 확인 #1(유지 시 "통역이 정확히 전달됐는지 함께 확인해 봅시다.") · 위기 설명 신속 통역 #2(en 유지 시 "잘못 이해되지 않게 간단하게 말해 주세요.", en을 바꾸면 "잘못 이해되지 않게 제가 간단하게 말할게요.")
- A1~A15 재작성 문장 15개는 ko를 새로 쓰므로 distractorsKo도 v46 새로에 포함.

### C. 비 keyPhrase 문장 chunks — 구 경계 (3건, en·ko는 그대로)

| # | 위치 | 현재 | 대안 |
|---|---|---|---|
| C1 | 동의 통역 확인 #4 | `to explain it / back` (구동사를 끊는다) | `["A nod","isn't enough","— I need you","to explain it back","."]` |
| C2 | 동의 이해 재확인 #3 | `you didn't / understand` | `["Point to","any part","you didn't understand","."]` |
| C3 | 통역 통한 불안 완화 #3 | `that's completely / normal` | `["I know you're scared",", and that's","completely normal","."]` |

(통역 서비스 요청 #4 `in just a few / minutes`와 마취 설명 통역 #4 `the entire / time`은 깨끗한 4조각 대안이 없어 뺐다 — 대안이 다른 곳을 끊는다.)

### D. 단어 v45 필드 (17건)

**D1–D10 `distractorsEn` ★ (품사가 다르거나 정답 단어의 다른 뜻 — 아래 표 참고)**
- D1 w-professional: professor → **procedural**
- D2 w-agree: agent, agile → **argue, admire**
- D3 w-enough: enjoy, ensure → **tough, enormous**
- D4 w-few: fee, flew → **new, low**
- D5 w-own: owe → **old**
- D6 w-nod: knot → **nudge**
- D7 w-want: wont(고어, won't의 오타처럼 보임) → **waste**
- D8 w-language: languish(동사) → **lineage**
- D9 w-just: merely(just의 다른 뜻 "그저"의 동의어) → **justly** (mostly는 유지)
- D10 w-still: yet(still과 같은 자리에서 '아직'으로 정답처럼 읽힘) → **soon** (even은 유지)

**D11–D15 `distractorsKo` — 정답 단어의 다른 뜻·어색한 말**
- D11 w-critical: "비판적인"은 critical의 실제 뜻 중 하나여서 정답이 둘이 된다 → **"일시적인"**
- D12 w-term: "기간"은 term의 실제 뜻 중 하나다(a term) → **"부호"**
- D13 w-step: "계단"은 step의 실제 뜻 중 하나다 → **"목표"**
- D14 w-few: "약간의"는 a few의 뜻이라 정답이 둘이 된다 → **"유일한"**
- D15 w-still: "아직도 아닌"은 한국어로 어색하다 → **"곧"**

**D16 `decoyChips`** — `kus`: w-question `[kus, tian]` → `[kwes, tian]`, w-discuss `[dys, kus]` → `[dys, cass]`. w-repeat `[ra, pet]` → `[ri, pet]`(`ra`+`peat` = "rapeat").

**D17 w-team `tag` "통역 인력"** — 마취팀이므로 맞지 않는다 → "마취·통증".

### E. 뉘앙스 (15건)

**slider**
- E1 slider 3(마취 설명 통역) — 저울이 약함→강함이 아니다(헛된 안심 → 적절 → 무시). 순서를 `["Everyone fears that, so there's no need to discuss it", "That's common, and the anesthesia team will explain", "Don't worry, nothing will go wrong at all here"]`으로 바꾸고 `answerAt: 1`. 축은 "얼마나 장담하는가"다.
- E2 [안전] slider 4(통증 소통 통역) — 환자가 숫자를 말하지 않았는데 정답이 "2/10"이고, `why`("환자가 정한 숫자를 그대로")와도 어긋난다. cue에 숫자를 넣으면 답이 드러나므로 cue는 그대로 두고 저울을 `["Mild pain, by patient report", "Moderate pain, by patient report", "Severe pain, by patient report"]`, `answerAt: 0`으로 바꾼다. why: "'조금 아프지만 괜찮다'면 약한 쪽이에요. 환자가 숫자를 말하지 않았으면 간호사가 숫자를 지어내지 않고, 말한 정도를 적은 뒤 통역을 통해 0~10 숫자를 다시 물어요."
- E3 slider 5(가족 통역 한계 인지) — 0번("인사·잡담·간단한 질문")도 의료 대화를 맡기지 않는 답으로 읽혀 정답이 흐리다. 순서도 단조롭지 않다. 저울을 `["None — professionals handle medical talk", "Simple medical questions, but not consent", "All of it, including the consent talk"]`으로, `answerAt: 0`. `why`에 "(응급으로 통역사를 기다릴 수 없을 때 말고는)"을 더한다. 미성년자 통역은 Section 1557에서 응급 예외만 허용한다.
- E4 slider 14(응급 신속 통역 확보) `why` — "'지금 바로'라고 말해야 대기열에서 우선 처리돼요"는 근거가 없다. "통역 서비스에 응급이라는 것과 필요한 언어를 함께 분명히 알려요"로 바꾼다.
- E5 slider 17(오역 위험 정보 누락) cue — 간호사가 통역사가 다른 언어로 한 말을 알 길이 없다. `During teach-back, the patient says she'll take the medicine every two hours, but the surgeon said every twelve.`로 바꾼다. 정답과 `why`는 그대로 둔다.

**swap**
- E6 [안전] swap 2(금식) — 정답 "…and when you plan to stop"은 금식 시각을 환자가 정하는 것처럼 들린다. 정답(options·answer·notes 키)을 **"Can you tell me what time you need to stop eating and drinking?"**으로, `ko` "몇 시부터 드시고 마시면 안 되는지 말씀해 주시겠어요?"로 바꾸고 notes와 why도 teach-back에 맞춘다.
- E7 [안전] swap 16(알레르기) `why` — "통역사를 먼저 불러 확인한 뒤에 약을 줘요"는 절대적이다. "응급이 아니면, 알레르기를 모를 때 없다고 가정하지 않고 통역사·약국 기록·가족·의료 팔찌로 먼저 확인해요"로 바꾼다.

**context — 장면이 통역 원칙과 어긋나거나 모양이 맞지 않는 것** (`who·icon·ok` 그대로, `en·fix·why`만)
- E8 ctx 3(asleep) — scene1 "Please tell him he'll be asleep…"은 통역사에게 3인칭으로 시키는 말이다. 같은 주제 ctx 0이 가르치는 "환자에게 직접 말하기"와 어긋난다. scene1을 "He may ask if he'll be asleep the whole time, so please interpret his questions exactly."로 바꾼다. scene3의 어색함은 asleep이 아니라 'put down'에서 온다. scene3을 "You'll be asleep after induction, and then we'll intubate you."(임상어를 겁먹은 환자에게 씀)로 바꾸고 fix는 그대로, why를 'induction·intubate'에 맞춰 다시 쓴다.
- E9 ctx 4(manage) — scene1 "Please tell her…"도 E8과 같다. "I'll tell her we'll manage her pain together, so please interpret everything I say."로 바꾼다. scene3 "manage your pain yourself and stop calling us"는 듣는 사람 때문이 아니라 행동이 틀려서 어색하다(조절의 주체도 바뀐다). "Pain is being managed per the multimodal protocol; reassess in 30 minutes."(차트 말투를 환자에게)로 바꾸고 why도 다시 쓴다.
- E10 ctx 10(normal) — scene1 "Please tell him it's normal…"을 "I'm going to say it's normal to feel scared before surgery, so please interpret it exactly."로 바꾼다.
- E11 ctx 11(simple) — scene1 "Please keep it simple and interpret exactly what I say"는 통역사에게 단순화와 정확한 통역을 한꺼번에 요구해 앞뒤가 맞지 않는다. 단순화는 말하는 사람의 몫이다. "I'll keep it simple, so please interpret exactly what I say."로 바꾸고, why "통역사에게는 덧붙이지 말고"를 "내가 쉽게 말하고 통역사는 그대로 옮기게"로 고친다.
- E12 ctx 20(support) — scene1 "Please support the family by pausing after each sentence"는 정서 지지와 끊어 말하기를 통역사에게 맡기는 말이다. 둘 다 말하는 사람의 몫이다. "I'll pause after each sentence so you can interpret it all, and we'll support the family together."로 바꾸고 why를 맞춘다.
- E13 ctx 14(urgent) — scene3 "I'm panicking because nobody here understands you"는 듣는 사람이 아니라 내용(간호사의 당황) 때문에 어색하다. "Urgent: LEP patient, Vietnamese, interpreter needed stat — patient decompensating."(동료 말투·약어를 환자에게)로 바꾸고, fix는 그대로, why를 'LEP·stat·decompensating' 기준으로 다시 쓴다.
- E14 ctx 2(instruction) `why` — "'취소될 수 있다'는 말로 윽박지르면"은 틀린 비판이다. 금식을 어기면 수술이 미뤄질 수 있다는 것은 실제로 환자에게 알려야 할 교육 내용이다. 문제는 'Compliance… mandatory'라는 법규 말투다. why를 "'의무'나 '준수' 같은 규정 말투로 말하면…"으로 고치고, 수술 연기 언급 자체는 문제 삼지 않는다.

**pair**
- E15 pair 11 decoy "a short walk in the hall" — 너무 동떨어져서 읽기만 해도 걸러진다. "stickers on your chest that track your heart"(심전도 패드: NPO·sedation·IV 어디에도 붙지 않음)로 바꾼다. 전 조합 12개를 출력해 보니 정답 짝은 하나뿐이다.

---

## 결정 11 항목 (단어 ko·헤드워드·태그 — 따로)

| # | id | 문제 | 고침 |
|---|---|---|---|
| K1 | w-scared | ko "무서운"은 scary의 뜻이다 | ko **"겁먹은"**. dKo(화난·외로운)는 그대로 |
| K2 | w-keep | 저작자가 ko를 "계속하다"로 바꿨는데 `example`이 "Keep it simple…"(유지하다)이다. 한 카드에 두 뜻이 섞였다 | `example` "Let's keep trying to communicate throughout." / `exKo` "내내 소통을 계속 시도합시다." 그리고 위기 설명 신속 통역 #2(kP)의 `words`에서 w-keep 태그를 뺀다(상황 단어 수는 8개 이상 유지) |
| K3 | w-under | ko "~ 아래에서"는 공간의 뜻이다. 문장은 "under emergency provisions/consent"(규정에 따라) | ko **"~하에서"**, dKo "~없이"·"~대신에", ex는 그대로 |
| K4 | w-critical | ko "치명적인"(fatal)은 과장이다. critical error는 "중대한 오류"다(cue도 '중대한') | ko **"중대한"**. 오역 위험 정보 누락 #1(kP) ko도 "중대한 실수를 막기 위해 멈추고 명확히 합시다."로 바꾸고 그 문장의 distractorsKo 둘을 다시 쓴다 |
| K5 | w-line | ko "전화선"은 물리적인 선이다. 문장은 on the line·interpreting line(통화 연결) | ko **"회선"**. 전화·영상 통역 활용 #1(kP) ko "원격 통역 회선을 연결해 드릴게요."로 바꾸고 distractorsKo를 다시 쓴다 |

선택(확실하지 않음, 고칠 것 개수에 넣지 않음): w-check ko "점검하다"는 사람을 살피는 "check on you"에 어색하다 → "살피다"(A4로 문장이 "check your pain"이 되면 지금 그대로도 무방). w-due → 헤드워드 "due to"(set up·slow down과 맞춤). w-set ko "세팅하다"는 병원 구어로 통하니 유지해도 된다(대안 "연결해 두다").

### 저작자 변경 목록(94건) 판정
- word-remove 26건은 타당하다. 이미 1할을 넘었으니 쉬운 말(want·tell·ask·help·food·water)을 더 빼지는 말자. 상황마다 8단어 기준이 얇아진다.
- **w-set → "set up", w-slow → "slow down"은 타당하다.** 예문에 각각 "set up"·"slow down"이 있고, ipa(/sɛt ʌp/, /sloʊ daʊn/)와 오답(set off·sit up / speed up·shut down)도 구 단위로 맞췄다. 다만 w-slow가 쓰이는 문장(청각장애 수어 통역 #2, kP)의 chunks가 "to slow / down"으로 구동사를 끊는다 → 아래 keyPhrase chunks 표 참고.
- w-back "되돌려", w-nothing "아무것도 없음", w-anything "무엇이든", w-welcome "환영받는", w-across "전달되어", w-flag "표시해 두다", w-arrange "마련하다"는 타당하다. **w-keep만 틀렸다(K2).** w-check "점검하다"는 선택 항목이다.
- 문장 words 57건은 쉬운 단어와 구에 묶인 태그를 정리한 것으로 타당하다. w-risk·w-process를 동사로 쓴 문장에서 태그를 뺀 것도 맞다.

---

## keyPhrase 결정 필요 (en — 사용자 결정)

| 문장 | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| 동의 통역 확인 #0 | The interpreter will explain the consent in your language. | 동의 설명은 시술자가 한다. 통역사는 설명하지 않고 옮긴다 | The surgeon will explain the consent through the interpreter. | **바꿈** |
| 금식·준비 통역 안내 #0 | The interpreter will go over your fasting instructions. | 지침은 간호사·마취과가 주고 통역사는 옮긴다 | I'll go over your fasting instructions through the interpreter. (chunks `["I'll","go over","your fasting instructions","through the interpreter","."]`) | **바꿈** |
| 마취 설명 통역 #0 | The interpreter will explain how the anesthesia works. | 마취 설명은 마취팀이 한다 | The anesthesia team will explain how it works through the interpreter. | **바꿈** |
| 통역 없는 응급 동의 #2 | Patient safety justifies proceeding under emergency provisions. | 응급 예외를 판단하는 것은 시술자다. 간호사가 정당화를 선언하는 말이 된다 | The surgeon says patient safety justifies proceeding under emergency provisions. | **바꿈** |
| 위기 설명 신속 통역 #2 | Keep it simple so nothing is misunderstood. | 이 상황에서는 통역사에게 하는 말로 읽혀 통역사에게 단순화를 시키는 것이 된다(정확히 옮기기 원칙 위반) | I'll keep it simple so nothing is misunderstood. | **바꿈** (유지하면 ko "간단하게 유지하세요"를 "잘못 이해되지 않게 간단하게 말해 주세요"로 손질) |
| 통역 정확성 확인 #0 | Can you confirm the patient understood that correctly? | 통역사에게 환자가 이해했는지 판단하게 하는 것으로 읽힌다. 이해 확인은 teach-back이 맡는다 | Let's use teach-back to confirm she understood that correctly. | 바꿈(약) — 시술자에게 하는 말로 읽힌다면 유지 |
| 마취 설명 통역 #1 | You'll be asleep and won't feel anything. | 단정적이다. 전신마취에서는 사실에 가깝지만 진정·부위마취에서는 압박감을 느낄 수 있다 | You'll be asleep, so you shouldn't feel any pain. | 유지 가능 (마취과가 흔히 쓰는 안심 문장. 바꾸면 더 안전) |
| 금식·준비 통역 안내 #1 | No food or drink after midnight, okay? | 금식 시각은 마취과 지침에 따라 다르다(맑은 물 2시간 전까지 등) | No food or drink after midnight, unless anesthesia tells you otherwise. | **유지** 권고 — 미국 병원에서 아직 흔한 처방. ko "음식도 물도"는 그대로 둬도 된다 |
| 통역 정확성 확인 #1 | Let's verify the interpretation is accurate. | 간호사 혼자 검증할 수는 없다. 다만 "Let's"는 되읽기·teach-back으로 함께 확인한다는 뜻으로 읽힌다 | (유지) | **유지**. ko "검증해 봅시다" → "통역이 정확히 전달됐는지 함께 확인해 봅시다"(ko만, distractorsKo도 다시) |
| 통역 없는 응급 동의 #1 | Let's document the emergency and the consent process. | 간호사도 본 과정을 기록한다 | — | **유지** |
| 이해 불가 응급 진행 #1 | We proceed under emergency consent and document why. | 팀의 목소리로 쓰였다. 판단 주체는 why·slider가 설명한다 | The surgeon is proceeding under emergency consent, and we'll document why. | 유지 (A15로 #3을 고치면 충분) |
| 이해 불가 응급 진행 #0 | The patient can't fully understand, but this is a true emergency. | 사실을 전하는 말 | — | 유지 |
| 동의 이해 재확인 #2 | I want to be sure this is truly informed. | 간호사가 옹호자로서 하는 말로 타당하다 | — | 유지 |
| 언어장벽 알레르기 미확인 #1 | Let's get an interpreter before any medication. | 비응급 맥락에서는 맞다(응급 예외는 A12가 다룬다) | — | 유지 |
| 오역 위험 정보 누락 #0 | That interpretation didn't match what I said. | 간호사가 어떻게 알았는지가 빠져 있다(teach-back으로 드러남) | — | 유지 (E5에서 slider cue를 teach-back으로 고침) |
| 나쁜 소식 통역 전달 #0 | I'm so sorry — the interpreter will help me share this news. | 간호사 범위의 소식일 수 있다 | — | 유지 (B4로 ko만) |

## keyPhrase chunks — 구 경계를 끊는 것 (보고만, 모두 V8·V9 통과 대안)

| 문장 | 현재 | 대안 |
|---|---|---|
| 청각장애 수어 통역 #2 Let me know if you need me to slow down. | `to slow / down` (헤드워드 slow down을 끊는다) | `["Let me know","if","you need me","to slow down","."]` |
| 금식·준비 통역 안내 #0 | `your fasting / instructions` | `["The interpreter","will go over","your fasting instructions","."]` |
| 마취 설명 통역 #0 | `how the anesthesia / works` | `["The interpreter","will explain","how the anesthesia works","."]` |
| 통증 소통 통역 #1 | `if that's / easier` | `["Point to","where it hurts","if that's easier","."]` |
| 가족 통역 한계 인지 #1 | `and your family member's / safety` | `["It's","for accuracy","and your family member's safety","."]` |
| 전화·영상 통역 활용 #0 | `a phone or video / interpreter` | `["We","can use","a phone or video interpreter","right now","."]` |
| 전화·영상 통역 활용 #1 | `the remote / interpreting line` | `["Let me","set up","the remote interpreting line","."]` |
| 문화적 표현 차이 조율 #1 | `what you're / comfortable with` | `["Please","share only","what you're comfortable with","."]` |
| 진정 후 비언어 소통 #0 | `if you can / hear me` | `["Squeeze","my hand","if you can hear me","."]` |
| 통역 통한 불안 완화 #0 | `that you're / scared` | `["Through the interpreter",", I hear","that you're scared","."]` |
| 의료 용어 평이한 설명 #2 | `anything that's / still unclear` | `["Ask me","anything","that's still unclear","."]` |
| 통역 정확성 확인 #2 | `what the patient / just said` | `["Please","repeat back","what the patient just said","."]` |
| 응급 신속 통역 확보 #1 | `as fast as / possible` | `["This is","urgent","— connect us","as fast as possible","."]` |
| 통역 없는 응급 동의 #1 | `and the consent / process` | `["Let's document","the emergency","and the consent process","."]` |
| 통역 없는 응급 동의 #2 | `under emergency / provisions` | `["Patient safety","justifies proceeding","under emergency provisions","."]` |
| 언어장벽 알레르기 미확인 #1 | `before any / medication` | `["Let's get","an interpreter","before any medication","."]` |
| 이해 불가 응급 진행 #0 | `The patient can't / fully understand` | `["The patient","can't fully understand",", but this is","a true emergency","."]` |
| 나쁜 소식 통역 전달 #1 | `Take all / the time` | `["Take","all the time","you need","to process this","."]` |
| 언어장벽 알레르기 미확인 #2 (약) | `I'm flagging / it now` | `["This is","a safety risk","— I'm flagging it","now","."]` |

---

## distractorsEn 품사가 다른 것 전부 (★ = 꼭 바꿀 것, D1~D10)

| id | 정답(품사) | 다른 품사 오답 | 판정 | 대안 |
|---|---|---|---|---|
| w-professional | adj | professor (n) | ★ | procedural |
| w-agree | v | agent (n), agile (adj) | ★ | argue, admire |
| w-enough | adj | enjoy (v), ensure (v) | ★ | tough, enormous |
| w-few | det/adj | fee (n), flew (v 과거) | ★ | new, low |
| w-own | adj | owe (v) | ★ | old |
| w-nod | v | knot (n) | ★ | nudge |
| w-want | v | wont (고어 adj/n) | ★ | waste |
| w-language | n | languish (v) | ★ | lineage |
| w-just | adv | (품사는 같음) merely = just의 다른 뜻 | ★ 정답 둘 | justly |
| w-still | adv | (품사는 같음) yet ≈ still | ★ 정답 둘 | soon |
| w-speak | v | speck (n) | 선택 | sneak |
| w-find | v | fine (adj) | 선택 | mind |
| w-right | adv("right away") | rate (n), light (n/adj) | 선택 — 소리가 닮은 짝이라 효과는 있다 | rarely, lightly |
| w-through | prep | thorough (adj), though (conj) | 유지 — through/thorough/though는 대표적인 철자 혼동 세트 | — |
| w-every | det | very (adv), even (adv) | 유지 — 철자 혼동 (대안 either, other) | — |
| w-everything | pron | everywhere (adv) | 유지 — every- 가족 | — |
| w-nothing | pron | nowhere (adv) | 유지 — no- 가족 | — |
| w-miss | v | mist (n/v) | 유지 — 동사로도 쓰인다 | — |
| w-avoid | v | void (adj/v) | 유지 — "void the order"처럼 동사로 쓴다 | — |
| w-provision | n | (품사 같음) procedure — "under emergency procedures"도 영어로 성립 | 선택 — ko '규정'과 '절차'로 갈리므로 큰 문제는 아니다 | protection |

나머지 140여 개는 품사가 같다.

## decoyChips 판정 (전수)
비속어·성적·술·장례·무기·민족 비하 목록과 각 단어의 칩 풀 2~3개 조합을 스크립트로 대조했다. 걸린 것:
- **`kus` ×2 — 바꿀 것(D16).**
- `nam`(w-number) — 베트남 전쟁 속어로 읽힐 수 있다. 이 주제에는 베트남어 환자가 나온다. 선택: `nem`.
- `dye`(w-due) — die와 소리가 같다. 나쁜 소식·응급이 나오는 주제다. 선택: `doo`.
- `ku`(w-accuracy·w-accurate) — 혼자서는 문제없다. 유지.
- `drank`·`bar`·`joint`·`rage`·`wreck`·`cry`·`troll`·`tar`·`gust`·`knight` — 유지. joint는 이 앱에서 관절 뜻이 먼저 읽힌다.
조합으로 만들어지는 비속어는 없다.

## cue가 ko를 거의 되풀이하는 것 (선택, 개수 밖)
w-confirm("확인해서"), w-respect("존중하는 일"), w-process("절차나 과정"), w-device("전자 기기"), w-face("…있는 얼굴"), w-number("숫자 하나"), w-daughter("딸을 부르는 말"), w-throughout("내내라는 뜻"), w-news("새로 알게 된 소식"). 장면 정보가 붙어 있어 큰 문제는 아니다.

선택 distractorsKo(개수 밖): w-feel "만지다"(feel의 다른 뜻: 만져 보다) → "맛보다". w-manage "참아내다"(manage의 다른 뜻: 견디다)·"줄여버리다"(어색) → "악화시키다", "기록하다". w-truly "분명히" → "겉으로만". w-want "요구하다" → "망설이다".

---

## context 21개 — 핸드오프 모양 표 (v46 7번)

`word`는 21개 모두 세 장면의 `en`에 들어 있다. 듣는 사람은 21개 모두 세 장면이 서로 다르다. 이 주제(소통·통역)에는 임상어가 적어, `word`가 대부분 일반어다(explain·point·normal·simple·trust 등). 그래서 어색함이 그 말 자체가 아니라 같은 문장의 다른 임상어나 말투에서 온다. TASK 9는 세 장면이 같은 말을 공유하면 허용하므로, 아래에서 "고침"으로 표시한 것만 고친다.

| # | word | 일반어? | 듣는 사람(1/2/3) | 어색한 장면이 어색한 이유 | 판정 |
|---|---|---|---|---|---|
| 0 | interpreter | 예 | 동료/차트/환자 | LEP·VRI 약어를 환자에게 | 좋음 |
| 1 | explain | 예 | 집도의/차트/환자 | sequelae·clinical terms를 환자에게 | 좋음 |
| 2 | instruction | 예 | 통역사/차트/환자 | 법규 말투(compliance·mandatory) | 모양 좋음 · why 고침(E14) |
| 3 | asleep | 예 | 통역사/차트/환자 | 'put down'이라는 낱말 하나 | **고침(E8)** + scene1 "tell him" |
| 4 | manage | 예 | 통역사/차트/환자 | 행동이 틀림(호출 막기) · 뜻의 주체가 바뀜 | **고침(E9)** + scene1 "tell her" |
| 5 | trust | 예 | 환자/통역사/딸 | 아이에게 차갑게 내쫓는 말 | 허용(차가움) |
| 6 | device | 예 | 통역사/데스크/고령 환자 | actuator·audio stream | 좋음 |
| 7 | informed | 임상어 | 차트/집도의/환자 | 법률 문장을 환자에게 | 좋음 |
| 8 | respect | 예 | 차트/통역사/환자 | 가벼운 속어("culture thing") | 허용(말투) |
| 9 | point | 예 | 동료/차트/막 깬 환자 | anatomical site·dominant digit | 좋음 |
| 10 | normal | 예 | 통역사/차트/환자 | tachycardia·normal limits | 좋음 · scene1 "tell him" **고침(E10)** |
| 11 | simple | 예 | 통역사/차트/환자 | 'sweetie' 같은 어른 무시 말투 | 모양 허용 · scene1 모순 **고침(E11)** |
| 12 | repeat | 예 | 통역사/차트/환자 | 환자에게 "word for word" 다그침(teach-back은 own words) | 좋음 |
| 13 | miss | 예 | 차트/동료/환자 | 협박조 | 허용(차가움) |
| 14 | urgent | 예 | 통역서비스/차트/환자 | 간호사의 당황(내용) | **고침(E13)** |
| 15 | provision | 임상어 | 차트/수술팀/보호자 | 조항 번호를 보호자에게 | 좋음 |
| 16 | flag | 임상어 | 차트/약사/환자 | "problem patient" | 허용 |
| 17 | clarify | 예 | 통역사/집도의/환자 | 책임을 환자에게 떠넘김 | 허용(차가움) |
| 18 | urgently | 예 | 통역사/차트/환자 | comprehend·deterioration | 좋음 |
| 19 | communicate | 예 | 환자/차트/보호자 | "uncooperative"로 환자를 탓함 | 허용(차가움) |
| 20 | support | 예 | 통역사/차트/가족 | 규정·전화번호로 떠넘김 | 모양 좋음 · scene1 역할 **고침(E12)** |

swap `ko` 12개(0·1·2·3·5·8·11·12·15·16·17·18)는 모두 바꾼 문장의 뜻과 맞는다. 다만 swap 2는 E6에서 정답을 바꾸므로 ko도 함께 바꾼다. swap 17 ko "잠깐 멈춰 주세요"는 en "Let's stop"(함께 멈춤)보다 조금 세다. "잠깐 멈출게요, 제가 한 말과 안 맞아서요"로 바꾸는 것은 선택이다.

## swap 이어 붙이기 · pair 전 조합 (기계적 확인)
- swap 12개는 모두 `before = ['', X, '']`로 문장 전체를 바꾼다. 선택지 36개를 이어 붙인 문장은 모두 문법에 맞는다. 정답이 둘인 것은 없다(오답은 모두 notes가 말하는 결함이 분명하다).
- pair(의료 용어 평이한 설명): NPO·sedation·IV × 오른쪽 4개(decoy 포함) = 12조합. 정답 짝만 성립한다.

## slider 20개 — 순서·정답 하나
고칠 것: 3·5(순서), 4(cue). 나머지 0·1·2·6·7·8·9·10·12·13·14·15·16·17·18·19·20은 약함→강함 순서가 맞고, cue로 정답이 하나로만 정해진다.

---

## 교차 참고 — order 카드(B 몫, 개수 밖)
문장을 고치면 같은 말을 되풀이하는 order 줄도 맞춰야 한다. B 검토와 맞추기 바란다.
- 1·2·3번 1줄(통역사가 설명함)
- 2번 2줄 "even water", 3줄 "tell me back"
- 3번 3줄 "Afterward, you won't remember any of it."
- 4번 4줄 "every hour"
- 12번 3줄 "I know the interpreter caught every word", 4줄 "consent was accurate"
- 15번 2줄 justifies
- 16번 4줄 "Until we confirm…, we won't give any."
- 18번 3줄 "Keep it simple"(통역사에게)
- 14번 3줄·17번 4줄 "word for word" — 통역 표준은 '뜻을 빠짐없이 정확히'다. "exactly and completely"가 낫다.

## 저작자 지적 판정 요약
- 통역사가 설명함(동의 통역 확인 #0·금식·준비 통역 안내 #0·마취 설명 통역 #0) — 타당. keyPhrase라 바꿈을 권고한다.
- 간호사가 통역 정확성을 검증함 — 통역 정확성 확인 #3·#4는 고친다(A9·A10). #1은 유지하고 ko만 손질한다. #0은 바꿈(약).
- 응급 예외를 간호사가 정당화함 — 통역 없는 응급 동의 #2는 바꿈. 이해 불가 응급 진행 #3은 고친다(A15). #1과 통역 없는 응급 동의 #1은 유지한다.
- 지킬 수 없는 약속 다섯 개 — 모두 타당하다(A1·A3·A4·A5·A12). 마취 설명 통역 #1 "won't feel anything"은 유지 가능하다.
- "제 말로"(B1)·마스크(A7)·전화선(B2·K5) — 타당하다.
- 금식 midnight(금식·준비 통역 안내 #1) — 유지를 권고한다(흔한 처방, 대안 제시).
- ko 어색 4곳 — 모두 받아들인다(B3·B5·B6·A8).
- w-set·w-slow 헤드워드 — 타당하다. slow down의 chunks는 위 표 참고.

---

## 종합
고칠 것 **61건**(그중 [안전] 8건): 비 keyPhrase 문장 재작성 15 · 문장 ko 6 · chunks 3 · 단어 v45 필드 17 · 뉘앙스 15 · 결정 11 5. 이와 별도로 keyPhrase en 결정 5건(바꿈 권고, 약하게 1건 더)과 keyPhrase chunks 보고 19건, context `word` 일반어 문제(사용자 결정, 권고 유지)가 있다.
위 목록을 반영하고 keyPhrase 결정을 받으면 내보내도 된다. 핵심은 역할 오류(통역사는 옮기고, 설명·판단은 시술자, 간호사는 teach-back과 기록)를 문장과 뉘앙스 전체에서 일관되게 고치는 것이다.
