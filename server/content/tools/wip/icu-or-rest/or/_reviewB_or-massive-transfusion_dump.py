import yaml,sys
d=yaml.safe_load(open('or-massive-transfusion.yaml'))
mode=sys.argv[1]
for si,s in enumerate(d['situations']):
    if mode=='sent':
        print(f"\n=== S{si} {s['title']}")
    for j,x in enumerate(s.get('sentences',[])):
        if mode=='sent':
            dk=x.get('distractorsKo',[])
            print(f"[{si}-{j}] EN: {x['en']}\n  KO: {x['ko']}\n  O1: {dk[0]}\n  O2: {dk[1]}\n  len {len(x['ko'])}/{len(dk[0])}/{len(dk[1])}  tag={x.get('tag')} icon={x.get('icon')}\n  WHY: {x.get('why')}")
        elif mode=='blank':
            b=x['blank'];en=x['en'];a=b['answer']
            i=en.find(a)  # word boundary assumed
            import re
            m=re.search(r'\b'+re.escape(a)+r'\b',en)
            pre,post=en[:m.start()],en[m.end():]
            print(f"[{si}-{j}] ans={a}")
            for o in b['options']:
                mark='*' if o['en']==a else ' '
                print(f"   {mark} {pre}[{o['en']}]{post}")
        elif mode=='decoy':
            ch=x['chunks'];dc=x['decoy']
            print(f"[{si}-{j}] decoy='{dc}'  chunks: {' / '.join(ch)}")
            for k in range(len(ch)):
                if ch[k] in '.?!,': continue
                c=ch[:k]+[dc]+ch[k+1:]
                print("     ~ "+' '.join(c))
    if mode=='order':
        o=s['order'];L=o['lines']
        print(f"\n=== S{si} {s['title']} | ko={o['ko']} | why={o['why']}")
        for k,l in enumerate(L): print(f"   {k+1}. {l['en']}  ({l.get('ko')}/{l.get('note')}/{l.get('icon')})")
        for k in range(3):
            M=L[:];M[k],M[k+1]=M[k+1],M[k]
            print(f"   swap{k+1}{k+2}: "+' | '.join(m['en'] for m in M))
