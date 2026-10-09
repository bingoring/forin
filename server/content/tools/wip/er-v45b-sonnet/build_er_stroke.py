#!/usr/bin/env python3
"""er-stroke 보강 빌드. base-er-stroke.yaml 을 읽어 (1) 결정 11 가벼운 정리를 적용하고
(2) add_er_stroke_words_*.yaml 의 v45 단어 필드와 add_er_stroke_nuance_*.yaml 의 뉘앙스를 id/제목으로 얹어
er-stroke.yaml 과 changes-er-stroke.yaml 을 만든다. 손으로 출력을 고치지 않는다."""
import copy, glob, io, os, re, sys, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
T = 'er-stroke'
P = lambda n: os.path.join(HERE, n)

base = yaml.safe_load(io.open(P(f'base-{T}.yaml'), encoding='utf-8'))
doc = copy.deepcopy(base)
sits = doc['situations']
sit_by_idx = {i: s for i, s in enumerate(sits)}
changes = []

# ───────── 결정 11: 단어 ─────────
REMOVE = {  # 너무 쉬운 단어 — 문장은 그대로, 태그만 뺀다
    'w-time': '공통 쉬운 단어 목록',
    'w-night': '공통 쉬운 단어 목록',
    'w-today': '공통 쉬운 단어 목록',
    'w-morning': '공통 쉬운 단어 목록',
    'w-minute': '공통 쉬운 단어 목록',
    'w-name': '공통 쉬운 단어 목록',
    'w-hand': '공통 쉬운 단어 목록',
    'w-head': '공통 쉬운 단어 목록',
    'w-see': '공통 쉬운 단어 목록',
    'w-yes': '너무 쉬움 — 간호사가 이미 아는 말',
    'w-no': '너무 쉬움 — 간호사가 이미 아는 말',
    'w-eat': '너무 쉬움 — 간호사가 이미 아는 말',
}
WORD_EDITS = {  # id -> ({필드: 값}, why)
    'w-hurt': ({'en': 'hurt', 'ipa': '/hɜːrt/'}, '활용형 헤드워드(hurts)를 원형으로'),
    'w-miss': ({'en': 'miss', 'ipa': '/mɪs/'}, '활용형 헤드워드(missed)를 원형으로'),
    'w-respond': ({'en': 'respond', 'ipa': '/rɪˈspɑːnd/'}, '활용형 헤드워드(responding)를 원형으로'),
    'w-alert': ({'en': 'alert', 'ipa': '/əˈlɜːrt/'}, '활용형 헤드워드(alerting)를 원형으로'),
    'w-pass': ({'en': 'pass', 'ipa': '/pæs/'}, '활용형 헤드워드(passed)를 원형으로'),
    'w-teeth': ({'en': 'tooth', 'ipa': '/tuːθ/'}, '복수형 헤드워드(teeth)를 단수 원형으로'),
    'w-spin': ({'en': 'spin', 'ipa': '/spɪn/', 'ko': '빙빙 돌다',
                'example': 'Does it feel like the room is spinning around you?'},
               '활용형 헤드워드(spinning)를 원형으로, 환자 대사였던 예문을 간호사 문장으로'),
    'w-double': ({'example': 'Does the double vision go away if you cover one eye?'},
                 '환자 대사였던 예문을 간호사 문장으로'),
    'w-thinner': ({'en': 'blood thinner', 'ipa': '/blʌd ˈθɪnər/'},
                  '다른 ER 주제(gi-bleed·geriatric 등)와 같이 헤드워드를 blood thinner로 — 문장은 늘 blood thinner'),
    'w-level': ({'ko': '농도'}, 'w-value(수치)와 ko가 같아 듣고 뜻 고르기 정답이 둘이 됨 — level은 혈중 농도'),
    'w-call': ({'ko': '연락하다'}, '태그된 문장이 "call me if…"(연락) — 헤드워드 ko를 맞춤'),
}
NEW_WORDS = [
    {'id': 'w-exactly', 'en': 'exactly', 'ipa': '/ɪɡˈzæktli/', 'ko': '정확히', 'icon': 'check',
     'example': 'Can you tell me exactly what time it was?',
     'why': '"exactly when/what time"은 LKW 확정의 핵심 부사 — 문장 4개에 이미 있다'},
    {'id': 'w-protect', 'en': 'protect', 'ipa': '/prəˈtɛkt/', 'ko': '보호하다', 'icon': 'shield',
     'example': "We're turning you on your side to protect your airway.",
     'why': '쉬운 w-hand 등 대신 가르칠 말 — 기도·폐 보호 문장 4개에 이미 있다'},
]
# ───────── 결정 11: 문장 ─────────
# (상황 인덱스, 문장 인덱스) -> {필드: 값}
SENT_EDITS = {
    (7, 3): ({'en': 'Does the double vision go away if you cover one eye?',
              'ko': '한쪽 눈을 가리면 겹쳐 보이는 게 사라지나요?',
              'chunks': ['Does the double vision', 'go away', 'if you cover', 'one eye', '?'],
              'words': ['w-double', 'w-eye']},
             '환자 대사("I\'m seeing double…")가 간호사 문장에 섞여 있어 간호사 질문으로'),
    (7, 4): ({'en': "Does it feel like the room is spinning around you?",
              'ko': '방이 빙빙 도는 것처럼 느껴지세요?',
              'chunks': ['Does it feel', 'like the room', 'is spinning', 'around you', '?'],
              'words': ['w-spin']},
             '환자 대사("The room feels like it\'s spinning…")가 간호사 문장에 섞여 있어 간호사 질문으로'),
    (16, 0): ({'ko': '정신 잃지 마세요—눈을 뜰 수 있나요?'},
              '"Stay with me"는 환자에게 "정신 놓지 마세요" — "함께 있어 주세요"는 역할이 뒤집힌 번역(keyPhrase라 ko만)'),
    (16, 6): ({'ko': '정신 잃지 마시고 가능하면 눈을 뜨고 계세요.'},
              '"Stay with me"는 환자에게 "정신 놓지 마세요"'),
    (19, 0): ({'ko': '정신 잃지 마세요—제 목소리가 들리세요?'},
              '"Stay with me"는 환자에게 "정신 놓지 마세요"(keyPhrase라 ko만)'),
}
# 태그만 손보는 곳 (words 필드)
TAG_REMOVE = {  # (상황, 문장) -> [id]
    (22, 5): ['w-pressure'],  # "rising pressure" = 두개내압 — 헤드워드 ko 혈압과 다름
    (14, 1): ['w-low'],       # "lower it"은 동사 — 헤드워드는 형용사 '낮은'
}
TAG_ADD = {  # (상황, 문장) -> [id]
    (0, 6): ['w-exactly'], (1, 3): ['w-exactly'], (8, 2): ['w-exactly'], (12, 1): ['w-exactly'],
    (16, 1): ['w-protect'], (16, 4): ['w-protect'], (19, 1): ['w-protect'], (4, 5): ['w-protect'],
}
# blood thinner 가 한 헤드워드가 되었으니 같은 문장의 w-blood 태그를 뺀다
for (si, s) in [(si, s) for si, st in enumerate(sits) for s in range(len(st['sentences']))]:
    ws = sits[si]['sentences'][s]['words']
    if 'w-thinner' in ws and 'w-blood' in ws:
        TAG_REMOVE.setdefault((si, s), []).append('w-blood')

# 단어 적용
words = doc['words']
ids = {w['id']: w for w in words}
for wid, (fields, why) in WORD_EDITS.items():
    ids[wid].update(fields)
    changes.append({'kind': 'word', 'id': wid, 'fields': list(fields), 'why': why})
for nw in NEW_WORDS:
    w = {k: nw[k] for k in ('id', 'en', 'ipa', 'ko', 'icon', 'example')}
    words.append(w)
    changes.append({'kind': 'word-add', 'id': nw['id'], 'why': nw['why']})

# 문장 적용
sent_changes = {}
def mark(key, field, why):
    sent_changes.setdefault(key, {'fields': [], 'why': []})
    if field not in sent_changes[key]['fields']:
        sent_changes[key]['fields'].append(field)
    if why not in sent_changes[key]['why']:
        sent_changes[key]['why'].append(why)

for si, st in enumerate(sits):
    for sj, s in enumerate(st['sentences']):
        key = (si, sj)
        before = list(s['words'])
        if key in SENT_EDITS:
            fields, why = SENT_EDITS[key]
            for k, v in fields.items():
                if k == 'words':
                    continue
                s[k] = v
                mark(key, k, why)
            if 'words' in fields:
                s['words'] = list(fields['words'])
        # 쉬운 단어 태그 뺌
        s['words'] = [w for w in s['words'] if w not in REMOVE]
        for w in TAG_REMOVE.get(key, []):
            if w in s['words']:
                s['words'].remove(w)
        for w in TAG_ADD.get(key, []):
            if w not in s['words']:
                s['words'].append(w)
        if s['words'] != before:
            removed = [w for w in before if w not in s['words']]
            added = [w for w in s['words'] if w not in before]
            why = []
            if removed: why.append('태그 뺌 ' + ', '.join(removed))
            if added: why.append('태그 더함 ' + ', '.join(added))
            mark(key, 'words', ' / '.join(why))

for key, c in sorted(sent_changes.items()):
    changes.append({'kind': 'sentence', 'situation': sits[key[0]]['title'], 'index': key[1],
                    'fields': c['fields'], 'why': '; '.join(c['why'])})

# 안 쓰이게 된 쉬운 단어는 은행에서 지운다
words[:] = [w for w in words if w['id'] not in REMOVE]
for wid, why in REMOVE.items():
    changes.append({'kind': 'word-remove', 'id': wid, 'why': f'{why} — 어느 문장도 태그하지 않게 됐다'})

# ───────── v45 단어 필드 ─────────
V45 = ('exKo', 'cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips')
add = {}
for f in sorted(glob.glob(P(f'add_{T.replace("-", "_")}_words_*.yaml'))):
    for w in yaml.safe_load(io.open(f, encoding='utf-8')):
        if w['id'] in add:
            sys.exit(f'duplicate v45 data: {w["id"]}')
        add[w['id']] = w
missing = [w['id'] for w in words if w['id'] not in add]
extra = [i for i in add if i not in {w['id'] for w in words}]
if missing or extra:
    print('MISSING v45 data:', missing); print('EXTRA v45 data:', extra)
for w in words:
    d = add.get(w['id'])
    if d:
        for k in V45:
            w[k] = d[k]

# ───────── 뉘앙스 ─────────
nu = {}
for f in sorted(glob.glob(P(f'add_{T.replace("-", "_")}_nuance_*.yaml'))):
    for e in yaml.safe_load(io.open(f, encoding='utf-8')):
        if e['title'] in nu:
            sys.exit(f'duplicate nuance: {e["title"]}')
        nu[e['title']] = e['nuance']
for st in sits:
    if st['title'] in nu:
        st['nuance'] = nu[st['title']]
print('nuance situations:', len(nu), '/', len(sits))

# ───────── 자체 검사 (검사기가 못 보는 것) ─────────
def segs(s, alpha):
    n = len(s); dp = [0] * (n + 1); dp[0] = 1
    for i in range(1, n + 1):
        for a in alpha:
            if s[:i].endswith(a) and i - len(a) >= 0:
                dp[i] += dp[i - len(a)]
    return dp[n]
bad = 0
for w in words:
    if 'chips' not in w: continue
    alpha = {str(f).lower() for wd in w['chips'] for f in wd} | {str(d).lower() for d in w['decoyChips']}
    for wd in w['chips']:
        spelled = ''.join(str(f) for f in wd).lower()
        n = segs(spelled, alpha)
        if n != 1:
            print(f'[chips] {w["id"]}: {spelled} can be spelled {n} ways with decoys {w["decoyChips"]}'); bad += 1
kos = {}
for w in words:
    kos.setdefault(w['ko'], []).append(w['id'])
for k, v in kos.items():
    if len(v) > 1:
        print(f'[ko dup] {k}: {v}'); bad += 1
tags = {}
for w in words:
    if 'tag' in w: tags[w['tag']] = tags.get(w['tag'], 0) + 1
print('tags', len(tags), tags)

with io.open(P(f'{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
with io.open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': T, 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
print('words', len(words), 'situations', len(sits), 'changes', len(changes), 'selfcheck problems', bad)
