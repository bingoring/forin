# 오답 보기 재저작 검토 지시 (Opus, 2026-10-09)

Sonnet이 `TASK-DK.md`에 따라 ER 문장의 오답 뜻(`distractorsKo`)을 전부 다시 썼고, 길이로 걸린 단어 보기와 빈칸 선택지를 고쳤습니다.
당신은 **바뀐 오답만** 검토합니다.

## 읽을 것
- `/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/TASK-DK.md`
- `/Users/ywyeom/private/forin/server/content/tools/lesson_author_brief.md`의 "문장 `distractorsKo`는 정답 `ko`를 한 군데만 바꾼 말" 절

## 비교
고치기 전은 정본입니다. 스크래치에 `python3 /Users/ywyeom/private/forin/server/content/tools/export_dept_lessons.py er <스크래치> <주제>`로 뽑아,
`wip/er-dk/base-<주제>.yaml`과 필드 단위로 비교하세요. 바뀐 것이 오답 필드(문장 `distractorsKo`, 단어 `distractorsKo`·`distractorsEn`,
빈칸 `options`) 말고도 있으면 지적합니다.

## 문장마다 판정 (스크립트로 `en | ko | 오답1 | 오답2`를 전부 뽑아 읽으세요)
1. **안전 시험(가장 중요)** — 학습자가 오답대로 하면 환자가 다치는가. 용량·부위·경로·약 이름·처치 시점·잘못된 안심·빠뜨린 확인이 바뀌었으면 고칠 것.
2. **정답 둘** — 오답이 `en`의 뜻으로도 맞는가(바꾼 세부가 뜻을 가르지 못함, 실제 절차의 다른 부분).
3. **들리는 자리** — 바꾼 자리가 `en`에서 들리는 낱말인가. 한국어만 읽어서 갈리면 고칠 것.
4. **틀·길이** — 정답 틀을 두고 한두 군데만 바꿨는가, 길이가 비슷한가(V20이 기계적으로 보지만 틀이 완전히 다른 오답도 지적).
5. **뒤집기·부정** — "안/못/절대", 반대말로 만든 것.
6. **말이 되는가** — 그 상황에서 간호사가 할 법한 한국어인가(문법·어색함), 같은 오답 문장이 여러 문장에 되풀이되는가.

단어 보기는 동의어·정답으로도 맞는 뜻, 빈칸은 정답이 둘인 것·위험한 처치를 봅니다.

## 쓸 것
`/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/review-<주제>-dk.md`에 고칠 것 목록을 한국어로 씁니다.
- 항목마다 위치(상황 title + 문장 번호, 0부터), 문제, 구체적인 새 값을 적습니다.
- 고칠 것이 없으면 "고칠 것 없음"이라고 씁니다.

대상 파일은 수정하지 말고, 커밋하지 마세요.

## 돌려줄 말
주제마다 고칠 것 개수와 그중 안전·정답 둘 개수를 적고, 심각한 것은 한 줄씩 적습니다.
