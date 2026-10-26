#!/usr/bin/env python3
"""icu-hemodynamics 수정 — pre-fix 파일을 읽어 data_1~3 을 적용하고 changes 를 다시 만든다(다시 돌려도 같은 결과)."""
import copy, os, sys, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(HERE, n)
T = 'icu-hemodynamics'
V44_W = ('en', 'ko', 'ipa', 'icon', 'example')
V44_S = ('en', 'ko', 'chunks', 'words', 'goal')


def load(n):
    with open(P(n), encoding='utf-8') as f:
        return yaml.safe_load(f)


doc = load(f'{T}.pre-fix.yaml')
d1, d2, d3 = load(f'fix_{T}_data_1.yaml'), load(f'fix_{T}_data_2.yaml'), load(f'fix_{T}_data_3.yaml')
base = load(f'base-{T}.yaml')
old_changes = load(f'changes-{T}.pre-fix.yaml')

sits = doc['situations']
sent_changed = {}      # (old_en) -> (new_en, new_ko)
sent_why = {}          # (title, idx) -> why

# ---------- 1. 문장 ----------
for it in d1:
    s = sits[it['sit'] - 1]
    x = s['sentences'][it['idx']]
    assert x['en'] == it['was'], (it['sit'], it['idx'], x['en'])
    st = it['set']
    if it['idx'] <= 2:
        assert 'en' not in st and 'chunks' not in st, f"keyPhrase {it['sit']}.{it['idx']} en/chunks 변경 금지"
    old_en, old_ko = x['en'], x['ko']
    for k, v in st.items():
        if k == 'blank':
            ans = v['answer']
            assert len(v['options']) == 4 and ans in v['options'] and len(set(v['options'])) == 4, v
            x['blank'] = {'answer': ans, 'options': [{'en': o} for o in v['options']]}
        else:
            x[k] = copy.deepcopy(v)
    if x['en'] != old_en or x['ko'] != old_ko:
        sent_changed[old_en] = (x['en'], x['ko'])
    if it.get('why_change'):
        sent_why[(s['title'], it['idx'])] = it['why_change']

# ---------- 2. 뉘앙스·order ----------
for it in d2['nuance']:
    s = sits[it['sit'] - 1]
    n = s['nuance'][it['i']]
    assert n['kind'] == it['kind'], (it['sit'], it['i'], n['kind'])
    for k, v in (it.get('set') or {}).items():
        if k == 'notes':
            n['notes'] = dict(v)
        else:
            n[k] = copy.deepcopy(v)
    for idx, patch in (it.get('scenes_patch') or {}).items():
        n['scenes'][idx].update(patch)
    for a, b in (it.get('options_replace') or {}).items():
        assert a in n['options']
        n['options'] = [b if o == a else o for o in n['options']]
    for a, b in (it.get('notes_rename') or {}).items():
        n['notes'] = {(b if k == a else k): v for k, v in n['notes'].items()}
    for k, v in (it.get('set_notes') or {}).items():
        n['notes'][k] = v
    if n['kind'] == 'swap':
        assert n['answer'] in n['options'] and set(n['notes']) == set(n['options']), (it['sit'], n['options'], list(n['notes']))
    if n['kind'] == 'slider':
        assert 0 <= n['answerAt'] < len(n['scale'])

for it in d2['order']:
    o = sits[it['sit'] - 1]['order']
    for k, v in (it.get('set') or {}).items():
        o[k] = v
    for idx, patch in (it.get('lines_patch') or {}).items():
        o['lines'][idx].update(patch)
    assert len(o['lines']) == 4

# ---------- 3. 단어 ----------
bank = {w['id']: w for w in doc['words']}
for wid, st in d3['words'].items():
    for k, v in st.items():
        bank[wid][k] = copy.deepcopy(v)
removed = set(d3['remove'])
doc['words'] = [w for w in doc['words'] if w['id'] not in removed]
for s in sits:
    for x in s['sentences']:
        x['words'] = [w for w in x['words'] if w not in removed]
    for n in s['nuance']:
        assert not (set(n.get('words') or []) & removed), n

# ---------- 4. 예문·번역 맞추기 (문장 en/ko를 쓰는 단어·뉘앙스) ----------
def sync(obj):
    ex = obj.get('example')
    if ex in sent_changed:
        obj['example'], obj['exKo'] = sent_changed[ex]
for w in doc['words']:
    sync(w)
for s in sits:
    for n in s['nuance']:
        sync(n)
# 문장 en은 그대로이고 ko만 바뀐 경우의 exKo는 위 sent_changed(키=en)로 이미 처리된다.

with open(P(f'{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=100000)

# ---------- 5. changes ----------
chg = copy.deepcopy(old_changes['changes'])
idx_of = {}
for i, c in enumerate(chg):
    if c['kind'] == 'word':
        idx_of[('word', c['id'])] = i
    elif c['kind'] == 'sentence':
        idx_of[('sentence', c['situation'], c['index'])] = i
    elif c['kind'] == 'word-remove':
        idx_of[('word-remove', c['id'])] = i


DEFAULT_WHY = {'words': '쉬운 단어 태그 빼기(w-blood·w-color·w-first, 수정 검토 W12)',
               'example': '예문으로 쓰던 문장이 고쳐져 단어 예문도 같이 바꿈'}


def upsert(key, entry, why_add):
    if why_add is None:
        fs = entry.get('fields', [])
        why_add = DEFAULT_WHY['words'] if fs == ['words'] else DEFAULT_WHY['example'] if 'example' in fs else '수정 검토 반영'
    if key in idx_of:
        c = chg[idx_of[key]]
        grew = [k for k in entry.get('fields', []) if k not in c['fields']]
        for k in grew:
            c['fields'].append(k)
        custom = why_add not in DEFAULT_WHY.values() and why_add != '수정 검토 반영'
        if (custom or grew) and why_add not in c['why']:
            c['why'] = c['why'] + ' / ' + why_add
    else:
        entry['why'] = why_add
        idx_of[key] = len(chg)
        chg.append(entry)


bw = {w['id']: w for w in base['words']}
nw = {w['id']: w for w in doc['words']}
for wid, w in nw.items():
    fields = [k for k in V44_W if bw[wid].get(k) != w.get(k)]
    if fields:
        key = ('word', wid)
        entry = {'kind': 'word', 'id': wid, 'fields': fields}
        upsert(key, entry, d3['change_why'].get(wid))
        if key in idx_of:
            c = chg[idx_of[key]]
            for k in fields:
                if k not in c['fields']:
                    c['fields'].append(k)
for wid in removed:
    if ('word-remove', wid) not in idx_of:
        upsert(('word-remove', wid), {'kind': 'word-remove', 'id': wid}, d3['remove_why'] + ' — 쉬운 말(수정 검토 W12)')
assert not (set(nw) - set(bw)), '새 단어는 만들지 않는다'

for bs, ns in zip(base['situations'], doc['situations']):
    assert bs['title'] == ns['title'] and len(bs['sentences']) == len(ns['sentences'])
    for i, (b, a) in enumerate(zip(bs['sentences'], ns['sentences'])):
        fields = [k for k in V44_S if b.get(k) != a.get(k)]
        if fields:
            key = ('sentence', bs['title'], i)
            entry = {'kind': 'sentence', 'situation': bs['title'], 'index': i, 'fields': fields}
            upsert(key, entry, sent_why.get((bs['title'], i)))
            c = chg[idx_of[key]]
            for k in fields:
                if k not in c['fields']:
                    c['fields'].append(k)

with open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': T, 'changes': chg}, f, allow_unicode=True, sort_keys=False, width=100000)
print('written; changes', len(chg))
