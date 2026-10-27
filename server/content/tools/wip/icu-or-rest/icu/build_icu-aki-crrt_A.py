import yaml, glob
T = 'icu-aki-crrt'
base = yaml.safe_load(open(f'base-{T}.yaml', encoding='utf-8'))
data = {}
for f in sorted(glob.glob(f'add_{T}_A_words_*.yaml')):
    for e in yaml.safe_load(open(f, encoding='utf-8')):
        for k, v in e.items():
            if isinstance(v, list):
                for x in v:
                    if isinstance(x, list):
                        for y in x:
                            assert isinstance(y, str), (e['id'], y)
                    else:
                        assert isinstance(x, str), (e['id'], x)
        assert 'w-' + e['id'] not in data, e['id']
        data['w-' + e['id']] = e
nuance = {}
for f in sorted(glob.glob(f'add_{T}_A_nuance_*.yaml')):
    nuance.update(yaml.safe_load(open(f, encoding='utf-8')))

EASY = ['hour', 'see', 'day', 'home', 'time', 'now', 'doctor', 'patient', 'family', 'body', 'go', 'come', 'minute']
JUDGED = ['big', 'new', 'red', 'warm', 'cold', 'many', 'small', 'easy', 'something', 'else']
REMOVE = {'w-' + r for r in EASY + JUDGED}
HEAD = {'w-heavy': ('heavily', '/ˈhɛvəli/'), 'w-realistic': ('realistically', '/ˌriːəˈlɪstɪkli/')}
KO = {'w-confirm': '맞는지 확인하다', 'w-medicine': '약제', 'w-level': '농도', 'w-volume': '체액량', 'w-set-up': '세팅하다', 'w-add-up': '불어나다'}
KO_WHY = {'w-confirm': '같은 ko(확인하다)인 check와 듣고 뜻 고르기에서 정답이 둘이 되지 않게 가른다',
          'w-medicine': '같은 ko(약)인 drug와 정답이 둘이 되지 않게 가른다 — 항응고제 문장의 약제',
          'w-level': '같은 ko(수치)인 number와 정답이 둘이 되지 않게 가른다 — 전해질·항생제 농도',
          'w-volume': '같은 ko(용량)인 dose와 정답이 둘이 되지 않게 가른다 — 체액량 이동',
          'w-set-up': '같은 ko(준비하다)인 prepare와 정답이 둘이 되지 않게 가른다 — 장비 세팅',
          'w-add-up': '같은 ko(쌓이다)인 build와 정답이 둘이 되지 않게 가른다 — 조금씩 모여 불어나다'}
# 단어 태그만 뺀다: (상황 제목, 문장 순번) → 뺄 id
DROP_TAG = {('급성 폐부종 응급 초여과', 5): ['w-off']}

sen = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}
words = []
changes = []
for w in base['words']:
    if w['id'] in REMOVE:
        why = ('너무 쉬움 — 간호사가 이미 아는 말이라 STEP 1에서 뺀다(공통 쉬운 단어 목록)' if w['id'][2:] in EASY
               else '너무 쉬움 — 간호사가 이미 아는 쉬운 형용사·대명사라 가르칠 값이 없다(목록 밖 판단분)')
        changes.append({'kind': 'word-remove', 'id': w['id'], 'why': why})
        continue
    d = data.pop(w['id'])
    o = dict(w)
    fields = []
    if w['id'] in HEAD:
        o['en'], o['ipa'] = HEAD[w['id']]
        fields += ['en', 'ipa']
    if w['id'] in KO:
        o['ko'] = KO[w['id']]
        fields.append('ko')
    if fields:
        why = '헤드워드를 문장 속 부사형으로(문장은 ' + o['en'] + ')' if 'en' in fields else KO_WHY[w['id']]
        changes.append({'kind': 'word', 'id': w['id'], 'fields': fields, 'why': why})
    o['exKo'] = sen[w['example']]
    o['cue'] = d['cue']
    o['tag'] = d['tag']
    o['distractorsEn'] = d['en2']
    o['distractorsKo'] = d['ko2']
    o['chips'] = d['chips']
    o['decoyChips'] = d['dc']
    words.append(o)
assert not data, list(data)
out = {'theme': T, 'words': words, 'situations': []}
for i, s in enumerate(base['situations']):
    ns = {'title': s['title'], 'sentences': []}
    for j, x in enumerate(s['sentences']):
        y = dict(x)
        drop = set(DROP_TAG.get((s['title'], j), []))
        keep = [t for t in x['words'] if t not in REMOVE and t not in drop]
        if keep != x['words']:
            y['words'] = keep
            why = '쉬운 단어 태그 빼기' if not drop else '헤드워드 ko(정상을 벗어난)와 맞지 않아 태그 빼기'
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': ['words'], 'why': why})
        ns['sentences'].append(y)
    ns['nuance'] = nuance[i]
    out['situations'].append(ns)
yaml.safe_dump(out, open(f'{T}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print(len(words), 'words', len(changes), 'changes')
