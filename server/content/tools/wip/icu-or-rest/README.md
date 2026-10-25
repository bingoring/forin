# ICU·OR 나머지 66주제 — 한 번에 저작 작업 공간 (2026-10-16 중단, 다른 세션에서 이어 감)

공정은 `../../pipeline/README.md` "한 번에 저작"(파일럿 `../icu-or-pilot/REPORT.md`):
Sonnet 저작 A(단어·뉘앙스) ‖ B(문장 낱장·order) → `combine_halves.py` → `verify_one_theme.py` → Opus 검토 A ‖ B
(+ 부서마다 1주제 Fable 판정) → Sonnet 수정 → 검사 → **정본 합치기는 사람(메인 세션)이** `merge_dept_lessons.py <부서> <디렉터리> --replace`.

## 상태 (2026-10-16 Workflow 중단 시점)

| 상태 | 주제 |
|---|---|
| **정본 합침(2026-10-25 묶음 1)** | icu-ards-proning · icu-arrhythmia · icu-cardiogenic |
| A·B 저작 끝남 → **combine부터** | icu-hemodynamics · icu-mech-ventilation · icu-resp-support · icu-sedation · icu-shock |
| A만 끝남 → **B 저작부터** | icu-airway · icu-delirium |
| 저작 중 끊김 → **처음부터** | icu-infection-prevention · icu-pain-nonverbal · icu-post-arrest(Fable 표본) · icu-sepsis |
| 미착수 | ICU 나머지 19 + OR 33 전부(or-massive-transfusion = Fable 표본) |

- 끊긴 반쪽의 중간 파일은 `partial-killed/`로 옮겨 두었다(읽지 말 것 — 다시 저작하면 새로 만든다. 다 끝나면 지워도 됨).
- ICU 옛 v45 저작 8주제(`../icu-v45b/`)는 쓰지 않고 다시 저작한다(사용자 결정 '제안대로').

## 이어 가는 법 (다른 세션)
1. 이 폴더의 `workflow.js`와 `args.json`을 쓴다. 저작 단계는 `haveA`/`haveB`가 true인 반쪽을 건너뛴다(args.json에 위 상태가 이미 반영됨).
   Workflow 도구에 `script`로 workflow.js 내용을, `args`로 args.json 내용을 넘긴다(Workflow는 사용자가 opt-in해야 함 — 2026-10-16 "workflow로 돌려줘"로 허락받음, 새 세션에서는 다시 확인).
2. 주의: Workflow는 파이프라인이라 멈추라는 말을 받으면 **TaskStop 말고는 새 에이전트를 막을 방법이 없고, 멈추면 돌던 것도 끊긴다.**
   한 번에 다 돌리기 싫으면 args의 topics를 10~15개씩 잘라 넘길 것.
3. 끝나면: 주제별 `verifyPass` 확인 → `merge-<부서>/`에 `<주제>.yaml`만 모아 `merge_dept_lessons.py <부서> merge-<부서> --replace`
   → `changes-<주제>.yaml`을 `../../changes/<부서>/`로 복사 → `go run ./cmd/gencontent` →
   `verify_lesson_content.py --dept <부서> --baseline HEAD --changes changes/<부서>` 위반 0 → `go test ./...` → 시뮬레이터 표본 → PR.
4. 검토(fix-*.md)·판정(judge-*.md)의 **keyPhrase 결정 필요** 항목을 모아 사용자에게 묻는다(파일럿 9건 패턴: 단정 위로, 기증 제안, 의사 판단을 간호사 1인칭으로 등).

## 묶음 진행 기록 (2026-10-25~, Workflow 없이 메인 세션이 서브에이전트로 같은 단계를 돌림)

- 이 기기에는 PyYAML이 없어 세션 venv의 python을 썼다. workflow.js의 ROOT(`/Users/ywyeom/private/forin`)는 다른 기기 경로라 프롬프트에서 바꿔 넘겼다.
- **묶음 1 (ICU 3주제)**: combine·verify 통과 → Opus 검토 A‖B → Sonnet 수정 → 메인 세션이 verify 재실행 + keyPhrase en 원문 대조(63/63) → `merge-icu/`로 합침.
  | 주제 | 검토 A(안전) | 검토 B(안전) | changes | 단어 |
  |---|---|---|---|---|
  | icu-ards-proning | 142(8) | 77(38) | 120 | 262→251 |
  | icu-arrhythmia | 158(6) | 80(56) | 121 | 267→264 |
  | icu-cardiogenic | 80(3) | 55(24) | 94 | 264→255 |
  fix_*.py는 수정 전 원본을 세션 scratchpad 백업에서 읽는다(재실행 불가 — 결과 yaml이 정본).
- keyPhrase 결정 대기(en·chunks 미변경): ards S19.1(RT 역할)·S16.0/16.2(앙와위 전 압박)·S10.2(good lung) · arrhythmia 12.1(won't→shouldn't feel)·13.1(most likely)·11.1(safe margin)·12.0(DOAC) · cardiogenic 급성 출혈 "Hold the heparin…"(why에 오더·프로토콜 명시로 임시 대응).
