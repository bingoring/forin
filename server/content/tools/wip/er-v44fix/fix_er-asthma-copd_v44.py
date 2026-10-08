import sys; sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix')
from _fixlib_p1 import Fix
f=Fix('er-asthma-copd')
def chk(si,k,en): assert f.sent(si,k)['en']==en,(si,k,f.sent(si,k)['en'])
chk(19,3,'His oxygen is dropping fast on that side.')
f.set_sentence(19,3,'산소포화도는 한쪽 폐의 값이 아니라 "on that side"를 뺌',
    en='His oxygen is dropping fast.',
    ko='산소포화도가 빠르게 떨어지고 있어요.',
    chunks=['His oxygen','is dropping','fast','.'],
    words=['w-oxygen','w-drop','w-fast'])
s=f.sent(19,3); s['decoy']='on room air'
wside=f.word('w-side')
f.remove_word('w-side','"on that side"를 뺐고 다른 문장이 태그하지 않아 은행에서 지움')
chk(20,3,'Background: known severe asthma, now in status asthmaticus.')
f.set_sentence(20,3,'20.0 "severe COPD flare"와 다른 환자(천식)를 가리켜, 같은 COPD 환자의 배경으로 바꿈',
    en='Background: known severe COPD on home oxygen.',
    ko='배경: 가정 산소를 쓰는 중증 COPD 병력이 있어요.',
    chunks=['Background:','known severe COPD','on home oxygen','.'],
    words=['w-background','w-known','w-copd','w-oxygen'])
s=f.sent(20,3)
s['blank']={'answer':'severe','options':[{'en':x} for x in ['mild','severe','new','late']]}
s['why']='SBAR의 B는 현재 상황을 이해하는 데 필요한 병력을 말하는 자리예요. 가정 산소를 쓰는 중증 COPD 병력이 있으면 지금 악화가 얼마나 위험한지 판단하는 근거가 돼요.'
f.save()
