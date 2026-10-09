from _ctxfix_common import runfix
runfix("core-language-er", {
 "find": {"scenes": {1: {"en": "Still trying to find a Mam interpreter — the service says maybe 40 minutes."}}},
 "stay": {"ko": "머물다(그대로 있다)",
   "scenes": {0: {"en": "The interpreter is coming — please stay here with me."},
              1: {"en": "Interpreter is five minutes out — can you stay in the room with him?"},
              2: {"fix": "Please stay right here — I'm with you, and the interpreter will be here soon."}}},
 "grave": {"word": "critical", "ko": "위중한",
   "scenes": {0: {"en": "I'm so sorry — he's in critical condition."},
              1: {"en": "Bed 6 is critical — MAP 55 on two pressors."},
              2: {"en": "He's critical — hemodynamically unstable on two pressors.",
                  "fix": "I'm so sorry — he is very sick, and we're doing everything we can."}},
   "why": "hemodynamically·pressors 같은 임상어는 의료진끼리의 말이에요. 가족에게는, 특히 통역을 거칠 때는 쉬운 말로 분명하게 전해요."},
})
