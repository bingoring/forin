# er-bleeding-wound v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-er-bleeding-wound.yaml`, `git diff changes/er/changes-er-bleeding-wound.yaml`.
목록 행 3개(12.2, 11.2, 20.4)를 대조했습니다. 빠진 행은 없습니다.

changes 항목은 실제로 바뀐 v44 키와 맞습니다.
- 문장: 12.2 en/chunks, 11.2 ko, 20.4 en/ko/chunks/words
- 단어: w-vital·w-stable example, w-warm 삭제
- `w-heavy`는 exKo만 바뀌었으므로 적지 않은 것이 맞습니다.

12.2는 keyPhrase이고, `keyphrases.tsv` 1행이 새 en과 글자 그대로 일치합니다.
검사: changes 파일을 함께 두고 돌리면 V16은 통과입니다. 실패는 이 keyPhrase의 `[V4]` 1건뿐이고, 합칠 때 tsv를 반영하면 풀립니다.

## 수정자 판단에 대한 판정
- **12.2·11.2: 처방대로입니다.**
- **20.4 `Vitals are stable and the tourniquet is holding.`(새로 씀): 수용합니다.**
  - 정본 S20은 팔다리 동맥 출혈에 14:20 지혈대를 감은 수술팀 인계입니다(20.0·20.1). 거기에 "the limb is warm"을 쓰면 지혈대 아래가 따뜻하다, 곧 덜 조였다는 신호로 읽히는 문제가 있었고, 새 문장은 그 문제를 없앴습니다.
  - `the tourniquet is holding`은 외상 인계에서 실제로 쓰는 말이고, 8단어입니다.
  - ko·why·words(`w-tourniquet`; `w-limb`은 다른 문장에 남음)·w-vital/w-stable example/exKo가 모두 맞습니다.
  - 빈칸(stable / unstable·falling·unclear)은 정답이 하나입니다. decoy `and the chart`는 어느 자리에 넣어도 문장이 되지 않습니다.
  - 20.1(`bleeding is controlled`)과 뜻이 조금 겹치지만, 인계에서 지혈대 상태를 다시 확인하는 말이라 둘 만합니다.

## 고칠 것

1. **changes 파일의 죽은 항목** (형식, 낮음)
   - 문제: `kind: word, id: w-warm, fields: [example]` 바로 다음에 `kind: word-remove, id: w-warm`이 있습니다. 지운 단어의 example을 바꿨다는 항목은 합칠 때 처리할 대상이 없습니다.
   - 처방: `changes-er-bleeding-wound.yaml`에서 `kind: word / id: w-warm / fields: [example]` 항목을 지웁니다(`word-remove`는 남김).

2. **20.4 `ko`의 뜻을 더 정확하게** (뜻, 낮음, 선택)
   - 문제: `지혈대는 잘 유지되고 있습니다`는 "지혈대를 계속 감아 두고 있다"로 읽힙니다. en `is holding`의 뜻은 "지혈대가 출혈을 계속 막고 있다"입니다.
   - 처방(선택): ko `활력징후는 안정적이고 지혈대로 출혈이 계속 잡혀 있습니다.`. 이렇게 바꾸면 w-vital·w-stable `exKo`도 같은 문장으로 바꿉니다.
     changes 20.4 항목은 이미 ko를 담고 있어 따로 더하지 않습니다.
