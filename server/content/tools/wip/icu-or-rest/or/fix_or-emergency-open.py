#!/usr/bin/env python3
# or-emergency-open 수정: or-emergency-open.pre-fix.yaml을 읽어 or-emergency-open.yaml을 쓴다(다시 돌릴 수 있음).
# 데이터: _B_after(B 검토 값) _data_1(문장) _data_2(단어) _data_3(뉘앙스) _data_4(order) _data_5(slider 길이·기타)
import yaml, copy, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
T = 'or-emergency-open'
L = lambda n: yaml.safe_load(open(f'fix_{T}_data_{n}.yaml', encoding='utf-8'))
d = yaml.safe_load(open(f'{T}.pre-fix.yaml', encoding='utf-8'))
pre = copy.deepcopy(d)
B = yaml.safe_load(open(f'fix_{T}_B_after.yaml', encoding='utf-8'))
D1, D2, D3, D4, D5 = L(1), L(2), L(3), L(4), L(5)
S = d['situations']

def blank(b):
    return {'answer': b['answer'], 'options': [{'en': o} if isinstance(o, str) else o for o in b['options']]}

# 1) B 검토 값 (사본에서 B 필드만)
BF = ['distractorsKo', 'blank', 'decoy', 'why', 'tag']
for i, (sa, sb) in enumerate(zip(S, B['situations'])):
    for j, (x, y) in enumerate(zip(sa['sentences'], sb['sentences'])):
        assert x['en'] == y['en'] and x['ko'] == y['ko']
        for f in BF:
            x[f] = copy.deepcopy(y[f])
    if sa['order'] != sb['order']:
        sa['order'] = copy.deepcopy(sb['order'])

# 2) 문장 en·ko·chunks·words + v46 필드
en_map = {}
for k, f in D1['sentences'].items():
    i, j = map(int, k.split('.'))
    s = S[i]['sentences'][j]
    old_en = s['en']
    for kk, v in f.items():
        s[kk] = blank(v) if kk == 'blank' else copy.deepcopy(v)
    if s['en'] != old_en:
        en_map[old_en] = s['en']
ko_by_en = {s['en']: s['ko'] for sit in S for s in sit['sentences']}
pre_ko_by_en = {s['en']: s['ko'] for sit in pre['situations'] for s in sit['sentences']}

# 3) 단어
W = {w['id']: w for w in d['words']}
for w in d['words']:
    if w['example'] in en_map:
        print('example 따라감:', w['id'], '|', w['example'], '->', en_map[w['example']])
        w['example'] = en_map[w['example']]
for wid, f in D2['words'].items():
    W[wid].update(copy.deepcopy(f))
for wid, v in D2['dEn'].items():
    W[wid]['distractorsEn'] = list(v)
for wid, m in D2['decoy_swap'].items():
    W[wid]['decoyChips'] = [m.get(c, c) for c in W[wid]['decoyChips']]
for wid, f in D5.get('words', {}).items():
    W[wid].update(copy.deepcopy(f))
rm = set(D2['remove'])
d['words'] = [w for w in d['words'] if w['id'] not in rm]
for w in d['words']:
    if w['example'] in ko_by_en:
        w['exKo'] = ko_by_en[w['example']]
for sit in S:
    for s in sit['sentences']:
        assert not (set(s['words']) & rm), (s['en'], set(s['words']) & rm)

# 4) 뉘앙스
for op in D3['nuance']:
    nu = S[op['s']]['nuance'][op['n']]
    for si, f in op.get('scene', {}).items():
        nu['scenes'][si].update(f)
    for kk, v in op.get('set', {}).items():
        nu[kk] = copy.deepcopy(v)
    for idx, v in op.get('scale_set', {}).items():
        nu['scale'][idx] = v
    if 'scale_swap' in op:
        a, b = op['scale_swap']
        nu['scale'][a], nu['scale'][b] = nu['scale'][b], nu['scale'][a]
    for k2, v in op.get('note_sub', {}).items():
        assert k2 in nu['notes']
        nu['notes'][k2] = v
for sit in S:   # 문장 en/ko가 바뀐 것을 뉘앙스 example·exKo·swap ko가 따라가게
    for nu in sit['nuance']:
        if nu['kind'] == 'slider':
            if nu['example'] in en_map:
                nu['example'] = en_map[nu['example']]
            if nu['example'] in ko_by_en:
                nu['exKo'] = ko_by_en[nu['example']]
        elif nu['kind'] == 'swap' and nu['answer'] in ko_by_en and nu['ko'] == pre_ko_by_en.get(nu['answer']) and nu['ko'] != ko_by_en[nu['answer']]:
            print('swap ko 따라감:', nu['answer'], nu['ko'], '->', ko_by_en[nu['answer']])
            nu['ko'] = ko_by_en[nu['answer']]
for k, f in D5.get('nuance', {}).items():
    i, n = map(int, k.split('.'))
    nu = S[i]['nuance'][n]
    for kk, v in f.items():
        nu[kk] = copy.deepcopy(v)

# 5) order
for i, op in D4['orders'].items():
    o = S[i]['order']
    for li, f in op.get('line', {}).items():
        o['lines'][li].update(f)
    if 'why' in op:
        o['why'] = op['why']

# 6) 위치 섞기 — context 어색 장면(ok:false), swap 정답 칸을 0·1·2에 고르게
ci = si_ = 0
for sit in S:
    for nu in sit['nuance']:
        if nu['kind'] == 'context':
            pos = [0, 2][ci % 2]; ci += 1
            bad = [x for x in nu['scenes'] if not x['ok']]
            good = [x for x in nu['scenes'] if x['ok']]
            assert len(bad) == 1 and len(good) == 2
            sc = list(good); sc.insert(pos, bad[0]); nu['scenes'] = sc
        elif nu['kind'] == 'swap':
            pos = si_ % 3; si_ += 1
            ans = nu['answer']
            others = [o for o in nu['options'] if o != ans]
            assert len(others) == 2 and ans in nu['options']
            ops = list(others); ops.insert(pos, ans); nu['options'] = ops
            nu['notes'] = {o: nu['notes'][o] for o in ops}

yaml.safe_dump(d, open(f'{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=200)

# 7) changes — 원본(changes-…pre-fix.yaml)을 읽어 v44 필드 변경을 합쳐 다시 만든다
V44W = ['en', 'ipa', 'ko', 'icon', 'example']
V44S = ['en', 'ko', 'chunks', 'words']
ch = yaml.safe_load(open(f'changes-{T}.pre-fix.yaml', encoding='utf-8'))
cl = ch['changes']
newW = {w['id']: w for w in d['words']}
preW = {w['id']: w for w in pre['words']}
WHYW = D5['why_word']
def wfields(wid):
    n, p = newW[wid], preW[wid]
    return [f for f in V44W if n.get(f) != p.get(f)]
out = []
seen_w = set()
for c in cl:
    if c['kind'] == 'word' and c['id'] in rm:
        continue
    if c['kind'] == 'word':
        extra = wfields(c['id'])
        c = dict(c)
        c['fields'] = [f for f in V44W if f in set(c['fields']) | set(extra)]
        if extra and c['id'] in WHYW:
            c['why'] += ' / ' + WHYW[c['id']]
        seen_w.add(c['id'])
    out.append(c)
for wid in newW:
    if wid not in seen_w:
        f = wfields(wid)
        if f:
            out.append({'kind': 'word', 'id': wid, 'fields': f, 'why': WHYW.get(wid, '단어 example이 바뀐 문장을 따라감(수정)')})
for wid in sorted(rm):
    out.append({'kind': 'word-remove', 'id': wid, 'why': D5['why_remove'][wid]})
sidx = {(sit['title'], j): s for sit in S for j, s in enumerate(sit['sentences'])}
pidx = {(sit['title'], j): s for sit in pre['situations'] for j, s in enumerate(sit['sentences'])}
titles = [sit['title'] for sit in S]
SWHY = D5['why_sentence']
for (title, j), s in sidx.items():
    p = pidx[(title, j)]
    f = [x for x in V44S if s[x] != p[x]]
    if not f:
        continue
    key = f"{titles.index(title)}.{j}"
    why = SWHY.get(key, '수정')
    hit = [c for c in out if c['kind'] == 'sentence' and c['situation'] == title and c['index'] == j]
    if hit:
        c = hit[0]
        c['fields'] = [x for x in V44S if x in set(c['fields']) | set(f)]
        c['why'] += ' / ' + why
    else:
        out.append({'kind': 'sentence', 'situation': title, 'index': j, 'fields': f, 'why': why})
ch['changes'] = out
yaml.safe_dump(ch, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=200)
print('words', len(d['words']), 'changes', len(out))
