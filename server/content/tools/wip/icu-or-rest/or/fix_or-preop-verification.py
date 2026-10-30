#!/usr/bin/env python3
"""or-preop-verification 수정 — pre-fix 를 읽어 or-preop-verification.yaml 을 쓴다 (다시 돌릴 수 있음).
순서: B(distractorsKo·blank·decoy·why) → A 문장 en 교체(data_1) → ko 만 교체(data_2) → 단어(data_3) → 뉘앙스 → order(data_4) → changes.
"""
import yaml, json, copy, re, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
T = 'or-preop-verification'
d = yaml.safe_load(open(f'{T}.pre-fix.yaml'))
S = d['situations']
W = {w['id']: w for w in d['words']}
def sent(i, j): return S[i]['sentences'][j]
def key(k): i, j = k.split('.'); return int(i), int(j)

# ---------- B ----------
prop = json.load(open('_reviewB_or-preop-verification_proposal.json'))
for k, v in prop.items():
    i, j, n = map(int, k.split('.'))
    sent(i, j)['distractorsKo'][n] = v[0]

BLANK = {
(0,5):("name",["name","room number","weight","insurance"]),
(1,0):("operating",["operating","lying","standing","leaning"]),
(1,2):("chart",["chart","bill","locker","receipt"]),
(2,4):("desk",["desk","pharmacy","elevator","lab"]),
(3,0):("marking",["marking","incision","dressing","stitches"]),
(3,3):("awake",["awake","alone","dressed","standing"]),
(4,0):("allergies",["allergies","symptoms","surgeries","bruises"]),
(4,2):("team",["team","waiting room","lobby","hallway"]),
(4,3):("band",["band","belt","sleeve","bag"]),
(4,4):("same",["same","wrong","extra","next"]),
(5,2):("fasting",["fasting","drinking","walking","sleeping"]),
(5,4):("stomach",["stomach","bladder","bowel","schedule"]),
(5,5):("midnight",["midnight","sunrise","noon","sunset"]),
(6,4):("mismatch",["mismatch","delay","shortage","billing error"]),
(9,0):("interpreter",["interpreter","administrator","auditor","chaplain"]),
(9,2):("step",["step","machine","pill","rule"]),
(12,0):("legal",["legal","former","casual","visiting"]),
(12,2):("confirm",["confirm","guess","assume","print"]),
(13,4):("consent",["consent","gown","badge","nurse"]),
(14,0):("planned",["planned","usual","extra","cheapest"]),
(14,1):("permission",["permission","insurance","referral","address"]),
(15,0):("marking",["marking","badge","schedule","invoice"]),
(15,5):("voice",["voice","screen","ear","badge"]),
(17,3):("unconscious",["unconscious","comfortable","talkative","ambulatory"]),
(18,0):("patient",["patient","tray","room","gown"]),
(19,0):("mind",["mind","seat","shirt","locker"]),
(20,0):("prepping",["prepping","weighing","carrying","reading"]),
(20,2):("incise",["incise","suture","discharge","extubate"]),
(20,3):("freezes",["freezes","hurries","leaves","scrubs"]),
}
for (i, j), (a, o) in BLANK.items():
    sent(i, j)['blank'] = {'answer': a, 'options': [{'en': t} for t in o]}

DECOY = {(3,2):'draped', (8,1):'to round', (15,0):'— the consent and schedule', (15,2):'Nobody leaves',
         (18,5):'the correct chart', (19,1):'and let your ride', (20,1):'the right room', (20,4):'No drape goes on',
         (3,0):'the incision'}
for (i, j), v in DECOY.items():
    sent(i, j)['decoy'] = v

def rep(i, j, a, b):
    x = sent(i, j); assert a in x['why'], (i, j, a); x['why'] = x['why'].replace(a, b)
rep(8,5,'완료형으로','과거형으로')
rep(12,5,'only로 범위가 이 시술 하나로 한정됨을','only로 범위가 동의서에 적힌 시술로 한정됨을')
rep(7,5,'예외가 없다는 점을 못 박고','예외가 없다는 점을 분명히 하고')
rep(9,3,'순서를 못 박아요','순서를 정해요')
rep(13,0,'한꺼번에 묶지 않는다고 못 박아요','한꺼번에 묶지 않는다고 분명히 해요')
rep(14,0,'해당함을 못 박아요','해당함을 분명히 해요')
rep(19,4,'시점을 못 박아요','시점을 분명히 해요')

# B 값 중 어간 상한(W19)·길이 때문에 다시 쓴 것
prop2 = {(19,3,0):'언제든, 지금 이 순간에도 가족과 이야기하실 수 있어요.', (14,5,1):'무엇에 동의했는지 모르시면 언제든 물어보셔도 돼요.'}
for (i, j, n), v in prop2.items(): sent(i, j)['distractorsKo'][n] = v

# ---------- A: 문장 ----------
d1 = yaml.safe_load(open(f'fix_{T}_data_1.yaml'))
d2 = yaml.safe_load(open(f'fix_{T}_data_2.yaml'))
CH = []   # changes
sit_title = lambda i: S[i]['title']
def blank_fmt(b): return {'answer': b['answer'], 'options': [{'en': t} for t in b['options']]}
for k, v in d1.items():
    i, j = key(k); x = sent(i, j)
    fields = []
    for f in ('en', 'ko', 'chunks'):
        if x[f] != v[f]: fields.append(f)
    if x['words'] != v['words']: fields.append('words')
    for f, val in v.items():
        x[f] = blank_fmt(val) if f == 'blank' else val
    CH.append((i, j, fields))
for k, v in d2.items():
    i, j = key(k); x = sent(i, j); fields = []
    for f, val in v.items():
        if f in ('ko', 'chunks') and x[f] != val: fields.append(f)
        x[f] = val
    if fields: CH.append((i, j, fields))

# ---------- 단어 ----------
d3 = yaml.safe_load(open(f'fix_{T}_data_3.yaml'))
removed = set(d3['remove'])
for wid, f in d3['set'].items():
    W[wid].update(f)
# w-eye 삭제 → 문장 태그에서 뺌
for i, s in enumerate(S):
    for j, x in enumerate(s['sentences']):
        if any(w in removed for w in x['words']):
            x['words'] = [w for w in x['words'] if w not in removed]
            CH.append((i, j, ['words']))
# 결정 11 정리: 문장에서 바뀐 태그
# w-sign: 3.3 에서 뺌 / w-person: 7.5 에서 뺌 / w-follow·w-stop: 5.5 (data_1) / w-mark·w-eye: 13.x
x = sent(7, 5); x['words'] = [w for w in x['words'] if w != 'w-person']; CH.append((7, 5, ['words']))
for j in (1, 4, 5):   # 13.x: w-mark 는 13.3 에서만 빠짐(data_1) — 나머지는 w-eye 만 뺌 (위에서 처리)
    pass
d['words'] = [w for w in d['words'] if w['id'] not in removed]
W = {w['id']: w for w in d['words']}

# 예문 맞춤
by_en = {}
for s in S:
    for x in s['sentences']:
        by_en[x['en']] = x
def with_word(wid):
    return [x for s in S for x in s['sentences'] if wid in x['words']]
old_en = {}   # 이전 문장 → 새 문장
pre = yaml.safe_load(open(f'{T}.pre-fix.yaml'))
for k in d1:
    i, j = key(k)
    old_en[pre['situations'][i]['sentences'][j]['en']] = sent(i, j)
pre_ko = {}
for s in pre['situations']:
    for x in s['sentences']:
        pre_ko[x['en']] = x['ko']
explicit = {}
for wid, k in d3['example'].items():
    i, j = key(k); explicit[wid] = sent(i, j)
for wid, w in W.items():
    if wid in explicit:
        w['example'], w['exKo'] = explicit[wid]['en'], explicit[wid]['ko']; continue
    ex = w['example']
    tgt = by_en.get(ex)
    if tgt is None and ex in old_en: tgt = old_en[ex]
    if tgt is None:
        continue          # 뉘앙스 예문 등
    if wid not in tgt['words']:
        cand = with_word(wid)
        tgt = cand[0] if cand else None
        print('예문 대체', wid, tgt['en'] if tgt else None)
    if tgt:
        w['example'], w['exKo'] = tgt['en'], tgt['ko']

# ---------- 뉘앙스 ----------
def nu(i, n): return S[i]['nuance'][n]
nu(7, 0)['decoys'] = ['at a glance']
nu(19, 0)['decoys'] = ['at a glance']
a = nu(1, 0)
a['scale'][0] = 'Sounds right to me'
a['why'] = "환자의 말과 차트가 같다는 것까지만 확인했으니 '당신과 차트가 일치해요'가 정확해요. '맞는 것 같아요'는 확인 없이 동의만 하는 말이고, 아직 집도의의 표시를 보지 못했으므로 셋이 모두 일치한다고 말하면 확인하지 않은 것을 말하는 거예요."
a = nu(3, 0)
a['scale'][1] = "There's a mark on your arm"
a = nu(13, 0)
a['scale'][0] = "Let's just keep going"
a['scale'][1] = 'We checked both earlier'
a['why'] = '양쪽 수술이라도 각 쪽은 따로 확인해요. 그냥 계속하자거나 앞서 둘 다 확인했다고 넘어가면 반대 쪽 혼동을 막지 못해요. 두 번째 쪽도 시작 전에 다시 확인해요.'
nu(11, 0)['why'] = '구두 동의는 시각과 증인까지 바로 기록으로 남겨야 근거가 돼요. 가운데 보기는 무엇을 적는지(시각·증인)가 빠져 있고, 기억에 맡기면 나중에 동의가 있었다는 것을 보여 줄 수 없어요.'
nu(16, 0)['why'] = "동의가 확인되지 않은 채 유도에 들어가면 되돌릴 수 없어요. 'I'm not comfortable'은 우려를 꺼내는 정당한 표현이지만, 약이 준비된 지금은 멈추라는 말까지 분명히 해야 해요."
a = nu(5, 0)
assert a['cue'].endswith(" Whether it matters is the anesthesia team's call, not yours.")
a['cue'] = a['cue'].replace(" Whether it matters is the anesthesia team's call, not yours.", '')
# N8 context 2
nu(2, 1).update({
    'words': ['w-signature'], 'word': 'signature', 'ko': '서명',
    'scenes': [
        {'who': '간호사 → 집도의', 'icon': 'speech', 'en': 'Her signature and the date are on the consent, and it matches the case.', 'ok': True},
        {'who': '수술 기록', 'icon': 'board', 'en': 'Consent: pt signature, date and time verified.', 'ok': True},
        {'who': '불안한 환자에게', 'icon': 'faceWorried', 'en': 'Your signature has been authenticated and the instrument duly executed.', 'ok': False,
         'fix': 'Your signature is right here, and everything matches what you told me.'}],
    'why': "뜻은 셋 다 '서명'이에요. 의료진끼리나 기록에서는 짧고 건조하게 써도 되지만, 불안한 환자에게 '인증됐고 서류가 정식으로 집행됐다'는 법조문 말투를 쓰면 차갑고 알아듣기 어려워요. 환자에게는 서명이 어디에 있고 무엇과 맞는지 쉬운 말로 말해요."})
# N9 context 14
c = nu(14, 1)
c['scenes'][0] = {'who': '간호사 → 집도의', 'icon': 'speech', 'en': 'Her consent covers the planned procedure only — she has questions about anything extra.', 'ok': True}
# N10 context 19
c = nu(19, 1)
c['scenes'] = [
    {'who': '간호사 → 집도의', 'icon': 'speech', 'en': "She's changed her mind and wants to talk with you before anything else.", 'ok': True},
    c['scenes'][1],
    {'who': '환자에게', 'icon': 'faceWorried', 'en': 'Pt has changed mind; withdrawal of consent documented; case on hold.', 'ok': False,
     'fix': "You've changed your mind, and that's completely okay — I'll let your surgeon know."}]
c['why'] = "뜻은 셋 다 '마음'이에요. 의료진끼리나 기록에서는 짧게 말하지만, 환자에게 차트 말투를 쓰면 마음을 바꾼 일이 서류 처리 하나로 들려요. 환자의 결정을 존중한다고 쉬운 말로 말하고 집도의에게 알려요."
# N11 context 13
c = nu(13, 1)
c['scenes'][2]['en'] = 'Each side undergoes independent laterality verification before the second procedure.'
c['why'] = "뜻은 셋 다 '쪽'이에요. 의료진끼리나 기록에서는 쪽을 짧게 말하지만, 환자에게 'laterality verification' 같은 용어를 쓰면 무슨 말인지 몰라 불안해져요. 한 쪽씩 확인한다고 쉽게 풀어 줘요."
# N12 context 20 / 17
nu(20, 1)['scenes'][2]['fix'] = 'We caught that the wrong side was being prepped before anything started, and your husband is safe.'
nu(17, 1)['scenes'][2]['fix'] = "We haven't been able to confirm who he is yet — could you help us?"
# N13 context 7 -> swap
opts = ["We've stopped for a moment because what you said and the mark don't match",
        'We have stopped due to a laterality discrepancy',
        "Something's wrong with your surgery"]
S[7]['nuance'][1] = {
    'kind': 'swap', 'words': ['w-stop', 'w-mark', 'w-match'],
    'who': '간호사 → 불안한 환자', 'icon': 'me',
    'before': ['', 'We have stopped due to a laterality discrepancy', '.'],
    'options': opts, 'answer': opts[0],
    'notes': {
        opts[0]: '왜 멈췄는지를 쉬운 말로 사실대로 알려 준다. 겁주지 않고 확인하려는 거라고 전한다.',
        opts[1]: "의료진끼리 쓰는 말이라 환자는 무슨 뜻인지 모르고, 멈췄다는 사실만 들려 겁이 난다.",
        opts[2]: '사실보다 무겁게 들려 불안만 키운다. 아직 잘못된 일이 생긴 게 아니라 생기기 전에 멈춘 것이다.'},
    'why': '환자에게는 왜 멈췄는지를 쉬운 말로 풀어요. 용어로 말하면 겁이 나고, "뭔가 잘못됐다"고 하면 사실보다 무겁게 들려요.',
    'ko': '말씀하신 것과 표시가 맞지 않아서 잠깐 멈췄어요'}
# N14 swap 8 ko / S21 swap 18 before
nu(8, 1)['ko'] = '집도의가 표시할 때까지 보류합시다'
nu(18, 1)['before'][2] = '.'

# ---------- order ----------
d4 = yaml.safe_load(open(f'fix_{T}_data_4.yaml'))
for i, o in d4['order'].items():
    od = S[i]['order']
    for f in ('ko', 'why'):
        if f in o: od[f] = o[f]
    for n, ln in (o.get('lines') or {}).items():
        od['lines'][n - 1].update(ln)

yaml.safe_dump(d, open(f'{T}.yaml', 'w'), allow_unicode=True, sort_keys=False)

# ---------- changes (base 와 비교해 V16 허용 목록을 채움) ----------
base = yaml.safe_load(open(f'base-{T}.yaml'))
ch = yaml.safe_load(open(f'changes-{T}.pre-fix.yaml'))
changes = ch['changes']
for c in changes: c['why'] = c['why'].replace('너무 쉬움 — 너무 쉬움 — ', '너무 쉬움 — ')
WK = ('id', 'en', 'ko', 'ipa', 'icon', 'example')
SK = ('en', 'ko', 'chunks', 'words', 'goal')
WHY_WORD = {
    'w-eye': '간호사가 아는 말 — or-count 와 같은 기준(결정 11)으로 삭제, 13.x 문장 태그에서 뺌',
    'w-loud': '큰 소리로가 아니라 out loud(소리 내어)의 뜻 — 헤드워드를 구로 바꿈(결정 11)',
    'w-glance': '문장은 at a glance(한눈에) — 헤드워드를 구로 바꿈(결정 11, 낮음)',
    'w-count': "간주되다는 법률 투 — 해당되다로(결정 11)",
    'w-prep': '수술실의 prep 은 피부 소독 — 준비하다에서 소독하다로(결정 11)',
    'w-freeze': '얼어붙다는 겁에 질린 느낌 — 그 자리에 멈추다로(결정 11, 낮음)',
}
now_w = {w['id']: w for w in d['words']}
done = {}
for c in changes:
    if c['kind'] == 'word': done.setdefault(c['id'], set()).update(c.get('fields') or [])
for bw in base['words']:
    w = now_w.get(bw['id'])
    if w is None:
        if bw['id'] in removed and not any(c['kind'] == 'word-remove' and c['id'] == bw['id'] for c in changes):
            changes.append({'kind': 'word-remove', 'id': bw['id'], 'why': WHY_WORD.get(bw['id'], '결정 11 삭제')})
        continue
    f = [k for k in WK if bw.get(k) != w.get(k) and k not in done.get(bw['id'], set())]
    if f:
        why = WHY_WORD.get(bw['id'])
        if bw['id'] in ('w-floor', 'w-follow', 'w-stop'):
            why = 'A 검토 — 예문 문장이 바뀌거나 태그가 빠져 다른 문장(8.3 · 17.0 · 7.0)으로 옮김'
        if not why:
            why = '예문이 된 문장의 en·ko 가 검토 수정으로 바뀌어 같은 문장으로 맞춤' if f == ['example'] else '검토 수정(A 목록)'
        changes.append({'kind': 'word', 'id': bw['id'], 'fields': f, 'why': why})
WHY_SENT = {}
for k, v in d1.items():
    WHY_SENT[key(k)] = 'A 검토 — 문장 사실·역할·안전 오류 수정(en·ko·chunks·words 를 함께 바꾸고 v46 필드를 새로 씀)'
WHY_SENT[(5, 3)] = 'A 검토 S13 — ko 의 단정("물 한 모금도 금식 위반") 완화'
WHY_SENT[(15, 5)] = 'A 검토 S15 — "모든 목소리" 직역을 "모두"로'
for k in [(20, 0), (12, 0), (14, 1), (19, 2), (19, 5)]: WHY_SENT[k] = 'A 검토 S19·S20 — 소독 뜻 바로잡기, 환자에게 쓰는 "당신" 표현을 "환자분"으로'
WHY_SENT[(7, 5)] = 'A 검토 S17 — w-person 은 사람이 아니라 in person(직접)이라 7.5 태그에서 뺌'
WHY_SENT[(18, 4)] = 'A 검토 S18 — 주어를 끊던 chunks 를 구 경계로'
for i, (bs, ns) in enumerate(zip(base['situations'], d['situations'])):
    if not bs.get('sentences'): continue
    for j, (b, a) in enumerate(zip(bs['sentences'], ns['sentences'])):
        have = set()
        for c in changes:
            if c['kind'] == 'sentence' and c['situation'] == bs['title'] and c['index'] == j:
                have.update(c.get('fields') or [])
        f = [k for k in SK if b.get(k) != a.get(k) and k not in have]
        if f:
            changes.append({'kind': 'sentence', 'situation': bs['title'], 'index': j, 'fields': f,
                            'why': WHY_SENT.get((i, j), '결정 11 — w-eye 삭제로 문장 태그 정리' if f == ['words'] else '검토 수정(A 목록)')})
yaml.safe_dump(ch, open(f'changes-{T}.yaml', 'w'), allow_unicode=True, sort_keys=False)
print('written; changes', len(changes), '(was', len(yaml.safe_load(open(f'changes-{T}.pre-fix.yaml'))['changes']), ')')
