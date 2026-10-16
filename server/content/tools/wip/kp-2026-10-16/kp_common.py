"""kp-2026-10-16 — keyPhrase 8문장 교체 스크립트들이 같이 쓰는 도우미."""
import io, os, yaml

MARK = 'keyPhrase 교체(2026-10-16 사용자 결정)'


def load(path):
    return yaml.safe_load(io.open(path, encoding='utf-8'))


def dump(doc, path):
    with io.open(path, 'w', encoding='utf-8') as f:
        yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=10000)


def sit(doc, title):
    for s in doc['situations']:
        if s['title'] == title:
            return s
    raise KeyError(title)


def sent(doc, title, index, old_en):
    s = sit(doc, title)['sentences'][index]
    assert s['en'] == old_en, (title, index, s['en'])
    return s


def word(doc, wid):
    for w in doc['words']:
        if w['id'] == wid:
            return w
    raise KeyError(wid)


def remove_word(doc, wid):
    before = len(doc['words'])
    doc['words'] = [w for w in doc['words'] if w['id'] != wid]
    assert len(doc['words']) == before - 1, wid


def nuance(doc, title, kind):
    ns = [n for n in sit(doc, title)['nuance'] if n['kind'] == kind]
    assert len(ns) == 1, (title, kind, len(ns))
    return ns[0]


def blank(answer, others):
    opts = [answer] + list(others)
    assert len(set(opts)) == 4
    return {'answer': answer, 'options': [{'en': o} for o in opts]}


def append_changes(path, changes):
    """changes-<주제>.yaml 끝에 이어 적는다. 이미 이번 표시가 있으면 다시 적지 않는다."""
    raw = io.open(path, encoding='utf-8').read()
    if MARK in raw:
        print('  changes: 이미 적혀 있음 — 건너뜀')
        return
    for c in changes:
        c['why'] = f"{MARK}: {c['why']}"
    text = yaml.safe_dump(changes, allow_unicode=True, sort_keys=False, width=10000)
    if not raw.endswith('\n'):
        raw += '\n'
    io.open(path, 'w', encoding='utf-8').write(raw + text)
    print(f'  changes: {len(changes)}건 추가')
