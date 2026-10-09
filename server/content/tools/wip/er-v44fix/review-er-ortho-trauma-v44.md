# er-ortho-trauma v44 수정 재검토

목록 행 3개(2.5 `on both hands`, 10.3 `prepare transfer`, 13.5 ko `지시할게요`)를 모두 대조했습니다. 빠진 행 없음.
**번호 주의:** 이 주제의 목록 번호는 파일 위치와 한 칸씩 어긋나 있습니다. 실제 위치는 S1.4(신경혈관(5P) 확인),
S9.2(손가락 절단 이송), S12.4(병적 골절 의심)이고, 수정자가 문장 내용으로 찾아 세 곳 모두 맞게 고쳤습니다.
`wip/v44fix-items.md`의 ortho-trauma 행 번호를 바로잡아 두면 좋습니다.

- 1.4 `with both hands`, 9.2 `prepare for the transfer`: 처방 그대로. chunks 이어 붙이기·why 인용·단어 예문
  (w-squeeze·w-hard·w-control·w-bleed·w-prepare·w-transfer) 모두 새 en과 같습니다.
- 12.4 ko `검사를 할 거예요`: 처방 그대로. w-order·w-scan exKo도 맞췄습니다.
- changes: 실제로 바뀐 v44 키와 모두 일치(V16 통과).
- 검사: `[V4] 손가락 절단 이송 keyPhrase` 1건 실패는 예상된 것입니다. `keyphrases.tsv` 2행이 새 en과 글자 그대로 같으니
  합칠 때 정본 시드 keyPhrases를 바꾸면 풀립니다.

## 고칠 것

1. **S1 신경혈관(5P) 확인 1.4 `decoy`** (문체, 낮음)
   - 문제: `for a long time`이 바뀐 청크 `with both hands` 자리에 들어가면 "Squeeze my fingers as hard as you can for a
     long time."이라는 맞는 영어가 됩니다(`ko`의 "양손으로"와는 다름).
   - 처방: `decoy: with both hand` (단수라 비문으로 걸러짐).

2. **S9 손가락 절단 이송 9.2 `decoy`** (문체, 낮음)
   - 문제: `after the call`이 `for the transfer` 자리에 들어가면 "…while we prepare after the call."이 됩니다.
   - 처방: `decoy: prepare transfer` (원래 지적된 비문을 오답으로 재활용 — 어느 자리에 넣어도 비문).

고칠 것 2건(사실·안전 0건). 둘 다 낮음이라 그대로 두어도 학습에 큰 지장은 없습니다.
