import yaml,sys,re
f=sys.argv[1] if len(sys.argv)>1 else 'core-safety-or.yaml'
out=sys.argv[2] if len(sys.argv)>2 else '_reviewB_core-safety-or_table.txt'
d=yaml.safe_load(open(f))
canon=[x for x in yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/nurse/topics/or.yaml')) if x.get('theme')=='core-safety-or']
cmap={c['title']:c for c in canon}
L=[]
def ln(n): return len(re.sub(r'\s','',n))
for si,s in enumerate(d['situations']):
    c=cmap.get(s['title'],{})
    p=c.get('persona',{})
    L.append(f"\n######## S{si} {s['title']} | role={c.get('role')} persona={p.get('name')}/{p.get('sub')}/{p.get('mood')} acuity={c.get('acuity')}")
    L.append(f"   tagline: {c.get('tagline')} | brief: {c.get('brief')}")
    for j,x in enumerate(s['sentences']):
        ko=x['ko']; dk=x['distractorsKo']
        L.append(f"[{si}.{j}] {x['en']}  || {ko} ({ln(ko)})  tag={x['tag']} icon={x['icon']}")
        L.append(f"     D1: {dk[0]} ({ln(dk[0])})")
        L.append(f"     D2: {dk[1]} ({ln(dk[1])})")
        L.append(f"     why: {x['why']}")
        b=x['blank']; a=b['answer']
        m=re.search(r'(?<![A-Za-z])'+re.escape(a)+r'(?![A-Za-z])',x['en'])
        pre,post=x['en'][:m.start()],x['en'][m.end():]
        for o in b['options']:
            mk='*' if o['en']==a else ' '
            L.append(f"     B{mk} {pre}[{o['en']}]{post}")
        ch=x['chunks']
        L.append(f"     chunks: {' / '.join(ch)}   decoy=<{x['decoy']}>")
        for k in range(len(ch)):
            if ch[k] in '.?!,': continue
            t=ch[:k]+[x['decoy'].upper()]+ch[k+1:]
            L.append(f"       ~{k}: {' '.join(t)}")
    o=s['order']
    L.append(f"  ORDER ko={o['ko']} | why={o['why']}")
    ls=o['lines']
    for i,l in enumerate(ls): L.append(f"    {i+1}. {l['en']}  ({l.get('ko')}/{l.get('note')}/{l['icon']})")
    for i in range(3):
        t=list(ls); t[i],t[i+1]=t[i+1],t[i]
        L.append(f"    swap{i+1}{i+2}: " + ' | '.join(l['en'] for l in t))
open(out,'w').write('\n'.join(L))
print(len(L))
