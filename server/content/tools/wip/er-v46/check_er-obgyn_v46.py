import yaml, re, itertools, collections
d = yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-obgyn.yaml'))
mode = __import__('sys').argv[1]
allopts = collections.Counter()
for si, s in enumerate(d['situations']):
    print(f"\n## {si} {s['title']}")
    if mode == 'blank':
        for j, x in enumerate(s['sentences']):
            b = x['blank']; a = b['answer']
            n = len(re.findall(r'(?<![\w-])' + re.escape(a) + r'(?![\w-])', x['en']))
            flag = '' if n == 1 else f'  !!! answer count {n}'
            if x['decoy'].lower() in x['en'].lower(): flag += ' !!! decoy in en'
            if x['decoy'] in x['chunks']: flag += ' !!! decoy==chunk'
            print(f"[{j}] KO: {x['ko']}{flag}")
            for o in b['options']:
                e = o['en']
                line = re.sub(r'(?<![\w-])' + re.escape(a) + r'(?![\w-])', lambda m: e, x['en'], count=1)
                print(('   * ' if e == a else '     ') + line)
            allopts[tuple(sorted(o['en'].lower() for o in b['options'] if o['en'] != a))] += 1
    elif mode == 'dko':
        for j, x in enumerate(s['sentences']):
            print(f"[{j}] {x['ko']}\n      d1: {x['distractorsKo'][0]}\n      d2: {x['distractorsKo'][1]}\n      decoy: {x['decoy']}   tag:{x['tag']}({len(x['tag'])})")
    elif mode == 'order':
        L = [l['en'] for l in s['order']['lines']]
        print('ORDER:'); [print('  ', i + 1, l) for i, l in enumerate(L)]
        for i in range(3):
            P = L[:]; P[i], P[i + 1] = P[i + 1], P[i]
            print(f'  swap {i+1}<->{i+2}:'); [print('      ', l) for l in P]
        for l in L:
            if re.match(r'\s*(If so|If it does|If not|In that case|If any of those|While|Once|Until|After|Along|Based on all|First|Last|And|Also|Then|Meanwhile)\b', l) or re.search(r'\b(meanwhile|While|Until then|Once)\b', l):
                print('  !!! check cond/time:', l)
            if len(l.split()) > 15: print('  !!! long', l)
if mode == 'blank':
    print('\nREUSED OPTION SETS:', [(k, v) for k, v in allopts.items() if v > 1])
