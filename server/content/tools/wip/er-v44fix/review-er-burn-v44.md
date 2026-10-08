# er-burn v44 수정 재검토

대조: 정본 export ↔ `base-er-burn.yaml` 필드 단위 비교, `changes-er-burn.yaml` 새 항목 24건.
목록 7행 모두 손댔고, changes 파일은 실제 바뀐 v44 키와 빠짐없이 맞는다(w-small word-remove 포함).
base 상황 `keyPhrases` 4곳은 정본 + `keyphrases.tsv`와 같다. verify의 V4 실패 4건은 정본이 아직 옛 keyPhrase라서 생기며, `apply_keyphrases.py`를 돌리면 사라진다(`--check` 42행 중 맞지 않는 행 0).

## 판정 요청 항목
- **대시 → 두 문장(7.2·15.2):** 괜찮다. 원래 독립절 두 개라 말로 할 때도 두 문장이고, 학습자에게 더 분명하다. 청크 가운데의 "."는 chestpain S10에서도 쓰고 V5·V8을 통과한다. head-trauma의 "대시 앞뒤 공백" 방식과 표기가 갈리는 것은 고칠 일이 아니라 통일할지 고르는 문제다(사용자 결정).
- **"small cut" 4문장(9.2·9.4·18.1·18.4):** 사실 문제(작은 절개)는 풀렸다. 그러나 행의 앞부분 처방 "하나씩 남기고"가 반영되지 않았다. 아래 1·2번.
- **w-small word-remove:** 맞다. 은행은 주제마다 따로 있다(lexicon/er.yaml에 주제마다 w-small이 한 건씩 있음). 그래서 burn 은행에서 빼도 다른 주제·부서에는 영향이 없다. burn의 어느 문장도 이 id를 태그하지 않는다.
- **17.4 새 문장:** 문장 자체는 맞다. 그러나 17.0과 하는 말이 같다(아래 3번). 빈칸 오답 하나도 고친다(4번).

## 고칠 것
1. **S9 9.4: 9.2와 거의 같은 문장(문체)**
   - 문제: 9.2 "release the pressure with a cut along the burned skin"과 9.4 "cut the tight, burned skin to relieve the pressure"가 같은 내용이다.
   - 처방: 9.2(keyPhrase)는 두고 9.4를 결과를 말하는 문장으로 바꾼다.
     - `en`: `Once we relieve the pressure, blood can reach your fingers again.`
     - `ko`: `압력을 풀면 손가락까지 피가 다시 통할 수 있어요.`
     - `chunks`: `["Once we relieve", "the pressure,", "blood can reach", "your fingers again", "."]`
     - `words`: `[w-relieve, w-pressure, w-blood, w-finger]`
     - `tag`: `기대 효과`, `icon`: `bulb`
     - `why`: `Once we…로 처치 뒤에 올 좋은 변화를 알려 절개를 앞둔 두려움을 줄여요. 가피의 압력이 풀리면 눌려 있던 혈관으로 손가락까지 피가 다시 흘러요.`
     - `blank`(relieve, build/add/cause)·`decoy`(to dry the skin)·`distractorsKo`는 그대로 써도 된다.
     - 따라 고칠 것: w-relieve `example`·`exKo`를 새 문장으로 바꾼다. changes에 sentence(S9 index 4: en·ko·chunks·words)와 word(w-relieve: example)를 적는다.
     - order L4("That's why we may need to cut…")는 문장을 그대로 옮긴 줄이 아니므로 둔다.
2. **S18 18.4: 18.1과 거의 같은 문장(문체)**
   - 문제: 18.1 "long, shallow cuts in the burned skin to let it expand"와 18.4 "cut the tight skin so your chest can expand"가 같은 내용이다.
   - 처방: 18.1(keyPhrase)은 두고 18.4를 바꾼다.
     - `en`: `We'll keep checking how well your chest rises.`
     - `ko`: `가슴이 얼마나 잘 올라오는지 계속 확인할게요.`
     - `chunks`: `["We'll keep checking", "how well", "your chest rises", "."]`
     - `words`: `[w-keep, w-check, w-chest]`
     - `tag`: `관찰 약속`, `icon`: `magnify`
     - `why`: `keep checking으로 계속 지켜본다고 약속해요. 가슴 둘레 가피가 조이면 숨 쉴 때 가슴이 덜 올라와서 절개 전후로 가슴 움직임과 산소 수치를 계속 봐요.`
     - `blank`: `answer: rises`, options `rises / sinks / shrinks / sleeps`
     - `decoy`: `your arm`
     - `distractorsKo`는 그대로 둔다.
     - changes에 sentence(S18 index 4: en·ko·chunks·words)를 적는다. 이 문장을 example로 쓰는 단어는 없다.
     - order L3("That's why we may need to cut the tight skin…")은 그대로 둔다.
     - 이 문장은 "Tell me right away if breathing gets harder."처럼 burn에 이미 있는 문장과 겹치지 않는다.
3. **S17 17.4: 17.0과 같은 말(문체)**
   - 문제: 17.0 "pulse oximeter can read normal…"과 17.4 "A normal number does not mean you're safe yet."이 둘 다 '정상 수치를 믿지 말라'는 말이다. why도 17.0의 근거를 되풀이한다.
   - 처방(처방 없음 항목의 새 문장):
     - `en`: `This oxygen helps clear the poison from your blood faster.`
     - `ko`: `이 산소가 혈액 속 독성 물질을 더 빨리 없애 줘요.`
     - `chunks`: `["This oxygen", "helps clear", "the poison", "from your blood faster", "."]`
     - `words`: `[w-oxygen, w-help, w-poison, w-blood, w-fast]`
     - `tag`: `산소 효과`, `icon`: `bulb`
     - `why`: `helps clear로 산소를 주는 이유를 쉬운 말로 알려요. 고농도 산소는 헤모글로빈에 붙은 일산화탄소가 떨어져 나가는 시간을 크게 줄여요.`
     - `blank`: `answer: clear`, options `clear / add / hide / store`
     - `decoy`: `to the doctor`
     - `distractorsKo`: `["산소 수치는 계속 지켜볼게요", "가족에게 중독 사실을 알려 드릴게요"]`는 그대로 둔다.
     - changes S17 index 4의 기존 항목 fields(en·ko·chunks·words)는 그대로 맞는다.
4. **17.4를 지금 문장으로 둘 경우의 빈칸(문체)**
   - 문제: 오답 `ready`를 넣은 "A normal number does not mean you're ready yet."이 이 장면에서도 말이 된다(퇴원 준비).
   - 처방: `ready`를 `hungry`로 바꾼다. 3번을 반영하면 필요 없다.

## 확인만(고칠 것 아님)
- 13.4 `ko`, 17.3 "run a blood test"(w-check 태그 제거 포함), 19.3 "may be breaking down", 20.3 청크, 20.1과 w-start exKo("적정합니다")는 처방대로 고쳤다.
  - 20.1 행의 "w-output"은 실제로는 20.1을 example로 쓰는 w-start를 가리킨 것이고, 수정자가 그렇게 읽은 것이 맞다.
- 9.2의 `chunks`·`blank`·`decoy`와 swap(options·answer·notes·ko), pair `decoys`는 새 문장에 맞는다.
- 18.1 "long, shallow cuts"는 근막절개와 대비한 표현으로 받아들일 만하다.
