import yaml, glob
T = 'icu-liver-failure'
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
EASY = 'day morning now time go today hour come head see bad good'.split()
JUDGED = 'thing make use lot much talk whole want new'.split()
REMOVE = {'w-' + r for r in EASY + JUDGED}
H = {  # id: (en, ipa)
 'w-look': ('look for', '/lʊk fɔːr/'),
 'w-follow': ('follow up', '/ˈfɑːloʊ ʌp/'),
 'w-base': ('based on', '/beɪst ɑːn/'),
 'w-away': ('right away', '/raɪt əˈweɪ/'),
 'w-rule': ('rule out', '/ruːl aʊt/'),
}
KO = {
 'w-gut': ('창자', '같은 ko(장)인 bowel과 듣고 뜻 고르기에서 정답이 둘이 되지 않게 가른다'),
 'w-worsen': ('악화되다', '문장에 "if his mental status worsens"(자동사)도 있어 시키다 한정을 푼다'),
 'w-need': ('필요하다', '문장 쓰임이 모두 동사(may need·I need)인데 ko가 명사 필요였다'),
 'w-call': ('호출하다', '문장이 "연락하다"와 "부르다"로 갈려 둘을 덮는 호출로 맞춘다'),
 'w-fall': ('줄어들다', '같은 ko(떨어지다)인 drop과 가른다 — 배출량이 줄어드는 쓰임'),
 'w-drop': ('급락하다', '같은 ko(떨어지다)인 fall과 가른다 — 갑자기 떨어지는 쓰임'),
 'w-sugar': ('당 수치', '같은 ko(혈당)인 glucose와 정답이 둘이 되지 않게 가른다'),
 'w-lab': ('검사 결과', '같은 ko(검사)인 test와 가르고 문장(labs)과 맞춘다'),
 'w-level': ('농도', '같은 ko(수치)인 number와 가르고 문장(ammonia level)과 맞춘다'),
 'w-step': ('조치', '같은 ko(단계)인 stage와 가르고 문장(other steps)과 맞춘다'),
 'w-steady': ('일정한', '같은 ko(안정된)인 stable과 가르고 문장(keep sedation steady)과 맞춘다'),
 'w-med': ('약(줄임말)', '같은 ko(약)인 medicine과 가른다 — 줄임말'),
 'w-medication': ('처방약', '같은 ko(투약·약물)인 drug와 가르고 문장(medications)과 맞춘다'),
 'w-transport': ('운송', '같은 ko(이송)인 transfer와 가른다'),
 'w-confirm': ('맞는지 확인하다', '같은 ko(확인하다)인 check와 정답이 둘이 되지 않게 가른다'),
 'w-available': ('사용 가능한', '같은 ko(준비된)인 ready와 가른다'),
 'w-reaction': ('이상 반응', '같은 ko(반응)인 response와 가른다 — 약에 대한 원치 않는 반응'),
 'w-flag': ('표시해 알리다', '같은 ko(알리다)인 notify와 가른다'),
 'w-bring': ('가져가다', '같은 ko(가져오다)인 get과 가른다 — 들고 가는 쓰임'),
 'w-base': ('~에 근거해', '구(based on)에 맞춰 ko를 맞춘다'),
 'w-follow': ('후속 확인하다', '구(follow up)에 맞춰 ko를 맞춘다'),
 'w-away': ('바로', '구(right away)에 맞춘다'),
}
# 쓰임이 갈려 문장 태그만 빼는 곳: (문장 en, 뺄 id들, 이유)
DROP = [
 ("I'll alert the team if his mental status worsens.", ['w-alert'], '동사 alert(알리다)라 형용사 헤드워드 alert(각성된)와 맞지 않는다'),
 ("Let's change his dressing and check the site for redness.", ['w-change'], '동사 change(교체하다)라 명사 헤드워드 change(변화)와 맞지 않는다'),
 ("But there is still a lot we can do to keep him comfortable.", ['w-still'], 'still(여전히)이라 헤드워드 still(가만히)과 맞지 않는다'),
 ("His liver can't clear these medications the way it used to.", ['w-clear'], 'clear가 약물 대사·배설 뜻이라 헤드워드 clear(맑아지다)와 맞지 않는다'),
 ("We'll space out doses that are hard to clear.", ['w-clear', 'w-hard'], 'clear(대사)와 hard(어렵다)가 헤드워드 뜻과 맞지 않는다'),
 ("Let's lower the sedative dose and check his response.", ['w-low'], '동사 lower라 형용사 헤드워드 low와 맞지 않는다'),
 ("Keep his head elevated and avoid spikes in pressure.", ['w-pressure'], 'pressure가 뇌압·혈압 뜻이라 헤드워드 pressure(압박)와 맞지 않는다'),
 ("Let's prioritize his pressure and oxygenation now.", ['w-pressure'], 'pressure가 혈압 뜻이라 헤드워드 pressure(압박)와 맞지 않는다'),
 ("His kidneys, lungs, and pressure are all failing at once.", ['w-pressure'], 'pressure가 혈압 뜻이라 헤드워드 pressure(압박)와 맞지 않는다'),
 ("This is hard news, and I'm so sorry.", ['w-hard'], 'hard가 힘든 뜻이라 헤드워드 hard(부담이 되는)와 맞지 않는다'),
 ("His right pupil looks a little sluggish compared to the left.", ['w-look'], 'look이 ~해 보이다라 헤드워드 look for(찾다)와 맞지 않는다'),
 ("Infection, bleeding, or a missed dose can all trigger this.", ['w-trigger'], '동사 trigger라 명사 헤드워드 trigger(유발요인)와 맞지 않는다'),
]
sen = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}
for en, _, _ in DROP:
    assert en in sen, en
words, changes = [], []
for w in base['words']:
    if w['id'] in REMOVE:
        why = ('너무 쉬움 — 간호사가 이미 아는 말이라 STEP 1에서 뺀다(공통 쉬운 단어 목록)' if w['id'][2:] in EASY
               else '너무 쉬움 — 간호사가 이미 아는 말이라 가르칠 값이 없다(목록 밖 판단분)')
        changes.append({'kind': 'word-remove', 'id': w['id'], 'why': why}); continue
    d = data.pop(w['id'])
    o = dict(w); fields = []; whys = []
    if w['id'] in H:
        o['en'], o['ipa'] = H[w['id']]; fields += ['en', 'ipa']; whys.append('구 단위 헤드워드로(문장 쓰임에 맞춤)')
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
        drop = set(REMOVE)
        why = []
        for en, ids, r in DROP:
            if x['en'] == en:
                drop |= set(ids); why.append(r)
        keep = [t for t in x['words'] if t not in drop]
        if keep != x['words']:
            y['words'] = keep
            removed = [t for t in x['words'] if t in drop]
            reason = '; '.join(why) if why else '쉬운 단어 태그 빼기'
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': ['words'], 'why': reason})
        ns['sentences'].append(y)
    ns['nuance'] = nuance[i]
    out['situations'].append(ns)
yaml.safe_dump(out, open(f'{T}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print(len(words), 'words', len(changes), 'changes')
