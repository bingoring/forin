import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
F=Fx(R+'base-core-safety-er.yaml')
x=F.sent(2,4); assert x['decoy']=="until I'm"; x['decoy']="whatever I'm"
x['blank']['options']=[{'en':'open'},{'en':'loose'},{'en':'up'},{'en':'clean'}]
x=F.sent(18,4); assert x['decoy']=='on the stairs'; x['decoy']='stairs together'
x['blank']['options']=[{'en':'weigh'},{'en':'wake'},{'en':'move'},{'en':'bathe'}]
t=F.sit(13); L=t['order']['lines'][0]
assert L['en']=='Time-out: John Reyes, born in 1962, right chest tube.'
L['en']='Time-out: John Reyes, born March 3, 1962, right chest tube.'
L['ko']='타임아웃, 존 레예스 씨, 1962년 3월 3일생, 오른쪽 흉관이에요'
assert '환자(이름·생년)' in t['order']['why']
t['order']['why']=t['order']['why'].replace('환자(이름·생년)','환자(이름·생년월일)')
x=F.sent(14,0); assert x['decoy']=='is stable'; x['decoy']='are stable'
save(F.d,F.path)
