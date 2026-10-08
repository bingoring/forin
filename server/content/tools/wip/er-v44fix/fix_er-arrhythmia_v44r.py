import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
d=load(R+'base-er-arrhythmia.yaml'); S=d['situations']
def T(i,t): assert S[i]['title']==t,(i,S[i]['title']); return S[i]
# 15.2
x=T(15,'불안정 SVT 심율동전환 준비')['sentences'][2]; assert x['blank']['answer']=='quick'
x['blank']['options']=[{'en':'constant'},{'en':'quick'},{'en':'long'},{'en':'painful'}]
# 11.4
x=T(11,'항부정맥제 복약 순응도')['sentences'][4]; assert x['en'].startswith('Please call us right away')
x['en']='Come back to the ER right away if the irregular rhythm returns.'
x['ko']='불규칙한 리듬이 다시 돌아오면 바로 응급실로 오세요.'
x['chunks']=['Come back to the ER','right away','if the irregular rhythm','returns','.']
x['tag']='재방문 안내'
x['why']='if로 어떤 경우에 다시 와야 하는지 조건을 분명히 말해요. 리듬이 다시 흐트러지면 미루지 말고 와야 해서 right away를 붙여요.'
x['decoy']='returned'
assert x['blank']['answer']=='irregular'
# 17.0
x=T(17,'WPW+심방세동 위험')['sentences'][0]; assert x['decoy']=='tomorrow morning'; x['decoy']='knows about'
# 17.4
x=T(17,'WPW+심방세동 위험')['sentences'][4]; assert x['blank']['answer']=='new'
x['blank']['options']=[{'en':'new'},{'en':'former'},{'en':'absent'},{'en':'retired'}]
save(d,R+'base-er-arrhythmia.yaml')
