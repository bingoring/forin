# ICU·OR 한 번에 저작 파일럿 — 결과 (2026-10-16)

v44(문장·단어)만 있던 주제 4개를 v45(단어 회상 재료·뉘앙스)+v46(문장 낱장·order·오답 재설계)까지 한 번에 저작해 정본에 합쳤다.
공정: Sonnet 저작 A(단어·뉘앙스) ‖ B(문장 낱장·order) → `combine_halves.py` → Opus 검토 A ‖ B (+ 부서마다 1주제 Fable 판정 A ‖ B)
→ Sonnet 수정 → `--replace` 합치기. 단계별 토큰은 `TOKENS.md`.

| 주제 | 커밋 | 검토 고칠 것 | 그중 안전 | 토큰 합 |
|---|---|---|---|---|
| icu-weaning-extubation | `8b4b57d` | 81 (A 38·B 43) | 18 | 117만 |
| or-timeout | `3d0a3a5` | 157 (A 35·B 122) | 32 | 107만 |
| icu-eol-goals (Fable 판정) | `a6ae700` | 약 360 (Opus 199 + Fable 추가) | 8+ | 183만(판정 42만 포함) |
| or-malignant-hyperthermia (Fable 판정) | `706e3de` | Opus 68 + Fable 추가 | 23+ | 161만(판정 38만 포함) |

합계 568만 토큰. 단계별: 저작 A 92만·B 102만, Opus 검토 A 77만·B 87만, Fable 판정 80만, 수정 130만.

## 규모 산정
- Fable 판정을 뺀 주제당 약 107만~142만, 평균 약 122만 토큰. 벽시계 주제당 약 1시간(단계 병렬).
- 35주제 부서 하나 ≈ 4,300만(+ Fable 표본 1주제 약 40만). ICU·OR 나머지 66주제 ≈ 8,000만.
- v44도 없는 26개 부서는 v44 저작(부서당 600만~700만)이 더해져 부서당 약 5,000만 → 26개 부서(약 850주제) ≈ 11억.

## 배운 것
1. **응급·임종 주제에서 오답 안전 실패가 몰린다.** 저작 지시서에 안전 시험을 자세히 써도 Sonnet은 "한 군데만 바꾸기"의 그 한 군데로
   확인 주체·호출 대상·시점·처치 행동을 고른다(재삽관 지연, 기도팀 대신 약사, 단트롤렌 재투여 대신 보고). Opus 검토는 생략 불가.
2. **Fable 독립 판정은 값을 했다.** 안전 항목은 Opus가 더 넓게 잡았지만(B: 23 대 11), Fable은 Opus가 놓친 비속어 오답 조각
   (`anal`·`ass`·`sux`), 품사 불일치 대량(110 대 30), 한국어 오역 2, 어간 단위 되풀이, 순서가 하나로 못 박히지 않는 order를 찾았다.
   사용자 결정(Fable 유지)을 뒷받침한다.
3. **기계로 잡을 수 있는데 지시서로는 안 막힌 것** — 검사기 후보:
   - 오답 조각 금칙어 → **V21로 넣음**(ER 정본의 `cum`×5·`ass`×1, OR `ass`×1도 이때 정리, `a8adf88`).
   - decoy 되풀이(`for the family` 47회), 빈칸 오답 묶음 돌려쓰기(label 계열 17회) — 주제당 상한 경고.
   - 오답 ko 되풀이를 어간까지 세기(조사만 떼면 숨음).
   - slider 정답 위치·길이 편향(MH 14개 중 13개가 가운데 칸·가장 긺).
   - 빈칸 오답에 확인을 뒤집는 말(ignore·skip·forget) 금지.
4. **v44 문장에도 오류가 남아 있었다** — "in date"를 "유효기한도 지났어요", "units are on hold"를 "보류 중"으로 옮긴 반대 뜻 오역,
   지킬 수 없는 약속("She won't suffer"), 부정확한 임상 문장(HFNC가 기도를 연다, 발관 실패에 rescue NIV). 한 번에 저작이 이 정리까지 해 준다.

## 사용자 결정 대기 (keyPhrase — en은 그대로 둠)
- icu-eol-goals: "…she'll settle", "I'm right here with you and I won't leave.", "…he's not in pain", "…he can hear you"(단정 위로 4),
  "Donation is an option some families find meaningful."(미국은 OPO·지정 요청자만 기증을 꺼냄 — 같은 상황 뉘앙스와 어긋남)
- icu-weaning-extubation: "If he's alert with a manageable airway, we can trial rescue NIV briefly."((a) 유지 (b) "if the physician agrees" 덧붙임)
- or-malignant-hyperthermia: "…the vaporizers are off."(MHAUS는 제거 — 같은 상황 뉘앙스가 그렇게 가르침), "This is malignant
  hyperthermia — I'm declaring it."(마취과 판단을 간호사 1인칭으로), "I want it accessible before we induce."(경미)
- 뉘앙스 설계: icu-eol-goals slider 4개가 강도 저울이 아니라 "맞는 응답 고르기" — 허용할지.
