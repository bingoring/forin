# ICU v45 보강 — 일시 중지된 작업 공간 (2026-10-07)

ICU 35주제의 v45 보강(회상 재료 + 뉘앙스 + 결정 11 정리)을 **8주제까지 저작하고 멈췄다.** 사용자 결정:
ER을 먼저 끝내고, 저작이 오래 걸리므로 ICU는 뒤로 미룬다. 정본(`content/nurse/`)에는 아무것도 합치지
않았다. 이 폴더는 저작 결과의 보관본이다 — `gencontent`·검사기는 이 폴더를 읽지 않는다.

## 상태

| 주제 | 상태 |
|---|---|
| core-family-icu · core-handoff-icu · core-language-icu · core-safety-icu | 저작 완료 · Fable 검토 전 |
| icu-airway · icu-aki-crrt · icu-ards-proning · icu-arrhythmia | 저작 완료 · Fable 검토 전 |
| icu-brain-death · icu-cardiogenic · icu-delirium · icu-electrolytes · icu-endocrine-crisis | 저작 **중단**(부분 파일만 있음 — `icu-cardiogenic.yaml`도 미완성이다). 처음부터 다시 저작 |
| 나머지 22주제 | 미착수 |

8주제는 각각 `verify_one_theme.py icu <파일>`로 위반 0건 통과를 확인했다(2026-10-07, 복구 직후).
저작자가 짚은 판단 거리는 `REVIEW-NOTES.md` — 검토 때 Fable에게 함께 넘긴다.

## 재개 방법

지시서(`TASK.md`·`REVIEW.md`·`FIX.md`)는 `/tmp/lesson-icu-v45b/` 경로를 가리킨다. 그대로 쓰려면:

    D=/tmp/lesson-icu-v45b; mkdir -p $D && cp -R server/content/tools/wip/icu-v45b/. $D/
    cd server/content/tools && python3 split_theme_inputs.py icu $D   # in-<주제>.json
    # base-<주제>.yaml: 정본에서 다시 만든다(verify_lesson_content.load_lexicon_raw / load_topics) —
    # ER 작업 공간을 만든 스크립트와 같다(build-spec §11 'ER 나머지' 기록 참고).

공정은 ER과 같다: Opus 저작(`TASK.md`) → Fable 전수 검토(`REVIEW.md`, `fix-<주제>.md`) → Opus 수정(`FIX.md`) →
`verify_one_theme.py` → `merge_dept_lessons.py icu <디렉터리> --replace` → `changes/icu/`에 변경 목록 복사 →
`verify_lesson_content.py --dept icu --baseline HEAD --changes changes/icu` 0건 → gencontent·seed·테스트 → 커밋.

**/tmp에 오래 두지 말 것.** 2026-10-06 macOS 정기 정리가 `/tmp/lesson-*`와 세션 scratchpad를 비웠다
(검토 대기 중 사흘 넘게 손대지 않은 파일). 이 폴더는 서브에이전트 기록을 다시 실행해 복구한 것이다.
진행 중에는 체크포인트마다 이 폴더로 되복사해 커밋한다.

## 비용 실측(ICU)

저작 주제당 약 22만~30만 토큰(ER 약 16만~20만보다 큼 — ICU 은행이 주제당 평균 260단어로 ER의 약 1.4배).
