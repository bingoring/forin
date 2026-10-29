import yaml,re,sys,collections,json
d=yaml.safe_load(open('icu-liver-failure.yaml'))
mode=sys.argv[1]
S=d['situations']
if mode=='sent':
  for i,s in enumerate(S):
    print(f'## {i} {s["title"]}')
    for j,t in enumerate(s['sentences']):
      en=t['en'];b=t['blank'];a=b['answer']
      print(f'{i}.{j} [{t["tag"]}|{t["icon"]}] {en}')
      print(f'   KO: {t["ko"]}')
      for k,x in enumerate(t['distractorsKo']): print(f'   X{k+1}: {x}  ({len(x)}/{len(t["ko"])})')
      m=re.search(r'\b'+re.escape(a)+r'\b',en)
      for o in b['options']:
        mk='*' if o['en']==a else ' '
        print(f'   B{mk} {en[:m.start()]}[{o["en"]}]{en[m.end():]}')
      print(f'   chunks: {" / ".join(t["chunks"])}   decoy: {t["decoy"]}')
      ch=t['chunks']
      for k in range(len(ch)):
        if ch[k] in '.?!,': continue
        print(f'   D{k}: '+' '.join(ch[:k]+['<'+t['decoy']+'>']+ch[k+1:]))
      print(f'   why: {t["why"]}')
if mode=='order':
  for i,s in enumerate(S):
    o=s['order'];L=o['lines']
    print(f'## {i} {s["title"]} | {o["ko"]} | {o.get("tag")} {o.get("icon")}')
    print('   why:',o['why'])
    for k,l in enumerate(L): print(f'   {k+1}. {l["en"]} | {l.get("ko")} | {l.get("note")} {l["icon"]}')
    for k in range(3):
      p=list(range(4));p[k],p[k+1]=p[k+1],p[k]
      print(f'   swap{k+1}{k+2}: '+'  //  '.join(L[x]['en'] for x in p))
if mode=='rep':
  cnt=collections.Counter();where=collections.defaultdict(list)
  strip=r'(은|는|이|가|을|를|에|에서|에게|께|와|과|도|로|으로|의|만|까지|부터|요|이에요|예요|해요)$'
  for i,s in enumerate(S):
    for j,t in enumerate(s['sentences']):
      kow=set(re.sub(strip,'',w) for w in re.findall(r'[가-힣A-Za-z0-9]+',t['ko']))
      kowraw=set(re.findall(r'[가-힣A-Za-z0-9]+',t['ko']))
      for x in t['distractorsKo']:
        for w in set(re.findall(r'[가-힣A-Za-z0-9]+',x)):
          if w in kowraw: continue
          st=re.sub(strip,'',w)
          if st in kow: continue
          stem=st[:2] if len(st)>=2 else st
          cnt[stem]+=1;where[stem].append(f'{i}.{j}:{w}')
  for w,c in cnt.most_common():
    if c>=4: print(c,w,where[w])
