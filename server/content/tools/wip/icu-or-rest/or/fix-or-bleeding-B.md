# or-bleeding — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥·되풀이 상한)

대상: `or-bleeding.yaml`(A·B 합친 파일, 수정하지 않음) · 문장 105 · 상황 21
**새 값 전부를 넣은 사본:** `/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/_reviewB_or-bleeding_after.yaml`
→ `verify_one_theme.py or …_after.yaml` **위반 0 · 경고 0 · 통과**. 바뀐 것은 문장 `distractorsKo`·`decoy`·`blank`·`why` 2개와 order 4장뿐이고, 단어·뉘앙스·문장 en/ko/chunks는 원본 그대로입니다(스크립트로 대조).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 말투의 이유를 잘 설명. 사실 문제 2(12-3 "프라이밍 끝나면 반환"을 안전 순서로, 5-1 "대기 중" ↔ en은 이미 흐르는 중) |
| 2 빈칸 | 3 | 정답 둘 10(give·drop·bag·labeled·stapler·waiting·bank·dark·hypotensive·hypotension), 위험한 조합 4(맥박이 있는데 압박 2·slowly·after), 동의어 셋 묶음 4, 문법으로 걸러짐 3, 동떨어짐 5 |
| 3 decoy | 4 | 모양은 고르게 나뉨. 조립하면 ko에 맞는 것 3(to turn·open·and sign it), 낱말 몰림(gown 5·pump 5·ice 4), 동떨어짐 2(weather·window) |
| 4 distractorsKo | 2 | 안전 22, 정답 둘 15, 둘 다 표지 틀 2, 반대말 뒤집기 2, 되풀이 상한 초과(열다 10·보다 8·짚다 6·올리다 6·전화 준비 6·"EBL이 변한다" 6) |
| 5 order | 4 | 21장 중 2↔3 교환이 자연스러운 것 3(S0·S11·S13), S5 "Both IVs" 뒤에 "a second line" 모순. 머리말 ko는 모두 맞음 |
| 6 tag·icon | 5 | 상황 안에서 일관, 아이콘도 뜻과 맞음. 고칠 것 없음 |
| 8 파일럿 갈래 | 3 | 빈칸 동떨어짐·동의어 셋, 위기 문장의 옆 일 오답, "같은 상황 다른 문장 정답"을 오답으로 쓴 것(11-0) |

## 심각한 문제
1. **보고·판단 문장의 오답이 "보고하는 대신 다시 알아내기"** — 6-0·6-1·8-0·8-3·9-0·9-1·9-3·13-3·14-0·14-1·14-3(11문장). 악화 장면(출혈 추세·저혈량·관류 저하)에서 이미 본 값을 "~인지 가리려고/따지려고/알려고 + 재확인"하는 말은 보고를 늦추는 행동입니다. 9-0("모니터를 다시 맞춰요")·9-3("커프를 다시 감아요")은 수치를 인공물 탓으로 돌려 재측정하는 전형적 지연입니다.
2. **위기 문장의 옆 일·처치 바꿈** — 15-3(혈액 요청 → 혈액 데우기), 16-3(수액 주기 → 수액 데우기), 17-4(전화 → 양 계산), 16-4(조절 소식을 알려 달라 → 기록해 달라), 20-1("압박하려고 손을 올릴게요" — 맥박 소실 조건을 빼고 지금 압박 자세).
3. **빈칸이 맥박 있는 환자의 압박을 만든다** — 20-1(find/keep/feel the pulse → I'm starting compressions)·20-3(gain/hold/read). 빈칸을 `pulse`로 옮김.
4. **출혈 경고를 다른 위험으로 바꾼 0-3**(통증·시간) — 저작자 판정 요청대로 실패.
5. 사실 오류: 14-0 X2 인과 뒤집힘(소변이 줄어서 콩팥 혈류가 준다고 함), 14-3 X2 "소변량이 낮으면 수액을 늘려요"(처방 없는 증량을 일반 사실처럼), 5-4 X2 "두 번째 라인에 약을 걸어요".

## 판정 기준 (이 검토에서 쓴 규칙 — 수정 담당도 이 기준으로)
- **보고·판단 문장의 앞 단계 오답:** 종속절에 **보고 행위**(알리려고·전하려고·말하려고·보고하려고)를 남기고, 주절은 보고 직전의 준비(숫자 모으기·표로 옮기기·화면 띄우기)로 씁니다. 한 상황에 이 틀이 둘 넘게 몰리면 하나는 en과 다른 참인 사실로 바꿉니다(그 문장은 오답 둘 다 사실이 됨 — 보고 문장엔 안전하게 바꿀 세부가 없어 허용). 이미 본 값을 "~인지 가리려고/따지려고/파악하려고/가늠하려고/알려고"로 다시 알아내는 말, 재측정·재보정은 실패입니다(악화 장면에서 보고 지연). 수치·출처·시간 범위를 바꾸면 잘못된 보고가 되니 바꾸지 않습니다.
- **참인 사실 오답:** en이 말하지 않은 다른 사실이고, 같은 상황 다른 문장의 정답과 겹치지 않으면 통과. en의 내용을 일반화한 것(9-0 "혈압이 떨어지면 심박수는 올라가요")·정답 행위를 품은 것(11-4 "방을 데워요")은 정답 둘.
- **둘 다 사실 오답:** 처치가 하나뿐인 위기 문장(7-3·15-3·16-3·20-1)과 보고 요청 16-4, 수치 읽기 1-0은 브리프의 "참인 다른 효과·이유" 허용으로 통과.
- **decoy:** 같은 자리·같은 모양의 틀린 구가 원칙이라, 조립하면 다른 문장이 되는 것 자체는 실패가 아닙니다. 실패는 (a) 조립하면 **ko 뜻에 맞는** 문장(to turn·open), (b) 위험하거나 처치를 늦추는 지시, (c) 그 장면에서 **해도 맞는 다른 행동**(원본 15-2 `and sign it` — TASK가 든 실패 예 그대로), (d) 같은 낱말 몰림(주제에서 4번 이상)입니다.

## 저작자가 판정을 부탁한 곳
| 곳 | 판정 | 새 값 |
|---|---|---|
| 1-0 사실 둘 | **통과(유지)** — 수치 읽기라 바꿀 세부가 없고 두 사실 모두 en과 다름 | — |
| 6-1 X1 "재려고 눈금을 읽어요"·X2 사실 | X1 **실패**(보고 대신 재측정), X2 **고침**(6-0 X2와 같은 사실) | X1 "빠른 출혈은 총량보다 속도가 더 중요해요." · X2 "나간 양은 잰 시각과 함께 바로 적어요." |
| 8-3 X1 "낮은지 따지려고"·X2 사실 | X1 **실패**, X2 통과 | X1 "혈소판은 지혈 마개를 만드는 데 쓰여요." |
| 9-1 X1 "가리려고 맥박부터 짚어요"·X2 사실 | X1 **실패**, X2 통과 | X1 "징후를 전하려고 활력 수치를 챙겨요." |
| 14-0·14-1·14-3·14-4 | 14-0·14-1·14-3 X1 **실패**, 14-0 X2 **사실 오류**, 14-3 X2 **실패**, 14-4 X1 한 상황 중복, 14-2·14-4 X2 통과 | 아래 목록 |
| 0-3 출혈 위험 → 통증·시간 | **둘 다 실패** | "이 수술에서는 수혈을 미리 준비해요." · "이 수술에서는 교차시험 결과를 확인해요." |
| 4-2 의견 질문 둘 | X1 "뭐가 더 낫나요" **실패**(원하세요와 같은 질문), X2 "더 빠른가요" 통과 | X1 "클램프나 소작기 중 어느 쪽이 준비됐나요?" |
| 15-1 decoy `gowns` | 조립해도 ko에 안 맞아 기준 (a)~(c)는 통과, **(d) gown 몰림 5회로 교체** | `basins` |
| 20-0 decoy `to vomit` | **통과(유지)** — "He's about to vomit — crash cart at the bedside"는 ko(심정지)와 안 맞고, 구토에 크래시카트는 맞는 행동도 아님. 같은 꼴인 20-4 `he coughs`·14-4 `he shivers`도 통과 | — |

## 세기 (원본 → 사본)
- 오답 둘 다 같은 표지 틀(~려고·~려면·~기 전에): **2 → 0** (3-3·7-4)
- 오답 둘 다 교과서 사실: **2 → 12** — 원본 1-0·11-4 / 사본 1-0·6-1·7-3·8-3·9-3·14-1·14-3·15-3·16-3·16-4·17-0·20-1. **늘어난 10개는 이 검토의 수정 때문**입니다: 위기 단일 처치 문장(7-3·15-3·16-3·17-0·20-1)·보고 요청(16-4)·보고 문장(6-1·8-3·9-3·14-1·14-3)은 안전하게 바꿀 한 군데가 없어 브리프의 "참인 다른 효과·이유"로 썼습니다. 정답만 '보고·요청'이라는 모양 단서가 남으니 부르는 쪽이 허용 범위를 정해 주세요.
- 보고 행위를 종속절에 둔 앞 단계 오답(알리려고·전하려고·말하려고·보고하려고 + 준비): 사본 8개(4-0·6-0·6-2·8-0·9-0·9-1·13-3·14-0) — 한 상황 최다 2
- 표지 틀 오답이 하나 있는 문장: 79 → 73 / 105 (아래 구조 관찰)
- decoy 모양: 명사구 32 · 전치사구 31 · 동사구·기타 21 · and-구 12 · 한 낱말 9 (전후 같음 — 장소 구 몰림 없음)
- decoy 낱말 몰림: gown(s) 5·pump 5·ice 4 → 최다 3(spare·tubing·pump·drape·count·bag·monitor·cooler)
- 빈칸 오답 되풀이 최다: 3회 → 3회(W18 0)
- 되풀이 상한(어간·활용형 직접 셈, 정답 ko에 있는 낱말 제외) 상위 5 — 원본: **열다 10, 보다 8, 짚다 6, 올리다 6, 전화 준비(연락처·전화기·수화기) 6** · "EBL이 변한다" 사실 6 · 피 9 / 사본: 흡인 5, 혈액 5, 확인 5, 잡다 5, 열다 5(쓰다·재다·양도 5, 먼저 4, 나머지 4 이하)

## 구조 관찰 (고칠 것 아님, 부르는 쪽 판단용)
표지 틀(~하려고) 오답이 105문장 중 73문장에 하나씩 있고, 정답 ko에 "~려고"가 있는 것은 2문장(8-2·17-4)뿐입니다. 규칙(문장당 하나)은 지켰지만 "~려고가 붙은 보기는 오답"이라는 요령이 생길 수 있습니다. 다음 묶음부터 표지 틀 비율을 절반 아래로 두는 것을 권합니다.

## 고칠 것 — 127건 (안전 26 — 그중 11은 보고·판단 문장의 "다시 알아내기" 틀 · 정답 둘 31 · 기타 70), 문장 78곳 + order 4장
값은 전부 사본에 들어 있습니다. [안전]·[정답둘]·[기타]는 분류입니다.

### 0. 예상 출혈량 파악
- **0-1 distractorsKo[1]** [안전] 준비 시점을 "수술 후 정리"로 옮김 — 출혈 대비 장비를 수술 중에 갖추지 않게 됨
  - 지금: 여분의 흡인기와 랩패드를 수술 후에 정리해 둘게요.
  - 새 값: 여분의 흡인기와 랩패드는 출혈이 많을 때 써요.
- **0-1 decoy** [기타] gown 계열 decoy 몰림(gowns·gown 5회) 해소
  - 지금: and spare gowns
  - 새 값: and spare towels
- **0-3 distractorsKo[0]** [안전] 출혈 경고를 통증 위험으로 바꿈(저작자 판정 요청) — 참인 뒤 단계(수혈 준비)로
  - 지금: 이 수술에서는 통증이 많을 수 있어요.
  - 새 값: 이 수술에서는 수혈을 미리 준비해요.
- **0-3 distractorsKo[1]** [안전] 출혈 경고를 시간 위험으로 바꿈 — 참인 앞 단계(교차시험 확인)로
  - 지금: 이 수술에서는 시간이 오래 걸릴 수 있어요.
  - 새 값: 이 수술에서는 교차시험 결과를 확인해요.
- **0-3 blank** [정답둘] "We could give a lot of blood" = 수혈을 많이 할 수 있다 — 장면에 맞음. give→test
  - 지금: answer `lose` · lose / gain / save / give
  - 새 값: answer `lose` · lose / gain / save / test
- **0-4 decoy** [기타] gown 몰림 해소
  - 지금: extra sterile gowns
  - 새 값: extra skin markers
- **0-4 blank** [정답둘] "in case we drop them" — 떨어뜨릴 때를 대비한 여분은 실제 이유. drop→return
  - 지금: answer `need` · need / drop / waste / break
  - 새 값: answer `need` · need / return / waste / break

### 1. 흡인 출혈량 측정
- **1-2 distractorsKo[1]** [기타] "EBL이 변한다" 사실을 주제에서 6번 돌려 씀(0-2·1-2·2-2·6-4·15-2·17-2) — 3개로 줄임
  - 지금: EBL의 누적 합계는 계속 바뀌고 있어요.
  - 새 값: EBL의 누적 합계는 마취과도 함께 알아야 해요.

### 2. 거즈 무게 출혈 추정
- **2-0 distractorsKo[1]** [정답둘] "재려고 저울에 올려 둘게요" = 무게를 다는 행동 자체. 마른 무게 확인(앞 단계)으로
  - 지금: 거즈 무게를 재려고 저울에 올려 둘게요.
  - 새 값: 거즈 무게를 재려고 마른 무게부터 확인해요.
- **2-1 distractorsKo[0]** [기타] 건조↔젖은 반대말 뒤집기(⑤). 앞 단계로
  - 지금: 젖은 무게를 뺀 값은 약 150밀리리터입니다.
  - 새 값: 건조 무게를 빼려고 거즈 장수를 세어요.
- **2-1 distractorsKo[1]** [기타] "뺀 값은 제품마다 다르다"는 틀린 문장(다른 건 건조 무게) — 사실로 고침
  - 지금: 건조 무게를 뺀 값은 제품마다 다릅니다.
  - 새 값: 건조 무게는 거즈 종류마다 조금씩 다릅니다.
- **2-1 decoy** [기타] gown 몰림 해소
  - 지금: Gown weight added
  - 새 값: Basin weight added
- **2-2 distractorsKo[0]** [기타] "합계를 열다" 부자연·열다 되풀이
  - 지금: 이걸 누적 EBL에 더하려고 합계를 열게요.
  - 새 값: 이걸 누적 EBL에 더하려고 합계를 찾을게요.
- **2-2 distractorsKo[1]** [기타] "EBL이 변한다" 되풀이
  - 지금: 누적 EBL에 더하면 합계가 변해요.
  - 새 값: 이 값은 마취과에도 같이 알려요.
- **2-3 distractorsKo[1]** [정답둘] "새 것보다" = 마른 것(쓰지 않은 거즈)과 같은 뜻
  - 지금: 이 거즈들이 새 것보다 더 무거워 보이네요.
  - 새 값: 이 거즈들이 아까 것보다 더 무거워 보이네요.
- **2-4 distractorsKo[1]** [기타] 2-0 X1과 같은 바꿔치기(무게→개수)를 한 상황에서 두 번
  - 지금: 지금 개수를 세고 합계에 더합시다.
  - 새 값: 마르기 전에 재야 무게가 정확해요.
- **2-4 blank** [정답둘] "bag them and add it to the total" — 거즈를 봉투에 담아 카운트에 더하는 실제 절차. bag→soak
  - 지금: answer `weigh` · weigh / rinse / sort / bag
  - 새 값: answer `weigh` · weigh / rinse / sort / soak

### 3. 지혈 기구 준비
- **3-1 distractorsKo[0]** [정답둘] "필드에 올려 뒀어요" ≈ open on the field(열어 필드에 올림)
  - 지금: 지혈제를 수술 필드에 올려 뒀어요.
  - 새 값: 지혈제는 종류마다 쓰는 법이 달라요.
- **3-1 blank** [정답둘] "labeled on the field" — 필드 위 약 라벨링은 필수 관행. labeled→dropped
  - 지금: answer `open` · open / sealed / labeled / expired
  - 새 값: answer `open` · open / sealed / dropped / expired
- **3-3 distractorsKo[0]** [기타] 오답 둘 다 표지 틀(준비하려고·쓰려면) + 보다 되풀이
  - 지금: 소작기를 준비하려고 전원부터 볼게요.
  - 새 값: 소작기를 준비하려고 출력값을 맞출게요.
- **3-3 distractorsKo[1]** [기타] 둘 다 표지 틀 — 표지 없는 참인 사실로
  - 지금: 필요할 때 빨리 쓰려면 소작기는 켜져야 해요.
  - 새 값: 소작기 펜은 안 쓸 때 홀스터에 꽂아 둬요.
- **3-4 distractorsKo[0]** [기타] 30자로 길고 봉지·열다 되풀이
  - 지금: 당신을 위해 여분의 클립과 결찰사를 손 닿는 곳에 두려고 봉지를 열게요.
  - 새 값: 당신을 위해 여분의 클립과 결찰사를 미리 세어 둘게요.

### 4. 출혈 부위 보고
- **4-0 distractorsKo[0]** [안전] 출혈 보고 대신 거즈로 닦는 행동(순환간호사 역할도 아님). 보고를 종속절에 남긴 앞 단계로
  - 지금: 경계의 출혈을 닦으려고 거즈를 쥐어요.
  - 새 값: 출혈 위치를 알리려고 조명을 옮겨요.
- **4-2 distractorsKo[0]** [정답둘] "뭐가 더 낫나요"는 "어느 걸 원하세요"와 거의 같은 질문(저작자 판정 요청). X2 "더 빠른가요"는 유지
  - 지금: 클램프나 소작기 중 뭐가 더 낫나요?
  - 새 값: 클램프나 소작기 중 어느 쪽이 준비됐나요?
- **4-2 blank** [정답둘] "a stapler or cautery for that" — 혈관 스테이플러는 실제 지혈 도구. stapler→towel clip
  - 지금: answer `clamp` · clamp / scalpel / retractor / stapler
  - 새 값: answer `clamp` · clamp / scalpel / retractor / towel clip
- **4-4 distractorsKo[0]** [기타] 4-0 새 값(조명)과 겹치지 않게; 먼저 되풀이
  - 지금: 그 혈관을 클램프로 잡으려고 조명을 먼저 맞춥시다.
  - 새 값: 그 혈관을 클램프로 잡으려고 크기를 고릅시다.

### 5. 수액로 개통 확인
- **5-1 why** [기타] "지금은 대기 중" — en은 이미 wide open으로 흐르는 중
  - 지금: wide open은 조절기를 최대로 열었다는 뜻이고, if we need it으로 지금은 대기 중이라는 조건을 밝혀요.
  - 새 값: wide open은 조절기를 최대로 열었다는 뜻이고, if we need it을 붙여 그 속도가 필요할 때를 위한 대비임을 밝혀요.
- **5-3 distractorsKo[0]** [기타] 5-0 X1과 같은 "잘 고정돼 있어요"를 한 상황에서 두 번
  - 지금: 양쪽 라인 모두 제 쪽에서 잘 고정돼 있어요.
  - 새 값: 양쪽 라인 모두 제 쪽에서 잘 보여요.
- **5-3 blank** [기타] "running slightly on my end" 문법으로 걸러짐·slightly 3회
  - 지금: answer `well` · well / slowly / unevenly / slightly
  - 새 값: answer `well` · well / slowly / unevenly / dry
- **5-4 distractorsKo[0]** [기타] 짚다 되풀이(6회)
  - 지금: 마취과에서 원하면 두 번째 라인을 놓으려고 정맥을 짚어요.
  - 새 값: 마취과에서 원하면 두 번째 라인을 놓으려고 팔을 살펴요.
- **5-4 distractorsKo[1]** [안전] "두 번째 라인에 약을 걸어요" — 처방 없는 약 투여를 말함
  - 지금: 마취과에서 원하면 두 번째 라인에 약을 걸어요.
  - 새 값: 두 번째 라인은 굵은 바늘로 놓는 게 좋아요.

### 6. 출혈량 증가 추세 보고
- **6-0 distractorsKo[0]** [안전] 추세 악화 장면에서 보고 대신 "빠른지 따지려고"(이미 안 사실을 다시 알아내기). 보고를 종속절에
  - 지금: EBL이 예상보다 빠른지 따지려고 표를 펴요.
  - 새 값: EBL 추세를 보고하려고 숫자를 모으고 있어요.
- **6-1 distractorsKo[0]** [안전] 10분 500 mL 장면에서 "재려고 눈금을 읽어요"(저작자 판정 요청) — 한 상황에 보고 틀이 셋(6-0·6-1·6-2)이 되지 않게 참인 사실로
  - 지금: 10분 만에 나간 양을 재려고 눈금을 읽어요.
  - 새 값: 빠른 출혈은 총량보다 속도가 더 중요해요.
- **6-1 distractorsKo[1]** [기타] 6-0 X2와 같은 사실(흡인통+거즈 무게)을 한 상황에서 두 번
  - 지금: 나간 양은 흡인통과 거즈 무게로 재요.
  - 새 값: 나간 양은 잰 시각과 함께 바로 적어요.
- **6-2 distractorsKo[0]** [기타] 수술실에 있는 마취과의 "번호부터 볼까요" — 장면과 어긋남·보다 되풀이
  - 지금: 마취과에 알리려고 번호부터 볼까요?
  - 새 값: 마취과에 알리려고 지금 수치를 정리할까요?
- **6-3 blank** [기타] ago/later/since/after — since·after 문법으로 걸러짐. 빈칸을 faster로 옮김
  - 지금: answer `ago` · ago / later / since / after
  - 새 값: answer `faster` · faster / slower / lower / smaller
- **6-4 distractorsKo[0]** [기타] 시계·보다 되풀이(0-2와 같은 틀)
  - 지금: 몇 분마다 EBL을 추적하려고 시계 봅시다.
  - 새 값: 몇 분마다 추적하려고 타이머를 켭시다.
- **6-4 blank** [기타] 시간 단위 묶음(days/weeks 동떨어짐)
  - 지금: answer `minutes` · minutes / hours / days / weeks
  - 새 값: answer `minutes` · minutes / hours / shifts / cases

### 7. 국소 지혈제 적용
- **7-0 distractorsKo[0]** [기타] 열다 되풀이(10회)
  - 지금: 지혈 매트릭스를 적용하려고 뚜껑을 열어요.
  - 새 값: 지혈 매트릭스를 적용하려고 주사기에 채워요.
- **7-1 distractorsKo[0]** [정답둘] "압박하려고 손을 올릴게요" = 압박 동작 그 자체(올리다 6회)
  - 지금: 압박하려고 출혈면 위에 손을 올릴게요.
  - 새 값: 출혈면에 대려고 흡인으로 시야를 열게요.
- **7-1 distractorsKo[1]** [기타] "압박하면 출혈면이 안 보여요" — 압박을 꺼리게 하는 어색한 사실
  - 지금: 출혈면은 압박하면 안 보여요.
  - 새 값: 매트릭스는 젖은 면에 닿으면 부풀어요.
- **7-3 distractorsKo[0]** [정답둘] "압박하려고 손을 올릴게요" = 압박. 압박의 참인 효과로
  - 지금: 출혈이 줄어들 때까지 압박하려고 손을 올릴게요.
  - 새 값: 압박하면 지혈제가 출혈면에 잘 붙어요.
- **7-4 distractorsKo[0]** [기타] 오답 둘 다 표지 틀(쓰려고·쓰기 전에)
  - 지금: 출혈이 계속되면 매트릭스를 더 쓰려고 봉지를 열어요.
  - 새 값: 남은 매트릭스는 필드 위에 덮어 둬요.

### 8. 응고검사 결과 반영
- **8-0 distractorsKo[0]** [안전] "가리려고 응고검사를 짚어요" — 이미 나온 결과를 다시 알아내기·"검사를 짚다" 부자연. 보고를 종속절에
  - 지금: 응고병증이 발생하는지 가리려고 최근 응고검사를 짚어요.
  - 새 값: 최근 응고검사 결과를 말하려고 수치를 표로 옮겨요.
- **8-0 blank** [기타] pneumothorax·fever는 "coags show"와 동떨어짐 — 응고·혈액 분야 오답으로
  - 지금: answer `coagulopathy` · coagulopathy / pneumothorax / hematoma / fever
  - 새 값: answer `coagulopathy` · coagulopathy / thrombosis / hematoma / leukocytosis
- **8-1 decoy** [기타] ice decoy 몰림(4회)
  - 지금: a cup of ice
  - 새 값: a chest x-ray
- **8-2 distractorsKo[1]** [정답둘] "혈액은행에서 제제를 해동하거나 준비해요" ≈ to get products ready; 17-4 X1과 같은 문장
  - 지금: 혈액은행에서 제제를 해동하거나 준비해요.
  - 새 값: 혈액은행에는 환자 혈액형 검체가 필요해요.
- **8-3 distractorsKo[0]** [안전] "낮은지 따지려고"(저작자 판정 요청) — 이미 나온 결과를 다시 알아내기. 참인 사실로
  - 지금: 혈소판이 낮은지 따지려고 결과를 뽑아요.
  - 새 값: 혈소판은 지혈 마개를 만드는 데 쓰여요.
- **8-3 blank** [기타] BMI 동떨어짐 → sodium
  - 지금: answer `INR` · INR / hemoglobin / hematocrit / BMI
  - 새 값: answer `INR` · INR / hemoglobin / hematocrit / sodium
- **8-4 distractorsKo[0]** [기타] 보다 되풀이
  - 지금: FFP를 처방하고 혈액은행에 전화하려고 차트를 봅시다.
  - 새 값: FFP를 처방하고 혈액은행에 전화하려고 화면을 띄웁시다.

### 9. 저혈량 초기 징후
- **9-0 distractorsKo[0]** [안전] 혈압 하강·빈맥 장면에서 "모니터를 다시 맞춰요" — 인공물 탓으로 보고를 늦추는 행동
  - 지금: 혈압이 떨어지는 걸 확인하려고 모니터를 다시 맞춰요.
  - 새 값: 혈압과 심박수를 알리려고 추세 화면을 띄워요.
- **9-0 distractorsKo[1]** [정답둘] "혈압이 떨어지면 심박수는 보통 올라가요" — en의 두 방향을 그대로 담은 일반화
  - 지금: 혈압이 떨어지면 심박수는 보통 올라가요.
  - 새 값: 혈압은 커프와 동맥관 두 가지로 잴 수 있어요.
- **9-1 distractorsKo[0]** [안전] "저혈량증인지 가리려고 맥박부터 짚어요"(저작자 판정 요청) — 판단을 미루는 재확인. 보고를 종속절에
  - 지금: 저혈량증인지 가리려고 맥박부터 짚어요.
  - 새 값: 징후를 전하려고 활력 수치를 챙겨요.
- **9-2 blank** [정답둘] "opening up the fluids and waiting for blood" — 장면에 그대로 맞음. waiting→testing
  - 지금: answer `calling` · calling / waiting / stalling / resting
  - 새 값: answer `calling` · calling / testing / stalling / resting
- **9-3 distractorsKo[0]** [안전] "혈압을 다시 재려고 커프를 감고 있어요" — 틀을 벗어난 재측정, 악화 보고를 대신함. 9-0과 쌍둥이가 되지 않게 참인 사실로
  - 지금: 혈압을 다시 재려고 커프를 감고 있어요.
  - 새 값: 혈압은 심박수보다 늦게 떨어지는 편이에요.
- **9-3 distractorsKo[1]** [기타] "몸이 피를 보상하느라" 부자연한 한국어
  - 지금: 심박수는 몸이 피를 보상하느라 올라가요.
  - 새 값: 심박수가 오르는 건 몸의 보상 반응이에요.
- **9-3 blank** [기타] sinking/dropping/falling 동의어 셋 — 남은 하나가 정답으로 걸러짐
  - 지금: answer `climbing` · climbing / sinking / dropping / falling
  - 새 값: answer `climbing` · climbing / dropping / settling / stalling

### 10. 대구경 라인 추가
- **10-0 distractorsKo[0]** [기타] 열다 되풀이
  - 지금: 대구경 카테터를 가져오려고 서랍을 열게요.
  - 새 값: 대구경 카테터를 가져오려고 카트 쪽으로 가요.
- **10-4 distractorsKo[0]** [기타] 10-2 X2와 같은 "호스를 챙기다"를 한 상황에서 두 번
  - 지금: 라인이 들어가면 주입기 연결하려고 호스를 챙겨요.
  - 새 값: 라인이 들어가면 연결하려고 주입기 회로를 미리 채워요.
- **10-4 distractorsKo[1]** [기타] 10-2 X1과 같은 사실(주입기는 라인에 연결)
  - 지금: 신속 수액 주입기는 라인에 직접 연결해요.
  - 새 값: 신속 주입기는 분당 수백 밀리리터를 넣을 수 있어요.

### 11. 가온 수액 준비
- **11-0 distractorsKo[1]** [정답둘] "가온기는 수액을 체온 가까이 데워요" = 11-3 정답 문장
  - 지금: 가온기는 수액을 체온 가까이 데워요.
  - 새 값: 가온기는 수액 줄 중간에 끼워 써요.
- **11-2 distractorsKo[1]** [기타] "방 온도를 맞춰요"가 11-4 X2(방을 데워요)와 겹침·맞추다 되풀이
  - 지금: 체온 유지하려고 방 온도를 맞춰요.
  - 새 값: 체온을 유지하려고 가온 담요를 꺼내요.
- **11-2 decoy** [기타] gown 몰림 해소
  - 지금: his gown
  - 새 값: his drape
- **11-3 distractorsKo[0]** [기타] 11-1 X1과 같은 "호스를 이어요"를 한 상황에서 두 번
  - 지금: 가온기를 모든 수액에 쓰려고 호스를 이어요.
  - 새 값: 가온기는 모든 수액을 데우려고 미리 예열해요.
- **11-3 blank** [기타] boiling·freezing 우스운 말
  - 지금: answer `body` · body / freezing / boiling / outdoor
  - 새 값: answer `body` · body / room / fridge / outdoor
- **11-4 distractorsKo[1]** [정답둘] "체온이 떨어지지 않게 방을 데워요" — 정답 바람+행동을 품음
  - 지금: 체온이 떨어지지 않게 수술실 방을 데워요.
  - 새 값: 회복실에서 체온이 떨어지지 않았으면 해요.
- **11-4 blank** [기타] rising/spiking/jumping 동의어 셋
  - 지금: answer `dropping` · dropping / rising / spiking / jumping
  - 새 값: answer `dropping` · dropping / rising / charted / covered

### 12. 세포회수기 사용
- **12-0 distractorsKo[1]** [정답둘] "수술 전에 프라이밍해 둬요" ≈ set up and primed
  - 지금: 세포회수기는 수술 전에 프라이밍해 둬요.
  - 새 값: 세포회수기는 모을 때 항응고제를 섞어요.
- **12-1 distractorsKo[0]** [기타] 열다 되풀이
  - 지금: 그의 적혈구를 회수하려고 저장고를 열어요.
  - 새 값: 그의 적혈구를 회수하려고 회수기를 켜요.
- **12-1 blank** [정답둘] "bank and return his own red cells" — 자가혈 예치는 실제 개념. bank→discard
  - 지금: answer `salvage` · salvage / donate / freeze / bank
  - 새 값: answer `salvage` · salvage / donate / freeze / discard
- **12-2 distractorsKo[0]** [기타] 모이다↔비워지다 반대말 뒤집기(⑤)
  - 지금: 저장고에서 지금 비워지고 있어요.
  - 새 값: 저장고에 모으려고 줄을 이어요.
- **12-3 why** [기타] "프라이밍이 끝나면 돌려준다"를 안전 순서로 설명 — 실제는 모은 피를 씻어 처리한 뒤 반환
  - 지금: once …로 프라이밍이 끝난 뒤에야 돌려준다는 순서를 알려요. 준비가 끝나기 전에는 환자에게 돌려주지 않는다는 안전 순서예요.
  - 새 값: once …로 프라이밍이 먼저라는 순서를 알려요. 실제로는 저장고에 모은 피를 씻어 처리한 뒤에 돌려줘요.
- **12-4 distractorsKo[0]** [기타] 맞추다 되풀이
  - 지금: 필드에서 피를 모으려고 압력을 맞춰요.
  - 새 값: 필드에서 피를 모으려고 음압을 낮춰요.

### 13. 출혈 원인 팀 논의
- **13-0 blank** [기타] pneumothorax·fracture·seizure 동떨어짐(fracture는 외상 출혈원이라 애매)
  - 지금: answer `coagulopathy` · coagulopathy / pneumothorax / fracture / seizure
  - 새 값: answer `coagulopathy` · coagulopathy / hematoma / vasospasm / hernia
- **13-1 decoy** [정답둘] "which way to turn"은 관용구(어떻게 할지) — 조립하면 ko 뜻에 맞는 다른 문장
  - 지금: to turn
  - 새 값: to position
- **13-2 distractorsKo[0]** [기타] "나눕시다"(무엇을?) 불분명 + 13-4 X1과 같은 "역할을 나눕시다"
  - 지금: 조사하며 둘 다 다루려고 나눕시다.
  - 새 값: 둘 다 다루려고 팀을 부릅시다.
- **13-3 distractorsKo[0]** [안전] "외과적 출혈인지 가리려고" — 판단을 다시 알아내기로. 보고·판단 문장 규칙 통일
  - 지금: 이게 외과적 출혈인지 가리려고 부위를 살펴요.
  - 새 값: 외과적 출혈로 보인다고 말하려고 부위를 짚어요.
- **13-4 blank** [안전] "treat both after the coags come back" — 치료 지연을 보이는 선택지·since 문법으로 걸러짐
  - 지금: answer `until` · until / after / unless / since
  - 새 값: answer `until` · until / unless / because / though

### 14. 소변·관류 감시
- **14-0 distractorsKo[0]** [안전] "파악하려고 눈금을 읽어요" — 보고를 종속절에(보고·판단 문장 규칙)
  - 지금: 소변량을 파악하려고 소변줄 주머니 눈금을 읽어요.
  - 새 값: 소변량 저하를 전하려고 시간당 값을 계산해요.
- **14-0 distractorsKo[1]** [기타] 사실 오류 — 인과가 뒤집힘(콩팥 혈류가 줄어 소변이 줄지, 소변이 줄어 혈류가 줄지 않음)
  - 지금: 소변량이 줄면 콩팥으로 가는 피가 줄어요.
  - 새 값: 콩팥 혈류가 줄면 소변량이 줄어요.
- **14-1 distractorsKo[0]** [안전] "가늠하려고 손톱 색을 짚어요" — 판단 미루기·"색을 짚다" 부자연. 참인 사실로
  - 지금: 관류를 가늠하려고 손톱 색을 짚어요.
  - 새 값: 관류는 피부색과 체온으로도 가늠해요.
- **14-3 distractorsKo[0]** [안전] "낮은지 알려고 기록을 뒤져요" — 이미 안 값을 다시 알아내기. 참인 사실로
  - 지금: 한 시간 소변량이 낮은지 알려고 기록을 뒤져요.
  - 새 값: 소변 기준은 시간당 0.5mL/kg이에요.
- **14-3 distractorsKo[1]** [안전] "소변량이 낮으면 수액을 늘려요" — 처방 없는 처치 증량을 일반 사실처럼 말함(원인에 따라 다름)
  - 지금: 소변량이 낮으면 수액을 늘려요.
  - 새 값: 소변량은 한 시간 단위로 모아서 재요.
- **14-3 blank** [정답둘] "has been dark for the last hour" — 저혈량의 농축뇨로 장면에 맞음. dark→clear
  - 지금: answer `low` · low / high / dark / cloudy
  - 새 값: answer `low` · low / high / clear / cloudy
- **14-4 distractorsKo[0]** [기타] 14-2 X1과 같은 "채혈관"을 한 상황에서 두 번
  - 지금: 젖산을 지켜보려고 채혈관을 챙길게요.
  - 새 값: 젖산을 지켜보려고 채혈 시각을 적을게요.

### 15. 급성 대량 출혈
- **15-0 distractorsKo[1]** [정답둘] "지금 혈액이 제일 필요해요" ≈ calling for blood now
  - 지금: 대량출혈이에요 — 지금 혈액이 제일 필요해요.
  - 새 값: 대량출혈이에요 — 혈액은 쿨러에 담겨 와요.
- **15-1 decoy** [기타] gowns — 조립해도 ko에 안 맞아 통과지만 gown 몰림(5회) 때문에 교체(저작자 판정 요청)
  - 지금: gowns
  - 새 값: basins
- **15-2 distractorsKo[0]** [기타] 열다 되풀이
  - 지금: EBL을 계속 추적하려고 계산기를 열게요.
  - 새 값: EBL을 계속 추적하려고 계산기를 꺼낼게요.
- **15-2 distractorsKo[1]** [기타] "EBL이 변한다" 되풀이
  - 지금: EBL은 재는 순간에도 계속 바뀌어요.
  - 새 값: EBL은 마취과와 수시로 비교해요.
- **15-2 decoy** [정답둘] "and sign it" — TASK가 실패로 든 바로 그 꼴(다른 행동의 맞는 문장)
  - 지금: and sign it
  - 새 값: and the clock
- **15-3 distractorsKo[0]** [안전] 위기에 "혈액을 빨리 데워야 해요" — 혈액 요청 대신 옆 일
  - 지금: 대량출혈이라 혈액을 빨리 데워야 해요.
  - 새 값: 대량출혈이라 응고 인자가 모자라져요.
- **15-3 distractorsKo[1]** [기타] "혈액이 빠져나가요" 동어반복 — 참인 다른 효과로
  - 지금: 대량출혈이라 혈액이 빠져나가요.
  - 새 값: 대량출혈이라 체온도 같이 떨어져요.
- **15-3 blank** [안전] "we need blood slowly" — 대량출혈에 느린 수혈을 보이는 선택지
  - 지금: answer `fast` · fast / twice / alone / slowly
  - 새 값: answer `fast` · fast / twice / alone / returned
- **15-4 distractorsKo[0]** [기타] 전화 준비 틀 6회(연락처·전화기·수화기)·짚다 되풀이
  - 지금: 두 번째 흡인기를 요청하려고 연락처를 짚고 있어요.
  - 새 값: 두 번째 흡인기와 랩패드를 요청하려고 인터콤을 눌러요.
- **15-4 distractorsKo[1]** [정답둘] "흡인기와 랩패드가 더 필요해요" ≈ calling for them
  - 지금: 두 번째 흡인기와 랩패드가 더 필요해요.
  - 새 값: 두 번째 흡인기는 다른 벽 흡인구에 꽂아요.

### 16. 혈압 급강하 순환 허탈
- **16-0 distractorsKo[1]** [정답둘] "승압제가 필요한 상태예요" ≈ pushing pressors
  - 지금: 혈압이 급강하해서 승압제가 필요한 상태예요.
  - 새 값: 혈압이 급강하하면 뇌와 심장이 위험해져요.
- **16-0 blank** [기타] spiked/doubled/climbed 동의어 셋
  - 지금: answer `crashed` · crashed / spiked / doubled / climbed
  - 새 값: answer `crashed` · crashed / spiked / settled / normalized
- **16-2 decoy** [기타] of the weather 동떨어짐
  - 지금: of the weather
  - 새 값: of the suction
- **16-3 distractorsKo[0]** [안전] 위기에 수액 주기 → 수액 데우기(처치 바꿈)
  - 지금: 승압제를 투여하면서 동시에 수액도 데우고 있어요.
  - 새 값: 승압제는 수액이 부족하면 효과가 약해요.
- **16-4 distractorsKo[0]** [안전] 보고 요청 → 기록 요청 — 출혈 조절 소식을 놓치게 함. 참인 사실로
  - 지금: 출혈이 조절되는 순간 기록해 주세요.
  - 새 값: 출혈이 조절되면 랩패드가 덜 젖어요.
- **16-4 distractorsKo[1]** [기타] "조절됐나는" 맞춤법 오류
  - 지금: 출혈이 조절됐나는 필드로 알아요.
  - 새 값: 출혈이 조절됐는지는 필드를 보면 알아요.

### 17. 응고병증 발생
- **17-0 distractorsKo[0]** [기타] 31자 길고 전화 준비 틀 되풀이 — 참인 사실로
  - 지금: 응고병증이 생겼어요 — FFP와 혈소판을 요청하려고 수화기를 들어요.
  - 새 값: 응고병증이 생겼어요 — FFP는 해동에 시간이 걸려요.
- **17-0 distractorsKo[1]** [기타] 8-0 X2와 거의 같은 사실
  - 지금: 응고병증이 생기면 지혈이 어려워지고 피가 계속 나요.
  - 새 값: 응고병증이 생겼어요 — 저체온이면 더 심해져요.
- **17-0 blank** [정답둘] "He's hypotensive — I need FFP and platelets" — 출혈 장면에 맞음
  - 지금: answer `coagulopathic` · coagulopathic / hypotensive / hypoxemic / febrile
  - 새 값: answer `coagulopathic` · coagulopathic / hypoglycemic / hypoxemic / febrile
- **17-1 distractorsKo[0]** [기타] 전화 준비 틀 되풀이
  - 지금: 크라이오를 요청하려고 전화기를 쥐고 있어요.
  - 새 값: 크라이오를 요청하려고 요청서를 쓰고 있어요.
- **17-1 decoy** [기타] ice 몰림
  - 지금: for the ice
  - 새 값: for a stretcher
- **17-3 blank** [정답둘] "correct this hypotension fast" — 장면에 맞음
  - 지금: answer `coagulopathy` · coagulopathy / arrhythmia / hypotension / hyperkalemia
  - 새 값: answer `coagulopathy` · coagulopathy / arrhythmia / hyperthermia / hyperkalemia
- **17-4 distractorsKo[1]** [안전] 위기에 전화 대신 "필요한 양을 계산" — 정답 동사(전화)를 버린 준비 동작
  - 지금: 혈소판과 크라이오를 더 요청하려고 필요한 양을 계산할게요.
  - 새 값: 혈소판과 크라이오를 더 요청하려고 혈액은행 번호를 누를게요.

### 18. 대량수혈 프로토콜 발동
- **18-0 decoy** [기타] pump decoy 몰림(5회)
  - 지금: pump
  - 새 값: cart
- **18-3 decoy** [기타] ice 몰림(한 상황에 둘)
  - 지금: with fresh ice
  - 새 값: with more forms

### 19. 지혈 불가 손상통제
- **19-1 distractorsKo[0]** [정답둘] "쓰려고 포장을 풀어 뒀어요" ≈ ready
  - 지금: 임시 봉합을 쓰려고 포장을 풀어 뒀어요.
  - 새 값: 임시 봉합을 쓰려고 크기를 물어요.
- **19-3 decoy** [기타] pump 몰림
  - 지금: get a pump here
  - 새 값: get a stool here
- **19-3 blank** [기타] "before we can't" 문법으로 걸러짐
  - 지금: answer `if` · if / so / unless / before
  - 새 값: answer `if` · if / so / unless / though
- **19-4 decoy** [정답둘] "get the temporary closure open" ≈ ready — 조립하면 ko에 맞음
  - 지금: open
  - 새 값: sealed
- **19-4 blank** [기타] gown 반복
  - 지금: answer `closure` · closure / gown / table / pole
  - 새 값: answer `closure` · closure / label / table / pole

### 20. 심정지 임박 출혈
- **20-1 distractorsKo[0]** [안전] "압박하려고 손을 올릴게요" — 맥박 소실 조건을 빼고 지금 압박 자세(맥박 있는 환자)
  - 지금: 흉부압박을 시작하려고 손을 올릴게요.
  - 새 값: 흉부압박은 분당 100에서 120회로 해요.
- **20-1 blank** [안전] find/keep/feel the pulse → 맥박이 있는데 압박을 시작하는 문장이 됨. 빈칸을 pulse로
  - 지금: answer `lose` · lose / find / keep / feel
  - 새 값: answer `pulse` · pulse / line / count / light
- **20-2 decoy** [기타] through the window 동떨어짐
  - 지금: through the window
  - 새 값: through the cooler
- **20-2 blank** [기타] barely/slightly/narrowly 동의어 셋 — 빈칸을 가르치는 말 warmer로
  - 지금: answer `wide` · wide / barely / slightly / narrowly
  - 새 값: answer `warmer` · warmer / cooler / scale / drain
- **20-3 blank** [안전] gain/hold/read his pulse — 맥박이 있는데 압박. 빈칸을 pulse로
  - 지금: answer `lose` · lose / gain / hold / read
  - 새 값: answer `pulse` · pulse / line / drape / gown
- **20-4 distractorsKo[0]** [기타] 20-0 X2와 같은 사실(카트에 응급 장비)
  - 지금: 크래시카트는 심정지가 오면 바로 쓰는 응급 장비가 담긴 카트예요.
  - 새 값: 크래시카트는 매일 점검하고 그 점검표를 카트에 붙여 놓아요.
- **20-4 distractorsKo[1]** [기타] 20-0 X1과 같은 "길/통로를 비워요"
  - 지금: 심정지가 올 경우를 대비해 크래시카트를 가져다 두려고 통로를 비워요.
  - 새 값: 심정지가 올 경우를 대비해 크래시카트를 가져다 두려고 카트 잠금을 확인해요.
- **20-4 blank** [기타] food cart 동떨어짐 → case cart
  - 지금: answer `crash cart` · crash cart / supply cart / linen cart / food cart
  - 새 값: answer `crash cart` · crash cart / supply cart / linen cart / case cart

### order
- **0. 예상 출혈량 파악 order** [정답둘] 2↔3을 바꿔도 "Alongside that / Based on that"이 자연스럽게 이어짐 — 3줄이 2줄의 물품을 가리키게
  - 3줄 지금: Alongside that, I'll track EBL against that estimate as we go. (그와 함께 진행하며 그 추정치 대비 EBL을 기록할게요)
  - 3줄 새 값: With those ready, I'll track EBL against the estimate as we go. (그것들이 준비되면 진행하며 추정치 대비 EBL을 기록할게요)
- **5. 수액로 개통 확인 order** [기타] 1줄 "Both IVs"(이미 둘) 다음에 "a second line"·"both lines" — 셋째 라인이어야 함(order why의 "둘째 라인"도 "라인 추가"로)
  - 3줄 지금: If that isn't enough, I can place a second line for anesthesia. (그걸로 모자라면 마취과를 위해 라인을 놓을게요)
  - 3줄 새 값: If that isn't enough, I can place another line for anesthesia. (그걸로 모자라면 마취과를 위해 라인을 하나 더 놓을게요)
  - 4줄 지금: Either way, I'll keep checking that both lines stay patent. (어느 쪽이든 양쪽 라인이 열려 있는지 계속 볼게요)
  - 4줄 새 값: Either way, I'll keep checking that the lines stay patent. (어느 쪽이든 라인이 열려 있는지 계속 볼게요)
- **11. 가온 수액 준비 order** [정답둘] 2↔3 교환이 자연스러움("설치 → 그러면 체온 유지 → 전부 거쳐 감") — 3줄이 2줄을 받게
  - 3줄 지금: That way the fluids stay at body temperature. (그러면 수액이 체온으로 유지돼요)
  - 3줄 새 값: With all of it going through, the fluids stay at body temperature. (전부 거쳐 가니 수액이 체온으로 유지돼요)
- **13. 출혈 원인 팀 논의 order** [정답둘] 2↔3 교환이 자연스러움("알기 전까지 둘 다 → 검사가 알려줄 것") — 3줄이 they로 2줄을 받게
  - 3줄 지금: Until we know, let's address both. (알기 전까지는 둘 다 다룹시다)
  - 3줄 새 값: Until they do, let's address both. (결과가 나올 때까지는 둘 다 다룹시다)

## 전수 판정표 (105문장 — 고친 필드만 표시, 나머지는 통과)
| 문장 | en | 판정 |
|---|---|---|
| 0-0 | What's the expected blood loss for this procedure? | 통과 |
| 0-1 | I'll have extra suction and lap pads ready. | 고침: X2, decoy |
| 0-2 | I'll track EBL as we go. | 통과 |
| 0-3 | We could lose a lot of blood with this procedure. | 고침: X1, X2, blank |
| 0-4 | I'll keep extra lap pads within reach in case we need them. | 고침: decoy, blank |
| 1-0 | The canister shows about 300 milliliters so far. | 통과 |
| 1-1 | I'll subtract the irrigation from that number. | 통과 |
| 1-2 | I'm keeping a running total of the EBL. | 고침: X2 |
| 1-3 | Let me check the suction canister again. | 통과 |
| 1-4 | Once I subtract the irrigation, the real blood loss is lower. | 통과 |
| 2-0 | I'll weigh the sponges to estimate the loss. | 고침: X2 |
| 2-1 | Dry weight subtracted, that's about 150 milliliters. | 고침: X1, X2, decoy |
| 2-2 | I'll add this to our running EBL. | 고침: X1, X2 |
| 2-3 | These sponges look heavier than the dry ones. | 고침: X2 |
| 2-4 | Let's weigh them now and add it to the total. | 고침: X2, blank |
| 3-0 | Cautery is on and set, ready when you need it. | 통과 |
| 3-1 | I have hemostatic agents open on the field. | 고침: X1, blank |
| 3-2 | Extra clips and ties are within reach. | 통과 |
| 3-3 | I'll keep the cautery ready in case we need it fast. | 고침: X1, X2 |
| 3-4 | I'll set extra clips and ties within reach for you. | 고침: X1 |
| 4-0 | I'm seeing bleeding at the lower margin. | 고침: X1 |
| 4-1 | More suction here so you can visualize it. | 통과 |
| 4-2 | Do you want a clamp or cautery for that? | 고침: X1, blank |
| 4-3 | The bleeding is steady but not fast right now. | 통과 |
| 4-4 | Let's clamp that vessel before it gets worse. | 고침: X1 |
| 5-0 | Both IVs are patent and flowing freely. | 통과 |
| 5-1 | I've got fluids running wide open if we need it. | 고침: why |
| 5-2 | Let me know if you want another line placed. | 통과 |
| 5-3 | Both lines are running well on my end. | 고침: X1, blank |
| 5-4 | I can place a second line if anesthesia wants one. | 고침: X1, X2 |
| 6-0 | The EBL is trending up faster than expected. | 고침: X1 |
| 6-1 | We've lost about 500 milliliters in ten minutes. | 고침: X1, X2 |
| 6-2 | Do you want me to alert anesthesia and get blood ready? | 고침: X1 |
| 6-3 | This is faster than we expected an hour ago. | 고침: blank |
| 6-4 | Let's keep tracking the EBL every few minutes. | 고침: X1, blank |
| 7-0 | I have the hemostatic matrix ready to apply. | 고침: X1 |
| 7-1 | Let me pack it against the bleeding surface. | 고침: X1, X2 |
| 7-2 | Hold pressure while it sets up. | 통과 |
| 7-3 | I'll hold pressure on the surface until the bleeding slows. | 고침: X1 |
| 7-4 | I'll apply more matrix if the bleeding continues. | 고침: X1 |
| 8-0 | The latest coags show a coagulopathy developing. | 고침: X1, blank |
| 8-1 | Do you want FFP and platelets ordered now? | 고침: decoy |
| 8-2 | I'll call the blood bank to get products ready. | 고침: X2 |
| 8-3 | His platelets are low and his INR is elevated. | 고침: X1, blank |
| 8-4 | Let's order FFP now and call the blood bank. | 고침: X1 |
| 9-0 | His pressure is trending down and heart rate is up. | 고침: X1, X2 |
| 9-1 | These look like early signs of hypovolemia. | 고침: X1 |
| 9-2 | I'm opening up the fluids and calling for blood. | 고침: blank |
| 9-3 | His heart rate keeps climbing while his pressure drops. | 고침: X1, X2, blank |
| 9-4 | Let's open another line and call for blood now. | 통과 |
| 10-0 | I'll grab a large-bore catheter for you. | 고침: X1 |
| 10-1 | Second line is in and running wide open. | 통과 |
| 10-2 | Do you want a rapid infuser hooked up? | 통과 |
| 10-3 | I'll place the large-bore catheter in his other arm. | 통과 |
| 10-4 | Let's hook up the rapid infuser once the line's in. | 고침: X1, X2 |
| 11-0 | I'm setting up the fluid warmer now. | 고침: X2 |
| 11-1 | All the volume will run through the warmer. | 통과 |
| 11-2 | We'll keep his temperature from dropping. | 고침: X2, decoy |
| 11-3 | The warmer keeps all his fluids at body temperature. | 고침: X1, blank |
| 11-4 | I don't want his temperature dropping during this case. | 고침: X2, blank |
| 12-0 | I'll get the cell saver set up and primed. | 고침: X2 |
| 12-1 | We can salvage and return his own red cells. | 고침: X1, blank |
| 12-2 | The reservoir is collecting now. | 고침: X1 |
| 12-3 | Once it's primed, we'll return the red cells to him. | 고침: why |
| 12-4 | The cell saver will collect blood from the field. | 고침: X1 |
| 13-0 | Is this a surgical bleeder or a coagulopathy? | 고침: blank |
| 13-1 | The coags will tell us which way to treat. | 고침: decoy |
| 13-2 | Let's address both while we investigate. | 고침: X1 |
| 13-3 | This looks like surgical bleeding, not a coagulopathy. | 고침: X1 |
| 13-4 | Let's treat both possibilities until the coags come back. | 고침: blank |
| 14-0 | Urine output is down to under 30 an hour. | 고침: X1, X2 |
| 14-1 | That suggests his perfusion is compromised. | 고침: X1 |
| 14-2 | I'm watching lactate and capillary refill too. | 통과 |
| 14-3 | His urine output has been low for the last hour. | 고침: X1, X2, blank |
| 14-4 | I'll keep watching his lactate in case it climbs. | 고침: X1 |
| 15-0 | This is massive hemorrhage — I'm calling for blood now. | 고침: X2 |
| 15-1 | Second suction coming, and I've got more lap pads. | 고침: decoy |
| 15-2 | I'll keep tracking EBL and update you. | 고침: X1, X2, decoy |
| 15-3 | This is a massive hemorrhage and we need blood fast. | 고침: X1, X2, blank |
| 15-4 | I'm calling for a second suction and more lap pads. | 고침: X1, X2 |
| 16-0 | Pressure has crashed — pushing pressors now. | 고침: X2, blank |
| 16-1 | Volume wide open through both lines and the warmer. | 통과 |
| 16-2 | Tell me the moment you have control of the bleeding. | 고침: decoy |
| 16-3 | We're pushing pressors and giving volume at the same time. | 고침: X1 |
| 16-4 | Let me know the moment you have the bleeding under control. | 고침: X1, X2 |
| 17-0 | He's coagulopathic — I need FFP and platelets now. | 고침: X1, X2, blank |
| 17-1 | Calling blood bank for cryo as well. | 고침: X1, decoy |
| 17-2 | Let's correct the coags while you get hemostasis. | 통과 |
| 17-3 | We need to correct this coagulopathy fast. | 고침: blank |
| 17-4 | I'll call the blood bank for more platelets and cryo. | 고침: X2 |
| 18-0 | I'm activating the massive transfusion protocol. | 고침: decoy |
| 18-1 | First cooler is on the way with the ratio ready. | 통과 |
| 18-2 | I'll track units in and keep the counts straight. | 통과 |
| 18-3 | The next cooler should be here with more units soon. | 고침: decoy |
| 18-4 | Let's keep the ratio straight as we activate the protocol. | 통과 |
| 19-0 | Let's pack and shift to damage control. | 통과 |
| 19-1 | I have packing and a temporary closure ready. | 고침: X1 |
| 19-2 | Plan to get him to ICU to resuscitate and return. | 통과 |
| 19-3 | We'll shift to damage control if we can't get control here. | 고침: decoy, blank |
| 19-4 | I'll get the temporary closure ready before we pack. | 고침: decoy, blank |
| 20-0 | He's about to arrest — crash cart at the bedside. | 통과 |
| 20-1 | If we lose the pulse, I'm starting compressions. | 고침: X1, blank |
| 20-2 | Keep the blood going wide open through the warmer. | 고침: decoy, blank |
| 20-3 | We'll start compressions the moment we lose his pulse. | 고침: blank |
| 20-4 | Get the crash cart to the bedside in case he arrests. | 고침: X1, X2, blank |

## 그대로 둔 것 중 판단을 적어 둘 것
- 5-0·10-1 X1 "잘 고정돼 있어요"/"팔에 고정돼 있어요" — 흐름 대신 고정 상태를 말하는 한 군데 바꾸기, 해 없음 → 통과(5-3의 같은 값만 중복이라 고침).
- 13-0 X1 "아니면 알레르기인가요?" — 원인 질문의 엉뚱한 쪽, 해 없음 → 통과.
- 16-2 X1 "흡인을 줄여 주세요"·X2 "수액 속도를 줄여 가요" — 출혈이 잡힌 뒤의 일이라 그 순간 처치를 비우지 않음 → 통과.
- 정답 동사를 종속절에 남긴 위기 앞 단계 X1 — 4-1·9-2·9-4·15-0·16-0·16-1·20-0·20-2·20-3 → 통과.
- decoy 0-2 `the irrigation`, 10-4 `the pressure bag`, 4-3 `from the lower margin`, 20-0 `to vomit`, 20-4 `he coughs`, 14-4 `he shivers` — ko 뜻과 맞지 않는 같은 자리 구 → 통과.
- tag·icon 105개와 order 머리말·note 84줄 — 고칠 것 없음.
- 문장 en·ko 자체(B 범위 밖, A 몫): 12-3 en "Once it's primed, we'll return the red cells"는 실제 순서(프라이밍 → 모으기 → 세척 → 반환)를 건너뜀, 5-1 ko "열어 놓은 채로 흐르게 하고 있어요"는 "필요하면"과 어긋남 — notes에 없던 것이라 적어 둡니다.
