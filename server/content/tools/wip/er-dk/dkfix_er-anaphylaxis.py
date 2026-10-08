# er-anaphylaxis 오답 보기 검토 반영 (Opus 검토 + 길이 방향·되풀이 조정). 현재 base 파일 기준 새 스크립트.
import yaml,re
F='/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-er-anaphylaxis.yaml'
S={
    ('에피펜 사용법 교육',1):{1: '3초간 누르고 있다가, 펜을 빼서 챙기고 911에 전화하세요.', 2: '3초간 누르고 있다가, 옆 사람에게 911에 전화해 달라고 하세요.'},
    ('에피펜 사용법 교육',3):{1: '딸깍 소리가 들릴 때까지 연습용 기구를 허벅지에 대고 눌러 주세요.', 2: '딸깍 소리가 들릴 때까지 누르는 법을 가족께 알려 주세요.'},
    ('항히스타민 투여 설명',1):{1: '어지러울 수 있어서 당분간 운전은 하지 마세요.', 2: '졸릴 수 있어서 오늘 운전은 하지 마세요.'},
    ('심정지 진행 아나필락시스',1):{1: '에피네프린 투여하고 수액 1리터 전개방으로 걸고 시각을 적어주세요.', 2: '제가 에피 투여할 테니 수액 1리터 전개방으로 걸어주세요.'},
    ('심정지 진행 아나필락시스',2):{2: '기도가 부어 있으니 지금 어려운 기도 카트와 흡인기를 가져오세요.'},
    ('심정지 진행 아나필락시스',3):{2: '맥박 없습니다 — CPR 시작하고 코드 부릅니다.'},
    ('이상성 반응 관찰',1):{1: '목이나 호흡이 다시 달라지는 순간 바로 의사에게 말씀해 주세요.'},
    ('이상성 반응 관찰',0):{2: '가끔 증상이 몇 시간 뒤에 다시 나타나서, 그래서 검사를 더 한 거예요.'},
    ('이상성 반응 재악화',4):{2: '전체 용량으로 두 번째 투여를 하고, 10분마다 호흡 소리를 확인할게요.'},
    ('음식(견과) 아나필락시스',4):{1: '사기 전에 모든 음식 라벨을 읽고 숨은 견과가 있는지 물어보세요.'},
    ('이상성 반응 관찰',2):{2: '치료를 반복해야 할 수도 있으니, 의자에 앉아 계시고 모니터를 계속 붙이고 계세요.'},
    ('이상성 반응 관찰',3):{2: '집에 돌아가신 뒤에도 이 두 번째 파동이 닥칠 수 있어요.'},
    ('베타차단제 복용자',1):{2: '몸이 반응하도록 돕기 위해 수액을 빠르게 넣을게요.'},
    ('임산부 아나필락시스',3):{2: '아기는 산모가 잘 숨쉬는 게 필요해서, 산소가 두 분 모두에게 도움이 돼요.'},
    ('전형 아나필락시스',2):{1: '이게 시작되기 바로 전에 어디에 계셨나요?'},
    ('조영제 반응',3):{2: '어제부터 가려움, 홍조, 또는 부기가 있었나요?'},
    ('조영제 반응',0):{1: '지금 바로 조영제 주입을 볼게요.'},
    ('벌쏘임 전신반응',1):{2: '증상이 계속 진행되면 산소를 다시 드려야 할 수도 있어요.'},
    ('후두부종 기도폐쇄 임박',0):{2: '기도가 붓고 있어요 — 막히기 전에 지켜볼게요.'},
}
WKO={'tightness': ('압통(느낌)', '저림(느낌)'), 'calm': ['무감각한; 마비시키다', '차가운; 식히다'], 'react': ['(알레르기에서) 회복하다', '(알레르기가) 재발하다'], 'respond': ('(치료에) 회복하다', '(치료를) 중단하다'), 'response': ('저항(결과)', '저항(내성)')}
WEN={'supply': ('suppress', 'sample'), 'arrest': ['attack', 'asthma']}
d=yaml.safe_load(open(F))
T={s['title']:s for s in d['situations']}
for (t,i),vals in S.items():
    x=T[t]['sentences'][i]
    for slot,v in vals.items(): x['distractorsKo'][slot-1]=v
    assert x['distractorsKo'][0]!=x['distractorsKo'][1]
byen={}
for w in d['words']: byen.setdefault(w['en'],[]).append(w)
def setw(field,table):
    for en,v in table.items():
        assert len(byen[en])==1,en
        w=byen[en][0]
        if isinstance(v,tuple):
            if v[1] in w[field]: continue
            assert v[0] in w[field],(en,w[field]); w[field]=[v[1] if a==v[0] else a for a in w[field]]
        else: w[field]=list(v)
setw('distractorsKo',WKO); setw('distractorsEn',WEN)
open(F,'w').write(yaml.dump(d,allow_unicode=True,sort_keys=False,width=1000))
n=lambda s:len(re.sub(r'\s','',s))
for (t,i),vals in S.items():
    x=T[t]['sentences'][i]
    print(x['en'],'|',x['ko'],'|',x['distractorsKo'][0],'|',x['distractorsKo'][1])
print('both-longer',sum(all(n(v)>n(x['ko']) for v in x['distractorsKo']) for s in d['situations'] for x in s['sentences']))
