"""icu-mech-ventilation 수정 — pre-fix 파일을 읽어 제자리 파일과 변경 목록을 다시 만든다(몇 번이고 다시 돌려도 같다).
데이터: fix_icu-mech-ventilation_data_1.yaml(단어) / _2.yaml(문장) / _3.yaml(뉘앙스·order)
"""
import yaml, copy, re, sys
D = '/Users/yeom-yeon-ung/repository/forin/server/content/tools/wip/icu-or-rest/icu/'
T = 'icu-mech-ventilation'
SRC = D + T + '.pre-fix.yaml'
OUT = D + T + '.yaml'
CHG0 = D + 'changes-' + T + '.pre-fix.yaml'
CHG = D + 'changes-' + T + '.yaml'
dump = lambda o: yaml.safe_dump(o, allow_unicode=True, sort_keys=False, width=4096)
load = lambda p: yaml.safe_load(open(p, encoding='utf-8'))

doc = load(SRC)
orig = copy.deepcopy(doc)
d1, d2, d3 = (load(D + f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3))
bank = {w['id']: w for w in doc['words']}
sits = doc['situations']

def join(chunks):
    j = ''
    for c in chunks:
        j += c if (c[:1] in ',.?!' and j) else ((' ' if j else '') + c)
    return j

# ---- 단어 ----
for wid, upd in d1['words'].items():
    w = bank[wid]
    for k, v in upd.items():
        assert k in w, (wid, k)
        w[k] = v

# ---- 문장 ----
smap = {}   # 옛 en -> (새 en, 새 ko, 옛 ko)
for key, u in d2.items():
    si, idx = map(int, key.split('.'))
    s = sits[si]['sentences'][idx]
    assert s['en'].startswith(u['expect']), (key, s['en'], u['expect'])
    old_en, old_ko = s['en'], s['ko']
    keyphrase = idx < 3
    for k, v in u.items():
        if k == 'expect':
            continue
        if k in ('en', 'chunks') and keyphrase:
            raise SystemExit(f'{key}: keyPhrase의 en/chunks는 바꾸지 않는다')
        if k == 'words_remove':
            for wid in v:
                assert wid in s['words'], (key, wid)
                s['words'].remove(wid)
        elif k == 'dKo':
            assert len(v) == 2 and v[0] != v[1], key
            s['distractorsKo'] = list(v)
        elif k == 'blank':
            ans, opts = v['answer'], v['options']
            assert ans in opts and len(opts) == 4 and len(set(opts)) == 4, key
            assert len(re.findall(r'(?<![\w])' + re.escape(ans) + r'(?![\w])', s['en'])) == 1, (key, ans)
            s['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}
        elif k == 'chunks':
            s['chunks'] = list(v)
        else:
            assert k in s, (key, k)
            s[k] = v
    assert join(s['chunks']) == s['en'], (key, join(s['chunks']), s['en'])
    if s['decoy'] in s['en']:
        raise SystemExit(f'{key}: decoy가 en 안에 있다')
    if (s['en'], s['ko']) != (old_en, old_ko):
        smap[old_en] = (s['en'], s['ko'], old_ko)

# ---- D11-1 은행에서 삭제 ----
removed = d1['remove']
for sit in sits:
    for s in sit['sentences']:
        s['words'] = [x for x in s['words'] if x not in removed]
    for n in sit['nuance']:
        if 'words' in n:
            n['words'] = [x for x in n['words'] if x not in removed]
doc['words'] = [w for w in doc['words'] if w['id'] not in removed]
bank = {w['id']: w for w in doc['words']}

# ---- 뉘앙스 ----
for e in d3['nuance']:
    cand = [n for n in sits[e['si']]['nuance'] if n['kind'] == e['kind']]
    assert len(cand) == 1, (e['si'], e['kind'])
    n = cand[0]
    for k, v in e.get('set', {}).items():
        if k == 'why_append':
            n['why'] += v
        else:
            assert k in n, (e['si'], e['kind'], k)
            n[k] = v
    for k, (a, b) in e.get('replace', {}).items():
        assert a in n[k], (e['si'], k, a)
        n[k] = n[k].replace(a, b)
    if e['kind'] == 'context':
        assert len(n['scenes']) == 3 and sum(1 for sc in n['scenes'] if not sc['ok']) == 1
        for sc in n['scenes']:
            assert n['word'].lower() in sc['en'].lower(), (e['si'], sc['en'])
            assert ('fix' in sc) == (not sc['ok'])

# ---- order ----
for e in d3['order']:
    o = sits[e['si']]['order']
    if 'lines' in e:
        assert len(e['lines']) == 4
        o['lines'] = e['lines']
    else:
        ln = o['lines'][e['line']]
        for k, v in e['set'].items():
            assert k in ln, (e['si'], k)
            ln[k] = v
    if 'why' in e:
        o['why'] = e['why']
    if 'why_whole' in e:
        o['why'] = e['why_whole']
    if 'why_replace' in e:
        a, b = e['why_replace']
        assert a in o['why'], (e['si'], a)
        o['why'] = o['why'].replace(a, b)

# ---- 문장이 바뀌어 예문이 어긋난 단어 ----
for w in doc['words']:
    if w['example'] in smap:
        ne, nk, ok = smap[w['example']]
        w['example'], w['exKo'] = ne, nk
    else:
        for oe, (ne, nk, ok) in smap.items():
            if w['example'] == ne and w['exKo'] == ok:
                w['exKo'] = nk
# 새 문장에 단어가 없어진 예문은 같은 단어가 나오는 다른 문장으로
FALLBACK = {'w-sign': (11, 5), 'w-safe': (12, 1)}
for wid, (si, idx) in FALLBACK.items():
    s = sits[si]['sentences'][idx]
    assert wid in s['words'], (wid, si, idx)
    bank[wid]['example'], bank[wid]['exKo'] = s['en'], s['ko']
# 문장 ko만 바뀐 경우를 포함해, 같은 en을 예문으로 쓰는 단어의 exKo를 문장 ko와 맞춘다
en2ko = {s['en']: s['ko'] for sit in sits for s in sit['sentences']}
for w in doc['words']:
    if w['example'] in en2ko and w['exKo'] != en2ko[w['example']]:
        # 원래 예문 번역이 문장 ko와 같았던 단어만(다른 번역을 쓰던 단어는 건드리지 않는다)
        ow = next(x for x in orig['words'] if x['id'] == w['id'])
        old_ko = next((v[2] for v in smap.values() if v[0] == w['example']), None)
        if ow['exKo'] in {s['ko'] for sit in orig['situations'] for s in sit['sentences'] if s['en'] == w['example']}:
            w['exKo'] = en2ko[w['example']]
# nuance example(슬라이더)가 문장을 그대로 쓴 경우
for sit in sits:
    for n in sit['nuance']:
        if n.get('example') in smap:
            ne, nk, ok = smap[n['example']]
            n['example'], n['exKo'] = ne, nk
        elif n.get('example') in en2ko and n.get('exKo') != en2ko[n['example']]:
            osit = next(x for x in orig['situations'] if x['title'] == sit['title'])
            if any(s['en'] == n['example'] and s['ko'] == n['exKo'] for s in osit['sentences']):
                n['exKo'] = en2ko[n['example']]

open(OUT, 'w', encoding='utf-8').write(dump(doc))

# ---- changes: 고치기 전(orig)과 비교해 이어서 적는다 ----
chg = load(CHG0)
entries = chg['changes']
def find(kind, **kw):
    for e in entries:
        if e['kind'] == kind and all(e.get(k) == v for k, v in kw.items()):
            return e
def add(kind, why, fields=None, **kw):
    e = find(kind, **kw)
    if e is None:
        e = {'kind': kind, **kw}
        if fields is not None:
            e['fields'] = []
        e['why'] = why
        entries.append(e)
    else:
        if why not in e.get('why', ''):
            e['why'] = (e.get('why', '') + ' / ' + why) if e.get('why') else why
    for f in fields or []:
        if f not in e['fields']:
            e['fields'].append(f)
ow = {w['id']: w for w in orig['words']}
nw = {w['id']: w for w in doc['words']}
V44W = ['en', 'ko', 'ipa', 'icon', 'example']
WHY_W = {'en': '헤드워드를 문장 속 제 모습으로', 'ipa': '헤드워드에 맞춤', 'ko': 'ko를 문장 속 뜻에 맞게·겹치는 뜻 가르기(fix-icu-mech-ventilation-A)',
         'example': '예문으로 쓰던 문장이 바뀌거나 단어가 빠져 다른 문장으로', 'icon': '아이콘 정리'}
for wid, w in nw.items():
    ch = [k for k in V44W if w[k] != ow[wid][k]]
    if ch:
        add('word', '; '.join(WHY_W[k] for k in ch), ch, id=wid)
for wid in ow:
    if wid not in nw:
        add('word-remove', '너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됨(fix-icu-mech-ventilation-A D11-1)', id=wid)
for a, b in zip(orig['situations'], doc['situations']):
    for idx, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        ch = [k for k in ['en', 'ko', 'chunks', 'words'] if x[k] != y[k]]
        if ch:
            why = []
            if 'en' in ch or 'ko' in ch: why.append('틀리거나 부자연스러운 문장·ko 수정(검토 A)')
            if 'chunks' in ch: why.append('구 경계에서 다시 쪼갬')
            if 'words' in ch: why.append('쉬운·잘못 붙은 단어 태그 정리')
            add('sentence', ' / '.join(why), ch, situation=a['title'], index=idx)
open(CHG, 'w', encoding='utf-8').write(dump(chg))
print('applied; words', len(doc['words']), 'changes', len(entries))
