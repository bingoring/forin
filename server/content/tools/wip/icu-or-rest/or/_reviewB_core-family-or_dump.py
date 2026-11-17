import yaml,sys
f=sys.argv[1]; a,b=int(sys.argv[2]),int(sys.argv[3])
d=yaml.safe_load(open(f))
for si,s in enumerate(d['situations']):
  if not (a<=si<b): continue
  print(f"===== {si} {s['title']}")
  for j,x in enumerate(s['sentences']):
    kp='*' if x.get('keyPhrase') else ''
    print(f"--{si}.{j}{kp} EN: {x['en']}")
    print(f"   KO: {x['ko']} ({len(x['ko'])})")
    for dk in x['distractorsKo']: print(f"   DK: {dk} ({len(dk)})")
    print(f"   tag={x['tag']} icon={x['icon']} | why: {x['why']}")
    print(f"   chunks: {' / '.join(x['chunks'])}  || decoy: {x['decoy']}")
    bl=x['blank']; ans=bl['answer']; en=x['en']; i=en.find(ans)
    # word-boundary find
    import re
    m=re.search(r'(?<![A-Za-z])'+re.escape(ans)+r'(?![A-Za-z])',en)
    pre,post=en[:m.start()],en[m.end():]
    for o in bl['options']:
      mark='=' if o['en']==ans else ' '
      print(f"   {mark}B: {pre}[{o['en']}]{post}")
  o=s['order']
  print(f"  ORDER ko={o['ko']} tag={o.get('tag')} | why: {o['why']}")
  L=o['lines']
  for k,l in enumerate(L): print(f"   {k+1}. {l['en']}  ({l.get('ko')}/{l.get('note')}/{l['icon']})")
  for k in range(3):
    M=[l['en'] for l in L]; M[k],M[k+1]=M[k+1],M[k]
    print(f"   swap{k+1}{k+2}: "+' | '.join(M))
