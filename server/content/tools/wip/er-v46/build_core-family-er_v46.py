import yaml, glob, copy, sys
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
base = yaml.safe_load(open(D + 'base-core-family-er.yaml'))
add = {}
for f in sorted(glob.glob(D + 'add_core-family-er_v46_*.yaml')):
    for sit in yaml.safe_load(open(f)):
        assert sit['title'] not in add, sit['title']
        add[sit['title']] = sit
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
        opts = [{'en': n['a'], 'icon': n['ai']}] + [{'en': e, 'icon': i} for e, i in n['o']]
        assert len(opts) == 4, (sit['title'], j)
        r = (si + j) % 4
        opts = opts[-r:] + opts[:-r] if r else opts
        sent['blank'] = {'answer': n['a'], 'options': opts}
    o = a['order']
    sit['order'] = {'tag': o['tag'], 'icon': o['icon'], 'ko': o['ko'], 'why': o['why'],
                    'lines': [dict(l) for l in o['lines']]}
    for nu in sit['nuance']:
        if nu['kind'] == 'context':
            assert 'ctx' in a, sit['title']
            nu['word'] = a['ctx']['word']; nu['ko'] = a['ctx']['ko']
        if nu['kind'] == 'swap':
            assert 'sw' in a, sit['title']
            nu['ko'] = a['sw']['ko']
if miss: print('아직 없음:', len(miss))
yaml.safe_dump(out, open(D + 'core-family-er.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
