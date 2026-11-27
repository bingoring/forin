import yaml,json,sys,re
d=yaml.safe_load(open('or-tourniquet.yaml'))
inj=json.load(open('in-or-tourniquet.json'))
kps=set()
for s in inj['situations']:
    for k in s.get('keyPhrases',[]): kps.add(k if isinstance(k,str) else k.get('en'))
mode=sys.argv[1]
def L(x): return len(x.replace(' ',''))
if mode=='words':
    for w in d['words']:
        print(f"## {w['id']} | {w['en']} | {w['ko']} | tag={w['tag']} icon={w['icon']}")
        print(f"   cue: {w['cue']}")
        print(f"   dEn: {w['distractorsEn']}  dKo: {w['distractorsKo']}")
        print(f"   chips: {w['chips']}  decoy: {w['decoyChips']}")
        print(f"   ex: {w['example']} / {w['exKo']}")
        for x in w['distractorsEn']:
            a,b=L(w['en']),L(x)
            if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): print('   !LEN en',x)
        for x in w['distractorsKo']:
            a,b=L(w['ko']),L(x)
            if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): print('   !LEN ko',x)
elif mode=='sents':
    for i,s in enumerate(d['situations']):
        print(f"=== {i} {s['title']}")
        for j,t in enumerate(s['sentences']):
            kp='KP' if t['en'] in kps else '  '
            print(f" {i}.{j} {kp} {' / '.join(t['chunks'])}  || {t['ko']}  {t['words']}")
elif mode=='nuance':
    for i,s in enumerate(d['situations']):
        print(f"=== {i} {s['title']}")
        for k,n in enumerate(s['nuance']):
            print(f" -- n{k} {n['kind']} words={n['words']}")
            if n['kind']=='slider':
                print('   cue:',n['cue']); 
                for a,x in enumerate(n['scale']): print('   ','*' if a==n['answerAt'] else ' ',a,x)
                print('   why:',n['why']); print('   ex:',n.get('example'),'/',n.get('exKo'))
            elif n['kind']=='swap':
                print('   who:',n['who'],'| ko:',n.get('ko'))
                for o in n['options']:
                    print('   ','*' if o==n['answer'] else ' ', repr(n['before'][0]+o+n['before'][2]),'::',n['notes'].get(o))
                print('   why:',n['why'])
            elif n['kind']=='context':
                print('   word:',n.get('word'),'| ko:',n.get('ko'))
                for sc in n['scenes']:
                    print('   ','OK' if sc['ok'] else 'XX',sc['who'],'|',sc['en'],'| fix:',sc.get('fix',''))
                print('   why:',n['why'])
            elif n['kind']=='pair':
                L_=[p[0] for p in n['pairs']]; R=[p[1] for p in n['pairs']]+n['decoys']
                print('   pairs',n['pairs'],'decoys',n['decoys'])
                for l in L_:
                    for r in R: print('     ',l,'+',r)
                print('   why:',n['why'])
            else: print(json.dumps(n,ensure_ascii=False))
