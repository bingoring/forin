"""작업 확인용: 주제 파일의 상황을 통째로 보여 준다. 사용: python3 _show_... <yaml> <상황번호...>"""
import sys, yaml, io
doc = yaml.safe_load(io.open(sys.argv[1], encoding='utf-8'))
for a in sys.argv[2:]:
    i = int(a)
    s = doc['situations'][i]
    print(f'##### [{i}] {s["title"]}')
    for j, se in enumerate(s['sentences']):
        print(f'--- {i}.{j}')
        print(yaml.safe_dump(se, allow_unicode=True, sort_keys=False, width=10000))
    print('--- nuance'); print(yaml.safe_dump(s.get('nuance'), allow_unicode=True, sort_keys=False, width=10000))
    print('--- order'); print(yaml.safe_dump(s.get('order'), allow_unicode=True, sort_keys=False, width=10000))
