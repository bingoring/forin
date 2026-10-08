import yaml
D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
F = D + 'er-dyspnea.yaml'
d = yaml.safe_load(open(F))
S = d['situations']
def sent(r):
    i, j = map(int, r.split('.')); return S[i]['sentences'][j]
def why(r, t): sent(r)['why'] = t
def blank(r, ans, opts):
    b = sent(r)['blank']; old = [o['en'] for o in b['options']].index(b['answer'])
    others = [o for o in opts if o != ans]; assert len(others) == 3
    others.insert(old, ans)
    b['answer'] = ans; b['options'] = [{'en': o} for o in others]
def decoy(r, t): sent(r)['decoy'] = t
def dko(r, idx, t): sent(r)['distractorsKo'][idx] = t

# why
why('14.3', "Let's …로 같이 해 보자고 하고 see if로 결과를 지켜보자고 말해요. 천천히 숨 쉬어 나아지면 불안이 영향을 줬을 수 있어요. 다만 나아져도 기질적 원인 검사는 끝까지 해요.")
why('12.0', "over the past few days로 기간을 한정하면 환자가 최근 변화를 떠올려 답해요. 기침이 약해졌다는 건 호흡 근육이 약해진 신호일 수 있고, 그러면 가래를 뱉어 내기 어려워져요.")
why('20.1', "bleeding a lot처럼 쉬운 말로 상황을 먼저 보고하고, 바로 할 일(suction again)을 붙여 팀이 움직이게 해요.")
why('21.1', "환자 느낌을 물어 보조로 확인하고, 흡인 카테터가 들어가는지·관 입구로 공기가 나오는지를 직접 봐요. 공기가 안 통하면 막히거나 빠졌을 수 있어요.")
why('11.4', "until help arrives처럼 도움이 올 때까지라는 기한을 주면 환자가 막연히 기다리지 않아요. 지켜보며 안전을 지킨다고 약속하면 기다리는 동안 불안이 줄어요.")
sent('0.4')['why'] = sent('0.4')['why'].replace('자세를 한 단어로', '자세를 짧은 말로')
assert '짧은 말로' in sent('0.4')['why']

# blank
blank('15.4', 'still', ['still', 'flat', 'standing', 'warm'])
blank('21.4', 'new', ['new', 'used', 'bigger', 'damaged'])
blank('5.0', 'upright', ['upright', 'still', 'sideways', 'lower'])
blank('4.0', 'high', ['high', 'low', 'mild', 'bad'])
blank('6.3', 'low', ['low', 'high', 'better', 'higher'])
blank('16.3', 'ahead', ['ahead', 'back', 'away', 'home'])
blank('15.1', 'swallow', ['swallow', 'speak', 'cough', 'lie down'])
blank('15.2', 'calm', ['calm', 'awake', 'quiet', 'upright'])
blank('8.4', 'rest', ['rest', 'tire', 'strain', 'collapse'])
blank('11.4', 'safe', ['safe', 'warm', 'quiet', 'waiting'])
blank('1.1', 'breaths', ['breaths', 'steps', 'swallows', 'sips'])

# decoy
decoy('6.4', 'back down'); decoy('9.2', 'are normal'); decoy('14.0', 'and heart rate'); decoy('19.4', 'are falling')
decoy('2.2', 'through your mouth'); decoy('4.0', 'has your cough'); decoy('16.4', 'all at once')

# distractorsKo
dko('2.2', 0, '산소 줄이 귀 뒤에서 아프지 않으세요?')
dko('12.4', 0, '오늘 식사는 잘 삼키셨어요?')
dko('8.4', 0, '마스크는 의사 선생님이 벗겨도 된다고 할 때까지 써요')
dko('8.1', 0, '숨이 차면 손을 들어 알려 주세요')
dko('15.4', 0, '침이 나오면 뱉으셔도 돼요')
dko('7.4', 1, '다리를 쭉 펴고 누워 계세요')
dko('18.2', 0, '알부테롤 네뷸라이저를 준비해 주세요')
dko('15.1', 1, '목이 언제부터 부었나요?')
dko('6.4', 0, '가래 검사를 보내 드릴게요')
dko('8.0', 0, '이 마스크는 잘 때도 쓰고 계셔야 해요')
dko('16.1', 0, '유도제와 근이완제 용량을 다시 확인하겠습니다')
dko('13.0', 1, '숨이 차면 언제든 말씀해 주세요')
dko('18.3', 1, '흡인기를 하나 더 준비해 주세요')

# tag/icon
sent('7.2')['icon'] = 'plane'; sent('18.3')['icon'] = 'scalpel'; sent('9.4')['icon'] = 'monitor'

# context
def ctx(i):
    return [n for n in S[i]['nuance'] if n['kind'] == 'context'][0]
c = ctx(1); c['word'] = 'SpO2'; c['ko'] = '산소포화도'
c = ctx(10); c['word'] = 'breath sounds'; c['ko'] = '호흡음'

# order
def L(en, icon, ko, note): return {'en': en, 'icon': icon, 'ko': ko, 'note': note}
def order(i, why_, lines):
    o = S[i]['order']; o['why'] = why_; o['lines'] = lines
def line(i, k, **kw):
    S[i]['order']['lines'][k] = L(**kw)
def owhy(i, t): S[i]['order']['why'] = t

order(0, "지금 호흡 상태를 먼저 묻고, 언제 시작됐는지 묻고, 시작된 뒤 누우면 더 힘든지 묻고, 그렇게 심해질 때 동반 증상을 묻습니다. 'it'·'Since it started'·'like that'이 앞 줄을 가리켜 순서가 하나예요.", [
    L('Are you having trouble breathing right now?', 'faceWorried', '지금 숨쉬기 힘드신가요?', '현재'),
    L('When did it start?', 'calendar', '언제 시작됐나요?', '시작'),
    L('Since it started, is it worse when you lie down?', 'me', '시작된 뒤로 누우면 더 힘든가요?', '악화'),
    L('When it gets worse like that, do you also have a cough or chest pain?', 'stetho', '그렇게 심해질 때 기침이나 가슴 통증도 있나요?', '동반')])
order(2, "산소를 낮은 유량으로 맞췄다고 먼저 알리고, 그 산소를 내보낼 갈래를 코에 넣고, 갈래를 낀 채 코로 숨 쉬기 괜찮은지 묻고, 아니거나 건조하고 조이면 조절한다고 말합니다. 'it'·'With them in'·'If not'이 앞 줄을 가리켜 순서가 하나예요.", [
    L("I've set the oxygen to a low flow, so you'll feel a little air.", 'monitor', '산소를 낮은 유량으로 맞췄어요, 바람이 조금 느껴질 거예요', '유량'),
    L('Now, the two soft prongs go just inside your nose to deliver it.', 'me', '이제 그걸 전달할 부드러운 갈래 두 개를 코 안쪽에 넣을게요', '착용'),
    L('With them in, can you breathe through your nose okay?', 'stetho', '그걸 끼고 코로 숨 쉬는 게 괜찮으세요?', '확인'),
    L("If not, or if it feels dry or tight, I'll adjust it.", 'faceWorried', '아니거나 건조하고 조이면 조절해 드릴게요', '조절')])
line(4, 3, en="Whether or not it came down, does the cough make it hard to breathe?", icon='faceWorried', ko='내렸든 아니든 기침 때문에 숨쉬기 힘든가요?', note='기침')
owhy(4, "열의 높이를 묻고, 그 열에 집에서 무엇을 했는지 묻고, 그 조치로 열이 내렸는지 묻고, 열이 내렸는지와 상관없이 기침이 숨쉬기를 방해하는지 묻습니다. 'for it'·'that'·'it came down'이 앞 줄을 가리켜 순서가 하나예요.")
order(5, "먼저 앉혀 호흡을 돕고, 앉은 뒤 청진과 산소를 같이 시작하고, 들은 소리와 가래로 폐에 물이 찼을 수 있다고 설명하고, 그래서 바로 의사에게 알립니다. 'Now that'·'with that'·'Because of the fluid'가 앞 줄을 가리켜 순서가 하나예요.", [
    L("Let's sit you upright to help you breathe.", 'me', '숨쉬기 편하게 앉혀 드릴게요', '자세'),
    L("Now that you're sitting up, I'm listening to your lungs and starting oxygen.", 'stetho', '앉으셨으니 폐 소리를 듣고 산소를 시작할게요', '청진'),
    L("I hear crackles, and with that pink, frothy cough, it may be fluid.", 'faceWorried', '물 소리가 들리고 분홍빛 거품 기침까지 있어서 물이 찬 걸 수 있어요', '설명'),
    L("Because of the fluid, I'm letting the doctor know right away.", 'speaker', '물이 찬 것 때문에 바로 의사 선생님께 알릴게요', '보고')])
order(7, "갑자기 시작됐는지 먼저 묻고, 시작되기 전의 위험 인자를 묻고, 어느 쪽이든 다리를 묻고, 다리 말고 가슴 통증을 묻습니다. 'Before it started'·'Either way'·'Besides your leg'가 앞 줄을 가리켜 순서가 하나예요.", [
    S[7]['order']['lines'][0],
    L('Before it started, had you traveled far or been stuck in bed?', 'plane', '시작되기 전에 멀리 다녀오셨거나 침대에 오래 계셨나요?', '위험'),
    L('Either way, is one of your legs more swollen or painful?', 'me', '어느 쪽이든 한쪽 다리가 더 붓거나 아픈가요?', '다리'),
    L('Besides your leg, does your chest hurt when you breathe in?', 'stetho', '다리 말고 숨을 들이쉴 때 가슴도 아픈가요?', '가슴')])
line(9, 3, en="Even with the oxygen on, we'll keep a close eye on you.", icon='shield', ko='산소를 달아도 계속 가까이서 지켜볼게요', note='관찰')
owhy(9, "수치가 낮다고 말하고, 그 수치를 다시 확인하고, 계속 낮을 때의 조치를 알리고, 산소를 달아도 계속 지켜본다고 마무리합니다. 'it'·'If it stays low'·'Even with the oxygen on'이 앞 줄을 가리켜 순서가 하나예요.")
order(11, "짧게 묻겠다고 알리고, 통증·질식감·알레르기를 하나씩 차례로 묻고, 통역사가 오고 있다고 알립니다. 'First one'·'Next one'·'Last one'이 순서를 가리켜 순서가 하나예요.", [
    S[11]['order']['lines'][0],
    L('First one: chest pain? Yes or no?', 'stetho', '첫 번째요: 가슴 통증? 예, 아니오?', '첫째'),
    L('Next one: choking feeling? Point to your throat if yes.', 'pushpin', '다음이요: 질식할 것 같은 느낌? 맞으면 목을 가리켜 보세요', '둘째'),
    L('Last one: allergy to medicine? An interpreter is on the way.', 'pill', '마지막이요: 약 알레르기? 통역사가 오고 있어요', '셋째')])
line(12, 2, en='With both of those, we need to watch your breathing muscles closely.', icon='shield', ko='그 두 가지 때문에 호흡근을 가까이서 지켜봐야 해요', note='관찰')
S[12]['order']['why'] = S[12]['order']['why'].replace('Because of that', 'both of those')
line(13, 3, en="Even with those checks, turning it all the way up wouldn't be safe for you.", icon='faceWorried', ko='그런 확인을 해도 끝까지 올리는 건 환자분께 안전하지 않아요', note='한계')
S[13]['order']['why'] = S[13]['order']['why'].replace("'Even then'", "'Even with those checks'")
line(14, 0, en="Your oxygen and lung exam look reassuring, but we'll still finish your tests.", icon='check', ko='산소 수치도 폐 진찰도 안심할 만하지만 검사는 끝까지 할게요', note='소견')
owhy(14, "검사 소견이 안심할 만해도 검사는 끝까지 한다고 알리고, 그런 결과를 두고 불안과 관련이 있는지 묻고, 그렇다면 호흡을 늦춰 보고, 시도하는 동안 불안해도 괜찮다고 말합니다. 'these'·'If it does'·'that'이 앞 줄을 가리켜 순서가 하나예요.")
owhy(16, S[16]['order']['why'].replace('진행을 허락하고', '준비 완료를 알리고'))
S[16]['order']['lines'][2]['note'] = '신호'
S[18]['order']['lines'][1] = L('While it goes in, call for the difficult airway cart and ENT.', 'speaker', '들어가는 동안 어려운 기도 카트와 이비인후과를 불러주세요', '호출')
S[18]['order']['lines'][3] = L('If her lips are still swelling after all that, get the next epinephrine dose ready.', 'pill', '그러고도 입술이 계속 붓는다면 다음 에피네프린 용량을 준비하세요', '재투여')
owhy(18, "에피네프린을 주는 동시에 기도 카트와 이비인후과를 부르고, 카트가 오면 외과적 기도 세트를 열고, 그러고도 5~15분 뒤에도 부종이 계속되면 재투여를 준비합니다. 'While it goes in'·'the cart'·'after all that'이 앞 줄을 가리켜 순서가 하나예요.")
S[20]['order']['lines'][3] = L('Call for help now — if he keeps bleeding even then, prepare to intubate.', 'speaker', '지금 도움을 요청하세요 — 그래도 계속 출혈하면 삽관을 준비하세요', '호출')
owhy(20, "많은 출혈과 흡인을 먼저 지시하고, 흡인하는 동안 측위를 잡고, 그 자세가 건강한 폐를 보호한다고 알리고, 그럼에도 출혈이 이어지면 삽관을 준비하고 도움은 지금 바로 부릅니다. 'While you suction'·'That'·'even then'이 앞 줄을 가리켜 순서가 하나예요.")
line(21, 2, en="If air still isn't moving, we'll change the tube right away.", icon='bandage', ko='그래도 공기가 안 통하면 바로 튜브를 교체할게요', note='교체')
owhy(21, "막힌 곳을 흡인한다고 알리고, 흡인한 뒤 공기가 통하는지 묻고, 그래도 공기가 안 통하면 교체한다고 알리고, 교체할 때까지 산소로 안심시킵니다. 'it'·'still'·'Until then'이 앞 줄을 가리켜 순서가 하나예요.")

yaml.safe_dump(d, open(F, 'w'), allow_unicode=True, sort_keys=False, width=1000)
