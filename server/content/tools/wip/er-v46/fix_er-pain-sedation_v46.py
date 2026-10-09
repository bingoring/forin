import yaml, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-pain-sedation.yaml'
d = yaml.safe_load(open(F))
S = d['situations']
before = copy.deepcopy(d)


def sent(s, j):
    return S[s]['sentences'][j]


def opt(s, j, repl, answer=None):
    """오답 en만 바꾼다(위치 유지, icon 쓰지 않음). repl: {old: new}. answer를 주면 정답도 옮긴다(old는 repl에 포함)."""
    x = sent(s, j)
    b = x['blank']
    seen = set()
    for o in b['options']:
        if o['en'] in repl:
            seen.add(o['en'])
            o['en'] = repl[o['en']]
            assert 'icon' not in o
    assert seen == set(repl), (s, j, set(repl) - seen)
    if answer:
        b['answer'] = answer
    ens = [o['en'] for o in b['options']]
    assert len(set(ens)) == 4 and b['answer'] in ens, (s, j, ens)


# ── why
sent(1, 5)['why'] = ("졸림이 흔한 반응이라고 먼저 말하면 환자가 약이 잘못됐다고 걱정하지 않아요. "
                     "다만 깨우기 힘들 만큼 졸리면 호흡이 느려지는 신호라, 간호사가 진정 정도를 계속 확인해요.")
sent(9, 3)['why'] = ("사람마다 통증 표현이 다르다고 말하면 조용한 환자도 판단받지 않는다고 느껴요. "
                     "통증은 환자의 보고가 기준이지만, 표현이 적은 환자는 감싸기·찡그림 같은 행동 단서도 함께 봐요.")
sent(14, 2)['why'] = ("extra oxygen이라고 쉬운 말로 알려 주면 환자가 지금 무슨 일이 일어나는지 알아요. "
                      "진정 중 호흡이 느려지면 깨우는 자극, 기도 열기, 산소 올리기를 함께 해요.")
sent(6, 3)['why'] = ("평소와 다른 양상이나 다른 부위는 새로 생긴 통증일 수 있다는 단서예요. "
                     "새롭거나 달라진 통증은 원인이 다를 수 있어 의사에게 알리는 근거가 돼요.")
sent(13, 2)['why'] = ("You did great로 환자를 칭찬하면서 all done으로 끝났음을 분명히 알려요. "
                      "깨어나는 환자에게는 칭찬과 '끝났다'는 사실을 함께 말해 불안을 먼저 덜어요.")
sent(16, 5)['why'] = ("I'm right here는 지금 이 자리에 있다는 구체적인 약속이라, 막연한 위로보다 환자가 붙잡기 쉬워요. "
                      "고통이 큰 환자에게 혼자가 아니라고 말하는 것이 신뢰를 지켜요.")
# (선택 반영)
sent(7, 0)['why'] += " 응급실에서는 금식 시간만으로 진정을 미루지 않지만, 구토 위험을 가늠하는 데 써요."
assert '날록손 뒤에는' in sent(15, 2)['why']
sent(15, 2)['why'] = sent(15, 2)['why'].replace('날록손 뒤에는', '오피오이드에 의존이 있는 사람은 날록손 뒤에')
sent(17, 4)['icon'] = 'siren'

# ── 빈칸
opt(0, 0, {'ignore': 'manage', 'hide': 'describe'})
opt(0, 2, {'dizzy': 'throbbing', 'swollen': 'stabbing'})
opt(0, 5, {'fast': 'want', 'wrong': 'feel', 'small': 'see', 'high': 'know'}, answer='feel')
opt(1, 2, {'cheerful': 'itchy', 'rushed': 'nauseous'})
opt(2, 3, {'torn': 'cold', 'dirty': 'thin', 'wet': 'heavy'})
opt(3, 4, {'made': 'noticed', 'caught': 'reported'})
opt(3, 2, {'room': 'medicine', 'bed': 'test'})
opt(6, 2, {'forget': 'stop', 'hide': 'skip', 'borrow': 'check'})
opt(6, 3, {'language': 'dull', 'spot': 'sharp', 'hospital': 'mild', 'year': 'steady'}, answer='sharp')
opt(7, 1, {'crutches': 'fluids', 'pillows': 'bed rest'})
opt(7, 2, {'proud': 'numb', 'angry': 'dizzy'})
opt(7, 3, {'manual': 'general', 'silent': 'palliative'})
opt(7, 4, {'diet': 'temperature', 'schedule': 'blood sugar', 'insurance': 'weight'})
opt(7, 5, {'Anyone': 'A doctor'})
opt(8, 4, {'proud': 'guilty', 'bored': 'relieved', 'hungry': 'angry'})
opt(9, 4, {'rich': 'polite', 'late': 'calm'})
opt(10, 3, {'busy': 'nauseous', 'proud': 'dizzy', 'hungry': 'itchy'})
opt(11, 0, {'sell': 'count', 'hide': 'bring', 'forget': 'check'})
opt(11, 2, {'cheap': 'strong', 'heavy': 'new'})
opt(11, 4, {'hungry': 'dizzy', 'angry': 'restless', 'late': 'weak'})
opt(11, 5, {'cost': 'list', 'weight': 'stress', 'noise': 'pain'})
opt(12, 0, {'fire': 'cancel', 'hide': 'skip'})
opt(12, 4, {'Wash': 'Shake', 'Paint': 'Release'})
opt(13, 2, {'dinner': 'test', 'meeting': 'X-ray'})
opt(13, 3, {'color': 'time', 'size': 'hospital', 'weight': 'floor'})
opt(13, 5, {'sorry': 'awake', 'late': 'alone'})
opt(14, 1, {'wash': 'release', 'hide': 'raise'})
opt(15, 1, {'painted': 'smoked', 'wore': 'bought'})
opt(15, 2, {'hungry': 'sleepy', 'proud': 'itchy'})
opt(15, 3, {'louder': 'slower'})
opt(15, 4, {'because': 'before', 'while': 'although'})
opt(16, 0, {'tiny': 'mild', 'funny': 'manageable', 'invisible': 'minor'})
opt(16, 5, {'sorry': 'weak', 'late': 'stuck'})
opt(17, 2, {'late': 'awake', 'hungry': 'warm'})
opt(17, 3, {'sweet': 'sore', 'wet': 'dry'})
opt(17, 4, {'window': 'mouth', 'door': 'nose'})
opt(17, 5, {'bored': 'asleep', 'late': 'discharged', 'hungry': 'home'})
opt(18, 0, {'bill': 'cure', 'schedule': 'recovery'})
opt(18, 4, {'loud': 'restless', 'hungry': 'awake', 'busy': 'active'})
opt(19, 0, {'living': 'operating', 'dining': 'recovery'})
opt(19, 1, {'dirty': 'busy', 'wet': 'up', 'cold': 'free'})
opt(19, 2, {'teacher': 'doctor', 'neighbor': 'interpreter', 'driver': 'technician'})
opt(19, 3, {'traffic': 'nausea', 'noise': 'pain', 'hunger': 'drowsiness'})
opt(19, 4, {'Library': 'Pharmacy', 'Hall': 'Nursing Home', 'School': 'Rehab Center'})
opt(19, 5, {'jump': 'stand', 'run': 'kneel', 'sing': 'move around'})
opt(20, 4, {'grows': 'heals', 'travels': 'moves', 'speaks': 'looks'})
opt(20, 5, {'singing': 'listening', 'writing': 'waving', 'walking': 'holding on'})

# ── decoy
for s, j, old, new in [(1, 4, 'away from', 'onto'), (4, 4, "if it's bad", 'tomorrow morning'),
                       (5, 2, 'to keep', 'to talk about'), (5, 4, 'at home', 'next time'),
                       (9, 4, 'to feel brave', 'to be here'), (11, 4, 'keep you', 'wake you'),
                       (18, 5, 'What did she tell', 'What would you want')]:
    assert sent(s, j)['decoy'] == old, (s, j)
    sent(s, j)['decoy'] = new

# ── distractorsKo
assert len(sent(18, 2)['distractorsKo']) == 2
sent(18, 2)['distractorsKo'] = ['비용은 원무과에서 안내해 드려요', '가족분들은 잠시 밖에서 기다려 주세요']
dk = sent(19, 2)['distractorsKo']
assert '저는 보호자예요, 여기 있을게요' in dk
sent(19, 2)['distractorsKo'] = [('저는 다른 환자 담당이에요, 곧 올게요' if x == '저는 보호자예요, 여기 있을게요' else x) for x in dk]

# ── order
def line(en, ko, note, icon):
    return {'en': en, 'icon': icon, 'ko': ko, 'note': note}


def setline(s, i, en, ko, note, icon):
    S[s]['order']['lines'][i - 1] = line(en, ko, note, icon)


def why(s, t):
    S[s]['order']['why'] = t


# S15 — 날록손 약리
setline(15, 2, 'It reverses the opioid all at once, so you may feel sick or shaky.',
        '한꺼번에 되돌려서 속이 안 좋거나 떨릴 수 있어요', '증상', 'faceWorried')
setline(15, 3, 'That will pass, but the medicine can wear off before the opioid does.',
        '그건 지나가지만, 역전제가 마약성 약보다 먼저 풀릴 수 있어요', '지속', 'calendar')
setline(15, 4, "So we'll stay close and watch your breathing for a few hours.",
        '그래서 몇 시간 곁에서 호흡을 지켜볼게요', '관찰', 'monitor')
why(15, "숨을 못 쉬어서 역전제를 줬다고 먼저 알려요. 한꺼번에 되돌려서(it) 올 수 있는 증상을 말하고, 그건 지나가지만(That will pass) "
        "역전제가 먼저 풀리면 마약성 약 때문에 호흡이 다시 느려질 수 있다고 해요. 그래서(So) 몇 시간 호흡을 지켜봐요.")
# S8 — 질문은 설명을 다 들은 뒤
setline(8, 1, "We'll give him a little medicine so he won't feel the stitches.",
        '봉합이 아프지 않게 약을 조금 드릴 거예요', '약', 'pill')
setline(8, 2, 'That medicine will make him sleepy, calm, and still.',
        '그 약이 아이를 졸리고 차분하게, 가만히 있게 해요', '효과', 'coffee')
setline(8, 3, 'That sleepiness wears off soon after we finish.',
        '그 졸음은 끝나고 곧 풀려요', '회복', 'calendar')
setline(8, 4, "Now that you've heard all of that, do you have any questions before we begin?",
        '다 들으셨으니, 시작 전에 궁금한 점 있으세요?', '질문', 'speech')
why(8, "약 → 그 약(That medicine)이 하는 일 → 그 졸음(That sleepiness)이 풀리는 때를 설명하고, "
       "다 들은 뒤(Now that you've heard all of that) 시작 전에 질문을 받아요.")
# S9
setline(9, 1, "You said a 3, but I notice you're guarding your right side.",
        '3점이라고 하셨는데 오른쪽을 감싸고 계시네요', '관찰', 'magnify')
setline(9, 2, 'Does that side hurt more than you said?', '그쪽이 말씀하신 것보다 더 아프세요?', '확인', 'stetho')
setline(9, 3, "It's okay to tell me if it really does.", '정말 그렇다면 말씀하셔도 괜찮아요', '허용', 'handshake2')
setline(9, 4, "That way, we won't miss anything.", '그래야 놓치는 게 없어요', '확인', 'check')
why(9, "보고(3점)와 행동이 어긋나는 것을 사실로 말하고(I notice), 그쪽(that side)이 더 아픈지 물어요. "
       "정말 그렇다면(if it really does) 말해도 된다고 열어 주고, 그래야(That way) 놓치지 않는다고 마무리해요.")
# S10
setline(10, 4, "Whichever of those you choose, or none, I'll support you.",
        '그중 무엇을 고르시든, 안 고르셔도 지지할게요', '지지', 'star')
assert '(Whatever you decide)' in S[10]['order']['why']
why(10, S[10]['order']['why'].replace('(Whatever you decide)', '(Whichever of those)'))
# S13
setline(13, 2, 'Can you tell me where you are right now?', '지금 어디 계신지 말씀해 주시겠어요?', '장소', 'speech')
setline(13, 3, "That's right, the hospital. Do you know what day it is?",
        '맞아요, 병원이에요. 오늘이 며칠인지 아세요?', '날짜', 'compass')
why(13, "끝났다는 말로 안심시킨 뒤 장소를 물어요. 답을 확인한 뒤(That's right, the hospital) 날짜를 물어요. "
        "마지막은 대답에 이어(Good) 호흡이 좋아졌다고 알려요.")
# S14 (why만)
w14 = S[14]['order']['why']
assert '기도를 연다고 알려요.' in w14
why(14, w14.replace('기도를 연다고 알려요.', '기도를 연다고 알려요. 실제로는 자극·기도 열기·산소를 지체 없이 함께 해요.'))
# S16 — 3줄은 검토안 그대로, 4줄은 3줄을 가리키게(바꿔도 자연스러운 3↔4를 막는다)
setline(16, 3, "If that doesn't work either, we'll keep looking for something that helps.",
        '그것도 안 들으면 도움이 될 걸 계속 찾을게요', '약속', 'shield')
setline(16, 4, 'Until we find it, stay with me — you\'re not alone.',
        '찾을 때까지 저와 함께 있어요, 혼자가 아니에요', '동행', 'me')
why(16, "이미 시도한 것을 인정하며 시작해요. 그래서(That's why) 의사를 불러 방법을 바꾼다고 하고, 새 방법(that)도 안 들으면 "
        "도움이 될 것을 계속 찾겠다고 해요. 그것을 찾을 때까지(Until we find it) 곁에 있겠다고 마무리해요.")
# S17
setline(17, 4, "Once it's open, we'll still stay right by your side.", '기도가 열린 뒤에도 곁을 지킬게요', '곁에', 'hospital')
w17 = S[17]['order']['why']
assert '약이 듣기 시작해도(it starts working) 곁에 있겠다고 해요.' in w17
why(17, w17.replace('약이 듣기 시작해도(it starts working) 곁에 있겠다고 해요.',
                    '기도가 열린 뒤에도(Once it\'s open) 곁에 있겠다고 해요. 아나필락시스는 나아진 뒤 다시 올 수 있어(이상성 반응) 계속 지켜봐요.'))
# S18
setline(18, 4, "Whatever she'd choose, we'll keep her as peaceful and comfortable as we can.",
        '어떤 선택이시든 최대한 평온하고 편안하게 해 드릴게요', '약속', 'star')
w18 = S[18]['order']['why']
assert '마지막은 그 선택(whatever she chooses)에 맞춘 소망이에요.' in w18
why(18, w18.replace('마지막은 그 선택(whatever she chooses)에 맞춘 소망이에요.',
                    '마지막은 그 선택(Whatever she\'d choose)에 맞춘 약속이에요.'))
# S19
setline(19, 1, "First, you're safe — you're in the emergency room.", '먼저, 안전하세요. 여기는 응급실이에요', '장소', 'hospital')
w19 = S[19]['order']['why']
assert w19.startswith('어디인지, 안전하다는 것부터 알려요.')
why(19, w19.replace('어디인지, 안전하다는 것부터 알려요.', '먼저(First) 안전하다는 것과 어디인지 알려요.', 1))

# ── context (word·ko만)
for s, w, k in [(14, 'sats', '산소포화도'), (20, 'BP', '혈압')]:
    c = [n for n in S[s]['nuance'] if n['kind'] == 'context'][0]
    c['word'], c['ko'] = w, k

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)


# ── 필드 단위 비교
def walk(a, b, p, out):
    if isinstance(a, dict):
        for k in a:
            walk(a[k], b.get(k), p + [k], out)
        for k in b or {}:
            if k not in a: out.append((p + [k], None, b[k]))
    elif isinstance(a, list) and isinstance(b, list) and len(a) == len(b):
        for i, (x, y) in enumerate(zip(a, b)): walk(x, y, p + [i], out)
    elif a != b:
        out.append((p, a, b))

out = []
walk(before, d, [], out)
for p, a, b in out:
    print('.'.join(map(str, p)), '|', a, '->', b)
print(len(out), 'fields changed')
