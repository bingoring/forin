import yaml, glob, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
T = 'core-language-er'
base = yaml.safe_load(open(D + f'base-{T}.yaml'))
add = {}
for f in sorted(glob.glob(D + f'add_{T}_v46_*.yaml')):
    for sit in yaml.safe_load(open(f)):
        assert sit['title'] not in add, sit['title']
        add[sit['title']] = sit
POOL = ['compass','gear','calendar','lock','bulb','trophy','plane','coffee','pushpin','scalpel','lab','monitor','home','hospital','siren','chartup','star','pencil','bell','board']
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
        ai = n['ai']
        if ai == n['i']: ai = 'trophy' if n['i'] != 'trophy' else 'gear'
        used = {ai, n['i']}
        icons = []
        k = (si * 3 + j * 5) % len(POOL)
        while len(icons) < 3:
            c = POOL[k % len(POOL)]; k += 1
            if c not in used:
                used.add(c); icons.append(c)
        opts = [{'en': n['a'], 'icon': ai}] + [{'en': e, 'icon': i} for e, i in zip(n['o'], icons)]
        assert len(opts) == 4, (sit['title'], j)
        r = (si + j) % 4
        opts = opts[-r:] + opts[:-r] if r else opts
        sent['blank'] = {'answer': n['a'], 'options': opts}
    o = a['order']
    sit['order'] = {'tag': o['tag'], 'icon': o['icon'], 'ko': o['ko'], 'why': o['why'], 'lines': [dict(l) for l in o['lines']]}
    for nu in sit['nuance']:
        if nu['kind'] == 'context':
            assert 'ctx' in a, sit['title']
            nu['word'] = a['ctx']['word']; nu['ko'] = a['ctx']['ko']
        if nu['kind'] == 'swap':
            assert 'sw' in a, sit['title']
            nu['ko'] = a['sw']['ko']
if miss: print('missing', miss)
yaml.safe_dump(out, open(D + f'{T}.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
