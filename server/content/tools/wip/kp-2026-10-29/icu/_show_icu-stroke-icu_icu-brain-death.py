"""보기 전용: 상황·문장·order·nuance 덤프.  python3 _show... <주제> <상황번호...>"""
import sys, yaml, io
t = sys.argv[1]
d = yaml.safe_load(io.open(f'base-{t}.yaml', encoding='utf-8'))
for a in sys.argv[2:]:
    s = d['situations'][int(a)]
    print(f'##### [{a}] {s["title"]}')
    print(yaml.safe_dump({k: v for k, v in s.items()}, allow_unicode=True, sort_keys=False, width=200))
