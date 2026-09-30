# 주제 하나의 학습 콘텐츠를 만든다

forin은 한국인 간호사가 미국 병원에서 쓸 영어를 배우는 앱입니다. 커리큘럼의 **상황** 하나를
`단어 → 문장 → 가이드 대화 → 자유 대화` 네 단계로 배우는데, 당신은 그 **1·2단계 재료**를
만듭니다.

## 입력

    /tmp/lesson-er/in-<주제>.json

그 주제가 품은 상황 20~23건이 들어 있습니다. 상황마다 제목·상황 요약(brief)·환자의 첫마디
(tagline)·장소·역할·기술·목표(goals)·핵심 문장(keyPhrases)이 있습니다.

## 출력

    /tmp/lesson-er/<주제>.yaml

```yaml
theme: core-safety-er
words:
  - id: w-wristband
    en: wristband
    ipa: /ˈrɪstbænd/
    ko: 손목밴드
    icon: bandage
    example: "Let me check your wristband."
situations:
  - title: 환자 2인 확인          # 입력의 제목과 글자 그대로 같아야 합니다
    sentences:
      - en: "I need to check your wristband every time."
        ko: "매번 손목밴드를 확인해야 해요."
        chunks: ["I need to", "check your", "wristband", "every time", "."]
        words: [w-wristband]
        goal: 1
```

**입력의 모든 상황을 빠짐없이** 내야 합니다.

## 만드는 순서 — 이 순서가 품질을 만듭니다

**상황을 하나씩 보면서, 그 상황에 필요한 단어와 문장을 함께 정하세요.** 단어 목록을 먼저
만들어 놓고 거기에 문장을 끼워 맞추지 마세요. 그러면 그 상황에서 실제로 하는 말이 아니라
미리 정한 어휘에 맞춘 문장이 나옵니다.

`words`는 상황들이 **실제로 필요로 한 것이 쌓인 결과**입니다. 앞 상황에서 이미 만든 단어는
**같은 id로 다시 쓰세요** — 한 주제 안에서 같은 말이 여러 상황에 걸쳐 되풀이되는 것이
학습자에게는 반복 노출이고, 그래서 외워집니다. 새 상황에 새 말이 필요하면 그때 더하세요.

## 문장이 지켜야 할 것 — 기계로 검사합니다

1. 상황마다 **문장 5개 이상**. 그 상황에서 간호사가 **실제로 할 말**이어야 합니다.
2. 그 상황의 **`keyPhrases`를 글자 그대로 포함**하세요. 사람이 저작하고 임상 검토한
   문장이라 버리면 안 됩니다. 거기에도 `chunks`·`ko`·`words`·`goal`을 붙입니다.
3. `words`에 적은 단어가 그 문장의 `en`에 **실제로 나와야** 합니다. 어형 변화
   (`allergy`/`allergies`, `check`/`checking`)는 괜찮지만 명사화처럼 크게 바뀌는 것
   (`identify`→`identification`)은 안 됩니다. **없는 id를 지어내지 마세요.**
4. 한 상황의 문장들이 통틀어 쓴 **서로 다른 단어가 8개 이상**이어야 합니다.
5. **`chunks`는 문장을 여러 조각으로 쪼갭니다.** 학습자가 조각을 순서대로 눌러 문장을
   조립하는 연습이라, 통째로 한 덩어리면 할 것이 없습니다.
   - 낱말 4개 이하 → 2조각 이상 / 5~8개 → 3조각 이상 / 9개 이상 → 4조각 이상
   - 구두점만 있는 조각은 세지 않습니다.
   - 좋음: `["I need to", "check your", "wristband", "every time", "."]`
   - 나쁨: `["I need to check your wristband every time", "."]`

   **구 경계에서 쪼개세요. 문장을 기계적으로 n등분하지 마세요.** 조각 수만 맞추려고 토큰을
   고르게 나누면 이런 것이 나옵니다.

       ['On a scale of', 'one to ten, how', 'bad is the', 'pain right now', '?']

   `bad is the`는 구가 아닙니다. 이러면 학습자가 뜻으로 순서를 정할 수 없고 **위치를 외워야**
   해서, 배우는 것이 달라집니다. 말할 때 숨을 고르는 자리에서 끊으세요 — 주어+동사,
   동사+목적어, 전치사구, 시간을 나타내는 말 같은 단위입니다.

   특히 **관사(`the`·`a`·`an`)나 `of`로 조각을 끝내지 마세요.** 그 말들은 뒤에 오는 말과
   떨어질 수 없습니다. `["You'll feel a", "quick pinch"]`가 아니라
   `["You'll feel", "a quick pinch"]`입니다. 이건 검사기가 V9로 잡습니다.
6. **조각을 이으면 `en`과 정확히 같아야** 합니다. 기본은 공백 하나로 잇되, `,` `.` `?` `!`
   로 시작하는 조각은 앞에 공백 없이 붙습니다. 그래서 문장 끝 구두점은 **자기 조각**이고
   마지막 낱말에 붙이지 않습니다.
7. `goal`은 그 상황 `goals`의 몇 번째인가(1부터).

## 단어가 지켜야 할 것

- `icon`은 아래 목록에 **있는 것만**. 맞는 게 없으면 `board`입니다.

      baby bandage bell board bulb calendar chartup check coffee compass
      cross gear handshake2 home hospital lab lock magnify me mic monitor
      pencil pill plane pushpin scalpel shield siren speaker speech star
      stetho trophy

  이 목록은 `mobile/src/components/nb/NbIcon.tsx` 의 이름을 그대로 옮긴 것입니다.
  손으로 적었다가 `round` 라는 없는 이름이 들어갔고, 그대로 525건에 퍼졌습니다.
  화면에서는 빈 자리로 그려집니다. 목록에 없는 이름을 쓰지 마세요.

- `ipa`는 미국식 발음기호. `example`은 그 단어가 쓰인 짧은 한 문장.
- **은행에 있으나 어느 문장에도 안 쓰인 단어는 두지 마세요.** 필요해서 만든 것만 남깁니다.

## v45 — 단어마다 더하는 회상 재료

STEP 1은 단어를 보여 주고 외우게 하지 않고, **뜻과 단서를 보여 주고 영어를 떠올리게** 합니다.
문제는 세 가지가 번갈아 나오는데(조각 맞추기 · 영어 고르기 · 듣고 뜻 고르기), 한 단어가 여러
상황에 나오므로 **어느 유형이 나올지는 앱이 정합니다.** 그래서 단어마다 **세 유형의 재료를 전부**
씁니다.

```yaml
- id: w-hypotensive
  en: hypotensive
  ipa: /ˌhaɪpəˈtɛnsɪv/
  ko: 저혈압의
  icon: monitor
  example: "Patient is hypotensive, BP 88 over 54."
  exKo: "저혈압, 혈압 88/54."
  cue: "혈압이 낮은 상태 — BP 88/54"
  tag: 바이탈
  distractorsEn: [hypertensive, hypoxic]
  distractorsKo: [고혈압의, 저산소의]
  chips: [[hypo, tens, ive]]
  decoyChips: [hyper, ion]
```

- **`cue`** — 카드 앞면의 맥락 단서(한국어). 이 말을 **언제·누구에게** 쓰는지가 떠오르게 쓰세요.
  **정답 영어를 쓰면 안 됩니다**(V13). `ko`를 되풀이하지도 마세요 — `ko`는 이미 카드에 있습니다.
- **`exKo`** — `example`의 자연스러운 한국어 번역.
- **`tag`** — 두세 글자짜리 분류(`바이탈` · `외상 인계` · `신경 사정`). 같은 주제 안에서 일관되게.
- **`distractorsEn` 2개** — **정답과 헷갈릴 만한 영어.** 이것이 이 문제의 전부입니다.
  - 좋음: `restrained driver` → `restless driver`, `retained driver` (철자·소리가 닮았다)
  - 좋음: `hypotensive` → `hypertensive`, `hypoxic` (같은 접두사, 같은 분야)
  - 나쁨: `hypotensive` → `wristband`, `family` (한눈에 틀린 것이 보인다)
  - 같은 품사로 쓰세요. 같은 주제 은행의 다른 단어를 써도 됩니다 — 실제로 헷갈리는 말이 가장
    좋은 오답입니다. 정답과 같거나 서로 같은 것은 V13이 잡습니다.
- **`distractorsKo` 2개** — 소리를 듣고 뜻을 고르는 문제의 오답. 같은 분야의 그럴듯한 뜻으로
  (`악화되다` → `안정되다`, `의식을 잃다`).
- **`chips`** — 조각 맞추기의 정답. **낱말의 목록이고, 낱말은 조각의 목록**입니다. 낱말 안의 조각은
  붙고 낱말 사이에만 한 칸이 들어갑니다. 이어서 `en`과 **글자 그대로** 같아야 합니다(V12).

      [[hypo, tens, ive]]                    → hypotensive
      [[en], [route]]                        → en route
      [[mech, a, nism], [of], [in, ju, ry]]  → mechanism of injury

  의미 있는 형태소에서 자르세요(`hypo`·`tens`·`ive`). 낱말 하나를 조각 2~4개로, 전체가 6개를
  넘지 않게. 짧은 한 낱말(`GCS`·`pain`)은 `[[GCS]]`처럼 조각 하나여도 됩니다 — 그 단어는 앱이
  조각 맞추기를 건너뜁니다. **대소문자와 하이픈도 `en` 그대로**입니다(`X-ray` → `[[X-, ray]]`).
- **`decoyChips` 1개 이상** — 섞을 오답 조각. 정답 조각과 닮게(`hypo`에 `hyper`). 정답 조각과
  같으면 V13이 잡습니다.

## v45 — 상황마다 더하는 뉘앙스 문항

같은 뜻이라도 **누구에게, 어떤 상황에서** 하느냐에 따라 말의 온도가 다릅니다. 상황마다 그 장면에
맞는 뉘앙스 문항을 씁니다. 상황의 `sentences:` 옆에 `nuance:`를 둡니다.

**최솟값(V14):** 상황마다 STEP 1 문항(`slider` 또는 `pair`) 1개 이상, STEP 2 문항(`context`·
`swap`·`reel` 중) 1개 이상. 종류를 억지로 채우지 마세요 — 그 장면에 자연스러운 것을 고릅니다.
`reel`은 0~1개.

**모든 문항은 `words:`로 자기가 다루는 단어 id를 적습니다(V15).** 그 id는 **이 상황의 문장이
쓰는 단어**여야 합니다. 앱이 "STEP 1에서 틀린 단어가 STEP 2에 다시 나오게" 할 때 이 연결을 씁니다.

```yaml
nuance:
  - kind: slider                       # 강도 저울 — 유의어를 약함 → 강함으로
    words: [w-pain]
    cue: "Patient: \"It's… bearable, but it won't go away.\""
    scale: [discomfort, pain, agony]   # 3개 이상, 약한 것부터
    answerAt: 0                        # 단서에 맞는 자리(0부터)
    why: "\"bearable\"이면 discomfort 쪽. 한국어로는 다 '아프다'지만 온도가 달라요."
    example: "Some discomfort is expected after the procedure."
    exKo: "시술 후 약간의 불편감은 정상이에요."
  - kind: pair                         # 콜로케이션 — 무엇과 같이 쓰나
    words: [w-administer]
    pairs: [[administer, medication], [titrate, the drip], [en route, to the ER]]   # 2쌍 이상
    decoys: [the patient]              # 1개 이상
    why: "administer는 '투여하다'라 medication과, titrate는 용량을 '조절'하니 drip과."
  - kind: reel                         # 문장 릴 — 한 단어가 여러 장면에서
    words: [w-deteriorate]
    word: deteriorate
    scenes:                            # 4장 이상. 마지막을 "이 사람에게는 이렇게" 카드로(swap: true)
      - {who: "구급대원 → 간호사", en: "She started to deteriorate en route.", ko: "이송 중 나빠지기 시작했어요.", tone: 급함}
      - {who: "차트 기록", en: "Pt condition deteriorated despite fluids.", ko: "수액에도 상태 악화.", tone: 건조}
      - {who: "야간 인계", en: "If he deteriorates overnight, call RRT.", ko: "밤새 악화되면 신속대응팀 호출.", tone: 경고}
      - {who: "보호자에게는…", en: "He's getting worse, and we're acting on it.", ko: "상태가 나빠지고 있고, 조치 중이에요.", tone: 완곡, swap: true}
  - kind: context                      # 같은 뜻 다른 장면 — 셋 중 어색한 하나
    words: [w-deteriorate]
    scenes:                            # 정확히 3장, ok: false 는 정확히 1장이고 거기에 fix
      - {who: 차트 기록, icon: board, en: "Pt condition deteriorated overnight.", ok: true}
      - {who: 보호자에게, icon: me, en: "Your mother deteriorated last night.", ok: false, fix: "Your mother got worse last night, and we've started treatment."}
      - {who: 야간 의사 콜, icon: monitor, en: "He is deteriorating — SpO2 down to 86.", ok: true}
    why: "의료진끼리는 정확한 임상어가 좋지만, 가족에게는 차갑게 들려요."
  - kind: swap                         # 한 단어 바꾸기
    words: [w-hypotensive]
    who: "환자에게 · 바이탈 설명"
    icon: me
    before: ["Your blood pressure is ", "hypotensive", " right now."]   # 앞 · 바꿀 말 · 뒤 (스페이스까지 그대로)
    options: [a little low, hypotensive, dropping dangerously]
    answer: a little low
    notes: {a little low: "환자에게 쉬운 말. 겁주지 않으면서 사실을 말한다.", hypotensive: "의료진끼리의 말. 환자는 못 알아듣는다.", dropping dangerously: "사실보다 무겁게 들려 불안을 키운다."}
    why: "같은 수치라도 환자에게는 쉬운 말로, 의료진끼리는 임상어로 말해요."
```

- **사망 고지는 완곡어로 바꾸는 문제로 만들지 마세요.** 미국 응급실의 사망 고지 교육(GRIEV_ING 등)은
  **"died"를 한 번은 분명히 말하라**고 가르칩니다 — `passed away`·`we lost him`만 쓰면 가족이 아직 살아
  있는지 되묻습니다. 이 주제의 swap은 거꾸로 `expired`·`we lost him` → `has died`여야 맞습니다.
  (이 지시서의 예전 예시가 `died → passed away`였는데, 틀린 예시였습니다.)
- **짝(pair)은 정답이 하나로만 맞아야 합니다.** 왼쪽 말을 다른 오른쪽 말과 이어도 맞는 영어가 되면
  안 됩니다(`dull pain`·`sharp pain`이 둘 다 되는 식). 오답(`decoys`)도 어느 왼쪽 말에도 붙지 않아야
  합니다. 구동사로 유일한 짝을 만들기 어려운 상황은 `slider`로 바꾸세요.
- **오답은 정답과 품사가 같게.** 품사가 달라서 헷갈리는 짝(`breathe`/`breath`, `lose`/`loose`)은
  `decoyChips`에 넣으면 좋습니다.
- **같은 뜻(`ko`)을 가진 은행 단어를 서로의 오답으로 쓰지 마세요**(`drowsy`/`sleepy`). 듣고 뜻 고르기에서
  두 답이 다 맞게 됩니다.
- **`cue`에는 정답의 파생형·약어도 넣지 마세요**(`injury`의 단서에 "injure", `heart rate`에 "HR").
  검사기는 글자 그대로의 정답만 확실히 잡고, 어형은 경고(W13)로만 알려 줍니다.
- **목록 안의 `on`·`off`·`no`·`yes`도 따옴표로 감싸세요**(`decoyChips: ["on", "in"]`). 따옴표가 없으면
  불리언이 되어 앱에 적재되지 않습니다(V11).
- **`tag`는 주제 안에서 10개 안팎의 정해진 집합**으로 쓰세요. 단어마다 새 이름을 만들지 마세요.
- `why`와 `notes`는 사실이어야 합니다. 미국 병원에서 실제로 그렇게 쓰이는지 확신이 없는 뉘앙스는
  쓰지 마세요. 그럴듯하지만 틀린 해설은 틀린 오답보다 나쁩니다 — 학습자가 그대로 믿습니다.
- `icon`은 위 단어 아이콘과 같은 목록에서.
- `context`의 세 장면은 **같은 뜻**이어야 합니다. 뜻이 달라서 어색한 것이 아니라, 듣는 사람·자리에
  맞지 않아서 어색한 것이어야 합니다.
- 따옴표 없는 `off`·`on`·`no`·`yes`는 YAML이 불리언으로 읽습니다. 문자열이면 따옴표로 감싸세요.

## 보강 모드 — 이미 v44 콘텐츠가 있는 주제 (ER · ICU · OR)

입력으로 **이미 만들어진 주제 파일**(`theme · words · situations[].sentences`)을 받습니다. 할 일은
**새 필드를 덧붙이는 것뿐**입니다.

- 단어마다 위의 v45 필드 7개를 더합니다.
- 상황마다 `nuance:`를 더합니다.
- **기존 값은 한 글자도 바꾸지 마세요** — 단어의 `id · en · ko · ipa · icon · example`, 문장의
  `en · ko · chunks · words · goal`. 이미 검사를 통과해 앱에 나가는 문장 12,516개입니다.
  고칠 것이 보이면 고치지 말고 보고에 적으세요. 검사기가 정본과 비교해 바뀐 것을 잡습니다(V16).
- 단어를 더하거나 빼지 마세요. 뉘앙스에 필요한 말(`agony`·`passed away`)은 `words`가 아니라
  문항 안에 씁니다 — `nuance.words`는 이미 문장이 쓰는 단어 id만 가리킵니다.

## 파일은 나눠서 쓰세요

상황이 20건을 넘으므로 **한 번에 다 쓰려 하면 출력 한도에 걸립니다.** 실제로 한 번 그렇게
중단돼 파일이 통째로 날아간 적이 있습니다.

이렇게 하세요.

1. 먼저 `theme:`와 `words:`의 **첫 덩어리**(앞쪽 상황들이 쓸 단어)와 `situations:` 머리말을
   쓰면서 상황 예닐곱 건까지 씁니다.
2. 다음 예닐곱 건을 **덧붙여** 씁니다. 그 과정에서 새로 필요해진 단어는 `words:` 쪽에도
   함께 넣습니다.
3. 마지막 덩어리까지 같은 식으로 잇습니다.

**이어 쓸 때 `words:`나 `situations:` 키를 다시 쓰지 마세요.** 파일 전체에 그 키는 한 번씩만
나와야 합니다. 두 번 쓰면 YAML은 뒤엣것만 남기므로 **앞서 쓴 내용이 조용히 사라집니다.**
실제로 그렇게 상황 7건이 날아간 적이 있습니다. 새 단어는 이미 있는 `words:` 목록 안에,
새 상황은 이미 있는 `situations:` 목록 끝에 붙이세요.

붙인 뒤에는 이렇게 확인하면 한눈에 보입니다.

    grep -c '^words:' <파일>        # 1이어야 한다
    grep -c '^situations:' <파일>   # 1이어야 한다

덧붙일 때는 파일을 통째로 다시 쓰지 말고 **이어 쓰기**로 붙이세요. 중간에 한 번씩 검사
명령을 돌려 보면 형식이 깨졌는지 일찍 알 수 있습니다(상황이 덜 찬 동안에는 "빠진 상황"
경고가 나는 것이 정상입니다).

## 스스로 검사하세요 — 통과할 때까지

    python3 /tmp/lesson-er/verify_one.py /tmp/lesson-er/<주제>.yaml

위반이 0건이고 `==> 통과`가 뜰 때까지 고치세요. 통과하지 못한 채로 끝내지 마세요.

**다만 V2(어형)에 걸렸을 때는 우회하지 마세요.** 검사기의 어형 규칙은 사전 없이 도는지라
아직 구멍이 있습니다. 거기 걸렸다고 단어 태그를 빼거나 문장을 어색하게 바꾸면, 그 문장은
검사만 통과하고 학습자에게는 더 나쁜 영어가 갑니다. 실제로 앞선 주제에서 `gloves`가 거절당해
`a glove`라는 어색한 문장이 나온 적이 있습니다.

걸리면 이렇게 하세요.

1. 그 문장이 **자연스러운 영어인지** 먼저 보세요. 어색하면 문장을 고치는 게 맞습니다.
2. 자연스러운데 검사기만 거절한다면 **그것은 검사기의 구멍입니다.** 그 문장은 그대로 두되
   그 단어 태그만 빼고, **보고할 때 그 사례를 정확히 적어 주세요**(어떤 원형이 어떤 문장에서
   거절됐는지). 제가 규칙을 고칩니다.

**헤드워드는 그 낱말의 제 모습으로 쓰세요.** 두 가지만 지키면 됩니다.

1. **활용형을 원형 자리에 앉히지 마세요.** `calf`를 `calves`로, `run`을 `running`으로 적는
   것입니다. 어형이 어긋나서 그렇게 했다면 그건 검사기에 보고할 일이지 헤드워드를 바꿀
   일이 아닙니다.
2. **문장 첫머리의 대문자를 딸려 보내지 마세요.** `"Stop the pump."`에서 단어를 뽑으며
   `Stop`이라고 적는 것입니다. 학습자 카드에 그대로 찍힙니다. 고유명사와 약어는 물론
   대문자 그대로 둡니다(`X-ray`·`Foley`·`FiO2`).

**부사와 명사화는 별도 단어가 맞습니다.** `closely`·`immediately`·`gently`는 그 자체로
배울 값이 있는 낱말이라 원형으로 되돌리지 않습니다. `assessment`가 `assess`와 별개인 것과
같습니다.

**임시 파일에는 주제 이름을 넣으세요.** 여러 저작자가 같은 스크래치패드 폴더를 씁니다.
`build.py` 같은 흔한 이름을 쓰면 다른 저작자가 덮어씁니다. 실제로 두 저작자가 같은
`build.py`를 놓고 부딪혔습니다. `build_<주제이름>.py`로 지으세요.

**명사화가 원형과 어긋났을 때는 문장을 고치지 마세요.** `percentage`가 `percent`와 어긋나고
`humidifier`가 `humidify`와 어긋나는 것은 검사기의 구멍이 아니라 **둘이 다른 낱말이라는 뜻**입니다.
그럴 때 할 일은 명사화를 **별도 단어로 만드는 것**이지, 원형이 들어가도록 문장을 바꾸는 것이
아닙니다. 실제로 한 저작자가 `oxygen percentage`를 `oxygen percent`로 고쳤는데, 그것은 영어가
아닙니다. 문장은 그대로 두고 단어를 새로 만드세요.

**절대 하지 말 것.** 검사기가 어떤 어형을 모른다는 이유로 그 어형을 피해 문장을 다시 쓰는
것입니다. 예를 들어 `firmer`가 거절됐다고 `firm`으로 바꿔 쓰거나, 비교급을 아예 안 쓰는
문장으로 돌려 쓰는 것입니다. 그렇게 하면 검사는 통과하지만 **검사기는 영영 그 구멍을 모르는
채로 남고**, 다음 주제에서 같은 일이 또 생깁니다. 문장은 자연스러운 그대로 두고, 태그만 빼고,
보고에 적어 주세요. 규칙을 고치는 것은 제 몫입니다.

## 돌려줄 말

파일 경로, 상황 수, 단어 수, 검사 결과 한 줄. 내용은 붙이지 마세요 — 파일에 있습니다.
