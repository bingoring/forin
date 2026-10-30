#!/usr/bin/env python3
"""or-count 수정 — or-count.pre-fix.yaml(+changes-or-count.pre-fix.yaml)에 fix_or-count_data_1~4.yaml을 얹어
or-count.yaml · changes-or-count.yaml을 다시 만든다. 몇 번 돌려도 같은 결과(원본을 읽음)."""
import copy, json, os, sys, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(HERE, n)
dump = lambda d: yaml.safe_dump(d, allow_unicode=True, sort_keys=False, width=1000)
load = lambda n: yaml.safe_load(open(P(n), encoding='utf-8'))

doc = load('or-count.pre-fix.yaml')
pre = copy.deepcopy(doc)
chg = load('changes-or-count.pre-fix.yaml')
d1, d2, d3, d4 = (load(f'fix_or-count_data_{i}.yaml') for i in range(1, 5))
bank = {w['id']: w for w in doc['words']}
sit = doc['situations']
S = lambda key: sit[int(key.split('.')[0])]['sentences'][int(key.split('.')[1])]

# 1. 문장 (A)
for key, fields in d1['sentences'].items():
    s = S(key)
    old_en, old_ko = s['en'], s['ko']
    for k, v in fields.items():
        s[k] = v
    for w in bank.values():           # 예문·번역을 문장에 맞춤(V17)
        if w.get('example') == old_en:
            w['example'] = s['en']
            w['exKo'] = s['ko']
    for si in sit:                    # slider/swap 예문의 번역
        for n in si.get('nuance') or []:
            if n.get('example') == old_en and n.get('exKo') == old_ko:
                n['exKo'] = s['ko']

# 2. B — distractorsKo · 빈칸 · decoy
for key, pair in d2['distractorsKo'].items():
    s = S(key)
    s['distractorsKo'] = [n if n is not None else o for n, o in zip(pair, s['distractorsKo'])]
for key, (ans, opts) in d2['blank'].items():
    s = S(key)
    if ans:
        s['blank']['answer'] = ans
    s['blank']['options'] = [{'en': o} for o in opts]
for key, dec in d2['decoy'].items():
    S(key)['decoy'] = dec
for key, why in d3['sentence_why'].items():
    S(key)['why'] = why

# 3. order · why
for oi, spec in d3['order'].items():
    o = sit[oi]['order']
    if 'why' in spec:
        o['why'] = spec['why']
    for li, line in spec.get('lines', {}).items():
        o['lines'][li].update(line)

# 4. 단어
for wid, why in d4['word_remove']:
    del bank[wid]
doc['words'] = [w for w in doc['words'] if w['id'] in bank]
for wid, f in list(d4['words'].items()) + list(d4['cues'].items()):
    bank[wid].update(f)

# 5. 뉘앙스
for si, items in d4['nuance'].items():
    nu = sit[si]['nuance']
    for it in items:
        n = nu[it['at']]
        if 'replace' in it:
            nu[it['at']] = it['replace']
        if 'set' in it:
            n.update(it['set'])
        if 'set_scene_fix' in it:
            n['scenes'][it['set_scene_fix']['index']]['fix'] = it['set_scene_fix']['fix']
        if 'set_note' in it:
            n['notes'][it['set_note']['key']] = it['set_note']['text']

# 6. 안전장치 — keyPhrase 문장의 en·chunks는 그대로여야 한다
inj = json.load(open(P('in-or-count.json'), encoding='utf-8'))
for si, (a, b) in enumerate(zip(pre['situations'], sit)):
    kp = set(inj['situations'][si]['keyPhrases'])
    for i, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        if x['en'] in kp:
            assert x['en'] == y['en'] and x['chunks'] == y['chunks'], f'keyPhrase {si}.{i} 의 en/chunks가 바뀜'

# 7. 변경 목록 — 이번에 바뀐 v44 필드를 pre-fix와 비교해 적는다(기존 항목은 그대로 두고 덧붙임)
W_WHY = {
    'w-miss': '문장은 is still missing(형용사 뜻 없어진) — 헤드워드를 부사·동사 아닌 형용사 missing으로',
    'w-rule': 'ko 배제하다는 rule out의 뜻 — 구 단위 헤드워드(결정 11)',
    'w-turn': 'ko 나타나다는 turn up의 뜻 — 구 단위 헤드워드; 17.4 문장을 바꿔 예문도 맞춤',
    'w-pick': 'ko 이어 가다는 pick up의 뜻 — 구 단위 헤드워드; 12.4 문장을 바꿔 예문도 맞춤',
    'w-run': 'ko 늦어지다는 run late의 뜻 — 구 단위 헤드워드(w-late 삭제)',
    'w-careful': '수색의 carefully는 조심스럽게(살살 다룸)가 아니라 빠짐없이 꼼꼼히',
    'w-bin': '쓴 거즈는 최종 계수가 끝날 때까지 버리지 않고 수거통에 모아 둠 — 쓰레기통이 아님',
    'w-interrupt': '문장 12.2는 계수가 중단됐다는 수동 — 방해하다가 아니라 중단시키다',
    'w-shake': 'shake out은 소독포를 털어 내는 동작 — 흔들다보다 털다',
    'w-movement': '17.4 문장을 바꿔 예문도 맞춤',
    'w-request': '19.4 문장을 바꿔 예문도 맞춤',
}
S_WHY = {
    '12.4': '중단된 계수를 확인 없이 그 자리에서 잇는 것은 안전하지 않음 — 마지막으로 확인된 계수로 돌아가는 문장으로(검토 A S1)',
    '17.4': '전원 정지가 아니라 방 안 움직임을 줄이는 것이 실제 관행 — 문장·태그(w-stop 뺌)(검토 A S3)',
    '19.4': '영상 처방은 집도의 몫 — 처방된 후속 엑스선을 요청하는 문장으로, w-scan 대신 w-xray·w-surgeon(검토 A S2)',
    '15.3': 'Please hold는 잠깐만요가 아니라 멈춰 달라는 요청(검토 A S4)',
    '17.3': '수색의 carefully는 빠짐없이 꼼꼼히(검토 A S5)',
    '14.3': '쓴 거즈는 최종 계수 전까지 버리지 않고 수거통에 모아 둠(검토 A S6)',
    '13.4': 'at the same time이 한 덩어리로 끊기도록 청크, ko를 동시에로(검토 A S7)',
    '1.3': '구동사 call it out이 끊기지 않게 청크(검토 A S8)',
    '5.4': 'accounted for now가 for now(당분간)로 잘못 읽히지 않게 청크(검토 A S8)',
    '15.4': "— we're one short가 끊기지 않게 청크(검토 A S8)",
    '18.3': "don't add up(맞아떨어지다)은 카드 w-add(추가하다)가 아님 — 태그 뺌(검토 A S9)",
    '1.0': 'w-loud 삭제로 태그 뺌, ko 띄어쓰기(검토 A W6·S10)',
    '13.3': 'w-eye 삭제로 태그 뺌(검토 A W7)',
    '20.3': 'w-run을 run late로 바꾸며 w-late 삭제 — 태그 뺌(검토 A W9)',
    '3.1': '번역투 ko를 자연스럽게(검토 A S10)',
}
V44_W = ('id', 'en', 'ko', 'ipa', 'icon', 'example')
V44_S = ('en', 'ko', 'chunks', 'words', 'goal')
new = []
for wid, why in d4['word_remove']:
    new.append({'kind': 'word-remove', 'id': wid, 'why': why})
pw = {w['id']: w for w in pre['words']}
for w in doc['words']:
    diff = [k for k in V44_W if pw[w['id']].get(k) != w.get(k)]
    if diff:
        new.append({'kind': 'word', 'id': w['id'], 'fields': diff, 'why': W_WHY[w['id']]})
for si, (a, b) in enumerate(zip(pre['situations'], sit)):
    for i, (x, y) in enumerate(zip(a['sentences'], b['sentences'])):
        diff = [k for k in V44_S if x.get(k) != y.get(k)]
        if diff:
            new.append({'kind': 'sentence', 'situation': b['title'], 'index': i, 'fields': diff, 'why': S_WHY[f'{si}.{i}']})
chg['changes'] = chg['changes'] + new

open(P('or-count.yaml'), 'w', encoding='utf-8').write(dump(doc))
open(P('changes-or-count.yaml'), 'w', encoding='utf-8').write(dump(chg))
print('written; 새 변경 항목', len(new), '총', len(chg['changes']))
