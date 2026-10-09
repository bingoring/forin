import re,glob,json
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
# (title, idx): dict(a=..., o=[...], k=[...])
P={
('흉부외상 호흡 사정',3):dict(a='hurts',o=['itches','bleeds','swells']),
('통증 척도·부위 청취',4):dict(a='aching',o=['itching','swelling','bleeding']),
('수상기전(MOI) 확보',1):dict(a='fast',o=['far','long','often']),
('수상기전(MOI) 확보',4):dict(a='direction',o=['lane','street','speed']),
('폐좌상 지연성 악화',0):dict(a='arrived',o=['slept','walked','ate']),
('폐좌상 지연성 악화',2):dict(a='earlier',o=['tomorrow','later','tonight']),
('폐좌상 지연성 악화',3):dict(a='closely',o=['rarely','privately','quietly']),
('폐좌상 지연성 악화',5):dict(a='recheck',o=['skip','cancel','forget']),
('비장손상 의심 좌상복부',5):dict(k=['의사 선생님이 곧 오실 거예요','필요한 검사는 의사 선생님이 정해 주실 거예요']),
('간손상 의심 우상복부',1):dict(a='side',o=['leg','arm','foot']),
('간손상 의심 우상복부',2):dict(a='guarding',o=['bleeding','itching','coughing']),
('간손상 의심 우상복부',5):dict(a='close',o=['blind','brief','small']),
('항응고제 흉복부 둔상',2):dict(a='take',o=['miss','skip','forget']),
('항응고제 흉복부 둔상',3):dict(a='worse',o=['better','smaller','lighter']),
('임신부 복부외상',2):dict(a='bright',o=['dark','pale','deep']),
('임신부 복부외상',4):dict(a='baby',o=['cramp','pressure','water']),
('임신부 복부외상',5):dict(a='contractions',o=['bleeding','weight','height']),
('언어장벽 흉복부외상',2):dict(a='mild',o=['normal','calm','simple']),
('흉관 삽입 준비 설명',2):dict(a='numb',o=['shave','mark','measure']),
('흉관 삽입 준비 설명',3):dict(a='feel',o=['hear','taste','smell']),
('흉관 삽입 준비 설명',4):dict(a='pressure',o=['nothing','relief','comfort']),
('긴장성 기흉 감압 위기',5):dict(a='breathe',o=['swallow','sleep','walk']),
('대량 혈흉 순환붕괴',3):dict(a='surgical',o=['nursing','dental','billing']),
('심장탐포네이드 Beck 삼징후',4):dict(a='preparing',o=['refusing','forgetting','declining']),
('복강내 대량출혈 쇼크',2):dict(a='faster',o=['slower','safer','better']),
('연가양 흉부(flail chest)',5):dict(a='easier',o=['harder','tougher','slower']),
('흉복부외상 SBAR 인계',0):dict(a='blunt',o=['penetrating','minor','major']),
('흉복부외상 SBAR 인계',5):dict(a='OR',o=['ICU','CT','ward']),
}
# a,o 가 바뀌는 문장의 blank 가 문장에 한 번만 나오는지는 verify 가 본다
for f in sorted(glob.glob(D+'add_er-chest-abd-trauma_v46_*.yaml')):
    lines=open(f).read().split('\n'); title=None; idx=-1; ch=0
    for n,l in enumerate(lines):
        m=re.match(r'- title: (.*)',l)
        if m: title=m.group(1).strip(); idx=-1; continue
        if l.startswith('  - {t:'):
            idx+=1
            p=P.get((title,idx))
            if p:
                if 'a' in p:
                    l2=re.sub(r'a: "[^"]*", o: \[[^\]]*\]','a: %s, o: %s'%(json.dumps(p['a']),json.dumps(p['o'])),l)
                    assert l2!=l,(title,idx); l=l2
                if 'k' in p:
                    l2=re.sub(r'k: \[[^\]]*\]','k: %s'%json.dumps(p['k'],ensure_ascii=False),l); assert l2!=l; l=l2
                lines[n]=l; ch+=1
    open(f,'w').write('\n'.join(lines))
    print(f.split('/')[-1],ch)
