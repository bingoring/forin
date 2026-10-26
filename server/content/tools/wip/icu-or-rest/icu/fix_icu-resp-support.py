import yaml, copy, re, sys
D = '/Users/yeom-yeon-ung/repository/forin/server/content/tools/wip/icu-or-rest/icu/'
PRE = D + 'icu-resp-support.pre-fix.yaml'      # 고치기 전 원본 (항상 이 파일을 읽는다 — 다시 돌릴 수 있다)
OUT = D + 'icu-resp-support.yaml'
CHG_PRE = D + 'changes-icu-resp-support.pre-fix.yaml'
CHG = D + 'changes-icu-resp-support.yaml'
dump = lambda o: yaml.safe_dump(o, allow_unicode=True, sort_keys=False, width=4096)
load = lambda p: yaml.safe_load(open(p, encoding='utf-8'))
doc = load(PRE)
orig = copy.deepcopy(doc)
d1, d2, d3 = (load(D + 'fix_icu-resp-support_data_%d.yaml' % i) for i in (1, 2, 3))
bank = {w['id']: w for w in doc['words']}
sits = doc['situations']

# ---- 단어 ----
for wid, upd in d1['words'].items():
    w = bank[wid]
    for k, v in upd.items():
        assert k in w, (wid, k)
        w[k] = v

# ---- 문장 ----
sentence_map = {}   # old en -> (new en, new ko, old ko)
for key, u in d2.items():
    si, idx = map(int, key.split('.'))
    s = sits[si]['sentences'][idx]
    assert s['en'].startswith(u['expect']), (key, s['en'], u['expect'])
    old_en, old_ko = s['en'], s['ko']
    for k, v in u.items():
        if k == 'expect':
            continue
        if k == 'words_remove':
            for wid in v:
                assert wid in s['words'], (key, wid)
                s['words'].remove(wid)
        elif k == 'dk':
            assert len(v) == 2 and v[0] != v[1], key
            s['distractorsKo'] = list(v)
        elif k == 'blank':
            ans, opts = v['answer'], v['options']
            assert ans in opts and len(opts) == 4 and len(set(opts)) == 4, key
            s['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}
        elif k == 'chunks':
            s['chunks'] = list(v)
        else:
            assert k in s, (key, k)
            s[k] = v
    if (s['en'], s['ko']) != (old_en, old_ko):
        sentence_map[old_en] = (s['en'], s['ko'], old_ko)
    j = ''
    for c in s['chunks']:
        j += c if (c[:1] in ',.?!' and j) else ((' ' if j else '') + c)
    assert j == s['en'], (key, j, s['en'])
    assert re.search(r'(?<![A-Za-z])%s(?![A-Za-z])' % re.escape(s['blank']['answer']), s['en']), (key, 'blank answer not in en')
    assert len(re.findall(r'(?<![A-Za-z])%s(?![A-Za-z])' % re.escape(s['blank']['answer']), s['en'])) == 1, (key, 'blank answer twice')

# ---- 쉬운 단어 제거(W11-1): 모든 문장 태그에서 ----
for wid in d1['remove']:
    for sit in sits:
        for s in sit['sentences']:
            if wid in s['words']:
                s['words'].remove(wid)
        for n in sit['nuance']:
            assert wid not in n.get('words', []), (wid, n['kind'])

doc['words'] = [w for w in doc['words'] if w['id'] not in d1['remove']]

# ---- 문장을 example로 쓰는 단어·뉘앙스 example 맞춤 ----
for w in doc['words']:
    if w['example'] in sentence_map:
        ne, nk, ok = sentence_map[w['example']]
        stem = w['en'].split()[-1].lower()[:4]
        assert stem in ne.lower(), ('example에 단어가 없음', w['id'], ne)
        w['example'], w['exKo'] = ne, nk
# 단어 수정 데이터가 exKo를 직접 준 경우(w-fit)는 위 매핑 뒤에도 같은 값이어야 한다
assert bank['w-fit']['exKo'] == d1['words']['w-fit']['exKo']
for sit in sits:
    for n in sit['nuance']:
        if n.get('example') in sentence_map:
            ne, nk, ok = sentence_map[n['example']]
            n['example'], n['exKo'] = ne, nk

# ---- 뉘앙스 ----
for u in d3['nuance']:
    n = sits[u['si']]['nuance'][u['ki']]
    assert n['kind'] == u['kind'], (u['si'], u['ki'], n['kind'])
    for k, v in u.get('set', {}).items():
        n[k] = v
    if 'scene2_fix' in u:
        bad = [sc for sc in n['scenes'] if sc['ok'] is False]
        assert len(bad) == 1
        bad[0]['fix'] = u['scene2_fix']

# ---- order ----
for u in d3['order']:
    o = sits[u['si']]['order']
    if 'lines' in u:
        assert len(u['lines']) == 4
        o['lines'] = u['lines']
    else:
        l = o['lines'][u['line']]
        for k in ('en', 'ko', 'note'):
            if k in u:
                l[k] = u[k]
    if 'why' in u:
        o['why'] = u['why']

open(OUT, 'w', encoding='utf-8').write(dump(doc))

# ---- changes 기록: 고치기 전(원본)과 비교해 바뀐 v44 필드를 전부 ----
chg = load(CHG_PRE)
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
    if fields:
        for f in fields:
            if f not in e['fields']:
                e['fields'].append(f)
    return e
# w-relief 의 예전 why는 더는 맞지 않는다
for e in entries:
    if e['kind'] == 'word' and e['id'] == 'w-relief':
        e['why'] = "ko를 증상 완화(숨이 편해짐)에 맞게 — comfort(편안함)와 겹치지 않으면서 '안도감'이라는 틀린 뜻도 피함(fix-icu-resp-support-A)"
ow = {w['id']: w for w in orig['words']}
nw = {w['id']: w for w in doc['words']}
V44W = ['en', 'ko', 'ipa', 'icon', 'example']
WHY_W = {'en': '헤드워드를 문장 속 제 모습(부사)으로', 'ipa': '헤드워드에 맞춤', 'ko': 'ko를 문장 속 뜻에 맞게(fix-icu-resp-support-A)',
         'example': '예문으로 쓰던 문장이 바뀌어 새 문장으로'}
for wid, w in nw.items():
    ch = [k for k in V44W if w[k] != ow[wid][k]]
    if ch:
        if wid != 'w-relief':
            add('word', '; '.join(WHY_W[k] for k in ch), ch, id=wid)
        else:
            e = find('word', id=wid)
            if 'ko' not in e['fields']:
                e['fields'].append('ko')
for wid in ow:
    if wid not in nw:
        add('word-remove', '너무 쉬움 — 어느 문장도 태그하지 않게 됨(공통 쉬운 단어 목록 · fix-icu-resp-support-A)', id=wid)
for si, (a, b) in enumerate(zip(orig['situations'], doc['situations'])):
    for idx, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        ch = [k for k in ['en', 'ko', 'chunks', 'words'] if x[k] != y[k]]
        if ch:
            why = []
            if 'en' in ch or 'ko' in ch: why.append('틀리거나 부자연스러운 문장 수정(검토 A)')
            if 'chunks' in ch: why.append('구 경계에서 다시 쪼갬')
            if 'words' in ch: why.append('쉬운·잘못 붙은 단어 태그 정리')
            add('sentence', ' / '.join(why), ch, situation=a['title'], index=idx)
open(CHG, 'w', encoding='utf-8').write(dump(chg))
print('applied; changes', len(entries))
