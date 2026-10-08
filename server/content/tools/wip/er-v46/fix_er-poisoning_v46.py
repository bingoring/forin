import yaml, re
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-poisoning.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def sent(si,j,st):
    t=S[si]['sentences'][j]; assert t['en'].startswith(st),(si,j,t['en']); return t
def blank(si,j,ans,others):
    t=S[si]['sentences'][j]; b=t['blank']
    assert len(set(others+[ans]))==4 and len(others)==3,(si,j)
    assert len(re.findall(r'(?i)(?<![\w-])'+re.escape(ans)+r'(?![\w-])',t['en']))==1,(si,j,ans)
    k=[o['en'] for o in b['options']].index(b['answer'])
    o=list(others); o.insert(k,ans)
    t['blank']={'answer':ans,'options':[{'en':x} for x in o]}
def dk(si,j,idx,old,new):
    t=S[si]['sentences'][j]; assert t['distractorsKo'][idx].startswith(old),(si,j,idx,t['distractorsKo'])
    t['distractorsKo'][idx]=new
def decoy(si,j,old,new):
    t=S[si]['sentences'][j]; assert t['decoy']==old,(si,j,t['decoy']); t['decoy']=new
def why(si,j,txt): S[si]['sentences'][j]['why']=txt
def line(si,k,st,en,ko,note=None,icon=None):
    l=S[si]['order']['lines'][k-1]; assert l['en'].startswith(st),(si,k,l['en'])
    l['en']=en; l['ko']=ko
    if note: l['note']=note
    if icon: l['icon']=icon
    assert len(en.split())<=15,(si,k,len(en.split()))
def ocard(si,txt): S[si]['order']['why']=txt

# ---- why W1-W5 (+선택 12.2, 8.4)
why(5,4,"now로 지금 시작한다고 말하고 so로 목적을 이어요. NAC는 보통 정맥으로 몇 시간에 걸쳐 주고, 시작과 기간은 수치와 먹은 시각을 보고 의사가 정해요.")
why(10,3,"by mistake로 환자가 말한 실수 복용을 그대로 받아, 부담 없이 양을 말하게 해요. 의도적이었을 가능성은 따로 물어 확인해요.")
why(4,1,"find her로 발견한 순간을 기준점으로 삼아요. 먹은 시각은 모르니 마지막으로 괜찮았던 시각과 발견 시각을 함께 알아야 먹은 시각의 범위를 좁힐 수 있어요.")
why(18,3,"시력 변화는 메탄올 독성의 중요한 단서라 지금 상태를 기록해 두고 변화와 비교해요.")
why(19,1,"가슴 두근거림이나 어지럼 같은 느낌은 모니터와 함께 악화를 알리는 단서라서 환자가 바로 말하게 해요.")
why(12,2,"Stay with me로 의식을 붙잡는 말을 먼저 하고 I'll keep checking으로 자주 와서 확인한다고 약속해요. 술과 진정 약물이 겹치면 갑자기 처질 수 있어서 자주 확인해요.")
why(8,4,"helps로 중탄산염이 몸을 도와서 하는 일이라고 말해요. 치료 중에는 소변 산도와 칼륨을 함께 확인해요.")

# ---- 빈칸 B1-B40 (+ 안전 보강)
blank(0,1,'About',['Exactly','Precisely','Just'])
blank(1,5,'closely',['briefly','remotely','occasionally'])
blank(2,5,'home',['work','church','daycare'])
blank(0,4,'safe',['calm','awake','comfortable'])
blank(2,0,'hurt',['treat','calm','numb'])
blank(2,4,'only',['first','next','usual'])
blank(5,5,'explain',['record','check','time'])
blank(3,4,'flush',['numb','check','test'])
blank(3,5,'breathing',['swallowing','seeing','sleeping'])
blank(4,0,'left',['missing','spilled','crushed'])
blank(4,5,'care',['notes','pictures','measurements'])
blank(6,1,'wake',['sit','stand','cheer'])
blank(6,5,'again',['first','later','sooner'])
blank(7,3,'airway',['pain','comfort','sleep'])
blank(9,3,'change',['repeat','freeze','return'])
blank(7,4,'seizures',['bleeding','rashes','fever'])
blank(8,4,'bicarbonate',['oxygen','insulin','calcium'])
blank(9,0,'rhythm',['valves','sounds','muscle'])
blank(9,4,'ready',['trained','allowed','unable'])
blank(9,5,'watch',['move','clean','adjust'])
blank(10,2,'bruising',['swelling','itching','sweating'])
blank(10,5,'reversal',['pain','sleeping','nausea'])
blank(11,0,'pain',['danger','shock','denial'])
blank(11,3,'know',['think','guess','bet'])
blank(14,2,'care team',['family','employer','insurance'])
blank(11,4,'alone',['wrong','weak','broken'])
blank(13,2,'sick',['cold','hungry','sleepy'])
blank(14,5,'happened',['changed','hurt','helped'])
blank(15,0,'toxidrome',['seizure','stroke','head injury'])
blank(15,2,'Unknown',['Intentional','Accidental','Chronic'])
blank(16,0,'drooling',['bleeding','itching','shivering'])
blank(16,4,'lungs',['legs','ankles','belly'])
blank(17,1,'trigger',['shivering','feeding','vomiting'])
blank(17,2,'supplement',['diet','exercise','routine'])
blank(17,4,'cooling',['oxygen','nutrition','counseling'])
blank(17,5,'stop',['list','review','check'])
blank(19,1,'worse',['better','easier','quieter'])
blank(19,5,'team',['pharmacy','family','lab'])
blank(20,3,'transport',['triage','handoff','intake'])
blank(20,0,'ninety',['nineteen','thirty','nine'])
blank(20,5,'report',['meds','fluids','blood'])
blank(20,4,'pressure',['sugar','temperature','pupils'])
# 안전 보강: 오답으로도 해로운 지시를 보이지 않기
blank(8,5,'breathing',['pain','mood','sleep'])          # 계속 확인을 멈추라는 skip/stop 제거
blank(12,2,'checking',['calling','waiting','texting'])  # quit/stop 제거
blank(16,5,'atropine',['oxygen','fluids','steroids'])   # 해독제를 끊으라는 quit/pause 제거
blank(12,5,'awake',['calm','still','seated'])           # 진정 환자에게 asleep 지시 제거
blank(18,1,'urgent',['daily','brief','simple'])         # 투석을 outpatient/routine으로 미루는 말 제거
blank(1,1,'important',['tasty','painless','boring'])    # 'optional' 안심 제거

# ---- decoy
decoy(9,5,'in bed','after the test')
decoy(2,1,'or tell anyone','for being here')
decoy(5,4,'next week','for you')          # NAC를 다음 주에 시작하는 조립 방지
decoy(7,4,'all at once','at the bedside') # 역전제 한꺼번에 조립 방지
decoy(10,5,'after lunch','for the lab')   # 역전제를 점심 뒤로 미루는 조립 방지

# ---- distractorsKo K1-K29 (+ 안전 보강)
dk(2,1,1,'지금 퇴원','지금 활력징후를 잴게요')
dk(6,5,1,'지금 퇴원','보호자분 연락처를 적어 주시겠어요?')
dk(13,0,0,'산소 수치가 정상이니','두통은 언제부터 있었어요?')
dk(18,0,1,'시력은 곧','다른 분도 같이 드셨나요?')
dk(18,1,1,'투석은 퇴원한','소변 검사를 한 번 더 할게요')
dk(12,3,0,'술과 약을 같이','술은 언제 마지막으로 드셨어요?')
dk(12,3,1,'술이 깨면','드신 수면제 이름을 아세요?')
dk(1,0,0,'이 약은 위를','천천히 다 드시면 돼요')
dk(5,2,0,'이 약은 통증을','이 약은 정맥으로 몇 시간에 걸쳐 들어가요')
dk(5,2,1,'이 약은 위 속','간 수치는 내일 아침에 다시 볼게요')
dk(8,1,0,'수액은 팔 대신','소변 검사를 몇 번 할게요')
dk(8,3,0,'빠른 호흡은 아스피린이','숨이 더 차면 바로 말씀해 주세요')
dk(8,4,0,'중탄산염은 위산을','중탄산염은 정맥으로 천천히 들어가요')
dk(8,4,1,'중탄산염은 열을','칼륨 수치도 함께 볼게요')
dk(9,1,0,'이 약은 심장 박동을','이 약은 정맥으로 들어가요')
dk(9,1,1,'이 약은 혈압을','소변량도 같이 볼게요')
dk(13,4,0,'산소 수치가 낮으면','피 검사 결과는 곧 나와요')
dk(16,0,0,'이 증상은 탈수','그 살충제 통을 가져오셨나요?')
dk(16,0,1,'이 증상은 감기','보호복을 입고 씻겨 드릴게요')
dk(16,1,0,'아트로핀으로 열을','숨소리를 계속 들어 볼게요')
dk(16,1,1,'아트로핀으로 통증을','맥박이 빨라지는지 볼게요')
dk(16,4,0,'아트로핀은 폐를','가래를 자주 뽑아 드릴게요')
dk(16,4,1,'아트로핀은 맥박을','동공 크기도 같이 볼게요')
dk(0,3,1,'확실하시면','약은 집에서 드셨어요?')
dk(2,2,1,'지금도 그런','오늘 술도 드셨어요?')
dk(14,2,0,'말씀하신 내용은 가족분께','원하시면 상담 선생님도 불러 드릴게요')
dk(14,2,1,'말씀하신 내용은 다른 병원에도','검사 결과는 의사 선생님이 설명하실 거예요')
dk(14,4,0,'여기서는 누구도','약을 어디서 구하셨는지 여쭤봐도 될까요?')
dk(17,4,0,'진정시키는 약을','체온을 30분마다 잴게요')
dk(17,4,1,'팔에 얼음','드신 약 목록을 보여 주세요')
dk(18,5,0,'서두르는 이유는 시력','투석실에 연락해 둘게요')
dk(19,0,0,'리듬이 불안정한 건','심전도를 한 번 더 찍을게요')
dk(20,4,0,'기도는 보호하고 있고','동공은 양쪽 다 커져 있습니다')
dk(20,5,0,'기도와 혈압은 제가','의사 선생님은 지금 오고 계십니다')
dk(20,5,1,'혈압만 먼저','심전도를 바로 다시 찍어 주세요')
dk(15,0,0,'동공이 크고','날록손 0.4 mg 들어갔습니다')
dk(15,0,1,'동공은 정상이고','보호자가 약병을 가져왔습니다')
dk(19,2,0,'QRS가 좁고','제세동기 패드를 붙였습니다')
dk(19,2,1,'과다복용인데','중탄산염을 한 번 더 준비해 주세요')
dk(20,2,0,'마지막 혈압은 120','이송 중 수액이 1 L 들어갔습니다')
dk(0,0,1,'토하신 적은','평소 드시는 약이 있으세요?')
dk(0,2,1,'약을 드신 뒤에 토하셨나요','그 약은 누구 약이었어요?')
# 안전 보강: 틀린 안심·위험 처치·틀린 의학 설명을 오답 뜻에서 제거
dk(1,4,0,'잘게 부숴서','조금씩 나눠 드셔도 돼요')
dk(1,5,0,'토하면 바로 활성탄을','토하면 몸을 옆으로 돌려 드릴게요')
dk(1,1,0,'약은 식사 후에','병에 남은 건 제가 치울게요')
dk(1,1,1,'천천히 쉬면서','컵은 제가 들고 있을게요')
dk(13,1,0,'산소 마스크는 몇 분만','두통이 심하면 바로 말씀해 주세요')
dk(13,1,1,'산소는 코로만','마스크가 답답하면 알려 주세요')
dk(17,1,0,'해열제를 먼저','근육이 뻣뻣한지 먼저 볼게요')
dk(17,0,0,'고열은 감염','열이 얼마나 높은지 재 볼게요')
dk(17,0,1,'씰룩임은 곧','씰룩임은 언제부터 있었어요?')
dk(17,5,0,'이 약들은 수치를','약 이름과 용량을 적어 주세요')
dk(17,5,1,'이 약들은 당분간','새로 드신 약부터 알려 주세요')
dk(8,0,0,'귀 울림은 곧','귀 울림이 심해지면 알려 주세요')
dk(2,3,0,'이런 생각은 곧','지금 곁에 있어 줄 사람이 있나요?')
dk(13,3,1,'두통은 곧','다른 증상은 없으셨어요?')
dk(12,5,0,'물을 조금','팔을 들어 보실 수 있나요?')
dk(16,2,0,'몸에 묻은 건 거즈로','벗긴 옷은 따로 봉투에 담을게요')
dk(16,2,1,'몸을 따뜻한 담요로','처치하는 사람은 보호구를 입을게요')

# ---- order O1-O17 (+ I1)
line(0,4,'Do you have the bottle',"Whatever else it was, do you have its bottle or package?","그게 뭐였든, 그 약병이나 포장을 가지고 계신가요?")
ocard(0,"무엇을 먹었는지 묻고, 그 약의 개수와 시각을 묻고, 그 양과 함께 먹은 것을 확인한 뒤, 'anything else'가 가리킨 그 밖의 것까지 병이나 포장이 있는지 물어요. 'those pills'·'that amount'·'Whatever else'가 앞 줄을 가리켜 순서가 하나예요.")
line(2,3,'Thank you for telling me',"Whatever your answer, I won't judge you, and I'm keeping you safe.","어떤 대답이든 판단하지 않을게요, 안전하게 지켜 드릴게요")
line(2,4,'Is there anyone else',"Along with your safety, is anyone else at home in danger?","안전과 함께, 집에 위험한 다른 분이 계신가요?")
ocard(2,"민감한 질문임을 알리고, 직접 묻고, 어떤 대답이든 판단하지 않고 안전하게 지킨다고 안심시킨 뒤, 그 안전에 이어 집에 위험한 다른 사람이 있는지 물어요. 'Whatever your answer'가 앞 줄의 질문에, 'your safety'가 앞 줄의 안전에 이어져 순서가 하나예요.")
line(3,2,'With that answer',"While I keep watching your breathing, which products did you mix?","계속 호흡을 지켜보는 동안 어떤 제품을 섞으셨나요?")
line(3,3,"I'm calling Poison Control","I'm calling Poison Control about those products so we treat this right.","그 제품들로 독극물센터에 전화해서 제대로 처치할게요")
line(3,4,"They'll tell us","While they advise us, we'll rinse anything that touched your eyes or skin.","그분들이 자문하는 동안 눈이나 피부에 닿은 것은 바로 씻어 낼게요")
ocard(3,"숨 쉬는 데 문제가 있는지 먼저 확인하고, 호흡을 지켜보며 섞은 제품을 묻고, 독극물센터에 그 제품으로 자문하는 동안 눈과 피부에 묻은 것은 바로 씻어요. 'While I keep watching your breathing'·'those products'·'they'가 앞 줄을 가리켜 순서가 하나예요.")
line(4,2,'How many pills were in the bottle at that time',"How many pills were in the bottle before that, and how many are left?","그 전에 병에 알약이 몇 개 있었고 지금 몇 개 남았나요?")
line(4,3,'You did the right thing',"Bringing that bottle in with her was the right thing to do.","그 병을 가지고 아이를 데려오신 건 잘하신 거예요")
line(4,4,'From here',"Thanks to that, we know exactly what to watch for.","덕분에 무엇을 살펴야 하는지 정확히 알아요","안심")
ocard(4,"발견한 시각을 묻고, 그 전의 알약 수와 남은 수를 묻고, 병을 가져온 것을 인정하고, 그 덕에 무엇을 살필지 안다고 닫아요. 'before that'·'that bottle'·'Thanks to that'이 앞 줄을 가리켜 순서가 하나예요.")
line(5,2,"That's why we'll check","That's why we'll check your acetaminophen level against the exact time you took it.","그래서 아세트아미노펜 수치를 드신 정확한 시각에 맞춰 확인할게요")
line(5,4,"I'll explain each step","I'll explain each step of that treatment so you know what's happening.","무슨 일인지 아시도록 그 치료의 단계마다 설명할게요")
ocard(5,"지금 괜찮아도 나중에 위험할 수 있다고 알리고, 그래서 수치와 먹은 시각을 확인하고, 그 둘을 바탕으로 NAC를 시작하고, 단계마다 설명하겠다고 닫아요. 'That's why'·'both of those'·'that treatment'가 앞 줄을 가리켜 순서가 하나예요.")
line(6,3,'His breathing should look better',"That drug should make his breathing better within a few minutes.","그 약이 몇 분 안에 호흡을 더 나아지게 할 거예요")
ocard(6,"호흡을 먼저 지지하고, 호흡이 지지된 상태에서 날록손을 투여하고, 그 약으로 호흡이 나아지는 것을 알리고, 나아져도 효과가 떨어질 수 있어 계속 지켜본다고 닫아요. 'his breathing'·'That drug'·'it improves'가 앞 줄을 가리켜 순서가 하나예요.")
line(7,3,'With her airway protected',"If her airway is protected and the doctor agrees, the reversal drug is given slowly.","기도가 보호되고 의사가 동의하면 역전제를 천천히 투여해요")
ocard(7,"진정 정도를 확인하고, 그 결과에 따라 기도를 지지하고, 기도가 보호되고 의사가 동의할 때만 역전제를 천천히 쓰고, 그 약으로 생길 수 있는 움찔거림을 알리게 해요. 벤조디아제핀 역전제는 섞어 먹었거나 오래 먹은 사람에게는 쓰지 않는 경우가 많아요. 'That'·'her airway'·'it'이 앞 줄을 가리켜 순서가 하나예요.")
line(8,2,'With that many',"Whatever the number, that ringing in your ears means the level may be high.","몇 개든, 귀 울림은 수치가 높을 수 있다는 뜻이에요")
ocard(8,"먹은 양과 기간을 묻고, 개수와 상관없이 귀 울림이 수치가 높을 수 있다는 단서라고 알리고, 그 수치를 내리는 치료를 설명하고, 치료가 듣는지 계속 확인한다고 닫아요. 'Whatever the number'·'that level'·'it'이 앞 줄을 가리켜 순서가 하나예요.")
line(10,2,'With your blood that thin',"While we wait on that, any bruising or blood in your urine?","그 결과를 기다리는 동안, 멍이나 소변에 피가 보이나요?")
line(10,3,"If what you're seeing","If so, or if the INR is high, we have a reversal medicine.","그렇다면, 혹은 INR이 높다면 드릴 수 있는 역전제가 있어요")
line(10,4,"That's why","With or without that medicine, we're watching closely for any new bleeding.","그 약을 쓰든 안 쓰든 새 출혈을 가까이서 지켜보고 있어요")
ocard(10,"INR로 혈액이 얼마나 묽은지 확인하고, 결과를 기다리는 동안 출혈 징후를 묻고, 그 답이 '예'이거나 INR이 높으면 역전제가 있다고 알리고, 약을 쓰든 안 쓰든 새 출혈을 지켜본다고 닫아요. 'that'·'If so'·'that medicine'이 앞 줄을 가리켜 순서가 하나예요.")
line(11,2,'To help with that pain',"With your pain in mind, can you tell me each thing you took?","그 고통을 생각해서, 드신 것을 하나하나 말씀해 주시겠어요?")
line(11,3,"I'll share all of that","Knowing each of those helps the doctor treat every one safely.","그 하나하나를 알면 의사가 모든 것을 안전하게 치료할 수 있어요","치료","pill")
line(11,4,"Someone will stay","Once that's done and you're medically safe, a counselor will come talk with you.","그게 끝나고 몸이 안정되면 상담사가 와서 이야기할 거예요","연계","speech")
ocard(11,"고통에 먼저 공감하고, 그 고통을 생각해 먹은 것을 묻고, 그 정보가 치료에 쓰인다고 알리고, 치료가 끝나 안정되면 상담사가 온다고 닫아요. 'your pain'·'those'·'that'이 앞 줄을 가리켜 순서가 하나예요.")
line(12,3,'With that amount in mind',"Whatever the amount, I'll check your oxygen and alertness every few minutes.","양이 얼마든 산소와 각성 상태를 몇 분마다 확인할게요")
ocard(12,"호흡이 느려질 위험을 알리고, 그래서 먹은 양을 묻고, 양이 얼마든 확인 주기를 알리고, 그 확인 사이에 깨어 있게 부탁해요. 'That's why'·'Whatever the amount'·'those checks'가 앞 줄을 가리켜 순서가 하나예요.")
line(14,4,'Beyond that',"With that promise, can you tell me what you took?","그 약속이 있으니, 무엇을 드셨는지 말씀해 주시겠어요?","요청","pill")
ocard(14,"처벌하러 온 게 아니라고 먼저 말하고, 그래도 몸의 징후를 근거로 대화를 열고, 그 이야기의 비밀 범위를 알린 뒤, 그 약속을 바탕으로 무엇을 먹었는지 물어요. 'Still'·'it'·'that promise'가 앞 줄을 가리켜 순서가 하나예요.")
line(15,4,'With naloxone requested',"While that's coming, can you take report? I'll stay with the airway.","그게 오는 동안 인계 받으실 수 있나요? 기도는 제가 맡을게요")
ocard(15,"동공과 호흡수를 보고하고, 그것이 톡시드롬 같아 기도를 보호한다고 알리고, 기도가 보호된 상태에서 날록손을 요청하고, 그것이 오는 동안 기도를 맡은 채 인계를 부탁해요. 'That'·'With the airway protected'·'that's coming'이 앞 줄을 가리켜 순서가 하나예요.")
line(17,4,'Cooling you down',"Cooling you down eases the reaction that trigger caused.","식혀 드리면 그 유발 원인이 일으킨 반응이 가라앉아요",None,"shield")
ocard(17,"씰룩임과 고열이 약물 상호작용을 시사한다고 알리고, 그 약 가운데 새 것을 묻고, 의심되는 약을 모두 멈추고, 식혀서 그 원인이 일으킨 반응을 가라앉힌다고 닫아요. 'those medications'·'every one'·'that trigger'가 앞 줄을 가리켜 순서가 하나예요.")
line(18,4,"That's why we're moving fast","Both of those work best early, so we're moving fast.","그 둘은 일찍 할수록 효과가 좋아서 서둘러 움직이고 있어요")
ocard(18,"마신 양과 시점을 묻고, 그 뒤의 시야 문제가 메탄올 중독일 수 있다고 알리고, 그에 대한 해독제와 투석을 설명하고, 그 둘은 일찍 할수록 좋아서 서두른다고 닫아요. 'that'·'For that'·'Both of those'가 앞 줄을 가리켜 순서가 하나예요.")
line(19,3,'Whatever you feel',"Whatever you feel, I'm also watching your heart on this monitor.","어떻게 느끼시든 저도 이 모니터로 심장을 지켜보고 있어요")
line(19,4,"That's why the team","For any change on that screen, the team is ready with everything.","그 화면에 어떤 변화가 있어도 팀이 모든 걸 준비해 뒀어요")
ocard(19,"리듬이 불안정하다고 알리고, 그 리듬 때문에 느껴지는 변화를 바로 말하게 하고, 모니터로도 지켜본다고 알리고, 그 화면에 변화가 있어도 팀이 준비돼 있다고 닫아요. 'that rhythm'·'Whatever you feel'·'that screen'이 앞 줄을 가리켜 순서가 하나예요.")
line(20,2,'He was talking',"Since then, he went from talking at pickup to hypotensive and drowsy.","그 뒤 인수 때는 말했는데 저혈압에 졸린 상태가 됐습니다")
line(20,3,'His latest pressure',"For that low pressure, eighty over forty, I gave a bicarb bolus.","그 낮은 혈압, 80에 40에 중탄산제 볼루스를 드렸습니다")
ocard(20,"섭취 약물과 시각을 보고하고, 그 뒤 변한 상태를 알리고, 그 낮은 혈압과 처치를 보고하고, 이어서 기도와 혈압을 넘겨받아 달라고 부탁해요. 'Since then'·'that low pressure'·'so I can finish report'가 앞 줄을 가리켜 순서가 하나예요.")
l=S[13]['order']['lines'][2]; assert l['en'].startswith('Whatever the test'); l['icon']='monitor'

# ---- context C1, C2
c=[n for n in S[1]['nuance'] if n['kind']=='context'][0]
assert c['scenes'][1]['en'].startswith('Report any vomiting or emesis')
c['scenes'][1]['en']="Report any vomiting — aspiration risk with the charcoal."
c=[n for n in S[18]['nuance'] if n['kind']=='context'][0]
assert c['scenes'][2]['en'].startswith('Nephrology is consulted')
c['scenes'][2]['en']="We're consulting nephrology for emergent dialysis — you'll need access."
c['why']="셋 다 긴급 투석이 필요하다는 같은 말이에요. nephrology·emergent·access는 의료진끼리의 말이라, 환자에게는 dialysis가 무엇을 하는지로 풀어 말해요."

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=100000)
