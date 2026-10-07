#!/usr/bin/env python3
"""er-stroke 검토 목록(fix-er-stroke.md) 반영 — er-stroke.yaml · changes-er-stroke.yaml 을 제자리에서 고친다.
build_er_stroke.py 를 다시 돌리지 않는다. 이미 반영된 상태에서 다시 돌려도 assert 로 멈춘다."""
import io, os, yaml

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda n: os.path.join(HERE, n)
T = 'er-stroke'
doc = yaml.safe_load(io.open(P(f'{T}.yaml'), encoding='utf-8'))
chg = yaml.safe_load(io.open(P(f'changes-{T}.yaml'), encoding='utf-8'))
W = {w['id']: w for w in doc['words']}
S = {s['title']: s for s in doc['situations']}
changes = chg['changes']

def nu(title, kind, nth=0):
    return [n for n in S[title]['nuance'] if n['kind'] == kind][nth]

def setw(i, **kw):
    for k, v in kw.items():
        W[i][k] = v

def add_change(entry):
    changes.append(entry)

def sent_change(sit, idx, fields, why):
    for c in changes:
        if c.get('kind') == 'sentence' and c['situation'] == sit and c['index'] == idx:
            for f in fields:
                if f not in c['fields']:
                    c['fields'].append(f)
            c['why'] += ' / ' + why
            return
    add_change({'kind': 'sentence', 'situation': sit, 'index': idx, 'fields': fields, 'why': why})

# ───────── v45 필드 ─────────
# 1. 대혈관 폐색 context 장면 1
t = '대혈관 폐색 혈전제거술 이송'
ctx = nu(t, 'context')
assert ctx['scenes'][0]['en'] == "I need your consent so we don't lose time."
ctx['scenes'][0]['en'] = "The doctor will explain everything, then we'll need your signature."
ctx['why'] += " 설명동의는 시술 의사가 받고, 간호사는 서명에 입회하며 보호자가 이해했는지 확인해요."

# 3. 혈압 급상승 slider
sl = nu('혈압 급상승 동반', 'slider')
assert sl['cue'].startswith('BP 210/118')
sl['cue'] = "BP 192/104. Clot-busting medicine can't start until it's below 185/110."
assert sl['answerAt'] == 1
sl['why'] = ("혈전용해제는 혈압이 185/110 미만일 때 시작해요(AHA). 기준을 넘었으니 'a little high'로 줄여 말하지 않아요. "
             "230/130처럼 훨씬 높고 즉각 위험하면 'dangerously high'예요.")

# 4. 두부 CT swap why
sw = nu('두부 CT 준비 설명', 'swap')
assert sw['why'].startswith('CT가 출혈과 혈전을')
sw['why'] = "CT의 첫 목적은 뇌출혈이 있는지 확인하는 것이에요. 무엇을 찾는지는 환자가 아는 쉬운 말로 전해요."

# 5. 뇌간 swap notes life support
sw = nu('뇌간 경색 급속 의식저하', 'swap')
sw['notes']['life support'] = "틀린 말은 아니지만 연명치료 결정처럼 들려, 가족이 지금 상황보다 무겁게 받아들일 수 있어요."

# 6. 즉시 혈당 swap
sw = nu('즉시 혈당·활력 측정', 'swap')
assert sw['before'][1] == 'hypoglycemic'
new = 'in the hypoglycemic range'
sw['before'][1] = new
sw['options'] = ['a little low', new, 'critical']
sw['notes'] = {('a little low' if k == 'a little low' else new if k == 'hypoglycemic' else k): v for k, v in sw['notes'].items()}
assert set(sw['notes']) == set(sw['options'])

# 7. 후순환 slider 삭제, 종류 구분은 pair why 끝으로
s7 = S['후순환(소뇌) 뇌졸중']
sl = nu('후순환(소뇌) 뇌졸중', 'slider')
s7['nuance'].remove(sl)
pr = nu('후순환(소뇌) 뇌졸중', 'pair')
pr['why'] += " 참고로 '어지럽다'는 한 가지가 아니에요. 멍하고 쓰러질 듯하면 lightheaded, 몸이 한쪽으로 쏠리면 off balance, 주변이 돌면 spinning(현훈)이에요."

# 8. SBAR context 장면 2
ctx = nu('뇌졸중 SBAR 인계', 'context')
assert ctx['scenes'][1]['en'].startswith('Call me if')
ctx['scenes'][1] = {'who': '인계받는 간호사에게', 'icon': 'bell',
                    'en': "He's getting worse: NIHSS went from 12 to 15. Watch him closely.", 'ok': True}
ctx['words'] = ['w-deterioration', 'w-watch']

# 9. 출혈성 reel — swap 카드 교체, TIA 로 이동 (결정 11 의 2번과 함께)
s16 = S['출혈성 뇌졸중 급성 악화']
reel = nu('출혈성 뇌졸중 급성 악화', 'reel')
assert reel['scenes'][-1]['swap'] is True
reel['scenes'][-1] = {'who': '영어가 서툰 환자에게는…', 'en': 'Open your eyes. Look at me.',
                      'ko': '눈 뜨세요. 저를 보세요.', 'tone': '또렷함', 'swap': True}
s16['nuance'].remove(reel)
assert reel['words'] == ['w-stay']
S['TIA 증상 소실']['nuance'].append(reel)

# 10. w-sugar cue
setw('w-sugar', cue="손끝 채혈로 바로 재는 수치. 낮으면 뇌졸중처럼 보일 수 있어 먼저 확인한다")
# 11. w-level
setw('w-level', cue="와파린 복용자가 정기 혈액검사로 확인하는 INR 같은 검사 결과의 높낮이",
     exKo="와파린은 수치를 확인하기 위해 정기적인 혈액검사가 필요해요.")
# 12. w-call
setw('w-call', cue="인계를 마치며, 상태가 바뀌면 나에게 전화해 달라고 당부할 때")
# 13, 14
setw('w-numb', distractorsKo=['화끈거리는', '뻣뻣한'])
setw('w-sip', distractorsKo=['한 컵', '한 병'])
# 15. distractorsEn 품사
def rep(i, old, new, decoy=None):
    L = W[i]['distractorsEn']
    assert old in L, (i, old, L)
    L[L.index(old)] = new
    if decoy:
        W[i]['decoyChips'] = decoy
rep('w-recent', 'resent', 'frequent')
rep('w-quick', 'quite', 'slick')
rep('w-follow', 'fellow', 'swallow')
rep('w-worse', 'worry', 'worst', ['worth'])
rep('w-wake', 'weak', 'wave')
rep('w-double', 'doubt', 'single'); rep('w-double', 'trouble', 'triple')
rep('w-point', 'pint', 'print')
rep('w-hear', 'here', 'heed')
rep('w-heart', 'hear', 'hearth', ['hear'])
# 16. 칩
assert W['w-check']['chips'] == [['ch', 'eck']]
W['w-check']['chips'] = [['check']]
W['w-interpreter']['chips'] = [['inter', 'pret', 'er']]
W['w-understand']['chips'] = [['under', 'stand']]
W['w-slurred']['chips'] = [['slurr', 'ed']]
# 17. 정상 시각 slider
sl = nu('마지막 정상 시각 확정', 'slider')
assert sl['scale'] == ['roughly', 'about', 'exactly']
sl['scale'] = ['sometime', 'around', 'exactly']
sl['why'] = ("시계로 확인한 시각은 exactly(정각), '열 시쯤인 것 같아요'는 around, '저녁 어느 땐가요'처럼 시각을 못 박지 못하면 sometime이에요. "
             "마지막 정상 시각은 정확할수록 시간창 판단이 믿을 만해서, 보호자가 확신하는지 어림인지를 구분해 기록해요.")
# 18. tPA 금기 context 장면 2
ctx = nu('tPA 금기 선별', 'context')
assert ctx['scenes'][1]['en'].startswith('On apixaban')
ctx['scenes'][1]['en'] = "I'm screening him for bleeding risks before tPA."
ctx['why'] = ("의료진끼리는 'screening for bleeding risks before tPA'처럼 목적을 압축해 말하지만, "
              "환자에게는 왜 묻는지 이유를 붙인 쉬운 질문이어야 정확한 답이 나와요.")
# 19. 삼킴 slider why
sl = nu('침상 삼킴 선별', 'slider')
sl['why'] += " 목을 가다듬거나 목소리가 젖어도(wet voice) 흡인 신호일 수 있어 보고해요."
# 20. 젊은 환자 slider example (뜻이 맞는 문장). 대혈관 slider 는 맞는 상황 문장이 없어 그대로 둠.
sl = nu('젊은 환자 경동맥 박리', 'slider')
sl['example'] = "When did the neck pain start compared to the numbness?"
sl['exKo'] = "목 통증은 무감각보다 먼저 시작됐나요, 나중에 시작됐나요?"

# ───────── 결정 11 ─────────
# 1. w-level ko 되돌림(정본 = 수치), w-value ko -> 검사값
assert W['w-level']['ko'] == '농도'
W['w-level']['ko'] = '수치'
changes[:] = [c for c in changes if not (c.get('kind') == 'word' and c.get('id') == 'w-level')]
assert W['w-value']['ko'] == '수치'
W['w-value']['ko'] = '검사값'
add_change({'kind': 'word', 'id': 'w-value', 'fields': ['ko'], 'why': 'w-level(수치)과 ko가 같아 듣고 뜻 고르기 정답이 둘이 됨 — value는 검사값'})

# 2. w-stay 분리
new_word = {
    'id': 'w-stay-with-me', 'en': 'stay with me', 'ipa': '/steɪ wɪð miː/', 'ko': '정신 놓지 마세요', 'icon': 'speech',
    'example': 'I need you to stay with me—can you open your eyes?',
    'exKo': '정신 잃지 마세요—눈을 뜰 수 있나요?',
    'cue': '의식이 흐려지는 환자에게 계속 말을 걸며 깨어 있게 할 때',
    'tag': '소통·지시',
    'distractorsEn': ['stay away from me', 'stand by me'],
    'distractorsKo': ['가만히 계세요', '잠들게 두세요'],
    'chips': [['stay'], ['with'], ['me']],
    'decoyChips': ['stray'],
}
idx = [w['id'] for w in doc['words']].index('w-stay') + 1
doc['words'].insert(idx, new_word)
W['w-stay-with-me'] = new_word
setw('w-stay', cue="퇴원하려는 환자에게 병원에 남아 달라고 할 때")
add_change({'kind': 'word-add', 'id': 'w-stay-with-me', 'why': '"Stay with me"는 관용구(정신 놓지 마세요) — w-stay(머무르다) 카드가 오역을 가르쳐 분리. 문장 3개에 이미 있다'})
for sit, i in [('출혈성 뇌졸중 급성 악화', 0), ('출혈성 뇌졸중 급성 악화', 6), ('뇌간 경색 급속 의식저하', 0)]:
    ws = S[sit]['sentences'][i]['words']
    assert 'w-stay' in ws
    ws[ws.index('w-stay')] = 'w-stay-with-me'
    sent_change(sit, i, ['words'], '태그 w-stay를 w-stay-with-me로 교체')

# 3. 즉시 혈당 문장 6 (안전)
s = S['즉시 혈당·활력 측정']['sentences'][6]
assert s['en'].startswith("We'll give you some juice")
s['en'] = "We'll give you sugar through your IV to bring it up."
s['ko'] = "혈당을 올리기 위해 정맥으로 당을 드릴게요."
s['chunks'] = ["We'll give you", "sugar", "through your IV", "to bring it up", "."]
sent_change('즉시 혈당·활력 측정', 6, ['en', 'ko', 'chunks'], '삼킴 선별 전 환자에게 경구(주스) 안내 — 안전 문제, IV 당 투여로')

# 4. w-speech
W['w-speech']['ko'] = '말(발음)'
add_change({'kind': 'word', 'id': 'w-speech', 'fields': ['ko'], 'why': '"speech sounds slurred"의 speech는 말투가 아니라 발화·발음'})
# 5. w-strain
W['w-strain']['ko'] = '무리한 힘(염좌)'
W['w-strain']['exKo'] = '목에 부상이나 갑자기 무리하게 힘을 준 일이 있었나요?'
add_change({'kind': 'word', 'id': 'w-strain', 'fields': ['ko'], 'why': 'strain은 긴장(tension)이 아니라 무리한 힘으로 인한 근육 부담(염좌)'})
s = S['젊은 환자 경동맥 박리']['sentences'][0]
s['ko'] = '목에 부상이나 갑자기 무리하게 힘을 준 일이 있었나요?'
sent_change('젊은 환자 경동맥 박리', 0, ['ko'], '"갑작스러운 긴장" → 무리하게 힘을 준 일')
sl = nu('젊은 환자 경동맥 박리', 'slider')  # 20번에서 example 을 바꿨으므로 exKo 는 그대로
# 6. w-intubation ipa
W['w-intubation']['ipa'] = '/ˌɪntuˈbeɪʃən/'
add_change({'kind': 'word', 'id': 'w-intubation', 'fields': ['ipa'], 'why': '영국식 발음(tj) → 미국식'})
# 7. 젊은 환자 문장 1 ko
S['젊은 환자 경동맥 박리']['sentences'][1]['ko'] = '목 통증은 무감각보다 먼저 시작됐나요, 나중에 시작됐나요?'
sent_change('젊은 환자 경동맥 박리', 1, ['ko'], '부자연스러운 한국어 어순')
# 8. 출혈성 문장 2 ko
s = S['출혈성 뇌졸중 급성 악화']['sentences'][2]
assert '높아요; ' in s['ko']
s['ko'] = s['ko'].replace('높아요; ', '높아요. ')
sent_change('출혈성 뇌졸중 급성 악화', 2, ['ko'], '한국어 세미콜론을 마침표로')
# 9. 악성 부종 문장 5 ko
s = S['악성 부종 감시']['sentences'][5]
assert '압력이 오른다는' in s['ko']
s['ko'] = s['ko'].replace('압력이 오른다는', '뇌압이 오른다는')
sent_change('악성 부종 감시', 5, ['ko'], '압력 → 뇌압')

with io.open(P(f'{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
with io.open(P(f'changes-{T}.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': T, 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)
print('ok')
