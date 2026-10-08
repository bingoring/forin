import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
d=load(R+'base-er-arrest.yaml')
S=d['situations']
def T(i,t): assert S[i]['title']==t,(i,S[i]['title']); return S[i]
# 20.3
x=T(20,'외상성 심정지 특수 대응')['sentences'][3]
assert x['en'].startswith('Control the bleeding first')
x['decoy']='of fluids'
x['blank']={'answer':'first','options':[{'en':'briefly'},{'en':'once'},{'en':'first'},{'en':'partly'}]}
x['en']='Control the bleeding first, and keep compressions going in the meantime.'
x['chunks']=['Control the bleeding first',', and keep compressions going','in the meantime','.']
assert 'going meanwhile' in x['why']
x['why']=x['why'].replace('going meanwhile','going in the meantime')
# 11.0
t=T(11,'가족 입회 소생 지원')
assert t['sentences'][0]['distractorsKo'][0]=='팀이 곧 그를 병실로 옮길 거예요'
t['sentences'][0]['distractorsKo'][0]='팀이 곧 환자분을 병실로 옮길 거예요'
n=[a for a in t['nuance'] if a.get('kind')=='swap']; assert len(n)==1
assert n[0]['ko']=='지금 팀은 그의 가슴을 눌러 뇌로 피가 계속 가게 하고 있어요'
n[0]['ko']='지금 팀은 환자분 가슴을 눌러 뇌로 피가 계속 가게 하고 있어요'
# 3.2
x=T(3,'BVM 환기 협조')['sentences'][2]; assert x['decoy']=='the stomach'; x['decoy']='risen'
# 10.4
x=T(10,'소생 중 SBAR 리더 보고')['sentences'][4]; assert x['chunks'][1]=='know'
x['chunks']=['Let the leader know','the current rhythm','and time down','.']
# 17.4
x=T(17,'아나필락시스성 심정지')['sentences'][4]; assert x['chunks'][2]=='airway'
x['chunks']=['Run fluids wide open','and watch for','airway swelling','.']
save(d,R+'base-er-arrest.yaml')
