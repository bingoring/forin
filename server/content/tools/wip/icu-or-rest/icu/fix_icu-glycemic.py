#!/usr/bin/env python3
# icu-glycemic 수정 — icu-glycemic.pre-fix.yaml을 읽어 icu-glycemic.yaml과 changes-icu-glycemic.yaml을 다시 만든다.
import yaml, copy, sys
T = 'icu-glycemic'
def L(p): return yaml.safe_load(open(p, encoding='utf-8'))
d = L(f'{T}.pre-fix.yaml')
pre = copy.deepcopy(d)
D1 = L(f'fix_{T}_data_1.yaml')['sentences']
D2 = L(f'fix_{T}_data_2.yaml')
D3 = L(f'fix_{T}_data_3.yaml')
sits = d['situations']
def sent(k):
    i, j = map(int, k.split('.')); return sits[i]['sentences'][j]

# ---- 문장: 표(빈칸·decoy·distractorsKo) 먼저, 그 위에 개별 수정
for k, b in D3['blank'].items():
    s = sent(k)
    if b['answer'] != s['blank']['answer']:
        s['blank']['answer'] = b['answer']
    s['blank']['options'] = [{'en': x} for x in [b['answer']] + b['wrong']]
for k, v in D3['decoy'].items():
    sent(k)['decoy'] = v
for k, v in D3['dko'].items():
    i, x = k.rsplit('.', 1)
    sent(i)['distractorsKo'][int(x)] = v
for k, f in D1.items():
    s = sent(k)
    for key, val in f.items():
        if key == 'untag':
            s['words'] = [w for w in s['words'] if w not in val]
        elif key == 'dko':
            s['distractorsKo'] = val
        elif key == 'blank':
            s['blank']['answer'] = val['answer']
            s['blank']['options'] = [{'en': x} for x in [val['answer']] + val['wrong']]
        else:
            s[key] = val

# ---- 단어
W = {w['id']: w for w in d['words']}
for wid, f in D2['words'].items():
    for key, val in f.items():
        W[wid][key] = val
d['words'] = [w for w in d['words'] if w['id'] not in D2['remove_words']]
W = {w['id']: w for w in d['words']}

# ---- 예문 동기화 (문장 en/ko를 고치면 그 문장을 예문으로 쓰는 단어의 example·exKo)
pre_s = {}
for i, s in enumerate(pre['situations']):
    for j, x in enumerate(s['sentences']): pre_s[(i, j)] = x
for i, s in enumerate(sits):
    for j, x in enumerate(s['sentences']):
        o = pre_s[(i, j)]
        for w in d['words']:
            if w['example'] == o['en']:
                if x['en'] != o['en']:
                    w['example'] = x['en']; w['exKo'] = x['ko']
                elif x['ko'] != o['ko'] and w['exKo'] == o['ko']:
                    w['exKo'] = x['ko']
all_en = {x['en']: x['ko'] for s in sits for x in s['sentences']}
for w in d['words']:
    if w.get('exKo') == '@sync':
        w['exKo'] = all_en[w['example']]

# ---- 뉘앙스
for op in D2['nuance']:
    n = sits[op['s']]['nuance'][op['n']]
    for key, val in (op.get('set') or {}).items(): n[key] = val
    for si, f in (op.get('scene') or {}).items(): n['scenes'][int(si)].update(f)
# ---- order
for si, op in D2['order'].items():
    o = sits[int(si)]['order']
    if 'why' in op: o['why'] = op['why']
    for li, f in (op.get('lines') or {}).items(): o['lines'][int(li)].update(f)

yaml.safe_dump(d, open(f'{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)

# ---- 변경 목록 (v44 필드): 이전 변경 목록 + 이번에 바뀐 것
C = L(f'changes-{T}.pre-fix.yaml')
ch = C['changes']
idx = {}
for c in ch:
    key = (c['kind'], c.get('id') or (c.get('situation'), c.get('index')))
    idx[key] = c
def add(kind, ident, fields, why):
    key = (kind, ident)
    if key in idx:
        c = idx[key]
        if fields: c['fields'] = sorted(set(c.get('fields', [])) | set(fields), key=lambda x: (['en','ipa','ko','icon','example','chunks','words'].index(x) if x in ['en','ipa','ko','icon','example','chunks','words'] else 9))
        if why not in c['why']: c['why'] = c['why'] + ' / ' + why
    else:
        c = {'kind': kind}
        if kind == 'sentence': c['situation'], c['index'] = ident
        else: c['id'] = ident
        if fields: c['fields'] = fields
        c['why'] = why
        ch.append(c); idx[key] = c
pw = {w['id']: w for w in pre['words']}
nw = {w['id']: w for w in d['words']}
for wid in pw:
    if wid not in nw:
        add('word-remove', wid, None, '검토 반영 — 문장을 고쳐 어느 문장도 태그하지 않게 됐다')
        continue
    fl = [k for k in ('en', 'ipa', 'ko', 'icon', 'example') if pw[wid].get(k) != nw[wid].get(k)]
    if fl: add('word', wid, fl, D2.get('why_words', {}).get(wid, '검토 반영 — 문장을 고쳐 예문을 맞춘다'))
for i, s in enumerate(sits):
    for j, x in enumerate(s['sentences']):
        o = pre_s[(i, j)]
        fl = [k for k in ('en', 'ko', 'chunks', 'words') if o.get(k) != x.get(k)]
        if fl:
            if fl == ['words']: why = '태그 정리 — 문장 속 뜻이 단어 ko와 달라 태그를 뺀다'
            else: why = '검토 반영 — 문장 수정(안전·업무 범위·구 경계·자연스러움)'
            add('sentence', (s['title'], j), fl, why)
yaml.safe_dump({'theme': T, 'changes': ch}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print('written; changes', len(ch))
# 고아 단어 점검
used = {w for s in sits for x in s['sentences'] for w in x['words']}
print('orphans', [w['id'] for w in d['words'] if w['id'] not in used])
