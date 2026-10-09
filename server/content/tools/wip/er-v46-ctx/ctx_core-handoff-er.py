from _ctx_common import run
run("core-handoff-er", {
 "chief complaint": {"scenes": {1: {"en": "Chief complaint: abd pain since this AM."}}},
 "correct": {"scenes": {1: {"en": "Name and DOB correct per the chart."}}},
 "pending labs": {"scenes": {1: {"en": "Pending labs: AM blood cultures."}}},
 "turn": {"scenes": {1: {"en": "Pt may turn quickly — close monitoring in place."},
                      2: {"en": "She could turn quickly — so watch her and call us if anything changes."}}},
 "drip": {"scenes": {1: {"en": "Norepi drip titrated up for MAP goal."}}},
 "Forget what I just said": {"word": "status", "ko": "상태",
   "why": "'Forget what I just said — his status has changed'는 바쁜 동료 사이에서 인계를 무를 때 쓰는 말이에요. 가족에게는 앞서 한 설명을 없던 일로 하라는 말로 들려 불신을 줄 수 있어요."},
})
