"""base와 출력을 필드 단위로 비교해 바뀐 것을 전부 출력한다."""
import sys, yaml
def walk(a, b, path, out):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in list(a) + [k for k in b if k not in a]:
            walk(a.get(k, '<없음>'), b.get(k, '<없음>'), f'{path}.{k}', out)
    elif isinstance(a, list) and isinstance(b, list) and all(isinstance(x, dict) for x in a + b) and len(a) == len(b):
        for i, (x, y) in enumerate(zip(a, b)):
            walk(x, y, f'{path}[{i}]', out)
    elif a != b:
        out.append(f'{path}: {a!r}\n    → {b!r}')
t = sys.argv[1]
A = yaml.safe_load(open(f'base-{t}.yaml')); B = yaml.safe_load(open(f'{t}.yaml'))
wa = {w['id']: w for w in A['words']}; wb = {w['id']: w for w in B['words']}
out = []
for k in sorted(set(wa) | set(wb)):
    walk(wa.get(k, '<없음>'), wb.get(k, '<없음>'), f'word {k}', out)
for si, (x, y) in enumerate(zip(A['situations'], B['situations'])):
    walk(x, y, f'sit {si}', out)
print('\n'.join(out)); print(len(out), '건')
