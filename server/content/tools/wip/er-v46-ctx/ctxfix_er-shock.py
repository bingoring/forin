from _ctxfix_common_b import runfix
runfix("er-shock", {
 "circulation": {"why": "peripheral circulation·capillary refill은 의료진끼리의 말이에요. 환자에게는 '손이 서늘해서 피가 잘 흐르는지 확인한다'처럼 풀어 말해요."},
 "ready": {"scenes": {1: {"en": "I've got fluids running and blood ready to go."}}},
 "output": {"why": "mL·per kilo 같은 수치와 기준은 의료진끼리의 말이에요. 환자에게는 '소변이 기대보다 적어서 수액을 더 줄 수 있다'로 풀어 말해요.",
            "scenes": {2: {"en": "Your urine output is only 20 mL an hour, under 0.5 per kilo."}}},
 "cause": {"word": "unclear", "ko": "분명하지 않은",
           "why": "etiology, hypotension은 의료진끼리의 말이에요. 환자에게는 '아직 원인을 모르니 검사로 찾고 있다'고 풀어서 말해요.",
           "scenes": {0: {"en": "Etiology of hypotension unclear; work-up in progress."},
                      1: {"en": "Etiology still unclear — labs and ECG are pending."},
                      2: {"en": "The etiology of your hypotension remains unclear."}}},
 "drain": {"why": "tamponade physiology·emergent pericardial drainage는 의료진끼리의 용어예요. 보호자에게는 '심장을 누르는 액체를 지금 빼야 한다'로 풀어 말해요.",
           "scenes": {1: {"en": "Echo shows tamponade — setting up to drain the effusion."}}},
 "hypotensive": {"why": "hypotensive, mcg/min, lactate 같은 말과 수치는 의료진끼리의 표현이에요. 보호자에게는 '강한 약을 써도 혈압이 낮아 중환자실로 옮기려 한다'처럼 풀어 말해요.",
                 "scenes": {2: {"en": "She's persistently hypotensive on 12 mcg/min of norepi, with rising lactate."}}},
})
