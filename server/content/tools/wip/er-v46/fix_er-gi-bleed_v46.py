import yaml, re
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-gi-bleed.yaml'
d = yaml.safe_load(open(F))
S = d['situations']

def sent(a, b, st):
    s = S[a]['sentences'][b]
    assert s['en'].startswith(st), (a, b, s['en'])
    return s

# ---- why (W1-W7)
WHY = {
 (15, 1, "We're giving fluids"): "right away로 기다리는 시간이 없다고 알려요. 출혈성 쇼크에서는 수액은 적게, 혈액은 일찍 주면서 출혈 부위를 막는 것이 치료의 핵심이에요.",
 (7, 5, 'The colonoscopy'): "help the doctor find로 검사가 무엇을 위한 것인지 의사의 목적으로 말해요. where the bleeding is coming from은 이 검사가 찾는 대상을 구체적으로 알려 줘요.",
 (19, 5, 'The next team'): "will know로 정보가 끊기지 않고 넘어간다고 알려 안심시켜요. 인계는 병력과 현재 상태를 함께 전하는 것이고, 시술 전에는 그 팀이 이름과 알레르기를 한 번 더 확인해요.",
 (9, 2, "We'll watch"): "closely로 더 가까이, 더 자주 본다고 알려요. 심한 수혈 반응은 대개 시작 후 처음 15분 안에 나타나서 그때 곁에 머물며 자주 살펴요.",
 (20, 4, "I'm watching"): "tonight으로 지켜보는 기간을 밤으로 짚어 밤새 지켜본다고 알려요. 재출혈 뒤에는 맥박·혈압 변화가 먼저 오는 경우가 많아 자주 재요.",
 (17, 1, "We're ordering"): "to help you clot으로 약이 아니라 몸이 피를 엉기게 돕는 일이라고 설명해요. 혈소판은 피를 엉기게 하는 혈액 성분이고 혈장에는 응고인자가 들어 있어요.",
}
for (a, b, st), w in WHY.items():
    sent(a, b, st)['why'] = w
s = sent(5, 1, 'How much blood did')
assert '한 번에 묻어요' in s['why']
s['why'] = s['why'].replace('한 번에 묻어요', '한 번에 물어요')

# ---- 빈칸 (B1-B34): (sit, idx, old_answer, new_answer, others)
BL = [
 (0, 3, 'brought', 'brought', ['coughed', 'held', 'kept']),
 (1, 0, 'feel', 'lightheaded', ['nauseous', 'sleepy', 'numb']),
 (1, 3, 'almost', 'fall', ['faint', 'vomit', 'choke']),
 (1, 4, 'lost', 'lost', ['gained', 'given', 'received']),
 (2, 1, 'take', 'ibuprofen', ['insulin', 'warfarin', 'omeprazole']),
 (2, 2, 'regularly', 'regularly', ['rarely', 'occasionally', 'anymore']),
 (2, 3, 'taking', 'taking', ['skipping', 'stopping', 'changing']),
 (3, 1, 'more', 'tired', ['thirsty', 'bloated', 'itchy']),
 (3, 4, 'weak', 'weak', ['numb', 'itchy', 'sore']),
 (3, 5, 'anemia', 'anemia', ['diabetes', 'pneumonia', 'kidney disease']),
 (4, 0, 'quickly', 'quickly', ['slowly', 'gently', 'later']),
 (4, 1, 'pinch', 'pinch', ['cramp', 'tingle', 'chill']),
 (4, 5, 'stay', 'whole', ['first', 'next', 'last']),
 (5, 2, 'reduce', 'reduce', ['measure', 'monitor', 'increase']),
 (6, 0, 'suggests', 'suggests', ['excludes', 'causes', 'treats']),
 (6, 1, 'before', 'heartburn', ['diarrhea', 'constipation', 'hiccups']),
 (6, 5, 'lower', 'lower', ['raise', 'release', 'measure']),
 (7, 5, 'where', 'colonoscopy', ['endoscopy', 'transfusion', 'ultrasound']),
 (8, 0, 'last', 'INR', ['A1c', 'cholesterol', 'potassium']),
 (8, 1, 'take', 'day', ['week', 'month', 'hour']),
 (11, 0, 'feel', 'dizzy', ['sleepy', 'hungry', 'itchy']),
 (8, 4, 'effect', 'vitamin K', ['vitamin D', 'iron', 'potassium']),
 (9, 3, 'generally', 'safe', ['painful', 'quick', 'simple']),
 (9, 5, 'temperature', 'temperature', ['weight', 'height', 'blood sugar']),
 (10, 1, 'beforehand', 'beforehand', ['afterwards', 'later', 'overnight']),
 (10, 5, 'usually', 'week', ['day', 'month', 'year']),
 (11, 5, 'Someone', 'help', ['watch', 'let', 'make']),
 (12, 0, 'fully', 'respect', ['question', 'doubt', 'ignore']),
 (12, 1, 'support', 'support', ['transfuse', 'sedate', 'discharge']),
 (15, 1, 'fluids', 'fluids', ['pills', 'insulin', 'steroids']),
 (15, 2, 'ready', 'team', ['family', 'pharmacy', 'lab']),
 (16, 4, 'help', 'mouth', ['nose', 'stomach', 'lungs']),
 # B33: 검토의 sedation은 18.0/18.4 '마취 더'와 같은 이유로 쓰지 않는다
 (18, 1, 'fluids', 'fluids', ['antibiotics', 'insulin', 'vitamins']),
 (18, 5, 'coming', 'into', ['out of', 'past', 'around']),
]
for a, b, old, ans, others in BL:
    s = S[a]['sentences'][b]
    bl = s['blank']
    assert bl['answer'] == old, (a, b, bl['answer'])
    k = [o['en'] for o in bl['options']].index(old)
    opts = list(others); opts.insert(k, ans)
    bl['answer'] = ans
    bl['options'] = [{'en': x} for x in opts]
    assert len(re.findall(r'(?<![A-Za-z0-9])' + re.escape(ans) + r'(?![A-Za-z0-9])', s['en'])) == 1, (a, b, ans)
    assert ans.lower() not in [x.lower() for x in others] and len(set(opts)) == 4

# ---- decoy (D1-D2)
for a, b, st, old, new in [(3, 0, 'How many days', 'in a row', 'this week'),
                           (4, 5, "I'll stay", 'for you', 'for a minute')]:
    s = sent(a, b, st); assert s['decoy'] == old, s['decoy']; s['decoy'] = new
    assert new not in s['en'] and new not in s['chunks']

# ---- distractorsKo (K1-K8)
def dko(a, b, st, old, new):
    s = sent(a, b, st); assert old in s['distractorsKo'], (a, b, s['distractorsKo'])
    s['distractorsKo'][s['distractorsKo'].index(old)] = new
    assert len(set(s['distractorsKo'])) == 2 and s['ko'] not in s['distractorsKo']
dko(11, 2, "We're keeping", '침대 알람을 꺼 둘게요', '미끄럼 방지 양말을 신겨 드릴게요')
dko(18, 0, 'Your vitals', '활력징후를 보면서 마취를 조금 더 할게요', '산소를 조금 올려 드릴게요')
dko(18, 4, "We're stopping", '마취를 더 하려고 잠깐 기다려 주세요', '시술이 거의 다 끝났어요')
dko(2, 5, 'We may need', '이 약들을 두 배로 드셔야 해요', '드시는 약 목록을 보여 주시겠어요?')
dko(3, 5, "We'll check", '엑스레이로 빈혈을 확인할게요', '변 검사로 피가 섞였는지 볼게요')
dko(12, 4, 'We will do', '혈액 제품 없이 가능한 치료를 의사 선생님과 정할게요', '받으실 수 있는 혈액 성분이 있는지 하나씩 여쭤볼게요')
dko(12, 4, 'We will do', '혈액 제품 대신 어떤 약이 있는지 설명할게요', '원하시면 병원 연락 위원회 분께 연락드릴게요')
dko(17, 1, "We're ordering", '혈소판과 혈장 둘 다 검사실에 확인할게요', '피가 나는 곳을 계속 눌러 드릴게요')
dko(8, 2, "We'll give medicine", '수액부터 놓을게요', 'INR 결과가 나오면 다시 말씀드릴게요')

# ---- icon (I1)
s = sent(19, 1, "They'll block"); assert s['icon'] == 'scalpel'; s['icon'] = 'gear'
s = sent(12, 1, 'There are other'); assert s['icon'] == 'bandage'; s['icon'] = 'bulb'

# ---- order (O1-O12)
def L(en, icon, ko, note):
    assert len(en.split()) <= 15, en
    return {'en': en, 'icon': icon, 'ko': ko, 'note': note}
def order(i, lines, why, first=None):
    o = S[i]['order']
    for k, ln in lines.items():
        o['lines'][k - 1] = ln
    o['why'] = why
    assert len(o['lines']) == 4 and len({l['en'] for l in o['lines']}) == 4

order(0, {3: L('Now that same color question for your stools: black and tarry, or bright red?', 'magnify', '이제 변에도 같은 색 질문이에요, 검고 끈적했나요, 선홍색이었나요?', '변')},
 "토혈부터 묻고, 그 양과 색을 이어 묻고, 같은 색 질문을 변에도 하고, 모은 답으로 위·아래를 가립니다. 'that'·'that same color question'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
order(3, {3: L("Along with how you've been feeling, have you had belly pain?", 'stetho', '지금까지 느끼신 것과 함께 배가 아팠던 적이 있나요?', '동반')},
 "며칠째인지 먼저 묻고, 그 기간 동안의 증상을 묻고, 그 증상과 함께 온 것으로 배 통증을 묻고, 그 답을 근거로 검사를 알립니다. 'Over that time'·'Along with how you've been feeling'·'Based on all that'이 앞 줄을 가리켜 순서가 하나예요.")
order(5, {4: L("Both of those help stop the bleeding, and we'll watch you closely.", 'monitor', '그 둘 다 출혈을 멈추는 데 도움이 되고, 자세히 지켜볼게요', '관찰')},
 S[5]['order']['why'])
order(7, {3: L("Based on your answers, we'll check your blood count and watch your vital signs.", 'monitor', '답을 바탕으로 혈액 수치를 확인하고 활력징후를 지켜볼게요', '감시'),
          4: L("Once that care has you stable, a colonoscopy can find the source.", 'lab', '그 관리로 안정되면 대장내시경으로 원인을 찾을 수 있어요', '검사')},
 "횟수와 양을 묻고, 그 피의 모양을 묻고, 답을 근거로 혈액 수치와 활력징후 감시를 알린 뒤, 안정되면 대장내시경으로 원인을 찾는다고 알려요. 'that blood'·'Based on your answers'·'that care'가 앞 줄을 가리켜 순서가 하나예요.")
order(8, {2: L('What was the result of that check?', 'lab', '그 검사 결과는 어땠나요?', '결과'),
          3: L("Since you're bleeding with that INR, we'll give vitamin K to reverse the warfarin.", 'pill', 'INR이 그 정도인데 출혈이 있으니 와파린을 되돌리려고 비타민K를 드릴게요', '치료')},
 "마지막 INR을 묻고, 그 검사 결과를 묻고, 그 INR과 출혈을 근거로 역전 치료를 알린 뒤, 효과 확인을 알려요. 'that check'·'that INR'·'that worked'가 앞 줄을 가리켜 순서가 하나예요.")
order(10, {1: L('Have you been drinking alcohol recently?', 'me', '최근에 술을 드셨나요?', '음주'),
           2: L('Whether or not you drank, how many times did you vomit?', 'faceWorried', '술을 드셨든 아니든 몇 번 구토하셨나요?', '횟수'),
           3: L('Was there any blood the first few of those times?', 'cross', '그 중 처음 몇 번에 피가 있었나요?', '초기'),
           4: L('Does that mean the blood came only after all that vomiting?', 'calendar', '그럼 피는 그 모든 구토 뒤에만 나왔다는 뜻인가요?', '선후')},
 "음주를 먼저 묻고, 술을 드셨든 아니든 구토 횟수를 묻고, 처음 몇 번에 피가 있었는지 묻고, 피가 구토를 다 한 뒤에만 나왔는지 확인해요. 'Whether or not you drank'·'those times'·'that'이 앞 줄을 가리켜 순서가 하나예요.")
order(11, {1: L('Because you fainted, you may feel dizzy when you sit up.', 'me', '기절하셨으니 일어나 앉을 때 어지러울 수 있어요', '증상'),
           3: L('With the bed low, please call us before getting up, even if you feel fine.', 'bell', '침대를 낮춰 뒀어도 일어나기 전에 저희를 불러 주세요, 괜찮아도요', '부탁')},
 "실신했으니 일어날 때 어지러울 수 있다고 알리고, 그 때문에 하는 조치를 알리고, 부탁을 전한 뒤, 그 부름에 답하겠다고 약속해요. 'That's why'·'With the bed low'·'that call'이 앞 줄을 가리켜 순서가 하나예요.")
order(12, {2: L('Can you tell me more about the beliefs behind that decision?', 'speech', '그 결정 뒤에 있는 신념에 대해 더 말씀해 주시겠어요?', '문진'),
           4: L("We'll document that promise clearly so the whole team keeps it.", 'board', '그 약속을 명확히 기록해서 팀 전체가 지키게 할게요', '기록')},
 "존중부터 말하고, 그 결정 뒤의 신념을 묻고, 그 바람에 맞는 치료를 약속한 뒤, 그 약속을 기록으로 팀에 전해요. 'that decision'·'those wishes'·'that promise'가 앞 줄을 가리켜 순서가 하나예요.")
order(13, {3: L('After whatever was found, has bleeding like this come back?', 'calendar', '무엇이 발견됐든 그 뒤로 이런 출혈이 다시 있었나요?', '재발')},
 "이전 내시경 이야기를 열고, 그때의 발견을 묻고, 그 소견 뒤 같은 출혈이 반복됐는지 묻고, 이 이력의 쓰임으로 닫아요. 'at that time'·'whatever was found'·'This history'가 앞 줄을 가리켜 순서가 하나예요.")
order(14, {3: L('Either way, stopping them too soon could increase your clot risk.', 'shield', '어느 쪽이든 그 약들을 너무 일찍 끊으면 응고 위험이 늘 수 있어요', '위험')},
 "복용약을 묻고, 그 약을 먹게 된 시술을 묻고, 시술 여부와 관계없이 약을 일찍 끊을 때의 위험을 알리고, 그래서 두 의사가 함께 정한다고 닫아요. 'them'·'Either way'·'That's why'가 앞 줄을 가리켜 순서가 하나예요.")
order(16, {3: L('With suction ready, we may need a special tube to control the bleeding.', 'bell', '흡인 준비가 되면 출혈을 조절할 특수한 관이 필요할 수도 있어요', '예고')},
 "자세로 기도를 지키고, 흡인 준비를 알리고, 흡인 준비가 된 상태에서 관이 필요할 수 있다고 예고하고, 그 관이 하는 일을 설명해요. 'it'·'With suction ready'·'That tube'가 앞 줄을 가리켜 순서가 하나예요.")
order(18, {3: L('That help is a rapid response team, coming in right now.', 'siren', '그 도움은 지금 들어오고 있는 신속 대응팀이에요', '도움'),
           4: L('Keep your eyes on me while that team works, and tell me how you feel.', 'handshake2', '그 팀이 일하는 동안 저를 보시고 느낌을 말씀해 주세요', '곁에')},
 "상태를 알리고 시술을 멈춘다고 말한 뒤, 되돌리려는 조치를 알리고, 오는 도움이 어떤 팀인지 알리고, 그 팀이 일하는 동안 곁에 있겠다고 닫아요. 'that'·'That help'·'that team'이 앞 줄을 가리켜 순서가 하나예요.")

# ---- context (C1-C4)
def ctx(i, word):
    c = [n for n in S[i]['nuance'] if n['kind'] == 'context' and n['word'] == word]
    assert len(c) == 1; return c[0]
c = ctx(14, 'stent')
assert c['scenes'][2]['en'] == "You're on DAPT for your DES stent, right?"
c['scenes'][2]['en'] = "You're on DAPT for the stent, right?"
c = ctx(13, 'endoscopy')
assert c['scenes'][1]['en'] == 'Hx PUD with bleed s/p endoscopic clipping (2019).'
c['scenes'][1]['en'] = 'Hx PUD with bleed, clipped on endoscopy (2019).'
assert c['scenes'][2]['en'] == "So you're s/p endoscopic clipping in 2019?"
c['scenes'][2]['en'] = "So you're s/p endoscopy with clipping in 2019?"
c = ctx(4, 'fluid')
c['why'] = "hanging(수액을 걸다)·bolus는 의료진끼리의 말이에요. 환자에게는 수액을 넣는다는 것과 그 이유를 쉬운 말로 알려요."
c = ctx(7, 'episodes')
assert c['ko'] == '차례'
c['ko'] = '(증상이 나타난) 번'

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
