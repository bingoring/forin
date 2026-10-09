from _ctxfix_common import runfix
runfix("core-handoff-er", {
 "correct": {"ko": "맞는(확인)"},
 "turn": {"word": "closely", "ko": "주의 깊게",
   "scenes": {1: {"en": "Pt at risk for rapid deterioration; monitoring closely."},
              2: {"en": "She could turn quickly, so watch her closely and call us if anything changes."}},
   "why": "'turn quickly, watch her closely'는 급변 가능성을 동료에게 넘기는 인계 말이에요. 보호자에게 쓰면 뜻이 전해지지 않거나 겁을 주고, 관찰을 가족에게 떠넘기는 말처럼 들려요."},
 "status": {"scenes": {2: {"en": "Forget what I said — his status has changed. He's desatting.",
   "fix": "I need to update you — his oxygen level has dropped, and the team is with him now."}},
   "why": "'Forget what I just said'는 동료 사이에서 인계를 무를 때 쓰는 말이고, status·desatting은 의료진 말이에요. 가족에게는 앞서 한 말을 없던 일로 하라는 말로 들리니, 무엇이 바뀌었는지 쉬운 말로 알려요."},
})
