#!/usr/bin/env python3
"""or-preop-checklist 수정 — pre-fix를 읽어 or-preop-checklist.yaml과 changes-or-preop-checklist.yaml을 다시 쓴다(다시 돌릴 수 있음).
B 검토자 사본(_reviewB_..._after.yaml)의 B 몫(distractorsKo·decoy·blank·why·order)을 가져온 뒤 A 수정(data_1~4)을 얹는다."""
import copy, hashlib, os, sys, yaml
D = os.path.dirname(os.path.abspath(__file__))
T = 'or-preop-checklist'
def L(p): return yaml.safe_load(open(os.path.join(D, p), encoding='utf-8'))

P = L(f'{T}.pre-fix.yaml')
B = L(f'_reviewB_{T}_after.yaml')
BASE = L(f'base-{T}.yaml')
d1, d2, d3, d4 = (L(f'fix_{T}_data_{i}.yaml') for i in (1, 2, 3, 4))
doc = copy.deepcopy(P)
old_en, old_ko = {}, {}     # (상황, 문장) -> 옛 en/ko

# 1. B 몫
for i, (s, bs) in enumerate(zip(doc['situations'], B['situations'])):
    for k, (x, bx) in enumerate(zip(s['sentences'], bs['sentences'])):
        assert x['en'] == bx['en'] and x['ko'] == bx['ko']
        old_en[(i, k)], old_ko[(i, k)] = x['en'], x['ko']
        for f in ('distractorsKo', 'decoy', 'blank', 'why'):
            x[f] = copy.deepcopy(bx[f])
    s['order'] = copy.deepcopy(bs['order'])

def place(x):
    """빈칸 정답 자리를 en 해시로 정한다(0-1-2-3 순환 없음)."""
    b = x['blank']
    wrong = b.pop('wrong')
    pos = int(hashlib.md5(x['en'].encode()).hexdigest(), 16) % 4
    opts = list(wrong)
    opts.insert(pos, b['answer'])
    b['options'] = [{'en': o} for o in opts]

# 2. 문장
for key, ch in d1['sentences'].items():
    i, k = map(int, key.split('.'))
    x = doc['situations'][i]['sentences'][k]
    for f, v in ch.items():
        if f == 'blank':
            x['blank'] = {'answer': v['answer'], 'wrong': v['wrong']}
            place(x)
        else:
            x[f] = v

# 3. 단어
W = {w['id']: w for w in doc['words']}
def swap(lst, old, new, wid, f):
    assert old in lst, (wid, f, old, lst)
    lst[lst.index(old)] = new
for wid, old, new in d2['dEn']: swap(W[wid]['distractorsEn'], old, new, wid, 'dEn')
for wid, old, new in d2['dKo']: swap(W[wid]['distractorsKo'], old, new, wid, 'dKo')
for wid, old, new in d2['decoyChips']: swap(W[wid]['decoyChips'], old, new, wid, 'decoyChips')
for wid, fs in d2['set'].items(): W[wid].update(fs)
for wid in d2['remove']: del W[wid]
doc['words'] = [w for w in doc['words'] if w['id'] in W]
SENT = {x['en']: x for s in doc['situations'] for x in s['sentences']}
OLD2NEW = {}
for (i, k), e in old_en.items():
    OLD2NEW[e] = doc['situations'][i]['sentences'][k]['en']
for wid, en in d2['example'].items():
    W[wid]['example'] = en
for w in doc['words']:
    ex = w['example']
    if ex in OLD2NEW and OLD2NEW[ex] != ex:
        sys.exit(f"word {w['id']} example still points to a replaced sentence: {ex}")
    if ex in SENT:
        w['exKo'] = SENT[ex]['ko']

# 4. 뉘앙스
for key, ch in d3['nuance'].items():
    si, kind = key.split(':'); n = [x for x in doc['situations'][int(si)]['nuance'] if x['kind'] == kind]
    assert len(n) == 1, key
    n = n[0]
    for f, v in ch.items():
        if f == 'scale_set':
            for a, b in v.items(): n['scale'][int(a)] = b
        elif f == 'before_set':
            for a, b in v.items(): n['before'][int(a)] = b
        else:
            n[f] = v
for s in doc['situations']:
    for n in s['nuance']:
        if n['kind'] == 'slider':
            ex = n['example']
            if ex in OLD2NEW and OLD2NEW[ex] != ex:
                n['example'] = OLD2NEW[ex]
                ex = n['example']
            if ex in SENT: n['exKo'] = SENT[ex]['ko']
            else: pass

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
 (12, 4): "마지막 복용 시각을 묻는 문장으로 — '예정대로 먹었나'는 수술 당일에도 평소대로 먹는다는 전제를 가르침(A 안전)",
 (16, 4): "소독간호사에게 push it now(급속 정주)를 시키는 문장이라 — 짧은 지연이 절개보다 낫다는 문장으로(A 안전·역할)",
 (16, 3): "기준은 절개 전 투여 '시작'(fully in은 틀림) — 새 문장(A 사실)",
 (13, 4): "인슐린은 지시·처방에 따름 — 간호사가 소량 줄 수 있다는 약속을 의사 처방으로(A 업무범위)",
 (17, 4): "MTP 발동은 집도의·마취과 판단 — 혼자 시작하자는 말을 결정권자에게 묻는 문장으로(A 역할)",
 (6, 3): "교차적합 필요 여부·시작 결정은 간호사가 단정할 일이 아님 — 마취과에 확인한다는 문장으로(A 사실)",
 (5, 4): "상대가 마취과의사 — 간호사가 주는 말이고 기준이 집도의 준비라 절개 전 한 시간 안에 시점을 맞추는 문장으로(A 역할·시점)",
 (11, 4): "깨어나자마자 바로는 지킬 수 없는 약속 — 깨어난 뒤 회복실에서(A 약속)",
 (11, 3): "ko 깨끗하게는 clear airway(막히지 않은 기도)의 뜻이 아님(A ko)",
 (19, 3): "ko 어색 — 위험을 감수할 가치가 없다는 뜻으로(A·B 메모)",
 (18, 0): "ko 주어 뒤바뀜 — 소작이 기기에 간섭할 수 있다(A·B 메모)",
 (17, 1): "방출 → 불출: 불출은 혈액은행이 하므로 '받을'(A·저자 메모)",
 (20, 2): "ko 어색 — 가족에게 연락하거나 이전 기록을 찾아본다(A ko)",
 (12, 0): "gently(부드럽게)가 ko에서 빠짐(A ko)",
 (6, 4): "청크가 on을 홀로 남김 — 구 경계로(A 청크)",
 (10, 3): "청크가 on your other / arm으로 끊김 — 구 경계로(A 청크)",
 (10, 4): "청크 정리 + give you a better flow는 '투여하다'가 아니라 w-give 태그를 뺌(A 청크·태그)",
 (18, 4): "just in case는 '(수술) 건'이 아니라 w-case 태그를 뺌(A 태그)",
 (7, 1): "until it results는 동사라 명사 w-result 태그를 뺌(A 태그)",
 (20, 0): "in place는 '자리'가 아니라 w-place 태그를 뺌(A 태그)",
 (20, 4): "정체 모를 이식물 장면에서 pacemaker를 이미 아는 꼴 — prior device로(A 내용)",
 (7, 3): "critical이 15.0의 위급 수치와 섞여 모호 — required로(A 모호)",
 (12, 1): "w-thinner 헤드워드를 blood thinner로 정해 구 안의 낱말 w-blood 태그를 뺌(A W5)",
}
WHY_W = {'w-thinner': "문장은 a blood thinner — 'thinner'만으로는 시너(희석제)라 ko 혈액희석제와 어긋나 헤드워드를 구로"}
WHY_W.update(d2.get('whyChanges', {}))
WORDKEYS = ('en', 'ko', 'ipa', 'icon', 'example')
SENTKEYS = ('en', 'ko', 'chunks', 'words', 'goal')
new = []
done = set()
by_w = {c['id']: c for c in old if c['kind'] == 'word'}
by_s = {(c['situation'], c['index']): c for c in old if c['kind'] == 'sentence'}
rm_old = {c['id']: c for c in old if c['kind'] == 'word-remove'}
for c in old:
    if c['kind'] == 'word-remove': new.append(c)
for wid in d2['remove']:
    new.append({'kind': 'word-remove', 'id': wid, 'why': d2['remove'][wid]})
for w in doc['words']:
    b = base_w[w['id']]
    fs = [k for k in WORDKEYS if b.get(k) != w.get(k)]
    if fs:
        c = by_w.get(w['id'])
        why = (c['why'] if c else '')
        if w['id'] in WHY_W and not (c and set(fs) <= set(c['fields'])):
            why = (why + ' / ' if why else '') + WHY_W[w['id']]
        elif not why: why = WHY_W[w['id']]
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
words_first = sorted(new, key=lambda c: {'word-remove': 0, 'word': 1, 'sentence': 2}[c['kind']])
out = {'theme': T, 'changes': words_first}
with open(os.path.join(D, f'changes-{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
with open(os.path.join(D, f'{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000)
print('changes', len(words_first))
