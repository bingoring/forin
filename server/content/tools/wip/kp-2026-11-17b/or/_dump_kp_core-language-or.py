"""dump situations by index: python3 _dump_kp_core-language-or.py <file> i [i ...]"""
import sys, yaml
d = yaml.safe_load(open(sys.argv[1]))
for i in map(int, sys.argv[2:]):
    s = d['situations'][i]
    print(f'######## [{i}] {s["title"]}')
    print(yaml.safe_dump(s, allow_unicode=True, sort_keys=False, width=200))
