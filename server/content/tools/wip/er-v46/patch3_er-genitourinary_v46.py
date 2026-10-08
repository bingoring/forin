import yaml, glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
files=sorted(glob.glob(D+'add_er-genitourinary_v46_*.yaml'))
data={f:yaml.safe_load(open(f)) for f in files}
idx={s['title']:s for f in files for s in data[f]}
def setline(title,start,en,ko,why=None):
    o=idx[title]['order']; hit=0
    for l in o['lines']:
        if l['en'].startswith(start):
            l['en']=en; l['ko']=ko; hit+=1
    assert hit==1,(title,start)
    if why: o['why']=why
setline('배뇨통·빈뇨 문진(UTI)','Thanks.',"Thanks. A urine sample will tell us more about the fever, the pain, and all of that.","감사해요. 소변 검체로 열, 통증, 그 모든 것에 대해 더 알 수 있어요",
 "먼저 시작 시점을 묻고, 그 뒤 얼마나 자주 가는지를 묻고, 그 빈번한 화장실 방문과 함께 온 열·복통을 확인한 뒤, 그 열과 통증까지 소변 검체로 확인하겠다고 마무리해요. 'it began'·'those trips'·'the fever, the pain'이 앞 줄을 가리켜 순서가 하나예요.")
setline('도뇨관 삽입 절차 설명','You handled',"You've handled the slow pace and the pressure well — we're almost done.","천천히 하는 것과 압박감을 잘 견디셨어요, 거의 끝났어요",
 "넣는다고 알리며 무균을 말하고, 그 관 때문에 느낄 압박감을 예고하고, 그 압박감이 불편으로 바뀌면 알리라며 천천히 하겠다고 하고, 그 속도와 압박감을 잘 견뎠다며 끝이 가까움을 알려요. 'it'·'the pressure'·'the slow pace'가 앞 줄을 가리켜 순서가 하나예요.")
setline('요폐(소변 못 봄)','A small catheter',"A small catheter will relieve the fullness I felt there right away.","작은 카테터가 제가 만져 본 그 팽만감을 바로 풀어 줄 거예요",
 "마지막 배뇨 시점을 묻고, 그 뒤 아랫배가 차 있는지 묻고, 찬 곳을 눌러 확인하고, 눌러서 느낀 그 팽만감을 작은 카테터가 풀어 준다고 안내해요. 'since then'·'where it feels full'·'I felt there'가 앞 줄을 가리켜 순서가 하나예요.")
setline('육안적 혈뇨 주소','Thank you.',"Thank you. We'll send your urine to the lab to look at the blood and any clots.","감사해요. 피와 혹시 모를 덩어리를 보도록 소변을 검사실로 보낼게요",
 "붉은 색을 처음 본 때를 묻고, 그 뒤 피가 나오는 양상을 묻고, 그 피가 덩어리로 나왔는지 묻고, 피와 덩어리를 보도록 소변을 검사실로 보낸다고 마무리해요. 'Since then'·'that blood'·'any clots'가 앞 줄을 가리켜 순서가 하나예요.")
setline('고환염전 청소년','This can be',"With all of that, this can be an emergency, so we're arranging an urgent ultrasound and calling the specialist.","그 모든 걸 보면 응급일 수 있어서 긴급 초음파를 준비하고 전문의를 부르고 있어요",
 "통증이 시작된 때를 묻고, 그 뒤로 한쪽인지 양쪽인지 묻고, 그쪽의 붓기와 발적을 확인하고, 그 모든 소견으로 응급일 수 있어 초음파와 전문의를 부른다고 알려요. 'Since it started'·'that side'·'all of that'이 앞 줄을 가리켜 순서가 하나예요.")
for f in files: yaml.safe_dump(data[f],open(f,'w'),allow_unicode=True,sort_keys=False,width=1000)
