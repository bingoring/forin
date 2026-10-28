import yaml,re
d=yaml.safe_load(open('icu-status-epilepticus.yaml'))
B={ (0,1):"room|diet|cost",(0,4):"@write down|guess|predict|wonder",(1,0):"feet|knees|belly",(1,1):"hallway|doorway|counter",
(1,3):"tray|clipboard|basin",(2,0):"second-line|third-line|over-the-counter",(2,2):"remotely|weekly|nightly",
(3,0):"weight|diet|bowels",(3,2):"dialysis|feeding|traction",(4,0):"fasting|routine|weekly",(4,3):"normal|clotted|pending",
(5,0):"thirsty|feverish|itchy",(5,1):"adjusting|ordering|scheduling",(5,2):"cure|dose|label",(5,3):"surgery|isolation|charge",
(6,1):"age-based|height-based|time-based",(6,2):"diet|visitors|incision",(6,3):"first|same|third",(6,4):"bleeding|constipation|hunger",
(7,2):"schedule|record|bill",(8,0):"alone|separately|weekly",(8,1):"unrelated|secondary|optional",(8,2):"photos|prescriptions|forms",
(8,3):"cough|rash|bruise",(8,4):"worsen|recur|spread",(9,1):"transfusions|dialysis|antibiotics",(9,3):"early|alone|briefly",
(10,0):"tongue|skin|eyes",(10,1):"dialysis|feeding|biopsy",(10,3):"blinks|speaks|sits up",(11,1):"bleeding|coughing|sneezing",
(12,0):"itching|sneezing|hiccups",(12,1):"swelling|blood flow|size",(12,3):"daily|childhood|final",(12,4):"printed|billed|copied",
(13,0):"hourly|blindly|routinely",(14,0):"bruise|rash|sprain",(14,1):"billing|labeling|dressing",(14,2):"schedule|bill|copy",
(14,3):"blister|cataract|sunburn",(15,0):"one-time|weekly|brief",(15,1):"dietary|wound|skin",(15,2):"@EEG|ECG|CT|MRI",
(16,1):"recorded|displayed|posted",(16,2):"location|diet|scheduling",(16,4):"first|second|fourth",(17,0):"line|valve|chart",
(17,1):"discharge|dialysis|surgery",(17,2):"dialysis|feeding|rehabilitation",(18,0):"tumors|infection|clots",(18,2):"schedule|bill|print",
(18,3):"dry|red|cloudy",(19,0):"timer|report|transfer",(19,1):"count|bill|chart",(19,4):"daily|weekly|yearly",
(20,0):"brief|vague|formal",(20,1):"discharge|surgery|billing",(20,2):"medications|labs|diet",(20,3):"easy|nice|great",(20,4):"question|judge|record"}
for (s,j),v in sorted(B.items()):
    x=d['situations'][s]['sentences'][j]; en=x['en']
    if v.startswith('@'):
        opts=v[1:].split('|'); a=opts[0]
    else:
        a=x['blank']['answer']; opts=[a]+v.split('|')
    m=[mm for mm in re.finditer(r'(?<!\w)'+re.escape(a)+r'(?!\w)',en)]
    assert len(m)==1,(s,j,a); assert len(set(opts))==4
    bef,aft=en[:m[0].start()],en[m[0].end():]
    for o in opts:
        art=''
        if re.search(r'\ban $',bef) and o[0].lower() not in 'aeiou': art=' <ART>'
        if re.search(r'\ba $',bef) and o[0].lower() in 'aeiou': art=' <ART>'
        print(f"{s}.{j} {'*' if o==a else ' '} {bef}[{o}]{aft}{art}")
print(len(B))
