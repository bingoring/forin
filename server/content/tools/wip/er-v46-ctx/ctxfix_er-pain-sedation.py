from _ctxfix_common_b import runfix
runfix("er-pain-sedation", {
 "rate": {"scenes": {2: {"en": "Please rate your pain on the NRS."}}},
 "drowsy": {"scenes": {2: {"en": "This causes CNS depression, so you may get drowsy."}}},
 "slow": {"scenes": {2: {"fix": "Your anxiety pill plus this pain medicine can slow your breathing, so I'll check on you often."}}},
 "procedure": {"scenes": {2: {"fix": "Everything went well — you're waking up now, and I'm right here."}}},
 "epinephrine": {"word": "epi",
   "scenes": {0: {"en": "Anaphylaxis — epi 0.5 IM, now!"}, 2: {"en": "Epi 0.5 IM, now!"}}},
 "BP": {"scenes": {2: {"en": "Your BP's soft, so I'm titrating the fentanyl."}},
   "why": "soft(혈압이 낮다는 의료진 은어)·titrate는 의료진 말이에요. 환자에게는 'blood pressure is low', 'small amounts'로 풀어서 말해요."},
})
