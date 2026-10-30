"""작업 확인용: base와 출력의 차이를 필드 단위로 모두 출력한다. 사용: <주제>"""
import sys, yaml, io
t = sys.argv[1]
a = yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8'))
b = yaml.safe_load(io.open(f'{t}.yaml', encoding='utf-8'))
def walk(x, y, p):
    if isinstance(x, dict) and isinstance(y, dict):
        for k in list(x) + [k for k in y if k not in x]:
            walk(x.get(k), y.get(k), f'{p}.{k}')
    elif isinstance(x, list) and isinstance(y, list) and len(x) == len(y):
        for i, (u, v) in enumerate(zip(x, y)):
            walk(u, v, f'{p}[{i}]')
    elif x != y:
        print(f'{p}\n   - {x!r}\n   + {y!r}')
aw = {w['id']: w for w in a['words']}; bw = {w['id']: w for w in b['words']}
for k in aw:
    if k not in bw: print('WORD REMOVED', k)
    else: walk(aw[k], bw[k], k)
for k in bw:
    if k not in aw: print('WORD ADDED', k)
walk(a['situations'], b['situations'], 'S')
