#!/usr/bin/env python3
"""icu-electrolytes 검토 A·B 반영. icu-electrolytes.pre-fix.yaml(+changes-icu-electrolytes.pre-fix.yaml)을 읽어
icu-electrolytes.yaml / changes-icu-electrolytes.yaml 을 다시 만든다. 다시 돌려도 같은 결과."""
import copy, os, re, sys
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
def P(n): return os.path.join(HERE, n)
def load(n): return yaml.safe_load(open(P(n), encoding='utf-8'))

doc = load('icu-electrolytes.pre-fix.yaml')
pre = copy.deepcopy(doc)
chg_doc = load('changes-icu-electrolytes.pre-fix.yaml')
W = {w['id']: w for w in doc['words']}
SIT = doc['situations']
SEEDS = yaml.safe_load(open(os.path.join(HERE, '..', '..', '..', '..', 'nurse', 'topics', 'icu.yaml'), encoding='utf-8'))
KEY = {s['title']: set(s.get('keyPhrases') or []) for s in SEEDS if s['theme'] == 'icu-electrolytes'}

# ---------- 문장 ----------
SENT_FIELDS = ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy')
for e in load('fix_icu-electrolytes_data_1.yaml')['sent']:
    sit = SIT[e['s']]
    x = sit['sentences'][e['i']]
    if x['en'] in KEY[sit['title']]:
        assert e.get('en', x['en']) == x['en'] and e.get('chunks', x['chunks']) == x['chunks'], ('keyPhrase', e)
    for k in SENT_FIELDS:
        if k in e:
            x[k] = e[k]
    if 'd1' in e:
        x['distractorsKo'][0] = e['d1']
    if 'd2' in e:
        x['distractorsKo'][1] = e['d2']
    if 'dko' in e:
        assert len(e['dko']) == 2
        x['distractorsKo'] = e['dko']
    if 'blank' in e:
        b = e['blank']
        assert b['answer'] in b['options'] and len(set(b['options'])) == 4, e
        x['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in b['options']]}

# ---------- 단어 ----------
d2 = load('fix_icu-electrolytes_data_2.yaml')
for wid, setv in d2['words'].items():
    W[wid].update(setv)
# 품사 다른 distractorsEn — A 검토 표
txt = open(P('fix-icu-electrolytes-A.md'), encoding='utf-8').read()
rows = re.findall(r"^\| (w-[\w-]+) \([^)]*\) \| (.*?) \| (.*?) \|\s*$", txt, re.M)
SKIP = {'w-stat', 'w-stretch', 'w-imbalance', 'w-trigger', 'w-tumor'}
n_rows = 0
for wid, off, alt in rows:
    if wid in SKIP or wid not in W:
        continue
    offs = [re.sub(r"\s*\([^)]*\)\s*$", '', t.strip()) for t in off.split(',')]
    alts = re.findall(r"`([^`]+)`", alt)
    if len(alts) < len(offs) or not alts:
        print('  [row?]', wid, off, '|', alt); continue
    cur = W[wid]['distractorsEn']
    for i, o in enumerate(offs):
        if o in cur:
            cur[cur.index(o)] = alts[i]
            n_rows += 1
        else:
            print('  [row mismatch]', wid, 'offender', o, 'not in', cur)
for wid, m in d2['dEn_swap'].items():
    cur = W[wid]['distractorsEn']
    for o, nw in m.items():
        assert o in cur, (wid, o, cur)
        cur[cur.index(o)] = nw
for wid, lst in d2['dEn_set'].items():
    W[wid]['distractorsEn'] = lst
for name in d2['tag_general']:
    wid = 'w-' + name
    if W[wid]['tag'] == '일반 동사':
        W[wid]['tag'] = '일반 표현'
    else:
        print('  [tag skip]', wid, W[wid]['tag'])
removed = set(d2['word_remove'])
for wid in removed:
    del W[wid]
doc['words'] = [w for w in doc['words'] if w['id'] in W]
for sit in SIT:
    for s in sit['sentences']:
        for wid in s['words']:
            assert wid in W, (sit['title'], s['en'], wid)

# 예문(example)·exKo 맞춤: 예문이던 문장이 바뀌었으면 새 문장(단어가 없으면 다른 문장)으로, ko가 바뀌었으면 exKo도
old_en = {}
for si, s in enumerate(pre['situations']):
    for i, x in enumerate(s['sentences']):
        old_en.setdefault(x['en'], (si, i))
used = {}
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        for wid in x['words']:
            used.setdefault(wid, []).append((si, i))
for wid, w in W.items():
    if w['example'] not in old_en:
        continue
    si, i = old_en[w['example']]
    new = SIT[si]['sentences'][i]
    if new['en'] != w['example']:
        if wid in new['words']:
            w['example'] = new['en']
        else:
            cands = [c for c in used.get(wid, []) if SIT[c[0]]['sentences'][c[1]]['en'] == pre['situations'][c[0]]['sentences'][c[1]]['en']]
            assert cands, wid
            new = SIT[cands[0][0]]['sentences'][cands[0][1]]
            w['example'] = new['en']
            print('  [example moved]', wid, '->', new['en'])
    w['exKo'] = new['ko']

# ---------- 뉘앙스 ----------
for e in d2['nuance']:
    sit = SIT[e['s']]
    cands = [n for n in sit['nuance'] if n['kind'] == e['kind']]
    assert len(cands) == 1, (e['s'], e['kind'], len(cands))
    n = cands[0]
    n.update(e.get('set', {}))
    for idx, upd in (e.get('scene') or {}).items():
        n['scenes'][idx].update(upd)
    for old, new in (e.get('repl') or []):
        assert old in n['why'], (e, n['why'])
        n['why'] = n['why'].replace(old, new)

# ---------- order ----------
for e in d2['order']:
    o = SIT[e['s']]['order']
    if 'why' in e:
        o['why'] = e['why']
    for idx, upd in (e.get('lines') or {}).items():
        o['lines'][idx].update(upd)

with open(P('icu-electrolytes.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=100000)

# ---------- changes-icu-electrolytes.yaml ----------
changes = copy.deepcopy(chg_doc['changes'])
V44_WORD = ('id', 'en', 'ipa', 'ko', 'icon', 'example')
V44_SENT = ('en', 'ko', 'chunks', 'words')
changes = [c for c in changes if not (c['kind'] == 'word' and c['id'] in removed)]
WHY_WORD = {
    'w-bring': "ko '(수치를) 낮추다'는 bring 혼자의 뜻이 아니라 문장의 bring down 전체 뜻 — 헤드워드를 구(bring down)로. ipa·cue도 맞춤",
    'w-danger': "ko '위험도'가 w-risk '위험성'과 한국어로 거의 같음 — '위급한 정도'로 가름(20.5 in order of danger)",
    'w-tingle': "헤드워드는 동사인데 ko '저림'은 명사 — '저리다'로",
}
def add_word_change(wid, fields, why):
    for c in changes:
        if c['kind'] == 'word' and c['id'] == wid:
            c['fields'] = sorted(set(c['fields']) | set(fields), key=V44_WORD.index)
            c['why'] = c['why'] + ' / ' + why
            return
    changes.append({'kind': 'word', 'id': wid, 'fields': sorted(fields, key=V44_WORD.index), 'why': why})
pre_W = {w['id']: w for w in pre['words']}
for wid, w in W.items():
    diff = [k for k in V44_WORD if w.get(k) != pre_W[wid].get(k)]
    if diff:
        why = WHY_WORD.get(wid) or "이 단어를 예문으로 쓰던 문장을 바꾼 검토 반영에 맞춰 예문을 바꿈"
        add_word_change(wid, diff, why)
WHY_REMOVE = {
    'w-stretch': "10.4를 임상에서 쓰는 prolong으로 고치며(stretch the QT → prolong the QT) 어느 문장도 태그하지 않게 됨",
    'w-yesterday': "today와 같은 급의 쉬운 말(공통 쉬운 단어 목록과 같은 기준) — 14.3 문장은 그대로 두고 태그만 뺌",
}
for wid in removed:
    changes.append({'kind': 'word-remove', 'id': wid, 'why': WHY_REMOVE[wid]})
WHY_SENT = {
    (1, 4): "\"that's normal\"로 끝내면 침윤·혈관 밖 누출·정맥염 신호를 가족이 알리지 않음(안전) — 따끔거리면 바로 알려 달라는 말로. w-normal·w-medicine·w-slow 태그를 뺌",
    (15, 3): "글루콘산칼슘 push에 속도가 없어 \"칼슘은 push\"로만 외워짐(안전) — 몇 분에 걸쳐 천천히",
    (16, 4): "3% 식염수 100mL는 보통 10분에 걸친 볼루스이고 처방·프로토콜 맥락이 없으면 간호사 단독 지시로 읽힘(안전) — 동사 push를 give로, over ten minutes, per the order. w-push 태그를 뺌",
    (18, 4): "1~2분 push는 맥박이 없는 토르사드의 용법인데 이 장면은 맥박이 있음(안전) — 15분에 걸쳐, he still has a pulse. w-push 태그를 뺌",
    (10, 4): "임상에서는 QT를 stretch가 아니라 prolong한다 — prolong. w-stretch를 w-prolong으로",
    (17, 3): "twelve points(단위)는 w-point(ko 가리키다)와 뜻이 다름 — w-point 태그를 뺌, 끊긴 chunks(in the last ten / hours)를 한 조각으로",
    (14, 3): "w-yesterday는 쉬운 말이라 태그를 뺌, 복합명사 tumor burden이 끊긴 chunks를 바로잡음",
    (18, 1): "ko '응원 요청'은 cheering으로 읽힘 — '도움을 요청'. call for help는 명사라 w-help 태그를 뺌",
    (8, 3): "'eight to ten'에 단위가 없음 — mEq/L를 붙임",
    (18, 5): "en은 명령형(Stay)인데 ko가 1인칭 '있겠습니다' — '있어 주세요'",
    (19, 1): "en은 명령형(Give … and protect)인데 ko가 1인칭 — '주고 보호하세요'",
    (7, 5): "en은 명령형(Keep)인데 ko가 1인칭 — '유지해 주세요'",
    (9, 5): "en은 명령형(Recheck)인데 ko가 1인칭 — '재검해 주세요'. 끊긴 chunks(every four to six / hours)를 한 조각으로",
    (13, 5): "끊긴 chunks(for the first couple / of days)를 구 단위로",
    (20, 5): "끊긴 chunks(in order / of danger)를 구 단위로",
}
CH_BY = {}
for c in changes:
    if c['kind'] == 'sentence':
        CH_BY[(c['situation'], c['index'])] = c
n_new = 0
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        px = pre['situations'][si]['sentences'][i]
        diff = [k for k in V44_SENT if x[k] != px[k]]
        if not diff:
            continue
        why = WHY_SENT.get((si, i)) or "검토 반영"
        key = (s['title'], i)
        if key in CH_BY:
            c = CH_BY[key]
            c['fields'] = sorted(set(c['fields']) | set(diff), key=V44_SENT.index)
            c['why'] = c['why'] + ' / ' + why
        else:
            c = {'kind': 'sentence', 'situation': s['title'], 'index': i,
                 'fields': sorted(diff, key=V44_SENT.index), 'why': why}
            changes.append(c)
            CH_BY[key] = c
        n_new += 1
with open(P('changes-icu-electrolytes.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': chg_doc['theme'], 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=100000)
print('dEn rows', n_rows, '| words', len(pre['words']), '->', len(doc['words']), '| changes', len(chg_doc['changes']), '->', len(changes), '| sentences changed', n_new)
