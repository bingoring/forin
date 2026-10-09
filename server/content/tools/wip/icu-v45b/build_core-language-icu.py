#!/usr/bin/env python3
"""core-language-icu v45 보강 — base에 정리(clean_)와 새 필드(add_)를 얹어 출력한다."""
import copy, glob, itertools, sys, yaml, collections
D = '/tmp/lesson-icu-v45b'
T = 'core-language-icu'
base = yaml.safe_load(open(f'{D}/base-{T}.yaml'))
clean = yaml.safe_load(open(f'{D}/clean_{T}.yaml'))
doc = copy.deepcopy(base)
sits = doc['situations']
changes = []
sent_changed = collections.defaultdict(lambda: {'fields': set(), 'why': []})

# 1. 태그 빼기
for wid, why in clean['untag_everywhere'].items():
    for si, s in enumerate(sits):
        for i, x in enumerate(s['sentences']):
            if wid in x['words']:
                x['words'] = [w for w in x['words'] if w != wid]
                c = sent_changed[(si, i)]; c['fields'].add('words'); c['why'].append(f'{wid} 태그를 뺐다')
for u in clean['untag_at']:
    x = sits[u['sit']]['sentences'][u['idx']]
    assert u['id'] in x['words'], u
    x['words'] = [w for w in x['words'] if w != u['id']]
    c = sent_changed[(u['sit'], u['idx'])]; c['fields'].add('words'); c['why'].append(u['why'])
# 2. 문장 ko
for u in clean['sentence_ko']:
    x = sits[u['sit']]['sentences'][u['idx']]
    x['ko'] = u['ko']
    c = sent_changed[(u['sit'], u['idx'])]; c['fields'].add('ko'); c['why'].append(u['why'])
# 3. 단어 수정
bank = {w['id']: w for w in doc['words']}
for wid, e in clean['word_edits'].items():
    for k, v in e['set'].items():
        bank[wid][k] = v
    changes.append({'kind': 'word', 'id': wid, 'fields': list(e['set']), 'why': e['why']})
# 4. 고아 단어 지우기
used = {w for s in sits for x in s['sentences'] for w in x['words']}
removed = [w['id'] for w in doc['words'] if w['id'] not in used]
for wid in removed:
    assert wid in clean['untag_everywhere'] or any(u['id'] == wid for u in clean['untag_at']), wid
    changes.append({'kind': 'word-remove', 'id': wid, 'why': '어느 문장도 태그하지 않게 됐다 — ' + clean['untag_everywhere'].get(wid, '')})
doc['words'] = [w for w in doc['words'] if w['id'] in used]
for (si, i), c in sorted(sent_changed.items()):
    changes.append({'kind': 'sentence', 'situation': sits[si]['title'], 'index': i,
                    'fields': sorted(c['fields']), 'why': '; '.join(c['why'])})

# 5. v45 단어 필드
add = {}
for f in sorted(glob.glob(f'{D}/add_{T}_words_*.yaml')):
    for k, v in (yaml.safe_load(open(f)) or {}).items():
        assert k not in add, ('dup', k); add[k] = v
sent_ko = {x['en']: x['ko'] for s in sits for x in s['sentences']}
errs, missing = [], []
KEYS = [('cue', 'cue'), ('tag', 'tag'), ('dEn', 'distractorsEn'), ('dKo', 'distractorsKo'), ('chips', 'chips'), ('decoy', 'decoyChips')]
for w in doc['words']:
    a = add.get(w['id'])
    if a is None:
        missing.append(w['id']); continue
    exko = a.get('exKo') or sent_ko.get(w['example'])
    if not exko: errs.append(f"{w['id']}: exKo 없음 (example이 문장과 다르다)")
    w['exKo'] = exko
    for s, l in KEYS:
        w[l] = a[s]
def _strs(o,path):
    if isinstance(o,dict):
        for k,v in o.items(): _strs(v,f'{path}.{k}')
    elif isinstance(o,list):
        for v in o: _strs(v,path)
    elif not isinstance(o,(str,int)) or isinstance(o,bool): errs.append(f'문자열 아님 {path}: {o!r}')
for k,v in add.items(): _strs(v,k)
for k in add:
    if k not in bank or k in removed: errs.append(f'add에 은행에 없는 id: {k}')

# 6. 뉘앙스
nu = {}
for f in sorted(glob.glob(f'{D}/add_{T}_nuance_*.yaml')):
    for k, v in (yaml.safe_load(open(f)) or {}).items():
        assert k not in nu, ('dup', k); nu[k] = v
for s in sits:
    if s['title'] in nu: s['nuance'] = nu[s['title']]
for k in nu:
    if k not in {s['title'] for s in sits}: errs.append(f'nuance 제목 불일치: {k}')

# 7. 자체 검사
def rebuild(target, pieces):
    """pieces(멀티셋)로 target을 만드는 모든 분할(조각 튜플)"""
    out = set()
    def go(rest, avail, acc):
        if not rest: out.add(tuple(acc)); return
        for p in set(avail):
            if p and rest.startswith(p):
                av = list(avail); av.remove(p); go(rest[len(p):], av, acc + [p])
    go(target, pieces, []); return out
for w in doc['words']:
    if 'chips' not in w: continue
    ch = w['chips']
    if ' '.join(''.join(p) for p in ch) != w['en']: errs.append(f"{w['id']}: chips join != en")
    flat = [p for wd in ch for p in wd]
    for d in w['decoyChips']:
        if not isinstance(d, str): errs.append(f"{w['id']}: decoy 문자열 아님 {d!r}")
        if d in flat: errs.append(f"{w['id']}: decoy == 정답 조각 {d}")
    for wd in ch:
        word = ''.join(wd)
        alts = rebuild(word, list(wd) + [d for d in w['decoyChips'] if isinstance(d, str)])
        if any(alt != tuple(wd) for alt in alts): errs.append(f"{w['id']}: 오답 조각으로 {word} 재조립 가능 {alts}")
    for l in ('distractorsEn', 'distractorsKo'):
        if len(w[l]) != 2 or any(not isinstance(x, str) for x in w[l]): errs.append(f"{w['id']}: {l} 이상 {w[l]}")
    if w['en'].lower() in w['cue'].lower(): errs.append(f"{w['id']}: cue에 정답")
kos = collections.Counter(w['ko'] for w in doc['words'])
for k, n in kos.items():
    if n > 1: errs.append(f'ko 중복: {k} {[w["id"] for w in doc["words"] if w["ko"]==k]}')
kob = {w['ko']: w['id'] for w in doc['words']}
for w in doc['words']:
    for dk in w.get('distractorsKo', []):
        if dk in kob: print(f"  [i] {w['id']} distractorKo {dk!r} = 은행 {kob[dk]}의 ko")
for si, s in enumerate(sits):
    tagged = {w for x in s['sentences'] for w in x['words']}
    if len(tagged) < 8: errs.append(f'상황 {si} 단어 {len(tagged)}개 < 8')
    for n in s.get('nuance', []):
        for w in n.get('words', []):
            if w not in tagged: errs.append(f"상황 {si} nuance words {w} 이 상황 문장에 없음")
        if n['kind'] == 'swap':
            for o in n['options']:
                print(f"  [swap {si}] {n['before'][0]}{o}{n['before'][2]}") if '-v' in sys.argv else None
if missing: print(f'v45 데이터 없는 단어 {len(missing)}개: {missing[:8]}...')
for e in errs: print('  [E]', e)
yaml.safe_dump(doc, open(f'{D}/{T}.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump({'theme': T, 'changes': changes}, open(f'{D}/changes-{T}.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print(f'words {len(doc["words"])} removed {len(removed)} changes {len(changes)} errs {len(errs)}')
