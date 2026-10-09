from _ctxfix_common_b import runfix
runfix("er-asthma-copd", {
 "CO2": {"scenes": {2: {"fix": "Your body tends to hold on to carbon dioxide, so we keep your oxygen a little lower on purpose."}}},
 "orthopnea": {"word": "lie flat", "ko": "똑바로 눕다",
   "scenes": {0: {"en": "Can you lie flat to sleep, or do you need extra pillows?"},
              1: {"en": "Orthopnea — unable to lie flat, sleeps on three pillows."},
              2: {"en": "Do you have orthopnea, or can you lie flat?"}}},
})
