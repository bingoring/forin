from _ctx_common import run
run("core-safety-er", {
 "date of birth": {"scenes": {1: {"en": "Read me the name and date of birth on your chart."},
                               2: {"en": "Name and date of birth."}}},
 "call": {"scenes": {2: {"en": "You are not allowed to get out of bed, or we'll call your doctor."}},
   "why": "'not allowed'에 '의사를 부르겠다'는 위협까지 붙으면 금지 명령처럼 들려요. 이유와 대안(부르면 도와준다)을 같이 말하면 협조를 얻기 쉬워요."},
 "allergies": {"scenes": {2: {"en": "Any other allergies or hypersensitivity reactions to report?"}}},
 "remind": {"scenes": {2: {"en": "I already reminded you three times — stay in bed!"}}},
 "unknown male": {"scenes": {1: {"en": "Unknown male still has no ID — use the temporary name on every label."}}},
 "restraints": {"scenes": {2: {"en": "We've got him in restraints because he wouldn't stop pulling his lines."}},
   "why": "환자 탓으로 돌리는 말투(because he wouldn't stop)에 억제대가 처벌처럼 들려요. 가족에게는 잠시 쓰는 것이고 무엇을 막으려는지를 먼저 말해요."},
 "isolation": {"scenes": {1: {"en": "Bed 5 is in isolation on contact precautions — gown and gloves."},
                           2: {"en": "He's in isolation, he's contagious, so keep your distance."}}},
 "remove": {"scenes": {0: {"en": "I'm going to remove a few things from the room — it's to keep you safe."},
                        2: {"en": "Remove your belt and shoelaces. Now."}}},
 "time-out": {"scenes": {2: {"en": "Time-out done, we're good, right? Let's just go."}}},
})
