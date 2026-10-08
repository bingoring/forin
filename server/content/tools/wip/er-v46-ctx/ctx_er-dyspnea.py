from _ctx_common_b import run
run("er-dyspnea", {
 "SpO2": {"scenes": {1: {"en": "SpO2 is 91 on room air."}}},
 "bring up": {"word": "productive", "ko": "가래가 나오는",
   "why": "productive cough는 가래가 나오는 기침을 뜻하는 의료 용어예요. 환자는 '생산적'이라는 일상 뜻으로 알아듣기 쉬우니, 설명 없이 쓰지 말고 가래를 뱉는지 쉬운 말로 물어요.",
   "scenes": {0: {"en": "Is your cough productive — are you bringing anything up?"}}},
 "phlegm": {"word": "sputum", "ko": "가래",
   "why": "sputum·purulent는 차트와 의료진끼리의 말이에요. 환자에게는 sputum이 phlegm이라고 풀어 주고, 색깔로 물어야 답해요.",
   "scenes": {0: {"en": "Sputum is just the phlegm you cough up — what color is it?"}}},
 "push": {"scenes": {1: {"en": "BiPAP is pushing 10 over 5."},
                     2: {"en": "The machine is pushing an IPAP of 10 and an EPAP of 5."}}},
 "muscle": {"scenes": {2: {"en": "Your forced vital capacity is declining as your muscles weaken."}}},
 "reassuring": {"scenes": {0: {"en": "Exam reassuring; no acute cardiopulmonary process identified."},
                           2: {"en": "Your workup is reassuring: negative for organic pathology."}}},
 "sats": {"scenes": {1: {"en": "Preoxygenated, sats 98% prior to induction."},
                     2: {"en": "I would like to inform everyone that the sats are currently ninety-eight percent."}}},
 "epinephrine": {"scenes": {0: {"en": "Give IM epinephrine now — her airway is closing."},
                            2: {"en": "Administering IM epinephrine for angioedema."}}},
})
