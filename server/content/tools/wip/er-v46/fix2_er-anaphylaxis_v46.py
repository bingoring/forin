import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-anaphylaxis.yaml'
d=yaml.safe_load(open(P)); S=d['situations']
NEW=[(6,0,"I'm stopping",'in a minute','for the scan'),
(7,0,"I'm stopping",'later on','in your other arm'),
(7,2,'I have epinephrine','for later today','in this room'),
(7,4,"I'll draw it up",'after you ask','into a syringe'),
(17,2,'Airway is swollen','tomorrow','from the ICU'),
(15,0,'Your airway','after you calm down','with the team')]
for si,j,st,old,new in NEW:
    t=S[si]['sentences'][j]; assert t['en'].startswith(st) and t['decoy']==old,(si,j,t['decoy'])
    assert new not in t['en'] and new not in t['chunks']
    t['decoy']=new
    print(f"{si}.{j} {old!r} -> {new!r} | KO {t['ko']}")
    ch=t['chunks']
    for k in range(len(ch)): print('   rep:',' '.join(ch[:k]+[new]+ch[k+1:]).replace(' .','.'))
    print('   ins:',' '.join(ch[:-1]+[new]+ch[-1:]).replace(' .','.'))
yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
