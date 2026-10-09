import yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-bleeding-wound.yaml'
d = yaml.safe_load(open(F))
S = d['situations']

def sent(a, b, en_start):
    s = S[a]['sentences'][b]
    assert s['en'].startswith(en_start), (a, b, s['en'])
    return s

# ---- why (W1-W8)
WHY = {
 (15, 4, 'A tourniquet stops'): "alone은 '그것만으로는'이라는 뜻이에요. 눌러서 안 멎는 사지 출혈에 지혈대를 쓰지만, 뿜어 나오는 출혈처럼 목숨이 걸린 출혈이면 압박이 실패하기를 기다리지 않고 바로 감아요.",
 (16, 2, "We're preparing"): "preparing you for…로 환자가 대상임을 분명히 말해요. 수혈은 잃은 피를 채울 뿐이라, 계속되는 출혈은 수술로 원인 부위를 막아야 멈춰요.",
 (1, 1, 'Keep your hand'): "above your heart처럼 기준점을 말해 주면 환자가 높이를 스스로 맞춰요. 거상은 돕는 정도이고, 지혈의 핵심은 계속 누르는 거예요.",
 (10, 2, 'Keep the limb'): "to slow the flow로 거상의 목적을 알려 줘요. 거상은 보조일 뿐이라 압박 드레싱을 풀지 않고 함께 해요.",
 (7, 1, 'Do you know'): "if로 예/아니오 대답을 이끌어 확실히 모르면 모른다고 답하기 쉬워요. 개의 광견병 접종 여부와 그 개를 10일 동안 지켜볼 수 있는지가 예방 치료를 가르는 단서예요.",
 (11, 4, "Let's check"): "Let's…는 '우리 함께 하자'는 말투라 검사를 같이 하는 느낌을 줘요. 두피 열상은 상처가 두개골까지 닿았는지, 그 아래 골절이 있는지 보는 것이 중요해요.",
}
for (a, b, st), w in WHY.items():
    sent(a, b, st)['why'] = w
s = sent(3, 4, 'A dirty')
assert 'even more으로' in s['why']
s['why'] = s['why'].replace('even more으로', 'even more로')
s = sent(8, 4, "It's on my knuckle")
old = "right here를 덧붙이며 손으로 짚는 말이라 병원 영어에서도 자연스러워요."
assert s['why'].startswith(old)
s['why'] = "right here를 덧붙이면 말과 함께 손으로 짚어 위치를 정확히 알려 줘요." + s['why'][len(old):]

# ---- 빈칸 (B1-B20): (sit, idx, en_start, answer, options)
def pos(answer, others, k):
    o = list(others); o.insert(k % 4, answer); return o
BL = [
 (0, 4, 'I need to check', 'depth', ['color', 'shape', 'smell']),
 (2, 1, "I'm checking", 'inside', ['loose', 'showing', 'broken']),
 (3, 5, "You'll feel", 'quick', ['long', 'deep', 'slow']),
 (4, 1, 'On a scale', 'bad', ['long', 'deep', 'new']),
 (4, 5, 'Does the pain', 'sharp', ['mild', 'itchy', 'numb']),
 (5, 2, "You'll come back", 'removed', ['tightened', 'counted', 'checked']),
 (5, 3, 'Are you going', 'stitch', ['glue', 'tape', 'staple']),
 (6, 1, "We'll check", 'clotting', ['kidney', 'liver', 'thyroid']),
 (6, 4, 'When did you', 'take', ['miss', 'skip', 'change']),
 (6, 5, 'Your labs', 'labs', ['x-rays', 'scans', 'vitals']),
 (7, 2, 'You may need', 'antibiotics', ['steroids', 'antacids', 'stitches']),
 (10, 3, 'The blood is', 'flowing', ['drying', 'spurting', 'clotting']),
 (11, 0, 'Scalp wounds', 'lot', ['little', 'bit', 'while']),
 (12, 4, "I'm looking", 'odor', ['drainage', 'color', 'swelling']),
 (13, 3, 'Let me call', 'call', ['thank', 'pay', 'tell']),
 (14, 5, "I'll report", 'report', ['show', 'send', 'hand']),
 (15, 1, "I'm noting", 'noting', ['guessing', 'hiding', 'losing']),
 (16, 2, "We're preparing", 'surgery', ['dialysis', 'discharge', 'rehab']),
 (19, 3, 'I keep vomiting', 'vomiting', ['coughing', 'passing', 'losing']),
 (20, 3, 'Surgery wants', 'handoff', ['consult', 'bed', 'callback']),
]
for k, (a, b, st, ans, others) in enumerate(BL):
    s = sent(a, b, st)
    s['blank'] = {'answer': ans, 'options': [{'en': x} for x in pos(ans, others, k * 3 + 1)]}
# 10.3 keeps `dripping`->`spurting` only (answer unchanged, flowing) - handled above with the same options list

# ---- decoy (D1-D3)
for a, b, st, old, new in [(0, 0, 'How long', 'from your hand', 'have you found'),
                           (3, 3, 'I honestly', 'very well', 'my first shot'),
                           (2, 3, 'How did you fall', 'Why did you fall', 'When did you fall')]:
    s = sent(a, b, st); assert s['decoy'] == old, s['decoy']; s['decoy'] = new

# ---- distractorsKo (K1-K10 + 선택 2)
def dko(a, b, st, old, new):
    s = sent(a, b, st); assert old in s['distractorsKo'], (a, b, s['distractorsKo'])
    s['distractorsKo'][s['distractorsKo'].index(old)] = new
dko(5, 1, 'Keep the wound', '오늘은 무거운 것은 들지 마세요', '샤워는 내일부터 하셔도 돼요')
dko(7, 0, "We'll clean", '광견병 주사는 내일 맞을 거예요', '물린 지 얼마나 됐나요?')
dko(9, 3, 'I think', '유리 조각이 손가락에 박힌 것 같아요', '상처 주변이 계속 따끔거려요')
dko(11, 3, None or S[11]['sentences'][3]['en'][:6], '머리카락 속에서 피가 계속 흘러요', '부딪힌 곳에 혹이 났어요')
dko(13, 5, 'Please tell', '통역사에게 천천히 말씀해 주세요', '드시는 약이 있으면 알려 주세요')
dko(15, 2, 'It will be tight', '지금 진통제를 먼저 놓을게요', '지혈대를 감은 뒤에 진통제를 드릴게요')
dko(17, 5, 'Swelling in', '목에 감은 붕대는 풀지 마세요', '침을 삼키기 힘들면 말씀해 주세요')
dko(13, 0, "I'm getting", '통역 전화를 연결하는 데 잠깐 걸려요', '어느 나라 말을 쓰세요?')
dko(18, 4, 'The tourniquet must', '붕대는 풀지 마세요', '수술팀이 곧 내려올 거예요')
dko(20, 0, 'This is a 36', '이 환자는 36세 남자입니다', '왼쪽 허벅지 열상 환자입니다')
dko(0, 2, 'Let me look', '혈압부터 재 볼게요', '혈압도 같이 잴게요')
# 16.0 : find by text
hit = [(b, s) for b, s in enumerate(S[16]['sentences']) if '혈액형부터 다시 확인할게요' in s['distractorsKo']]
assert len(hit) == 1
hs = hit[0][1]; hs['distractorsKo'][hs['distractorsKo'].index('혈액형부터 다시 확인할게요')] = '혈액형 검사도 같이 보낼게요'

# ---- order (O1-O13)
def L(en, icon, ko, note):
    return {'en': en, 'icon': icon, 'ko': ko, 'note': note}
def order(i, lines, why, expect_first):
    o = S[i]['order']; assert o['lines'][0]['en'] == expect_first, o['lines'][0]['en']
    for k, ln in lines.items():
        o['lines'][k - 1] = ln
    if why: o['why'] = why

order(0, {3: L('Over that time, has it flowed steadily or spurted with your pulse?', 'magnify', '그동안 피가 꾸준히 흘렀나요, 맥박에 맞춰 뿜어졌나요?', '박동')},
 "먼저 압박을 시작하고, 그 상태로 경과를 묻고, 그동안의 출혈이 꾸준했는지 맥박에 맞춰 뿜어졌는지 가린 뒤, 모든 정보로 크기·깊이를 확인해요. 'it'·'that time'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.",
 "I'm pressing on the wound now, so please stay still.")
order(2, {3: L("Along with what you feel, I'll look at how deep it is.", 'magnify', '느끼시는 것과 함께 얼마나 깊은지 제가 살펴볼게요', '확인')},
 "먼저 헹궈 흙을 씻어 내고, 그 헹굼 뒤 남은 느낌을 묻고, 환자가 느끼는 것과 함께 눈으로 깊이를 확인한 뒤, 이 모두로 감염 위험이 낮아진다고 닫아요. 'That rinse'·'what you feel'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.",
 "We'll rinse the wound well to wash the dirt out.")
order(4, {2: L('So what cut you, and was it dirty or rusty?', 'magnify', '그래서 무엇에 베였고, 그게 더럽거나 녹슬었나요?', '원인'),
          3: L('Where it cut you, how bad is the pain from zero to ten?', 'faceWorried', '베인 그 자리가 0에서 10 중에 얼마나 아픈가요?', '점수')},
 "시점과 활동을 묻고, 그래서 무엇에 베였고 물건이 어땠는지 묻고, 그 물건이 벤 자리의 통증 점수를 묻고, 그 통증의 양상을 묻는 순서예요. 'So'·'it'·'that pain'이 앞 줄을 가리켜 순서가 하나예요.",
 'When did this happen, and what were you doing?')
order(6, {2: L("With that information, we'll check your clotting labs to guide treatment.", 'lab', '그 정보를 바탕으로 치료 방향을 정하려고 응고 검사를 확인할게요', '검사'),
          4: L('On top of that pressure, those numbers decide if you need clotting medicine.', 'pill', '그 압박에 더해, 그 수치로 응고를 돕는 약이 필요한지 정해요', '치료')},
 "복용약과 마지막 복용 시각을 묻고, 그 정보로 응고 검사를 알리고, 수치가 어떻든 압박은 계속하고, 그 압박에 더해 수치가 응고 약 필요 여부를 정한다고 알려요. 'With that information'·'the numbers'·'that pressure'가 앞 줄을 가리켜 순서가 하나예요.",
 'Which blood thinner do you take, and when was your last dose?')
order(8, {4: L("Open or not, you'll need antibiotics and close follow-up.", 'pill', '열어 두든 아니든 항생제와 꼼꼼한 추적 관찰이 필요해요', '추적')},
 "물린 곳과 경위를 묻고, 그 말에서 사람 교상임을 짚고, 그 위험 때문에 열어 둔다고 알린 뒤, 열어 두든 아니든 항생제와 추적이 필요하다고 닫아요. 'what you've told me'·'that risk'·'Open or not'이 앞 줄을 가리켜 순서가 하나예요.",
 'Tell me where the bite is and how it happened.')
order(9, {3: L("Knowing exactly where that glass is, we won't have to dig around blindly.", 'shield', '그 유리의 정확한 위치를 알면 무작정 헤집지 않아도 돼요', '안심'),
          4: L("Since we're not digging, tell me right away if it hurts more or feels numb.", 'bell', '헤집지 않을 거니 더 아프거나 감각이 둔하면 바로 말씀해 주세요', '확인')},
 "먼저 부위를 가만히 두게 하고, 그 엑스레이가 위치를 보여 준다고 알리고, 위치를 정확히 알면 헤집지 않아도 된다고 밝힌 뒤, 헤집지 않으니 더 아프거나 감각이 둔하면 바로 말하라고 닫아요. 'That X-ray'·'that glass'·'Since we're not digging'이 앞 줄을 가리켜 순서가 하나예요.",
 'Please keep the area still, because I\'m going to get an X-ray.')
order(11, {2: L('Even with this pressure, scalp wounds bleed a lot and look worse than they are.', 'bulb', '이렇게 눌러도 두피 상처는 피가 많이 나서 실제보다 심해 보여요', '설명'),
           3: L('Even so, did you hit your head hard when this happened?', 'stetho', '그래도 이런 일이 생길 때 머리를 세게 부딪혔나요?', '머리'),
           4: L("Either way, let's check if the cut goes down to the bone.", 'magnify', '어느 쪽이든 상처가 뼈까지 닿았는지 확인해 볼게요', '깊이')},
 "먼저 가장자리를 눌러 지혈하고, 그 압박에도 두피 출혈이 실제보다 심해 보이는 이유를 설명하고, 그래도 머리를 세게 부딪혔는지 묻고, 어느 쪽이든 상처가 뼈까지 닿았는지 확인해요. 'this pressure'·'Even so'·'Either way'가 앞 줄을 가리켜 순서가 하나예요.",
 "I'm pressing firmly on the wound edges right now.")
order(12, {2: L('Besides the foot itself, have you had a fever or felt unwell?', 'stetho', '발 말고도 열이 났거나 몸이 안 좋았나요?', '전신'),
           3: L('Either way, how has your blood sugar been running lately?', 'chartup', '어느 쪽이든 요즘 혈당은 어땠나요?', '혈당'),
           4: L('Keeping it under control will help this heal.', 'bulb', '그걸 잘 조절하면 상처가 낫는 데 도움이 돼요', '교육')},
 "상처 상태를 보고, 발 말고 열이나 전신 증상이 있는지 묻고, 어느 쪽 답이든 요즘 혈당이 어땠는지 묻고, 그 혈당을 관리하면 낫는 데 도움이 된다고 닫아요. 'Besides the foot itself'·'Either way'·'it'이 앞 줄을 가리켜 순서가 하나예요.",
 "I'm checking the wound for dead tissue, redness, and any bad odor.")
order(13, {2: L('With the interpreter here, how did the wound happen, and with what?', 'magnify', '통역이 함께 있으니, 상처가 어떻게 어떤 것으로 생겼나요?', '경위'),
           3: L('Before we treat it, are you allergic to any medicines, and is your tetanus current?', 'pill', '치료하기 전에 약 알레르기가 있으신가요, 파상풍 접종은 최신인가요?', '확인')},
 "먼저 통역을 연결하고, 통역이 함께 있는 상태에서 경위를 묻고, 치료 전에 알레르기·접종을 묻고, 그 모두에 답이 나오면 통역이 계획을 전한다고 닫아요. 'the interpreter'·'Before we treat it'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.",
 "I'm getting an interpreter so we can understand each other.")
order(14, {3: L("That's why we'll hold firm pressure longer and monitor closely.", 'bandage', '그래서 압박을 더 오래 유지하면서 자세히 관찰할게요', '처치')},
 "복용약과 시점을 묻고, 그 약들이 함께 지혈을 어렵게 한다고 알리고, 그래서 더 오래 누르며 관찰한다고 밝힌 뒤, 그 모두를 근거로 바로 의사에게 보고해요. 'those'·'That's why'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.",
 'Which blood thinners do you take, and when did you last take them?')
order(16, {1: L("Your blood pressure is very low, so we're moving fast.", 'monitor', '혈압이 매우 낮아서 빠르게 움직이고 있어요', '상태'),
           3: L('The surgical team is getting ready, because blood alone may not stop the bleeding.', 'scalpel', '혈액만으로는 출혈이 멈추지 않을 수 있어서 수술팀이 준비하고 있어요', '수술'),
           4: L('With surgery on standby, tell me right away if you feel colder or faint.', 'bell', '수술을 대기시켜 둔 상태에서 더 춥거나 어지러우면 바로 말씀해 주세요', '알림')},
 "혈압이 매우 낮아 빠르게 움직인다고 알리고, 그래서 바로 혈액을 주고, 혈액만으로 부족할 수 있어 수술팀이 준비하고, 수술을 대기시킨 상태에서 증상 변화를 알려 달라고 해요. 'Because of that'·'blood alone'·'With surgery on standby'가 앞 줄을 가리켜 순서가 하나예요.",
 "Your blood pressure is lower than we'd like, so we're moving quickly.")
order(17, {1: L("We're controlling the bleeding and protecting your airway right now.", 'shield', '지금 출혈을 조절하고 기도를 보호하고 있어요', '처치'),
           3: L('Since that can happen fast, tell me right away if breathing gets harder.', 'bell', '그런 일은 빠르게 생길 수 있으니 숨쉬기가 더 힘들어지면 바로 말씀해 주세요', '요청'),
           4: L("Whether or not you tell me, I'll keep checking that your airway is open.", 'stetho', '말씀하시든 안 하시든 기도가 열려 있는지 계속 확인할게요', '확인')},
 "먼저 지혈과 기도 보호를 하고 있다고 알리고, 그 이유로 목 부종이 기도를 누를 수 있다고 설명하고, 그런 일이 빠르게 생길 수 있으니 숨이 힘들어지면 바로 알려 달라고 한 뒤, 알리든 안 알리든 기도를 계속 확인해요. 'That's because'·'Since that'·'Whether or not you tell me'가 앞 줄을 가리켜 순서가 하나예요.",
 'Tell me right away if your breathing gets any harder.')
order(18, {3: L("Until that surgery, we're keeping the amputated part cool and moist.", 'shield', '그 수술 전까지 절단된 부위를 차갑고 촉촉하게 보존하고 있어요', '보존'),
           4: L('To give it the best chance, the surgical team is being called for possible reattachment.', 'bell', '가장 좋은 가능성을 주려고 재접합을 대비해 수술팀을 부르고 있어요', '호출')},
 "먼저 지혈대를 바로 적용하고, 그 지혈대는 수술 때까지 둔다고 알리고, 그 수술 전까지 절단부를 차갑게 보존하고, 가장 좋은 가능성을 주려고 수술팀을 부른다고 닫아요. 'That tourniquet'·'that surgery'·'the best chance'가 앞 줄을 가리켜 순서가 하나예요.",
 "We're placing a tourniquet now to stop the bleeding.")

# ---- context (C1-C5)
def ctx(i, word):
    c = [n for n in S[i]['nuance'] if n['kind'] == 'context' and n['word'] == word]
    assert len(c) == 1; return c[0]
c = ctx(15, 'tourniquet time')
c['why'] = "'Tourniquet time 1420, documented.'처럼 차트 칸을 읽듯 끊어 말하는 건 의료진끼리의 말투예요. 환자에게는 무엇을 왜 적는지 쉬운 말로 알려요."
c = ctx(11, 'consciousness')
c['why'] = "documented·secondary to 같은 말은 차트와 의료진의 말이에요. 환자에게는 'pass out·black out'처럼 쉬운 말로 물어요."
c = ctx(14, 'report')
c['scenes'][0]['en'] = 'Calling to report bed 6 — aspirin and clopidogrel, still oozing after 20 minutes of pressure.'
assert not c['scenes'][2]['ok']
c['scenes'][2]['en'] = "I'll report this to the attending and escalate per protocol."
c = ctx(19, 'turn')
assert not c['scenes'][2]['ok']
c['scenes'][2]['en'] = "We're going to turn you to the lateral decubitus position for aspiration precautions."
c = ctx(16, 'blood pressure')
c['scenes'][2]['fix'] = "Your blood pressure is low and your heart is beating fast — we're giving you blood right now."

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
