# v44 필드 수정 재검토 지시 (Opus)

Sonnet이 결정 11 예외(`FIX-V44.md`)에 따라 v44 문장을 고쳤습니다. 당신은 **바뀐 문장과 그 문장에 기대는 필드만**
검토합니다. 주제 전체를 다시 검토하지 않습니다.

## 읽을 것
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/FIX-V44.md`: 수정자가 받은 지시
- `/Users/ywyeom/private/forin/server/content/tools/wip/v44fix-items.md`: 맡은 주제의 행(원래 지적과 처방)
- `/Users/ywyeom/private/forin/server/content/tools/pipeline/REVIEW.md`의 v46 절: 판정 기준(빈칸·decoy·distractorsKo·order·context)

## 비교 방법
고치기 전은 정본입니다. 스크래치에 정본을 뽑아 고친 파일과 필드 단위로 비교하세요.

    python3 /Users/ywyeom/private/forin/server/content/tools/export_dept_lessons.py er <스크래치 폴더> <주제>
    # → <스크래치 폴더>/base-<주제>.yaml (고치기 전)
    # 고친 뒤: /Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-<주제>.yaml

`git diff /Users/ywyeom/private/forin/server/content/tools/changes/er/changes-<주제>.yaml`로 이번에 붙인 변경 목록도 봅니다.
keyPhrase는 정본에만 있으므로, 수정자가 보고한 keyPhrase 교체(`wip/er-v44fix/keyphrases.tsv`)를 새 문장과 대조합니다.

## 볼 것
1. **목록 대조:** 행마다 처방대로, 또는 처방의 뜻대로 고쳤는지 확인합니다. 빠진 행이 있는지도 봅니다.
   수정자가 "반영하지 않음"이라 한 항목은 그 이유가 맞는지 판정합니다.
2. **새로 쓴 문장(처방 없음):** 임상 사실이 미국 병원 실무에 맞는지, 간호사가 실제로 할 말인지, 15단어 이하인지,
   `ko`가 `en`과 같은 뜻인지 봅니다.
3. **딸린 필드:** 다음이 새 문장에 맞는지 봅니다.
   - `chunks` 이어 붙이기, `words` 태그, 단어 `example`·`exKo`
   - `tag`·`icon`·`why`
   - `blank`: 정답이 둘이 되지 않는지, 오답으로 위험한 처치를 보이지 않는지
   - `decoy`: 자리마다 조립해서 위험하거나 `ko`에 맞는 문장이 되지 않는지
   - `distractorsKo`
   - 같은 상황의 `nuance`·`order`가 이 문장을 인용하는 곳
4. **changes 파일:** 실제로 바뀐 v44 키(`en`·`ko`·`chunks`·`words`·`goal`, 단어 `en`·`ko`·`ipa`·`icon`·`example`)가
   모두 적혀 있는지 확인합니다. 단어 추가와 삭제도 확인합니다.

## 쓸 것
`/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/review-<주제>-v44.md`에 한국어로 고칠 것 목록을 씁니다.
항목마다 위치, 문제, 구체적인 처방(바꿀 값)을 적습니다. 고칠 것이 없으면 "고칠 것 없음"이라고 씁니다.
대상 파일은 수정하지 말고, 커밋하지 마세요.

## 돌려줄 말
주제마다 고칠 것 개수와 그중 사실·안전 문제의 개수를 적고, 심각한 것은 한 줄씩 적습니다.
