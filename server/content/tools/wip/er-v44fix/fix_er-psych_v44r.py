import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-psych.yaml'
f=Fx(R+'base-er-psych.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
x=S(7,'홀딩(비자의 억류) 고지',3); assert x['decoy']=='at the clinic'; x['decoy']='let you go'
# 2. 9.3 새로 씀
x=S(9,'자살 위험 부정 환자',3); assert x['en']=='I want to double-check a few things with you first.'
f.set_sent(9,3,'9.0과 거의 같은 말이라 다른 질문(요즘 기분)으로 바꿈',
 en="Can I ask you a few more questions about how you've been feeling?",
 ko='요즘 기분이 어떠셨는지 몇 가지 더 여쭤봐도 될까요?',
 chunks=['Can I ask you','a few more questions','about how',"you've been feeling",'?'],
 words=['w-ask','w-question','w-feel'])
x['tag']='추가 질문'; x['icon']='speech'
x['why']='Can I ask …?로 허락을 구하며 질문을 이어 가요. 괜찮다고 말하는 환자에게도 요즘 어떻게 지냈는지 열린 질문을 더 하면 숨은 위험을 찾을 수 있어요. 퇴원 결정은 평가 뒤에 의사가 해요.'
x['blank']={'answer':'ask','options':[{'en':n} for n in ['ask','give','show','hand']]}; x['decoy']='is fine'
# 3
x=S(12,'1:1 관찰(sitter) 배정 설명',4); assert x['blank']['answer']=='safe'
x['blank']['options']=[{'en':n} for n in ['safe','sorry','warm','fed']]
# 4
x=S(17,'정신과 병상 대기(boarding)',5); assert x['decoy']=='in the lobby'; x['decoy']='is ready now'
f.finish(C)
