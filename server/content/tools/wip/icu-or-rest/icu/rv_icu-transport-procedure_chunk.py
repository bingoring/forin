import re
P=[
"I'll recheck her / one more time / before I step out / .",
"I'll double-check / the sedation and pressor pumps / before we go / .",
"The battery / on the pump / has plenty of charge / .",
"Let me know / if you need / more local anesthetic / .",
"He came in / with chest pain / and a rising troponin / .",
"Right now / he's on / two liters of oxygen / and stable / .",
"Surgery / is on their way down / right now / .",
"She can go back / to a regular / monitoring schedule / .",
"Right now / she's on the edge / of needing / more support / .",
"Rhythm check / — everyone clear / .",
"We made it back / before anything / ran out / .",
"If she gets worse / mid-scan / , we may not catch it / in time / .",
"Watch his chest rise / with each breath / I give / .",
"The safe zone / is just past / those double doors / .",
"Everyone / not screened / stays / outside the room / .",
"The airway team / will meet us / back in the unit / to re-intubate / .",
"I'll call for help / if her breathing / doesn't improve / with stimulation / .",
"Everyone / not screened / stays / outside the room / .",
]
for p in P:
    ch=[c.strip() for c in p.split(' / ')]
    en=' '.join(ch); en=re.sub(r' ([,.?!])',r'\1',en)
    n=len(en.replace('—','').split()); k=len([c for c in ch if re.search('[A-Za-z]',c)])
    need=2 if n<=4 else 3 if n<=8 else 4
    print('OK ' if k>=need else 'BAD',n,k,need,'|',en)
