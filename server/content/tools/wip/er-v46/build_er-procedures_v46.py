import yaml, glob, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
base = yaml.safe_load(open(D + 'base-er-procedures.yaml'))
add = {}
for f in sorted(glob.glob(D + 'add_er-procedures_v46_*.yaml')):
    for sit in yaml.safe_load(open(f)):
        assert sit['title'] not in add, sit['title']
        add[sit['title']] = sit
POOL = ['star','compass','gear','home','calendar','pushpin','bell','chevronRight','chevronLeft','lock','coffee','bulb','board','plane','redo','chartup','chevronDown','me','speaker','trophy']
BAN = {'check', 'cross'}
fixed = 0
out = copy.deepcopy(base)
miss = []
for si, sit in enumerate(out['situations']):
    a = add.get(sit['title'])
    if a is None:
        miss.append(sit['title']); continue
    assert len(a['s']) == len(sit['sentences']), (sit['title'], len(a['s']))
    for j, (sent, n) in enumerate(zip(sit['sentences'], a['s'])):
        sent['tag'] = n['t']; sent['icon'] = n['i']; sent['why'] = n['w']
        sent['decoy'] = n['d']; sent['distractorsKo'] = list(n['k'])
        opts = [[n['a'], n['ai']]] + [[e, i] for e, i in n['o']]
        assert len(opts) == 4, (sit['title'], j)
        used = set()
        for o in opts:
            bad = o[1] in BAN or o[1] == n['i'] or o[1] in used
            if bad:
                for c in POOL:
                    if c != n['i'] and c not in used and c not in [x[1] for x in opts]:
                        o[1] = c; fixed += 1; break
            used.add(o[1])
        opts = [{'en': e, 'icon': i} for e, i in opts]
        r = (si + j) % 4
        opts = opts[-r:] + opts[:-r] if r else opts
        sent['blank'] = {'answer': n['a'], 'options': opts}
    o = a['order']
    sit['order'] = {'tag': o['tag'], 'icon': o['icon'], 'ko': o['ko'], 'why': o['why'],
                    'lines': [dict(l) for l in o['lines']]}
    for nu in sit['nuance']:
        if nu['kind'] == 'context':
            assert a.get('ctx'), sit['title']
            nu['word'] = a['ctx']['word']; nu['ko'] = a['ctx']['ko']
        if nu['kind'] == 'swap':
            assert a.get('sw'), sit['title']
            nu['ko'] = a['sw']['ko']
if miss: print('아직 없음:', miss)
print('icon fixes', fixed)
yaml.safe_dump(out, open(D + 'er-procedures.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
