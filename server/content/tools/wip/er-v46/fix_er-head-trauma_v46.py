import yaml
P = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-head-trauma.yaml'
d = yaml.safe_load(open(P))
S = d['situations']

def sent(i, j): return S[i]['sentences'][j]
def line(i, k, **kw):  # k = 1..4
    l = S[i]['order']['lines'][k - 1]
    for a, b in kw.items(): l[a] = b
def ow(i, w): S[i]['order']['why'] = w
def swhy(i, j, w): sent(i, j)['why'] = w

# ---- order ----
# O1 S19
line(19, 1, en='The seizure has lasted almost five minutes now.', ko='발작이 거의 5분째 계속되고 있어요')
line(19, 2, en="Because it's lasted that long, we're giving medication to stop it.", ko='그렇게 오래 이어져서 멈추는 약을 주고 있어요')
line(19, 3, en='Along with the medication, we keep protecting his airway and giving oxygen.', ko='약과 함께 계속 기도를 보호하고 산소를 주고 있어요')
line(19, 4, en="Through all of that, we're watching his pupils and GCS for rising pressure.", ko='그 모든 과정 내내 동공과 GCS로 뇌압 상승을 지켜보고 있어요', note='감시')
ow(19, "발작이 5분 가까이 이어져 멈추는 약을 쓰고, 그 내내 기도·산소를 지키며, 뇌압 신호를 함께 봐요. 'that long'·'the medication'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
# O2 S17
line(17, 3, en="With your head still like that, we won't remove it here; neurosurgery will.", ko='그렇게 머리를 가만히 두면 여기서는 빼지 않고 신경외과가 뺄 거예요')
line(17, 4, en="Until it's removed in the operating room, try not to touch it.", ko='수술실에서 뺄 때까지 만지지 않도록 해 주세요')
ow(17, "물체를 고정한다고 알리고, 머리를 가만히 하게 하고, 그렇게 가만히 둔 채 여기서는 빼지 않고 신경외과가 한다고 알린 뒤, 수술실에서 뺄 때까지 건드리지 말라고 해요. 'it'·'like that'·'Until it's removed'가 앞 줄을 가리켜 순서가 하나예요.")
# O3 S15
line(15, 2, en='Because of that, get neurosurgery on the phone right now.', ko='그래서 지금 바로 신경외과에 전화 연결해 주세요', icon='speech', note='호출')
line(15, 3, en="While you call, I'll check the other pupil and compare both sides.", ko='전화하는 동안 저는 다른 쪽 동공을 확인해 양쪽을 비교할게요', icon='magnify', note='비교')
line(15, 4, en='That difference tells neurosurgery how fast the pressure is rising.', ko='그 차이가 신경외과에 뇌압이 얼마나 빠르게 오르는지 알려 줘요', icon='bulb', note='의미')
ow(15, "응급을 선언하면 바로 신경외과를 부르고, 그동안 다른 쪽 동공과 비교해 그 차이를 전해요. 'Because of that'·'While you call'·'That difference'가 앞 줄을 가리켜 순서가 하나예요.")
# O4 S14
line(14, 3, en="From what you're telling me, this looks like bleeding building up fast.", ko='말씀해 주시는 것을 보니 출혈이 빠르게 쌓이는 것 같아요', icon='bulb', note='설명')
line(14, 4, en="Because of that, we're getting an urgent scan and calling neurosurgery now.", ko='그래서 응급 CT를 찍고 지금 신경외과를 부르고 있어요', icon='monitor', note='호출')
ow(14, "갑작스러운 악화를 알리고, 계속 말하게 하고, 환자의 말에서 출혈이 빠르게 쌓이는 양상을 읽은 뒤, 응급 CT와 신경외과 호출로 이어 가요. 'while we do'·'From what you're telling me'·'Because of that'이 앞 줄을 가리켜 순서가 하나예요.")
# O5 S9
line(9, 4, en="We'll do those rechecks until you're clearly sober and steady.", ko='그 재확인은 확실히 술이 깨고 안정될 때까지 할게요')
ow(9, "마신 양을 묻고, 술이 징후를 가린다고 알리고, 그래서 머물러 달라고 하고, 그 재확인을 술이 깰 때까지 한다고 닫아요. 'Thanks'·'Because of that'·'those rechecks'가 앞 줄을 가리켜 순서가 하나예요.")
# O6 S5
line(5, 4, en="So you don't forget when to come back, I'll write it all down.", ko='언제 돌아와야 하는지 잊지 않도록 제가 다 적어 드릴게요')
ow(5, "함께 있을 사람을 정하고, 그 사람이 볼 증상을 알리고, 그 증상이면 돌아오라고 한 뒤, 돌아올 기준을 잊지 않게 적어 주겠다고 닫아요. 'That person'·'Any of those'·'when to come back'이 앞 줄을 가리켜 순서가 하나예요.")
# O7 S10
line(10, 4, en="With a possible fracture, please don't blow your nose.", ko='골절일 수 있으니 코를 풀지 말아 주세요')
ow(10, "눈 주위 멍을 보고, 그 멍과 함께 맑은 액체를 묻고, 그런 소견의 의미를 알린 뒤, 골절 가능성 때문에 코를 풀지 말라고 해요. 'that bruising'·'like that'·'a possible fracture'가 앞 줄을 가리켜 순서가 하나예요.")
# O8 S7
line(7, 4, en="Whatever the scan shows, tell us right away if he seems different than usual.", ko='스캔 결과와 상관없이 평소와 다르게 보이면 바로 알려 주세요')
ow(7, "넘어진 시점을 묻고, 그 이후의 혼돈 경과를 묻고, 출혈 가능성과 CT를 알린 뒤, 결과와 상관없이 달라진 점을 알려 달라고 해요. 'that fall'·'like that'·'the scan'이 앞 줄을 가리켜 순서가 하나예요.")
# O9 S2
line(2, 1, en="First, I'm shining a light in your eyes, so please look straight ahead.", ko='먼저 눈에 빛을 비출 테니 정면을 봐 주세요')
line(2, 4, en='If that comparison shows any difference, I\'ll tell the doctor right away.')

# ---- why ----
swhy(2, 5, "could mean으로 가능성만 말해 환자를 겁주지 않으면서 중요성을 전해요. 동공 변화는 뇌압이 이미 많이 올랐다는 늦은 신호라, 의식 수준과 함께 보고 바로 알려요.")
swhy(5, 4, "every few hours로 간격을, to check that…으로 목적을 밝혀요. 모든 환자에게 하는 것은 아니고, 의사가 첫날 밤 확인하라고 할 때 깨워서 평소처럼 반응하는지를 봐요.")
swhy(8, 4, "if he seems로 아이가 그렇게 보이면이라 확신이 없어도 말하기 쉬워요. 평소보다 더 졸린 것은 소아 두부외상에서 부모가 알아채기 쉬운 경고 신호예요.")
swhy(10, 0, "I see…로 눈에 보이는 걸 그대로 말하고 when으로 시작 시점을 물어요. 눈 주위 멍이 외상 직후가 아니라 몇 시간에서 하루 이틀 뒤에 양쪽으로 생기면 두개저 골절을 시사해요.")
swhy(14, 0, "suddenly much worse로 갑작스러운 악화를 짚고 we're acting now로 바로 대응한다고 알려 환자를 안심시켜요. 명료기 뒤 두통이 갑자기 심해지고 의식이 떨어지는 것이 경막외혈종의 전형적인 악화 양상이에요.")
swhy(19, 4, "while로 두 가지가 동시에 벌어지고 있다고 짚어요. 발작이 멈춘 뒤에도 의식이 예상보다 오래 돌아오지 않으면 출혈 같은 다른 원인을 의심해요.")
swhy(19, 5, "at the same time으로 두 가지를 한꺼번에 한다고 말해요. 발작을 멈추는 약과 기도 관리는 팀이 역할을 나눠 동시에 진행해요.")

# ---- blank ----
def blank(i, j, ans, opts):
    """new answer + options (answer included in opts); answer placed at old answer's index"""
    b = sent(i, j)['blank']
    idx = [o['en'] for o in b['options']].index(b['answer'])
    others = [o for o in opts if o != ans]
    assert len(others) == 3
    new = others[:]; new.insert(idx, ans)
    b['answer'] = ans; b['options'] = [{'en': o} for o in new]
def opt(i, j, old, new):
    b = sent(i, j)['blank']
    for o in b['options']:
        if o['en'] == old:
            o['en'] = new; return
    raise AssertionError((i, j, old))
blank(12, 5, 'wake', ['wake', 'feed', 'move', 'lift'])
blank(2, 2, 'still', ['still', 'up', 'out', 'back'])
blank(4, 0, 'vomited', ['vomited', 'coughed', 'fainted', 'choked'])
opt(4, 4, 'day', 'shift'); opt(4, 4, 'week', 'meal'); opt(4, 4, 'month', 'dose')
blank(5, 4, 'responds', ['responds', 'sleeps', 'eats', 'walks'])
opt(5, 0, 'fever', 'bruising'); opt(5, 0, 'rash', 'swelling'); opt(5, 0, 'cough', 'soreness')
opt(5, 3, 'cough', 'bump'); opt(5, 3, 'rash', 'bruise'); opt(5, 3, 'fever', 'swelling')
opt(5, 5, 'cough', 'bruise'); opt(5, 5, 'rash', 'ache')
opt(5, 1, 'thirst', 'soreness'); opt(5, 1, 'boredom', 'stiffness'); opt(5, 1, 'hunger', 'bruising')
opt(5, 2, 'yesterday', 'all week')
opt(6, 3, 'lighter', 'milder'); opt(6, 3, 'easier', 'slower')
opt(6, 4, 'fever', 'fractures'); opt(6, 4, 'allergy', 'swelling')
blank(7, 3, 'differently', ['differently', 'better', 'calmer', 'quieter'])
opt(8, 1, 'laughter', 'teething'); opt(8, 1, 'hunger', 'drooling'); opt(8, 1, 'thirst', 'sneezing')
opt(8, 4, 'hungry', 'playful'); opt(8, 4, 'thirsty', 'active')
opt(9, 1, 'fever', 'low sugar'); opt(9, 1, 'hunger', 'a seizure')
opt(9, 2, 'bill', 'transfer'); opt(9, 2, 'weigh', 'admit')
opt(10, 0, 'itching', 'scratches')
opt(11, 0, 'hiccups', 'neck pains'); opt(11, 0, 'coughs', 'earaches')
opt(11, 3, 'thirsty', 'sleepy'); opt(11, 3, 'hot', 'numb'); opt(11, 3, 'hungry', 'nauseous')
opt(12, 4, 'dietitian', 'charge nurse')
opt(14, 2, 'dermatology', 'orthopedics')
opt(17, 3, 'itching', 'swelling'); opt(17, 3, 'cramping', 'bruising')
opt(17, 4, 'nutrition', 'stroke'); opt(17, 4, 'dialysis', 'burn')
opt(19, 0, 'ice', 'oxygen'); opt(19, 0, 'food', 'sugar')
opt(19, 1, 'food', 'blood')
blank(19, 3, 'seizure', ['seizure', 'tremor', 'headache', 'shivering'])

# ---- decoy ----
assert sent(6, 5)['decoy'] == 'right now'; sent(6, 5)['decoy'] = 'yesterday'

# ---- distractorsKo ----
def dko(i, j, old, new):
    L = sent(i, j)['distractorsKo']
    assert old in L, (i, j, old, L)
    L[L.index(old)] = new
dko(4, 4, '활력징후를 한 시간마다 잴게요', '토할 것 같으면 이 봉투를 쓰세요')
dko(6, 3, '약 때문에 멍이 더 쉽게 들 수 있어요', '약은 오늘 아침에도 드셨어요?')
dko(8, 4, '아이가 잠들면 저희에게 알려 주세요', '아이가 좋아하는 장난감이 있으면 주세요')
dko(9, 2, '술이 깰 때까지 침대에서 쉬세요', '물 한 잔 가져다 드릴게요')
dko(10, 5, '귀 안도 불빛으로 살펴볼게요', '목을 움직이면 아프세요?')
dko(14, 1, '눈을 감지 말고 저를 봐 주세요', '제 손을 꽉 쥐어 보세요')
dko(16, 0, '의사 선생님이 기도 확보를 하러 오세요', '흡인기를 켜 두세요')
dko(17, 0, '물체 주위를 거즈로 감싸고 있어요', '진통제를 곧 드릴게요')
dko(18, 4, '심방세동 때문에 심박 조절약도 복용합니다', '알려진 약물 알레르기는 없습니다')
dko(1, 2, '이건 지금 바로 끝낼게요', '잠깐 혈압을 잴게요')
dko(1, 5, '질문은 이게 마지막이에요', '이제 양팔을 들어 보세요')
dko(7, 5, 'CT 결과는 가족분께 먼저 알려 드릴게요', 'CT실로 갈 때 같이 가셔도 돼요')
dko(16, 4, '혈압 관리는 기도 확보 뒤에 해요', '흡인 준비를 해 주세요')

# ---- context 장면 정비 ----
def ctx(i):
    return [n for n in S[i]['nuance'] if n['kind'] == 'context'][0]
def scene(i, k, old, new, **kw):
    sc = ctx(i)['scenes'][k]
    assert sc['en'] == old, (i, k, sc['en'])
    sc['en'] = new
    for a, b in kw.items(): sc[a] = b
scene(0, 1, 'He says he lost consciousness for a few seconds after the fall.', 'He had a brief LOC after the fall—just a few seconds.')
scene(2, 1, 'Pupils are equal, round, and reactive, 3 millimeters.', 'Pupils are PERRL, 3 millimeters on both sides.')
scene(4, 1, "He's vomited twice in the last hour.", "He's had two episodes of emesis in the last hour.")
scene(7, 0, 'Increased confusion since fall 1 wk ago; r/o SDH.', 'Increased confusion since fall 1 wk ago; r/o subdural.')
ctx(7)['ko'] = '경막하 혈종'
scene(10, 1, 'She has raccoon eyes—bruising around both eyes.', 'She has periorbital ecchymosis on both sides—raccoon eyes.')
scene(12, 1, "He's much harder to arouse than he was an hour ago.", "He's more somnolent and much harder to arouse than an hour ago.")
scene(6, 0, 'Pt on anticoagulation (apixaban).', 'Pt anticoagulated on apixaban.')
# C8: word intubated (차트는 과거형이 자연스럽다), 장면 [1][2]와 fix를 맞춤
c = ctx(16); assert c['word'] == 'intubating'
c['word'] = 'intubated'; c['ko'] = '삽관된'
scene(16, 1, "GCS is 6—we're intubating for airway protection.", "GCS is 6—we've intubated for airway protection.")
scene(16, 2, "We're intubating him for airway protection because his GCS is 6.", "We've intubated him for airway protection because his GCS is 6.",
      fix="He isn't awake enough to protect his airway, so we've placed a breathing tube to help him breathe.")
# C9: 장면 그대로, why에 한 문장
c = ctx(19); assert '차트에는' not in c['why']
c['why'] = c['why'] + ' 차트에는 줄임말 benzo 대신 benzodiazepine(또는 약 이름)으로 적어요.'
# C10
scene(15, 2, 'His right pupil is blown and nonreactive.', 'His right pupil is fixed, dilated, and nonreactive.')
ctx(15)['why'] = 'nonreactive·fixed and dilated는 차트와 의료진끼리의 정확한 말이에요. 가족에게는 동공이 커지고 빛에 반응하지 않는다고 풀어서, 응급 상황이며 조치 중이라는 것을 함께 말해요.'

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('fixed')
