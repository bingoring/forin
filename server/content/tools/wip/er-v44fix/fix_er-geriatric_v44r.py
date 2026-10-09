import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'

C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-geriatric.yaml'
f=Fx(R+'base-er-geriatric.yaml')
def S(i,t,j):
    assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)['sentences'][j]
def opts(x,ans,old,new):
    assert x['blank']['answer']==ans
    o=x['blank']['options']; assert {'en':old} in o; o[o.index({'en':old})]={'en':new}
x=S(10,'학대·방임 의심',1); assert x['decoy']=='on the phone'; x['decoy']='who you are'; opts(x,'safe','ready','wrong')
x=S(19,'고관절 골절 통증·수술 대기',4); assert x['decoy']=='for a week'; x['decoy']='of the surgery'
x['blank']['options']=[{'en':n} for n in ['check','decide','guess','forget']]; assert x['tag']=='수분 안내'; x['tag']='금식 확인'
x=S(19,'고관절 골절 통증·수술 대기',5); assert x['decoy']=='at the window'; x['decoy']='was waiting'; opts(x,'oriented','entertained','disoriented')
f.finish(C) if f.changes else save(f.d,f.path)
