import sys; sys.path.insert(0,'/private/tmp/claude-501/scratch')
from fixlib import Fix
f=Fix('er-chest-abd-trauma')
# 2.5 — ko "바로"에 맞춰 en에 right away
f.sent(2,5,reason='ko는 "팀에 바로 알릴게요"인데 en에 right away가 없어 뜻이 어긋남(decoy 문제의 원인) — en에 right away 추가',
  en="I'll let the team know right away if anything changes.",
  chunks=["I'll let",'the team know','right away','if anything changes','.'])
# 6.5 — recheck + again 겹침
f.sent(6,5,reason='recheck와 again이 겹침 — again을 뺌',
  en="I'll recheck your oxygen level in a few minutes.",
  chunks=["I'll recheck",'your oxygen','level','in a few minutes','.'])
# 7.1 — 대시 넘는 청크
f.sent(7,1,reason='청크가 대시를 넘어 구를 끊음 — 두 문장으로 나눠 절 경계에서 끊음',
  en="I'm pressing on your upper left belly. Tell me if it's tender.",
  ko='왼쪽 윗배를 눌러볼게요. 아프면 말씀해 주세요.',
  chunks=["I'm pressing",'on your upper left belly','.','Tell me',"if it's tender",'.'])
f.rep(7,"I'm pressing on your upper left belly—tell me if it's tender.","I'm pressing on your upper left belly. Tell me if it's tender.")
f.rep(7,'왼쪽 윗배를 눌러볼게요, 아프면 말씀해 주세요','왼쪽 윗배를 눌러볼게요. 아프면 말씀해 주세요')
# 7.4 — over the last few minutes
f.sent(7,4,reason='has been dropping the last few minutes는 전치사 빠짐 — over the last few minutes',
  en='Your blood pressure has been dropping over the last few minutes.',
  chunks=['Your blood pressure','has been','dropping','over the last few minutes','.'])
# 11.0 — 대시
f.sent(11,0,reason='청크가 대시를 넘어 구를 끊음 — 두 문장으로 나눠 절 경계에서 끊음',
  en="We will not remove the object. We'll stabilize it in place.",
  chunks=['We will not remove','the object','.',"We'll stabilize it",'in place','.'], decoy='on the floor')
f.rep(11,"We will not remove the object—we'll stabilize it in place.","We will not remove the object. We'll stabilize it in place.")
# 11.3 — 박힌 물체 vs 장기 탈출: 젖은 멸균 드레싱은 노출된 장기용이라고 문장에서 밝힘
f.sent(11,3,reason='박힌 물체와 장기 탈출을 한 환자에 섞음 — 젖은 멸균 드레싱은 "노출된 장기"에만 쓴다고 문장에서 밝힘',
  en="I'll cover any exposed organ with a moist sterile dressing.",
  ko='노출된 장기가 있으면 촉촉한 멸균 드레싱으로 덮을게요.',
  chunks=["I'll cover",'any exposed organ','with a moist','sterile dressing','.'],
  words=['w-cover','w-organ','w-moist','w-sterile','w-dress'],
  why='any exposed organ으로 장기가 밖으로 나와 있을 때만이라고 범위를 밝혀요. 젖은 멸균 드레싱은 나온 장기가 마르지 않게 하고 오염을 막아요. 박힌 물체는 빼지 않고 주변을 두꺼운 패드로 받쳐요.')
f.rep(11,"Once it's taped, I'm covering the wound with a moist sterile dressing.","Once it's taped, I'll cover any exposed organ with a moist sterile dressing.")
f.rep(11,'고정되면 촉촉한 멸균 드레싱으로 상처를 덮을게요','고정되면 노출된 장기가 있을 때 촉촉한 멸균 드레싱으로 덮을게요')
# 11.4 — 11.3에서 wound가 빠져 w-wound가 쓰이지 않게 되므로 여기서 이어 받음
f.sent(11,4,reason='11.3을 노출된 장기 한정으로 바꾸면서 빠진 w-wound 태그를 이 문장에서 잇는다 — 드레싱이 장기와 상처를 지킨다',
  en='This dressing will protect the organ and wound until surgery.',
  ko='이 드레싱이 수술 전까지 장기와 상처를 보호해 줄 거예요.',
  chunks=['This dressing','will protect','the organ','and wound','until surgery','.'],
  words=['w-dress','w-protect','w-organ','w-wound','w-surgery'])
f.rep(11,'Until surgery, this dressing will protect the organ, so try to stay still.','Until surgery, this dressing will protect the organ and wound, so try to stay still.')
f.rep(11,'수술 전까지 이 드레싱이 장기를 보호하니 가만히 계세요','수술 전까지 이 드레싱이 장기와 상처를 보호하니 가만히 계세요')
f.wordwhy['w-wound']='예문을 11.4로 옮김'
f.setex('w-wound',11,4)
# 15.5 — 대시
f.sent(15,5,reason='청크가 대시를 넘어 구를 끊음 — 두 문장으로 나눠 절 경계에서 끊음',
  en='Try to stay still. This will help you breathe in a moment.',
  ko='가만히 계세요. 곧 숨쉬기가 편해질 거예요.',
  chunks=['Try to','stay still','.','This will help you','breathe in a moment','.'])
f.rep(15,'While they get ready, try to stay still—this will help you breathe in a moment.','While they get ready, try to stay still. This will help you breathe in a moment.')
f.rep(15,'팀이 준비하는 동안 가만히 계세요, 곧 숨쉬기가 편해질 거예요','팀이 준비하는 동안 가만히 계세요. 곧 숨쉬기가 편해질 거예요')
# S20 context — word car → trauma
st=f.sit(20)
c=[n for n in st['nuance'] if n.get('kind')=='context'][0]
c['word']='trauma'; c['ko']='외상'
c['scenes'][1]['en']='Pt s/p MVC, restrained driver, blunt chest and abd trauma, side impact.'
c['scenes'][2]['en']='So this poor guy has, like, some trauma from a car thing.'
f.save()
import yaml

