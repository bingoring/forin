import yaml, glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
files=sorted(glob.glob(D+'add_er-gi-bleed_v46_*.yaml'))
data=[yaml.safe_load(open(f)) for f in files]
S=[sit for d in data for sit in d]
assert len(S)==21
def blank(si,j,a,o): S[si]['s'][j]['a']=a; S[si]['s'][j]['o']=o
def dk(si,j,k): S[si]['s'][j]['k']=k
def line(si,li,en,ko=None):
    S[si]['order']['lines'][li]['en']=en
    if ko: S[si]['order']['lines'][li]['ko']=ko
def owhy(si,w): S[si]['order']['why']=w
# blanks
blank(4,4,"needle",["cuff","tourniquet","strap"])
blank(8,1,"take",["double","refuse","spill"])
blank(20,0,"bleeding",["pain","nausea","dizziness"])
blank(20,4,"closely",["rarely","barely","vaguely"])
blank(18,1,"fluids",["ice","stitches","bandages"])
blank(15,1,"fluids",["pills","food","ice"])
blank(3,4,"weak",["strong","calm","happy"])
blank(1,3,"almost",["never","barely","hardly"])
# distractorsKo
dk(15,4,["산소 마스크를 쓰려면 입을 벌려 주세요","안정을 위해 침대를 조금 낮출게요"])
dk(18,4,["마취를 더 하려고 잠깐 기다려 주세요","보호자분을 모셔 오려고 문을 열게요"])
dk(19,0,["약을 한 번 더 드려 볼게요, 지켜보세요","가족분께 연락해 상황을 알려 드릴게요"])
dk(20,5,["가족분께도 이 변화를 곧 전해 드릴게요","차트에는 이 변화를 시간과 함께 적어 둘게요"])
dk(4,2,["대기 시간이 줄어서 빨리 끝나요","팔을 편하게 두시면 돼요"])
dk(5,5,["위에 넣을 관은 의사 선생님이 설명해 드릴 거예요","검사 결과는 의사 선생님이 보여 줄 거예요"])
dk(17,5,["검사실에는 제가 직접 다녀올게요","가족분께는 의사 선생님이 연락하실 거예요"])
dk(9,2,["팔에 힘을 빼고 계셔 주세요","불을 조금 낮춰 둘게요"])
dk(9,3,["보통 몇 시간 걸려요","주로 팔에서 해요"])
dk(9,4,["아프면 진통제를 드릴게요","불편하면 수혈 속도를 늦출 수 있어요"])
dk(14,3,["하루에 몇 번 드시는지 말씀해 주세요","처음 처방받은 병원이 어디예요?"])
dk(13,3,["그 시술 때 며칠 입원하셨나요?","그 시술은 누가 하셨나요?"])
dk(19,5,["가족분께는 담당 간호사가 연락할 거예요","새 처방은 그 팀이 받아 올 거예요"])
dk(19,3,["배 속 염증을 가라앉히는 약을 쓸 거예요","시술 뒤에는 한동안 누워 계셔야 해요"])
dk(20,0,["처음 피가 난 게 언제였나요?","낮에는 피가 얼마나 있었나요?"])
dk(10,3,["둘이 같이 나왔나요?","어느 쪽이 더 많았나요?"])
dk(1,0,["서 있을 때 가슴이 답답한가요?","누워 있을 때도 어지러운가요?"])
dk(6,0,["위산이 많이 나온다는 뜻이에요","커피를 줄이라는 뜻이에요"])
# orders
line(3,2,"Besides the tiredness, has anything else come along, like belly pain?","피곤함 말고 배가 아프다거나 다른 일이 있었나요?")
owhy(3,"며칠째인지 먼저 묻고, 그 기간 동안의 증상을 묻고, 그 증상 말고 함께 온 것을 묻고, 그 답을 근거로 검사를 알립니다. 'Over that time'·'Besides the tiredness'·'Based on all that'이 앞 줄을 가리켜 순서가 하나예요.")
line(4,3,"I'll stay right here with you through that pinch and all of it.","그 따끔함과 모든 과정 내내 여기 함께 있을게요")
owhy(4,"무엇을 할지 알리고, 왜 하는지 설명하고, 느낌을 예고한 뒤 곁에 있겠다고 닫아요. 'That way'·'it'·'that pinch'가 앞 줄을 가리켜 순서가 하나예요.")
line(12,1,"To understand them fully, can you tell me more about your beliefs regarding blood transfusions?","그것을 충분히 이해하려는데, 수혈에 관한 신념을 더 말씀해 주시겠어요?")
owhy(12,"존중부터 말하고, 그 바람을 이해하려고 신념을 묻고, 그 뜻에 맞는 치료를 약속한 뒤, 기록으로 팀에 전해요. 'them'·'those wishes'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
line(13,2,"Since then, has bleeding like this happened more than once?","그 뒤로 이런 출혈이 한 번 넘게 있었나요?")
owhy(13,"이전 내시경 이야기를 열고, 그때의 발견을 묻고, 그 뒤 같은 출혈이 반복됐는지 묻고, 이 이력의 쓰임으로 닫아요. 'at that time'·'Since then'·'This history'가 앞 줄을 가리켜 순서가 하나예요.")
line(17,3,"Because of that result, we're ordering platelets and plasma to help you clot.","그 결과 때문에 응고를 돕는 혈소판과 혈장을 처방할게요")
owhy(17,"병력을 먼저 묻고, 답과 관계없이 출혈이 계속되는지 묻고, 검사로 본 상태를 알린 뒤, 그 결과에 맞는 치료를 알려요. 'Either way'·'Your labs show'·'that result'가 앞 줄을 가리켜 순서가 하나예요.")
line(18,2,"That help is coming into the room right now.","그 도움이 지금 병실로 오고 있어요")
line(18,3,"Keep your eyes on me as they come in, and tell me how you feel.","그분들이 들어오는 동안 저를 보시고 느낌을 말씀해 주세요")
owhy(18,"상태를 알리고 시술을 멈춘다고 말한 뒤, 되돌리려는 조치를 알리고, 오는 도움을 알리고, 그 도움이 들어올 때 곁에 있겠다고 닫아요. 'that'·'That help'·'they'가 앞 줄을 가리켜 순서가 하나예요.")
line(19,3,"In that room, that team will already know your full history and current condition.","그 방에서는 그 팀이 이미 전체 병력과 현재 상태를 알고 있을 거예요")
owhy(19,"전문의에게 보낸다고 알리고, 그 전문의가 하는 일을 설명하고, 이동을 알리고, 그 방에서 팀이 이미 정보를 안다고 닫아요. 'They'·'that procedure'·'that room'이 앞 줄을 가리켜 순서가 하나예요.")
# 20: 호출을 먼저
line(20,0,"Your vital signs have changed, so I'm calling the doctor.","활력징후가 변해서 의사 선생님을 부를게요")
S[20]['order']['lines'][0].update(icon='bell',note='호출')
line(20,1,"Help me report it: how does the bleeding compare to earlier tonight?","보고를 도와주세요, 출혈이 오늘 밤 아까와 비교해 어떤가요?")
S[20]['order']['lines'][1].update(icon='compass',note='비교')
line(20,2,"Is that blood darker or lighter than it was then?","그 피가 그때보다 더 어두운가요, 더 밝은가요?")
S[20]['order']['lines'][2].update(icon='magnify',note='색')
line(20,3,"I'll report all of that clearly, because the doctor needs to hear it right away.")
owhy(20,"활력징후가 변하면 먼저 의사를 부르고, 그 보고에 쓸 비교와 색을 묻고, 모두 보고한다고 닫아요. 'report it'·'that blood'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
line(6,2,"Either way, we'll start an IV medicine that lowers the acid in your stomach.","어느 쪽이든 위산을 낮추는 정맥주사 약을 시작할게요")
S[6]['order']['lines'][3]['icon']='magnify'
owhy(6,"소견을 알리고, 이전 병력을 묻고, 답과 관계없이 쓸 약을 알린 뒤, 약과 내시경의 역할로 닫아요. 'before this'·'Either way'·'That medicine'이 앞 줄을 가리켜 순서가 하나예요.")
line(14,2,"Because of that, stopping those medicines too soon could increase your clot risk.","그 때문에 그 약들을 너무 일찍 끊으면 응고 위험이 늘 수 있어요")
owhy(14,"복용약을 묻고, 그 약을 먹게 된 시술을 묻고, 그 때문에 약을 끊을 때의 위험을 알리고, 그래서 두 의사가 함께 정한다고 닫아요. 'them'·'Because of that'·'That's why'가 앞 줄을 가리켜 순서가 하나예요.")
for f,d in zip(files,data):
    yaml.safe_dump(d,open(f,'w'),allow_unicode=True,sort_keys=False,width=100000,default_flow_style=None)
print('ok')
