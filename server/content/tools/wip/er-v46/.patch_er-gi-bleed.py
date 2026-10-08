import yaml, glob
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
# (situation index in whole theme, sentence index) -> (answer, options, decoyKo?)
P={
(0,2):("When",["Where","Why","Who"]),
(0,4):("below",["beyond","behind","within"]),
(3,0):("black",["pale","green","yellow"]),
(3,1):("more",["less","very","so"]),
(3,2):("belly",["chest","back","knee"]),
(3,3):("color",["smell","shape","texture"]),
(3,4):("weak",["dizzy","sore","cold"]),
(4,1):("pinch",["burn","bruise","cramp"]),
(4,2):("treat",["scan","test","move"]),
(4,3):("arm",["leg","foot","hip"]),
(4,4):("second",["minute","hour","night"]),
(5,0):("liver",["lung","kidney","heart"]),
(5,1):("when",["where","how","who"]),
(5,3):("alcohol",["coffee","soda","water"]),
(5,5):("inside",["outside","behind","above"]),
(6,2):("start",["stop","skip","avoid"]),
(6,3):("spicy",["bland","cold","salty"]),
(6,4):("stomach",["skin","mouth","leg"]),
(7,0):("blood",["gas","urine","stool"]),
(7,1):("bright",["pale","dull","thin"]),
(7,2):("colonoscopy",["surgery","biopsy","transfusion"]),
(7,3):("stool",["urine","vomit","mucus"]),
(8,0):("last",["first","next","just"]),
(8,1):("day",["week","month","year"]),
(8,3):("dose",["brand","schedule","pharmacy"]),
(8,5):("after",["before","during","without"]),
(9,1):("Tell",["Ask","Text","Show"]),
(9,4):("immediately",["tomorrow","eventually","sometime"]),
(10,0):("before",["after","while","since"]),
(10,2):("alcohol",["coffee","water","juice"]),
(10,3):("first",["last","second","next"]),
(10,4):("blood",["food","bile","mucus"]),
(10,5):("usually",["never","hardly","seldom"]),
(11,4):("hurt",["sick","scared","lost"]),
(12,3):("beliefs",["allergies","symptoms","insurance"]),
(13,0):("endoscopy",["surgery","scan","biopsy"]),
(13,1):("treated",["tested","removed","repaired"]),
(13,2):("bleeding",["pain","vomiting","dizziness"]),
(13,4):("cause",["plan","risk","cost"]),
(14,0):("heart",["stomach","pain","sleep"]),
(14,3):("long",["often","much","many"]),
(15,1):("fluids",["pills","oxygen","food"]),
(15,3):("fast",["slow","weak","uneven"]),
(15,4):("quickly",["slowly","later","gently"]),
(17,0):("bleeding",["breathing","sleeping","eating"]),
(17,1):("platelets",["antibiotics","vitamins","oxygen"]),
(17,2):("labs",["x-rays","meals","visitors"]),
(17,4):("should",["could","would","might"]),
(17,5):("labs",["x-rays","vitals","meds"]),
(18,1):("fluids",["oxygen","medicine","pills"]),
(19,2):("next",["previous","same","old"]),
(20,0):("tonight",["today","yesterday","lately"]),
(20,1):("doctor",["pharmacist","manager","chaplain"]),
(20,2):("clearly",["slowly","badly","quietly"]),
(20,3):("blood",["urine","vomit","stool"]),
(20,4):("tonight",["today","tomorrow","yesterday"]),
(20,5):("doctor",["family","chaplain","visitor"]),
}
# distractorsKo / why 고치기
DK={
(4,2):["이렇게 하면 대기 시간이 줄어요","이렇게 하면 팔을 편하게 두실 수 있어요"],
(5,5):["의사 선생님이 위에 넣을 관을 설명해 드릴 거예요","의사 선생님이 검사 결과를 보여 줄 거예요"],
(9,2):["수혈하는 동안 팔에 힘을 빼 주세요","수혈하는 동안 불을 조금 낮춰 둘게요"],
(11,1):["침대에서 나오시기 전에 신발을 신으세요","침대에서 나오시면 제가 옆에서 부축할게요"],
(11,4):["다시 쓰러지지 않게 수액을 더 드릴게요","넘어진 곳을 사진으로 남길게요"],
(19,3):["이 시술 뒤에는 한동안 누워 계셔야 해요","이 시술로 배 속의 염증을 줄일 거예요"],
}
# 문장 순서 인덱스: 파일 내 상황 순서 = base 상황 순서
sits=[]
files=sorted(glob.glob(D+'add_er-gi-bleed_v46_*.yaml'))
data=[yaml.safe_load(open(f)) for f in files]
n=0
for f,d in zip(files,data):
    for sit in d:
        for j,s in enumerate(sit['s']):
            k=(n,j)
            if k in P: s['a'],s['o']=P[k][0],list(P[k][1])
            if k in DK: s['k']=DK[k]
        n+=1
# order line fixes
OL={
 (1,3):("en","We'll compare those numbers and your symptoms to estimate how much blood you've lost."),
 (8,2):("en","With that dose and your bleeding, we'll give vitamin K to help reverse the effect."),
 (9,3):("en","You can help: tell me right away if you feel chills, itching, or trouble breathing."),
}
n=0
for d in data:
    for sit in d:
        for (si,li),(k,v) in OL.items():
            if si==n: sit['order']['lines'][li][k]=v
        n+=1
# sit3 s0 dup set check handled by new options
for f,d in zip(files,data):
    yaml.safe_dump(d,open(f,'w'),allow_unicode=True,sort_keys=False,width=100000,default_flow_style=None)
print('patched',n)
