# core-language-er v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-core-language-er.yaml`, `git diff changes/er/changes-core-language-er.yaml`.
목록 행 5개(2.5 알레르기, 7.6 통역 서비스, 16.2 통역사 역할, 8.4 통역사에게 직접, chunks 4건)를 모두 대조했습니다. 목록 번호는
상황·문장 모두 1부터라 파일 기준 S1.4·S6.5·S15.1·S7.3·S10.0·S12.0·S15.2·S17.1입니다. 빠진 행 없음.
changes 항목이 실제 바뀐 v44 키와 모두 맞습니다. 검사(스크래치 시드) `==> 통과`, W14 0건.

## 수정자 판단에 대한 판정
- **S1.4 `Do you take medicine every day? Yes or no?`(처방의 "다른 핵심 질문으로 교체"):** 수용. 매일 먹는 약(항응고제 등)은
  응급실 핵심 병력이고 S1.1 알레르기와 겹치지 않습니다. 영어가 서툰 환자용 단순 영어라 `any`가 없어도 됩니다. 9단어, ko 일치.
  빈칸 `take`(sell·break·lose) 정답 하나, decoy `last year` 비문, distractorsKo 문제 없음. order L3(알레르기)·swap(알레르기)은
  S1.1을 인용하므로 그대로 맞습니다.
- **S7.3 `Interpreter, please repeat every word the patient said.`(처방 없음):** 수용. 3자 대화에서 임상가는 환자에게 직접 말하고
  통역사는 1인칭으로 옮기는 것이 표준이지만, 통역 자체를 바로잡는 메타 요청은 통역사에게 직접 하는 것이 맞습니다(통역사가 환자에게
  그 사실을 알립니다). 이 문장은 "빠짐없이 옮겨 달라"는 요청이라 1인칭 원칙과 부딪치지 않습니다. 전화·영상 통역사는 이름을 모르는
  경우가 많아 `Interpreter,` 호칭도 실제로 씁니다. 참고로 7.1(`Can the interpreter repeat that in full?`, keyPhrase)과 뜻이 거의 겹치고,
  7.1은 3인칭이라 원래 지적과 같은 어색함이 있지만 목록 밖 keyPhrase라 처방하지 않습니다.
- **S6.5 interpreter service:** 처방대로.
- **chunks 4건:** 처방 취지대로 구 경계를 바로잡았습니다. 다만 10.0은 청크를 바꾸면서 decoy 문제가 새로 생겼습니다(고칠 것 3).

## 고칠 것

1. **S15 동의능력 언어 복합 15.1 — 처방 문장이 원래 지적을 다 풀지 못하고 en·ko가 다름** (뜻·사실, keyPhrase)
   - 문제: `We'll check with the interpreter if he truly understands.`의 `check with X if…`는 "X에게 …인지 물어보다"라서 이해 여부를
     통역사에게 판단해 달라는 말이 됩니다(원래 지적 "통역사의 역할을 넘음" 그대로). ko는 "통역사를 **통해**"라 en과 뜻이 다릅니다.
     why("통역사는 환자의 대답을 그대로 옮겨 줘요")와도 어긋납니다.
   - 처방:
     - `en: We'll use the interpreter to check if he truly understands.` (10단어, ko 그대로 맞음)
     - `chunks: ["We'll use the interpreter", "to check", "if he truly", "understands", "."]` (decoy `if you sign`을 네 자리에 넣어 모두 비문 확인)
     - `keyphrases.tsv` 이 행의 새 값과 `keyphrase-seed-changes-core-language-er.yaml`의 new를 같은 en으로.
     - w-check `example`을 같은 en으로(exKo는 그대로). changes 15.1 항목 fields는 이미 en·ko·chunks.

2. **S6 방언·소수언어 대응 6.5 `decoy`** (문체)
   - 문제: `for a doctor`가 `for someone` 자리에 들어가면 "The interpreter service is looking for a doctor who speaks your dialect."(맞는 영어).
   - 처방: `decoy: at your dialect`

3. **S10 청각장애 수어 통역 10.0 `decoy` — 청크 수정으로 새로 생긴 정답** (문체)
   - 문제: 청크가 `a sign language interpreter` / `now`로 바뀌어 `for the family`가 `now` 자리에 들어가면
     "I'm arranging a sign language interpreter for the family."(맞는 영어).
   - 처방: `decoy: by lip`

4. **S12 응급 중 통역 지연 12.0 `decoy`** (문체, 낮음)
   - 문제: `Tell me`가 `Point here.` 자리에 들어가면 "Chest? Tell me yes or no?"로 거의 맞는 말이 되고 ko 뜻과도 가깝습니다.
   - 처방: `decoy: Tell me about`

고칠 것 4건(사실·안전 1건: 1번).
