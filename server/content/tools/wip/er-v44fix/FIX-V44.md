# v44 필드 수정 지시 — 결정 11 예외 (2026-10-08 사용자 승인)

v46 검토가 "v44 필드라서 고치지 않고 보고만" 한 항목을 이번에는 **고칩니다**. 사용자가 157건 전부를 검토 권고대로
고치기로 승인했습니다. 이 지시는 맡은 주제의 **목록에 있는 항목에 한해** `pipeline/FIX.md`의 "`keyPhrases` 문장은
절대 바꾸지 않습니다", 그리고 지시서의 결정 11 제한을 풉니다. 목록 밖의 v44 필드는 여전히 바꾸지 않습니다.

## 읽을 것
- `/Users/ywyeom/private/forin/server/content/tools/pipeline/FIX.md`: 수정 절차와 결정 13("고친 값 주변을 다시 읽기")
- `/Users/ywyeom/private/forin/server/content/tools/lesson_author_brief.md`: v46 절, 수정 모드 절
- `/Users/ywyeom/private/forin/server/content/tools/wip/v44fix-items.md`: 맡은 주제의 행
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/fix-<주제>-v46.md`: 각 항목의 원래 지적(맥락이 더 자세함)

## 고칠 파일
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-<주제>.yaml`: 정본에서 새로 뽑은 파일입니다.
  같은 폴더에 `fix_<주제>_v44.py`를 만들어 제자리에서 고칩니다. 손으로 통째로 다시 쓰지 마세요.
- `/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-<주제>.yaml`: v44 필드를 바꿀 때마다 **전부**
  적습니다. 파일이 이미 있으면 `changes:` 목록 끝에 이어 붙이고, 기존 항목은 지우지 마세요. 형식은 다음과 같습니다.

      - kind: sentence            # 문장 en·ko·chunks·words·goal
        situation: <상황 title 그대로>
        index: <문장 번호, 0부터>
        fields: [en, ko, chunks]  # 실제로 바뀐 키만
        why: 'v46 검토 결정 11 예외: <한 줄 이유>'
      - kind: word                # 단어 은행의 en·ko·ipa·icon·example
        id: w-...
        fields: [example]
        why: '...'
      - kind: word-add            # 새 단어
        id: w-...
        why: '...'
      - kind: word-remove
        id: w-...
        why: '...'

  상황 `keyPhrases`는 V16이 보지 않지만, 바꾸면 V4가 문장 en에 글자 그대로 들어 있는지 봅니다.

## 할 일
1. 맡은 주제의 행을 **전부** 반영합니다. 분류(사실·안전·문법·뜻·문체·선호)와 상관없이 다 고칩니다.
2. "처방 없음" 항목은 직접 고친 문장을 씁니다. 미국 병원 실무에 맞고, 간호사가 실제로 할 말이어야 하고,
   15단어를 넘지 않게 씁니다. 돌려줄 말에 이 항목들을 따로 표시하세요(Opus가 집중해서 봅니다).
3. 지적이 틀렸다고 판단하면 고치지 말고 이유를 적습니다.

## 문장을 바꾸면 따라 바꿀 것 (결정 13 + v46)
- `chunks`는 새 `en`을 정확히 이어 붙인 것이어야 합니다. `words` 태그도 새 문장에 맞춥니다.
- 이 문장이 keyPhrase였다면 상황 `keyPhrases`의 그 줄도 새 `en`으로 바꿉니다.
- `ko`를 바꾸면 이 문장을 `example`로 쓰는 단어의 `exKo`를 새 `ko`로 맞춥니다(V17).
  `en`을 바꾸면 그 단어의 `example`도 새 `en`으로 바꾸고 `kind: word` 변경으로 적습니다.
- v46 필드를 새 문장에 맞춰 다시 봅니다.
  - `tag`·`icon`·`why`
  - `blank.answer`: 새 `en`에 글자 그대로 들어 있어야 합니다.
  - `blank.options`(`en`만, `icon` 없음)와 정답이 둘이 아닌지
  - `decoy`: 자리마다 조립해서 위험하거나 `ko`에 맞는 문장이 되지 않는지
  - `distractorsKo`
- 같은 상황의 `nuance`(swap의 options·answer·notes, context 장면과 `word`), `order` 줄이 이 문장을 인용하면
  같이 맞춥니다. context `word`는 세 장면 `en`에 모두 들어 있어야 합니다(W14).
- 바꾼 낱말로 파일을 검색해 다른 설명과 어긋나지 않는지 봅니다.
- 오답으로도 위험한 처치·잘못된 안심·낙인을 보이지 마세요.

## 검사
    python3 /Users/ywyeom/private/forin/server/content/tools/verify_one_theme.py er /Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-<주제>.yaml
위반 0, `==> 통과`, W14 0건이어야 합니다. 끝나면 고치기 전 파일(스크립트 실행 전에 스크래치에 복사해 두세요)과
필드 단위로 비교해 바뀐 것 전부를 목록과 대조하고, changes 파일의 항목이 실제 바뀐 키와 맞는지 확인합니다.

정본(`server/content/nurse/...`)은 수정하지 말고, 커밋하지 마세요.

## 돌려줄 말
주제마다 다음을 적습니다.
- 반영한 개수
- 반영하지 않은 항목(이유)
- 처방 없음 항목에 새로 쓴 문장
- 검사 결과 한 줄
