import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
d=load(R+'base-er-bleeding-wound.yaml')
t=d['situations'][20]; assert t['title']=='출혈 SBAR 인계'
old='활력징후는 안정적이고 지혈대는 잘 유지되고 있습니다.'; new='활력징후는 안정적이고 지혈대로 출혈이 계속 잡혀 있습니다.'
x=t['sentences'][4]; assert x['ko']==old; x['ko']=new
k=0
for w in d['words']:
    if w.get('exKo')==old: w['exKo']=new; k+=1
assert k==2,k
save(d,R+'base-er-bleeding-wound.yaml')
