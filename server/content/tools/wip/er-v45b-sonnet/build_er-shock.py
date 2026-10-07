#!/usr/bin/env python3
"""er-shock v45 보강(Sonnet 저작): base를 읽어 새 필드만 얹고, 결정 11 정리를 적용한다."""
import collections, copy, glob, io, sys, yaml

T = "er-shock"
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v45b-sonnet'
base = yaml.safe_load(io.open(f'{D}/base-{T}.yaml', encoding='utf-8'))
doc = copy.deepcopy(base)

# ---- 결정 11: 가벼운 정리 ----
EASY_LIST = ['w-hand', 'w-today', 'w-head', 'w-see', 'w-come', 'w-minute', 'w-hour']
EASY_EXTRA = ['w-yes', 'w-no', 'w-eat', 'w-begin', 'w-big', 'w-through']  # 목록 밖 판단분 6개
EASY = EASY_LIST + EASY_EXTRA
EASY_WHY = '너무 쉬움 — 문장은 두고 태그만 뺐고, 어느 문장도 태그하지 않게 됐다'
EXTRA_WHY = {
    'w-begin': '너무 쉬움 — 문장은 두고 태그만 뺐고, 어느 문장도 태그하지 않게 됐다(w-start와 ko 시작하다가 겹치기도 했다)',
    'w-through': "go through를 구 단위로 가르치려 w-go를 구로 바꿨다 — through 낱말 태그는 불필요해져 은행에서 뺐다",
}

WORD_EDITS = {
    'w-fall': ({'ko': '낙상(넘어짐)', 'example': 'Have you had any falls recently?'},
               "태그 문장 여섯 중 다섯이 명사(any falls · prevent a fall · from the fall)인데 ko가 동사 '넘어지다'였다 — 예문도 명사로"),
    'w-throw': ({'en': 'throw up', 'ipa': '/ˌθroʊ ˈʌp/', 'example': 'Have you been throwing up?'},
                "ko '토하다'는 throw 낱말이 아니라 구 throw up의 뜻 — 태그 문장이 Throwing up이라 구로"),
    'w-bleed': ({'ko': '출혈(하다)'},
                "태그 문장 넷이 모두 명사 bleeding(vaginal bleeding · Bleeding inside)인데 ko가 '출혈되다'였다"),
    'w-concern': ({'en': 'concerned', 'ipa': '/kənˈsɜːrnd/', 'ko': '걱정되는'},
                  "태그 문장·예문이 형용사 I'm concerned about infection인데 헤드워드가 동사 concern, ko '걱정하다'였다"),
    'w-swell': ({'en': 'swollen', 'ipa': '/ˈswoʊlən/', 'ko': '부은'},
                "태그 문장·예문이 형용사 The swollen leg인데 헤드워드가 동사 swell이었다"),
    'w-close': ({'en': 'closely', 'ipa': '/ˈkloʊsli/', 'ko': '면밀히', 'example': "We'll watch you very closely while it's running."},
                "형용사 헤드워드(close, ko '가까이')에 부사가 묶였다 — 태그 문장 둘 모두 watch closely"),
    'w-hold': ({'ko': '(수치를) 유지시키다'},
               "w-keep과 ko(유지하다)가 겹쳐 듣고 뜻 고르기에서 정답이 둘 — hold는 혈압 수치를 받쳐 주는 쪽"),
    'w-quick': ({'ko': '신속한'},
                'w-fast와 ko(빠른)가 같아 정답이 둘 — quick은 a quick pinch·give fluids quickly처럼 신속한'),
    'w-septic': ({'ko': '패혈성의'}, "septic shock은 '패혈성 쇼크' — 형제 주제 er-sepsis의 w-septic과 맞춤"),
    'w-rate': ({'ko': '박동수'}, "속도·수치를 두루 가리키는 '속도(맥박수)'를 heart rate의 뜻으로 좁히고 형제 주제 er-sepsis와 맞춤"),
    'w-draw': ({'ko': '(피를) 뽑다'}, "형제 주제 er-sepsis와 맞춤 — 태그 문장은 모두 draw cultures·labs(채혈)"),
    'w-climb': ({'ko': '올라가다'}, "형제 주제 er-sepsis와 맞춤 — lactate is climbing"),
    'w-work': ({'ko': '효과가 있다'}, "'작동하다'는 기계 같다 — so it works quickly(약·라인이 효과를 낸다); 형제 주제 er-sepsis와 맞춤"),
    'w-culture': ({'ko': '배양검사'}, "형제 주제 er-sepsis와 맞춤 — cultures는 검사"),
    'w-go': ({'en': 'go through', 'ipa': '/ˌɡoʊ ˈθruː/', 'ko': '(하나씩) 살펴보다',
              'example': 'Can we go through all the medicines you took today?'},
             "공통 쉬운 말 go이지만 유일한 태그 문장이 go through(훑어보다)라 구 단위로 둔다"),
    'w-water': ({'en': 'water pill', 'ipa': '/ˈwɔːtər pɪl/', 'ko': '이뇨제', 'icon': 'pill',
                 'example': 'Water pills can drop your blood pressure.'},
                "ko '물'은 Water pills(이뇨제)에 맞지 않았다 — 태그 문장이 하나뿐이고 water pill은 구로 가르칠 값이 있다"),
}
NEW_WORDS = {
    'w-squeeze': ({'en': 'squeeze', 'ipa': '/skwiːz/', 'ko': '꽉 쥐다', 'icon': 'me',
                   'example': 'Squeeze my hand once for yes.'},
                  "언어장벽 문장 3에 이미 있는 말 — 쉬운 w-hand·w-yes·w-no 태그를 빼면 그 문장에 태그가 없어져 새로 세웠다"),
    'w-possible': ({'en': 'possible', 'ipa': '/ˈpɑːsəbəl/', 'ko': '가능한', 'icon': 'check',
                    'example': 'Please come as soon as possible.'},
                   "언어장벽 상황의 서로 다른 단어가 7개로 줄어(V3) 문장 4에 이미 있는 as soon as possible의 possible을 세웠다"),
}
NEW_TAGS = {
    (12, 3): ['w-squeeze'],
    (12, 4): ['w-possible'],
}
DROP_TAGS = {
    (7, 3): [('w-pressure', "여기 pressure는 chest pressure(가슴 압박감)라 w-pressure(혈압)와 다른 뜻 — 태그를 뺐다")],
    (16, 3): [('w-right', "right now의 right는 w-right(오른쪽·맞는)와 다른 뜻 — 태그를 뺐다")],
    (21, 1): [('w-cause', "여기서 cause는 동사(can cause)라 헤드워드(원인, 명사)와 다르다 — 태그를 뺐다")],
}
SENT_KO = {
    (3, 4): ('얼마나 마시는지 지켜보면서 조금씩 천천히 드릴게요.',
             "'드리게요'는 잘못된 활용 — '드릴게요'"),
    (8, 1): ('이렇게 되기 전에 무엇을 드셨거나 복용하셨나요?',
             "'무엇을 드시거나 드셨나요'는 같은 말이 겹쳐 뜻이 흐리다 — eat or take는 먹었거나 복용했거나"),
    (12, 3): ("'예'이면 손을 한 번, '아니요'이면 두 번 꽉 쥐어 주세요.",
              "'네 이면' 띄어쓰기 오류와 예/아니오 표기 정리"),
}

changes = []
for si, s in enumerate(doc['situations']):
    for j, t in enumerate(s['sentences']):
        old = list(t['words'])
        w = [x for x in old if x not in EASY]
        why = []
        gone = [g for g in old if g in EASY]
        if gone:
            why.append('쉬운 ' + '·'.join(gone) + ' 태그를 뺐다')
        for wid, r in DROP_TAGS.get((si, j), []):
            assert wid in w, (si, j, wid)
            w.remove(wid)
            why.append(r)
        for a in NEW_TAGS.get((si, j), []):
            w.append(a)
            why.append(a + ' 태그를 더했다')
        fields = []
        if w != old:
            t['words'] = w
            fields.append('words')
        if (si, j) in SENT_KO:
            t['ko'], r = SENT_KO[(si, j)]
            fields.append('ko')
            why.append(r)
        if fields:
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j,
                            'fields': fields, 'why': '; '.join(why)})

used = {x for s in doc['situations'] for t in s['sentences'] for x in t['words']}
for e in EASY:
    assert e not in used, e
doc['words'] = [w for w in doc['words'] if w['id'] not in EASY]
for e in EASY:
    changes.append({'kind': 'word-remove', 'id': e, 'why': EXTRA_WHY.get(e, EASY_WHY)})
for w in doc['words']:
    if w['id'] in WORD_EDITS:
        upd, why = WORD_EDITS[w['id']]
        w.update(upd)
        changes.append({'kind': 'word', 'id': w['id'], 'fields': list(upd), 'why': why})
for wid, (fields, why) in NEW_WORDS.items():
    doc['words'].append({'id': wid, **fields})
    changes.append({'kind': 'word-add', 'id': wid, 'why': why})
unused = [w['id'] for w in doc['words'] if w['id'] not in used]
assert not unused, unused
for si, s in enumerate(doc['situations']):
    n = len({x for t in s['sentences'] for x in t['words']})
    if n < 8:
        print('V3 risk', si, s['title'], n)
_ko = collections.Counter(w['ko'] for w in doc['words'])
print('dup ko:', [k for k, c in _ko.items() if c > 1])

# ---- v45 단어 필드 ----
KEYS = ['exKo', 'cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips']
add = {}
for f in sorted(glob.glob(f'{D}/add_{T}_words_*.yaml')):
    for wid, v in (yaml.safe_load(io.open(f, encoding='utf-8')) or {}).items():
        assert wid not in add, f'dup {wid} in {f}'
        add[wid] = v
bank = {w['id']: w for w in doc['words']}
missing = [i for i in bank if i not in add]
extra = sorted(set(add) - set(bank))
if add and (missing or extra):
    print('missing:', len(missing), missing, '\nextra:', extra)


def respell(w):
    """정답 조각+오답 조각으로 정답과 다른 경로로 철자를 만들 수 있는가."""
    out = []
    pool = [f for word in w['chips'] for f in word] + list(w['decoyChips'])
    canon = [tuple(word) for word in w['chips']]
    for word in w['chips']:
        target = ''.join(word)
        sols = []

        def dfs(rem, used, seq):
            if not rem:
                sols.append(tuple(seq))
                return
            for i, p in enumerate(pool):
                if i in used or not rem.startswith(p):
                    continue
                dfs(rem[len(p):], used | {i}, seq + [p])
        dfs(target, frozenset(), [])
        if any(s != tuple(word) for s in sols):
            out.append((target, [s for s in sols if s != tuple(word)]))
    return out


for w in doc['words']:
    v = add.get(w['id'])
    if not v:
        continue
    for k in KEYS:
        if k in v:
            w[k] = v[k]
    if 'chips' in v:
        joined = ' '.join(''.join(p) for p in v['chips'])
        if joined != w['en']:
            print('CHIPS≠en', w['id'], joined, '|', w['en'])
        r = respell(w)
        if r:
            print('RESPELL', w['id'], r)
        if len(v['decoyChips']) < 1:
            print('NO DECOY', w['id'])
        for o in v['distractorsEn']:
            if o.lower() == w['en'].lower():
                print('DISTRACTOR=EN', w['id'])
    # 오답 한국어가 정답 ko 조각과 겹치는지
    for o in v.get('distractorsKo', []):
        if o in w['ko'] or w['ko'] in o:
            print('KO OVERLAP', w['id'], o, w['ko'])

# ---- 뉘앙스 ----
nuance = {}
for f in sorted(glob.glob(f'{D}/add_{T}_nuance_*.yaml')):
    for title, lst in (yaml.safe_load(io.open(f, encoding='utf-8')) or {}).items():
        assert title not in nuance, f'dup situation {title} in {f}'
        nuance[title] = lst
titles = {s['title'] for s in doc['situations']}
if nuance:
    print('nuance missing:', sorted(titles - set(nuance)), 'extra:', sorted(set(nuance) - titles))
for s in doc['situations']:
    if s['title'] in nuance:
        s['nuance'] = nuance[s['title']]

out = f'{D}/{T}.yaml'
with io.open(out, 'w', encoding='utf-8') as fh:
    yaml.safe_dump(doc, fh, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
with io.open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8') as fh:
    yaml.safe_dump({'theme': T, 'changes': changes}, fh, allow_unicode=True, sort_keys=False, width=1000)
print('words', len(doc['words']), 'situations', len(doc['situations']), 'changes', len(changes))
