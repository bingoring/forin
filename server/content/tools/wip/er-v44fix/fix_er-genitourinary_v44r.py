import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'

C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-genitourinary.yaml'
f=Fx(R+'base-er-genitourinary.yaml')
t=f.sit(7); assert t['title']=='남성 요폐(전립선)'
x=t['sentences'][2]; assert x['decoy']=='how much blood'; x['decoy']='how long ago'
sw=[n for n in t['nuance'] if n['kind']=='swap']; assert len(sw)==1 and sw[0]['who']=='환자에게 · 잔뇨 측정 안내'
sw[0]['who']='환자에게 · 방광 스캔 안내'
f.set_word('w-much','예문이 고치기 전 8.3 en과 같아 새 en으로 맞춤',example='This will tell us how much urine is inside your bladder.',
  exKo='이걸로 방광 안에 소변이 얼마나 있는지 알 수 있어요.')
f.W['w-much']['cue']="방광에 소변이 얼마나 찼는지 양을 물을 때 — 'how ___ urine'"
f.finish(C)
