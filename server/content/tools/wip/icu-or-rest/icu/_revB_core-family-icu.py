import yaml,re,collections,sys
d=yaml.safe_load(open('core-family-icu.yaml',encoding='utf-8'))
def stems(t): return {x[:2] if len(x)>=2 else x for x in re.findall(r'[가-힣]+',t or '')}
mode=sys.argv[1]
S=d['situations']
if mode=='sent':
  for i,s in enumerate(S):
    print(f"\n## {i} {s['title']}")
    for j,t in enumerate(s['sentences']):
      L=len(t['ko'])
      print(f"{i}.{j} [{t['tag']}|{t['icon']}] {t['en']}\n   KO({L}) {t['ko']}")
      for k in t['distractorsKo']:
        print(f"   x({len(k)}) {k}")
      b=t['blank']; a=b['answer']
      print(f"   why: {t['why']}")
      for o in b['options']:
        mark='*' if o['en']==a else ' '
        rep=re.sub(r'\b'+re.escape(a)+r'\b',lambda m:'['+o['en']+']',t['en'],count=1)
        print(f"   {mark}B {rep}")
      ch=t['chunks']; dc=t['decoy']
      print(f"   chunks: {' / '.join(ch)}   DECOY: {dc}")
      for k,c in enumerate(ch):
        if c.strip() in '.,?!': continue
        print(f"     ~{k}: {' '.join(ch[:k]+[dc]+ch[k+1:])}")
elif mode=='order':
  for i,s in enumerate(S):
    o=s['order']; L=o['lines']
    print(f"\n## {i} {s['title']} | {o.get('tag')}|{o.get('icon')} | {o['ko']}\n   why: {o['why']}")
    for k,l in enumerate(L): print(f"   {k+1}. [{l.get('note')}|{l['icon']}] {l['en']}  // {l.get('ko')}")
    for a in range(3):
      x=list(L); x[a],x[a+1]=x[a+1],x[a]
      print(f"   swap{a+1}<->{a+2}: "+' | '.join(l['en'] for l in x))
elif mode=='stats':
  ko=collections.Counter(); loc=collections.defaultdict(list)
  cond=[];dshape=collections.Counter();dword=collections.Counter();bw=collections.Counter()
  marker=re.compile(r'(면|려고|도록|위해|기 전에|후에|뒤에|다면|으면)')
  for i,s in enumerate(S):
    for j,t in enumerate(s['sentences']):
      mine=stems(t['ko'])
      for dk in t['distractorsKo']:
        for st in stems(dk)-mine: ko[st]+=1; loc[st].append(f"{i}.{j}")
      # condition/purpose markers present in both distractors but not in ko
      pat=re.compile(r'(려고|하려|도록|위해|기 전에|[가-힣]면[ ,]|면서|다면|으면|후에|뒤에)')
      kh=bool(pat.search(t['ko'])); dh=[bool(pat.search(x)) for x in t['distractorsKo']]
      if all(dh) and not kh: cond.append(f"{i}.{j}")
      dc=t['decoy'].lower(); first=dc.split()[0]
      dshape[first]+=1
      for w in re.findall(r"[a-z']+",dc): dword[w]+=1
      for o in t['blank']['options']:
        if o['en']!=t['blank']['answer']: bw[o['en'].lower()]+=1
  print('KO-only stems >=4:'); [print(' ',k,v,loc[k]) for k,v in ko.most_common() if v>=4]
  print('cond/purpose only in both distractors:',len(cond),cond)
  print('decoy first word:',dshape.most_common(15))
  stop=set("the a an to of and your you i in for my".split())
  print('decoy words:',[(k,v) for k,v in dword.most_common(40) if v>=3])
  print('decoy words incl stop:',dword.most_common(15))
  print('blank wrong >=2:',[(k,v) for k,v in bw.most_common() if v>=2])
