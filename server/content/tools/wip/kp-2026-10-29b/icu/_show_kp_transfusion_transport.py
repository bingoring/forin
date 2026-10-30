import sys, yaml, io
p, *idx = sys.argv[1:]
d = yaml.safe_load(io.open(p, encoding='utf-8'))
for i in map(int, idx):
    s = d['situations'][i]
    print('=====', i, s['title'])
    print(yaml.safe_dump({k: v for k, v in s.items() if k != 'title'}, allow_unicode=True, sort_keys=False, width=200))
