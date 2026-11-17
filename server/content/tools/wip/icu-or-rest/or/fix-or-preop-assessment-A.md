# or-preop-assessment — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `or-preop-assessment.yaml`(A·B 합본). 단어 227, 상황 21(문장 126), 뉘앙스 42(slider 21 · context 11 · swap 10 · pair 0).
비교: base(뉘앙스 없음 — 뉘앙스는 전부 새로 씀)·changes(101건: word-remove 25 · word 22 · sentence words 54 — 문장 en·ko·chunks 변경 없음, 스크립트로 대조)·in-json·notes-A·notes-B.
검사 `verify_one_theme.py or` 통과. 덤프는 스크립트로 뽑아 한 줄씩 판정(단어 표·문장 chunks `/` 이음·swap 이어 붙임·context 장면·ko 겹침·길이).
번호는 "상황.문장"(0부터), 뉘앙스는 "상황.n순번". KP = in-json `keyPhrases`와 글자 그대로 같은 문장(상황마다 0~2번, 3개씩).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 소리·철자가 닮은 오답이 대부분. 품사가 다른 것은 적음(표 참고). `asteroid`(cricoid)는 분야도 품사도 다름, `through`(during)는 뜻이 겹침 |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과(스크립트). w-anyone 오답에 '그 밖의'가 붙어 else 뜻이 섞임, w-suction `흡인`과 w-aspiration `흡인(폐로)`이 같은 상황(15)에서 겹침 |
| 3 cue | 4 | 정답 노출 없음. w-malignant cue가 종양 뜻("나쁘게 자라")이라 MH에 안 맞음. 나머지는 장면이 떠오름 |
| 4 chips/decoyChips | 4 | 잘림은 의미 있음. 불쾌한 조각 `cow`×2·`rat`(모욕), `pall`·`rip`(장례), `pint`(술), `dis`(비속어), 낮음 `colt`(총기 상표) |
| 5 뉘앙스·문장 사실 | 3 | 뉘앙스 why·notes는 대체로 정확(결정은 마취과, 간호사는 들은 만큼 그대로 전함). 문장: 6.4 물 한 모금 단정, 6.3·13.5 지킬 수 없는 약속, 1.4 진단성 발언, 11.3·12.4 과장, KP 15.0 유도 방식 결정 |
| 6 뉘앙스 설계 | 3 | slider 8.n0 정답 둘, 17.n0 cue가 과거·현재 모호(안전), context 3개는 어색함이 말투가 아니라 내용(2·13·17), 일반어 word가 7/11. swap 문법은 4.n1 말고 통과 |
| 7 결정 11 | 3 | 쉬운 단어 25개 제거·ko 가르기는 타당. 남은 흠: 부사가 묶인 형용사 헤드워드(w-exact 9/13, w-fast 4/4), 구 헤드워드를 한 낱말로 둠(side·throw·away·weigh·figure), 틀린 ko(treat·confirm·last·judge·delay·bleed·smoke) |

## 사실 오류·심각한 문제
1. **[사실·안전] 6.4 "It's easy to forget that even a sip of water counts as breaking your fast."** — ASA 금식 지침은 맑은 액체를 수술 2시간 전까지 허용하고, 아침 약을 물 한 모금으로 먹으라고 안내하는 병원이 많아요(베타차단제 등). "한 모금도 금식 위반"을 그대로 배우면 꼭 먹어야 할 약을 막을 수 있어요. 금식 규칙을 정하는 것은 마취과 지시예요 → S1.
2. **[약속] 6.3 "Your surgery isn't canceled, …"** — 진행·취소는 마취과·집도의가 정해요. 같은 상황 slider 6.n0의 why("'그대로 진행'이라거나 '취소'라고 단정하면 간호사가 정하지 못하는 일을 약속")와 정면으로 어긋나요. order 6 넷째 줄 "Either way, your surgery isn't canceled."도 같음 → S2.
3. **[약속] 13.5 "No one outside this room needs to know the result."** — 결과는 차트에 올라가고 마취과·집도의가 봐요(같은 상황 KP 13.2 "between you and the care team"). 이 방 밖 아무도 모른다는 약속은 지킬 수 없어요. order 13 넷째 줄도 같음 → S3.
4. **[범위] 1.4 "This sounds like a real allergy, not just a side effect."** — 알레르기와 부작용을 가르는 것은 진단이에요. 간호사는 반응을 그대로 적고 알레르기로 기록해 두며 판단은 처방의·마취과가 해요. order 1 셋째 줄도 같음 → S4.
5. **[사실] 11.3 "Herbs and other supplements can thin the blood just like prescription medication."** — 일부(은행잎·마늘·고농도 생선기름·비타민 E 등)만 해당하고, "처방약처럼"은 과장이에요. w-thin example도 같은 과장 → S5.
6. **[사실] 12.4 "Smoking and drinking both make your airway a little harder to manage."** — 흡연은 기도 과민·분비물을 늘리지만, 음주가 기도를 어렵게 한다는 것은 근거가 약해요(음주는 마취제 요구량·금단·간 기능 문제) → S6.
7. **[안전·낮음] slider 17.n0** — cue "Right after the injection my face puffed up … but it passed"가 과거 일인지 지금 일인지 모호해요. 지금 일이면 '곁에서 지켜보기'만이 아니라 바로 마취과에 알려야 하는데 why에 보고가 빠졌어요 → N2.
8. **[범위·KP] 15.0 "… — RSI it is."** — 유도 방식은 마취과가 정해요. KP라 사용자 결정 → K1.

## 저작자가 짚은 것 — 판정
| 짚은 것 | 판정 |
|---|---|
| 15.0 "RSI it is"(KP) | **업무 범위 밖으로 읽힘.** K1(바꾸기 권고) |
| 15.2 윤상연골 압박(KP) | **유지.** "whenever you call for it"으로 마취과 요청에 맡기고 있어요. 근거 논란이 있고 병원마다 달라서 B가 why에 "마취과 요청 시, 병원 정책에 따라"를 넣을 것(K2) |
| 1.4 "real allergy" | **고침**(S4) — keyPhrase 아님 |
| 18.0 "malignant hyperthermia"(KP) | **유지.** "could be"로 짐작임을 밝히고, MH 가족력 선별은 간호 문진 범위예요(MHAUS). 진단이 아니라 왜 중요한지 말하는 문장(K3) |
| 6.4 "a sip of water counts as breaking your fast" | **틀림.** 고침(S1). 상황 제목 "물 한 모금 금식 위반"(in-json)은 손대지 않되, 문장이 규칙을 단정하지 않게 |
| 11.3 "just like prescription medication" | **과장.** 고침(S5), 11.0 KP "some affect bleeding"은 정확하니 유지 |
| 12.4 smoking and drinking "harder to manage" | **음주 부분 과장.** 고침(S6) |
| 9.3 "your wife or partner" | **유지.** 장면 tagline에서 환자 스스로 "My wife says…"라고 했어요. 성별 가정이 아님 |
| 4.1 "Your numbers look good for right now."(KP) | **유지.** 측정한 활력징후가 정상 범위라고 알리는 것은 간호 범위(K4) |
| 7.0 Shellfish(KP) | **유지.** ACR 조영제 지침과 맞음(K6) |
| 13.0·13.1(KP) | **유지.** 소변 hCG는 병원 정책 의존이지만 문장은 사실. B why에 "병원 정책" |
| w-side 헤드워드 | S4로 1.4를 고치면 side·effect를 태그하는 문장이 없어져요 → w-side·w-effect 은행에서 지움(W1) |
| w-last ko '마지막으로' | **고침.** 11문장 중 9문장이 형용사(last dose·last meal) → ko `마지막`(W8) |
| w-thin example이 문장과 다름 | example은 짧은 한 문장이면 되니 다른 것 자체는 괜찮아요. 다만 같은 과장을 담고 있어 S5 새 문장으로 맞춤 |
| w-hyperthermia `고열증`·w-aspiration `흡인(폐로)` | hyperthermia는 유지. aspiration은 유지하되 같은 상황의 w-suction `흡인`을 `흡인기`로 갈라야 함(W9) |
| w-fast·w-flag·w-full 태그 빼기, w-family·w-know 제거 | **타당** |
| (B) 15.2·18.5·20.0·20.3 distractorsKo | B 몫. A 범위에서는 의견 없음 |

## keyPhrase 결정 필요 (en은 고치지 않음 — 사용자 결정)
| # | 현재 en | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 15.0 `We should treat this as a full stomach — RSI it is.` | 유도 방식(RSI)을 간호사가 정하는 말 | `We should treat this as a full stomach — I'll set up for RSI.` | **바꾸기** — chunks `["We should treat this", "as a full stomach", "— I'll set up", "for RSI", "."]`, words `[w-treat, w-full, w-stomach, w-set, w-rsi]`, ko `full stomach로 보고 RSI 준비할게요.` order 15 첫 줄·w-full·w-treat·w-rsi example·exKo도 이 문장으로, v46 필드 새로 |
| K2 | 15.2 `Cricoid pressure is ready whenever you call for it.` | 근거 논란·병원마다 다름 | — | **유지** (요청에 맡기는 말). why에 정책 단서 |
| K3 | 18.0 `That could be malignant hyperthermia — very important to know.` | 진단성으로 들릴 수 있음 | (`That may be linked to malignant hyperthermia, so it's very important to know.`) | **유지** |
| K4 | 4.1 `Your numbers look good for right now.` | 간호사가 수치를 평가 | — | **유지** |
| K5 | 0.2 `That timing looks fine, so we can go ahead as planned.` | 진행 여부를 간호사가 말하는 듯 | (`That timing looks fine, so we should be able to go ahead as planned.`) | **유지** (지시된 금식 시간을 지켰는지 확인하는 것은 간호 범위). 약한 권고로만 대안 |
| K6 | 7.0 `Shellfish allergy doesn't actually predict a contrast reaction.` | 설명 주체가 병원마다 다름 | — | **유지** |
| K7 | 17.1 `Until we know, we'll avoid the likely culprits.` | 약 선택은 마취과 | — | **유지** ("we"는 팀) |
| D1 | 12.2 ko `판단하는 거 아니에요, 그냥 솔직한 그림이 필요해요.` | "not judging"은 '탓하려는 게 아님'이고, '솔직한 그림'은 번역투 | ko `탓하려는 게 아니에요, 있는 그대로 알고 싶을 뿐이에요.` | **ko만 고침**(결정 11) — 이 문장의 distractorsKo 둘을 새 ko 틀로 다시, w-judge·w-honest·w-picture 중 이 문장이 example이면 exKo도 맞춤(w-judge·w-picture가 해당) |
| D2 | 7.0·7.1 ko `해산물` | shellfish는 갑각류·조개류. 해산물은 생선까지 포함해 알레르기 정보로 부정확 | `해산물` → `갑각류·조개류` | ko만 고침(낮음) — W15와 함께. 7.3도 같이, 각 문장 distractorsKo 다시 |

### KP chunks가 구 경계를 끊은 것 (보고만)
| 문장 | 현재 chunks | 끊긴 곳 |
|---|---|---|
| 1.1 | `Was it just a rash / , or any trouble / breathing or / swelling / ?` | `trouble`과 `breathing`이 갈림, `breathing or`가 접속사로 끝남 |
| 2.0 | `… / from your last / anesthesia / ?` | 명사구 `your last anesthesia` |
| 3.2 | `… / your blood pressure / pill / …` | 복합명사 `blood pressure pill` |
| 5.0 | `… / for your medication / dosing / .` | 복합명사 `medication dosing` |
| 5.2 | `… / the exact / right dose / .` | 명사구 `the exact right dose` |
| 6.0 | `… / , and at / what time / ?` | 전치사구 `at what time` |
| 6.1 | `… / to the anesthesia / team / .` | 복합명사 `anesthesia team` |
| 10.1 | `… / since your / stent / ?` | `since your stent` |
| 10.2 | `… / your full / cardiac history / .` | 명사구 |
| 11.2 | `… / about the bleeding / risk / .` | 복합명사 `bleeding risk` |
| 12.2 | `… / an honest / picture / .` | 명사구 |
| 13.0 | `It's a routine / safety test / …` | 명사구 `a routine safety test` |
| 14.0 | `When did / the cough / and congestion start / ?` | 주어 `the cough and congestion`이 동사와 묶임 |
| 15.2 | `… / whenever you call / for it / .` | 구동사 `call for` |
| 16.0 | `… / — I'm marking you / as / high-risk / .` | `as high-risk` |
| 17.0 | `… / around that / time / .` | `around that time` |
| 18.2 | `… / a safe / technique / .` | 명사구 |

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면 `chunks`·`ko`·`words`를 함께 바꾸고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 같은 문장을 쓰는 order 줄(B 몫이지만 맞춰야 함)·단어 example·exKo·뉘앙스 example도 맞추고, `changes-or-preop-assessment.yaml`에 적으세요(V16). 문장 `ko`만 바꿔도 distractorsKo 둘을 새 ko 틀에 맞춰 다시 쓰세요.

- **S1 ★[안전] 6.4** → en `It's easy to forget — anesthesia will decide if a sip with your pill counts.` · chunks `["It's easy to forget", "— anesthesia will decide", "if a sip with your pill", "counts", "."]` · ko `잊기 쉬운 일이에요. 약과 함께 마신 한 모금이 문제가 되는지는 마취과가 판단해요.` · words `[w-forget, w-anesthesia, w-decide, w-sip, w-count]`(w-water 태그 빠짐 — 0.1·0.5·6.0에 남음). w-forget example·exKo를 이 문장으로.
- **S2 [약속] 6.3** → en `This doesn't always mean your surgery is canceled — the timing may just shift.` · chunks `["This doesn't always mean", "your surgery is canceled", "— the timing", "may just shift", "."]` · ko `수술이 꼭 취소된다는 뜻은 아니에요, 시간만 조정될 수도 있어요.` · words `[w-mean, w-surgery, w-cancel, w-shift]`(w-need 빠짐 — 다른 문장에 많음). w-cancel·w-shift example·exKo, slider 6.n0 example·exKo, order 6 넷째 줄(`Either way, it doesn't always mean your surgery is canceled.` 같은 꼴로)도 맞춤.
- **S3 [약속] 13.5** → en `We won't share the result with anyone outside your care team.` · chunks `["We won't share", "the result", "with anyone", "outside your care team", "."]` · ko `결과는 진료팀 밖의 누구에게도 알리지 않아요.` · words `[w-result, w-outside, w-care, w-team]`. w-outside·w-result example·exKo, order 13 넷째 줄(`Because it's personal, we won't share the result outside your care team.`)도 맞춤.
- **S4 [범위] 1.4** → en `I'll record this as an allergy, and anesthesia will review it.` · chunks `["I'll record this", "as an allergy", ", and anesthesia", "will review it", "."]` · ko `알레르기로 기록해 두고, 마취과에서 검토할 거예요.` · words `[w-record, w-allergy, w-anesthesia]`. w-side·w-effect는 태그하는 문장이 없어져 은행에서 지움(word-remove). w-sound example은 KP 8.0으로, w-allergy example이 1.4였다면 새 문장으로. 상황 1의 서로 다른 단어는 tell·happen·take·penicillin·rash·trouble·breathe·swell·flag·chart·whole·team·reaction·need·treatment·record·allergy·note·severity·anesthesia·start로 8개 넘음(V3). order 1 셋째 줄 `From what you've described, this sounds like a real allergy.` → `From what you've described, I'll record it as an allergy.`
- **S5 [사실] 11.3** → en `Some herbs and supplements can thin the blood and raise bleeding risk.` · chunks `["Some herbs and supplements", "can thin", "the blood", "and raise bleeding risk", "."]` · ko `일부 한약재와 보조제는 피를 묽게 해서 출혈 위험을 높일 수 있어요.` · words `[w-herb, w-supplement, w-thin, w-blood, w-bleed, w-risk]`(w-medication 빠짐 — 다른 문장 6개에 남음). w-thin example·exKo를 이 문장으로.
- **S6 [사실] 12.4** → en `Smoking makes your airway a bit harder to manage, and drinking matters too.` · chunks `["Smoking makes your airway", "a bit harder to manage", ", and drinking", "matters too", "."]` · ko `흡연은 기도 관리를 조금 더 어렵게 하고, 음주도 중요해요.` · words `[w-smoke, w-airway, w-manage, w-drink, w-matter]`. w-smoke·w-manage example·exKo 맞춤.
- **S7 [부자연] 0.3** `since that clears your stomach the slowest` — 음식이 위를 비우는 게 아니라 위가 음식을 비워요 → en `Let's start with solid food, since your stomach clears it the slowest.` · chunks `["Let's start", "with solid food", ", since your stomach", "clears it", "the slowest", "."]` · ko `고형식부터 시작할게요, 위에서 가장 늦게 비워지거든요.` · words 그대로. w-clear·w-slow·w-start 중 이 문장이 example인 것(w-start·w-clear·w-stomach·w-slow) example·exKo 맞춤.
- **S8 [사실·낮음] 19.4** `Nobody told you to stop it` — 환자 말일 뿐 간호사가 확인한 사실이 아님 → en `If no one told you to stop it, this isn't your fault.` · chunks `["If no one told you", "to stop it", ", this isn't", "your fault", "."]` · ko `아무도 끊으라고 말씀드리지 않았다면 환자분 잘못이 아니에요.` · words 그대로. w-fault example·exKo, order 19 둘째 줄도 맞춤.
- **S9 [chunks 구 경계] (en·ko 그대로, chunks만 — decoy가 새 청크와 같지 않은지 V18로 다시 확인)**
  - 9.5 `before we go / back` → `["I'll bring this", "straight to anesthesia", "before we go back", "."]`
  - 10.3 `Do you get short / of breath` → `["Do you get", "short of breath", "walking up", "a flight of stairs", "?"]`
  - 11.5 `for extra / bleeding risk` → `["I'll report this", "so surgery", "can plan", "for extra bleeding risk", "."]`
  - 12.3 `and for how many / years` → `["About how many cigarettes", "a day", ", and", "for how many years", "?"]`
  - 14.5 `about today's / surgery` → `["I'll report your symptoms", "so anesthesia", "can decide", "about today's surgery", "."]`
  - 15.5 `once you're / ready` → `["Everyone knows the plan", ", so we can", "move fast", "once you're ready", "."]`
  - 16.3 `Exactly how did / your throat feel` → `["Exactly how", "did your throat feel", "— tight, swollen", ", or hard to breathe", "?"]`
  - 17.4 `to a serious / reaction` → `["Dizziness", "along with swelling", "can point", "to a serious reaction", "."]`
  - 19.3 `, and how / much` → `["When exactly", "did you take it", ", and", "how much", "?"]`
  - (4.3 `when people feel / nervous`는 경계상 허용 — 그대로)

## 고칠 것 — 단어 (결정 11 포함)
`changes-…yaml`에 `kind: word`(fields 명시)·`word-add`·`word-remove`로 적으세요. 헤드워드를 바꾸면 ipa·example·exKo·chips·decoyChips·distractorsEn을 함께 맞춥니다(id는 그대로).

- **W1 w-side·w-effect 지움** — S4 뒤로 태그하는 문장 없음(word-remove 둘). 뉘앙스 words에도 없음(확인).
- **W2 w-throw 헤드워드** `throw`(토하다는 throw up의 뜻) → en `throw up` · chips `[[throw], [up]]` · distractorsEn `[throw off, blow up]` · decoyChips `[grow, op]` · ipa `/ˌθroʊ ˈʌp/`.
- **W3 w-away 헤드워드** `away`(즉시는 right away의 뜻) → en `right away` · chips `[[right], [a, way]]` · distractorsEn `[far away, away from]` · ipa `/ˌraɪt əˈweɪ/`. cue `'지금 당장'이라는 뜻으로 보고·처치 앞에 붙이는 말`(○○ 빈칸 없이).
- **W4 w-weigh 헤드워드** `weigh`((의견을) 내다는 weigh in의 뜻) → en `weigh in` · chips `[[weigh], [in]]` · distractorsEn `[way in, weigh down]` · cue에서 "저울에 올려 무게를 달거나" 빼고 `결정 전에 담당자가 자기 의견을 보태 주는 일`.
- **W5 w-figure 헤드워드** → en `figure out` · chips `[[fig, ure], [out]]` · distractorsEn `[figure in, fill out]`(find out은 동의어라 안 됨).
- **W6 w-treat ko** `처치하다` — 두 문장 모두 "treat … as a full stomach"(~로 보고 다루다) → ko `(~로) 다루다` · distractorsKo `[(~로) 부르다, (~로) 옮기다]` · cue `어떤 상태라고 보고 그에 맞게 대하는 일 — '~로 보고 대비한다'고 할 때`.
- **W7 w-confirm ko** `확정하다` — 5문장 중 4문장이 '확인'(confirm with radiology·always confirm·can't confirm NPO·can't confirm his last meal) → ko `확인하다`(w-check는 이미 `점검하다`라 겹치지 않음). distractorsKo `[번복하다, 의심하다]` 그대로.
- **W8 w-last ko** `마지막으로` → `마지막` · distractorsKo `[처음, 다음]`.
- **W9 ★ w-suction ko** `흡인` — 같은 상황 15의 w-aspiration `흡인(폐로)`과 듣고 뜻 고르기에서 겹침. 두 문장(15.1·20.1) 모두 기계 → ko `흡인기` · distractorsKo `[주입기, 배액관]` · cue는 그대로 둬도 됨.
- **W10 w-exact 부사 묶임** — 13문장 중 9문장이 `exactly`(3.5·6.0·7.1·7.4·16.3·16.4·17.3·18.3·19.3). → **word-add `w-exactly`**: en `exactly` · ipa `/ɪɡˈzæktli/` · ko `정확히` · icon w-exact와 같게 · example KP 6.0 · exKo 6.0 ko · cue `어림이 아니라 딱 맞게 묻고 싶을 때 '몇 시·얼마나' 앞에 붙이는 부사` · tag `상태·정도` · distractorsEn `[directly, extremely]` · distractorsKo `[대충, 대략]` · chips `[[ex, act, ly]]` · decoyChips `[ix, lee]`. 9문장의 words에서 w-exact를 w-exactly로(sentence words 변경 9건). w-exact는 0.5·5.2·6.5·11.4에 남음.
- **W11 w-fast** — 4문장 모두 부사(beating a little fast·need it fast·move fast) → ko `빠르게` · distractorsKo `[깊게, 높게]` · distractorsEn `[far, first]`(지금 vast·fussy는 형용사).
- **W12 w-bleed·w-smoke ko 품사** — en은 동사인데 ko가 명사. w-bleed ko `출혈하다` · distractorsKo `[수혈하다, 응고하다]`. w-smoke ko `(담배를) 피우다` · distractorsKo `[(담배를) 끊다, (담배를) 사다]`.
- **W13 w-delay ko** `지연` — 19.2 "whether to delay"는 동사 → ko `미루다` · distractorsKo `[앞당기다, 서두르다]`(취소하다는 w-cancel ko라 피함).
- **W14 w-judge ko** `판단하다` — "I'm not judging"은 평가·비난 → ko `평가하다` · distractorsKo `[칭찬하다, 위로하다]` 그대로. D1과 함께.
- **W15 (낮음) w-shellfish ko** `해산물` → `갑각류·조개류` · distractorsKo `[육류·가금류, 견과류·씨앗]`(길이 확인함). cue가 이미 "새우·게·조개"라 맞음. D2와 함께.
- **W16 (낮음) w-closely ko** `가까이서` — watch closely는 '면밀히' → ko `면밀히` · distractorsKo `[대충, 드문드문]`.
- **W17 (낮음) w-thinner ko** `혈액 항응고제` — blood thinner는 항응고제·항혈소판제를 함께 부르는 말이고 10.1(스텐트 뒤)은 보통 항혈소판제 → ko `항혈전제` · distractorsKo `[혈압 강하제, 혈당 강하제]` 그대로. context 3.n1 ko도 같이.
- **W18 (낮음) w-stay ko** `유지되다` — 같은 상황 13의 w-keep `유지하다`와 겹침 → ko `(그대로) 남다` · distractorsKo `[(밖으로) 새다, (바로) 바뀌다]`.
- **W19 w-anyone distractorsKo** `[그 밖의 어딘가, 그 밖의 무언가]` — '그 밖의'는 else 뜻이라 섞임 → `[어디든, 무엇이든]`.
- **W20 w-malignant cue** `나쁘게 자라 생명을 위협할 만큼 악성인` — 종양 뜻. MH는 종양이 아님 → `빠르게 나빠져 생명을 위협하는 — 병 이름 앞에 붙어 위험하다는 뜻을 더하는 말`.
- **W21 (낮음) w-vital 헤드워드** — 문장은 늘 `vitals`이고 `vital` 홀로는 형용사(필수적인) → en `vitals` · chips `[[vi, tals]]` · distractorsEn `[vitamins, virus]`.
- **W22 (낮음) w-moment distractorsKo** `오랫동안`은 부사 → `오랜 시간`.
- **W23 (낮음) tag** — w-cigarette·w-smoke `소통`, w-period `시점·순서`는 분류가 안 맞음 → `상태·정도`(또는 기존 집합 안에서 가까운 것).

### distractorsEn 품사가 다른 것 (전부)
| 단어 | 정답 품사(문장 쓰임) | 오답 | 판정 |
|---|---|---|---|
| ★ w-cricoid | 형용사(cricoid pressure) | `asteroid`(명사, 분야 밖), thyroid | `[arytenoid, thyroid]`로(같은 후두 연골) |
| ★ w-daily | 부사(take daily)·형용사 | `dairy`(명사) | `[weekly, hourly]` |
| ★ w-fast | 부사(4/4) | `vast`·`fussy`(형용사) | W11대로 `[far, first]` |
| ★ w-during | 전치사 | `through`(품사는 같으나 '내내'로 뜻이 겹침) | `[despite, without]` |
| w-anyone | 대명사 | `anywhere`(부사) | 낮음 — `[anything, everyone]`도 가능 |
| w-trouble | 명사 | `double`(형용사가 주) | 유지(명사 용법 있음) |
| w-sound | 동사 | `found`·`wound`(동사지만 과거형으로 읽힘) | 유지 |
| w-count | 동사 | `court`(명사가 주) | 유지 |
| w-bleed·w-smoke | 동사(ko는 명사) | 동사 오답 | W12로 ko를 맞추면 해결 |
| 나머지 217단어 | — | — | 같은 품사 |

### decoyChips (전부 훑음 — 불쾌·장례·술·무기·비하 관점)
- ★ w-precaution `cow` → `caw` · ★ w-recovery `cow` → `cav`(cow는 여성 비하 속어)
- ★ w-cigarette `rat` → `ret`(모욕)
- ★ w-pill `pall` → `poll`(관 덮는 천, 장례)
- ★ w-period `rip` → `rid`(R.I.P.)
- ★ w-point `pint` → `pont`(맥주 단위)
- ★ w-dizziness `dis` → `des`(비속어 diss)
- (낮음) w-difficult `colt` → `calt`(총기 상표), w-fast `fist` → `fest`, w-stomach `ick` → `ach`
- 그 밖의 조각(`dye`·`rite`·`tar`·`shot` 류 포함)은 이 주제의 말이거나 무해해서 유지.

## 고칠 것 — 뉘앙스
- **N1 [slider 8.n0 · 정답 둘]** cue "threw up twice and felt sick all night"만으로는 Apfel 점수상 위험 인자 하나라 `Some risk for nausea`도 맞아요. → cue `After my last surgery I threw up twice and felt sick all night — I get carsick too, and I've never smoked.`(여성 환자 장면이면 위험 인자 셋 이상). why 끝에 `이전 PONV·멀미·비흡연 같은 위험 인자가 겹치면 고위험으로 표시해요.`
- **N2 ★[안전·낮음 · slider 17.n0]** cue를 과거 병력으로 분명히 하고 오늘 투약 장면으로 → cue `Years ago, an unknown injection made his face swell and his head spin. Anesthesia is about to give his first meds. How closely do you watch him?` · why 끝에 `붓기·어지러움이 다시 보이면 바로 마취과에 알려요.`
- **N3 [context 13.n1 · 어색함이 내용]** 장면 3 `The result is confidential, but she is two weeks pregnant.`은 말투가 아니라 비밀 누설(내용)이고, 가족 앞에서 임신 검사를 했다는 것 자체도 새요. → 장면 3 en `Per HIPAA, her information is confidential and cannot be disclosed.` · fix `I'm sorry, I can't share her health information, but she's welcome to tell you herself.` · why `뜻은 셋 다 '비밀의'예요. 환자와 진료팀에는 비밀이 지켜진다고 말하지만, 가족에게 법 조항처럼 말하면 차갑게 들려요. 무엇을 검사했는지도 말하지 않고, 정중하게 본인에게 들으시라고 해요.`
- **N4 [context 17.n1 · 어색함이 진단]** 장면 3 `… likely secondary to hypotension`은 원인 단정(내용)이라 같은 뜻이 아님 → en `We're monitoring your dizziness and facial angioedema for progression.` · fix 그대로 · why에서 진단 부분을 빼고 `angioedema·progression 같은 임상어는 환자에게 낯설어 불안을 키워요. 증상을 쉬운 말로 확인하고 지켜보겠다고 말해요.`
- **N5 [context 19.n1 장면 1 · 범위]** `I'll reassess his bleeding risk …`(간호사가 출혈 위험을 재평가) → `Once we confirm the last dose, the team will need to reassess his bleeding risk.`(같은 상황 19.5 "so the team can reassess"와 맞음).
- **N6 [context 2.n1 · 어색함이 내용 + 일반어]** 장면 3 `… no big deal, some nausea or whatever.`는 말투가 아니라 축소(내용)이고 nausea는 일반어. → swap으로 바꾸기 권고: who `간호사 → 마취팀 · 병력 전달` · icon `speech` · before `["", "She felt a little queasy, no big deal", "."]` · options `[She had nausea after her last anesthesia, She felt a little queasy, no big deal, She had a hard time last time]` · answer 첫째 · notes 셋(사실과 시점을 분명히 / 축소해서 위험 정보로 안 들림 / 무엇이 힘들었는지 빠짐) · ko `지난번 마취 뒤에 메스꺼움이 있었어요` · words `[w-nausea, w-anesthesia]`. context로 두려면 장면 3을 말투만 다르게: en `Nausea last time, she said, kinda pukey, idk.` · fix `She had nausea after her last anesthesia, so I wanted you to know.`
- **N7 (보고만) 일반어 word** — allergy(1.n1)·thinner(3.n1)·estimate(5.n1)·supplement(11.n1)·dizziness(17.n1)는 일반인도 아는 말이고 어색함은 둘러싼 임상어·말투에서 와요. 듣는 사람은 세 장면 모두 다름(스크립트 확인), word는 세 장면 `en`에 모두 있음(W14 0건). 핸드오프 모양(word 자체가 듣는 사람에게 안 맞음)에 맞는 것은 PONV(8.n1)·reassess(19.n1)뿐. airway(9.n1)·aspiration(15.n1)은 차트 자리에 구어를 쓴 경우라 '자리'로 허용.
- **N8 [swap 4.n1 문법]** 정답 `Your pulse is a bit fast, which is common when nervous.` → `…, which is common when you're nervous.`(answer·options·notes 키 같이). 오답 `Your heart rate is tachycardic, above the usual range.` → `You're tachycardic, above the usual range.`(tachycardic은 사람에게 붙음).
- **N9 [swap 6.n1 ko]** `마취과에 알려서 결정하도록 할게요` → `마취과가 결정할 수 있게 알려야 해요`(en은 "I need to").
- **N10 (낮음) [swap 16.n1 ko]** `…팀에 표시해 둘게요`의 '팀에'는 en에 없음 → `심각한 반응 같아서 표시해 둘게요`.
- **N11 slider 6.n0 example** — S2를 따라 새 6.3으로.
- swap 10개를 이어 붙인 30줄은 4.n1 말고 모두 문법이 맞음(14.n1 `Your call?`은 수술실 구어로 허용). swap ko는 6.n1·16.n1 말고 바꾼 문장의 뜻과 맞음.
- slider 나머지(0·1·2·3·4·5·6·7·9·10·11·12·13·14·15·16·18·19·20)는 약함→강함 순서·cue로 정답 하나·why 사실 모두 통과. 3.n0·7.n0·18.n0은 강도라기보다 확실성·대응 단계의 줄이지만 순서가 분명해 허용.

## 기계적 전수 확인 결과
- **pair**: 이 주제에 0개 — 해당 없음.
- **chunks**: 126문장 전부 `/`로 이어 봄. 고칠 것 S9(9문장) + 바꾸는 문장(S1~S8). KP 17문장은 위 표(보고만).
- **distractorsEn 품사**: 위 표.
- **swap**: 10개 × 보기 3 = 30줄 이어 봄 → N8 하나.
- **context**: 11개 모두 word가 세 장면에 있음, 듣는 사람 세 장면 모두 다름 → N3~N7.
- **ko 겹침**(조사 떼고 묶음): suction/aspiration ★(같은 상황), keep/stay(같은 상황, 낮음), nausea/sick(같은 상황이지만 품사 다름 — 유지), flag/mark·matter/important(상황 다름 — 유지).
- **길이**: 기존 오답 전부 통과. w-anyone `그 밖의 어딘가`(6자) vs `누구든`(3자)은 3자 차이라 규칙상 통과(검사기 구멍 아님). 이 목록의 새 오답도 전부 길이 확인함.

## 종합
고칠 것 49건(문장 9 · 단어 27 — W1~W23과 품사 표 ★ 3건·decoyChips 1묶음 · 뉘앙스 11 · KP ko 2; KP en 결정은 별도 표), 그중 안전 2(S1·N2). 핵심은 S1~S6(물 한 모금 단정·지킬 수 없는 약속 둘·진단성 발언·과장 둘), 헤드워드·ko(W2~W14), 불쾌한 decoyChips, context 내용 어색함(N3·N4·N6)입니다. 이것들을 고친 뒤면 내보내도 됩니다. KP는 15.0만 바꾸기 권고, 나머지는 유지.
