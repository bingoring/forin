# er-asthma-copd v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-asthma-copd.yaml`, `git diff changes/er/changes-er-asthma-copd.yaml`.
목록 행 2개(19.3, 20.3)를 대조했습니다. 빠진 행은 없습니다.

검사: changes 파일을 함께 두고 돌리면 `==> 통과`입니다(V16 포함, W14 0건). 두 문장 모두 keyPhrase가 아닙니다.

## 수정자 판단에 대한 판정
- **19.3 `His oxygen is dropping fast.`: 처방과 글자 그대로입니다.**
  - ko(`산소포화도가 빠르게 떨어지고 있어요`)와 chunks, words(`w-side` 뺌)가 맞습니다.
  - `w-side`는 쓰는 곳이 없어져 은행에서 지웠습니다. 다른 문장이나 nuance가 이 단어를 가리키지 않는 것도 확인했습니다.
  - 빈칸(fast / gradually·steadily·slowly)은 정답이 하나입니다.
- **20.3 `Background: known severe COPD on home oxygen.`(COPD 배경으로 바꿈): 수용합니다.**
  - 처방의 예시 문장 그대로이고, 20.0(`severe COPD flare`)과 order L2(`known COPD on home oxygen, admitted twice this year`)와 같은 환자를 가리킵니다.
  - 7단어이고 ko·why·words(`w-copd`·`w-oxygen`)·w-background/w-known example이 모두 맞습니다.
  - 빈칸(severe / mild·new·late)은 정답이 하나입니다. 가정 산소를 쓰는 환자라 `mild`는 틀린 말입니다.
  - 파일에 "status asthmaticus"가 남은 곳은 천식 주제의 다른 상황(8713행)뿐이고, 이 상황과는 관계가 없습니다.
- changes 항목은 실제로 바뀐 v44 키(19.3·20.3 en/ko/chunks/words, w-background·w-known example, w-side 삭제)와 맞습니다.

## 고칠 것

1. **changes 파일의 죽은 항목** (형식, 낮음)
   - 문제: `kind: word, id: w-side, fields: [example]` 바로 다음에 `kind: word-remove, id: w-side`가 있습니다. 지운 단어의 example을 바꿨다는 항목은 합칠 때 처리할 대상이 없습니다.
   - 처방: `changes-er-asthma-copd.yaml`에서 `kind: word / id: w-side / fields: [example]` 항목을 지웁니다(`word-remove`는 남김).

2. **20.3 `decoy: history of`: 첫 조각 자리에서 같은 뜻의 차트 문장이 됨** (뜻, 낮음)
   - 문제: `Background:` 자리에 넣으면 `History of known severe COPD on home oxygen.`이 됩니다. 차트에서 실제로 쓰는 말이고, 머리말만 빠졌을 뿐 `ko`와 뜻이 같습니다.
   - 처방: `decoy: was given` (어느 자리에 넣어도 문장이 되지 않음).
