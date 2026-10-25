import yaml, copy, re, sys
D = '/Users/yeom-yeon-ung/repository/forin/server/content/tools/wip/icu-or-rest/icu/'
SRC = D + 'icu-cardiogenic.yaml'
CHG = D + 'changes-icu-cardiogenic.yaml'
dump = lambda o: yaml.safe_dump(o, allow_unicode=True, sort_keys=False, width=4096)
doc = yaml.safe_load(open(SRC, encoding='utf-8'))
orig = copy.deepcopy(doc)
d1 = yaml.safe_load(open(D + 'fix_icu-cardiogenic_data_1.yaml', encoding='utf-8'))
d2 = yaml.safe_load(open(D + 'fix_icu-cardiogenic_data_2.yaml', encoding='utf-8'))
bank = {w['id']: w for w in doc['words']}
sits = doc['situations']

# ---- 단어 ----
for wid, upd in d1['words'].items():
    w = bank[wid]
    for k, v in upd.items():
        assert k in w, (wid, k)
        w[k] = v

# ---- 문장 ----
sentence_en_map = {}   # old en -> (new en, new ko)
for key, u in d2.items():
    si, idx = map(int, key.split('.'))
    s = sits[si]['sentences'][idx]
    assert s['en'].startswith(u['expect']), (key, s['en'], u['expect'])
    old_en, old_ko = s['en'], s['ko']
    for k, v in u.items():
        if k == 'expect':
            continue
        if k == 'words_remove':
            for wid in v:
                assert wid in s['words'], (key, wid)
                s['words'].remove(wid)
        elif k == 'why_replace':
            assert v[0] in s['why'], key
            s['why'] = s['why'].replace(v[0], v[1])
        elif k == 'blank':
            ans, opts = v['answer'], v['options']
            assert ans in opts and len(opts) == 4, key
            s['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}
        elif k == 'chunks':
            s['chunks'] = list(v)
        else:
            assert k in s, (key, k)
            s[k] = v
    if (s['en'], s['ko']) != (old_en, old_ko):
        sentence_en_map[old_en] = (s['en'], s['ko'], old_ko)
    # chunks 이음 확인
    j = ''
    for c in s['chunks']:
        j += c if (c[:1] in ',.?!' and j) else ((' ' if j else '') + c)
    assert j == s['en'], (key, j, s['en'])

# 문장을 example로 쓰는 단어와 nuance example 맞춤
for w in doc['words']:
    if w['example'] in sentence_en_map:
        ne, nk, ok = sentence_en_map[w['example']]
        w['example'], w['exKo'] = ne, nk
    else:
        for oe, (ne, nk, ok) in sentence_en_map.items():
            if w['exKo'] == ok and w['example'] == oe:
                w['exKo'] = nk
for sit in sits:
    for n in sit['nuance']:
        if n.get('example') in sentence_en_map:
            ne, nk, ok = sentence_en_map[n['example']]
            n['example'], n['exKo'] = ne, nk

# ---- 뉘앙스 ----
def nu(si, ki, kind):
    n = sits[si]['nuance'][ki]
    assert n['kind'] == kind, (si, ki, n['kind'])
    return n
# N1 IABP 삽입 pair
n = nu(9, 0, 'pair')
n['pairs'] = [['place it', 'in his groin'], ['work', 'with each heartbeat'], ['watch', 'the insertion site']]
n['decoys'] = ['a deep breath']
n['why'] = 'place it은 장치를 넣는 동작이라 장소 in his groin과, work는 장치가 움직이는 말이라 with each heartbeat와, watch는 지켜보는 말이라 the insertion site와 짝이에요.'
# N2 VT pair
n = nu(17, 0, 'pair'); n['decoys'] = ['a pulse']
# N3 이뇨제 pair
n = nu(7, 0, 'pair'); n['decoys'] = ['the hallway']
# N4 부종 slider
n = nu(4, 0, 'slider')
n['scale'] = ['mild swelling', 'moderate swelling', 'severe swelling']
n['answerAt'] = 1
n['cue'] = 'Pitting swelling up to mid-shin in both legs, but the thighs are fine.'
n['why'] = '정강이 중간까지 눌린 자국이 남으면 moderate예요. mild는 발목 주변에 그칠 때, severe는 허벅지까지 퍼지거나 아주 깊게 들어갈 때예요.'
# N5 이뇨제 swap
n = nu(7, 1, 'swap')
n['before'] = ['This ', 'diuretic', ' in your IV will help you pee out the extra fluid.']
n['options'] = ['medicine', 'diuretic', 'natriuretic agent']
n['answer'] = 'medicine'
n['notes'] = {'medicine': '환자가 바로 알아듣는 말이에요. 먹는 이뇨제라면 water pill이라고도 하지만 이건 정맥 주사예요.',
              'diuretic': '의료진끼리 쓰는 말이라 환자는 뜻을 모를 수 있어요.',
              'natriuretic agent': '훨씬 전문적이라 환자에게 쓸 말이 아니에요.'}
n['why'] = '환자에게는 diuretic 대신 medicine처럼 이해되는 말로 설명해요. 먹는 약은 water pill이라고도 하지만 정맥으로 들어가는 약에는 pill이라고 하지 않아요.'
n['ko'] = '수액 줄로 들어가는 이 약이 여분의 수분을 소변으로 빼 줄 거예요'
# N6 출혈 context
n = nu(11, 1, 'context')
n['scenes'][2] = {'en': "You're actively bleeding from the femoral access site.", 'icon': 'me', 'ok': False,
                  'who': '환자에게',
                  'fix': "There's some bleeding where the tube went in, so we're pressing on it and watching it closely."}
n['why'] = '의료진끼리는 bleeding의 위치를 femoral access site처럼 정확히 말해요. 환자에게는 숨기지 않되, 어디서 피가 나는지와 지금 하는 조치를 쉬운 말로 전해요.'
# N7 선택 context
n = nu(20, 1, 'context')
n['scenes'][2] = {'en': 'Your choice is between LVAD destination therapy and palliative withdrawal.', 'icon': 'me', 'ok': False,
                  'who': '가족에게', 'fix': "There's no wrong choice — we'll walk through each option with you."}
n['why'] = '팀끼리는 선택지를 시술 이름으로 말하지만, 가족에게 LVAD·withdrawal 같은 말은 낯설고 차갑게 들려요. 재촉하지 않고 함께 살펴보겠다고 말해요.'
# N8 tracing context
n = nu(2, 1, 'context')
n['scenes'][2]['fix'] = 'The doctor is looking at your tracing now and will go over it with you.'
n['why'] = '의사와 차트에서는 ST·유도 번호까지 정확히 말하지만, 환자에게는 전문용어 대신 의사가 곧 함께 설명해 준다고 말해요. 심전도 해석은 간호사가 단정하지 않아요.'
# N9 강심제 swap ko
n = nu(1, 1, 'swap'); n['ko'] = '반응을 지켜보면서 약을 조금씩 조절할 거예요'

# ---- order ----
def ol(si, li, en, ko):
    l = sits[si]['order']['lines'][li]
    l['en'], l['ko'] = en, ko
ol(4, 2, 'Like your weight, what you drink counts, so how much have you had today?', '체중처럼 마시는 양도 중요하니 오늘 얼마나 드셨어요?')
ol(3, 1, "Now that you're up, I'll raise the head of your bed a little more.", '이제 앉으셨으니 침대 머리 쪽을 조금 더 올려드릴게요')
ol(7, 2, 'Her urine output should pick up within the hour.', '한 시간 안에 소변량이 늘어나야 해요')
ol(11, 2, 'While you do, tell me right away if it feels more numb or painful.', '그러는 동안 더 저리거나 아프면 바로 말씀해 주세요')
ol(12, 1, "That's why too much fluid could push his right heart further into failure.", '그래서 수분이 너무 많으면 우심부전이 더 심해질 수 있어요')
ol(12, 2, 'On top of the fluid, we avoid anything that raises his pulmonary pressures.', '수분 말고도 폐혈관 압력을 올리는 건 뭐든 피해요')
ol(15, 3, "While we prepare, I'm staying right here until he arrives.", '준비하는 동안 그가 올 때까지 바로 여기 있을게요')
ol(20, 1, "Even so, we're doing everything we can, and we'll keep you updated.", '그래도 저희는 할 수 있는 모든 걸 하고 있고, 계속 알려드릴게요')

# ---- 단어 제거 ----
for wid in d1['remove']:
    for sit in sits:
        for s in sit['sentences']:
            assert wid not in s['words'], (wid, s['en'])
        for n in sit['nuance']:
            assert wid not in n.get('words', []), (wid, n['kind'])
    doc['words'] = [w for w in doc['words'] if w['id'] != wid]

open(SRC, 'w', encoding='utf-8').write(dump(doc))

# ---- changes 자동 기록: 고치기 전(orig)과 비교 ----
chg = yaml.safe_load(open(CHG, encoding='utf-8'))
entries = chg['changes']
def find(kind, **kw):
    for e in entries:
        if e['kind'] == kind and all(e.get(k) == v for k, v in kw.items()):
            return e
def add(kind, why, fields=None, **kw):
    e = find(kind, **kw)
    if e is None:
        e = {'kind': kind, **kw}
        if fields is not None:
            e['fields'] = []
        e['why'] = why
        entries.append(e)
    else:
        if why not in e.get('why', ''):
            e['why'] = (e.get('why', '') + ' / ' + why) if e.get('why') else why
    if fields:
        for f in fields:
            if f not in e['fields']:
                e['fields'].append(f)
ow = {w['id']: w for w in orig['words']}
nw = {w['id']: w for w in doc['words']}
V44W = ['en', 'ko', 'ipa', 'icon', 'example']
WHY_W = {'en': '헤드워드를 문장 속 제 모습(right away)으로', 'ipa': '헤드워드에 맞춤', 'ko': 'ko를 문장 속 뜻에 맞게(fix-icu-cardiogenic-A)',
         'example': '예문으로 쓰던 문장이 바뀌어 새 문장으로'}
for wid, w in nw.items():
    ch = [k for k in V44W if w[k] != ow[wid][k]]
    if ch:
        add('word', '; '.join(WHY_W[k] for k in ch), ch, id=wid)
for wid in ow:
    if wid not in nw:
        add('word-remove', '너무 쉬움 또는 어느 문장도 태그하지 않게 됨(공통 쉬운 단어 목록·문장 수정)', id=wid)
for si, (a, b) in enumerate(zip(orig['situations'], doc['situations'])):
    for idx, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        ch = [k for k in ['en', 'ko', 'chunks', 'words'] if x[k] != y[k]]
        if ch:
            why = []
            if 'en' in ch or 'ko' in ch: why.append('틀리거나 부자연스러운 문장 수정(검토 A)')
            if 'chunks' in ch: why.append('구 경계에서 다시 쪼갬')
            if 'words' in ch: why.append('쉬운·잘못 붙은 단어 태그 정리')
            add('sentence', ' / '.join(why), ch, situation=a['title'], index=idx)
open(CHG, 'w', encoding='utf-8').write(dump(chg))
print('applied; changes', len(entries))
