# ICU·OR 나머지 66주제 — 한 번에 저작 작업 공간 (2026-10-16 중단, 다른 세션에서 이어 감)

공정은 `../../pipeline/README.md` "한 번에 저작"(파일럿 `../icu-or-pilot/REPORT.md`):
Sonnet 저작 A(단어·뉘앙스) ‖ B(문장 낱장·order) → `combine_halves.py` → `verify_one_theme.py` → Opus 검토 A ‖ B
(+ 부서마다 1주제 Fable 판정) → Sonnet 수정 → 검사 → **정본 합치기는 사람(메인 세션)이** `merge_dept_lessons.py <부서> <디렉터리> --replace`.

## 상태 (2026-10-16 Workflow 중단 시점)

| 상태 | 주제 |
|---|---|
| **정본 합침(2026-10-25 묶음 1)** | icu-ards-proning · icu-arrhythmia · icu-cardiogenic |
| **정본 합침(2026-10-26 묶음 2)** | icu-hemodynamics · icu-mech-ventilation · icu-resp-support · icu-sedation · icu-shock |
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
- **묶음 2 (ICU 5주제, 2026-10-26)**: 같은 공정. 수정 지시에 고치기 전 원본 `<주제>.pre-fix.yaml`을 작업 폴더에 남기게 해 fix 스크립트를 다시 돌릴 수 있다. 합치기 폴더 `merge-icu-b2/`.
  | 주제 | 검토 A(안전) | 검토 B(안전) | changes | 단어 |
  |---|---|---|---|---|
  | icu-hemodynamics | 74(14) | 47(15) | 100 | 171→168 |
  | icu-mech-ventilation | 142(5) | 43(21) | 93 | 207→195 |
  | icu-resp-support | 93(3) | 67(18) | 97 | 188→184 |
  | icu-sedation | 88(6) | 83(19) | 120 | 217→208 |
  | icu-shock | 145(3) | 67(34) | 118 | 254→251 |
- keyPhrase 결정 대기 추가(en·chunks 미변경): hemodynamics PPV 방향("variation drops"→high)·"Start atropine"→Give·"falsely low" · mech-ventilation 1.2 won't move·8.2 still getting oxygen·19.2 draw up·2.4 just moisture·8.3 isn't an emergency·9.1 간호사 직접 조정 · resp-support 9.2 relief soon·13.0 avoid infections·16.2 escalated sooner · sedation 18.1 bolus per order·19.1 orders for atropine · shock 20.0 not giving up·12.1 10% clearance·17.1 prime the monitor·15.1 goals of care. 그 밖에 구 경계를 끊은 keyPhrase chunks 보고 다수(fix-*-A.md).
- 남은 작은 일: hemodynamics 11상황 "We call this weaning" ko "이탈"(w-wean ko는 "서서히 끊다"로 바뀜), resp-support 16.0 ko "심정지" vs 제목 "호흡정지 임박", resp-support 3.4 "non-rebreather is the highest"(비기계 장치 중 최고).

## keyPhrase 결정 처리 (2026-10-26, 사용자 '추천대로')
위 결정 대기 27건 중 — 바꿈 21건(ards S19.1·S16.0·S10.2, arrhythmia 12.1·13.1·11.1·12.0, hemodynamics PPV high·Give atropine, mech-ventilation 1.2·8.2·9.1(RT에게 요청)·19.2,
resp-support 9.2·13.0·16.2(We need to escalate now), sedation 18.1(PRN per order)·19.1(get orders), shock 20.0(caring for him)·17.1(pressure line)·15.1(goals of care)),
keyPhrase 아니던 2건 바로 고침(mech-ventilation 2.4 drain·8.3 doesn't always mean), 그대로 4건(ards S16.2, cardiogenic heparin, hemodynamics falsely low, shock 10% — why 보강).
작업 `../kp-2026-10-26/`, 딸린 order·nuance·예문·v46 필드 함께. 은행에서 w-bit·w-draw·w-treatment 제거. 남은 결정 대기 없음.

- **묶음 3 (ICU 4주제, 2026-10-27, 이 세션)**: airway·delirium(B 저작부터)·infection-prevention·pain-nonverbal(처음부터). 같은 공정, 수정은 `.pre-fix.yaml`을 읽어 다시 돌릴 수 있음.
  | 주제 | 검토 A(안전) | 검토 B(안전·정답 둘) |
  |---|---|---|
  | icu-infection-prevention | 31(3) | 147(49·27) |
  | icu-airway | 40(9) | 106(55·22) |
  | icu-delirium | 33(3) | 79(33·18) |
  | icu-pain-nonverbal | 37(6) | 67(21·21) |
  keyPhrase 결정 22건(사용자 '추천대로', 한 건이 두 문장을 묶어 문장으로는 23) — 바꾼 문장 18(작업 `../kp-2026-10-27/`), 그대로 둔 문장 5(colors·nebulized epi·secure him·comfortable·naloxone). 모든 keyPhrase 원문 63/63 대조 후 합침.
  V21 금칙어 확대 + distractorsEn까지 검사 → 정본 ER 21·ICU 3·OR 1건 함께 정리.
  남은 ICU: post-arrest(Fable 표본)·sepsis(처음부터)·미착수 19 · OR 33 전부. → 묶음 4로 이어짐.

- **묶음 4 (ICU 4주제, 2026-10-27, 이 세션)**: post-arrest(Fable 표본 판정 A·B 포함)·sepsis·aki-crrt·electrolytes, 모두 처음부터. 같은 공정.
  B 저작 지시에 앞선 묶음에서 많이 걸린 안전 실패 유형(확인 대상만 바꾸기·판단 기준 바꾸기·정답에 말 덧붙이기·엉뚱한 빈칸 오답)을 미리 적었으나, 검토 B 안전 지적은 여전히 많았다.
  | 주제 | 검토 A(안전) | 검토 B(안전·정답 둘) | Fable 판정 | changes(수정 후) |
  |---|---|---|---|---|
  | icu-post-arrest | 41(3) | 95(48·35) | A 84건(pair 둘 다 정답 둘) · B 70(2·12) | 70 |
  | icu-aki-crrt | 46(3) | 97(46·32) | — | 99 |
  | icu-electrolytes | 68(5) | 58(26·18) | — | 145 |
  | icu-sepsis | 38(4) | 48(18·4) + 빈칸 100문장 다시 | — | 145 |
  메인 세션 조정: post-arrest 16.4 오답 "볼루스를 적고 있어요"(처치를 기록으로 바꿈) → "첫 번째 볼루스를 주고 있어요".
  keyPhrase 결정(사용자 '추천대로', 2026-10-27): 바꿈 9(post-arrest Deep hypothermia→Overcooling below our target·tightly controlled·potassium shifts /
  aki-crrt metabolic alkalosis→acidosis(w-alkalosis→w-acidosis, 상황 17 tagline·brief도)·ionized calcium / electrolytes balanced·start·call for / sepsis fever 분리),
  그대로 3(Cold hearts·central line·MTP ready), keyPhrase chunks 구 경계 다시 자르기 허용, electrolytes 17.5·15.5 "오면 보고·상의" 오답은 다음 단계라 유지. 작업 `../kp-2026-10-27b/`.

- **묶음 5 (ICU 4주제, 2026-10-28)**: endocrine-crisis·glycemic·raised-icp·status-epilepticus, 처음부터. Fable 표본 없음(ICU는 묶음 4 post-arrest로 끝).
  | 주제 | 검토 A(안전) | 검토 B(안전·정답 둘) | changes(수정 후) |
  |---|---|---|---|
  | icu-endocrine-crisis | 74(2) | 106(53·15) — 주체만 바꾼 오답 51문장 | 144 |
  | icu-glycemic | 53(5) — ICU에서 신속대응팀 호출 | 51(12·7) + 빈칸 81·decoy 108 다시 | 100 |
  | icu-raised-icp | 100(5) | 142(63·15) | 182 |
  | icu-status-epilepticus | 66(1) | 136(37·14) + 빈칸 60 다시 | 96 |
  B 저작은 "확인 대상만 바꾸지 말라"를 "처치하는 사람만 바꾸기"로 피해 갔다 → `../../pipeline/TASK.md` B 절에 되풀이된 실패 7가지를 적음(묶음 6부터 저작 지시에 넣음).
  keyPhrase 결정(사용자 2026-10-28): 안전·사실 6 바꿈(15분 재측정·D50 조건·인슐린 보류·독립 이중 확인·EVD clamp·can mean per protocol), 표현 5 바꿈, 유지 권고 14건도 '검토 대안대로 모두 바꿈'(대안 없는 3건은 유지) → 22문장 바꿈 + keyPhrase chunks 다시 자르기 24문장. 작업 `../kp-2026-10-28/`.
