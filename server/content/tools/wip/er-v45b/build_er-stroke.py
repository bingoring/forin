#!/usr/bin/env python3
"""er-stroke 보강 빌드. base-er-stroke.yaml 을 읽어
  1) 결정 11 범위의 가벼운 정리(아래 CLEANUP)를 코드로 적용하고 changes-er-stroke.yaml 을 만들고
  2) add_er-stroke_words_*.yaml (단어 id → v45 필드) 와
     add_er-stroke_nuance_*.yaml (상황 제목 → nuance 목록) 을 id·제목으로 맞춰 얹어
  3) er-stroke.yaml 로 쓴다.
"""
import glob, os, re, sys, yaml
from collections import Counter, defaultdict

D = '/tmp/lesson-er-v45b'
THEME = 'er-stroke'
base = yaml.safe_load(open(f'{D}/base-{THEME}.yaml', encoding='utf-8'))

changes = []
words = base['words']
W = {w['id']: w for w in words}
S = {s['title']: s for s in base['situations']}

# ---------------------------------------------------------------- 정리 데이터
# 공통 쉬운 단어 목록에 있는 것 + 목록 밖 판단분(w-yes, w-no, w-before)
EASY_COMMON = ['w-time', 'w-see', 'w-night', 'w-today', 'w-minute', 'w-morning', 'w-head', 'w-hand', 'w-name']
EASY_JUDGED = {'w-yes': '너무 쉬움(목록 밖 판단) — 예/아니오', 'w-no': '너무 쉬움(목록 밖 판단) — "no rush"에도 잘못 붙어 있었다',
               'w-before': '너무 쉬움(목록 밖 판단)'}

WORD_EDITS = {
    # id: ({field: value}, why)
    'w-hurt': ({'en': 'hurt', 'ipa': '/hɜːrt/'}, '활용형 헤드워드(hurts)를 원형으로'),
    'w-miss': ({'en': 'miss', 'ipa': '/mɪs/'}, '활용형 헤드워드(missed)를 원형으로'),
    'w-pass': ({'en': 'pass', 'ipa': '/pæs/'}, '활용형 헤드워드(passed)를 원형으로'),
    'w-respond': ({'en': 'respond', 'ipa': '/rɪˈspɑːnd/'}, '활용형 헤드워드(responding)를 원형으로'),
    'w-alert': ({'en': 'alert', 'ipa': '/əˈlɜːrt/'}, '활용형 헤드워드(alerting)를 원형으로'),
    'w-spin': ({'en': 'spin', 'ipa': '/spɪn/', 'ko': '빙빙 돌다',
                'example': "Does the room feel like it's spinning around you?"},
               '활용형 헤드워드(spinning)를 원형으로, 예문은 환자 대사를 간호사 질문으로 바꾼 문장으로'),
    'w-double': ({'example': 'Are you seeing double, like there are two of me?'},
                 '예문이 환자 대사였다 — 간호사 질문으로 바꾼 문장으로'),
    'w-fibrillation': ({'en': 'atrial fibrillation', 'ipa': '/ˈeɪtriəl ˌfɪbrɪˈleɪʃən/', 'ko': '심방세동'},
                       "'세동'만 떼어 가르치면 쓸 데가 없다 — 문장의 실제 단위 atrial fibrillation으로"),
    'w-known': ({'en': 'last known well', 'ipa': '/læst noʊn wɛl/', 'ko': '마지막 정상 확인 시각'},
                "known(알려진)만 떼면 뜻이 없다 — 뇌졸중 인계의 고정 표현 last known well로"),
    'w-stay': ({'en': 'stay with me', 'ipa': '/steɪ wɪð mi/', 'ko': '정신 놓지 마세요',
                'example': 'Stay with me—can you hear my voice?'},
               "태그된 문장 4개 중 3개가 'Stay with me'(의식 붙잡기) — 머무르다로는 뜻이 안 맞아 구 단위로"),
    'w-thinner': ({'ko': '혈액희석제'}, 'ER 다른 주제의 같은 id와 ko를 맞춤(정본 다수형)'),
    'w-speech': ({'ko': '말(발음)'}, "말투(어조)는 오역 — FAST의 S, 발화 자체"),
    'w-slurred': ({'ko': '어눌한'}, "구음장애로 '어눌한'이 임상 한국어"),
    'w-strain': ({'ko': '무리'}, "'긴장'은 오역 — 목을 갑자기 무리하게 쓴 것(sudden strain)"),
    'w-value': ({'ko': '값'}, 'w-level(수치)과 ko가 같아 듣고 뜻 고르기에서 정답이 둘이 된다'),
    'w-squeeze': ({'ko': '꽉 쥐다'}, 'ER 다른 주제의 같은 id와 ko를 맞춤(정본 다수형)'),
}

# 상황 제목 → {index: ({field: value}, why)}
SENT_EDITS = {
    'FAST 초기 선별': {
        5: ({'ko': '지금 말씀이 조금 어눌하게 들려요.'}, "slurred를 '뭉개져'보다 임상 한국어 '어눌하게'로(w-slurred ko와 맞춤)"),
    },
    '후순환(소뇌) 뇌졸중': {
        3: ({'en': 'Are you seeing double, like there are two of me?',
             'ko': '둘로 겹쳐 보이세요? 제가 두 명인 것처럼요?',
             'chunks': ['Are you', 'seeing double', ',', 'like there are', 'two of me', '?']},
            '환자 대사(I\'m seeing double)였다 — 간호사 질문으로'),
        4: ({'en': "Does the room feel like it's spinning around you?",
             'ko': '방이 빙빙 도는 것처럼 느껴지세요?',
             'chunks': ['Does the room', 'feel like', "it's spinning", 'around you', '?']},
            '환자 대사(The room feels like...)였다 — 간호사 질문으로'),
    },
    '출혈성 뇌졸중 급성 악화': {
        0: ({'ko': '정신 놓지 마세요—눈 뜰 수 있어요?'}, "'저와 함께 있어 주세요'는 역할이 뒤집힌 오역 — 의식 붙잡기"),
        6: ({'ko': '정신 놓지 마시고, 할 수 있으면 눈을 뜨고 계세요.'}, "'저와 함께 있어 주시고'는 역할이 뒤집힌 오역"),
    },
    '뇌간 경색 급속 의식저하': {
        0: ({'ko': '정신 놓지 마세요—제 목소리 들리세요?'}, "'저와 함께 있어 주세요'는 역할이 뒤집힌 오역"),
    },
    '젊은 환자 경동맥 박리': {
        0: ({'ko': '목을 다치거나 갑자기 목에 무리가 간 적이 있나요?'}, "'갑작스러운 긴장'은 뜻이 흐림 — strain은 무리"),
    },
    '악성 부종 감시': {
        5: ({'ko': '한쪽 동공만 커지는 건 뇌압이 오르고 있다는 뜻일 수 있어요.',
             'words': ['w-pupil']},
            "여기 pressure는 뇌압 — 혈압(w-pressure) 태그를 빼고 ko를 뇌압으로"),
    },
    'TIA 증상 소실': {
        2: ({'words': ['w-find', 'w-cause']}, "w-stay를 'stay with me' 구로 바꿨고 여기는 머무르다 — 태그를 뺐다"),
    },
}

# ---------------------------------------------------------------- 정리 적용
removed_tags = set(EASY_COMMON) | set(EASY_JUDGED)
sent_changes = defaultdict(lambda: [set(), []])  # (title, idx) -> (fields, whys)
for s in base['situations']:
    for i, x in enumerate(s['sentences']):
        gone = [w for w in x['words'] if w in removed_tags]
        if gone:
            x['words'] = [w for w in x['words'] if w not in removed_tags]
            k = (s['title'], i)
            sent_changes[k][0].add('words')
            sent_changes[k][1].append(f"쉬운 {', '.join(gone)} 태그를 뺐다")

for title, edits in SENT_EDITS.items():
    s = S[title]
    for i, (fields, why) in edits.items():
        x = s['sentences'][i]
        for f, v in fields.items():
            if f == 'words':
                v = [w for w in v if w not in removed_tags]
            if x[f] != v:
                x[f] = v
                sent_changes[(title, i)][0].add(f)
        sent_changes[(title, i)][1].append(why)

for wid, (fields, why) in WORD_EDITS.items():
    w = W[wid]
    ch = [f for f, v in fields.items() if w[f] != v]
    for f in ch:
        w[f] = fields[f]
    changes.append({'kind': 'word', 'id': wid, 'fields': ch, 'why': why})

# 쓰이지 않게 된 단어 지우기
used = {wid for s in base['situations'] for x in s['sentences'] for wid in x['words']}
for wid in list(W):
    if wid not in used:
        assert wid in removed_tags, wid
        why = EASY_JUDGED.get(wid, '공통 쉬운 단어 목록 — 어느 문장도 태그하지 않게 됐다')
        changes.append({'kind': 'word-remove', 'id': wid, 'why': why})
        del W[wid]
words = [w for w in words if w['id'] in W]

# 예문 ko가 바뀐 문장을 예문으로 쓰는 단어는 exKo를 그 ko로 맞춘다(아래 v45 병합 때 덮어씀)
ko_of = {}
for s in base['situations']:
    for x in s['sentences']:
        ko_of.setdefault(x['en'], x['ko'])

for (title, i), (fields, whys) in sent_changes.items():
    changes.append({'kind': 'sentence', 'situation': title, 'index': i,
                    'fields': sorted(fields), 'why': '; '.join(whys)})

# ---------------------------------------------------------------- v45 병합
add_words = {}
for p in sorted(glob.glob(f'{D}/add_{THEME}_words_*.yaml')):
    for wid, v in (yaml.safe_load(open(p, encoding='utf-8')) or {}).items():
        assert wid not in add_words, f'dup {wid} in {p}'
        add_words[wid] = v
add_nuance = {}
for p in sorted(glob.glob(f'{D}/add_{THEME}_nuance_*.yaml')):
    for t, v in (yaml.safe_load(open(p, encoding='utf-8')) or {}).items():
        assert t not in add_nuance, f'dup {t} in {p}'
        add_nuance[t] = v

FIELDS = ('exKo', 'cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips')
problems = []
for w in words:
    a = add_words.get(w['id'])
    if a is None:
        if add_words:
            problems.append(f"v45 data missing for {w['id']}")
        continue
    for f in FIELDS:
        if f in a:
            w[f] = a[f]
    if 'exKo' not in a and w['example'] in ko_of:
        w['exKo'] = ko_of[w['example']]
    # 예문이 문장이면 exKo는 그 문장의 ko와 같아야 한다
    if w['example'] in ko_of and w.get('exKo') != ko_of[w['example']]:
        problems.append(f"{w['id']}: exKo {w.get('exKo')!r} != sentence ko {ko_of[w['example']]!r}")
for wid in add_words:
    if wid not in W:
        problems.append(f'add data for unknown/removed word {wid}')
for s in base['situations']:
    if s['title'] in add_nuance:
        s['nuance'] = add_nuance[s['title']]
for t in add_nuance:
    if t not in S:
        problems.append(f'nuance for unknown situation {t}')

# ---------------------------------------------------------------- 자체 점검
RESERVED = {'on', 'off', 'no', 'yes', 'y', 'n', 'true', 'false', 'null'}


def recombines(en, real, decoys):
    """정답 철자(낱말마다)를 오답 조각을 하나 이상 써서 다시 만들 수 있는가."""
    frags = [(f, f in decoys and f not in real) for f in set(real) | set(decoys)]
    for token in en.split(' '):
        n = len(token)
        # dp[i] = (reachable without decoy, reachable with decoy)
        dp = [[False, False] for _ in range(n + 1)]
        dp[0][0] = True
        for i in range(n):
            for used_decoy in (0, 1):
                if not dp[i][used_decoy]:
                    continue
                for f, is_decoy in frags:
                    if f and token.startswith(f, i):
                        dp[i + len(f)][1 if (used_decoy or is_decoy) else 0] = True
        if dp[n][1]:
            return True
    return False


for w in words:
    if 'chips' not in w:
        continue
    real = [f for word in w['chips'] for f in word]
    if recombines(w['en'], real, w['decoyChips']):
        problems.append(f"{w['id']}: decoy chips can rebuild {w['en']!r}")
    for k in ('distractorsEn', 'distractorsKo', 'decoyChips'):
        for o in w.get(k) or []:
            if not isinstance(o, str):
                problems.append(f"{w['id']}: {k} has non-string {o!r}")
    for k in ('distractorsKo',):
        if w['ko'] in (w.get(k) or []):
            problems.append(f"{w['id']}: ko in distractorsKo")
# 같은 ko 두 단어
kos = Counter(w['ko'] for w in words)
for k, n in kos.items():
    if n > 1:
        problems.append(f'same ko {k!r} on {n} words: ' + ', '.join(w['id'] for w in words if w['ko'] == k))
# swap 문법·pair 점검용 출력
for s in base['situations']:
    for n in s.get('nuance') or []:
        if n['kind'] == 'swap':
            b = n['before']
            for o in n['options']:
                pass
        if n['kind'] == 'context':
            assert sum(1 for sc in n['scenes'] if sc.get('ok') is False) == 1

# ---------------------------------------------------------------- 쓰기
out = {'theme': THEME, 'words': words, 'situations': base['situations']}
with open(f'{D}/{THEME}.yaml', 'w', encoding='utf-8') as f:
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
with open(f'{D}/changes-{THEME}.yaml', 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': THEME, 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=1000)

# 다시 읽어 불리언 등 확인
re_doc = yaml.safe_load(open(f'{D}/{THEME}.yaml', encoding='utf-8'))
for w in re_doc['words']:
    for k, v in w.items():
        vals = v if isinstance(v, list) else [v]
        flat = []
        for x in vals:
            flat += x if isinstance(x, list) else [x]
        for x in flat:
            if not isinstance(x, str):
                problems.append(f"{w['id']}.{k}: non-string {x!r}")

c = Counter(ch['kind'] for ch in changes)
nk = Counter(n['kind'] for s in base['situations'] for n in s.get('nuance') or [])
print(f'words {len(words)} · situations {len(base["situations"])} · changes {dict(c)} · nuance {dict(nk)} total {sum(nk.values())}')
wf = Counter(f for ch in changes if ch['kind'] == 'word' for f in ch['fields'])
sf = Counter(f for ch in changes if ch['kind'] == 'sentence' for f in ch['fields'])
print('word fields', dict(wf), '· sentence fields', dict(sf))
for p in problems:
    print('PROBLEM', p)
