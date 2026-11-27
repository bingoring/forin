#!/usr/bin/env python3
"""or-specimen 수정 — pre-fix를 읽어 or-specimen.yaml과 changes-or-specimen.yaml을 다시 쓴다(다시 돌릴 수 있음).
B 검토자 사본(_reviewB_..._after.yaml)의 B 몫(distractorsKo·decoy·blank·why·tag·order)을 가져온 뒤
A 수정(data_1 문장 · data_2 단어 · data_3 뉘앙스 · data_4 order)과 오답 모양 보정을 얹는다.
changes는 changes-or-specimen.pre-fix.yaml(고정 원본)을 읽기만 한다."""
import copy, hashlib, json, os, sys, yaml

D = os.path.dirname(os.path.abspath(__file__))
T = 'or-specimen'
def L(p): return yaml.safe_load(open(os.path.join(D, p), encoding='utf-8'))

P = L(f'{T}.pre-fix.yaml')
B = L(f'_reviewB_{T}_after.yaml')
BASE = L(f'base-{T}.yaml')
IN = json.load(open(os.path.join(D, f'in-{T}.json'), encoding='utf-8'))
d1, d2, d3, d4 = (L(f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3, 4))
doc = copy.deepcopy(P)
old_en, old_ko = {}, {}
SHAPES = {}

# 1. B 몫
for i, (s, bs) in enumerate(zip(doc['situations'], B['situations'])):
    for k, (x, bx) in enumerate(zip(s['sentences'], bs['sentences'])):
        assert x['en'] == bx['en'] and x['ko'] == bx['ko'], (i, k)
        old_en[(i, k)], old_ko[(i, k)] = x['en'], x['ko']
        for f in ('distractorsKo', 'decoy', 'blank', 'why', 'tag'):
            x[f] = copy.deepcopy(bx[f])
    s['order'] = copy.deepcopy(bs['order'])

import random
PENDING = []      # 새로 쓴 빈칸 — 나머지 칸 수를 보고 고르게 배정한다
def place(x, answer, wrong):
    assert len(wrong) == 3 and answer not in wrong
    PENDING.append((x, answer, list(wrong)))
    x['blank'] = {'answer': answer, 'options': [{'en': o} for o in wrong] + [{'en': answer}]}   # 임시

def settle_blanks():
    mine = {id(x) for x, _, _ in PENDING}
    cnt = [0, 0, 0, 0]
    total = 0
    for s in doc['situations']:
        for x in s['sentences']:
            total += 1
            if id(x) in mine: continue
            b = x['blank']
            cnt[[o['en'] for o in b['options']].index(b['answer'])] += 1
    target = total / 4
    order = sorted(PENDING, key=lambda t: hashlib.md5(t[0]['en'].encode()).hexdigest())
    for x, answer, wrong in order:
        # 가장 모자란 칸(동률이면 en 해시)에 놓는다
        h = int(hashlib.md5(x['en'].encode()).hexdigest(), 16)
        cand = sorted(range(4), key=lambda c: (cnt[c] - target, (h >> (c * 3)) % 7))
        pos = cand[0]
        cnt[pos] += 1
        opts = list(wrong); opts.insert(pos, answer)
        x['blank'] = {'answer': answer, 'options': [{'en': o} for o in opts]}

# 2. 문장
for key, ch in d1['sentences'].items():
    i, k = map(int, key.split('.'))
    x = doc['situations'][i]['sentences'][k]
    assert x['en'] == ch['old'], (key, x['en'])
    for f, v in ch.items():
        if f == 'old':
            continue
        elif f == 'blank':
            place(x, v['answer'], v['wrong'])
        elif f == 'shape':
            SHAPES[key] = v
        elif f == 'words_remove':
            for wid in v:
                assert wid in x['words'], (key, wid)
                x['words'].remove(wid)
        else:
            x[f] = v

# 3. 단어
W = {w['id']: w for w in doc['words']}
def swap(lst, old, new, wid, f):
    assert old in lst, (wid, f, old, lst)
    lst[lst.index(old)] = new
for wid, old, new in d2['dEn']: swap(W[wid]['distractorsEn'], old, new, wid, 'dEn')
for wid, old, new in d2['dKo']: swap(W[wid]['distractorsKo'], old, new, wid, 'dKo')
for wid, old, new in d2['decoyChips']: swap(W[wid]['decoyChips'], old, new, wid, 'decoy')
for wid, ch in d2['set'].items():
    for f, v in ch.items(): W[wid][f] = v
SENT = {x['en']: x for s in doc['situations'] for x in s['sentences']}
OLD2NEW = {old_en[a]: doc['situations'][a[0]]['sentences'][a[1]]['en'] for a in old_en}
for w in doc['words']:
    ex = w['example']
    if ex in OLD2NEW and OLD2NEW[ex] != ex:
        sys.exit(f"word {w['id']} example still points to a replaced sentence: {ex}")
    if ex in SENT:
        w['exKo'] = SENT[ex]['ko']

# 4. 뉘앙스
def rename_opt(n, old, new):
    assert old in n['options'], (old, n['options'])
    n['options'][n['options'].index(old)] = new
    n['before'] = [new if b == old else b for b in n['before']]
    if n['answer'] == old: n['answer'] = new
    n['notes'] = {(new if k == old else k): v for k, v in n['notes'].items()}
for key, ch in d3['nuance'].items():
    si, kind = key.split(':')
    n = [x for x in doc['situations'][int(si)]['nuance'] if x['kind'] == kind]
    assert len(n) == 1, key
    n = n[0]
    for f, v in ch.items():
        if f == 'scale_set':
            for a, b in v.items(): n['scale'][int(a)] = b
        elif f == 'scene_set':
            for a, b in v.items(): n['scenes'][int(a)].update(b)
        elif f == 'bad':
            assert n['scenes'][v]['ok'] is False, (key, v)
        elif f == 'rename':
            for a, b in v.items(): rename_opt(n, a, b)
        elif f == 'notes_set':
            for a, b in v.items():
                assert a in n['notes'], (key, a)
                n['notes'][a] = b
        else:
            n[f] = v
    if kind == 'context':
        assert sum(1 for sc in n['scenes'] if not sc['ok']) == 1, key
    if kind == 'swap':
        assert n['answer'] in n['options'] and all(o in n['notes'] for o in n['options']), key
        assert n['before'][1] in n['options']
for s in doc['situations']:
    for n in s['nuance']:
        if n['kind'] == 'slider':
            ex = n['example']
            if ex in OLD2NEW and OLD2NEW[ex] != ex:
                sys.exit(f'slider example stale: {ex}')
            if ex in SENT: n['exKo'] = SENT[ex]['ko']

# 4b. swap 정답 칸·context 어색한 장면 위치를 섞는다(값이 따라온다)
def pattern(seed):
    """0·1·2가 7번씩, 같은 칸이 셋 이어지지 않고, 주기 3으로 돌지 않는 순서."""
    for sd in range(seed, seed + 5000):
        r = random.Random(sd)
        seq = [0, 1, 2] * 7
        r.shuffle(seq)
        if any(seq[i] == seq[i + 1] == seq[i + 2] for i in range(19)): continue
        if sum(seq[i] == seq[i + 3] for i in range(18)) > 5: continue
        if sum(seq[i] == (seq[i - 1] + 1) % 3 for i in range(1, 21)) > 9: continue
        return seq
    raise SystemExit('no pattern')
SWAP_POS, CTX_POS = pattern(4601), pattern(9703)
si_ = ci_ = 0
for s_ in doc['situations']:
    for n in s_['nuance']:
        if n['kind'] == 'swap':
            ans = n['answer']
            others = [o for o in n['options'] if o != ans]
            others.insert(SWAP_POS[si_], ans)
            n['options'] = others
            si_ += 1
        elif n['kind'] == 'context':
            bad = [sc for sc in n['scenes'] if not sc['ok']]
            oks = [sc for sc in n['scenes'] if sc['ok']]
            assert len(bad) == 1
            oks.insert(CTX_POS[ci_], bad[0])
            n['scenes'] = oks
            ci_ += 1
assert si_ == 21 and ci_ == 21
settle_blanks()

# 4c. 빈칸 정답 자리 전체를 섞는다 — B 사본의 배정이 0-1-2-3 순환이라 주기 없이 다시 놓는다(값이 따라온다)
def blank_pattern(total, seed):
    for sd in range(seed, seed + 20000):
        r = random.Random(sd)
        seq = ([0, 1, 2, 3] * (total // 4 + 1))[:total]
        r.shuffle(seq)
        if any(seq[i] == seq[i + 1] == seq[i + 2] for i in range(total - 2)): continue
        if sum(seq[i] == seq[i - 1] for i in range(1, total)) > total // 4 + 4: continue
        if sum(seq[i] == (seq[i - 1] + 1) % 4 for i in range(1, total)) > total // 4 + 4: continue
        if sum(seq[i] == seq[i - 4] for i in range(4, total)) > total // 4 + 5: continue
        return seq
    raise SystemExit('no blank pattern')
ALLX = [x for s_ in doc['situations'] for x in s_['sentences']]
BPOS = blank_pattern(len(ALLX), 770)
for x, pos in zip(ALLX, BPOS):
    b = x['blank']
    wrong = [o['en'] for o in b['options'] if o['en'] != b['answer']]
    wrong.insert(pos, b['answer'])
    x['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in wrong]}

# 5. order
for key, ch in d4['order'].items():
    o = doc['situations'][int(key)]['order']
    for ln, v in ch.get('lines', {}).items():
        o['lines'][int(ln) - 1].update(v)
    if 'why' in ch: o['why'] = ch['why']

# 6. changes
base_w = {w['id']: w for w in BASE['words']}
chg = L(f'changes-{T}.pre-fix.yaml')
old = chg['changes']
WHY_S = {
 (2, 3): "근거 없이 단정 — 요청서를 근거로 밝히는 문장으로(A 사실)",
 (12, 4): "근거 없이 단정 — 지침을 근거로 밝히는 문장으로(A 사실)",
 (4, 5): "냉동절편 결과는 병리의가 집도의에게 직접 전함 — 간호사는 전화를 연결(A 범위)",
 (6, 5): "어느 쪽이 틀렸는지 모른 채 고친 뒤 확인하는 순서가 거꾸로 — 고치기 전에 확인(A 사실)",
 (7, 4): "수술 중 순환간호사는 방을 비우지 않음 — 옮겨 줄 사람을 찾는 문장으로(A 범위)",
 (7, 5): "결과는 병리과에서 수술방으로 직접 전화 — 이송 담당자에게 간호사에게 알리라 하지 않음(A 범위)",
 (14, 5): "부위 불일치를 혼자 정정하지 않음 — 집도의와 함께 바로잡기(A 안전)",
 (15, 5): "수술방 환자는 이미 확인된 사람 — 모르는 것은 '무슨 검체인가'(A 사실)",
 (16, 5): "수술 시야 수색은 집도의 몫이고 before we panic은 비전문적 — 동시에 나눠 찾는 문장으로(A 범위)",
 (17, 3): "결과의 출처(병리과 → 집도의)를 밝히는 문장으로(A 범위)",
 (18, 5): "닿았는지 확인한 뒤 버린다는 순서가 어색하고 버릴지는 집도의 — 버리기 전 보고(A 사실)",
 (19, 5): "보고 없이 혼자 재라벨하지 않음 — 보고 뒤에(A 안전)",
 (20, 5): "수술 중 순환간호사가 직접 가지 않음 — 전화로 도착 확인(A 범위)",
 (2, 5): "청크가 if we're / not sure로 끊김 — 구 경계로(A 청크)",
 (20, 3): "청크가 can't / be replaced로 끊김 — 구 경계로(A 청크)",
 (11, 3): "청크가 write / them down으로 끊김 — 구 경계로(A 청크)",
 (8, 0): "fresh는 '새것'(a fresh sterile swab)이라 w-fresh 태그를 뺌(A 태그)",
 (18, 4): "fresh는 '새것'이라 w-fresh 태그를 뺌, ko 신선한 검체 오역을 새 검체로(A 태그·ko)",
 (16, 3): "w-search ko를 샅샅이 찾다로 고치면서 문장 ko의 옛 말 수색을 맞춤(A ko)",
 (9, 5): "번역투 — 자연스러운 말로(A ko)",
 (1, 5): "방을 떠나다 직역 — 수술방을 나가기 전에(A ko)",
 (15, 2): "it은 검체 — 신원이 아니라 식별(A ko)",
 (17, 1): "확대할게요는 간호사의 결정으로 들림 — 넓히게 됐어요(A ko)",
 (16, 1): "옛 말 수색 — 샅샅이 찾아봐요(A ko)",
 (2, 1): "검사실에서 신선한 상태로 원해요 비문(A ko)",
}
WHY_W = dict(d2.get('whyChanges', {}))
WORDKEYS = ('en', 'ko', 'ipa', 'icon', 'example')
SENTKEYS = ('en', 'ko', 'chunks', 'words', 'goal')
new = []
by_w = {c['id']: c for c in old if c['kind'] == 'word'}
by_s = {(c['situation'], c['index']): c for c in old if c['kind'] == 'sentence'}
for c in old:
    if c['kind'] in ('word-remove', 'word-add'): new.append(c)
bank_ids = {w['id'] for w in doc['words']}
for c in old:
    if c['kind'] == 'word-add': assert c['id'] in bank_ids, c
    if c['kind'] == 'word-remove': assert c['id'] not in bank_ids, c
for w in doc['words']:
    b = base_w.get(w['id'])
    if b is None:
        continue                                  # word-add는 위에서 그대로
    fs = [k for k in WORDKEYS if b.get(k) != w.get(k)]
    if fs:
        c = by_w.get(w['id'])
        why = (c['why'] if c else '')
        if w['id'] in WHY_W and not (c and set(fs) <= set(c['fields'])):
            why = (why + ' / ' if why else '') + WHY_W[w['id']]
        elif not why:
            sys.exit(f'no why for word {w["id"]} {fs}')
        new.append({'kind': 'word', 'id': w['id'], 'fields': fs, 'why': why})
for i, s in enumerate(doc['situations']):
    bs = BASE['situations'][i]
    for k, x in enumerate(s['sentences']):
        b = bs['sentences'][k]
        fs = [f for f in SENTKEYS if b.get(f) != x.get(f)]
        if fs:
            c = by_s.get((s['title'], k))
            why = c['why'] if c else ''
            if (i, k) in WHY_S and not (c and set(fs) <= set(c['fields'])):
                why = (why + ' / ' if why else '') + WHY_S[(i, k)]
            elif not why:
                sys.exit(f'no why for {(i, k)} {fs}')
            new.append({'kind': 'sentence', 'situation': s['title'], 'index': k, 'fields': fs, 'why': why})
new = sorted(new, key=lambda c: {'word-remove': 0, 'word-add': 1, 'word': 2, 'sentence': 3}[c['kind']])

# 7. keyPhrase 보호 — en·chunks가 pre-fix 그대로
kps = [k if isinstance(k, str) else k['en'] for s in IN['situations'] for k in s['keyPhrases']]
PS = {x['en']: x for s in P['situations'] for x in s['sentences']}
DS = {x['en']: x for s in doc['situations'] for x in s['sentences']}
for kp in kps:
    assert kp in DS, f'keyPhrase en 바뀜: {kp}'
    assert DS[kp]['chunks'] == PS[kp]['chunks'], f'keyPhrase chunks 바뀜: {kp}'

out = {'theme': T, 'changes': new}
with open(os.path.join(D, f'changes-{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
with open(os.path.join(D, f'{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000)
print('changes', len(new), '| shapes', len(SHAPES))
print('bothFact before', len(d1['bothFactBefore']), '-> after', len(d1['bothFactAfter']))
