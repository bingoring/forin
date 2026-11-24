#!/usr/bin/env python3
"""core-language-icu A — base에 v45 필드(단어)·nuance(상황)·결정 11 정리를 얹는다."""
import glob, os, yaml, copy
HERE = os.path.dirname(os.path.abspath(__file__))
TH = 'core-language-icu'
base = yaml.safe_load(open(f'{HERE}/base-{TH}.yaml', encoding='utf-8'))

COMMON = 'minute time now doctor family mother father body hand know see come zero ten'.split()
REMOVE = {}
for x in COMMON:
    REMOVE['w-' + x] = '공통 쉬운 단어'
EXTRA = {
    'right': "너무 쉬움(목록 밖 판단)이고 뜻이 문장마다 다름(바로·맞는)",
    'away': "너무 쉬움(목록 밖 판단) — 'right away'의 한 조각",
    'yes': '너무 쉬움(목록 밖 판단)',
    'no': '너무 쉬움(목록 밖 판단)이고 뜻이 문장마다 다름(아니오·없는)',
    'one': '너무 쉬움(목록 밖 판단)이고 뜻이 문장마다 다름(하나·한 번·한 분)',
    'two': '너무 쉬움(목록 밖 판단)',
    'here': '너무 쉬움(목록 밖 판단)',
    'again': '너무 쉬움(목록 밖 판단)',
    'down': "너무 쉬움이고 'write it down'의 조각이라 낱말 뜻(적어서)이 흐림",
    'same': "'on the same page'의 조각이라 낱말로는 뜻이 안 맞음 — page를 구로 바꾸며 뺌",
}
for x, why in EXTRA.items():
    REMOVE['w-' + x] = why

KO = {
    'w-line': ('회선', "전화선보다 통화 연결선·회선이 문장('on the line', 'phone interpreter line')에 맞음"),
    'w-worst': ('가장 심한', "'worst pain'은 최악이 아니라 통증 척도에서 가장 심한 정도"),
    'w-fast': ('빠르게', "'going too fast'는 부사 — 헤드워드 뜻도 부사로"),
    'w-open': ('(눈을) 뜨다', "'open your eyes'에 맞춰 '뜨다'를 눈 뜨기로 분명히"),
    'w-keep': ('유지하다', "문장이 '안전하게 지키다'와 '계속하다' 둘이라 '유지하다'로 아우름"),
    'w-once': ('한 번', "띄어쓰기 바로잡음"),
    'w-call': ('부르다·전화하다', "문장이 '(통역사를) 부르다'와 '(번호로) 전화하다' 둘"),
    'w-lead': ('주도', "'follow your lead'의 명사 — '이끎'보다 '주도'가 자연스러움"),
    'w-hold': ('버티다', "'hold on'은 견디다보다 '버티다'"),
    'w-test': ('점검해 보다', "'test the connection'은 시험이 아니라 점검"),
    'w-more': ('더', "형용사 '더 많은'보다 부사 '더'가 문장 전체(more help·more slowly·more about·once more)에 맞음"),
    'w-print': ('인쇄체', "'large-print'는 인쇄 글씨체 — '인쇄'만으로는 흐림"),
    'w-much': ('그렇게 많이', "ko '많이'가 w-lot과 같아 듣고 뜻 고르기에서 정답이 둘 — much는 'so much'로 가름"),
    'w-sense': ('이해가 됨', "'make sense'는 '의미가 통함'보다 '이해가 됨'이 자연스러움"),
    'w-talk': ('이야기하다', "ko '말하다'가 w-speak·w-say와 같아 정답이 셋 — talk는 '이야기하다'로 가름"),
    'w-say': ('말씀드리다', "ko '말하다'가 w-speak·w-talk와 같아 정답이 셋 — say는 '말씀드리다'로 가름"),
    'w-check': ('살펴보다', "ko '확인하다'가 w-confirm과 같아 정답이 둘 — check는 '살펴보다'로 가름"),
    'w-stop': ('멈추게 하다', "ko '멈추다'가 w-pause와 같아 정답이 둘 — stop은 '멈추게 하다'로 가름"),
    'w-pause': ('잠시 멈추다', "ko '멈추다'가 w-stop과 같아 정답이 둘 — pause는 '잠시 멈추다'로 가름"),
    'w-fully': ('충분히', "ko '완전히'가 w-completely와 같아 정답이 둘 — fully는 '충분히'로 가름"),
    'w-honor': ('소중히 여기다', "ko '존중하다'가 w-respect와 같아 정답이 둘 — honor는 '소중히 여기다'로 가름"),
    'w-sorry': ('죄송한', "'sorry to share difficult news'는 미안함보다 죄송·안타까움"),
}
UNTAG = {  # (상황 번호, 문장 번호): [ids] — 헤드워드 뜻과 안 맞는 문장에서 태그만 뺀다
    (10, 1): ['w-face'], (4, 1): ['w-take'], (11, 6): ['w-take'], (16, 3): ['w-take'],
    (8, 1): ['w-like'], (13, 2): ['w-keep'], (18, 6): ['w-way'], (19, 5): ['w-way'],
    (19, 6): ['w-side'], (20, 4): ['w-hear'], (16, 6): ['w-matter'], (13, 6): ['w-answer'],
    (9, 3): ['w-ask'], (20, 6): ['w-ask'],
}
UNTAG_WHY = {
    'w-face': "'face him'은 동사(마주 보다)라 헤드워드 '얼굴'과 달라 태그를 뺌",
    'w-take': "'take a deep breath'·'take this in'·'one step at a time'은 '(시간을) 갖다'가 아니라 태그를 뺌",
    'w-like': "'would you like'는 '원하다'라 헤드워드 '~처럼'과 달라 태그를 뺌",
    'w-keep': "'keep up'은 따라가다라 헤드워드 '유지하다'와 달라 태그를 뺌",
    'w-way': "'either way'·'on the way'는 '방식'과 달라 태그를 뺌",
    'w-side': "'your side'는 '곁'이라 헤드워드 '쪽'과 달라 태그를 뺌",
    'w-hear': "'I hear how important'은 '듣다'가 아니라 공감이라 태그를 뺌",
    'w-matter': "'no matter how small'은 관용구라 헤드워드 '중요하다'와 달라 태그를 뺌",
    'w-answer': "'before you answer'는 동사라 헤드워드 명사 '답'과 달라 태그를 뺌",
    'w-ask': "'ask so much of you'·'asking you to change'는 '묻다'가 아니라 '부탁하다'라 태그를 뺌",
}
PAGE = dict(en='on the same page', ipa='/ɑːn ðə seɪm peɪdʒ/', ko='같은 이해를 하다')
PAGE_WHY = "'on the same page'는 구 전체가 '같은 이해를 하다'인 관용구 — 낱말 page(페이지)와 same(같은)으로는 뜻이 안 맞아 w-page를 구로 바꿈"


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
            if x['words'] != before:
                gone = [w[2:] for w in before if w not in x['words']]
                changes.append(dict(kind='sentence', situation=s['title'], index=i, fields=['words'],
                                    why='태그 뺌: ' + ', '.join(gone)))
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
        if wid == 'w-page':
            w.update(PAGE)
            changes.append(dict(kind='word', id=wid, fields=['en', 'ipa', 'ko'], why=PAGE_WHY))
        d = words.get(wid)
        if d is None:
            print('MISSING data for', wid, w['en']); newwords.append(w); continue
        w.update(d)
        newwords.append(w)
    doc['words'] = newwords
    for s in doc['situations']:
        s['nuance'] = nuance.get(s['title'], [])
        if s['title'] not in nuance: print('MISSING nuance', s['title'])
    extra = set(words) - {w['id'] for w in doc['words']}
    if extra: print('data for unknown/removed ids:', extra)
    # 태그 뺀 이유 보충
    yaml.safe_dump(doc, open(f'{HERE}/{TH}.A.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
    yaml.safe_dump(dict(theme=TH, changes=changes), open(f'{HERE}/changes-{TH}.yaml', 'w', encoding='utf-8'), allow_unicode=True, sort_keys=False, width=1000)
    print('words', len(doc['words']), 'changes', len(changes))


if __name__ == '__main__':
    main()
