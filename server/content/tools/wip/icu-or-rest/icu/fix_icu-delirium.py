#!/usr/bin/env python3
"""icu-delirium 수정 — icu-delirium.pre-fix.yaml을 읽어 fix_icu-delirium_data_N.yaml 을 적용해 icu-delirium.yaml 을 다시 쓴다.
변경 목록(changes-icu-delirium.yaml)은 changes-icu-delirium.pre-fix.yaml(수정 전 목록)에 새 변경을 이어 붙여 다시 쓴다.
"""
import copy, os, shutil, sys, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(HERE, n)
THEME = 'icu-delirium'

def load(n):
    with open(P(n), encoding='utf-8') as f:
        return yaml.safe_load(f)

pre = load(f'{THEME}.pre-fix.yaml')
doc = copy.deepcopy(pre)
d1, d2, d3, d4 = (load(f'fix_{THEME}_data_{i}.yaml') for i in (1, 2, 3, 4))

W = {w['id']: w for w in doc['words']}
S = doc['situations']
errors = []

# ---- 1. 문장
sent_old = {}
def key(k):
    a, b = k.split('-')
    return int(a), int(b)

for k, patch in d1['sentences'].items():
    a, b = key(k)
    s = S[a]['sentences'][b]
    sent_old[k] = copy.deepcopy(s)
    for f, v in patch.items():
        if f == 'blank':
            s['blank'] = {'answer': v['answer'], 'options': [{'en': o} for o in v['options']]}
        else:
            s[f] = v

for k, t in d1['tags'].items():
    a, b = key(k)
    s = S[a]['sentences'][b]
    sent_old.setdefault(k, copy.deepcopy(s))
    ws = [w for w in s['words'] if w not in t.get('remove', [])]
    for w in t.get('add', []):
        if w not in ws:
            ws.append(w)
    s['words'] = ws

# ---- 2. 단어
removed = d3['remove_words']
for wid, m in d2['distractorsEn_replace'].items():
    w = W[wid]
    de = list(w['distractorsEn'])
    for old, new in m.items():
        if old in de:
            de[de.index(old)] = new
    w['distractorsEn'] = de
for wid, patch in d3['word_fields'].items():
    W[wid].update(patch)
for wid, cue in d3['cues'].items():
    W[wid]['cue'] = cue
for nw in d3['new_words']:
    nw = dict(nw)
    after = nw.pop('insert_after')
    # 은행 안 키 순서를 기존 단어와 같게
    ref = list(W['w-clear'].keys())
    new = {k: nw[k] for k in ref if k in nw}
    idx = [w['id'] for w in doc['words']].index(after) + 1
    doc['words'].insert(idx, new)
    W[new['id']] = new
doc['words'] = [w for w in doc['words'] if w['id'] not in removed]
for r in removed:
    W.pop(r, None)

# ---- 3. 예문 따라가기 — 문장 en/ko가 바뀌면 그 문장을 예문으로 쓰는 단어·슬라이더 example·exKo도
en2old = {}
for k, o in sent_old.items():
    a, b = key(k)
    n = S[a]['sentences'][b]
    if o['en'] != n['en']:
        en2old[o['en']] = n['en']
ex_changed = set()
for w in doc['words']:
    if w['example'] in en2old:
        w['example'] = en2old[w['example']]
        ex_changed.add(w['id'])
ko_of = {s['en']: s['ko'] for sit in S for s in sit['sentences']}
for w in doc['words']:
    if w['example'] in ko_of:
        w['exKo'] = ko_of[w['example']]
for sit in S:
    for n in sit.get('nuance') or []:
        if n.get('example') in en2old:
            n['example'] = en2old[n['example']]
        if n.get('example') in ko_of:
            n['exKo'] = ko_of[n['example']]

# ---- 4. 뉘앙스·순서
for k, patch in d4['nuance'].items():
    a, b = map(int, k.split(':'))
    n = S[a]['nuance'][b]
    for f, v in patch.items():
        if f == 'scenes_who':
            for i, x in v.items():
                n['scenes'][i]['who'] = x
        elif f == 'scenes_en':
            for i, x in v.items():
                n['scenes'][i]['en'] = x
        else:
            n[f] = v
for k, patch in d4['order'].items():
    a, b = map(int, k.split(':'))
    S[a]['order']['lines'][b].update(patch)

# ---- 5. 고아·누락 점검
bank = set(W)
used = set()
for sit in S:
    for s in sit['sentences']:
        used.update(s['words'])
        for x in s['words']:
            if x not in bank:
                errors.append(f"문장이 모르는 단어 {x}")
    for n in sit.get('nuance') or []:
        for x in n.get('words') or []:
            used.add(x)
            if x not in bank:
                errors.append(f"뉘앙스가 모르는 단어 {x}")
for wid in bank - used:
    errors.append(f"어느 문장도 태그하지 않는 단어 {wid}")
if errors:
    print('\n'.join(errors)); sys.exit(1)

with open(P(f'{THEME}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False)

# ---- 6. 변경 목록
base_path = P(f'changes-{THEME}.pre-fix.yaml')
if not os.path.exists(base_path):
    shutil.copy(P(f'changes-{THEME}.yaml'), base_path)
changes = load(f'changes-{THEME}.pre-fix.yaml')['changes']

SENT_WHY = {
    '0-3': "CAM-ICU 주의력 검사는 '두 번 쥐기'가 아니라 글자 A가 들릴 때 손을 쥐는 검사다 — 사실 오류(안전). 오역 아님",
    '0-4': "CAM-ICU의 특징 이름은 '주의력'이 아니라 부주의(Inattention)다 — w-attention은 고아가 돼 삭제",
    '16-5': "빠진 중심정맥관은 다시 밀어 넣지 않고 새 부위에 새로 잡는다(오염·색전) — 안전. w-reinsert 삭제",
    '17-4': "QT 연장 맥락의 대안은 작용 시간이 아니라 QT 위험이 적은 약이다 — 사실. w-short·w-acting 삭제",
    '17-2': "'pull an ECG'는 미국에서 어색하고 w-pull 뜻(뽑다)과 다르다. 청크도 명사구를 끊지 않게",
    '5-4': "통증·요저류·저산소증은 섬망의 유발요인이지 대안이 아니다 — 사실. w-assume 삭제",
    '1-2': "청크가 구를 끊지 않게(anytime you feel confused)",
    '2-5': "청크가 명사구를 끊지 않게(through most of the night)",
    '12-2': "청크가 구를 끊지 않게(can watch him closely)",
    '13-4': "청크가 구를 끊지 않게(A higher CIWA score)",
    '15-1': "청크가 구를 끊지 않게(give him space)",
    '20-5': "청크가 구를 끊지 않게(as a restraint-related injury)",
    '7-0': "I hear you는 '목소리가 들린다'가 아니라 '말을 잘 듣고 있다'는 인정이다 — ko 오역",
    '10-1': "'얕추고'는 오타 — ko",
    '14-1': "en의 permanent가 ko에 빠졌다 — ko",
    '14-3': "presence는 '목소리'가 아니라 곁에 있음 — ko 오역",
    '15-2': "음차('디에스컬레이션')와 어색한 '환자를 확보' — ko",
    '16-3': "'고정'이 억제로 읽히지 않게 '붙잡아 주시고'로 — ko(en은 그대로, 사용자 결정 대기)",
    '19-3': "I hear how …는 '들려요' 직역이 아니라 공감 — ko",
    '19-4': "'뇌를 지지하면서'는 어색한 직역 — ko",
    '20-4': "'패딩하고'는 외래어 직역 — ko",
}
TAG_WHY = "헤드워드와 뜻·품사가 맞지 않는 쓰임이라 태그를 뺌(A 10번) — 문장은 그대로"
WORD_WHY = {
    'w-bowel': "'배변'은 bowel movement 전체의 뜻 — 헤드워드 bowel은 '장'",
    'w-escalate': "'늘리다'가 w-increase와 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — 가름",
    'w-tell': "'말하다'가 w-speak와 같아 정답이 둘이 된다 — 가름",
    'w-fully': "'완전히'가 w-completely와 같아 정답이 둘이 된다 — 가름",
    'w-deescalate': "'진정시키다'는 이 주제에서 sedation(진정제)과 같은 말이라 약물 진정으로 오해된다 — 가름",
    'w-secure': "15-2·16-3 모두 사람·손을 붙잡는 뜻이라 '확보하다'가 아니라 '(안전하게) 고정하다'",
    'w-closely': "상황 3 context의 ko(면밀히)와 맞춤",
    'w-measure': "목표를 이루려는 구체적 '조치'(비약물 조치)",
    'w-take': "문장이 쓰는 뜻은 '(숨을) 쉬다' — 'take weeks'는 태그를 뺌",
}
for k, o in sent_old.items():
    a, b = key(k)
    n = S[a]['sentences'][b]
    fields = [f for f in ('en', 'ko', 'chunks', 'words') if o[f] != n[f]]
    if not fields:
        continue
    only_words = fields == ['words']
    why = TAG_WHY if (only_words and k in d1['tags']) else SENT_WHY.get(k)
    if k == '19-1':
        why = "w-take('take weeks')·w-week(쉬운 말)의 태그를 뺌 — 문장은 그대로"
    if k == '10-4':
        why = "w-room은 너무 쉬운 말(공통 쉬운 단어 목록) — 태그를 뺌, 문장은 그대로"
    if k == '19-4':
        why = SENT_WHY['19-4'] + "; w-support 태그도 뺌('받쳐 주다'와 맞지 않음)"
    if k == '11-3':
        why = "w-clear(맑아지다)가 아니라 부사 clearly — 새 단어 w-clearly로 태그(A 10·11번)"
    if k == '17-2':
        why = SENT_WHY['17-2'] + "; w-pull 태그를 뺌"
    if not why:
        errors.append(f"no why for sentence {k} {fields}")
        why = '검토 목록 반영'
    changes.append({'kind': 'sentence', 'situation': S[a]['title'], 'index': b, 'fields': fields, 'why': why})

pre_w = {w['id']: w for w in pre['words']}
for wid, w in W.items():
    if wid not in pre_w:
        changes.append({'kind': 'word-add', 'id': wid, 'why': "w-clear 한 헤드워드에 동사·형용사·부사가 섞여 나눔 — 11-3은 부사 clearly(A 11번)"})
        continue
    fields = [f for f in ('en', 'ipa', 'ko', 'icon', 'example') if pre_w[wid].get(f) != w.get(f)]
    if not fields:
        continue
    why = WORD_WHY.get(wid)
    if fields == ['example']:
        why = "예문으로 쓰던 문장의 en을 바꿨다 — 예문을 새 문장으로"
    elif wid in WORD_WHY and 'example' in fields:
        why += "; 예문도 새 문장으로"
    if not why:
        errors.append(f"no why for word {wid} {fields}")
        why = '검토 목록 반영'
    changes.append({'kind': 'word', 'id': wid, 'fields': fields, 'why': why})
REM_WHY = {
    'w-reinsert': "16-5 en을 'place a new line'으로 고쳐 어느 문장도 태그하지 않게 됐다(안전: 빠진 관을 다시 넣지 않음)",
    'w-short': "17-4 en을 'less QT risk'로 고쳐 어느 문장도 태그하지 않게 됐다",
    'w-acting': "17-4 en을 'less QT risk'로 고쳐 어느 문장도 태그하지 않게 됐다",
    'w-attention': "0-4 en을 'inattention feature'로 고쳐 어느 문장도 태그하지 않게 됐다",
    'w-assume': "5-4 en을 사실에 맞게 고쳐 어느 문장도 태그하지 않게 됐다",
    'w-room': "너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다",
    'w-week': "너무 쉬움(공통 쉬운 단어 목록) — 어느 문장도 태그하지 않게 됐다",
}
for r in removed:
    changes.append({'kind': 'word-remove', 'id': r, 'why': REM_WHY[r]})
if errors:
    print('\n'.join(errors)); sys.exit(1)
with open(P(f'changes-{THEME}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': THEME, 'changes': changes}, f, allow_unicode=True, sort_keys=False)
print('written; changes', len(changes))
