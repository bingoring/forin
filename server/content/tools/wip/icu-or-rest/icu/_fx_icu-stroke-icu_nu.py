import sys, yaml
d = yaml.safe_load(open('icu-stroke-icu.yaml', encoding='utf-8'))
for a in sys.argv[1].split(','):
    s = int(a); sit = d['situations'][s]
    print('=== S%d %s' % (s, sit['title']))
    for n in sit['nuance']:
        print(' -', n['kind'], n.get('words'))
        for k, v in n.items():
            if k in ('kind', 'words'): continue
            print('     %s: %s' % (k, v))
    o = sit['order']
    print(' ORDER', {k: v for k, v in o.items() if k != 'lines'})
    for l in o['lines']: print('     ', l)
