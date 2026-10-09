import yaml, copy
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'core-family-er.yaml'
d = yaml.safe_load(open(F))
S = d['situations']
before = copy.deepcopy(d)


def sent(s, j):
    return S[s]['sentences'][j]


def opt(s, j, repl):
    """오답 en만 바꾼다(위치 유지, icon 쓰지 않음). repl: {old: new}"""
    b = sent(s, j)['blank']
    seen = set()
    for o in b['options']:
        if o['en'] in repl:
            seen.add(o['en'])
            o['en'] = repl[o['en']]
            assert 'icon' not in o
    assert seen == set(repl), (s, j, set(repl) - seen)
    ens = [o['en'] for o in b['options']]
    assert len(set(ens)) == 4 and b['answer'] in ens


# why
sent(10, 2)['why'] = ("help most by -ing는 …하는 것이 가장 도움이 된다는 구조라, 막는 대신 할 수 있는 일을 쥐여 줘요. "
                      "팔·다리 처치 때 머리맡은 팀의 손과 덜 겹치고 환자가 보호자의 얼굴을 볼 수 있는 자리예요.")
sent(2, 1)['why'] = ("emergency contact는 차트에 등록된 연락 담당자라, 정보를 나눌 사람인지 가늠하는 첫 단서가 돼요. "
                     "예/아니오로 답하는 짧은 질문이라 긴장한 가족도 쉽게 대답해요.")
sent(17, 1)['why'] = ("When you're ready로 시작해 가족의 속도를 존중해요. a specialist는 기증을 전문으로 다루는 사람을 가리켜요. "
                      "기증 요청은 OPO(장기구득기관) 담당자 몫이고 간호사는 연결만 해요. 간호사가 직접 설득하지 않고 훈련받은 담당자에게 잇는다는 뜻이에요.")
sent(17, 3)['why'] = ("sensitive option으로 민감한 주제임을 미리 알려요. gently mention이라고 하면 지금 결정하라는 말이 아니라 조심스럽게 꺼낸다는 태도가 전해져요. "
                      "다만 기증을 구체적으로 청하는 일은 OPO 담당자 몫이고, 간호사는 연결만 해요.")

# 빈칸 낱말 (en만)
opt(1, 0, {'no visitors': 'three visitors'})
opt(1, 2, {'dark': 'busy'})
opt(3, 4, {'bothers': 'gets', 'scares': 'comes', 'annoys': 'belongs'})
opt(4, 1, {'doctor': 'cure', 'room': 'dose', 'nurse': 'bed'})
opt(10, 1, {'money': 'light', 'noise': 'time', 'sugar': 'help'})
opt(11, 2, {'no one': 'something', 'nobody': 'a blanket', 'nothing': 'a phone'})
opt(11, 4, {'picture': 'pill', 'ticket': 'number', 'shower': 'test'})
opt(13, 1, {'walked away': 'pulled through', 'run away': 'passed out', 'moved away': 'woken up'})
opt(13, 2, {'like': 'instead of'})
opt(15, 3, {'many': 'more'})
opt(16, 1, {'noise': 'surgery', 'speed': 'recovery', 'profit': 'discharge'})
opt(16, 3, {'cooked': 'refused', 'painted': 'signed', 'bought': 'feared'})
opt(18, 4, {'laughing': 'objecting', 'shouting': 'replying', 'leaving': 'agreeing'})
opt(19, 0, {'bill': 'illness', 'trip': 'injury'})

# decoy
for s, j, old, new in [(6, 0, 'by now', 'next week'), (8, 3, 'of him', 'for her'), (13, 4, 'for you', 'from you'),
                       (14, 0, 'for him', 'of her'), (14, 4, 'for him', 'of her'), (15, 3, 'for you', 'to you')]:
    assert sent(s, j)['decoy'] == old, (s, j)
    sent(s, j)['decoy'] = new

# 문장 icon·tag
sent(1, 4)['icon'] = 'hospital'
sent(3, 4)['icon'] = 'speech'
sent(3, 4)['tag'] = '질문 존중'
sent(2, 4)['icon'] = 'monitor'
assert S[2]['order']['lines'][3]['icon'] == 'check'
S[2]['order']['lines'][3]['icon'] = 'magnify'
assert S[8]['order']['lines'][2]['icon'] == 'check'
S[8]['order']['lines'][2]['icon'] = 'play'


def line(s, k, en=None, ko=None, note=None, icon=None):
    L = S[s]['order']['lines'][k]
    if en: L['en'] = en
    if ko: L['ko'] = ko
    if note: L['note'] = note
    if icon: L['icon'] = icon


def why(s, text):
    S[s]['order']['why'] = text


# order
line(0, 3, "When that hour is up, I'll come find you with the results.", "그 한 시간이 지나면 결과를 들고 찾아뵐게요")
why(0, "먼저 안내를 시작하고 상태를 말한 뒤, 그 검사의 소요 시간을 알리고 한 시간이 지나면 결과를 들고 찾아가겠다고 약속해요. "
       "3줄의 Those tests는 2줄의 검사를, 4줄의 that hour는 3줄의 한 시간을 가리켜서 순서가 하나예요.")

line(3, 3, "Each time you do, I'll explain again until it makes sense.", "그럴 때마다 이해되실 때까지 다시 설명할게요")
why(3, "걱정을 먼저 인정하고, That's why로 질문이 중요하다고 이어 말해요. 3줄의 them은 2줄의 질문을, 4줄의 Each time you do는 3줄의 ask(묻는 일)를 가리켜서 순서가 하나예요.")

line(6, 3, "That person can then pass the same information to everyone.", "그분이 모두에게 같은 정보를 전해 주실 수 있어요")
why(6, "다른 이야기를 들은 것을 인정하고, 그 문제를 풀려고 사실을 정리하고, 정리가 끝난 뒤 담당자를 정해요. 2줄의 that, 3줄의 that이 앞 줄을 가리키고, "
       "4줄의 That person은 3줄에서 정한 담당자라서 순서가 하나예요.")

line(8, 1, "While you do, tell me what usually comforts her at home.", "그러시는 동안 집에서 보통 뭐가 아이를 진정시키는지 알려주세요")
why(8, "곁에 있어도 된다고 허락하고, 아이를 진정시키는 방법을 묻고, 그 답을 받아 지금 해 보자고 하고, 해 본 결과를 칭찬해요. "
       "2줄의 While you do는 1줄의 hold(손 잡기)를, 3줄의 that은 2줄의 답을, 4줄의 already는 3줄에서 해 본 뒤라는 뜻이어서 순서가 하나예요.")

line(9, 3, "Once it's arranged, I'll come back and tell you the time.", "준비되면 다시 와서 시간을 알려드릴게요", "약속", "bell")
why(9, "가장 중요한 것을 묻고, 들은 뒤 감사하며 가능한 일을 알리고, 팀과 조율해 그것이 이뤄지게 하겠다고 하고, 준비되면 시간을 알려드리겠다고 맺어요. "
       "2줄의 telling me, 3줄의 that, 4줄의 Once it's arranged가 앞 줄을 이어서 순서가 하나예요.")

line(13, 2, "I know that's a lot to take in — take all the time you need.", "받아들이기 힘드실 거예요, 필요한 만큼 시간을 가지세요")
why(13, "먼저 힘든 소식이 있다고 예고하고, 죄송하다고 하며 died로 분명히 알리고, 그 소식을 받아들일 시간을 가지라고 하고, 그동안 곁에 있겠다고 해요. "
        "3줄의 that은 2줄의 소식을, 4줄의 While you do는 3줄의 시간을 가리켜서 순서가 하나예요.")

line(14, 1, "While they work, you can stay with her — I'll be by your side.", "팀이 일하는 동안 곁에 계셔도 돼요, 저도 옆에 있을게요")
line(14, 3, "As you talk to her, I'll keep telling you what the team is doing.", "말을 거시는 동안 팀이 하는 일을 계속 말씀드릴게요")
why(14, "팀이 최선을 다하고 있다고 알린 뒤 팀이 일하는 동안 곁에 있어도 된다고 허락하고, 그 자리에 있는 동안 말을 걸어도 된다고 알리고, 말을 거는 동안 상황을 계속 알려 주겠다고 해요. "
        "While they work의 they는 1줄의 팀을, While you're here는 2줄의 입회를, As you talk to her는 3줄의 말 거는 일을 이어서 순서가 하나예요.")

line(15, 1, "Whatever you're feeling about it, that's okay.", "그것에 대해 어떤 마음이 드셔도 괜찮아요")
why(15, "먼저 상상도 안 된다고 공감하고, 그에 대해 어떤 마음이 들든 괜찮다고 하고, 마음을 추스를 시간을 주고, 준비되면 도울 수 있다고 해요. "
        "2줄의 it은 1줄의 이 순간을, 4줄의 When you are는 3줄의 준비를 이어서 순서가 하나예요.")

line(17, 3, "If you do want to hear more, a donation coordinator can explain everything.",
     "정말 더 듣고 싶으시면 기증 코디네이터가 모두 설명해 드릴 수 있어요")
why(17, "애도로 시작하고, 준비되면 조심스러운 이야기를 꺼내고, That said로 압박이 없다고 선택권을 알리고, 가족이 더 듣고 싶어 하면 코디네이터가 설명해요. "
        "기증 요청과 설명은 OPO 담당자 몫이고 간호사는 연결만 해요. That said, If you do가 앞 줄을 이어서 순서가 하나예요(do는 3줄의 '압박 없음'에 맞서는 말).")

line(18, 1, "Let's sit down, and tell me all of it.", "앉으셔서 하고 싶으신 말씀을 모두 해 주세요")
line(18, 2, "Take your time — I'll just listen until you're done.", "천천히 하세요, 다 끝나실 때까지 듣기만 할게요")
line(18, 3, "When you are, I'll explain what happened.", "끝나시면 무슨 일이 있었는지 설명할게요")
why(18, "분노를 먼저 인정하고, 앉아서 말하도록 청하고, 서두르지 않고 끝까지 듣겠다고 하고, 다 들은 뒤에 설명하겠다고 해요. "
        "2줄의 it은 1줄의 분노를, 4줄의 When you are는 3줄의 done을 이어서 순서가 하나예요.")

# context (word·ko만)
for s, w, k in [(4, 'danger', '위험'), (14, 'CPR', '심폐소생술')]:
    c = [n for n in S[s]['nuance'] if n['kind'] == 'context'][0]
    c['word'], c['ko'] = w, k

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)


# 필드 단위 비교
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
