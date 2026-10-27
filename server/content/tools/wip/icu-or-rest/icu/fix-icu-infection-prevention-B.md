# fix-icu-infection-prevention-B — 한 번에 저작 B 검토 (v46 1~6·8, distractorsKo ①~⑥ + 되풀이 상한)

대상: `icu-infection-prevention.yaml` (21상황 · 문장 106 · order 21장). 문장 번호 #n은 파일 순서(상황 1부터 이어 셈).
전수 덤프(`en | ko | 오답1 | 오답2`, 빈칸 4줄, order 인접 교환 1↔2·2↔3·3↔4)를 스크립트로 뽑아 한 줄씩 판정했습니다.
표기: **[안전]** 학습자가 그대로 하면 손위생·보호구·격리·무균·노출 대응의 단계가 빠지거나 대상·순서가 바뀌는 것, 넣어 읽으면 위험한 지시·지연이 되는 것 /
**[정답 둘]** 정답으로도 맞거나 순서가 하나로 안 박히는 것 / **[기타]** 장면과 동떨어진 오답·관사·길이·사실 보강.

## 항목별 점수
| 항목 | 점수 | 근거 |
|---|---|---|
| 1 why | 3 | 대체로 말하는 방식의 이유를 말함. 사실 문제 #6(젤이 비누보다 낫다는 투 — C. diff 상황과 모순), #96(PEP "오늘"), ko 되풀이 4건 |
| 2 빈칸 | 2 | 약 60문장이 장면과 동떨어진 오답(weather·menu·wedding·joke·hobby…). 관사로 걸러짐 2(#83 `a expensive`, #105 `get discount`), 정답 둘 3, 위험 읽기 3 |
| 3 decoy | 3 | 지연·시간 한정 decoy 6건(#60 `in the morning`, #99 `by lunch` 등), 덧붙여 넣어도 ko에 맞는 decoy 9건 |
| 4 distractorsKo | 2 | 길이(V20)·되풀이 상한은 통과. 그러나 처치 문장 오답이 **정답 행동 대신 다른 일**을 시키거나 격리·보호구 **대상/장소만 바꾼** 것이 약 40문장 |
| 5 order | 2 | 21장 중 9장이 인접 교환에도 자연스러움, 15단어 초과 4줄, S19 임상 순서 오류, S1 벗은 뒤 손위생 누락 |
| 6 tag·icon | 5 | 전부 10자 이하·NbIcon 목록 안, 상황 안에서 일관. 고칠 것 없음 |
| 8 파일럿 갈래 | 2 | 갈래 2(동떨어진 빈칸)·3(order 못 박힘)·4(임상 순서)·5(decoy 겹침)가 모두 되풀이됨 |

되풀이 상한(조사 뗀 어간, 정답 ko에 없는 낱말): 현재 최대 `한`(숫자) 6·`약사` 5 — **통과**. 아래 새 값을 전부 넣은 사본으로 다시 세면 최대 `문`·`약사` 5, `한` 6, 길이 위반 0(스크립트로 확인).

## 심각한 문제
1. **손위생·보호구·격리 문장의 오답이 "그 순간 정답 행동 대신 하는 일"** — #3(벗는 순서 대신 "간호사에게 알리고 문을 닫으세요"), #4(손 젤 대신 "방문 기록/인터폰"), #51·#83(보호구 착용 대상을 "지켜보는 사람/요청한 사람/환자"로), #60(접촉주의 대신 낙상·흡인주의), #82(음압 병실 대신 휠체어/보호자), #87·#99·#101(격리 강화·복구 대신 일정·보고서·면회제한).
2. **장소만 바꾼 손위생·소독 오답(저작자 우려 적중)** — #58 "다른 병동/수술방에서는 비누와 물"·#61 "다른 병동에서는 표백제 물티슈"는 그대로 믿으면 **C. diff 병실에서 젤·알코올만 씀**. #1은 "식사/검사 전후"로 시점만 바꿔 방문 전후 손위생이 빠짐.
3. **"의학적 이유가 없으면 카테터 제거" 오답(저작자 우려 적중)** — #15 산소줄·위관, #43 양말·전극: 다른 기구를 빼는 처치로 바꿈(처치 대상 바꾸기 금지), #43은 영어가 `it`이라 바꾼 자리가 들리지도 않음.
4. **바늘 노출 대응** — #93·#94·#96 오답이 PEP **평가/시작 대신 "교육·설명"**(처치 지연), order S19는 **원환자 상태를 확인한 뒤에 보고**하고 **평가 전에 PEP를 시작**(CDC: 씻기 → 즉시 보고 → 원환자·노출자 평가 → PEP 가능한 한 빨리, 몇 시간 안).
5. **무균 술기 대상 변경** — #11(시트·환자복에 무균 기법), #33(시트·팔찌를 무균 교체) → 드레싱은 그대로 둠.
6. **지연 decoy** — #60 `in the morning`(격리 내일 아침), #99 `by lunch`(보호격리 점심까지), #84 `after the shift`(노출 보고 근무 뒤), #78·#101(주의조치를 `for a while`/`for the shift`로 시간 한정), #21 `twice a month`(구강간호 한 달 두 번).
7. **위험한 빈칸 읽기** — #58 `towels/tissues/napkins and water`(비누 없는 손 씻기), #90 `lighter precautions`, #7 `artery`(약을 동맥으로).

## 고칠 것

### A. distractorsKo (43문장)
- #1 손위생·PPE · [안전] 시점만 바꿔 방문 전후 손위생이 빠짐 → `방문 전후로 비누와 물로 손을 씻어 주세요` · `면회 중에도 젤로 손을 소독해 주세요`
- #3 · [안전] 두 오답 모두 장갑·가운 벗기를 다른 일로 대신 → `나가실 때는 가운을 벗은 뒤, 문 앞에서 손을 소독하세요`(뒤 단계) · `나가실 때는 벗은 장갑과 가운을 병실 안 통에 버리세요`
- #4 · [안전] 손 젤 대신 방문 기록·인터폰 → `병실에 들어오거나 나갈 때마다 비누로 손을 씻으세요` · `병실 안에 있는 동안에도 손 젤을 자주 사용하세요`
- #7 CLABSI · [정답 둘] X1 "팔 정맥" — PICC도 중심라인이라 장면상 맞을 수 있음 → X1 `이 중심라인으로 큰 정맥의 압력을 잴 수 있어요`(참인 다른 쓰임, 들리는 자리 give medications)
- #11 · [안전] 무균 기법 대상을 시트·환자복으로 → `라인 드레싱을 교체한 뒤에는 날짜를 적어 둬요` · `라인 드레싱을 교체하기 전에 손위생을 먼저 해요`
- #12 CAUTI · [안전] X2 "소변 색 확인" — 필요성 평가를 빠뜨림 → X2 `식사 때마다 소변줄이 아직 필요한지 확인해요`
- #15 · [안전] 다른 기구(산소줄·위관) 제거 → `카테터를 유지할 의학적 이유가 없으면 의사에게 알려요` · `카테터를 유지할 의학적 이유가 있는지 매일 따져 봐요`
- #16 · [정답 둘] X2 "제거 방법" — `about removing it`이 여부·방법 둘 다로 들림 → X2 `회진 때 제거 여부를 수간호사에게 물어볼게요`
- #17 VAP · [안전] X1 "침대 난간을 올려" — 머리 올리기 대신(난간 넷=억제대 소지) → X1 `얼굴 붓기를 줄이려고 침대 머리를 올려 두고 있어요`
- #20 · [안전] X2 "침대 다리를 올려" — 흡인 위험 체위 → X2 `침대 머리를 올려 두면 두통 예방에 도움이 돼요`
- #22 격리 표지 · [안전] X2 "병실 청소를 위해" — 가족이 가운을 청소용으로 오해 → X2 `저 불빛은 접촉격리를 위해 가운과 장갑을 사용한다는 뜻이에요`
- #24 · [정답 둘] X2 "모두 건강해요" — safe와 뜻이 겹치고 잘못된 안심 → X2 `표지를 따르면 보호자분, 의사분, 다른 환자들 모두 안전해요`
- #29 기구 소독 · [안전] X1 닦기 대신 충전, X2 장소(주방)로 침상 전 소독이 빠짐 → `공용 기기는 침상에서 나갈 때도 닦아 둬요` · `공용 기기는 침상에 오기 전에 소독 표시를 붙여요`
- #30 · [안전] X2 "펌프를 켜요" — 닦기 대신 → X2 `환자마다 이 리모컨과 펌프를 닦아요`
- #33 드레싱 · [안전] 무균 교체 대상을 시트·팔찌로 → `바로 무균 교체에 쓸 물품을 챙길게요` · `교체한 드레싱에 오늘 날짜를 적을게요`
- #36 · [안전] X2 "일정대로 주문" — 교체 대신 → X2 `드레싱 날짜를 확인하고 교체 물품을 챙겨요`
- #42 도뇨 평가 · [안전] 적응증 확인 대신 크기·소재 → `근무마다 환자별 카테터 적응증을 확인하죠` · `오늘 적응증 없는 카테터는 제거를 요청하죠`
- #43 · [안전] 양말·전극 제거 + `it`이라 바꾼 자리가 안 들림(③) → `분명한 이유가 없으면 의사에게 제거를 묻죠` · `분명한 이유가 있는지 먼저 차트를 보죠`
- #45 · [안전] X2 "청구서를 확인" — 적응증 확인 대신, 장면 밖 → X2 `매일 저녁 회진 때 적응증을 확인해요`
- #49 이송 · [안전] 스캐너 소독 대신 점검·예약 → `직원들은 개인보호구를 착용하고 이후 이송 침대를 소독해야 해요` · `…이후 엘리베이터를 소독해야 해요`(물건만 바꿈)
- #50 · [기타] X2 "미리 방송" — 격리 사실 원내 방송은 개인정보 노출 → X2 `격리 사실을 CT팀이 알도록 미리 문자할게요`
- #51 · [안전] 보호구 착용 대상 변경 → `이송이 끝난 사람은 모두 가운과 장갑을 벗어야 해요` · `이송에 참여하는 사람에게 모두 격리 사실을 알려야 해요`
- #58 C. diff · [안전] 장소만 바꿈(여기서는 젤만 써도 된다는 뜻이 됨) → `여기서는 물티슈만이 아니라 비누와 물로 손위생을 해야 해요` · `여기서는 장갑만이 아니라 비누와 물로 손위생을 해야 해요`
- #60 · [안전] 접촉주의 대신 낙상·흡인주의 → `이분 문에 바로 접촉주의 표지를 붙이죠` · `이분 방 앞에 바로 가운을 채워 두죠`
- #61 · [안전] X1 "다른 병동에서는" — 이 병실에서 알코올 물티슈를 쓰게 됨 → X1 `여기서는 일반 걸레가 아니라 표백제 물티슈를 써요`
- #62 · [기타] X1 약 이름(항생제→진통제) 바꾸기 금지 → X1 `긴 항생제 요법은 C. diff나 진균 같은 알레르기로 이어질 수 있어요`
- #72 · [정답 둘] X2 "양성 혈액 결과" — 혈액 배양도 배양 → X2 `어제 나온 양성 배양 결과와 격리 상태를 보고할게요`
- #75 · [정답 둘] X1 "혈액 결과" — 같은 이유 → X1 `피부 검사가 내성균 양성으로 나왔어요`
- #81 클러스터 · [안전] 환자 대신 보호자 선별, "예약"(지연) → `병동의 다른 환자 명단부터 바로 뽑아 두죠` · `병동의 다른 환자들 결과를 바로 감염팀에 보내죠`
- #82 공기매개 · [안전] 음압 병실 대신 휠체어 / 대상 보호자 → `이 환자는 바로 음압 병실 점검이 필요해요` · `이 환자는 음압 병실에서 문을 닫아 둬야 해요`
- #83 · [안전] N95 착용 대상을 "밖에서 지켜보는 사람/환자"로 → `나오는 사람은 모두 문 밖에서 N95를 벗어야 해요` · `들어가는 사람은 모두 밀착검사 기록을 확인해야 해요`
- #84 · [안전] X1 사람 대신 장비, X2 보고 대신 "배치"(노출자 투입) → `보호구 없이 노출된 시각과 장소를 파악해서 보고하죠` · `노출된 사람을 보고한 뒤 직원보건실로 보내죠`
- #85 · [안전] X1 "접촉격리실" — 격리 종류를 바꿈 → X1 `들어가시기 전에 맞는 N95를 가져다드릴게요 — 꼭 밀착 확인을 하세요`
- #86 · [안전] 보고 대신 교육, N95 대신 가운 → `N95 없이 들어간 사람은 오늘 직원보건실에 가야 해요` · `N95 없이 들어간 시각은 오늘 보고해야 해요`
- #87 MDRO · [안전] 격리 강화 대신 일정·보고서 → `이 바이러스는 빠르게 퍼질 수 있어서 격리를 강화해야 해요` · `이 내성균은 오래 살아남을 수 있어서 격리를 강화해야 해요`
- #92 바늘 노출 · [안전] "먼저" 세척 대신 다른 일 → `씻은 뒤에는 깨끗한 거즈로 덮어 두세요` · `씻기 전에 오염된 장갑부터 벗으세요`
- #93 · [안전] PEP 평가 대신 교육·설명(지연) → `부위를 바로 씻고 PEP 평가를 받으셔야 해요` · `이걸 바로 보고하고 원환자 검사도 요청해야 해요`
- #94 · [안전] 프로토콜 시작 대신 설명, 상태 대신 이름 → `원환자 상태를 확인하고 결과를 직원보건실에 알리죠` · `노출 부위를 확인하고 프로토콜을 시작하죠`
- #96 · [안전] X1 시작 대신 설명(지연), X2 "사고" = exposure(정답 둘) → `오늘 노출을 보고하고 원환자 검사를 요청할게요` · `오늘 노출 부위를 씻고 PEP 프로토콜을 시작할게요`
- #99 면역저하 · [안전] 복구 대신 안내 / 보호격리 대신 면회제한 → `보호격리를 복구하기 전에 손위생부터 하죠` · `보호격리 표지를 즉시 문에 다시 붙이죠`
- #101 · [안전] 주의조치 복구 대신 일정·점검 → `모두 다시 가운을 입고 지금 마스크도 새로 쓰죠` · `모두 다시 가운을 입고 나서 장갑까지 끼도록 하죠`
- #102 자원 배분 · [안전] X1 기준을 "입원 순서"로 — 배분 기준 자체를 바꿈 → X1 `병상이 부족해서 전파 위험에 따라 우선순위를 정해요`
- #105 · [안전] X1 기준 "입원이 가장 빠른", X2 침상≈병실(정답 둘) → `전파 위험이 가장 높은 환자가 검사 우선순위를 받아요` · `전파 위험이 가장 높은 환자가 이송 우선순위를 받아요`

통과로 둔 것(참고): #2·#5(앞 단계), #9·#10(더 잦은 확인 — 무해), #27·#56(물건만), #47(시트는 유지, 라인 덮기 대신 침대 닦기는 경미), #52·#55·#77·#80·#91(숫자 — 상한 안), #66·#69·#71·#78(알릴 사람 — 브리프 허용).

### B. 빈칸 선택지 (63문장) — 정답은 그대로, 오답만 교체
안전·정답 둘:
- #7 · [안전] `artery` — 약을 동맥으로 주는 경로 → `nerve`
- #58 · [안전] `towels/tissues/napkins and water` — 비누 없는 손 씻기로 읽힘 → 빈칸을 `hygiene`으로 옮기고 `hygiene / lotion / cream / massage`
- #90 · [안전] `lighter precautions` — 완화 지시 → `newer`
- #70 · [정답 둘] `wet` — 배액이 있는 감염 소견으로 장면상 맞음 → `cold`
- #80 · [정답 둘] `in one hour` — 더 강한 경고라 정답으로도 맞음 → `career`
- #84 · [정답 둘] `without warning` — 장면상 성립 → `insurance`

장면과 동떨어짐·관사(같은 분야의 틀린 말로) — 모두 [기타]:
- #8 `bright/quiet/soft` → `warm / thick / cool`  · #9 `every time`(문법으로 걸러짐) → `every week`
- #10 `meal/nap/snack` → `week / month / visit` · #14 `meals/naps/lunches` → 빈칸을 `bring`으로: `bring / pick / give / look`
- #17 `hair` → `skin` · #19 `speed/price` → `fear / signs`(cost 유지) · #21 `shoes` → `beard`
- #24 `sleepy/hungry/bored` → `calm / warm / quiet` · #25 `buy/sell/wash` → `carry / fold / bring`
- #26 `safe`가 #24와 같은 정답 → 빈칸을 `blame`으로: `blame / cost / time / luck`
- #27 `decorate/photograph/sell` → `charge / label / inspect` · #28 `naps/lessons` → `shifts / doses`
- #29 `elevator/cafeteria/lobby` → `desk / storeroom / elevator` · #30 `radio` → `phone`
- #32 `heavy/bright/dark` → `tight / clear / fresh` · #34 `dry`가 #8과 같은 정답 → 빈칸을 `sealed`로: `sealed / folded / heated / stretched`
- #38 `paid/sold/won` → `planned / started / ordered` · #39 `rename` → `question` · #41 `budget/menu/weather` → `supplies / schedule / cost`
- #42 `invoice/hobby/diet` → `size / brand / supply` · #43 `small/loud/yellow` → `personal / social / cosmetic`
- #45 `games/parties/trips` → `break / leave / vacation` · #46 `visitors` → `medications`
- #48 `paint/rent/decorate` → `lock / leave / light` · #49 `photocopy` → `reboot`
- #50 `weather/menu/payroll` → `discharge / billing / visitors` · #51 `badge` → `cap`
- #52 `weigh/rename` → `separate / transfer` · #53 `Colorful` → `Temporary`
- #59 `count/name/draw` → `find / test / collect` · #60 `fire` → `fall`
- #62 `pollen/dust/smoke` → `flu / measles / tetanus` · #64 `rooms/bags/forms` → `orders / visitors / supplies`
- #65 `snacks` → `fluids` · #66 `cook/driver/guard` → `family / lab / desk`
- #68 `laughter/boredom` → `numbness / cough` · #69 `bet/joke`(문법) → `wonder / forget`
- #71 `meal/music/movie` → `dose / diet / discharge` · #72 `calendar/recipe/diary` → `balance / pressure / feedback`
- #73 `holiday/wedding/concert` → `discharge / billing / expiration` · #75 `signature/contract/ticket` → `scan / x-ray / EKG`
- #76 시간 단위 돌려쓰기(`weekly/monthly/yearly`) → 빈칸을 `surveillance`로: `surveillance / night / school / travel`
- #77 `holiday/vacation/wedding` → `allergy / recovery / discharge` · #79 `catering/parking/decorating` → `fasting / sedating / feeding`
- #81 `paint/quiz` → `feed / wake` · #82 `chair/shower/closet` → `dressing / pump / mattress`
- #83 `a expensive`(관사) + 동떨어짐 → `labeled / printed / boxed`
- #85 `colorful/cheap/famous` → 빈칸을 `airborne`으로: `airborne / contact / droplet / protective`
- #86 `hired/paid` → `discharged / admitted` · #87 `uniform/music/lighting` → `security / schedules / budgets`
- #89 `invite/pay/thank` → `discharge / feed / weigh` · #92 `sugar/juice/oil` → `ice / salt / milk`
- #98 `famous` → `senior` · #100 `joke/secret/gift` → `comfort / mystery / bargain` · #102 `famous` → `flexible`
- #105 `discount`(관사로 걸러짐) → `credit` · #106 `dishes/photos/songs` → `shifts / schedules / meals`

### C. decoy (18문장)
- #60 · [안전] `in the morning` → 조립 "start contact precautions … in the morning"(격리 지연) → `at the nurses' station`
- #99 · [안전] `by lunch` → 보호격리 복구 지연 → `at the door`
- #84 · [안전] `after the shift` → "report it after the shift"(노출 보고 지연) → `on the third floor`
- #78 · [안전] `for a while` → 주의조치 강화를 시간 한정 → `in the lounge`
- #101 · [안전] `for the shift` → 같은 이유 → `in the lobby`
- #21 · [안전] `twice a month` → 구강간호 한 달 두 번 → `with a swab`
- #15 · [정답 둘] `on the chart` → "If there's no medical reason on the chart, we take it out"이 ko에 맞음 → `for the paperwork`
- #14 · [기타] `after dinner` → 회진 논의 지연 → `in the lobby`
- #36 · [기타] `at random` → 정답(on schedule)의 반대말 → `at the desk`
- 덧붙여 넣어도 ko에 맞는 문장이 되는 것 — 모두 [정답 둘]: #11 `at the bedside` → `for the sheets` · #25 `at the entrance` → `for the cafeteria` · #47 `on the stretcher` → `over the visitors` · #48 `by phone` → `to the pharmacy` · #76 `by e-mail` → `the charge nurse` · #85 `from the cabinet` → `for the patient` · #89 `on the unit` → `for the visitors` · #92 `by hand` → `with a towel` · #95 `by the sink` → `with a towel`

### D. order (14장)
- S1 손위생·PPE · [안전] 4줄이 벗기에서 끝나 **벗은 뒤 손위생** 누락(CDC 벗는 순서 마지막) → `On the way out, gloves off first, then the gown, then clean your hands.`(14단어), why 끝에 "벗은 뒤 다시 손을 소독해요" 추가
- S4 VAP · [기타] 1줄 16단어 → `He's on a breathing machine, so we take small steps to protect his lungs.`
- S5 격리 표지 · [정답 둘] 3↔4 교환해도 자연스러움("Thank you…" 뒤 "Doing so…") → 4줄 `Thanks for helping keep them safe — it's never about blame.`(them = 3줄의 사람들), ko `그분들을 지켜 주셔서 감사해요, 탓하는 게 아니에요`
- S6 기구 소독 · [정답 둘] 2↔3 교환해도 자연스러움 → 3줄 `After he's used them, those same devices get wiped again.`(those same devices = 2줄), ko `아버님이 쓰고 나면 그 기기를 다시 닦아요`
- S8 번들 점검 · [정답 둘] 2↔3 교환해도 "the last one"이 1줄 끝 항목으로 풀림 + 3줄 16단어 → 3줄 `So that leaves the sedation break — every element has to be met.`, 4줄 `Once it's done, I'll log the bundle compliance in the chart.`(어색한 "Once … now" 제거)
- S9 도뇨 평가 · [기타] 2줄 `remove it`의 it이 1줄에 없음(indication만 있음) → 1줄 `We check each catheter's indication every morning on rounds.`
- S10 이송 · [정답 둘] 1↔2 교환해도 자연스러움(연락·덮기 모두 이송 전) → 2줄 `While they get ready, we'll put a clean sheet over him and cover any lines.`(they = CT팀), ko `그쪽이 준비하는 동안 깨끗한 시트를 덮고 라인도 덮어요`
- S11 코호팅 · [정답 둘] 3↔4 교환해도 자연스러움(둘 다 2줄 배치에 걸림) → 4줄 `With their equipment kept apart, let's flag them clearly and reinforce contact precautions.`
- S12 C. diff · [기타] 3줄 18단어 + "Under those precautions, gel doesn't kill"는 논리가 어긋남(젤은 주의조치와 무관하게 아포에 안 들음) → `Since gel doesn't kill the spores, we use soap and water for hand hygiene.`(13단어)
- S13 이차감염 · [정답 둘] 2↔3 교환해도 자연스러움 → 3줄 `To catch them early, let's watch for new fever, diarrhea, or oral thrush.`(them = 2줄의 이차감염)
- S14 장치 감염 · [정답 둘] 2↔3 교환해도 "So let's check…"가 1줄 뒤에 붙음 → 3줄 `If it is, let's check for fever, tenderness, or drainage too.`(it = 2줄의 감염 징후)
- S18 MDRO 확산 · [정답 둘] 2↔3 교환해도 "That means…"가 1줄 뒤에 붙음 → 3줄 `Tightening it means dedicated equipment and strict hand hygiene.`(it = 2줄 isolation)
- S19 바늘 노출 · [안전] 임상 순서 오류: 원환자 확인 **뒤에** 보고, 4줄에서 **평가 전에 PEP 시작**(+간호사가 시작하는 것처럼), 1줄 "a full minute"은 근거 수치 아님 → 1 `First, wash the site well with soap and water.` 2 `Once it's washed, I'll report the exposure right away.` 3 `With the report in, let's check the source patient's status.` 4 `Based on that, you'll be evaluated for PEP as soon as possible.` / why `먼저 씻고 바로 보고해요. 원환자 상태를 확인한 뒤 PEP 평가를 몇 시간 안에 받아요.`
- S21 자원 배분 · [정답 둘] 2↔3 교환해도 "Under that rule"이 정책을 가리켜 자연스러움 + 4줄 17단어 → 3줄 `If two patients tie at the top, we follow the hospital's policy, not individual judgment.` 4줄 `If the policy still doesn't settle it, I'll bring it to leadership.`

### E. why (9문장)
- #6 · [안전] "비누가 닿지 못하는 세균까지 젤이 없앤다"는 투 — 같은 주제 #58·#59(C. diff 아포는 젤이 못 없앰)와 모순. why를 `젤은 대부분의 세균을 빨리 줄여 손이 눈에 띄게 더럽지 않을 때 권장돼요. 'can't always'로 비누를 깎아내리지 않아요.`로, en 문장 자체는 A 검토에 넘김
- #96 · [안전] "둘 다 오늘" — PEP는 가능한 한 빨리(몇 시간 안) 시작, 처방은 직원보건·의사 몫(A 메모와 같음) → why `'report … and start'로 두 일을 묶어요. PEP는 몇 시간 안에 평가받고 시작해야 효과가 커요.` (en은 A가 "PEP 평가를 요청" 쪽으로)
- #95 · [기타] "a full minute"은 CDC 수치가 아님 → why에서 "충분히 씻는 것이 중요해요"만 남기고 수치 근거처럼 읽히지 않게(en은 A)
- #23 · [기타] 격리 표지 색은 병원마다 다름 → why 끝에 `색은 병원마다 달라요.` 추가
- #14 · [기타] "소변줄 제거는 처방이 필요" — 미국 병원 다수는 간호사 주도 제거 프로토콜이 있음 → `소변줄 제거는 처방이나 병원 프로토콜을 따라요.`
- #22·#25·#38·#67 · [기타] 뒷문장이 ko를 되풀이(접촉격리는 가운과 장갑을 써요 / 착용해요 / 요소를 모두 해야 인정돼요 / 첫 신호일 수 있어요) → 뒷문장을 지우거나 말하는 방식의 이유로 바꿈

## 개수
- 고칠 것 **147** = distractorsKo 43 · 빈칸 63 · decoy 18 · order 14 · why 9 (같은 문장의 다른 필드는 따로 셈)
- 그중 **[안전] 49**(distractorsKo 36 · 빈칸 3 · decoy 6 · order 2 · why 2) · **[정답 둘] 27**(distractorsKo 5 · 빈칸 3 · decoy 10 · order 9) · [기타] 71

## 종합
distractorsKo 길이·되풀이 상한은 맞췄지만, 처치 문장 오답이 "옆 단계"가 아니라 "대신 하는 일"로 쓰인 곳이 많고 order 9장이 안 박혀 있습니다. **이대로는 내보내기 불가** — 위 [안전]·[정답 둘]을 반영하고, 빈칸은 동떨어진 오답을 같은 분야 오답으로 바꾼 뒤 V18·V19·V20 재검사.
새 distractorsKo 값을 모두 넣은 사본으로 길이(V20)·되풀이 상한을 스크립트로 다시 셌고 위반 없음.
