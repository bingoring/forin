import yaml,re
d=yaml.safe_load(open('or-massive-transfusion.yaml'))
L=lambda s: len(s.replace(' ',''))
def ok(a,b):
    x,y=L(a),L(b); return abs(x-y)<=3 or max(x,y)<=1.25*min(x,y)
print('== length')
for w in d['words']:
    for k,base in (('distractorsEn','en'),('distractorsKo','ko')):
        for o in w[k]:
            if not ok(w[base],o): print(w['id'],k,w[base],o)
print('== cue contains en / stem')
for w in d['words']:
    en=w['en'].lower(); stem=en[:max(3,len(en)-3)]
    if stem in w['cue'].lower(): print(w['id'],w['cue'])
    if w['ko'] in w['cue']: print('ko-repeat',w['id'],w['ko'],'|',w['cue'])
print('== tags')
from collections import Counter; print(Counter(w['tag'] for w in d['words']))
print('== context word presence')
for i,s in enumerate(d['situations']):
    sw=set(x for t in s['sentences'] for x in t['words'])
    for n in s['nuance']:
        for wid in n['words']:
            if wid not in sw: print('nuance word not in sit',i,n['kind'],wid)
        if n['kind']=='context':
            for sc in n['scenes']:
                if n['word'].lower() not in sc['en'].lower(): print('ctx miss',i,n['word'],'|',sc['en'])
        if n['kind']=='swap':
            for o in n['options']: print('swap',i,repr(n['before'][0]+o+n['before'][2]))
        if n['kind']=='pair':
            L_=[p[0] for p in n['pairs']]; R=[p[1] for p in n['pairs']]+n['decoys']
            for l in L_:
                for r in R: print('pair',i,l,'+',r)
print('== words per situation')
for i,s in enumerate(d['situations']):
    print(i,len(set(x for t in s['sentences'] for x in t['words'])),end='; ')
