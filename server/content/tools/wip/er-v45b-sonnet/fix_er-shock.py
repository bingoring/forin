#!/usr/bin/env python3
"""er-shock 검토 목록(fix-er-shock.md) 반영 — er-shock.yaml · changes-er-shock.yaml 을 제자리에서 고친다.
build_er-shock.py 를 다시 돌리지 않는다. 이미 반영된 상태에서 다시 돌리면 assert 로 멈춘다."""
import io, os, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(HERE, n)
T = 'er-shock'
doc = yaml.safe_load(io.open(P(f'{T}.yaml'), encoding='utf-8'))
chg = yaml.safe_load(io.open(P(f'changes-{T}.yaml'), encoding='utf-8'))
W = {w['id']: w for w in doc['words']}
S = {s['title']: s for s in doc['situations']}
changes = chg['changes']

def nu(title, kind):
    return [n for n in S[title]['nuance'] if n['kind'] == kind][0]

def merge_change(match, entry, fields, why):
    for c in changes:
        if all(c.get(k) == v for k, v in match.items()):
            for f in fields:
                if f not in c.get('fields', []):
                    c.setdefault('fields', []).append(f)
            c['why'] = c.get('why', '') + ' / ' + why
            return
    e = dict(match); e['fields'] = list(fields); e['why'] = why
    changes.append(e)

def word_change(i, fields, why):
    merge_change({'kind': 'word', 'id': i}, None, fields, why)

def setw(i, why=None, **kw):
    for k, v in kw.items():
        W[i][k] = v
    if why:
        word_change(i, list(kw), why)

def sent(title, idx, ko, why, expect_old):
    s = S[title]['sentences'][idx]
    assert s['ko'] == expect_old, (title, idx, s['ko'])
    old = s['ko']
    s['ko'] = ko
    # 이 문장을 예문으로 쓰는 단어의 exKo도 같게
    for w in doc['words']:
        if w.get('example') == s['en'] and w.get('exKo') == old:
            w['exKo'] = ko
            word_change(w['id'], ['exKo'], 'keyPhrase 문장 ko 변경에 맞춰 exKo 정렬')
    merge_change({'kind': 'sentence', 'situation': title, 'index': idx}, None, ['ko'], why)

# ── 심각 1: 패혈증 번들 0, context 장면 2
t = '패혈증성 쇼크 급속 악화 번들'
sent(t, 0, '수액으로는 안 버텨요 — 노르에피네프린 지금 시작해야 해요.',
     '승압제 개시를 지시하는 말투가 되어 간호사가 의사에게 제안하는 어조로', '수액만으로는 혈압이 유지되지 않아요 — 지금 노르에피네프린을 시작하세요.')
ctx = nu(t, 'context')
assert ctx['scenes'][1]['en'] == "She's still hypotensive after the fluids — starting norepi."
ctx['scenes'][1]['en'] = "She's still hypotensive after the fluids — starting the norepi as ordered."

# ── 심각 2: 신경성 쇼크 2
sent('신경성 쇼크 척수손상', 2, '수액 주고 있고요 — 승압제랑 아트로핀도 고려해야 할 것 같아요.',
     "'consider a pressor'는 치료를 결정하는 사람의 말 — 의사에게 제안하는 어조로", '수액을 주고 승압제와 아트로핀도 고려하세요.')

# ── 심각 3: 흉통 slider
sl = nu('심인성 쇼크 감별', 'slider')
assert sl['scale'] == ['mild ache', 'pressure', 'stabbing pain']
sl['scale'] = ['a little discomfort', 'pressure', 'crushing pain']
sl['answerAt'] = 1
sl['why'] = "무겁게 눌린다는 말은 'pressure'예요. 심장 원인의 흉통은 흔히 압박감·쥐어짜는 느낌으로 오고, 환자가 쓴 말 그대로 기록해요. 'crushing'은 그보다 훨씬 센 말이라 환자 말을 과장하게 돼요."

# ── 심각 4: central monitoring
t = '다장기 악화 SBAR·ICU 이송'
sent(t, 2, '지금 중환자실 입원과 집중 감시를 권합니다.', "'central monitoring'은 중심정맥 감시가 아님(번역 과잉)", '지금 중환자실 입원과 중심정맥 감시를 권합니다.')
sent(t, 4, '중환자실에서 집중 감시를 받아야 할 것 같아요.', "'central monitoring' 번역 과잉 정정", '중환자실에서 중심정맥 감시를 받아야 할 것 같아요.')
setw('w-central', "문장 ko 변경에 맞춰 cue를 중앙 모니터 감시·중심 라인 두 뜻으로",
     cue='말단이 아니라 한가운데의 — 중앙 모니터 스테이션에서 보는 감시에도, 목·쇄골 아래 큰 혈관의 라인에도 붙는 말')

# ── v45
sent('폐색전 폐쇄성 쇼크', 1, '우심장을 볼 수 있게 침상 초음파 준비해요.', '검사 지시로 읽히지 않게', '우심장을 보기 위해 침상 옆에서 심장초음파를 하세요.')

sl = nu('저혈압 초기 활력 인지', 'slider')
assert sl['cue'].startswith('BP 98/62')
sl['cue'] = sl['cue'].replace('BP 98/62', 'BP 88/54')
assert '수축기 98' in sl['why']
sl['why'] = sl['why'].replace('수축기 98', '수축기 88')

sl = nu('노인 다약제 저혈압', 'slider')
assert sl['scale'] == ['might', 'can', 'will definitely']
sl['scale'] = ["can't", 'can', 'will definitely']
sl['answerAt'] = 1
sl['why'] = "약이 혈압을 떨어뜨릴 '수 있다'는 가능성의 말이에요. \"can't\"는 사실과 반대고, 'will definitely'는 단정이라 사실과 달라요. 원인을 확정하기 전에는 'can'으로 말해요."

sw = nu('대구경 정맥로·수액 설명', 'swap')
assert sw['answer'] == 'put in'
sw['options'] = ['put', 'insert', 'initiate']
sw['answer'] = 'put'
sw['before'] = ["I'm going to ", 'initiate', ' a larger IV in your arm so we can give fluids quickly.']
sw['notes'] = {'put': '환자에게 가장 쉬운 말.',
               'insert': '틀린 말은 아니지만 시술 설명서처럼 딱딱하다.',
               'initiate': "간호 기록 용어('IV initiation')라 환자는 못 알아듣는다."}

W['w-sign']['distractorsEn'] = ['sigh', 'symptom']
word_change('w-sign', ['distractorsEn'], "'a good signal'도 영어로 맞아 정답이 둘 — symptom으로")
setw('w-antibiotic', 'cue의 1시간 기준은 패혈성 쇼크', cue='세균을 죽이거나 번식을 막는 약 — 패혈성 쇼크는 한 시간 안에 넣어야 한다')
setw('w-emergent', "emergent endoscopy는 분 단위가 아니라 '지체 없이'", cue='당장 처치하지 않으면 위험해 미루지 않고 바로 해야 하는 — 시술 일정에 붙는 말')
setw('w-look', 'cue가 ko를 되풀이', cue="눈으로 어떤 쪽을 살필 때, 또는 안색이 어떠해 '보일' 때 — 두 뜻 다")
setw('w-find', 'cue가 ko를 되풀이', cue="검사로 숨은 이유를 알아낼 때 — 'to ___ the cause'")

# ── 결정 11
setw('w-vomit', '듣고 뜻 고르기에서 throw up과 ko가 같아 정답이 둘', ko='구토하다(의학어)')
setw('w-throw', '듣고 뜻 고르기에서 vomit과 ko가 같아 정답이 둘', ko='토하다(일상어)')
setw('w-dark', "black의 '검은'과 겹침", ko='짙은·어두운')
setw('w-hold', "keep의 '유지'와 겹침", ko='(혈압을) 받쳐 주다·버티다')
setw('w-activate', 'start의 시작/개시와 같은 뜻', ko='(프로토콜을) 발동하다')
setw('w-crash', '태그 문장에서 명사로 쓰임', ko='급변(급격한 악화)')
setw('w-run', "give의 '투여하다'와 겹침", ko='(검사를) 돌리다·(펌프가) 돌아가다')

io.open(P(f'{T}.yaml'), 'w', encoding='utf-8').write(yaml.safe_dump(doc, allow_unicode=True, sort_keys=False, width=1000))
io.open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8').write(yaml.safe_dump(chg, allow_unicode=True, sort_keys=False, width=1000))
print('ok', len(changes))
