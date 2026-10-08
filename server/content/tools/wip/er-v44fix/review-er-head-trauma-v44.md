# er-head-trauma — v44 수정 재검토 (Opus)

비교: 정본에서 새로 뽑은 파일(고치기 전)과 `wip/er-v44fix/base-er-head-trauma.yaml`을 필드 단위로 대조했다.
상황 번호는 1부터 센다. **이 주제의 v46 검토(`er-v46/fix-er-head-trauma-v46.md`)와 목록은 상황을 0부터 셌다.**
목록 번호와 실제 상황은 다음과 같이 맞춰진다.

| 목록 | 실제 상황 |
|---|---|
| 18.3 | S19 「두부외상 SBAR 인계」 문장 3 |
| 2.0 | S3 「동공 반응 확인」 |
| 9.1 | S10 「음주 동반 두부외상」 |
| 12.2 | S13 「반복 구토·기면 진행」 |
| 14.0 | S15 「경막외혈종 명료기 후 악화」 |
| 16.0·16.4 | S17 「두부외상 삽관·환기」 |
| 1.1 | S2.1 |
| 7.3 | S8.3 |
| S14·S15 | S15 「경막외혈종 명료기 후 악화」·S16 「뇌탈출 임박(동공 산대)」 |

## 검사 결과 (다시 돌림)
FIX-V44의 검사를 스크래치 환경에서 다시 돌렸다.
- **스크래치 환경:** 정본 `nurse/topics/er.yaml`을 복사하고, `keyphrases.tsv`의 이 주제 5줄을 새 `en`으로 바꿨다.
  검사기 두 파일도 복사했다. 나머지 `nurse/*`와 `mobile`은 정본을 가리키는 링크다.
- **changes 파일:** base 파일과 같은 폴더에 `changes-er-head-trauma.yaml`을 같이 두고 돌렸다.
  `wip/er-v44fix`에는 이 주제의 changes 링크가 없어 V16 결정 11 목록이 읽히지 않는다. 수정자가 결과를 확인하지 못한 까닭으로 보인다.
- **결과:** `er-head-trauma: 상황 20/20 · 단어 123개`, 변경 목록 93건이 읽혔다. **위반 0, W14 0, `==> 통과`**다.
  - W13 경고 3건(`worst`·`store`·`emergence`)은 이번 수정과 무관하다.
- **대조:** 정본 시드 그대로 돌리면 대시를 띄운 keyPhrase 5개에서 V4가 실패한다. 예상한 대로이고, 합칠 때 keyPhrase를 바꾸면 풀린다.

## 판정 요약
- **18.3 `Left pupil remains brisk and reactive.`:** 처방대로이고 맞다.
  - 18.1의 우측 산대와 이제 모순되지 않는다.
  - 빈칸 `reactive`(오답 `dilated / sluggish / fixed`)는 `brisk and ___`에서 정답이 하나다.
  - decoy `became fixed`도 조립되지 않는다.
  - `why`·`w-reactive`의 `example`과 `exKo`도 맞다.
  - 은행에 `w-equal`이 없어 따로 지울 단어는 없다.
- **대시 청크(목록의 6문장):** 6문장이 모두 대시 앞뒤에 공백을 넣고 대시에서 청크를 나눴다.
  - keyPhrase 5개(S3.0·S10.1·S13.2·S15.0·S17.0)의 `keyphrases.tsv` 줄이 새 `en`과 같다. S17.4는 keyPhrase가 아니다.
  - S15 order L1과 예문 4개(`w-light`·`w-alcohol`·`w-secure`·`w-airway`)도 같이 고쳤다.
- **대시를 띄우기 vs 마침표로 두 문장 만들기:** **이 주제처럼 대시 앞뒤에 공백을 두고 대시에서 나누는 쪽이 맞다.**
  - **코퍼스 표준이다.** 정본 문장 `en`의 em dash는 ER이 띄움 284 : 붙임 42, ICU가 203 : 0이다.
  - **문장이 하나로 남는다.** 한 호흡으로 하는 말(지시 + 이유)이 그대로이고, `ko`·`why`·오디오 단위가 바뀌지 않는다. 바뀌는 것은 공백뿐이다.
  - **keyPhrase 교체가 가장 작다.** 글자 차이가 공백 두 개라 합칠 때 검토하기도 쉽다.
  - burn·chest-abd-trauma의 마침표 두 문장도 틀린 영어는 아니다. 다만 표준과 다르고 문장 수와 리듬을 바꾼다.
    ER 안에서 통일하려면 그 둘도 공백 대시로 되돌리기를 권한다. 그 주제 검토자의 판단에 맡긴다.
- **`words: []`(S2.1·S8.3)를 반영하지 않은 것:** 맞다.
  - `Tell me where you are and what day it is.`와 `Is he acting differently than he usually does?`에 맞는 은행 단어가 없다.
  - 태그를 채우려면 v45 필드를 모두 갖춘 새 단어를 만들어야 하는데, 이는 결정 11 한 행의 범위를 넘는다.
  - V3도 통과한다.
  - 참고: S2.5 `I'll ask you these same questions again soon.`은 은행의 `w-same`을 태그할 수 있다. 목록에 없는 행이라 이번에는 손대지 않는다.
- **changes 파일:** 실제로 바뀐 v44 키와 일치한다.
  - S19.3 `[en,ko,chunks]`
  - 대시 6문장 `[en,chunks]`
  - 단어 예문 5건(`w-reactive`·`w-light`·`w-alcohol`·`w-secure`·`w-airway`) `[example]`

## 고칠 것

### 1. S13 문장 2 decoy `a stomach bug`가 새 청크에서 잘못된 안심 문장을 만든다 [안전]
- **문제:** 청크를 대시에서 나누면서 둘째 자리가 `rising pressure` 하나가 됐다.
  - 그 자리에 decoy를 넣으면 `This could mean a stomach bug — we're rechecking him now.`가 맞는 영어로 조립된다.
  - 반복 구토와 기면을 장염으로 돌리는 잘못된 안심이다.
  - 고치기 전에는 조각 `rising pressure—we're` 때문에 이 조립이 성립하지 않았다. 이번 청크 수정이 만든 문제다.
- **바꿀 값:** `decoy: keeps sleeping`
  - 어느 자리에서도 문장이 되지 않는다.
  - 기면이라는 장면과 맞닿은 오답이다.

### 2. S17 문장 4 decoy `Fluids take`가 위험한 우선순위를 조립한다 [안전]
- **문제:** 첫 자리에 넣으면 `Fluids take priority — GCS is too low to protect it.`가 된다.
  - 맞는 영어인데, GCS 6에서 기도보다 수액을 앞세우는 틀린 우선순위다.
  - 고치기 전에도 첫 자리 조립은 같았지만, 이 문장의 청크를 다시 나눴으니 같이 고친다.
- **바꿀 값:** `decoy: takes turns`
  - 어느 자리에서도 조립되지 않는다.
  - `Pain takes`·`Bleeding takes`처럼 다른 처치를 주어로 세우는 decoy는 같은 문제를 만들므로 쓰지 않는다.

### 3. S17 문장 0 decoy `to clean`이 다른 문장을 만든다 [decoy]
- **문제:** 셋째 자리에 넣으면 `GCS is 6 — we need to clean the airway.`가 된다.
  맞는 영어인데 `ko`(기도 확보)와 다른 처치다.
- **바꿀 값:** `decoy: was 6`
  - `GCS is 6`과 헷갈리게 하는 오답이다. 어느 자리에서도 조립되지 않는다.

### 4. 정본 시드 상황 `role` — 합칠 때 `nurse/topics/er.yaml`에서 고친다 [시드 필드, base·changes 밖]
목록의 "S14·S15"는 0부터 센 번호다. 실제 상황은 아래 두 개다.

- **S16 「뇌탈출 임박(동공 산대)」(정본 58187행 부근) → `role: colleague`로 바꾼다.**
  - **근거:**
    - persona가 무반응·자세이상 환자라 대화 상대가 될 수 없다(tagline `*one pupil blown, decerebrate posturing*`).
    - 문장 여섯 개 중 `Check the other pupil now—compare both sides.`·`Get neurosurgery on the phone right now.`는 팀에게 하는 지시다.
    - `One pupil is blown—this is an emergency.`·`His posturing means…`도 팀에게 하는 말이다.
    - 같은 주제의 S17 「두부외상 삽관·환기」와 polytrauma 「외상성 심정지 대응」이 같은 꼴(무대 지시 tagline + RN 동료)을 쓴다.
  - **바꿀 값:**
    - `role: colleague`
    - `persona: { name: Dana Whitaker, ageRange: 30s, sub: "37y / Female (RN)", mood: neutral, personality: 위기에 침착, speakingStyle: 지시를 명확히 복창 }`
    - `tagline`·`brief`·`keyPhrases`·`goals`·`acuity`·`room`은 그대로 둔다.
- **S15 「경막외혈종 명료기 후 악화」 → `role: patient` 그대로 둔다.**
  - 문장 여섯 개가 모두 의식이 있고 겁에 질린 환자에게 하는 말로 성립한다.
    - `Your headache is suddenly much worse — we're acting now.`
    - `Stay with me and keep talking to me.`
    - `We're calling neurosurgery immediately.`
    - `You felt fine minutes ago—now tell me what changed.`
    - `This sudden change looks like bleeding building up fast.`
    - `We need surgery fast to relieve the pressure on your brain.`
  - persona(Scott Farley, panic)도 대화 상대로 맞다.
- **합칠 때 볼 것:** `nurse/scenarios/gen-er.yaml`에도 같은 시드(role·persona·keyPhrases)가 복제돼 있다.
  role을 고칠 때와 keyPhrase 5개를 바꿀 때 함께 반영하거나 다시 생성한다.

### 5. (후속, 사용자 결정) 목록이 놓친 대시 청크 6문장 [문체·선호, 목록 밖]
- **문제:** v46 검토가 놓친, 같은 문제의 문장이 6개 더 있다. 청크가 대시를 넘는다.
  - S11.0 `around your eyes—when` (keyPhrase)
  - S14.1 `medicine—do you`
  - S15.3 `minutes ago—now`
  - S16.0 `is blown—this` (keyPhrase)
  - S16.4 `now—compare`
  - S18.3 `here—that`
  - 이번 수정 뒤 주제 안에 띄운 대시와 붙인 대시가 섞였다. 문장 `ko`의 대시도 모두 붙어 있다.
- **처리:** 목록 밖의 v44 필드라 FIX-V44에 따라 수정자는 손대지 않은 것이 맞다.
  행의 뜻(대시를 넘는 청크)은 똑같이 해당한다. 사용자가 승인하면 같은 방식으로 고친다.
  - 대시를 띄우고 대시에서 청크를 나눈다.
  - keyPhrase 2개를 바꾼다.
  - 같은 문장을 예문으로 쓰는 단어의 `example`도 고친다.
  - changes에 `[en,chunks]`를 적는다.
