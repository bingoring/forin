#!/usr/bin/env python3
"""or-bleeding 수정 스크립트 — pre-fix를 읽어 or-bleeding.yaml과 changes-or-bleeding.yaml을 다시 쓴다(다시 돌려도 같은 결과).
순서: 원본(pre-fix) → B 검토 사본 차이(data_1) → 수정 담당 값(data_2)."""
import copy, re, yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/'
load = lambda f: yaml.safe_load(open(D + f))
pre = load('or-bleeding.pre-fix.yaml')
d1 = load('fix_or-bleeding_data_1.yaml')
d2 = load('fix_or-bleeding_data_2.yaml')
old_changes = load('changes-or-bleeding.pre-fix.yaml')
out = copy.deepcopy(pre)
S = out['situations']
W = {w['id']: w for w in out['words']}


def set_path(obj, path, val):
    keys = path.split('.')
    for k in keys[:-1]:
        obj = obj[int(k)] if isinstance(obj, list) else obj[k]
    k = keys[-1]
    if isinstance(obj, list):
        obj[int(k)] = val
    else:
        assert k in obj or True
        obj[k] = val


def sent(key):
    i, j = map(int, key.split('.'))
    return S[i]['sentences'][j]

# 1) B 검토 사본의 차이
for key, ch in d1['sentences'].items():
    sent(key).update(copy.deepcopy(ch))
for i, o in d1['order'].items():
    S[int(i)]['order'] = copy.deepcopy(o)

# 2) 수정 담당 값 — 문장
for key, ch in d2['sentences'].items():
    sent(key).update(copy.deepcopy(ch))

# 3) 단어 삭제와 태그 정리
for wid in d2['remove_words']:
    del W[wid]
    out['words'] = [w for w in out['words'] if w['id'] != wid]
for s in S:
    for x in s['sentences']:
        x['words'] = [w for w in x['words'] if w in W]
    for n in s['nuance']:
        assert all(w in W for w in n['words']), n

# 4) 단어 필드
for wid, ch in d2['words'].items():
    W[wid].update(copy.deepcopy(ch))

# 5) 예문이 바뀐 단어 — example·exKo를 문장에 맞춘다
pre_s = [(x['en'], x['ko']) for s in pre['situations'] for x in s['sentences']]
new_s = [(x['en'], x['ko']) for s in S for x in s['sentences']]
en2new = {a[0]: b for a, b in zip(pre_s, new_s)}
exlog = []
for w in out['words']:
    if w['example'] in en2new:
        en, ko = en2new[w['example']]
        if (w['example'], w['exKo']) != (en, ko):
            exlog.append((w['id'], w['example'], en))
            w['example'], w['exKo'] = en, ko

# 6) 뉘앙스·order
for key, patch in d2['nuance'].items():
    i, j = map(int, key.split('.'))
    for p, v in patch.items():
        set_path(S[i]['nuance'][j], p, copy.deepcopy(v))
for key, patch in d2['order'].items():
    for p, v in patch.items():
        set_path(S[int(key)]['order'], p, copy.deepcopy(v))

yaml.safe_dump(out, open(D + 'or-bleeding.yaml', 'w'), allow_unicode=True, width=1000, sort_keys=False)

# 7) changes — 원본 changes에 이번 수정의 v44 필드 변경을 합친다
cw = d2['change_why']
changes = []
for c in old_changes['changes']:
    c = dict(c)
    c['why'] = re.sub(r'(너무 쉬움 — )+', '너무 쉬움 — ', c['why'])
    changes.append(c)
idx_w = {(c['kind'], c['id']): c for c in changes if 'id' in c}
idx_s = {(c['situation'], c['index']): c for c in changes if c['kind'] == 'sentence'}
log = []
for wid in d2['remove_words']:
    changes.append({'kind': 'word-remove', 'id': wid, 'why': cw['r:' + wid]})
    log.append('word-remove ' + wid)
pw = {w['id']: w for w in pre['words']}
for w in out['words']:
    f = [k for k in ['en', 'ko', 'ipa', 'icon', 'example'] if w[k] != pw[w['id']][k]]
    if f:
        e = idx_w.get(('word', w['id']))
        if e:
            e['fields'] = sorted(set(e['fields']) | set(f), key=['en', 'ko', 'ipa', 'icon', 'example'].index)
            if 'w:' + w['id'] in cw: e['why'] += ' / ' + cw['w:' + w['id']]
        else:
            changes.append({'kind': 'word', 'id': w['id'], 'fields': f, 'why': cw.get('w:' + w['id'], '예문을 따라감')})
        log.append(f"word {w['id']} {f}")
for si, (sp, so) in enumerate(zip(pre['situations'], S)):
    for j, (xp, xo) in enumerate(zip(sp['sentences'], so['sentences'])):
        f = [k for k in ['en', 'ko', 'chunks', 'words'] if xp[k] != xo[k]]
        if not f:
            continue
        key = (so['title'], j)
        e = idx_s.get(key)
        order = ['en', 'ko', 'chunks', 'words']
        why = cw.get(f's:{si}.{j}')
        if e:
            e['fields'] = sorted(set(e['fields']) | set(f), key=order.index)
            if why: e['why'] = why + ' / ' + e['why']
        else:
            changes.append({'kind': 'sentence', 'situation': so['title'], 'index': j, 'fields': f, 'why': why or '쉬운 단어 태그 정리'})
        log.append(f"sentence {si}.{j} {f}")
yaml.safe_dump({'theme': 'or-bleeding', 'changes': changes}, open(D + 'changes-or-bleeding.yaml', 'w'), allow_unicode=True, width=1000, sort_keys=False)
print('changes', len(changes), '(원본', len(old_changes['changes']), ')')
print('\n'.join(log))
print('exlog', exlog)
