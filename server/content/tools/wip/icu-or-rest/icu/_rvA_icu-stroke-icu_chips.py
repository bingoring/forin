import yaml
d=yaml.safe_load(open('icu-stroke-icu.yaml'))
bad={'sin','vice','lie','fat','nut','pot','joint','gross','rat','wreck','harm','hurt','raid','lard','lye','sue','dis','bane','rune','tar','cola','gin','rum','ale','beer','wine','tomb','die','kill','dead','bra','ass','hell','damn','spy','mare','jury','dope','cheat','hen'}
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
  hit=[c for c in w['decoyChips'] if c.lower() in bad]
  if hit: print('BAD',w['id'],w['en'],w['decoyChips'])
