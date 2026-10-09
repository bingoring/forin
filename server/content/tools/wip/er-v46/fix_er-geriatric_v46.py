import yaml, re
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
d = yaml.safe_load(open(D + 'er-geriatric.yaml'))
S = d['situations']

def sent(si, j): return S[si]['sentences'][j]

def set_wrong(si, j, wrongs, answer=None):
    """blank 오답 교체. answer를 주면 빈칸을 옮김(정답 위치는 그대로 두고 나머지 칸을 차례로 채움)."""
    b = sent(si, j)['blank']
    opts = [o['en'] for o in b['options']]
    old = b['answer']
    pos = opts.index(old)
    new_ans = answer or old
    w = list(wrongs)
    assert len(w) == 3
    res = []
    for k in range(4):
        res.append(new_ans if k == pos else w.pop(0))
    b['answer'] = new_ans
    b['options'] = [{'en': e} for e in res]

# ---------- A. 위험한 그림 ----------
set_wrong(0, 4, ['refill', 'pick up', 'order'])
set_wrong(16, 2, ['lights', 'bed', 'temperature'], answer='noise')
sent(14, 4)['decoy'] = 'in the hallway'
sent(19, 3)['decoy'] = 'by the window'
sent(10, 3)['decoy'] = 'on your leg'
sent(18, 4)['decoy'] = 'in the hallway'
sent(2, 3)['decoy'] = 'by the door'
sent(1, 2)['decoy'] = 'by the label'
sent(11, 2)['decoy'] = 'for the doctor'
set_wrong(10, 1, ['ready', 'early', 'late'])

# ---------- B. 빈칸 오답 ----------
B = {
 (0,1): (['numb','sleepy','thirsty'],None),
 (0,3): (['go numb','cramp up','swell up'],'give out'),
 (0,5): (['fainted','been hospitalized','been dizzy'],None),
 (1,0): (['insurance cards','pharmacy receipts','discharge papers'],None),
 (1,2): (['all at once','from memory','in a hurry'],None),
 (1,4): (['blood sugar','cholesterol','thyroid'],None),
 (1,5): (['lab','blood bank','radiology desk'],None),
 (2,1): (['hurt','matter','bother you'],None),
 (2,2): (['hear','want','know'],'miss'),
 (2,3): (['watch','badge','chart'],None),
 (3,0): (['bad','busy','slow'],'good'),
 (3,1): (['mention','report','treat'],'notice'),
 (3,2): (['questions','records','photos'],None),
 (3,3): (['currently','still','no longer'],None),
 (3,4): (['news','season','plan'],None),
 (4,1): (['see','hear','eat'],'do'),
 (4,2): (['rest','time','space'],'help'),
 (4,4): (['bed','bathtub','car'],None),
 (6,2): (['minor','contagious','skin'],'hidden'),
 (6,5): (['heart','belly','neck'],None),
 (7,0): (['dull','burning','crushing'],None),
 (7,1): (['dizzy','nauseous','thirsty'],None),
 (7,3): (['numbness','itching','chills'],None),
 (7,4): (['coughing','fever','swelling'],None),
 (7,5): (['younger','pregnant','athletic'],None),
 (8,1): (['expire','wear off','run out'],None),
 (8,2): (['refill','reorder','relabel'],None),
 (8,4): (['steady','quick','light'],None),
 (9,1): (['belongings','insurance','visitors'],None),
 (9,2): (['insurance','diet','code status'],None),
 (9,3): (['functional','nutritional','fluid'],None),
 (9,4): (['pharmacist','administrator','social worker'],None),
 (9,5): (['print','fax','update'],None),
 (10,0): (['heard','read','wrote'],None),
 (10,2): (['rule','request','fear'],None),
 (11,0): (['liver','heart','stomach'],None),
 (11,1): (['itchy','nauseous','constipated'],None),
 (11,2): (['nauseous','sleepy','warm'],None),
 (11,3): (['lungs','muscles','bones'],None),
 (11,4): (['infections','falls','bleeding'],None),
 (12,1): (['quickly','quietly','loudly'],'clearly'),
 (12,2): (['hearing aids','dentures','cane'],None),
 (12,3): (['dentures','hearing aids','a brace'],None),
 (13,0): (['will','DNR','power of attorney'],None),
 (13,2): (['record','explain','share'],'honor'),
 (13,3): (['worried','complained','joked'],'talked'),
 (13,4): (['will','insurance card','medication list'],None),
 (13,5): (['decision','request','plan'],None),
 (14,0): (['sugar','oxygen','sodium'],None),
 (14,2): (['tests','monitoring','X-rays'],None),
 (14,4): (['oxygen','Tylenol','blood'],None),
 (15,0): (['nosebleeds','bruises','skin tears'],None),
 (15,1): (['a fracture','a stroke','swelling'],None),
 (15,2): (['vomiting','weakness','dizziness'],None),
 (15,5): (['sleepy','restless','pale'],None),
 (16,0): (['welcome','early','late'],None),
 (17,0): (['time','strength','independence'],None),
 (17,1): (['quick','final','easy'],None),
 (18,1): (['pain','sleep','swelling'],None),
 (18,2): (['medicine','test','leg'],None),
 (18,5): (['later','quickly','today'],'together'),
 (19,1): (['warm','awake','upright'],None),
}
assert len(B) == 62, len(B)
for (si, j), (w, a) in B.items():
    set_wrong(si, j, w, a)

# ---------- C. decoy가 ko에 맞는 문장 ----------
for (si, j), v in {(1,1):'online',(17,1):'on the form',(6,5):'in the hallway',(4,2):'with the bills',(13,1):'at the desk',(20,2):'for the paperwork'}.items():
    sent(si, j)['decoy'] = v

# ---------- C2. 부사구 틀 decoy → 같은 분야의 다른 조각 (청크 변형) ----------
EXTRA = {
 (0,0):'right after', (0,2):'your balance',
 (1,0):'or the insurance cards', (1,3):'How often',
 (2,0):'and speak loudly', (2,4):'say it louder',
 (3,1):'this rash', (3,4):'her daughter',
 (4,0):'to cook', (4,4):'or the bed',
 (5,3):'what day it is', (5,4):'this feels lonely',
 (6,0):'as a rash', (6,3):'a cough',
 (7,2):'your lungs', (7,6):'an X-ray',
 (8,0):'the nausea start', (8,3):'or stopped',
 (9,0):'her allergies', (9,4):'a fax number',
 (10,4):'enough sleep', (10,5):'— do you feel lonely',
 (11,0):'for your liver', (11,4):'for any allergies',
 (12,3):'or a hearing aid',
 (13,4):'of his medications',
 (14,2):'tests', (14,5):'each result',
 (15,1):'a blood test', (15,3):'on aspirin',
 (16,0):"to rush you", (16,5):'the TV',
 (17,3):'of his treatment',
 (18,0):'Your heart and lungs', (18,2):'which medicine',
 (19,0):'your nausea', (19,1):'and rested',
 (20,0):'comfortable and clean', (20,3):'the room warm',
}
EXTRA_KEYS = set(EXTRA)
for (si, j), v in EXTRA.items():
    sent(si, j)['decoy'] = v

# ---------- D. distractorsKo ----------
def dko(si, j, old, new):
    L = sent(si, j)['distractorsKo']; i = L.index(old); L[i] = new
dko(5,1,'이 혼란이 약 때문일 수도 있어요','불을 조금 낮춰 드릴까요?')
dko(5,3,'여기가 어디인지 제가 알려 드릴까요?','제가 누구인지 아시겠어요?')
dko(12,3,'지금 안경을 가지고 계신가요?','글씨가 잘 보이세요?')
dko(13,2,'그분 뜻을 다시 확인할게요','서류 사본을 차트에 넣어 둘게요')
dko(15,1,'영상 검사실로 이동할게요','혈액 검사도 같이 할게요')
dko(17,2,'완화 돌봄은 통증 관리도 포함해요','가족 회의 시간을 잡아 드릴게요')
dko(18,5,'결정은 의사와 함께 내릴 거예요','다리 부기를 먼저 볼게요')
dko(20,4,'그분께 하고 싶은 말씀을 편하게 하세요','의자를 더 가져다 드릴게요')
dko(3,6,'기다려 주셔서 감사해요','어머니 약 목록을 받아 볼게요')

# ---------- E. why ----------
sent(10,1)['why'] = ("You're safe to talk with me로 말해도 안전하다는 느낌을 먼저 줘요. without your say는 환자의 뜻을 존중한다는 말투일 뿐이에요. "
    "미국에서는 노인 학대가 의심되면 병원 지침과 주법에 따라 보고해야 할 수 있어서, 실제로는 비밀 보장을 약속하지 않고 누가 더 알아야 하는지를 정직하게 설명해요.")
sent(19,4)['why'] = ("to help stay hydrated로 물을 마시는 목적을 먼저 밝혀 지시가 아니라 제안으로 들려요. "
    "다만 수술을 기다리는 환자의 금식 여부는 마취팀 지시가 정하므로, 간호사는 지시를 확인하기 전에는 물을 권하지 않아요. 이 문장은 마셔도 된다고 확인된 뒤에 쓰는 말이에요.")
sent(19,5)['why'] = ("oriented는 날짜와 있는 곳을 아는 상태를 가리켜요. moving은 계속 움직인다는 뜻이지만 수술 전 고관절 골절 환자는 골절 부위를 고정하고 움직임을 제한하므로, "
    "움직임은 정형외과·마취팀 지시를 따라요. 이 문장에서 간호사가 실제로 하는 일은 말을 걸어 지남력을 유지하는 쪽이에요.")
sent(5,0)['why'] = sent(5,0)['why'].replace('짧은 두 문장으로', '짧은 두 마디로')
assert '두 마디로' in sent(5,0)['why']

# ---------- F. order ----------
def L(en, icon, ko, note): return {'en': en, 'icon': icon, 'ko': ko, 'note': note}
def order(si, idx_lines, why=None):
    o = S[si]['order']
    for i, l in idx_lines.items(): o['lines'][i] = l
    if why: o['why'] = why

order(0, {3: L("Let's go over your medications, in case one is behind these falls.", 'pill', '혹시 약 때문일 수 있으니 복용하시는 약들을 함께 살펴볼게요', '약')})
order(1, {3: L("After that one, let's do the same for vitamins and anything over the counter.", 'bell', '그 약 다음으로 비타민과 처방전 없이 사는 약도 같은 식으로 살펴볼게요', '비처방')},
 "목록·약병이 있는지 묻고, 가진 것 중 하나를 골라 시작하고, 그 약의 용도와 기간을 묻고, 그 약 다음으로 비처방약까지 살핍니다. 'Whatever you have'·'that one'·'After that one'이 앞 줄을 가리켜 순서가 하나예요.")
order(2, {2: L("Whatever your answer, raise your hand any time something isn't clear — I'll repeat it.", 'me', '답이 어떻든 분명하지 않을 때마다 손을 들어 주세요, 다시 말씀드릴게요', '신호')},
 "보청기부터 점검하고, 마주 보고 천천히 말하며 더 잘 들리는지 묻고, 그 답이 어떻든 놓치면 손을 들게 하고, 그래도 안 되면 적어 줍니다. 'them'·'Whatever your answer'·'it again'이 앞 줄을 가리켜 순서가 하나예요.")
order(3, {2: L("Before that, did she usually know the date and where she was?", 'compass', '그 전에는 날짜와 계셨던 곳을 평소 아셨나요?', '지남력')})
order(4, {2: L("Over that same stretch, has cooking or getting up from a chair changed?", 'coffee', '같은 기간에 요리나 의자에서 일어나기에도 변화가 있었나요?', '확대')},
 "씻기·옷 입기를 먼저 묻고, 그중 어려워진 것을 묻고, 같은 기간 다른 활동에도 변화가 있었는지 넓히고, 도움을 청해도 된다고 마무리합니다. 'those'·'that same stretch'·'any of that'이 앞 줄을 가리켜 순서가 하나예요.")
order(5, {1: L("I know that feels frightening right now, but you're not alone.", 'faceWorried', '지금 그게 무섭게 느껴지시는 거 알아요, 하지만 혼자가 아니세요', '공감')},
 "병원이고 안전하다는 재지남이 먼저, 그 상황이 무섭게 느껴질 수 있음을 인정하고, 방을 조용히 하고, 곁에 머뭅니다. 'that'·'To help with that'·'this quiet room'이 앞 줄을 가리켜 순서가 하나예요.")
order(6, {3: L("It can stay hidden because older patients don't always get a fever.", 'bulb', '노인 환자는 열이 늘 나지는 않아서 감염이 숨어 있을 수 있어요', '이유')},
 "소변·호흡 변화를 묻고, 답과 상관없이 소변과 폐를 살피고, 둘에 검사를 돌리고, 감염이 숨어 있을 수 있는 이유를 설명합니다. 'Whatever the answer'·'both'·'It'이 앞 줄을 가리켜 순서가 하나예요.")
order(7, {2: L("Those three can be heart signs, so we take this seriously, even without sharp pain.", 'shield', '그 세 가지가 심장 신호일 수 있어서, 날카로운 통증이 없어도 저희는 진지하게 받아들여요', '이유'),
          3: L("That's also why we'll do an EKG and some blood tests on your heart.", 'monitor', '그 이유로 심전도와 혈액 검사로 심장도 확인할게요', '검사')},
 "증상을 묻고, 동반 증상 셋을 묻고, 그 셋이 심장 신호일 수 있어 통증이 약해도 심각하게 본다고 알리고, 같은 이유로 심전도와 혈액 검사를 한다고 설명합니다. 'any of that'·'Those three'·'That's also why'가 앞 줄을 가리켜 순서가 하나예요.")
order(8, {1: L("That timing matters — some medicines can interact and cause this.", 'pill', '그 시점이 중요해요 — 일부 약은 서로 영향을 주어 이런 증상을 일으킬 수 있어요', '설명'),
          2: L("To find which ones, we'll review everything you take.", 'magnify', '어떤 약인지 찾으려고 복용하시는 모든 약을 검토할게요', '검토'),
          3: L("Once the review is done, we may lower or stop one of them.", 'redo', '검토가 끝나면 그중 하나를 줄이거나 중단할 수도 있어요', '조정')},
 "새 약 뒤 어지럼의 시작 시점을 묻고, 그 시점이 중요한 이유로 약끼리 영향을 줄 수 있다고 설명하고, 어떤 약인지 찾으려 전부 검토하고, 검토가 끝나면 일부를 줄이거나 중단할 수 있다고 알립니다. 'That timing'·'which ones'·'the review'가 앞 줄을 가리켜 순서가 하나예요.")
order(9, {1: L("Thanks — the paperwork is thin, so can you help me reach the facility?", 'speaker', '고맙습니다 — 서류가 부실하니 시설에 연락하는 걸 도와주실 수 있나요?', '부탁')},
 "이송 직원에게 평소 상태를 묻고, 답에 감사하며 서류가 부족하니 시설 연락을 부탁하고, 그곳 간호사의 연락처를 묻고, 그 간호사와 약 목록을 확인합니다. 'Thanks'·'there'·'that nurse'가 앞 줄을 가리켜 순서가 하나예요.")
order(10, {2: L("With that goal, I want to ask about some bruises I noticed on your arm.", 'bandage', '그 목표를 위해 팔에서 본 멍에 대해 여쭤보고 싶어요', '멍'),
           3: L("Whatever they turn out to be, I ask everyone: do you feel safe at home?", 'shield', '그게 무엇이든 모든 분께 여쭤봐요 — 집에서 안전하다고 느끼세요?', '안전')},
 "관찰한 것을 이해하고 싶다고 열고, 돌봄이 목적임을 밝히고, 그 목표를 위해 멍을 묻고, 마지막으로 안전을 묻습니다. 'in asking'·'With that goal'·'they'가 앞 줄을 가리켜 순서가 하나예요.")
order(11, {2: L("Even with that small dose, tell me if you feel dizzy or groggy.", 'shield', '그 적은 용량으로도 어지럽거나 몽롱하시면 말씀해 주세요', '보고'),
           3: L("Either way, please don't try to get up alone until we check on you.", 'bell', '어느 쪽이든 저희가 확인할 때까지 혼자 일어나려 하지 마세요', '낙상')},
 "신장이 약을 천천히 처리한다고 설명하고, 그래서 적게 시작한다고 말하고, 그 적은 용량으로도 어지러우면 알려 달라 하고, 어느 쪽이든 혼자 일어나지 말라고 합니다. 'your kidneys'·'that small dose'·'Either way'가 앞 줄을 가리켜 순서가 하나예요. 적게 시작하되 통증을 참게 두지 않아요 — 조절되지 않는 통증도 섬망을 부릅니다.")
order(12, {2: L("If you use either, having them here will help you feel less confused.", 'bulb', '둘 중 쓰시는 게 있다면 여기서 착용하시면 덜 혼란스러우실 거예요', '이유'),
           3: L("Since they help that much, let's ask your family to bring yours from home.", 'gear', '그만큼 도움이 되니 집에 있는 것을 가족분께 가져와 달라고 부탁해 볼게요', '가져오기')},
 "듣고 보는 데 도움을 찾자고 열고, 평소 쓰는 것을 묻고, 쓰는 게 있다면 혼란이 줄어든다고 설명하고, 그만큼 도움이 되니 집에 있는 것을 가족에게 가져와 달라고 부탁합니다. 'for that'·'either'·'Since they help that much'가 앞 줄을 가리켜 순서가 하나예요.")
order(13, {1: L("Whether or not there's a paper, has he ever talked about the care he'd want?", 'speech', '서류가 있든 없든 그분이 원하시는 치료에 대해 말씀하신 적이 있나요?', '평소'),
           2: L("From what he said, what matters most to him now?", 'star', '그분이 하신 말씀으로 보면 지금 그분께 가장 중요한 게 뭘까요?', '가치'),
           3: L("Whatever matters most, we'll honor it as best we can.", 'handshake2', '무엇이 가장 중요하든 할 수 있는 한 지켜 드릴게요', '약속')},
 "서류가 있는지 묻고, 서류 여부와 상관없이 원하는 돌봄을 말한 적이 있는지 묻고, 그 말을 바탕으로 지금 가장 중요한 것을 묻고, 무엇이든 할 수 있는 한 지키겠다고 약속합니다. 'Whether or not'·'From what he said'·'Whatever matters most'가 앞 줄을 가리켜 순서가 하나예요.")
order(15, {}, None)
order(16, {1: L("What I'm going to do is find what's causing this confusion.", 'bulb', '제가 할 일은 이 혼란을 일으키는 원인을 찾는 거예요', '원인')},
 "안전하다고 먼저 알리고, 해치려는 게 아니라 원인을 찾는 게 제 일이라고 설명하고, 결과가 어떻든 조명과 소음을 줄이고, 그것이 우선이며 붙잡는 건 안전이 걸릴 때뿐이라고 말합니다. 'What I'm going to do'(1번 줄 'I'm not going to hurt you'와 대비)·'Whatever we find'·'Those steps'가 앞 줄을 가리켜 순서가 하나예요.")
order(17, {2: L("With that option in mind, what matters most to him at this stage?", 'star', '그 선택지를 생각하면 이 단계에서 그분께 가장 중요한 게 뭘까요?', '가치')},
 "편안함 이야기를 열고, 그런 돌봄이 적극적인 선택이라고 설명하고, 그 선택지를 놓고 그분께 중요한 것을 묻고, 어떤 결정이든 지지한다고 마무리합니다. 'That kind'·'With that option in mind'·'after that'이 앞 줄을 가리켜 순서가 하나예요.")
order(18, {3: L("Even while we do that, tell me which symptom bothers you most.", 'speech', '그렇게 하는 동안에도 어떤 증상이 가장 힘드신지 알려 주세요', '요청')},
 "장기가 힘든 상태를 알리고, 다리가 붓는 이유를 잇고, 호흡과 심장을 함께 치료한다고 알리고, 그러는 동안에도 가장 힘든 증상을 알려 달라고 합니다. \"That's why\"·'To fix that'·'Even while we do that'이 앞 줄을 가리켜 순서가 하나예요.")
order(19, {3: L("For that clear head, I'll keep checking on you so you're not alone.", 'handshake2', '맑은 정신을 위해 혼자 계시지 않도록 계속 살펴보러 올게요', '곁에')},
 "수술이 필요하지만 편안하게 지내게 하겠다고 말하고, 그 편안함의 한 부분으로 통증 관리를, 다른 부분으로 맑은 정신을, 마지막으로 곁에 있겠다고 합니다. 'that comfort'·'Another part'·'that clear head'가 앞 줄을 가리켜 순서가 하나예요.")
order(20, {2: L("Beyond that, you can hold her hand and talk to her; she may still hear.", 'handshake2', '그 밖에 손을 잡고 말을 건네셔도 돼요, 아직 들리실 수 있어요', '곁에'),
           3: L("Whatever you say, there's no wrong way to say goodbye.", 'star', '무슨 말씀을 하시든 작별하는 데 틀린 방법은 없어요', '작별')},
 "편안함이 목표라고 알리고, 그 일환으로 통증이 없게 하겠다고 말하고, 가족이 곁에서 할 수 있는 일을 알리고, 작별 방식에 정답이 없다고 말합니다. 'that'·'Beyond that'·'Whatever you say'가 앞 줄을 가리켜 순서가 하나예요.")

# ---------- G. context ----------
def ctx(si): return [n for n in S[si]['nuance'] if n['kind'] == 'context'][0]
def setctx(si, word, ko, scenes_en, why=None):
    n = ctx(si); n['word'] = word; n['ko'] = ko
    for k, v in scenes_en.items(): n['scenes'][k]['en'] = v
    if why: n['why'] = why
setctx(5, 'acute', '급성의', {0: "She's had an acute change — confused since this morning.",
        1: 'Acute change in mental status, onset this AM; reoriented.', 2: 'You have acute delirium.'})
setctx(8, 'polypharmacy', '다약제 복용', {0: 'Dizziness likely adverse drug reaction; polypharmacy — med review requested.',
        1: "With her polypharmacy, I'm worried two meds are interacting — can you review her list?",
        2: "You're having an adverse drug interaction from polypharmacy."})
setctx(11, 'renal', '신장의', {0: "Start low, go slow — she's 88 with poor renal function.",
        1: 'Hydromorphone 0.2 mg IV given; reduced dose d/t age and renal function.',
        2: 'Reduced dose due to your renal function — standard geriatric dosing.'},
       "renal·geriatric dosing은 의료진끼리의 말이에요. 환자에게는 kidneys처럼 쉬운 말로, 적은 양으로 시작해 조절한다고 풀어 말해요.")
setctx(14, 'hypotensive', '저혈압인', {0: "Temp 35.6, BP 84 over 50 — she's hypotensive; let's start the sepsis bundle.",
        1: 'Hypothermic, hypotensive; 30 mL/kg crystalloid bolus initiated.',
        2: "She's hypothermic and hypotensive; we're initiating the sepsis bundle."})
setctx(15, 'stat', '즉시', {1: 'Stat head CT ordered to r/o ICH; pt on apixaban.'})
setctx(20, 'mottling', '피부 얼룩(반점)', {1: 'Pt actively dying; mottling noted; comfort measures only per POLST.'})

yaml.safe_dump(d, open(D + 'er-geriatric.yaml', 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
