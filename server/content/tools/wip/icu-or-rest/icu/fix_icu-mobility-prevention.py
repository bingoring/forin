# icu-mobility-prevention 수정: pre-fix 원본 + B 검토(revB_..._vals.py) + A 검토 → icu-mobility-prevention.yaml
# 재실행 가능: pre-fix.yaml / changes pre-fix 사본을 읽어 다시 만든다.
import yaml, re, copy, importlib.util, glob
spec = importlib.util.spec_from_file_location('v', 'revB_icu-mobility-prevention_vals.py'); V = importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
d = yaml.safe_load(open('icu-mobility-prevention.pre-fix.yaml'))
chg = yaml.safe_load(open('changes-icu-mobility-prevention.pre-fix.yaml'))
data = {}
for f in sorted(glob.glob('fix_icu-mobility-prevention_data_*.yaml')):
    data.update(yaml.safe_load(open(f)) or {})
W = {w['id']: w for w in d['words']}
def S(k):
    a, b = map(int, k.split('.')); return d['situations'][a]['sentences'][b]
dot = lambda t: t if t.endswith(('.', '?', '!')) else t + '.'
def change(k, fields, why):
    a, b = map(int, k.split('.')); t = d['situations'][a]['title']
    for c in chg['changes']:
        if c['kind'] == 'sentence' and c['situation'] == t and c['index'] == b:
            for f in fields:
                if f not in c['fields']: c['fields'].append(f)
            c['why'] += ' / ' + why; return
    chg['changes'].append({'kind': 'sentence', 'situation': t, 'index': b, 'fields': list(fields), 'why': why})

# ---- B 검토 새 값
for k, (x1, x2) in V.DK.items():
    s = S(k); dk = list(s['distractorsKo'])
    if x1: dk[0] = dot(x1)
    if x2: dk[1] = dot(x2)
    s['distractorsKo'] = dk
for k, (ans, opts) in V.BL.items():
    s = S(k); a = ans or s['blank']['answer']
    assert len(re.findall(r'\b' + re.escape(a) + r'\b', s['en'])) == 1, (k, a)
    assert a in opts and len(set(opts)) == 4, (k, opts)
    s['blank'] = {'answer': a, 'options': [{'en': o} for o in opts]}
for k, v in V.DC.items(): S(k)['decoy'] = v
for k, v in V.ICON.items(): S(k)['icon'] = v
for k, v in V.WHY.items(): S(k)['why'] = v
for si, li, en, ko, note in V.ORD:
    L = d['situations'][si]['order']['lines'][li - 1]; L['en'] = en; L['ko'] = ko
    if note: L['note'] = note
L = d['situations'][19]['order']['lines']; L[2]['icon'], L[3]['icon'] = 'pager', 'magnify'
for (si, li), ic in V.ORDICON.items(): d['situations'][si]['order']['lines'][li - 1]['icon'] = ic
for si, w in V.ORDWHY.items(): d['situations'][si]['order']['why'] = w

# ---- A 검토: 문장 en·ko (6.6, 18.5, 20.4) / ko (11.3, 13.1)
def setsent(k, en=None, ko=None, chunks=None, words=None, why=None, dk=None, blank=None, decoy=None):
    s = S(k)
    if en: s['en'] = en
    if ko: s['ko'] = ko
    if chunks: s['chunks'] = chunks
    if words: s['words'] = words
    if why: s['why'] = why
    if dk: s['distractorsKo'] = [dot(x) for x in dk]
    if blank:
        ans, opts = blank
        assert len(re.findall(r'\b' + re.escape(ans) + r'\b', s['en'])) == 1 and ans in opts and len(set(opts)) == 4, (k, ans)
        s['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}
    if decoy: s['decoy'] = decoy
for k, kw in data['sentences'].items():
    setsent(k, **kw['set'])
    change(k, kw['fields'], kw['why'])
# 문장 ko가 바뀌면 그 문장을 예문으로 쓰는 단어의 exKo도 맞춘다
for w in d['words']:
    for k in data['sentences']:
        s = S(k)
        if w['example'] == s['en'] and w['exKo'] != s['ko']: w['exKo'] = s['ko']
# w-emergency 삭제(어느 문장도 태그하지 않음)
used = {x for sit in d['situations'] for s in sit['sentences'] for x in s['words']}
for wid in data['word_remove']:
    assert wid not in used, wid
    d['words'] = [w for w in d['words'] if w['id'] != wid]
    chg['changes'].append({'kind': 'word-remove', 'id': wid, 'why': data['word_remove'][wid]})
# chunks 구 경계, decoy 새 조각 자리에 맞춤
for k, (chunks, decoy) in data['chunks'].items():
    s = S(k); assert ' '.join(chunks).replace(' ,', ',').replace(' .', '.') == s['en'], (k, chunks)
    s['chunks'] = chunks
    if decoy: s['decoy'] = decoy
    change(k, ['chunks'], '구 경계에서 끊도록 다시 자름(관사·of·부사 앞에서 끊긴 조각)')
# 4.4 w-call 태그 빼기 + w-call 예문
s = S('4.4'); s['words'] = [x for x in s['words'] if x != 'w-call']
change('4.4', ['words'], "w-call은 여기서 '판정하다'라 헤드워드 ko(부르다)와 안 맞아 태그를 뺌")
for wid, f in data['word_fields'].items():
    W[wid].update(f['set'])
    if f.get('change'): chg['changes'].append({'kind': 'word', 'id': wid, 'fields': f['change'], 'why': f['why']})
# why 덧붙임(처방·프로토콜 전제, 밀폐 드레싱 등)
for k, w in data['why'].items(): S(k)['why'] = w
# 뉘앙스
for key, patch in data['nuance'].items():
    si, ni = map(int, key.split('.')); n = d['situations'][si]['nuance'][ni]
    for fk, fv in patch.items():
        if fk == 'scene_en':
            for idx, text in fv.items(): n['scenes'][int(idx)]['en'] = text
        elif fk == 'before':
            for idx, text in fv.items(): n['before'][int(idx)] = text
        elif fk == 'notes':
            n['notes'].update(fv)
        else:
            n[fk] = fv
yaml.safe_dump(d, open('icu-mobility-prevention.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump(chg, open('changes-icu-mobility-prevention.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written', len(chg['changes']))
