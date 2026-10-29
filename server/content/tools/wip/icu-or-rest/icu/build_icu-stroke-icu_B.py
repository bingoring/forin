import yaml, importlib.util
T="icu-stroke-icu"
D={}
for n in range(1,7):
    sp=importlib.util.spec_from_file_location(f"d{n}",f"data_icu-stroke-icu_B_{n}.py"); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m); D.update(m.D)
base=yaml.safe_load(open(f"base-{T}.yaml",encoding="utf-8"))
assert len(base["situations"])==len(D)==21
for i,sit in enumerate(base["situations"]):
    d=D[i]; assert len(d["s"])==len(sit["sentences"]),i
    for x,r in zip(sit["sentences"],d["s"]):
        tag,icon,why,decoy,d1,d2,ans,w1,w2,w3=r
        x["tag"]=tag;x["icon"]=icon;x["why"]=why;x["decoy"]=decoy
        x["distractorsKo"]=[d1,d2]
        x["blank"]={"answer":ans,"options":[{"en":o} for o in (ans,w1,w2,w3)]}
    o=d["order"]; assert len(o["lines"])==4
    sit["order"]={"tag":"대화 흐름","icon":"compass","ko":o["ko"],"why":o["why"],
      "lines":[{"en":l[0],"icon":l[1],"ko":l[2],"note":l[3]} for l in o["lines"]]}
with open(f"{T}.B.yaml","w",encoding="utf-8") as f:
    yaml.safe_dump(base,f,allow_unicode=True,sort_keys=False,width=1000)
print("wrote")
