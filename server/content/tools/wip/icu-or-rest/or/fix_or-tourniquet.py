#!/usr/bin/env python3
"""or-tourniquet 수정 — or-tourniquet.pre-fix.yaml(+changes-or-tourniquet.pre-fix.yaml)에
B 검토 사본(check_or-tourniquet_Brev)의 오답 값과 fix_or-tourniquet_data_1~3.yaml을 얹어
or-tourniquet.yaml · changes-or-tourniquet.yaml을 다시 만든다. 몇 번 돌려도 같은 결과(원본을 읽음)."""
import copy, json, os, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(HERE, n)
dump = lambda d: yaml.safe_dump(d, allow_unicode=True, sort_keys=False, width=1000)
load = lambda n: yaml.safe_load(open(P(n), encoding='utf-8'))

doc = load('or-tourniquet.pre-fix.yaml')
pre = copy.deepcopy(doc)
chg = load('changes-or-tourniquet.pre-fix.yaml')
brev = load('check_or-tourniquet_Brev/or-tourniquet.yaml')
d1, d2, d3 = (load(f'fix_or-tourniquet_data_{i}.yaml') for i in (1, 2, 3))
bank = {w['id']: w for w in doc['words']}
sit = doc['situations']
S = lambda key: sit[int(key.split('.')[0])]['sentences'][int(key.split('.')[1])]

# 1. B 검토 사본의 문장 오답 값(distractorsKo·blank·decoy) 전부
for si, (a, b) in enumerate(zip(sit, brev['situations'])):
    for x, y in zip(a['sentences'], b['sentences']):
        assert x['en'] == y['en']
        for k in ('distractorsKo', 'blank', 'decoy'):
            x[k] = copy.deepcopy(y[k])

# 2. A가 바꾸는 문장 + 그 문장의 v46 필드
for key, fields in d1['sentences'].items():
    s = S(key)
    for k, v in fields.items():
        if k == 'blank':
            v = {'answer': v['answer'], 'options': [{'en': o} for o in v['options']]}
        s[k] = v
for key, why in d1['sentence_why'].items():
    S(key)['why'] = why
for key, t in d1['sentence_tag'].items():
    S(key)['tag'] = t
for key, t in d1['sentence_icon'].items():
    S(key)['icon'] = t

# 3. 예문·번역을 문장에 맞춤(V17) — example이 문장 en이면 exKo를 그 ko로
sent_ko = {s['en']: s['ko'] for si in sit for s in si['sentences']}
old_sent = {(i, j): pre['situations'][i]['sentences'][j] for i, si in enumerate(sit) for j in range(len(si['sentences']))}
# 문장 en이 바뀐 곳의 옛 예문은 새 문장으로(w-field → 18.3, w-small은 아래서 11.2로)
for key in d1['sentences']:
    i, j = map(int, key.split('.'))
    o, n = pre['situations'][i]['sentences'][j], sit[i]['sentences'][j]
    if o['en'] != n['en']:
        for w in bank.values():
            if w.get('example') == o['en'] and w['id'] != 'w-small':
                w['example'] = n['en']
# w-small: 4.3이 넓은 커프로 바뀌었으니 예문은 11.2(남은 small 문장)로
bank['w-small']['example'] = 'We use the smallest appropriate cuff.'

# 4. 단어
for wid, f in d3['word_fields'].items():
    bank[wid].update(f)
for wid, f in d3['cues'].items():
    bank[wid]['cue'] = f
for wid, v in d3['distractorsEn'].items():
    bank[wid]['distractorsEn'] = v
for a in d3['word_add']:
    a = dict(a)
    after = a.pop('after')
    idx = [w['id'] for w in doc['words']].index(after) + 1
    # 필드 순서를 기존 단어와 같게
    keys = ['id', 'en', 'ipa', 'ko', 'icon', 'example', 'cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips', 'exKo']
    doc['words'].insert(idx, {k: a[k] for k in keys})
    bank[a['id']] = doc['words'][idx]
for w in doc['words']:
    if w['example'] in sent_ko:
        w['exKo'] = sent_ko[w['example']]

# 5. order
for oi, spec in d2['order'].items():
    o = sit[oi]['order']
    if 'why' in spec:
        o['why'] = spec['why']
    for li, line in spec.get('lines', {}).items():
        o['lines'][li].update(line)

# 6. 뉘앙스
for si, items in d2['nuance'].items():
    nu = sit[si]['nuance']
    for it in items:
        n = nu[it['at']]
        if 'replace' in it:
            nu[it['at']] = it['replace']
        if 'set' in it:
            n.update(it['set'])
        if 'set_swap_answer' in it:
            sw = it['set_swap_answer']
            n['options'] = [sw['new'] if o == sw['old'] else o for o in n['options']]
            n['notes'] = {(sw['new'] if k == sw['old'] else k): v for k, v in n['notes'].items()}
            n['answer'] = sw['new']
            n['ko'] = sw['ko']

# 7. 안전장치 — keyPhrase 문장의 en·chunks는 그대로여야 한다
inj = json.load(open(P('in-or-tourniquet.json'), encoding='utf-8'))
for si, (a, b) in enumerate(zip(pre['situations'], sit)):
    kp = set(k if isinstance(k, str) else k['en'] for k in inj['situations'][si]['keyPhrases'])
    for i, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        if x['en'] in kp:
            assert x['en'] == y['en'] and x['chunks'] == y['chunks'], f'keyPhrase {si}.{i} 의 en/chunks가 바뀜'

# 8. 변경 목록 — pre-fix와 비교해 v44 필드 변화를 적는다(같은 항목이 있으면 합침)
W_WHY = {
    'w-exsanguination': '한국 수술실 표준어는 구혈(Esmarch 구혈대) — 거혈에서 고침(검토 A D1)',
    'w-damage': '조직에는 훼손이라 하지 않음 — 손상(망가짐)으로(검토 A D2); w-injury와 서로의 오답이 아니라 정답 둘은 아님',
    'w-monitor': '문장 16.2·16.4와 cue·오답이 모두 명사 — 모니터(감시 화면)로(검토 A D3)',
    'w-small': '4.3이 넓은 커프로 바뀌어 예문을 남은 11.2로(검토 A S1)',
    'w-field': '18.3 문장을 바꿔 예문도 맞춤(검토 A S6)',
}
S_WHY = {
    '4.3': '가장 작은 커프는 사실과 반대 — AORN은 사지에 맞는 범위에서 가장 넓은 커프(낮은 압력으로 혈류 차단); w-small→w-wide(검토 A S1)',
    '13.3': '재팽창 시간이 반드시 짧아진다는 일반 규칙은 없음 — 집도의에게 묻는 문장으로(검토 A S2)',
    '15.3': '감압은 집도의가 정함 — 단정하던 명령을 결정을 묻는 문장으로(검토 A S3)',
    '15.4': '감압·진행 판단은 집도의 몫 — 단정을 묻는 문장으로(검토 A S4)',
    '9.4': '이중 커프 순서(원위 커프를 올린 뒤에 근위 커프를 내림 — 반대면 국소마취제가 전신으로)를 가르치도록(검토 A S5)',
    '18.3': '수술 영역은 커프보다 원위라 커프 아래 출혈은 장면이 맞지 않음 — 커프를 올렸는데도 영역 출혈로(검토 A S6)',
    '14.1': '표준어는 구혈(Esmarch 구혈대) — ko만(검토 A S7·D1)',
}
V44_W = ('id', 'en', 'ko', 'ipa', 'icon', 'example')
V44_S = ('en', 'ko', 'chunks', 'words', 'goal')
ents = chg['changes']
def find(kind, **kw):
    for e in ents:
        if e['kind'] == kind and all(e.get(k) == v for k, v in kw.items()):
            return e
def merge(kind, why, fields, **kw):
    e = find(kind, **kw)
    if e:
        e['fields'] = list(dict.fromkeys(e['fields'] + fields))
        if why not in e['why']:
            e['why'] += '; ' + why
    else:
        ents.append({'kind': kind, **kw, 'fields': fields, 'why': why})
new_add = []
pw = {w['id']: w for w in pre['words']}
for w in doc['words']:
    if w['id'] not in pw:
        ents.append({'kind': 'word-add', 'id': w['id'], 'why': '4.3을 가장 넓은 커프로 고치며 새 단어(검토 A S1) — 4.3에 태그, 예문 4.3'})
        continue
    diff = [k for k in V44_W if pw[w['id']].get(k) != w.get(k)]
    if diff:
        merge('word', W_WHY.get(w['id'], '예문의 문장을 바꿔 예문도 맞춤(검토 A 문장 수정)'), diff, id=w['id'])
for si, (a, b) in enumerate(zip(pre['situations'], sit)):
    for i, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        diff = [k for k in V44_S if x.get(k) != y.get(k)]
        if diff:
            merge('sentence', S_WHY[f'{si}.{i}'], diff, situation=b['title'], index=i)

# 9. 은행에서 태그 안 된 단어가 생기면 알린다(검사기 V3·고아 단어)
used = {w for si in sit for s in si['sentences'] for w in s['words']}
orph = [w['id'] for w in doc['words'] if w['id'] not in used]
if orph:
    print('태그되지 않은 단어:', orph)

open(P('or-tourniquet.yaml'), 'w', encoding='utf-8').write(dump(doc))
open(P('changes-or-tourniquet.yaml'), 'w', encoding='utf-8').write(dump(chg))
print('written; changes 총', len(ents), '(pre', len(load('changes-or-tourniquet.pre-fix.yaml')['changes']), ')')
