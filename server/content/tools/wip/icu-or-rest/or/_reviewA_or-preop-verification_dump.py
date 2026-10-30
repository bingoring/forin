import yaml,json,sys
d=yaml.safe_load(open('or-preop-verification.yaml'))
inp=json.load(open('in-or-preop-verification.json'))
kp={s['title']:s['keyPhrases'] for s in inp['situations']}
mode=sys.argv[1]
if mode=='words':
    for w in d['words']:
        print(f"{w['id']} | {w['en']} | {w['ko']} | cue={w.get('cue')} | tag={w.get('tag')} | dEn={w.get('distractorsEn')} | dKo={w.get('distractorsKo')} | chips={w.get('chips')} | decoy={w.get('decoyChips')} | ex={w.get('example')} / {w.get('exKo')}")
elif mode=='sents':
    for si,s in enumerate(d['situations']):
        print(f"## {si} {s['title']}")
        for i,x in enumerate(s['sentences']):
            k='KP' if x['en'] in kp[s['title']] else '  '
            print(f"{si}.{i} {k} {x['en']} | {x['ko']} | {' / '.join(x['chunks'])} | {x['words']}")
elif mode=='nuance':
    for si,s in enumerate(d['situations']):
        print(f"## {si} {s['title']}  words: {sorted(set(w for x in s['sentences'] for w in x['words']))}")
        for n in s.get('nuance',[]):
            print(json.dumps(n,ensure_ascii=False,indent=None))
