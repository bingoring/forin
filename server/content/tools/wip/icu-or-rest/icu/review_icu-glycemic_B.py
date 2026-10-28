import yaml,re,sys
d=yaml.safe_load(open('icu-glycemic.yaml'))
out=[]
n=0
for si,s in enumerate(d['situations']):
    out.append(f"\n######## S{si} {s['title']}")
    for j,x in enumerate(s['sentences']):
        n+=1
        en=x['en'];ko=x['ko']
        out.append(f"\n[{si}.{j}] tag={x.get('tag')} icon={x.get('icon')}\n EN: {en}\n KO: {ko} ({len(ko)})")
        for k,dk in enumerate(x.get('distractorsKo',[])):
            out.append(f" X{k+1}: {dk} ({len(dk)}, {len(dk)/len(ko):.2f})")
        out.append(f" WHY: {x.get('why')}")
        b=x['blank'];a=b['answer']
        i=re.search(r'\b'+re.escape(a)+r'\b',en).start()
        for o in b['options']:
            mark='*' if o['en']==a else ' '
            out.append(f" B{mark} {en[:i]}[{o['en']}]{en[i+len(a):]}")
        dc=x['decoy'];ch=x['chunks']
        out.append(f" CH: {' / '.join(ch)}  || DECOY: {dc}")
        for c in range(len(ch)):
            if ch[c] in '.?!,': continue
            out.append(f"   D{c}: {' '.join(ch[:c]+['<'+dc+'>']+ch[c+1:])}")
    o=s['order']
    out.append(f"\n ORDER ko={o['ko']} | why={o['why']}")
    L=o['lines']
    for i,l in enumerate(L): out.append(f"  L{i+1} [{l.get('note')}] {l['en']} ({len(l['en'].split())}w) / {l.get('ko')} icon={l['icon']}")
    for i in range(3):
        p=[l['en'] for l in L]; p[i],p[i+1]=p[i+1],p[i]
        out.append(f"  SWAP{i+1}{i+2}: "+' | '.join(p))
print(n)
open('dump-icu-glycemic-B.txt','w').write('\n'.join(out))
