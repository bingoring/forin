"""base → 출력 필드 단위 비교(문장 en 변경 목록 + 바뀐 필드 전부)."""
import sys, yaml
def flat(x, p=''):
    if isinstance(x, dict):
        for k, v in x.items(): yield from flat(v, f'{p}.{k}' if p else str(k))
    elif isinstance(x, list):
        for i, v in enumerate(x): yield from flat(v, f'{p}[{i}]')
    else: yield p, x
for t in sys.argv[1:]:
    a = yaml.safe_load(open(f'base-{t}.yaml')); b = yaml.safe_load(open(f'{t}.yaml'))
    print('=====', t)
    for si, (sa, sb) in enumerate(zip(a['situations'], b['situations'])):
        for i, (x, y) in enumerate(zip(sa['sentences'], sb['sentences'])):
            if x['en'] != y['en']: print(f'  EN {si}.{i}: {x["en"]!r} -> {y["en"]!r}')
    fa = dict(flat(a)); fb = dict(flat(b))
    keys = sorted(set(fa) | set(fb))
    ch = [k for k in keys if fa.get(k) != fb.get(k)]
    print(f'  바뀐 말단 필드 {len(ch)}개')
    if '-v' in sys.argv: pass
    wa = {w['id'] for w in a['words']}; wb = {w['id'] for w in b['words']}
    print('  빠진 단어', sorted(wa - wb), '더한 단어', sorted(wb - wa))
