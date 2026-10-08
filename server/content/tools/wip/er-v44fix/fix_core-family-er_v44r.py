import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
F=Fx(R+'base-core-family-er.yaml')
# S17 (index 17)
t=F.sit(17); assert t['title']=='장기기증 대화 연계'
x=t['sentences'][1]; assert x['decoy']=='instead of me'; x['decoy']='talk about'
p=t['nuance'][0]; assert p['kind']=='pair' and p['decoys']==['to the team']
p['decoys']=['at the team']
assert p['why'].startswith('connect you with는 사람을')
p['why']=p['why'].replace('connect you with는 사람을','connect you with(to)는 사람을',1)
# w-choice cue
w=F.W['w-choice']; assert '전적으로 가족의 몫' in w['cue']
w['cue']="여러 길 중 가족이 고르는 결정 — 틀린 답이 없다고 안심시킬 때 'no wrong ___'"
# S10 아이 -> 환자
K2='머리 쪽 가까이 계시면서 부드럽게 말씀해 주시는 게 가장 도움이 돼요.'
K1='환자분의 안전을 위해 제가 처치할 공간이 조금 필요해요.'
for i in ('w-most','w-near','w-softly'): F.W[i]['exKo']=K2
for i in ('w-safety','w-little'): F.W[i]['exKo']=K1
F.W['w-softly']['cue']='불안한 환자 곁에서 목소리를 낮춰 — talk ___'
s10=F.sit(10); assert s10['title']=='보호자 과잉 개입'
sl=[n for n in s10['nuance'] if n['kind']=='slider'][0]
assert '아이가 위험한 순간에만' in sl['why']
sl['why']=sl['why'].replace('아이가 위험한 순간에만','환자가 위험한 순간에만')
save(F.d,F.path)
