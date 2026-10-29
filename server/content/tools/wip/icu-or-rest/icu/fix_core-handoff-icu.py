#!/usr/bin/env python3
"""core-handoff-icu 수정 — core-handoff-icu.pre-fix.yaml(+changes pre-fix 사본)을 읽어 core-handoff-icu.yaml과 changes-core-handoff-icu.yaml을 다시 만든다.
데이터: fix_core-handoff-icu_data_1(단어) _2(문장) _3(B 값: DK·BL·DC) _4(뉘앙스·order). 재실행해도 같은 결과."""
import yaml, copy, re
D = lambda n: yaml.safe_load(open(f'fix_core-handoff-icu_data_{n}.yaml'))
d = yaml.safe_load(open('core-handoff-icu.pre-fix.yaml'))
ch = yaml.safe_load(open('changes-core-handoff-icu.pre-fix.yaml'))
d1, d2, d3, d4 = D(1), D(2), D(3), D(4)
W = {w['id']: w for w in d['words']}
changes = ch['changes']

def endp(ko): return ko[-1] if ko[-1] in '.?' else ''
def add_change(sit_title, idx, fields, why):
    for c in changes:
        if c['kind'] == 'sentence' and c['situation'] == sit_title and c['index'] == idx:
            c['fields'] = sorted(set(c['fields']) | set(fields), key=lambda f: ['en','ko','chunks','words'].index(f))
            c['why'] = (c['why'] + ' / ' if c.get('why') else '') + why
            return
    changes.append({'kind': 'sentence', 'situation': sit_title, 'index': idx, 'fields': list(fields), 'why': why})

# --- 1. 단어
for wid, upd in d1['words'].items():
    W[wid].update(copy.deepcopy(upd))
d['words'] = [w for w in d['words'] if w['id'] not in d1['remove']]
for c in d1['changes']:
    if c['kind'] == 'word':   # 기존 같은 단어 항목이 있으면 합침
        ex = [x for x in changes if x['kind'] == 'word' and x['id'] == c['id']]
        if ex: ex[0]['fields'] = sorted(set(ex[0]['fields']) | set(c['fields'])); ex[0]['why'] += ' / ' + c['why']; continue
    changes.append(c)

# --- 2. 문장: B 값(DK·BL·DC) 먼저, 그다음 A 쪽 다시 쓰기
S = {f'{i}.{k}': (s, t) for i, s in enumerate(d['situations']) for k, t in enumerate(s['sentences'])}
for key, vals in d3['DK'].items():
    s, t = S[key]; e = endp(t['ko'])
    for i, v in enumerate(vals):
        if v is not None: t['distractorsKo'][i] = v + e
for key, b in d3['BL'].items():
    s, t = S[key]
    t['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in b['options']]}
for key, v in d3['DC'].items(): S[key][1]['decoy'] = v
for key, u in d2['sentences'].items():
    s, t = S[key]
    for f in ('en', 'ko', 'chunks', 'words', 'why', 'decoy'):
        if f in u: t[f] = u[f]
    if 'dk' in u: t['distractorsKo'] = [v + endp(t['ko']) for v in u['dk']]
    if 'blank' in u: t['blank'] = {'answer': u['blank']['answer'], 'options': [{'en': o} for o in u['blank']['options']]}
    if 'change' in u: add_change(s['title'], int(key.split('.')[1]), u['change'], u['why_change'])
# 정답 ko 끝 부호와 오답 끝 부호가 같은지 보장
for s in d['situations']:
    for t in s['sentences']:
        e = endp(t['ko'])
        t['distractorsKo'] = [x.rstrip('.?') + e for x in t['distractorsKo']]

# --- 3. 뉘앙스
for key, u in d4['nuance'].items():
    i, n = map(int, key.split('.')); x = d['situations'][i]['nuance'][n]
    for f, v in u.items():
        if f == 'scene3': x['scenes'][2] = v
        else: x[f] = v
# --- 4. order
for key, u in d4['order'].items():
    o = d['situations'][int(key)]['order']
    if 'why' in u: o['why'] = u['why']
    for grp in ('lines', 'line_edits'):
        for idx, v in u.get(grp, {}).items(): o['lines'][int(idx)].update(v)

# --- 되풀이 방지: changes 중 삭제된 단어 항목이 word 수정 항목과 겹치면 정리
removed = {c['id'] for c in changes if c['kind'] == 'word-remove'}
changes[:] = [c for c in changes if not (c['kind'] == 'word' and c['id'] in removed)]
yaml.safe_dump(d, open('core-handoff-icu.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
yaml.safe_dump({'theme': 'core-handoff-icu', 'changes': changes}, open('changes-core-handoff-icu.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
print('written; changes', len(changes))
