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
setline('청결채뇨(clean catch) 설명','Once you know',"Knowing those steps, clean the area with the wipe we give you.","그 단계를 아셨으니 드리는 물티슈로 부위를 닦으세요",
 "단계를 먼저 설명하고, 그 단계를 알고 닦고, 닦은 부위로 소변을 받고, 채운 컵을 밀봉해 제출해요. 'those steps'·'the area clean'·'just filled'가 앞 줄을 가리켜 순서가 하나예요.")
setline('요폐(소변 못 봄)','If your bladder',"A small catheter will relieve that fullness right away.","작은 카테터가 그 팽만감을 바로 풀어 줄 거예요",
 "마지막 배뇨 시점을 묻고, 그 뒤 아랫배가 차 있는지 묻고, 찬 곳을 눌러 확인하고, 그 팽만감을 작은 카테터가 풀어 준다고 안내해요. 'since then'·'where it feels full'·'that fullness'가 앞 줄을 가리켜 순서가 하나예요.")
setline('남성 요폐(전립선)','If the scan',"Based on that scan, we'll pass a catheter to relieve the pressure and drain your bladder.","그 스캔 결과에 따라 카테터를 넣어 압박감을 풀고 방광을 비울게요",
 "증상을 묻고, 그 증상이 얼마나 오래됐는지 묻고, 그 병력을 바탕으로 방광 스캔을 안내하고, 그 스캔을 근거로 도뇨한다고 알려요. 'that'·'that history'·'that scan'이 앞 줄을 가리켜 순서가 하나예요.")
setline('결석+구토 탈수',"While you're","Along with those fluids, we'll ask you to strain your urine to catch the stone.","그 수액과 함께 결석을 잡도록 소변을 걸러 달라고 할게요",
 "구토 횟수를 묻고, 그만큼 토한 뒤에도 물을 넘기는지 묻고, 넘기든 아니든 수액과 약을 주겠다고 하고, 그 수액과 함께 소변을 걸러 결석을 잡으라고 해요. 'that much vomiting'·'whatever you can keep down'·'those fluids'가 앞 줄을 가리켜 순서가 하나예요.")
for f in files: yaml.safe_dump(data[f],open(f,'w'),allow_unicode=True,sort_keys=False,width=1000)
