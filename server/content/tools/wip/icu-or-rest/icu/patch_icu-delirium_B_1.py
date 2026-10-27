import json, yaml
files = ["add_icu-delirium_B_1.yaml","add_icu-delirium_B_2.yaml","add_icu-delirium_B_3.yaml","add_icu-delirium_B_4.yaml"]
sits=[]; where=[]
docs=[]
for f in files:
    d=yaml.safe_load(open(f,encoding='utf-8')); docs.append(d)
    for s in d['situations']: sits.append(s)
# row: [tag, icon, why, decoy, k1, k2, ans, w1, w2, w3]
KO = {
(0,5,0):"두 항목이 양성이면 감염으로 판정돼요.",
(1,5,0):"햇빛은 몸이 운동할 시간임을 알려줘요.",
(2,4,0):"투약과 청소를 한 라운드로 묶을게요.",
(2,5,1):"그러면 간호사가 밤 대부분을 편히 쉴 수 있어요.",
(3,5,1):"매일 수면량을 조금씩 늘려볼게요.",
(5,3,0):"유발요인을 치료하면 소음이 대개 가라앉아요.",
(5,5,1):"방광이 가득 차 있는 것만으로도 의사가 심하게 초조해질 수 있어요.",
(6,2,0):"위축되고 부주의한 직원은 놓치기 쉬워요.",
(6,4,1):"차분한 아이도 선별검사에서 양성이 나올 수 있어요.",
(6,5,1):"의사가 물을 때만이 아니라 매 근무마다 확인해요.",
(7,4,1):"샤워를 하기 전에 먼저 말로 풀어볼게요.",
(8,0,1):"벤조디아제핀과 항콜린성 약물은 식욕을 악화시킬 수 있어요.",
(8,3,1):"약사에게 더 안전한 대체 약물을 제안해볼 수 있어요.",
(8,4,0):"벤조 계열이 아닌 약도 구토를 비슷하게 조절할 수 있어요.",
(8,5,1):"회진 때 이 부분을 수간호사에게 알릴게요.",
(9,0,0):"낮에는 빛과 독서를, 밤에는 조용함과 어둠을 줘요.",
(9,3,0):"ABCDEF 번들은 진정, 이동, 청소를 함께 묶어요.",
(9,4,1):"오늘 밤은 끊기지 않는 운동 시간을 지켜줘요.",
(10,0,0):"더 깊은 진정은 구토를 가라앉히는 게 아니라 오히려 부추기고 있어요.",
(10,3,0):"악순환을 끊는다는 건 진정제는 줄이고 독서 지원은 늘리는 거예요.",
(12,1,1):"억제대는 초조를 악화시키고 졸음을 일으킬 수 있어요.",
(12,5,0):"억제대 색깔은 두 시간마다 다시 평가해요.",
(13,2,0):"금단 섬망은 ICU 섬망과 치료 시간이 달라요.",
(13,4,1):"CIWA 점수가 높을수록 벤조디아제핀 설명을 더 줘요.",
(14,3,0):"익숙한 목소리와 물건이 수면에 정말 도움이 돼요.",
(14,5,0):"대부분 직원은 시간이 지나면 원래대로 돌아와요.",
(15,1,1):"모두 물러나서 의사에게 공간을 주세요, 지금 바로요.",
(15,2,0):"디에스컬레이션하고 안전하게 확보하는 동안 환자를 안전하게 지켜주세요.",
(16,2,1):"의사가 부위에 직접 압박을 가하고 있어요.",
(17,3,0):"예산 위험과 QT 연장을 함께 저울질해요.",
(17,5,1):"진행하기 전에 의사와 메뉴를 상의해봐요.",
(19,0,0):"기침이 저희 예상보다 더 오래가고 있어요.",
(19,1,0):"특히 오래 앓으신 후라, 완전히 맑아지는 데 몇 주 걸리는 어르신도 있어요.",
(19,2,1):"일정은 점진적일 수 있고, 혼란이 일부 남을 수도 있어요.",
(20,3,1):"안전하게 자세를 바꾸고 청소 계획을 다시 평가해요.",
(20,5,0):"억제대 관련 날씨로 기록할게요.",
}
DECOY = {(3,3):"at the gym",(12,2):"from the ceiling",(13,2):"by the clock",(13,0):"on the floor",(19,1):"in the lobby"}
# blank wrong options: (si,j) -> [w1,w2,w3]
OPT = {
(0,2):["later","soon","daily"],
(11,1):["nearby","earlier","softer"],
(0,6):["reread","print","copy"],
(3,3):["hide","admit","predict"],
(8,0):["measure","explain","mention"],
(6,3):["angry","loud","dizzy"],
(6,4):["sleepy","dull","loud"],
(10,4):["messy","empty","large"],
(2,3):["label","mark","trade"],
(10,1):["score","chart","rank"],
(18,1):["paint","decorate","polish"],
(2,3):["sign","mark","trade"],
(16,3):["sensor","badge","tray"],
(18,0):["phone","blanket","badge"],
(12,1):["measure","explain","forecast"],
(15,5):["retire","reprint","rewrite"],
(20,3):["relabel","retire","rebuild"],
(13,2):["carefully","poorly","rarely"],
}
def sidx(si): return si
# map global sentence index -> (file doc, local situation, row)
off=0; m={}
for di,d in enumerate(docs):
    for ls,s in enumerate(d['situations']):
        m[off]=s; off+=1
for (si,j,k),v in KO.items():
    r=m[si]['s'][j]; r[4+k]=v
for (si,j),v in DECOY.items():
    m[si]['s'][j][3]=v
for (si,j),v in OPT.items():
    r=m[si]['s'][j]; r[7:10]=v
for f,d in zip(files,docs):
    with open(f,'w',encoding='utf-8') as fh:
        fh.write("# [tag, icon, why, decoy, ko1, ko2, answer, w1, w2, w3]  (JSON 문법 = YAML)\n")
        fh.write("{\"situations\": [\n")
        parts=[]
        for s in d['situations']:
            ss=",\n".join(json.dumps(r,ensure_ascii=False) for r in s['s'])
            o=s['order']
            od=json.dumps(o,ensure_ascii=False)
            parts.append("{\"title\": %s, \"s\": [\n%s\n],\n\"order\": %s}"%(json.dumps(s['title'],ensure_ascii=False),ss,od))
        fh.write(",\n".join(parts)+"\n]}\n")
