#!/usr/bin/env python3
"""core-language-or 수정(A·B 검토 반영). pre-fix를 읽어 core-language-or.yaml을 쓴다(다시 돌려도 같은 결과)."""
import copy, os, shutil, yaml

D = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(D, n)
T = 'core-language-or'

def load(n):
    with open(P(n), encoding='utf-8') as f:
        return yaml.safe_load(f)

pre = load(f'{T}.pre-fix.yaml')
after = load(f'_reviewB_{T}_after.yaml')   # B 검토자가 값을 넣어 검사까지 통과시킨 사본
d1, d2, d3, d4 = (load(f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3, 4))

# changes 원본 보관(처음 한 번만)
base_changes = P(f'changes-{T}.pre-fix.yaml')
if not os.path.exists(base_changes):
    shutil.copy(P(f'changes-{T}.yaml'), base_changes)
changes = load(f'changes-{T}.pre-fix.yaml')

d = copy.deepcopy(pre)
S = d['situations']

# 1) B 몫: 문장 distractorsKo·blank·decoy·why, order 통째로
for i, s in enumerate(S):
    a = after['situations'][i]
    for j, x in enumerate(s['sentences']):
        y = a['sentences'][j]
        assert x['en'] == y['en']
        for k in ('distractorsKo', 'blank', 'decoy', 'why'):
            x[k] = copy.deepcopy(y[k])
    s['order'] = copy.deepcopy(a['order'])

# 2) A 몫 문장
def sent(at):
    return S[at[0]]['sentences'][at[1]]

for r in d1['rewrite']:
    x = sent(r['at'])
    for k in ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy', 'distractorsKo'):
        if k in r:
            x[k] = r[k]
    # 빈칸: 문장이 바뀌면 answer가 en에 한 번 있는지는 검사기가 본다. 필요한 곳만 blank 지정
    if 'blank' in r:
        x['blank'] = r['blank']
for r in d1['ko_only']:
    x = sent(r['at'])
    x['ko'] = r['ko']
    if 'chunks' in r:
        x['chunks'] = r['chunks']
    if 'distractorsKo' in r:
        x['distractorsKo'] = r['distractorsKo']
for r in d1['chunks_only']:
    sent(r['at'])['chunks'] = r['chunks']
for r in d1['words_only']:
    sent(r['at'])['words'] = r['words']

# 3) 단어
W = {w['id']: w for w in d['words']}
for wid, f in d2['words'].items():
    W[wid].update(f)
ko_by_en = {}
for s in S:
    for x in s['sentences']:
        ko_by_en[x['en']] = x['ko']
for w in d['words']:
    if w['example'] in ko_by_en:
        w['exKo'] = ko_by_en[w['example']]

# 4) 뉘앙스
old2new = {
    'I need to know the interpreter caught every word correctly.': "If the interpreter didn't catch a word, I need to know.",
}
for r in d3['nuance']:
    i, kind = r['at']
    n = next(n for n in S[i]['nuance'] if n['kind'] == kind)
    for k, v in r.items():
        if k == 'at':
            continue
        if k == 'scenes':
            for idx, sc in v.items():
                n['scenes'][int(idx)].update(sc)
        else:
            n[k] = v
for s in S:
    for n in s['nuance']:
        if n.get('example') in old2new:
            n['example'] = old2new[n['example']]
        if n.get('example') in ko_by_en:
            n['exKo'] = ko_by_en[n['example']]

# 5) order 덧쓰기
for r in d4['order']:
    o = S[r['at']]['order']
    if 'why' in r:
        o['why'] = r['why']
    for idx, f in (r.get('lines') or {}).items():
        o['lines'][int(idx)].update(f)

# 6) changes: pre-fix 대비 v44 필드 차이를 전부 적는다
SW = ['en', 'ko', 'chunks', 'words']
WF = ['en', 'ko', 'ipa', 'icon', 'example']
WHY_W = {
    'w-scared': 'ko "무서운"은 scary의 뜻 — 겁먹은 (검토 K1)',
    'w-keep': '예문 Keep it simple(유지하다)과 ko 계속하다가 한 카드에 섞임 — 예문을 계속 뜻으로 (검토 K2)',
    'w-under': '문장은 under emergency provisions(규정에 따라) — ko ~하에서 (검토 K3)',
    'w-critical': 'critical error는 중대한 오류, 치명적은 과장 (검토 K4)',
    'w-line': 'on the line·interpreting line은 통화 연결 — 회선 (검토 K5)',
    'w-find': '예문을 새 문장(A6)이 아니라 cue와 맞는 수어 통역사 문장으로',
    'w-moment': '예문 문장(A7)이 바뀌어 17번 상황 문장으로 옮김',
}
pre_s = {(s['title'], j): x for s in pre['situations'] for j, x in enumerate(s['sentences'])}
new_changes = []
for s in S:
    for j, x in enumerate(s['sentences']):
        o = pre_s[(s['title'], j)]
        f = [k for k in SW if x[k] != o[k]]
        if f:
            new_changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': f,
                                'why': '검토 A·B 반영 — ' + ('문장 en·ko 고침(역할·지킬 수 없는 약속·사실 오류)' if 'en' in f else
                                                          ('ko만 고침(부자연·뜻 어긋남)' if f == ['ko'] else
                                                           ('chunks 구 경계 고침' if f == ['chunks'] else 'words 태그 정리')))})
pre_w = {w['id']: w for w in pre['words']}
for w in d['words']:
    o = pre_w[w['id']]
    f = [k for k in WF if w[k] != o[k]]
    if f:
        new_changes.append({'kind': 'word', 'id': w['id'], 'fields': f,
                            'why': WHY_W.get(w['id'], '새 문장에 맞춰 예문 고침 (A 재작성)')})
changes['changes'] = list(changes['changes']) + new_changes

def dump(obj, name):
    with open(P(name), 'w', encoding='utf-8') as f:
        yaml.safe_dump(obj, f, allow_unicode=True, sort_keys=False, width=1000)

dump(d, f'{T}.yaml')
dump(changes, f'changes-{T}.yaml')
print('changes 총', len(changes['changes']), '(새로', len(new_changes), ')')
