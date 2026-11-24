import yaml,json,sys
d=yaml.safe_load(open('icu-transfusion.yaml'))
b=yaml.safe_load(open('base-icu-transfusion.yaml'))
bw={w['id']:w for w in b['words']}
use={}
for s in d['situations']:
    for i,x in enumerate(s['sentences']):
        for w in x['words']: use.setdefault(w,[]).append(s['title'][:6]+str(i))
mode=sys.argv[1]
if mode=='words':
    for w in d['words']:
        new='' if w['id'] in bw else 'NEW '
        ch='' if w['id'] not in bw or all(bw[w['id']].get(k)==w.get(k) for k in ['en','ko','ipa','example']) else 'CHG '
        print(f"{new}{ch}{w['id']} | {w['en']} | {w['ko']} | tag={w['tag']} | cue={w['cue']}")
        print(f"   dEn={w['distractorsEn']} dKo={w['distractorsKo']} chips={'/'.join('+'.join(c) for c in w['chips'])} decoy={w['decoyChips']} n={len(use.get(w['id'],[]))}")
if mode=='sents':
    j=json.load(open('in-icu-transfusion.json'))
    kp={s['title']:s['keyPhrases'] for s in j['situations']}
    for s in d['situations']:
        print('##',s['title'])
        for i,x in enumerate(s['sentences']):
            k='KP ' if x['en'] in kp[s['title']] else ''
            print(f"{i} {k}{' / '.join(x['chunks'])}\n   ko={x['ko']}\n   words={x['words']} why={x.get('why','')[:200]}")
if mode=='nuance':
    for s in d['situations']:
        print('##',s['title'])
        for n in s.get('nuance',[]):
            n=dict(n); k=n.pop('kind')
            print(' ['+k+']', json.dumps(n,ensure_ascii=False))
        o=s.get('order')
        if o: print(' [order]', json.dumps(o,ensure_ascii=False)[:600])
if mode=='checks':
    import re
    L=lambda s:len(s.replace(' ',''))
    ok=lambda a,b: (max(L(a),L(b))<=1.25*min(L(a),L(b))) or abs(L(a)-L(b))<=3
    bad=set('beer wine gin rum ale rye mead port sake booze shot pub bar keg brew vodka whisky whiskey sherry punch cider lager stout tipsy drunk hangover sex ass tit cock hoe slut nut balls dick horny breast nude kiss bed bury grave tomb coffin hearse corpse dead die dye kill war gun pot weed joint crack meth damn hell sin chick fag gay bitch pee poo poop fart butt crap'.split())
    for w in d['words']:
        if re.search('[A-Za-z]',w['cue']): print('CUE-EN',w['id'],w['cue'])
        for x in w['distractorsEn']:
            if not ok(x,w['en']): print('LEN-EN',w['id'],w['en'],x)
        for x in w['distractorsKo']:
            if not ok(x,w['ko']): print('LEN-KO',w['id'],w['ko'],x)
        for c in w['decoyChips']+w['distractorsEn']+[p for ch in w['chips'] for p in ch]:
            if str(c).lower().strip('-') in bad: print('BADCHIP',w['id'],w['en'],c)
        if w['ko'] in w['cue']: print('CUE-KO-REPEAT',w['id'],w['ko'])
    # nuance decoys / pair
    for s in d['situations']:
        for n in s.get('nuance',[]):
            if n['kind']=='pair':
                L_=[p[0] for p in n['pairs']]; R=[p[1] for p in n['pairs']]+n['decoys']
                print('PAIR',s['title'])
                for l in L_:
                    print('   ',' | '.join(f'{l} {r}' for r in R))
if mode=='swap':
    for s in d['situations']:
        for n in s.get('nuance',[]):
            if n['kind']=='swap':
                b0,_,b2=n['before']
                print('##',s['title'],'| who=',n.get('who'),'| ko=',n.get('ko'),'| ans=',n['answer'])
                for o in n['options']: print('   ',repr(b0+o+b2), '||', n['notes'].get(o))
                print('   why=',n['why'])
if mode=='context':
    for s in d['situations']:
        for n in s.get('nuance',[]):
            if n['kind']=='context':
                print('##',s['title'],'| word=',n.get('word'),'| ko=',n.get('ko'))
                for sc in n['scenes']:
                    print('   ',sc.get('who'),'|',sc.get('ok'),'|',sc['en'],'| inword=',n.get('word','').lower() in sc['en'].lower(), '| fix=',sc.get('fix',''))
                print('   why=',n['why'])
if mode=='stats':
    from collections import Counter
    c=Counter(n['kind'] for s in d['situations'] for n in s.get('nuance',[]))
    print(len(d['words']),'words',len(d['situations']),'sits',sum(len(s['sentences']) for s in d['situations']),'sents',c)
    print('base words',len(b['words']))
