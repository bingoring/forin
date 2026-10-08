import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-obgyn.yaml'
d=yaml.safe_load(open(P)); S=d['situations']
def sent(a,b): return S[a]['sentences'][b]
def setf(x,k,old,new):
    assert x[k]==old,(k,x[k],old); x[k]=new
def rep(x,k,old,new,sub=False):
    if sub:
        assert old in x[k],(k,old); x[k]=x[k].replace(old,new)
    else: setf(x,k,old,new)
def line(si,li,en=None,ko=None,old_en=None):
    l=S[si]['order']['lines'][li]
    if old_en: assert l['en']==old_en,(si,li,l['en'])
    l['en']=en; l['ko']=ko
def owhy(si,old,new):
    o=S[si]['order']; assert old in o['why'],(si,old); o['why']=o['why'].replace(old,new)
# ---- order
line(19,1,"I'm so deeply sorry — the ultrasound shows it has stopped.","정말 안타깝습니다, 초음파에서 심박이 멈춘 것이 보여요","I'm so deeply sorry — we're not able to find it.")
owhy(19,"심박을 찾지 못했다는 사실을 말하고","초음파로 확인한 사실을 말하고")
line(17,1,"That's because you may be bleeding inside — your belly is rigid and very tender.","배 안에서 출혈이 있을 수 있어서예요, 배가 딱딱하고 아주 아파요","That's because your belly is rigid and very tender — something serious is happening.")
line(17,2,"To replace what you're losing, we're giving you fluids and blood.","잃고 있는 만큼 채우려고 수액과 혈액을 드려요","To treat something that serious, we're giving you fluids and blood.")
S[17]['order']['why']="혈압이 떨어진다고 알리고, 그 이유(배 안의 출혈)를 설명하고, 잃는 피를 수액과 혈액으로 채우며, 그것이 들어가는 동안 수술실로 모셔요. 'That's because'·'what you're losing'·'those fluids and blood'가 앞 줄을 가리켜요."
line(14,3,"With bleeding like this, we're getting you to the operating room quickly.","이렇게 출혈이 많아서 빠르게 수술실로 모실게요","Because of that tightness, we're getting you to the operating room quickly.")
owhy(14,"그 때문에 수술실로 모신다고 해요","출혈이 이렇게 많아 수술실로 모신다고 해요")
owhy(14,"'that tightness'","'bleeding like this'")
line(9,3,"After that exam, we'll do an ultrasound first, since it's safest for the baby.","그 진찰 다음에, 아기에게 가장 안전한 초음파부터 할게요","Based on your answers, we'll do an ultrasound first, since it's safest for the baby.")
owhy(9,"그 자리를 눌러 보고, 답을 바탕으로 초음파부터 하겠다고 말해요","그 자리를 눌러 진찰한 다음 초음파부터 하겠다고 말해요")
owhy(9,"'your answers'","'that exam'")
line(12,3,"Whatever the answer, we'll do a swab test to find out exactly what's causing this.","답이 어떻든, 정확한 원인을 찾으려고 면봉 검사를 할게요","With that history, we'll do a swab test to find out exactly what's causing this.")
owhy(12,"그 병력을 근거로 검사를 안내해요","답이 어떻든 검사를 안내해요")
owhy(12,"'that history'","'the answer'")
line(1,3,"If it's positive, that date helps us figure out how far along you are.","양성이면 그 날짜로 임신 주수를 알아볼 수 있어요","That date and the test will help us figure out how far along you are.")
owhy(1,"날짜와 검사로 주수를 알아낸다고 설명해요","양성이면 그 날짜로 주수를 알아본다고 설명해요")
owhy(1,"'the test'","'it's positive'")
line(4,2,"Do you have prenatal records for this pregnancy and that one with you?","이번 임신과 그 임신의 산전 기록을 가지고 계신가요?","Do you have records from that pregnancy with you?")
owhy(4,"그 임신의 기록을 가지고 있는지","이번 임신과 그 임신의 산전 기록을 가지고 있는지")
line(5,3,"During and after that scan, tell me immediately if the pain or dizziness gets worse.","초음파 중에도 그 뒤에도, 통증이나 어지러움이 심해지면 바로 말씀해 주세요","Scan or no scan, tell me immediately if the pain or dizziness gets worse.")
owhy(5,"초음파를 하든 안 하든 악화를 바로 알려 달라고 부탁해요","초음파를 하는 동안과 그 뒤에도 악화를 바로 알려 달라고 부탁해요")
owhy(5,"'Scan or no scan'","'that scan'")
line(16,1,"You've done so well — the head is showing, so please stop pushing for a moment.","정말 잘하고 계세요, 머리가 보이니 잠시 힘주기를 멈춰 주세요","You've done so well the head is showing — please stop pushing for a moment.")
line(0,3,"Thanks for all that — we'll check on you and the baby right away.","말씀해 주셔서 고마워요, 당신과 아기를 바로 확인할게요","Thanks for telling me all that — we'll check on you and the baby right away.")
# optional with prescribed text
line(2,2,"How long has that kind of pain been there?","그런 통증이 얼마나 됐나요?","How long has it been like that?")
line(7,2,"Whatever the number, we'll check your electrolytes and give you IV fluids.","횟수가 얼마든 전해질을 확인하고 정맥 수액을 드릴게요","Either way, we'll check your electrolytes and give you IV fluids.")
owhy(7,"'Either way'","'Whatever the number'")
line(18,2,"While we do that, we're weighing the pads to measure how much blood you've lost.","그러는 동안, 패드 무게를 재서 출혈량을 측정하고 있어요","With your uterus that soft, how much blood have you lost since the delivery?")
owhy(18,"그 상태를 감안해 출혈량을 묻고","그러는 동안 패드 무게로 출혈량을 재고")
owhy(18,"'that soft'","'While we do that'")
# ---- decoys
for (a,b,o,n) in [(5,5,'ask a friend','on the monitor'),(17,5,'to start','to the OR'),(18,4,'to watch it','your bladder'),(16,4,'after this contraction','with your legs'),
  (6,3,"I'm certain",'in the chart'),(15,1,'Tell the doctor','or any itching'),(19,1,"and you couldn't",'at the clinic'),(13,4,'you ask for it',', the cheaper'),
  (0,4,', or lighter',', or clotted'),(1,0,'to the day','in your diary'),(3,2,'to hurry you','to test you'),(6,6,'just outside','with your chart'),
  (7,3,'less than','at night'),(14,1,'is in the lobby','is on the phone'),(18,2,'is in the hall','is on the radio')]:
    setf(sent(a,b),'decoy',o,n)
# ---- blanks
def opt(a,b,o,n):
    x=sent(a,b)['blank']
    for e in x['options']:
        if e['en']==o: e['en']=n; return
    raise Exception((a,b,o))
def setopts(a,b,ans,opts):
    x=sent(a,b)['blank']; x['answer']=ans; x['options']=[{'en':e} for e in opts]
opt(0,4,'staining','clots')
setopts(6,6,'right here',['right here','out front','at the desk','down the hall'])
opt(9,3,'spread','eased')
opt(12,3,'other','long-term')
setopts(16,0,'right here',['right here','at the desk','down the hall','out front'])
opt(5,4,'quietly','slowly'); opt(9,2,'quietly','cheaply'); opt(11,2,'quietly','occasionally'); opt(14,5,'quietly','smoothly')
# ---- distractorsKo
def dko(a,b,o,n):
    x=sent(a,b)['distractorsKo']; assert o in x,(a,b,o); x[x.index(o)]=n
dko(5,1,'아기 심장 소리를 들어 볼게요','소변으로 임신 검사를 먼저 할게요')
dko(5,4,'아기 심박을 확인해 볼게요','정맥 주사를 두 군데 잡을게요')
dko(4,4,'진료 기록은 어디에서 받으셨나요?','지금 드시는 약이 있나요?')
dko(15,2,'혈압을 계속 다시 재 볼게요','혈압을 15분마다 잴게요')
dko(3,4,'검사 컵은 화장실에 있어요','결과는 보통 몇 분이면 나와요')
dko(17,1,'이름이 어떻게 되세요?','수술실에 연락해 두었어요')
# ---- why
rep(sent(6,3),'why',sent(6,3)['why'],"Based on…으로 근거를 먼저 말하고 I believe로 단정을 피해요. 유산 진단과 고지는 보통 의사가 하므로, 간호사는 의사가 설명한 내용을 이어 받거나 함께 있을 때 이렇게 말해요.")
x=sent(19,4); x['why']=x['why'].rstrip()+" 사망 확인과 고지는 보통 의사가 초음파로 확인한 뒤 하고, 간호사는 곁에서 같은 말을 분명히 이어 가요."
x=sent(8,3); x['why']=x['why'].rstrip()+" 증거 채취를 원할 수도 있으니 정하기 전까지 씻거나 옷을 갈아입지 않도록 부탁하고, 검사는 보통 성폭력 전담 간호사(SANE)가 해요."
x=sent(15,5); x['why']=x['why'].rstrip()+" (경련이 나면 같은 약을 더 써요)"
# ---- context
c=[n for n in S[15]['nuance'] if n.get('word')=='eclampsia'][0]
assert c['scenes'][0]['en']=='BP 168/112, HA, visual changes; r/o eclampsia, seizure precautions.'
c['scenes'][0]['en']='BP 168/112, HA, visual changes; high risk for eclampsia, seizure precautions.'
c=[n for n in S[17]['nuance'] if n.get('word')=='hypotensive'][0]
c['why']="hypotensive(저혈압의)는 의료진끼리 쓰는 말이라 환자는 알아듣지 못해요. 환자에게는 무슨 일인지와 무엇을 하고 있는지를 쉬운 말로 함께 말해요."
# ---- tag / icon
setf(sent(10,3),'tag','가족 통역 X','가족 통역 안 함')
setf(sent(8,1),'icon','shield','handshake2'); setf(sent(8,5),'icon','shield','speech')
yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=1000)
