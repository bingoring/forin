# C5 context 장면 정비 검토 C — ER 세 주제 (48문항)

기준: TASK.md v46 9번, 핸드오프 `CTX`(같은 `deteriorate`가 세 장면 모두에, 보호자 장면이 어색, `fix`는 그 사람에게 맞게). 판정 기준은 묶음 A·B(`review-ctx-A.md`·`review-ctx-B.md`)와 같습니다.
`who`·`ok`는 바꿀 수 없으므로 아래 제안은 모두 `word`·`ko`·`en`·`fix`·`why` 안에서만 고칩니다. 제안한 `word`와 장면 문장은 모두 W14 어간 비교(`_has`)를 통과하는지 스크립트로 확인했습니다.

| 주제 | 문항 | OK | 고칠 것 |
|---|---|---|---|
| er-procedures | 19 | 11 | 8 |
| er-shock | 15 | 9 | 6 |
| er-stroke | 14 | 9 | 5 |
| 합계 | 48 | 29 | 19 |

**심각한 것**
- stroke #2 `normal`: XX `At what hour did his premorbid baseline cease to be normal?`는 뜻이 통하지 않는 영어입니다(baseline이 normal이기를 그친다).
- stroke #10 `stay`: XX `Staying is recommended per protocol…`는 원어민이 하지 않는 말입니다(동명사 주어).
- stroke #6 `wake`: XX `your last intact moment prior to wake-up`은 영어가 아닙니다. 정본의 `neurologically intact`를 빼면서 `intact`만 남았습니다.
- shock #15 `hypotensive`: XX `She's refractory hypotensive`는 문법이 틀렸습니다(정본에서 물려받음). `refractory hypotension`이거나 `refractory`를 떼야 합니다.
- procedures #6 `brave`: 차트 장면 `Pt brave throughout; …`은 차트 말이 아닙니다(주관적 칭찬은 기록하지 않습니다). 학습자가 이 장면을 어색하다고 고를 수 있어 정답이 둘로 읽힙니다.
- shock #9 `cause`: `Etiology`를 `Cause`로 바꾸면서 XX에서 `etiology`가 사라졌는데, why는 여전히 "etiology, undetermined는 의료진끼리의 말"이라고 합니다(사실과 다름). 원래 교훈(etiology)도 사라졌습니다.

**why가 사라진 낱말을 아직 말하는 것**: procedures `contamination`(contaminant)·`IO`(intraosseous), shock `circulation`(perfusion)·`cause`(etiology), stroke `slurred`(dysarthria). 장면을 고치면서 XX에서 빠진 낱말을 why에서도 빼야 합니다.

---

## 저작자가 짚은 곳 — 총평

1. **procedures `verify` → `double-check`** — 받아들입니다. `verify`가 들어간 정본 XX는 '두 사람이 확인'이라는 핵심이 약했고, `double-check`는 수혈 이중 확인에서 실제로 쓰는 말이며 세 장면에서 뜻이 같습니다. ko `이중 확인하다`도 맞습니다. 장면 0만 조금 다듬기를 권합니다(아래 #10).
2. **shock `norepinephrine` → `norepi`** — 받아들입니다. 묶음 B `epi` 총평과 같은 방향이고, 차트·의사 콜 모두 `norepi`가 실제 말입니다.
3. **shock `notify` → `notified`** — 받아들입니다. 세 장면 모두 `notified`(과거분사·완료)로 쓰여 어형을 맞춘 것이고, ko `알렸다`도 맞습니다. XX `I've notified the PERT`는 `paged`·`activated`가 더 흔하지만 맞는 말입니다.
4. **procedures `brave` 차트 장면** — 받아들이지 않습니다(심각). `word: well`로 바꾸면 정본 차트·XX 장면을 그대로 살릴 수 있습니다(아래 #6).
5. **stroke `stay`** — XX 영어를 고칩니다(심각, 아래 #10). 의사 콜 장면 `She wants to leave, but I'd like her to stay for workup.`은 좋습니다.
6. **stroke `wake` 의사 콜** — 의사 콜 `Wake-up stroke: last known well 22:30 at bedtime; found with weakness on waking at 06:00.`은 15단어로 실제 보고 말투라 좋습니다. 문제는 XX입니다(아래 #6).
7. **shock `suspected sepsis` → `suspected infection`** — 받아들입니다. Sepsis-3·SEP-1 선별도 `suspected infection`이라는 말을 쓰고, `source unknown`과도 잘 맞습니다. 의사 콜에 `maybe sepsis`가 남아 패혈증 인지라는 학습 의도도 지켰습니다.
8. **shock `Etiology` → `Cause`** — 받아들이지 않습니다(심각). `word: unclear`로 바꾸면 정본의 `etiology` 세 장면을 거의 그대로 살릴 수 있습니다(아래 #9).

---

## er-procedures

1. **date of birth** — OK(경미). 두 장면 모두 환자에게 하는 말이라 대비가 '듣는 사람'이 아니라 '확인하는 방법'(열린 질문 ↔ 불러 주고 맞죠?)입니다. 묶음 A `understand`처럼 같은 사람에게 하는 방법의 대비로 받아들입니다. XX의 `date of birth March 4th`는 팔찌를 읽어 주는 말투로 실제로 들립니다.
2. **start** — 고칠 것. XX `I'm going to start cannulation of your forearm now.`는 어색한 영어입니다(cannulation은 혈관에 하는 것이고, `start cannulation of`도 쓰지 않습니다).
   - XX 안: `I'm going to start a 20-gauge PIV in your left forearm now.` (`20-gauge`·`PIV`는 의료진끼리의 말이라 환자에게는 어색함이 분명합니다)
   - fix: 그대로
   - why 안: "20-gauge·PIV 같은 규격과 약어는 의료진 말이에요. 환자에게는 put in an IV처럼 쉬운 말로 해요."
3. **specimen** — OK.
4. **labs** — 고칠 것(경미).
   - XX의 `abd`는 기록 약어라 말로는 하지 않습니다(말로는 `abdominal`·`ab pain`).
   - why의 "labs는 의료진끼리의 말"은 지나칩니다. `labs`는 미국 환자도 흔히 듣는 말입니다.
   - XX 안: `We're sending labs for your abdominal pain workup.`
   - why 안: "workup은 의료진끼리의 말이에요. labs는 환자도 듣는 말이지만, 무엇을 알아보려는 검사인지까지 쉬운 말로 해요."
5. **vein** — OK. fix `hard to see`는 `hard to find`가 더 흔하지만 맞는 말입니다.
6. **brave** — 고칠 것(심각). 총평 4.
   - 안: `word: well`, `ko: 잘 (해내다)`
   - 장면 0: `All done! You did so well!`
   - 장면 1: 정본으로 되돌립니다(`Pt tolerated venipuncture well.`)
   - XX: 정본으로 되돌립니다(`You tolerated the venipuncture well.`)
   - fix: `You were so brave — you held really still for me!` (장면 0과 겹치지 않습니다)
   - why: 그대로
7. **metformin** — OK. fix가 `metformin`을 빼고 '당뇨 약'으로 물어 장면 0과 겹치지 않습니다.
8. **contamination** — 고칠 것(why). XX에 `contaminant`가 더는 없습니다.
   - why 안: "contamination·skin flora는 의료진 말이에요. 환자에게는 '피부 세균이 섞였을 수 있다'고 풀고, 왜 다시 하는지도 함께 말해요."
   - fix가 19단어로 조금 길지만 이유까지 담은 한 문장이라 허용합니다.
9. **allergy** — OK. XX `Any PCN allergy?`는 정본 그대로입니다. `PCN`을 소리 내어 말하는 것은 드물지만, 기록 약어를 환자에게 그대로 쓰는 어색함이 교훈이라 둡니다.
10. **double-check** — OK(경미). 장면 0 `Let's double-check together — … all match.`는 제안과 결론이 한 문장에 섞였습니다. 원하면 `Double-checked together — unit number, ABO/Rh, and expiration all match.`로 다듬습니다.
11. **NGT** — 고칠 것(경미). 장면 0 `The NGT is in`은 말로는 `NG`·`NG tube`가 흔합니다(W14 때문에 `NGT`를 넣은 것).
    - 안: `word: placement`, `ko: (관의) 위치`
    - 장면 0: 정본으로 되돌립니다(`The NG is in — can we get an X-ray to confirm placement?`)
    - 장면 1·XX·fix·why: 그대로(두 장면 모두 이미 `placement`가 있습니다)
12. **consent** — OK(정본 그대로).
13. **bedside** — OK.
14. **monitor** — 고칠 것(경미). 장면 1 `Continuous cardiac monitoring`은 '감시'(동작)이고 나머지는 '모니터'(기계)라 메모 "뜻은 셋 다 '모니터'"가 조금 어긋납니다.
    - 장면 1 안: `Cardiac monitor in place throughout CVC insertion; no sustained ectopy.`
15. **epinephrine** — 고칠 것(경미). 묶음 B 총평 2와 같습니다.
    - 장면 0의 콜아웃은 `Epi`가 실제 말입니다. `word: epi`로 바꿔도 W14를 통과합니다(`Epinephrine`·`epinephrine`에 걸림).
    - 안: `word: epi`, 장면 0을 정본으로 되돌립니다(`Epi 0.5 IM given, lateral thigh, at 14:02.`). 장면 1·XX·fix·why는 그대로입니다.
16. **IO** — 고칠 것(why). XX에 `intraosseous`가 더는 없습니다.
    - why 안: "IO·proximal tibia는 의료진 말이에요. 위급한 환자에게는 어디에, 왜 하는지만 짧게 말해요."
17. **match** — OK. 같은 동료에게 하는 말을 두고 돌려 말하기 ↔ 멈춰 세우기의 대비입니다(묶음 B `sats`와 같은 사유). why의 CUS 풀이도 맞습니다.
18. **lung** — OK.
19. **vitals** — OK. 같은 의사에게 하는 말을 두고 숫자 보고 ↔ 얼버무림의 대비입니다. 장면 0(90/56, 120)과 fix(82/50, 128)의 수치가 다르지만 fix에 "5분 전보다 나빠짐"이 있어 서로 모순은 아닙니다.

## er-shock

1. **circulation** — 고칠 것(why). XX에 `perfusion`이 더는 없습니다.
   - why 안: "peripheral circulation·capillary refill은 의료진끼리의 말이에요. 환자에게는 '손이 서늘해서 피가 잘 흐르는지 확인한다'처럼 풀어 말해요."
2. **fall** — OK(정본 그대로).
3. **volume-depleted** — OK.
4. **ready** — 고칠 것(경미). 장면 1 `blood ready on standby`는 같은 뜻이 겹칩니다.
   - 장면 1 안: `I've got fluids running and blood ready to go.`
5. **infection** — OK. 총평 7.
6. **epinephrine** — OK(정본 그대로).
7. **output** — 고칠 것. `UOP`를 `urine output`으로 풀면서 XX `Your urine output is 20 mL an hour.`는 환자도 대체로 알아듣는 말이 되어 어색함이 약해졌고, why는 사라진 `UOP`를 말합니다.
   - XX 안: `Your urine output is only 20 mL an hour, under 0.5 per kilo.` (`0.5 per kilo`는 의료진끼리의 기준 수치)
   - why 안: "mL·per kilo 같은 수치와 기준은 의료진끼리의 말이에요. 환자에게는 '소변이 기대보다 적어서 수액을 더 줄 수 있다'로 풀어 말해요."
8. **hold** — OK.
9. **cause** — 고칠 것(심각). 총평 8.
   - 안: `word: unclear`, `ko: 분명하지 않은`
   - 장면 0: 정본으로 되돌립니다(`Etiology of hypotension unclear; work-up in progress.`)
   - 장면 1: `Etiology still unclear — labs and ECG are pending.`
   - XX: `The etiology of your hypotension remains unclear.`
   - fix: 그대로
   - why: "etiology, hypotension은 의료진끼리의 말이에요. 환자에게는 '아직 원인을 모르니 검사로 찾고 있다'고 풀어서 말해요."
10. **norepi** — OK. 총평 2.
11. **notified** — OK. 총평 3.
12. **drain** — 고칠 것(경미).
    - 장면 1 `setting up to drain it by pericardiocentesis`의 `it`이 tamponade를 가리켜 어색합니다(빼는 것은 액체입니다).
    - why가 XX에 없는 `pericardiocentesis`를 말합니다.
    - 장면 1 안: `Echo shows tamponade — setting up to drain the effusion.`
    - why 안: "tamponade physiology·emergent pericardial drainage는 의료진끼리의 용어예요. 보호자에게는 '심장을 누르는 액체를 지금 빼야 한다'로 풀어 말해요."
13. **activate** — OK.
14. **precaution** — OK.
15. **hypotensive** — 고칠 것(심각). XX `She's refractory hypotensive`는 문법이 틀렸습니다(정본에서 물려받음).
    - XX 안: `She's persistently hypotensive on 12 mcg/min of norepi, with rising lactate.`
    - why 안: "hypotensive, mcg/min, lactate 같은 말과 수치는 의료진끼리의 표현이에요. 보호자에게는 '강한 약을 써도 혈압이 낮아 중환자실로 옮기려 한다'처럼 풀어 말해요."

## er-stroke

1. **slurred** — 고칠 것(why). XX에 `dysarthria`가 더는 없습니다.
   - why 안: "의료진끼리는 presenting with·facial palsy 같은 임상 표현이 정확하지만, 환자에게는 눈에 보이고 들리는 대로 쉬운 말로 설명해야 해요."
2. **normal** — 고칠 것(심각).
   - XX는 뜻이 통하지 않는 영어입니다.
   - 장면 1 `Per his wife, he was completely normal at 08:15.`은 의사 콜에서 `last known well`을 빼 버려 원래 학습 의도(의사에게는 LKW로 압축)가 약해졌습니다.
   - 안:
     - 장면 1: `Last known well 08:15 — his wife says he was normal then.`
     - XX: `When was he last known normal — at his neuro baseline?` (`last known normal`·`baseline`은 뇌졸중 프로토콜 말이라 불안한 보호자에게 어색함이 분명합니다)
     - fix: 그대로
     - why: "의료진끼리는 last known normal·baseline 같은 압축 표현을 쓰지만, 불안한 보호자에게는 쉬운 질문으로 시각을 끌어내야 정확한 답이 나와요."
3. **drink** — OK. 같은 환자에게 하는 말을 두고 공감 ↔ 규정 문구의 대비입니다. fix 18단어는 허용합니다.
4. **score** — OK. XX 18단어는 점수를 늘어놓는 어색함 자체라 허용합니다.
5. **stroke** — OK.
6. **wake** — 고칠 것(심각). 총평 6.
   - XX 안: `What's your last known well time — before sleep, or on waking?` (`last known well`은 프로토콜 말이라 환자에게 어색함이 분명합니다)
   - fix: 그대로
   - why: 그대로(사실입니다)
7. **safe** — OK.
8. **interpreter** — OK.
9. **headache** — 고칠 것(경미). fix `Please tell me right away if your head starts hurting more.`가 장면 0 `Tell me right away if your headache gets worse.`와 거의 같습니다(정본에서 물려받음).
   - fix 안: `If the headache comes back stronger, press this button and call me.`
10. **stay** — 고칠 것(심각). 총평 5.
    - XX 안: `Per protocol, you'll need to stay; discharge isn't advised at this time.`
    - fix·why: 그대로
11. **consent** — OK. XX `Execute the informed consent documentation immediately.`는 정본 그대로이고, 명령조라 어색함이 분명합니다. why의 "설명동의는 시술 의사가 받고 간호사는 서명에 입회"도 맞습니다.
12. **stop** — OK.
13. **deterioration** — OK. 핸드오프 `CTX`와 같은 낱말입니다. 장면 0과 1이 거의 같은 내용이지만 듣는 사람(의사·인계받는 간호사)이 둘 다 의료진이라 괜찮습니다.
14. **pupil** — OK.
