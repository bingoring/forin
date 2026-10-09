import yaml, re
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
P = D + 'er-arrhythmia.yaml'
d = yaml.safe_load(open(P))
S = d['situations']
def sent(k):
    a, b = map(int, k.split('.')); return S[a]['sentences'][b]

# ---- why ----
WHY = {
 '16.1': "Stay with me는 의식이 흐려지는 환자에게 '정신 놓지 마세요'라고 붙잡는 말이에요. 뒤에 짧은 질문을 붙여 대답하는지로 의식을 확인해요.",
 '18.1': "gentle은 제세동 충격과 다르다는 걸 알리되 아프지 않다고 약속하지는 않는 말이에요. 경피 페이싱은 불편할 수 있어 진통·진정을 함께 준비해요.",
 '15.2': "while you're sedated로 충격은 진정된 뒤에 준다는 순서를 알려요. 진정 중에는 대개 충격을 느끼거나 기억하지 못해요.",
 '20.0': "SBAR의 S는 지금 무슨 일인지를 한 문장으로 말하는 칸이에요. just converted로 방금 바뀌었다는 시점을 먼저 알려요. 실제 보고에서는 환자 이름으로 누구인지 밝혀요(침상 번호는 위치일 뿐이에요).",
 '21.4': "until로 자석이 임시 조치라는 점을 알려요. 자석을 대는 동안에는 ICD가 위험한 리듬도 치료하지 않아서, 체외 제세동 패드를 붙이고 모니터로 지켜봐요.",
 '7.5': "now와 again으로 두 번 잰다는 순서를 알려 줘요. 누웠을 때와 섰을 때의 맥박과 혈압을 비교하면 자세에 따라 어떻게 달라지는지 알 수 있어요.",
 '14.5': "keep …ing로 지금 하는 일을 이어 간다고 알려요. for the next while은 정확한 시간을 정하지 않고 '당분간'이라고 말하는 표현이에요. 미국에서는 for a while이 더 흔해요.",
}
for k, v in WHY.items(): sent(k)['why'] = v

# ---- blank ----
BL = {  # key: (answer, [other three])
 '5.2': ('dizzy', ['nauseous', 'sweaty', 'shaky']),
 '7.0': ('lightheaded', ['nauseous', 'sweaty', 'breathless']),
 '7.3': ('lightheaded', ['jittery', 'flushed', 'feverish']),
 '12.1': ('Dizzy', ['Nauseous', 'Sweaty', 'Numb']),
 '15.1': ('sleepy', ['alert', 'nervous', 'numb']),
 '8.0': ('trying', ['eating', 'sleeping', 'moving']),
 '9.1': ('fainting', ['vomiting', 'choking', 'coughing']),
 '18.2': ('hear', ['see', 'feel', 'reach']),
 '10.1': ('helped', ['happened', 'changed', 'started']),
 '16.3': ('dangerously', ['slightly', 'relatively', 'mildly']),
 '17.4': ('everyone', ['nobody', 'someone', 'one person']),
 '2.3': ('untuck', ['button', 'tuck', 'unzip']),
 '18.1': ('place', ['remove', 'check', 'change']),
 '2.5': ('done', ['next', 'up', 'home']),
 '10.4': ('slowly', ['quickly', 'sharply', 'loudly']),
}
for k, (ans, oth) in BL.items():
    x = sent(k); b = x['blank']
    pos = [o['en'] for o in b['options']].index(b['answer'])  # keep answer slot
    opts = oth[:]; opts.insert(pos, ans)
    b['answer'] = ans; b['options'] = [{'en': e} for e in opts]

# ---- decoy ----
sent('10.3')['decoy'] = 'but not'
sent('3.3')['decoy'] = 'count as sugar'
sent('7.3')['decoy'] = 'when you lie down'
sent('7.5')['decoy'] = 'in the morning'
sent('5.2')['decoy'] = 'this morning'
sent('17.2')['decoy'] = 'in the past year'

# ---- distractorsKo (parsed from the review list) ----
md = open(D + 'fix-er-arrhythmia-v46.md').read()
sec = md.split('### distractorsKo')[1].split('### order')[0]
n_lines = 0
for line in sec.splitlines():
    m = re.match(r'- (\d+\.\d+) (.*)', line)
    if not m: continue
    key, rest = m.group(1), m.group(2)
    left, right = rest.split(' → ')
    right = right.split(' (')[0]
    olds = re.findall(r'`([^`]+)`', left); news = re.findall(r'`([^`]+)`', right)
    assert len(olds) == len(news) and olds, line
    dk = sent(key)['distractorsKo']
    for o, n in zip(olds, news):
        assert o in dk, (key, o, dk)
        dk[dk.index(o)] = n
    assert len(set(dk)) == 2 and sent(key)['ko'] not in dk
    n_lines += 1
print('distractorsKo lines', n_lines)

# ---- order ----
def line(si, li): return S[si]['order']['lines'][li]
l = line(21, 3)
l['en'] = "While the magnet is on, we're watching your monitor and staying right here."
l['ko'] = '자석을 대는 동안 저희가 모니터를 지켜보며 여기 함께 있을게요'
l = line(21, 1)
l['en'] = 'Those shocks mean your device is trying to fix a dangerous rhythm.'
l['ko'] = '그 충격은 장치가 위험한 리듬을 고치려는 중이라는 뜻이에요'
S[21]['order']['why'] = "먼저 공감하고, 충격이 위험한 리듬 때문이라고 설명하고, 그 충격을 멈추려고 자석을 댄다고 알리고, 자석이 붙은 동안 모니터로 지켜본다고 안심시킵니다. 'Those shocks'가 1번의 that을 받고 'those shocks'·'While the magnet is on'이 앞 줄을 가리켜 순서가 하나예요."
l = line(21, 2)
l['en'] = 'So to stop those shocks for now, the team is placing a magnet and calling cardiology.'
l['ko'] = '그래서 그 충격을 당분간 멈추려고 팀이 자석을 대고 심장내과를 부르고 있어요'
l = line(11, 2)
l['en'] = "That's a common reason, but stopping can bring the irregular rhythm back."
l['ko'] = '흔한 이유예요, 하지만 중단하면 불규칙한 리듬이 돌아올 수 있어요'
S[11]['order']['why'] = "마지막 복용을 묻고, 중단한 이유를 묻고, 중단이 리듬에 미치는 영향을 말하고, 그걸 바탕으로 해결을 제안합니다. 'I see'·'That's a common reason'(앞 줄의 대답을 받음)·'Knowing that'이 앞 줄을 가리켜 순서가 하나예요."
l = line(17, 2)
l['en'] = "So we'll avoid those medicines and choose safer ones."
l['ko'] = '그래서 그런 약은 피하고 더 안전한 약을 고를 거예요'
S[17]['order']['why'] = "팀에 알려야 한다고 말하고, 그 이유(여분의 전기 통로)를 설명하고, 그래서 피할 약을 말하고, 그것을 지키기 위해 팀원 모두가 알게 한다고 합니다. 'That's because'·'So … those medicines'·'that'이 앞 줄을 가리켜 순서가 하나예요."
l = line(13, 2)
l['en'] = 'Since that check, have you had hiccup-like twitching or dizziness?'
l['ko'] = '그 점검 이후 딸꾹질 같은 경련이나 어지럼증이 있었나요?'
S[13]['order']['why'] = S[13]['order']['why'].replace("'since the last check'", "'Since that check'")
l = line(0, 3)
l['en'] = 'For each of those, does anything seem to bring it on?'
l['ko'] = '그럴 때마다 무언가가 유발하는 것 같나요?'
assert "'that long'" in S[0]['order']['why']
S[0]['order']['why'] = S[0]['order']['why'].replace("'that long'", "'each of those'")
l = line(3, 2)
l['en'] = "All of those can speed up your heart, so let's cut back."
l['ko'] = '그 모두가 심장을 빠르게 할 수 있으니 줄여 봐요'
assert "'Both of those'" in S[3]['order']['why']
S[3]['order']['why'] = S[3]['order']['why'].replace("'Both of those'", "'All of those'")
l = line(14, 1)
l['en'] = 'To check it, I need to ask: any chest pain, fainting, or trouble breathing?'
l['ko'] = '확인하려고 여쭤볼게요, 가슴 통증이나 실신, 숨쉬기 힘든 증상이 있나요?'

# ---- context word/ko, swap ko ----
CTX = {1: ('electrode', '전극'), 3: ('OTC', '일반의약품'), 5: ('anticoagulated', '항응고 중인'),
       7: ('syncopal', '실신의'), 13: ('interrogation', '장치 점검'), 19: ('mag', '마그네슘')}
for si, (w, ko) in CTX.items():
    cs = [n for n in S[si]['nuance'] if n['kind'] == 'context']; assert len(cs) == 1
    cs[0]['word'] = w; cs[0]['ko'] = ko
sc = [n for n in S[19]['nuance'] if n['kind'] == 'context'][0]['scenes'][2]
sc['fix'] = "I'm drawing up some magnesium to protect your heart rhythm."
sw = [n for n in S[2]['nuance'] if n['kind'] == 'swap'][0]
sw['ko'] = '가슴, 팔, 다리에 작은 스티커 열 개를 붙일게요'

# ---- tag/icon ----
sent('2.5')['icon'] = 'calendar'
sent('3.5')['icon'] = 'chartup'
line(10, 2)['icon'] = 'me'

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
