import yaml, json, re, collections
d=yaml.safe_load(open('core-safety-icu.yaml'))
inj=json.load(open('in-core-safety-icu.json'))
KP={k for s in inj['situations'] for k in s['keyPhrases']}
W=d['words']
L=lambda s: len(s.replace(' ',''))
def bad(a,b):
    x,y=L(a),L(b); return not (max(x,y)<=1.25*min(x,y) or abs(x-y)<=3)
print('== length')
for w in W:
    for e in w['distractorsEn']:
        if bad(w['en'],e): print(' En',w['id'],w['en'],e)
    for k in w['distractorsKo']:
        if bad(w['ko'],k): print(' Ko',w['id'],w['ko'],k)
print('== cue contains answer/stem')
for w in W:
    stem=w['en'].lower()[:max(4,len(w['en'])-3)]
    if w['en'].lower() in w['cue'].lower() or (len(stem)>=4 and stem in w['cue'].lower()): print(' ',w['id'],w['cue'])
    if w['ko'] in w['cue']: print(' ko-in-cue',w['id'],w['ko'],'|',w['cue'])
print('== alt path')
for w in W:
    pieces=set(p for wd in w['chips'] for p in wd)|set(w['decoyChips']); dec=set(w['decoyChips'])
    for wd in w['en'].split(' '):
        res=[]
        def rec(s,used):
            if not s: res.append(used); return
            for p in pieces:
                if s.startswith(p): rec(s[len(p):],used|({p} if p in dec else set()))
        rec(wd,set())
        if any(res): print(' ',w['id'],wd,[u for u in res if u])
print('== decoyChips shown (multi-chip words)')
for w in W:
    n=sum(len(c) for c in w['chips'])
    if n>1: print(' ',w['id'],w['chips'],w['decoyChips'])
print('== chunk ends')
FN=set('a an the of to for with in on at by from and or his her your my our their this that if so when what can will would is are be'.split())
for i,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        for c in x['chunks'][:-1]:
            last=c.split()[-1].lower().strip(',—') if c.split() else ''
            if last in FN: print(f"  {i}.{j} {'KP' if x['en'] in KP else '  '} [{c}] :: {' / '.join(x['chunks'])}")
print('== exKo vs sentence ko')
sk={x['en']:x['ko'] for s in d['situations'] for x in s['sentences']}
for w in W:
    if w['example'] in sk and sk[w['example']]!=w['exKo']: pass
print('== sentence en->words containing? headword in en')
for i,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        for wid in x['words']:
            w=next(y for y in W if y['id']==wid)
            if w['en'].lower() not in x['en'].lower(): print(f"  {i}.{j} {wid} '{w['en']}' :: {x['en']}")
