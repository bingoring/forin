#!/usr/bin/env python3
"""core-safety-icu 수정 — core-safety-icu.pre-fix.yaml(+changes-core-safety-icu.pre-fix.yaml)을 읽어 core-safety-icu.yaml과
changes-core-safety-icu.yaml을 다시 만든다. 데이터: fix_core-safety-icu_data_1(단어) _2(A 문장+딸린 B) _3(B 값) _4(뉘앙스·order). 재실행해도 같은 결과."""
import yaml, copy, sys, re, json
Y = lambda n: yaml.safe_load(open(f'fix_core-safety-icu_data_{n}.yaml'))
d = yaml.safe_load(open('core-safety-icu.pre-fix.yaml'))
base = yaml.safe_load(open('base-core-safety-icu.yaml'))
ch0 = yaml.safe_load(open('changes-core-safety-icu.pre-fix.yaml'))['changes']
d1, d2, d3, d4 = Y(1), Y(2), Y(3), Y(4)
KPJ = json.load(open('in-core-safety-icu.json'))
KP = {s['title']: set(s.get('keyPhrases', [])) for s in KPJ['situations']}
S = {f'{i}.{k}': (s, t) for i, s in enumerate(d['situations']) for k, t in enumerate(s['sentences'])}
OLD = {key: (t['en'], t['ko']) for key, (s, t) in S.items()}
why_new = {}

def endp(ko): return ko[-1] if ko[-1] in '.?' else ''
def fin(ko, v): return v.rstrip('.?') + endp(ko)

# --- 1. 단어
WEN = {}
for w in d['words']: WEN.setdefault(w['en'], []).append(w)
W = {w['id']: w for w in d['words']}
for en, pairs in d1['de_swap'].items():
    ws = WEN[en]; assert len(ws) == 1, en
    de = ws[0]['distractorsEn']
    for old, new in pairs:
        assert old in de, (en, old, de); de[de.index(old)] = new
for en, pairs in d1['dk_swap'].items():
    ws = WEN[en]; assert len(ws) == 1, en
    dk = ws[0]['distractorsKo']
    for old, new in pairs:
        assert old in dk, (en, old, dk); dk[dk.index(old)] = new
for wid, pairs in d1['dc_swap'].items():
    dc = W[wid]['decoyChips']
    for old, new in pairs:
        assert old in dc, (wid, old, dc); dc[dc.index(old)] = new
for wid, upd in d1['words'].items():
    W[wid].update(copy.deepcopy(upd))
for wid, cue in d1['cues'].items():
    W[wid]['cue'] = cue
# --- 2. B 값
for key, vals in d3['DK'].items():
    s, t = S[key]; t['distractorsKo'] = [fin(t['ko'], v) for v in vals]
for key, o in d3['BLANK'].items():
    s, t = S[key]; ans = o[0]
    assert len(re.findall(r'(?<![A-Za-z\'])' + re.escape(ans) + r'(?![A-Za-z\'])', t['en'])) == 1, (key, ans, t['en'])
    t['blank'] = {'answer': ans, 'options': [{'en': x} for x in o[1:]]}
for key, v in d3['DECOY'].items(): S[key][1]['decoy'] = v
for key, v in d3['TAG'].items(): S[key][1]['tag'] = v
for key, v in d3['WHY'].items(): S[key][1]['why'] = v

# --- 3. A 문장 (+딸린 B)
for key, u in d2['sentences'].items():
    s, t = S[key]
    for f in ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy'):
        if f in u: t[f] = u[f]
    if 'dk' in u: t['distractorsKo'] = [fin(t['ko'], v) for v in u['dk']]
    if 'blank' in u:
        b = u['blank']; assert b['options'][0] == b['answer']
        t['blank'] = {'answer': b['answer'], 'options': [{'en': x} for x in b['options']]}
    if s['title'] in KP and OLD[key][0] in KP[s['title']] and t['en'] != OLD[key][0]:
        sys.exit('keyPhrase en 변경 시도: ' + key)
    if OLD[key][0] in KP[s['title']] and t['chunks'] != d['situations'][int(key.split('.')[0])]['sentences'][int(key.split('.')[1])]['chunks']:
        pass
for key, v in d2['why_kp'].items(): S[key][1]['why'] = v
for key, (s, t) in S.items():
    e = endp(t['ko'])
    t['distractorsKo'] = [x.rstrip('.?') + e for x in t['distractorsKo']]
    assert ''.join(' '.join(t['chunks']).replace(' ,', ',').replace(' .', '.').replace(' ?', '?').split()) == ''.join(t['en'].split()), (key, t['en'])

for wid in d1['remove']:
    for s_ in d['situations']:
        for t in s_['sentences']:
            if wid in t['words']: sys.exit('아직 태그된 단어: ' + wid)
        for x in s_['nuance']:
            assert wid not in x['words']
d['words'] = [w for w in d['words'] if w['id'] not in d1['remove']]
W = {w['id']: w for w in d['words']}

# --- 4. 문장 en·ko 변경에 단어 example·exKo 맞춤
sync_log = []
for key, (s, t) in S.items():
    oen, oko = OLD[key]
    if (t['en'], t['ko']) == (oen, oko): continue
    for w in d['words']:
        if w['example'] == oen or w['example'] == t['en']:
            if w['example'] != t['en'] or w['exKo'] != t['ko']:
                sync_log.append((w['id'], w['example'], '->', t['en'], t['ko']))
            w['example'], w['exKo'] = t['en'], t['ko']
# w-right 예문은 2.5가 아니라 5.3
w = W['w-right']; s5, t5 = S['5.3']
w['example'], w['exKo'] = t5['en'], t5['ko']
for wid, upd in d1['words'].items():
    for f in ('example', 'exKo'):
        if f in upd: W[wid][f] = upd[f]

# --- 5. 뉘앙스
def nu(i, kind, n=None):
    xs = [x for x in d['situations'][i]['nuance'] if x['kind'] == kind]
    return xs[0] if n is None else xs[n]
for key, u in d4['nuance'].items():
    i, n = map(int, key.split('.'))
    x = d['situations'][i]['nuance'][n]
    for f, v in u.items(): x[f] = copy.deepcopy(v)
for i, u in d4['context'].items():
    x = nu(i, 'context')
    x['word'], x['ko'], x['scenes'], x['why'] = u['word'], u['ko'], copy.deepcopy(u['scenes']), u['why']
    if 'words' in u: x['words'] = u['words']
# --- 6. order
for key, u in d3['ORDER'].items():
    i, n = map(int, key.split('.')); d['situations'][i]['order']['lines'][n].update(u)
for i, v in d3['ORDER_WHY'].items(): d['situations'][int(i)]['order']['why'] = v
for key, u in d4['order'].items():
    i, n = map(int, key.split('.')); d['situations'][i]['order']['lines'][n].update(u)
for i, v in d4['order_why'].items(): d['situations'][int(i)]['order']['why'] = v

# --- 7. 변경 목록: base와 비교해 처음부터 다시 만든다
V44W = ['en', 'ko', 'ipa', 'icon', 'example']
V44S = ['en', 'ko', 'chunks', 'words']
old_why = {}
for c in ch0:
    if c['kind'] == 'sentence': old_why[('s', c['situation'], c['index'])] = c['why']
    else: old_why[(c['kind'], c['id'])] = c['why']
NEWWHY = {
 (12, 5): '독립확인을 깨는 문장(값을 먼저 말함)을 각자 먼저 확인한 뒤 맞춰 보는 문장으로 교체',
 (2, 5): '값을 말하고 맞죠?로 동의를 구하는 유도를 상대 값을 먼저 묻는 문장으로 교체(w-right 태그 뺌)',
 (15, 4): '호출을 기도 사정 뒤로 미루는 순서를 사정과 호출을 동시에 나눠 맡는 문장으로',
 (16, 5): '처방 전 해독제 준비·순서 모순을 호출 먼저, 해독제는 처방이 나오면으로',
 (9, 5): '미국 ICU 마약 보관은 열쇠가 아니라 개인 로그인(ADC)이라 일반화 — w-key 태그 뺌',
 (20, 3): '공개는 가족에게 먼저 말하는 게 아니라 담당의가 이끌고 간호사는 곁에서 지원하는 문장으로(words 태그 추가)',
 (3, 6): '라벨은 라인 혼동을 막지 환자 혼동을 막지 않음',
 (15, 5): 'notify는 of가 필요 — notify the team of what happened',
 (2, 4): '구 경계에서 청크가 끊겨(together before) 조정',
 (4, 4): '구 경계에서 청크가 끊겨(works before) 조정',
 (3, 0): '구 경계에서 청크가 끊겨(something before) 조정',
 (9, 0): 'secured는 고정이 아니라 잠금 보관',
 (12, 2): 'high-alert는 고위험(w-alert 경고음 태그 뺌)',
 (12, 6): 'ko의 영어 high-alert를 고위험으로(w-alert 경고음 태그 뺌)',
 (6, 2): '무음 처리 번역투를 알람 소리만 끄는 건 절대 안 돼요로',
 (8, 4): '급식용(학교 급식)을 경관영양으로',
 (20, 1): '지지해요(찬성으로 읽힘)를 뒷받침해요로',
}
BW = {w['id']: w for w in base['words']}
changes = []
for bid in BW:
    if bid not in W:
        changes.append({'kind': 'word-remove', 'id': bid, 'why': old_why.get(('word-remove', bid)) or d1['why'].get(bid) or '어느 문장도 태그하지 않게 됐다'})
for wid, w in W.items():
    if wid in BW:
        f = [k for k in V44W if BW[wid].get(k) != w.get(k)]
        if f: changes.append({'kind': 'word', 'id': wid, 'fields': f, 'why': ' / '.join(x for x in [old_why.get(('word', wid)), d1['why'].get(wid)] if x) or ('예문을 바뀐 문장에 맞춤' if f == ['example'] else '수정')})
    else:
        sys.exit('새 단어: ' + wid)
for i, s in enumerate(d['situations']):
    bs = base['situations'][i]; assert bs['title'] == s['title']
    for k, t in enumerate(s['sentences']):
        bt = bs['sentences'][k]
        f = [x for x in V44S if bt.get(x) != t.get(x)]
        if f:
            ow = old_why.get(('s', s['title'], k)); nw = NEWWHY.get((i, k))
            why = ' / '.join(x for x in [ow, nw] if x) or '수정'
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': k, 'fields': f, 'why': why})

yaml.safe_dump(d, open('core-safety-icu.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
yaml.safe_dump({'theme': 'core-safety-icu', 'changes': changes}, open('changes-core-safety-icu.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
print('written; changes', len(changes))
for x in sync_log: print('SYNC', x)
