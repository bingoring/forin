#!/usr/bin/env python3
"""or-massive-transfusion A쪽: base에 단어 v45 필드 + 결정 11 정리 + 상황 nuance를 얹는다."""
import glob, yaml, io
T = 'or-massive-transfusion'
base = yaml.safe_load(io.open(f'base-{T}.yaml', encoding='utf-8'))

REMOVE = ['w-' + x for x in 'patient name time minute room blood cold each far way soon fast last start down'.split()]
KO = {
 'w-drop': '내려가다', 'w-prbc': '농축적혈구(약어)', 'w-oneg': 'O형 음성(약어)', 'w-onegative': 'O형 음성 혈액',
 'w-signoff': '서명 승인하다', 'w-rightaway': '곧바로', 'w-alongside': '나란히',
 'w-fall': '하락하다', 'w-rise': '상승하다', 'w-depress': '저하시키다',
}
HEAD = {  # id: (en, ipa) — 활용형 헤드워드를 원형으로
 'w-bind': ('bind', '/baɪnd/'), 'w-depress': ('depress', '/dɪˈprɛs/'), 'w-dilute': ('dilute', '/daɪˈluːt/'),
 'w-climb': ('climb', '/klaɪm/'), 'w-fall': ('fall', '/fɔːl/'), 'w-rise': ('rise', '/raɪz/'),
}
NEW = [
 dict(id='w-setting', en='setting', ipa='/ˈsɛtɪŋ/', ko='설정값', icon='gear', example="Let's check the warmer's temperature setting."),
 dict(id='w-hypothermia', en='hypothermia', ipa='/ˌhaɪpoʊˈθɜːrmiə/', ko='저체온증', icon='monitor', example='Warm fluids help prevent hypothermia.'),
 dict(id='w-prevent', en='prevent', ipa='/prɪˈvɛnt/', ko='예방하다', icon='shield', example='Warm fluids help prevent hypothermia.'),
 dict(id='w-ph', en='pH', ipa='/piː eɪtʃ/', ko='산도(pH)', icon='lab', example='The pH is dropping along with the lactate.'),
]
NEWWHY = {'w-setting': "쉬운 w-time 대신 가르칠 말 — 가온 상황 문장 4에 이미 있다",
          'w-hypothermia': "저체온 예방 상황의 문장 5에 이미 있는 핵심 말 — 쉬운 단어를 뺀 자리를 채움",
          'w-prevent': "저체온 예방 상황의 문장 5에 이미 있는 말 — 쉬운 단어를 뺀 자리를 채움",
          'w-ph': "산-염기 상황의 문장 4에 이미 있는 말 — 쉬운 단어를 뺀 자리를 채움"}
# 문장 words 태그 더하기: (상황 index, 문장 index) -> 단어 id들
ADDTAG = {(2, 4): ['w-setting'], (8, 5): ['w-hypothermia', 'w-prevent'], (13, 4): ['w-ph'], (13, 5): ['w-report']}

data = {}
for f in sorted(glob.glob(f'add_{T}_A_words_*.txt')):
    for ln in io.open(f, encoding='utf-8'):
        ln = ln.strip()
        if not ln or ln.startswith('#'): continue
        p = [x.strip() for x in ln.split('|')]
        assert len(p) == 7, ln
        wid, cue, tag, den, dko, chips, decoy = p
        data['w-' + wid] = dict(
            cue=cue, tag=tag,
            distractorsEn=[x.strip() for x in den.split(';')],
            distractorsKo=[x.strip() for x in dko.split(';')],
            chips=[w.split('.') for w in chips.split(' ')],
            decoyChips=[x.strip() for x in decoy.split(';')])

changes = []
rm = set(REMOVE)
ko_by_en = {}
for si, s in enumerate(base['situations']):
    for i, x in enumerate(s['sentences']):
        ko_by_en[x['en']] = x['ko']
        old = list(x['words'])
        new = [w for w in old if w not in rm]
        for a in ADDTAG.get((si, i), []):
            if a not in new: new.append(a)
        if new != old:
            gone = [w for w in old if w not in new]
            add = [w for w in new if w not in old]
            x['words'] = new
            why = []
            if gone: why.append('쉬운 단어 태그 빼기: ' + ', '.join(gone))
            if add: why.append('태그 더하기: ' + ', '.join(add))
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': i, 'fields': ['words'], 'why': '; '.join(why)})

words = []
for w in base['words']:
    if w['id'] in rm:
        changes.append({'kind': 'word-remove', 'id': w['id'], 'why': '너무 쉬움(공통 쉬운 단어 또는 판단분) — 어느 문장도 태그하지 않게 됐다'})
        continue
    fields = []
    if w['id'] in HEAD:
        w['en'], w['ipa'] = HEAD[w['id']]; fields += ['en', 'ipa']
    if w['id'] in KO:
        w['ko'] = KO[w['id']]; fields.append('ko')
    if fields:
        why = '활용형 헤드워드를 원형으로' if 'en' in fields else '같은 뜻 단어와 가르거나 태그된 문장 뜻에 맞춤'
        if 'en' in fields and 'ko' in fields: why += ' + 뜻도 원형에 맞춤'
        changes.append({'kind': 'word', 'id': w['id'], 'fields': fields, 'why': why})
    words.append(w)
for n in NEW:
    words.append(dict(n))
    changes.append({'kind': 'word-add', 'id': n['id'], 'why': NEWWHY[n['id']]})
for w in words:
    d = data.pop(w['id'])
    w['cue'] = d['cue']
    w['exKo'] = ko_by_en[w['example']]
    w['tag'] = d['tag']
    for k in ('distractorsEn', 'distractorsKo', 'chips', 'decoyChips'):
        w[k] = d[k]
assert not data, list(data)
base['words'] = words

for f in sorted(glob.glob(f'add_{T}_A_nuance_*.yaml')):
    for si, items in (yaml.safe_load(io.open(f, encoding='utf-8')) or {}).items():
        base['situations'][int(si)]['nuance'] = items

out = {'theme': base['theme'], 'words': base['words'], 'situations': base['situations']}
with io.open(f'{T}.A.yaml', 'w', encoding='utf-8') as fh:
    yaml.safe_dump(out, fh, allow_unicode=True, sort_keys=False, width=1000)
with io.open(f'changes-{T}.yaml', 'w', encoding='utf-8') as fh:
    yaml.safe_dump({'theme': T, 'changes': changes}, fh, allow_unicode=True, sort_keys=False, width=1000)
print('words', len(words), 'changes', len(changes))
