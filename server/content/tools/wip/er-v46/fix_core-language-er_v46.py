import yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'core-language-er.yaml'
d = yaml.safe_load(open(F))
S = d['situations']


def sent(key):
    s, j = key.split('.')
    return S[int(s) - 1]['sentences'][int(j) - 1]


def repl(key, m):
    b = sent(key)['blank']
    seen = set()
    for o in b['options']:
        if o['en'] in m:
            seen.add(o['en'])
            o['en'] = m[o['en']]
            assert 'icon' not in o
    assert seen == set(m), (key, set(m) - seen)
    assert len({o['en'] for o in b['options']}) == 4


def respec(key, answer, others):
    b = sent(key)['blank']
    pos = [o['en'] for o in b['options']].index(b['answer'])
    it = iter(others)
    b['options'] = [{'en': answer} if k == pos else {'en': next(it)} for k in range(4)]
    b['answer'] = answer


def f(key, **kw):
    s = sent(key)
    for k, v in kw.items():
        assert k in s
        s[k] = v


# ---- 빈칸 선택지 (en만, icon 없음)
repl('2.2', {'fever': 'objection', 'cough': 'access', 'pain': 'exposure'})
respec('3.5', 'understand', ['sign', 'pay', 'own'])
respec('4.1', 'wanting', ['refusing', 'forgetting', 'pretending'])
respec('5.1', 'language', ['medicine', 'room', 'form'])
repl('6.3', {'anything': 'much'})
repl('8.4', {'some': 'one', 'half': 'the last', 'no': 'that'})
repl('8.3', {'louder': 'faster'})
respec('9.4', 'prefer', ['complain', 'leave', 'pay'])
repl('9.5', {'without': 'before', 'unless': 'after', 'except': 'until'})
repl('10.3', {'loud': 'slow', 'soft': 'far', 'wide': 'early'})
repl('14.5', {'Turn': 'Bow', 'Hold': 'Tilt'})
repl('15.3', {'forget': 'bring', 'hide': 'send', 'deny': 'sell'})
repl('15.4', {'pay': 'change'})
respec('16.4', 'again', ['later', 'faster', 'louder'])
respec('20.4', 'your', ['my', "the doctor's", 'his'])
respec('20.5', 'wrong', ['easy', 'second', 'extra'])
respec('3.4', 'step', ['result', 'bill', 'meal'])
respec('10.4', 'draw', ['skip', 'erase', 'sign'])
repl('12.3', {'smiling': 'relaxing', 'laughing': 'resting'})
respec('13.1', 'Point', ['Sign', 'Wait', 'Sit'])
repl('13.4', {'fever': 'bleeding', 'chill': 'itch', 'heat': 'swelling'})
repl('13.5', {'disagree': 'cough', 'refuse': 'itch'})
respec('19.5', 'understanding', ['insurance', 'address', 'diet'])
respec('2.5', 'allergy', ['refill', 'bill', 'delivery'])
respec('5.2', 'listen', ['type', 'draw', 'count'])
respec('5.5', 'comfortable', ['difficult', 'foreign', 'formal'])
respec('6.1', 'speaking', ['pointing', 'waving', 'walking'])
respec('12.2', 'strong', ['loud', 'dressed', 'early'])
respec('7.3', 'time', ['coat', 'turn', 'temperature'])
repl('7.4', {'angry': 'quick', 'rude': 'ready', 'upset': 'brief'})
repl('7.5', {'pay': 'check'})
repl('6.5', {'drink': 'read', 'sleep': 'sign', 'eat': 'type'})
repl('14.4', {'shout': 'sign', 'jump': 'call', 'cry': 'leave'})
repl('17.4', {'forget': 'guess', 'hide': 'decide', 'cancel': 'judge'})
repl('15.5', {'glad': 'lucky'})

# ---- decoy
f('3.2', decoy='if you signed')
f('4.1', decoy='for leaving')
f('5.1', decoy='us to avoid')
f('5.5', decoy='comfortable to them')
f('11.4', decoy='the consent form')
f('12.2', decoy='to be here')
f('15.1', decoy='ask you')


# ---- distractorsKo
def dko(key, old, new):
    s = sent(key)
    assert old in s['distractorsKo'], (key, old)
    s['distractorsKo'] = [new if x == old else x for x in s['distractorsKo']]
    assert len(set(s['distractorsKo'])) == 2 and s['ko'] not in s['distractorsKo']


dko('2.2', '음식 알레르기가 있나요?', '지금 약을 드릴게요')
dko('4.5', '도와주셔서 감사해요, 이제 쉬세요', '가족분이 대신 통역해 주세요')
dko('13.5', '한 번 쥐면 이해한 거예요', '아프면 손을 들어 주세요')
dko('14.5', '숨을 못 쉬시면 손을 드세요', '가슴이 아프면 가리켜 주세요')
dko('18.5', '걱정은 이해해요, 곧 설득할게요', '오늘 꼭 치료를 받으셔야 해요')

# ---- why
f('2.5', why="같은 질문을 낱말 순서만 바꿔 다시 물으면 앞선 대답이 같은지 확인할 수 있어요. 알레르기는 평생 이력이라 today는 '지금 다시 확인한다'는 뜻으로만 써요.")
f('4.4', why='always로 개인 판단이 아니라 병원 방침이라는 것을 알려요. 방침이라고 말하면 가족이 덜 서운해해요.')
f('6.4', why='so the interpreter can follow는 목적을 덧붙여, 문장을 짧게 해 달라는 부탁이 통역을 위한 것임을 알려요. 통역사가 따라가기 쉬워야 환자의 말이 빠지지 않아요.')
f('11.1', why='수어를 쓰는 환자에게는 자격 있는 수어 통역사를 불러요. 미국에서는 장애인법(ADA)이 병원에 효과적인 의사소통 수단(수어 통역·문자 통역 등)을 요구해요.')
f('17.2', why='자살 위험은 돌려 말하지 않고 직접 묻는 것이 권장돼요. 직접 물어도 자살 생각이 늘어나지 않는다고 알려져 있어요. hurting yourself만으로는 자해와 자살이 구분되지 않아 이어서 killing yourself를 직접 물어요.')
f('17.3', why='혼자가 아니라고 말하면 위기에 처한 환자가 고립감을 덜 느껴요. keep you safe는 곁에서 지켜보는 것도 벌이 아니라 보호를 위한 것이라는 뜻이에요.')
f('19.3', icon='magnify')


# ---- order
def order(n, lines, why):
    o = S[n - 1]['order']
    for i, (en, ko, note, icon) in lines.items():
        l = o['lines'][i]
        l['en'] = en
        if ko: l['ko'] = ko
        if note: l['note'] = note
        if icon: l['icon'] = icon
    o['why'] = why
    assert len(o['lines']) == 4 and len({l['en'] for l in o['lines']}) == 4
    for l in o['lines']:
        assert len(l['en'].split()) <= 15


order(4, {2: ("That way, everything stays accurate, and the medical words aren't on you.", '그러면 정확하고, 의학 용어는 가족분이 맡지 않으셔도 돼요', None, None),
          3: ('With those words off your plate, would you stay with her as family?', '그 말들은 맡기시고, 가족으로 곁에 계시겠어요?', None, None)},
      why='고마움을 먼저 전하고, 의료 내용은 통역사가 맡는다는 이유를 말하고, 그러면 내용이 정확해지고 의학 용어를 가족이 맡지 않아도 된다고 설명한 뒤, 그 말들을 맡기고 가족으로 곁에 있어 달라고 부탁해요. though, That way, those words가 앞 줄을 가리켜 순서가 하나예요.')
order(7, {2: ('While you wait those extra minutes, please rest.', '늘어난 몇 분 동안 편히 쉬세요', None, None)},
      why='방언 통역사를 찾아야 한다고 알리고, 시간이 더 걸려도 그것이 정확도를 높인다고 설명하고, 늘어난 몇 분 동안 편히 쉬게 하고, 연결되면 감사해요. that, those extra minutes가 앞 줄(a little longer)을 가리켜 순서가 하나예요.')
order(8, {1: ('For so much, that felt short — can the interpreter repeat it in full?', '그렇게 많이 하신 말씀치고 짧았는데, 전부 다시 말해 줄 수 있나요?', None, None)},
      why='환자가 말한 것을 다 듣고 싶다고 하고, 그렇게 많은 말(so much)치고 통역이 짧았다고 전체를 요청하고, 질문을 바꿔 다시 확인한 뒤, 그래도 안 맞으면 한 번 더 확인해요. so much가 첫 줄의 a lot을, it still이 앞 줄을 가리켜 순서가 하나예요.')
order(10, {0: ("First, I'll explain this out loud, so you won't need to read anything.", '먼저 소리 내어 설명할 테니 읽으실 필요 없어요', None, None),
           1: ("As I explain, I'll go step by step and draw each step.", '설명하면서 한 단계씩, 단계마다 그림을 그릴게요', None, None),
           2: ('While I draw, tell me if I go too fast.', '그리는 동안 제가 너무 빠르면 말씀해 주세요', None, None)},
      why='먼저 소리 내어 설명하겠다고 하고, 설명하면서 한 단계씩 그림과 함께 진행하고, 그림을 그리는 동안 속도를 조절하게 하고, 마지막에 다시 짚을 것을 묻는 순서예요. First가 처음을, As I explain이 1줄을, While I draw가 2줄의 그림을 가리키고, Last, again이 마지막을 고정해요.')
order(11, {2: ("Once they're here, they'll sign everything I say, so we can stop writing.", '통역사가 오면 제 말을 전부 수어로 옮기니 그때는 그만 써도 돼요', None, None),
           3: ("When they sign, they'll stand next to me so you can see us both.", '수어할 때는 제 옆에 서서 둘 다 보이게 할게요', '위치', None)},
      why='수어 통역사를 준비 중이라고 알리고, 기다리는 동안 글로 소통하고, 통역사가 오면 말 전체를 수어로 옮기니 그만 써도 된다고 하고, 수어할 때는 통역사가 제 옆에 서서 환자가 둘을 함께 보게 해요. While we wait, Once …here, When they sign이 앞 줄을 가리켜 순서가 하나예요.')
order(13, {2: ('Good, I felt that squeeze. The interpreter is coming, so stay with me.', '네, 꽉 쥐신 거 느꼈어요. 통역사가 오고 있으니 곁에 계세요', None, None)},
      why='통증 위치를 먼저 묻고, 심하면 손을 쥐게 하고, 쥔 것(that squeeze)을 느꼈다고 답하며 통역사가 오고 있다고 알리고, 통역사가 오면 말하게 해요. that squeeze, they가 앞 줄을 가리켜 순서가 하나예요.')
order(16, {2: ("If he can't tell it back, I'll ask the interpreter whether it's the language.", '다시 말하지 못하면 언어 때문인지 통역사에게 물어볼게요', None, None)},
      why="통역사를 통해 설명하고, 그 설명을 다시 말하게 하고, 못 하면 언어 문제인지 통역사에게 먼저 물어보고, 언어 문제가 아니면 가족에게 연락해요. 동의 능력은 의사가 판단하고 통역사는 언어 쪽만 도와요. Then, it, If it's not the language가 앞 줄을 가리켜 순서가 하나예요.")
order(18, {1: ("Maybe there's a misunderstanding behind that concern that I can clear up.", '그 걱정 뒤에 제가 풀어드릴 오해가 있을지도 몰라요', None, None),
           2: ('As I clear it up, the interpreter will make sure I explain it right.', '오해를 푸는 동안 통역사가 제 설명이 정확한지 도와줄 거예요', None, None)},
      why='몰아붙이지 않고 걱정을 이해하겠다고 하고, 그 걱정 뒤에 오해가 있을 수 있다고 하고, 오해를 푸는 동안 통역사가 설명을 정확히 옮긴다고 하고, 그다음 결정은 환자에게 있다고 마무리해요. that concern이 1줄을, it이 2줄의 오해를, After that이 앞 줄 전체를 가리켜 순서가 하나예요.')
order(19, {2: ('With that video interpreter, confirm his understanding each time, since he declined care once.', '그 화상 통역사와 함께 매번 이해를 확인하세요, 한 번 거부하셨거든요', None, 'magnify')},
      why='환자의 언어를 먼저 알리고, 필요한 통역 방식을 말하고, 그 화상 통역사와 함께 매번 이해를 확인하라고 하고, 다시 거부하면 연락해 달라고 해요. He, that video interpreter, again이 앞 줄을 가리켜 순서가 하나예요.')

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
