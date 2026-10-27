#!/usr/bin/env python3
"""icu-aki-crrt 수정 — fix-icu-aki-crrt-A·B 반영. icu-aki-crrt.pre-fix.yaml을 읽어 icu-aki-crrt.yaml을 만든다(다시 돌려도 같은 결과)."""
import yaml, copy, os, shutil, re
D = os.path.dirname(os.path.abspath(__file__)) + '/'
T = 'icu-aki-crrt'
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
d1, d2, d3 = (load(D + f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3))
bank = {w['id']: w for w in doc['words']}
sits = doc['situations']

# ---- 단어 ----
for wid, upd in d1['words'].items():
    w = bank[wid]
    for k, v in upd.items():
        assert k in w, (wid, k)
        w[k] = v

# ---- 문장 ----
sent_map = {}   # old en -> (new en, new ko)
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
        elif k == 'blank':
            assert v['answer'] in v['options'] and len(v['options']) == 4, key
            s['blank'] = {'answer': v['answer'], 'options': [{'en': o} for o in v['options']]}
        else:
            assert k in s, (key, k)
            s[k] = v
    assert joined(s['chunks']) == s['en'], (key, joined(s['chunks']), s['en'])
    assert s['decoy'] not in s['chunks'], key
    if (s['en'], s['ko']) != (old_en, old_ko):
        sent_map[old_en] = (s['en'], s['ko'])

# 문장을 예문으로 쓰는 단어: example·exKo 맞춤
def en_in(wen, sentence):
    return re.sub(r'[^a-z ]', '', wen.lower()).split()[0][:4] in sentence.lower()
flag = []
for w in doc['words']:
    if w['id'] in d1['words'] and 'example' in d1['words'][w['id']]:
        continue
    if w['example'] in sent_map:
        ne, nk = sent_map[w['example']]
        old_ex = w['example']
        w['example'], w['exKo'] = ne, nk
        if ne != old_ex and not en_in(w['en'], ne):
            flag.append(w['id'])
for wid in flag:
    w = bank[wid]
    # 이 단어를 태그한 다른 문장(바뀌지 않은 것 우선)을 예문으로
    cand = [s for sit in sits for s in sit['sentences'] if wid in s['words'] and s['en'] != w['example']]
    assert cand, wid
    c = cand[0]
    print('example 교체', wid, '->', c['en'])
    w['example'], w['exKo'] = c['en'], c['ko']
# exKo만 어긋난 경우(ko만 바꾼 문장은 위에서 처리됨). 문장 en==example이면 exKo=ko인지
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
        assert a in n['why'], key
        n['why'] = n['why'].replace(a, b)
    if 'scene_fix' in u:
        i, fx = u['scene_fix']
        assert n['scenes'][i]['ok'] is False
        n['scenes'][i]['fix'] = fx
# ---- order ----
for key, u in d3['order'].items():
    o = sits[int(key)]['order']
    for li, upd in u.get('lines', {}).items():
        o['lines'][li].update(upd)
    if 'why' in u:
        o['why'] = u['why']
# slider 5개 이상 정답 칸 편향은 건드리지 않음.

# ---- 단어가 어느 문장에도 안 쓰이면 안 됨 / words 존재 ----
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
entries[:] = [e for e in entries if not (e['kind'] == 'word' and e['id'] == 'w-realistic')]  # base가 이미 realistically
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
WHY_W = {'en': '헤드워드를 문장 속 제 모습으로(검토 A 결정 11)', 'ipa': '헤드워드에 맞춤', 'ko': 'ko를 문장 속 뜻에 맞게(검토 A 결정 11)',
         'icon': '아이콘', 'example': '예문으로 쓰던 문장이 바뀌거나 쓰임이 맞지 않아 새 문장으로'}
for w in doc['words']:
    ch = [k for k in V44W if w[k] != ow[w['id']][k]]
    if ch:
        add('word', '; '.join(WHY_W[k] for k in ch), ch, id=w['id'])
for si, (a, b) in enumerate(zip(orig['situations'], doc['situations'])):
    for idx, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        ch = [k for k in ['en', 'ko', 'chunks', 'words'] if x[k] != y[k]]
        if ch:
            why = []
            if 'en' in ch: why.append('사실·안전·자연스러움 문제로 문장 수정(검토 A·B)')
            elif 'ko' in ch: why.append('ko를 en에 맞게 고침(검토 A)')
            if 'chunks' in ch and 'en' not in ch: why.append('구 경계에서 다시 쪼갬(검토 A)')
            if 'words' in ch and 'en' not in ch: why.append('태그 정리')
            add('sentence', ' / '.join(why), ch, situation=a['title'], index=idx)
open(CHG, 'w', encoding='utf-8').write(dump(chg))
print('applied; changes', len(entries))
