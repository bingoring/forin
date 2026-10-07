#!/usr/bin/env python3
"""core-handoff-icu v45 보강: base를 읽어 새 필드만 얹고, 결정 11의 가벼운 정리를 적용한다."""
import collections, copy, glob, io, itertools, yaml

T = 'core-handoff-icu'
D = '/tmp/lesson-icu-v45b'
base = yaml.safe_load(io.open(f'{D}/base-{T}.yaml', encoding='utf-8'))
doc = copy.deepcopy(base)

# ---- 결정 11: 가벼운 정리 ----
EASY = ['w-day', 'w-know', 'w-hour', 'w-minute', 'w-time', 'w-morning', 'w-today', 'w-doctor',
        'w-family', 'w-hand', 'w-see', 'w-come', 'w-go', 'w-get']
EASY_WHY = {
    'w-get': "'get missed'의 get((당)하다)은 가르칠 낱말이 아니다 — 태그를 뺐고 어느 문장도 태그하지 않게 됐다",
}
EASY_DEFAULT = '공통 쉬운 단어 목록 — 문장은 두고 태그만 뺐고, 어느 문장도 태그하지 않게 됐다'
WORD_EDITS = {
    'w-round': ({'ko': '차례(라운드)', 'example': 'He got two rounds of epi.'},
                "남은 태그 셋이 모두 투약·압박의 '차례'(rounds of epi, round three) — 회진(doctor rounds) 태그를 빼며 ko·example을 그 뜻으로"),
    'w-close': ({'ko': '면밀한'}, "'the closest eye'(가장 면밀한 관찰)로만 쓰이는데 ko가 거리의 '가까운'이었다"),
    'w-call': ({'ko': '부르다'}, "w-page(호출하다)와 ko가 같아 듣고 뜻 고르기에서 정답이 둘 — 'call me'의 부르다로(ICU 다른 주제 다수와 같음)"),
    'w-again': ({'ko': '한 번 더'}, "w-back(다시)과 ko가 같아 정답이 둘 — 'say that again'의 한 번 더로"),
    'w-assistance': ({'ko': '부축'}, "w-help(도움)와 ko가 같아 정답이 둘 — 'assistance to stand'의 부축으로"),
    'w-confirm': ({'ko': '대조 확인하다'}, "w-check(확인하다)와 ko가 같아 정답이 둘 — 라인·약물을 맞춰 보는 대조 확인으로"),
    'w-repeat': ({'ko': '반복하다'}, "'repeat lactate'·'Repeat her chest X-ray'(재검)에는 '다시 말하다'가 안 맞는다 — ICU 다른 주제 다수와 같은 반복하다로"),
    'w-titrate': ({'ko': '적정하다'}, "ICU 다른 주제 11곳이 적정하다 — 같은 id의 ko를 맞춘다"),
    'w-sick': ({'ko': '위중한'}, "'your sickest'(가장 위중한 환자)로만 쓰이고 문장 ko도 위중 — '아픈'은 너무 가볍다"),
    'w-update': ({'ko': '경과 설명'}, "'Family wants an update'의 명사 — '알려주기'는 어색하다"),
    'w-advance': ({'ko': '(단계를) 올리다'}, "'advance her diet'·'advance the rate'(식이·속도를 올리다) — '진전시키다'는 뜻이 흐리다"),
    'w-feed': ({'ko': '경관영양'}, "'tube feeds'의 feed — '급식'은 학교 급식처럼 읽힌다"),
    'w-rather': ({'ko': '(~하기)보다는'}, "'rather than waiting'의 rather — '차라리'는 뜻이 다르다"),
}
NEW_WORDS = {
    'w-from-the-top': ({'en': 'from the top', 'ipa': '/frəm ðə ˈtɑp/', 'ko': '처음부터', 'icon': 'board',
                        'example': "Let's go through his SBAR from the top."},
                       "쉬운 w-day·w-know를 빼 SBAR 구조 인계 기초가 V3(8개)를 못 채운다 — 문장 2에 이미 있는 구 'from the top'(인계를 처음부터)"),
}
# (상황 index, 문장 index): (뺄 id, 더할 id, why)
RETAG = {
    (0, 2): ([], ['w-from-the-top'], "'from the top'에 새 단어 w-from-the-top 태그"),
    (3, 3): (['w-round'], [], "'the doctor rounds'(회진)는 w-round의 남은 뜻 '차례'와 다르다 — 태그를 뺐다"),
    (8, 0): (['w-lab'], [], "'cath lab'의 lab은 검사실 — w-lab(검사)과 뜻이 다르다(w-cath가 구를 맡는다)"),
    (10, 4): (['w-change'], [], "'if anything changes'(바뀌다)는 w-change(교체하다)와 뜻이 다르다"),
    (11, 1): (['w-pressure'], [], "'pressure support'(압력보조)는 w-pressure(혈압)와 뜻이 다르다(w-support가 맡는다)"),
    (11, 2): (['w-rate'], [], "'heart rate'(심박수)는 w-rate(속도)와 뜻이 다르다"),
    (12, 1): (['w-down'], [], "'trending down'의 down은 w-down(정지된 시간, down time)과 뜻이 다르다"),
    (13, 1): (['w-back'], [], "'since she got back'(돌아오다)은 w-back(되읽어 다시, read back)과 뜻이 다르다"),
    (16, 4): (['w-call'], [], "'call the rhythm'(리듬을 소리 내 알리다)은 w-call(부르다)과 뜻이 다르다"),
    (17, 0): (['w-give'], [], "'give a full SBAR'의 give는 투여하다가 아니다"),
    (18, 0): (['w-correct'], [], "'correct the last handoff'는 동사(정정하다) — 형용사 카드 w-correct(맞는)와 품사가 다르다(w-correction이 맡는다)"),
    (18, 4): (['w-flag'], [], "'flagged the error'는 동사 — 명사 카드 w-flag(표시)와 품사가 다르다"),
    (19, 0): (['w-change'], [], "'code status changed to DNR'(바뀌다)은 w-change(교체하다)와 뜻이 다르다"),
    (19, 2): (['w-support'], [], "'gentle support'(정서적 지지)는 w-support(보조, pressure support)와 뜻이 다르다"),
    (20, 3): (['w-off'], [], "'go off'의 off는 w-off(중단된, off pressors)와 뜻이 다르다"),
}
SENT_KO = {
    (9, 0): ("승압제는 끊었고, 산소는 비강 캐뉼라로 줄였습니다.",
             "KP ko 'weaned to nasal cannula'를 '비강 캐뉼라로 이탈'로 옮겨 뜻이 흐렸다 — 산소를 비강 캐뉼라까지 줄였다는 뜻(en·chunks 그대로)"),
    (15, 2): ("혈압이 급격히 떨어지고 있어요, 지금 한 사람 더 손이 필요해요.",
             "'a second pair of hands'는 한 사람 더 — ko가 '두 사람 더'였다"),
}

changes = []
for si, s in enumerate(doc['situations']):
    for j, t in enumerate(s['sentences']):
        fields, why = [], []
        old = list(t['words'])
        rm, add, rwhy = RETAG.get((si, j), ([], [], ''))
        w = [x for x in old if x not in EASY and x not in rm]
        for a in add:
            assert a not in w
            w.append(a)
        assert set(rm) <= set(old), (si, j, rm)
        if w != old:
            t['words'] = w
            fields.append('words')
            gone = [g for g in old if g in EASY]
            if gone:
                why.append('쉬운 ' + '·'.join(gone) + ' 태그를 뺐다')
            if rwhy:
                why.append(rwhy)
        if (si, j) in SENT_KO:
            ko, kwhy = SENT_KO[(si, j)]
            t['ko'] = ko
            fields.append('ko')
            why.append(kwhy)
        if fields:
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': j,
                            'fields': fields, 'why': '; '.join(why)})

used = {x for s in doc['situations'] for t in s['sentences'] for x in t['words']}
for e in EASY:
    assert e not in used, e
doc['words'] = [w for w in doc['words'] if w['id'] not in EASY]
for e in EASY:
    changes.append({'kind': 'word-remove', 'id': e, 'why': EASY_WHY.get(e, EASY_DEFAULT)})
for w in doc['words']:
    if w['id'] in WORD_EDITS:
        upd, why = WORD_EDITS[w['id']]
        w.update(upd)
        changes.append({'kind': 'word', 'id': w['id'], 'fields': list(upd), 'why': why})
for wid, (fields, why) in NEW_WORDS.items():
    doc['words'].append({'id': wid, **fields})
    changes.append({'kind': 'word-add', 'id': wid, 'why': why})
for w in doc['words']:
    assert w['id'] in used, f"unused word {w['id']}"
dupko = [k for k, n in collections.Counter(w['ko'] for w in doc['words']).items() if n > 1]
assert not dupko, dupko

# 상황별 서로 다른 단어 수(V3)
for s in doc['situations']:
    n = len({x for t in s['sentences'] for x in t['words']})
    assert n >= 8, (s['title'], n)

# ---- v45 단어 필드 ----
KEYS = ['exKo', 'cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips']
add = {}
for f in sorted(glob.glob(f'{D}/add_{T}_words_*.yaml')):
    for wid, v in (yaml.safe_load(io.open(f, encoding='utf-8')) or {}).items():
        assert wid not in add, f'dup {wid}'
        add[wid] = v
ids = [w['id'] for w in doc['words']]
missing = [i for i in ids if i not in add]
extra = [i for i in add if i not in ids]
if missing or extra:
    print('MISSING', missing)
    print('EXTRA', extra)
    raise SystemExit(1)
for w in doc['words']:
    v = add[w['id']]
    for k in KEYS:
        assert k in v, (w['id'], k)
        w[k] = v[k]

# 오답 조각으로 정답 철자를 다른 경로로 다시 만들 수 있는가
def alt_paths(word):
    en = word['en']
    real = [f for x in word['chips'] for f in x]
    pool = real + list(word['decoyChips'])
    target = en.replace(' ', '')
    found = set()
    def dfs(rest, usedidx, seq):
        if rest == '':
            found.add(tuple(seq))
            return
        for i, f in enumerate(pool):
            if i in usedidx or not f:
                continue
            if rest.startswith(f):
                dfs(rest[len(f):], usedidx | {i}, seq + [f])
    dfs(target, frozenset(), [])
    return [p for p in found if list(p) != real]
bad = [(w['id'], alt_paths(w)) for w in doc['words'] if alt_paths(w)]
for b in bad:
    print('ALT-PATH', b)
assert not bad

# ---- 뉘앙스 ----
nu = {}
for f in sorted(glob.glob(f'{D}/add_{T}_nuance_*.yaml')):
    for title, items in (yaml.safe_load(io.open(f, encoding='utf-8')) or {}).items():
        assert title not in nu, f'dup {title}'
        nu[title] = items
titles = [s['title'] for s in doc['situations']]
assert set(nu) == set(titles), (set(titles) - set(nu), set(nu) - set(titles))
for s in doc['situations']:
    s['nuance'] = nu[s['title']]

out = yaml.dump(doc, Dumper=yaml.SafeDumper, allow_unicode=True, sort_keys=False, width=1000)
io.open(f'{D}/{T}.yaml', 'w', encoding='utf-8').write(out)
chg = yaml.dump({'theme': T, 'changes': changes}, Dumper=yaml.SafeDumper, allow_unicode=True, sort_keys=False, width=1000)
io.open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8').write(chg)
kinds = collections.Counter(n['kind'] for s in doc['situations'] for n in s['nuance'])
print(f'words {len(doc["words"])} · situations {len(doc["situations"])} · changes {len(changes)} · nuance {dict(kinds)}')
