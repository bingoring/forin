"""kp-2026-10-30c — OR 묶음 1 keyPhrase 결정과 keyPhrase chunks 다시 자르기 교체 스크립트들이 같이 쓰는 도우미."""
import io, os, yaml

MARK = 'keyPhrase 교체(2026-10-30 사용자 결정)'


def load(path):
    return yaml.safe_load(io.open(path, encoding='utf-8'))


def dump(doc, path):
    with io.open(path, 'w', encoding='utf-8') as f:
        yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=10000)


def sit(doc, index, title):
    s = doc['situations'][index]
    assert s['title'] == title, (index, s['title'], title)
    return s


def sent(doc, si, title, index, old_en):
    s = sit(doc, si, title)['sentences'][index]
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


def blank(answer, others):
    opts = [answer] + list(others)
    assert len(set(opts)) == 4
    return {'answer': answer, 'options': [{'en': o} for o in opts]}


def join_chunks(chunks):
    out = ''
    for c in chunks:
        if not out or c[:1] in ',.?!;':
            out += c
        else:
            out += ' ' + c
    return out


def replace(doc, ch, si, title, index, old_en, new, fields, why):
    """문장 하나를 바꾸고, 옛 문장을 example로 쓰던 단어를 새 문장으로 옮긴다.

    새 문장의 words에 없는 단어는 `moved` 사전(id → (en, ko))으로 다른 문장에 옮겨야 한다 —
    없으면 멈춘다(어느 예문도 옛 문장에 남지 않게).
    """
    moved = new.pop('_moved', {})
    s = sent(doc, si, title, index, old_en)
    s.update(new)
    assert join_chunks(s['chunks']) == s['en'], (join_chunks(s['chunks']), s['en'])
    ch.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': fields, 'why': why})
    for w in doc['words']:
        if w.get('example') != old_en:
            continue
        if w['id'] in s['words']:
            w['example'], w['exKo'] = s['en'], s['ko']
            ch.append({'kind': 'word', 'id': w['id'], 'fields': ['example'], 'why': '예문을 바꾼 문장으로'})
        else:
            assert w['id'] in moved, f"{w['id']}: 새 문장에 없음 — moved로 옮길 문장을 주세요"
            w['example'], w['exKo'] = moved[w['id']]
            ch.append({'kind': 'word', 'id': w['id'], 'fields': ['example'],
                       'why': '옛 예문 문장을 바꿔 그 단어가 없어짐 — 같은 상황의 다른 문장으로 옮김'})
    return s


def check(doc, olds):
    """옛 문장이 파일 어디에도 남지 않았는지, 은행 단어가 모두 쓰이는지 본다."""
    raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
    for o in olds:
        assert o not in raw, f'옛 문장이 남아 있음: {o}'
    used = {w for s in doc['situations'] for se in s['sentences'] for w in se['words']}
    unused = [w['id'] for w in doc['words'] if w['id'] not in used]
    assert not unused, f'안 쓰이는 단어: {unused}'


def append_changes(path, changes):
    """changes-<주제>.yaml 끝에 이번 변경을 이어 적는다. 다시 돌리면 이번 표시가 붙은 꼬리를 떼고 새로 적는다."""
    raw = io.open(path, encoding='utf-8').read()
    lines = raw.split('\n')
    cut = None
    for i, l in enumerate(lines):
        if l.startswith('- kind:') and cut is None:
            j = i + 1
            while j < len(lines) and not lines[j].startswith('- '):
                if MARK in lines[j]:
                    cut = i
                    break
                j += 1
    if cut is not None:
        raw = '\n'.join(lines[:cut]) + '\n'
        print('  changes: 지난번 이번 표시 꼬리를 떼고 다시 적음')
    for c in changes:
        c['why'] = f"{MARK}: {c['why']}"
    text = yaml.safe_dump(changes, allow_unicode=True, sort_keys=False, width=10000)
    if not raw.endswith('\n'):
        raw += '\n'
    io.open(path, 'w', encoding='utf-8').write(raw + text)
    print(f'  changes: {len(changes)}건 추가')
