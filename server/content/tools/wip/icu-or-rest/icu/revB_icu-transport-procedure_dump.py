import yaml,sys,re,collections
f=sys.argv[1] if len(sys.argv)>1 else 'icu-transport-procedure.yaml'
d=yaml.safe_load(open(f))
out=open('revB_icu-transport-procedure_full.txt','w')
def P(*a): print(*a,file=out)
for si,s in enumerate(d['situations']):
  P(f"\n######## S{si} {s['title']}")
  for j,x in enumerate(s['sentences']):
    P(f"\n[{si}.{j}] {x['en']}\n  ko: {x['ko']}\n  X1: {x['distractorsKo'][0]}\n  X2: {x['distractorsKo'][1]}")
    P(f"  len ko/X1/X2: {len(x['ko'])}/{len(x['distractorsKo'][0])}/{len(x['distractorsKo'][1])}  tag={x['tag']} icon={x['icon']} goal={x['goal']}")
    P(f"  why: {x['why']}")
    en=x['en']; a=x['blank']['answer']
    m=re.search(r'\b'+re.escape(a)+r'\b',en)
    for o in x['blank']['options']:
      mark='*' if o['en']==a else ' '
      P(f"  B{mark} {en[:m.start()]}[{o['en']}]{en[m.end():]}")
    ch=x['chunks']; P(f"  chunks: {' / '.join(ch)}   decoy: <{x['decoy']}>")
    for k in range(len(ch)):
      if re.fullmatch(r'[.,?!]+',ch[k]): continue
      c=ch[:k]+['<'+x['decoy']+'>']+ch[k+1:]
      P(f"   D{k}: {' '.join(c)}")
  o=s['order']
  P(f"\n  ORDER ko={o['ko']} tag={o.get('tag')} icon={o.get('icon')}\n  why: {o['why']}")
  L=o['lines']
  for k,l in enumerate(L): P(f"   L{k+1}: {l['en']} | {l.get('ko')} | {l.get('note')} | {l['icon']}")
  for k in range(3):
    M=L[:]; M[k],M[k+1]=M[k+1],M[k]
    P(f"   swap{k+1}<->{k+2}: "+'  //  '.join(m['en'] for m in M))
