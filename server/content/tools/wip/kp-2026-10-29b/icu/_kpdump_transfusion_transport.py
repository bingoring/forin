import sys, yaml, io, json
t = sys.argv[1]
d = yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8'))
j = json.load(io.open(f'in-{t}.json', encoding='utf-8'))
kps = set()
def walk(o):
    if isinstance(o, dict):
        for k, v in o.items():
            if k == 'keyPhrases': kps.update(v)
            else: walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(j)
for i, s in enumerate(d['situations']):
    for k, se in enumerate(s['sentences']):
        if se['en'] in kps:
            print(f"{i}.{k} [{s['title']}] {' / '.join(se['chunks'])}  || decoy={se['decoy']!r} blank={se['blank']['answer']!r}")
