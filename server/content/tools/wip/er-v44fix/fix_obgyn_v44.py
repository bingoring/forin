import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
f=Fx('/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-obgyn.yaml')

# 6.3 — 진단 고지는 의사가 한다 (사용자 결정)
en='''I'm worried this may be a miscarriage — the doctor will talk with you about it.'''
ko='유산일 수 있어서 걱정돼요 — 의사 선생님이 그 부분을 자세히 말씀해 주실 거예요.'
x=f.set_sent(6,3,'간호사가 진단을 단정해 고지하지 않고 걱정으로 전한 뒤 의사가 설명하도록 틀을 바꿈',
  en=en,ko=ko,chunks=["I'm worried","this may be","a miscarriage","— the doctor","will talk with you","about it","."])
x['tag']='의사 연결'
x['why']="I'm worried this may be…로 확진이 아니라 걱정으로 전하고, the doctor will talk with you로 진단 설명은 의사가 한다고 이어요. 유산 진단과 고지는 보통 의사가 하므로, 간호사는 이렇게 틀을 잡아요."
x['blank']={'answer':'doctor','options':[{'en':'doctor'},{'en':'pharmacist'},{'en':'dietitian'},{'en':'transporter'}]}
x['distractorsKo']=['출혈량을 패드로 확인할게요','혈압을 한 번 더 재 볼게요']
x['decoy']='in the chart'
f.set_word('w-miscarriage','6.3 문장이 바뀜 — 예문도 새 문장으로',example=en,exKo=ko)
for n in f.sit(6)['nuance']:
    if n.get('kind')=='swap' and n.get('answer')=='a miscarriage':
        n['before']=["I'm worried this may be ",'a spontaneous abortion',' — the doctor will talk with you about it.']
        n['ko']=ko
# 6.5 / 19.5 / 4.1 / 10.4 / 17.1 / 18.1 chunks
f.set_sent(6,5,'청크가 nothing you could / have done 구를 끊음',chunks=["There was","nothing","you could have done","to prevent this","."])
f.set_sent(19,5,'청크가 구를 끊음; ko를 en("당신이 일으킨 것이 아니다")에 맞춤 — 사산은 막을 수 있었던 경우도 있어 단정하지 않음',
  ko='당신이 한 어떤 일도 이 일의 원인이 아니에요.',chunks=["There was","nothing","you could have done","to cause this","."])
f.set_sent(4,1,'청크가 in your / last pregnancy를 끊음',chunks=["Tell me","about","the issues","in your last pregnancy","."])
f.set_sent(10,4,'청크가 about your / pregnancies를 끊음',chunks=["Can you","tell me","about your pregnancies","through the interpreter","?"])
f.set_sent(17,1,'청크가 Stay with / me를 끊음',chunks=["Stay with me","— keep","your eyes","on me","."])
f.set_sent(18,1,'청크가 Stay with / me를 끊음',chunks=["Stay with me","— we're","on top of this","."])
# 8.3
en83='Would you like an exam and evidence collection, or not?'
ko83='검사와 증거 채취를 원하시나요, 아니면 원치 않으시나요?'
f.set_sent(8,3,'증거를 모으는 사람이 환자처럼 읽히던 to have an exam and collect evidence를 an exam and evidence collection으로',
  en=en83,ko=ko83,chunks=["Would you like","an exam","and evidence collection",", or not","?"])
for w in ('w-exam','w-evidence'): f.set_word(w,'8.3 문장이 바뀜 — 예문도 새 문장으로',example=en83,exKo=ko83)
# 15.1
en151='Tell me right away if your headache gets worse or your vision changes.'
ko151='두통이 심해지거나 시야가 달라지면 바로 말씀해 주세요.'
x=f.set_sent(15,1,'자간증 경련은 전조 없이 오는 경우가 많고 more headache가 어색해 두통 악화·시야 변화 알림으로 바꿈',
  en=en151,ko=ko151,chunks=["Tell me","right away","if your headache gets worse","or your vision changes","."],words=['w-headache'])
x['why']="right away와 if절로 어떤 증상이 생기면 곧바로 부르라는 기준을 줘요. 두통이 심해지거나 시야가 달라지는 것은 자간전증이 나빠지는 신호일 수 있어 놓치지 않게 해요."
x['decoy']='or any itching'
f.set_word('w-headache','15.1 문장이 바뀜 — 예문도 새 문장으로',example=en151,exKo=ko151)
a=f.sent(15,5)
f.set_word('w-seizure','15.1에서 seizure가 빠져 예문을 15.5로 옮김',example=a['en'],exKo=a['ko'])
# 19.4 — 빈칸을 has died에서 sorry로 (사용자 결정; en·ko 그대로)
x=f.sent(19,4)
x['blank']={'answer':'sorry','options':[{'en':'sorry'},{'en':'sure'},{'en':'tired'},{'en':'busy'}]}
f.finish('/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-obgyn.yaml')
