import yaml,re,sys,collections
sys.path.insert(0,"/Users/ywyeom/private/forin/server/content/tools")
import verify_lesson_content as v
d=yaml.safe_load(open("icu-gi-bleed.yaml",encoding="utf-8"))
L=lambda t:len(re.sub(r"\s","",t))
S={f"{i}.{j}":x for i,s in enumerate(d["situations"]) for j,x in enumerate(s["sentences"])}
occ=collections.defaultdict(list)
for k,x in S.items():
    ko=x["ko"]; a,b=x["distractorsKo"]
    if L(a)>L(ko) and L(b)>L(ko): print("BOTHLONGER",k,L(ko),L(a),L(b))
    mine=v._ko_stems(ko)
    for n,t in enumerate((a,b)):
        for st in v._ko_stems(t)-mine: occ[st].append(f"{k}.{n}")
cap=lambda s:7 if v._KO_QUESTION_OR_NUMBER.match(s) else 5
print("over:",{s:o for s,o in occ.items() if len(o)>cap(s)})
print("at cap:",sorted((s,len(o)) for s,o in occ.items() if len(o)==cap(s)))
print("결과:",occ.get("결과"))
M=re.compile(r"(려고|[가-힣]면[ ,]|전엔|전에|직전|앞서|이전|후에|직후|이후|나면|마치면|끝나면|부터)")
both=[k for k,x in S.items() if not M.search(x["ko"]+" ") and all(M.search(t+" ") for t in x["distractorsKo"])]
print("shape-only:",both)
dc=collections.Counter(x["decoy"].lower() for x in S.values()); print("decoy dups",[s for s,c in dc.items() if c>1])
bw=collections.Counter(o["en"].lower() for x in S.values() for o in x["blank"]["options"] if o["en"]!=x["blank"]["answer"]); print("blank>=3",[(o,c) for o,c in bw.items() if c>=3])
# 어간 기준 오답 전용 낱말 외 길이 규칙: 전부 V20은 verify가 본다
