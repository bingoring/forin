"""보기 전용: 단어 id가 어느 문장에 태그됐는지, 옛 문장이 어디 나오는지."""
import sys, yaml, io
t = sys.argv[1]
d = yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8'))
for a in sys.argv[2:]:
    if a.startswith('w-'):
        hits = [f'{i}.{j}' for i, s in enumerate(d['situations']) for j, se in enumerate(s['sentences']) if a in se['words']]
        nu = [f'N{i}' for i, s in enumerate(d['situations']) for n in s.get('nuance', []) if a in n.get('words', [])]
        w = [x for x in d['words'] if x['id'] == a]
        print(a, hits, nu, (w[0]['en'], w[0]['example']) if w else 'NO WORD')
    else:
        raw = yaml.safe_dump(d, allow_unicode=True, width=10000).split('\n')
        print(repr(a), [l.strip()[:120] for l in raw if a in l])
