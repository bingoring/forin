import yaml,json,sys,re
d=yaml.safe_load(open('icu-endocrine-crisis.yaml'))
base=yaml.safe_load(open('base-icu-endocrine-crisis.yaml'))
inj=json.load(open('in-icu-endocrine-crisis.json'))
mode=sys.argv[1]
W={w['id']:w for w in d['words']}
B={w['id']:w for w in base['words']}
def L(s): return len(s.replace(' ',''))
def lenok(a,b):
    a,b=L(a),L(b); return abs(a-b)<=3 or max(a,b)<=1.25*min(a,b)
# usage map
use={}
for s in d['situations']:
    for i,x in enumerate(s['sentences']):
        for w in x['words']: use.setdefault(w,[]).append((s['title'],i,x['en']))
if mode=='words':
    for w in d['words']:
        ch=' '.join(''.join(p) for p in w['chips'])
        flag=''
        for x in w['distractorsEn']+w['distractorsKo']:
            ref=w['en'] if x in w['distractorsEn'] else w['ko']
            if not lenok(ref,x): flag+=f' LEN({x})'
        chg='' if w['id'] in B and all(B[w['id']].get(k)==w.get(k) for k in ['en','ko']) else ' *CHG*'
        print(f"{w['id']}{chg} | {w['en']} | {w['ko']} | tag={w['tag']} | cue={w['cue']}")
        print(f"   dEn={w['distractorsEn']} dKo={w['distractorsKo']} chips={w['chips']} decoy={w['decoyChips']}{flag}")
        print(f"   ex={w['example']} / {w['exKo']}")
        for u in use.get(w['id'],[])[:3]: print(f"   USE[{u[0]}#{u[1]}] {u[2]}")
elif mode=='nuance':
    for si,s in enumerate(d['situations']):
        print(f"\n===== S{si} {s['title']} | {inj['situations'][si]['tagline']} | role={inj['situations'][si]['role']}")
        for i,x in enumerate(s['sentences']): print(f"  [{i}] {x['en']} | {x['ko']} | {x['words']}")
        for n in s['nuance']:
            k=n['kind']; print(f"  -- {k} words={n['words']}")
            if k=='slider':
                print(f"     cue={n['cue']}\n     scale={n['scale']} answerAt={n['answerAt']}\n     why={n['why']}\n     ex={n.get('example')} / {n.get('exKo')}")
            elif k=='pair':
                print(f"     pairs={n['pairs']} decoys={n['decoys']}\n     why={n['why']}")
                rights=[p[1] for p in n['pairs']]+n['decoys']
                for p in n['pairs']:
                    print('       '+p[0]+' :: '+' | '.join(('*' if r==p[1] else '')+r for r in rights))
            elif k=='context':
                print(f"     word={n.get('word')} ko={n.get('ko')}")
                for sc in n['scenes']: print(f"     [{sc['who']}/{sc['icon']}/{sc['ok']}] {sc['en']}"+(f"  FIX: {sc['fix']}" if 'fix' in sc else '')+('' if n.get('word','').lower() in sc['en'].lower() else '  !!NOWORD'))
                print(f"     why={n['why']}")
            elif k=='swap':
                print(f"     who={n['who']} before={n['before']} answer={n['answer']} ko={n.get('ko')}")
                for o in n['options']: print(f"       > {n['before'][0]}{o}{n['before'][2]}  || {n['notes'][o]}")
                print(f"     why={n['why']}")
            elif k=='reel':
                print(f"     word={n['word']} feels={n['feels']}")
                for sc in n['scenes']: print(f"     [{sc['who']}/{sc.get('tone')}{'/SWAP' if sc.get('swap') else ''}] {sc['en']} | {sc['ko']}")
                print(f"     why={n['why']}")
elif mode=='chunks':
    for si,s in enumerate(d['situations']):
        kp=set(inj['situations'][si]['keyPhrases'])
        for i,x in enumerate(s['sentences']):
            print(f"S{si}.{i}{' KP' if x['en'] in kp else ''} | "+' / '.join(x['chunks']))
elif mode=='kp':
    for si,s in enumerate(d['situations']):
        kp=inj['situations'][si]['keyPhrases']
        ens=[x['en'] for x in s['sentences']]
        for k in kp: print(f"S{si} {'IN' if k in ens else 'NOTIN'} | {k}")
