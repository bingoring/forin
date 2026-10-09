import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
f=Fx('/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-ortho-trauma.yaml')
# 2.5 (파일상 1.4)
en='Squeeze my fingers as hard as you can with both hands.'
x=f.set_sent(1,4,'on both hands는 부자연스러워 with both hands로',en=en,chunks=['Squeeze my fingers','as hard as','you can','with both hands','.'])
x['why']=x['why'].replace('on both hands','with both hands'); assert 'with both hands' in x['why']
for w in ('w-squeeze','w-hard'): f.set_word(w,'신경혈관 확인 문장 en이 바뀜 — 예문도 새 문장으로',example=en)
# 10.3 (파일상 9.2)
en='''We'll control your bleeding while we prepare for the transfer.'''
x=f.set_sent(9,2,'while we prepare transfer에 관사·전치사가 빠져 prepare for the transfer로',en=en,chunks=["We'll control",'your bleeding','while we prepare','for the transfer','.'])
x['why']=x['why'].replace('while we prepare transfer','while we prepare for the transfer'); assert 'prepare for the transfer' in x['why']
for w in ('w-control','w-bleed','w-prepare','w-transfer'): f.set_word(w,'손가락 절단 이송 문장 en이 바뀜 — 예문도 새 문장으로',example=en)
# 13.5 (파일상 12.4)
ko='왜 뼈가 약한지 보기 위해 검사를 할 거예요.'
f.set_sent(12,4,'검사를 지시할게요는 간호사가 지시하는 말로 읽혀 검사를 할 거예요로',ko=ko)
for w in ('w-order','w-scan'): f.set_word(w,'병적 골절 문장 ko가 바뀜 — exKo도 새 ko로',exKo=ko)
f.finish('/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-ortho-trauma.yaml')
