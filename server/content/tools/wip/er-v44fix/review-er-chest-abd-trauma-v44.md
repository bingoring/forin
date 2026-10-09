# er-chest-abd-trauma v44 수정 재검토

대조: 정본 export ↔ `base-er-chest-abd-trauma.yaml`, changes 새 항목 22건.
changes는 실제 바뀐 v44 키와 빠짐없이 맞는다. base 상황 `keyPhrases` 3곳은 정본 + tsv와 같다. V4 실패 4건은 정본의 keyPhrase가 아직 옛것이라서 생기며, `apply_keyphrases.py`를 돌리면 사라진다.

## 판정 요청 항목
- **대시 → 두 문장(7.1·11.0·15.5):** 괜찮다(burn과 같은 판단). order L1(S7·S11)·L4(S15)와 context 장면(S11 scene[0])도 같이 맞췄다.
  - 15.5를 두 문장으로 나누면 "This"가 '가만히 있는 것'을 가리키는 것으로 더 또렷하게 읽힌다. 다만 대시였을 때도 같은 뜻이었으므로 이번 수정으로 생긴 문제는 아니다.
- **11.3 "I'll cover any exposed organ with a moist sterile dressing.":** 지적을 해결한다. 상황 brief가 "장기 탈출부는 습윤 피복, 이물은 제거 금지"로 두 가지를 다 다루므로, 젖은 드레싱의 대상을 장기로 밝힌 것이 맞다.
  - why에 "박힌 물체는 주변을 두꺼운 패드로 받쳐요"를 더한 것도 맞다.
  - 빈칸(sterile / rough·dusty·dirty)과 decoy(with a towel)에 문제가 없다.
- **11.4와 w-wound 이동:** 11.4는 목록 밖이 아니다. 행이 "11.3, 11.4"를 함께 가리킨다.
  - "protect the organ and wound"는 brief에 맞는다.
  - w-wound example·exKo, w-protect·w-surgery의 exKo, order L3·L4가 함께 맞춰졌다.
- **S20 context word car → trauma:** 검토자 처방 그대로이고 W14를 지킨다(세 장면 모두 trauma).
  - 차트 장면 "blunt chest and abd trauma, side impact"는 S4의 수상기전(측면 충돌)과 맞다.
  - 어색한 장면 "has, like, some trauma from a car thing"은 막연한 구어라는 학습 의도를 지킨다. ko "외상"이 정확하다.

## 고칠 것
1. **6.5 청크가 명사구를 끊음(문체)**
   - 문제: `again`을 빼자 낱말이 9개가 되어 최소 4조각을 맞추려고 `["I'll recheck", "your oxygen", "level", "in a few minutes", "."]`로 `oxygen level`을 갈랐다. 목록이 다른 주제에서 지적한 것과 같은 결함이다.
   - 처방: `chunks: ["I'll", "recheck", "your oxygen level", "in a few minutes", "."]`
   - `blank`(recheck)·`decoy`(on the monitor)는 그대로 둔다. changes 항목(S6 index 5: en·chunks)도 이미 맞다.

## 확인만
- 2.5 "right away"를 넣은 것(처방 없음 행), 7.4 "over the last few minutes"는 맞게 고쳤다.
  - 2.5의 decoy `tomorrow`는 `right away` 자리에 들어가면 `ko` "바로"와 어긋나므로 정답 문장이 되지 않는다.
- 11.0 decoy `on the floor`는 바꿀 필요가 없었지만 문제도 없다.
