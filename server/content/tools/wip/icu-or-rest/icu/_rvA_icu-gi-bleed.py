import yaml,json,sys
d=yaml.safe_load(open('icu-gi-bleed.yaml'))
inj=json.load(open('in-icu-gi-bleed.json'))
kp={s['title']:set(s['keyPhrases']) for s in inj['situations']}
mode=sys.argv[1]
def L(x): return len(x.replace(' ',''))
if mode=='words':
  for w in d['words']:
    a=w['en']; flag=[]
    for x in w['distractorsEn']:
      if not (L(x)<=L(a)*1.25 and L(a)<=L(x)*1.25 or abs(L(x)-L(a))<=3): flag.append('LEN:'+x)
    print(f"{w['id']}|{a}|{w['ko']}|{w['tag']}|cue={w['cue']}|dEn={w['distractorsEn']}|dKo={w['distractorsKo']}|chips={w['chips']}|dec={w['decoyChips']} {flag}")
elif mode=='sent':
  for i,s in enumerate(d['situations']):
    print('=== ',i,s['title'])
    for j,t in enumerate(s['sentences']):
      k='KP' if t['en'] in kp[s['title']] else '  '
      print(f"{i}.{j} {k} {t['en']} | {t['ko']}\n      [{' / '.join(t['chunks'])}] {t['words']}")
elif mode=='nu':
  for i,s in enumerate(d['situations']):
    print('=== ',i,s['title'])
    for n in s['nuance']:
      print(yaml.safe_dump(n,allow_unicode=True,sort_keys=False,width=200))
      if n['kind']=='pair':
        rights=[p[1] for p in n['pairs']]+n['decoys']
        for p in n['pairs']:
          print('   COMBOS:', ' | '.join(f"{p[0]} {r}{'*' if r==p[1] else ''}" for r in rights))
      if n['kind']=='swap':
        b=n['before']
        for o in n['options']: print('   SWAP:',b[0]+o+b[2])
elif mode=='ex':
  for w in d['words']:
    print(f"{w['id']}|{w['en']}|{w['ko']}|{w['example']}|{w['exKo']}")
