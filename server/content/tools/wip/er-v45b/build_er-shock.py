#!/usr/bin/env python3
"""er-shock v45 보강 빌드. base-er-shock.yaml 위에
  1) add_er-shock_cleanup.yaml (결정 11 정리)
  2) add_er-shock_words_*.yaml (단어 v45 필드, id로 맞춤)
  3) add_er-shock_nuance_*.yaml (상황 제목 -> nuance 목록)
을 얹어 er-shock.yaml 과 changes-er-shock.yaml 을 만든다.
"""
import copy, glob, os, sys
import yaml

D = '/tmp/lesson-er-v45b'
T = 'er-shock'
base = yaml.safe_load(open(f'{D}/base-{T}.yaml', encoding='utf-8'))
clean = yaml.safe_load(open(f'{D}/add_{T}_cleanup.yaml', encoding='utf-8'))

doc = copy.deepcopy(base)
errors, warns = [], []
changes = []

# ---------- 1. 결정 11 ----------
sit_by_title = {s['title']: s for s in doc['situations']}
for e in clean.get('sentence_edits', []):
    s = sit_by_title[e['situation']]
    sent = s['sentences'][e['index']]
    fields = []
    if e.get('untag') or e.get('tag'):
        ws = [w for w in sent['words'] if w not in (e.get('untag') or [])]
        for w in e.get('tag') or []:
            if w not in ws:
                ws.append(w)
        for u in e.get('untag') or []:
            if u not in sent['words']:
                errors.append(f"untag {u} not on {e['situation']}[{e['index']}]")
        sent['words'] = ws
        fields.append('words')
    if e.get('ko'):
        sent['ko'] = e['ko']
        fields.append('ko')
    why = e.get('why') or ('쉬운 ' + '·'.join(e.get('untag')) + ' 태그를 뺐다')
    changes.append({'kind': 'sentence', 'situation': e['situation'], 'index': e['index'],
                    'fields': fields, 'why': why})

words = doc['words']
wmap = {w['id']: w for w in words}
for wid, ed in clean.get('word_edits', {}).items():
    w = wmap[wid]
    for k, v in ed['set'].items():
        if w.get(k) == v:
            errors.append(f'word edit {wid}.{k} is a no-op')
        w[k] = v
    changes.append({'kind': 'word', 'id': wid, 'fields': list(ed['set'].keys()), 'why': ed['why']})
for wa in clean.get('word_add', []):
    words.append(dict(wa['word']))
    changes.append({'kind': 'word-add', 'id': wa['word']['id'], 'why': wa['why']})
used = set()
for s in doc['situations']:
    for t in s['sentences']:
        used.update(t['words'])
for wid, why in clean.get('word_remove', {}).items():
    if wid in used:
        errors.append(f'remove {wid} but still tagged')
    changes.append({'kind': 'word-remove', 'id': wid, 'why': why})
words[:] = [w for w in words if w['id'] not in clean.get('word_remove', {})]
wmap = {w['id']: w for w in words}
for wid in used:
    if wid not in wmap:
        errors.append(f'tagged id {wid} not in bank')
for w in words:
    if w['id'] not in used:
        errors.append(f'bank word {w["id"]} unused')

# ---------- 2. 단어 v45 ----------
sent_ko = {}
for s in doc['situations']:
    for t in s['sentences']:
        sent_ko.setdefault(t['en'], t['ko'])
add = {}
for f in sorted(glob.glob(f'{D}/add_{T}_words_*.yaml')):
    for wid, v in (yaml.safe_load(open(f, encoding='utf-8')) or {}).items():
        if wid in add:
            errors.append(f'{wid} twice in word files')
        add[wid] = v
V45 = ['exKo', 'cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips']
for w in words:
    a = add.get(w['id'])
    if a is None:
        warns.append(f'no v45 for {w["id"]}')
        continue
    a = dict(a)
    if 'exKo' not in a:
        if w['example'] in sent_ko:
            a['exKo'] = sent_ko[w['example']]
        else:
            errors.append(f'{w["id"]}: example not a sentence and no exKo')
    for k in V45:
        if k in a:
            w[k] = a[k]
for wid in add:
    if wid not in wmap:
        errors.append(f'v45 data for unknown id {wid}')


def spellings(target, frags, start=0, path=()):
    """target을 frags로 빈틈없이 만드는 모든 경로."""
    if start == len(target):
        yield path
        return
    for f in frags:
        if f and target.startswith(f, start):
            yield from spellings(target, frags, start + len(f), path + (f,))


for w in words:
    if 'chips' not in w:
        continue
    en = w['en']
    joined = ' '.join(''.join(x) for x in w['chips'])
    if joined != en:
        errors.append(f'{w["id"]}: chips join {joined!r} != {en!r}')
    own = [f for x in w['chips'] for f in x]
    for d in w['decoyChips']:
        if d in own:
            errors.append(f'{w["id"]}: decoy {d!r} is an own fragment')
    # 낱말마다: 정답 조각+오답 조각으로 정답 낱말을 다른 경로로 만들 수 있으면 안 된다
    allf = set(own) | set(w['decoyChips'])
    for x in w['chips']:
        word = ''.join(x)
        paths = set(spellings(word, allf))
        bad = [p for p in paths if p != tuple(x)]
        if bad:
            errors.append(f'{w["id"]}: decoys re-spell {word!r}: {bad[:3]}')
    if len(own) > 6:
        errors.append(f'{w["id"]}: >6 fragments')
    if en.lower() in w['cue'].lower():
        errors.append(f'{w["id"]}: cue contains answer')
    for k in ('distractorsEn', 'distractorsKo'):
        o = w[k]
        if len(o) != 2 or len(set(o)) != 2:
            errors.append(f'{w["id"]}: {k} needs 2 distinct')
    if en in w['distractorsEn'] or w['ko'] in w['distractorsKo']:
        errors.append(f'{w["id"]}: distractor equals answer')
    # 은행 안의 다른 단어 ko가 오답으로 들어갔는지(정답이 될 위험) — 경고
    for o in w['distractorsKo']:
        for w2 in words:
            if w2 is not w and w2['ko'] == o:
                warns.append(f'{w["id"]}: distractorsKo {o!r} is bank word {w2["id"]} ko')

# 은행 안 ko 중복
seen = {}
for w in words:
    if w['ko'] in seen:
        warns.append(f'same ko {w["ko"]!r}: {seen[w["ko"]]} / {w["id"]}')
    seen[w['ko']] = w['id']

# ---------- 3. 뉘앙스 ----------
nu = {}
for f in sorted(glob.glob(f'{D}/add_{T}_nuance_*.yaml')):
    for title, items in (yaml.safe_load(open(f, encoding='utf-8')) or {}).items():
        if title not in sit_by_title:
            errors.append(f'nuance for unknown situation {title!r}')
        nu[title] = items
for s in doc['situations']:
    ids = {w for t in s['sentences'] for w in t['words']}
    if len(ids) < 8:
        errors.append(f'{s["title"]}: only {len(ids)} distinct words')
    if s['title'] in nu:
        s['nuance'] = nu[s['title']]
        for i, n in enumerate(s['nuance']):
            if n['kind'] == 'slider' and 'exKo' not in n:
                if n.get('example') in sent_ko:
                    n['exKo'] = sent_ko[n['example']]
                else:
                    errors.append(f'{s["title"]} slider: no exKo')
            for wid in n.get('words', []):
                if wid not in ids:
                    errors.append(f'{s["title"]} nuance[{i}]: {wid} not in situation')
            if n['kind'] == 'swap':
                for o in n['options']:
                    if o not in n['notes']:
                        errors.append(f'{s["title"]} swap: no note for {o!r}')
    else:
        warns.append(f'no nuance: {s["title"]}')

# ---------- 출력 ----------
RESERVED = {'on', 'off', 'no', 'yes', 'y', 'n', 'true', 'false', 'null', '~', ''}


class Dumper(yaml.SafeDumper):
    pass


def str_rep(dumper, data):
    if data.lower() in RESERVED:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='"')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)


Dumper.add_representer(str, str_rep)


def dump(obj, path):
    with open(path, 'w', encoding='utf-8') as fh:
        yaml.dump(obj, fh, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=10000)


dump(doc, f'{D}/{T}.yaml')
dump({'theme': T, 'changes': changes}, f'{D}/changes-{T}.yaml')

for s in doc['situations']:
    ids = {w for t in s['sentences'] for w in t['words']}
    kinds = [n['kind'] for n in s.get('nuance', [])]
    print(f'{len(ids):3d}  {s["title"]}  {kinds}')
print(f'words {len(words)} · changes {len(changes)}')
for x in warns:
    print('  [warn]', x)
for x in errors:
    print('  [ERR]', x)
sys.exit(1 if errors else 0)
