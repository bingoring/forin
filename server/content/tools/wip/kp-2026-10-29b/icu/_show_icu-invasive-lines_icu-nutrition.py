"""상황 번호를 받아 문장·order·nuance를 보여 준다 (읽기 전용)."""
import sys, yaml, io
doc = yaml.safe_load(io.open(sys.argv[1], encoding='utf-8'))
print('theme', doc.get('theme'), 'keys', list(doc.keys()))
for si in map(int, sys.argv[2:]):
    s = doc['situations'][si]
    print(f'##### [{si}] {s["title"]}')
    for i, se in enumerate(s['sentences']):
        print(f'--- {si}.{i}')
        print(yaml.safe_dump(se, allow_unicode=True, sort_keys=False, width=10000))
    print('--- order'); print(yaml.safe_dump(s.get('order'), allow_unicode=True, sort_keys=False, width=10000))
    print('--- nuance'); print(yaml.safe_dump(s.get('nuance'), allow_unicode=True, sort_keys=False, width=10000))
