import glob, yaml, copy
T = "icu-sepsis"
D = '/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
base = yaml.safe_load(open(D + f'base-{T}.yaml', encoding='utf-8'))
add = {}
for f in sorted(glob.glob(D + f'add_{T}_B_*.yaml')):
    for sit in yaml.safe_load(open(f, encoding='utf-8')):
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
        opts = [{'en': n['a']}] + [{'en': e} for e in n['o']]
        assert len(opts) == 4, (sit['title'], j)
        r = (si + j) % 4
        opts = opts[-r:] + opts[:-r] if r else opts
        sent['blank'] = {'answer': n['a'], 'options': opts}
    o = a['order']
    sit['order'] = {'tag': o['tag'], 'icon': o['icon'], 'ko': o['ko'], 'why': o['why'],
                    'lines': [dict(l) for l in o['lines']]}
ov = yaml.safe_load(open(D + 'decoys_icu-sepsis_B.yaml', encoding='utf-8'))
for key, v in ov.items():
    si, j = map(int, key.split('.'))
    out['situations'][si]['sentences'][j]['decoy'] = v
if miss: print('아직 없음:', len(miss), miss)
yaml.safe_dump(out, open(D + f'{T}.B.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
