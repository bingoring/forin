"""덤프: python3 _dump_kp_or-difficult-airway-preop-assessment.py <yaml> <상황번호,...> [nuance]"""
import sys, yaml, json
d = yaml.safe_load(open(sys.argv[1]))
sel = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 and sys.argv[2] != 'all' else range(len(d['situations']))
nu = len(sys.argv) > 3
for i in sel:
    s = d['situations'][i]
    print(f"=== S{i} {s['title']}")
    for j, se in enumerate(s['sentences']):
        print(f"  [{j}] {se['en']}  | {se['ko']}")
        print(f"      chunks={' / '.join(se['chunks'])}  words={se['words']} goal={se.get('goal')}")
        print(f"      tag={se.get('tag')} icon={se.get('icon')} decoy={se.get('decoy')!r}")
        print(f"      why={se.get('why')}")
        print(f"      dKo={se.get('distractorsKo')}")
        b = se.get('blank') or {}
        print(f"      blank={b.get('answer')} :: {[o['en'] for o in b.get('options', [])]}")
    od = s.get('order')
    if od:
        print(f"  ORDER ko={od.get('ko')} why={od.get('why')}")
        for l in od['lines']:
            print(f"    - {l['en']} | {l.get('ko')} | {l.get('note')}")
    if nu:
        for n in s.get('nuance', []):
            print('  NU', json.dumps(n, ensure_ascii=False))
