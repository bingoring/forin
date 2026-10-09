import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from fixlib_v44 import *
R='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-environmental.yaml'
f=Fx(R+'base-er-environmental.yaml')
def T(i,t): assert f.sit(i)['title']==t,(i,f.sit(i)['title']); return f.sit(i)
# 1. 12.5 (기존 changes 항목이 [en,ko,chunks]라 직접 대입)
x=T(11,'익수 후 저체온')['sentences'][4]
assert x['en']=='The rescuers pulled him out of the ice water a few minutes ago.'
x.update(en='So you pulled him out of the ice water a few minutes ago?',ko='몇 분 전에 얼음물에서 끌어내셨다는 거죠?',
 chunks=['So you pulled him out','of the ice water','a few minutes','ago','?'],tag='경위 확인',
 why='So…?로 들은 경위를 되짚어 확인해요. 물에서 나온 시점은 저체온 정도와 치료를 정하는 단서라서, 꺼낸 사람에게 시간을 다시 확인해요.',
 decoy='did he go',blank={'answer':'pulled','options':[{'en':'poured'},{'en':'washed'},{'en':'pulled'},{'en':'dropped'}]})
w=f.W['w-pull']; w['example']='So you pulled him out of the ice water a few minutes ago?'; w['exKo']='몇 분 전에 얼음물에서 끌어내셨다는 거죠?'
# 2+4. S14 문장 3: 선택 4번이 문장을 바꾸므로 빈칸 teach 수정(2번)은 새 빈칸에 흡수됨
x=T(13,'고산/환경 노출 언어장벽')['sentences'][3]
assert x['en']=='Can you tell me how high he climbed and how quickly?'
x.update(en='Did he come down as soon as he started feeling sick?',ko='몸이 안 좋아지기 시작하자마자 바로 내려왔나요?',
 chunks=['Did he come down','as soon as','he started','feeling sick','?'],words=['w-start','w-feel','w-sick'],tag='하산 확인',
 why='as soon as로 증상과 하산 사이의 시간을 물어요. 고산병은 내려오는 것이 가장 중요한 치료라서 증상이 생긴 뒤 바로 내려왔는지가 위중도를 가늠하는 단서예요.',
 decoy='to the top',blank={'answer':'sick','options':[{'en':'sick'},{'en':'hungry'},{'en':'bored'},{'en':'rested'}]})
# 3. w-interpreter
f.set_word('w-interpreter','예문이 통역사에게 3인칭으로 부탁하는 모양(14.1에서 고친 것)이라 직접 설명하는 문장으로',
 example="We'll explain everything slowly through the interpreter.",exKo='통역을 통해 천천히 다 설명해 드릴게요.')
# changes: 기존 항목 why/fields 갱신
t=open(C).read()
def rep(a,b):
    global t
    assert t.count(a)==1,a; t=t.replace(a,b)
rep("why: 'v46 검토 결정 11 예외: `We pulled`은 간호사가 구조한 것으로 읽혀 주어를 구조대로 바꾼다'",
    "why: 'v46 검토 결정 11 예외: 구조한 사람이 보호자(시드 tagline \"we pulled him out\")라 간호사가 그 사실을 되짚어 확인하는 말로'")
rep("why: 'v46 검토 결정 11 예외: 예시 문장이 12.5 en과 같아 새 en으로 맞춤'","why: 'v46 검토 결정 11 예외: 예문이 12.5 en과 같아 새 en으로 맞춤'")
rep("""  index: 3
  fields:
  - en
  - ko
  - chunks
  why: 'v46 검토 결정 11 예외: `Please ask him`은 통역사에게 3인칭으로 부탁하는 모양이라 보호자에게 직접 묻는 말로 바꾼다'""",
"""  index: 3
  fields:
  - en
  - ko
  - chunks
  - words
  why: 'v46 검토 결정 11 예외: `Please ask him`은 통역사에게 3인칭으로 부탁하는 모양이라 보호자에게 직접 묻는 말로 바꿨고, 재검토에서 14.1과 겹치는 질문이라 하산 여부를 묻는 문장으로 바꾼다'""")
open(C,'w').write(t)
f.finish(C)  # 기반 파일 저장 + w-interpreter 항목 추가
