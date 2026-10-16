| 단계 | 주제 | 모델 | 토큰 | 시간 | 비고 |
|---|---|---|---|---|---|
| 저작 A | or-timeout | sonnet | 218,470 | 12.6분 | 단어 142·뉘앙스 43, 위반 0·경고 0 |
| 저작 A | icu-eol-goals | sonnet | 231,613 | 13.7분 | 단어 254·뉘앙스 51, 결정11 변경 73, 위반 0 |
| 저작 B | icu-eol-goals | sonnet | 267,177 | 17.2분 | 문장 147·order 21, 위반 0, 오답 전용 낱말 최다 5 |
| 저작 B | icu-weaning-extubation | sonnet | 260,829 | 17.7분 | 문장 126·order 21, 위반 0 |
| 저작 A | icu-weaning-extubation | sonnet | 247,799 | 21.0분 | 단어 175·뉘앙스 42, 결정11 변경 16, 위반 0 |
| 저작 A | or-malignant-hyperthermia | sonnet | 218,632 | 12.5분 | 단어 182·뉘앙스 43, 결정11 변경 48, 위반 0 |
| 저작 B | or-timeout | sonnet | 222,284 | 14.0분 | 문장 105·order 21, 위반 0 |
| 검토 A | icu-eol-goals | opus | 201,347 | 14.0분 | 고칠 것 약 105 + 결정11 11, 비속어 decoyChips 4, keyPhrase 결정 5 |
| 검토 B | icu-eol-goals | opus | 230,063 | 16.0분 | 고칠 것 94(안전 8·정답 둘 28), decoy 'for the family' 47회 |
| 검토 A | icu-weaning-extubation | opus | 190,160 | 12.8분 | 고칠 것 38, keyPhrase 결정 1(rescue NIV) |
| 검토 A | or-timeout | opus | 190,939 | 9.3분 | 고칠 것 35(결정11 9·v45 26), keyPhrase ko 오역(on hold) |
| 검토 B | icu-weaning-extubation | opus | 214,277 | 16.7분 | 고칠 것 43(안전 18·정답 둘 6) |
| 저작 B | or-malignant-hyperthermia | sonnet | 273,415 | 20.3분 | 문장 105·order 21, 위반 0 |
| 검토 B | or-timeout | opus | 213,011 | 14.0분 | 고칠 것 122(안전 32·정답 둘 6, 빈칸 60) |
| 판정 A | icu-eol-goals | fable | 219,871 | 13.6분 | 심각 4(비속어 3·ko 오역 3), 품사 불일치 약 110, 안전 사실 오류 0 |
| 수정 | icu-weaning-extubation | sonnet | 253,512 | 8.9분 | A 38·B 43 전부 반영, 변경 목록 48, 위반 0 |
| 판정 B | icu-eol-goals | fable | 195,102 | 16.8분 | 고칠 것 29(안전 1·정답 둘 2), 안전 항목은 Opus 목록에 이미 있음 |
| 수정 | or-timeout | sonnet | 229,815 | 7.8분 | A 35·B 122 전부 반영, 변경 목록 70, 위반 0 |
| 검토 A | or-malignant-hyperthermia | opus | 189,498 | 11.9분 | 고칠 것 21묶음, 심각 4(ko 반대·미확인 확인·12바이알·냉각 why), slider 정답 가운데 13/14, keyPhrase 결정 1(vaporizers off) |
| 검토 B | or-malignant-hyperthermia | opus | 211,607 | 18.9분 | 고칠 것 47(안전 23·정답 둘 15) |
| 판정 B | or-malignant-hyperthermia | fable | (대기) | | 고칠 것 32(안전 11·정답 5), S16 order 유발약 중단↔도움 요청 순서 문제 제기 |
