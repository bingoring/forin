import re, yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-chestpain.yaml'
d = yaml.safe_load(open(F))
S = d['situations']


def sent(key):
    s, j = key.split('.')
    return S[int(s)]['sentences'][int(j)]


def once(en, ans):
    assert len(re.findall(r'(?<![A-Za-z])' + re.escape(ans) + r'(?![A-Za-z])', en)) == 1, (en, ans)


def reblank(key, answer, opts):
    """정답 위치를 지키며 옵션 넷을 새로 짠다. opts[0]이 새 정답."""
    x = sent(key)
    b = x['blank']
    pos = [o['en'] for o in b['options']].index(b['answer'])
    assert opts[0] == answer and len(opts) == 4
    once(x['en'], answer)
    rest = iter(opts[1:])
    b['options'] = [{'en': answer if k == pos else next(rest)} for k in range(4)]
    b['answer'] = answer


def optswap(key, old, new):
    b = sent(key)['blank']
    hit = [o for o in b['options'] if o['en'] == old]
    assert len(hit) == 1 and b['answer'] != old, (key, old)
    hit[0]['en'] = new


def decoy(key, old, new):
    x = sent(key)
    assert x['decoy'] == old, (key, x['decoy'])
    x['decoy'] = new


def why(key, old_part, new):
    x = sent(key)
    assert x['why'].count(old_part) == 1, (key, old_part)
    x['why'] = x['why'].replace(old_part, new)


# ------------------------------------------------------------ why
why('10.3', '조사와 시제를 줄인 짧은 문장이', '관사·be동사·조동사를 뺀 짧은 문장이')
why('15.1', '볼 수 있는 소견이에요.', '볼 수 있는 소견이에요. 다만 차이가 없다고 박리가 배제되지는 않아요.')
why('5.1', '미국 심장학회 지침', '미국심장협회·미국심장학회(AHA/ACC) 지침')

# ------------------------------------------------------------ 빈칸: 뒤집기 오답
reblank('7.2', 'check', ['check', 'treat', 'fix', 'calm'])
reblank('12.1', 'update', ['update', 'test', 'admit', 'discharge'])
reblank('18.3', 'relieve', ['relieve', 'mask', 'worsen', 'trigger'])
reblank('8.2', 'everything', ['everything', 'your name', 'the time', 'the date'])
reblank('4.4', 'tests', ['tests', 'questions', 'medicine', 'your doctor'])

# 시간 단위 묶음
reblank('2.4', 'results', ['results', 'forms', 'bills', 'pads'])
reblank('8.3', 'detail', ['detail', 'test', 'visit', 'medicine'])
decoy('8.3', 'every minute', 'every visit')
reblank('9.3', 'stronger', ['stronger', 'lighter', 'colder', 'slower'])
reblank('13.1', 'use', ['use', 'eat', 'drink', 'buy'])
reblank('20.0', 'compare', ['compare', 'react', 'belong', 'return'])
reblank('21.1', 'often', ['often', 'slowly', 'quietly', 'gently'])
reblank('21.4', 'episode', ['episode', 'dose', 'test', 'visit'])

# 동떨어지거나 문법·뜻으로 걸러지는 오답
reblank('0.3', 'describe', ['describe', 'remember', 'imagine', 'record'])
reblank('13.0', 'confidential', ['confidential', 'public', 'shared', 'unchanged'])
optswap('10.2', 'electrician', 'EMT')
optswap('11.3', 'losing', 'stopping')
optswap('2.3', 'at discharge', 'after the test')
optswap('2.3', 'tomorrow morning', 'at the end')
optswap('2.3', 'after you leave', 'next time')

# ------------------------------------------------------------ decoy
decoy('11.3', 'about taking', 'before taking')
decoy('14.1', 'it hurts', 'it itches')
decoy('18.3', 'will cure', 'will cause')

# ------------------------------------------------------------ distractorsKo
DK = {
    '0.5': {0: '평소에 드시는 약이 있나요?'},
    '2.3': {0: '검사 중에는 말씀을 잠시 멈춰 주세요'},
    '5.1': {1: '먼저 피검사를 하고 기다려 볼게요'},
    '5.3': ['통증이 언제 시작됐는지 다시 여쭤볼게요', '심전도 결과가 나오면 설명해 드릴게요'],
    '5.4': ['숨을 천천히 깊게 쉬어 보세요', '가족분께 연락해 드릴까요?'],
    '6.1': {0: '이 증상은 혈당 때문일 수도 있어요'},
    '6.2': {0: '당뇨약을 오늘 드셨는지 확인하고 싶어요'},
    '6.3': ['당뇨가 있으면 상처가 잘 안 나을 수 있어요', '여성분들은 심장병이 늦게 오는 편이에요'],
    '6.4': ['결과가 나오면 의사 선생님이 설명해 주실 거예요', '검사 전에 혈당부터 재 볼게요'],
    '7.0': {1: '잠깐 앉아서 기다려 주세요'},
    '7.2': {0: '불안할 때 드시는 약이 있으세요?'},
    '7.4': ['공황 증상은 보통 몇 분 안에 가라앉아요', '심장 검사 결과는 의사 선생님이 설명해 주실 거예요'],
    '8.0': {0: '통증이 몇 점인지 말씀해 주시겠어요?'},
    '8.2': ['언제부터 그러셨는지 말씀해 주세요', '보호자분도 같이 들어오셔도 돼요'],
    '8.3': ['천천히 하나씩 말씀하셔도 돼요', '지금 드시는 약을 모두 알려 주세요'],
    '8.4': ['작은 증상이 언제부터였는지 여쭤볼게요', '증상을 적어 두시면 도움이 돼요'],
    '9.1': {1: '스텐트 시술을 어느 병원에서 받으셨나요?'},
    '9.4': {1: '예전 진료 기록을 받아 볼게요'},
    '10.3': {0: '간호사예요. 이름을 말해 주세요'},
    '11.1': {0: '혀 밑이 조금 따끔할 수 있어요'},
    '11.2': {0: '5분 뒤에 통증을 다시 여쭤볼게요'},
    '11.4': ['약을 드신 뒤에는 잠시 누워 계세요', '5분 뒤에 통증 점수를 다시 여쭤볼게요'],
    '12.0': {0: '남편분은 지금 검사실에 가 계세요'},
    '12.2': {0: '남편분 드시는 약을 알려 주시겠어요?'},
    '12.3': ['연락처를 남겨 주시면 전화드릴게요', '대기실은 복도 끝에 있어요'],
    '13.4': ['다른 약이나 술도 함께 드셨나요?', '소변 검사로 확인할 수도 있어요'],
    '14.0': ['보청기를 가져오셨나요?', '가족분이 대신 답해 주셔도 돼요'],
    '14.3': {0: '보청기를 끼워 드릴까요?'},
    '14.4': ['답을 종이에 적어 주시겠어요?', '가족분께도 설명해 드릴게요'],
    '15.2': ['통증이 몇 점인지 말씀해 주세요', '가족분께 연락해 드릴게요'],
    '15.4': ['검사 전까지는 아무것도 드시지 마세요', '옆으로 누워 계셔도 돼요'],
    '16.3': ['최근에 다리가 붓거나 아프셨나요?', '숨이 차면 바로 말씀해 주세요'],
    '17.4': ['숨을 잠깐 참아 주세요', '폐 소리도 같이 들어볼게요'],
    '18.2': {0: '시술 중에는 깨어 계실 수 있어요'},
    '18.4': ['가족분께는 제가 알려 드릴게요', '시술은 한 시간쯤 걸려요'],
    '19.0': {0: '제 손을 꽉 잡아 보세요'},
    '19.1': {1: '산소를 조금 더 올릴게요'},
    '19.2': ['산소 마스크를 씌워 드릴게요', '가슴이 지금 얼마나 아프세요?'],
    '19.3': {0: '혈압이 떨어지고 있어서 산소를 올릴게요'},
    '19.4': {1: '오늘이 무슨 요일인지 말씀해 보세요'},
    '20.2': {0: '통증 약을 지금 더 드릴게요'},
    '20.3': ['통증이 몇 점인지 다시 말씀해 주세요', '다음에도 아프면 이 버튼을 눌러 주세요'],
    '21.1': {0: '이럴 때 니트로를 드셔 보셨나요?'},
    '21.2': ['지금 바로 심전도를 다시 찍을게요', '통증 약을 먼저 드릴게요'],
    '21.3': {0: '잠은 평소에 잘 주무시나요?'},
    '21.4': ['오늘 밤 통증이 몇 시에 시작됐나요?', '예전 통증 때 드신 약을 알려 주세요'],
}
assert len(DK) == 46
for k, v in DK.items():
    x = sent(k)['distractorsKo']
    assert len(x) == 2
    if isinstance(v, dict):
        for i, t in v.items():
            x[i] = t
    else:
        x[:] = v

# ------------------------------------------------------------ 문장 아이콘
for k, o, n in [('18.3', 'trophy', 'star'), ('3.0', 'bulb', 'chartup')]:
    assert sent(k)['icon'] == o, k
    sent(k)['icon'] = n


# ------------------------------------------------------------ order
def olines(si, lines, ow=None):
    od = S[si]['order']
    assert len(lines) == 4
    for i, (en, ko, icon, note) in enumerate(lines):
        l = od['lines'][i]
        if en is not None: l['en'] = en
        if ko is not None: l['ko'] = ko
        if icon is not None: l['icon'] = icon
        if note is not None: l['note'] = note
    if ow:
        od['why'] = ow


N = None
# S4 — L4가 L3의 답을 받게
olines(4, [(N, N, N, N), (N, N, N, N), (N, N, N, N),
           ("If you did, this pain usually isn't dangerous, but we'll still run tests.",
            '그랬다면 이 통증은 대체로 위험하지 않지만 검사는 해요', N, N)],
       '아픈 곳을 먼저 짚게 하고, 바로 그 자리를 눌러 반응을 보고, 눌러서 아프다면 무리한 일이 있었는지 묻고, 그랬다고 답하면 위험이 낮아 보여도 검사는 한다고 맺어요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')

# S9 — 약·스텐트 이력은 어느 쪽이든 묻는다
olines(9, [(N, N, N, N),
           ('Either way, which medications and stents have you had before?',
            '어느 쪽이든 이전에 어떤 약을 드시고 어떤 스텐트를 넣으셨나요?', N, N),
           (N, N, N, N), (N, N, N, N)],
       '지금 통증이 예전과 같은지 먼저 묻고, 같든 다르든 약과 스텐트 이력을 묻고, 그 약을 처방대로 먹었는지 묻고, 마지막에 병력을 팀에 전한다고 맺어요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')

# S11 — 설명 뒤에 동의
olines(11, [(N, N, N, N),
            ('It may cause a headache or make you feel lightheaded.', '두통이나 어지러움이 생길 수 있어요', 'bell', '부작용'),
            ('Knowing about the headache, are you okay with taking it now?', '그 두통을 아시고, 지금 드셔도 괜찮으세요?', 'handshake2', '동의'),
            ("If so, I'll keep checking your blood pressure after you take it.", '그렇다면 드신 뒤 혈압을 계속 확인할게요', 'monitor', '관찰')],
       '약과 쓰는 법을 알리고, 생길 수 있는 불편을 미리 말한 뒤, 그 두통을 알고도 괜찮은지 동의를 받고, 동의하면 투여 후 혈압을 계속 잰다고 맺어요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')

# S13 — L4가 L3의 unsafe를 받게
olines(13, [(N, N, N, N), (N, N, N, N), (N, N, N, N),
            ("To keep those treatments safe, I'll tell the doctor right away.", '그 치료들을 안전하게 하려고 바로 의사에게 알릴게요', N, N)],
       '비밀 보장과 비판하지 않겠다는 약속을 먼저 하고, 무엇을 언제 썼는지 묻고, 받은 답이 왜 중요한지 설명하고, 위험할 수 있는 그 치료들을 안전하게 하려고 의사에게 알린다고 맺어요. 뒤 줄이 앞 줄의 답과 이유를 가리켜서 순서가 하나예요.')

# S15 — 호출은 수치와 상관없이
olines(15, [(N, N, N, N), (N, N, N, N),
            ("Whatever those numbers show, I'm getting the doctor immediately.", '그 수치가 어떻든 바로 의사를 부를게요', N, N),
            (N, N, N, N)],
       '통증 양상을 먼저 묻고, 그렇다면 양팔 혈압을 재고, 그 수치와 상관없이 바로 의사를 부르고, 의사가 올 때까지 움직이지 말라고 맺어요. 뒤 줄이 앞 줄의 결과를 가리켜서 순서가 하나예요.')

# S16 — 산소포화도를 앞으로
olines(16, [(N, N, N, N),
            ("While you answer, I'll check your oxygen level right away.", '답하시는 동안 바로 산소포화도를 확인할게요', 'monitor', '산소'),
            ('While that reading comes in, have you had any long flights, surgery, or leg swelling recently?', '그 수치가 나오는 동안, 최근에 장거리 비행, 수술, 다리 붓기가 있었나요?', 'plane', '위험'),
            ("If you have, that can be a warning sign, so we'll get a scan of your lungs.", '그랬다면 경고 신호일 수 있어서 폐 스캔을 할게요', 'bell', '경고')],
       '숨 쉴 때의 통증을 먼저 묻고, 답하는 동안 바로 산소포화도를 재고, 그 수치가 나오는 동안 비행·수술·다리 붓기 같은 위험 요인이 있었는지 묻고, 있었다면 경고 신호일 수 있어 폐 스캔을 한다고 맺어요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')

# S17 — 3↔4 잠그기
olines(17, [(N, N, N, N), (N, N, N, N), (N, N, N, N),
            ("If you have, this sharp, positional pain can point to inflammation around the heart.",
             '그랬다면 이 날카롭고 자세에 따라 변하는 통증은 심장 주변 염증일 수 있어요', N, N)],
       '자세에 따라 달라지는지 먼저 묻고, 그렇다면 눕거나 숨 쉴 때 더 심한지 묻고, 그런 양상과 함께 최근 열이나 감염이 있었는지 묻고, 있었다면 심장 주변 염증일 수 있다고 설명해요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')

# S19 — why만
S[19]['order']['why'] = ('의식을 먼저 확인하고, 바로 도움을 부른다고 알리고, 기다리는 동안 이름을 말하게 해 의식을 이어 가고, '
                         '팀이 도착했음을 알려요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')

# S21 — 어느 쪽이든 묻고, 안정 시 흉통이니 바로 보고
olines(21, [(N, N, N, N),
            ('Either way, has it been happening more often or lasting longer than before?', '어느 쪽이든 더 자주 일어나거나 예전보다 오래 가나요?', N, N),
            ("With pain at rest, I'm going to reassess you and let the team know right now.", '안정 시 통증이니 지금 바로 다시 평가하고 팀에 알릴게요', N, N),
            (N, N, N, N)],
       '쉬는 중에 시작됐는지 먼저 묻고, 어느 쪽이든 더 잦거나 길어졌는지 묻고, 안정 시 흉통이니 바로 재평가와 팀 보고를 알리고, 팀이 오면 오늘 밤 통증을 이전과 견준다고 맺어요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')


# ------------------------------------------------------------ context
def ctx(si):
    c = [x for x in S[si]['nuance'] if x['kind'] == 'context']
    assert len(c) == 1
    return c[0]


c = ctx(1)
assert c['word'] == 'priority' and c['scenes'][2]['en'] == "You're an ESI 2, so you'll be roomed immediately."
c['scenes'][2]['en'] = "You're a high priority, so you'll be roomed immediately — you're an ESI 2."
c = ctx(20)
assert c['scenes'][0]['en'].endswith('Can you come see her?')
c['scenes'][0]['en'] = 'Bed 3, NSTEMI — chest pain is back at seven out of ten; repeat ECG is done. Quick update — can you come see her?'
assert c['scenes'][2]['en'] == 'Recurrent CP, repeat ECG done — escalating to the MD.'
c['scenes'][2]['en'] = 'Updating the MD — recurrent CP, repeat ECG done.'

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
