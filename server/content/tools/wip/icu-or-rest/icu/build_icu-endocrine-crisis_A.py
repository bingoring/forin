import yaml, glob
T = 'icu-endocrine-crisis'
base = yaml.safe_load(open(f'base-{T}.yaml', encoding='utf-8'))
data = {}
for f in sorted(glob.glob(f'add_{T}_A_words_*.yaml')):
    for e in yaml.safe_load(open(f, encoding='utf-8')):
        k = 'w-' + str(e['id'])
        assert k not in data, k
        data[k] = e
nuance = {}
for f in sorted(glob.glob(f'add_{T}_A_nuance_*.yaml')):
    nuance.update(yaml.safe_load(open(f, encoding='utf-8')))
EASY = 'today body know hour go come home name doctor minute head time good'.split()
JUDGED = 'ice cold bed food eat talk glad last whole hard'.split()
REMOVE = {'w-' + r for r in EASY + JUDGED}
H = {  # id: (en, ipa)  활용형 -> 원형
 'settings': ('setting', '/ˈsɛtɪŋ/'), 'cells': ('cell', '/sɛl/'), 'following': ('follow', '/ˈfɑːloʊ/'),
 'monitoring': ('monitor', '/ˈmɑːnɪtər/'), 'running': ('run', '/rʌn/'), 'falling': ('fall', '/fɔːl/'),
 'closed': ('close', '/kloʊz/'), 'stopping': ('stop', '/stɑːp/'), 'resolved': ('resolve', '/rɪˈzɑːlv/'),
 'tolerating': ('tolerate', '/ˈtɑːləreɪt/'), 'correcting': ('correct', '/kəˈrɛkt/'), 'improves': ('improve', '/ɪmˈpruːv/'),
 'reaches': ('reach', '/riːtʃ/'), 'continuing': ('continue', '/kənˈtɪnjuː/'), 'looking': ('look', '/lʊk/'),
 'treating': ('treat', '/triːt/'), 'fixing': ('fix', '/fɪks/'), 'helps': ('help', '/hɛlp/'),
 'cultures': ('culture', '/ˈkʌltʃər/'), 'based': ('based on', '/beɪst ɑːn/'), 'giving': ('give', '/ɡɪv/'),
 'demands': ('demand', '/dɪˈmænd/'), 'warming': ('warm', '/wɔːrm/'), 'racing': ('race', '/reɪs/'),
 'climbing': ('climb', '/klaɪm/'), 'calling': ('call', '/kɔːl/'), 'raising': ('raise', '/reɪz/'),
 'acting': ('act', '/ækt/'), 'escalating': ('escalate', '/ˈɛskəleɪt/'), 'weighs': ('weigh', '/weɪ/'),
 'kidneys': ('kidney', '/ˈkɪdni/'), 'organs': ('organ', '/ˈɔːrɡən/'), 'involved': ('involve', '/ɪnˈvɑːlv/'),
 'responding': ('respond', '/rɪˈspɑːnd/'), 'crashed': ('crash', '/kræʃ/'), 'lungs': ('lung', '/lʌŋ/'),
 'priming': ('prime', '/praɪm/'), 'cooling': ('cool', '/kuːl/'),
}
KO = {
 'w-confirm': ('맞는지 확인하다', '같은 ko(확인하다)인 check와 듣고 뜻 고르기에서 정답이 둘이 되지 않게 가른다'),
 'w-sugar': ('당 수치', '같은 ko(혈당)인 glucose와 정답이 둘이 되지 않게 가른다'),
 'w-pressor': ('승압제(약칭)', '같은 ko(승압제)인 vasopressor와 가른다 — 줄임말'),
 'w-vasopressor': ('혈관수축 승압제', '같은 ko(승압제)인 pressor와 가른다 — 정식 이름'),
 'w-pace': ('진행 속도', '같은 ko(속도)인 rate와 가른다 — 진행되는 빠르기'),
 'w-value': ('측정값', '같은 ko(수치)인 number와 가른다'),
 'w-drip': ('점적', '같은 ko(주입)인 infusion과 가른다 — 한 방울씩 떨어뜨리는 주입'),
 'w-fall': ('하락하다', '같은 ko(떨어지다)인 drop과 가른다'),
 'w-steady': ('꾸준한', '같은 ko(안정적인)인 stable과 가르고, 문장(steadily·steady pace)과 맞춘다'),
 'w-stat': ('당장 시행', '같은 ko(즉시)인 immediately와 가른다 — 처방 표기'),
 'w-react': ('반응을 보이다', '같은 ko(반응하다)인 respond와 가른다'),
 'w-risky': ('위험이 따르는', '같은 ko(위험한)인 dangerous와 가른다'),
 'w-pressure': ('혈압', '문장 전부가 혈압 뜻인데 ko가 압력이라 맞춘다'),
 'w-work': ('효과가 있다', '문장은 모두 치료가 듣는다는 뜻(works)인데 ko가 듣다·작동하다였다'),
 'w-bring': ('이끌다', '문장 뜻(상태를 낮추거나 올려 이끌다)과 맞지 않는 가져오다를 고친다'),
 'w-way': ('길·방법', '같은 ko(방향)인 direction과 가르고 문장(방법·길)과 맞춘다'),
 'w-gap': ('간극(음이온차)', '음이온차(anion gap)임을 분명히 한다'),
 'w-alongside': ('병행하여', '같은 ko(함께)인 together와 가른다'),
 'w-demand': ('요구하다', '같은 ko(필요로 하다 ≈ 필요하다)인 need와 가른다'),
 'w-care': ('돌봄', '같은 ko(치료)인 treatment와 가른다'),
 'w-involve': ('관여하다', '같은 ko(함께하다)인 together와 가른다'),
}
sen = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}
words, changes = [], []
for w in base['words']:
    if w['id'] in REMOVE:
        why = ('너무 쉬움 — 간호사가 이미 아는 말이라 STEP 1에서 뺀다(공통 쉬운 단어 목록)' if w['id'][2:] in EASY
               else '너무 쉬움 — 간호사가 이미 아는 말이라 가르칠 값이 없다(목록 밖 판단분)')
        changes.append({'kind': 'word-remove', 'id': w['id'], 'why': why}); continue
    d = data.pop(w['id'])
    o = dict(w); fields = []; whys = []
    if w['en'] in H:
        o['en'], o['ipa'] = H[w['en']]; fields += ['en', 'ipa']; whys.append('활용형을 원형으로')
    if w['id'] in KO:
        o['ko'], r = KO[w['id']]; fields.append('ko'); whys.append(r)
    if fields:
        changes.append({'kind': 'word', 'id': w['id'], 'fields': fields, 'why': '; '.join(whys)})
    o['exKo'] = sen[w['example']]
    o['cue'] = d['cue']; o['tag'] = d['tag']
    o['distractorsEn'] = d['en2']; o['distractorsKo'] = d['ko2']
    o['chips'] = d['chips']; o['decoyChips'] = d['dc']
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
    ns['nuance'] = nuance[i]
    out['situations'].append(ns)
yaml.safe_dump(out, open(f'{T}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print(len(words), 'words', len(changes), 'changes')
