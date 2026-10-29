import yaml, importlib.util
T="icu-brain-death"
def load(n):
    sp=importlib.util.spec_from_file_location("m"+n,f"data_{T}_B_{n}.py"); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
D=[]
for n in ("1","2","3"): D+=load(n).D
ORD=load("order").ORD
base=yaml.safe_load(open(f"base-{T}.yaml",encoding="utf-8"))
assert len(base["situations"])==len(D)==len(ORD)==21,(len(D),len(ORD))
for i,sit in enumerate(base["situations"]):
    rows=D[i]; assert len(rows)==len(sit["sentences"]),(i,len(rows),len(sit["sentences"]))
    for x,r in zip(sit["sentences"],rows):
        tag,icon,why,decoy,d1,d2,ans,w1,w2,w3=r
        x["tag"]=tag;x["icon"]=icon;x["why"]=why;x["decoy"]=decoy
        x["distractorsKo"]=[d1,d2]
        x["blank"]={"answer":ans,"options":[{"en":o} for o in (ans,w1,w2,w3)]}
    ko,why,lines=ORD[i]; assert len(lines)==4
    sit["order"]={"tag":"대화 흐름","icon":"compass","ko":ko,"why":why,
      "lines":[{"en":l[0],"icon":l[1],"ko":l[2],"note":l[3]} for l in lines]}
with open(f"{T}.B.yaml","w",encoding="utf-8") as f:
    yaml.safe_dump(base,f,allow_unicode=True,sort_keys=False,width=1000)
print("wrote")
