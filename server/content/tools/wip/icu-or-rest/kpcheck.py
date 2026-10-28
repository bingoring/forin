import json,sys,yaml
# keyPhrase en(정본 입력)이 주제 yaml 문장 en에 그대로 있는지 대조
for t in sys.argv[1:]:
    d=json.load(open(f'icu/in-{t}.json'))
    y=yaml.safe_load(open(f'icu/{t}.yaml'))
    ens=set()
    def walk(o):
        if isinstance(o,dict):
            if 'en' in o and 'chunks' in o: ens.add(o['en'])
            for v in o.values(): walk(v)
        elif isinstance(o,list):
            for v in o: walk(v)
    walk(y)
    kps=[k if isinstance(k,str) else k.get('en') for s in d['situations'] for k in s['keyPhrases']]
    miss=[k for k in kps if k not in ens]
    print(f'{t}: {len(kps)-len(miss)}/{len(kps)}', *miss, sep='\n  ')
