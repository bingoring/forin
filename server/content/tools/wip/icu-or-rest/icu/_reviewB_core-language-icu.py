import yaml,sys,re,collections
d=yaml.safe_load(open('core-language-icu.yaml'))
mode=sys.argv[1]
for si,s in enumerate(d['situations']):
  if mode in('ko','all'): print(f"\n=== [{si}] {s['title']}")
  for k,t in enumerate(s['sentences']):
    if mode=='ko':
      print(f"s{k} EN: {t['en']}\n   KO: {t['ko']}\n   X1: {t['distractorsKo'][0]}\n   X2: {t['distractorsKo'][1]}\n   tag={t.get('tag')} icon={t.get('icon')}\n   why: {t.get('why')}")
    if mode=='blank':
      b=t['blank'];en=t['en']
      print(f"[{si}]s{k} ans={b['answer']}")
      for o in b['options']:
        m='*' if o['en']==b['answer'] else ' '
        print(f"  {m} "+re.sub(r'\b'+re.escape(b['answer'])+r'\b',o['en'].upper() if m==' ' else o['en'],en,count=1))
    if mode=='decoy':
      ch=t['chunks'];dc=t['decoy']
      print(f"[{si}]s{k} decoy=«{dc}» | "+' / '.join(ch))
      for i,c in enumerate(ch):
        if c in '.?!,': continue
        print('   '+' '.join(ch[:i]+['['+dc+']']+ch[i+1:]))
  if mode=='order':
    o=s['order'];L=o['lines']
    print(f"\n=== [{si}] {s['title']} | {o['ko']}\n  why: {o['why']}")
    for i,l in enumerate(L): print(f"  {i+1}. {l['en']}  ({l.get('ko')}/{l.get('note')}/{l['icon']})")
    for i in range(3):
      print(f"  swap {i+1}<->{i+2}: {L[i+1]['en']} || {L[i]['en']}")
