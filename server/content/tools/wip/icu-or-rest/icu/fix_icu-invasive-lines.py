# icu-invasive-lines 수정 — pre-fix 원본에서 다시 돌려도 같은 결과(재실행 가능).
# 입력: icu-invasive-lines.pre-fix.yaml, changes-icu-invasive-lines.pre-fix.yaml,
#       fix_icu-invasive-lines_data_{1,2,3}.yaml, revB_icu_invasive_lines_vals.py(B 검토 새 값)
# 출력: icu-invasive-lines.yaml, changes-icu-invasive-lines.yaml, fix_icu-invasive-lines_diff.txt
import copy, sys, yaml
sys.path.insert(0, '.')
from revB_icu_invasive_lines_vals import DK, BLANK, DECOY, ICON

T = 'icu-invasive-lines'
L = lambda p: yaml.safe_load(open(p, encoding='utf-8'))
pre = L(f'{T}.pre-fix.yaml')
doc = copy.deepcopy(pre)
d1, d2, d3 = L(f'fix_{T}_data_1.yaml'), L(f'fix_{T}_data_2.yaml'), L(f'fix_{T}_data_3.yaml')

W = {w['id']: w for w in doc['words']}

# ---- 1. 단어
for wid, fields in d1['words'].items():
    assert wid in W, wid
    W[wid].update(copy.deepcopy(fields))
REMOVED = set(d1['remove'])
doc['words'] = [w for w in doc['words'] if w['id'] not in REMOVED]
W = {w['id']: w for w in doc['words']}

# ---- 2. 문장: B 값 → A 데이터(겹치면 A가 이김) → 지운 단어 태그 빼기
old_sent = {}
for si, s in enumerate(doc['situations']):
    for j, x in enumerate(s['sentences']):
        k = f'{si}.{j}'
        old_sent[k] = copy.deepcopy(x)
        if k in DK:
            x['distractorsKo'] = [a if a is not None else b for a, b in zip(DK[k], x['distractorsKo'])]
        if k in BLANK:
            b = BLANK[k]
            x['blank'] = {'answer': b.get('answer', x['blank']['answer']), 'options': [{'en': o} for o in b['options']]}
        if k in DECOY:
            x['decoy'] = DECOY[k]
        if k in ICON:
            x['icon'] = ICON[k]
        if k in d2['sentences']:
            for f, v in copy.deepcopy(d2['sentences'][k]).items():
                if f == 'blank':
                    v = {'answer': v['answer'], 'options': [{'en': o} for o in v['options']]}
                x[f] = v
        x['words'] = [w for w in x['words'] if w not in REMOVED]
        for w in x['words']:
            assert w in W, (k, w)
    for n in s['nuance']:
        if 'words' in n:
            n['words'] = [w for w in n['words'] if w not in REMOVED]

# ---- 3. 바뀐 문장을 예문으로 쓰는 단어의 example·exKo 맞추기(V17)
for k, old in old_sent.items():
    si, j = map(int, k.split('.'))
    new = doc['situations'][si]['sentences'][j]
    if (old['en'], old['ko']) == (new['en'], new['ko']):
        continue
    for w in doc['words']:
        if w['example'] == old['en']:
            if old['en'] != new['en']:
                assert w['id'] in new['words'], (k, w['id'])
                w['example'] = new['en']
                w['exKo'] = new['ko']
            elif w['exKo'] == old['ko']:
                w['exKo'] = new['ko']

# ---- 4. 뉘앙스·순서
for key, fields in d3['nuance'].items():
    si, ni = map(int, key.split('.'))
    doc['situations'][si]['nuance'][ni].update(copy.deepcopy(fields))
for key, o in d3['order'].items():
    od = doc['situations'][int(key)]['order']
    for f, v in o.items():
        if f == 'lines':
            for li, lf in v.items():
                od['lines'][int(li)].update(lf)
        else:
            od[f] = v

# ---- 5. 용어 통일(번역 오류) — 문서 전체의 문자열
REPL = {'정맥정수압축': '영점 기준점', '멸균 시야': '멸균 영역'}
def walk(o):
    if isinstance(o, dict):
        return {k: walk(v) for k, v in o.items()}
    if isinstance(o, list):
        return [walk(v) for v in o]
    if isinstance(o, str):
        for a, b in REPL.items():
            o = o.replace(a, b)
        return o
    return o
doc = walk(doc)

yaml.safe_dump(doc, open(f'{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)

# ---- 6. 변경 목록: pre-fix 변경 목록 + 이번에 v44 필드가 바뀐 것 전부
chg = L(f'changes-{T}.pre-fix.yaml')
entries = list(chg['changes'])
WK = ('en', 'ko', 'ipa', 'icon', 'example')
SK = ('en', 'ko', 'chunks', 'words', 'goal')
pw = {w['id']: w for w in pre['words']}
nw = {w['id']: w for w in doc['words']}
WHY_REMOVE = {
    'w-inch': '10.4가 의사 요청 문장으로 바뀌어 이 문장에만 쓰이던 단어가 사라짐(업무 범위 밖 동작)',
    'w-hide': '7.3이 감쇠 방향을 바로잡은 새 문장으로 바뀌어 이 문장에만 쓰이던 단어가 사라짐',
    'w-need': '너무 쉬움 — 어느 문장도 태그하지 않게 됨(결정 11)',
    'w-wait': '너무 쉬움 — 어느 문장도 태그하지 않게 됨(결정 11)',
    'w-help': '너무 쉬움 — 어느 문장도 태그하지 않게 됨(결정 11)',
}
WHY_WORD = {'en': '원형·구 헤드워드로 바로잡음', 'ipa': '헤드워드에 맞춰 발음 표기', 'ko': '번역을 바로잡거나 헤드워드에 맞춤', 'example': '예문 문장이 바뀜(10.4·7.3 수정)'}
for wid in pw:
    if wid in REMOVED:
        entries.append({'kind': 'word-remove', 'id': wid, 'why': WHY_REMOVE[wid]})
        continue
    f = [k for k in WK if pw[wid].get(k) != nw[wid].get(k)]
    if f:
        entries.append({'kind': 'word', 'id': wid, 'fields': f, 'why': '수정 반영(A 검토): ' + ', '.join(WHY_WORD[k] for k in f)})
WHY_SENT = {'en': '문장 사실·업무 범위 수정', 'ko': '번역 오류 수정', 'chunks': '구동사·구 경계를 끊지 않게 조각 다시 나눔', 'words': '단어 태그 정리·문장 변경에 맞춤', 'goal': '목표 번호'}
for si, s in enumerate(doc['situations']):
    for j, x in enumerate(s['sentences']):
        old = old_sent[f'{si}.{j}']
        f = [k for k in SK if old.get(k) != x.get(k)]
        if f:
            entries.append({'kind': 'sentence', 'situation': s['title'], 'index': j, 'fields': f,
                            'why': '수정 반영(A 검토): ' + ', '.join(WHY_SENT[k] for k in f)})
yaml.safe_dump({'theme': T, 'changes': entries}, open(f'changes-{T}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)

# ---- 7. 필드 단위 전후 비교 출력
out = []
def cmp(path, a, b):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in list(a) + [k for k in b if k not in a]:
            cmp(f'{path}.{k}', a.get(k), b.get(k))
    elif isinstance(a, list) and isinstance(b, list) and len(a) == len(b) and any(isinstance(x, (dict, list)) for x in a):
        for i, (x, y) in enumerate(zip(a, b)):
            cmp(f'{path}[{i}]', x, y)
    elif a != b:
        out.append(f'{path}\n   - {a!r}\n   + {b!r}')
for wid in pw:
    if wid in REMOVED:
        out.append(f'word {wid}: REMOVED')
    else:
        cmp(f'word {wid}', pw[wid], nw[wid])
for si, (sa, sb) in enumerate(zip(pre['situations'], doc['situations'])):
    for j, (x, y) in enumerate(zip(sa['sentences'], sb['sentences'])):
        cmp(f'sent {si}.{j}', x, y)
    for ni, (x, y) in enumerate(zip(sa['nuance'], sb['nuance'])):
        cmp(f'nuance {si}.{ni}', x, y)
    cmp(f'order {si}', sa['order'], sb['order'])
open(f'fix_{T}_diff.txt', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('changes entries:', len(entries), '(pre-fix', len(chg['changes']), ')  diff items:', len(out))
