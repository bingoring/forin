"""base와 출력의 필드 단위 차이를 뽑는다(읽기 전용)."""
import sys, yaml, io
def flat(x, p=''):
    out = {}
    if isinstance(x, dict):
        for k, v in x.items(): out.update(flat(v, f'{p}.{k}' if p else k))
    elif isinstance(x, list) and x and all(isinstance(i, dict) for i in x):
        for i, v in enumerate(x):
            key = v.get('id') if 'id' in v else i
            out.update(flat(v, f'{p}[{key}]'))
    else:
        out[p] = x
    return out
for t in sys.argv[1:]:
    a = flat(yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8')))
    b = flat(yaml.safe_load(io.open(f'{t}.yaml', encoding='utf-8')))
    print('=====', t)
    for k in sorted(set(a) | set(b)):
        if a.get(k) != b.get(k):
            print(f'{k}\n   - {a.get(k)!r}\n   + {b.get(k)!r}')
