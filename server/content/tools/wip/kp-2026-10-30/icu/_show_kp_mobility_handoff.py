"""show helper for kp-2026-10-30 icu-mobility-prevention / core-handoff-icu"""
import sys, yaml, io
doc = yaml.safe_load(io.open(sys.argv[1], encoding='utf-8'))
for a in sys.argv[2:]:
    if a.startswith('w:'):
        for w in doc['words']:
            if w['id'] == a[2:]:
                print(yaml.safe_dump(w, allow_unicode=True, sort_keys=False, width=10000))
        continue
    if '.' in a:
        si, i = map(int, a.split('.'))
        s = doc['situations'][si]
        print(f'## [{si}] {s["title"]} .{i}')
        print(yaml.safe_dump(s['sentences'][i], allow_unicode=True, sort_keys=False, width=10000))
    else:
        s = doc['situations'][int(a)]
        print(f'## [{a}] {s["title"]}')
        print(yaml.safe_dump(s, allow_unicode=True, sort_keys=False, width=10000))
