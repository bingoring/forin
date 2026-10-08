from _ctxfix_common_b import runfix
runfix("er-dyspnea", {
 "sputum": {"word": "cough up", "ko": "기침해서 뱉다",
   "scenes": {0: {"en": "What color is the phlegm you're coughing up?"},
              1: {"en": "Coughing up purulent green sputum."},
              2: {"en": "Are you coughing up purulent sputum?",
                  "fix": "Is the phlegm clear, yellow, or green?"}},
   "why": "purulent·sputum은 차트에 쓰는 말이에요. 환자에게는 phlegm이나 mucus라고 하고, 색깔로 물어요."},
 "epinephrine": {"word": "epi",
   "scenes": {0: {"en": "Give IM epi now — her airway is closing."},
              2: {"en": "Administering IM epi for angioedema."}}},
})
