import yaml,re,json
d=yaml.safe_load(open('icu-invasive-lines.yaml'))
bad={'sin','vice','lie','fat','nut','pot','joint','gross','rat','wreck','harm','hurt','raid','lard','lye','sue','dis','bane','rune','tar','cola','gin','rum','ale','beer','wine','tomb','die','kill','dead','death','bra','ass','hell','damn','spy','mare','jury','dope','cheat','hen','tart','moan','cult','flesh','crab','stud','cuss','rye','pall','pint','intimate','toll','worm','grave','coffin','sex','lust','nude','booze','drunk','weed','crack','pimp','slut','hump','cock','dick','tit','bust','strip','lick','rotic','poop','pee','fart','gun','shot','bomb','bury','burier','mourn','hearse','urn','ash','dust','corpse','funeral','casket','drug','grub','rag','scum','sick','dump','gin','cider','vodka','lass','boss','kneed','tease','sting','burn','choke','gasp','blade','flame','rip','rabid','crash','groan','ouch','itch','pimp','pore','hemp'}
for w in d['words']:
  pool=[c for wd in w['chips'] for c in wd]+list(w['decoyChips'])
  target=w['en'].replace(' ','')
  official=tuple(c for wd in w['chips'] for c in wd)
  sols=[]
  def rec(rest,used,path):
    if not rest: sols.append(tuple(path));return
    for i,c in enumerate(pool):
      if i in used or not c: continue
      if rest.startswith(c): rec(rest[len(c):],used|{i},path+[c])
  rec(target,frozenset(),[])
  alt=[s for s in set(sols) if s!=official]
  if alt: print('ALT',w['id'],official,alt)
  hit=[c for c in w['decoyChips']+w['distractorsEn'] if c.lower().strip('-') in bad]
  if hit: print('BAD',w['id'],w['en'],w['decoyChips'],w['distractorsEn'])
  if len(set(w['decoyChips']))<len(w['decoyChips']): print('DUPDECOY',w['id'],w['decoyChips'])
  c=w['cue']
  if re.search(r'[A-Za-z]',c): print('CUE-EN',w['id'],w['en'],'|',c)
  if w['ko'] in c: print('CUE-KO',w['id'],w['ko'],'|',c)
  for x in w['distractorsKo']:
    if x in c: print('CUE-DKO',w['id'],x,'|',c)
# sentence usage
kp=json.load(open('in-icu-invasive-lines.json'))
use={}
for i,s in enumerate(d['situations']):
  ids=set()
  for t in s['sentences']:
    for x in t['words']: use.setdefault(x,[]).append(i); ids.add(x)
  print('SIT',i,len(ids))
for w in d['words']:
  if w['id'] not in use: print('UNUSED',w['id'])
for i,s in enumerate(d['situations']):
  for n in s['nuance']:
    if n['kind']=='context':
      sc=n['scenes']; bad_=[x for x in sc if not x['ok']]
      miss=[x['en'] for x in sc if n['word'].lower() not in x['en'].lower()]
      print('CTX',i,n['word'],n.get('ko'),len(sc),len(bad_),'MISS' if miss else '',[(x['who'],x['ok']) for x in sc])
