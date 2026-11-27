# 다시 돌릴 수 있는 수정 스크립트: pre-fix(+B 사본의 B 몫)를 읽어 or-difficult-airway.yaml을 쓴다.
import yaml, os, copy
D = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(D, n)
d = yaml.safe_load(open(P('or-difficult-airway.pre-fix.yaml')))
after = yaml.safe_load(open(P('_reviewB_or-difficult-airway_after.yaml')))
d1 = yaml.safe_load(open(P('fix_or-difficult-airway_data_1.yaml')))
d2 = yaml.safe_load(open(P('fix_or-difficult-airway_data_2.yaml')))
S = d['situations']; W = {w['id']: w for w in d['words']}
changes = yaml.safe_load(open(P('changes-or-difficult-airway.pre-fix.yaml')))['changes']
def O(*xs): return [{'en': x} for x in xs]

# 1) B 몫: after 사본의 v46 필드를 가져온다(문장 위치 기준)
for si, s in enumerate(S):
    for i, x in enumerate(s['sentences']):
        a = after['situations'][si]['sentences'][i]
        for f in ('distractorsKo', 'blank', 'decoy', 'why'):
            x[f] = copy.deepcopy(a[f])
# order(B 6장)도 가져온다
for si in range(len(S)):
    S[si]['order'] = copy.deepcopy(after['situations'][si]['order'])

# 2) 문장 수정
oldnew = {}
for key, f in d1['sentences'].items():
    si, i = map(int, key.split('.')); x = S[si]['sentences'][i]; old = x['en']; fields = []
    if 'en' in f: x['en'] = f['en']; fields.append('en')
    if 'ko' in f: x['ko'] = f['ko']; fields.append('ko')
    if 'chunks' in f: x['chunks'] = f['chunks']; fields.append('chunks')
    if 'words' in f: x['words'] = f['words']; fields.append('words')
    for k in ('tag', 'why', 'decoy'):
        if k in f: x[k] = f[k]
    if 'dk' in f: x['distractorsKo'] = f['dk']
    if 'blank' in f: x['blank'] = {'answer': f['blank'][0], 'options': O(*f['blank'][1])}
    if 'en' in f or 'ko' in f: oldnew[old] = (x['en'], x['ko'])
    if fields:
        changes.append({'kind': 'sentence', 'situation': S[si]['title'], 'index': i, 'fields': fields,
                        'why': '검토 목록 반영(간호사 업무 범위·사실·구 경계·번역투)'})
for key, add in d1['why_append'].items():
    si, i = map(int, key.split('.')); S[si]['sentences'][i]['why'] += add

# 3) 단어
for wid in d2['remove_words']:
    for s in S:
        for x in s['sentences']:
            if wid in x['words']: x['words'].remove(wid)
    d['words'] = [w for w in d['words'] if w['id'] != wid]
    changes.append({'kind': 'word-remove', 'id': wid, 'why': '쉬운 말에 억지 ko를 붙인 단어 — 결정 11로 제거'})
W = {w['id']: w for w in d['words']}
for wid, f in d2['words'].items():
    w = W[wid]; flds = []
    for k, v in f.items():
        if w.get(k) != v: w[k] = v; flds.append(k)
    changes.append({'kind': 'word', 'id': wid, 'fields': flds,
                    'why': {'w-away': 'away의 ko(곧바로)는 right away 전체의 뜻 — 헤드워드를 right away로', 'w-got': 'cue의 시제가 사실과 다름',
                            'w-tracheal': 'cue가 ko를 되풀이함', 'w-factor': 'decoy fat이 비만 장면 옆에서 체형 비하로 읽힘'}[wid]})
# 단어 예문·exKo를 바뀐 문장에 맞춘다
for w in d['words']:
    if w['example'] in oldnew:
        w['example'], w['exKo'] = oldnew[w['example']]
# 바뀐 예문 문장이 그 단어를 더는 태그하지 않으면 태그된 다른 문장으로 옮긴다
sent_by_en = {x['en']: x for s in S for x in s['sentences']}
for w in d['words']:
    if w['example'] in [v[0] for v in oldnew.values()]:
        x = sent_by_en[w['example']]
        if w['id'] not in x['words']:
            alt = [y for s in S for y in s['sentences'] if w['id'] in y['words']]
            w['example'], w['exKo'] = alt[-1]['en'], alt[-1]['ko']
# 문장 en이 아직 그대로인데 ko만 바뀐 문장(keyPhrase ko)
for s in S:
    for x in s['sentences']:
        for w in d['words']:
            if w['example'] == x['en']: w['exKo'] = x['ko']

# 예문이 바뀐 단어·태그에서 빠진 단어를 changes에 적고, 예문이 태그된 문장에 없으면 태그된 문장으로 옮긴다
pre = yaml.safe_load(open(P('or-difficult-airway.pre-fix.yaml')))
preW = {w['id']: w for w in pre['words']}
# 태그가 빠진 문장(단어 제거)도 changes에 적는다
for s in S:
    for i, x in enumerate(s['sentences']):
        pw0 = next(y for y in pre['situations'] if y['title'] == s['title'])['sentences'][i]
        if pw0['words'] != x['words'] and not any(c['kind']=='sentence' and c['situation']==s['title'] and c['index']==i and 'words' in c['fields'] for c in changes):
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': i, 'fields': ['words'], 'why': '제거한 단어(결정 11)를 태그에서 뺌'})
for w in d['words']:
    pw = preW[w['id']]
    if w['example'] != pw['example'] or w['exKo'] != pw['exKo']:
        if w['id'] not in W or True:
            ex = [c for c in changes if c['kind'] == 'word' and c['id'] == w['id']]
            if ex: 
                for f in ('example', 'exKo'):
                    if f not in ex[0]['fields']: ex[0]['fields'].append(f)
            else:
                changes.append({'kind': 'word', 'id': w['id'], 'fields': ['example', 'exKo'], 'why': '예문 문장이 고쳐져 예문·exKo를 새 문장에 맞춤'})
# 4) 뉘앙스
def nz(si, kind): return next(n for n in S[si]['nuance'] if n['kind'] == kind)
for k, f in d2['slider'].items():
    n = nz(int(k), 'slider')
    if 'scale2' in f: n['scale'][2] = f['scale2']
    for kk in ('why', 'cue', 'scale', 'answerAt'):
        if kk in f: n[kk] = f[kk]
for k, f in d2['swap'].items():
    n = nz(int(k), 'swap')
    if k == '1':
        n['before'][0] = f['before0']; n['options'] = f['options']; n['answer'] = f['answer']
        n['notes'] = {(f['answer'] if kk == f['note_old'] else kk): v for kk, v in n['notes'].items()}
    elif k == '2' or k == '4': n['ko'] = f['ko']
    else:
        if 'before' in f: n['before'] = f['before']
        if 'options' in f: n['options'] = f['options']
        if 'answer' in f: n['answer'] = f['answer']
        if 'notes' in f:
            n['notes'] = {(kk if kk in f['notes'] else 'someone can come by when they\'re free' if kk.startswith('could someone') else kk): (f['notes'].get(kk, v)) for kk, v in n['notes'].items()} if k == '15' else f['notes']
for k, f in d2['context'].items():
    n = nz(int(k), 'context'); next(sc for sc in n['scenes'] if not sc['ok'])['fix'] = f['fix']

# 5) order
for k, f in d2['order'].items():
    o = S[int(k)]['order']
    for idx, v in f.items():
        if idx == 'why': o['why'] = v
        else: o['lines'][idx].update(v)

yaml.safe_dump(d, open(P('or-difficult-airway.yaml'), 'w'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': 'or-difficult-airway', 'changes': changes}, open(P('changes-or-difficult-airway.yaml'), 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('ok', len(changes))
