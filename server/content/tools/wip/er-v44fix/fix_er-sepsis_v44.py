import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _lib_v44fix_polyfive import *
f=Fx('er-sepsis'); S=f.S; W=f.W
T=lambda n: S[n]['title']
# 5.3 번들은 시작이지 완료가 아님
f.sent(5,T(5),3,'We have one hour to get all four of these done.','1시간 번들은 한 시간 안에 시작하는 것이지 끝내는 것이 아님(Hour-1 bundle)',
  en='We have one hour to get all four of these started.',
  ko='이 네 가지를 한 시간 안에 모두 시작해야 해요.',
  chunks=['We have one hour','to get','all four of these','started','.'],
  words=['w-get','w-start'],
  why='one hour로 제한 시간을 숫자로 말해 왜 서두르는지 설명해요. all four of these started로 한 시간 안에 끝내는 것이 아니라 시작하는 것이 목표임을 정확히 말해요. 패혈증 번들은 패혈증을 알아본 시점부터 한 시간 안에 시작하는 것을 목표로 해요.')
# 14.3 통역사에게 문진을 맡김
f.sent(14,T(14),3,'Ask the interpreter to find out if she has any allergies.','통역사에게 문진을 맡기지 않고 간호사가 통역을 통해 직접 묻는다고 바꿈',
  en="Through the interpreter, I'll ask her about any allergies.",
  ko='통역을 통해 알레르기가 있는지 여쭤볼게요.',
  chunks=['Through the interpreter',", I'll ask",'her about','any allergies','.'],
  words=['w-interpreter','w-ask','w-allergy'],
  why="Through the interpreter로 통역을 거친다고 밝히고 I'll ask her로 묻는 사람은 간호사라고 분명히 해요. 통역사는 말을 옮기는 사람이라 문진을 맡기지 않아요. 항생제를 쓰기 전에는 알레르기 확인이 기본 안전 확인이에요.")
S[14]['sentences'][3]['distractorsKo']=['쓰시는 언어를 한 번 더 확인할게요','글을 읽으실 수 있는지도 여쭤볼게요']
# 14.2 3인칭 통역 (keyPhrase)
f.sent(14,T(14),2,'Please ask her where she feels pain and when this started.','통역사에게 `ask her`로 넘기는 3인칭 말투는 미국 관행과 어긋나 환자에게 직접 묻는 말로 바꿈',
  en='Where do you feel pain, and when did this start?',
  ko='어디가 아프세요, 그리고 언제부터 시작됐나요?',
  chunks=['Where do you','feel pain',', and when','did this start','?'],
  words=['w-feel','w-pain','w-start'],
  tag='직접 질문',
  blank={'answer':'feel','options':[{'en':'feel'},{'en':'see'},{'en':'hear'},{'en':'taste'}]},
  distractorsKo=['보호자분 연락처를 알려 주시겠어요?','병원에 오기 전에 무엇을 드셨나요?'],
  why='where와 when 두 질문을 짧게 나눠 통역에서 뜻이 덜 흐려져요. 미국 병원 표준대로 통역사에게 ask her로 넘기지 않고 환자를 보며 직접 묻고, 통역사가 그 말을 옮겨요.')
# 9.0 패혈증 설명 (keyPhrase)
f.sent(9,T(9),0,"Your pneumonia has spread to your whole body, so we're acting fast.",'패혈증은 균이 퍼진 것이 아니라 감염에 몸이 반응해 온몸에 영향을 주는 것이라 `spread` 대신 `is affecting`',
  en="Your pneumonia is affecting your whole body, so we're acting fast.",
  ko='폐렴이 온몸에 영향을 주고 있어서 빠르게 움직이고 있어요.',
  chunks=['Your pneumonia is affecting','your whole body',", so we're acting",'fast','.'],
  words=['w-pneumonia','w-affect','w-whole','w-act','w-fast'],
  why="is affecting으로 폐렴이 폐에만 머물지 않고 온몸에 영향을 주고 있다고 쉬운 말로 알리고, so we're acting fast로 그래서 하는 행동을 바로 이어요. 폐렴 같은 감염에 몸이 지나치게 반응해 온몸의 장기가 영향을 받는 것이 패혈증이라 빠른 치료가 필요해요.")
o=S[9]['order']['lines'][0]; assert 'has spread' in o['en']
o['en']="Your pneumonia is affecting your body, and your oxygen is lower than we'd like."; o['ko']='폐렴이 몸에 영향을 주고 있고 산소 수치도 바라는 것보다 낮아요'
# 단독 예문·단어
f.word('w-ask','단독 예문이 통역사에게 질문을 넘기는 3인칭 말투라 새 14.3 문장으로 맞춤',example="Through the interpreter, I'll ask her about any allergies.",exKo='통역을 통해 알레르기가 있는지 여쭤볼게요.',cue="통역을 거쳐 환자에게 직접 물어볼 때 — 'I'll ___ her about…'")
f.word('w-pneumonia','단독 예문이 `has spread to your whole body`라 새 9.0 문장에 맞춤',example='Your pneumonia is affecting your whole body.',exKo='폐렴이 온몸에 영향을 주고 있어요.')
f.word('w-whole','단독 예문이 `spread`라 새 9.0 문장에 맞춤',example='It is affecting your whole body.',exKo='온몸에 영향을 주고 있어요.')
f.rm_word('w-spread','9.0과 S9 order에서 spread를 버려 쓰는 문장이 없어짐')
f.finish()
