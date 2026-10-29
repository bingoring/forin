import yaml,re,sys
d=yaml.safe_load(open("icu-gi-bleed.yaml",encoding="utf-8"))
L=lambda t:len(re.sub(r"\s","",t))
part=sys.argv[1] if len(sys.argv)>1 else "all"
for i,s in enumerate(d["situations"]):
    print(f"\n######## S{i} {s['title']}")
    for j,x in enumerate(s["sentences"]):
        b=x.get("blank",{})
        print(f"--- {i}.{j} [{x.get('tag')}|{x.get('icon')}] {x['en']}")
        print(f"   ko[{L(x['ko'])}] {x['ko']}")
        for k in x['distractorsKo']: print(f"   x[{L(k)}] {k}")
        print(f"   why: {x.get('why')}")
        if part!="short":
            ans=b['answer']; en=x['en']
            m=re.search(r'(?<![A-Za-z])'+re.escape(ans)+r'(?![A-Za-z])',en)
            pre,post=en[:m.start()],en[m.end():]
            for o in b['options']:
                mark='*' if o['en']==ans else ' '
                print(f"   B{mark} {pre}[{o['en']}]{post}")
            ch=x['chunks']; dc=x['decoy']
            print(f"   chunks: {' / '.join(ch)}   decoy: <{dc}>")
            for p in range(len(ch)):
                if ch[p] in '.,?!': continue
                print(f"     D{p}: "+' '.join(ch[:p]+['<'+dc+'>']+ch[p+1:]))
    o=s.get('order')
    if o:
        print(f"  ORDER ko={o['ko']} | tag={o.get('tag')} | why={o['why']}")
        ls=o['lines']
        for l in ls: print(f"    - {l['en']}  ({l.get('ko')} / {l.get('note')} / {l.get('icon')})")
        for a in range(3):
            t=ls[:]; t[a],t[a+1]=t[a+1],t[a]
            print(f"    swap{a+1}{a+2}: "+' || '.join(l['en'] for l in t))
