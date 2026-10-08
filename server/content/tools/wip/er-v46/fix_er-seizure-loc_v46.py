import yaml, re, sys
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-seizure-loc.yaml'
d = yaml.safe_load(open(F))
S = d['situations']


def sent(key):
    s, j = key.split('.')
    return S[int(s)]['sentences'][int(j)]


def f(key, **kw):
    s = sent(key)
    for k, v in kw.items():
        assert k in s, (key, k)
        s[k] = v


def sub(key, field, old, new):
    s = sent(key)
    assert old in s[field], (key, field, old)
    s[field] = s[field].replace(old, new)


def rep(key, mapping):
    """빈칸 선택지에서 old -> new (정답 자리와 나머지 순서 유지)."""
    b = sent(key)['blank']
    for o in b['options']:
        if o['en'] in mapping:
            o['en'] = mapping.pop(o['en'])
    assert not mapping, (key, mapping)
    chk(key)


def newblank(key, answer, others):
    """정답 자리는 기존 위치 유지, 나머지는 others 순서대로."""
    b = sent(key)['blank']
    pos = [o['en'] for o in b['options']].index(b['answer'])
    it = iter(others)
    b['options'] = [{'en': answer} if k == pos else {'en': next(it)} for k in range(4)]
    b['answer'] = answer
    chk(key)


def chk(key):
    s = sent(key)
    b = s['blank']
    opts = [o['en'] for o in b['options']]
    assert len(set(opts)) == 4 and b['answer'] in opts, key
    assert all(set(o) == {'en'} for o in b['options']), key
    assert len(re.findall(r'(?<![A-Za-z\'])' + re.escape(b['answer']) + r'(?![A-Za-z\'])', s['en'])) == 1, (key, b['answer'])


# ======================= context 장면 정비 (14)
def ctx(i):
    return next(n for n in S[i]['nuance'] if n['kind'] == 'context')


def scene(i, k, en=None, fix=None):
    sc = ctx(i)['scenes'][k]
    if en is not None:
        sc['en'] = en
    if fix is not None:
        assert sc['ok'] is False
        sc['fix'] = fix


def cw(i, word=None, ko=None, why=None):
    c = ctx(i)
    if word:
        c['word'] = word
    if ko:
        c['ko'] = ko
    if why:
        c['why'] = why


# S0 seizure (유지)
scene(0, 1, en='His wife says he had a seizure — his whole body shook for about a minute.')
scene(0, 2, fix='During the seizure, was his whole body shaking, or just one side?')
# S3
cw(3, 'restrain', '억지로 누르다')
scene(3, 0, en="Don't restrain him or put anything in his mouth — he can't swallow his tongue.")
# S5
cw(5, 'cause', '원인', 'workup·structural/metabolic은 의료진의 말이에요. 환자에게는 무슨 검사를 왜 하는지를 쉬운 말로 알려요.')
scene(5, 0, en="We'll do some tests to find the cause of this.")
scene(5, 1, en='First-time seizure, no obvious cause — labs and CT pending.')
scene(5, 2, en='We need a workup to rule out structural or metabolic causes.')
# S6
cw(6, 'confused', '혼란스러운')
scene(6, 0, en="You had a seizure, and you're a little confused. You're safe here.")
scene(6, 1, en='Postictal, confused, oriented x1, reoriented frequently.')
scene(6, 2, en="You're postictal, confused, and disoriented to time and place.")
# S7 nonadherent (유지)
scene(7, 1, en="He's been nonadherent — stopped his Keppra a week ago, and neuro wants it restarted.")
# S10
cw(10, 'vision', '시야')
scene(10, 0, en='34 weeks, BP 168/112, headache and vision changes — concern for preeclampsia with severe features.')
scene(10, 1, en='Is your vision blurry, or are you seeing spots or flashing lights?')
scene(10, 2, en='Any vision changes, such as scotomata or photopsia?')
# S11 postictal (유지)
scene(11, 0, en='Coworkers saw a few jerks, but she was back to baseline in seconds, no postictal phase.')
# S13
cw(13, 'naloxone', '날록손')
scene(13, 2, en="We're pushing naloxone to reverse the opioid toxidrome.",
      fix="We're giving him a medicine called naloxone that can reverse the drugs he took.")
# S14
cw(14, 'medicine', '약')
scene(14, 1, en='Seizure medicine history obtained via phone interpreter, ID 4721.')
# S15
cw(15, 'stop', '멈추다')
scene(15, 1, en='Seizing over five minutes — lorazepam 4 mg IV now to stop it, second dose ready.')
scene(15, 2, en="He's in status, so we're pushing benzos to stop it.")
# S16
cw(16, 'dropping', '떨어지는', 'sats·tube him은 팀 안에서 쓰는 줄임말이에요. 가족에게는 무엇이 떨어지고 있고 무엇을 하는지를 쉬운 말로 말해요.')
scene(16, 1, en='SpO2 dropping, 84% on NRB; BVM ventilation initiated.')
scene(16, 2, en='His sats are dropping into the 80s, so we need to tube him.')
# S17
cw(17, 'recheck', '다시 확인하다')
scene(17, 1, en="Your sugar is back up. We'll keep rechecking it, because it can drop again.")
scene(17, 2, en="Your BG has normalized; we'll recheck and trend it for recurrent hypoglycemia.",
      fix="Your sugar is back up, and we'll keep rechecking it in case it drops again.")
# S18
cw(18, 'stroke', '뇌졸중', 'neuroimaging·acute ischemic은 의료진의 말이에요. 발작 뒤 마비는 Todd 마비일 수 있지만 뇌졸중을 배제하기 전에는 단정하지 않고, 환자에게는 왜 스캔하는지를 쉬운 말로 알려요.')
scene(18, 2, en='We need neuroimaging to exclude an acute ischemic stroke.')
# S20
cw(20, 'support', '지지하다(돕다)')
scene(20, 2, fix="We're testing his blood and urine for drugs and supporting his breathing and heart.")


# ======================= order (14)
def line(i, k, en, ko, note=None, icon=None):
    ln = S[i]['order']['lines'][k]
    ln['en'] = en
    ln['ko'] = ko
    if note:
        ln['note'] = note
    if icon:
        ln['icon'] = icon


def owhy(i, why):
    S[i]['order']['why'] = why


# O1 S0
line(0, 3, 'After those minutes, was he confused once it stopped?', '그 몇 분이 지나고 멈췄을 때 혼란스러워했나요?')
owhy(0, "먼저 목격자의 놀란 마음을 인정하고(First), 본 것을 말하게 한 뒤, 'that'이 가리키는 지속 시간을 묻고, 'those minutes'가 앞 답을 받아 멈춘 직후의 상태를 묻는 순서예요. 대명사와 앞 줄을 받는 말이 순서를 하나로 고정해요.")
# O2 S4
line(4, 3, 'Since that last dose, have you skipped or stopped any on your own?', '그 마지막 복용 이후에 임의로 거르거나 끊은 적이 있나요?')
owhy(4, "발작 기간을 묻고, 'for them'으로 그 발작의 약을 묻고, 'it'이 가리키는 약의 마지막 복용을 묻고, 'that last dose'를 받아 그 이후 거르거나 끊었는지 확인해요. 'them'·'it'·'that last dose'가 앞 줄을 가리켜 순서가 하나예요.")
# O3 S6
line(6, 1, "You're safe here, and the confusion from it will pass.", '여긴 안전하고, 그로 인한 혼란은 지나갈 거예요')
owhy(6, "있는 곳과 일어난 일을 알리고, 'it'이 가리키는 그 발작으로 인한 혼란은 지나갈 거라 안심시키고, 'Now'로 이름·날짜를 물어 지남력을 확인하고, 'Good'으로 받아 곧 다시 묻겠다고 예고해요. it·Now·Good이 순서를 고정해요.")
# O4 S7
line(7, 2, "Because of that risk, we'll check your medication level in your blood.", '그 위험 때문에 혈중 약 농도를 확인할게요')
owhy(7, "얼마나 끊었는지 묻고, 'That'이 그 중단을 가리켜 발작 유발 가능성을 알리고, 'that risk'로 그 위험을 받아 농도 검사를 잇고, 마지막에 앞으로 임의로 끊지 말라고 당부해요. That·that risk가 앞 줄을 가리켜 순서가 하나예요.")
# O5 S8
line(8, 3, 'Even with the medicine, tell me right away if you see or feel anything strange.', '약을 써도 이상한 게 보이거나 느껴지면 바로 말해 주세요')
owhy(8, "마지막 음주를 묻고, 'after you stop'으로 손 떨림이 금단일 수 있다고 알리고, 'it'이 가리키는 증상이 심해지지 않게 약을 주고, 'Even with the medicine'으로 약을 써도 이상하면 바로 알리게 해요. it과 the medicine이 앞 줄을 가리켜 순서가 하나예요.")
# O6 S9
line(9, 1, "Right now, though, she's breathing well and starting to recover.", '그래도 지금은 숨도 잘 쉬고 회복되기 시작했어요')
owhy(9, "부모의 놀람을 인정하고, 'though'로 그래도 지금은 숨을 잘 쉰다고 대비해 전하고, 'That kind of seizure'로 앞의 일을 가리켜 무해하다고 설명하고, 'For now'로 지금 하는 열 치료를 알려요. 앞 줄을 가리키는 말이 순서를 고정해요.")
# O7 S10
line(10, 1, "We're checking your blood pressure, and at that stage we're calling OB.", '혈압을 재고, 그 주수에는 산부인과도 부를게요')
line(10, 3, "Either way, we'll watch the baby's heart rate on the monitor too.", '어느 쪽이든 아기 심박수도 모니터로 지켜볼게요')
owhy(10, "주수를 묻고, 혈압은 바로 재면서 'at that stage'로 그 주수에는 산과를 부르고, 증상을 묻고, 'Either way'로 대답이 어떻든 아기도 본다고 마무리해요. at that stage와 Either way가 앞 줄을 가리켜 순서가 하나예요.")
# O8 S11
line(11, 2, 'Whatever they saw, how quickly did you feel clear afterward?', '그들이 뭘 봤든, 그 후 얼마나 빨리 정신이 맑아졌나요?')
owhy(11, "기절 전 전조를 묻고, 'while you were out'으로 그 사이 목격된 움직임을 묻고, 'Whatever they saw'로 목격자가 본 것과 상관없이 회복을 묻고, 마지막에 감별에 도움이 됐다고 정리해요. while you were out과 they가 앞 줄을 가리켜 순서가 하나예요.")
# O9 S12
line(12, 1, "That answer helps us read the electrolyte test I'm sending now.", '그 대답이 지금 보내는 전해질 검사를 읽는 데 도움이 돼요')
owhy(12, "수분 섭취를 묻고, 'That answer'로 그 답이 지금 보내는 전해질 검사를 읽는 데 쓰인다고 알리고, 나트륨이 낮다고 결과를 전하고, 'it'이 가리키는 수치를 천천히 올린다고 알려요. That answer와 it이 앞 줄을 가리켜 순서가 하나예요.")
# O10 S13
line(13, 1, "So we're helping him breathe and giving naloxone right now.", '그래서 지금 호흡을 돕고 날록손을 투여할게요')
line(13, 2, 'Even with that, we\'re checking if he needs a breathing tube.', '그래도 호흡 튜브가 필요한지 확인할게요')
line(13, 3, "Either way, the naloxone can wear off, so we'll keep watching him closely.", '어느 쪽이든 날록손 효과가 사라질 수 있어서 계속 지켜볼게요')
owhy(13, "눈과 호흡 소견을 보고하고, 'So'로 호흡을 돕고 날록손을 주겠다고 이어 알리고, 'Even with that'으로 그래도 튜브가 필요한지 보고, 'Either way'로 튜브가 필요하든 아니든 날록손 효과가 풀릴 수 있어 계속 지켜본다고 해요. So·that·Either way가 앞 줄을 가리켜 순서가 하나예요.")
# O11 S15
line(15, 1, "That makes it an emergency, so we're protecting his airway with oxygen.", '그래서 응급이라 산소로 기도를 보호하고 있어요', note='기도')
line(15, 2, 'Along with that, we\'re giving medication to stop the seizure.', '그와 함께 발작을 멈추는 약을 드리고 있어요', note='약', icon='pill')
line(15, 3, "Once it stops, he'll be very sleepy for a while.", '멈추고 나면 한동안 많이 졸려할 거예요', note='경과', icon='star')
owhy(15, "5분 넘은 시간을 알리고, 'That'이 가리키는 시간 때문에 응급이라며 기도 보호와 산소를 바로 시작하고, 'Along with that'으로 발작을 멈추는 약을 함께 주고, 'Once it stops'로 멈춘 뒤 한동안 졸려할 거라 알려요. That·Along with that·it이 앞 줄을 가리켜 순서가 하나예요.")
# O12 S16
line(16, 3, "With that tray ready, we can protect his airway.", '그 트레이가 준비되면 기도를 보호할 수 있어요')
owhy(16, "수치를 보고하고, 환기를 시작하고, 'While we do that'으로 삽관 준비를 지시하고, 'With that tray ready'로 준비한 트레이가 기도를 보호할 수 있게 한다고 말해요. While we do that과 that tray가 앞 줄을 가리켜 순서가 하나예요.")
# O13 S17
line(17, 3, "Good, you're answering—we'll still keep rechecking your sugar.", '좋아요, 대답하시네요. 그래도 혈당은 계속 다시 확인할게요')
owhy(17, "포도당을 주고, 'That'이 가리키는 처치로 곧 깨어날 것이라 알리고, 의식이 돌아오면 이름을 말하게 하고, 'Good, you're answering'으로 받아 그래도(still) 혈당은 계속 재확인한다고 잇는 순서예요. That과 Good이 앞 줄을 가리켜 순서가 하나예요.")
# O14 S20
line(20, 2, "Because we don't know, we're screening for toxins and supporting his breathing.", '모르니까 독성 검사를 하고 호흡을 지지하고 있어요')
line(20, 3, "Whatever the screen shows, we'll keep supporting him.", '검사에서 무엇이 나오든 계속 지지 치료를 할게요')
owhy(20, "빈 약병을 알리고, 'though'로 그래도 무엇을 먹었는지 정확히 모른다고 인정하고, 'Because we don't know'로 그 이유를 받아 독성 검사와 지지 치료를 하고, 'Whatever the screen shows'로 검사 결과와 상관없이 계속 돕겠다고 약속해요. though·Because we don't know·the screen이 앞 줄을 가리켜 순서가 하나예요.")

# ======================= why (W1~W7)
f('10.2', why='지금 하는 일과 부르는 사람을 함께 알려요. 임신 20주 이후의 경련에서 혈압이 높으면 자간증을 먼저 생각하고, 산과와 함께 바로 대응해요.')
f('9.2', why='Let\'s로 함께 한다는 느낌을 줘요. 열을 내리는 것은 아이를 편하게 하려는 것이고, 경련을 막지는 않아서 열의 원인을 찾는 일이 함께 가요.')
f('20.5', why='until we know more는 원인을 몰라도 치료를 멈추지 않는다는 뜻이에요. 원인을 알게 된 뒤에도 호흡·순환을 돕는 일은 이어져요.')
f('15.1', why='now로 지금 바로 치료한다는 점을 알려요. 지속 발작에는 벤조디아제핀을 먼저 쓰고, 정맥로가 없으면 근육이나 코 안으로 줘요.')
sub('16.1', 'why', '수치가 떨어지는 중이면 백밸브마스크로 직접 환기를 시작해요.', '호흡이 약해 산소만으로 수치가 오르지 않으면 백밸브마스크로 직접 환기해요.')
f('10.1', why='갑자기 생긴 얼굴·손 부기는 진단 기준은 아니지만 전자간증의 경고 신호일 수 있어 함께 물어요. 발 부기는 임신 중 흔해서 구별 가치가 낮아요.')
f('12.2', why='electrolytes 한 말로 나트륨·칼륨을 함께 말해 검사 이름을 늘어놓지 않아요. 의식이 흐린 환자에게 지금 하는 일을 알리면 협조가 쉬워요.')
sub('17.2', 'why', '인슐린이나 당뇨약 때문의 저혈당은', '인슐린이나 당뇨약 때문에 생긴 저혈당은')
# 카드 순서(공감 먼저)와 어긋나는 9.1 why의 "가장 먼저"만 뺀다(O6 지적)
sub('9.1', 'why', '지금 상태를 가장 먼저 전하면', '지금 상태를 전하면')

# ======================= 빈칸 (B1~B28)
rep('3.4', {'quiet': 'padded', 'sweet': 'warm'})
rep('4.1', {'snacks': 'precautions', 'drinks': 'steps'})
rep('4.2', {'shower': 'temperature', 'walk': 'pulse', 'breakfast': 'blood pressure'})
rep('5.0', {'quietly': 'poorly', 'quickly': 'less', 'loudly': 'more'})
rep('5.1', {'yearly': 'chronic', 'upcoming': 'childhood', 'daily': 'past'})
rep('5.2', {'errands': 'surgery', 'laundry': 'paperwork'})
rep('9.0', {'deadly': 'brief', 'contagious': 'inherited'})
rep('9.3', {'boring': 'painful', 'funny': 'serious', 'easy': 'strange'})
rep('10.0', {'pounds': 'months', 'inches': 'days'})
rep('11.0', {'embarrassed': 'nauseous', 'excited': 'sleepy'})
rep('11.1', {'loudly': 'well', 'politely': 'completely', 'angrily': 'often'})
rep('11.3', {'sleeping': 'skipping', 'laughing': 'slowing', 'resting': 'stopping'})
rep('11.5', {'angry': 'drowsy', 'hungry': 'dizzy', 'cheerful': 'weak'})
rep('13.0', {'wear': 'smoke', 'sell': 'inject'})
rep('13.3', {'abroad': 'upstairs', 'overseas': 'outside', 'downtown': 'elsewhere'})
rep('14.5', {'argue': 'decide', 'shop': 'agree', 'sing': 'think'})
rep('15.2', {'ignoring': 'checking', 'blocking': 'clearing', 'closing': 'suctioning'})
rep('15.5', {'bandage': 'cannula', 'tray': 'tube', 'belt': 'monitor'})
rep('16.0', {'closing': 'checking', 'blocking': 'clearing', 'filling': 'opening'})
rep('16.4', {'feeding': 'suctioning', 'washing': 'positioning', 'dressing': 'sedating'})
rep('20.5', {'stopping': 'monitoring', 'ignoring': 'testing', 'delaying': 'sedating'})
rep('12.3', {'boil': 'lose', 'spill': 'crave'})
rep('17.2', {'reduce': 'raise'})
rep('17.3', {'left': 'fainted', 'woke': 'ate'})
newblank('3.0', 'mouth', ['hand', 'pocket', 'arms'])
newblank('3.3', 'fingers', ['wallet', 'keys', 'phone'])
newblank('10.2', 'pressure', ['sugar', 'oxygen', 'count'])
newblank('15.3', 'five', ['two', 'ten', 'thirty'])
newblank('18.5', 'improving', ['spreading', 'worsening', 'returning'])
newblank('0.1', 'side', ['arm', 'leg', 'hand'])
rep('0.3', {'instead of': 'long after'})
rep('1.1', {'why': 'who', 'when': 'what'})
newblank('1.4', 'eyes', ['head', 'hand', 'nose'])
newblank('2.3', 'sugar', ['pressure', 'oxygen', 'count'])
newblank('16.3', 'oxygen', ['sugar', 'sodium', 'potassium'])
rep('8.1', {'never': 'still'})
newblank('20.3', 'took', ['mixed', 'hid', 'bought'])

# ======================= decoy (D1~D7)
f('1.0', decoy='your mouth')
f('3.1', decoy='on his back')
f('3.5', decoy='closed')
f('6.5', decoy='different questions')
f('13.0', decoy='bring')
f('20.5', decoy='waiting')
f('4.2', decoy='start taking')

# ======================= distractorsKo (K1~K6)
def dk(key, idx, new):
    sent(key)['distractorsKo'][idx] = new


dk('11.2', 0, '쓰러지기 전에 가슴이 아팠나요?')
dk('12.2', 1, '정맥주사를 하나 잡을게요')
dk('14.1', 0, '여기 아픈가요? 네, 아니요?')
dk('5.5', 0, '당분간은 운전하지 마세요')
dk('17.4', 0, '정신이 들면 뭘 좀 드시게 할게요')
dk('18.5', 0, '스캔 전까지는 아무것도 드시지 마세요')

# ======================= icon (I1, I2)
f('1.5', icon='me')
f('3.4', icon='cross')

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('saved')
