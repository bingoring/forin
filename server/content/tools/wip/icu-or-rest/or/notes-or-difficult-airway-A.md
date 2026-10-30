# or-difficult-airway A — 검토가 판단할 것

## 문장 쪽 메모 (고치지 않았다)
기도 관리는 마취과가 결정하고 간호사는 장비·보조·호출을 맡는다는 기준으로 본 것들이다.
- `Let's define plan A, B, and C before induction.`(예측 어려운 기도 계획 0번): 계획을 정하는 것은 마취과다. 간호사가 "정해요"라고 하면 결정처럼 읽힌다. 뉘앙스는 "마취과가 정하고 간호사는 장비·역할을 맞춘다"로 썼다.
- `If we can't secure it safely, we wake him up and try later.`(3번): 깨울지 말지는 마취과·집도의 결정이다.
- `I'll numb the throat with local spray before we start.`(각성 삽관 보조 3번), `I'll help keep the airway topicalized.`(0번): 기도 국소마취는 마취과가 약을 골라 시행한다. 간호사가 약을 쓰는 말로 읽힌다. 뉘앙스 swap은 "Anesthesia will numb your throat…"로 썼다.
- `I'm looking at how much of your tonsils and palate I can see.`(Mallampati 평가 3번): Mallampati 평가는 보통 마취과가 한다. 간호사가 점수를 매기는 말로 읽힌다.
- `Keep the mask sealed until he's fully asleep.`(산소화 유지 보조 3번), `I'm holding the mask seal for pre-oxygenation.`(0번): 마스크 환기·전산소화는 보통 마취과(또는 마취 보조)가 한다. 간호사에게 맡기는 말로 읽힌다. 뉘앙스는 이 행동을 정답으로 쓰지 않았다.
- `Stop trying to intubate and mask ventilate him now.`(산소화 우선 3번), `Oxygenation comes before intubation — let's bag him.`(0번): 시도를 멈추고 환기하라는 것은 마취과의 판단·지시다. 간호사가 명령하는 말로 읽힌다. 뉘앙스 swap은 "I'm concerned about his saturation — can we oxygenate first?"로 썼다.
- `Let's switch to the failed airway algorithm now.`(예상외 어려운 기도 1번), `Everyone move to the failed airway plan right now.`(4번), `We move to emergency front-of-neck access now.`(CICO 1번), `Let's start the front-of-neck access protocol now.`(4번), `We go straight to front-of-neck access.`(기도 완전 폐쇄 1번): 실패 기도·CICO 선언과 목 앞 접근 결정은 마취과(또는 집도의)가 한다. 간호사는 호출·준비로 돕는다.
- `I'll stabilize the larynx for you.`(응급 윤상갑상막절개 1번): 후두를 잡는 것은 시술자의 손 동작이다. 간호사의 일로 읽히면 업무 범위 밖일 수 있다.
- `Tell me if you feel the tracheal clicks.`(부지·교환기 사용 2번): 기관 클릭은 부지를 쥔 사람이 느낀다. 간호사가 묻는 말이면 화자 설정이 어색하다.
- `You take cricoid pressure, I'll manage the cart.`(팀 역할 배정 0번), `You've got cricoid, I've got the cart.`(보조자 대기 3번): 윤상연골 압박은 근거가 엇갈리는 술기이고 마취과 지시로만 한다. 배정 문장이라 고치지 않았다.
- `We limit ourselves to a set number of attempts.`(재시도 최소화 0번): 횟수는 병원·마취과가 정하는 값이다.
- `Repeated tries only cause trauma and edema.`(2번): "only"는 단정이다. 반복 시도가 외상·부종 위험을 키운다는 것까지는 사실이다.
- `Push the airway rescue and prep for code.`(저산소 서맥 진행 2번), `Call the surgeon in for an emergency airway now.`(기도 완전 폐쇄 2번): 호출·준비라서 간호사 몫으로 괜찮지만, 지시를 받아 하는 말이다.
- `Does he have a beard, or any history of snoring?`(어려운 기도 예측 사정 4번)은 환자에게 묻는 말이 아니라 차트·보호자 확인 말로 읽힌다(화자 설정 불명확).

## 단어 정리 (결정 11, changes-or-difficult-airway.yaml 83건)
- 쉬운 단어 19개 제거: know·see·come·go·hand·patient·time·now·good(공통 목록 9) + year·look·get·make·want·tell·back·only·too·two(목록 밖 판단 10). 모든 상황이 단어 11개 이상 유지(V3).
- 문장 words 태그 3건 정리: `right away`·`right now`의 right(w-right는 "right blade size"만 남김), `I'm on suction`의 on(w-on은 "켜진"만 남김).
- ko 20개 정리: 같은 ko로 정답이 둘 되던 것(check/confirm, note/document, hard/difficult, begin/start, have/got, sats/saturation, job/role, try/attempt, right/away, advance/railroad, prep/ready, flag/call) + 뜻이 문장과 어긋난 것(open·plan·move·work·number) + 길이가 맞지 않던 긴 ko(flag·bag·unsure·code·railroad).
- 헤드워드 변경 없음.
- 같은 뜻으로 가까운 쌍(ko는 달라 정답이 둘은 아님): `w-start`/`w-begin`(시작하다/착수하다), `w-cric`/`w-cricothyrotomy`(약칭), `w-oxygenate`/`w-oxygenation`, `w-ventilate`/`w-ventilation`, `w-alert`/`w-flag`. 서로의 오답으로는 쓰지 않았다.
- `w-on`·`w-up`류 쉬운 말 중 `w-on`("켜진")은 장비 상태 표현이라 남겼다.

## 뉘앙스
- 한 상황당 slider 1 + (swap 1 또는 context 1). slider 21(정답 칸 0:6·1:7·2:8), swap 20, context 1(`bradycardic`), pair·reel 0.
- swap `Cric kit is open — here's the knife`는 응급에서 기구 이름을 정확히 말하라는 취지다. 화자는 메스를 건네는 스크럽 간호사로 적었다.
