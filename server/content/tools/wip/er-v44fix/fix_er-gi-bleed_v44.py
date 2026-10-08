import yaml
P='/Users/ywyeom/private/forin/server/content/tools/wip/er-v44fix/base-er-gi-bleed.yaml'
C='/Users/ywyeom/private/forin/server/content/tools/changes/er/changes-er-gi-bleed.yaml'
d=yaml.safe_load(open(P)); S=d['situations']; Wl=d['words']; W={w['id']:w for w in Wl}
chg=[]; R='v46 검토 결정 11 예외: '
def ko(n,idx,old_en,old_ko,new_ko,reason,wids):
    s=S[n-1]; t=s['sentences'][idx]; assert t['en']==old_en and t['ko']==old_ko,(t['en'],t['ko'])
    t['ko']=new_ko
    chg.append({'kind':'sentence','situation':s['title'],'index':idx,'fields':['ko'],'why':R+reason})
    for w in wids:
        assert W[w]['exKo']==old_ko,(w,W[w]['exKo']); W[w]['exKo']=new_ko
    return s
ko(16,5,'More blood is on the way for you.','혈액이 오고 있어요.','혈액이 더 오고 있어요.','en의 More가 ko에 빠져 빈칸 정답 More를 ko가 가리지 못함',['w-way'])
ko(5,4,'The needle pinch lasts only a second.','바늘의 따끔함은 단 몇 초만 갑니다.','바늘 따끔함은 잠깐이면 지나가요.','`단 몇 초만 갑니다`가 en `only a second`와 어긋나고 합쇼체라 다른 문장과 말투가 다름',['w-needle','w-second'])
s=ko(18,1,"We're ordering platelets and plasma to help you clot.",'응고를 돕기 위해 혈소판과 혈장을 처방할게요.','응고를 돕기 위해 혈소판과 혈장을 요청할게요.','`처방할게요`는 간호사가 하지 않는 일로 읽힘(en `We\'re ordering` = 팀이 요청)',['w-order','w-platelet','w-plasma'])
sw=[n for n in s['nuance'] if n['kind']=='swap'][0]; assert sw['ko']=='응고를 돕기 위해 혈소판과 혈장을 처방할게요'
sw['ko']='응고를 돕기 위해 혈소판과 혈장을 요청할게요'
l=[x for x in s['order']['lines'] if x['ko'].endswith('처방할게요')]; assert len(l)==1
l[0]['ko']='그 결과 때문에 응고를 돕는 혈소판과 혈장을 요청할게요'
ko(20,4,"You'll be moved to a different room for this procedure.",'이 시술을 위해 다른 병실로 옮겨질 거예요.','이 시술을 위해 다른 방으로 옮겨질 거예요.','다른 병실이 아니라 시술실(IR suite)로 가므로 `병실` 대신 `방`',['w-move'])
yaml.safe_dump(d,open(P,'w'),allow_unicode=True,sort_keys=False,width=10000)
c=yaml.safe_load(open(C)); c['changes'].extend(chg)
yaml.safe_dump(c,open(C,'w'),allow_unicode=True,sort_keys=False,width=10000)
