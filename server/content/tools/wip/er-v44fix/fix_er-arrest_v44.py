import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _fixlib_p1 import Fix
f=Fix('er-arrest')
def chk(si,k,en): assert f.sent(si,k)['en']==en,(si,k,f.sent(si,k)['en'])

# 16.2 keyPhrase — 2015 이후 지침: 흉골 아래쪽 절반
chk(16,2,'Keep compressions high on the sternum and continuous.')
f.set_sentence(16,2,'압박 위치 "흉골 위쪽"은 AHA 2015·ERC 2021 지침과 어긋나 "흉골 아래쪽 절반"으로 바로잡음(keyPhrase)',
    en='Keep compressions on the lower half of the sternum and continuous.',
    ko='흉골 아래쪽 절반에서 압박을 끊김 없이 계속하세요.',
    chunks=['Keep compressions','on the lower half','of the sternum','and continuous','.'])
# 10.3 에피 두 번 / 라운드
chk(10,3,"We've given epi twice so far in this round.")
f.set_sentence(10,3,'한 라운드(2분)에 에피 두 번은 3~5분 간격과 어긋나 "이번 코드"로 바꿈',
    en="We've given epi twice so far in this code.",
    ko='이번 코드에서 지금까지 에피를 두 번 줬어요.',
    chunks=["We've given epi",'twice','so far','in this code','.'],
    words=['w-give','w-epi'])
s=f.sent(10,3)
assert s['distractorsKo'][0]=='다음 에피는 1분 뒤예요'
s['distractorsKo']=['다음 에피는 곧 준비할게요','이번 코드에서 충격을 두 번 줬어요']
# 20.3 압박 보류로 읽힘
chk(20,3,'Control the bleeding first, then start compressions.')
f.set_sentence(20,3,'"출혈 먼저, 그다음 압박"이 압박을 보류하라는 말로 읽혀, 압박은 이어 가며 출혈을 잡는 말로 바꿈',
    en='Control the bleeding first, and keep compressions going meanwhile.',
    ko='먼저 출혈을 조절하고, 그동안 압박은 계속 이어 가세요.',
    chunks=['Control the bleeding first',', and keep','compressions','going meanwhile','.'],
    words=['w-control','w-bleed','w-keep','w-compression'])
s=f.sent(20,3)
s['why']='first로 큰 출혈을 잡는 일이 먼저라고 말하고, and keep …going meanwhile로 압박은 멈추지 않고 함께 이어 간다고 덧붙여요. 외상성 심정지에서 출혈 조절이 먼저지만, 손이 있으면 압박도 계속해요.'
s['decoy']='fluids'
# 17.3 ko
chk(17,3,'Give epinephrine into the vein right away, not just the muscle.')
f.set_sentence(17,3,'ko "근육이 아니라"가 en not just(근육만이 아니라)와 어긋나 맞춤',
    ko='근육주사만 하지 말고 에피네프린을 정맥으로 바로 주세요.')
# 17.4 en
chk(17,4,'Run fluids wide open and watch his airway swell.')
f.set_sentence(17,4,'"기도가 붓는 걸 지켜본다"로 들리는 말을 "기도 부종을 살피라"로 바로잡음',
    en='Run fluids wide open and watch for airway swelling.',
    ko='수액을 완전히 열고 기도가 붓는지 살펴보세요.',
    chunks=['Run fluids wide open','and watch for','airway','swelling','.'])
s=f.sent(17,4)
s['blank']={'answer':'swelling','options':[{'en':x} for x in ['swelling','drying','cleaning','burning']]}
s['decoy']='his pupils'
s['why']='and로 지금 할 일과 지켜볼 일을 이어요. watch for는 아직 안 일어난 일을 미리 살피라는 말이고, airway swelling은 기도가 붓는 것이에요. 붓기가 심해지면 기도 확보가 어려워져요.'
# 19.2 ko
chk(19,2,"I'm so sorry — take all the time you need with him.")
f.set_sentence(19,2,'ko "죄송해요"는 사과인데 why는 "사과가 아니라 위로"라서 "안타까워요"로 바꿈',
    ko='정말 안타까워요 — 필요한 만큼 시간을 가지세요.')
# 8.2 ko
chk(8,2,'Access is secured, ready for medications.')
f.set_sentence(8,2,'ko 주어 없음 — "정맥로가 확보됐고"로 보충',
    ko='정맥로가 확보됐고, 투약 준비됐어요.')
# chunks
chk(3,2,'Watch for the chest to rise with each breath.')
f.set_sentence(3,2,'chunks가 with each / breath로 구를 끊어 with each breath를 한 조각으로',
    chunks=['Watch for','the chest','to rise','with each breath','.'])
f.sent(3,2)['decoy']='the stomach'
chk(10,4,'Let the leader know the current rhythm and time down.')
f.set_sentence(10,4,'chunks가 and time / down으로 구를 끊어 and time down을 한 조각으로',
    chunks=['Let the leader','know','the current rhythm','and time down','.'])
chk(14,2,'Space out the medications until his core temperature rises.')
f.set_sentence(14,2,'chunks가 until his core / temperature rises로 구를 끊어 core temperature를 한 조각으로',
    chunks=['Space out','the medications','until his core temperature','rises','.'])
# ko 번역투 → 환자분
chk(7,3,'We should check his potassium level right away.')
f.set_sentence(7,3,'번역투 "그의" → "환자분"',ko='환자분 칼륨 수치를 바로 확인해야 해요.')
s=f.sent(7,3); assert s['distractorsKo'][0]=='그의 칼륨 약을 바로 줘야 해요'
s['distractorsKo']=['환자분 마그네슘 수치도 같이 확인해야 해요','혈당도 같이 재 주세요']
chk(11,0,'The team is doing everything they can for him right now.')
f.set_sentence(11,0,'번역투 "그를 위해" → "환자분을 위해"',ko='팀이 지금 환자분을 위해 할 수 있는 모든 걸 하고 있어요.')
chk(11,2,'You can stand here where he can hear your voice.')
f.set_sentence(11,2,'번역투 "그가" → "환자분이"',ko='여기 서 계시면 환자분이 목소리를 들을 수 있어요.')
chk(19,0,"We've confirmed his wishes not to be resuscitated.")
f.set_sentence(19,0,'번역투 "그의 뜻" → "환자분의 뜻"',ko='소생시키지 말라는 환자분의 뜻을 확인했어요.')
s=f.sent(19,0); assert s['distractorsKo'][1]=='그의 뜻은 아직 확인하지 못했어요'
s['distractorsKo'][1]='환자분의 뜻은 아직 확인하지 못했어요'
o=f.sit(19)['order']['lines'][0]; assert o['ko']=='소생시키지 말라는 그의 뜻을 확인했어요'
o['ko']='소생시키지 말라는 환자분의 뜻을 확인했어요'
f.save()
