import yaml, re
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
P = D + 'er-peds.yaml'
d = yaml.safe_load(open(P))
S = d['situations']


def sent(si, j):
    return S[si]['sentences'][j]


def set_blank(si, j, ans, distractors):
    b = sent(si, j)['blank']
    idx = [o['en'] for o in b['options']].index(b['answer'])
    opts = list(distractors)
    assert len(opts) == 3 and ans not in opts
    opts.insert(idx, ans)
    b['answer'] = ans
    b['options'] = [{'en': e} for e in opts]
    assert len(re.findall(r'(?<![\w\'])' + re.escape(ans) + r'(?![\w\'])', sent(si, j)['en'])) == 1, (si, j, ans)


def set_decoy(si, j, v):
    sent(si, j)['decoy'] = v


def set_dko(si, j, a, b):
    sent(si, j)['distractorsKo'] = [a, b]


def set_why(si, j, v):
    sent(si, j)['why'] = v


def set_line(si, k, en, icon, ko, note):
    S[si]['order']['lines'][k] = {'en': en, 'icon': icon, 'ko': ko, 'note': note}


# ---------------- A. 위험한 그림·정답이 둘인 빈칸 ----------------
set_blank(20, 4, 'harder', ['easier', 'better', 'calmer'])
set_blank(14, 3, 'swelling', ['shaking', 'healing', 'clearing'])
set_blank(20, 2, 'watching', ['weighing', 'teaching', 'moving'])
set_blank(19, 3, 'fluids', ['vitamins', 'antibiotics', 'blood'])
set_blank(7, 1, 'sips', ['jugs', 'bags', 'bowls'])  # 목록의 gulps는 sips와 거의 같은 뜻이라 jugs로
set_blank(17, 5, 'hold', ['move', 'visit', 'see'])
set_blank(10, 0, 'understand', ['prove', 'decide', 'guess'])

# ---------------- B. 동떨어진 빈칸 오답 ----------------
set_blank(2, 2, 'missing', ['early', 'extra', 'recent'])
# 목록은 cured/discharged/immune이나 '다 나았다·면역'은 오답으로도 잘못된 안심이라 피함
set_blank(5, 0, 'stable', ['awake', 'sleepy', 'upset'])
set_blank(6, 0, 'hard', ['easily', 'calmly', 'gently'])
set_blank(10, 2, 'okay', ['discharged', 'admitted', 'warm'])
set_blank(10, 5, 'safe', ['busy', 'awake', 'entertained'])
set_blank(11, 0, 'calm', ['awake', 'alert', 'busy'])
set_blank(12, 5, 'unsafe', ['bored', 'busy', 'sleepy'])
set_blank(13, 5, 'sick', ['bigger', 'stronger', 'heavier'])
set_blank(15, 5, 'lives', ['time', 'tests', 'beds'])
set_blank(17, 1, 'time', ['help', 'blankets', 'tissues'])
set_blank(17, 4, 'chaplain', ['surgeon', 'pharmacist', 'radiologist'])
set_blank(20, 0, 'treatments', ['tests', 'X-rays', 'fluids'])

# ---------------- C. 문법 ----------------
set_blank(9, 5, 'exactly', ['partly', 'later', 'roughly'])

# ---------------- D. decoy ----------------
DEC = {
    (2, 4): 'her records', (19, 0): 'at the desk', (15, 4): 'in the photo', (14, 0): 'for the doctor',
    (14, 5): 'on the shelf', (19, 5): 'in the lobby',
    # 시간·장소 부사구 틀을 다른 조각으로(안전한 것만)
    (0, 5): 'her pulse', (5, 0): 'for him', (6, 0): 'to the doctor', (11, 1): 'and my hands',
    (12, 4): 'or your friends', (13, 5): 'than adults', (15, 0): 'for her mother', (15, 5): 'for the staff',
    (16, 2): 'to the nurse', (18, 3): 'and I agree', (19, 2): 'for her mom', (20, 0): 'for his cough',
    (20, 5): 'for you', (16, 5): 'and our families', (19, 1): 'for your family', (20, 1): 'for the nurse',
    (4, 1): 'for the doctor', (8, 1): 'for your mom', (11, 2): 'and his friends', (2, 5): 'with her mom',
}
for (si, j), v in DEC.items():
    set_decoy(si, j, v)

# ---------------- E. distractorsKo ----------------
set_dko(20, 2, '아이가 편하게 앉도록 침대를 세울게요', '숨소리도 계속 확인하고 있어요')
set_dko(16, 2, '다른 가족분께 연락해 드릴까요?', '궁금한 건 언제든 물어보세요')
set_dko(14, 1, '아이가 먹은 음식 포장지를 가지고 계세요?', '곧 의사 선생님이 오실 거예요')

# ---------------- F. why ----------------
set_why(10, 5, "My job…is to keep him safe로 지금 하는 일을 아이 보호에 모아요. 수사나 판단은 간호사 몫이 아니지만, "
               "학대가 의심되면 간호사는 법에 따른 의무 신고자예요 — 신고도 아이를 지키는 일의 일부예요.")
set_why(17, 3, "not something you caused로 부모의 죄책감을 덜어요. 다만 원인 불명의 영아 사망은 검시관 조사가 끝나야 "
               "원인이 정해지니, 원인을 단정하는 말은 하지 않고 탓하지 않는 데 집중해요.")
set_why(17, 5, sent(17, 5)['why'] + " 원인 불명의 영아 사망은 검시 사건이라, 튜브·라인은 그대로 두고 직원이 곁에 있는 등 "
                                   "병원 지침 안에서 안게 해요.")
set_why(14, 1, "Stay with me로 당황한 보호자의 주의를 간호사에게 붙잡고, on top of…로 기도를 챙기고 있다고 전해요. "
               "아나필락시스에서 가장 급한 것이 기도라는 점도 함께 알려요.")
set_why(12, 4, "성·약물·술을 돌려 말하지 않고 판단 없는 말투로 물어요. 청소년 진료에서는 이런 위험 요인을 보호자 없이 "
               "본인에게 따로, 하나씩 묻는 것이 표준이에요.")

# ---------------- G. order ----------------
# S0
S[0]['order']['lines'][1]['ko'] = '화씨 101.2도(약 38.4℃)라 열이 있네요. 언제 시작됐나요?'
set_line(0, 3, "Thank you for all that. You're doing the right thing bringing her in.", 'handshake2',
         '말씀 고마워요. 데려오신 게 잘하신 거예요', '안심')
# S2
set_line(2, 3, "I'll note today's visit, and we can schedule those catch-up shots.", 'calendar',
         '오늘 방문을 기록해 두고 그 따라잡기 접종 일정을 잡을게요', '계획')
S[2]['order']['why'] = ("접종 카드를 먼저 요청하고, 'which ones'가 그 기록 속 백신을 가리켜 하나씩 확인하자고 하고, 'some'이 그 백신 중 "
                        "빠진 것을 받아 괜찮다고 안심시키고, 'those catch-up shots'가 3번 줄의 catch up을 받아 일정을 잡아요. "
                        "'which ones'·'some'·'those catch-up shots'가 앞 줄을 가리켜 순서가 하나예요.")
# S4
set_line(4, 1, "Let's pretend he needs a checkup too — you can hold him.", 'play',
         '곰인형도 검진이 필요한 척 해보자 — 네가 안고 있어도 돼', '놀이')
set_line(4, 3, 'You were so brave through all of that — you can pick a sticker, okay?', 'star',
         '정말 용감했어 — 스티커를 골라도 돼, 알겠지?', '보상')
S[4]['order']['why'] = ("곰인형을 먼저 확인하자고 제안하고, 'he'가 그 곰인형을 가리켜 인형 검진 놀이로 이어지고, 'your turn'이 인형 검진이 "
                        "끝난 뒤 아이 차례를 가리키며 살살 하겠다고 약속하고, 'all of that'이 지난 과정을 받아 칭찬과 스티커로 닫아요. "
                        "'he'·'your turn'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
# S5
set_line(5, 3, 'The most important of those: call 911 right away if it lasts over five minutes.', 'siren',
         '그중 가장 중요한 건 5분 넘게 지속되면 바로 911에 전화하는 거예요', '기준')
# S6
set_line(6, 1, "Her chest pulls in a little with every breath — that's how I can tell.", 'stetho',
         '숨 쉴 때마다 가슴이 살짝 들어가요 — 그래서 알 수 있어요', '근거')
set_line(6, 2, "To ease that pulling, we'll clear her nose and give oxygen if she needs it.", 'hospital',
         '그 당김을 덜어 주려고 코를 뚫어주고 필요하면 산소를 줄게요', '처치')
S[6]['order']['why'] = ("숨쉬기 힘들어 보인다고 인정하고, 'that's how I can tell'이 그 판단의 근거로 가슴 모습을 말하고, 'that pulling'이 "
                        "그 가슴 당김을 가리켜 코를 뚫고 필요하면 산소를 준다고 알리고, 'harder breathing'이 앞의 힘든 호흡을 받아 퇴원 전 "
                        "교육으로 이어요. 'that's how I can tell'·'that pulling'·'harder breathing'이 앞 줄을 가리켜 순서가 하나예요.")
# S7
set_line(7, 3, "To tell if the sips work, I'll show you the signs of dehydration to watch.", 'board',
         '효과가 있는지 알 수 있게 살필 탈수 징후를 보여드릴게요', '교육')
# S8
set_line(8, 3, 'You were so brave through all of that — sticker or bandage?', 'star',
         '정말 용감했어 — 스티커 할래, 밴드 할래?', '보상')
# S9
set_line(9, 3, 'Thanks for all that — an X-ray will show exactly where it is.', 'hospital',
         '다 말씀해 주셔서 고마워요 — 엑스레이로 정확히 어디 있는지 보일 거예요', '검사')
S[9]['order']['why'] = S[9]['order']['why'].replace('all of that', 'all that')
# S10
set_line(10, 2, 'Both of those questions are part of our routine exam for every child.', 'board',
         '그 두 질문 모두 모든 아이에게 하는 일상 진찰의 일부예요', '절차')
set_line(10, 3, 'Beyond that routine, my job is keeping him safe, and by law, reporting suspected harm.', 'shield',
         '그 일상 진찰 밖에서 제 역할은 아이를 안전하게 지키는 것, 그리고 법에 따라 학대가 의심되면 신고하는 거예요', '역할')
S[10]['order']['why'] = ("경위를 이해하고 싶다고 부탁하고, 'it'이 그 손상을 가리켜 직전 상황을 묻고, 'Both of those questions'가 앞의 두 "
                         "질문을 가리켜 모든 아이에게 하는 일상 진찰이라고 설명하고, 'that routine'이 그 진찰을 받아 간호사의 역할을 아이 "
                         "보호와 법에 따른 신고로 말해요. 학대가 의심되면 간호사는 법에 따른 의무 신고자예요. 'it'·'Both of those "
                         "questions'·'that routine'이 앞 줄을 가리켜 순서가 하나예요.")
# S11
set_line(11, 3, "With them in place, we'll go at his pace; tell me if anything's too much.", 'check',
         '그게 갖춰지면 아이 속도에 맞출게요. 과하면 알려주세요', '진행')
# S13
set_line(13, 2, "To check it, we'll test her blood for jaundice and infection.", 'lab',
         '확인하려고 혈액 검사로 황달과 감염을 볼게요', '검사')
set_line(13, 3, 'Those tests are quick — newborns need fast care, and you were right to come.', 'handshake2',
         '그 검사는 빨라요 — 신생아는 빠른 대응이 필요하고 데려오신 게 맞아요', '인정')
S[13]['order']['why'] = ("수유와 처진 기간을 묻고, 'Thank you'가 그 대답을 받아 노란빛을 바로 확인하겠다고 하고, 'it'이 그 노란빛을 가리켜 "
                         "황달과 감염을 보는 혈액 검사를 설명하고, 'Those tests'가 그 검사를 가리켜 빠르다고 하며 부모의 판단을 인정해요. "
                         "'Thank you'·'it'·'Those tests'가 앞 줄을 가리켜 순서가 하나예요.")
# S15
set_line(15, 0, 'Her signs worry me — is she harder to wake up than an hour ago?', 'faceWorried',
         '걱정되는 징후라 여쭤볼게요 — 한 시간 전보다 깨우기가 더 힘든가요?', '문진')
set_line(15, 3, 'The team will want to know — when did this change start?', 'calendar',
         '팀이 알고 싶어 할 거예요 — 이 변화가 언제 시작됐나요?', '시점')
S[15]['order']['why'] = ("걱정되는 징후를 말하며 의식 상태를 묻고, 'Thank you'가 그 대답을 받아 피부 소견을 말하고, 'both of those'가 앞의 "
                         "두 소견을 가리켜 팀 호출을 알리고, 'The team'이 방금 부른 팀을 가리켜 변화 시점을 물어요. "
                         "'Thank you'·'both of those'·'The team'이 앞 줄을 가리켜 순서가 하나예요.")
# S16
set_line(16, 3, "While you're here with her, I'll stay beside you and tell you each step.", 'speech',
         '아이 곁에 계시는 동안 제가 곁에서 매 단계를 말씀드릴게요', '약속')
S[16]['order']['why'] = ("팀이 지금 아이에게 매달려 있다고 알리고, 'That's what'이 그 팀이 하는 일을 가리켜 처치를 설명하고, 'you'로 보호자에게 "
                         "곁에 있어도 된다고 하고, 'here with her'가 그 허락을 받아 곁에서 단계마다 설명하겠다고 약속해요. "
                         "'That's what'·'here with her'가 앞 줄을 가리켜 순서가 하나예요.")
# S18
set_line(18, 2, 'That process includes a specialist who will help us figure this out together.', 'me',
         '그 절차에는 함께 파악하는 걸 도와줄 전문가가 포함돼요', '전문가')
set_line(18, 3, 'Whatever the specialist asks, nothing you say changes how much we care about your child.', 'handshake2',
         '전문가가 뭘 묻든, 하신 말씀이 아이를 아끼는 마음을 바꾸진 않아요', '약속')
S[18]['order']['why'] = ("신고 의무를 밝히며 비난이 아니라고 하고, 'this'가 그 상황을 가리켜 속상함을 인정하며 절차를 말하고, 'That process'가 "
                         "앞 줄의 'the process'를 받아 전문가가 함께한다고 말하고, 'the specialist'가 그 전문가를 가리켜 마음이 변치 않는다고 "
                         "닫아요. 'this'·'That process'·'the specialist'가 앞 줄을 가리켜 순서가 하나예요.")
# S20
set_line(20, 2, 'If breathing gets harder even with that support, we\'ll use a breathing machine.', 'hospital',
         '그 보조에도 호흡이 더 힘들어지면 호흡 보조 기계를 쓸게요', '계획')

# ---------------- H. context ----------------


def ctx(si):
    return [n for n in S[si]['nuance'] if n.get('kind') == 'context'][0]


c = ctx(1)
c['word'] = 'mg/kg'
c['ko'] = '체중 1 kg당 mg'
c['scenes'][0]['en'] = 'Wt 18.2 kg; acetaminophen 15 mg/kg = 273 mg PO.'
c['scenes'][1]['en'] = 'Weight is 18.2 kilos, so at 15 mg/kg the dose is 273 milligrams.'
c['scenes'][2]['en'] = 'Dose is 15 mg/kg, so 273 mg PO.'
c = ctx(3)
c['word'] = 'within normal limits'
c['ko'] = '정상 범위 내'
c['scenes'][0]['en'] = 'HR 128, within normal limits for age.'
c['scenes'][2]['en'] = "His HR's 128 — within normal limits for age."
c['why'] = ("HR·within normal limits는 차트와 의료진끼리의 말이에요. 불안한 부모에게는 풀어서 '이 나이에 완전히 정상'이라고 "
            "말해야 안심이 돼요.")
c = ctx(13)
c['word'] = 'bili'
c['ko'] = '빌리루빈(수치)'
c['scenes'][0]['en'] = 'Jaundice to chest; bili sent.'
c['scenes'][2]['en'] = "TSB's been sent to check her bili."

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('fixed')
