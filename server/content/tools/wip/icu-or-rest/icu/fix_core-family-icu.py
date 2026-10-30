#!/usr/bin/env python3
"""core-family-icu 수정 — core-family-icu.pre-fix.yaml(+changes pre-fix 사본)을 읽어 core-family-icu.yaml과 changes-core-family-icu.yaml을 다시 만든다.
데이터: fix_core-family-icu_data_1(단어) _2(A 문장) _3(B 값) _4(뉘앙스·order). 재실행해도 같은 결과."""
import yaml, copy, sys
D = lambda n: yaml.safe_load(open(f'fix_core-family-icu_data_{n}.yaml'))
d = yaml.safe_load(open('core-family-icu.pre-fix.yaml'))
base = yaml.safe_load(open('base-core-family-icu.yaml'))
ch0 = yaml.safe_load(open('changes-core-family-icu.pre-fix.yaml'))['changes']
d1, d2, d3, d4 = D(1), D(2), D(3), D(4)
W = {w['id']: w for w in d['words']}
WEN = {}
for w in d['words']:
    WEN.setdefault(w['en'], []).append(w)
S = {f'{i}.{k}': (s, t) for i, s in enumerate(d['situations']) for k, t in enumerate(s['sentences'])}
OLD = {key: (t['en'], t['ko']) for key, (s, t) in S.items()}   # 고치기 전 en·ko
why_new = {}   # 변경 사유(새로 생긴 항목)

def endp(ko): return ko[-1] if ko[-1] in '.?' else ''
def fin(ko, v): return v.rstrip('.?') + endp(ko)

# --- 1. 단어
for en, pairs in d1['de_swap'].items():
    ws = WEN[en]
    assert len(ws) == 1, en
    de = ws[0]['distractorsEn']
    for old, new in pairs:
        assert old in de, (en, old, de)
        de[de.index(old)] = new
for wid, upd in d1['words'].items():
    W[wid].update(copy.deepcopy(upd))
for wid in d1['remove']:
    for s in d['situations']:
        for t in s['sentences']:
            if wid in t['words']: t['words'] = [x for x in t['words'] if x != wid]
        for x in s['nuance']:
            assert wid not in x['words']
d['words'] = [w for w in d['words'] if w['id'] not in d1['remove']]
W = {w['id']: w for w in d['words']}

# --- 2. B 값 (A가 건드리지 않는 문장)
for key, vals in d3['DK'].items():
    s, t = S[key]
    for i, v in enumerate(vals):
        if v is not None: t['distractorsKo'][i] = fin(t['ko'], v)
for key, o in d3['BL'].items():
    s, t = S[key]
    ans = o[0]
    import re
    assert len(re.findall(r'(?<![A-Za-z\'])' + re.escape(ans) + r'(?![A-Za-z\'])', t['en'])) == 1, (key, ans, t['en'])
    t['blank'] = {'answer': ans, 'options': [{'en': x} for x in o]}
for key, v in d3['DC'].items(): S[key][1]['decoy'] = v
for key, v in d3['WHY'].items(): S[key][1]['why'] = v

# --- 3. A 문장
for key, u in d2['sentences'].items():
    s, t = S[key]
    for f in ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy'):
        if f in u: t[f] = u[f]
    if 'dk' in u: t['distractorsKo'] = [fin(t['ko'], v) for v in u['dk']]
    if 'blank' in u: t['blank'] = {'answer': u['blank']['answer'], 'options': [{'en': x} for x in u['blank']['options']]}
    why_new[(s['title'], int(key.split('.')[1]))] = u['why_change'] if 'why_change' in u else None
# 정답 ko 끝 부호와 오답 끝 부호가 같은지 보장
for s in d['situations']:
    for t in s['sentences']:
        e = endp(t['ko'])
        t['distractorsKo'] = [x.rstrip('.?') + e for x in t['distractorsKo']]
        assert ''.join(' '.join(t['chunks']).replace(' ,', ',').replace(' .', '.').replace(' ?', '?').split()) == ''.join(t['en'].split()), t['en']

# --- 4. 문장 ko·en이 바뀐 것에 단어 example·exKo 맞춤(예문이 그 문장 그대로인 단어)
sync_log = []
for key, (s, t) in S.items():
    oen, oko = OLD[key]
    if (t['en'], t['ko']) == (oen, oko): continue
    for w in d['words']:
        if w['example'] == oen or w['example'] == t['en']:
            if w['example'] != t['en'] or w['exKo'] != t['ko']:
                sync_log.append((w['id'], w['example'], w['exKo'], '->', t['en'], t['ko']))
            w['example'], w['exKo'] = t['en'], t['ko']
# data_1에서 직접 정한 예문은 되돌려 덮기
for wid, upd in d1['words'].items():
    for f in ('example', 'exKo'):
        if f in upd: W[wid][f] = upd[f]

# --- 5. 뉘앙스
for key, u in d4['nuance'].items():
    i, n = map(int, key.split('.'))
    x = d['situations'][i]['nuance'][n]
    for f, v in u.items():
        if f == 'notes_set':
            x['notes'].update(v)
        elif f == 'scene_en':
            for k, val in v.items(): x['scenes'][int(k)]['en'] = val
        elif f == 'scene_fix':
            for k, val in v.items(): x['scenes'][int(k)]['fix'] = val
        else:
            x[f] = copy.deepcopy(v)
# --- 6. order
for key, u in d4['order'].items():
    o = d['situations'][int(key)]['order']
    if 'perm' in u: o['lines'] = [o['lines'][k] for k in u['perm']]
    if 'why' in u: o['why'] = u['why']
    for idx, v in u.get('lines', {}).items(): o['lines'][int(idx)].update(v)

# --- 7. 변경 목록: 정본(base)과 비교해 처음부터 다시 만든다(되돌린 항목은 빠진다)
V44W = ['en', 'ko', 'ipa', 'icon', 'example']
V44S = ['en', 'ko', 'chunks', 'words']
old_why = {}
for c in ch0:
    if c['kind'] == 'sentence': old_why[('s', c['situation'], c['index'])] = c['why']
    else: old_why[(c['kind'], c['id'])] = c['why']
BW = {w['id']: w for w in base['words']}
changes = []
for bid, bw in BW.items():
    if bid not in W:
        changes.append({'kind': 'word-remove', 'id': bid, 'why': old_why.get(('word-remove', bid)) or d1['why'].get(bid) or '너무 쉬움 — 어느 문장도 태그하지 않게 됐다'})
for wid, w in W.items():
    if wid in BW:
        f = [k for k in V44W if BW[wid].get(k) != w.get(k)]
        if f: changes.append({'kind': 'word', 'id': wid, 'fields': f, 'why': d1['why'].get(wid) or old_why.get(('word', wid)) or '수정'})
    else:
        sys.exit('새 단어: ' + wid)
for i, s in enumerate(d['situations']):
    bs = base['situations'][i]
    assert bs['title'] == s['title']
    for k, t in enumerate(s['sentences']):
        bt = bs['sentences'][k]
        f = [x for x in V44S if bt.get(x) != t.get(x)]
        if f:
            ow = old_why.get(('s', s['title'], k))
            nw = why_new.get((s['title'], k))
            why = ' / '.join(x for x in [ow, nw] if x) or '수정'
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': k, 'fields': f, 'why': why})

yaml.safe_dump(d, open('core-family-icu.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
yaml.safe_dump({'theme': 'core-family-icu', 'changes': changes}, open('changes-core-family-icu.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
print('written; changes', len(changes))
for x in sync_log: print('SYNC', x)
