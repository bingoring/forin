import yaml, re
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-anaphylaxis.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def sent(si,j,st):
    t=S[si]['sentences'][j]; assert t['en'].startswith(st),(si,j,t['en']); return t
def blank(si,j,st,ans,others):
    t=sent(si,j,st); b=t['blank']
    assert len(set(others+[ans]))==4
    assert len(re.findall(r'(?i)(?<![\w-])'+re.escape(ans)+r'(?![\w-])',t['en']))==1,(si,j,ans)
    k=[o['en'] for o in b['options']].index(b['answer'])
    o=list(others); o.insert(k,ans)
    t['blank']={'answer':ans,'options':[{'en':x} for x in o]}
def line(si,k,st,en,ko,note=None,icon=None):
    l=S[si]['order']['lines'][k-1]; assert l['en'].startswith(st),(si,k,l['en'])
    l['en']=en; l['ko']=ko
    if note: l['note']=note
    if icon: l['icon']=icon
    assert len(en.split())<=15,(si,k,len(en.split()))
def ocard(si,txt): S[si]['order']['why']=txt
def ctx(si): return [n for n in S[si]['nuance'] if n['kind']=='context'][0]

# ---- why W1-W5
sent(7,2,'I have epinephrine')['why']="in case로 지금 쓸 약이 바로 곁에 있다고 알려 안심시켜요. 목이 막히거나 가슴 조임이 심해지거나 혈압이 떨어지면 기다리지 않고 바로 근육주사해요."
sent(7,0,"I'm stopping")['why']="stopping과 flushing을 and로 이어 두 행동을 한 번에 알려요. 반응이 의심되면 주입부터 멈추고, 약이 남은 수액줄은 떼어 식염수로 라인만 살려 둬요 — 응급 약을 넣을 길이 필요해서예요."
sent(11,3,'You might need')['why']="might로 가능성만 열어 겁주지 않고, or로 두 경우를 나란히 알려요. 베타차단제를 먹는 환자는 에피네프린을 여러 번 맞거나 정맥 지속 주입이 필요할 수 있어요."
sent(16,4,'More fluid')['why']="is going in으로 지금 들어가고 있는 일을 진행형으로 말해요. support your circulation으로 목적을 밝혀요. 순환이 무너지는 쇼크에서는 수액이 혈압을 받쳐 줘요."
sent(17,3,'No pulse')['why']="No pulse로 확인한 사실을 짧게 말하고 starting…now로 곧바로 행동을 선언해요. 크게 말해야 팀 전체가 같은 상황을 동시에 알아요."

# ---- 빈칸 B1-B21
blank(0,3,'Did a bee','medication',['vitamins','energy drink','protein powder'])
blank(1,4,'If it spreads','tighten',['itch','ache','burn'])
blank(2,0,'This antihistamine','itching',['redness','flushing','fever'])
blank(5,3,'Squeeze my hand','voice',['breathing','cough','chest'])
blank(5,4,'Your heart','race',['ache','slow','settle'])
blank(6,0,"I'm stopping the contrast",'stopping',['checking','warming','changing'])
blank(6,2,"We're moving",'closely',['briefly','remotely','quickly'])
blank(6,4,"I'm checking",'checking',['explaining','comparing','writing'])
blank(7,4,"I'll draw it up",'now',['here','myself','separately'])
blank(8,3,'Tell me if','swell',['tingle','flush','burn'])
blank(8,4,'Your body is still','safe',['calm','awake','warm'])
blank(10,4,'Push the call button','different',['normal','better','familiar'])
blank(11,1,"We're giving glucagon",'glucagon',['ondansetron','acetaminophen','atropine'])
blank(13,2,"I'll flag",'flag',['test','treat','confirm'])
blank(15,1,"I'm continuing",'bedside',['desk','station','unit'])
blank(17,3,'No pulse','pulse',['response','rhythm','blood pressure'])
blank(18,4,"I'm giving a full",'vitals',['skin','rash','IV site'])
blank(19,2,"I'm treating",'trigger',['dose','plan','schedule'])
blank(20,2,'I gave a second epi','reassess',['transfer','admit','move'])
blank(12,4,'Your blood pressure','closely',['briefly','remotely','quietly'])

# ---- decoy D1-D3
sent(3,2,"I'll put a red")['decoy']='on your door'
sent(12,0,"I'm giving epinephrine now")['decoy']='for the baby'
sent(17,1,'Give epinephrine')['decoy']='in the left arm'

# ---- distractorsKo K1-K6
def dk(si,j,st,idx,old,new):
    t=sent(si,j,st); assert t['distractorsKo'][idx]==old,(si,j,t['distractorsKo']); t['distractorsKo'][idx]=new
dk(13,4,"I'm writing",1,'다음 근무조에게 말로도 전할게요','교대 전에 활력징후를 한 번 더 잴게요')
dk(13,3,'Nothing',0,'라텍스가 든 물품은 전부 치웠어요','가족분께도 고무 풍선은 가져오지 말라고 할게요') if False else None
dk(15,0,'Your airway',1,'에피네프린이 듣는지 지켜볼게요','앉아 있는 게 편하면 그대로 계세요')
dk(10,0,'Sometimes',1,'물은 마셔도 돼요','모니터 선은 그대로 두세요')
dk(10,2,'We may repeat',1,'물은 천천히 드세요','보호자분께 연락해 드릴까요?')
dk(1,2,'Let me know',1,'가려운 곳은 긁지 말아 주세요','두드러기 사진을 의사에게 보여 드릴게요')
dk(2,2,"We'll keep",0,'퇴원 안내문은 나중에 드릴게요','보호자분은 언제 오실 수 있어요?')
dk(4,3,'Push the pen',0,'주사 뒤에 그 부위를 문질러 주세요','연습용 펜에는 바늘이 없어요')
dk(4,4,'Even after',1,'주사 맞은 시간은 적어 두세요','남은 펜은 실온에 보관하세요')

# ---- icon I1
sent(20,1,'Blood pressure')['icon']='monitor'

# ---- order
# S5 O1
line(5,2,'Now that',"Your heart may race after the shot, and that's expected.","주사 후에 심장이 빨리 뛸 수 있는데 정상이에요",'안내','faceWorried')
line(5,3,'Thanks for',"That racing is from the medicine, but tell me if your voice changes.","그 두근거림은 약 때문이지만 목소리가 달라지면 말해 주세요",'확인','me')
line(5,4,'Is that clear',"While I listen to your voice, what did you eat or take right before this?","목소리를 들으며 묻는데, 이게 시작되기 직전에 뭘 드시거나 복용하셨어요?",'원인','magnify')
ocard(5,"먼저 에피네프린을 놓고, 'after the shot'이 투여 뒤임을 가리키며 흔한 반응을 안내하고, 'That racing'이 그 두근거림을 가리키며 위험 신호인 목소리 변화를 확인하고, 'your voice'를 이어받아 목소리를 들으며 원인을 물어요. 약을 먼저 놓고 묻는 것이 에피네프린을 미루지 않는 순서예요.")
# S7 O2
line(7,3,'Besides that',"Besides that, is your throat closing up, or is your chest getting tighter?","그 밖에 목이 막히거나 가슴이 더 조여 오나요?",'추가','stetho')
line(7,4,'Thanks.',"Thanks. Epinephrine is drawn up — if that tightness grows, it goes in right away.","고마워요. 에피네프린은 준비돼 있어요 — 그 조임이 심해지면 바로 놓을게요",'준비','shield')
ocard(7,"먼저 항생제를 멈추고, 'the antibiotic stopped'가 멈춘 뒤임을 가리키며 얼굴·삼킴을 묻고, 'Besides that'이 그 증상 말고 목·가슴을 묻고, 'that tightness'가 가슴 조임을 가리켜 심해지면 바로 에피네프린을 놓겠다고 닫아요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S20 O3 (L2 시각은 R1 보류 — L3만)
line(20,3,"That's when","After that steady stretch, hives came back, so I gave a second epi.","그 안정된 시간 뒤에 두드러기가 다시 나서 두 번째 에피를 투여했습니다",'평가','chartup')
ocard(20,"상황(혈압 저하)을 먼저 말하고, 'Before that'이 그 저하 이전을 가리켜 배경을 대고, 'that steady stretch'가 그 안정된 시간을 가리켜 이후의 평가와 조치를 말하고, 마지막에 와서 봐 달라고 요청해요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S17 O4
line(17,2,"That's anaphylactic","With this swelling, that's anaphylactic arrest — give epinephrine and hang a liter wide open.","이 부기를 보면 아나필락시스성 심정지예요 — 에피네프린 투여하고 수액 1리터 전개방으로 걸어주세요",'약·수액','pill')
line(17,3,'With that going',"That swelling means we need the difficult airway cart now.","그 부기는 어려운 기도 카트가 지금 필요하다는 뜻이에요",'기도','hospital')
line(17,4,'I need one more',"I need one more set of hands on that airway cart.","그 기도 카트에 손이 하나 더 필요합니다",'일손','handshake2')
ocard(17,"맥박이 없다고 선언하며 CPR을 시작하고, 'this swelling'이 기도 부기를 근거로 에피네프린과 수액을 바로 지시하고, 'That swelling'이 그 부기를 가리켜 어려운 기도 카트를 부르고, 'that airway cart'가 방금 부른 카트를 가리켜 일손을 요청해요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S13 O5 (L2는 R2 보류)
line(13,3,"I'm writing this","I'm writing that rule on your chart so the next shift sees it too.","다음 근무조도 보도록 그 규칙을 차트에 적을게요",'기록','pencil')
line(13,4,'Do bananas',"For that chart, do foods like bananas or avocado bother you too?","그 차트에 올리려는데, 바나나나 아보카도 같은 음식도 문제가 되나요?",'교차','magnify')
ocard(13,"먼저 라텍스 없는 물품으로 바꾸고, 'that'이 그 교체를 가리키며 병실 규칙을 정하고, 'that rule'이 그 규칙을 가리켜 차트에 적고, 'that chart'가 방금 적는 차트를 가리켜 교차반응 음식을 물어요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S18 O6
line(18,3,'Your answer',"That tells me if the shot is working, and the monitor shows the rest.","그 말씀으로 주사가 듣는지 알 수 있고, 나머지는 모니터가 보여 줘요",'감시','monitor')
line(18,4,"That's why","Besides the monitor, I'm staying right here and checking your vitals every ten minutes.","모니터 말고도 제가 곁에서 10분마다 활력징후를 확인할게요",'곁에','handshake2')
ocard(18,"두 번째 반응이라며 에피네프린을 다시 놓고, 'the shot'이 그 투여를 가리키며 호흡을 비교해 묻고, 'That'이 그 대답을 가리켜 주사가 듣는지 알 수 있고 나머지는 모니터가 보여 준다고 하고, 'Besides the monitor'가 그 모니터 말고 곁을 지킨다고 닫아요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S10 O7
line(10,4,'Push the call',"From there, push the call button right away if that wave starts.","그 자리에서 그 반응이 시작되면 바로 호출 버튼을 누르세요",'호출','bell')
ocard(10,"모니터로 두 번째 반응을 지켜본다고 알리고, 'That wave'가 앞의 두 번째 반응을 가리키며 괜찮아진 뒤에도 온다고 하고, 'Even then'이 그 시점을 가리켜 안정을 부탁하고, 'From there'가 그 침대를 가리켜 그 자리에서 반응이 시작되면 호출하라고 해요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S12 O8
line(12,4,'Those two numbers',"Those two numbers tell us the epinephrine is helping both of you.","그 두 수치로 에피네프린이 두 분 모두를 돕는지 봐요",'확인','faceWorried')
ocard(12,"먼저 에피네프린을 놓고, 'With that in'이 그 투여를 가리키며 왼쪽으로 눕히고, 'this position'이 그 자세를 가리키며 감시를 알리고, 'Those two numbers'가 그 감시 수치를 가리켜 에피네프린이 두 사람을 돕는지 본다고 닫아요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S16 O9
line(16,3,'Both of those',"Stay with me through both — squeeze my hand if you can hear me.","둘 다 하는 동안 저와 함께 계세요 — 들리면 제 손을 쥐어 주세요")
ocard(16,"혈압이 낮아 지속 주입을 시작한다고 알리고, 'it'이 그 혈압을 가리켜 수액을 넣고, 'both'가 두 처치를 가리켜 곁에 있으라며 의식을 확인하고, 'Good'과 'More'가 앞 대답과 앞 수액을 가리켜 닫아요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")
# S11 O10
line(11,4,'Even with both',"Even working around it, you might need several doses to get a response.","그걸 우회해도 반응을 얻으려면 여러 번 필요할 수 있어요")
ocard(11,"심장약 때문에 에피네프린이 덜 들을 수 있다고 알리고, 'That's why'가 그 이유로 글루카곤을 쓰고, 'It'이 그 약을 가리켜 작용을 설명하고, 'Even working around it'이 그 우회 작용을 받아 여러 번 필요할 수 있다고 닫아요. 앞 줄을 가리키는 말이 줄마다 있어 순서가 하나예요.")

# ---- context C1-C4
ctx(15)['scenes'][2]['fix']="Your throat is swelling, so we're getting ready to help you breathe."
ctx(18)['scenes'][2]['en']="Your anaphylaxis is returning — this is a biphasic reaction."
c=ctx(10); c['scenes'][2]['en']="We're monitoring for a biphasic recurrence of your symptoms."
c['why']="biphasic recurrence는 의료진과 차트의 말이에요. 환자에게는 '두 번째 파도' 또는 '다시 올 수 있다'처럼 풀어서 말해요."
ctx(8)['scenes'][2]['fix']="It may take more than one shot — if you feel worse, tell me right away."

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
