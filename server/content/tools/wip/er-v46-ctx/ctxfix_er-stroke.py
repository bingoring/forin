from _ctxfix_common_b import runfix
runfix("er-stroke", {
 "slurred": {"why": "의료진끼리는 presenting with·facial palsy 같은 임상 표현이 정확하지만, 환자에게는 눈에 보이고 들리는 대로 쉬운 말로 설명해야 해요."},
 "normal": {"why": "의료진끼리는 last known normal·baseline 같은 압축 표현을 쓰지만, 불안한 보호자에게는 쉬운 질문으로 시각을 끌어내야 정확한 답이 나와요.",
            "scenes": {1: {"en": "Last known well 08:15 — his wife says he was normal then."},
                       2: {"en": "When was he last known normal — at his neuro baseline?"}}},
 "wake": {"scenes": {2: {"en": "What's your last known well time — before sleep, or on waking?"}}},
 "headache": {"scenes": {2: {"fix": "If the headache comes back stronger, press this button and call me."}}},
 "stay": {"scenes": {2: {"en": "Per protocol, you'll need to stay; discharge isn't advised at this time."}}},
})
