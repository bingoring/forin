#!/usr/bin/env python3
"""or-massive-transfusion 수정 — pre-fix.yaml을 읽어 데이터 파일(fix_or-massive-transfusion_data_N.yaml)대로 고쳐
or-massive-transfusion.yaml을 쓴다. 다시 돌려도 같은 결과(원본은 pre-fix.yaml·changes pre-fix 사본)."""
import yaml, os, shutil, copy, re, sys
H = os.path.dirname(os.path.abspath(__file__))
T = 'or-massive-transfusion'
def P(n): return os.path.join(H, n)
def load(n): return yaml.safe_load(open(P(n), encoding='utf-8'))

if not os.path.exists(P(f'changes-{T}.pre-fix.yaml')):
    shutil.copy(P(f'changes-{T}.yaml'), P(f'changes-{T}.pre-fix.yaml'))

d = load(f'{T}.pre-fix.yaml')
base = load(f'base-{T}.yaml')
d1 = load(f'fix_{T}_data_1.yaml')
d2 = load(f'fix_{T}_data_2.yaml')
d3 = load(f'fix_{T}_data_3.yaml')
S = d['situations']
W = {w['id']: w for w in d['words']}

def sent(k):
    si, j = map(int, k.split('-'))
    return S[si]['sentences'][j]

# ---- 1. 문장 덮어쓰기 -----------------------------------------------------
for k, ov in d2['sentences'].items():
    x = sent(k)
    for f, v in ov.items():
        x[f] = v
for k, v in d2['decoys'].items():
    sent(k)['decoy'] = v
for k, v in d2['tag_replace'].items():
    sent(k)['tag'] = v
for k, v in d2['why_replace'].items():
    sent(k)['why'] = v
for k, v in d2['why_append'].items():
    sent(k)['why'] = sent(k)['why'].rstrip() + v
# distractorsKo
for k, v in d1.items():
    sent(k)['distractorsKo'] = list(v)

# ---- 2. 빈칸 --------------------------------------------------------------
sys.path.insert(0, H)
import importlib.util
spec = importlib.util.spec_from_file_location('bf', P('fix_or-massive-transfusion_blankwrong.py'))
bf = importlib.util.module_from_spec(spec); spec.loader.exec_module(bf)
BW = dict(bf.B)   # "si-j": [wrong x3]
for k, wrong in BW.items():
    x = sent(k); b = x['blank']
    ans = d2['blank_answer'].get(k, b['answer'])
    b['answer'] = ans
    b['options'] = [{'en': ans}] + [{'en': w} for w in wrong]
for k, (ans, wrong) in d2['blank_override'].items():
    x = sent(k)
    x['blank'] = {'answer': ans, 'options': [{'en': ans}] + [{'en': w} for w in wrong]}

# ---- 3. 단어 ---------------------------------------------------------------
for wid, fields in d3['words'].items():
    for f, v in fields.items():
        W[wid][f] = v

# ---- 4. 뉘앙스 ------------------------------------------------------------
for ed in d3['nuance']:
    s = S[ed['situation']]
    items = [n for n in s['nuance'] if n['kind'] == ed['kind']]
    n = items[ed.get('nth', 0)]
    for f, v in ed['set'].items():
        if f.startswith('notes.'):
            n['notes'][f[6:]] = v
        elif f.startswith('scene'):
            m = re.match(r'scene(\d)\.(\w+)', f)
            n['scenes'][int(m.group(1))][m.group(2)] = v
        else:
            n[f] = v
    if 'scenes' in ed:
        n['scenes'] = ed['scenes']

# ---- 5. 순서 카드 ----------------------------------------------------------
for si, ed in d3['order'].items():
    o = S[int(si)]['order']
    if 'why' in ed: o['why'] = ed['why']
    for i, ln in ed.get('lines', {}).items():
        o['lines'][int(i)].update(ln)
    if 'all_lines' in ed:
        o['lines'] = ed['all_lines']

# ---- 6. exKo 맞추기 (example이 문장 en과 같으면 그 문장의 ko로) ---------------------
en2ko = {}
for s in S:
    for x in s['sentences']:
        en2ko[x['en']] = x['ko']
for w in d['words']:
    if w['example'] in en2ko:
        w['exKo'] = en2ko[w['example']]
for s in S:
    for n in s['nuance']:
        if n.get('example') in en2ko:
            n['exKo'] = en2ko[n['example']]

# ---- 7. 저장 ---------------------------------------------------------------
out = yaml.safe_dump(d, allow_unicode=True, sort_keys=False, width=100000)
open(P(f'{T}.yaml'), 'w', encoding='utf-8').write(out)

# ---- 8. changes ------------------------------------------------------------
ch = load(f'changes-{T}.pre-fix.yaml')
covered = set()
for c in ch['changes']:
    if c['kind'] == 'sentence':
        for f in c['fields']: covered.add(('s', c['situation'], c['index'], f))
    if c['kind'] == 'word':
        for f in c['fields']: covered.add(('w', c['id'], f))
new = []
BS = {s['title']: s for s in base['situations']}
for si, s in enumerate(S):
    bs = BS[s['title']]
    for j, x in enumerate(s['sentences']):
        b = bs['sentences'][j]
        fs = [f for f in ('en', 'ko', 'chunks', 'words') if x[f] != b[f] and ('s', s['title'], j, f) not in covered]
        if fs:
            new.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': fs,
                        'why': 'B/A 수정 목록 반영 — ' + {'en': '문장 고침', 'ko': 'ko 고침', 'chunks': '구 경계 조각', 'words': '태그'}[fs[0]]})
BW_ = {w['id']: w for w in base['words']}
for w in d['words']:
    b = BW_.get(w['id'])
    if not b: continue
    fs = [f for f in ('en', 'ipa', 'ko', 'icon', 'example') if w[f] != b[f] and ('w', w['id'], f) not in covered]
    if fs:
        new.append({'kind': 'word', 'id': w['id'], 'fields': fs, 'why': '수정 목록 반영(ko·example 정리)'})
ch['changes'] = ch['changes'] + new
open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8').write(yaml.safe_dump(ch, allow_unicode=True, sort_keys=False, width=100000))
print('changes added:', len(new), 'total', len(ch['changes']))
