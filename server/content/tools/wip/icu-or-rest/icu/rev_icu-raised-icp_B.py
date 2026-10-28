import yaml,sys,re
d=yaml.safe_load(open('icu-raised-icp.yaml'))
for i,s in enumerate(d['situations']):
    print(f"\n## {i} {s['title']}")
    for j,t in enumerate(s['sentences']):
        print(f"\n{i}.{j} [{t.get('tag')}/{t.get('icon')}] {t['en']}")
        print(f"   KO: {t['ko']}  ({len(t['ko'])})")
        for k,x in enumerate(t['distractorsKo']): print(f"   X{k+1}: {x}  ({len(x)})")
        print(f"   why: {t['why']}")
        b=t['blank'];en=t['en'];a=b['answer']
        m=re.search(r'(?<![A-Za-z])'+re.escape(a)+r'(?![A-Za-z])',en)
        pre,post=en[:m.start()],en[m.end():]
        for o in b['options']:
            mark='*' if o['en']==a else ' '
            print(f"   B{mark} {pre}[{o['en']}]{post}")
        ch=t['chunks'];dc=t['decoy']
        print(f"   chunks: {' / '.join(ch)}   decoy: <{dc}>")
        for k in range(len(ch)):
            if ch[k] in '.?!,': continue
            print(f"     D{k}: {' '.join(ch[:k]+['<'+dc+'>']+ch[k+1:])}")
    o=s['order']
    print(f"\n  ORDER ko={o['ko']} | why={o['why']}")
    L=o['lines']
    for k,l in enumerate(L): print(f"   L{k+1} [{l.get('note')}] {l['en']} ({len(l['en'].split())}w) | {l.get('ko')}")
    for k in range(3):
        sw=L[:];sw[k],sw[k+1]=sw[k+1],sw[k]
        print(f"   SW{k+1}<->{k+2}: "+' || '.join(x['en'] for x in sw))
