import yaml, re
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
P = D + 'er-asthma-copd.yaml'
d = yaml.safe_load(open(P))
S = d['situations']
def sent(k):
    a, b = map(int, k.split('.')); return S[a]['sentences'][b]
def line(si, li): return S[si]['order']['lines'][li]
def setline(si, li, en, ko, icon=None, note=None):
    l = line(si, li); l['en'] = en; l['ko'] = ko
    if icon: l['icon'] = icon
    if note: l['note'] = note

# ---- why ----
def rep(k, old, new):
    x = sent(k); assert old in x['why'], (k, old); x['why'] = x['why'].replace(old, new)
rep('9.1', "COPD 환자는 산소를 너무 많이 받으면 호흡 자극이 줄어 이산화탄소가 쌓일 수 있어요.",
    "COPD 환자 일부는 산소를 너무 많이 주면 폐의 공기·혈류 균형이 흐트러져 이산화탄소가 쌓여요. 그래서 산소를 끊는 게 아니라 목표 범위로 맞춰요.")
rep('16.2', "조용한 흉부에서 더 나빠지면 기도 확보를 위한 삽관을 준비하는 것이 맞아요.",
    "조용한 흉부는 곧 호흡이 멈출 수 있다는 신호라 기다리지 않고 바로 팀을 부르고 삽관을 준비해요.")
sent('19.3')['why'] = ("'dropping fast'로 속도를 함께 말하면 팀이 위급함을 바로 알아요. "
                       "긴장성 기흉은 한쪽 폐가 눌려 산소포화도가 빠르게 떨어져요.")
rep('9.5', "이른 신호라", "중요한 신호라")
x = sent('20.1'); x['why'] += " one-word answers only는 한 단어로만 말할 만큼 숨이 차다는 중증 신호예요."

# ---- blank ----  key: (answer, [other three])
BL = {
 '4.3': ('had', ['caught', 'taken', 'felt']),
 '9.0': ('higher', ['lower', 'longer', 'sooner']),
 '13.5': ('talk', ['sleep', 'eat', 'walk']),
 '17.1': ('mental status', ['blood sugar', 'urine output', 'heart rhythm']),
 '20.1': ('one-word', ['full-sentence', 'clear', 'normal']),
 '18.1': ('paralytic', ['antibiotic', 'antidote', 'steroid']),
 '3.4': ('albuterol', ['prednisone', 'ipratropium', 'budesonide']),
 '15.0': ('magnesium', ['calcium', 'potassium', 'aspirin']),
 '7.1': ('long term', ['as needed', 'at night', 'twice a day']),
 '13.2': ('rescue', ['controller', 'steroid', 'nasal']),
 '5.2': ('improving', ['dropping', 'leveling off', 'swinging']),
 '7.3': ('raise', ['lower', 'stabilize', 'normalize']),
 '17.0': ('rising', ['falling', 'normal', 'stable']),
 '18.2': ('difficult', ['easy', 'manual', 'prolonged']),
 '16.3': ('dropping', ['rising', 'recovering', 'fluctuating']),
 '9.4': ('worse', ['easier', 'deeper', 'slower']),
 '20.4': ('tiring', ['agitated', 'sedated', 'wheezing']),
 '21.5': ('wait', ['stop', 'rush', 'guess']),
 '21.2': ('early', ['later', 'gradually', 'briefly']),
 '12.5': ('set', ['change', 'check', 'share']),
 '7.5': ('short', ['standard', 'daily', 'first']),
 '2.2': ('show', ['tell', 'teach', 'remind']),
 '21.3': ('ICU', ['ER', 'hospital', 'floor']),
 '16.5': ('bedside', ["nurses' station", 'doorway', 'sink']),
 '18.4': ('bedside', ["nurses' station", 'supply room', 'hallway']),
 '13.0': ('colds', ['pollen', 'mold', 'exercise']),
 '4.1': ('smoke', ['drink', 'work', 'drive']),
 '10.0': ('for good', ['for a week', 'for a while', 'for now']),
 '8.4': ('word', ['sentence', 'question', 'breath']),
 '11.4': ('stomach', ['head', 'heart', 'chest']),
}
for k, (ans, oth) in BL.items():
    x = sent(k); b = x['blank']
    old = [o['en'] for o in b['options']]
    pos = old.index(b['answer'])          # keep the answer's slot
    assert len(re.findall(r'(?i)(?<![\w])' + re.escape(ans) + r'(?![\w])', x['en'])) == 1, (k, ans)
    opts = oth[:]; opts.insert(pos, ans)
    assert len(set(opts)) == 4
    b['answer'] = ans; b['options'] = [{'en': e} for e in opts]

# ---- decoy ----
for k, v in {'12.2': 'at night', '15.1': 'Leave me', '17.5': 'for days', '5.4': 'to ten'}.items():
    x = sent(k); assert v not in x['en'] and v not in x['chunks']; x['decoy'] = v

# ---- distractorsKo ----
DK = {
 '0.2': {0: "흡입기는 누가 처방해 줬나요?"},
 '1.5': {0: "오늘 수치는 평소보다 낮아요"},
 '9.2': {1: "산소통을 새것으로 바꿀게요"},
 '11.3': {1: "목이 아프세요?"},
 '13.2': {0: "흡입기 쓰는 법을 아이에게 가르쳐 주세요"},
 '15.0': {0: "지금 스테로이드 주사를 드렸어요", 1: "지금 산소를 더 올릴게요"},
 '15.2': {0: "이 치료가 끝나면 숨소리를 다시 들어 볼게요"},
 '15.5': {0: "산소 마스크를 바꿔 드릴게요"},
 '16.5': {0: "흡인기를 켜 두세요"},
 '17.2': {0: "호전되면 BiPAP 압력을 낮춰 볼게요", 1: "BiPAP 마스크가 새는지 확인해요"},
 '18.5': {0: "케타민 용량을 다시 확인할게요"},
}
for k, m in DK.items():
    x = sent(k)
    for i, v in m.items(): x['distractorsKo'][i] = v
    assert len(set(x['distractorsKo'])) == 2 and x['ko'] not in x['distractorsKo']

# ---- tag / icon ----
sent('20.1')['tag'] = 'A 사정'
sent('4.0')['icon'] = 'home'

# ---- order ----
# S13
setline(13, 1, 'When one of those hits, watch for fast breathing or ribs pulling in.',
        '그중 하나가 닥치면 빠른 호흡이나 갈비뼈 당김을 살피세요')
setline(13, 3, "But if his lips turn blue or he can't talk, don't wait to see if the inhaler works — call 911 right away.",
        '하지만 입술이 파래지거나 말을 못 하면 흡입기가 듣는지 기다리지 말고 바로 911에 전화하세요')
S[13]['order']['why'] = ("유발요인을 알리고, 그것이 닥칠 때 볼 징후와 흡입기 대처를 말한 뒤, 입술이 파래지거나 말을 못 하면 "
                         "기다리지 말고 911이라고 닫아요. 'those'·'that'·'But … the inhaler'가 앞 줄을 받아 순서가 하나예요.")
# S20
setline(20, 1, 'Background: known COPD on home oxygen, admitted twice this year.',
        '배경: 가정 산소를 쓰는 COPD가 있고, 올해 두 번 입원했어요')
# S19
setline(19, 1, 'Page the doctor now — we need immediate needle decompression.',
        '지금 의사를 호출해 주세요 — 즉각적인 바늘감압이 필요해요', 'speech', '호출')
setline(19, 2, "While you do that, I'll grab the decompression kit.",
        '그동안 제가 감압 키트를 가져올게요', 'scalpel', '분담')
S[19]['order']['why'] = ("소견으로 의심 진단을 알리고, 의사 호출과 즉각 감압이 필요하다고 말하고, 그동안 키트를 가져온다고 분담한 뒤, "
                         "감압 뒤의 회복을 말해요. 'While you do that'·'the needle goes in'이 앞 줄을 가리켜 순서가 하나예요.")
# S0
setline(0, 2, 'Along with that rescue inhaler, do you take a daily controller?',
        '그 구조 흡입기 말고 매일 쓰는 조절제도 있으세요?', 'pill')
assert "'that many puffs'" in S[0]['order']['why']
S[0]['order']['why'] = S[0]['order']['why'].replace("'that many puffs'", "'that rescue inhaler'")
# S3
setline(3, 1, 'Either way, this mist is a medicine that opens up your airways.',
        '처음이든 아니든, 이 분무액은 기도를 열어 주는 약이에요')
assert "'In that case'" in S[3]['order']['why']
S[3]['order']['why'] = S[3]['order']['why'].replace("'In that case'", "'Either way'")
# S4
setline(4, 0, 'How long have you had COPD?', 'COPD를 앓은 지 얼마나 됐어요?', 'calendar', '병력')
setline(4, 1, 'Over those years, have you kept smoking, or when did you quit?',
        '그 오랜 세월 동안 계속 담배를 피우셨어요, 아니면 언제 끊으셨어요?', 'magnify', '흡연')
setline(4, 2, 'With that smoking history, are you on home oxygen now, and do you use it all day or just sometimes?',
        '그 흡연력을 생각하면, 지금 가정 산소를 쓰세요? 쓰신다면 하루 종일 쓰세요, 가끔만 쓰세요?', 'home', '산소')
S[4]['order']['why'] = ("병이 얼마나 됐는지 먼저 묻고, 그 세월 동안의 흡연을 확인하고, 이어서 가정 산소 사용을 묻고, 그 모두를 생각해 "
                        "입원 빈도로 마무리해요. 'those years'·'that smoking history'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
# S6
setline(6, 0, 'Has your phlegm changed color or amount, and any fever or chills?',
        '가래의 색이나 양이 변했나요, 열이나 오한은 있으셨어요?', 'magnify', '감염')
setline(6, 1, 'Besides infection, heart problems can do this — any swelling in your legs?',
        '감염 말고 심장 문제도 이럴 수 있어요 — 다리가 붓지는 않았나요?', 'bell', '부종')
setline(6, 2, 'Along with that swelling, do you have trouble lying flat?',
        '그 붓기와 함께 평평하게 누우면 숨쉬기 힘드세요?', 'stetho', '눕기')
setline(6, 3, "Thanks — I'll pass all of that to the doctor.",
        '고마워요 — 그 모든 걸 의사에게 전할게요', 'speech', '보고')
S[6]['order']['why'] = ("가래·열로 감염을 먼저 확인하고, 감염 말고 심장 문제를 가려 다리 붓기를 묻고, 그 붓기와 함께 누울 때의 숨참을 묻고, "
                        "의사에게 전한다고 닫아요. 'Besides infection'·'that swelling'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
# S11
setline(11, 1, 'Did it help? Yes or no?', '도움이 됐나요? 예, 아니오?', 'pill', '효과')
setline(11, 2, 'Before we give you more, allergy to medicine? Yes or no?',
        '더 드리기 전에, 약 알레르기 있으세요? 예, 아니오?', 'bell', '알레르기')
S[11]['order']['why'] = ("예/아니오로 사용 여부를 묻고, 그 약이 도움이 됐는지 묻고, 더 쓰기 전에 약 알레르기를 확인한 뒤, 통역사가 곧 온다고 닫아요. "
                         "'it'·'Before we give you more'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
# S14
setline(14, 1, 'Either way, have your ankles been swelling or your weight going up?',
        '어느 쪽이든, 발목이 붓거나 체중이 늘고 있었나요?')
setline(14, 2, "To sort out both of those answers, we'll listen to your heart and lungs to tell them apart.",
        '그 두 답을 가려내려고 심장과 폐 소리를 들어 구별해 볼게요')
assert "'If it is'" in S[14]['order']['why']
S[14]['order']['why'] = S[14]['order']['why'].replace("'If it is'", "'Either way'")
# S7
setline(7, 3, 'That rise settles once you stop, and a short course rarely causes long-term problems.',
        '그 상승은 끊으면 가라앉고, 짧은 기간은 장기적인 문제를 거의 일으키지 않아요')
w = S[7]['order']['why']
assert "'all of that'" in w and '그 모든 것을 근거로 장기 사용과 다르다고 안심시켜요' in w
S[7]['order']['why'] = w.replace("'all of that'", "'That rise'").replace(
    '그 모든 것을 근거로 장기 사용과 다르다고 안심시켜요', '혈당 상승이 가라앉고 짧은 기간은 장기 문제가 드물다고 안심시켜요')
# S9
setline(9, 2, "To prevent that build-up, I'll titrate it carefully to keep you in that range.",
        '그 축적을 막으려고 그 범위 안에 있도록 신중하게 조절할게요')
assert "'So'" in S[9]['order']['why']
S[9]['order']['why'] = S[9]['order']['why'].replace("'So'", "'To prevent that build-up'")
# S15
setline(15, 3, "In case we have to do that, we're calling for backup and getting the airway team here.",
        '그래야 할 경우에 대비해 지원 인력을 부르고 기도 팀을 여기로 오게 하고 있어요')
assert "'That's why'" in S[15]['order']['why']
S[15]['order']['why'] = S[15]['order']['why'].replace("'That's why'", "'In case we have to do that'")
# S12
setline(12, 2, 'Is the hard part the cost, the side effects, or just forgetting?',
        '힘든 부분이 비용인가요, 부작용인가요, 아니면 그냥 잊는 건가요?')
setline(12, 3, "If it's forgetting, let's set a daily time so it's easier to remember.",
        '잊어서라면 기억하기 쉽도록 매일 정한 시간을 둬요')
w = S[12]['order']['why']
assert "'that'·'For that reason'" in w and '그 이유를 풀 해결책' in w
S[12]['order']['why'] = w.replace("'that'·'For that reason'", "'the hard part'·'If it's forgetting'").replace(
    '그 이유를 풀 해결책', '잊어서라면 쓸 해결책')
# S16
setline(16, 2, 'With that warning, call the team — prepare for intubation now.',
        '그 경고를 보고 팀을 불러 주세요 — 지금 삽관을 준비하세요')
assert "'That's why'·'they'" in S[16]['order']['why']
S[16]['order']['why'] = S[16]['order']['why'].replace("'That's why'·'they'", "'That's why'·'With that warning'·'they'")

# ---- context ----
def ctx(si):
    cs = [n for n in S[si]['nuance'] if n['kind'] == 'context']; assert len(cs) == 1; return cs[0]
def scene(c, i, en, who, icon):
    c['scenes'][i]['en'] = en; c['scenes'][i]['who'] = who; c['scenes'][i]['icon'] = icon
c = ctx(3); c['word'] = 'bronchodilator'; c['ko'] = '기관지확장제'
scene(c, 0, 'Bronchodilator neb given for wheezing.', '차트 기록', 'board')
scene(c, 1, 'Starting a bronchodilator neb now.', '의사에게', 'monitor')
c['scenes'][2]['en'] = "I'm giving you a short-acting bronchodilator."
c = ctx(5); scene(c, 1, 'Peak flow improved from 180 to 300 after three nebs.', '의사에게', 'monitor')
c['scenes'][2]['en'] = 'Your peak flow went from 45 to 75 percent of predicted.'
c['why'] = "예측치 대비 퍼센트 같은 수치 비교는 의료진끼리 주고받는 말이에요. 환자에게는 '올 때보다 훨씬 좋아졌다'처럼 뜻을 전해요."
c = ctx(7); c['word'] = 'burst'; c['ko'] = '단기 집중 투여'
scene(c, 0, "Let's start a five-day steroid burst.", '의사에게', 'monitor')
scene(c, 1, 'Prednisone 40 mg burst x 5 days.', '차트 기록', 'board')
c = ctx(21); c['word'] = 'prior intubation'; c['ko'] = '이전 삽관'
scene(c, 0, 'Hx of prior intubation for asthma.', '차트 기록', 'board')
c = ctx(12); c['word'] = 'adherence'; c['ko'] = '복약 순응'
scene(c, 0, 'Poor adherence to controller, ~2x/week.', '차트 기록', 'board')
scene(c, 1, 'His adherence to the controller is poor.', '의사에게', 'monitor')
c['scenes'][2]['en'] = 'Your adherence has been poor.'
c['scenes'][2]['fix'] = 'What makes it hard to use your controller every day?'
c['why'] = 'adherence는 의료진끼리 쓰는 평가 말이에요. 환자에게는 무엇이 어려운지를 비난 없이 물어요.'
for si in (3, 5, 7, 21, 12):
    c = ctx(si)
    for sc in c['scenes']:
        assert re.search(r'(?i)(?<!\w)' + re.escape(c['word']) + r'(?!\w)', sc['en']), (si, c['word'], sc['en'])

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
