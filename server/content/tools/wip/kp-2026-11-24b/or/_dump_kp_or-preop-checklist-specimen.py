import sys, yaml, io
f, idxs = sys.argv[1], [int(x) for x in sys.argv[2].split(',')]
d = yaml.safe_load(io.open(f, encoding='utf-8'))
for i in idxs:
    s = d['situations'][i]
    print(f"\n######## [{i}] {s['title']}")
    for k in s:
        if k not in ('sentences','nuance','order','title'):
            print(' ', k, ':', s[k])
    for j, se in enumerate(s['sentences']):
        print(f"--- {i}.{j}")
        print(yaml.safe_dump(se, allow_unicode=True, sort_keys=False, width=10000))
    print('--- order'); print(yaml.safe_dump(s.get('order'), allow_unicode=True, sort_keys=False, width=10000))
    for j, n in enumerate(s.get('nuance', [])):
        print(f'--- nuance {j}'); print(yaml.safe_dump(n, allow_unicode=True, sort_keys=False, width=10000))
