import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
f=Fx('/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-pain-sedation.yaml')
# 15.4
x=f.set_sent(15,4,'the medicine이 모호하고 역전제로 읽으면 약리가 거꾸로 — 통증은 날록손이 오피오이드를 막는 동안 돌아옴',
  en='Your pain may come back now that the opioid is blocked.',
  ko='마약성 진통제가 차단된 상태라 통증이 다시 올 수 있어요.',
  chunks=['Your pain','may come back','now that','the opioid is blocked','.'],words=['w-pain','w-opioid'])
x['blank']={'answer':'opioid','options':[{'en':'opioid'},{'en':'antibiotic'},{'en':'steroid'},{'en':'vitamin'}]}
x['why']='날록손이 오피오이드를 막는 동안에는 오피오이드의 진통 효과도 함께 막혀서 통증이 다시 올 수 있어요. 미리 알리면 통증이 돌아와도 약이 잘못된 게 아니라고 이해해요.'
# 1.5
x=f.set_sent(1,5,'1.2는 졸리면 알려 달라는데 1.5는 정상이니 쉬라고 엇갈림 — 깨어 있기 힘들면 알리라고 덧붙임',
  en="If you feel a little drowsy, that's normal, but tell me if it gets hard to stay awake.",
  ko='조금 졸린 건 정상이지만, 깨어 있기 힘들어지면 알려 주세요.',
  chunks=['If you feel a little drowsy',", that's normal",', but tell me','if it gets hard','to stay awake','.'],words=['w-drowsy','w-normal'])
x['icon']='bell'
x['why']='졸림이 흔한 반응이라고 먼저 말해 안심시키되, 깨어 있기 힘들 만큼 졸리면 호흡이 느려지는 신호라 알려 달라고 덧붙여요. 간호사는 진정 정도를 계속 확인해요.'
x['distractorsKo']=['졸리면 약을 바로 중단할게요','졸려도 일어나 걸어 다니세요']
# 6.3
x=f.set_sent(6,3,'양상과 부위라는 다른 축을 or로 묶어 어색해 두 질문으로 나눔',
  en='Is this new pain sharp, and is it in a different spot?',
  ko='이번 통증은 날카로운가요? 그리고 다른 부위인가요?',
  chunks=['Is this new pain','sharp',', and is it','in a different spot','?'])
x['why']='양상(날카로운지)과 위치(다른 부위인지)를 따로 물어 새로 생긴 통증인지 가려요. 새롭거나 달라진 통증은 원인이 다를 수 있어 의사에게 알리는 근거가 돼요.'
# 13.3 ko (w-day exKo는 이미 새 ko와 같다)
ko='오늘이 무슨 요일인지 아세요?'
f.set_sent(13,3,'en what day it is는 요일에 가까운데 ko가 며칠이라 요일로 맞춤',ko=ko)
for l in f.sit(13)['order']['lines']:
    if l['en'].endswith('what day it is?'): l['ko']=l['ko'].replace('오늘이 며칠인지 아세요?',ko)
f.finish('/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-pain-sedation.yaml')
