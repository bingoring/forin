# notes-icu-transfusion-A — 문장 en·ko를 고치지 않고 적어 두는 것 (A, 2026-10-29)

문장 en·ko·chunks·goal은 건드리지 않았습니다. 아래는 검토가 판단할 것입니다(상황 번호.문장 번호, 0부터).

## 업무 범위 밖 단독 결정·처방 없이 하는 투약처럼 들리는 문장
- 9.2 `Low fibrinogen means we should give cryoprecipitate.` — 성분 선택은 처방. 간호사의 판단 어조(`we should give`).
- 12.2 `So we can hold off and just recheck his count later.` — 수혈 보류 판단은 처방 영역. 12.4~12.5도 기준 적용은 처방대로여야 함.
- 13.1 `For mild hives, I'll pause and give an antihistamine.` — 항히스타민제는 처방(또는 병원 프로토콜)이 있어야 하고, 의료진에게 알리는 단계가 빠져 있음.
- 13.3 `A little redness alone doesn't mean we stop the unit.` — 수혈 중 새 증상은 일단 멈추고 평가하는 것이 일반 관행. 간호사가 '멈추지 않아도 된다'고 단정하는 어조라 위험.
- 10.6 `I'll give calcium now before it drops any further.`, 19.1·19.2·19.4·19.6 칼슘 투여 — 처방이나 대량수혈 프로토콜 전제가 없음.
- 11.1 `I'll give four-factor PCC and IV vitamin K now.` — 역전제 투여는 처방.
- 16.1 `get the epi now`, 16.2 `I'm giving IM epinephrine now`, 16.5 `I'll push a second dose if she doesn't improve` — 아나필락시스 프로토콜·처방 전제가 없고, 재투여가 간호사 판단 어조. 16.3 `opening fluids wide`도 처방 필요.
- 17.3 `I'll replace fibrinogen, platelets, and plasma per the labs.` — 근거가 처방이 아니라 검사 결과로 읽힘.
- 14.5 `We can maximize iron and minimize blood draws.` — 철분 투여는 처방.
- 7.5 `apply extra oxygen`·1.0 `I'll run it slow for the first fifteen minutes` — 산소 용량과 시작 속도는 처방·병원 정책(큰 문제 아님).

## 지킬 수 없는 약속·진단 단정
- 14.6 `We'll use cell salvage and smaller lab tubes where we can.` — 세포회수술 수용 여부는 환자마다 다르고 팀 결정. 약속처럼 들림.
- 20.6 `We'll make sure his care matches his wishes.` — 치료 목표는 의료진과 가족이 정함. 간호사 단독 약속이면 지킬 수 없음.
- 18.1 `this is TRALI, not overload` — 간호사 단독 진단 어조. `I'm concerned this may be TRALI`가 안전.
- 16.3 `calling the code team` — ICU에서는 의료진이 곁에 있는 환경이라 병원 프로토콜에 맞는지 확인 필요(신속대응팀 호출은 틀린 관행).

## 사소
- 3.1 `FFP replaces clotting factors, platelets treat thrombocytopenia.` 쉼표로 두 문장을 잇는 모양(영어 문법).
- 15.2 `You track products, you push blood, I'll run the rapid infuser.` 두 번 나오는 `you`가 누구인지 모호(ko도 `당신은 … 당신은`).
- 4.0·4.1 30분·4시간은 병원 정책 의존(AABB 기준). 정답 쪽이 틀린 것은 아님.
- 12.1 ko `보통 만이에요` — `1만`이 더 읽기 쉬움.

## 단어·뉘앙스 쪽 판단
- 결정 11: 공통 쉬운 단어 7개(patient·name·minute·hour·know·see·come)와 판단 6개(four·thousand·together·percent·lip·finger)를 은행에서 지움. `fifteen`·`thirty`는 15분/30분 규칙이라 남김.
- 헤드워드 17개를 원형으로(desaturating·wheezing·wishes·beliefs·tubes·activating·roles·assigned·given·totals·fluids·oozing·settings·levels·stretching·compressions·mattered). `coags`·`red cells`·`blood type`은 임상 용어 그대로 남김.
- 문장 단위 태그 빼기: back(허리 명사 2곳)·way(on the way)·call(call out 2곳)·monitor(동사)·number(수치)·ask(요청)·lab(lab tubes)·run(running totals).
- 혈액 제제 은행 단어(unit·product·agent)의 ko 겹침은 `혈액 유닛`·`혈액 제제`·`약제`로 갈랐음.
