import yaml, glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
files=sorted(glob.glob(D+'add_er-gi-bleed_v46_*.yaml'))
data=[yaml.safe_load(open(f)) for f in files]
S=[sit for d in data for sit in d]
K={(1,2):["측정 전에 잠시 앉아 쉬세요","혈압 재는 동안 팔을 심장 높이로 두세요"],
(1,5):["소변량을 같이 기록할게요","체온도 같이 잴게요"],
(0,3):["피가 어디서 나오는 것 같나요?","토한 걸 본 분이 있나요?"],
(5,2):["수액부터 놓을게요","내시경 동의서를 먼저 받을게요"],
(7,2):["피검사를 먼저 해 볼게요","대장 사진을 먼저 찍어 볼게요"],
(8,5):["검사 결과는 의사 선생님이 설명할 거예요","치료 후에 식사가 가능한지 알려 드릴게요"],
(13,5):["이 병력은 의사 선생님도 함께 보실 거예요","이 병력은 차트에 기록해 둘게요"],
(14,4):["이 약은 위를 자극할 수 있어요","이 약은 식사와 함께 드시는 게 좋아요"],
(15,3):["지금 맥박을 다시 잴게요","지금 심전도를 붙일게요"],
(17,1):["혈액형 검사를 다시 할게요","혈소판과 혈장 둘 다 검사실에 확인할게요"],
(20,2):["환자분 이름과 생년월일을 확인할게요","환자분 상황을 차트에 먼저 적을게요"],
(9,0):["수혈 전에 혈액형을 확인해요","수혈 동의서에 서명해 주세요"]}
for (si,j),k in K.items(): S[si]['s'][j]['k']=k
for f,d in zip(files,data):
    yaml.safe_dump(d,open(f,'w'),allow_unicode=True,sort_keys=False,width=100000,default_flow_style=None)
