"""base-<주제>.yaml과 <주제>.yaml을 필드 단위로 비교해 바뀐 것을 전부 찍는다."""
import sys, io, yaml
def flat(x, p=''):
    if isinstance(x, dict):
        for k, v in x.items(): yield from flat(v, f'{p}.{k}' if p else str(k))
    elif isinstance(x, list):
        for i, v in enumerate(x): yield from flat(v, f'{p}[{i}]')
    else: yield p, x
for t in sys.argv[1:]:
    a = dict(flat(yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8'))))
    b = dict(flat(yaml.safe_load(io.open(f'{t}.yaml', encoding='utf-8'))))
    print('=====', t)
    for k in sorted(set(a) | set(b), key=lambda k: (k.split('.')[0], k)):
        if a.get(k) != b.get(k):
            print(f'{k}\n   - {a.get(k)!r}\n   + {b.get(k)!r}')
