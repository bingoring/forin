import yaml, re
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-fever-infection.yaml'
d=yaml.safe_load(open(P))
S=d['situations']

def sent(si,j,st=None):
    t=S[si]['sentences'][j]
    if st: assert t['en'].startswith(st),(si,j,t['en'])
    return t

def blank(si,j,ans,others):
    t=sent(si,j); b=t['blank']
    assert len(set(others+[ans]))==4,(si,j)
    assert len(re.findall(r'(?<![\w-])'+re.escape(ans)+r'(?![\w-])',t['en']))==1,(si,j,ans)
    k=[o['en'] for o in b['options']].index(b['answer']) if b['answer'] in [o['en'] for o in b['options']] else 0
    o=list(others); o.insert(k,ans)
    t['blank']={'answer':ans,'options':[{'en':x} for x in o]}

def decoy(si,j,old,new):
    t=sent(si,j); assert t['decoy']==old,(si,j,t['decoy']); t['decoy']=new
    assert new not in t['en'] and new not in t['chunks']

def dk(si,j,idx,old,new):
    t=sent(si,j); assert t['distractorsKo'][idx]==old,(si,j,t['distractorsKo']); t['distractorsKo'][idx]=new
    assert len(set(t['distractorsKo']))==2 and new!=t['ko']

def why(si,j,old_part,new):
    t=sent(si,j); assert old_part in t['why'],(si,j); t['why']=t['why'].replace(old_part,new)

def line(si,k,en,ko,note,icon=None):
    l=S[si]['order']['lines'][k-1]
    l['en']=en; l['ko']=ko; l['note']=note
    if icon: l['icon']=icon
    assert len(en.split())<=15,(si,k,len(en.split()))

def ocard(si,ko=None,why_=None):
    if ko: S[si]['order']['ko']=ko
    if why_: S[si]['order']['why']=why_

def ctx(si):
    return [n for n in S[si]['nuance'] if n['kind']=='context'][0]

# ---- why
why(2,0,"have you wear는 시키기보다 함께하는 느낌이라 환자가 거부감이 덜해요.","I'll have you ~는 해 달라는 일을 정중하게 안내하는 틀이에요. make·force보다 덜 강압적으로 들려요.")
why(13,2,"sputum은 환자가 알아듣기 어려운 말이라 가래를 깊이 뱉어 달라고 풀어서 설명해요.","sputum은 깊은 기침으로 뱉어 내는 가래예요. 환자에게는 '침이 아니라 깊이 기침해서 나오는 가래'라고 덧붙여 침이 섞이지 않게 해요.")
why(15,1,"호중구감소성 열이 있으면 배양 뒤 한 시간 안에 광범위 항생제를 시작하는 것이 기본이에요.","호중구감소성 열은 도착(분류)부터 한 시간 안에 광범위 항생제를 시작하는 것이 기본이에요. 배양은 그 전에 채취하되 항생제를 늦추지 않아요.")
# W3 (10.3 why) 보류: G2(10.3 문장의 within a minute)는 v44 base 문장이라 이번에 고치지 않음 -> why도 그대로

# ---- blank
blank(3,1,'temperature',['pulse','oxygen','blood sugar'])
blank(4,4,'abroad',['the hospital','daycare','the gym'])
blank(8,0,'the flu',['strep throat','COVID','RSV'])
blank(8,2,'mask',['gown','gloves','face shield'])
blank(9,4,'right',['wrong','afraid','unable'])
blank(10,4,'hydrated',['cool','calm','full'])
blank(12,3,'chest',['shoulder','knees','back'])
blank(13,3,'night sweats',['chills','headaches','hot flashes'])
blank(13,4,'air',['water','blood','food'])
blank(14,3,'When',['Where','How','Why'])
blank(14,4,'flu',['measles','mumps','chickenpox'])
blank(15,1,'broad-spectrum',['narrow-spectrum','oral','topical'])
blank(16,2,'isolating',['monitoring','admitting','weighing'])
blank(17,1,'surgery',['dermatology','physical therapy','social work'])
blank(16,1,'antibiotics',['Tylenol','an antihistamine','steroid cream'])
blank(18,1,'antibiotics',['antihistamines','oxygen','bronchodilators'])
blank(17,2,'fluids',['pain medicine','oxygen','a splint'])
blank(19,1,'antibiotics',['steroids','an antacid','vitamin K'])
blank(10,3,'scary',['calm','mild','harmless'])
blank(18,2,'wound',['cough','vaccine','fall'])
blank(18,3,'organs',['joints','tendons','bones'])
blank(16,4,'preventive',['IV','topical','long-term'])
blank(15,2,'physician',['pharmacist','transporter','scribe'])
blank(19,2,'team',['family','patient next door','interpreter'])
blank(19,4,'physician',['lab','charge nurse','respiratory therapist'])

# ---- decoy
decoy(10,2,'and give him juice','if he gets hungry')

# ---- distractorsKo
dk(0,0,0,'열이 며칠째 이어졌어요?','가족 중에 아픈 분이 있나요?')
dk(0,4,0,'열이 어디서부터 시작됐는지 알려주세요','약은 몇 시에 드셨어요?')
dk(9,0,1,'체온을 다시 재볼게요','피검사 결과는 곧 나와요')
dk(2,2,1,'기침이 언제부터 시작됐어요?','최근에 병원에 입원하신 적 있나요?')
dk(4,4,0,'지금 바로 예방접종을 할게요','여행 중에 설사는 하셨어요?')
dk(7,2,0,'통증은 약을 먹으면 가라앉을 거예요','통증 점수를 말씀해 주시겠어요?')
dk(7,3,0,'발적이 커지면 선을 새로 그을게요','선 주변이 가려우면 말씀해 주세요')
dk(9,1,0,'배양은 소변으로만 할게요','항암제는 오늘 쉬어 갈게요')
dk(13,2,0,'가래는 아침에 한 번만 뱉으시면 돼요','가래 통은 뚜껑을 꼭 닫아 주세요')
dk(8,4,1,'약은 식사 후에 드세요','열이 나면 해열제를 드셔도 돼요')
dk(19,4,0,'번들 체크리스트를 같이 읽어 드릴게요','산소 수치를 계속 확인할게요')

# ---- order
# S0 O1
line(0,3,"When it got that high, did you take anything to bring it down?","그렇게 높아졌을 때 내리려고 뭘 드셨어요?",'복약','pill')
line(0,4,"If you did, did your temperature change afterward?","드셨다면 그 뒤에 체온이 달라졌어요?",'변화','monitor')
ocard(0,why_="시작 시점을 묻고, 그때부터 얼마나 올랐는지 묻고, 그만큼 높아졌을 때 약을 먹었는지 묻고, 먹었다면 그 뒤 체온 변화를 물어요. 'since then'·'that high'·'If you did'가 앞 줄을 가리켜 순서가 하나예요.")
# S3 O3
line(3,4,"If it goes back up before that recheck, please let us know.","그 재측정 전에 다시 오르면 알려주세요",'보고','bell')
ocard(3,why_="약이 무엇을 하는지 말하고, 그 약이 언제쯤 듣기 시작하는지 알리고, 그에 맞춰 체온을 재측정할 시점을 정하고, 그 재측정 전에 다시 오르면 알려 달라고 닫아요. 'It'·'that recheck'가 앞 줄을 가리켜 순서가 하나예요.")
# S5 O5
line(5,4,"If those show pneumonia, we'll start antibiotics promptly.","그 결과에서 폐렴이 보이면 바로 항생제를 시작할게요",'치료','pill')
ocard(5,why_="기침과 열이 며칠 됐는지 묻고, 그 증상으로 폐렴을 의심한다고 알리고, 확인하려고 엑스레이와 산소 수치를 보고, 그 결과에서 폐렴이 나오면 항생제를 시작한다고 말해요. 산소가 낮거나 패혈증 징후가 있으면 결과를 기다리지 않아요. 'those'·'To check'가 앞 줄을 가리켜 순서가 하나예요.")
# S8 O6
line(8,4,"To see if you're within that window, when did your aches start?","그 시간 안에 드는지 보려고, 몸살이 언제 시작됐어요?",'시작','calendar')
ocard(8,why_="검사를 알리고, 그 결과에 따른 항바이러스제 가능성을 말하고, 그 약이 가장 잘 듣는 시점을 설명한 뒤, 그 이틀 안에 드는지 보려고 증상이 언제 시작됐는지 물어요. 'it'·'The antiviral'·'that window'가 앞 줄을 가리켜 순서가 하나예요.")
# S9 O7
line(9,1,"Your nurse was right to send you in immediately.","간호사분이 바로 오시라고 한 게 맞았어요",'안심','star')
line(9,2,"That's because, with chemo, even a mild fever like this can turn serious quickly.","그건 항암치료 중에는 이런 가벼운 열도 빠르게 심각해질 수 있기 때문이에요",'이유','faceWorried')
line(9,3,"Given that risk, we treat a fever like this as an emergency.","그 위험 때문에 이런 열은 응급으로 다뤄요",'응급','siren')
line(9,4,"For that emergency, we're drawing cultures and starting antibiotics right away.","그 응급 때문에 배양을 채취하고 항생제를 바로 시작해요",'처치','lab')
ocard(9,"항암 중 발열 설명 4문장 순서","간호사가 바로 오라고 한 게 옳았다고 먼저 안심시키고, 그 이유(항암 중에는 가벼운 열도 빨리 심각해질 수 있음)를 설명하고, 그 위험 때문에 응급으로 다룬다고 말하고, 그 응급이라 배양과 항생제를 바로 시작한다고 닫아요. 'That's because'·'that risk'·'that emergency'가 앞 줄을 가리켜 순서가 하나예요.")
# S10 O8
line(10,1,"Seizures like this look scary, but they usually stop within a few minutes.","이런 경련은 무서워 보이지만 보통 몇 분 안에 멈춰요",'경련','faceWorried')
line(10,3,"Bringing his fever down is mainly to keep him comfortable.","열을 내리는 건 주로 아이를 편하게 해 주려는 거예요",'해열','pill')
line(10,4,"Along with that, keep offering fluids, and tell me if he's hard to wake.","그와 함께 수분을 계속 권하고, 깨우기 힘들면 알려주세요",'요청','coffee')
ocard(10,why_="경련이 무서워 보여도 대개 몇 분 안에 멈춘다고 말하고, 대부분 짧고 후유증이 없다고 이어서 안심시키고, 열을 내리는 건 주로 아이를 편하게 하려는 것이라고 알리고, 그와 함께 수분 공급과 깨우기 힘들 때 알려 달라는 관찰 요청으로 닫아요. 'Most of them'·'Bringing his fever down'·'Along with that'이 앞 줄을 가리켜 순서가 하나예요.")
# S11 O9
line(11,2,"If it started after, that makes me wonder about a drug reaction.","그 뒤에 났다면 약물 반응은 아닌지 궁금해요",'추정','pill')
ocard(11,why_="발진이 새 약 전후 언제 났는지 묻고, 약 뒤에 났다면 약물 반응을 의심한다고 말하고, 그 반응이 얼마나 심할지 점막 증상을 묻고, 모든 답을 근거로 지켜본다고 닫아요. 'If it started after'·'that reaction'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
# S14 O11
line(14,2,"On that trip, did you take malaria prevention pills — and keep taking them after?","그 여행 중에 말라리아 예방약을 드셨고, 돌아온 뒤에도 계속 드셨나요?",'예방약','pill')
line(14,3,"Even if you took them all, a fever after malaria-area travel needs urgent testing.","다 드셨어도 말라리아 지역 여행 후 열은 신속 검사가 필요해요",'필요성','plane')
line(14,4,"For that testing, we'll run a rapid blood test now.","그 검사를 위해 지금 신속 혈액검사를 할게요",'검사','lab')
ocard(14,why_="여행에서 돌아온 정확한 날짜를 묻고, 그 여행 중 예방약을 먹었고 돌아온 뒤에도 이어 먹었는지 묻고, 약을 다 먹었어도 말라리아를 배제할 수 없어 검사가 급하다고 말한 뒤, 그래서 신속 혈액검사를 한다고 닫아요. 'that trip'·'them all'·'that testing'이 앞 줄을 가리켜 순서가 하나예요.")
# S15 O12
line(15,3,"While you're on your way, cultures are drawn — give broad-spectrum antibiotics now.","오시는 동안 배양은 채취됐어요 — 광범위 항생제를 지금 주세요",'항생제','pill')
ocard(15,why_="호중구감소 환자의 저혈압을 패혈증으로 본다고 보고하고, 혈압이 계속 떨어져 와 달라고 요청하고, 오시는 동안 배양은 끝났으니 광범위 항생제를 지금 주라고 요청하고, 그 첫 용량은 검사를 기다리지 말라고 닫아요. 'still'·'While you're on your way'·'that first dose'가 앞 줄을 가리켜 순서가 하나예요.")
# S16 O14
line(16,1,"Those purple spots with drowsiness are a dangerous sign — we're acting now.","저 자주색 반점에 졸림은 위험한 징후예요 — 지금 움직여요",'위험','siren')
line(16,2,"That means antibiotics and fluids, starting right now.","그래서 항생제와 수액을 지금 바로 시작해요",'치료','pill')
line(16,3,"While they go in, how quickly did the spots spread?","그게 들어가는 동안, 반점이 얼마나 빨리 퍼졌나요?",'문진','magnify')
line(16,4,"Whatever the answer, anyone who's been close to him will need preventive antibiotics too.","답이 어떻든 가까이 지낸 사람은 누구든 예방적 항생제가 필요해요",'접촉자','shield')
ocard(16,why_="자반과 졸림이 위험 신호라고 알리고 바로 움직이고, 그래서 항생제와 수액을 지금 시작하고, 그것이 들어가는 동안 반점이 얼마나 빨리 퍼졌는지 묻고, 답이 어떻든 가까이 지낸 사람에게도 예방적 항생제가 필요하다고 닫아요. 처치는 질문을 기다리지 않아요. 'That means'·'they'·'the answer'가 앞 줄을 가리켜 순서가 하나예요.")
# S20 O13 (G1 보류: 격리 종류를 쓰지 않음)
line(20,1,"Suspected meningococcemia — he's in isolation.","수막구균혈증 의심 — 격리 중입니다",'상황','siren')

# ---- context
c=ctx(6); c['scenes'][0]['en']="Pt confused, oriented to self only; baseline A&Ox3 per daughter."
c['scenes'][2]['en']="Acutely confused, A&Ox1 — rule out delirium from a UTI."
c['why']="평소보다 혼란스러워졌다는 같은 말이에요. 차트에는 confused·A&Ox(사람·장소·시간 인식)·delirium·UTI 같은 약어와 용어로 적지만, 보호자에게는 쉬운 말로 말하며 감염이 원인일 수 있다는 것까지 알려 주면 덜 놀라요."
c=ctx(13); c['scenes'][2]['en']="You're on airborne isolation — AIIR, negative pressure, staff in N95s."

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
