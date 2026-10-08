import yaml, re
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
P = D + 'er-sepsis.yaml'
d = yaml.safe_load(open(P))
S = d['situations']


def sent(si, j):
    return S[si]['sentences'][j]


def set_blank(si, j, ans, distractors):
    """정답 자리(선택지 순번)는 그대로 두고 정답과 오답 셋을 바꾼다."""
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


# ---------------- A. 위험한 그림 ----------------
set_blank(3, 3, 'straight', ['slowly', 'partly', 'gently'])
set_blank(6, 1, 'After', ['Before', 'During', 'Besides'])
set_blank(15, 1, 'pressor', ['antibiotic', 'saline', 'blood'])
set_blank(15, 3, 'pressor', ['monitor', 'warmer', 'timer'])
set_blank(15, 5, 'central', ['arterial', 'dialysis', 'IO'])
set_decoy(12, 5, 'at the desk')
set_decoy(3, 3, 'into the bag')
set_decoy(15, 0, 'in the hall')
set_decoy(4, 1, 'at night')
set_dko(15, 0, '중심라인 키트를 가져올게요', '혈액배양은 이미 나갔습니다')
set_dko(19, 1, '모니터 알람 소리를 키울게요', '환자 옷은 나중에 정리해요')

# ---------------- B. 동떨어진 빈칸 오답 ----------------
B = [
    (1, 2, 'belly', ['back', 'throat', 'head']),
    (3, 1, 'pass', ['last', 'stay', 'return']),
    (3, 5, 'safe', ['alone', 'stuck', 'done']),
    (4, 0, 'output', ['culture', 'sample', 'smell']),
    (5, 0, 'lactate', ['stool', 'urine', 'pregnancy']),
    (5, 1, 'lactate', ['sodium', 'potassium', 'calcium']),
    (5, 4, 'stable', ['cured', 'discharged', 'awake']),
    (7, 1, 'confused', ['pale', 'shaky', 'sweaty']),
    (7, 2, 'wound', ['vaccine', 'allergy', 'fracture']),
    (7, 4, 'Confusion', ['Dizziness', 'Tiredness', 'Weakness']),
    (7, 5, 'falls', ['fevers', 'coughs', 'rashes']),
    (8, 2, 'fluids', ['oxygen', 'Tylenol', 'pain medicine']),
    (8, 4, 'drain', ['scan', 'numb', 'test']),
    (8, 5, 'Antibiotics', ['Vitamins', 'Painkillers', 'Antacids']),
    (9, 1, 'oxygen', ['Tylenol', 'cough medicine', 'breathing treatments']),
    (9, 4, 'lungs', ['kidneys', 'heart', 'liver']),
    (10, 1, 'fluid', ['oxygen', 'rest', 'blood']),
    (10, 2, 'start', ['stop', 'try', 'fail']),
    (11, 2, 'cultures', ['labs', 'a lactate', 'a blood gas']),
    (12, 0, 'Chills', ['Cramps', 'Itching', 'Nausea']),
    (12, 1, 'cultures', ['a CBC', 'a lactate', 'electrolytes']),
    (12, 3, 'dialysis', ['a transfusion', 'surgery', 'an X-ray']),
    (12, 4, 'Redness', ['Bruising', 'Itching', 'Dryness']),
    (12, 5, 'out', ['in', 'taped', 'open']),
    (13, 1, 'pregnancy', ['children', 'infants', 'older adults']),
    (13, 2, 'heartbeat', ['movements', 'position', 'growth']),
    (13, 5, 'safe', ['strong', 'cheap', 'quick']),
    (14, 3, 'allergies', ['implants', 'children', 'insurance']),
    (15, 4, 'tray', ['consent', 'dressing', 'X-ray']),
    (16, 0, 'organs', ['joints', 'muscles', 'bones']),
    (16, 2, 'team', ['family', 'chaplain', 'lab']),
    (16, 4, 'clotting', ['flowing', 'circulating', 'moving']),
    (16, 5, 'explaining', ['recording', 'checking', 'watching']),
    (17, 0, 'lactate', ['potassium', 'sugar', 'temperature']),
    (17, 3, 'hands', ['knees', 'lips', 'ears']),
    (17, 5, 'fluids', ['antibiotics', 'oxygen', 'blood tests']),
    (18, 0, 'tube', ['mask', 'nebulizer', 'nasal cannula']),
    (18, 1, 'preparing', ['checking', 'cleaning', 'moving']),
    (18, 2, 'calm', ['awake', 'upright', 'seated']),
    (18, 3, 'hard', ['slowly', 'quietly', 'gently']),
    (19, 0, 'pressure', ['temperature', 'oxygen', 'breathing']),
    (19, 1, 'pads', ['gloves', 'masks', 'gowns']),
    (19, 2, 'pressor', ['suction', 'monitor', 'warmer']),
    (19, 3, 'thready', ['bounding', 'strong', 'regular']),
    (19, 5, 'monitor', ['pump', 'IV site', 'clock']),
    (20, 2, 'resuscitation', ['intubation', 'dialysis', 'surgery']),
    (20, 3, 'Cultures', ['Labs', 'X-rays', 'Consents']),
    (20, 4, 'dose', ['pump', 'bag', 'line']),
    (0, 1, 'early', ['obvious', 'unusual', 'isolated']),
]
for si, j, a, ds in B:
    set_blank(si, j, a, ds)

# ---------------- C. 문법으로 걸러지는 오답 ----------------
set_blank(5, 3, 'four', ['six', 'three', 'five'])
set_blank(2, 5, 'Once', ['Although', 'Unless', 'Until'])
set_blank(17, 2, 'escalating', ['documenting', 'watching', 'rechecking'])

# ---------------- D. decoy ----------------
set_decoy(2, 1, 'for the pain')
set_decoy(5, 4, 'by tonight')
set_decoy(15, 5, 'in the hall')
# 돌려쓴 틀(at home·for now·last night·for you)을 청크 변형·다른 조각으로
DEC = {
    (1, 1): 'your urine', (5, 2): 'to check', (8, 1): "if there's a leak", (8, 2): 'tests and scans',
    (10, 2): 'dizzy or faint', (13, 2): "your baby's weight", (13, 4): 'more than usual',
    (14, 3): 'any questions', (16, 3): 'and sugar numbers', (19, 2): 'if he wakes up',
    (20, 2): 'after the scan',
    (1, 0): 'a slow heart rate', (4, 5): 'the fluids are finished', (10, 1): 'less fluid',
    (13, 1): 'that are cheap', (13, 3): 'and low blood sugar', (15, 3): 'still high',
    (16, 2): 'and the visitors', (17, 5): 'that keeps changing', (20, 0): 'a lung infection',
    (20, 4): 'in the last day',
    (4, 0): 'your lungs are getting air', (6, 0): 'means your skin', (8, 3): 'a skin rash',
    (10, 0): "I'm adjusting your bed", (12, 0): 'the line is loose', (16, 0): 'of her medicines',
    (17, 0): 'more visitors', (18, 5): 'the lights on', (19, 0): '— the shift is ending',
    (19, 3): 'keeps ringing',
    (3, 4): 'a little thirsty', (5, 3): 'all the paperwork', (9, 5): 'gets louder',
    (10, 4): "so I'm closing the door", (11, 4): 'rather than shout', (12, 2): 'to remove the dressing',
    (16, 1): 'and blood sugar', (17, 2): 'and getting the pharmacist',
}
for (si, j), v in DEC.items():
    set_decoy(si, j, v)

# ---------------- E. distractorsKo ----------------
set_dko(15, 4, '말초라인 부위를 확인할게요', '승압제 펌프를 세팅할게요')
set_dko(11, 5, '체온은 한 시간마다 잴게요', '피검사 결과를 기다리고 있어요')
set_dko(6, 5, '다음 채혈은 두 시간 뒤예요', '아직 치료는 계속돼요')
set_dko(12, 2, '드레싱을 새로 바꿀게요', '새 라인은 다른 곳에 넣을 수 있어요')
set_dko(17, 5, '다음 단계는 의사가 정할 거예요', '소변량도 같이 확인할게요')
set_dko(19, 5, '승압제 속도는 제가 올릴게요', '패드는 이미 붙였어요')
set_dko(20, 4, '중심라인 위치는 X선으로 확인했습니다', '혈압은 5분마다 재고 있습니다')
for si, j in [(1, 4), (2, 0), (5, 2), (8, 2)]:
    sent(si, j)['distractorsKo'] = [x.replace('팔에 따끔할 수 있어요', '팔이 따끔할 수 있어요')
                                    for x in sent(si, j)['distractorsKo']]
set_dko(10, 4, '다리를 올려 드릴게요', '수액 속도를 의사에게 확인할게요')

# ---------------- F. why ----------------
set_why(9, 0, "has spread로 이미 일어난 일을 말하고 so we're acting fast로 그래서 하는 행동을 바로 이어요. "
              "폐렴 같은 감염에 몸이 지나치게 반응해 온몸의 장기가 영향을 받는 것이 패혈증이라 빠른 치료가 필요해요.")
set_why(14, 0, "believe로 확진 전의 판단임을 정직하게 말하면서 serious로 긴급성은 분명히 해요. "
               "통역을 쓸 때도 통역사가 아니라 가족을 보며 직접 말해요.")
set_why(14, 2, "where와 when 두 질문을 짧게 나눠 통역에서 뜻이 덜 흐려져요. 다만 미국 병원 표준은 통역사에게 "
               "'ask her'로 넘기기보다 환자를 보며 'Where do you feel pain?'처럼 직접 묻는 거예요.")
set_why(5, 0, sent(5, 0)['why'] + ' 수액 뒤에도 혈압이 낮으면 승압제까지가 1시간 번들이에요.')
set_why(15, 3, "수액 양과 반응을 먼저 말하고 대시 뒤에 하는 일을 붙여, 한 문장에 상태에서 행동까지 담아요. "
               "충분한 수액(대개 체중 1 kg당 30 mL)을 준 뒤에도 MAP이 65 미만이면 승압제로 넘어가요. "
               "수액 도중이라도 혈압이 너무 낮으면 미루지 않아요.")
set_why(15, 1, sent(15, 1)['why'] + ' 다만 중심라인을 기다리느라 승압제를 미루지는 않아요 — '
               '그동안은 굵은 말초정맥으로 먼저 시작해요(SSC 2021).')
set_why(15, 5, "until로 임시 조치가 언제까지인지 끝을 정해 둬서 말초 투여가 계속되는 방법이 아니라 다리 역할임을 분명히 해요. "
               "말초로 승압제를 먼저 시작하고 미루지 않는 것이 권고돼요(SSC 2021). 그동안 주사 부위가 새는지 자주 살펴요.")
set_why(6, 1, "After fluids로 기준 시점을 먼저 말하고 we'll recheck로 앞으로 일어날 일을 약속해요. "
              "처음 젖산이 높았으면(2 mmol/L 넘게) 소생 처치 뒤 다시 재서 내려가는지 확인해요.")
w = sent(4, 4)['why']
assert '가장 빨리 보여 줘서' in w
set_why(4, 4, w.replace('가장 빨리 보여 줘서', '일찍 보여 줘서'))
w = sent(9, 5)['why']
assert '가장 빠른 신호예요' in w
set_why(9, 5, w.replace('가장 빠른 신호예요', '중요한 신호예요'))

# ---------------- G. order ----------------
# S0
set_line(0, 3, "So because of that warning sign, I'm letting the doctor know right now.", 'speech',
         '그 경고 신호 때문에 지금 바로 의사에게 알릴게요', '보고')
S[0]['order']['why'] = ("측정을 알리고, 'the numbers'가 그 측정을 가리키며 결과를 말하고, 'like that'이 그 결과를 가리켜 의미를 설명하고, "
                        "'that warning sign'이 그 의미를 가리켜 의사에게 알린다고 해요. 'the numbers'·'like that'·'that warning sign'이 "
                        "앞 줄을 가리켜 순서가 하나예요. 감염이 의심되고 기준에 해당하면 다시 재는 데서 그치지 않고 알려요.")
# S5
set_line(5, 1, "Within the hour, we'll start four things: cultures, antibiotics, fluids, and a lactate test.", 'calendar',
         '한 시간 안에 배양, 항생제, 수액, 젖산 검사 네 가지를 시작할 거예요', '계획')
set_line(5, 3, 'When it does, tell me, and I\'ll explain each part as we go.', 'speech',
         '그럴 때는 말씀해 주세요, 진행하면서 각 부분을 설명해 드릴게요', '약속')
S[5]['order']['why'] = ("심각하다는 것을 알리고, 'four things'로 한 시간 안에 시작할 일을 말하고, 'Each one'이 그 네 가지를 가리켜 의미를 말하고, "
                        "'When it does'가 그 '많게 느껴짐'을 받아 설명을 약속해요. 'Each one'·'When it does'가 앞 줄을 가리켜 순서가 하나예요. "
                        "혈압이 계속 낮으면 승압제가 더해져요.")
# S7
set_line(7, 2, 'To find where that sepsis started, has he had a recent catheter problem or wound?', 'speech',
         '그 패혈증이 어디서 시작됐는지 찾으려는데 최근 카테터 문제나 상처가 있었나요?', '병력')
S[7]['order']['why'] = ("혼란이 평소보다 심하다고 알리고, 'That's because'가 그 걱정을 이유로 받아 비전형 증상을 설명하고, "
                        "'that sepsis'가 그 설명 속 패혈증을 가리켜 병력을 묻고, 'Thank you'가 그 대답을 받아 다음 행동을 말해요. "
                        "'That's because'·'that sepsis'·'Thank you'가 앞 줄을 가리켜 순서가 하나예요.")
# S9
set_line(9, 3, 'You can help me keep watch — tell me right away if breathing gets harder.', 'siren',
         '계속 지켜보는 걸 도와주세요 — 숨쉬기가 더 힘들어지면 바로 말씀해 주세요', '협조')
S[9]['order']['why'] = ("상태를 알리고, 'That's why'가 그 상태를 이유로 받아 치료를 말하고, 'Along with that'이 그 치료를 가리켜 호흡 감시를 더하고, "
                        "'keep watch'가 그 감시를 이어받아 환자가 도울 일을 부탁해요. 'That's why'·'Along with that'·'keep watch'가 앞 줄을 가리켜 순서가 하나예요.")
# S12
set_line(12, 1, "We'll check that with cultures from the line and your arm, then start antibiotics now.", 'lab',
         '그걸 확인하려고 라인과 팔에서 배양을 채취하고 바로 항생제를 시작할게요', '검사')
set_line(12, 2, 'If those cultures show the line is the source, we may need to remove it.', 'scalpel',
         '그 배양에서 라인이 원인으로 나오면 제거해야 할 수 있어요', '제거')
S[12]['order']['why'] = ("증상과 라인의 연결을 알리고, 'that'이 그 의심을 가리켜 배양을 채취한 뒤 바로 항생제를 시작한다고 하고, 'those cultures'가 그 배양을 가리켜 "
                         "라인이 원인이면 제거 가능성을 말하고, 'it's out'이 그 제거를 가리켜 그 뒤 경과를 말해요. "
                         "'those cultures'·'it'·'it's out'이 앞 줄을 가리켜 순서가 하나예요. 항생제는 배양 직후 바로 시작해요.")
# S14 — 환자·가족을 보며 1인칭으로(통역사가 옮김)
set_line(14, 0, 'We believe you have a serious infection.', 'speech', '심각한 감염이 있다고 생각해요', '전달')
set_line(14, 2, 'Before I give you the antibiotic, do you have any allergies?', 'shield',
         '항생제를 드리기 전에 알레르기가 있으신가요?', '알레르기')
set_line(14, 3, 'Thank you. Now, where do you feel pain, and when did this start?', 'speech',
         '고마워요. 이제 어디가 아프고 언제 시작됐는지 말씀해 주세요', '증상')
S[14]['order']['why'] = ("'That's why'가 1번 줄을 받고, 'the antibiotic'이 2번 줄을 가리키고, 'Thank you'가 알레르기 대답을 받아요. "
                         "통역을 써도 통역사가 아니라 환자를 보고 1인칭으로 말해요.")
# S15 — 평가·처방 요청이 먼저, 처방을 받으면 말초로 바로 시작
set_line(15, 0, 'Two liters in and her MAP is still under sixty-five.', 'monitor',
         '2리터가 들어갔는데 MAP이 여전히 65 미만이에요', '상황')
set_line(15, 1, "That's septic shock — I need the physician at bedside for a pressor order.", 'speech',
         '패혈성 쇼크예요 — 승압제 처방을 위해 의사가 침상 곁에 필요해요', '요청')
set_line(15, 2, "With that order, I'll start norepinephrine in her peripheral IV right away.", 'pill',
         '그 처방이 나오면 말초 정맥로로 바로 노르에피네프린을 시작할게요', '시작')
set_line(15, 3, "Once the central line is in, I'll move the pressor over to it.", 'pill',
         '중심라인이 들어가면 승압제를 그쪽으로 옮길게요', '이동')
S[15]['order']['why'] = ("상황을 보고하고, 'That's'가 그 상황을 가리켜 쇼크를 알리며 승압제 처방을 위해 의사를 요청하고, 'that order'가 그 처방을 받아 "
                         "말초로 바로 시작하고, 'the pressor'가 그 승압제를 가리켜 중심라인이 들어오면 옮긴다고 말해요. "
                         "승압제는 처방이 있어야 시작하니 평가·요청이 먼저예요. 시작은 중심라인을 기다리지 않고 말초로 해요.")
# S16
set_line(16, 2, 'This is very serious, and the team is doing everything possible to support those organs.', 'shield',
         '매우 심각하고, 저희 팀이 그 장기들을 지지하려고 할 수 있는 모든 걸 하고 있어요', '대응')
S[16]['order']['why'] = ("먼저 솔직하게 상황을 알리고, 'numbers'가 그 상황을 구체적으로 보이고, 'those organs'가 그 장기들을 가리켜 중증도와 대응을 말하고, "
                         "'that's a lot to hear'가 그 무거운 말을 받아 소통을 약속해요. 'those organs'·'that's a lot to hear'가 앞 줄을 가리켜 순서가 하나예요.")
# S18
set_line(18, 2, "We'll give you medicine so you're asleep and comfortable for it.", 'pill',
         '그 과정을 편하게 받도록 잠드는 약을 드릴 거예요', '진정')
set_line(18, 3, "As the medicine takes effect, I'll be right here — try to stay calm.", 'me',
         '약이 듣는 동안 곁에 있을게요, 차분히 계세요', '곁')
S[18]['order']['why'] = ("산소가 떨어진다는 사실을 알리고, 'That's why'가 그 사실을 이유로 받아 삽관 준비를 말하고, 'for it'이 그 삽관을 가리켜 "
                         "잠들게 하는 약을 알리고, 'the medicine'이 그 약을 가리켜 곁에 있겠다고 해요. "
                         "'That's why'·'for it'·'the medicine'이 앞 줄을 가리켜 순서가 하나예요.")
# S19
set_line(19, 2, 'When it gets here, put the pads on him right away.', 'siren', '도착하면 바로 패드를 붙여 주세요', '패드')
set_line(19, 3, 'With the pads on, stay on the pressor and watch the monitor for arrest.', 'monitor',
         '패드를 붙인 뒤에도 승압제를 유지하고 모니터로 심정지를 지켜봐 주세요', '감시')
S[19]['order']['why'] = ("임박을 보고하고, 'code'가 그 임박에 따른 호출과 제세동기를 지시하고, 'it'이 그 제세동기를 가리켜 도착하면 패드를 붙이라고 하고, "
                         "'With the pads on'이 그 패드를 가리켜 유지·감시를 지시해요. 'it'·'With the pads on'이 앞 줄을 가리켜 순서가 하나예요.")
# S20
set_line(20, 3, "With pressure holding like that, he's alert, urine output's improving — ready for report.", 'check',
         '혈압이 그렇게 유지되어 의식이 또렷하고 소변량도 좋아져 인계 준비가 됐습니다', '인계')

# ---------------- H. context ----------------
def ctx(si):
    return [n for n in S[si]['nuance'] if n['kind'] == 'context'][0]


c = ctx(14)
c['word'] = 'urinary source'
c['ko'] = '요로 감염원'
c['scenes'][0]['en'] = 'Suspected sepsis, likely urinary source. Family updated via Spanish interpreter.'
c['scenes'][1]['en'] = "She's likely septic from a urinary source — I updated the family through the interpreter."
c['scenes'][2]['en'] = "She's septic from a urinary source, but hang in there."
c['scenes'][2]['fix'] = 'We believe she has a serious infection, and we are treating it now.'
c['why'] = ('septic·urinary source 같은 임상 줄임말과 hang in there 같은 관용어는 통역에서 그대로 옮겨지지 않아요. '
            '가족에게는 짧고 분명한 말로 해요.')
c = ctx(17)
c['why'] = ("mottling·bilateral knees·cap refill 5초는 차트와 보고의 말이에요. 환자에게는 '피부가 얼룩덜룩하고 차가워진다, "
            "순환이 힘겹다'고 쉬운 말로 풀어요.")
# 사실 오류 8 — 번들은 한 시간 안에 '시작'
c = ctx(5)
c['scenes'][2]['fix'] = "We'll start four important things within the hour, and I'll explain each step."
c['why'] = ("hour-1 bundle은 의료진끼리 쓰는 말이에요. 환자에게는 '한 시간 안에 중요한 것 네 가지를 시작한다, 하나씩 설명하겠다'고 풀어야 "
            "빨라진 처치에 덜 놀라요.")

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('fixed')
