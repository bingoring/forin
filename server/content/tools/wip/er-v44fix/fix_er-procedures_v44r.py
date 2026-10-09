import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
f=Fx(R+'base-er-procedures.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
x=S(5,'어려운 정맥 확보',5); assert x['decoy']=='at home'
x['blank']={'answer':'help','options':[{'en':n} for n in ['help','a snack','a new gown','a new bag']]}; x['decoy']='until we find'
x=S(18,'응급 약물 오류 방지',2); assert x['decoy']=='for a week'; x['decoy']='mine is fifteen'
x=S(17,'골내주사(IO) 응급 확보',4); assert x['decoy']==', I doubt it'; x['decoy']='was placed'
save(f.d,f.path)   # v46 필드만 바뀌어 changes 변동 없음
