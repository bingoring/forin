#!/usr/bin/env python3
"""core-safety-icu v45 보강: base에 결정 11 정리를 적용하고, 단어 v45 필드와 상황 nuance를 얹는다.
changes-core-safety-icu.yaml 은 edits 파일에서 자동으로 만든다."""
import glob, io, sys, yaml, collections

D = '/tmp/lesson-icu-v45b'
T = 'core-safety-icu'
FIELDS = ("exKo", "cue", "tag", "distractorsEn", "distractorsKo", "chips", "decoyChips")


def load(p):
    return yaml.safe_load(io.open(p, encoding='utf-8')) or {}


base = load(f'{D}/base-{T}.yaml')
edits = load(f'{D}/add_{T}_edits.yaml')
changes = []
sits = {s['title']: s for s in base['situations']}
sent_changed = collections.defaultdict(lambda: {'fields': set(), 'why': []})


def mark(title, i, field, why):
    e = sent_changed[(title, i)]
    e['fields'].add(field)
    e['why'].append(why)


# 1) 쉬운 단어 태그 빼기(전 문장) → 은행에서 지우기
untag = edits.get('untag') or {}
for s in base['situations']:
    for i, x in enumerate(s['sentences']):
        hit = [w for w in x['words'] if w in untag]
        if hit:
            x['words'] = [w for w in x['words'] if w not in untag]
            mark(s['title'], i, 'words', f"쉬운 단어 태그 제거: {', '.join(hit)}")

# 1b) 특정 문장에서만 태그 빼기
for e in edits.get('untag_at') or []:
    x = sits[e['situation']]['sentences'][e['index']]
    if e['word'] not in x['words']:
        sys.exit(f"untag_at: {e['word']} not in {e['situation']}[{e['index']}]")
    x['words'] = [w for w in x['words'] if w != e['word']]
    mark(e['situation'], e['index'], 'words', e['why'])

# 1c) 특정 문장에 태그 더하기
for e in edits.get('tag_at') or []:
    x = sits[e['situation']]['sentences'][e['index']]
    x['words'] = x['words'] + [e['word']]
    mark(e['situation'], e['index'], 'words', e['why'])

# 1d) 문장 ko 고치기
for e in edits.get('sentence_ko') or []:
    x = sits[e['situation']]['sentences'][e['index']]
    if x['en'] != e['en']:
        sys.exit(f"sentence_ko: en mismatch at {e['situation']}[{e['index']}]")
    x['ko'] = e['ko']
    mark(e['situation'], e['index'], 'ko', e['why'])

# 1e) 문장 고치기(틀린 내용) — en·ko·chunks·words
for e in edits.get('sentence_set') or []:
    x = sits[e['situation']]['sentences'][e['index']]
    if x['en'] != e['old_en']:
        sys.exit(f"sentence_set: en mismatch at {e['situation']}[{e['index']}]")
    for k in ('en', 'ko', 'chunks', 'words'):
        if k in e and e[k] != x[k]:
            x[k] = e[k]
            mark(e['situation'], e['index'], k, e['why'])

still = {w for s in base['situations'] for x in s['sentences'] for w in x['words']}
for wid, why in untag.items():
    if wid in still:
        sys.exit(f'{wid} still tagged')
    if wid not in [w['id'] for w in base['words']]:
        sys.exit(f'untag unknown {wid}')
    base['words'] = [w for w in base['words'] if w['id'] != wid]
    changes.append({'kind': 'word-remove', 'id': wid, 'why': f'{why} — 어느 문장도 태그하지 않게 됐다'})

# 2) 단어 필드 수정
wmap = {w['id']: w for w in base['words']}
for wid, e in (edits.get('word_fields') or {}).items():
    w = wmap[wid]
    for k, v in e['set'].items():
        if k not in ('en', 'ko', 'ipa', 'icon', 'example'):
            sys.exit(f'bad field {k}')
        w[k] = v
    changes.append({'kind': 'word', 'id': wid, 'fields': list(e['set']), 'why': e['why']})

# 3) 새 단어
for e in edits.get('word_add') or []:
    e = dict(e)
    why = e.pop('why')
    base['words'].append(e)
    changes.append({'kind': 'word-add', 'id': e['id'], 'why': why})

for (title, i), e in sent_changed.items():
    changes.append({'kind': 'sentence', 'situation': title, 'index': i, 'fields': sorted(e['fields']),
                    'why': '; '.join(e['why'])})

# 4) v45 단어 필드
adds = {}
for p in sorted(glob.glob(f'{D}/add_{T}_words_*.yaml')):
    for wid, v in load(p).items():
        if wid in adds:
            sys.exit(f'duplicate word add {wid} in {p}')
        adds[wid] = v
nuance = {}
for p in sorted(glob.glob(f'{D}/add_{T}_nuance_*.yaml')):
    for title, items in load(p).items():
        if title in nuance:
            sys.exit(f'duplicate nuance title {title} in {p}')
        nuance[title] = items

ids = [w['id'] for w in base['words']]
if set(adds) - set(ids):
    sys.exit(f'unknown word ids in add files: {sorted(set(adds) - set(ids))}')
titles = [s['title'] for s in base['situations']]
if set(nuance) - set(titles):
    sys.exit(f'unknown titles: {sorted(set(nuance) - set(titles))}')

sent_ko = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}


def segmentations(word, pieces, decoys):
    """word를 pieces로 쪼개는 방법 중 decoy를 하나 이상 쓰는 것이 있으면 그 하나를 돌려준다."""
    allp = set(pieces) | set(decoys)
    best = {0: [()]}
    for i in range(len(word)):
        if i not in best:
            continue
        for p in allp:
            if p and word.startswith(p, i):
                j = i + len(p)
                best.setdefault(j, [])
                for path in best[i]:
                    if len(best[j]) < 50:
                        best[j].append(path + (p,))
    for path in best.get(len(word), []):
        if any(p in decoys and p not in pieces for p in path):
            return path
    return None


problems = []
for w in base['words']:
    a = adds.get(w['id'])
    if not a:
        continue
    if set(a) - set(FIELDS):
        sys.exit(f'{w["id"]}: unexpected keys {set(a) - set(FIELDS)}')
    if 'exKo' not in a:
        if w['example'] in sent_ko:
            a['exKo'] = sent_ko[w['example']]
        else:
            problems.append(f"{w['id']}: no exKo and example not a sentence")
    for k in FIELDS:
        if k in a:
            w[k] = a[k]
    ch = a.get('chips') or []
    if any(not isinstance(c, str) for word in ch for c in word):
        problems.append(f"{w['id']}: non-string chip")
    elif ' '.join(''.join(c) for c in ch) != w['en']:
        problems.append(f"{w['id']}: chips {ch} != {w['en']!r}")
    flat = {c for word in ch for c in word}
    dec = a.get('decoyChips') or []
    if not dec:
        problems.append(f"{w['id']}: no decoyChips")
    if set(dec) & flat:
        problems.append(f"{w['id']}: decoy overlaps chips")
    if all(isinstance(c, str) for c in dec) and all(isinstance(c, str) for word in ch for c in word):
        for word in ch:
            seg = segmentations(''.join(word), [c for c in word], dec)
            if seg:
                problems.append(f"{w['id']}: decoys can re-spell {''.join(word)} as {seg}")
    for k in ('distractorsEn', 'distractorsKo'):
        if len(a.get(k) or []) != 2:
            problems.append(f"{w['id']}: {k} needs 2")
    if w['en'] in (a.get('distractorsEn') or []) or w['ko'] in (a.get('distractorsKo') or []):
        problems.append(f"{w['id']}: distractor equals answer")
    if w['en'].lower() in str(a.get('cue', '')).lower():
        problems.append(f"{w['id']}: cue contains en")
    if w['ko'] == a.get('cue'):
        problems.append(f"{w['id']}: cue equals ko")
    for k in ('distractorsEn', 'distractorsKo', 'decoyChips'):
        if any(not isinstance(x, str) for x in a.get(k) or []):
            problems.append(f"{w['id']}: non-string in {k}")

kos = collections.Counter(w['ko'] for w in base['words'])
for k, n in kos.items():
    if n > 1:
        problems.append(f"ko collision: {k} x{n}")
tags = collections.Counter(w.get('tag') for w in base['words'] if w.get('tag'))

for s in base['situations']:
    tagged = {w for x in s['sentences'] for w in x['words']}
    if len(tagged) < 8:
        sys.exit(f"V3: {s['title']} has {len(tagged)} distinct words")
    if s['title'] in nuance:
        s['nuance'] = nuance[s['title']]
        for n in s['nuance']:
            bad = set(n.get('words') or []) - tagged
            if bad:
                problems.append(f"{s['title']}: nuance {n['kind']} words not tagged here: {bad}")
            if n['kind'] == 'pair':
                rights = [p[1] for p in n['pairs']]
                lefts = [p[0] for p in n['pairs']]
                if len(set(rights)) != len(rights) or len(set(lefts)) != len(lefts):
                    problems.append(f"{s['title']}: pair dup")
                if set(n.get('decoys') or []) & set(rights):
                    problems.append(f"{s['title']}: pair decoy equals right")
            if n['kind'] == 'swap':
                if n['answer'] not in n['options'] or set(n['notes']) != set(n['options']):
                    problems.append(f"{s['title']}: swap options/notes mismatch")
            if n['kind'] == 'context':
                if sum(1 for sc in n['scenes'] if not sc['ok']) != 1:
                    problems.append(f"{s['title']}: context needs exactly one ok:false")

for p in problems:
    print('!!', p)
print(f'tags: {dict(tags)}')
print(f'words with v45: {len(adds)}/{len(ids)}; missing: {[i for i in ids if i not in adds][:15]}')
print(f'situations with nuance: {len(nuance)}/{len(titles)}; missing: {[t for t in titles if t not in nuance][:5]}')
kinds = collections.Counter(n['kind'] for s in base['situations'] for n in s.get('nuance') or [])
print(f'nuance kinds: {dict(kinds)}')
print(f'changes: {len(changes)}')

with io.open(f'{D}/{T}.yaml', 'w', encoding='utf-8') as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
with io.open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': T, 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
