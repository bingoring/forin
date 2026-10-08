import yaml, glob, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
base = yaml.safe_load(open(D + 'base-er-sepsis.yaml'))
add = {}
for f in sorted(glob.glob(D + 'add_er-sepsis_v46_*.yaml')):
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
        assert len(n['o']) == 3, (sit['title'], j)
        opts = [n['a']] + list(n['o'])
        r = (si + j) % 4
        opts = opts[-r:] + opts[:-r] if r else opts
        sent['blank'] = {'answer': n['a'], 'options': [{'en': e} for e in opts]}
    o = a['order']
    sit['order'] = {'tag': o['tag'], 'icon': o['icon'], 'ko': o['ko'], 'why': o['why'],
                    'lines': [dict(l) for l in o['lines']]}
    kinds = [nu['kind'] for nu in sit['nuance']]
    for nu in sit['nuance']:
        if nu['kind'] == 'context':
            c = a.get('ctx')
            assert c, ('ctx missing', sit['title'])
            nu['word'] = c['word']; nu['ko'] = c['ko']
            for k, v in (c.get('sc') or {}).items():
                nu['scenes'][k]['en'] = v['en']
                if 'fix' in v: nu['scenes'][k]['fix'] = v['fix']
            if c.get('why'): nu['why'] = c['why']
        if nu['kind'] == 'swap':
            assert a.get('sw'), ('sw missing', sit['title'])
            nu['ko'] = a['sw']['ko']
    if 'swap' not in kinds: assert not a.get('sw'), sit['title']
    if 'context' not in kinds: assert not a.get('ctx'), sit['title']
extra = [k for k in add if k not in [s['title'] for s in out['situations']]]
if extra: print('원본에 없음:', extra)
if miss: print('아직 없음:', miss)
yaml.safe_dump(out, open(D + 'er-sepsis.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
