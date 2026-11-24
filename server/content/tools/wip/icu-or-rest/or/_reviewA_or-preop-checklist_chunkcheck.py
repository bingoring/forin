import sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
P=[
 # (label, en, chunks, words)
 ("6.3 new","Blood was ordered for this case, so I'll check with anesthesia before we start.",["Blood was ordered","for this case",", so I'll check with anesthesia","before we start","."],["w-blood","w-case","w-anesthesia","w-start"]),
 ("6.4 ch","Let me follow up with the lab on the crossmatch.",["Let me","follow up","with the lab","on the crossmatch","."],[]),
 ("5.4 new","It's ready whenever you want to give it before incision.",["It's ready","whenever you want","to give it","before incision","."],["w-ready","w-give","w-incision"]),
 ("7.3 ch","This lab is critical before we can proceed.",["This lab","is critical","before we can proceed","."],[]),
 ("10.0 KP ch","This line isn't flowing well, so I'll start a new one.",["This line","isn't flowing well",", so I'll start","a new one","."],[]),
 ("10.1 KP ch","You'll feel a small pinch.",["You'll","feel","a small pinch","."],[]),
 ("10.3 ch","Let me try a new IV site on your other arm.",["Let me","try","a new IV site","on your other arm","."],[]),
 ("10.4 ch","This new line should give you a much better flow.",["This new line","should","give you","a much better flow","."],[]),
 ("11.4 new","You'll get them back in recovery after you wake up.",["You'll get them back","in recovery","after you","wake up","."],["w-recovery","w-wake"]),
 ("12.2 KP ch","I'll confirm the VTE prevention orders.",["I'll","confirm","the VTE prevention orders","."],[]),
 ("12.4 new","When was your last dose of blood thinner?",["When was","your last dose","of blood thinner","?"],["w-dose","w-thinner"]),
 ("13.4 new","Your doctor may order a dose of insulin before surgery if it's needed.",["Your doctor may order","a dose of insulin","before surgery","if it's needed","."],["w-dose","w-insulin","w-surgery"]),
 ("14.3 ch","This mismatch needs to be resolved before we start.",["This mismatch","needs to be resolved","before we start","."],[]),
 ("16.2 KP alt","Anesthesia is giving it now, and I'll document the time.",["Anesthesia is giving it","now",", and I'll document","the time","."],["w-anesthesia","w-give","w-document"]),
 ("16.3 new","The antibiotic should be started before we cut.",["The antibiotic","should be started","before we cut","."],["w-antibiotic","w-start","w-cut"]),
 ("16.4 new","A short delay is better than cutting without the antibiotic.",["A short delay","is better","than cutting","without the antibiotic","."],["w-delay","w-better","w-cut","w-antibiotic"]),
 ("17.2 KP alt","I'm calling the blood bank to activate the massive transfusion protocol.",["I'm calling","the blood bank","to activate","the massive transfusion protocol","."],[]),
 ("17.4 new","Should we activate the massive transfusion protocol now?",["Should we activate","the massive transfusion protocol","now","?"],[]),
 ("7.2 KP alt","I'll let the surgeon know.",["I'll let","the surgeon","know","."],[]),
 ("15.2 KP alt","I'm calling the surgeon right now.",["I'm calling","the surgeon","right now","."],[]),
 ("9.2 KP alt","Let's adjust the timing, and I'll document it.",["Let's adjust","the timing",", and I'll","document it","."],[]),
 ("19.0 KP ch","We still need the time-out even in an emergency.",["We still","need the time-out","even in an emergency","."],[]),
 ("12.3 ch","Let's put these compression sleeves on before we go back.",["Let's put","these compression sleeves on","before","we go back","."],[]),
 ("20.4 new","Let's keep any prior device and MRI records close by, just in case.",["Let's keep","any prior device and MRI records","close by",", just in case","."],[]),
 ("7.3 alt","This lab is required before we can proceed.",["This lab","is required","before we can proceed","."],[]),
]
for lab,en,ch,w in P:
    print(lab, 'join', v.assembles_to(ch,en), 'got',v.meaningful_chunks(ch),'want',v.min_chunks_for(en),'dangling',v.dangling_chunks(ch))
