import yaml
P = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-diabetic.yaml'
d = yaml.safe_load(open(P))
S = d['situations']

def sent(si, j, en_prefix=None):
    s = S[si]['sentences'][j]
    return s

def why(si, j, new):
    S[si]['sentences'][j]['why'] = new

def blank(si, j, answer, options, old_answer=None):
    s = S[si]['sentences'][j]
    if old_answer: assert s['blank']['answer'] == old_answer, (si, j)
    s['blank'] = {'answer': answer, 'options': [{'en': o} for o in options]}

def dec(si, j, new, old):
    s = S[si]['sentences'][j]; assert s['decoy'] == old, (si, j, s['decoy']); s['decoy'] = new

def dko(si, j, k, new, old):
    s = S[si]['sentences'][j]; assert s['distractorsKo'][k] == old, (si, j, k); s['distractorsKo'][k] = new

def line(si, k, en, icon, ko, note):
    S[si]['order']['lines'][k - 1] = {'en': en, 'icon': icon, 'ko': ko, 'note': note}

def ow(si, new):
    S[si]['order']['why'] = new

# ---- why (6)
why(1, 3, "recheck의 re-가 '다시'를, in fifteen minutes가 시점을 알려요. 빠른 당 15 g을 먹고 15분 뒤 다시 재서 아직 70 mg/dL 아래면 한 번 더 먹는 것이 '15-15 규칙'이에요.")
why(1, 0, "Do you feel…로 선택지 셋을 한꺼번에 던져 해당하는 것만 고르게 해요. 떨림·식은땀은 아드레날린 반응이고, 어지러움은 뇌에 당이 모자라 생기는 저혈당의 대표 증상이에요.")
why(8, 4, "carefully로 양과 속도를 살피며 넣는다고 알려요. HHS는 수액이 많이 필요하지만, 고령자는 심장·신장이 약할 수 있어 너무 빨리 넣으면 폐에 물이 찰 수 있어요.")
why(14, 3, "show me back은 teach-back의 시연형으로, 환자가 직접 해 보이게 하는 방법이에요. 해 보이는 손놀림을 보면 이해했는지가 바로 드러나요.")
why(16, 2, "neurological status는 의식·동공·운동을 합쳐 부르는 말이고 closely로 자주 본다고 알려요. 소아 DKA에서는 두통과 의식 수준의 변화가 뇌부종의 중요한 초기 신호라 반복해서 살펴요.")
why(14, 2, "any questions로 '있다면 무엇이든'을 열어 두고 about the insulin으로 범위를 정해요. 질문이 없다고 하면 다음 단계로 시연을 부탁해 이해를 확인해요.")

# ---- blank (14)
blank(1, 2, 'juice', ['juice', 'diet soda', 'black coffee', 'antacid'], 'juice')
blank(6, 2, 'vein', ['vein', 'muscle', 'stomach', 'bladder'], 'vein')
blank(18, 3, 'glucose', ['saline', 'glucose', 'potassium', 'calcium'], 'glucose')
blank(15, 4, 'potassium', ['potassium', 'sodium', 'calcium', 'oxygen'], 'hold')
blank(14, 3, 'back', ['back', 'up', 'out', 'around'], 'understand')
blank(13, 0, 'pregnant', ['late', 'pregnant', 'overdue', 'postpartum'], 'pregnant')
blank(4, 5, 'controlled', ['controlled', 'high', 'unchecked', 'untreated'], 'faster')
blank(9, 1, 'red', ['dry', 'clean', 'red', 'healed'], 'red')
blank(16, 5, 'responding', ['leaving', 'responding', 'resting', 'charting'], 'responding')
blank(7, 3, 'teach', ['ask', 'forbid', 'teach', 'force'], 'teach')
blank(10, 5, 'extra', ['less', 'oral', 'no', 'extra'], 'extra')
blank(14, 5, 'exactly', ['almost', 'partly', 'half', 'exactly'], 'exactly')
blank(20, 1, 'breath', ['time', 'breath', 'sleep', 'energy'], 'breath')
blank(5, 5, 'ready', ['labeled', 'billed', 'ready', 'cleaned'], 'ready')

# ---- decoy (4)
dec(3, 5, 'makes up for', 'keeps you from')
dec(11, 5, 'Never freeze', 'Please delay')
dec(15, 2, "so we'll recheck it", 'after more')
dec(19, 4, 'for the pain', 'tomorrow morning')

# ---- distractorsKo (11)
dko(4, 2, 1, '상처에 뭘 바르셨어요?', '열이 나거나 오한이 있으세요?')
dko(5, 4, 1, '소변 검사도 같이 할게요', '팔에 정맥주사를 놓을게요')
dko(8, 5, 0, '어머님 드시는 약 목록이 있으세요?', '신장 기능은 혈액검사로 봐요')
dko(11, 0, 0, '집에서 혈당은 얼마였어요?', '열이 나거나 오한이 있으세요?')
dko(11, 0, 1, '인슐린은 평소대로 맞으셨어요?', '기침이나 가래가 있으세요?')
dko(11, 2, 0, '물을 자주 조금씩 드세요', '약은 평소대로 드세요')
dko(14, 0, 0, '인슐린 펜을 꺼내 볼게요', '통역사가 곧 전화로 연결돼요')
dko(15, 2, 1, '근육 경련은 좀 어떠세요?', '칼륨은 정맥으로 천천히 들어가요')
dko(19, 1, 1, '혈당은 집에서 얼마였어요?', '발이 언제부터 검게 변했어요?')
dko(20, 3, 0, '지금 혈당을 다시 잴게요', '의사 선생님께 먼저 말씀드릴게요')
dko(20, 4, 0, '모니터 알람을 확인할게요', '지금 당직 의사에게 전화해요')
dko(20, 5, 0, '수액 속도를 확인할게요', '다음 근무자에게 구두로 전할게요')

# ---- order (18)
# S0
line(0, 3, "Thanks — now I'm going to check your blood sugar.", 'lab', '고마워요, 이제 혈당을 확인할게요', '검사')
ow(0, "인슐린 시점을 묻고, 그 뒤에 먹은 것을 묻고, 고맙다고 한 뒤 혈당을 재겠다고 알리고, 그 검사를 위해 손끝을 찌른다고 말해요. 'after that'·'Thanks — now'·'for it'이 앞 줄을 가리켜 순서가 하나예요.")
# S1
line(1, 1, "Your sugar is low, at 58.", 'chartup', '혈당이 58로 낮아요', '수치')
line(1, 2, "Let's have you drink this juice to raise that number.", 'coffee', '그 수치를 올리려고 이 주스를 드시게 할게요', '처치')
line(1, 3, "We'll recheck it fifteen minutes after you finish.", 'calendar', '다 드시고 십오 분 뒤에 다시 잴게요', '재측정')
line(1, 4, "If it's still under 70 then, we'll repeat the juice.", 'coffee', '그때도 70 미만이면 주스를 한 번 더 드릴게요', '반복')
ow(1, "수치를 알리고, 주스로 올리고, 15분 뒤 다시 재고, 아직 70 미만이면 반복한다고 알려요. 'that number'·'you finish'·'then'이 앞 줄을 가리켜 순서가 하나예요.")
# S3
line(3, 4, "To get that benefit, let's practice rotating together on a new spot.", 'speech', '그 효과를 얻으려고 새 부위에서 돌려 놓는 걸 같이 연습해 봐요', '연습')
ow(3, "평소 놓는 방법을 보여 달라고 하고, 그 인슐린을 놓는 부위를 묻고, 그 부위를 돌려 쓰는 이유를 설명한 뒤, 그 효과를 얻도록 새 부위에서 돌려 놓기를 함께 연습해요. 'for it'·'those spots'·'that benefit'이 앞 줄을 가리켜 순서가 하나예요.")
# S5
line(5, 2, "Whether or not you have, is your breathing faster or deeper?", 'stetho', '그랬든 아니든, 숨이 더 빠르거나 깊으세요?', '호흡')
line(5, 3, "Both answers help, and we're checking your sugar, ketones, and blood gas now.", 'lab', '두 답 모두 도움이 돼요, 지금 혈당과 케톤, 혈액가스를 확인하고 있어요', '검사')
line(5, 4, "We'll start IV fluids now and add insulin once those results are back.", 'pill', '수액은 바로 시작하고 결과가 나오면 인슐린을 더할게요', '치료')
ow(5, "누락 여부와 관계없이 호흡을 묻고, 답을 받은 뒤 검사를 알리고, 수액은 바로 시작하되 인슐린은 결과를 보고 더한다고 알려요. 'you have'·'Both answers'·'those results'가 앞 줄을 가리켜 순서가 하나예요.")
# S6
line(6, 1, "His sugar is very low, so we're giving sugar into his vein now.", 'pill', '혈당이 아주 낮아서 지금 정맥으로 당을 주고 있어요', '처치')
line(6, 2, "That should bring it back up in a few minutes.", 'faceWorried', '그러면 몇 분 안에 다시 오를 거예요', '안심')
line(6, 3, "Until then, when did you notice he became confused?", 'calendar', '그때까지, 언제부터 혼란스러워하는 걸 알아차리셨어요?', '시점')
line(6, 4, "Before it started, did he take his insulin without eating?", 'pill', '그게 시작되기 전에 식사 없이 인슐린을 맞으셨나요?', '원인')
ow(6, "처치부터 알리고 안심시킨 뒤, 그때까지 혼란이 언제 시작됐는지와 원인을 물어요. 'That'·'Until then'·'it started'가 앞 줄을 가리켜 순서가 하나예요.")
# S8
line(8, 3, "Either way, her sugar is extremely high and she's very dehydrated.", 'chartup', '어느 쪽이든 혈당이 아주 높고 탈수도 심해요', '설명')
line(8, 4, "To treat both problems, we'll give fluids carefully and watch her heart and kidneys.", 'pill', '두 문제를 치료하려고 수액을 조심스럽게 주고 심장과 신장을 지켜볼게요', '치료')
ow(8, "졸림이 언제부터인지 묻고, 그 뒤로 먹고 마신 양이 줄었는지 묻고, 어느 쪽이든 혈당이 높고 탈수가 심하다고 알린 뒤 그 두 문제의 치료와 감시를 알려요. 'since then'·'Either way'·'both problems'가 앞 줄을 가리켜 순서가 하나예요.")
# S9
line(9, 2, "Let's check the tubing and site, since either can cause that.", 'magnify', '둘 다 그 원인이 될 수 있어서 튜브와 부위를 확인해 볼게요', '점검')
line(9, 3, "While we sort out what we find there, we'll give insulin by injection.", 'pill', '거기서 찾은 걸 해결하는 동안 인슐린을 주사로 놓을게요', '대안')
ow(9, "혈당이 언제부터 올랐는지 묻고, 그 원인이 될 수 있는 튜브와 부위를 점검하고, 거기서 찾은 문제를 해결하는 동안 주사를 쓰겠다고 하고, 해결되면 펌프로 돌아간다고 닫아요. 'that'·'there'·'back to the pump'가 앞 줄을 가리켜 순서가 하나예요.")
# S10
line(10, 4, "We'll monitor that rise and may add extra insulin while you're on it.", 'monitor', '그 상승을 지켜보고 복용하는 동안 추가 인슐린을 더할 수도 있어요', '계획')
ow(10, "스테로이드를 왜 먹는지 묻고, 그걸 언제 시작했는지 묻고, 그것이 혈당을 올렸을 수 있다고 설명하고, 그 상승을 지켜보며 필요하면 인슐린을 더한다고 닫아요. 'it'·'that rise'가 앞 줄을 가리켜 순서가 하나예요.")
# S11
line(11, 3, "Skipping any of those can make your sugars harder to control.", 'bulb', '그걸 거르면 혈당 조절이 더 어려워질 수 있어요', '이유')
# S12
line(12, 1, "How many low sugars have you had this month?", 'calendar', '이번 달에 저혈당이 몇 번 있었어요?', '횟수')
line(12, 2, "Have any of those lows made you fall or nearly fall?", 'faceWorried', '그 저혈당 때문에 넘어지거나 넘어질 뻔하셨어요?', '낙상')
line(12, 3, "Either way, did you feel dizzy or faint just before it happened?", 'stetho', '어느 쪽이든, 그 일이 생기기 직전에 어지럽거나 실신할 것 같으셨어요?', '전조')
line(12, 4, "We may need to adjust your medications to prevent those dizzy spells and falls.", 'pill', '그런 어지럼과 낙상을 막으려고 약을 조정해야 할 수도 있어요', '조정')
ow(12, "이번 달 저혈당 횟수를 묻고, 그 저혈당 때문에 넘어졌는지 묻고, 어느 쪽이든 직전 증상을 묻고, 그런 어지럼과 낙상을 막도록 약을 조정한다고 해요. 'those lows'·'Either way'·'those dizzy spells'가 앞 줄을 가리켜 순서가 하나예요.")
# S13
line(13, 2, "At that stage, we can check the baby's heartbeat on a monitor.", 'monitor', '그 시기에는 모니터로 아기 심장박동을 확인할 수 있어요', '감시')
line(13, 3, "While we do that, we'll bring your sugar back into range.", 'chartup', '그동안 혈당을 목표 범위로 되돌릴게요', '관리')
line(13, 4, "Keeping it in range protects you both.", 'shield', '범위 안에 유지하면 두 분 모두에게 좋아요', '이유')
ow(13, "주수를 묻고, 그 시기에 할 수 있는 태아 심박 감시를 알리고, 그동안 혈당을 범위 안으로 되돌린다고 하고, 범위 안에 유지하면 두 사람을 지킨다고 닫아요. 'At that stage'·'While we do that'·'it in range'가 앞 줄을 가리켜 순서가 하나예요.")
# S14
line(14, 2, "With the interpreter here, let me show you each step.", 'pill', '통역사가 곁에 있으니 단계마다 보여드릴게요', '시연')
ow(14, "통역을 부른다고 알리고, 그 통역사가 있는 자리에서 단계별로 보여 주고, 그것을 환자가 직접 해 보게 하고, 맞게 하면 칭찬해요. 'the interpreter here'·'do it'·'That'이 앞 줄을 가리켜 순서가 하나예요.")
# S15
line(15, 1, "Your potassium is low, so we'll correct it before more insulin.", 'lab', '칼륨이 낮아서 인슐린을 더 넣기 전에 먼저 교정할게요', '칼륨')
line(15, 2, "That can cause muscle weakness or cramping — have you noticed any?", 'stetho', '그래서 근육이 약해지거나 쥐가 날 수 있는데, 느끼셨어요?', '증상')
line(15, 3, "Your heart can be affected too, so we're watching its rhythm on the monitor.", 'monitor', '심장도 영향을 받을 수 있어서 모니터로 그 리듬을 지켜보고 있어요', '감시')
line(15, 4, "Any change on that monitor will tell us right away.", 'monitor', '그 모니터에 변화가 생기면 저희가 바로 알 수 있어요', '알림')
ow(15, "칼륨이 낮아 인슐린 전에 교정한다고 알리고, 그것이 일으키는 근육 증상을 묻고, 심장도 영향을 받아 모니터로 본다고 알린 뒤, 그 모니터의 변화로 바로 알 수 있다고 닫아요. 'That'·'too'·'that monitor'가 앞 줄을 가리켜 순서가 하나예요.")
# S16
line(16, 3, "Either way, we're checking his neurological status closely right now.", 'stetho', '어느 쪽이든 지금 신경 상태를 자세히 확인하고 있어요', '확인')
line(16, 4, "While we check, the team is getting medicine ready in case he needs it.", 'pill', '확인하는 동안 팀이 필요할 때 쓸 약을 준비하고 있어요', '준비')
ow(16, "두통과 졸림이 언제 시작됐는지 묻고, 시작했을 때보다 더 졸린지 묻고, 어느 쪽이든 신경 상태를 보고 있다고 알린 뒤, 확인하는 동안 팀이 약을 준비한다고 닫아요. 'when it started'·'Either way'·'While we check'가 앞 줄을 가리켜 순서가 하나예요.")
# S17
line(17, 1, "Her pressure is low, so we're giving fluids quickly.", 'pill', '혈압이 낮아서 수액을 빠르게 드리고 있어요', '처치')
line(17, 2, "While those run, how responsive has she been over the last hour?", 'speech', '수액이 들어가는 동안, 지난 한 시간 동안 반응이 어땠어요?', '반응')
line(17, 3, "During that hour, did she open her eyes or respond to your voice?", 'speech', '그 시간 동안 눈을 뜨거나 목소리에 반응했어요?', '의식')
line(17, 4, "If either one gets worse, tell me right away.", 'monitor', '둘 중 하나라도 나빠지면 바로 말씀해 주세요', '당부')
ow(17, "수액을 시작했다고 알리고, 그동안 지난 한 시간의 반응을 묻고, 그 시간 동안 눈과 목소리 반응을 묻고, 눈과 목소리 중 하나라도 나빠지면 바로 알려 달라고 닫아요. 'those'·'that hour'·'either one'이 앞 줄을 가리켜 순서가 하나예요.")
# S18
line(18, 3, "Because of that, we're checking for other causes like infection or stroke.", 'magnify', '그래서 감염이나 뇌졸중 같은 다른 원인도 확인하고 있어요', '원인')
line(18, 4, "Meanwhile, we'll recheck his sugar often and give more if it drops again.", 'pill', '그동안 혈당을 자주 다시 재고, 또 떨어지면 더 드릴게요', '재측정')
ow(18, "포도당을 언제 줬는지 묻고, 혈당은 올랐지만 의식은 아직이라고 알리고, 그래서 다른 원인을 찾는다고 하고, 그동안 혈당을 자주 재며 다시 떨어지면 더 준다고 해요. 'It'·'Because of that'·'Meanwhile'이 앞 줄을 가리켜 순서가 하나예요.")
# S19
line(19, 3, "Either way, this is serious, so we're starting antibiotics and fluids now.", 'pill', '어느 쪽이든 심각해서 항생제와 수액을 지금 시작해요', '치료')
line(19, 4, "I'll tell the surgical team what we've started in an SBAR report.", 'speech', '시작한 것을 SBAR 보고로 외과팀에 알릴게요', '보고')
ow(19, "발이 이런 지 얼마나 됐는지 묻고, 그동안 번졌는지 묻고, 어느 쪽이든 심각하니 항생제와 수액을 시작하고, 시작한 것을 SBAR로 외과에 알려요. 'since then'·'Either way'·'what we've started'가 앞 줄을 가리켜 순서가 하나예요.")
# S20
line(20, 3, "I'm updating the doctor about both answers and your latest blood tests.", 'lab', '두 답과 최근 혈액검사 결과를 의사에게 알리고 있어요', '알림')
ow(20, "몇 시간 전과 호흡을 비교해 묻고, 그 뒤로 숨이 더 찼는지 묻고, 두 답과 최근 검사 결과를 의사에게 알리고, 수치 추이를 그 의사에게 정확히 전한다고 해요. 'since then'·'both answers'·'them'이 앞 줄을 가리켜 순서가 하나예요.")

# ---- context (3)
def ctx(si):
    return [n for n in S[si]['nuance'] if n['kind'] == 'context'][0]
c = ctx(8)
assert 'dehydration' in c['scenes'][1]['en'] and 'dehydration' in c['scenes'][2]['en']
c['scenes'][1]['en'] = 'Severe hyperglycemia; pt dehydrated, AMS. HHS suspected.'
c['scenes'][2]['en'] = "She's in a hyperosmolar hyperglycemic state and profoundly dehydrated."
c = ctx(11)
assert c['scenes'][0]['en'].startswith('Pt sick with influenza')
c['scenes'][0]['en'] = 'Intercurrent influenza with labile BG; sick-day plan reviewed.'
c = ctx(19)
assert c['word'] == 'sepsis'
c['scenes'][2]['fix'] = "Your foot infection is spreading through your body — that's called sepsis — so the surgical team is coming to see you now."
c['why'] = "necrotizing soft tissue infection은 의료진의 말이에요. sepsis는 환자에게도 쓰는 말이지만, 무슨 뜻인지 함께 풀어서 얼마나 심각한지와 누가 오는지를 알려요."

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('fixed')
