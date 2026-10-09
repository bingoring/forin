# ER v46 검토 — v44 필드 수정·사용자 결정 대기 항목 (결정 11 포함)

출처: `er-v46/fix-*-v46.md` 35개 중 항목이 있는 32개 (`er-deescalation`·`er-seizure-loc`·`er-stroke`는 항목 없음).

**문장 번호 규칙**: `N.M` = 상황 번호 N(S N).문장 번호 M(0부터). 35개 파일 모두 같은 뜻으로 쓰였다. `S번호`는 상황 번호이며, 파일에 상황 제목이 적힌 경우가 없어 S번호만 적었다(S18 제목은 poisoning 파일에 `청산/메탄올 중독`).
**포함 기준**: v44 필드(`en`·`ko`·`chunks`·`words`·`goal`·`keyPhrases`·단어 은행)를 바꿔야 하거나 사용자에게 넘긴 항목. 검토자가 "둬도 됨·확인만(의도된 철자 대비 등)"이라 한 것은 뺐다. `keyPhrase`는 문장 수정이 V4로 막혀 사용자 결정이 필요한 것.

| 주제 | 상황 | 문장 번호 | 바꿀 필드 | 문제 | 검토자의 처방 | 분류 |
|---|---|---|---|---|---|---|
| core-family | S3 | 3.4 | ko | 말하는 상대가 가족(S3 role family)인데 "환자분이 하시는 모든 질문이"로 옮김 | "하시는 모든 질문이 저에게는 중요해요" | 문법·뜻 |
| core-family | S10·S14 | 10.4, 14.2 | ko | 소아 장면이 아닌데 "아이에게"(10.0 ko는 "환자분을") | "환자분께" | 문법·뜻 |
| core-family | S10 | 10.3 | en (+swap options/answer/notes) | `let me guide how`는 부자연스러운 영어 | `let me show you how` (swap의 options/answer/notes 키도 같이 고침) | 문법·뜻 |
| core-family | S18 | 18.3 | en | `you have every right to it`는 덜 자연스러움(낮음) | `you have every right to feel that way` | 문체·선호 |
| core-family | S17 | 17.1, 17.2, 17.3 | en·keyPhrase | 병상 간호사가 기증을 먼저 꺼내는 흐름이 미국 관행(OPO·지정 요청자가 청함)과 어긋남. 17.2 `it's entirely your family's choice`는 환자가 기증 등록자이면 사실이 아님. keyPhrase가 걸린 설계라 결정 대기 | 처방 없음 | 사실·안전 |
| core-handoff | S4 | 4.4 | en | 병상 번호를 확인 항목으로 보여 줌(NPSG.01.01.01과 어긋남). why가 바로잡지만 문장이 잘못된 습관을 보여 줌 | `Her name and date of birth both match the chart.` | 사실·안전 |
| core-handoff | S4 | 4.2 | en | `name band`보다 미국 병원은 `ID band`·`wristband`를 더 흔히 씀(참고) | `ID band` 또는 `wristband` | 문체·선호 |
| core-language | S2 | 2.5 | en | 알레르기에 `today`가 부자연스럽고 2.2와 사실상 같은 문장 | `Any allergies to medicine? Yes or no?` (또는 다른 핵심 질문으로 교체) | 문법·뜻 |
| core-language | S7 | 7.6 | en | 통역사가 통역사를 찾는 꼴 | `The interpreter service is looking for…` | 문법·뜻 |
| core-language | S16 | 16.2 | en | 통역사의 역할을 넘음(`The interpreter will check if he truly understands.`) | `We'll check with the interpreter if he truly understands.` | 사실·안전 |
| core-language | S8 | 8.4 | en | 3자 대화에서는 간호사가 통역사에게 직접 말하는 게 원칙이라 누구에게 하는 말인지 어색 | 처방 없음 | 문법·뜻 |
| core-language | S11·S13·S16·S18 | 11.1, 13.1, 16.3, 18.2 | chunks | 청크 경계가 구를 끊음(`a sign language / interpreter now`, `. Yes or no`(구두점이 머리), `his next / of kin`, `I can clear / up`) | 처방 없음 | 문체·선호 |
| core-safety | S14 | 14.0 | en·keyPhrase | `date of birth in 1962`는 비문 (keyPhrase, 결정 대기) | `born in 1962` 또는 생년월일 전체 | 문법·뜻 |
| core-safety | S9 | 9.4 | en | `Always check the bed number before you label the tube.` 침상 번호는 식별자가 아님 | `Always check the wristband before you label the tube.` | 사실·안전 |
| core-safety | S11 | 11.3 | en | 낙상 위험만으로는 억제대 사용 근거가 안 됨(CMS) | `Restraints are only used when he might pull out his IV line or breathing tube.` | 사실·안전 |
| core-safety | S3 | 3.4 | en | 난간 전부 상시 올림은 억제대로 간주될 수 있음(경미) | 처방 없음 | 사실·안전 |
| core-safety | S19 | 19.4 | en | 침대는 `carry`가 아니라 밀어 옮김(경미) | `move … on the bed` 형태로 검토(전체 문장 없음) | 문법·뜻 |
| core-safety | S3·S8·S15·S18 | 3.6, 8.1, 15.0, 18.0 | chunks | 구를 끊음(`correctly helps prevent`, `on and label`, `is up and / pressure is`, `double the ordered / dose`) | 처방 없음 | 문체·선호 |
| abdominal | S16 | 16.0 | ko | "그게 저희를 걱정시켜요"는 번역투 | "그래서 걱정이 돼요" | 문체·선호 |
| abdominal | S17 | 17.2 | en | 환자에게 보고 틀 이름(SBAR)을 말하는 것이 어색(why도 이 문장을 본보기로 삼음) | 처방 없음 | 문체·선호 |
| abdominal | S17 | 17.1 | en | 복막염 환자는 무릎을 굽힌 자세를 편해하는 경우가 많아 `flat`이 맞지 않음(`still`이 핵심) | 처방 없음 | 사실·안전 |
| abdominal | S15 | 15.0 | en | `in quality`는 의료진 말투인데 환자에게 하는 문장 | `Does the pain feel tearing or ripping?` | 문체·선호 |
| alcohol-withdrawal | S4 | 4.0 | en (+S4 L1) | 졸린 만취 환자의 흡인 예방은 보통 옆으로 눕히기(회복 자세). `keep the head of your bed up…`만 가르침 | 처방 없음(정본에 회복 자세를 함께 다루는지 확인) | 사실·안전 |
| alcohol-withdrawal | S2 | 2.3 | ko | "괜찮아 보여도"인데 en은 `even when you feel fine`(본인이 느끼기에) | "괜찮다고 느끼셔도"(경미) | 문법·뜻 |
| alcohol-withdrawal | S16 | 16.0, 16.3 | en | 간호사가 팀에 벤조 투약을 지시하는 말. 코드 상황에서 의사 오더·프로토콜 복창이라는 전제가 장면에 있는지 | 처방 없음 | 사실·안전 |
| anaphylaxis | S20 | 20.3 | en·ko·chunks | 20.0(keyPhrase) "02:00까지 안정"과 시각 모순(20.3은 1시 반). order L2도 같이 고침 | en `Vitals were steady all shift until about zero-two-hundred.` / ko `활력징후는 새벽 2시쯤까지 근무 내내 안정적이었습니다.` / chunks `["Vitals were steady", "all shift", "until about zero-two-hundred", "."]` | 사실·안전 |
| anaphylaxis | S13 | 13.3 | en·ko·chunks | `Nothing in this room should touch latex`는 "방 안 물건이 라텍스에 닿으면 안 된다"는 뜻이 되어 의도("라텍스가 환자에게 닿으면 안 됨")와 어긋남(판단이 갈릴 수 있음) | en `Nothing with latex should touch you from now on.` / ko `이제부터 라텍스가 든 어떤 것도 몸에 닿으면 안 돼요.` / chunks `["Nothing with latex", "should touch you", "from now on", "."]` | 사실·안전 |
| anaphylaxis | S7 | 7.2 (+상황 brief·tagline) | keyPhrase·tagline·brief | `I have epinephrine ready in case we need it.`·brief "에피네프린을 준비하세요"가 tagline("가슴이 조여요")과 어긋나 에피 지연으로 읽힘. keyPhrase라 못 바꿈 | 정본에서 tagline을 "가려워요/얼굴이 화끈거려요"로 바꾸거나 brief를 "즉시 근주"로 바꿈(문장 처방 없음) | 사실·안전 |
| arrest | S16 | 16.2 | en·ko·keyPhrase | `Keep compressions high on the sternum and continuous.` 2015년 이후 지침(AHA 2015·ERC 2021)과 어긋남. keyPhrase | en `Keep compressions in the center of the chest and continuous.` (ko `흉골 위쪽에서`도 함께 바꿈, ko 문안 없음) | 사실·안전 |
| arrest | S10 | 10.3 | en | 한 라운드(2분)에 에피 두 번은 3~5분 간격과 어긋남 | `We've given epi twice so far in this code.` | 사실·안전 |
| arrest | S20 | 20.3 | en | `Control the bleeding first, then start compressions.` 압박을 보류하라는 말로 읽힘 | `Control the bleeding first — compressions come second here.` (또는 why로만 보완) | 사실·안전 |
| arrest | S17 | 17.3 | ko | ko `근육이 아니라 정맥으로`는 en `not just the muscle`(근육만이 아니라)과 어긋남 | ko `근육주사만 하지 말고 정맥으로 바로 주세요` | 문법·뜻 |
| arrest | S17 | 17.4 | en | `…watch his airway swell.` 붓기를 지켜보라는 뜻으로 들림(낮음) | `…and watch for airway swelling.` | 문법·뜻 |
| arrest | S19 | 19.2 | ko | `정말 죄송해요`는 사과인데 why는 "사과가 아니라 위로"(낮음) | `정말 안타까워요` | 문법·뜻 |
| arrest | S8 | 8.2 | ko | `확보됐고, 투약 준비됐어요` 주어 없음(낮음) | `정맥로가 확보됐고, 투약 준비됐어요` | 문법·뜻 |
| arrest | S3·S10·S14 | 3.2, 10.4, 14.2 | chunks | 구 경계를 끊음(`with each / breath`, `and time / down`, `until his core / temperature rises`) | 처방 없음 | 문체·선호 |
| arrest | S7·S11·S19 | 7.3, 11.0, 11.2, 19.0 | ko | 번역투(`그의 칼륨 수치`, `그를 위해`, `그가`, `그의 뜻`)(낮음) | `환자분`으로 | 문체·선호 |
| arrhythmia | S15 | 15.2 | en | `You'll feel a quick shock while you're sedated`가 15.4·order L3(`won't feel or remember`)와 모순 | `You'll get a quick shock while you're sedated` | 사실·안전 |
| arrhythmia | S20 | 20.0 | en | `Situation: bed 2 …` 침상 번호만으로 환자를 가리킴(파일럿 4) | 처방 없음 | 사실·안전 |
| arrhythmia | S20 | 20.0 | ko | "광범위 QRS 빈맥"은 오역 | "넓은 QRS 빈맥" | 문법·뜻 |
| arrhythmia | S16 | 16.1 | ko | "저와 함께 계세요 — 아직 저희와 함께 계신 거죠?"는 직역 | "정신 놓지 마세요 — 제 말 들리세요?" | 문법·뜻 |
| arrhythmia | S14 | 14.5 | en | `for the next while`은 미국에서 드문 표현 | `for a while` | 문체·선호 |
| arrhythmia | S6 | 6.1 | en (+빈칸 `fast`) | `a fast medicine`은 미국 현장에서 `a fast-acting medicine` | `a fast-acting medicine` (빈칸 `fast`도 같이 고침) | 문법·뜻 |
| arrhythmia | S21 | 21.1 | en | `calm … the shocks`가 어색 | `calm your heart and stop the shocks` | 문법·뜻 |
| arrhythmia | S17 | 17.0 | en | `I need to flag that you have WPW to the team`는 환자에게 하는 말로 업무 말투(낮음) | 처방 없음 | 문체·선호 |
| arrhythmia | S11·S17 | 11.2/11.4, 17.0/17.4 | en | 겹치는 문장 쌍. 같은 빈칸·조립이 두 번 나옴(낮음) | 처방 없음 | 문체·선호 |
| asthma-copd | S19 | 19.3 | en·ko | `His oxygen is dropping fast on that side.` 산소포화도는 한쪽 폐의 값이 아님 | en `His oxygen is dropping fast.` / ko "산소포화도가 빠르게 떨어지고 있어요" | 문법·뜻 |
| asthma-copd | S20 | 20.3 | en | `known severe asthma, now in status asthmaticus`가 20.0 `severe COPD flare`와 다른 환자를 가리킴 | `Background: known severe COPD on home oxygen.` 같은 COPD 배경 | 사실·안전 |
| bleeding-wound | S12 | 12.2 | en·chunks | `How is your blood sugar been controlled lately?` 비문 | `How has your blood sugar been controlled lately?` (chunks `How is`→`How has`) | 문법·뜻 |
| bleeding-wound | S11 | 11.2 | ko | 같은 말을 되풀이함(경미) | `피가 많이 나 보여도 보통은 보기보다 심하지 않아요` | 문체·선호 |
| bleeding-wound | S20 | 20.4 | en | 지혈대가 감긴 인계에서 `the limb is warm`은 지혈대가 덜 조였다는 신호로 읽힘(확신 낮음) | 처방 없음(정본에서 `the limb`이 어느 쪽인지 확인) | 사실·안전 |
| burn | S9·S18 | 9.2, 9.4, 18.1, 18.4 | en | 가피절개를 `a small cut`·`small cuts`로 말함(실제는 김). 9.2/9.4, 18.1/18.4가 거의 같은 문장 | 하나씩 남기고 `a cut along the burned skin`처럼 바꿈 | 사실·안전 |
| burn | S17 | 17.3 | en | `We'll check a blood test` 어색 | `run/do a blood test` | 문법·뜻 |
| burn | S17 | 17.0, 17.4 | en | 거의 같은 문장 | 처방 없음 | 문체·선호 |
| burn | S13 | 13.4 | ko | "당신의 언어로" 번역투 | "쓰시는 말로" | 문체·선호 |
| burn | S19 | 19.3 | en | `Your muscles broke down after the electrical burn.` 환자에게 단정 과거형 | `may be breaking down` 형태 | 사실·안전 |
| burn | S7·S15·S20 | 7.2, 15.2, 20.3 | chunks | `mostly partial / thickness`가 용어를 끊음. `Keep rinsing—this removes`·`stay calm—this`는 대시를 넘어 두 절을 묶음 | 처방 없음 | 문체·선호 |
| burn | S20 | 20.1 | ko·단어 `w-output` exKo | 단어 exKo "충분합니다"와 20.1 ko "적정합니다"가 다름(사소) | 처방 없음 | 문체·선호 |
| chest-abd-trauma | S7·S11·S15 | 7.1, 11.0, 15.5 | chunks | 대시를 넘어 구를 끊음 | 처방 없음 | 문체·선호 |
| chest-abd-trauma | S6 | 6.5 | en | `recheck`와 `again`이 겹침 | `I'll check … again` 또는 `I'll recheck …` | 문법·뜻 |
| chest-abd-trauma | S7 | 7.4 | en | `has been dropping the last few minutes` | `over the last few minutes` | 문법·뜻 |
| chest-abd-trauma | S2 | 2.5 | ko | "팀에 바로 알릴게요"인데 영어에 `right away`가 없음(decoy 문제의 원인) | 처방 없음 | 문법·뜻 |
| chest-abd-trauma | S11 | 11.3, 11.4 | en | 상황이 "박힌 물체"와 "장기 탈출"을 한 환자에 섞음. 젖은 멸균 드레싱은 탈출 장기용이라 박힌 물체 상처를 덮는 문장으로만 읽히면 오해 | 처방 없음 | 사실·안전 |
| chest-abd-trauma | S20 | — | 단어 `car` | `car`는 너무 쉬운 말이고 어색함은 막연한 구어에서 옴(보고만, 사용자 결정) | 단어를 `trauma`(ko 외상)로 바꾸면 세 장면 모두 자연스럽게 넣을 수 있음 | 문체·선호 |
| chestpain | S10 | 10.0~10.4 | chunks | 청크가 문장 경계를 넘음(`? Point for me`, `? Show me`, `. You are safe`, `. I check you`, `. Good`). 일부러 짧게 끊은 문장이라 keyPhrase 여부에 따라 | 처방 없음 | 문체·선호 |
| chestpain | S9 | 9.1 | ko | "약과 스텐트를 이전에 하셨었나요?" 어색 | "이전에 어떤 약을 드셨고 어떤 스텐트를 넣으셨나요?" | 문법·뜻 |
| chestpain | S1 | 1.4 | en | `placing you in a higher priority` 어색 | `giving you a higher priority` 또는 `moving you up` | 문체·선호 |
| chestpain | S5 | 5.2 | ko | "저와 함께 있어요"는 `stay with me`(정신 놓지 마세요)의 뜻과 다름(19.0은 바르게 옮김) | 처방 없음 | 문법·뜻 |
| diabetic | S15 | 15.5 | ko | en `Any changes on the monitor will tell us right away`(모니터가 우리에게 알려 줌)와 ko 주체가 다름 | `모니터에 변화가 생기면 저희가 바로 알 수 있어요` | 문법·뜻 |
| diabetic | S20 | 20.2 | en·ko | 환자에게 하는 말인데 S20 context가 가르치는 어색한 실수와 같음. ko에 `anion gap`이 영어로 남음 | 처방 없음 | 문체·선호 |
| diabetic | S14 | 14.3 | en·chunks | `show me back`은 원어민이 잘 쓰지 않음. 청크 `back so I`도 구 경계를 끊음 | `Can you show me how you'd do it, so I know it's clear?` | 문법·뜻 |
| diabetic | S19 | 19.2 | en | `Is the swelling and blackness spreading…` 주어가 둘이라 `Are` | `Are the swelling and blackness spreading…` | 문법·뜻 |
| diabetic | S4 | 4.5 | chunks | `controlled helps`가 `your sugar controlled`를 끊음 | 처방 없음 | 문체·선호 |
| diabetic | S15·S17 | 15.0/15.1, 17.2/17.3 | en | 한 상황 안에서 같은 말을 두 번 배움 | 처방 없음 | 문체·선호 |
| dyspnea | S1 | 1.1 | en (keyPhrase) | `I'm counting how many breaths you take per minute.` 호흡수는 보통 환자가 의식하지 않게 센다. 문장이 환자에게 세고 있다고 알림 | 문장 유지, why에 "보통은 알리지 않고 세지만, 환자가 물으면 이렇게 답해요" 추가 권장 | 사실·안전 |
| dyspnea | S11 | 11.4 | en | `until help arrives` 응급실 안에서 어색(통역사를 뜻함) | `until the interpreter arrives` | 문법·뜻 |
| dyspnea | S12 | 12.3 | chunks | `watch your breathing / muscles closely`가 명사구를 끊음 | 처방 없음 | 문체·선호 |
| dyspnea | S18 | 18.0 | en | `Give IM epinephrine now` 동료에게 하는 지시인데 투약은 처방·standing order 필요 | 의사 발화로 읽히게 하거나 `per protocol`을 넣음(선택) | 사실·안전 |
| dyspnea | S21 | 21.1 | en | `Can you feel air moving through it?` 개통 확인은 간호사가 직접 함(why로 보완됨) | 처방 없음 | 사실·안전 |
| environmental | S14 | 14.1, 14.4 | en | 통역사에게 3인칭으로 묻는다(`Through the interpreter — how high did he climb`, `Please ask him …`). 미국 원칙은 환자·보호자에게 직접 1인칭 | `How high did he climb, and how fast?` 같은 모양 | 사실·안전 |
| environmental | S12 | 12.5 | en | `We pulled him out of the ice water`를 간호사가 보호자에게 하면 구조한 사람이 어긋남 | 처방 없음 | 문법·뜻 |
| environmental | S5 | 5.3, 5.6 | en | 거의 같은 문장(조금씩 자주 ↔ 벌컥) | 처방 없음 | 문체·선호 |
| environmental | S6 | 6.2 | en | `We're putting cool packs and misting you`에 `on you`가 빠짐 | `on you` 추가 | 문법·뜻 |
| environmental | — | — | 단어 `w-clothes` 오답 | 오답 `cloths`가 같은 말의 다른 꼴로 읽힐 수 있음 | 처방 없음 | 문체·선호 |
| fever-infection | S20 | 20.0 | en·ko·chunks·words·keyPhrase | `airborne and contact precautions`는 사실 오류(수막구균은 비말 격리, CDC). keyPhrase와 같은 문장이라 사용자 결정 | `droplet precautions` (`in-er-fever-infection.json` keyPhrase, 20.0 en·ko "비말 격리 중입니다", chunks `Suspected meningococcemia / — he's on / droplet precautions / .`, words에서 `w-contact` 빼고 `w-droplet` 추가, S20 pair `["contact","precautions"]`·why·V3 재확인) | 사실·안전 |
| fever-infection | S10 | 10.3 | en·chunks | `within a minute`는 과장된 안심(열성경련은 대개 몇 분 안) | `within a few minutes` (chunks 끝 조각도) | 사실·안전 |
| fever-infection | S3 | 3.3 | en | `within thirty minutes or so` 아세트아미노펜 효과는 30~60분(선택, order S3 L2도 같음) | `within an hour or so` | 사실·안전 |
| fever-infection | S15·S18 | 15.2, 18.4 | ko | "수액을 흘리고", "수액을 빠르게 흘릴게요" 한국어로 어색 | "수액을 달고", "수액을 빠르게 넣을게요" | 문체·선호 |
| fever-infection | S8 | 8.3 | ko | "이것도 그럴 가능성이 커요" 어색 | "독감일 가능성이 아주 커요" | 문체·선호 |
| fever-infection | S12·S17 | 12.0, 17.0 | en·keyPhrase | `X concerns/worries me about Y`는 자연스러운 영어가 아님(keyPhrase라 보고만) | `makes me worried about` 형태 | 문법·뜻 |
| genitourinary | S8 | 8.3 (+S8 swap) | en·ko | `PVR/잔뇨량`은 요폐(배뇨 전) 장면에서는 엄밀히 '방광 용적'(base 내용이라 손대지 않음) | 처방 없음 | 문법·뜻 |
| geriatric | S10 | 10.1 | en·ko·chunks·keyPhrase·words | `You're safe to talk with me — nothing leaves this room without your say.` 지킬 수 없는 비밀 보장(APS 신고 의무)(심각 1). keyPhrase라 사용자 결정(`in-er-geriatric.json` keyPhrases와 함께) | en `You're safe to talk with me — I'll be honest about who else needs to know.` / ko "여기서는 안전하게 말씀하셔도 돼요 — 누가 더 알아야 하는지는 솔직하게 말씀드릴게요." / chunks `You're safe` / `to talk with me` / `— I'll be honest` / `about who else` / `needs to know` / `.` (`w-leave`·`w-say` 태그 빠져 S10 V3 확인) | 사실·안전 |
| geriatric | S19 | 19.4 | en·ko·chunks (+v46 tag·빈칸·why) | 금식(NPO)은 마취팀이 정하는데 물을 권함 | en `Let me check if you can drink water to stay hydrated before surgery.` / ko "수술 전에 수분 유지를 위해 물을 드셔도 되는지 확인해 볼게요." / chunks `Let me check` / `if you can drink water` / `to stay hydrated` / `before surgery` / `.` | 사실·안전 |
| geriatric | S19 | 19.5 | en·ko·chunks | `keep you moving`은 고관절 골절 환자에게 움직임 권유로 읽힘 | en `Let's keep you oriented and engaged while you wait.` / ko "기다리시는 동안 지남력을 유지하고 계속 이야기 나누며 지내시도록 도와드릴게요." / chunks `Let's keep you` / `oriented` / `and engaged` / `while you wait` / `.` | 사실·안전 |
| geriatric | S8 | 8.4 | ko | "이 약 조합이 다리 힘을 불안정하게 만들고 있을 수 있어요" 어색(경미) | "이 약 조합 때문에 걸을 때 휘청거리실 수 있어요." | 문체·선호 |
| gi-bleed | S15 | 15.5 | ko | `혈액이 오고 있어요`에 en의 More가 빠짐(빈칸 정답 `More`를 ko가 못 가림) | `혈액이 더 오고 있어요` | 문법·뜻 |
| gi-bleed | S4 | 4.4 | ko | `단 몇 초만 갑니다` ↔ en `only a second` 어긋남, 합쇼체로 다른 문장과 다름(경미) | `바늘 따끔함은 잠깐이면 지나가요` | 문법·뜻 |
| gi-bleed | S17 | 17.1, S17 swap | ko | `처방할게요`는 간호사가 하지 않는 일로 읽힘(en `We're ordering` = 팀이 요청) | `요청할게요` / `준비할게요` | 문법·뜻 |
| gi-bleed | S19 | 19.4 | ko | `다른 병실로`인데 가는 곳은 시술실(IR suite) | `다른 방으로` | 문법·뜻 |
| head-trauma | S18 | 18.3 | en·ko·chunks | `Left pupil remains reactive and equal.` 18.1에서 우측이 산대인데 "양쪽 동일"이라 모순 | en `Left pupil remains brisk and reactive.` / ko `좌측 동공은 여전히 반응이 빠르고 정상입니다.` / chunks `["Left pupil", "remains brisk", "and reactive", "."]` | 사실·안전 |
| head-trauma | S2·S9·S12·S14·S16 | 2.0, 9.1, 12.2, 14.0, 16.0, 16.4 | chunks | 대시를 넘는 청크(2.0·12.2·14.0·16.0은 keyPhrase) | 처방 없음 | 문체·선호 |
| head-trauma | S1·S7 | 1.1, 7.3 | words | `words: []` (V3는 통과) | 처방 없음 | 문체·선호 |
| head-trauma | S14·S15 | — | 상황 역할 | 팀에게 하는 문장이 상황 역할 `patient` 아래에 있음 | 처방 없음 | 문체·선호 |
| obgyn | S19 | 19.4 (빈칸 B6) | 빈칸·en | `has passed` ≈ ko "사망했어요"라 정답이 둘이고 swap과 중복. 좋은 대체어가 없어 **사용자 판단** | (a) 현행 유지하되 오답 `is lost`만 비완곡어로 교체, (b) 빈칸을 `so very sorry`/`sorry` 쪽으로 이동. `has turned`·`has dropped` 같은 태위·하강어는 쓰지 않음 | 문법·뜻 |
| obgyn | S6·S19 | 6.3, 19.4 | en | 간호사가 진단(유산·사망)을 전하는 문장. 실무에서는 의사가 고지. why로 틀 보강. **사용자 판단** | 6.3을 `I'm worried this may be a miscarriage — the doctor will talk with you about it.`로(swap `before`도 함께). 19.4는 처방 없음 | 사실·안전 |
| obgyn | S19 | 19.5 | ko | en "nothing you could have done to cause this" ↔ ko "어떻게 해도 막을 수 없었던"(사산은 막을 수 있었던 경우도 있어 사실 아닐 수 있음) | ko `당신이 한 어떤 일도 이 일의 원인이 아니에요` | 사실·안전 |
| obgyn | S8 | 8.3 | en | `Would you like to have an exam and collect evidence, or not?` 증거를 모으는 사람이 환자처럼 읽힘(낮음) | order L3의 `an exam and evidence collection`이 더 정확 | 문법·뜻 |
| obgyn | S15 | 15.1 | en (keyPhrase) | `…feel a seizure coming or more headache` 자간증 경련은 전조 없이 오는 경우가 많고 `more headache`도 어색 | 처방 없음 | 사실·안전 |
| obgyn | S6·S15·S19 | 6.0, 15.4, 19.2 | words | `words: []`(v44부터) | 처방 없음 | 문체·선호 |
| obgyn | S17·S18·S4·S10·S6·S19 | 17.1, 18.1, 4.1, 10.4, 6.5, 19.5 | chunks | 구를 끊음(`Stay with / me`, `in your / last pregnancy`, `about your / pregnancies`, `nothing you could / have done`) | 처방 없음 | 문체·선호 |
| ortho-trauma | S2 | 2.5 | en | `Squeeze my fingers … on both hands` | `with both hands` | 문법·뜻 |
| ortho-trauma | S10 | 10.3 | en | `while we prepare transfer` | `prepare for the transfer` | 문법·뜻 |
| ortho-trauma | S13 | 13.5 | ko | "검사를 지시할게요" 간호사가 지시하는 말로 읽힘 | "검사를 할 거예요" | 문법·뜻 |
| pain-sedation | S15 | 15.4 | en | `Your pain may come back once the medicine wears off.` "the medicine"이 모호, 역전제로 읽으면 약리가 거꾸로(통증은 날록손이 오피오이드를 막는 동안 돌아옴) | `Your pain may come back now that the opioid is blocked.` | 사실·안전 |
| pain-sedation | S1 | 1.2, 1.5 | en | "졸리면 알려 주세요"와 "졸리면 정상이니 쉬세요"가 엇갈림 | 1.5를 `If you feel a little drowsy, that's normal, but tell me if it gets hard to stay awake.` | 사실·안전 |
| pain-sedation | S6 | 6.3 | en | `Is this new pain sharp, or in a different spot?` 서로 다른 축을 or로 묶음(낮음) | 처방 없음 | 문체·선호 |
| pain-sedation | S13 | 13.3 | ko | en `what day it is`는 요일에 가까운데 ko "며칠"(낮음) | ko "오늘이 무슨 요일인지" | 문법·뜻 |
| peds | S10 | 10.5 | en·ko·chunks | `My job right now is to keep him safe, nothing more.` `nothing more`이 신고 의무를 부정하는 말로 읽힘(심각 3). keyPhrase 아님 | en `My job right now is to keep him safe.` (청크 `, nothing more` 삭제) / ko "지금 제 역할은 아이를 안전하게 지키는 거예요." | 사실·안전 |
| peds | S17 | 17.3 | en·ko·chunks·words | `could have prevented`는 검시 전에 단정하면 안 됨(심각 4). 바꾸지 않으면 why만 고침 | en `This is not your fault.` / ko "부모님 잘못이 아니에요." (청크·words 함께) | 사실·안전 |
| peds | S3 | 3.4 | en | S3의 다른 문장·카드는 `his`인데 이 문장만 `her` | `his`로 맞춤 | 문법·뜻 |
| poisoning | S18 | 18.5 | en | `your vision and kidneys are both at risk` 메탄올의 표적은 시신경과 대사성 산증(신장은 에틸렌글리콜). 같은 문장 why와도 어긋남 | `because your vision and your blood's acid level are both at risk`류 | 사실·안전 |
| poisoning | S1 | 1.3 | en | `it will help clean out the poison` 활성탄은 씻어 내는 것이 아니라 흡착(경미) | 처방 없음 | 사실·안전 |
| poisoning | S17 | 17.4 | en | `We're giving cooling and medication` 부자연스러운 영어 | `We're cooling you and giving medication to calm your body down.` | 문법·뜻 |
| poisoning | S15·S20 | 15.0, 20.2 | ko | `톡시드롬` 음차가 낯섦. 20.2 `드렸습니다`는 인계 말이라 `투여했습니다` | 15.0 `중독 증후군(톡시드롬)`, 20.2 `투여했습니다` | 문체·선호 |
| poisoning | S3·S14·S17 | 3.0, 14.1, 17.3 | chunks | 구를 끊음(`breathe / in the fumes`, `. Can we talk`, `your body / temperature is`) | 처방 없음 | 문체·선호 |
| polytrauma | S15 | 15.4 | en·ko·chunks·words·keyPhrase | `this side is losing pressure quickly` 긴장성 기흉은 압력이 오름. 사실이 거꾸로 | `…because the pressure on this side is building quickly.` / ko "이쪽 압력이 빠르게 차오르고 있어서" | 사실·안전 |
| polytrauma | S2 | 2.1 (+S2 order L3) | en | 경추 확인 전 다발외상 환자에게 머리를 들게 하는 질문 | `Do you feel dizzy or lightheaded right now?` | 사실·안전 |
| polytrauma | S14 | 14.3 | en | 응고를 떨어뜨리는 것은 저체온이고 떨림은 그 신호(급하지 않음) | `Getting cold can make it harder for your blood to clot.` | 사실·안전 |
| polytrauma | S19 | 19.2 | en | `I need your consent to proceed immediately.` 수술 동의는 외과의가 받음 | `The surgeon needs your consent to proceed immediately.` | 사실·안전 |
| polytrauma | S0·S1·S2·S6·S15·S16·S17·S18 | 0.1, 1.0, 2.2, 6.1, 15.2, 16.2, 17.0, 17.3, 17.4, 18.4 | chunks | 대시를 넘어 구를 끊음(대부분 keyPhrase) | 처방 없음 | 문체·선호 |
| polytrauma | S8 | 8.4 | en | `even the small dose ones` 어색한 영어 | 처방 없음 | 문법·뜻 |
| polytrauma | S4·S16 | 4.4, 16.4 | words | `words: []` | 처방 없음 | 문체·선호 |
| procedures | S9 | 9.4 | en | `This is a small test dose to start.` 첫 항생제 투여를 시험 용량으로 소개하는 것은 미국 관행과 어긋남. 사용자 결정 | 처방 없음 | 사실·안전 |
| procedures | S5 | 5.5 | en | `We won't stop until we find a good vein.` 시도 횟수 제한(INS)·5.2와 어긋남 | 처방 없음 | 사실·안전 |
| procedures | S18 | 18.2 | en | `I calculated fifteen units; can you confirm?` 값을 먼저 말해 독립 이중 확인이 아님. keyPhrase급이면 why로만 보완 | 처방 없음 | 사실·안전 |
| procedures | S20 | 20.1 | en | `Do you want one-to-one-to-one ratio …` 관사 빠짐 | `a one-to-one-to-one ratio` | 문법·뜻 |
| procedures | S11 | 11.2 | en | `it won't stop you breathing` 미국 영어는 `from breathing`(낮음) | `stop you from breathing` | 문법·뜻 |
| procedures | S6·S17 | 6.3, 17.4 | en | 결과를 약속하는 말(`It'll be over before he even notices.`, `I promise`). S6 swap의 "거짓 약속은 신뢰를 잃는다"와 결이 다름(낮음) | 처방 없음 | 사실·안전 |
| procedures | S0·S9 | 0.0, 9.0 | ko | 0.0 `이름과 생년월일을 전부` 부자연스러움, 9.0 `복용해 보신`은 정맥 항생제라 어긋남(낮음) | 0.0 `성함 전체와 생년월일을`, 9.0 `맞아 보신` | 문법·뜻 |
| procedures | S0·S6·S8 | 0.4, 6.2, 8.0 | chunks | 구를 끊음(`just to / be safe`, `a big / high-five are / waiting after`, `the site really / well first`) | 처방 없음 | 문체·선호 |
| psych | S1 | 1.1 | en | `Have you had any thoughts of hurting yourself?` 자살 사고 선별 장면인데 자해를 물음(ASQ는 `killing yourself`·`ending your life`로 분명히) | `…thoughts of ending your life?` (또는 자해 질문임을 장면에 맞게 둠) | 사실·안전 |
| psych | S18 | 18.6 | en | `…to get a bed for both of you` 병상은 환자 것 | `…to get a bed as soon as possible` | 문법·뜻 |
| psych | S8 | 8.4 | en | `We have to assess you before we can let you go` 억류 중인 환자에게 평가 뒤 내보낸다고 약속하는 말로 읽힘 | 처방 없음 | 사실·안전 |
| psych | S13 | 13.5 | en | `They're not here to watch you like a punishment` 시터는 실제로 지켜봄. '감시가 아니다'로 오해 가능 | 처방 없음 | 사실·안전 |
| psych | S10 | 10.4 | en | `…before you go home` 자살 위험을 부정하는 환자에게 귀가를 전제. 결정은 평가 뒤에 남 | 처방 없음 | 사실·안전 |
| sepsis | S5 | 5.3 | en·chunks·words | `We have one hour to get all four of these done.` 1시간 번들은 시작이지 완료가 아님(사실 오류 8). keyPhrase 아님 | `…all four of these started.` (chunks `done`→`started`, words `w-done`→`w-start`) | 사실·안전 |
| sepsis | S14 | 14.3 | en·ko·chunks·words | `Ask the interpreter to find out if she has any allergies.` 통역사에게 문진을 맡김 | en `Through the interpreter, I'll ask her about any allergies.` / ko "통역을 통해 알레르기가 있는지 여쭤볼게요." (청크·words 함께) | 사실·안전 |
| sepsis | S14 | 14.0, 14.2 | en·keyPhrase | `Please ask her…` 3인칭 통역은 미국 관행과 어긋남. keyPhrase라 바꿀 수 없고 why만 고침(V4) | 처방 없음 | 사실·안전 |
| sepsis | S9 | 9.0 | en·keyPhrase | `Your pneumonia has spread to your whole body…` 쉬운 말로는 허용 수준이나 정확하지 않음. keyPhrase라 둠, why만 고침 | 처방 없음 | 문체·선호 |
| shock | S9 | 9.1 | en·ko | `We're watching your urine output as a good sign.` 영어·한국어 모두 어색 | `…for signs that you're improving` | 문법·뜻 |
| shock | S11 | 11.4 | en | `Let's ask if you…`은 제3자에게 묻자는 말로 들림 | `Can I ask if you…` | 문법·뜻 |
| shock | S19 | 19.2 | ko | en은 명령(`Give fluids and consider…`)인데 ko는 진행·제안이라 뜻이 어긋남 | 처방 없음 | 문법·뜻 |
| shock | S21 | 21.3 | en | `Steroids can't just stop suddenly without a plan.` 주어 어긋남 | `You can't just stop steroids suddenly without a plan.` | 문법·뜻 |
| shock | S20 | 20.2, 20.4 | en | `central monitoring`은 중앙 원격 모니터(텔레메트리 스테이션)로 읽히기 쉬움 | `close monitoring` (ko "집중 감시"에 맞음) | 문법·뜻 |
| shock | S21 | 21.4 | en | `…to help prevent a crisis` 이미 부신위기 저혈압 상황(낮음) | 처방 없음 | 사실·안전 |
| shock | S3·S7·S16·S19 | 3.2/3.4, 7.2/7.4, 16.2/16.4, 19.0/19.3 | en | 같은 상황 안에서 뜻이 거의 겹침(낮음) | 처방 없음 | 문체·선호 |
| shock | S15·S18·S0·S3·S10 | 15.1, 18.0, 0.3, 3.0, 10.3 | chunks | 구를 끊음(`in within / the hour`, `Activate the massive / transfusion protocol`, `Your blood / pressure is`, `about a new / medicine`) | 처방 없음 | 문체·선호 |


## 개수

총 157건. 처방 없음 57건(처방 없음으로 시작하는 줄).

### 주제별

| 주제 | 개수 |
|---|---|
| core-family | 5 |
| core-handoff | 2 |
| core-language | 5 |
| core-safety | 6 |
| abdominal | 4 |
| alcohol-withdrawal | 3 |
| anaphylaxis | 3 |
| arrest | 9 |
| arrhythmia | 9 |
| asthma-copd | 2 |
| bleeding-wound | 3 |
| burn | 7 |
| chest-abd-trauma | 6 |
| chestpain | 4 |
| diabetic | 6 |
| dyspnea | 5 |
| environmental | 5 |
| fever-infection | 6 |
| genitourinary | 1 |
| geriatric | 4 |
| gi-bleed | 4 |
| head-trauma | 4 |
| obgyn | 7 |
| ortho-trauma | 3 |
| pain-sedation | 4 |
| peds | 3 |
| poisoning | 5 |
| polytrauma | 7 |
| procedures | 8 |
| psych | 5 |
| sepsis | 4 |
| shock | 8 |

### 분류별

| 분류 | 개수 |
|---|---|
| 사실·안전 | 58 |
| 문법·뜻 | 55 |
| 문체·선호 | 44 |
