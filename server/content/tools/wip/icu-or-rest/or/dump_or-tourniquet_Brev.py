import yaml,sys
d=yaml.safe_load(open('or-tourniquet.yaml'))
for i,s in enumerate(d['situations']):
    print(f"\n######## S{i} {s['title']}")
    for j,x in enumerate(s['sentences']):
        print(f"\n[{i}-{j}] EN: {x['en']}\n  KO: {x['ko']}\n  D1: {x['distractorsKo'][0]}\n  D2: {x['distractorsKo'][1]}")
        print(f"  tag={x.get('tag')} icon={x.get('icon')} | why: {x.get('why')}")
        print(f"  chunks={x['chunks']} decoy={x['decoy']!r}")
        b=x['blank'];a=b['answer']
        for o in b['options']:
            print(f"   {'*' if o['en']==a else ' '} {x['en'].replace(a,'['+o['en']+']',1)}")
    o=s['order']
    print(f"  ORDER ko={o['ko']} tag={o.get('tag')} icon={o.get('icon')} why={o['why']}")
    L=o['lines']
    for l in L: print(f"    - {l['en']} | {l.get('ko')} | {l.get('note')} | {l['icon']}")
    for k in range(3):
        sw=[l['en'] for l in L]; sw[k],sw[k+1]=sw[k+1],sw[k]
        print(f"    swap{k+1}{k+2}: "+' / '.join(sw))
