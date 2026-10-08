import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
F=Fx(R+'base-core-handoff-er.yaml')
t=F.sit(3); assert t['title']=='환자 정보 재확인'
# 3.4: 기존 changes 항목(en·ko·chunks·words)이 이미 있어 중복 기록하지 않음
x=t['sentences'][4]; assert x['en']=='Her name and date of birth both match the chart.'
x['en']='His name and date of birth both match the chart.'
x['chunks']=['His name','and date of birth','both match','the chart','.']
F.W['w-match']['example']=x['en']
# 3.5: 새 변경
F.set_sent(3,5,"같은 환자(Mr. Alvarez)인데 대명사가 her였음 — his로 맞춤",
  en="I'll wait while you double-check his wristband.",
  chunks=["I'll wait",'while you double-check','his wristband','.'])
F.finish('/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-core-handoff-er.yaml')
