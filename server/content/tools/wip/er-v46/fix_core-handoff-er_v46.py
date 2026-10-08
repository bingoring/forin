import yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'core-handoff-er.yaml'
d = yaml.safe_load(open(F))
S = d['situations']


def sent(key):
    s, j = key.split('.')
    return S[int(s) - 1]['sentences'][int(j)]


def reblank(key, answer, opts):
    """정답까지 바꾸는 빈칸: 정답 위치(회전)를 지키고 선택지는 en만 쓴다. opts[0]이 정답."""
    b = sent(key)['blank']
    pos = [o['en'] for o in b['options']].index(b['answer'])
    assert opts[0] == answer and len(opts) == 4
    rest = iter(opts[1:])
    b['options'] = [{'en': answer if k == pos else next(rest)} for k in range(4)]
    b['answer'] = answer


def optswap(key, old, new):
    b = sent(key)['blank']
    hit = [o for o in b['options'] if o['en'] == old]
    assert len(hit) == 1 and b['answer'] != old, (key, old)
    hit[0]['en'] = new


def dko(key, old, new):
    x = sent(key)['distractorsKo']
    assert x.count(old) == 1, (key, old)
    x[x.index(old)] = new


def decoy(key, old, new):
    x = sent(key)
    assert x['decoy'] == old, (key, x['decoy'])
    x['decoy'] = new


# ---------------------------------------------------------------- A. 빈칸 (아이콘 항목 제외)
reblank('10.3', 'pending', ['pending', 'finished', 'canceled', 'charted'])
reblank('17.2', 'reassess', ['reassess', 'discharge', 'transfer', 'sedate'])
reblank('17.3', 'wait', ['wait', 'last', 'change', 'matter'])
reblank('13.3', 'mentioned', ['mentioned', 'hidden', 'changed', 'denied'])
reblank('6.3', 'antibiotic', ['antibiotic', 'insulin', 'heparin', 'steroid'])
reblank('16.1', 'shocks', ['shocks', 'breaths', 'doses', 'codes'])
reblank('20.0', 'yellows', ['yellows', 'blues', 'oranges', 'purples'])
reblank('20.2', 'Reassess', ['Reassess', 'Discharge', 'Sedate', 'Transfer'])
optswap('19.3', 'sign', 'reject')
optswap('15.4', 'stay', 'talk')
optswap('12.3', 'one time', 'the next time')
optswap('19.2', 'argue', 'ignore')
optswap('12.2', 'bags', 'charts')
optswap('11.3', 'answer', 'care')
optswap('16.2', 'sedated', 'ambulating')

# ---------------------------------------------------------------- D. distractorsKo
dko('13.2', '아드님은 지금 많이 화가 나 있어요, 조심하세요', '아드님은 아까 면회를 마치고 돌아가셨어요')
dko('14.4', '전원 후 마지막 혈압은 안정적이었습니다', '이송 중에는 혈압을 재지 못했습니다')
dko('16.3', '첫 번째 제세동 이후 혈압은 안정적이었습니다', '제세동 뒤 승압제를 끊었습니다')
dko('6.3', '다음 항생제 투여는 8시 예정입니다', '항생제 처방이 아직 나지 않았습니다')
dko('20.0', '적색 3명, 황색 8명, 녹색 5명입니다', '적색 환자는 이미 모두 이송했습니다')
dko('20.2', '녹색 환자를 15분마다 재사정하세요', '황색 환자는 녹색 구역으로 보내세요')

# ---------------------------------------------------------------- H. decoy
decoy('2.2', 'of the', 'for the MRI')
decoy('3.4', 'of the', 'the X-ray report')
decoy('14.3', 'of the', 'after transport')
decoy('19.2', 'of the', 'by tomorrow')

# ---------------------------------------------------------------- F. why
sent('14.1')['why'] = ('뇌졸중은 증상이 시작된 시각(시작을 못 봤다면 마지막으로 정상이던 시각, 미국에서는 last known well)에 따라 치료할 수 있는지가 달라져서 전원 인계에서 꼭 전해요. '
                       'tPA를 줬는지에 따라 받는 병원의 혈압 관리·출혈 감시·혈전제거술 결정이 달라져요.')
sent('12.1')['why'] = ('requires로 말하면 선택이 아닌 의무라는 게 분명해져요. at all times를 붙여 교대·휴식 중에도 끊기지 않게 해요.')
w = sent('14.2')['why']
assert w.endswith('영상을 같이 보내면 받는 병원이 촬영을 다시 하는 일을 줄일 수 있어요.')
sent('14.2')['why'] = ('are traveling with the patient는 진행형으로 지금 함께 실려 간다는 걸 알려서, 받는 쪽이 따로 요청하지 않아도 돼요. '
                       '영상을 같이 보내면 받는 병원이 촬영을 다시 하는 일을 줄일 수 있어요.')
sent('15.4')['why'] = ('travel with her로 간호사가 이송에 동행한다고 밝혀요. 불안정한 환자라 이송 중에도 간호사가 곁을 지킨다는 뜻이 돼요.')

# ---------------------------------------------------------------- G. context word·ko
def ctx(si):
    c = [x for x in S[si - 1]['nuance'] if x['kind'] == 'context']
    assert len(c) == 1
    return c[0]


c = ctx(3); assert c['ko'] == '용량'; c['ko'] = '(1회) 투여분'
c = ctx(4); assert c['word'] == 'bed'; c['word'] = 'correct'; c['ko'] = '맞나요?(확인)'
c = ctx(17); assert c['word'] == 'status'; c['word'] = 'Forget what I just said'; c['ko'] = '방금 한 말은 잊으세요'


# ---------------------------------------------------------------- E. order
def line(si, idx, en=None, ko=None, note=None, icon=None):
    l = S[si - 1]['order']['lines'][idx]
    if en: l['en'] = en
    if ko: l['ko'] = ko
    if note: l['note'] = note
    if icon: l['icon'] = icon


def ow(si, why):
    S[si - 1]['order']['why'] = why


# S8
line(8, 1, 'Because of that, her monitor alarm has gone off twice this hour.', '그 때문에 이번 한 시간에 경보가 두 번 울렸어요')
ow(8, '상태를 말하고, Because of that으로 그 상태 때문에 경보가 울렸다는 이력을 이어요. 두 가지를 받아(Given both) 의사가 이미 안다고 전한 뒤, 의사가 정한 조치 기준으로 마무리해요.')
# S12
line(12, 2, 'Whenever the sitter changes, please recheck the room.', '지켜보는 사람이 바뀔 때마다 병실을 다시 확인해 주세요')
line(12, 3, 'If he tries to leave during those room checks, security is aware and will call.', '그 병실 점검 중에 나가려 하면 보안팀이 알고 연락할 거예요')
ow(12, '보류 상태가 근거라 먼저 말해요. 그 때문에 1대1 관찰이 필요하고, 관찰하는 사람이 바뀔 때마다 병실을 점검하며, 그 점검 중에 나가려 하면(those room checks가 앞 줄을 받아) 보안이 연락한다는 순서예요.')
# S19
line(19, 1, 'Social work is arranging safe discharge to a shelter once her mobility improves.', '사회복지: 거동이 나아지면 보호소로 안전하게 퇴원시키도록 주선 중이에요')
line(19, 3, "With all of that, let's agree who follows up on each item.", '이 모든 걸 감안해 항목마다 누가 후속 처리할지 정해요')
ow(19, '간호 보고로 시작하고, 사회복지가 거동이 나아지면(her mobility가 앞 줄을 받아) 퇴원을 주선한다고 이어요. 가족이 그 계획을 이미 안다고 전한 뒤, With all of that으로 앞 내용을 모두 받아 담당을 정하며 회의를 마쳐요.')
# S20
line(20, 3, "While you do those reassessments, the greens can wait in the hallway.", '그 재사정을 하는 동안 녹색은 복도에서 기다려도 돼요')
ow(20, '전체 인원으로 시작하고 적색의 위치를 말해요. 그 구역을 맡은 뒤(Once those bays are covered) 황색을 재사정하고, 그 재사정을 하는 동안(those reassessments) 녹색은 복도에서 기다린다는 순서예요.')
# S5
line(5, 3, 'Other than her, the other three beds are stable and just waiting for discharge, so that call is only for her.',
     '그분 말고 나머지 세 병상은 안정적이고 퇴원만 기다리니, 그 호출은 그분만 해당돼요')
ow(5, '누구를 볼지 먼저 짚고, 그 환자의 추세를 근거로 대요. 이어서 호출 기준을 주고, 마지막에 나머지 환자는 안정적이라고 정리해요. Other than her가 앞의 3번 병상을, that call이 앞 줄의 호출을 받아요.')
# S3
for i, (en, ko, note, icon) in enumerate([
    ('His last dose of antibiotic was given on time.', '그분의 지난 항생제는 제시간에 투여됐어요', '지난 투약', 'pill'),
    ('The next one is due at four.', '다음 투약은 4시 예정이에요', '다음 투약', 'calendar'),
    ('Before that, the urine sample still needs to go to the lab.', '그 전에 소변 검체를 아직 검사실로 보내야 해요', '검체', 'lab'),
    ("Can you confirm the result once it's back?", '결과가 나오면 확인해 주시겠어요?', '결과 확인', 'magnify'),
]):
    line(3, i, en, ko, note, icon)
ow(3, '지난 투약을 말하고, the next one으로 다음 투약이 4시라고 이어요. Before that으로 그 전에 검체를 보내야 한다고 짚고, 마지막으로 the result가 나오면 확인해 달라고 부탁해요. 줄마다 앞 줄을 가리키는 말이 있어 순서가 하나예요.')
# S10
line(10, 1, 'With no allergies, was the pain medicine actually given, or just ordered?', '알레르기가 없다면, 진통제는 실제 투여됐나요, 처방만인가요?')
line(10, 2, 'Who ordered it — has the doctor already seen her, or is that still pending?', '누가 처방했나요 — 의사가 이미 봤나요, 아니면 아직 대기 중인가요?')
line(10, 3, "With all of that, I'll go check the chart now so we don't miss anything.", '이 모든 걸 감안해 놓치는 게 없도록 지금 차트를 볼게요')
ow(10, '빠진 알레르기부터 묻고, With no allergies로 그 답을 받아 투여 여부를 확인해요. it이 앞 줄의 진통제를 받아 처방자와 진료 여부를 묻고, With all of that으로 앞의 답을 모두 받은 뒤 차트를 보러 가며 마무리해요.')

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
