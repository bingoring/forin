# v44r 보정: V8(청크 4개 이상) 때문에 검토 처방 chunks를 한 번 더 나눈다
import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
d=load(R+'base-er-arrest.yaml'); S=d['situations']
x=S[10]['sentences'][4]; assert x['chunks'][0]=='Let the leader know'; x['chunks']=['Let the leader know','the current rhythm','and','time down','.']
x=S[17]['sentences'][4]; assert x['chunks'][0]=='Run fluids wide open'; x['chunks']=['Run fluids','wide open','and watch for','airway swelling','.']
x=S[20]['sentences'][3]; assert x['chunks'][0]=='Control the bleeding first'; x['chunks']=['Control the bleeding','first',', and keep compressions going','in the meantime','.']
save(d,R+'base-er-arrest.yaml')
