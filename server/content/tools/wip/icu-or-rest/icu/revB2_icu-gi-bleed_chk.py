import yaml,re,sys,collections,copy
sys.path.insert(0,"/Users/ywyeom/private/forin/server/content/tools"); sys.path.insert(0,".")
import verify_lesson_content as v
import importlib.util as _u; _s=_u.spec_from_file_location("vals","revB2_icu-gi-bleed_vals.py"); _m=_u.module_from_spec(_s); _s.loader.exec_module(_m); KO,BLANK,DECOY,MOVE=_m.KO,_m.BLANK,_m.DECOY,_m.MOVE # KO,BLANK,DECOY,MOVE
d=yaml.safe_load(open("icu-gi-bleed.yaml",encoding="utf-8"))
L=lambda t:len(re.sub(r"\s","",t))
S={f"{i}.{j}":x for i,s in enumerate(d["situations"]) for j,x in enumerate(s["sentences"])}
new={k:list(x["distractorsKo"]) for k,x in S.items()}
for k,idx,val,cat,why in KO: new[k][idx]=val
bad=0
for k,(a,b) in new.items():
    ko=S[k]["ko"]
    for t in (a,b):
        if L(t)>L(ko)*1.25 and L(t)-L(ko)>3 or L(ko)>L(t)*1.25 and L(ko)-L(t)>3: print("LEN",k,L(ko),L(t),t);bad+=1
    if L(a)>L(ko) and L(b)>L(ko): print("BOTHLONGER",k,L(ko),L(a),L(b));bad+=1
    if a==b or a==ko or b==ko: print("DUP",k)
occ=collections.defaultdict(list)
for k,(a,b) in new.items():
    mine=v._ko_stems(S[k]["ko"])
    for n,t in enumerate((a,b)):
        for st in v._ko_stems(t)-mine: occ[st].append(f"{k}.{n}")
over={s:o for s,o in occ.items() if len(o)>(7 if v._KO_QUESTION_OR_NUMBER.match(s) else 5)}
print("over cap:",{s:o for s,o in over.items()})
print("top:",sorted(((len(o),s) for s,o in occ.items()),reverse=True)[:12])
# decoys
dc=collections.Counter(x.lower() for x in DECOY.values())
for k,x in S.items():
    dd=DECOY[k]; en=x["en"].lower()
    if dd.lower().strip(" ,") in en: print("DECOY in en",k,dd)
    if dd in x["chunks"]: print("DECOY==chunk",k,dd)
print("decoy dups",[s for s,c in dc.items() if c>1], "count",len(DECOY))
# blanks W18
bw=collections.Counter()
for k,x in S.items():
    b=x["blank"]; ans=b["answer"]; opts=[o["en"] for o in b["options"] if o["en"]!=ans]
    if k in BLANK and BLANK[k][0]: opts=BLANK[k][0]
    if k in MOVE:
        ans,opts=MOVE[k]
        if len(re.findall(r'(?<![A-Za-z])'+re.escape(ans)+r'(?![A-Za-z])',x["en"]))!=1: print("MOVE ans not once",k)
    for o in opts: bw[o.lower()]+=1
print("blank opts used >=3:",[(o,c) for o,c in bw.items() if c>=3])
# shape after
M=re.compile(r"(려고|[가-힣]면[ ,]|전엔|전에|직전|앞서|이전|후에|직후|이후|나면|마치면|끝나면|부터)")
both=[k for k,(a,b) in new.items() if not M.search(S[k]["ko"]+" ") and M.search(a+" ") and M.search(b+" ")]
print("shape remaining",len(both),both)
print("bad",bad)
