# core-handoff-er v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-core-handoff-er.yaml`, `git diff changes/er/changes-core-handoff-er.yaml`.
목록 행 2개(S4 4.4 병상 번호, 4.2 name band)를 모두 대조했습니다(파일 기준 S3.4·S3.2). 빠진 행 없음.
changes 항목(3.2 en/ko/chunks, 3.4 en/ko/chunks/words, w-match·w-band example)이 실제 변경과 맞습니다. keyPhrase tsv
(`Can you read the ID band back to me?`)가 새 en과 글자 그대로 일치합니다. 검사(스크래치 시드) `==> 통과`, W14 0건.

## 수정자 판단에 대한 판정
- **3.2 name band → ID band:** 수용. 미국 병원에서 `ID band`·`wristband`가 흔한 말이고, 같은 상황 3.5·order가 wristband/ID band를
  써서 어울립니다. pair(`read the ID band` / `back to me`), order L2, w-band 예문·cue·exKo까지 함께 바꿨습니다. 빈칸 `ID`(alert·allergy·blood)는
  신원 재확인 장면에서 정답 하나입니다. decoy `from me`는 어느 자리에서도 맞는 문장이 되지 않습니다.
- **3.4 병상 번호 → 이름+생년월일:** 처방대로이고 NPSG.01.01.01(두 식별자)과 맞습니다. why도 "병상 번호는 위치 확인용"으로 바로잡혔습니다.
  decoy `last night`, 빈칸 `chart`, distractorsKo 모두 문제 없습니다. 뺀 w-diagnosis·w-bed는 같은 상황 pair·context에 남아 있습니다.

## 고칠 것

1. **S3 환자 정보 재확인 3.4 대명사** (문법·뜻, 낮음)
   - 문제: 이 상황의 환자는 `Mr. Alvarez`(3.0)이고 order L2도 `his ID band`인데 3.4가 `Her name…`입니다. 이번에 3.4 en을 다시 썼으니 함께 맞춥니다.
   - 처방: 3.4 `en: His name and date of birth both match the chart.`, chunks `["His name", "and date of birth", "both match", "the chart", "."]`,
     w-match `example`도 같은 en으로. changes 3.4 항목의 fields는 이미 en·chunks를 포함합니다.
   - 참고(처방 아님): 3.5 `I'll wait while you double-check her wristband.`도 her인데 목록 밖 v44 문장이라 결정 11 예외가 필요합니다. 사용자 판단.

고칠 것 1건(사실·안전 0건).
