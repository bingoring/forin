#!/usr/bin/env python3
"""icu-airway 검토 A·B 반영. icu-airway.pre-fix.yaml(+changes-icu-airway.pre-fix.yaml)을 읽어
icu-airway.yaml / changes-icu-airway.yaml 을 다시 만든다. 다시 돌려도 같은 결과."""
import copy, os, re, sys
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
def P(n): return os.path.join(HERE, n)
def load(n): return yaml.safe_load(open(P(n), encoding='utf-8'))

doc = load('icu-airway.pre-fix.yaml')
pre = copy.deepcopy(doc)
chg_doc = load('changes-icu-airway.pre-fix.yaml')
W = {w['id']: w for w in doc['words']}
SIT = doc['situations']
SEEDS = yaml.safe_load(open(os.path.join(HERE, '..', '..', '..', '..', 'nurse', 'topics', 'icu.yaml'), encoding='utf-8'))
KEY = {s['title']: set(s.get('keyPhrases') or []) for s in SEEDS if s['theme'] == 'icu-airway'}

# ---------- 문장 ----------
SENT_FIELDS = ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy')
for n in (1, 2, 3):
    for e in load(f'fix_icu-airway_data_{n}.yaml')['sent']:
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
d4 = load('fix_icu-airway_data_4.yaml')
for wid, setv in d4['words'].items():
    W[wid].update(setv)
# 품사 다른 distractorsEn — A 검토 표
txt = open(P('fix-icu-airway-A.md'), encoding='utf-8').read()
rows = re.findall(r"^    \| (w-[\w-]+) \| (.*?) \| (.*?) \| (.*?) \|$", txt, re.M)
SKIP = {'w-stat', 'w-fault', 'w-crisis'}
for wid, ans, off, alt in rows:
    if wid in SKIP or wid not in W:
        continue
    offs = [t.strip().split('(')[0].strip() for t in off.split(',')]
    alts = [t.strip() for t in alt.split(',')]
    if not re.fullmatch(r"[a-z\- ]+", ''.join(alts).replace(',', '')):
        print('  [skip row]', wid, alt); continue
    cur = W[wid]['distractorsEn']
    for i, o in enumerate(offs):
        if o in cur and i < len(alts):
            cur[cur.index(o)] = alts[i]
        else:
            print('  [row mismatch]', wid, 'offender', o, 'not in', cur)
for wid, m in d4['dEn_swap'].items():
    cur = W[wid]['distractorsEn']
    for o, nw in m.items():
        if o in cur:
            cur[cur.index(o)] = nw
for wid, lst in d4['dEn_set'].items():
    W[wid]['distractorsEn'] = lst
for name in d4['tag_general']:
    wid = 'w-' + name
    assert W[wid]['tag'] == '일반 동사', wid
    W[wid]['tag'] = '일반 표현'
removed = set(d4['word_remove'])
for wid in removed:
    del W[wid]
doc['words'] = [w for w in doc['words'] if w['id'] in W]
for sit in SIT:
    for s in sit['sentences']:
        for wid in s['words']:
            assert wid in W, (sit['title'], s['en'], wid)

# 예문(example)·exKo 맞춤: 예문이던 문장이 바뀌었으면 새 문장(단어가 없으면 다른 문장)으로
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
for e in d4['nuance']:
    sit = SIT[e['s']]
    cands = [n for n in sit['nuance'] if n['kind'] == e['kind']]
    assert len(cands) == 1, (e['s'], e['kind'], len(cands))
    n = cands[0]
    n.update(e.get('set', {}))
    for idx, upd in (e.get('scene') or {}).items():
        sc = n['scenes'][idx]
        sc.update(upd)

# ---------- order ----------
for e in d4['order']:
    o = SIT[e['s']]['order']
    if 'why' in e:
        o['why'] = e['why']
    for idx, upd in (e.get('lines') or {}).items():
        o['lines'][idx].update(upd)

with open(P('icu-airway.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=100000)

# ---------- changes-icu-airway.yaml ----------
changes = copy.deepcopy(chg_doc['changes'])
V44_WORD = ('id', 'en', 'ipa', 'ko', 'icon', 'example')
V44_SENT = ('en', 'ko', 'chunks', 'words')
changes = [c for c in changes if not (c['kind'] == 'word' and c['id'] in removed)]
WHY_WORD = {
    'w-hold': "ko '누르다'는 바뀐 10.4(머리를 잡아 줌)와 17.4(산소를 대고 있음)에 안 맞음 — '잡고 있다'. 예문도 새 문장으로",
    'w-surgery': "'call surgery'(외과 팀을 부름)에 쓰이므로 ko '수술'을 '외과'로",
    'w-drug': "ko '약물(명)'이 어색하고 w-medication '약물'과 겹침 — '약(성분)'",
    'w-periintubation': "문장 첫머리의 대문자가 헤드워드에 딸려 옴 — 소문자로",
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
for wid in removed:
    changes.append({'kind': 'word-remove', 'id': wid,
                    'why': "17.3을 환자에게 하는 안심 말로 바꾸며(\"this isn't his fault\" 삭제) 어느 문장도 태그하지 않게 됨"})
WHY_SENT = {
    (3, 4): "기관절개관 교체에서 스토마를 눌러 지혈하는 단계는 없음(사실 오류) — 머리를 잡아 주는 보조 역할로. w-pressure·w-stoma 태그를 뺌",
    (10, 3): "첫 교체는 보통 의사가 하므로 'I'll go slowly'는 간호사의 업무범위를 넘어 읽힘 — 'we'll go slowly', 설명은 내 몫으로",
    (10, 4): "기관절개관 교체에서 스토마를 눌러 지혈하는 단계는 없음(사실 오류) — 머리를 잡아 주는 보조 역할로. w-pressure·w-stoma 태그를 뺌",
    (8, 3): "간호사가 용적 상태를 혼자 판단해 볼루스를 주는 말은 처방 없는 투약 — 처방하시면 줄 수 있게 준비해 둔다로",
    (11, 3): "ICU 이중내강관은 수술이 아니라 폐 격리용(장면과 안 맞음) — 건강한 폐를 보호하려는 한쪽 폐 환기로. w-surgery 태그를 뺌",
    (11, 5): "이중내강관 한쪽을 잠그는 것은 마취과·호흡치료사 등 시술자의 일(업무범위) — 잠가 주시면 폐를 따로 듣는다로",
    (15, 4): "윤상갑상막을 찾아 표시하는 것은 시술자의 일(업무범위) — 표시하시면 메스가 준비돼 있다로",
    (16, 4): "아트로핀 투약 결정은 의사(코드 리더)의 일 — 간호사가 지시하지 않고 \"주입할까요?\"로 물음",
    (17, 3): "듣는 사람이 모호하고 숨을 못 쉬는 응급에 '환자 잘못이 아니다'는 어색 — 환자에게 하는 안심 말로. w-fault 태그를 뺌",
    (17, 5): "17.2(새 스토마는 다시 넣기 어렵다)와 모순되는 지킬 수 없는 약속 — 'more easily'로 정렬의 효과만 말함",
    (14, 1): "ko '약물은 응급 상황 동안 제가 관리할게요'가 어순이 어색 — '응급 상황에서는 흡인은 당신이 맡고…'(en은 그대로)",
    (2, 4): "ko '덜 필요하면'이 어색 — '약하게 해야 하면'",
}
def sent_key(s, i): return (SIT[s]['title'], i)
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
        if (si, i) in WHY_SENT:
            why = WHY_SENT[(si, i)]
        elif diff == ['chunks']:
            why = "구 경계를 끊은 chunks를 구 단위로 바로잡음 — 문장은 그대로"
        else:
            why = "검토 반영"
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
with open(P('changes-icu-airway.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': chg_doc['theme'], 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=100000)
print('words', len(pre['words']), '->', len(doc['words']), '| changes', len(chg_doc['changes']), '->', len(changes), '| sentences changed', n_new)
