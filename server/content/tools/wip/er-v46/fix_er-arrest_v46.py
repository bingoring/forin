"""er-arrest v46 수정 — fix-er-arrest-v46.md 항목을 er-arrest.yaml에 제자리 반영한다."""
import yaml, random

D = '/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
P = D + 'er-arrest.yaml'
d = yaml.safe_load(open(P))
S = d['situations']


def sent(i, j):
    return S[i]['sentences'][j]


def set_blank(i, j, answer, others):
    s = sent(i, j)
    opts = [answer] + others
    assert len(opts) == 4
    rnd = random.Random(f'{i}.{j}')
    rnd.shuffle(opts)
    s['blank'] = {'answer': answer, 'options': [{'en': o} for o in opts]}


# ---------------------------------------------------------------- 빈칸 (17)
set_blank(0, 3, 'breathing', ['bleeding', 'swelling', 'sweating'])
set_blank(6, 2, 'reassess', ['intubate', 'transfer', 'sedate'])
set_blank(19, 0, 'confirmed', ['questioned', 'ignored', 'overridden'])
set_blank(20, 3, 'first', ['quickly', 'briefly', 'partly'])
set_blank(11, 4, 'keep', ['start', 'try', 'stop'])
set_blank(12, 4, 'shocks', ['doses', 'breaths', 'boluses'])
set_blank(11, 1, 'explain', ['watch', 'hear', 'follow'])
set_blank(18, 1, 'fix', ['chart', 'watch', 'explain'])
set_blank(20, 2, 'fixing', ['charting', 'explaining', 'discussing'])
set_blank(19, 2, 'sorry', ['glad', 'proud', 'relieved'])
set_blank(9, 2, 'ICU', ['floor', 'PACU', 'OR'])
set_blank(8, 2, 'medications', ['fluids', 'blood', 'labs'])
set_blank(15, 0, 'dialysis', ['insulin', 'therapy', 'rehab'])
set_blank(5, 2, 'Shock', ['Epi', 'Breath', 'Dose'])
set_blank(9, 3, 'monitor', ['chart', 'clock', 'door'])
set_blank(9, 1, 'above', ['below', 'at', 'near'])
set_blank(4, 2, 'no one', ['everyone', 'someone', 'the family'])

# ---------------------------------------------------------------- decoy (15)
DECOY = {
    (19, 2): "I'm so glad",
    (3, 2): 'the stomach to rise',
    (4, 0): 'the right armpit',
    (7, 3): 'his glucose level',
    (9, 2): 'to the floor',
    (9, 4): 'to the OR',
    (10, 3): 'in the field',
    (11, 1): 'where to wait',
    (12, 1): 'by the family',
    (15, 1): 'to lower the potassium',
    (18, 1): 'getting his pulse back',
    (18, 2): 'to the CT scanner',
    (18, 4): 'losing blood',
    (19, 1): 'his labs',
    (20, 2): 'the monitor',
}
for (i, j), v in DECOY.items():
    sent(i, j)['decoy'] = v

# ---------------------------------------------------------------- distractorsKo
# 값이 문자열이면 [index]를 그 하나로, 리스트면 두 개 모두 교체한다. 키는 (상황, 문장, index|None)
DK1 = {  # (i, j, idx): new
    (0, 3, 0): '모니터 패드를 먼저 붙여 주세요',
    (1, 3, 1): '압박은 2분마다 교대해 주세요',
    (3, 1, 1): '마스크를 한 치수 큰 걸로 바꿔요',
    (3, 2, 0): '흡인기를 켜 둬 주세요',
    (3, 4, 0): '입인두 기도기를 넣어 볼게요',
    (4, 3, 1): '약 패치가 있으면 먼저 떼어 주세요',
    (5, 1, 1): '아미오다론 300을 준비해 주세요',
    (5, 4, 1): '다음 리듬 확인 때 압박자를 바꿔요',
    (6, 1, 0): '투여 시각을 기록해 주세요',
    (7, 3, 1): '혈당도 같이 재 주세요',
    (7, 4, 0): '가족에게 복용 중인 약을 여쭤봐 주세요',
    (8, 1, 1): '골내로에 가압백을 연결할게요',
    (8, 2, 1): '에피네프린 지금 들어가요',
    (9, 0, 1): '산소포화도는 92~98%를 목표로 해요',
    (9, 1, 1): '체온 관리를 준비해 주세요',
    (9, 3, 1): '수축기혈압이 85예요',
    (10, 0, 0): '정맥로는 오른팔에 있어요',
    (10, 2, 1): '무수축이고, 압박 중이에요',
    (10, 3, 0): '다음 에피는 1분 뒤예요',
    (10, 4, 0): '기록자에게 시각을 확인해 주세요',
    (11, 3, 1): '의자를 가져다 드릴게요',
    (13, 3, 0): '모니터에 압박 중단 시간이 길다고 나와요',
    (15, 3, 1): '투석 혈관이 어느 쪽 팔인지 물어보세요',
    (16, 3, 0): '누군가 시각을 기록해 주세요',
    (16, 4, 0): '자궁을 계속 왼쪽으로 밀고 있어요',
    (18, 0, 1): '에피네프린 다음 투여 시각을 알려 주세요',
    (18, 1, 1): '심장내과 선생님을 불러 주세요',
    (18, 3, 1): '리듬은 다시 심실세동이에요',
    (19, 0, 0): '가족분이 지금 오고 계세요',
    (19, 1, 1): '원하시면 곁에 계셔도 돼요',
    (19, 3, 0): '궁금한 게 있으면 언제든 물어보세요',
}
DK2 = {  # (i, j): [new0, new1]
    (2, 1): ['압박 사이에 가슴이 다 올라오게 하세요', '30번 누르고 두 번 불어 넣어요'],
    (2, 2): ['다음 리듬 확인 때 에피네프린을 줄게요', '압박이 얕아지고 있어요 — 더 깊게 눌러요'],
    (2, 4): ['분당 100~120회 속도를 지켜 주세요', '손을 가슴 중앙에 두세요'],
    (3, 3): ['산소를 15리터로 연결해 주세요', '입안에 이물질이 있는지 봐 주세요'],
    (4, 0): ['패드를 앞뒤로 붙여도 돼요', '가슴 털이 많으면 먼저 밀어 주세요'],
    (4, 2): ['산소는 침대에서 떨어뜨려 두세요', '충전하는 동안 압박을 계속하세요'],
    (4, 4): ['200줄로 충전할게요', '방전 후 바로 압박을 재개해요'],
    (5, 2): ['에피네프린 1mg 들어갔어요', '2분 뒤에 리듬을 다시 볼게요'],
    (6, 2): ['에피네프린 다음 투여는 3분 뒤예요', 'H와 T를 하나씩 짚어 봐요'],
    (6, 4): ['다음 투여 시각을 알려 주세요', '정맥로가 잘 들어가는지 확인해 주세요'],
    (8, 4): ['골내로 위치와 시각을 기록해 주세요', '다리를 움직이지 않게 잡아 주세요'],
    (9, 2): ['심장내과에 연락해 주세요', '보호자에게 소식을 전해 주세요'],
    (9, 4): ['이송용 모니터와 산소를 챙겨 주세요', '중환자실에 인계 전화를 해 주세요'],
    (13, 0): ['손을 가슴 중앙으로 옮겨 주세요', '압박 중단은 10초를 넘기지 마세요'],
    (13, 1): ['팔꿈치를 곧게 펴 주세요', '30번 누르고 두 번 환기해요'],
    (13, 2): ['마스크가 새고 있어요', '흡인기를 준비해 주세요'],
    (13, 4): ['2분이 되면 교대할게요', '압박 속도는 지금이 좋아요'],
    (14, 0): ['심부 체온을 식도 탐침으로 재 주세요', '따뜻한 수액을 준비해 주세요'],
    (14, 1): ['젖은 옷을 벗겨 주세요', '가온 담요를 덮어 주세요'],
    (14, 2): ['심부 체온을 15분마다 알려 주세요', '체외순환(ECMO) 팀에 연락해 주세요'],
    (14, 3): ['심부 체온은 28도예요', '가족에게 상황을 알려 드릴게요'],
    (14, 4): ['보호자분께 연락드렸어요', '체온을 다시 재 볼게요'],
    (15, 0): ['투석 카테터가 오른쪽 가슴에 있어요', '인슐린을 걸러서 고혈당일 수 있어요'],
    (15, 1): ['중탄산나트륨도 준비해 주세요', '칼륨 수치가 몇이었나요?'],
    (15, 2): ['알부테롤 흡입도 준비해 주세요', '30분 뒤에 혈당을 다시 재 주세요'],
    (15, 4): ['포도당은 저혈당을 막으려고 같이 줘요', '신장내과에 응급 투석을 요청할게요'],
    (16, 0): ['정맥로는 팔에 잡아 주세요', '태아 모니터는 떼어 주세요'],
    (16, 2): ['2분마다 압박자를 바꿔요', '에피네프린은 평소와 같은 용량이에요'],
    (17, 0): ['원인이 된 약 주입을 멈춰 주세요', '마취과에 기도 확보를 요청해 주세요'],
    (17, 1): ['두 번째 정맥로를 잡아 주세요', '알레르기 팔찌를 확인해 주세요'],
    (17, 2): ['수액을 최대로 열어 주세요', '혈압을 3분마다 재 주세요'],
    (17, 3): ['항히스타민제는 나중에 줄게요', '산소를 100%로 올려 주세요'],
    (17, 4): ['이 환자는 조영제를 맞았어요', '에피네프린을 한 번 더 준비해 주세요'],
    (18, 2): ['12유도를 다시 찍어 주세요', '칼륨 수치를 다시 확인해 주세요'],
    (18, 4): ['아미오다론을 한 번 더 준비해 주세요', '이송 전에 가족 동의를 받아 주세요'],
    (19, 2): ['원하시면 원목(채플린)을 불러 드릴게요', '장례 절차는 나중에 안내해 드릴게요'],
    (19, 4): ['가족분들을 안으로 모실게요', '사망 시각은 의사 선생님이 선언하실 거예요'],
    (20, 1): ['골반 고정대를 채워 주세요', '초음파로 심낭을 봐 주세요'],
    (20, 2): ['양쪽 가슴을 감압해 주세요', '혈액을 데워서 주세요'],
    (20, 3): ['양쪽 가슴 감압이 끝났어요', '대량수혈 프로토콜을 켤게요'],
    (20, 4): ['흉관을 넣을 준비를 해 주세요', '산소를 100%로 연결해 주세요'],
}
for (i, j, k), v in DK1.items():
    sent(i, j)['distractorsKo'][k] = v
for (i, j), v in DK2.items():
    sent(i, j)['distractorsKo'] = list(v)

# ---------------------------------------------------------------- 문장 아이콘 (3)
sent(9, 4)['icon'] = 'hospital'
sent(15, 4)['icon'] = 'bulb'
sent(20, 1)['icon'] = 'bandage'

# ---------------------------------------------------------------- 문장 why
sent(16, 2)['why'] = ("continuous로 압박을 끊지 말라고 덧붙여요. 손 위치는 예전 지침의 '조금 높게'가 아니라 "
                      "보통 환자와 같은 가슴 중앙(흉골 아래쪽 절반)이에요 — 병원 지침을 따라요.")
if '4분 안에' not in sent(16, 1)['why']:
    sent(16, 1)['why'] += " 심정지 4분 안에 자발순환이 없으면 시작해 5분 안에 아기를 꺼내는 것을 목표로 해서, 팀을 처음부터 같이 불러요."
sent(19, 0)['why'] = ("We've confirmed는 방금 확인을 마쳤다는 현재완료예요. 소생을 원치 않는다는 뜻은 DNR 지시나 POLST, "
                      "사전 의료 지시서로 확인하고, 없으면 대리인(가족)에게 확인해요.")
sent(13, 1)['why'] = ("Let the chest …는 '~하게 두라'는 사역 표현이에요. 압박 사이에 가슴이 완전히 올라와야 심장에 피가 다시 차요. "
                      "그래서 가슴에 기대지 않는 것이 핵심이에요.")
sent(20, 3)['why'] = ("first와 then으로 우선순위를 말해요. 외상성 심정지에서는 큰 출혈을 잡는 일이 먼저지만, "
                      "손이 있으면 압박도 함께 해요.")
sent(20, 1)['why'] = ("Control과 start 두 동사를 and로 이어 한 번에 지시해요. 외상성 심정지의 흔한 원인은 출혈이라 "
                      "지혈과 수혈이 압박보다 앞서요.")
sent(12, 0)['why'] = ("What was …?는 이미 지나간 일을 묻는 과거 시제 질문이에요. down time은 쓰러진 뒤 흐른 시간이에요. "
                      "before CPR started를 붙이면 CPR 없이 지난 시간을 묻는 말이 되고, 이 시간이 예후를 크게 좌우해요.")
sent(16, 0)['why'] = ("Manually는 기구가 아니라 손으로 한다는 부사예요. 임신 20주쯤부터(자궁 바닥이 배꼽 높이 이상) "
                      "자궁이 큰 혈관을 눌러 순환을 방해할 수 있어서 자궁을 왼쪽으로 밀어요.")
sent(14, 2)['why'] = ("space out은 간격을 벌린다는 구동사예요. 저체온에서는 약이 몸에 오래 남아서, 유럽 지침은 30°C 아래에서 "
                      "에피네프린을 미루고 그 위에서는 간격을 두 배로 늘려요. 미국은 병원 지침에 따라요.")


# ---------------------------------------------------------------- order
def line(en, icon, ko, note):
    return {'en': en, 'icon': icon, 'ko': ko, 'note': note}


def set_line(si, li, en, icon, ko, note):
    S[si]['order']['lines'][li - 1] = line(en, icon, ko, note)


def set_why(si, why):
    S[si]['order']['why'] = why


# S4
set_line(4, 2, "They're sticking well — that's V-fib, so I'm charging now.", 'monitor',
         '잘 붙었어요 — 심실세동이니 지금 충전할게요', '리듬')
set_why(4, "패드를 붙이고, 잘 붙었는지 보며 리듬이 심실세동임을 읽고 충전하고, 충전된 뒤 접촉을 확인하고, "
           "마지막에 클리어를 외치며 방전해요. They're는 앞 줄의 패드를, Now that it's charged는 충전을 가리키고 "
           "방전은 마지막 줄이라 순서가 하나예요.")
# S16
set_line(16, 1, 'Maternal arrest — call OB and neonatal now.', 'bell',
         '임산부 심정지예요 — 지금 산부인과와 신생아팀을 불러요', '호출')
set_line(16, 2, 'While they come, manually displace the uterus to the left.', 'baby',
         '그들이 오는 동안 손으로 자궁을 왼쪽으로 밀어요', '자궁')
set_line(16, 3, 'With that held, keep compressions continuous.', 'chartup',
         '그걸 유지하면서 압박을 끊김 없이 이어요', '압박')
set_line(16, 4, 'If four minutes of that brings no ROSC, she may need a perimortem C-section.', 'scalpel',
         '그렇게 4분을 해도 자발순환이 안 돌아오면 임사 제왕절개가 필요할 수 있어요', '판단')
set_why(16, "산부인과·신생아팀을 먼저 부르고, 그들이 오는 동안 자궁을 손으로 밀고, 그걸 유지한 채 압박을 이어 가고, "
            "4분을 해도 자발순환이 없으면 임사 제왕절개를 판단해요. While they come, With that held, that이 앞 줄을 "
            "가리켜 순서가 하나예요.")
# S20
set_line(20, 4, 'Even so, anyone free keeps compressions going while we fix that.', 'play',
         '그래도 손이 빈 사람은 우리가 그걸 고치는 동안 압박을 이어 가요', '압박')
set_why(20, "상황을 선언하며 감압하고, 열린 다음 출혈과 수혈을 시작하고, 원인 해결이 압박보다 우선이라고 짚고, "
            "그래도 손이 빈 사람은 고치는 동안 압박을 이어 가요. Now that both sides are open, Until the bleeding is "
            "stopped가 앞 줄을 가리키고, Even so는 '압박보다 원인'을 받는 말이라 그 줄 바로 뒤에만 올 수 있어 순서가 하나예요.")
# S9
set_line(9, 4, 'With that target set, get a twelve-lead now and prepare to move to the ICU.', 'hospital',
         '목표를 정했으니 지금 12유도를 찍고 중환자실 이송을 준비해요', '이송')
set_why(9, "ROSC를 알리고 활력징후를 다시 재고, 맥박이 돌아왔어도 지켜보며 혈압 목표를 잡은 뒤, 12유도를 찍고 "
           "이송을 준비해요. His pulse is back, While you watch it, With that target set이 앞 줄을 가리켜 "
           "순서가 하나예요.")
# S17
set_line(17, 3, 'While the fluids run, prepare for a difficult airway — the swelling is bad.', 'gear',
         '수액이 도는 동안 어려운 기도에 대비해요 — 붓기가 심해요', '준비')
set_line(17, 4, 'Secure that airway early, before the swelling closes it off.', 'stetho',
         '그 기도를 일찍 확보해요 — 붓기가 막아 버리기 전에요', '확보')
set_why(17, "상황을 선언하고 에피네프린을 주고, 그동안 수액을 열고, 수액이 도는 동안 어려운 기도를 준비하고, 붓기가 "
            "기도를 막기 전에 일찍 확보해요. that, the fluids, that airway가 앞 줄을 가리켜 순서가 하나예요.")
# S8
set_line(8, 2, 'Okay, the IO is in the tibia — flushing it now.', 'check',
         '자, 골내로가 정강뼈에 들어갔어요 — 지금 흘려보내요', '흘림')
set_line(8, 3, 'That flushed well, so access is secured — ready for medications.', 'bell',
         '잘 흘렀으니 확보됐어요 — 투약 준비됐어요', '확보')
set_line(8, 4, 'Push the epi through that line and flush right after.', 'pill',
         '그 라인으로 에피를 밀어 넣고 바로 이어서 흘려요', '투약')
set_why(8, "정맥 시도가 실패해 골내로로 바꾸고, 정강뼈에 들어간 것을 보고하며 흘려보내고, 잘 흘렀으니 확보를 알린 뒤, "
           "그 라인으로 첫 약을 밀어 넣고 바로 흘려요. flushing it, That flushed well, that line이 앞 줄을 가리켜 "
           "순서가 하나예요.")
# S6
set_line(6, 4, 'If that check is still not shockable, give epinephrine every three to five minutes.', 'bell',
         '그 확인에서도 여전히 제세동이 안 되면 3~5분마다 에피네프린을 줘요', '간격')
set_why(6, "제세동이 안 되는 리듬이라고 판단한 뒤 압박을 이어 가며 에피네프린을 주고, 2분 뒤 재평가하고, 그 확인에서도 "
           "여전히 그 리듬이면 에피네프린을 3~5분 간격으로 이어 가요. While they push, With the epinephrine in, "
           "that check가 앞 줄을 가리켜 순서가 하나예요.")
# S10
set_line(10, 3, 'After those shocks, rhythm is still V-fib, no ROSC yet.', 'chartup',
         '그 충격 뒤에도 리듬은 여전히 심실세동, 자발순환은 아직 없어요', '현재')
set_why(10, "경과 시간으로 시작해 그동안 한 처치를 말하고, 현재 상태를 알린 뒤 다음 판단을 요청해요. "
            "In that time, After those shocks, Given all that이 앞 줄을 가리켜 순서가 하나예요.")
# S11
set_line(11, 3, 'From that spot, you can see the team doing everything they can for him.', 'handshake2',
         '그 자리에서 팀이 최선을 다하는 게 보여요', '안심')
set_why(11, "먼저 감정을 인정하고 곁에 있겠다고 말하고, 서 있을 자리를 알려 주고, 그 자리에서 보이는 처치를 설명한 뒤 "
            "계속 알리겠다고 약속해요. While I'm here, From that spot, all of that이 앞 줄을 가리켜 순서가 하나예요.")
# S12
set_line(12, 3, 'So how long was he down before that CPR started?', 'calendar',
         '그럼 그 CPR이 시작되기 전에 얼마나 쓰러져 있었나요?', '시간')
set_why(12, "목격 여부로 시작해 그 사람이 CPR을 했는지 묻고, 그 CPR이 시작되기 전 다운타임을 물은 뒤 구급대의 현장 "
            "처치를 물어요. that person, So … that CPR, Once EMS arrived가 앞 줄을 가리켜 순서가 하나예요.")
# S13
set_line(13, 2, 'That means push deeper — at least two inches every time.', 'chartup',
         '그러니 더 깊게 눌러요 — 매번 최소 2인치요', '깊이')
set_why(13, "모니터가 얕다고 알려 주면 그러니 더 깊게 누르라고 하고, 압박 사이에 이완을 요구한 뒤 좋아졌다고 확인해요. "
            "That means는 shallow를, Between pushes와 full recoil은 앞 줄을 가리켜 순서가 하나예요.")
# S14
set_line(14, 1, "Core temp is 27 — he's too cold to call, so we keep going.", 'shield',
         '심부 체온 27도예요 — 너무 차가워서 사망 선언은 못 해요, 계속 가요', '결정')
set_line(14, 2, 'That means compressions continue while we actively rewarm him.', 'play',
         '그러니 적극적으로 재가온하는 동안 압박은 계속해요', '압박')
set_line(14, 3, 'During that rewarming, space out the epi per our protocol.', 'pill',
         '그 재가온 동안 우리 지침에 따라 에피 간격을 두어요', '약물')
set_line(14, 4, "Once he's warm and those doses are in, we'll decide whether to stop.", 'bell',
         '체온이 오르고 그 약이 들어가면 멈출지 정해요', '판단')
set_why(14, "너무 차가워 사망을 선언할 수 없다고 판단하고, 그래서 재가온하는 동안 압박을 잇고, 그 재가온 동안 지침대로 "
            "에피 간격을 두고, 체온이 오르고 약이 들어간 뒤에야 멈출지 정해요. That means, that rewarming, "
            "those doses가 앞 줄을 가리켜 순서가 하나예요.")
# S15
set_line(15, 4, 'While the insulin works, ask exactly when his last dialysis was.', 'calendar',
         '인슐린이 듣는 동안 마지막 투석이 정확히 언제였는지 물어봐요', '병력')
set_why(15, "투석 병력으로 고칼륨혈증을 의심하고, 심장을 먼저 보호한 뒤 칼륨을 옮기고, 인슐린이 듣는 동안 마지막 투석 "
            "시점을 물어요. If so, With the heart protected, While the insulin works가 앞 줄을 가리켜 순서가 하나예요.")
# S19
set_line(19, 4, "I'm so sorry, he has died — take all the time you need with him.", 'faceWorried',
         '정말 안타깝게도 돌아가셨어요 — 필요한 만큼 곁에 계세요', '위로')
set_why(19, "뜻을 확인하고, 그에 따라 팀이 합의하고, 압박을 멈춘 뒤, 마지막에 died라고 분명히 말하며 위로와 시간을 "
            "건네요. Because of that, With that decided가 앞 줄을 가리키고 사망 고지는 압박을 멈춘 뒤라서 순서가 하나예요.")
# S6 order why가 쓰던 '두 분 뒤'는 위에서 새로 씀

# ---------------------------------------------------------------- context (3)
def ctx(si):
    return [n for n in S[si]['nuance'] if n['kind'] == 'context'][0]


c = ctx(0)
c['word'] = 'code'
c['ko'] = '코드(응급 호출)'
c = ctx(2)
c['scenes'][1]['en'] = 'Pushing at about 90 a minute — below target.'
c['scenes'][2]['en'] = 'Excuse me, would you mind possibly pushing a little faster?'
c = ctx(18)
c['word'] = 're-arrest'
c['ko'] = '재정지되다'
c['scenes'][0]['en'] = 'He re-arrested — restart compressions!'

yaml.safe_dump(d, open(P, 'w'), allow_unicode=True, sort_keys=False, width=1000)
print('written')
