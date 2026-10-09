# v45 콘텐츠 생산 파이프라인 — 지시서

부서 하나의 주제마다 세 단계를 돈다(결정 14, 스펙 `lesson-four-steps-v44/build-spec-index.md`).

    저작(Sonnet, TASK.md) → 검사기 → 검토(Opus, REVIEW.md) → 수정(Sonnet, FIX.md) → 검사기 → 합치기
    부서마다 Fable 표본 판정 1~2주제(REVIEW.md 기준, 독립 전수 재검토 후 이전 목록 대조)

- 서브에이전트는 모델을 반드시 명시한다(`sonnet` 저작·수정, `opus` 검토, `fable` 판정).
- 작업 폴더는 저장소 안 `wip/<부서>-v45b/`에 두고 단계마다 커밋한다(/tmp는 macOS가 지운다).
- 지시서의 `<작업 폴더>`·`<부서>`·`<부서코드>`·`<주제>`를 부르는 쪽이 채워 넘긴다. 저작 지시서 본문은
  `../lesson_author_brief.md`.
- 합치기: `merge_dept_lessons.py <부서> <디렉터리> --replace` → `go run ./cmd/gencontent` →
  `verify_lesson_content.py --dept <부서> --baseline HEAD --changes changes/<부서>` 위반 0건.

## v46 보강 (학습 화면 핸드오프 1:1, `lesson-fidelity-v46` §D)

    export_dept_lessons.py <부서> <작업 폴더> <주제>  → 저작(TASK.md "v46 보강") → 검사기 → 검토(REVIEW.md "v46") → 수정 → 검사기
    → merge_dept_lessons.py <부서> <디렉터리> --replace → go run ./cmd/gencontent
    → verify_lesson_content.py --dept <부서> --baseline HEAD --changes changes/<부서> 위반 0건

- v46 필드는 **`--replace`로만** 합칩니다(보강 경로는 v45 뉘앙스 전용). 정본과 같은 블록은 원문 그대로 남으므로 diff에는
  새 필드만 보여야 합니다.
- 합치기 도구를 고쳤으면 `export_dept_lessons.py --roundtrip <부서>` — 정본을 그대로 다시 합쳐 바이트 동일인지 봅니다.
- 새 DB 컬럼(`scenarios.lesson_order`, 마이그레이션 000043)이 있어야 order가 앱까지 갑니다 — 시드 전에 migrate.
