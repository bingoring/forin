import yaml,re
d=yaml.safe_load(open('or-preop-verification.yaml'))
L=lambda s: len(s.replace(' ',''))
def ok(a,b): a,b=L(a),L(b); return abs(a-b)<=3 or max(a,b)<=1.25*min(a,b)
print('== length violations')
for w in d['words']:
    for x in w['distractorsEn']:
        if not ok(w['en'],x): print('EN',w['id'],w['en'],x)
    for x in w['distractorsKo']:
        if not ok(w['ko'],x): print('KO',w['id'],w['ko'],x)
print('== cue contains ko word / en stem')
for w in d['words']:
    stem=w['en'].lower()[:4]
    if stem in w['cue'].lower(): print('EN-in-cue',w['id'],w['cue'])
    k=re.sub(r'[\(\)~]','',w['ko']).split()[0][:2]
    if k in w['cue']: print('KO-in-cue',w['id'],w['ko'],'|',w['cue'])
print('== decoyChips all')
print(sorted(set(c for w in d['words'] for c in w['decoyChips'])))
print('== chips multi-piece words (decoys shown)')
for w in d['words']:
    n=sum(len(x) for x in w['chips'])
    if n>1: print(w['id'],w['chips'],w['decoyChips'])
print('== slider')
for s in d['situations']:
    for n in s['nuance']:
        if n['kind']=='slider': print(n['answerAt'],[L(x) for x in n['scale']],n['scale'])
print('== pair combos')
for s in d['situations']:
    for n in s['nuance']:
        if n['kind']=='pair':
            rights=[p[1] for p in n['pairs']]+n['decoys']
            for p in n['pairs']:
                print('  ',' | '.join(f"{p[0]} {r}"+('  <OK>' if r==p[1] else '') for r in rights))
print('== swap')
for s in d['situations']:
    for n in s['nuance']:
        if n['kind']=='swap':
            for o in n['options']: print(('*' if o==n['answer'] else ' '),n['before'][0]+o+n['before'][2])
