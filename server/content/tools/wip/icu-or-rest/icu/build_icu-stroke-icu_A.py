import yaml, glob
T = 'icu-stroke-icu'
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
EASY = 'day time hour come go head see know bad good doctor hand minute room'.split()
JUDGED = 'make want way talk easy later'.split()
REMOVE = {'w-' + r for r in EASY + JUDGED}
H = {
 'w-turn': ('turn down', '/tɜːrn daʊn/'),
 'w-rule': ('rule out', '/ruːl aʊt/'),
}
KO = {
 'w-confirm': ('맞는지 확인하다', '같은 ko(확인하다)인 check와 정답이 둘이 되지 않게 가른다'),
 'w-med': ('약(줄임말)', '같은 ko(약)인 medicine과 가른다 — 줄임말'),
 'w-turn': ('볼륨을 줄이다', '구(turn down)에 맞추고 같은 ko(줄이다)인 reduce와 가른다'),
 'w-reduce': ('감소시키다', '같은 ko(줄이다)인 turn down과 가른다'),
 'w-assist': ('보조하다', '같은 ko(돕다)인 help와 정답이 둘이 되지 않게 가른다'),
 'w-react': ('반응을 보이다', '같은 ko(반응하다)인 respond와 가르고 문장(pupils reacting)과 맞춘다'),
 'w-update': ('계속 알려 주다', '같은 ko(알리다)인 notify와 가른다'),
 'w-notify': ('연락해 알리다', '같은 ko(알리다)인 update와 가른다'),
 'w-stat': ('긴급히', '같은 ko(즉시)인 immediately와 가른다'),
 'w-fast': ('재빨리', '같은 ko 계열인 quickly와 소리 선택에서 헷갈리지 않게 가른다'),
 'w-word': ('단어', '같은 ko(말)인 speech(말·언어)와 가른다'),
 'w-difficult': ('까다로운', '문장 "not trying to be difficult"은 까다롭게 굴다 뜻이라 힘든(hard)과 가른다'),
 'w-clear': ('또렷한', '문장 "words aren\'t clear"에 맞추고 맑아지다(동사)는 형용사 쓰임과 맞지 않는다'),
 'w-move': ('움직이다', '문장 쓰임이 옮기다·움직이다·이동하다로 갈려 둘을 덮는 ko로 맞춘다'),
 'w-call': ('연락하다', '문장이 연락하다 쓰임이 대부분이라 맞춘다'),
}
# 쓰임이 갈려 문장 태그만 빼는 곳
DROP = [
 ("Let's get her ready for angio immediately.", ['w-get'], 'get ready는 데려가다(헤드워드 get)와 쓰임이 다르다'),
 ("I'll get the intubation tray and suction ready.", ['w-get'], 'get ready는 데려가다(헤드워드 get)와 쓰임이 다르다'),
 ("Let's get a stat chest X-ray and an ABG.", ['w-get'], 'get(구하다)이라 데려가다(헤드워드 get)와 쓰임이 다르다'),
 ("I'm giving a medicine to gently bring the pressure down.", ['w-bring'], 'bring down(낮추다)이라 가져오다(헤드워드 bring)와 쓰임이 다르다'),
 ("Her left side just went completely weak in the last ten minutes.", ['w-last'], 'last가 형용사(지난)라 지속되다(헤드워드)와 맞지 않는다'),
 ("I'll give her last known well time and her NIHSS score.", ['w-last', 'w-well'], 'last(마지막)와 well(멀쩡한)이 헤드워드 뜻과 맞지 않는다'),
 ("It usually lasts less than two minutes.", ['w-little'], 'less than이라 헤드워드 little(약간의)과 맞지 않는다'),
 ("Small changes matter, so please keep letting me know.", ['w-keep'], 'keep -ing(계속 ~하다)라 유지하다(헤드워드 keep)와 맞지 않는다'),
 ("Keep bagging while we prepare for support.", ['w-keep', 'w-support'], 'keep -ing(계속)와 명사 support(보조 치료)가 헤드워드 뜻과 맞지 않는다'),
 ("I'll stay right here and keep you updated every few minutes.", ['w-keep'], 'keep you updated(계속 알리다)라 유지하다(헤드워드 keep)와 맞지 않는다'),
 ("Let me give you ice chips once the swallow test clears you.", ['w-clear'], 'clear가 통과시키다 뜻이라 헤드워드 clear(또렷한)와 맞지 않는다'),
 ("Let's preoxygenate him and position his airway.", ['w-position'], '동사 position(위치를 잡다)이라 명사 헤드워드 position(자세)과 맞지 않는다'),
 ("Changing position also protects your skin.", ['w-change'], '동사 changing(바꾸다)이라 명사 헤드워드 change(변화)와 맞지 않는다'),
 ("I'll page the doctor the moment anything changes.", ['w-change'], '동사 changes(바뀌다)라 명사 헤드워드 change(변화)와 맞지 않는다'),
 ("I'm doing a full neuro check and updating the team right away.", ['w-check'], '명사 check(검진)라 동사 헤드워드 check(확인하다)와 맞지 않는다'),
 ("If anything feels different, press the call button.", ['w-call'], 'call button(호출 버튼)이라 헤드워드 call(연락하다)과 맞지 않는다'),
 ("I'll call report to the neuro-interventional team.", ['w-call'], 'call report(인계 보고하다) 관용 표현이라 헤드워드 call(연락하다)과 맞지 않는다'),
 ("His sats dropped into the seventies after he aspirated.", ['w-drop'], '동사 dropped라 명사 헤드워드 drop(하락)과 맞지 않는다'),
]
def norm(s): return s.replace(' — ', ', ')
sen = {norm(x['en']): x['ko'] for s in base['situations'] for x in s['sentences']}
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
    o['exKo'] = sen[norm(w['example'])]
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
            reason = '; '.join(why) if why else '쉬운 단어 태그 빼기'
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': ['words'], 'why': reason})
        ns['sentences'].append(y)
    ns['nuance'] = nuance[i]
    out['situations'].append(ns)
yaml.safe_dump(out, open(f'{T}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
print(len(words), 'words', len(changes), 'changes')
