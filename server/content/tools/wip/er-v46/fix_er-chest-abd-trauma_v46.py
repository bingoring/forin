import yaml, re, sys
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-chest-abd-trauma.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def sent(si,j): return S[si]['sentences'][j]
def blank(si,j,ans,opts):
    t=sent(si,j); assert ans in opts and len(set(opts))==4
    assert len(re.findall(r'(?i)(?<![\w-])'+re.escape(ans)+r'(?![\w-])',t['en']))==1,(si,j,ans)
    k=(si*7+j)%4; o=[x for x in opts if x!=ans]; o.insert(k,ans)
    t['blank']={'answer':ans,'options':[{'en':x} for x in o]}
def why(si,j,txt): sent(si,j)['why']=txt
def dko(si,j,k,txt): sent(si,j)['distractorsKo'][k]=txt
def line(si,k,en,ko,note,icon=None):
    l=S[si]['order']['lines'][k]; l['en']=en; l['ko']=ko; l['note']=note
    if icon: l['icon']=icon
def ocard(si,txt): S[si]['order']['why']=txt
def ctx(si):
    return [n for n in S[si]['nuance'] if n['kind']=='context'][0]

# why
why(7,5,"right away로 기다리지 않고 바로 알린다고 말해요. 외상 환자의 혈압이 떨어지면 기다리지 않고 바로 알려야 해요.")
why(11,3,"a moist sterile dressing으로 무엇으로 덮는지 구체적으로 말해요. 멸균 드레싱은 오염을 막고, 젖은 드레싱은 밖으로 나온 장기가 마르지 않게 해 줘요.")
why(17,5,sent(17,5)['why'].rstrip()+" 외상의 심낭압전에서 바늘 천자는 수술 전까지의 임시 처치예요.")
# blanks
blank(20,1,'abdomen',['abdomen','pelvis','spine','skull'])
blank(5,0,'manage',['manage','measure','record','describe'])
blank(5,1,'limits',['limits','speeds','slows','shakes'])
blank(6,5,'recheck',['recheck','record','report','chart'])
blank(10,4,'repeat',['repeat','review','print','send'])
blank(11,5,'still',['still','up','awake','warm'])
blank(14,5,'stay',['stay','work','look','check'])
blank(15,3,'release',['release','measure','check','record'])
blank(16,5,'replace',['replace','measure','count','check'])
blank(17,4,'preparing',['preparing','waiting','trying','asking'])
blank(18,2,'faster',['faster','slower','later','longer'])
blank(4,0,'happened',['happened','stopped','ended','continued'])
blank(4,4,'direction',['direction','lane','street','exit'])
blank(3,4,'aching',['aching','stinging','cramping','tingling'])
blank(8,1,'right',['right','left','other','far'])
blank(8,2,'guarding',['guarding','bruising','swelling','bleeding'])
blank(12,1,'cramping',['cramping','vomiting','swelling','fever'])
blank(13,0,'understand',['understand','trust','hear','reach'])
blank(13,1,'bad',['bad','long','often','soon'])
blank(16,1,'blood',['blood','air','fluid','pus'])
blank(16,3,'surgical',['surgical','nursing','imaging','transport'])
blank(18,5,'waiting',['waiting','leaving','charting','calling'])
blank(20,4,'units',['units','liters','doses','milligrams'])
blank(6,2,'breathing',['breathing','sleeping','appetite','voice'])
blank(16,4,'drainage',['drainage','dressing','breathing','diet'])
blank(8,4,'faint',['faint','cold','itchy','full'])
blank(10,5,'dizziness',['dizziness','nausea','numbness','fever'])
blank(19,3,'pain',['pain','cough','fever','blood sugar'])
# decoy
sent(2,5)['decoy']='tomorrow'
# distractorsKo
dko(8,5,0,"팔에 혈압 커프를 감아 둘게요")
dko(16,4,1,"흉관이 꺾이지 않았는지 확인할게요")
dko(16,4,0,"배액통 눈금에 지금 양을 표시해 둘게요")
dko(11,4,0,"수술 동의서는 의사 선생님이 받으실 거예요")
dko(14,1,0,"관을 넣은 뒤 가슴 사진을 다시 찍어요")
dko(19,4,1,"지금은 산소 마스크로 지켜볼게요")
dko(18,1,1,"소변은 언제 마지막으로 보셨어요?")
# tag/icon
sent(18,3)['icon']='scalpel'
# order
line(2,3,"With those numbers and how you feel, I'm letting the team know right now.","그 수치와 지금 느낌을 보고 바로 팀에 알릴게요","보고")
ocard(2,"측정을 알리고, 그 수치를 전한 뒤, 증상을 묻고, 수치와 증상을 묶어 바로 팀에 알려요. 'Those numbers'·'with that'·'how you feel'이 앞 줄을 가리켜 순서가 하나예요.")
line(6,1,"A bruised lung can do that, and it may get worse over the next few hours.","폐 좌상은 그럴 수 있고 앞으로 몇 시간 동안 더 나빠질 수 있어요","설명")
line(6,2,"Because of that risk, I'm putting this mask on you and letting the doctor know.","그 위험 때문에 이 마스크를 씌우고 의사 선생님께 알릴게요","조치")
ocard(6,"수치가 떨어졌다고 알리고, 폐 좌상이 그럴 수 있고 나빠질 수 있다고 설명한 뒤, 그 위험 때문에 마스크를 씌우고 의사에게 알리고, 씌운 뒤 다시 확인한다고 해요. 'that'·'that risk'·'the mask'가 앞 줄을 가리켜 순서가 하나예요.")
line(1,0,"Can I see where the seatbelt crossed your body?","안전벨트가 지나간 자리를 봐도 될까요?","허락","shield")
line(1,1,"Thanks—that mark can tell us how hard the impact was.","고마워요, 그 자국을 보면 충격이 얼마나 셌는지 알 수 있어요","설명","bulb")
line(1,2,"Around that mark, I'm going to gently press on your belly in a few spots.","그 자국 둘레 배 몇 군데를 살살 눌러볼게요","안내","magnify")
line(1,3,"Tell me if any of them feels tender or hard.","그중 아프거나 딱딱한 곳이 있으면 말씀해 주세요","보고","bell")
ocard(1,"먼저 벨트 자국을 보고, 그 자국의 뜻을 말한 뒤, 누르겠다고 알리고, 누른 곳 중 아픈 곳을 말하게 해요. 'that mark'·'any of them'이 앞 줄을 가리켜 순서가 하나예요.")
line(18,3,"Since they're waiting, we're moving you to the OR now, blood still running.","팀이 기다리니 지금 수술실로 옮길게요, 수혈은 계속돼요","이동")
ocard(18,"지금 일어나는 일을 말하고, 그래서 수술이 필요하다고 설명한 뒤, 수술팀이 대기 중이라고 알리고, 팀이 기다리니 지금 옮기고 수혈은 가는 내내 이어 간다고 해요. 'That'·'For that'·'they're waiting'이 앞 줄을 가리켜 순서가 하나예요.")
line(20,2,"Since then, output is 400 mL and rising, with BP dropping despite two units.","그 뒤로 배액량은 400 mL이고 늘고 있고, 혈액 두 단위에도 혈압이 떨어지고 있습니다","평가")
line(20,3,"With all of that, he needs the OR now to control the bleeding.","이 모든 걸 보면 출혈 조절을 위해 지금 수술실이 필요합니다","요청")
ocard(20,"S로 환자와 문제를 말하고, B로 사고와 한 처치를 말하고, A로 배액량 추이와 수혈에도 떨어지는 혈압을 말한 뒤, R로 수술실을 요청해요. 'It'·'Since then'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
line(13,2,"For the fingers, one means mild and ten means severe.","손가락은 하나가 약함, 열 개가 심함을 뜻해요","약속")
line(13,3,"With that scale done, the interpreter will ask about your history and medicines.","그 척도를 정했으니 통역사가 병력과 드시는 약을 물어볼 거예요","병력")
ocard(13,"통역사를 부른다고 알리고, 연결될 때까지 몸짓으로 답하게 하고, 그 손가락 약속을 정한 뒤, 병력은 통역사가 묻는다고 해요. 'they'·'the fingers'·'that scale'이 앞 줄을 가리켜 순서가 하나예요.")
line(17,3,"Since that fluid needs to be drained, I'm calling the doctor right now.","그 액체를 빼야 하니 지금 바로 의사 선생님을 부를게요","보고","speech")
ocard(17,"목 정맥과 혈압을 말하고, 거기에 심음 변화를 보태고, 세 소견이 뜻하는 것을 설명한 뒤, 그 액체를 빼야 하니 바로 의사에게 알려요. 'On top of that'·'These three signs'·'that fluid'가 앞 줄을 가리켜 순서가 하나예요.")
line(5,3,"To check that they're opening up, I'm going to listen to your lungs again.","폐가 펴지는지 확인하려고 폐 소리를 다시 들어볼게요","청진")
ocard(5,"골절이 숨을 아프게 하고 통증을 관리하겠다고 말한 뒤, 그것과 함께 심호흡을 권하고, 그 호흡의 효과를 설명하고, 폐가 펴지는지 다시 들어 확인해요. 'With that'·'Those breaths'·'they'가 앞 줄을 가리켜 순서가 하나예요.")
line(9,1,"To look for that, we'll take images of what's underneath.","그걸 찾으려고 안쪽 영상 검사를 할게요","검사","magnify")
line(9,2,"Even with clear images, a bowel injury can show up hours later.","영상이 깨끗해도 장 손상은 몇 시간 뒤 나타날 수 있어요","지연","bulb")
line(9,3,"Because of that, we'll observe you here a while longer.","그래서 여기서 좀 더 관찰할게요","관찰","monitor")
ocard(9,"자국의 의미를 말하고, 그 손상을 찾으려 영상 검사를 하고, 영상이 깨끗해도 장 손상은 늦게 나타날 수 있다고 설명한 뒤, 그 때문에 관찰한다고 해요. 'that'·'clear images'·'Because of that'이 앞 줄을 가리켜 순서가 하나예요.")
line(19,2,"Sinking in like that is making your breathing shallow.","그렇게 안으로 꺼져서 숨이 얕아지고 있어요","결과")
line(19,3,"To make those breaths deeper, we'll support your breathing and control your pain.","그 숨을 더 깊게 하려고 호흡을 도와드리고 통증도 조절해 드릴게요","치료")
ocard(19,"갈비뼈 일부가 따로 움직인다고 알리고, 그 부분이 반대로 움직인다고 짚은 뒤, 그렇게 꺼져서 숨이 얕아졌다고 하고, 그 숨을 깊게 하려고 돕겠다고 말해요. 'That part'·'Sinking in like that'·'those breaths'가 앞 줄을 가리켜 순서가 하나예요.")
# weak
line(10,2,"How many times a day do you take the one you just named?","방금 말씀하신 약은 하루에 몇 번 드세요?","횟수")
ocard(10,S[10]['order']['why'].replace("'that one'","'the one you just named'"))
line(8,3,"Whatever I find, we'll keep a close eye on your vital signs.","무엇이 나오든 활력징후를 계속 자세히 지켜볼게요","감시")
ocard(8,"만질 위치를 알리고, 그쪽을 누를 때 더 아픈지 묻고, 대답하는 동안 방어 반응을 살핀 뒤, 무엇이 나오든 활력징후를 지켜본다고 해요. 'that side'·'While you tell me'·'Whatever I find'가 앞 줄을 가리켜 순서가 하나예요.")
# context
ctx(1)['why']="palpate는 차트와 의료진 사이의 동사예요. 환자에게는 같은 abdomen이라도 press on처럼 쉬운 동사로 말하고, belly라고 하면 더 편하게 들려요."
ctx(4)['scenes'][1]['en']="Restrained driver, side-impact MVC, L chest injury."
ctx(9)['scenes'][2]['en']="We'll observe you with serial abdominal exams."
ctx(15)['scenes'][1]['en']="Absent breath sounds over the left lung, trachea deviated—looks like a tension pneumo."
ctx(15)['scenes'][2]['en']="Your lung collapsed from a tension pneumothorax."
ctx(17)['scenes'][2]['en']="You have Beck's triad—muffled heart sounds, JVD, and hypotension."
ctx(20)['scenes'][1]['en']="Pt s/p MVC, restrained driver, car vs. car, side impact."
yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
