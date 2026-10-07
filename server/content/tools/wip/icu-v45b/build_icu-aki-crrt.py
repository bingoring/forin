#!/usr/bin/env python3
"""icu-aki-crrt v45 보강 빌드. base 를 읽어 정리(cleanup) → v45 단어 필드 → 뉘앙스를 얹는다.

    python3 build_icu-aki-crrt.py          # 출력 + 자체 검사
    python3 build_icu-aki-crrt.py --grid   # pair 격자·swap 이어 읽기도 출력
"""
import copy, glob, io, os, re, sys
from collections import Counter, defaultdict
import yaml

T = "icu-aki-crrt"
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v  # noqa: E402

V45 = ['exKo', 'cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips']


def load(p):
    return yaml.safe_load(io.open(p, encoding='utf-8'))


def main():
    grid = '--grid' in sys.argv
    base = load(f'{D}/base-{T}.yaml')
    doc = copy.deepcopy(base)
    cl = load(f'{D}/cleanup_{T}.yaml')
    changes = []
    sits = doc['situations']
    bank = {w['id']: w for w in doc['words']}

    # --- 문장 태그 정리 ---------------------------------------------------
    sent_why = defaultdict(list)   # (si, k) -> [why]
    sent_fields = defaultdict(set)
    for wid, why in cl['untag_everywhere'].items():
        for si, s in enumerate(sits):
            for k, x in enumerate(s['sentences']):
                if wid in x['words']:
                    x['words'] = [w for w in x['words'] if w != wid]
                    sent_why[(si, k)].append(f'쉬운 {wid} 태그를 뺐다')
                    sent_fields[(si, k)].add('words')
    for si, k, wid, why in cl.get('untag_at', []):
        x = sits[si]['sentences'][k]
        assert wid in x['words'], (si, k, wid)
        x['words'] = [w for w in x['words'] if w != wid]
        sent_why[(si, k)].append(why)
        sent_fields[(si, k)].add('words')
    for si, k, wid, why in cl.get('tag_at', []):
        x = sits[si]['sentences'][k]
        assert wid not in x['words'] and wid in bank, (si, k, wid)
        x['words'].append(wid)
        sent_why[(si, k)].append(why)
        sent_fields[(si, k)].add('words')
    for si, k, ko, why in cl.get('sentence_ko', []):
        x = sits[si]['sentences'][k]
        x['ko'] = ko
        sent_why[(si, k)].append(why)
        sent_fields[(si, k)].add('ko')
    for (si, k), whys in sorted(sent_why.items()):
        changes.append({'kind': 'sentence', 'situation': sits[si]['title'], 'index': k,
                        'fields': sorted(sent_fields[(si, k)]), 'why': '; '.join(whys)})

    # --- 단어 필드 수정 ---------------------------------------------------
    for wid, ed in cl['word_edits'].items():
        w = bank[wid]
        fields = []
        for f in ('en', 'ko', 'ipa', 'icon', 'example'):
            if f in ed and ed[f] != w[f]:
                w[f] = ed[f]
                fields.append(f)
        assert fields, wid
        changes.append({'kind': 'word', 'id': wid, 'fields': fields, 'why': ed['why']})

    # --- 쓰이지 않게 된 단어 제거 ------------------------------------------
    used = Counter(w for s in sits for x in s['sentences'] for w in x['words'])
    removed = [w['id'] for w in doc['words'] if not used[w['id']]]
    for wid in removed:
        why = cl['untag_everywhere'].get(wid) or cl.get('remove_why', {}).get(wid, '어느 문장도 태그하지 않게 됐다')
        changes.append({'kind': 'word-remove', 'id': wid, 'why': f'{why} — 어느 문장도 태그하지 않게 됐다'
                        if wid in cl['untag_everywhere'] else why})
    doc['words'] = [w for w in doc['words'] if used[w['id']]]
    bank = {w['id']: w for w in doc['words']}

    # --- v45 단어 필드 ----------------------------------------------------
    add = {}
    for p in sorted(glob.glob(f'{D}/add_{T}_words_*.yaml')):
        for wid, f in (load(p) or {}).items():
            assert wid not in add, f'dup {wid} in {p}'
            add[wid] = f
    sent_ko = {}
    for s in sits:
        for x in s['sentences']:
            sent_ko.setdefault(x['en'], x['ko'])
    for wid in add:
        assert wid in bank, f'unknown/removed id in add files: {wid}'
    for w in doc['words']:
        f = add.get(w['id'])
        if not f:
            continue
        exko = f.get('exKo') or sent_ko.get(w['example'])
        assert exko, f'{w["id"]}: no exKo and example not a sentence'
        w['exKo'] = exko
        for k in V45[1:]:
            w[k] = f[k]

    # --- 뉘앙스 -----------------------------------------------------------
    nu = {}
    for p in sorted(glob.glob(f'{D}/add_{T}_nuance_*.yaml')):
        for title, items in (load(p) or {}).items():
            assert title not in nu, title
            nu[title] = items
    titles = {s['title'] for s in sits}
    for t in nu:
        assert t in titles, f'unknown title {t}'
    for s in sits:
        if s['title'] in nu:
            s['nuance'] = nu[s['title']]

    # --- 쓰기 -------------------------------------------------------------
    out = yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, width=1000)
    io.open(f'{D}/{T}.yaml', 'w', encoding='utf-8').write(out)
    io.open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8').write(
        yaml.safe_dump({'theme': T, 'changes': changes}, allow_unicode=True, sort_keys=False, width=1000))

    # --- 자체 검사 --------------------------------------------------------
    probs = []
    reserved = re.compile(r"(^|\s|\[|,)(on|off|no|yes|y|n|true|false|null)(\s*$|,|\])", re.I)
    for ln in out.splitlines():
        m = re.search(r'(?:^\s*- |: )(on|off|no|yes|y|n|true|false|null)\s*$', ln, re.I)
        if m and not re.search(r'(^|\s)(ok|swap): (true|false)\s*$', ln):
            probs.append(f'bare reserved word: {ln.strip()}')
    reread = yaml.safe_load(out)
    for w in reread['words']:
        for k in ('distractorsEn', 'distractorsKo', 'decoyChips'):
            for o in w.get(k, []) or []:
                if not isinstance(o, str):
                    probs.append(f'{w["id"]}.{k} non-string {o!r}')
    done = [w for w in doc['words'] if 'cue' in w]
    for w in done:
        for r, msg in v.check_word_v45(w):
            probs.append(f'{r} {msg}')
        # 오답 조각으로 정답 철자 재조립
        frags = [c for word in w['chips'] for c in word] + list(w['decoyChips'])
        target = w['en'].replace(' ', '').lower()
        canon = tuple(c.lower() for word in w['chips'] for c in word)
        paths = set()

        def dfs(rest, usedset, path):
            if not rest:
                paths.add(tuple(path))
                return
            for i, fr in enumerate(frags):
                fl = fr.lower()
                if i not in usedset and fl and rest.startswith(fl):
                    dfs(rest[len(fl):], usedset | {i}, path + [fl])
        dfs(target, frozenset(), [])
        alt = [p for p in paths if p != canon]
        if alt:
            probs.append(f'{w["id"]}: decoy re-assembly {alt}')
        if w['en'].lower() in w['cue'].lower():
            probs.append(f'{w["id"]}: cue has answer')
    # 같은 ko
    kos = defaultdict(list)
    for w in doc['words']:
        kos[w['ko']].append(w['id'])
    dupko = {k: ids for k, ids in kos.items() if len(ids) > 1}
    # 오답 ko가 은행의 다른 단어 ko와 같아서 정답이 둘?(그 단어 자체 ko와 같으면)
    for w in done:
        for o in w['distractorsKo']:
            if o == w['ko']:
                probs.append(f'{w["id"]}: distractorKo == ko')
        for o in w['distractorsEn']:
            if o.lower() == w['en'].lower():
                probs.append(f'{w["id"]}: distractorEn == en')
    tags = Counter(w['tag'] for w in done)

    if grid:
        for s in sits:
            for i, n in enumerate(s.get('nuance', [])):
                if n['kind'] == 'pair':
                    L = [p[0] for p in n['pairs']]
                    R = [p[1] for p in n['pairs']] + list(n['decoys'])
                    print(f'[pair] {s["title"]}#{i}')
                    for l in L:
                        print('    ', ' | '.join(f'{l} {r}' for r in R))
                if n['kind'] == 'swap':
                    b = n['before']
                    print(f'[swap] {s["title"]}#{i}')
                    for o in n['options']:
                        print('    ', repr(b[0] + o + b[2]), '<-' if o == n['answer'] else '')

    kinds = Counter(n['kind'] for s in sits for n in s.get('nuance', []))
    ck = Counter(c['kind'] for c in changes)
    print(f'words {len(doc["words"])} (v45 filled {len(done)}), situations {len(sits)}, '
          f'nuance {sum(kinds.values())} {dict(kinds)}')
    print(f'changes {len(changes)} {dict(ck)}; removed {removed}')
    print(f'tags {dict(tags)}')
    if dupko:
        print('dup ko:', dupko)
    missing = [w['id'] for w in doc['words'] if 'cue' not in w]
    print(f'missing v45: {len(missing)} {missing[:12]}')
    for p in probs:
        print('  PROB', p)
    print('self-check problems:', len(probs))


if __name__ == '__main__':
    main()
