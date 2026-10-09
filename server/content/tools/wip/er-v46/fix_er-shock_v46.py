import yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-shock.yaml'
d = yaml.safe_load(open(F))
S = d['situations']


def sent(key):
    s, j = key.split('.')
    return S[int(s)]['sentences'][int(j)]


def f(key, **kw):
    s = sent(key)
    for k, v in kw.items():
        assert k in s, (key, k)
        s[k] = v


def sub(key, field, old, new):
    s = sent(key)
    assert old in s[field], (key, field, old)
    s[field] = s[field].replace(old, new)


def blank(key, answer, others):
    """answer 자리는 기존 정답 위치를 유지, 나머지는 others 순서대로."""
    b = sent(key)['blank']
    pos = [o['en'] for o in b['options']].index(b['answer'])
    it = iter(others)
    b['options'] = [{'en': answer} if k == pos else {'en': next(it)} for k in range(4)]
    b['answer'] = answer
    assert len({o['en'] for o in b['options']}) == 4
    assert all(set(o) == {'en'} for o in b['options'])


# ---------------- why (11)
f('18.1', why='명사구와 지시를 짧게 이어 급박한 말투를 보여 줘요. 혈액형을 확인하기 전에는 교차시험 없이 O형 혈액을 쓰고(가임기 여성은 O형 음성), 굵은 정맥로 두 개로 빠르게 넣어요.')
sub('14.1', 'why', '열은 감염, 출혈, 가슴 통증은 심장, 새 약은 약물 반응으로 저혈압의 서로 다른 원인을 한 번에 훑어요.',
    '열은 감염, 출혈은 혈액 손실, 가슴 통증은 심장, 새 약은 약물 반응 — 저혈압의 서로 다른 원인을 한 번에 훑어요.')
sub('20.2', 'why', '승압제가 둘 필요한 환자는 중환자실 수준의 감시와 중심 라인이 필요해 입실을 권해요.',
    '승압제를 둘이나 쓰는 환자는 중환자실 수준의 집중 감시가 필요해 입실을 권해요.')
sub('10.4', 'why', '중심정맥관은 약이 큰 혈관으로 바로 들어가 빨리 퍼져요.',
    '중심정맥관은 큰 혈관으로 바로 들어가 약이 새어 조직을 상하게 할 위험이 적고, 효과도 고르게 나요.')
f('14.4', why='first, then으로 다음 단계를 알려 환자가 기다리는 이유를 알게 해요. 영상 검사는 결과를 보고 의사가 정해요.')
sub('15.1', 'why', '가능한 한 빨리 늦어도 한 시간 안에', '가능한 한 빨리, 이상적으로는 한 시간 안에')
sub('20.3', 'why', '가장 강한 근거예요', '분명한 신호예요')
f('5.1', why='any로 종류를 가리지 않고 묻는 거예요. 항응고제는 출혈을 오래 끌 수 있어서 출혈 환자에게 꼭 확인해요.')
sub('3.4', 'why', '마시는 양을 지켜본다고 하면 감시가 아니라 돌봄으로 들려요.', '마시는 양을 우리가 챙긴다고 알려요.')
f('2.3', why='if needed로 지금은 수액이지만 필요하면 약도 같은 길로 줄 수 있다고 알려요. 그래서 굵은 정맥로 하나를 미리 잡아 두면 위급할 때 다시 바늘을 찌르지 않아도 돼요.')
sub('6.4', 'why', '단정과 환자 탓을 피해요', '단정을 피해요')

# ---------------- 빈칸 (13)
blank('6.4', 'confused', ['shaky', 'cold', 'thirsty'])
blank('5.4', 'draw', ['cancel', 'order', 'review'])
blank('18.4', 'running', ['labeled', 'clamped', 'paused'])
blank('9.0', 'up', ['down', 'off', 'out'])
blank('12.3', 'once', ['three times', 'hard', 'gently'])
blank('12.4', 'interpreter', ['doctor', 'pharmacist', 'chaplain'])
blank('21.3', 'plan', ['reason', 'refill', 'warning'])
blank('12.0', 'Bleeding', ['Swelling', 'Bruising', 'Rash'])
blank('11.3', 'quietly', ['visibly', 'rarely', 'suddenly'])
blank('18.1', 'O-negative', ['AB-positive', 'A-negative', 'B-positive'])
blank('4.4', 'arms', ['legs', 'hips', 'ribs'])
blank('15.1', 'broad-spectrum', ['narrow-spectrum', 'oral', 'topical'])
blank('15.4', 'blood pressure', ['temperature', 'blood sugar', 'urine output'])

# ---------------- decoy (2)
f('5.4', decoy='for your surgery')
f('12.1', decoy='Can you walk')

# ---------------- distractorsKo (24문장)
dko = {
    '2.1': ['수액은 한 시간쯤 들어가요', '수액이 들어가는 동안 혈압을 자주 잴게요'],
    '9.2': ['호전되면 수액 속도를 줄일게요', '수액을 잠시 쉬고 지켜볼게요'],
    '11.3': ['검사 결과가 나오면 바로 알려 드릴게요', '배가 아프거나 불러 오면 바로 말씀해 주세요'],
    '13.0': ['드시는 약 목록을 가지고 오셨어요?', '오늘 드신 음식을 말씀해 주시겠어요?'],
    '15.3': ['약국에 신장 수치를 알려 주세요', '약국에서 용량을 확인받으세요'],
    '15.4': ['소변 주머니를 비우고 양을 적어 주세요', '체온을 한 시간마다 재 주세요'],
    '16.3': ['산소를 더 올려 주세요', '보호자에게 상황을 알려 주세요'],
    '17.1': ['엑스레이를 가져오고 흉관 키트를 요청하세요', '심장내과에 연락하고 수액을 올리세요'],
    '18.1': ['혈액 가온기를 연결하세요', '칼슘을 준비해 두세요'],
    '18.4': ['혈액이 오면 두 사람이 확인하세요', '혈압을 5분마다 알려 주세요'],
    '19.2': ['수액을 멈추고 승압제만 쓰세요', '수액과 함께 혈액도 준비하세요'],
    '19.4': ['맥박이 더 느려지면 아트로핀을 줄게요', '목은 계속 움직이지 않게 할게요'],
    '20.2': ['승압제 용량을 더 올리기를 권합니다', '일반 병동 입원을 권고합니다'],
    '20.4': ['제 생각엔 승압제를 하나 더 써야 할 것 같아요', '제 생각엔 그녀가 수술이 필요해 보여요'],
    '21.2': ['혈당을 먼저 재 볼게요', '진통제와 수액을 드릴게요'],
    '21.4': ['혈압을 15분마다 잴게요', '가족분께 연락드릴게요'],
    '4.4': ['어디가 제일 아프신지 짚어 주세요', '다친 곳에는 얼음을 대 드릴게요'],
    '12.1': ['물 마실 수 있어요? 예, 아니오?', '어제부터 아팠어요?'],
    '17.2': ['심낭천자 동의서를 받아 주세요', '승압제를 준비해 주세요'],
    '18.3': ['혈압이 80까지 떨어졌어요', '구토를 하고 얼굴이 붉어요'],
    '16.4': ['의사에게 알리고 검사 결과를 기다리세요', '약국에 혈전용해제 용량을 물어보세요'],
    '17.3': ['목에 멍이 들었고 숨소리가 약해요', '맥이 빠르고 팔다리가 차요'],
    '19.3': ['빠른 맥박과 낮은 혈압은 출혈 쇼크를 시사해요', '열과 낮은 혈압은 패혈증 쇼크를 시사해요'],
    '20.1': ['체온이 올랐고 호흡수는 느려졌어요', '혈당이 떨어지고 칼륨이 올라가고 있어요'],
}
assert len(dko) == 24
for k, v in dko.items():
    assert len(v) == 2 and v[0] != v[1] and sent(k)['ko'] not in v
    f(k, distractorsKo=v)

# ---------------- order (15장)
def line(si, li, en, ko, note=None, icon=None):
    L = S[si]['order']['lines'][li]
    L['en'] = en
    L['ko'] = ko
    if note:
        L['note'] = note
    if icon:
        L['icon'] = icon


def owhy(si, why):
    S[si]['order']['why'] = why


line(1, 1, 'Since that started, how much have you been drinking each day?', '그게 시작된 뒤로 하루에 물을 얼마나 드셨어요?')
line(1, 2, "Not drinking enough can do that, so I'll check your pressure lying down, then standing.", '물을 덜 드시면 그럴 수 있어서, 누워서 재고 이어서 서서 잴게요')
owhy(1, "증상이 언제 나는지 먼저 묻고, 그 증상이 시작된 뒤의 수분 섭취를 묻고, 물을 덜 마시면 그럴 수 있다며 측정 방법을 알리고, 숫자가 나온 뒤 교육으로 마칩니다. 'that started'·'do that'·'those numbers'가 앞 줄을 가리켜 순서가 하나예요.")

line(4, 3, "Even if you didn't, let's check your head and arms for any injury.", '안 다치셨더라도 머리와 팔에 다친 데가 있는지 볼게요')
owhy(4, "전조를 묻고, 목격자를 확인하고, 다쳤는지 묻고, 다치지 않았다고 해도 살펴본다고 이어요. 'Thanks for that'·'Whether or not anyone saw it'·'Even if you didn't'가 앞 줄을 가리켜 순서가 하나예요.")

line(6, 2, "While you think about that, we're starting fluids and drawing cultures and lactate.", '생각하시는 동안 수액을 시작하고 배양·젖산을 채취할게요', '채취')
line(6, 3, "Once the cultures are drawn, we'll start antibiotics right away.", '배양 채취가 끝나면 바로 항생제를 시작할게요', '항생제', 'pill')
owhy(6, "걱정을 전하고, 감염원을 묻고, 생각하는 동안 수액을 시작하고 배양·젖산을 채취한다고 알리고, 배양이 끝나면 바로 항생제를 시작한다고 이어요. 'it'·'that'·'the cultures'가 앞 줄을 가리켜 순서가 하나예요.")

line(7, 1, "Pressure like that needs urgent attention, so we're getting an ECG now.", '그런 압박감은 급히 봐야 해서 지금 심전도를 찍을게요')
owhy(7, "통증이 퍼지는지 묻고, 그런 압박감은 급하다고 알리며 심전도를 시작하고, 심전도가 도는 동안 호흡을 묻고, 답을 받아 청진으로 넘어가요. 'like that'·'the ECG'·'that helps'가 앞 줄을 가리켜 순서가 하나예요.")

line(8, 1, "That could be a serious reaction, so I'm giving epinephrine in your thigh now.", '심한 반응일 수 있어서 지금 허벅지에 에피네프린을 놓을게요')

line(9, 1, "That's a good sign, so we'll recheck it in fifteen minutes.", '좋은 신호예요, 15분 뒤 다시 잴게요')
line(9, 2, "Until then, we're also watching your urine output.", '그때까지 소변량도 지켜볼게요')
line(9, 3, "If neither keeps improving, we'll add another treatment.", '둘 다 더 나아지지 않으면 다른 치료를 더할게요')
owhy(9, "수액 뒤의 혈압을 전하고, 좋은 신호라며 재측정을 예고하고, 그때까지 소변량도 본다고 하고, 둘 다 더 나아지지 않으면 치료를 더한다고 마무리해요. 'That'·'Until then'·'neither'가 앞 줄을 가리켜 순서가 하나예요.")

line(11, 2, "Even without any of those, we're checking your blood count and clotting now.", '그런 일이 없었더라도 혈구 수와 응고 기능은 지금 확인할게요')
owhy(11, "약 이름과 마지막 복용 시각을 묻고, 그 뒤로 출혈 징후를 묻고, 징후가 없어도 검사를 알린 뒤, 검사를 하는 이유를 설명해요. 'since then'·'those'·'That's because'가 앞 줄을 가리켜 순서가 하나예요.")

line(13, 3, 'If so, that could explain why you feel so dizzy.', '그렇다면 그래서 많이 어지러우신 걸 수 있어요')

line(14, 2, "To sort all of that out, we're running labs and an ECG.", '그걸 가려내려고 피검사와 심전도를 할게요')
owhy(14, "마지막으로 괜찮았던 때부터 묻고, 그 뒤의 증상을 훑고, 그걸 가려내려고 검사를 진행하고, 결과가 나오면 영상 여부를 정한다고 이어요. 'Since then'·'all of that'·'those results'가 앞 줄을 가리켜 순서가 하나예요.")

line(15, 2, "While you recheck it, I'll call the pharmacy and get antibiotics moving.", '그걸 다시 확인하는 동안 저는 약국에 연락해서 항생제를 준비시킬게요')
line(15, 3, 'While both are going in, keep checking her blood pressure every few minutes.', '둘 다 들어가는 동안 몇 분마다 혈압을 계속 확인하세요')
owhy(15, "승압제를 시작하라고 지시하고, 그것이 돌아가면 젖산과 목표 혈압을 확인하게 하고, 젖산을 다시 보는 동안 약국에 연락해 항생제를 서두르고, 승압제와 항생제가 들어가는 동안 혈압 확인을 이어 가게 해요. 'it'·'it(젖산)'·'both'가 앞 줄을 가리켜 순서가 하나예요.")

line(16, 1, 'To check that, get a bedside echo to look at the right heart.', '그걸 확인하려면 침상 초음파로 우심장을 보세요')
owhy(16, "의심을 말하고, 그것을 확인하려고 초음파를 가져오게 하고, 결과와 상관없이 팀을 부르며 혈전용해에 대비하고, 팀이 올 때까지 감시를 맡겨요. 'To check that'·'the echo'·'they'가 앞 줄을 가리켜 순서가 하나예요.")

line(17, 2, 'If it confirms tamponade, get the kit ready — we may need to drain now.', '그게 심장압전이면 키트를 준비하세요 — 지금 배액해야 할 수 있어요')

line(17, 3, 'While we prepare that drain, give a fluid bolus.', '그 배액을 준비하는 동안 수액 볼루스를 주세요')
owhy(17, "소견을 보고하고, 그 소견을 근거로 초음파와 키트를 부르고, 초음파로 확인되면 배액 준비를 지시하고, 그 배액을 준비하는 동안 수액을 줍니다. 'those findings'·'it'·'that drain'이 앞 줄을 가리켜 순서가 하나예요.")

line(18, 3, 'While those lines run, call GI for emergent endoscopy.', '그 라인들이 도는 동안 응급 내시경을 위해 소화기내과에 연락하세요')
owhy(18, "상태를 보고하고, 그 상태를 근거로 프로토콜을 가동하고, 그 혈액을 받을 정맥로를 유지하고, 라인이 도는 동안 내시경을 요청합니다. 'Given that'·'receive it'·'those lines'가 앞 줄을 가리켜 순서가 하나예요.")

line(20, 2, 'Because of those changes, we added a second pressor, but her pressure keeps dropping.', '그 변화들 때문에 승압제를 하나 더했는데도 혈압이 계속 떨어져요')
owhy(20, "상황을 말하고, 그 치료 뒤의 변화를 보고하고, 그 변화 때문에 승압제를 더했는데도 혈압이 떨어진다고 평가한 뒤, 권고로 마칩니다. 'that'·'those changes'·'the second pressor'가 앞 줄을 가리켜 순서가 하나예요.")
S[20]['order']['tag'] = '보고 흐름'

line(21, 3, "After the hydrocortisone works, remember: don't stop steroids suddenly without a plan.", '하이드로코르티손이 효과를 내면 기억하세요: 스테로이드를 계획 없이 갑자기 끊지 마세요')

# ---------------- context (1)
for n in S[3]['nuance']:
    if n.get('kind') == 'context':
        assert n['word'] == 'fluid'
        n['word'] = 'volume-depleted'
        n['ko'] = '체액이 부족한'

# ---------------- tag·icon (2)
f('0.3', icon='monitor')

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
