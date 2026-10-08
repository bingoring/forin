import yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-procedures.yaml'
d = yaml.safe_load(open(F))
S = d['situations']


def sent(key):
    s, j = key.split('.')
    return S[int(s)]['sentences'][int(j)]


def reblank(key, answer, opts):
    """정답까지 바꾸는 빈칸: 정답 위치를 지킨다. opts[0]이 새 정답."""
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


def why(key, new, old_part=None):
    x = sent(key)
    if old_part is None:
        x['why'] = new
    else:
        assert x['why'].count(old_part) == 1, (key, old_part)
        x['why'] = x['why'].replace(old_part, new)


# ------------------------------------------------------------ why (11)
why('9.4', 'test dose는 알레르기 병력이 있을 때 처방에 따라 소량부터 주는 방식이에요. 이 말은 그런 처방이 있을 때 쓰는 말이에요.')
why('18.2', 'can you confirm?은 두 번째 확인을 청하는 말이에요. 고위험 약의 독립 이중 확인은 상대가 내 값을 듣기 전에 따로 계산하게 하는 것이 원칙이에요(ISMP).')
why('18.0', 'verify … with me는 두 번째 사람의 확인을 청해요. 항목을 약 이름·용량·농도로 나눠 말하면 빠뜨리기 어렵고, 고위험 약은 두 사람이 각자 따로 확인한 뒤 맞춰 봐요.')
why('5.5', "won't stop until …은 환자를 두고 포기하지 않겠다는 뜻이에요. 실제로는 한 사람이 두 번쯤 시도하고 안 되면 능숙한 동료나 초음파 유도로 넘겨요.")
why('11.4', '먼저 공감한 뒤 정상이라고 말해야 불편을 가볍게 넘긴다는 느낌을 주지 않아요.', '먼저 공감한 뒤 정상이라고 말해야 환자가 가볍게 받아들여지지 않아요.')
why('6.3', "보호자에게 '아주 짧다'를 알리는 말이에요. 다만 아이에게 직접 '아프지 않다'고 약속하지는 않아요 — 같은 상황 swap처럼 정직한 말이 신뢰를 지켜요.")
why('2.4', "step out으로 내가 나가겠다고 먼저 말하면 환자가 혼자 채취해도 된다는 것을 알아요. give you some privacy는 '나가 드릴게요'를 환자 배려로 들리게 해요.")
why('0.1', "draw는 혈액에 쓰는 일상 동사라 venipuncture 같은 용어보다 환자가 알아듣기 쉬워요.", "draw는 혈액에 쓰는 동사라서 환자에게도 '채혈' 같은 용어보다 알아듣기 쉬워요.")
why('20.0', '병원 현장 표현', '병원 속어')
why('4.0', 'help us find…는 검사가 원인을 찾는 도구라고 말해, 검사가 많아도 이유가 있다는 것을 알려요.', 'help us find…는 검사가 우리가 원인을 찾도록 돕는다고 설명해 환자를 한 팀으로 만들어요.')
why('9.5', 'check on you는', 'check on you은')

# ------------------------------------------------------------ 빈칸
optswap('5.0', 'afraid', 'surprised')
optswap('8.1', 'because', 'before')
reblank('16.0', 'contrast', ['contrast', 'blood', 'antibiotic', 'morphine'])
optswap('17.3', 'no', 'the usual'); optswap('17.3', 'both', 'the old')
optswap('20.2', 'any', 'three'); optswap('20.2', 'zero', 'ten')
optswap('13.3', 'last year', 'tomorrow'); optswap('13.3', 'someday', 'later')
optswap('6.1', 'never', 'slowly')
optswap('9.2', 'rarely', 'briefly'); optswap('9.2', 'barely', 'occasionally'); optswap('9.2', 'never', 'loosely')
optswap('10.2', 'barely', 'briefly'); optswap('10.2', 'never', 'loosely')
optswap('7.3', 'pets', 'surgeries'); optswap('7.3', 'plans', 'symptoms'); optswap('7.3', 'hobbies', 'implants')
optswap('10.1', 'hair loss', 'knee pain'); optswap('10.1', 'hearing loss', 'tooth pain'); optswap('10.1', 'bad breath', 'ear pain')
optswap('2.2', 'Drink', 'Pour')
optswap('5.4', 'photo', 'look'); optswap('5.4', 'bath', 'walk')
optswap('7.0', 'listened', 'consented')
optswap('0.4', 'staple', 'file'); optswap('0.4', 'hide', 'attach')
reblank('1.1', 'pinch', ['pinch', 'itch', 'ache', 'cramp'])
reblank('3.5', 'results', ['results', 'bill', 'room', 'discharge'])
reblank('8.4', 'still', ['still', 'tight', 'up', 'back'])
reblank('15.5', 'doctor', ['doctor', 'pharmacist', 'chaplain', 'transporter'])
reblank('11.5', 'swallows', ['swallows', 'coughs', 'pushes', 'breaths'])
reblank('19.4', 'worst', ['worst', 'best', 'easiest', 'quickest'])

# ------------------------------------------------------------ decoy
decoy('6.2', 'a loud', 'A shot and')
decoy('1.1', 'after just', 'a dull ache')
decoy('14.0', 'head tilted to', 'hand turned to')

# ------------------------------------------------------------ distractorsKo
for k, o, n in [
    ('4.2', '결과는 알려 드리지 않을 거예요', '결과는 의사 선생님이 알려 주실 거예요'),
    ('8.2', '결과가 정확하지 않아도 괜찮아요', '결과는 이틀쯤 뒤에 나와요'),
    ('8.3', '오염되어도 결과는 정확해요', '소독약이 마를 때까지 잠깐 기다릴게요'),
    ('9.2', '첫 투여는 혼자 해 보세요', '한 시간쯤 걸려 들어가요'),
    ('10.0', '혈액형은 확인하지 않아요', '수혈은 두 시간쯤 걸려요'),
    ('10.1', '열이 나도 괜찮으니 참아 주세요', '수혈 중에도 물은 드셔도 돼요'),
    ('12.1', '감염되지 않도록 소독은 생략할게요', '무릎을 세우고 다리를 벌려 주세요'),
    ('13.4', '라벨은 바뀌어도 괜찮아요', '검사 결과는 한 시간쯤 걸려요'),
    ('14.2', '방포는 만져서 정리하셔도 돼요', '얼굴 위로 천을 덮을게요'),
    ('15.1', '느끼시는 건 말씀 안 하셔도 돼요', '혈압을 다시 재 볼게요'),
    ('15.2', '수액을 끊고 퇴원 준비를 할게요', '혈액 팩은 혈액은행으로 돌려보낼게요'),
    ('16.1', '기도를 막으려고 약을 드릴게요', '산소를 더 올려 드릴게요'),
    ('16.2', '제 목소리는 듣지 말고 숨을 참으세요', '다리를 조금 올려 드릴게요'),
    ('17.2', '정신 놓으셔도 괜찮아요, 수액은 나중에 넣어요', '가족분께 연락드렸어요'),
    ('18.0', '약물, 용량, 농도는 확인하지 않아도 돼요', '약국에 농도를 물어볼게요'),
    ('18.2', '15유닛을 제가 정했으니 확인은 필요 없어요', '혈당을 한 번 더 재 볼게요'),
    ('18.4', '확인은 건너뛰고 바로 투여해요', '처방을 다시 띄워 볼게요'),
    ('18.5', '그건 괜찮아요, 속도가 우선이에요', '이 일은 기록해 둘게요'),
    ('19.1', '제 손을 놓으세요, 진통제를 뺄게요', '숨을 천천히 내쉬어 보세요'),
    ('19.3', '제 곁을 떠나도 괜찮아요, 잘 못하고 계세요', '엑스레이를 곧 찍을 거예요'),
    ('20.3', '활력징후는 보고하지 않을게요', '가온기를 연결할게요'),
    ('20.4', '지금 담당의 없이 비율을 정해요', '칼슘 수치를 확인해 볼게요'),
    ('20.5', '다음 보냉함이 오면 말하지 마세요', '빈 혈액 팩은 모아 두세요'),
    ('3.4', '기록이 끝나면 말씀하지 마세요', '기록이 끝나면 스티커를 뗄게요'),
    ('2.1', '처음 나오는 소변을 컵에 받아 주세요', '뚜껑 안쪽은 만지지 마세요'),
    ('8.1', '소독 전에는 만지지 마세요', '소독약이 조금 차가울 수 있어요'),
    ('10.2', '마지막 15분에만 지켜볼게요', '수혈 중에도 화장실은 가실 수 있어요'),
    ('10.3', '이렇게 하면 혈액이 대략 맞는지 확인돼요', '이렇게 하면 수혈이 더 빨리 끝나요'),
    ('13.5', '검사실로 보낸 뒤에 라벨을 확인할게요', '결과는 담당 의사에게 갈 거예요'),
    ('14.1', '잠드는 약이 들어가고 나면 압박감이 있어요', '시술은 30분쯤 걸려요'),
    ('14.1', '압박감이 먼저 오고 마취약이 들어가요', '얼굴은 천으로 덮어 둘게요'),
    ('17.1', '강한 압박감이 느껴지면 알려 주세요', '다리를 곧게 펴 주세요'),
    ('18.4', '투여한 다음에 멈추고 확인해봐요', '약국에 전화해 볼게요'),
    ('19.4', '가장 좋은 부분은 거의 끝났어요', '곧 엑스레이를 찍을 거예요'),
]:
    dko(k, o, n)

# ------------------------------------------------------------ 문장 아이콘
for k, o, n in [('7.3', 'siren', 'shield'), ('19.4', 'chartup', 'star'), ('11.4', 'handshake2', 'faceWorried')]:
    assert sent(k)['icon'] == o, k
    sent(k)['icon'] = n


# ------------------------------------------------------------ context word·ko
def ctx(si):
    c = [x for x in S[si]['nuance'] if x['kind'] == 'context']
    assert len(c) == 1
    return c[0]


for si, ow_, nw, nk in [
    (1, 'start', None, '(정맥로를) 잡다'),
    (2, 'sample', 'specimen', None),
    (4, 'test', 'labs', '(혈액) 검사'),
    (9, 'allergic', 'allergy', '알레르기'),
    (11, 'tube', 'NGT', '비위관'),
    (12, 'okay', 'consent', '동의'),
    (17, 'bone', 'IO', '골내 주사'),
]:
    c = ctx(si)
    assert c['word'] == ow_, (si, c['word'])
    if nw: c['word'] = nw
    if nk: c['ko'] = nk


# ------------------------------------------------------------ order
def line(si, idx, en=None, ko=None, note=None, icon=None):
    l = S[si]['order']['lines'][idx]
    if en: l['en'] = en
    if ko: l['ko'] = ko
    if note: l['note'] = note
    if icon: l['icon'] = icon


def ow(si, w):
    S[si]['order']['why'] = w


line(1, 1, "I know that can feel scary, so I'll tell you each step.", '그게 무서울 수 있다는 거 알아요, 단계마다 말씀드릴게요')
ow(1, '무엇을 하는지 먼저 알리고, that으로 앞 줄의 바늘을 받아 무서울 수 있다는 감정을 인정한 뒤, 따끔함이 오는 순간을 알리고, 끝나고 격려합니다. 감정을 인정하는 줄은 가리킬 바늘이 앞에 있어야 해서 첫 줄 뒤에 와요.')

line(3, 2, "Since it doesn't hurt, please stay still for ten seconds to let it listen clearly.", '아프지 않으니, 잘 들리도록 10초만 가만히 계세요')
ow(3, '붙이는 이유를 알리고, 아프지 않고 듣기만 한다고 안심시킨 뒤, Since it does not hurt로 그 안심을 이어받아 잘 들리도록 가만히 있어 달라고 부탁하고, 끝나면 결과 시점을 알려요. 각 줄이 앞 줄의 말을 이어받아요.')

line(4, 2, 'Once we have them, the doctor will explain everything.')
line(4, 3, "Until the doctor does, you're not alone — we're working on this together.", '의사 선생님이 설명하실 때까지 혼자가 아니에요, 함께해요')
ow(4, '검사의 목적을 먼저 알리고, 기다림의 부담에 공감하며 결과를 알려 주겠다고 약속하고, 결과가 나오면 의사가 설명할 것을 말한 뒤, Until the doctor does(does는 앞 줄의 explain)로 그 설명이 나올 때까지 함께한다고 마무리해요. 뒤 줄이 앞 줄의 말을 가리켜 순서가 하나예요.')

line(6, 3, "He's earned a sticker and a big high-five for that.", '그 일로 스티커와 하이파이브를 받을 만해요')
ow(6, '보호자가 아이를 안아 진정시키고, 진정되면 함께 셋을 세어 끝내고, 끝난 뒤 칭찬하고, for that으로 그 용감함에 스티커와 하이파이브를 알려요. 뒤 줄이 앞 줄의 결과를 가리켜 순서가 하나예요.')

line(7, 1, 'Good to know. Do you have any kidney problems or take metformin?', '알겠어요. 신장 문제가 있거나 메트포르민을 드시나요?')
line(7, 2, "If everything checks out, the dye may feel warm — that's normal.", '모두 괜찮으면 조영제가 따뜻하게 느껴질 수 있어요, 정상이에요')
ow(7, '과거 반응을 묻고, 그 답을 받아(Good to know) 이어 신장·메트포르민을 묻고, 모두 괜찮으면(If everything checks out) 따뜻한 느낌을 안내한 뒤, 그 느낌이 곧 지나간다고 마무리해요. 각 줄이 앞 줄의 대답이나 내용을 가리켜 순서가 하나예요.')

line(9, 1, "If not, I'll start the first dose of this antibiotic now.", '없다면 이 항생제 첫 투여를 지금 시작할게요')
line(9, 3, 'While I keep watching, tell me right away if you feel itchy or short of breath.', '제가 계속 지켜보는 동안 가렵거나 숨이 차면 바로 말씀하세요')
ow(9, '과거 알레르기 반응을 먼저 묻고, 없다면 첫 투여를 시작한다고 알리고, 투여 중 지켜본다고 말한 뒤, While I keep watching으로 그 지켜보기를 이어받아 증상을 바로 알려 달라고 해요. 각 줄이 앞 줄을 가리켜 순서가 하나예요.')

line(10, 2, "While it's running, tell me if you feel chills, itching, or back pain.", '수혈이 들어가는 동안 오한, 가려움, 등 통증이 있으면 말씀하세요')
ow(10, '두 사람이 환자 확인을 한 뒤 수혈을 시작해 처음 15분을 지켜보고, 수혈이 들어가는 내내(While it is running) 알려야 할 증상을 말하고, 그런 증상이 있으면 호출하라고 마무리해요. 각 줄이 앞 줄을 가리켜 순서가 하나예요.')

line(11, 3, "Once that feeling eases, we're almost through — just a few more swallows.", '그 느낌이 가라앉으면 거의 다 왔어요, 몇 번만 더 삼켜 주세요')
ow(11, '관의 경로를 설명하고, 삼키는 신호를 알리고, 삼키는 것이 불편하다고 공감한 뒤, that feeling으로 그 불편을 받아 가라앉으면 거의 끝났다고 격려해요. 뒤 줄이 앞 줄의 내용을 가리켜 순서가 하나예요.')

line(14, 1, "Once you're in position, these drapes keep everything sterile, so try not to touch them.", '자세가 잡히면 이 방포가 모든 걸 무균으로 지켜 주니 만지지 말아 주세요', '무균', 'bandage')
line(14, 2, "Under them, you'll feel some numbing medicine, then pressure.", '그 아래에서 마취약, 그다음 압박감이 느껴져요', '감각', 'bulb')
ow(14, '자세를 잡고, 자세가 잡히면 방포를 덮고 만지지 말라고 하고, Under them으로 그 방포 아래에서 느낄 마취와 압박을 안내하고, 끝으로 곁에서 격려해요. 방포는 마취 전에 덮이므로 이 순서가 임상과 맞고, 뒤 줄이 앞 줄을 가리켜 순서가 하나예요.')

line(16, 2, 'Your throat may feel tight, but the medicine should start working soon.', '목이 조일 수 있지만 약이 곧 듣기 시작할 거예요')
line(16, 3, 'While that tightness eases, focus on my voice and try to breathe slowly.', '그 조임이 풀리는 동안 제 목소리에 집중하고 천천히 숨 쉬세요')
ow(16, '상황을 알리고, 약을 주고, 목이 조일 수 있지만 약이 곧 듣는다고 증상을 인정하고, that tightness가 풀리는 동안 호흡을 안내해요. 뒤 줄이 앞 줄을 가리켜 순서가 하나예요.')

line(17, 2, "Once it's in, we'll get fluids into you right away.", '들어가면 바로 수액을 넣을 거예요')
line(17, 3, 'Hang on — those fluids will work fast, I promise.', '조금만 버텨요, 그 수액이 빨리 효과가 있을 거예요')
ow(17, '정맥을 못 찾아 뼈로 관을 놓는다고 알리고, 들어가며 느끼는 압박을 안내하고, 들어가면 바로 수액을 넣는다고 알리고, those fluids로 그 수액이 곧 효과가 난다고 격려해요. 뒤 줄이 앞 줄을 가리켜 순서가 하나예요.')

line(19, 0, 'The doctor is placing the chest tube now, so you\'ll feel numbing medicine, then pushing pressure.', '의사 선생님이 지금 흉관을 넣고 있어요, 마취약 뒤에 압박감이 있어요')
line(19, 3, 'Once your lung has expanded, the worst part is over — stay with me.', '폐가 펴지고 나면 가장 힘든 부분은 끝나요, 곁에 있어요')
ow(19, '의사가 관을 넣는다고 알리며 마취와 압박을 안내하고, 압박이 세면 손으로 신호하게 하고, 관이 들어가면 폐가 펴진다고 설명하고, Once your lung has expanded로 그 결과를 받아 힘든 고비가 지났다고 격려해요. 뒤 줄이 앞 줄을 가리켜 순서가 하나예요.')

line(20, 3, "While they decide, I'll keep reporting vitals every five minutes.", '그분이 정하는 동안 5분마다 활력징후를 계속 보고할게요')
ow(20, '첫 유닛을 걸고, 현장 의사에게 다음 유닛들의 비율을 묻고, 그 비율을 담당의와 확인하자고 하고, While they decide(they는 앞 줄의 담당의)로 그 결정을 기다리는 동안 활력징후를 보고해요. 뒤 줄이 앞 줄을 가리켜 순서가 하나예요.')

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
