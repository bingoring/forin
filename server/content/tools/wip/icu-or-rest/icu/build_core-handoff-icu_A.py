#!/usr/bin/env python3
"""core-handoff-icu A — base에 v45 필드(단어)·nuance(상황)·결정 11 정리를 얹는다."""
import glob, os, yaml, copy
HERE = os.path.dirname(os.path.abspath(__file__))
TH = 'core-handoff-icu'
base = yaml.safe_load(open(f'{HERE}/base-{TH}.yaml', encoding='utf-8'))

COMMON = set('day hour minute time morning today'.split()) | {'doctor', 'family', 'hand', 'know', 'see', 'come', 'go'}
REMOVE = {}
for x in 'day hour minute time morning today doctor family hand know see come go'.split():
    REMOVE['w-' + x] = '공통 쉬운 단어'
for x in 'right left tomorrow tonight say again sorry sure need stand move second wait early help close stay liter blood first last wrong already'.split():
    REMOVE['w-' + x] = '너무 쉬움(목록 밖 판단)'
for x, why in {
    'back': "너무 쉬움이고 뜻이 문장마다 다름(되읽다의 back·돌아온·다시)",
    'give': "너무 쉬움이고 뜻이 문장마다 다름(투여하다·(인계를) 주다)",
    'start': '너무 쉬움(목록 밖 판단)',
    'get': "너무 쉬움이고 문장마다 뜻이 다름((당)하다)",
    'full': '너무 쉬움(목록 밖 판단)이고 뜻이 문장마다 다름(완전한·전체)',
    'once': "너무 쉬움이고 'at once'는 한 단어 뜻이 아님",
    'under': '너무 쉬움(목록 밖 판단)',
    'far': "'so far'는 구라서 낱말 far(지금까지)가 틀린 뜻",
    'rather': "'rather than'은 구라서 낱말 rather가 틀린 뜻",
    'down': "'down time'·'trending down'으로 뜻이 갈려 헤드워드 뜻과 안 맞음",
}.items():
    REMOVE['w-' + x] = why
KO = {
    'w-check': ('점검하다', "ko '확인하다'가 w-confirm과 같아 듣고 뜻 고르기에서 정답이 둘 — check는 '점검하다'로 가름"),
    'w-call': ('부르다·알리다', "문장은 '(사람을) 부르다'와 '(리듬을) 소리 내어 알리다(call out)' 둘이고, w-page(호출하다)와 구별"),
    'w-update': ('경과 설명', "명사 update는 '알려주기'보다 '경과 설명'이 자연스럽다"),
    'w-sick': ('위중한', "ICU 인계의 'sickest'는 '가장 위중한' — '아픈'은 약하다"),
    'w-band': ('팔찌', "'allergy band'는 알레르기 팔찌 — '밴드'만으로는 뜻이 흐리다"),
    'w-change': ('바꾸다·바뀌다', "문장이 '교체하다'와 '(상태가) 바뀌다' 둘이라 둘 다 담음"),
    'w-record': ('기록지', "ko '기록'이 w-document(기록하다)와 같아 정답이 둘 — record는 서류인 '기록지'로 가름"),
    'w-repeat': ('반복하다', "문장이 '다시 말하다'와 '재검·재촬영' 둘이라 '반복하다'로 넓힘"),
    'w-advance': ('단계적으로 올리다', "'advance her diet'는 식이를 단계적으로 올리는 일"),
    'w-support': ('보조·지지', "문장이 'pressure support(보조)'와 'gentle support(지지)' 둘이라 둘 다 담음"),
}
UNTAG = {  # (상황 번호, 문장 번호): [ids] — 헤드워드 뜻과 안 맞는 문장에서 태그만 뺀다
    (8, 0): ['w-lab'], (11, 1): ['w-pressure'], (18, 0): ['w-correct'], (20, 3): ['w-off'],
}
UNTAG_WHY = {
    'w-lab': "'cath lab'은 시술실이라 '검사'와 뜻이 달라 태그를 뺌",
    'w-pressure': "'pressure support'는 '압력'이라 헤드워드 '혈압'과 뜻이 달라 태그를 뺌",
    'w-correct': "'correct the handoff'는 동사(정정하다)라 헤드워드 형용사 '맞는'과 달라 태그를 뺌",
    'w-off': "'go off'는 '중단된'과 뜻이 달라 태그를 뺌",
}
NEW_WORD = dict(id='w-gothrough', en='go through', ipa='/ɡoʊ θruː/', ko='차례로 짚어 보다', icon='speech',
                example="Let's go through his SBAR from the top.")
NEW_TAG = {(0, 2): ['w-gothrough']}


def parse_chips(s):
    return [[p for p in w.split('+')] for w in s.split(' ')]


def load_words():
    data = {}
    for fn in sorted(glob.glob(f'{HERE}/add_{TH}_A_words_*.txt')):
        for ln in open(fn, encoding='utf-8').read().splitlines():
            if not ln.strip() or ln.startswith('#'): continue
            p = ln.split('|')
            assert len(p) == 8, ln
            wid, exko, cue, tag, de, dk, ch, dc = p
            assert wid not in data, wid
            data[wid] = dict(exKo=exko, cue=cue, tag=tag, distractorsEn=de.split(';'), distractorsKo=dk.split(';'),
                             chips=parse_chips(ch), decoyChips=dc.split(';'))
    return data


def load_nuance():
    out = {}
    for fn in sorted(glob.glob(f'{HERE}/add_{TH}_A_nuance_*.yaml')):
        for sit in yaml.safe_load(open(fn, encoding='utf-8')):
            assert sit['title'] not in out, sit['title']
            out[sit['title']] = sit['nuance']
    return out


def main():
    doc = copy.deepcopy(base)
    words = load_words(); nuance = load_nuance()
    changes = []
    removed = set(REMOVE)
    for si, s in enumerate(doc['situations']):
        for i, x in enumerate(s['sentences']):
            before = list(x['words'])
            ut = set(UNTAG.get((si, i), []))
            x['words'] = [w for w in x['words'] if w not in removed and w not in ut]
            for w in NEW_TAG.get((si, i), []):
                x['words'].append(w)
            if x['words'] != before:
                gone = [w for w in before if w not in x['words']]
                new = [w for w in x['words'] if w not in before]
                why = ''
                if gone: why += '태그 뺌: ' + ', '.join(g[2:] for g in gone)
                if new: why += ('; ' if why else '') + '태그 더함: ' + ', '.join(n[2:] for n in new)
                changes.append(dict(kind='sentence', situation=s['title'], index=i, fields=['words'], why=why))
    used = {w for s in doc['situations'] for x in s['sentences'] for w in x['words']}
    newwords = []
    for w in doc['words']:
        wid = w['id']
        if wid in removed:
            changes.append(dict(kind='word-remove', id=wid, why=REMOVE[wid])); continue
        assert wid in used, f'{wid} untagged but not removed'
        if wid in KO:
            w['ko'] = KO[wid][0]
            changes.append(dict(kind='word', id=wid, fields=['ko'], why=KO[wid][1]))
        d = words.get(wid)
        if d is None:
            print('MISSING data for', wid, w['en']); newwords.append(w); continue
        w.update(d)
        newwords.append(w)
        if wid == 'w-sbar':
            nw = dict(NEW_WORD); nw.update(words['w-gothrough'])
            newwords.append(nw)
            changes.append(dict(kind='word-add', id='w-gothrough', why="인계 시작 문장 'Let's go through his SBAR'에 이미 있는 구 — 쉬운 낱말을 뺀 뒤 상황 0의 서로 다른 단어 수(V3)를 8개로 맞추려고 새로 만듦"))
    doc['words'] = newwords
    for s in doc['situations']:
        s['nuance'] = nuance.get(s['title'], [])
        if s['title'] not in nuance: print('MISSING nuance', s['title'])
    extra = set(words) - {w['id'] for w in doc['words']}
    if extra: print('data for unknown/removed ids:', extra)
    yaml.safe_dump(doc, open(f'{HERE}/{TH}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
    yaml.safe_dump(dict(theme=TH, changes=changes), open(f'{HERE}/changes-{TH}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
    print('words', len(doc['words']), 'changes', len(changes))


if __name__ == '__main__':
    main()
