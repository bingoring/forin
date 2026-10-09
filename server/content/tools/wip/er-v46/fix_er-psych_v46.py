import yaml, re
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-psych.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def T(si,j): return S[si-1]['sentences'][j-1]
def blank(si,j,ans,others):
    t=T(si,j); b=t['blank']
    assert len(set(others+[ans]))==4 and len(others)==3,(si,j)
    assert len(re.findall(r'(?i)(?<![\w-])'+re.escape(ans)+r'(?![\w-])',t['en']))==1,(si,j,ans)
    k=[o['en'] for o in b['options']].index(b['answer'])
    o=list(others); o.insert(k,ans)
    t['blank']={'answer':ans,'options':[{'en':x} for x in o]}
def dk(si,j,idx,old,new):
    t=T(si,j); assert t['distractorsKo'][idx].startswith(old),(si,j,idx,t['distractorsKo'])
    t['distractorsKo'][idx]=new
def decoy(si,j,new,old=None):
    t=T(si,j)
    if old: assert t['decoy']==old,(si,j,t['decoy'])
    assert new.lower() not in t['en'].lower() and new not in t['chunks'],(si,j,new)
    t['decoy']=new
def why(si,j,txt): T(si,j)['why']=txt
def line(si,k,st,en,ko,note,icon):
    l=S[si-1]['order']['lines'][k-1]; assert l['en'].startswith(st),(si,k,l['en'])
    assert len(en.split())<=15,(si,k,len(en.split()))
    l['en']=en; l['ko']=ko; l['note']=note; l['icon']=icon
def ocard(si,txt): S[si-1]['order']['why']=txt

# ---- 빈칸: 위험한 처치·처벌 말투 (B1-B6)
blank(10,1,'double-check',['explain','write down','mention'])
blank(10,4,'home',['upstairs','outside','back'])
blank(2,4,'hold',['check','label','replace'])
blank(6,3,'next',['first','same','usual'])
blank(1,6,'concern',['pity','curiosity','patience'])
blank(3,3,'step',['day','question','thing'])
# ---- 빈칸: 장면과 동떨어진 오답 (B7-B39)
blank(3,1,'courage',['patience','time','luck'])
blank(3,2,'tell',['show','remind','teach'])
blank(4,2,'breathe',['talk','sit','walk'])
blank(4,4,'oxygen',['temperature','weight','pupils'])
blank(4,6,'staying',['charting','typing','moving'])
blank(5,2,'enjoy',['avoid','fear','dislike'])
blank(5,4,'appetite',['weight','energy','mood'])
blank(6,4,'time',['rest','space','sleep'])
blank(8,2,'rights',['privileges','duties','options'])
blank(8,3,'unfair',['scary','confusing','sudden'])
blank(9,5,'hurt',['trick','trap','rush'])
blank(9,6,'seeing',['feeling','smelling','tasting'])
blank(10,2,'struggling',['joking','resting','working'])
blank(10,5,'true',['easier','normal','clear'])
blank(11,6,'deserves',['delays','hides','causes'])
blank(12,2,'feel',['sign','leave','wait'])
blank(12,3,'sit',['pray','plan','argue'])
blank(12,5,'cry',['scream','laugh','pray'])
blank(12,6,'rush',['guide','walk','talk'])
blank(13,2,'comfortable',['polite','required','proper'])
blank(13,6,'talk',['listen','explain','complain'])
blank(14,1,'dark',['calm','bright','normal'])
blank(15,2,'need',['hear','see','mean'])
blank(15,4,'calm',['tense','loud','stiff'])
blank(15,5,'safer',['calmer','sleepier','stronger'])
blank(16,1,'reassess',['reposition','reschedule','relocate'])
blank(16,6,'need',['refuse','skip','repeat'])
blank(17,3,'happen',['change','stop','improve'])
blank(17,6,'seriously',['personally','calmly','literally'])
blank(19,1,'carrying',['causing','showing','sharing'])
blank(19,5,'threat',['anger','plan','delay'])
blank(20,1,'respond',['sleep','stand','see'])
blank(21,2,'hallway',['elevator','room','lobby'])
# 선택 일부(돈 낱말)
blank(13,3,'temporary',['permanent','regular','private'])
blank(7,5,'works',['waits','ends','changes'])
blank(18,6,'possible',['convenient','optional','comfortable'])
blank(8,4,'assess',['weigh','vaccinate','discharge'])

# ---- decoy D1-D13
decoy(16,1,"until you're calm","at night")
decoy(16,5,"if you can eat","in the morning")
decoy(4,4,"your blood pressure","after lunch")
decoy(6,6,"in this room","at home")
decoy(13,4,"this morning","at home")
decoy(2,2,"everything new","from the desk")
decoy(6,5,"for being late","in this room")
decoy(10,1,"you're tired","for the doctor")
decoy(10,5,"if that's polite","to me")
decoy(19,4,"for him","with him")
decoy(6,2,"how you got here","for now")
decoy(20,2,"with the doctor","for now")
decoy(11,4,"your heart","for now")
# ---- decoy D14: 돌려쓴 다섯 구를 자리마다 대비 조각으로
for si,j,old,new in [
 (2,1,'for the doctor','for your comfort'),(2,3,'at night','for new patients'),(3,6,'at home','to the intake room'),
 (4,3,'for you','to stay calm'),(4,6,'for the doctor','until the doctor comes'),(5,5,'for the doctor','to listen'),
 (5,6,'for you',"and we'll wait"),(6,1,'for you','this morning'),(6,4,'at the desk','until lunch'),
 (7,4,'for the doctor','with your mom'),(7,5,'at home','Your dad wants to help'),(8,1,'at the desk','while we wait'),
 (8,2,'at home','each rule'),(8,3,'for you','through it again'),(8,6,'at night','on the unit'),
 (9,1,'for you','in this building'),(9,5,'at night','with them'),(10,2,'at home','Most people say'),
 (10,3,'for you',"There's no hurry here;"),(10,4,'at the desk','your medications'),(11,5,'for the doctor','to check your lungs'),
 (11,6,'for you','a quick answer'),(12,1,'at the desk','for the wait'),(12,2,'for you','one right way'),
 (12,3,'at home','to check on you'),(12,5,'at night',', some stay busy'),(12,6,'at the desk','question you'),
 (13,1,'for the doctor','just to take notes'),(13,3,'at night','a daily support'),(13,5,'for you','to talk to you'),
 (15,6,'at night','everyone warm'),(16,2,'for the doctor','what dose'),(16,3,'at the desk',', these bandages'),
 (16,4,'for you','this feels painful'),(17,2,'for the doctor','your job is'),(17,4,'for you','this form'),
 (17,6,'for you','Even if this feels fair'),(18,1,'at night','for the staff'),(18,2,'at the desk','every day'),
 (18,3,'for you','before you leave'),(18,4,'for you','this short wait'),(19,3,'at night',', including him'),
 (19,5,'at home','in the family'),(20,3,'for you','to document'),(20,6,'at home','your chart carefully'),
 (21,2,'at home','in this elevator'),(21,4,'at the desk','few days'),(21,5,'at home','somewhere quieter'),
 (21,6,'at the desk','and write down')]:
    decoy(si,j,new,old)

# ---- distractorsKo K1-K5
dk(17,3,0,'집에는 누가','오늘 여기 오기 전에 무슨 일이 있었어요?')
dk(17,3,1,'집까지는','지금 가장 걱정되는 게 뭐예요?')
dk(18,2,1,'대기 중인 병원 목록','담요를 더 가져다 드릴까요?')
dk(19,5,0,'이 내용은 의사','물 한 잔 드릴까요?')
dk(19,6,0,'그분 이름을','오늘 잠은 좀 주무셨어요?')
dk(14,6,1,'고칠 곳이 있으면','계획을 가족에게도 보여 드릴까요?')
dk(10,4,0,'집에 가는 길에','오늘 밤 같이 계실 분이 있으세요?')

# ---- order O1-O14
line(2,3,"I know this feels","I know giving those up feels intrusive, but it keeps you safe.","그걸 내놓는 게 침해적으로 느껴지겠지만 안전을 지켜 줘요","공감","faceWorried")
line(2,4,"That's only temporary","Intrusive as it feels, it isn't punishment — and you'll get it all back.","침해적으로 느껴져도 처벌이 아니에요 — 전부 돌려받으실 거예요","약속","check")
ocard(2,"먼저 맡아 두겠다고 알리고, 그 가운데 벨트와 신발끈을 구체적으로 말하고, 그것을 내놓는 불편함을 인정하며 안전 때문이라고 하고, 그렇게 느껴져도 처벌이 아니며 전부 돌려받는다고 닫아요. 'That includes'·'those'·'Intrusive as it feels'가 앞 줄을 가리켜 순서가 하나예요.")
line(3,2,"That tells me","That was the right call, and I'm glad you're here.","잘 결정하셨어요, 와 주셔서 기뻐요","인정","shield")
line(3,4,"Whatever it is","Thank you for answering — we'll take it one step at a time.","답해 주셔서 고마워요 — 한 단계씩 해 나가요","함께","handshake2")
ocard(3,"온 용기를 인정하고, 그 결정이 옳았다고 이어 알리고, 힘든 점을 묻고, 말해 준 것에 감사하며 한 단계씩 간다고 닫아요. 'That was the right call'과 'Thank you for answering'이 앞 줄을 가리켜 순서가 하나예요.")
line(4,4,"I'm staying right here","I'm staying with you through every one of those checks.","그 확인 하나하나 내내 제가 곁에 있을게요","곁에","shield")
ocard(4,"안전하다고 먼저 안심시키고, 그 느낌이 지나가도록 같이 호흡하게 하고, 심장 설명으로 이어 확인한다고 알리고, 그 모든 확인 내내 곁에 있겠다고 닫아요. 'it'과 'those checks'가 앞 줄을 가리켜 순서가 하나예요.")
line(6,3,"Take all the time","Take all the time you need before we talk — no one's judging you.","이야기하기 전에 필요한 시간을 가지세요 — 아무도 비난하지 않아요","시간","calendar")
line(6,4,"Whatever we talk","After that time, we'll talk and take the next steps together, at your pace.","그 시간이 지나면 이야기하고 다음 단계를 당신의 속도에 맞춰 함께 해요","함께","handshake2")
ocard(6,"곁에 있어 기쁘다고 먼저 말하고, 그 말을 이어 설명하지 않아도 된다고 하고, 이야기하기 전의 시간을 주며 비난이 없다고 하고, 그 시간이 지나면 속도에 맞춰 다음 단계로 간다고 닫아요. 'That's all'과 'After that time'이 앞 줄을 가리켜 순서가 하나예요.")
line(8,3,"Part of that","The short reason is safety, and you still have rights during the hold.","간단히 말하면 이유는 안전이고, 억류 중에도 여전히 권리가 있어요","권리","shield")
line(8,4,"With those rights","One of them is having a say in how we do this together.","그 가운데 하나는 이 과정을 어떻게 할지 의견을 내는 거예요","참여","handshake2")
ocard(8,"일시적인 억류임을 먼저 알리고, 부당하게 느껴질 것을 인정하며 설명하겠다고 하고, 간단한 이유(안전)와 함께 권리가 남아 있음을 알리고, 그 권리 가운데 하나로 진행 방식에 의견이 있다고 닫아요. 'this'·'The short reason'·'them'이 앞 줄을 가리켜 순서가 하나예요.")
line(9,3,"Whatever you describe","Even if I can't see or hear it, I believe it feels real.","저는 보거나 듣지 못해도, 진짜처럼 느껴진다는 걸 믿어요","인정","check")
ocard(9,"두려움을 인정하며 안전하다고 알리고, 보이고 들리는 것을 묻고, 같이 보거나 듣지는 못해도 진짜처럼 느껴진다는 것을 믿는다고 하고, 문을 열어 두는 구체적인 행동으로 닫아요. 'it'과 'Since it feels so real'이 앞 줄을 가리켜 순서가 하나예요.")
line(10,4,"Whatever you say","In the end, whatever you say, I only want to keep you safe.","결국 무슨 말씀을 하시든 저는 당신을 안전하게 지키고 싶을 뿐이에요","목적","handshake2")
ocard(10,"괜찮다는 말을 받아 주며 재확인한다고 하고, 그 이유로 힘들어도 괜찮다고 하는 사람이 있다고 설명하고, 그래서 틀린 답이 없고 괜찮다는 말 이상을 해도 된다고 하고, 결국 무슨 말을 하든 안전을 지키고 싶을 뿐이라고 닫아요. 'That's because'·'That's why'·'In the end'가 앞 줄을 가리켜 순서가 하나예요.")
line(12,3,"That's why some","That means some people cry and some go quiet — both are okay.","그러니 우는 사람도 조용해지는 사람도 있고 둘 다 괜찮아요","반응","bulb")
ocard(12,"애도를 먼저 전하고, 그 슬픔에 옳은 방식이 없다고 이어 말하고, 그 말은 곧 우는 사람도 조용한 사람도 있다는 뜻이라 하고, 어느 쪽이든 곁에 앉아 서두르지 않겠다고 닫아요. 'Whatever you're feeling'과 'That means'와 'whichever way it goes'가 앞 줄을 가리켜 순서가 하나예요.")
line(13,1,"This person","Tonight, someone will stay close by to keep you safe.","오늘 밤 누군가 가까이 있으면서 안전하게 지켜 드릴 거예요","곁에","shield")
line(13,2,"That's why","This person is here only for that, not to judge you.","이 분은 오직 그것을 위해 있는 거지, 판단하러 있는 게 아니에요","역할","shield")
line(13,3,"That support","Since judging isn't part of their job, you can talk to them or not.","판단은 그분 일이 아니니, 이야기해도 안 해도 돼요","선택","handshake2")
line(13,4,"With that support","Either way, their time with you is temporary, while we work on next steps.","어느 쪽이든 이분이 곁에 있는 건 다음 단계를 진행하는 동안만이에요","일시적","calendar")
ocard(13,"곁의 사람이 밤새 안전을 위해 있다고 알리고, 그 사람은 오직 그 일만 하고 판단하지 않는다고 하고, 판단은 그분 일이 아니니 말할지는 환자가 정한다고 하고, 어느 쪽이든 일시적이라고 닫아요. 'for that'·'judging'·'Either way'가 앞 줄을 가리켜 순서가 하나예요.")
line(16,2,"Along with that","While they're on, we check on you constantly to see if they can come off.","억제대가 채워져 있는 동안 계속 확인하며 풀 수 있는지 살펴요","관찰","monitor")
line(16,3,"We check on you","As soon as it's safe, they do.","안전해지는 대로 바로 풀어드려요","해제","lock")
line(16,4,"As soon as","For the medication we're giving, I'll tell you exactly what it is and why.","드리는 약에 대해서는 무슨 약인지 왜 드리는지 정확히 말씀드릴게요","투약","pill")
ocard(16,"억제가 안전해질 때까지만이라고 두려움을 인정하며 알리고, 그동안 계속 확인하며 풀 수 있는지 살피고, 안전해지면 풀어 준다고 하고, 마지막으로 주는 약이 무엇이고 왜인지 말하는 흐름이에요. 'While they're on'과 'they do'가 앞 줄을 가리켜 순서가 하나예요.")
S[16]['order']['ko']='치료 거부·귀가 요구 환자 4문장 순서'
line(17,3,"From that","Your answer helps me understand if you can think clearly about this decision.","그 대답이 이 결정을 명확히 생각할 수 있는지 이해하는 데 도움이 돼요","확인","magnify")
ocard(17,"떠나고 싶다는 말을 받아 주며 위험 이해를 확인하겠다고 하고, 집에 가면 어떻게 될 것 같은지 묻고, 그 대답이 결정을 명확히 생각할 수 있는지 이해하는 데 도움이 된다고 하고, 부당하게 느껴져도 안전이 역할이라고 닫아요. 'Your answer'와 'all this'가 앞 줄을 가리켜 순서가 하나예요.")
line(19,4,"Taking threats","That means I must tell a few other people on the team.","그러니 팀의 다른 몇 사람에게 알려야 해요","공유","bell")
ocard(19,"분노를 먼저 인정하고, 그 분노가 향한 계획이나 사람이 있는지 묻고, 무엇이든 위협은 진지하게 다룬다고 밝히고, 그건 곧 팀에 알려야 한다는 뜻이라고 닫아요. 'Whatever you tell me'와 'That means'가 앞 줄을 가리켜 순서가 하나예요.")
line(20,3,"As I said","As I explain, I'll look at your eyes and check how your body responds.","설명하면서 눈을 살펴보고 몸이 어떻게 반응하는지 확인할게요","사정","magnify")
ocard(20,"곁에 있고 안전하다고 먼저 알리고, 대답을 못해도 하는 일을 다 설명하겠다고 하고, 설명하면서 눈과 몸의 반응을 살피고, 그것이 다른 원인을 배제하는 방법이라고 닫아요. 'So'·'As I explain'·'That helps'가 앞 줄을 가리켜 순서가 하나예요.")
line(21,2,"Whatever it is","Whatever it is, I'm staying right here with you.","무슨 일이든 제가 바로 여기 곁에 있을게요","곁에","shield")
line(21,3,"Let's get you","With me right here, let's get you somewhere safer while we sort this out.","제가 바로 여기 있으니, 이걸 해결하는 동안 더 안전한 곳으로 모실게요","이동","shield")
ocard(21,"변화를 알아챘다고 묻고, 어떤 상황이든 곁에 있겠다고 하고, 곁에 있으니 더 안전한 곳으로 옮기자고 하고, 그곳으로 가는 길에도 혼자 두지 않는다고 닫아요. 'Whatever it is'·'With me right here'·'there'가 앞 줄을 가리켜 순서가 하나예요.")

# ---- context·swap C1-C3
for n in S[9]['nuance']:
    if n['kind']=='context' and n['word']=='deny':
        assert n['scenes'][2]['fix'].startswith("So you're not having")
        n['scenes'][2]['fix']="Are you having any thoughts of ending your life right now?"
        n['why']=n['why'].rstrip()+" 부정형으로 확인하듯 묻지 않고, 긍정형으로 직접 물어요."
for si,old,new in [(14,"힘든 순간이 다시 오면","다음에 힘든 순간이 올 때를 위해 함께 계획을 세워요"),(21,"잘 들으세요","있잖아요, 제가 바로 여기 곁에 있을게요 — 더 안전한 곳으로 모시는 동안에요")]:
    k=0
    for n in S[si-1]['nuance']:
        if n['kind']=='swap': assert n['ko'].startswith(old); n['ko']=new; k+=1
    assert k==1

# ---- why·tag W1-W7
why(1,1,"any thoughts of로 행동이 아니라 '생각'부터 물어요. hurting yourself는 자해를 묻는 말이라, 자살은 이어서 ending your life처럼 분명한 말로 따로 물어요.")
why(8,1,"temporary로 기한이 있다는 것을, while we assess로 끝나는 조건을 함께 알려요. 응급 억류는 법으로 최대 기한이 정해져 있어요(주마다 다르고, 캘리포니아 5150은 최대 72시간). 평가 뒤 연장될 수도 있어서 날짜는 약속하지 않아요.")
why(18,6,"everything possible로 노력의 범위를 말하되 결과는 약속하지 않아요. 언제 날지 모르는 병상을 두고 지킬 수 있는 말만 해요.")
assert T(7,6)['tag']=='비밀 허용'; T(7,6)['tag']='사생활 인정'
why(3,4,"Tell me…는 짧고 열린 요청이라 환자가 어디서부터 말할지 스스로 정해요. lately로 범위를 최근으로 좁혀서 지금 왜 왔는지에 먼저 닿아요.")
assert '안전 계획의 핵심이에요' in T(14,4)['why']; T(14,4)['why']=T(14,4)['why'].replace('안전 계획의 핵심이에요','안전 계획의 한 단계예요')
assert '가장 정확해요' in T(5,2)['why']; T(5,2)['why']=T(5,2)['why'].replace('가장 정확해요','도움이 돼요')
assert '방법과 계획을 따로 올려 물어요' in T(1,2)['why']; T(1,2)['why']=T(1,2)['why'].replace('방법과 계획을 따로 올려 물어요','방법(3번)과 구체적인 계획(5번)을 따로 물어요')

yaml.safe_dump(d, open(P,'w'), allow_unicode=True, sort_keys=False, width=1000)
print('saved')
