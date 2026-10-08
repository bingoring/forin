import yaml, re, sys
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-abdominal.yaml'
d=yaml.safe_load(open(P))
S=d['situations']
def sent(si,j): return S[si]['sentences'][j]
def blank(si,j,ans,opts):
    t=sent(si,j); assert ans in opts and len(set(opts))==4
    assert len(re.findall(r'(?i)(?<![\w-])'+re.escape(ans)+r'(?![\w-])',t['en']))==1,(si,j,ans)
    k=(si*7+j)%4; o=[x for x in opts if x!=ans]; o.insert(k,ans)
    t['blank']={'answer':ans,'options':[{'en':x} for x in o]}
def why(si,j,txt): sent(si,j)['why']=txt
def line(si,k,en,ko,note=None,icon=None):
    l=S[si]['order']['lines'][k-1]; l['en']=en; l['ko']=ko
    if note: l['note']=note
    if icon: l['icon']=icon
    assert len(en.split())<=15,(si,k,len(en.split()))
def ocard(si,txt): S[si]['order']['why']=txt
def ctx(si): return [n for n in S[si]['nuance'] if n['kind']=='context'][0]

# ---- why
why(6,2,"keep you from …ing은 '못 하게 막는다'는 뜻이라 금식을 분명하게 전해요. 췌장염 초기에는 구역과 통증이 가라앉을 때까지 금식하고, 견딜 수 있으면 일찍 다시 먹기 시작해요.")
why(16,1,"drawing은 지금 피를 뽑고 있다는 진행형이고, right away로 서두르는 검사임을 알려요. 젖산은 장으로 가는 피가 부족할 때 오를 수 있어 장간막 허혈을 의심하면 일찍 재요.")
why(2,3,"feel sick은 속이 안 좋거나 몸이 안 좋은 것을 넓게 묻는 쉬운 말이에요. 메스꺼움과 열이 복통에 더해지면 염증성 원인을 뒷받침해서 바로 알려 달라고 해요.")
why(14,3,"Even a little…로 작은 통증도 가볍게 넘기지 않는다고 알려요. 참는 성향의 환자는 증상을 줄여 말하기 쉬워서 미리 안심시켜요.")
why(19,2,"immediately로 기다리지 않고 바로 시작한다고 알려요. 혈압이 떨어진 환자는 수액과 산소로 먼저 상태를 지지해요.")
why(19,4,"to bring…back up으로 수액의 목적을 쉽게 풀어요. pressure는 대화에서 blood pressure를 줄여 부르는 흔한 말이에요.")
why(5,3,"열이 함께 있으면 염증이나 감염 쪽을 더 의심하게 돼서 복통 문진에 꼭 넣어요. 숨참은 심장·폐 쪽 원인을 함께 거르려는 질문이에요.")
why(3,1,"식사 전후로 달라지는지를 물으면 소화기 원인을 가늠하는 단서가 돼요. 먹고 나서 심해지면 담낭·위궤양 쪽을, 나아지면 십이지장 궤양을 떠올리기도 해요.")
why(17,4,"needs to로 필요성을 말하고 as soon as possible로 시간이 중요하다고 알려요. 천공은 대개 응급 수술로 치료해요.")

# ---- blank
blank(20,1,'crash',['crash','surgery','procedure','injection'])
blank(19,1,'calling',['calling','waiting','looking','charting'])
blank(16,0,'concerns',['concerns','reassures','relieves','surprises'])
blank(1,3,'worse',['worse','better','milder','easier'])
blank(0,2,'spread',['spread','start','burn','ache'])
blank(1,4,'today',['today','lately','this week','recently'])
blank(2,0,'exactly',['exactly','roughly','about','generally'])
blank(2,1,'let go',['let go','hold it','tap','push deeper'])
blank(4,3,'drinking',['drinking','skipping','craving','avoiding'])
blank(6,2,'eating',['eating','smoking','walking','getting up'])
blank(13,0,'understand',['understand','measure','treat','ease'])
blank(13,1,'medications',['medications','tests','scans','X-rays'])
blank(13,4,'safe',['safe','calm','comfortable','informed'])
blank(15,0,'tearing',['tearing','burning','cramping','aching'])
blank(20,3,'pulse',['pulse','temperature','oxygen','sugar'])
blank(3,2,'sweating',['bleeding','sweating','fever','coughing'])
blank(7,1,'chills',['chills','cough','rash','nausea'])
blank(9,3,'chills',['chills','nausea','cough','vomiting'])
blank(11,3,'weak',['cold','sleepy','weak','numb'])
blank(14,1,'weakness',['fever','bleeding','swelling','weakness'])
blank(17,0,'rigid',['swollen','rigid','tender','warm'])
blank(11,1,'faint',['faint','vomit','choke','shake'])

# ---- decoy / distractorsKo / icon
sent(2,1)['decoy']='when you cough'
sent(15,2)['decoy']='for tomorrow'
sent(6,3)['distractorsKo'][1]='구토는 몇 번 하셨어요?'
sent(18,2)['icon']='hospital'

# ---- order
# S6
line(6,3,"With pain like that after drinking, we'll keep you from eating or drinking for now.","술 뒤에 그런 통증이면, 지금은 먹거나 마시지 못하게 할게요")
line(6,4,"With no food or drink, IV fluids and pain medicine are your main treatment.","먹고 마시지 않는 동안 수액과 통증 약이 주된 치료예요")
ocard(6,"통증의 방향을 먼저 묻고, 시작과 음주를 확인하고, 그 양상 때문에 금식을 안내한 뒤, 금식 중 치료의 중심이 수액과 진통제라고 알려요. 'it'·'pain like that after drinking'·'With no food or drink'가 앞 줄을 가리켜 순서가 하나예요.")
# S1
line(1,2,"While I do, how bad is the pain from zero to ten?","그동안 0에서 10까지 통증이 얼마나 심한가요?")
line(1,3,"Is that number any higher than it was an hour ago?","그 숫자가 한 시간 전보다 높은가요?")
line(1,4,"Whichever way it's changed, I also need to know when you last ate.","어느 쪽으로 변했든, 마지막으로 언제 드셨는지도 알아야 해요")
ocard(1,"측정을 먼저 알리고, 측정하는 동안 통증 점수를 받고, 그 숫자가 한 시간 전보다 달라졌는지 묻고, 어느 쪽이든 수술 가능성에 대비해 마지막 섭취를 확인해요. 'While I do'·'that number'·'Whichever way it's changed'가 앞 줄을 가리켜 순서가 하나예요.")
# S12
line(12,2,"Until they connect, can you point to where it hurts the most?","연결되기 전까지, 가장 아픈 곳을 가리켜 주시겠어요?")
line(12,3,"When I press that spot, nod if it hurts, shake your head if not.","그 자리를 누를 때 아프면 고개를 끄덕이고 아니면 저어 주세요")
line(12,4,"Once the interpreter is on, tell them if anything feels new or different.","통역사가 연결되면, 새롭거나 다르게 느껴지는 게 있을 때 말씀해 주세요")
ocard(12,"통역사를 먼저 부르고, 연결되기 전에는 가리키기와 끄덕임으로 받고, 연결되면 통역사를 통해 새로운 증상을 말하게 해요. 'they'·'that spot'·'Once the interpreter is on'이 앞 줄을 가리켜 순서가 하나예요.")
# S17
line(17,2,"Because of that sign, I'm calling the surgeon right now.","그 징후 때문에 지금 바로 외과 선생님을 부를게요","호출")
line(17,3,"Until they come, lie as still as you can — moving makes it hurt more.","그분들이 오실 때까지 최대한 가만히 누워 계세요, 움직이면 더 아파요")
line(17,4,"When they see you, they may need to operate as soon as possible.","그분들이 보시면 최대한 빨리 수술해야 할 수도 있어요")
ocard(17,"단단한 배가 심각한 징후임을 먼저 알리고, 그 징후 때문에 외과를 부르고, 외과가 올 때까지 움직이면 더 아프니 가만히 누워 있게 하고, 외과가 보면 수술할 수도 있다고 안내해요. 'that sign'·'they'가 앞 줄을 가리켜 순서가 하나예요.")
# S2
line(2,2,"I'll press away from that spot — does it hurt more when I let go?","그 자리에서 떨어진 곳부터 누를게요, 뗄 때 더 아픈가요?")
line(2,4,"Because of those findings, nothing to eat or drink until the surgeon sees you.","그 소견 때문에 외과 선생님이 보실 때까지 먹거나 마시지 마세요")
ocard(2,"아픈 자리를 먼저 짚게 하고, 가리킨 곳에서 먼 데부터 눌러 뗄 때를 묻고, 그 압통과 함께 오심·열을 묻고, 그 소견을 근거로 외과가 볼 때까지 금식을 안내해요. 'that spot'·'that tenderness'·'those findings'가 앞 줄을 가리켜 순서가 하나예요.")
# S14
line(14,3,"Whatever you tell me, let me recheck your vital signs to be safe.","무슨 말씀을 하시든, 안전을 위해 활력징후를 다시 확인할게요")
line(14,4,"Even a small change in them matters, so I'll keep checking often.","그 수치는 작은 변화도 중요해서 자주 계속 확인할게요","관찰")
ocard(14,"가볍게 느껴져도 신중히 본다고 먼저 말하고, 그 점을 염두에 두고 증상을 묻고, 증상과 상관없이 활력징후를 다시 재고, 그 수치의 작은 변화도 중요해서 자주 확인한다고 알려요. 'that in mind'·'Whatever you tell me'·'them'이 앞 줄을 가리켜 순서가 하나예요.")
# S18
line(18,3,"With that and your fever, we'll start antibiotics right away for the infection.","그것과 열을 보면 감염이라 바로 항생제를 시작할게요")
ocard(18,"통증 위치를 먼저 묻고, 그 통증과 함께 황달을 확인하고, 황달과 열을 근거로 감염이라 항생제를 바로 시작한다고 알리고, 항생제 말고 시술이 필요할 수 있다고 안내해요. 'that pain'·'that and your fever'·'Beyond antibiotics'가 앞 줄을 가리켜 순서가 하나예요.")
# S15
line(15,2,"Along with that pain, have you ever felt a pulsing lump in your belly?","그 통증과 함께 배에서 박동하는 덩어리를 느낀 적이 있나요?")
line(15,3,"With pain like that and your pressure this low, this could be very serious.","그런 통증에 혈압까지 이렇게 낮으면 매우 심각할 수 있어요")
line(15,4,"That's why we're calling the surgeon and getting blood ready right now.","그래서 지금 외과 선생님을 부르고 혈액을 준비하고 있어요")
ocard(15,"통증의 성질을 먼저 묻고, 그 통증과 함께 박동하는 덩어리를 묻고, 그런 통증과 낮은 혈압이 심각할 수 있다고 알린 뒤, 그래서 외과 연락과 혈액 준비를 알려요. 'that pain'·'pain like that'·'That's why'가 앞 줄을 가리켜 순서가 하나예요.")
# S20
line(20,4,"In case those numbers show bleeding, we're getting blood ready for a transfusion.","그 수치에 출혈이 보일 경우에 대비해 수혈용 혈액을 준비하고 있어요")
ocard(20,"외상팀이 와 있다고 알리고, 그 팀이 FAST를 하고, 그 검사와 활력징후가 심각도를 알려 주고, 그 결과에 출혈이 보일 때를 대비해 혈액을 준비한다고 말해요. 'They'·'that scan'·'those numbers'가 앞 줄을 가리켜 순서가 하나예요.")
# S19
line(19,2,"I'm calling for the team right now — stay with me.","지금 바로 팀을 부를게요, 정신 놓지 마세요")
line(19,4,"Even with those fluids, tell me right away if you feel any worse.","그 수액을 맞는 중에도 더 안 좋아지면 바로 말씀해 주세요")
ocard(19,"혈압이 떨어졌음을 먼저 알리고, 팀을 부르며 곁을 지키고, 그 팀이 수액을 시작한다고 말하고, 그 수액을 맞는 중에도 악화되면 바로 알려 달라고 해요. 'the team'·'those fluids'가 앞 줄을 가리켜 순서가 하나예요.")
# S5
line(5,2,"Since that meal, has it spread to your back or right shoulder?","그 식사 뒤로 등이나 오른쪽 어깨로 퍼졌나요?")
line(5,3,"To find where it starts, does pressing here hurt as you breathe in?","어디서 시작하는지 찾으려고, 숨을 들이쉴 때 여기를 누르면 아픈가요?")
ocard(5,"유발 요인을 먼저 묻고, 그 식사 뒤로 퍼진 곳을 확인하고, 어디서 시작하는지 찾으려 숨 쉴 때의 압통을 보고, 그 답들을 근거로 초음파와 금식을 안내해요. 'that meal'·'where it starts'·'all that'이 앞 줄을 가리켜 순서가 하나예요.")
# S8
line(8,2,"Since that surgery, have you been able to pass gas or have a bowel movement?","그 수술 뒤로 가스를 배출하거나 배변을 할 수 있었나요?")
line(8,3,"With your bowels stopped like that, how many times have you vomited today?","장이 그렇게 멈춘 상태라면 오늘 몇 번 토하셨나요?")
line(8,4,"With all of that, a tube through your nose may relieve the pressure.","그 모든 것을 보면 코로 넣는 관이 압력을 줄여 줄 수 있어요")
ocard(8,"수술력을 먼저 묻고, 그 수술 뒤에 가스와 배변이 나오는지 확인하고, 장이 멈춘 상태에서 구토 횟수를 묻고, 모든 것을 근거로 코로 관을 넣어 압력을 줄일 수 있다고 안내해요. 'that surgery'·'like that'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
# S11
line(11,4,"Along with that test, we need urgent blood work and an ultrasound right now.","그 검사와 함께 긴급 혈액검사와 초음파가 지금 바로 필요해요")
ocard(11,"출혈을 먼저 묻고, 그와 함께 어지러움을 확인하고, 두 증상 때문에 임신을 바로 확인해야 한다고 알린 뒤, 그 확인과 함께 긴급 검사가 필요하다고 설명해요. 'that'·'both'·'that test'가 앞 줄을 가리켜 순서가 하나예요.")
# S3
line(3,3,"Whether or not food changes it, any chest pain, sweating, or shortness of breath?","음식에 따라 달라지든 아니든, 가슴 통증이나 식은땀, 숨찬 느낌이 있나요?")
ocard(3,"통증의 느낌을 먼저 묻고, 그 느낌이 식사와 관련되는지 보고, 음식과 상관없이 심장 원인을 걸러 가슴 통증·식은땀·숨참을 묻고, 그 증상이 지금도 있는지 확인해요. 'that feeling'·'food changes it'·'those symptoms'가 앞 줄을 가리켜 순서가 하나예요.")
# S4
line(4,2,"Since then, has your belly felt swollen or tight?","그 뒤로 배가 붓거나 팽팽한 느낌이 있었나요?","팽만","faceWorried")
line(4,3,"With that swelling, are you passing any gas at all?","그렇게 배가 부른 상태에서 가스는 조금이라도 나오나요?","가스","magnify")
line(4,4,"To find the cause of all that, what have you eaten and drunk this week?","그 모든 것의 원인을 찾으려는데, 이번 주에 뭘 드시고 마셨나요?")
ocard(4,"마지막 배변을 먼저 묻고, 그 뒤로 배가 부르거나 팽팽한지 묻고, 그 팽만과 함께 가스가 나오는지 확인하고, 이 모든 것의 원인을 찾으려 식습관을 물어요. 'Since then'·'that swelling'·'all that'이 앞 줄을 가리켜 순서가 하나예요.")
# S7
line(7,3,"Besides that movement pain, have you had fever, chills, or a change in stools?","움직일 때 아픈 것 말고, 열이나 오한, 대변에 변화가 있었나요?")
line(7,4,"With those symptoms, you may need to drink contrast before the CT.","그런 증상이면 CT 전에 조영제를 마셔야 할 수도 있어요")
ocard(7,"통증 위치를 먼저 확인하고, 그 자리가 움직임에 따라 더 아픈지 묻고, 열·오한 같은 증상을 확인한 뒤, 그런 증상을 근거로 CT 준비를 알려요. 'that spot'·'that movement pain'·'those symptoms'가 앞 줄을 가리켜 순서가 하나예요.")
# S9
line(9,4,"Since fever can mean a kidney infection, we'll send your urine for a culture.","열은 콩팥 감염을 뜻할 수 있어서 소변을 배양검사로 보낼게요")
ocard(9,"등을 두드려 옆구리 통증을 확인하고, 그 통증과 함께 배뇨 증상을 묻고, 열·오한을 확인한 뒤, 열까지 있으면 콩팥 감염을 더 의심해 소변을 배양검사로 보낸다고 안내해요. 'that back pain'·'those symptoms'·'fever'가 앞 줄을 가리켜 순서가 하나예요.")
# S13
line(13,2,"So, what medications have you taken for this already?","그럼 이미 이 일로 어떤 약을 드셨나요?")
ocard(13,"도우려는 마음을 먼저 밝히고, 이어서 이미 먹은 약을 묻고, 그 약 외에 도움이 된 것을 물은 뒤, 들은 모든 것을 근거로 충분히 사정한다고 말해요. 'So'·'those'·'everything you've told me'가 앞 줄을 가리켜 순서가 하나예요.")

# ---- context
c=ctx(14); c['word']='recheck'; c['ko']='다시 재다'
c['scenes'][2]['en']='Please recheck her vital signs every fifteen minutes.'
c=ctx(12)
c['scenes'][1]['fix']='Can you show me with one finger where it hurts the most?'
c['scenes'][0]['en']="I'll be talking with you through the interpreter. Can you point to where it hurts the most?"
ctx(7)['scenes'][2]['en']="She's finished her PO contrast for the CT."
ctx(5)['why']="Murphy's sign은 진찰 소견의 이름이에요. 환자에게는 결과도 이름 대신 무엇을 느꼈는지(숨을 들이쉴 때 누르면 아픈 것)로 말해요."

yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
