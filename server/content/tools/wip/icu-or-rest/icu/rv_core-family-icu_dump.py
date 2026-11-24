import yaml, json, sys, re
D='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
T='core-family-icu'
y=yaml.safe_load(open(D+T+'.yaml'))
base=yaml.safe_load(open(D+'base-'+T+'.yaml'))
inj=json.load(open(D+'in-'+T+'.json'))
kps=set()
for s in inj['situations']:
    for k in s.get('keyPhrases',[]): kps.add(k)
mode=sys.argv[1]
W={w['id']:w for w in y['words']}
nl=lambda s: len(s.replace(' ',''))
if mode=='words':
    for w in y['words']:
        de=w.get('distractorsEn');dk=w.get('distractorsKo')
        flag=''
        for x in de:
            a,b=nl(w['en']),nl(x)
            if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): flag+=' LEN_EN:'+x
        for x in dk:
            a,b=nl(w['ko']),nl(x)
            if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): flag+=' LEN_KO:'+x
        print(f"{w['id']}|{w['en']}|{w['ko']}|tag={w['tag']}|icon={w['icon']}\n   cue={w['cue']}\n   dEn={de} dKo={dk}\n   chips={w['chips']} decoy={w['decoyChips']}{flag}\n   ex={w['example']} / {w['exKo']}")
elif mode=='sents':
    for i,s in enumerate(y['situations']):
        print(f"=== {i} {s['title']}")
        for j,t in enumerate(s['sentences']):
            kp='KP ' if t['en'] in kps else '   '
            print(f"{i}.{j} {kp}{' / '.join(t['chunks'])}\n      ko={t['ko']} words={t['words']}")
elif mode=='nuance':
    for i,s in enumerate(y['situations']):
        print(f"=== {i} {s['title']}")
        for n in s.get('nuance',[]):
            print(yaml.safe_dump(n,allow_unicode=True,sort_keys=False,width=200))
elif mode=='pair':
    for i,s in enumerate(y['situations']):
        for n in s.get('nuance',[]):
            if n['kind']!='pair': continue
            L=[p[0] for p in n['pairs']]; R=[p[1] for p in n['pairs']]+n['decoys']
            print(f"=== {i} {s['title']} answers={n['pairs']} decoys={n['decoys']}")
            for l in L:
                print('   ', ' | '.join(f"{l} {r}" for r in R))
elif mode=='swap':
    for i,s in enumerate(y['situations']):
        for n in s.get('nuance',[]):
            if n['kind']!='swap': continue
            b=n['before']
            print(f"=== {i} ans={n['answer']} ko={n.get('ko')}")
            for o in n['options']: print('   ',b[0]+o+b[2])
elif mode=='context':
    for i,s in enumerate(y['situations']):
        for n in s.get('nuance',[]):
            if n['kind']!='context': continue
            w=n.get('word')
            print(f"=== {i} word={w} ko={n.get('ko')}")
            for sc in n['scenes']:
                has = w.lower() in sc['en'].lower() if w else False
                print(f"    [{sc['ok']}] {sc['who']} : {sc['en']} {'' if has else '!!NO-WORD'} {('-> '+sc['fix']) if 'fix' in sc else ''}")
elif mode=='stats':
    bw={w['id'] for w in base['words']}; nw={w['id'] for w in y['words']}
    print('words',len(nw),'base',len(bw),'removed',len(bw-nw),'added',nw-bw)
    from collections import Counter
    c=Counter(n['kind'] for s in y['situations'] for n in s.get('nuance',[]))
    print('situations',len(y['situations']),'sents',sum(len(s['sentences']) for s in y['situations']),c)
    print('tags',Counter(w['tag'] for w in y['words']))
    # sentence diffs vs base
    for i,(a,b) in enumerate(zip(base['situations'],y['situations'])):
        for j,(x,z) in enumerate(zip(a['sentences'],b['sentences'])):
            for f in ['en','ko','chunks','words']:
                if x[f]!=z[f]: print('DIFF',i,j,f,x[f],'->',z[f])
    for w in y['words']:
        if w['id'] in bw:
            ow=[b for b in base['words'] if b['id']==w['id']][0]
            for f in ['en','ko','ipa','icon','example']:
                if ow[f]!=w[f]: print('WDIFF',w['id'],f,ow[f],'->',w[f])
