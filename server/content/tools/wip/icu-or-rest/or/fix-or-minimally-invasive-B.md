# or-minimally-invasive — B 검토 (v46 절 1~6·8, distractorsKo ①~⑥·되풀이 상한, 2026-11-24 "안전 우선, 하나는 같은 모양" 기준)

대상: `or-minimally-invasive.yaml`(A·B 합친 파일, 수정하지 않음) · 문장 126 · 상황 21 · order 21장
**새 값 전부를 넣은 사본:** `/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/_reviewB_or-minimally-invasive_after.yaml`
→ `verify_one_theme.py or …_after.yaml` **위반 0 · 경고 0 · 통과**. 바뀐 것은 문장 `distractorsKo`·`blank`·`decoy`와 order 9장(줄 en·ko·note·icon, why)뿐이고, 단어·뉘앙스·문장 en/ko/chunks/words/goal/tag/icon/why는 원본 그대로입니다(`_patch.py`가 assert로 대조).

스크립트(같은 폴더, 이름에 `_reviewB_or-minimally-invasive_`): `dump.py`(en|ko|오답1|오답2·빈칸 네 줄·order 인접 교환 21장 → `_table.txt`/`_after_table.txt`) · `decoy.py`(decoy를 청크 자리마다 넣어 읽기 → `_decoy.txt`/`_after_decoy.txt`) · `mark.py`(표지별 정답·오답 횟수, 조건 ~면은 화면·앞면 등 제외) · `stems.py`(이 주제용 어간·활용형 직접 셈: 두다·놓다·켜다·꽂다·열다·읽다·보다·맞추다·정하다·걸다·찾다·꺼내다·덮다·펴다·붙다·달리다·다르다·나오다·뜨다/띄우다·맡다·쓰이다·생기다·만들다·줄다·부르다·재다·세다… + 명사) · `w19.py`(검사기 W19와 같은 앞 두 음절 셈) · `dstat.py`(decoy 모양·낱말 몰림) · `patch.py`(새 값 전부 적용 + V20·길이·빈칸 경계·decoy·order 15단어·B 필드만 바뀜 확인, 칸별 오답 모양표로 사실문 둘 전→후 계산, 원문·새 값은 `_proposal.json`) · `upd.py`(값 고치기) · `md.py`(아래 목록·표 생성). `_after_dk.txt`는 새 `ko|오답1|오답2` 전체(바뀐 칸에 `*`).

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 5 | 126개 모두 말하는 방식(Let's 청유·진행형·명사구 압축·대시)을 설명하고 ko를 되풀이하지 않음, 사실 오류 없음 |
| 2 빈칸 | 2 | 59문장 고침: 정답 둘 56(보고 문장 값·상태라 ko 없이 못 정함 13 — 0.3·1.0·1.3·6.5·8.0·8.4·11.4·12.0·12.3·14.4·10.4·19.0 등, 장면에서 그대로 맞는 말 43 — 16.5 clamps·19.2 circulation·17.5 sterile·2.5 camera·15.4 a cart·6.0 flow·10.3 pulse/oxygen 등), 동떨어짐·경계 3 |
| 3 decoy | 3 | 24개: 조립하면 위험 3(9.4 is dark·11.5 and write it down·14.5 the cart), ko와 거의 같은 문장 7, 장면에서 맞는 다른 행동 2, 위기 장면의 우스운 조각 7·drape/camera 몰림 5 |
| 4 distractorsKo | 2 | 252칸 중 106칸(94문장): 안전 10(5.1·5.3·6.2·6.5·7.0·7.3·7.5·8.2·8.3), 나머지는 모양 단서 — 둘 다 사실문 75문장, 전에 계열 31회(정답 12)·~면 23회(정답 7), 둘 다 정답보다 긴 문장 29, 뒤집기 1(4.0), 같은 문장 중복 1(2.2=2.4), 장갑 앞 단계 5번 되풀이 |
| 5 order | 3 | 21장 전부 인접 교환: 고침 9 — 임상 순서 S15, 시간 한정(TASK 10번) S6·S10·S20, 교환이 자연스러움 S4·S7·S16·S17, 시제 S5. 나머지 12장은 3쌍 모두 앞 줄 가리킴으로 막힘 |
| 6 tag·icon | 5 | 상황 안에서 일관, 모두 10자 이하. 고칠 것 없음(19.3 촉진 보고의 `stetho`는 손으로 만지는 소견이라 약간 어긋나지만 그대로 둠) |
| 8 파일럿 갈래 | 2 | 빈칸 정답 둘이 주제 전체에 퍼짐(2번), decoy 우스운 조각(위기 6장), order 시간 한정·임상 순서(4번), 오답 뜻이 사실문으로 몰려 모양만 보고 맞힘(5번 갈래의 새 모양) |

## 심각한 문제
1. **오답 모양 단서 — 정답만 행동, 오답은 사실문·표지(이 주제의 핵심).** 원본은 오답 둘 다 사실문인 문장이 **75/126**(저작자 셈 79, 차이는 6.5·0.3처럼 한쪽이 같은 틀 보고인 것을 사실로 셌는지 차이), 앞 단계 오답의 표지가 **전에·직전·앞서·먼저 31회 대 정답 12회**(그중 정답 ko에 그 표지가 없는 칸 19), **조건 ~면 23회 대 정답 7회**(정답에 없는 칸 20)였습니다. 듣지 않고 "행동 문장 = 정답, 사실문·'~전에'·'~면' = 오답"으로 맞힐 수 있습니다. 사본: 사실문 둘 **33**(위기 지시·값 보고·판단·호출만), 전에 계열 **13**(전부 정답 ko에 같은 표지가 있는 문장), ~면 **5**(같음).
2. **안전 10칸** — 확인 내용 바꾸기 5.1(보호→표시·개수), 5.3(패딩→혈액순환); 보고 전에 다시 보기 6.2('말씀하시기 전에 복부를 봐')·7.5('알리기 직전에 압력을 볼게요'); 잘못된 안심 6.5(팽창→거즈가 붙음)·7.0·7.3(EtCO2 상승 보고를 '지켜보고 있습니다'로 — 상승이 빠짐); 그 순간 다른 일 8.2(팔 위치→팔 덮개)·8.3(공간 확보→번호 붙이기).
3. **빈칸 정답 둘 56문장** — STEP 2 빈칸 화면(`SentPrompt.tsx` BlankPrompt)에는 ko가 없습니다. 보고 문장의 값·상태 빈칸(1.3 normal/high/low/zero, 8.4 left/upper/lower/far, 12.0 fogging/heating/lighting up)은 넷 다 맞는 영어가 되고, 장면에서 그대로 맞는 말(16.5 출혈에 `clamps`, 19.2 `circulation`, 17.5 `sterile hands`, 2.5 `camera`=scope·`trocar`, 15.4 `a cart`=crash cart, 6.0 `flow` 15 L/min, 10.3 `pulse`·`oxygen`)이 오답으로 들어가 있습니다.
4. **order** — S15: 가스 색전 의심 시 원인 제거(기복 중단·가스 해제)가 먼저인데 호출 뒤 'As I call'로 밀림. S6('After I call it out, tell me…')·S10('Between those, watch…')·S20('For when he's back, let's apply pressure')은 TASK 10번 시간 한정 — 보고를 늦추거나 감시를 사이에만, 압박을 대비로 만듦. S16(저작자가 못 박지 못했다고 한 장)·S7·S17·S4는 인접 교환이 그대로 읽힘.
5. **decoy 위험 조립 3** — 9.4 `is dark`('피가 검으면 전환'이라는 틀린 판단 기준), 11.5 `and write it down`(재확인을 기록으로), 14.5 `the cart`(검체 백 대신 카트에 라벨).
6. **B 범위 밖(문장 en — 부르는 쪽·A 판단):** 15.2 "Left lateral, head down"과 15.3 "Let's get him flat and turn him left-side down"이 같은 상황에서 머리 위치가 어긋남(가스 색전은 머리 낮춤 — 15.3의 flat은 틀리거나 15.2와 충돌). 저작자 메모의 7.5·19.4(마취과의사 persona가 "tell anesthesia")도 문장 en 문제라 고치지 않았고 order에는 쓰이지 않음을 확인.

## 판정 기준 (이 검토에서 쓴 규칙 — 수정 담당도 이 기준으로)
- **안전:** 오답이 정답 행동의 바로 앞·뒤 단계면 통과(전원 켜기·덮개 씌우기·클러치 풀기·워머 뚜껑·설정 화면). 그 순간 정답 행동 대신 하는 일이면 실패: 확인 대상·내용 바꾸기, 보고 대신 다시 재기, 잘못된 안심(경고를 가벼운 일로, 상승 보고를 '지켜본다'로), 일부만(간격 두기 빠짐), 호출 대상·설정값·부위·쪽 바꾸기.
- **확인 문장의 같은 모양 오답:** 확인 동사는 남기고 해 없는 방식어만 바꿈(1.5 다시→손으로, 5.5 다시→같이, 10.4 면밀히→자주) 또는 정답 동사를 관형절에 남긴 앞 단계(5.0·5.3·14.2 '확인할 …')·확인을 남긴 뒤 단계(3.2·3.5·9.3·11.1 '확인한 …'). 'Let's …' 문장에서 '같이·함께'는 Let's와 같은 뜻이라 정답 둘(7.4·14.3에서 피함).
- **보고 문장의 같은 모양 오답:** 같은 사건의 해 없는 세부(0.1 켜짐→꽂힘, 2.4 깨끗→따뜻, 7.0 흡수→주입, 12.3 흐릿→어두움, 19.3 만져짐→들림) 또는 같은 대응의 더 무거운 쪽(7.3 꾸준히→갑자기, 19.0 목→얼굴). 지표·값·위치를 바꾸면 실패(6.0 값, 10.3 혈압→산소포화도, 11.4 압력→유량, 16.0 다른 포트 — 그래서 이들은 사실문 둘로 남김). 표시 방식만 바꾼 것(11.4 '나옵니다→깜박입니다')은 뜻이 같아 정답 둘.
- **위기 문장:** 앞 단계는 정답 동사를 관형절에 남긴 것만, 문장당 하나(15.3·17.1·17.2·18.1·18.2·18.4·20.1). 장갑 끼기를 앞 단계로 쓰지 않음(주제에서 5번 되풀이 + 위기 처치를 늦춤). 호출·압박·흡인·기복 중단처럼 바꿀 세부가 없으면 사실문 둘.
- **정답 품기:** 정답 명제에 행동을 덧붙인 것(1.3 '정상이라 밸브를 엽니다')과 같은 상황 다른 문장의 정답(12.1 '닦아서')은 정답 둘.
- **빈칸:** 기준은 "ko 없이 이 장면에서 하나로 정해지는가". 값·상태·방향어 빈칸은 가르치는 다른 말(gauge·climb·abdomen·port·level·closely·error·scope)로 옮기고, 오답은 그 자리에서 문법은 맞지만 장면에서 틀린 같은 분야 말로(and sharp와 어긋나는 blurry·grainy, too high와 어긋나는 drop·fall).
- **decoy:** 같은 자리·같은 모양의 틀린 구. 실패는 (a) ko에 거의 그대로 맞음 (b) 위험하거나 처치를 늦춤 (c) 그 장면에서 실제 하는 다른 행동 (d) 위기 장면의 우스운 조각 (e) 낱말 몰림 4회 이상.
- **길이:** 오답 둘 중 하나는 정답 길이(공백 뺀 글자 수) 이하.

## 저작자 메모 판정
| 메모 | 판정 |
|---|---|
| 7.5·19.4 persona(마취과의사가 "tell anesthesia") | 문장 en 문제라 B 범위 밖 — 부르는 쪽·A가 판단. order에는 두 문장이 쓰이지 않음 확인. 7.5 오답1('알리기 직전에 압력을 볼게요')은 보고 전 다시 재기라 별도로 고침 |
| 13.1 "Everyone knows their role" 잘못된 안심 위험 | 오답을 참으로 만들지 않았다는 판단은 맞음. 새 오답1은 같은 틀에서 '역할→위치'만 바꿈(둘 다 확인이 필요한 진술이라 해 없음) |
| "확인·위기·보고·판단 문장은 바꿀 세부가 없어 사실문 둘" | **75문장 중 42문장은 안전한 같은 모양이 있었음** — 확인 동사를 남긴 방식어 교체, 관형절 앞 단계, 확인한 뒤 단계, 같은 사건 세부. 남긴 33문장은 위기 지시(15·16·19·20)·값 보고(6.0)·판단(9.4·13.5·15.1·16.1)·호출(16.4·18.5·20.5)·보고 약속(7.5·10.5) |
| "앞 단계 오답은 ~전에 계열로만, 상한을 둠" | 실제로는 전에 계열 31회가 오답에, 그중 19칸은 정답 ko에 그 표지가 없는 문장 — 모양 단서. 사본은 전에 계열을 정답 ko에 '전에·먼저'가 있는 12문장에만 둠(13회) |

## 세기 (원본 → 사본)
- **오답 둘 다 사실문:** **75 → 33**(26%, 목표 약 1/4). 칸 모양: 사실 194·같은 틀 세부 29·앞 단계 29·뒤 단계 0 → 사실 154·세부 48·앞 단계 42·뒤 단계 8. 남은 33: 6.0·7.5·8.5·9.4·10.3·10.5·11.4·13.5·15.0·15.1·15.2·15.4·15.5·16.0~16.5·17.0·17.4·17.5·18.3·18.5·19.1·19.2·19.4·19.5·20.0·20.2~20.5.
- **오답에만 몰린 표지(주제 전체 횟수, 정답 ko 횟수):** 전에·직전·앞서·먼저 **31 → 13**(정답 12, 1.08배; 정답 ko에 그 표지가 없는 칸 19 → 0) · 조건 ~면 **23 → 5**(정답 7; 없는 칸 20 → 0 — 저작자 29 대 12는 '면밀히'·'화면'까지 센 수) · ~려고/~러 0 → 0 · ~부터 2 → 0 · ~니/~라 0 → 0 · 뒤/후 2 → 4(그중 3은 '뒤쪽·뒤 테이블' 장소어, 실제 시간 표지 1).
- **대체 모양(새 단서 감시):** 정답 동사를 남긴 '~할 N' 관형절 앞 단계 오답 2 → 14(정답 ko 2). 처음 값에서 26칸이었던 것을 표지 없는 앞 단계·'…용'·'-는' 관형절로 12칸 바꿔 줄였고, 남은 14칸 중 9칸은 위기 문장(정답 동사를 남겨야 함). '~한 N' 뒤 단계 0 → 6(3.2·3.3·3.5·5.4·9.3·11.1).
- **오답 둘 다 같은 표지 틀:** 0 → 2(4.0 '먼저'·6.2 '~면' — 두 문장 모두 정답 ko에 같은 표지가 있어 단서 아님).
- **오답 둘 다 정답보다 긴 문장:** **29 → 0**.
- **decoy 모양:** 전치사구 49·명사구 33·한 낱말 21·접속/if 구 14·동사 포함 9 → 46·34·22·15·9(한 낱말은 now·first·slowly·steady 같은 한 낱말 청크 자리라 그대로).
- **decoy 낱말 몰림:** drape(s) 6·screen 4·tape 4·camera 4 → 최다 3(warm·labeled·cable·label·screen·tape·room·camera).
- **빈칸 정답 위치:** 31·30·31·34 → 32·32·31·31(새 빈칸 59개 정답 칸을 남은 칸에 고르게 배정).
- **빈칸 오답 되풀이:** 최다 3회 14개 → 3회 17개(W18 0).
- **되풀이 상한(오답에만 있는 낱말, 어간·활용형 직접 셈):** 원본 달리다 8·보다 8·정하다 7·다르다 7·붙다 7·열다 7·팔 7·나오다 6(검사기 W19는 앞 두 음절이라 경고 0) → 사본 최다 5(두다·달리다·꽂다·카트·열다·다르다·뜨다/띄우다·풀다·정하다·나오다·집도의·팔·쓰이다·수술), W19 경고 0.

## 구조 관찰 (고칠 것 아님, 부르는 쪽 판단용)
- 사실문 둘 33문장은 거의 S15·S16·S19·S20(위기 4상황, 24문장 중 20)에 몰려 있습니다. 이 네 상황은 문장마다 '지시 하나'라 바꿀 세부가 없고, 정답 동사를 남긴 앞 단계는 문장당 하나 규칙과 '~할 N' 몰림 때문에 더 늘리지 않았습니다. 위기 상황만 따로 보면 여전히 "행동=정답" 모양이 남습니다 — 허용 범위를 정해 주세요.
- 표지를 걷어낸 자리에 '~할 N'(정답 동사를 관형절에 남긴 앞 단계)이 14칸 남았습니다. 표지 낱말은 아니지만 정답 ko에는 2번뿐이라, 다음 주제부터는 '~할 N'도 표지 표에 넣어 세는 것을 권합니다.
- 보고 문장의 같은 모양 오답 중 '더 무거운 쪽'(7.3 갑자기, 19.0 얼굴까지)은 잘못된 안심이 아니라 과잉 대응 쪽이라 통과로 봤습니다. 부르는 쪽 기준이 '보고 세부는 어느 쪽이든 바꾸지 않음'이면 두 칸을 사실문으로 되돌리면 됩니다(사실문 둘 35).
- 새 빈칸 오답 일부는 정답 둘을 피하느라 장면에서 먼 말(the hallway·zip·calendar·stickers)이 됐습니다. 수정 담당이 더 가까운 같은 분야 말을 찾으면 바꿔도 됩니다(넣어 읽어 정답 둘·위험이 아닌지, W18 3회 이하인지만 확인).

## 종합
고칠 것을 반영하면 내보내도 됩니다. 반영 전에는 내보내면 안 됩니다 — distractorsKo 모양 단서(사실문 둘 75·표지 몰림)와 빈칸 정답 둘 56문장이 듣기·빈칸 문항을 무력하게 만들고, S15 order가 가스 색전의 기복 중단을 호출 뒤로 가르칩니다. 반영값은 사본에 다 들어 있고 검사기 위반 0·경고 0입니다.

## 고칠 것 — 198건 (안전 17 · 정답 둘 63 · 기타 118)

칸 수: distractorsKo 106칸(94문장; 안전 10·기타 96) · 빈칸 59(정답 둘 56·기타 3) · decoy 24(안전 3·정답 둘 7·기타 14) · order 9장(안전 4·기타 5). 새 값의 괄호는 오답 모양(사실·같은 틀 세부·앞 단계·뒤 단계).

### 0. 복강경 장비 세팅
- **0.0 decoy** [기타] `the back table` — the back table — '뒤 테이블을 세팅하자'가 이 장면에서 실제로 하는 다른 일(그대로 맞는 문장)
  - 새 값: `unplug`
- **0.1 오답1** [기타] "모니터, 광원, 기복기는 타워에 모입니다." — 둘 다 사실문(정답만 보고 모양) — 같은 보고 틀에서 '켜짐'만 '꽂힘'으로(해 없음, 다음 줄에서 작동 확인)
  - 새 값(같은 틀 세부): **"모니터, 광원, 기복기가 꽂혀 있습니다."**
- **0.1 빈칸** [정답둘] camera head/foot pedal/suction tubing/light source (정답 light source) — camera head — 타워 장비라 '켜져 있다'가 그대로 성립(정답 둘)
  - 새 값: answer `light source` · foot pedal / light source / suction tubing / trocar tray
- **0.2 빈칸** [정답둘] labeled/sterile/packed/working (정답 working) — sterile — '덮기 전에 멸균 확인'이 그대로 성립(정답 둘)
  - 새 값: answer `working` · labeled / working / unplugged / packed
- **0.3 빈칸** [정답둘] dim/clear/faded/small (정답 clear) — dim·small — '어둡고 또렷'·'작고 또렷'도 보고로 성립해 ko 없이 못 정함. and sharp와 어긋나는 말로
  - 새 값: answer `clear` · blurry / clear / grainy / hazy
- **0.5 오답1** [기타] "지금 광원 선을 꽂을게요." — 두 오답 모두 정답보다 김(길이로 정답이 드러남) — 앞 단계를 정답 길이 이하로
  - 새 값(앞 단계): **"광원 선을 꽂을게요."**
- **0.5 decoy** [정답둘] `for you` — for you — 'I'll turn on the light source for you.'가 ko와 거의 같음(지금만 빠짐)
  - 새 값: `at the end`

### 1. 기복 CO2 준비
- **1.0 오답1** [기타] "CO2 탱크는 단단한 금속 통이에요." — 둘 다 사실문('단단한 금속 통' — 장면과 먼 사실) — 같은 틀에서 '연결'만 '카트에 묶임'으로
  - 새 값(같은 틀 세부): **"CO2 탱크는 가득 찼고 카트에 묶여 있습니다."**
- **1.0 빈칸** [정답둘] full/empty/spare/new (정답 full) — new — 새 탱크는 가득 찬 탱크(정답 둘), empty도 보고로 성립
  - 새 값: answer `full` · sterile / full / sharp / foggy
- **1.1 오답1** [기타] "설정 전에 전원을 켭시다." — '설정 전에' — 정답 ko에 없는 전에 표지(몰림). 표지 없는 앞 단계로
  - 새 값(앞 단계): **"기복기 전원 스위치를 켭시다."**
- **1.1 오답2** [기타] "기복 압력 한계는 기기에서 정합니다." — '정하다' 어간이 오답에만 6번(되풀이 상한)
  - 새 값(사실): **"압력 한계는 기복기 화면에서 골라요."**
- **1.2 오답2** [기타] "기복 전 유량은 기기에서 읽어요." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"유량은 분당 리터로 읽어요."**
- **1.2 빈칸** [정답둘] color/weight/brand/flow (정답 flow) — weight — 탱크 무게로 잔량을 보는 실제 확인(정답 둘), brand는 장면과 동떨어짐
  - 새 값: answer `flow` · flow / brightness / focus / color
- **1.3 오답1** [기타] "탱크 압력 게이지는 탱크 위에 달립니다." — 둘 다 사실문 — 게이지를 읽는 바로 앞 단계(정상이라는 판정은 넣지 않음)
  - 새 값(앞 단계): **"탱크 밸브를 열고 압력 게이지를 봅니다."**
- **1.3 빈칸** [정답둘] normal/high/low/zero (정답 normal) — high/low/zero — 계기 값 보고는 넷 다 성립해 ko 없이 못 정함 → reads가 맞는 명사 자리로
  - 새 값: answer `gauge` · valve / gauge / hose / filter
- **1.4 오답1** [기타] "유량 눈금을 먼저 읽어 봅시다." — '먼저 읽어 봅시다' — 먼저 표지(정답 ko에 없음) + 유지를 읽기로 바꿈. 같은 틀에서 '유지'만 '입력'으로
  - 새 값(같은 틀 세부): **"유량 속도를 기기에 입력합시다."**
- **1.4 빈칸** [정답둘] table height/flow rate/camera angle/room noise (정답 flow rate) — camera angle·table height — '일정하게 유지'가 그대로 성립(정답 둘)
  - 새 값: answer `flow rate` · flow rate / tank weight / port size / room noise
- **1.5 오답1** [기타] "연결 확인 전에 호스를 정리할게요." — '연결 확인 전에' — 전에 표지(정답 ko에 없음). 확인은 남기고 '다시'만 '손으로'
  - 새 값(같은 틀 세부): **"전부 연결됐는지 손으로 확인할게요."**
- **1.5 빈칸** [정답둘] charged/stacked/connected/wrapped (정답 connected) — charged — '전부 충전됐는지 다시 확인'이 성립(정답 둘)
  - 새 값: answer `connected` · stacked / connected / wrapped / folded

### 2. 카메라·광원 준비
- **2.0 빈칸** [정답둘] reposition/disconnect/white-balance/disinfect (정답 white-balance) — reposition·disinfect — 카메라에 그대로 하는 일(정답 둘)
  - 새 값: answer `white-balance` · disconnect / relabel / white-balance / repackage
- **2.1 빈칸** [정답둘] height/intensity/distance/temperature (정답 intensity) — temperature — 광원 색온도로 성립(정답 둘)
  - 새 값: answer `intensity` · intensity / speed / volume / weight
- **2.2 decoy** [정답둘] `for the team` — for the team — 'I'll defog the lens for the team.'이 ko에서 시점만 빠진 같은 행동 + 4.2와 같은 decoy
  - 새 값: `after closure`
- **2.3 오답1** [기타] "화이트밸런스 확인 전에 흰 거즈를 폅시다." — '확인 전에' — 전에 표지(정답 ko에 없음)
  - 새 값(앞 단계): **"화이트밸런스용 흰 거즈를 폅시다."**
- **2.4 오답1** [기타] "렌즈는 스코프 맨 끝에 붙습니다." — 2.2 오답2와 글자 그대로 같은 문장 + 둘 다 사실문 — 같은 틀에서 '깨끗'만 '따뜻'으로
  - 새 값(같은 틀 세부): **"렌즈가 따뜻하고 준비된 것 같습니다."**
- **2.5 오답1** [기타] "스코프를 광케이블에 이을게요." — 두 오답 모두 정답보다 김 — 같은 앞 단계를 짧게
  - 새 값(앞 단계): **"스코프를 카메라에 이을게요."**
- **2.5 빈칸** [정답둘] camera/trocar/cable/scope (정답 scope) — camera — 스코프를 흔히 camera라 부름, trocar — '천천히 삽입'이 그대로 성립(정답 둘)
  - 새 값: answer `scope` · label / scope / cable / drape

### 3. 로봇 도킹 준비
- **3.0 오답1** [기타] "로봇 앞 바닥을 먼저 비웁시다." — '먼저' 표지(정답 ko에 없음) — 표지만 뺀 앞 단계
  - 새 값(앞 단계): **"로봇 앞 바닥을 비웁시다."**
- **3.0 빈칸** [정답둘] robot/tower/table/stand (정답 robot) — tower·table — '제자리로 가져오자'가 그대로 성립(정답 둘). 빈칸을 position으로
  - 새 값: answer `position` · storage / focus / position / the hallway
- **3.1 오답1** [기타] "팔 덮개를 먼저 펼게요." — '먼저' 표지(정답 ko에 없음) — 표지만 뺀 앞 단계
  - 새 값(앞 단계): **"팔에 멸균 덮개를 씌울게요."**
- **3.2 오답1** [기타] "카트는 바퀴가 네 개 달렸어요." — 둘 다 사실문('바퀴가 네 개' — 장면과 먼 사실) — 확인을 남긴 뒤 단계로
  - 새 값(뒤 단계): **"정렬을 확인한 카트를 밀게요."**
- **3.2 빈칸** [정답둘] plugged in/aligned/covered/parked (정답 aligned) — plugged in·parked — 카트 점검으로 그대로 성립(정답 둘)
  - 새 값: answer `aligned` · aligned / tilted / folded / labeled
- **3.3 오답2** [기타] "카트 바닥에 포트 자리 표시가 붙습니다." — 둘 다 사실문 — 맞춘 다음 단계(잠금)
  - 새 값(뒤 단계): **"포트 자리와 일렬로 맞춘 카트를 잠급니다."**
- **3.3 빈칸** [정답둘] floor marks/wheel locks/power cords/port sites (정답 port sites) — floor marks — 바닥 표시와 맞추는 방이 있어 성립(정답 둘)
  - 새 값: answer `port sites` · power cords / port sites / door frames / light switches
- **3.4 decoy** [정답둘] `on the cart` — on the cart — 'Let's lock the wheels on the cart.'가 ko에서 시점만 빠진 같은 행동
  - 새 값: `the drawers`
- **3.5 오답1** [기타] "각 팔 끝에는 번호표가 하나씩 붙습니다." — 둘 다 사실문 — 확인을 남긴 뒤 단계
  - 새 값(뒤 단계): **"여유 공간을 확인한 팔에 기구를 끼울게요."**
- **3.5 빈칸** [정답둘] a battery/clearance/a number/a handle (정답 clearance) — a number — 로봇팔에는 실제로 번호가 있음(참인 말)
  - 새 값: answer `clearance` · a battery / a handle / clearance / a cushion

### 4. 트로카 준비
- **4.0 오답1** [기타] "어떤 트로카 크기를 나중에 원하세요?" — '먼저→나중에' 반대말 뒤집기(⑤) — 같은 틀에서 '원하다'만 '열다'로
  - 새 값(같은 틀 세부): **"어떤 트로카 크기를 먼저 열까요?"**
- **4.1 오답1** [기타] "5밀리미터와 12밀리미터는 일회용입니다." — 둘 다 사실문 — 같은 틀에서 '준비'만 '세어'로
  - 새 값(같은 틀 세부): **"5밀리미터와 12밀리미터를 세어 뒀습니다."**
- **4.1 빈칸** [정답둘] wrapped/ready/counted/boxed (정답 ready) — counted·wrapped — '세어 뒀다·포장된 채로 있다'가 그대로 성립(정답 둘)
  - 새 값: answer `ready` · ready / bent / dull / broken
- **4.2 빈칸** [정답둘] ports/bags/labels/folders (정답 ports) — labels — '삽입 전에 라벨 확인'이 성립(정답 둘)
  - 새 값: answer `ports` · folders / ports / stools / pillows
- **4.2 decoy** [정답둘] `for the team` — for the team — 2.2와 같은 decoy, 'Let's confirm the ports for the team.'이 ko와 거의 같음
  - 새 값: `the gowns`
- **4.3 오답1** [기타] "트레이를 열기 전에 손을 씻을게요." — '열기 전에' — 전에 표지(정답 ko에 없음)
  - 새 값(앞 단계): **"트로카 트레이를 테이블에 둘게요."**
- **4.5 오답1** [기타] "개수를 세기 전에 트레이를 폅시다." — 두 오답 모두 정답보다 김 — 같은 앞 단계를 짧게(전에는 정답 ko에도 있음)
  - 새 값(앞 단계): **"세기 전에 트레이를 폅시다."**
- **4.5 빈칸** [정답둘] tag/stack/count/sort (정답 count) — sort·tag — 시작 전 정리로 성립(정답 둘)
  - 새 값: answer `count` · paint / weigh / count / stack
- **order** [기타] swap34 자연스러움 — 'Once we start, the 5-mm port goes in first. / Let's count those two sizes before we start.'로 읽어도 대화가 성립(those two sizes가 두 줄 앞을 가리켜도 통함)
  - 4줄: en "After the count, the 5-millimeter port goes in first." · ko "다 세고 나면 5밀리미터 포트가 먼저 들어가요" · note `순서` · icon `pushpin`
  - why: "크기를 묻고, 준비한 두 크기를 답하고, 시작 전에 그 두 크기를 세고, 센 다음 5밀리미터 포트가 먼저 들어간다고 알리는 순서예요. 답변과 those two sizes, After the count가 앞 줄을 가리켜 순서가 하나로 정해져요."

### 5. 체위 조정 확인
- **5.0 오답1** [기타] "패딩은 젤 소재로 만들어집니다." — 둘 다 사실문 — 확인을 남긴 앞 단계
  - 새 값(앞 단계): **"확인할 패드를 꺼냅시다."**
- **5.0 빈칸** [정답둘] lighting/draping/padding/charting (정답 padding) — draping — '체위와 드레이핑 확인'이 성립(정답 둘)
  - 새 값: answer `padding` · padding / lighting / charting / billing
- **5.1 오답1** [안전] "압박점이 전부 표시되고 있나요?" — '표시되고 있나요' — 보호 여부 확인을 표시 여부 확인으로 바꿈(확인 내용 바꾸기)
  - 새 값(앞 단계): **"압박점에 댈 패드가 더 있나요?"**
- **5.1 오답2** [안전] "압박점이 전부 몇 군데인가요?" — '몇 군데인가요' — 보호 확인을 개수 질문으로 바꿈(빠뜨린 확인)
  - 새 값(사실): **"압박점은 뼈가 튀어나온 곳이에요."**
- **5.1 빈칸** [정답둘] marked/protected/reddened/numbered (정답 protected) — reddened — 압박점이 붉어졌는지 묻는 피부 확인으로 성립(정답 둘)
  - 새 값: answer `protected` · numbered / protected / painted / sterile
- **5.2 빈칸** [정답둘] bed/table/chair/stretcher (정답 table) — bed — 수술대를 bed라고도 함, stretcher — 이송 중 고정으로 성립(정답 둘)
  - 새 값: answer `table` · chair / wall / table / cart
- **5.3 오답1** [안전] "혈액순환을 위해 발뒤꿈치와 팔꿈치를 확인합시다." — '혈액순환을 위해' — 무엇을 보는지(패딩)를 다른 것으로 바꿈(확인 대상 바꾸기)
  - 새 값(앞 단계): **"확인할 발뒤꿈치와 팔꿈치에서 담요를 걷어 냅시다."**
- **5.3 빈칸** [정답둘] swelling/padding/bruising/pulses (정답 padding) — swelling·bruising·pulses — 발뒤꿈치·팔꿈치 점검으로 그대로 성립(정답 넷)
  - 새 값: answer `padding` · padding / labels / sutures / stickers
- **5.4 오답2** [기타] "팔은 얇은 담요 한 장으로 덮습니다." — 둘 다 사실문 — 고정 다음 단계
  - 새 값(뒤 단계): **"옆에 고정한 팔 위에 시트를 덮습니다."**
- **5.4 빈칸** [기타] tucked/folded/crossed/raised (정답 tucked) — folded — at the sides와 함께 '접어 둔'으로 읽혀 경계
  - 새 값: answer `tucked` · stacked / tucked / crossed / raised
- **5.5 오답1** [기타] "안전 스트랩은 허벅지 위에 둘러요." — 둘 다 사실문 — 확인은 남기고 '다시'만 '같이'로
  - 새 값(같은 틀 세부): **"안전 스트랩을 같이 확인할게요."**
- **5.5 decoy** [기타] `the arm boards` — the arm boards — 체위 장면에서 실제로 하는 다른 확인(그대로 맞는 문장)
  - 새 값: `the sharps box`
- **order** [기타] 3줄 시제 — 'Once those are padded, the arms are tucked…'는 조건절 뒤에 이미 끝난 상태를 말해 어색함(청유로)
  - 3줄: en "Once those are padded, let's tuck the arms safely at the sides." · ko "거기에 패딩하면 팔을 옆에 안전하게 고정해요"

### 6. 기복 압력 감시
- **6.0 오답1** [기타] "기복 압력은 mmHg로 읽어요." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"압력 단위는 mmHg예요."**
- **6.0 빈칸** [정답둘] flow/volume/rate/pressure (정답 pressure) — flow·rate — 기복 유량 15 L/min이 그대로 성립(정답 둘)
  - 새 값: answer `pressure` · tubing / button / pressure / cable
- **6.1 오답1** [기타] "과하게 차면 복부가 팽팽해집니다." — '과하게 차면' — 면 표지(정답 ko에 없음). 상한을 지키는 앞 단계로
  - 새 값(앞 단계): **"높이 오르지 않게 경보음을 켭시다."**
- **6.1 오답2** [기타] "수치는 모니터 위쪽에서 읽어요." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"수치는 화면 위쪽에 떠요."**
- **6.1 빈칸** [정답둘] too fast/too early/too often/too high (정답 too high) — too fast·too early — '너무 빨리 오르지 않게'가 그대로 성립(정답 둘). 빈칸을 climb으로(too high와 어긋나는 동사)
  - 새 값: answer `climb` · drop / fall / sink / climb
- **6.2 오답1** [안전] "말씀하시기 전에 복부를 봐 주세요." — '말씀하시기 전에 복부를 봐' — 알리기 전에 다시 보게 함(보고를 늦춤)
  - 새 값(같은 틀 세부): **"복부가 너무 팽팽해지면 압력을 낮춰 주세요."**
- **6.3 오답1** [기타] "압력 수치는 숫자와 막대로 나와요." — 둘 다 사실문 — 감시는 남는 같은 틀(읽어 주기)
  - 새 값(같은 틀 세부): **"압력 수치를 소리 내어 읽어 줄게요."**
- **6.4 오답1** [기타] "15는 눈금에 빨간 선으로 보여요." — 둘 다 사실문 — 15 아래 유지의 앞 단계(기기 한계 설정)
  - 새 값(앞 단계): **"15 한계를 기기에 걸어 둡시다."**
- **6.5 오답1** [기타] "복부 쪽 상태를 조금 확인합시다." — '복부 쪽 상태를 조금 확인합시다' — 상태 보고를 모호한 행동으로(뜻이 흐림)
  - 새 값(사실): **"팽창은 기복 가스 때문이에요."**
- **6.5 오답2** [안전] "복부에 거즈가 조금 붙었습니다." — '거즈가 조금 붙었습니다' — 팽창 경고를 가벼운 일로(잘못된 안심)
  - 새 값(같은 틀 세부): **"복부가 조금 단단해진 것 같습니다."**
- **6.5 빈칸** [정답둘] distended/relaxed/flattened/bruised (정답 distended) — bruised·flattened — 복부 관찰 보고로 성립해 ko 없이 못 정함. 빈칸을 abdomen으로
  - 새 값: answer `abdomen` · abdomen / monitor / screen / cable
- **order** [안전] 4줄 시간 한정(TASK 10번) — 'After I call it out, tell me…'는 복부가 팽팽해진 것을 내가 수치를 읽어 준 뒤에만 알리게 해 보고를 늦춤
  - 4줄: en "Besides my readings, tell me if the abdomen gets too tense." · ko "제 수치와 별도로, 복부가 너무 팽팽해지면 말씀해 주세요"
  - why: "현재 압력을 보고하고, 너무 높이 오르지 않게 하자고 하고, 그러려고 수치를 지켜보며 읽어 주고, 그 수치와 별도로 복부가 팽팽해지면 알려 달라고 하는 순서예요. it과 my readings가 앞 줄을 가리켜 순서가 하나로 정해져요."

### 7. CO2 흡수 EtCO2 상승
- **7.0 오답1** [안전] "CO2를 흡수하면서 EtCO2를 지켜보고 있습니다." — 'EtCO2를 지켜보고 있습니다' — 상승 보고가 빠짐(잘못된 안심). 상승은 남기고 원인만
  - 새 값(같은 틀 세부): **"CO2를 주입하면서 EtCO2가 오르고 있습니다."**
- **7.1 오답1** [기타] "분당 환기량은 모니터에 뜹니다." — 둘 다 사실문 — 바로 앞 단계(설정 화면으로)
  - 새 값(앞 단계): **"환기 설정 화면으로 갑시다."**
- **7.1 오답2** [기타] "분당 환기량은 리터로 셉니다." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"환기량은 리터로 세요."**
- **7.2 오답1** [기타] "기복 압력은 집도의가 설정해 둡니다." — 둘 다 사실문 — 낮추기를 남긴 앞 단계
  - 새 값(앞 단계): **"압력을 낮추는 시점을 집도의와 정해요."**
- **7.2 오답2** [기타] "기복 압력이 낮으면 시야가 좁아집니다." — '낮으면' — 면 표지(정답 ko에 없음) + 두 오답 모두 정답보다 김
  - 새 값(사실): **"낮은 압력은 시야를 좁게 만듭니다."**
- **7.3 오답1** [안전] "EtCO2 수치를 꾸준히 지켜보고 있습니다." — '지켜보고 있습니다' — 상승 보고가 빠짐(잘못된 안심). 상승은 남기고 '꾸준히'만
  - 새 값(같은 틀 세부): **"EtCO2 수치가 갑자기 오르고 있습니다."**
- **7.3 빈칸** [정답둘] flashing/beeping/climbing/printing (정답 climbing) — flashing·beeping — 모니터 수치가 깜박이는 보고로 성립(정답 둘)
  - 새 값: answer `climbing` · printing / climbing / spelling / folding
- **7.4 오답1** [기타] "환기 설정은 마취과가 맡습니다." — 둘 다 사실문 — 감시하는 같은 틀
  - 새 값(같은 틀 세부): **"환기 설정을 크게 띄웁시다."**
- **7.4 빈칸** [정답둘] settings/tubing/filters/labels (정답 settings) — tubing — 환기 회로 꺾임 감시로 성립(정답 둘)
  - 새 값: answer `settings` · labels / colors / settings / filters
- **7.5 오답1** [안전] "마취과에 알리기 직전에 압력을 볼게요." — '알리기 직전에 압력을 볼게요' — 보고 전에 다시 재기(보고를 늦춤) + 직전 표지
  - 새 값(사실): **"압력을 낮추는 일은 집도의가 결정해요."**
- **7.5 빈칸** [정답둘] pressure/table/tank/bed (정답 pressure) — table·bed — '테이블을 내려야 하면 마취과에 알림'이 성립(정답 둘)
  - 새 값: answer `pressure` · tank / clock / curtain / pressure
- **order** [기타] swap34 자연스러움 — '…increase minute ventilation. / If the numbers keep climbing, we may need to lower… / With the ventilation up, let's watch the settings.'가 그대로 성립(4줄이 3줄을 가리키지 않음)
  - 3줄: en "With the ventilation up, let's watch the EtCO2 closely." · ko "환기를 늘렸으니 EtCO2를 면밀히 지켜봐요"
  - 4줄: en "If it keeps climbing as we watch, we may need to lower the insufflation pressure." · ko "지켜봐도 계속 오르면 기복 압력을 낮춰야 할 수 있어요"
  - why: "EtCO2 상승을 보고하고, 낮추려고 환기를 늘리고, 늘린 뒤 EtCO2를 지켜보고, 지켜봐도 계속 오르면 압력 인하를 예고하는 순서예요. it, With the ventilation up, as we watch가 앞 줄을 가리켜 순서가 하나로 정해져요."

### 8. 로봇팔 충돌 방지
- **8.0 오답1** [기타] "팔들이 너무 느리게 움직이고 있습니다." — 두 오답 모두 정답보다 김 — 같은 보고 틀을 짧게
  - 새 값(같은 틀 세부): **"팔들이 너무 느려지고 있습니다."**
- **8.0 빈칸** [정답둘] loud/warm/close/slow (정답 close) — slow·loud·warm — 로봇팔 상태 보고로 성립해 ko 없이 못 정함
  - 새 값: answer `close` · close / shiny / sticky / quiet
- **8.1 오답1** [기타] "팔을 먼저 멈추고 각도를 다시 잡읍시다." — '팔을 먼저 멈추고' — 먼저 표지 + 간격 두기가 빠짐(일부만). 간격을 남긴 앞 단계로
  - 새 값(앞 단계): **"새 포트 자리를 간격 넓게 표시합시다."**
- **8.1 오답2** [기타] "포트 간격이 좁으면 팔끼리 부딪힙니다." — '좁으면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"좁은 포트 간격은 충돌로 이어집니다."**
- **8.2 오답1** [안전] "카트에서 팔 덮개를 조정할게요." — '팔 덮개를 조정' — 충돌을 막는 위치 조정 대신 다른 일. 조정은 남기고 장소만
  - 새 값(같은 틀 세부): **"콘솔에서 팔 위치를 조정할게요."**
- **8.2 오답2** [기타] "카트 옆면에 팔 위치 표시등이 있어요." — '카트 옆면 표시등' — 근거가 불확실한 사실
  - 새 값(사실): **"팔 위치는 포트 자리에 맞춰요."**
- **8.2 decoy** [정답둘] `for the surgeon` — for the surgeon — 'I'll adjust the arm position for the surgeon.'이 ko에서 장소만 빠진 같은 행동
  - 새 값: `from the console`
- **8.3 오답1** [안전] "팔에 더 굵은 번호를 붙입시다." — '굵은 번호를 붙입시다' — 공간 확보 대신 다른 일
  - 새 값(앞 단계): **"팔 사이 공간을 눈으로 재요."**
- **8.4 오답1** [기타] "각도는 팔 관절에서 정해집니다." — 둘 다 사실문 — 각도를 다시 잡기 바로 앞 단계(쪽은 그대로)
  - 새 값(앞 단계): **"왼쪽 팔 클러치를 눌러 풀게요."**
- **8.4 빈칸** [정답둘] upper/lower/left/far (정답 left) — upper/lower/far — 방향어끼리는 ko 없이 못 정함. 빈칸을 port로
  - 새 값: answer `port` · sink / port / chart / door
- **8.5 오답1** [기타] "팔 충돌은 두 팔이 겹치면 생겨요." — '겹치면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"팔 충돌은 두 팔이 겹칠 때 생겨요."**
- **8.5 decoy** [정답둘] `on the screen` — on the screen — '화면에서 팔 충돌을 살피라'가 그대로 맞는 말
  - 새 값: `arm labels`

### 9. 개복 전환 대비
- **9.0 오답1** [기타] "개방 세트는 기구 수가 많습니다." — 둘 다 사실문 — 같은 틀에서 '대기'만 '카트에 두기'로(방 안, 해 없음)
  - 새 값(같은 틀 세부): **"개방 세트를 카트에 둡시다."**
- **9.0 빈칸** [정답둘] spare/open/extra/small (정답 open) — spare·extra — '예비 세트를 대기'가 그대로 성립(정답 둘)
  - 새 값: answer `open` · dirty / expired / open / empty
- **9.1 오답1** [기타] "전환 속도는 팀 연습에 달렸습니다." — 둘 다 사실문 — 같은 틀(필요하면 빠르게 ~할 수 있다)
  - 새 값(같은 틀 세부): **"필요하면 빠르게 세트를 열 수 있어요."**
- **9.2 오답1** [기타] "개복술 트레이에는 긴 기구가 담깁니다." — 둘 다 사실문 — 같은 틀에서 '준비 상태'만 '뒤 테이블'로(방 안)
  - 새 값(같은 틀 세부): **"개복술 트레이를 뒤 테이블에 둘게요."**
- **9.2 빈칸** [정답둘] thoracotomy/laparotomy/craniotomy/tracheostomy (정답 laparotomy) — tracheostomy — 응급 기도 트레이 대기는 어느 수술방에서나 성립(정답 둘)
  - 새 값: answer `laparotomy` · thoracotomy / craniotomy / cataract / laparotomy
- **9.3 오답1** [기타] "개방 트레이는 보통 방 밖에서 준비됩니다." — 둘 다 사실문 — 확인을 남긴 뒤 단계
  - 새 값(뒤 단계): **"확인한 개방 트레이는 그대로 둡시다."**
- **9.4 decoy** [안전] `is dark` — is dark — '피가 검으면 전환' 같은 틀린 판단 기준을 조립하게 함
  - 새 값: `if the suction`

### 10. 트렌델렌버그 순환 영향
- **10.0 오답1** [기타] "트렌델렌버그는 머리를 낮추는 체위입니다." — 둘 다 사실문 — 같은 체위, '이미 들어감'만 '들어가는 중'으로
  - 새 값(같은 틀 세부): **"지금 가파른 트렌델렌버그로 내리는 중입니다."**
- **10.1 오답1** [기타] "머리가 낮으면 얼굴이 붓기 쉽습니다." — '머리가 낮으면' — 면 표지 + 둘 다 사실문. 혈압 감시를 촘촘히 하는 앞 단계
  - 새 값(앞 단계): **"혈압 커프 주기를 짧게 맞추세요."**
- **10.1 decoy** [기타] `and the blue drape` — and the blue drape — drape가 decoy에 6번(14.0·8.3·10.1·15.1·16.0·18.1) 몰림
  - 새 값: `and the wall clock`
- **10.2 오답1** [기타] "테이블은 리모컨으로 기울기를 조절합니다." — 둘 다 사실문 — 수평 맞추기를 남긴 앞 단계
  - 새 값(앞 단계): **"수평 맞추는 간격을 집도의와 의논합시다."**
- **10.2 빈칸** [정답둘] periodically/carefully/quickly/slowly (정답 periodically) — carefully·slowly — '조심히/천천히 수평'이 그대로 성립(정답 둘). 빈칸을 level로
  - 새 값: answer `level` · level / wipe / label / lock
- **10.2 decoy** [정답둘] `for anesthesia` — for anesthesia — 'Let's level the table for anesthesia.'가 '주기적으로'만 빠진 같은 행동
  - 새 값: `the monitor`
- **10.3 오답1** [기타] "혈압은 체위를 바꾸면 달라집니다." — '바꾸면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"혈압은 체위 영향을 크게 받아요."**
- **10.3 빈칸** [정답둘] pulse/oxygen/glucose/pressure (정답 pressure) — pulse·oxygen — 이 체위에서 맥박·산소가 낮다는 보고로 성립(정답 둘)
  - 새 값: answer `pressure` · clock / pressure / drape / mirror
- **10.4 오답1** [기타] "얼굴과 눈에는 보호 패드를 댑니다." — 둘 다 사실문 — 확인은 남기고 '면밀히'만 '자주'로
  - 새 값(같은 틀 세부): **"얼굴과 눈을 자주 확인합시다."**
- **10.4 빈칸** [정답둘] ears/eyes/nose/lips (정답 eyes) — ears·nose·lips — 트렌델렌버그 얼굴 부종 점검으로 성립(정답 넷). 빈칸을 closely로
  - 새 값: answer `closely` · rarely / loudly / closely / backward
- **order** [안전] 3줄 시간 한정(TASK 10번) — 'Between those, watch the pressure…'는 혈압·부종 감시를 수평 맞추기 사이에만 하게 만듦 + swap23('To ease that'이 부종을 가리켜도 통함)
  - 2줄: en "To ease that steep tilt, let's level the table periodically." · ko "가파른 기울기를 덜려고 주기적으로 테이블을 수평으로 맞춥시다"
  - 3줄: en "Even with those breaks, watch the pressure and facial swelling." · ko "그렇게 쉬어 가도 혈압과 얼굴 부종을 계속 지켜보세요"
  - why: "체위를 알리고, 그 기울기의 영향을 덜려고 테이블을 주기적으로 수평으로 맞추고, 그렇게 쉬어 가도 혈압과 얼굴 부종을 계속 지켜보고, 혈압이 더 떨어지면 알리는 순서예요. that steep tilt와 those breaks와 it이 앞 줄을 가리켜 순서가 하나로 정해져요."

### 11. 장비 고장 대응
- **11.1 오답1** [기타] "튜빙은 기복기와 환자를 이어요." — 둘 다 사실문 — 확인을 남긴 뒤 단계
  - 새 값(뒤 단계): **"확인한 튜빙을 다시 꽂읍시다."**
- **11.1 빈칸** [정답둘] tubing/camera/cart/monitor (정답 tubing) — camera·monitor — '카메라와 연결부 점검'이 성립(정답 둘)
  - 새 값: answer `tubing` · stool / pillow / badge / tubing
- **11.2 오답1** [기타] "가져오기 직전에 문을 열게요." — '가져오기 직전에 문을 열게요' — 직전 표지
  - 새 값(뒤 단계): **"예비 유닛을 바로 꽂을게요."**
- **11.3 오답1** [기타] "교체하기 앞서 전원을 끕시다." — '교체하기 앞서' — 앞서 표지. 표지 없는 바로 앞 단계로
  - 새 값(앞 단계): **"지금 고장 난 기복기 전원을 끕시다."**
- **11.3 빈칸** [정답둘] humidifier/monitor/insufflator/camera (정답 insufflator) — monitor·camera — '예비 모니터로 교체'가 성립(정답 둘)
  - 새 값: answer `insufflator` · insufflator / stretcher / curtain / mattress
- **11.4 오답2** [기타] "압력이 낮으면 복강이 덜 부풀어요." — '낮으면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"낮은 가스 압력은 복강을 덜 부풀게 합니다."**
- **11.4 빈칸** [정답둘] pressure/flow/volume/level (정답 pressure) — flow·volume·level — 가스 유량·양 경고로 성립해 ko 없이 못 정함. 빈칸을 error로
  - 새 값: answer `error` · bar / error / zip / area
- **11.5 오답1** [기타] "재설정하면 저장된 설정이 지워집니다." — '재설정하면' — 면 표지 + 둘 다 사실문
  - 새 값(앞 단계): **"재설정 버튼을 기계 뒤쪽에서 찾을게요."**
- **11.5 decoy** [안전] `and write it down` — and write it down — 조립하면 '재설정하고 적어 둘게요' — 다시 확인을 기록으로 바꿈
  - 새 값: `and the clock`

### 12. 렌즈 시야 관리
- **12.0 빈칸** [정답둘] heating/filling/fogging/lighting (정답 fogging) — heating/lighting up — 'X up' 보고로 성립(정답 둘). 빈칸을 scope로
  - 새 값: answer `scope` · glove / bulb / scope / mask
- **12.1 오답2** [기타] "렌즈 표면은 쉽게 긁힙니다." — 둘 다 사실문 — 같은 틀에서 '김서림'만 '얼룩'으로(같은 상황 다른 문장의 정답 '닦기'는 피함)
  - 새 값(같은 틀 세부): **"렌즈를 데워서 얼룩을 없앱시다."**
- **12.1 빈칸** [정답둘] wrap/warm/rinse/mark (정답 warm) — rinse — '헹구고 김서림 제거'가 성립(정답 둘)
  - 새 값: answer `warm` · mark / count / stamp / warm
- **12.2 오답1** [기타] "스코프는 닦아도 금방 다시 흐려집니다." — 둘 다 사실문 — 같은 틀에서 '빠르게'만 '천천히'로(해 없음)
  - 새 값(같은 틀 세부): **"닦아서 천천히 다시 삽입할게요."**
- **12.2 오답2** [기타] "삽입하면 시야가 순간 끊깁니다." — '삽입하면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"다시 삽입할 땐 시야가 잠깐 끊깁니다."**
- **12.3 오답2** [기타] "시야가 흐리면 조작이 어렵습니다." — '흐리면' — 면 표지 + 둘 다 사실문. 같은 보고 틀(둘 다 스코프를 손볼 일)
  - 새 값(같은 틀 세부): **"시야가 자꾸 어두워집니다."**
- **12.3 빈칸** [정답둘] bright/narrow/blurry/dark (정답 blurry) — dark·narrow — 시야 보고로 성립(정답 둘)
  - 새 값: answer `blurry` · blurry / louder / colder / heavier
- **12.4 오답2** [기타] "워머 온도는 따로 맞춥니다." — 둘 다 사실문 — 담그기 바로 앞 단계
  - 새 값(앞 단계): **"워머 뚜껑을 미리 젖힙시다."**
- **12.4 빈칸** [정답둘] cooler/basin/warmer/dryer (정답 warmer) — basin — 따뜻한 식염수 대야에 담그는 방법으로 성립(정답 둘)
  - 새 값: answer `warmer` · cooler / warmer / dryer / freezer
- **12.5 오답1** [기타] "렌즈를 닦기 전에 장갑부터 바꿀게요." — '장갑부터 바꿀게요' — 장갑 앞 단계가 주제에서 5번 되풀이(12.5·14.3·17.1·18.4·20.1) + 부터 표지
  - 새 값(앞 단계): **"렌즈를 닦기 전에 김서림 방지액을 바를게요."**

### 13. 로봇 응급 언도킹 준비
- **13.0 오답1** [기타] "응급 언도킹은 집도의 지시를 따라요." — 둘 다 사실문 — 검토 바로 앞 단계
  - 새 값(앞 단계): **"언도킹 절차서를 펼칩시다."**
- **13.0 오답2** [기타] "언도킹 절차는 로봇마다 다릅니다." — '다르다' 어간이 오답에만 7번(되풀이 상한)
  - 새 값(사실): **"언도킹 절차는 매뉴얼에 실려 있어요."**
- **13.1 오답1** [기타] "전환해야 할 경우 역할은 미리 정해 둡니다." — 둘 다 사실문(같은 머리말에 사실만 붙임) — 같은 틀에서 '역할'만 '위치'로
  - 새 값(같은 틀 세부): **"전환해야 할 경우 모두 자기 위치를 알고 있습니다."**
- **13.2 오답1** [기타] "해제 방법은 매뉴얼에 적힙니다." — 둘 다 사실문 — 같은 틀에서 '해제 준비'만 '레버 찾기'로
  - 새 값(같은 틀 세부): **"카트에서 해제 레버를 찾을게요."**
- **13.2 빈칸** [정답둘] manual/release/switch/brake (정답 release) — manual — '매뉴얼을 카트에 준비'가 성립(정답 둘)
  - 새 값: answer `release` · pillow / lamp / release / mirror
- **13.3 오답1** [기타] "언도킹 순서는 로봇 매뉴얼에 나옵니다." — 둘 다 사실문 — 같은 틀에서 '아는지 확인'만 '연습'으로(해 없음)
  - 새 값(같은 틀 세부): **"모두 언도킹 순서를 한 번 연습해 봅시다."**
- **13.4 오답1** [기타] "해제 레버는 응급 전용입니다." — 둘 다 사실문 — 같은 틀에서 '연습'만 '확인'으로
  - 새 값(같은 틀 세부): **"지금 해제 레버를 확인해 볼게요."**
- **13.4 빈칸** [정답둘] inspect/oil/tag/practice (정답 practice) — inspect — '해제 레버 점검'이 그대로 맞는 준비(정답 둘)
  - 새 값: answer `practice` · polish / relabel / unplug / practice

### 14. 최소침습 검체 회수
- **14.0 오답2** [기타] "회수백은 검체 크기에 맞춰 고릅니다." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"회수백은 크기가 여러 가지예요."**
- **14.0 빈칸** [정답둘] biohazard/drainage/retrieval/laundry (정답 retrieval) — biohazard — 검체 운반용 생물위해 백으로 성립(정답 둘)
  - 새 값: answer `retrieval` · retrieval / laundry / trash / paper
- **14.1 오답1** [기타] "꺼낸 검체는 병리과로 보냅니다." — 둘 다 사실문 — 꺼낸 뒤 단계
  - 새 값(뒤 단계): **"검체를 바로 용기에 담을게요."**
- **14.2 오답1** [기타] "확인에 앞서 백을 열게요." — '확인에 앞서' — 앞서 표지
  - 새 값(앞 단계): **"확인할 검체를 꺼낼게요."**
- **14.2 빈칸** [정답둘] complete/labeled/damaged/pink (정답 complete) — labeled — '검체에 라벨이 됐는지 확인'이 성립(정답 둘)
  - 새 값: answer `complete` · shiny / complete / folded / sterile
- **14.3 오답1** [기타] "확인 전에 장갑부터 바꿉시다." — '장갑부터 바꿉시다' — 장갑 앞 단계 되풀이 + 부터 표지
  - 새 값(앞 단계): **"확인 전에 백 입구를 벌립시다."**
- **14.3 빈칸** [정답둘] seal/label/weigh/wrap (정답 seal) — label — '라벨 붙이기 전에 백 재확인'이 성립(정답 둘)
  - 새 값: answer `seal` · fold / shake / seal / flip
- **14.4 오답1** [기타] "검체를 온전하고 완전하게 보존합시다." — 두 오답 모두 정답보다 김 — 같은 보고 틀에서 '완전'만 '깨끗'으로
  - 새 값(같은 틀 세부): **"검체가 온전하고 깨끗해 보입니다."**
- **14.4 빈칸** [정답둘] firm/intact/dark/round (정답 intact) — firm·dark·round — 검체 모양 보고로 성립해 ko 없이 못 정함
  - 새 값: answer `intact` · frozen / striped / sticky / intact
- **14.5 빈칸** [정답둘] weigh/label/wrap/tape (정답 label) — weigh·tape — '나가기 전에 무게 재기·테이프 붙이기'가 성립(정답 둘)
  - 새 값: answer `label` · label / stamp / fold / spin
- **14.5 decoy** [안전] `the cart` — the cart — 'I'll label the cart'(검체 대신 카트에 라벨)를 조립하게 함
  - 새 값: `the freezer`

### 15. 기복 가스 색전
- **15.1 decoy** [기타] `a spare drape` — a spare drape — drape 몰림 + 어느 자리에도 뜻이 안 맞음
  - 새 값: `in tank pressure`
- **15.3 오답2** [기타] "눕힌 환자는 머리와 어깨를 함께 받칩니다." — 둘 다 사실문 — 돌리기를 남긴 바로 앞 단계(문장당 하나)
  - 새 값(앞 단계): **"왼쪽으로 돌릴 환자 양옆에 사람을 세웁시다."**
- **15.4 오답1** [기타] "요청하기 직전에 위치를 외칠게요." — '요청하기 직전에 위치를 외칠게요' — 직전 표지
  - 새 값(사실): **"도움은 크고 분명하게 불러요."**
- **15.4 빈칸** [정답둘] supplies/help/gloves/a cart (정답 help) — a cart — 응급 카트(crash cart)를 부르는 말로 성립(정답 둘)
  - 새 값: answer `help` · gloves / help / a pen / paperwork
- **15.4 decoy** [기타] `the elevator` — the elevator — 위기 장면과 동떨어진 우스운 조각(모양으로 걸러짐)
  - 새 값: `for a refill`
- **15.5 오답1** [기타] "압력은 CO2 주입으로 오릅니다." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"압력은 CO2로 오릅니다."**
- **15.5 오답2** [기타] "압력이 높으면 순환이 줄어듭니다." — '높으면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"높은 압력은 정맥 순환을 줄입니다."**
- **15.5 빈칸** [기타] volume/noise/pressure/light (정답 pressure) — volume·noise·light — 장면과 동떨어진 말 둘(파일럿 2번) → 같은 장비 쪽 틀린 말
  - 새 값: answer `pressure` · camera / drape / pressure / light
- **order** [안전] 임상 순서 — 가스 색전 의심 시 가장 먼저 할 일은 기복 중단·가스 해제(원인 제거)인데 카드는 호출을 2줄, 기복 중단을 3줄 'As I call'에 묶어 호출 뒤로 밀림 + swap34('Left lateral … for the gas already in' / 'As I call, stop insufflation')가 그대로 읽혀 순서가 못 박히지 않음(저작자 메모)
  - 2줄: en "On that suspicion, stop insufflation and release the pneumoperitoneum." · ko "그 의심이 들면 기복을 멈추고 복강 가스를 빼요" · note `중단` · icon `siren`
  - 3줄: en "With the gas off, left lateral, head down, and 100% oxygen." · ko "가스를 끊었으면 왼쪽 측위, 머리 낮춤, 100% 산소" · note `체위` · icon `siren`
  - 4줄: en "While we position him, I'll call for help right now." · ko "체위를 잡는 동안 지금 바로 도움을 요청할게요" · note `호출` · icon `pager`
  - why: "징후로 색전을 의심하면 원인인 기복부터 멈추고 가스를 빼고, 가스를 끊었으면 이미 들어간 가스에 왼쪽 측위·머리 낮춤·100% 산소를 하고, 체위를 잡는 동안 도움을 부르는 순서예요. On that suspicion, With the gas off, While we position him이 앞 줄을 가리켜 순서가 하나로 정해져요."

### 16. 트로카 혈관 손상
- **16.0 decoy** [기타] `a loose drape` — a loose drape — drape가 decoy에 6번 몰림
  - 새 값: `a loose clamp`
- **16.1 오답2** [기타] "트로카 손상은 삽입 중에 생겨요." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"혈관 손상은 삽입 때 생겨요."**
- **16.3 decoy** [기타] `with the camera` — with the camera — camera가 decoy에 4번(8.4·15.0·16.3·19.2) 몰림
  - 새 값: `on the monitor`
- **16.4 decoy** [기타] `to the lounge` — to the lounge — 위기 장면과 동떨어진 우스운 조각
  - 새 값: `to the chart`
- **16.5 빈칸** [정답둘] irrigation/suction/cautery/clamps (정답 suction) — clamps·irrigation·cautery — 출혈 장면에서 그대로 필요한 것(정답 넷)
  - 새 값: answer `suction` · smoke / fog / noise / suction
- **order** [기타] swap23 자연스러움 — 'There's brisk bleeding. / At that rate, suspect a major vessel injury. / First, let's apply pressure… / On that suspicion, …'가 그대로 성립('At that rate'가 1줄을 가리킴, 저작자 메모)
  - 3줄: en "Even with pressure on, it's still brisk—suspect a major vessel injury." · ko "압박해도 여전히 빨라요 — 주요 혈관 손상을 의심해요" · note `의심` · icon `siren`
  - why: "출혈을 알리고, 가장 먼저 그 자리를 바로 압박하고, 압박해도 여전히 빠르면 큰 혈관 손상을 의심하고, 그 의심으로 개복 전환 준비와 호출을 하는 순서예요. that site, Even with pressure on, On that suspicion이 앞 줄을 가리켜 순서가 하나로 정해져요."

### 17. 긴급 개복 전환
- **17.0 오답2** [기타] "전환하면 절개가 훨씬 커져요." — '전환하면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"개복은 복강경보다 절개가 훨씬 큽니다."**
- **17.0 decoy** [기타] `to paper` — to paper — 동떨어진 조각
  - 새 값: `to robotic`
- **17.1 오답1** [기타] "개봉하기 직전에 장갑을 확인하세요." — '개봉하기 직전에 장갑을 확인' — 직전 표지 + 장갑 되풀이
  - 새 값(앞 단계): **"개봉할 트레이를 바로 꺼내세요."**
- **17.2 오답1** [기타] "들여오기 앞서 문을 엽시다." — '들여오기 앞서 문을 엽시다' — 앞서 표지
  - 새 값(앞 단계): **"들여올 일손을 고릅시다."**
- **17.3 오답1** [기타] "침착하면 실수가 많이 줄어듭니다." — '침착하면' — 면 표지 + 둘 다 사실문. 같은 틀에서 '침착'만 '목소리'로
  - 새 값(같은 틀 세부): **"빠르게 움직이되 목소리를 낮춥시다."**
- **17.4 빈칸** [정답둘] bin/lid/box/tray (정답 tray) — box — 기구 상자(container)를 여는 말로 성립(정답 둘)
  - 새 값: answer `tray` · tray / window / door / curtain
- **17.5 오답1** [기타] "일손 요청은 소리 내어 합니다." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"일손은 소리 내어 불러요."**
- **17.5 빈칸** [정답둘] clean/sterile/wet/extra (정답 extra) — sterile·clean — '멸균된 손(스크럽한 사람)이 필요'가 성립(정답 둘)
  - 새 값: answer `extra` · wet / extra / cold / tired
- **order** [기타] swap23 자연스러움('On top of that'은 Also처럼 어느 줄 뒤에도 붙음) + 4줄 ko '일손이 오는 동안'이 en(With all of that going on)과 다르고 why의 'hands coming in'이 카드에 없음
  - 3줄: en "With us both on that, let's get another set of hands in the room." · ko "우리 둘이 그걸 맡는 동안 일손을 더 들입시다"
  - 4줄: ko "이 모든 걸 하면서 빠르게, 침착하게 움직여요"
  - why: "전환을 알리고, 그 일로 나는 트레이를 열고 상대는 필드를 준비하고, 둘이 그걸 맡는 동안 일손을 더 들이고, 이 모든 일을 하면서 빠르게 움직이되 침착하라는 순서예요. For that, With us both on that, With all of that going on이 앞 줄을 가리켜 순서가 하나로 정해져요."

### 18. 로봇 고장 긴급 언도킹
- **18.0 오답1** [기타] "로봇은 콘솔과 카트로 나뉩니다." — 둘 다 사실문 — 같은 고장 보고, '반응 없음'만 '경고음'으로(대응 같음)
  - 새 값(같은 틀 세부): **"로봇이 고장 나서 경고음을 내고 있습니다."**
- **18.1 오답1** [기타] "언도킹하기 직전에 팔 위치를 읽읍시다." — '언도킹하기 직전에 팔 위치를 읽읍시다' — 직전 표지
  - 새 값(앞 단계): **"언도킹할 팔 순서를 부릅시다."**
- **18.1 decoy** [기타] `all drapes` — all drapes — drape 몰림
  - 새 값: `all trays`
- **18.2 오답1** [기타] "전환 준비는 소독간호사도 돕습니다." — 둘 다 사실문 — 준비를 남긴 바로 앞 단계
  - 새 값(앞 단계): **"준비할 트레이를 가져오세요."**
- **18.3 decoy** [기타] `to the music` — to the music — 동떨어진 우스운 조각
  - 새 값: `The light source isn't`
- **18.4 오답1** [기타] "풀어내기 앞서 장갑을 낍시다." — '풀어내기 앞서 장갑을' — 앞서 표지 + 장갑 되풀이
  - 새 값(앞 단계): **"손으로 풀 레버를 찾읍시다."**
- **18.4 decoy** [기타] `by phone` — by phone — 동떨어진 우스운 조각
  - 새 값: `by the light`

### 19. 피하기종 호흡 위기
- **19.0 오답1** [기타] "염발음은 손으로 눌러 느낍니다." — 둘 다 사실문 — 같은 보고, 범위를 더 무거운 쪽으로(대응 같음·잘못된 안심 아님)
  - 새 값(같은 틀 세부): **"얼굴까지 염발음이 퍼지고 있습니다."**
- **19.0 빈칸** [정답둘] swelling/redness/numbness/crepitus (정답 crepitus) — swelling — 피하기종은 목까지 붓는 것으로도 보고됨(정답 둘)
  - 새 값: answer `crepitus` · sunburn / redness / crepitus / numbness
- **19.0 decoy** [기타] `the ceiling` — the ceiling — 동떨어진 우스운 조각
  - 새 값: `the waist`
- **19.1 오답1** [기타] "기도 압력은 환기 장치에서 잽니다." — 두 오답 모두 정답보다 김 — 사실문을 짧게
  - 새 값(사실): **"기도 압력은 환기기에서 재요."**
- **19.1 오답2** [기타] "압력이 높으면 폐에 부담입니다." — '높으면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"높은 기도 압력은 폐에 부담을 줍니다."**
- **19.2 오답1** [기타] "복강 내 가스를 빼면 폐가 편해집니다." — '빼면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"복강 내 가스를 빼는 일은 폐의 부담을 덜어 줍니다."**
- **19.2 빈칸** [정답둘] ventilation/circulation/hydration/nutrition (정답 ventilation) — circulation — 가스 해제 후 순환 지원도 성립(정답 둘)
  - 새 값: answer `ventilation` · nutrition / hydration / digestion / ventilation
- **19.3 오답1** [기타] "피부 밑 공기는 눌러 보면 느껴집니다." — '눌러 보면' — 면 표지 + 둘 다 사실문. 같은 소견, '만져짐'만 '들림'으로
  - 새 값(같은 틀 세부): **"피부 밑에서 뿌드득거리는 게 들립니다."**
- **19.4 오답2** [기타] "압력이 빠르게 오르면 환기가 어려워집니다." — '오르면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"빠르게 오르는 기도 압력은 환기를 어렵게 만듭니다."**
- **19.4 빈칸** [기타] pressures/alarms/lights/doors (정답 pressures) — doors — 장면과 동떨어진 말(파일럿 2번)
  - 새 값: answer `pressures` · pressures / alarms / lights / tables
- **19.5 오답1** [기타] "가스를 천천히 빼면 순환이 안정됩니다." — '빼면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"가스를 천천히 빼는 까닭은 순환 때문이에요."**
- **19.5 빈칸** [정답둘] tubing/monitor/airway/chart (정답 airway) — tubing·monitor — '회로·모니터 재확인'이 성립(정답 둘)
  - 새 값: answer `airway` · chart / airway / clock / calendar

### 20. 시야 상실 대량 출혈
- **20.0 오답1** [기타] "시야를 잃으면 영상이 온통 붉게 보입니다." — '잃으면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"피로 가득한 필드는 영상을 온통 붉게 만듭니다."**
- **20.0 decoy** [기타] `of tape` — of tape — 동떨어진 우스운 조각
  - 새 값: `of smoke`
- **20.1 오답1** [기타] "압박을 가하기 앞서 장갑을 낍시다." — '가하기 앞서 장갑을' — 앞서 표지 + 장갑 되풀이
  - 새 값(앞 단계): **"압박을 가할 큰 거즈를 바로 건넵시다."**
- **20.4 오답2** [기타] "압박을 유지하면 출혈이 줄어듭니다." — '유지하면' — 면 표지(정답 ko에 없음)
  - 새 값(사실): **"압박을 계속 유지하는 것은 출혈을 줄입니다."**
- **order** [안전] 3줄 시간 한정(TASK 10번) — 'For when he's back, let's apply pressure…'는 압박을 집도의가 돌아올 때를 위한 대비로 읽혀 지혈을 늦춤
  - 3줄: en "As I call him, let's apply pressure and prepare to convert." · ko "제가 부르는 동안 압박하고 전환을 준비해요"
  - why: "시야를 잃었다고 알리고, 그러니 집도의를 부르고, 부르는 그 순간 압박하며 전환을 준비하고, 압박이 걸린 채로 흡인하며 혈액 팩을 더 들이는 순서예요. With the view gone, As I call him, With pressure on이 앞 줄을 가리켜 순서가 하나로 정해져요."

## order 21장 판정 (인접 교환 1↔2·2↔3·3↔4 전부, `_after_table.txt`에 교환문)

| 상황 | 판정 | 근거 |
|---|---|---|
| S0 복강경 장비 세팅 | 통과 | swap12 'it'이 가리킬 것 없음, swap23 꽂기 전에 켬, swap34 'all of them'을 켜기 전에 확인 |
| S1 기복 CO2 준비 | 통과 | With the tank ready·Now that the limit is set·Once flow checks out |
| S2 카메라·광원 준비 | 통과 | With the light set·Once it's balanced·clean and ready, so |
| S3 로봇 도킹 준비 | 통과 | Once it's in position·With it aligned·Once they're locked |
| S4 트로카 준비 | 고침 | swap34 자연스러움 → 4줄 After the count |
| S5 체위 조정 확인 | 고침 | 3줄 시제(조건절 뒤 완료 상태) → 청유 |
| S6 기복 압력 감시 | 고침(안전) | 4줄 After I call it out(보고를 늦춤) → Besides my readings |
| S7 CO2 흡수 EtCO2 상승 | 고침 | swap34 자연스러움 → 3·4줄 EtCO2 감시·as we watch |
| S8 로봇팔 충돌 방지 | 통과 | To do that·Once they're clear, swap12 원인보다 조치가 먼저 와 어색 |
| S9 개복 전환 대비 | 통과 | that set·With it here·With everything within reach |
| S10 트렌델렌버그 순환 영향 | 고침(안전) | 3줄 Between those(감시를 사이에만) + swap23 → that steep tilt·Even with those breaks |
| S11 장비 고장 대응 | 통과 | The error code·For that·If that doesn't fix it |
| S12 렌즈 시야 관리 | 통과 | Once it's warm·after that |
| S13 로봇 응급 언도킹 준비 | 통과 | With the steps reviewed·Once everyone knows·With the release ready |
| S14 최소침습 검체 회수 | 통과 | Once it's in the bag·When it's out·Once it's confirmed |
| S15 기복 가스 색전 | 고침(안전) | 기복 중단이 호출 뒤(임상 순서) + swap34 → 의심→중단·해제→체위·산소→체위 잡는 동안 호출 |
| S16 트로카 혈관 손상 | 고침 | swap23 자연스러움(At that rate가 1줄을 가리킴) → 3줄 Even with pressure on |
| S17 긴급 개복 전환 | 고침 | swap23(On top of that) + 4줄 ko·why가 en과 다름 → With us both on that |
| S18 로봇 고장 긴급 언도킹 | 통과 | For that, first·For those steps·As we undock |
| S19 피하기종 호흡 위기 | 통과 | On top of that은 1줄로 올 수 없음, With pressures climbing·After that |
| S20 시야 상실 대량 출혈 | 고침(안전) | 3줄 For when he's back(압박을 대비로) → As I call him |


## 문장별 판정 (126문장 전수 — 통과/고침, 오답 모양 전→후)

| 문장 | en | 판정 | 모양 전→후 |
|---|---|---|---|
| 0.0 | Let's set up the laparoscopic tower. | 고침: decoy | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 0.1 | Monitor, light source, and insufflator are on. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 0.2 | I'll confirm everything's working before draping. | 고침: 빈칸 | 앞 단계·사실 → 앞 단계·사실 |
| 0.3 | The monitor screen looks clear and sharp. | 고침: 빈칸 | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 0.4 | Let's check the cables before we plug everything in. | 통과 | 앞 단계·사실 → 앞 단계·사실 |
| 0.5 | I'll turn on the light source now. | 고침: 오답1, decoy | 같은 틀 세부·사실 → 앞 단계·사실 |
| 1.0 | The CO2 tank is full and connected. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 1.1 | Let's set the insufflation pressure limit. | 고침: 오답1, 오답2 | 앞 단계·사실 → 앞 단계·사실 |
| 1.2 | I'll confirm flow before insufflation. | 고침: 오답2, 빈칸 | 앞 단계·사실 → 앞 단계·사실 |
| 1.3 | The tank pressure gauge reads normal. | 고침: 오답1, 빈칸 | 사실·사실 → 앞 단계·사실 |
| 1.4 | Let's keep the flow rate steady. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 같은 틀 세부·사실 |
| 1.5 | I'll double-check that everything's connected. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 같은 틀 세부·사실 |
| 2.0 | Let's white-balance the camera. | 고침: 빈칸 | 같은 틀 세부·같은 틀 세부 → 같은 틀 세부·같은 틀 세부 |
| 2.1 | The light source is at the right intensity. | 고침: 빈칸 | 사실·같은 틀 세부 → 사실·같은 틀 세부 |
| 2.2 | I'll defog the lens before insertion. | 고침: decoy | 앞 단계·사실 → 앞 단계·사실 |
| 2.3 | Let's check the white balance one more time. | 고침: 오답1 | 앞 단계·사실 → 앞 단계·사실 |
| 2.4 | The lens looks clean and ready. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 2.5 | I'll insert the scope slowly. | 고침: 오답1, 빈칸 | 같은 틀 세부·사실 → 앞 단계·사실 |
| 3.0 | Let's bring the robot into position. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 앞 단계·사실 |
| 3.1 | We'll dock the arms to the trocars. | 고침: 오답1 | 앞 단계·사실 → 앞 단계·사실 |
| 3.2 | I'll confirm the cart is aligned. | 고침: 오답1, 빈칸 | 사실·사실 → 뒤 단계·사실 |
| 3.3 | The cart lines up with the port sites. | 고침: 오답2, 빈칸 | 사실·사실 → 사실·뒤 단계 |
| 3.4 | Let's lock the wheels before docking. | 고침: decoy | 앞 단계·사실 → 앞 단계·사실 |
| 3.5 | I'll check that each arm has clearance. | 고침: 오답1, 빈칸 | 사실·사실 → 뒤 단계·사실 |
| 4.0 | Which trocar sizes do you want first? | 고침: 오답1 | 같은 틀 세부·같은 틀 세부 → 같은 틀 세부·같은 틀 세부 |
| 4.1 | I have 5-millimeter and 12-millimeter ready. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 4.2 | Let's confirm the ports before insertion. | 고침: 빈칸, decoy | 앞 단계·사실 → 앞 단계·사실 |
| 4.3 | I'll open the trocar tray now. | 고침: 오답1 | 앞 단계·사실 → 앞 단계·사실 |
| 4.4 | The 5-millimeter port goes in first. | 통과 | 같은 틀 세부·같은 틀 세부 → 같은 틀 세부·같은 틀 세부 |
| 4.5 | Let's count the trocars before we start. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 앞 단계·사실 |
| 5.0 | Let's confirm the positioning and padding. | 고침: 오답1, 빈칸 | 사실·사실 → 앞 단계·사실 |
| 5.1 | Are all pressure points protected? | 고침: 오답1, 오답2, 빈칸 | 같은 틀 세부·같은 틀 세부 → 앞 단계·사실 |
| 5.2 | The patient is secured to the table. | 고침: 빈칸 | 사실·같은 틀 세부 → 사실·같은 틀 세부 |
| 5.3 | Let's check the heels and elbows for padding. | 고침: 오답1, 빈칸 | 같은 틀 세부·사실 → 앞 단계·사실 |
| 5.4 | The arms are tucked safely at the sides. | 고침: 오답2, 빈칸 | 사실·사실 → 사실·뒤 단계 |
| 5.5 | I'll double-check the safety straps. | 고침: 오답1, decoy | 사실·사실 → 같은 틀 세부·사실 |
| 6.0 | The insufflation pressure is at 15. | 고침: 오답1, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 6.1 | Let's not let it climb too high. | 고침: 오답1, 오답2, 빈칸 | 사실·사실 → 앞 단계·사실 |
| 6.2 | Tell me if the abdomen gets too tense. | 고침: 오답1 | 앞 단계·사실 → 같은 틀 세부·사실 |
| 6.3 | I'll watch the pressure number closely. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 6.4 | Let's keep it under 15 if we can. | 고침: 오답1 | 사실·사실 → 앞 단계·사실 |
| 6.5 | The abdomen looks a little distended. | 고침: 오답1, 오답2, 빈칸 | 같은 틀 세부·같은 틀 세부 → 사실·같은 틀 세부 |
| 7.0 | The EtCO2 is rising as we absorb CO2. | 고침: 오답1 | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 7.1 | Let's increase minute ventilation. | 고침: 오답1, 오답2 | 사실·사실 → 앞 단계·사실 |
| 7.2 | We may need to lower the insufflation pressure. | 고침: 오답1, 오답2 | 사실·사실 → 앞 단계·사실 |
| 7.3 | The EtCO2 numbers are climbing steadily. | 고침: 오답1, 빈칸 | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 7.4 | Let's watch the ventilation settings closely. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 7.5 | I'll tell anesthesia if the pressure needs to come down. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 사실·사실 (사실 둘 유지) |
| 8.0 | The arms are getting too close. | 고침: 오답1, 빈칸 | 같은 틀 세부·같은 틀 세부 → 같은 틀 세부·같은 틀 세부 |
| 8.1 | Let's space the ports and re-angle. | 고침: 오답1, 오답2 | 앞 단계·사실 → 앞 단계·사실 |
| 8.2 | I'll adjust the arm position from the cart. | 고침: 오답1, 오답2, decoy | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 8.3 | Let's give the arms more room. | 고침: 오답1 | 같은 틀 세부·사실 → 앞 단계·사실 |
| 8.4 | I'll re-angle the port on the left side. | 고침: 오답1, 빈칸 | 사실·사실 → 앞 단계·사실 |
| 8.5 | Watch for arm collisions during the case. | 고침: 오답1, decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 9.0 | Let's have the open set on standby. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 9.1 | We can convert quickly if needed. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 9.2 | I'll keep the laparotomy tray ready. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 9.3 | Let's confirm the open tray is in the room. | 고침: 오답1 | 사실·사실 → 뒤 단계·사실 |
| 9.4 | We'll convert if the bleeding doesn't stop. | 고침: decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 9.5 | I'll keep the instruments within reach. | 통과 | 같은 틀 세부·같은 틀 세부 → 같은 틀 세부·같은 틀 세부 |
| 10.0 | We're in steep Trendelenburg. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 10.1 | Watch the pressure and facial swelling. | 고침: 오답1, decoy | 사실·사실 → 앞 단계·사실 |
| 10.2 | Let's level the table periodically. | 고침: 오답1, 빈칸, decoy | 사실·사실 → 앞 단계·사실 |
| 10.3 | The pressure looks low in this position. | 고침: 오답1, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 10.4 | Let's check his face and eyes closely. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 10.5 | I'll let you know if his pressure drops further. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 11.0 | The insufflator is showing an error. | 통과 | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 11.1 | Let's check the tubing and connections. | 고침: 오답1, 빈칸 | 사실·사실 → 뒤 단계·사실 |
| 11.2 | I'll grab the backup unit now. | 고침: 오답1 | 앞 단계·사실 → 뒤 단계·사실 |
| 11.3 | Let's swap in the backup insufflator right away. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 앞 단계·사실 |
| 11.4 | The error code says low gas pressure. | 고침: 오답2, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 11.5 | I'll reset the machine and check again. | 고침: 오답1, decoy | 사실·사실 → 앞 단계·사실 |
| 12.0 | The scope is fogging up. | 고침: 빈칸 | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 12.1 | Let's warm and defog the lens. | 고침: 오답2, 빈칸 | 사실·사실 → 사실·같은 틀 세부 |
| 12.2 | I'll clean it and reinsert quickly. | 고침: 오답1, 오답2 | 사실·사실 → 같은 틀 세부·사실 |
| 12.3 | The view keeps getting blurry. | 고침: 오답2, 빈칸 | 사실·사실 → 사실·같은 틀 세부 |
| 12.4 | Let's dip the scope in the warmer. | 고침: 오답2, 빈칸 | 사실·사실 → 사실·앞 단계 |
| 12.5 | I'll wipe the lens before we go back in. | 고침: 오답1 | 앞 단계·사실 → 앞 단계·사실 |
| 13.0 | Let's review the emergency undocking steps. | 고침: 오답1, 오답2 | 사실·사실 → 앞 단계·사실 |
| 13.1 | Everyone knows their role if we need to convert. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 13.2 | I'll keep the release ready at the cart. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 13.3 | Let's make sure everyone knows the undocking sequence. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 13.4 | I'll practice the release lever now. | 고침: 오답1, 빈칸 | 사실·사실 → 같은 틀 세부·사실 |
| 13.5 | We'll undock quickly if the surgeon calls it. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 14.0 | Let's use the retrieval bag for the specimen. | 고침: 오답2, 빈칸 | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 14.1 | We'll bring it out through the port intact. | 고침: 오답1 | 사실·사실 → 뒤 단계·사실 |
| 14.2 | I'll confirm the specimen is complete. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 앞 단계·사실 |
| 14.3 | Let's double-check the bag before we seal it. | 고침: 오답1, 빈칸 | 앞 단계·사실 → 앞 단계·사실 |
| 14.4 | The specimen looks intact and complete. | 고침: 오답1, 빈칸 | 같은 틀 세부·사실 → 같은 틀 세부·사실 |
| 14.5 | I'll label the bag before it leaves the room. | 고침: 빈칸, decoy | 앞 단계·사실 → 앞 단계·사실 |
| 15.0 | Stop insufflation and release the pneumoperitoneum. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 15.1 | Sudden drop in EtCO2 with hypotension—suspect gas embolism. | 고침: decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 15.2 | Left lateral, head down, and 100% oxygen. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 15.3 | Let's get him flat and turn him left-side down. | 고침: 오답2 | 사실·사실 → 사실·앞 단계 |
| 15.4 | I'll call for help right now. | 고침: 오답1, 빈칸, decoy | 앞 단계·사실 → 사실·사실 (사실 둘 유지) |
| 15.5 | We need to lower the pressure immediately. | 고침: 오답1, 오답2, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 16.0 | There's brisk bleeding at the trocar. | 고침: decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 16.1 | Suspect a major vessel injury. | 고침: 오답2 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 16.2 | Let's prep for open conversion and call for help. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 16.3 | Let's apply pressure at the site right away. | 고침: decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 16.4 | I'll call the surgeon back to the field. | 고침: decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 16.5 | We need more suction here. | 고침: 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 17.0 | We're converting to open now. | 고침: 오답2, decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 17.1 | Open the laparotomy tray immediately. | 고침: 오답1 | 앞 단계·사실 → 앞 단계·사실 |
| 17.2 | Let's get another set of hands in the room. | 고침: 오답1 | 앞 단계·사실 → 앞 단계·사실 |
| 17.3 | Let's move quickly and stay calm. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 17.4 | I'll open the tray while you prep the field. | 고침: 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 17.5 | We need extra hands right now. | 고침: 오답1, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 18.0 | The robot has faulted and won't respond. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 18.1 | Let's emergency undock all arms now. | 고침: 오답1, decoy | 앞 단계·사실 → 앞 단계·사실 |
| 18.2 | Prep for open conversion immediately. | 고침: 오답1 | 사실·사실 → 앞 단계·사실 |
| 18.3 | The console isn't responding to any input. | 고침: decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 18.4 | Let's release the clamps by hand. | 고침: 오답1, decoy | 앞 단계·사실 → 앞 단계·사실 |
| 18.5 | I'll call the team to start the emergency steps. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 19.0 | There's crepitus up to the neck. | 고침: 오답1, 빈칸, decoy | 사실·사실 → 같은 틀 세부·사실 |
| 19.1 | The airway pressures are climbing. | 고침: 오답1, 오답2 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 19.2 | Let's release the pneumoperitoneum and support ventilation. | 고침: 오답1, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 19.3 | I can feel crackling under the skin. | 고침: 오답1 | 사실·사실 → 같은 틀 세부·사실 |
| 19.4 | Let's tell anesthesia the pressures are rising fast. | 고침: 오답2, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 19.5 | We'll deflate slowly and recheck the airway. | 고침: 오답1, 빈칸 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 20.0 | We've lost the view—the field is full of blood. | 고침: 오답1, decoy | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 20.1 | Let's apply pressure and prepare to convert. | 고침: 오답1 | 앞 단계·사실 → 앞 단계·사실 |
| 20.2 | Suction and get more units in the room. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 20.3 | Let's get two more units on the way. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 20.4 | I'll pack the area and hold pressure. | 고침: 오답2 | 사실·사실 → 사실·사실 (사실 둘 유지) |
| 20.5 | We need the surgeon back at the table now. | 통과 | 사실·사실 → 사실·사실 (사실 둘 유지) |
