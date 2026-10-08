# er-alcohol-withdrawal 오답 보기 검토 반영 (Opus 검토 + 길이 방향·되풀이 조정). 현재 base 파일 기준 새 스크립트.
import yaml,re
F='/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-er-alcohol-withdrawal.yaml'
S={
    ('티아민 투여 설명',4):{1: '포도당이나 당이 든 수액보다 항상 이름을 먼저 확인해요.', 2: '포도당이나 당이 든 수액보다 항상 티아민을 먼저 드리고 기록해요.'},
    ('중등도 금단',0):{1: '금단 점수가 높아서 진정시킬 약을 의사께 여쭤볼게요.', 2: '금단 점수가 높아서 진정할 방으로 옮길게요.'},
    ('중등도 금단',2):{1: '실제로 없는 걸 보이거나 느끼시면 가족에게도 말씀해주세요.', 2: '실제로 없는 소리가 들리면 말씀해주세요.'},
    ('금단 발작',3):{1: '발작 전 마지막으로 보신 게 뭔지 말씀해주실래요?'},
    ('반복 재원 환자',5):{2: '그 문은 열려 있어요 — 원하실 때 언제든 가족과 오시면 돼요.'},
    ('금단+정신질환',0):{2: '금단과 정신 건강을 함께 검사할게요.'},
    ('금단+정신질환',1):{2: '지금 자신을 다치게 할 만한 물건을 갖고 계세요?'},
    ('금단+정신질환',3):{1: '금단과 정신 건강을 동시에 상담하고 있어요.'},
    ('진전섬망',4):{2: '지금 의사가 필요해요 — 적극적인 진정과 감시가 필요해요.'},
    ('불응성 금단 발작 중첩',0):{1: '발작이 지속되고 있어요 — 프로토콜에 따라 벤조디아제핀을 한 번 더 투여하고 기록하세요.', 2: '발작이 지속되고 있어요 — 프로토콜에 따라 벤조디아제핀은 제가 투여할게요.'},
    ('불응성 금단 발작 중첩',2):{2: '이게 멈추지 않으면 단계를 높여 삽관과 이송을 준비할게요.'},
    ('불응성 금단 발작 중첩',3):{2: '이번이 세 번째 발작이에요 — 오더대로 벤조디아제핀 다음 용량을 투여하고 산소를 대세요.'},
    ('불응성 금단 발작 중첩',5):{2: '발작이 곧 멈추지 않으면 마취과를 불러야 해요.'},
    ('음주력·마지막 음주 문진',2):{2: '설득하려는 게 아니에요 — 그냥 안전하게 봐드리려는 거예요.'},
    ('CIWA 척도 설명',3):{1: '괜찮다고 느끼셔도 자주 물어보러 와요.'},
    ('만취 관찰 환자',2):{2: '괜찮으신지 자주 와서 깨워볼게요.'},
    ('만취 관찰 환자',5):{2: '더 깨실 때까지 십오 분마다 물을 드릴게요.'},
}
WKO={}
WEN={'culture': ['biopsy', 'capture']}
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
