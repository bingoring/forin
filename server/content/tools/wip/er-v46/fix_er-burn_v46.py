import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-burn.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def sent(si,j): return S[si]['sentences'][j]

# ---- why ----
WHY={
 (16,4):"We want…to로 목표를 함께 정한 것처럼 말해 환자가 협력자가 돼요. 혈압과 맥박도 보지만, 화상 수액이 충분한지는 주로 시간당 소변량으로 판단해요.",
 (18,1):"We may…로 확정이 아닌 가능성으로 말해요. 가피절개는 조인 가피를 따라 길고 얕게 갈라서 가슴이 다시 부풀 수 있게 해요.",
 (9,2):"may need로 아직 결정이 아니라 가능성이라고 알려 줘요. 가피가 붓는 조직을 조이면 의사가 가피를 따라 갈라 압력을 풀어요(가피절개).",
 (8,0):"so로 이유와 조치를 이어요. 전류가 심장을 지나면 부정맥이 생길 수 있어서 전기 손상 환자는 심전도를 찍고, 고전압·의식 소실·심전도 이상이 있으면 계속 모니터해요.",
 (11,0):"so로 이유를 먼저 대고 결과를 말해 겁주지 않고 설명해요. 나이가 들면 진피가 얇아져서 같은 열에도 더 깊이 손상될 수 있어요.",
 (11,2):"medicines and health problems 두 가지를 함께 물어 한 번에 병력을 모아요. 혈액 희석제는 출혈과 수술 계획에, 당뇨약은 혈당 관리에 영향을 줘요.",
 (8,3):"now로 바로 시작한다고 알려 무엇이 붙는지 미리 알게 해요. 가슴에 붙인 전극이 심장 리듬을 계속 보여 줘서 이상이 생기면 바로 알 수 있어요.",
 (18,4):"may need…to로 필요하다면 하게 될 일을 목적과 함께 말해요. 환기가 나아지지 않으면 의사가 가슴 둘레의 가피를 길게 절개해 호흡 운동을 되살려요.",
}
for (si,j),w in WHY.items(): sent(si,j)['why']=w

# ---- blank ----
def setblank(si,j,answer,opts):
    t=sent(si,j); b=t['blank']
    old=[o['en'] for o in b['options']]; k=old.index(b['answer'])
    opts=list(opts); assert opts[0]==answer and len(set(opts))==4
    rest=opts[1:]; new=rest[:k]+[answer]+rest[k:]
    b['answer']=answer; b['options']=[{'en':x} for x in new]
BL=[(10,3,'home','home hurt awake burned'),(13,2,'skin','skin eye clothing hair'),(13,3,'medicine','medicine food latex tape'),
 (19,2,'potassium','potassium sodium sugar calcium'),(8,3,'monitor','monitor pump medicine drip'),(8,2,'dizzy','dizzy hungry sleepy chilly'),
 (5,4,'harder','harder easier deeper calmer'),(2,3,'serious','serious mild minor harmless'),(1,3,'legs','legs hands face feet'),
 (7,2,'chemical','chemical soot oil blood'),(10,1,'edges','edges color smell size'),(15,3,'breathe','breathe talk cough swallow'),
 (17,4,'oxygen','oxygen|sugar|potassium|blood pressure'),(18,1,'expand','expand shrink harden close'),
 (0,2,'covering','covering cooling soothing protecting'),(1,0,'skin','skin muscle hair fat'),(1,4,'number','number bag pump line'),
 (4,2,'scale','scale form test list'),(4,3,'chemical','chemical wire spark heater'),(5,0,'mouth','mouth nose ears eyes'),
 (5,3,'soot','soot blood vomit mucus'),(6,2,'thirsty','thirsty hungry dizzy hot'),(6,4,'working','working leaking failing pooling'),
 (16,1,'working','working leaking dripping stopping'),(7,0,'name','name smell color strength'),(8,0,'heart','heart liver stomach bladder'),
 (9,1,'pulse','pulse color swelling temperature'),(10,2,'injury','injury vaccines weight diet'),(11,4,'take','take keep buy skip'),
 (12,3,'move','move count touch wash'),(12,4,'specialists','specialists volunteers interpreters students'),
 (13,0,'interpreter','interpreter aide educator officer'),(13,4,'repeat','repeat summarize shorten write'),
 (15,2,'calm','calm flat awake busy'),(16,2,'pressure','pressure temperature oxygen weight'),(16,4,'stable','stable low high fast'),
 (20,1,'adequate','adequate low absent excessive'),(20,3,'partial','partial full split total')]
assert len(BL)==38
for si,j,a,o in BL:
    setblank(si,j,a,o.split('|') if '|' in o else o.split())

# ---- decoy ----
for (si,j),old,new in [((4,1),'Did you stay in','Were you near'),((9,3),'right now','to the doctor'),((11,3),'just in case','only today'),
    ((7,4),'if possible','until it stings'),((12,4),'in cooking','in eye and ear'),((16,0),'pills daily','fluids slowly')]:
    t=sent(si,j); assert t['decoy']==old,(si,j); t['decoy']=new

# ---- distractorsKo ----
def dk(si,j,old,new):
    t=sent(si,j); i=t['distractorsKo'].index(old); t['distractorsKo'][i]=new
dk(7,4,'물이 닿지 않게 비닐로 덮어 드릴게요','헹군 물이 눈에 튀지 않게 할게요')
dk(7,1,'물이 닿는 부위를 잘 봐 주세요','눈에도 들어갔으면 바로 씻을게요')
dk(19,4,'소변 색은 이제 걱정 안 하셔도 돼요','신장 수치는 피검사로 따로 확인할게요')
dk(9,0,'화상이 팔 전체로 번질 수 있어요','팔이 많이 부을 수 있어요')
dk(3,1,'얼음 대신 마른 거즈로 덮을게요','다 헹군 뒤에 깨끗한 거즈로 덮을게요')
dk(9,2,'붕대를 조금 느슨하게 다시 감을게요','손가락 색을 자주 볼게요')
dk(4,0,'파상풍 주사는 언제 맞으셨어요?','불을 끄려고 뭘 하셨어요?')

# ---- order ----
def line(si,k,en,icon,ko,note,old=None):
    l=S[si]['order']['lines'][k]
    if old: assert l['en']==old,(si,k,l['en'])
    l.clear(); l.update({'en':en,'icon':icon,'ko':ko,'note':note})
def owhy(si,w): S[si]['order']['why']=w
# S0
line(0,1,"Thanks. First, let me gently remove anything covering the burn.",'bandage','고마워요, 먼저 화상을 덮은 것을 살살 제거할게요','제거')
line(0,2,"Now I can look at how large and deep it is.",'magnify','이제 얼마나 넓고 깊은지 볼 수 있어요','범위')
line(0,3,"Of all those areas, which spot hurts the most?",'pushpin','그 모든 부위 중에서 어디가 가장 아프세요?','통증')
owhy(0,"경위를 묻고, 고맙다고 한 뒤 덮은 것을 먼저 제거하고, 이제 범위와 깊이를 볼 수 있다고 알리고, 그 모든 부위 중 가장 아픈 곳을 물어요. 'Thanks, First'·'Now'·'Of all those areas'가 앞 줄을 가리켜 순서가 하나예요.")
# S5
line(5,1,"Inside, I can see soot at the back of your throat.",'magnify','입안 뒤쪽에 그을음이 보여요','소견',"I see soot around your mouth and nose.")
owhy(5,"입안을 보겠다고 알리고, 안쪽에서 본 소견을 말하고, 그 소견 때문에 증상을 묻고, 어떤 답이든 숨쉬기가 힘들어지면 바로 알리라고 닫아요. 'Inside'·'Because of that'·'In any case'가 앞 줄을 가리켜 순서가 하나예요.")
# S16
line(16,3,"Besides that number, we're watching your pressure and heart rate closely.",'monitor','그 수치 외에도 혈압과 심박수를 면밀히 지켜보고 있어요','감시',"Along with that, we're watching your pressure and heart rate closely.")
owhy(16,"큰 화상으로 체액이 빠진다고 알리고, 그래서 수액을 빨리 준다고 설명하고, 수액이 듣는지 소변량으로 보고, 그 수치 외에 혈압과 맥박도 본다고 닫아요. \"That's why\"·'the fluids'·'Besides that number'가 앞 줄을 가리켜 순서가 하나예요.")
# S19
line(19,2,"If your urine stays dark, we'll give even more.",'shield','소변이 계속 어두우면 더 드릴게요','증량',"With the fluids running, we're watching your potassium and heart rhythm closely.")
line(19,3,"Through all of it, we'll watch your potassium and heart rhythm closely.",'monitor','그 모든 과정 내내 칼륨과 심장 리듬을 면밀히 지켜볼게요','감시',"We'll give extra fluids as needed to keep your kidneys safe.")
owhy(19,"어두운 소변이 근육 파괴일 수 있다고 알리고, 그래서 수액을 준다고 하고, 소변이 계속 어두우면 더 준다고 하고, 그 모든 과정 내내 칼륨과 리듬을 본다고 닫아요. \"That's why\"·'even more'·'Through all of it'이 앞 줄을 가리켜 순서가 하나예요.")
# S10
line(10,2,"Alongside your answers, I'm noting the shape and edges of the burn.",'pencil','답변과 함께 화상의 모양과 경계를 기록하고 있어요','기록',"Your answers help me, because I'm noting the shape and edges of the burn.")
owhy(10,"경위를 차근차근 묻고, 집에 누가 있었는지 묻고, 그 답과 함께 상처 모양을 기록한다고 알린 뒤, 모든 아이에게 하는 일이라고 닫아요. 'it'·'Alongside your answers'·\"That's routine\"이 앞 줄을 가리켜 순서가 하나예요.")
# S18
line(18,1,"I know it's hard to take a full breath with your chest this tight.",'faceWorried','가슴이 이렇게 조이면 숨을 다 들이쉬기 힘드시죠','공감',"That makes it hard to take a full breath when your chest feels tight.")
owhy(18,"화상이 숨쉬기를 조인다고 알리고, 가슴이 이렇게 조이면 깊은 숨이 힘들다고 공감하고, 그래서 절개가 필요할 수 있다고 하고, 그것이 가슴 움직임을 돕는다고 닫아요. 'this tight'·\"That's why\"·'This'가 앞 줄을 가리켜 순서가 하나예요.")
# S8
line(8,1,"Even if those wounds look small, electricity can damage deep tissue.",'bulb','그 상처가 작아 보여도 전기는 깊은 조직을 손상시킬 수 있어요','설명',"Those wounds look small, but electricity can damage deep tissue.")
# S1
line(1,1,"Of those regions, each arm counts as about nine percent.",'magnify','그 부위들 중 팔 하나는 약 9퍼센트로 쳐요','값',"In those regions, each arm counts as about nine percent.")
# S6
line(6,2,"To check it's the right amount, we measure your urine.",'lab','맞는 양인지 확인하려고 소변량을 측정해요','측정',"To check that amount, we measure your urine.")
owhy(6,"체액 손실과 보충을 알리고, 그 양을 계산하는 재료를 말하고, 맞는 양인지 소변으로 확인한다고 설명한 뒤, 결과가 뜻하는 바를 닫아요. 'the amount'·\"To check it's the right amount\"·'a good result'가 앞 줄을 가리켜 순서가 하나예요.")
# S7
line(7,2,"Along with that, we'll rinse your skin with lots of water, not neutralize the chemical.",'shield','그와 함께 화학물질을 중화하지 않고 물을 많이 써서 피부를 헹굴게요','헹굼',"Along with that, we'll rinse your skin with lots of water, not neutralize it.")

# ---- context ----
def ctx(si):
    return [n for n in S[si]['nuance'] if n['kind']=='context'][0]
c=ctx(1); c['word']='TBSA'; c['ko']='화상 체표면적(TBSA)'
assert c['scenes'][0]['en']=='Est. TBSA 27 percent, partial thickness, rule of nines.'
c['scenes'][0]['en']='Est. TBSA 27%, partial thickness, rule of nines.'
c=ctx(3); c['word']='hypothermia'; c['ko']='저체온'
sc=c['scenes']
sc[0]['en']='Pt shivering, reports feeling cold. Cooling stopped for hypothermia risk; warm blankets applied.'
sc[1]['en']="She's cold and shivery — let's stop the water before hypothermia sets in."
sc[2]['en']="You're developing hypothermia."
sc[2]['fix']="You're getting cold, so I'm going to stop the water and warm you up."
c=ctx(11); sc=c['scenes']
sc[0]['en']='Older adult, thin skin; burn depth may be underestimated.'
sc[2]['fix']="Skin gets thinner as we all get older, so a burn can be deeper than it looks — we'll check it closely."
c['why']="'elderly'로 부르고 피부가 'too thin'이라고 하면 환자 본인에게는 늙고 약하다는 딱지처럼 들려요. 미국 의학 글쓰기도 'older adults'를 권해요. 나이 드는 일을 '우리'의 일로 말하고 이유는 사실대로 전해요."
c=ctx(16); sc=c['scenes']
sc[2]['en']='Your urine output is only 20 mL an hour, under 0.5 per kilo.'
c['why']="mL·per kilo 같은 수치와 기준은 의료진끼리의 말이에요. 환자에게는 소변이 기대만큼 나오지 않는다는 사실과 다음 조치를 쉬운 말로 전해요."
c=ctx(18); c['word']='circumferential'; c['ko']='둘레를 감싼(원주형)'

# ---- swap ko / tag ----
sw=[n for n in S[5]['nuance'] if n['kind']=='swap'][0]
sw['ko']='환자 입과 코 주변에 그을음이 보여요'
t=sent(10,2); assert t['tag']=='전 아동 확인'; t['tag']='모든 아이 확인'

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=1000)
