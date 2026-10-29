"""보기 전용: base와 출력의 필드 단위 차이."""
import sys, yaml, io
t = sys.argv[1]
a = yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8'))
b = yaml.safe_load(io.open(f'{t}.yaml', encoding='utf-8'))
def walk(x, y, p):
    if isinstance(x, dict) and isinstance(y, dict):
        for k in list(x) + [k for k in y if k not in x]:
            walk(x.get(k), y.get(k), p + [str(k)])
    elif isinstance(x, list) and isinstance(y, list) and len(x) == len(y) and not all(isinstance(i, str) for i in x):
        for i, (m, n) in enumerate(zip(x, y)):
            walk(m, n, p + [str(i)])
    elif x != y:
        print('/'.join(p), '\n   -', x, '\n   +', y)
walk(a, b, [])
