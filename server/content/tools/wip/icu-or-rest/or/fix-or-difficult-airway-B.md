# or-difficult-airway — B 검토 (v46 1~6·8, distractorsKo ①~⑥·되풀이 상한)

대상: `or-difficult-airway.yaml` 문장 106 · order 21장 전수. 번호는 `상황.문장`(0부터, 저작자 메모와 같은 번호).
**새 값 전부를 넣은 사본: `/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/_reviewB_or-difficult-airway_after.yaml`**
(만든 스크립트 `_reviewB_or-difficult-airway_patch.py` — 원본을 읽어 B 필드만 바꿈. 단어·문장 en/ko/chunks/words·nuance는 원본과 같음을 확인.)
검사: `verify_one_theme.py or _reviewB_or-difficult-airway_after.yaml` → 위반 0 · 경고 0 · `==> 통과`. 수정 담당은 이 사본의 B 필드를 그대로 가져가면 됩니다.

## 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 4 | 대체로 사실·말하는 방식 설명. 7.1 "말이 곧 처치"(과장), 12.3 "Stop trying은 부정 명령"(문법 틀림) 2건 |
| 2 빈칸 | 2 | 장면과 동떨어진 오답이 많음(paper/wooden laryngoscope, saturating loudly/sadly, push soap/music/paint, sewing kit, front-of-neck parking/billing, tea, fee, hobby, menu…). 관사로 걸러짐 2(a awake, an familiar), 수 일치 1(another rounds), 정답 둘 4(skilled person, airway box/tray, gently, I'm on charting) |
| 3 decoy | 3 | 조립해 ko와 같은 문장이 되는 것은 없음. 동떨어진 조각(lunch menu, coffee break, holiday schedule, dinner plan, billing…)·처치를 늦추는 조각(to reschedule, for a coffee break, take a break) |
| 4 distractorsKo | 2 | 정답 둘 22문장, 위기 장면 옆 일·지연 5문장, 잘린 한국어 4문장, 위기 지시문에 참인 "세부"(이유 아님) 9문장 |
| 5 order | 3 | 21장 중 인접 교환이 자연스러운 것 3장(S12 2↔3, S13 2↔3, S14 1↔2·2↔3), 임상 순서 오류 2장(S16 메스 뒤 튜브, S19 외과의 기다림) |
| 6 tag·icon | 4 | 태그 10자 이하·역할을 말함, 아이콘 무난 |
| 8 파일럿 갈래 | 2 | 동떨어진 빈칸 오답(갈래 2)이 가장 많음 |

## 세어 본 것
- **오답 둘 다 같은 표지 틀(`~려고/하러/도록`, 정답 ko에 없는 것)**: 0문장(전·후). 표지 오답이 하나 있는 문장 원본 36 → 사본 38(106 중). 위기 문장은 규칙상 이 틀이 남는 자리라 늘었음 — 다만 주제의 1/3이 "~려고 + 준비 동작" 오답을 가져 "~려고면 오답"으로 걸러질 여지가 있음(보고만).
- **오답 둘 다 교과서 사실**: 원본 1문장(8.0 "곧바로 필요해요"·"포화도가 떨어져서요") → 사본 0.
- **위기 지시문에 참인 세부(이유 아님) 오답**: 원본 9문장(15.1·15.2·15.4·16.0·18.1·18.2·18.4·19.1·19.4) → 사본에서 모두 "참인 이유" 또는 "바로 앞 단계 + 려고"로.
- **decoy 모양**: 첫 낱말 the 25 · and 10 · to 9 · a 6 · for 6 · of 3 · if 3 · his 3 (원본) — 한 모양으로 몰리지 않음. 낱말 몰림: room 7 · break 4 · shift 3 · paperwork 3 · billing 2(+빈칸 billing 1) → 사본 room 4 · cart 4, break/shift/paperwork/billing 0.
- **빈칸 오답 되풀이**(3회 이상, 원본): sign·routine·schedule·discharge·empty·dental·color·water·loudly 각 3 → 사본 schedule·dental·water·loudly 해소(나머지 3회는 W18 기준 4 미만).
- **오답 ko에만 나오는 낱말(어간·활용형 직접 셈)**: 원본 상위 — 손 5 · 세 5 · 시간 5 · 설명(설명·설명해·설명할) 5 · 포장(포장·포장째) 5 · 잡(잡아요 4 + 잡으려고 0) — 상한 안. 사본 상위 — 손 5 · 마스크 5 · 시간 5 · 잡(잡아요 4·잡으려고 1) 5 · 카트 4 · 흡인 4 · 산소 4 · 수술 4. 모두 5 이하.

## 심각한 문제
1. **12.2 오답 "우선순위는 튜브가 아니라 산소 탱크예요"** — oxygen ↔ oxygen tank는 들어서 갈리지 않고 뜻도 같음(정답 둘·③ 실패). "경고음은 …산소예요"는 뜻이 안 되는 말이라 듣지 않고 걸러짐.
2. **15.2 오답 "키트를 열어요 — 도움 요청하려고 소리쳐요"** — 정답 두 행동(키트 열기·도움 요청)을 다 품음 → 정답 둘.
3. **13.3 두 오답(조명 담당 / 당신은 기록 담당)** — 기도 위기 시작 선언에서 흡인·기도 담당을 비우는 말. "삽관하는 사람이 기록 담당"은 말이 안 돼 걸러지기도 함.
4. **위기 장면의 옆 일·지연 오답**: 9.3 "잡고 있으려고 손을 닦을게요"(튜브 넣는 순간 손을 뗌), 11.4 "장갑을 바꿔요"·"바꾸려고 모여요", 17.4 "교대 인수를 준비하고", 18.1 "전환하려고 모여요"(실패 기도에서 모임).
5. **order 임상 순서**: S16 4줄 "막 통과 즉시 튜브를 건넨다" — 메스-부지-튜브(DAS) 순서에서 부지가 빠짐. S19 4줄 "외과의가 올 때까지 전경부 계획 유지" — 외과의를 기다린다고 읽힘(완전 폐쇄는 지금 시작).
6. **빈칸 정답 둘**: 18.2 `difficult airway box/tray`(실제로 쓰는 이름), 4.0 `skilled person`, 13.3 `I'm on charting`(기록 담당은 실제 역할), 4.3 `You've got suction/oxygen`, 8.1 `established gently`.
7. 사실 확인 거리(B 범위 밖, 문장 en — A·저작자 notes로): 9.4 "부지가 안 되면 다음은 튜브 교환기" — 교환기는 이미 들어간 튜브를 바꿀 때 쓰는 것이라 실패 후 다음 단계로 보기 어려움. order S9 4줄은 사본에서 "다음 계획으로"로 바꿨음.

## 저작자가 판정을 부탁한 곳
| 문장 | 판정 | 새 값 |
|---|---|---|
| 15.2 (CICO, `Get the cric kit open — call for help.`) | dk1 **실패 — 정답 둘**(두 행동을 다 함). dk2 "키트는 일회용이에요" — 위기 지시문에 이유 아닌 세부, 실패 | dk1 `윤상절개 키트를 열려고 봉인 띠를 당겨요.`(앞 단계) · dk2 `윤상절개 키트를 열어야 산소 길이 생겨요.`(참인 이유) |
| 15.4 (`Let's start the FONA protocol now.`) | dk1 "시작하려고 모두 불러요" 통과(앞 단계·표지 하나). dk2 "프로토콜은 단계가 짧아요" — 세부(이유 아님)이고 사실도 애매, 실패. 정답 둘은 아님 | dk2 `전경부 접근을 해야 산소가 들어가요.` |
| 18.1 (`switch to the failed airway algorithm now`) | dk1 "전환하려고 모여요" **실패 — 지연**·"실패 기도"가 잘림. dk2 "알고리즘은 단계가 정해져 있어요" 세부, 실패. 정답 둘은 아님 | dk1 `실패 기도 알고리즘으로 바꾸려고 카드를 펴요.` · dk2 `알고리즘을 따라야 시도를 되풀이하지 않아요.` |
| 18.2 (`Get the difficult airway cart in immediately.`) | dk1 "들여오려고 문을 잡으세요" 통과. dk2 "카트는 복도에 있어요" — 장소 진술, 위기 지시문이라 이유로 | dk2 `어려운 기도 카트에 백업 장비를 다 모아 둬요.` |
| 19.1 (`We go straight to FONA.`) | dk1 "접근으로 가려고 알려요" **실패 — 잘린 한국어**(전경부 빠짐, '알려요' 대상 없음). dk2 "전경부 접근은 목 앞쪽에서 해요" 동어반복 세부, 실패 | dk1 `전경부로 가려고 목을 펴요.` · dk2 `완전 폐쇄면 위로는 길이 없어요.` |
| 19.4 (`go straight to the cric kit and call for the surgeon`) | dk1 "키트로 가려고 외과의를 부르세요" **실패 — 두 행동을 다 품고 인과가 뒤집힘(정답 둘)**. dk2 "멸균 포장이에요 — 외과의를 부르세요" 세부, 실패 | dk1 `윤상절개 키트로 가려고 몸을 돌려요.` · dk2 `완전 폐쇄라서 외과의 손이 꼭 필요해요.` |
| 13.3 (`I'm on suction, you're on the airway — let's go.`) | 담당 낱말 바꾸기 **둘 다 실패**(위기 시작에서 흡인·기도 담당을 비움; dk2는 말이 안 돼 걸러짐). 빈칸 `charting`도 실제 역할이라 정답 둘 | dk1 `흡인을 맡는 사람이 따로 있어야 시야가 안 가려져요.`(참인 이유) · dk2 `저는 흡인 담당을 맡으려고 흡인기를 미리 켜 둘게요.`(앞 단계) · 빈칸을 `airway`로 옮김: airway / chart / phones / door |
| 12.2 (`The priority is oxygen, not the tube.`) | dk2 '산소 탱크' **실패 — 정답 둘·들리지 않음**. dk1 '경고음은' 뜻이 안 되는 말, 실패. 빈칸 sedation/paralysis는 위험한 처치를 보여 줌(paralysis는 상황에 따라 맞기도 함) | dk1 `우선순위는 수술이 아니라 산소예요.` · dk2 `산소를 우선하려고 튜브를 내려놓아요.` · 빈칸 oxygen / fluids / imaging / labs |

## 고칠 것 — distractorsKo (37문장)
| 문장 | 문제 | 새 값(dk1 · dk2) |
|---|---|---|
| 2.0 | dk1 "수술대 곁" = OR의 bedside(정답 둘) | `어려운 기도 카트를 회복실로 가져오고 있어요.` · (dk2 그대로) |
| 2.2 | dk2 "새로 준비되어" — 들리지 않는 덧말, 뜻 같음 | (dk1 그대로) · `필요하면 카트는 복도에 있어요.` |
| 2.4 | dk2 "확인하려고 포장을 봐요" = 확인 그 자체(정답 둘) | (dk1 그대로) · `윤상갑상막절개 키트를 확인하려고 카트 서랍에서 꺼내요.` |
| 3.2 | dk2 "카트째 놓아 뒀어요" — 여전히 손 닿는 곳(정답 둘) | (dk1 그대로) · `당신 눈에 보이는 곳에 놓아 뒀어요.` |
| 3.3 | dk1 "흐려지면 흡인하려고 팁 들어요" 잘린 한국어 | `시야가 피로 흐려지면 흡인 팁을 건넬게요.` · (dk2 그대로) |
| 4.0 | dk2 "불러 뒀어요" ≈ 준비해 뒀어요 | (dk1 그대로) · `보조할 사람을 한 명 더 찾고 있어요.` |
| 4.2 | dk2 "세 명 대기" — 들리지 않는 숫자, 뜻 겹침 | (dk1 그대로) · `추가 인력이 교대 중이에요.` |
| 5.3 | dk1 "밀착시키려고 양손을 써요" = 밀착 방법(정답 둘) | `잠드는 동안 마스크가 새면 산소가 빠져나가요.` · (dk2 그대로) |
| 6.2 | dk2 "응급 단계" ≈ 백업 단계 | (dk1 그대로) · `모두가 백업 단계를 적어 두어야 해요.` |
| 8.0 | 둘 다 참인 이유(교과서 사실 둘) | `후두마스크를 건네려고 지금 바로 포장을 뜯을게요.` · (dk2 그대로) |
| 8.2 | dk1 "확인하려고 청진해요" = 확인 방법(정답 둘) | `들어가면 흉곽을 보려고 커프를 채워요.` · (dk2 그대로) |
| 8.3 | dk1 "마스크가 계속 새서" ≈ 환기 실패(같은 이유) | `입안 흡인이 끝나서 지금 후두마스크를 넣고 있어요.` · (dk2 그대로) |
| 8.4 | dk2 "안색이 더 붉어지고" = color coming back(정답 둘) | (dk1 그대로) · `좋아요, 흉곽이 오르고 있고 혈압이 돌아오고 있어요.` |
| 9.0 | dk2 "밀어 넣으려고 이걸 건네요" = Here's the bougie(정답 둘) | (dk1 그대로) · `여기 부지요 — 튜브를 넣으려고 끝에 젤을 발라요.` |
| 9.1 | dk2 "포장째 준비" — 여전히 준비됨 | (dk1 그대로) · `튜브 교환기를 소독하러 보냈어요.` |
| 9.3 | dk1 "한 손으로 잡을게요" 뜻 겹침 / dk2 "손을 닦을게요" 그 순간 손을 뗌(안전) | `튜브를 밀어 넣는 동안 부지가 빠지지 않게 하려는 거예요.` · `튜브를 밀어 넣는 동안 부지를 쥐려고 손을 뻗을게요.` |
| 10.4 | dk2 "세 쌍 더" 들리지 않는 숫자, 뜻 겹침 | (dk1 그대로) · `안전하게 마스크를 잡으려면 도와줄 손이 더 필요해요.` |
| 11.1 | dk2 "다음 계획표" ≈ 다음 계획 | (dk1 그대로) · `그 다음엔 다음 환자로 넘어가요.` |
| 11.4 | dk1 "바꾸려고 모여요" 지연 / dk2 "장갑을 바꿔요" 옆 일(안전) | `실패하면 계획을 바꾸려고 알고리즘을 봐요.` · `이번 시도도 실패하면 부종이 더 심해져요.` |
| 12.2 | 위 판정 | `우선순위는 수술이 아니라 산소예요.` · `산소를 우선하려고 튜브를 내려놓아요.` |
| 12.3 | dk2 "포화도가 떨어져서 지금 마스크로 환기" — 정답 행동 그대로(정답 둘) | (dk1 그대로) · `삽관 시도를 멈추면 부종이 덜 생겨요.` |
| 13.3 | 위 판정 | `흡인을 맡는 사람이 따로 있어야 시야가 안 가려져요.` · `저는 흡인 담당을 맡으려고 흡인기를 미리 켜 둘게요.` |
| 14.0 | dk2 "꺼내져 점검돼" ≈ out and ready | (dk1 그대로) · `후두마스크, 부지, 흡인 카테터가 모두 꺼내져 준비돼 있어요.` |
| 15.1 | dk2 세부(이유 아님) | (dk1 그대로) · `산소화가 안 되면 몇 분 안에 뇌가 손상돼요.` |
| 15.2 · 15.4 | 위 판정 | 위 표 |
| 16.0 | dk2 "메스 날은 새것" 세부 | (dk1 그대로) · `윤상절개 키트가 열렸어요 — 포화도가 계속 떨어져요.` |
| 16.1 | dk1 "후두 고정하려고 손 대요" 잘린 한국어 | `후두를 찾으려고 손을 대요.` · (dk2 그대로) |
| 16.2 | dk2 "공기 소리가 들리는 순간" = 막 통과 신호(정답 둘) | (dk1 그대로) · `막을 통과하는 순간 메스를 돌리세요.`(바로 뒤 단계) |
| 16.3 | dk2 "메스를 네 개" 들리지 않는 숫자, 여전히 준비됨 | (dk1 그대로) · `키트가 열렸고 메스는 아직 포장째예요.` |
| 17.3 | dk1 "부정맥" — 서맥도 부정맥(정답 둘) | `산소포화가 안 되고 있고 여전히 고열이에요.` · (dk2 그대로) |
| 17.4 | dk2 "교대 인수를 준비" 위기에 옆 일(안전) | (dk1 그대로) · `코드 대응을 미리 준비해야 심정지 때 늦지 않아요.` |
| 18.1 · 18.2 · 19.1 · 19.4 | 위 판정 | 위 표 |
| 18.4 | dk2 "계획은 마취과 지시를 따라요" 세부 | (dk1 그대로) · `실패 기도 계획을 다 같이 따라야 혼선이 없어요.` |

## 고칠 것 — 빈칸 (사본의 options 그대로; 앞이 정답)
- 0.1 doses/drugs 뜻 안 됨 → predictors / complications / outcomes / treatments
- 0.3 `a awake` 관사 → difficult / routine / planned / smooth
- 0.5 invoice 동떨어짐 → history / schedule / consent / policy
- 1.3 ears/knees/wrists 동떨어짐 → tonsils / teeth / lips / cheeks
- 2.3 paper/wooden laryngoscope 동떨어짐(direct는 정답 둘이라 빈칸 이동) → **together** / tomorrow / downstairs / overnight
- 3.1 price → size / color / brand / label
- 3.3 noisy → bloody / smoky / narrow / foggy
- 4.0 skilled(정답 둘) → second / third / fourth / tenth
- 4.2 `sleeping/waving by` 문법·동떨어짐 → 빈칸 **hands** / carts / beds / lights
- 4.3 suction/oxygen 실제 역할(정답 둘) → cricoid / drapes / linens / gowns
- 4.4 `Stay far` 어색 → close / seated / outside / quiet
- 6.2 hide → know / sign / draw / print
- 6.3 cheaply/quietly/politely 동떨어짐 → 빈칸 **wake** / cheer / warm / tidy
- 7.0 chart → airway / wound / skin / eye
- 8.1 gently(정답 둘) → quickly / quietly / neatly / formally
- 8.2 cancel/borrow 동떨어짐 → confirm / chart / print / sign
- 9.3 `wash/weigh the bougie steady` 문법 → 빈칸 **steady** / loose / slack / sideways
- 9.4 mattress → exchanger / camera / monitor / catheter
- 10.1 rinse → improve / limit / block / measure
- 10.4 loudly/cheaply/randomly → safely / flat / prone / later
- 11.3 two/five/ten/twenty — 숫자는 영어로 추론 불가 → 빈칸 **loud** / quietly / later / privately
- 12.0 wipe/dress/shave → bag / tube / turn / move
- 12.1 `another rounds`·lunch → attempt / dose / incision / transfer
- 12.2 sedation/paralysis(위험·맞기도 함) → oxygen / fluids / imaging / labs
- 12.3 photograph → intubate / sedate / transfer / extubate
- 12.4 saturating loudly/sadly/rarely(poorly는 위험한 말이 됨) → 빈칸 **saturating** / talking / eating / walking
- 13.3 charting(정답 둘) → 빈칸 **airway** / chart / phones / door
- 15.0 meeting/schedule/policy → situation / drill / simulation / lecture
- 15.1 cosmetic → emergency / routine / elective / planned
- 15.2 tea → help / water / tape / towels
- 16.1 wrist/ankle/elbow → larynx / tongue / pelvis / ankle
- 17.0 flat/thin → low / high / variable / elevated
- 17.4 soap/music/paint → oxygen / the bed / the cart / the door
- 18.0 `an familiar` 관사 → unanticipated / anticipated / expected / obvious
- 18.2 box/tray(실제 이름, 정답 둘) → cart / scale / chair / bed
- 18.3 fee → view / noise / smell / lighting
- 19.1 parking/seating/billing → access / x-ray / exam / massage
- 19.3 wind(≈air) → air / saline / fluid / dust
- 19.4 sewing → cric / lab / dental / suture
- 20.1 bill/menu/poster → alert / drill / lecture / survey
- 20.2 hobby/address → history / schedule / supplies / costs

## 고칠 것 — decoy
0.5 about his billing → `about his last meal` · 9.4 to the night shift → `to the oral airway` · 11.4 and clean the room → `and clean the blade`(room 몰림) · 12.4 take a break(지연) → `wake him up` · 14.4 to any other room → `to any other case`(room 몰림) · 15.0 appointment → `checklist` · 15.1 back-of-room seating → `to scheduled` · 15.2 Get the shift log → `Get the door` · 16.0 the lunch menu → `the gauze` · 16.2 the clipboard → `the skin` · 17.1 to reschedule(지연) → `to reposition` · 17.4 and push paperwork → `and check the IV` · 18.2 Get the laundry cart → `Get the crash cart` · 18.4 dinner plan → `intubation drill` · 19.0 — no visitors(문법·동떨어짐) → `— no saline` · 19.1 parking → `dressing` · 19.2 for a coffee break(지연) → `for a consult` · 19.4 to the whiteboard → `to the code cart` · 20.1 in the mailroom → `in the newsletter` · 20.4 billing alert → `IV access alert`

## 고칠 것 — why
- 7.1 "말이 곧 처치예요"(과장) → `… 각성 삽관은 환자가 깨어 있어서 말로 안심시켜야 협조가 이어져요.`
- 12.3 "Stop trying은 부정 명령"(틀림) → `Stop trying은 하던 일을 끊으라는 명령이고, and 뒤에서 곧바로 할 일을 이어 줘요. now가 지금 이 순간을 못 박아요.`

## 고칠 것 — order (6장)
- S9 4줄(교환기를 실패 후 다음 단계로 — 사실 애매) → `If it still won't pass, we move to the next plan.` / 그래도 안 들어가면 다음 계획으로 넘어가요 (why 끝도 "다음 계획으로")
- S12 2↔3 교환이 자연스러움 → 3줄 `While you bag him, let's get his saturation up before another attempt.` / 백을 짜는 동안 다음 시도 전에 산소포화도를 올려요
- S13 2↔3 교환이 자연스러움 → 3줄 `If anyone's unsure of that split, ask before we start.` / 그 분담이 확실하지 않으면 시작 전에 물어보세요
- S14 1↔2·2↔3 교환이 자연스러움 → 2줄 `That puts the LMA, bougie, and cric kit out and ready.` · 3줄 `I've checked that all three are within reach.` · 4줄 `So we're ready to move to any backup plan quickly.`
- S16 4줄 메스 뒤 바로 튜브(부지 빠짐) → `As soon as you say so, I'll hand you the bougie.` / 말씀하시는 즉시 부지를 건네드릴게요 (why도 부지로)
- S19 4줄 외과의를 기다린다고 읽힘 → `Start the cric now — the surgeon can take over on arrival.` / 지금 윤상절개를 시작하고, 외과의가 오면 넘겨요 (icon scalpel, why "기다리지 말고 지금 시작")
- 나머지 15장 통과(ko 머리말 "… 4문장 순서"·태그 "대화 흐름" 일관).

## 종합
문장 en·ko·chunks에는 손대지 않았습니다. 사본의 B 필드를 그대로 반영하면 검사 통과(위반 0·경고 0)이고, 그 뒤 내보내도 됩니다. 9.4 문장 en(교환기를 다음 단계로)은 A·저작자 notes에서 판단할 거리입니다.
