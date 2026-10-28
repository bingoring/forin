import yaml
d=yaml.safe_load(open('icu-stroke-icu.yaml'))
bad=set('sin vice lie lye fat nut pot joint gross rat wreck harm hurt raid lard sue dis bane tar cola gin rum ale beer wine keg pint nip bar pub booze drunk tomb grave coffin corpse dead die dye kill murder war warfare sex nude strip porn bust butt breast nipple kiss lust hump dump poo pee piss crap turd wee hoe cock dick tit gay slut damn hell spy dope cheat mule moan gag mourn urn hearse sir troll victim deride intimate intimately pleasure sorcery breed blush crush scar pit germ rage anger angel politician posh pall weep wail scare stoke spite stray sullen sodden insult punish scandal libel hostile disaster jest jar cue mud ruse wreak sly'.split())
for w in d['words']:
  for f in ('distractorsEn','decoyChips'):
    for x in w[f]:
      for tok in str(x).lower().split():
        if tok in bad: print(w['id'],w['en'],f,x)
  for wd in w['chips']:
    for c in wd:
      if c.lower() in bad: print('CHIP',w['id'],c)
for i,s in enumerate(d['situations']):
  for j,t in enumerate(s['sentences']):
    dc=t.get('decoy')
    if dc and any(tok in bad for tok in dc.lower().split()): print('SDECOY',i,j,dc)
