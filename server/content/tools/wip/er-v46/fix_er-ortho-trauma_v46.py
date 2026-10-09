import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-ortho-trauma.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def sent(r):
    i,j=map(int,r.split('.')); return S[i-1]['sentences'][j-1]

# ---- why (5) ----
WHY={
 '14.5':"help us check은 통역사가 확인을 대신한다는 뜻이 아니에요. 확인하는 사람은 간호사이고, 통역사는 통증과 병력처럼 정확해야 하는 말을 그대로 옮겨 줘요.",
 '10.4':"directly를 넣어 얼음에 바로 닿지 않게 하라는 점을 짚어요. 절단 부위는 젖은 거즈로 싸서 밀봉 봉투에 넣고, 그 봉투를 얼음 위에 둬요 — 얼음에 바로 닿으면 조직이 얼어 상해요.",
 '6.5':"before we close the skin으로 다음 단계를 알려 주면, 상처가 왜 아직 열려 있는지 환자가 이해해요. 개방골절은 씻어 내고 오염된 조직을 정리한 뒤에 닫아요.",
 '4.5':"Tell me 뒤에 질문을 넣을 때는 how high you fell from처럼 평서문 어순으로 써요. 떨어진 높이는 부상 정도를 가늠하는 기준이에요.",
 '7.5':"numb the area로 먼저 통증을 막는다고 알려 주면 환자가 시술을 덜 두려워해요. move quickly로 시간이 중요하다는 급함도 함께 전해요.",
}
for r,w in WHY.items(): sent(r)['why']=w

# ---- blank (33) ----
def setblank(r,answer,opts):
    t=sent(r); b=t['blank']
    old=[o['en'] for o in b['options']]; k=old.index(b['answer'])
    opts=opts.split('|'); assert len(set(opts))==3 and answer not in opts
    new=opts[:k]+[answer]+opts[k:]
    b['answer']=answer; b['options']=[{'en':x} for x in new]
BL=[('2.5','Squeeze','Push|Pull|Tap'),('3.2','weight','ice|lotion|tape'),('3.4','color','movement|swelling|length'),
 ('4.2','scale','map|list|chart'),('4.4','heavy','sharp|soft|small'),('4.5','fell','jumped|climbed|slipped'),
 ('5.2','ice','heat|a brace|ointment'),('5.5','rest','stretch|massage|exercise'),('6.1','sterile','stiff|dirty|tight'),
 ('6.2','prevent','treat|spread|cause'),('7.2','pressing','tapping|sliding|rubbing'),('8.1','relax','heal|stand|cough'),
 ('8.4','slide','twist|roll|jump'),('9.1','manage','check|record|ask about'),('9.3','oriented','sedated|awake|quiet'),
 ('9.4','stand','kneel|lean|sit'),('9.5','often','rarely|later|once'),('10.3','control','check|watch|report'),
 ('11.3','tightness','dryness|numbness|wetness'),('12.4','worry','cry|ask|wait'),('13.5','scans','casts|crutches|splints'),
 ('14.1','interpreter','aide|orderly|EMT'),('14.4','Nod','Wave|Blink|Point'),('15.1','elevated','lowered|covered|warm'),
 ('15.2','fingers','toes|elbows|nails'),('15.5','stiff','cold|numb|dirty'),('17.1','stabilize','measure|clean|lift'),
 ('17.2','internally','externally|slowly|again'),('17.5','fluids','oxygen|pills|painkillers'),
 ('18.2','oxygen','pulse|temperature|blood sugar'),('18.4','confused','dizzy|nauseous|cold'),
 ('19.3','splint','massage|measure|elevate'),('19.5','losing','saving|gaining|clotting')]
assert len(BL)==33
for r,a,o in BL: setblank(r,a,o)

# ---- decoy (2) ----
sent('21.4')['decoy']='for the lab'
sent('11.2')['decoy']='for the pain'

# ---- distractorsKo (6) ----
def setdk(r,old_idx_text,new):
    t=sent(r); l=t['distractorsKo']; i=l.index(old_idx_text); l[i]=new
setdk('8.2','정복 전에 맥박을 확인했어요','정복 뒤에는 팔걸이를 하실 거예요')
setdk('13.5','지금 뼈 사진을 찍을 거예요','결과는 정형외과에서 설명해 드릴 거예요')
setdk('14.3','손으로 숫자를 보여 주세요','통역사가 오면 다시 여쭤볼게요')
setdk('21.4','시간은 차트에 기록할게요','지혈대 아래쪽 피부색을 볼게요')
setdk('20.2','손가락 색은 분홍색입니다','발가락 색은 분홍색입니다')
setdk('10.5','손가락은 얼음 위에 올려 둘게요','이송 중에도 출혈을 계속 볼게요')

# ---- tag (2) ----
sent('16.2')['tag']='신전 통증'
sent('9.3')['tag']='안심시키기'

# ---- order (13) ----
def setorder(si,lines,why):
    o=S[si-1]['order']; o['why']=why
    for k,v in lines.items():
        l=o['lines'][k-1]
        for f,x in zip(('en','icon','ko','note'),v):
            if x is not None: l[f]=x
# S3 (O1)
setorder(3,{3:("Even with no weight on it, tell me if it feels too tight or numb.",None,"체중을 싣지 않아도 너무 조이거나 저리면 말씀해 주세요",None)},
 "부목을 댄다고 알리고, 'It'으로 이유와 체중 제한을 말한 뒤, 'Even with no weight on it'으로 체중을 싣지 않아도 생길 수 있는 경고 증상을 알리고, 마지막에 'Either way'로 매시간 확인을 약속해요. 'It'·'no weight'·'Either way'가 앞 줄을 가리켜 순서가 하나예요.")
# S4 (O2)
setorder(4,{1:("On a scale of zero to ten, how bad is the pain?",'chartup',"0에서 10 중 통증이 얼마나 심하세요?",'통증'),
 2:("To understand that pain, did you fall, or did something land on it?",'compass',"그 통증을 알려면, 넘어지셨나요 아니면 뭔가 떨어졌나요?",'기전'),
 3:("Whichever it was, tell me exactly how high or how heavy.",None,None,None),
 4:("That much force can injure other spots too—does anything else hurt?",'cross',"그 정도 힘이면 다른 곳도 다칠 수 있어요, 다른 데 아픈 곳은요?",'동반 손상')},
 "통증 점수를 먼저 묻고, 'that pain'으로 그 통증이 어떻게 생겼는지 넘어졌는지 물체가 떨어졌는지 묻고, 'Whichever it was'로 높이나 무게를 묻고, 'That much force'로 함께 다쳤을 수 있는 다른 곳을 물어요. 'that pain'·'Whichever it was'·'That much force'가 앞 줄을 가리켜 순서가 하나예요.")
# S5 (O3)
setorder(5,{1:("For the next few days, stay off your foot as much as you can.",'home',"며칠 동안 최대한 딛지 마세요",'휴식'),
 2:("While you're resting it, keep the ankle up above your heart.",'home',"쉬는 동안 발목을 심장보다 높이 두세요",'거상'),
 3:("With it up, ice it for twenty minutes at a time.",'bandage',"올린 채로 한 번에 20분씩 얼음을 대세요",'냉찜질'),
 4:("Between icing sessions, keep it wrapped, but not too tight.",'bandage',"얼음찜질 사이에는 붕대를 감되 너무 조이지 않게 하세요",'압박')},
 "며칠 동안 딛지 말라고 시작하고, 'While you're resting it'으로 쉬는 동안 발목을 올리라고 하고, 'With it up'으로 올린 채 얼음을 대라고 하고, 'Between icing sessions'로 얼음 사이에 붕대를 감는다고 이어요. 휴식·거상·냉찜질·압박이 앞 줄을 가리키는 말로 묶여 순서가 하나예요.")
# S6 (O4)
setorder(6,{2:("Even covered, it can get infected, so you'll get antibiotics.",None,"덮어도 감염될 수 있어서 항생제를 맞으실 거예요",None),
 3:("That same infection risk is why I ask: when was your last tetanus shot?",None,"같은 감염 위험 때문에 여쭤요, 마지막 파상풍 주사는 언제였나요?",None)},
 "뼈가 보여서 바로 덮는다고 알리고, 'Even covered'로 덮어도 감염될 수 있어 항생제를 준다고 이어, 'That same infection risk'로 같은 위험 때문에 파상풍 접종을 묻고, 'With all that done'으로 의사가 뼈를 본다고 이어요. 'Even covered'·'That same infection risk'·'all that'이 앞 줄을 가리켜 순서가 하나예요.")
# S9 (O5)
setorder(9,{4:("Each time we check, we'll remind you where you are and what day it is.",None,"살펴볼 때마다 여기가 어디고 오늘이 무슨 요일인지 알려 드릴게요",None)},
 "골절이라는 사실을 먼저 말하고, 'Because of that'으로 서지 못하는 이유를, 'With that in mind'로 통증 관리와 자주 확인을, 'Each time we check'로 확인할 때마다 장소와 요일을 알려 혼란을 막는다고 이어요. 'Because of that'·'With that in mind'·'we check'가 앞 줄을 가리켜 순서가 하나예요.")
# S10 (O6)
setorder(10,{2:("They may be able to reattach it, so we're keeping the finger cool and moist.",None,"재접합할 수 있을지도 몰라서 손가락을 시원하고 촉촉하게 보관하고 있어요",None)},
 "전문의를 먼저 부르고, 'They'로 재접합할 수 있을지도 몰라 손가락을 차갑고 촉촉하게 보관한다고 이어, 'For that reason'으로 얼음에 직접 두지 않게 하고, 'Through all of this'로 출혈 조절을 이어 간다고 마무리해요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")
# S11 (O7)
setorder(11,{1:("You take a blood thinner—which one, and when did you last take it?",None,"혈액 희석제를 드시는데, 어떤 약이고 마지막으로 언제 드셨나요?",None),
 3:("Because it can grow, we'll check the limb often for tightness and color.",None,"붓기가 커질 수 있어서 사지를 자주 확인해 조임과 색을 볼게요",None)},
 "복용 중인 약과 마지막 복용 시각을 먼저 묻고, 'That'으로 그 약 때문에 붓기가 커질 수 있다고 이유를 말하고, 'Because it can grow'로 그 붓기가 커질 수 있어서 자주 확인하겠다고 하고, 'Between our checks'로 그 사이에 악화되면 알리라고 해요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")
# S12 (O8)
setorder(12,{3:("To keep it healing that well, we'll take an x-ray now and another at follow-up.",None,"그만큼 잘 낫도록 지금 엑스레이를 찍고 추적 때 한 번 더 찍을 거예요",None),
 4:("Please don't skip that follow-up visit—it matters for growth.",None,"그 추적 방문은 꼭 오세요, 성장에 중요해요",None)},
 "성장판 근처라는 설명으로 시작하고, '\"growth plate\"'를 가리켜 걱정을 인정하고 안심을 주고, 'To keep it healing that well'로 엑스레이 계획을 말한 뒤, 'that follow-up'으로 추적 방문을 거르지 말라고 마무리해요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")
# S13 (O9)
setorder(13,{3:("Even without a diagnosis like that, have you had unexplained pain or weight loss lately?",None,"그런 진단이 없더라도 최근 원인 모를 통증이나 체중 감소가 있었나요?",None),
 4:(None,None,"어떻게 답하셔도 왜 뼈가 약한지 보려고 검사를 할 거예요",None)},
 "약한 힘에 부러졌다는 소견으로 시작하고, 'Because of that'으로 병력을 묻고, 'a diagnosis like that'으로 이어 증상을 묻고, 'Whatever you tell me'로 어떤 답이어도 검사를 한다고 마무리해요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")
# S14 (O10)
setorder(14,{4:("Once they're here, they'll help us check the rest of your pain and history.",None,"통역사가 오면 나머지 통증과 병력을 함께 확인할 거예요",None)},
 "통역사를 부른다고 알리고, 'They'로 통역사가 올 때까지 손으로 아픈 곳을 가리키게 하고, 'that spot'으로 확인하고, 'Once they're here'로 통역사가 오면 나머지 통증과 병력을 이어서 확인한다고 마무리해요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")
# S17 (O11)
setorder(17,{3:("To slow that bleeding, we're placing a binder around your pelvis.",None,"그 출혈을 늦추려고 골반에 바인더를 두르고 있어요",None)},
 "혈압이 떨어져 서두른다고 알리고, 'The reason'으로 내부 출혈 가능성을 말하고, 'To slow that bleeding'으로 그 출혈을 늦추려 바인더를 적용한다고 하고, 'all of this'로 가만히 있어 달라고 부탁해요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")
# S19 (O12)
setorder(19,{4:("With the splints on, we'll move you carefully so the bones stay still.",None,"부목을 댄 채로 뼈가 움직이지 않게 조심히 옮길게요",None)},
 "긴 뼈 골절이 출혈을 숨긴다는 설명으로 시작하고, \"That's why\"로 혈압이 낮아 빠르게 수혈한다고 이어, 'the blood'로 부목과 보온을 말하고, 'With the splints on'으로 부목을 댄 채 조심스럽게 옮긴다고 닫아요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")
# S20 (O13)
setorder(20,{3:("With pulses confirmed, the leg is splinted and the wound dressed for transport.",'bandage',"맥박을 확인하고 이송을 위해 다리를 부목하고 상처를 드레싱했습니다",'상태'),
 4:("Before that splint went on, tetanus was updated and antibiotics were given at ten past.",'pill',"그 부목을 대기 전에 파상풍을 갱신했고 항생제는 10분에 투여했습니다",'처치')},
 "어떤 손상인지 먼저 말하고, 'On that leg'로 그 다리의 신경혈관 상태를, 'With pulses confirmed'로 맥박 확인 뒤 부목과 드레싱을 했다고, 'Before that splint'로 개방골절이라 부목 전에 파상풍과 항생제를 먼저 했다고 보고해요. 앞 줄을 가리키는 말이 순서를 정해 줘요.")

# ---- context (6) ----
def ctx(si):
    return [n for n in S[si-1]['nuance'] if n['kind']=='context'][0]
c=ctx(18); c['word']='dyspnea'; c['ko']='호흡곤란'
c['scenes'][0]['en']='New-onset dyspnea, SpO2 88% RA, petechiae across chest.'
c['scenes'][1]['en']='He has new dyspnea, satting 88 on room air, with petechiae across his chest.'
c['scenes'][2]['en']='Are you experiencing any dyspnea?'
c['why']='dyspnea(호흡곤란)는 차트와 의료진의 말이에요. 환자에게는 short of breath로 물어야 바로 알아듣고 대답해요.'
c=ctx(16); c['word']='fasciotomy'; c['ko']='근막절개술'
c['scenes'][0]['en']='Calf is tense with pain on passive stretch—can you evaluate her for a fasciotomy?'
c['scenes'][1]['en']='Pain w/ passive stretch, compartments tense; ortho notified 2140, plan fasciotomy.'
c['scenes'][2]['en']='You need an emergent fasciotomy.'
c=ctx(14); c['word']='allergies'; c['ko']='알레르기'
c['scenes'][0]['en']='Pt Indonesian-speaking; allergies reviewed via video interpreter, ID 4471.'
c['scenes'][1]['en']="She speaks Indonesian, so I'm getting a video interpreter to check her allergies."
c['scenes'][2]['en']="Tell her I need to know if she's allergic to anything."
c['why']="의료 통역을 쓸 때는 통역사가 아니라 환자를 보고 1인칭으로 말해요. 'Tell her…'처럼 통역사에게 말하면 환자가 대화에서 밀려나요."
c=ctx(13)
c['scenes'][2]['en']='Any history of cancer, or known bone mets?'
c['why']='bone mets(뼈 전이) 같은 말은 의료진끼리 쓰는 말이고 환자에게는 겁을 줘요. 환자에게는 cancer를 그대로, 치료받은 적이 있는지처럼 담담하게 물어요.'
c=ctx(4)
c['scenes'][1]['en']='He had a fall off a ladder, about six feet, and landed on an outstretched hand.'
c['why']=c['why']+' FOOSH는 fall on outstretched hand의 차트 약어예요.'
c=ctx(5)
c['scenes'][2]['fix']='Put an ice pack on it for twenty minutes, then take it off for a while, a few times a day.'

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=1000)
