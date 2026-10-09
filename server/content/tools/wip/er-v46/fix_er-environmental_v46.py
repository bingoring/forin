import yaml, re
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-environmental.yaml'
d=yaml.safe_load(open(P))
S=d['situations']

def sent(si,j,st=None):
    t=S[si-1]['sentences'][j-1]
    if st: assert t['en'].startswith(st),(si,j,t['en'])
    return t

def blank(si,j,ans,others):
    t=sent(si,j); b=t['blank']
    assert len(set(others+[ans]))==4,(si,j)
    assert len(re.findall(r'(?i)(?<![\w-])'+re.escape(ans)+r'(?![\w-])',t['en']))==1,(si,j,ans)
    k=[o['en'] for o in b['options']].index(b['answer'])
    o=list(others); o.insert(k,ans)
    t['blank']={'answer':ans,'options':[{'en':x} for x in o]}

def decoy(si,j,old,new):
    t=sent(si,j); assert t['decoy']==old,(si,j,t['decoy']); t['decoy']=new
    assert new not in t['en'] and new not in t['chunks']

def dk(si,j,idx,old,new):
    t=sent(si,j); assert t['distractorsKo'][idx]==old,(si,j,t['distractorsKo']); t['distractorsKo'][idx]=new

def line(si,k,en,ko,note=None,icon=None):
    l=S[si-1]['order']['lines'][k-1]
    l['en']=en; l['ko']=ko
    if note: l['note']=note
    if icon: l['icon']=icon
    assert len(en.split())<=15,(si,k,len(en.split()))

def ocard(si,txt): S[si-1]['order']['why']=txt
def ctx(si): return [n for n in S[si-1]['nuance'] if n['kind']=='context'][0]

# ---- 빈칸: 위험한 오해 B1-B7
blank(2,3,'confused',['hungry','thirsty','bored'])
blank(7,1,'shivering',['sweating','coughing','talking'])
blank(7,5,'rhythm',['valves','size','muscle'])
blank(12,1,'lungs',['kidneys','liver','skin'])
blank(15,6,'drug',['infection','food','stress'])
blank(20,2,'rhythm',['temp','IV','chart'])
blank(17,2,'actively',['passively','externally','partially'])
# ---- 가르치는 말로 옮기기 B8-B15
blank(1,2,'dizzy',['itchy','sore','thirsty'])
blank(14,2,'headache',['cough','rash','nosebleed'])
blank(6,3,'name',['age','weight','job'])
blank(4,2,'sunburn',['frostbite','a bruise','a rash'])
blank(13,4,'cramping',['swelling','shaking','bruising'])
blank(12,6,'oxygen',['sugar','sodium','iron'])
blank(4,1,'pain',['itching','nausea','swelling'])
blank(4,3,'fever',['headache','rash','tan'])
# ---- 묶음·문법 B16-B22
blank(13,1,'salt',['sugar','iron','weight'])
blank(9,5,'dehydrated',['hungry','tired','sunburned'])
blank(17,4,'still',['now','again','finally'])
blank(16,1,'clotting',['breathing','feeding','sleep'])
blank(21,5,'heat',['cold','chemical','cardiac'])      # 검토안 critical/routine/stable/resolved는 '안정적·일상적'이라 잘못된 안심 -> 가르치는 말 heat로
blank(13,6,'heat',['cold','rain','dark'])
blank(20,4,'position',['IV','monitor','blanket'])
# ---- 동떨어진 오답 B23-B42
blank(1,6,'temperature',['oxygen','weight','blood sugar'])
blank(3,6,'temperature',['blood pressure','oxygen','blood sugar'])
blank(6,5,'temperature',['heart rate','pain','weight'])
blank(9,2,'electrolytes',['weight','allergies','medications'])
blank(9,6,'close',['loose','quick','light'])
blank(10,1,'probe',['patch','strip','cuff'])
blank(10,5,'cramping',['nausea','headache','dizziness'])
blank(15,3,'cause',['dose','time','drug'])
blank(15,5,'name',['dose','color','shape'])
blank(16,2,'muscle',['skin','bone','fat'])
blank(16,6,'bed',['consult','form','transfer'])
blank(17,1,'resuscitating',['charting','talking','reporting'])   # waiting은 소생 지연으로 읽혀 reporting으로
blank(17,5,'resuscitation',['transfer','scan','handoff'])
blank(18,2,'assess',['photograph','interview','train'])        # discharge/sedate는 잘못된 안심·위험 처치로 읽혀 제외
blank(18,3,'numbness',['itching','bruising','warmth'])
blank(19,6,'bloodwork',['X-ray','EKG','ultrasound'])
blank(11,4,'safe',['awake','dressed','fed'])                   # quiet은 노숙 환자에게 낙인 느낌이라 제외
blank(3,1,'shivering',['sweating','sneezing','yawning'])
blank(8,5,'tingling',['numbness','itching','stiffness'])
blank(9,3,'urinating',['sweating','eating','sleeping'])
# ---- 낙인·정답 둘 B43-B45
blank(11,3,'eat',['sleep','rest','walk'])
blank(11,6,'wet',['dry','tight','heavy'])
blank(7,6,'massage',['shake','bend','wash'])

# ---- decoy D1-D16
decoy(15,3,'in an hour','the exact dose')
decoy(18,2,'this evening','calling dermatology')
decoy(18,5,'next week','in your hand')
decoy(17,6,'this evening','the ICU bed')
decoy(20,6,'after lunch','page radiology')
decoy(16,6,'this afternoon','a stretcher')
decoy(7,5,'once a day','his breathing')
decoy(15,6,'once a day','your blood sugar')
decoy(20,2,'every hour','his blood pressure')
decoy(19,3,'every week','a liver enzyme')
decoy(2,3,'right away','or get thirsty')
decoy(5,2,'by mouth','with a meal')
decoy(14,3,'by phone','through the family')
decoy(21,1,'by a coworker','in a cold car')
decoy(21,5,'to the ward','a lab sample')                        # 검토안 'a stable patient'는 위중 환자를 안정으로 보이는 말이라 제외
decoy(16,3,'right now','a discharge form')

# ---- distractorsKo K1-K5
dk(20,1,1,'불필요한 움직임은 피하세요.','심장 리듬이 바뀌었어요.')
dk(20,5,0,'움직임을 피하세요.','체온을 다시 재 주세요.')
dk(7,5,1,'가족분께 설명해 드릴게요.','손발이 아직 차가워요.')
dk(21,2,0,'이송 중 체온이 계속 올랐어요.','쓰러진 채 발견됐어요.')
dk(3,1,0,'언제부터 젖어 있었어요?','언제부터 젖어 계셨어요?')
dk(15,4,0,'언제부터 뻣뻣했어요?','언제부터 뻣뻣하셨어요?')

# ---- why·icon W1-W4
sent(14,4,'Please ask him')['why']="묻는 내용(how high·how quickly)을 그대로 넣어 통역사가 바꾸지 않고 옮기게 해요. 다만 원칙은 통역사가 아니라 보호자를 보고 직접 묻는 거예요."
sent(14,1,'Through the interpreter')['why']="how high·how fast처럼 짧은 질문 두 개로 나누면 통역에서 뜻이 덜 흐려져요. 질문은 통역사가 아니라 보호자를 보고 해요."
sent(16,2,"We're aggressively")['why']="aggressively는 냉각을 미루지도 천천히 하지도 않는다는 뜻이라, 받는 사람이 처치의 강도를 바로 알아요. checking for…로 합병증(근육 분해, DIC)을 함께 확인한다고 말해 팀이 검사를 준비해요."
sent(10,6,'Your temperature')['icon']='check'

# ---- order
# S1 O1
line(1,3,"Once that started, did anything help, like shade, rest or water?","그게 시작됐을 때 그늘이나 휴식, 물처럼 도움이 된 게 있었어요?",'대처','coffee')
line(1,4,"Thanks — now let me check your temperature and pulse.","고마워요 — 이제 체온과 맥박을 확인해 볼게요",'측정','stetho')
ocard(1,"노출 시간으로 시작해 'out there'가 그 장소를 가리켜 증상이 시작된 때를 묻고, 'Once that started'가 그 증상을 가리켜 도움이 된 것을 묻고, 'Thanks'가 그 대답을 받아 체온과 맥박을 재요.")
# S2 O2
line(2,4,"Even with that care, tell me right away if you get confused or stop sweating.","그렇게 돌봐 드려도 혼란스러워지거나 땀이 멈추면 바로 말씀해 주세요",'경고','siren')
ocard(2,"원인을 말하고, 'That's why'가 그 원인을 가리켜 증상과 병명을 잇고, 'To fix it'이 그 상태를 가리켜 처치를 알린 뒤, 'Even with that care'가 그 처치를 가리켜 위험 징후를 당부해요.")
# S3 O3
line(3,4,"Thanks for telling me — we'll keep checking your temperature as you warm up.","말씀 고마워요 — 따뜻해지는 동안 체온을 계속 확인할게요",'감시','monitor')
ocard(3,"떨림의 뜻을 말하고, 'it'이 그 떨림을 가리켜 돕는 조치를 알리고, 'the blankets'가 그 담요를 가리켜 상태를 묻고, 'Thanks for telling me'가 그 대답을 받아 계속 체온을 보겠다고 마무리해요.")
# S4 O4
line(4,3,"At home, aloe or a cool compress can keep easing it.","집에서도 알로에나 시원한 찜질이 계속 덜어 줄 수 있어요",'집에서','pill')
line(4,4,"If blisters or a fever show up despite that, don't pop them. Come back.","그래도 물집이나 열이 생기면 터뜨리지 말고 다시 오세요",'주의','siren')
ocard(4,"상태를 말하고, 'that'이 그 통증을 가리켜 처치를 알리고, 'it'이 그 통증을 가리켜 집에서 할 일을 말하고, 'despite that'이 그 집 관리를 가리켜 물집이나 열이 생기면 어떻게 할지 이어요.")
# S5 O5
line(5,3,"If the exam shows it's mild, let's start with small sips of fluid.","진찰에서 가벼운 탈수로 나오면 수분을 조금씩 마시는 것부터 시작해요",'경구','coffee')
ocard(5,"상태를 보고, 진찰하고, 'the exam'이 그 진찰을 가리켜 가벼우면 입으로 마시기를 시작한 뒤, 'those sips'가 그 조금씩 마시기를 가리켜 부족할 때의 대안을 말해요.")
# S6 O6
line(6,3,"While those packs work, can you tell me your name and where you are?","팩이 작용하는 동안 성함과 여기가 어디인지 말씀해 주시겠어요?",'의식','me')
ocard(6,"상태와 냉각을 말하고, 'it'이 그 체온을 가리켜 냉각을 알리고, 'those packs'가 그 냉각 팩을 가리켜 의식을 확인한 뒤, 'asking'이 그 질문을 가리켜 묻는 이유를 알려요.")
# S7 O7
line(7,3,"During that warming, please don't rub his arms and legs; his heart is sensitive.","그렇게 데우는 동안 팔다리는 문지르지 마세요, 심장이 예민해요",'금지','lock')
line(7,4,"For the same reason, we're watching his heart rhythm closely.","같은 이유로 심장 리듬을 계속 지켜보고 있어요",'감시','monitor')
ocard(7,"왜 위험한지를 말하고, 'That's why'가 그 위험을 가리켜 치료를 알리고, 'During that warming'이 그 치료를 가리켜 예민한 심장을 이유로 문지르지 말라 하고, 'the same reason'이 그 이유를 가리켜 심장 리듬 감시로 마무리해요.")
# S8 O8
line(8,3,"As your fingers thaw in it, tell me if you feel tingling or pain.","손가락이 거기서 녹는 동안 따끔거리거나 아프면 말씀해 주세요",'보고','bell')
line(8,4,"Once they've thawed, we'll watch for blisters and check how the color returns.","다 녹으면 물집을 살피고 색이 어떻게 돌아오는지 볼게요",'관찰','magnify')
ocard(8,"병명과 해야 할 일을 말하고, 'that'이 그 재가온을 가리켜 방법과 아픔을 알리고, 'in it'이 그 따뜻한 물을 가리켜 녹는 느낌을 알려 달라 하고, 'they've thawed'가 그 손가락을 가리켜 지켜볼 것으로 마무리해요.")
# S9 O9
line(9,3,"Besides what she's drunk, has she been urinating less or feeling dizzy when standing?","마신 양 말고, 소변이 줄었거나 서 있을 때 어지러워하셨어요?",'증상','magnify')
line(9,4,"Either way, we'll check her electrolytes and rehydrate her carefully.","어느 쪽이든 전해질을 확인하고 조심스럽게 수분을 보충할게요",'처치','lab')
ocard(9,"원인을 설명하고, 'That's why'가 그 원인을 가리켜 먹고 마신 양을 묻고, 'what she's drunk'가 그 양을 가리켜 소변과 어지럼을 이어 묻고, 'Either way'가 그 답과 상관없이 전해질 확인과 보충을 알려요.")
# S10 O10
line(10,1,"We're cooling you in an ice-water bath to bring your temperature down fast.","얼음물 욕조로 빠르게 체온을 낮추고 있어요",'냉각','bandage')
line(10,2,"While you're in it, we're checking your core temperature with a special probe.","들어가 계신 동안 특수 탐침으로 심부 체온을 확인하고 있어요",'측정','monitor')
ocard(10,"먼저 얼음물로 식히고, 'While you're in it'이 그 욕조를 가리켜 동시에 심부 체온을 재고, 'That reading'이 그 측정을 가리켜 내려가는 것을 알린 뒤, 경위를 물어요. 운동성 열사병은 먼저 식히는 것이 원칙이라 냉각이 측정보다 앞에 와요.")
line(10,3,"That reading shows your temperature is coming down well with the cooling.","그 측정값을 보면 냉각으로 체온이 잘 내려가고 있어요",'경과','chartup')
# S11 O11
line(11,4,"Whatever you tell me is okay — we just want you safe tonight.","뭐라고 하셔도 괜찮아요 — 오늘 밤 안전하셨으면 해요",'안심','shield')
# S12 O12
line(12,1,"He's out of the water now, and we're taking care of him.","이제 물 밖으로 나왔고 저희가 돌보고 있어요",'경위','pushpin')
line(12,3,"That helps — we're warming him and watching his breathing closely.","도움이 돼요 — 데우면서 호흡을 계속 지켜보고 있어요",'처치','bandage')
ocard(12,"물 밖으로 나왔다고 알리고, 'in it'이 그 물을 가리켜 얼마나 있었는지 묻고, 'That helps'가 그 대답을 받아 데우기와 호흡 감시를 알리고, 'Besides that'이 그 처치 말고 폐 검사를 더해요.")
# S14 O13
line(14,1,"I'll speak with you through the interpreter, one short question at a time.","통역사를 통해 짧은 질문을 하나씩 드릴게요",'안내','speech')
line(14,2,"For the first one, how high did he climb, and how fast?","첫 번째로, 얼마나 높이 올라갔고 얼마나 빨리 올라갔나요?",'요청','speaker')
line(14,3,"After that climb, when did his headache and shortness of breath start?","그렇게 올라간 뒤 두통과 숨참이 언제 시작됐어요?",'시작','calendar')
line(14,4,"Does he still have them now, or any chest pain or confusion?","지금도 그 증상이 있나요, 아니면 가슴 통증이나 혼란이 있나요?",'증상','faceWorried')
S[13]['order']['ko']="통역을 통한 고산 문진 4문장 순서"
ocard(14,"통역을 거쳐 짧은 질문을 하나씩 하겠다고 알리고, 'the first one'이 그 첫 질문으로 올라간 높이와 속도를 묻고, 'that climb'이 그 등반을 가리켜 증상이 시작된 때를 묻고, 'them'이 그 증상을 가리켜 지금도 있는지와 가슴 통증·혼란을 바로 확인해요. 질문은 통역사가 아니라 보호자를 보고 직접 해요.")
# S15 O14
line(15,4,"Thank you — that helps us narrow the cause while we keep cooling you.","고마워요 — 원인을 좁히는 데 도움이 되고, 계속 식혀 드릴게요",'마무리','bandage')
ocard(15,"가설을 말하고, 'To find out'이 그 가설을 가리켜 새 약을 묻고, 'the medicines'가 그 약을 가리켜 뻣뻣함을 묻고, 'that'이 앞의 두 답을 가리켜 원인을 좁히며 냉각을 계속한다고 말해요.")
# S16 O15
line(16,1,"Heat stroke with multi-organ failure — we're cooling aggressively.","다장기부전을 동반한 열사병이에요 — 적극적으로 냉각 중이에요",'진단','siren')
line(16,2,"Despite that, his temp's forty-one and still climbing.","그런데도 체온이 41도이고 계속 오르고 있어요",'체온','chartup')
line(16,3,"That heat is breaking down his muscles — urine is dark, likely rhabdo.","그 열이 근육을 분해하고 있어요 — 소변이 어둡고 횡문근융해가 의심돼요",'소견','lab')
line(16,4,"With all of that, I need labs, blood products, and an ICU bed.","그 모든 것 때문에 검사와 혈액제제, 중환자실 병상이 필요해요",'요청','speaker')
ocard(16,"진단과 냉각을 말하고, 'Despite that'이 그 냉각에도 오르는 체온을 보고하고, 'That heat'이 그 열을 가리켜 어두운 소변으로 횡문근융해를 의심하고, 'all of that'이 이 모두를 이유로 검사·혈액제제·중환자실 병상을 요청해요.")
# S17 O16
line(17,2,"To get him warm, let's activate the ECMO team now.","따뜻하게 만들려면 지금 ECMO 팀을 활성화합시다",'요청','siren')
line(17,3,"For that team, we're prepping the room right now.","그 팀을 위해 지금 방을 준비하고 있어요",'준비','gear')
ocard(17,"원칙을 말하고, 'To get him warm'이 그 원칙의 warm을 받아 ECMO 팀을 부르고, 'that team'이 그 팀을 가리켜 방 준비를 알린 뒤, 'all of that'이 그 모든 동안의 취급을 당부해요.")
# S19 O17
line(19,4,"Those numbers will guide how much fluid we give to protect your kidneys.","그 수치로 신장을 보호하려고 수액을 얼마나 드릴지 정해요",'치료','pill')
ocard(19,"몸에서 생기는 일을 말하고, 'That'이 그 상태를 가리켜 이유를 잇고, 'Because of that'이 그 이유를 가리켜 보는 검사를 알리고, 'Those numbers'가 소변량·CK 수치를 가리켜 수액 양을 정한다고 알려요.")
# S20 O18
line(20,2,"That's why we're turning him only for essential care.","그래서 꼭 필요한 처치 때문에만 자세를 바꿔요",'이유','lock')
line(20,3,"Even for that essential care, his rhythm changed the moment we shifted him.","그 필요한 처치를 하는데도 옮기는 순간 리듬이 바뀌었어요",'변화','chartup')
ocard(20,"원칙을 말하고, 'That's why'가 그 원칙을 가리켜 꼭 필요한 처치만 한다고 잇고, 'that essential care'가 그 처치를 가리켜 그래도 생긴 변화를 알린 뒤, 'that change'가 그 변화를 가리켜 조치로 마무리해요.")
# S21 O19
line(21,2,"There, his core temp was forty-one.","거기서 심부 체온이 41도였어요",'수치','monitor')
ocard(21,"발견 상황으로 열고, 'There'가 그 창고를 가리켜 현장 수치를 말하고, 'that reading'이 그 수치를 가리켜 처치를 알린 뒤, 'Even with that'이 그 처치를 가리켜 오른 체온으로 서두르자고 마무리해요.")

# ---- context C1-C3
c=ctx(12); c['scenes'][2]['en']="What was his total time underwater, from submersion to extrication?"
c['why']="submersion·extrication은 의료진이 인계·기록에 쓰는 말이에요. 놀란 보호자에게는 how long · under처럼 쉬운 말로 물어요."
c=ctx(14); c['scenes'][1]['en']="Pt climbed rapidly to high altitude per family via interpreter."
c['scenes'][2]['en']="What was his rate of ascent and the maximum altitude he climbed to?"
c['why']="통역을 거칠 때는 짧고 쉬운 말이 정확하게 전해져요. rate of ascent·maximum altitude 같은 전문 용어는 통역 중에 뜻이 흐려지기 쉬워요."
c=ctx(4); c['scenes'][2]['en']="Monitor for blister formation or pyrexia, and avoid rupturing them."
c['why']="pyrexia(발열)·formation·rupture는 기록에 쓰는 말이에요. 집에 가서 스스로 지켜볼 환자에게는 blisters·fever처럼 매일 쓰는 말로 알려 줘야 실제로 지켜요."

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
