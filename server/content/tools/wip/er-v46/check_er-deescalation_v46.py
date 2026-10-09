import yaml, itertools
y = yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-deescalation.yaml'))
for si, s in enumerate(y['situations']):
    print(f"\n## S{si} {s['title']}")
    for j, x in enumerate(s['sentences']):
        b = x['blank']; en = x['en']
        print(f" [{j}] KO: {x['ko']}")
        for o in b['options']:
            print("     B:", en.replace(b['answer'], '[' + o['en'] + ']') + ('   <== ANS' if o['en']==b['answer'] else ''))
        print("     X1:", x['distractorsKo'][0], "| X2:", x['distractorsKo'][1], "| decoy:", x['decoy'], "| chunks:", x['chunks'])
    L = [l['en'] for l in s['order']['lines']]
    print(' ORDER:'); [print('   ', i+1, l, f"({len(l.split())}w)") for i, l in enumerate(L)]
    for i in range(3):
        M = L[:]; M[i], M[i+1] = M[i+1], M[i]
        print(f'  SWAP{i+1}{i+2}:', ' // '.join(M))
    for n in s['nuance']:
        if n['kind'] == 'context':
            print(' CTX', n['word'], n['ko'], [(c['ok'], c['en'], c.get('fix')) for c in n['scenes']])
        if n['kind'] == 'swap':
            print(' SWAP-KO', n['ko'], '|', n['before'], n['answer'])
