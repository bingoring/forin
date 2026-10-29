import yaml, glob
H='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
files=sorted(glob.glob(H+'add_core-handoff-icu_A_nuance_*.yaml'))
docs={f:yaml.safe_load(open(f,encoding='utf-8')) for f in files}
def sit(title):
    for f,d in docs.items():
        for s in d:
            if s['title']==title: return s
def ctx(items): return [n for n in items if n['kind']=='context'][0]
def replace_kind(s, kind_old, new):
    s['nuance']=[new if n['kind']==kind_old else n for n in s['nuance']]

# --- 1. context 단어 교체 ---
s=sit('라인·장치 목록 인계'); replace_kind(s,'context',dict(kind='context',words=['w-ng'],word='NG',ko='비위관',scenes=[
 dict(who='동료 간호사',icon='handshake2',en="The NG is to low suction, and the output is clear.",ok=True),
 dict(who='의사에게 보고',icon='stetho',en="NG output is down to fifty over the last four hours.",ok=True),
 dict(who='가족에게',icon='home',en="His NG is on low intermittent suction, and it's draining bilious output.",ok=False,fix="The thin tube from his nose to his stomach is keeping his belly comfortable.")],
 why="의료진끼리는 NG가 코에서 위로 들어간 관을 가리키는 짧은 말이에요. 가족에게 NG와 bilious output(담즙 섞인 배액) 같은 말을 쓰면 알아듣기 어려워서, 코에서 위까지 가는 관이라고 쉽게 풀어 줘요."))
s=sit('알레르기·주의사항 전달'); replace_kind(s,'context',dict(kind='context',words=['w-anaphylaxis'],word='anaphylaxis',ko='아나필락시스',scenes=[
 dict(who='동료 간호사',icon='handshake2',en="She had anaphylaxis to penicillin, so check the band before you give anything.",ok=True),
 dict(who='의사에게 보고',icon='stetho',en="Penicillin caused anaphylaxis last time, so please choose another antibiotic.",ok=True),
 dict(who='환자에게',icon='me',en="You had anaphylaxis to penicillin, so it is contraindicated for you.",ok=False,fix="Your body had a severe allergic reaction to penicillin, so we won't give it to you.")],
 why="의료진끼리는 anaphylaxis가 가장 심한 알레르기 반응을 가리키는 정확한 말이에요. 환자에게 anaphylaxis와 contraindicated를 그대로 말하면 알아듣기 어려워서, 몸이 심하게 알레르기 반응을 했다고 쉽게 풀어 줘요."))
s=sit('인계 중 확인질문 응대'); replace_kind(s,'context',dict(kind='swap',words=['w-catch','w-rate'],who='동료에게 · 못 들었을 때',icon='handshake2',
 before=["","Huh?"," I didn't catch the rate."],options=["Huh?","Sorry, could you say that again?","Okay, got it."],answer="Sorry, could you say that again?",
 notes={"Huh?":"짧고 퉁명스럽게 들려서 상대가 서두르거나 불쾌해해요. 못 들은 건 정중하게 다시 말해 달라고 해야 해요.","Sorry, could you say that again?":"정중하게 다시 말해 달라고 하는 표준 표현이에요. 못 들은 걸 숨기지 않고 바로 묻는 게 안전해요.","Okay, got it.":"틀려요. 못 들었는데 알아들은 척하면 틀린 속도로 약을 줄 수 있어요."},
 ko="죄송한데 다시 말씀해 주시겠어요? 속도를 못 들었어요",
 why="인계에서 못 들은 것은 그냥 넘기지 않고 정중하게 다시 말해 달라고 해요. 알아들은 척하면 숫자가 틀린 채로 약이 나갈 수 있어요."))
s=sit('night shift 인계 우선순위'); replace_kind(s,'context',dict(kind='context',words=['w-pressor'],word='pressor',ko='승압제',scenes=[
 dict(who='동료 간호사',icon='handshake2',en="He may need pressors titrated overnight.",ok=True),
 dict(who='레지던트에게',icon='stetho',en="He's on low-dose pressors, and his MAP is sixty-eight.",ok=True),
 dict(who='환자에게',icon='me',en="We might need to start pressors overnight to support your pressure.",ok=False,fix="We might need to start a medicine overnight that raises your blood pressure.")],
 why="의료진끼리는 pressor가 혈압을 올리는 약을 가리키는 짧고 정확한 말이에요. 환자에게 pressors라고 하면 무슨 약인지 몰라 불안해해서, 혈압을 올리는 약이라고 쉽게 풀어 줘요."))
s=sit('코드 상황 인계·역할'); replace_kind(s,'context',dict(kind='context',words=['w-pea'],word='PEA',ko='무맥성 전기활동',scenes=[
 dict(who='동료 간호사',icon='handshake2',en="Last rhythm was PEA, so keep the compressions going.",ok=True),
 dict(who='팀 리더',icon='stetho',en="We're in PEA again, so the next epi is due.",ok=True),
 dict(who='가족에게',icon='home',en="He's in PEA, which means electrical activity without a pulse.",ok=False,fix="His heart still has some electrical activity, but it isn't pumping enough to make a pulse.")],
 why="코드 중 의료진끼리는 PEA가 어떤 정지 리듬인지 바로 통하는 약어예요. 가족에게는 PEA 같은 약어와 electrical activity 설명이 낯설어서, 심장이 맥박을 만들 만큼 뛰지 못한다고 쉽게 풀어 줘요."))
s=sit('병원간 전원 인계'); replace_kind(s,'context',dict(kind='swap',words=['w-stable','w-transport','w-drip'],who='수용 병원 간호사에게 · 이송 상태',icon='handshake2',
 before=["He's ","okay"," for transport on these drips at these rates."],options=["okay","stable","doing great"],answer="stable",
 notes={"okay":"너무 모호해요. 받는 쪽은 무엇이 어느 수준인지 알 수 없어요.","stable":"인계에서 쓰는 임상어예요. 현재 약물과 속도에서 수치가 유지된다는 뜻이라 받는 쪽이 판단할 수 있어요.","doing great":"기대를 부풀려요. 위험한 환자를 낙관적으로만 전하면 받는 쪽이 대비하지 못해요."},
 ko="이 약물들과 속도 그대로 이송에 안정적입니다",
 why="이송 인계에서는 '괜찮다' 같은 모호한 말 대신 stable이라는 임상어를 쓰고, 어떤 약물과 속도에서 그런지 함께 말해요."))
s=sit('검사·시술 후 인계'); replace_kind(s,'context',dict(kind='context',words=['w-bronchoscopy'],word='bronchoscopy',ko='기관지경검사',scenes=[
 dict(who='동료 간호사',icon='handshake2',en="The bronchoscopy is done, and samples are sent.",ok=True),
 dict(who='의사에게 보고',icon='stetho',en="Since the bronchoscopy, her oxygen has been stable.",ok=True),
 dict(who='환자에게',icon='me',en="Your bronchoscopy with lavage is done, and the samples are sent.",ok=False,fix="The camera test of your airways is done, and we sent a few small samples to the lab.")],
 why="의료진끼리는 bronchoscopy가 검사 이름으로 바로 통해요. 환자에게 bronchoscopy와 lavage를 그대로 말하면 무슨 검사인지 몰라서, 기도를 카메라로 보는 검사라고 쉽게 풀어 줘요."))
s=sit('다수 중환자 동시 인계 우선화')
s['nuance']=[n for n in s['nuance'] if n['kind']!='context']+[dict(kind='swap',words=['w-call'],who='동료 간호사에게 · 도움 요청 기준',icon='handshake2',
 before=["If two of them get worse at once, ","tell somebody when you can","."],options=["tell somebody when you can","call for help early","handle it yourself"],answer="call for help early",
 notes={"tell somebody when you can":"너무 느슨해요. 두 명이 동시에 나빠지면 한 사람 손으로는 모자라니 기다리지 말고 바로 불러야 해요.","call for help early":"맞아요. 동시에 급변하면 일찍 도움을 요청해야 두 환자 모두 제때 처치받아요.","handle it yourself":"위험해요. 혼자 둘을 감당하면 둘 다 처치가 늦어져요."},
 ko="두 명이 동시에 나빠지면 일찍 도움을 요청하세요",
 why="환자 둘이 동시에 나빠지는 상황은 혼자 감당할 수 없어요. 인계에서 미리 이럴 때는 일찍 도움을 부르기로 정해 두면 밤에 망설이지 않아요.")]
# --- 2. slider 방향 ---
s=sit('응급실에서 ICU 입실 인계'); sl=[n for n in s['nuance'] if n['kind']=='slider'][0]; sl['scale']=['normalized','improving','still high']; sl['answerAt']=1
s=sit('병원간 전원 인계'); sl=[n for n in s['nuance'] if n['kind']=='slider'][0]; sl['scale']=['stable','borderline','unstable']; sl['answerAt']=2
# S19 swap
s=sit('임종·목표변경 인계'); 
s['nuance']=[n for n in s['nuance'] if n['kind']!='swap']+[dict(kind='swap',words=['w-dnr','w-code','w-comfort'],who='가족에게 · DNR 뜻 설명',icon='home',
 before=["We've changed his code status to DNR, which means we ","will stop all care"," if his heart stops."],options=["will stop all care","won't do CPR","will try everything"],answer="won't do CPR",
 notes={"will stop all care":"틀려요. DNR은 치료를 모두 멈추는 게 아니에요. 심정지 때 소생술만 하지 않고, 편안하게 하는 치료는 계속해요.","won't do CPR":"맞아요. DNR이 무엇을 하지 않는다는 뜻인지 쉬운 말로 이어서 알려 줘요.","will try everything":"틀려요. DNR은 심정지 때 소생술을 하지 않기로 한 지시라서 모든 것을 시도한다는 뜻과 반대예요."},
 ko="코드 상태를 DNR로 바꿨어요, 심장이 멎어도 심폐소생술은 하지 않는다는 뜻이에요",
 why="가족에게 DNR을 말했다면 그 뜻을 바로 쉬운 말로 이어 줘야 해요. 심정지 때 소생술(CPR)만 하지 않을 뿐 편안하게 하는 치료는 계속된다는 점을 분명히 하면 오해가 줄어요.")]
# S18 swap options
s=sit('정보 누락·오류 정정 인계'); sw=[n for n in s['nuance'] if n['kind']=='swap'][0]
sw['options']=["Oops, my bad","Correction to my handoff","Small change"]; sw['answer']="Correction to my handoff"
sw['notes']={"Oops, my bad":sw['notes']['Oops, my bad'],"Correction to my handoff":"정정이라는 말을 분명히 하고 바로 바뀐 수치를 이어 말해요. 받는 사람이 앞서 들은 숫자를 고치도록 신호를 줘요.","Small change":sw['notes']['Small change']}
for f,d in docs.items():
    yaml.safe_dump(d,open(f,'w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
