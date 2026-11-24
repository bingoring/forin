import sys, yaml, io
def load(p): return yaml.safe_load(io.open(p, encoding='utf-8'))
def flat(o, pre=''):
    if isinstance(o, dict):
        for k, v in o.items(): yield from flat(v, f'{pre}.{k}')
    elif isinstance(o, list) and o and all(isinstance(x, (dict, list)) for x in o):
        for i, v in enumerate(o): yield from flat(v, f'{pre}[{i}]')
    else: yield pre, o
for t in sys.argv[1:]:
    a, b = load(f'base-{t}.yaml'), load(f'{t}.yaml')
    print('=====', t)
    wa = {w['id']: w for w in a['words']}; wb = {w['id']: w for w in b['words']}
    print('words removed', sorted(set(wa)-set(wb)), 'added', sorted(set(wb)-set(wa)))
    for wid in sorted(set(wa)&set(wb)):
        for k in wb[wid]:
            if wa[wid].get(k) != wb[wid][k]: print(f'  word {wid}.{k}: {wa[wid].get(k)!r} -> {wb[wid][k]!r}')
    fa = dict(flat(a['situations'])); fb = dict(flat(b['situations']))
    for k in fb:
        if fa.get(k) != fb[k]: print(f'  {k}: {fa.get(k)!r}\n      -> {fb[k]!r}')
    for k in fa:
        if k not in fb: print('  REMOVED', k)
