import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
p='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-ortho-trauma.yaml'
d=load(p)
x=d['situations'][1]['sentences'][4]; assert x['decoy']=='for a long time'; x['decoy']='with both hand'
x=d['situations'][9]['sentences'][2]; assert x['decoy']=='after the call'; x['decoy']='prepare transfer'
save(d,p)
