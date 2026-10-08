import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
d=load(R+'base-er-asthma-copd.yaml'); n=0
t=d['situations'][20]; assert t['title']=='임박 호흡정지 SBAR 이송'
x=t['sentences'][3]; assert x['decoy']=='history of' and x['en'].startswith('Background: known severe COPD')
x['decoy']='was given'
save(d,R+'base-er-asthma-copd.yaml')
