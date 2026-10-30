# 상황 순서(0..20) × 문장 순서의 decoy — 정답 청크 하나와 같은 자리·같은 모양의 틀린 구
DECOYS = [
 ["right here","politely","everything gets repeated","visiting friends","in a few words","is too fast"],
 ["with the mask","to the board","for water","can't sleep","pointing to the pictures","slowly","that works for the team"],
 ["see me","if you're ready","your hand","for the results","You're warm","any draft","seconds"],
 ["how it started","the usual pain","on this card","that matches your age","in a larger size",", or new","where it started"],
 ["and use a loud voice","— and hold it","if that is okay",", more simply","keep it","what I wrote","if I'm too quiet"],
 ["and his address","with the chart","keep him warm","the forms","the costs again","about the paperwork","home"],
 ["— one squeeze","? Nod once","using our board","a blanket","short questions","Two taps","few seconds"],
 ["the schedule fully","before you leave","remembered","Take all the notes","you remember","wrong answer","twice more"],
 ["for helping me","his schedule","the visit","for the team","I not write","on the schedule","something rude"],
 [", and I'm tired","for speed","the burden off him","of him","the hospital rules","I'll call two","with the nurse"],
 ["a large-print menu","and speak loudly","relaxed","read maps","in blue ink","on his shoulder","quiet and dim"],
 ["quietly","to us","no cost","to the staff","right or wrong rules","for rooms like this","one day"],
 ["in large print","store this medicine","why you'd","each visit","measuring the water","a refill","feels new"],
 ["to the lobby","hear clearly","can rest","hear the speaker","is repeated","the volume","before you nod"],
 ["side","wanted","no delay","that part quickly","I wrote","repeat that","you were tired"],
 ["walking","is charging","her warm","waiting","to count","is waiting","the news"],
 ["gently and quickly","late news","with the team","I'll speak softly","to cry","you waiting",", no matter how late"],
 ["is repeated","have said","visit together","in this room","in his job","with him","the visit lasts"],
 ["quickly",", not just age","to the team","he can't remember",", not just today","refuses","honest"],
 ["video interpreter","wall clock","— I'm sitting","hear me","short picture","on the phone","your things"],
 ["to share","and his comfort","find a quiet room","about what helps","how difficult","start on","your plans"],
]
# (상황 순서, 문장 순서) → 바꿀 필드 {ko1, ko2, ans, w:[3]}
OVR = {}
def o(si, i, **kw): OVR[(si, i)] = kw
o(2,2, ko2="가능하시면 발을 움직여 보세요.")
o(6,4, ko1="한 번에 답할 질문만 드릴게요.")
o(13,3, ko2="모두 통역사가 또렷하게 보이세요?")
o(16,4, ans="okay", w=["wrong","rude","shameful"])
o(7,2, w=["remembered","requested","discussed"])
o(8,3, w=["expensive","dangerous","impossible"])
o(10,6, w=["complicated","overcrowded","distracting"])
o(11,3, w=["determine","evaluate","overrule"])
o(13,5, w=["microphone","brightness","projector"])
o(18,1, w=["intelligence","personality","pronunciation"])
o(19,3, w=["remember","recognize","memorize"])
o(1,1, w=["guess","choose","pick"])
o(8,1, w=["joke","write","argue"])
o(17,1, w=["wait","vote","pray"])
o(18,2, w=["sign","hide","change"])
o(1,2, w=["never","rarely","seldom"])
o(4,3, w=["casually","carelessly","angrily"])
o(7,0, w=["partly","barely","lightly"])
o(7,6, w=["alone","later","separately"])
o(10,1, w=["softly","rudely","randomly"])
o(11,0, w=["loosely","roughly","sloppily"])
o(14,3, w=["quickly","fully","proudly"])
o(16,3, w=["softly","quickly","loudly"])
o(15,6, w=["learn","decide","finish"])
o(19,1, w=["need","see","mean"])
o(8,6, w=["rude","careless","blunt"])
o(7,5, w=["small","silly","odd"])
o(16,2, w=["space","rest","peace"])
o(15,5, w=["family","food","news"])
o(12,2, w=["later","first","again"])
