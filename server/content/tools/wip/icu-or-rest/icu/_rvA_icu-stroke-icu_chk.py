import yaml,re
d=yaml.safe_load(open('icu-stroke-icu.yaml'))
L=lambda s: len(s.replace(' ',''))
def ok(a,b): return (max(L(a),L(b))<=1.25*min(L(a),L(b))) or abs(L(a)-L(b))<=3
for w in d['words']:
  for x in w['distractorsKo']:
    if not ok(w['ko'],x): print('KOLEN',w['id'],w['ko'],x)
  for x in w['distractorsEn']:
    if not ok(w['en'],x): print('ENLEN',w['id'],w['en'],x)
  c=w['cue'].lower(); e=w['en'].lower()
  if re.search(r'[a-z]',c): print('CUE-EN',w['id'],w['en'],'|',w['cue'])
  stem=e[:max(4,len(e)-3)]
  if stem in c: print('CUE-STEM',w['id'])
for i,s in enumerate(d['situations']):
  for n in s['nuance']:
    if n['kind']=='context':
      sc=n['scenes']; bad=[x for x in sc if not x['ok']]
      miss=[x['en'] for x in sc if n['word'].lower() not in x['en'].lower()]
      print('CTX',i,n['word'],n.get('ko'),len(sc),len(bad),'MISS' if miss else '',[x['who'] for x in sc])
