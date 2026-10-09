import yaml, glob, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
T = 'er-alcohol-withdrawal'
base = yaml.safe_load(open(D + 'base-' + T + '.yaml'))
add = {}
for f in sorted(glob.glob(D + 'add_' + T + '_v46_*.yaml')):
    for sit in yaml.safe_load(open(f)):
        assert sit['title'] not in add, sit['title']
        add[sit['title']] = sit
# context: word, ko, 장면 en 교체(sc), fix 교체
CTX = {
 '음주력·마지막 음주 문진': {'word': 'drink', 'ko': '술을 마시다', 'sc': {2: "What's your daily EtOH intake in standard drinks?"}},
 '금단 초기 증상 사정': {'word': 'CIWA', 'ko': 'CIWA(금단 평가 척도)'},
 '만취 관찰 환자': {'word': 'fall', 'ko': '낙상(넘어짐)'},
 '중등도 금단': {'word': 'dose', 'ko': '투여량(용량)'},
 '알코올성 환각증': {'word': 'spiders', 'ko': '거미'},
 '만성 음주 전해질 이상': {'word': 'magnesium', 'ko': '마그네슘',
    'sc': {1: 'Potassium 2.9, magnesium 1.1 — frequent PVCs on the monitor.', 2: 'Your low magnesium and hypokalemia are causing ectopy.'}},
 '알코올성 간질환 동반': {'word': 'skin', 'ko': '피부',
    'sc': {1: 'Jaundiced skin, scleral icterus, abdomen distended with ascites.', 2: 'Your skin is jaundiced and you have ascites from your cirrhosis.'}},
 '음주 부인 환자': {'word': 'drink', 'ko': '술을 마시다(음주)', 'sc': {0: 'Pt denies drinking EtOH; tremulous and diaphoretic on exam.'}},
 '불응성 금단 발작 중첩': {'word': 'status', 'ko': '발작 지속 상태',
    'sc': {1: 'Status epilepticus >5 min; lorazepam IV x2; airway maintained.'}},
 '금단+패혈증 감별': {'word': 'infection', 'ko': '감염',
    'sc': {1: "Febrile to 39.1 and tachycardic — suspect infection, can't rule out sepsis; cultures drawn.",
           2: "You may be septic from the infection, so we're pan-culturing you."}},
 '중증 금단 야간 급변 인계': {'word': 'benzo', 'ko': '벤조(벤조디아제핀)',
    'sc': {1: 'Benzo: lorazepam 2 mg IV x3 since 0200; CIWA 12 to 22.'}},
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
yaml.safe_dump(out, open(D + T + '.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
