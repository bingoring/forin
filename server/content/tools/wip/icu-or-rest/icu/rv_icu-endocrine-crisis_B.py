import yaml,sys
d=yaml.safe_load(open('icu-endocrine-crisis.yaml'))
for si,s in enumerate(d['situations']):
    print(f"\n######## S{si} {s['title']}")
    for i,x in enumerate(s['sentences']):
        print(f"--- {si}.{i} [{x.get('tag')}|{x.get('icon')}] words={x.get('words')}")
        print(f"EN: {x['en']}\nKO: {x['ko']} ({len(x['ko'])})")
        for k,dk in enumerate(x.get('distractorsKo',[])):
            print(f"X{k+1}: {dk} ({len(dk)})")
        print(f"WHY: {x.get('why')}")
        b=x.get('blank')
        if b:
            a=b['answer']; en=x['en']; p=en.find(a)
            # word boundary find
            import re
            m=re.search(r'(?<!\w)'+re.escape(a)+r'(?!\w)',en)
            bef,aft=en[:m.start()],en[m.end():]
            for o in b['options']:
                mark='*' if o['en']==a else ' '
                print(f" B{mark} {bef}[{o['en']}]{aft}")
        ch=x['chunks']; dec=x.get('decoy')
        print(f"CH: {ch} | DECOY: {dec}")
        for j in range(len(ch)):
            if ch[j] in '.?!,': continue
            c=ch[:j]+[f'<{dec}>']+ch[j+1:]
            print("  D:", ' '.join(c))
    o=s.get('order')
    if o:
        print(f"== ORDER ko={o.get('ko')} | tag={o.get('tag')} icon={o.get('icon')}\n   why={o.get('why')}")
        L=o['lines']
        for l in L: print(f"   - {l['en']} ({len(l['en'].split())}w) | {l.get('ko')} | {l.get('note')} | {l.get('icon')}")
        for a in range(3):
            M=L[:]; M[a],M[a+1]=M[a+1],M[a]
            print(f"   SWAP {a+1}<->{a+2}: "+' / '.join(l['en'] for l in M))
