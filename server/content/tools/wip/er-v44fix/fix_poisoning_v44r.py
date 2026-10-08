import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
p='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-poisoning.yaml'
d=load(p)
S=d['situations']
x=S[17]['sentences'][4]; assert x['blank']['options'][3]=={'en':'moving'}
x['blank']['options'][3]={'en':'feeding'}
old='맛이 안 좋다는 거 알아요, 하지만 독을 빨아들여 붙잡는 데 도움이 될 거예요.'
new='맛이 안 좋다는 거 알아요, 하지만 독을 빨아들이는 데 도움이 될 거예요.'
W={w['id']:w for w in d['words']}
n=0
for w in ('w-taste','w-poison'):
    assert W[w]['exKo']==old; W[w]['exKo']=new; n+=1
x=S[1]['sentences'][3]; assert x['ko']==old; x['ko']=new
print(n)
save(d,p)
