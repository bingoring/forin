# icu-weaning-extubation — A(단어·뉘앙스) 메모

문장 en·ko·chunks·words·goal은 바꾸지 않았다. 아래는 검토가 판단할 것.

## 쉬운 단어 태그 (결정 11) — 못 했음
- 지시서가 A에게 문장 `words`를 바꾸지 말라고 하면서 결정 11의 쉬운 단어 태그 빼기도 맡겨, 둘이 부딪친다. combine_halves.py가 A와 B의 `words`가 다르면 멈추므로 태그를 빼지 않았다.
- 공통 목록에 있는 `w-family`는 문장 2개(섬망·불안 상황 0번, 4번)에 태그돼 있다. 빼려면 두 반쪽 모두의 해당 문장 `words`에서 `w-family`를 지우고 은행에서도 지워야 한다. 그 상황의 서로 다른 단어 수(V3)는 충분한지 확인 필요.
- 목록 밖에서 쉬워 보이는 후보(판단분): stop, heart, side, turn, team, plan, reason, warm, strong. 그대로 두었다.

## 문장 쪽에서 본 의심 (고치지 않음)
- 발관 직후 호흡부전 급변 0번·3번("we can trial rescue NIV briefly", "let's try rescue NIV"): 발관 뒤 이미 생긴 호흡부전에 NIV를 구조 치료로 쓰는 것은 재삽관을 늦출 수 있어 일반적으로 권하지 않는다(COPD·심부전 등 선별된 환자에서 짧게 시도하는 경우가 있음). 학습자가 "발관 실패엔 NIV 먼저"로 배우지 않게 검토가 문장을 볼 것. 같은 상황 1번 문장이 "계속 악화되면 지체 없이 재삽관"이라 균형은 잡혀 있다.
- 발관 후 HFNC 전환 관리 3번("The high-flow cannula keeps his airway open"): HFNC는 따뜻한 산소를 많은 양으로 주는 것이지 기도를 열어 두는 장치가 아니다. "helps him breathe without a tube" 쪽이 정확하다.
- 발관 후 예방 NIV 적용 0번의 `fail`은 문장 1번·SBT 실패 상황의 `failing`과 달리 "발관 실패" 뜻이라 같은 헤드워드(fail)에 묶여 있다. 문제는 없으나 참고.
- 기관절개 상황 1번 ko "나빠진다는 뜻이 아니라 …"는 en("It doesn't mean he's failing")이 "실패"가 아니라 "상태가 나빠지는 중"으로 옮겨져 있다. 뜻은 통한다.

## 정리한 것 (changes-icu-weaning-extubation.yaml, 16건)
- 헤드워드 원형: watch, deflate, deteriorate, fail, seal, increase, cause, spike, reorient, obstruct, delay (11개, fail·seal·increase·cause·delay는 ko도 맞춤)
- ko만: comeoff(wean과 겹침), vent(ventilator와 겹침), calm(sedation의 '진정'과 겹침), clear(동사 용법), support(인공호흡 맥락 '보조')
- 복수형·진행형이 자연스러운 muscles·movements·exercises·goals·notes·measures·lines·secretions·risk factors는 그대로 둠.
