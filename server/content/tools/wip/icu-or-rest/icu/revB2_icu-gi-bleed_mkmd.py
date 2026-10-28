import yaml,sys,collections
sys.path.insert(0,".")
import importlib.util as _u; _s=_u.spec_from_file_location("vals","revB2_icu-gi-bleed_vals.py"); _m=_u.module_from_spec(_s); _s.loader.exec_module(_m); KO,BLANK,DECOY,MOVE=_m.KO,_m.BLANK,_m.DECOY,_m.MOVE # KO,BLANK,DECOY,MOVE
d=yaml.safe_load(open("icu-gi-bleed.yaml",encoding="utf-8"))
S={f"{i}.{j}":x for i,s in enumerate(d["situations"]) for j,x in enumerate(s["sentences"])}
by=collections.OrderedDict()
for k,i,v,c,w in KO: by.setdefault(k,[]).append((i,v,c,w))
def group(pred):
    out=[]
    for k,lst in by.items():
        cats="".join(c for _,_,c,_ in lst)
        if pred(cats): out.append(k)
    return out
Sx=group(lambda c:"S" in c); Dx=group(lambda c:"S" not in c and "D" in c); Ox=[k for k in by if k not in Sx and k not in Dx]
def rows(keys):
    o=[]
    for k in keys:
        x=S[k]; o.append(f"- **{k}** 정답 `{x['ko']}`")
        for i,v,c,w in by[k]:
            o.append(f"  - X{i+1} `{x['distractorsKo'][i]}` → **`{v}`** — {w}")
    return "\n".join(o)
out=[]
out.append(f"### A. distractorsKo — 안전(⑥) 실패 {len(Sx)}문장\n"+rows(Sx))
out.append(f"### B. distractorsKo — 정답 둘(④) {len(Dx)}문장\n"+rows(Dx))
out.append(f"### C. distractorsKo — 모양 단서(표지)·틀(①)·문법 {len(Ox)}문장\n"+rows(Ox))
bl=[]
for k,(opts,w) in BLANK.items():
    x=S[k]; ans=x['blank']['answer']; old=[o['en'] for o in x['blank']['options'] if o['en']!=ans]
    if k in MOVE:
        na,no=MOVE[k]; bl.append(f"- **{k}** `{ans}` / {', '.join(old)} — {w}. 새 빈칸 answer `{na}`, options `{na}`·`{'`·`'.join(no)}`")
    else:
        bl.append(f"- **{k}** `{ans}` / {', '.join(old)} → **{', '.join(opts)}** — {w}")
out.append(f"### D. 빈칸 {len(BLANK)}문장 (정답은 그대로, 오답 셋만 — 3문장은 빈칸 자리 옮김)\n"+"\n".join(bl))
dl=["| 문장 | 지금 | 새 decoy | 문장 | 지금 | 새 decoy |","|---|---|---|---|---|---|"]
ks=list(S)
for a in range(0,len(ks),2):
    r=[]
    for k in ks[a:a+2]: r+= [k, S[k]['decoy'], f"`{DECOY[k]}`"]
    while len(r)<6: r+=["","",""]
    dl.append("| "+" | ".join(r)+" |")
out.append(f"### E. decoy — {len(DECOY)}개 전부 교체\n"+"\n".join(dl))
open("_revB2_icu-gi-bleed_lists.md","w").write("\n\n".join(out)+"\n")
print(len(Sx),len(Dx),len(Ox))
