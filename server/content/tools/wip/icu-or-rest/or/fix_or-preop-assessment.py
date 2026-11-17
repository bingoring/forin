#!/usr/bin/env python3
"""or-preop-assessment 수정 — pre-fix를 읽어 or-preop-assessment.yaml을 다시 쓴다(여러 번 돌려도 같다).
순서: ① B 검토자 사본의 B 몫 필드(distractorsKo·blank·decoy·why·tag, order) 가져오기 ② A 문장 수정 ③ 단어 ④ 뉘앙스·order ⑤ changes 다시 만들기."""
import copy, json, os, yaml
D = os.path.dirname(os.path.abspath(__file__))
T = 'or-preop-assessment'
P = lambda n: os.path.join(D, n)
L = lambda n: yaml.safe_load(open(P(n), encoding='utf-8'))
a = L(f'{T}.pre-fix.yaml'); b = L(f'_reviewB_{T}_after.yaml')
d1, d2, d3 = L(f'fix_{T}_data_1.yaml'), L(f'fix_{T}_data_2.yaml'), L(f'fix_{T}_data_3.yaml')
orig = copy.deepcopy(a)
S = a['situations']; W = {w['id']: w for w in a['words']}

# ① B 몫
for i, (sa, sb) in enumerate(zip(S, b['situations'])):
    for j, (x, y) in enumerate(zip(sa['sentences'], sb['sentences'])):
        assert x['en'] == y['en'], (i, j)
        for k in ('tag', 'icon', 'why', 'decoy', 'distractorsKo', 'blank'):
            x[k] = copy.deepcopy(y[k])
    sa['order'] = copy.deepcopy(sb['order'])

# ② 문장
def sent(key):
    i, j = map(int, key.split('.')); return S[i]['sentences'][j]
for key, v in d1['sentences'].items():
    s = sent(key); old_en, old_ko = s['en'], s['ko']
    for k in ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy', 'distractorsKo'):
        if k in v: s[k] = v[k]
    if 'blank' in v:
        s['blank'] = {'answer': v['blank']['answer'], 'options': [{'en': o} for o in v['blank']['options']]}
    if s['en'] != old_en or s['ko'] != old_ko:
        for w in a['words']:
            if w['example'] == old_en:
                if s['words'] and w['id'] in s['words']:
                    w['example'], w['exKo'] = s['en'], s['ko']
                elif key == '1.4':
                    pass
                else:
                    raise SystemExit(f'{w["id"]} example orphaned by {key}')
            elif w['exKo'] == old_ko and w['example'] == s['en']:
                w['exKo'] = s['ko']
for w, key in d1['example_moves'].items():
    s = sent(key); W[w]['example'], W[w]['exKo'] = s['en'], s['ko']
for key, add in d1['why_append'].items():
    s = sent(key)
    if add.strip() not in s['why']: s['why'] += add
# 1.4: w-sound/w-allergy 등 옛 1.4 example 정리(w-allergy는 새 1.4가 처리, w-side·w-effect는 삭제)

# 해산물 → 갑각류·조개류 (문장 ko·오답·exKo·order 줄·뉘앙스 ko, 제목·order 머리말은 그대로)
def rep(s): return s.replace('해산물', '갑각류·조개류')
for sit in S:
    for s in sit['sentences']:
        s['ko'] = rep(s['ko']); s['distractorsKo'] = [rep(x) for x in s['distractorsKo']]
    for ln in sit['order']['lines']: ln['ko'] = rep(ln['ko'])
    for n in sit['nuance']:
        for k in ('ko', 'exKo', 'why'):
            if k in n: n[k] = rep(n[k])
for w in a['words']:
    w['exKo'] = rep(w['exKo'])
def walk_rep(o):
    if isinstance(o, dict): return {rep(k) if isinstance(k, str) else k: walk_rep(v) for k, v in o.items()}
    if isinstance(o, list): return [walk_rep(v) for v in o]
    return rep(o) if isinstance(o, str) else o
for sit in S:
    for k in ('sentences', 'nuance'):
        sit[k] = walk_rep(sit[k])
    sit['order']['why'] = rep(sit['order']['why'])
    for ln in sit['order']['lines']: ln['note'] = rep(ln['note'])

# w-exactly
for sit in S:
    for s in sit['sentences']:
        if 'xactly' in s['en'] and 'w-exact' in s['words']:
            s['words'] = ['w-exactly' if x == 'w-exact' else x for x in s['words']]

# ③ 단어
for wid, v in d2['edit'].items():
    for k, val in v.items():
        if k != 'why': W[wid][k] = val
for wid, m in d2['decoy_chip_fix'].items():
    W[wid]['decoyChips'] = [m.get(c, c) for c in W[wid]['decoyChips']]
ad = d2['add_after_w_exact']
s60 = sent(ad['example_from'])
new = {'id': ad['id'], 'en': ad['en'], 'ipa': ad['ipa'], 'ko': ad['ko'], 'icon': W['w-exact']['icon'],
       'example': s60['en'], 'cue': ad['cue'], 'tag': ad['tag'], 'distractorsEn': ad['distractorsEn'],
       'distractorsKo': ad['distractorsKo'], 'chips': ad['chips'], 'decoyChips': ad['decoyChips'], 'exKo': s60['ko']}
ix = [w['id'] for w in a['words']].index('w-exact')
a['words'].insert(ix + 1, new); W['w-exactly'] = new
rm = {r['id'] for r in d2['remove']}
a['words'] = [w for w in a['words'] if w['id'] not in rm]

# ④ 뉘앙스·order
def nu(key):
    i, n = map(int, key.split('.')); return S[i]['nuance'][n]
for key, v in d3['slider_patch'].items():
    n = nu(key)
    for k in ('cue', 'example', 'exKo'):
        if k in v: n[k] = v[k]
    if 'why_append' in v and v['why_append'].strip() not in n['why']: n['why'] += v['why_append']
for key, v in d3['context_patch'].items():
    n = nu(key)
    if 'scene' in v:
        sc = n['scenes'][v['scene']]; sc['en'] = v['en']
        if 'fix' in v: sc['fix'] = v['fix']
    if 'ko' in v: n['ko'] = v['ko']
    if 'why' in v: n['why'] = v['why']
for key, v in d3['swap_new'].items():
    i, n = map(int, key.split('.')); S[i]['nuance'][n] = copy.deepcopy(v)
# 4.1 swap 문법
n = nu('4.1'); p = d3['swap_patch']['4.1']
txt = json.dumps(n, ensure_ascii=False)
txt = txt.replace(p['old_before1'], p['before1']).replace(p['old_ans'], p['new_ans'])
S[4]['nuance'][1] = json.loads(txt)
nu('6.1')['ko'] = d3['swap_patch']['6.1']['ko']; nu('16.1')['ko'] = d3['swap_patch']['16.1']['ko']
# 뉘앙스 example 중 옛 문장과 같은 것은 새 문장으로
newen = {}
for key, v in d1['sentences'].items():
    if 'en' in v: newen[orig['situations'][int(key.split('.')[0])]['sentences'][int(key.split('.')[1])]['en']] = (v['en'], v['ko'])
for sit in S:
    for n in sit['nuance']:
        if n.get('example') in newen: n['example'], n['exKo'] = newen[n['example']]
for key, v in d3['orders'].items():
    o = S[int(key)]['order']
    if 'why' in v: o['why'] = v['why']
    for idx, f in v.get('lines', {}).items(): o['lines'][idx].update(f)

# ⑤ 쓰기
class Dm(yaml.SafeDumper): pass
out = yaml.dump(a, Dumper=Dm, allow_unicode=True, sort_keys=False, width=10**6)
open(P(f'{T}.yaml'), 'w', encoding='utf-8').write(out)

# changes: pre-fix 원본 changes + V44 키 차이
ch = L(f'changes-{T}.pre-fix.yaml'); lst = ch['changes']
WK = ('id', 'en', 'ko', 'ipa', 'icon', 'example'); SK = ('en', 'ko', 'chunks', 'words', 'goal')
ow = {w['id']: w for w in orig['words']}; nw = {w['id']: w for w in a['words']}
def merge_word(wid, fields, why):
    for c in lst:
        if c['kind'] == 'word' and c['id'] == wid:
            c['fields'] = sorted(set(c['fields']) | set(fields)); c['why'] += ' / ' + why; return
    lst.append({'kind': 'word', 'id': wid, 'fields': sorted(fields), 'why': why})
for wid, w in ow.items():
    if wid in nw:
        f = [k for k in WK if w.get(k) != nw[wid].get(k)]
        if f:
            why = d2['edit'].get(wid, {}).get('why') or '문장 수정에 맞춰 예문·번역을 새 문장으로'
            merge_word(wid, f, why)
for r in d2['remove']:
    lst.append({'kind': 'word-remove', 'id': r['id'], 'why': r['why']})
lst.append({'kind': 'word-add', 'id': 'w-exactly', 'why': ad['why']})
for si, (so, sn) in enumerate(zip(orig['situations'], S)):
    for j, (x, y) in enumerate(zip(so['sentences'], sn['sentences'])):
        f = [k for k in SK if x.get(k) != y.get(k)]
        if f:
            why = '검토 수정 — ' + ('문장 en·ko를 사실·업무 범위에 맞게 고침(keyPhrase 아님)' if 'en' in f else
                  'keyPhrase ko 번역만 고침' if f == ['ko'] else 'chunks를 구 경계에 맞게 다시 끊음' if f == ['chunks'] else '태그 정리(w-exact → w-exactly)' if f == ['words'] else '문장 수정')
            for c in lst:
                if c['kind'] == 'sentence' and c['situation'] == so['title'] and c['index'] == j:
                    c['fields'] = sorted(set(c['fields']) | set(f)); c['why'] += ' / ' + why; break
            else:
                lst.append({'kind': 'sentence', 'situation': so['title'], 'index': j, 'fields': f, 'why': why})
open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8').write(yaml.dump(ch, allow_unicode=True, sort_keys=False, width=10**6))
print('written; changes', len(lst))
