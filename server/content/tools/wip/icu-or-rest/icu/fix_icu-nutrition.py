#!/usr/bin/env python3
# icu-nutrition 수정: pre-fix 원본 + data_1~4 + revB vals → icu-nutrition.yaml · changes-icu-nutrition.yaml (다시 돌려도 같은 결과)
import yaml, sys, copy, re
sys.path.insert(0, '.')
from revB_icu_nutrition_vals import KO, BLANK, DECOY, ICON, ORDER, WHY
T = 'icu-nutrition'
ld = lambda p: yaml.safe_load(open(p, encoding='utf-8'))
dump = lambda o, p: open(p, 'w', encoding='utf-8').write(yaml.safe_dump(o, allow_unicode=True, sort_keys=False, width=10**9))
d = ld(f'{T}.pre-fix.yaml')
base = ld(f'base-{T}.yaml')
old_ch = ld(f'changes-{T}.pre-fix.yaml')['changes']
D1, D2, D3, D4, D5 = [ld(f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3, 4, 5)]
sits = d['situations']
S = lambda k: sits[int(k.split('.')[0])]['sentences'][int(k.split('.')[1])]
old_en = {k: S(k)['en'] for k in D1}
old_ko = {k: S(k)['ko'] for k in D1}

# ── B (revB vals) — A가 새로 쓴 문장은 건너뜀
for k, (a, b, *_ ) in KO.items():
    if k in D1 and 'distractorsKo' in D1[k]: continue
    x = S(k); x['distractorsKo'] = [a if a is not None else x['distractorsKo'][0], b if b is not None else x['distractorsKo'][1]]
for k, (ans, opts, _) in BLANK.items():
    if k in D1 and 'blank' in D1[k]: continue
    x = S(k); x['blank'] = {'answer': ans or x['blank']['answer'], 'options': [{'en': o} for o in opts]}
for k, (v, *_ ) in DECOY.items():
    if k in D1 and 'decoy' in D1[k]: continue
    S(k)['decoy'] = v
for k, (old, new, _) in ICON.items():
    if k.startswith('S'):
        si, li = re.match(r'S(\d+)\.L(\d+)', k).groups(); l = sits[int(si)]['order']['lines'][int(li) - 1]
        assert l['icon'] == old; l['icon'] = new
    else:
        x = S(k); assert x['icon'] == old, k; x['icon'] = new
for k, v in WHY.items(): S(k)['why'] = v
for si, li, en, ko, _ in ORDER:
    sits[si]['order']['lines'][li - 1].update(en=en, ko=ko)

# ── A 문장
for k, v in D1.items():
    x = S(k)
    for f in ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'decoy', 'distractorsKo', 'blank'):
        if f in v:
            x[f] = {'answer': v[f]['answer'], 'options': [{'en': o} for o in v[f]['options']]} if f == 'blank' else v[f]
    if 'why_v46' in v: x['why'] = v['why_v46']
for k, w in D4['sentence_why'].items(): S(k)['why'] = w
for k, opts in D4['blank'].items():
    x = S(k); assert x['blank']['answer'] == opts[0]; x['blank']['options'] = [{'en': o} for o in opts]

# ── 단어
W = {w['id']: w for w in d['words']}
for i, e in D2['edits'].items():
    for f, v in e.items():
        if f != 'changes': W[i][f] = v
rm = set(D2['remove'])
d['words'] = [w for w in d['words'] if w['id'] not in rm]
for s in sits:
    for x in s['sentences']:
        x['words'] = [w for w in x['words'] if w not in rm]
if D2.get('tolerance_revert'):
    W['w-tolerance']['ko'] = [w for w in base['words'] if w['id'] == 'w-tolerance'][0]['ko']
W = {w['id']: w for w in d['words']}

# ── 예문 정리: 바뀐 문장을 예문으로 쓰던 단어는 새 문장으로, 태그가 빠졌으면 다른 태그 문장으로
FALLBACK = {'w-well': '2.4', 'w-bedside': '13.6'}
oldmap = {v: k for k, v in old_en.items()}
allsent = {x['en']: x for s in sits for x in s['sentences']}
for w in d['words']:
    ex = w['example']
    if ex in oldmap:
        k = oldmap[ex]
        key = k if w['id'] in S(k)['words'] else FALLBACK[w['id']]
        w['example'] = S(key)['en']
    if w['example'] not in allsent:
        raise SystemExit(f"예문이 문장에 없음: {w['id']} {w['example']}")
    w['exKo'] = allsent[w['example']]['ko']

# ── 뉘앙스
for key, v in D3.items():
    si, kind = key.split('.'); n = [n for n in sits[int(si)]['nuance'] if n['kind'] == kind][0]
    for f, val in v.get('set', {}).items():
        if f == 'why_append': n['why'] += val
        elif f == 'why_replace':
            assert val[0] in n['why']; n['why'] = n['why'].replace(*val)
        else: n[f] = val
    for j, sc in v.get('scenes', {}).items():
        n['scenes'][int(j)].update(sc)

# ── order(A 몫)
for l in D4['lines']:
    o = sits[l['sit']]['order']['lines'][l['line'] - 1]
    for f in ('en', 'ko'):
        if f in l: o[f] = l[f]
for si, why in D4['why'].items(): sits[si]['order']['why'] = why

for k, (idx, txt) in D5.items():
    x = S(k.rstrip('b')); x['distractorsKo'][idx] = txt
# 오답 ko 끝 문장부호를 정답 ko와 같게(vals는 마침표가 없다 — 마침표 유무가 답을 드러냄)
for s in sits:
    for x in s['sentences']:
        end = x['ko'][-1] if x['ko'][-1] in '.?!' else ''
        x['distractorsKo'] = [t.rstrip('.?!') + end for t in x['distractorsKo']]
dump(d, f'{T}.yaml')

# ── changes: base와 비교해 v44 필드 변경을 전부 다시 만든다(이유는 기존 항목 → 이번 수정 순)
WF = ['en', 'ko', 'ipa', 'icon', 'example']; SF = ['en', 'ko', 'chunks', 'words']
bw = {w['id']: w for w in base['words']}; cw = {w['id']: w for w in d['words']}
oldwhy = {}
for c in old_ch:
    oldwhy[(c['kind'], c.get('id') or (c['situation'], c['index']))] = c['why']
newwhy = {}
for k, v in D1.items():
    si, j = map(int, k.split('.')); newwhy[('sentence', (sits[si]['title'], j))] = v['why']
for i, why in D2['remove_why'].items(): newwhy[('word-remove', i)] = why
for sit_i, j in ((13, 5), (14, 5)): newwhy[('sentence', (sits[sit_i]['title'], j))] = 'w-get 삭제로 태그를 뺌 — 문장은 그대로'
for k in D1:
    si, j = map(int, k.split('.'))
    if 'words' in D1[k] and D1[k]['fields_changed'] and 'w-get' in [w for w in base['situations'][si]['sentences'][j]['words']]: newwhy[('sentence', (sits[si]['title'], j))] += ' (w-get 태그도 뺌)'
for i, e in D2['edits'].items():
    if 'changes' in e: newwhy[('word', i)] = e['changes']['why']
EXW = {'example': '예문을 바뀐 문장에 맞춤(또는 그 말이 태그된 다른 문장으로 옮김)'}
out = []
def add(kind, key, entry, fields_why):
    a, b = newwhy.get((kind, key)), oldwhy.get((kind, key))
    why = f'{a} / 이전: {b}' if a and b else (a or b or fields_why)
    entry['why'] = why; out.append(entry)
for i, w in cw.items():
    if i not in bw: add('word-add', i, {'kind': 'word-add', 'id': i}, '새 단어'); continue
    f = [k for k in WF if w[k] != bw[i][k]]
    if f: add('word', i, {'kind': 'word', 'id': i, 'fields': f}, '예문을 바뀐 문장에 맞춤(그 말이 태그된 문장으로)')
for i in bw:
    if i not in cw: add('word-remove', i, {'kind': 'word-remove', 'id': i}, '어느 문장도 태그하지 않게 됐다')
for s, t in zip(sits, base['situations']):
    for j, (x, y) in enumerate(zip(s['sentences'], t['sentences'])):
        f = [k for k in SF if x[k] != y[k]]
        if f: add('sentence', (s['title'], j), {'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': f}, '문장 수정')
# 기존 순서를 앞에 두고 새 항목은 뒤에
def keyof(c): return (c['kind'], c.get('id') or (c['situation'], c['index']))
order = {keyof(c): n for n, c in enumerate(old_ch)}
out.sort(key=lambda c: order.get(keyof(c), 10**6))
dump({'theme': T, 'changes': out}, f'changes-{T}.yaml')
print('changes', len(out), '(원본', len(old_ch), ')')
