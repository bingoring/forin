import sys; sys.path.insert(0,'/private/tmp/claude-501/scratch')
from fixlib import Fix
f=Fix('er-diabetic')
f.sent(15,5,reason='en 주어는 모니터인데 ko 주체가 달랐음 — ko를 "저희가 바로 알 수 있어요"로',
  ko='모니터에 변화가 생기면 저희가 바로 알 수 있어요.')
f.sent(14,3,reason='show me back은 원어민이 잘 쓰지 않고 청크도 구를 끊음 — how you\'d do it 형태로',
  en="Can you show me how you'd do it, so I know you understand?",
  ko='어떻게 하실지 보여주시겠어요? 이해하셨는지 알 수 있어요.',
  chunks=['Can you show me',"how you'd do it",', so I know','you understand','?'],
  why="how you'd do it으로 환자가 직접 해 보이게 하는 teach-back의 시연형이에요. 해 보이는 손놀림을 보면 이해했는지가 바로 드러나요.",
  decoy='so you can',
  blank={'answer':'understand','options':[{'en':'understand'},{'en':'forget'},{'en':'refuse'},{'en':'miss'}]})
f.rep(14,'understand','forget',count=None) if False else None
st=f.sit(14)
for n in st['nuance']:
    if n.get('kind')=='pair' and n.get('decoys')==['understand']: n['decoys']=['forget']
f.sent(19,2,reason='주어가 둘(swelling and blackness)이라 Is가 아니라 Are',
  en='Are the swelling and blackness spreading up your leg?',
  chunks=['Are the swelling','and blackness','spreading up','your leg','?'])
f.rep(19,'Has the swelling and blackness been spreading up your leg since then?','Have the swelling and blackness been spreading up your leg since then?')
f.sent(4,5,reason='청크 controlled helps가 your sugar controlled를 끊음 — 주어와 동사 경계에서 끊음',
  chunks=['Keeping your sugar controlled','helps','wounds heal faster','.'])
# 15.1 — 15.0과 같은 질문 → 부위를 묻는 질문으로
f.sent(15,1,reason='15.0과 같은 말을 두 번 배움 — 약한 부위(다리·팔)를 고르게 묻는 질문으로 바꿈',
  en='Do your legs or your arms feel weak?',
  ko='다리나 팔에 힘이 빠지는 느낌이 있으세요?',
  chunks=['Do your legs','or your arms','feel','weak','?'],
  words=['w-leg','w-feel','w-weak'], tag='부위 확인', decoy='or numb',
  why='legs or arms로 부위를 고르게 물어 힘이 빠지는 곳을 가늠해요. 칼륨이 낮으면 근육 힘이 빠지는데 다리부터 오는 일이 흔해요.')
# 17.3 — 17.2와 같은 말 → 수액이 혈압을 올릴 거라는 기대
f.sent(17,3,reason='17.2와 같은 말을 두 번 배움 — 수액이 혈압을 다시 올려 줄 거라는 기대를 말하는 문장으로 바꿈',
  en='The fluids should bring her blood pressure back up.',
  ko='수액이 혈압을 다시 올려 줄 거예요.',
  chunks=['The fluids','should bring','her blood pressure','back up','.'],
  words=['w-fluid','w-blood','w-pressure'], tag='기대 설명', decoy='her temperature',
  why='should로 곧 나아질 거라는 기대를 말하되 장담하지는 않아요. 수액으로 혈액량이 늘면 혈압이 오르고 장기로 가는 혈류가 회복돼요.',
  blank={'answer':'up','options':[{'en':'up'},{'en':'down'},{'en':'out'},{'en':'off'}]})
# 20.2 — 환자에게 anion gap을 말하는 어색한 실수
f.sent(20,2,reason='환자에게 하는 말인데 S20 context가 가르치는 어색한 실수(anion gap을 환자에게)와 같음 — 쉬운 말로 풀어 씀',
  en="Your labs still show a lot of acid, so I'm updating the doctor.",
  ko='검사에서 산이 아직 많이 나와서 의사에게 알리고 있어요.',
  chunks=['Your labs still','show a lot of acid,',"so I'm updating",'the doctor','.'],
  words=['w-lab','w-show','w-update'],
  why='still로 아직 나아지지 않았다는 점을, so로 그래서 보고한다는 이유를 이어요. 환자에게는 anion gap 같은 검사 용어 대신 산이 많다고 풀어 말해요. 산이 줄지 않으면 케톤이 아직 만들어지고 있어 치료가 끝나지 않았어요.',
  decoy='a clean',
  blank={'answer':'acid','options':[{'en':'acid'},{'en':'sugar'},{'en':'salt'},{'en':'water'}]})
for n in f.sit(20)['nuance']:
    if n.get('kind')=='pair':
        for p in n['pairs']:
            if p==['a wide','gap']: p[:]=['a lot of','acid']
        n['why']=n['why'].replace('음이온차가 커진 것은 a wide gap','산이 많이 남은 것은 a lot of acid')
        n['words']=[w for w in n['words'] if w!='w-gap']+['w-lab']
f.setex('w-gap',20,3)
f.wordwhy['w-gap']='예문을 20.3으로 옮김'
f.save()
