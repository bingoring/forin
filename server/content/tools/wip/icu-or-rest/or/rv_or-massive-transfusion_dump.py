import yaml,sys,json
d=yaml.safe_load(open('or-massive-transfusion.yaml'))
b=yaml.safe_load(open('base-or-massive-transfusion.yaml'))
kp=set(k for s in json.load(open('in-or-massive-transfusion.json'))['situations'] for k in s['keyPhrases'])
mode=sys.argv[1]
if mode=='words':
    for w in d['words']:
        print(f"{w['id']} | {w['en']} | {w['ko']} | tag={w['tag']} | cue={w['cue']}\n   dEn={w['distractorsEn']} dKo={w['distractorsKo']} chips={w['chips']} decoy={w['decoyChips']} | ex={w['example']} / {w['exKo']}")
elif mode=='sents':
    for i,s in enumerate(d['situations']):
        print(f"## {i} {s['title']}")
        for j,x in enumerate(s['sentences']):
            print(f"{i}.{j}{' KP' if x['en'] in kp else ''} | {x['en']} | {x['ko']} | {' / '.join(x['chunks'])} | {x['words']}")
elif mode=='nuance':
    for i,s in enumerate(d['situations']):
        for n in s['nuance']:
            print(f"### {i} {s['title']} — {n['kind']}")
            print(yaml.safe_dump(n,allow_unicode=True,sort_keys=False,width=200))
