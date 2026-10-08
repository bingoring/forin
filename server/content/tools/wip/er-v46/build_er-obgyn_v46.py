import yaml, glob, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
base = yaml.safe_load(open(D + 'base-er-obgyn.yaml'))
add = {}
for f in sorted(glob.glob(D + 'add_er-obgyn_v46_*.yaml')):
    for sit in yaml.safe_load(open(f)):
        assert sit['title'] not in add, sit['title']
        add[sit['title']] = sit
# 장면 정비: sc = {장면 인덱스: 새 en}
CTX = {
 '임신 초기 출혈 문진': {'word': 'gestational age', 'ko': '임신 주수',
    'sc': {0: 'Gestational age 8 wks by LMP, vaginal bleeding since 0600.',
           1: "Her gestational age is about eight weeks by her last period, bleeding since six this morning."}},
 '마지막 월경일 청취': {'word': 'LMP', 'ko': '마지막 생리일'},
 '골반통 초기 사정': {'word': 'LLQ', 'ko': '좌하복부',
    'sc': {1: 'She has crampy LLQ pain that comes and goes, and a temp of 38.4.'}},
 '산전 기록 확인': {'word': 'G3P2', 'ko': '3회 임신·2회 출산',
    'sc': {1: "She's G3P2 and had preeclampsia with her last pregnancy.", 2: 'So you\'re G3P2?'}},
 '자궁외임신 의심': {'word': 'ectopic', 'ko': '자궁외임신'},
 '임신오조 탈수': {'word': 'LR', 'ko': '젖산 링거액'},
 '임신 중 복통 감별': {'word': 'rebound', 'ko': '반발통'},
 '조기 진통 징후': {'word': 'rupture of membranes', 'ko': '양막 파열',
    'sc': {0: 'Pt reports gush of clear fluid at 1400; rupture of membranes suspected.',
           2: 'Did you have a rupture of membranes?'}},
 '임신 후기 대량출혈': {'word': 'abruption', 'ko': '태반조기박리'},
 '자간전증·자간증': {'word': 'eclampsia', 'ko': '자간증',
    'sc': {0: 'BP 168/112, HA, visual changes; r/o eclampsia, seizure precautions.'}},
 '자궁외임신 파열 쇼크': {'word': 'crashing', 'ko': '(상태가) 급격히 나빠지는',
    'sc': {0: 'Pt crashing: BP 74/40, HR 136; 2 units PRBC via rapid infuser.',
           1: "She's crashing — pressure's 74 over 40, tachy at 136, and we're hanging blood."}},
 '산후 대량출혈': {'word': 'boggy', 'ko': '(자궁이) 물렁한'},
 '패혈성 유산': {'word': 'septic', 'ko': '패혈 상태의',
    'sc': {0: 'Post-miscarriage, T 38.9, HR 124, foul discharge; septic, sepsis bundle initiated.'}},
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
            c = CTX[sit['title']]
            nu['word'] = c['word']; nu['ko'] = c['ko']
            for k, v in (c.get('sc') or {}).items():
                nu['scenes'][k]['en'] = v
        if nu['kind'] == 'swap':
            assert a.get('sw'), sit['title']
            nu['ko'] = a['sw']['ko']
if miss: print('아직 없음:', miss)
yaml.safe_dump(out, open(D + 'er-obgyn.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
