#!/usr/bin/env python3
"""core-family-icu v45 보강: base에 결정 11 정리를 적용하고, 단어 v45 필드와 상황 nuance를 얹는다.
changes-core-family-icu.yaml 은 edits 파일에서 자동으로 만든다."""
import collections, glob, io, sys, yaml

D = '/tmp/lesson-icu-v45b'
T = 'core-family-icu'
FIELDS = ("exKo", "cue", "tag", "distractorsEn", "distractorsKo", "chips", "decoyChips")


def load(p):
    return yaml.safe_load(io.open(p, encoding='utf-8')) or {}


base = load(f'{D}/base-{T}.yaml')
edits = load(f'{D}/add_{T}_edits.yaml')
changes = []
stats = collections.Counter()
sit_by_title = {s['title']: s for s in base['situations']}

# 0) 문장 단위 태그 빼기 / ko 고치기
for e in edits.get('sentence_untag') or []:
    x = sit_by_title[e['situation']]['sentences'][e['index']]
    for w in e['remove']:
        if w not in x['words']:
            sys.exit(f"sentence_untag: {w} not in {e['situation']}[{e['index']}]")
    x['words'] = [w for w in x['words'] if w not in e['remove']]
    changes.append({'kind': 'sentence', 'situation': e['situation'], 'index': e['index'], 'fields': ['words'], 'why': e['why']})
    stats['sentence'] += 1
for e in edits.get('sentence_ko') or []:
    x = sit_by_title[e['situation']]['sentences'][e['index']]
    x['ko'] = e['ko']
    changes.append({'kind': 'sentence', 'situation': e['situation'], 'index': e['index'], 'fields': ['ko'], 'why': e['why']})
    stats['sentence'] += 1

# 1) 쉬운 단어 태그 빼기 → 은행에서 지우기
untag = edits.get('untag') or {}
for s in base['situations']:
    for i, x in enumerate(s['sentences']):
        hit = [w for w in x['words'] if w in untag]
        if hit:
            x['words'] = [w for w in x['words'] if w not in untag]
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': i, 'fields': ['words'],
                            'why': f"쉬운 단어 태그 제거: {', '.join(hit)}"})
            stats['sentence-untag-easy'] += 1
still = {w for s in base['situations'] for x in s['sentences'] for w in x['words']}
for wid, why in untag.items():
    if wid in still:
        sys.exit(f'{wid} still tagged')
    if wid not in [w['id'] for w in base['words']]:
        sys.exit(f'untag unknown {wid}')
    base['words'] = [w for w in base['words'] if w['id'] != wid]
    changes.append({'kind': 'word-remove', 'id': wid, 'why': f'{why} — 어느 문장도 태그하지 않게 됐다'})
    stats['word-remove'] += 1
# 태그가 하나도 안 남은 단어가 있으면 멈춘다
orphan = [w['id'] for w in base['words'] if w['id'] not in still]
if orphan:
    sys.exit(f'orphan words (untagged everywhere): {orphan}')

# 2) 단어 필드 수정
wmap = {w['id']: w for w in base['words']}
for wid, e in (edits.get('word_fields') or {}).items():
    w = wmap[wid]
    for k, v in e['set'].items():
        if k not in ('en', 'ko', 'ipa', 'icon', 'example'):
            sys.exit(f'bad field {k}')
        w[k] = v
        stats[f'word-{k}'] += 1
    changes.append({'kind': 'word', 'id': wid, 'fields': list(e['set']), 'why': e['why']})

# 3) 새 단어(있으면)
for e in edits.get('word_add') or []:
    why = e.pop('why')
    base['words'].append(e)
    changes.append({'kind': 'word-add', 'id': e['id'], 'why': why})
    stats['word-add'] += 1

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


def respell(en, frags, decoys):
    """조각(정답+오답) 집합으로 en을 만들 수 있는 길 중 오답 조각을 쓰는 길이 있는가."""
    pieces = set(frags) | set(decoys)
    target = en.replace(' ', '')
    found = []

    def go(pos, used_decoy, path):
        if found:
            return
        if pos == len(target):
            if used_decoy:
                found.append(path)
            return
        for p in pieces:
            if p and target.startswith(p, pos):
                go(pos + len(p), used_decoy or (p in decoys and p not in frags), path + [p])
    go(0, False, [])
    return found


problems = []
kos = collections.defaultdict(list)
for w in base['words']:
    kos[w['ko']].append(w['id'])
for k, v in kos.items():
    if len(v) > 1:
        problems.append(f'same ko {k!r}: {v}')
bank_ko = {w['ko'] for w in base['words']}
for w in base['words']:
    a = adds.get(w['id'])
    if not a:
        continue
    if set(a) - set(FIELDS):
        sys.exit(f'{w["id"]}: unexpected keys {set(a) - set(FIELDS)}')
    for k in FIELDS:
        if k in a:
            w[k] = a[k]
    ch = a.get('chips') or []
    if ' '.join(''.join(c) for c in ch) != w['en']:
        problems.append(f"{w['id']}: chips {ch} != {w['en']!r}")
    flat = {c for word in ch for c in word}
    dec = set(a.get('decoyChips') or [])
    if dec & flat:
        problems.append(f"{w['id']}: decoy overlaps chips")
    r = respell(w['en'], flat, dec)
    if r:
        problems.append(f"{w['id']}: decoys re-spell answer: {r[0]}")
    if w['en'] in (a.get('distractorsEn') or []) or w['ko'] in (a.get('distractorsKo') or []):
        problems.append(f"{w['id']}: distractor equals answer")
    for dk in a.get('distractorsKo') or []:
        if dk in bank_ko and False:  # 다른 은행 단어의 뜻을 오답으로 쓰는 건 괜찮다
            problems.append(f"{w['id']}: distractorKo {dk!r} is another bank word's ko")
    if w['en'].lower() in str(a.get('cue', '')).lower():
        problems.append(f"{w['id']}: cue contains en")
    for k in ('distractorsEn', 'distractorsKo', 'decoyChips'):
        if any(not isinstance(x, str) for x in a.get(k) or []):
            problems.append(f"{w['id']}: non-string in {k}")
        if len(a.get(k) or []) != (2 if k != 'decoyChips' else len(a.get(k) or [])):
            problems.append(f"{w['id']}: {k} count")

# 예문이 문장 en과 글자 그대로 같으면 exKo를 그 문장의 ko로 맞춘다
sent_ko = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}
for w in base['words']:
    if w['example'] in sent_ko and w.get('exKo') != sent_ko[w['example']]:
        w['exKo'] = sent_ko[w['example']]
        stats['exKo-aligned'] += 1

kind_count = collections.Counter()
for s in base['situations']:
    tagged = {w for x in s['sentences'] for w in x['words']}
    if len(tagged) < 8:
        sys.exit(f"V3: {s['title']} has {len(tagged)} distinct words")
    if s['title'] in nuance:
        s['nuance'] = nuance[s['title']]
        for n in s['nuance']:
            kind_count[n['kind']] += 1
            bad = set(n.get('words') or []) - tagged
            if bad:
                problems.append(f"{s['title']}: nuance {n['kind']} words not tagged here: {bad}")
            if n['kind'] == 'swap':
                for o in n['options']:
                    print(f"   swap[{s['title']}]: {n['before'][0]}{o}{n['before'][2]}")

tags = collections.Counter(w.get('tag') for w in base['words'] if w.get('tag'))
for p in problems:
    print('!!', p)
print(f'words with v45: {len(adds)}/{len(ids)}; missing: {[i for i in ids if i not in adds][:15]}')
print(f'situations with nuance: {len(nuance)}/{len(titles)}; missing: {[t for t in titles if t not in nuance]}')
print(f'nuance by kind: {dict(kind_count)}  total {sum(kind_count.values())}')
print(f'tags: {dict(tags)}')
print(f'changes: {len(changes)}  stats: {dict(stats)}')

RESERVED = {'y', 'n', 'Y', 'N', 'yes', 'no', 'on', 'off', 'true', 'false', 'null', 'Yes', 'No', 'On', 'Off'}


def _str(dumper, data):
    if data in RESERVED:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='"')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)


yaml.SafeDumper.add_representer(str, _str)
with io.open(f'{D}/{T}.yaml', 'w', encoding='utf-8') as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
with io.open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': T, 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
