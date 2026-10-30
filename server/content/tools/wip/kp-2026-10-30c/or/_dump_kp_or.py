import json,yaml,sys
t=sys.argv[1]
d=yaml.safe_load(open(f'base-{t}.yaml'))
j=json.load(open(f'in-{t}.json'))
for si,(s,js) in enumerate(zip(d['situations'],j['situations'])):
    assert s['title']==js['title']
    for i,se in enumerate(s['sentences']):
        if se['en'] in js['keyPhrases']:
            print(f"[{si}.{i}] {se['en']} | {' / '.join(se['chunks'])} | decoy={se['decoy']} | blank={se['blank']['answer']} | words={se['words']}")
