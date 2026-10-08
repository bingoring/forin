import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _lib_v44fix_polyfive import *
f=Fx('er-procedures'); S=f.S; W=f.W
T=lambda n: S[n]['title']
# 9.4 시험 용량 — 사용자 결정(처방 없음): 직접 쓴 문장
t=f.sent(9,T(9),4,'This is a small test dose to start.','첫 항생제를 시험 용량으로 소개하는 말은 미국 관행과 어긋나 호출 버튼 안내로 바꿈',
  en='Press your call button if anything feels wrong.',
  ko='뭔가 이상하면 호출 버튼을 눌러 주세요.',
  chunks=['Press','your call button','if anything','feels wrong','.'],
  words=['w-call_button','w-feel'],
  tag='호출 안내',icon='bell',decoy='every hour',
  distractorsKo=['주입 속도를 조금 낮출게요','이 약은 삼십 분 동안 들어가요'],
  blank={'answer':'button','options':[{'en':'button'},{'en':'door'},{'en':'curtain'},{'en':'blanket'}]},
  why='call button으로 환자가 직접 부를 수 있는 길을 알려 줘요. 첫 투여 중 이상한 느낌이 생기면 바로 알려야 하므로, 간호사가 곁에 없을 때도 쓸 수 있는 방법을 쥐여 줘요.')
# 5.5 시도 횟수 제한 — 처방 없음: 직접 쓴 문장
t=f.sent(5,T(5),5,"We won't stop until we find a good vein.",'끝까지 멈추지 않겠다는 말은 시도 횟수 제한(INS)·5.2와 어긋나 한 번 더 시도하고 도움을 받겠다는 말로 바꿈',
  en="I'll try once more, and then we'll get help.",
  ko='한 번만 더 해 보고, 그다음엔 도움을 받을게요.',
  chunks=["I'll try",'once more',', and then',"we'll get help",'.'],
  words=['w-try'],
  tag='시도 한도',icon='handshake2',decoy='at home',
  distractorsKo=['다른 팔에서 해 볼게요','초음파로 정맥을 먼저 찾아볼게요'],
  blank={'answer':'once','options':[{'en':'once'},{'en':'twice'},{'en':'never'},{'en':'always'}]},
  why='once more로 시도에 한도를 두고, and then으로 그다음 계획을 이어요. 한 사람이 두 번쯤 시도하고도 안 되면 능숙한 동료나 초음파 유도로 넘기는 것이 기준이라, 끝없이 찌르지 않는다고 환자에게 알려요.')
# 18.2 독립 이중 확인 — 처방 없음 (keyPhrase)
t=f.sent(18,T(18),2,'I calculated fifteen units; can you confirm?','값을 먼저 말하면 독립 이중 확인이 아니라 각자 따로 계산한 뒤 맞춰 보자는 말로 바꿈',
  en="Please calculate the units on your own, then we'll compare.",
  ko='먼저 혼자 유닛을 계산해 주세요, 그다음 맞춰 봐요.',
  chunks=['Please calculate','the units','on your own',", then we'll compare",'.'],
  words=['w-calculate','w-unit'],
  tag='독립 계산',icon='pencil',decoy='for a week',
  blank={'answer':'calculate','options':[{'en':'calculate'},{'en':'forget'},{'en':'cancel'},{'en':'ignore'}]},
  why='on your own으로 상대가 내 값을 듣기 전에 따로 계산하게 해요. 인슐린·헤파린 같은 고위험 약의 독립 이중 확인은 두 사람이 각자 계산한 뒤 맞춰 보는 것이 원칙이에요(ISMP).')
S[18]['sentences'][2]['distractorsKo']=['15유닛을 이미 투여했어요','혈당을 한 번 더 재 볼게요']
o=S[18]['order']; L=o['lines']
assert L[0]['en']==t['en'] and L[1]['en']=="Let's read it against the order, aloud."
L[0]['ko']='먼저 혼자 유닛을 계산해 주세요, 그다음 맞춰 봐요'; L[0]['note']='계산'
L[1]['en']="Now let's read both numbers against the order, aloud."; L[1]['ko']='이제 두 숫자를 처방과 대조해 소리 내어 읽어봐요'
L[2]['en']="Wait — my number doesn't match the order."; L[2]['ko']='잠깐만요, 제 숫자가 처방과 안 맞아요'
o['why']="먼저 각자 따로 계산하자고 하고, 두 숫자를 처방과 소리 내어 대조하고, 어긋나면 멈추라고 하고, 잡아 준 것에 감사해요. 'both numbers'·'my number'·'that'이 앞 줄에 기대어 순서가 하나예요."
# 20.1 관사
f.sent(20,T(20),1,'Do you want one-to-one-to-one ratio with plasma and platelets?','`one-to-one-to-one ratio` 앞에 관사 a가 빠짐',
  en='Do you want a one-to-one-to-one ratio with plasma and platelets?',
  chunks=['Do you want','a one-to-one-to-one ratio','with plasma','and platelets','?'])
# 11.2
f.sent(11,T(11),2,"It feels strange, but it won't stop you breathing.",'미국 영어는 stop you from breathing',
  en="It feels strange, but it won't stop you from breathing.",
  chunks=['It feels strange',', but it',"won't stop",'you from breathing','.'])
# 6.3 결과를 약속하는 말
f.sent(6,T(6),3,"It'll be over before he even notices.",'결과를 장담하는 말을 should로 낮춰 같은 상황 swap(거짓 약속은 신뢰를 잃는다)과 맞춤',
  en='It should be over before he even notices.',
  ko='아마 아이가 알아차리기도 전에 끝날 거예요.',
  chunks=['It should be over','before he','even notices','.'],
  why="보호자에게 '아주 짧다'를 알리는 말이에요. should로 장담 대신 예상으로 말하고, 아이에게 직접 '아프지 않다'고 약속하지는 않아요 — 같은 상황 swap처럼 정직한 말이 신뢰를 지켜요.")
# 17.4 I promise
f.sent(17,T(17),4,'This will work fast, I promise.','결과를 약속하는 말(I promise) 대신 예상과 곁에 있음을 말함',
  en="This should work fast, and we're right here with you.",
  ko='이건 빨리 효과가 날 거예요, 저희가 바로 곁에 있어요.',
  chunks=['This should','work fast',", and we're right here",'with you','.'],
  words=['w-work'],
  why="should로 결과를 약속하지 않고 예상을 전하고, and we're right here로 곁에 있다고 안심시켜요. 골내 경로는 약과 수액을 빠르게 전달하지만 결과를 약속하지는 않아요.")
L=S[17]['order']['lines']; assert 'I promise' in L[3]['en']
L[3]['en']='Hang on — those fluids should work fast.'; L[3]['ko']='조금만 버텨요, 그 수액이 곧 효과가 날 거예요'
f.rm_word('w-promise','17.4에서 I promise를 버려 쓰는 곳이 없어짐')
# ko
f.sent(0,T(0),0,'Can you tell me your full name and date of birth?','`이름과 생년월일을 전부`가 부자연스러움',ko='성함 전체와 생년월일을 말씀해 주시겠어요?')
f.sent(9,T(9),0,'Have you had this antibiotic before?','정맥 항생제라 `복용해 보신`이 어긋남',ko='이 항생제를 전에 맞아 보신 적 있나요?')
# chunks
for n,idx,ch in [(0,4,["I'll compare",'this','with your chart','just to be safe','.']),
  (6,2,['A sticker','and a big high-five','are waiting','after','.']),
  (8,0,['I need to clean','the site','really well','first','.'])]:
    f.sent(n,T(n),idx,S[n]['sentences'][idx]['en'],'구를 끊는 청크(`just to / be safe`, `a big / high-five are / waiting after`, `the site really / well first`)를 구 경계로 다시 나눔',chunks=ch)
f.word('w-stop','단독 예문이 포기하지 않겠다는 5.5의 옛 약속이라 수혈 반응 때 멈추는 예문으로 바꿈',example='Stop the transfusion right away if you see a reaction.',exKo='반응이 보이면 수혈을 바로 멈추세요.')
f.word('w-breathe','단독 예문을 11.2와 같은 미국식 `from breathing`으로 맞춤',example="It won't stop you from breathing.")
f.word('w-calculate','단독 예문이 값을 먼저 말하는 옛 18.2라 새 18.2 문장으로 맞춤',example="Please calculate the units on your own, then we'll compare.",exKo='먼저 혼자 유닛을 계산해 주세요, 그다음 맞춰 봐요.')
f.word('w-unit','단독 예문이 값을 먼저 말하는 옛 18.2라 새 18.2 문장으로 맞춤',example="Please calculate the units on your own, then we'll compare.",exKo='먼저 혼자 유닛을 계산해 주세요, 그다음 맞춰 봐요.')
f.finish()
