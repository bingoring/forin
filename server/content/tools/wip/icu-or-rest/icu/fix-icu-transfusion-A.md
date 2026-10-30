# icu-transfusion — A 검토 (v45 1~7 · 기계적 전수 확인 · v46 7번)

대상: `icu-transfusion.yaml`(A·B 합본). 단어 286(base 299, 13 삭제·추가 0), 상황 21(문장 147), 뉘앙스 43(slider 19 · pair 2 · context 21 · swap 1 · reel 0).
비교: base·changes(76건)·in-json·notes-A. 임시 스크립트 `rv_icu-transfusion_dump.py`(words / sents / nuance / context / swap / checks / stats), 출력 `_rv_icu-transfusion_*.txt`.
번호는 "상황 번호.문장 번호"(둘 다 0부터, notes-A와 같음).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 distractorsEn | 4 | 철자·소리 닮음이 좋고 품사도 거의 같음. 품사·분야가 어긋난 것 6(★ 1: pain→plain) |
| 2 distractorsKo·길이 | 4 | 길이 규칙 전부 통과. w-key `단서`가 key의 다른 뜻이라 정답 둘 위험 1 |
| 3 cue | 3 | 정답 노출 없음. ko를 되풀이한 cue 10개, w-signal cue가 명사 뜻(ko는 동사) |
| 4 chips/decoyChips | 3 | 자르기는 좋음. 술·죽음·대마 조각 4개(★)와 가벼운 속어 몇 개 |
| 5 뉘앙스·문장 사실 | 2 | 수혈 중 새 증상인데 멈추지 않음(13.3), IM 에피를 push(16.5), 맥박 있는 환자에게 코드팀(16.3 KP), 간호사의 진단 단정(16.1·17.1·18.1), 처방 없는 투약 어조(10.6·19.6), swap why "hives는 용어" 오류 |
| 6 뉘앙스 설계 | 3 | pair 성분의 주어-동사 일치로 답이 보임, swap 셋째 선택지가 뜻이 다른 말, 혈소판 slider가 간호사 단독 보류를 가르침, context 4개는 일반어 word |
| 7 결정 11 | 4 | 삭제 13/299(4%), 문장 26건은 words만 바꿈 — 과하지 않음. 남은 흠: vital 헤드워드, away=즉시, risk ko, close ko, wish 희망 |

## 사실 오류·심각한 문제
1. **[안전] 13.3 "A little redness alone doesn't mean we stop the unit."** 미국 수혈 관행에서는 수혈 중 새 증상이 보이면 **먼저 멈추고 평가하고 보고**합니다(경미한 두드러기도 멈춘 뒤 처방에 따라 재개). 간호사가 "멈추지 않아도 된다"고 정해 버리는 문장이라 위험 → S1.
2. **[안전] 16.5 "I'll push a second dose if she doesn't improve."** 아나필락시스 에피네프린은 IM으로 반복합니다. `push`는 IV push로 들리고, IV 볼루스 에피네프린은 부정맥 위험 투약 오류입니다. 반복을 간호사 판단으로 정하는 어조이기도 함 → S2.
3. **[안전·KP] 16.3 "I'm opening fluids wide and calling the code team."** 코드팀은 심정지(맥박 없음) 호출입니다(이 주제 w-code cue도 그렇게 가르침). 저혈압·협착음이 있지만 맥박이 있는 ICU 환자는 담당 중환자 전담의·담당의(기도는 마취과/기도팀)를 부릅니다. 수액 최대 개방도 처방·프로토콜 전제가 없음 → 사용자 결정 K1.
4. **[범위] 간호사의 진단 단정** — 16.1 "This is anaphylaxis"(S3), KP 18.1 "this is TRALI, not overload"(K2), KP 17.1 "this is DIC"(K3). TRALI는 배제 진단이고 셋 다 의료진이 내리는 진단입니다. 같은 주제 6.2는 "This looks like…"로 바르게 씀.
5. **[범위] 처방·프로토콜 전제 없는 투약** — 10.6 "I'll give calcium now…"(S4), 19.6 "keep pushing calcium every time we hang another unit"(S5, 제제마다 칼슘은 사실로도 과장 — 프로토콜은 보통 몇 단위마다 또는 이온화 칼슘 수치에 따라), 12.2 "we can hold off…"(S6, 보류 판단도 처방), KP 13.1 항히스타민제 투여에 보고 단계가 없음(K4).
6. **[사실] swap 알레르기 `why` "hives나 urticaria 같은 용어보다"** — 미국에서 hives는 일반인이 쓰는 말입니다(urticaria만 전문어). 틀린 해설 → N3.
7. **[사실] 12.5 "If he starts bleeding, we transfuse right away."** + 그 why "수치와 상관없이 바로 수혈을 결정해요" — 출혈이 시작되면 더 높은 치료 기준이 적용될 뿐 수치와 무관하게 혈소판을 주지 않고, 수혈 결정은 처방입니다 → S7.
8. **[약속] 14.6 "We'll use cell salvage…"** — 세포회수 수용은 여호와의 증인 환자마다 다르고(연속 회로일 때만 받는 사람도 있음) 수술 팀이 정하는 것이라 ICU 간호사가 약속할 수 없음 → S8.

## 고칠 것 — 문장 (keyPhrase 아님)
문장 en을 바꾸면: `chunks`·`ko`·`words` 함께 바꾸고, 그 문장의 **v46 필드(tag·icon·why·decoy·distractorsKo 둘·blank)를 새로 쓰고**, 그 문장을 `example`로 쓰는 단어의 `example`·`exKo`, 같은 문장을 쓰는 order 줄, 그 문장을 example로 쓰는 slider/context도 맞추고, `changes-icu-transfusion.yaml`에 적기(V16). 어느 문장도 태그하지 않게 된 단어는 word-remove.

- **S1 [안전] 13.3** · en `Even a little redness means we pause the unit and check her.` · chunks `Even a little redness / means / we pause the unit / and check her / .` · ko `약간의 발적이라도 제제를 잠시 멈추고 환자를 살펴봐요.` · words `[w-redness, w-pause, w-unit, w-check]` → w-alone은 미사용이 되어 은행에서 삭제(word-remove). w-redness·w-alone example(4056·4077행) 맞추기. why 새로: "수혈 중 새로 생긴 증상은 가벼워 보여도 일단 멈추고 활력징후를 재고 보고해요. 재개는 처방에 따라요."
- **S2 [안전] 16.5** · en `Per protocol, I'll give a second IM dose if she doesn't improve.` · chunks `Per protocol / , I'll give / a second IM dose / if she doesn't improve / .` · ko `호전되지 않으면 프로토콜에 따라 근육주사로 두 번째 용량을 줄게요.` · words `[w-protocol, w-give, w-second, w-im, w-dose, w-improve]`(w-push는 다른 문장에 남음). w-second·w-dose example(5007·5028행 근처), order 줄 10132행 "If she still doesn't improve, I'll push a second dose." → "If she still doesn't improve, I'll give a second IM dose per protocol."
- **S3 [범위] 16.1** · en `This looks like anaphylaxis — get the epi now.` · chunks `This looks like / anaphylaxis / — get the epi / now / .` · ko `아나필락시스 같아요 — 지금 에피네프린 가져와 주세요.`(지금 ko `주세요`는 "주사해 달라"로도 읽힘) · words 그대로. w-anaphylaxis·w-epi example(4778·4801행), order 줄 10124행 `This is anaphylaxis — stop…` → `This looks like anaphylaxis — stop…`.
- **S4 [범위] 10.6** · en `I'll give calcium per protocol before it drops any further.` · chunks `I'll give calcium / per protocol / before it drops / any further / .` · ko `더 떨어지기 전에 프로토콜에 따라 칼슘을 줄게요.` · words `[w-calcium, w-protocol, w-drop, w-further]`. w-calcium example(3449행), order 줄 8625행 맞추기.
- **S5 [범위·사실] 19.6** · en `I'll keep giving calcium per protocol as we hang more units.` · chunks `I'll keep giving calcium / per protocol / as we hang / more units / .` · ko `제제를 더 거는 동안 프로토콜에 따라 칼슘을 계속 줄게요.` · words `[w-keep, w-calcium, w-protocol, w-hang, w-unit]`(w-push는 19.1·19.2에 남음). order 줄 10890행 맞추기. why 새로(“제제마다”라고 쓰지 말 것).
- **S6 [범위] 12.2 + 혈소판 slider** · en `So the team may hold off and just recheck his count later.` · chunks `So the team / may hold off / and just recheck / his count later / .` · ko `그래서 팀에서 보류하고 나중에 수치만 다시 확인할 수도 있어요.` · words `[w-team, w-hold, w-recheck, w-count, w-later]`. w-hold·w-later example(3747·3766행), order 줄 9109행, **slider(혈소판) example 9077행** 맞추기. slider는 S6과 짝 — 아래 N5.
- **S7 [사실] 12.5** · en `If he starts bleeding, I'll call the provider right away.` · chunks `If he starts bleeding / , I'll call / the provider / right away / .` · ko `출혈이 시작되면 바로 의료진에게 연락할게요.` · words `[w-bleed, w-call, w-provider, w-away]`(w-transfuse는 20.0에 남음). w-transfuse example(3892행)을 20.0 문장으로. why 새로: "출혈이 시작되면 더 높은 치료 기준이 적용되니 바로 알려 처방을 받아요."
- **S8 [약속] 14.6** · en `We can ask about cell salvage, and we'll use smaller lab tubes.` · chunks `We can ask / about cell salvage / , and we'll use / smaller lab tubes / .` · ko `세포회수를 쓸 수 있는지 알아보고, 검사 튜브는 더 작은 것을 쓸게요.` · words `[w-ask, w-salvage, w-small, w-tube]`. example 4455·4476·4495행 맞추기. why 새로: "세포회수는 수술 중 쓰는 방법이고 받아들일지는 환자마다 달라 미리 물어봐요."
- **S9 [약속·권장] 20.6** "We'll make sure his care matches his wishes." — 팀을 주어로 한 흔한 완화의료 말이라 그대로도 됩니다. 간호사 단독 약속으로 덜 들리게 하려면 · en `We'll work with the team so his care matches his wishes.` · chunks `We'll work / with the team / so his care / matches his wishes / .` · ko `그분의 돌봄이 그분 뜻에 맞도록 팀과 함께 애쓸게요.` · words `[w-team, w-care, w-match, w-wish]`. example 5867행, order 줄 11131행.
- **S10 [부자연] 7.3** "a raised jugular vein" — 영어로는 raised JVP 또는 distended neck veins라고 함 · en `Crackles and a distended jugular vein point us toward TACO.` · chunks `Crackles / and a distended jugular vein / point us / toward TACO / .` · ko 그대로 · words 그대로. example 2628·2649·2671행, order 7881행.
- **S11 [부자연] 8.2** "units we send up" — 혈액은행이 보내는 것이라 ICU 간호사 입장에서는 어긋남 · en `Keep the ratio steady no matter how many units come up.` · chunks `Keep the ratio / steady / no matter how many units / come up / .` · ko `제제가 몇 개 올라와도 비율은 일정하게 유지하세요.` · words `[w-ratio, w-steady, w-unit]`(w-send 다른 문장에 남음).
- **S12 [부자연] 19.0** "His QT is stretching" — 임상에서는 prolonging/getting longer라고 함 · en `His QT is getting longer and he's about to arrest.` · chunks `His QT / is getting longer / and he's / about to arrest / .` · ko 그대로 · words `[w-qt, w-arrest]` → w-stretch 미사용, 은행에서 삭제(changes의 w-stretch 항목은 word-remove로 바꿈). example 5581·5600행, order 10878행, **slider(심정지) cue 10843행** `His QT is getting longer, but he still has a pulse and a pressure.`
- **S13 [chunks] 구 경계를 끊은 조각(en 그대로; blank·decoy가 걸리면 함께 확인)**
  - 0.2 `and you check / it against the bag` → `I'll say / the blood type / and you check it / against the bag / .`
  - 3.3 `or he's actively / bleeding` → `Platelets help / when his count is low / or he's / actively bleeding / .`
  - 4.3 `for almost / an hour` → `This one's / been out / for almost an hour / already / .`
  - 5.6 `looks within / normal range` → `So far / every reading / looks / within normal range / .`
  - 6.2 `an acute / hemolytic reaction` → `This / looks like / an acute hemolytic reaction / .`
  - 8.5 `as it goes / up` → `I'll / call out / each product / as it goes up / .`
  - 8.6 `every unit / number` → `Someone / needs to log / every unit number / for the chart / .`
  - 10.2 `after every few / units` → `I'm checking / his ionized calcium / after / every few units / .`
  - 15.6 `every ten / minutes` → `Someone / call out / the running totals / every ten minutes / .`
  - 16.6 `Get the crash / cart` → `Get / the crash cart / to the bedside / right now / .`
  - 17.6 `on the sepsis / workup` → `I'll coordinate / with the team / on / the sepsis workup / .`
  - 18.0 `acute respiratory / failure` → `She's in / acute respiratory failure / right after / the plasma / .`
  - 18.5 `adjust her ventilator / settings` → `I'll help the team / adjust / her ventilator settings / .`
  - 18.6 `I'll keep close / watch` → `I'll keep / close watch / on her oxygen levels / tonight / .`
  - 20.0 `but he keeps / bleeding` → `We keep transfusing / , but / he keeps bleeding / .`
  - 판정만: 8.0 `the massive transfusion / protocol`(6낱말 → 3조각), 9.5 `in about / an hour`(9낱말 → 4조각)은 조각 수 규칙 때문에 더 붙일 수 없음 — 유지. 위 제안도 9낱말 이상은 4조각을 맞추려고 `I'll`·`Someone`·`after`·`on` 같은 짧은 조각을 따로 둠(스크립트로 조각 수 확인함).
- **S14 [ko] 대명사 "그/그녀"** — 3.6 `그의 검사 결과 때문에…` → `이 환자 검사 결과에 맞춰 이 성분을 고른 이유를 설명할게요.` · 13.6 `그녀의 과거력을 감안하면…` → `과거력을 감안하면 이번엔 전처치해야 할까요?` · 20.5 `그에게 가장 중요했던 게…` → `그분께 가장 중요했던 게 뭔지 말씀하신 적이 있나요?` 각 문장 distractorsKo 둘을 새 ko에 맞춰 다시.
- 판정만(notes-A): 7.5 `apply extra oxygen`·1.0 KP `run it slow for the first fifteen minutes` — 산소 용량·시작 속도는 처방/정책이지만 문장 자체는 일상적 간호 행동이고 slider why가 "처방대로"를 말함 — 유지. 4.0·4.1 30분·4시간 — 병원 정책 문구가 why에 있음, 유지.
- **S15 [권장] 한 상황 안 환자 성별 섞임** — 수혈 전 0.1 `her name` / 0.6 `with him`; TACO 7.0 `She's` / 7.5 `sit him upright`(slider example·context 동료 장면도 him). 0.1 → `his name`, 7.5 → `I'll sit her upright and apply extra oxygen.`(slider example, context 동료 장면 `help me sit her upright`).

## 사용자 결정 필요 — keyPhrase 문장 (en은 고치지 않음)
KP en을 바꾸기로 하면 `in-icu-transfusion.json`의 `keyPhrases` 같은 문자열도 함께 바꿔야 V4가 통과합니다. chunks·ko·words·v46 필드·example·order 줄 연쇄는 위 문장과 같음.

| # | 문장 | 문제 | 대안 en | 권고 |
|---|---|---|---|---|
| K1 | 16.3 `I'm opening fluids wide and calling the code team.` | [안전] 맥박 있는 환자에게 코드팀(심정지 호출); ICU에서는 담당의 호출. 수액 최대 개방은 처방·프로토콜 전제 없음 | `I'm starting a fluid bolus and calling the ICU doctor now.` | **바꾸기**(w-wide·w-code 태그 빠짐 — w-wide는 은행 삭제, w-code는 19.x에 남음). order 10128행, why "기도 문제가 있어 코드 팀" 같이 고침 |
| K2 | 18.1 `Stop the transfusion — this is TRALI, not overload.` | 간호사의 진단 단정, TRALI는 배제 진단 | `Stop the transfusion — this looks like TRALI, not overload.` | **바꾸기** (order 10633행) |
| K3 | 17.1 `He's bleeding from every puncture site — this is DIC.` | 진단 단정(같은 이유, 정도는 약함). chunks `every puncture / site`도 끊김 | `He's bleeding from every puncture site — this looks like DIC.` | 바꾸기(약) (order 10375행) |
| K4 | 13.1 `For mild hives, I'll pause and give an antihistamine.` | 보고 단계가 없고 투약이 간호사 판단으로 들림(경미한 두드러기도 멈춤→보고→처방대로 투약·재개) | `For mild hives, I'll pause it and ask the provider about an antihistamine.` | 바꾸기 권고(병원 수혈 반응 standing order가 있으면 유지 가능) |
| K5 | 3.1 `FFP replaces clotting factors, platelets treat thrombocytopenia.` | 쉼표로 두 절을 이은 문법 오류 | `FFP replaces clotting factors, and platelets treat thrombocytopenia.` | 바꾸기(위험 낮음) — 단어 example 7곳(1274~1396행) 같이 |
| K6 | 9.2 `Low fibrinogen means we should give cryoprecipitate.` | 성분 선택이 간호사 판단처럼 들림 | `Low fibrinogen usually calls for cryoprecipitate.` | 유지 가능(팀 차원의 추론이고 9.3에서 처방자에게 물음) |
| K7 | 11.1 `I'll give four-factor PCC and IV vitamin K now.` | 처방 전제가 문장에 없음 | — | 유지(처방 받은 투약을 알리는 표준 말; why에 "처방에 따라" 있음) |
| K8 | 16.2 `Stop the transfusion — I'm giving IM epinephrine now.` | 처방 전제 없음 | — | 유지(아나필락시스 프로토콜·standing order 흔함, 경로 IM 정확) |
| K9 | 19.1 `…— I'm pushing calcium now.` / 19.4 `Keep giving calcium with each round of products.` | 처방 전제 없음 | — | 유지(MTP 프로토콜에 칼슘 보충 포함, 심정지 직전 IV push는 맞는 경로) |
| K10 | 17.3 `I'll replace fibrinogen, platelets, and plasma per the labs.` | 근거가 처방이 아니라 검사로 읽힘 | `We'll replace fibrinogen, platelets, and plasma per the orders.` | 유지 가능(검사 기반 처방이 보통) — 대신 문장 why에 "처방대로" 넣기 |
| K11 | 14.5 `We can maximize iron and minimize blood draws.` | 철분은 처방 | — | 유지(팀 주어, 선택지 설명) |
| K12 | 15.2 `You track products, you push blood, I'll run the rapid infuser.` | 두 you가 누구인지 | `You track products, you push blood, and I'll run the rapid infuser.` | en 유지(가리키며 하는 역할 배정은 자연스러움), **ko만 고침**(아래 KO2) |
| K13 | chunks만 끊김 | 0.5 `and in / the chart`, 1.0 `for the first / fifteen minutes`, 2.0 `a transfusion / reaction`, 7.2 `with normal / filling pressures`, 8.4 `is on / the way`, 11.2 `the specific reversal / agent`, 12.3 `for a higher / count`, 17.1 `every puncture / site` | — | 보고만 |

## 고칠 것 — keyPhrase ko (결정 11 범위, en은 그대로)
ko를 고치면 그 문장의 distractorsKo 둘도 새 ko에 맞춰 다시 쓰기.
- **KO1 12.1** `예방적 역치는 보통 만이에요.` → `예방적 역치는 보통 1만이에요.`
- **KO2 15.2** `당신은 … 당신은 …` → `한 분은 성분을 추적하고, 다른 한 분은 혈액을 밀어 넣고, 저는 급속주입기를 맡을게요.`
- **KO3 20.4** `그가 원했을 것에 대해…` → `그분이 원하셨을 것에 대해 이야기해 봐요.`
- **KO4 3.1** `FFP는 응고인자를 대체하고` → `FFP는 응고인자를 보충하고, 혈소판은 혈소판감소증을 치료해요.`(w-replace ko `보충하다`와 맞춤; 선택)
- KO5(선택) 10.1 `…결합해서 이온화 칼슘을 감시할게요.` → `시트르산염이 칼슘과 결합하니까 이온화 칼슘을 감시할게요.`

## 고칠 것 — 뉘앙스
- **N1 pair 혈액 성분 [답이 문법으로 보임]** — 오른쪽이 모두 복수 동사(`raise/treat/replace`)라 단수 `Plasma`와 이으면 정답 짝도 비문("Plasma replace clotting factors"). → pairs `[[Packed red cells, raise oxygen-carrying capacity], [Platelets, treat thrombocytopenia], [Plasma units, replace clotting factors]]`, decoys `[sign the consent]` 그대로. 전 조합 다시 봄: 정답 짝 말고는 사실로 틀림(Platelets raise O2 capacity ✕, Packed red cells replace clotting factors ✕, Plasma units treat thrombocytopenia ✕), decoy는 어디에도 안 붙음 — 정답 하나. words에 w-plasma 추가.
- **N2 pair 수혈 반응 징후** — 12개 조합 판정: `keep the provider`(updated 없이 불성립), `take the provider` ✕, `keep a full set of vitals` ✕(keep a record는 되지만 이건 아님), `notify the line open`·`take the line open` ✕, decoy `the expiration`은 notify/keep/take 어디에도 ✕. **정답 하나, 유지.** (저작자 우려한 keep/take 느슨함은 성립하는 다른 짝이 없어 문제 아님.)
- **N3 swap 알레르기 [why 사실·선택지]** — why `hives나 urticaria 같은 용어보다` → `urticaria 같은 의학 용어보다 눈에 보이는 모습을 쉬운 말로 알려 줘요. hives는 환자도 쓰는 말이에요.` 셋째 선택지 `a blood clot`은 말투가 아니라 뜻이 다른 말이라 swap 설계에 안 맞음 → before `["You have ", "urticaria", " from the blood, so I've paused it."]`, options `[a few itchy bumps, urticaria, a dangerous reaction]`, answer `a few itchy bumps`, notes `a dangerous reaction: "사실보다 무겁게 들려 불안을 키운다."`, ko `피 때문에 가려운 두드러기가 조금 올라와서 수혈을 잠시 멈췄어요`(멈춘다는 점이 미국 관행과도 맞음). 세 선택지 이어 읽기 문법 확인함. (지금 swap ko는 지금 정답 문장 뜻과는 맞음.)
- **N4 [안전] slider TRALI 급성 호흡부전** — 정답 `stop it and report to the blood bank`에 의료진 호출이 없음 → `stop it, call the provider, and report it`. why에 "의료진에게 알리고 혈액은행에 백과 튜빙을 반납하며 보고" 넣기.
- **N5 slider 혈소판 수혈 적응 판단 [S6과 짝]** — 지금은 간호사가 보류를 정하는 것을 정답으로 가르침. scale `[hold off and recheck later, transfuse later today, transfuse right away]`, answerAt 0, why 첫머리에 "보류도 의료진 계획(처방)에 따라요" 넣고 "(흔히 1만)"은 `1만/μL`로. example을 새 12.2로.
- **N6 slider 대량수혈 저칼슘 심정지** — cue `His QT is stretching` → S12대로 `His QT is getting longer, but he still has a pulse and a pressure.`
- N7(권장) slider 혈액 취급·보관 — scale `[hang it now, hang it and run it faster, send it back for a new one]`는 강도 순서가 아님(가운데가 더 '센' 쪽이 아님). → `[hang it now, call the blood bank first, send it back for a new one]`, answerAt 0. 나머지 slider 15개는 약함→강함 순서와 cue로 정답 하나 — 유지. (수혈 거부 cue의 종교 언급은 장면상 필요 — 유지.)
- **N8 context 대량수혈 저칼슘 심정지 (code)** fix `…we need to ask you to step outside so the team can work.` — 미국 병원은 심폐소생 중 가족 동석을 선택지로 주는 곳이 많음(AHA·ENA 지지). 나가라고 정해 말하지 않게 → fix `His heart may stop, and the team is getting ready to help him. Someone will stay with you.` why 끝의 "왜 자리를 비켜야 하는지"를 "무엇을 준비하는지"로.
- **N9 context 혈소판 (threshold)** 의사 장면 `I'll ask which threshold applies for him today.` — 의사에게 "물어보겠다"고 말하는 꼴 → `Which threshold applies for him today?`
- **N10 context 아나필락시스 (airway)** 의사 장면 `…so I'm preparing to intubate.` — 삽관은 의사가 함 → `Her airway is compromised, so I'm setting up for intubation.`
- **N11 context — 일반어 word, fix에도 word가 남는 4개(권장)**: 어색함이 word가 아니라 주변 전문어에서 옴. 세 장면이 자연스럽게 공유할 이 상황 임상어로:
  - 혈액 성분 `low` → word `fibrinogen`(ko 섬유소원): 의사 `His fibrinogen is low, so I'm asking about cryo.` / 동료 `His fibrinogen came back low, so cryo is on the way.` / 가족(✕) `His fibrinogen is low and his INR is up — consistent with coagulopathy.` fix `His blood isn't clotting well, so we're giving him the part of blood that helps it clot.` words `[w-fibrinogen]`.
  - 급성 용혈 `reaction` → word `hemolytic`(ko 용혈성의): 의사 장면 그대로 / 혈액은행 `I need to report a possible hemolytic reaction.` / 환자(✕) `You're having an acute hemolytic transfusion reaction.` fix 그대로. words `[w-hemolytic]`.
  - TACO `oxygen` → word `oxygenation`(ko 산소화): 의사 `Her oxygenation is getting worse on high-flow.` / 동료 `Let's sit her up to help her oxygenation.` / 환자(✕) `I'm supporting your oxygenation with a non-rebreather.` fix 그대로. words `[w-oxygenation]`.
  - 혈액 취급 `check`: 공유할 임상어가 마땅치 않음 — 유지(TASK 9 끼워 넣기 금지).
  - why는 바뀐 word를 설명하게 다시 쓰기.
- context 21개 판정: 세 장면 모두 `word` 있음(W14 0). 장면마다 듣는 사람이 의사(또는 혈액은행)/동료/환자·가족으로 모두 다르고, 어색한 장면은 모두 환자·가족에게 한 말이며 fix는 같은 뜻. 나머지 일반어 word(confirm·watch·notify·stable·ratio·product·drop·reverse·mild·respect·track·site·report·honest)는 fix에서 그 말이 빠져 쉬운 말로 바뀌므로 핸드오프 모양으로 인정(재설계 권하지 않음). `code`·`threshold`·`airway`·`product`가 가장 핸드오프다운 것.
- **뉘앙스 why·notes 사실 판정** — 동의서·두 사람 침상 확인·식별자 둘(0.1 이름+생년월일)·첫 15분 천천히·곁에서 관찰·기저 활력징후·반응 의심 시 즉시 중단·새 튜빙 생리식염수로 라인 유지(6.1·slider 6·13·16)·의료진과 혈액은행 보고·백과 검체 반납(6.4)·TACO(고혈압·수포음·경정맥)/TRALI(정상 충만압·공여자 조사) 구분·혈소판 예방 기준 1만은 처방대로·승인된 혈액 가온기(slider 8 "임의의 방법으로 데우지 않아요")·냉장고에서 나온 지 30분·4시간 안 완료(병원 정책 의존 문구 있음) — 모두 미국 관행에 맞음. 걸린 것은 N3(hives), N4(의료진 빠짐), N8(가족 퇴실), 16.3 문장 why(코드팀).

## 고칠 것 — 단어
단어의 `en·ko·ipa·icon·example`을 바꾸거나 지우면 전부 `changes-icu-transfusion.yaml`에 적기(V16).

**distractorsEn 품사·분야가 어긋난 것(전부)** — ★는 꼭 바꿀 것.
| 단어(품사) | 오답 | 문제 | 대안 |
|---|---|---|---|
| ★ pain (명) | plain | 형용사 | pail |
| red cells (명) | red cross | 단체 이름, 분야 밖 | red casts |
| FFP (혈액 제제) | FDA | 기관 이름, 분야 밖 | PCC |
| already (부) | alike | 형용사로 읽힘 | almost가 은행어라 피하고 → ahead |
| alone (형, 후치) | again, anyway | 부사 | along, aloof |
| baseline (ko 형용사 `기저의`) | deadline, headline | 명사(정답도 en은 명사 — ko를 `기저`로 바꾸는 편이 쉬움) | ko `기저`, distractorsKo `응급`·`임시` |
그 밖 280개는 같은 품사.

**distractorsKo**
- ★ w-key `[단서, 예외]` — `단서`는 key의 다른 뜻(the key to… = 실마리)이라 정답 둘 → `[예외, 순서]`.
- w-site `[가격, 각도]` — 분야 밖이라 너무 쉽게 걸러짐(권장) → `[시점, 크기]`.

**cue**
- w-signal(ko 동사 `신호하다`) cue가 명사 정의 → `증상이 무슨 반응이 생기고 있다고 미리 알려 주다`.
- ko를 되풀이한 cue(검사 CUE-KO-REPEAT) — 바꿀 것: w-procedure `침습적인 처치나 시술을 하는 일` → `바늘이나 기구를 몸 안에 넣는 처치로, 그 전엔 혈소판 목표가 높아진다` · w-almost → `한 시간이 다 되어 가지만 아직 꽉 차지는 않은` · w-ahead → `수혈 시작 30분 전처럼, 정해진 때보다 앞서서` · w-take → `배정된 역할을 자기 몫으로 받아 들다` · w-temperature → `열이 나는지 볼 때 재는 몸의 뜨거운 정도` · w-call → `누군가에게 와 달라고 전화로 연락하다` · w-lab → `혈액을 뽑아 분석실에서 돌린 결과 숫자` · w-crash → `심정지 때 끌고 오는 약·기구 카트 앞에 붙는 말` · w-back → `보냈던 혈액을 혈액은행으로 되돌려 보낼 때 붙는 말` · w-must → `규칙상 꼭 지켜야 할 때 동사 앞에 붙이는 말`.

**decoyChips(비속어·불쾌·술·장례·성적 관점 전수)** — ★는 꼭 바꿀 것.
| 단어 | decoy | 문제 | 대안 |
|---|---|---|---|
| ★ fibrinogen | gin (+fib) | 술(+거짓말 속어) | gem, fig |
| ★ key | keg | 술통 | kay |
| ★ cardiogenic | die | 죽음 | dial |
| ★ component | pot | 대마 속어 | pole |
| number | nut | 속어(고환·미치광이) | numb |
| check / recheck | chick | 여성 비하 속어 | cheek |
| platelet | lit | 취함 속어 | lot |
| slow | slew | slay(죽이다)의 과거형 | slot |
| infuse / infuser / intubate | inn (intubate는 tub도) | 술집 연상, 3번 되풀이 | 셋 다 ink, intubate tub→tab (`in`은 정답 조각이라 쓰면 안 됨) |
| coags | ex | 전 애인, 뜻 없는 조각 | ag |
| (선택) oxygen·explain·expiration·expire / oxygenation | ax / axe | 무기 | ox / ox |
정답 조각 `war`(warfarin)·`port`(support·report)·`crack`(crackle)·`bed`(bedside)는 형태소라 그대로. `come`(component·compression·compromised)은 일상어로 판단 — 유지.

**결정 11**
- **w-vital** 헤드워드 `vital`(형용사 '필수적인')에 ko `활력징후` — 맞는 헤드워드는 `vitals`(coags처럼 복수 명사). en `vitals`, ipa `/ˈvaɪtəlz/`, chips `[[vi, tals]]`, decoyChips `[vie, tails]`, distractorsEn `[vials, vitamins]`.
- **w-away** `away`=`즉시`는 틀린 ko(뜻은 `right away` 구 전체). 구 단위로 en `right away`, chips `[[right], [a, way]]`, distractorsEn `[right along, right ahead]`, cue는 그대로(권장).
- **w-risk** ko `위험`(명사)인데 4.5는 동사 `can't risk giving` → ko `위험을 무릅쓰다`, distractorsKo `[기회를 놓치다, 책임을 지다]`.
- **w-close** ko `가까운`(거리)인데 18.6은 `keep close watch`(면밀한) → ko `면밀한`, cue `눈을 떼지 않고 빈틈없이 살피는`, distractorsKo `[느슨한, 드문]`. 18.6 문장 ko `가까이서` → `오늘 밤은 산소 수치를 면밀히 지켜볼게요.`(distractorsKo 둘 다시).
- **w-wish** ko `바람`→`희망`으로 바꾼 것(changes)은 되돌리기 권장 — wishes는 '희망(hope)'이 아니라 '바람·뜻'이고 문장 ko도 `뜻`. `바람`으로 두거나 `뜻(바람)`.
- 저작자의 삭제 13개·헤드워드 원형 17개·ko 가름 16개·태그 빼기는 타당. 은행에서 지울 것 추가: S1→w-alone, S12→w-stretch, K1을 바꾸면 w-wide.
- 판정만: w-unit `혈액 유닛` vs 문장 ko `제제` — 듣고 뜻 고르기 오답에 `혈액 제제`가 없어 정답 둘은 아님, 유지.

## 종합
고칠 것 문장 15건(S1~S15, chunks 15곳은 S13 한 건; S9·S15는 권장) · keyPhrase ko 5 · 뉘앙스 10(N2는 유지 판정) · 단어 35(품사 6·dKo 2·cue 11·decoy 11·결정 11 5) — 합계 65. 안전은 S1·S2·S3·S4·S5·S6·N4의 7건, 그리고 keyPhrase 결정 K1(코드팀)·K2·K4. 13.3·16.5·16.3을 고치고 pair 성분 문법·swap why를 바로잡으면 내보내도 됩니다.
