# B 검토 — core-family-or (v46 1~6·8, distractorsKo ①~⑥·되풀이 상한)

대상: `core-family-or.yaml`(A·B 합친 파일). 문장 105개와 order 21장을 전부 봤습니다. 원본은 검사기를 통과했고 경고도 0입니다. 아래는 기계가 못 보는 것입니다.
- 뽑은 표: `_reviewB_core-family-or_table.txt` — 문장마다 en·ko·오답 둘(글자 수)·tag·icon·why·청크와 decoy·빈칸 네 줄, 상황마다 order 4줄과 인접 교환 3개.
- 스크립트: `_reviewB_core-family-or_dump.py`(표), `_reviewB_core-family-or_count.py`(W19 어간·첫 음절 묶음·표지·길이·decoy 모양과 낱말·빈칸 오답 빈도), `_reviewB_core-family-or_patch.py`(아래 새 값을 원본 사본에 얹음).
- **제안을 모두 넣은 사본: `/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/_reviewB_core-family-or_after.yaml`**
  - 그 사본의 표는 `_reviewB_core-family-or_after_table.txt`입니다.
  - 검사 결과는 맨 아래에 있습니다(위반 0·경고 0).
  - B 필드 밖(theme·words·nuance·문장 en/ko/chunks/words/goal) 차이 0을 스크립트로 확인했습니다.

## 판정 기준 (이 주제에 적용한 것)
이 주제는 처치가 아니라 **가족에게 하는 말**입니다. 그래서 안전 시험은 부르는 쪽이 정한 기준으로 봤습니다.
- **잘못된 안심**(결과·예후 약속).
- **정보 공유 대상 바꾸기:** 환자가 허락하지 않은 사람에게 알리는 것.
- **집도의 면담 연결을 다른 일로 바꾸기.**
- **연락처·대기 장소 확인 대상 바꾸기.**
- **감정 지지 문장을 무시·재촉으로 뒤집기.**
- 15~20번(나쁜 소식·사망·분노·위기)은 두 가지를 더 봤습니다.
  - 탓·사과로 읽히는 말.
  - 곁을 지키는 사람이나 연락 대상을 제3자로 바꾸는 말.

판정은 이렇게 나눴습니다.
- **통과:** 정답 행동의 앞·뒤 단계, 들리는 세부 하나(사람·장소·물건·때)를 바꾼 해 없는 정보문.
- **실패:** 그 순간 정답 행동 대신 하는 일.
- **정답 둘:** 같은 안심을 다른 말로 한 것(안정적 ↔ 편안·쉬고), 정답 행동을 품은 말(곁에서 듣기 = 곁에 있기).
- **뒤집기(⑤):** 들어가다↔나가다·나오다, 전↔후, 빠르게↔천천히.

## 부탁하신 판정
**1. 구체 세부가 없는 안심·애도 문장**
| 문장 | 판정 | 고칠 것 |
|---|---|---|
| **7.4** keep checking in … right away | 오답1 "바로바로 정리할게요"는 무엇을 정리하는지 없는 어색한 말이라 **약함**. 오답2 "조용히 알려드릴게요"는 right away가 들리는 자리라 **통과**(약하지만 해 없음). | 오답1 → "한 번 더 확인해서 바로바로 알려드릴게요"(keep이 들리는 자리) |
| **19.1** doing everything they can | 오답 둘(하나씩·몇 가지)은 everything 하나에만 걸려 약하지만, 들리는 자리이고 결과를 약속하지 않아 **통과**. | 오답 둘 다 정답보다 길어 오답2만 "지금 할 수 있는 몇 가지를 하고 있어요"로 줄임. 빈칸 something/nothing/little은 문법으로 걸러지고 15.2와 같은 묶음이라 바꿈(아래 B). |
| **15.1** managing it … stable | **실패 둘.** 오답1 "여러 팀에서"는 단수·복수만 다르고 영어에서 들리지 않음(③). 오답2 "지금은 쉬고 계세요"는 '안정적'과 같은 안심이라 정답 둘. | "팀에서 상의하고 있고, 지금은 안정적이세요"(managing이 들림) · "팀에서 대응하고 있고, 지금은 혈압이 낮으세요"(stable이 들림. 잘못된 안심이 아니라 덜 안심되는 쪽) |
| **10.0** doing well — stable | **실패 둘(정답 둘).** "편안해 보여요"·"지금 쉬고 있고"는 같은 안심이라 언어 장벽이 있는 가족에게는 뜻이 같음. | "아드님은 잘 지내고 있고, 지금 회복실에 있어요" · "따님은 잘 지내고 있고, 안정적이에요"(son이 들림) |
| **17.0** sorry for your loss | 고정 애도 문구라 바꿀 수 있는 자리가 '애도' 한 낱말뿐. 사과(탓으로 읽힘)·축소(무시)는 금지라 남는 것이 없음. 존경·배려는 장면에 안 맞아 약하지만 안전 → **통과, 그대로**. | decoy `for the delay`만 바꿈 — 조립하면 "늦어져서 죄송하다"는 사과가 되어 사망 장면에서 지연 탓으로 읽힘. 새 값 `for my`(I'm so deeply sorry for my loss — ko와 다름) |

**2. 연락처·대기 장소**
| 문장 | 판정 | 고칠 것 |
|---|---|---|
| **5.0** 문자드릴게요 | 연락 수단만 바뀌고 연락 대상·번호는 그대로, call이 들리는 자리 → **통과**. 안내문 쪽도 통과. | 없음 |
| **5.2** stay reachable | 오답1 "가까이 계셔주세요"는 '어디서든 연락 닿게'를 '가까이 있기'로 바꾼 대기 장소 지시라 **실패**(뜻도 근접). 오답2만 '계셔 주세요'로 띄어 써 모양 단서가 됨. | "질문이 있을 경우를 대비해 연락 가능하게 계셔주세요"(news가 들림) · "회진 시간을 대비해 연락 가능하게 계셔주세요"(띄어쓰기 맞춤) |
| **5.3** let the desk know where you'll be | **실패 둘.** "짐을 맡겨만"은 위치 알림을 빼서 연락이 안 닿음. "언제 오실지"는 확인 대상이 어디→언제로 바뀜. | "자리를 비우시면 데스크에서 호출기를 받아 가세요"(연락이 닿는 다른 길, 해 없음) · "주차하러 나가시면 데스크에 어디 계실지 알려만 주세요"(step out이 들리는 조건만 바꿈, 알림은 그대로) |
| **5.4** page you the moment anything changes | 오답 둘(점심 도착·교대)은 호출 행동은 그대로 두고 조건만 바꿈 → **통과**. | decoy `when it's quiet`만 바꿈 — 조립하면 "조용할 때 호출"로 알림을 늦춤. 새 값 `We'll call the unit` |

**3. 감정 지지 8.x·16.x·17.x·20.x**
| 문장 | 판정 | 새 값 |
|---|---|---|
| **8.2 오답1** "걱정 마세요" | 감정 축소 — 무시 쪽이라 **실패**. | "혼자가 아니에요, 제가 여기 자주 들를게요" |
| **8.2 오답2** "함께 들을게요" | 곁에 있기를 품고 어색함 — **정답 둘**. | "많이 힘드시죠, 제가 여기 함께 있을게요" |
| **8.0·8.1·8.3·8.4** | **통과**. | — |
| **16.4** 곁에서 들을게요·도울게요 | 둘 다 '곁에 있기'를 품어 **정답 둘**. | "계속 바로 뒤에 있을게요" · "계속 바로 문 앞에 있을게요" |
| **16.0~16.3** | **통과**(물·휴지 권하기는 재촉이 아님). | — |
| **17.1 오답2** "이야기를 들을게요" | 곁에 있기를 품음 — **정답 둘**. | "제가 문 밖에 있을게요"(제3자로 바꾸지 않고 자리만) |
| **17.2 오답2** "다음 일정을" | 다음 절차와 뜻이 근접하고 '일정'이 되풀이됨. | "준비되시면 다음 주에 도와드릴게요" |
| **17.3 오답1** "어떤 위로도" | '말'과 같은 뜻 — **정답 둘**. | "어떤 시간도" |
| **18.1 오답2** "내리시는 판단은 충분히 정당해요" | 분노 장면에서 "당신들 잘못"이라는 판단에 동의하는 말 — **실패**. | "어제 느끼신 감정은 충분히 정당해요"(right now가 들림) |
| **20.1 오답1** "말씀하셨을 걸" | 대리 판단에서 '원하셨을'과 뜻이 겹침 — **정답 둘**. | "가족분들이 원하실 걸 생각해보세요" — 이 문장의 why가 가르치는 대비(환자 뜻 ↔ 가족 바람)라 좋은 오답 |
| **20.4 오답1** "천천히 쉬시고" | 바꾼 자리('생각')가 en에 없음(③). | "…필요한 건 뭐든 적어 두세요"(ask me가 들림) |
| **20.0·20.2·20.3** | **통과**. | — |

**4. 사전적으로 자연스러운 빈칸 오답**
| 문장 | 판정 | 새 선택지 |
|---|---|---|
| **8.3** giddy·jealous·smug | 문법·연어는 자연스럽지만 겁먹은 가족의 대기 장면에서 터무니없어 **장면만 보고 걸러짐**(약함). | relieved·proud·excited — 병원에서 실제로 쓰는 감정이고, 지금 이 순간에는 아닌 말 |
| **17.2** hungry·awake·dressed | 위와 같은 이유로 약함. | alone·seated·outside |

8.3 decoy `about the surgery`도 조립하면 "It's okay to feel scared about the surgery"로 ko와 뜻이 거의 같습니다 → `to feel tired`.

**5. 9.2(저작자 메모)** 정보→날짜·숫자. 들리는 자리이고 해가 없어 **통과**. 다만 '날짜'가 9.3에도 있어 둘 다 약한 편입니다(되풀이 2회, 상한 안).

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 5 | 말하는 방식(You can·I know·so far·the moment·doing everything they can)을 짚고 사실 오류가 없음. 결과를 장담하지 않는 이유(19.1·11.0·2.3)를 잘 설명. order why 2장이 줄 순서와 어긋남(D에서 고침). |
| 2 빈칸 | 3 | 39문장 고침. 정답 둘 5(thirsty·tablet·signed/ordered·follow·rules), 잘못된 안심 2(healed·cured, he's finished 중의), 문법·관용으로 걸러짐 14(keep/leave/hold you posted, does/will/can, specifies/supplies, waving/writing, only/too/more, every/each/either 등), 장면 밖·소리 묶음 18(cafeteria·vote·passwords·hallway·budget·louder/colder·confident/cautious/courteous 등). |
| 3 decoy | 3 | 18개 고침. 조립하면 ko 뜻 그대로가 9(quietly·for you·to ask·a delay·and resting·from the pharmacy 등), 반대말·시각·사과 4(before she's settled·when it's quiet·tonight·for the delay), 모양이 어느 자리에도 안 맞음 5. |
| 4 distractorsKo | 3 | 틀·길이(V20)·표지 쏠림(려고 0)은 잘 지킴. 고칠 것은 41문장 54개다. 안전 7문장 10개, 정답 둘 12문장 14개, 뒤집기 8, ③ 안 들림·말투 4, 약함·길이·되풀이 18개. 활용형 되풀이(쉬다 7·나가/나오 5)는 W19가 못 잡음. |
| 5 order | 3 | 21장 중 13장 고침. 인접 교환이 자연스러운 카드 12장, why가 줄 순서와 어긋난 카드 2장(11·13). 임상 순서 오류는 없음. |
| 6 tag·icon | 5 | 태그가 역할을 말하고 상황 안에서 일관됨. 아이콘(handshake2·faceWorried·stetho·siren·pushpin)도 뜻과 맞음. |
| 8 파일럿 갈래 | 3 | 빈칸 오답이 장면 밖·소리 묶음(c-·s-·w-·re-·-er)인 경우가 많음. 관용구 빈칸(keep you posted·in good hands·around the corner)은 문법으로 걸러짐. decoy가 같은 뜻 문장이 되는 경우 9. order 줄을 가리키는 말이 약한 카드 12장. |

## 세어 본 것 (현재 → 제안 반영 후, 스크립트)
- **오답 둘 다 같은 표지 틀:** 0 → 0.
- **오답에만 있는 표지(정답 ko에는 없는 것), 주제 전체:**
  - "~려고": 0 → 0(정답 ko 2).
  - "~기 전에": 0 → 0(정답 ko 2).
  - "~러"(목적): 2 → 3(정답 ko 3).
  - "~도록": 0 → 0.
  - 조건 "~면": 1 → 1(정답 ko 19).
  - **"~려고" 쏠림은 없습니다.** 처치·보고 문장이 없어 "보고 대신 다시 재기"도 해당이 없습니다.
- **오답 둘 다 교과서·장면 사실:** 4 → 4(3.1 담요/옷 · 4.3 춥고/불편해 · 6.1 깨끗한지/정돈되고 · 9.0 수술실에/오래 걸릴 수). 모두 정보문이고 들리는 세부가 갈려 통과.
- **오답 둘 다 정답보다 김(공백 뺌):** 15문장 → 1문장(2.3, +2·+2 — 줄이면 틀이 깨져 둠).
- **되풀이 — W19 어간(앞 두 음절):**
  - 현재: 수술·안내·천천·일정 5(상한).
  - 제안 후: 수술 5, 그 밖은 4 이하.
- **되풀이 — 활용형 직접 셈(W19가 못 묶는 것), 현재 → 제안 후:**

  | 낱말 | 현재 | 제안 후 |
  |---|---|---|
  | **쉬다** | **7 (상한 초과)** | 1 |
  | 나가/나오 | 5 (모두 뒤집기) | 1 |
  | 들을게요 | 3 | 0 |
  | 담요 | 3 | 1 |
  | 천천히 | 5 | 4 |
  | 일정 | 5 | 3 |
  | 이동/이송 | 5 | 5 (상한, 둠) |
  | 전화 | 1 | 3 |
  | 병실 | 2 | 3 |
  | 회복 | 3 | 4 |

- **decoy 모양:**
  - 현재 → 제안 후: 전치사·to구 51 → 50 · and/but구 24 → 22 · 절·명사구 8 → 14 · 한 낱말 8 → 6 · 기타 14 → 13.
  - 장소 구 몰림은 없습니다.
- **decoy 낱말 몰림:**
  - about 8 → 6(about the surgery 2회 → 1).
  - paperwork·desk·schedule 각 3 → 3.
  - 같은 decoy를 두 번 쓴 것: 2(about the surgery·to ask) → 0.
- **빈칸 오답 최다:**
  - 현재: 3회짜리 14개(hold·thirsty·argue·forms·rules·dressed·discharged·hungry·chart·early·late·after·nothing·little).
  - 제안 후: 3회짜리 6개(last·argue·forms·bill·alone·after).
  - 같은 묶음 something/nothing/little(15.2·19.1)을 풂.

## 심각한 문제
1. **연락·대기 확인 대상을 바꾼 오답(안전) — 5.2·5.3.**
   - "가까이 계셔주세요", "짐을 맡겨만", "언제 오실지"가 여기에 해당합니다.
   - 이대로 하면 가족이 어디 있는지 데스크가 모르게 됩니다. 이 상황이 가르치는 '그 순간 할 일'이 바로 위치를 알리는 것입니다.
2. **집도의 면담 연결을 다른 일로 바꾼 오답(안전).**
   - 13.4: 둘 다 해당합니다("가족분을 모실"·"사진을 보여 드릴").
   - 15.4: 간호사가 집도의 대신 "계속 설명할게요".
   - 고칠 때는 면담은 남기고, 들리는 come·as soon as possible만 바꿨습니다(전화로·오늘 저녁에). 15.4는 자리만 바꿨습니다(저쪽에).
3. **통역사 확보를 다른 것으로 바꾼 오답(안전) — 10.1.**
   - "번역지를 불러올게요"는 통역사를 종이로 바꿨고, 한국어도 어색합니다.
   - "통역사를 대기시킬게요"는 통역사 확보를 미룹니다.
   - 새 값:
     - 앞 단계 — "쓰시는 언어부터 여쭤볼게요".
     - 목적만 바꿈 — "제 말을 잘 이해하시게". 이 문장의 why가 가르치는 '서로'와 대비됩니다.
4. **감정 지지를 뒤집은 오답 — 8.2 "걱정 마세요"(무시), 18.1 "판단은 정당해요"(분노 가족의 탓에 동의).**
5. **같은 안심을 다른 말로 한 정답 둘 — 10.0·13.3·15.1(안정적 ↔ 편안·쉬고).**
   - 같은 갈래로 '곁에 있기'를 품은 오답이 있습니다: 16.4·17.1·8.2.
   - 이런 오답은 듣고도 고를 수 없습니다.
6. **decoy를 조립하면 ko 뜻 그대로인 것 9개.**
   - 대표: 8.2 `for you`(I'm here for you), 9.4 `to ask`(the right person to ask that question), 7.0 `a delay`(A delay doesn't always mean a problem).
   - 사망 장면 17.0 `for the delay`는 지연을 사과하는 말이 되어 탓으로 읽힙니다.
7. **잘못된 안심 빈칸 — 9.0 healed·10.0 healed/cured.** 수술 중인 환자에게 "나았다"는 결과를 약속하는 선택지입니다. 9.0 finished는 '끝장났다'로도 읽힙니다.

## 고칠 것 — 111건(문장·카드 단위: distractorsKo 41 · 빈칸 39 · decoy 18 · order 13) — 안전 13 · 정답 둘 26
번호는 상황.문장(0부터)입니다. 새 값은 모두 `_reviewB_core-family-or_patch.py`에 있고 사본에 들어가 있습니다. 바꾸지 않은 쪽은 그대로 둡니다.

### A. distractorsKo — 41문장 54개 (안전 7문장·10개 · 정답 둘 12문장·14개 · 뒤집기 8 · ③·말투 4 · 약함·길이·되풀이 18개)
| 어디 | 무엇이 문제 | 새 값 |
|---|---|---|
| 3.1 오답2 | 둘 다 정답보다 김 | 필요한 순간에 바로 옷을 드릴 수 있게 준비해둘게요. |
| 4.0 오답1 | "같이 들어가실"은 뜻이 흐림(약함) | 회복실에서 잠이 깨시면 뵈러 들어가실 수 있어요. (settled가 들림) |
| 4.0 오답2 | 들어가다↔나가다 뒤집기(⑤) | 회복실에서 안정을 찾으시면 전화로 통화하실 수 있어요. |
| 4.1 오답1 | 둘 다 김·담요 되풀이 | 준비되면 의사가 모시러 올 거예요. (nurse가 들림) |
| 4.2 오답2 | 수술 전↔후 뒤집기 | 보통 퇴원 후 삼십 분 정도 걸려요. |
| 4.4 오답2 | 모시고 오다↔나가다 뒤집기 | 저희가 내일 아침에 다시 모시고 올게요. (ko 자체는 아래 참고) |
| 5.1 오답2 | "안내 방송"은 overhead page라 pager의 다른 뜻 — 정답 둘 위험 | 원하시면 대기 번호표도 있어요. |
| 5.2 오답1 (안전) | 연락 가능→가까이: 대기 장소 지시로 바꿈, 뜻 근접 | 질문이 있을 경우를 대비해 연락 가능하게 계셔주세요. |
| 5.2 오답2 | '계셔 주세요' 띄어쓰기만 달라 모양 단서 | 회진 시간을 대비해 연락 가능하게 계셔주세요. |
| 5.3 오답1 (안전) | 위치 알림을 빼 연락 불가 | 자리를 비우시면 데스크에서 호출기를 받아 가세요. |
| 5.3 오답2 (안전) | 확인 대상 어디→언제 | 주차하러 나가시면 데스크에 어디 계실지 알려만 주세요. |
| 6.2 오답2 | 마취 시간 ≈ 시작 시간(정답 둘) | 담당 의사가 정해지는 대로 바로 알려드릴게요. |
| 6.3 오답1 | "더 연습하고" — 팀이 미숙하다는 말로 들림(약함·부적절) | 팀에서 이걸 안전하게 하려고 더 상의하고 있어요. |
| 7.4 오답1 | "정리할게요" 어색(약함) | 한 번 더 확인해서 바로바로 알려드릴게요. |
| 8.2 오답1 (안전) | "걱정 마세요" 감정 축소 | 혼자가 아니에요, 제가 여기 자주 들를게요. |
| 8.2 오답2 | 곁에 있기를 품음·어색(정답 둘) | 많이 힘드시죠, 제가 여기 함께 있을게요. |
| 10.0 오답1·2 | 같은 안심(정답 둘)·쉬다 되풀이 | 아드님은 잘 지내고 있고, 지금 회복실에 있어요. · 따님은 잘 지내고 있고, 안정적이에요. |
| 10.1 오답1 (안전) | 통역사를 번역지로·어색 | 서로 잘 이해할 수 있게 쓰시는 언어부터 여쭤볼게요. |
| 10.1 오답2 (안전) | 통역사 확보를 미룸 | 제 말을 잘 이해하시게 통역사를 불러올게요. |
| 11.0 오답1 | 바꾼 '안심하세요'가 en에 없음(③) | 아드님은 아주 잘 돌봐드리고 있으니 안심하세요. (daughter가 들림) |
| 11.0 오답2 | 돌봄→휴식, 같은 안심 근접·쉬다 | 따님은 아주 좋은 병실에 계시니 안심하세요. |
| 11.1 오답2 | 둘 다 김 | 소아과 팀은 아이들을 씻기는 데 전문이에요. |
| 11.2 오답1 | 7세 환아에게 "연락" — 어색 | 회복실로 옮기시면 바로 알려드릴게요. |
| 11.3 오답2 | "번갈아"도 계속 지켜보는 것(정답 둘) | 의사가 계속 곁에서 세심하게 지켜볼 거예요. |
| 11.4 오답2 | 둘 다 김 | 곧 사진을 보실 수 있을 거예요. |
| 12.0 오답1 | 면회↔나가다 뒤집기 | 회복실을 깨끗하게 유지하려고 한 번에 한 분만 면회하실 수 있어요. |
| 12.2 오답1·2 | 쉬다 되풀이, 오답2 +4자·뵙다≈말씀 나누다 | 교대로 들어가시면 오래 뵐 수 있어요. · 교대로 들어가시면 두 분만 뵐 수 있어요. |
| 12.4 오답1 | 들어가다↔나오다 뒤집기 | 누가 먼저 들어가실지 저와 정해주세요. (together가 들림 — why의 '가족에게 맡김'과 대비) |
| 13.0 오답1·2 | 물품·서류는 장면 밖, 오답2는 두 군데 | 지금 바로 설명드려야 할 걸 발견했어요. · 지금 바로 처리해야 할 걸 찾고 있어요. |
| 13.3 오답1 | 안정적≈편안(정답 둘) | 계획이 조금 바뀌긴 했지만, 여전히 마취 중이세요. |
| 13.4 오답1·2 (안전) | 집도의 면담을 모시기·사진으로 | 집도의 선생님이 가능한 한 빨리 전화로 말씀 나눌 거예요. · 집도의 선생님이 오늘 저녁에 와서 말씀 나눌 거예요. |
| 14.1 오답2 | 전↔후 뒤집기(들어간 뒤엔 함께 기도 불가) | 모시고 들어가기 전에 잠깐 통화를 연결해드릴 수 있어요. |
| 15.1 오답1·2 | 단·복수만(③)·같은 안심(정답 둘) | 팀에서 상의하고 있고, 지금은 안정적이세요. · 팀에서 대응하고 있고, 지금은 혈압이 낮으세요. |
| 15.2 오답2 | 둘 다 김·일정 상한 | 집도의 선생님이 짧게 다 설명해드릴 거예요. (in detail이 들림) |
| 15.3 오답1 | "들었어요" — 전해 들은 말투만 다름(실패 유형 5) | 받아들이기 힘든 결정이라는 거 알아요. |
| 15.4 오답2 (안전) | 간호사가 집도의 대신 설명 | 집도의 선생님이 이야기하러 오실 때까지 저쪽에 있을게요. |
| 16.4 오답1·2 | 곁에서 듣기·돕기 = 곁에 있기(정답 둘) | 저는 어디 안 가요, 계속 바로 뒤에 있을게요. · 저는 어디 안 가요, 계속 바로 문 앞에 있을게요. |
| 17.1 오답2 | 곁에 있기를 품음(정답 둘) | 필요한 만큼 시간을 가지세요, 제가 문 밖에 있을게요. |
| 17.2 오답2 | 일정≈절차, 일정 되풀이 | 준비되시면 다음 주에 도와드릴게요. |
| 17.3 오답1·2 | 위로≈말(정답 둘), 둘 다 김 | 이런 상실에는 어떤 시간도 부족하네요. · 이런 결정에는 어떤 말도 부족하네요. |
| 18.1 오답2 (안전) | 분노 가족의 탓에 동의 | 어제 느끼신 감정은 충분히 정당해요. |
| 19.0 오답1 | 빠르게↔천천히 뒤집기·천천히 되풀이 | 환자분 위치가 바뀌어서 팀이 빠르게 움직이고 있어요. |
| 19.1 오답2 | 둘 다 김 | 지금 할 수 있는 몇 가지를 하고 있어요. |
| 19.3 오답1 | 들어가다↔나가다 뒤집기 | 보고하러 가야 하지만, 곧 돌아올게요. |
| 19.4 오답1 | 둘 다 김·담요 되풀이 | 바로 여기 계세요, 누군가 와서 물을 드릴 거예요. |
| 20.1 오답1 | 말씀하셨을≈원하셨을(정답 둘) | 가족분들이 원하실 걸 생각해보세요. |
| 20.4 오답1 | 바꾼 '생각'이 en에 없음(③)·쉬다 | 천천히 생각하시고, 필요한 건 뭐든 적어 두세요. |

### B. 빈칸 — 39문장 (안전 2 · 정답 둘 5 · 문법·관용 14 · 장면 밖·소리 묶음 18)
| 어디 | 문제 | 새 answer: 선택지 |
|---|---|---|
| 0.3 | confident/cautious/courteous — c- 소리 묶음·관용 깨짐 | comfortable: useful·scarce·available |
| 1.2 | keep→leave/hold/send you posted 문법으로 걸러짐 | posted: guessing·busy·seated |
| 2.0 | cafeteria 장면 밖 | team: lab·pharmacy·ICU |
| 3.3 | vote 장면 밖 | worry: laugh·argue·joke |
| 4.3 | thirsty — 수술 후 실제로 흔함(정답 둘) | sleepy: cheerful·hungry·energetic |
| 5.1 | tablet system — 대기실 상황판·태블릿 알림이 실제로 있음(정답 둘) | pager: brochure·locker·printout |
| 5.2 | invisible 장면 밖 | reachable: silent·awake·offline |
| 5.3 | door/phone/chart에게 알림 — 사물이라 걸러짐 | desk: pharmacy·lab·gift shop |
| 5.4 | greet/thank/pay 장면 밖 | page: bill·fax·seat |
| 6.0 | louder/colder -er 소리 묶음 | longer: shorter·smoother·quicker |
| 6.1 | signed·ordered — 동의서·처방 확인은 실제 지연 이유(정답 둘) | ready: billed·quiet·empty |
| 6.4 | funny/tidy 장면 밖 | wrong: done·ready·new |
| 7.0 | does/will/can 조동사 — 문법으로 걸러지고 가르치는 말 아님 | longer: shorter·smaller·simpler |
| 8.3 | 위 부탁 판정 4 | scared: relieved·proud·excited |
| 9.0 (안전) | healed — 잘못된 안심; finished — 중의 | stable: walking·eating·home |
| 9.3 | passwords/vendors/invoices 장면 밖 | specifics: visitors·press·chaplain |
| 9.4 | early person 문법 | right: wrong·last·newest |
| 10.0 (안전) | healed/cured 잘못된 안심·awake 장면에서 참일 수 있음 | stable: critical·unstable·transferred |
| 10.1 | accountant/engineer 장면 밖 | interpreter: orderly·attendant·escort (W17 맞춤) |
| 10.3 | hallway/schedule/budget 장면 밖 | language: room·time·folder |
| 11.0 | rooms/charge/tune — 관용 깨짐 | hands: company·spirits·time |
| 11.1 | specifies/supplies/screens — s- 소리·문법 | pediatric: geriatric·cardiac·orthopedic (빈칸을 가르치는 말로 옮김) |
| 11.3 | waving/writing/walking — w- 소리·문법 | whole: first·last·same |
| 11.4 | only/too/more — 문법 | see: feed·bathe·dress |
| 12.1 | follow closely = monitor(정답 둘) | monitor: visit·meet·bathe |
| 12.2 | cook out 장면 밖 | switch: sign·check·log |
| 14.1 | without 문법 | before: after·until·once |
| 14.2 | visible/spare/vacant 장면 밖 | available: busy·absent·away |
| 16.2 | every/each/either 문법 | time: water·tissues·snacks |
| 16.3 | cheap/tidy/legal 장면 밖 | easy: quick·polite·short (There's no polite way to say this — 자연스럽지만 이 장면 말투가 아님) |
| 17.2 | 위 부탁 판정 4 | ready: alone·seated·outside |
| 17.3 | rules — "There are no rules for a loss like this"가 자연스럽고 맞음(정답 둘) | words: tests·forms·signs |
| 18.1 | early/final 장면 밖 | valid: public·mutual·private |
| 19.1 | something/nothing/little — 문법·15.2와 같은 묶음 | can: want·like·choose |
| 19.3 | remain/repeat/resign — re- 소리 | back in: home·on break·to lunch |
| 19.4 | nobody/everyone/anyone — 문법·부정 | right here: at home·downstairs·in the car |
| 20.1 | against/beyond/around — 문법 | wanted: feared·ordered·signed |
| 20.3 | late/loud/cheap 장면 밖 (easy는 정답 둘이라 피함) | wrong: free·legal·medical |
| 20.4 | my/their/his — 소유격만 | time: seat·turn·pick |

### C. decoy — 18개 (안전 4 · 정답 둘 9 · 모양 5)
| 어디 | 문제 | 새 값 |
|---|---|---|
| 0.0 | `quietly` → "You can wait quietly in the surgical waiting area" ko 뜻 그대로 | `in the recovery` |
| 1.4 | `for families to wait` → 가족이 더 기다리는 건 흔한 일(뜻 근접) | `for visits to run` |
| 3.1 | `from the pharmacy` → "약이 필요할 때 약국에서" ko 뜻 근접 | `He'll have a blanket` |
| 4.0 (안전) | `before she's settled` — 반대말, 조립하면 안정 전에 면회 | `in her room` |
| 5.4 (안전) | `when it's quiet` — 조용할 때로 알림을 늦춤 | `We'll call the unit` |
| 6.3 | `extra coffee` 장면 밖 | `extra cases` |
| 7.0 | `a delay` → "A delay doesn't always mean a problem" 뜻 그대로 | `A shorter surgery` |
| 8.2 | `for you` → "I'm here for you" 뜻 그대로 | `with the team` |
| 8.3 | `about the surgery` 뜻 근접·10.4와 중복 | `to feel tired` |
| 8.4 | `and count along` → 함께 숨쉬며 세기(뜻 근접) | `and sit down` |
| 9.0 | `and resting` → "stable and resting well" 뜻 근접 | `that he's awake` |
| 9.4 | `to ask` → "the right person to ask that question" 뜻 그대로·14.4와 중복 | `to repeat` |
| 11.0 | `in the lobby` 장소 구 — 어느 자리에도 안 맞음 | `in very busy` |
| 12.0 | `and quiet halls` 어느 자리에도 안 맞음 | `the halls calm` |
| 17.0 (안전) | `for the delay` — 사망 장면에서 지연 사과=탓 | `for my` |
| 17.1 (안전) | `tonight` — 시간을 오늘 밤으로 한정(재촉) | `Take all the forms` |
| 20.3 | `no clear answer` 어느 청크 자리에도 안 맞음 | `There's no easy choice` |
| 20.4 | `about the rules` 어느 자리에도 안 맞음 | `Take a seat` |

### D. order — 13장 (인접 교환 자연스러움 12 · why 불일치 2)
| 상황 | 문제(자연스러운 교환) | 바꾼 줄 (en / ko / note) |
|---|---|---|
| 2 | 3↔4("I'll come back…"·"That's all I know") | 3: Those are the only details I have so far. / 지금까지 제가 아는 건 그게 전부예요 / 한정 |
| 3 | 1↔2(That's a common concern이 가족 질문을 바로 받음) | 2: That worry is very common, and we plan for it. / 그런 걱정은 아주 흔하고, 저희도 대비하고 있어요 / 인정 (개선 — 1↔2가 약하게 남음) |
| 8 | 1↔2·2↔3 모두 자연스러움 | 2: You don't have to feel it alone — I'm here with you. / 그 마음을 혼자 견디지 않으셔도 돼요, 제가 함께 있어요 / 지지 · 3: Since I'm right here, let's take a breath together. / 제가 바로 여기 있으니 같이 숨을 쉬어봐요 / 제안 |
| 9 | 3↔4("That's because"가 2줄 한계의 이유로도 읽힘) | 4: From him, you'll get accurate information, not guesses. / 집도의 선생님께 들으시면 추측이 아닌 정확한 정보예요 / 이유 |
| 10 | 1↔2·3↔4 | 2: To tell you more than that, let me get an interpreter. / 그 이상 말씀드리려면 통역사를 불러올게요 / 제안 · 3: They can explain everything in your language. / 통역사가 모든 걸 어머님 언어로 설명해요 / 안내 · 4: If any of it still isn't clear, please tell me. / 그래도 명확하지 않은 게 있으면 말씀해 주세요 / 확인 |
| 11 | 1↔2·2↔3, **why가 3·4줄 순서와 반대** | 2: That's because the pediatric team specializes in caring for children. / 소아과 팀이 아이들을 돌보는 데 전문이라서 그래요 / 근거 · 3: One of their nurses will watch her closely the whole time. / 그 팀 간호사가 내내 세심하게 지켜볼 거예요 / 관찰 |
| 12 | 3↔4("decide who goes first"·"switch out") | 2: That rule helps us monitor her closely and safely. / 그 규정 덕분에 더 세심하고 안전하게 지켜볼 수 있어요 / 이유 · 4: For that, please decide together who goes in first. / 그러려면 누가 먼저 들어가실지 함께 정해주세요 / 맡김 |
| 13 | **why가 줄 순서와 다름**(why는 '설명 연결 → 질문 → 집도의 옴', 줄은 '상태 → 집도의 옴 → 질문') | why만 |
| 15 | 2↔3("surgeon will explain all of that"이 1줄만 받아도 됨) | 3: The surgeon will explain both of those in detail. / 집도의 선생님이 그 두 가지를 자세히 설명해드릴 거예요 / 연결 |
| 16 | 1↔2·2↔3 | 2: There's no easy way to say it, so I'll be direct. / 쉽게 말씀드릴 방법이 없어서 바로 말씀드릴게요 / 인정 · 3: Being direct means telling you honestly what happened. / 바로 말씀드린다는 건 무슨 일이 있었는지 솔직히 말씀드린다는 거예요 / 솔직 |
| 17 | 1↔2·2↔3 | 2: Those words feel too small for a loss like this. / 그 말로는 이런 상실에 턱없이 부족하네요 / 인정 |
| 19 | 2↔3·3↔4 | 2: I need to go back in to help them. / 들어가서 팀을 도와야 해요 / 이유 (redo) · 3: While I'm gone, please stay right here. / 제가 없는 동안 바로 여기 계세요 / 안내 (pushpin) · 4: That way, someone can find you with any update. / 그래야 누군가 소식을 들고 찾아올 수 있어요 / 약속 (bell) |
| 20 | 3↔4("Take your time with that decision"·"Whatever you decide") | 4: Until then, take your time, and ask me anything you need. / 그때까지 천천히 생각하시고, 필요한 건 뭐든 물어보세요 / 질문 |

why 새 글은 `_reviewB_core-family-or_patch.py`의 `O`에 있습니다. 바꾼 카드마다 앞 줄을 가리키는 말을 적었습니다.

교환을 판정만 하고 그대로 둔 카드는 0·1·4·5·6·7·14·18입니다. 남은 교환은 어색하거나, 가리키는 말(them·either one·When that happens·In this case·it)이 끊깁니다. 0번 1↔2만 약하게 자연스럽습니다(대기 위치를 묻는 가족이라 1줄이 먼저).

### E. why — 문장 why 0건
문장 why 105개는 사실 오류가 없고 ko를 되풀이하지 않습니다. order why 2건은 D에 넣었습니다.

## 참고 — A 몫, 고치지 않은 것
- **4.4 ko — 다른 뜻으로 옮겼습니다.**
  - 미국 병원에서 "We'll bring you back"은 가족을 안쪽(회복실·환자 곁)으로 모셔 간다는 말입니다.
  - 지금 ko "다시 모시고 올게요"는 대기실로 다시 데려온다는 뜻이라 en과 다릅니다. why도 이 뜻이 흐립니다.
  - 제안: "가능한 한 빨리 환자분께 모셔다 드릴게요". A가 ko를 고치면 오답 둘도 새 ko에 맞춰 다시 써야 합니다.
  - order 4번 카드 4줄 "After you've seen her, we'll bring you back here."는 here가 있어 그대로 맞습니다.
- **18.3 ko "뭐가 잘못됐는지 이해하고 싶어요".**
  - 분노·항의 장면이라 '의료진이 잘못했다'를 인정하는 말로 읽힐 수 있습니다.
  - en의 what's wrong은 '무엇이 속상하신지'입니다. "뭐가 속상하신지 이해하고 싶어요"를 권합니다(A 판단).
- **2.3:** 오답 둘이 정답보다 2자씩 깁니다. 줄이면 틀이 깨져 둡니다.
- **이동·이송 오답이 다섯 군데입니다(0.3·1.1·2.1·2.3·11.1).** 상한 안이지만 더 늘리지 마세요.
- **0.4 around the [corner] — 그대로 둡니다.** 관용이라 elevator/desk/lobby가 문법으로 걸러져 약하지만, 정답이 둘이 되는 오답이 없습니다.

## 종합
**고친 뒤 내보내도 됩니다.** 처치 문장이 없어 환자를 직접 다치게 하는 오답은 없습니다. 다만 가족 소통에서 하면 안 되는 것을 오답으로 쓴 곳이 있습니다.
- 위치 알림 빼기(5.3), 집도의 면담 바꿔치기(13.4·15.4), 통역 확보 미루기(10.1), 무시·탓 동의(8.2·18.1).
- 같은 안심·곁에 있기를 다른 말로 한 정답 둘이 12문장입니다.
- 사본에 모두 넣어 두었으니 수정 담당은 `_reviewB_core-family-or_patch.py`의 값을 그대로 쓰면 됩니다.

## 검사
```
python3 /Users/ywyeom/private/forin/server/content/tools/verify_one_theme.py or /Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/_reviewB_core-family-or_after.yaml
  변경 목록 102건: changes-core-family-or.yaml
core-family-or: 상황 21/21 · 단어 192개
  ==> 통과        (위반 0 · 경고 0 — 처음 넣은 10.1 aide가 W17을 내서 attendant로 바꿈)
```
