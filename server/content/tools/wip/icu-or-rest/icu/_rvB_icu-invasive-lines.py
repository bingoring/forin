import yaml,sys,re
d=yaml.safe_load(open('icu-invasive-lines.yaml'))
mode=sys.argv[1]
for si,s in enumerate(d['situations']):
    print(f"\n=== S{si} {s['title']}")
    for j,x in enumerate(s['sentences']):
        sid=f"{si}-{j}"
        if mode=='sent':
            print(f"[{sid}] {x['en']}\n   ko: {x['ko']}\n   X1: {x['distractorsKo'][0]}\n   X2: {x['distractorsKo'][1]}\n   tag={x.get('tag')} icon={x.get('icon')} why: {x.get('why')}")
        elif mode=='blank':
            b=x['blank']; en=x['en']; a=b['answer']
            m=re.search(r'\b'+re.escape(a)+r'\b',en)
            print(f"[{sid}] ans={a}")
            for o in b['options']:
                mk='*' if o['en']==a else ' '
                print(f"  {mk} {en[:m.start()]}[{o['en']}]{en[m.end():]}")
        elif mode=='decoy':
            ch=x['chunks']; dc=x['decoy']
            print(f"[{sid}] {' / '.join(ch)}   || decoy={dc}")
            for k,c in enumerate(ch):
                if c in '.,?!': continue
                print("     "+" ".join(ch[:k]+['<'+dc+'>']+ch[k+1:]))
    if mode=='order':
        o=s['order']; L=o['lines']
        print(f" ko: {o['ko']} | why: {o['why']} | tag={o.get('tag')} icon={o.get('icon')}")
        for l in L: print(f"   - {l['en']}  ({l.get('ko')}/{l.get('note')}/{l['icon']})")
        for k in range(3):
            M=L[:]; M[k],M[k+1]=M[k+1],M[k]
            print(f"  swap{k+1}<->{k+2}: "+" | ".join(l['en'] for l in M))
