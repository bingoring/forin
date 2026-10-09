import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _fixlib_p1 import Fix
f=Fix('er-bleeding-wound')
def chk(si,k,en): assert f.sent(si,k)['en']==en,(si,k,f.sent(si,k)['en'])
chk(12,2,'How is your blood sugar been controlled lately?')
f.set_sentence(12,2,'비문 "How is … been controlled"를 현재완료 "How has … been controlled"로',
    en='How has your blood sugar been controlled lately?',
    chunks=['How has','your blood sugar','been controlled','lately','?'])
chk(11,2,'The heavy bleeding looks worse than it usually is.')
f.set_sentence(11,2,'ko가 같은 말을 되풀이해("심해 보이지만 … 더 심해 보여요") 자연스럽게',
    ko='피가 많이 나 보여도 보통은 보기보다 심하지 않아요.')
chk(20,4,'Vitals are stable and the limb is warm.')
f.set_sentence(20,4,'지혈대가 감긴 인계에서 "the limb is warm"은 지혈대가 덜 조였다는 신호로 읽혀 "지혈대가 유지되고 있다"로',
    en='Vitals are stable and the tourniquet is holding.',
    ko='활력징후는 안정적이고 지혈대는 잘 유지되고 있습니다.',
    chunks=['Vitals are stable','and the tourniquet','is holding','.'],
    words=['w-vital','w-stable','w-tourniquet'])
s=f.sent(20,4)
s['why']='Vitals are stable로 활력징후를 한 줄에 전하고, the tourniquet is holding으로 지혈대가 제자리에서 출혈을 막고 있다고 덧붙여요. 지혈과 수혈 뒤에는 활력징후와 지혈대 상태를 함께 알려요.'
f.remove_word('w-warm','20.4에서 "the limb is warm"을 빼 어느 문장도 태그하지 않게 됨(미사용 단어)')
f.save()
