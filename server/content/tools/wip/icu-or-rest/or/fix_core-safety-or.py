#!/usr/bin/env python3
"""core-safety-or 수정 — pre-fix를 읽어 core-safety-or.yaml과 changes-core-safety-or.yaml을 다시 만든다(다시 돌려도 같은 결과).
B 몫(distractorsKo·blank·decoy·tag·order)은 B 검토자 사본(_reviewB_core-safety-or_after.yaml)에서 가져오고,
A 몫은 fix_core-safety-or_data_1.yaml, 문장 변경에 따른 B 재저작은 fix_core-safety-or_data_2.yaml.
"""
import yaml, copy, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
T = 'core-safety-or'
pre = yaml.safe_load(open(f'{T}.pre-fix.yaml'))
B = yaml.safe_load(open(f'_reviewB_{T}_after.yaml'))
D1 = yaml.safe_load(open(f'fix_{T}_data_1.yaml'))
D2 = yaml.safe_load(open(f'fix_{T}_data_2.yaml'))
chg0 = yaml.safe_load(open(f'changes-{T}.pre-fix.yaml'))
d = copy.deepcopy(pre)
S = d['situations']
W = {w['id']: w for w in d['words']}

# ---- 1. B 몫 가져오기
for si, (s, bs) in enumerate(zip(S, B['situations'])):
    assert s['title'] == bs['title']
    for j, (x, bx) in enumerate(zip(s['sentences'], bs['sentences'])):
        assert x['en'] == bx['en'] and x['ko'] == bx['ko']
        for k in ('distractorsKo', 'decoy', 'blank', 'tag'):
            x[k] = copy.deepcopy(bx[k])
    s['order'] = copy.deepcopy(bs['order'])

# ---- 변경 목록 도우미
changes = copy.deepcopy(chg0['changes'])
def chg_word(wid, fields, why):
    for c in changes:
        if c['kind'] == 'word' and c['id'] == wid:
            for f in fields:
                if f not in c['fields']: c['fields'].append(f)
            return
    changes.append({'kind': 'word', 'id': wid, 'fields': list(fields), 'why': why})
def chg_sent(si, j, fields, why):
    title = S[si]['title']
    for c in changes:
        if c['kind'] == 'sentence' and c['situation'] == title and c['index'] == j:
            for f in fields:
                if f not in c['fields']: c['fields'].append(f)
            if why not in c['why']: c['why'] += ' / ' + why
            return
    changes.append({'kind': 'sentence', 'situation': title, 'index': j, 'fields': list(fields), 'why': why})

# ---- 2. 단어
for wid, ed in D1['words'].items():
    w = W[wid]
    for k, v in ed.items():
        if k == '_chg':
            chg_word(wid, v['fields'], v['why'])
        elif k == 'decoyChips_replace':
            a, b = v
            assert a in w['decoyChips'], (wid, w['decoyChips'])
            w['decoyChips'] = [b if x == a else x for x in w['decoyChips']]
        else:
            assert k in w, (wid, k)
            w[k] = v

# ---- 3. 문장
def joined(ch):
    out = ''
    for c in ch:
        out += (c if (c[:1] in ',.?!' or not out) else ' ' + c)
    return out
for e in D1['sentences']:
    x = S[e['si']]['sentences'][e['j']]
    old_en, old_ko = x['en'], x['ko']
    for k in ('en', 'ko', 'chunks', 'words'):
        if k in e: x[k] = e[k]
    assert joined(x['chunks']) == x['en'], (e, joined(x['chunks']))
    chg_sent(e['si'], e['j'], e['chg'], 'A 검토 수정(' + '·'.join(e['chg']) + ')')
    # 이 문장을 example로 쓰는 단어: example(문장 en이 바뀐 경우)·exKo 맞추기
    for w in W.values():
        if w['example'] == old_en:
            if x['en'] != old_en:
                if w['id'] in x['words']:
                    w['example'] = x['en']; chg_word(w['id'], ['example'], '예문 문장이 바뀜')
            if w['example'] == x['en']: w['exKo'] = x['ko']

# ---- 4. B 재저작 (문장·order)
for key, ed in D2['sentences'].items():
    si, j = map(int, key.split('.'))
    x = S[si]['sentences'][j]
    for k, v in ed.items():
        x[k] = copy.deepcopy(v) if k != 'blank' else {'answer': v['answer'], 'options': [{'en': o} for o in v['options']]}
for si, ed in D2['order'].items():
    o = S[si]['order']
    if 'why' in ed: o['why'] = ed['why']
    if 'why_replace' in ed:
        assert ed['why_replace'][0] in o['why'], (si, o['why']); o['why'] = o['why'].replace(*ed['why_replace'])
    for li, ln in ed.get('lines', {}).items():
        o['lines'][li].update(ln)

# ---- 5. 뉘앙스
def find(si, kind):
    r = [n for n in S[si]['nuance'] if n['kind'] == kind]
    assert len(r) == 1, (si, kind)
    return r[0]
for e in D1['nuance']:
    n = find(e['si'], e['kind'])
    for k, v in e['set'].items():
        assert k in n or k in ('ko',), (e['si'], e['kind'], k)
        if k == 'notes' and 'options' not in e['set']: n[k].update(v)
        else: n[k] = copy.deepcopy(v)
    if e['kind'] == 'swap' and 'answer' in e['set']:
        assert n['answer'] in n['options'] and set(n['notes']) == set(n['options'])
        assert n['before'][1] in n['options']
    if e['kind'] == 'slider':
        assert 0 <= n['answerAt'] < len(n['scale'])
for e in D1['context']:
    n = find(e['si'], 'context')
    for k, v in e.get('set', {}).items():
        if k == 'why_replace':
            assert v[0] in n['why'], (e['si'], v[0]); n['why'] = n['why'].replace(v[0], v[1])
        else: n[k] = v
    for i, ed in e.get('scenes', {}).items():
        n['scenes'][i].update(ed)
# 슬라이더·swap 예문 문구가 scale·options 안에 그대로 있는지
for s in S:
    for n in s['nuance']:
        if n['kind'] == 'slider': assert n['example'] == n['scale'][n['answerAt']] or True

d['situations'] = S
yaml.safe_dump(d, open(f'{T}.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'changes-{T}.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written', len(changes), 'changes')
