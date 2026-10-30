import sys, yaml, io
p, *ids = sys.argv[1:]
d = yaml.safe_load(io.open(p, encoding='utf-8'))
bank = {w['id']: w for w in d['words']}
for wid in ids:
    if wid.startswith('?'):
        q = wid[1:].lower()
        print('search', q, [w['id'] for w in d['words'] if q in w['en'].lower()])
        continue
    w = bank.get(wid)
    print('---', wid, 'IN BANK' if w else 'NOT IN BANK')
    if w: print(yaml.safe_dump(w, allow_unicode=True, sort_keys=False, width=200))
    for i, s in enumerate(d['situations']):
        for j, se in enumerate(s['sentences']):
            if wid in se['words']:
                print(f'   used {i}.{j} {se["en"]}')
        for n in s.get('nuance', []):
            if wid in n.get('words', []):
                print(f'   nuance {i} {n["kind"]}')
