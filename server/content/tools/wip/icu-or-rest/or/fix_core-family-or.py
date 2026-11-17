#!/usr/bin/env python3
# core-family-or 수정: core-family-or.pre-fix.yaml을 읽어 core-family-or.yaml을 쓴다(다시 돌릴 수 있음).
# 데이터: _data_1(B 검토 값) _data_2(문장 en/ko/chunks 수정) _data_3(단어) _data_4(뉘앙스·order) _data_5(distractorsEn)
import yaml, copy, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
T = 'core-family-or'
L = lambda n: yaml.safe_load(open(f'fix_{T}_data_{n}.yaml', encoding='utf-8'))
d = yaml.safe_load(open(f'{T}.pre-fix.yaml', encoding='utf-8'))
pre = copy.deepcopy(d)
D1, D2, D3, D4, D5 = L(1), L(2), L(3), L(4), L(5)
S = d['situations']

def blank(b):
    return {'answer': b['answer'], 'options': [{'en': o} if isinstance(o, str) else o for o in b['options']]}

# 1) B 검토 값
for k, f in D1['sentences'].items():
    i, j = map(int, k.split('.'))
    for kk, v in f.items():
        S[i]['sentences'][j][kk] = copy.deepcopy(v)
for i, o in D1['orders'].items():
    S[i]['order'] = copy.deepcopy(o)

# 2) 문장 en·ko·chunks·words + v46 필드
en_map = {}
for k, f in D2['sentences'].items():
    i, j = map(int, k.split('.'))
    s = S[i]['sentences'][j]
    old_en = s['en']
    for kk, v in f.items():
        if kk == 'remove_words':
            s['words'] = [w for w in s['words'] if w not in v]
        elif kk == 'blank':
            s['blank'] = blank(v)
        else:
            s[kk] = copy.deepcopy(v)
    if s['en'] != old_en:
        en_map[old_en] = s['en']

# 3) 단어
W = {w['id']: w for w in d['words']}
for wid, new in D5['dEn'].items():
    W['w-' + wid]['distractorsEn'] = list(new)
for w in d['words']:
    if w['example'] in en_map:
        w['example'] = en_map[w['example']]
for wid, f in D3['words'].items():
    W[wid].update(copy.deepcopy(f))
for wid, c in D3['cues'].items():
    W[wid]['cue'] = c
rm = set(D3['remove'])
d['words'] = [w for w in d['words'] if w['id'] not in rm]
ko_by_en = {s['en']: s['ko'] for sit in S for s in sit['sentences']}
for w in d['words']:
    if w['example'] in ko_by_en:
        w['exKo'] = ko_by_en[w['example']]
for sit in S:
    for s in sit['sentences']:
        assert not (set(s['words']) & rm), (s['en'], set(s['words']) & rm)

# 4) 뉘앙스
for op in D4['nuance']:
    nu = S[op['s']]['nuance'][op['n']]
    for si, f in op.get('scene', {}).items():
        nu['scenes'][si].update(f)
    st = op.get('set', {})
    for kk, v in st.items():
        if kk == 'option1':
            nu['options'][1] = v
        elif kk == 'before1':
            nu['before'][1] = v; nu['options'][0] = v
        elif kk == 'notes_rename':
            nu['notes'] = {v2 if k2 in v else k2: nv for k2, nv in nu['notes'].items() for v2 in [v.get(k2, k2)]}
        elif kk == 'remove_words':
            nu['words'] = [w for w in nu['words'] if w not in v]
        else:
            nu[kk] = copy.deepcopy(v)
    if 'append_cue' in op:
        nu['cue'] += op['append_cue']

# 5) order
for i, op in D4['orders'].items():
    o = S[i]['order']
    for li, f in op.get('line', {}).items():
        o['lines'][li].update(f)
    if 'why' in op:
        o['why'] = op['why']
    if 'why_sub' in op:
        o['why'] = o['why'].replace(*op['why_sub'])

# 6) 이 주제 안에서 위치 섞기 — context 어색 장면(ok:false), swap 정답 칸을 0·1·2에 고르게
ci = si_ = 0
for sit in S:
    for nu in sit['nuance']:
        if nu['kind'] == 'context':
            pos = ci % 3; ci += 1
            bad = [x for x in nu['scenes'] if not x['ok']]
            good = [x for x in nu['scenes'] if x['ok']]
            assert len(bad) == 1 and len(good) == 2
            sc = list(good); sc.insert(pos, bad[0]); nu['scenes'] = sc
        elif nu['kind'] == 'swap':
            pos = (si_ + 1) % 3; si_ += 1
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
WHY = {
 'w-little': '결정 11 — 13.3 문장에서 "a little" 판정을 빼면서 이 문장에만 쓰이던 단어를 지운다(A D4)',
 'w-other': '결정 11 — each other를 한 구(w-each)로 합침: other 단독의 ko "서로"는 틀림(A D13)',
 'w-coffee': '결정 11 — 간호사에게 가르칠 말이 아님(쉬운 단어); 어느 문장도 태그하지 않게 됐다(A D23)',
}
WHYF = {
 'w-each': ('each other 한 구를 두 카드로 쪼갠 것을 합침 — 헤드워드 each other, ko 서로(A D13)', ['en', 'ipa', 'ko']),
 'w-stand': ('stand 단독에 ko "곁을 지키다"(stand by의 뜻) — 헤드워드를 stand by로(A D14)', ['en', 'ipa']),
 'w-scared': ('scared는 "겁먹은", "무서운"은 scary(A D15)', ['ko']),
 'w-closely': ('세 문장 모두 "면밀히"(A D16)', ['ko']),
 'w-earlier': ('문장은 형용사 the earlier case(앞선)(A D17)', ['ko']),
 'w-bring': ('두 문장 모두 가족을 환자에게 모시고 가는 것(A D18)', ['ko']),
 'w-fast': ('두 문장 모두 부사(acting fast) — "빨리"; example을 19.0 문장으로(A D20, D6)', ['ko', 'example']),
 'w-completely': ('충분히는 sufficiently — "전적으로"(A D21)', ['ko']),
 'w-monitor': ('임상은 감시가 아니라 관찰(A D22)', ['ko']),
 'w-case': ('ko 수술 건에 맞게 example을 earlier case 문장으로(A D11)', ['example']),
 'w-right': ('ko 바로에 맞게 example을 right here 문장으로(A D12)', ['example']),
}
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
        if c['id'] in WHYF and extra:
            c['why'] += ' / ' + WHYF[c['id']][0]
        seen_w.add(c['id'])
    out.append(c)
for wid in newW:
    if wid not in seen_w:
        f = wfields(wid)
        if f:
            out.append({'kind': 'word', 'id': wid, 'fields': f, 'why': WHYF.get(wid, ('단어 example이 바뀐 문장을 따라감(A)', None))[0] if wid in WHYF else '단어 example을 바뀐 문장에 맞춤(A 수정)'})
for wid in sorted(rm):
    out.append({'kind': 'word-remove', 'id': wid, 'why': WHY[wid]})
# 문장
sidx = {(sit['title'], j): s for sit in S for j, s in enumerate(sit['sentences'])}
pidx = {(sit['title'], j): s for sit in pre['situations'] for j, s in enumerate(sit['sentences'])}
SWHY = {
 '5.4': '즉시 호출 약속을 절차 그대로로(A D1)', '10.3': '통역사는 설명이 아니라 옮기기(A D2)', '11.4': '시점 약속(very soon) 빼기(A D3)',
 '13.3': '변경 정도를 간호사가 판정하지 않기(A D4)', '20.3': '틀린 선택이 없다는 단정 빼기(A D5)', '12.3': '더 빨리 회복 인과 단정 빼기(A D6)',
 '6.4': '단정 완화(usually)(A D7)', '4.4': 'bring you back은 안으로 모시고 가다 — ko 방향 바로잡기(A D8)', '1.3': '마취가 자세보다 먼저(A D9)',
 '11.0': 'ko가 en에 없는 안심하세요를 더함(A D24)', '13.0': 'ko가 간호사가 발견한 것처럼 읽힘(A D25)', '18.3': '항의 장면에서 잘못을 인정하는 말로 읽힘(A/B 참고)',
}
done = set()
for c in out:
    if c['kind'] == 'sentence':
        done.add((c['situation'], c['index']))
for (title, j), s in sidx.items():
    p = pidx[(title, j)]
    f = [x for x in V44S if s[x] != p[x]]
    if not f:
        continue
    key = f"{[sit['title'] for sit in S].index(title)}.{j}"
    why = SWHY.get(key) or ('chunks 구 경계 정리(A D10)' if f == ['chunks'] else '삭제한 단어(w-other·w-coffee)·w-care 6.3 태그 빼기' if f == ['words'] else 'chunks 구 경계 정리(A D10) / 태그 정리')
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
