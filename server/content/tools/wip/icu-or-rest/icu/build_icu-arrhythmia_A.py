#!/usr/bin/env python3
"""icu-arrhythmia A쪽: base에 단어 v45 필드 + 결정 11 정리 + 상황 nuance를 얹는다."""
import glob, yaml, io, sys
T = 'icu-arrhythmia'
base = yaml.safe_load(io.open(f'base-{T}.yaml', encoding='utf-8'))

REMOVE = ['minute','now','doctor','patient','hour','see','know','go','come','time','let','get','second',
          'phone','everybody','anything','up','down','bed']
REMOVE = ['w-' + x for x in REMOVE]
KO = {  # 단어 ko 변경(같은 뜻 단어 가르기·헤드워드 맞추기)
 'w-push': '밀어 넣다·힘주다', 'w-check': '점검하다', 'w-document': '문서로 남기다', 'w-drug': '약',
 'w-away': '당장', 'w-risk': '위험성', 'w-quick': '신속한', 'w-monitor': '모니터(감시하다)',
 'w-skip': '건너뛰다', 'w-beat': '뛰다(박동)',
}
# 문장 words 태그에서 뺄 것: (상황 index, 문장 index, 단어 id)
UNTAG = [(17, 4, 'w-long'), (18, 3, 'w-run'), (12, 0, 'w-right')]

# --- 단어 데이터
data = {}
for f in sorted(glob.glob(f'add_{T}_A_words_*.txt')):
    for ln in io.open(f, encoding='utf-8'):
        ln = ln.strip()
        if not ln or ln.startswith('#'): continue
        p = [x.strip() for x in ln.split('|')]
        assert len(p) == 7, ln
        wid, cue, tag, den, dko, chips, decoy = p
        data['w-' + wid] = dict(
            cue=cue, tag=tag,
            distractorsEn=[x.strip() for x in den.split(';')],
            distractorsKo=[x.strip() for x in dko.split(';')],
            chips=[w.split('.') for w in chips.split(' ')],
            decoyChips=[x.strip() for x in decoy.split(';')])

# --- 문장 정리
sit_idx = {s['title']: i for i, s in enumerate(base['situations'])}
changes = []
rm = set(REMOVE)
ko_by_en = {}
for si, s in enumerate(base['situations']):
    for i, x in enumerate(s['sentences']):
        ko_by_en[x['en']] = x['ko']
        old = list(x['words'])
        new = [w for w in old if w not in rm and (si, i, w) not in {(a, b, c) for a, b, c in UNTAG}]
        if new != old:
            gone = [w for w in old if w not in new]
            x['words'] = new
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': i, 'fields': ['words'],
                            'why': '쉬운 단어·헤드워드와 맞지 않는 태그 빼기: ' + ', '.join(gone)})

# --- 단어
words = []
for w in base['words']:
    if w['id'] in rm:
        changes.append({'kind': 'word-remove', 'id': w['id'], 'why': '너무 쉬움(공통 쉬운 단어 또는 판단분) — 어느 문장도 태그하지 않게 됐다'})
        continue
    if w['id'] in KO:
        w['ko'] = KO[w['id']]
        changes.append({'kind': 'word', 'id': w['id'], 'fields': ['ko'], 'why': '헤드워드 뜻을 태그된 문장·같은 뜻 단어와 맞춰 더 정확하게'})
    d = data.pop(w['id'])
    w['cue'] = d['cue']
    w['exKo'] = ko_by_en[w['example']]
    w['tag'] = d['tag']
    for k in ('distractorsEn', 'distractorsKo', 'chips', 'decoyChips'):
        w[k] = d[k]
    words.append(w)
assert not data, list(data)
base['words'] = words

# --- 뉘앙스
for f in sorted(glob.glob(f'add_{T}_A_nuance_*.yaml')):
    for si, items in (yaml.safe_load(io.open(f, encoding='utf-8')) or {}).items():
        base['situations'][int(si)]['nuance'] = items

out = {'theme': base['theme'], 'words': base['words'], 'situations': base['situations']}
with io.open(f'{T}.A.yaml', 'w', encoding='utf-8') as fh:
    yaml.safe_dump(out, fh, allow_unicode=True, sort_keys=False, width=1000)
with io.open(f'changes-{T}.yaml', 'w', encoding='utf-8') as fh:
    yaml.safe_dump({'theme': T, 'changes': changes}, fh, allow_unicode=True, sort_keys=False, width=1000)
print('words', len(words), 'changes', len(changes))
