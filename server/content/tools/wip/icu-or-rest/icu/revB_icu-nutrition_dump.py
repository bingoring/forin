import yaml,sys
d=yaml.safe_load(open('icu-nutrition.yaml'))
mode=sys.argv[1] if len(sys.argv)>1 else 'all'
for si,s in enumerate(d['situations']):
    print(f"\n######## S{si} {s['title']}")
    for j,x in enumerate(s['sentences']):
        k=f"{si}.{j}"
        if mode in('all','ko'):
            print(f"[{k}] {x['en']}\n   ko: {x['ko']} ({len(x['ko'])})\n   X1: {x['distractorsKo'][0]} ({len(x['distractorsKo'][0])})\n   X2: {x['distractorsKo'][1]} ({len(x['distractorsKo'][1])})")
        if mode in('all','meta'):
            print(f"[{k}] tag={x['tag']} icon={x['icon']} | {x['en']}\n   why: {x['why']}")
        if mode in('all','blank'):
            b=x['blank'];a=b['answer'];en=x['en']
            i=en.find(a)
            print(f"[{k}] ans={a}")
            for o in b['options']:
                print("   "+("*" if o['en']==a else " ")+en[:i]+"["+o['en']+"]"+en[i+len(a):])
        if mode in('all','decoy'):
            c=x['chunks'];dc=x['decoy']
            print(f"[{k}] {' / '.join(c)}   decoy={dc!r}")
            for p in range(len(c)):
                if c[p] in '.?!,': continue
                print("    "+" ".join(c[:p]+[f'<{dc}>']+c[p+1:]))
    if mode in('all','order'):
        o=s['order']
        print(f"ORDER ko={o['ko']} | why={o['why']}")
        L=o['lines']
        for l in L: print(f"   - {l['en']} [{l['icon']}] {l.get('ko')} ({l.get('note')}) {len(l['en'].split())}w")
        for a in range(3):
            M=L[:];M[a],M[a+1]=M[a+1],M[a]
            print(f"  swap{a+1}<->{a+2}: "+" | ".join(m['en'] for m in M))
