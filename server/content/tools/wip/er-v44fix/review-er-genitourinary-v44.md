# er-genitourinary — v44 수정 재검토 (Opus)

비교: 정본에서 새로 뽑은 파일(고치기 전)과 `wip/er-v44fix/base-er-genitourinary.yaml`을 필드 단위로 대조했다.
상황 번호는 1부터 센다. 목록의 8.3은 S8 「남성 요폐(전립선)」의 문장 2다.

## 판정 요약
- **목록 대조:** 1행(8.3)이 반영됐다.
- **8.3 (새로 쓴 문장) `This will tell us how much urine is inside your bladder.`**
  - 11단어다.
  - 요폐(배뇨 전) 장면의 방광 스캔은 남은 양(잔뇨)이 아니라 지금 찬 양을 잰다는 지적에 맞다.
  - 간호사가 실제로 하는 말이고 `ko`도 같은 뜻이다.
  - `words`에서 `w-left`를 빼고 `w-bladder`를 넣은 것도 맞다.
  - 빈칸(`urine`)과 `why`도 맞다.
  - swap note(PVR)도 같이 고쳤다.
- **`w-left` 삭제:** 다른 문장 태그와 뉘앙스 words에 없어 맞다.
- **changes 파일:** S8.2 `[en,ko,chunks,words]`와 `w-left` remove는 맞다. 아래 1번의 `w-much` 항목이 빠져 있다.
  - 끝에 있던 기존 항목의 `why` 따옴표 모양만 바뀌었다. YAML 다시 쓰기 때문이고 내용은 같다.
- **keyPhrase:** 8.3은 keyPhrase이고 `keyphrases.tsv`의 줄이 새 `en`과 같다.
- **검사:** keyPhrase를 바꾼 스크래치 시드로 돌렸다. 위반 0, W14 0이고 `==> 통과`가 나왔다. W13 경고 5건은 이번 수정과 무관하다.

## 고칠 것

### 1. 단어 `w-much`의 예문이 고치기 전 8.3 그대로다 [딸린 필드, FIX-V44 필수]
- **문제:**
  - `example: This will tell us how much urine is left inside.`와 `exKo: 이걸로 안에 소변이 얼마나 남았는지 알 수 있어요.`가 옛 문장 그대로다.
  - `cue`도 `잔뇨가 얼마나 되는지 양을 물을 때`라 이번에 고친 뜻(잔뇨가 아님)과 어긋난다.
  - V17은 예문이 현재 문장과 같을 때만 보므로 잡지 못했다.
- **바꿀 값:**
  - `example`: `This will tell us how much urine is inside your bladder.`
  - `exKo`: `이걸로 방광 안에 소변이 얼마나 있는지 알 수 있어요.`
  - `cue`: `방광에 소변이 얼마나 찼는지 양을 물을 때 — 'how ___ urine'`
- **changes:** `kind: word`, `id: w-much`, `fields: [example]`, `why: 'v46 검토 결정 11 예외: 예문이 고치기 전 8.3 en과 같아 새 en으로 맞춤'`

### 2. S8 swap `who`가 고친 뜻과 어긋난다 [뉘앙스]
- **문제:** `who: 환자에게 · 잔뇨 측정 안내`라고 적혀 있다.
  그런데 같은 swap의 note와 why는 이제 "잔뇨(PVR)가 아니라 방광에 찬 양"이라고 설명한다.
- **바꿀 값:** `who: 환자에게 · 방광 스캔 안내` (v45 필드, changes 항목 없음)

### 3. S8 문장 2 decoy `how much blood`가 맞는 문장을 만든다 [decoy]
- **문제:** 둘째 자리에 넣으면 `This will tell us how much blood is inside your bladder.`가 된다.
  `ko`와 다른 문장이 맞는 영어로 조립된다. 고치기 전에도 같은 문제였다.
- **바꿀 값:** `decoy: how long ago`
  - 어느 자리에 넣어도 문장이 되지 않는다.
