import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
p='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-pain-sedation.yaml'
d=load(p)
new='오늘이 무슨 요일인지 묻는 것은 마취에서 깨어난 환자의 지남력을 보는 질문이에요. 답이 흐리면 아직 약기운이 남아 있다는 신호라 계속 지켜봐요.'
x=d['situations'][13]['sentences'][3]; assert x['why'].startswith('날짜를 묻는'); x['why']=new
n=0
def walk(o):
    global n
    if isinstance(o,dict):
        for k,v in o.items():
            if k=='why' and isinstance(v,str) and v.startswith('날짜를 묻는 것은 마취'): o[k]=new; n+=1
            else: walk(v)
    elif isinstance(o,list):
        for v in o: walk(v)
walk(d['situations'][13])
print('other whys',n)
save(d,p)
