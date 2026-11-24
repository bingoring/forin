# or-emergency-open — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥·되풀이 상한)

대상: `or-emergency-open.yaml`(A·B 합친 파일, 수정하지 않음) · 문장 105 · 상황 21
**새 값 전부를 넣은 사본:** `/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/_reviewB_or-emergency-open_after.yaml`
→ `verify_one_theme.py or …_after.yaml` **위반 0 · 경고 0 · 통과**. 바뀐 것은 문장 `distractorsKo`·`blank`·`decoy`·`why` 4·`tag` 2와 order 7장뿐이고, 단어·뉘앙스·문장 en/ko/chunks/words/goal은 원본 그대로입니다(`_patch.py`가 assert로 대조).

스크립트(모두 같은 폴더): `_reviewB_or-emergency-open_dump.py`(en|ko|오답1|오답2·빈칸 네 줄·order 인접 교환 21장 전부 → `_table.txt`/`_after_table.txt`) · `_decoy.py`(decoy를 청크 자리마다 넣어 읽기 → `_decoy.txt`/`_after_decoy.txt`) · `_count.py`(표지 틀·W19식 어간·decoy 모양·낱말 몰림·빈칸 오답 되풀이·"하나는 정답 길이 이하") · `_stems.py`(한 음절 어간 활용형 직접 셈: 오다·두다·알리다·보내다…) · `_patch.py`(새 값 전부 적용, V20·길이·빈칸 경계·decoy·order 15단어·B 필드만 바뀜 확인, 원문·새 값은 `_proposal.json`) · `_md.py`(아래 목록 생성).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 말하는 방식의 이유를 잘 설명. 고칠 것 4 — 15.3 위기 의사소통 원칙과 반대("someone"을 현장 말투로 칭찬), 1.3 en과 어긋남, 15.1 is here를 수동태로, 4.0 시점을 이유로 |
| 2 빈칸 | 2 | 43문장 고침: 정답 둘 17(open warmer·capped·tags·electric·scanned·irrigate·again/first 등), 넣어 읽으면 위험 4(ocular·우선순위 swelling·labels·expired), 관사·수 일치·문법으로 걸러짐 7, 동떨어짐·묶음 되풀이 15 |
| 3 decoy | 3 | 15개: ko에 그대로 맞음 2(a long line·on the cart), 해도 맞는 다른 행동 4(specimen labels·sutures·a warmer·transport monitor), 위험한 조립 4(to the lab·as it dries·on the table·to the lounge), 모양이 어느 자리에도 안 맞음 3, 몰림·동떨어짐 2 |
| 4 distractorsKo | 2 | 63문장 83칸: 안전 39(위기 문장 소견·장비·제제·처치 바꿈, 계수·추적 대상 바꿈, 환자 목적지), 정답 둘 29, 기타 15(오답 둘 다 정답보다 긴 문장 19곳 등) |
| 5 order | 3 | 21장 전부 인접 교환: 자연스러운 교환 5장(S5 34·S9 23·S12 34·S16 34·S18 12), 임상 순서 S7(신생아팀 호출이 맨 끝), 범위 S20(간호사가 기도를 넘겨받는 'swap'). 머리말 ko는 모두 맞음 |
| 6 tag·icon | 4 | 상황 안에서 일관. 12.2 '총계 호창'(쓰지 않는 말), 16.3 '혈액 도착'(en은 sending) 2개 |
| 8 파일럿 갈래 | 2 | 위기 문장의 처치·소견 바꿈이 주제 전체에 퍼짐, 빈칸 정답 둘·동떨어짐, decoy 조립 위험, order 임상 순서 1 |

## 심각한 문제
1. **위기 문장 오답이 소견·장비·제제·처치를 바꿈** — DIC 18.0·18.4(배어 나옴→흘러나옴, DIC→감염), 다중 위기 20.0·20.3(수혈→수액, 기도→산소·수액), 신생아 소생 17.0·17.1·17.3(워머→저울, 백밸브마스크→산소마스크), 복강 출혈 6.4(혈액 요청→흡인·랩패드: 같은 상황 다른 처치라 정답 둘이기도), 다발성 외상 11.0(우선순위 기준 출혈→부종·멍), MTP 16.0(프로토콜→체크리스트), 손상통제 19.0(패킹→세척)·19.4(나중에→곧, 봉합→소독), 태아 곤란 13.1(워머→카트)·13.4(분만 결정→막연한 준비).
2. **계수·추적 문장의 확인 대상 바꿈(체내 잔류·수혈 추적)** — 4.2(대조→정리·닦기), 4.4(거즈 계수→수납함·포장), 14.2(대조→재고·포장), 14.4(계수 기록→검체 목록·시각), 16.2(팩→흡인통·소변량), 16.4(팩→쿨러, 추적→표시).
3. **환자가 가는 곳을 비임상 장소로** — 19.3 오답 엘리베이터·대기실, 같은 문장 decoy `to the lounge`.
4. **넣어 읽으면 위험한 빈칸·decoy** — 9.4 `ocular pressure`(마취 유도 중 눈 압박: 안구심장반사·각막 손상), 11.0 `swelling/bruising source comes first`, 20.4 `change labels`, 8.1 `drawn up and expired`; decoy 6.2 `to the lab`(혈액을 검사실로), 14.0 `as it dries`(검체를 마를 때 표시), 17.0 `on the table`(테이블 위 소생).
5. **준비 동작·감시 바꿈** — 7.3 "번호를 찾고 있어요"(TASK가 명시한 실패), 8.0 "모니터를 맞추고"(감시를 장비 조작으로), 9.0 "점검됐어요", 9.4 "말씀하시면 압박하기 전에 손을 올려요"(신호 뒤에 준비가 와 압박이 늦음 — preop-assessment 15.2와 같은 판정).
6. **정답 둘(같은 뜻·정답 행동에 덧붙임)** — 18.1·18.4 "모자라요", 15.0·13.3 "다시 …", 13.4 "두 번 떨어졌어요", 9.4 "계속 가할게요", 6.0 "시야 때문에 흡인해요", 20.0 "머리를 맡으시면"(take the head), 15.3 "이어지고 있어요", 11.3 "어디 부상", 2.2 "전부 교체".
7. **order S7 임상 순서** — 응급 제왕 신생아 준비에서 신생아팀 호출이 워머·물품 세팅 뒤 맨 끝. 팀이 오는 데 시간이 걸리니 없다는 걸 확인하면 먼저 부르고 오는 동안 갖추는 순서로.
8. **why 15.3** — "someone을 써서 … 현장 말투"라고 칭찬하지만, 코드에서 someone은 아무도 안 부르는 원인(폐쇄 루프 의사소통에서는 이름·역할로 지목). 문장은 그대로 두고 why에서 바로잡음.

## 판정 기준 (이 검토에서 쓴 규칙 — 수정 담당도 이 기준으로)
- **안전:** 오답이 정답 행동의 바로 앞·뒤 단계면 통과(장비 꺼내기·크기 고르기·온 혈액 확인·결과 기록·호출 뒤 안내). 그 순간 정답 행동 대신 하는 일이면 실패: 위기에서 처치·호출·카운트·보고·추적을 다른 일로, 소견·장비·약·혈액 제제·처치 시점·환자 목적지 바꾸기, 위기 장면 옆 일, 감시를 장비 조작으로, 잘못된 안심("쓰이고 있어요").
- **"건물 안 어디는 허용"**은 알릴 곳·물건 둘 곳 같은 세부에만 씁니다. **환자가 가는 곳은 치료 수준**이라 바꾸면 실패(19.3). 인력을 부르는 곳(5.0 "입구로")은 사람이 거쳐 오는 곳이라 통과.
- **참인 사실 오답:** en이 말하지 않은 다른 사실이고, 같은 상황 다른 문장의 정답과 겹치지 않으면 통과(크라이오 피브리노겐·FFP 해동·혈소판 실온·칼슘 저하·에피네프린 3~5분 등). en 내용을 다르게 말한 것("피가 안 굳어요" ↔ DIC)이나 정답 행동을 품은 것("시야 때문에 흡인해요")은 정답 둘.
- **보고 문장은 수치·대상을 바꾸지 않음:** 12.2(총계→시각·속도)·12.3(시각→나온 시각·속도)은 여전히 보고·기록이고 다치지 않아 통과로 봤습니다(무엇을 부르는지 바꾼 것이지 보고를 다른 일로 바꾼 것이 아님).
- **빈칸:** 기준은 "영어로 참인가"가 아니라 "이 장면에서 맞거나, 넣어 읽으면 위험한가". 반대 방향(rising·firm·empty of blood)은 브리프가 권하는 (a)라 통과.
- **decoy:** 같은 자리·같은 모양의 틀린 구가 원칙이라 조립하면 다른 문장이 되는 것 자체는 실패가 아님. 실패는 (a) ko에 그대로 맞음 (b) 위험하거나 처치를 늦춤 (c) 그 장면에서 해도 맞는 다른 행동 (d) 어느 청크 자리에도 모양이 안 맞음 (e) 낱말 몰림 4회 이상.
- **길이:** 오답 둘 중 하나는 정답 길이(공백 뺀 글자 수) 이하. 원본 19문장이 어김 → 사본 0.

## 저작자가 판정을 부탁한 곳
| 곳 | 판정 | 새 값 |
|---|---|---|
| DIC 0(18.0) 오답2 "이건 감염이에요" | **실패** — 진단을 바꿔 제제 요청이 늦어짐. 같은 문장 오답1 "흘러나오고"도 응고장애의 스며 나옴을 수술 출혈로 바꾼 소견 바꿈이라 실패 | "곳곳에서 배어 나오고 있어요 — 제제는 처방대로 받아요." · "곳곳에서 배어 나오고 있어요 — 마취과에 알려요." |
| 마취 유도 0(9.0) 오답2 "점검됐어요" | **실패** — ④ '준비됐어요'와 듣고 가를 수 없고, 위기 준비 완료를 점검으로 바꿈 | "흡인이 켜졌고 윤상연골은 목 앞에 만져져요." (오답1 "설치됐고"는 통과) |
| 다중 위기 0(20.0) "수액", 3(20.3) "수액·산소" | **셋 다 실패** — 혈액 제제·처치 바꿈. 산소는 기도 관리의 일부라 정답과 겹치기도. 20.0 오답1 "머리를 맡으시면"도 take the head = 기도를 맡다라 정답 둘 | 20.0: "…저는 수혈 줄을 채울게요."(앞 단계) · "대량 수혈 중에는 칼슘이 떨어지기 쉬워요." / 20.3: "출혈이 많아 의식이 떨어지면 기도가 쉽게 막혀요." · "기도와 출혈을 한 사람이 다 맡으면 둘 다 늦어지기 쉬워요." |
| 심정지 0(15.0) "다시 흉부압박을 시작할게요" | **실패** — 정답 행동 그대로(정답 둘). 같은 문장 빈칸 `again`·`first`(압박 먼저, CAB)도 정답 둘이라 빈칸을 `pulse`로 | "맥박이 없어요 — 압박이 뇌로 피를 보내요." (오답1 "압박하려고 침대를 낮춰요"는 바로 앞 단계라 통과) |
| 손상통제 3(19.3) 엘리베이터·대기실 | **둘 다 실패** — 환자 목적지는 치료 수준. 대기실은 위험한 지시, 엘리베이터는 경로일 뿐이라 정답의 일부로도 읽힘. decoy `to the lounge`도 같은 이유로 실패 | "임시 봉합을 하고 중환자실에 미리 알립시다." · "임시 봉합은 배를 덮어 두는 거예요." · decoy `a temporary badge` |
| DIC 1·4(18.1·18.4) "모자라요" | **둘 다 실패** — ④ 모자라서 필요한 것이라 영어 need를 듣고 버릴 수 없음. 18.1 오답2 "쓰이고 있어요"도 잘못된 안심(이미 들어가는 중) | 18.1: "FFP와 혈소판, 크라이오가 오면 바로 걸게요." · "FFP와 혈소판, 크라이오는 지혈을 도와요." / 18.4: "…— 크라이오에는 피브리노겐이 많아요." · "…— FFP는 해동하는 데 시간이 걸려요." |
| 산모 대량 출혈 2(16.2) 빈칸 forms·tags | **둘 다 실패** — tags는 팩마다 붙은 태그를 추적하는 것이 곧 팩 추적(정답 둘), forms·orders도 수혈 서류·처방 추적이라 실제 업무에 가까움 | units / shifts / rooms / pagers |
| 마취 유도 4(9.4) 빈칸 ocular·nasal pressure | `ocular` **실패**(넣어 읽으면 유도 중 눈 압박 — 안구심장반사·각막 손상), `nasal` **통과**(같은 분야의 틀린 부위, 해 없음) | cricoid / nasal / sacral / tourniquet |

## 세기 (원본 → 사본)
- 오답 둘 다 같은 표지 틀(~려고·~기 전에·~고 나서·~러·~도록·~하게): **0 → 0**. 표지 틀 오답이 하나 있는 문장 10 → 12 / 105(~려고 4→4, ~기 전에 4→5, ~고 나서 1→2, ~러 1→0, ~하게 0→1). 정답 ko의 표지는 ~려고·~기 전에·~고 나서 모두 0회.
- 오답 둘 다 교과서 사실: **0 → 3**(11.0·18.4·20.3). 늘어난 3개는 위기 단일 판단·요청 문장이라 안전하게 바꿀 한 군데가 없어 브리프의 "참인 다른 효과·이유"로 씀. 한쪽이 사실 문장인 오답 칸은 새 값 83칸 중 39칸(모양: 사실 39·세부 18·뒤 단계 17·앞 단계 9).
- 오답 둘 다 정답보다 긴 문장: **19 → 0**.
- 조건 표지 "~면": 정답 ko 8 / 오답 0 → 13(비율 ko 8/105 ≈ 오답 13/210로 비슷 — 모양 단서가 되지 않음).
- decoy 모양: 기타(명사구·동사구) 65 · 전치사구 32 · and/but 구 4 · 절 4 → 66 · 29 · 5 · 4 · 한 낱말 1 (장소 구 몰림 없음).
- decoy 낱말 몰림: table 4·cart 4 → table 2·cart 2(내용어 최다 3: sterile·next·cold. as 6·now 4·more 4는 'as …'·'… now' 청크 자리에 맞춘 기능어).
- 빈칸 오답 되풀이 최다: 3회 12개(price·forms·adult·dental·loose·swelling…) → 3회 9개(boxed·count·order·drape·cart·tape·scale·weight·vitamins, W18 0). 같은 오답 세트 돌려쓰기: adult/dental 3문장 → 2문장(7.1·13.1 — 셋째 17.2만 바꿈), mark/trim/tag 2 → 1, visiting/retired/former 2 → 1.
- 되풀이 상한(오답에만 있는 낱말, 어간·활용형 직접 셈) 상위 5 — 원본: **두 6(숫자, 상한 7)**, 전에 5, 가운 4, **먼저 4(그중 3은 '더→먼저' 같은 바꿈: 6.2·16.1·18.3)**, 이송 4 / 사본: 알리다 5(알려·알릴·알립), 두다 5(둬요·두면·두는·둘게요), 보내다 5, 오다 5(온·오면 — 가져오다 1 포함), 있다 5(있어·있나·있고; 원본 6), 시간 5 · 집도의 4 · 바로 4 · 떨어지다 4 · 이송 4. `_stems.py`로 활용형을 직접 셌고 검사기 W19도 경고 0.

## 구조 관찰 (고칠 것 아님, 부르는 쪽 판단용)
- 정답 둘을 피하느라 빈칸 새 오답 일부가 다른 진료 분야 낱말로 갔습니다(2.1 stirrups·tourniquets·slings, 7.0 swing·nightlight, 11.0 light·power·heat source, 18.2 invoices·surveys). 문법은 맞고 장면에서 틀리지만 "같은 분야의 틀린 말"보다는 멉니다 — 수정 담당이 더 가까운 말을 찾으면 바꿔도 됩니다(넣어 읽어 정답 둘·위험이 아닌지만 확인).
- 이 주제는 문장 105개 중 위기 문장이 많아(심정지·DIC·MTP·태아 곤란·신생아 소생·다중 위기), "한 군데만 바꾼 같은 틀"이 거의 모두 처치·소견·장비 바꿈이 됩니다. 그래서 새 값의 약 절반이 참인 사실·앞뒤 단계 문장이고, 정답만 '요청·선언' 모양이라는 모양 단서가 남습니다. bleeding 검토와 같은 처지이니 허용 범위를 정해 주세요.
- 20.0·20.3의 en은 간호사가 기도를 맡는 것처럼 읽힐 수 있습니다(A 노트의 "기도 관리는 마취과 몫"). 문장은 A 몫이라 B는 order S20의 'swap those roles'만 '다시 배정'으로 바꿨습니다.

## 종합
고칠 것을 반영하면 내보내도 됩니다. 다만 위기 문장 오답 39칸이 처치·소견·장비를 바꾸고 있어 **이 목록 반영 없이는 내보내면 안 됩니다**(특히 18·20·17·6·11·19 상황). 반영값은 사본에 다 들어 있고 검사기 위반 0·경고 0입니다.

## 고칠 것 — 154건 (안전 49 · 정답 둘 52 · 기타 53)
오답 칸 83(안전 39 · 정답 둘 29 · 기타 15, 63문장) · 빈칸 43(안전 4 · 정답 둘 17 · 기타 22) · decoy 15(안전 4 · 정답 둘 6 · 기타 5) · order 7장(안전 2 · 기타 5) · why 4 · tag 2. 값은 전부 사본에 들어 있습니다. [안전]·[정답둘]·[기타]는 분류입니다.

### 0. 응급 세팅 신속 준비
- **0.0 오답2** [기타] "우리가 할 수 있는 한 깔끔히 방을 세팅합시다." — 길이 — 오답 둘 다 정답보다 김(깔끔히·꼼꼼히 3자 ↔ 빨리 2자)
  - 새 값: **"우리가 할 수 있는 한 밝게 방을 세팅합시다."**

### 1. 응급 기구 세트 개방
- **1.2 오답1** [정답둘] "교체용으로 또 뭘 열어 두길 원하세요?" — '교체용' ≈ '백업용' — 예비로 열어 두는 같은 뜻
  - 새 값: **"봉합용으로 또 뭘 열어 두길 원하세요?"**
- **1.3 빈칸** [정답둘] gown/basin/bin/tray (정답 tray) — basin·gown — 예비로 열어 둘 만한 물건이라 정답 둘(1.2 질문의 답이 무엇이든 성립) → 빈칸을 backup으로
  - 새 값: answer `backup` · backup / cast / ear / eye
- **1.3 why** [기타] '바로 열지 않고 열어 둔다' — 문장은 지금 연다는 말(설명이 en과 어긋남)
  - 새 값: "in case는 지금 쓰지는 않지만 미리 대비한다는 표현이에요. 쓸지 모르는 트레이를 지금 열어 두어, 필요할 때 기다리지 않게 해요."

### 2. 대량 흡인 준비
- **2.1 빈칸** [정답둘] canisters/regulators/adapters/gauges (정답 canisters) — regulators·adapters — 흡인용 여분으로 대기시키는 실제 물품(정답 둘)
  - 새 값: answer `canisters` · canisters / stirrups / tourniquets / slings
- **2.2 오답2** [정답둘] "말씀만 하시면 제가 전부 교체할게요." — '전부 교체' — swap them out(그것들을 갈아 끼움)과 뜻이 같음
  - 새 값: **"말씀만 하시면 제가 빨리 가져올게요."**
- **2.2 빈칸** [기타] count/label/swap/lift (정답 swap) — label — 'label them out' 문법으로 걸러짐
  - 새 값: answer `swap` · swap / count / hand / lift
- **2.3 빈칸** [정답둘] extra/old/idle/electric (정답 extra) — electric — 휴대용 전동 흡인기를 여분으로 세팅하는 것도 맞음(정답 둘)
  - 새 값: answer `extra` · extra / old / idle / infant
- **2.4 빈칸** [기타] wet/noisy/ready/dusty (정답 ready) — wet·noisy·dusty — 장면과 동떨어짐
  - 새 값: answer `ready` · ready / boxed / clamped / full

### 3. 혈액 확보 확인
- **3.1 오답1** [기타] "혈액은행에서 몇 분 안에 더 반납할 수 있어요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"혈액은행에서 몇 분 안에 더 찾을 수 있어요."**
- **3.2 오답1** [정답둘] "혈액은행과 연락선을 새로 열어 둘게요." — '새로 열어 둘게요' — 정답에 낱말 하나만 더해 뜻이 같음
  - 새 값: **"혈액은행으로 가는 길을 열어 둘게요."**
- **3.2 오답2** [정답둘] "혈액은행과 연락선을 직접 열어 둘게요." — '직접 열어 둘게요' — 정답에 '직접'만 더함
  - 새 값: **"혈액은행과 수량표를 맞춰 둘게요."**
- **3.2 decoy** [정답둘] `a long line` — 'a long line' — 조립하면 'keep a long line open'이 ko(연락선을 열어 둘게요)에 그대로 맞음
  - 새 값: `a chart`
- **3.3 오답2** [기타] "쿨러를 확인하고 얼음을 다시 세어 볼게요." — '얼음을 다시 세어' — 아무도 하지 않을 말이라 듣지 않고 걸러짐 + 오답 둘 다 정답보다 김
  - 새 값: **"쿨러를 확인하고 온도를 다시 볼게요."**
- **3.3 빈칸** [기타] weigh/count/order/price (정답 count) — price — 장면 밖(가격 낱말 price·prices·cost 주제에서 5회)
  - 새 값: answer `count` · count / weigh / order / stack
- **3.4 빈칸** [기타] billed/closed/thanked/updated (정답 updated) — billed·thanked·closed — 장면과 동떨어짐
  - 새 값: answer `updated` · updated / waiting / guessing / busy

### 4. 신속 초기 계수
- **4.0 why** [기타] '이유를 박아요' — before we open은 이유가 아니라 시점
  - 새 값: "Quick을 문장 맨 앞에 둔 동사 없는 현장 말투예요. before we open이 기준 계수를 하는 시점을 개복 전으로 못 박아요."
- **4.1 빈칸** [정답둘] signed/scanned/recorded/filed (정답 recorded) — scanned — 바코드·RF 거즈 계수 체계에서는 '세고 스캔'이 실제 절차(정답 둘)
  - 새 값: answer `recorded` · recorded / signed / opened / filed
- **4.2 오답1** [안전] "봉합 때 전부 다시 정리할게요." — 대조→정리 — 봉합 때 계수 대조를 다른 일로(빠뜨린 확인, 체내 잔류 위험)
  - 새 값: **"봉합 때 대조는 큰 소리로 함께 해요."**
- **4.2 오답2** [안전] "봉합 때 전부 다시 닦을게요." — 대조→닦기 — 같은 이유
  - 새 값: **"봉합 때 대조 결과를 남겨요."**
- **4.2 decoy** [기타] `at the table` — table 몰림(0.0·1.0·4.2·17.0 4회)
  - 새 값: `at the desk`
- **4.3 빈칸** [기타] weekend/holiday/emergency/training (정답 emergency) — weekend·holiday·training — 'an weekend' 관사로 걸러짐
  - 새 값: answer `emergency` · emergency / exercise / audit / elective
- **4.4 오답1** [안전] "봉합 전에 거즈 수납함을 다시 확인할게요." — 계수→수납함 — 확인 대상을 옆 물건으로(ICU 실패 1)
  - 새 값: **"봉합 전에 거즈가 없으면 다시 찾아요."**
- **4.4 오답2** [안전] "봉합 전에 거즈 포장을 다시 확인할게요." — 계수→포장 — 같은 이유
  - 새 값: **"봉합 전에 거즈 계수 결과를 집도의께 알려요."**
- **4.4 decoy** [정답둘] `the specimen labels` — 'the specimen labels' — 조립하면 봉합 전 검체 라벨 재확인(이 장면에서 해도 맞는 다른 행동)
  - 새 값: `the break schedule`

### 5. 긴급 팀 소집
- **5.2 오답2** [기타] "마취과 백업이 호출되고 있어요." — 길이 — 오답 둘 다 정답보다 김(오는 사람을 장비로 바꾸지 않게 상태만 바꿈)
  - 새 값: **"마취과 백업이 바빠요."**
- **5.2 빈칸** [기타] machine/backup/supplies/cart (정답 backup) — supplies — 'supplies is' 수 일치로 걸러짐
  - 새 값: answer `backup` · backup / machine / paperwork / cart
- **5.2 decoy** [기타] `with the cart` — 'with the cart' — 어느 청크 자리에도 모양이 안 맞음
  - 새 값: `the phone`
- **5.4 오답2** [정답둘] "이 방에 필요한 인력을 모두 데려올게요." — '필요한 인력을 모두 데려올게요' — the extra staff we need와 뜻이 같음
  - 새 값: **"이 방에 인력이 더 있어야 역할을 나눌 수 있어요."**
- **5.4 빈칸** [기타] retired/extra/former/visiting (정답 extra) — retired·former·visiting — 5.0과 같은 묶음 되풀이
  - 새 값: answer `extra` · extra / student / volunteer / office
- **order** [기타] swap34 자연스러움 — 'As they arrive, I'll bring them in' 뒤에 'Anesthesia backup is already on the way'가 덧붙여도 말이 됨
  - 3줄: en "Anesthesia backup is about two minutes out." · ko "마취과 백업은 2분쯤 뒤 도착해요" · note `확인` · icon `run`
  - 4줄: en "By then, I'll have the scrub and circulator in here too." · ko "그때까지 스크럽과 순환 간호사도 들어오게 할게요" · note `안내` · icon `handshake2`
  - why: "필요한 역할을 말하고, 그들과 마취과 백업을 호출한다고 알리고, 마취과가 2분쯤 뒤 온다고 확인한 뒤, 그때까지 나머지 인력도 들이겠다고 해요. them·two minutes·By then이 앞 줄을 가리켜요."

### 6. 복강 대량 출혈
- **6.0 오답2** [정답둘] "복강이 피로 가득 찼어요 — 시야 때문에 흡인해요." — '시야 때문에 흡인해요' — 정답 행동(흡인)에 이유만 붙임(ICU 실패 4)
  - 새 값: **"복강이 피로 가득 찼어요 — 출혈 부위가 안 보여요."**
- **6.2 오답1** [정답둘] "방 앞으로 혈액을 더 요청할게요." — '방 앞으로' ≈ 'to the room' — 듣고 가를 수 없음 + 오답 둘 다 정답보다 김
  - 새 값: **"방에 온 혈액을 확인할게요."**
- **6.2 빈칸** [정답둘] tape/towels/blood/sutures (정답 blood) — towels·sutures — 복강 대량 출혈에서 실제로 더 요청하는 물품(정답 둘)
  - 새 값: answer `blood` · blood / contrast / gel / tape
- **6.2 decoy** [안전] `to the lab` — 'to the lab' — 조립하면 혈액을 검사실로 요청(위기에서 엉뚱한 곳)
  - 새 값: `for more ice`
- **6.3 빈칸** [기타] pack/mark/trim/tag (정답 pack) — mark·trim·tag — 6.1과 같은 묶음 되풀이
  - 새 값: answer `pack` · pack / photograph / label / number
- **6.4 오답1** [안전] "복강이 가득 찼으니 지금 흡인이 더 필요해요." — 혈액→흡인 — 혈액 요청을 같은 상황 다른 처치로(정답 둘·요청 빠짐)
  - 새 값: **"복강이 가득 찼으니 혈액이 오면 바로 걸게요."**
- **6.4 오답2** [안전] "복강이 가득 찼으니 지금 랩패드가 더 필요해요." — 혈액→랩패드 — 같은 이유
  - 새 값: **"복강이 가득 찼으니 지금 혈압이 떨어져요."**
- **6.4 빈칸** [정답둘] drapes/towels/blood/stools (정답 blood) — towels — 6.2와 같은 이유
  - 새 값: answer `blood` · blood / drapes / gel / stools
- **6.4 decoy** [기타] `more music now` — 'more music now' — 동떨어짐(music 2회)
  - 새 값: `more chairs now`

### 7. 응급 제왕 신생아 준비
- **7.0 빈칸** [정답둘] scale/monitor/crib/warmer (정답 warmer) — monitor — 신생아 소생 준비에 모니터도 켜 둠(정답 둘), crib — 'crib is on' 말이 안 됨
  - 새 값: answer `warmer` · warmer / scale / swing / nightlight
- **7.1 오답2** [정답둘] "신생아 흡인 물품이 세팅됐어요." — '흡인 물품' — 신생아 흡인 물품은 소생술 물품의 일부라 참
  - 새 값: **"신생아 목욕 물품이 세팅됐어요."**
- **7.2 오답2** [기타] "NICU팀이 방에 어떻게 왔나요?" — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"NICU팀이 언제 방에 왔나요?"**
- **7.3 오답2** [안전] "지금 NICU팀 번호를 찾고 있어요." — '번호를 찾고 있어요' — 위기 호출을 준비 동작(번호 찾기)으로(TASK 명시 실패)
  - 새 값: **"NICU팀이 오면 워머 옆으로 안내할게요."**
- **7.3 빈칸** [정답둘] warn/page/train/teach (정답 page) — warn — 'warn them to come down' ≈ 알려 부르기(정답 둘에 가까움)
  - 새 값: answer `page` · page / allow / train / teach
- **7.4 빈칸** [정답둘] old/open/ancient/extra (정답 extra) — open — 'open warmer'는 개방형 복사 워머의 실제 이름(정답 둘), ancient 동떨어짐
  - 새 값: answer `extra` · extra / old / unplugged / orange
- **order** [안전] 임상 순서 — 응급 제왕에서 신생아팀 호출이 장비 세팅 뒤(마지막)에 옴. 팀이 오는 데 시간이 걸리므로 호출이 먼저
  - 1줄: en "The NICU team isn't in the room yet." · ko "NICU팀이 아직 방에 없어요" · note `확인` · icon `speech`
  - 2줄: en "I'm paging them to come down now." · ko "지금 내려오라고 호출해요" · note `호출` · icon `pager`
  - 3줄: en "While they come, the infant warmer is on and ready." · ko "오시는 동안 영아 워머를 켜서 준비해 뒀어요" · note `워머` · icon `baby`
  - 4줄: en "Resuscitation supplies are set up beside it." · ko "그 옆에 소생술 물품도 세팅됐어요" · note `물품` · icon `baby`
  - why: "팀이 오는 데 시간이 걸리니 없다는 걸 확인하면 먼저 부르고, 오는 동안 워머와 소생술 물품을 갖춰요. them·While they come·beside it이 앞 줄을 가리켜요."

### 8. 제왕 산모 출혈 감시
- **8.0 오답2** [안전] "산후 출혈용 모니터를 맞추고 있어요." — 감시→'모니터를 맞추고' — 감시를 장비 조작으로(ICU 실패 3)
  - 새 값: **"산후 출혈이 보이면 바로 알릴게요."**
- **8.1 오답1** [기타] "필요하면 쓸 수 있게 자궁수축제를 카트에 준비해 뒀어요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"필요하면 쓸 수 있게 자궁수축제를 꺼내 준비해 뒀어요."**
- **8.1 빈칸** [안전] expired/loose/ready/cold (정답 ready) — expired — 만료 약을 준비해 둔 상태로 읽힘, loose — 말이 안 됨
  - 새 값: answer `ready` · ready / charted / billed / cold
- **8.1 decoy** [정답둘] `on the cart` — 'on the cart' — 'drawn up on the cart if we need them'이 ko에 그대로 맞음(같은 자리에 다른 장소 구를 넣어도 마찬가지라 주어 자리로)
  - 새 값: `The consent forms`
- **8.2 오답2** [정답둘] "자궁 긴장도가 부드러운데 — 지금 용량을 원하세요?" — '용량을 원하세요' — 약 이름만 빠져 같은 질문으로 읽힘
  - 새 값: **"자궁 긴장도가 부드러우면 출혈이 늘 수 있어요."**
- **8.3 오답2** [기타] "혹시 몰라서 여분의 라벨을 미리 붙여 둘게요." — 길이·틀 — 오답 둘 다 정답보다 김, 시제·틀까지 바뀜
  - 새 값: **"혹시 몰라서 여분의 라벨을 뽑고 있어요."**
- **8.4 빈칸** [기타] tone/weight/height/age (정답 tone) — height·age — 산후에 지켜볼 수 없는 말(동떨어짐)
  - 새 값: answer `tone` · tone / weight / diet / visitors

### 9. 신속 마취 유도 협조
- **9.0 오답2** [안전] "흡인이 켜졌고 윤상연골 압박도 점검됐어요." — '점검됐어요' — 준비됐어요와 가까움 + 위기 준비 완료를 점검으로(부탁하신 판정)
  - 새 값: **"흡인이 켜졌고 윤상연골은 목 앞에 만져져요."**
- **9.0 빈칸** [기타] loose/ready/empty/late (정답 ready) — loose·empty — 'cricoid pressure is empty' 말이 안 됨
  - 새 값: answer `ready` · ready / finished / released / late
- **9.0 decoy** [기타] `the stylet` — 'the stylet' — 어느 청크 자리에도 모양이 안 맞음
  - 새 값: `and the warm blanket`
- **9.1 오답2** [기타] "얼마나 가하고 언제 풀지 말씀해 주세요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"왜 가하고 언제 풀지 말씀해 주세요."**
- **9.2 오답1** [정답둘] "튜브와 블레이드는 오른쪽에 펼쳐져 있어요." — '펼쳐져 있어요' ≈ '세팅돼 있어요'
  - 새 값: **"튜브와 블레이드는 카트 위에 세팅돼 있어요."**
- **9.2 오답2** [정답둘] "튜브와 블레이드는 오른쪽 카트에 있어요." — '오른쪽 카트에' ≈ 'on your right'
  - 새 값: **"튜브는 한 치수 작은 것도 함께 준비해요."**
- **9.4 오답1** [정답둘] "말씀만 하시면 윤상연골 압박을 계속 가할게요." — '계속 가할게요' — 정답에 '계속'만 더함
  - 새 값: **"윤상연골 압박은 역류를 막는 데 써요."**
- **9.4 오답2** [안전] "말씀하시면 압박하기 전에 손을 올려요." — '말씀하시면 압박하기 전에 손을 올려요' — 신호 뒤에 준비가 와 압박이 늦음(preop-assessment 15.2와 같은 판정)
  - 새 값: **"말씀하시기 전에 윤상연골 자리를 짚어 둘게요."**
- **9.4 빈칸** [안전] ocular/cricoid/nasal/sacral (정답 cricoid) — ocular — 마취 유도 중 눈 압박은 안구심장반사(서맥)·각막 손상을 부르는 위험한 지시. nasal은 같은 분야의 틀린 부위라 통과(부탁하신 판정)
  - 새 값: answer `cricoid` · cricoid / nasal / sacral / tourniquet
- **order** [기타] swap23 경계 — 'on top of that'과 'for it'이 둘 다 1줄(유도)에 붙어 2·3줄을 바꿔도 말이 됨
  - 3줄: en "On top of those, suction is on and cricoid pressure is ready." · ko "그것들에 더해 흡인이 켜졌고 윤상연골 압박도 준비됐어요"
  - why: "도울 준비를 알리고, 그 유도를 위해 기구가 세팅됐다고 말하고, 그 기구에 더해 흡인과 압박도 준비됐다고 한 뒤, 압박을 언제 가하고 풀지 신호를 청해요. for it·those·it이 앞 줄을 가리켜요."

### 10. 시간 압박 무균 유지
- **10.1 오답2** [기타] "제가 차례로 가운과 장갑을 입혀 드릴게요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"제가 새 가운과 장갑을 입혀 드릴게요."**
- **10.2 오답1** [정답둘] "손 조심하세요 — 제가 가운을 잡아 드릴게요." — '가운을 잡아 드릴게요' — 가운을 잡아 주는 것이 곧 guide you in(정답 둘) + 길이
  - 새 값: **"손 조심하세요 — 제가 끈을 매 드릴게요."**

### 11. 다발성 외상 우선순위
- **11.0 오답1** [안전] "가장 큰 부종 부위부터 처치해요." — 출혈→부종 — 우선순위 기준(소견)을 바꿔 위험한 우선순위
  - 새 값: **"가장 큰 출혈 부위는 집도의가 정해요."**
- **11.0 오답2** [안전] "가장 큰 멍 부위부터 처치해요." — 출혈→멍 — 같은 이유
  - 새 값: **"출혈이 크면 혈압이 떨어져요."**
- **11.0 빈칸** [안전] swelling/bruising/itching/bleeding (정답 bleeding) — swelling·bruising·itching — 넣어 읽으면 '가장 큰 부종부터 처치' 같은 위험한 우선순위 지시
  - 새 값: answer `bleeding` · bleeding / light / power / heat
- **11.1 오답2** [정답둘] "두 부상 모두를 위해 기구를 단계별로 준비해 둘게요." — '기구를' ≈ '물품을' — supplies와 가르지 못함
  - 새 값: **"두 부상 물품을 단계별로 두면 집도의가 바로 집어요."**
- **11.2 오답2** [정답둘] "우선순위를 외쳐 주시면 그에 맞춰 세팅할게요." — '외쳐 주시면' ≈ 'Tell me'
  - 새 값: **"수술 시간을 말씀해 주시면 그에 맞춰 세팅할게요."**
- **11.3 오답2** [정답둘] "어디 부상을 먼저 처치해야 하나요?" — '어디 부상을' ≈ '어느 부상을' — 같은 질문
  - 새 값: **"어느 부상이 먼저 생겼나요?"**
- **11.4 오답2** [정답둘] "두 우선순위 모두를 위해 물품을 따로따로 준비해 둘게요." — '따로따로' — 두 우선순위마다 따로 갖추는 것이 곧 staged for both
  - 새 값: **"두 우선순위 모두를 위해 물품을 상자째 준비해 둘게요."**

### 12. 신속 수혈 조율
- **12.2 빈칸** [기타] totals/names/labels/prices (정답 totals) — prices — 장면 밖·가격 낱말 되풀이
  - 새 값: answer `totals` · totals / names / labels / rooms
- **12.2 tag** [기타] '총계 호창' — 호창은 쓰지 않는 말
  - 새 값: `총계 알림`
- **12.3 빈칸** [기타] size/brand/time/cost (정답 time) — size·brand·cost — 'the size it went in' 문법으로 걸러짐 → 빈칸을 unit으로
  - 새 값: answer `unit` · unit / sponge / needle / drape
- **order** [기타] swap34 자연스러움 — 'Check my totals against that record anytime'이 3줄 앞에 와도 말이 됨(+ note '호창'은 쓰지 않는 말 → 알림)
  - 3줄: note `알림`
  - 4줄: en "If any total I call sounds off, check it against that record." · ko "제가 부른 총계가 이상하면 그 기록과 맞춰 보세요"
  - why: "들어가는 팩을 추적하고, 팩마다 들어간 시각을 기록하고, 그 기록에서 총계를 소리 내어 말하고, 부른 총계가 이상하면 기록과 맞춰 보라고 해요. each one·that record·any total I call이 앞 줄을 가리켜요."

### 13. 태아 곤란 신속 분만
- **13.0 오답2** [기타] "태아 심박수가 떨어지고 있어요 — 저는 손을 씻었어요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"태아 심박수가 떨어지고 있어요 — 저는 소독했어요."**
- **13.1 오답2** [안전] "카트와 신생아팀이 대기 중이에요." — 워머→카트 — 위기 보고의 장비를 바꿈
  - 새 값: **"워머는 미리 켜서 데워 둬요."**
- **13.3 오답2** [정답둘] "다시 신생아팀을 요청할게요." — '다시 신생아팀을 요청할게요' — 정답 행동 그대로(지금 요청)
  - 새 값: **"신생아팀이 아기를 바로 받아요."**
- **13.3 빈칸** [정답둘] tray/room/floor/team (정답 team) — tray — 신생아 소생 트레이 요청도 이 장면에서 맞음(정답 둘에 가까움)
  - 새 값: answer `team` · team / chart / room / floor
- **13.4 오답1** [정답둘] "심박수가 두 번 떨어졌어요 — 지금 분만합시다." — '두 번 떨어졌어요' = dropped again
  - 새 값: **"심박수가 다시 떨어졌어요 — 태아가 위험해요."**
- **13.4 오답2** [안전] "심박수가 다시 떨어졌어요 — 분만 전에 준비해요." — '분만 전에 준비해요' — 위기의 분만 결정을 막연한 준비로 늦춤
  - 새 값: **"심박수가 다시 떨어졌어요 — 분만하게 메스를 건넬게요."**

### 14. 응급 검체·계수 관리
- **14.0 오답2** [기타] "검체가 들어올 때마다 표시하고 있어요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"거즈가 나올 때마다 표시하고 있어요."**
- **14.0 decoy** [안전] `as it dries` — 'as it dries' — 조립하면 검체를 마를 때 표시(표시 지연·검체 건조)
  - 새 값: `each drape`
- **14.1 오답1** [정답둘] "속도가 빨라도 진행 중인 계수는 저장되고 있어요." — '저장되고' ≈ '기록되고'(documented)
  - 새 값: **"속도가 빨라도 진행 중인 계수는 소리로 확인되고 있어요."**
- **14.1 빈칸** [기타] despite/during/after/before (정답 despite) — during·after·before the pace — 말이 안 돼 걸러짐 → 빈칸을 Running으로
  - 새 값: answer `Running` · Running / Final / Closing / Annual
- **14.2 오답1** [안전] "봉합 전에 전체 재고 확인을 할게요." — 대조→재고 확인 — 계수 대조를 다른 확인으로(체내 잔류)
  - 새 값: **"봉합 전 대조가 끝나야 집도의가 닫아요."**
- **14.2 오답2** [안전] "봉합 전에 전체 포장 확인을 할게요." — 대조→포장 확인 — 같은 이유
  - 새 값: **"봉합 전에 대조 결과를 크게 불러요."**
- **14.3 오답2** [기타] "검체가 들어오는 순간마다 표시할게요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"검체가 나오는 순간마다 담을게요."**
- **14.3 빈칸** [기타] moment/reason/place/size (정답 moment) — reason·place·size — 'the reason it comes off' 문법으로 걸러짐 → 빈칸을 label로
  - 새 값: answer `label` · label / weigh / photograph / measure
- **14.4 오답1** [안전] "속도와 상관없이 검체 목록을 계속 기록합시다." — 계수→검체 목록 — 계수 기록을 다른 기록으로(빠뜨린 확인)
  - 새 값: **"속도가 빨라질수록 계수가 틀리기 쉬워요."**
- **14.4 오답2** [안전] "속도와 상관없이 시각을 계속 기록합시다." — 계수→시각 — 같은 이유
  - 새 값: **"속도와 상관없이 계수가 끝나면 서명합시다."**
- **14.4 빈칸** [기타] table/tray/pace/price (정답 pace) — table·tray — 말이 안 됨, price — 'no matter the price' 관용구·되풀이 → 빈칸을 documented로
  - 새 값: answer `documented` · documented / private / locked / sealed

### 15. 개복 중 심정지
- **15.0 오답2** [정답둘] "맥박이 없어요 — 다시 흉부압박을 시작할게요." — '다시 … 시작할게요' — 정답 행동 그대로(부탁하신 판정)
  - 새 값: **"맥박이 없어요 — 압박이 뇌로 피를 보내요."**
- **15.0 빈칸** [정답둘] again/first/twice/now (정답 now) — again·first — 'starting compressions first'(압박 먼저 CAB)·again도 성립(정답 둘), now는 가르치는 낱말이 아님 → 빈칸을 pulse로
  - 새 값: answer `pulse` · pulse / line / count / tape
- **15.1 오답2** [기타] "응급 카트가 열렸고 에피네프린도 뽑아 뒀어요." — 길이 — 오답 둘 다 정답보다 김
  - 새 값: **"응급 카트가 왔고 에피네프린도 꺼내 뒀어요."**
- **15.1 빈칸** [정답둘] capped/drawn/wasted/expired (정답 drawn) — capped — 뽑아서 뚜껑 닫아 둔 상태라 drawn과 같음(정답 둘), expired — 8.1과 같은 이유(만료 약을 준비해 둔 상태)
  - 새 값: answer `drawn` · drawn / ordered / wasted / spilled
- **15.1 why** [기타] '짧은 수동태 두 개' — is here는 수동태가 아님
  - 새 값: "카트 도착(is here)과 약 준비(is drawn)를 짧은 두 절로 이어 보고해요. 코드에서 현재 상태를 빠르게 공유하는 방식이에요."
- **15.2 오답1** [정답둘] "코드 타이밍을 재면서 에피네프린 시각을 말할게요." — '에피네프린 시각을 말할게요' — 투약 시각은 코드 타이밍의 일부(정답 둘) + 길이
  - 새 값: **"코드 타이밍은 맥박이 없어진 때부터 재요."**
- **15.3 오답2** [정답둘] "흉부압박이 이어지고 있어요 — 누가 지금 코드를 불러 주세요." — '이어지고 있어요' ≈ '시작됐어요'
  - 새 값: **"흉부압박이 시작됐어요 — 코드는 방송으로 불러요."**
- **15.3 why** [기타] 'someone을 써서 … 현장 말투' — 위기 의사소통(폐쇄 루프)에서 someone은 아무도 안 부르는 원인이라 칭찬하면 안 됨
  - 새 값: "someone은 현장에서 자주 들리지만, 코드에서는 누가 부를지 이름이나 역할로 지목해야 확실히 불려요. now로 지체 없이 부르라는 급함을 전해요."
- **15.4 오답2** [안전] "에피네프린을 뽑으면서 압박 횟수를 계속 셀게요." — 타이밍→압박 횟수 — 심정지에서 맡은 역할(시간 관리)을 바꿈 + 15.2 오답과 되풀이
  - 새 값: **"에피네프린은 코드 중에 3~5분마다 한 번씩 줘요."**
- **15.4 빈칸** [기타] hang/pour/freeze/draw (정답 draw) — pour·freeze — 동떨어짐, hang — 심정지에 에피네프린 점적을 거는 것으로 읽힘
  - 새 값: answer `draw` · draw / order / count / stock

### 16. 산모 대량 출혈 위기
- **16.0 오답2** [안전] "산과 대량수혈 체크리스트를 개시하고 있어요." — 프로토콜→체크리스트 — 위기 호출(MTP 개시)을 다른 것으로
  - 새 값: **"산과 대량수혈 프로토콜은 혈액을 묶음으로 보내요."**
- **16.1 오답1** [기타] "자궁수축제는 투여됐고 혈액을 먼저 요청하고 있어요." — '더→먼저' 바꿈 3회 되풀이(6.2·16.1·18.3) + 오답 둘 다 정답보다 김
  - 새 값: **"자궁수축제는 투여됐고 혈액은 쿨러에 담겨요."**
- **16.1 빈칸** [정답둘] out/off/in/over (정답 in) — out — 'Uterotonics are out'(다 떨어짐)도 혈액 요청 이유로 성립
  - 새 값: answer `in` · in / down / off / over
- **16.1 decoy** [정답둘] `for more sutures` — 'for more sutures' — 산후 출혈에서 봉합사 요청은 해도 맞는 다른 행동
  - 새 값: `for more pillows`
- **16.2 오답1** [안전] "진행하면서 추정 실혈량과 흡인통을 추적할게요." — 팩→흡인통 — 추적 대상을 바꿈(흡인통은 EBL 재료라 겹침)
  - 새 값: **"진행하면서 추정 실혈량과 팩 수를 마취과에 알릴게요."**
- **16.2 오답2** [안전] "진행하면서 추정 실혈량과 소변량을 추적할게요." — 팩→소변량 — 추적 대상을 옆 지표로(ICU 실패 1)
  - 새 값: **"추정 실혈량과 팩 수로 다음 수혈을 정해요."**
- **16.2 빈칸** [정답둘] units/forms/tags/orders (정답 units) — tags — 팩마다 붙은 태그를 추적하는 것이 곧 팩 추적(정답 둘), forms·orders — 수혈 서류·처방 추적도 실제 업무(부탁하신 판정: forms·tags 실패)
  - 새 값: answer `units` · units / shifts / rooms / pagers
- **16.3 tag** [기타] '혈액 도착' — en은 sending(보내는 중)
  - 새 값: `혈액 발송`
- **16.4 오답1** [안전] "자궁수축제를 요청하면서 쿨러 하나하나를 추적하고 있어요." — 팩→쿨러 — 추적 대상을 바꿈
  - 새 값: **"자궁수축제와 수혈은 산후 출혈에서 보통 함께 진행해요."**
- **16.4 오답2** [안전] "자궁수축제를 요청하면서 팩 하나하나를 표시하고 있어요." — 추적→표시 — 추적을 다른 일로
  - 새 값: **"자궁수축제를 요청하고 나서 팩 수를 소리 내어 불러요."**
- **16.4 빈칸** [정답둘] uterotonics/sutures/retractors/clamps (정답 uterotonics) — sutures·retractors·clamps — 산후 출혈 수술에서 실제로 부르는 기구(정답 둘)
  - 새 값: answer `uterotonics` · uterotonics / antacids / laxatives / vitamins
- **order** [기타] swap34 자연스러움 — 'track every unit that arrives' 뒤에 'calling for even more units beyond those'가 그대로 이어짐
  - 2줄: note `발송`
  - 4줄: en "I'll track EBL and every unit, including the extra ones I called for." · ko "추가로 요청한 팩까지 추정 실혈량과 팩을 모두 추적할게요"
  - why: "프로토콜을 개시하고, 혈액은행이 팩을 보내는 상황을 알리고, 그 팩 말고도 더 요청하고, 추가로 요청한 팩까지 추적해요. for it·beyond those·the extra ones I called for가 앞 줄을 가리켜요."

### 17. 신생아 소생 지원
- **17.0 오답2** [안전] "아기가 저울 위에 있어요 — 소생술을 시작할게요." — 워머→저울 — 저울 위 소생(체온 저하) — 장비·장소 바꿈
  - 새 값: **"아기가 워머 위에 있어요 — 워머가 체온을 지켜요."**
- **17.0 decoy** [안전] `on the table` — 'on the table' — 조립하면 테이블 위 소생(워머 대신) + table 몰림
  - 새 값: `Mom's`
- **17.1 오답2** [안전] "산소마스크는 준비됐고 흡인도 세팅됐어요." — 백밸브→산소마스크 — 양압 환기 장비를 바꿈
  - 새 값: **"백밸브마스크는 아기 얼굴에 맞는 크기로 써요."**
- **17.2 빈칸** [기타] adult/neonatal/dental/geriatric (정답 neonatal) — adult·dental·geriatric — 7.1·13.1과 같은 묶음 세 번째
  - 새 값: answer `neonatal` · neonatal / cleaning / security / pharmacy
- **17.3 오답1** [정답둘] "백밸브마스크를 가져오고 튜빙을 세팅할게요." — 흡인→튜빙 — 흡인 세팅의 일부만 말해 정답과 겹침
  - 새 값: **"백밸브마스크를 가져오기 전에 크기를 골라요."**
- **17.3 오답2** [안전] "산소마스크를 가져오고 흡인을 세팅할게요." — 백밸브→산소마스크 — 17.1과 같은 이유
  - 새 값: **"백밸브마스크와 흡인은 워머 옆에 둬요."**
- **17.3 빈칸** [기타] borrow/wash/hide/bring (정답 bring) — hide — 동떨어짐, borrow — 0.2와 되풀이
  - 새 값: answer `bring` · bring / fold / wash / label
- **17.3 decoy** [기타] `mark the chart` — 'mark the chart' — 어느 청크 자리에도 모양이 안 맞음
  - 새 값: `the baby scale`

### 18. 파종성 응고장애
- **18.0 오답1** [안전] "곳곳에서 흘러나오고 있어요 — 이건 DIC예요." — 배어 나오다→흘러나오다 — 응고장애의 스며 나옴을 수술 출혈로(소견 바꿈)
  - 새 값: **"곳곳에서 배어 나오고 있어요 — 제제는 처방대로 받아요."**
- **18.0 오답2** [안전] "곳곳에서 배어 나오고 있어요 — 이건 감염이에요." — DIC→감염 — 진단을 바꿔 제제 요청이 늦음(부탁하신 판정: 실패)
  - 새 값: **"곳곳에서 배어 나오고 있어요 — 마취과에 알려요."**
- **18.1 오답1** [정답둘] "지금 FFP와 혈소판, 크라이오가 모자라요." — '모자라요' — 필요해요와 뜻이 같음(부탁하신 판정: 실패)
  - 새 값: **"FFP와 혈소판, 크라이오가 오면 바로 걸게요."**
- **18.1 오답2** [안전] "지금 FFP와 혈소판, 크라이오가 쓰이고 있어요." — '쓰이고 있어요' — 이미 들어가고 있다는 잘못된 안심(요청이 빠짐)
  - 새 값: **"FFP와 혈소판, 크라이오는 지혈을 도와요."**
- **18.1 빈칸** [기타] platelets/gloves/forms/lids (정답 platelets) — gloves·lids·forms — 장면과 동떨어짐(제제 자리)
  - 새 값: answer `platelets` · platelets / vitamins / antacids / iron
- **18.1 decoy** [정답둘] `a warmer` — 'a warmer' — 대량 수혈에 혈액 가온기는 실제로 필요(해도 맞는 것)
  - 새 값: `a stool`
- **18.2 빈칸** [기타] tickets/meals/products/rooms (정답 products) — meals·tickets·rooms — 동떨어짐
  - 새 값: answer `products` · products / reports / invoices / surveys
- **18.3 오답1** [기타] "혈액은행에 전화해서 혈소판을 먼저 요청할게요." — '더→먼저' 되풀이(16.1과 같은 판정)
  - 새 값: **"혈소판은 혈액은행에서 실온으로 보내요."**
- **18.3 빈칸** [기타] request/inspect/price/wrap (정답 request) — price — 가격 되풀이·동떨어짐
  - 새 값: answer `request` · request / inspect / store / wrap
- **18.4 오답1** [안전] "곳곳에서 흘러나오고 있어요 — 지금 FFP와 크라이오가 필요해요." — 배어 나오다→흘러나오다 — 18.0과 같은 이유
  - 새 값: **"곳곳에서 배어 나오고 있어요 — 크라이오에는 피브리노겐이 많아요."**
- **18.4 오답2** [정답둘] "곳곳에서 배어 나오고 있어요 — 지금 FFP와 크라이오가 모자라요." — '모자라요' — 필요해요와 뜻이 같음(부탁하신 판정: 실패)
  - 새 값: **"곳곳에서 배어 나오고 있어요 — FFP는 해동하는 데 시간이 걸려요."**
- **18.4 빈칸** [정답둘] iron/saline/cryo/albumin (정답 cryo) — saline — 대량 출혈에서 수액도 실제로 요청(정답 둘에 가까움)
  - 새 값: answer `cryo` · cryo / iron / albumin / vitamins
- **order** [기타] swap12 자연스러움 — 'I need FFP… now. She's oozing everywhere — this is DIC.'(요청 뒤 이유)도 그대로 성립
  - 2줄: en "For that, I need FFP, platelets, and cryo now." · ko "그래서 지금 FFP와 혈소판, 크라이오가 필요해요"
  - why: "출혈을 알리고, 그 DIC 때문에 필요한 제제를 나열하고, 그 전체를 혈액은행에 요청하고, 혈액은행이 그 제제를 준비 중이라고 확인해요. For that·all of that·those products가 앞 줄을 가리켜요."

### 19. 손상통제 수술 전환
- **19.0 오답2** [안전] "세척하고 임시 봉합을 합시다." — 패킹→세척 — 손상통제의 지혈 처치를 바꿈
  - 새 값: **"임시 봉합은 시간을 줄여요."**
- **19.0 빈칸** [정답둘] irrigate/retract/drape/pack (정답 pack) — irrigate — 임시 봉합 전 세척도 실제 절차(정답 둘)
  - 새 값: answer `pack` · pack / measure / retract / drape
- **19.1 오답1** [정답둘] "중환자실에서 안정시키고 다시 돌아올게요." — '안정시키고' ≈ '소생시키고'
  - 새 값: **"중환자실 소생은 보통 하루 이틀 걸려요."**
- **19.2 decoy** [정답둘] `the transport monitor` — 'the transport monitor' — 중환자실 이송 모니터 준비는 해도 맞는 행동
  - 새 값: `the visitor list`
- **19.3 오답1** [안전] "임시 봉합을 하고 엘리베이터로 옮깁시다." — 중환자실→엘리베이터 — 환자가 가는 곳(치료 수준)을 바꿈(부탁하신 판정: 실패)
  - 새 값: **"임시 봉합을 하고 중환자실에 미리 알립시다."**
- **19.3 오답2** [안전] "임시 봉합을 하고 대기실로 옮깁시다." — 중환자실→대기실 — 위기 환자를 비임상 장소로(부탁하신 판정: 실패)
  - 새 값: **"임시 봉합은 배를 덮어 두는 거예요."**
- **19.3 decoy** [안전] `to the lounge` — 'to the lounge' — 조립하면 위기 환자를 휴게실로(부탁하신 판정과 같은 이유)
  - 새 값: `a temporary badge`
- **19.4 오답1** [안전] "지금 패킹하고 곧 다시 와서 봉합할게요." — 나중에→곧 — 재수술 시점 바꿈
  - 새 값: **"지금 패킹하면 출혈이 우선 잡혀서 시간을 벌어요."**
- **19.4 오답2** [안전] "지금 패킹하고 나중에 다시 와서 소독할게요." — 봉합→소독 — 처치 바꿈
  - 새 값: **"지금 패킹하고 남긴 패드 수를 적어 둘게요."**

### 20. 다중 위기 동시 대응
- **20.0 오답1** [정답둘] "선생님이 머리를 맡으시면 저는 수혈을 관리할게요." — '머리를 맡으시면' — take the head = 기도를 맡다(정답 둘)
  - 새 값: **"선생님이 기도를 맡으시면 저는 수혈 줄을 채울게요."**
- **20.0 오답2** [안전] "선생님이 기도를 맡으시면 저는 수액을 관리할게요." — 수혈→수액 — 혈액 제제를 바꿈(부탁하신 판정: 실패)
  - 새 값: **"대량 수혈 중에는 칼슘이 떨어지기 쉬워요."**
- **20.2 오답2** [정답둘] "상황이 바뀌는 대로 방 전체에 계속 알릴게요." — '방 전체에' ≈ '팀 전체에'
  - 새 값: **"상황이 바뀌면 바뀐 내용을 복창받을게요."**
- **20.2 빈칸** [기타] whole/half/new/night (정답 whole) — half — 'the half team' 문법으로 걸러짐
  - 새 값: answer `whole` · whole / new / night / cleaning
- **20.3 오답1** [안전] "선생님이 출혈을 처치하시는 동안 저는 산소를 관리할게요." — 기도→산소 — 처치 바꿈(산소는 기도 관리의 일부라 겹치기도 함, 부탁하신 판정: 실패)
  - 새 값: **"출혈이 많아 의식이 떨어지면 기도가 쉽게 막혀요."**
- **20.3 오답2** [안전] "선생님이 출혈을 처치하시는 동안 저는 수액을 관리할게요." — 기도→수액 — 처치 바꿈(부탁하신 판정: 실패)
  - 새 값: **"기도와 출혈을 한 사람이 다 맡으면 둘 다 늦어지기 쉬워요."**
- **20.4 빈칸** [안전] roles/names/colors/labels (정답 roles) — labels — 넣어 읽으면 '상황 따라 라벨을 바꾸자'(라벨 바꿔 달기는 환자 안전 사고)
  - 새 값: answer `roles` · roles / names / colors / gowns
- **order** [안전] swap23 경계 — 'We'll swap those roles'가 1줄(배정) 바로 뒤에도 붙음. 또 'swap those roles'는 간호사가 기도를 넘겨받는 것으로 읽힘(기도 관리는 마취과 몫) → 다시 배정으로
  - 3줄: en "As the situation changes, we'll reassign those two roles." · ko "상황이 바뀌는 대로 그 두 역할을 다시 배정할게요"
  - 4줄: en "I'll keep the whole team updated on each reassignment." · ko "다시 배정할 때마다 팀 전체에 계속 알릴게요"
  - why: "손마다 역할을 배정하자고 하고, 배정된 두 역할로 서로의 몫을 말하고, 그 두 역할을 상황에 따라 다시 배정하겠다고 하고, 그때마다 팀에 알려요. With roles assigned·those two roles·each reassignment가 앞 줄을 가리켜요."

## 문장별 판정 (105문장 전수 — 통과/고침)

| 문장 | en | 판정 |
|---|---|---|
| 0.0 | Let's get the room set up as fast as we can. | 고침: 오답2 |
| 0.1 | I'm opening the basic emergency setup now. | 통과 |
| 0.2 | Tell me what you need first and I'll grab it. | 통과 |
| 0.3 | We need everything ready in a few minutes. | 통과 |
| 0.4 | I'll bring extra basins and drapes right away. | 통과 |
| 1.0 | Opening the emergency lap set now. | 통과 |
| 1.1 | Major instruments are up and counted. | 통과 |
| 1.2 | What else do you want opened for backup? | 고침: 오답1 |
| 1.3 | I'll open the backup tray in case we need it. | 고침: 빈칸, why |
| 1.4 | The major set is fully counted and ready to go. | 통과 |
| 2.0 | I've got two suctions on and ready. | 통과 |
| 2.1 | Extra canisters and tubing are standing by. | 고침: 빈칸 |
| 2.2 | Say the word and I'll swap them out fast. | 고침: 오답2, 빈칸 |
| 2.3 | I'll set up an extra suction now. | 고침: 빈칸 |
| 2.4 | Say the word and we'll have two more ready. | 고침: 빈칸 |
| 3.0 | We have units in the cooler right here. | 통과 |
| 3.1 | Blood bank can send more within minutes. | 고침: 오답1 |
| 3.2 | I'll keep a line open with the blood bank. | 고침: 오답1, 오답2, decoy |
| 3.3 | I'll check the cooler and count the units again. | 고침: 오답2, 빈칸 |
| 3.4 | Let's keep the blood bank updated as units go in. | 고침: 빈칸 |
| 4.0 | Quick baseline count before we open. | 고침: why |
| 4.1 | Sponges and sharps are counted and recorded. | 고침: 빈칸 |
| 4.2 | We'll reconcile everything at closing. | 고침: 오답1, 오답2, decoy |
| 4.3 | I'll get the count started even though this is an emergency. | 고침: 빈칸 |
| 4.4 | We'll double check the sponge count before we close. | 고침: 오답1, 오답2, decoy |
| 5.0 | I'm paging additional staff to the room. | 통과 |
| 5.1 | We need a second scrub and another circulator. | 통과 |
| 5.2 | Anesthesia backup is on the way. | 고침: 오답2, 빈칸, decoy |
| 5.3 | Let's page another circulator and get anesthesia backup in here. | 통과 |
| 5.4 | I'll bring in the extra staff we need for this room. | 고침: 오답2, 빈칸 |
| 6.0 | The abdomen is full of blood — suctioning now. | 고침: 오답2 |
| 6.1 | Handing you lap pads to pack the quadrants. | 통과 |
| 6.2 | I'll call for more blood to the room. | 고침: 오답1, 빈칸, decoy |
| 6.3 | Keep the suction going while I pack the quadrants. | 고침: 빈칸 |
| 6.4 | The abdomen is full and we need more blood now. | 고침: 오답1, 오답2, 빈칸, decoy |
| 7.0 | The infant warmer is on and ready. | 고침: 빈칸 |
| 7.1 | Neonatal resuscitation supplies are set up. | 고침: 오답2 |
| 7.2 | Is the NICU team in the room yet? | 고침: 오답2 |
| 7.3 | I'll page the NICU team to come down now. | 고침: 오답2, 빈칸 |
| 7.4 | Let's bring an extra warmer just in case. | 고침: 빈칸 |
| 8.0 | I'm watching closely for postpartum hemorrhage. | 고침: 오답2 |
| 8.1 | Uterotonics are drawn up and ready if we need them. | 고침: 오답1, 빈칸, decoy |
| 8.2 | Her tone is soft — do you want oxytocin now? | 고침: 오답2 |
| 8.3 | I'm drawing up an extra dose just in case. | 고침: 오답2 |
| 8.4 | Let's keep watching her tone after delivery. | 고침: 빈칸 |
| 9.0 | Suction is on and cricoid pressure is ready. | 고침: 오답2, 빈칸, decoy |
| 9.1 | Tell me when to apply and when to release. | 고침: 오답2 |
| 9.2 | Tube and blade are set on your right. | 고침: 오답1, 오답2 |
| 9.3 | I'm ready to help with the induction now. | 통과 |
| 9.4 | Say the word and I'll apply cricoid pressure. | 고침: 오답1, 오답2, 빈칸 |
| 10.0 | Even in a rush, we protect the sterile field. | 통과 |
| 10.1 | Let me gown and glove you quickly. | 고침: 오답2 |
| 10.2 | Watch your hands — I'll guide you in. | 고침: 오답1 |
| 10.3 | We protect the field even when we rush. | 통과 |
| 10.4 | I'll gown you quickly so we can start. | 통과 |
| 11.0 | The biggest bleeding source comes first. | 고침: 오답1, 오답2, 빈칸 |
| 11.1 | I'll have supplies staged for both injuries. | 고침: 오답2 |
| 11.2 | Tell me your priority and I'll set up for it. | 고침: 오답2 |
| 11.3 | Which injury needs us first? | 고침: 오답2 |
| 11.4 | I'll keep supplies staged for both priorities. | 고침: 오답2 |
| 12.0 | I'm tracking every unit as it goes in. | 통과 |
| 12.1 | Next cooler is ready when this one's done. | 통과 |
| 12.2 | I'll call out totals as we transfuse. | 고침: 빈칸, tag |
| 12.3 | I'll record every unit and the time it went in. | 고침: 빈칸 |
| 12.4 | Tell me the total units so far. | 통과 |
| 13.0 | Fetal heart rate is dropping — I'm ready to go. | 고침: 오답2 |
| 13.1 | Warmer and neonatal team are standing by. | 고침: 오답2 |
| 13.2 | Everything you need to deliver is right here. | 통과 |
| 13.3 | I'll call for the neonatal team right now. | 고침: 오답2, 빈칸 |
| 13.4 | Her heart rate dropped again — let's deliver now. | 고침: 오답1, 오답2 |
| 14.0 | I'm labeling each specimen as it comes off. | 고침: 오답2, decoy |
| 14.1 | Running count is documented despite the pace. | 고침: 오답1, 빈칸 |
| 14.2 | We'll do a full reconciliation before closing. | 고침: 오답1, 오답2 |
| 14.3 | I'll label every specimen the moment it comes off. | 고침: 오답2, 빈칸 |
| 14.4 | Let's keep the count documented no matter the pace. | 고침: 오답1, 오답2, 빈칸 |
| 15.0 | No pulse — I'm starting compressions now. | 고침: 오답2, 빈칸 |
| 15.1 | Crash cart is here and epinephrine is drawn. | 고침: 오답2, 빈칸, why |
| 15.2 | I'll run the code timing and call it out. | 고침: 오답1 |
| 15.3 | Compressions are started — someone call the code now. | 고침: 오답2, why |
| 15.4 | I'll draw epinephrine and keep timing the code. | 고침: 오답2, 빈칸 |
| 16.0 | Activating the OB massive transfusion protocol. | 고침: 오답2 |
| 16.1 | Uterotonics are in and I'm calling for more blood. | 고침: 오답1, 빈칸, decoy |
| 16.2 | I'll track EBL and units as we go. | 고침: 오답1, 오답2, 빈칸 |
| 16.3 | Blood bank is sending units for the massive transfusion. | 고침: tag |
| 16.4 | I'm calling for uterotonics and tracking every unit. | 고침: 오답1, 오답2, 빈칸 |
| 17.0 | Baby's on the warmer — starting resuscitation. | 고침: 오답2, decoy |
| 17.1 | Bag-mask ready and suction is set. | 고침: 오답2 |
| 17.2 | Is the neonatal team taking over now? | 고침: 빈칸 |
| 17.3 | I'll bring the bag-mask and set up suction. | 고침: 오답1, 오답2, 빈칸, decoy |
| 17.4 | The neonatal team is ready to take over now. | 통과 |
| 18.0 | She's oozing everywhere — this is DIC. | 고침: 오답1, 오답2 |
| 18.1 | I need FFP, platelets, and cryo now. | 고침: 오답1, 오답2, 빈칸, decoy |
| 18.2 | Blood bank is preparing the products. | 고침: 빈칸 |
| 18.3 | I'll call blood bank and request more platelets. | 고침: 오답1, 빈칸 |
| 18.4 | She's oozing from everywhere — we need FFP and cryo now. | 고침: 오답1, 오답2, 빈칸 |
| 19.0 | Let's pack and do a temporary closure. | 고침: 오답2, 빈칸 |
| 19.1 | We'll resuscitate in ICU and come back. | 고침: 오답1 |
| 19.2 | I have the temp closure supplies ready. | 고침: decoy |
| 19.3 | Let's do a temporary closure and get her to ICU. | 고침: 오답1, 오답2, decoy |
| 19.4 | We'll pack now and come back to close later. | 고침: 오답1, 오답2 |
| 20.0 | You take the airway, I'll manage the transfusion. | 고침: 오답1, 오답2 |
| 20.1 | Let's assign a role to each pair of hands. | 통과 |
| 20.2 | I'll keep the whole team updated as it changes. | 고침: 오답2, 빈칸 |
| 20.3 | I'll manage the airway while you handle the bleeding. | 고침: 오답1, 오답2 |
| 20.4 | We'll change roles as the situation changes. | 고침: 빈칸 |

| order | 판정 |
|---|---|
| S0 응급 세팅 신속 준비 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S1 응급 기구 세트 개방 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S2 대량 흡인 준비 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S3 혈액 확보 확인 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S4 신속 초기 계수 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S5 긴급 팀 소집 | 고침 |
| S6 복강 대량 출혈 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S7 응급 제왕 신생아 준비 | 고침 |
| S8 제왕 산모 출혈 감시 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S9 신속 마취 유도 협조 | 고침 |
| S10 시간 압박 무균 유지 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S11 다발성 외상 우선순위 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S12 신속 수혈 조율 | 고침 |
| S13 태아 곤란 신속 분만 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S14 응급 검체·계수 관리 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S15 개복 중 심정지 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S16 산모 대량 출혈 위기 | 고침 |
| S17 신생아 소생 지원 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S18 파종성 응고장애 | 고침 |
| S19 손상통제 수술 전환 | 통과(인접 교환 3쌍 모두 앞 줄 가리킴으로 막힘) |
| S20 다중 위기 동시 대응 | 고침 |
