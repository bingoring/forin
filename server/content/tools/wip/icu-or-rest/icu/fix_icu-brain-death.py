#!/usr/bin/env python3
"""icu-brain-death 검토 A·B 반영. icu-brain-death.pre-fix.yaml(+changes-icu-brain-death.pre-fix.yaml)을 읽어
icu-brain-death.yaml / changes-icu-brain-death.yaml 을 다시 만든다. 다시 돌려도 같은 결과."""
import copy, os, re, sys, json
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
def P(n): return os.path.join(HERE, n)
def load(n): return yaml.safe_load(open(P(n), encoding='utf-8'))

doc = load('icu-brain-death.pre-fix.yaml')
pre = copy.deepcopy(doc)
chg_doc = load('changes-icu-brain-death.pre-fix.yaml')
W = {w['id']: w for w in doc['words']}
SIT = doc['situations']
IN = json.load(open(P('in-icu-brain-death.json'), encoding='utf-8'))
KEY = {s['title']: set(s.get('keyPhrases') or []) for s in IN['situations']}
SIT_KEY = [KEY[s['title']] for s in SIT]

# ---------- B 검토 새 값(그대로 읽어 넣음) ----------
ns = {}
exec(open(P('revB_icu-brain-death_vals.py'), encoding='utf-8').read(), ns)
DK, BLANK, DECOY, ICON, WHYB = ns['DK'], ns['BLANK'], ns['DECOY'], ns['ICON'], ns['WHY']
for si, s in enumerate(SIT):
    for j, x in enumerate(s['sentences']):
        k = f'{si}.{j}'
        if k in DK:
            x['distractorsKo'] = [a if a is not None else b for a, b in zip(DK[k], x['distractorsKo'])]
        if k in BLANK:
            b = BLANK[k]
            x['blank'] = {'answer': b.get('answer', x['blank']['answer']), 'options': [{'en': o} for o in b['options']]}
        if k in DECOY:
            x['decoy'] = DECOY[k]
        if k in ICON:
            x['icon'] = ICON[k]
        if k in WHYB:
            x['why'] = WHYB[k]

BLANK_OVR = {'15.2': ['stabilize', 'relocate', 'undress', 'transfer']}
for k, o in BLANK_OVR.items():
    si, j = map(int, k.split('.'))
    SIT[si]['sentences'][j]['blank'] = {'answer': o[0], 'options': [{'en': t} for t in o]}

# ---------- A 검토 문장 ----------
SENT_FIELDS = ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy')
for e in load('fix_icu-brain-death_data_1.yaml')['sent']:
    sit = SIT[e['s']]
    x = sit['sentences'][e['i']]
    if x['en'] in SIT_KEY[e['s']]:
        assert e.get('en', x['en']) == x['en'] and e.get('chunks', x['chunks']) == x['chunks'], ('keyPhrase', e)
    for k in SENT_FIELDS:
        if k in e:
            x[k] = e[k]
    if 'dko' in e:
        assert len(e['dko']) == 2
        x['distractorsKo'] = e['dko']
    if 'blank' in e:
        b = e['blank']
        assert b['answer'] in b['options'] and len(set(b['options'])) == 4, e
        x['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in b['options']]}

# ---------- 단어 ----------
d2 = load('fix_icu-brain-death_data_2.yaml')
for wid, m in d2['dEn_swap'].items():
    cur = W[wid]['distractorsEn']
    for o, nw in m.items():
        assert o in cur, (wid, o, cur)
        cur[cur.index(o)] = nw
for wid, m in d2['dKo_swap'].items():
    cur = W[wid]['distractorsKo']
    for o, nw in m.items():
        assert o in cur, (wid, o, cur)
        cur[cur.index(o)] = nw
for wid, c in d2['cue'].items():
    W[wid]['cue'] = c
for wid, m in d2['decoy_swap'].items():
    cur = W[wid]['decoyChips']
    for o, nw in m.items():
        assert o in cur, (wid, o, cur)
        cur[cur.index(o)] = nw
for wid, setv in d2['words'].items():
    W[wid].update(setv)

# 예문(example)·exKo 맞춤
old_en = {}
for si, s in enumerate(pre['situations']):
    for i, x in enumerate(s['sentences']):
        old_en.setdefault(x['en'], (si, i))
used = {}
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        for wid in x['words']:
            used.setdefault(wid, []).append((si, i))
for wid, w in W.items():
    if w['example'] not in old_en:
        continue
    si, i = old_en[w['example']]
    new = SIT[si]['sentences'][i]
    old = pre['situations'][si]['sentences'][i]
    if new['en'] != w['example']:
        if wid in new['words']:
            w['example'] = new['en']
        else:
            cands = [c for c in used.get(wid, []) if SIT[c[0]]['sentences'][c[1]]['en'] == pre['situations'][c[0]]['sentences'][c[1]]['en']]
            assert cands, wid
            new = SIT[cands[0][0]]['sentences'][cands[0][1]]
            w['example'] = new['en']
            print('  [example moved]', wid, '->', new['en'])
        w['exKo'] = new['ko']
    elif new['ko'] != old['ko']:
        w['exKo'] = new['ko']
for sit in SIT:
    for s in sit['sentences']:
        for wid in s['words']:
            assert wid in W, (sit['title'], s['en'], wid)
tagged = {wid for sit in SIT for s in sit['sentences'] for wid in s['words']}
for wid in list(W):
    if wid not in tagged:
        print('  [UNTAGGED]', wid)

# ---------- 뉘앙스 ----------
d3 = load('fix_icu-brain-death_data_3.yaml')
for e in d3['nuance']:
    sit = SIT[e['s']]
    cands = [n for n in sit['nuance'] if n['kind'] == e['kind']]
    assert len(cands) == 1, (e['s'], e['kind'], len(cands))
    n = cands[0]
    if e.get('delete'):
        sit['nuance'].remove(n)
        continue
    n.update(e.get('set', {}))
    for idx, upd in (e.get('scene') or {}).items():
        n['scenes'][idx].update(upd)

# ---------- order ----------
for e in d3['order']:
    o = SIT[e['s']]['order']
    if 'why' in e:
        o['why'] = e['why']
    for idx, upd in (e.get('lines') or {}).items():
        o['lines'][idx].update(upd)

with open(P('icu-brain-death.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=100000)

# ---------- changes-icu-brain-death.yaml ----------
changes = copy.deepcopy(chg_doc['changes'])
V44_WORD = ('id', 'en', 'ipa', 'ko', 'icon', 'example')
V44_SENT = ('en', 'ko', 'chunks', 'words')
WHY_WORD = {
    'w-map': "문장 13.0이 map out(구)이고 ko '정리하다'는 구의 뜻 — 헤드워드를 구로, ipa도 맞춤",
    'w-escalate': "ko '상황을 격상시키다'는 외래어투 — '상급 대응을 요청하다'(상급 보고·신속대응 요청)로. 예문 ko 변경은 16.4 반영",
    'w-rescue': "rescue equipment는 응급 장비 — ko '구조의'를 '응급용'으로(오답 교체용·연습용과 틀도 맞춤)",
}
def add_word_change(wid, fields, why):
    for c in changes:
        if c['kind'] == 'word' and c['id'] == wid:
            c['fields'] = sorted(set(c['fields']) | set(fields), key=V44_WORD.index)
            c['why'] = c['why'] + ' / ' + why
            return
    changes.append({'kind': 'word', 'id': wid, 'fields': sorted(fields, key=V44_WORD.index), 'why': why})
pre_W = {w['id']: w for w in pre['words']}
for wid, w in W.items():
    diff = [k for k in V44_WORD if w.get(k) != pre_W[wid].get(k)]
    if diff:
        why = WHY_WORD.get(wid) or "이 단어를 예문으로 쓰던 문장을 바꾼 검토 반영에 맞춰 예문을 바꿈"
        add_word_change(wid, diff, why)
WHY_SENT = {
    (6, 3): "'call it'은 '(검사를) 끝내다'로도 읽혀 중단과 보고가 갈림(안전) — 'call them out'(소리 내어 알리다)로, w-call 태그를 뺌(헤드워드와 쓰임이 다름)",
    (4, 4): "코디네이터 회신 시각은 간호사가 약속할 수 없음 — 연락이 오면 바로 알려 준다로",
    (13, 3): "처방 전 채혈 시각은 약속할 수 없음 — 처방이 나는 대로로",
    (18, 3): "무엇을 거절하는지 빠져 판정·연명 거절로도 읽힘 — 'to donation'을 넣음",
    (20, 5): "가족이 곁에 있는 자리에서 기증을 서두르는 압박으로 들림 — 코디네이터가 장기 제안에 쓸 수치를 요청하는 말로",
    (9, 3): "ko '구십육'이 섭씨로 읽힘 — '화씨 96도'",
    (16, 4): "ko '에스컬레이션하지'는 외래어 — '상급 대응을 요청하지'",
    (0, 2): "ko '합법적인'은 뜻이 어긋남 — '법적인'",
    (20, 2): "ko '에스컬레이션할 수 있도록'은 외래어 — '상급 대응으로 올릴 수 있도록'",
    (6, 5): "구 경계를 끊은 chunks(right at / the bedside)를 바로잡음 — 문장은 그대로",
    (7, 3): "구 경계를 끊은 chunks(a few minutes / ago)를 바로잡음 — 문장은 그대로",
    (16, 3): "구 경계를 끊은 chunks(despite the current / dose)를 바로잡음 — 문장은 그대로",
}
CH_BY = {}
for c in changes:
    if c['kind'] == 'sentence':
        CH_BY[(c['situation'], c['index'])] = c
n_new = 0
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        px = pre['situations'][si]['sentences'][i]
        diff = [k for k in V44_SENT if x[k] != px[k]]
        if not diff:
            continue
        why = WHY_SENT.get((si, i), "검토 반영")
        key = (s['title'], i)
        if key in CH_BY:
            c = CH_BY[key]
            c['fields'] = sorted(set(c['fields']) | set(diff), key=V44_SENT.index)
            c['why'] = c['why'] + ' / ' + why
        else:
            c = {'kind': 'sentence', 'situation': s['title'], 'index': i,
                 'fields': sorted(diff, key=V44_SENT.index), 'why': why}
            changes.append(c)
            CH_BY[key] = c
        n_new += 1
with open(P('changes-icu-brain-death.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': chg_doc['theme'], 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=100000)
print('words', len(pre['words']), '->', len(doc['words']), '| changes', len(chg_doc['changes']), '->', len(changes), '| sentences changed', n_new)
