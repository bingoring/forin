#!/usr/bin/env python3
"""icu-endocrine-crisis 수정 — pre-fix.yaml 을 읽어 data_1~4.yaml 을 반영해 icu-endocrine-crisis.yaml 을 다시 쓴다.
다시 돌려도 같은 결과(항상 pre-fix 에서 시작). changes-…yaml 은 CHG_BASE(첫 실행 전 사본)에서 시작해 이어 적는다."""
import copy, os, re, shutil, sys, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
T = 'icu-endocrine-crisis'
P = lambda n: os.path.join(HERE, n)
YL = lambda n: yaml.safe_load(open(P(n), encoding='utf-8'))
DUMP = dict(allow_unicode=True, sort_keys=False, width=1000)

pre = YL(f'{T}.pre-fix.yaml')
d = copy.deepcopy(pre)
D1, D2, D3, D4 = (YL(f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3, 4))
S = d['situations']
W = {w['id']: w for w in d['words']}

def loc(key):
    m = re.match(r'^(\d+)\.(\d+)', key)
    return int(m.group(1)), int(m.group(2))

def opts(lst):
    return [{'en': x} for x in lst]

# ---- 1. 문장 patch (data_2) -------------------------------------------------
sent_changed = {}   # (s,i) -> (old_en, old_ko)
for key, p in D2['sent'].items():
    s, i = loc(key)
    x = S[s]['sentences'][i]
    assert x['en'] == p['old'], (key, x['en'])
    old_en, old_ko = x['en'], x['ko']
    for f in ('en', 'ko', 'chunks', 'tag', 'icon', 'why', 'decoy', 'words'):
        if f in p:
            x[f] = p[f]
    if 'blank' in p:
        x['blank'] = {'answer': p['blank']['answer'], 'options': opts(p['blank']['options'])}
    for w in p.get('words_remove', []):
        assert w in x['words'], (key, w)
        x['words'].remove(w)
    for w in p.get('words_add', []):
        x['words'].append(w)
    if x['en'] != old_en or x['ko'] != old_ko:
        prev = sent_changed.get((s, i), (old_en, old_ko))
        sent_changed[(s, i)] = prev

# ---- 2. distractorsKo (data_1) ----------------------------------------------
for key, pair in D1['dk'].items():
    s, i = loc(key)
    assert len(pair) == 2
    S[s]['sentences'][i]['distractorsKo'] = list(pair)

# ---- 3. 예문 cascade — 바뀐 문장을 example 로 쓰는 단어 + 뉘앙스 example ----------
cascade_words = {}
for (s, i), (old_en, old_ko) in sent_changed.items():
    x = S[s]['sentences'][i]
    for w in d['words']:
        if w['example'] == old_en:
            if x['en'] != old_en:
                w['example'] = x['en']
            w['exKo'] = x['ko']
            cascade_words.setdefault(w['id'], set()).add('example' if x['en'] != old_en else 'exKo')
        elif w['example'] == x['en'] and w.get('exKo') == old_ko:
            w['exKo'] = x['ko']
            cascade_words.setdefault(w['id'], set()).add('exKo')
    for st in S:
        for n in st.get('nuance', []):
            if n.get('example') == old_en:
                n['example'] = x['en']; n['exKo'] = x['ko']
            elif n.get('example') == x['en'] and n.get('exKo') == old_ko:
                n['exKo'] = x['ko']

# ---- 4. 단어 patch (data_3) -------------------------------------------------
for wid, p in D3['words'].items():
    w = W['w-' + wid]
    for k, v in p['set'].items():
        w[k] = v
for wid, m in D3['dEn'].items():
    w = W['w-' + wid]
    for old, new in m.items():
        assert old in w['distractorsEn'], (wid, old, w['distractorsEn'])
        w['distractorsEn'] = [new if t == old else t for t in w['distractorsEn']]
for wid, m in D3['decoy'].items():
    w = W['w-' + wid]
    for old, new in m.items():
        assert old in w['decoyChips'], (wid, old)
        w['decoyChips'] = [new if t == old else t for t in w['decoyChips']]

# w-scale 삭제 (6.3 이 인슐린 프로토콜로 바뀌어 어느 문장도 태그하지 않음)
used = {wid for st in S for x in st['sentences'] for wid in x['words']}
used |= {wid for st in S for n in st.get('nuance', []) for wid in n.get('words', [])}
removed_words = []
for w in list(d['words']):
    if w['id'] == 'w-scale':
        assert 'w-scale' not in used
        d['words'].remove(w); removed_words.append(w['id'])

# ---- 5. 뉘앙스 patch (data_4) -------------------------------------------------
for p in D4['nuance']:
    n = S[p['s']]['nuance'][p['n']]
    for k, v in p.get('set', {}).items():
        n[k] = v
    for idx, f in p.get('scenes', {}).items():
        n['scenes'][int(idx)].update(f)
    for k, v in p.get('notes_patch', {}).items():
        assert k in n['notes'], k
        n['notes'][k] = v

# ---- 6. order patch -----------------------------------------------------------
for p in D4['order']:
    o = S[p['s']]['order']
    if 'why' in p:
        o['why'] = p['why']
    if 'ko' in p:
        o['ko'] = p['ko']
    for pos, f in p.get('lines', {}).items():
        line = o['lines'][int(pos) - 1]
        for k, v in f.items():
            line[k] = v

# ---- 7. 저장 ---------------------------------------------------------------------
open(P(f'{T}.yaml'), 'w', encoding='utf-8').write(yaml.safe_dump(d, **DUMP))

# ---- 8. 변경 목록(changes-…yaml) ----------------------------------------------------
base_chg = P(f'changes-{T}.base.yaml')
if not os.path.exists(base_chg):
    shutil.copy(P(f'changes-{T}.yaml'), base_chg)
chg = yaml.safe_load(open(base_chg, encoding='utf-8'))
chg_list = chg['changes']
V44W = ('id', 'en', 'ko', 'ipa', 'icon', 'example')
V44S = ('en', 'ko', 'chunks', 'words', 'goal')
preW = {w['id']: w for w in pre['words']}
nowW = {w['id']: w for w in d['words']}
WHY_W = {
    'en': '검토 반영 — 구동사 헤드워드(문장은 look for·weigh in 으로만 쓴다)',
    'ko': '검토 반영 — ko를 쓰임에 맞게',
    'ipa': '검토 반영 — 헤드워드를 바꾸며 발음기호도',
    'example': '검토 반영 — 예문이 바뀐 문장이거나 쓰임에 맞는 문장으로',
}
def merge_word(wid, fields, why):
    for c in chg_list:
        if c.get('kind') == 'word' and c.get('id') == wid:
            c['fields'] = [f for f in V44W if f in set(c['fields']) | set(fields)]
            c['why'] = c['why'] + ' / ' + why
            return
    chg_list.append({'kind': 'word', 'id': wid, 'fields': [f for f in V44W if f in fields], 'why': why})
added_log = []
for wid, w in nowW.items():
    pw = preW.get(wid)
    if not pw:
        continue
    fl = [f for f in V44W if pw.get(f) != w.get(f)]
    if fl:
        why = '검토 반영(v46 수정) — ' + ', '.join(f'{f}: {WHY_W.get(f, "")[7:]}' for f in fl)
        merge_word(wid, fl, why)
        added_log.append((wid, fl))
for wid in removed_words:
    chg_list.append({'kind': 'word-remove', 'id': wid, 'why': '검토 반영 — 6.3 이 sliding scale 에서 insulin protocol 로 바뀌어 어느 문장도 태그하지 않는다(w-protocol 사용)'})
preS = {(st['title'], i): x for st in pre['situations'] for i, x in enumerate(st['sentences'])}
SWHY = {
    (18, 3): '확인 전 원인 단정(must be) → 추정(may be)으로, 문장 안전',
    (8, 4): '전환·용량은 처방자 몫 — 팀에 물어보는 말로',
    (6, 3): 'DKA 정맥 점적을 sliding scale 이라 부른 용어 오류 → insulin protocol',
    (9, 3): '나트륨만 말한 설명에 혈당을 더해 같은 상황 다른 문장과 맞춤',
    (14, 3): '"correct him"은 부자연스럽다(교정하는 것은 수치)',
    (17, 3): '관사 빠짐(a true adrenal crisis)과 명사구 끊김',
    (17, 4): '차트 말투(The pressor is titrating up)를 말로',
}
for si, st in enumerate(S):
    for i, x in enumerate(st['sentences']):
        px = preS[(st['title'], i)]
        fl = [f for f in V44S if px.get(f) != x.get(f)]
        if not fl:
            continue
        why = SWHY.get((si, i))
        if why is None:
            if fl == ['words']:
                why = '쉬운·뜻이 갈리는 단어 태그 빼기'
            elif fl == ['ko']:
                why = 'keyPhrase 한국어 번역을 자연스럽게(en·chunks 불변)'
            elif fl == ['chunks']:
                why = '구 경계에서 쪼개도록 chunks 정리'
            else:
                why = '검토 반영'
        merged = False
        for c in chg_list:
            if c.get('kind') == 'sentence' and c.get('situation') == st['title'] and c.get('index') == i:
                c['fields'] = [f for f in V44S if f in set(c['fields']) | set(fl)]
                c['why'] = c['why'] + ' / ' + why
                merged = True
        if not merged:
            chg_list.append({'kind': 'sentence', 'situation': st['title'], 'index': i, 'fields': fl, 'why': why})
        added_log.append((f'{si}.{i}', fl))
chg['changes'] = chg_list
open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8').write(yaml.safe_dump(chg, **DUMP))

# ---- 9. 필드 단위 비교 출력 ----------------------------------------------------------
def walk(a, b, path, out):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in list(a) + [k for k in b if k not in a]:
            walk(a.get(k), b.get(k), path + [k], out)
    elif isinstance(a, list) and isinstance(b, list) and len(a) == len(b) and any(isinstance(t, (dict, list)) for t in a):
        for j, (u, v) in enumerate(zip(a, b)):
            walk(u, v, path + [j], out)
    elif a != b:
        out.append((path, a, b))
diffs = []
for si, (a, b) in enumerate(zip(pre['situations'], S)):
    walk(a, b, [si], diffs)
pw_ids = [w['id'] for w in pre['words']]
for wid in pw_ids:
    if wid in nowW:
        walk(preW[wid], nowW[wid], [wid], diffs)
with open(P(f'_fixdiff_{T}.txt'), 'w', encoding='utf-8') as f:
    for path, a, b in diffs:
        f.write(f'{".".join(map(str, path))}\n  - {a}\n  + {b}\n')
print('diffs', len(diffs), 'changes', len(chg_list), 'removed', removed_words)
