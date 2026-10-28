import yaml, glob
T = 'icu-brain-death'
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
EASY = 'doctor time hour minute family body'.split()
JUDGED = 'begin ask question answer outside wrong way feel hard'.split()
REMOVE = {'w-' + r for r in EASY + JUDGED}
H = {'w-vital': ('vitals', '/ˈvaɪtlz/')}
KO = {
 'w-vital': ('활력징후', '문장이 모두 vitals(복수 명사)라 헤드워드를 맞춘다'),
 'w-die': ('사망하다', '같은 ko(사망)인 death와 품사·뜻이 섞이지 않게 동사로 가른다'),
 'w-exam': ('진찰', '같은 ko(검사)인 test와 가르고 문장(exam supplies)과 맞춘다 — 의사가 몸을 직접 살피는 진찰'),
 'w-confirm': ('맞는지 확인하다', '같은 ko(확인하다)인 check와 정답이 둘이 되지 않게 가른다'),
 'w-steady': ('일정한', '같은 ko(안정적인)인 stable과 가르고 문장(stayed steady)과 맞춘다'),
 'w-vent': ('호흡기(줄임말)', '같은 ko(인공호흡기)인 ventilator와 가른다 — 줄임말'),
 'w-volume': ('용적', '같은 ko(용량)인 dose와 가르고 문장(tidal volumes·give volume)과 맞춘다'),
 'w-arrange': ('주선하다', '같은 ko(조율하다)인 coordinate와 가른다 — 자리를 마련하는 쓰임'),
 'w-honor': ('받들다', '같은 ko(존중하다)인 respect와 가른다 — 전통·뜻을 받들어 따르는 쓰임'),
 'w-talk': ('대화하다', '문장이 "말을 걸다"와 "이야기 나누다"로 갈려 둘을 덮는 대화하다로 맞추고 speak(이야기하다)와 가른다'),
 'w-turn': ('돌려 눕히다', '같은 부류의 reposition(자세를 바꾸다)과 가른다 — 몸을 돌려 눕히는 쓰임'),
 'w-panel': ('검사 패널', '문장(last panel)의 뜻인 혈액검사 묶음으로 맞춘다'),
 'w-support': ('지원하다', '문장 쓰임이 대부분 동사(support you·supporting it)라 ko를 동사로 맞춘다'),
}
DROP = [
 ("You can hold his hand and talk to him, if that feels right.", ['w-hold'], 'hold가 손을 잡다 뜻이라 헤드워드 hold(유지되다)와 맞지 않는다'),
 ("There is no pressure — this is entirely your decision.", ['w-pressure'], 'pressure가 부담 뜻이라 헤드워드 pressure(혈압)와 맞지 않는다', ['w-entirely']),
 ("You have every right to say no, and that's completely okay.", ['w-right'], 'right가 권리 뜻이라 헤드워드 right(맞는)와 맞지 않는다', ['w-completely']),
 ("This decision belongs to you and your family alone.", [], '쉬운 단어 family를 빼고 belong을 새로 태그', ['w-belong']),
 ("Let's bring the whole team together to talk it through with you.", ['w-bring'], 'bring이 자리를 마련하다 뜻이라 헤드워드 bring(올리다)과 맞지 않는다'),
 ("I can have the next set of labs drawn within the hour.", ['w-set'], 'set이 묶음 뜻이라 헤드워드 set(준비되다)과 맞지 않는다'),
 ("His pressure is holding with the current support.", ['w-support'], 'support가 지지 요법(명사)이라 헤드워드 support(지원하다)와 맞지 않는다'),
 ("I'll step outside so you can have this time together.", ['w-step'], 'step이 자리를 비키다 뜻이라 헤드워드 step(단계)과 맞지 않는다'),
 ("Whatever you're feeling right now is okay.", [], '쉬운 단어 feel을 빼고 whatever를 새로 태그', ['w-whatever']),
 ("Here, support is withdrawn first, and we wait for the heart to stop.", ['w-support'], 'support가 지지 요법(명사)이라 헤드워드 support(지원하다)와 맞지 않는다'),
 ("His oxygen saturation has stayed above ninety-five.", ['w-stay'], 'stay가 유지되다 뜻이라 헤드워드 stay(머물다)와 맞지 않는다'),
 ("I hear you, and your family's wishes will be respected.", ['w-hear'], 'I hear you는 공감 표현이라 헤드워드 hear(듣다)와 맞지 않는다'),
]
ADD_WORDS = {
 'w-entirely': ('entirely', '/ɪnˈtaɪərli/', '전적으로', 'check', 'There is no pressure — this is entirely your decision.'),
 'w-completely': ('completely', '/kəmˈpliːtli/', '완전히', 'check', "You have every right to say no, and that's completely okay."),
 'w-whatever': ('whatever', '/wʌtˈɛvər/', '무엇이든', 'speech', "Whatever you're feeling right now is okay."),
 'w-belong': ('belong', '/bɪˈlɔːŋ/', '속하다', 'home', 'This decision belongs to you and your family alone.'),
}
sen = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}
for d in DROP:
    assert d[0] in sen, d[0]
for k, v in ADD_WORDS.items():
    assert v[4] in sen, v[4]
words, changes = [], []
for w in base['words']:
    if w['id'] in REMOVE:
        why = ('너무 쉬움 — 간호사가 이미 아는 말이라 STEP 1에서 뺀다(공통 쉬운 단어 목록)' if w['id'][2:] in EASY
               else '너무 쉬움 — 간호사가 이미 아는 말이라 가르칠 값이 없다(목록 밖 판단분)')
        changes.append({'kind': 'word-remove', 'id': w['id'], 'why': why}); continue
    d = data.pop('w-vitals' if w['id'] == 'w-vital' else w['id'])
    o = dict(w); fields = []; whys = []
    if w['id'] in H:
        o['en'], o['ipa'] = H[w['id']]; fields += ['en', 'ipa']; whys.append(KO[w['id']][1])
    if w['id'] in KO:
        o['ko'], r = KO[w['id']]; fields.append('ko')
        if w['id'] not in H: whys.append(r)
    if fields:
        changes.append({'kind': 'word', 'id': w['id'], 'fields': fields, 'why': '; '.join(whys)})
    o['exKo'] = sen[w['example']]
    o['cue'] = d['cue']; o['tag'] = d['tag']
    o['distractorsEn'] = d['en2']; o['distractorsKo'] = d['ko2']
    o['chips'] = d['chips']; o['decoyChips'] = d['dc']
    words.append(o)
for k, (en, ipa, ko, icon, ex) in ADD_WORDS.items():
    d = data.pop(k)
    o = {'id': k, 'en': en, 'ipa': ipa, 'ko': ko, 'icon': icon, 'example': ex, 'exKo': sen[ex],
         'cue': d['cue'], 'tag': d['tag'], 'distractorsEn': d['en2'], 'distractorsKo': d['ko2'],
         'chips': d['chips'], 'decoyChips': d['dc']}
    words.append(o)
    changes.append({'kind': 'word-add', 'id': k, 'why': f'{en} — 문장에 이미 있는 말, 쉬운 단어 태그를 빼고 모자란 상황 단어 수를 채운다'})
assert not data, list(data)
out = {'theme': T, 'words': words, 'situations': []}
for i, s in enumerate(base['situations']):
    ns = {'title': s['title'], 'sentences': []}
    for j, x in enumerate(s['sentences']):
        y = dict(x)
        drop = set(REMOVE); add = []; why = []
        for d in DROP:
            if x['en'] == d[0]:
                drop |= set(d[1]); why.append(d[2])
                if len(d) > 3: add += d[3]
        keep = [t for t in x['words'] if t not in drop] + add
        if keep != x['words']:
            y['words'] = keep
            reason = '; '.join(why) if why else '쉬운 단어 태그 빼기'
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': ['words'], 'why': reason})
        ns['sentences'].append(y)
    if i in nuance: ns['nuance'] = nuance[i]
    out['situations'].append(ns)
yaml.safe_dump(out, open(f'{T}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print(len(words), 'words', len(changes), 'changes')
