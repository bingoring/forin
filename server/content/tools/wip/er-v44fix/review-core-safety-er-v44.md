# core-safety-er v44 수정 재검토

비교: 정본에서 새로 뽑은 base(고치기 전) ↔ `wip/er-v44fix/base-core-safety-er.yaml`, `git diff changes/er/changes-core-safety-er.yaml`.
목록 행 6개(14.0 타임아웃 생년월일, 9.4 침상 번호, 11.3 억제대, 3.4 난간, 19.4 carry, chunks 4건)를 모두 대조했습니다
(파일 기준 S13.0·S8.4·S10.3·S2.4·S18.4, chunks S2.6·S7.1·S14.0·S17.0). 빠진 행 없음.
changes 항목이 실제 바뀐 v44 키와 모두 맞습니다(이 주제는 단어 은행 변경 없음, 옛 en을 예문으로 쓰는 단어도 없음).
검사(스크래치 시드) `==> 통과`, W14 0건.

## 수정자 판단에 대한 판정
- **S2.4 `The top rails will stay up whenever I'm not right beside you.`(처방 없음):** 수용. CMS 해석 지침상 환자가 스스로 침대에서
  나오지 못하게 난간 넷을 모두 올리면 억제대로 봅니다. 위쪽 두 난간만 올리는 것이 미국 병원 낙상 예방의 통상 설정이고, 간호사가 곁을
  떠날 때 그렇게 해 두는 것도 맞습니다. ko 일치, 12단어. 다만 decoy·빈칸에 고칠 것이 있습니다(1·2).
  참고: S2.0(keyPhrase)과 order L1 `putting the rails up`은 "전부"라고 못 박지 않아 그대로 둬도 됩니다.
- **S18.4 `Two of us will move the intubated patient on the bed together.`:** 수용. 삽관 환자는 침대째 수평 대피하고, 한 명은 백밸브로
  환기, 한 명은 침대를 미는 2인이 최소 인원이라 사실에 맞습니다. ko(침대째로 같이 옮길게요)도 맞습니다. decoy·빈칸은 고칩니다(3·4).
- **S13.0 생년월일 전체:** 수용. 타임아웃에서는 이름과 생년월일 전체를 말하는 것이 맞고, 연도만으로는 식별자가 되지 않습니다.
  tsv 값이 새 en과 글자 그대로 일치합니다. 다만 같은 상황 order L1이 아직 연도만 말합니다(5).
- **S8.4 wristband, S10.3 breathing tube:** 처방대로. S8.4 why·order L1(손목밴드 이름·생년월일)과 맞습니다. 뺀 w-bed는 S8 pair에 남아 있습니다.
- **chunks 4건:** 처방 취지대로. 다만 S14.0은 청크를 바꾸면서 decoy 문제가 드러났습니다(6).

## 고칠 것

1. **S2 침상 안전 설정 2.4 `decoy` — 정답 자리에 넣으면 뜻이 뒤집힌 맞는 영어** (사실·안전)
   - 문제: `until I'm`이 `whenever I'm` 자리에 들어가면 "The top rails will stay up until I'm not right beside you."(곁을 떠나면 내린다는 뜻).
   - 처방: `decoy: whatever I'm` (네 자리 모두 비문 확인)

2. **S2 2.4 `blank` 오답 `down`** (안전, 낮음)
   - 문제: "The top rails will stay down whenever I'm not right beside you."는 낙상 위험 환자에게 위험한 설정을 문장으로 보여 줍니다.
   - 처방: `options: [{en: open}, {en: loose}, {en: up}, {en: clean}]`

3. **S18 화재·대피 안전 18.4 `blank` 오답 `leave`** (안전)
   - 문제: "Two of us will leave the intubated patient on the bed together."는 화재 중 삽관 환자를 두고 가는 위험한 행동을 맞는 영어로 보여 줍니다.
   - 처방: `options: [{en: weigh}, {en: wake}, {en: move}, {en: bathe}]`

4. **S18 18.4 `decoy`** (문체)
   - 문제: `on the stairs`가 `on the bed together` 자리에 들어가면 "Two of us will move the intubated patient on the stairs."(맞는 영어).
   - 처방: `decoy: stairs together`

5. **S13 오환자 시술 방지 order L1 — 13.0과 어긋나게 연도만** (사실, v46 필드)
   - 문제: 13.0은 생년월일 전체로 고쳤는데 order L1이 `born in 1962`이고 why도 "환자(이름·생년)"입니다. 타임아웃 식별은 생년월일 전체입니다.
   - 처방: L1 `en: Time-out: John Reyes, born March 3, 1962, right chest tube.`, `ko: 타임아웃, 존 레예스 씨, 1962년 3월 3일생, 오른쪽 흉관이에요`,
     order `why`의 `환자(이름·생년)` → `환자(이름·생년월일)`.

6. **S14 급변 환자 조기 경고 14.0 `decoy` — 청크 수정으로 정답이 둘** (문체)
   - 문제: 청크가 `is up` / `and pressure` / `is dropping`으로 바뀌어 `is stable`이 `is up` 자리("Her heart rate is stable and pressure is dropping.")와
     `is dropping` 자리("…and pressure is stable.") 모두에서 맞는 영어가 됩니다.
   - 처방: `decoy: are stable` (주어와 수가 맞지 않아 어느 자리에서도 비문)

고칠 것 6건(사실·안전 4건: 1·2·3·5번).
