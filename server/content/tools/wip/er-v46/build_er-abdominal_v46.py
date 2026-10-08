import yaml, glob, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
base = yaml.safe_load(open(D + 'base-er-abdominal.yaml'))
add = {}
for f in sorted(glob.glob(D + 'add_er-abdominal_v46_*.yaml')):
    for sit in yaml.safe_load(open(f)):
        assert sit['title'] not in add, sit['title']
        add[sit['title']] = sit
CTX = {
 '초기 복통 문진': {'word': 'radiate', 'ko': '방사되다'},
 '우하복부 압통(충수염 의심)': {'word': 'rebound', 'ko': '반발통'},
 '담석 산통(RUQ)': {'word': "Murphy's sign", 'ko': '머피 징후'},
 '게실염 좌하복부': {'word': 'PO', 'ko': '경구(입으로)', 'sc': {2: "She's finished drinking the PO contrast for her CT."}},
 '임신 가능 여성 복통': {'word': 'LMP', 'ko': '마지막 생리일'},
 '대동맥류 파열(찢는 통증)': {'word': 'pulsatile', 'ko': '박동성의'},
 '장간막 허혈': {'word': 'out of proportion', 'ko': '(진찰에 비해) 불균형한'},
 '급성 복증 급속악화': {'word': 'BP', 'ko': '혈압'},
}
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
    for nu in sit['nuance']:
        if nu['kind'] == 'context':
            c = a.get('ctx') or CTX[sit['title']]
            nu['word'] = c['word']; nu['ko'] = c['ko']
            for k, v in (c.get('sc') or {}).items():
                nu['scenes'][k]['en'] = v
            for k, v in (c.get('fix') or {}).items():
                nu['scenes'][k]['fix'] = v
        if nu['kind'] == 'swap':
            assert a.get('sw'), sit['title']
            nu['ko'] = a['sw']['ko']
if miss: print('아직 없음:', miss)
yaml.safe_dump(out, open(D + 'er-abdominal.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
