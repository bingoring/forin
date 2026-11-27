#!/usr/bin/env python3
"""or-minimally-invasive 수정 — pre-fix + B 사본의 B 필드 + A 데이터(data_1~3)를 얹어 or-minimally-invasive.yaml과 changes를 다시 만든다.
다시 돌려도 같은 결과(입력은 pre-fix·changes pre-fix·B 사본·data 파일뿐)."""
import yaml, copy, re, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
T = 'or-minimally-invasive'
LD = lambda p: yaml.safe_load(open(p, encoding='utf-8'))
pre = LD(f'{T}.pre-fix.yaml')
aft = LD(f'_reviewB_{T}_after.yaml')
d1, d2, d3 = (LD(f'fix_{T}_data_{n}.yaml') for n in (1, 2, 3))
out = copy.deepcopy(pre)
SIT = {s['title']: s for s in out['situations']}
W = {w['id']: w for w in out['words']}
def one(cond, msg):
    if not cond: sys.exit('ASSERT: ' + msg)

# 1) B 필드(distractorsKo·blank·decoy·order)를 B 사본에서 — 제목·en으로 맞춤
for sp, sa in zip(out['situations'], aft['situations']):
    one(sp['title'] == sa['title'] and len(sp['sentences']) == len(sa['sentences']), 'situation ' + sp['title'])
    for xp, xa in zip(sp['sentences'], sa['sentences']):
        one(xp['en'] == xa['en'], 'B en ' + xp['en'])
        for k in ('decoy', 'distractorsKo', 'blank'):
            xp[k] = copy.deepcopy(xa[k])
    sp['order'] = copy.deepcopy(sa['order'])

# 2) 문장(A) — 제목+순번+옛 en
oldmap = {}   # 옛 en -> (새 en, 새 ko, 옛 ko)
for e in d2['sentences']:
    sit = SIT[e['sit']]; x = sit['sentences'][e['i']]
    one(x['en'] == e['old_en'], f"{e['sit']}[{e['i']}] en {x['en']!r}")
    old_en, old_ko = x['en'], x['ko']
    s = copy.deepcopy(e['set'])
    if 'blank' in s:
        b = s['blank']; one(b['answer'] in b['options'] and len(set(b['options'])) == 4, 'blank ' + str(b))
        s['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in b['options']]}
    for k, v in s.items():
        one(k in x, 'unknown key ' + k); x[k] = v
    if x['en'] != old_en or x['ko'] != old_ko:
        oldmap[old_en] = (x['en'], x['ko'], old_ko, e['sit'], e['i'])
    e['_old_en'] = old_en; e['_old_ko'] = old_ko

# 3) 단어(A) — 값 덮기, 삭제, example 옮기기
for wid, upd in d1['words'].items():
    one(wid in W, wid)
    for k, v in upd.items(): one(k in W[wid], wid + '.' + k); W[wid][k] = v
ENKO = {x['en']: x['ko'] for s in out['situations'] for x in s['sentences']}
for wid, en in d1['example_from'].items():
    one(en in ENKO, 'example_from ' + en); W[wid]['example'] = en; W[wid]['exKo'] = ENKO[en]
for wid in d1['word_remove']:
    one(wid in W, wid)
out['words'] = [w for w in out['words'] if w['id'] not in d1['word_remove']]
for s in out['situations']:
    for x in s['sentences']:
        for r in d1['word_remove']: one(r not in x['words'], f'{r} still tagged in {x["en"]}')
    for n in s['nuance']:
        for r in d1['word_remove']: one(r not in n.get('words', []), f'{r} in nuance')

# 4) 예문 동기화(전수) — 바뀐 문장을 예문으로 쓰던 단어·slider
sync_log = []
def sync(obj, label):
    ex = obj.get('example')
    if ex in oldmap:
        nen, nko, oko, sit, i = oldmap[ex]
        if nen != ex:
            obj['example'] = nen
        obj['exKo'] = nko
        sync_log.append(f'{label}: {ex!r} -> {nen!r} / {nko}')
for w in out['words']: sync(w, w['id'])
for s in out['situations']:
    for n in s['nuance']:
        if n['kind'] == 'slider': sync(n, f'slider[{s["title"]}]')

# 5) 뉘앙스(A)
for e in d1['nuance']:
    s = SIT[e['sit']]; n = s['nuance'][e['n']]
    one(n['kind'] == e['kind'], f"nuance kind {e['sit']} {e['n']}")
    for k, v in e.get('set', {}).items():
        one(k in n, 'nuance key ' + k); n[k] = v
    if e['kind'] == 'swap':
        for old, new in e.get('rename_option', {}).items():
            one(old in n['options'] and old in n['notes'], 'rename ' + old)
            n['options'] = [new if o == old else o for o in n['options']]
            n['notes'] = {(new if k == old else k): v for k, v in n['notes'].items()}
            if n['answer'] == old: n['answer'] = new
        if 'set_answer' in e:
            one(e['set_answer'] in n['options'], 'answer'); n['answer'] = e['set_answer']
        for k, v in e.get('set_note', {}).items():
            one(k in n['notes'], 'note key ' + k); n['notes'][k] = v
        for k, v in e.get('notes', {}).items():
            one(k in n['notes'], 'note key ' + k); n['notes'][k] = v

# 6) order(A)
for e in d3['orders']:
    o = SIT[e['sit']]['order']
    for i, upd in e['lines'].items():
        for k, v in upd.items():
            one(k in o['lines'][i], 'order line key ' + k); o['lines'][i][k] = v
    if 'why' in e: o['why'] = e['why']
    for old, new in e.get('why_sub', []):
        one(o['why'].count(old) == 1, f'why_sub {old!r} in {e["sit"]}'); o['why'] = o['why'].replace(old, new)

# 7) 옛 문장 en·ko가 어디에 남았는지(옛 값 전수 찾기)
dump = yaml.safe_dump(out, allow_unicode=True, sort_keys=False, width=1000)
resid = []
for old_en, (nen, nko, oko, sit, i) in oldmap.items():
    if old_en != nen:
        c = dump.count(old_en)
        if c: resid.append(f'옛 en {old_en!r} ×{c}')
    if oko != nko:
        c = dump.count(oko)
        if c: resid.append(f'옛 ko {oko!r} ×{c}')
# 8) changes — pre-fix 목록 + 이번 v44 변경
chg_pre = LD(f'changes-{T}.pre-fix.yaml')
changes = copy.deepcopy(chg_pre['changes'])
cov_w, cov_s = {}, {}
for c in changes:
    if c['kind'] == 'word': cov_w.setdefault(c['id'], set()).update(c.get('fields') or [])
    if c['kind'] == 'sentence': cov_s.setdefault((c['situation'], c['index']), set()).update(c.get('fields') or [])
WHY = {'w-crepitus': '징후(염발음)와 병명(피하기종)을 섞음 — 피부 밑 공기로', 'w-support': "호흡 '지원'은 어색 — 보조하다(massive-transfusion과 같은 기준)",
       'w-open': 'ko 카드에 개복 뜻이 보이게 — 은행 문장 8개 중 5개가 개복', 'w-low': '7.2에서 태그를 뺐는데 example이 동사 lower 문장 그대로 — 태그 있는 문장(10.3)으로',
       'w-call': 'calls it은 결정하다(S11에서 태그를 뺌) — 호출 뜻 문장(15.4)으로'}
added = 0
V44W = ('en', 'ko', 'ipa', 'icon', 'example')
preW = {w['id']: w for w in pre['words']}
for w in out['words']:
    p = preW[w['id']]
    fl = [k for k in V44W if p.get(k) != w.get(k) and k not in cov_w.get(w['id'], set())]
    if fl:
        changes.append({'kind': 'word', 'id': w['id'], 'fields': fl, 'why': WHY.get(w['id'], '예문이 바뀐(또는 옮긴) 문장에 맞춤 — 문장 변경(A 검토)')}); added += 1
for r, why in d1['word_remove'].items():
    changes.append({'kind': 'word-remove', 'id': r, 'why': why}); added += 1
V44S = ('en', 'ko', 'chunks', 'words')
whymap = {(e['sit'], e['i']): e['why_change'] for e in d2['sentences']}
for sp, so in zip(pre['situations'], out['situations']):
    for i, (xp, xo) in enumerate(zip(sp['sentences'], so['sentences'])):
        fl = [k for k in V44S if xp[k] != xo[k] and k not in cov_s.get((sp['title'], i), set())]
        if fl:
            changes.append({'kind': 'sentence', 'situation': sp['title'], 'index': i, 'fields': fl, 'why': whymap[(sp['title'], i)]}); added += 1
with open(f'changes-{T}.yaml', 'w', encoding='utf-8') as f:
    f.write(yaml.safe_dump({'theme': T, 'changes': changes}, allow_unicode=True, sort_keys=False, width=1000))
with open(f'{T}.yaml', 'w', encoding='utf-8') as f:
    f.write(yaml.safe_dump(out, allow_unicode=True, sort_keys=False, width=1000))
print(f'changes: 기존 {len(chg_pre["changes"])} + 추가 {added} = {len(changes)}')
print('예문 동기화:'); [print('  ', x) for x in sync_log]
print('옛 값 잔존:', resid or '없음')
