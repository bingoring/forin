from _ctxfix_common_b import runfix
runfix("er-chestpain", {
 "start": {"scenes": {2: {"en": "Did symptoms start at rest or on exertion, and how long PTA?",
                          "fix": "Were you resting or active when it started, and how long ago was that?"}},
   "why": "PTA(병원 도착 전)·on exertion 같은 말은 차트와 의료진끼리의 말이에요. 환자에게는 '쉬고 있었는지, 움직이고 있었는지, 얼마나 전인지'를 쉬운 말로 물어요."},
 "priority": {"scenes": {2: {"fix": "I'm moving you up the list so the doctor can see you sooner."}}},
 "press": {"scenes": {0: {"en": "Does it hurt more when I press here?"},
                      1: {"en": "Pain reproduces when I press on the sternum — maybe costochondritis, but ECG's still pending."}}},
 "ECG": {"scenes": {2: {"fix": "We're checking your heart right now, and the doctor is on the way."}}},
 "rhythm": {"scenes": {2: {"fix": "Your heartbeat looks steady so far — that's good, but we're still checking."}}},
 "detail": {"scenes": {2: {"fix": "Please tell me everything you're feeling — even the small stuff matters."}}},
 "point": {"scenes": {2: {"fix": "Show me — where does it hurt?"}}},
 "tear": {"scenes": {2: {"fix": "Does the pain go into your back, between your shoulder blades?"}}},
 "inflammation": {"scenes": {2: {"fix": "The lining around your heart may be irritated — that can cause this kind of sharp pain."}}},
 "call": {"scenes": {2: {"en": "You're decompensating, so I'm calling a rapid response.",
                         "fix": "I'm right here with you — more help is coming right now."}},
   "why": "decompensating·rapid response는 의료진끼리의 말이에요. 의식이 흐려지는 환자에게는 짧고 쉬운 말로 곁에 있다는 것과 도움이 온다는 것을 알려요."},
 "update": {"scenes": {0: {"en": "Quick update on bed 3 — chest pain's back at 7/10, repeat ECG done."}}},
})
