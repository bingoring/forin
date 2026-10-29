import yaml, glob, sys
T = 'icu-glycemic'
base = yaml.safe_load(open(f'base-{T}.yaml', encoding='utf-8'))
data = {}
for f in sorted(glob.glob(f'add_{T}_A_words_*.yaml')):
    for e in yaml.safe_load(open(f, encoding='utf-8')):
        for k, v in e.items():
            if isinstance(v, list):
                for x in v:
                    for y in (x if isinstance(x, list) else [x]):
                        assert isinstance(y, str), (e['id'], y)
        assert 'w-' + e['id'] not in data, e['id']
        data['w-' + e['id']] = e
nuance = {}
for f in sorted(glob.glob(f'add_{T}_A_nuance_*.yaml')):
    nuance.update(yaml.safe_load(open(f, encoding='utf-8')))

EASY = 'hour afternoon day minute time today hand body know go come good bad'.split()
JUDGED = 'big small easy long few other third whole someone get'.split()
REMOVE = {'w-' + r for r in EASY + JUDGED}
KO = {  # 같은 ko가 둘 이상이라 듣고 뜻 고르기에서 정답이 둘이 되는 것을 가른다
    'w-drive': ('좌우하다', 'cause(일으키다)와 가른다 — 변동·고혈당을 밀어붙이는 원인'),
    'w-sick': ('몸이 안 좋은', 'ill(아픈)과 가른다'),
    'w-confirm': ('확정하다', 'check·verify(확인하다)와 가른다 — 다른 검사로 못 박다'),
    'w-verify': ('검증하다', 'check·confirm(확인하다)과 가른다'),
    'w-frequently': ('빈번하게', 'often(자주)과 가른다'),
    'w-document': ('문서로 남기다', 'record(기록하다)와 가른다'),
    'w-quick': ('재빠른', 'fast(빠른)와 가른다'),
    'w-level': ('수준', 'number·value(수치)와 가른다'),
    'w-number': ('숫자', 'level·value(수치)와 가른다'),
    'w-bump': ('한 칸 올리다', 'raise(올리다)와 가른다 — 기준표에서 한 칸'),
    'w-update': ('경과를 알리다', 'notify(알리다)와 가른다'),
    'w-cut': ('확 줄이다', 'decrease(줄이다)와 가른다'),
    'w-up': ('상승', 'rise(오름)와 가른다'),
    'w-down': ('하락', 'up과 짝을 맞춘다'),
    'w-clear': ('분명한/가시다', 'remove(제거하다)와 정답이 둘이 되지 않게 가른다 — 문장은 분명하다·나아지다·배출되다'),
}
EXKO = {
    'w-aim': '혈당을 140에서 180 사이로 목표로 해요.',
    'w-between': '혈당을 140에서 180 사이로 목표로 해요.',
    'w-sugar': '혈당을 자주 확인해요.',
    'w-safety': '이건 안전을 위한 거예요.',
    'w-baseline': '이건 원래 갖고 있던 당뇨가 아니에요.',
    'w-illness': '병이 혈당을 올리고 있는 거예요.',
    'w-propose': '다음번 저혈당을 막기 위해 더 안전한 프로토콜을 제안할게요.',
}
sen = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}
words, changes = [], []
for w in base['words']:
    if w['id'] in REMOVE:
        changes.append({'kind': 'word-remove', 'id': w['id'], 'why': '너무 쉬움 — 간호사가 이미 아는 말이라 STEP 1에서 뺀다' + ('(공통 쉬운 단어 목록)' if w['id'][2:] in EASY else '(목록 밖 판단분)')})
        continue
    d = data.pop(w['id'])
    o = dict(w)
    if w['id'] in KO:
        o['ko'], why = KO[w['id']]
        changes.append({'kind': 'word', 'id': w['id'], 'fields': ['ko'], 'why': '같은 ko가 은행에 둘 이상: ' + why})
    o['exKo'] = sen.get(w['example'], EXKO.get(w['id']))
    assert o['exKo'], w['id']
    for k, src in (('cue', 'cue'), ('tag', 'tag'), ('distractorsEn', 'en2'), ('distractorsKo', 'ko2'), ('chips', 'chips'), ('decoyChips', 'dc')):
        o[k] = d[src]
    words.append(o)
assert not data, list(data)
out = {'theme': T, 'words': words, 'situations': []}
for i, s in enumerate(base['situations']):
    ns = {'title': s['title'], 'sentences': []}
    for j, x in enumerate(s['sentences']):
        y = dict(x)
        keep = [t for t in x['words'] if t not in REMOVE]
        if keep != x['words']:
            y['words'] = keep
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': ['words'], 'why': '쉬운 단어 태그 빼기'})
        ns['sentences'].append(y)
    if i in nuance:
        ns['nuance'] = nuance[i]
    out['situations'].append(ns)
yaml.safe_dump(out, open(f'{T}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print(len(words), 'words', len(changes), 'changes')
