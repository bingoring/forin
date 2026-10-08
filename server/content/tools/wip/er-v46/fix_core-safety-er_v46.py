import yaml, re
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'core-safety-er.yaml'
d = yaml.safe_load(open(F))
S = d['situations']


def sent(key):
    s, j = key.split('.')
    return S[int(s) - 1]['sentences'][int(j)]


def opt_replace(key, repl):
    """repl: {old_en: (new_en, new_icon)} — 위치를 지키며 오답만 바꾼다."""
    b = sent(key)['blank']
    seen = set()
    for o in b['options']:
        if o['en'] in repl:
            n, i = repl[o['en']]
            seen.add(o['en'])
            o['en'], o['icon'] = n, i
    assert seen == set(repl), (key, set(repl) - seen)


def opt_icon(key, en, icon):
    b = sent(key)['blank']
    hit = [o for o in b['options'] if o['en'] == en]
    assert len(hit) == 1, (key, en)
    hit[0]['icon'] = icon


def respec(key, answer, opts):
    """정답까지 바꾸는 빈칸: 위치(회전)를 지키려 기존 정답 자리에 새 정답을 둔다."""
    b = sent(key)['blank']
    pos = [o['en'] for o in b['options']].index(b['answer'])
    others = list(opts)
    new = []
    for k in range(4):
        new.append(None)
    # opts: [(en, icon)] 정답 포함 4개, 정답은 첫 요소
    ans = opts[0]
    rest = opts[1:]
    out, r = [], iter(rest)
    for k in range(4):
        out.append({'en': ans[0], 'icon': ans[1]} if k == pos else {'en': (x := next(r))[0], 'icon': x[1]})
    b['answer'] = answer
    b['options'] = out


# ---------------------------------------------------------------- 빈칸 오답 (문장별 48)
opt_replace('1.1', {'phone number': ('room number', 'hospital'), 'home address': ('bed number', 'home')})
opt_replace('1.3', {'almost': ('sometimes', 'chartup')})
respec('1.4', 'mixing up', [('mixing up', 'faceWorried'), ('picking up', 'pushpin'), ('cheering up', 'star'), ('backing up', 'chevronLeft')])
opt_replace('2.2', {'sell': ('rent', 'board'), 'paint': ('store', 'lock'), 'break': ('fix', 'gear')})
opt_replace('2.3', {'wash': ('lower', 'chevronDown'), 'paint': ('measure', 'monitor'), 'borrow': ('treat', 'bandage')})
opt_replace('2.5', {'hobby': ('discharge', 'plane'), 'address': ('diet', 'coffee'), 'lunch': ('visitors', 'handshake2')})
opt_replace('3.0', {'painting': ('raising', 'chevronUp'), 'breaking': ('moving', 'compass'), 'selling': ('cleaning', 'bandage')})
opt_replace('3.3', {'tall': ('unlocked', 'lock'), 'wet': ('empty', 'cross')})
respec('3.5', 'alone', [('alone', 'me'), ('together', 'handshake2'), ('slowly', 'chevronDown'), ('later', 'calendar')])
opt_replace('3.6', {'bills': ('blood clots', 'pushpin'), 'noise': ('delirium', 'faceWorried')})
opt_replace('3.7', {'brand': ('sheets', 'bandage'), 'color': ('blanket', 'home'), 'price': ('pillow', 'star')})
respec('4.0', 'allergic', [('allergic', 'siren'), ('addicted', 'pill'), ('immune', 'shield'), ('used', 'redo')])
opt_replace('5.3', {'eat': ('return', 'arrowRight'), 'pray': ('rest', 'coffee'), 'argue': ('chat', 'speech')})
opt_replace('5.4', {'rumors': ('factors', 'gear'), 'hobbies': ('medications', 'pill'), 'snacks': ('injuries', 'bandage')})
opt_replace('6.0', {'sleepy': ('talkative', 'speech')})
opt_replace('7.2', {'color': ('room', 'home'), 'price': ('nurse', 'stetho'), 'shape': ('shift', 'calendar')})
opt_replace('7.3', {'empty': ('different', 'gear'), 'cold': ('familiar', 'home'), 'tall': ('safe', 'shield')})
opt_replace('7.4', {'menu': ('brand', 'pushpin'), 'music': ('price', 'chartup'), 'weather': ('color', 'star')})
opt_replace('8.2', {'sell': ('delete', 'cross')})
opt_replace('8.5', {'fake': ('middle', 'compass')})
opt_replace('9.1', {'shape': ('room', 'home'), 'price': ('diagnosis', 'stetho'), 'color': ('doctor', 'me')})
opt_replace('9.3', {'paint': ('shake', 'bell'), 'kick': ('open', 'lock'), 'sing': ('warm', 'coffee')})
opt_replace('9.4', {'while': ('unless', 'cross')})
opt_replace('10.0', {'sings': ('itches', 'bandage'), 'sleeps': ('tickles', 'star'), 'smiles': ('happened', 'calendar')})
opt_replace('10.1', {'paint': ('turn', 'redo'), 'comb': ('lift', 'chevronUp'), 'wash': ('shake', 'bell')})
opt_replace('10.3', {'dessert': ('fever', 'monitor'), 'weather': ('allergy', 'shield'), 'visitor': ('infection', 'lab')})
opt_replace('10.5', {'sing': ('worry', 'faceWorried'), 'laugh': ('forget', 'bulb'), 'joke': ('argue', 'faceAngry')})
opt_replace('11.2', {'wash': ('replace', 'redo'), 'sell': ('pad', 'bandage')})
opt_replace('13.3', {'add': ('leave', 'plane'), 'paint': ('count', 'monitor'), 'wash': ('show', 'magnify')})
respec('14.0', 'Time-out', [('Time-out', 'monitor'), ('Hand-off', 'handshake2'), ('Check-in', 'check'), ('Debrief', 'speech')])
opt_replace('14.1', {'small': ('bilateral', 'compass'), 'new': ('spare', 'star')})
opt_replace('14.4', {'sing': ('continue', 'arrowRight'), 'laugh': ('hurry', 'plane')})
opt_replace('15.0', {'flat': ('normal', 'check')})
opt_replace('15.1', {'sleepy': ('comfortable', 'home')})
opt_replace('15.5', {'secret': ('long', 'chevronRight'), 'funny': ('late', 'calendar')})
opt_replace('16.0', {'strange': ('different', 'faceWorried'), 'famous': ('long', 'chevronUp'), 'funny': ('short', 'chevronDown')})
opt_replace('17.0', {'haircut': ('wrap', 'redo'), 'shampoo': ('cover', 'lock'), 'tattoo': ('bandage', 'bandage')})
opt_replace('17.3', {'sleeping': ('clotting', 'lab'), 'laughing': ('itching', 'bandage'), 'singing': ('sweating', 'monitor')})
opt_replace('18.0', {'zero': ('only', 'pushpin')})
opt_replace('18.2', {'weather': ('annual', 'calendar'), 'lunch': ('expense', 'chartup'), 'menu': ('audit', 'magnify')})
opt_replace('18.3', {'angry': ('unstable', 'chevronDown'), 'noisy': ('sedated', 'pill'), 'sticky': ('discharged', 'plane')})
opt_replace('19.1', {'taxi': ('ramp', 'chevronUp'), 'ladder': ('key', 'lock')})
opt_replace('19.3', {'sing': ('talk', 'speech'), 'sleep': ('see', 'magnify'), 'swim': ('hear', 'speaker')})
opt_replace('19.4', {'paint': ('leave', 'plane'), 'sell': ('wake', 'bell'), 'drop': ('bathe', 'bandage')})
opt_replace('19.5', {'menu': ('time', 'monitor'), 'color': ('schedule', 'calendar'), 'price': ('supplies', 'lab')})
opt_replace('20.1', {'rare': ('moderate', 'compass'), 'old': ('minor', 'pushpin')})
opt_replace('20.2', {'color': ('shift', 'calendar'), 'seat': ('break', 'coffee'), 'lunch': ('schedule', 'board')})
opt_replace('20.5', {'sell': ('skip', 'chevronRight')})

# ---------------------------------------------------------------- 정답 아이콘 (문장 아이콘과 겹친 것 + 같은 아이콘이 둘인 선택지)
ANS_ICON = {
    '1.0': 'mic', '1.1': 'baby', '1.3': 'redo', '2.4': 'check', '3.1': 'play', '4.1': 'chartup',
    '4.4': 'monitor', '4.5': 'chartup', '5.4': 'lock', '6.1': 'arrowRight', '6.4': 'monitor',
    '7.1': 'magnify', '7.2': 'lab', '8.0': 'pencil', '8.2': 'redo', '8.3': 'check', '9.1': 'mic',
    '9.5': 'lock', '10.0': 'stetho', '10.1': 'faceWorried', '10.4': 'speech', '11.1': 'monitor',
    '11.2': 'cross', '11.4': 'mic', '12.0': 'lock', '12.1': 'hospital', '12.4': 'hospital',
    '13.0': 'lock', '13.1': 'pushpin', '13.2': 'shield', '14.1': 'chevronRight', '14.2': 'check',
    '15.2': 'play', '16.0': 'handshake2', '16.3': 'hospital', '16.5': 'redo', '17.0': 'magnify',
    '17.1': 'stetho', '17.2': 'magnify', '17.3': 'cross', '17.5': 'arrowRight', '18.0': 'siren',
    '18.5': 'handshake2', '19.5': 'board', '20.2': 'me',
}
for k, ic in ANS_ICON.items():
    b = sent(k)['blank']
    opt_icon(k, b['answer'], ic)
# 11.5 정답 calmer: 걱정 얼굴 -> me / 13.2 오답 judge: scalpel -> board
opt_icon('11.5', 'calmer', 'me')
opt_icon('13.2', 'judge', 'board')

# ---------------------------------------------------------------- decoy 3
sent('1.0')['decoy'] = 'your nickname'
sent('13.0')['decoy'] = 'the room messy'
sent('13.5')['decoy'] = 'to punish you'

# ---------------------------------------------------------------- distractorsKo 4
def dko(key, idx, new):
    sent(key)['distractorsKo'][idx] = new
dko('7.2', 0, '약은 제가 혼자 준비할게요')
dko('8.5', 1, '임시 밴드를 지금 빼 드릴게요')
dko('11.5', 1, '억제대를 더 단단히 묶을게요')
sent('17.2')['distractorsKo'] = ['두통이 있으세요?', '언제 넘어지셨어요?']

# ---------------------------------------------------------------- why · tag · icon
sent('2.5')['why'] = ("Let's talk about …은 지시가 아니라 함께 이야기하자는 제안의 모양이에요. before you get up on your own을 붙여 "
                      "혼자 일어나시기 전에 위험부터 함께 짚자는 말로 들리게 해요.")
sent('9.4')['why'] = ("Always로 예외 없는 규칙임을 말해요. before you label은 라벨을 붙이기 전이라는 순서를 정해요. "
                      "다만 병실·침상 번호는 환자 식별자가 아니라서, 실제 환자 확인은 손목밴드의 이름과 생년월일로 해요.")
sent('10.1')['why'] = sent('10.1')['why'].replace('가장 먼저 묻는 항목', '꼭 묻는 항목'); assert '꼭 묻는 항목' in sent('10.1')['why']
sent('18.3')['why'] = ("First로 첫 순서가 환자의 안전임을 분명히 해요. 투약 사고 뒤 첫 순서는 보고가 아니라 환자의 상태예요. "
                       "환자부터 지켜야 이어지는 조치와 보고도 의미가 있어요.")
w30 = sent('3.0')['why']
sent('3.0')['why'] = w30.replace('침대를 낮추고 난간을 올리는 것은 낙상 예방의 기본 설정이에요.', '병원 지침에 따라 침대를 낮추고 난간을 올려 낙상을 예방해요.')
assert sent('3.0')['why'] != w30
sent('7.1')['why'] = ("verify는 직접 대조해 확인한다는 동사예요. with me로 혼자 확인하지 않고 두 번째 간호사의 확인을 청해요. "
                      "고위험약은 두 사람이 각자 따로 대조하는 독립 이중 확인이 원칙이에요.")
sent('1.4')['why'] = ("prevent A from -ing는 A가 …하지 못하게 막는다는 구조예요. mix up은 둘을 뒤바꿔 혼동한다는 구동사예요. "
                      "확인의 목적을 알려 주면 되풀이되는 질문도 환자가 이해해요.")
sent('4.0')['why'] = ("you're allergic to …로 밴드에 적힌 내용을 먼저 말하고 correct?로 맞는지 묻는 방식이에요. "
                      "환자는 맞다·아니다만 답하면 되고, 밴드와 본인 말이 어긋나는지도 바로 드러나요.")
sent('7.2')['tag'] = '복창 요청'
sent('13.4')['tag'] = '곁 지키기'
sent('6.2')['tag'] = '침상 유지'

# ---------------------------------------------------------------- order
def order(si, **kw):
    o = S[si - 1]['order']
    for k, v in kw.items():
        if k == 'lines':
            for idx, (en, ko, note, icon) in v.items():
                l = o['lines'][idx]
                l['en'] = en
                if ko: l['ko'] = ko
                if note: l['note'] = note
                if icon: l['icon'] = icon
        else:
            o[k] = v

order(3, lines={2: ('So please call me before you try to get up.', '그러니 일어나려 하기 전에 먼저 저를 불러 주세요', None, None)},
      why='침대를 먼저 설정하고, 호출벨을 알려 준 뒤, 그러니 일어나기 전에 먼저 저를 부르라고 요청하고, 떠나기 전 마지막으로 높이를 확인해요. 앞 줄이 뒤 줄의 전제라 순서가 하나예요.')
order(5, lines={2: ('With the oxygen on, please stay lying down while we move you.', '산소를 연결했으니 옮기는 동안 누워 계세요', None, None)},
      why='출발 전에 줄을 확인하고, 산소통이 찼음을 이어서(too) 알리고, 그 산소를 연결한 채 이동 중 자세를 요청하고(With the oxygen on이 앞 줄을 받아), 도착 뒤 팀이 앉는 것을 돕는 시간 순서예요.')
order(6, lines={0: ("You're a bit unsteady, so for now, please stay in bed.", '조금 불안정하시니 지금은 침대에 계세요', '상태', 'me'),
                1: ('If you need to get up, press this button.', '일어나야 하시면 이 버튼을 누르세요', '호출', 'bell'),
                2: ("I'll come right away and help you move.", '바로 가서 옮기는 걸 도와드릴게요', '약속', 'handshake2'),
                3: ('Let me remind you again: stay in bed and call first.', '다시 한번 알려드릴게요, 침대에 계시고 먼저 불러 주세요', '재안내', 'speech')},
      why='상태를 말하며 침대에 있으라고 먼저 요청하고, 일어나야 하면 버튼을 누르라고 알리고, 누르면 바로 와서 돕겠다고 약속하고, 마지막으로 다시 한번 짚어요. 3줄은 2줄의 버튼을 전제로 하고 4줄의 again이 앞 안내를 가리켜 순서가 하나예요.')
order(7, lines={2: ('Good — the concentration matches. Now right patient, right dose — read it back to me.', '좋아요, 농도가 맞네요. 이제 환자와 용량을 다시 읽어 주세요', None, None)},
      why='비슷한 이름부터 가려내고, 농도를 같이 대조한 뒤, 농도가 맞는다는 확인(the concentration matches)을 받아 5 rights를 읽어 확인하고, 모두 일치하면 투약해요. 3줄이 2줄의 농도 대조를 전제로 해서 순서가 하나예요.')
order(8, lines={2: ('Then label all samples with the ID on that band.', '그다음 모든 검체에 그 밴드의 번호로 라벨을 붙여요', None, None)},
      why='먼저 임시 이름으로 등록하고, 임시 밴드를 채운 뒤, 그 밴드의 번호(that band)로 검체에 라벨을 붙이고, 신원이 확인되면 기록을 갱신해요. 앞 단계가 있어야 다음 단계의 임시 번호가 생겨서 순서가 하나예요.')
order(9, lines={0: ('First, check her wristband — name and date of birth.', '먼저 손목밴드의 이름과 생년월일을 확인해요', '밴드', 'bandage')},
      why='손목밴드의 두 가지 식별자(이름·생년월일)를 먼저 확인하고, 이름과 오더를 읽어 맞춘 뒤, 그 자리에서 라벨을 붙이고, 마지막에 이유를 정리해요. 병실·침상 번호는 환자 식별자가 아니라서 밴드로 확인해요. 앞 단계가 뒤 단계의 조건이라 순서가 하나예요.')
order(10, lines={2: ('Okay, let me check your head and body before we move you up.', '좋아요, 옮기기 전에 머리와 몸을 살펴볼게요', None, None)},
      why='먼저 움직이지 않게 하고 통증 부위를 묻고, 머리를 부딪혔는지 이어서 묻고, 그 답을 바탕으로(Okay) 옮기기 전에 머리와 몸을 직접 살핀 뒤, 보고와 계획 갱신으로 마무리해요.')
order(11, lines={1: ("He's still pulling at his lines, so the restraints stay on for now.", '아직 줄을 잡아당겨서 억제대는 지금 그대로 둬요', '유지', None),
                 2: ("As soon as he's calmer, we'll remove them.", None, None, None)},
      why='일시적이고 목적이 줄을 지키는 것이라 말하고, 아직 줄을 당기니 지금은 유지한다고 하고, 진정되면 푼다고 하고, 푼 다음 피부를 다시 확인해요. still … for now는 풀기 전, As soon as he is calmer는 풀기 위한 조건, Then … again은 푼 뒤라서 순서가 하나예요.')
order(12, lines={1: ('First, wash your hands well before you go in.', '먼저 들어가기 전에 손을 잘 씻으세요', '손 씻기', 'me'),
                 2: ('Then put on this gown, gloves, and mask.', '그다음 이 가운, 장갑, 마스크를 착용하세요', '보호구', 'shield')},
      why='이유를 먼저 설명하고, 들어가기 전에 손을 씻은 다음 가운·장갑·마스크를 착용하게 하고, 나올 때 다시 씻는 것으로 마무리해요. First … Then이 순서를 못 박고 again이 2줄의 손 씻기를 가리켜 순서가 하나예요.')
order(13, lines={3: ('If you need anything, just tell them or me.', '필요한 게 있으면 그분들이나 저에게 말씀하세요', None, None)},
      why='먼저 벌이 아니라고 안심시키고(So가 이어받아) 위험물을 치우는 이유를 말하고, 곁을 지킨다고 약속하고, 마지막으로 필요하면 곁의 사람이나 저에게 말하라고 해요. them이 3줄의 someone을 가리켜 순서가 하나예요.')
order(14, lines={0: ('Time-out: John Reyes, born in 1962, right chest tube.', '타임아웃, 존 레예스 씨, 1962년생, 오른쪽 흉관이에요', None, None),
                 2: ("If any of that — patient, procedure, consent, or site — doesn't match, we stop right there.", '그중 하나라도 — 환자, 시술, 동의서, 부위 — 어긋나면 그 자리에서 멈춰요', None, None)},
      why='환자(이름·생년)와 시술을 먼저 말하고, 동의서와 표시를 보고한 뒤, 그 모두 중 하나라도 어긋나면 멈춘다는 규칙을 말하고(any of that이 앞 줄을 받아), 마지막으로 모두의 동의를 받아 시작해요.')
order(15, lines={2: ('With all of that, I need eyes on her now — this is a rapid response.', '이 모든 걸 보고 지금 봐주셔야 해요, 신속대응이에요', None, None)},
      why='수치의 변화를 먼저 알리고, Also로 이어 증상을 말하고, 그 모두를 근거로(With all of that) 신속대응을 요청한 뒤, 팀이 도착하면 정리해서 보고해요.')
order(16, lines={3: ('Then match it to the wristband before we act.', '그다음 행동 전에 그 번호를 손목밴드와 맞춰 봐요', None, None)},
      why='혼잡과 비슷한 이름이라는 문제를 먼저 말하고, So로 속도를 늦추자고 제안한 뒤, 기록번호 확인을 요청하고, Then으로 그 번호(it)를 밴드와 맞춰 보는 것까지 이어요.')
order(17, lines={3: ('While we watch, tell us right away if anything changes.', '지켜보는 동안 변화가 있으면 바로 말씀해 주세요', None, None)},
      why='스캔이 필요한 이유를 먼저 말하고, 기다리는 동안 신경 증상을 묻고, 촬영 뒤 관찰을 알리고, 지켜보는 동안(While we watch) 변화가 있으면 바로 알려 달라고 당부해요. 시간 순서라 하나예요.')
order(18, lines={2: ("Once she's stable, I'll complete an incident report.", '환자가 안정되면 사건 보고서를 작성할게요', None, None)},
      why='환자의 안전을 먼저 확보하고, 상태 관찰과 의사 통보를 하고, 안정되면(Once she is stable) 보고서를 쓰고, 보고서에 사실대로 적는다는 순서예요. in the report가 앞 줄의 보고서를 가리켜 순서가 하나예요.')

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
