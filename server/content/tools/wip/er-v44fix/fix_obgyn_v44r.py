import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
p='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-obgyn.yaml'
d=load(p)
x=d['situations'][15]['sentences'][1]
assert x['en'].startswith('Tell me right away if your headache gets worse')
x['blank']={'answer':'worse','options':[{'en':'worse'},{'en':'better'},{'en':'milder'},{'en':'shorter'}]}
x=d['situations'][19]['sentences'][5]; assert x['decoy']=='to explain this'; x['decoy']='caused this'
n=0
for n_ in d['situations'][6].get('nuance',[]):
    if n_.get('who')=='환자에게 · 진단 전달': n_['who']='환자에게 · 유산 가능성 전달'; n+=1
assert n==1,n
save(d,p)
