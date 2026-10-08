#!/usr/bin/env python3
"""er-deescalation v46 보강 수정 — 대상 yaml을 제자리에서 고친다(빌드 스크립트 재실행 아님)."""
import yaml

D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-deescalation.yaml'
d = yaml.safe_load(open(F))
S = d['situations']

# 빈칸: (상황, 문장) -> (answer, [나머지 선택지 3개]) — 정답 자리는 돌려 가며 배치
BLANKS = {
    (3, 4): ('block', ['open', 'lock', 'close']),                       # B1
    (8, 2): ('offer', ['prescribe', 'order', 'promise']),               # B2
    (13, 4): ('before', ['while', 'as', 'when']),                       # B3
    (7, 1): ('here', ['now', 'tonight', 'today']),                      # B4
    (19, 5): ('need', ['hear', 'see', 'feel']),                         # B5
    (19, 1): ('rest', ['wait', 'talk', 'read']),                        # B6
    (20, 2): ('risks', ['rules', 'steps', 'options']),                  # B7
    (10, 2): ('accept', ['regret', 'deny', 'mind']),                    # B8
    (4, 2): ('frustrating', ['unusual', 'understandable', 'normal']),   # B9
    (4, 3): ('do', ['say', 'check', 'sign']),                           # B10
    (4, 1): ('understand', ['repeat', 'check', 'order']),               # B11
    (9, 3): ('address', ['explain', 'mention', 'document']),            # B12
    (5, 4): ('hard', ['strange', 'scary', 'new']),                      # B13
    (11, 1): ('respect', ['speed', 'privacy', 'patience']),             # B14
    (8, 1): ('safely', ['quickly', 'gently', 'fully']),                 # B15
    (1, 3): ('update', ['triage', 'register', 'move']),                 # B16
    (16, 5): ('listening', ['charting', 'typing', 'waiting']),          # B17
    (17, 1): ('overheating', ['dehydrated', 'shaking', 'confused']),    # B18
    (2, 3): ('help', ['upset', 'scare', 'bother']),                     # B19
    (9, 4): ('away from', ['toward', 'around', 'behind']),              # B20
    (18, 4): ('back', ['aside', 'down', 'out']),                        # B21
    (1, 1): ('wait', ['visit', 'shift', 'drive']),                      # B22
    (5, 3): ('something', ['someone', 'a doctor', 'the charge nurse']), # B23
    (6, 1): ('help', ['talk', 'ask', 'check']),                         # B24
    (6, 4): ('fight', ['judge', 'lecture', 'rush']),                    # B25
    (13, 1): ('safe', ['calm', 'better', 'heard']),                     # B26
    (7, 3): ('photos', ['charts', 'forms', 'letters']),                 # B27
    (7, 5): ('family', ['diagnosis', 'surgery', 'medicines']),          # B28
    (10, 4): ('team', ['shift', 'unit', 'floor']),                      # B29
    (13, 2): ('see', ['sign', 'rest', 'wait']),                         # B30
    (13, 5): ('stop', ['leave', 'repeat', 'explain']),                  # B31
    (14, 2): ('unsafe', ['angry', 'sick', 'dizzy']),                    # B32
    (14, 3): ('listen', ['reply', 'respond', 'react']),                 # B33
    (14, 5): ('close by', ['on call', 'on break', 'off duty']),         # B34
    (15, 4): ('outside', ['upstairs', 'downstairs', 'next door']),      # B35
    (16, 2): ('questions', ['forms', 'orders', 'family']),              # B36
    (16, 4): ('say', ['doubt', 'shift', 'test']),                       # B37
    (17, 3): ('got', ['paged', 'called', 'moved']),                     # B38
    (17, 5): ('temperature', ['heart rate', 'oxygen', 'sugar']),        # B39
    (19, 2): ('eyes', ['mouth', 'hand', 'fist']),                       # B40
    (19, 4): ('breathing', ['color', 'pulse', 'oxygen']),               # B41
    (20, 3): ('stay', ['leave', 'sign', 'call']),                       # B42
    (20, 4): ('choice', ['turn', 'room', 'chart']),                     # B43
    (20, 5): ('risks', ['rules', 'results', 'options']),                # B44
    (3, 1): ('space', ['time', 'water', 'privacy']),                    # B45
    (3, 5): ('room', ['time', 'blankets', 'water']),                    # B46
    (6, 3): ('sit', ['lie', 'calm', 'settle']),                         # B47
    (12, 3): ('calm', ['back', 'outside', 'close']),                    # B48
    # B49: 목록의 `outside`는 'right outside you'가 비문이라 `in front of`로 바꿈(보고에 적음)
    (7, 4): ('beside', ['behind', 'across from', 'in front of']),       # B49
}

DECOYS = {
    (3, 4): 'by the window',            # D1
    (8, 2): "I can't promise that",     # D2
    (19, 5): 'if you hear',             # D3
    (19, 1): 'while you wait',          # D4
    (16, 5): 'charting now',            # D5
    (2, 1): 'to be tired',              # D6
    (7, 1): "You're safe with her",     # D7
    (13, 4): 'I leave',                 # D8
    (10, 2): "I won't mind",            # D9
    (4, 2): "— that's on us",           # D10
    (4, 3): 'about the wait',           # D11
    (2, 3): 'where it hurts',           # D12
    (4, 1): 'you understand',           # D13
    (9, 3): "I'll explain this",        # D14
    (9, 4): 'from the TV',              # D15
    (18, 4): 'to sit down',             # D16
    (17, 1): "You're dehydrated",       # D17
    (8, 1): 'to treat it quickly',      # D18
    (5, 4): 'waiting like this',        # D19
    (1, 3): 'and move you',             # D20
    (3, 1): 'some time',                # D21
    (3, 5): 'more time',                # D22
    (6, 3): 'we lie down',              # D23
    (6, 4): 'to judge',                 # D24
    (7, 3): 'at these cards',           # D25
    (7, 5): 'about your medicines',     # D26
    (13, 2): 'so you can rest',         # D27
    (14, 5): 'The doctor is close by',  # D28
    (15, 4): 'right upstairs',          # D29
    (16, 2): 'your family',             # D30
    (17, 3): "we've called",            # D31
    (17, 5): 'your heart rate',         # D32
    (19, 2): 'your mouth',              # D33
    (19, 4): 'Your color',              # D34
    (20, 2): 'what the rules are',      # D35
    (20, 4): 'your turn',               # D36
    (20, 5): 'the results',             # D37
}

KO = {
    (18, 5): (0, '다치신 분 있으세요?'),                                    # K1
    (3, 3): (0, '불을 조금 줄여 드릴까요?'),                                # K2
    (14, 4): None,                                                         # K3 (둘 다)
}

WHY = {
    (1, 3): "check on으로 직접 알아보겠다는 약속과 update you로 내가 다시 알려 주겠다는 약속을 한 문장에 담아요. "
            "환자가 다시 물으러 오지 않아도 돼요.",                          # W1
}

# order 줄 교체: 상황 -> {줄 번호(0부터): (en, icon, ko, note)} 및 카드 why
ORDER = {
    9: ({3: ("Keeping it calm means this won't get bigger than it needs to be.", 'bell',
             '차분히 있으면 필요 이상으로 커지지 않아요', '이유')},
        "따로 이야기할 곳으로 옮기자고 하고, 그곳에서('Over here') 일대일로 듣겠다고 하고, 불만이 무엇이든('Whatever it is') "
        "처리하되 차분하게 하자고 하고, 그렇게 차분히 있으면('Keeping it calm') 일이 커지지 않는다고 마무리해요."),   # O1
    10: ({2: ("That way of speaking isn't respectful — I won't accept it, but I'm still here.", 'shield',
              '그런 말투는 정중하지 않아요, 받아들일 수 없지만 곁에 있을게요', '경계')},
         "같은 편이고 돕고 싶다는 말이 먼저, 그러려면('To do that') 서로 존중해 달라고 요청하고, 그런 말투는 존중이 아니라고"
         "('respectful') 경계를 말하되 곁에 있겠다고 하고, 그 말을 정리하며('With that said') 다시 시작하자고 해요."),  # O2
    12: ({3: ("Now that you know the plan, let's stay calm so I can care for him.", 'shield',
              '이제 계획을 아셨으니 제가 아이를 돌볼 수 있도록 차분히 있어요', '협조')},
         "아이를 향한 마음을 인정하는 말이 먼저, 그 때문에('Because of that') 화나는 것은 이해하되 소리치면 아이가 무서워한다고 "
         "말하고, 소리 대신('Instead of yelling') 하고 있는 일을 알리고, 그 계획을('the plan') 알았으니 차분하게 협조해 "
         "달라고 해요."),   # O3
    13: ({2: ("Before I do anything, I'll tell you what it is.", 'speech',
              '무엇이든 하기 전에 그게 뭔지 말씀드릴게요', '사전'),
          3: ("You can ask me to stop anything I've told you about at any time.", 'check',
              '말씀드린 건 무엇이든 언제든 멈춰 달라고 하셔도 돼요', '중단')},
         "안전하다는 말이 먼저, 안전하게 느끼도록('To help you feel safe') 모든 것을 보이게 하고, 무엇이든 하기 전에 그게 뭔지 "
         "알리겠다고 약속하고('Before I do anything'), 그렇게 알린 것('anything I've told you about')은 언제든 멈추게 할 수 있다고 마무리해요."),  # O4
    15: ({2: ('What you tell me guides us, and my team is just outside the open door.', 'siren',
              '말씀하시는 걸 따를 거고, 팀은 열린 문 바로 바깥에 있어요', '지원')},
         "말로 푸는 것이 첫 선택이라는 말이 먼저, 그렇게 하려고('So') 필요한 것을 묻고, 환자가 말하는 것('What you tell me')을 "
         "따르되 팀이 열린 문 바로 바깥에 가까이 있음을 알리고, 어느 쪽이든('Either way') 모두의 안전을 말해요. "
         "말은 한 사람이 이끌되 팀은 문이 열린 채 보이는 곳에 있어요."),   # O5
    17: ({2: ("That temperature is a lot for your body — it's working very hard.", 'stetho',
              '그 체온은 몸에 큰 부담이에요, 아주 힘들게 애쓰고 있어요', '이유')},
         "무슨 일인지 알리고 식히겠다는 말이 먼저, 식히는 것이 듣는지('the cooling') 보려고 체온을 다시 재고, 그 체온('That "
         "temperature')이 몸에 큰 부담이라고 설명하고, 어떤 느낌이든('Whatever you feel') 곁에 있다고 말해요."),   # O6
    19: ({3: ("That can change, so I'll stay right here with you.", 'bell',
              '그건 달라질 수 있으니 바로 곁에 있을게요', '곁')},
         "계속 확인하겠다는 말이 먼저, 그 확인의 일부로('That means') 호흡을 지켜보며 천천히 숨 쉬게 하고, 지켜본 호흡을 알리고"
         "('looks good'), 그 상태는 달라질 수 있다('That can change')며 곁에 있겠다고 말해요."),   # O7
    1: ({1: ("That's because the sickest patients are seen first.", 'siren',
             '가장 위급한 분들이 먼저 진료를 받기 때문이에요', '이유')},
        "사과가 먼저, 대기가 긴 이유가 그 뒤를 받고('That's because'), 이유를 알린 상태에서 순서를 확인하고('With that in mind'), "
        "확인한 결과를 직접 알려 주는('Whatever I find out') 흐름이에요."),   # O8
    11: ({1: ("Respect starts with saying your concern is valid — I'll do my best.", 'check',
              '존중은 우려가 타당하다고 말하는 데서 시작돼요, 최선을 다할게요', '인정')},
         "존중받도록 하겠다는 말이 먼저, 그 존중('Respect')의 시작으로 우려를 인정하고, 최선을 다하려면('To do my best') 편안한 "
         "조건을 묻고, 들은 말에서('From what you tell me') 신뢰를 쌓을 방법을 이야기해요."),   # O9
    7: ({1: ("I'm not the only one — your daughter is on her way to see you.", 'bell',
             '저만 있는 게 아니에요, 따님이 지금 오고 계세요', '소식')},
        "안전하고 곁에 있다는 말이 먼저, 나 혼자만이 아니라('I'm not the only one') 가족이 오고 있음을 알리고, 그 가족('her')의 "
        "사진을 같이 보고, 사진 속 사람들('them') 이야기를 나눠요."),   # O10
    8: ({1: ('I believe that pain is real, and I want to treat it safely.', 'shield',
             '그 통증이 진짜라고 믿고 안전하게 치료하고 싶어요', '믿음'),
         2: ("Treating it safely means I can't give you that, but here's what I can offer.", 'handshake2',
             '안전하게 치료하려면 그 약은 드릴 수 없지만 대신 이걸 드릴 수 있어요', '대안')},
        "아픔을 인정하는 말이 먼저, 그 통증('that pain')이 진짜라고 믿고 안전하게 치료하겠다는 말이 이를 받고, 그 안전 때문에"
        "('Treating it safely') 요구한 약은 줄 수 없다는 것과 줄 수 있는 것을 말하고, 대안을('what else') 같이 찾아요."),   # O11
    5: ({3: ("While you wait for it, let's find a position that hurts less.", 'me',
             '그동안 덜 아픈 자세를 찾아봐요', '자세')},
        "공감이 먼저, 그 통증에 대해('To help with it') 정도를 묻고, 숫자가 얼마든('Whatever the number') 바로 조치하고, 그것을 "
        "기다리는 동안('While you wait for it') 자세를 찾아요."),   # O12
}

# 1) 빈칸
ci = 0
for (si, j), (ans, others) in BLANKS.items():
    x = S[si - 1]['sentences'][j - 1]
    opts = list(others)
    opts.insert(ci % 4, ans)
    ci += 1
    x['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}
# 2) decoy
for (si, j), v in DECOYS.items():
    S[si - 1]['sentences'][j - 1]['decoy'] = v
# 3) distractorsKo
x = S[17]['sentences'][4]
assert x['distractorsKo'][0] == '이름을 한 명씩 말씀해 주세요.'
x['distractorsKo'][0] = '다치신 분 있으세요?'
x = S[2]['sentences'][2]
assert x['distractorsKo'][0] == '도움이 필요하면 불러 주세요.'
x['distractorsKo'][0] = '불을 조금 줄여 드릴까요?'
x = S[13]['sentences'][3]
assert x['distractorsKo'] == ['물이라도 드릴까요?', '의자를 가져다 드릴까요?']
x['distractorsKo'] = ['보안팀이 곧 와요.', '다른 분들은 잠깐 나가 계시도록 할게요.']
# 4) why
for (si, j), v in WHY.items():
    S[si - 1]['sentences'][j - 1]['why'] = v
# 5) order
for si, (lines, why) in ORDER.items():
    o = S[si - 1]['order']
    for k, (en, icon, ko, note) in lines.items():
        o['lines'][k] = {'en': en, 'icon': icon, 'ko': ko, 'note': note}
    o['why'] = why
# 6) context
for n in S[16]['nuance']:
    if n['kind'] == 'context':
        assert n['scenes'][0]['en'].endswith('start cooling now.')
        n['scenes'][0]['en'] = "Temp is 40.5 and climbing — he's hyperthermic; I'm starting active cooling."   # C1
for n in S[14]['nuance']:
    if n['kind'] == 'context':
        assert n['scenes'][1]['en'].startswith('Stay right outside the room')
        n['scenes'][1]['en'] = 'Stay right outside the open door, where I can see you.'                       # C2
        n['why'] = n['why'] + ' 말은 한 사람이 이끌되 팀은 문이 열린 채 보이는 곳에 있어요.'

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('done')
