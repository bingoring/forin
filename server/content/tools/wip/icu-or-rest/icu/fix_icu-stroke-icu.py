#!/usr/bin/env python3
"""icu-stroke-icu 검토 A·B 반영. icu-stroke-icu.pre-fix.yaml(+changes-...pre-fix.yaml)을 읽어
icu-stroke-icu.yaml / changes-icu-stroke-icu.yaml 을 다시 만든다. 다시 돌려도 같은 결과."""
import copy, json, os
import yaml
HERE = os.path.dirname(os.path.abspath(__file__))
def P(n): return os.path.join(HERE, n)
def load(n): return yaml.safe_load(open(P(n), encoding='utf-8'))
T = 'icu-stroke-icu'
doc = load(f'{T}.pre-fix.yaml'); pre = copy.deepcopy(doc)
chg_doc = load(f'changes-{T}.pre-fix.yaml')
W = {w['id']: w for w in doc['words']}
SIT = doc['situations']
inj = json.load(open(P(f'in-{T}.json'), encoding='utf-8'))
KEY = {s['title']: set(s.get('keyPhrases') or []) for s in inj['situations']}
d1, d2, d3, d4 = (load(f'fix_{T}_data_{n}.yaml') for n in (1, 2, 3, 4))

# ---- 문장
for e in d1['sent'] + d2['sent']:
    sit = SIT[e['s']]; x = sit['sentences'][e['i']]
    if x['en'] in KEY[sit['title']]:
        assert e.get('en', x['en']) == x['en'] and e.get('chunks', x['chunks']) == x['chunks'], ('keyPhrase', e)
    for k in ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy'):
        if k in e: x[k] = e[k]
    if 'd1' in e: x['distractorsKo'][0] = e['d1']
    if 'd2' in e: x['distractorsKo'][1] = e['d2']
    if 'dko' in e:
        assert len(e['dko']) == 2; x['distractorsKo'] = list(e['dko'])
    if 'blank' in e:
        b = e['blank']; assert b['answer'] in b['options'] and len(set(b['options'])) == 4, e
        x['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in b['options']]}

# ---- 단어
removed = set(d3['word_remove'])
for wid, v in d3['words'].items(): W[wid].update(v)
for wid, lst in d3['dEn'].items():
    if 'distractorsEn' not in d3['words'].get(wid, {}): W[wid]['distractorsEn'] = lst
added = []
for a in d4['word_add']:
    a = dict(a); ti = a.pop('tag_in')
    doc['words'].append(a); W[a['id']] = a; added.append(a['id'])
    s = SIT[ti['s']]['sentences'][ti['i']]; s['words'].append(a['id'])
for wid in removed: del W[wid]
doc['words'] = [w for w in doc['words'] if w['id'] in W]
for sit in SIT:
    for s in sit['sentences']:
        for wid in s['words']: assert wid in W, (s['en'], wid)

# ---- 예문·exKo 맞춤
old_en = {}
for si, s in enumerate(pre['situations']):
    for i, x in enumerate(s['sentences']): old_en.setdefault(x['en'], (si, i))
used = {}
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        for wid in x['words']: used.setdefault(wid, []).append((si, i))
explicit = {k for k, v in d3['words'].items() if 'example' in v} | set(added)
for wid, w in W.items():
    if wid in explicit or w['example'] not in old_en: continue
    si, i = old_en[w['example']]; new = SIT[si]['sentences'][i]
    if new['en'] != w['example']:
        if wid in new['words']: w['example'] = new['en']
        else:
            cands = [c for c in used.get(wid, []) if SIT[c[0]]['sentences'][c[1]]['en'] == pre['situations'][c[0]]['sentences'][c[1]]['en']]
            assert cands, wid
            new = SIT[cands[0][0]]['sentences'][cands[0][1]]; w['example'] = new['en']
            print('  [example moved]', wid, '->', new['en'])
    w['exKo'] = new['ko']

# ---- 뉘앙스
for e in d4['nuance']:
    sit = SIT[e['s']]
    c = [n for n in sit['nuance'] if n['kind'] == e['kind']]; assert len(c) == 1, e
    n = c[0]; n.update(e.get('set', {}))
    for idx, upd in (e.get('scene') or {}).items(): n['scenes'][idx].update(upd)
# ---- order
for e in d4['order']:
    o = SIT[e['s']]['order']
    if 'why' in e: o['why'] = e['why']
    for idx, upd in (e.get('lines') or {}).items(): o['lines'][idx].update(upd)

with open(P(f'{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=100000)

# ---- changes
changes = copy.deepcopy(chg_doc['changes'])
V44W = ('id', 'en', 'ipa', 'ko', 'icon', 'example'); V44S = ('en', 'ko', 'chunks', 'words')
changes = [c for c in changes if not (c['kind'] in ('word', 'sentence') and c.get('id') in removed)]
pre_W = {w['id']: w for w in pre['words']}
def add_word(wid, fields, why):
    for c in changes:
        if c['kind'] == 'word' and c['id'] == wid:
            c['fields'] = sorted(set(c['fields']) | set(fields), key=V44W.index); c['why'] += ' / ' + why; return
    changes.append({'kind': 'word', 'id': wid, 'fields': sorted(fields, key=V44W.index), 'why': why})
WHY_W = {
 'w-swab': "문장 2.5는 스펀지를 적셔 닦음(구강 스펀지 스왑) — ko '면봉으로 닦다'를 '닦아 내다'로",
 'w-respiratory': "문장 19.1 'call respiratory'는 호흡치료팀(RT) — ko '호흡의'를 '호흡치료팀'으로",
 'w-notify': "w-call(연락하다)과 거의 같아 듣고 뜻 고르기에서 겹침 — '통보하다'",
 'w-sort': "문장 6.5는 'sort this out' — 헤드워드를 구 'sort out'으로, ipa 맞춤",
 'w-bring': "예문이던 1.2(bring the pressure down)는 이 뜻으로 태그하지 않음 — 14.1 문장으로",
 'w-clear': "예문 2.4(clears you, 동사)는 이 뜻으로 태그하지 않음 — 5.3 문장으로",
 'w-call': "예문 3.5(call button)는 이 뜻으로 태그하지 않음 — 6.1 문장으로",
}
for wid, w in W.items():
    if wid in added: continue
    diff = [k for k in V44W if w.get(k) != pre_W[wid].get(k)]
    if diff: add_word(wid, diff, WHY_W.get(wid, "이 단어를 예문으로 쓰던 문장을 바꾼 검토 반영에 맞춰 예문·exKo를 바꿈"))
for wid in added:
    changes.append({'kind': 'word-add', 'id': wid, 'why': "17.5에 이미 있는 말 — last/well 태그를 뺀 뒤 가르치지 않게 된 뇌졸중 인계 핵심 용어(검토 A 39번)"})
WHY_REM = {'w-first': "10.3을 'first' 없는 문장으로 바꿔(INR을 기다리며 역전 지연 — 안전) 어느 문장도 태그하지 않게 됨",
           'w-push': "16.4를 'Give the ordered…'로 바꿔(정맥 점적을 push로 가르침 — 사실 오류) 어느 문장도 태그하지 않게 됨"}
for wid in removed: changes.append({'kind': 'word-remove', 'id': wid, 'why': WHY_REM[wid]})
WHY_S = {
 (0, 5): "서야 할 쪽이 반대(오른팔 위약 환자의 보이는 쪽은 왼쪽) — 사실 오류",
 (3, 3): "tPA 직후 사정 간격을 '한 시간마다'로 약속하면 초기 15분 간격을 잘못 가르침 — 'often'",
 (3, 4): "tPA 뒤 새 졸림을 '정상'이라 단정하면 출혈 신호를 놓침(안전) — 새 졸림은 정상이 아니니 바로 말하라고. w-little 태그를 뺌",
 (4, 5): "모든 뇌졸중 환자의 뇌압이 낮아진다고 단정함 — 'For some patients'",
 (8, 4): "혈압 목표 숫자를 간호사가 정한 값처럼 말함 — 처방 목표로. chunks도 구 단위로",
 (9, 4): "재검 시점을 간호사가 약속함(업무 범위) — 치료사가 정한다고",
 (10, 3): "와파린 복용 출혈 환자에게 INR을 기다리라는 'first'는 역전을 늦춤(안전) — INR은 스탯으로 보내며 역전제를 동시에 준비. w-first 태그를 뺌",
 (11, 3): "혈전제거 후 사정 간격 '한 시간마다' 약속 — 'often'",
 (15, 5): "뇌탈출 위기에서 '몇 분마다' 알려 준다는 지킬 수 없는 약속, 간호사는 환자 곁 — 'as soon as we know more'",
 (16, 3): "'blew'는 동공이 크게 열리고 반응이 없어진 것 — ko를 맞춤",
 (16, 4): "tPA 후 출혈 역전제는 push가 아니라 점적이고 처방 표시도 없음 — 'Give the ordered…'. w-push 태그를 뺌",
 (19, 2): "여기 support는 호흡 보조(삽관·기계환기) — ko만",
 (20, 4): "간호사가 치료 목표 전환을 먼저 제안함(업무 범위) — 환자의 뜻이면 의료팀이 할 수 있다고",
 (17, 5): "last known well을 단어 w-last-known-well로 태그",
}
CH = {(c['situation'], c['index']): c for c in changes if c['kind'] == 'sentence'}
n_new = 0
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        px = pre['situations'][si]['sentences'][i]
        diff = [k for k in V44S if x[k] != px[k]]
        if not diff: continue
        why = WHY_S.get((si, i)) or ("구 경계에서 끊긴 chunks를 구 단위로 바로잡음 — 문장은 그대로" if diff == ['chunks'] else "검토 반영")
        key = (s['title'], i)
        if key in CH:
            c = CH[key]; c['fields'] = sorted(set(c['fields']) | set(diff), key=V44S.index); c['why'] += ' / ' + why
        else:
            c = {'kind': 'sentence', 'situation': s['title'], 'index': i, 'fields': sorted(diff, key=V44S.index), 'why': why}
            changes.append(c); CH[key] = c
        n_new += 1
with open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': chg_doc['theme'], 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=100000)
print('words', len(pre['words']), '->', len(doc['words']), '| changes', len(chg_doc['changes']), '->', len(changes), '| sentences changed', n_new)
