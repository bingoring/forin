#!/usr/bin/env python3
"""icu-eol-goals A(단어·뉘앙스) 빌드. base를 읽어 v45 필드와 nuance를 얹고, 결정 11 정리를 적용한다."""
import glob, yaml, sys, copy, collections

D = '/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/icu'
T = 'icu-eol-goals'
base = yaml.safe_load(open(f'{D}/base-{T}.yaml', encoding='utf-8'))

TAGS = {1: '문서·지시', 2: '대화·설명', 3: '징후·사정', 4: '편안함 돌봄', 5: '곁에 있기',
        6: '존중·의례', 7: '치료 철회', 8: '지지·애도', 9: '팀·협진', 10: '상태·정도'}

# --- 결정 11 정리 ---------------------------------------------------------
EASY_REMOVE = ['father', 'mother', 'family', 'doctor', 'time', 'body', 'hand', 'night', 'day', 'week',
               'hour', 'today', 'room', 'go', 'see', 'good',            # 공통 쉬운 단어 목록(필수)
               'thing', 'other', 'over', 'again']                        # 목록 밖 판단분(4개)
REMOVE = {f'w-{x}' for x in EASY_REMOVE}
KO_FIX = {  # id: (새 ko, 이유)
    'w-like': ('~하고 싶다', "want와 ko가 같은 '원하다'라 듣고 뜻 고르기에서 정답이 둘이 된다"),
    'w-list': ('명시하다', "차트에 항목이 적혀 있다는 뜻 — '기록하다'는 document와 겹치고 뜻도 어긋난다"),
    'w-dnr': ('DNR (소생술 하지 않음)', "DNR은 '거부'가 아니라 소생술을 하지 않는다는 지시"),
    'w-check': ('점검하다', "confirm과 ko가 같은 '확인하다'라 정답이 둘이 된다"),
    'w-manage': ('대처하다', "adjust와 ko가 같은 '조절하다'라 정답이 둘이 된다"),
    'w-heavy': ('무거운', "hard와 ko가 같은 '힘든'이라 정답이 둘이 된다 — 문장은 마음이 무거운 날"),
    'w-matter': ('소중하다', "important와 ko가 같은 '중요하다/중요한'이라 정답이 둘이 된다"),
    'w-settle': ('진정되다', "settled와 ko가 같은 '안정되다/안정된'이라 정답이 둘이 된다"),
    'w-weaning': ('단계적 이탈', "weaning은 젖떼기식 '이유'가 아니라 호흡기 지원을 단계적으로 떼는 것"),
    'w-put': ('표현하다', "put that in plainer terms는 '놓다'가 아니라 말로 표현하다"),
    'w-restlessness': ('초조함', "restlessness는 가만히 있지 못하는 초조·불안 — '불안정함'은 상태 불안정으로 읽힌다"),
    'w-speed': ('빠르게 하다', "hasten의 ko와 같은 '앞당기다/서두르게 하다' 계열을 가르고 뜻을 분명히"),
}
NEW_WORDS = [
    {'id': 'w-speak', 'en': 'speak', 'ipa': '/spiːk/', 'ko': '말하다', 'icon': 'speech',
     'example': 'What would your mother say if she could speak for herself?',
     'why': "w-mother(쉬운 단어)를 태그에서 빼면 이 문장에 가르칠 단어가 없어 — 문장에 이미 있는 speak"},
    {'id': 'w-meeting', 'en': 'meeting', 'ipa': '/ˈmiːtɪŋ/', 'ko': '회의', 'icon': 'board',
     'example': "We'll make sure your questions get answered at the meeting.",
     'why': "w-meet(만나다) 태그 4문장 중 3문장이 명사 meeting — 헤드워드 ko와 어긋나 명사를 별도 단어로"},
]
RETAG = {  # 문장 en -> {바꿀 id: 새 id}
    "We'll make sure your questions get answered at the meeting.": {'w-meet': 'w-meeting'},
    'There\'s no wrong question to bring to this meeting.': {'w-meet': 'w-meeting'},
    'I can explain anything that felt confusing in the meeting.': {'w-meet': 'w-meeting'},
    'What would your mother say if she could speak for herself?': {'w-mother': 'w-speak'},
}

def load_lines():
    rec = {}
    for p in sorted(glob.glob(f'{D}/add_{T}_A_words_*.txt'), key=lambda q: (q.endswith('_fix.txt'), q)):
        for ln in open(p, encoding='utf-8'):
            ln = ln.rstrip('\n')
            if not ln.strip() or ln.startswith('#'):
                continue
            f = ln.split('|')
            if len(f) == 4:   # fix 파일: id|dEn|dKo|decoys
                wid, den, dko, dec = f
                r = rec['w-' + wid]
                if den.strip(): r['distractorsEn'] = [x.strip() for x in den.split(',')]
                if dko.strip(): r['distractorsKo'] = [x.strip() for x in dko.split(',')]
                if dec.strip(): r['decoyChips'] = [x.strip() for x in dec.split(',')]
                continue
            assert len(f) == 7, ln
            wid, tag, cue, den, dko, chips, dec = f
            assert 'w-' + wid not in rec, f'dup {wid}'
            rec['w-' + wid] = dict(tag=TAGS[int(tag)], cue=cue.strip(),
                                   distractorsEn=[x.strip() for x in den.split(',')],
                                   distractorsKo=[x.strip() for x in dko.split(',')],
                                   chips=[w.split('+') for w in chips.split(' ')],
                                   decoyChips=[x.strip() for x in dec.split(',')])
    return rec

def main():
    rec = load_lines()
    doc = copy.deepcopy(base)
    # 문장 ko -> exKo
    ko_of = {}
    for s in doc['situations']:
        for x in s['sentences']:
            ko_of[x['en']] = x['ko']
    # 단어
    words = [w for w in doc['words'] if w['id'] not in REMOVE]
    for w in words:
        if w['id'] in KO_FIX:
            w['ko'] = KO_FIX[w['id']][0]
    words += copy.deepcopy([{k: v for k, v in n.items() if k != 'why'} for n in NEW_WORDS])
    ids = {w['id'] for w in words}
    miss = ids - set(rec)
    extra = set(rec) - ids
    if miss or extra:
        print('MISSING', sorted(miss), 'EXTRA', sorted(extra))
    for w in words:
        r = rec.get(w['id'])
        if not r:
            continue
        w['exKo'] = ko_of[w['example']]
        for k in ('cue', 'tag', 'distractorsEn', 'distractorsKo', 'chips', 'decoyChips'):
            w[k] = r[k]
    doc['words'] = words
    # 문장 words
    changes = []
    for s in doc['situations']:
        for i, x in enumerate(s['sentences']):
            old = list(x['words'])
            rt = RETAG.get(x['en'], {})
            new = []
            for wid in old:
                if wid in REMOVE:
                    if wid in rt: new.append(rt[wid])
                    continue
                new.append(rt.get(wid, wid))
            if new != old:
                x['words'] = new
                changes.append({'kind': 'sentence', 'situation': s['title'], 'index': i, 'fields': ['words'],
                                'why': '쉬운 단어 태그를 빼거나 헤드워드를 맞춘다: ' + ', '.join(
                                    f'{a}→{rt[a]}' if a in rt else f'−{a}' for a in old if a in REMOVE or a in rt)})
    # nuance
    nu = {}
    for p in sorted(glob.glob(f'{D}/add_{T}_A_nuance_*.yaml')):
        nu.update(yaml.safe_load(open(p, encoding='utf-8')) or {})
    for s in doc['situations']:
        if s['title'] in nu:
            s['nuance'] = nu[s['title']]
    # 변경 목록
    ch = []
    for w in base['words']:
        if w['id'] in REMOVE:
            ch.append({'kind': 'word-remove', 'id': w['id'], 'why': '너무 쉬움 — 어느 문장도 태그하지 않게 됐다'})
    for wid, (ko, why) in KO_FIX.items():
        ch.append({'kind': 'word', 'id': wid, 'fields': ['ko'], 'why': why})
    for n in NEW_WORDS:
        ch.append({'kind': 'word-add', 'id': n['id'], 'why': n['why']})
    ch += changes
    with open(f'{D}/{T}.A.yaml', 'w', encoding='utf-8') as f:
        yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000)
    with open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8') as f:
        yaml.safe_dump({'theme': T, 'changes': ch}, f, allow_unicode=True, sort_keys=False, width=1000)
    print('words', len(words), 'changes', len(ch), 'nuance sits', len([1 for s in doc['situations'] if s.get('nuance')]))

main()
