#!/usr/bin/env python3
"""icu-sepsis 수정 — fix-icu-sepsis-A·B 반영. icu-sepsis.pre-fix.yaml을 읽어 icu-sepsis.yaml을 만든다(다시 돌려도 같은 결과)."""
import yaml, copy, os, shutil, re
D = os.path.dirname(os.path.abspath(__file__)) + '/'
T = 'icu-sepsis'
SRC = D + T + '.pre-fix.yaml'
OUT = D + T + '.yaml'
CHG = D + 'changes-' + T + '.yaml'
CHG0 = D + 'fix_' + T + '_changes_orig.yaml'
dump = lambda o: yaml.safe_dump(o, allow_unicode=True, sort_keys=False, width=4096)
load = lambda p: yaml.safe_load(open(p, encoding='utf-8'))
if not os.path.exists(CHG0):
    shutil.copy(CHG, CHG0)
doc = load(SRC)
orig = copy.deepcopy(doc)
d1, d2, d3, d4 = (load(D + f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3, 4))
bank = {w['id']: w for w in doc['words']}
sits = doc['situations']

# ---- 단어 ----
for wid, upd in d1['words'].items():
    w = bank[wid]
    for k, v in upd.items():
        assert k in w, (wid, k)
        w[k] = v

# ---- 문장 ----
sent_map = {}
def joined(ch):
    j = ''
    for c in ch:
        j += c if (c[:1] in ',.?!' and j) else ((' ' if j else '') + c)
    return j
for key, u in d2.items():
    si, idx = map(int, key.split('.'))
    s = sits[si]['sentences'][idx]
    assert s['en'].startswith(u['expect']), (key, s['en'])
    old_en, old_ko = s['en'], s['ko']
    for k, v in u.items():
        if k == 'expect':
            continue
        elif k == 'dk':
            assert len(v) == 2, key
            for i in (0, 1):
                if v[i] is not None:
                    s['distractorsKo'][i] = v[i]
        elif k == 'words_remove':
            for wid in v:
                assert wid in s['words'], (key, wid)
                s['words'].remove(wid)
        else:
            assert k in s, (key, k)
            s[k] = v
    assert joined(s['chunks']) == s['en'], (key, joined(s['chunks']), s['en'])
    assert s['decoy'] not in s['chunks'], key
    if (s['en'], s['ko']) != (old_en, old_ko):
        sent_map[old_en] = (s['en'], s['ko'])

# ---- 빈칸 선택지 (검토 B 표 D·E) ----
for key, r in d4['blanks'].items():
    si, idx = map(int, key.split('.'))
    s = sits[si]['sentences'][idx]
    old = [o['en'] for o in s['blank']['options']]
    ans = r['answer']
    assert len(re.findall(r'\b' + re.escape(ans) + r'\b', s['en'])) == 1, (key, ans, s['en'])
    pos = old.index(s['blank']['answer']) if not r['moved'] else (si + idx) % 4
    opts = list(r['wrong'])
    opts.insert(pos, ans)
    assert len(set(opts)) == 4, (key, opts)
    s['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}

# ---- 삭제 단어 ----
for wid in d1['remove']:
    assert not any(wid in s['words'] for sit in sits for s in sit['sentences']), wid
    assert not any(wid in n['words'] for sit in sits for n in sit['nuance']), wid
    doc['words'] = [w for w in doc['words'] if w['id'] != wid]
bank = {w['id']: w for w in doc['words']}

# 문장을 예문으로 쓰는 단어: example·exKo 맞춤
def en_in(wen, sentence):
    return re.sub(r'[^a-z ]', '', wen.lower()).split()[0][:3] in sentence.lower()
flag = []
for w in doc['words']:
    if w['example'] in sent_map:
        ne, nk = sent_map[w['example']]
        old_ex = w['example']
        w['example'], w['exKo'] = ne, nk
        if ne != old_ex and not en_in(w['en'], ne):
            flag.append(w['id'])
for wid in flag:
    w = bank[wid]
    cand = [s for sit in sits for s in sit['sentences'] if wid in s['words'] and s['en'] != w['example']]
    assert cand, wid
    c = cand[0]
    print('example 교체', wid, '->', c['en'])
    w['example'], w['exKo'] = c['en'], c['ko']
allsent = {s['en']: s for sit in sits for s in sit['sentences']}
for w in doc['words']:
    if w['example'] in allsent and w['exKo'] != allsent[w['example']]['ko']:
        print('exKo 어긋남', w['id'], w['exKo'], '|', allsent[w['example']]['ko'])

# ---- 뉘앙스 ----
for key, u in d3['nuance'].items():
    si, ki = map(int, key.split('.'))
    n = sits[si]['nuance'][ki]
    assert n['kind'] == u['kind'], (key, n['kind'])
    for k, v in u.get('set', {}).items():
        assert k in n, (key, k)
        n[k] = v
    if 'why_replace' in u:
        a, b = u['why_replace']
        assert a in n['why'], (key, a)
        n['why'] = n['why'].replace(a, b)
    if 'scene_fix' in u:
        i, fx = u['scene_fix']
        assert n['scenes'][i]['ok'] is False
        n['scenes'][i]['fix'] = fx
    if 'swap_option' in u:
        a, b = u['swap_option']
        n['options'] = [b if o == a else o for o in n['options']]
        assert n['answer'] == a
        n['answer'] = b
        n['notes'] = {(b if k == a else k): v for k, v in n['notes'].items()}
        assert b in n['options'] and b in n['notes']
# ---- order ----
for key, u in d3['order'].items():
    o = sits[int(key)]['order']
    for li, upd in u.get('lines', {}).items():
        o['lines'][li].update(upd)
    for f in ('ko', 'why'):
        if f in u:
            o[f] = u[f]
    if 'why_replace' in u:
        a, b = u['why_replace']
        assert a in o['why'], key
        o['why'] = o['why'].replace(a, b)

used = set()
for sit in sits:
    for s in sit['sentences']:
        for wid in s['words']:
            assert wid in bank, wid
            used.add(wid)
print('안 쓰는 단어:', [i for i in bank if i not in used])

open(OUT, 'w', encoding='utf-8').write(dump(doc))

# ---- changes 자동 기록 ----
chg = load(CHG0)
entries = chg['changes']
gone = set(d1['remove'])
entries[:] = [e for e in entries if not (e['kind'] == 'word' and e.get('id') in gone)]
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
V44W = ['en', 'ko', 'ipa', 'icon', 'example']
WHY_W = {'en': '헤드워드 정리', 'ipa': '헤드워드에 맞춤', 'ko': 'ko를 문장 속 뜻에 맞게(검토 A 결정 11)',
         'icon': '아이콘', 'example': '예문으로 쓰던 문장이 바뀌어 새 문장으로'}
for w in doc['words']:
    ch = [k for k in V44W if w[k] != ow[w['id']][k]]
    if ch:
        add('word', '; '.join(WHY_W[k] for k in ch), ch, id=w['id'])
for wid in d1['remove']:
    add('word-remove', {'w-therapy': '17.2의 therapy는 부서(호흡치료팀)라 가르칠 단어가 아님 — 태그를 뺐다',
                        'w-fully': '9.4 문장 수정으로 어느 문장도 태그하지 않게 됐다',
                        'w-effect': '9.4 문장 수정으로 어느 문장도 태그하지 않게 됐다'}[wid], id=wid)
for si, (a, b) in enumerate(zip(orig['situations'], doc['situations'])):
    for idx, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        ch = [k for k in ['en', 'ko', 'chunks', 'words'] if x[k] != y[k]]
        if ch:
            why = []
            if 'en' in ch: why.append('사실·안전·약속 문제로 문장 수정(검토 A)')
            elif 'ko' in ch: why.append('ko를 en에 맞게 고침(검토 A)')
            if 'chunks' in ch and 'en' not in ch: why.append('구 경계에서 다시 쪼갬(검토 A)')
            if 'words' in ch: why.append('태그 정리')
            add('sentence', ' / '.join(why), ch, situation=a['title'], index=idx)
open(CHG, 'w', encoding='utf-8').write(dump(chg))
print('applied; changes', len(entries))
