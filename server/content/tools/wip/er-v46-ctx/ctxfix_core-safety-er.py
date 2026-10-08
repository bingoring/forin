from _ctxfix_common import runfix
runfix("core-safety-er", {
 "call": {"scenes": {2: {"en": "You're a high fall risk, so you need to call before ambulating.",
   "fix": "Please ring the call button before you get up, and I'll come help you."}},
   "why": "'fall risk'·'ambulating'은 동료끼리의 말이에요. 환자에게는 혼자 일어나지 말고 부르면 도와준다고 쉬운 말로 해요."},
 "restraints": {"scenes": {2: {"en": "He's in restraints per policy for line protection.",
   "fix": "These soft straps are just for now, to keep him from pulling out his IV. We check on him often."}},
   "why": "'per policy'·'line protection'은 기록과 인계의 말이에요. 가족에게는 잠시 쓰는 것이고 무엇을 막으려는지를 쉬운 말로 먼저 알려요."},
 "remove": {"scenes": {2: {"fix": "For your safety, we remove belts and shoelaces for everyone here — can I hold on to yours?"}}},
})
