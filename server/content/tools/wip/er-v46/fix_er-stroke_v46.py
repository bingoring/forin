import yaml
P = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-stroke.yaml'
d = yaml.safe_load(open(P))
S = d['situations']

def sent(i, j): return S[i]['sentences'][j]
def line(i, k, **kw):  # k = 1..4
    l = S[i]['order']['lines'][k - 1]
    for a, b in kw.items(): l[a] = b
def ow(i, w): S[i]['order']['why'] = w

# ---- order ----
line(0, 2, en='Good. Now hold both arms straight out.', ko='좋아요, 이제 양팔을 앞으로 쭉 뻗어 보세요')
ow(0, '얼굴 확인으로 시작하고, 이어서 팔을 뻗게 하고, 팔을 든 채 말하기를 보고, 마지막에 팔을 내리게 한 뒤 전체 증상이 시작된 시각을 물어요. First가 첫 줄을, While your arms are up이 팔과 말 줄을 잡아 순서가 하나예요.')
line(1, 4, en="Either way, I'll need that person's phone number so we can confirm the time.", ko='어느 쪽이든 시각을 확인하게 그분 전화번호가 필요해요')
ow(1, '마지막 정상 시각을 묻고, 그 시각에 함께 있던 사람을 찾고, 그 사람이 이후에 봤는지 확인한 뒤, 어느 쪽이든 연락처를 받아요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')
line(2, 4, en="Once all of that is done, I'll recheck your sugar.", ko='그게 다 끝나면 혈당을 다시 확인할게요')
line(6, 3, en='Before we use it, any surgery or bleeding in the past two weeks?')
line(7, 3, en="Along with the double vision, does the room feel like it's spinning?", ko='겹쳐 보이는 것과 함께 방이 도는 것처럼 느껴지세요?')
ow(7, '겹쳐 보이는지 먼저 묻고, 둘로 보이면 한쪽 눈을 가려 보게 하고, 복시와 함께 방이 도는지 묻고, 이 증상들이 뇌졸중일 수 있다고 알려요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')
line(8, 3, en='Either way, when exactly did you notice the weakness this morning?', ko='어느 쪽이든 오늘 아침 위약감을 정확히 언제 알아챘나요?')
line(8, 4, en='Since that still leaves the start time unclear, the scan will guide us.', ko='그래도 시작 시각이 불분명하니 촬영이 판단에 도움이 될 거예요')
ow(8, '잠든 시각을 묻고, 그 뒤 밤중에 정상으로 깼는지 확인하고, 어느 쪽이든 아침에 증상을 알아챈 시각을 묻고, 그래도 시작 시각이 불분명하면 영상으로 판단한다고 알려요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')
line(9, 3, en='Are you taking any blood thinners?', ko='항응고제를 복용하고 계신가요?')
line(9, 4, en='Last, do you know if you have any bleeding disorders?', ko='마지막으로, 출혈 장애가 있는지 아세요?')
ow(9, '질문하는 이유를 알리고, 뇌출혈 병력을 먼저 묻고, 항응고제를 묻고, 마지막에 출혈 질환을 물어요. First와 Last가 처음과 끝을 잡아 순서가 하나예요.')
line(10, 2, en='For those questions, blink twice for yes and once for no.', ko='그 질문에는 예이면 두 번, 아니오면 한 번 깜빡여 주세요')
line(11, 4, en="Either way, let's check when you took your last dose.", ko='어느 쪽이든 마지막 복용 시각을 확인해 봐요')
ow(11, '병력 기간을 묻고, 그 병 때문에 항응고제를 쓰는지 묻고, 그렇다면 거른 적이 있는지 묻고, 거른 적이 있든 없든 마지막 복용 시각을 확인해요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')
line(12, 3, en='Besides that time, do you know your most recent INR value?', ko='그 시각 말고, 최근 INR 수치를 아세요?')
line(12, 4, en="If it's high and bleeding is severe, we may need to reverse it.", ko='그게 높고 출혈이 심하면 약효를 되돌려야 할 수 있어요')
ow(12, '약 이름과 용량을 묻고, 그 약의 마지막 복용 시각을 묻고, 와파린이면 INR을 묻고, INR이 높고 출혈이 심하면 약효를 되돌려야 할 수 있다고 알려요. 뒤 줄이 앞 줄의 답을 가리켜서 순서가 하나예요.')
line(14, 4, en='Whatever that number shows, tell me right away if your vision changes or headache worsens.', ko='그 수치가 어떻든 시야가 변하거나 두통이 심해지면 바로 알려 주세요')
ow(14, '치료 전에 혈압을 낮춰야 한다고 알리고, 그 목표를 위해 약을 쓴다고 하고, 약이 들어간 뒤 일정 시간 뒤 재측정을 예고하고, 수치가 어떻든 시야나 두통 변화를 바로 알려 달라고 해요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')
line(15, 2, en='That warning was likely a mini-stroke, and it can happen again.', ko='그 경고는 미니 뇌졸중이었을 가능성이 높고 다시 올 수 있어요')
line(15, 3, en='To keep it from happening again, we need tests to find the cause.', ko='다시 오지 않게 하려면 원인을 찾을 검사가 필요해요')
ow(15, '증상이 지나갔어도 경고였다고 알리고, 그 경고가 미니 뇌졸중일 가능성과 재발을 말하고, 재발을 막으려면 검사가 필요하다고 이유를 잇고, 집에 가면 그 검사를 못 하니 남아 달라고 해요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')
line(16, 3, en="If you vomit during that, we'll turn you on your side for your airway.", ko='그러는 중 토하면 기도를 위해 옆으로 돌려 드릴게요')
line(16, 4, en='On your side now, can you squeeze my hand and open your eyes?', ko='이제 옆으로 누우셨으니 제 손을 쥐고 눈을 떠 보실 수 있나요?')
ow(16, '의식을 붙잡는 말로 시작하고, 그동안 혈압약을 쓴다고 알리고, 치료 중 구토하면 옆으로 돌려 기도를 지키고, 옆으로 누운 상태에서 반응을 다시 확인해요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')
line(17, 3, en='Now that the doctor has explained all of that, we need your consent.', ko='의사가 그 설명을 마쳤으니 동의가 필요해요')
ow(17, '시술이 필요한 이유를 알리고, 그 시술이 어떻게 혈류를 되돌리는지 설명한 뒤, 의사의 설명이 끝난 뒤 서명을 요청하고, 서명이 끝나면 시술실로 이송해요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')
line(18, 3, en="Now that it's stopped, we need an urgent head scan to check for bleeding.", ko='멈췄으니 출혈을 확인하려고 긴급 두부 촬영이 필요해요')
line(20, 4, en='Given that increase, the tPA is stopped and a stat CT is ordered.', ko='그 상승 때문에 tPA를 멈췄고 응급 CT를 냈어요', icon='siren', note='조치')
ow(20, '누구에 대한 보고인지 밝히고, 그 환자의 시각 정보를 말하고, 그 이후의 점수 변화를 이어 말한 뒤, 그 증가 때문에 투여를 멈추고 응급 CT를 냈다고 알려요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')
line(21, 2, en='One cause is a torn neck artery—did you have any neck injury?', ko='원인 하나는 목 동맥이 찢어지는 것인데, 목을 다친 적이 있나요?')
line(21, 3, en='Either way, when did the neck pain start compared to the numbness?', ko='어느 쪽이든 목 통증은 무감각과 비교해 언제 시작됐나요?')
line(21, 4, en="To check for that tear, we'll image the neck vessels.", ko='그 찢어짐을 확인하려고 목 혈관을 촬영할게요')
ow(21, '젊은 환자라 다른 원인을 찾는다고 알리고, 그 원인 중 하나로 목 동맥을 들어 외상을 묻고, 외상 여부와 상관없이 통증이 언제 시작됐는지 묻고, 그 찢어짐을 확인하려고 목 혈관을 촬영해요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')
line(22, 4, en="While they're on their way, I'll stay right here and keep checking his pupils.", ko='그들이 오는 동안 제가 곁에서 계속 동공을 확인할게요')
ow(22, '감시 중에 동공이 커진 것을 알리고, 그 변화가 뇌압 상승일 수 있어 팀을 부른다고 하고, 팀이 오는 동안 곁에서 계속 지켜본다고 알려요. 뒤 줄이 앞 줄을 가리켜서 순서가 하나예요.')

# ---- why ----
sent(22, 4)['why'] = '동공 변화는 뇌압이 이미 많이 올랐다는 신호라, 의식 수준과 함께 간격을 정해 반복해서 봐요. for now는 지금 상태에 한정한 지시이며 의사 지시에 따라 바뀔 수 있어요.'
sent(3, 0)['why'] = '응급 두부 CT는 먼저 출혈이 있는지를 가려요. 초기 경색은 CT에 잘 안 보일 수 있지만, 출혈이 없어야 혈전용해제를 쓸 수 있어요.'
sent(4, 2)['why'] = '병원 선별 도구에 따라 양은 다르지만, small sip으로 시작하면 한 번에 많이 마시지 않아 기도로 넘어가도 위험이 작아요. 기침은 물이 기도 쪽으로 들어갔다는 신호일 수 있어요.'
sent(1, 6)['why'] = '마지막 정상 시각은 환자를 가장 나중에 본 사람의 진술로 정해요. the most recent로 "마지막으로 본 사람"을 한 번에 짚어요.'
sent(7, 3)['why'] = '한쪽 눈을 가렸을 때 사라지는지는 복시의 원인이 눈 자체인지 두 눈의 협응인지 가르는 단서예요. 사라지면 두 눈의 정렬 문제(뇌간·뇌신경 쪽), 그대로면 눈 자체의 문제를 먼저 생각해요.'

# ---- blank ----
def opts(i, j, old, new):
    b = sent(i, j)['blank']
    for o in b['options']:
        if o['en'] == old:
            o['en'] = new; break
    else:
        raise SystemExit(('missing opt', i, j, old))
    if b['answer'] == old: b['answer'] = new
opts(2, 5, 'normal', 'elevated'); opts(2, 5, 'unsteady', 'unstable')
opts(10, 4, 'exactly', 'clear'); opts(10, 4, 'always', 'finished'); opts(10, 4, 'not', 'right'); opts(10, 4, 'really', 'comfortable')
opts(9, 5, 'free', 'effective'); opts(9, 5, 'cheap', 'available')
opts(3, 1, 'costly', 'uncomfortable'); opts(5, 2, 'price', 'size'); opts(5, 6, 'costs', 'doses'); opts(6, 6, 'costs', 'benefits')
opts(4, 6, 'visitors', 'doctors'); opts(4, 6, 'patients', 'therapists')
opts(20, 6, 'room', 'vitals'); opts(20, 6, 'diet', 'pressure')
opts(22, 6, 'dietitian', 'radiologist'); opts(22, 6, 'chaplain', 'cardiologist')
opts(5, 5, 'easy', 'long')

# ---- decoy ----
def decoy(i, j, old, new):
    assert sent(i, j)['decoy'] == old, (i, j, sent(i, j)['decoy'])
    sent(i, j)['decoy'] = new
decoy(12, 6, 'tomorrow', 'to the pharmacy')
decoy(1, 5, 'to send a bill', 'to send your results')
decoy(5, 6, 'your bill', 'your weight')
decoy(9, 5, 'for the bill', 'for the pharmacy')
decoy(15, 5, 'your bill for', 'of a heart attack')

# ---- distractorsKo ----
def dko(i, j, old, new):
    L = sent(i, j)['distractorsKo']
    assert old in L, (i, j, old, L)
    L[L.index(old)] = new
dko(1, 2, '어젯밤에 식사를 하셨나요?', '그가 어젯밤 몇 시에 잠자리에 들었나요?')
dko(2, 6, '수액을 걸어 드릴게요', '혈당이 오를 때까지 옆에 있을게요')
dko(6, 3, '오른쪽 팔의 맥박이 약해요', '오른쪽 입꼬리가 처져 보여요')
dko(8, 6, '밤에 같이 주무신 분이 계셨나요?', '밤에 화장실에 몇 번 가셨나요?')
dko(9, 0, '약을 먹고 출혈이 있었던 적이 있나요?', '최근에 치과 치료를 받으셨나요?')
dko(14, 5, '시야가 좋아지면 알려 주세요', '팔다리에 힘이 빠지면 알려 주세요')
dko(20, 4, '혈압은 안정적이었고 혈당도 정상이었습니다', '산소포화도는 98%였고 산소는 쓰지 않았습니다')
dko(7, 6, '이 증상은 대부분 곧 사라져요', '이 증상은 귀 문제일 수도 있어요')
dko(7, 6, '이 증상은 약만 드시면 돼요', '걷기 검사를 한 번 더 해 볼게요')
dko(10, 0, '눈을 깜빡이지 말고 가만히 계세요', '고개를 끄덕여서 대답해 주세요')
dko(11, 3, '빠른 심장박동은 위험하지 않아요', '혈압이 높으면 혈관이 약해질 수 있어요')
dko(11, 4, '그 혈전은 혈액검사에서 바로 보여요', '심전도로 리듬을 계속 지켜볼게요')
dko(11, 5, '약은 증상이 있을 때만 드시면 돼요', '약은 매일 같은 시간에 드세요')
dko(12, 4, 'INR이 높으면 혈전이 더 잘 생겨요', 'INR은 피가 굳는 데 걸리는 시간을 보여 줘요')
dko(12, 4, 'INR이 높으면 약을 한 알 더 드셔야 해요', '지금 피를 뽑아 INR을 다시 볼게요')
dko(14, 2, '약을 드시면 알려 주세요', '숨이 차면 바로 말씀해 주세요')
dko(14, 3, '혈전 치료는 수치와 상관없이 시작해요', '혈압약은 정맥으로 들어가요')
dko(14, 4, '혈압이 괜찮으면 퇴원할 수 있어요', '혈압약이 들어가면 조금 어지러울 수 있어요')
dko(14, 6, '갑작스러운 두통은 진통제만 드시면 돼요', '두통이 언제 시작됐는지 기록할게요')
dko(15, 5, '치료받지 않으면 약이 부족해요', '치료 계획은 신경과 의사가 정해요')
dko(16, 0, '눈을 감고 천천히 숨을 쉬세요', '지금 어디가 제일 아프세요?')
dko(17, 2, '동의서는 시술 후에 받을게요', '시술 의사가 곧 와서 설명할 거예요')
dko(17, 5, '치료 시간이 지날수록 비용이 올라가요', '시술은 한두 시간쯤 걸려요')
dko(21, 4, '이런 뇌졸중은 나이가 많을 때만 생겨요', '목 통증이 심해지면 바로 말씀해 주세요')
dko(22, 3, '이런 일은 며칠에 걸쳐 서서히 좋아져요', '뇌압을 낮추려고 침대 머리를 올릴게요')
dko(22, 3, '이런 일은 약을 먹으면 바로 가라앉아요', '의사가 곧 와서 동공을 다시 볼 거예요')
dko(22, 5, '동공이 한쪽만 커지면 반드시 눈 질환이에요', '동공 크기를 기록해 둘게요')

# ---- context word/ko ----
# context word/ko (C1) 11건은 적용하지 않음 — 검사기 W14(세 장면 모두에 word)와 어긋남. 보고서 참고.

# ---- icon ----
assert sent(2, 4)['icon'] == 'gear'; sent(2, 4)['icon'] = 'monitor'
assert sent(10, 6)['icon'] == 'gear'; sent(10, 6)['icon'] = 'me'

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('fixed')
