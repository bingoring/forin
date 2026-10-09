# er-arrhythmia 오답 보기 검토 반영 (Opus 검토 + 길이 방향·되풀이 조정). 현재 base 파일 기준 새 스크립트.
import yaml,re
F='/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-er-arrhythmia.yaml'
S={
    ('양성 조기박동 안심 교육',0):{1: '추가 박동은 흔하고 대개 젊을 때 생겨요.'},
    ('양성 조기박동 안심 교육',1):{1: '실신하거나 가슴이 아프거나 안 멈추면 911 부르세요.', 2: '실신하거나 가슴 통증이 있거나 숨이 차거나 멈추지 않으면 다시 오세요.'},
    ('양성 조기박동 안심 교육',4):{2: '위험하지는 않지만, 느낌이 달라지면 꼭 전화 주세요.'},
    ('발작성 SVT 미주신경자극 설명',0):{2: '힘주듯이 아랫배에 힘을 주고 그대로 기침해 보세요.'},
    ('증상 축소 환자 위험신호',4):{2: '그런 짧은 어지럼도 가끔은 중요한 단서일 수 있어요.'},
    ('심계항진+공황 감별',4):{2: '저와 함께 넷을 세면서 천천히 어깨를 내려 보세요.'},
    ('항부정맥제 복약 순응도',4):{1: '불규칙한 리듬이 다시 오면 바로 911에 전화하세요.', 2: '불규칙한 리듬이나 어지럼이 다시 오면 바로 응급실로 오세요.'},
    ('페이스메이커 오작동 의심',5):{1: '페이스메이커 배터리가 다 되면 심박수가 갑자기 떨어질 수 있어요.'},
    ('심실빈맥(VT) 긴급 대응',0):{1: '팀을 부르고 지금 크래시 카트와 패드를 가져오고 있어요.', 2: '의사를 부르고 크래시 카트를 가져오고 있어요.'},
    ('WPW+심방세동 위험',2):{2: '이렇게 빠르고 불규칙한 리듬이 가족에게도 있었나요?'},
    ('WPW+심방세동 위험',4):{2: '새로 오는 팀원마다 WPW가 있다고 카드를 보여 주세요.'},
    ('부정맥 급속 악화 SBAR',2):{1: '팀이 지금 와서 심율동전환과 기도 준비를 할 것을 권고합니다.'},
    ('부정맥 급속 악화 SBAR',4):{1: '심율동전환을 준비하려면 바로 침상에 의사가 필요합니다.'},
    ('증상 축소 환자 위험신호',2):{1: '사소하게 느껴졌더라도, 이런 증상은 설명해볼 가치가 있어요.'},
    ('증상 축소 환자 위험신호',5):{1: '우리가 놓치는 게 없도록 신중하게 하나씩 정리해봐요.'},
    ('페이스메이커 오작동 의심',4):{2: '장치 설정이 제대로 작동하고 있는지 설명할게요.'},
    ('임신 중 심계항진',5):{1: '당분간 두 분 다 계속 가까이서 도와드릴게요.'},
}
WKO={}
WEN={}
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
