import yaml, glob, sys
D='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
base=yaml.safe_load(open(D+'base-icu-hemodynamics.yaml'))
data={}
for f in sorted(glob.glob(D+'add_icu-hemodynamics_B_*.yaml')):
    for e in yaml.safe_load(open(f)): data[e['s']]=e
# 1차 검사 경고(W18~W20, V20) 반영 — 문장별 덮어쓰기
OV = {
 (0,5): {'wr':["cuff","bottle","pole"], 'dk0':("곧 맥박 수치가 더 정확하게 나올 거예요",None)},
 (1,0): {'dk':["커프 수치와 동맥압 라인을 설명해 볼게요","심박 수치와 동맥압 라인을 비교해 볼게요"]},
 (1,3): {'wr':["gradually","randomly","suddenly"]},
 (2,3): {'dk':["이런 고위험 약물은 항상 세 번 확인해요","이런 고위험 환자는 항상 두 번 확인해요"]},
 (2,4): {'wr':["roughly","partly","lightly"]},
 (4,2): {'dk':["단 하나의 소리보다 추세가 더 중요해요","단 하나의 수치보다 기록이 더 중요해요"]},
 (4,3): {'wr':["rough","later","usual"]},
 (4,5): {'wr':["loosely","vaguely","closely"]},
 (4,6): {'dk':["낮은 수치 하나만으로는 놀랄 일이 아니에요. 속도가 중요하니까요","낮은 수치 하나만으로는 놀랄 일이 아니에요. 시간이 중요하니까요"]},
 (5,1): {'dk':["먼저 올바른 자세에서 라인 영점을 맞출게요","먼저 올바른 높이에서 모니터 영점을 맞출게요"]},
 (12,3): {'dk':["자리가 빨갛거나 가려우면 바로 주입을 멈춰요","자리가 빨갛거나 갈라지면 바로 주입을 멈춰요"]},
 (14,4): {'wr':["stays","shifts","settles"]},
 (5,2): {'dk':["빠른 값을 얻기 위해 날숨 끝에서 측정해요","정확한 값을 얻기 위해 날숨 끝에서 반복해요"]},
 (6,4): {'dk':["약이 잘 듣고 있어서 지금 혈압이 높게 유지되고 있어요","약이 잘 듣고 있어서 지금 소변이 안정적으로 유지되고 있어요"]},
 (6,5): {'dk':["변화가 있을 때마다 계속 보여 드릴게요","소식이 있을 때마다 계속 알려 드릴게요"]},
 (6,6): {'dk':["혈당이 더 떨어지면 빠르게 보조 약물을 추가할게요","혈압이 더 떨어지면 빠르게 보조 인력을 추가할게요"]},
 (7,0): {'dk':["혈압을 보조하려고 약을 두 개 더 추가하고 있어요","혈당을 보조하려고 약을 하나 더 추가하고 있어요"]},
 (7,3): {'wr':["habit","lunch","visit"]},
 (9,0): {'wr':["truly","hardly","mildly"]},
 (10,0): {'dk':["체중이 유지되는 걸 보면서 약을 서서히 줄이고 있어요","혈압이 오르는 걸 보면서 약을 서서히 줄이고 있어요"], 'wr':["tagging","ordering","storing"]},
 (10,1): {'dk':["소변량이 다시 떨어질 경우를 대비해 자세히 지켜볼게요","혈압이 다시 떨어질 경우를 대비해 조용히 지켜볼게요"]},
 (10,4): {'dk':["체중이 떨어지면 바로 다시 올릴 수 있어요","혈압이 흔들리면 바로 다시 올릴 수 있어요"]},
 (10,5): {'wr':["flushing","charting","tagging"]},
 (11,2): {'dk':["다음 두 시간 동안 순환이 좋아지는지 볼게요","다음 한 시간 동안 의식이 좋아지는지 볼게요"]},
 (11,4): {'dk':["이 약을 쓰는 동안 빠른 심박이 있는지 자세히 지켜봐요","이 약을 쓰는 동안 불규칙한 소리가 있는지 자세히 지켜봐요"]},
 (11,6): {'dk':["밤새 심박수와 의식을 계속 확인할게요","밤새 심박수와 리듬을 계속 알릴게요"]},
 (12,0): {'wr':["also","even","mostly"]},
 (12,4): {'dk':["중심정맥로가 확보되면 약물을 위쪽으로 옮길게요","중심정맥로가 확보되면 라벨을 그쪽으로 옮길게요"]},
 (13,1): {'dk':["심박수가 줄어들면 수액에 반응할 가능성이 높아요","맥압변이가 줄어들면 약에 반응할 가능성이 높아요"]},
 (13,5): {'dk':["소변 반응이 거의 없으면 수액을 더 줘도 큰 도움이 안 될 수 있어요","반응이 거의 없으면 약을 더 줘도 큰 도움이 안 될 수 있어요"]},
 (14,2): {'dk':["전환하는 동안 소변을 지켜봐 주세요","청소하는 동안 압력을 지켜봐 주세요"]},
 (14,3): {'wr':["price","brand","color"]},
 (14,6): {'dk':["이 교체 과정 내내 체온이 안정적으로 유지돼요","이 교체 과정 처음에만 압력이 안정적으로 유지돼요"]},
 (15,0): {'dk':["노르에피네프린 최대량에 바소프레신까지 쓰는데도 혈당이 여전히 낮아요","노르에피네프린 최대량에 바소프레신까지 쓰는데도 소변이 여전히 적어요"]},
 (15,1): {'dk':["흔하게 일어나는 원인이 있는지 다시 평가해야 해요","되돌릴 수 있는 원인이 있는지 먼저 평가해야 해요"]},
 (15,3): {'dk':["승압제 두 가지를 최대량까지 써도 통증이 반응하지 않았어요","승압제 세 가지를 최대량까지 써도 압력이 반응하지 않았어요"]},
 (15,5): {'wr':["partial","small","quick"]},
 (16,3): {'wr':["smell","name","size"]},
 (17,1): {'dk':["라인을 세 개 더 주세요. 바로 약물을 다시 시작해야 해요","카트를 하나 더 주세요. 바로 약물을 다시 시작해야 해요"]},
 (17,2): {'wr':["refuse","review","resist"]},
 (17,6): {'dk':["약물이 다시 들어가면 열이 다시 올라올 거예요","약물이 다시 들어가면 혈압이 천천히 올라올 거예요"]},
 (18,4): {'dk':["호흡이 느려지고 있어서 바로 대응해요","리듬이 흔들리고 있어서 바로 대응해요"]},
 (18,5): {'wr':["third","last","next"]},
 (19,5): {'wr':["eager","empty","heavy"]},
}
FALLBACK_DECOY=["on the shelf","by the sink","near the door","on the tray","at the bedside"]
assert sorted(data)==list(range(len(base['situations']))), sorted(data)
for i,s in enumerate(base['situations']):
    e=data[i]; assert len(e['sents'])==len(s['sentences']),i
    for j,(sent,n) in enumerate(zip(s['sentences'],e['sents'])):
        o=OV.get((i,j),{})
        if 'dk' in o: n['dk']=o['dk']
        if 'wr' in o: n['wr']=o['wr']
        opts=[n['ans']]+n['wr']; assert len(opts)==4
        k=(i+j)%4; opts=opts[1:1+k]+[n['ans']]+opts[1+k:]
        sent['tag']=n['tag']; sent['icon']=n['icon']; sent['why']=n['why']; sent['decoy']=n['decoy']
        sent['distractorsKo']=n['dk']
        sent['blank']={'answer':n['ans'],'options':[{'en':o} for o in opts]}
    s['order']=e['order']
import collections
seen=collections.Counter(); fb=iter(FALLBACK_DECOY)
for s_ in base['situations']:
    for x in s_['sentences']:
        seen[x['decoy']]+=1
        if seen[x['decoy']]>3: x['decoy']=next(fb)
yaml.safe_dump(base,open(D+'icu-hemodynamics.B.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
