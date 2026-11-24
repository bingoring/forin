# icu-transfusion 수정 — pre-fix 원본에서 A·B 검토 목록을 반영해 icu-transfusion.yaml과 changes를 다시 만든다(재실행 가능).
import yaml, re, sys, copy, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools'); sys.path.insert(0, HERE)
from revB_icu_transfusion_vals import KO, BLANK, DECOY, ICON, ORDER, ORDER_WHY, ORDER_META, WHY

T = 'icu-transfusion'
if not os.path.exists(f'changes-{T}.pre-fix.yaml'):
    shutil.copy(f'changes-{T}.yaml', f'changes-{T}.pre-fix.yaml')
d = yaml.safe_load(open(f'{T}.pre-fix.yaml'))
base = yaml.safe_load(open(f'base-{T}.yaml'))
old_changes = yaml.safe_load(open(f'changes-{T}.pre-fix.yaml'))['changes']
D1 = yaml.safe_load(open(f'fix_{T}_data_1.yaml'))
D2 = yaml.safe_load(open(f'fix_{T}_data_2.yaml'))
D3 = yaml.safe_load(open(f'fix_{T}_data_3.yaml'))
orig = copy.deepcopy(d)
S = d['situations']

def sent(k):
    si, j = map(int, k.split('.'))
    return S[si]['sentences'][j]

# ---------- 1. B 검토 새 값 ----------
for si, s in enumerate(S):
    for j, x in enumerate(s['sentences']):
        k = f'{si}.{j}'
        if k in KO:
            x['distractorsKo'] = [a if a is not None else b for a, b in zip(KO[k][:2], x['distractorsKo'])]
        if k in BLANK:
            a, opts, _ = BLANK[k]
            x['blank'] = {'answer': a or x['blank']['answer'], 'options': [{'en': o} for o in opts]}
        if k in DECOY:
            x['decoy'] = DECOY[k][0]
        if k in ICON:
            x['icon'] = ICON[k][1]
        if k in WHY:
            x['why'] = WHY[k]

# ---------- 2. A 문장 수정(B 필드 다시 쓰기 포함) ----------
sent_edits = {}  # key -> (old_en, old_ko)
for k, f in D1['sentences'].items():
    x = sent(k)
    sent_edits[k] = (x['en'], x['ko'])
    for fk, fv in f.items():
        if fk == 'blank':
            x['blank'] = {'answer': fv['answer'], 'options': [{'en': o} for o in fv['options']]}
        else:
            x[fk] = fv

# ---------- 3. 예문·exKo 전파 ----------
def propagate(old_en, old_ko, new_en, new_ko, tgt_words, tgt_nuance):
    for w in tgt_words:
        if w['example'] == old_en:
            w['example'] = new_en
            if new_en != old_en or w['exKo'] == old_ko:
                w['exKo'] = new_ko
    for n in tgt_nuance:
        if n.get('example') == old_en:
            n['example'] = new_en
            n['exKo'] = new_ko
        elif 'example' in n and n.get('exKo') == old_ko and n['example'] == new_en:
            n['exKo'] = new_ko

all_nuance = [n for s in S for n in s['nuance']]
for k, (oen, oko) in sent_edits.items():
    x = sent(k)
    if x['en'] != oen or x['ko'] != oko:
        propagate(oen, oko, x['en'], x['ko'], d['words'], all_nuance)
# w-transfuse 예문은 20.0 문장으로(12.5가 바뀌어 더는 쓰지 않음)
W = {w['id']: w for w in d['words']}
W['w-transfuse']['example'] = sent('20.0')['en']; W['w-transfuse']['exKo'] = sent('20.0')['ko']

# ---------- 4. 단어 ----------
for wid, f in D3['words'].items():
    W[wid].update(f)
d['words'] = [w for w in d['words'] if w['id'] not in D3['remove']]
W = {w['id']: w for w in d['words']}
used = {t for s in S for x in s['sentences'] for t in x['words']}
orphans = [w for w in W if w not in used]
print('미사용 단어:', orphans)
for s in S:
    for n in s['nuance']:
        for t in n.get('words', []):
            if t not in W: print('뉘앙스가 지운 단어를 가리킴', s['title'], n['kind'], t)

# ---------- 5. 뉘앙스 ----------
for e in D2['nuance']:
    s = S[e['s']]
    cands = [n for n in s['nuance'] if n['kind'] == e['kind']]
    assert len(cands) == 1, (e['s'], e['kind'])
    n = cands[0]
    for k, v in e['set'].items():
        if k == 'scenes':
            for sc, nv in zip(n['scenes'], v):
                sc['en'] = nv['en']
                if 'fix' in nv: sc['fix'] = nv['fix']
        elif k == 'scenes_fix':
            for i, fx in v.items(): n['scenes'][i]['fix'] = fx
        elif k == 'scenes_en':
            for i, en in v.items(): n['scenes'][i]['en'] = en
        elif k == 'notes':
            nn = {a: b for a, b in n['notes'].items() if a in e['set']['options']}
            nn.update(v); n['notes'] = nn
        else:
            n[k] = v

# ---------- 6. order ----------
def fixB(si, li, en, ko):
    if (si, li) == (0, 4): en = en.replace('with her', 'with him')
    if (si, li) == (7, 3): en = en.replace('raised', 'distended')
    return en, ko
for si, li, en, ko, _ in ORDER:
    en, ko = fixB(si, li, en, ko)
    S[si]['order']['lines'][li - 1].update(en=en, ko=ko)
for (si, li), (ic, nt) in ORDER_META.items():
    S[si]['order']['lines'][li - 1].update(icon=ic, note=nt)
for si, w in ORDER_WHY.items():
    S[si]['order']['why'] = w
for o in D2['order']:
    S[o['s']]['order']['lines'][o['l'] - 1].update(en=o['en'], ko=o['ko'])
for si, w in D2['order_why'].items():
    S[si]['order']['why'] = w

# ---------- 7. 출력 ----------
with open(f'{T}.yaml', 'w') as f:
    yaml.safe_dump(d, f, allow_unicode=True, sort_keys=False, width=1000)

# ---------- 8. changes ----------
bw = {w['id']: w for w in base['words']}
cw = {w['id']: w for w in d['words']}
old_by = {}
for c in old_changes:
    key = (c['kind'], c.get('id') or (c.get('situation'), c.get('index')))
    old_by[key] = c
NEW_WHY_W = {
    'w-vital': "헤드워드 'vital'(형용사)에 ko '활력징후'가 붙어 있어 복수 명사 vitals로 바로잡음(A 결정 11)",
    'w-away': "'away'=즉시는 틀린 ko — 뜻은 구 전체 'right away'라 구 단위로(A 결정 11)",
    'w-risk': "4.5는 동사 'can't risk giving'이라 ko를 '위험을 무릅쓰다'로(A 결정 11)",
    'w-close': "18.6 'keep close watch'는 거리가 아니라 '면밀한'이라 ko를 바로잡음(A 결정 11)",
    'w-wish': "복수형(wishes)을 단수 원형으로 / ko는 정본 '바람'으로 되돌림 — wishes는 희망이 아니라 바람·뜻",
    'w-baseline': "en 'baseline'은 명사이므로 ko를 '기저의'가 아니라 '기저'로(A 검토 품사)",
}
changes = []
for w in d['words']:  # 단어
    b = bw.get(w['id'])
    if not b: print('base에 없는 단어', w['id']); continue
    fields = [k for k in ('en', 'ko', 'ipa', 'icon', 'example') if b.get(k) != w.get(k)]
    if not fields: continue
    o = old_by.get(('word', w['id']))
    why = NEW_WHY_W.get(w['id']) or (o['why'] if o else None)
    if not why:
        why = {'example': "예문 문장의 en을 고치거나 바꿔서 단어 예문을 맞춤"}.get(fields[-1], '검토 반영')
    if o and set(o['fields']) != set(fields) and w['id'] not in NEW_WHY_W:
        why = o['why']
    changes.append({'kind': 'word', 'id': w['id'], 'fields': fields, 'why': why})
for wid in sorted({c['id'] for c in old_changes if c['kind'] == 'word-remove'} | set(D3['remove'])):
    why = (old_by.get(('word-remove', wid)) or {}).get('why') or {
        'w-alone': "13.3이 'Even a little redness means…'로 바뀌어 어느 문장도 태그하지 않게 됐다(A S1)",
        'w-stretch': "19.0이 'is getting longer'로 바뀌어 어느 문장도 태그하지 않게 됐다(A S12)"}[wid]
    changes.append({'kind': 'word-remove', 'id': wid, 'why': why})
SW = {
    '13.3': "수혈 중 새 증상은 가벼워 보여도 멈추고 평가해야 해서 문장을 고침(A S1 안전)",
    '16.5': "IM 에피네프린의 반복을 push로 말하고 간호사 판단처럼 들려 'Per protocol, … IM dose'로(A S2 안전)",
    '16.1': "간호사가 진단을 단정하지 않게 'looks like'로(A S3)",
    '10.6': "처방·프로토콜 전제를 'per protocol'로 밝힘(A S4)",
    '19.6': "'제제마다 칼슘'은 과장이라 프로토콜에 따라 계속 주는 것으로(A S5)",
    '12.2': "보류도 의료진 계획에 따라 — 간호사가 정하는 말투를 팀 주어로(A S6)",
    '12.5': "출혈 시 수치와 상관없이 바로 수혈은 사실이 아니라 바로 의료진 호출로(A S7)",
    '14.6': "세포회수는 간호사가 약속할 수 없어 알아보는 것으로(A S8)",
    '20.6': "간호사 단독 약속처럼 들리지 않게 팀과 함께로(A S9)",
    '7.3': "'raised jugular vein'은 부자연해 distended로(A S10)",
    '8.2': "'units we send up'은 혈액은행의 시점이라 'come up'으로(A S11)",
    '19.0': "'His QT is stretching'은 임상에서 쓰지 않아 'getting longer'로(A S12)",
    '0.1': "한 상황 안 환자 대명사를 his로 통일(A S15)",
    '7.5': "한 상황 안 환자 대명사를 her로 통일(A S15)",
    '18.6': "close ko를 '면밀한'으로 바로잡아 ko를 고침(A 결정 11)",
}
SW_DEFAULT = {
    ('chunks',): "구 경계를 끊은 조각을 고침 — 문장 en은 그대로(A S13)",
    ('ko',): "ko의 그/그녀 대명사·어색한 말을 고침 — 문장 en은 그대로(A S14·KO)",
    ('ko', 'chunks'): "ko와 chunks를 고침(A)",
}
for si, s in enumerate(S):
    for j, x in enumerate(s['sentences']):
        b = base['situations'][si]['sentences'][j]
        assert base['situations'][si]['title'] == s['title']
        fields = [k for k in ('en', 'ko', 'chunks', 'words') if b.get(k) != x.get(k)]
        if not fields: continue
        k = f'{si}.{j}'
        o = old_by.get(('sentence', (s['title'], j)))
        why = SW.get(k) or SW_DEFAULT.get(tuple(f for f in fields if f != 'words')) or ''
        if o and set(o['fields']) == set(fields):
            why = SW.get(k) or o['why']
        elif o:
            why = (o['why'] + ' / ' + why) if why else o['why']
        if not why: why = '검토 반영'
        changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': fields, 'why': why})
with open(f'changes-{T}.yaml', 'w') as f:
    yaml.safe_dump({'theme': T, 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=1000)
print('changes', len(changes), 'old', len(old_changes))
