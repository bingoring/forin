#!/usr/bin/env python3
"""icu-invasive-lines A — base에 v45 필드(단어)·nuance(상황)·결정 11 정리를 얹는다."""
import glob, os, re, sys, yaml, copy
HERE = os.path.dirname(os.path.abspath(__file__))
TH = 'icu-invasive-lines'
base = yaml.safe_load(open(f'{HERE}/base-{TH}.yaml', encoding='utf-8'))

# ---- 결정 11 정리 -------------------------------------------------------
REMOVE = {  # 너무 쉬움(공통 목록 + 목록 밖 판단 10개) / 뜻이 같은 쌍 한쪽
 'w-minute': '공통 쉬운 단어', 'w-hour': '공통 쉬운 단어', 'w-patient': '공통 쉬운 단어', 'w-family': '공통 쉬운 단어', 'w-hand': '공통 쉬운 단어',
 'w-face': '너무 쉬움(목록 밖 판단)', 'w-fifteen': '너무 쉬움(목록 밖 판단)', 'w-yesterday': '너무 쉬움(목록 밖 판단)', 'w-news': '너무 쉬움(목록 밖 판단)',
 'w-less': '너무 쉬움(목록 밖 판단)', 'w-sure': '너무 쉬움(목록 밖 판단)', 'w-want': '너무 쉬움(목록 밖 판단)', 'w-tell': '너무 쉬움(목록 밖 판단)',
 'w-get': '너무 쉬움(목록 밖 판단)이고 문장마다 뜻이 다름(찍다·가져오다·보호하고 있다)', 'w-someone': '너무 쉬움(목록 밖 판단)',
 'w-crisp': 'ko가 sharp와 같아 듣고 뜻 고르기에서 정답이 둘 — 한쪽을 지움', 'w-second': 'ko가 moment와 같아 듣고 뜻 고르기에서 정답이 둘 — 한쪽을 지움',
}
HEAD = {  # id: (en, ipa) — 활용형을 원형으로
 'w-glove': ('glove', '/ɡlʌv/'), 'w-precaution': ('precaution', '/prɪˈkɔːʃn/'), 'w-verify': ('verify', '/ˈvɛrɪfaɪ/'),
 'w-flush': ('flush', '/flʌʃ/'), 'w-label': ('label', '/ˈleɪbl/'), 'w-advance': ('advance', '/ədˈvæns/'), 'w-sound': ('sound', '/saʊnd/'),
 'w-centimeter': ('centimeter', '/ˈsɛntɪˌmiːtər/'), 'w-connection': ('connection', '/kəˈnɛkʃn/'), 'w-understand': ('understand', '/ˌʌndərˈstænd/'),
 'w-transition': ('transition', '/trænˈzɪʃn/'), 'w-suggest': ('suggest', '/səɡˈdʒɛst/'), 'w-rise': ('rise', '/raɪz/'), 'w-fall': ('fall', '/fɔːl/'),
 'w-edge': ('edge', '/ɛdʒ/'), 'w-restart': ('restart', '/riːˈstɑːrt/'), 'w-assume': ('assume', '/əˈsuːm/'), 'w-activate': ('activate', '/ˈæktɪveɪt/'),
 'w-listen': ('listen', '/ˈlɪsn/'), 'w-shift': ('shift', '/ʃɪft/'), 'w-give': ('give', '/ɡɪv/'), 'w-grow': ('grow', '/ɡroʊ/'), 'w-need': ('need', '/niːd/'),
 'w-match': ('match', '/mætʃ/'), 'w-reserve': ('reserve', '/rɪˈzɜːrv/'), 'w-lay': ('lay', '/leɪ/'), 'w-feed': ('feed', '/fiːd/'), 'w-drip': ('drip', '/drɪp/'),
 'w-kink': ('kink', '/kɪŋk/'), 'w-loop': ('loop', '/luːp/'), 'w-culture': ('culture', '/ˈkʌltʃər/'), 'w-migrate': ('migrate', '/ˈmaɪɡreɪt/'),
 'w-jump': ('jump', '/dʒʌmp/'), 'w-ease': ('ease', '/iːz/'), 'w-gasp': ('gasp', '/ɡæsp/'), 'w-clamp': ('clamp', '/klæmp/'), 'w-drop': ('drop', '/drɑːp/'),
 'w-blame': ('blame', '/bleɪm/'), 'w-mark': ('mark', '/mɑːrk/'), 'w-luerlock': ('Luer lock', '/ˈluːər lɑːk/'), 'w-vasopressor': ('vasopressor', '/ˌvæsoʊˈprɛsər/'),
 'w-lift': ('lift', '/lɪft/'), 'w-explain': ('explain', '/ɪkˈspleɪn/'), 'w-map': ('map', '/mæp/'),
}
KO = {  # id: (new ko, why)
 'w-verify': ('검증하다', "ko '확인하다'가 w-confirm·w-check와 같아 듣고 뜻 고르기에서 정답이 여럿 — verify는 '검증하다'로 가름"),
 'w-check': ('점검하다', "ko '확인하다'가 w-confirm과 같아 정답이 둘 — check는 '점검하다'로 가름"),
 'w-trace': ('모니터 곡선', "ko '파형'이 w-waveform과 같아 정답이 둘 — trace는 화면에 그려진 곡선으로 가름(문장 3개가 모두 '파형 화면')"),
 'w-correlate': ('상응하다', "ko '일치하다'가 w-match와 같아 정답이 둘 — correlate는 '상응하다'로 가름"),
 'w-continuous': ('계속되는', "ko '지속적인'이 w-sustained와 같아 정답이 둘 — continuous는 '계속되는'으로 가름"),
 'w-hold': ('누르고 있다', "남은 태그 문장이 모두 hold (firm) pressure라 '참다'가 아니라 '누르고 있다'가 맞는다"),
 'w-keep': ('계속 두다', "ko '유지하다'가 흐려서 '그대로 계속 두다'로 — 문장은 '카테터를 그대로 두다·양손으로 계속 누르다'"),
 'w-change': ('바꾸다·바뀌다', "문장이 '교환하다'와 '(상태가) 바뀌다' 둘이라 둘 다 담음"),
 'w-call': ('부르다·알리다', "문장 대부분이 '(팀·외과를) 부르다'이고 하나는 '알리다(call out)'"),
 'w-entry': ('유입', "'air entry'는 공기가 들어옴(유입) — '침입'은 오해를 부른다"),
 'w-film': ('엑스레이 사진', "'portable film'은 이동식 촬영 사진 — '필름'만으로는 뜻이 흐리다"),
 'w-field': ('멸균 구역', "sterile field는 멸균 구역 — '시야'는 틀린 뜻"),
 'w-phlebaxis': ('정맥정수압축', "오답 보기와 길이를 맞추려고 괄호 설명을 cue로 옮김"),
 'w-mark': ('표시(하다)', "문장에 marked(표시된)와 mark(표시) 둘 — 헤드워드 mark로"),
 'w-lift': ('들뜨다', "원형 헤드워드에 맞춰"),
 'w-drop': ('떨어지다', "원형 헤드워드에 맞춰"),
 'w-wedge': ('쐐기압', "괄호 설명(폐동맥쐐기압)을 cue로 옮겨 오답 보기와 길이를 맞춘다"),
 'w-trendelenburg': ('트렌델렌버그', "ko에 붙은 '체위'를 뺌 — position(체위)이 따로 있고 오답 보기와 길이를 맞춘다"),
 'w-grow': ('커지다', "원형 헤드워드에 맞춰"), 'w-shift': ('밀리다', "원형 헤드워드에 맞춰"),
}
UNTAG = {  # (상황 번호, 문장 번호): [ids] — 헤드워드 뜻과 안 맞는 문장에서 태그만 뺀다
 (8, 3): ['w-trace'], (3, 1): ['w-level'], (9, 3): ['w-level'],
 (5, 1): ['w-hold'], (12, 4): ['w-hold'], (16, 4): ['w-hold'],
 (11, 0): ['w-place'], (12, 3): ['w-place'], (14, 1): ['w-place'],
 (6, 0): ['w-run'], (7, 1): ['w-run'], (10, 4): ['w-back'], (19, 1): ['w-down'],
}
UNTAG_WHY = {
 'w-trace': "'I traced the tubing'은 동사(따라가다) — 헤드워드는 명사 '곡선'", 'w-level': "'ordered level'·'fluid level'은 명사(수준·높이) — 헤드워드는 동사 '수평을 맞추다'",
 'w-hold': "hold breath·hold feeds·pressure's holding은 '누르고 있다'와 뜻이 달라 태그를 뺌", 'w-place': "'in place'·'was placed'는 '자세를 잡다'와 뜻이 달라 태그를 뺌",
 'w-run': "'runs of PVCs'·'run a test'는 '흘러가다'와 뜻이 달라 태그를 뺌", 'w-back': "'pull back'은 '돌아온'과 뜻이 달라 태그를 뺌", 'w-down': "'bleeding-side down'은 '낮아진'과 뜻이 달라 태그를 뺌",
}

# ---- 데이터 파일 ---------------------------------------------------------
def parse_chips(s):
    return [[p for p in w.split('+')] for w in s.split(' ')]

def load_words():
    data = {}
    for fn in sorted(glob.glob(f'{HERE}/add_{TH}_A_words_*.txt')):
        for ln in open(fn, encoding='utf-8').read().splitlines():
            if not ln.strip() or ln.startswith('#'): continue
            p = ln.split('|')
            assert len(p) == 7, ln
            wid, cue, tag, de, dk, ch, dc = p
            assert wid not in data, wid
            data[wid] = dict(cue=cue, tag=tag, distractorsEn=de.split(';'), distractorsKo=dk.split(';'),
                             chips=parse_chips(ch), decoyChips=dc.split(';'))
    return data

def load_nuance():
    out = {}
    for fn in sorted(glob.glob(f'{HERE}/add_{TH}_A_nuance_*.yaml')):
        d = yaml.safe_load(open(fn, encoding='utf-8'))
        for sit in d:
            assert sit['title'] not in out, sit['title']
            out[sit['title']] = sit['nuance']
    return out

def main():
    doc = copy.deepcopy(base)
    words = load_words(); nuance = load_nuance()
    changes = []
    ex_ko = {x['en']: x['ko'] for s in doc['situations'] for x in s['sentences']}
    # sentences
    removed = set(REMOVE)
    for si, s in enumerate(doc['situations']):
        for i, x in enumerate(s['sentences']):
            before = list(x['words'])
            ut = set(UNTAG.get((si, i), []))
            x['words'] = [w for w in x['words'] if w not in removed and w not in ut]
            if x['words'] != before:
                gone = [w for w in before if w not in x['words']]
                changes.append(dict(kind='sentence', situation=s['title'], index=i, fields=['words'],
                                    why='태그 뺌: ' + ', '.join(g[2:] for g in gone)))
    used = {w for s in doc['situations'] for x in s['sentences'] for w in x['words']}
    newwords = []
    for w in doc['words']:
        wid = w['id']
        if wid in removed:
            changes.append(dict(kind='word-remove', id=wid, why=REMOVE[wid])); continue
        assert wid in used, f'{wid} untagged but not removed'
        f = []
        if wid in HEAD:
            w['en'], w['ipa'] = HEAD[wid]; f += ['en', 'ipa']
        if wid in KO:
            w['ko'] = KO[wid][0]; f.append('ko')
        if f:
            why = '활용형 헤드워드를 원형으로' if 'en' in f else ''
            if wid in KO: why = (why + '; ' if why else '') + KO[wid][1]
            if wid in UNTAG_WHY: why += '; ' + UNTAG_WHY[wid]
            changes.append(dict(kind='word', id=wid, fields=f, why=why))
        elif wid in UNTAG_WHY:
            pass
        d = words.get(wid)
        if d is None:
            print('MISSING data for', wid, w['en']); newwords.append(w); continue
        w['exKo'] = ex_ko[w['example']]
        w.update(d)
        newwords.append(w)
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
