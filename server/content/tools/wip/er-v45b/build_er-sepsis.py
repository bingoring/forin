#!/usr/bin/env python3
"""er-sepsis v45 보강: base를 읽어 새 필드만 얹고, 결정 11 정리를 적용한다."""
import collections, copy, glob, io, sys, yaml

T = "er-sepsis"
D = '/tmp/lesson-er-v45b'
base = yaml.safe_load(io.open(f'{D}/base-{T}.yaml', encoding='utf-8'))
doc = copy.deepcopy(base)

# ---- 결정 11: 가벼운 정리 ----
EASY = ['w-now', 'w-minute', 'w-hour', 'w-body', 'w-hand', 'w-doctor', 'w-baby', 'w-bad', 'w-good',
        'w-know', 'w-go', 'w-see', 'w-thing', 'w-have', 'w-do', 'w-four']
EASY_WHY = '너무 쉬움 — 문장은 두고 태그만 뺐고, 어느 문장도 태그하지 않게 됐다'
S1_3 = "Your blood pressure came up a little after that last bag of fluids."
WORD_EDITS = {
    'w-come': ({'en': 'come up', 'ipa': '/ˌkʌm ˈʌp/', 'ko': '(수치가) 올라오다', 'example': S1_3},
               "공통 쉬운 말 come이지만 유일한 태그 문장이 blood pressure came up이라 구(come up)로 둔다; ko '오르다'가 w-rise와 겹쳐 가른다"),
    'w-close': ({'en': 'closely', 'ipa': '/ˈkloʊsli/', 'ko': '면밀히', 'example': "You're safe here, and we'll watch you closely."},
                "형용사 헤드워드(close, ko '가까운')에 부사가 묶였다 — 태그 문장 8개 중 6개가 watch closely"),
    'w-immediate': ({'en': 'immediately', 'ipa': '/ɪˈmiːdiətli/', 'ko': '즉시',
                     'example': "I'm escalating this now and getting the physician back in immediately."},
                    '형용사 헤드워드에 부사가 묶였다 — 태그 문장은 immediately'),
    'w-thorough': ({'en': 'thoroughly', 'ipa': '/ˈθɜːroʊli/', 'ko': '철저히',
                    'example': "We won't wait for a high fever — we'll check thoroughly now."},
                   '형용사 헤드워드에 부사가 묶였다 — 태그 문장은 check thoroughly'),
    'w-continuous': ({'en': 'continuously', 'ipa': '/kənˈtɪnjuəsli/', 'ko': '지속적으로',
                      'example': "We're monitoring your baby's heartbeat continuously."},
                     '형용사 헤드워드에 부사가 묶였다 — 태그 문장은 monitoring continuously'),
    'w-urgent': ({'en': 'urgently', 'ipa': '/ˈɜːrdʒəntli/', 'ko': '긴급하게',
                  'example': "We're giving fluids and antibiotics urgently, and I'll explain each step."},
                 '형용사 헤드워드에 부사가 묶였다 — 태그 문장은 giving … urgently'),
    'w-confuse': ({'en': 'confused', 'ipa': '/kənˈfjuːzd/', 'ko': '혼란스러워하는'},
                  "태그 문장·예문이 모두 형용사 confused(he's cold and confused)인데 헤드워드가 동사 confuse, ko '혼란스럽게 하다'였다"),
    'w-mottle': ({'en': 'mottling', 'ipa': '/ˈmɑːtəlɪŋ/', 'ko': '(피부의) 얼룩덜룩함'},
                 '태그 문장·예문이 모두 명사 mottling(the mottling of your skin)인데 헤드워드가 동사 mottle이었다'),
    'w-run': ({'ko': '(약물을) 주입하다', 'example': 'Prepare for central access to run the pressor safely.'},
              "ko '(열이) 나다'는 태그 문장 넷 중 하나(run a fever)에만 맞았다 — 나머지 셋은 run the pressor; run a fever는 새 단어 w-runfever로"),
    'w-move': ({'ko': '움직이다'},
               "ko '진행하다'가 the baby moving less(태아 움직임)에 맞지 않았다"),
    'w-short': ({'en': 'short of breath', 'ipa': '/ˌʃɔːrt əv ˈbrɛθ/'},
                "ko '숨이 찬'은 낱말 short가 아니라 구의 뜻 — 태그 문장 셋 모두 short of breath라 구로"),
    'w-rate': ({'ko': '박동수'},
               "w-level·w-number와 ko(수치)가 셋이 같아 듣고 뜻 고르기에서 정답이 여럿 — 태그 문장은 모두 heart rate(형제 주제의 w-rate도 박동수)"),
    'w-level': ({'ko': '농도'},
                "w-number와 ko(수치)가 같아 정답이 둘 — lactate level·oxygen level은 혈중 농도"),
    'w-choose': ({'ko': '선택하다'},
                 'w-pick과 ko(고르다)가 같아 정답이 둘'),
    'w-draw': ({'ko': '(피를) 뽑다'},
               'w-take와 ko(채취하다)가 같아 정답이 둘 — draw blood는 피를 뽑는 것'),
    'w-climb': ({'ko': '올라가다'},
                'w-rise·w-come과 ko(오르다)가 같아 정답이 여럿'),
    'w-quick': ({'ko': '신속한'},
                'w-fast와 ko(빠른)가 같아 정답이 둘 — 태그 문장은 quick treatment·giving them quickly·moving quickly'),
    'w-side': ({'ko': '옆쪽'},
               'w-flank와 ko(옆구리)가 같아 정답이 둘 — flank가 임상어 옆구리, side는 일상어 옆'),
}
NEW_WORDS = {
    'w-runfever': ({'en': 'run a fever', 'ipa': '/ˌrʌn ə ˈfiːvər/', 'ko': '열이 나다', 'icon': 'monitor',
                    'example': "Older patients don't always run a fever, even with a serious infection."},
                   '노인 비전형 패혈증 문장 3에 이미 있는 관용구 — w-run(주입하다)과 뜻이 달라 따로 세웠다'),
}
NEW_TAGS = {
    (7, 3): ['w-runfever'],
}
DROP_TAGS = {
    (7, 3): [('w-run', 'w-run(주입하다)은 여기서 run a fever라 다른 뜻 — w-run 태그를 빼고 w-runfever 태그')],
    (1, 0): [('w-close', 'w-close를 closely로 바꿨는데 여기는 a closer look이라 태그를 뺐다')],
    (5, 4): [('w-close', 'w-close를 closely로 바꿨는데 여기는 moves you closer라 태그를 뺐다')],
}
SENT_KO = {
    (20, 1): ('노르에피네프린 8로 투여 중이고, MAP은 66으로 유지되고 있습니다.',
              "'노르에피네프린 8에 있고'는 뜻이 흐리다 — on norepinephrine at eight는 그 용량으로 투여 중이라는 말"),
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
            if not any(a in x for x in why):
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
    changes.append({'kind': 'word-remove', 'id': e, 'why': EASY_WHY})
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
if missing or extra:
    print('missing:', missing, '\nextra:', extra)
for w in doc['words']:
    v = add.get(w['id'])
    if not v:
        continue
    for k in KEYS:
        if k in v:
            w[k] = v[k]
    # 사전 점검: chips·decoyChips·오답
    if 'chips' in v:
        joined = ' '.join(''.join(p) for p in v['chips'])
        if joined != w['en']:
            print('CHIPS≠en', w['id'], joined, '|', w['en'])
        flat = {p for word in v['chips'] for p in word}
        for dc in v.get('decoyChips', []):
            if not isinstance(dc, str) or dc in flat:
                print('BAD decoy', w['id'], dc)
    for k in ('distractorsEn', 'distractorsKo', 'decoyChips'):
        for x in v.get(k, []):
            if not isinstance(x, str):
                print('NON-STR', w['id'], k, x)
    if w['en'] in v.get('distractorsEn', []) or w['ko'] in v.get('distractorsKo', []):
        print('DISTRACTOR=answer', w['id'])
    if w['en'].lower() in str(v.get('cue', '')).lower():
        print('CUE leaks', w['id'])

# exKo는 같은 문장의 ko와 맞춘다(SENT_KO 반영 뒤).
sko = {}
for s in doc['situations']:
    for t in s['sentences']:
        sko.setdefault(t['en'], t['ko'])
for w in doc['words']:
    if w['example'] in sko:
        w['exKo'] = sko[w['example']]

# ---- 뉘앙스 ----
nu = {}
for f in sorted(glob.glob(f'{D}/add_{T}_nuance_*.yaml')):
    for title, lst in (yaml.safe_load(io.open(f, encoding='utf-8')) or {}).items():
        assert title not in nu, f'dup {title}'
        nu[title] = lst
titles = [s['title'] for s in doc['situations']]
bad = sorted(set(nu) - set(titles))
if bad:
    print('unknown nuance titles:', bad)
for s in doc['situations']:
    if s['title'] in nu:
        s['nuance'] = nu[s['title']]
        tagged = {x for t in s['sentences'] for x in t['words']}
        for q in s['nuance']:
            off = [x for x in q.get('words', []) if x not in tagged]
            if off:
                print('V15 risk', s['title'], q['kind'], off)
print('nuance missing:', [t for t in titles if t not in nu])


class Dumper(yaml.SafeDumper):
    pass


def _str(d, s):
    return d.represent_scalar('tag:yaml.org,2002:str', s, style='"' if s.lower() in ('on', 'off', 'yes', 'no', 'true', 'false', 'null', 'y', 'n') else None)


Dumper.add_representer(str, _str)

io.open(f'{D}/{T}.yaml', 'w', encoding='utf-8').write(
    yaml.dump(doc, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
io.open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8').write(
    yaml.dump({'theme': T, 'changes': changes}, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
print(f'words {len(doc["words"])} · situations {len(doc["situations"])} · changes {len(changes)}')
