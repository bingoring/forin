import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-sepsis.yaml'
f=Fx(R+'base-er-sepsis.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
T='패혈증 언어장벽 위중'
x=S(14,T,0); assert x['en'].startswith('Through the interpreter —')
f.set_sent(14,0,'14.0 무대 지시문 같은 머리말 삭제(통역사가 옮기게 됨)',
 en='We believe she has a serious infection.',ko='심각한 감염이 있다고 생각해요.',
 chunks=['We believe','she has','a serious infection','.'],words=['w-believe','w-serious','w-infection'])
x['tag']='가족에게 설명'
x['why']="believe로 확진 전의 판단임을 정직하게 말하면서 serious로 긴급성은 분명히 해요. 통역을 쓸 때도 통역사가 아니라 가족을 보며 직접 말하고, 'Through the interpreter' 같은 머리말은 붙이지 않아요. 통역사는 들은 말을 그대로 옮기니까요."
x=S(14,T,2); assert x['en']=='Where do you feel pain, and when did this start?'
f.set_sent(14,2,'14.2 롤플레이 상대는 딸이라 어머니에 대해 3인칭으로 직접 묻는다',
 en='Where does she feel pain, and when did this start?',ko='어머니는 어디가 아프시고, 언제부터 시작됐나요?',
 chunks=['Where does she','feel pain',', and when','did this start','?'])
x['why']='where와 when 두 질문을 짧게 나눠 통역에서 뜻이 덜 흐려져요. 통역사에게 ask her로 넘기지 않고 눈앞의 딸을 보며 직접 묻고, 통역사가 그 말을 옮겨요.'
x['distractorsKo']=['보호자분 연락처를 알려 주시겠어요?','어머니가 병원에 오시기 전에 무엇을 드셨나요?']
# order
L=f.sit(14)['order']['lines']
L[0].update(en='We believe she has a serious infection.',ko='심각한 감염이 있다고 생각해요')
L[2].update(en='Before she gets the antibiotic, does she have any allergies?',ko='항생제를 드리기 전에요, 어머니께 알레르기가 있나요?')
L[3].update(en='Thank you. Now, where does she feel pain, and when did this start?',ko='고마워요. 이제 어머니가 어디가 아프시고 언제 시작됐는지 말씀해 주세요')
# 20.3
T='중증 패혈증 ICU 이송'
x=S(20,T,3); assert x['en'].startswith('Cultures, antibiotics, and fluids')
f.set_sent(20,3,'20.3 수액은 한 시간 안에 시작(다 들어가는 것 아님) — 5.3과 같은 오류',
 en='Cultures drawn, antibiotics given, fluids started — all within the hour.',
 ko='배양 채취, 항생제 투여, 수액 시작까지 모두 한 시간 안에 했습니다.',
 chunks=['Cultures drawn,','antibiotics given,','fluids started','— all','within the hour','.'],
 words=['w-culture','w-draw','w-antibiotic','w-give','w-fluid','w-start'])
x['tag']='번들 이행'
x['why']='항목마다 한 일을 붙여(drawn·given·started) 나열해요. 수액은 한 시간 안에 다 들어가는 것이 아니라 시작하는 것이라 started로 말해요. within the hour로 번들 시간 기준을 지켰다는 점을 받는 쪽에 알려요.'
x['blank']={'answer':'drawn','options':[{'en':n} for n in ['drawn','read','grown','signed']]}; x['decoy']='to the hour'
f.rm_word('w-done','20.3에서만 쓰였고 예문도 수액이 다 끝난 것으로 읽혀 삭제')
# 20.0 why
x=S(20,T,0); assert x['en'].startswith('Septic shock, source')
x['why']='환자 상태, 원인, 처치 완료 순으로 쉼표로 끊어 한 줄에 요약해요. bundle completed는 배양 채취·항생제 투여·젖산 측정·수액 시작 같은 1시간 번들 항목을 모두 마쳤다는 뜻이에요(수액이 다 들어갔다는 뜻은 아니에요). 인계에서는 진단·감염원·번들 완료 여부를 받는 쪽이 가장 먼저 알아야 해요.'
f.finish(C)
