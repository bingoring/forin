import yaml, json, sys, collections
d=yaml.safe_load(open('core-language-icu.yaml'))
b=yaml.safe_load(open('base-core-language-icu.yaml'))
inj=json.load(open('in-core-language-icu.json'))
KP={k for s in inj['situations'] for k in s['keyPhrases']}
mode=sys.argv[1]
W={w['id']:w for w in d['words']}
if mode=='words':
    for w in d['words']:
        print(f"{w['id']}|{w['en']}|{w['ko']}|tag={w['tag']}|cue={w['cue']}|dEn={w['distractorsEn']}|dKo={w['distractorsKo']}|chips={'/'.join('+'.join(c) for c in w['chips'])}|decoy={w['decoyChips']}|ex={w['example']}|exKo={w['exKo']}")
elif mode=='sents':
    for i,s in enumerate(d['situations']):
        print(f"## {i} {s['title']}")
        for j,x in enumerate(s['sentences']):
            kp='KP ' if x['en'] in KP else ''
            print(f"{i}.{j} {kp}{' / '.join(x['chunks'])} || {x['ko']} || {x['words']}")
elif mode=='nuance':
    for i,s in enumerate(d['situations']):
        print(f"## {i} {s['title']}")
        for n in s['nuance']:
            print(json.dumps(n,ensure_ascii=False))
elif mode=='pairs':
    for i,s in enumerate(d['situations']):
        for n in s['nuance']:
            if n['kind']!='pair': continue
            print(f"## {i} {s['title']} why={n['why']}")
            R=[p[1] for p in n['pairs']]+n['decoys']
            for l,r0 in n['pairs']:
                for r in R:
                    print(f"  {'*' if r==r0 else ' '} {l} {r}")
elif mode=='swap':
    for i,s in enumerate(d['situations']):
        for n in s['nuance']:
            if n['kind']!='swap': continue
            print(f"## {i} {s['title']} who={n['who']} ans={n['answer']} ko={n.get('ko')}")
            for o in n['options']:
                print(f"   {n['before'][0]}[{o}]{n['before'][2]}  -- {n['notes'].get(o)}")
            print('   why:',n['why'])
elif mode=='stats':
    c=collections.Counter(n['kind'] for s in d['situations'] for n in s['nuance']); print(c, sum(len(s['sentences']) for s in d['situations']))
    bw={w['id'] for w in b['words']}; dw=set(W)
    print('removed',len(bw-dw),sorted(bw-dw)); print('added',sorted(dw-bw))
    for w in d['words']:
        bb=next((x for x in b['words'] if x['id']==w['id']),None)
        if bb:
            for k in ['en','ko','ipa','icon','example']:
                if bb.get(k)!=w.get(k): print('CHG',w['id'],k,bb.get(k),'->',w.get(k))
    # sentence en/ko changes
    for i,(s,t) in enumerate(zip(d['situations'],b['situations'])):
        for j,(x,y) in enumerate(zip(s['sentences'],t['sentences'])):
            for k in ['en','ko','chunks']:
                if x[k]!=y[k]: print('SCHG',i,j,k)
    # usage count per word
    use=collections.Counter(w for s in d['situations'] for x in s['sentences'] for w in x['words'])
    print('unused',[w for w in W if use[w]==0])
