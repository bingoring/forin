import yaml
P = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-polytrauma.yaml'
d = yaml.safe_load(open(P))
S = d['situations']

def sent(si, j):
    return S[si]['sentences'][j]

def why(si, j, text):
    sent(si, j)['why'] = text

def blank(si, j, opts):
    b = sent(si, j)['blank']
    ans = b['answer']
    new = [{'en': o} for o in opts]
    # 정답은 한 번만, 위치는 기존 정답 자리를 유지
    old = [o['en'] for o in b['options']]
    pos = old.index(ans) if ans in old else 0
    # 새 목록에서 정답이 있으면 그대로, 없으면(답이 바뀜) 호출자가 answer를 따로 바꿈
    b['options'] = new

def decoy(si, j, t):
    sent(si, j)['decoy'] = t

def dko(si, j, a, b):
    sent(si, j)['distractorsKo'] = [a, b]

# ---------- why ----------
why(0, 2, "head to toe는 부위를 하나씩 읽기 전에 전체를 훑는다는 틀을 줘서 환자가 손길을 예상할 수 있어요. 1차평가 E에서는 옷을 벗겨 몸 전체를 드러내 보며 체온을 지키고, 머리부터 발끝까지 자세히 보는 것은 2차평가예요.")
why(13, 0, "so로 원인과 조치를 이어 말하면 보호자가 지금 왜 이렇게 바쁜지 이해해요. 많이 잃은 피를 수액이 아니라 혈액으로 빨리 채우는 것이 출혈성 쇼크 치료의 기본이에요.")
why(11, 0, "짧은 명령문에 쉬운 단어만 쓰고 말이 안 통해도 손으로 답하게 해서 영어가 서툰 환자도 따라 할 수 있어요. worst로 한 곳만 고르게 하면 통역 없이도 먼저 볼 곳이 정해져요.")
why(19, 2, "I need your consent로 필요한 것이 동의라고 분명히 말해요. 수술 동의는 외과의가 설명하고 받으며, 보호자를 구할 시간이 없는 응급에서는 응급 예외로 진행하기도 해요.")

# ---------- 빈칸 ----------
blank(9, 2, ['struck', 'treated', 'checked', 'asked'])
blank(13, 4, ['find', 'help', 'wake', 'thank'])
blank(14, 1, ['properly', 'slowly', 'less', 'rarely'])
sent(11, 2)['blank'] = {'answer': 'interpreter', 'options': [{'en': 'interpreter'}, {'en': 'x-ray'}, {'en': 'IV'}, {'en': 'ice pack'}]}
blank(4, 0, ['fast', 'far', 'long', 'slowly'])
sent(0, 2)['blank'] = {'answer': 'head to toe', 'options': [{'en': 'head to toe'}, {'en': 'side to side'}, {'en': 'front to back'}, {'en': 'heel to toe'}]}
blank(2, 3, ['low', 'high', 'better', 'unstable'])
blank(4, 4, ['sitting', 'trapped', 'sleeping', 'lying'])
blank(5, 0, ['assessing', 'moving', 'transferring', 'discharging'])
blank(5, 1, ['heavily', 'lightly', 'internally', 'a little'])
blank(13, 0, ['fast', 'later', 'partly', 'carefully'])
blank(20, 1, ['early', 'late', 'loosely', 'later'])
blank(19, 1, ['straight', 'first', 'later', 'back'])
blank(7, 4, ['closely', 'rarely', 'briefly', 'hourly'])
blank(19, 4, ['update', 'find', 'call', 'meet'])
blank(15, 1, ['release', 'increase', 'measure', 'check'])
blank(12, 1, ['left', 'right', 'other', 'far'])

# ---------- decoy ----------
decoy(2, 0, 'your temperature')
decoy(3, 1, 'when you sit up')
decoy(4, 1, 'a helmet')
decoy(9, 3, 'the dressing')
decoy(10, 0, 'your hip')
decoy(17, 3, 'Rhythm check')

# ---------- distractorsKo ----------
dko(0, 4, '숨쉬기 불편한 데가 있는지 말씀해 주세요', '가족분 연락처를 알려 주세요')
dko(3, 0, '언제부터 아팠는지 말씀해 주세요', sent(3, 0)['distractorsKo'][1])
dko(11, 0, '통증이 몇 점인지 손가락으로 보여 주세요', '통역사가 곧 연결돼요')
dko(6, 4, '상처는 소독하고 붕대를 감을게요', sent(6, 4)['distractorsKo'][1])
dko(14, 0, '젖은 옷을 벗겨 드릴게요', '수액을 데워서 넣을게요')
dko(3, 4, sent(3, 4)['distractorsKo'][0], '아픈 부위에 얼음을 대 드릴게요')
dko(8, 2, '이 약은 언제부터 드셨어요?', '피 검사로 응고 수치를 볼게요')
dko(8, 3, sent(8, 3)['distractorsKo'][0], '약 때문에 머리 CT를 찍을 거예요')
dko(10, 3, '검사 결과가 나오면 알려 드릴게요', sent(10, 3)['distractorsKo'][1])
dko(12, 4, '아기 심장 소리를 들어 볼게요', sent(12, 4)['distractorsKo'][1])
dko(15, 0, '산소를 더 올릴게요', sent(15, 0)['distractorsKo'][1])
dko(20, 1, sent(20, 1)['distractorsKo'][0], '얼굴에 차가운 거즈를 대 드릴게요')
dko(1, 4, '곧 엑스레이를 찍으러 갈게요', sent(1, 4)['distractorsKo'][1])
dko(15, 2, '산소마스크를 씌워 드릴게요', sent(15, 2)['distractorsKo'][1])
dko(19, 4, '대기실 위치를 알려 드릴게요', sent(19, 4)['distractorsKo'][1])

# ---------- tag/icon ----------
sent(2, 3)['icon'] = 'monitor'
sent(4, 0)['icon'] = 'siren'

# ---------- order ----------
def line(en, icon, ko, note):
    return {'en': en, 'icon': icon, 'ko': ko, 'note': note}

def setlines(si, idx_new, why_text=None):
    o = S[si]['order']
    for k, v in idx_new.items():
        o['lines'][k] = v
    if why_text:
        o['why'] = why_text

# S0
S[0]['order']['lines'][3]['note'] = '전신'
# S1
setlines(1, {3: line('Please bear with that discomfort until the doctor clears your neck.', 'check', '그 불편함은 의사가 목을 확인할 때까지 조금만 참아 주세요', '부탁')},
         "머리를 가만히 두라고 부탁하고, 그것을 돕는 칼라를 대고, 불편함을 인정하며 이유를 말한 뒤, 그 불편함을 의사가 확인할 때까지 참아 달라고 닫아요. 'that'·'the collar'·'that discomfort'가 앞 줄에 기대어 순서가 하나예요.")
# S4
setlines(4, {2: line('Belted or not, were you thrown from the vehicle at all?', 'siren', '벨트를 맸든 안 맸든, 차 밖으로 튕겨나가셨나요?', '튕김'),
             3: line('After all of that, do you remember how the crash happened?', 'bulb', '그 모든 일 뒤에, 충돌이 어떻게 일어났는지 기억하세요?', '기억')},
         "속도를 먼저 묻고, 그 속도에서 벨트를 맸는지 묻고, 벨트와 상관없이 차 밖으로 튕겨났는지 묻고, 전부를 바탕으로 기억을 묻습니다. 'that speed'·'Belted or not'·'all of that'이 앞 줄에 기대어 순서가 하나예요.")
# S6
setlines(6, {2: line('To find it, tell me—does your belly feel tender or full anywhere?', 'me', '그걸 찾으려면, 배가 어디 아프거나 팽만한지 말씀해 주세요', '문진'),
             3: line("Whatever you tell me, we're still getting scans to look inside.", 'magnify', '어떤 말씀을 하시든 안쪽을 보는 스캔은 그대로 찍을 거예요', '검사')},
         "작은 부상이라는 환자의 생각을 인정하고, 그래도 속에 문제가 숨을 수 있다고 말하고, 그것을 찾으려고 배 상태를 묻고, 어떤 답이든 스캔은 찍는다고 닫습니다. 'Even so'·'it'·'Whatever you tell me'이 앞 줄에 기대어 순서가 하나예요.")
# S7
setlines(7, {2: line("With the binder on, we're getting blood ready for you.", 'lab', '바인더를 댄 채로 혈액을 준비하고 있어요', '준비'),
             3: line('Your pulse and blood pressure will tell us how soon you need that blood.', 'monitor', '맥박과 혈압이 그 혈액이 얼마나 빨리 필요한지 알려 줄 거예요', '감시')},
         "골반이 불안정하니 움직이지 말라고 알리고, 그걸 돕는 바인더를 대고, 바인더를 댄 채 혈액을 준비하고, 맥박과 혈압이 그 혈액이 얼마나 빨리 필요한지 알려 준다고 닫아요. 'that'·'the binder'·'that blood'가 앞 줄에 기대어 순서가 하나예요.")
# S8
setlines(8, {2: line('Good to know when you took it—now tell me every other medication you take.', 'pill', '언제 드셨는지 알겠어요, 이제 드시는 다른 약은 전부 말씀해 주세요', '목록')},
         "어떤 약인지 묻고, 그 약의 마지막 복용을 묻고, 복용 시각을 받아 다른 약을 전부 말해 달라고 하고, 모든 것을 이유로 세심히 지켜본다고 닫아요. 'that one'·'when you took it'·'all of that'이 앞 줄에 기대어 순서가 하나예요.")
# S9
setlines(9, {3: line('Through those scans and until surgery, try to stay very still for me.', 'lock', '그 스캔을 하는 동안과 수술 전까지 최대한 가만히 계셔 주세요', '부탁')},
         "건드리지 말라고 하고, 그대로 둔 채 고정한다고 알리고, 고정되면 경로를 보려고 스캔을 찍고, 그 스캔과 수술 전까지 가만히 있어 달라고 닫아요. 'it'·'Once it's held steady'·'those scans'가 앞 줄에 기대어 순서가 하나예요.")
# S14
setlines(14, {2: line('Keeping that temperature up helps your blood clot properly.', 'bulb', '그 체온을 지키면 피가 제대로 굳어요', '이유'),
              3: line('Since clotting depends on it, tell me right away if you start shivering.', 'bell', '응고가 체온에 달려 있으니 떨리기 시작하면 바로 말씀해 주세요', '요청')},
         "따뜻한 담요를 덮는다고 알리고, 그 담요가 체온 하락을 막는다고 설명하고, 그 체온이 응고를 돕는다고 이유를 말하고, 응고가 체온에 달려 있으니 떨림은 체온이 떨어진다는 신호라 바로 알려 달라고 닫아요. 'Those blankets'·'that temperature'·'it'이 앞 줄에 기대어 순서가 하나예요.")
# S15
setlines(15, {3: line("Stay with me—once that's done, we'll check your breathing again.", 'faceWorried', '정신 차리세요, 그게 끝나면 호흡을 다시 확인할게요', '안심')},
         "한쪽 호흡음이 없다고 알리고, 그것이 압력이 차오른다는 뜻이라고 설명하고, 그 압력을 지금 빼낸다고 하고, 그게 끝나면 호흡을 다시 확인한다고 닫아요. 'That'·'it'·'that's done'이 앞 줄에 기대어 순서가 하나예요.")
# S17
setlines(17, {1: line('Bilateral chest decompression now to rule that out, compressions continuing.', 'scalpel', '그걸 배제하려고 양측 흉강 감압 지금, 압박은 계속', '감압'),
              2: line('Two minutes—hold compressions for a pulse check.', 'stetho', '2분이 됐어요—맥박 확인, 압박 잠깐 멈춰', '맥박'),
              3: line('During that pause, ultrasound for cardiac tamponade.', 'monitor', '그 멈춤 동안 초음파로 심장압전 확인', '초음파')},
         "압박을 이어 가며 기흉을 확인하고, 그걸 배제하려 압박을 이어 가며 양측 감압을 하고, 2분이 되면 압박을 멈춰 맥박을 확인하고, 그 멈춤 동안 초음파로 압전을 봅니다. 가역 원인을 동시에 다루면서 압박 중단을 줄여요. 'that'·'Two minutes'·'that pause'가 앞 줄에 기대어 순서가 하나예요.")
# S19
setlines(19, {2: line('To take him there, the surgeon needs your consent first.', 'pencil', '그리로 모시려면 먼저 외과 의사가 동의를 받아야 해요', '동의'),
              3: line("After that, I'll come back and update you as soon as he's out of surgery.", 'bell', '그 뒤에 제가 돌아와서 수술이 끝나는 대로 알려 드릴게요', '약속')},
         "수술이 필요하다고 알리고, 그래서 수술실로 바로 간다고 하고, 그리로 모시려면 외과의가 먼저 동의를 받는다고 설명하고, 그 뒤에 수술이 끝나면 알려 드리겠다고 닫아요. 'Because of that'·'there'·'After that'이 앞 줄에 기대어 순서가 하나예요.")

# ---------- swap ko ----------
for n in S[1]['nuance']:
    if n['kind'] == 'swap':
        n['ko'] = '목에 이상이 없다고 확인될 때까지 목 보호대는 그대로 둡니다'

# ---------- context (C5: 같은 word가 세 장면 en 모두에, 어색한 장면은 듣는 사람에게 맞지 않게) ----------
def ctx(si):
    return [n for n in S[si]['nuance'] if n['kind'] == 'context'][0]

c = ctx(2)
c['scenes'][0]['en'] = "She's tachycardic at 128, BP 92 over 60—shock index about 1.4."
c['why'] = "tachycardic(빈맥)·쇼크지수는 의료진이 순환 상태를 가늠하는 말로, 쇼크지수는 심박수÷수축기 혈압이고 1 가까이 오르면 쇼크를 의심해요. 환자에게는 숫자 대신 '빠르다·조금 낮다'로 말해요."

c = ctx(3)
c['word'] = 'pain'; c['ko'] = '통증'
c['scenes'][0]['en'] = "So the pain is worst here on your left side and down your left leg, right?"
c['scenes'][1]['en'] = "Pt localizes pain to L flank and L thigh."
c['scenes'][2]['en'] = "She says the pain is on her side and her leg."
c['scenes'][2]['fix'] = "She's localizing the pain to her left flank and left thigh."
c['why'] = "팀 리더에게는 통증 부위를 해부학 용어(left flank, left thigh)로 정확히 말해요. '옆구리와 다리'처럼 뭉뚱그리면 어느 쪽 어디인지 알 수 없어요."

c = ctx(6)
c['scenes'][0]['en'] = "She's pale and tachycardic—I'm worried about occult hemorrhage."

c = ctx(7)
c['word'] = 'binder'; c['ko'] = '골반 바인더'
c['scenes'][2]['en'] = "I put a binder around her hips, up near her belt line."
c['scenes'][2]['fix'] = "Pelvic binder is on, centered over the greater trochanters."
c['why'] = "골반 바인더는 장골능이 아니라 대전자 높이에 대야 골반을 제대로 조여요. 팀에는 '벨트 높이 근처'처럼 뭉뚱그리지 말고 위치를 정확히 보고해야 제대로 댔는지 알 수 있어요."

c = ctx(11)
c['word'] = 'interpreter'; c['ko'] = '통역사'
c['scenes'][2]['en'] = "I'm going to facilitate interpreter services for you through our language access office."
c['why'] = "interpreter services·language access office는 병원 행정의 말이에요. 영어가 서툰 환자에게는 'an interpreter'처럼 짧고 쉬운 말로 지금 무엇을 하는지 말해요."

c = ctx(13)
c['scenes'][0]['en'] = "Activate the MTP—1:1:1."

c = ctx(14)
c['scenes'][1]['en'] = "Temp 35.2 °C; lethal triad precautions: warm blankets and fluid warmer applied."

c = ctx(19)
c['word'] = 'operating room'; c['ko'] = '수술실'
c['scenes'][0]['en'] = "The operating room is ready—we're rolling now."
c['scenes'][2]['en'] = "We're rolling to the operating room stat."
c['why'] = "rolling·stat은 팀끼리의 줄임말이에요. 겁먹은 보호자에게는 어디로 가는지 풀어서 분명히 말해요."

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
