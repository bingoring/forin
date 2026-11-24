# core-language-icu — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `core-language-icu.yaml`(A·B 합친 파일), 21상황 · **146문장** · order 21장 전수. 번호는 0부터(상황.문장 / S상황 L줄).
스크립트(작업 폴더): `_reviewB_core-language-icu.py`(`ko`·`blank`·`decoy`·`order` 모드 → `_reviewB_core-language-icu_{ko,blank,decoy,order}.txt`),
`_reviewB_core-language-icu_stats.py`(표지·길이·검사기 `_ko_stems` 그대로의 오답 전용 어간·decoy·빈칸 오답 빈도),
`_reviewB_core-language-icu_vals.py`(**아래 distractorsKo·빈칸·decoy 새 값 전부** — 수정 담당이 그대로 읽어 넣으면 됨),
`_reviewB_core-language-icu_apply.py`(새 값을 사본 `_reviewB_core-language-icu_chk/core-language-icu.yaml`에 넣음; 정답 ko 끝 부호를 붙임).
새 값에는 마침표를 안 붙였습니다 — apply처럼 정답 ko 끝 부호(`.`/`?`)를 붙여 넣으세요.
**새 값을 넣은 사본은 `verify_one_theme.py icu` 통과**(V20 0, W17·W18·W19·W21 0). order·why는 아래 D·E에 문장으로 적었습니다(스크립트에 없음).

## 판정 기준 (수정 담당도 이 기준으로)
- 오답이 정답 행동의 **앞·뒤 단계**(통증을 알리면 → 진통제를 드림, 시연 앞의 용량 재기), **참인 다른 사실·이유**, 해 없는 세부(사람·장소·물건·색·말투)면 통과.
- 그 순간 정답 행동 **대신** 하는 일이면 실패. 특히 **되묻기·teach-back·return demo·통역 이용 단계를 빼거나 다른 일로 바꾸기**(읽기·모아 두기·사과·기록·보관), **호출 기준·결정 기준·척도 기준·간격 바꾸기**는 실패.
  위기 문장(15.x 호흡 곤란)에서 정답 처치를 옆 일로 바꾼 것도 실패(묶음 6·7 규칙).
- **신호 동작 바꾸기(깜빡임↔쥐기·끄덕임)는 통과로 봄** — `en`에서 들리는 낱말이고 뜻이 분명히 갈리며(④), 그대로 해도 해가 없음(⑥). "실제 대체 신호"라는 사실은 듣기 문항에서 정답 둘이 되지 않음(학습자는 blink를 듣고 고름).
  다만 **같은 쥐기/끄덕임 짝을 1.2·6.0·6.1·6.3 네 문장에 되풀이**해서 "신호 낱말만 바뀐 쪽이 오답"으로 걸러지므로 6.0·6.1의 X2만 다른 틀로 바꿈(아래 A).
  **빈칸은 다름** — ko가 없어 장면에서 맞는 신호(Blink·Squeeze·Wave)는 정답 둘이므로 3.6·4.2·6.0 빈칸은 옮김.
- 같은 범위 안 값(몇 분 ↔ 1·10분)과 앞으로 할 일의 간격은 "기준·간격 바꾸기"로 실패. 보고값 숫자는 이 주제에 없음.
- "오답 둘에만 조건·목적 표지"는 한 문장 안에서 X1·X2 중 하나에만 두어 0을 유지.

## 기계적으로 센 것
- **오답 둘에만 조건·목적 표지가 붙은 문장: 0개**(지금). 새 값 뒤 스크립트는 15.4를 1로 세지만 X2 `보면서`의 `면`을 잘못 잡은 것 — 실제 0.
- **오답 둘 다 정답보다 김(공백 포함 글자 수): 4문장**(0.0 2.4 4.6 7.1) — 25주제 규칙 위반. 새 값 뒤 **0**. V20 지금 0 · 새 값 뒤 0.
- **되풀이 상한(오답 전용 어간, 검사기 `_ko_stems`)**: 지금 최댓값 5(`기록`·`손을`·`기억`) — W19 없음. 새 값 뒤 최댓값 5(`손을`·`드릴`·`적을`·`기억`) — **수정 담당은 이 넷을 더 넣지 마세요**(4회: `두`·`천천`·`그림`·`언제`·`크게`·`적어`·`필요`·`시간`).
- **decoy 모양(146개)**: 어느 청크 자리에도 안 맞음 **4개**(2.2 `your hand`, 4.5 `what I wrote`, 9.4 `the hospital rules`, 19.0 `video interpreter` 관사 없음), ko에 맞는 다른 문장(정답 둘) **4개**(0.2 3.2 11.6 13.3). 조립하면 안전 문제 0, 반대말 decoy 0. 나머지는 같은 자리의 다른 뜻 구라 통과. 첫 낱말 분포 `the` 10 · `to` 8 · `in`·`for`·쉼표 6 — 장소 구 몰림 없음.
- **decoy 낱말 몰림**: 내용어 `team` 4(1.6 8.3 16.2 18.2) · `visit` 4(8.2 12.3 17.2 17.6) — 낱말만 보고 걸러짐 → 둘씩 바꿈(8.3 18.2 / 12.3 17.2). 같은 decoy 되풀이 `is repeated` 2(13.4 17.0)는 W18 아래라 둠. 새 값 뒤 내용어 최댓값 3(`warm`·`quiet`).
- **빈칸 오답 되풀이**: 지금 최댓값 3(`alone`·`long`·`one`·`blink`·`quick`·`short`·`loud`·`food`…) + **시간 단위 묶음**(2.3 week/month/year, 2.6 days/weeks/months, 2.1·0.0·0.5 next year/last month/yesterday, 6.6 hours/seconds/nights). 새 값 뒤 최댓값 3, W18 0.

| 갈래 | 상위 5 (지금) | 상위 5 (새 값 뒤) |
|---|---|---|
| distractorsKo 전용 어간 | 기록 5 · 손을 5 · 기억 5 · 두 4 · 천천 4 | 손을 5 · 드릴 5 · 적을 5 · 기억 5 · 두 4 |
| 빈칸 오답 | alone 3 · long 3 · one 3 · blink 3 · quick 3 | later 3 · twice 3 · family 3 · results 3 · alone 3 |
| decoy 낱말 | that 5 · his 5 · you 5 · team 4 · visit 4 | that 5 · his 5 · you 5 · your 4 · it 4 |

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 146개 거의 모두 어순·완곡·공감의 이유를 말하고 ko를 되풀이하지 않음. 고칠 것 3(E): 7.0 통역사를 "설명 주체"라 함(사실 오류), 2.6 a few minutes를 "구체적"이라 함, 2.4 "약에 취한". |
| 2 빈칸 | **2** | **58문장 교체** — 정답 둘 40(장면에서 맞는 신호·관용구: `silly question`, `one day at a time`, `talk this over`, `aware of that`, `what I meant`, `what I said`, `if he refuses`, `what you need`, `see the interpreter`(영상), `test the microphone`…), 문법·동떨어짐 16(`Ask yesterday`, `comfortable last night`, `never for no`, `Take your pick pointing`, `a exercise`, `if you hear any pain`, `matches your age`, `rudely/randomly`, `doors/chairs`…), 시간 단위 돌려쓰기 2(2.6 6.6). 위험한 처치가 보이는 빈칸 0. |
| 3 decoy | 4 | 같은 자리의 구로 대체로 잘 씀. 자리 없음 4, 정답 둘 4, 낱말 몰림 4 — 12개 교체. 반대말·위험 조립 0. |
| 4 distractorsKo | **2** | **31문장 교체 — 안전 22 · 정답 둘 4 · 기타 5(말이 안 됨 1, 길이 2, 신호 짝 되풀이 2).** 통과 115문장은 대부분 말투·장소·사람·물건을 바꾼 해 없는 세부. 실패는 되묻기·teach-back·시연·통역 단계를 다른 일로 바꾼 틀(0.5 4.5 7.1 12.1 12.4 14.5 18.2)과 기준·간격 바꾸기(2.6 3.1 6.6 12.2 12.6 17.1 18.1 18.4)에 몰림. |
| 5 order | 3 | 21장 중 **12장 고칠 것** — 인접 두 줄이 서로 기대지 않아 교환해도 자연스러움 10(S0 S8 S9 S11 S14 S15 S16 S17 S18 S20), 표현·논리 2(S2 L3 "After that wait, know that you're safe"·안심을 기다림 뒤로 미룸, S7 L4 "Only after you've told me, take all the time" — 생각할 시간을 teach-back 뒤로 묶음). ko 머리말은 모두 카드와 맞고 15단어 초과 없음. 임상 순서 오류 없음. |
| 6 tag·icon | 5 | 태그 10자 이하·상황 안 일관(되말하기 요청 4·곁 약속 4·통역 약속 3). 아이콘 1개만 어긋남(3.5 통증 양상 `pill`). |
| 8 파일럿 갈래 | 3 | 갈래 2(동떨어진 빈칸) 18, 갈래 3(order) 12장, 갈래 5(오답·decoy 뜻 겹침) 정답 둘 48. "오답으로 위험한 처치 보이기" — distractorsKo에서 18.1 거짓 원칙(능력은 나이·기분에 달림), 17.1 X2 가족 뜻 기준, 3.1 X1 척도 끝점 5. |

## 사실 오류·심각한 문제
1. **teach-back·되묻기·시연을 다른 일로 바꾼 오답(실패, 안전).** 0.5 "다시 물어보세요"→"다시 읽어/들어보세요"(되묻기 빠짐), 4.5 X1 "제 말 그대로"(teach-back을 따라 말하기로 — 이해 확인이 안 됨), 7.1 "모아 두세요/하나만"(결정 전 질문 막음), 12.1 X1 "보관할지"(용량 시연 빠짐), 12.4 X1 "읽어봐요"(재는 연습 빠짐), 14.5 X2 "사과드릴게요"(정정 없음), 18.2 X2 "다시 고를 수"(설명 되말하기 빠짐).
2. **기준 바꾸기.** 3.1 X1 "5는 가장 심한 통증"(0~5 척도로 알려 주면 통증을 반으로 기록), 12.6 "약이 떨어지면/비용이 걱정되면 전화"(증상 때 전화 기준이 사라짐), 12.2 X2 "어떻게 전화할지"(언제=기준이 빠짐), 17.1 X2 "가족이 원하는 것을 기준으로"(대리 판단 원칙을 뒤집음), 18.1 "능력은 나이/기분에 달려 있어요"(거짓 임상 원칙 — 나이로 능력을 깎으면 환자 결정권 침해), 2.6·6.6 1분·10분(간격), 18.4 X2 "매일"(근거 없는 간격).
3. **빠뜨린 확인.** 5.3 "지금은 서명만/연락처만 필요해요"(이 장면의 기본 = 약·알레르기 — 그대로 하면 알레르기를 안 물음; 서명은 통역 없는 동의 문제도), 2.5 통증 알림 → 음악·조명 요청(진정 환자 통증 사정이 사라짐), 0.0 X2 "그분께 통역사를"(`공식`이 빠져 비공식 통역을 허용하는 말로 읽힘).
4. **위기 문장 옆 일.** 15.4 호흡 곤란 중 "함께 숨쉬어 보세요" → "세어 보세요/손을 들어 보세요".
5. **ko·en·임상(F로 보고, A·사용자 판단).** (a) **깜빡임 약속이 상황마다 반대** — S1(1.2) "예 두 번·아니오 한 번", S6(6.0·6.5·order) "예 한 번·아니오 두 번". 같은 주제에서 신호 체계가 뒤집혀 학습자가 혼동함 → 한쪽으로 통일 권장(S6 쪽이 흔함: 1.2를 `Blink once for yes, twice for no`). (b) 7.0 en `The interpreter will explain the procedure fully` — 동의 설명은 의료진이 하고 통역사는 옮김(통역사가 시술을 설명하면 동의 절차가 틀어짐). 예: `The interpreter will interpret everything the doctor explains.` (c) 0.1 en·ko `I'll speak to your mother directly`/"제가 어머님께 직접 전할게요" — 간호사 말이 아니라 통역사 말처럼 읽힘(why는 간호사가 환자에게 직접 말한다고 풀이). (d) 6.6 chunks `We'll keep checking / in every / few minutes` — 구동사 `checking in`이 끊김(A 몫, 보고만). (e) 1.5·19.3 "이해되시면 손을 쥐어 주세요" — 쥐기는 반사로도 나와 "쥐었다 놓기"로 확인하는 게 정석(사실 보충, 고칠 것 아님).

## 저작자가 판정을 부탁한 곳
| 곳 | 판정 | 새 값 |
|---|---|---|
| 0.0 호출(공식 통역사) — X1 "두 분" · X2 "그분께" | X1 **통과**(부를 대상은 그대로, 인원 숫자만, en `a`로 갈림, 해 없음). X2 **실패** — `공식`이 빠져 비공식 통역을 허용하는 말로 읽히고 "그분께"는 en에 없음. 또 둘 다 정답보다 김 | X2 `제가 바로 영상 통역사를 불러드릴게요`(전문 통역의 다른 방식 — 대상 유지, 길이 같음) |
| 9.5 호출 — X1 "두 분" · X2 "소개할게요" | **둘 다 통과** — 대상 그대로, "소개"는 부른 뒤 단계 | — |
| 2.5 통증 알림 → 음악·조명 요청 | **실패(빠뜨린 확인)** — 진정 환자에게 통증을 알리라는 말이 사라짐; `원하` 어간도 되풀이 | `통증이 느껴지면 진통제를 드릴게요` / `통증이 있으면 약이 있어요`(알린 뒤 단계) |
| 2.6 몇 분 → 1분·10분, 6.6 몇 분마다 → 1분마다 | **실패(간격)** — 10분은 "몇 분" 범위라 정답 둘, 1분은 간격을 바꿈. 6.6 X2 "소통판을 확인"은 확인 대상 바꾸기 | 2.6 `몇 분 뒤에 다시 불 끄러 올게요` / `몇 분 뒤에 다시 자세를 바꾸러 올게요`(간격 유지, 함께 하는 옆 일); 6.6 `몇 분마다 확인하는 건 안전 때문이에요` / `몇 분마다 오니 신호만 주세요` |
| 신호 동작 교체 1.2·3.6·4.2·6.0~6.3·6.5 | **ko 오답은 통과**(들리는 낱말, 뜻 다름, 해 없음 — 위 기준). 단 쥐기/끄덕임 짝 4회 되풀이라 6.0·6.1 X2만 다른 틀로. **빈칸은 정답 둘**(3.6 Blink·Squeeze, 4.2 Blink·Wave, 6.0 nod·squeeze·tap) → 옮김(B) | 6.0 X2 `예는 한 번, 아니오는 세 번 깜빡이기로 정해요`; 6.1 X2 `아프세요? 그렇다면 진통제를 드릴게요` |
| 5.0 알려 주기 → 적기·보여주기 | **통과** — 약·알레르기를 받는 일은 그대로(방식만), en `tell` 들림, 해 없음(약병을 보여 주는 것은 오히려 정확). `적어` 어간 4회라 더 늘리지 말 것 | — |
| 18.1 능력 = 나이·기분 | **실패(안전)** — 거짓 임상 원칙을 듣고 외움. 나이로 능력을 판단하면 환자 결정권 침해. 같은 틀의 참인 사실로 | `의사결정 능력은 결정마다 따로 평가해야 해요` / `의사결정 능력은 하루 중에도 달라질 수 있어요` |
| 17.1 X2 가족 뜻 기준 (X1 "말했을 것") | X2 **실패(기준 바꾸기)** — 대리 판단 원칙을 뒤집음. X1도 **실패(정답 둘)** — "그가 말했을 것"은 대리 판단과 같은 뜻 | `그가 원했을 것을 서류로 확인해봐요`(사전의향서 — 앞 단계) / `그가 원했을 것을 함께 떠올려봐요`(앞 단계) |
| order 8번 2·3줄 | **실패(교환 가능)** — L3 `With that`이 L1의 답을 가리켜 L2 앞에 와도 성립 | 아래 D의 S8 |

## 고칠 것

### A. distractorsKo (31문장 — 안전 22 · 정답 둘 4 · 기타 5). `—`는 그대로 둠

| 곳 | 정답 ko | 지금 X1 / X2 | 이유 | 새 X1 / 새 X2 |
|---|---|---|---|---|
| 0.0 | 제가 바로 공식 통역사를 불러드릴게요. | 제가 바로 공식 통역사 두 분을 불러드릴게요. / 제가 바로 그분께 통역사를 불러드릴게요. | 안전(X2 `공식` 빠짐)+길이(둘 다 김) | — / `제가 바로 영상 통역사를 불러드릴게요` |
| 0.5 | 이해 안 되는 부분 있으면 다시 물어보세요. | 이해 안 되는 부분 있으면 다시 읽어보세요. / 이해 안 되는 부분 있으면 다시 들어보세요. | 안전 — 되묻기를 다시 읽기·듣기로 바꿈(둘 다) | `불편한 부분 있으면 다시 물어보세요` / `너무 빠른 부분 있으면 다시 물어보세요` |
| 2.0 | 제 말이 들리면 제 손을 꼭 쥐어보실래요? | 제 말이 들리면 제 팔을 꼭 쥐어보실래요? / 제 말이 보이면 제 손을 꼭 쥐어보실래요? | X2 "제 말이 보이면" 말이 안 됨(듣지 않고 걸러짐) | — / `제 얼굴이 보이면 제 손을 꼭 쥐어보실래요` |
| 2.4 | 안전하니 지금은 그냥 쉬세요. | 안전하니 지금은 그냥 들으세요. / 여기 있으니 지금은 그냥 쉬세요. | 길이 — 둘 다 정답보다 김 | `안전하니 지금은 그냥 자세요` / — |
| 2.5 | 통증이 느껴지면 알려주세요. | 음악을 원하시면 알려주세요. / 불을 줄이길 원하시면 알려주세요. | 안전 — 통증 알림이 음악·조명 요청으로(빠뜨린 확인) | `통증이 느껴지면 진통제를 드릴게요` / `통증이 있으면 약이 있어요` |
| 2.6 | 몇 분 뒤에 다시 살펴보러 올게요. | 1분 뒤에 다시 살펴보러 올게요. / 10분 뒤에 다시 살펴보러 올게요. | 안전 — 간격 1·10분(10분은 정답 둘) | `몇 분 뒤에 다시 불 끄러 올게요` / `몇 분 뒤에 다시 자세를 바꾸러 올게요` |
| 3.1 | 0은 안 아픈 거고, 10은 가장 심한 통증이에요. | 0은 안 아픈 거고, 5는 가장 심한 통증이에요. / 0은 안 아픈 거고, 10은 가장 오래된 통증이에요. | 안전 — X1 척도 끝점 5(기준), X2 "가장 오래된" 말이 안 됨 | `0은 안 아픈 거고, 5는 중간 정도 통증이에요` / `0은 안 아픈 거고, 7은 꽤 심한 통증이에요` |
| 4.5 | 제가 한 말을 당신의 말로 다시 말해보세요. | 제가 한 말을 제 말 그대로 다시 말해보세요. / 제가 한 말을 당신의 말로 크게 말해보세요. | 안전 — X1 teach-back을 따라 말하기로 | `제가 쓴 글을 당신의 말로 다시 말해보세요` / — |
| 4.6 | 제가 너무 빠르면 언제든 멈춰 세워주세요. | 제가 너무 빠르면 한 번만 멈춰 세워주세요. / 제가 너무 작게 말하면 언제든 멈춰 세워주세요. | 길이 — 둘 다 김; X1 "한 번만"은 끼어들기를 제한 | `제가 너무 길면 언제든 멈춰 세워주세요` / — |
| 5.3 | 지금은 기본적인 것만 필요해요. | 지금은 서명만 필요해요. / 지금은 연락처만 필요해요. | 안전 — 서명만·연락처만(약·알레르기 빠뜨림, 통역 없는 서명) | `지금은 기본적인 것만 적을게요` / `나중에는 세부사항도 필요해요` |
| 6.0 | 예는 한 번, 아니오는 두 번 깜빡이기로 정해요. | 예는 한 번, 아니오는 두 번 쥐기로 정해요. / 예는 한 번, 아니오는 두 번 끄덕이기로 정해요. | 되풀이 — 쥐기/끄덕임 짝 4회 | — / `예는 한 번, 아니오는 세 번 깜빡이기로 정해요` |
| 6.1 | 아프세요? 그렇다면 한 번 깜빡이세요. | 아프세요? 그렇다면 한 번 쥐어주세요. / 아프세요? 그렇다면 한 번 끄덕이세요. | 되풀이 — 쥐기/끄덕임 짝 4회 | — / `아프세요? 그렇다면 진통제를 드릴게요` |
| 6.4 | 예, 아니오로 답할 질문만 드릴게요. | 한 번에 답할 질문만 드릴게요. / 그림으로 답할 질문만 드릴게요. | 정답 둘 — X1 "한 번에 답할 질문" = 예·아니오 질문 | `숫자로 답할 질문만 드릴게요` / — |
| 6.6 | 몇 분마다 계속 상태를 확인할게요. | 1분마다 계속 상태를 확인할게요. / 몇 분마다 계속 소통판을 확인할게요. | 안전 — X1 간격 1분, X2 확인 대상을 소통판으로 | `몇 분마다 확인하는 건 안전 때문이에요` / `몇 분마다 오니 신호만 주세요` |
| 7.0 | 통역사가 시술을 완전히 설명해 드릴 거예요. | 통역사가 시술을 천천히 설명해 드릴 거예요. / 통역사가 비용을 완전히 설명해 드릴 거예요. | 안전 — X2 동의 설명을 비용 설명으로(대신 하는 일) | — / `통역사가 회복을 완전히 설명해 드릴 거예요` |
| 7.1 | 결정하기 전에 궁금한 것은 뭐든 물어보세요. | 결정하기 전에 궁금한 것은 뭐든 모아 두세요. / 결정하기 전에 궁금한 것은 하나만 물어보세요. | 안전 — 결정 전 질문을 모아 두기·하나만으로(둘 다 김) | `결정한 뒤에도 궁금한 것은 뭐든 물어보세요` / `결정하기 전에 가족과 뭐든 의논해 보세요` |
| 10.1 | 잘 들리는 쪽에서 그를 보고 또렷하게 말할게요. | 잘 들리는 쪽에서 그를 보고 크게 말할게요. / 잘 보이는 쪽에서 그를 보고 또렷하게 말할게요. | 정답 둘 — X2 en `better side`는 들림·보임을 가르지 않음(③) | — / `잘 들리는 쪽에서 그를 보고 짧게 말할게요` |
| 12.1 | 이 용량을 어떻게 줄지 보여주세요. | 이 약을 어떻게 보관할지 보여주세요. / 이 용량을 언제 줄지 보여주세요. | 안전 — X1 용량 시연을 보관법으로 | `이 용량을 어떻게 잴지 보여주세요` / — |
| 12.2 | 언제 의사에게 전화할지 다시 말해보세요. | 언제 의사에게 전화할지 다시 적어보세요. / 어떻게 의사에게 전화할지 다시 말해보세요. | 안전 — X2 언제(기준)를 어떻게로 | — / `언제 의사에게 전화할지 통역사께 말해보세요` |
| 12.4 | 용량 재는 것을 함께 연습해봐요. | 용량 재는 것을 함께 읽어봐요. / 약 먹는 것을 함께 연습해봐요. | 안전 — X1 재는 연습을 읽기로 | `용량 재는 것을 집에서 연습해봐요` / — |
| 12.6 | 뭔가 이상하면 이 번호로 전화하세요. | 약이 떨어지면 이 번호로 전화하세요. / 비용이 걱정되면 이 번호로 전화하세요. | 안전 — 전화 기준을 약 소진·비용으로(둘 다) | `이 번호는 밤에도 간호사가 받아요` / `전화하실 때 환자 이름을 먼저 말하세요` |
| 14.0 | 우리 둘 다 같은 이해를 하고 있는지 확실히 해봐요. | 우리 가족 모두 같은 이해를 하고 있는지 확실히 해봐요. / 우리 둘 다 같은 이해를 하고 있는지 기록해봐요. | 안전(약) — X2 확인을 기록으로; `기록` 어간 5회 | — / `우리 둘 다 같은 목표를 갖고 있는지 확실히 해봐요` |
| 14.2 | 혼란이 없게 그 부분을 명확히 할게요. | 혼란이 없게 그 부분을 기록할게요. / 혼란이 없게 그 부분을 줄일게요. | 안전(약) — X1 명확히 하기를 기록으로; `기록` 어간 | `혼란이 없게 그 부분을 한 번 더 들려드릴게요` / — |
| 14.5 | 제가 말하려던 건 그게 아니었어요, 바로잡을게요. | 제가 말하려던 건 그게 아니었어요, 다시 적을게요. / 제가 말하려던 건 그게 아니었어요, 사과드릴게요. | 안전 — X2 정정 대신 사과 | — / `제가 말하려던 건 그게 아니었어요, 써 볼게요` |
| 15.2 | 그녀를 안전하게 지키기 위해 할 수 있는 모든 걸 하고 있어요. | 그녀를 편안하게 하기 위해 할 수 있는 모든 걸 하고 있어요. / 그녀를 안전하게 지키기 위해 할 수 있는 모든 걸 밤새 하고 있어요. | 정답 둘 — X2 정답에 "밤새"를 덧붙임 | — / `그녀를 안전하게 지키기 위해 몇 가지를 하고 있어요` |
| 15.4 | 저와 함께 숨쉬어 보세요, 이렇게요. | 저와 함께 세어 보세요, 이렇게요. / 저와 함께 손을 들어 보세요, 이렇게요. | 안전 — 위기 호흡 코칭을 세기·손 들기로 | `저와 함께 숨쉬면 숨이 편해져요` / `제 손을 보면서 숨쉬어 보세요, 이렇게요` |
| 16.4 | 지금 어떤 기분이 들든 괜찮아요. | 지금 화가 나셔도 괜찮아요. / 지금 말이 없어도 괜찮아요. | 정답 둘 — 화나도·말이 없어도 괜찮다는 정답의 일부 | `지금 어떤 말을 하셔도 괜찮아요` / `내일 어떤 기분이 들든 괜찮아요` |
| 17.1 | 그가 원했을 것을 기준으로 결정해봐요. | 그가 말했을 것을 기준으로 결정해봐요. / 가족이 원하는 것을 기준으로 결정해봐요. | 안전 — X2 가족 뜻 기준, X1 "말했을 것" 정답 둘 | `그가 원했을 것을 서류로 확인해봐요` / `그가 원했을 것을 함께 떠올려봐요` |
| 18.1 | 의사결정 능력은 언어가 아니라 이해에 달려 있어요. | 의사결정 능력은 언어가 아니라 나이에 달려 있어요. / 의사결정 능력은 언어가 아니라 기분에 달려 있어요. | 안전 — 거짓 임상 원칙(나이·기분) | `의사결정 능력은 결정마다 따로 평가해야 해요` / `의사결정 능력은 하루 중에도 달라질 수 있어요` |
| 18.2 | 그가 그 선택을 저희에게 다시 설명할 수 있는지 봐요. | 그가 그 선택을 저희에게 다시 적을 수 있는지 봐요. / 그가 그 선택을 저희에게 다시 고를 수 있는지 봐요. | 안전 — X2 설명 되말하기를 다시 고르기로 | — / `그가 그 선택을 통역사에게 다시 설명할 수 있는지 봐요` |
| 18.4 | 한 번만이 아니라 신중하게 확인할게요. | 한 번만이 아니라 따로 확인할게요. / 한 번만이 아니라 매일 확인할게요. | 안전(약) — X2 근거 없는 간격 "매일" | — / `한 번만이 아니라 통역사와 확인할게요` |

### B. 빈칸 새 값(답 / 오답 셋)

- 0.0 `right away`: next week·last month·every day → 답 `right away`, 오답 next week·tomorrow·every day
- 0.1 `naturally`: angrily·secretly·rudely → 답 `naturally`, 오답 in English·faster·for her
- 0.2 `nothing`: something·everything·someone → 답 `lost`, 오답 recorded·repeated·printed
- 0.3 `interpreters`: doctors·nurses·pharmacists → 답 `family members`, 오답 phone lines·video screens·certified staff
- 0.5 `again`: tomorrow·yesterday·next year → 답 `again`, 오답 later·quietly·first
- 1.2 `once`: never·rarely·seldom → 답 `once`, 오답 twice·three times·four times
- 1.4 `time`: chance·break·pick → 답 `pointing`, 오답 talking·listening·waving
- 1.6 `signal`: doctor·exercise·schedule → 답 `signal`, 오답 word·voice·schedule
- 2.0 `hear`: smell·taste·feel → 답 `hear`, 오답 see·know·trust
- 2.1 `right now`: last night·next year·tomorrow morning → 답 `right now`, 오답 at night·at home·at work
- 2.3 `moment`: week·month·year → 답 `response`, 오답 family·doctor·results
- 2.4 `safe`: alone·sick·lost → 답 `safe`, 오답 alone·lost·late
- 2.5 `feel`: hear·smell·taste → 답 `feel`, 오답 cause·expect·remember
- 2.6 `minutes`: days·weeks·months → 답 `minutes`, 오답 hours·shifts·visits
- 3.3 `pain`: name·age·size → 답 `pain`, 오답 mood·meal·breathing
- 3.5 `sharp`: heavy·tight·burning → 답 `pain`, 오답 light·sound·picture
- 3.6 `Nod`: Blink·Squeeze·Wave → 답 `where`, 오답 when·why·how
- 4.2 `Nod`: Wave·Blink·Clap → 답 `Nod`, 오답 Wait·Leave·Sit
- 4.3 `slowly`: casually·carelessly·angrily → 답 `slowly`, 오답 politely·formally·technically
- 4.4 `see`: hear·touch·hold → 답 `see`, 오답 sign·hear·answer
- 4.5 `said`: meant·asked·wrote → 답 `said`, 오답 asked·sang·ordered
- 5.5 `translating`: remembering·writing·carrying → 답 `translating`, 오답 signing·carrying·cleaning
- 6.0 `blink`: nod·squeeze·tap → 답 `agree`, 오답 wait·guess·vote
- 6.4 `yes or no`: short·simple·hard → 답 `yes or no`, 오답 open·tricky·hard
- 6.6 `minutes`: hours·seconds·nights → 답 `checking`, 오답 calling·signing·logging
- 7.3 `think`: rest·talk·pray → 답 `think`, 오답 sign·hand·pass
- 7.5 `wrong`: small·silly·odd → 답 `wrong`, 오답 easy·new·big
- 8.0 `respectful`: careful·aware·afraid → 답 `respectful`, 오답 afraid·tired·critical
- 8.3 `comfortable`: expensive·dangerous·impossible → 답 `comfortable`, 오답 technical·costly·noisy
- 8.4 `words`: gestures·colors·gifts → 답 `words`, 오답 machines·pens·gifts
- 8.6 `wrong`: rude·careless·blunt → 답 `wrong`, 오답 kind·polite·helpful
- 9.3 `fair`: easy·safe·polite → 답 `fair`, 오답 legal·cheap·normal
- 10.1 `clearly`: softly·rudely·randomly → 답 `clearly`, 오답 softly·briefly·firmly
- 10.3 `lips`: braille·maps·menus → 답 `lips`, 오답 maps·menus·music
- 11.1 `matters`: scares·hurts·changes → 답 `matters`, 오답 happens·occurs·applies
- 11.4 `answers`: rules·doors·chairs → 답 `answers`, 오답 rules·results·doctors
- 11.6 `step`: day·word·question → 답 `step`, 오답 pill·room·shift
- 12.2 `back`: later·first·again → 답 `back`, 오답 later·first·quietly
- 12.3 `pictures`: prices·colors·stamps → 답 `pictures`, 오답 prices·stamps·coupons
- 12.5 `missed`: doubled·dropped·spilled → 답 `missed`, 오답 ordered·priced·labeled
- 12.6 `wrong`: empty·cold·heavy → 답 `wrong`, 오답 familiar·clean·quiet
- 13.1 `position`: clean·lock·cover → 답 `position`, 오답 mute·lock·cover
- 13.3 `hear`: see·touch·feel → 답 `hear`, 오답 touch·thank·pay
- 13.5 `connection`: microphone·brightness·projector → 답 `connection`, 오답 printer·projector·pager
- 14.3 `poorly`: quickly·fully·proudly → 답 `poorly`, 오답 fully·proudly·correctly
- 14.5 `meant`: said·wrote·asked → 답 `meant`, 오답 wrote·asked·bought
- 14.6 `confused`: angry·tired·upset → 답 `confused`, 오답 hungry·cold·busy
- 15.3 `Stay`: Sit·Look·Wait → 답 `Stay`, 오답 Look·Hide·Sleep
- 15.4 `breathe`: count·blink·sing → 답 `breathe`, 오답 blink·sing·eat
- 15.6 `know`: learn·decide·finish → 답 `know`, 오답 leave·decide·finish
- 16.2 `time`: space·rest·peace → 답 `time`, 오답 notes·photos·forms
- 16.6 `small`: late·odd·silly → 답 `small`, 오답 late·rich·old
- 18.5 `agrees`: refuses·waits·leaves → 답 `agrees`, 오답 smiles·sleeps·travels
- 19.1 `feel`: need·see·mean → 답 `feel`, 오답 see·bought·drew
- 19.2 `staying`: sitting·working·charting → 답 `staying`, 오답 working·charting·eating
- 20.3 `concerns`: helps·pleases·bores → 답 `concerns`, 오답 pleases·bores·amuses
- 20.5 `agree`: decide·build·count → 답 `agree`, 오답 bet·pay·sit
- 20.6 `change`: share·prove·hide → 답 `asking`, 오답 allowing·paying·hiring

### C. decoy 새 값

- 0.2 «everything gets repeated» → «the forms get signed»
- 2.2 «your hand» → «Open your hand»
- 3.2 «on this card» → «on the menu»
- 4.5 «what I wrote» → «wrote»
- 8.3 «for the team» → «for the chart»
- 9.4 «the hospital rules» → «knows the hospital rules»
- 11.6 «one day» → «one room»
- 12.3 «each visit» → «each meal»
- 13.3 «hear the speaker» → «hear the doctor»
- 17.2 «visit together» → «treatment together»
- 18.2 «to the team» → «to the nurse»
- 19.0 «video interpreter» → «the video interpreter»

빈칸 이유 갈래(위 58개): **정답 둘 40** — 0.3(친구·의사도 안 씀: 참) 2.4 sick 3.5 heavy/tight/burning 3.6·4.2·6.0 다른 신호 4.4 hold 4.5 meant 5.5 remembering 6.4 short/simple 7.3 talk 7.5 silly/small 8.0 aware/careful 8.4 gestures 8.6 rude/blunt 9.3 easy/polite 10.3 braille 11.1 scares 11.6 day/question 12.2 again 12.3 colors 12.5 doubled/dropped/spilled 12.6 heavy 13.1 clean 13.3 see(영상) 13.5 microphone 14.3 quickly 14.5 said 14.6 upset 15.3 Wait/Sit 15.4 count 15.6 learn 16.2 space 16.6 silly/odd 18.5 refuses 19.1 need 19.2 sitting 20.3 helps 20.5 decide 20.6(부정문이라 hide·prove·share도 참);
**문법·동떨어짐 16** — 0.0 last month 0.1 angrily/secretly 0.2 something/everything 0.5 yesterday/next year 1.2 never/rarely 1.4 pick/break 1.6 doctor·`a exercise` 2.0 smell/taste 2.1 last night/next year 2.3 week/month/year 2.5 hear/smell any pain 3.3 age/size 4.3 carelessly/angrily 8.3 expensive/dangerous 10.1 rudely/randomly 11.4 doors/chairs; **시간 단위 돌려쓰기 2** — 2.6 6.6(6.6은 빈칸을 `checking`으로 옮김).
빈칸을 옮긴 문장: 0.2 `lost` · 0.3 `family members` · 1.4 `pointing` · 2.3 `response` · 3.3·3.5 `pain` · 3.6 `where` · 6.0 `agree` · 6.6 `checking` · 20.6 `asking`(나머지는 답 그대로, 오답만 교체).

decoy 이유: 0.2 `everything gets repeated` = 다 옮긴다(정답 둘) · 2.2 `your hand`는 `Open your eyes` 자리에 동사가 없어 안 맞음 · 3.2 `on this card` = 통증 위치 카드에 가리키기(정답 둘) · 4.5 `what I wrote`는 `what I`/`said` 어느 자리에도 안 맞음 · 9.4 `the hospital rules`는 `knows the medical words` 자리에 동사가 없음 · 11.6 `one day` = one day at a time(관용구, 정답 둘) · 13.3 `hear the speaker`(영상 기기의 스피커 = 통역사 목소리, 정답 둘) · 19.0 `video interpreter` 관사 없음 · 8.3·18.2(`team` 4회)·12.3·17.2(`visit` 4회) 낱말 몰림.

### D. order (12장)
| 카드 | 문제 | 새 줄 (en · ko · note) |
|---|---|---|
| S0 | L2·L3이 둘 다 L1의 통역사만 가리켜 교환 가능 | L2 `Once that person is on the line, I'll explain everything step by step.` · 그분이 연결되면 차근차근 설명해 드릴게요 · 설명 / L3 `While I explain, please speak naturally and stop me anytime.` · 제가 설명하는 동안 편하게 말씀하시고 언제든 멈춰 주세요 · 방식 안내 / L4 그대로. why: 통역사를 부르고, 연결되면 설명을 시작하고, 설명하는 동안 편하게 끼어들게 한 뒤, 마지막에 되묻기를 열어 둬요. |
| S2 | L3 `After that wait, know that you're safe here.` — 어색한 영어, 안심을 기다림 뒤로 미룸(시간 묶기) | L3 `However long that takes, you're safe here — just rest.` · 얼마나 걸리든 여기선 안전해요, 그냥 쉬세요 · 안심 / L4 `While you rest, I'll check on you again in a few minutes.` · 쉬시는 동안 몇 분 뒤에 다시 올게요 · 재방문. why: 반응을 묻고 기다리되, 얼마나 걸리든 안전하다고 안심시키고, 쉬는 동안 다시 올 것을 약속해요. |
| S7 | L4 `Only after you've told me, take all the time…` — 생각할 시간을 teach-back 뒤로 묶는 강요조 | L4 `With that clear, take all the time you need to think it over.` · 그게 분명해졌으니 필요한 만큼 시간을 가지고 생각해 보세요 · 시간 주기 |
| S8 (저작자 질문) | L3 `With that`이 L1의 답을 가리켜 L2 앞에 와도 성립 | L1 `Are there words you'd rather I not use?` · 제가 쓰지 않았으면 하는 말이 있나요 · 금기 질문(icon bell) / L2 `Thank you for telling me which ones.` · 어떤 말인지 알려 주셔서 감사해요 · 감사 / L3 `I'll avoid those and speak in a way that's comfortable for you.` · 그 말은 피하고 편안한 방식으로 말씀드릴게요 · 맞춤 약속 / L4 그대로. why: 피할 말을 묻고, 알려 준 데 감사하고, 그 말을 피해 편하게 말하겠다고 약속한 뒤, 틀리면 고쳐 달라고 부탁해요. |
| S9 | L1·L2 교환해도 자연스러움(원칙 → 감사) | L2 `Still, for medical decisions, we use a trained interpreter for accuracy.` · 그래도 의료 결정에는 정확성을 위해 훈련된 통역사를 씁니다 · 원칙 |
| S11 | L3·L4 교환 가능(`Whatever comes up`이 L2에도 걸림) | L4 `Whatever matters to all of you, we'll take it one step at a time.` · 여러분 모두에게 무엇이 중요하든 한 단계씩 해요 · 단계 약속 |
| S14 | L2·L3 교환해도 자연스러움(사과 → 감사) | L3 `That confusion is on me — let me explain that part again.` · 그 혼란은 제 탓이에요, 그 부분을 다시 설명할게요 · 다시 설명 |
| S15 | L1·L2 교환해도 자연스러움(둘 다 홀로 섬) | L2 `To ease that, we're doing everything we can.` · 그걸 덜어 드리려고 할 수 있는 모든 걸 하고 있어요 · 안전 약속 |
| S16 | L1·L2 교환해도 자연스러움 | L1 `I'm so sorry to share difficult news.` · 힘든 소식을 전하게 되어 정말 죄송해요 · 사과 / L2 `The interpreter will convey it gently and completely.` · 통역사가 그 소식을 부드럽고 완전하게 전할 거예요 · 통역 약속 / L3 `As they interpret, I'll pause often so you have time to take it in.` · 통역하는 동안 자주 멈춰 받아들이실 시간을 드릴게요 · 속도 약속 / L4 `Once you've taken it in, please ask me anything, no matter how small.` · 받아들이신 뒤 사소해도 뭐든 물어보세요 · 질문 장려. why: 미안함을 먼저 말하고, 통역사가 그 소식을 온전히 전한다고 알리고, 통역하는 동안 멈춰 시간을 준 뒤 질문을 열어요. |
| S17 | L1·L2 교환 가능(질문이 통역 약속을 기대지 않음) | L2 `Through them, tell me: what mattered most to him in his life?` · 통역사를 통해 말씀해 주세요, 그의 삶에서 가장 중요했던 건 무엇이었나요 · 삶 질문 |
| S18 | L2·L3 교환 가능(`Next`가 L1 뒤에도 성립) | L3 `Beyond the choice itself, can he tell us what happens if he agrees?` · 선택 자체를 넘어, 동의하면 어떻게 되는지 말할 수 있나요 · 결과 이해 |
| S20 | L4 `Either way`에 가리킬 두 갈래가 없고 L3·L4 교환 가능 | L4 `Whatever we find, we're not asking you to change your beliefs.` · 무엇을 찾든 신념을 바꾸라는 게 아니에요 · 신념 존중. why 끝: "…찾자고 하고, 무엇을 찾든 신념을 바꾸라는 게 아님을 확인해요." |

통과로 둔 것: S1 S3 S4(L3·L4 교환이 어색하게나마 되지만 teach-back이 재설명 뒤라는 흐름이 더 자연스러워 둠) S5 S6 S10 S12 S13 S19. `If`로 시작하는 줄(S4 L3, S8 L4)은 모든 환자에게 할 일을 조건으로 묶지 않음 — 통과.

### E. why · icon (4)
- 7.0 why — "설명 주체를 통역사로 분명히 해요"는 사실 오류(동의 설명은 의료진, 통역사는 옮김). → `fully를 붙이면 설명이 일부가 아니라 빠짐없이 전해진다는 약속이 돼요. 설명은 의료진이 하고 통역사는 그 말을 옮겨요.` (en 자체도 F-(b))
- 2.6 why — "in a few minutes가 돌아올 시점을 구체적으로" → `in a few minutes가 곧 돌아온다는 대략의 시점을 알려 줘요.`
- 2.4 why — "약에 취한 환자" → `진정 중인 환자`.
- 3.5 icon `pill`(약) → `magnify`(통증 양상 사정; 같은 상황 3.2와 같음) 또는 `faceWorried`.

## 종합
고칠 것 **117건**(distractorsKo 31 · 빈칸 58 · decoy 12 · order 12 · why/icon 4) — 그중 **안전 22**(모두 distractorsKo), **정답 둘 48**(ko 4 · 빈칸 40 · decoy 4) + order 교환 가능 10장.
새 값을 넣은 사본은 검사기 통과. 위 A~E를 반영하면 내보내도 됩니다. F(깜빡임 약속 반대, 7.0 통역사 역할, 0.1 화자)는 A·사용자 판단이 필요합니다 — 특히 F-(a) 깜빡임 체계 통일은 1.2·6.0·6.5·order S6를 함께 봐야 합니다. F로 en·ko를 고치면 그 문장의 distractorsKo 둘(7.0·1.2 등)은 새 ko에 맞춰 다시 쓰세요 — 위 새 값은 지금 ko 기준입니다.
