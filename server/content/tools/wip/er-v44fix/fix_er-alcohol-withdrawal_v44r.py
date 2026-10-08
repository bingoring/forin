import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
F=Fx(R+'base-er-alcohol-withdrawal.yaml')
t=F.sit(2); assert t['title']=='CIWA 척도 설명'
x=t['sentences'][5]; assert x['distractorsKo']==['괜찮아 보여도 자주 와요','솔직하게 답해 주세요']
x['distractorsKo']=['괜찮다고 느끼셔도 자주 와요','솔직하게 답해 주세요']
save(F.d,F.path)
